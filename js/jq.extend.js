if (!$.is$) {
    $.is$ = function (obj) {
        return $.isObject(obj) && obj.length >0
    }
}




//获取因css而动画中当前的css   type为类型 如：top,left等
$.fn.androidGetStyle=function(type){
    var obj=$(this).get(0);
    var thisStyle=document.defaultView.getComputedStyle(obj,null);

    return thisStyle.getPropertyValue(type);
};


//获取元素的宽度  性能很低
$.fn.width=function(){
    var w=$(this).androidGetStyle("width");
    if(!parseInt(w) || w.indexOf("%")>-1){
        var temp_a=$(this).clone();
        temp_a.css({display:"block",visibility:"hidden"}).insertAfter(this);
        w=temp_a.androidGetStyle("width");
        temp_a.remove();
    }
    return w;
};
//获取元素的高度
$.fn.height=function(){
    var h=$(this).androidGetStyle("height");
    if(!parseInt(h) || h.indexOf("%")>-1){
        var temp_a=$(this).clone();
        temp_a.css({display:"block",visibility:"hidden"}).insertAfter(this);
        h=temp_a.androidGetStyle("height");
        temp_a.remove();
    }
    return h;
};


//判断是否是数字
$.isNumber = function(val){
    return typeof val === 'number';
};
//判断是否是字符串
$.isString = function(val){
    return typeof val === 'string';
};
//判断是否是布尔
$.isBoolean = function(val){
    return typeof val === 'boolean';
};
//判断是否是对象   jqmobi有
$.isObject = function(str){
    if(str === null || typeof str === 'undefined' || $.isArray(str))
    {
        return false;
    }
    return typeof str === 'object';
};
//判断是否是数组   jqmobi有
$.isArray = function (arr){
    return arr.constructor === Array;
};
//判断是函数    jqmobi有
$.isFunction = function(fn){
    return typeof fn === 'function'
};
//判断定义值没
$.isUndefined = function(val){
    return typeof val === 'undefined'
};
//判断是否是网址
$.isUrl = function(url){


//    var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
//        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
//        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
//        + "|" // 允许IP和DOMAIN（域名）
//        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
//        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
//        + "[a-z]{2,6})" // first level domain- .com or .museum
//        + "(:[0-9]{1,4})?" // 端口- :80
//        + "((/?)|" // a slash isn't required if there is no file name
//        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";

    var strRegex = "[a-zA-z]+://[^s]*";


    var re=new RegExp(strRegex);
    //re.test()
    return re.test(url);
};



//$.device
(function(){
    var dummyStyle = document.createElement("div").style,
        vendor = (function () {
            if(window.navigator.msPointerEnabled){return "";}
            if("MozTransform" in dummyStyle){return "";}
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
    //TODO 获全系统版本号
        ver = (function(){
            if(isAndroid){
                return androidVer;
            }else if(isIDevice){
                return null;
            }else{
                return null;
            }
        })(),
        language = (navigator.browserLanguage || navigator.language).toLowerCase();
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
            var reg,a=[];
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



    $.device = {
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
//        size:deviceSize,       //设备屏幕大小   s m l     取法：  320   540分成3档
        androidVer:androidVer,       //android版本
        ver:ver,                     //系统版本
        language:language,          //语言版本  zh-cn

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



$.fn.myCss = function(css){
    var new_css = $.device.css_prefix(css);
    $(this).css(new_css);
    return $(this);
};

$.myCss = function(css){
    return $.device.fixCss(css);
};


$.trim = function(str){
    str = str || "";
    return str.replace(/(^\s*)|(\s*$)/g, "");
};

//stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
$.stamp2time = function(b){
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year=a.getFullYear();
    var month=parseInt(a.getMonth())+1;
    month= (month<10)? "0"+month : month;
    var date=a.getDate();
    date= (date<10)? "0"+date : date;
    var hours=a.getHours();
    hours= (hours<10)? "0"+hours : hours;
    var minutes=a.getMinutes();
    minutes= (minutes<10)? "0"+minutes : minutes;
    var seconds=a.getSeconds();
    seconds= (seconds<10)? "0"+seconds : seconds;

    return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
};

//a :   2012-12-13   2012-12-12 12:12:33  自动补位
$.time2stamp = function(a){
    var new_str = a.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    if(arr.length != 6){
        for(var i= 0,l=6-arr.length;i<l;i++){
            arr.push(0);
        }
    }

    return new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5])).getTime();
};

$.getDom = function(obj){
    var returnobj;

    if(!obj){return returnobj;}

    if($.isString(obj)){
        returnobj = document.getElementById(obj);
    }else if($.isObject(obj)){
        if($.is$(obj)){
            returnobj = obj.get(0);
        }
        if(obj.nodeType == 1){
            returnobj = obj;
        }
    }

    return returnobj;
};
$.getArray = function(str){
    return ($.isArray(str))? str : [];
};
$.getFunction = function(fn){
    return ($.isFunction(fn))? fn : function(){};
};
$.getBloom = function(str){
    return ($.isBoolean(str))? str : false;
};
$.getObj = function(obj){
    return ($.isObject(obj))? obj : {};
};
$.getNumber = function(str){
    str = parseInt(str);
    str = str || 0;
    return str;
};

$.cloneJson = function(obj){
    return JSON.parse(JSON.stringify(obj));
};


$.getNewImageSize = function(imgwidth,imgheight,objwidth,objheight){
    var newimgwidth,newimgheight;

    if(imgwidth>0 && imgheight>0){
        if(imgwidth/imgheight>=objwidth/objheight){
            if(imgwidth>objwidth){
                newimgwidth = objwidth;
                newimgheight = imgheight*objwidth/imgwidth;
            }else{
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        }else{
            if(imgheight>objheight){
                newimgheight = objheight;
                newimgwidth = imgwidth*objheight/imgheight;
            }else{
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        }
    }

    return {
        width:newimgwidth,
        height:newimgheight
    }
};


//随机数组
$.randomArray = function(arr){
    var temp = [],
        new_temp = [],
        return_arr = [];

    for(var z= 0,zl=arr.length;z<zl;z++){
        temp.push(z);
    }

    while(temp.length !=0){
        var l = temp.length,
            n = parseInt(Math.random()*l),
            v = temp[n];
        new_temp.push(v);
        temp.splice(n,1);
    }

    for(var i= 0,il=new_temp.length;i<il;i++){
        var x = new_temp[i];
        return_arr.push(arr[x]);
    }

    return return_arr;

};




$.offsetPage = {
    top:function(el){
        el = $.getDom(el);
        var _top = el.offsetTop;
        while(el.offsetParent != null){
            el = el.offsetParent;
            _top += el.offsetTop;
        }
        return _top;
    },
    left:function(el){
        el = $.getDom(el);
        var _left = el.offsetLeft;
        while(el.offsetParent != null){
            el = el.offsetParent;
            _left += el.offsetLeft;
        }
        return _left;
    }
};


$.fixMedian = function(val,a,b){
    val = (val<a)? a : val;
    val = (val>b)? b : val;
    return val;
};


(function(){
    //添加时 ：注意转换对像是否是正则特殊符号，是的话for循环需要判断加注释符号
    var a = {
            "&":"&amp;",
            "<":"&lt;",
            ">":"&gt;",
            //        " ":"&#160;",
            "'":"&#39;",
            "\"":"&quot;"
        },
        temp = [],
        temp1 = [],
        reg,reg1,b = {};

    for(var key in a){
        var value = a[key];
        temp.push(key);
        temp1.push(value);
        b[value] = key;
    }
    temp = temp.join("|");
    temp1 = temp1.join("|");
    reg = new RegExp(temp,"ig");
    reg1 = new RegExp(temp1,"ig");

    //特殊符号转换
    $.htmlEncode = function(text){
        return text.replace(reg,function(t){
            return a[t];
        })
    };
    //还原
    $.htmlDecode = function(text){
        return text.replace(reg1,function(t){
            return b[t];
        })
    }


})();





//css动画
$.fn.cssAnimate=(function(){

    var cssanimagefn = {},
        counter = (function(){
            var a = 0;
            return function(){
                a += 1;
                return a;
            }
        })(),
        device = $.device,
        clearfn = function(obj,keyname){
            obj.removeEventListener(device.TRNEND_EV,cssanimagefn[keyname],false);
            delete cssanimagefn[keyname];
            delete obj.__bens_cssfn_id__;
        };

    return function(data,time,callback,is_3d){
        var _this=$(this),
            _that = _this.get(0),
            _thatstyle = _that.style;

        data = JSON.parse($.myCss(JSON.stringify(data)));
        time = time || 1000;
        callback = $.getFunction(callback);
        is_3d = ($.isBoolean(is_3d))?  is_3d : false;

        if(_that.__bens_cssfn_id__){
            var temp_key = _that.__bens_cssfn_id__;
            clearfn(_that,temp_key);
        }

        var thiskey = counter();
        _that.__bens_cssfn_id__ = thiskey;


        cssanimagefn[thiskey]=function(e){
            var p_name = e.propertyName;
            if(e.target == _that && data.hasOwnProperty(p_name)){

                //_this.get(0).style["webkitTransition"]="all 0 ease";
                _thatstyle[device._transitionProperty] = "";
                _thatstyle[device._transitionDuration] = "";
                _thatstyle[device._transitionTimingFunction] = "";
                _thatstyle["webkitTransformStyle"]="";
                _thatstyle["webkitBackfaceVisibility"]="";

                callback();
                clearfn(_that,thiskey);
            }
        };

        _thatstyle[device._transitionProperty] = "all";
        _thatstyle[device._transitionDuration] = time+"ms";
        _thatstyle[device._transitionTimingFunction] = "ease";

        _thatstyle["webkitTransformStyle"]="preserve-3d";   //webkit私有
        if(!is_3d){
            _thatstyle["webkitBackfaceVisibility"]="hidden";    //webkit私有
        }else{
            _thatstyle["webkitBackfaceVisibility"]="visible";    //webkit私有
        }


        setTimeout(function(){
            _that.addEventListener(device.TRNEND_EV,cssanimagefn[thiskey],false);
            _this.css(data);
        },1);

    }
})();


/* 验证
 *  $.checkInputs({
 *      inputs:[
 *          {
 *              id:"test",                              //要检查的input的id
 *              name:"用户名",                           //要检查的input的名字（信息提示用）
 *              rules:"must,username,min:6,max:16",     //验证规则，见 rules 对象
 *              error:"用户名格式错误"                     //（非必须）自定义错误提示
 *          },
 *          ...
 *      ],
 *      success:function(){
 *          //验证通过回调
 *          console.log("ok")
 *      },
 *      error:function(msg,ids){
 *          //返回验证错误的文字
 *          console.log(msg)
 *      }
 *  })
 *
 *
 */
(function(){
    var temp_fn = {
        rules:{
            username:{
                rule:/^[a-zA-Z][a-zA-Z0-9]*$/,
                error:"格式错误"
            },
            nickname:{
                rule:/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
                error:"格式错误"
            },
            password:{
                rule:/^[a-zA-Z0-9]*$/,
                error:"不能有特殊字符"
            },
            mobile:{
                rule:/^[1]\d*$/,
                error:"格式错误"
            },
            email:{
                rule:/^[a-zA-Z0-9][a-zA-Z0-9-_\.]*@[a-zA-Z0-9_-]*\.[a-zA-Z0-9]*$/,
                error:"格式错误"
            },
            number:{
                rule:/^[0-9]*$/,
                error:"格式错误"
            },
            loginusername: {
                rule: /(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/,
                error:"只能为手机号码或者电子邮箱地址"
            },
            cellphone: {
                rule: /(^(01|1)[3,4,5,8][0-9])\d{8}$/,
                error:"格式错误"
            },
            qq: {
                rule: /[1-9][0-9]{4,12}/,
                error:"格式错误"
            },
            zipcode: {
                rule: /[1-9]\d{5}(?!\d)/,
                error:"格式错误"
            }

        },
        check:function(datas){
            var inputs = $.getArray(datas.inputs),
                success = $.getFunction(datas.success),
                error = $.getFunction(datas.error),
                pass = true,
                error_messages = [],
                ids = [];

            for(var i = 0,l = inputs.length; i<l; i++){
                var this_input = inputs[i],
                    this_id = this_input.id,
                    this_rules = this_input.rules.split(","),
                    this_error_msg = this_input.error;

                var this_error = [],
                    this_state = true;
                this._checkOne(this_id,this_rules,function(text){
                    //未通过。。。
                    pass = false;
                    this_state = false;
                    this_error.push(text);
                });

                this_input.state = this_state;
                this_input.message = this_error.join(",");
                if(!this_state){
                    if(this_error_msg){
                        error_messages.push(this_error_msg);
                    }else{
                        error_messages.push(this_input.name+":"+this_input.message);
                    }
                    ids.push(this_id);
                }
            }

            if(pass){
                success();
            }else{
                var msg = error_messages.join(";");
                error(msg,ids);
            }

        },
        //检查流程
        _checkOne:function(id,rules,error){
            var obj = $("#"+id);
            if(obj.length == 0){ console.log("id:"+id+"元素没有找到");return; }

            var this_val = $.trim(obj.val());
            if(this_val){
                //输入有值需要验证
                for(var i= 0,l=rules.length; i<l; i++){
                    var rule = rules[i],
                        setRules = this.rules[rule];

                    if(setRules){
                        var reg = setRules.rule,
                            check = reg.test(this_val);

                        if(!check){
                            error(setRules.error);
                        }

                    }else if(rule.indexOf("max")>-1){
                        var length = rule.split(":")[1];
                        if(this_val.length > length){
                            error("不能超过"+length+"字符");
                        }

                    }else if(rule.indexOf("min")>-1){
                        var length1 = rule.split(":")[1];
                        if(this_val.length < length1){
                            error("不能少于"+length1+"字符");
                        }
                    }
                }
            }else{
                if(rules.indexOf("must") > -1){
                    //没有输入但是是必填项目 报错
                    error("不能为空");
                }
            }
        }
    };
    $.checkInputs = function(data){
        temp_fn.check(data);
    }
})();




//事件
//
(function(){
    var device = $.device,
        createMyTouchEven = function(obj){
            this.obj=obj;
            this.mytarget=null;

            if(this.obj==null){return;}

            this.clickLongTimeFn=null;
            this.clickTimeFn=null;
            this.points=[];

            this.isTouchOk=true;
            this.isTouchStarted=false;
            this.isTouchMoved=false;
            this.isLongClicked=false;
            this.isTouchEnded=false;


            this.clickDownEven=null;
            this.clickOkEven=null;
            this.clickUpEven=null;
            this.longClickEven=null;
            //this.slideUpEven=null;
            //this.slideDownEven=null;
            //this.slideRightEven=null;
            //this.slideLeftEven=null;

            this.touchSTime=null;
            this.touchJQ=device.jg;
            this.touchDelay=device.clickdelay;
            this.longClickDelay=device.longClickTime;
            this.allowMove=device.touchStartMove;
            this.hasTouch=device.hasTouch;

            this.eventBind();
        };

    createMyTouchEven.prototype = {
        eventBind:function(){
            var _this=this;
            this.obj.addEventListener(device.START_EV,this.touchStart=function(e){_this.touchStartHandler(e);},false);
            this.obj.addEventListener(device.MOVE_EV,this.touchMove=function(e){_this.touchMoveHandler(e);},false);
            this.obj.addEventListener(device.END_EV,this.touchEnd=function(){_this.touchEndHandler();},false);

            this.clickDownEven=document.createEvent('Event');
            this.clickDownEven.initEvent("myclickdown", true, true);

            this.clickOkEven=document.createEvent('Event');
            this.clickOkEven.initEvent("myclickok", true, true);

            this.clickUpEven=document.createEvent('Event');
            this.clickUpEven.initEvent("myclickup", true, true);

            this.longClickEven=document.createEvent('Event');
            this.longClickEven.initEvent("mylongclick", true, true);

            /*
             this.slideUpEven=document.createEvent('Event');
             this.slideUpEven.initEvent("myslideup", true, true);

             this.slideDownEven=document.createEvent('Event');
             this.slideDownEven.initEvent("myslidedown", true, true);

             this.slideRightEven=document.createEvent('Event');
             this.slideRightEven.initEvent("myslideright", true, true);

             this.slideLeftEven=document.createEvent('Event');
             this.slideLeftEven.initEvent("myslideleft", true, true);
             */
        },
        f5:function(){
            this.points=[];
            this.isTouchStarted=false;
            this.isTouchMoved=false;
            this.isLongClicked=false;
            this.isTouchEnded=false;
        },
        isTouchOkFn:function(){
            //判断是否是有效点击
            var nowdatatime=new Date().getTime();

            //点击时间间隔控制
            if(this.touchSTime){
                /*
                 if(nowdatatime-this.touchSTime>this.touchJQ){
                 //有效
                 this.isTouchOk=true;
                 }else{
                 //无效
                 this.isTouchOk=false;
                 }
                 */
                this.isTouchOk = (nowdatatime-this.touchSTime>this.touchJQ);
                if(this.isTouchOk){
                    this.touchSTime=nowdatatime;
                }
            }else{
                this.isTouchOk = true;
                this.touchSTime=nowdatatime;
            }

        },
        //长按事件监听
        clickLongListenerFn:function(){
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
                _this.touchStartHandlerGo();
            },this.touchDelay);
        },
        //点击后延迟执行
        touchStartHandlerGo:function(){
            this.isTouchStarted=true;

            //注册长按事件
            this.clickLongListenerFn();

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
//            e.preventDefault();
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
        touchEndHandler:function(){
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
                        _this.obj.dispatchEvent(_this.clickUpEven);
                        _this.obj.dispatchEvent(_this.clickOkEven);

                    },200)
                }else{
                    //判断是否触发移动   和   判断移动类型  this.touchSTime
                    /*
                     var thistime = new Date().getTime();
                     if(thistime-this.touchSTime <= device.slideTriggerMaxTime ){
                     //执行滑动事件
                     _this.chooseSlideType();

                     }
                     */
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
            var touch;
            if(this.hasTouch){
                touch=e.touches[0];
            }else{
                touch=e;
            }
            this.points.push({x:touch.clientX,y:touch.clientY});
        }
    };

    var events = {
        addClickListener:function(){
            var _this=this;
            new createMyTouchEven(document);
            //clickok
            document.addEventListener("myclickok",function(e){
//                e.preventDefault();
                _this.dothis("myclickok",e);
            },false);
            //clickdown
            document.addEventListener("myclickdown",function(e){
//                e.preventDefault();
                _this.dothis("myclickdown",e);
            },false);
            //clickup
            document.addEventListener("myclickup",function(e){
//                e.preventDefault();
                _this.dothis("myclickup",e);
            },false);
            //longclick
            document.addEventListener("mylongclick",function(e){
//                e.preventDefault();
                _this.dothis("mylongclick",e);
            },false);

            /*
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
             */

        },
        dothis:function(type,e){
            var _this=this,
                that=e.mytarget,
                isfind = false;

            var gonext = function(obj){
                var p_obj = obj.parentNode;
                handlerthis(p_obj);
            };

            var handlerthis = function(obj){
                if(obj.nodeName.toLowerCase() == "html"){ return;}

                var _eventid = obj.__bens_eventid__;

                if(_this.savefn[_eventid]){
                    isfind = true;
                    if(_this.savefn[_eventid][type]){
                        _this.savefn[_eventid][type].call(obj,e);
                    }
                }


                if(!isfind){
                    gonext(obj);
                }

            };

            handlerthis(that);
        },
        savefn:{}
    };
    events.addClickListener();

    var eventBind = function(a){
        this.objs = null;               //传入的obj
        if(typeof(a) === "object"){
            if($.is$(a)){
                this.objs = a;
            }else{
                this.objs = $(a);
            }
        }else{
            this.objs = $(a);
        }

        this.idArray = [];
        this.saveobj = events.savefn;
        this.init();
    };
    eventBind.prototype = {
        init:function(){
            if(this.objs.length == 0){console.log("有事件绑定失败");return;}

            var _this = this;

            //遍历对象 写入事件id
            this.objs.each(function(){
                var thisobj = this;

                if(thisobj.__bens_eventid__){
                    _this.idArray.push(thisobj.__bens_eventid__);
                }else{
                    var eventname = "e" + device.counter();
                    thisobj.__bens_eventid__ = eventname;
                    _this.idArray.push(eventname);
                    _this.saveobj[eventname] = {};
                }

            });

        },
        savefn:function(fn,type){
            var data = this.idArray;

            for(var i= 0,l=data.length;i<l;i++){
                var id = data[i];
                this.saveobj[id][type] = fn;
            }
        },
        trigger:function(type){
            for(var i= 0,l=this.idArray.length;i<l;i++){
                var id = this.idArray[i];
                if( this.saveobj[id] && this.saveobj[id][type]){
                    this.saveobj[id][type]();
                }
            }
            return this;
        },
        myclickok:function(callback){
            this.savefn(callback,"myclickok");
            return this;
        },
        myclickdown:function(callback){
            this.savefn(callback,"myclickdown");
            return this;
        },
        myclickup:function(callback){
            this.savefn(callback,"myclickup");
            return this;
        },
        mylongclick:function(callback){
            this.savefn(callback,"mylongclick");
            return this;
        },
        unbind:function(type){
            var data = this.idArray,
                delall = false,
                _this = this;

            if(type && $.isBoolean(type)){
                delall = true;
            }

            var clearAll = function(this_obj){
                var id = this_obj.__bens_eventid__;
                delete this_obj.__bens_eventid__;
                delete _this.saveobj[id];
            };


            this.objs.each(function(){
                var this_obj = this;
                if(delall){
                    clearAll(this_obj);
                }else{
                    delete _this.saveobj[id][type];

                    //检查是否所有事件都为空
                    var this_data = _this.saveobj[id],
                        isnull = true;

                    for(var key in this_data){
                        if(this_data[key]){
                            isnull = false;
                            break;
                        }
                    }
                    if(isnull){
                        clearAll(this_obj);
                    }
                }
            });


            return this;
        }
        /*
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
         */

    };

    window.temp_event = events.savefn;
    window.$$ = function(a){
        return new eventBind(a);
    };


})();




//loading
(function(){
    var __loading = function(datas){
        this.obj = ($.is$(datas.obj))? datas.obj.get(0) : datas.obj;    //要放入的对象
        this.spokes = ($.isNumber(datas.number))? datas.number : 7;     //花瓣的次数
        this.width = ($.isNumber(datas.width))? datas.width : 30;       //loading所占的宽度
        this.height = ($.isNumber(datas.height))? datas.height : 30;    //loading所占的高度
        this.lineWidth = ($.isNumber(datas.lineWidth))? datas.lineWidth : 5;  //loading线条的宽度
        this.lineHeight = ($.isNumber(datas.lineHeight))? datas.lineHeight : 2; //loading线条的长度
        this.rgb = datas.rgb || "0,0,0";
        this.spd = datas.fps || 100;


        this.canvas = null;
        this.ctx = null;
        this.intervalFn = null;

        this.init();
    };
    __loading.prototype = {
        init:function(){
            this.createCanvas();
        },
        //创建画板
        createCanvas:function(){
            var _this = this;
            this.canvas = document.createElement("canvas");
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            if (!this.canvas.getContext){console.log("not suppot canvas");return;}
            this.ctx = this.canvas.getContext('2d');
            this.ctx.translate(_this.width/2,_this.width/2);	// Center the origin
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.lineCap = "round";

            this.appendCanvas();
        },
        //添加画板
        appendCanvas:function(){
            this.obj.appendChild(this.canvas);
        },
        //画画
        draw:function(){
            var ctx = this.ctx,
                spokes = this.spokes,
                _this = this;

            ctx.clearRect(-_this.width/2,-_this.height/2,_this.width,_this.height);		// Clear the image
            ctx.rotate(Math.PI*2/spokes);	// Rotate the origin
            for (var i=0; i<spokes; i++) {
                ctx.rotate(Math.PI*2/spokes);	// Rotate the origin
                ctx.strokeStyle = "rgba("+this.rgb+","+ i/spokes +")";	// Set transparency
                ctx.beginPath();
                ctx.moveTo(0,_this.width/3 - _this.lineHeight);
                ctx.lineTo(0,_this.width/3);
                ctx.stroke();
            }
        },
        //开始转
        run:function(){
            var _this = this;
            this.intervalFn = setInterval(function(){
                _this.draw();
            },this.spd);
        },
        //停止
        stop:function(){
            var _this = this;
            clearInterval(this.intervalFn);
            this.ctx.clearRect(-_this.width/2,-_this.height/2,_this.width,_this.height);
        },
        //销毁
        destroy:function(){
            this.stop();
            $(this.canvas).remove();
        }
    };

    var device = $.device;

    var loading = function(obj){
        this.win = $.getDom(obj);
        if(!this.win){console.log("loading param error");return;}

        //this.win 转原生对象

        this.text = null;       //显示文字的对象
        this.canvas = null;     //动画canvas对象
        this.div = null;        //主窗口

        this.downfn = null;     //阻止事件冒泡和默认事件
        this.movefn = null;
        this.endfn = null;

        this._init();
    };
    loading.prototype = {
        _init:function(){
            this.win.style.position = "relative";
            this._createObj();
            this._addEven();
        },
        //创建对象
        _createObj:function(){
            var win = document.createElement("div"),
                main = document.createElement("div"),
                _canvas =document.createElement("div"),
                text = document.createElement("div");

            win.style.cssText = "position:fixed;z-index:99999;left:0;top:0;width:100%;height:100%;display:none;"+device.box_align+":center;"+device.box_pack+":center;";
            main.style.cssText = "padding:20px;background:rgba(0,0,0,0.8);"+device.border_radius+":5pt;display:"+device.box+";"+device.box_align+":center;"+device.box_orient+":"+device.vertical;
            _canvas.style.cssText = "width:60px;height:60;";
            text.style.cssText = "height:30px;line-height:30px;color:#ccc;";

            var canvas = new __loading({
                obj:_canvas,
                width:60,
                height:60,
                rgb:"230,230,230",
                lineHeight:3,
                number:9,
                fps:100
            });


            $(main).append(_canvas).append(text);
            $(win).append(main);

            $(this.win).append(win);

            this.text = text;
            this.canvas = canvas;
            this.div = win;
        },
        //阻止事件冒泡
        _addEven:function(){
            var _box = this.div,
                _this = this;
            _box.addEventListener(device.START_EV,_this.downfn = function(e){e.stopPropagation();e.preventDefault();},false);
            _box.addEventListener(device.MOVE_EV,_this.movefn = function(e){e.stopPropagation();e.preventDefault();},false);
            _box.addEventListener(device.END_EV,_this.endfn = function(e){e.stopPropagation();e.preventDefault();},false);
        },
        //显示
        show:function(text){
            $(this.text).text(text);
            this.div.style.display = device.box;
            this.canvas.run();
        },
        changeText:function(text){
            $(this.text).text(text);
        },
        //隐藏
        hide:function(){
            this.div.style.display = "none";
            this.canvas.stop();
        },
        //销毁
        destroy:function(){
            this.canvas.destroy();
            this.canvas = null;
            var _this = this;
            this.div.removeEventListener(device.START_EV,_this.downfn,false);
            this.div.removeEventListener(device.MOVE_EV,_this.movefn,false);
            this.div.removeEventListener(device.END_EV,_this.endfn,false);
            $(this.div).remove();
        }
    };


    $.loading = loading;
    $.__loading = __loading;

})();




//banner切换
/*
 * 注意：自己定义外面样式 ，obj为滑动的dom对象，页面不要隐藏
 *
 * var divslide = $.device;
 *
 * var bb = new divslide({
 *      obj:id/jqdom/dom,
 *      win:id/jqdom/dom,  //包裹层
 *      slideTime:number,  //滚动一屏幕的时间（可选，默认为屏幕宽度ms）
 *      autoRun:bloom,     //是否自动滚动   默认true
 *      autoRunTime：number,//自动滚动间隔时间
 *      moveFn：function(n){} //n=当前滑动到第几个，0开始
 * })
 *
 * bb.refresh()  //刷新
 * bb.destroy()  //销毁
 */
(function () {
    var device = $.device,
        nextFrame = device.nextFrame,
        cancelFrame = device.cancelFrame;

    var divSlide = function (data) {
        this.obj = $.getDom(data.obj);
        this.win = $.getDom(data.win);
        this.autoRunTime = data.autoRunTime || 5000;
        this.autoRun = ($.isBoolean(data.autoRun)) ? data.autoRun : true;
        this.winWidth = parseInt($(this.win).width());
        this.objWidth = parseInt($(this.obj).width());
        //        this.maxPage = data.maxPage;
        this.slideTime = data.slideTime || data.winWidth;
        this.moveFn = $.getFunction(data.moveFn);

        this.x = 0;
        this.maxScroll = this.objWidth - this.winWidth;

        this.longSlidePx = 30;
        this.longSlideTime = 300;


        this.points = [];
        this.isTouchStart = false;

        this.animate = null;
        this.intervalFn = null;

        this.bodyScrollY = 0;

        this._eventBind();
    };
    divSlide.prototype = {
        _eventBind: function () {
            this.obj.addEventListener(device.START_EV, this, false);
            this.obj.addEventListener(device.MOVE_EV, this, false);
            this.obj.addEventListener(device.END_EV, this, false);

            if (this.autoRun) {
                this._intervalFn();
            }
        },
        _intervalFn: function () {
            var _this = this;
            this.intervalFn = setInterval(function () {
                var move_e, move_time;
                if (Math.abs(_this.x) == _this.maxScroll) {
                    move_e = 0;
                    move_time = _this.slideTime;

                } else {
                    move_e = _this.x - _this.winWidth;
                    move_time = _this._getMoveTime(_this.winWidth);
                }

                _this._animateTo(_this.x, move_e, move_time);
            }, _this.autoRunTime);
        },
        handleEvent: function (e) {
            var type = e.type,
                _this = this;

            switch (type) {
                case device.START_EV:
                    _this._start(e);
                    break;
                case device.MOVE_EV:
                    _this._move(e);
                    break;
                case device.END_EV:
                    _this._end(e);
                    break;
                default:
                    _this._end(e);
                    break;
            }
        },
        _start: function (e) {
            if (this.autoRun) {
                clearInterval(this.intervalFn);
            }

            this._stopAnimate();
            //            e.preventDefault();
            //e.stopPropagation();
            this._savePoint(e);
            this.isTouchStart = true;
            this.bodyScrollY = document.body.scrollTop;

        },
        _move: function (e) {
            e.preventDefault();
            //e.stopPropagation();
            if (!this.isTouchStart) { return; }
            this._savePoint(e);

            if (this.points.length < 2) { return; }

            var l = this.points.length,
                end = this.points[l - 1],
                start = this.points[l - 2],
                begin = this.points[0],
                end_x = end.x,
                start_x = start.x,
                temp_x = end_x - start_x + this.x,
                start_y = begin.y,
                end_y = end.y,
                temp_y = start_y - end_y + this.bodyScrollY;
            //            console.log(temp_y+" "+start_y+" "+end_y+" ");

            if (Math.abs(end_x - start_x) > Math.abs(start.y - end_y)) {
                this._moveTo(temp_x);
            } else {
                this._bodyScrollTo(temp_y);
            }


        },
        _end: function (e) {
            //            e.preventDefault();
            //e.stopPropagation();
            if (this.autoRun) {
                this._intervalFn();
            }

            if (!this.isTouchStart) { return; }
            //            this._savePoint(e);
            this.isTouchStart = false;

            if (this.points.length < 2) {
                this._autoScrollBack();
                return;
            }


            var l = this.points.length,
                end = this.points[l - 1],
                start = this.points[0],
                end_x = end.x,
                end_time = end.time,
                start_x = start.x,
                start_time = start.time;

            if (end_time - start_time <= this.longSlideTime && Math.abs(end_x - start_x) > this.longSlidePx) {
                //快速滑动
                var move_length = Math.abs(this.x) % this.winWidth,
                    move_e, move_time;

                if (end_x > start_x) {
                    //右滑
                    move_length = this.winWidth - move_length;
                    move_e = this.x + (this.winWidth - move_length);
                    move_time = this._getMoveTime(this.winWidth - move_length);

                } else {
                    //左滑
                    move_e = this.x - (this.winWidth - move_length);
                    move_time = this._getMoveTime(this.winWidth - move_length);

                }
                this._animateTo(this.x, move_e, move_time);

            } else {
                //回弹
                this._autoScrollBack();
            }

            this.points = [];

        },
        _autoScrollBack: function () {
            var move_length = Math.abs(this.x) % this.winWidth,
                move_e, move_time;

            if (move_length > this.winWidth / 2) {
                move_e = this.x - (this.winWidth - move_length);
                move_time = this._getMoveTime(this.winWidth - move_length);
            } else {
                move_e = this.x + (move_length);
                move_time = this._getMoveTime(move_length);
            }

            this._animateTo(this.x, move_e, move_time);
        },
        _getMoveTime: function (long) {
            return long/this.winWidth*this.slideTime;
        },
        _savePoint: function (e) {
            var x, y;
            if (device.hasTouch) {
                x = e.touches[0].clientX;
                y = e.touches[0].clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }

            this.points.push({
                x: x,
                y: y,
                time: e.timeStamp
            })
        },
        _moveTo: function (x) {
            x = $.fixMedian(x, -this.maxScroll, 0);
            $(this.obj).myCss({
                transform: "translate(" + x + "px,0)"
            });
            this.x = x;
        },
        //长滑动到
        _animateTo: function (s, e, t) {
            var n = Math.abs(e / this.winWidth);
            n = $.fixMedian(n, 0, this.objWidth / this.winWidth - 1);
            this.moveFn(n);

            var startTime = (new Date()).getTime(),
                _this = this, newY, easeOut;
            //var doit = -1;

            var animate = function () {
                var timestamp = (new Date()).getTime();
                var progress = timestamp - startTime;

                if (progress >= t) {
                    //go to  finish pos
                    _this._moveTo(e);
                    //                    _this.objMoveing = false;
                    setTimeout(function () {
                        _this._stopAnimate();
                    }, 0);
                    return;
                }

                timestamp = (timestamp - startTime) / t - 1;
                easeOut = Math.sqrt(1 - timestamp * timestamp);
                newY = (e - s) * easeOut + s;



                _this._moveTo(newY);



                _this.animate = nextFrame(animate);

            };
            animate();
        },
        //停止动画
        _stopAnimate: function () {
            if (this.animate) {
                cancelFrame(this.animate);
                this.animate = null;
                //                this.isTouchStart = false;
            }
        },
        //滚动条滚动修正。。。
        _bodyScrollTo: function (y) {
            document.body.scrollTop = y;
        },
        refresh: function () {
            this.winWidth = parseInt($(this.win).width());
            this.objWidth = parseInt($(this.obj).width());
            this.maxScroll = this.objWidth - this.winWidth;

            this._stopAnimate();
            this._autoScrollBack();
        },
        destroy: function () {
            this.obj.removeEventListener(device.START_EV, this, false);
            this.obj.removeEventListener(device.MOVE_EV, this, false);
            this.obj.removeEventListener(device.END_EV, this, false);


        }
    };

    $.divSlide = divSlide;

})();




//iscroll
(function(window, doc){
    var m = Math,
        device  = $.device,
        dummyStyle = doc.createElement('div').style,
        vendor = (function () {
            var vendors = 't,webkitT,MozT,msT,OT'.split(','),
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
    // Style properties
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

        has3d = prefixStyle('perspective') in dummyStyle,
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = device.START_EV,
        MOVE_EV = device.MOVE_EV,
        END_EV = device.END_EV,
        CANCEL_EV = device.CANCEL_EV,
        TRNEND_EV = (function () {
            if ( vendor === false ) return false;

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

    // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;

            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
            that.wrapper.style.overflow = 'hidden';
            that.scroller = that.wrapper.children[0];

            // Default options
            that.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                topOffset: 0,
                checkDOMChanges: false,		// Experimental
                handleClick: true,

                // Scrollbar
                hScrollbar: true,
                vScrollbar: true,
                fixedScrollbar: isAndroid,
                hideScrollbar: isIDevice,
                fadeScrollbar: isIDevice && has3d,
                scrollbarClass: '',

                // Zoom
                zoom: false,
                zoomMin: 1,
                zoomMax: 4,
                doubleTapZoom: 2,
                wheelAction: 'scroll',

                // Snap
                snap: false,
                snapThreshold: 1,

                // Events
                onRefresh: null,
                onBeforeScrollStart: function (e) {
                    var target = e.target.nodeName.toLowerCase();
                    if(target == "input" || target == "textarea" ){

                    }else{
                        e.preventDefault();
                    }

                },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null,
                onZoomStart: null,
                onZoom: null,
                onZoomEnd: null
            };

            // User defined options
            for (i in options) that.options[i] = options[i];

            // Set starting position
            that.x = that.options.x;
            that.y = that.options.y;

            // Normalize options
            that.options.useTransform = hasTransform && that.options.useTransform;
            that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
            that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
            that.options.zoom = that.options.useTransform && that.options.zoom;
            that.options.useTransition = hasTransitionEnd && that.options.useTransition;

            // Helpers FIX ANDROID BUG!
            // translate3d and scale doesn't work together!
            // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
            if ( that.options.zoom && isAndroid ){
                translateZ = '';
            }

            // Set some default styles
            that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
            that.scroller.style[transitionDuration] = '0';
            that.scroller.style[transformOrigin] = '0 0';
            if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

            if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
            else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

            if (that.options.useTransition) that.options.fixedScrollbar = true;

            that.refresh();

            that._bind(RESIZE_EV, window);
            that._bind(START_EV);
            if (!hasTouch) {
                if (that.options.wheelAction != 'none') {
                    that._bind('DOMMouseScroll');
                    that._bind('mousewheel');
                }
            }

            if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
                that._checkDOMChanges();
            }, 500);
        };

// Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,

        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
                case TRNEND_EV: that._transitionEnd(e); break;
            }
        },

        _checkDOMChanges: function () {
            if (this.moved || this.zoomed || this.animating ||
                (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

            this.refresh();
        },

        _scrollbar: function (dir) {
            var that = this,
                bar;

            if (!that[dir + 'Scrollbar']) {
                if (that[dir + 'ScrollbarWrapper']) {
                    if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                    that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                    that[dir + 'ScrollbarWrapper'] = null;
                    that[dir + 'ScrollbarIndicator'] = null;
                }

                return;
            }

            if (!that[dir + 'ScrollbarWrapper']) {
                // Create the scrollbar wrapper
                bar = doc.createElement('div');

                if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
                else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:0');

                bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

                that.wrapper.appendChild(bar);
                that[dir + 'ScrollbarWrapper'] = bar;

                // Create the scrollbar indicator
                bar = doc.createElement('div');
                if (!that.options.scrollbarClass) {
                    bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
                }
                bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
                if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

                that[dir + 'ScrollbarWrapper'].appendChild(bar);
                that[dir + 'ScrollbarIndicator'] = bar;
            }

            if (dir == 'h') {
                //mdf...
                that.hScrollbarSize = that.wrapper.clientWidth;
                that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
                that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
                that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
                that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
            } else {
                //mdf...
                that.vScrollbarSize = that.wrapper.clientHeight;
                that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
                that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
                that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
                that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
            }

            // Reset position
            that._scrollbarPos(dir, true);
        },

        _resize: function () {
            var that = this;
            setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
        },

        _pos: function (x, y) {
            if (this.zoomed) return;

            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
            } else {
                x = m.round(x);
                y = m.round(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
            }

            this.x = x;
            this.y = y;

            this._scrollbarPos('h');
            this._scrollbarPos('v');
        },

        _scrollbarPos: function (dir, hidden) {
            var that = this,
                pos = dir == 'h' ? that.x : that.y,
                size;

            if (!that[dir + 'Scrollbar']) return;

            pos = that[dir + 'ScrollbarProp'] * pos;

            if (pos < 0) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                }
                pos = 0;
            } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
                if (!that.options.fixedScrollbar) {
                    size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                    if (size < 8) size = 8;
                    that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                    pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
                } else {
                    pos = that[dir + 'ScrollbarMaxScroll'];
                }
            }

            that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
            that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
            that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
        },

        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y,
                c1, c2;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;

            // Gesture start
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
                that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

                that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
                that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

                if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
            }

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                    y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
                }

                if (x != that.x || y != that.y) {
                    if (that.options.useTransition) that._unbind(TRNEND_EV);
                    else cancelFrame(that.aniTime);
                    that.steps = [];
                    that._pos(x, y);
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                }
            }

            that.absStartX = that.x;	// Needed by snap threshold
            that.absStartY = that.y;

            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV, window);
            that._bind(END_EV, window);
            that._bind(CANCEL_EV, window);
        },

        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,
                c1, c2, scale,
                timestamp = e.timeStamp || Date.now();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            // Zoom
            if (that.options.zoom && hasTouch && e.touches.length > 1) {
                c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
                c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
                that.touchesDist = m.sqrt(c1*c1+c2*c2);

                that.zoomed = true;

                scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

                if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
                else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

                that.lastScale = scale / this.scale;

                newX = this.originX - this.originX * that.lastScale + this.x,
                    newY = this.originY - this.originY * that.lastScale + this.y;

                this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

                if (that.options.onZoom) that.options.onZoom.call(that, e);
                return;
            }

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;
            that._pos(newX, newY);
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },

        _end: function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = { dist:0, time:0 },
                momentumY = { dist:0, time:0 },
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                distX, distY,
                newDuration,
                snap,
                scale;

            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

            if (that.zoomed) {
                scale = that.scale * that.lastScale;
                scale = Math.max(that.options.zoomMin, scale);
                scale = Math.min(that.options.zoomMax, scale);
                that.lastScale = scale / that.scale;
                that.scale = scale;

                that.x = that.originX - that.originX * that.lastScale + that.x;
                that.y = that.originY - that.originY * that.lastScale + that.y;

                that.scroller.style[transitionDuration] = '200ms';
                that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;

                that.zoomed = false;
                that.refresh();

                if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                return;
            }

            if (!that.moved) {
                if (hasTouch) {
                    if (that.doubleTapTimer && that.options.zoom) {
                        // Double tapped
                        clearTimeout(that.doubleTapTimer);
                        that.doubleTapTimer = null;
                        if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                        that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                        if (that.options.onZoomEnd) {
                            setTimeout(function() {
                                that.options.onZoomEnd.call(that, e);
                            }, 200); // 200 is default zoom duration
                        }
                    } else if (this.options.handleClick) {
                        that.doubleTapTimer = setTimeout(function () {
                            that.doubleTapTimer = null;

                            // Find the last touched element
                            target = point.target;
                            while (target.nodeType != 1) target = target.parentNode;

                            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                                ev = doc.createEvent('MouseEvents');
                                ev.initMouseEvent('click', true, true, e.view, 1,
                                    point.screenX, point.screenY, point.clientX, point.clientY,
                                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                    0, null);
                                ev._fake = true;
                                target.dispatchEvent(ev);
                            }
                        }, that.options.zoom ? 250 : 0);
                    }
                }

                that._resetPos(400);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

                // Do we need to snap?
                if (that.options.snap) {
                    distX = newPosX - that.absStartX;
                    distY = newPosY - that.absStartY;
                    if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                    else {
                        snap = that._snap(newPosX, newPosY);
                        newPosX = snap.x;
                        newPosY = snap.y;
                        newDuration = m.max(snap.time, newDuration);
                    }
                }

                that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
                else {
                    snap = that._snap(that.x, that.y);
                    if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
                }

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            that._resetPos(200);
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                }

                if (that.hScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                    that.hScrollbarWrapper.style.opacity = '0';
                }
                if (that.vScrollbar && that.options.hideScrollbar) {
                    if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                    that.vScrollbarWrapper.style.opacity = '0';
                }

                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },

        _wheel: function (e) {
            var that = this,
                wheelDeltaX, wheelDeltaY,
                deltaX, deltaY,
                deltaScale;

            if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 12;
                wheelDeltaY = e.wheelDeltaY / 12;
            } else if('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail * 3;
            } else {
                return;
            }

            if (that.options.wheelAction == 'zoom') {
                deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
                if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
                if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;

                if (deltaScale != that.scale) {
                    if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    that.wheelZoomCount++;

                    that.zoom(e.pageX, e.pageY, deltaScale, 400);

                    setTimeout(function() {
                        that.wheelZoomCount--;
                        if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                    }, 400);
                }

                return;
            }

            deltaX = that.x + wheelDeltaX;
            deltaY = that.y + wheelDeltaY;

            if (deltaX > 0) deltaX = 0;
            else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

            if (deltaY > that.minScrollY) deltaY = that.minScrollY;
            else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;

            if (that.maxScrollY < 0) {
                that.scrollTo(deltaX, deltaY, 0);
            }
        },

        _transitionEnd: function (e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind(TRNEND_EV);

            that._startAni();
        },


        /**
         *
         * Utilities
         *
         */
        _startAni: function () {
            var that = this,
                startX = that.x, startY = that.y,
                startTime = Date.now(),
                step, easeOut,
                animate;

            if (that.animating) return;

            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }

            step = that.steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;

            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind(TRNEND_EV);
                else that._resetPos(0);
                return;
            }

            animate = function () {
                var now = Date.now(),
                    newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function (time) {
            time += 'ms';
            this.scroller.style[transitionDuration] = time;
            if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
            if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
        },

        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
                speed = m.abs(dist) / time,
                newDist = (speed * speed) / (2 * deceleration),
                newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return { dist: newDist, time: m.round(newTime) };
        },

        _offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return { left: left, top: top };
        },

        _snap: function (x, y) {
            var that = this,
                i, l,
                page, time,
                sizeX, sizeY;

            // Check page X
            page = that.pagesX.length - 1;
            for (i=0, l=that.pagesX.length; i<l; i++) {
                if (x >= that.pagesX[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
            x = that.pagesX[page];
            sizeX = m.abs(x - that.pagesX[that.currPageX]);
            sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
            that.currPageX = page;

            // Check page Y
            page = that.pagesY.length-1;
            for (i=0; i<page; i++) {
                if (y >= that.pagesY[i]) {
                    page = i;
                    break;
                }
            }
            if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
            y = that.pagesY[page];
            sizeY = m.abs(y - that.pagesY[that.currPageY]);
            sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
            that.currPageY = page;

            // Snap with constant speed (proportional duration)
            time = m.round(m.max(sizeX, sizeY)) || 200;

            return { x: x, y: y, time: time };
        },

        _bind: function (type, el, bubble) {
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },


        /**
         *
         * Public methods
         *
         */
        destroy: function () {
            var that = this;

            that.scroller.style[transform] = '';

            // Remove the scrollbars
            that.hScrollbar = false;
            that.vScrollbar = false;
            that._scrollbar('h');
            that._scrollbar('v');

            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (!that.options.hasTouch) {
                that._unbind('DOMMouseScroll');
                that._unbind('mousewheel');
            }

            if (that.options.useTransition) that._unbind(TRNEND_EV);

            if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

            if (that.options.onDestroy) that.options.onDestroy.call(that);
        },

        refresh: function () {
            var that = this,
                offset,
                i, l,
                els,
                pos = 0,
                page = 0;

            if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = -that.options.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

            that.hScrollbar = that.hScroll && that.options.hScrollbar;
            that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;

            // Prepare snap
            if (typeof that.options.snap == 'string') {
                that.pagesX = [];
                that.pagesY = [];
                els = that.scroller.querySelectorAll(that.options.snap);
                for (i=0, l=els.length; i<l; i++) {
                    pos = that._offset(els[i]);
                    pos.left += that.wrapperOffsetLeft;
                    pos.top += that.wrapperOffsetTop;
                    that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                    that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
                }
            } else if (that.options.snap) {
                that.pagesX = [];
                while (pos >= that.maxScrollX) {
                    that.pagesX[page] = pos;
                    pos = pos - that.wrapperW;
                    page++;
                }
                if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

                pos = 0;
                page = 0;
                that.pagesY = [];
                while (pos >= that.maxScrollY) {
                    that.pagesY[page] = pos;
                    pos = pos - that.wrapperH;
                    page++;
                }
                if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
            }

            // Prepare the scrollbars
            that._scrollbar('h');
            that._scrollbar('v');

            if (!that.zoomed) {
                that.scroller.style[transitionDuration] = '0';
                that._resetPos(400);
            }
        },

        scrollTo: function (x, y, time, relative) {
            var that = this,
                step = x,
                i, l;

            that.stop();

            if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];

            for (i=0, l=step.length; i<l; i++) {
                if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
            }

            that._startAni();
        },

        reload:function(){
            this.refresh();
            this.scrollTo(0,0);
        },

        scrollToElement: function (el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function (pageX, pageY, time) {
            var that = this, x, y;

            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);

            if (that.options.snap) {
                pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
                pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

                pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
                pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

                that.currPageX = pageX;
                that.currPageY = pageY;
                x = that.pagesX[pageX];
                y = that.pagesY[pageY];
            } else {
                x = -that.wrapperW * pageX;
                y = -that.wrapperH * pageY;
                if (x < that.maxScrollX) x = that.maxScrollX;
                if (y < that.maxScrollY) y = that.maxScrollY;
            }

            that.scrollTo(x, y, time);
        },

        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV, window);
            this._unbind(END_EV, window);
            this._unbind(CANCEL_EV, window);
        },

        enable: function () {
            this.enabled = true;
        },

        stop: function () {
            if (this.options.useTransition) this._unbind(TRNEND_EV);
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },

        zoom: function (x, y, scale, time) {
            var that = this,
                relScale = scale / that.scale;

            if (!that.options.useTransform) return;

            that.zoomed = true;
            time = time === undefined ? 200 : time;
            x = x - that.wrapperOffsetLeft - that.x;
            y = y - that.wrapperOffsetTop - that.y;
            that.x = x - x * relScale + that.x;
            that.y = y - y * relScale + that.y;

            that.scale = scale;
            that.refresh();

            that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
            that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            that.scroller.style[transitionDuration] = time + 'ms';
            that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
            that.zoomed = false;
        },

        isReady: function () {
            return !this.moved && !this.zoomed && !this.animating;
        }
    };

    function prefixStyle (style) {
        if ( vendor === '' ) return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    dummyStyle = null;	// for the sake of it

    $.iscroll =  iScroll;

})(window, document);




//scroll_load  滚动加载

//var a = new $.scrollLoad({
//    loadText:"loading",           //加载显示文字
//    bottom:"500",                 //触发加载的条件（距离底部的距离）
//    ajaxFn:function(){            //需要触发的ajax函数
//        setTimeout(function(){
//            //加载成功执行
//            a.ajaxSuccess();
//            //加载失败执行
//            a.ajaxError(msg);     //失败提示文字
//            //数据到最后一条数据
//            a.ajaxComplete(msg)   //提示文字
//        },1000)
//    }
//})
//  销毁   a.destroy();
(function(){
    var error_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAADBElEQVQ4ja2VXWtcVRSGn33Omczkywk2raONo9QqiKnNaIQRFSkUJEPT0hSaBhEvO/6ijlAoIpJa0JKmNgjeSBUrarS2ItgKmjaYllRybObM+dh7Ly8mmU/T5sIN52bt9zy8a+21WNByFov5U4vFvCwW86fYxtlK77QKgHLh4DGA8sPAD9I7rYKx0jRyeY6x0vQDwQ/Tq03B/onjyM+fo4YyyD8RamyCq/OzAJWXriy91wncPzmD/LSAeiSNrIWoF9/i6sI5gIpaLOZl35tT2MvnUXuHUdkMaIPcraIKE1y7eLYB3gTuO3QC+XEBtasfPBfxQ+TmKs4bR7n25adNp8/7Ic7eYdSuAehxITbIahX1conrlz4GqADl0dI08sMl1HB/U3d3HXtzlV+zmbrT1pSeW49x8kOoHX2olIskBrkX4L5+hF8uzPLC4RnMV3Nd93Zpjd8GehoZqc5aPeOHuLuzqEd7UZ6LaIPUNN7BY+gvPkH1es343zXMss/vGw43a9+AtoKfvhfgPj6IM9SLStW7TqygnLpcEotdq2H+us8fO/q6HrMN2grO+yHeYwOo/h6U22hnxFikGqPvrLPU4XBLaBtYW9zBNMprgWqLuR+xVI91AaFlojqBew5MIVawscGGuvnFBrHCngNTsMWA/GdNn3rtCPH8LG5vqpm6CCjVKIGpJfRMzvDn13Ndjrte/8lXDxOd/wgvk0I5qu5WW8RYlOvgeE4jrsOE9NG3ufXNhTZwW5/uLk4SnfsQL+02f4wMSaTxnx0me2OVVNrruk8ff4flK/MNcGOicuOHiM5+QCrlohwQC0liiMKEYDQHGxPVd32FdCbVpUufeJeV7y8CVBygvLNQwj9zGoxFEo0JNVEQE1TjBnAjtUowmiOoxkRBjAk1kmgwFv/MaXYWSgBl9+RINhes3BiXZR9HBAwk2lKLNHHhibZavX/b/+zkSDZncoPj9tYaSkCMoLUh0pZ1dQc6Z5/vbuM5Cm0FXhnZsg+3rd9cDd8qJdtZKdvW/1876l8mq+FwTMY7EQAAAABJRU5ErkJggg==";


    var scroll_load = function(datas){
        this.ajaxFn = $.getFunction(datas.ajaxFn);
        this.loadText = datas.loadText || "正在加载数据";
        this.bottom = datas.bottom || 300; //触发时距底部距离

        this.div = null;  //显示的div
        this.text = null; //显示的文字
        this.canvas = null; //动画loading
        this.close = null; //关闭按钮
        this.canvasDom = null;  //动画dom
        this.winHeight = parseInt(window.innerHeight);  //窗口高度
        this.isLoading = false;

        this.scrollEvent = null;
        this.resizeEvent = null;

        this.init();
    };
    scroll_load.prototype = {
        init:function(){
            this.createShowDiv();
            this.eventBind();


        },
        createShowDiv:function(){
            var div = $("<div></div>");
            div.myCss({
                position:"fixed",
                left:0,
                bottom:0,
                width:"100%",
                height:"40px",
                background:"rgba(0,0,0,0.7)",
                color:"#fff",
                display:"none",
                "box-orient":"horizontal",
                "box-align":"center",
                "box-pack":"center"
            });

            var canvas = $("<div></div>");
            canvas.css({
                width:"30px",
                height:"30px"
            });

            var text = $("<div></div>");
            text.css({
                "max-width":"70%",
                "height":"40px",
                "line-height":"40px",
                "padding-left":"20px"
            }).addClass("diandian");


            var close = $("<div></div>");
            close.myCss({
                position:"absolute",
                right:0,
                top:0,
                display:"none",
                width:"40px",
                height:"40px",
                background:"url("+error_img+") no-repeat center center",
                "background-size":"20px 20px"
            });



            div.append(canvas).append(text).append(close);

            this.canvas = new $.__loading({
                obj:canvas,
                width:30,
                height:30,
                rgb:"230,230,230",
                lineHeight:3,
                number:6,
                fps:100
            });
            this.close = close;
            this.canvasDom = canvas;
            this.text = text;
            this.div = div;

            $("body").append(div);
        },
        eventBind:function(){
            var _this = this;
            window.addEventListener("scroll",_this.scrollEvent = function(){
                var scroll_top = document.body.scrollTop,
                    scroll_height = document.body.scrollHeight,
                    toButton = scroll_height - scroll_top - _this.winHeight;

                if(toButton <= _this.bottom && !_this.isLoading){
                    _this.isLoading = true;
                    _this.show();
                    _this.ajaxFn()
                }
            },false);

            window.addEventListener("resize",_this.resizeEvent = function(){
                _this.refresh();
            },false);


        },
        addClickEvent:function(){
            var _this = this;
            $$(_this.div).myclickok(function(){
                $$(_this.div).unbind(true);
                $$(_this.close).unbind(true);
                _this.show();
                _this.ajaxFn()
            });

            $$(_this.close).myclickok(function(){
                $$(_this.div).unbind(true);
                $$(_this.close).unbind(true);
                _this.ajaxSuccess();
                _this.destroy();
            });

        },
        refresh:function(){
            this.winHeight = parseInt(window.innerHeight);  //窗口高度
        },


        show:function(){
            this.text.text(this.loadText);
            this.canvasDom.css({display:"block"});
            this.close.css({display:"none"});
            this.canvas.run();
            this.div.myCss({
                display:"box"
            });
        },
        ajaxError:function(msg){
            msg = msg || "加载失败，点击重新加载";
            this.canvas.stop();
            this.canvasDom.css({display:"none"});
            this.close.css({display:"block"});
            this.text.text(msg);
            this.addClickEvent();
        },
        ajaxSuccess:function(){
            this.canvas.stop();
            this.div.css({
                display:"none"
            });
            this.isLoading = false;
            this.refresh();
        },
        ajaxComplete:function(msg){
            msg = msg || "亲，已加载到最后一条";
            var _this = this;
            this.canvas.stop();
            this.canvasDom.css({display:"none"});
            this.close.css({display:"none"});
            this.text.text(msg);
            setTimeout(function(){
                _this.div.cssAnimate({
                    opacity:0
                },1000,function(){
                    _this.destroy();
                })
            },2000)
        },
        destroy:function(){
            window.removeEventListener("scroll",this.scrollEvent,false);
            window.removeEventListener("resize",this.resizeEvent,false);
            $$(this.div).unbind(true);
            $$(this.close).unbind(true);
            this.canvas.destroy();
            this.div.remove();
        }

    };


    $.scrollLoad  = scroll_load;
})();



//显示提示信息
//$.info.show(text,Boolean);
// @param text:str   提示文字
// @param Boolean:Boolean  错误信息或提示信息
(function () {
    var device = $.device;
    var info = {
        box: null,
        img: null,
        text: null,
        isExist: false,
        isRun: false,
        fn: null,
        errimg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVdJREFUeNq0V1tsVFUUXee+pnc6MI8+qC3QViiNJlVERVHUH0pi5ENifaQGgx8m/miM8UMMfmiMmpiY+IFRA0ow9scaEh8hxoQPUDAa5FFjKG3BCh2h05l2ptNO587ce9z70g5M53V/3MlJ7uxz9lpn77P3PmeE1J9GJZE0ppDFeZnCbzKBizJtTMPqcYBOmoosLksowKUQjKGP7RELHkU4FYgTsHBaTuOkjKtjcrbfgrPThNobgS/QKHyoh+qum4ONKZml9dl0BvZRA8rgOrFi4M38Obsqsa09VaRwyM8LMo1fZAynML1TgXivC4Hue0UEXWIFGkDQECU2vNERsvudInMBs8Ok2/OJPXq4InH+JmLyCufkDJFOmZcxf2gdAn0PiEZ0E2Hdooe1ZIEiMCxncUJOYQzpwTXwP/eqfTpTQpzTnizs+iyRUmjbksh9f4cIbbxfNLgeFklrGKK7DWJdy/U8GLsKOTwBRKeLlsXJjV9lnB05E4S+42X7j4mb5xXHJQXtMo0hpEzay5EtonHjI6IZYSJdml8aMmBCvLgdyr4X3MHfrFu+jm0Zg7EY83PtPnMZsUSMAnQeKYb9qksEejaJMIVWcaOwfNjjk1B23EOWwh38zbpyaxmDsRiTsUs8/lvO83d/I3w77xQhUPa6pVRuxLNzgKHdQKBv1lVaz1iMydhfaw/2F4gnydsZWIYPylsdVCR0HmV3X/DYDWSxsK6aDWMyNnP8oD3sJo1y1VmAkNgVkNr6VtqfI2WNUZrJrKtlx9jMQVy7F0PtcDh2R4RB+xJVd740Sog92DB2A3H4oe5iG01ARKhGtzRQIBwPdepU0Hmxpa6HedhbTqrbIpomxGYdispJUM6bct5V8riWMIcpVDUHZ7NGpJ1+N4ulB1OUXSU9ErMwF9VQp6ZJETQWaxaeQl3GY+mdmLmoNQc1jQ5dXUwqL5IvW07eiZmLORUVSlIRSknLqzQSoBPKZG94a+XdvuzVnrlcTkrzS1IjYuGtLOghgGMfHiwQH/vgAN/FnmyZg7mYU4ybj0cgxCQ0RZXphZqhiiKDU/RAOEP9jmUjQrib+jE3iJqvjkAdnZVDJyObxXjTMxQ667gS9G+1own8n6K2RuAk53/umP3mIU3yLiC/hE/fKg0qKzqzaqKtboR+2xro1GC5V+ZGJpA7fwX5aLy6t3yx+HQqZn3AxXFmM1BC9QedvP260hLuzP8Tq2xN16BYYSL02hPw925yVenDJ5B442DNnFZbwhRheUmEAgdcqFwiBakKi663vSLoB2hUSxBrYqpAylL/2GZkL/5bvbcTJmNLXd3bfmG/df2SkA5yMUqUleYATXyrda6CNMtfjZwXY7lkSdcazc1UJGUsF5OwO4b3DxSCxyHKT6eRj6cg/L5nRTgwZGxYTWdhlL3Yr2VSOP7RoQLx0fc/c2u73FrGYCzGZOyiM/8T2wvn5+tqg96+qk2przuSi8Z7rOErsGfSRR5OUDmdplIaQtLtQj10zd9FJdWCuuIzDQVgdK+G3tow5MwtPNr+47tFjz0xtETMP3QNRlcrjFtvCWiNwS/ysZk+ayQKa/waZDbn7R8CZa6+thm+DW3QmkKD+ank8+3fvZ0uWXcOvSWZa7SvIkPabXtzH2neyceS3dZoFLnLMdipOZQ8Q8hGXVkPfU0TDCozrSk4Sto9bZ++Mlhxg2eXE98cKgKh8KsE1C80tU/m7F7q06ZDf1aWIsAeKvS8VUxfRujqT9J2BvOTMwNrB/ZU/wtzBtuqzJIn4cD1CLiehExhGreTfj3NBhdXJalAR2XG+qtt30sZr13sPwEGAJ9VE3aPBYcqAAAAAElFTkSuQmCC",
        okimg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBtJREFUeNqslk+ME1Ucx79v5s1Ot9tu9x+VIqgBVDTRcOHIQQ7EhLh6ABOPnA3cPJgYj8YbnDDcPZgQTTyQbJSbNz2QCBxwyWq6LgLWdlraTufPe8/fzL5pXodZtrvhJd9MOzPvfeb33u8fm+lit8GMKzP+Z0MZgnEtHHwXUCKrQMxYXBZI7QTmU4C4lqOv2X3oxQUpzkkUWF4IzGC2AXG1ZrR4DpgAQlKgFWoJrYlt5jvAMtAsqbwgrdpqn589HNtnXfBDZeW8oaCkz+IHQ0TNLS5ufV+N13ym+vS+rxXodSegzHAay4CVSHOk6icdfPh6bF1a5q805uyD4KxkeIuCUCP040doiebmfUddubGANXqUgAekESnSUGkCWQ5WKUksXnyMLxqcX1hx3obFOEbSQ0CKpJ9OcqwyStYCXJJQIVrhPTyU8tvrB/E1Pe5psK+hqTPZ9ucT1rnastrFTXxZt3FhceY4gbroRk0MRCuFCRWnSn77wiN16IstlO06WNR+97iHuds1/Gac49hzE6BpXXJm1Y+aOH9E4NLC7CGEcoAhgRILdhoygathCnX5PCy/f7I2xPr6PP4yvDaFWsb5pY5SjVBr9HDZoo2NaKGB7KRXYXxukZJ3+rKNWAkkc1/18JkrUNG7NvZsy4i55KZ7+k+ccxjqjlWhreoiljFZgKmUvOuLHhy7Alrj5TMbOKdDyclYeaBT7eG05W4vEMlwalimSAbp1SJEzcOZXOwybgDTYOdDnMRy8rWCtkdh70OB0VxFq9k+3splJ8bz6UwFWBFSW4f9jUjpnQlxIJ9/n8mlYYw4jim+HfFsXZhyCHKciCKPJHZK3uNEGwq0gxHqzNUnvJ9Npa2hNUBrPclVkBSYwdKsP1LYGPVR5xT+trNPCynyAsoxQ4b7Og6lGYfKKDFhZx4/DT36QV8Yi2R79qZkTkDJbEBreBX8oitHnAdmZSZYfwdr/adoDdp0g16Vcg9hkTgbzRn8R0l0gK17p3BTA6N8ppH6ZuAtodVawrXeQ5rY3l5gKqgB6/0DtJbxjV9GV5epzEJkyXuiZ3l0DA+W7uCI6uHNJHDYzLZjKzZZxjONYS2g2wTaNr67vYrr9OiprhZZQVYmcGK0j+LXyl28JP7FCcpYYGYLRRSlrRJ01gEVot4WwShVezZu/H4eX0k7tW5owOTzCvCsLlOVEz/g4+rf+LRUxkppkfIUpWPubk+IabNCgvmdNAyedF/D1T9W8aO27LkFuKjFKGUtxmwbi4d/xgelx3jPHuGoJdBID55jS7jY8Bu4tfk+bgbVsVVZixHlGqoJYFETlTVOZiNla5neHRlNVAbKd2+FXZsyGh9leG+ov5prmNmXmm1ilA/03drEfCdt9p2WAXuhjXARWLyoVv9/AQYAzRaQFve6TfoAAAAASUVORK5CYII=",
        show: function (text, isok) {
            if (!this.box) {
                this.createObj();
            }

            if (this.isRun) {
                this.list.push({ text: text, isok: isok });
                return;
            }
            this.isRun = true;

            var that = this;

            that.text.text(text);
            if (isok) {
                //                that.img.myCss({
                //                    background:"url("+that.okimg+")",
                //                    "background-size":"100% 100%"
                //                });
                that.img.get(0).style.background = "url(" + that.okimg + ") no-repeat";
                that.img.get(0).style[device.background_size] = "22px 22px";
            } else {
                //                that.img.myCss({
                //                    background:"url("+that.errimg+")",
                //                    "background-size":"100% 100%"
                //                });
                that.img.get(0).style.background = "url(" + that.errimg + ") no-repeat";
                that.img.get(0).style[device.background_size] = "22px 22px";
            }

            var temp_height = parseInt(that.box.height());
            that.box.myCss({ display: "box", "margin-top": -temp_height / 2 + "px" });


            //            var cssobj = {opacity:0.9};
            //            cssobj[device.transform] = device.css_s+"0,-60pt"+device.css_e;
            cssobj = {
                opacity: 1
            };



            that.box.cssAnimate(cssobj, 300, function () {
                that.fn = setTimeout(function () {
                    that.hide();
                    if (that.list.length != 0) {
                        setTimeout(function () {
                            that.isRun = false;
                            var data = that.list.shift();
                            that.show(data.text, data.isok);
                        }, 0);
                    } else {
                        that.isRun = false;
                    }
                }, 2000)
            })

        },
        createObj: function () {
            var box = document.createElement("div"),
                info = document.createElement("div"),
                img = document.createElement("div"),
                text = document.createElement("div"),
                $box = $(box),
                $info = $(info),
                $img = $(img),
                $text = $(text);

            $box.myCss({
                //                height:"30pt",
                width: "100%",
                "z-index": "99999",
                "position": "fixed",
                left: "0",
                top: "50%",
                "margin-top": "-15pt",
                display: "none",
                opacity: "0",
                "box-align": "center",
                "box-pack": "center"
            });

            $info.myCss({
                //                height:"30pt",
                "border-radius": "5pt",
                background: "#333",
                color: "#eee",
                "padding": "0 7pt",
                "max-width": "320px",
                "box-sizing": "border-box",
                "box-align": "center",
                display: "box",
                "box-orient": "horizontal",
                "box-shadow": "0 0 2pt 2pt #aaa"
            });
            if ($.device.isWindows) {
                $info.css({ width: "80%" });
            }

            img.style.cssText += "width:16pt;height:16pt;padding:0 7px;";
            $text.myCss({
                "padding": "10px 7px 10px 0",
                //                height:"30pt",
                "box-flex": "1",
                "line-height": "20pt"
                //                "text-overflow":"ellipsis",
                //                "white-space":"nowrap",
                //                overflow:"hidden"
            });

            $info.append($img);
            $info.append($text);
            $box.append($info);
            $("html").append($box);

            this.box = $box;
            this.text = $text;
            this.img = $img;
        },
        hide: function () {
            if (this.box) {
                var cssobj = {
                    display: "none",
                    opacity: 0
                };
                cssobj[device.transform] = "";
                this.box.css(cssobj);
            }
        },
        list: []
    };

    $.info = info;
})();

//弹出剧中层
//$.showCenterDiv(html)
//$.hideCenterDiv();
(function () {
    var zz_obj = null,
        dom = null,
        obj = null,
        fn = null,
        fn1 = null,
        fn2 = null,
        callbackFn = null;

    $.showCenterDiv = function (html,callback) {
        callbackFn = $.getFunction(callback);
        var zz = $("<div></div>");
        zz.myCss({
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0)",
            display: "box",
            "box-align": "center",
            "box-pack": "center",
            "z-index": "100"
        });


        if ($.isString(html)) {
            html = $(html);
        } else {
            html = $.getDom(html);
            html = $(html);
            dom = html;

        }
        html = html.myCss({ display: "box" });
        obj = html;

        zz.append(html);
        $("body").append(zz);
        zz.cssAnimate({
            background: "rgba(0,0,0,0.5)"
        });

        zz_obj = zz;



        zz_obj.get(0).addEventListener($.device.MOVE_EV, fn = function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        zz_obj.click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $.hideCenterDiv();
        });


        $$(obj).myclickok(function () { });


    };
    $.hideCenterDiv = function () {
        zz_obj.get(0).removeEventListener($.device.MOVE_EV, fn, false);
        zz_obj.unbind("click");



        $$(obj).unbind(true);
        $$(zz_obj).unbind(true);

        callbackFn();

        if (dom) {
            dom.remove();
        }

        dom = null;
        zz_obj.remove();
        zz_obj = null;
        obj = null;
    };
})();




//div内图片自动大小
$.fn.auto_resize_image = function () {
    var obj = $(this),
        imgs = obj.find("img");

    imgs.each(function () {
        var img = $(this),
            src = img.attr("src"),
            new_img = new Image();

        img.attr({ src: "" });

        new_img.onload = function () {
            var main_width = parseInt(obj.width());
            var width = new_img.width,
                height = new_img.height,
                new_size = main_width * height / width;

            if (width > main_width) {
                img.css({
                    width: main_width + "px",
                    height: new_size + "px"
                })
            } else {
                img.css({
                    width: width + "px",
                    height: height + "px"
                })
            }
            img.attr({
                src: src,
                my_width: width,
                my_height: height
            });


        };
        new_img.src = src;
    });

    $(window).resize(function () {
        imgs.each(function () {
            var this_img = $(this);
            if (this_img.attr("my_width")) {
                var old_width = this_img.attr("my_width"),
                    old_height = this_img.attr("my_height"),
                    main_width = parseInt(obj.width()),
                    new_height = main_width * old_height / old_width;

                if (old_width > main_width) {
                    this_img.css({
                        width: main_width + "px",
                        height: new_height + "px"
                    })
                } else {
                    this_img.css({
                        width: old_width + "px",
                        height: old_height + "px"
                    })
                }
            }
        });
    });
};


$.showPicture = function (src) {
    var close_img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAAAlgAAAJYAJvGvrMAAAGOSURBVDjLhZRLL0NREMd/9Whq50PYSjyKaNDK7crGd2DRxqKNjQ0rK4kVYUlESNj5ClZESUgXXn0oTRCtRNoSLT0WvT3mtKpzNmcyv7l35n9nrgNpTtxM4qOLTuCNOIccEOGTP8xBD5s8U0aJU+aFbdw4avF2pkgZqDxpgjhNfI58Q1yhKLAgU6bJ/YsrFO/MVPFe7kSgZGAl0VOawUo5GwK4IMSN9pKEiYjoLi7w8CTwIcAijkKRYgLo41THM4zDkna/CdtFWiR4YML2AqLMVTgWr4zhtyEvln0b48oomYzRZFynVPFrI56Drxr5kng1PiwEsE9L3Yi00abvreKuLWs8IaVbrbYfN+J5OBHuncY9jOqUmCCisCxkndUa3ZLU7UtZ12GEZ+2e0S+USeAHujnS8Sx+cLIlXnlGgEvxXQICV+zRAdDPvViYotFkUQzfIx50lYWm4/1B+HfvnMw3SflgEZe5/kHSDfFHQiZe+QkMsFMzWQrFK/sMUz8RALjwscK5vbB5oqxhVZSp2g819GPsdjchhgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNC0yNlQxMzo1ODoyNCswODowMHmGUoEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDQtMjZUMTM6NTg6MjQrMDg6MDAI2+o9AAAATXRFWHRzb2Z0d2FyZQBJbWFnZU1hZ2ljayA2LjguOC03IFExNiB4ODZfNjQgMjAxNC0wMi0yOCBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ1mkX38AAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIA5Jg+MAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADgzM8JkksYAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAODMzUZXCmwAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxMzk4NDkxOTA0QrnX9AAAABN0RVh0VGh1bWI6OlNpemUAMTcuOUtCQvJgtYsAAABidEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL2Z0cC8xNTIwL2Vhc3lpY29uLmNuL2Vhc3lpY29uLmNuL2Nkbi1pbWcuZWFzeWljb24uY24vcG5nLzExNTQ0LzExNTQ0MjAucG5nmJ8K+AAAAABJRU5ErkJggg==";

    var show = {
        div: null,
        zz: null,
        close: null,


        init: function (src) {
            this.srcs = src;

            this.createZZ();
            this.createDiv();
            this.eventBind();
            var size = this.showDiv();
            this.loadImg(size);
        },
        createZZ: function () {
            var div = $("<div></div>");
            div.css({
                position: "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "#000",
                opacity: "0.5"
            });
            this.zz = div;
        },
        createDiv: function () {
            var div = $("<div>loading...</div>");
            div.css({
                position: "fixed",
                width: "80%",
                height: "80%",
                left: "9%",
                top: "9%",
                border: "10px solid #fff",
                background: "#ccc",
                "text-align": "center",
                "border-radius": "10px"
            });

            var close = $("<img src='" + close_img + "'/>");
            close.css({
                position: "absolute",
                right: "-14px",
                top: "-14px",
                width: "24px",
                height: "24px",
                cursor: "pointer",
                "z-index": "10"
            });

            div.append(close);
            this.div = div;
            this.close = close;
            $("body").append(div)

        },
        eventBind: function () {
            var _this = this;
            $$(this.close).myclickok(function () {
                _this.destroy();
            });

            $$(this.zz).myclickok(function () {
                _this.destroy();
            })

            $$(this.div).myclickok(function () {

            })

        },
        showDiv: function () {
            var body = $("body");
            body.append(this.zz);
            body.append(this.div);

            var width = parseInt(this.div.width()),
                height = parseInt(this.div.height());

            this.div.css({
                "line-height": height + "px"
            });

            return {
                width: width,
                height: height
            }

        },
        loadImg: function (body_size) {
            var img = new Image(),
                _this = this;

            img.onload = function () {
                _this.getImgSize(this, body_size);
            };

            img.src = src;

        },
        getImgSize: function (img, body_size) {
            var objwidth = body_size.width,
                objheight = body_size.height,
                imgwidth = img.width,
                imgheight = img.height;

            if (imgwidth > 0 && imgheight > 0) {
                if (imgwidth / imgheight >= objwidth / objheight) {
                    if (imgwidth > objwidth) {
                        newimgwidth = objwidth;
                        newimgheight = imgheight * objwidth / imgwidth;
                    } else {
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                } else {
                    if (imgheight > objheight) {
                        newimgheight = objheight;
                        newimgwidth = imgwidth * objheight / imgheight;
                    } else {
                        newimgwidth = imgwidth;
                        newimgheight = imgheight;
                    }
                }
            }

            this.div.css({
                width: newimgwidth + "px",
                height: newimgheight + "px",
                "line-height": newimgheight + "px",
                left: "50%",
                top: "50%",
                "margin-top": -newimgheight / 2 - 10 + "px",
                "margin-left": -newimgwidth / 2 - 10 + "px"
            });

            $(img).css({
                position: "absolute",
                left: 0,
                top: 0,
                width: newimgwidth + "px",
                height: newimgheight + "px"
            });

            this.div.append(img);

        },
        destroy: function () {
            $$(this.zz).unbind(true);
            $$(this.close).unbind(true);
            $$(this.div).unbind(true);

            this.zz.remove();
            this.div.remove();

            this.zz = null;
            this.div = null;
            this.close = null;
        }

    };

    show.init(src);


};



//弹出底部层
//$.showButtonDiv(obj);    @param obj : html,obj,jqobj
//$.hideButtonDiv();
(function () {
    var zz_obj = null,
        dom = null,
        obj = null,
        fn = null,
        destory = null;

    $.showButtonDiv = function (html,startFn,destoryFn) {
        destory = $.getFunction(destoryFn);
        var zz = $("<div></div>");
        zz.myCss({
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0)",
            display: "box",
            "box-align": "end",
            "box-pack": "center",
            "z-index": "100"
        });


        if ($.isString(html)) {
            html = $(html);
        } else {
            html = $.getDom(html);
            html = $(html);
            dom = html;

        }
        html = html.css({ display: "block" });
        obj = html;

        zz.append(html);
        $("body").append(zz);

        var height = parseInt(html.height());
        html.myCss({"transform":"translate(0,"+height+"px)"});


        zz.cssAnimate({
            "background-color": "rgba(0,0,0,0.5)"
        },500,function(){
            html.cssAnimate({
                transform:"translate(0,0)"
            },500,function(){
                startFn();
            })
        });

        zz_obj = zz;

        $$(zz_obj).myclickok(function () {
            $.hideButtonDiv();
        });

        zz_obj.get(0).addEventListener($.device.MOVE_EV, fn = function (e) {
            e.preventDefault();
        }, false);
        $$(obj).myclickok(function () { });

    };
    $.hideButtonDiv = function () {
        zz_obj.get(0).removeEventListener($.device.MOVE_EV, fn, false);
        $$(obj).unbind(true);
        $$(zz_obj).unbind(true);
        destory();

        if (dom) {
            dom.remove();
        }

        dom = null;
        zz_obj.remove();
        zz_obj = null;
        obj = null;
    };
})();



