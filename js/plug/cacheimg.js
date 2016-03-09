/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-4-11
 * Time: 下午3:43
 * ==================================================
 * 缓存图片
 * ==================================================
 *
 * bens.require(data,callback);
 * @data:[]              //数组中全字符串  ["","",""]
 *                       //数组中对象      [{id:obj,src:src},{},...]
 *                                      @id:随意              key写死
 *                                      @src：图片地址          key写死
 *
 * 可选：
 * @callback(src,obj)    //返回函数,传的是只有地址就只返回src
 *                       返回 src 和 obj
 *
 */
(function(){
    return {
        data:null,
        callback:null,
        files:function(data,callback){
            if(!$.isArray(data)){return;}
            this.data = data;
            this.callback = callback;
            this.go();
        },
        go:function(){
            if(this.data.length == 0){
                this.data = null;
                this.callback = null;
                return;
            }

            var thisimg = this.data.shift(),
                src,obj;

            if($.isObject(thisimg)){
                obj = thisimg.id;
                src = thisimg.src;
            }else{
                src = thisimg;
            }


            this.loadImg(src,obj);
        },
        loadImg:function(src,obj){
            var img = document.createElement("img"),
                _this = this;

            img.onload = function(){
                img = null;
                if($.isFunction(_this.callback)){
                    _this.callback(src,obj);
                }
                _this.go();
            };
            img.onreadystatechange = function(){
                img = null;
                if($.isFunction(_this.callback)){
                    _this.callback(src,obj);
                }
                _this.go();
            };
            img.onerror = function(){
                img = null;
                _this.go();
            };
            img.src = src;
        }
    }


})();