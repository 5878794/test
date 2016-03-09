/**
 * User: bens
 * Date: 13-3-24
 * Time: 下午8:29

 loading动画ui               windows phone下输入框还是可以点击
 依赖：plug/device
      plug/__loading_canvas
      bens
      jq.mobi
      jq.extend

 //初始化
 var a = require("loading"),
     obj = new a(obj);
     @param obj: id/dom/jqdom     要插入loading的对象
 // 显示
 @fn   obj.show(text)
     @param text:str   要显示的文字

 //隐藏
 @fn   obj.hide()：

 //销毁
 @fn   obj.destroy();


 */


(function(){
    var device = bens.require("device"),
        __loading = bens.require("__loading_canvas");

    var loading = function(obj){
        this.win = bens.getDom(obj);
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

            win.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;display:none;"+device.box_align+":center;"+device.box_pack+":center;";
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

    return loading;


})();