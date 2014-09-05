/*
 * Filename : 
 * =====================================
 * Created with WebStorm.
 * User: bens
 * Date: 14-2-21
 * Time: 上午9:06
 * Email:5878794@qq.com
 * =====================================
 * Desc:  网站通用js
 */

//console = console || {};
//console = {};
//console.log = function (msg) {

//};




$(document).ready(function () {

    //获取在线人数
    // OnlineCount();
    //ie去除a标签的虚线框
    $("a").attr({ hidefocus: true });


    //$('#nav3').find(".top3_nav_list").hover(function () {
    //    var obj = $(this).find("ul");
    //    obj.stop(true, true);
    //    obj.slideDown(200);
    //    $(this).children('a:first').css({
    //        background:"#E43B3E",
    //        color:"#fff",
    //        display: "block",
    //        "text-decoration":"none"
    //    });
    //}, function () {
    //    var obj = $(this).find("ul");
    //    obj.stop(true, true);
    //    obj.slideUp(100);
    //    $(this).children('a:first').css({
    //        background: "",
    //        color: "#000",
    //        display: "block"
    //    });
    //});

    //导航栏选中
    function JudgPos() {
        var location = window.location.href;
        var index = 0;
        switch (true) {
            case location.indexOf("CountDown") != -1:
                index = 1;
                break;
            case location.indexOf("Exchange") != -1:
                index = 2;
                break;
            case location.indexOf("Information") != -1:
                index = 3;
                break;
            case location.indexOf("Special") != -1:
                index = 4;
                break;
            case location.indexOf("activity_5_15") != -1:
                index = 4;
                break;
            case location.indexOf("activity_5_27") != -1:
                index = 4;
                break;
            case location.indexOf("Activity_GreatestLove") != -1:
                index = 4;
                break;
            case location.indexOf("game") != -1:
                index = 5;
                break;
            case location.indexOf("ScratchCard") != -1:
                index = 5;
                break;
            case location.indexOf("Merchant") != -1:
                index = 6;
                break;
        }

        $("#nav3").find(".top3_black_nav").eq(index).css({
            background: "#E43B3E",
            color: "#fff",
            display: "block",
            "text-decoration": "none"
        });

        $('#nav3').find(".top3_nav_list").each(function (i) {
            $(this).attr("data-index", i);
        });
        //导航下拉菜单
        $('#nav3').find(".top3_nav_list").hover(function () {
            var data_index = $(this).attr("data-index");
            if (data_index == index) {

            } else {
                var obj = $(this).find("ul");
                obj.stop(true, true);
                obj.slideDown(200);
                $(this).children('a:first').css({
                    background: "#E43B3E",
                    color: "#fff",
                    display: "block",
                    "text-decoration": "none"
                });
            }
            
        }, function () {
            var data_index = $(this).attr("data-index");
            if (data_index == index) {
                return false;
            } else {
                var obj = $(this).find("ul");
                obj.stop(true, true);
                obj.slideUp(100);
                $(this).children("a:first").css({
                    background: "",
                    color: "#000",
                    display: "block",
                });
            }
        });
    }
    JudgPos();

    //生成日历 初始化
    show_dateTime.interval({
        clickFunction: function (now_time) {       //点击签到日  now_time为签到的日期
            bodyLoading.show();
            $.ajax({
                type: "post",
                url: "/home/bookin",
                success: function (data) {
                    bodyLoading.close();
                    if (data != null && data != undefined) {
                        if (data.StatusCode == 1) {
                            TGO.winMsg(data.Msg,function(){
                                show_dateTime.selected([now_time]);
                            });
                            //showBg_SignIn(1, data.Msg);
                        }
                        if (data.StatusCode == 0) {
                            TGO.winMsg(data.Msg);
//                            showBg_SignIn(0, data.Msg);
                        }
                        if (data.StatusCode == -1) {
                            window.location.href = "/home/signin?ReturnUrl=/";
                        }
                    }
                },
                error: function () {
                    bodyLoading.close();
                    TGO.winMsg("连接错误");
                }
            });
        }
    });
    //日历签到状态绑定
    bodyLoading.show();
    $.ajax({
        type: "get",
        cache: false,
        url: "/home/bookindays?v=" + Math.random(),
        success: function (data) {
            bodyLoading.close();
            show_dateTime.selected(data);
        },
        error: function () {
            bodyLoading.close();
            TGO.winMsg("连接错误");
        }
    });

    //回顶部按钮
    $("#right_go_top").click(function () {
        $("html,body").animate({ scrollTop: 0 }, 1000);
        //$(window).scrollTop(0);
    });
    
    //$(".top").bind("click", function () {
    //    var day = $("#day");
    //    var isshow = day.is(":hidden")
    //    $("#right__sign_in").trigger("click");
    //})

    $("#day").click(function (e) {
        e.stopPropagation()
        //return false;
    });
    //签到按钮
    $("#right__sign_in").click(function () {
        var day = $(".menu_fix_left_zoom_day");
        var isshow = day.is(":hidden")
        var menu_fixed_left = $(".menu_fixed_left");
        if (isshow) {
            zoom_Close();
            day.stop(true,true);
            day.animate({"width": 223, "height": 220,"left":-242,"bottom":0 },400);
            day.css("display","block");
        } else {
            //day.animate({ "width": 0, "height": 0, "left": -130, "bottom": 110 }, 1000);
            day.css({ "width": 0, "height": 0, "left": -130, "bottom": 110,"display":"none"});
        }
        return false;
    });
    //二维码
    $("#right__code").click(function (e) {
        var code = $(".menu_fix_left_zoom");
        var isshow = code.is(":hidden");
        if (isshow) {
            zoom_Close();
            code.stop(true,true);
            code.animate({ "width": 182, "height": 200,"left":-194,"bottom":-11 }, 400);
            code.css("display", "block");
        } else {
            //code.animate({ "width": 0, "height": 0, "left": -122, "bottom": 89 }, 1000);
            code.css({ "width": 0, "height": 0, "left": -103, "bottom": 89, "display": "none" });
        }
        return false;
    });
    function zoom_Close() {
        var day = $(".menu_fix_left_zoom_day");
        var code = $(".menu_fix_left_zoom");
        day.stop(true,true);
        code.stop(true,true);

        day.css({ "width": 0, "height": 0, "left": -130, "bottom": 110 });
        code.css({ "width": 0, "height": 0, "left": -103, "bottom": 89, "display": "none" });
    }
    //点击其他地方隐藏签到日期
    $(document).bind("click", function (e) {
        var day = $(".menu_fix_left_zoom_day");
        var code = $(".menu_fix_left_zoom");
        //day.animate({ "width": 0, "height": 0, "left": -130, "bottom": 110 }, 1000);
        //code.animate({ "width": 0, "height": 0, "left": -122, "bottom": 89 }, 1000, function () {
        //    code.css("display", "none");
        //});
        day.css({ "width": 0, "height": 0, "left": -130, "bottom": 110 });
        code.css({ "width": 0, "height": 0, "left": -103, "bottom": 89, "display": "none" });

        //var isshow = day.is(":hidden")
        //var menu_fixed_left = $(".menu_fixed_left");
        //var target = $(e.target);
        //if (!isshow) {
        //    if (target.closest(".day").length == 0 && target.closest("#right__sign_in").length == 0) {
        //        $("#right__sign_in").click();
        //    }
        //}
        
    })

    //$(window).scrollTop(2000)


    //var sina = $(".sina");
    //sina.click(function () {
    //    showBg('dialog_share_sina')
    //})

    //var qq_blog = $(".qq_blog");
    //qq_blog.click(function () {
    //    showBg('dialog_share_qq_blog')
    //})

    //var qq_space = $(".qq_space");
    //qq_space.click(function () {
    //    showBg('dialog_share_qq_space')
    //})

    //边框颜色

    var nowreturnBrowser = returnBrowser();
    if (nowreturnBrowser.ie && nowreturnBrowser.ie < 8) {
        //ie7下不支持$("input[type='text']")
    } else {
        var input_text = $("input[type='text']");


        input_text.each(function () {
            input_text.focus(function () {
                $(this).css({ "border": "solid 2px #4ABADB" });
            }).blur(function () {
                $(this).css({ "border": "solid 2px #CDCCCC" });
            });
        })

        var input_text = $("input[type='Password']");
        input_text.each(function () {
            input_text.focus(function () {
                $(this).css({ "border": "solid 2px #4ABADB" });
            }).blur(function () {
                $(this).css({ "border": "solid 2px #CDCCCC" });
            });
        })
    }


    //        var input_text = $("input[type=text]");
    //if (input_text.length > 0) {
    //    input_text.focus(function () {
    //        $(this).css({ "border": "solid 2px #4ABADB" });
    //    }).blur(function () {
    //        $(this).css({ "border": "solid 2px #CDCCCC" });
    //    });
    //}

    //var input_password = $("input[type=password]");
    //if (input_password.length > 0) {
    //    input_password.focus(function () {
    //        $(this).css({ "border": "solid 2px #4ABADB" });
    //    }).blur(function () {
    //        $(this).css({ "border": "solid 2px #CDCCCC" });
    //    });
    //}


    var input_textarea = $("textarea");
    if (input_textarea.length > 0) {
        input_textarea.focus(function () {
            $(this).css({ "border": "solid 1px #4ABADB" });
        }).blur(function () {
            $(this).css({ "border": "solid 1px #CDCCCC" });
        });
    }

    //抢购提醒设置
    $("#countdownremind").click(function () {
        bodyLoading.show();
        var _countdownid = $(".countdownid").val();
        if (_countdownid != "") {
            $.ajax({
                type: "POST",
                data: { countdown: _countdownid },
                dataType: "json",
                url: '/CountDown/AddCountDown',
                success: function (data) {
                    bodyLoading.close();
                    if (data.StateCode == 1)//新增成功
                    {
                        if (data.Data != null && data.Data != "") //存在最新提醒
                        {
                            //调用锋哥的方法
                            showNotice.addNewData(data.Data)
                        }
                        TGO.winMsg(data.Message);
                    }
                    else if (data.StateCode == -1) //用户未登陆
                    {
                        TGO.winMsg(data.Message,function(){
                            location.href = "/Home/SignIn?ReturnUrl=/CountDown/Index";
                        });
                    }
                    else //新增失败
                    {
                        TGO.winMsg(data.Message);
                    }
                },
                error: function () {
                    bodyLoading.close();
                    TGO.winMsg("无法连接服务器");
                }
            })
        }
    });

});


/*图片切换
调用格式$('.banner').imgtransition({
        speed:3000,  //图片切换时间
        animate:1000 //图片切换过渡时间
    });*/
$.fn.imgtransition = function (o) {
    var defaults = { speed: 5000, animate: 1000 }
    o = $.extend(defaults, o);
    this.each(function () {
        var arr_e = $("li", this);
        function shownext() {
            var active = arr_e.filter(".active").length ? arr_e.filter(".active") : arr_e.first();
            var next = active.next().length ? active.next() : arr_e.first();
            active.css({ "z-index": 9 });
            next.css({ opacity: 0.0, "z-index": 10 }).addClass("active").animate({ opacity: 1.0 }, o.animate, function () {
                active.removeClass("active").css({ "z-index": 8 });
            })
        }
        arr_e.css({ "z-index": 9 });
        setInterval(shownext, o.speed);
    })
}



//用于获取切换当前是第几个。
function getpara(tabindex)//获取参数的函数
{
    var url = document.URL;
    var para = "";
    var t = "";
    if (url.lastIndexOf("?") > 0) {
        para = url.substring(url.lastIndexOf("?") + 1, url.length);
        var arr = para.split("&");
        para = "";
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].split("=")[0] == tabindex) {
                t = arr[i].split("=")[1]
            }
            para += "第" + (i + 1) + "个参数>>名:" + arr[i].split("=")[0];
            para += " 值:" + arr[i].split("=")[1] + "<br>";
        }
        //document.write(para);
    }
    else {
        // document.write("没有参数!");
    }
    return t;

}


function showBg_SignIn(status, content) {
    var str = "";
    if (status == 1) {
        str = "<img src=\"/image/true.png\" />" + content;
    }
    else {
        str = "<img src=\"/image/flase.png\" />" + content;
    }
    $("#signin_p").html(str);
    showBg('dialogSignIn')
}



//显示弹出窗，先加载一个<div id='convert_integral_dialog' class='showdialog'><img src='image/close2.png' class='dialogimg'  /></div>，然后加载ajax返回内容。注：此函数里面的内容样式需自己编写。
function show_dialog(obj, showBefore, closed) {
    $("#convert_integral_dialog").remove();
    $("body").append("<div id='convert_integral_dialog' class='showdialog'><img src='/image/close2.png' class='dialogimg'  /><div class='showdialog_main_div'></div></div>");
    var main_div =  $("#convert_integral_dialog").find(".showdialog_main_div");
    if (typeof obj == "string")
        main_div.append(obj);
    else
        $(obj).appendTo(main_div);
    if (typeof showBefore != "undefined" && $.isFunction(showBefore)) showBefore();
    showBg('convert_integral_dialog')
    $(".dialogimg").click(function () {
        $(this).parent().hide();
        $("#fullbg").css("display", "none");
        if (typeof closed != "undefined" && $.isFunction(closed)) closed();
    })
}

function close_dialog() {
    $("#convert_integral_dialog").remove();
    $("#fullbg").css("display", "none");
}

//显示灰色JS遮罩层  
function showBg(ct) {
    $("#fullbg").css({ display: "block" });
    var tempDiv = $("#" + ct);
    var tempDivHeight = tempDiv.outerHeight();
    var tempDivWidth = tempDiv.outerWidth();
    tempDiv.css({ "margin-left": (0 - tempDivWidth / 2), "margin-top": (0 - tempDivHeight / 2), display: "block" });
}

//加入收藏、设为首页
function addFavorite() {
    if (document.all) {
        try {
            window.external.addFavorite(window.location.href, document.title);
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }

    } else if (window.sidebar) {
        window.sidebar.addPanel(document.title, window.location.href, "");
    } else {
        alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
}

//关闭灰色JS遮罩层和操作窗口  
function closeBg(ct) {
    $("#fullbg").css("display", "none");
    $("#" + ct).css("display", "none");
}

//获取页面内容
function ShowShare(_sharetype) {
    bodyLoading.show();
    var _url = window.location.href;
    if ($(".share-content").length > 0) {
        $.ajax({
            type: "POST",
            data: { sharetype: _sharetype, url: _url, shareid: $(".shareid").html(), sharetitle: $(".sharetitle").html(), sharedescription: $(".sharedescription").html(), shareimage: $(".shareimage").html() },
            dataType: "json",
            url: '/Shared/ShareViewPageYes',
            success: function (data) {
                if (data == "ClickSuccess")
                    bodyLoading.close();
                window.open('/Public/ShareViewPage', null, 'height=420,width=610,top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
            },
            error: function () {
                bodyLoading.close();
                TGO.winMsg("无法连接服务器");
            }
        })
    } else {
        $.ajax({
            type: "POST",
            data: { sharetype: _sharetype, url: _url, shareid: null, sharetitle: null, sharedescription: null, shareimage: null },
            dataType: "json",
            url: '/Shared/ShareViewPageYes',
            success: function (data) {
                if (data == "ClickSuccess")
                    bodyLoading.close();
                window.open('/Public/ShareViewPage', null, 'height=420,width=610,top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
            },
            error: function () {
                bodyLoading.close();
                TGO.winMsg("无法连接服务器");
            }
        })
    }
}

//我的宝贝，分享
function SharePro(_sharetype, pname) {
    bodyLoading.show();
    var _url = pname;
    var sharetitle; //标题
    var sharedescription;//内容
    var shareimage;//图片
    sharetitle = $("#baby_" + pname).find(".sharetitle").html();
    sharedescription = $("#baby_" + pname).find(".sharedescription").html();
    shareimage = $("#baby_" + pname).find(".shareimage").html();
    $.ajax({
        type: "POST",
        data: { sharetype: _sharetype, url: _url, shareid: pname, sharetitle: sharetitle, sharedescription: sharedescription, shareimage: shareimage },
        dataType: "json",
        url: '/Member/ShareView',
        success: function (data) {
            if (data == "ClickSuccess")
                bodyLoading.close();
            window.open('/Public/ShareViewPage', null, 'height=420,width=610,top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        },
        error: function () {
            bodyLoading.close();
            TGO.winMsg("无法连接服务器");
        }
    })
}

//专题活动，分享
function ShareSpecial(_sharetype, pname) {
    bodyLoading.show();
    var _url; //URL路径
    var sharetitle; //标题
    var sharedescription;//内容
    var shareimage;//图片
    _url = $("#baby_" + pname).find(".shareUrl").html();
    sharetitle = $("#baby_" + pname).find(".sharetitle").html();
    sharedescription = $("#baby_" + pname).find(".sharedescription").html();
    shareimage = $("#baby_" + pname).find(".shareimage").html();
    $.ajax({
        type: "POST",
        data: { sharetype: _sharetype, url: _url, shareid: pname, sharetitle: sharetitle, sharedescription: sharedescription, shareimage: shareimage },
        dataType: "json",
        url: '/Special/ShareView',
        success: function (data) {
            if (data == "ClickSuccess")
                bodyLoading.close();
            window.open('/Public/ShareViewPage', null, 'height=420,width=610,top=' + (screen.height - 500) / 2 + ',left=' + (screen.width - 800) / 2 + ',toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
        },
        error: function () {
            bodyLoading.close();
            TGO.winMsg("无法连接服务器");
        }
    })
}

//$(function () {
//    OnlineCount();
//});
////获取在线人数
//function OnlineCount() {
//    $.get("/Public/OnlineCount?time=" + (new Date()).getTime(), function (data) {
//        $(".top_online").show().find(".red").html(data).animate({ "font-size": "24px" }, "slow").animate({ "font-size": "16px" }, "slow");
//    });
//}
//setInterval(OnlineCount, 10000);

//获取验证码倒计时。
var temp_time = 60;
function timeDown(seconds) {
    var temps = seconds || temp_time
    temp_time = temps * 1000;
    timeDownNext(temp_time)
}

function timeDownNext(seconds) {
    if (temp_time > 0) {
        $(".verify_text2").css({ "display": "inline-block" }).html(temp_time / 1000);
        $(".verify_text").css({ "display": "none" });
        setTimeout(timeDownNext, 1000)
        temp_time -= 1000;
    } else {
        $(".verify_text2").css({ "display": "none" });
        $(".verify_text").html("重新发送").css({ "display": "inline-block" });
        temp_time = 60;
    }
}


var bodyLoading = {
    'divid': 'bodyLoadingFullDiv',
    'show': function () {
        var text = arguments[0] ? arguments[0] : '';
        $("body").append("<div style='position:fixed;_position:absolute;left:0;top:0;right:0;bottom:0;background:#CCCCCC;z-index:4999;opacity:0.5;filter:alpha(opacity=50);text-align:center' id='" + this.divid + "'><div style='padding:10px;position:fixed;top:50%;padding:10px;left:50%;margin:-10px 0 0 -10px;'><img src='/image/load.gif' width=50 height=63 /><br />" + text + "</div></div>");

    },
    'close': function () {
        $("#bodyLoadingFullDiv").remove();
    }
};



var uploadFile = {
    inputId: null,           //输入框id   str
    types: null,             //支持的文件类型   "jpg,jpeg,png"
    maxSize: null,           //number  上传文件最大字节
    src: null,               //上传地址  新浏览器用
    src1: null,              //        老浏览器用
    formId: null,            //表单id
    maxNumber: 5,            //最大上传数量

    error: null,             //fn     出错显示
    showImg: null,           //fn     显示图片
    progress: null,          //fn     上传进度
    oneSuccess: null,        //fn     上传成功1个
    complete: null,          //fn     上传全部成功
    uploadError: null,       //fn     上传时错误
    changeFn: null,           //fn     选择文件后

    cache: [],               //对象缓存
    errors: [],              //错误缓存
    srcs: {},                //server back srcs
    init: function (datas) {
        this.inputId = datas.id;
        this.types = datas.types;
        this.error = datas.error;
        this.maxSize = datas.maxSize;
        this.showImg = datas.showImg;
        this.src = datas.src;
        this.src1 = datas.src1;
        this.progress = datas.progress;
        this.oneSuccess = datas.oneSuccess;
        this.complete = datas.complete;
        this.uploadError = datas.uploadError;
        this.formId = datas.formId;
        this.maxNumber = datas.maxNumber;
        this.changeFn = datas.changeFn;

        this.addEvent();
    },
    addEvent: function () {
        var _this = this;
        $("#" + this.inputId).change(function (e) {

            _this.inputChange(this, e);
        });
    },
    getId: (function () {
        var a = 0;
        return function () {
            a++;
            return a;
        }
    })(),
    checkSupport: function () {
        var form = false;
        try {
            new FormData();
            new FileReader();
            new XMLHttpRequest();
            form = true;
        } catch (e) {
            form = false;
        }
        return form;
    },
    checkFileType: function () {
        var value = $("#" + this.inputId).val(),
            type = value.substr(value.lastIndexOf(".") + 1).toLocaleLowerCase(),
            types = "," + this.types + ",";

        return (types.indexOf("," + type + ",") > -1);
    },
    inputChange: function (obj, e) {
        if ($("#" + this.inputId).val() == "") {
            return;
        }

        var pass = this.checkFileType(),
            support = this.checkSupport();

        if (!pass) {
            this.errorFn("文件格式不对");
            return;
        }



        if (support) {
            //支持ajax上传
            this.readFile(obj, e);
        } else {

            if (!this.changeFn()) {
                this.errorFn("超过上传图片最大数量");
                return;
            }
            //老浏览器
            this.createIframe();
        }
    },
    readFile: function (obj, e) {
        var file = obj.files[0],
            checkSize = (file.size <= this.maxSize),
            _this = this;

        if (!checkSize) {
            this.errorFn("文件大小超出限制");
            return;
        }

        if (!this.changeFn()) {
            this.errorFn("超过上传图片最大数量");
            return;
        }

        var reader = new FileReader();
        reader.onloadend = function () {
            _this.showFile(this, file);
        };
        reader.readAsDataURL(file);
    },
    showFile: function (file, obj) {
        var src = file.result;

        var id = this.getId();
        this.cache.push({ file: obj, id: id });

        this.reCreateInput();
        this.showImg(src, id);
    },
    upload: function () {
        var _this = this,
            n = 0;

        //if (this.cache.length == 0) {
        //    _this.error("您还没有选择图片");
        //    return;
        //}

        var upload_file = function (file, id, number) {
            var formData = new FormData();
            formData.append('files', file);


            var xhr = new XMLHttpRequest(),
                t = new Date().getTime();
            xhr.open('POST', _this.src + "?t=" + t, true);

            xhr.onload = function (e) {
                var response = JSON.parse(e.currentTarget.responseText),
                    id = _this.cache[n].id,
                    file_name = file.name;


                var isSuccess = _this.oneSuccess(response, id);
                if (isSuccess) {
                    _this.cache[n].success = true;
                    _this.srcs[id] = response.Url;
                } else {
                    _this.errors.push({
                        file_name: file_name,
                        id: id,
                        n: n,
                        response: response
                    })
                }
                n++;
                go();
            };


            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var total = e.total,
                        loaded = e.loaded,
                        id = _this.cache[n].id;
                    _this.progress(total, loaded, id);
                }
            };


            xhr.onerror = function (e) {
                var id = _this.cache[n].id,
                    file_name = file.name;

                _this.errors.push({
                    file_name: file_name,
                    id: id,
                    n: n,
                    response: {}
                })
            };


            xhr.send(formData);
        };

        var go = function () {
            if (_this.cache.length == n) {
                _this.success();
            } else {
                var temp = _this.cache[n],
                    file = temp.file,
                    id = temp.id,
                    isSuccess = temp.success;

                if (isSuccess) {
                    n++;
                    go();
                } else {
                    upload_file(file, id, n);
                }
            }
        };

        go();
    },
    createIframe: function () {
        var iframe = $("<iframe name='__bens_iframe_name__' id='__bens_iframe__' width='0' height='0' frameborder='0' ></iframe>"),
            form = $("#" + this.formId),
            t = new Date().getTime();

        form.attr({
            target: "__bens_iframe_name__",
            action: this.src1 + "?t=" + t,
            enctype: "multipart/form-data",
            method: "post"
        });
        $("body").append(iframe);

        //            $("#"+this.inputId).wrap(form);
        //            $(form).append("<input type='text' value='123' name='test1'>");

        bodyLoading.show();
        form.submit();



    },
    success: function () {
        if (this.errors.length == 0) {
            //全部成功
            var srcs = "";
            for (var key in this.srcs) {
                srcs += "," + this.srcs[key];
            }
            srcs = srcs.substr(1);

            this.complete(srcs);
        } else {
            this.uploadError(this.errors);
            this.errors = [];
        }
    },
    delOne: function (id) {
        var new_array = [];
        for (var i = 0, l = this.cache.length; i < l; i++) {
            if (this.cache[i].id != id) {
                new_array.push(this.cache[i]);
            }
        }
        this.cache = new_array;


        var new_obj = {};
        for (var key in this.srcs) {
            if (key != id) {
                new_obj[key] = this.srcs[key];
            }
        }
        this.srcs = new_obj;

    },
    oldSuccess: function (rs) {
        //rs = rs.Status

        bodyLoading.close();
        if (rs.Status != 1) {
            //失败
            this.errorFn(rs.Msg);
            return;
        }

        var src = rs.Url,
            id = this.getId();

        this.srcs[id] = src;
        this.reCreateInput();
        this.showImg(src, id);

        this.oneSuccess(rs);


    },
    errorFn: function (msg) {
        this.reCreateInput();
        this.error(msg);
    },
    reCreateInput: function () {
        var _this = this,
            input = $("#" + this.inputId),
            clone = input.clone();

        clone.insertBefore(input);
        input.unbind("change");
        input.remove();

        clone.change(function (e) {
            _this.inputChange(this, e);
        });
    }

};

var getNewImageSize = function (imgwidth, imgheight, objwidth, objheight) {
    var newimgwidth, newimgheight;

    if (imgwidth > 0 && imgheight > 0) {
        if (imgwidth / imgheight >= objwidth / objheight) {
            if (imgwidth > objwidth) {
                newimgwidth = objwidth;
                newimgheight = imgheight * objwidth / imgwidth;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        } else {
            if (imgheight > objheight) {
                newimgheight = objheight;
                newimgwidth = imgwidth * objheight / imgheight;
            } else {
                newimgwidth = imgwidth;
                newimgheight = imgheight;
            }
        }
    }

    return {
        width: newimgwidth,
        height: newimgheight
    }
};



if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                    this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
                Number.prototype.toJSON =
                        Boolean.prototype.toJSON = function (key) {
                            return this.valueOf();
                        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            gap,
            indent,
            meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            },
            rep;


    function quote(string) {


        escapable.lastIndex = 0;
        return escapable.test(string) ?
                '"' + string.replace(escapable, function (a) {
                    var c = meta[a];
                    return typeof c === 'string' ? c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                }) + '"' :
                '"' + string + '"';
    }


    function str(key, holder) {


        var i,          // The loop counter.
                k,          // The member key.
                v,          // The member value.
                length,
                mind = gap,
                partial,
                value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                            gap ? '[\n' + gap +
                                    partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                                    '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                        gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                                mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
                    test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                        walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


(function () {
    var icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NjY4NkJBOERCNEUxMUUzQTgwNEQxODY0NkZFNjg3MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NjY4NkJBOURCNEUxMUUzQTgwNEQxODY0NkZFNjg3MyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg2Njg2QkE2REI0RTExRTNBODA0RDE4NjQ2RkU2ODczIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg2Njg2QkE3REI0RTExRTNBODA0RDE4NjQ2RkU2ODczIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TH7r+gAAAPBJREFUeNqMkksOwVAUhg8DE7qAItbiMbUDItgBM2IDxNg6RK2lmBpJzDwaDNR/5G+cVD1O8rX3/Pe8bnslDEMxuGAMfHAhPjXXxtqkDjiFn+0I2vHEhgnwQA04RNdL7t0Z+0zMgzM3RmYCtZLxR9Q01lVhQmERO288UTiN2kSdNZ3KH4lV6n4Kj6uIZIADTvIyHETqYAf2YMuYA7hqlRur5BI6Rjaj5tC/fBs1iQpjV2m09ThaT35bn29PqxRBwEqDL92G5ncUIrFlzjMHZZAlZWqRNeNXrms6J1nAa/l2V6Oxp2DDr33jWrWCjX0IMAD9VU3a287DCgAAAABJRU5ErkJggg==",
            close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMTQ5NTVCNURCRjcxMUUzOTU4M0Y4MDBCOEJENzg0QyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMTQ5NTVCNkRCRjcxMUUzOTU4M0Y4MDBCOEJENzg0QyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkYxNDk1NUIzREJGNzExRTM5NTgzRjgwMEI4QkQ3ODRDIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkYxNDk1NUI0REJGNzExRTM5NTgzRjgwMEI4QkQ3ODRDIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+lj7/TwAAAHhJREFUeNqs0UsKgDAMBNDgzZLbejY33iBmkYK2+RYLA0UyD2KBmUFySlDvnaB2YXwgydXEUDv0hrrYB5mhKrYgFpRhJuJBHuYiETRjIZJBA7s1FM0e8NcprEbTvbWaVaTuz44KVH3+dAVvpou4szuI2dlFFuwRYACwZlB495lruAAAAABJRU5ErkJggg==";

    window.showNotice = {
        src: null,                   //ajax请求地址

        isFocus: true,

        isShow: ",",                 //是否已显示
        mainDiv: null,

        init: function (src, interval_time) {

            if (document.cookie.indexOf(".TGShop=") == -1) {
                return
            }



            interval_time = interval_time || 10000;
            this.src = src;

            this.createMainDiv();
            this.winEventAdd(interval_time);


            var isNeed = this.needAjax();

            if (isNeed) {
                //请求数据
                this.localData.removeItem("notice");
                this.localData.removeItem("time");
                this.localData.setItem("isOver", "0");
                this.getData();
            }
        },
        //添加窗口事件
        winEventAdd: function (interval_time) {
            var _this = this;
            window.onfocus = function () {
                _this.isFocus = true;
            };
            window.onblur = function () {
                _this.isFocus = false;
            };
            window.onbeforeUnload = function () {
                var ajaxing = _this.localData.getItem("ajaxing");
                if (ajaxing == "true") {
                    _this.localData.setItem("ajaxing", "false");
                }
            };
            window.onfocus();
            setInterval(function () {
                _this.checkLocalData();
            }, interval_time);
            _this.checkLocalData();
        },
        //是否需要主动请求
        needAjax: function () {
            var local = window.location.search;
            if (!local) { return false; }

            local = local.substr(1);
            local = local.split("=");
            local = "," + local.join(",") + ",";
            local = local.toLocaleLowerCase();


            return (local.indexOf(",first,") > -1);
        },
        //请求数据
        getData: function (time) {
            this.localData.setItem("ajaxing", "true");

            var _this = this;
            time = time || "";

            $.ajax({
                type: "get",
                cache: false,
                url: _this.src,
                data: { datetime: time },
                contentType: "application/json",
                dataType: "json",
                timeout: 30000,
                success: function (rs) {
                    _this.localData.removeItem("ajaxing");

                    if (rs.StateCode == 1) {
                        //成功
                        var data = rs.Data || [];
                        if (data.length == 0) {
                            _this.localData.setItem("isOver", "1");
                        } else {
                            _this.save(data);
                        }

                    } else {
                        //失败
                        var msg = rs.Message;
                    }

                },
                error: function (e) {
                    _this.localData.removeItem("ajaxing");
                    var status = e.status;
                    if (status == 500) {
                        return;
                    }


                }
            });


        },
        //保存数据方法
        localData: {
            userData: null,

            name: location.hostname,

            init: function () {
                if (!this.userData) {
                    try {
                        this.userData = document.createElement('INPUT');
                        this.userData.type = "hidden";
                        this.userData.style.display = "none";
                        this.userData.addBehavior("#default#userData");
                        document.body.appendChild(this.userData);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        this.userData.expires = expires.toUTCString();
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            },

            setItem: function (key, value) {
                if (window.localStorage) {
                    this.removeItem(key);
                    window.localStorage[key] = value;
                } else {
                    if (this.init()) {
                        this.userData.load(this.name);
                        this.userData.setAttribute(key, value);
                        this.userData.save(this.name);
                    }
                }
            },

            getItem: function (key) {
                if (window.localStorage) {
                    return window.localStorage[key];
                } else {
                    if (this.init()) {
                        this.userData.load(this.name);
                        return this.userData.getAttribute(key)
                    }
                }
            },

            removeItem: function (key) {
                if (window.localStorage) {
                    window.localStorage.removeItem(key);
                } else {
                    if (this.init()) {
                        this.userData.load(this.name);
                        this.userData.removeAttribute(key);
                        this.userData.save(this.name);
                    }
                }
            }
        },
        //保存数据
        save: function (data) {
            for (var i = 0, l = data.length; i < l; i++) {
                var id = data[i].RemindId;
                this.removeLocalData(id);
            }

            var old = this.getLocalData();
            for (var i = 0, l = data.length; i < l; i++) {
                old.push(data[i]);
            }

            old = JSON.stringify(old);
            this.localData.setItem("notice", old);
            this.checkLocalData();
        },
        //获取数据
        getLocalData: function () {
            var data = this.localData.getItem("notice") || "[]";
            return JSON.parse(data);
        },
        //删除数据
        removeLocalData: function (id) {
            var data = this.getLocalData();
            var new_data = [];
            for (var i = 0, l = data.length; i < l; i++) {
                var this_data = data[i],
                        this_id = this_data.RemindId;

                if (this_id != id) {
                    new_data.push(this_data)
                }
            }
            new_data = JSON.stringify(new_data);
            this.localData.setItem("notice", new_data);
        },
        //检查本地数据
        checkLocalData: function () {
            if (document.cookie.indexOf(".TGShop=") == -1) {
                return
            }


            var data = this.getLocalData(),
                    show_number = 0;

            for (var i = 0, l = data.length; i < l; i++) {
                var this_data = data[i],
                        time = this_data.RemindFixedTime,
                        title = this_data.RemindContext,
                        src = this_data.RemindLink,
                        img_src = this_data.RemindSupplement,
                        type = this_data.RemindTextType,  //0 抢购  1自定义
                        is_read = this_data.isRead,         //是否已读  1:已读
                        now_time = new Date().getTime(),
                        id = this_data.RemindId;

                time = time.replace(/[^\d]/g, "");


                if (now_time > time) {
                    show_number++;
                    if (this.isShow.indexOf("," + id + ",") > -1) {

                    } else {
                        this.show(title, type, src, img_src, id);
                    }
                }
            }


            this.checkIsDel();

            if (show_number == data.length && this.needReGetData()) {
                var max_time = this.getMaxTime(data);
                this.reGetData(max_time);
            }



        },
        needReGetData: function () {
            var a = (this.localData.getItem("isOver") == "0"),
                    //b = this.isFocus,
                    temp = this.localData.getItem("ajaxing"),
                    c = (!temp || temp == "false");
            return (a && c);
        },
        //获取最大时间
        getMaxTime: function (data) {
            var maxTime = 0;
            for (var i = 0, l = data.length; i < l; i++) {
                var this_data = data[i],
                        time = this_data.RemindFixedTime;

                time = time.replace(/[^\d]/g, "");
                if (time > maxTime) {
                    maxTime = time;
                }
            }
            return maxTime;
        },
        //显示
        show: function (title, type, src, img_src, id) {
            this.isShow += id + ",";

            if (TGO.notification.isSuport()) {
                img_src = img_src || "/image/ts_logo.png";
                this.removeLocalData(id);
                TGO.notification.show({
                    title:"T-GO",
                    msg: title,
                    icon: img_src,
                    clickFn: function () {
                        if (src) {
                            window.location.href = src;
                        }
                    }
                })
                return;
            }



            var div = this.createItem(type),
                    height = parseInt(div.css("height")),
                    list = this.mainDiv.find("div"),
                    n = list.length,
                    _this = this;

            div.find("em").html(title);
            div.attr({
                "data-id": id
            });


            if (src) {
                div.click(function () {
                    _this.removeLocalData(id);
                    window.location.href = src;
                });
            } else {
                div.css({ cursor: "" });
            }
            div.find("span").click(function (e) {
                e.stopPropagation();
                _this.removeLocalData(id);
                div.unbind("click");
                $(this).unbind("click");
                div.remove();
            });


            this.mainDiv.css({
                display: "block"
            });

            if (n == 0) {
                this.mainDiv.append(div);
            } else {
                var first = list.eq(0);
                div.insertBefore(first);
            }

            var a = div.find("em"),
                    height_a = parseInt(a.height());
            height_a = (height_a > 24) ? 24 : height_a;
            a.css({
                "margin-top": "-" + height_a / 2 + "px",
                height: height_a + "px"
            });


            div.css({
                top: height * n + "px"
            }).animate({
                top: 0,
                opacity: 1
            }, height * n * 3);


        },
        //再次请求下一条
        reGetData: function (time) {
            time = (time == 0) ? "" : time;
            this.localData.setItem("time", time);


            this.getData(time);

        },
        //创建容器层
        createMainDiv: function () {
            var div = $("<div></div>");
            div.css({
                width: "280px",
                position: "fixed",
                right: "20px",
                bottom: "20px",
                display: "none",
                "z-index":4000
            });
            this.mainDiv = div;
            $("body").append(div);
        },
        //创建并返回列表对象
        createItem: function (type) {
            var div_bg = (type == 1) ? "#aaaaaa" : "#e4393c",
                    close_bg = (type == 1) ? "#888888" : "#c42c2f";

            var div = $("<div></div>");
            div.css({
                width: "180px",
                height: "24px",
                color: "#fff",
                opacity: 0,
                "font-size": "12px",
                position: "relative",
                padding: "13px 60px 13px 40px",
                "line-height": "12px",
                overflow: "hidden",
                cursor: "pointer",
                "background-image": "url(" + icon + ")",
                "background-repeat": "no-repeat",
                "background-position": "9px center",
                "background-color": div_bg,
                margin: "10px 0"
            });
            var text = $("<em></em>");
            text.css({
                position: "absolute",
                left: "40px",
                top: "50%",
                display: "block",
                width: "180px",
                overflow: "hidden"
            });
            var close_div = $("<span></span>");
            close_div.css({
                width: "50px",
                height: "50px",
                "background-image": "url(" + close + ")",
                "background-repeat": "no-repeat",
                "background-position": "center center",
                "background-color": close_bg,
                position: "absolute",
                top: 0,
                right: 0,
                cursor: "pointer",
                display: "block"
            });

            div.append(text).append(close_div);

            return div;
        },
        //新增加数据
        addNewData: function (rs) {
            var time = rs.RemindFixedTime,
                id = rs.RemindId;
            time = time.replace(/[^\d]/g, "");
            this.removeLocalData(id);

            var data = this.getLocalData();
            var maxTime = this.getMaxTime(data);

            if (maxTime > time || maxTime == 0) {
                this.save([rs]);
            } else {
                this.localData.setItem("isOver", "0");
            }

        },
        //检查是否有已被其他页面删除的数据
        checkIsDel: function () {
            var data = this.getLocalData(),
                    now_ids = [],
                    _this = this;

            for (var i = 0, l = data.length; i < l; i++) {
                var this_data = data[i],
                        this_id = this_data.RemindId;

                now_ids.push(this_id);
            }
            now_ids = "," + now_ids.join(",") + ",";

            var list = this.mainDiv.find("div");
            list.each(function () {
                var list_id = $(this).attr("data-id");
                if (now_ids.indexOf("," + list_id + ",") == -1) {
                    $(this).unbind("click");
                    $(this).find("span").unbind("click");
                    $(this).remove();
                }
            });
        }


    };
})();


$(document).ready(function () {
    showNotice.init("/Shared/GetRemind");
});


//判断浏览器。
function returnBrowser() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    //以下进行测试
    //if (Sys.ie) document.write('IE: ' + Sys.ie);
    //	if (Sys.firefox) document.write('Firefox: ' + Sys.firefox);
    //	if (Sys.chrome) document.write('Chrome: ' + Sys.chrome);
    //	if (Sys.opera) document.write('Opera: ' + Sys.opera);
    //	if (Sys.safari) document.write('Safari: ' + Sys.safari);
    return Sys;
}




show_dateTime = {
    obj: null,
    interval: function (datas) {
        this.obj = new rl({
            titleDiv: $("#day_title_text"),
            mainDiv: $("#day_list"),
            hangDiv: $("#day_list_hang"),
            itemDiv: $("#day_list_item"),
            hoverClass: "day_list_hover",
            selectClass: "day_list_select",
            firstRowClass: "day_list_hong",
            canNot_select_class: "day_list_not",
            myData: datas.data,


            clickFunction: datas.clickFunction
        });
    },
    selected: function (no) {
        this.obj.select(no);
    }
};


var rl = function (data) {
    this.titleDiv = data.titleDiv;
    this.mainDiv = data.mainDiv;
    this.hangDiv = data.hangDiv;
    this.itemDiv = data.itemDiv;
    this.hoverClass = data.hoverClass;
    this.selectClass = data.selectClass;
    this.firstRowClass = data.firstRowClass;
    this.canNot_select_class = data.canNot_select_class;
    this.selectData = data.myData || {};
    this.clickFunction = data.clickFunction || function () { };

    this.init();
};
rl.prototype = {
    getDayNumber: function (month, year) {
        var ar = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        ar[1] = (this.leapYear(year)) ? 29 : 28;
        return ar[month];
    },
    //判断是否是闰年
    leapYear: function (year) {
        return (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0)));
    },
    getMonthName: function (month) {
        var ar = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
        return ar[month]
    },
    getWeekName: function (week) {
        var ar = ["日", "一", "二", "三", "四", "五", "六"];
        return ar[week];
    },
    init: function () {
        var now = new Date(),       //当前日期
            year = now.getFullYear(),   //当前年份
            month = now.getMonth(), //当前月份0-11
            monthName = this.getMonthName(month), //当前月份名
            day = now.getDate(),   //当前日期 1-31
            dayNumber = this.getDayNumber(month, year),//当月天数
            firstWeek = new Date(year, month, 1).getDay(),//当月第一天星期 0-6   0:周日
            nextMonth = (month == 11) ? 0 : month + 1,//下一个月
            nextYear = (month == 11) ? year + 1 : year,//下一个月的年份
            preMonth = (month == 0) ? 12 : month - 1,//上一个月
            preYear = (month == 0) ? year - 1 : year,//上一个月的年份
            preDayNumber = this.getDayNumber(preMonth, preYear),//上一个月的天数
            preFirstShow = preDayNumber - firstWeek + 1,
            preLoop = firstWeek,
            nextLoop = 42 - preLoop - dayNumber;

        this.createPage({
            preFirstShow: preFirstShow,
            preLoop: preLoop,
            nowLoop: dayNumber,
            nextLoop: nextLoop,
            year: year,
            preYear: preYear,
            nextYear: nextYear,
            month: month,
            nextMonth: nextMonth,
            preMonth: preMonth,
            monthName: monthName,
            day: day
        });

    },
    createPage: function (data) {
        //插入标题
        var month = data.month + 1;
        //小于10则前面加0；
        var longMonth = "0" + month;
        longMonth = longMonth.substr(longMonth.length - 2, 2);

        //小于10则前面加0；
        var preMonth = data.preMonth + 1;
        var longPreMonth = "0" + preMonth;
        longPreMonth = longPreMonth.substr(longPreMonth.length - 2, 2);

        this.titleDiv.html(data.year + "." + month);

        var item, this_hang;

        //插入星期
        this_hang = this.hangDiv.clone().css({ display: "block" }).addClass(this.firstRowClass).attr({ id: "" });
        for (var g = 0, gl = 7; g < gl; g++) {
            item = this.itemDiv.clone().css({ display: "block" }).attr({ id: "" }).html(this.getWeekName(g));
            this_hang.append(item);
        }
        this.mainDiv.append(this_hang);

        //插入天数
        var a = 0,
            preFirstShow = data.preFirstShow;

        //上个月的
        for (var i = 0, l = data.preLoop; i < l; i++) {

            if (a % 7 == 0) {
                this_hang = this.hangDiv.clone().attr({ id: "" }).css({ display: "block" });
                this.mainDiv.append(this_hang);
            }

            if (this.selectData[now_data]) {
                //已签到
                item = this.itemDiv.clone().attr({ id: "bens_add_time_" + longPreMonth + preFirstShow }).addClass(this.selectClass).css({ display: "block" }).html(preFirstShow);
            } else {
                item = this.itemDiv.clone().attr({ id: "bens_add_time_" + longPreMonth + preFirstShow }).css({ display: "block" }).addClass(this.canNot_select_class).html(preFirstShow);
            }

            this_hang.append(item);
            preFirstShow++;
            a++;
        }
        //本月
        for (var j = 0, jl = data.nowLoop; j < jl; j++) {
            if (a % 7 == 0) {
                this_hang = this.hangDiv.clone().attr({ id: "" }).css({ display: "block" });
                this.mainDiv.append(this_hang);
            }
            var now_data = j + 1;
            var long_now_data = "0" + now_data;
            long_now_data = long_now_data.substr(long_now_data.length - 2, 2);

            if (this.selectData[now_data]) {
                //已签到
                item = this.itemDiv.clone().attr({ id: "bens_add_time_" + longMonth + long_now_data }).addClass(this.selectClass).css({ display: "block" }).html(now_data);
            } else if (data.day >= now_data) {
                //未签到
                item = this.itemDiv.clone().attr({ id: "bens_add_time_" + longMonth + long_now_data }).css({ display: "block" }).html(now_data);

                var temp_class = this.hoverClass,
                    temp_fn = this.clickFunction;
                if (now_data == data.day) {
                    item.addClass("cursor").hover(function () {
                        $(this).addClass(temp_class);
                    }, function () {
                        $(this).removeClass(temp_class);
                    })
                        .click(function () {
                            var now_time = $(this).html();

                            var now_time = "0" + now_time;
                            now_time = now_time.substr(now_time.length - 2, 2);

                            temp_fn(longMonth + now_time);
                        });
                }
                else {
                    item.addClass(this.canNot_select_class);
                }
            } else {
                item = this.itemDiv.clone().css({ display: "block" }).attr({ id: "" }).addClass(this.canNot_select_class).html(now_data);
                this_hang.append(item);
            }


            this_hang.append(item);

            a++;
        }
        //下个月
        for (var k = 0, kl = data.nextLoop; k < kl; k++) {
            if (a % 7 == 0) {
                this_hang = this.hangDiv.clone().attr({ id: "" }).css({ display: "block" });
                this.mainDiv.append(this_hang);
            }
            var now_data1 = k + 1;
            item = this.itemDiv.clone().css({ display: "block" }).attr({ id: "" }).addClass(this.canNot_select_class).html(now_data1);
            this_hang.append(item);
            a++;
        }


    },
    select: function (nos) {
        nos = ($.isArray(nos)) ? nos : [];
        for (var i = 0, l = nos.length; i < l; i++) {
            var no = nos[i];
            var item = $("#bens_add_time_" + no);
            item.attr({ id: "" }).addClass(this.selectClass).removeClass("cursor").removeClass(this.hoverClass).removeClass(this.canNot_select_class).unbind("mouseenter mouseleave click");
        }
    }
};


//显示导航下拉列表。
//function all_menu_show() {
//    var nav_list = $(".nav_list");
//    nav_list.each(function (i) {
//        $(this).hover(function () {
//            nav_list.eq(i).find("li").show();
//        }, function () {
//            nav_list.eq(i).find("li").hide();
//        })
//    })
//}






var TGO = {
    hasTouch: (function () {
        return 'ontouchstart' in window;
    })(),
    start_event: (this.hasTouch) ? "touchstart" : (window.navigator.msPointerEnabled) ? 'MSPointerDown' : 'mousedown',
    move_event: (this.hasTouch) ? "touchmove" : (window.navigator.msPointerEnabled) ? 'MSPointerMove' : 'mousemove',
    end_event: (this.hasTouch) ? 'touchend' : (window.navigator.msPointerEnabled) ? 'MSPointerUp' : 'mouseup'
};
//------显示居中层
//TGO.show_center_div({
//    div:wrap,         //id,jqobj
//    closeFn:fn        //关闭执行函数
//});

//------关闭居中层
//TGO.hide_center_div();
(function () {
    var zz = null,
        div = null,
        closeFn = null;

    TGO.show_center_div = function (data) {
        if(typeof (data.div) == "object"){
            div = data.div;
        }else{
            div = $("#" + data.div);
    }
        closeFn = data.closeFn || function(){};

        zz = $("<div></div>");
        zz.css({
            width: "100%", height: "100%", position: "fixed", top: 0, left: 0, opacity: 0, background: "#000",
            "z-index": 4900
        });





        $("body").append(zz).append(div);

        var width = parseInt(div.outerWidth()),
            height = parseInt(div.outerHeight());

        div.css({
            display: "block",
            position: "fixed",
            top: "50%",
            left: "50%",
            "z-index":5000,
            "margin-top": -height / 2 + "px",
            "margin-left": -width / 2 + "px"
        });


        zz.animate({
            opacity: 0.5
        }, 500);

        zz.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            if(!data.zzNotClose){
                TGO.hide_center_div();
    }
        })

    };

    TGO.hide_center_div = function () {
        div.css({ display: "none" });
        $("body").append(div);

        zz.unbind("click");
        zz.remove();
        closeFn();
    }


})();


//创建弹出层的包裹层样式
TGO.createWrapDiv = function(){
    var div = $("<div></div>");
    div.css({
        padding:"10px",
        background:"url(/image/open_div_border_bg.png)",
        "border-radius":"5px",
        "-webkit-border-radius":"5px"
    });

    return div;

};


//chrome  firefox sarfi(apple pc) 桌面通知
TGO.notification = {
    is_support:window.Notification,
    //初始化
    initial: function () {
        if (!this.is_support) {
            return;
        }

        var _this = this,
            clickfn = null;

        $(window).click(function () {
            $(window).unbind("click");
            if (Notification.permission != "granted") {
                _this.getPermission();
                    }
        })
    },
    //获取权限
    getPermission:function(){
        if(this.is_support){
            Notification.requestPermission();
                }
    },
    //显示
    show: function (data) {
        if (!this.isSuport()) {
            return;
        }


        var title = data.title || "",
            msg = data.msg,
            icon = data.icon,
            clickFn = data.clickFn,
            obj = {};

        if (msg) {
            obj.body = msg;
    }
        if (icon) {
            obj.icon = icon;
                }

        
        var a = new Notification(title, obj);
        if (clickFn) {
            a.onclick = clickFn;
            }
            
        
    },
    isSuport: function () {
        return this.is_support && Notification.permission == "granted";
            }

        };
TGO.notification.initial();

(function(){
    var is_show = false;
    TGO.winMsg = function(msg,callback){
        if(is_show){return;}

        is_show = true;
        msg = msg || "";
        callback = callback || function(){};

        var wrap = TGO.createWrapDiv(),
            main = $("<div></div>"),
            text = $("<div></div>"),
            button = $("<div>确 定</div>");
        text.text(msg);

        button
            .click(function(){
                TGO.hide_center_div();
            })
            .hover(function(){
                $(this).css({background:"#c72a2d"});
            },function(){
                $(this).css({background:"#e4393c"});
            });

        main.css({
            width:"430px",
            background:"#fff",
            position:"relative",
            padding:"20px 0"
        });
        text.css({
            width:"90%",
            "font-size":"18px",
            color:"#000",
            "overflow":"hidden",
            "margin":"0 auto",
            "margin-bottom":"10px",
            padding:"20px 0",
            "text-align":"center"
        });
        button.css({
            width:"120px",
            height:"40px",
            background:"#e4393c",
            color:"#fff",
            "font-size":"16px",
            "text-align":"center",
            "line-height":"40px",
            cursor:"pointer",
            "margin":"0 auto"
        });

        wrap.css({width:"430px","z-index":"5000"});
        main.append(text).append(button);
        wrap.append(main);

        TGO.show_center_div({
            div:wrap,
            zzNotClose:true,
            closeFn:function(){
                is_show = false;
                button.unbind("click").unbind("hover");
                wrap.remove();
                callback();
            }
        });


    };

})();



TGO.addEvent = function (target, type, func) {
    if (target.addEventListener) {
        target.addEventListener(type, func, false);
    } else if (target.attachEvent) {
        target.attachEvent("on" + type, func);
    } else {
        target["on" + type] = func;
    }
};
TGO.removeEvent = function (target, type, func) {
    if (target.removeEventListener) {
        target.removeEventListener(type, func, false);
    } else if (target.detachEvent) {
        target.detachEvent("on" + type, func);
    } else {
        delete target["on" + type];
    }
};

(function () {
    var scroll_load = function (data) {
        this.ajaxFn = data.ajaxFn || function () { };
        this.buttonLength = data.buttonLength || 100;

        //是否加载中
        this.isLoading = false;
        //是否活动（多个加载在一个页面时使用）
        this.active = true;

        this.scrollFn = null;

        this.init();
    };
    scroll_load.prototype = {
        init: function () {
            this.addEvent();
        },
        //添加事件
        addEvent: function () {
            var _this = this;

            TGO.addEvent(window, "scroll", this.scrollFn = function () {
                _this.checkLoad();
            });
        },
        //检查是否触发加载事件
        checkLoad: function () {
            var scroll_top = parseInt($(document).scrollTop()),
                scroll_height = parseInt($("body").prop("scrollHeight")),
                win_height = parseInt($(window).height()),
                scroll_button = scroll_height - scroll_top - win_height;


            if (scroll_button < this.buttonLength && !this.isLoading && this.active) {
                this.ajaxFn();
            }
        },
        //销毁
        destroy: function () {
            TGO.removeEvent(window, "scroll", this.scrollFn);
        }
    };


    TGO.scrollLoad = function (data) {
        var _this = this;

        this.buttonLength = data.buttonLength || 100;
        this.mainDiv = data.mainDiv;
        this.showLoading = data.showLoading || true;
        this.ajaxFn = data.ajaxFn;

        this.loadObj = null;

        this.scrollFn = new scroll_load({
            ajaxFn: function () {
                _this.ajaxStart.call(_this);
            },
            buttonLength: _this.buttonLength
        });

    };
    TGO.scrollLoad.prototype = {
        ajaxStart: function () {
            var _this = this;
            _this.scrollFn.isLoading = true;

            if (_this.showLoading) {
                _this.showLoad();
            }

            _this.ajaxFn();

        },
        //显示loading
        showLoad: function () {
            var div = $("<div>加载中，请稍后！</div>");
            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            this.mainDiv.append(div);

            this.loadObj = div;
        },
        //隐藏loading
        hideLoad: function () {
            if (this.loadObj && this.loadObj.find("a").length != 0) {
                this.loadObj.find("a").unbind("click").unbind("hover");
            }

            if (this.loadObj && this.loadObj.length != 0) {
                this.loadObj.remove();
            }

            this.loadObj = null;
        },
        //加载失败显示loading
        reShowLoad: function () {
            var _this = this,
                div = $("<div>加载失败，<a>点击重试</a></div>");


            div.css({
                width: "100%",
                height: "30px",
                "line-height": "30px",
                "text-align": "center",
                color: "#000"
            });
            div.find("a").click(function () {
                _this.hideLoad();
                _this.ajaxStart();
            }).hover(function () {
                $(this).css({ color: "#999" });
            }, function () {
                $(this).css({ color: "#000" });
            });
            this.mainDiv.append(div);
            this.loadObj = div;
        },
        //ajax调用成功回调
        ajaxSuccess: function () {
            this.hideLoad();
            this.scrollFn.isLoading = false;
        },
        //ajax调用失败回调
        ajaxError: function () {
            this.hideLoad();
            this.reShowLoad();
        },
        //ajax 加载完数据
        destroy: function () {
            this.hideLoad();
            this.scrollFn.destroy();
            this.scrollFn = null;

            this.mainDiv = null;
            this.showLoading = null;
            this.ajaxFn = null;
        },
        //设置是否触发滚动加载
        setActive: function (state) {
            if (this.scrollFn) {
                this.scrollFn.active = state;
            }
        }
    };
})();

TGO.stamp2time = function (b) {
    b = b || new Date().getTime();
    var a = new Date(parseInt(b));
    var year = a.getFullYear();
    var month = parseInt(a.getMonth()) + 1;
    month = (month < 10) ? "0" + month : month;
    var date = a.getDate();
    date = (date < 10) ? "0" + date : date;
    var hours = a.getHours();
    hours = (hours < 10) ? "0" + hours : hours;
    var minutes = a.getMinutes();
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    var seconds = a.getSeconds();
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return year + "年" + month + "月" + date + "日 " + hours + ":" + minutes + ":" + seconds;
};
//css3翻转效果
var trans = function (obj, options) {
    var _this = this;
    this.obj = obj;
    this.options = options || {};
    //this.options.time = options.time || 200;
    
    this.cssInit();
};
trans.prototype = {
    //css初始化
    cssInit: function () {
        this.obj.children().first().css({
            'display': 'block',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'height': '100%',
            'WebkitTransform': 'translate3d(0,0,1px)',
            'MozTransform': 'translate3d(0,0,1px)',
            'msTransform': 'translate3d(0,0,1px)',
            'transform': 'translate3d(0,0,1px)',
            'zIndex': '100'
        });
        this.obj.children().css({
            'width': '1160px',
            'overflow': 'hidden',
            'display': 'none',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'height': '100%'
        });

    }
};
//判断是不是ipad
function is_iPad() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/iPad/i) == "ipad") {
        return true;
    } else {
        return false;
    }
}

(function () {
    var dummyStyle = document.createElement("div").style,
        vendor = (function () {
            if (window.navigator.msPointerEnabled) { return ""; }
            if ("MozTransform" in dummyStyle) { return ""; }
            var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                t = vendors[i] + 'ransform';
                if (t in dummyStyle) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
        prefixStyle = function (style) {
            if (!vendor) return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return vendor + style;
        },
        has3d = prefixStyle('perspective') in dummyStyle,
        css_s = (has3d) ? "translate3d(" : "translate(",
        css_e = (has3d) ? ",0)" : ")",


        _transform = prefixStyle('transform'),
        _transitionProperty = prefixStyle('transitionProperty'),
        _transitionDuration = prefixStyle('transitionDuration'),
        _transformOrigin = prefixStyle('transformOrigin'),
        _transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        _transitionDelay = prefixStyle('transitionDelay'),

        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
        isWindows = (window.navigator.msPointerEnabled) ? true : false,
//        isWindows = navigator.userAgent.match(/MSIE 10/i)?true:false,
//        isWindows = false,

        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor !== false,


        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : (window.navigator.msPointerEnabled) ? 'MSPointerDown' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : (window.navigator.msPointerEnabled) ? 'MSPointerMove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : (window.navigator.msPointerEnabled) ? 'MSPointerUp' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : (window.navigator.msPointerEnabled) ? 'MSPointerUp' : 'mouseup',
        TRNEND_EV = (function () {
            if (vendor === false) return "transitionend";

            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),
        nextFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),
        counter = (function () {
            var a = 0;
            return function () {
                a += 1;
                return a;
            }
        })(),
        androidVer = (function () {
            var a = navigator.appVersion,
                b = a.indexOf("Android");
            if (b >= 0) {
                var c = b + 7,
                    d = a.substr(c);
                return parseFloat(d).toFixed(1);
            } else {
                return null;
            }
        })(),
        iosVer = parseInt(navigator.userAgent.match(/[5-9]_\d[_\d]* like Mac OS X/i)),
    //TODO 获全系统版本号
        ver = (function () {
            if (isAndroid) {
                return androidVer;
            } else if (isIDevice) {
                return null;
            } else {
                return null;
            }
        })(),
        language = (navigator.browserLanguage || navigator.language).toLowerCase();
    getCssName = function (style) {
        if (isWindows) return style;

        style = cssVendor + style;
        return style;
    },
    box = (isWindows) ? "-ms-flexbox" : cssVendor + "box",
    box_shadow = getCssName("box-shadow"),
    boxPack = (isWindows) ? "-ms-flex-pack" : cssVendor + "box-pack",
    boxAlign = (isWindows) ? "-ms-flex-align" : cssVendor + "box-align",
    boxFlex = (isWindows) ? "-ms-flex" : cssVendor + "box-flex",
    boxOrient = (isWindows) ? "-ms-flex-direction" : cssVendor + "box-orient",
    boxOrientRow = (isWindows) ? "row" : "horizontal",
    boxVertical = (isWindows) ? "column" : "vertical",
    backgroundSize = getCssName("background-size"),
    transform = getCssName("transform"),
    border_radius = (isWindows || (isAndroid && androidVer == "4.2")) ? "border-radius" : cssVendor + "border-radius",
    box_sizing = getCssName("box-sizing"),
    background_clip = getCssName("background-clip"),
    border_bottom_left_radius = getCssName("border-bottom-left-radius"),
    border_bottom_right_radius = getCssName("border-bottom-right-radius"),
    border_top_left_radius = getCssName("border-top-left-radius"),
    border_top_right_radius = getCssName("border-top-right-radius"),
    backface_visibility = getCssName("backface-visibility"),
    transition = getCssName("transition"),
    transition_property = getCssName("transition-property"),
    transition_duration = getCssName("transition-duration"),
    transition_timing_function = getCssName("transition-timing-function");


    var css = {
        "box": box,
        "box-align": boxAlign,
        "box-pack": boxPack,
        "background-size": backgroundSize,
        "background-clip": background_clip,
        "box-flex": boxFlex,
        "box-orient": boxOrient,
        "horizontal": boxOrientRow,
        "vertical": boxVertical,
        "transform": transform,
        "border-radius": border_radius,
        "border-bottom-left-radius": border_bottom_left_radius,
        "border-bottom-right-radius": border_bottom_right_radius,
        "border-top-left-radius": border_top_left_radius,
        "border-top-right-radius": border_top_right_radius,
        "box-sizing": box_sizing,
        "box-shadow": box_shadow,
        "backface-visibility": backface_visibility,
        "transition": transition,
        "transition-property": transition_property,
        "transition-duration": transition_duration,
        "transition-timing-function": transition_timing_function
    },
        gz = (function () {
            var reg, a = [];
            for (var key in css) {
                if (key == "box" || key == "transition") {
                    //                a.push("([^-])box(?!-)");
                    a.push("([^-]" + key + "[^-])");
                } else if (key == "horizontal" || key == "vertical") {
                    a.push(key);
                } else {
                    a.push("([^-]" + key + ")");
                }

            }
            reg = a.join("|");
            return new RegExp(reg, "ig");
        })(),
        css_prefix = function (data) {
            var text = JSON.stringify(data),
                newtext = cssfile_prefix(text);
            return JSON.parse(newtext);
        },
        cssfile_prefix = function (data) {
            return data.replace(gz, function (a) {
                var str = a.substr(1, a.length - 2);
                if (str == "box" || str == "transition") {
                    var newstr = css[str];
                    return a.substr(0, 1) + newstr + a.substr(a.length - 1);
                } else if (a == "horizontal" || a == "vertical") {
                    return css[a];
                } else {
                    return a.substr(0, 1) + css[a.substr(1)];
                }
            });
        },
        fix_css = function (css) {
            css = css.replace(/;/ig, " ; ");
            return cssfile_prefix(css);
        };


    dummyStyle = null;



    TGO.device = {
        has3d: has3d,                //是否支持3d
        hasTouch: hasTouch,           //是否是触摸屏
        hasTransform: hasTransform,  //是否支持变形

        isAndroid: isAndroid,        //android   true false
        isIDevice: isIDevice,        //iphone，ipad
        isTouchPad: isTouchPad,      //hp
        isWindows: isWindows,        //windows phone

        RESIZE_EV: RESIZE_EV,        //窗口变化
        START_EV: START_EV,          //点击
        MOVE_EV: MOVE_EV,            //移动
        END_EV: END_EV,              //释放
        CANCEL_EV: CANCEL_EV,        //结束
        TRNEND_EV: TRNEND_EV,        //变形结束 webkitTransitionEnd
        nextFrame: nextFrame,
        cancelFrame: cancelFrame,


        touchStartMove: 10,       //触摸滚动触发距离，点击失败移动距离 px
        jg: 600,					//同一个对象点击触发时间间隔  ms
        slideTriggerLength: 10,		//长滑触发的距离 px
        slideLength: 20,			//长滑的距离?? 倍
        outRangeLength: 100,			//超出后还可以滑动的距离 px
        longClickTime: 1000,			//长按触发时间	ms
        clickdelay: 10,				//点击事件延迟触发时间  ms  touchstart
        slideTriggerMaxTime: 1000,   //滑动触发的有效时间
        //        size:deviceSize,       //设备屏幕大小   s m l     取法：  320   540分成3档
        androidVer: androidVer,       //android版本
        iosVer: iosVer,
        ver: ver,                     //系统版本
        language: language,          //语言版本  zh-cn

        counter: counter,                 //计数器  fn


        //原生的用无 -
        _transform: _transform,        //自动添加前缀
        _transitionProperty: _transitionProperty,
        _transitionDuration: _transitionDuration,
        _transformOrigin: _transformOrigin,
        _transitionTimingFunction: _transitionTimingFunction,
        _transitionDelay: _transitionDelay,

        //兼容ie10的css属性
        cssVendor: cssVendor,        //css前缀   -webkit-
        css_s: css_s,                //变形前缀    translate3d(
        css_e: css_e,                //变形后缀      ,0)
        box: box,
        box_pack: boxPack,
        box_align: boxAlign,
        box_flex: boxFlex,
        box_orient: boxOrient,
        horizontal: boxOrientRow,
        vertical: boxVertical,
        background_size: backgroundSize,
        transform: transform,
        border_radius: border_radius,
        box_sizing: box_sizing,
        box_shadow: box_shadow,
        background_clip: background_clip,
        border_bottom_left_radius: border_bottom_left_radius,
        border_bottom_right_radius: border_bottom_right_radius,
        border_top_left_radius: border_top_left_radius,
        border_top_right_radius: border_top_right_radius,
        backface_visibility: backface_visibility,
        transition: transition,
        transition_property: transition_property,
        transition_duration: transition_duration,
        transition_timing_function: transition_timing_function,

        //css自动替换
        css_prefix: css_prefix,
        cssfile_prefix: cssfile_prefix,
        fixCss: fix_css

    }



})();

