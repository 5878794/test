/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-3-29
 * Time: 下午4:53
 *
 *=====================================================================
 * 加载图片src，带loading，带缩放
 *=====================================================================
 * 需要 jq.mobi jq.extend bens device __loading_canvas
 *
 * require("loading_img").load({
 *     obj:document.getElementById("a"),        //要放入图片的容器（可以是jq对象）
 *     src：str                                  //图片的地址
 *     scale：boolean                            //是否缩放
 *     animate：boolean                          //是否显示loading动画
 *     success：fn                               //返回载入的图片对象  js obj
 * })

 */




(function(){
    var device = bens.require("device"),
        canvas = bens.require("__loading_canvas");

    var imgload = function(datas){
        this.obj = datas.obj;           //容器
        this.src = datas.src;           //img src
        this.scale = datas.scale;       //是否缩放
        this.showanimate = datas.animate;
        this.callback = datas.success;

        if(!this.obj || !this.src ){console.log("param error");return;}
        this.scale = ($.isBoolean(this.scale))? this.scale : false;
        this.showanimate = ($.isBoolean(this.showanimate))? this.showanimate : false;
        this.callback = $.isFunction(this.callback)? this.callback : function(){};

        this.obj = ($.is$(this.obj))? this.obj.get(0) : this.obj;
        this.obj.style.cssText += "display:"+device.box+"; "+device.box_align+":center; "+device.box_pack+":center;";

        this.canvas = null;

        this.init();

    };
    imgload.prototype = {
        init:function(){
            if(this.showanimate){
                this.canvas = new canvas({
                    obj:this.obj
                });
                this.canvas.run();
            }

            this.startLoadImg();
        },
        //开始载入图片
        startLoadImg:function(){
            var _this = this,
                img;

            img = document.createElement("img");

            var loadendfn = function(){
                if(_this.scale){
                    img = _this.getNewImgSize(img);
                }
                _this.removeLoading();
                _this.callback(img);

                img = null;
            };

            img.onload = function(){
                loadendfn();
            };

            img.src = _this.src;
        },
        //停止绘画 并移除画板
        removeLoading:function(){
            if(this.canvas){
                this.canvas.destroy();
                this.canvas = null;
            }
        },
        //获取img的寬高  不超出容器
        getNewImgSize:function(img){
            var _this = this,
                imgwidth = img.width,
                imgheight = img.height,
                objwidth = parseInt($(_this.obj).width()),
                objheight = parseInt($(_this.obj).height()),
                newimgwidth,newimgheight;

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

            img.width = newimgwidth;
            img.height = newimgheight;

            return img;

        }
    };

    return {
        load:function(data){
            new imgload(data);
        }
    };

})();



