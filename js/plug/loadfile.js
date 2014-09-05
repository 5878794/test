/*
 * Filename : loadfile.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-6-13
 * Time: 下午1:19
 * Email:5878794@qq.com
 * =====================================
 * Desc:  加载一个html到指定的id，并同时加载这个html中的js和css。
 *       注意：js和css是乱序加载，注意其中最好不要有需要依赖的自执行函数。
 *            如果加载js和css文件找不到（404等）不会触发回调函数
 *            html代码必须放在 body标签中（加载到指定的id）
 *
 *
 * 需要： jq.mobi、jq.extend、bens
 *======================================
 * var temp_fn = bens.require("loadfile");
 *
 * var loadfile = new temp_fn({
 *     src:string           //载入的html地址
 *     toId:string          //加载到的id
 *     callback:fn          //加载完成回调
 *     useCache:bool        //是否使用缓存  （调试用，正式发布删除此参数，某些手机不支持加载文件带参数）
 *     prefixCss:bool       //是否自动给css加前缀 (同时替换css内  url的地址为绝对地址)
 * })
 *
 *
 * loadfile.destroy();      //卸载加载的html  （js中生成的对象需要手动清除）
 *
 *
 */




(function(){
    var device = bens.require("device");
    var load = function(datas){
        this.src = datas.src;           //载入的地址
        this.id = datas.toId;           //html载入到哪个id内同时加载的标签会带  add_type = id
        this.callback = bens.getFunction(datas.callback); //加载完成回调
        this.prefixCss = $.isBoolean(datas.prefixCss)? datas.prefixCss : false;     //自动给css加前缀
        if(!this.src || !this.id){
            alert("文件加载失败！缺少参数。");
            return ;
        }


        this.useCache = ($.isBoolean(datas.useCache))? datas.useCache : false; //是否使用地址带时间戳方式


        this.jsFile = [];               //js文件列表
        this.js = [];                   //js代码
        this.cssFile = [];              //css文件列表
        this.css = [];                  //css代码
        this.body = null;               //body中的html  ？？是否包含js和css

        this.hasLoadJsFile = [];        //已加载的js文件
        this.hasLoadCssFile = [];       //已加载的css文件

        this.allFileLength = 0;         //要加载的资源数
        this.hasLoadedFileLength = 0;     //已加载的资源数

        this.parent_url = this.src.substr(0,this.src.lastIndexOf("\/")+1);   //当前路径
        this.head = document.getElementsByTagName('HEAD').item(0);
        this.dom_a = document.createElement("a");


        this.readFile();
    };


    load.prototype = {
        //获取带时间戳的地址
        getNewUrl:function(src){
            var param = "";
            if(!this.useCache){
                param = "?id"+new Date().getTime();
            }

            return src + param;
        },
        //读取文件
        readFile:function(){
            var _this = this,
                src = this.src,
                url = this.getNewUrl(src);

            $.ajax({
                type:"get",
                contentType:'application/html;charset="UTF-8"',
                async:false,
                cache:false,
                url:url,
                dataType:"text",
                success:function(data){
                    //去注释
                    var reg=/\<\!\-\-[\s\S]*?\-\-\>/g,
                        html = data.replace(reg,"");
                    _this.getScriptFiles(html);


                },
                error:function(){
                    alert("文件加载失败！");
                }
            });
        },
        //获取文件中的js、css、html
        getScriptFiles:function(html){
            var _this = this;
            _this.getScript(html);
            _this.getLink(html);
            _this.getStyle(html);
            _this.getBody(html);

            _this.getLoadedFile();
            _this.loadScript();
        },
        //获取其中的js
        getScript:function(html){
            var regDetectJs = /<script(.|\n)*?>(.|\n|\r\n)*?<\/script>/ig,
                jsContained = html.match(regDetectJs),
                regExp_src_temp = /<script.*src\s*=\s*["'](.*?)["']>[^<>]*<\/script\s*>/gi,
                srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i,
                regGetJS = /<script(.|\n)*?>((.|\n|\r\n)*)?<\/script>/im,
                _this = this;

            if(jsContained){
                for(var z= 0,zl = jsContained.length;z<zl;z++){
                    var isfile = jsContained[z].match(regExp_src_temp);
                    if(isfile){
                        //是加载的文件
                        var src = jsContained[z].match(srcReg);
                        if(src && src[1]){
                            if($.isUrl(src[1])){
                                _this.jsFile.push(src[1]);
                            }else{
                                _this.dom_a.href = _this.parent_url + src[1];
                                _this.jsFile.push(_this.dom_a.href);
//                                _this.jsFile.push(_this.parent_url + src[1]);
                            }
                        }
                    }else{
                        //是代码
                        var jsSection = jsContained[z].match(regGetJS);
                        if(jsSection && jsSection[2]){
                            _this.js.push(jsSection[2]);
                        }
                    }
                }
            }
        },
        //获取其中的css  link=。。。
        getLink:function(html){
            var regDetectJs = /<link(.|\n)*?>/ig,
            //获取script段
                jsContained = html.match(regDetectJs),
                srcReg = /href=[\'\"]?([^\'\"]*)[\'\"]?/i,
                _this = this;

            if(jsContained){
                for(var z= 0,zl = jsContained.length;z<zl;z++){
                    var isfile = jsContained[z].match(srcReg);
                    if(isfile && isfile[1]){
                        if($.isUrl(isfile[1])){
                            _this.cssFile.push(isfile[1]);
                        }else{
                            _this.dom_a.href = _this.parent_url + isfile[1];
                            _this.cssFile.push(_this.dom_a.href);
//                            _this.cssFile.push(_this.parent_url + isfile[1]);
                        }
                    }
                }
            }
        },
        //获取style
        getStyle:function(html){
            var regDetectstyle = /<style(.|\n)*?>(.|\n|\r\n)*?<\/style>/ig,
                jsContainedsss = html.match(regDetectstyle),
                regGetJS = /<style(.|\n)*?>((.|\n|\r\n)*)?<\/style>/im,
                _this = this;

            if(jsContainedsss){
                for(var i= 0,l=jsContainedsss.length;i<l;i++){
                    var jsSection = jsContainedsss[i].match(regGetJS);
                    if(jsSection && jsSection[2]){
                        _this.css.push(jsSection[2]);
                    }
                }
            }
        },
        //获取body部分html   TODO 未去除其中的js和css
        getBody:function(html){
            var regGetbody = /<body(.|\n)*?>((.|\n|\r\n)*)?<\/body>/im,
                htmlSection = html.match(regGetbody),
                _this = this;

            if(htmlSection && htmlSection[2]){
                _this.body = bens.trim(htmlSection[2]);
            }
        },
        //获取已加载的文件
        getLoadedFile:function(){
            var script = $("script"),
                css = $("link"),
                _this = this;

            script.each(function(){
                var jssrc = this.src;
                if(jssrc){
                    jssrc = jssrc.split("?")[0];
                    _this.hasLoadJsFile.push(jssrc);
                }
            });
            css.each(function(){
                var csssrc = this.href;
                if(csssrc){
                    csssrc = csssrc.split("?")[0];
                    _this.hasLoadCssFile.push(csssrc);
                }
            });

        },


        //加载完成
        loadComplate:function(){
            this.hasLoadedFileLength++;
            if(this.hasLoadedFileLength == this.allFileLength){
                //加载完成
                this.callback();
            }
        },
        //加载脚本
        loadScript:function(){
            var jsFile_length = this.jsFile.length,
                js_length = this.js.length,
                cssFile_length = this.cssFile.length,
                css_length = this.css.length,
                thissrc = null,
                _this = this;

            this.allFileLength = jsFile_length + js_length + cssFile_length + css_length;
            if(this.allFileLength == 0){
                this.callback();
            }


            //加载html
            $("#"+this.id).html(this.body);

            for(var i=0;i<jsFile_length;i++){
                thissrc = this.jsFile[i];
                if(this.hasLoadJsFile.indexOf(thissrc)<0){
                    this.loadJsFile(thissrc,this.loadComplate);
                }else{
                    this.loadComplate();
                }
            }

            for(var j=0;j<js_length;j++){
                this.loadJsText(this.js[j],this.loadComplate);
            }

            for(var k=0;k<cssFile_length;k++){
                thissrc = this.cssFile[k];
                if(this.hasLoadCssFile.indexOf(thissrc)<0){
                    if(this.prefixCss){
                        this.getCssFile(thissrc,function(css_text){
                            css_text = _this.prefixCssFn(css_text);
                            css_text = _this.fixCssUrl(css_text);
                            _this.loadCssText(css_text,_this.loadComplate);
                        });
                    }else{
                        this.loadCssFile(thissrc,this.loadComplate);
                    }
                }else{
                    this.loadComplate()
                }
            }

            for(var l=0;l<css_length;l++){
                var css_text = this.css[l];
                if(this.prefixCss){
                    css_text = this.prefixCssFn(css_text);
                    css_text = this.fixCssUrl(css_text);
                }
                this.loadCssText(css_text,this.loadComplate);
            }

        },
        //加载js文件
        loadJsFile:function(file,callback){
            var script = document.createElement('SCRIPT'),
                _this = this;
            script.src = this.getNewUrl(file);
            script.charset = "utf-8";
            script.type = "text/javascript";
            $(script).attr({add_type:this.id});
            this.head.appendChild(script);

            script.onload = script.onreadystatechange = function(){
                if(!this.readyState || this.readyState=='loaded' || this.readyState=='complete'){
                    if(typeof(callback)=="function"){
                        callback.call(_this);
                    }
                    script.onload=script.onreadystatechange=null;
                }
            }
        },
        //加载css文件
        loadCssFile:function(file,callback){
            var css = document.createElement('link'),
                _this = this;
            css.rel = "stylesheet";
            css.type = "text/css";
            css.href = this.getNewUrl(file);
            $(css).attr({add_type:this.id});
            this.head.appendChild(css);


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
                        if(typeof(callback)=="function"){
                            callback.call(_this);
                        }
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
                    callback.call(_this);
                }
            });
        },
        //加载js text
        loadJsText:function(text,callback){
            var script = document.createElement('SCRIPT');
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.text = text;
            $(script).attr({add_type:this.id});
            this.head.appendChild(script);

            if(typeof(callback)=="function"){
                callback.call(this);
            }
        },
        //加载css  text
        loadCssText:function(text,callback){
            var style = document.createElement('style');
            style.type = "text/css";
            style.charset = "utf-8";
            style.textContent = text;
            $(style).attr({add_type:this.id});
            this.head.appendChild(style);

            if(typeof(callback)=="function"){
                callback.call(this);
            }
        },
        //读取css文件
        getCssFile:function(src,fn){
            $.ajax({
                type:"get",
                contentType:'application/html;charset="UTF-8"',
                async:false,
                cache:false,
                url:src,
                dataType:"text",
                success:function(data){
                    fn(data);
                },
                error:function(){
                    alert("文件加载失败！");
                }
            });
        },
        //自动补前缀
        prefixCssFn:function(text){
            //去css注释
            var reg=/\/\*[\s\S]*?\*\//g;
            text = text.replace(reg,"");

            //坼分
            var temp_array = text.split(/{|}/);

            //补前缀
            for(var i= 0,l=temp_array.length;i<l;i++){
                if(i%2 == 1){
                    temp_array[i] = device.cssfile_prefix(temp_array[i]);
                }
            }

            var new_text = temp_array.join("@@@@");

            //返回
            var z=0;
            return new_text.replace(/@@@@/ig,function(){
                z++;
                if(z%2 == 1){
                    return "{";
                }else{
                    return "}";
                }
            })


        },
        //自动替换css
        fixCssUrl:function(text){
            var _this = this;
            return  text.replace(/url\([\s\S]*?\)/ig,function(a){
                    a = a.replace(/\s/g,"");
                    return a.substr(0,5)+_this.parent_url+a.substr(5);
                });
        },





        //销毁
        destroy:function(){
            this.body = null;
            this.dom_a = null;

            $("script[add_type*='"+this.id+"']").remove();
            $("link[add_type*='"+this.id+"']").remove();
            $("style[add_type*='"+this.id+"']").remove();

            $("#"+this.id).html("");
        }

    };


    return load;

})();


