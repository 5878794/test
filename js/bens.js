var bens = {
    isDevelopment:true,
    log:function(a){
        if(this.isDevelopment){
            console.log(a);
        }
    },
    //动态加载插件  //需要 jq.mobi
    require:(function(){
        var save={};
        return function (filename){
            if(!save[filename]){
                var timestamp = new Date().getTime(),
                    src;
                if(bens.isDevelopment){
                    src = "js/plug/"+filename+".js?id="+timestamp;
                }else{
                    src = "js/plug/"+filename+".js";
                }

                $.ajax({
                    type:"get",
                    contentType:'application/json;charset="UTF-8"',
                    async:false,
                    cache:false,
                    url:src,   //文件地址
                    dataType:"script",
                    success:function(data){
                        save[filename] = eval(data);      //插件需要自执行函数并返回对象
                    },
                    error:function(){
                        console.log(filename+"：加载失败！");
                    }
                });
            }
            return save[filename];
        };
    })(),
    //删除左右两端的空格
    trim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    //删除左边的空格
    ltrim:function(str){
        return str.replace(/(^\s*)/g,"");
    },
    //删除右边的空格
    rtrim:function(str){
        return str.replace(/(\s*$)/g,"");
    },
    //时间戳转时间
    stamp2time:function(b){             //stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
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
    },
    time2stamp:function(a){    //a :   2012-12-13   2012-12-12 12:12:33  自动补位
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
    },
    //获取原生dom   obj=id、jq对象、dom对象会成功 ， 其它失败
    getDom:function(obj){
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
    },
    //检查是否是数组 返回
    getArray:function(str){
        return ($.isArray(str))? str : [];
    },
    //检查fn，是返回fn 否返回空函数
    getFunction:function(fn){
        return ($.isFunction(fn))? fn : function(){};
    },
    //检查并返回对象
    getObj:function(obj){
        return ($.isObject(obj))? obj : {};
    },
    //克隆json或数组(只能是纯数据)
    cloneData:function(obj){
        return JSON.parse(JSON.stringify(obj));
    },
    //图片在容器中的大小计算
    getNewImageSize:function(imgwidth,imgheight,objwidth,objheight){
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
    },
    //给某个input触发出软件盘（前提必须在click事件内触发该函数）
    //obj:   id,jqobj,obj
    showSysSoftKeyBoardForInput:function(obj){
        var event = document.createEvent("Event"),
            this_obj = this.getDom(obj),
            set_fn = bens.require("inputcursor"),
            length = $(this_obj).val().length;

        event.initEvent("click",true,true, null, null, null, null, null, null, null, null, null, null, null, null);
        set_fn.setPosition({
            obj:this_obj,
            start:length,
            end:length
        });
        this_obj.dispatchEvent(event);
    },
    alert:function(message){
        if(this.isDevelopment){
            alert(message);
        }else{
            navigator.notification.alert(message, function(){}, "系统信息", "确 定");
        }
    },
    confirm:function(message,success){
        if(this.isDevelopment){
            if(confirm(message)){
                success();
            }
        }else{
            navigator.notification.confirm(
                message,
                function(n){
                    if(n==1){
                        success();
                    }
                },
                "系统信息",
                "确 定,取 消"
            );
        }
    },
    offsetPage:{
        top:function(el){
            var _top = el.offsetTop;
            while(el.offsetParent != null){
                el = el.offsetParent;
                _top += el.offsetTop;
            }
            return _top;
        },
        left:function(el){
            var _left = el.offsetLeft;
            while(el.offsetParent != null){
                el = el.offsetParent;
                _left += el.offsetLeft;
            }
            return _left;
        }
    }
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
    bens.htmlEncode = function(text){
        return text.replace(reg,function(t){
            return a[t];
        })
    };
    //还原
    bens.htmlDecode = function(text){
        return text.replace(reg1,function(t){
            return b[t];
        })
    }


})();




//加载文件到页面(有特有属性  add_type=“ajax”)
bens.loadFile = (function(){
    var jsFile = function(file,callback){
            var head = document.getElementsByTagName('HEAD').item(0);
            var script = document.createElement('SCRIPT');
            var src;

            if(bens.isDevelopment){
                src = file+"?s="+new Date().getTime();
            }else{
                src = file;
            }

            script.src = src;
            script.charset = "utf-8";
            script.type = "text/javascript";
            script.add_type = "ajax";
            head.appendChild(script);

            script.onload = script.onreadystatechange = function(){
                if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete'){
                    if(typeof(callback)=="function"){
                        callback();
                    }
                }
                script.onload=script.onreadystatechange=null;
            }
        },
        jsText = function(text,callback){
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
        cssFile = function(file,callback){
            var head = document.getElementsByTagName('HEAD').item(0);
            var css = document.createElement('link');
            var src;

            if(bens.isDevelopment){
                src = file+"?s="+new Date().getTime();
            }else{
                src = file;
            }

            css.rel = "stylesheet";
            css.type = "text/css";
            css.href = src;
            css.add_type = "ajax";
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
            };

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
            };

            styleOnload(css,function(){
                if(typeof(callback)=="function"){
                    callback();
                }
            });
        },
        htmlFile = function(id,file,callback){
            var src;
            if(bens.isDevelopment){
                src = file+"?s="+new Date().getTime();
            }else{
                src = file;
            }

            $.get(src,function(data){
                if(typeof(callback)=="function"){
                    $("#"+id).html(data);
                    callback();
                }
            })
        };

    return function(datas){
        var jsfile = datas.js || [],
            cssfile = datas.css || [],
            htmlfile = datas.html || [],
            htmlid = datas.htmlId || [],
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
        if(filse == 0){return;}

        for (var i= 0,l=jsfile.length;i<l;i++){
            jsFile(jsfile[i],loadsuccess);
        }
        for (var i= 0,l=cssfile.length;i<l;i++){
            cssFile(cssfile[i],loadsuccess);
        }
        for (var i= 0,l=htmlfile.length;i<l;i++){
            htmlFile(htmlid[i],htmlfile[i],loadsuccess);
        }
    };
})();



//数组扩展======================================================================================================

//将一个数组添加到另一个数组末尾  会改变原数组
Array.prototype.pushArray = function(b){
    this.push.apply(this,b);
    return this;
};
//获取数组中的最大值  数组中不能有字母或对象   null,false转换为1  true转换为2   可以filter（function）后在求值
Array.prototype.findMax= function(){
    return Math.max.apply(null,this);
};
//获取数组中的最小值 数组中不能有字母
Array.prototype.findMin= function(){
    return Math.min.apply(null,this);
};
//数组排序  按数字大小   默认是按字符排序
Array.prototype.sortByNumber= function(type){
    if(type == "desc"){
        this.sort(function(a,b){ return (a>b)? -1 : 1; });
    }else{
        this.sort(function(a,b){ return (a>b)? 1 : -1; });
    }
    return this;
};
//数组排序  中文    数组中如果是对象使用key,否则传空   type默认从小到大，desc反序
Array.prototype.sortByChine= function(key,type){
    this.sort(function(a,b){
        if(key){
            a = a[key];
            b = b[key];
        }
        a = a.toString();
        b = b.toString();

        if(type == "desc"){
            return b.localeCompare(a);
        }else{
            return a.localeCompare(b);
        }
    });

    return this;
};
//删除数组中的重复值  只会返回字符和数字的不重复数组
//注意：不会改变原数组 并返回的数组中全是字符串
Array.prototype.delReplace = function(){
    var array = this,
        t_json = {},
        n_array = [];

    for(var i= 0,l=array.length;i<l;i++){
        var thisdata = array[i];
        if(typeof(thisdata) === "object"){

        }else{
            t_json[thisdata] = thisdata;
        }
    }

    for(var key in t_json){
        n_array.push(key);
    }

    return n_array;
};


//删除数组中的一个值 用原生的filter方法返回新数组  不写了
//  array.filter(function(a,index){if(a!=3){return a;}})





if(bens.isDevelopment){
    window.onerror = function(){
        console.log("js error:"+"   "+arguments[1]+" "+arguments[2]+"行 "+arguments[0])
    }
}

if (!window.JSON) { window.JSON = {};}
(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                this.getUTCFullYear()   + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
                Boolean.prototype.toJSON = function (key) {
                    return this.valueOf();
                };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                            mind + ']' :
                            '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());



//test===========================================================
//
//$.fn.bensAnimate = function(css,time){
//    var _this = $(this),
//        nextFrame = (function() {
//            return window.requestAnimationFrame ||
//                window.webkitRequestAnimationFrame ||
//                window.mozRequestAnimationFrame ||
//                window.oRequestAnimationFrame ||
//                window.msRequestAnimationFrame ||
//                function(callback) { return setTimeout(callback, 1); };
//        })(),
//        cancelFrame = (function () {
//            return window.cancelRequestAnimationFrame ||
//                window.webkitCancelAnimationFrame ||
//                window.webkitCancelRequestAnimationFrame ||
//                window.mozCancelRequestAnimationFrame ||
//                window.oCancelRequestAnimationFrame ||
//                window.msCancelRequestAnimationFrame ||
//                clearTimeout;
//        })(),
//        start_css = (function(){
//            var new_data = {};
//            for(var key in css){
//                var temp_val = _this.androidGetStyle(key);
//                temp_val = (temp_val.search(/\d/)>-1)? temp_val : 0+"px";
//                new_data[key] = temp_val;
//
//
//
//            }
//            return new_data;
//        })(),
//        get_new_value = function(start_value,pre,end_value){
//            end_value = end_value.match(/\-?\d+\.?\d*/ig)[0];
//            return start_value.replace(/\-?\d+\.?\d*/ig,function(b){
//                b = b*1;
////                console.log((end_value - b)*pre+b)
//                return (end_value - b)*pre+b;
//            })
//        },
//        start_time,
//        end_time,
//        go = function(){
//            var now_time = new Date().getTime();
//            if(now_time >= end_time){
//
//                return;
//            }
//
//            var pre = (now_time - start_time)/time,
//                now_css = {};
//
//            for(var key in start_css){
//                var thisval = start_css[key];
//                now_css[key] = get_new_value(thisval,pre,css[key]);
//            }
//            console.log(JSON.stringify(now_css))
//            _this.css(now_css);
//            nextFrame(go);
//        };
//
//    console.log(JSON.stringify(start_css));
//    console.log(JSON.stringify(css));
//    start_time = new Date().getTime();
//    end_time = start_time + time;
//
//    nextFrame(go);
//
//
//};
