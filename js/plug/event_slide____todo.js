/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-3-27
 * Time: 下午8:04
 *
 * 滑动事件
 * bens jq.mobi jq.extend device
 *
 * 返回对象
 * var a=require("slideevent");
 *
 *
 * 以下 obj为dom对象  jq或原生对象
 * e为点击开始时的事件,滑动中为时时事件
 * 上下左右滑动触发时间为500毫秒内，从点击开始时计算，500参数可以调整
 * 函数可以连写。
 * @fn a(obj).myslidedown(function(e){})            向下滑动
 * @fn a(obj).myslideup(fn)                         向上滑动
 * @fn a(obj).myslideleft(fn)                       向左滑动
 * @fn a(obj).myslideright(fn)                      向右滑动
 * @fn a(obj).mymoving(fn)                          滑动中触发，释放结束，不受500ms的限制
 * @fn a(obj).unbind(str)          str = myslidedown/myslideup/myslideleft/myslideright/mymoving
 *
 */


(function(){
    var device = bens.require("device");

    var createMySlideEven=function(datas){
        var obj = datas.obj;

        this.events = datas.saveAddress;


        if(!$.isObject(obj)){console.log("滑动参数错误");return;}
        if($.is$(obj)){
            obj = obj.get(0);
        }

        this.obj=obj;

        this.eventobj = null;
        this.startTime=null;
        this.allowTrigerTime = 500;   //500秒内释放有效
        this.moveStartTime = 0;
        this.movefnTrigerTime = 100;     //移动事件回调100毫秒触发一次
        this.points=[];

        //this.leftSlideEven=null;
        //this.rightSlideEven=null;
        //this.upSlideEven=null;
        //this.downSlideEven=null;

        this.touchStart=null;
        this.touchMove=null;
        this.touchEnd=null;

        this.minLength=device.slideTriggerLength;
        this.hasTouch=device.hasTouch;
        this.state=false;

        this.eventBind();
    };
    createMySlideEven.prototype={
        eventBind:function(){
            var _this=this;
            this.obj.addEventListener(device.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false);
            this.obj.addEventListener(device.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false);
            this.obj.addEventListener(device.END_EV,this.touchEnd=function(e){_this.touchEndHandler(e);},false);

            //this.leftSlideEven=document.createEvent('Event');
            //this.leftSlideEven.initEvent("myslideleft", true, true);

            //this.rightSlideEven=document.createEvent('Event');
            //this.rightSlideEven.initEvent("myslideright", true, true);

            //this.upSlideEven=document.createEvent('Event');
            //this.upSlideEven.initEvent("myslideup", true, true);

            //this.downSlideEven=document.createEvent('Event');
            //this.downSlideEven.initEvent("myslidedown", true, true);
        },
        removeEven:function(){
            this.obj.removeEventListener(device.START_EV,this.touchStart,false);
            this.obj.removeEventListener(device.MOVE_EV,this.touchMove,false);
            this.obj.removeEventListener(device.END_EV,this.touchEnd,false);
        },
        f5:function(){
            this.points=[];
        },
        touchStartHandler:function(e){
            this.f5();			//刷新参数
            this.savePoint(e);	//记录当前点
            this.state=true;
            this.startTime = new Date().getTime();
            this.eventobj = e;
        },
        touchMoveHandler:function(e){
            e.preventDefault();
            if(!this.state){return;}
            this.savePoint(e);

            var nowtime = new Date().getTime();
            if(typeof(this.events.move) === "function" && nowtime - this.moveStartTime > this.movefnTrigerTime){
                this.moveStartTime = nowtime;
                this.events.move.call(this.obj,e);
            }
        },
        touchEndHandler:function(){
            if(!this.state){this.startTime = null; return;}
            this.state=false;
            if(this.points.length<2){this.startTime = null; return;}

            var thistime = new Date().getTime();
            if(!(this.startTime && thistime - this.startTime <= this.allowTrigerTime) ){
                this.startTime = null;
                return;
            }
            this.startTime = null;

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
                    //this.obj.dispatchEvent(this.leftSlideEven);
                    if(typeof(this.events.left) === "function"){
                        this.events.left.call(this.obj,this.eventobj);
                    }
                }else{
                    //右滑
                    //this.obj.dispatchEvent(this.rightSlideEven);
                    if(typeof(this.events.right) === "function"){
                        this.events.right.call(this.obj,this.eventobj);
                    }
                }
            }else{
                //纵向滑动
                if(startpointy>lastpointy){
                    //上滑
                    //this.obj.dispatchEvent(this.upSlideEven);
                    if(typeof(this.events.up) === "function"){
                        this.events.up.call(this.obj,this.eventobj);
                    }
                }else{
                    //下滑
                    //this.obj.dispatchEvent(this.downSlideEven);
                    if(typeof(this.events.down) === "function"){
                        this.events.down.call(this.obj,this.eventobj);
                    }
                }
            }
        },
        savePoint:function(e){
            var touch;
            if(this.hasTouch){
                touch=e.touches[0];
            }else{
                touch=e;
            }
            this.points.push({x:touch.pageX,y:touch.pageY});
        }
    };

    var savefn = {},
        saveobj = {};

    var eventbind = function(obj){
        if(!$.isObject(obj)){console.log("slide bind error");return;}
        if($.is$(obj)){
            obj = obj.get(0);
        }


        var id;
        if(obj.__bens_slide_event_id__){
            //帮定过事件
            id = obj.__bens_slide_event_id__;
        }else{
            //没有注册监听事件
            id = device.counter();
            obj.__bens_slide_event_id__ = id;
            savefn[id] = {
                up:null,
                left:null,
                down:null,
                right:null,
                move:null
            };
            saveobj[id] = new createMySlideEven({
                obj:obj,
                saveAddress:savefn[id]
            });
        }

        this.obj = obj;
        this.id = id;
        this.saveFn = savefn[id];
    };
    eventbind.prototype = {
        myslidedown:function(fn){
            if(typeof(fn) === "function"){
                this.saveFn.down = fn;
            }
            return this;
        },
        myslideup:function(fn){
            if(typeof(fn) === "function"){
                this.saveFn.up = fn;
            }
            return this;
        },
        myslideleft:function(fn){
            if(typeof(fn) === "function"){
                this.saveFn.left = fn;
            }
            return this;
        },
        myslideright:function(fn){
            if(typeof(fn) === "function"){
                this.saveFn.right = fn;
            }
            return this;
        },
        mymoving:function(fn){
            if(typeof(fn) === "function"){
                this.saveFn.move = fn;
            }
            return this;
        },
        unbind:function(type){
            if(type == "mymoving"){
                type = "move";
            }else{
                type = type.replace("myslide","");

            }

            if(this.saveFn[type]){
                this.saveFn[type] = null;
            }

            this._checkHasFn();
            return this;
        },
        //检查是否还有事件绑定
        _checkHasFn:function(){
            var isfind = false;
            for(var key in this.saveFn){
                if(this.saveFn[key]){
                    isfined = true;
                    break;
                }
            }
            if(!isfind){
                this._removeObj();
            }
        },
        //解除事件绑定
        _removeObj:function(){
            var id = this.id;
            savefn[id] = null;
            saveobj[id].removeEven();
            saveobj[id] = null;
            this.obj.__bens_slide_event_id__ = null;
        }
    };



    return function(obj){
         return new eventbind(obj);
    };
})();