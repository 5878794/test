/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-4-3
 * Time: 上午9:28
 *
 * ======================================================================
 * 页面切换
 * ======================================================================
 * device bens jq.mobi jq.extend
 *
 *
 * bens.require("pagechange").leftShow(datas);           //从左划入新div
 * bens.require("pagechange").rightShow(datas);          //从友划入新div
 *
 *  datas={
 *      @param window: id/dom/jqdom                 //显示的主窗口  有 overflow：hidden
 *      @param body: id/dom/jqdom                   //包裹层，动画用
 *      @param from: id/dom/jqdom                   //当前显示的div
 *      @param to: id/dom/jqdom                     //要切换到的div
 *      @param start:fn                             //移动前执行（已显示）
 *      @param success: fn                          //动画完成回调
*       @param style:string				//"block","-webkit-box"   默认:device.box;
 *  }
 *
 *
 *
 */

(function(){
    var device = bens.require("device");
    return {
        win:null,
        body:null,
        from:null,
        to:null,
        style:null,
        success:null,
        winWidth:null,
        winHeight:null,
        start:null,
        positionX:null,
        isRuning:false,
        cache:[],
        leftShow:function(datas){
            datas = bens.getObj(datas);
            datas.type = "left";
            this.init(datas);
        },
        rightShow:function(datas){
            datas = bens.getObj(datas);
            datas.type = "right";
            this.init(datas);
        },
        show:function(datas){
            datas = bens.getObj(datas);
            datas.type = null;
            this.init(datas);
        },
        init:function(datas){
            if(this.isRuning){
//                this.cache.push(datas);
                return;
            }

            this.isRuning = true;
            this.checkParam(datas);
            this.winDivSet();
            this.divSet();

            if(this.type){
                this.go();
            }else{
                this.success();
                this.animateEnd();
            }

        },
        //检查参数
        checkParam:function(datas){
            var maindiv = datas.window,
                bodydiv = datas.body,
                fromdiv = datas.from,
                todiv = datas.to,
                style = datas.style || device.box,
                start = datas.start,
                success = datas.success,
                type = datas.type;

            maindiv = bens.getDom(maindiv);
            bodydiv = bens.getDom(bodydiv);
            fromdiv = bens.getDom(fromdiv);
            todiv = bens.getDom(todiv);
            start = bens.getFunction(start);
            success = bens.getFunction(success);

            if(type){
                if(!fromdiv || !todiv || !maindiv || !bodydiv){console.log("param error");return;}
            }else{
                if(!todiv || !maindiv || !bodydiv){console.log("param error");return;}
            }


            this.win = maindiv;
            this.body = bodydiv;
            this.from = fromdiv;
            this.to = todiv;
            this.success = success;
            this.type = type;
            this.style = style;
            this.start = start;
        },
        //设置主窗口样式
        winDivSet:function(){
            var _this = this;
            this.winWidth = parseInt($(_this.win).width());
            this.winHeight = parseInt($(_this.win).height());

            var mycss={
                position:"relative"
            };
            mycss[device.transform] = device.css_s+"0,0"+device.css_e;


            $(this.body).css(mycss);
        },
        divSet:function(){
            var _this = this,
                left;

            if(this.type){
                if(this.type == "right"){
                    left = this.winWidth;
                }else{
                    left = -this.winWidth
                }
            }else{
                left = 0;
            }


            $(this.to).css({
                position:"absolute",
                left:left+"px",
                top:0,
                display:_this.style,
                width:_this.winWidth+"px",
                height:_this.winHeight+"px",
                webkitTransformStyle:"preserve-3d",
                webkitBackfaceVisibility:"hidden"
            });


            this.start();

        },
        //动画
        go:function(){
            var _this = this,
                cssobj = {},
                left = (this.type == "right")? -this.winWidth : this.winWidth;

            cssobj[device.transform] = device.css_s+ left + "px,0"+device.css_e ;

            $(_this.body).cssAnimate(cssobj,400,function(){

                _this.animateEnd();
                _this.success();

            });
        },
        animateEnd:function(){
            var cssobj = {};
            cssobj[device.transform] = device.css_s+ "0,0"+device.css_e ;
            $(this.body).css(cssobj);
            $(this.from).css({display:"none"});
            $(this.to).css({left:0,top:0});




            this.win = null;
            this.body = null;
            this.from = null;
            this.to = null;
            this.winWidth = null;
            this.winHeight = null;
            this.positionX = null;
            this.style = null;

            this.isRuning = false;

//            var _this = this;
//            setTimeout(function(){
//                _this.isRuning = false;
//                _this.checkCache();
//            },100);

        },
        checkCache:function(){
            if(this.cache.length ==0 ){return;}

            var thisdata = this.cache.shift();
            this.init(thisdata);
        }
    };
})();






//(function(){
//    var device = bens.require("device");
//    return {
//        win:null,
//        body:null,
//        from:null,
//        to:null,
//        style:null,
//        success:null,
//        winWidth:null,
//        winHeight:null,
//        start:null,
//        positionX:null,
//        isRuning:false,
//        cache:[],
//        leftShow:function(datas){
//            datas = bens.getObj(datas);
//            datas.type = "left";
//            this.init(datas);
//        },
//        rightShow:function(datas){
//            datas = bens.getObj(datas);
//            datas.type = "right";
//            this.init(datas);
//        },
//        show:function(datas){
//            datas = bens.getObj(datas);
//            datas.type = null;
//            this.init(datas);
//        },
//        init:function(datas){
//            if(this.isRuning){
////                this.cache.push(datas);
//                return;
//            }
//
//            this.isRuning = true;
//            this.checkParam(datas);
//            this.winDivSet();
//            this.divSet();
//
//            if(this.type){
//                this.go();
//            }else{
//                this.success();
//                this.animateEnd();
//            }
//
//        },
//        //检查参数
//        checkParam:function(datas){
//            var maindiv = datas.window,
//                bodydiv = datas.body,
//                fromdiv = datas.from,
//                todiv = datas.to,
//                style = datas.style || device.box,
//                start = datas.start,
//                success = datas.success,
//                type = datas.type;
//
//            maindiv = bens.getDom(maindiv);
//            bodydiv = bens.getDom(bodydiv);
//            fromdiv = bens.getDom(fromdiv);
//            todiv = bens.getDom(todiv);
//            start = bens.getFunction(start);
//            success = bens.getFunction(success);
//
//            if(type){
//                if(!fromdiv || !todiv || !maindiv || !bodydiv){console.log("param error");return;}
//            }else{
//                if(!todiv || !maindiv || !bodydiv){console.log("param error");return;}
//            }
//
//
//            this.win = maindiv;
//            this.body = bodydiv;
//            this.from = fromdiv;
//            this.to = todiv;
//            this.success = success;
//            this.type = type;
//            this.style = style;
//            this.start = start;
//        },
//        //设置主窗口样式
//        winDivSet:function(){
//            var _this = this;
//            this.winWidth = parseInt($(_this.win).width());
//            this.winHeight = parseInt($(_this.win).height());
//
//            var translate = $(this.body).css(device.transform);
//            if(!translate || translate == "none" || !this.type){
//                translate = 0;
//                var temp = {
//                    position:"relative"
//                };
//                temp[device.transform] = device.css_s+"0,0"+device.css_e;
//                $(this.body).css(temp);
//            }else{
//                translate = parseInt(translate.split("(")[1]);
//            }
//
//            this.positionX = translate;
//        },
//        divSet:function(){
//            var _this = this,
//                left;
//
//            if(this.type){
//                var _left = parseInt($(this.from).css("left"));
//
//                _left = (_left)? _left : 0;
//                left = (this.type == "left")? _left - this.winWidth : _left + this.winWidth;
//            }else{
//                left = 0;
//            }
//
//            if(device.isIDevice){
//                $(this.to).css({
//                    position:"absolute",
//                    left:left+"px",
//                    top:0,
//                    display:_this.style,
//                    width:_this.winWidth+"px",
//                    height:_this.winHeight+"px",
//                    webkitTransformStyle:"preserve-3d",
//                    webkitBackfaceVisibility:"hidden"
//                })
//            }else{
//                $(this.to).css({
//                    position:"absolute",
//                    left:left+"px",
//                    top:0,
//                    display:_this.style,
//                    width:_this.winWidth+"px",
//                    height:_this.winHeight+"px"
//                })
//            }
//
//            this.start();
//
//        },
//        //动画
//        go:function(){
//            var _this = this,
//                cssobj = {},
//                left = (this.type == "right")? this.positionX-this.winWidth : this.positionX+this.winWidth;
//
//            cssobj[device.transform] = device.css_s+ left + "px,0"+device.css_e ;
//
//            $(_this.body).cssAnimate(cssobj,400,function(){
//
//                _this.animateEnd();
//                _this.success();
//
//            });
//        },
//        animateEnd:function(){
//            if(this.type == "right"){
//                $(this.from).css({display:"none"});
//            }
//
//            this.win = null;
//            this.body = null;
//            this.from = null;
//            this.to = null;
//            this.winWidth = null;
//            this.winHeight = null;
//            this.positionX = null;
//            this.style = null;
//
//            this.isRuning = false;
//
////            var _this = this;
////            setTimeout(function(){
////                _this.isRuning = false;
////                _this.checkCache();
////            },100);
//
//        },
//        checkCache:function(){
//            if(this.cache.length ==0 ){return;}
//
//            var thisdata = this.cache.shift();
//            this.init(thisdata);
//        }
//    };
//})();






/*

(function(){
    var device = bens.require("device");
    return {
        type:null,      //移动方向
        win:null,       //包裹窗口
        body:null,      //移动窗口
        from:null,      //当前显示div
        to:null,        //切换到要显示的div
        success:null,
        winWidth:null,
        winHeight:null,
        leftShow:function(datas){
            this.type = "left";
            this.init(datas);
        },
        rightShow:function(datas){
            this.type = "right";
            this.init(datas);
        },
        //真入口
        init:function(datas){
            this.checkParam(datas);
            this.winDivSet();
            this.setDiv();
            this.go();
        },
        //检查参数
        checkParam:function(datas){
            var maindiv = datas.window,
                bodydiv = datas.body,
                fromdiv = datas.from,
                todiv = datas.to,
                success = datas.success;

            maindiv = bens.getDom(maindiv);
            bodydiv = bens.getDom(bodydiv);
            fromdiv = bens.getDom(fromdiv);
            todiv = bens.getDom(todiv);
            success = bens.getFunction(success);

            if(!fromdiv || !todiv || !maindiv || !bodydiv){console.log("param error");return;}

            this.win = maindiv;
            this.body = bodydiv;
            this.from = fromdiv;
            this.to = todiv;
            this.success = success;
        },
        //设置主窗口样式
        winDivSet:function(){
            var _this = this;
            this.winWidth = parseInt($(_this.win).width());
            this.winHeight = parseInt($(_this.win).height());

            var temp = {
                position:"relative"
            };
            temp[device.transform] = device.css_s+"0,0"+device.css_e;

            $(this.body).css(temp);
        },
        //设置要显示的div
        setDiv:function(){
            var _this = this;
            if(_this.type == "right"){
                $(_this.to).css({
                    position:"absolute",
                    left:this.winWidth+"px",
                    top:0,
                    display:"block",
                    width:_this.winWidth+"px",
                    height:_this.winHeight+"px"
                })
            }else{
                $(_this.to).css({
                    position:"absolute",
                    left:-this.winWidth+"px",
                    top:0,
                    display:"block",
                    width:_this.winWidth+"px",
                    height:_this.winHeight+"px"
                })
            }
        },
        //动画
        go:function(){
            var _this = this,
                cssobj = {};

            if(_this.type == "right"){
                cssobj[device.transform] = device.css_s+ -_this.winWidth + "px,0"+device.css_e ;
            }else{
                cssobj[device.transform] = device.css_s+ _this.winWidth + "px,0"+device.css_e ;
            }

            $(_this.body).cssAnimate(cssobj,400,function(){
                //_this.animateEnd();
                _this.success();
            });
        },
        animateEnd:function(){
            $(this.from).css({display:"none"});
            $(this.to).css({left:0,top:0});
            var temp = {};
            temp[device.transform] = device.css_s+"0,0"+device.css_e;
            $(this.body).css(temp);
        }
    };


})();

*/



