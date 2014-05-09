$(function() {
	var lotid = $("#lotid").val();	
	var expect = location.search.getParam('expect');
	if (lotid == "") {
		lotid = "80";
	}
	$(".nngg_a a").each(function(o,rt){
		if($(rt).attr("mark") == $("#lotid").val()){
			$(rt).addClass("cur").siblings().removeClass("cur");
		}
	});
	$("#show_info").click(function(o,rt){
		if($(this).is( ":checked" )){
			$("#more_info").show();
		}else{
			$("#more_info").hide();
		}
		
	});
	showinfo(lotid,expect);

	$("#expect").bind({
		change : function() {
			$("#bf_url").attr("href",bfurl($("#lotid").v, $("#expect").val()));
			if ($("#seltype").val()=="my"){
				
				myguoguan($("#lotid").val(), $("#expect").val(),1,25,0,0);
			}else{
				loadmain($("#lotid").val(), $("#expect").val());
					
			}
		}
	});
	$(".zn_gg_3 #seltype2").bind({
		click:function(){
			myguoguan(lotid,$("#expect").val(),1,25,0,0);
		
		}	
	});
	$(".zn_gg_3 #seltype1").bind({
		click:function(){
			var pn=1;//页码
			var ps = $("#ps").val();//页面大小
			var tp = $("#tp").val();//总页数
			var tr = $("#tr").val();//总记录数	
            loadpage($("#lotid").val(),$("#expect").val(),pn,ps,tp,tr);
            $(this).addClass("cur").siblings().removeClass("cur");
		}	
	}); 
});

var myguoguan = function(lotid,expect,pn,ps,tp,tr){
	tp=0;
	var data = $_user.key.gid+"=" + lotid + "&"+$_user.key.tid+"=" + expect; 
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	var tophtml=' <colgroup><col width="80"><col width="110"><col width="95"><col width="100"><col width="95"><col width="95"><col width="95"><col width="95"><col width="100"><col width="102"></colgroup>';
	tophtml +='<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">全对注数</td><td align="center">错一注数</td> <td align="center">正确场数</td><td align="right">税前奖金</td> <td align="center">投注分布</td><td align="center">方案详情</td></tr> </thead>';
	Y.ajax({
		url : $_user.url.myguoguan,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;			
			var html=tophtml;
			if (code == "0") {
				var r = obj.Resp.row;
				if(r == undefined){
					nodata();
					return;
				}
				var rs = obj.Resp.count;
				tr=Y.getInt(rs.rc);
				tp=Y.getInt(rs.tp);
				ps=Y.getInt(rs.ps);
				pn=Y.getInt(rs.pn);	
				if (tr%ps==0){tp=tr/ps;}else{tp=Math.ceil(tr/ps);}		
				var j=0;
				if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						j=j+1;
						var rec = rt.rec;
						var uid = rt.nickid;
						var ag = rt.ag;
						var au = rt.au;
						var info = rt.info;
						var bonus = rt.bonus;
						var betnum = rt.betnum;	
						var hid = rt.hid;	
						$("#seltype2").addClass("cur").siblings().removeClass("cur");	
						info=info.split(",");
						var cl=o%2==0?"":"odd";
						html+='<tr class='+cl+'>'+
						'<td align="center">'+((pn*1-1)*ps+rec*1)+'</td>'+
						'<td>'+uid+'</td><td align="center"><a href="javascript:void(0)">'+$_sys.showzhanji(ag,au)+'</a></td>';
						html+='<td align="right"><a href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">'+betnum+'</a></td>';
						
						var max = 0;
						for(var t=0;t<info.length;t++){
							if(info[t]>0){
								max = info[t];break;
							}
						}
						html+='<td align="center">'+max+'</td>';
								
						html+='<td align="center">'+info[0]+'</td>';			
						html+='<td align="center">'+info[1]+'</td>';		
						html+='<td align="center">查看</td>';
						
						html+='<td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):'--')+'</td>';
						html+='<td align="center"><a href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td>';
						'</tr>';				
					});
				$('#showlist').html(html);		
				showmypageno(lotid, expect, pn, ps, tp , tr);
			} else {
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						myguoguan(lotid,expect,pn,ps,tp,tr);		
					});
				}else{
					var html=tophtml;
					html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
					$('#showlist').html(html);
					return false;
				}
			}
			
		},
		error : function() {
			var html=tophtml;
			html+='<ul class="cm_hmlist_ul30 clear"><li class="cm_align_center cm_red" style="width:100%;">文件尚未生成</li></ul>';
			$('#showlist').html(html);
			return false;			
		}
	});	
};

var showmypageno=function(lotid, expect, pn, ps, tp , tr){
	var pagehtml='<ul><li class="disabled PagedList-skipToFirst"  onclick="myguoguan(\''+lotid+'\', \''+expect+'\',1,'+ps+','+tp+','+ tr+');"><a>首页</a></li>';
	pagehtml += '<li class="PagedList-skipToNext"><a  onclick="myguoguan(\''+lotid+'\', \''+expect+'\','+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+ tr+');" href="javascript:void(0)">上一页</a></li>';
	pagehtml+='<li class="PagedList-skipToNext"><a onclick="myguoguan(\''+lotid+'\', \''+expect+'\','+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+ tr+');"  href="javascript:void(0)">下一页</a></li><ul>';
    $('#pagediv').html(pagehtml);	
};

var showinfo = function(lotid, expect,type) {
	var Durl="/cpdata/guoguan/"+lotid+"/index.json";
	Y.ajax({
		url : Durl,
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var r = obj.rows.row;
			var expectlist = [];
			
			r.each(function(rt,o) {
				
					var pid = rt.pid;
					expectlist[expectlist.length] = [pid];
				
			});
			var html='';
			if (expectlist.length>0){
				for ( var i = 0; i < expectlist.length; i++) {
					html+='<option value="'+expectlist[i][0]+'">'+expectlist[i][0]+'</option>';
				}		
			}

			$("#expect").html('');
			$("#expect").append(html);
			if (expect == "") {
				expect = expectlist[0][0];
			}
			$("#bf_url").attr("href", bfurl(lotid, expect));
			loadmain(lotid, expect,type);
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
};
var bfurl = function(lotid, expect){
	if(lotid == 82){
		return "http://bf.gucheng.159cai.com/zucai/jq?expect=" + expect;
	} else if(lotid == 83){
		return "http://bf.gucheng.159cai.com/zucai/bq?expect=" + expect;
	}
	return "http://bf.gucheng.159cai.com/zucai?expect=" + expect;
};
var loadmain = function(lotid, expect,type) {
	
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/" + expect + ".json?r="+Math.random(),
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var rs = obj.rows;
			var tps=rs.as.ps;
			var ttp=rs.as.tp;
			var ttotal=rs.as.total;
			var codes = rs.code.split(",");
			var r = rs.row;
			var atime=rs.atime;
			$("#ps").val(rs.as.ps);
			$("#tp").val(rs.as.tp);
			$("#tr").val(rs.as.total);
			$("tr.foot td").each(function(o,rt){
					$(rt).html(codes[o]);
			});
			
			

			$("#zc_match tr").each(function(o,rt){
				if(o == 1){
					$(rt).find("td").each(function(o1,rt1){
						
					$(rt1).html(r[o1].hn.replace(/\s/ig,''));
					});
				}else if(o == 3){
					$(rt).find("td").each(function(o1,rt1){
						$(rt1).html(r[o1].hs + ":" + r[o1].vs);
						if(r[o1].hs.length == 0 && r[o1].vs.length == 0){
							$(rt1).html("-");
						}
					});
				} else if(o == 4){
					$(rt).find("td").each(function(o1,rt1){
					$(rt1).html(r[o1].vn.replace(/\s/ig,''));
					
				});
			}
			});
//			$("#bqc_match tr").each(function(o,rt){
//				if(o == 1){
//					$(rt).find("td").each(function(o1,rt1){
//					$(rt1).html(r[o1*2].hn.replace(/\s/ig,'').replace(/\[.+\]/ig,''));
//						
//					});
//				}else if(o == 4){
//					$(rt).find("td").each(function(o1,rt1){
//						if(o1%2 == 0){
//							if(new String(r[o1].hhs).length == 0 && new String(r[o1].hvs).length == 0 ){
//								$(rt1).html("-");
//							}else{
//								$(rt1).html(r[o1].hhs + ":" + r[o1].hvs);
//							}
//						}else{
//							if(new String(r[o1].hs).length == 0 && new String(r[o1].vs).length == 0 ){
//								$(rt1).html("-");
//							}else{
//								$(rt1).html(r[o1].hs + ":" + r[o1].vs);
//							}
//						}
//					});
//				}else if(o == 5){
//					$(rt).find("td").each(function(o1,rt1){
//					$(rt1).html(r[o1*2].vn.replace(/\s/ig,'').replace(/\[.+\]/ig,''));
//						
//					});
//				}
//			});
			$(".kj_dzxq b").each(function(rt){
				$(rt).html(codes[rt-1]);
			});
			if(lotid=="82"){
				$("div[mark=hn]").each(function(o,rt){
					$(rt).html(r[o].hn.replace(/\s/ig,''));
				})
				$("div[mark=gn]").each(function(o,rt){
					$(rt).html(r[o].vn.replace(/\s/ig,''));
				})
				$("div[mark=bf]").each(function(o,rt){
					
					if(new String(r[o].hs).length == 0 && new String(r[o].vs).length == 0 ){
						$(rt).html("-");
					}else{
						$(rt).html("&nbsp;&nbsp;<br>"+r[o].hs + ":" + r[o].vs);
					}
				})
				$("div[mark=cg] td").each(function(o,rt){
				$(rt).html(r[o].vn.replace(/\s/ig,''));
			})
			}else if(lotid == "83"){
				$("div[mark=hn]").each(function(o,rt){
					$(rt).html(r[o*2].hn.replace(/\s/ig,'').replace(/\[.+\]/ig,''));
				})
				$("div[mark=gn]").each(function(o,rt){
					$(rt).html(r[o*2].vn.replace(/\s/ig,''));
				})
				$("div[mark=bf]").each(function(o,rt){
//					if(o%2==0){
						if(new String(r[o*2].hs).length == 0 && new String(r[o*2].vs).length == 0 ){
							$(rt).html("-");
						}else{
							$(rt).html("&nbsp;&nbsp;<br>"+r[o*2].hs + ":" + r[o*2].vs);
						}
//					}
					
				})
				$("div[mark=cg] td").each(function(o,rt){
				$(rt).html(r[o*2].vn.replace(/\s/ig,'').replace(/\[.+\]/ig,''));
			})
			}
		
			
			var ninfo = new String(rs.ninfo).split(",");
			var ginfo = new String(rs.ginfo).split(",");
			
			var xl="-",one_no="-",one_money="-",two_no="-",two_money="-",gc="-";
			if(rs.gsale > 0){xl=rs.gsale}
			if(rs.gpool >= 0){gc=rs.gpool.length==''?"0":rs.gpool}
			if(lotid == 80 || lotid == 81|| lotid == 82|| lotid == 83){
				if(ninfo.length > 1&&ginfo.length > 1){
					one_no=ninfo[0];
					two_no=ninfo[1];
					
					one_money=ginfo[0];
					two_money=ginfo[1];
				}else{
					if(ninfo[0].length > 0){
						one_no=ninfo[0];
					}
					if(ginfo[0].length > 0){
						one_money=ginfo[0];
					}
				}
			}
			var g_info='';
			
			if(lotid==80){
//				g_info='本期销售：<font >'+xl+'</font> 元<br />滚存：<font>'+gc+'</font>元<br />一等奖：<font>'+one_no+'</font> 注，奖金：<font >'+one_money+'</font> 元<br />二等奖：<font>'+two_no+'</font> 注，奖金：<font >'+two_money+'</font> 元<br />';
				g_info=' <table width="100%" border="0" cellpadding="0" cellspacing="0">';
				g_info +='<thead><tr><td>奖项</td><td>中奖注数</td><td>每注金额(元)</td></tr></thead>';
				g_info += '<tr><td>一等奖</td><td>'+one_no+'</td> <td><em>'+one_money+'</em></td> </tr> <tr><td>二等奖</td><td>'+two_no+'</td><td><em>'+two_money+'</em></td></tr>';
				g_info += '<tr><td colspan="2" class="cop" style="border-right:none"><strong>全国销量：</strong><em>'+xl+'</em>元</td><td class="cop"><strong>奖池滚存：</strong><em>'+gc+'</em>元</td></tr></table>';
			}else{
				g_info=' <table width="100%" border="0" cellpadding="0" cellspacing="0"><thead><tr><td>奖项</td><td>中奖注数</td> <td>每注金额(元)</td></tr></thead>';
				//g_info +='<thead><tr><td>奖项</td><td>中奖注数</td><td>每注金额(元)</td></tr></thead>';
				g_info += '<tr><td>一等奖</td><td>'+one_no+'</td> <td><em>'+one_money+'</em></td> </tr>';
				g_info += '<tr><td colspan="3" class="cop"><strong>全国销量：</strong><em>'+xl+'</em>元</td></tr><tr><td colspan="3" class="cop"><strong>奖池滚存：</strong><em>'+gc+'</em>元</td></tr></table>';
			}
			
			$("#kj_time").html(atime.substr(0,10));
			$("#g_info").html(g_info);
			

			loadpage(lotid, expect,1,tps,ttp,ttotal);
		},
		error : function() {
			var html=' <colgroup><col width="70"><col width="110"><col width="95"><col width="100"><col width="85"><col width="85"><col width="85"><col width="85"><col width="90"><col width="92"><col width="95"></colgroup>';
			html +='<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">全对注数</td><td align="center">错一注数</td> <td align="center">正确场数</td><td align="right">税前奖金</td> <td align="center">投注分布</td><td align="center">方案详情</td><td align="center">定制跟单</td></tr> </thead>';
			html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
			$('#showlist').html(html);
			return false;
		}
	});
};
var nodata = function(){
	var html=' <colgroup><col width="70"><col width="110"><col width="95"><col width="100"><col width="85"><col width="85"><col width="85"><col width="85"><col width="90"><col width="92"><col width="95"></colgroup>';
		html +='<thead><tr class=tr1><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">全对注数</td><td align="center">错一注数</td> <td align="center">正确场数</td><td align="right">税前奖金</td> <td align="center">投注分布</td><td align="center">方案详情</td><td align="center">定制跟单</td></tr> </thead>';
	html+='<tr><td colspan="11"><p style="padding:20px 0;line-height:20px;color:#444;text-align:center;font-size:14px">本期无购买记录</p></td></tr>';
	$('#showlist').html(html);
};
var getmax = function(info){
	var max=0;
	for (var i=0;i<info.length;i++){
	max=i;
	if (info[i]>0){
	break;
	}
	}
	return info.length-max-1;
	}; 
var loadpage = function(lotid,expect,pn,ps,tp,tr) {
//	var html='<colgroup><col width="60" /><col width="100" /><col width="135" /><col width="100" /><col width="80" /><col width="100" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><tr><td>排序</td><td>发起人</td><td>战绩</td><td>方案金额</td><td class="x_jc">全对注数</td><td class="x_jc">错一注数</td><td>正确场数</td><td>投注分布</td><td>税前奖金</td><td>详情</td><td>定制跟单</td></tr>';
	$("#seltype1").addClass("cur");
	$("#seltype2").removeClass("cur");
	var html=' <colgroup><col width="70"><col width="110"><col width="95"><col width="100"><col width="85"><col width="85"><col width="85"><col width="85"><col width="90"><col width="92"><col width="95"></colgroup>';
 		html +='<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">全对注数</td><td align="center">错一注数</td> <td align="center">正确场数</td><td align="right">税前奖金</td> <td align="center">投注分布</td><td align="center">方案详情</td><td align="center">定制跟单</td></tr> </thead>';
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/as_"+pn+".json?r="+Math.random(),
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var j=0;
			if(tr==0){
				html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
				$('#showlist').html(html);
				return false;
			}else{
				var r=obj.rows.row;
				if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						j=j+1;
						var uid = rt.uid;
						var ag = rt.ag;
						var au = rt.au;
						var info = rt.info;
						var bonus = rt.bonus;
						var betnum = rt.betnum;
						var hid = rt.hid;	
						
						info=info.split(",");
						var cl=o%2==0?"":"odd";
						html+='<tr class='+cl+'>'+
						'<td align="center">'+((pn*1-1)*ps+j)+'</td>'+
						'<td>';
						
						var isdg=false;
						if (uid.indexOf("*****")>0 || uid=='******'){
							isdg=true;					
						}
						
						if (isdg){
							html+=''+uid+'';
						}else{
							html+='<a href="javascript:void(0);" class="a1" onclick="Y.openUrl(\'/game/zhanji.html?lotid='+lotid+'&uid='+uid+'&func=award\',806,600)" >'+uid+'</a>';
						}					
						html+='</td>'+'<td align="center">';
						html+=isdg?'&nbsp;':($_sys.showzhanji(au,ag)==''?'&nbsp;':$_sys.showzhanjii(lotid,uid,au,ag));
						html+='</td>';
						html+=isdg?'<td align="right">***</td>':'<td align="right"><a  href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">'+betnum+'</a></td>';
						var max = 0;
						for(var t=0;t<info.length-1;t++){
							if(info[t]>0){
								max = t;break;
							}
						}
						
						html+='<td align="center">'+(parseInt(info[0])>0?('<em>'+info[0]+'</em>'):info[0])+'</td>';	
						if(lotid==80){
							html+='<td align="center">'+(parseInt(info[1])>0?('<em>'+info[1]+'</em>'):info[1])+'</td>';
						}else{
							html+='<td align="center">'+info[1]+'</td>';
						}
						
						if(parseInt(info[0])>0){
							
							html+='<td align="center"><em>'+getmax(info)+'</em></td>';
						}else if(lotid==80&&parseInt(info[0])==0&&parseInt(info[1])>0){
							html+='<td align="center"><em>13</em></td>';
						}else{
							html+='<td align="center">'+getmax(info)+'</td>';
						}
						 html+=' <td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):(parseFloat(bonus).rmb(false)))+'</td>';	

						 html+=isdg?'<td align="center">--</td>':'<td align="center"><a href="zcfb.html?lotid='+lotid+'&expect='+expect+'&projid='+hid+'" target="_blank">查看</a></td><td align="center">';

						
						
							html+=isdg?'</td><td align="center">':'<a  href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td><td align="center">';
							html+=isdg?'--</td><td align="center">--':'<a class="n_gz" href="javascript:void(0);" onclick="$_sys.autobuy(\''+lotid+'\',\''+uid+'\')" >定制</a>';
							html+='</td></tr>';						
						
					});
			}
			
			$('#showlist').html(html);		
			showpageno(lotid, expect ,pn,ps,tp,tr);				
		},
		error : function() {
			var html=tophtml;
			html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
			$('#showlist').html(html);
			return false;			
		}
	});
};

var showpageno=function(lotid,expect,pn,ps,tp,tr){	
	var maxshow=5;
	var pagehtml='<ul><li class="disabled PagedList-skipToFirst"  onclick="loadpage(\''+lotid+'\', \''+expect+'\',1,'+ps+','+tp+','+ tr+');"><a>首页</a></li>';
	pagehtml += '<li class="PagedList-skipToNext"><a  onclick="loadpage(\''+lotid+'\', \''+expect+'\','+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+ tr+');" href="javascript:void(0)">上一页</a></li>';
	var min=0;
	var max=0;
	
	if (tp > maxshow){
	var pageTemp=parseInt(pn*1/maxshow);

	
	max = pageTemp*maxshow+maxshow;
	min = pageTemp*maxshow;
	
	if(max>tp){
	max=tp;
	}
	if(pn>min){min=min+1;}
	}else{
	min = 1;
	max = tp;
	}
	

	
	for (var i=min;i<max*1+1;i++){
	if (i==pn){
	pagehtml+='<li class="active"><a href="javascript:void(0);" id="'+i+'" class="a4" onclick="loadpage(\''+lotid+'\', \''+expect+'\','+i+','+ps+','+tp+','+ tr+');">' + i + '</a></li>';
	}else{
		pagehtml+='<li><a href="javascript:void(0);" id="'+i+'" class="a3" onclick="loadpage(\''+lotid+'\', \''+expect+'\','+i+','+ps+','+tp+','+ tr+');">' + i + '</a></li>';
	}
	}
	
	pagehtml+='<li class="PagedList-skipToNext"><a onclick="loadpage(\''+lotid+'\', \''+expect+'\','+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+ tr+');"  href="javascript:void(0)">下一页</a></li><ul>';
    $('#pagediv').html(pagehtml);	
    if(pn==min&&min-maxshow>0){
		$("#"+pn+"").click(function(){
			loadpage(lotid,expect,pn-maxshow>=0?(pn-maxshow):maxshow,ps,tp,tr);
		})
	}else if(min-maxshow==0){
		$("#"+pn+"").click(function(){
			loadpage(lotid,expect,1,ps,tp,tr);
		})
	}
    $("#govalue").val(pn);
};