/*
 * Filename : loadcss.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-8-12
 * Time: 下午2:25
 * Email:5878794@qq.com
 * =====================================
 * Desc:  加载css文件到页面，自动补前缀和自动替换页面中url里的地址为绝对地址
 *
 *  bens.require("loadcss").load({
 *      src:str,                    //需要载入的css文件地址
 *      useCache:bool,              //是否加载参数
 *      success:fn                  //加载完成执行
 *  })
 *
 *
 *
 */


(function(){
    return {
        load:function(datas){
            var src = datas.src,
                useCache = $.isBoolean(datas.useCache)? datas.useCache : true,
                success = bens.getFunction(datas.success);


            if(!useCache){
                src = src+"?id"+new Date().getTime();
            }

            this.readCssFile(src,success);
        },
        readCssFile:function(src,success){
            var _this = this;
            $.ajax({
                type:"get",
                contentType:'application/html;charset="UTF-8"',
                async:false,
                cache:false,
                url:src,
                dataType:"text",
                success:function(data){
                    var new_css = _this.prefixCssFn(data);
                    new_css = _this.fixCssUrl(src,new_css);
                    _this.addCss(new_css);

                    success();
                },
                error:function(){
                    alert("css文件加载失败！");
                }
            });
        },
        //自动补前缀
        prefixCssFn:function(text){
            var device = bens.require("device");

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
        fixCssUrl:function(src,text){
            var parent_url = src.substr(0,src.lastIndexOf("\/")+1);
            return  text.replace(/url\([\s\S]*?\)/ig,function(a){
                a = a.replace(/\s/g,"");
                return a.substr(0,5)+parent_url+a.substr(5);
            });
        },
        addCss:function(text){
            var style = document.createElement('style');
            style.type = "text/css";
            style.charset = "utf-8";
            style.textContent = text;
            document.getElementsByTagName('HEAD').item(0).appendChild(style);
        }


    };
})();
