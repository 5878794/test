//需要jq.mobi.js   jq.extend.js

/**
 *   显示信息，自动隐藏
 *   obj.show(str,state)     str:显示的文字，  state：bloom，正确还是错误
 *
 *   隐藏信息
 *   obj.hide()
 *
 *
 */




(function(){
    var device = bens.require("device"),
        info={
            box:null,
            img:null,
            text:null,
            isExist:false,
            isRun:false,
            fn:null,
            errimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVdJREFUeNq0V1tsVFUUXee+pnc6MI8+qC3QViiNJlVERVHUH0pi5ENifaQGgx8m/miM8UMMfmiMmpiY+IFRA0ow9scaEh8hxoQPUDAa5FFjKG3BCh2h05l2ptNO587ce9z70g5M53V/3MlJ7uxz9lpn77P3PmeE1J9GJZE0ppDFeZnCbzKBizJtTMPqcYBOmoosLksowKUQjKGP7RELHkU4FYgTsHBaTuOkjKtjcrbfgrPThNobgS/QKHyoh+qum4ONKZml9dl0BvZRA8rgOrFi4M38Obsqsa09VaRwyM8LMo1fZAynML1TgXivC4Hue0UEXWIFGkDQECU2vNERsvudInMBs8Ok2/OJPXq4InH+JmLyCufkDJFOmZcxf2gdAn0PiEZ0E2Hdooe1ZIEiMCxncUJOYQzpwTXwP/eqfTpTQpzTnizs+iyRUmjbksh9f4cIbbxfNLgeFklrGKK7DWJdy/U8GLsKOTwBRKeLlsXJjV9lnB05E4S+42X7j4mb5xXHJQXtMo0hpEzay5EtonHjI6IZYSJdml8aMmBCvLgdyr4X3MHfrFu+jm0Zg7EY83PtPnMZsUSMAnQeKYb9qksEejaJMIVWcaOwfNjjk1B23EOWwh38zbpyaxmDsRiTsUs8/lvO83d/I3w77xQhUPa6pVRuxLNzgKHdQKBv1lVaz1iMydhfaw/2F4gnydsZWIYPylsdVCR0HmV3X/DYDWSxsK6aDWMyNnP8oD3sJo1y1VmAkNgVkNr6VtqfI2WNUZrJrKtlx9jMQVy7F0PtcDh2R4RB+xJVd740Sog92DB2A3H4oe5iG01ARKhGtzRQIBwPdepU0Hmxpa6HedhbTqrbIpomxGYdispJUM6bct5V8riWMIcpVDUHZ7NGpJ1+N4ulB1OUXSU9ErMwF9VQp6ZJETQWaxaeQl3GY+mdmLmoNQc1jQ5dXUwqL5IvW07eiZmLORUVSlIRSknLqzQSoBPKZG94a+XdvuzVnrlcTkrzS1IjYuGtLOghgGMfHiwQH/vgAN/FnmyZg7mYU4ybj0cgxCQ0RZXphZqhiiKDU/RAOEP9jmUjQrib+jE3iJqvjkAdnZVDJyObxXjTMxQ667gS9G+1own8n6K2RuAk53/umP3mIU3yLiC/hE/fKg0qKzqzaqKtboR+2xro1GC5V+ZGJpA7fwX5aLy6t3yx+HQqZn3AxXFmM1BC9QedvP260hLuzP8Tq2xN16BYYSL02hPw925yVenDJ5B442DNnFZbwhRheUmEAgdcqFwiBakKi663vSLoB2hUSxBrYqpAylL/2GZkL/5bvbcTJmNLXd3bfmG/df2SkA5yMUqUleYATXyrda6CNMtfjZwXY7lkSdcazc1UJGUsF5OwO4b3DxSCxyHKT6eRj6cg/L5nRTgwZGxYTWdhlL3Yr2VSOP7RoQLx0fc/c2u73FrGYCzGZOyiM/8T2wvn5+tqg96+qk2przuSi8Z7rOErsGfSRR5OUDmdplIaQtLtQj10zd9FJdWCuuIzDQVgdK+G3tow5MwtPNr+47tFjz0xtETMP3QNRlcrjFtvCWiNwS/ysZk+ayQKa/waZDbn7R8CZa6+thm+DW3QmkKD+ank8+3fvZ0uWXcOvSWZa7SvIkPabXtzH2neyceS3dZoFLnLMdipOZQ8Q8hGXVkPfU0TDCozrSk4Sto9bZ++Mlhxg2eXE98cKgKh8KsE1C80tU/m7F7q06ZDf1aWIsAeKvS8VUxfRujqT9J2BvOTMwNrB/ZU/wtzBtuqzJIn4cD1CLiehExhGreTfj3NBhdXJalAR2XG+qtt30sZr13sPwEGAJ9VE3aPBYcqAAAAAElFTkSuQmCC",
            okimg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBtJREFUeNqslk+ME1Ucx79v5s1Ot9tu9x+VIqgBVDTRcOHIQQ7EhLh6ABOPnA3cPJgYj8YbnDDcPZgQTTyQbJSbNz2QCBxwyWq6LgLWdlraTufPe8/fzL5pXodZtrvhJd9MOzPvfeb33u8fm+lit8GMKzP+Z0MZgnEtHHwXUCKrQMxYXBZI7QTmU4C4lqOv2X3oxQUpzkkUWF4IzGC2AXG1ZrR4DpgAQlKgFWoJrYlt5jvAMtAsqbwgrdpqn589HNtnXfBDZeW8oaCkz+IHQ0TNLS5ufV+N13ym+vS+rxXodSegzHAay4CVSHOk6icdfPh6bF1a5q805uyD4KxkeIuCUCP040doiebmfUddubGANXqUgAekESnSUGkCWQ5WKUksXnyMLxqcX1hx3obFOEbSQ0CKpJ9OcqwyStYCXJJQIVrhPTyU8tvrB/E1Pe5psK+hqTPZ9ucT1rnastrFTXxZt3FhceY4gbroRk0MRCuFCRWnSn77wiN16IstlO06WNR+97iHuds1/Gac49hzE6BpXXJm1Y+aOH9E4NLC7CGEcoAhgRILdhoygathCnX5PCy/f7I2xPr6PP4yvDaFWsb5pY5SjVBr9HDZoo2NaKGB7KRXYXxukZJ3+rKNWAkkc1/18JkrUNG7NvZsy4i55KZ7+k+ccxjqjlWhreoiljFZgKmUvOuLHhy7Alrj5TMbOKdDyclYeaBT7eG05W4vEMlwalimSAbp1SJEzcOZXOwybgDTYOdDnMRy8rWCtkdh70OB0VxFq9k+3splJ8bz6UwFWBFSW4f9jUjpnQlxIJ9/n8mlYYw4jim+HfFsXZhyCHKciCKPJHZK3uNEGwq0gxHqzNUnvJ9Npa2hNUBrPclVkBSYwdKsP1LYGPVR5xT+trNPCynyAsoxQ4b7Og6lGYfKKDFhZx4/DT36QV8Yi2R79qZkTkDJbEBreBX8oitHnAdmZSZYfwdr/adoDdp0g16Vcg9hkTgbzRn8R0l0gK17p3BTA6N8ppH6ZuAtodVawrXeQ5rY3l5gKqgB6/0DtJbxjV9GV5epzEJkyXuiZ3l0DA+W7uCI6uHNJHDYzLZjKzZZxjONYS2g2wTaNr67vYrr9OiprhZZQVYmcGK0j+LXyl28JP7FCcpYYGYLRRSlrRJ01gEVot4WwShVezZu/H4eX0k7tW5owOTzCvCsLlOVEz/g4+rf+LRUxkppkfIUpWPubk+IabNCgvmdNAyedF/D1T9W8aO27LkFuKjFKGUtxmwbi4d/xgelx3jPHuGoJdBID55jS7jY8Bu4tfk+bgbVsVVZixHlGqoJYFETlTVOZiNla5neHRlNVAbKd2+FXZsyGh9leG+ov5prmNmXmm1ilA/03drEfCdt9p2WAXuhjXARWLyoVv9/AQYAzRaQFve6TfoAAAAASUVORK5CYII=",
            show:function(text,isok){
                if(!this.box){
                    this.createObj();
                }

                if(this.isRun){
                    this.list.push({text:text,isok:isok});
                    return;
                }
                this.isRun=true;

                var that=this;

                that.text.text(text);
                if(isok){
                    that.img.get(0).style.background = "url("+that.okimg+")";
                    that.img.get(0).style[device.background_size] = "100% 100%";
                }else{
                    that.img.get(0).style.background = "url("+that.errimg+")";
                    that.img.get(0).style[device.background_size] = "100% 100%";
                }


                that.box.css({display:device.box});

                var cssobj = {opacity:0.9};
                cssobj[device.transform] = device.css_s+"0,-60pt"+device.css_e;

                that.box.cssAnimate(cssobj,300,function(){
                    that.fn=setTimeout(function(){
                        that.hide();
                        if(that.list.length!=0){
                            setTimeout(function(){
                                that.isRun=false;
                                var data=that.list.shift();
                                that.show(data.text,data.isok);
                            },0);
                        }else{
                            that.isRun=false;
                        }
                    },2000)
                })

            },
            createObj:function(){
                var box = document.createElement("div"),
                    info = document.createElement("div"),
                    img = document.createElement("div"),
                    text = document.createElement("div"),
                    $box = $(box),
                    $info = $(info),
                    $img = $(img),
                    $text = $(text);

                $box.css({
                   height:"30pt",
                   width:"100%",
                   "z-index":"2000",
                   "position":"absolute",
                   left:"0",
                   bottom:"-30pt",
                   display:"none",
                   opacity:"0"
                });
                box.style.cssText += device.box_pack+":center";
                $info.css({
                    height:"30pt",
                    "border-radius":"5pt",
                    background:"#333",
                    color:"#eee",
                    "line-height":"30pt"
                });
                info.style.cssText += device.cssVendor+"box-shadow:0 0 2pt 2pt #aaa;"+device.box_orient+":horizontal;display:"+device.box;

                img.style.cssText += "width:16pt;height:16pt;margin:7pt;background-image:url("+this.errimg+");"+device.background_size+":100% 100%";
                $text.css({
                    margin:"0 7pt 0 0",
                    height:"30pt",
                    width:"auto",
                    "max-width":"360pt",
                    "line-height":"30pt",
                    "text-overflow":"ellipsis",
                    "white-space":"nowrap",
                    overflow:"hidden"
                });

                $info.append($img);
                $info.append($text);
                $box.append($info);
                $("html").append($box);

                this.box = $box;
                this.text = $text;
                this.img = $img;
            },
            hide:function(){
                if(this.box){
                    var cssobj = {
                        display:"none",
                        opacity:0
                    };
                    cssobj[device.transform] = "";
                    this.box.css(cssobj);
                }
            },
            list:[]
        };




    dummyStyle = null;
    return info;
})();

