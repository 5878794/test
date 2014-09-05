/**
 * User: bens
 * Date: 13-3-24
 * Time: 下午8:37
 *
 * 创建class动画到css。 只能在本地或手机本地应用运行。只是创建class。需要手动指定给dom。   windowsphone 不支持
 * 引用  plug/device jq.mobi bens
 *
 *
 * var a = new addCssAnimateClass(ruleData,time);
 *
 * @param ruleData:obj   css动画需要经过到百分比对象
 * @param time:number    css动画持续时间
 * @fn    remove:fn      移出创建到css动画class
 *
 * 创建好后通过 a.className 获取创建的动画函数。在把class丢给dom就ok
 *
 */


(function(){
    var device = bens.require("device");

    var addCssAnimateClass=function(ruleData,time){
        this.ruleData = ruleData;
        this.animateTime = time;
        this.id="__bens__"+device.counter();
        this.className="class"+this.id;
        this.browserType=device.cssVendor;
        this.rules=null;
        this.styleTree=null;
        this.init();
    };
    addCssAnimateClass.prototype = {
        init:function(){
            if(!$.isObject(this.ruleData)){return;}
            this.createHtmlStyle();
            this.createRule();
            this.createAnimation();
            this.createClass();
        },
        createHtmlStyle:function(){
            var tree=document.styleSheets;
            var length=tree.length;
            for(var i=0;i<length;i++){
                if($.isObject(tree[i].cssRules)){
                    this.styleTree=tree[i];
                    break;
                }
            }
            if(this.styleTree==null){
                $("head").append("<style>.__bens_add_temp_css__{}</style>");
                length=tree.length;
                for(var z=0;z<length;z++){
                    if($.isObject(tree[z].cssRules)){
                        this.styleTree=tree[z];
                        break;
                    }
                }
            }
        },
        //创建空的css动画函数
        createRule:function(){
            this.styleTree.insertRule("@"+this.browserType+"keyframes animation"+this.id+" {}",0);
            this.rules = this.styleTree.cssRules[0];
        },
        //创建动画
        createAnimation:function(){
            if(!this.rules){return;}
            for(var key in this.ruleData){
                if(key){
                    this.rules.insertRule(key + "{"+this.ruleData[key]+"}");
                }
            }
        },
        //创建引用class
        createClass:function(){
            this.styleTree.insertRule(".class"+this.id+" {" +this.ruleData["100%"]+";"+ this.browserType+"animation-name:animation"+this.id+";"+this.browserType+"animation-duration:"+this.animateTime+"ms;"+"}",this.styleTree.cssRules.length);
        },
        //移除
        remove:function(){
            var data=this.searchIndex();
            if(data.length==0){return;}

            for(var i=data.length-1;i>=0;i--){
                this.styleTree.deleteRule(data[i])
            }
        },
        searchIndex:function(){
            var a=[];
            var tree=this.styleTree.cssRules;
            var length=tree.length;
            for(var i=0;i<length; i++){
                if(tree[i].selectorText==".class"+this.id || tree[i].name=="animation"+this.id){
                    a.push(i);
                }
            }
            a.sort();
            return a;
        }

    };

    return addCssAnimateClass;


})();