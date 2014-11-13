var ps = 10;
var pn = 1;
var tp = 0;
var tr = 0;
var uid = '';
var gid = '';
var func = 'jp';
$(function() {

	gid = location.search.getParam('lotid');
	uid = location.search.getParam('uid');
	func = location.search.getParam('func');
	
	
	if ( func == '') {
		func = 'jp';
	}
	$("input[name=ss][value=" + func + "]").attr("checked",true);
	$("input[name=as][value=" + gid + "]").attr("checked",true);
	
	if ( gid == '80' || gid == '81' || gid == '82' || gid == '83') {
		HoverLi(1);
	}else if ( gid == '85' || gid == '86' || gid == '87' || gid == '88' || gid == '89'){
		HoverLi(3);
	}else if ( gid == '90' || gid == '91' || gid == '92' || gid == '93' || gid == '70'|| gid == '72'){
		HoverLi(4);
	}else if ( gid == '94' || gid == '95' || gid == '96' || gid == '97' || gid == '71'){
		HoverLi(5);
	}else {
		HoverLi(2);
	}
});
var showinfo = function() {// 页码 页面大小 总页数 总记录数
	var data = {
		func:func,
		gid:gid,
		uid:uid,
		ps:ps,
		pn:pn,
		tp:tp,
		tr:tr
	};

	$("#suid").html(uid);
	var tophtml = '' ;
	if ( func == 'jp' ) {
		tophtml += '<colgroup>' ;
		tophtml += '<col width="65" />' ;
		tophtml += '<col width="70" />' ;
		tophtml += '<col width="160" />' ;
		tophtml += '<col width="110" />' ;
		tophtml += '<col width="120" />' ;
		tophtml += '<col width="130" />' ;
		tophtml += '<col/>' ;
		tophtml += '</colgroup>' ;
		tophtml += '<tr>' ;
		tophtml += '<td>期号 </td>' ;
		tophtml += '<td>奖牌</td>' ;
		tophtml += '<td>方案编号</td>' ;
		tophtml += '<td>方案金额</td>' ;
		tophtml += '<td>中奖金额</td>' ;
		tophtml += '<td>盈利金额</td>' ;
		tophtml += '<td>回报率</td>' ;
		tophtml += '</tr>' ;
	}else{
		tophtml += '<colgroup>' ;
		tophtml += '<col width="65" />' ;
		tophtml += '<col width="170" />' ;
		tophtml += '<col width="140" />' ;
		tophtml += '<col width="150" />' ;
		tophtml += '<col width="130" />' ;
		tophtml += '<col/>' ;
		tophtml += '</colgroup>' ;
		tophtml += '<tr>' ;
		tophtml += '<td>期号 </td>' ;
		tophtml += '<td>方案编号</td>' ;
		tophtml += '<td>方案金额</td>' ;
		tophtml += '<td>中奖金额</td>' ;
		tophtml += '<td>盈利金额</td>' ;
		tophtml += '<td>回报率</td>' ;
		tophtml += '</tr>' ;
	}
	
	var html = "";
	Y.ajax({
		url : $_trade.url.tquery,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			var innum = incount = outnum = outcount = 0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.rows.row;
				var rs = obj.Resp.rows;
				tr=Y.getInt(rs.tr);
				tp=Y.getInt(rs.tp);
				ps=Y.getInt(rs.ps);
				pn=Y.getInt(rs.pn);	
				var cc = 0;
				var j = 0;


				if(tr>0){
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						j = j + 1;
						var hid = rt.cprojid;
						var pid = rt.cperiodid;
						var ipmoney = rt.ipmoney;
						var iwmoney = rt.iwmoney;
						var imoney = iwmoney - ipmoney;
						var wrate = parseFloat(iwmoney / ipmoney).rmb(false) ;
						if ( imoney <= 0 ) {
							imoney = 0;
//							wrate = 0;
						} 
						
						var iaunum = rt.iaunum;
						html += "<tr>";
						
						if ( func == 'jp' ) {
							html += ' <td>'+pid+'</td>';
							html += ' <td>' + $_sys.showzhanji(iaunum,0) +'</td>';
							html += ' <td><a href="' + $_sys.getlotpath(gid) + $_sys.url.viewpath+'?lotid='+gid+'&projid='+hid+'" target=_blank title="点击查看">'+hid+'</a></td>';
							html += '<td>￥' + parseFloat(ipmoney).rmb(false) + '</td>';
							html += '<td>￥' + parseFloat(iwmoney).rmb(false) + '</td>';
							html += '<td>￥' + parseFloat(imoney).rmb(false) + '</td>';
							html += "<td> "+wrate+"倍</td>";
						}else{
							html += ' <td>'+pid+'</td>';
							html += ' <td><a href="' + $_sys.getlotpath(gid) + $_sys.url.viewpath+'?lotid='+gid+'&projid='+hid+'" target=_blank title="点击查看">'+hid+'</a></td>';
							html += '<td>￥' + parseFloat(ipmoney).rmb(false) + '</td>';
							html += '<td>￥' + parseFloat(iwmoney).rmb(false) + '</td>';
							html += '<td>￥' + parseFloat(imoney).rmb(false) + '</td>';
							html += "<td> "+wrate+"倍</td>";
						}

						html += " </tr>";
						cc++;
					});
				}
				
				for ( var i=0;i<ps-cc;i++) {
					html += "<tr>";
					if ( func == 'jp' ) {
						html += ' <td colspan="7">&nbsp;</td>';
					}else{
						html += ' <td colspan="6">&nbsp;</td>';
					}
					html += " </tr>";
				}
				var maxshow=5;
				var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+tr+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick="gopage(1);" href="javascript:void(0)" >首页</a></li>';
				pagehtml += '<li class="PagedList-skipToNext"><a  onclick="gopage(pn-1)" href="javascript:void(0)">上一页</a></li>';
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
				pagehtml+='<li class="active"><a href="javascript:void(0);" id="'+i+'" class="a4" onclick="gopage('+i+');">' + i + '</a></li>';
				}else{
					pagehtml+='<li><a href="javascript:void(0);" id="'+i+'" class="a3" onclick="gopage('+i+');">' + i + '</a></li>';
				}
				}

				
				pagehtml+='<li class="PagedList-skipToNext"><a onclick="gopage(pn+1)"  href="javascript:void(0)">下一页</a></li><li class="PagedList-skipToNext"><a onclick="gopage(tr)"  href="javascript:void(0)">尾页</a></li><ul>';

			
			    $("#pagehtml").html(pagehtml);
			} else {
				if (code == "1") {
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}
			}

			html = tophtml + html;
			
			$("#dzgd").die().live('click', function(){
				parent.window.Y.postMsg('msg_login', function() {
					Y.openUrl('/game/gendan.html?type=new&lotid='+gid+'&owner='+uid, 642,365);

				});
			});
			
			$("#showdatalist").html(html);
			
			Y.ajax({
				url : $_user.url.qautobuy,
				type : "POST",
				dataType : "json",
				data : {
					gid:gid,
					owner:uid
				},
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
					if (code == "0") {
						var allc =0;
						var c = obj.Resp.count;
						allc = c.allc;// 状态
						$("#numbers").html(allc);
					}
				},
				error : function() {
					return false;
				}
			});
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
	
	
	data = {
		func:'tjp',
		gid:gid,
		uid:uid
	};
	Y.ajax({
		url : $_trade.url.tquery,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			var innum = incount = outnum = outcount = 0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.rows.row;
				var aunum = r.aunum;
				$("#jpnum").html($_sys.showzhanji(aunum,0));
			} 
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
};

function g(o) { 
	return document.getElementById(o); 
}
function HoverLi(n) {
    //如果有N个标签,就将i<=N;
    for (var i = 1; i <= 5; i++) { 
    	g('tb_' + i).className = ''; 
    	$('#tbc_0' + i).hide();
    }
    $('#tbc_0' + n).show(); 
    g('tb_' + n).className = 'cur';
    $("input[name=as][value="+gid+"]").attr("checked",true);
    showinfo();
}


function HoverLi2(n) {
    //如果有N个标签,就将i<=N;
    for (var i = 1; i <= 5; i++) { 
    	g('tb_' + i).className = '';  
    	$('#tbc_0' + i).hide();
    }
    $('#tbc_0' + n).show(); 
    g('tb_' + n).className = 'cur';
    
    if ( n == 1 ) {
    	gid = '80';
    	$("input[name=as][value=80]").attr("checked",true);
    } else if (n==2) {
    	gid = '01';
    	$("input[name=as][value=01]").attr("checked",true);
    }else  if (n==3){
    	gid = '85';
    	$("input[name=as][value=85]").attr("checked",true);
    }else if (n==4){
    	gid = '90';
    	$("input[name=as][value=90]").attr("checked",true);
    }else{
    	gid = '94';
    	$("input[name=as][value=94]").attr("checked",true);
    }
    pn = 1;
	tp = 0;
	tr = 0;
    showinfo();
}
function gameClick(_gid) {
	pn = 1;
	tp = 0;
	tr = 0;
	gid = _gid;
	showinfo();
}

function jpAwardClick(_func) {
	pn = 1;
	tp = 0;
	tr = 0;
	func = _func ;
	showinfo();
}

var gopage = function(p) {
	pn = p;
	showinfo();
};

var jump = function(p) {
	pn = $("#pselect").val();
	showinfo();
};