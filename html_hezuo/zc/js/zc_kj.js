/**
 * 开奖公告
 */
$_sys.grade_def = [];
$_sys.grade_def.push([ 80, "一等奖,二等奖" ]);
$_sys.grade_def.push([ 81, "一等奖" ]);
$_sys.grade_def.push([ 82, "一等奖" ]);
$_sys.grade_def.push([ 83, "一等奖" ]);

$_sys.grade_def.push([ 01, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 03, "直选,组三,组六" ]);
$_sys.grade_def.push([ 04, "五星奖,三星奖,二星奖,一星奖,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖" ]);
$_sys.grade_def.push([ 07, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖" ]);

$_sys.grade_def.push([ 50, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖,,宝钻一等奖,宝钻二等奖,宝钻三等奖,宝钻四等奖" ]);
$_sys.grade_def.push([ 51, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 52, "一等奖" ]);
$_sys.grade_def.push([ 53, "直选,组三,组六" ]);
$_sys.grade_def.push([ 54, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 55, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 56, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);

$_sys.zst_def = [];
$_sys.zst_def.push([ 01, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 03, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 07, "http://zst.gucheng.159cai.com/" ]);

$_sys.zst_def.push([ 50, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 51, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 52, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 53, "http://zst.gucheng.159cai.com/" ]);

var ename = "";

$_sys.getgrade = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	}
	;
	for ( var i = 0; i < $_sys.grade_def.length; i++) {
		if ($_sys.grade_def[i][0] == f) {
			return $_sys.grade_def[i][n].split(",");
		}
	}
};
$_sys.getzst = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	}
	;
	for ( var i = 0; i < $_sys.zst_def.length; i++) {
		if ($_sys.zst_def[i][0] == f) {
			return $_sys.zst_def[i][n];
		}
	}
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

$(function() {
	
	var lotid =location.search.getParam('lotid');
	
	

	if(lotid==81){
//	$("#kj_logo").html('<span class="r9-logo"></span>');
//	$("#kj_name").html('任九');
	lotid ='80';
	}
	if (lotid == "") {
		
		lotid = '80';
	}
	
	var listsize = 7;
	switch (lotid) {
	case "80":
		$("#kjtime").html("[不定期开奖]");
		break;
	case "81":
		$("#kjtime").html("[不定期开奖]");
		break;
	case "82":
		$("#kjtime").html("[不定期开奖]");
		break;
	case "83":
		$("#kjtime").html("[不定期开奖]");
		break;
	
	default:
		$_sys.showerr('对不起，该期暂未开售或者已经过期!');
		break;
	}


	if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
//		showkpinfo(lotid, expect, listsize);
		$_sys.showerr('对不起，该期暂未开售或者已经过期!');
	} else {
		
		showinfo(lotid, listsize);
	}
	




});

var showmore=function(){
 	
		if($("#jijiangshuoming h2 a").text()=="展开"){
			$("#jijiangshuoming h2 a").removeClass("cur").text("收起");
			$("#jijiangshuoming table").show();
		}else{
			$("#jijiangshuoming h2 a").addClass("cur").text("展开");
			$("#jijiangshuoming table").hide();
		}
	
}



var showinfo = function(lotid, listsize) {
	Y.ajax({
		url : "/cpdata/guoguan/"+lotid+"/index.json",
		type : "GET",
		dataType : "json",
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			    var r = obj.rows.row;
				var expectlist = [];
				r.each(function(rt,o) {
					var pid = rt.pid;
					var st = Y.getInt(rt.st);
					
						
						expectlist[expectlist.length] = [ pid];
				});
				var html1 = "";
				var html2 = "";
				for ( var i = 0; i < expectlist.length; i++) {
//					if(i<listsize){
//						html1 += "<option>第"+ expectlist[i][0]+"期</option>";
//					}else{
						html2 += "<option>第"+ expectlist[i][0]+"期</option>";
//					}
				}
				
				var expect=""
				$("#elist1").html(html2);
//				$("#elist2").html(html2);
				if (expect == "") {
					expect = expectlist[0]+"期";
				}
				 
				 
			    $("#elist1").bind("change", function() {  
					var e = $(this).html();
					var checkText=$("#elist1").find("option:selected").text();
					
					checkText = checkText.replace(/[期|第]/g, "");
					elist(checkText);
					
					if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
						loadkpmain(lotid, checkText);
					} else {
						$("#qihao").html(checkText);
						
						loadmain(lotid, checkText);
					} 
			    }); 
				
				loadmain(lotid, expect);
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
};



var elist = function(expect) {
	expect = expect+"期";
    $("#expect_list .el").each(function(){
    	var e = $(this).html();
    	if(e==expect){
    		$(this).removeClass("a1").addClass("a1");
    		$(this).parent().removeClass("cm_cur").addClass("cm_cur");
    	}else{
    		$(this).removeClass("a1");
    		$(this).parent().removeClass("cm_cur");
    	}
	});
};

var getelist = function() {
	var e= "";
    $("#expect_list .el").each(function(){
    	if($(this).parent().hasClass("cm_cur")){
    		e = $(this).html();
    	}
	});
    return e;
};

var loadmain = function(lotid, expect) {
	expect = expect.replace("期", "");
	elist(expect);
	$("#qihao").html(expect);
	var ss='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次！</span>';
	$('#zcdz').html("");
	$("#ckxxdz").html("");
	$('#kj_info').html("");
	
	$("#kj_dengji").html("");
	$('#kj_mess').html("");
	
	
	$('#kj_qihao').html("<b>"+expect+"</b>");
	
	
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/"+ expect +"/"+ expect + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var rs = obj.rows;
			var gid = rs.gid;
			var pid = rs.pid;
			var code = rs.code;// 开奖号码
			var gsale = rs.gsale;// 全国销售
			var ginfo = rs.ginfo+"";// 开奖公告
			var ninfo = rs.ninfo+"";// 中奖注数
			var gpool = rs.gpool+"";// 奖池
			var etime = rs.etime;// 兑奖截止时间
			var atime = rs.atime;// //开奖时间			

			if ( gpool == "" ) {
				gpool = "0";
			}
			if ( gsale == "" ) {
				gsale = "0";
			}
			
			if (gid == lotid && pid == expect) {
				
				var r = obj.rows.row;
				if (lotid == "80" || lotid == "81" || lotid == "82" || lotid == "83") {
					var ets = Y.getDate(atime);
					var d_e = new Date(ets);
					var d_s = d_e.dateadd("d", +60);
					etime = d_s.format("YY-M-D");
					var ml = [];
					r.each(function(m,o) {
						var id = m.id;
						var hn = m.hn;
						hn= lotid=="83"?hn.substr(3):hn;
						var vn = m.vn+"";
						var hs = m.hs+"";
						var vs = m.vs+"";
						var hhs = m.hhs+"";
						var hvs = m.hvs+"";
						var result = m.result+"";
						ml[ml.length] = [ id, hn, vn, hs, vs, hhs, hvs, result ];
					});
					var htmll="";
					
					if (lotid == '80'){//sfc rxjc
						
						var r9pool="";
						var r9sale="";
						var r9info="";
						var r9ninfo="";
						Y.ajax({
							url : "/cpdata/guoguan/81/"+ expect +"/"+ expect + ".json",
							type : "GET",
							dataType : "json",
							cache : false,
							end  : function (d){
								var obj = eval("(" + d.text + ")");
								var rs = obj.rows;
								var gid = rs.gid;
								var pid = rs.pid;
								var code = rs.code;// 开奖号码
								r9sale = rs.gsale;// 全国销售
								r9info = rs.ginfo+"";// 开奖公告
								r9ninfo = rs.ninfo+"";// 中奖注数
								r9pool = rs.gpool+"";// 奖池
								var etime = rs.etime;// 兑奖截止时间
								var atime = rs.atime;// //开奖时间			

								if ( r9pool == "" ) {
									r9pool = "0";
								}
								if ( r9sale == "" ) {
									r9sale = "0";
								}
								
						
						
						var r9gname = $_sys.getgrade("81");
						var r9aginfo = r9info.split(",");
						var r9aninfo = r9ninfo.split(",");
						htmll ="<h4>对阵详情</h4>";

						htmll +="<table width='99%' border='0' cellspacing='0' cellpadding='0'> <colgroup>";
						for ( var i = 0; i < ml.length; i++) {
							htmll +="<col width='38'>";
						}
					      
					     
						htmll +="</colgroup>  <thead><tr><td>场次</td>";
						for ( var i = 0; i < ml.length; i++) {
							htmll +="<td>"+(i+1)+"</td>";
						}
					    
					  
						htmll +="</tr></thead> <tbody><tr> <td>主队</td>";
						for ( var i = 0; i < ml.length; i++) {
							htmll +="<td>"+ml[i][1]+"</td>";
						}
					   htmll +="</tr><tr class='bf'> <td>比分</td>";
					   for ( var i = 0; i < ml.length; i++) {
							htmll +=" <td>"+ml[i][3]+":"+ml[i][4]+"</td>";
						}
					   htmll +="</tr> <tr> <td>客队</td>";
					   for ( var i = 0; i < ml.length; i++) {
							htmll +=" <td>"+ml[i][2]+"</td>";
						}
					    
					   htmll +="</tr> <tr class='foot'> <td style='padding: 0; color: #444; font-weight: 100'>彩果</td>";
						for ( var i = 0; i < ml.length; i++) {
							if(ml[i][7]==""){htmll +="<td>*</td>";}else{
							htmll +="<td>"+ml[i][7]+"</td>";
							}
						}					  
					   
					   htmll +=" </tr></tbody></table>";
					
					    
					   var html = '';
						var ets = Y.getDate(atime);
						var d_e = new Date(ets);
						var d_s = d_e.dateadd("d", +60);
						etime = d_s.format("YY-M-D");

						
					
					var kjdengji="";
					var gname = $_sys.getgrade(lotid);
					var aginfo = ginfo.split(",");
					var aninfo = ninfo.split(",");
					
				
					kjdengji='<table width="100%" border="0" cellpadding="0" cellspacing="0"><colgroup> <col width="270" /><col width="200" /> <col /> </colgroup> <thead><tr> <td>奖项</td> <td>中奖注数(注)</td><td>每注奖金(元)</td> </tr>  </thead>';
				    for (var i=0;i<aginfo.length && i < gname.length;i++) {
			    	
			    	if(gname[i].length > 0){
			    		if(aninfo[i]==""&&aginfo[i]=="")
			    		{
			    			aninfo[i]="-";
				    		aginfo[i]="-";
			    			kjdengji += ' <tr><td>'+gname[i]+'</td><td>--</td><td>--</td></tr>';
			    			kjdengji += ' <tr><td>二等奖</td><td>--</td><td>--</td></tr>';
			    			
			    	
			    		}else{
			    			kjdengji += ' <tr><td>'+gname[i]+'</td><td>'+aninfo[i]+'</td><td>'+parseFloat(aginfo[i]).rmb(false, 0)+'</td></tr>';
			    			
			    		}
			    		}
				    }
				    
				    for (var i=0;i<r9aginfo.length && i < r9gname.length;i++) {
				    	if(r9aninfo[i]==""||r9gname[i]==""){
				    	
				    		kjdengji += ' <tr><td>任九</td><td>--</td><td>--</td></tr>';
				    	}else{
				    	kjdengji += ' <tr><td>任九</td><td>'+r9aninfo[i]+'</td><td>'+parseFloat(r9aginfo[i]).rmb(false, 0)+'</td></tr>';
				    	
				    	}
				    }
				    kjdengji += '</table>';
					if(r9aninfo[0]==""||aninfo[0]==""){
						html +="<ul><li>一等奖：<s>-</s>注  <font>-</font>元</li>";
						html +="<li>开奖时间："+atime.substr(0,10)+"</li>";
						html +="<li>二等奖：<s>-</s>注  <font>-</font>元</li>";
							
						html +="<li>兑奖截止：" + etime.substr(0,10)+"</li>";
						html +="<li>任九：<s>-</s>注  <font>-</font>元</li>";
						html +="<li >本期任九负销量：<font>"+ parseFloat(r9sale).rmb(false, 0) +"</font>元</li>";	
						html +="<li style='clear:both'>足彩胜负奖池滚存：<font>"+  parseFloat(gpool).rmb(false, 0) +"</font>元</li>";
						html +="<li style='clear:both'>本期足彩胜负销量：<font>"+ parseFloat(gsale).rmb(false, 0) +"元</li></ul>";	
					}else{
					    html +="<ul><li>一等奖：<s>"+aninfo[0]+"</s>注  <font>"+parseFloat(aginfo[0]).rmb(false, 0)+"</font>元</li>";
					    html +="<li>开奖时间："+atime.substr(0,10)+"</li>";
						html +="<li>二等奖：<s>"+aninfo[1]+"</s>注  <font>"+parseFloat(aginfo[1]).rmb(false, 0)+"</font>元</li>";
					
						html +="<li>兑奖截止：" + etime.substr(0,10)+"</li>";
						html +="<li>任九：<s>"+r9aninfo[0]+"</s>注  <font>"+parseFloat(r9aginfo[0]).rmb(false, 0)+"</font>元</li>";
						html +="<li >本期任九负销量：<font>"+ parseFloat(r9sale).rmb(false, 0) +"</font>元</li>";	
						html +="<li style='clear:both'>足彩胜负奖池滚存：<font>"+  parseFloat(gpool).rmb(false, 0) +"</font>元</li>";
						html +="<li style='clear:both'>本期足彩胜负销量：<font>"+ parseFloat(gsale).rmb(false, 0) +"元</li></ul>";	
										}
				    $('#kj_info').html(htmll);
				    $('#kj_mess').html(html);
				    $('#kj_dengji').html(kjdengji);
						},
						error : function() {
							
							
							var html='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次！</span>';
							$('#kj_info').html(html);
							return false;
						}

						});
					}else if(lotid =='82'){
						
						$("#kj_logo").html('<span class="jq-logo"></span>');
						$("#kj_name").html('进球彩');
						htmll ='<h4>对阵详情</h4>';
					     
						htmll +='<table border="0" cellspacing="0" cellpadding="0" class="tcb"><tbody>';
					   
						htmll +='<tr class="bf"><td>场次</td>';
						for ( var i = 0; i < (ml.length)*2; i++) {
							htmll +="<td>"+(i+1)+"</td>";
						}
					   
						htmll += '</tr> <tr class="tgb"><td class="tgb">主队</td>';
						for ( var i = 0; i < ml.length; i++) {
						htmll += '<td colspan="2">'+ml[i][1]+'</td>';
						}
						htmll += '</tr><tr class="bf"><td>比分</td>';
						for ( var i = 0; i < ml.length; i++) {
							htmll +=" <td td colspan='2'>"+ml[i][3]+":"+ml[i][4]+"</td>";
		
						}
					    
				
					    
						htmll += '</tr><tr class="tgb"><td class="tgb">客队</td>';
						for ( var i = 0; i < ml.length; i++) {
							htmll += '<td colspan="2">'+ml[i][2]+'</td>';
							}
						
						htmll += '</tr><tr class="foot"><td style="padding: 0; color: #444; font-weight: 100">彩果</td>';
						for ( var i = 0; i < ml.length; i++) {
							if(ml[i][7].split(",")[0]==""||ml[i][7].split(",")[1]=="")
							{htmll += '<td >*</td><td >*</td>';}
							else{
								htmll += '<td >'+ml[i][7].split(",")[0]+'</td><td >'+ml[i][7].split(",")[1]+'</td>';
							}
						}						
					   
						htmll +=' </tr></tbody></table>';

						 var html = '';
							var ets = Y.getDate(atime);
							var d_e = new Date(ets);
							var d_s = d_e.dateadd("d", +60);
							etime = d_s.format("YY-M-D");
							html +="<ul>";
							//html +="<li>一等奖：<s>"+aninfo[0]+"</s>注  <font>"+parseFloat(aginfo[0]).rmb(false, 0)+"</font>元</li>";
							html +="<li>开奖时间：";
							html +=atime.substr(0,10)+"</li>";
							html +="<li>兑奖截止：" + etime.substr(0,10)+"</li>";
							html +="<li>奖池滚存：：<font>"+  parseFloat(gpool).rmb(false, 0) +"</font>元</li>";
							html +="<li>进球彩销量：<font>"+ parseFloat(gsale).rmb(false, 0) +"</font>元</li>";
						
							//var kjdengji="";
							var gname = $_sys.getgrade(lotid);
							var aginfo = ginfo.split(",");
							var aninfo = ninfo.split(",");
							//kjdengji='<table width="100%" border="0" cellpadding="0" cellspacing="0"><colgroup> <col width="270" /><col width="200" /> <col /> </colgroup> <thead><tr> <td>奖项</td> <td>中奖注数(注)</td><td>每注奖金(元)</td> </tr>  </thead>';
						    for (var i=0;i<aginfo.length && i < gname.length;i++) {
					    	if(gname[i].length > 0){
					    		if(aninfo[i]==""&&aginfo[i]=="")
					    		{
					    			//kjdengji += ' <tr><td>'+gname[i]+'</td><td>--</td><td>--</td></tr>';
					    			//kjdengji += ' <tr><td>二等奖</td><td>--</td><td>--</td></tr>';
					    			html +="<li>一等奖：<s>-</s>注  <font>-</font>元</li>";
					    		}else{
					    			//kjdengji += ' <tr><td>'+gname[i]+'</td><td>'+aninfo[i]+'</td><td>'+parseFloat(aginfo[i]).rmb(false, 0)+'</td></tr>';
					    			html +="<li>一等奖：<s>"+aninfo[i]+"</s>注  <font>"+parseFloat(aginfo[i]).rmb(false, 0)+"</font>元</li>";
					    		}
					    		}
						    }
						  
						   //kjdengji += '</table>';
						  var shuoming="<h2><span>奖金计算说明</span><a href='javascript:void(0);' onclick='showmore();'>展开</a></h2><table width='100%' border='0' cellpadding='0' cellspacing='0'style='display:none'><colgroup><col width='160'><col width='250'>";
						  shuoming +=   "<col> </colgroup><thead><tr> <td>奖等</td> <td>中奖条件</td><td>单注奖金</td> </tr></thead><tbody><tr> <td style='text-align:center'>一等奖</td>";
						  shuoming += "<td>4场比赛8支球队全场进球数全中</td><td>奖金总额的100%与奖池奖金之和除以中奖注数。</td></tr></tbody></table>";
						  $('#jijiangshuoming').html(shuoming);
					}else if(lotid =='83'){
						
						$("#kj_logo").html('<span class="bq-logo"></span>');
						$("#kj_name").html('半全场');
						htmll='<span class="kj_dzxq kj_dzxq_bq"><h4>对阵详情</h4><table border="0" cellspacing="0" cellpadding="0" class="tcb"><tbody>';
						
						htmll += '<tr class="t_rd" rowspan="2"><td>半/全</td>';
						for ( var i = 0; i < ml.length; i++) {
							if((i+1)%2==0){htmll += '<td>全</td>';}else{
								htmll += '<td>半</td>';
							}
						}
					   
						htmll += '</tr><tr class="bf"><td>场次</td>'
							for ( var i = 0; i < (ml.length)/2; i++) {
								
								htmll += '<td colspan="2">'+(i+1)+'</td>';
							}
						htmll += '</tr> <tr class="tga"> <td>主队</td>';
						var s=0;
						for ( var i=0;i<6;i++) {
						
								htmll += '<td colspan="2">'+ml[i*2][1]+'</td>';}
						
					   
						htmll += '</tr> <tr class="bf"> <td>比分</td>';
						for ( var i = 0; i < ml.length; i++) {
							if(i%2==0){
								if(new String(ml[i][5]).length == 0 && new String(ml[i][6]).length == 0 ){
									htmll+="<td>-</td>";
								}else{
								htmll +=" <td>"+ml[i][5]+":"+ml[i][6]+"</td>";
								}
							}else{
								if(new String(ml[i][3]).length == 0 && new String(ml[i][4]).length == 0 ){
									htmll+="<td>-</td>";
								}else{
								htmll +=" <td>"+ml[i][3]+":"+ml[i][4]+"</td>";
								}
							}
						}
					    
					    
						htmll +='</tr><tr class="tga"><td>客队</td>';
						for (  var i=0;i<6;i++) {
							
							htmll += '<td colspan="2">'+ml[i*2][2]+'</td>';
							
						}
						
						htmll +='</tr><tr class="foot"><td style="padding: 0; color: #444; font-weight: 100">彩果</td>';
						for ( var i = 0; i < ml.length; i++) {
							if(ml[i][7]=="")
							{htmll += '<td>*</td>';}
							else{
								htmll += '<td>'+ml[i][7]+'</td>';
							}
						}						
						
						htmll +=' </tr></tbody></table> </span>';
						
						var html = '';
						var ets = Y.getDate(atime);
						var d_e = new Date(ets);
						var d_s = d_e.dateadd("d", +60);
						etime = d_s.format("YY-M-D");
						html +="<ul>";
						html +="<li>开奖时间：";
						html +=atime.substr(0,10)+"</li>";
						html +="<li>兑奖截止：" + etime.substr(0,10)+"</li>";
						html +="<li>奖池滚存：：<font>"+  parseFloat(gpool).rmb(false, 0) +"</font>元</li>";
						html +="<li>半全场销量：<font>"+ parseFloat(gsale).rmb(false, 0) +"</font>元</li>";
					
						//var kjdengji="";
						var gname = $_sys.getgrade(lotid);
						var aginfo = ginfo.split(",");
						var aninfo = ninfo.split(",");
						//kjdengji='<table width="100%" border="0" cellpadding="0" cellspacing="0"><colgroup> <col width="270" /><col width="200" /> <col /> </colgroup> <thead><tr> <td>奖项</td> <td>中奖注数(注)</td><td>每注奖金(元)</td> </tr>  </thead>';
					    for (var i=0;i<aginfo.length && i < gname.length;i++) {
				    	
				    	if(gname[i].length > 0){
				    		if(aninfo[i]==""&&aginfo[i]=="")
				    		{
				    			//kjdengji += ' <tr><td>'+gname[i]+'</td><td>--</td><td>--</td></tr>';
				    			//kjdengji += ' <tr><td>二等奖</td><td>--</td><td>--</td></tr>';
				    			html +="<li>一等奖：<s>-</s>注  <font>-</font>元</li>";
				    	
				    		}else{
				    			//kjdengji += ' <tr><td>'+gname[i]+'</td><td>'+aninfo[i]+'</td><td>'+parseFloat(aginfo[i]).rmb(false, 0)+'</td></tr>';
				    			html +="<li>一等奖：<s>"+aninfo[i]+"</s>注  <font>"+parseFloat(aginfo[i]).rmb(false, 0)+"</font>元</li>";
				    		}
				    		}
					    }
					    
					  
					    //kjdengji += '</table>';
					    //kjdengji += '</table>';
						  var shuoming="<h2><span>奖金计算说明</span><a href='javascript:void(0);' onclick='showmore();'>展开</a></h2><table width='100%' border='0' cellpadding='0' cellspacing='0'style='display:none'><colgroup><col width='160'><col width='250'>";
						  shuoming +=   "<col> </colgroup><thead><tr> <td>奖等</td> <td>中奖条件</td><td>单注奖金</td> </tr></thead><tbody><tr> <td style='text-align:center'>一等奖</td>";
						  shuoming += "<td>6场比赛上半场和全场胜平负结果全中</td><td>奖金总额的100%与奖池奖金之和除以中奖注数。</td></tr></tbody></table>";
						  $('#jijiangshuoming').html(shuoming);
					}
				    
				    $('#kj_info').html(htmll);
				    $('#kj_mess').html(html);
				    $('#kj_dengji').html(kjdengji);
				    if(lotid=="80"||lotid=="81"){
				    	$("title").text("胜负彩(任九)"+expect+"期开奖结果-胜负彩(任九)开奖公告-全国彩票开奖- 159彩票网");
						$("meta[name='keywords']").attr("content","胜负彩(任九)"+expect+"，胜负彩(任九)"+expect+"期，胜负彩(任九)"+expect+"开奖结果，胜负彩(任九)"+expect+"期");
						$("meta[name='description']").attr("content","159彩票网胜负彩(任九)开奖频道为您提供胜负彩(任九)"+expect+"，胜负彩(任九)"+expect+"期，胜负彩(任九)"+expect+"期，胜负彩(任九)"+expect+"开奖结果")
				    }else if(lotid=="82"){
				    	$("title").text("进球彩"+expect+"期开奖结果-六场半全场开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","进球彩"+expect+"，进球彩"+expect+"期，进球彩"+expect+"开奖结果，进球彩"+expect+"期");
						$("meta[name='description']").attr("content","159彩票网进球彩开奖频道为您提供进球彩"+expect+"，进球彩"+expect+"期，进球彩"+expect+"期，进球彩"+expect+"开奖结果")
				    }else if(lotid=="83"){
				    	$("title").text("半全场"+expect+"期开奖结果-半全场开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","半全场"+expect+"半全场"+expect+"期，半全场"+expect+"开奖结果，半全场"+expect+"期");
						$("meta[name='description']").attr("content","159彩票网半全场开奖频道为您提供半全场"+expect+"，半全场"+expect+"期，半全场"+expect+"期，半全场"+expect+"开奖结果")
				    }

				  
				   
				  
				}else{
					alert(12);
					szckj(lotid,expect,code,gsale,ginfo,ninfo,gpool,etime,atime,ename);					
				}
				
			} else {
				alert(desc);
			}
		},
		error : function() {
			
			alert("12");
			var html='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次！</span>';
			$('#kj_info').html(html);
			return false;
		}
	});

};





