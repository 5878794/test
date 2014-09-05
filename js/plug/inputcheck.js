/*
 * Filename : inputcheck.js
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-9-18
 * Time: 上午11:24
 * Email:5878794@qq.com
 * =====================================
 * Desc: input输入验证插件  ,  自由扩展规则
 *
 *
 *  需要  jq.mobi jq.extend  bens
 *
 *  bens.require("inputcheck").check({
 *      inputs:[
 *          {
 *              id:"test",                              //要检查的input的id
 *              name:"用户名",                           //要检查的input的名字（信息提示用）
 *              rules:"must,username,min:6,max:16",     //验证规则，见 rules 对象
 *              error:"用户名格式错误"                     //（非必须）自定义错误提示
 *          },
 *          ...
 *      ],
 *      success:function(){
 *          //验证通过回调
 *          console.log("ok")
 *      },
 *      error:function(msg){
 *          //返回验证错误的文字
 *          console.log(msg)
 *      }
 *  })
 *
 *
 */



(function(){
    return  {
        rules:{
            username:{
                rule:/^[a-zA-Z][a-zA-Z0-9]*$/,
                error:"格式错误"
            },
            nickname:{
                rule:/^[\u4e00-\u9fa5a-zA-Z0-9_]+$/,
                error:"格式错误"
            },
            password:{
                rule:/^[a-zA-Z0-9]*$/,
                error:"不能有特殊字符"
            },
            mobile:{
                rule:/^[1]\d*$/,
                error:"格式错误"
            },
            email:{
                rule:/^[a-zA-Z0-9][a-zA-Z0-9-_\.]*@[a-zA-Z0-9_-]*\.[a-zA-Z0-9]*$/,
                error:"格式错误"
            }
        },
        check:function(datas){
            var inputs = bens.getArray(datas.inputs),
                success = bens.getFunction(datas.success),
                error = bens.getFunction(datas.error),
                pass = true,
                error_messages = [];

            for(var i = 0,l = inputs.length; i<l; i++){
                var this_input = inputs[i],
                    this_id = this_input.id,
                    this_rules = this_input.rules.split(","),
                    this_error_msg = this_input.error;

                var this_error = [],
                    this_state = true;
                this._checkOne(this_id,this_rules,function(text){
                    //未通过。。。
                    pass = false;
                    this_state = false;
                    this_error.push(text);
                });

                this_input.state = this_state;
                this_input.message = this_error.join(",");
                if(!this_state){
                    if(this_error_msg){
                        error_messages.push(this_input.name+":"+this_error_msg);
                    }else{
                        error_messages.push(this_input.name+":"+this_input.message);
                    }
                }
            }

            if(pass){
                success();
            }else{
                var msg = error_messages.join(";");
                error(msg);
            }

        },
        //检查流程
        _checkOne:function(id,rules,error){
            var this_val = bens.trim($("#"+id).val());
            if(this_val){
                //输入有值需要验证
                for(var i= 0,l=rules.length; i<l; i++){
                    var rule = rules[i],
                        setRules = this.rules[rule];

                    if(setRules){
                        var reg = setRules.rule,
                            check = reg.test(this_val);

                        if(!check){
                            error(setRules.error);
                        }

                    }else if(rule.indexOf("max")>-1){
                        var length = rule.split(":")[1];
                        if(this_val.length > length){
                            error("不能超过"+length+"字符");
                        }

                    }else if(rule.indexOf("min")>-1){
                        var length1 = rule.split(":")[1];
                        if(this_val.length < length1){
                            error("不能少于"+length1+"字符");
                        }
                    }
                }
            }else{
                if(rules.indexOf("must") > -1){
                    //没有输入但是是必填项目 报错
                    error("不能为空");
                }
            }
        }
    };
})();