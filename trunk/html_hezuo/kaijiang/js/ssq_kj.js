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
                       '<font color="red">5</font>+<font color="blue">0</font>,'+
                       '<font color="red">4</font>+<font color="blue">2</font>,'+
                       '<font color="red">4</font>+<font color="blue">1</font>,'+
                       '<font color="red">4</font>+<font color="blue">0</font>/<font color="red">3</font>+<font color="blue">2</font>,'+
                       '<font color="red">3</font>+<font color="blue">1</font>/<font color="red">2</font>+<font color="blue">2</font>,'+
                       '<font color="red">3</font>+<font color="blue">0</font>/<font color="red">2</font>+<font color="blue">1</font>/<font color="red">1</font>+<font color="blue">2</font>/<font color="red">0</font>+<font color="blue">2</font>']);

$_sys.zst_def = [];
$_sys.zst_def.push([ 01, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 03, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 07, "http://zst.gucheng.159cai.com/" ]);

$_sys.zst_def.push([ 50, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 51, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 52, "http://zst.gucheng.159cai.com/" ]);
$_sys.zst_def.push([ 53, "http://zst.gucheng.159cai.com/" ]);
Class({
	ready: true,
    index:function (config){
    	Class.C('lot_id',$("#lotid").val());
    	Y.lib.LoadHisOpenCode();
    }	
});
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

$_sys.getgrade2 = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	};
	for ( var i = 0; i < $_sys.grade_def2.length; i++) {
		if ($_sys.grade_def2[i][0] == f) {
			return $_sys.grade_def2[i][n].split(",");
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
	var lotid=$("#lotid").val();
	var expect = location.search.getParam('expect');
	
	

	if(lotid==""){$_sys.showerr('对不起，该期暂未开售或者已经过期!');}
	
	$("#qihao").html(expect);
	$('#kj_qihao').html("<b>"+expect+"</b>");
	var listsize = 21;



	if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
//		showkpinfo(lotid, expect, listsize);
		$_sys.showerr('对不起，该期暂未开售或者已经过期!');
	} else {
		
		showinfo(lotid, listsize,expect);
	}
	   $(".jj_js_sm h2 a").click(function(){
   		if($(this).text()=="展开"){
   			$(this).removeClass("cur").text("收起");
   			$(".jj_js_sm table").show();
   		}else{
   			$(this).addClass("cur").text("展开");
   			$(".jj_js_sm table").hide();
   		}
   	});
	
});




var showinfo=function(lotid, listsize,expect) {
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
				html1 += "<option>请选择期号</option>";
				var html2 = "";
				for ( var i = 0; i < expectlist.length; i++) {
					if(i<listsize){
						
						html1 += "<option>第"+ expectlist[i][0]+"期</option>";
					}else{
						html2 += "<option>第"+ expectlist[i][0]+"期</option>";
					}
				}
				$("#elist1").html(html1);
				$("#elist2").html(html2);
				if (expect == "") {
					
					expect = expectlist[0]+"期";
					
				}
				$("#buy_qihao").html( parseInt(expectlist[0])+1);
			
			    $("#elist1").bind("change", function() {  
					var e = $(this).html();
					var checkText=$("#elist1").find("option:selected").text();
					if(checkText=="请选择期号"){return false;}
					checkText = checkText.replace(/[期|第]/g, "");
					elist(checkText);
					
					if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
						loadkpmain(lotid, checkText);
					} else {
						$("#qihao").html(checkText);
						$('#kj_qihao').html("<b>"+checkText+"</b>");
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
//	var ss='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次！</span>';

//	$('#kj_info').html(ss);
	$("#qihao").html(expect);
	$('#kj_qihao').html("<b>"+expect+"</b>");
	$("#kj_dengji").html("");
	$('#kj_mess').html("");
	
	
	
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
				
					
				if(lotid == "01"||lotid == "07"||lotid == "50"||lotid == "51"||lotid == "53"||lotid == "52"||lotid == "03"){
					var acode = code.split("|");	
					var htmll ='<em>开奖结果</em>';
					if (acode.length==2){
						var a_r=acode[0].split(",");
						var a_b=acode[1].split(",");
						
						for (var i=0;i<a_r.length;i++){
						
							htmll+='<b>'+a_r[i]+'</b>';
						}
						
						for (var i=0;i<a_b.length;i++){
							htmll+='<b class="blue">'+a_b[i]+'</b>';
						
						}						
					}else{
						acode= code.split(",");
						if (acode.length>1){
							for (var i=0;i<acode.length;i++){
								if (lotid=="03"||lotid=="52"||lotid=="53"||lotid=="51"){									
									htmll+='<b>'+acode[i]+'</b>';
								}else{
//									alert(i+"==="+acode.lenglength);
									if(i=acode.lenglength){
										
										htmll+='<b class="blue">'+acode[i]+'</b>';
									}else{
									
										htmll+='<b">'+acode[i]+'</b>';}
								}								
							}
						}						
					}	
					var ets = Y.getDate(atime);
					var d_e = new Date(ets);
					var d_s = d_e.dateadd("d", +60);
					etime = d_s.format("YY-M-D");
					
    			
					

					var html ='<ul><li>开奖时间：	<strong>'+atime.substr(0,10)+'</strong></li><li>兑奖截至：	<strong>'+etime.substr(0,10)+'</strong></li><li>奖池：	<font>'+ parseFloat(gpool).rmb(false, 0) +'</font>元</li><li>全国销量：	<font>'+ parseFloat(gsale).rmb(false, 0) +'</font>元</li></ul>';
				    var kjdengji="";
					var gname = $_sys.getgrade(lotid);
					var gname2 = $_sys.getgrade2(lotid);
					var aginfo = ginfo.split(",");
					var aninfo = ninfo.split(",");
					kjdengji='<table width="100%" border="0" cellpadding="0" cellspacing="0"><colgroup> <col width="110" /><col width="215" /><col width="215" /> <col /> </colgroup> <thead><tr> <td colspan="2">奖项</td> <td>中奖注数(注)</td><td>每注奖金(元)</td> </tr>  </thead>';
				    for (var i=0;i<aginfo.length && i < gname.length && i < gname2.length;i++) {
			    	
				    	if(gname[i].length > 0){
			    	
			    			kjdengji += ' <tr><td>'+gname[i]+'</td><td>'+gname2[i]+'</td><td>'+aninfo[i]+'</td><td>'+parseFloat(aginfo[i]).rmb(false, 0)+'</td></tr>';
			    			}
				    	}
			
				    
					
					$('#kj_info').html(htmll);
				    $('#kj_mess').html(html);
				    $('#kj_dengji').html(kjdengji);
				}
				    if(lotid==50){
						
						
						$("title").text("大乐透"+expect+"期开奖结果-大乐透开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","大乐透"+expect+"大乐透"+expect+"期，大乐透"+expect+"开奖结果，大乐透"+expect+"期");
						$("meta[name='description']").attr("content","159彩票网大乐透开奖频道为您提供半全场"+expect+"，大乐透"+expect+"期，大乐透"+expect+"期，大乐透"+expect+"开奖结果")
						
					}else if(lotid==07){
						$("title").text("七乐彩"+expect+"期开奖结果-七乐彩开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","七乐彩"+expect+"七乐彩"+expect+"期，七乐彩"+expect+"开奖结果，七乐彩"+expect+"期");
						$("meta[name='description']").attr("content","七乐彩"+expect+"，七乐彩"+expect+"期，七乐彩"+expect+"期，七乐彩"+expect+"开奖结果")
					}
						
					else if(lotid==01){
							$("title").text("双色球"+expect+"期开奖结果-双色球开奖公告-全国彩票开奖-159彩票网");
							$("meta[name='keywords']").attr("content","双色球"+expect+"双色球"+expect+"期，双色球"+expect+"开奖结果，双色球"+expect+"期");
							$("meta[name='description']").attr("content","双色球"+expect+"，双色球"+expect+"期，双色球"+expect+"期，双色球"+expect+"开奖结果")
						
					}else if(lotid==03){
						$("title").text("3D"+expect+"期开奖结果-3D开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","3D"+expect+"3D"+expect+"期，3D"+expect+"开奖结果，3D"+expect+"期");
						$("meta[name='description']").attr("content","3D"+expect+"，3D"+expect+"期，3D"+expect+"期，3D"+expect+"开奖结果")
						
						
					}else if(lotid==51){
						$("title").text("七星彩"+expect+"期开奖结果-七星彩开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","七星彩"+expect+"七星彩"+expect+"期，七星彩"+expect+"开奖结果，七星彩"+expect+"期");
						$("meta[name='description']").attr("content","七星彩"+expect+"，七星彩"+expect+"期，七星彩"+expect+"期，七星彩"+expect+"开奖结果")
						$("#kj_logo").html('<span class="qxc-logo"></span>');
						
						
						
					}else if(lotid==53){
						$("title").text("排列三"+expect+"期开奖结果-排列三开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","排列三"+expect+"排列三"+expect+"期，排列三"+expect+"开奖结果，排列三"+expect+"期");
						$("meta[name='description']").attr("content","排列三"+expect+"，排列三"+expect+"期，排列三"+expect+"期，排列三"+expect+"开奖结果")
						
					}
					else if(lotid==52){
						$("title").text("排列五"+expect+"期开奖结果-排列五开奖公告-全国彩票开奖-159彩票网");
						$("meta[name='keywords']").attr("content","排列五"+expect+"排列五"+expect+"期，排列五"+expect+"开奖结果，排列五"+expect+"期");
						$("meta[name='description']").attr("content","排列五"+expect+"，排列五"+expect+"期，排列五"+expect+"期，排列五"+expect+"开奖结果")
						
					}
	
					
				
				   
				else {
					
				}
				 
				
			} else {
				alert(desc);
			}
		},
		error : function() {
			
			alert("12");
			var s='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次 !!</span>';
			$('#kj_info').html(s);
			return false;
		}
	});

};

Class.C('time_style', true);
Class.C('time_style_ctpl', '<b >{1}</b>天<b >{2}</b>小时<b>{3}</b>分');
Class.C('time_style_ctp2', '<b>{2}</b>小时<b >{3}</b>分<b>{4}</b>秒');
Class(
		'Application',
		{
			ready : true,
			use : 'tabs,mask,dataInput',
			index : function() {
				this.red = [];
	            this.blue = [];
				
				this.showTime();				
			},
			showTime:function(){
				var lotid = $("#lotid").val();
				this.ajax({				
					url : "/cpdata/game/"+lotid+"/s.json?rnd=" + Math.random(),
					type : "get",
					cache:false,
					dataType : "json",
					end  : function (d){
						var obj = eval("(" + d.text + ")");
						var code = obj.period.code;
						var desc = obj.period.desc;
						if (code == "0") {
							var r = obj.period.row;
							var pid = r[0].pid;
							var et = r[0].et;
//							$("#endTimeSpan").html(''+(Y.getDate(et).format('YY-MM-DD hh:mm:ss')));
				            $("#responseJson #serverTime").val(Y.getDate(d.date).format('YY-MM-DD hh:mm:ss'));
							$("#responseJson #endTime").val(Y.getDate(et).format('YY-MM-DD hh:mm:ss'));
							
							this.postMsg('msg_show_endtime_CountDown');
//							this.postMsg('msg_endtime_change', endtime, data.date);
						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障!");
						return false;
					}
				});
			}
    });

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
		var html = '';
		$(info).each(function(i){
			if(i<11){
			if($(this).attr("rm") != '1'){
    			if($(this).attr('cc').indexOf('\|') >= 0){
    				html += "<tr><td>" + $(this).attr('cp') + "</td><td ><font color=red>" + $(this).attr('cc').split('|')[0].replaceAll(',',' ') + "</font>&nbsp;&nbsp;<font color=blue>" + $(this).attr('cc').split('|')[1].replaceAll(',',' ') + "</font></td></tr>";			
    			}else{
    				html += "<tr><td>" + $(this).attr('cp') + "</td><td><font color=red>" + $(this).attr('cc').replaceAll(',', ' ') + "</font></td></tr>";			
    			}
			}}
		});
		
		
		$("#kaijianglist").html(html);
	
	}
});






