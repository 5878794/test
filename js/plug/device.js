/**
 * author: bens
 * email： 5878794@qq.com
 * Date: 13-3-19
 * Time: 下午7:55
 *
 *  设备的一些基础属性等，见最后的返回属性。
 */




(function(){
    var dummyStyle = document.createElement("div").style,
        vendor = (function () {
            if(window.navigator.msPointerEnabled){return "";}
            var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
        prefixStyle = function(style){
            if ( !vendor ) return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        },
        has3d = prefixStyle('perspective') in dummyStyle,
        css_s = (has3d)? "translate3d(" : "translate(",
        css_e = (has3d)? ",0)" : ")",


        _transform = prefixStyle('transform'),
        _transitionProperty = prefixStyle('transitionProperty'),
        _transitionDuration = prefixStyle('transitionDuration'),
        _transformOrigin = prefixStyle('transformOrigin'),
        _transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        _transitionDelay = prefixStyle('transitionDelay'),

        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        isWindows = (window.navigator.msPointerEnabled)? true : false,
//        isWindows = navigator.userAgent.match(/MSIE 10/i)?true:false,
//        isWindows = false,

        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,


        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : (window.navigator.msPointerEnabled)? 'MSPointerDown' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : (window.navigator.msPointerEnabled)? 'MSPointerMove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : (window.navigator.msPointerEnabled)? 'MSPointerUp' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : (window.navigator.msPointerEnabled)? 'MSPointerUp' : 'mouseup',
        TRNEND_EV = (function () {
            if ( vendor === false ) return "transitionend";

            var transitionEnd = {
                ''			: 'transitionend',
                'webkit'	: 'webkitTransitionEnd',
                'Moz'		: 'transitionend',
                'O'			: 'otransitionend',
                'ms'		: 'MSTransitionEnd'
                };

                return transitionEnd[vendor];
        })(),
        nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),
        counter = (function(){
            var a = 0;
            return function(){
                a += 1;
                return a;
            }
        })(),
        deviceSize = (function(){
            var width = window.innerWidth,
                height = window.innerHeight,
                length;

            length = (width > height)? height : width;

            if(length<=320){
                return "s";
            }else if(length>320 && length<540){
                return "m";
            }else{
                return "l";
            }

        })(),
        androidVer = (function(){
            var a = navigator.appVersion,
                b = a.indexOf("Android");
            if(b>=0){
                var c = b+ 7,
                    d = a.substr(c);
                return parseFloat(d).toFixed(1);
            }else{
                return null;
            }
        })(),
        getCssName = function(style){
            if ( isWindows ) return style;

            style = cssVendor+style;
            return style;
        },
        box = (isWindows)? "-ms-flexbox" : cssVendor+"box",
        box_shadow = getCssName("box-shadow"),
        boxPack = (isWindows)? "-ms-flex-pack" : cssVendor+"box-pack",
        boxAlign = (isWindows)? "-ms-flex-align" : cssVendor+"box-align",
        boxFlex = (isWindows)? "-ms-flex" : cssVendor+"box-flex",
        boxOrient = (isWindows)? "-ms-flex-direction" : cssVendor+"box-orient",
        boxOrientRow = (isWindows)? "row" : "horizontal",
        boxVertical = (isWindows)? "column" : "vertical",
        backgroundSize = getCssName("background-size"),
        transform = getCssName("transform"),
        border_radius = (isWindows || (isAndroid && androidVer == "4.2" ))? "border-radius" : cssVendor+"border-radius",
        box_sizing = getCssName("box-sizing"),
        background_clip = getCssName("background-clip"),
        border_bottom_left_radius = getCssName("border-bottom-left-radius"),
        border_bottom_right_radius = getCssName("border-bottom-right-radius"),
        border_top_left_radius = getCssName("border-top-left-radius"),
        border_top_right_radius = getCssName("border-top-right-radius"),
        backface_visibility = getCssName("backface-visibility"),
        transition = getCssName("transition"),
        transition_property = getCssName("transition-property"),
        transition_duration = getCssName("transition-duration"),
        transition_timing_function = getCssName("transition-timing-function");


    var css = {
            "box":box,
            "box-align":boxAlign,
            "box-pack":boxPack,
            "background-size":backgroundSize,
            "background-clip":background_clip,
            "box-flex":boxFlex,
            "box-orient":boxOrient,
            "horizontal":boxOrientRow,
            "vertical":boxVertical,
            "transform":transform,
            "border-radius":border_radius,
            "border-bottom-left-radius":border_bottom_left_radius,
            "border-bottom-right-radius":border_bottom_right_radius,
            "border-top-left-radius":border_top_left_radius,
            "border-top-right-radius":border_top_right_radius,
            "box-sizing":box_sizing,
            "box-shadow":box_shadow,
            "backface-visibility":backface_visibility,
            "transition":transition,
            "transition-property":transition_property,
            "transition-duration":transition_duration,
            "transition-timing-function":transition_timing_function
        },
        gz = (function(){
            var reg,a=[],gz;
            for(var key in css){
                if(key == "box" || key == "transition"){
    //                a.push("([^-])box(?!-)");
                    a.push("([^-]"+key+"[^-])");
                }else if(key == "horizontal" || key == "vertical"){
                    a.push(key);
                }else{
                    a.push("([^-]"+key+")");
                }

            }
            reg = a.join("|");
            return new RegExp(reg,"ig");
        })(),
        css_prefix = function(data){
            var text = JSON.stringify(data),
                newtext = cssfile_prefix(text);
            return JSON.parse(newtext);
        },
        cssfile_prefix = function(data){
            return  data.replace(gz,function(a){
                        var str = a.substr(1, a.length-2);
                        if(str == "box" || str == "transition"){
                            var newstr = css[str];
                            return a.substr(0,1)+newstr+ a.substr(a.length-1);
                        }else if(a == "horizontal" || a == "vertical"){
                            return css[a];
                        }else{
                            return a.substr(0,1)+css[a.substr(1)];
                        }
                    });
        },
        fix_css = function(css){
            css = css.replace(/;/ig," ; ");
            return cssfile_prefix(css);
        };


    dummyStyle = null;


    return {
        has3d:has3d,                //是否支持3d
        hasTouch:hasTouch,           //是否是触摸屏
        hasTransform:hasTransform,  //是否支持变形

        isAndroid:isAndroid,        //android   true false
        isIDevice:isIDevice,        //iphone，ipad
        isTouchPad:isTouchPad,      //hp
        isWindows:isWindows,        //windows phone

        RESIZE_EV:RESIZE_EV,        //窗口变化
        START_EV:START_EV,          //点击
        MOVE_EV:MOVE_EV,            //移动
        END_EV:END_EV,              //释放
        CANCEL_EV:CANCEL_EV,        //结束
        TRNEND_EV:TRNEND_EV,        //变形结束 webkitTransitionEnd
        nextFrame:nextFrame,
        cancelFrame:cancelFrame,


        touchStartMove:10,       //触摸滚动触发距离，点击失败移动距离 px
        jg:600,					//同一个对象点击触发时间间隔  ms
        slideTriggerLength:10,		//长滑触发的距离 px
        slideLength:20,			//长滑的距离?? 倍
        outRangeLength:100,			//超出后还可以滑动的距离 px
        longClickTime:1000,			//长按触发时间	ms
        clickdelay:10,				//点击事件延迟触发时间  ms  touchstart
        slideTriggerMaxTime:1000,   //滑动触发的有效时间
        size:deviceSize,       //设备屏幕大小   s m l     取法：  320   540分成3档
        androidVer:androidVer,       //android版本

        counter:counter,                 //计数器  fn


        //原生的用无 -
        _transform:_transform,        //自动添加前缀
        _transitionProperty:_transitionProperty,
        _transitionDuration:_transitionDuration,
        _transformOrigin:_transformOrigin,
        _transitionTimingFunction:_transitionTimingFunction,
        _transitionDelay:_transitionDelay,

        //兼容ie10的css属性
        cssVendor:cssVendor,        //css前缀   -webkit-
        css_s:css_s,                //变形前缀    translate3d(
        css_e:css_e,                //变形后缀      ,0)
        box:box,
        box_pack:boxPack,
        box_align:boxAlign,
        box_flex:boxFlex,
        box_orient:boxOrient,
        horizontal:boxOrientRow,
        vertical:boxVertical,
        background_size:backgroundSize,
        transform:transform,
        border_radius:border_radius,
        box_sizing:box_sizing,
        box_shadow:box_shadow,
        background_clip : background_clip,
        border_bottom_left_radius : border_bottom_left_radius,
        border_bottom_right_radius : border_bottom_right_radius,
        border_top_left_radius : border_top_left_radius,
        border_top_right_radius : border_top_right_radius,
        backface_visibility : backface_visibility,
        transition : transition,
        transition_property : transition_property,
        transition_duration : transition_duration,
        transition_timing_function : transition_timing_function,

        //css自动替换
        css_prefix:css_prefix,
        cssfile_prefix:cssfile_prefix,
        fixCss:fix_css

    }



})();






//var c=a.replace(/a(?!b)/ig,"AA")   匹配字符传中的 “a”  排除  “ab”
