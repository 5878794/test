/**
 * author: bens
 * email： 5878794@qq.com
 * Date: 13-3-19
 * Time: 下午7:55
 *
 *
 *
 *
 * 滚动条插件，只支持纵向滚动。由于动态加载数据，滚动条位置不是很精确。支持原生滚动和变形滚动
 * 主要解决纵向滚动数据量太大的问题，横向滚动使用iscroll插件。
 * 加载时不需要将子对象添加到需要滑动的div，程序会根据传入的childrens自动加载并显示数据。
 * 增加、删除、修改子对象需要操作传入的对象集： obj.childrens  然后 obj.refresh(); 底部ajax加载有专门的方法。
 *
 * 注意：obj最好不要有padding、margin、border  否则moveToObj需要使用修正值。
 *      修正值 = padding + margin + border （未验证）
 *      obj及内部不要添加改变计算高度的css:  -webkit-box-sizing: border-box;
 *
 * 需要挂载
 * jq.mobi
 * jq.extend
 * bens
 * plug/device
 *
 * 参数
 * id
 * data = {}
 *
 * must param================================================================
 * @param id ：str                           主obj  id
 * ==========================================================================
 * @param fixedButton:str(eg:"20px",需要带单位)如需要底部加载ajax需要设置此值，为滚动窗口距离屏幕底部的距离
 * @param slideTriggerLength：number         触发长滑的距离，默认20
 * @param slideLength：number                长滑的距离，默认600
 * @param outRangeLength ：number            超出后可滑动的距离，默认100
 * @param showScroll ：boole                 是否显示滚动条，默认true
 * @param moveStartFn:fn                     移动开始前执行  call进来的
 * @param movingFn:fn                        移动中执行     call进来的
 * @param moveEndFn:fn                       移动结束后执行  call进来的
 * @param oldObj：obj                         call函数的原始环境对象
 *
 * function=================================================================
 * @fn  refresh()                            刷新，位置不精确
 * @fn  reload()                             重载，滚动回到顶点
 * @fn  moveToObj()                          移动到某个对象  TODO

 * @fn  destroy()                            移除，会清空子对象
 */



(function(){
    var device = bens.require("device"),
        canvas = bens.require("__loading_canvas"),
        nextFrame = device.nextFrame,
        cancelFrame = device.cancelFrame;

    var scroll = function(id,data){
        this.id = id;          //id方式传入
        this.slideTriggerLength = 20;    //触发长滑的距离
        this.slideLength = 400;   //长滑距离
        this.outRangeLength= device.outRangeLength; //超出后还可以滚动的距离
        this.showScroll = true;   //是否显示滚动条
        this.movingFn = null;       //移动中执行
        this.moveStartFn = null;    //按下时执行
        this.moveEndFn = null;      //放开时执行
        this.oldObj = null;                 //call函数的原始环境对象
        //===============================================
        for(var key in data){
            this[key] = data[key];
        }

        this.slideTriggerLength = parseInt(this.slideTriggerLength);
        this.slideLength = parseInt(this.slideLength);
        this.outRangeLength = parseInt(this.outRangeLength);



        if(!this.id){console.log("not found scroll id or obj");return;}

        this.hasTransform = device.hasTransform;
        //this.has3d = device.has3d;     //是否有3d

        this.outRangeLength=Math.abs(parseInt(this.outRangeLength));





        //=================================================
        this.useScrollTo = true;
        this.obj = null;                //滑动窗口

        this.win = $("#"+this.id);
        this.winobj = this.win.get(0);
        this.obj = $(this.win.children().get(0));

        this.scrollObjY = null;     //滚动条  y


        //scroll style image
        this.scrollimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAkElEQVR42qWSMQrAIAxFMzp5AmcXN0cnLyFdu/cC0qkXF+uXFEJpkdrhgZg8TGKo1koC1TAN1wiM4zslc6VkG3GAvYtdKqXEnPPivd+01jvAGXeISfkqr0sppZWIjicQE7Iirr+/9CZdIIdFQ9x8REkjETksOuLJRfQzEpHDYvglTpc6PZzp75hegF8r93nJT3VMkbDTjbHKAAAAAElFTkSuQmCC";

        this.winWidth = null;     //窗口大小
        this.winHeight = null;
        this.objHeight = null;

        this.minScrollTop = null;
        this.maxScrollTop = null;  //最大滑动高度
        this.canScrollMaxY = null;

        this.scrollTop = 0;         //当前滚动值
        this.touchPoint = [];       //点记录对象

        this.animate = null;

        this.showScrollerY = true;
        this.scrollerLength = null;             //滚动条长度
        this.minScrollerLength = 30;
        this.maxScrollerLength = parseInt(this.win.height());
        this.minScrollerTop = 0;                //滚动条最大最小滚动位置
        this.maxScrollerTop = 0;


        this.touchStart = null;
        this.touchMove = null;
        this.touchEnd = null;

        this.isTouchStart = false;
        this.objMoveing = false;

        this.touchStartTime = null;

        this.init();
    };
    scroll.prototype = {
        //入口
        init:function(){
            //设置元素样式
            this.cssObj();

            //事件绑定
            this.eventBind();
            //创建滚动条
            if(this.showScroll){
                this.addScroll();
            }

            //刷新参数
            this.autorefresh();
            //滑到起始点
            this.moveTo(this.outRangeLength);

        },
        //设置css
        cssObj:function(){
            if(this.showScroll){
                var temp_css = this.win.css("position");
                if(temp_css == "relative" || temp_css == "absolute"){
                    this.win.css({
                        overflow:"hidden"
                    });
                }else{
                    this.win.css({
                        position:"relative",
                        overflow:"hidden"
                    });
                }

                this.obj.css({
                    padding:this.outRangeLength+"px 0"
                })
            }
        },

        //事件绑定
        eventBind:function(){
            var _this = this;
            this.winobj.addEventListener(device.START_EV,_this.touchStart = function(e){_this.touchStartHandler(e);},false);
            this.winobj.addEventListener(device.MOVE_EV,_this.touchMove = function(e){_this.touchMoveHandler(e);},false);
            this.winobj.addEventListener(device.END_EV,_this.touchEnd = function(e){_this.touchEndHandler(e);},false);
        },
        //加滚动条
        addScroll:function(){
            var div = document.createElement("div");

            div.style.cssText = device.box_sizing+":border-box;"+device.cssVendor+"border-image:url("+this.scrollimg+") 6 6 6 6";
            div.style.cssText += "position:absolute;z-index:3;right:0;top:0;width:1px;height:15px;display:block;";
            if(device.isWindows){
                div.style.cssText += "background:rgba(30,30,30,0.7);width:4px;"+device.border_radius+":4px;";
            }

            this.win.append(div);
            this.scrollObjY= $(div);
        },

        //刷新参数
        autorefresh:function(){
            this.winWidth = parseInt(this.win.width());     //窗口大小
            this.winHeight = parseInt(this.win.height());

            this.objHeight = parseInt(this.obj.height()) ;

            this.minScrollTop = this.outRangeLength;

            //最大滑动高度
            if(this.objHeight > this.winHeight){
                this.maxScrollTop = this.objHeight - this.winHeight + this.outRangeLength;
                this.canScrollMaxY = this.maxScrollTop + this.outRangeLength;
            }else{
                this.maxScrollTop = this.outRangeLength;
                if(this.winHeight-this.objHeight>this.outRangeLength){
                    this.canScrollMaxY = this.outRangeLength;
                }else{
                    this.canScrollMaxY = this.outRangeLength*2 - this.winHeight+this.objHeight;
                }

            }

            this.maxScrollerLength = this.winHeight;

            //滚动条刷新
            this.scrollerRefreshs();
        },
        //滚动条刷新
        scrollerRefreshs:function(){
            //scroller
            if(this.showScroll){
                var objheight = this.objHeight;   //obj真实高度

                if(objheight>this.winHeight){
                    //use scroller and show
                    this.showScrollerY=true;

                    this.scrollerLength=parseInt(this.winHeight*this.winHeight/objheight);
                    this.scrollerLength = (this.scrollerLength<this.minScrollerLength) ? this.minScrollerLength  : this.scrollerLength ;
                    this.scrollerLength = (this.scrollerLength>this.maxScrollerLength) ? this.maxScrollerLength  : this.scrollerLength ;

                    this.maxScrollerTop=this.winHeight - this.scrollerLength ;

                    this.scrollObjY.css({
                        display:"block",
                        height:this.scrollerLength+"px"
                    });

                    this.scrollerTo();
                }else{
                    //hiden scroller
                    this.showScrollerY=false;
                    this.scrollObjY.css({display:"none"});
                }
            }
        },


        //内部刷新
        f5:function(){
            this.touchPoint = [];
            this.stopAnimate();
        },
        //滚动条滚动
        scrollerTo:function(){
            if(this.showScroll && this.showScrollerY){
                var temptop= (this.scrollTop-this.outRangeLength > 0 ) ? this.scrollTop-this.outRangeLength : 0,
                    objheight = this.objHeight,
                    scroll_top=Math.abs(parseInt(this.maxScrollerTop*temptop/(objheight-this.winHeight)));

                scroll_top = (scroll_top<this.minScrollerTop)? this.minScrollerTop : scroll_top;
                scroll_top = (scroll_top>this.maxScrollerTop)? this.maxScrollerTop : scroll_top;

                if(this.useScrollTo){
                    scroll_top = scroll_top + this.scrollTop  ;
                }

                this._scrolerGoTo(scroll_top);
            }
        },
        //滚动到
        moveTo:function(y){

            this.scrollTop = y;

            this._goto(y);

            this.scrollerTo();

            var _this = this;

            if(this.movingFn){
                this.movingFn.call(_this);
            }

        },
        //gogogo
        _goto:function(y){
            this.winobj.scrollTop = y;
//            this.win.css({top:-y+"px"});
        },
        _scrolerGoTo:function(y){
            //if(this.hasTransform){
              //  this.scrollObjY.get(0).style.cssText += device.transform+":"+device.css_s+"0,"+ y+"px"+device.css_e;
           // }else{
                this.scrollObjY.css({
                    top:y+"px"
                });
            //}
        },
        //长滑动到
        animateTo:function(s,e,t){
            var startTime = (new Date()).getTime(),
                _this=this,newY,easeOut;
            //var doit = -1;

            var animate=function() {
                /*
                    doit ++;
                    if(doit%6 == 0){_this.animate=nextFrame(animate);return;}
                */

                var timestamp = (new Date()).getTime();
                var progress = timestamp - startTime;

                if (progress >= t) {
                    //go to  finish pos
                    _this.moveTo(e);
                    _this.objMoveing = false;
                    setTimeout(function(){
                        _this.stopAnimate();
                        _this.autoBackScroll();
                    },0);
                    return;
                }

                timestamp = (timestamp - startTime) / t - 1;
                easeOut = Math.sqrt(1 - timestamp * timestamp);
                newY = (e - s) * easeOut + s;



                _this.moveTo(newY);



                _this.animate=nextFrame(animate);

            };
            animate();
        },
        //停止动画
        stopAnimate:function(){
            if(this.animate){
                cancelFrame(this.animate);
                this.animate=null;
                this.isTouchStart = false;
            }
        },
        //点击开始
        touchStartHandler:function(e){
            //e.preventDefault();

            this.isTouchStart = true;
            if(this.objMoveing){e.stopPropagation();}
            this.f5();
            this.touchStartTime = new Date().getTime();
            this.savePoint(e);

            var _this = this;

            if(this.moveStartFn){
                this.moveStartFn.call(_this);
            }

        },
        //移动
        touchMoveHandler:function(e){
            if(!this.isTouchStart){return;}
            this.objMoveing = true;

            e.preventDefault();

            //记录当前点
            this.savePoint(e);

            var pathLength=this.touchPoint.length,
                startPoint=this.touchPoint[pathLength-2],
                endPoint=this.touchPoint[pathLength-1];


            //y moveing
            var y = this.scrollTop+startPoint.y-endPoint.y;
            y = ( y <= 0 )? 0 : y;
            y = ( y >= this.canScrollMaxY )? this.canScrollMaxY : y ;

            this.moveTo(y);
        },
        //结束
        touchEndHandler:function(e){
            e.preventDefault();
            this.isTouchStart = false;



            if(this.touchPoint.length == 1){
                this.autoBackScroll();
                return;
            }
            var endtime = new Date().getTime();

            var pathLength=this.touchPoint.length,
                //startPoint=this.touchPoint[pathLength-2],
                startPoint=this.touchPoint[0],
                endPoint=this.touchPoint[pathLength-1];

            // y path
            var pathYLength=startPoint.y-endPoint.y;

            //是否长滑
            if(Math.abs(pathYLength) >= this.slideTriggerLength && endtime - this.touchStartTime <300 ){
                //进入长滑
                this.longSlide(pathYLength);
            }else{
                //事件结束。。。
                //判断是否回滚
                this.autoBackScroll();

            }
        },
        //长滑
        longSlide:function(l){
            var t_slideLength = (l>0) ? this.slideLength : -this.slideLength,
                scrollStart=this.scrollTop,
                scrollEnd=this.scrollTop+t_slideLength,
                scrolltime = (this.slideLength<500)? 500 : this.slideLength;


            scrollEnd = ( scrollEnd <= 0 )? 0 : scrollEnd;
            scrollEnd = ( scrollEnd >= this.canScrollMaxY )? this.canScrollMaxY : scrollEnd ;


            if(Math.abs(scrollEnd - scrollStart) != this.slideLength ){
                scrolltime = Math.abs(scrollEnd - scrollStart);
            }

            //移动
            this.animateTo(scrollStart,scrollEnd,scrolltime);
        },
        //保存点
        savePoint:function(e){
            var touch;
            if(device.hasTouch){
                touch=e.touches[0];
            }else{
                touch=e;
            }

            this.touchPoint.push({x:touch.pageX,y:touch.pageY});
        },
        //自动回滚
        autoBackScroll:function(){
            this.objMoveing = false;
            var time = null;

            if(this.scrollTop == this.outRangeLength ){return;}

            /*
            if(!this.showScrollerY){
                time =this.scrollTop * 5;
                this.objMoveing = true;
                this.animateTo(this.scrollTop,this.outRangeLength,time);
                return;
            }
*/

            if(this.scrollTop > this.maxScrollTop){
                time = (this.scrollTop - this.maxScrollTop) * 5;
                this.objMoveing = true;
                this.animateTo(this.scrollTop,this.maxScrollTop,time);
                return;
            }

            if(this.scrollTop < this.minScrollTop){
                time = (this.minScrollTop - this.scrollTop) * 5;
                this.objMoveing = true;
                this.animateTo(this.scrollTop,this.minScrollTop,time);
                return;
            }

            var _this = this;
            if(_this.moveEndFn){
                _this.moveEndFn.call(_this);
            }

        },



        //刷新
        refresh:function(){
            //子元素长度  是否自动隐藏

            this.autorefresh();
            this.moveTo(this.scrollTop);
            this.autoBackScroll();

        },
        //重载
        reload:function(){
            this.autorefresh();
            this.moveTo(this.outRangeLength);
        },
        //移动到  //TODO
        moveToObj:function(obj,xz){

        },
        //销毁
        destroy:function(){
            this.f5();

            this.winobj.removeEventListener(device.START_EV,this.touchStart,false);
            this.winobj.removeEventListener(device.MOVE_EV,this.touchMove,false);
            this.winobj.removeEventListener(device.END_EV,this.touchEnd,false);

            this.obj.html("");
            this.scrollObjY.remove();
        }
    };


    return scroll;

})();