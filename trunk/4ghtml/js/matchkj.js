function showmatchkj(){
	var gid = location.search.getParam('gid');
	var xpid = location.search.getParam('pid');
	if(gid == undefined){
		showTips('参数异常!');
		return;
	}

	var gs = [["jczq","竞彩足球开奖"], ["jclq","竞彩篮球开奖"], ["bjdc","北京单场开奖"]];


	var flag = false;
	$.each(gs,function(o,g){
		if(g[0] == gid){
			$("em#em").html(g[1]);
			document.title = g[1] + document.title;
			flag = true;
			return;
		}
	});
	
	if(!flag){
		showTips('参数不符合要求!');
		return;
	}
	
	if(gid == 'bjdc') {
		$.ajax({
			url :"/cpdata/game/85/c.json",
			dataType:"json",
			success:function(data){
				var code = data.period.code;
				if(code == 0){
					var rs = data.period.row;
					if(rs && !isArray(rs)){rs = new Array(rs);}
					if(rs.length > 0){
						var html = [];
						var cpid = "";
						$.each(rs,function(o,r) {
							var flag = r.flag;
							var pid = r.pid;
							if(xpid != '' ){
							
								cpid=xpid
							}else{
								cpid = pid;
							}
							if(flag == 1){
								html.push("<option value='/info/football.html?gid=bjdc&="+pid+"' id="+pid+">当前期"+pid+"</option>");
								if(xpid == ''){
									cpid = pid;
								}
							} else {
								html.push("<option value='/info/football.html?gid=bjdc&pid="+pid+"' id="+pid+">历史期"+pid+"</option>");
							}
						});
						html.push("<option value='/history/'>返回列表</option>");
						$("#listexpect").html(html.join(""));
						if(cpid != ''){
							$("#"+cpid).attr("selected","selected");
							showmatch(gid, cpid);
						}
					}
				} else {
					var desc = data.period.desc;
					showTips('发生错误:' + desc);
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	} else if(gid == 'jczq' || gid == 'jclq'){
		$.ajax({
			url :"/cpdata/match/" + gid + "/award/day.json",
			dataType:"json",
			success:function(data){
				var rs = data.rows.row;
				if(rs && !isArray(rs)){rs = new Array(rs);}
				if(rs.length > 0){
					var html = [];
					var cpid = "";
					$.each(rs,function(o,r) {
						var pid =  r.did;
						var day = pid.substring(0,4) + "-" + pid.substring(4,6) + "-" + pid.substring(6, 8);
						if(xpid != ''){
							cpid = xpid;
						}else{
							cpid = pid;
						}
//						http://local.159cai.com/info/football.html?gid=jclq&did=140409
						html.push("<option value='/info/football.html?gid=" + gid + "&pid="+pid+"' id="+pid+">"+day+"</option>");
						if(cpid == ''){
							cpid = pid;
						}
					});
					html.push("<option value='/history/'>返回列表</option>");
					$("#listexpect").html(html.join(""));
					if(cpid != ''){
						$("#"+cpid).attr("selected","selected");
						showmatch(gid, cpid);
					}
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	}
//	goexpect();
}
function goexpect(){
	$("#listexpect").change(function(){
		var url = $(this).val();
		window.location = url;
	});
}
function showmatch(gid, expect){
	if(gid == 'bjdc'){
		$.ajax({
			url :"/cpdata/match/beid/"+expect+"/"+expect+".json",
			dataType:"json",
			success:function(data){
				var code = data.match.code;
				if(code == 0){
					var rs = data.match.row;
					if(rs && !isArray(rs)){rs = new Array(rs);}
					if(rs.length > 0){
						var html = [];
						$.each(rs,function(o,r) {
							var mname = r.mname;
							var cl = r.cl;
							var mid = r.mid;
							var time = r.bt.substring('5','16');
							var hn = r.hn;
							var gn = r.gn;
							var close = r.close;
							var hss = r.hss;
							var hms = r.hms;
							var ss = r.ss;
							var ms = r.ms;
							var result = r.rs;
							var icancel = r.icancel;
							
							var match = [];
							match.push("<table class='list' border='0' cellSpacing='0' cellPadding='0' >");
							match.push("<tr><td colspan='6' align=center>场次：<font size=2 color=#999>" + mid + "</font>&nbsp;&nbsp;<font size=2 color="+cl+">" + mname + "</font>&nbsp;&nbsp;<font size=2 color=#999>" + time + "</font></td></tr>");
							if(icancel == 1){
								if(close == 0){
									match.push("<tr><td colspan='2' align='center'>[主]" + hn + "</td><td colspan='2' align='center'><font color='red'>延期</font></td><td colspan='2' align='center'>" + gn + "</td></tr>");
								} else {
									match.push("<tr><td colspan='2' align='center'>[主]" + hn + "(<font color=#3366cc>" + close + "</font>)</td><td colspan='2' align='center'><font color='red'>延期</font></td><td colspan='2' align='center'>" + gn + "</td></tr>");
								}
							} else {
								if(close == 0){
									match.push("<tr><td colspan='3' align='center'>[主]" + hn + "</td><td colspan='3' align='center'>" + gn + "</td></tr>");
								} else {
									match.push("<tr><td colspan='3' align='center'>[主]" + hn + "(<font color=#3366cc>" + close + "</font>)</td><td colspan='3' align='center'>" + gn + "</td></tr>");
								}

								var bc = "-- : --";
								var qc = "-- : --";
								if((""+hss).length > 0 && (""+hms).length > 0 && (""+ss).length > 0 && (""+ms).length > 0){
									bc = hms + " : " + hss;
									qc = ms + " : " + ss;
									
									match.push("<tr><td align='center' colspan='3'>半场比分&nbsp;<font color='seagreen'>"+bc+"</font></td><td align='center' colspan='3'>全场比分&nbsp;<font color='seagreen'>"+qc+"</font></td></tr>");
									
									var rss = result.split(";");
									var arr = [];
									if(rss.length == 5){
										arr.push(rss[0].split(":"));	//spf
										arr.push(rss[1].split(":"));	//cbf
										arr.push(rss[2].split(":"));	//bqc
										arr.push(rss[3].split(":"));	//sxp
										arr.push(rss[4].split(":"));	//jqs
									} else {
										arr.push([getMatchRS("85", ms, ss, hms, hss, close), "--"]);
										arr.push([getMatchRS("86", ms, ss, hms, hss, close), "--"]);
										arr.push([getMatchRS("87", ms, ss, hms, hss, close), "--"]);
										arr.push([getMatchRS("88", ms, ss, hms, hss, close), "--"]);
										arr.push([getMatchRS("89", ms, ss, hms, hss, close), "--"]);
									}
									match.push("<tr><td align='center' colspan='2'><font color='hotpink'>玩法</font></td><td align='center' colspan='2'><font color='hotpink'>彩果</font></td><td align='center' colspan='2'><font color='hotpink'>sp值</font></td>");
									match.push("<tr><td align='center' colspan='2'>胜平负</td><td align='center' colspan='2'>" + getMatchRT(85, arr[0][0]) + "</td><td align='center' colspan='2'>" + arr[0][1] + "</td>");
									match.push("<tr><td align='center' colspan='2'>比分</td><td align='center' colspan='2'>" + getMatchRT(86, arr[1][0]) + "</td><td align='center' colspan='2'>" + arr[1][1] + "</td>");
									match.push("<tr><td align='center' colspan='2'>半全场</td><td align='center' colspan='2'>" + getMatchRT(87, arr[2][0]) + "</td><td align='center' colspan='2'>" + arr[2][1] + "</td>");
									match.push("<tr><td align='center' colspan='2'>上下单双</td><td align='center' colspan='2'>" + getMatchRT(88, arr[3][0]) + "</td><td align='center' colspan='2'>" + arr[3][1] + "</td>");
									match.push("<tr><td align='center' colspan='2'>总进球</td><td align='center' colspan='2'>" + getMatchRT(89, arr[4][0]) + "</td><td align='center' colspan='2'>" + arr[4][1] + "</td>");
								} else {
									match.push("<tr><td align='center' colspan='6'>比赛未完成</td></tr>");
								}
							}
							match.push("</table>");
							html.push(match.join(""));
						});
						$("#tb").append(html.join(""));
					}
					
				} else {
					var desc = data.match.desc;
					showTips('发生错误:' + desc);
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	} else if(gid == 'jczq'){
		$.ajax({
			url :"/cpdata/match/jczq/award/"+expect+"/"+expect+".json",
			dataType:"json",
			success:function(data){
				var rs = data.rows.row;
				if(rs && !isArray(rs)){rs = new Array(rs);}
				if(rs.length > 0){
					var html = [];
					$.each(rs,function(o,r) {
						var mname = r.mname;
						var sn = r.sn;
						var mn = r.mn;
						var time = r.mt.substring(5,16);
						var ms = r.ms;
						var ss = r.ss;
						var hms = r.hms;
						var hss = r.hss;
						var cid = r.cid;
						var ic = r.ic;
						var cl = r.cl;
						var lose = r.lose;
						
						var match = [];
						match.push("<table class='list' border='0' cellSpacing='0' cellPadding='0' >");
						match.push("<tr><td colspan='6' align=center><font size=2 color=#999>" + cid + "</font>&nbsp;&nbsp;<font size=2 color="+cl+">" + mname + "</font>&nbsp;&nbsp;<font size=2 color=#999>" + time + "</font></td></tr>");
						if(ic == 1){
							if(lose == 0){
								match.push("<tr><td colspan='2' align='center'>[主]" + mn + "</td><td colspan='2' align='center'><font color='red'>延期</font></td><td colspan='2' align='center'>" + sn + "</td></tr>");
							} else {
								match.push("<tr><td colspan='2' align='center'>[主]" + mn + "(<font color=#3366cc>" + lose + "</font>)</td><td colspan='2' align='center'><font color='red'>取消</font></td><td colspan='2' align='center'>" + sn + "</td></tr>");
							}
						} else {
							if(lose == 0){
								match.push("<tr><td colspan='3' align='center'>[主]" + mn + "</td><td colspan='3' align='center'>" + sn + "</td></tr>");
							} else {
								match.push("<tr><td colspan='3' align='center'>[主]" + mn + "(<font color=#3366cc>" + lose + "</font>)</td><td colspan='3' align='center'>" + sn + "</td></tr>");
							}

							var bc = "-- : --";
							var qc = "-- : --";
							if((""+hss).length > 0 && (""+hms).length > 0 && (""+ss).length > 0 && (""+ms).length > 0){
								bc = hms + " : " + hss;
								qc = ms + " : " + ss;
								
								match.push("<tr><td align='center' colspan='3'>半场比分&nbsp;<font color='seagreen'>"+bc+"</font></td><td align='center' colspan='3'>全场比分&nbsp;<font color='seagreen'>"+qc+"</font></td></tr>");
								
								var arr = [];
								arr.push([getMatchRS("90", ms, ss, hms, hss, lose)]);
								arr.push([getMatchRS("91", ms, ss, hms, hss, lose)]);
								arr.push([getMatchRS("92", ms, ss, hms, hss, lose)]);
								arr.push([getMatchRS("93", ms, ss, hms, hss, lose)]);
								arr.push([getMatchRS("72", ms, ss, hms, hss, lose)]);
									
								match.push("<tr><td align='center' colspan='3'><font color='hotpink'>玩法</font></td><td align='center' colspan='3'><font color='hotpink'>彩果</font></td></tr>");
								match.push("<tr><td align='center' colspan='3'>胜平负</td><td align='center' colspan='3'>" + getMatchRT(90, arr[0][0]) + "</td></tr>");
								match.push("<tr><td align='center' colspan='3'>猜比分</td><td align='center' colspan='3'>" + getMatchRT(91, arr[1][0]) + "</td></tr>");
								match.push("<tr><td align='center' colspan='3'>半全场</td><td align='center' colspan='3'>" + getMatchRT(92, arr[2][0]) + "</td></tr>");
								match.push("<tr><td align='center' colspan='3'>进球数</td><td align='center' colspan='3'>" + getMatchRT(93, arr[3][0]) + "</td></tr>");
								match.push("<tr><td align='center' colspan='3'>让球胜平负</td><td align='center' colspan='3'>" + getMatchRT(72, arr[4][0]) + "</td></tr>");
							} else {
								match.push("<tr><td align='center' colspan='6'>比赛未完成</td></tr>");
							}
						}
						match.push("</table>");
						html.push(match.join(""));
					});
					$("#tb").append(html.join(""));
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	} else if(gid == 'jclq'){
		$.ajax({
			url :"/cpdata/match/jclq/award/"+expect+"/"+expect+".json",
			dataType:"json",
			success:function(data){
				var rs = data.rows.row;
				if(rs && !isArray(rs)){rs = new Array(rs);}
				if(rs.length > 0){
					var html = [];
					$.each(rs,function(o,r) {
						var mname = r.mname;
						var sn = r.sn;
						var mn = r.mn;
						var time = r.mt.substring(5,16);
						var ms = r.ms;
						var ss = r.ss;
						var rs = r.rs;
						var cid = r.cid;
						var ic = r.ic;
						var cl = r.cl;
						
						var match = [];
						match.push("<table class='list' border='0' cellSpacing='0' cellPadding='0' >");
						match.push("<tr><td colspan='6' align=center><font size=2 color=#999>" + cid + "</font>&nbsp;&nbsp;<font size=2 color="+cl+">" + mname + "</font>&nbsp;&nbsp;<font size=2 color=#999>" + time + "</font></td></tr>");
						if(ic == 1){
							match.push("<tr><td colspan='2' align='center'>[主]" + mn + "</td><td colspan='2' align='center'><font color='red'>取消</font></td><td colspan='2' align='center'>" + sn + "</td></tr>");
						} else {
							match.push("<tr><td colspan='2' align='center'>[主]" + mn + "(<font color='red'>" + ms + "</font>)</td><td colspan='2' align='center'>&nbsp;</td><td colspan='2' align='center'>" + sn + "(<font color='red'>" + ss + "</font>)</td></tr>");
							
							if((""+ms).length > 0 && ("" + ss).length > 0){
								var rss = rs.split(";");
								if(rss.length > 4){
									var arr = [];
									$.each(rss,function(po,pr){
										var parts = pr.split(":");
										if(parts[0] == 'sf'){
											arr[0] = parts[1];
										} else if(parts[0] == 'rfsf'){
											var _arr = parts[1].split(",");
											var sarr = [];
											$.each(_arr,function(_o,_r){
												var rr = _r.split("|");
												sarr.push([rr[1],rr[0]]);
											});
											arr[1] = sarr;
										} else if(parts[0] == 'sfc'){
											arr[2] = parts[1];
										} else if(parts[0] == 'dxf'){
											var _arr = parts[1].split(",");
											var sarr = [];
											$.each(_arr,function(_o,_r){
												var rr = _r.split("|");
												sarr.push([rr[1],rr[0]]);
											});
											arr[3] = sarr;
										}
									});
									
									match.push("<tr><td align='center' colspan='2'><font color='hotpink'>玩法</font></td><td align='center' colspan='2'>让分/预设总分</td><td align='center' colspan='2'><font color='hotpink'>彩果</font></td></tr>");
									match.push("<tr><td align='center' colspan='2'>胜负</td><td align='center' colspan='2'>&nbsp;</td><td align='center' colspan='2'>" + getMatchRT(94, arr[0]) + "</td></tr>");
									var rfsf_len = arr[1].length;
									if(rfsf_len == 1){
										var tr = arr[1][0];
										match.push("<tr><td align='center' colspan='2'>让分胜负</td><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
									} else {
										var tr = arr[1][0];
										match.push("<tr><td align='center' rowspan='" + rfsf_len + "' colspan='2'>让分胜负</td><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
										for(var i = 1; i < rfsf_len; i++){
											var tr = arr[1][i];
											match.push("<tr><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
										}
									}
									match.push("<tr><td align='center' colspan='2'>胜分差</td><td align='center' colspan='2'>&nbsp;</td><td align='center' colspan='2'>" + getMatchRT(96, arr[2]) + "</td>");
									var dxf_len = arr[3].length;
									if(dxf_len == 1){
										var tr = arr[3][0];
										match.push("<tr><td align='center' colspan='2'>大小分</td><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
									} else {
										var tr = arr[3][0];
										match.push("<tr><td align='center' rowspan='" + dxf_len + "' colspan='2'>大小分</td><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
										for(var i = 1; i < dxf_len; i++){
											var tr = arr[3][i];
											match.push("<tr><td align='center' colspan='2'>" + tr[0] + "</td><td align='center' colspan='2'>" + getMatchRT(95, tr[1]) + "</td></tr>");
										}
									}
								} else {
									match.push("<tr><td align='center' colspan='6'>尚未获取到赛果</td></tr>");
								}
							} else {
								match.push("<tr><td align='center' colspan='6'>比赛未完成</td></tr>");
							}
						}
						match.push("</table>");
						html.push(match.join(""));
					});
					$("#tb").append(html.join(""));
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	}
}
function getMatchRS(gid,hs,vs,hss,vss,lose){
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
		rs = hs + "" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "99";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) > 2) {
				rs = "90";
			}
			if (parseFloat(hs) > 4) {
				rs = "90";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "99";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) > 2) {
				rs = "09";
			}
			if (parseFloat(vs) > 4) {
				rs = "09";
			}
		}
	} else if(gid == 91) {
		rs = hs + "" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "99";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) == 3) {
				rs = "90";
			}
			if (parseFloat(hs) == 5 && parseFloat(vs) > 2) {
				rs = "90";
			}
			if (parseFloat(hs) > 5) {
				rs = "90";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "99";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) == 3) {
				rs = "09";
			}
			if (parseFloat(vs) == 5 && parseFloat(hs) > 2) {
				rs = "09";
			}
			if (parseFloat(vs) > 5) {
				rs = "09";
			}
		}
	} else if(gid == 87 || gid == 92){
		if (parseFloat(hss) > parseFloat(vss)) {//胜
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "33";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "31";
			} else {
				rs = "30";
			}
		} else if (parseFloat(hss) == parseFloat(vss)) {//平
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "13";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "11";
			} else {
				rs = "10";
			}
		} else {
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "03";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "01";
			} else {
				rs = "00";
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
function getMatchRT(gid,rst){
	var rs = "";
	if(gid == 90 || gid == 85 || gid == 72 || gid == 87 || gid == 92 || gid == 94 || gid == 95){
		rs = rst.replaceAll("3", "胜");
		rs = rs.replaceAll("1", "平");
		rs = rs.replaceAll("0", "负");
	} else if(gid == 86 || gid == 91) {
		rs = rst.substring(0,1) + ":" + rst.substring(1,2);
		rs = rs.replaceAll("9:9", "平其他");
		rs = rs.replaceAll("9:0", "胜其他");
		rs = rs.replaceAll("0:9", "负其他");
	} else if(gid == 88){
		rs = rst.replaceAll("3", "上单");
		rs = rs.replaceAll("2", "上双");
		rs = rs.replaceAll("1", "下单");
		rs = rs.replaceAll("0", "下双");
	} else if(gid == 89 || gid == 93){
		rs = rst.replaceAll("7", "7+");
	} else if(gid == 96){
		rs = rst.replaceAll("11", "主负1-5");
		rs = rs.replaceAll("15", "主负21-25");
		rs = rs.replaceAll("16", "主负26+");
		rs = rs.replaceAll("01", "主胜1-5");
		rs = rs.replaceAll("02", "主胜6-10");
		rs = rs.replaceAll("03", "主胜11-15");
		rs = rs.replaceAll("04", "主胜16-20");
		rs = rs.replaceAll("05", "主胜21-25");
		rs = rs.replaceAll("06", "主胜26+");
		rs = rs.replaceAll("12", "主负6-10");
		rs = rs.replaceAll("13", "主负11-15");
		rs = rs.replaceAll("14", "主负16-20");
	} else if(gid == 97){
		rs = rst.replaceAll("3", "大分");
		rs = rs.replaceAll("0", "小分");
	}
	return rs;
};
