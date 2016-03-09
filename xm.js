/*mst.js v3.1.11*/
(function () {
    function a(a) {
        var c = document.cookie, d = b(c), e = d.split(";");
        for (var f = 0; f < e.length; f++) {
            var g = e[f].split("=");
            if (g.length > 1 && g[0] == a)return g[1]
        }
        return""
    }

    function b(a) {
        var b = "";
        for (var c = 0; c < a.length; c++) {
            var d = a.charAt(c);
            d != " " && (b += d)
        }
        return b
    }

    function c(a, b) {
        var c = new Date;
        c.setTime(c.getTime() + 31104e6);
        var d = a + "=" + b + ";" + "path=/;domain=.xiaomi.com;expires=" + c.toGMTString();
        window.document.cookie = d
    }

    function d(a) {
        var b = /.*\:\/\/([^\/]*).*/, c = a.match(b), d = "";
        return typeof c != "undefined" && null != c && (d = c[1]), d
    }

    function e() {
        var a = new Date, b = a.getTime() + "_" + Math.round(Math.random() * 1e4);
        return b
    }

    function f(a) {
        var b = document.createElement("script");
        b.type = "text/javascript", b.async = !0, b.src = a;
        var c = document.getElementsByTagName("script")[0];
        c.parentNode.insertBefore(b, c)
    }

    function g(a, b, c) {
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent ? a.attachEvent("on" + b, c) : a["on" + b] = c
    }

    function h(a) {
        a && a.preventDefault ? a.preventDefault() : event.returnValue = !1
    }

    var i = document.location.href.replace(/&/g, "|"), j = document.referrer.replace(/&/g, "|");
    j = j.toLowerCase();
    if (j) {
        var k = d(j);
        (k.indexOf(".xiaomi.com") < 0 || k.indexOf("p.www.xiaomi.com") > -1 || k.indexOf("a.union.xiaomi.com") > -1) && c("lastsource", k)
    }
    var l = a("PHPSESSID"), m = a("mstuid"), n = a("muuid"), o = a("mucid"), p = a("mstprevpid"), q = a("lastsource");
    m === "" && (m = e(), c("mstuid", m));
    var r = new Date, s = "phpsessid=" + l + "&mstuid=" + m + "&muuid=" + n + "&mucid=" + o + "&mstprevpid=" + p + "&lastsource=" + q + "&timestamp=" + r.getTime() + "&ref=" + encodeURIComponent(j), t = "http://a.stat.xiaomi.com/js/mstr.js?";
    f(t + s);
    var u = document.getElementsByTagName("a");
    for (var v = 0; v < u.length; v++) {
        var w = u[v], x = w.getAttribute("mstpid");
        x && g(w, "click", function (a) {
            var b = this.getAttribute("mstpid"), c = this.getAttribute("mstgid"), d = this.getAttribute("href");
            h(a), p != b && (document.cookie = "mstprevpid=" + b + ";" + "path=/;domain=.xiaomi.com");
            var e = "mstpid=" + b + "&mstgid=" + c + "&" + s + "&target=" + d;
            f(t + e), window.setTimeout(function () {
                window.location = d
            }, 200)
        })
    }
})();
var mst = {url: "http://a.stat.xiaomi.com/js/mstr.js?", setLink: function () {
    var a = document.getElementsByTagName("a");
    for (var b = 0; b < a.length; b++) {
        var c = a[b], d = c.getAttribute("mstpid");
        d && bind(c, "click", this.pushLink)
    }
}, pushLink: function (a) {
    var b = a.getAttribute("mstpid"), c = a.getAttribute("mstgid"), d = a.getAttribute("href"), e = new Date, f = this.getCookie("mstprevpid");
    f != b && (document.cookie = "mstprevpid=" + b + ";" + "path=/;domain=.xiaomi.com");
    var g = "mstuid=" + this.getCookie("mstuid") + "&muuid=" + this.getCookie("muuid") + "&mucid=" + this.getCookie("mucid") + "&mstprevpid=" + this.getCookie("mstprevpid") + "&lastsource=" + this.getCookie("lastsource") + "&timestamp=" + e.getTime(), h = "mstpid=" + b + "&mstgid=" + c + "&" + g + "&target=" + d;
    this.creatSrcipt(this.url + h), window.setTimeout(function () {
        window.location = d
    }, 200)
}, getCookie: function (a) {
    var b = document.cookie, c = this.removeBlanks(b), d = c.split(";");
    for (var e = 0; e < d.length; e++) {
        var f = d[e].split("=");
        if (f.length > 1 && f[0] == a)return f[1]
    }
    return""
}, creatSrcipt: function (a) {
    var b = document.createElement("script");
    b.type = "text/javascript", b.async = !0, b.src = a;
    var c = document.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(b, c)
}, removeBlanks: function (a) {
    var b = "";
    for (var c = 0; c < a.length; c++) {
        var d = a.charAt(c);
        d != " " && (b += d)
    }
    return b
}};
