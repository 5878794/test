$.fn.countdown = function (C) {
    var A = C;
    var D = $(this);
    D.unbind("click");
    var B = setInterval(function () {
        bb = (A < 10) ? "0" + (A) : A;
        D.text("剩余" + bb + "秒");
        A--;
        if ($("#r_getcode2").attr("sstop") == "true") {
            clearInterval(B);
            D.text("重获验证码")
        }
        if (A < 0) {
            clearInterval(B);
            D.text("重获验证码");
            D.attr({"c_click": "false"}).css({color: "#000", cursor: "pointer"});
            bee_yzm.r_getcode()
        }
    }, 1000)
};
$.fn.flyup = function (F) {
    var A = $(this);
    var E = parseInt(A.width());
    var B = parseInt(A.height());
    var C = parseInt($(window).width());
    var D = parseInt($(window).height());
    A.animate({top: (D - B) / 2 + 10 + "px"}, 100, function () {
        A.animate({top: -B + "px"}, 250, function () {
            A.css({display: "none"});
            F()
        })
    })
};
$.fn.zhuce_tj = function () {
    var A = $(".box_content1");
    var B = $("#register_box").find(".box_middle");
    B.css({height: parseInt(A.height()) + "px"});
    A.fadeTo("slow", 0.5, function () {
        var E = "<div myname='bee_zctjload'></div>";
        var D = "<div myname='bee_zctjload_main'><img src='" + http_url + "Images/013.gif' /><br /><br /><span>数据提交中，请稍后！</span></div>";
        bee_register.hovers = true;
        B.append(E);
        B.append(D);
        var C = B.find("div[myname='bee_zctjload']");
        var F = B.find("div[myname='bee_zctjload_main']");
        C.css({width: "100%", height: parseInt(B.height()), position: "absolute", "text-align": "center", "background": "#fff", left: "0px", top: "0px", opacity: 0});
        F.css({position: "absolute", width: "100%", "text-align": "center", top: "200px", left: "0px"});
        bee_register.post()
    })
};
$.fn.flydown = function () {
    var A = $(this);
    var E = parseInt(A.width());
    var B = parseInt(A.height());
    var C = parseInt($(window).width());
    var D = parseInt($(window).height());
    A.css({top: -B + "px", left: (C - E) / 2 + "px", display: "block"});
    A.animate({top: (D - B) / 2 + 30 + "px"}, 500, function () {
        A.animate({top: (D - B) / 2 - 20 + "px"}, 100, function () {
            A.animate({top: (D - B) / 2 + 10 + "px"}, 50, function () {
                A.animate({top: (D - B) / 2 - 5 + "px"}, 30, function () {
                    A.animate({top: (D - B) / 2 + "px"}, 10)
                })
            })
        })
    })
};
$(window).resize(function () {
    var A = $("#register_box");
    if (A.css("display") == "block") {
        var F = parseInt(A.width());
        var B = parseInt(A.height());
        var C = parseInt($(window).width());
        var D = parseInt($(window).height());
        A.css({top: (D - B) / 2 + "px", left: (C - F) / 2 + "px"})
    }
    var E = $("#FindPwdPanel");
    if (E.css("display") == "block") {
        var F = parseInt(E.width());
        var B = parseInt(E.height());
        var C = parseInt($(window).width());
        var D = parseInt($(window).height());
        E.css({top: (D - B) / 2 + "px", left: (C - F) / 2 + "px"})
    }
});
$.fn.input_error = function (B) {
    var E = $(this).attr("id");
    var H = $(this).parent().parent();
    var G = $(this);
    var A = "<div bee_name=" + E + ' class="input_error"><div class="input_error_arrows"></div><div class="input_error_body"><div class="input_error_body_left"></div><div class="input_error_body_center">' + B + '</div><div class="input_error_body_right"></div><div style="clear:both"></div></div></div>';
    H.append(A);
    var F = H.find("div[bee_name='" + E + "']");
    F.supersleight({shim: http_url + "Images/transparent.gif"});
    F.find(".input_error_arrows").css({left: parseInt(F.width()) / 2 - parseInt(F.find(".input_error_arrows").width()) / 2 + "px"});
    if (G.attr("x") == null) {
        var C = 311 - parseInt(F.width()) / 2
    } else {
        var C = parseInt(G.attr("x")) - parseInt(F.width()) / 2
    }
    var D = G.attr("y");
    F.css({left: C + "px", top: D + "px"})
};
$.fn.input_error1 = function (D) {
    var B = $(this).attr("id");
    var G = $(this).parent().parent();
    var C = $(this);
    var F = "<div bee_name=" + B + ' class="input_error1"><div class="input_error_body_left1"></div><div class="input_error_body_center1">' + D + '</div><div class="input_error_body_right1"></div><div style="clear:both"></div><div class="input_error_arrows1"></div></div>';
    G.append(F);
    var A = G.find("div[bee_name='" + B + "']");
    A.supersleight({shim: http_url + "Images/transparent.gif"});
    var E = C.attr("y");
    A.css({right: "10px", top: E + "px"})
};
$.fn.flyleft = function () {
    var C = $(this);
    var E = parseInt(C.width());
    var D = parseInt(C.height());
    var A = parseInt($(window).width());
    var B = parseInt($(window).height());
    C.css({left: -E + "px", top: (B - D) / 2 + "px", position: "absolute", display: "block"});
    C.animate({left: (A / 2 - E * 5 / 8) + "px"}, 150, function () {
        C.animate({left: (A - E) / 2}, 400)
    })
};
$.fn.flyback = function (F) {
    var D = $(this);
    var A = parseInt(D.width());
    var E = parseInt(D.height());
    var B = parseInt($(window).width());
    var C = parseInt($(window).height());
    D.animate({left: -A + "px"}, 200, function () {
        D.css({display: "none"});
        F()
    })
};
var lxx_showbox = {};
lxx_showbox = {icos: {ok: "box_middle_ok", warn: "box_middle_warn", error: "box_middle_error", question: "box_middle_question"}, def: {type: "alert", title: "提示", msg: "是否确定此步操作？", ico: "ok", backfun: {}, ensure: "确 定", cancel: "取 消", iscover: false}, apply: function (A, C) {
    if (typeof A != "object" || typeof C != "object") {
        return
    }
    for (var B in C) {
        A[B] = C[B]
    }
    return A
}, create: function (E) {
    var C = this.apply(this.def, E);
    var D = document.createElement("div");
    if (C.iscover) {
        if ($.browser.msie && $.browser.version < 7) {
            $(D).append('<iframe frameborder="no" scrolling="no" style="width:100%; height:100%; position:absolute; top:0; left:0;z-index:10000;filter:Alpha(opacity=60); -moz-opacity:.6; opacity:0.6; background:#000;"></iframe>')
        } else {
            $(D).append('<div style="width:100%; height:100%; position:absolute; top:0; left:0;z-index:10000;filter:Alpha(opacity=60); -moz-opacity:.6; opacity:0.6; background:#000;"></div>')
        }
    }
    $(D).append('<div class="showbox" style="position:absolute;z-index:10001;"><div class="box_top"><div class="box_title" style="font-size:16px;"></div><a class="box_close" title="关闭"></a></div><div class="box_middle"><div class="box_middle_ico"></div><div class="box_middle_content"></div><div class="box_middle_btnlayer"><a class="btnSmall ensure" href="javascript:;">' + C.ensure + '</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="btnSmall cancel" href="javascript:;">' + C.cancel + '</a></div></div><div class="box_bottom"></div></div>');
    $(D).find(".box_title").append(C.title);
    $(D).find(".box_middle_content").append(C.msg);
    if (this.icos[C.ico]) {
        $(D).find(".box_middle_ico").addClass(this.icos[C.ico])
    } else {
        if (typeof this.icos[C.ico] == "string") {
            $(D).find(".box_middle_ico").html("<img src='" + C.ico + "' />")
        } else {
            $(D).find(".box_middle_ico").append(this.icos[C.ico])
        }
    }
    $(D).find(".ensure").click(function () {
        D.Close(true);
        return false
    });
    $(D).find(".cancel").click(function () {
        D.Close(false);
        return false
    });
    $(D).find(".box_close").click(function () {
        D.Close(null);
        return false
    });
    if (C.type == "alert") {
        $(D).find(".cancel").remove()
    }
    $("body").append(D);
    var B = $(D).find("div.showbox").outerWidth(), A = $(D).find("div.showbox").outerHeight();
    w2 = B / 2;
    h2 = A / 2;
    $(D).find("div.showbox").css({"top": "50%", "left": "50%", "margin-left": -w2, "margin-top": -h2});
    $(D).supersleight({shim: http_url + "Images/transparent.gif"});
    D.Close = function (F) {
        $(D).remove();
        if (typeof C.backfun == "function") {
            C.backfun(F)
        }
        $.hide_zz();
        lxx_showbox.def.backfun = {}
    };
    $(D).find(".ensure").focus();
    $(D).find(".ensure").keyup(function (G) {
        var F = G.keyCode || G.which;
        if (F == "13") {
            $(this).trigger("click")
        }
    });
    return D
}};
var bee_ui_fz = {fz_hide: null, dom: null, width: null, height: null, bc: 8, hc: 1, speed: 300, fz_html: http_url + "Images/login_bg_status.png", fz_img: null, fz_div: null};
jQuery.fn.fz_ready = function () {
    var D = $(this);
    bee_ui_fz.dom = $(this);
    var G = "";
    var B = "<img src='" + bee_ui_fz.fz_html + "' />";
    var H = parseInt(D.height());
    bee_ui_fz.height = H;
    var E = parseInt(D.width());
    bee_ui_fz.width = E;
    var C = bee_ui_fz.speed;
    var A = bee_ui_fz.bc;
    var F = bee_ui_fz.hc;
    D.wrapInner("<div myname='fz_temp'></div>");
    bee_ui_fz.fz_hide = D.find("div[myname='fz_temp']");
    for (i = 0; i < E / A; i++) {
        D.append("<div class='bee_fz_div1'>" + B + "</div>");
        D.find(".bee_fz_div1").eq(i).css({width: A + "px", height: H + "px", "background-image": G, position: "absolute", top: "0px", left: i * A + "px", "background-position": -i * A + "px 0px", overflow: "hidden", display: "none", "z-index": i}).attr({wid: i}).find("img").css({position: "absolute", top: "0px", left: -i * A + "px"}).attr({height: "100%"})
    }
    bee_ui_fz.fz_div = D.find(".bee_fz_div1")
};
$.fn.fz_start = function () {
    var fz = bee_ui_fz.dom;
    var fz_width = bee_ui_fz.width;
    var fz_height = bee_ui_fz.height;
    var speed = bee_ui_fz.speed;
    var bc = bee_ui_fz.bc;
    var hc = bee_ui_fz.hc;
    var fz_img = http_url + "Images/login_loading.png";
    bee_ui_fz.fz_img = fz_img;
    bee_ui_fz.fz_hide.css({display: "none"});
    bee_ui_fz.dom.find(".bee_fz_div1").css({display: "block"});
    var center_no = parseInt((fz_width / bc) / 2);
    center_no1 = parseInt((fz_width / bc) / 2 - 1);
    var left_div = fz.find(".bee_fz_div1:lt(" + center_no + ")");
    var right_div = fz.find(".bee_fz_div1:gt(" + center_no1 + ")");
    left_div.each(function () {
        $(this).animate({left: center_no * bc + "px", height: $(this).height() - (center_no - parseInt($(this).attr("wid"))) / hc + "px", top: (center_no - parseInt($(this).attr("wid"))) / eval(hc * 2) + "px"}, speed, function () {
            var temp_cc = parseInt(fz_width / bc) - $(this).attr("wid");
            var temp_height = bee_ui_fz.height + (parseInt(temp_cc) - center_no) / hc + "px";
            var temp_top = (center_no - parseInt(temp_cc)) / eval(hc * 2) + "px";
            $(this).css({"z-index": temp_cc, height: temp_height, top: temp_top}).find("img").attr({src: fz_img});
            $(this).animate({left: parseInt($(this).attr("wid")) * bc + "px", top: "0px", height: fz_height + "px"}, speed)
        })
    });
    right_div.each(function () {
        $(this).animate({left: center_no * bc + "px", height: $(this).height() + (parseInt($(this).attr("wid")) - center_no) / hc + "px", top: (center_no - parseInt($(this).attr("wid"))) / eval(hc * 2) + "px"}, speed, function () {
            var temp_cc = parseInt(fz_width / bc) - $(this).attr("wid");
            var temp_height = bee_ui_fz.height - (center_no - parseInt(temp_cc)) / hc + "px";
            var temp_top = (center_no - parseInt(temp_cc)) / eval(hc * 2) + "px";
            $(this).css({"z-index": temp_cc, height: temp_height, top: temp_top}).find("img").attr({src: fz_img});
            $(this).animate({left: parseInt($(this).attr("wid")) * bc + "px", top: "0px", height: fz_height + "px"}, speed, function () {
                $("#mainpanel_login_loadind").fadeIn("slow");
                bee_login.login()
            })
        })
    })
};
$.fn.fz_back = function () {
    var fz = bee_ui_fz.dom;
    var fz_width = bee_ui_fz.width;
    var fz_height = bee_ui_fz.height;
    var speed = bee_ui_fz.speed;
    var bc = bee_ui_fz.bc;
    var hc = bee_ui_fz.hc;
    var fz_img = http_url + "Images/login_bg_status.png";
    var center_no = parseInt((fz_width / bc) / 2);
    center_no1 = parseInt((fz_width / bc) / 2 - 1);
    var left_div = fz.find(".bee_fz_div1:lt(" + center_no + ")");
    var right_div = fz.find(".bee_fz_div1:gt(" + center_no1 + ")");
    $("#mainpanel_login_loadind").fadeOut("fast", function () {
        right_div.each(function () {
            $(this).animate({left: center_no * bc + "px", height: $(this).height() - (center_no - parseInt($(this).attr("wid"))) / hc + "px", top: (center_no - parseInt($(this).attr("wid"))) / eval(hc * 2) + "px"}, speed, function () {
                var temp_cc = parseInt(fz_width / bc) - $(this).attr("wid");
                var temp_height = bee_ui_fz.height + (parseInt(temp_cc) - center_no) / hc + "px";
                var temp_top = (center_no - parseInt(temp_cc)) / eval(hc * 2) + "px";
                $(this).css({"z-index": temp_cc, height: temp_height, top: temp_top}).find("img").attr({src: fz_img});
                $(this).animate({left: parseInt($(this).attr("wid")) * bc + "px", top: "0px", height: fz_height + "px"}, speed)
            })
        });
        left_div.each(function () {
            $(this).animate({left: center_no * bc + "px", height: $(this).height() + (parseInt($(this).attr("wid")) - center_no) / hc + "px", top: (center_no - parseInt($(this).attr("wid"))) / eval(hc * 2) + "px"}, speed, function () {
                var temp_cc = parseInt(fz_width / bc) - $(this).attr("wid");
                var temp_height = bee_ui_fz.height - (center_no - parseInt(temp_cc)) / hc + "px";
                var temp_top = (center_no - parseInt(temp_cc)) / eval(hc * 2) + "px";
                $(this).css({"z-index": temp_cc, height: temp_height, top: temp_top}).find("img").attr({src: fz_img});
                $(this).animate({left: parseInt($(this).attr("wid")) * bc + "px", top: "0px", height: fz_height + "px"}, speed, function () {
                    bee_ui_fz.fz_hide.css({display: "block"});
                    bee_ui_fz.fz_div.css({display: "none"});
                    bee_login.temp_number = 0
                })
            })
        })
    })
};
$.fn.movethis = function (A) {
    var B = $(this);
    B.mousedown(function (D) {
        if (D.which == 1) {
            $("body").append("<div id='beebee_add_div_move'></div>");
            var C = $("#beebee_add_div_move");
            C.css({display: "none"}).attr({"mousexz_x": D.pageX - parseInt($("#" + A).css("left")), "mousexz_y": D.pageY - parseInt($("#" + A).css("top")), "dom": A})
        }
    })
};
$(document).mousemove(function (E) {
    var H = $("#beebee_add_div_move");
    if (H.length > 0) {
        var A = H.attr("dom");
        var C = E.pageX;
        var D = E.pageY;
        var B = parseInt($(window).width());
        var F = parseInt($(window).height());
        var G = parseInt($("#" + A).width());
        var I = parseInt($("#" + A).height());
        var J = parseInt($(".im_header_mi_rep").height());
        C = C - parseInt(H.attr("mousexz_x"));
        D = D - parseInt(H.attr("mousexz_y"));
        C = (C >= B - G) ? B - G : C;
        C = (C <= 0) ? 0 : C;
        D = (D >= F - I) ? F - I : D;
        D = (D <= J) ? J : D;
        $("#" + A).css({left: C, top: D})
    }
});
$(document).mouseup(function (B) {
    var A = $("#beebee_add_div_move");
    if (B.which == 1) {
        if (A.length > 0) {
            A.remove()
        }
    }
});
$.fn.waiting = function (F) {
    var D = $(this);
    var A = parseInt(D.height());
    var E = parseInt(D.width());
    D.append("<div class='beebee_zz_witing'></div>");
    D.append("<div class='beebee_img_witing'><img src='" + http_url + "Images/022.gif' width='32' height='32' /></div>");
    var C = D.find(".beebee_zz_witing");
    var B = D.find(".beebee_img_witing");
    C.css({width: E + "px", height: A + "px", "z-index": 1000, position: "absolute", background: "#ccc", display: "none", left: "0px", top: "0px"});
    B.css({position: "absolute", left: E / 2 - 16 + "px", top: A / 2 - 16 + "px", display: "none", "z-index": 1001});
    C.fadeTo("slow", 0.5, function () {
        B.css({display: "block"});
        F()
    })
};
$.fn.remove_waiting = function () {
    var C = $(this);
    var A = C.find(".beebee_zz_witing");
    var B = C.find(".beebee_img_witing");
    if (A.length > 0) {
        A.remove()
    }
    if (B.length > 0) {
        B.remove()
    }
};
$.show_ts = function (A, C, E, D, K, B) {
    C = C.replace(/:&apos;\(/g, ":'(");
    C = $.messageChangeCodeToFace(C);
    $("#message_ts").css({display: "block"});
    var F = $("#message_ts");
    F.find(".bubble_Panel_msglayer_con_desclayer").html(C);
    F.find(".bubble_Panel_msglayer_con_desclayer").find("img").css({width: "20px", height: "20px"});
    if (parseInt(F.find(".bubble_Panel_msglayer_con_desclayer").height()) > 30) {
        F.find(".bubble_Panel_msglayer_con_desclayer_omit").css({display: "block"})
    } else {
        F.find(".bubble_Panel_msglayer_con_desclayer_omit").css({display: "none"})
    }
    var G = F.find(".bubble_Panel_msglayer_con_countlayer").find("span").text();
    G = (G == "" || G == null) ? 1 : parseInt(G) + 1;
    F.find(".bubble_Panel_msglayer_con_countlayer").find("span").text(G);
    F.find(".bubble_Panel_msglist_info").find("span").text(G);
    if (D == "im" || D == "group") {
        if ($("#ts_" + D + E).length > 0) {
            $("#ts_" + D + E).find(".bubble_Panel_msglist_inner_ul_msginfo").html(C);
            var I = $("#ts_" + D + E).find(".bubble_Panel_msglist_inner_ul_count").text();
            I = I.substring(1, I.length - 1);
            I = parseInt(I);
            I++;
            $("#ts_" + D + E).find(".bubble_Panel_msglist_inner_ul_count").text("(" + I + ")");
            return false
        }
    }
    var J = F.find(".bubble_Panel_msglist_inner_ul").find("li").last().clone(true);
    J.find(".bubble_Panel_msglist_inner_ul_msginfo").html(C);
    J.find(".bubble_Panel_msglist_inner_ul_count").text("(" + 1 + ")");
    if (D == "group") {
        J.find("img").first().css({display: "none"});
        var H = J.find(".bubble_Panel_msglist_inner_ul_headgroup").find("img");
        for (i = 0; i < H.length; i++) {
            H.eq(i).attr({src: A[i]})
        }
        J.find(".bubble_Panel_msglist_inner_ul_headgroup").css({display: "block"})
    } else {
        J.find("img").first().attr({src: A})
    }
    id = "ts_" + D + E;
    J.css({display: "block"}).attr({id: id, im: E, types: D});
    if (D == "ask") {
        J.attr({contents: K, nickname: B})
    }
    F.find(".bubble_Panel_msglist_inner_ul").prepend(J)
};
$.hide_all_ts = function () {
    $("#message_ts").find(".bubble_Panel_msglist_inner_ul").find("li").each(function () {
        if ($(this).css("display") != "none") {
            $(this).remove();
            if ($(this).attr("types") == "im") {
                var A = $(this).attr("im");
                $("#im" + A).find(".im_desctop_chat_content_row[readed='no']").each(function () {
                    var C = $(this).attr("t_id");
                    var B = $(this).attr("to");
                    $(this).attr({readed: "yes"});
                    $.xmppSendStateRead(B, C)
                })
            }
        }
    });
    $.auto_ts_show();
    $("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row").each(function () {
        $(this).find(".imframe_mainbody_list_row_head").removeAttr("sd")
    });
    $("#friends_list").find(".imframe_mainbody_list_row").each(function () {
        $(this).find(".imframe_mainbody_list_row_head").removeAttr("sd")
    });
    $("#im_desctop").find(".im_desctop_personbox").each(function () {
        $(this).find(".im_desctop_personbox_msg").css({display: "none"})
    })
};
$.icon_ts = function (A, D) {
    var E = $("#people_list").find(".imframe_mainbody_list_row[" + D + "='" + A + "']").find(".imframe_mainbody_list_row_head");
    if (E.attr("sd") == "yes") {
        return false
    }
    E.attr({sd: "yes"});
    var C = parseInt(E.css("top"));
    E.css({top: C - 2});
    var B = setInterval(function () {
        if (E.attr("sd") == "yes") {
            E.stop(true, true).animate({top: C + 2 + "px"}, 200, function () {
                E.animate({top: C - 2 + "px"}, 200)
            })
        } else {
            E.stop(true, true).css({top: C});
            clearInterval(B)
        }
    }, 400)
};
$.auto_ts_show = function () {
    var C = $("#message_ts").find(".bubble_Panel_msglist_inner_ul").find("li");
    if (C.length <= 1) {
        $("#message_ts").css({display: "none"})
    }
    var A = 0;
    $("#message_ts").find(".bubble_Panel_msglist_inner_ul").find("li").each(function () {
        if ($(this).css("display") == "block") {
            var D = $(this).find(".bubble_Panel_msglist_inner_ul_count").text();
            D = parseInt(D.substring(1, D.length - 1));
            A += D
        }
    });
    $("#message_ts").find(".bubble_Panel_msglist_info").find("span").text(A);
    $("#message_ts").find(".bubble_Panel_msglayer_con_countlayer").find("span").text(A);
    var B = $("#message_ts").find(".bubble_Panel_msglist_inner_ul").find("li").eq(0).find(".bubble_Panel_msglist_inner_ul_msginfo").text();
    $("#message_ts").find(".bubble_Panel_msglayer_con_desclayer").text(B)
};
$.auto_icon = function (K) {
    var L = $("#friends_list").find(".imframe_mainbody_list_row[im='" + K + "']");
    var E = L.attr("state");
    var J = parseInt(L.attr("sx"));
    $("#friends_list").append(L);
    var C = 0;
    var H = 0;
    var I = 0;
    for (i = 0; i < $("#friends_list").find(".imframe_mainbody_list_row").length; i++) {
        var A = $("#friends_list").find(".imframe_mainbody_list_row").eq(i).find(".imframe_mainbody_list_row_head").attr("sd");
        var F = $("#friends_list").find(".imframe_mainbody_list_row").eq(i).attr("state");
        if (A == "yes") {
            C++;
            if (F == "online") {
                H++
            } else {
                I++
            }
        } else {
            break
        }
    }
    if ($("#friends_list").find(".imframe_mainbody_list_row[state='" + E + "']").length == 1) {
        if (E == "online") {
            if (C != 0) {
                temp_sd_number1 = C - 1;
                $("#friends_list").find(".imframe_mainbody_list_row").eq(temp_sd_number1).after(L)
            } else {
                $("#friends_list").prepend(L)
            }
        } else {
            $("#friends_list").append(L)
        }
    } else {
        var B = null;
        var D = (E == "online") ? H : I;
        for (s = 0; s < $("#friends_list").find(".imframe_mainbody_list_row[state='" + E + "']").length; s++) {
            if (s > D - 1) {
                var G = parseInt($("#friends_list").find(".imframe_mainbody_list_row[state='" + E + "']").eq(s).attr("sx"));
                if (J == G) {
                } else {
                    if (J > G) {
                        B = $("#friends_list").find(".imframe_mainbody_list_row[state='" + E + "']").eq(s)
                    }
                }
            }
        }
        if (B == null) {
            if (E == "online") {
                if (C != 0) {
                    temp_sd_number1 = C - 1;
                    $("#friends_list").find(".imframe_mainbody_list_row").eq(temp_sd_number1).after(L)
                } else {
                    $("#friends_list").prepend(L)
                }
            } else {
                $("#friends_list").find(".imframe_mainbody_list_row[state='offline']").eq(0).before(L)
            }
        } else {
            B.after(L)
        }
    }
};
$.message_read = function (A, D) {
    var E = (D == "im") ? "friends_list" : "imframe_mainbody_list_03";
    var B = $("#" + E).find(".imframe_mainbody_list_row[" + D + "='" + A + "']");
    var F = $("#" + D + A);
    var C = $("#" + D + "_desctop_personbox_" + A);
    var G = $("#ts_" + D + A);
    if (D == "im") {
        F.find(".im_desctop_chat_content_row[readed='no']").each(function () {
            var I = $(this).attr("t_id");
            var H = $(this).attr("to");
            $(this).attr({readed: "yes"});
            $.xmppSendStateRead(H, I)
        })
    }
    if (F.length > 0) {
        F.css({display: "block"});
        F.trigger("mousedown");
        F.find(".im_desctop_chat_content_list").scrollTop(parseInt(F.find(".im_desctop_chat_content_list").height()))
    }
    if (C.length > 0) {
        C.find(".im_desctop_personbox_msg").css({display: "none"})
    }
    if (G.length > 0) {
        G.remove()
    }
    if (B.length > 0) {
        B.find(".imframe_mainbody_list_row_head").removeAttr("sd")
    }
    $("#message_ts").find(".bubble_Panel_msglist").css({display: "none"});
    $.auto_ts_show();
    F.find(".im_desctop_chat_content").scrollTop(parseInt(F.find(".im_desctop_chat_content_list").height()))
};
$.saveGroupIdPassword = function (A, B) {
    $.addDataToTable(bee_groupchat.groupdata, {"id": A, "pwd": B})
};
$.saveGroupIdPeopleList = function (A, B) {
    $.addDataToTable(bee_groupchat.groupUserList, {"id": A, "list": B})
};
$.delGroupIdPeopleList = function (A) {
    $.deleteIdFromTable(bee_groupchat.groupUserList, "id", A)
};
$.getGroupPeopleListData = function (A) {
    return $.searchIdFromTable(bee_groupchat.groupUserList, "id", A).list
};
$.getGroupPeopleData = function (B, A) {
    var C = $.searchIdFromTable(bee_groupchat.groupUserList, "id", B);
    return $.searchIdFromTable(C.list, "userid", A)
};
$.addPeopleInfoToGroupData = function (B, A) {
    for (i = 0; i < A.length; i++) {
        $.addDataToTable($.searchIdFromTable(bee_groupchat.groupUserList, "id", B).list, A[i])
    }
};
$.removePeopleInfoFromGroupData = function (A, B) {
    $.deleteIdFromTable($.searchIdFromTable(bee_groupchat.groupUserList, "id", B).list, "userid", A)
};
$.updatePeopleInAllGroup = function (A, B) {
    if (bee_groupchat.groupUserList.length != 0) {
        $("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row").each(function () {
            var C = $(this).attr("group");
            $.updataDataToTableRow($.searchIdFromTable(bee_groupchat.groupUserList, "id", C).list, "userid", A, B)
        })
    }
};
$.getFriendData = function (A) {
    return $.searchIdFromTable(bee_login.data, "userid", A)
};
$.addFriendToListData = function (A) {
    $.addDataToTable(bee_login.data, A)
};
$.updateFriendToListData = function (B, A) {
    $.updataDataToTableRow(bee_login.data, "userid", A, B)
};
$.deleteFriendFromData = function (A) {
    $.deleteIdFromTable(bee_login.data, "userid", A)
};
$.getSearchPeopleInfo = function (A) {
    return $.searchIdFromTable(bee_search.data, "userid", A)
};
$.getMyInfo = function () {
    return bee_login.mydata
};
$.showMessageToTalkBox = function (M, C, A, J, T, H, L) {
    flashSound.msg();
    var N = $.returnTalkWindowSDM(C, M);
    if (N) {
        desctop_app_obj.msgPrompt($("#" + C + M))
    }
    desctop_app_obj.msgWindowTitle();
    var U = (C == "im") ? "friends_list" : "imframe_mainbody_list_03";
    if ($("#" + C + M).length > 0 && $("#" + C + M).css("display") == "block") {
    } else {
        if (A == "" || A == null) {
        } else {
            if (!$("#" + C + M).length > 0) {
                var Q = C + M;
                var E = $("#" + U).find(".imframe_mainbody_list_row[" + C + "='" + M + "']").find(".imframe_mainbody_list_row_uname").text();
                bee_moveing.create_window(Q, M, E);
                bee_moveing.mousedown()
            }
        }
    }
    var P = $("#" + C + M).find(".im_desctop_chat_content_list");
    var K = $("#talk_row_s").clone(true).attr({id: "wuyongsssssssssss"}).css({display: "block"});
    var F = "";
    var G = "";
    if (C == "im") {
        F = $("#" + U).find(".imframe_mainbody_list_row[" + C + "='" + M + "']").find(".imframe_mainbody_list_row_head").find("img").attr("src")
    } else {
        if ($.searchIdFromTable(bee_groupchat.get_group_data, "id", M)) {
            var R = $.getGroupPeopleData(M, T);
            G = R.nickName;
            F = R.icon
        } else {
            G = T;
            F = default_group_icon
        }
    }
    K.find(".im_desctop_chat_content_row_ico").find("img").attr({src: F});
    K.find(".im_desctop_chat_content_row_words_time").text(J);
    K.find(".im_desctop_chat_content_row_words_auto").css({position: "relative"}).append("<span class='bee_message'></span>");
    A = A.replace(/:&apos;\(/g, ":'(");
    A = $.messageChangeCodeToFace(A);
    if (C == "im") {
        if ($("#" + C + M).length > 0 && $("#" + C + M).css("display") == "block") {
            K.attr({t_id: H, readed: "yes", to: L});
            $.xmppSendStateRead(L, H)
        } else {
            K.attr({t_id: H, readed: "no", to: L})
        }
        K.find(".im_desctop_chat_content_row_words_auto").find(".bee_message").html(A)
    } else {
        K.find(".im_desctop_chat_content_row_words_auto").find(".bee_message").html("<span class='bee_nickname'>" + G + "</span> : " + A)
    }
    var B = http_url + "Images/022.gif";
    var S = "<div>" + A + "</div>";
    if ($(S).find(".bens").length > 0) {
        var D = $(S).find(".bens").attr("typess");
        if (D == "gif") {
        }
        if (D == "img") {
            K.find(".bens").click(function () {
                $.showFullScreenBigImage($(this).attr("big_img"))
            }).LoadImage(true, 120, 120, B, function () {
                K.find(".bens").fadeIn("slow");
                $("#" + C + M).find(".im_desctop_chat_content").scrollTop(parseInt(P.height()))
            })
        }
        if (D == "voice") {
            var O = $(A).find(".bens").attr("musicsrc");
            K.find(".bens").click(function () {
                var W = $(this);
                var V = W.attr("state");
                if (!V || V == "stop") {
                    $(".im_desctop_chatbox").find(".bee_voice,.bee_voice1").find("img").attr({state: "stop", src: http_url + "Images/recorder_ready.png"});
                    W.attr({state: "play"});
                    W.attr({src: http_url + "Images/recorder_playing.gif"});
                    flashSound.custom(O, function () {
                        W.attr({src: http_url + "Images/recorder_stop.png"})
                    }, function () {
                        W.attr({src: http_url + "Images/recorder_ready.png"});
                        W.attr({state: "stop"})
                    })
                } else {
                    flashSound.stopPlay(O);
                    W.attr({state: "stop"});
                    W.attr({src: http_url + "Images/recorder_ready.png"})
                }
            })
        }
        if (D == "video") {
            var I = $(A).find(".bens").attr("src");
            var O = $(A).find(".bens").attr("mp4src");
            K.find("img").click(function () {
                flashVideo.start(O, I)
            });
            K.find("img").hover(function () {
                $(this).parent().find(".bens_bf").attr({src: http_url + "Images/video_receive_rect.8.png"})
            }, function () {
                $(this).parent().find(".bens_bf").attr({src: http_url + "Images/video_receive_rect.9.png"})
            })
        }
    }
    P.append(K);
    $.autoAdjustMessageNumber(C, M);
    $("#" + C + M).find(".im_desctop_chat_content").scrollTop(10000)
};
$.returnGroupNumber = function () {
    return $("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row").length
};
$.delChatUi = function (H, D) {
    var A = (D == "im") ? "friends_list" : "imframe_mainbody_list_03";
    var B = $("#" + A).find(".imframe_mainbody_list_row[" + D + "='" + H + "']");
    var F = $("#" + D + H);
    var C = $("#" + D + "_desctop_personbox_" + H);
    var E = $("#ts_" + D + H);
    var G = B.attr("sx");
    B.remove();
    F.remove();
    C.remove();
    E.remove();
    $.auto_ts_show();
    if (D == "im") {
        if ($("#imframe_mainbody_list_02").find(".imframe_mainbody_list_row[" + D + "='" + H + "']").length > 0) {
            $("#imframe_mainbody_list_02").find(".imframe_mainbody_list_row[" + D + "='" + H + "']").remove();
            $.delLaterLinkManFromCookie(H)
        }
        $.autoFriendList(G)
    }
};
$.autoFriendList = function (A) {
    $("#friends_list").find(".imframe_mainbody_list_row").each(function () {
        if (parseInt($(this).attr("sx")) > parseInt(A)) {
            $(this).attr({sx: parseInt($(this).attr("sx")) - 1})
        }
    })
};
$.checkGroupIdisAdd = function (A) {
    if ($("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row[group='" + A + "']").length > 0) {
        return true
    } else {
        return false
    }
};
$.showChecking = function (C, B, A, D) {
    $.show_zz(function () {
        var I = $("#addbuddy_panel");
        var E = parseInt($(window).width());
        var F = parseInt($(window).height());
        var G = parseInt(I.width());
        var H = parseInt(I.height());
        if (C == "out") {
            I.find(".addbuddy_panel_content_tit").text(message.add_friends_msg_send.replace("xxx", B));
            I.find(".addbuddy_panel_content_area_auto").find("textarea").removeAttr("readonly").val("");
            I.find(".bee_out").css({display: "block"});
            I.find(".bee_in").css({display: "none"});
            I.attr({im: A})
        } else {
            I.find(".addbuddy_panel_content_tit").text(message.receive_friends_msg_send.replace("xxx", B));
            I.find(".addbuddy_panel_content_area_auto").find("textarea").attr({readonly: "readonly"}).val(D);
            I.find(".bee_out").css({display: "none"});
            I.find(".bee_in").css({display: "block"});
            I.attr({im: A});
            I.find(".addbuddy_panel_header_close").css({display: "none"});
            I.find(".addbuddy_panel_header_op").css({display: "none"})
        }
        $("#addbuddy_panel").css({display: "block", "z-index": 10000, left: (E - G) / 2, top: (F - H) / 2});
        if (C == "out") {
            $("#bee_out_yes").trigger("click")
        }
    })
};
$.hideChecking = function () {
    $("#addbuddy_panel").css({display: "none"}).removeAttr("im");
    $("#addbuddy_panel").find(".addbuddy_panel_header_close").css({display: "block"});
    $("#addbuddy_panel").find(".addbuddy_panel_header_op").css({display: "block"});
    $("#addbuddy_panel").remove_waiting();
    $.hide_zz()
};
$.showMyInfo = function () {
    var B = bee_login.mydata;
    var A = $("#imframe_header");
    A.find("img").attr({src: B.icon});
    A.find(".imframe_header_nick").text(B.nickName);
    if (B.signature_Content == "" || B.signature_Content == null) {
        A.find(".imframe_header_label_value").text(message.my_info_is_null)
    } else {
        A.find(".imframe_header_label_value").text(B.signature_Content)
    }
};
$.showStateToChat = function (B) {
    var A = $(B).attr("from").split("@");
    A = A[0];
    var D = $(B).attr("id");
    type = D.substring(0, 2);
    t_id = D.replace(type, "");
    var C = $(B).attr("type");
    C = (C == "groupchat") ? "group" : "chat";
    $.showStateToChatUi(A, t_id, type, C)
};
$.showStateToChatUi = function (A, G, D, E) {
    var C;
    if (D == "DR") {
        C = "送达"
    }
    if (D == "RR") {
        C = "已阅"
    }
    if (D == "SR") {
        C = "已发"
    }
    if (E == "chat") {
        var F = $("#im" + A).find(".chat_opponent").find(".im_desctop_chat_content_row_words_time[datetime='" + G + "']");
        if (C) {
            if (F.length > 0) {
                F.find("span").text(" (" + C + ")")
            }
        }
    } else {
        var B = $("#group" + A).find(".chat_opponent").find(".im_desctop_chat_content_row_words_time[datetime='" + G + "']");
        if (D == "SR") {
            if (B.length > 0) {
                B.find("span").text(" (" + C + ")")
            }
        }
    }
};
$.getIconSrcOnline = function (C) {
    var B = "";
    var A = C.split(".");
    for (i = 0; i < A.length - 1; i++) {
        if (i == A.length - 2) {
            B += A[i].substring(0, A[i].length - 1) + "."
        } else {
            B += A[i] + "."
        }
    }
    B = B.substring(0, B.length - 1);
    return B + "m." + A[A.length - 1]
};
$.getIconSrcOffline = function (C) {
    var B = "";
    var A = C.split(".");
    for (i = 0; i < A.length - 1; i++) {
        if (i == A.length - 2) {
            B += A[i].substring(0, A[i].length - 1) + "."
        } else {
            B += A[i] + "."
        }
    }
    B = B.substring(0, B.length - 1);
    return B + "g." + A[A.length - 1]
};
$.showAddPeopleToGroup = function (B, A) {
    if (A.indexOf("im") > -1) {
        A = parseInt(A.replace("im", ""));
        bee_groupchat.show_add_people_ui(B, function () {
            $("#group_small_panel").find(".group_small_panel_con_ul").find("li[im='" + A + "']").trigger("click")
        })
    } else {
        id = parseInt(A.replace("group", ""));
        bee_groupchat.show_add_people_ui(B, function () {
            if (!$.searchIdFromTable(bee_groupchat.get_group_data, "id", id)) {
                $.show_zz(function () {
                    lxx_showbox.create({type: "alert", title: "创建聊天组", msg: message.get_group_data_error, ico: "warn", ensure: "确 定", cancel: "取 消"})
                });
                $("#group_small_panel").css({display: "none"});
                return false
            }
            $("#group_small_panel").attr({lx: "group", groupid: id});
            $("#group_small_panel").find(".group_small_panel_tit").text("请选择要邀请的联系人");
            var D = $("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row[group='" + id + "']").find(".imframe_mainbody_list_row_uname").text();
            $("#group_small_panel").find(".group_small_panel_inputlayer").find("input").val(D).prop({disabled: true});
            var C = $.getGroupPeopleListData(id);
            bee_groupchat.groupManNumber = C.length - 1;
            var E = ",";
            if (C == "" || C == null) {
            } else {
                for (i = 0; i < C.length; i++) {
                    E += C[i].userid + ","
                }
            }
            $("#group_small_panel").find(".group_small_panel_con_ul").find("li").each(function () {
                var G = $(this).attr("im");
                if (E.indexOf("," + G + ",") > -1) {
                    var F = $(this).text();
                    $(this).find("a").remove();
                    $(this).text(F);
                    $(this).attr({checked: "no"})
                }
            })
        })
    }
};
$.autoTotalTextNumber = function (L) {
    var D = L.parents(".im_desctop_chatbox").find(".im_desctop_chat_sendarea_textnumber");
    var C = L.text();
    var E = L.text().length + L.find("img").length * 4;
    var I = L.find(".remove_this").length * 4;
    E = E - I;
    var F = null;
    var H = null;
    if ($.checkChineseStr(C)) {
        H = 70
    } else {
        H = 160
    }
    F = H - E;
    if (F < 0) {
        var G = L.parent().find(".im_desctop_chat_textarea1").val();
        var K = L.parents(".im_desctop_chatbox").attr("id");
        L.blur();
        L.html("");
        L.focus();
        $.divEidtSelection(K);
        if (window.getSelection) {
            var J = bee_moveing.range[K].createContextualFragment(G);
            var A = J.lastChild;
            while (A && A.nodeName.toLowerCase() == "br" && A.previousSibling && A.previousSibling.nodeName.toLowerCase() == "br") {
                var B = A;
                A = A.previousSibling;
                J.removeChild(B)
            }
            bee_moveing.range[K].deleteContents();
            bee_moveing.range[K].insertNode(J);
            if (A) {
                bee_moveing.range[K].setEndAfter(A);
                bee_moveing.range[K].setStartAfter(A)
            }
            bee_moveing.sel[K].removeAllRanges();
            bee_moveing.sel[K].addRange(bee_moveing.range[K])
        } else {
            if (document.selection) {
                bee_moveing.sel[K].pasteHTML(G);
                if ($.browser.msie && parseInt($.browser.version) == 8) {
                    bee_moveing.sel[K].pasteHTML("<img class='remove_this'  src='" + http_url + "Images/transparent.gif' width='1' height='1' />")
                }
                bee_moveing.sel[K].select()
            }
        }
        L.scrollTop(3000000);
        D.text_sd("red")
    } else {
        D.text(F);
        L.parent().find(".im_desctop_chat_textarea1").val(L.html())
    }
};
$.setChatBoxRange = function (A) {
    $(".im_desctop_chatbox").each(function () {
        $(this).find(".im_desctop_chat_textarea").attr({rangehere: "no"})
    });
    A.attr({rangehere: "yes"})
};
$.divEidtSelection = function (A) {
    if (window.getSelection) {
        bee_moveing.sel[A] = window.getSelection();
        bee_moveing.sel_length[A] = bee_moveing.sel[A].toString().length;
        bee_moveing.range[A] = bee_moveing.sel[A].getRangeAt(0)
    } else {
        if (document.selection) {
            bee_moveing.sel[A] = document.selection.createRange();
            if (bee_moveing.sel[A].htmlText) {
                bee_moveing.sel_length[A] = bee_moveing.sel[A].htmlText.length
            } else {
                bee_moveing.sel_length[A] = 0
            }
        }
    }
};
$.faceToTalkBoxInput = function (G, H, B) {
    var C = H.parents(".im_desctop_chatbox").attr("id");
    if (window.getSelection) {
        H.focus();
        var F = bee_moveing.range[C].createContextualFragment("<img code=" + B + " src='" + G + "' width='32' height='32'  />");
        var E = F.lastChild;
        while (E && E.nodeName.toLowerCase() == "br" && E.previousSibling && E.previousSibling.nodeName.toLowerCase() == "br") {
            var D = E;
            E = E.previousSibling;
            F.removeChild(D)
        }
        bee_moveing.range[C].deleteContents();
        bee_moveing.range[C].insertNode(F);
        if (E) {
            bee_moveing.range[C].setEndAfter(E);
            bee_moveing.range[C].setStartAfter(E)
        }
        bee_moveing.sel[C].removeAllRanges();
        bee_moveing.sel[C].addRange(bee_moveing.range[C])
    } else {
        if (document.selection) {
            bee_moveing.sel[C].pasteHTML("<img code=" + B + " src='" + G + "' width='32' height='32'   />");
            if ($.browser.msie && parseInt($.browser.version) == 8) {
                bee_moveing.sel[C].pasteHTML("<img class='remove_this'  src='" + http_url + "Images/transparent.gif' width='1' height='1' />")
            }
            bee_moveing.sel[C].select()
        }
    }
    var A = parseInt(H.scrollTop()) + 24;
    H.scrollTop(A)
};
$.selectContentShow = function (A) {
    var B = bee_moveing.sel_length[A];
    if (B > 0) {
        if (window.getSelection) {
            bee_moveing.sel[A].removeAllRanges();
            bee_moveing.sel[A].addRange(bee_moveing.range[A])
        } else {
            if (document.selection) {
                bee_moveing.sel[A].select()
            }
        }
    }
};
$.checkChineseStr = function (B) {
    var C = B.match(/[^\x00-\xff]/ig);
    var A = (C == null || C == "") ? false : true;
    return A
};
$.specialCodeFilter = function (A) {
    var B = /\<|\>|\"|\&/g;
    A = A.replace(B, function (C) {
        switch (C) {
            case"<":
                return"&lt;";
                break;
            case">":
                return"&gt;";
                break;
            case'"':
                return"&quot;";
                break;
            case"&":
                return"&amp;";
                break;
            default:
                break
        }
    });
    return A
};
$.messageChangeCodeToFace = function (C) {
    var A = default_face.staticface;
    for (i = 0; i < A.length; i++) {
        var D = A[i].code;
        D = $.specialCodeTransferredMeaning(D);
        var B = new RegExp(D, "g");
        C = C.replace(B, "<img src='" + A[i].src + "' width='32' height='32'  />")
    }
    return C
};
$.specialCodeTransferredMeaning = function (A) {
    var B = /\$|\(|\)|\*|\+|\.|\[|\]|\?|\\|\/|\^|\{|\}/g;
    A = A.replace(B, function (C) {
        switch (C) {
            case"$":
                return"\\$";
                break;
            case"(":
                return"\\(";
                break;
            case")":
                return"\\)";
                break;
            case"*":
                return"\\*";
                break;
            case"+":
                return"\\+";
                break;
            case".":
                return"\\.";
                break;
            case"[":
                return"\\[";
                break;
            case"]":
                return"\\]";
                break;
            case"?":
                return"\\?";
                break;
            case"\\":
                return"\\\\";
                break;
            case"/":
                return"\\/";
                break;
            case"^":
                return"\\^";
                break;
            case"{":
                return"\\{";
                break;
            case"}":
                return"\\{";
                break;
            default:
                break
        }
    });
    return A
};
$.showFullScreenBigImage = function (D) {
    $("body").append("<div id='bensImgShow' myname='beebee_show_big_images_temp'></div>");
    var I = $("div[myname='beebee_show_big_images_temp']");
    var F = http_url + "Images/022.gif";
    var A = http_url + "Images/images_close.png";
    var B = parseInt($(window).width());
    var E = parseInt($(window).height());
    var G = 400;
    var H = 300;
    I.css({width: G + "px", height: H + "px", background: "#ddd", position: "absolute", left: (B - G) / 2 + "px", top: (E - H) / 2 + "px", "z-index": "10004", display: "none"});
    var C = $("<img class='bensClose' src='" + A + "' title='关闭' />");
    C.css({position: "absolute", right: "-10px", top: "-10px", width: "30px", height: "30px", "z-index": "10002", cursor: "pointer"});
    I.append(C);
    C.click(function () {
        I.find(".temp_img").fadeOut(function () {
            I.animate({width: parseInt(I.width()) * 0.9 + "px", height: parseInt(I.height()) * 0.9 + "px", top: (E - parseInt(I.height()) * 0.9) / 2 + "px", left: (B - parseInt(I.width()) * 0.9) / 2 + "px"}, 50, function () {
                I.animate({width: parseInt(I.width()) * 1.5 + "px", height: parseInt(I.height()) * 1.5 + "px", top: (E - parseInt(I.height()) * 1.5) / 2 + "px", left: (B - parseInt(I.width()) * 1.5) / 2 + "px", opacity: "0.1"}, 100, function () {
                    I.remove();
                    $.hide_zz()
                })
            })
        })
    });
    $.show_zz(function () {
        I.append("<img class='temp_img' src='" + D + "' style='display:none'/>");
        I.fadeIn("slow");
        I.find(".temp_img").LoadImage(true, B - 20, E - 40, F, function (J, K) {
            I.animate({width: J + 20 + "px", height: K + 20 + "px", left: (B - J - 20) / 2 + "px", top: (E - K - 20) / 2 + "px"}, function () {
                I.find(".temp_img").css({position: "absolute", width: J + "px", height: K + "px", left: "10px", top: "10px"}).fadeIn("slow")
            })
        })
    })
};
$.goToLoadingPage = function () {
    $("#group_small_panel").css({display: "none"});
    $("#beebee_main").css({display: "none"});
    $("#beebee_login").fadeIn("slow");
    $("div").fz_back()
};
$.resetData = function () {
    $("#username").val("");
    $("#password").val("");
    $("#securitycode").val("");
    $("#achangeimg").trigger("click");
    bee_login.loading_box = null;
    bee_login.loading_desc = null;
    bee_login.remember_password = false;
    $("#remember").addClass("ck").removeClass("cked");
    isSavePwd = "N";
    bee_login.data = null;
    bee_login.mydata = null;
    $("#login_loading_box_progress_auto").css({width: "0%"});
    $("#friends_list").html("");
    $("#imframe_mainbody_list_03").html("");
    $.hide_all_ts();
    bee_login.state = false;
    bee_groupchat.groupUserList = new Array();
    bee_groupchat.groupdata = new Array();
    bee_groupchat.get_group_data = new Array();
    bee_groupchat.getdataing = {}
};
$.updateLatelyLinkman = function (A, F) {
    var C = $("#imframe_mainbody_list_02");
    var E = $.getFriendData(A);
    if (E == "" || E == null) {
        return false
    }
    if (C.find(".imframe_mainbody_list_row[im='" + A + "']").length > 0) {
        C.prepend(C.find(".imframe_mainbody_list_row[im='" + A + "']"))
    } else {
        var D = $("#onetoonechat").clone(true).attr({id: ""}).css({display: "block"});
        D.attr({pingying: E.pingying, sex: E.gender, im: E.userid});
        D.find(".imframe_mainbody_list_row_head").find("img").attr({src: E.icon});
        D.find(".imframe_mainbody_list_row_uname").text(E.nickName);
        D.find(".imframe_mainbody_list_row_unum").text("IM号:" + E.userid);
        D.find(".imframe_mainbody_list_row_unlabel_auto").text(E.signature_Content).attr({title: E.signature_Content});
        C.prepend(D)
    }
    if (C.find(".imframe_mainbody_list_row").length > 10) {
        C.find(".imframe_mainbody_list_row").eq(10).remove()
    }
    if (F == "" || F == null) {
        var B = new Array();
        C.find(".imframe_mainbody_list_row").each(function () {
            B.push($(this).attr("im"))
        });
        $.setcookie(30, "history", B)
    }
    var G = $("#friends_list").find(".imframe_mainbody_list_row[im='" + A + "']").attr("state");
    $.updataLatelyLinkManIcon(A, G)
};
$.loadLatelyLinkmanFromCookie = function () {
    var A = $("#imframe_mainbody_list_02");
    A.html("");
    var C = $.getcookie("history");
    if (C == "" || C == null) {
    } else {
        C = C.split(",");
        if (C.length > 0) {
            for (var B = 0; B < C.length; B++) {
                var D = C.length - B - 1;
                $.updateLatelyLinkman(C[D], "aa")
            }
        }
    }
};
$.updataLatelyLinkManIcon = function (A, D) {
    var B = $("#imframe_mainbody_list_02");
    var C = B.find(".imframe_mainbody_list_row[im='" + A + "']");
    if (C.length > 0) {
        var E = C.find(".imframe_mainbody_list_row_head").find("img").attr("src");
        if (D == "online") {
            new_src = $.getIconSrcOnline(E)
        } else {
            new_src = $.getIconSrcOffline(E)
        }
        C.find(".imframe_mainbody_list_row_head").find("img").attr({src: new_src})
    }
};
$.delLaterLinkManFromCookie = function (A) {
    var B = $.getcookie("history");
    B = B.split(",");
    var C = null;
    for (i = 0; i < B.length; i++) {
        if (parseInt(B[i]) == parseInt(A)) {
            C = i
        }
    }
    B.splice(C, 1);
    $.setcookie(30, "history", B)
};
$.autoAdjustMessageNumber = function (C, E) {
    var D = $("#" + C + E);
    if (D.length > 0) {
        var A = D.find(".im_desctop_chat_content_row");
        if (A.length > chat_window_message_number) {
            var B = A.length - chat_window_message_number;
            D.find(".im_desctop_chat_content_row:lt(" + B + ")").remove()
        }
    }
};
$.changeJsonKey = function (B) {
    var A = {};
    if (B.nickname) {
        A.nickName = B.nickname
    }
    if (B.signature) {
        A.signature_Content = B.signature
    }
    if (B.icon) {
        A.icon = B.icon
    }
    return A
};
$.updateFriendInfoToUi = function (C, D) {
    if (D) {
        var H = $("#friends_list").find(".imframe_mainbody_list_row[im='" + C + "']");
        var G = $("#imframe_mainbody_list_02").find(".imframe_mainbody_list_row[im='" + C + "']");
        var F = $("#im_desctop_personbox_" + C);
        var B = F.find(".im_desctop_personbox_flower_uname");
        var A = F.find(".im_desctop_personbox_uname");
        var E = $("#im" + C).find(".im_desctop_chat_header_desc");
        if (D.nickName) {
            H.find(".imframe_mainbody_list_row_uname").text(D.nickName);
            G.find(".imframe_mainbody_list_row_uname").text(D.nickName);
            B.text(D.nickName).attr({title: D.nickName});
            A.text(D.nickName).attr({title: D.nickName});
            if ($("#im" + C).length > 0) {
                E.text(D.nickName)
            }
        }
        if (D.signature_Content) {
            H.find(".imframe_mainbody_list_row_unlabel_auto").text(D.signature_Content).attr({title: D.signature_Content});
            G.find(".imframe_mainbody_list_row_unlabel_auto").text(D.signature_Content).attr({title: D.signature_Content})
        }
        if (D.icon) {
            H.find(".imframe_mainbody_list_row_head").find("img").attr({src: D.icon});
            G.find(".imframe_mainbody_list_row_head").find("img").attr({src: D.icon});
            F.find(".im_desctop_personbox_head").find("img").attr({src: D.icon})
        }
    }
};
$.getGroupDataStart = function (B, A) {
    if ($.searchIdFromTable(bee_groupchat.get_group_data, "id", B)) {
    } else {
        if (!bee_groupchat.getdataing["id" + B]) {
            bee_groupchat.getdataing["id" + B] = "1";
            bee_groupchat.get_group_info(B, function (E) {
                if (A == "new") {
                    var G = 0;
                    var D = $("#imframe_mainbody_list_03").find(".imframe_mainbody_list_row[group='" + B + "']");
                    D.find(".imframe_mainbody_list_row_head").find("img").each(function () {
                        $(this).attr({src: E.R.iconList[G]});
                        G++
                    })
                }
                if ($("#group" + B).length > 0) {
                    var I = E.R.groupBuddyVoList;
                    var H = {};
                    for (var F = 0; F < I.length; F++) {
                        var C = I[F].userid;
                        H[C] = I[F]
                    }
                    $("#group" + B).find(".im_desctop_chat_content_row").each(function () {
                        if ($(this).hasClass("chat_opponent")) {
                        } else {
                            var J = $(this).find(".im_desctop_chat_content_row_ico").find("img");
                            var K = $(this).find(".bee_message").find(".bee_nickname");
                            var L = K.text();
                            J.attr({src: H[L].icon});
                            K.text(H[L].nickName)
                        }
                    })
                }
                if ($("#beebee_main").find(".multiplayercard_panel[group='" + B + "']").length > 0) {
                    desctop_app_obj.view_groupcard(B, true)
                }
            })
        }
    }
};
$.returnTalkWindowSDM = function (C, E) {
    var D = $("#" + C + E);
    if (D.length <= 0) {
        return false
    }
    var A = parseInt(D.css("z-index"));
    var B = D.css("display");
    if (B == "none") {
        return false
    }
    var F = (A == desktop_zindex) ? false : true;
    if (F) {
        D.attr({sd: "yes"});
        return true
    } else {
        return false
    }
};
$.clearInputInfo = function (C) {
    var D = C.find(".im_desctop_chat_textarea");
    var A = C.find(".im_desctop_chat_textarea1");
    var B = C.find(".hide_input");
    D.html("");
    A.val("");
    B.val("");
    $.autoTotalTextNumber(D)
};
$.replaceHtmlLinefeed = function (A) {
    if (A) {
        A = A.replace(/\<br\>/g, "")
    }
    return A
};
$.updataDesktopIconState = function (A, D) {
    var C = $("#im_desctop_personbox_" + A);
    if (C.length > 0) {
        var B = C.find(".im_desctop_personbox_head").find("img");
        if (D == "online") {
            B.attr({src: $.getIconSrcOnline(B.attr("src"))})
        }
        if (D == "offline") {
            B.attr({src: $.getIconSrcOffline(B.attr("src"))})
        }
    }
};
$.resetUserlist = function () {
    var E = $("#friends_list").find(".imframe_mainbody_list_row");
    var B = E.length;
    for (var A = 0; A < B; A++) {
        var D = $("#friends_list").find(".imframe_mainbody_list_row[sx='" + A + "']");
        $("#friends_list").append(D);
        var F = D.find(".imframe_mainbody_list_row_head").find("img");
        var C = F.attr("src");
        F.attr({src: $.getIconSrcOffline(C)})
    }
};
$.benstj = function (A, B, D) {
    if (!B) {
        var C = "p" + A;
        if (beebee_tj.page[C]) {
            beebee_tj.page[C] = parseInt(beebee_tj.page[C]) + 1
        } else {
            beebee_tj.page[C] = 1
        }
    }
    if (B == "msg") {
        var C = "m" + A;
        if (D == "chat") {
            if (beebee_tj.nmsg[C]) {
                beebee_tj.nmsg[C] = parseInt(beebee_tj.nmsg[C]) + 1
            } else {
                beebee_tj.nmsg[C] = 1
            }
        } else {
            if (beebee_tj.gmsg[C]) {
                beebee_tj.gmsg[C] = parseInt(beebee_tj.gmsg[C]) + 1
            } else {
                beebee_tj.gmsg[C] = 1
            }
        }
    }
    if (B == "face") {
        var C = "p" + A;
        if (beebee_tj.face[C]) {
            beebee_tj.face[C] = parseInt(beebee_tj.face[C]) + 1
        } else {
            beebee_tj.face[C] = 1
        }
    }
    if (B == "sface") {
        var C = "s" + A;
        if (beebee_tj.face[C]) {
            beebee_tj.face[C] = parseInt(beebee_tj.face[C]) + 1
        } else {
            beebee_tj.face[C] = 1
        }
    }
    if (B == "voice") {
        var C = "s" + A;
        if (beebee_tj.face[C]) {
            beebee_tj.face[C] = parseInt(beebee_tj.face[C]) + 1
        } else {
            beebee_tj.face[C] = 1
        }
    }
};
$.bensajax = function (C, A, E, F, B) {
    if (A == "success") {
        var F = "a" + F;
        var D = parseInt(C) - parseInt(E);
        var G = {};
        G[F] = D;
        beebee_tj.as.push(G)
    } else {
        var F = "a" + F;
        var G = {};
        G[F] = B;
        beebee_tj.af.push(G)
    }
};
$.resetTjData = function () {
    beebee_tj.page = {};
    beebee_tj.nmsg = {};
    beebee_tj.gmsg = {};
    beebee_tj.face = {};
    beebee_tj.af = [];
    beebee_tj.as = []
};
$.closeViewMP = function () {
    $("body").find(".friendcard_panel[addfriend='yes']").remove()
};
$.showErrorToChatbox = function (C, A) {
    var B = $("#" + C).find(".chat_opponent").find(".im_desctop_chat_content_row_words_time[datetime='" + A + "']");
    B.find("span").text(" (失败)").css({"color": "red"});
    var D = "<div class='resendmessage' style='color:#1b13c9;cursor:pointer;'>重发<a> </a></div>";
    B.parent().append(D);
    B.parent().find(".resendmessage").unbind("click");
    B.parent().find(".resendmessage").one("click", function () {
        $(this).remove();
        B.find("span").text(" (待发)").css({"color": "#fff"});
        var G = null;
        for (var F = 0; F < chat_sendError.length; F++) {
            if (chat_sendError[F].id == A) {
                G = F;
                break
            }
        }
        if (G != null) {
            var E = new Date().getTime();
            B.attr({"datetime": E});
            chat_sendError[G].data.id = E;
            $.xmppSendSpecialInfo(chat_sendError[G].type, chat_sendError[G].data);
            chat_sendError.splice(G, 1)
        }
    })
};