/*
 * Filename : 
 * =====================================
 * Created with JetBrains WebStorm.
 * User: bens
 * Date: 13-7-22
 * Time: 上午11:52
 * Email:5878794@qq.com
 * =====================================
 * Desc:
 */



//TODO

(function(){
    var input_cursor = bens.require("inputcursor"),
        $$ = bens.require("event");

    var SoftKeyBoard = function(data){
        this.input = bens.getDom(data.obj);


        this.init();
    };
    SoftKeyBoard.prototype = {
        init:function(){
            this.createSoftKeyboard();
            this.eventBind();

        },
        getNumber:function(){
            var a=[0,1,2,3,4,5,6,7,8,9],
                new_a=[];

            for(var i=0,l=a.length;i<l;i++){
                var max = l- i,
                    n = parseInt(Math.random()*max),
                    number = a.splice(n,1)[0];
                new_a.push(number)
            }
            return new_a;
        },
        createSoftKeyboard:function(){
            for(var i= 0;i<10;i++){
                var div = $("<div>"+i+"</div>");
                $("body").append(div);
            }

            var div1 = $("<div>back</div>");
            $("body").append(div1);

        },
        eventBind:function(){
            var objs = $("div"),
                _this = this;

            $$(objs).myclickok(function(){
                var text = $(this).text();
                _this.insertValue(text);
            })
        },
        insertValue:function(text){
            var now_position = input_cursor.getPosition({obj:"aa"});
            input_cursor.insertText({
                obj:"aa",
                start:now_position.start,
                end:now_position.end,
                text:text
            })
        }

    };


    return SoftKeyBoard;



})();