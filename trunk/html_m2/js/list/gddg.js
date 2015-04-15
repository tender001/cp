var GddgSlide = function(a) {
    a = a || {};
    var b = {
        slideCell: a.slideCell || "#touchSlide",
        titCell: a.titCell || ".hd li",
        mainCell: a.mainCell || ".bd",
        effect: a.effect || "left",
        autoPlay: a.autoPlay || !1,
        delayTime: a.delayTime || 200,
        interTime: a.interTime || 2500,
        defaultIndex: a.defaultIndex || 0,
        titOnClassName: a.titOnClassName || "cur",
        autoPage: a.autoPage || !1,
        prevCell: a.prevCell || ".prev",
        nextCell: a.nextCell || ".next",
        pageStateCell: a.pageStateCell || ".pageState",
        pnLoop: "undefined " == a.pnLoop ? !0 : a.pnLoop,
        startFun: a.startFun || null,
        endFun: a.endFun || null,
        switchLoad: a.switchLoad || null
    },
    c = document.getElementById(b.slideCell.replace("#", ""));
    if (!c) return ! 1;
    var d = function(a, b) {
        a = a.split(" ");
        var c = [];
        b = b || document;
        var d = [b];
        for (var e in a) 0 != a[e].length && c.push(a[e]);
        for (var e in c) {
            if (0 == d.length) return ! 1;
            var f = [];
            for (var g in d) if ("#" == c[e][0]) f.push(document.getElementById(c[e].replace("#", "")));
            else if ("." == c[e][0]) for (var h = d[g].getElementsByTagName("*"), i = 0; i < h.length; i++) {
                var j = h[i].className;
                j && -1 != j.search(new RegExp("\\b" + c[e].replace(".", "") + "\\b")) && f.push(h[i])
            } else for (var h = d[g].getElementsByTagName(c[e]), i = 0; i < h.length; i++) f.push(h[i]);
            d = f
        }
        return 0 == d.length || d[0] == b ? !1 : d
    },
    e = function(a, b) {
        var c = document.createElement("div");
        c.innerHTML = b,
        c = c.children[0];
        var d = a.cloneNode(!0);
        return c.appendChild(d),
        a.parentNode.replaceChild(c, a),
        m = d,
        c
    },
    g = function(a, b) { ! a || !b || a.className && -1 != a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className += (a.className ? " ": "") + b)
    },
    h = function(a, b) { ! a || !b || a.className && -1 == a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className = a.className.replace(new RegExp("\\s*\\b" + b + "\\b", "g"), ""))
    },
    i = b.effect,
    j = d(b.prevCell, c)[0],
    k = d(b.nextCell, c)[0],
    l = d(b.pageStateCell)[0],
    m = d(b.mainCell, c)[0];
    if (!m) return ! 1;
    var N, O, n = m.children.length,
    o = d(b.titCell, c),
    p = o ? o.length: n,
    q = b.switchLoad,
    r = parseInt(b.defaultIndex),
    s = parseInt(b.delayTime),
    t = parseInt(b.interTime),
    u = "false" == b.autoPlay || 0 == b.autoPlay ? !1 : !0,
    v = "false" == b.autoPage || 0 == b.autoPage ? !1 : !0,
    w = "false" == b.pnLoop || 0 == b.pnLoop ? !1 : !0,
    x = r,
    y = null,
    z = null,
    A = null,
    B = 0,
    C = 0,
    D = 0,
    E = 0,
    G = /hp-tablet/gi.test(navigator.appVersion),
    H = "ontouchstart" in window && !G,
    I = H ? "touchstart": "mousedown",
    J = H ? "touchmove": "",
    K = H ? "touchend": "mouseup",
    M = m.parentNode.clientWidth,
    P = n;
    "leftLoop" == i && (P += 2, m.appendChild(m.children[0].cloneNode(!0)), m.insertBefore(m.children[n - 1].cloneNode(!0), m.children[0])),
    N = e(m, '<div class="tempWrap" style="overflow:hidden; position:relative;"></div>'),
    m.style.cssText = "width:" + P * M + "px;" + "position:relative;overflow:hidden;padding:0;margin:0;";
    for (var R = 0; P > R; R++) m.children[R].style.cssText = "display:table-cell;vertical-align:top;width:" + M + "px";
    var S = function() {
        "function" == typeof b.startFun && b.startFun(r, p)
    },
    T = function() {
        "function" == typeof b.endFun && b.endFun(r, p)
    },
    U = function(a) {
        var b = ("leftLoop" == i ? r + 1 : r) + a,
        c = function(a) {
            for (var b = m.children[a].getElementsByTagName("img"), c = 0; c < b.length; c++) b[c].getAttribute(q) && (b[c].setAttribute("src", b[c].getAttribute(q)), b[c].removeAttribute(q))
        };
        if (c(b), "leftLoop" == i) switch (b) {
        case 0:
            c(n);
            break;
        case 1:
            c(n + 1);
            break;
        case n:
            c(0);
            break;
        case n + 1 : c(1)
        }
    },
    V = function() {
        M = N.clientWidth,
        m.style.width = P * M + "px";
        for (var a = 0; P > a; a++) m.children[a].style.width = M + "px";
        var b = "leftLoop" == i ? r + 1 : r;
        W( - b * M, 0)
    };
    window.addEventListener("resize", V, !1);
    var W = function(a, b, c) {
        c = c ? c.style: m.style,
        c.webkitTransitionDuration = c.MozTransitionDuration = c.msTransitionDuration = c.OTransitionDuration = c.transitionDuration = b + "ms",
        c.webkitTransform = "translate(" + a + "px,0)" + "translateZ(0)",
        c.msTransform = c.MozTransform = c.OTransform = "translateX(" + a + "px)"
    },
    X = function(a) {
        switch (i) {
        case "left":
            r >= p ? r = a ? r - 1 : 0 : 0 > r && (r = a ? 0 : p - 1),
            null != q && U(0),
            W( - r * M, s),
            x = r;
            break;
        case "leftLoop":
            null != q && U(0),
            W( - (r + 1) * M, s),
            -1 == r ? (z = setTimeout(function() {
                W( - p * M, 0)
            },
            s), r = p - 1) : r == p && (z = setTimeout(function() {
                W( - M, 0)
            },
            s), r = 0),
            x = r
        }
        S(),
        A = setTimeout(function() {
            CP.GDDG.dz(r);
            T()
        },
        s);
        c == r && g(o[c], b.titOnClassName);
        0 == w && (h(k, "nextStop"), h(j, "prevStop"), 0 == r ? g(j, "prevStop") : r == p - 1 && g(k, "nextStop")),
        l && (l.innerHTML = "<span>" + (r + 1) + "</span>/" + p)
    };
    if (X(), u && (y = setInterval(function() {
        r++,
        X()
    },
    t)), o) for (var R = 0; p > R; R++) !
    function() {
        var a = R;
        o[a].addEventListener("click",
        function() {
            clearTimeout(z),
            clearTimeout(A),
            r = a,
            X()
        })
    } ();
    k && k.addEventListener("click",
    function() { (1 == w || r != p - 1) && (clearTimeout(z), clearTimeout(A), r++, X())
    }),
    j && j.addEventListener("click",
    function() { (1 == w || 0 != r) && (clearTimeout(z), clearTimeout(A), r--, X())
    });
    var Y = function(a) {
        clearTimeout(z),
        clearTimeout(A),
        O = void 0,
        D = 0;
        var b = H ? a.touches[0] : a;
        B = b.pageX,
        C = b.pageY,
        m.addEventListener(J, Z, !1),
        m.addEventListener(K, $, !1)
    },
    Z = function(a) {
        if (!H || !(a.touches.length > 1 || a.scale && 1 !== a.scale)) {
            var b = H ? a.touches[0] : a;
            if (D = b.pageX - B, E = b.pageY - C, "undefined" == typeof O && (O = !!(O || Math.abs(D) < Math.abs(E))), !O) {
                switch (a.preventDefault(), u && clearInterval(y), i) {
                case "left":
                    (0 == r && D > 0 || r >= p - 1 && 0 > D) && (D = .4 * D),
                    W( - r * M + D, 0);
                    break;
                case "leftLoop":
                    W( - (r + 1) * M + D, 0)
                }
                null != q && Math.abs(D) > M / 3 && U(D > -0 ? -1 : 1)
            }
        }
    },
    $ = function(a) {
        0 != D && (a.preventDefault(), O || (Math.abs(D) > M / 10 && (D > 0 ? r--:r++), X(!0), u && (y = setInterval(function() {
            r++,
            X()
        },
        t))), m.removeEventListener(J, Z, !1), m.removeEventListener(K, $, !1))
    };
    m.addEventListener(I, Y, !1)
};
jQuery.easing["jswing"] = jQuery.easing["swing"];
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /= d) < 1 / 2.75) {
            return c * (7.5625 * t * t) + b
        } else if (t < 2 / 2.75) {
            return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b
        } else if (t < 2.5 / 2.75) {
            return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b
        } else {
            return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b
        }
    }
});
CP.GDDG = function() {
    var $sf = [],
    $rq = [],
    $bf = [],
    $jq = [],
    $bqc = [];
    var dom = {
        dg_sf: $("#dg_sf"),
        dg_rq: $("#dg_rq"),
        dg_bf: $("#dg_bf"),
        dg_jq: $("#dg_jq"),
        dg_bqc: $("#dg_bqc"),
        sf_s: $("#sf_scroll"),
        rq_s: $("#rq_scroll"),
        bf_s: $("#bf_scroll"),
        jq_s: $("#jq_scroll"),
        bqc_s: $("#bqc_scroll"),
        money: $("#money"),
        buyFooter: $(".buyFooter")
    };
    var g = {
        money: 0,
        bet: 1,
        count: 0,
        spArr: [],
        pass: [],
        amount: 0,
        hmMoney: 0,
        bonus: 0,
        curChangCi: 0,
        buyType: 1,
        codes: "",
        loty_id: "",
        qihao_id: ""
    };
    var lotid = {
        sf: "90",
        rq: "72",
        bf: "91",
        jq: "93",
        bqc: "92"
    };
    var poll = {
        sf: "dg_spf_PollNum",
        rq: "dg_rqspf_PollNum",
        bf: "dg_bf_PollNum",
        jq: "dg_jq_PollNum",
        bqc: "dg_bqc_PollNum"
    };
    var F = {
        sf: "SPF",
        rq: "RQSPF",
        bf: "CBF",
        jq: "JQS",
        bqc: "BQC"
    };
    var o = {
        pageGo: {
            goBack: function() {
                TopAnch.init({
                    title: "竞彩-买一场",
                    prevShow: true,
                    prevFun: function() {
                        window.location.href = "#type=index"
                    }
                })
            }
        },
        slide: function(_obj) {
            var menu = $(_obj.menu);
            var con = $(_obj.con);
            var slideBox = $(_obj.slideBox) || "";
            menu.click(function() {
                var index = $(this).index();
                $("#top_con").css({
                    height: $("#top_con section:eq(" + index + ")").height() + "px"
                });
                var conW = con.width();
                var w = menu.eq(index).position().left + (menu.eq(index).width() - slideBox.width()) / 2;
                slideBox != "" ? slideBox.stop(true, false).animate({
                    left: w
                },
                _obj.menuSpeed || 100) : "";
                $(this).addClass("cur").siblings().removeClass("cur");
                con.each(function(i) {
                    $(this).stop(true, false).animate({
                        left: i < index ? -conW: i > index ? conW: ""
                    },
                    _obj.conSpeed || 300, _obj.effect || "");
                    i == index ? $(this).stop(true, false).animate({
                        left: 0
                    },
                    _obj.conSpeed || 300, _obj.effect || "") : ""
                });
                o.change(index)
            })
        },
        init: function() {
            $.ajax({
                url: CP.Data.data + "/cpdata/match/jczq/jczq_hh.xml",
                type: "get",
                dataType: "xml",
                success: function(xml) {
                    var r = $(xml).find("row"); ! r.length && alert("暂无比赛数据");
                    var html_spf = "",
                    html_rq = "",
                    html_bf = "",
                    html_jq = "",
                    html_bqc = "",
                    spf_a = 0,
                    rq_a = 0,
                    bf_a = 0,
                    jq_a = 0,
                    bqc_a = 0;
                    r.each(function() {
                        var sf = {},
                        rq = {},
                        bf = {},
                        jq = {},
                        bqc = {};
                        var itemid = $(this).attr("itemid");
                        var hn = $(this).attr("hn").substr(0, 4);
                        var gn = $(this).attr("gn").substr(0, 4);
                        var mt = $(this).attr("mt");
                        mt = mt.substring(0, mt.length - 3);
                        var mname = $(this).attr("mname").substr(0, 4);
                        var close = $(this).attr("close");
                        var isale = $(this).attr("isale");
                        var spf = $(this).attr("spf");
                        var rqspf = $(this).attr("rspf");
                        var cbf = $(this).attr("cbf");
                        var jqs = $(this).attr("jqs");
                        var bqc1 = $(this).attr("bqc");
                        var spfscale = "--,--,--";
                        var rqspfscale = "--,--,--";
                        var idanguan = $(this).attr("idanguan");
                        if (((idanguan*1) & 1 << 4) == (1 << 4)) {
                            sf.itemid = itemid;
                            sf.hn = hn;
                            sf.gn = gn;
                            sf.mt = mt;
                            sf.spf = spf;
                            sf.spfscale = spfscale;
                            $sf[spf_a] = sf;
                            html_spf += "<li><div><cite>" + hn + "</cite><i>vs</i><em>" + gn + "</em></div><p>" + mname + " " + mt + "开赛</p></li>";
                            spf_a++
                        }
                        if (((idanguan*1) & 1 << 3) == (1 << 3)) {
                            rq.itemid = itemid;
                            rq.hn = hn;
                            rq.gn = gn;
                            rq.mt = mt;
                            rq.close = close;
                            rq.rqspf = rqspf;
                            rq.rqspfscale = rqspfscale;
                            $rq[rq_a] = rq;
                            html_rq += "<li><div><cite>" + hn + "</cite><i>vs</i><em>" + gn + "</em></div><p>" + mname + " " + mt + "开赛</p></li>";
                            rq_a++
                        }
                        if (((idanguan*1) & 1 << 1) == (1 << 1)) {
                            bf.itemid = itemid;
                            bf.hn = hn;
                            bf.gn = gn;
                            bf.mt = mt;
                            bf.cbf = cbf;
                            $bf[bf_a] = bf;
                            html_bf += "<li><div><cite>" + hn + "</cite><i>vs</i><em>" + gn + "</em></div><p>" + mname + " " + mt + "开赛</p></li>";
                            bf_a++
                        }
                        if (((idanguan*1) & 1 << 4) == (1 << 4)) {
                            jq.itemid = itemid;
                            jq.hn = hn;
                            jq.gn = gn;
                            jq.mt = mt;
                            jq.jqs = jqs;
                            $jq[jq_a] = jq;
                            html_jq += "<li><div><cite>" + hn + "</cite><i>vs</i><em>" + gn + "</em></div><p>" + mname + " " + mt + "开赛</p></li>";
                            jq_a++
                        }
                        if (((idanguan*1) & 1 << 1) == (1 << 1)) {
                            bqc.itemid = itemid;
                            bqc.hn = hn;
                            bqc.gn = gn;
                            bqc.mt = mt;
                            bqc.bqc = bqc1;
                            $bqc[bqc_a] = bqc;
                            html_bqc += "<li><div><cite>" + hn + "</cite><i>vs</i><em>" + gn + "</em></div><p>" + mname + " " + mt + "开赛</p></li>";
                            bqc_a++
                        }
                    });
                    if (spf_a == 0 && rq_a != 0) {
                        $("#top_menu li").eq(1).click()
                    } else if (spf_a == 0 && rq_a == 0 && bf_a != 0) {
                        $("#top_menu li").eq(2).click()
                    }
                    if (spf_a < 2) {
                        $("#sfScroll .next").hide()
                    }
                    if (rq_a < 2) {
                        $("#rqScroll .next").hide()
                    }
                    if (bf_a < 2) {
                        $("#bfScroll .next").hide()
                    }
                    if (jq_a < 2) {
                        $("#jqScroll .next").hide()
                    }
                    if (bqc_a < 2) {
                        $("#bqcScroll .next").hide()
                    }
                    dom.sf_s.html(html_spf);
                    dom.rq_s.html(html_rq);
                    dom.bf_s.html(html_bf);
                    dom.jq_s.html(html_jq);
                    dom.bqc_s.html(html_bqc);
                    GddgSlide({
                        slideCell: "#sfScroll",
                        mainCell: ".gddgbd ul",
                        autoPage: true,
                        pnLoop: "false"
                    });
                    GddgSlide({
                        slideCell: "#rqScroll",
                        mainCell: ".gddgbd ul",
                        autoPage: true,
                        pnLoop: "false"
                    });
                    GddgSlide({
                        slideCell: "#bfScroll",
                        mainCell: ".gddgbd ul",
                        autoPage: true,
                        pnLoop: "false"
                    });
                    GddgSlide({
                        slideCell: "#jqScroll",
                        mainCell: ".gddgbd ul",
                        autoPage: true,
                        pnLoop: "false"
                    });
                    GddgSlide({
                        slideCell: "#bqcScroll",
                        mainCell: ".gddgbd ul",
                        autoPage: true,
                        pnLoop: "false"
                    });
                    $rq.length && o.duizhen("0", "rq");
                    $bf.length && o.duizhen("0", "bf");
                    $jq.length && o.duizhen("0", "jq");
                    $bqc.length && o.duizhen("0", "bqc")
                }
            })
        },
        change: function(index) {
            if (index == "1") { ! $rq.length && alert("暂无比赛对阵")
            } else if (index == "2") { ! $bf.length && alert("暂无比赛对阵")
            } else if (index == "3") { ! $jq.length && alert("暂无比赛对阵")
            } else if (index == "4") { ! $bqc.length && alert("暂无比赛对阵")
            }
            $("#top_con section:eq(" + index + ")").find(".cur").removeClass("cur");
            $("#money input").val("10");
            dom.buyFooter.find("a:eq(1)").html("猜中比赛结果即获奖");
            dom.money.find(".pdTop03").hide()
        },
        duizhen: function(t, xo) {
            var lot = xo || $("#top_menu .cur").attr("v");
            if (lot == "sf") { ! $sf.length && alert("暂无比赛对阵");
                var x = $sf[t].spf.split(",");
                var x1 = x[0],
                x2 = x[1],
                x3 = x[2];
                dom.dg_sf.find(".tzxx").attr("v", $sf[t].itemid);
                dom.dg_sf.find(".tzxx li:eq(0) span:eq(0)").attr("s", x1);
                dom.dg_sf.find(".tzxx li:eq(0) span:eq(1)").attr("s", x2);
                dom.dg_sf.find(".tzxx li:eq(0) span:eq(2)").attr("s", x3);
                dom.dg_sf.find(".tzxx li:eq(0) span:eq(0) cite").html($sf[t].hn);
                dom.dg_sf.find(".tzxx li:eq(0) span:eq(2) cite").html($sf[t].gn);
                dom.dg_sf.find(".tzxx li:eq(1) em:eq(0)").html("赔率" + x1);
                dom.dg_sf.find(".tzxx li:eq(1) em:eq(1)").html("赔率" + x2);
                dom.dg_sf.find(".tzxx li:eq(1) em:eq(2)").html("赔率" + x3);
                var scale = $sf[t].spfscale.split(",");
                var z = parseInt(scale[0]);
                var p = parseInt(scale[1]);
                var k = parseInt(scale[2]);
                if (!isNaN(z)) {
                    dom.dg_sf.find(".gddghot p:eq(0) em").html(z + "%人气");
                    dom.dg_sf.find(".gddghot p:eq(0) i").css({
                        height: z * 5 / 100 + "rem"
                    });
                    dom.dg_sf.find(".gddghot p:eq(1) em").html(p + "%人气");
                    dom.dg_sf.find(".gddghot p:eq(1) i").css({
                        height: p * 5 / 100 + "rem"
                    });
                    dom.dg_sf.find(".gddghot p:eq(2) em").html(100 - z - p + "%人气");
                    dom.dg_sf.find(".gddghot p:eq(2) i").css({
                        height: k * 5 / 100 + "rem"
                    })
                }
            } else if (lot == "rq") {
                var x = $rq[t].rqspf.split(",");
                var x1 = x[0],
                x2 = x[1],
                x3 = x[2];
                dom.dg_rq.find(".tzxx").attr("v", $rq[t].itemid);
                dom.dg_rq.find(".tzxx li:eq(0) span:eq(0)").attr("s", x1);
                dom.dg_rq.find(".tzxx li:eq(0) span:eq(1)").attr("s", x2);
                dom.dg_rq.find(".tzxx li:eq(0) span:eq(2)").attr("s", x3);
                dom.dg_rq.find(".tzxx li:eq(0) span:eq(0) cite").html($rq[t].hn + "(" + $rq[t].close + ")");
                dom.dg_rq.find(".tzxx li:eq(0) span:eq(2) cite").html($rq[t].gn);
                dom.dg_rq.find(".tzxx li:eq(1) em:eq(0)").html("赔率" + x1);
                dom.dg_rq.find(".tzxx li:eq(1) em:eq(1)").html("赔率" + x2);
                dom.dg_rq.find(".tzxx li:eq(1) em:eq(2)").html("赔率" + x3);
                var scale = $rq[t].rqspfscale.split(",");
                var z = parseInt(scale[0]);
                var p = parseInt(scale[1]);
                var k = parseInt(scale[2]);
                if (!isNaN(z)) {
                    dom.dg_rq.find(".gddghot p:eq(0) em").html(z + "%人气");
                    dom.dg_rq.find(".gddghot p:eq(0) i").css({
                        height: z * 5 / 100 + "rem"
                    });
                    dom.dg_rq.find(".gddghot p:eq(1) em").html(p + "%人气");
                    dom.dg_rq.find(".gddghot p:eq(1) i").css({
                        height: p * 5 / 100 + "rem"
                    });
                    dom.dg_rq.find(".gddghot p:eq(2) em").html(100 - z - p + "%人气");
                    dom.dg_rq.find(".gddghot p:eq(2) i").css({
                        height: k * 5 / 100 + "rem"
                    })
                }
            } else if (lot == "bf") {
                dom.dg_bf.find(".gddgtitle em:eq(0)").html($bf[t].hn + "&nbsp;胜");
                dom.dg_bf.find(".gddgtitle em:eq(2)").html($bf[t].gn + "&nbsp;胜");
                var x = $bf[t].cbf.split(",");
                dom.dg_bf.find(".tzxx").attr("v", $bf[t].itemid);
                dom.dg_bf.find(".tzxx li:eq(1) em:eq(0)").html("赔率" + x[0]);
                dom.dg_bf.find(".tzxx li:eq(1) em:eq(1)").html("赔率" + x[13]);
                dom.dg_bf.find(".tzxx li:eq(1) em:eq(2)").html("赔率" + x[18]);
                dom.dg_bf.find(".tzxx li:eq(3) em:eq(0)").html("赔率" + x[1]);
                dom.dg_bf.find(".tzxx li:eq(3) em:eq(1)").html("赔率" + x[14]);
                dom.dg_bf.find(".tzxx li:eq(3) em:eq(2)").html("赔率" + x[19]);
                dom.dg_bf.find(".tzxx li:eq(5) em:eq(0)").html("赔率" + x[2]);
                dom.dg_bf.find(".tzxx li:eq(5) em:eq(1)").html("赔率" + x[15]);
                dom.dg_bf.find(".tzxx li:eq(5) em:eq(2)").html("赔率" + x[20]);
                dom.dg_bf.find(".tzxx li:eq(7) em:eq(0)").html("赔率" + x[3]);
                dom.dg_bf.find(".tzxx li:eq(7) em:eq(1)").html("赔率" + x[16]);
                dom.dg_bf.find(".tzxx li:eq(7) em:eq(2)").html("赔率" + x[21]);
                dom.dg_bf.find(".tzxx li:eq(9) em:eq(0)").html("赔率" + x[4]);
                dom.dg_bf.find(".tzxx li:eq(9) em:eq(1)").html("赔率" + x[17]);
                dom.dg_bf.find(".tzxx li:eq(9) em:eq(2)").html("赔率" + x[22]);
                $(".bfPop .bfcom em").each(function(a) {
                    $(this).html(x[a])
                });
                $(".bfPop .bfTitle label:eq(0)").html($bf[t].hn);
                $(".bfPop .bfTitle label:eq(1)").html($bf[t].gn);
                $(".bfPop .red").html($bf[t].hn + "&nbsp;&nbsp;胜");
                $(".bfPop .green").html($bf[t].gn + "&nbsp;&nbsp;胜")
            } else if (lot == "jq") {
                var x = $jq[t].jqs.split(",");
                dom.dg_jq.find(".tzxx").attr("v", $jq[t].itemid);
                dom.dg_jq.find(".tzxx li:eq(0) span:eq(0)").attr("s", x[0]);
                dom.dg_jq.find(".tzxx li:eq(0) span:eq(1)").attr("s", x[1]);
                dom.dg_jq.find(".tzxx li:eq(0) span:eq(2)").attr("s", x[2]);
                dom.dg_jq.find(".tzxx li:eq(0) span:eq(3)").attr("s", x[3]);
                dom.dg_jq.find(".tzxx li:eq(2) span:eq(0)").attr("s", x[4]);
                dom.dg_jq.find(".tzxx li:eq(2) span:eq(1)").attr("s", x[5]);
                dom.dg_jq.find(".tzxx li:eq(2) span:eq(2)").attr("s", x[6]);
                dom.dg_jq.find(".tzxx li:eq(2) span:eq(3)").attr("s", x[7]);
                dom.dg_jq.find(".tzxx li:eq(1) em:eq(0)").html("赔率" + x[0]);
                dom.dg_jq.find(".tzxx li:eq(1) em:eq(1)").html("赔率" + x[1]);
                dom.dg_jq.find(".tzxx li:eq(1) em:eq(2)").html("赔率" + x[2]);
                dom.dg_jq.find(".tzxx li:eq(1) em:eq(3)").html("赔率" + x[3]);
                dom.dg_jq.find(".tzxx li:eq(3) em:eq(0)").html("赔率" + x[4]);
                dom.dg_jq.find(".tzxx li:eq(3) em:eq(1)").html("赔率" + x[5]);
                dom.dg_jq.find(".tzxx li:eq(3) em:eq(2)").html("赔率" + x[6]);
                dom.dg_jq.find(".tzxx li:eq(3) em:eq(3)").html("赔率" + x[7])
            } else if (lot == "bqc") {
                var x = $bqc[t].bqc.split(",");
                dom.dg_bqc.find(".tzxx").attr("v", $bqc[t].itemid);
                dom.dg_bqc.find(".tzxx li:eq(0) span:eq(0)").attr("s", x[0]);
                dom.dg_bqc.find(".tzxx li:eq(2) span:eq(0)").attr("s", x[1]);
                dom.dg_bqc.find(".tzxx li:eq(4) span:eq(0)").attr("s", x[2]);
                dom.dg_bqc.find(".tzxx li:eq(0) span:eq(1)").attr("s", x[3]);
                dom.dg_bqc.find(".tzxx li:eq(2) span:eq(1)").attr("s", x[4]);
                dom.dg_bqc.find(".tzxx li:eq(4) span:eq(1)").attr("s", x[5]);
                dom.dg_bqc.find(".tzxx li:eq(0) span:eq(2)").attr("s", x[6]);
                dom.dg_bqc.find(".tzxx li:eq(2) span:eq(2)").attr("s", x[7]);
                dom.dg_bqc.find(".tzxx li:eq(4) span:eq(2)").attr("s", x[8]);
                dom.dg_bqc.find(".tzxx li:eq(1) em:eq(0)").html("赔率" + x[0]);
                dom.dg_bqc.find(".tzxx li:eq(3) em:eq(0)").html("赔率" + x[1]);
                dom.dg_bqc.find(".tzxx li:eq(5) em:eq(0)").html("赔率" + x[2]);
                dom.dg_bqc.find(".tzxx li:eq(1) em:eq(1)").html("赔率" + x[3]);
                dom.dg_bqc.find(".tzxx li:eq(3) em:eq(1)").html("赔率" + x[4]);
                dom.dg_bqc.find(".tzxx li:eq(5) em:eq(1)").html("赔率" + x[5]);
                dom.dg_bqc.find(".tzxx li:eq(1) em:eq(2)").html("赔率" + x[6]);
                dom.dg_bqc.find(".tzxx li:eq(3) em:eq(2)").html("赔率" + x[7]);
                dom.dg_bqc.find(".tzxx li:eq(5) em:eq(2)").html("赔率" + x[8])
            }
            o.count()
        },
        count: function() {
            var bs = dom.money.find("input").val() / 2;
            var t = $("#top_menu .cur").attr("v");
            var je = $("#money input").val();
            var l = "";
            if (t == "bf") {
                l = $(".bfPop").find(".cur").length
            } else {
                l = $("#dg_" + t).find(".tzxx .cur").length
            }
            if (je == "" || parseInt(je) < 2 || l == "0") {
                dom.buyFooter.find("a:eq(1)").html("猜中比赛结果即获奖")
            } else {
                je = parseInt(je) * l;
                dom.buyFooter.find("a:eq(1)").html("立即付款   " + je + "元");
                $("#zje").html(je);
                dom.buyFooter.find("a:eq(1)").attr("v", je)
            }
            var max = 0,
            min = 99999;
            if (l == "0") {
                dom.money.find(".pdTop03").hide()
            } else if (l == "1") {
                if (t == "bf") {
                    max = parseFloat($(".bfPop").find(".cur").find("em").html())
                } else {
                    max = $("#dg_" + t).find(".tzxx .cur").attr("s")
                }
                dom.money.find(".pdTop03").show();
                dom.money.find(".pdTop03 em").html((2 * bs * max).toFixed("1"))
            } else {
                if (t == "bf") {
                    $(".bfPop").find(".cur").each(function() {
                        var t = parseFloat($(this).find("em").html());
                        max = max > t ? max: t;
                        min = min < t ? min: t
                    })
                } else {
                    $("#dg_" + t).find(".tzxx .cur").each(function() {
                        var t = parseFloat($(this).attr("s"));
                        max = max > t ? max: t;
                        min = min < t ? min: t
                    })
                }
                dom.money.find(".pdTop03").show();
                dom.money.find(".pdTop03 em").html((2 * bs * min).toFixed("1") + "~" + (2 * bs * max).toFixed("1"))
            }
        },
        href_: function(xo) {
            var t = $("#top_menu .cur").attr("v");
            var t1 = $("#dg_" + t).find(".tzxx").attr("v");
            var bs = $("#money input").val() / 2;
            var c = "",
            c1 = "";
            if (t == "bf") {
                $(".bfPop").find(".cur").each(function() {
                    c += F[t] + "|" + t1 + "=" + $(this).attr("v") + "|1*1;";
                    c1 += $(this).attr("v") + ","
                })
            } else {
                $("#dg_" + t).find(".tzxx .cur").each(function() {
                    c += F[t] + "|" + t1 + "=" + $(this).attr("v") + "|1*1;";
                    c1 += $(this).attr("v") + ","
                })
            }
            c1 = c1.substring(0, c1.length - 1);
            c = c.substring(0, c.length - 1);
            var Q = c + "$" + t1 + "$" + t1 + "[" + c1 + "]";
            return c
        },
        doHm: function() {
            $("#dgdg").hide();
            $("#dghm").show();
            TopAnch.init({
                title: "发起合买",
                prevShow: true,
                prevFun: function() {
                    window.location.href = "#type=url&p=list/gddg.html"
                },
                isBack: true,
                nextShow: false
            });
            $("#hmDet cite").html(g.amount);
            $("#rg").val(Math.ceil(g.amount * .05));
            $("#rg_bl").html(Math.floor($("#rg").val() / g.amount * 1e4) / 100 + "%");
            $("#bd").removeAttr("disabled");
            $("#bd").val("0");
            $("#bd_bl").html("0%");
            o.hmDet()
        },
        hmDet: function() {
            var rg = parseInt($("#rg").val() || 0);
            var bd = parseInt($("#bd").val() || 0);
            var z = rg + bd;
            g.hmMoney = z;
            $("#hm_m cite:eq(0)").html(rg);
            $("#hm_m cite:eq(1)").html(bd);
            $("#hm_m cite:eq(2)").html(z)
        },
        getArgument: function(t) {
            var buy = {};
            switch (t) {
            case 1:
                buy = {
                    payUrl: "/phpt/t.phpx?fid=jcast",
                    gid: g.loty_id,
                    pid: g.qihao_id,
                    codes: g.codes,
                    muli: $("#money input").val() / 2,
                    countMoney: g.amount,
                    orderType: "dg"
                };
                break;
            case 2:
                buy = {
                    payUrl: "/phpt/t.phpx?fid=jcast",
                    gid: g.loty_id,
                    pid: g.qihao_id,
                    codes: g.codes,
                    muli: $("#money input").val() / 2,
                    desc: $("#hmDesc").val() || "触屏版合买！",
                    countMoney: g.amount,
                    bnum: $("#rg").val(),
                    pnum: $("#bd").val(),
                    oflag: $("#isPublic .cur").attr("v") || 0,
                    wrate: $("#ratio .cur").attr("v") || 5,
                    orderType: "hm"
                };
                break
            }
            return buy
        },
        dopay: function(t) {
            t ? g.buyType = 2 : g.buyType = 1;
            var _obj = o.getArgument(g.buyType);
            var cMoney = "";
            t ? cMoney = g.hmMoney: cMoney = g.amount;
            var data = {
                gid: g.loty_id,
                cMoney: cMoney,
                payPara: _obj,
                bonus: g.bonus,
                fun: "CP.GDDG.pay"
            };
            alert("提交中，请稍后！", "loading");
            CP.User.info(function(options) { ! t && $("#jc_close").click();
                remove_alert();
                if (options) {
                    jQuery.extend(data, options)
                }
                CP.Popup.buybox(data)
            })
        },
        dobuy: function(Q) {
            var t = $("#top_menu .cur").attr("v");
            if ($("#" + t + "_scroll").html() == "") {
                alert("暂无比赛，请稍后再试")
            } else {
                var je = $("#money input").val();
                var l = "";
                if (t == "bf") {
                    l = $(".bfPop").find(".cur").length
                } else {
                    l = $("#dg_" + t).find(".tzxx .cur").length
                }
                if (l <= 0) {
                    alert("请先选择一场比赛")
                } else if (je < 2) {
                    alert("购买金额最少2元")
                } else {
                    g.loty_id = lotid[t];
                    g.amount = dom.buyFooter.find("a:eq(1)").attr("v");
                    g.codes = o.href_();
                    
                    if (Q) {
                        window.location.href = "#type=fun&fun=CP.GDDG.doHm"
                    } else {
                        o.dopay()
                    }
                }
            }
        },
        

        pay: function(opt) {
            var opt_ = opt.payPara || {};
            if (opt_.orderType == "dg") {
                data = {
                    gid: opt.gid,
                    play: "1",
                    codes: opt_.codes,
                    beishu: 1,
                    zhushu: 1,
                    content: "自购",
                    title: "自购",
                    ishm: 0,
                    money: opt_.countMoney,
                    ffag: 0,
                    muli: opt_.muli,
                    type: 0,
                    bnum: 1,
                    tnum: 1,
                    oflag: 0,
                    source:100
                    
     
                }
            } else if (opt.payPara.orderType == "hm") {
                data = {
                    gid: opt.gid,
                    play: 1,
                    codes: opt_.codes,
                    beishu: 1,
                    zhushu: 1,
                    desc: opt_.desc,
                    title: "快乐购彩",
                    ishm: 1,
                    money: opt_.countMoney,
                    fflag: 0,
                    muli: opt_.muli,
                    type: "1",
                    bnum: opt_.bnum,
                    tnum: opt_.countMoney,
                    oflag: opt_.oflag,
                    isbaodi: 0,
                    pnum: opt_.pnum,
                    wrate: opt_.wrate,
                    isshow: 0,
                    source:100,
                    cupacketid: opt.cupacketid,
                    redpacket_money: opt.redpacket_money
                }
            }
            $.ajax({
                url: CP.Data.apps + opt_.payUrl,
                type: "POST",
                data: data,
                success: function(xml) {
                    var R = $(xml).find("Resp");
                    var code = R.attr("code");
                    var desc = R.attr("desc");
                    var r = R.find("result");
                    if (code == "0") {
                        var projid = "";
                        if (opt_.hid) {
                            projid = opt_.hid
                        } else {
                            projid = r.attr("projid")
                        }
                       
                        window.location.replace("#type=url&p=user/success.html?projid=" + projid)
                    } else {
                    	alert(desc)
                    }
                }
            })
        }
    };
    var bind = function() {
        o.init();
        o.slide({
            effect: "easeOutCubic",
            menuSpeed: 200,
            conSpeed: 350,
            menu: "#top_menu li",
            con: "#top_con section",
            slideBox: ".downline"
        });
        dom.buyFooter.on("click", "a:eq(0)",
        function() {
            o.dobuy("hm")
        }).on("click", "a:eq(1)",
        function() {
            o.dobuy()
        });
        $("#hmSubmit").bind(start_ev,
        function() {
            o.dopay("hm")
        });
        dom.dg_sf.Touch({
            children: ".tzxx span",
            fun: function() {
                if (dom.sf_s.html() == "") {
                    alert("暂无比赛，请稍后再试")
                } else {
                    $(this).toggleClass("cur");
                    o.count()
                }
            }
        });
        dom.dg_rq.Touch({
            children: ".tzxx span",
            fun: function() {
                if (dom.rq_s.html() == "") {
                    alert("暂无比赛，请稍后再试")
                } else {
                    $(this).toggleClass("cur");
                    o.count()
                }
            }
        });
        dom.dg_bf.Touch({
            children: ".tzxx span",
            fun: function() {
                if (dom.bf_s.html() == "") {
                    alert("暂无比赛，请稍后再试")
                } else {
                    $(this).toggleClass("cur");
                    if ($(this).hasClass("cur")) {
                        $(".bfPop span[s=" + $(this).attr("s") + "]").addClass("cur")
                    } else {
                        $(".bfPop span[s=" + $(this).attr("s") + "]").removeClass("cur")
                    }
                    o.count()
                }
            }
        });
        dom.dg_jq.Touch({
            children: ".tzxx span",
            fun: function() {
                if (dom.jq_s.html() == "") {
                    alert("暂无比赛，请稍后再试")
                } else {
                    $(this).toggleClass("cur");
                    o.count()
                }
            }
        });
        dom.dg_bqc.Touch({
            children: ".tzxx span",
            fun: function() {
                if (dom.bqc_s.html() == "") {
                    alert("暂无比赛，请稍后再试")
                } else {
                    $(this).toggleClass("cur");
                    o.count()
                }
            }
        });
        dom.money.on("blur", "input",
        function() {
            var t = parseInt($(this).val());
            if ($(this).val() == "" || t == "0") {
                alert("最少2元");
                $(this).val("2")
            } else {
                if (t % 2 == "0") {
                    $(this).val(t)
                } else {
                    alert("购买金额必须为双数");
                    $(this).val(t + 1)
                }
            }
            o.count()
        }).on("keyup", "input",
        function() {
            this.value = this.value.replace(/\D/g, "");
            if (this.value > 19998) {
                this.value = "19998"
            }
            o.count()
        }).on(start_ev, "em:eq(0)",
        function() {
            var t = parseInt($("#money input").val());
            if (t <= "3") {
                alert("最少2元")
            } else {
                $("#money input").val(t - 2)
            }
            o.count()
        }).on(start_ev, "em:eq(1)",
        function() {
            var t = parseInt($("#money input").val());
            if (t >= 19998) {
                return
            }
            $("#money input").val(t + 2);
            o.count()
        });
        dom.dg_bf.Touch({
            children: ".gddgmore span",
            fun: function() {
                var h_ = $(window).height() * .7;
                $("#gddg_bf_").css({
                    height: h_ + "px"
                });
                $("#zhezhao,.bfPop").show()
            }
        });
        $(".bfPop").on("click", ".zfTrue a:eq(0)",
        function() {
            $("#zhezhao,.bfPop").hide();
            $(".bfPop .cur").removeClass("cur");
            dom.dg_bf.find(".cur").removeClass("cur");
            $(".gddgmore span").html("更多");
            $(".gddgmore span").removeClass("cur2");
            o.count()
        }).on("click", ".zfTrue a:eq(1)",
        function() {
            $("#zhezhao,.bfPop").hide()
        }).on(end_ev, ".competitions span",
        function() {
            if (dom.bf_s.html() == "") {
                alert("暂无比赛，请稍后再试")
            } else {
                $(this).toggleClass("cur");
                if ($(this).hasClass("cur")) {
                    dom.dg_bf.find(".tzxx span[s=" + $(this).attr("s") + "]").addClass("cur")
                } else {
                    dom.dg_bf.find(".tzxx span[s=" + $(this).attr("s") + "]").removeClass("cur")
                }
                o.count();
                var num = $(".bfPop .cur").length - $(".tzxx .cur").length;
                var html_tmp = "";
                $(".bfPop .cur").each(function() {
                    var tmp = $(this).attr("v");
                    if (tmp != "1:0" && tmp != "2:0" && tmp != "2:1" && tmp != "0:0" && tmp != "1:1" && tmp != "2:2" && tmp != "0:1" && tmp != "0:2" && tmp != "1:2") {
                        if (tmp == "9:9") tmp = "平其它";
                        else if (tmp == "9:0") tmp = "胜其它";
                        else if (tmp == "0:9") tmp = "负其它";
                        html_tmp = html_tmp + tmp + "&nbsp"
                    }
                });
                if (num > 0) $(".gddgmore span").addClass("cur2");
                if (num > 3) {
                    $(".gddgmore span").html("其它比分已选" + num + "项")
                } else {
                    $(".gddgmore span").html(html_tmp)
                }
                if (num <= 0) {
                    $(".gddgmore span").html("更多");
                    $(".gddgmore span").removeClass("cur2")
                }
            }
        });
        $("#rg").on("keyup",
        function() {
            var bd_ = parseInt($("#bd").val());
            if ($(this).val() >= g.amount) {
                $(this).val(g.amount);
                $("#rg_bl").html("100%")
            } else {
                if ($(this).val() == "") {
                    $("#rg_bl").html("0%")
                } else {
                    $("#rg_bl").html(Math.floor(parseInt($("#rg").val()) / g.amount * 1e4) / 100 + "%")
                }
            }
            if (!$("#chk").hasClass("nocheck") || parseInt($(this).val()) + bd_ > g.amount) {
                if ($(this).val() == "") {
                    $("#bd").val(g.amount);
                    $("#bd_bl").html("100%")
                } else {
                    $("#bd").val(g.amount - parseInt($(this).val()));
                    $("#bd_bl").html(Math.ceil(parseInt($("#bd").val()) / g.amount * 1e4) / 100 + "%")
                }
            }
            o.hmDet()
        }).on("change",
        function() {
            var t = $(this).val();
            if (t == "") {
                t = 0
            }
            if (parseInt(t) < g.amount * .05) {
                alert("认购金额不能小于5%");
                $(this).val(Math.ceil(g.amount * .05));
                $("#rg_bl").html(Math.floor(parseInt($("#rg").val()) / g.amount * 1e4) / 100 + "%")
            }
            if (!$("#chk").hasClass("nocheck")) {
                $("#bd").val(g.amount - parseInt($(this).val()));
                $("#bd_bl").html(Math.ceil(parseInt($("#bd").val()) / g.amount * 1e4) / 100 + "%")
            }
            o.hmDet()
        });
        $("#bd").on("keyup",
        function() {
            var rg_ = parseInt($("#rg").val());
            parseInt($(this).val()) > g.amount - rg_ && $(this).val(g.amount - rg_);
            if ($(this).val() == "") {
                $("#bd_bl").html("0%")
            } else {
                $(this).val(parseInt($(this).val()));
                $("#bd_bl").html(Math.ceil(parseInt($("#bd").val()) / g.amount * 1e4) / 100 + "%")
            }
            o.hmDet()
        }).on("change",
        function() {
            if ($(this).val() == "") {
                $(this).val("0");
                $("#bd_bl").html("0%");
                o.hmDet()
            }
        });
        $("#chk").bind(start_ev,
        function() {
            var rg_ = parseInt($("#rg").val());
            $(this).toggleClass("nocheck");
            if (!$("#chk").hasClass("nocheck")) {
                $("#bd").attr("disabled", true);
                $("#bd").val(g.amount - rg_);
                $("#bd_bl").html(Math.ceil(parseInt($("#bd").val()) / g.amount * 1e4) / 100 + "%")
            } else {
                $("#bd").removeAttr("disabled")
            }
            o.hmDet()
        });
        $("#ratio li,#isPublic li").on(start_ev,
        function() { ! $(this).hasClass("cur") && $(this).toggleClass("cur");
            $(this).siblings().removeClass("cur")
        })
    };
    var init = function() {
        o.pageGo.goBack();
        bind();
        $("#top_menu li").eq(0).click()
    };
    init();
    return {
        dz: o.duizhen,
        pay: o.pay,
        doHm: o.doHm,
        pageGo: o.pageGo
    }
} ();
function resetPage() {
    $("#content_home").show();
    $("#box_header").addClass("zcHeader");
    CP.GDDG.pageGo.goBack();
    $("#dgdg").show();
    $("#dghm").hide()
}