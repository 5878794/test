var phone={};
(function(){
	var isAndroid = (/android/gi).test(navigator.appVersion),
		isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
		hasTouch  = 'ontouchstart' in window ,

		START_EV  = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV   = hasTouch ? 'touchmove' : 'mousemove',
		END_EV    = hasTouch ? 'touchend' : 'mouseup',
		CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
		has3d     = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();

	
	phone.set={
		showPageId: null,
		isAndroid : isAndroid,	
		isIDevice : isIDevice,
		hasTouch  : hasTouch ,
		touchStartMove:10,       //触摸滚动触发距离，点击失败移动距离 px
		jg:600,					//同一个对象点击触发时间间隔  ms
		slideTriggerLength:10,		//长滑触发的距离 px
		slideLength:20,			//长滑的距离?? 倍
		outRangeLength:100,			//超出后还可以滑动的距离 px
		longClickTime:1000,			//长按触发时间	ms
		clickdelay:10,				//点击事件延迟触发时间  ms  touchstart
		START_EV:START_EV,
		MOVE_EV:MOVE_EV,
		END_EV:END_EV,
		CANCEL_EV:CANCEL_EV,
		has3d:has3d,
        slideTriggerMaxTime:1000
	}
	
})();
var	nextFrame = (function() {
	    return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(callback) { return setTimeout(callback, 1); }
})(),
	cancelFrame = (function () {
	    return window.cancelRequestAnimationFrame
			|| window.webkitCancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame
			|| clearTimeout
	})();

//计数器
phone.counter = (function(){
    var a = 0;
    return function(){
        a += 1;
        return a;
    }
})();


//=======================================================================================
//给一个id对象添加滚动条   提供滚动条滚动的监听 myscrollchange   参数见里面
phone.xscroll = function(data){
    this.id = null;
    this.slideTriggerLength = 20;    //触发长滑的距离
    this.slideLength = 800;   //长滑距离
    this.outRangeLength=phone.set.outRangeLength; //超出后还可以滚动的距离
    this.showScroll = true;   //是否显示滚动条
    this.has3d=phone.set.has3d;     //是否使用3d

    this.showNumber = 30;   //一次加载50条
    this.childrens = [];   //子对象数组

    //=================================================
    for(var key in data){
        this[key] = data[key];
    }

    if(!this.id){alert("not found scroll id");return;}

    this.outRangeLength=Math.abs(parseInt(this.outRangeLength));

    this.autoShowHiden = true;  //自动显示隐藏

    this.obj = $("#"+this.id);
    this.win = this.obj.parent();    //对象父级窗口
    this.winobj = this.win.get(0);

    this.scrollObjY = null;     //滚动条  y
    this.scrollimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAkElEQVR42qWSMQrAIAxFMzp5AmcXN0cnLyFdu/cC0qkXF+uXFEJpkdrhgZg8TGKo1koC1TAN1wiM4zslc6VkG3GAvYtdKqXEnPPivd+01jvAGXeISfkqr0sppZWIjicQE7Iirr+/9CZdIIdFQ9x8REkjETksOuLJRfQzEpHDYvglTpc6PZzp75hegF8r93nJT3VMkbDTjbHKAAAAAElFTkSuQmCC"		//scroll style image

    this.winWidth = null;     //窗口大小
    this.winHeight = null;
    this.objWidth = null;
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
    this.maxScrollerLength = this.winWidth;
    this.minScrollerTop = 0;                //滚动条最大最小滚动位置
    this.maxScrollerTop = 0;

    this.chlidrenLength = this.childrens.length;     //子对象个数


    if(this.autoShowHiden){
        if( this.showNumber*3 >= this.chlidrenLength){
            this.autoShowHiden = false;
            //显示所有
            this.showHideChildrenFT(0,this.chlidrenLength-1,"block");
        }
    }

    this.loadUp = null;         //顶部加载点
    this.loadDown = null;       //底部加载点
    this.sDom = 0;              //显示的第一个dom在数组中的位置
    this.eDom = this.chlidrenLength -1 ;              //显示的最后一个dom在数组中的位置
    this.xzHeight = 0;          //修正高度
    this.isGoTo = false;        //是跳转
    this.tempxz = 0;            //临时修正位置
    this.temp_end = false;      //临时停止
    this.moveOrientation = null;  //移动方向

    this.touchStart = null;
    this.touchMove = null;
    this.touchEnd = null;

    this.init();
};
phone.xscroll.prototype = {
    //入口
    init:function(){
        var _this = this;
        this.winobj.addEventListener("touchstart",_this.touchStart = function(e){_this.touchStartHandler(e);},false);
        this.winobj.addEventListener("touchmove",_this.touchMove = function(e){_this.touchMoveHandler(e);},false);
        this.winobj.addEventListener("touchend",_this.touchEnd = function(e){_this.touchEndHandler(e);},false);

        if(this.showScroll){
            var temp_css = this.win.css("position");
            if(temp_css == "relative" || temp_css == "absolute"){}else{this.win.css({position:"relative"});}
            this.addScroll();
        }


        if(this.autoShowHiden){
            //预先加载前3段
            this.sDom = 0;
            this.eDom = this.showNumber*3-1;
            this.showHideChildrenFT(this.sDom,this.eDom,"block");
        }


        //用padding充当滑动超出的距离， id所指obj不要设置padding
        this.obj.css({"padding-top":this.outRangeLength+"px","padding-bottom":this.outRangeLength+"px"});


        this.autorefresh();

        this.moveTo(this.outRangeLength);

    },
    //加滚动条
    addScroll:function(){
        this.win.append("<div class='bens_add_temp_scrollbar'></div>");

        this.scrollObjY= this.win.find(".bens_add_temp_scrollbar");

        this.scrollObjY.css({
            "-webkit-box-sizing":"border-box",
            position:"absolute","z-index":3,
            right:"0px",top:"0px",
            width:"1px",
            height:"15px",
            display:"block",
            "-webkit-border-image":"url("+this.scrollimg+") 6 6 6 6"
        })
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

            scroll_top = scroll_top + this.scrollTop ;

            if(this.has3d){
                this.scrollObjY.css({
                    "-webkit-transform":"translate3d(0,"+scroll_top+"px,0)"
                })
            }else{
                this.scrollObjY.css({
                    top:scroll_top+"px"
                })
            }
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
            this.winobj.scrollTop = y;
            this.scrollerTo();
        }
        this.temp_end = false;

    },
    //长滑动到
    animateTo:function(s,e,t){

        var startTime = (new Date()).getTime(),
            _this=this,newY,easeOut;

        var animate=function() {

            var timestamp = (new Date()).getTime();
            var progress = timestamp - startTime;
            if (progress >= t) {
                //go to  finish pos
                _this.moveTo(e + _this.tempxz);
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
        }
        this.tempxz = 0;
    },
    //点击开始
    touchStartHandler:function(e){
        //e.preventDefault();


        //if(this.objMoveing){e.stopPropagation();}
        this.f5();
        this.savePoint(e);

    },
    //移动
    touchMoveHandler:function(e){
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

        var pathLength=this.touchPoint.length,
            startPoint=this.touchPoint[pathLength-2],
            endPoint=this.touchPoint[pathLength-1];

        // y path
        var pathYLength=startPoint.y-endPoint.y;

        //是否长滑
        if(Math.abs(pathYLength) >= this.slideTriggerLength){
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
            scrolltime = this.slideLength;

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

        var touch=e.touches[0];

        this.touchPoint.push({x:touch.pageX,y:touch.pageY});
    },
    //自动回滚
    autoBackScroll:function(){
        if(this.outRangeLength == 0 ){return;}

        var time = null;
        if(this.scrollTop > this.maxScrollTop){
            time = (this.scrollTop - this.maxScrollTop) * 5;
            this.animateTo(this.scrollTop,this.maxScrollTop,time);
            return;
        }

        if(this.scrollTop < this.minScrollTop){
            time = (this.minScrollTop - this.scrollTop) * 5;
            this.animateTo(this.scrollTop,this.minScrollTop,time);
        }
    },
    //显示\隐藏 子元素
    showHideChildrenFT:function(f,t,type){
        var data = this.childrens,
            thiswin = this.obj;

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
                    this.winobj.scrollTop = this.scrollTop;

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
    //内部刷新
    autorefresh:function(state){
        if(!state){
            this.f5();
        }

        if(this.autoShowHiden){
            this.getLoadPoint();
            //刷新显示隐藏？

        }




        this.winWidth = parseInt(this.win.width());     //窗口大小
        this.winHeight = parseInt(this.win.height());

        this.objWidth = parseInt(this.obj.width());

        if(this.autoShowHiden){
            this.objHeight = parseInt(this.obj.height()) + this.xzHeight;
        }else{
            this.objHeight = parseInt(this.obj.height());
        }






        this.minScrollTop = this.outRangeLength;
        this.maxScrollTop = this.objHeight - this.winHeight + this.outRangeLength;  //最大滑动高度
        this.canScrollMaxY = this.maxScrollTop + this.outRangeLength;

        this.maxScrollerLength = this.winWidth;





        //滚动条刷新
        this.scrollerRefreshs();
    },
    //移动到  obj=js原生对象
    moveToObj:function(obj){
        var data = this.childrens,
            n = data.indexOf(obj);

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

        this.moveTo(data[n].offsetTop);
        this.autoBackScroll();
    },
    //刷新
    refresh:function(){
        //子元素长度  是否自动隐藏
        this.chlidrenLength = this.childrens.length;
        this.moveOrientation = null;

        if(this.showNumber*3 >= this.chlidrenLength){
            this.autoShowHiden = false;
        }else{
            this.autoShowHiden = true;
        }

        if(this.autoShowHiden){
            this.obj.empty();
            var n = this.sDom + this.showNumber;
            n = ( n > this.chlidrenLength - 1 ) ? this.chlidrenLength - 1 : n ;
            var thisobj = this.childrens[n];

            this.moveToObj(thisobj);
        }else{
            this.obj.empty();
            this.showHideChildrenFT(0,this.chlidrenLength-1,"block");
            this.autorefresh();
            this.moveTo(this.scrollTop);
            this.autoBackScroll();
        }
    },
    //重载
    reload:function(){
        this.obj.empty();

        this.chlidrenLength = this.childrens.length;     //子对象个数

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
    //销毁
    destory:function(){
        this.f5();
        this.moveTo(100);
        this.childrens = null;
        this.winobj.removeEventListener(phone.set.START_EV,this.touchStart,false);
        this.winobj.removeEventListener(phone.set.MOVE_EV,this.touchMove,false);
        this.winobj.removeEventListener(phone.set.END_EV,this.touchEnd,false);

        this.scrollObjY.remove();
    }
};

/*
phone.iscrolls = function(data){

	//user setting==================================================================
	this.id=null;					//must   what dom where scroll

    this.autoshowhide=true;			//use auto hidden children
    this.childrenClass=null;		//auto show hidden children‘s className
	this.outRangeLength=phone.set.outRangeLength; //超出后还可以滚动的距离
	this.allowSlide=true;			//是否允许长滑动
	this.slideTriggerLength=phone.set.slideTriggerLength;   	//促发快速滚动的距离
	this.slideLength=phone.set.slideLength;         	//快速滚动距离=手指滑动距离*该值
	this.showScroll=true; 			//是否出现滚动条
	this.scrollAutoHidden=true;			//停止滚动时隐藏滚动条
	this.has3d=phone.set.has3d;     //是否使用3d
    this.dataTimeUse = false;          //是否是日历控件使用。
    this.moveEndFn = function(){};      //移动结束执行
    this.moveingFn = function(){};      //移动中执行
    this.moveStartfn = function(){};      //移动前执行
	//============================================================================
	
	for(var key in data){
		if(key){
			this[key]=data[key];	
		}	
	}	
	
	if(this.id==null){return false;}
	if(!this.childrenClass){
        this.autoshowhide=false;
    }else{
        this.slideLength = 8;
    }
	
	
	//dom part
	this.obj=document.getElementById(this.id);  				//js dom
	this.that=$("#"+this.id);									//jq dom
	this.scrollObjY=null;										//scroll y dom
	this.zzObj=null;											//moving use zz dom
	this.autoShowHideDom=[];									//children dom
	this.scrollimg="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAkElEQVR42qWSMQrAIAxFMzp5AmcXN0cnLyFdu/cC0qkXF+uXFEJpkdrhgZg8TGKo1koC1TAN1wiM4zslc6VkG3GAvYtdKqXEnPPivd+01jvAGXeISfkqr0sppZWIjicQE7Iirr+/9CZdIIdFQ9x8REkjETksOuLJRfQzEpHDYvglTpc6PZzp75hegF8r93nJT3VMkbDTjbHKAAAAAElFTkSuQmCC"		//scroll style image

	
	//system value
	this.hasTouch=phone.set.hasTouch;							//is can touch?
	//this.isAndroid=phone.set.isAndroid;
	//this.isIphone=phone.set.isIDevice;
	this.winHeight=parseInt(this.that.parent().height());		//scroll dom parent height
	this.touchPoint=[];											//touch point save array
	this.objMoveing=false;										//dom is moving?


	//dom value
	this.scrollTop=0;							//dom pos (theory)
	this.tempscrolly=0;							//dom hidden length  >=0
	this.objHeight=0;							//dom completely height
	this.tempDomHeight=0;						//dom showed height
	this.tempShowS=0;							//children dom show start bit
	this.tempShowE=0;							//children dom show end bit
	this.autoShowHideDomLength=0;				//children number
	this.minScrollTop=this.outRangeLength;		//dom scroll top min val
	this.maxScrollTop=0;						//dom scroll bottom min val
	
	//scroll value
	this.showScrollerY=true;					//show or hidden scroller
	this.minScrollerTop=0;						//scroller pos top min val
	this.maxScrollerTop=0;						//scroller pos bottom min val
	this.scrollerLength=0;						//now scroller length
	//min and max length can set the same val to use some obj to scroll with scroller
	this.minScrollerLength=30;					//scroller min length
	this.maxScrollerLength=this.winHeight;		//scroller max length    
	this.scrollerTop=0;							//scroller now pos top
	this.hideRefreshs=false;

	//temp function
	this.animate=null;							//temp animate function variable
	this.scrollerTimeout=null;					//temp scroller settimeout hidden

	//go
	this.init();								//scroller set		
	this.addScroll();							//add scroll dom
	//this.addzz();								//add zz dom to can't touch other dom
	this.eventBind();							//event bing
	this.refreshs();							//refresh
	
};
phone.iscrolls.prototype={
	//scroll object set 
	init:function(){
        if(!this.dataTimeUse){

            this.that.parent().css({
                position:"relative"
            });

            if(!this.has3d){
                this.that.css({
                    position:"relative",
                    left:0,
                    top:0
                });
            }
        }
        if(this.has3d){this.that.css({"-webkit-transform":"translate3d(0,0,0)"});}
	},
	//add scroll bar
	addScroll:function(){
		this.that.parent().append("<div class='bens_add_temp_scrollbar'></div>");
		
		this.scrollObjY=this.that.parent().find(".bens_add_temp_scrollbar");

		this.scrollObjY.css({
			"-webkit-box-sizing":"border-box",
			position:"absolute","z-index":3,	
			right:"0px",top:"0px",
			width:"1px",
			height:"15px",
			display:"none",
			"-webkit-border-image":"url("+this.scrollimg+") 6 6 6 6"
		})
	},
	//add zz div
	addzz:function(){
		this.that.parent().append("<div class='bens_add_scroll_runing_zz'></div>");
		this.zzObj=this.that.parent().find(".bens_add_scroll_runing_zz");
		this.zzObj.css({
			position:"absolute","z-index":1000,opacity:0,background:"#fff",display:"none",
			top:"0px",left:"0px",width:this.winWidth,height:this.winHeight
		})
	},
	//touchstart do
	f5:function(){
		this.touchPoint=[];
		this.stopAnimate(true);
		this.objMoveing=false;
		this.scrollerTo();
		this.tempDomHeight=parseInt(this.that.height());
		if(this.hideRefreshs){
			this.refreshs();
			this.hideRefreshs=false;
		}
	},
	//event bind
	eventBind:function(){
		var _this=this;

		this.obj.addEventListener(phone.set.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false);
		this.obj.addEventListener(phone.set.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false);
		this.obj.addEventListener(phone.set.END_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false);
		//this.obj.addEventListener(phone.set.CANCEL_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false);
	},
	refreshs:function(){

		this.domRefreshs();
		this.scrollerRefreshs();
		this.outRangeFn();
	},
	domRefreshs:function(){
        if(!this.autoshowhide){
            this.objHeight=parseInt(this.that.height());


        }else{

            //use autoshowhide
            var alldoms=this.that.find("."+this.childrenClass),
                l = alldoms.length,
                height= 0,
                overpage = false;


            for(var i=0; i<l; i++){
                var temp_dom=$(alldoms[i]);
                var thisheight = parseInt(temp_dom.css({display:"-webkit-box"}).height());

                this.autoShowHideDom.push({dom:temp_dom,sHeight:height,eHeight:height+thisheight,height:thisheight});
                height += thisheight;
                if( height> this.winHeight){
                    if(overpage){
                        temp_dom.css({display:"none"});
                    }else{
                        this.tempShowE=i;
                        overpage = true;
                    }
                }else{
                    this.tempShowE=i;
                }
            }

            this.objHeight=height;
        }

		
		if(this.objHeight>this.winHeight){
			this.maxScrollTop = -(this.objHeight+this.outRangeLength-this.winHeight);
		}else{
			this.maxScrollTop = -this.outRangeLength;	
		}

	},
	scrollerRefreshs:function(){
		//scroller
		if(this.objHeight>this.winHeight){
			//use scroller and show
			this.showScrollerY=true;
			
			this.scrollerLength=parseInt(this.winHeight*this.winHeight/this.objHeight);
			this.scrollerLength = (this.scrollerLength<this.minScrollerLength) ? this.minScrollerLength  : this.scrollerLength ;
			this.scrollerLength = (this.scrollerLength>this.maxScrollerLength) ? this.maxScrollerLength  : this.scrollerLength ;
			
			this.maxScrollerTop=this.winHeight - this.scrollerLength ;									
			
			
		}else{
			//hiden scroller
			this.showScrollerY=false;	
			
		}
		
		//reset scroller top or hidden scroller
		this.scrollerTo();							
	},
	savePoint:function(e){
		if(this.hasTouch){
			var touch=e.touches[0];
		}else{
			var touch=e;
		}
		this.touchPoint.push({x:touch.pageX,y:touch.pageY});
	},
	scrollerTo:function(){
		if(this.showScrollerY){
			var temptop=(this.scrollTop>0)? 0 : this.scrollTop; 
			var scroll_top=Math.abs(parseInt(this.maxScrollerTop*temptop/(this.objHeight-this.winHeight)));
			scroll_top = (scroll_top<this.minScrollerTop)? this.minScrollerTop : scroll_top;
			scroll_top = (scroll_top>this.maxScrollerTop)? this.maxScrollerTop : scroll_top;
			
			this.scrollerTop = scroll_top;

			if(this.showScroll){
				if(this.scrollAutoHidden){
					clearTimeout(this.scrollerTimeout);
				}
				if(this.has3d){
					this.scrollObjY.css({
						display:"block",
						opacity:1,
						height:this.scrollerLength+"px",
						"-webkit-transform":"translate3d(0,"+scroll_top+"px,0)"
					})
				}else{
					this.scrollObjY.css({
						display:"block",
						opacity:1,
						height:this.scrollerLength+"px",
						top:scroll_top+"px"	
					})	
				}
				
				if(this.scrollAutoHidden){
					var _this=this;
					this.scrollerTimeout=setTimeout(function(){
						_this.scrollObjY.cssAnimate({opacity:0},500);		
					},2000)
				}
			}
		}else{
			
			this.scrollObjY.css({
				display:"none"
			})			
		}
	},
	animateTo:function(fy,y,time){
		 this.objMoveing=true;
		 if(!time){
			this.autoShowDom(y);
			return;	 
		 }
		 var startTime = (new Date()).getTime(),
		 _this=this,newY,easeOut;
		 
		 var animate=function() {
			
			timestamp = (new Date()).getTime();
			var progress = timestamp - startTime;
			if (progress >= time) {
				//go to  finish pos
				_this.autoShowDom(y);
				setTimeout(function(){_this.stopAnimate()},0);
                _this.correctScrollTopForDataTimeModle();
				return;
			}
			timestamp = (timestamp - startTime) / time - 1;
			easeOut = Math.sqrt(1 - timestamp * timestamp);
			newY = (y - fy) * easeOut + fy;
			_this.autoShowDom(newY);
			

			_this.animate=nextFrame(animate);
		}

		 animate();		 
	},
	stopAnimate:function(notCheck){
		if(this.animate){
			cancelFrame(this.animate);
			this.animate=null;
			if(!notCheck){
				this.outRangeFn();
			}else{
				this.objMoveing=false;	
			}
		}
	},
	//auto show or hiden dom
	autoShowDom:function(y){
        if(this.autoshowhide){
            if( y ==this.scrollTop ){ this.moveObjTo(y); return;   }

            if( y<this.scrollTop){
                //dom move up
                var tempn,
                    tempy = Math.abs(y);
               //+ourang length?
                tempy = (tempy > this.objHeight-this.winHeight) ?  this.objHeight-this.winHeight : tempy;

                for( var i=this.tempShowE;i<this.autoShowHideDom.length;i++){
                    tempn = i;
                    if( i ==  this.autoShowHideDom.length -1 ){
                        break;
                    }

                    if( this.autoShowHideDom[i].eHeight > this.winHeight + tempy ){
                        break;
                    }else{
                        this.autoShowHideDom[i+1].dom.css({display:"-webkit-box"});
                    }
                }
                this.tempShowE = tempn;

            }else{
                //dom move down
                var tempn,
                    tempy = Math.abs(y);

                tempy = (y>0)? 0 : tempy;

                for( var i=this.tempShowS;i>-1;i--){
                    tempn = i;
                    if(i==0){break;}

                    if( tempy > this.autoShowHideDom[i].sHeight){
                        break;
                    }else{
                        this.tempscrolly -= this.autoShowHideDom[i-1].height;
                        this.autoShowHideDom[i-1].dom.css({display:"-webkit-box"});
                    }
                }
                this.tempShowS = tempn;

            }
        }

		this.moveObjTo(y);
	},
    autoHideDom:function(s,e){
        if(this.autoshowhide){
            if( s == e ){  return;   }
            if(this.tempShowS == this.tempShowE){return;}
            if( e<s){
                //dom move up
                var tempn,
                    tempy = Math.abs(e);
                tempy = ( e>0 ) ?  0 : tempy;

                for(var i=this.tempShowS;i<this.autoShowHideDom.length;i++){
                    tempn =i;
                    if(this.autoShowHideDom[i].eHeight < tempy){
                        this.tempscrolly += this.autoShowHideDom[i].height;
                        this.autoShowHideDom[i].dom.css({display:"none"});
                    }else{
                        break;
                    }
                }
                this.tempShowS = tempn;

            }else{
                //dom move down

                var tempn,
                    tempy = Math.abs(e) + this.winHeight;
                //tempy = (tempy>this.objHeight-this.winHeight)? this.objHeight-this.winHeight : tempy;

                for(var i=this.tempShowE;i>-1;i--){
                    tempn =i;
                    if(this.autoShowHideDom[i].sHeight > tempy){
                        this.autoShowHideDom[i].dom.css({display:"none"});
                    }else{
                        break;
                    }
                }
                this.tempShowE = tempn;

            }



        }
    },
	checkScrollOutRange:function(y){
		y = (y>=this.outRangeLength)? this.outRangeLength : y ;
		y = (y<= this.maxScrollTop) ? this.maxScrollTop : y ;
		return y;
	},
	moveObjTo:function(y){
		var ty= y,s=this.scrollTop;
		y=this.checkScrollOutRange(y);


		if(ty!=y){
			//obj scroll is out rang
			var _this=this;
			setTimeout(function(){_this.stopAnimate();},0)
		};


        this.autoHideDom(s,y);



		this.scrollTop=y;


		y += this.tempscrolly;


		if(this.has3d){
			this.that.css({"-webkit-transform":"translate3d(0,"+y+"px,0)"});
		}else{
			this.that.css({top:y+"px"});
		}
		
		
		
		//scroller pos change
		this.scrollerTo();



        //sendin function
		this.moveingFn.call(this);
		
	},
	outRangeFn:function(){
		//not set outRangeLength
		if(this.outRangeLength<=0){
			//this.showHideZZ(false);
			this.objMoveing=false;
			return;
		}
		
		//top out range
		if(this.scrollTop>0){
			var scrollStart=this.scrollTop,
				scrollEnd=0,
				scrolltime=Math.abs(scrollStart-scrollEnd)*5;
			this.animateTo(scrollStart,scrollEnd,scrolltime);
			return;	
		}
		
		//bottom out range
		var maxscrollbottom=(this.winHeight<this.objHeight) ? this.winHeight-this.objHeight : 0;
		if(this.scrollTop<maxscrollbottom){
			var scrollStart=this.scrollTop,
				scrollEnd=maxscrollbottom,
				scrolltime=Math.abs(scrollStart-scrollEnd)*5;
			this.animateTo(scrollStart,scrollEnd,scrolltime);
			return;	
		}
		
		this.objMoveing=false;
		//this.showHideZZ(false);			
	},
	//touch Start Handler
	touchStartHandler:function(e){
		//not prevent Default for input...
		var temp_a=e.target.tagName;
		if(temp_a=="INPUT" || temp_a=="TEXTAREA"){
		
		}else{
			e.preventDefault();	
		}

        this.moveStartfn.call(this);

		if(this.objMoveing){e.stopPropagation();}
		this.canscroll=true; 
		this.f5();
		this.savePoint(e);
	
	},
	touchMoveHandler:function(e){
		e.preventDefault();



		if(!this.canscroll){return;}
		
		//记录当前点
		this.savePoint(e);
		
		var pathLength=this.touchPoint.length;
		var startPoint=this.touchPoint[pathLength-2];
		var endPoint=this.touchPoint[pathLength-1];
		var sPoint=this.touchPoint[0];
		
		//第一次检查移动距离是否超过10像素 超过进入移动状态
		//移动距离在**像素内 不滚动 跟点击事件的像素范围有关系 都是10px
		if(!this.objMoveing){
			//条件：移动距离大于最小限制 允许滚动  该方向大于另一方向的移动距离
			if( (Math.abs(endPoint.y-sPoint.y)>=phone.set.touchStartMove &&  Math.abs(endPoint.y-sPoint.y)>Math.abs(endPoint.x-sPoint.x) ) ){
				this.objMoveing=true;
				//this.showHideZZ(true);   
			}else{
				return;	
			}
		}
		
		
		//y moveing
		var y=this.scrollTop+endPoint.y-startPoint.y;
		
		this.animateTo(this.scrollTop,y);

	},
    correctScrollTopForDataTimeModle:function(){

        if(this.dataTimeUse){
            var temp_a = Math.abs(this.scrollTop) % 44;
            if( temp_a >= 16 ){
                this.animateTo(this.scrollTop,this.scrollTop - 44 + temp_a);
            }else{
                this.animateTo(this.scrollTop,this.scrollTop + temp_a);
            }

        }
        this.moveEndFn.call(this);
    },
	touchEndHandler:function(e){
		e.preventDefault();
		this.canscroll=false;

		//判断是否移动过
		if(!this.objMoveing){
			this.outRangeFn();
            this.correctScrollTopForDataTimeModle();
			return;
		}
		//判断是否设置可长滑
		if(!this.allowSlide){
			this.outRangeFn();
            this.correctScrollTopForDataTimeModle();
			return;
		}


		var pathLength=this.touchPoint.length,
			startPoint=this.touchPoint[pathLength-2],
			endPoint=this.touchPoint[pathLength-1];
		
		// y path
		var pathYLength=endPoint.y-startPoint.y;

		//不长滑
		if(Math.abs(pathYLength)<this.slideTriggerLength){
			this.outRangeFn();
            this.correctScrollTopForDataTimeModle();
			return;				
		}

		//长滑
		this.longSlide(pathYLength);
		

			
	},
	longSlide:function(y){
		//长滑
		var t_slideLength=y*this.slideLength,
			scrollStart=this.scrollTop,
			scrollEnd=this.scrollTop+t_slideLength,
			scrolltime= (this.autoshowhide)? Math.abs(scrollEnd-scrollStart)*2 : Math.abs(scrollEnd-scrollStart);

		//移动
		this.animateTo(scrollStart,scrollEnd,scrolltime);

	},
	showHideZZ:function(pd){
		var cssval=(pd)? "block" : "none";
		if(this.zzObj){
			this.zzObj.css({display:cssval});	
		}	
	},
	reloads:function(){
		this.scrollTop=0;							//dom pos (theory)
		this.tempscrolly=0;							//dom hidden length  >=0
		this.tempShowS=0;							//children dom show start bit
		this.tempShowE=0;							//children dom show end bit
		this.showScrollerY=true;					//show or hidden scroller
		this.scrollerTop=0;							//scroller now pos top
		if(this.autoshowhide){
			this.that.find("."+this.childrenClass).css({display:"block"});
		}
		this.stopAnimate();
		this.moveObjTo(0);
		this.refreshs();
	},
	remove:function(){
		this.stopAnimate();
        this.moveObjTo(0);
		this.obj.removeEventListener(phone.set.START_EV,this.touchStart,false);
		this.obj.removeEventListener(phone.set.MOVE_EV,this.touchMove,false);
		this.obj.removeEventListener(phone.set.END_EV,this.touchEnd,false);

        this.scrollObjY.remove();
	},
	//obj is js dom
	moveto:function(index){
        if(this.objHeight>=this.winHeight){}else{return;}
        index = parseInt(index);
        if(this.autoshowhide){
            var hh =  this.autoShowHideDom[index].sHeight;
            this.autoShowDom(-hh);
        }else{

            var alldom = this.obj.childNodes,
                no = 0,
                obj;
            for(var i= 0,l=alldom.length;i<l;i++){
                if(alldom[i].nodeType == 1){
                    if(index == no){
                        obj =  alldom[i];
                        break;
                    }else{
                        no++;
                    }
                }
            }


            var h=obj.offsetTop,
                l=$(obj).parent().parent().get(0).offsetTop,
                maxh=this.objHeight-this.winHeight;

            h = h-l;

            h=(h>maxh)? maxh : h;
            this.autoShowDom(-h);

        }
	}
};
*/
//=======================================================================================


//给obj注册滑动监听事件 没的参数则是window      myslideleft myslideright myslideup myslidedown
phone.createMySlideEven=function(obj){
	this.obj=obj || window;
	
	this.startTime=null;
	this.points=[];
	
	this.leftSlideEven=null;
	this.rightSlideEven=null;
	this.upSlideEven=null;
	this.downSlideEven=null;
	
	this.touchStart=null;
	this.touchMove=null;
	this.touchEnd=null;
	
	this.minLength=phone.set.slideTriggerLength;
	this.hasTouch=phone.set.hasTouch;
	this.state=false;
	
	this.eventBind();
};
phone.createMySlideEven.prototype={
	eventBind:function(){
		var _this=this;
		this.obj.addEventListener(phone.set.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false)	
		this.obj.addEventListener(phone.set.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false)	
		this.obj.addEventListener(phone.set.END_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false)
		
		this.leftSlideEven=document.createEvent('Event');
		this.leftSlideEven.initEvent("myslideleft", true, true);

		this.rightSlideEven=document.createEvent('Event');
		this.rightSlideEven.initEvent("myslideright", true, true);

		this.upSlideEven=document.createEvent('Event');
		this.upSlideEven.initEvent("myslideup", true, true);

		this.downSlideEven=document.createEvent('Event');
		this.downSlideEven.initEvent("myslidedown", true, true);		
	},
	removeEven:function(){
		var _this=this;
		
		this.obj.removeEventListener(phone.set.START_EV,this.touchStart,false);
		this.obj.removeEventListener(phone.set.MOVE_EV,this.touchMove,false);
		this.obj.removeEventListener(phone.set.END_EV,this.touchEnd,false);
	},
	f5:function(){
		this.points=[];
	},
	touchStartHandler:function(e){
		this.f5();			//刷新参数
		this.savePoint(e);	//记录当前点
		this.state=true;
	},
	touchMoveHandler:function(e){
		e.preventDefault(); 
		if(!this.state){return;}
		this.savePoint(e);
		
	},
	touchEndHandler:function(e){
		if(!this.state){return;}
		this.state=false;
		if(this.points.length<2){return;}
		
		var lastpoint=this.points[this.points.length-1];
		var lastpointx=lastpoint.x;
		var lastpointy=lastpoint.y;
		
		var startpoint=this.points[this.points.length-2];
		var startpointx=startpoint.x;
		var startpointy=startpoint.y;
		
		
		var pointsx=Math.abs(startpointx-lastpointx);
		var pointsy=Math.abs(startpointy-lastpointy);
		
		//未超过最小滑动距离
		if(pointsx<this.minLength && pointsy<this.minLength){return;}
		
		//判断方向
		if(pointsx>=pointsy){
			//横向滑动
			if(startpointx>lastpointx){
				//左滑
				this.obj.dispatchEvent(this.leftSlideEven);	
			}else{
				//右滑
				this.obj.dispatchEvent(this.rightSlideEven);	
			}
		}else{
			//纵向滑动
			if(startpointy>lastpointy){
				//上滑
				this.obj.dispatchEvent(this.upSlideEven);	
			}else{
				//下滑
				this.obj.dispatchEvent(this.downSlideEven);	
			}
		}	
	},	
	savePoint:function(e){
		if(this.hasTouch){
			var touch=e.touches[0];
		}else{
			var touch=e;
		}
		this.points.push({x:touch.pageX,y:touch.pageY});
	}
};

//=======================================================================================

//$$("# .obj").myclickdown(function(){$(this).*****})

//给原生对象注册监听事件   myclickdown  myclickok myclickup mylongclick
phone.createMyTouchEven=function(obj){
	this.obj=obj;
	this.mytarget=null;
		
	if(this.obj==null){return;}
	
	this.clickLongTimeFn=null;
	this.clickTimeFn=null;
	this.points=[];
	
	this.isTouchOk=true;
	this.isTouchStarted=false;
	this.isTouchMoved=false;
	this.slideTo=null;
	this.isLongClicked=false;
	this.isTouchEnded=false;

	
	this.clickDownEven=null;
	this.clickOkEven=null;
	this.clickUpEven=null;
	this.longClickEven=null;
    this.slideUpEven=null;
    this.slideDownEven=null;
    this.slideRightEven=null;
    this.slideLeftEven=null;
		
	this.touchSTime=null;	
	this.touchJQ=phone.set.jg;
	this.touchDelay=phone.set.clickdelay;
	this.longClickDelay=phone.set.longClickTime;
	this.allowMove=phone.set.touchStartMove;
	this.hasTouch=phone.set.hasTouch;
	
	this.eventBind();	
	
};
phone.createMyTouchEven.prototype={
	eventBind:function(){
		var _this=this;
		this.obj.addEventListener(phone.set.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false)	
		this.obj.addEventListener(phone.set.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false)	
		this.obj.addEventListener(phone.set.END_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false)
		
		this.clickDownEven=document.createEvent('Event');
		this.clickDownEven.initEvent("myclickdown", true, true);
		
		this.clickOkEven=document.createEvent('Event');
		this.clickOkEven.initEvent("myclickok", true, true);
		
		this.clickUpEven=document.createEvent('Event');
		this.clickUpEven.initEvent("myclickup", true, true);
		
		this.longClickEven=document.createEvent('Event');
		this.longClickEven.initEvent("mylongclick", true, true);

        this.slideUpEven=document.createEvent('Event');
        this.slideUpEven.initEvent("myslideup", true, true);

        this.slideDownEven=document.createEvent('Event');
        this.slideDownEven.initEvent("myslidedown", true, true);

        this.slideRightEven=document.createEvent('Event');
        this.slideRightEven.initEvent("myslideright", true, true);

        this.slideLeftEven=document.createEvent('Event');
        this.slideLeftEven.initEvent("myslideleft", true, true);
	},
	f5:function(){
		this.points=[];
		
		this.isTouchStarted=false;
		this.isTouchMoved=false;
		this.slideTo=null;
		this.isLongClicked=false;
		this.isTouchEnded=false;
	},
	isTouchOkFn:function(){
		//判断是否是有效点击
		var nowdatatime=new Date().getTime(); 
		
		//点击时间间隔控制
		if(this.touchSTime!=null){
			if(nowdatatime-this.touchSTime>this.touchJQ){   
				//有效
				this.isTouchOk=true;		
			}else{
				//无效
				this.isTouchOk=false;
			}
		}
		this.touchSTime=nowdatatime;
	},
	//长按事件监听
	clickLongListenerFn:function(e){
		var _this=this;
		this.clickLongTimeFn=setTimeout(function(){
			_this.isLongClicked=true;
			_this.isTouchEnded=true;
			//长按。。。。。
			//触发事件
			_this.clickUpEven.mytarget=_this.mytarget;
			_this.longClickEven.mytarget=_this.mytarget;
			_this.obj.dispatchEvent(_this.clickUpEven);
			_this.obj.dispatchEvent(_this.longClickEven);
			//_this.clickUpHandler(e);
			//_this.clickLongHandler(e);
		},this.longClickDelay);
	},
	//点击时
	touchStartHandler:function(e){
		//e.preventDefault(); 
		
		this.isTouchOkFn(); //判断是否是有效点击		
		if(!this.isTouchOk){return;}
		
		this.mytarget=e.target;
		this.f5();			//刷新参数
		this.savePoint(e);	//记录当前点
		
		//点击延时执行
		var _this=this;
		this.clickTimeFn=setTimeout(function(){
			_this.touchStartHandlerGo(e)
		},this.touchDelay)
	},
	//点击后延迟执行
	touchStartHandlerGo:function(e){
		this.isTouchStarted=true;
		
		//注册长按事件
		this.clickLongListenerFn(e);
		
		//执行按下动作
		//
		this.clickDownEven.mytarget=this.mytarget;
		this.obj.dispatchEvent(this.clickDownEven);
		//this.clickDownHandler(e);
	},
	//移动时判断 未动 长滑
	touchMoveCondition:function(){
		var poinglength=this.points.length;
		//当前点
		var thispointx=this.points[poinglength-1].x;
		var thispointy=this.points[poinglength-1].y;
		//初始点击时的点
		var yuanpointx=this.points[0].x;
		var yuanpointy=this.points[0].y;
		
		
		
		if(!this.isTouchMoved){
			//规定的移动范围内算作未移动处理
			if(thispointx>=yuanpointx-this.allowMove && thispointx<=yuanpointx+this.allowMove && thispointy>=yuanpointy-this.allowMove && thispointy<=yuanpointy+this.allowMove){
				this.isTouchMoved=false;	
			}else{
				this.isTouchMoved=true;	
			}
		}
	},
	//移动时的处理
	touchMoveHandler:function(e){
		e.preventDefault(); 
		if(!this.isTouchOk){return;}
		if(this.isTouchEnded){return;}
		if(this.isLongClicked){
			return;		
		}
		
		
		
		//记录当前点
		this.savePoint(e);

		
		//判断移动超出
		this.touchMoveCondition();

		if(this.isTouchMoved){		//判断移动类型
			clearTimeout(this.clickTimeFn);   	  
			clearTimeout(this.clickLongTimeFn);  
			if(this.isTouchStarted){
				this.isTouchEnded=true;
				this.clickUpEven.mytarget=this.mytarget;
				this.obj.dispatchEvent(this.clickUpEven);
				//this.clickUpHandler(e);	
			}

		}	

	},
	//点击结束的处理
	touchEndHandler:function(e){
		if(!this.isTouchOk){return;}
		clearTimeout(this.clickTimeFn);   	  
		clearTimeout(this.clickLongTimeFn);  
		//if(this.isTouchEnded){return;}   //move超出  没有进入滑动  结束
		if(this.isLongClicked){return;}  //长按了  结束
		
		
		this.isTouchEnded=true;
		
		
		if(this.isTouchStarted){
            var _this=this;
			if(!this.isTouchMoved){
				//延时执行
				setTimeout(function(){
					_this.clickUpEven.mytarget=_this.mytarget;
					_this.clickOkEven.mytarget=_this.mytarget;
					_this.obj.dispatchEvent(_this.clickOkEven);
					_this.obj.dispatchEvent(_this.clickUpEven);
				},300)
			}else{
                //判断是否触发移动   和   判断移动类型  this.touchSTime
                var thistime = new Date().getTime();
                if(thistime-this.touchSTime <= phone.set.slideTriggerMaxTime ){
                    //执行滑动事件
                    _this.chooseSlideType();

                }
            }
		}
	},
    //判断滑动类型
    chooseSlideType:function(){
        var thisstartpoint = this.points[0],
            pointlength = this.points.length,
            thisendpoint = this.points[pointlength-1],
            hlength = Math.abs(thisstartpoint.x - thisendpoint.x),
            vlength = Math.abs(thisstartpoint.y - thisendpoint.y),
            _this = this;

        if(hlength>vlength){
            //横向移动
            if(thisstartpoint.x > thisendpoint.x){
                //左滑
                _this.slideLeftEven.mytarget=_this.mytarget;
                _this.obj.dispatchEvent(_this.slideLeftEven);
            }else{
                //右滑
                _this.slideRightEven.mytarget=_this.mytarget;
                _this.obj.dispatchEvent(_this.slideRightEven);
            }
        }else{
            //纵向移动
            if(thisstartpoint.y > thisendpoint.y){
                //上滑
                _this.slideUpEven.mytarget=_this.mytarget;
                _this.obj.dispatchEvent(_this.slideUpEven);
            }else{
                //下滑
                _this.slideDownEven.mytarget=_this.mytarget;
                _this.obj.dispatchEvent(_this.slideDownEven);
            }
        }


    },
	savePoint:function(e){
		if(this.hasTouch){
			var touch=e.touches[0];
		}else{
			var touch=e;
		}
		this.points.push({x:touch.pageX,y:touch.pageY});
	}
};

//events save
phone.events={
	addClickListener:function(){
		var _this=this;
		new phone.createMyTouchEven(document);
		//clickok
		document.addEventListener("myclickok",function(e){
			e.preventDefault();
			_this.dothis("myclickok",e);
		},false);
		//clickdown
		document.addEventListener("myclickdown",function(e){
			e.preventDefault();
			_this.dothis("myclickdown",e);
		},false);
		//clickup
		document.addEventListener("myclickup",function(e){
			e.preventDefault();
			_this.dothis("myclickup",e);
		},false);
		//longclick
		document.addEventListener("mylongclick",function(e){
			e.preventDefault();
			_this.dothis("mylongclick",e);
		},false);
        //slideup
        document.addEventListener("myslideup",function(e){
            e.preventDefault();
            _this.dothis("myslideup",e);
        },false);
        //slidedown
        document.addEventListener("myslidedown",function(e){
            e.preventDefault();
            _this.dothis("myslidedown",e);
        },false);
        //slideleft
        document.addEventListener("myslideleft",function(e){
            e.preventDefault();
            _this.dothis("myslideleft",e);
        },false);
        //slideright
        document.addEventListener("myslideright",function(e){
            e.preventDefault();
            _this.dothis("myslideright",e);
        },false);
	},
	dothis:function(type,e){
		var _this=this,
		    that=e.mytarget;

        var gonext = function(obj){
            var p_obj = obj.parentNode;
            handlerthis(p_obj);
        };

        var handlerthis = function(obj){
            if(obj.nodeName.toLowerCase() == "html"){ return;}

            var _id = obj.id,
                _class = obj.className,
                isfind = false;

            if(_id){
                //注册了id的事件
                if(_this.id[_id]){
                    if(_this.id[_id][type]){
                        _this.id[_id][type].call(obj);
                        isfind = true;
                    }
                }
            }

            //注册了class事件
            if(_class){
                _class=_class.split(" ");
                for(var i= 0,l=_class.length;i<l;i++){
                    if(_class[i]){
                        //注册了class的事件
                        if(_this.classs[_class[i]]){
                            if(_this.classs[_class[i]][type]){
                                _this.classs[_class[i]][type].call(obj);
                                isfind = true;
                            }
                        }
                    }
                }
            }

            if(!isfind){
                gonext(obj);
            }

        };

        handlerthis(that);
	},
	classs:{},
	id:{}
};
phone.events.addClickListener();

//event bind function
phone.eventBind=function(a){
	this.name=a;
	this.events=null;
	this.init();	
};
phone.eventBind.prototype={
	init:function(){
		if(!this.name){return;}
		
		var a=this.name.substring(0,1);
		if(a=="#" || a=="."){
			this.events=(a=="#")? phone.events.id : phone.events.classs;
			this.name=this.name.substring(1);
		}else{
			return;	
		}
		
		if(!this.events[this.name]){
			this.events[this.name]={};	
		}
	},
	myclickok:function(callback){
		if(callback){
			this.events[this.name].myclickok=callback;
            return this;
		}
	},
	myclickdown:function(callback){
		if(callback){
			this.events[this.name].myclickdown=callback;
            return this;
		}
	},
	myclickup:function(callback){
		if(callback){
			this.events[this.name].myclickup=callback;
            return this;
		}
	},
	mylongclick:function(callback){
		if(callback){
			this.events[this.name].mylongclick=callback;
            return this;
		}
	},
    myslideup:function(callback){
        if(callback){
            this.events[this.name].myslideup=callback;
            return this;
        }
    },
    myslidedown:function(callback){
        if(callback){
            this.events[this.name].myslidedown=callback;
            return this;
        }
    },
    myslideright:function(callback){
        if(callback){
            this.events[this.name].myslideright=callback;
            return this;
        }
    },
    myslideleft:function(callback){
        if(callback){
            this.events[this.name].myslideleft=callback;
            return this;
        }
    }
};
//event bind function init
var $$=function(a){
	return new phone.eventBind(a);
};



//=======================================================================================


/*	
	//生成animate class
	var a=new phone.addCssAnimateClass({
		"0%":"-webkit-transform:rotate(0deg)",
		"100%":"-webkit-transform:rotate(270deg)"
	},1000);
	//class name
		//移除后在添加css需要延时执行  否则无反应
		setTimeout(function(){$("div").addClass(a.className);},0)
    //webkitAnimationEnd 动画完监听
*/

phone.addCssAnimateClass=function(ruleData,time){
	this.id=new Date().getTime();
	this.className="class"+this.id;			
	this.browserType="-webkit-";
	this.rules=null;
	this.styleTree=null;
	
	//创建空的css动画函数
	this.createRule=function(){
		this.styleTree.insertRule("@"+this.browserType+"keyframes animation"+this.id+" {}",0);
		this.rules = this.styleTree.cssRules[0];
	}
	
	//创建动画
	this.createAnimation=function(){
		if(!this.rules){return;}
		var length=ruleData.length;
		for(var key in ruleData){
			if(key){
				this.rules.insertRule(key + "{"+ruleData[key]+"}");
			}
		}	
	}
	
	//创建引用class
	this.createClass=function(){
		this.styleTree.insertRule(".class"+this.id+" {" +ruleData["100%"]+";"+ this.browserType+"animation-name:animation"+this.id+";"+this.browserType+"animation-duration:"+time+"ms;"+"}",this.styleTree.cssRules.length)
			
	}
	
	//创建页面css
	this.createHtmlStyle=function(){
		var tree=document.styleSheets;
		var length=tree.length;
		for(var i=0;i<length;i++){
			if($.isObject(tree[i].cssRules)){
				this.styleTree=tree[i];
				break;
			}	
		}
		if(this.styleTree==null){
			$("head").append("<style>.bens_add_temp_css{}</style>");
			length=tree.length;
			for(var i=0;i<length;i++){
				if($.isObject(tree[i].cssRules)){
					this.styleTree=tree[i];
					break;
				}	
			}				
		}
	}
	
	//入口函数
	this.init=function(){
		if(!$.isObject(ruleData)){return;}
		this.createHtmlStyle();
		this.createRule();
		this.createAnimation();
		this.createClass();
	}	
	
	this.init();
	
	//移除创建的css
	this.remove=function(){
		var data=this.searchIndex();
		if(data.length==0){return;}
		
		for(var i=data.length-1;i>=0;i--){
			this.styleTree.deleteRule(data[i])		
		}
	}
	
	//查找要移除的css id
	this.searchIndex=function(){
		var a=[];
		var tree=this.styleTree.cssRules;
		var length=tree.length;
		for(var i=0;i<length; i++){
			if(tree[i].selectorText==".class"+this.id || tree[i].name=="animation"+this.id){
				a.push(i);
			}	
		}
		a.sort();
		return a;	
	}
};

//=======================================================================================



//backbutton 事件存放对象   动画执行后手动增加返回动画函数   （phonegap)
//初始添加监听 phone.backEvent.addListen();

//add(type,fn)    type:menu or page  只支持2种  增加时会删除上一个类型是菜单的操作
//del()    删除一个
//run()    执行
phone.backEvent={
	inputfocus:false,
	datas:[],
	add:function(type,fn){
		var _this=this;
		
		//最后一个操作是否是菜单 如果是菜单就移除最后一只
		if(_this.datas.length>0){
			var lastobj=_this.datas.pop();
			if(lastobj.type!="menu"){
				_this.datas.push(lastobj);	
			}
		}	
			
		_this.datas.push({type:type,fn:fn});		
	},
	del:function(){
		var _this=this;
		if(this.datas.length>0){
			this.datas.pop();
			_this.inputfocus=false;
		}
	},
	run:function(){
		var _this=this;
		if(this.datas.length>0){
			var obj=this.datas.pop();
			if(obj.type=="ts"){
				setTimeout(function(){
					
					_this.datas.splice(1,0,{type:"ts",fn:function(){phone.info.show("连按后退键退出！",false)}})
					//phone.backEvent.add("ts",function(){phone.info.show("连按后退键退出！",false)});
				},1000)	
			}
			
			if(typeof(obj.fn)=="function"){
				obj.fn();
			}
		}
	},
	addListen:function(){
		var _this=this;
		
		//add  back even to exit app  
		phone.backEvent.add("page",function(){navigator.app.exitApp()});
		phone.backEvent.add("ts",function(){phone.info.show("连按后退键退出！",false)});
		
		document.addEventListener("backbutton", function(){
			if(!_this.inputfocus){
				_this.run();
			}else{
				_this.inputfocus=false;
			}	
		}, false);
		
		$("input").each(function() {
			//没有监听后面加进来的input  手动添加
            $(this).get(0).addEventListener("click",function(){
				_this.inputfocus=true;
			},false)
        });
		
	}		
};


//=======================================================================================


//menu button 事件存放   （phonegap)

//初始执行 之后不用管了 有几个执行几个
//phone.set.showPageId=初始页id
//phone.menuEvent.addListen(page,id,showfn,hidefn)   page id, menu id, showfn ,hidefn

//页面跳转赋值 phone.set.showPageId 已在页面跳转类中自动修改 初始需要赋值
phone.menuEvent={
	datas:{},
	isbind:false,
	addListen:function(page,id,showfn,hidefn){
		if(!this.isbind){
			this.bindaddevent();
			this.isbind=true;	
		}
		
		this.datas[page]={};
		this.datas[page].objid=id;		
		this.datas[page].showfn=showfn;
		this.datas[page].hidefn=hidefn;
	},
	run:function(){
		var page=phone.set.showPageId;
		if(!page){return;}
		if(!this.datas[page]){return;}
		
		//do 
		//check menu is hidden or display
		var menustate=$("#"+this.datas[page].objid).css("display");
		
		if(menustate=="none"){
			phone.backEvent.add("menu",this.datas[page].hidefn);
			this.datas[page].showfn();
			
				
		}else{
			phone.backEvent.del();
			this.datas[page].hidefn();
			
		}
	},
	bindaddevent:function(){
		var _this=this;
		document.addEventListener("menubutton", function(){
				_this.run()	
		}, false);	
	}	
	
	
};




//=======================================================================================





// form to 为页面id
//phone.page.rightShow(from,to,callback)  	页面右面滑入
//phone.page.leftShow(from,to,callback)	 	页面左面滑入
//phone.page.upShow(from,to,callback)		页面上面滑入
//phone.page.downShow(from,to,callback)	 	页面下面滑入
phone.pageContainer = "body";
phone.page={
	has3d:phone.set.has3d,
	winWidth:null,
	winHeight:null,
	timeoutfn:null,
	css_s:(this.has3d)? "translate3d(" : "translate(",
	css_e:(this.has3d)? ",0)" : ")",
	getpx:function(){
		if(this.winHeight && this.winWidth){ return;}
		this.winHeight=parseInt($(phone.pageContainer).height());
		this.winWidth=parseInt($(phone.pageContainer).width());
		
		
	},
	isMoving:0,
	resets:function(from,to){
		var _this=this;
		//setTimeout(function(){
			//phone.page.isMoving--;
			//if(phone.page.isMoving==0){
				$(phone.pageContainer).css({"-webkit-transform":_this.css_s+"0,0"+_this.css_e});
				//$("#"+to).css({"-webkit-transform":_this.css_s+"0,0"+_this.css_e});
				$("#"+to).css({position:"absolute",left:0,top:0,display:"-webkit-box"});
				$("#"+from).css({display:"none"});
				phone.set.showPageId=to;
				phone.page.isMoving=0;
			//}
		//},0)
	},
	rightShow:function(from,to,callback){
		phone.set.showPageId=null;
		this.getpx();
		var _this=this;
		
		$("#"+from).css({display:"-webkit-box"})
		if(_this.isMoving==0){
			$("#"+to).css({
				position:"absolute",
				//left:0,
				left:_this.winWidth+"px",
				top:0, 
				display:"-webkit-box"
				//"-webkit-transform":_this.css_s+_this.winWidth+"px,0"+_this.css_e
			})	
		}else{
			$("#"+to).css({display:"-webkit-box"})	
		}
		
		
		var temp_a= (_this.isMoving==0)? -_this.winWidth : 0;
		$(phone.pageContainer).cssAnimate2({
			"-webkit-transform":_this.css_s+temp_a+"px,0"+_this.css_e	
		},500,function(){
			if(typeof(callback)=="function"){
				callback();	
			}			
			_this.resets(from,to);
		
		})	
	},
	leftShow:function(from,to,callback){
		phone.set.showPageId=null;
		this.getpx();
		var _this=this;
		
		$("#"+from).css({display:"-webkit-box"});
		if(_this.isMoving==0){
			$("#"+to).css({
				position:"absolute",
				//left:0,
				left:-_this.winWidth+"px",
				top:0, 
				display:"-webkit-box"
				//"-webkit-transform":_this.css_s+ -_this.winWidth+"px,0"+_this.css_e
			})
		}else{
			$("#"+to).css({display:"-webkit-box"})	
		}
		
		
		var temp_a= (_this.isMoving==0)? _this.winWidth : 0;
		$(phone.pageContainer).cssAnimate2({
			"-webkit-transform":_this.css_s+temp_a+"px,0"+_this.css_e	
		},500,function(){
			if(typeof(callback)=="function"){
				callback();	
			}	
			_this.resets(from,to);		
		})
	},
	upShow:function(from,to,callback){
		phone.set.showPageId=null;
		this.getpx();
		var _this=this;
		
		$("#"+from).css({display:"-webkit-box"});
		if(_this.isMoving==0){
			$("#"+to).css({
				position:"absolute",
				left:0,
				top:0, 
				display:"-webkit-box",
				"-webkit-transform":_this.css_s+ "0,"+ -_this.winHeight+"px"+_this.css_e
			})
		}else{
			$("#"+to).css({display:"-webkit-box"})	
		}
				
		var temp_a= (_this.isMoving==0)? _this.winHeight : 0;
		$(phone.pageContainer).cssAnimate2({
			"-webkit-transform":_this.css_s+"0,"+temp_a+"px"+_this.css_e	
		},500,function(){
			if(typeof(callback)=="function"){
				callback();	
			}
			_this.resets(from,to);
		})
	},
	downShow:function(from,to,callback){
		phone.set.showPageId=null;
		this.getpx();
		var _this=this;
		
		$("#"+from).css({display:"-webkit-box"});
		if(_this.isMoving==0){
			$("#"+to).css({
				position:"absolute",
				left:0,
				top:0, 
				display:"-webkit-box",
				"-webkit-transform":_this.css_s+"0,"+_this.winHeight+"px"+_this.css_e
			})
		}else{
			$("#"+to).css({display:"-webkit-box"})	
		}
				
		var temp_a= (_this.isMoving==0)? -_this.winHeight : 0;
		$(phone.pageContainer).cssAnimate2({
			"-webkit-transform":_this.css_s+"0,"+temp_a+"px"+_this.css_e	
		},500,function(){
			if(typeof(callback)=="function"){
				callback();	
			}					
			_this.resets(from,to);			
		})	
	}	
};


//=======================================================================================


//phone.menu.downShow(obj,spd)   obj底部滑入
//phone.menu.downHide(obj,spd)	 obj底部滑出
//phone.menu.topShow(obj,spd)	 obj顶部滑入	
//phone.menu.topHide(obj,spd)	 obj顶部滑出
phone.menu={
	has3d:phone.set.has3d,
	//has3d:false,
	zzObj:null,
	createZZ:function(){
		$("body").append("<div class='bens_add_temp_menu_zz'></div>");
		this.zzObj=$(".bens_add_temp_menu_zz");
		this.zzObj.css({
			position:"absolute",
			width:"100%",
			height:"100%",
			left:0,
			top:0,
			"z-index":10000,
			display:"none",
			background:"rgba(0,0,0,0)"
		})
	},
	//interface
	downShow:function(menuobj,spd){
		if(!menuobj){return;}
		menuobj=$("#"+menuobj);
		if(!this.zzObj){this.createZZ()};
		spd = spd || 300;
		
		var h=parseInt(menuobj.height());

		if(this.has3d){
			menuobj.css({"-webkit-transform":"translate3d(0,0,0)",position:"absolute",left:0,bottom:-h+"px",display:"block","z-index":10001})
			this.zzObj.css({background:"rgba(0,0,0,0)",display:"block"});
			
			this.zzObj.cssAnimate({
				background:"rgba(0,0,0,0.5)"	
			},spd,function(){
				menuobj.cssAnimate1({
					"-webkit-transform":"translate3d(0,"+ -h+"px,0)"
				},spd)	
			})
			
		}else{
			menuobj.css({left:0,bottom:-h+"px",display:"block","z-index":10001,position:"absolute"});	
			this.zzObj.css({background:"rgba(0,0,0,0)",display:"block"});
			
			this.zzObj.cssAnimate({
				background:"rgba(0,0,0,0.4)"	
			},spd,function(){
				menuobj.cssAnimate1({
					bottom:0	
				},spd)	
			})
		}
	},
	//interface
	downHide:function(menuobj,spd){
		var _this=this;
		if(!_this.zzObj){return;}
		if(!menuobj){return;}
		menuobj=$("#"+menuobj);	
		spd = spd || 500;
		
		var h=parseInt(menuobj.height());
		
		if(this.has3d){
			menuobj.cssAnimate1({
				"-webkit-transform":"translate3d(0,0,0)"
			},spd,function(){
				_this.zzObj.css({display:"none"});
				menuobj.css({display:"none"});
			})	
		}else{
			menuobj.cssAnimate({
				bottom:-h+"px"
			},spd,function(){
				_this.zzObj.css({display:"none"});
				menuobj.css({display:"none"});	
			})	
		}
	},
	//interface
	topShow:function(menuobj,spd){
		if(!menuobj){return;}
		menuobj=$("#"+menuobj);
		if(!this.zzObj){this.createZZ()};
		spd = spd || 300;
		
		var h=parseInt(menuobj.height());

		if(this.has3d){
			menuobj.css({"-webkit-transform":"translate3d(0,0,0)",position:"absolute",left:0,top:-h+"px",display:"block","z-index":10001})
			this.zzObj.css({background:"rgba(0,0,0,0)",display:"block"});
			
			this.zzObj.cssAnimate({
				background:"rgba(0,0,0,0.5)"	
			},spd,function(){
				menuobj.cssAnimate1({
					"-webkit-transform":"translate3d(0,"+ h+"px,0)"
				},spd)	
			})
			
		}else{
			menuobj.css({left:0,top:-h+"px",display:"block",position:"absolute","z-index":10001});	
			this.zzObj.css({background:"rgba(0,0,0,0)",display:"block"});
			
			this.zzObj.cssAnimate({
				background:"rgba(0,0,0,0.4)"	
			},spd,function(){
				menuobj.cssAnimate1({
					top:0	
				},spd)	
			})
		}
	},
	//interface
	topHide:function(menuobj,spd){
		var _this=this;
		if(!_this.zzObj){return;}
		if(!menuobj){return;}	
		menuobj=$("#"+menuobj);
		spd = spd || 500;
		
		var h=parseInt(menuobj.height());
		
		if(this.has3d){
			menuobj.cssAnimate1({
				"-webkit-transform":"translate3d(0,0,0)"
			},spd,function(){
				_this.zzObj.css({display:"none"})
				menuobj.css({display:"none"});		
			})	
		}else{
			menuobj.cssAnimate({
				top:-h+"px"
			},spd,function(){
				_this.zzObj.css({display:"none"})
				menuobj.css({display:"none"});		
			})	
		}
	},
	hidden:function(menuobj){
		var _this=this;
		if(!_this.zzObj){return;}
		if(!menuobj){return;}	
		menuobj=$("#"+menuobj);
		
		_this.zzObj.css({display:"none"});
		menuobj.css({display:"none"});
	}	

};


//=======================================================================================


//phone.info.show(text,isok)
//phone.info.hide()
//text长度改为了360pt适应pad  手机用120pt
phone.info={
	isExist:false,
	isRun:false,
	has3d:phone.set.has3d,
	css_s:(this.has3d)? "translate3d(" : "translate(",
	css_e:(this.has3d)? ",0)" : ")",
	fn:null,
	errimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVdJREFUeNq0V1tsVFUUXee+pnc6MI8+qC3QViiNJlVERVHUH0pi5ENifaQGgx8m/miM8UMMfmiMmpiY+IFRA0ow9scaEh8hxoQPUDAa5FFjKG3BCh2h05l2ptNO587ce9z70g5M53V/3MlJ7uxz9lpn77P3PmeE1J9GJZE0ppDFeZnCbzKBizJtTMPqcYBOmoosLksowKUQjKGP7RELHkU4FYgTsHBaTuOkjKtjcrbfgrPThNobgS/QKHyoh+qum4ONKZml9dl0BvZRA8rgOrFi4M38Obsqsa09VaRwyM8LMo1fZAynML1TgXivC4Hue0UEXWIFGkDQECU2vNERsvudInMBs8Ok2/OJPXq4InH+JmLyCufkDJFOmZcxf2gdAn0PiEZ0E2Hdooe1ZIEiMCxncUJOYQzpwTXwP/eqfTpTQpzTnizs+iyRUmjbksh9f4cIbbxfNLgeFklrGKK7DWJdy/U8GLsKOTwBRKeLlsXJjV9lnB05E4S+42X7j4mb5xXHJQXtMo0hpEzay5EtonHjI6IZYSJdml8aMmBCvLgdyr4X3MHfrFu+jm0Zg7EY83PtPnMZsUSMAnQeKYb9qksEejaJMIVWcaOwfNjjk1B23EOWwh38zbpyaxmDsRiTsUs8/lvO83d/I3w77xQhUPa6pVRuxLNzgKHdQKBv1lVaz1iMydhfaw/2F4gnydsZWIYPylsdVCR0HmV3X/DYDWSxsK6aDWMyNnP8oD3sJo1y1VmAkNgVkNr6VtqfI2WNUZrJrKtlx9jMQVy7F0PtcDh2R4RB+xJVd740Sog92DB2A3H4oe5iG01ARKhGtzRQIBwPdepU0Hmxpa6HedhbTqrbIpomxGYdispJUM6bct5V8riWMIcpVDUHZ7NGpJ1+N4ulB1OUXSU9ErMwF9VQp6ZJETQWaxaeQl3GY+mdmLmoNQc1jQ5dXUwqL5IvW07eiZmLORUVSlIRSknLqzQSoBPKZG94a+XdvuzVnrlcTkrzS1IjYuGtLOghgGMfHiwQH/vgAN/FnmyZg7mYU4ybj0cgxCQ0RZXphZqhiiKDU/RAOEP9jmUjQrib+jE3iJqvjkAdnZVDJyObxXjTMxQ667gS9G+1own8n6K2RuAk53/umP3mIU3yLiC/hE/fKg0qKzqzaqKtboR+2xro1GC5V+ZGJpA7fwX5aLy6t3yx+HQqZn3AxXFmM1BC9QedvP260hLuzP8Tq2xN16BYYSL02hPw925yVenDJ5B442DNnFZbwhRheUmEAgdcqFwiBakKi663vSLoB2hUSxBrYqpAylL/2GZkL/5bvbcTJmNLXd3bfmG/df2SkA5yMUqUleYATXyrda6CNMtfjZwXY7lkSdcazc1UJGUsF5OwO4b3DxSCxyHKT6eRj6cg/L5nRTgwZGxYTWdhlL3Yr2VSOP7RoQLx0fc/c2u73FrGYCzGZOyiM/8T2wvn5+tqg96+qk2przuSi8Z7rOErsGfSRR5OUDmdplIaQtLtQj10zd9FJdWCuuIzDQVgdK+G3tow5MwtPNr+47tFjz0xtETMP3QNRlcrjFtvCWiNwS/ysZk+ayQKa/waZDbn7R8CZa6+thm+DW3QmkKD+ank8+3fvZ0uWXcOvSWZa7SvIkPabXtzH2neyceS3dZoFLnLMdipOZQ8Q8hGXVkPfU0TDCozrSk4Sto9bZ++Mlhxg2eXE98cKgKh8KsE1C80tU/m7F7q06ZDf1aWIsAeKvS8VUxfRujqT9J2BvOTMwNrB/ZU/wtzBtuqzJIn4cD1CLiehExhGreTfj3NBhdXJalAR2XG+qtt30sZr13sPwEGAJ9VE3aPBYcqAAAAAElFTkSuQmCC",
	okimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBtJREFUeNqslk+ME1Ucx79v5s1Ot9tu9x+VIqgBVDTRcOHIQQ7EhLh6ABOPnA3cPJgYj8YbnDDcPZgQTTyQbJSbNz2QCBxwyWq6LgLWdlraTufPe8/fzL5pXodZtrvhJd9MOzPvfeb33u8fm+lit8GMKzP+Z0MZgnEtHHwXUCKrQMxYXBZI7QTmU4C4lqOv2X3oxQUpzkkUWF4IzGC2AXG1ZrR4DpgAQlKgFWoJrYlt5jvAMtAsqbwgrdpqn589HNtnXfBDZeW8oaCkz+IHQ0TNLS5ufV+N13ym+vS+rxXodSegzHAay4CVSHOk6icdfPh6bF1a5q805uyD4KxkeIuCUCP040doiebmfUddubGANXqUgAekESnSUGkCWQ5WKUksXnyMLxqcX1hx3obFOEbSQ0CKpJ9OcqwyStYCXJJQIVrhPTyU8tvrB/E1Pe5psK+hqTPZ9ucT1rnastrFTXxZt3FhceY4gbroRk0MRCuFCRWnSn77wiN16IstlO06WNR+97iHuds1/Gac49hzE6BpXXJm1Y+aOH9E4NLC7CGEcoAhgRILdhoygathCnX5PCy/f7I2xPr6PP4yvDaFWsb5pY5SjVBr9HDZoo2NaKGB7KRXYXxukZJ3+rKNWAkkc1/18JkrUNG7NvZsy4i55KZ7+k+ccxjqjlWhreoiljFZgKmUvOuLHhy7Alrj5TMbOKdDyclYeaBT7eG05W4vEMlwalimSAbp1SJEzcOZXOwybgDTYOdDnMRy8rWCtkdh70OB0VxFq9k+3splJ8bz6UwFWBFSW4f9jUjpnQlxIJ9/n8mlYYw4jim+HfFsXZhyCHKciCKPJHZK3uNEGwq0gxHqzNUnvJ9Npa2hNUBrPclVkBSYwdKsP1LYGPVR5xT+trNPCynyAsoxQ4b7Og6lGYfKKDFhZx4/DT36QV8Yi2R79qZkTkDJbEBreBX8oitHnAdmZSZYfwdr/adoDdp0g16Vcg9hkTgbzRn8R0l0gK17p3BTA6N8ppH6ZuAtodVawrXeQ5rY3l5gKqgB6/0DtJbxjV9GV5epzEJkyXuiZ3l0DA+W7uCI6uHNJHDYzLZjKzZZxjONYS2g2wTaNr67vYrr9OiprhZZQVYmcGK0j+LXyl28JP7FCcpYYGYLRRSlrRJ01gEVot4WwShVezZu/H4eX0k7tW5owOTzCvCsLlOVEz/g4+rf+LRUxkppkfIUpWPubk+IabNCgvmdNAyedF/D1T9W8aO27LkFuKjFKGUtxmwbi4d/xgelx3jPHuGoJdBID55jS7jY8Bu4tfk+bgbVsVVZixHlGqoJYFETlTVOZiNla5neHRlNVAbKd2+FXZsyGh9leG+ov5prmNmXmm1ilA/03drEfCdt9p2WAXuhjXARWLyoVv9/AQYAzRaQFve6TfoAAAAASUVORK5CYII=",
	show:function(text,isok){
		this.create();
		
		
		if(this.isRun){
			this.list.push({text:text,isok:isok});
			return;
		}
		this.isRun=true;
		
		var obj=$("#creates_message_info_box"),
			that=this;
		
		
		obj.find(".creates_message_info_text").text(text);
		if(isok){
			obj.find(".creates_message_info_img").css({background:"url("+that.okimg+")"});	
		}else{
			obj.find(".creates_message_info_img").css({background:"url("+that.errimg+")"});	
		}
		
		
		obj.css({display:"-webkit-box"});
		obj.cssAnimate({
			opacity:0.9,
			"-webkit-transform":that.css_s+"0,-90px"+that.css_e
		},300,function(){
			that.fn=setTimeout(function(){
				that.hide();
				if(that.list.length!=0){
					setTimeout(function(){
						that.isRun=false;
						var data=that.list.shift();
						that.show(data.text,data.isok);
					},0);	
				}else{
					that.isRun=false;	
				}	
			},2000)	
		})
		
	},
	create:function(){
		if(this.isExist){ return;}
		
		$("html").append("<div id='creates_message_info_box'><div class='creates_message_info_main'><div class='creates_message_info_img'></div><div class='creates_message_info_text' style='color: #eee;'></div></div></div>");
		
		_$box=$("#creates_message_info_box");
		_$info=_$box.find(".creates_message_info_main");
		_$img=_$info.find(".creates_message_info_img");
		_$text=_$info.find(".creates_message_info_text");
		
		
		
		_$box.css({
			height:"30pt",
			width:"100%",
			"z-index":"2000",
			"position":"absolute",
			left:"0",
			bottom:"-30pt",
			display:"none",
			opacity:"0",
			"-webkit-box-pack":"center"
		})
		
		_$info.css({
			height:"30pt",
			"border-radius":"5pt",
			"-webkit-box-shadow":"0 0 2pt 2pt #aaa"	,
			background:"#333",
			color:"#eee",
			"line-height":"30pt",
			display:"-webkit-box",
			"-webkit-box-orient":"horizontal"
		});
		
		_$img.css({
			width:"16pt",
			height:"16pt",
			margin:"7pt",
			background:"url("+this.errimg+")",
			"-webkit-background-size":"16pt 16pt"
		});
		
		_$text.css({
			margin:"0 7pt 0 0",
			height:"30pt",
			width:"auto",
			"max-width":"360pt",
			"line-height":"30pt",
			"text-overflow":"ellipsis",
			"white-space":"nowrap",
			overflow:"hidden"
		})
		
		this.isExist=true;
	},
	hide:function(){
		var obj=$("#creates_message_info_box");
		
		if(obj){
			obj.css({display:"none",opacity:0,"-webkit-transform":""});
		}
	},
	list:[]	
};


//=======================================================================================


//android 有问题
//phone.alert.show(type,title,text,yesfn,yestext,nofn,notext)

//type:is alert?
//title:title
//text:info
//yesfn:yes button callback function
//yestext:yes button text
//nofn:no button callback function
//notext:no button text
phone.alert={
	buttonImg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAABBCAIAAAB0GOKxAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACoSURBVHjabI/BDsIwDEOdbr/AFfHbHPkK/ggEEhIHJqGxpix2NzqJS5+S2HFqx9MZQH/Y7wLDawhkeKCUErCMAJyVlxbx0EBMWb4sCSSZXHbCPQsuX2nyXEFcMvuUB9m9tJI1fWJsnbGZoFs+I4Puj2fgPVIJs5/kL3qDbSr9nc2l4pIVdQZVnZCqpGu3pEXZGqoSlprmsjNtL+tk4CzR2F+utxlfAQYAW/JRLG3SVNsAAAAASUVORK5CYII=",
	buttonImg1:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAA/CAIAAACq8uU+AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAACFSURBVHjazJExDgIxDATXvnySilfct6GgAhIb6eTdiziBKEk1yng3UWKn84ptNVusKDOLIqLI3WVRNDSHUCKZiMG5RChBysnupw0R1JdK0DI626B17DaOzSk7Ogm6QeLYcn/UYLtebkW9c8/c3hP/Ts2/Whh/2n7sg9nnxPS/T77kS4ABAGtPSEXTKIfYAAAAAElFTkSuQmCC",
	isExist:false,	
	isRun:false,
	className:null,
	yesFn:null,
	noFn:null,
	show:function(type,title,text,yesfn,yestext,nofn,notext){
		//is runing
		if(this.isRun){
			this.list.push({type:type,title:title,text:text,yesfn:yesfn,yestext:yestext,nofn:nofn,notext:notext});
			return;	
		}
		this.isRun=true;
		
		
		//go..........
		this.create();

		if(yesfn){
			this.yesFn=yesfn;
		}else{
			this.yesFn=null;	
		}
		if(yesfn){
			this.noFn=nofn;
		}else{
			this.noFn=null;
		}
		

		var _box=$("#creates_message_alert_box");
		var _alert=_box.find(".creates_message_alert_main");

		var _title=_box.find("b");
		var _info=_box.find("span");
		var _yes=_box.find(".creates_message_alert_button_ok");
		var _no=_box.find(".creates_message_alert_button_esc");
		
		//is alert?
		if(type){
			_no.css({display:"none"});	
		}else{
			_no.css({display:"block"});	
		}
		
		//add value
		_title.text(title);
		_info.text(text);
		if(yestext){
			_yes.text(yestext);
		}else{
			_yes.text("好的")	
		}
		if(notext){
			_no.text(notext);
		}else{
			_no.text("不，谢谢");	
		}
		
		//animate
		_box.css({display:"-webkit-box",background:"rgba(0,0,0,0)"});
		
		var that=this;
		
		
		setTimeout(function(){
			_box.cssAnimate({
				background:"rgba(0,0,0,0.4)"	
			},300,function(){
				_alert.css({display:"-webkit-box"}).addClass(that.className)	
			})
		},0)
		

		/*
		_alert.css({display:"-webkit-box"})
		_alert.cssAnimate1({
			"-webkit-transform":"scale(1.1,1.1,1.1)"},200,function(){
				_alert.cssAnimate1({"-webkit-transform":"scale(0.95,0.95,0.95)"},100,function(){
					_alert.cssAnimate1({"-webkit-transform":"scale(1,1,1)"},50)	
				})	
		})
		*/
		
	},
	create:function(){
		if(this.isExist){ return;}
		
		var a=new phone.addCssAnimateClass({
			"0%":"-webkit-transform:scale(0.01,0.01,0.01)",
			"70%":"-webkit-transform:scale(1.1,1.1,1.1)",
			"90%":"-webkit-transform:scale(0.95,0.95,0.95)",
			"100%":"-webkit-transform:scale(1,1,1)"
		},200)

		this.className=a.className;
		
		
		$("body").append("<div id='creates_message_alert_box'><div class='creates_message_alert_main'><div class='creates_message_alert_text'><b>测试测试测试</b><span>阿飞的金卡lsd就付款啦阿</span></div><div class='creates_message_alert_buttons'><div class='creates_message_alert_button_ok'>123</div><div class='creates_message_alert_button_esc'>123</div></div></div></div>");		
		
		var _$box=$("#creates_message_alert_box");
		var _$main=_$box.find(".creates_message_alert_main");
		var _$title=_$box.find("b");
		var _$message=_$box.find("span");
		var _$info=_$box.find(".creates_message_alert_text");
		var _$buttons=_$box.find(".creates_message_alert_buttons");
		var _$button_y=_$box.find(".creates_message_alert_button_ok");
		var _$button_n=_$box.find(".creates_message_alert_button_esc");
		
		var title_img="data:image/png;base64,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"
		
		
		_$box.css({
			height:"100%",
			width:"100%",
			"z-index":"10010",
			"position":"absolute",
			left:"0",
			top:"0",
			display:"none",
			background:"rgba(0,0,0,0)",
			"-webkit-box-pack":"center",
			"-webkit-box-align":"center"
		})
		
		_$main.css({
			width:"200pt",
			height:"auto",
			color:"#fff",
			"position":"relative",
			"min-height":"100pt",
			"background":"rgba(17,32,65,0.9) url("+title_img+") no-repeat",
			"-webkit-background-size":"100% 22pt",
			"border":"2px #dfe1e6 solid",
			"-webkit-border-radius":"5pt",
			"text-shadow": "hsla(0,0%,0%,0.8) 0 -1px 0",
			"-webkit-box-shadow":"hsla(0,0%,0%,0.7) 0 1px 2px",
			display:"none",
			"-webkit-box-orient":"vertical"
		})
		
		_$info.css({
			"text-align":"center",
			margin:"2pt 10pt 2pt 10pt",
			"-webkit-box-flex":"1"	
		})
		
		_$title.css({
			"font-size":"13pt",
			width:"100%",
			height:"24pt",
			"line-height":"24pt",
			"text-align":"center",
			margin:"5pt 0",
			display:"block"	
		})
		
		_$message.css({
			width:"100%",
			display:"block",
			"word-wrap":"break-word", 
			"word-break":"break-all"
		})		
		
		_$buttons.css({
			display:"-webkit-box",
			width:"100%",
			height:"30pt",
			"margin":"5pt 0",
			"-webkit-box-align":"center",
			"-webkit-box-pack":"center",
			"-webkit-box-orient":"horizontal"
		})
		
		_$button_y.css({
			height:"26pt",
			"-webkit-box-flex":"0.5",
			margin:"0 5pt",
			"line-height":"26pt",
			"text-align":"center",
			background:"url("+this.buttonImg+")",
			"-webkit-background-size":"100% 26pt",
			border:"1px #131e3b solid",
			"text-decoration":"none",
			"-webkit-border-radius":"5px",
			"-webkit-box-shadow": "#454f69 0 1px 0"
		})
		
		_$button_n.css({
			height:"26pt",
			"-webkit-box-flex":"0.5",
			margin:"0 5pt",
			"line-height":"26pt",
			"text-align":"center",
			background:"url("+this.buttonImg+")",
			"-webkit-background-size":"100% 26pt",
			border:"1px #131e3b solid",
			"text-decoration":"none",
			"-webkit-border-radius":"5px",
			"-webkit-box-shadow": "#454f69 0 1px 0"				
		})
		
		this.addEvent();
		
		this.isExist=true;
	},
	addEvent:function(){
		var _this=this;
		var _box=$("#creates_message_alert_box");
		var _yes=_box.find(".creates_message_alert_button_ok").get(0);
		var _no=_box.find(".creates_message_alert_button_esc").get(0);
		
		new phone.createMyTouchEven(_yes);
		_yes.addEventListener("myclickdown",function(){
			$(this).css({background:"url("+_this.buttonImg1+")"})	
		},false)
		_yes.addEventListener("myclickup",function(){
			$(this).css({background:"url("+_this.buttonImg+")"})		
		},false)
		_yes.addEventListener("myclickok",function(){
			if(typeof(_this.yesFn)=="function"){
				_this.yesFn();	
			}
			_this.hide();
			_this.continues();
		},false)
		
		
		new phone.createMyTouchEven(_no);
		_no.addEventListener("myclickdown",function(){
			$(this).css({background:"url("+_this.buttonImg1+")"})	
		},false)
		_no.addEventListener("myclickup",function(){
			$(this).css({background:"url("+_this.buttonImg+")"})		
		},false)
		_no.addEventListener("myclickok",function(){
			if(typeof(_this.noFn)=="function"){
				_this.noFn();	
			}
			_this.hide();
			_this.continues();
		},false)
	},
	continues:function(){
		if(this.list.length!=0){
			var data=this.list.shift(),
				_this=this;
			
			setTimeout(function(){
				_this.isRun=false;
				_this.show(data.type,data.title,data.text,data.yesfn,data.yestext,data.nofn,data.notext);	
			},0)
		}else{
			this.isRun=false;	
		}
	},
	hide:function(){
		$("#creates_message_alert_box").css({display:"none"}).find(".creates_message_alert_main").css({display:"none"}).removeClass(this.className);
	},
	list:[]
};

//=======================================================================================


//phone.loading.show(text)
//phone.loading.hide()
phone.loading={
	isExist:false,
	rotateClass:null,
	show:function(text){
		this.create();
		
		var _box=$("#create_message_loading_box");
		var _text=_box.find(".x-loading-msg");
		var _rotate=_box.find(".x-loading-spinner");
		
		if(this.rotateClass){
			_rotate.addClass(this.rotateClass);
		}
		
		if(text){
			_text.text(text);
		}else{
			_text.text("加载中...");	
		}
		_box.css({display:"-webkit-box"});
	},
	create:function(){
		var that=this;
		if(that.isExist){return;}
		
		
		var a=new phone.addCssAnimateClass({
			"0%":"-webkit-transform:rotate(0deg)",
			"8.32%":"-webkit-transform:rotate(0deg)",
			"8.33%":"-webkit-transform:rotate(30deg)",
			"16.65%":"-webkit-transform:rotate(30deg)",
			"16.66%":"-webkit-transform:rotate(60deg)",
			"24.99%":"-webkit-transform:rotate(60deg)",
			"25%":"-webkit-transform:rotate(90deg)",
			"33.32%":"-webkit-transform:rotate(90deg)",
			"33.33%":"-webkit-transform:rotate(120deg)",
			"41.65%":"-webkit-transform:rotate(120deg)",
			"41.66%":"-webkit-transform:rotate(150deg)",
			"49.99%":"-webkit-transform:rotate(150deg)",
			"50%":"-webkit-transform:rotate(180deg)",
			"58.32%":"-webkit-transform:rotate(180deg)",
			"58.33%":"-webkit-transform:rotate(210deg)",
			"66.65%":"-webkit-transform:rotate(210deg)",
			"66.66%":"-webkit-transform:rotate(240deg)",
			"74.99%":"-webkit-transform:rotate(240deg)",
			"75%":"-webkit-transform:rotate(270deg)",
			"83.32%":"-webkit-transform:rotate(270deg)",
			"83.33%":"-webkit-transform:rotate(300deg)",
			"91.65%":"-webkit-transform:rotate(300deg)",
			"91.66%":"-webkit-transform:rotate(330deg)",
			"100%":"-webkit-transform:rotate(330deg)"
		},500);
		
		
		$("body").append("<style>.x-loading-spinner{font-size:250%;height:1em;width:1em;position:relative;-webkit-transform-origin:0.5em 0.5em}.x-loading-spinner > span,.x-loading-spinner > span:before,.x-loading-spinner > span:after{display:block;position:absolute;width:0.1em;height:0.25em;top:0;-webkit-transform-origin:0.05em 0.5em;-webkit-border-radius:0.05em;border-radius:0.05em;content:''}.x-loading-spinner > span.x-loading-top{background-color:rgba(170, 170, 170, 0.99)}.x-loading-spinner > span.x-loading-top::after{background-color:rgba(170, 170, 170, 0.9)}.x-loading-spinner > span.x-loading-left::before{background-color:rgba(170, 170, 170, 0.8)}.x-loading-spinner > span.x-loading-left{background-color:rgba(170, 170, 170, 0.7)}.x-loading-spinner > span.x-loading-left::after{background-color:rgba(170, 170, 170, 0.6)}.x-loading-spinner > span.x-loading-bottom::before{background-color:rgba(170, 170, 170, 0.5)}.x-loading-spinner > span.x-loading-bottom{background-color:rgba(170, 170, 170, 0.4)}.x-loading-spinner > span.x-loading-bottom::after{background-color:rgba(170, 170, 170, 0.35)}.x-loading-spinner > span.x-loading-right::before{background-color:rgba(170, 170, 170, 0.3)}.x-loading-spinner > span.x-loading-right{background-color:rgba(170, 170, 170, 0.25)}.x-loading-spinner > span.x-loading-right::after{background-color:rgba(170, 170, 170, 0.2)}.x-loading-spinner > span.x-loading-top::before{background-color:rgba(170, 170, 170, 0.15)}.x-loading-spinner > span{left:50%;margin-left:-0.05em}.x-loading-spinner > span.x-loading-top{-webkit-transform:rotate(0deg);-moz-transform:rotate(0deg)}.x-loading-spinner > span.x-loading-right{-webkit-transform:rotate(90deg);-moz-transform:rotate(90deg)}.x-loading-spinner > span.x-loading-bottom{-webkit-transform:rotate(180deg);-moz-transform:rotate(180deg)}.x-loading-spinner > span.x-loading-left{-webkit-transform:rotate(270deg);-moz-transform:rotate(270deg)}.x-loading-spinner > span::before{-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg)}.x-loading-spinner > span::after{-webkit-transform:rotate(-30deg);-moz-transform:rotate(-30deg)}.x-loading-spinner{-webkit-animation-iteration-count:infinite;-webkit-animation-timing-function:linear}}</style><div id='create_message_loading_box'><div class='create_message_loading_main'><div class='x-loading-spinner' style='margin:0 auto 7px;'><span class='x-loading-top'></span><span class='x-loading-right'></span><span class='x-loading-bottom'></span><span class='x-loading-left'></span></div><div style='color:#eee' class='x-loading-msg'>加载中...</div></div></div>")
		
		var _box=$("#create_message_loading_box");
		var _main=_box.find(".create_message_loading_main");
		var _text=_box.find(".x-loading-msg");

		_box.css({
			display:"none",
			"position":"absolute",
			left:"0",
			top:"0",			
			"-webkit-box-pack":"center",
			"-webkit-box-align":"center",
			width:"100%",
			height:"100%",
			"z-index":"10011"	
		})
		_main.css({
			color:"#ccc",
			padding:"15pt 40pt 5pt 40pt",
			background:"rgba(0,0,0,0.8)",
			"-webkit-border-radius":"5pt"
		})
		_text.css({
			height:"30pt",
			"line-height":"30pt"
		})
		

		that.rotateClass=a.className;
		
		
		that.isExist=true;
	},
	hide:function(){
		$("#create_message_loading_box").css({display:"none"}).find(".x-loading-spinner").removeClass(this.rotateClass);
	}	
};

//=======================================================================================


//将input模拟成password    id  替换的字符
/*
 可以加个这个css 不用下面的js  项目中未使用过
<input type="text" style=" -webkit-text-security: disc" name="aa" id="aa" />
*/
phone.text2password=function(objid,replaceStr){
	this.replaceStr=replaceStr || "*";
	this.text=$("#"+objid).get(0);
	this.$text=$("#"+objid);
	this.password="";

	this.type="";
	this.interval="";
	
	this.keydownHandler="";
	this.inputHandler="";
	
	this.init();	
};
phone.text2password.prototype={
	init:function(){
		var _this=this;
		this.text.addEventListener("input",_this.inputHandler=function(e){_this.inputHandlerDo(e);},false);
		this.text.addEventListener("keydown",_this.keydownHandler=function(e){_this.keydownHandlerDo(e);},false);		
	},
	remove:function(){
		var _this=this;
		this.text.removeEventListener("input",_this.inputHandler,false);
		this.text.removeEventListener("keydown",_this.keydownHandler,false);				
	},
	keydownHandlerDo:function(e){	
		clearTimeout(this.interval);
		this.changePasswordShow();
		

	
		var temp_a=parseInt(e.keyCode);
		//8：后退   46：del
		if(temp_a==8){
			if(this.password=="" ){
				e.preventDefault();
			}else{
				this.type="back";	
			}
			
		}else{
			if(temp_a==46){
				e.preventDefault();  //暂时未做del
				this.type="del";
			}else{
				this.type="add";
			}	
			
		}

	},
	inputHandlerDo:function(e){
		var oldpassword=this.password;
		var tempnewpassword=this.$text.val();
		
		//android获取的是变化前的焦点位置
		
		var cursorpointS=e.target.selectionStart;
		var cursorpointE=oldpassword.length-e.target.selectionEnd;	
		var cursorpointToE=e.target.selectionEnd;
		

		
		
		if(cursorpointToE>=tempnewpassword.length && cursorpointS!=cursorpointToE){
			//无法确定变化前的焦点末尾位置	
			var cursorpointEjs="";
			
			var n_l=tempnewpassword.length;
			for(var i=1;i<n_l+1;i++){
				if(tempnewpassword.substring(n_l-i,n_l-i+1)!=this.replaceStr){
					//cursorpointToE=n_l-i+1;
					cursorpointEjs=i-1;
					break;
				}	
			}
			
			if(cursorpointEjs!=""){
				var changeval=tempnewpassword.substring(cursorpointS,tempnewpassword.length-cursorpointEjs);
				this.password=oldpassword.substring(0,cursorpointS)+changeval+oldpassword.substring(oldpassword.length-cursorpointEjs);	
			}else{
				//按的backspace
				var o_l=oldpassword.length;
				this.password=oldpassword.substring(0,cursorpointS)+oldpassword.substring(cursorpointS+o_l-n_l);	
			}
			
		}else{
			//可以取得选取前的焦点	
			
			//是输入
			if(this.type=="add" || this.type==""){
				//值改变时	
				var changeval=tempnewpassword.substring(cursorpointS,tempnewpassword.length-cursorpointE);
				this.password=oldpassword.substring(0,cursorpointS)+changeval+oldpassword.substring(oldpassword.length-cursorpointE);	
			}
			//是按的backspace
			if(this.type=="back"){
				if(cursorpointToE==cursorpointS){
					cursorpointToE += 1;	
				}
				this.password=oldpassword.substring(0,cursorpointS)+oldpassword.substring(cursorpointToE);
			}
			//是按的del
			if(this.type=="del"){
				//暂时未做
			}
		}
		
		
		this.type="";
		

		
		
		//temp
		//$("#login_user").val(this.password)
		
		var _this=this;
		this.interval=setTimeout(function(){
			_this.changePasswordShow();
		},500)	
	},
	getInputCursorPosition:function(){
		var _this=this.text;
			
		var rangeData = {text: "", start: 0, end: 0 };
	
		if (_this.setSelectionRange) {
			_this.focus();
			rangeData.start= _this.selectionStart;
			rangeData.end = _this.selectionEnd;
			rangeData.text = (rangeData.start != rangeData.end) ? _this.value.substring(rangeData.start, rangeData.end): "";
		} 
		
		return rangeData;
	},
	setInputCursorPosition:function(start,end){
		var _this=this.text;
		
		start = parseInt(start) || 0;
		end = parseInt(end) || 0;
		
		_this.focus();
		_this.setSelectionRange(start,end);
	},
	changePasswordShow:function(){
		var _this=this;
		var temp_timeoutdata=_this.getInputCursorPosition();
		var str_length=_this.$text.val().length;
		var temp_str="";
		for(var i=0;i<str_length;i++){
			temp_str += this.replaceStr;		
		}
		_this.$text.val(temp_str);	
		_this.setInputCursorPosition(temp_timeoutdata.start,temp_timeoutdata.end);
	}	
};


//=======================================================================================
/*
    动态加载js文件    phone.loads.jsFile(src,callback)
    动态加载js文本    phone.loads.jsText(text,callback)
    动态加载css文件   phone.loads.cssFile(src,callback)
    动态加载html文件  phone.loads.htmlFile(id,src,callback)    id为需要装载的dom元素的id

    整合的
 phone.loads.files({
        js:[],                  js文件路径文件名
        css:[],                 css文件路径文件名
        html:[],                html文件路径文件名
        htmlId:[],              与html数组对应，要加载到的对象id
        success:function        加载完成回调
 })
*/
phone.loads={
    jsFile:function(file,callback){
        var head = document.getElementsByTagName('HEAD').item(0);
        var script = document.createElement('SCRIPT');
        script.src = file+"?s="+new Date().getTime();
        script.charset = "utf-8";
        script.type = "text/javascript";
        head.appendChild(script);

        script.onload = script.onreadystatechange = function(){
            if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete'){
                if(typeof(callback)=="function"){
                    callback();
                }
            }
            script.onload=script.onreadystatechange=null;
        };
    },
    jsText:function(text,callback){
        //$.post(file+"?s="+new Date().getTime(),function(data){
            var head = document.getElementsByTagName('HEAD').item(0);
            var script = document.createElement('SCRIPT');
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.defer = true;
            script.text = text;
            head.appendChild(script);

            if(typeof(callback)=="function"){
                callback();
            }
        //})
    },
    cssFile:function(file,callback){
        var head = document.getElementsByTagName('HEAD').item(0);
        var css = document.createElement('link');
        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = file+"?s="+new Date().getTime();
        head.appendChild(css);


        var  styleOnload=function(node, callback) {
            // for IE6-9 and Opera
            if (node.attachEvent) {
                node.attachEvent('onload', callback);
                // NOTICE:
                // 1. "onload" will be fired in IE6-9 when the file is 404, but in
                // this situation, Opera does nothing, so fallback to timeout.
                // 2. "onerror" doesn't fire in any browsers!
            }
            // polling for Firefox, Chrome, Safari
            else {
                setTimeout(function() {
                    poll(node, callback);
                }, 0); // for cache
            }
        }

        var poll=function(node, callback) {
            if (callback.isCalled) {
                return;
            }

            var isLoaded = false;

            if (/webkit/i.test(navigator.userAgent)) {//webkit
                if (node['sheet']) {
                    isLoaded = true;
                }
            }
            // for Firefox
            else if (node['sheet']) {
                try {
                    if (node['sheet'].cssRules) {
                        isLoaded = true;
                    }
                } catch (ex) {
                    // NS_ERROR_DOM_SECURITY_ERR
                    if (ex.code === 1000) {
                        isLoaded = true;
                    }
                }
            }

            if (isLoaded) {
                // give time to render.
                setTimeout(function() {
                    callback();
                }, 1);
            }
            else {
                setTimeout(function() {
                    poll(node, callback);
                }, 1);
            }
        }

        styleOnload(css,function(){
            if(typeof(callback)=="function"){
                callback();
            }
        });
    },
    htmlFile:function(id,file,callback){
        $.post(file+"?s="+new Date().getTime(),function(data){
            if(typeof(callback)=="function"){
                $("#"+id).html(data);
                callback();
            }
        })
    },
    files:function(datas){
        var jsfile = datas.js,
            cssfile = datas.css,
            htmlfile = datas.html,
            htmlid = datas.htmlId,
            success = datas.success;

        if($.isArray(jsfile) ){}else{return;}
        if($.isArray(cssfile) ){}else{return;}
        if($.isArray(htmlfile) ){}else{return;}
        if($.isArray(htmlid) ){}else{return;}
        if(htmlfile.length != htmlid.length){return;}
        success = ( typeof(success) == "function") ? success : function(){};

        var filse = jsfile.length + cssfile.length + htmlfile.length,
            loaded = 0,
            loadsuccess = function (){
                loaded++;
                if(filse == loaded){
                    //load complete
                    success();
                }
            };

        for (var i= 0,l=jsfile.length;i<l;i++){
            phone.loads.jsFile(jsfile[i],loadsuccess);
        }
        for (var i= 0,l=cssfile.length;i<l;i++){
            phone.loads.cssFile(cssfile[i],loadsuccess);
        }
        for (var i= 0,l=htmlfile.length;i<l;i++){
            phone.loads.htmlFile(htmlid[i],htmlfile[i],loadsuccess);
        }
    }
};



//=======================================================================================
/*
 显示日期控件
 phone.datatime.show(callback)

 callback:选取日期后回调，返回data对象
年：data.year
月：data.month
日：data.day
 */

//datatime1 手机版  scroll也要改
/*
phone.datatime1={
    zz:null,
    obj:null,
    yearobj:null,
    monthobj:null,
    dayobj:null,
    yesbtnid:null,
    nobtnid:null,
    mainbg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEsCAIAAABhTr74AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxQkIzNjBFRjYzNTExRTE5OEE5RjJCMENCODE5MkVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxQkIzNjBGRjYzNTExRTE5OEE5RjJCMENCODE5MkVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzFCQjM2MENGNjM1MTFFMTk4QTlGMkIwQ0I4MTkyRUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzFCQjM2MERGNjM1MTFFMTk4QTlGMkIwQ0I4MTkyRUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4HTtbTAAAz70lEQVR42ux9a48kyXVd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",
    yesbg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NTZEMTc5RjYzNTExRTFCQUI0QzY3QTM4MjBFQTU5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2NTZEMTdBRjYzNTExRTFCQUI0QzY3QTM4MjBFQTU5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDY1NkQxNzdGNjM1MTFFMUJBQjRDNjdBMzgyMEVBNTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDY1NkQxNzhGNjM1MTFFMUJBQjRDNjdBMzgyMEVBNTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6A4TKXAAAGT0lEQVR42uxafWxTVRQ/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",
    yesbg_:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI5QTVCNzk1RjYzQTExRTFCMDE2OUZBNERFQzA3MEM1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI5QTVCNzk2RjYzQTExRTFCMDE2OUZBNERFQzA3MEM1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjlBNUI3OTNGNjNBMTFFMUIwMTY5RkE0REVDMDcwQzUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjlBNUI3OTRGNjNBMTFFMUIwMTY5RkE0REVDMDcwQzUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75T80OAAAGXklEQVR42uyaCUxURxiA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",
    nobg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRCQkRDQjg3RjYzNTExRTFCMjM4RkE4OUEwQ0Q2NjRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRCQkRDQjg4RjYzNTExRTFCMjM4RkE4OUEwQ0Q2NjRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REJCRENCODVGNjM1MTFFMUIyMzhGQTg5QTBDRDY2NEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REJCRENCODZGNjM1MTFFMUIyMzhGQTg5QTBDRDY2NEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N0S0eAAAGeUlEQVR42uxabUiUWRQ+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",
    nobg_:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5QUEwMURDRjYzQTExRTE5RkQyQTdDM0UzQURCMjRCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5QUEwMURERjYzQTExRTE5RkQyQTdDM0UzQURCMjRCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTlBQTAxREFGNjNBMTFFMTlGRDJBN0MzRTNBREIyNEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTlBQTAxREJGNjNBMTFFMTlGRDJBN0MzRTNBREIyNEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5759WGAAAGaklEQVR42uxaa0iUWRh+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",
    createZZ:function(){
        $("body").append("<div id='bens_add_phone_datatime_zz'></div>");
        this.zz = $("#bens_add_phone_datatime_zz");
        this.zz.css({
            width:"100%",
            height:"100%",
            display:"none",
            background:"rgba(0,0,0,0)",
            position: "absolute",
            left:0,
            top:0,
            "-webkit-box-pack":"center",
            "-webkit-box-align":"center"
        })
    },
    createObj:function(){
        var _this = this;
        this.zz.append("<div id='bens_add_phone_datatime_obj'></div>");
        this.obj = $("#bens_add_phone_datatime_obj");
        this.obj.css({
            width:"270px",
            height:"225px",
            "background":" url("+_this.mainbg+")",
            "-webkit-background-size":"100% 100%",
            display:"none",
            "-webkit-box-orient":"horizontal",
            position: "relative"
        });
        this.obj.append("<div id='bens_add_phone_datatime_obj_y'><ul id='bens_add_phone_datatime_obj_year'></ul></div><div id='bens_add_phone_datatime_obj_m'><ul id='bens_add_phone_datatime_obj_month'></ul></div><div id='bens_add_phone_datatime_obj_d'><ul id='bens_add_phone_datatime_obj_day'></ul></div>")
        var yearobj = $("#bens_add_phone_datatime_obj_y");
        var monthobj = $("#bens_add_phone_datatime_obj_m");
        var dayobj = $("#bens_add_phone_datatime_obj_d");

        yearobj.css({
            width:"94px",
            height:"165px",
            //background:"rgba(0,0,0,0.5)",
            "margin":"50px 0 0 12px",
            overflow:"hidden"
        })
        monthobj.css({
            width:"70px",
            height:"165px",
            //background:"rgba(0,0,0,0.5)",
            "margin":"50px 0 0 5px",
            overflow:"hidden"
        })
        dayobj.css({
            width:"72px",
            height:"165px",
            //background:"rgba(0,0,0,0.5)",
            "margin":"50px 0 0 5px",
            overflow:"hidden"
        })

        this.yearobj = $("#bens_add_phone_datatime_obj_year");
        this.monthobj = $("#bens_add_phone_datatime_obj_month");
        this.dayobj = $("#bens_add_phone_datatime_obj_day");
    },
    createButton:function(){
        var _this = this;
        this.obj.append("<div id='bens_add_phone_datatime_obj_yes'></div><div id='bens_add_phone_datatime_obj_no'></div>")
        this.yesbtnid = "bens_add_phone_datatime_obj_yes";
        this.nobtnid = "bens_add_phone_datatime_obj_no";

        $("#bens_add_phone_datatime_obj_yes").css({
            position:"absolute",
            top:"6px",
            right:"8px",
            width:"52px",
            height:"28px",
            background:"url("+ _this.yesbg+")",
            "-webkit-background-size":"100% 100%"
        })

        $("#bens_add_phone_datatime_obj_no").css({
            position:"absolute",
            top:"6px",
            right:"69px",
            width:"52px",
            height:"28px",
            background:"url("+ _this.nobg+")",
            "-webkit-background-size":"100% 100%"
        })

    },
    addData:function(){
        this.yearobj.append("<div style='width:100%; height:33px;'></div>");
        this.yearobj.append("<div style='width:100%; height:33px;'></div>");
        for(var i=0;i<100;i++){
            var a=1950+i;
            this.yearobj.append("<div style='width:100%; height: 33px; text-align: center; line-height: 33px;'>"+a+"</div>");
        }
        this.yearobj.append("<div style='width:100%; height:33px;'></div>");
        this.yearobj.append("<div style='width:100%; height:33px;'></div>");

        this.monthobj.append("<div style='width:100%; height:33px;'></div>");
        this.monthobj.append("<div style='width:100%; height:33px;'></div>");
        for(var i=0;i<12;i++){
            var a=1+i;
            this.monthobj.append("<div style='width:100%; height: 33px; text-align: center; line-height: 33px;'>"+a+"</div>")
        }
        this.monthobj.append("<div style='width:100%; height:33px;'></div>");
        this.monthobj.append("<div style='width:100%; height:33px;'></div>");

        this.dayobj.append("<div style='width:100%; height:33px;'></div>");
        this.dayobj.append("<div style='width:100%; height:33px;'></div>");
        for(var i=0;i<31;i++){
            var a=1+i
            this.dayobj.append("<div style='width:100%; height: 33px; text-align: center; line-height: 33px;'>"+a+"</div>")
        }
        this.dayobj.append("<div style='width:100%; height:33px;'></div>");
        this.dayobj.append("<div style='width:100%; height:33px;'></div>");
    },
    yearScroller:null,
    monthScroller:null,
    dayScroller:null,
    autoDayDom:function(){
        var _this = phone.datatime,
            year_no = parseInt(Math.abs(_this.yearScroller.scrollTop)/33)+ 2,
            year = null,
            month_no = parseInt(Math.abs(_this.monthScroller.scrollTop)/33)+ 2,
            month = null;

        var yeardom = _this.yearobj.find("div").get(year_no);
        if(yeardom){ year = parseInt(yeardom.innerText)};
        var monthdom = _this.monthobj.find("div").get(month_no);
        if(monthdom) { month = parseInt(monthdom.innerText) };

        if( month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12 ){
            //day 31
            _this.dayobj.find("div").get(30).style.display = "block";
            _this.dayobj.find("div").get(31).style.display = "block";
            _this.dayobj.find("div").get(32).style.display = "block";

        }else if( month == 2){
            if((year%4==0 && year%100!=0)||year%400==0){
                //day 29
                _this.dayobj.find("div").get(30).style.display = "block";
                _this.dayobj.find("div").get(31).style.display = "none";
                _this.dayobj.find("div").get(32).style.display = "none";

            }else{
                //day 28
                _this.dayobj.find("div").get(30).style.display = "none";
                _this.dayobj.find("div").get(31).style.display = "none";
                _this.dayobj.find("div").get(32).style.display = "none";

            }
        }else{
            //day 30
            _this.dayobj.find("div").get(30).style.display = "block";
            _this.dayobj.find("div").get(31).style.display = "block";
            _this.dayobj.find("div").get(32).style.display = "none";
        }
        _this.dayScroller.refreshs();
    },
    eventBind:function(){
        var _this = this;
        this.yearScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_year",showScroll:false,dataTimeUse:true,slideLength:5,moveEndFn:_this.autoDayDom});
        this.monthScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_month",showScroll:false,dataTimeUse:true,slideLength:4,moveEndFn:_this.autoDayDom});
        this.dayScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_day",showScroll:false,dataTimeUse:true,slideLength:4});


        $$("#"+_this.yesbtnid).myclickdown(function(){
            $(this).css({background:"url("+_this.yesbg_+")"})
        });
        $$("#"+_this.yesbtnid).myclickok(function(){
            _this.returnChooseDate();
        });
        $$("#"+_this.yesbtnid).myclickup(function(){
            $(this).css({background:"url("+_this.yesbg+")"})
        });

        $$("#"+_this.nobtnid).myclickdown(function(){
            $(this).css({background:"url("+_this.nobg_+")"})
        });
        $$("#"+_this.nobtnid).myclickok(function(){
            _this.hidden();
        });
        $$("#"+_this.nobtnid).myclickup(function(){
            $(this).css({background:"url("+_this.nobg+")"})
        });

    },
    isCreate:false,
    createObjs:function(){
        this.createZZ();
        this.createObj();
        this.createButton();
        this.addData();
        this.eventBind();
    },
    callback:null,
    show:function(callback,str){
        if(typeof(callback)=="function"){
            this.callback = callback;
        }else{
            this.callback = null;
        }

        if(!this.isCreate){
            this.createObjs();
            this.isCreate = true;
        }

        str = str || new Date();
        str = parseInt(str);
        str = ( str > -631180800000 && str < 2556028800000  ) ? str : new Date();

        var nowtime = new Date(str),
            nowyear = nowtime.getFullYear()-1950,
            nowmonth = nowtime.getMonth(),
            nowday = nowtime.getDate()-1;
            //yearobjto = this.yearobj.find("div").get(nowyear),
            //monthobjto =  this.monthobj.find("div").get(nowmonth),
            //dayobjto = this.dayobj.find("div").get(nowday);



        this.zz.css({display:"-webkit-box"});
        this.zz.cssAnimate({
            background:"rgba(0,0,0,0.5)"
        },500);
        this.obj.css({display:"-webkit-box"});
        this.yearScroller.reloads();
        this.monthScroller.reloads();
        this.dayScroller.reloads();

        this.yearScroller.moveto(nowyear);
        this.monthScroller.moveto(nowmonth);
        this.dayScroller.moveto(nowday);

    },
    returnChooseDate:function(){
        var year_no = parseInt(Math.abs(this.yearScroller.scrollTop)/33)+ 2,
            year = this.yearobj.find("div").get(year_no).innerText,
            month_no = parseInt(Math.abs(this.monthScroller.scrollTop)/33)+ 2,
            month = this.monthobj.find("div").get(month_no).innerText,
            day_no = parseInt(Math.abs(this.dayScroller.scrollTop)/33)+ 2,
            day = this.dayobj.find("div").get(day_no).innerText;

        var data = {year:year,month:month,day:day};
        if(this.callback){ this.callback(data);}
        this.hidden();
    },
    hidden:function(){

        this.zz.css({display:"none",background:"rgba(0,0,0,0)"});
        this.obj.css({display:"none"});
    }
};
*/
//pad版
phone.datatime={
    zz:null,
    obj:null,
    yearobj:null,
    monthobj:null,
    dayobj:null,
    yesbtnid:null,
    nobtnid:null,
    mainbg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAEsCAIAAABhTr74AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxQkIzNjBFRjYzNTExRTE5OEE5RjJCMENCODE5MkVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxQkIzNjBGRjYzNTExRTE5OEE5RjJCMENCODE5MkVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzFCQjM2MENGNjM1MTFFMTk4QTlGMkIwQ0I4MTkyRUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzFCQjM2MERGNjM1MTFFMTk4QTlGMkIwQ0I4MTkyRUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4HTtbTAAAz70lEQVR42ux9a48kyXVd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",
    yesbg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NTZEMTc5RjYzNTExRTFCQUI0QzY3QTM4MjBFQTU5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2NTZEMTdBRjYzNTExRTFCQUI0QzY3QTM4MjBFQTU5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDY1NkQxNzdGNjM1MTFFMUJBQjRDNjdBMzgyMEVBNTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDY1NkQxNzhGNjM1MTFFMUJBQjRDNjdBMzgyMEVBNTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6A4TKXAAAGT0lEQVR42uxafWxTVRQ/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",
    yesbg_:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI5QTVCNzk1RjYzQTExRTFCMDE2OUZBNERFQzA3MEM1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI5QTVCNzk2RjYzQTExRTFCMDE2OUZBNERFQzA3MEM1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjlBNUI3OTNGNjNBMTFFMUIwMTY5RkE0REVDMDcwQzUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjlBNUI3OTRGNjNBMTFFMUIwMTY5RkE0REVDMDcwQzUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz75T80OAAAGXklEQVR42uyaCUxURxiA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",
    nobg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRCQkRDQjg3RjYzNTExRTFCMjM4RkE4OUEwQ0Q2NjRBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRCQkRDQjg4RjYzNTExRTFCMjM4RkE4OUEwQ0Q2NjRBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REJCRENCODVGNjM1MTFFMUIyMzhGQTg5QTBDRDY2NEEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REJCRENCODZGNjM1MTFFMUIyMzhGQTg5QTBDRDY2NEEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6N0S0eAAAGeUlEQVR42uxabUiUWRQ+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",
    nobg_:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAmCAYAAAB52u3eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE5QUEwMURDRjYzQTExRTE5RkQyQTdDM0UzQURCMjRCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5QUEwMURERjYzQTExRTE5RkQyQTdDM0UzQURCMjRCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTlBQTAxREFGNjNBMTFFMTlGRDJBN0MzRTNBREIyNEIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTlBQTAxREJGNjNBMTFFMTlGRDJBN0MzRTNBREIyNEIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5759WGAAAGaklEQVR42uxaa0iUWRh+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",
    createZZ:function(){
        $("body").append("<div id='bens_add_phone_datatime_zz'></div>");
        this.zz = $("#bens_add_phone_datatime_zz");
        this.zz.css({
            width:"100%",
            height:"100%",
            display:"none",
            background:"rgba(0,0,0,0)",
            position: "absolute",
            left:0,
            top:0,
            "-webkit-box-pack":"center",
            "-webkit-box-align":"center"
        })
    },
    createObj:function(){
        var _this = this;
        this.zz.append("<div id='bens_add_phone_datatime_obj'></div>");
        this.obj = $("#bens_add_phone_datatime_obj");
        this.obj.css({
            width:"360px",
            height:"300px",
            "background":" url("+_this.mainbg+")",
            "-webkit-background-size":"100% 100%",
            display:"none",
            "-webkit-box-orient":"horizontal",
            position: "relative"
        });
        this.obj.append("<div id='bens_add_phone_datatime_obj_y'><ul id='bens_add_phone_datatime_obj_year'></ul></div><div id='bens_add_phone_datatime_obj_m'><ul id='bens_add_phone_datatime_obj_month'></ul></div><div id='bens_add_phone_datatime_obj_d'><ul id='bens_add_phone_datatime_obj_day'></ul></div>")
        var yearobj = $("#bens_add_phone_datatime_obj_y");
        var monthobj = $("#bens_add_phone_datatime_obj_m");
        var dayobj = $("#bens_add_phone_datatime_obj_d");

        yearobj.css({
            width:"130px",
            height:"220px",     //每个44
            //background:"rgba(0,0,0,0.5)",
            "margin":"65px 0 0 12px",
            overflow:"hidden"
        })
        monthobj.css({
            width:"95px",
            height:"220px",
            //background:"rgba(0,0,0,0.5)",
            "margin":"65px 0 0 5px",
            overflow:"hidden"
        })
        dayobj.css({
            width:"95px",
            height:"220px",
            //background:"rgba(0,0,0,0.5)",
            "margin":"65px 0 0 5px",
            overflow:"hidden"
        })

        this.yearobj = $("#bens_add_phone_datatime_obj_year");
        this.monthobj = $("#bens_add_phone_datatime_obj_month");
        this.dayobj = $("#bens_add_phone_datatime_obj_day");
    },
    createButton:function(){
        var _this = this;
        this.obj.append("<div id='bens_add_phone_datatime_obj_yes'></div><div id='bens_add_phone_datatime_obj_no'></div>")
        this.yesbtnid = "bens_add_phone_datatime_obj_yes";
        this.nobtnid = "bens_add_phone_datatime_obj_no";

        $("#bens_add_phone_datatime_obj_yes").css({
            position:"absolute",
            top:"8px",
            right:"10px",
            width:"70px",
            height:"38px",
            background:"url("+ _this.yesbg+")",
            "-webkit-background-size":"100% 100%"
        })

        $("#bens_add_phone_datatime_obj_no").css({
            position:"absolute",
            top:"8px",
            right:"85px",
            width:"70px",
            height:"38px",
            background:"url("+ _this.nobg+")",
            "-webkit-background-size":"100% 100%"
        })

    },
    addData:function(){
        this.yearobj.append("<div style='width:100%; height:44px;'></div>");
        this.yearobj.append("<div style='width:100%; height:44px;'></div>");
        for(var i=0;i<100;i++){
            var a=1950+i;
            this.yearobj.append("<div style='width:100%; height: 44px; text-align: center; line-height: 44px;'>"+a+"</div>");
        }
        this.yearobj.append("<div style='width:100%; height:44px;'></div>");
        this.yearobj.append("<div style='width:100%; height:44px;'></div>");

        this.monthobj.append("<div style='width:100%; height:44px;'></div>");
        this.monthobj.append("<div style='width:100%; height:44px;'></div>");
        for(var i=0;i<12;i++){
            var a=1+i;
            this.monthobj.append("<div style='width:100%; height: 44px; text-align: center; line-height: 44px;'>"+a+"</div>")
        }
        this.monthobj.append("<div style='width:100%; height:44px;'></div>");
        this.monthobj.append("<div style='width:100%; height:44px;'></div>");

        this.dayobj.append("<div style='width:100%; height:44px;'></div>");
        this.dayobj.append("<div style='width:100%; height:44px;'></div>");
        for(var i=0;i<31;i++){
            var a=1+i
            this.dayobj.append("<div style='width:100%; height: 44px; text-align: center; line-height: 44px;'>"+a+"</div>")
        }
        this.dayobj.append("<div style='width:100%; height:44px;'></div>");
        this.dayobj.append("<div style='width:100%; height:44px;'></div>");
    },
    yearScroller:null,
    monthScroller:null,
    dayScroller:null,
    autoDayDom:function(){
        var _this = phone.datatime,
            year_no = parseInt(Math.abs(_this.yearScroller.scrollTop)/44)+ 2,
            year = null,
            month_no = parseInt(Math.abs(_this.monthScroller.scrollTop)/44)+ 2,
            month = null;

        var yeardom = _this.yearobj.find("div").get(year_no);
        if(yeardom){ year = parseInt(yeardom.innerText)};
        var monthdom = _this.monthobj.find("div").get(month_no);
        if(monthdom) { month = parseInt(monthdom.innerText) };

        if( month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12 ){
            //day 31
            _this.dayobj.find("div").get(30).style.display = "block";
            _this.dayobj.find("div").get(31).style.display = "block";
            _this.dayobj.find("div").get(32).style.display = "block";

        }else if( month == 2){
            if((year%4==0 && year%100!=0)||year%400==0){
                //day 29
                _this.dayobj.find("div").get(30).style.display = "block";
                _this.dayobj.find("div").get(31).style.display = "none";
                _this.dayobj.find("div").get(32).style.display = "none";

            }else{
                //day 28
                _this.dayobj.find("div").get(30).style.display = "none";
                _this.dayobj.find("div").get(31).style.display = "none";
                _this.dayobj.find("div").get(32).style.display = "none";

            }
        }else{
            //day 30
            _this.dayobj.find("div").get(30).style.display = "block";
            _this.dayobj.find("div").get(31).style.display = "block";
            _this.dayobj.find("div").get(32).style.display = "none";
        }
        _this.dayScroller.refreshs();
    },
    eventBind:function(){
        var _this = this;
        this.yearScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_year",showScroll:false,dataTimeUse:true,slideLength:5,moveEndFn:_this.autoDayDom});
        this.monthScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_month",showScroll:false,dataTimeUse:true,slideLength:4,moveEndFn:_this.autoDayDom});
        this.dayScroller = new phone.iscrolls({id:"bens_add_phone_datatime_obj_day",showScroll:false,dataTimeUse:true,slideLength:4});


        $$("#"+_this.yesbtnid).myclickdown(function(){
            $(this).css({background:"url("+_this.yesbg_+")"})
        });
        $$("#"+_this.yesbtnid).myclickok(function(){
            _this.returnChooseDate();
        });
        $$("#"+_this.yesbtnid).myclickup(function(){
            $(this).css({background:"url("+_this.yesbg+")"})
        });

        $$("#"+_this.nobtnid).myclickdown(function(){
            $(this).css({background:"url("+_this.nobg_+")"})
        });
        $$("#"+_this.nobtnid).myclickok(function(){
            _this.hidden();
        });
        $$("#"+_this.nobtnid).myclickup(function(){
            $(this).css({background:"url("+_this.nobg+")"})
        });

    },
    isCreate:false,
    createObjs:function(){
        this.createZZ();
        this.createObj();
        this.createButton();
        this.addData();
        this.eventBind();
    },
    callback:null,
    show:function(callback,str){
        if(typeof(callback)=="function"){
            this.callback = callback;
        }else{
            this.callback = null;
        }

        if(!this.isCreate){
            this.createObjs();
            this.isCreate = true;
        }

        str = str || new Date();
        str = parseInt(str);
        str = ( str > -631180800000 && str < 2556028800000  ) ? str : new Date();

        var nowtime = new Date(str),
            nowyear = nowtime.getFullYear()-1950,
            nowmonth = nowtime.getMonth(),
            nowday = nowtime.getDate()-1;
        //yearobjto = this.yearobj.find("div").get(nowyear),
        //monthobjto =  this.monthobj.find("div").get(nowmonth),
        //dayobjto = this.dayobj.find("div").get(nowday);



        this.zz.css({display:"-webkit-box"});
        this.zz.cssAnimate({
            background:"rgba(0,0,0,0.5)"
        },500);
        this.obj.css({display:"-webkit-box"});
        this.yearScroller.reloads();
        this.monthScroller.reloads();
        this.dayScroller.reloads();

        this.yearScroller.moveto(nowyear);
        this.monthScroller.moveto(nowmonth);
        this.dayScroller.moveto(nowday);

    },
    returnChooseDate:function(){
        var year_no = parseInt(Math.abs(this.yearScroller.scrollTop)/44)+ 2,
            year = this.yearobj.find("div").get(year_no).innerText,
            month_no = parseInt(Math.abs(this.monthScroller.scrollTop)/44)+ 2,
            month = this.monthobj.find("div").get(month_no).innerText,
            day_no = parseInt(Math.abs(this.dayScroller.scrollTop)/44)+ 2,
            day = this.dayobj.find("div").get(day_no).innerText;

        var data = {year:year,month:month,day:day};
        if(this.callback){ this.callback(data);}
        this.hidden();
    },
    hidden:function(){

        this.zz.css({display:"none",background:"rgba(0,0,0,0)"});
        this.obj.css({display:"none"});
    }
};

//=======================================================================================
//数据库操作

//初始   new phone.db("库名","大小 M");
//具体调用看函数上说明

phone.db=function(dbname,size){
    //if(!window.openDatabase){return;}

    this.dbName=dbname || "newDb";
    this.size=size || 2;

    this.db=null;   //db obj

    this.init();




};
phone.db.prototype={
    //初始化数据库
    init:function(){
        //this.db = openDatabase(this.dbName, '3.0', 'database for ' + this.dbName, this.size * 1024 * 1024);
        this.db = xFace.CMBC.SecurityStorage.openDatabase(this.dbName+"_t", '3.0', 'database for ' + this.dbName, this.size * 1024 * 1024);
    },


    //批量建表（建表时会自动创建 tablename_id 的自增id）
    //datas={
    //      tableName:array              表名 ["tablename","tablename"]
    //      fields:array                 字段名 [["name","password"],["name","password"]]
    //      success:function             事务成功回调
    //      error:function               事务失败回调,返回错误原因（失败会回滚）
    // }
    createTable:function(datas){
        var tableName = datas.tableName,
            fields = datas.fields,
            callBack = datas.success,
            error = datas.error;


        callBack = (typeof(callBack) == "function")? callBack : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if($.isArray(tableName) && tableName.length!=0  ){}else{ error("tableName参数错误"); return;}
        if($.isArray(fields) && fields.length!=0  ){}else{ error("fields参数错误"); return;}
        if(tableName.length != fields.length){ error("参数错误"); return; }

        this.db.transaction(function (tx) {
            for(var i= 0,l=tableName.length;i<l;i++){
                var pkField = tableName[i] + "_id",
                    sql = "CREATE TABLE IF NOT EXISTS " + tableName[i] + "( " + pkField + " integer primary key autoincrement,";

                sql += fields[i].join(",") + ")";
                tx.executeSql(sql);
            }
        },function(err){ error(err.message); },callBack )
    },


    //批量删除表 （失败回滚）
    // datas={
    //      tableName:array             表名 ["tablename","tablename"]
    //      success:function             事务成功回调
    //      error:function               事务失败回调,返回错误原因（失败会回滚）
    // }
    dropTable:function (datas) {
        var tableName = datas.tableName,
            success = datas.success,
            error = datas.error;

        success = (typeof(success) == "function")? success : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if($.isArray(tableName) && tableName.length!=0  ){}else{ error("tableName参数错误"); return;}


        this.db.transaction(function (tx) {
            for(var i= 0,l=tableName.length;i<l;i++){
                var sql = "DROP TABLE IF EXISTS " + tableName[i];
                tx.executeSql(sql);
            }
        },function(err){ error(err.message); },success)
    },


    //单个表批量插入数据
    //datas={
    //      tableName:str               表名 "tablename"
    //      fields:array                字段名 ["name","password"]
    //      values:array                插入的数据 [["aa","123"],["bb","222"],["cc","333"]]
    //      success：function           事务成功回调
    //      error:function              事务失败回调,返回错误原因（失败会回滚）
    // }
    insertRow:function (datas) {
        var tableName = datas.tableName,
            fields = datas.fields,
            values = datas.values,
            callback = datas.success,
            error = datas.error;

        callback = (typeof(callback) == "function")? callback : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if( !tableName ){ error();return;}
        if( $.isArray(fields) && fields.length!=0 ){}else{ error();return;}
        if( $.isArray(values) && fields.length!=0){}else{ error();return;}

        this.db.transaction(function (tx) {
            for(var i= 0,l=values.length;i<l;i++){
                var sql = "INSERT INTO " + tableName + " (" + fields.join(",") + ") SELECT "
                    + new Array(values[i].length + 1).join(",?").substr(1);
                tx.executeSql(sql,values[i]);
            }
        },function(err){ error(err.message); },callback);
    },

    //插入单条数据并返回id
    // datas={
    //      tableName:str               表名 "tablename"
    //      fields:array                字段名 ["name","password"]
    //      values:array                插入的数据 ["cc","333"]
    //      success：function           事务成功回调,返回id  (默认是 tablename_id)
    //      error:function              事务失败回调,返回错误原因（失败会回滚）
    // }
    insertRowBackId:function (datas) {
        var tableName = datas.tableName,
            fields = datas.fields,
            values = datas.values,
            callback = datas.success,
            error = datas.error;

        callback = (typeof(callback) == "function")? callback : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if( !tableName ){ error();return;}
        if( !$.isArray(fields)){ error();return;}
        if( !$.isArray(values)){ error();return;}


        var sql = "INSERT INTO " + tableName + " (" + fields.join(",") + ") SELECT "
            + new Array(values.length + 1).join(",?").substr(1);

        this.db.transaction(function (tx) {
            tx.executeSql(sql, values, function () { }, error);
            tx.executeSql("SELECT max(" + tableName + "_id) as id from " + tableName, [], function (tx, result) {
                var item = result.rows.item(0);
                var id = item.id;
                callback(id);
            }, error);
        });
    },

    //执行单个语句，一般是select
    //
    //记录长度：result.rows.length  具体信息：result.rows.item(i).fieldname
    //          result是success返回
    //
    //分页用sql：select  name as id from test order by test_id  limit 1 offset 2
    //                                                      limit:获取数据条数  offset：第2条开始
    //datas={
    //      sql:str                     sql语句 "select * from tablename"
    //      success：function           事务成功回调,返回结果集
    //      error:function              事务失败回调,返回错误原因（失败会回滚）
    // }
    exec:function(datas){
        var sql = datas.sql,
            callback = datas.success,
            error = datas.error;



        var reg = new RegExp("'undefined'","g");
        sql = sql.replace(reg, null);

        callback = (typeof(callback) == "function")? callback : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if( !sql ){ error();return;}

        this.db.transaction(function (tx) {
            tx.executeSql(sql, [], function(tx,result){
                callback(result);
            }, function(tx,e){
                error(e);
            });
        })
    },

    //在事务里面批量执行一堆sql
    //datas={
    //      sql:array                   sql语句 ["select * from tablename","select * from tablename"]
    //      success：function           事务成功回调
    //      error:function              事务失败回调,返回错误原因（失败会回滚）
    // }
    execs:function(datas){
        var sql = datas.sql,
            callback = datas.success,
            error = datas.error;

        callback = (typeof(callback) == "function")? callback : function(){};
        error = (typeof(error) == "function")? error : function(){};
        if( $.isArray(sql) && sql.length!=0){}else{ error();return;}

        this.db.transaction(function (tx) {
            for(var i= 0,l=sql.length;i<l;i++){

                var thissql = sql[i];
                var reg = new RegExp("'undefined'","g");
                thissql = thissql.replace(reg, null);

                tx.executeSql(thissql);
            }
        },function(err){ error(err.message); },callback)
    }


};

