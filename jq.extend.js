//获取因css而动画中当前的css   type为类型 如：top,left等
$.fn.androidGetStyle=function(type){
	var obj=$(this).get(0);
	var thisStyle=document.defaultView.getComputedStyle(obj,null);
	return thisStyle.getPropertyValue(type);	
};


////获取元素的宽度
//$.fn.width=function(){
//	var w=$(this).androidGetStyle("width");
//	if(!parseInt(w) || w.indexOf("%")>-1){
//		var temp_a=$(this).clone();
//		temp_a.css({display:"block",visibility:"hidden"}).insertAfter(this);
//		w=temp_a.androidGetStyle("width");
//		temp_a.remove();
//	}
//	return w;
//};
////获取元素的高度
//$.fn.height=function(){
//	var h=$(this).androidGetStyle("height");
//	if(!parseInt(h) || h.indexOf("%")>-1){
//		var temp_a=$(this).clone();
//		temp_a.css({display:"block",visibility:"hidden"}).insertAfter(this);
//		h=temp_a.androidGetStyle("height");
//		temp_a.remove();
//	}
//	return h;
//};


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
/*
$.isObject = function(str){
    if(str === null || typeof str === 'undefined')
    {
        return false;
    }
    return typeof str === 'object';
};
*/
//判断是否是数组   jqmobi有
/*
$.isArray = function (arr){
    return arr.constructor === Array;
};
*/
//判断是函数    jqmobi有
/*
$.isFunction = function(fn){
    return typeof fn === 'function'
};
*/
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







//css动画
$.fn.cssAnimate=(function(){

    var dummyStyle = document.createElement("div").style,
        vendor = (function () {
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
        prefixStyle = function(style){
            if ( !vendor ) return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        },
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),
        cssanimagefn = {},
        counter = (function(){
            var a = 0;
            return function(){
                a += 1;
                return a;
            }
        })(),
        clearfn = function(obj,keyname){
            obj.removeEventListener(TRNEND_EV,cssanimagefn[keyname],false);
            delete cssanimagefn[keyname];
            delete obj.__bens_cssfn_id__;
        };

    return function(data,time,callback){
        var _this=$(this),
            _that = _this.get(0),
            _thatstyle = _that.style;

        time = time || 1000;
        callback = bens.getFunction(callback);

        if(_that.__bens_cssfn_id__){
            var temp_key = _that.__bens_cssfn_id__;
            clearfn(_that,temp_key);
        }

        var thiskey = counter();
        _that.__bens_cssfn_id__ = thiskey;


        cssanimagefn[thiskey]=function(e){
            var p_name = e.propertyName;
            if(e.target == _that && data[p_name]){

                //_this.get(0).style["webkitTransition"]="all 0 ease";
                _thatstyle[transitionProperty] = "";
                _thatstyle[transitionDuration] = "";
                _thatstyle[transitionTimingFunction] = "";

                callback();
                clearfn(_that,thiskey);
            }
        };

        _thatstyle[transitionProperty] = "all";
        _thatstyle[transitionDuration] = time+"ms";
        _thatstyle[transitionTimingFunction] = "ease";

        _thatstyle["webkitTransformStyle"]="preserve-3d";   //webkit私有
        _thatstyle["webkitBackfaceVisibility"]="hidden";    //webkit私有

        setTimeout(function(){
            _that.addEventListener(TRNEND_EV,cssanimagefn[thiskey],false);
            _this.css(data);
        },0);

    }
})();
