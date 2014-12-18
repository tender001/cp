loadProj=function(){
	var lotid = location.search.getParam('lotid');
	var proid = location.search.getParam('projid');
	if (lotid == "" || proid == "") {
		if (history.length == 0) {
			window.location = "/";
		} else {
			history.go(-1);
		}
		return;
	}
	$("#lotid").val(lotid);
	$("#proid").val(proid);
	$.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : {
			gid : lotid,
			hid : proid
		},
		success : function(d) {
			var code = d.Resp.code;
			var desc = d.Resp.desc;
			if (code == "0") {
				var row = d.Resp.row;
				$("#baodi").val(row.pnum);
				$("#lnums").val(row.lnum);
				var canc=false;
				if ((row.nums-row.lnum+row.pnum)/row.nums<0.8){					
					canc=true;
				}
				showproj({data:d,canc:canc});
				showwins({data:d,canc:canc});
				showcode({data:d,canc:canc});
				showjoin({data:d,canc:canc});
			} else {
				showTips(desc);
			}
		},
		error : function() {
			showTips("网络异常!");
			return false;
		}
	});
};
showproj = function(option){
	var title = [];
	title.push($_sys.getlotname($("#lotid").val()) + "  ");
	title.push(option.data.Resp.row.ifile == 0 ? "复式" : "单式");
	title.push(option.data.Resp.row.itype == 0 ? "自购" : "合买");
	$("#gname").html(title.join(""));
	var gid,lotid=$("#lotid").val();
	var periodid =option.data.Resp.row.periodid;
	var zhanji = option.data.Resp.row.zhanji;
	$("[mark=title]").html($_sys.getlotname($("#lotid").val()));
	$("[mark=expect]").html(periodid);
	$("#mainname").html(option.data.Resp.row.cnickid);
	$("#mainzhanji").html("L"+zhanji);
	var nums = option.data.Resp.row.nums;
	var lnum = option.data.Resp.row.lnum;
	var pnum = option.data.Resp.row.pnum;
	var mulity = option.data.Resp.row.mulity;
	var rate = option.data.Resp.row.wrate;
	var ireturn= option.data.Resp.row.ireturn;
	var cdesc = option.data.Resp.row.cdesc;
	var btime = option.data.Resp.row.bgdate;
	var hid = option.data.Resp.row.projid;
	var award = option.data.Resp.row.award;
	var ifile = option.data.Resp.row.ifile;
	$("#tmoney").html((nums/2)+"注 "+mulity+"倍 <span style=\"color:Red;\">"+nums+"</span>元");
	$("#pmoney").html(nums);
	$.each($(".bmoney"),function(o,lt){
		$(lt).html(parseFloat(nums-lnum).rmb(true));
	});
	$.each($(".proc"),function(o,lt){
		$(lt).html(option.data.Resp.row.jindu+"%");
	});
	$("#rg").html(option.data.Resp.row.jindu+"%");
	 $("#rgDetail").html('总额<em class="yellow">' + nums + "元</em>(保底" + pnum + "元，提成" + rate + "%)");
     $("#surplus").html('剩余<em class="yellow">' + lnum + "元</em>");
     $("#tDetail").html("<p>编号 :" + hid + "</p><p>时间 : " + btime + "</p>");
     $("#cdesc").html(cdesc = cdesc == "null" ? "快乐购彩": "方案宣言:" + cdesc);
	var iclear = option.data.Resp.row.iclear;
	$("#baoodi").html((pnum!=0 ? ('(<span style="color:Red" >'+parseFloat(parseInt(pnum*100/nums).toFixed(2))+'%) '+(iclear=='2' ? '已清' : '未清'))+"</span>" : '无保底'));
	
	var adddate = option.data.Resp.row.adddate;
	$("#ptime").html(adddate.toDate().format('MM-DD hh:mm'));
	var icast = option.data.Resp.row.icast;
	var istate = option.data.Resp.row.istate;
	var rmoney = option.data.Resp.row.bonus;
	var tax = option.data.Resp.row.tax;
	
    var isflg = 0;
    var kj = 0;
    kj = isKj(award, btime);
    if (istate > 0) {
        isflg = icast == 3 ? istate > 2 ? 1 : 5 : istate > 2 && istate < 6 ? 1 : icast == 2 ? 2 : 3;
        isflg = kj == 1 ? isflg == 5 ? 6 : isflg: isflg;
        isflg = award == 2 ? isflg == 6 ? 7 : isflg: isflg;
        isflg = ireturn == 2 ? isflg == 7 ? 12 : isflg: ireturn == 1 ? isflg == 7 ? 8 : isflg: isflg
    } else {
        if (istate == "0") {
            isflg = 14
        } else {
            isflg = 13
        }
    }
    $(".buyFooter").hide();
    $(".buyFooter1").show();
    switch (isflg) {
    case 1:
        $("#s_paint").show();
        $("#f_paint").css("width", "2.2rem");
        $("#s_paint").html("已撤单");
        $("#s_paint").css("left", "1rem");
        break;
    case 2:
        $("#s_paint").show();
        $("#f_paint").css("width", "4.5rem");
        $("#s_paint").html("出票中");
        $("#s_paint").css("left", "3rem");
        $(".buyFooter").show();
        $(".buyFooter1").hide();
        break;
    case 3:
        $("#s_paint").show();
        $("#f_paint").css("width", "3.5rem");
        $("#s_paint").html("等待出票");
        $("#s_paint").css("left", "2rem");
        $(".buyFooter").show();
        $(".buyFooter1").hide();
        break;
    case 5:
        $("#f_paint").css("width", "6.9rem");
        if (lnum > 0) {
            $(".buyFooter").show();
            $(".buyFooter1").hide()
        }
        break;
    case 6:
        $("#f_paint").css("width", "12.9rem");
        break;
    case 7:
        $("#s_paint").show();
        $("#f_paint").css("width", "15.5rem");
        $("#s_paint").html("已计奖");
        $("#s_paint").css("left", "14rem");
        break;
    case 8:
        $("#s_paint").show();
        $("#f_paint").css("width", "16.5rem");
        $("#s_paint").html("派奖中");
        $("#s_paint").css("left", "15rem");
        break;
    case 12:
        $("#f_paint").css("width", "18.9rem");
        $("#s_paint").hide();
        break;
    case 13:
        $("#s_paint").show();
        $("#f_paint").css("width", "1.5rem");
        $("#s_paint").html("未支付");
        $("#s_paint").css("left", "0rem");
        break;
    case 14:
        $("#s_paint").show();
        $(".buyFooter").hide();
        $(".buyFooter1").show();
        $("#f_paint").css("width", "1.5rem");
        $("#s_paint").html("处理中");
        $("#s_paint").css("left", "0rem");
        break;
    default:
        $("#s_paint").show();
        $("#f_paint").css("width", "2.5rem");
        $("#s_paint").html("已发起");
        $("#s_paint").css("left", "1rem");
        break
    }
    $("#kjCodes").show();
    var acode = $_cache.qcode(gid, periodid);
    if (acode == "") {
        $("#kjCodes").hide()
    } else {
    	 $("#zgCode").show();
    	if (isflg == 1) {
            if (acode == "") {
                acode = "未开奖"
            }
        } else {
            if (acode != "") {
                acode = kjcode(acode, gid)
            } else {
//                if (gid == "01" || gid == "07" || gid == "50" || gid == "03" || gid == "53" || gid == "51" || gid == "52") {
//                    acode += '<cite class="gray fontSize07 pdLeft06"> ' + kjtime + "开奖</cite>"
//                } else {
//                	acode = "等待开奖"
//                }
            	acode = "等待开奖"
            }
        }
        $("#kjCodes span").html(acode)
    }
    if (award == "2") {
        var wininfostr = "";
        if (rmoney > 0) {
            if (istate == 3 || istate == 4) {
                wininfostr = "<font class='yellow'>该撤单方案中奖" + parseFloat(rmoney) + "元</font>"
            } else {
                wininfostr = "<font class='yellow'>此方案共中奖" + rmoney + "元</font>"
            }
            wininfostr += "<br/>(" + "税前<font class='yellow'>" + parseFloat(rmoney) + "元</font>,税后<font class='yellow'>" + parseFloat(tax) + "元</font>)";
            var zj = $_sys_getwininfo(gid, wininfo, pid);
            for (var i = 0; i < zj.length; i++) {
                wininfostr += "<br/>" + zj[i][0] + " " + zj[i][1] + "注"
            }
            if (itype == 1 && istate != 3 && istate != 4) {
                wininfostr += "<br />发起人提成:" + parseFloat(owins) + "元,每元中" + parseFloat(avg) + "元"
            }
        } else {
            wininfostr += "未中奖"
        }
        $("#zgzjSituation").show();
        $("#zgzjSituation span").html(wininfostr)
    } else {
        $("#zgzjSituation").hide()
    }
    var lo = ["01", "50", "81", "80", "54", "20", "56", "58", "06", "84", "70", "72", "90", "91", "71", "94", "95", "97", "85", "86", "89"];
    if (lo.indexOf(lotid) >= 0) {
        $(".buyFooter1").show()
    }
    if (ifile == "0") {
        if (lotid == 84 || lotid == 85 || lotid == 86 || lotid == 87 || lotid == 88 || lotid == 89 || lotid == 90 || lotid == 91 || lotid == 92 || lotid == 93 || lotid == 70 || lotid == 72 || lotid == 94 || lotid == 95 || lotid == 96 || lotid == 97 || lotid == 71) {
            $("#zgCode").hide();
            $("#zgContent").hide();
            $("#clasli").show();
            bd_jc_clasli(lotid, pid, hid, ccodes, source)
        } else if (lotid == 80 || lotid == 81 || lotid == 82 || lotid == 83) {
            $("#zgCode").hide();
            $("#zgContent").hide();
            $("#clasli").show();
            lzc_clasli(lotid, pid, ccodes)
        } else if (lotid == "99" || lotid == "98") {
            $("#zgCode").hide();
            $("#zgContent").hide();
            $("#clasli").show();
            gyj_clasli(lotid, pid, hid, ccodes)
        } else {
            $("#clasli").hide();
            var html = $_sys.showcode(gid, ccodes);
            html = html.replace(/pdTop06/g, "");
            $("#zgContent div").html(html);
            if (lotid == "01" || lotid == "50" || lotid == "03" || lotid == "53") {}
        }
    } else if (ifile == "1") {
        $("#zgCode").hide();
        if (source == 6 || source == 7) {
            $("#zgContent div").html('奖金优化方案&nbsp;<a href="#class=url&xo=viewpath/content.html&lotid=' + lotid + "&projid=" + hid + '">点击查看</a>');
            $("#clasli").show();
            jjyh(lotid, pid, hid, ccodes)
        } else {
            $("#zgContent div").html('单式上传方案&nbsp;<a href="#class=url&xo=viewpath/content.html&lotid=' + lotid + "&projid=" + hid + '">点击查看</a>')
        }
    }
	
	var st = istate == 0 ? "暂停认购" : ( istate >=3 ? "已撤单" : ( istate == 1 ? "认购中" : "已满员"));
	st += istate == 2 ? " " + (icast == 3 ? "已出票" : "未出票") : "";
	if(istate == 0){
		setTimeout(function(){window.location.reload(); }, 3000);
	}
	$("#state").html(st);
	$("#pdesc").html(option.data.Resp.row.cdesc.length > 0 ? option.data.Resp.row.cdesc : "快乐购彩");
	var itype = option.data.Resp.row.itype;
	if(itype == 1){
		if(istate > 0 && istate < 2){
			$("#tobuy").show();
		}
	}
	$.each($(".lnum"),function(o,lt){
		$(lt).html($("#lnums").val());
	});
	if(Storage.Get("LoginUN_cookie")==option.data.Resp.row.cnickid && istate == 1){
		if(pnum>0){
			$("#tobd").html("<div class=\"title\">保底转认购</div> 已保底<span style='color:Red'>"+parseFloat(pnum).rmb(2)+"</span>元 &nbsp;<a href=\"javascript:void(0);\" onclick=\"JQConfirm('确定转认购？','btg()')\">保底转认购</a>");
		}
		$("#tobd").show();
	}
	if(option.canc){
		if(istate > 0 && istate < 2){
			$("#bymain").show();
		}
	}
};
isKj= function(aw, ft) {
    var kj = 0;
    var ad = aw;
    kj = parseInt(ad, 10) >= 2 ? 1 : 0;
    return kj
};
kjcode=function(acode, gid) {
    if (gid == "01" || gid == "50") {
        acode = '<cite class="red">' + acode.split("|")[0].replace(/,/g, " ") + '</cite>&nbsp;<cite class="blue">' + acode.split("|")[1].replace(/,/g, " ") + "</cite>"
    } else {
        acode = '<cite class="red">' + acode.replace(/,/g, " ") + "</cite>"
    }
    return acode
}
showwins = function(option){
	var ireturn = option.data.Resp.row.ireturn;
	var bonus = option.data.Resp.row.bonus;
	var tax = option.data.Resp.row.tax;
	var wininfo = option.data.Resp.row.wininfo;
	if(ireturn==2){
		var wdetail = "";
		var ws = [];
		if(wininfo.length > 0){
			if(wininfo.indexOf("|") != -1){
				ws = wininfo.split("|");
				if(bonus > 0){
					wdetail="选择场数:" +ws[1]+ "<br/>过关方式:" +ws[2]+ "<br/>中奖注数:<span style='color:Red'>"+ws[0]+"</span><br/>税前奖金：<span style='color:Red'>"+parseFloat(bonus).rmb(true,2)+"</span>元<br/>税后奖金：<span style='color:Red'>"+parseFloat(tax).rmb(true,2)+"</span>元";
				}else{
					wdetail="选择场数:" +ws[1]+ "<br/>过关方式:" +ws[2]+ "<br/>未中奖";
				}
			} else {
				ws = wininfo.split(",");
				var gid = $("#lotid").val();
				var grd = $_sys.getGradeDef(gid);
				var wss = [];
				if(grd != null){
					var gs = grd.split(",");
					if(gid=='50'){
						for(var k = 0; k < 8; k++){
							if(ws[k] > 0){
								wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注" + ((k+9 < gs.length && ws[k+9] > 0) ? "<span style='color:Red'>(追加)</span>" : ""));
							}
						}
						if(ws[8] > 0){
							wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注");
						}
					} else {
						for(var k = 0; k < gs.length; k++){
							if(ws[k] > 0){
								wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注");
							}
						}
					}
				}
				if(bonus > 0){
					wss.push("税前奖金：<span style='color:Red'>"+parseFloat(bonus).rmb(true,2)+"</span>元<br/>税后奖金：<span style='color:Red'>"+parseFloat(tax).rmb(true,2)+"</span>元");
				}
				wdetail=wss.join("<br/>");
			}
		} else {
			wdetail = "未中奖";
		}
		$("#windetail").html(wdetail);
		$("#wins").show();
	}
};
showcode=function(option){
	var gid = $("#lotid").val();
	var codes = option.data.Resp.row.ccodes;
	var iopen = option.data.Resp.row.iopen;
	var upload = option.data.Resp.row.upload;
	var ifile = option.data.Resp.row.ifile;
	var html = [];
	if(ifile == 1){
		if(upload == 1){
			html.push("<em style=\"color:red;\">单式方案</em><em style=\"font-size:13px;\">(请在电脑上登录查看)</em>");
		}else{
			html.push("未上传");
		}
		$("#content").html(html.join("<br/>"));
	} else {
		if(codes !="" && !codes.endWith('.txt')){
			if(gid == 70 || gid == 71 || gid == 72 || (parseInt(gid)>=90 && parseInt(gid) <= 97) || gid == 85 || gid == 86 || gid == 87 || gid == 88 || gid == 89){
				showjjcode(option);
			} else if(gid == 1 || gid == 7 || gid == 50 || gid == 51 || gid == 52 || gid == 80|| gid == 81|| gid == 82|| gid == 83){
				$("#content").html(showszccode(gid, codes, 0));
			} else if(gid == 3 || gid == 4 || gid == 53 || gid == 05 || gid == 54|| gid == 56){
				$("#content").html(showszccode(gid, codes, 1));
			}
		}else{
			html.push(PIOPEN[iopen]);
			$("#content").html(html.join("<br/>"));
		}
	}
};
showjjcode = function(option){
	var gid = $("#lotid").val();
	var proid = $("#proid").val();
	var pid = option.data.Resp.row.periodid;
	$.ajax({
		url:"/cpdata/guoguan/"+gid+"/"+pid+"/proj/"+proid.toLowerCase()+".json?r="+Math.random(),
		type:'GET',
		dataType:"json",
		success:function(d) {
			option.match = d;
			showjccode(option);
		},
		error:function(){
			showTips('网络异常');
		}
	});
};
jjcodeobj = function(code){
	var obj = [];
	var split = code.startWith("HH")? ">" : "=";
	obj.item = [];
	var cs = code.split("|");
	var dr = [], tr = [];
	if(cs[1].indexOf("$") != -1){
		var r = cs[1].split("$");
		dr = r[0].split(",");
		tr = r[1].split(",");
	} else {
		tr = cs[1].split(",");
	}
	$.each(dr,function(i,ri){
		var rs = ri.split(split);
		obj.item.push([rs[0],rs[1],1]);
	});
	$.each(tr,function(i,ri){
		var rs = ri.split(split);
		obj.item.push([rs[0],rs[1],0]);
	});
	
	if(cs.length > 3){
		obj.filter = 1;
	}
	obj.pass = cs[2];
	return obj;
};
getjcrs=function(gid,hs,vs,hss,vss,lose){
	var rs = "";
	if(gid == 90){
		if(parseFloat(hs) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) < parseFloat(vs)){
			rs = "0";
		} else {
			rs = "1";
		}
	} else if(gid == 85 || gid == 72){
		if(parseFloat(hs) + parseFloat(lose) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) + parseFloat(lose) < parseFloat(vs)){
			rs = "0";
		} else {
			rs = "1";
		}
	} else if(gid == 86) {
		rs = hs + ":" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "9:9";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) > 2) {
				rs = "9:0";
			}
			if (parseFloat(hs) > 4) {
				rs = "9:0";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "9:9";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) > 2) {
				rs = "0:9";
			}
			if (parseFloat(vs) > 4) {
				rs = "0:9";
			}
		}
	} else if(gid == 91) {
		rs = hs + ":" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "9:9";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) == 3) {
				rs = "9:0";
			}
			if (parseFloat(hs) == 5 && parseFloat(vs) > 2) {
				rs = "9:0";
			}
			if (parseFloat(hs) > 5) {
				rs = "9:0";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "9:9";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) == 3) {
				rs = "0:9";
			}
			if (parseFloat(vs) == 5 && parseFloat(hs) > 2) {
				rs = "0:9";
			}
			if (parseFloat(vs) > 5) {
				rs = "0:9";
			}
		}
	} else if(gid == 87 || gid == 92){
		if (parseFloat(hss) > parseFloat(vss)) {//胜
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "3-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "3-1";
			} else {
				rs = "3-0";
			}
		} else if (parseFloat(hss) == parseFloat(vss)) {//平
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "1-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "1-1";
			} else {
				rs = "1-0";
			}
		} else {
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "0-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "0-1";
			} else {
				rs = "0-0";
			}
		}
	} else if(gid == 88){
		var t = parseFloat(hs) + parseFloat(vs);
		if(t >= 3){//上
			if(t % 2 == 0){//双
				rs = "2";
			} else {//单
				rs = "3";
			}
		} else {//下
			if(t % 2 == 0){//双
				rs = "0";
			} else {//单
				rs = "1";
			}
		}
	} else if(gid == 89 || gid == 93){
		rs = "" + (parseFloat(hs) + parseFloat(vs));
		if (parseFloat(rs) > 7) {
			rs = "7";
		}
	} else if(gid == 94){
		if(parseFloat(hs) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) < parseFloat(vs)){
			rs = "0";
		}
	} else if(gid == 95){
		if(parseFloat(hs) + parseFloat(lose) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) + parseFloat(lose) < parseFloat(vs)){
			rs = "0";
		}
	} else if(gid == 96){
		var val = parseInt(hs) - parseInt(vs);
		if (val > 0) {
			if(val > 0 & val <=5){
				rs = "01";
			} else if (val > 5 & val <=10){
				rs = "02";
			} else if (val > 10 & val <=15){
				rs = "03";
			} else if (val > 15 & val <=20){
				rs = "04";
			} else if (val > 20 & val <=25){
				rs = "05";
			} else {
				rs = "06";
			}
		} else {
			val = Math.abs(val);
			if(val > 0 & val <=5){
				rs = "11";
			} else if (val > 5 & val <=10){
				rs = "12";
			} else if (val > 10 & val <=15){
				rs = "13";
			} else if (val > 15 & val <=20){
				rs = "14";
			} else if (val > 20 & val <=25){
				rs = "15";
			} else {
				rs = "16";
			}
		}
	} else if(gid == 97){
		if(parseFloat(hs) + parseFloat(vs) > parseFloat(lose)){
			rs = "3";
		} else {
			rs = "0";
		}
	}
	return rs;
};
showjccode=function(option){
	var gid = $("#lotid").val();
	var codes = option.data.Resp.row.ccodes;
	var jcobj = jjcodeobj(codes);
	var row = [];
	var d = option.match;
	if(d.items){row = d.items.item;};
	if(!isArray(row)){row = new Array(row);};
	var match = [];
	$.each(row,function(i,r){
		var bt = r.bt;
		var lls = new String(r.lose).split("|");
		var lose = lls.length > 1 ? (gid == 95 ? lls[1] : lls[2]) : r.lose;
		var cancel = r.cancel;
		var html = "<div class='ni" + i%2 + "'>";
		if(lose == 0 || gid == 91 || gid == 92 || gid == 93 | gid==70  || gid == 90){
			if( gid == 94 || gid==96 || gid == 71){
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.vn+" VS "+r.hn+"</label><br>";
			}else{
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.hn+" VS "+r.vn+"</label><br>";
			}
			
		} else {
			if( gid == 95){
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.vn+" ";
				html += (parseFloat(lose) > 0) ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>";
				html += r.hn+" </label><br>";
			}else{
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.hn+" ";
				html += (parseFloat(lose) > 0) ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>";
				html += r.vn+" </label><br>";
			}
			
		}
		html += "<div>比赛时间: "+bt.toDate().format('MM-DD hh:mm')+"</div>";
		var rst = false;
		var mrs = "";
		if(gid == 70 || gid == 71){
			if(cancel == 0){
				if(new String(r.hs).length > 0 && new String(r.vs).length > 0 && new String(r.hss).length > 0 && new String(r.vss).length > 0 ){
					rst = true;
				}
			} else {
				rst = true;
				mrs = "*";
			}
			
			html += "<div class='hunheItem'>";
			for(var k = 0; k < jcobj.item.length;k++){
				if(jcobj.item[k][0] == r.id){
					var cc = jcobj.item[k][1].split("+");
					for(var f = 0; f < cc.length; f++){
						var ps = cc[f].split("=");
						var gg = getJcPlay(gid, ps[0]);
						lose = lls.length > 1 ? (gg == 95 ? lls[0] : lls[2]) : r.lose;
//						if(gg==97){
//							lose = lls.length > 1?lls[3]: r.lose;
//						}
						if(rst){
							mrs = mrs == "*" ? mrs : getjcrs(gg, r.hs, r.vs, r.hhs, r.hvs, (gg==97?lls[3]:lose));
							
						}
						html += "玩法:<span style='color:green'>" + $_sys.getlotname(gg,2) + "</span>";
						if(gg == 72 || gg == 95 || gg == 97){
							if(lose != 0){
								html += (parseFloat(lose)>0 ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>");
							}
						}
						html += "<br/>";
						html += "投注:";
						var cs = ps[1].split("/");
						for(var n = 0; n < cs.length; n++){
							if(cs[n] == mrs || mrs=="*"){
								html += "<span class='spitems'>" + $_sys.getJJCode(gg,"K" + cs[n]) + "</span>";
							} else {
								html += "<span class='spitems2'>" + $_sys.getJJCode(gg,"K" + cs[n]) + "</span>";
							}
						}
						if(jcobj.item[k][2]==1){
							html += "<span style='color:red'>(胆)</span>";
						}
						html += "<br/>";
						if(rst){
							html += "比分：" + "(" + r.hs + ":" + r.vs + ")"+ (gg == 92 ? "半场比分：("+r.hhs+":"+r.hvs+")" : "") +  " 赛果：<span style='color:Red'>" + $_sys.getJJCode(gg,"K" + mrs) + "</span><br/>";
						}
					}
				}
			}
			html += "</div>";
		} else {
			var hss = r.hss == undefined ? r.hhs : r.hss;
			var vss = r.vss == undefined ? r.hvs : r.vss;
			if(cancel == 0){
				if(new String(r.hs).length > 0 && new String(r.vs).length > 0 && new String(hss).length > 0 && new String(vss).length > 0 ){
					rst = true;
					mrs = getjcrs(gid, r.hs, r.vs, hss, vss, lose);
				}
			} else {
				rst = true;
				mrs = "*";
			}
			html += "<div class='hunheItem'>";
			html += "投注：";
			for(var k = 0; k < jcobj.item.length;k++){
				if(jcobj.item[k][0] == r.id){
					var cc = jcobj.item[k][1].split("/");
					for(var n = 0; n < cc.length; n++){
						if(cc[n] == mrs || mrs=="*"){
							html += "<span class='spitems'>" + $_sys.getJJCode(gid,"K" + cc[n]) + "</span>";
						} else {
							html += "<span class='spitems2'>" + $_sys.getJJCode(gid,"K" + cc[n]) + "</span>";
						}
					}
					if(jcobj.item[k][2]==1){
						html += "<span style='color:red'>(胆)</span>";
					}
					html += "<br/>";
					break;
				}
			}
			if(rst){
				html += "比分：" + "(" + r.hs + ":" + r.vs + ")"+ ((gid == 87 || gid == 92) ? "半场比分：("+hss+":"+vss+")" : "") +  " 赛果：<span style='color:Red'>" + $_sys.getJJCode(gid,"K" + mrs) + "</span>";
			}
			html += "</div>";
		}
		html += "</div>";
		match.push(html);
	});
	match.push("<div>过关方式:<span style='color:red'>" + jcobj.pass + "</span></div>");
	if(jcobj.filter == 1){
		match.push("<div><span style='color:Red'>去除单一玩法串</span></div>");
	}
	$("#content").html(match.join(""));
};
tobuy = function(){
	var bnum = parseInt($("#hmRenGou").val());
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    var lnum = parseInt($("#lnums").val());
    if(isNaN(bnum)){
    	showTips("请输入整数!");
    	return;
    }
    if(lnum < bnum){
    	showTips("认购份数不能大于剩余份数!");
   		return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url : $_trade.url.pjoin,
    			type:'POST',
    			data:{
    				gid:lotid,
    				hid:proid,
    				bnum:bnum,
    				source:'100'
    			},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("认购成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
    				showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
tobaodi = function(){
	var bdnum = parseInt($("#hmBaoDi").val());
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    var lnum = parseInt($("#lnums").val());
    if(isNaN(bdnum)){
		showTips("请输入整数!");
		return;
	}
    if(lnum < bdnum){
    	showTips("保底份数不能大于剩余份数!");
    	return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pshbd,
    			type:'POST',
    			data:{
    				gid:lotid,
    				hid:proid,
    				bnum:bdnum
    			},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("保底成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
btg = function(){
	var bdnum = $("#baodi").val();;    
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    if(bdnum < 1){
    	showTips("未保底无法保底转认购!");
    	return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pb2g,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
					bnum:bdnum
				},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("保底转认购成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
maincal = function(){
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pcancel,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
				},
				dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("方案撤销成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
caljoin=function(buyid){
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.jcancel,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
					bid:buyid
				},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("参与跟单撤销成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
bd_jc_clasli = function(lotid, expect, projid, codes, source) {
    if (source == "11") {
        $.ajax({
            url: "/trade/qview.go",
            type: "GET",
            data: {
                hid: projid,
                gid: lotid
            },
            dataType: "xml",
            cache: false,
            success: function(xml) {
                var R = $(xml).find("rows");
                var gg = R.attr("gg");
                html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetTitle mgTop06"><tr>';
                html += '<td width="15%">场次</td><td width="70%">主队VS客队/投注选项</td><td width="15%" style="border-right:none">比分</td>';
                html += "</tr></table>";
                html += '<table id="tcont" width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetTable">';
                var r = R.find("row");
                r.each(function(aa) {
                    var id = $(this).attr("id");
                    var name = $(this).attr("name");
                    var hn = $(this).attr("hn");
                    var gn = $(this).attr("gn");
                    var hs = $(this).attr("hs");
                    var gs = $(this).attr("gs");
                    var hhs = $(this).attr("hhs");
                    var hgs = $(this).attr("hgs");
                    var isdan = $(this).attr("isdan");
                    var lose = $(this).attr("lose");
                    var ccodes = $(this).attr("ccodes");
                    var quan = "",
                    ban = "";
                    if (hs != "" && gs != "") {
                        quan = "全" + hs + ":" + gs;
                        ban = "半" + hhs + ":" + hgs
                    }
                    ccodes = ccodes.split("|")[1].split(",");
                    html += "<tr id=" + id + "><td " + (aa == 0 ? "width='15%'": "") + ' rowspan="2">' + name + "</td>";
                    html += "<td " + (aa == 0 ? "width='70%'": "") + ">" + hn + '<em class="fontSize07">VS</em>' + gn + "<span id = dan" + id + ' style="color:red"></span></td>';
                    html += "<td " + (aa == 0 ? "width='15%'": "") + ' rowspan="2" class="r9last">' + ban + "<br/>" + quan + "</td></tr>";
                    html += '<tr><td><div class="tdleft gray">&nbsp;';
                    for (var i = 0; i < ccodes.length; i++) {
                        var c1 = ccodes[i].split("_");
                        var c2 = c1[1];
                        if (lotid == "92") {
                            c1 = c1[0].replace(/3/g, "胜").replace(/1/g, "平").replace(/0/g, "负")
                        } else if (lotid == "91") {
                            c1 = c1[0].replace("9:0", "胜其它").replace("9:9", "平其它").replace("0:9", "负其它")
                        } else if (lotid == "90" || lotid == "72") {
                            c1 = c1[0].replace("3", "胜").replace("1", "平").replace("0", "负")
                        } else {
                            c1 = c1[0]
                        }
                        html += "<span>" + c1 + "(" + c2 + ")</span>"
                    }
                    html += "</div></td></tr>"
                });
                html += "</table>";
                html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetFooter"><tr><td>过关方式:   ' + gg + "</td></tr></table>";
                $("#clasli").html(html);
                $("#jcts").show()
            }
        })
    } else {
        $.ajax({
            url: "/data/guoguan/" + lotid + "/" + expect + "/proj/" + projid.toLowerCase() + ".xml",
            type: "GET",
            dataType: "xml",
            cache: false,
            success: function(xml) {
                var R = $(xml).find("items");
                var pid = R.attr("pid");
                var wk = ["日", "一", "二", "三", "四", "五", "六"];
                var r = R.find("item");
                var chuan = codes.split("|")[2].replace(/\*/g, "串").replace(/1串1/g, "单关");
                var html = "";
                html = '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetTitle mgTop06"><tr>';
                if (lotid == "94" || lotid == "95" || lotid == "96" || lotid == "97" || lotid == "71") {
                    html += '<td width="15%">场次</td><td width="70%">客队VS主队/投注选项</td><td width="15%" style="border-right:none">比分</td>'
                } else {
                    html += '<td width="15%">场次</td><td width="70%">主队VS客队/投注选项</td><td width="15%" style="border-right:none">比分</td>'
                }
                html += "</tr></table>";
                html += '<table id="tcont" width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetTable">';
                if (lotid == 70) {
                    var cbfstr = ["1:0", "2:0", "2:1", "3:0", "3:1", "3:2", "4:0", "4:1", "4:2", "5:0", "5:1", "5:2", "9:0", "0:0", "1:1", "2:2", "3:3", "9:9", "0:1", "0:2", "1:2", "0:3", "1:3", "2:3", "0:4", "1:4", "2:4", "0:5", "1:5", "2:5", "0:9"];
                    var spfstr = ["3", "1", "0"];
                    var jqsstr = ["0", "1", "2", "3", "4", "5", "6", "7"];
                    var bqcstr = ["3-3", "3-1", "3-0", "1-3", "1-1", "1-0", "0-3", "0-1", "0-0"];
                    r.each(function(a) {
                        var hn = $(this).attr("hn");
                        var vn = $(this).attr("vn");
                        var lose = $(this).attr("lose");
                        var c = parseInt($(this).attr("cancel"));
                        var hs = $(this).attr("hs");
                        var vs = $(this).attr("vs");
                        var hhs = $(this).attr("hhs");
                        var hvs = $(this).attr("hvs");
                        var spvalue = $(this).attr("spvalue");
                        var spvalues = spvalue.split("|");
                        var quan = "",
                        ban = "";
                        if (hs != "" && vs != "") {
                            quan = "全" + hs + ":" + vs
                        }
                        if (hs != "" && vs != "") {
                            ban = "半" + hhs + ":" + hvs
                        }
                        var rq = "";
                        if (lose != 0 && lose != "") {
                            if (lose.indexOf("-") != -1) {
                                rq = "(<font color='green'>" + lose + "</font>)"
                            } else {
                                rq = "(<font color='red'>" + lose + "</font>)"
                            }
                        }
                        var hsstr = $(this).attr("hs").trim();
                        var result = "";
                        var lose1 = parseFloat(lose);
                        var id = $(this).attr("id");
                        var tDATE = "20" + id.substr(0, 2) + "-" + id.substr(2, 2) + "-" + id.substr(4, 2);
                        tDATE = new Date(tDATE);
                        var wk2 = "周" + wk[tDATE.getDay()];
                        var id2 = id.substr(6, 3);
                        var tz = codes.split("|")[1];
                        var dcode = [];
                        if (tz.indexOf("$") != -1) {
                            dcode = tz.split("$");
                            tz = dcode[0] + "," + dcode[1]
                        }
                        var cctz = tz.split(",");
                        for (var i = 0; i < cctz.length; i++) {
                            var cctzLength = cctz[i].split(">")[1].split("+").length;
                            if (id == cctz[i].split(">")[0]) {
                                var dan = "";
                                if (dcode != "") {
                                    if (dcode[0].indexOf(id) != "-1") {
                                        dan = '<font color="red">(胆)</font>'
                                    }
                                }
                                var cctzLength2 = cctz[i].split(">")[1].split("+").length;
                                html += '<tr id="' + id + '"><td ' + (a == 0 ? "width='15%'": "") + ' rowspan="' + (cctzLength2 + 1) + '">' + wk2 + "<br>" + id2 + "</td>";
                                html += "<td " + (a == 0 ? "width='70%'": "") + ">" + hn + rq + '<em class="fontSize07">VS</em>' + vn + dan + "</td>";
                                html += "<td " + (a == 0 ? "width='15%'": "") + ' calss="r9last" rowspan="' + (cctzLength2 + 1) + '">' + ban + "<br/>" + quan + "</td></tr>";
                                for (var j = 0; j < cctzLength; j++) {
                                    var wwc = cctz[i].split(">")[1].split("+")[j].split("=")[1].split("/");
                                    if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "RQSPF") {
                                        var spvalue = spvalues[0].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs - vs) * 1 + lose1 * 1;
                                                if (rt * 1 > 0) {
                                                    result = "3"
                                                } else if (rt * 1 == 0) {
                                                    result = "1"
                                                } else {
                                                    result = "0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        } else {
                                            result = ""
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3", "让胜").replace("1", "让平").replace("0", "让负") + "</em>(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3", "让胜").replace("1", "让平").replace("0", "让负") + "(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3", "让胜").replace("1", "让平").replace("0", "让负") + "(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "SPF") {
                                        var spvalue = spvalues[4].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs - vs) * 1;
                                                if (rt * 1 > 0) {
                                                    result = "3"
                                                } else if (rt * 1 == 0) {
                                                    result = "1"
                                                } else {
                                                    result = "0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        } else {
                                            result = ""
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3", "胜").replace("1", "平").replace("0", "负") + "</em>(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3", "胜").replace("1", "平").replace("0", "负") + "(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3", "胜").replace("1", "平").replace("0", "负") + "(" + spvalue[spfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "CBF") {
                                        var spvalue = spvalues[1].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                result = hs + ":" + vs
                                            } else {
                                                result = ""
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("9:0", "胜其它").replace("9:9", "平其它").replace("0:9", "负其它") + "</em>(" + spvalue[cbfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("9:0", "胜其它").replace("9:9", "平其它").replace("0:9", "负其它") + "(" + spvalue[cbfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("9:0", "胜其它").replace("9:9", "平其它").replace("0:9", "负其它") + "(" + spvalue[cbfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "JQS") {
                                        var spvalue = spvalues[3].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs + vs) * 1;
                                                if (rt >= 7) {
                                                    result = 7
                                                } else {
                                                    result = rt
                                                }
                                            } else {
                                                result = ""
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n] + "球</em>(" + spvalue[jqsstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n] + "球(" + spvalue[jqsstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n] + "球(" + spvalue[jqsstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "BQC") {
                                        var spvalue = spvalues[2].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var hrt = (hhs - hvs) * 1;
                                                var rt = (hs - vs) * 1;
                                                if (hrt * 1 > 0) {
                                                    result = "3"
                                                } else if (hrt * 1 == 0) {
                                                    result = "1"
                                                } else {
                                                    result = "0"
                                                }
                                                if (rt * 1 > 0) {
                                                    result = result + "-3"
                                                } else if (rt * 1 == 0) {
                                                    result = result + "-1"
                                                } else {
                                                    result = result + "-0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "</em>(" + spvalue[bqcstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "(" + spvalue[bqcstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "(" + spvalue[bqcstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    }
                                }
                            }
                        }
                    });
                    html += "</table>";
                    html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetFooter"><tr><td>过关方式:   ' + chuan + "</td></tr></table>";
                    $("#clasli").html(html);
                    $("#jcts").show()
                } else if (lotid == "71") {
                    var sfstr = ["0", "3"];
                    var rfsfstr = ["0", "3"];
                    var dxfstr = ["3", "0"];
                    var sfcstr = ["11", "12", "13", "14", "15", "16", "01", "02", "03", "04", "05", "06"];
                    r.each(function(a) {
                        var hn = $(this).attr("hn");
                        var vn = $(this).attr("vn");
                        var lose = $(this).attr("lose");
                        var rq = "";
                        if (lose != "" && codes.indexOf("RFSF") != -1) {
                            if (lose.split("|")[1] == 0) {
                                rq = ""
                            } else {
                                if (lose.split("|")[1].indexOf("-") != -1) {
                                    rq = "<span style='color:blue'>(" + lose.split("|")[1] + ")</span>"
                                } else {
                                    rq = "<span style='color:red'>(+" + lose.split("|")[1] + ")</span>"
                                }
                            }
                        }
                        var c = parseInt($(this).attr("cancel"));
                        var hs = $(this).attr("hs");
                        var vs = $(this).attr("vs");
                        var spvalue = $(this).attr("spvalue");
                        var spvalues = spvalue.split("|");
                        var bfen = "";
                        if (hs != "" && vs != "") {
                            bfen = vs + ":" + hs;
                            hs = parseFloat(hs);
                            vs = parseFloat(vs)
                        }
                        var hsstr = $(this).attr("hs").trim();
                        var result = "";
                        var id = $(this).attr("id");
                        var tDATE = "20" + id.substr(0, 2) + "-" + id.substr(2, 2) + "-" + id.substr(4, 2);
                        tDATE = new Date(tDATE);
                        var wk2 = "周" + wk[tDATE.getDay()];
                        var id2 = id.substr(6, 3);
                        var tz = codes.split("|")[1];
                        var cctz = tz.split(",");
                        bflose = lose.split("|")[3];
                        if (bflose > 0) {
                            bfen = '<em class="gray fontSize07">预设</em><br>' + bflose + "<br>" + bfen
                        }
                        var cctzLength2 = cctz[a].split(">")[1].split("+").length;
                        html += '<tr id="' + id + '"><td ' + (a == 0 ? "width='15%'": "") + ' rowspan="' + (cctzLength2 + 1) + '">' + wk2 + "<br>" + id2 + "</td>";
                        html += "<td " + (a == 0 ? "width='70%'": "") + ">" + vn + '<em class="fontSize07">VS</em>' + hn + rq + "</td>";
                        html += "<td " + (a == 0 ? "width='15%'": "") + ' class="r9last" rowspan="' + (cctzLength2 + 1) + '">' + bfen + "</td></tr>";
                        for (var i = 0; i < cctz.length; i++) {
                            if (id == cctz[i].split(">")[0]) {
                                var cctzLength = cctz[i].split(">")[1].split("+").length;
                                for (var j = 0; j < cctzLength; j++) {
                                    var wwc = cctz[i].split(">")[1].split("+")[j].split("=")[1].split("/");
                                    if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "SF") {
                                        spvalue = spvalues[0].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs - vs) * 1;
                                                if (rt * 1 > 0) {
                                                    result = "3"
                                                } else {
                                                    result = "0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        } else {
                                            result = ""
                                        }
                                        var loses = lose;
                                        if (loses != "") {
                                            if (loses.split("|")[0] == 0) {
                                                loses = ""
                                            } else {
                                                loses = "(" + loses.split("|")[0] + ")"
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3", "主胜").replace("0", "主负") + "</em>(" + spvalue[sfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3", "主胜").replace("0", "主负") + "(" + spvalue[sfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3", "主胜").replace("0", "主负") + "(" + spvalue[sfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "RFSF") {
                                        spvalue = spvalues[1].split(",");
                                        var loses = lose;
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs - vs) * 1 + loses.split("|")[1] * 1;
                                                if (rt * 1 > 0) {
                                                    result = "3"
                                                } else {
                                                    result = "0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        }
                                        if (loses != "") {
                                            if (loses.split("|")[1] == 0) {
                                                loses = ""
                                            } else {
                                                loses = "(" + loses.split("|")[1] + ")"
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3", "让分主胜").replace("0", "让分主负") + "</em>(" + spvalue[rfsfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3", "让分主胜").replace("0", "让分主负") + "(" + spvalue[rfsfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3", "让分主胜").replace("0", "让分主负") + "(" + spvalue[rfsfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "DXF") {
                                        spvalue = spvalues[3].split(",");
                                        var loses = lose;
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs + vs) * 1 - loses.split("|")[3] * 1;
                                                if (rt * 1 > 0) {
                                                    result = "3"
                                                } else {
                                                    result = "0"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        }
                                        if (loses != "") {
                                            if (loses.split("|")[3] == 0) {
                                                loses = ""
                                            } else {
                                                loses = "(" + loses.split("|")[3] + ")"
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("3", "大分").replace("0", "小分") + "</em>(" + spvalue[dxfstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("3", "大分").replace("0", "小分") + "(" + spvalue[dxfstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("3", "大分").replace("0", "小分") + "(" + spvalue[dxfstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    } else if (cctz[i].split(">")[1].split("+")[j].split("=")[0] == "SFC") {
                                        spvalue = spvalues[2].split(",");
                                        if (c == 0) {
                                            if (hsstr.length > 0) {
                                                var rt = (hs - vs) * 1;
                                                if (rt > 0 && rt < 6) {
                                                    result = "01"
                                                } else if (rt > 5 && rt < 11) {
                                                    result = "02"
                                                } else if (rt > 10 && rt < 16) {
                                                    result = "03"
                                                } else if (rt > 15 && rt < 21) {
                                                    result = "04"
                                                } else if (rt > 20 && rt < 26) {
                                                    result = "05"
                                                } else if (rt > 25) {
                                                    result = "06"
                                                } else if (rt > -6 && rt < 0) {
                                                    result = "11"
                                                } else if (rt > -11 && rt < -5) {
                                                    result = "12"
                                                } else if (rt < -10 && rt > -16) {
                                                    result = "13"
                                                } else if (rt < -15 && rt > -21) {
                                                    result = "14"
                                                } else if (rt < -20 && rt > -26) {
                                                    result = "15"
                                                } else if (rt < -25) {
                                                    result = "16"
                                                }
                                            } else {
                                                result = ""
                                            }
                                        }
                                        var loses = lose;
                                        if (loses != "") {
                                            if (loses.split("|")[2] == 0) {
                                                loses = ""
                                            } else {
                                                loses = "(" + loses.split("|")[2] + ")"
                                            }
                                        }
                                        html += '<tr><td><div class="tdleft gray">&nbsp;';
                                        if (result != "") {
                                            for (var n = 0; n < wwc.length; n++) {
                                                if (result == wwc[n]) {
                                                    html += '<span><em class="yellow">' + wwc[n].replace("01", "主a").replace("02", "主h").replace("03", "主k").replace("04", "主m").replace("05", "主s").replace("06", "主g").replace("11", "客a").replace("12", "客h").replace("13", "客k").replace("14", "客m").replace("15", "客s").replace("16", "客g").replace("a", "1-5").replace("h", "6-10").replace("k", "11-15").replace("m", "16-20").replace("s", "21-25").replace("g", "26+") + "</em>(" + spvalue[sfcstr.indexOf(wwc[n])] + ")</span>"
                                                } else {
                                                    html += "<span>" + wwc[n].replace("01", "主a").replace("02", "主h").replace("03", "主k").replace("04", "主m").replace("05", "主s").replace("06", "主g").replace("11", "客a").replace("12", "客h").replace("13", "客k").replace("14", "客m").replace("15", "客s").replace("16", "客g").replace("a", "1-5").replace("h", "6-10").replace("k", "11-15").replace("m", "16-20").replace("s", "21-25").replace("g", "26+") + "(" + spvalue[sfcstr.indexOf(wwc[n])] + ")</span>"
                                                }
                                            }
                                            html += "</div></td></tr>"
                                        } else {
                                            html += "<div class='hunheItem'>&nbsp;";
                                            for (var n = 0; n < wwc.length; n++) {
                                                html += "<span>" + wwc[n].replace("01", "主a").replace("02", "主h").replace("03", "主k").replace("04", "主m").replace("05", "主s").replace("06", "主g").replace("11", "客a").replace("12", "客h").replace("13", "客k").replace("14", "客m").replace("15", "客s").replace("16", "客g").replace("a", "1-5").replace("h", "6-10").replace("k", "11-15").replace("m", "16-20").replace("s", "21-25").replace("g", "26+") + "(" + spvalue[sfcstr.indexOf(wwc[n])] + ")</span>"
                                            }
                                            html += "</div></td></tr>"
                                        }
                                    }
                                }
                            }
                        }
                    });
                    html += "</table>";
                    html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetFooter"><tr><td>过关方式:   ' + chuan + "</td></tr></table>";
                    $("#clasli").html(html);
                    $("#jcts").show()
                } else if (lotid == "90" || lotid == "93" || lotid == "91" || lotid == "92" || lotid == "94" || lotid == "95" || lotid == "97" || lotid == "96" || lotid == "72") {
                    r.each(function(aa) {
                        var hs = $(this).attr("hs");
                        var vs = $(this).attr("vs");
                        var hhs = $(this).attr("hhs");
                        var hvs = $(this).attr("hvs");
                        var quan = "",
                        ban = "";
                        if (hs != "" && vs != "") {
                            quan = "全" + hs + ":" + vs
                        }
                        if (hs != "" && vs != "") {
                            ban = "半" + hhs + ":" + hvs
                        }
                        var hsstr = $(this).attr("hs").trim();
                        var c = $(this).attr("cancel");
                        var spvalue = $(this).attr("spvalue");
                        var spvalues = spvalue.split("|");
                        if (lotid == 90) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[0]
                        } else if (lotid == 91) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[1]
                        } else if (lotid == 92) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[2]
                        } else if (lotid == 93) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[3]
                        } else if (lotid == 72) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[4]
                        } else if (lotid == 94) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[0]
                        } else if (lotid == 95) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[1]
                        } else if (lotid == 96) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[2]
                        } else if (lotid == 97) {
                            spvalue = spvalues.length == 1 ? spvalue: spvalues[3]
                        }
                        spvalue = spvalue.split(",");
                        var hn = "";
                        var vn = "";
                        hn = $(this).attr("hn");
                        vn = $(this).attr("vn");
                        var lose2 = $(this).attr("lose");
                        var lose = lose2;
                        var loses = lose.split("|");
                        if (lotid == "94") {
                            if (parseInt(loses[0]) == 0) {
                                lose = ""
                            } else {
                                lose = loses[0]
                            }
                        } else if (lotid == "95") {
                            if (parseInt(loses[1]) == 0) {
                                lose = ""
                            } else {
                                lose = loses[1]
                            }
                        } else if (lotid == "97") {
                            if (parseInt(loses[3]) == 0) {
                                lose = ""
                            } else {
                                lose = loses[3]
                            }
                        } else if (lotid == "96") {
                            if (parseInt(loses[2]) == 0) {
                                lose = ""
                            } else {
                                lose = loses[2]
                            }
                        } else {
                            if (lose2 == 0) {
                                lose = ""
                            }
                        }
                        var rq = "";
                        if (lose != 0 && lose != "" && (lotid == "90" || lotid == "95")) {
                            if (lose.indexOf("-") != -1) {
                                rq = "(<font color='green'>" + lose + "</font>)"
                            } else {
                                rq = "(<font color='red'>" + lose + "</font>)"
                            }
                        }
                        var id = $(this).attr("id");
                        var id2 = id.substring("6", "9");
                        var tDATE = "20" + id.substr(0, 2) + "-" + id.substr(2, 2) + "-" + id.substr(4, 2);
                        tDATE = new Date(tDATE);
                        var wk2 = "周" + wk[tDATE.getDay()];
                        html += "<tr id=" + id + "><td " + (aa == 0 ? "width='15%'": "") + ' rowspan="2">' + wk2 + "<br>" + id2 + "</td>";
                        if (lotid == "94" || lotid == "95" || lotid == "96" || lotid == "97") {
                            if (hs != "" && vs != "") {
                                quan = vs + ":" + hs
                            }
                            if (lotid == "97") {
                                if (lose > 0) {
                                    quan = '<em class="gray fontSize07">预设</em><br>' + lose + "<br>" + quan
                                }
                            }
                            html += "<td " + (aa == 0 ? "width='70%'": "") + ">" + vn + rq + '<em class="fontSize07">VS</em>' + hn + "<span id = dan" + id + ' style="color:red"></span></td>';
                            html += "<td " + (aa == 0 ? "width='15%'": "") + ' rowspan="2" class="r9last">' + quan + "</td></tr>"
                        } else {
                            html += "<td " + (aa == 0 ? "width='70%'": "") + ">" + hn + rq + '<em class="fontSize07">VS</em>' + vn + "<span id = dan" + id + ' style="color:red"></span></td>';
                            html += "<td " + (aa == 0 ? "width='15%'": "") + ' rowspan="2" class="r9last">' + ban + "<br/>" + quan + "</td></tr>"
                        }
                        var code = "",
                        code1 = "";
                        if (source == "13") {
                            var q = codes.split("|")[0];
                            codes = codes.split(";");
                            var t = [];
                            for (var i = 0; i < codes.length; i++) {
                                t.push(codes[i].split("|")[1])
                            }
                            codes = q + "|" + t
                        }
                        code = codes.split("|");
                        code1 = code[1];
                        if (code[1].indexOf("$") != -1) {
                            var dcode = code[1].split("$");
                            code1 = dcode[0] + "," + dcode[1]
                        }
                        code1 = code1.split(",");
                        if (code[0] == "RQSPF") {
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (hs - vs) * 1 + lose * 1;
                                    if (rt * 1 > 0) {
                                        result = "3"
                                    } else if (rt * 1 == 0) {
                                        result = "1"
                                    } else {
                                        result = "0"
                                    }
                                } else {
                                    result = ""
                                }
                            } else {
                                result = ""
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j].replace("3", "胜").replace("1", "平").replace("0", "负");
                                        var ii = oracle[j].replace("0", "2").replace("3", "0");
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">让' + oracle2 + "</em>(" + spvalue[ii] + ")</span>"
                                            } else {
                                                html += "<span>让" + oracle2 + "(" + spvalue[ii] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>让" + oracle2 + "(" + spvalue[ii] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "SPF") {
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (hs - vs) * 1;
                                    if (rt * 1 > 0) {
                                        result = "3"
                                    } else if (rt * 1 == 0) {
                                        result = "1"
                                    } else {
                                        result = "0"
                                    }
                                } else {
                                    result = ""
                                }
                            } else {
                                result = ""
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j].replace("3", "胜").replace("1", "平").replace("0", "负");
                                        var ii = oracle[j].replace("0", "2").replace("3", "0");
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2 + "</em>(" + spvalue[ii] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2 + "(" + spvalue[ii] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2 + "(" + spvalue[ii] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "BQC") {
                            var BQC = ["3-3", "3-1", "3-0", "1-3", "1-1", "1-0", "0-3", "0-1", "0-0"];
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var hrt = (hhs - hvs) * 1;
                                    var rt = (hs - vs) * 1;
                                    if (hrt * 1 > 0) {
                                        result = "3"
                                    } else if (hrt * 1 == 0) {
                                        result = "1"
                                    } else {
                                        result = "0"
                                    }
                                    if (rt * 1 > 0) {
                                        result = result + "-3"
                                    } else if (rt * 1 == 0) {
                                        result = result + "-1"
                                    } else {
                                        result = result + "-0"
                                    }
                                } else {
                                    result = ""
                                }
                            } else {
                                result = ""
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j].replace(/3/g, "胜").replace(/1/g, "平").replace(/0/g, "负");
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2 + "</em>(" + spvalue[BQC.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2 + "(" + spvalue[BQC.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2 + "(" + spvalue[BQC.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "JQS") {
                            var JQS = ["0", "1", "2", "3", "4", "5", "6", "7"];
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (parseFloat(hs) + parseFloat(vs)) * 1;
                                    if (rt >= 7) {
                                        result = 7
                                    } else {
                                        result = rt
                                    }
                                } else {
                                    result = ""
                                }
                            } else {
                                result = ""
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2 + "</em>(" + spvalue[JQS.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2 + "(" + spvalue[JQS.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2 + "(" + spvalue[JQS.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "CBF") {
                            var BF = ["1:0", "2:0", "2:1", "3:0", "3:1", "3:2", "4:0", "4:1", "4:2", "5:0", "5:1", "5:2", "9:0", "0:0", "1:1", "2:2", "3:3", "9:9", "0:1", "0:2", "1:2", "0:3", "1:3", "2:3", "0:4", "1:4", "2:4", "0:5", "1:5", "2:5", "0:9"];
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = hs + "" + vs;
                                    result = hs + ":" + vs;
                                    var bfstr = ["10", "20", "21", "30", "31", "32", "40", "41", "42", "50", "51", "52", "90", "00", "11", "22", "33", "99", "01", "02", "12", "03", "13", "23", "04", "14", "24", "05", "15", "25", "09"];
                                    var ii = 100;
                                    for (var i = 0; i < 31; i++) {
                                        if (bfstr[i] == rt) {
                                            ii = i
                                        }
                                    }
                                    if (ii == 12) {
                                        result = "胜其它"
                                    } else if (ii == 17) {
                                        result = "平其它"
                                    } else if (ii == 30) {
                                        result = "负其它"
                                    } else if (ii == 100) {
                                        if (hs > vs) {
                                            result = "胜其它";
                                            ii = 12
                                        } else if (hs == vs) {
                                            result = "平其它";
                                            ii = 17
                                        } else {
                                            result = "负其它";
                                            ii = 30
                                        }
                                    }
                                } else {
                                    result = ""
                                }
                            } else {
                                result = ""
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j].replace(/9:0/g, "胜其他").replace(/9:9/g, "平其他").replace(/0:9/g, "负其他");
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2 + "</em>(" + spvalue[BF.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2 + "(" + spvalue[BF.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2 + "(" + spvalue[BF.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "SF") {
                            var SF = ["0", "3"];
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (hs - vs) * 1;
                                    if (rt * 1 > 0) {
                                        result = "3"
                                    } else {
                                        result = "0"
                                    }
                                } else {
                                    result = ""
                                }
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "</em>(" + spvalue[SF.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "(" + spvalue[SF.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "(" + spvalue[SF.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "RFSF") {
                            var RFSF = ["0", "3"];
                            var loses2 = lose2;
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (hs - vs) * 1 + loses2.split("|")[1] * 1;
                                    if (rt * 1 > 0) {
                                        result = "3"
                                    } else {
                                        result = "0"
                                    }
                                } else {
                                    result = ""
                                }
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "</em>(" + spvalue[RFSF.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "(" + spvalue[RFSF.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/3/g, "主胜").replace(/0/g, "主负") + "(" + spvalue[RFSF.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "DXF") {
                            var DXF = ["3", "0"];
                            var loses2 = lose2;
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (parseFloat(hs) + parseFloat(vs)) * 1 - loses2.split("|")[3] * 1;
                                    if (rt * 1 > 0) {
                                        result = "3"
                                    } else {
                                        result = "0"
                                    }
                                } else {
                                    result = ""
                                }
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/3/g, "大分").replace(/0/g, "小分") + "</em>(" + spvalue[DXF.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/3/g, "大分").replace(/0/g, "小分") + "(" + spvalue[DXF.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/3/g, "大分").replace(/0/g, "小分") + "(" + spvalue[DXF.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "SFC") {
                            var SFC = ["11", "12", "13", "14", "15", "16", "01", "02", "03", "04", "05", "06"];
                            if (c == 0) {
                                if (hsstr.length > 0) {
                                    var rt = (hs - vs) * 1;
                                    if (rt > 0 && rt < 6) {
                                        result = "01"
                                    } else if (rt > 5 && rt < 11) {
                                        result = "02"
                                    } else if (rt > 10 && rt < 16) {
                                        result = "03"
                                    } else if (rt > 15 && rt < 21) {
                                        result = "04"
                                    } else if (rt > 20 && rt < 26) {
                                        result = "05"
                                    } else if (rt > 25) {
                                        result = "06"
                                    } else if (rt > -6 && rt < 0) {
                                        result = "11"
                                    } else if (rt > -11 && rt < -5) {
                                        result = "12"
                                    } else if (rt < -10 && rt > -16) {
                                        result = "13"
                                    } else if (rt < -15 && rt > -21) {
                                        result = "14"
                                    } else if (rt < -20 && rt > -26) {
                                        result = "15"
                                    } else if (rt < -25) {
                                        result = "16"
                                    }
                                } else {
                                    result = ""
                                }
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/01/g, "主胜1-5").replace(/02/g, "主胜6-10").replace(/03/g, "主胜1/1-1/5").replace(/04/g, "主胜1/6-20").replace(/05/g, "主胜21-25").replace(/06/g, "主胜26+").replace(/11/g, "主负1-5").replace(/12/g, "主负6-10").replace(/13/g, "主负1/1-1/5").replace(/14/g, "主负1/6-20").replace(/15/g, "主负21-25").replace(/16/g, "主负26+").replace(/\//g, "") + "</em>(" + spvalue[SFC.indexOf(oracle[j])] + ")</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/01/g, "主胜1-5").replace(/02/g, "主胜6-10").replace(/03/g, "主胜1/1-1/5").replace(/04/g, "主胜1/6-20").replace(/05/g, "主胜21-25").replace(/06/g, "主胜26+").replace(/11/g, "主负1-5").replace(/12/g, "主负6-10").replace(/13/g, "主负1/1-1/5").replace(/14/g, "主负1/6-20").replace(/15/g, "主负21-25").replace(/16/g, "主负26+").replace(/\//g, "") + "(" + spvalue[SFC.indexOf(oracle[j])] + ")</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/01/g, "主胜1-5").replace(/02/g, "主胜6-10").replace(/03/g, "主胜1/1-1/5").replace(/04/g, "主胜1/6-20").replace(/05/g, "主胜21-25").replace(/06/g, "主胜26+").replace(/11/g, "主负1-5").replace(/12/g, "主负6-10").replace(/13/g, "主负1/1-1/5").replace(/14/g, "主负1/6-20").replace(/15/g, "主负21-25").replace(/16/g, "主负26+").replace(/\//g, "") + "(" + spvalue[SFC.indexOf(oracle[j])] + ")</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        }
                    });
                    html += "</table>";
                    html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetFooter"><tr><td>过关方式:   ' + chuan + "</td></tr></table>";
                    $("#clasli").html(html);
                    $("#jcts").show();
                    var code = codes.split("|");
                    if (code[1].indexOf("$") != -1) {
                        var dcode = code[1].split("$");
                        var dcode1 = dcode[0].split(",");
                        for (var ji = 0; ji < dcode1.length; ji++) {
                            var mid = dcode1[ji].split("=")[0];
                            $("#dan" + mid).html("(胆)")
                        }
                    }
                } else if (lotid == "84" || lotid == "85" || lotid == "89" || lotid == "86" || lotid == "87" || lotid == "88") {
                    r.each(function() {
                        var id = $(this).attr("id");
                        var hn = $(this).attr("hn");
                        var vn = $(this).attr("vn");
                        var hs = $(this).attr("hs");
                        var vs = $(this).attr("vs");
                        var hhs = $(this).attr("hhs");
                        var hvs = $(this).attr("hvs");
                        var quan = "",
                        ban = "";
                        if (hs != "" && vs != "") {
                            quan = (lotid == 84 ? "": "全") + hs + ":" + vs
                        }
                        if (hs != "" && vs != "") {
                            ban = "半" + hhs + ":" + hvs
                        }
                        var id = $(this).attr("id");
                        var result = $(this).attr("result");
                        var ststr = "";
                        if (result != "") {
                            ststr = result.split(";")
                        }
                        var cup = "";
                        if (lotid == 84) {
                            cup = $(this).attr("cup")
                        }
                        var ball = ["足球", "篮球", "冰球", "网球", "羽毛球", "排球", "橄榄球", "曲棍球", "乒乓球", "沙滩排球", "手球", "水球"];
                        var ball2 = ["球", "分", "球", "局", "局", "局", "分", "球", "局", "局", "球", "球"];
                        var lose = $(this).attr("lose");
                        if (lose == 0 || lose == "" || lotid == 89) {
                            lose = ""
                        } else {
                            if (lose.indexOf("-") != -1) {
                                lose = "(<font color='green'>" + (lotid == "84" ? lose + ball2[ball.indexOf(cup)] : lose) + "</font>)"
                            } else {
                                lose = "(<font color='red'>" + (lotid == "84" ? lose + ball2[ball.indexOf(cup)] : lose) + "</font>)"
                            }
                        }
                        html += '<tr id="' + id + '" pid="' + pid + '"><td width="15%" rowspan="2" class="">' + id + (cup == "" ? "": "<br/><font color=#222222>" + cup + "</font>") + "</td>";
                        html += '<td width="70%">' + hn + lose + '<em class="fontSize07">VS</em>' + vn + "<span id = dan" + id + ' style="color:red"></span></td>';
                        html += '<td width="15%" rowspan="2">' + (lotid == 84 ? "": ban + "<br/>") + quan + "</td></tr>";
                        var code = codes.split("|");
                        var code1 = code[1];
                        if (code1.indexOf("$") != -1) {
                            var dcode = code1.split("$");
                            code1 = dcode[0] + "," + dcode[1]
                        }
                        code1 = code1.split(",");
                        var jjsp = "";
                        if (code[0] == "SF") {
                            if (ststr == "") {
                                result = ""
                            } else {
                                result = ststr[0].split(":")[0];
                                jjsp = "(" + ststr[0].split(":")[1] + ")"
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle2 == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/3/g, "胜").replace(/0/g, "负") + "</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/3/g, "胜").replace(/0/g, "负") + "</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/3/g, "胜").replace(/0/g, "负") + "</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "SPF") {
                            if (ststr == "") {
                                result = ""
                            } else {
                                result = ststr[0].split(":")[0];
                                jjsp = "(" + ststr[0].split(":")[1] + ")"
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle2 == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/3/g, "胜").replace(/1/g, "平").replace(/0/g, "负") + "</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/3/g, "胜").replace(/1/g, "平").replace(/0/g, "负") + "</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/3/g, "胜").replace(/1/g, "平").replace(/0/g, "负") + "</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "JQS") {
                            if (ststr == "") {
                                result = ""
                            } else {
                                result = ststr[4].split(":")[0];
                                jjsp = "(" + ststr[4].split(":")[1] + ")"
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2 + "球</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2 + "球</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2 + "球</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "CBF") {
                            if (ststr == "") {
                                result = ""
                            } else {
                                result = ststr[1].split(":")[0];
                                jjsp = "(" + ststr[1].split(":")[1] + ")";
                                if (result == "90") {
                                    result = "胜其它"
                                } else if (result == "99") {
                                    result = "平其它"
                                } else if (result == "09") {
                                    result = "负其它"
                                } else {
                                    result = result.substr(0, 1) + ":" + result.substr(1, 1)
                                }
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/9:0/g, "胜其他").replace(/9:9/g, "平其他").replace(/0:9/g, "负其他") + "</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/9:0/g, "胜其他").replace(/9:9/g, "平其他").replace(/0:9/g, "负其他") + "</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/9:0/g, "胜其他").replace(/9:9/g, "平其他").replace(/0:9/g, "负其他") + "</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "BQC") {
                            if (ststr == "") {
                                result = ""
                            } else {
                                result = ststr[2].split(":")[0];
                                result = result.substr(0, 1) + "-" + result.substr(1, 1);
                                jjsp = "(" + ststr[2].split(":")[1] + ")"
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j] == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace("3-3", "胜-胜").replace("3-1", "胜-平").replace("3-0", "胜-负").replace("1-3", "平-胜").replace("1-1", "平-平").replace("1-0", "平-负").replace("0-3", "负-胜").replace("0-1", "负-平").replace("0-0", "负-负") + "</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        } else if (code[0] == "SXP") {
                            if (result != "") {
                                var sx = [];
                                sx[0] = "下双";
                                sx[1] = "下单";
                                sx[2] = "上双";
                                sx[3] = "上单";
                                result = ststr[3].split(":")[0];
                                jjsp = "(" + ststr[3].split(":")[1] + ")";
                                result = sx[result * 1]
                            }
                            html += '<tr><td><div class="tdleft gray">&nbsp;';
                            for (var i = 0; i < code1.length; i++) {
                                if (id == code1[i].split("=")[0]) {
                                    var oracle = code1[i].split("=")[1].split("/");
                                    for (var j = 0; j < oracle.length; j++) {
                                        var oracle2 = oracle[j];
                                        if (result != "") {
                                            if (oracle[j].replace(/0/g, "下双").replace(/1/g, "下单").replace(/2/g, "上双").replace(/3/g, "上单") == result) {
                                                html += '<span><em class="yellow">' + oracle2.replace(/0/g, "下双").replace(/1/g, "下单").replace(/2/g, "上双").replace(/3/g, "上单") + "</em>" + jjsp + "</span>"
                                            } else {
                                                html += "<span>" + oracle2.replace(/0/g, "下双").replace(/1/g, "下单").replace(/2/g, "上双").replace(/3/g, "上单") + "</span>"
                                            }
                                        } else {
                                            html += "<span>" + oracle2.replace(/0/g, "下双").replace(/1/g, "下单").replace(/2/g, "上双").replace(/3/g, "上单") + "</span>"
                                        }
                                    }
                                }
                            }
                            html += "</div></td></tr>"
                        }
                    });
                    html += "</table>";
                    html += '<table width="100%" border="0" cellpadding="0" cellspacing="0" class="lcbetFooter"><tr><td>过关方式:   ' + chuan + "</td></tr></table>";
                    $("#clasli").html(html);
                    var code = codes.split("|");
                    if (code[1].indexOf("$") != -1) {
                        var dcode = code[1].split("$");
                        var dcode1 = dcode[0].split(",");
                        for (var ji = 0; ji < dcode1.length; ji++) {
                            var mid = dcode1[ji].split("=")[0];
                            $("#dan" + mid).html("胆")
                        }
                    }
                }
            }
        })
    }
};
showjoin = function(option){
	var buyhtml = "您的认购记录如下：<br/>", joins=[];
	var jlist = option.data.Resp.myjoins;
	var istate = option.data.Resp.row.istate;
	if(jlist)joins = jlist.myjoin;
	if(!isArray(joins)){joins = new Array(joins);}
	if(joins == undefined || joins.length < 1){
		buyhtml+='<div style="padding-top: 10px;">暂时没有您的认购信息</div>';
	} else {
		$.each(joins,function(i,r) {
			var buyid = r.buyid;
			var buydate = r.buydate;
			var bmoney = r.bmoney;
			var cancel = r.cancel;
			var isource = r.source;// 
			buyhtml += '<div class="ni0">'+$_sys.showsource(isource)+"" + buydate+ '认购' + parseFloat(bmoney).rmb(true) + '元';
			buyhtml += cancel==0?((option.canc && istate == 1)?'<a href="javascript:void(0);" onclick="JQConfirm(\'确定撤销参与跟单？\',\'caljoin('+buyid+')\')" class="a1">撤单</a>':'&nbsp'):(cancel==1 ? '&nbsp;本人撤销 ':'&nbsp;系统撤销');
			buyhtml +='<br></div>';
		});
	}
	$("#buyrec").html(buyhtml);
	$("#prodetail").show();
};
$(document).ready(function() {
	chklogin();
	loadProj();
});