CP.LZC = function() {
    var lotteryType = $("#content_home").children().eq(0).attr("id").replace("buy_", "");
    var s = {
        sfc: {
            name: "胜负彩",
            lotid: "80",
            tx: "猜中14场一等奖,13场二等奖",
            max: "14"
        },
        r9: {
            name: "任九",
            lotid: "81",
            tx: "猜中任意9场即中奖",
            max: "9"
        }
    };
    var lzcData = {};
    var param = [];
    var spArr = [];
    var g = {
        count: 0,
        bet: 1,
        amount: 0,
        hmMoney: 0,
        buyType: "",
        qihao_id: ""
    };
    var o = {
        pageGo: {
            goBack: function() {
                TopAnch.init({
                    title: s[lotteryType].name,
                    prevShow: true,
                    prevFun: function() {
                        window.location.href = "#type=index"
                    },
                    menu: [{
                        name: "选择比赛",
                        url: "javascript:;",
                        cur: true
                    },
                    {
                        name: "合买跟单",
                        url: "#type=url&p=user/hallhm.html?in=" + CP.Util.lot(s[lotteryType].lotid, 2),
                        cur: false
                    },
                    {
                        name: "开奖结果",
                        url: "#type=url&p=kj/result.html?in_=" + s[lotteryType].lotid,
                        cur: false
                    },
                    {
                        name: "玩法帮助",
                        url: "#type=url&p=wf/" + lotteryType + ".html",
                        cur: false
                    }]
                })
            }
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
        doHm: function() {
            $("#betball, #jc_footer, #jczq_mask").hide();
            $("#bethm").show();
            TopAnch.init({
                title: "发起合买",
                prevShow: true,
                prevFun: function() {
                    window.location.href = "#type=url&p=list/" + lotteryType + ".html"
                },
                isBack: true,
                nextShow: false
            });
            $("#hmDet cite").eq(0).html(g.count);
            $("#hmDet cite").eq(1).html(g.bet);
            $("#hmDet cite").eq(2).html(g.amount);
            $("#rg").val(Math.ceil(g.amount * .05));
            $("#rg_bl").html(Math.floor($("#rg").val() / g.amount * 1e4) / 100 + "%");
            $("#bd").removeAttr("disabled");
            $("#bd").val("0");
            $("#bd_bl").html("0%");
            o.hmDet()
        },
        render: function(pid) {
            g.qihao_id = pid;
            var opt_ = lzcData[pid];
            var et = opt_.et;
            var time_ = et.substr(11, 5);
            var calendar_ = et.substr(0, 10);
            var date_ = et.substr(5, 6);
            var datediff = CP.Util.DateDiff(opt_.severtime, calendar_);
            datediff = {
                0 : "今天",
                1 : "明天",
                2 : "后天"
            } [datediff] || date_;
            var out_ = [];
            out_.push('<div class="sfcTitle clearfix"><span class="left"><cite class="red">' + datediff + "" + time_ + "</cite> 截止</span>");
            out_.push('<span class="right">' + s[lotteryType].tx + "</span></div>");
            for (var Q in opt_.arr) {
                var Q1 = opt_.arr[Q];
                var oh_ = "--",
                od_ = "--",
                oa_ = "--";
                if (Q1.oh != "" && Q1.od != "" && Q1.oa != "") {
                    var f = 1 / (1 / Q1.oh + 1 / Q1.od + 1 / Q1.oa);
                    oh_ = Math.round(f / Q1.oh * 100);
                    od_ = Math.round(f / Q1.od * 100);
                    oa_ = 100 - oh_ - od_ + "%";
                    oh_ = oh_ + "%";
                    od_ = od_ + "%"
                }
                out_.push('<ul class="sfcxs">	        				<li class=wangwei><em>' + Q1.xid + '</em><p style="color:' + Q1.cl + '">' + Q1.mname + "</p><cite>" + Q1.mtime + '</cite><i class="up down"></i></li><li>	        				<p class="spfzpk spfzpk2"><span my-data="3"><em>' + Q1.hn + '</em><cite>胜</cite></span><span class="spfvs" my-data="1"><em>VS</em><cite>平</cite></span><span my-data="0"><em>' + Q1.gn + '</em><cite>胜</cite></span></p>	        				<p class="spfpl"><span>概率' + oh_ + '</span><span class="spfvs">概率' + od_ + "</span><span>概率" + oa_ + '</span></p>	        				</li>	        				</ul>	        				<div class="sfcpl" style="display:none;">	        				<dl><dt>平均赔率</dt><dd>' + (Q1.oh == "" ? "-": Q1.oh) + "</dd><dd>" + (Q1.od == "" ? "-": Q1.od) + "</dd><dd>" + (Q1.oa == "" ? "-": Q1.oa) + "</dd></dl>	        				<dl><dt>联赛排名</dt><dd>" + (Q1.hm == "" ? "-": Q1.hm) + "</dd><dd>&nbsp;</dd><dd>" + (Q1.gm == "" ? "-": Q1.gm) + '</dd></dl>	        				<dl><dt>近期战绩</dt><dd class="yellow">' + (Q1.htn == "" ? "-": Q1.htn) + '</dd><dd>&nbsp;</dd><dd class="yellow">' + (Q1.gtn == "" ? "-": Q1.gtn) + "</dd></dl>	        				</div>")
            }
            $("#item").html(out_.join(""));
            o.bind_()
        },
        init: function(tag) {
            var pid_ = ""; !! tag && (pid_ = "?pid=" + tag);
            $.ajax({
                url: CP.Data.apps + "/test/queryZucai.xml" + pid_,
                type: "get",
                DataType: "XML",
                success: function(xml) {
                    var severtime = new Date(arguments[2].getResponseHeader("Date"));
                    severtime = severtime.getFullYear() + "-" + CP.Util.pad(severtime.getMonth() + 1, 2) + "-" + CP.Util.pad(severtime.getDate(), 2);
                    var R = $(xml).find("rows");
                    var pid = R.attr("pid"); ! lzcData[pid] && (lzcData[pid] = {});
                    lzcData[pid].pid = pid;
                    lzcData[pid].severtime = severtime;
                    lzcData[pid].et = R.attr("et");
                    lzcData[pid].fet = R.attr("fet");
                    lzcData[pid].sale = R.attr("sale");
                    var r = R.find("row");
                    var rp = R.find("rowp");
                    var pids = rp.attr("pids") || "";
                    var Q1 = pids.split(",");
                    if (Q1.length > 1) {
                        if (jQuery("#qici_lzc").html() == "") {
                            jQuery("#qici_lzc").html('<li v="' + Q1[0] + '" class="cur">当前期' + Q1[0] + '</li><li v="' + Q1[1] + '">预售期' + Q1[1] + "</li>")
                        }
                    } else {
                        jQuery("#qici_lzc").hide()
                    }
                    var arr = [];
                    r.each(function() {
                        var Q = {};
                        Q.xid = $(this).attr("xid");
                        Q.hn = $(this).attr("hn").replace(/\s+/g, "");
                        Q.gn = $(this).attr("gn").replace(/\s+/g, "");
                        Q.mname = $(this).attr("mname");
                        Q.cl = $(this).attr("cl");
                        Q.mtime = $(this).attr("mtime").substr(5, 11);
                        Q.hm = $(this).attr("hm");
                        Q.gm = $(this).attr("gm");
                        Q.htn = $(this).attr("htn");
                        Q.gtn = $(this).attr("gtn");
                        Q.oh = $(this).attr("oh");
                        Q.od = $(this).attr("od");
                        Q.oa = $(this).attr("oa");
                        Q.htid = $(this).attr("htid");
                        Q.gtid = $(this).attr("gtid");
                        arr.push(Q)
                    });
                    lzcData[pid].arr = arr;
                    o.render(pid)
                }
            })
        },
        getCount: function() {
            g.count = CP.math.N1(spArr, s[lotteryType].max);
            $("#lot_cur_zhushu").html(g.count);
            g.amount = 2 * g.count * g.bet;
            $("#lot_cur_money").html(g.amount)
        },
        clear_: function() {
            $("#item").find(".cur").removeClass("cur");
            o.field_();
            g.bet = 1;
            g.count = 0;
            g.amount = 0
        },
        next: function() {
            var Q = parseInt($("#lot_cur_match").html());
            if (Q < s[lotteryType].max) {
                alert("至少选择" + s[lotteryType].max + "场")
            } else {
                $("#jc_bs").val(g.bet);
                $("#lot_cur").html(Q);
                $("#jczq_mask").show();
                $("#jc_footer").addClass("jc_footer");
                o.getCount()
            }
        },
        field_: function() {
            var Q1 = 0;
            spArr = [];
            param = [].slice.call($("#item ul")).map(function(o) {
                var Q = $(o).find(".cur").length || "#";
                if (Q != "#") {
                    spArr.push($(o).find(".cur").length);
                    Q1++;
                    Q = [].slice.call($(o).find(".cur")).map(function(t) {
                        return $(t).attr("my-data")
                    }).join("")
                }
                return Q
            });
            $("#lot_cur_match").html(Q1)
        },
        bind_: function() {
            $("#item").off().Touch({
                children: "span[my-data]",
                fun: function(el) {
                    $(el).toggleClass("cur");
                    o.field_()
                }
            });
            $("#item").Touch({
                children: "li.wangwei",
                fun: function(el) {
                    $(el).parent().next().slideToggle();
                    $(el).find("i").toggleClass("down")
                }
            });
            o.clear_()
        },
        bind: function() {
            $("#dobuy").bind(start_ev,
            function() {
                o.dobuy()
            });
            $("#dohm").bind(start_ev,
            function() {
                o.dobuy("hm")
            });
            $("#hmSubmit").bind(start_ev,
            function() {
                if (parseInt($("#rg").val()) < g.totalMoney * .05) {
                    return
                }
                o.dopay("hm")
            });
            $("#jc_next").on(start_ev, "em",
            function() {
                o.clear_()
            }).on(start_ev, "a",
            function() {
                $("#jczq_mask").one("click",
                function() {
                    $("#jczq_mask, #chuan_point").hide();
                    $("#jc_footer").removeClass("jc_footer")
                });
                o.next()
            });
            $("#qici_lzc").delegate("li", start_ev,
            function() {
                if ($(this).is(".cur")) {
                    return
                }
                $(this).addClass("cur").siblings().removeClass("cur");
                $("#item").html('<div style="padding-top:50px;height:200px"><em class="rotate_load" style="margin:auto"></em><div style="text-align: center; padding: 10px;">加载对阵中，请稍候</div></div>');
                var Q = $(this).attr("v");
                if (!lzcData[Q]) {
                    o.init(Q)
                } else {
                    o.render(Q)
                }
            });
            $("#jc_bs").KeyBoard({
                val: 1,
                max: 5e4,
                min: 1,
                num: 1,
                tag: "倍",
                fn: function() {
                    g.bet = $(this.ts).val();
                    o.getCount()
                }
            });
            $("#jc_close").bind("click",
            function() {
                $("#jc_footer").removeClass("jc_footer");
                $("#jczq_mask").hide()
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
            });
            Shake.run(function() {})
        },
        getArgument: function(t) {
            var buy = {};
            switch (t) {
            case 1:
                buy = {
                    payUrl: "/trade/pcast.go",
                    gid: s[lotteryType].lotid,
                    pid: g.qihao_id,
                    codes: param + ":1:1",
                    muli: g.bet,
                    countMoney: g.amount,
                    orderType: "dg"
                };
                break;
            case 2:
                buy = {
                    payUrl: "/trade/pcast.go",
                    gid: s[lotteryType].lotid,
                    pid: g.qihao_id,
                    codes: param + ":1:1",
                    muli: g.bet,
                    desc: $("#hmDesc").val() || "快乐购彩、欧耶！",
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
                gid: s[lotteryType].lotid,
                cMoney: cMoney,
                payPara: _obj
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
        dobuy: function(t) {
            var info = "";
            if ($("#jc_bs").val() < 1) {
                info = "请输入倍数"
            }
            if (info != "") {
                alert(info);
                return
            }
            if (t) {
                window.location.href = "#type=fun&fun=CP.LZC.doHm"
            } else {
                o.dopay()
            }
        }
    };
    var init = function() {
        o.pageGo.goBack();
        o.init();
        o.bind()
    };
    return {
        init: init,
        pageGo: o.pageGo,
        doHm: o.doHm
    }
} ();
function resetPage() {
    $("#content_home").show();
    $("#box_header").addClass("zcHeader");
    CP.LZC.pageGo.goBack();
    $("#betball, #jc_footer, #jczq_mask").show();
    $("#bethm").hide()
}
$(function() {
    CP.LZC.init()
});