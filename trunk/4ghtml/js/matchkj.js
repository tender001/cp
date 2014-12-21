//var jczq_kj = {
//    initail: function() {
//       
//        jQuery(".date").attr("class", "date");
//        jQuery("#txtBirthday").parent().attr("class", "");
//        jQuery("html").attr("class", "");
//        jQuery("body").attr("class", "");
//        jQuery("#delete_parent").parent().attr("class", "");
//       
//    }
//}

function showmatchkj(){
	var gid = location.search.getParam('gid');
	var xpid = location.search.getParam('pid');
	if(gid == undefined){
		showTips('参数异常!');
		return;
	}

	var gs = [["jczq","竞彩足球开奖"], ["jclq","竞彩篮球开奖"], ["bjdc","北京单场开奖"]];

	$("#payment").attr("href",(gid=="bjdc"?"/bd/":"/"+gid+"/"));
	var flag = false;
	$.each(gs,function(o,g){
		if(g[0] == gid){
			$(".buyHeader h1").html(g[1]);
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
							if(xpid != ''){
								cpid = xpid;
							}else if(o==0){
								cpid = pid;
							}
//							if(flag == 1){
//								html.push("<option value='/info/football.html?gid=bjdc&="+pid+"' id="+pid+">当前期"+pid+"</option>");
//								if(xpid == ''){
//									cpid = pid;
//								}
//							} else {
//								html.push("<option value='/info/football.html?gid=bjdc&pid="+pid+"' id="+pid+">历史期"+pid+"</option>");
//							}
						});
//						html.push("<option value='/history/'>返回列表</option>");
//						$("#listexpect").html(html.join(""));
						if(cpid != ''){
//							$("#"+cpid).attr("selected","selected");
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
//						var day = pid.substring(0,4) + "-" + pid.substring(4,6) + "-" + pid.substring(6, 8);
						if(xpid != ''){
							cpid = xpid;
						}else if(o==0){
							cpid = pid;
						}
//						http://local.159cai.com/info/football.html?gid=jclq&did=140409
//						html.push("<option value='/info/football.html?gid=" + gid + "&pid="+pid+"' id="+pid+">"+day+"</option>");
//						if(cpid == ''){
//							cpid = pid;
//						}
					});
//					html.push("<option value='/history/'>返回列表</option>");
//					$("#listexpect").html(html.join(""));
					if(cpid != ''){
//						$("#"+cpid).attr("selected","selected");
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
						var match ="";
						var num=0;
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
							
							num++;
//							if(11 == 1){
//								if(lose == 0){
//									
//								}else{
//									
//								}
//							}else{
								
							
							match +='<ul class="sfcxs"><li><em>'+ mid +'</em><p color='+cl+'>'+ mname +'</p><cite>'+ time + '</cite></li>'
							var bc = "-- : --";
							var qc = "-- : --";
							
							if((""+hss).length > 0 && (""+hms).length > 0 && (""+ss).length > 0 && (""+ms).length > 0){
								bc = hms + " : " + hss;
								qc = ms + " : " + ss;
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
								
								match +='<li><p class="spfzpkNum"><span>(主)'+ hn +'</span><span class="spfvs">'+qc+'</span><span>'+ gn +'(客)</span></p>'
									+'<div><p><span>胜平负</span><span>总进球</span><span>半全场</span><span>上下单双</span></p>'
									+'<p><span >'+ getMatchRT(85, arr[0][0]) +'('+ arr[0][1] + ')</span><span class=" jclqsf">'+ getMatchRT(89, arr[4][0]) +'('+ arr[4][1] +')</span>'
									+'<span>'+ getMatchRT(87, arr[2][0]) + '('+ arr[2][1] +')</span><span><em> '+ getMatchRT(88, arr[3][0]) +'('+ arr[3][1] +')</em></span></p>'
									+'</div></li></ul>';
							}else{
								match +='<li><p class="spfzpkNum"><span>(主)'+ hn +'</span><span class="spfvs">'+qc+'</span><span>'+ gn +'(客)</span></p>'
									+'<div><p><span>胜平负</span><span>总进球</span><span>半全场</span><span>上下单双</span></p>'
									+'<p><span >-</span><span class=" jclqsf">-</span>'
									+'<span>-</span><span><em> -</em></span></p>'
									+'</div></li></ul>';
							}
								
							
//							}
							
							
							
						});
						var day = "20"+expect.substring(0,2) + "-" + expect.substring(2,4) + "-" + expect.substring(4, 6);
						$(".jczqkj").html(match);
						$(".sfcTitle").html(day+'&nbsp;&nbsp;'+num+'场比赛')
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
					var match ="";
					var num=0;
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
						
						
						num++;
						if(ic == 1){
							if(lose == 0){
								
							}else{
								
							}
						}else{
							
						
						match +='<ul class="sfcxs"><li><em>'+ cid +'</em><p color='+cl+'>'+ mname +'</p><cite>'+ time + '</cite></li>'
						var bc = "-- : --";
						var qc = "-- : --";
						
						if((""+hss).length > 0 && (""+hms).length > 0 && (""+ss).length > 0 && (""+ms).length > 0){
							bc = hms + " : " + hss;
							qc = ms + " : " + ss;
							var arr = [];
							arr.push([getMatchRS("90", ms, ss, hms, hss, lose)]);
							arr.push([getMatchRS("91", ms, ss, hms, hss, lose)]);
							arr.push([getMatchRS("92", ms, ss, hms, hss, lose)]);
							arr.push([getMatchRS("93", ms, ss, hms, hss, lose)]);
							arr.push([getMatchRS("72", ms, ss, hms, hss, lose)]);
							
							match +='<li><p class="spfzpkNum"><span>(主)'+ mn +'</span><span class="spfvs">'+qc+'</span><span>'+ mn +'(客)</span></p>'
								+'<div><p><span>胜平负</span><span>让球('+lose+')</span><span>总进球</span><span>半全场</span></p>'
								+'<p><span >'+getMatchRT(90, arr[0][0])+'</span><span class=" jclqsf">'+getMatchRT(72, arr[4][0])+'</span>'
								+'<span>'+getMatchRT(93, arr[3][0])+'</span><span><em> '+ getMatchRT(92, arr[2][0]) +'</em></span></p>'
								+'</div></li></ul>';
						}else{
							match +='<li><p class="spfzpkNum"><span>(主)'+ mn +'</span><span class="spfvs">'+qc+'</span><span>'+ mn +'(客)</span></p>'
								+'<div><p><span>胜平负</span><span>让球('+lose+')</span><span>总进球</span><span>半全场</span></p>'
								+'<p><span >-</span><span class=" jclqsf">-</span>'
								+'<span>-</span><span><em> -</em></span></p>'
								+'</div></li></ul>';
						}
							
						
						}
						
					});
				}
				var day = "20"+expect.substring(0,2) + "-" + expect.substring(2,4) + "-" + expect.substring(4, 6);
				$(".jczqkj").html(match);
				$(".sfcTitle").html(day+'&nbsp;&nbsp;'+num+'场比赛')
				
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	} else if(gid=="jclq"){
		
		var html = "";
		 $.ajax({
				url :"/cpdata/match/jclq/award/"+expect+"/"+expect+".json",
				dataType:"json",
				success:function(data){
					var rs = data.rows.row;
					
					if(rs && !isArray(rs)){rs = new Array(rs);}
					if(rs.length > 0){
						var html = [];
						var num=0;
						$.each(rs,function(o,row) {
							num++;
							 row.index=row.mid;
								row.short_mt=row.mt.substring(5,16);
								row.sname=row.mname.substr(0,4);
								if(row.cl.length<3){row.cl="blue";}
								if (parseInt(row.ic)==0){
									if(row.rs.length>2){//已出赛果
										row.bf=row.ss+":"+row.ms;
										    var rsstr=row.rs.split(";");
											var rt=(row.ms*1-row.ss*1)*1;
											if(rsstr[0].length>3){if(rt*1>0){row.spf="主胜";}else{row.spf="主负";}}

											if(rsstr[2].length>4){
											if(rt>0&&rt<6){row.cbf="主胜1-5";}
											else if(rt>5&&rt<11){row.cbf="主胜6-10";}
											else if(rt>10&&rt<16){row.cbf="主胜11-15";}
											else if(rt>15&&rt<21){row.cbf="主胜16-20";}
											else if(rt>20&&rt<26){row.cbf="主胜21-25";}
											else if(rt>25){row.cbf="主胜26+";}
											else if(rt>-6&&rt<0){row.cbf="客胜1-5";}
											else if(rt>-11&&rt<-5){row.cbf="客胜6-10";}
											else if(rt<-10&&rt>-16){row.cbf="客胜11-15";}
											else if(rt<-15&&rt>-21){row.cbf="客胜16-20";}
											else if(rt<-20&&rt>-26){row.cbf="客胜21-25";}
											else if(rt<-25){row.cbf="客胜26+";}
											}
											
											rt=rsstr[1];
											rt=rt.split(":")[1];
											var rtstr=rt.split(",");
											row.opstr1="";
											var r1,r2,temp1;
											for(ii=0;ii<rtstr.length;ii++){
												r1=rtstr[ii].split("|")[0];
												r2=rtstr[ii].split("|")[1];
												if(ii==0){temp1=r1;}else if(temp1!=r1){row.jqs="<span style='color:red'>"+row.jqs+"</span>";}
												if(r1*1>1){r1="让分主胜";}else{r1="让分主负";}
												if(ii==0){row.jqs=r1;}
												row.opstr1 +='<option value="'+r1+'">'+r2+'</option>';
											}
											rt=rsstr[3];
											rt=rt.split(":")[1];
											var rtstr=rt.split(",");
											row.opstr2="";
											var r3,r4,temp2;
											for(ii=0;ii<rtstr.length;ii++){
												r3=rtstr[ii].split("|")[0];
												r4=rtstr[ii].split("|")[1];
												if(ii==0){temp2=r3;}else if(temp2!=r3){row.bqc="<span style='color:red'>"+row.bqc+"</span>";}
												if(r3*1>1){r3="大分";}else{r3="小分";}
												if(ii==0){row.bqc=r3;}
												row.opstr2 +='<option value="'+r3+'">'+r4+'</option>';
											}

									}else{
										row.bf="开奖中";
										row.spf="";
										row.cbf="";
										row.jqs="";
										row.bqc="";
									}
								
								}else{//取消
									row.bf="取消";
									row.spf="-";
									row.cbf="-";
									row.jqs="-";
									row.bqc="-";
									row.url='-';
								}
								html +='<ul class="sfcxs"><li><em>'+ row.cid +'</em><p color='+row.cl+'>'+ row.mname +'</p><cite>'+ row.short_mt + '</cite></li>'
								html +='<li><p class="spfzpkNum"><span>(客)'+ row.sn +'</span><span class="spfvs">'+row.bf+'</span><span>'+ row.mn +'(主)</span></p>'
								+'<div><p><span>胜负</span><span>让分胜负('+row.opstr1+')</span><span>大小分('+row.opstr2+')</span><span>胜分差</span></p>'
								+'<p><span >'+row.spf+'</span><span class=" jclqsf">'+row.jqs+'</span>'
								+'<span>'+row.bqc+'</span><span><em> '+ row.cbf +'</em></span></p>'
								+'</div></li></ul>';
						           
//								html[html.length] = tableTpl[0].tpl(row);
						 
						})
						$(".jczqkj").html(html);
						var day = "20"+expect.substring(0,2) + "-" + expect.substring(2,4) + "-" + expect.substring(4, 6);
						$(".sfcTitle").html(day+'&nbsp;&nbsp;'+num+'场比赛')
					}
				}
		
	})
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
