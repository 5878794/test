/**
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-3-30
 * Time: 下午11:22
 *
 * ================================================================
 * 在dom中创建一个canvas的loading动画，，，只是转圈圈
 * ================================================================
 *
 * 需要：jq.mobi jq.extend bens
 *
 * var a = new loading({
 *     @param obj:obj    //dom对象
 *     @param number:number  //loading的   条数
 *     @param width：number  //loading所占的宽度
 *     @param height:number  //loading所占的高度
 *     @param lineWidth：number  //loading线条的宽度
 *     @param lineHeight:number //loading线条的长度
 *     @param rgb:str           //loading的颜色  eg:"230,230,230"
 *     @param spd:number        //fps
 * })
 *
 */



(function(){
    var loading = function(datas){
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
    loading.prototype = {
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



    return loading;
})();