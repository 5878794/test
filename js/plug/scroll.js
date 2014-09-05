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
 * data = {}
 *
 * must param================================================================
 * @param id ：str                           主obj  id
 * @param obj:obj                            主obj对象    id和obj必须有一个
 * @param childrens:[obj] array             子元素对象数组，数组中对象为js原生对象
 * ==========================================================================
 * @param fixedButton:str(eg:"20px",需要带单位)如需要底部加载ajax需要设置此值，为滚动窗口距离屏幕底部的距离
 * @param useScrollTo：boole                 是否使用scrollto方式滚动（有输入框最好用这个）
 * @param slideTriggerLength：number         触发长滑的距离，默认20
 * @param slideLength：number                长滑的距离，默认600
 * @param outRangeLength ：number            超出后可滑动的距离，默认100
 * @param showScroll ：boole                 是否显示滚动条，默认true
 * @param showNumber：number                 每次加载的子元素数量，默认30
 * @param moveStartFn:fn                     移动开始前执行  call进来的
 * @param movingFn:fn                        移动中执行     call进来的
 * @param moveEndFn:fn                       移动结束后执行  call进来的
 * @param oldObj：obj                         call函数的原始环境对象
 * @param ajaxFn:fn                           ajax的执行函数
 * @param bottomLoad:boole                   是否底部加载
 *
 * function=================================================================
 * @fn  refresh()                            刷新，位置不精确
 * @fn  reload()                             重载，滚动回到顶点
 * @fn  moveToObj(obj,xz)                    移动到某个对象
 *      @param obj :obj为js原生对象
 *      @param xz : number 主div有margin或padding或border时需要使用此参数修正
 * @fn  destroy()                            移除，会清空子对象
 * @fn  ajaxSuccess(obj)                      ajax成功调用后执行（底部动态加载）
 *      @param obj:array                      ajax请求回来的数据生成的dom数组（新增加的），类似childrens
 * @fn  ajaxError()                           ajax失败调用后执行（底部动态加载）
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * a= new scrollfn({
                id:"main",
                childrens:data,
                fixedButton:"0px",
                bottomLoad:true,
                ajaxFn:function(){
                    setTimeout(function(){
                        var neew = [];
                        for(var i= 0,l=10;i<l;i++){
                            var obj = clone.clone().text(i+"add").css({display:"block"}).get(0);
                            neew.push(obj);
                        }
                        a.ajaxSuccess(neew);
                    },5000)
                }
            });
 *
 *
 */



(function(){
    var device = bens.require("device"),
        canvas = bens.require("__loading_canvas"),
        nextFrame = device.nextFrame,
        cancelFrame = device.cancelFrame;

    var scroll = function(data){
        this.id = data.id;          //id方式传入
        this.c_obj = data.obj;      //obj方式传入
        this.slideTriggerLength = 20;    //触发长滑的距离
        this.slideLength = 400;   //长滑距离
        this.outRangeLength= device.outRangeLength; //超出后还可以滚动的距离
        this.showScroll = true;   //是否显示滚动条
        this.showNumber = 30 ;   //一次加载50条
        this.childrens = [];   //子对象数组
        this.movingFn = null;       //移动中执行
        this.moveStartFn = null;    //按下时执行
        this.moveEndFn = null;      //放开时执行
        this.oldObj = null;                 //call函数的原始环境对象
        this.bottomLoad = false;     //底部加载
        this.ajaxFn = null;         //ajax的执行函数
        this.fixedButton = 0;       //使用scrollto模式的时候，如需要底部加载ajax需要设置此值，为滚动窗口距离屏幕底部的巨鹿
        this.useScrollTo = false;   //使用系统scrolltop=value的方式滚动
        //===============================================
        for(var key in data){
            this[key] = data[key];
        }

        this.slideTriggerLength = parseInt(this.slideTriggerLength);
        this.slideLength = parseInt(this.slideLength);
        this.outRangeLength = parseInt(this.outRangeLength);
        this.showNumber = parseInt(this.showNumber);


        if(!this.id && !this.c_obj){console.log("not found scroll id or obj");return;}
        if(!$.isArray(this.childrens)){console.log("childrens is not array");return;}

        this.hasTransform = device.hasTransform;
        //this.has3d = device.has3d;     //是否有3d
        this.autoShowHiden = true ;  //自动显示隐藏

        this.outRangeLength=Math.abs(parseInt(this.outRangeLength));

        this.bottomLoad = ($.isBoolean(this.bottomLoad)) ? this.bottomLoad : false;

        //如果有底部拉动加载 固定超出可滑动距离为100
        if(this.bottomLoad){
            this.outRangeLength = 100;
        }



        //android 3 和  android4.0强制使用scrollto方式滚动  （浏览器 版本?????）
        if(device.isAndroid){
            if(parseInt(device.androidVer) == 3 || device.android == 4.0){
                this.useScrollTo = true;
            }
        }else if(device.isWindows){
            this.useScrollTo = true;
        }



        //=================================================

        this.obj = null;                //滑动窗口

        if(this.id){
            this.win = $("#"+this.id);    //对象父级窗口
        }else{
            if($.is$(this.c_obj)){  //判断是否是jq对象
                this.win = this.c_obj;
            }else{
                this.win = $(this.c_obj);
            }
        }

        this.winobj = this.win.get(0);

        this.scrollObjY = null;     //滚动条  y

        this.bottomLoadObj = null;   //底部加载div obj
        this.jt = null;             //底部加载div中的图片 obj
        this.txt = null;            //底部加载div中的文字 obj
        this.isTouching = false;    //手指是否按下

        this.ajaxObj = null;        //显示ajax load的div
        this.loadObj = null;        //load圈圈对象


        this.showBottom = false;        //是否加载了底部div
        this.showBottomIsUp = true;     //箭头是否朝上
        this.startLoading = false;      //释放时判断是否为true  开始加载ajax
        this.ajaxing = false;           //是否在ajax请求中

        //scroll style image
        this.scrollimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAkElEQVR42qWSMQrAIAxFMzp5AmcXN0cnLyFdu/cC0qkXF+uXFEJpkdrhgZg8TGKo1koC1TAN1wiM4zslc6VkG3GAvYtdKqXEnPPivd+01jvAGXeISfkqr0sppZWIjicQE7Iirr+/9CZdIIdFQ9x8REkjETksOuLJRfQzEpHDYvglTpc6PZzp75hegF8r93nJT3VMkbDTjbHKAAAAAElFTkSuQmCC";
        this.jtimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAABBCAYAAACuG5a4AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAADVSURBVHja7NhBEoMgEERRv5X734pzmb2VRIkCM/JZu3i2DQKUUpbKsS3tBmcfXJekIy381fJzmrjwpB13ObTjruMmblVcDu24cOHChQsXLly4cOHChVedObdAnm2KqpDQzVp7LeDkvJD2Hk4W9KfEyYD+VhXseKO0f8GJjD5KnKjoM1UhIvrxu0OipV2TOJHQtVUhCnqqExAR0v43cUajr1SFkehpT/mMSvuOxBn14uug1BhZlUccJOg8N25NnF7oFlWh14/L29qDZMkA30ObbMzeAgwAWQ4IB37CgPkAAAAASUVORK5CYII=";

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

        this.chlidrenLength = this.childrens.length;     //子对象个数


        this.loadUp = null;         //顶部加载点
        this.loadDown = null;       //底部加载点
        this.sDom = null;              //显示的第一个dom在数组中的位置
        this.eDom = null ;              //显示的最后一个dom在数组中的位置
        this.xzHeight = 0;          //修正高度
        this.isGoTo = false;        //是跳转
        this.tempxz = 0;            //临时修正位置
        this.temp_end = false;      //临时停止
        this.moveOrientation = null;  //移动方向

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
            //创建包裹div
            this.createMainDiv();

            //创建底部拉动加载层
            if(this.bottomLoad){
                this.createButtonLoadObj();
                this.createButtonAjax();
            }

            this.autoShowHiden = (this.showNumber*3 < this.chlidrenLength);

            //事件绑定
            this.eventBind();
            //创建滚动条
            if(this.showScroll){
                this.addScroll();
            }

            //是否启用自动隐藏元素
            if(this.autoShowHiden){
                //预先加载前3段
                this.sDom = 0;
                this.eDom = this.showNumber*3-1;
            }else{
                this.sDom = 0;              //显示的第一个dom在数组中的位置
                this.eDom = this.chlidrenLength -1 ;
            }
            this.showHideChildrenFT(this.sDom,this.eDom,"block");


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
            }
        },
        //创建包裹div
        createMainDiv:function(){
            var div = document.createElement("div");
            div.style.cssText = "width:100%;padding-top:"+this.outRangeLength+"px;padding-bottom:"+this.outRangeLength+"px;";

            this.win.append(div);
            this.obj = $(div);

            if(!this.useScrollTo){
                if(this.hasTransform){
                    div.style[device._transitionProperty] = device.transform;
                    div.style[device._transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
                    div.style[device.transform] = device.css_s + "0,0" + device.css_e;

                }else{
                    div.style[device._transitionProperty] = "top left";
                    div.style.cssText += "position:absolute;top:0;left:0";
                }

                div.style[device._transitionDuration] = '0';
                div.style[device._transformOrigin] = '0 0';
            }


        },
        //创建底部拉动刷新ui层
        createButtonLoadObj:function(){
            var div = document.createElement("div"),
                imgdiv = document.createElement("div"),
                textdiv = document.createElement("div");

            if(!this.useScrollTo){
                div.style.cssText = "width:100%; height:100px; position: absolute;left:0; bottom:0; display:none; "+device.box_align+":center; "+device.box_pack+":center; "+device.box_orient+":horizontal;";
            }else{
                div.style.cssText = "width:100%; height:100px; position: absolute;left:0; top:0; display:none; "+device.box_align+":center; "+device.box_pack+":center; "+device.box_orient+":horizontal;";
            }
            imgdiv.style.cssText = "width:23px;height:33px; background:url("+this.jtimg+"); "+device.background_size+":100%; "+device.transform+":rotate(-180deg) translateZ(0); ";

            $(textdiv).text("向上拖动加载").css({"margin-left":"20px",width:"130px",height:"100px;","line-height":"100px"});
            $(div).append(imgdiv).append(textdiv);


            this.obj.append(div);
            this.bottomLoadObj = div;
            this.txt = textdiv;
            this.jt = imgdiv;
        },
        //显示底部拉动加载
        showBottomObj:function(){
            if(!this.bottomLoad){return;}
            if(this.ajaxing){return;}

            //显示
            var maxy = this.maxScrollTop,
                nowy = this.scrollTop;

            if(!this.showBottom && nowy >= maxy){
                this.showBottom = true;
                if(!this.useScrollTo){
                    this.bottomLoadObj.style.cssText += "display:"+device.box+";";
                }else{
                    var temp_top = this.maxScrollTop + this.winHeight;
                    this.bottomLoadObj.style.cssText += "display:"+device.box+";top:"+temp_top+"px;";
                }
            }

            if(this.showBottomIsUp && nowy >= maxy && nowy<= maxy + 80 ){
                //朝下
                this.showBottomIsUp = false;
                this.startLoading = false;
                $(this.txt).text("向上拖动加载");
                var temp_a = {};
                temp_a[device.transform] = "rotate(-180deg) translateZ(0)";
                $(this.jt).cssAnimate(temp_a,250);
            }
            if(!this.showBottomIsUp && this.isTouching && nowy >= maxy + 80 && nowy <= maxy + 100){
                //朝下
                this.showBottomIsUp = true;
                this.startLoading = true;
                $(this.txt).text("释放开始加载");
                var temp_b = {};
                temp_b[device.transform] = "rotate(0deg) translateZ(0)";
                $(this.jt).cssAnimate(temp_b,250);
            }

        },
        //隐藏底部拉动加载
        hideBottomObj:function(){
            this.showBottom = false;
            this.bottomLoadObj.style.cssText += "display:none";
        },
        //创建底部ajax loading
        createButtonAjax:function(){
            var div = document.createElement("div"),
                imgdiv = document.createElement("div"),
                textdiv = document.createElement("div"),
                cv;

            div.style.cssText = "width:100%; height:40px; position: fixed;left:0; bottom:"+this.fixedButton+"; display:none; "+device.box_align+":center; "+device.box_pack+":center; "+device.box_orient+":horizontal; background:rgba(0,0,0,0.5);";
            imgdiv.style.cssText = "width:30px;height:30px;";
            cv = new canvas({obj:imgdiv});

            $(textdiv).text("数据加载中").css({"margin-left":"20px",width:"130px",height:"30px;","line-height":"30px"});
            $(div).append(imgdiv).append(textdiv);


            this.win.append(div);
            this.ajaxObj = div;
            this.loadObj = cv;
        },
        //显示底部ajax loading
        showBottomAjaxObj:function(){
            this.ajaxObj.style.cssText += "display:"+device.box+";";
            this.loadObj.run();
        },
        //隐藏底部ajax loading
        hideAjaxLoading:function(){
            this.loadObj.stop();
            this.ajaxObj.style.cssText += "display:none";
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
        //刷新参数
        autorefresh:function(state){
            if(!state){
                this.f5();
            }

            if(this.autoShowHiden){
                this.getLoadPoint();
            }

            this.winWidth = parseInt(this.win.width());     //窗口大小
            this.winHeight = parseInt(this.win.height());


            //高度已经包含padding？
            if(this.autoShowHiden){
                this.objHeight = parseInt(this.obj.height()) + this.xzHeight;
            }else{
                this.objHeight = parseInt(this.obj.height()) ;
            }

            //this.objHeight = parseInt(this.obj.height()) - this.outRangeLength*2;

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
        //内部刷新
        f5:function(){
            this.touchPoint = [];
            this.moveOrientation = null;
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
            if(this.autoShowHiden && !this.isGoTo){
                if(this.scrollTop>y){
                    this.moveOrientation = "down";
                    //向下滑动
                    if(this.loadUp > y + this.tempxz){
                        this.autoShowHideDom("down",y);
                    }
                }else{
                    this.moveOrientation = "up";
                    //向上滑动
                    if(y>this.loadDown){
                        //加载数据和隐藏数据
                        this.autoShowHideDom("up",y);
                    }
                }
            }
            this.isGoTo = false;

            if(!this.temp_end){
                this.scrollTop = y;

                this._goto(y);

                this.showBottomObj();
                this.scrollerTo();

                var _this = this;

                if(this.movingFn){
                    this.movingFn.call(_this);
                }
            }
            this.temp_end = false;



        },
        //gogogo
        _goto:function(y){
            if(this.useScrollTo){
                this.winobj.scrollTop = y;
            }else{
                if(this.hasTransform){
                    this.obj.get(0).style.cssText += device.transform+":"+device.css_s+"0,"+ -y+"px"+device.css_e;
                }else{
                    this.obj.css({
                        top:-y+"px"
                    })
                }
            }
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
                    _this.moveTo(e + _this.tempxz);
                    _this.objMoveing = false;
                    setTimeout(function(){
                        _this.stopAnimate();
                        _this.autoBackScroll();
                    },0);
                    return;
                }

                timestamp = (timestamp - startTime) / t - 1;
                easeOut = Math.sqrt(1 - timestamp * timestamp);
                newY = (e - s) * easeOut + s + _this.tempxz;



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
            this.tempxz = 0;
        },
        //点击开始
        touchStartHandler:function(e){
            //e.preventDefault();

            this.isTouchStart = true;
            this.isTouching = true;
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

            this.tempxz = 0;

            this.moveTo(y);
        },
        //结束
        touchEndHandler:function(e){
            e.preventDefault();
            this.isTouchStart = false;
            this.isTouching = false;



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

                //判断是否ajax加载
                if(this.startLoading && !this.ajaxing){
                    //开始加载
                    this.ajaxing = true;
                    this.startLoading = false;
                    this.hideBottomObj();
                    this.showBottomAjaxObj();
                    if($.isFunction(this.ajaxFn)){
                        this.ajaxFn();
                    }
                }


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
        //显示\隐藏 子元素
        showHideChildrenFT:function(f,t,type){
            var thiswin = this.obj;

            if(type == "block"){
                if(this.moveOrientation == "down"){
                    var fristobj = $(this.childrens[this.sDom]);
                    //向下滑动
                    for(var r= f;r<=t;r++ ){
                        $(this.childrens[r]).insertBefore(fristobj);
                    }
                }else{
                    //向上滑动
                    for(var w= f;w<=t;w++ ){
                        thiswin.append(this.childrens[w]);
                    }

                }
            }else{
                for(var j=f;j<=t;j++){
                    var thatobj = $(this.childrens[j]);
                    if(this.obj.find(thatobj).length == 1){
                        thatobj.remove();
                    }
                }
            }

        },
        //计算加载点
        getLoadPoint:function(){
            var updom = this.sDom + this.showNumber,
                enddom = this.eDom - this.showNumber + 1 ;

            this.loadUp = this.childrens[updom].offsetTop;
            this.loadDown = this.childrens[enddom].offsetTop;
        },
        //自动隐藏、显示 dom
        autoShowHideDom:function(type,y){
            if(type == "up"){
                var maxchildren = this.chlidrenLength - 1;
                if(this.eDom == maxchildren){ return; }

                var add = ( this.eDom + this.showNumber > maxchildren ) ? maxchildren - this.eDom : this.showNumber ,
                    temp_xz = this.childrens[this.sDom+add].offsetTop;

                this.showHideChildrenFT(this.sDom,this.sDom+add-1,"none");
                this.sDom += add;
                this.showHideChildrenFT(this.eDom+1,this.eDom+add,"block");
                this.eDom += add;

                this.xzHeight = temp_xz - this.outRangeLength;
                this.obj.css({"padding-top":temp_xz+"px"});


                //刷新
                this.autorefresh(true);

                //如果还不够在来
                if(y>this.loadDown){
                    this.autoShowHideDom("up",y);
                }


            }else{
                if(this.sDom == 0){ return; }

                var add1 = ( this.sDom - this.showNumber > 0 ) ? this.showNumber : this.sDom ,
                    temp_xz1 = this.childrens[this.sDom].offsetTop;

                this.showHideChildrenFT(this.eDom-add1+1,this.eDom,"none");
                this.eDom -= add1;
                this.showHideChildrenFT(this.sDom-add1,this.sDom-1,"block");
                temp_xz1 = this.childrens[this.sDom].offsetTop - temp_xz1 ;
                this.sDom -= add1;

                if(this.xzHeight == 0){
                    this.tempxz = temp_xz1;
                    if(!this.animate){
                        this.scrollTop += this.tempxz;


                        this._goto(this.scrollTop);


                        this.tempxz = 0;
                        this.autorefresh(true);
                        this.scrollerTo();
                        this.temp_end = true;
                        return;
                    }
                }else{
                    this.xzHeight = this.xzHeight - temp_xz1;
                }

                this.obj.css({"padding-top":this.xzHeight+this.outRangeLength+"px"});



                //刷新
                this.autorefresh(true);

                //如果还不够在来
                if(this.loadUp > y + this.tempxz){
                    this.autoShowHideDom("down",y);
                }
            }
        },
        //刷新后补充数量(从不自动加载到自动加载dom)
        renewChildren:function(oldlength){
            if(oldlength < this.showNumber*3){
                var renew_number = this.showNumber*3 - oldlength,
                    _ss = this.eDom+ 1,
                    _ee = this.eDom+renew_number;
                this.showHideChildrenFT(_ss,_ee,"block");

                this.sDom = 0;              //显示的第一个dom在数组中的位置
                this.eDom = this.showNumber*3 -1 ;

                //补加载点的计算
                this.getLoadPoint();

            }
        },
        //底部增加数据后刷新
        ajaxSuccessRefresh:function(){
            //dom长度是否变化
            if(this.chlidrenLength == this.childrens.length){
                return;
            }
            var oldlength = this.chlidrenLength;

            this.chlidrenLength = this.childrens.length;
            this.moveOrientation = null;
            this.autoShowHiden = (this.showNumber*3 < this.chlidrenLength);


            if(this.autoShowHiden){
                //补齐基础数量,补算加载点
                this.renewChildren(oldlength);

                if(this.scrollTop>this.loadDown){
                    this.autoShowHideDom("up",this.scrollTop);
                }

            }else{
                this.sDom = 0;              //显示的第一个dom在数组中的位置
                this.eDom = this.chlidrenLength -1 ;
                this.showHideChildrenFT(0,this.chlidrenLength-1,"block");
                this.autorefresh();
            }
        },
        //刷新
        refresh:function(){
            //子元素长度  是否自动隐藏
            this.chlidrenLength = this.childrens.length;
            this.moveOrientation = null;

            this.autoShowHiden = (this.showNumber*3 < this.chlidrenLength);

            if(this.autoShowHiden){
                this.obj.html("");
                var n = this.sDom + this.showNumber;
                n = ( n > this.chlidrenLength - 1 ) ? this.chlidrenLength - 1 : n ;
                var thisobj = this.childrens[n];

                this.moveToObj(thisobj);
                this.autoBackScroll();  //新增的 看看有木有问题
            }else{
                this.obj.html("");
                this.showHideChildrenFT(0,this.chlidrenLength-1,"block");
                this.autorefresh();
                this.moveTo(this.scrollTop);
                this.autoBackScroll();
            }
        },
        //重载
        reload:function(){
            this.obj.html("");

            this.chlidrenLength = this.childrens.length;     //子对象个数
            this.moveOrientation = null;

            if( this.showNumber*3 >= this.chlidrenLength){
                this.autoShowHiden = false;
                //显示所有
                this.sDom = 0;
                this.eDom = this.chlidrenLength -1 ;
                this.showHideChildrenFT(0,this.chlidrenLength-1,"block");
            }else{
                this.autoShowHiden = true;
                this.sDom = 0;
                this.eDom = this.showNumber*3-1;
                this.showHideChildrenFT(this.sDom,this.eDom,"block");
            }

            this.xzHeight = 0;          //修正高度
            this.isGoTo = false;        //是跳转
            this.tempxz = 0;            //临时修正位置
            this.temp_end = false;      //临时停止

            this.obj.css({"padding-top":this.outRangeLength+"px","padding-bottom":this.outRangeLength+"px"});

            this.autorefresh();
            this.moveTo(this.outRangeLength);
        },
        //移动到  obj=js原生对象   xz=obj的padding margin border之和
        moveToObj:function(obj,xz){
            var data = this.childrens,
                n = data.indexOf(obj);

            if(!xz){
                xz = 0;
            }else{
                xz = parseInt(xz);
            }

            this.moveOrientation = null;

            if(this.autoShowHiden){
                this.showHideChildrenFT(this.sDom,this.eDom,"none");

                this.sDom = (n - this.showNumber > 0 )? n - this.showNumber  : 0 ;
                this.eDom = this.showNumber*3 + this.sDom - 1 ;
                if(this.eDom>data.length-1){
                    this.eDom = data.length -1;
                    this.sDom = this.eDom - this.showNumber*3 + 1;
                }


                this.showHideChildrenFT(this.sDom,this.eDom,"block");

                this.xzHeight = 0;          //修正高度
                this.tempxz = 0;            //临时修正位置
                this.temp_end = false;      //临时停止

                this.obj.css({"padding-top":this.outRangeLength+"px"});

                this.isGoTo = true;
                this.autorefresh();
            }

            this.moveTo(data[n].offsetTop-xz);
            this.autoBackScroll();
        },
        //销毁
        destroy:function(){
            this.f5();
            this.moveTo(100);
            this.childrens = null;
            this.winobj.removeEventListener(device.START_EV,this.touchStart,false);
            this.winobj.removeEventListener(device.MOVE_EV,this.touchMove,false);
            this.winobj.removeEventListener(device.END_EV,this.touchEnd,false);

            this.obj.remove();
            this.scrollObjY.remove();
        },
        //ajax成功
        ajaxSuccess:function(obj){
            if(!$.isArray(obj)){return;}
            this.childrens.pushArray(obj);

            //刷新滚动条
            this.ajaxSuccessRefresh();

            this.hideAjaxLoading();
            this.ajaxing=false;
        },
        //ajax失败
        ajaxError:function(){
            this.hideAjaxLoading();
            this.ajaxing=false;
        }
    };


    return scroll;

})();