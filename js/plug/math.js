/*
 * Filename : math.js
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 13-10-14
 * Time: 上午10:01
 * Email:5878794@qq.com
 * =====================================
 * Desc:  js小数乘法、除法bug解决函数
 */




(function(){
    var pows = function(val){
        var str = val.toString(),
            pow_n = 0;
        if(str.indexOf(".")>-1){
            pow_n = str.length-str.indexOf(".")-1;
        }
        return Math.pow(10,pow_n);
    };


    return {
        //乘法 a*b
        multiplication:function(a,b){
            if(typeof(a) == "number" && typeof(b) == "number"){
                var temp_a = pows(a),
                    temp_b = pows(b),
                    new_a = a*temp_a,
                    new_b = b*temp_b;

                return new_a*new_b/temp_a/temp_b;
            }else{
                bens.log("multiplication 参数不是数字");
                return 0;
            }
        },
        //除法 a/b
        division:function(a,b){
            if(typeof(a) == "number" && typeof(b) == "number"){
                var temp_a = pows(a),
                    temp_b = pows(b),
                    new_a = a*temp_a,
                    new_b = b*temp_b;

                return new_a/new_b/temp_a*temp_b;
            }else{
                bens.log("division 参数不是数字");
                return 0;
            }
        }
    }



})();
