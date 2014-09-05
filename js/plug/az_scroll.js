/*
 * Filename : az_scroll.js
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 13-10-16
 * Time: 下午3:16
 * Email:5878794@qq.com
 * =====================================
 * Desc: 电话本快速字母导航效果，手指滑动字母放大显示
 *
 *
 * //生成
 * var cc = bens.require("az_scroll");
 * var aa = new cc("main",true);
 *
 * //销毁(只销毁了事件)
 * aa.destroy();
 *
 *
 * @param
 *   new cc("要出入字母的容器（id，obj）",“是否是横向（不传是竖向排列）”);
 *
 *
 *
 */


(function(){
    var device = bens.require("device");
    var azscrolls = function(obj,isHorizontal){

        //data
        this.data = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

        //dom
        this.main = bens.getDom(obj);
        this.objs = [];     //缓存的icon对象


        //state
        this.isHorizontal = (isHorizontal)? true : false;   //是否是横向显示
        this.isStart = false;


        //size
        this.mainWidth = parseInt($(this.main).width());
        this.mainHeight = parseInt($(this.main).height());
        this.mainTop = bens.offsetPage.top(this.main);
        this.mainLeft = bens.offsetPage.left(this.main);
        this.iconWidth = (this.isHorizontal)? this.mainWidth/this.data.length : this.mainWidth;
        this.iconHeight = (this.isHorizontal)? this.mainHeight : this.mainHeight/this.data.length;
        this.maxShow = 9;   //奇数
        this.px2deg = 180/(this.maxShow-1) / this.iconHeight;   //一个px对应度数
        this.r = (this.maxShow-1)/2*this.iconHeight;    //半径
        this.iconDeg = 180/(this.maxShow -1);       //每个icon间隔度数





        this.init();

    };
    azscrolls.prototype = {
        init:function(){
            if(this.isHorizontal){
                this.main.style.cssText += device.fixCss("display:box;box-orient:horizontal");
            }
            this._createElement();
            this._createEvent();
        },
        _createElement:function(){
            var obj = document.createElement("div"),
                data = this.data,
                style = this.main.style.display;
            obj.style.cssText += "-webkit-transform-origin:center center; width:"+this.iconWidth+"px;height:"+this.iconHeight+"px;text-align:center;line-height:"+this.iconHeight+"px;";

            this.main.style.display = "none";

            for(var i= 0,l=data.length;i<l;i++){
                var this_obj = obj.cloneNode(true);
                this_obj.innerText = data[i];
                this.main.appendChild(this_obj);
                this.objs.push(this_obj);
            }

            this.main.style.display = style;
        },
        _createEvent:function(){
            this.main.addEventListener(device.START_EV,this,false);
            this.main.addEventListener(device.MOVE_EV,this,false);
            this.main.addEventListener(device.END_EV,this,false);
        },
        handleEvent:function(e){
            e.preventDefault();
            var _this = this
                ;
            switch (e.type){
                case device.START_EV:
                    _this._start(e);
                    break;
                case device.MOVE_EV:
                    _this._start(e);
                    break;
                case device.END_EV:
                    _this._end(e);
                    break;
                default :
                    _this._end(e);
                    break;
            }
        },
        _start:function(e){
            this.isStart = true;
            this._restoreMovedObjs();

            var x, y, n,dpm_y,dpm_x,m_doms;


            if(this.isHorizontal){
                x = this._getPoint(e).x;
                n = parseInt(x/this.iconWidth);
                dpm_x = x%this.iconWidth;
                m_doms = this._getMoveDomX(n,dpm_x);

                this._showEffect(m_doms);

            }else{
                //对应main的y距离
                y = this._getPoint(e).y;
                //点到第几个对象
                n = parseInt(y/this.iconHeight);
                //对应点中icon的y距离
                dpm_y = y%this.iconHeight;
                //获取需要移动的icon和坐标
                m_doms = this._getMoveDomY(n,dpm_y);

                this._showEffect(m_doms);
            }

        },
        n:0,
        _move:function(e){
            if(!this.isStart){return;}
            this.n++;
            if(this.n%2 == 0){
                this._start(e);
            }

        },
        _end:function(){
            this.isStart = false;
            this._restoreMovedObjs();
        },
        _getPoint:function(e){
            if(device.hasTouch){
                e = e.touches[0];
            }

            //get mail offset y
            var main_y = this.mainTop,
                main_x = this.mainLeft,
                this_x = e.pageX - main_x,
                this_y = e.pageY - main_y;

            return {
                x:(this_x<0)? 0 : this_x,
                y:(this_y<0)? 0 : this_y
            }
        },
        _getMoveDomY:function(n,dpm_y){
            var temp_y = this.iconHeight/ 2,
                temp_n = (this.maxShow -1)/ 2,
                start_dom = n - temp_n,
                end_dom = n + temp_n,
                xz_deg =(temp_y - dpm_y) * this.px2deg,
                jl = temp_n * this.iconHeight ,
                pi = Math.PI/180,
                objs = [],
                z = -1;

            for(var i=start_dom,l=end_dom + 1;i<l;i++){
                z++;
                var this_obj = this.objs[i],
                    this_deg, xz_x,xz_y,xz_scale;

                if(this_obj){
                    this_deg = z * this.iconDeg + xz_deg;
                    this_deg = (this_deg < 0)? 0 : this_deg;
                    this_deg = (this_deg > 180)? 180 : this_deg;
//                    var bz_x = (z>temp_n)? this.maxShow - z : z;

                    xz_x = - Math.sin(this_deg*pi)*jl;
                    xz_y = Math.abs(Math.cos(this_deg*pi)*jl);
                    var old_y = (this.iconHeight * Math.abs(z-temp_n));
                    xz_scale = (this_deg >90)? 1 + (180-this_deg)/90 : 1 + this_deg/90;

                    xz_y = (this_deg <= 90)? old_y - xz_y : xz_y - old_y;
                    xz_y += dpm_y - temp_y;

//                    xz_x = (this_deg == 90)? -jl : xz_x;
                    xz_y = (xz_x == 0)? 0 :xz_y;
                }


                objs.push({
                    obj:this_obj,
                    deg:this_deg,
                    x:xz_x,
                    y:xz_y,
                    scale:xz_scale
                });
            }


            return objs;
        },
        _getMoveDomX:function(n,dpm_x){
            var temp_x = this.iconWidth/ 2,
                temp_n = (this.maxShow -1)/ 2,
                start_dom = n - temp_n,
                end_dom = n + temp_n,
                xz_deg =(temp_x - dpm_x) * this.px2deg,
                jl = temp_n * this.iconWidth ,
                pi = Math.PI/180,
                objs = [],
                z = -1;

            for(var i=start_dom,l=end_dom + 1;i<l;i++){
                z++;
                var this_obj = this.objs[i],
                    this_deg, xz_x,xz_y,xz_scale;

                if(this_obj){
                    this_deg = z * this.iconDeg + xz_deg;
                    this_deg = (this_deg < 0)? 0 : this_deg;
                    this_deg = (this_deg > 180)? 180 : this_deg;
//                    var bz_x = (z>temp_n)? this.maxShow - z : z;

                    xz_y = - Math.sin(this_deg*pi)*jl;
                    xz_x = Math.abs(Math.cos(this_deg*pi)*jl);
                    var old_x = (this.iconWidth * Math.abs(z-temp_n));
                    xz_scale = (this_deg >90)? 1 + (180-this_deg)/90 : 1 + this_deg/90;

                    xz_x = (this_deg <= 90)? old_x - xz_x : xz_x - old_x;
                    xz_x += dpm_x - temp_x;

                    xz_x = (this_deg == 90)? -jl : xz_x;
                    xz_x = (xz_y == 0)? 0 :xz_x;
                }


                objs.push({
                    obj:this_obj,
                    deg:this_deg,
                    x:xz_x,
                    y:xz_y,
                    scale:xz_scale
                });
            }


            return objs;
        },
        _showEffect:function(objs){
            for(var i= 0,l=objs.length;i<l;i++){
                var data = objs[i],
                    obj = data.obj,
                    x = data.x,
                    y = data.y,
                    scale = data.scale,
                    temp_style;

                if(obj){
                    temp_style = "-webkit-transform:translate("+x+"px,"+y+"px) scale("+scale+");";
                    if(i == (l-1)/2){
                        temp_style += "color:red;";
                    }else{
                        temp_style += "color:#000;";
                    }
                    obj.style.cssText += temp_style;
                }


            }
            this.movedObjs = objs;
        },
        _restoreMovedObjs:function(){
            var data = this.movedObjs;
            if(!data){return;}
            for(var i= 0,l=data.length;i<l;i++){
                var obj = data[i].obj;

                if(obj){
                    obj.style.cssText += "-webkit-transform:translate(0,0) scale(1);color:#000;";
                }
            }
            this.movedObjs = [];
        },
        destroy:function(){
            this._restoreMovedObjs();
            this.main.removeEventListener(device.START_EV,this,false);
            this.main.removeEventListener(device.MOVE_EV,this,false);
            this.main.removeEventListener(device.END_EV,this,false);
        }
    };


    return azscrolls;
})();



