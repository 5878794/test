/*
 * Filename : phomegap_getimage.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-6-24
 * Time: 下午2:05
 * Email:5878794@qq.com
 * =====================================
 * Desc: 通过引擎接口获取图片或照相
 *
 * bens.require("phonegap_getimage")
 *          .choose(datas)                  //弹出选择层，选择从摄像头获取或从相册获取
 *          .fromCamera(datas)              //从摄像头获取，打开相机
 *          .fromDevice(datas)              //从相册获取，打开相册
 *
 * datas = {
 *     @param savePhoto:boolean             //是否存到相册
 *     @param fileType:str                  //返回base64，传“base64”.  默认uri
 *     @param success:fn(src)               //成功返回   图片地址，如为base64需要加头 data：**
 *     @param error:fn(msg)                 //失败返回   返回错误原因。英文。
 * }
 *
 *
 */



(function(){
    var device = bens.require("device"),
        $$ = bens.require("event"),
        cameraImage = "data:image/png;base64,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",
        deviceImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA0CAYAAADWr1sfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAg+SURBVHja5JprbFTHFcf/M/fuetdre9c2cW2KMQkx4EJxaAsRLZDmAYFaaaKqiurWKrQEktAPjZq6aZtGfSglSpCqtBGKEpKUSrQpqK+oDzeCRkmqKikuECFTE4iVxDYxmODGz33cmTn9cGfsu2uvvd4VWa8YaeRdX+/6/O7/nDNnzh1GRLiSBscVNmzzgjE2/tLzkxUoF+lpXsN4sp3yh0yrzvU1ywPOCgRU6Sn1VN4bYE8BawMo8ky7wIAlgASAuJ4OADHJpfWwNGQJgDIAIQB+j9JzfSgNGAUwrCd5FJ+ksA0gACDcur3puuXXLliccIRPKeJENOeBGWPksy1RHPTHmu/fe1hDOnpiKuBxhTeva/zEurVLby/EjOUn63zz/XuPAhgBMOZdjaaKYR+AQDzh+Agi4EDUFhwwQucBFE8VjumytKWIOEiCIQEGHrXh77PgG5yrkALxGoFEtfsuBM8qw2cCZgAYETFOApzisFlJ35MHXm17pf30OdvmCduyHItzmdfsRMSlVLaQ0pdwRPCpH29fG6kQYYIMageecmWxp00C5IBTDBYrjb7de3HgD4fbuwAM6rhwdPbLZ9EUAFAKoGLvQ9tWc0oomshP01daaYFVDGAStm05AIYAXNI/43kG9mnflQCKGGPEKQ6ihOvI2QNHwSwJ2+LCs74ZlVVec5ML6wcQYQzEVAyM4rkonABTUTCSsCxu1rS4Bo/mGdjAJkwlxVUMoFgOwMoBVBQgkVqUm6mo80B+ioyGFkqtkxnFXHuzBQYZYJmNQUkZkjoPXP6Nt4rnCKwcQMYyBtaQzLOeG2hiDS1Ke8TlA5dxQMVyaACQAVaZwppKLagzaKneiARN1cMaWvhlVVjGclFYAjIxrcIeVS1TlmrAgH6vdKIb0zPBGlpAnQfUbMIiI8+Qjmtv9sACEInpFDagZg8d1KqWAij52hc2fLSnb2DsyGsdfXops3RBH08H7fEU5vFA8iaptPDSce3NFpiUAqQEm9zoG6+5PS5cokEjVZVllc/9dOeGzetWrhocGRv9/K6fPf+v42e6U0IoCTrFU2z9vab5oDzbPMkaWqZ0OZLStTdrYCKQUuA0JahfG1WsQcMAIvd9dfOKB++5/eYKdmoZvbdvYSS0tO+PT9xHt9712KETne+k1rdx1tCSuh83nmLinut11oRFTIPz1FpZKQUoNV2hNT2wkgpKSLAJl2YeWL+GLQNQ3rB4fvWzD++45fp6vkYNHq4R0e55AIDEG7UVYVDbvla2Zceegyc634GnwQbP5tzUxiH9naWBIl/x1jvW1zx18KUeAKOeLsaop0MzfhOVVCAhswcmRZBSwSJAdzy4Bi3R6oYBlO9pbV59b/Mt6/0jr9fHzx1bNCm0Bo4vrIgQ/vZ0K238+iMHO872em+eSaumtRQGEP7KbZ+5dk9r86aPlIzW7bzzpje++M2ft73de/GivimmwvJ73B5SKpBU2cewUgQpFEgRiJJaQAEAxRs/veLqJ36wtemayIXrnL6DNfFYf1naBPr+sYXlFaAXn3mAbr3r0UMdZ3vNEhbVBgcBlFVVls375e6dN21Z3/jx+Lm/LBm7+Gb1iso1FSdfeGTB47/6+8sP/eJ3x/X/H/XcKGvCI3MAloogBEFNKGxi1v71nl033Lnl+hsSfUfqR3tOLshok97/n7ryeYQXn3kAm7Y/+vtTb/UGNDAHEPjujttWtG5vurE4emLp0KnH60gJCwDEhX8vsod7wt/50soFTZ99eNm27z3ddvLN7n4d2z6tNIQAlKAcFJYEMVnhIgDBm9cuXzV8+tk1Mv6/0Kw6E+fb68JVhLZ9rXTj1t1/7eq+MNyweH5o/+671zXWJj4Z6/9zzchwd+Wkzw31lseGesuXVH0q9NpvfzT/yeePvPLtx37TYVQmApNSQeaqsJOssFmGiojAhHQ9YLbDea+9LlzN6KX932eH2l7v+saXNzY6/f+8ZuBse10mn/V90F1+b1NjbXFg2592/WR/h3ZxZGKPPVOhJZykumOi56UUI8e9ns0Y7Dm6yBd866qdm1Yu++C/++eL6EDGniIGL5TZJUMDgSJ/yFR0RMREBvZMr7AEHAEomtzzcu+oez3b4QwPhKLDL9dnVTYrQCplPM7K1J4ZXNpNBOkqSyHcmZcmnkraALFM7ZkROEXhZOAcFc5pJ6iysyejGFZpFJYi+xjOWWGZnT0zKyyBdIcEHOnOvChM2dljzxQnYhqXljKPMSyzs2fmpJWssLeBByHdmRfgZJuQqT0zKiyTgc1zVodzbrbLecvS+nGPSLU3hwbAJGCm76hgDLRk9ZYzeexLw3q3W3r2xtD7/xwUJtetidyHV5h4Gkd3//C5tiK/XSqE8pF77UMbnDPJOZedXeeGPb1pXYzkojBB19GAlMpsDQkAXvjHsUu6P+XDh38cQnlAx5//KkqfYDMDxoQ7O0L4dSvHry8Zxa08AcPT9fArIua1d9bAjDEire67p0/UPHjPHau+te1zyxkDcc61C6k5ce6DCKzmqkhx58hQcLbA4ydeGANxywfLV4Shgf6KM68e2mD5/BJzdHSNDBYzbnOLjyN5z2ilBVY6zSd8ti1KIxHU1n9sBIUwqqrHUn4T1yxJ0HaKuuZQ1+jwaPR9u77+aGn4ak6ggjmCyBlX/ZeGpE6oMQ+0G6rmDCJjjHt6VmUAIjpJBb2dwTk+TMN+FO4phQEDTuQ+851K4ZiGE55lxyoQgb1eGsUUZ1HsKRKWo18n9J0yxUahABvo8Ucz6WIYngA3ycv7aKRQDpd6xUva7CTF8JUyrrgT8f8fAEm1N7vOS1F4AAAAAElFTkSuQmCC";


    return {
        zz:null,
        fileType:null,              //返回文件类型   base64  默认：空  返回图片地址
        savePhoto:false,            //是否存储照片  默认false
        cameraButton:null,
        deviceButton:null,
        success:null,
        error:null,
        choose:function(datas){
            this.getParams(datas);
            this.createDom();
            this.eventBind();
            this.showUI();


        },
        fromCamera:function(datas){
            this.getParams(datas);
            this.getImage("camera");
        },
        fromDevice:function(datas){
            this.getParams(datas);
            this.getImage("device");
        },
        //获取参数
        getParams:function(datas){
            this.success = bens.getFunction(datas.success);
            this.error = bens.getFunction(datas.error);
            this.savePhoto = ($.isBoolean(datas.savePhoto))? datas.savePhoto : false;
            this.fileType = ($.isBoolean(datas.fileType))? datas.fileType : false;
        },


        //创建选择弹出层
        createDom:function(){
            var zz = $("<div></div>"),
                main = $("<div></div>"),
                camerabutton = $("<div>拍 照</div>"),
                devicebutton = $("<div>相 册</div>");

            var zz_css = {
                width:"100%",
                height:"100%",
                position:"absolute",
                left:0,
                top:0,
                display:device.box
            };
            zz_css[device.box_pack] = "center";
            zz_css[device.box_align] = "center";
            zz.css(zz_css);

            var main_css = {
                width:"300px",
                height:"180px",
                background:"#fff",
                padding:"20px"
            };
            main_css[device.border_radius] = "5px";
            main_css[device.box_sizing] = "border-box";
            main.css(main_css);

            var camerabutton_css = {
                width:"100%",
                height:"60px",
                "line-height":"60px",
                background:"url('"+cameraImage+"') no-repeat,#ccc",
                backgroundPosition:"left center",
                backgroundOrigin:"content-box",
                padding:"0 100px 0 20px",
                border:"1px solid #666",
                textAlign:"right"
            };
            camerabutton_css[device.border_radius] = "5px";
            camerabutton_css[device.box_sizing] = "border-box";
            camerabutton.css(camerabutton_css);

            camerabutton_css["margin-top"] = "20px";
            camerabutton_css["background"] = "url('"+deviceImage+"') no-repeat,#ccc";
            devicebutton.css(camerabutton_css);



            main.append(camerabutton).append(devicebutton);
            zz.append(main);
            $("body").append(zz);

            this.zz = zz;
            this.cameraButton = camerabutton;
            this.deviceButton = devicebutton;

        },
        //事件绑定
        eventBind:function(){
            var _this = this;
            $$(this.zz).myclickdown(function(){
                _this.destroy();
            });


            $$(this.cameraButton)
                .myclickdown(function(){

                })
                .myclickup(function(){

                })
                .myclickok(function(){
                    _this.getImage("camera");
                });


            $$(this.deviceButton)
                .myclickdown(function(){})
                .myclickup(function(){})
                .myclickok(function(){
                    _this.getImage("device");
                });

        },
        //显示ui
        showUI:function(){
            this.zz.cssAnimate({
                background:"rgba(0,0,0,0.5)"
            },500)
        },


        //获取图片
        getImage:function(type){
            this.removeUI();
            var _this = this;
            var success = function(src){
                _this.success(src);
                _this.destroy();
            };
            var error = function(msg){
                if(msg.indexOf("cancell")>-1){

                }else{
                    _this.error(msg);
                }
                this.destroy();
            };
            var seting = {
                quality:50,
                saveToPhotoAlbum:false,
                sourceType:(type == "device")? navigator.camera.PictureSourceType.PHOTOLIBRARY : navigator.camera.PictureSourceType.CAMERA,
                destinationType:(this.fileType == "base64") ? navigator.camera.DestinationType.DATA_URL :  navigator.camera.DestinationType.FILE_URI,
                //解决ios 图片被反转的问题
                correctOrientation:true
            };

            var successfn = function(src){
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(){
                    window.resolveLocalFileSystemURI(src, function(fileentry){
                        success(fileentry.fullPath);
                    }, error);
                }, error);
            };



            navigator.camera.getPicture(successfn, error, seting);
        },



        //移除ui
        removeUI:function(){
            if(this.zz){
                $$(this.cameraButton).unbind(true);
                $$(this.deviceButton).unbind(true);
                this.zz.remove();
                this.zz = null;
                this.cameraButton = null;
                this.deviceButton = null;
            }
        },

        //销毁
        destroy:function(){
            if(this.zz){
                $$(this.cameraButton).unbind(true);
                $$(this.deviceButton).unbind(true);
                this.zz.remove();
            }

            this.zz = null;
            this.cameraButton = null;
            this.deviceButton = null;
            this.success = null;
            this.error = null;


        }
    }
})();


