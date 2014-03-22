$(function() {
	var lotid = $("#lotid").val();	
	var expect = location.search.getParam('expect');
	if (lotid == "") {
		lotid = "85";
	}
	$(".nngg_a a").each(function(o,rt){
		if($(rt).attr("mark") == $("#lotid").val()){
			$(rt).addClass("cur").siblings().removeClass("cur");
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
	$("#seltype2").bind({
		click:function(){
			myguoguan(lotid,$("#expect").val(),1,25,0,0);
		}	
	});
	$("#seltype1").bind({
		click:function(){
			var pn=1;//页码
			var ps = $("#ps").val();//页面大小
			var tp = $("#tp").val();//总页数
			var tr = $("#tr").val();//总记录数	
            loadpage($("#lotid").val(),$("#expect").val(),pn,ps,tp,tr);
		}	
	}); 
});

var myguoguan = function(lotid,expect,pn,ps,tp,tr){
	$("#seltype2").addClass("cur");
	$("#seltype1").removeClass("cur");
	tp=0;
	var data = $_user.key.gid+"=" + lotid + "&"+$_user.key.tid+"=" + expect; 
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;	
//	var tophtml='<colgroup><col width="30" /><col width="150" /><col width="135" /><col width="100" /><col width="100" /><col width="100" /><col width="100" /><col width="100" /><col width="60" /><col width="60" /></colgroup><tr><td>排序</td><td>发起人</td><td>战绩</td><td>方案金额</td><td>场数</td><td>过关类型</td><td>中奖注数</td><td>税前奖金</td><td>详情</td></tr>';	
	var tophtml='<colgroup><col width="80"><col width="120"><col width="100"><col width="110"><col width="110"><col width="110"><col width="110"><col width="110"><col width="120"></colgroup>';
	tophtml += '<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">场数</td><td align="center">过关类型</td><td align="center">中奖注数</td><td align="right">税前奖金</td><td align="center">详情</td></tr></thead>';
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
						lotid=hid.substring(2,4);
						info=info.split("|");
						var cl=o%2==0?"":"odd";
						html+='<tr class='+cl+'>'+
						'<td align="center">'+((pn*1-1)*ps+rec*1)+'</td>'+
						'<td>'+uid+'</td><td align="center"><a href="javascript:void(0)">'+$_sys.showzhanji(ag,au)+'</a></td>';
						html+='<td align="right"><a href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">'+betnum+'</a></td>';
						if (info.length>1){
							
							html+='<td align="center">'+info[1]+'</td>';			
							
							html+='<td align="center" title="'+info[2].replaceAll("\\*","串")+'">'+info[2].split(",")[0].replaceAll("\\*","串")+'</td>';

							if(info[0]>0){
								html+='<td align="center">'+info[0]+'</td>';
							}else{
								html+='<td align="center">'+info[0]+'</td>';
							}
						}else{
							html+='<td align="center" ></td><td align="center"></td><td align="center">未过关</td>';
						}
						html+='<td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):'--')+'</td>';
						html+='<td align="center"><a href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td>';
						'</tr>';				
					});
				$('#showlist').html(html);		
				showmypageno($("#lotid").val(), expect, pn, ps, tp , tr);
				
			} else {
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						myguoguan(lotid,expect,pn,ps,tp,tr);		
					});
				}else{
					var html=tophtml;
					html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center">该玩法无方案存在</p></td></tr>';
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
	if($("#lotid").val()==30){
		lotid="85"
	}
	var _url="";
	if($("#lotid").val()==30){
		_url="/cpdata/guoguan/bjdc/index.json?r="+Math.random()
	}else{
		_url="/cpdata/guoguan/"+lotid+"/index.json?r="+Math.random()
	}
	Y.ajax({
		url : _url,
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var r = obj.rows.row;
			var expectlist = [];
			
			if(r.length){
				r.each(function(rt,o) {
					var pid = rt.pid;
					expectlist[expectlist.length] = [pid];			
				});
			}else{
				var pid = r.pid;
				expectlist[expectlist.length] = [pid];
			}
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
	return "http://bf.159cai.com/danchang?expect=" + expect;
};
var loadmain = function(lotid, expect,type) {
	var _url="";
	if($("#lotid").val()==30){
		_url="/cpdata/guoguan/bjdc/" + expect + "/" + expect + ".json?r="+Math.random();
	}else{
		_url="/cpdata/guoguan/" + lotid + "/" + expect + "/" + expect + ".json?r="+Math.random();
	}
	Y.ajax({
		url : _url,
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var rs = obj.rows;
			var tps=rs.bjfs.ps;
			var ttp=rs.bjfs.tp;
			var ttotal=rs.bjfs.total;

			$("#ps").val(rs.bjfs.ps);
			$("#tp").val(rs.bjfs.tp);
			$("#tr").val(rs.bjfs.total);
			
			loadpage(lotid, expect,1,tps,ttp,ttotal);
		},
		error : function() {
			var html='<colgroup><col width="70"><col width="120"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="110"></colgroup>';
			html += '<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">场数</td><td align="center">过关类型</td><td align="center">中奖注数</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr></thead>';
			html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center">该玩法无方案存在</p></td></tr>';
			$('#showlist').html(html);
			return false;
		}
	});
};
var nodata = function(){
	var html='<colgroup><col width="70"><col width="120"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="110"></colgroup>';
	html += '<thead><tr class=tr1><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">场数</td><td align="center">过关类型</td><td align="center">中奖注数</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr></thead>';
	html+='<tr><td colspan="11"><p style="padding:20px 0;line-height:20px;color:#444;text-align:center">本期无购买记录</p></td></tr>';
	$('#showlist').html(html);
};
var loadpage = function(lotid,expect,pn,ps,tp,tr) {
	$("#seltype1").addClass("cur");
	$("#seltype2").removeClass("cur");
	var html='<colgroup><col width="70"><col width="120"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="100"><col width="110"></colgroup>';
	html += '<thead><tr class=tr1><td align="center">排序</td><td>发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">场数</td><td align="center">过关类型</td><td align="center">中奖注数</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr></thead>';
	var _url="";
	if($("#lotid").val()==30){
		_url="/cpdata/guoguan/bjdc/" + expect + "/bjfs_"+pn+".json?r="+Math.random();
	}else{
		_url="/cpdata/guoguan/" + lotid + "/" + expect + "/bjfs_"+pn+".json?r="+Math.random();
	}
	Y.ajax({
		url : _url,
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var j=0;
			if(tr==0){
				html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center">该玩法无方案存在</p></td></tr>';
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
						var mnums = rt.mnums;//场数
						var gnames = rt.gnames;
						var hid = rt.hid;	
						lotid=hid.substring(2,4);
						info=info.split("|");
						var zhushu = info[0];//中奖注数
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
						html+=isdg?'<td align="right">***</td>':'<td align="right"><a class="a1" href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">'+betnum+'</a></td>';
								
						html+='<td align="center">'+mnums+'</td>';			
						var gstr="";
						if(gnames.split(",").length>1){
							gstr=gnames.split(",")[0].replaceAll("\\*","串")+","+gnames.split(",")[1].replaceAll("\\*","串");
							if(gnames.split(",").length>2){gstr=gstr+"..";}
						}else{
							gstr=gnames.replaceAll("\\*","串");
						}
						html+='<td align="center" title="'+gnames.replaceAll("\\*","串").replaceAll("^1串1|,1串1","单关")+'">'+gstr.replaceAll("^1串1|,1串1","单关")+'</td>';

						if(zhushu>0){
							html+='<td align="center"><em>'+zhushu+'</em></td>';
						}else{
							html+='<td align="center">'+zhushu+'</td>';
						}

						html+=' <td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):(parseFloat(bonus).rmb(false)))+'</td><td align="center">';
						html+=isdg?'--</td><td align="center">--':'<a class="a1" href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td><td align="center"><a class="n_gz" href="javascript:void(0);" onclick="$_sys.autobuy(\''+lotid+'\',\''+uid+'\')" >定制</a>';
						html+='</td></tr>';	
						
						
					});
			}
			html +='<tr><td style="height:auto ;border-bottom:none"></td></tr>'
			$('#showlist').html(html);		
			showpageno($("#lotid").val(), expect ,pn,ps,tp,tr);	
			
		},
		error : function() {
			var html=tophtml;
			html+='<tr><td colspan="11"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center">该玩法无方案存在</p></td></tr>';
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