(function () {
    var c = {id: "302cfbbd8bf83c67d852de06989ea340", dm: ["t-go.biz"], etrk: [], js: "tongji.baidu.com/hm-web/js/", icon: '/hmt/icon/21|gif|20|20', br: false, ctrk: true, align: 1, nv: -1, vdur: 1800000, age: 31536000000, rec: 0, rp: [], trust: 0, vcard: 0, se: []};
    var l = !0, m = null, n = !1;
    var p = function () {
        function a(a) {
            /["\\\x00-\x1f]/.test(a) && (a = a.replace(/["\\\x00-\x1f]/g, function (a) {
                var b = d[a];
                if (b)return b;
                b = a.charCodeAt();
                return"\\u00" + Math.floor(b / 16).toString(16) + (b % 16).toString(16)
            }));
            return'"' + a + '"'
        }

        function b(a) {
            return 10 > a ? "0" + a : a
        }

        var d = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\"};
        return function (d) {
            switch (typeof d) {
                case "undefined":
                    return"undefined";
                case "number":
                    return isFinite(d) ? String(d) : "null";
                case "string":
                    return a(d);
                case "boolean":
                    return String(d);
                default:
                    if (d === m)return"null";
                    if (d instanceof Array) {
                        var f = ["["], g = d.length, k, h, x;
                        for (h = 0; h < g; h++)switch (x = d[h], typeof x) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                k && f.push(","), f.push(p(x)), k = 1
                        }
                        f.push("]");
                        return f.join("")
                    }
                    if (d instanceof Date)return'"' + d.getFullYear() + "-" + b(d.getMonth() + 1) + "-" + b(d.getDate()) + "T" + b(d.getHours()) + ":" + b(d.getMinutes()) + ":" + b(d.getSeconds()) + '"';
                    k = ["{"];
                    for (g in d)if (Object.prototype.hasOwnProperty.call(d, g))switch (h = d[g], typeof h) {
                        case "undefined":
                        case "unknown":
                        case "function":
                            break;
                        default:
                            f && k.push(","), f = 1, k.push(p(g) + ":" + p(h))
                    }
                    k.push("}");
                    return k.join("")
            }
        }
    }();

    function q(a, b) {
        var d = a.match(RegExp("(^|&|\\?|#)(" + b + ")=([^&#]*)(&|$|#)", ""));
        return d ? d[3] : m
    }

    function r(a) {
        return(a = (a = a.match(/^(https?:\/\/)?([^\/\?#]*)/)) ? a[2].replace(/.*@/, "") : m) ? a.replace(/:\d+$/, "") : a
    };
    function s(a, b) {
        if (window.sessionStorage)try {
            window.sessionStorage.setItem(a, b)
        } catch (d) {
        }
    }

    function t(a) {
        return window.sessionStorage ? window.sessionStorage.getItem(a) : m
    };
    function y(a, b, d) {
        var e;
        d.h && (e = new Date, e.setTime(e.getTime() + d.h));
        document.cookie = a + "=" + b + (d.domain ? "; domain=" + d.domain : "") + (d.path ? "; path=" + d.path : "") + (e ? "; expires=" + e.toGMTString() : "") + (d.r ? "; secure" : "")
    };
    function z(a, b) {
        var d = new Image, e = "mini_tangram_log_" + Math.floor(2147483648 * Math.random()).toString(36);
        window[e] = d;
        d.onload = d.onerror = d.onabort = function () {
            d.onload = d.onerror = d.onabort = m;
            d = window[e] = m;
            b && b(a)
        };
        d.src = a
    };
    var A;

    function D() {
        if (!A)try {
            A = document.createElement("input"), A.type = "hidden", A.style.display = "none", A.addBehavior("#default#userData"), document.getElementsByTagName("head")[0].appendChild(A)
        } catch (a) {
            return n
        }
        return l
    }

    function G(a, b, d) {
        var e = new Date;
        e.setTime(e.getTime() + d || 31536E6);
        try {
            window.localStorage ? (b = e.getTime() + "|" + b, window.localStorage.setItem(a, b)) : D() && (A.expires = e.toUTCString(), A.load(document.location.hostname), A.setAttribute(a, b), A.save(document.location.hostname))
        } catch (f) {
        }
    }

    function H(a) {
        if (window.localStorage) {
            if (a = window.localStorage.getItem(a)) {
                var b = a.indexOf("|"), d = a.substring(0, b) - 0;
                if (d && d > (new Date).getTime())return a.substring(b + 1)
            }
        } else if (D())try {
            return A.load(document.location.hostname), A.getAttribute(a)
        } catch (e) {
        }
        return m
    };
    function I(a, b, d) {
        a.attachEvent ? a.attachEvent("on" + b, function (b) {
            d.call(a, b)
        }) : a.addEventListener && a.addEventListener(b, d, n)
    };
    var aa;
    (aa = function () {
        function a() {
            if (!a.d) {
                a.d = l;
                for (var b = 0, d = e.length; b < d; b++)e[b]()
            }
        }

        function b() {
            try {
                document.documentElement.doScroll("left")
            } catch (d) {
                setTimeout(b, 1);
                return
            }
            a()
        }

        var d = n, e = [], f;
        document.addEventListener ? f = function () {
            document.removeEventListener("DOMContentLoaded", f, n);
            a()
        } : document.attachEvent && (f = function () {
            "complete" === document.readyState && (document.detachEvent("onreadystatechange", f), a())
        });
        (function () {
            if (!d)if (d = l, "complete" === document.readyState)a.d = l; else if (document.addEventListener)document.addEventListener("DOMContentLoaded", f,
                n), window.addEventListener("load", a, n); else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", f);
                window.attachEvent("onload", a);
                var e = n;
                try {
                    e = window.frameElement == m
                } catch (k) {
                }
                document.documentElement.doScroll && e && b()
            }
        })();
        return function (b) {
            a.d ? b() : e.push(b)
        }
    }()).d = n;
    function J(a, b) {
        return"[object " + b + "]" === {}.toString.call(a)
    };
    var ba = /msie (\d+\.\d+)/i.test(navigator.userAgent), ca = navigator.cookieEnabled, da = navigator.javaEnabled(), ea = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "", ka = window.screen.width + "x" + window.screen.height, la = window.screen.colorDepth;
    var O = 0, P = Math.round(+new Date / 1E3), Q = "https:" == document.location.protocol ? "https:" : "http:", ma = "cc cf ci ck cl cm cp cw ds ep et fl ja ln lo lt nv rnd si st su v cv lv api tt u".split(" ");

    function R() {
        if ("undefined" == typeof window["_bdhm_loaded_" + c.id]) {
            window["_bdhm_loaded_" + c.id] = l;
            var a = this;
            a.a = {};
            a.b = [];
            a.q = {push: function () {
                a.p.apply(a, arguments)
            }};
            a.e = 0;
            a.i = n;
            na(a)
        }
    }

    R.prototype = {getData: function (a) {
        try {
            var b = RegExp("(^| )" + a + "=([^;]*)(;|$)").exec(document.cookie);
            return(b ? b[2] : m) || t(a) || H(a)
        } catch (d) {
        }
    }, setData: function (a, b, d) {
        try {
            y(a, b, {domain: oa(), path: pa(), h: d}), d ? G(a, b, d) : s(a, b)
        } catch (e) {
        }
    }, p: function (a) {
        if (J(a, "Array")) {
            var b = function (a) {
                return a.replace ? a.replace(/'/g, "'0").replace(/\*/g, "'1").replace(/!/g, "'2") : a
            };
            switch (a[0]) {
                case "_trackPageview":
                    if (1 < a.length && a[1].charAt && "/" == a[1].charAt(0)) {
                        this.a.api |= 4;
                        this.a.et = 0;
                        this.a.ep = "";
                        this.i ? (this.a.nv =
                            0, this.a.st = 4) : this.i = l;
                        var b = this.a.u, d = this.a.su;
                        this.a.u = Q + "//" + document.location.host + a[1];
                        this.a.su = document.location.href;
                        S(this);
                        this.a.u = b;
                        this.a.su = d
                    }
                    break;
                case "_trackEvent":
                    2 < a.length && (this.a.api |= 8, this.a.nv = 0, this.a.st = 4, this.a.et = 4, this.a.ep = b(a[1]) + "*" + b(a[2]) + (a[3] ? "*" + b(a[3]) : "") + (a[4] ? "*" + b(a[4]) : ""), S(this));
                    break;
                case "_setCustomVar":
                    if (4 > a.length)break;
                    var d = a[1], e = a[4] || 3;
                    if (0 < d && 6 > d && 0 < e && 4 > e) {
                        this.e++;
                        for (var f = (this.a.cv || "*").split("!"), g = f.length; g < d - 1; g++)f.push("*");
                        f[d - 1] = e + "*" + b(a[2]) + "*" + b(a[3]);
                        this.a.cv = f.join("!");
                        a = this.a.cv.replace(/[^1](\*[^!]*){2}/g, "*").replace(/((^|!)\*)+$/g, "");
                        "" !== a ? this.setData("Hm_cv_" + c.id, encodeURIComponent(a), c.age) : qa()
                    }
                    break;
                case "_trackOrder":
                    a = a[1];
                    if (J(a, "Object")) {
                        var k = function (a) {
                            for (var b in a)if ({}.hasOwnProperty.call(a, b)) {
                                var d = a[b];
                                J(d, "Object") || J(d, "Array") ? k(d) : a[b] = String(d)
                            }
                        };
                        k(a);
                        this.a.api |= 16;
                        this.a.nv = 0;
                        this.a.st = 4;
                        this.a.et = 94;
                        this.a.ep = p(a);
                        S(this)
                    }
                    break;
                case "_trackMobConv":
                    if (a = {webim: 1, tel: 2, map: 3,
                        sms: 4, callback: 5, share: 6}[a[1]])this.a.api |= 32, this.a.et = 93, this.a.ep = a, S(this)
            }
        }
    }};
    function ra() {
        var a = t("Hm_unsent_" + c.id);
        if (a)for (var a = a.split(","), b = 0, d = a.length; b < d; b++)z(Q + "//" + decodeURIComponent(a[b]).replace(/^https?:\/\//, ""), function (a) {
            T(a)
        })
    }

    function T(a) {
        var b = t("Hm_unsent_" + c.id) || "";
        b && ((b = b.replace(RegExp(encodeURIComponent(a.replace(/^https?:\/\//, "")).replace(/([\*\(\)])/g, "\\$1") + "(%26u%3D[^,]*)?,?", "g"), "").replace(/,$/, "")) ? s("Hm_unsent_" + c.id, b) : window.sessionStorage && window.sessionStorage.removeItem("Hm_unsent_" + c.id))
    }

    function sa(a, b) {
        var d = t("Hm_unsent_" + c.id) || "", e = a.a.u ? "" : "&u=" + encodeURIComponent(document.location.href), d = encodeURIComponent(b.replace(/^https?:\/\//, "") + e) + (d ? "," + d : "");
        s("Hm_unsent_" + c.id, d)
    }

    function S(a) {
        a.a.rnd = Math.round(2147483647 * Math.random());
        a.a.api = a.a.api || a.e ? a.a.api + "_" + a.e : "";
        var b = Q + "//hm.baidu.com/hm.gif?" + ua(a);
        a.a.api = 0;
        a.e = 0;
        sa(a, b);
        z(b, function (a) {
            T(a)
        })
    }

    function va(a) {
        return function () {
            a.a.nv = 0;
            a.a.st = 4;
            a.a.et = 3;
            a.a.ep = (new Date).getTime() - a.g.o + "," + ((new Date).getTime() - a.g.f + a.g.j);
            S(a)
        }
    }

    function na(a) {
        try {
            var b, d, e, f, g, k, h;
            O = a.getData("Hm_lpvt_" + c.id) || 0;
            13 == O.length && (O = Math.round(O / 1E3));
            if (document.referrer) {
                var x = n;
                if (X(document.referrer) && X(document.location.href))x = l; else var ta = r(document.referrer), x = Y(ta || "", document.location.hostname);
                d = x ? P - O > c.vdur ? 1 : 4 : 3
            } else d = P - O > c.vdur ? 1 : 4;
            b = 4 != d ? 1 : 0;
            if (k = a.getData("Hm_lvt_" + c.id)) {
                h = k.split(",");
                for (var E = h.length - 1; 0 <= E; E--)13 == h[E].length && (h[E] = "" + Math.round(h[E] / 1E3));
                for (; 2592E3 < P - h[0];)h.shift();
                g = 4 > h.length ? 2 : 3;
                for (1 === b && h.push(P); 4 <
                    h.length;)h.shift();
                k = h.join(",");
                f = h[h.length - 1]
            } else k = P, f = "", g = 1;
            a.setData("Hm_lvt_" + c.id, k, c.age);
            a.setData("Hm_lpvt_" + c.id, P);
            e = P == a.getData("Hm_lpvt_" + c.id) ? "1" : "0";
            if (0 == c.nv && X(document.location.href) && ("" == document.referrer || X(document.referrer)))b = 0, d = 4;
            a.a.nv = b;
            a.a.st = d;
            a.a.cc = e;
            a.a.lt = f;
            a.a.lv = g;
            a.a.si = c.id;
            a.a.su = document.referrer;
            a.a.ds = ka;
            a.a.cl = la + "-bit";
            a.a.ln = ea;
            a.a.ja = da ? 1 : 0;
            a.a.ck = ca ? 1 : 0;
            a.a.lo = "number" == typeof _bdhm_top ? 1 : 0;
            var K = a.a;
            b = "";
            if (navigator.plugins && navigator.mimeTypes.length) {
                var B =
                    navigator.plugins["Shockwave Flash"];
                B && B.description && (b = B.description.replace(/^.*\s+(\S+)\s+\S+$/, "$1"))
            } else if (window.ActiveXObject)try {
                var fa = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                fa && (b = fa.GetVariable("$version")) && (b = b.replace(/^.*\s+(\d+),(\d+).*$/, "$1.$2"))
            } catch (Ea) {
            }
            K.fl = b;
            a.a.v = "1.0.59";
            a.a.cv = decodeURIComponent(a.getData("Hm_cv_" + c.id) || "");
            1 == a.a.nv && (a.a.tt = document.title || "");
            a.a.api = 0;
            var F = document.location.href;
            a.a.cm = q(F, "hmmd") || "";
            a.a.cp = q(F, "hmpl") || "";
            a.a.cw =
                q(F, "hmkw") || "";
            a.a.ci = q(F, "hmci") || "";
            a.a.cf = q(F, "hmsr") || "";
            0 == a.a.nv ? ra() : T(".*");
            if ("" != c.icon) {
                var u, v = c.icon.split("|"), U = "http://tongji.baidu.com/hm-web/welcome/ico?s=" + c.id, V = ("http:" == Q ? "http://eiv" : "https://bs") + ".baidu.com" + v[0] + "." + v[1];
                switch (v[1]) {
                    case "swf":
                        var ga = v[2], ha = v[3], K = "s=" + U, B = "HolmesIcon" + P;
                        u = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="' + B + '" width="' + ga + '" height="' + ha + '"><param name="movie" value="' + V + '" /><param name="flashvars" value="' + (K || "") +
                            '" /><param name="allowscriptaccess" value="always" /><embed type="application/x-shockwave-flash" name="' + B + '" width="' + ga + '" height="' + ha + '" src="' + V + '" flashvars="' + (K || "") + '" allowscriptaccess="always" /></object>';
                        break;
                    case "gif":
                        u = '<a href="' + U + '" target="_blank"><img border="0" src="' + V + '" width="' + v[2] + '" height="' + v[3] + '"></a>';
                        break;
                    default:
                        u = '<a href="' + U + '" target="_blank">' + v[0] + "</a>"
                }
                document.write(u)
            }
            var L = document.location.hash.substring(1), xa = RegExp(c.id), ya = -1 < document.referrer.indexOf("baidu.com") ?
                l : n;
            if (L && xa.test(L) && ya) {
                var M = document.createElement("script");
                M.setAttribute("type", "text/javascript");
                M.setAttribute("charset", "utf-8");
                M.setAttribute("src", Q + "//" + c.js + q(L, "jn") + "." + q(L, "sx") + "?" + a.a.rnd);
                var ia = document.getElementsByTagName("script")[0];
                ia.parentNode.insertBefore(M, ia)
            }
            a.l && a.l();
            a.k && a.k();
            if (c.rec || c.trust)a.a.nv ? (a.c = encodeURIComponent(document.referrer), window.sessionStorage ? s("Hm_from_" + c.id, a.c) : G("Hm_from_" + c.id, a.c, 864E5)) : a.c = (window.sessionStorage ? t("Hm_from_" + c.id) :
                H("Hm_from_" + c.id)) || "";
            a.m && a.m();
            a.n && a.n();
            a.g = new wa;
            I(window, "beforeunload", va(a));
            var w = window._hmt;
            if (w && w.length)for (u = 0; u < w.length; u++) {
                var C = w[u];
                switch (C[0]) {
                    case "_setAccount":
                        1 < C.length && /^[0-9a-z]{32}$/.test(C[1]) && (a.a.api |= 1, window._bdhm_account = C[1]);
                        break;
                    case "_setAutoPageview":
                        if (1 < C.length) {
                            var W = C[1];
                            if (n === W || l === W)a.a.api |= 2, window._bdhm_autoPageview = W
                        }
                }
            }
            if ("undefined" === typeof window._bdhm_account || window._bdhm_account === c.id) {
                window._bdhm_account = c.id;
                var N = window._hmt;
                if (N &&
                    N.length)for (var w = 0, Aa = N.length; w < Aa; w++)a.p(N[w]);
                window._hmt = a.q
            }
            if ("undefined" === typeof window._bdhm_autoPageview || window._bdhm_autoPageview === l)a.i = l, a.a.et = 0, a.a.ep = "", S(a)
        } catch (ja) {
            a = [], a.push("si=" + c.id), a.push("n=" + encodeURIComponent(ja.name)), a.push("m=" + encodeURIComponent(ja.message)), a.push("r=" + encodeURIComponent(document.referrer)), z(Q + "//hm.baidu.com/hm.gif?" + a.join("&"))
        }
    }

    function ua(a) {
        for (var b = [], d = 0, e = ma.length; d < e; d++) {
            var f = ma[d], g = a.a[f];
            "undefined" != typeof g && "" !== g && b.push(f + "=" + encodeURIComponent(g))
        }
        return b.join("&")
    }

    function qa() {
        var a = "Hm_cv_" + c.id;
        try {
            if (y(a, "", {domain: oa(), path: pa(), h: -1}), window.sessionStorage && window.sessionStorage.removeItem(a), window.localStorage)window.localStorage.removeItem(a); else if (D())try {
                A.load(document.location.hostname), A.removeAttribute(a), A.save(document.location.hostname)
            } catch (b) {
            }
        } catch (d) {
        }
    }

    function pa() {
        for (var a = 0, b = c.dm.length; a < b; a++) {
            var d = c.dm[a];
            if (-1 < d.indexOf("/") && za(document.location.href, d))return d.replace(/^[^\/]+(\/.*)/, "$1") + "/"
        }
        return"/"
    }

    function oa() {
        for (var a = document.location.hostname, b = 0, d = c.dm.length; b < d; b++)if (Y(a, c.dm[b]))return c.dm[b].replace(/(:\d+)?[\/\?#].*/, "");
        return a
    }

    function X(a) {
        for (var b = 0; b < c.dm.length; b++)if (-1 < c.dm[b].indexOf("/")) {
            if (za(a, c.dm[b]))return l
        } else {
            var d = r(a);
            if (d && Y(d, c.dm[b]))return l
        }
        return n
    }

    function za(a, b) {
        a = a.replace(/^https?:\/\//, "");
        return 0 == a.indexOf(b)
    }

    function Y(a, b) {
        a = "." + a.replace(/:\d+/, "");
        b = "." + b.replace(/:\d+/, "");
        var d = a.indexOf(b);
        return-1 < d && d + b.length == a.length
    }

    R.prototype.l = function () {
        I(document, "click", Ba(this));
        for (var a = c.etrk.length, b = 0; b < a; b++) {
            var d = c.etrk[b], e = document.getElementById(d.id);
            e && I(e, d.eventType, Ca(this))
        }
    };
    function Ca(a) {
        return function (b) {
            (b.target || b.srcElement).setAttribute("HM_fix", b.clientX + ":" + b.clientY);
            a.a.et = 1;
            a.a.ep = "{id:" + this.id + ",eventType:" + b.type + "}";
            S(a)
        }
    }

    function Ba(a) {
        return function (b) {
            var d = b.target || b.srcElement, e = d.getAttribute("HM_fix"), f = b.clientX + ":" + b.clientY;
            if (e && e == f)d.removeAttribute("HM_fix"); else if (e = c.etrk.length, 0 < e) {
                for (f = {}; d && d != document.body;)d.id && (f[d.id] = ""), d = d.parentNode;
                for (d = 0; d < e; d++) {
                    var g = c.etrk[d];
                    f.hasOwnProperty(g.id) && (a.a.et = 1, a.a.ep = "{id:" + g.id + ",eventType:" + b.type + "}", S(a))
                }
            }
        }
    }

    R.prototype.k = function () {
        var a = this;
        c.ctrk && (I(document, "mouseup", Da(this)), I(window, "beforeunload", function () {
            Z(a)
        }), setInterval(function () {
            Z(a)
        }, 6E5))
    };
    function Da(a) {
        return function (b) {
            var d, e;
            ba ? (e = Math.max(document.documentElement.scrollTop, document.body.scrollTop), d = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft), d = b.clientX + d, e = b.clientY + e) : (d = b.pageX, e = b.pageY);
            var f = window.innerWidth || document.documentElement.clientWidth || document.body.offsetWidth;
            switch (c.align) {
                case 1:
                    d -= f / 2;
                    break;
                case 2:
                    d -= f
            }
            d = "{x:" + d + ",y:" + e + ",";
            b = b.target || b.srcElement;
            if ("a" != b.tagName.toLowerCase())a:{
                for (e = "A"; (b = b.parentNode) && 1 == b.nodeType;)if (b.tagName ==
                    e)break a;
                b = m
            }
            b = d = b ? d + ("t:a,u:" + encodeURIComponent(b.href) + "}") : d + "t:b}";
            "" != b && (d = (Q + "//hm.baidu.com/hm.gif?" + ua(a).replace(/ep=[^&]*/, "ep=" + encodeURIComponent("[" + b + "]"))).length, 1024 < d + 10 || (1024 < d + encodeURIComponent(a.b.join(",") + (a.b.length ? "," : "")).length + 10 && Z(a), a.b.push(b), (10 <= a.b.length || /t:a/.test(b)) && Z(a)))
        }
    }

    function Z(a) {
        0 != a.b.length && (a.a.et = 2, a.a.ep = "[" + a.b.join(",") + "]", S(a), a.b = [])
    }

    R.prototype.m = function () {
        var a = this;
        c.rec && aa(function () {
            for (var b = 0, d = c.rp.length; b < d; b++) {
                var e = c.rp[b][0], f = c.rp[b][1], g = document.getElementById("hm_t_" + e);
                if (f && !(2 == f && !g || g && "" != g.innerHTML))f = document.createElement("script"), f.charset = "utf-8", f.src = "http://crs.baidu.com/t.js?" + ["siteId=" + c.id, "planId=" + e, "from=" + a.c, "referer=" + encodeURIComponent(document.referrer), "title=" + encodeURIComponent(document.title), "rnd=" + Math.round(2147483647 * Math.random())].join("&"), e = document.getElementsByTagName("script")[0],
                    e.parentNode.insertBefore(f, e)
            }
        })
    };
    R.prototype.n = function () {
        if (c.trust && c.vcard && "https:" != Q) {
            var a = document.createElement("script");
            a.charset = "utf-8";
            a.src = "http://trust.baidu.com/vcard/v.js?" + ["siteid=" + c.vcard, "url=" + encodeURIComponent(document.location.href), "source=" + this.c, "rnd=" + Math.round(2147483647 * Math.random())].join("&");
            var b = document.getElementsByTagName("script")[0];
            b.parentNode.appendChild(a, b)
        }
    };
    function wa() {
        this.f = this.o = (new Date).getTime();
        this.j = 0;
        "object" == typeof document.onfocusin ? (I(document, "focusin", $(this)), I(document, "focusout", $(this))) : (I(window, "focus", $(this)), I(window, "blur", $(this)))
    }

    function $(a) {
        return function (b) {
            if (!(b.target && b.target != window)) {
                if ("blur" == b.type || "focusout" == b.type)a.j += (new Date).getTime() - a.f;
                a.f = (new Date).getTime()
            }
        }
    }

    new R;
})();
