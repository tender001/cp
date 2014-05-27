$_sys.win_level = [];
$_sys.win_level.push([ 01, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.win_level.push([ 03, "直选,组选三,组选六" ]);
$_sys.win_level.push([ 04, "五星奖,三星奖,二星奖,一星奖,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖" ]);
$_sys.win_level.push([ 05, "和值,三同号通选,三同号单选,三不同号,三连号通选,二同号复选,二同号单选,二不同号" ]);
$_sys.win_level.push([ 07, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖" ]);
$_sys.win_level.push([ 20, "五星奖,四星一等奖,四星二等奖,三星奖,二星奖,一星奖,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖,任选一,任选二,三星组三,三星组六" ]);

$_sys.win_level.push([ 50, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖,,宝钻一等奖,宝钻二等奖,宝钻三等奖,宝钻四等奖"]);
$_sys.win_level.push([500, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖,,宝钻一等奖,宝钻二等奖,宝钻三等奖,宝钻四等奖" ]);
$_sys.win_level.push([ 51, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.win_level.push([ 52, "一等奖" ]);
$_sys.win_level.push([ 53, "直选,组三,组六" ]);
$_sys.win_level.push([ 54, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.win_level.push([ 55, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.win_level.push([ 56, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
//奖项说明20140224
$_sys.grade_def2 = [];
$_sys.grade_def2.push([01,'<font color="red">6</font>+<font color="blue">1</font>,' +
		'<font color="red">6</font>+<font color="blue">0</font>,' +
		'<font color="red">5</font>+<font color="blue">1</font>,' +
		'<font color="red">5</font>+<font color="blue">0</font>/<font color="red">4</font>+<font color="blue">1</font>,' +
		'<font color="red">4</font>+<font color="blue">0</font>/<font color="red">3</font>+<font color="blue">1</font>,' +
		'<font color="red">2</font>+<font color="blue">1</font>/<font color="red">1</font>+<font color="blue">1</font>/<font color="red">0</font>+<font color="blue">1</font>']);
$_sys.grade_def2.push([50,'<font color="red">5</font>+<font color="blue">2</font>,'+
                       '<font color="red">5</font>+<font color="blue">1</font>,'+
                       '<font color="red">5</font>+<font color="blue">0</font>/<font color="red">4</font>+<font color="blue">2</font>,'+
                       '<font color="red">4</font>+<font color="blue">1</font>/<font color="red">3</font>+<font color="blue">2</font>,'+
                       '<font color="red">4</font>+<font color="blue">0</font>/<font color="red">3</font>+<font color="blue">1</font>/<font color="red">2</font>+<font color="blue">2</font>,'+
                       '<font color="red">3</font>+<font color="blue">0</font>/<font color="red">2</font>+<font color="blue">1</font>/<font color="red">1</font>+<font color="blue">2</font>/<font color="red">0</font>+<font color="blue">2</font>']);
$_sys.grade_def2.push([500,'<font color="red">5</font>+<font color="blue">2</font>,'+
                       '<font color="red">5</font>+<font color="blue">1</font>,'+
                       '<font color="red">5</font>+<font color="blue">0</font>,'+
                       '<font color="red">4</font>+<font color="blue">2</font>,'+
                       '<font color="red">4</font>+<font color="blue">1</font>,'+
                       '<font color="red">4</font>+<font color="blue">0</font>/<font color="red">3</font>+<font color="blue">2</font>,'+
                       '<font color="red">3</font>+<font color="blue">1</font>/<font color="red">2</font>+<font color="blue">2</font>,'+
                       '<font color="red">3</font>+<font color="blue">0</font>/<font color="red">2</font>+<font color="blue">1</font>/<font color="red">1</font>+<font color="blue">2</font>/<font color="red">0</font>+<font color="blue">2</font>']);

Class({
	ready: true,
    index:function (config){
    	Class.C('lot_id',$("#lotid").val());
    	Y.lib.LoadHisOpenCode();
    }	
});
$(function() {
	var lotid = $("#lotid").val();	
	var expect = location.search.getParam('expect');
	if (lotid == "") {
		lotid = "01";
	}
	$(".nngg_a a").each(function(o,rt){
		if($(rt).attr("mark") == $("#lotid").val()){
			$(rt).addClass("cur").siblings().removeClass("cur");
		}
	});
	$("#showtr").click(function(){
		
		$(this).toggleClass("cur");
		$("tr[mark=showtr]").toggle();
		if($(this).hasClass("cur")){
			$(this).html("展开");
		}else{
			$(this).html("收缩");
		}
	});
	$("#hidetr").click(function(){
		$("tr[mark=showtr]").hide();
	});
	if(lotid==01){
	tophtml=' <colgroup><col width="62"><col width="110"><col width="97"><col width="90"><col width="65"><col width="62"><col width="62"><col width="62"><col width="62"><col width="62"><col width="62"><col width="100"><col width="80"></colgroup>';
	tophtml += '<thead><tr class="tr1"><td align="center">排序</td><td>发起人</td> <td align="center">战绩</td><td align="right">方案金额</td><td align="center">一等奖</td><td align="center">二等奖</td><td align="center">三等奖</td><td align="center">四等奖</td><td align="center">五等奖</td><td align="center">六等奖</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td> </tr> </thead>';
	
//								tophtml +='<td>排序</td><td>发起人</td><td>战绩</td><td>方案金额</td><td>一等奖</td><td>二等奖</td><td>三等奖</td><td>四等奖</td><td>五等奖</td><td>六等奖</td><td>税前奖金</td><td>详情</td><td>定制跟单</td></tr>';
	}else if(lotid==03){
	tophtml='<colgroup><col width="90" /><col width="110" /><col width="97" /><col width="100" /><col width="110" /><col width="100" /><col width="100" /><col width="100" /><col width="100" /><col width="100" /><tr class="tr1">';

	tophtml +='<td align="center">排序</td><td>发起人</td align="center"><td>战绩</td><td align="right">方案金额</td><td align="center">直选</td><td align="center">组三</td><td align="center">组六</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	
	}else if(lotid==07){
	tophtml='<colgroup><col width="60" /><col width="110" /><col width="97" /><col width="90" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="80" /><col width="80" /><tr class="tr1">';
	
	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">一等奖</td><td align="center">二等奖</td><td align="center">三等奖</td><td align="center">四等奖</td><td align="center">五等奖</td><td align="center">六等奖</td><td align="center">七等奖</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	
	}else if(lotid==50){
	tophtml='<colgroup><col width="40" /><col width="110" /><col width="97" /><col width="55" /><col width="55" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col width="80" /><col  /><tr class="tr1">';
	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">一等奖</td><td align="center">二等奖</td><td align="center">三等奖</td><td align="center">四等奖</td><td align="center">五等奖</td><td align="center">六等奖</td><td align="center">七等奖</td><td align="center">八等奖</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	
	}else if(lotid==51){
	tophtml='<colgroup><col width="60" /><col width="110" /><col width="97" /><col width="90" /><col width="70" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="65" /><col width="80" /><col width="80" /><col width="100" /><tr class="tr1">';

	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">一等奖</td><td align="center">二等奖</td><td align="center">三等奖</td><td align="center">四等奖</td><td align="center">五等奖</td><td align="center">六等奖</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td><tr class="tr1">';
	
	}else if(lotid==52){
	tophtml='<colgroup><col width="120" /><col width="125" /><col width="97" /><col width="120" /><col width="150" /><col width="110" /><col width="130" /><col width="130" /><tr class="tr1">';
	
	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">一等奖</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	
	}else if(lotid==53){
	tophtml='<colgroup><col width="90" /><col width="110" /><col width="97" /><col width="100" /><col width="100" /><col width="110" /><col width="100" /><col width="100" /><col width="100" /><col width="100" /><tr class="tr1">';
	
	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td align="center">直选</td><td align="center">组三</td><td align="center">组六</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	
	}else{
	tophtml='<colgroup><col width="60" /><col width="110" /><col width="135" /><col width="100" /><col width="300" /><col width="60" /><col width="60" /><col width="60" /><tr class="tr1">';
	tophtml +='<td align="center">排序</td><td >发起人</td><td align="center">战绩</td><td align="right">方案金额</td><td class="x_jc">中奖情况</td><td align="right">税前奖金</td><td align="center">详情</td><td align="center">定制跟单</td></tr>';
	}
	showinfo(lotid,expect);

	$("#expect").bind({
		change : function() {
			$("#kjdetail").attr("href",kjdetailUrl($("#lotid").val(), $("#expect").val()));
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

var getLevel = function(lotid){
	for(var i = 0; i < $_sys.win_level.length; i++){
		if(lotid ==$_sys.win_level[i][0]){
			return $_sys.win_level[i][1].split(",");
		}
	}
}
var getLevelms = function(lotid){
	for(var i = 0; i < $_sys.grade_def2.length; i++){
		if(lotid ==$_sys.grade_def2[i][0]){
			return $_sys.grade_def2[i][1].split(",");
		}
	}
}
var getWinLevel = function(lotid, winfo){
	if(winfo.length > 0){
		for(var i = 0; i < $_sys.win_level.length; i++){
			if(lotid == $_sys.win_level[i][0]){
				var ws = winfo.split(",");
				var lvls = $_sys.win_level[i][1].split(",");
				var html = new Array();
				if(lotid != '50'){
					for(var j = 0; j < ws.length; j++){
						if(ws[j].length > 0 && parseInt(ws[j]) > 0){
							html.push(lvls[j] + "<font>"+ws[j]+"</font>"+ "注");
						}
					}
				} else {
					for(var j = 0; j < ws.length && j < lvls.length; j++){
						if(j < 8){
							if(ws[j].length > 0 && parseInt(ws[j]) > 0){
								var linfo = lvls[j] + "<font>"+ws[j]+"</font>"+ "注";
								if(ws[j+9].length > 0 && parseInt(ws[j+9]) > 0){
									linfo += "(追加)";
								}
								html.push(linfo);
							}
						} else if (j ==8 || j > 17) {
							if(ws[j].length > 0 && parseInt(ws[j]) > 0){
								html.push(lvls[j] + "<font>"+ws[j]+"</font>"+ "注");
							}
						}
					}
				}
				return html.join(",");
			}
		}
	}
	return "未中奖";
};

var myguoguan = function(lotid,expect,pn,ps,tp,tr){
	
	tp=0;
	var data = $_user.key.gid+"=" + lotid + "&"+$_user.key.tid+"=" + expect; 
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
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
				$("#seltype2").addClass("cur").siblings().removeClass("cur");	
				var j=0;
				if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						j=j+1;
						var uid = rt.nickid;
						var ag = rt.ag;
						var au = rt.au;
						var info = rt.info;
						var bonus = rt.bonus;
						var betnum = rt.betnum;
						var hid = rt.hid;	
						var ws = info.split(",")
							var cl=o%2==0?"":"odd";
						html+='<tr class='+cl+'><td align="center">'+((pn*1-1)*ps+j)+'</td><td >';
						html+='<a href="javascript:void(0);" class="a1" onclick="Y.openUrl(\'/game/zhanji.html?lotid='+lotid+'&uid='+uid+'&func=award\',806,600)" >'+uid+'</a>';
										
						html+='</td>'+'<td align="center">';
						html+=($_sys.showzhanji(au,ag)==''?'&nbsp;':$_sys.showzhanjii(lotid,uid,au,ag));
						html+='</td>';
						html+='<td align="right"><a class="a1" href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">'+betnum+'</a></td>';
						if(info !=""){
						if(ws.length>9)ws.length=8;
						for(var i=0;i<ws.length;i++){
						html+='<td align="center">'+(parseInt(ws[i])>0?('<em>'+ws[i]+'</em>'):ws[i])+'</td>';
						}
						}else{
						if(lotid==01){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==03){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==07){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==50){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==51){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==52){
						html+='<td align="center">0</td>';
						}else if(lotid==53){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else{
						html+='<td align="center">--</td>';
						}
						}
						
						
						

						html+=' <td <td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):(parseFloat(bonus).rmb(false)))+'</td><td align="center">';
						html+='<a  href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td><td align="center">--</td></tr>';			
					});
						html +='<tr><td style="height:auto ;border-bottom:none"></td></tr>'
						
						$('#showlist').html(html);		
						showpageno(lotid, expect ,pn,ps,tp,tr);		
			} else {
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						myguoguan(lotid,expect,pn,ps,tp,tr);		
					});
				}else{
					var html=tophtml;
					html+='<tr><td colspan="9"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">本期无购买记录</p></td></tr>';
					$('#showlist').html(html);
					 $('#pagediv').html("");	
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
	var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+tr+'条</li><li class="disabled PagedList-skipToFirst"  onclick="myguoguan(\''+lotid+'\', \''+expect+'\',1,'+ps+','+tp+','+ tr+');"><a>首页</a></li>';
	pagehtml += '<li class="PagedList-skipToNext"><a  onclick="myguoguan(\''+lotid+'\', \''+expect+'\','+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+ tr+');" href="javascript:void(0)">上一页</a></li>';
	pagehtml+='<li class="PagedList-skipToNext"><a onclick="myguoguan(\''+lotid+'\', \''+expect+'\','+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+ tr+');"  href="javascript:void(0)">下一页</a></li>';
	pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="loadpage(\''+lotid+'\', \''+expect+'\','+tp+','+ps+','+tp+','+ tr+');" href="javascript:void(0)"> 末页</a></li><ul>';
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
			
			$("#kjdetail").attr("href", kjdetailUrl(lotid, expect));
			$("#kjdetail2").attr("href", kjdetailUrl(lotid, expect));
			loadmain(lotid, expect,type);
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
};
var kjdetailUrl = function(lotid, expect){

	return "http://www.159cai.com" + $_sys.getlotdir(lotid) + "kaijiang.html?expect=" + expect;
	

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
			$("#ps").val(rs.as.ps);
			$("#tp").val(rs.as.tp);
			$("#tr").val(rs.as.total);
			var ninfo = new String(rs.ninfo).split(",");
			var ginfo = new String(rs.ginfo).split(",");
			if(lotid=="01"){
				var html=""
				for(var i=0;i<ninfo.length;i++){
					 html +='<tr><td>'+getLevel(lotid)[i]+'</td><td>'+getLevelms(lotid)[i]+'</td><td>'+ninfo[i]+'</td><td><em>'+ginfo[i]+'</em></td></tr>';
				}
				$("#kaijianginfo").html(html);
			}
			if(lotid=="50"){
				var kjdengji=""
					if(ninfo.length<3){
						ninfo=["-","-","-","-","-","-","-","-","-","-","-","-","-"];
						ginfo=["-","-","-",200,10,5,"-","-","-","-",100,5]
					}
					var gname=[];
    			var gname2=[];
					if(expect>2014051){
		    			 gname=getLevel("50");
		    			 gname2=getLevelms("50");
						kjdengji += ' <tr><td rowspan="2">'+gname[0]+'</td><td rowspan="2">'+gname2[0]+'</td><td>基本</td><td>'+ninfo[0]+'</td><td>'+(ginfo[0]=="-"?"-":parseFloat(ginfo[0]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr><td>追加</td><td>'+ninfo[7]+'</td><td>'+(ginfo[7]=="-"?"-":parseFloat(ginfo[7]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr><td rowspan="2">'+gname[1]+'</td><td rowspan="2">'+gname2[1]+'</td><td>基本</td><td>'+ninfo[1]+'</td><td>'+(ginfo[1]=="-"?"-":parseFloat(ginfo[1]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr><td>追加</td><td>'+ninfo[8]+'</td><td>'+(ginfo[8]=="-"?"-":parseFloat(ginfo[8]).rmb(false, 0))+'</td></tr>';			    			
		    			kjdengji += ' <tr><td rowspan="2">'+gname[2]+'</td><td rowspan="2">'+gname2[2]+'</td><td>基本</td><td>'+ninfo[2]+'</td><td>'+(ginfo[2]=="-"?"-":parseFloat(ginfo[2]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[9]+'</td><td>'+(ginfo[9]=="-"?"-":parseFloat(ginfo[9]).rmb(false, 0))+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[3]+'</td><td rowspan="2">'+gname2[3]+'</td><td>基本</td><td>'+ninfo[3]+'</td><td>'+(ginfo[3]=="-"?"-":parseFloat(ginfo[3]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[10]+'</td><td>'+(ginfo[10]=="-"?"-":parseFloat(ginfo[10]).rmb(false, 0))+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[4]+'</td><td rowspan="2">'+gname2[4]+'</td><td>基本</td><td>'+ninfo[4]+'</td><td>'+(ginfo[4]=="-"?"-":parseFloat(ginfo[4]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[11]+'</td><td>'+(ginfo[11]=="-"?"-":parseFloat(ginfo[11]).rmb(false, 0))+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[5]+'</td><td rowspan="2">'+gname2[5]+'</td><td>基本</td><td>'+ninfo[5]+'</td><td>'+(ginfo[5]=="-"?"-":parseFloat(ginfo[5]).rmb(false, 0))+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"></tr>';	
		    		}else{
		    			 gname=getLevel(500);
		    			 gname2=getLevelms(500);
		    			kjdengji += ' <tr><td rowspan="2">'+gname[0]+'</td><td rowspan="2">'+gname2[0]+'</td><td>基本</td><td>'+ninfo[0]+'</td><td>'+parseFloat(ginfo[0]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr><td>追加</td><td>'+ninfo[9]+'</td><td>'+parseFloat(ginfo[9]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr><td rowspan="2">'+gname[1]+'</td><td rowspan="2">'+gname2[1]+'</td><td>基本</td><td>'+ninfo[1]+'</td><td>'+parseFloat(ginfo[1]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr><td>追加</td><td>'+ninfo[10]+'</td><td>'+parseFloat(ginfo[10]).rmb(false, 0)+'</td></tr>';			    			
		    			kjdengji += ' <tr><td rowspan="2">'+gname[2]+'</td><td rowspan="2">'+gname2[2]+'</td><td>基本</td><td>'+ninfo[2]+'</td><td>'+parseFloat(ginfo[2]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr><td>追加</td><td>'+ninfo[11]+'</td><td>'+parseFloat(ginfo[11]).rmb(false, 0)+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[3]+'</td><td rowspan="2">'+gname2[3]+'</td><td>基本</td><td>'+ninfo[3]+'</td><td>'+parseFloat(ginfo[3]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[12]+'</td><td>'+parseFloat(ginfo[12]).rmb(false, 0)+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[4]+'</td><td rowspan="2">'+gname2[4]+'</td><td>基本</td><td>'+ninfo[4]+'</td><td>'+parseFloat(ginfo[4]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[13]+'</td><td>'+parseFloat(ginfo[13]).rmb(false, 0)+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[5]+'</td><td rowspan="2">'+gname2[5]+'</td><td>基本</td><td>'+ninfo[5]+'</td><td>'+parseFloat(ginfo[5]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[14]+'</td><td>'+parseFloat(ginfo[14]).rmb(false, 0)+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td rowspan="2">'+gname[6]+'</td><td rowspan="2">'+gname2[6]+'</td><td>基本</td><td>'+ninfo[6]+'</td><td>'+parseFloat(ginfo[6]).rmb(false, 0)+'</td></tr>';
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>追加</td><td>'+ninfo[15]+'</td><td>'+parseFloat(ginfo[15]).rmb(false, 0)+'</td></tr>';	
		    			kjdengji += ' <tr mark="showtr" style="display: none;"><td>'+gname[7]+'</td><td colspan="2">'+gname2[7]+'</td><td>'+ninfo[7]+'</td><td>'+parseFloat(ginfo[7]).rmb(false, 0)+'</td></tr>';
		    		}
					
					
				$("#kaijianginfo").html(kjdengji);
			}
			if(lotid =="50" || lotid =="07" || lotid =="51"){
				var html=""
					for(var i=0;i<ninfo.length;i++){
						$("#level_num_"+(i+1)).html(ninfo[i]);
						$("#level_money_"+(i+1)).html(ginfo[i]);
					}
			}else{
				
			}
			$("#gsale").html("-");
			$("#gpool").html("-");
			if(rs.gsale > 0){ $("#gsale").html(rs.gsale); }
			if(rs.gpool >= 0){ $("#gpool").html(rs.gpool); }
			$("#kj_time").html(rs.atime.substr(0,16));
			if(ninfo.length > 0 && ninfo[0].length > 0){
				$("#level_num_1").html(ninfo[0]);
				$("#level_num_2").html(ninfo[1]);
				$("#level_num_3").html(ninfo[2]);
				$("#level_num_4").html(ninfo[3]);
				$("#level_num_5").html(ninfo[4]);
				$("#level_num_6").html(ninfo[5]);
				if(!!$("#level_num_3")){
					$("#level_num_3").html(ninfo[2]);
				}
				if(!!$("#level_num_9")){
					$("#level_num_9").html(ninfo[8]);
				}
				if(!!$("#add_level_num_1")){
					$("#add_level_num_1").html(ninfo[9]);
				}
				if(!!$("#add_level_num_2")){
					$("#add_level_num_2").html(ninfo[10]);
				}
			}
			if(ginfo.length > 0 && ginfo[0].length > 0){
				$("#level_money_1").html(ginfo[0]);
				$("#level_money_2").html(ginfo[1]);
				if(!!$("#level_money_3")){
					$("#level_money_3").html(ginfo[2]);
				}
				$("#level_money_4").html(ginfo[3]);
				$("#level_money_5").html(ginfo[4]);
				$("#level_money_6").html(ginfo[5]);
				if(!!$("#level_money_9")){
					$("#level_money_9").html(ginfo[8]);
				}
				if(!!$("#add_level_money_1")){
					$("#add_level_money_1").html(ginfo[9]);
				}
				if(!!$("#add_level_money_2")){
					$("#add_level_money_2").html(ginfo[10]);
				}
			}
			showOpenCode(lotid, rs.code);
			loadpage(lotid, expect,1,tps,ttp,ttotal);
		},
		error : function() {
			var html=tophtml;
			html+='<tr><td colspan="9"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
			$('#showlist').html(html);
			return false;
		}
	});
};
var nodata = function(){
	var html=tophtml;
	html+='<tr><td colspan="15"><p style="padding:20px 0;line-height:20px;color:#444;text-align:center;font-size:14px">本期无购买记录</p></td></tr>';
	$('#showlist').html(html);
	 $('#pagediv').html("");	
};
var loadpage = function(lotid,expect,pn,ps,tp,tr) {
	var html=tophtml;
	$("#seltype1").addClass("cur");
	$("#seltype2").removeClass("cur");
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/as_"+pn+".json?r="+Math.random(),
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var j=0;
			if(tr==0){
				html+='<tr><td colspan="14"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
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
						var ws = info.split(",")
							var cl=o%2==0?"":"odd";
						html+='<tr class='+cl+'>'+
						'<td align="center">'+((pn*1-1)*ps+j)+'</td>'+
						'<td >';
						
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
						if(info !=""){
						if(ws.length>9)ws.length=8;
						for(var i=0;i<ws.length;i++){
						html+='<td align="center">'+(parseInt(ws[i])>0?('<em>'+ws[i]+'</em>'):ws[i])+'</td>';
						}
						}else{
						if(lotid==01){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==03){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==07){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==50){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==51){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else if(lotid==52){
						html+='<td align="center">0</td>';
						}else if(lotid==53){
						html+='<td align="center">0</td><td align="center">0</td><td align="center">0</td>';
						}else{
						html+='<td align="center">--</td>';
						}
						}
						
						
						

						html+=' <td <td align="right">'+(parseFloat(bonus)>0?('<em>'+parseFloat(bonus).rmb(false)+'</em>'):(parseFloat(bonus).rmb(false)))+'</td><td align="center">';
						html+=isdg?'--</td><td align="center">--':'<a  href="' + $_sys.getlotpath(lotid) + $_sys.url.viewpath+'?lotid='+lotid+'&projid='+hid+'" target="_blank">详情</a></td><td align="center"><a class="n_gz" href="javascript:void(0);" onclick="$_sys.autobuy(\''+lotid+'\',\''+uid+'\')" >定制</a>';
						html+='</td></tr>';				
						
					});
			}
			html +='<tr><td style="height:auto ;border-bottom:none"></td></tr>'
			
			$('#showlist').html(html);		
			showpageno(lotid, expect ,pn,ps,tp,tr);				
		},
		error : function() {
			var html=tophtml;
			html+='<tr><td colspan="9"><p style="padding:150px 0;line-height:20px;color:#444;text-align:center;font-size:14px">该玩法无方案存在</p></td></tr>';
			$('#showlist').html(html);
			return false;			
		}
	});
};
var showOpenCode = function(lotid, code){
	var codes = code.replaceAll("\\|",",").replaceAll("\\+",",").split(",");
	$("#kj_info b").each(function(o,rt){
		$(rt).html(codes[o]);
	});
};
var showpageno=function(lotid,expect,pn,ps,tp,tr){	
	var maxshow=5;
	var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+tr+'条</li><li class="disabled PagedList-skipToFirst"  onclick="loadpage(\''+lotid+'\', \''+expect+'\',1,'+ps+','+tp+','+ tr+');"><a>首页</a></li>';
	pagehtml += '<li class="disabled PagedList-skipToNext"><a  onclick="loadpage(\''+lotid+'\', \''+expect+'\','+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+ tr+');" href="javascript:void(0)">上一页</a></li>';
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
	
	pagehtml+='<li class="PagedList-skipToNext"><a onclick="loadpage(\''+lotid+'\', \''+expect+'\','+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+ tr+');"  href="javascript:void(0)">下一页</a></li>';
	pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="loadpage(\''+lotid+'\', \''+expect+'\','+tp+','+ps+','+tp+','+ tr+');" href="javascript:void(0)"> 末页</a></li><ul>';
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
Class('LoadHisOpenCode',{
	index:function(){
		this.init();
		this.bingMsg();
	},
	
	init:function(){
		var arr = ["01","03","07","50","51","52","53"];
		var f = false;
		for(var i = 0; i < arr.length; i++){
			if(arr[i] == Class.C('lot_id')){
				f = true;break;
			}
		}
		if(f){
         	$.ajax({
         		url : "/tdata/" + Class.C('lot_id') + "/last_10.xml?rnd=" + Math.random(),      		
        		success : function(xml) {
        			var R = $(xml).find("xml");
        			var c = R.find("row");
        			if(c.length > 0){
        				Y.postMsg('msg_get_hisopencode_suc',c);
        			}
        		}
        	});
		}
	},
	bingMsg:function(){
		this.onMsg('msg_get_hisopencode_suc',function(info){
			return this.showhis(info);
		});
	},
	showhis:function(info){
		var html = '<li>期次</li><li class="sup">开奖号码</li>';
		$(info).each(function(i){
			if(i<11){
			if($(this).attr("rm") != '1'){
    			if($(this).attr('cc').indexOf('\|') >= 0){
    				html += "<li>" + $(this).attr('cp') + "</li><li class='sup'><font>" + $(this).attr('cc').split('|')[0].replaceAll(',',' ') + "</font><strong>" + $(this).attr('cc').split('|')[1].replaceAll(',',' ') + "</strong></li>";			
    			}else{
    				html += "<li>" + $(this).attr('cp') + "</li><li class='sup'><font>" + $(this).attr('cc').replaceAll(',', ' ') + "</font></li>";			
    			}
			}}
		});
		html +="<a href='javascript:void(0);' target='_blank' id='more_kj' class='xu_gd'>更多</a>";
		
		$("#kjhis").html(html);
		if(Class.C('lot_id')==01){
			$("#more_kj").attr("href","/shuangseqiu/kaijiang.html")
		}else if(Class.C('lot_id')==03){
			$("#more_kj").attr("href","/3d/kaijiang.html")
		}else if(Class.C('lot_id')==07){
			$("#more_kj").attr("href","/qilecai/kaijiang.html")
		}else if(Class.C('lot_id')==50){
			$("#more_kj").attr("href","/daletou/kaijiang.html")
		}else if(Class.C('lot_id')==51){
			$("#more_kj").attr("href","/qixingcai/kaijiang.html")
		}else if(Class.C('lot_id')==52){
			$("#more_kj").attr("href","/paiwu/kaijiang.html")
		}else if(Class.C('lot_id')==53){
			$("#more_kj").attr("href","/paisan/kaijiang.html")
		}
		$("#show_info").click(function(){
			if($(this).attr("class")=="cur"){
				$("#kjhis").hide();
				$(this).html("展开")
				$(this).removeClass('cur');
			}else{
				$("#kjhis").show();
				$(this).addClass('cur');
				$(this).html("收起")
			}
			
		
		
		});
	}
});