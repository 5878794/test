/*
 * Filename : 
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-6-5
 * Time: 下午3:11
 * Email:5878794@qq.com
 * =====================================
 * Desc:  图片切换展示  左右滑动，上滑发送到电视端  (bst项目)
 *
 * //引入
 * var a = bens.require("imagechange_bst");
 *
 * //执行
 * var b = new a({
 *     data:  array         （必须传）要显示的数据 eg:["http:123.com/a.jpg",""]
 *     showNumber: int      从第几张开始显示  默认：0
 *     win: obj/id/jqobj    （必须传）显示的容器
 *     toTvFn：fn            上滑时触发
 * })
 *
 * //卸载
 * b.destroy();
 *
 */




(function(){
    var imageChangeShow = function(data){
        this.data = data.data;                          //array
        this.showNumber = parseInt(data.showNumber) || 0;         //int
        this.win = bens.getDom(data.win);               //obj id jqobj 转成 obj
        this.toTvFn = ($.isFunction(data.toTvFn))? data.toTvFn : function(){};   //发送到电视

        if(!$.isArray(this.data)){console.log("图片地址数组错误");return;}
        if(!this.win){console.log("没有找到要显示的容器");return;}


        //==================================================
        this.winWidth = null;           //容器大小
        this.winHeight = null;

        this.showImgObj = null;         //显示的img对象
        this.createImgObj = null;       //创建的img对象

        //this.startPoint = {};           //点击开始时的点

        this.init();
    };

    imageChangeShow.prototype = {
        init:function(){
            this.getWinSize();
            this.eventBind();
            this.createImg(this.showNumber);
            this.showFirst();

        },
        //获取容器大小设置定位
        getWinSize:function(){
            this.winWidth = parseInt($(this.win).width());
            this.winHeight = parseInt($(this.win).height());
            var position = $(this.win).css("position");

            if(position == "relative" || relative == "absolute"){

            }else{
                $(this.win).css({
                    position:"relative"
                })
            }
        },
        //创建一个img
        createImg:function(n,type){
            var src = this.data[n],
                img = new Image(),
                _this = this;

            if(type){
                $(this.win).append(img);
                this.imgBeforeShowCss(img,type);
            }else{
                $(this.win).prepend(img);
                this.imgBeforeShowCss(img);
            }


            this.createImgObj = img;

            img.onload = function(){
                var newsize = _this.getImgShowSize(img);
                _this.imgLoadedCss(img,newsize);
                _this.imgShowAnimate(img,type);
            };

            img.src = src;
        },
        //显示第一个
        showFirst:function(){
            //this.imgShowAnimate(this.createImgObj);
            this.showImgObj = this.createImgObj;
        },
        //获取图片显示尺寸
        getImgShowSize:function(img){
            var objwidth = this.winWidth,
                objheight = this.winHeight,
                imgwidth = img.width,
                imgheight = img.height,
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

            return {
                width:newimgwidth,
                height:newimgheight
            }
        },
        //图片显示前css设置
        imgBeforeShowCss:function(img,type){
            if(type){
                var x = -this.winWidth + "px";
                $(img).css({
                    position:"absolute",
                    left:"50%",
                    top:"50%",
                    opacity:1,
                    display:"none",
                    "-webkit-transform":"translate("+x+",0)"
                });
            }else{
                $(img).css({
                    position:"absolute",
                    left:"50%",
                    top:"50%",
                    opacity:0,
                    display:"none",
                    "-webkit-transform":"scale(0.5)"
                });
            }

        },
        //图片显示动画
        imgShowAnimate:function(img,type){
            if(type){
                $(img).cssAnimate({
                    opacity:1,
                    "-webkit-transform":"translate(0,0)"
                },500)
            }else{
                $(img).cssAnimate({
                    opacity:1,
                    "-webkit-transform":"scale(1)"
                },500)
            }
        },
        //图片加载后css设置
        imgLoadedCss:function(img,size){
            $(img).css({
                display:"block",
                "margin-left": - size.width/2 + "px",
                "margin-top": - size.height/2 + "px",
                width:size.width + "px",
                height:size.height + "px"
            })
        },
        //隐藏图片动画
        imgHideAnimate:function(img,type){
            var callback = function(){
                $(img).remove();
            };

            if(type){
                $(img).cssAnimate({
                    opacity:0,
                    "-webkit-transform":"scale(0.5)"
                },500,function(){callback();});
            }else{
                var x = - this.winWidth+"px";

                $(img).cssAnimate({
                    "-webkit-transform":"translate("+x+",0)"
                },500,function(){callback();});
            }
        },
        //图片向上快速滑动
        imgFlyToTv:function(img){
            var y = - this.winHeight + "px";

            $(img).cssAnimate({
                "-webkit-transform":"translate(0,"+y+")"
            },500,function(){$(img).remove();});

        },
        //事件绑定
        eventBind:function(){
            var $$ = bens.require("event_slide"),
                _this = this;

            $$(this.win)
//            .mystart(function(e){
//                _this.savePoint(e);
//            })
//            .mymoving(function(e){
//                _this.moving(e);
//            })
//            .myend(function(e){
//                _this.ended(e);
//                _this.clearPoint();
//            })
//            .myslidedown(function(){
//                _this.clearPoint();
//            })
                .myslideleft(function(){
                    _this.slideLeft();
                    //_this.clearPoint();
                })
                .myslideright(function(){
                    _this.slideRight();
                    //_this.clearPoint();
                })
                .myslideup(function(){
                    _this.slideUp();
                    //_this.clearPoint();
                });


        },
        //快速向左
        slideLeft:function(){
            //获取后一张的i
            this.showNumber++;
            this.showNumber = (this.showNumber >= this.data.length)? 0 : this.showNumber;

            this.createImg(this.showNumber);
            //this.imgShowAnimate(this.createImgObj);
            this.imgHideAnimate(this.showImgObj);
            this.showImgObj = this.createImgObj;
        },
        //快速向右
        slideRight:function(){
            this.showNumber--;
            this.showNumber = (this.showNumber > -1)? this.showNumber : this.data.length - 1;

            this.createImg(this.showNumber,"back");
            //this.imgShowAnimate(this.createImgObj);
            this.imgHideAnimate(this.showImgObj,"back");
            this.showImgObj = this.createImgObj;
        },
        //快速向上
        slideUp:function(){
            //发送到电视
            this.sendToTv(this.showImgObj,"fast");

            //获取后一张的i
            this.showNumber++;
            this.showNumber = (this.showNumber >= this.data.length)? 0 : this.showNumber;

            this.createImg(this.showNumber);
            //this.imgShowAnimate(this.createImgObj);
            this.imgFlyToTv(this.showImgObj);
            this.showImgObj = this.createImgObj;
        },
        //移动中
        moving:function(e){
            if(!this.startPoint.x){ return;}
            var this_point,
                point;

            if(e.touches){
                point = e.touches[0];
            }else{
                point = e;
            }

            this_point = {
                x:point.pageX,
                y:point.pageY
            }



        },
        //结束
        ended:function(e){

        },
        //发送到电视的
        sendToTv:function(img,type){
            var src = img.src,
                width = img.width,
                height = img.height;

            this.toTvFn(src,width,height,type);
        },
        //保存点
        savePoint:function(e){
            var point;
            if(e.touches){
                point = e.touches[0];
            }else{
                point = e;
            }

            this.startPoint.x = point.pageX;
            this.startPoint.y = point.pageY;
        },
        //清除点
        clearPoint:function(){
            this.startPoint = {};
        },
        //销毁
        destroy:function(){
            var $$ = bens.require("event_slide");
            $$(this.win).unbind(true);

            $(this.win).html("");

            this.data = null;
            this.win = null;               //obj id jqobj 转成 obj
            this.toTvFn = null;
            this.showImgObj = null;         //显示的img对象
            this.createImgObj = null;       //创建的img对象
        }


    };

    return imageChangeShow;
})();


