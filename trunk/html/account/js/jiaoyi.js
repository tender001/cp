var gcsum,fksum,zksum,jjsum,czsum,tksum;//购彩、返款、转款、奖金、充值、提款
$(function(){
	$("#inm").empty();	
	for ( var i = 0; i < $_sys.inm.length; i++) {
			$("#inm").append("<option value=\""+$_sys.inm[i][0]+"\">"+$_sys.inm[i][1]+"</option>");
	}	
	$("#outm").empty();
	for ( var i = 0; i < $_sys.outm.length-1; i++) {
			$("#outm").append("<option value=\""+$_sys.outm[i][0]+"\">"+$_sys.outm[i][1]+"</option>");
	}
	
	//查询
	$("#td_submit").click(function(){
		var pn=1;//页码
		var ps=$("input[name='pages']:checked").val();//页面大小
		var tp = 0;//总页数
		var tr = 0;//总记录数
		
		showInfo($("#begintime").val(),$("#endtime").val(),$("#busisort").val(),pn,ps,tp,tr);
		loadSUM($("#begintime").val(),$("#endtime").val(),$("#busisort").val());
	});
	
	//加载账户明细
	//loadSI();
});

var loadSI = function(){
	var pn=1;//页码
	var ps = 10;//页面大小
	var tp = 0;//总页数
	var tr = 0;//总记录数	
	
	Y.ajax({
		url : "/cpdata/time.json",
		end : function(data) {
			var servernow = Y.getDate(data.date);
			var d_e = new Date(servernow);
			var d_s = d_e.dateadd("m", -3);
			$("#begintime").val(d_s.format("YY-M-D"));
			$("#endtime").val(d_e.format("YY-M-D"));
			ESONCalendar.init().bind("begintime").bind("endtime").splitChar="-";
			showInfo($("#begintime").val(),$("#endtime").val(),$("#busisort").val(),pn,ps,tp,tr);
			loadSUM($("#begintime").val(),$("#endtime").val(),$("#busisort").val());
		}
	});
};

Y.C('logininfo',loadSI);
Y.C('logoutinfo',logoutinfo);
Y.LoginAcc();
var loadSUM = function(stime,etime,tid){
	var data = "";
	if (tid==0||tid=="undefine"){
		data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" +etime;
	}else{
		data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime+"&tid="+tid; 
	}
	gcsum=fksum=zksum=jjsum=czsum=tksum=0;
		Y.ajax({
		url : $_user.url.account,
		type : "POST",
		dataType : "json",
		data : data+"&"+$_user.key.ps+"="+10000,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			var innum=incount=outnum=outcount=0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.row;
				var rs = obj.Resp.count;
				tr=Y.getInt(rs.rc);
				tp=Y.getInt(rs.tp);
				ps=Y.getInt(rs.ps);
				pn=Y.getInt(rs.pn);
				if (tr%ps==0){tp=tr/ps;}else{tp=Math.ceil(tr/ps);}
				
				if(tr==0){
				}else{
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o){
						var cadddate = rt.cadddate;
						var itype = rt.itype;
						var imoney = rt.imoney;
						var ibalance = rt.ibalance;
						var ibiztype = rt.ibiztype;
						var ichargeid = rt.ichargeid;
						var cmemo = rt.cmemo;
						var cm=$_sys.showcmemo(ibiztype,cmemo);	
						var link = (cm.href?cm.href:cmemo);
						var s=link.split( "\"" )[1];
						
						
						
						if(ibiztype=='100' || ibiztype=='101' || ibiztype=='102' || ibiztype=='103'){
							gcsum += parseFloat(imoney);
						}else if(ibiztype=='210' || ibiztype=='211' || ibiztype=='212' || ibiztype=='213' || ibiztype=='214' || ibiztype=='215'){
							fksum += parseFloat(imoney);
						}else if(ibiztype=='300'||ibiztype=='214'){
							zksum += parseFloat(imoney);
						}else if(ibiztype=='201' || ibiztype=='202' || ibiztype=='203' || ibiztype=='204' ){
							jjsum += parseFloat(imoney);
						}else if(ibiztype=='200'){
							czsum += parseFloat(imoney);
						}else if (ibiztype=='104'){
							tksum += parseFloat(imoney);
						}
							
					});
					$("#gcsum").html(gcsum.toFixed(2));
					$("#czsum").html(czsum.toFixed(2));
					$("#fksum").html(fksum.toFixed(2));
					$("#jjsum").html((jjsum).toFixed(2));
					$("#tksum").html(tksum.toFixed(2));
					//gcsum=fksum=zksum=jjsum=czsum=tksum=0;
				}
				
			}else{
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					//html+="<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
				}
			}
			
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
};
function logoutinfo(){
    location="/";
};
//分页调用 
function takeShow(pn,ps,tp,tr){
	var td_btime = $("#begintime").val();
	var td_etime = $("#endtime").val();
	var td_btype = $("#busisort").val();
	
	showInfo(td_btime,td_etime,td_btype,pn,ps,tp,tr);
};

//账户明细显示
var showInfo = function(stime,etime,tid,pn,ps,tp,tr) {//页码		页面大小 		总页数	总记录数
	var data = "";
	tp=0;
	if (tid==0||tid=="undefine"){
		data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	}else{
		data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime+"&tid="+tid; 
	}
	
//	data += "&"+$_user.key.ps+"="+10000;
//	data += "&"+$_user.key.tp+"="+tp;
//	data += "&"+$_user.key.tr+"="+tr;
	
	
	
		
	$("#showdatalist").html("");
	var html="";
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	gcsum=fksum=zksum=jjsum=czsum=tksum=0;
	Y.ajax({
		url : $_user.url.account,
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			var innum=incount=outnum=outcount=0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.row;
				var rs = obj.Resp.count;
				tr=Y.getInt(rs.rc);
				tp=Y.getInt(rs.tp);
				ps=Y.getInt(rs.ps);
				pn=Y.getInt(rs.pn);
				if (tr%ps==0){tp=tr/ps;}else{tp=Math.ceil(tr/ps);}
				
				if(tr==0){
//					html+="<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
					$("#nocount").show();
				}else{
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o){
						var cadddate = rt.cadddate;
						var itype = rt.itype;
						var imoney = rt.imoney;
						var ibalance = rt.ibalance;
						var ibiztype = rt.ibiztype;
						var ichargeid = rt.ichargeid;
						var cmemo = rt.cmemo;
						var cm=$_sys.showcmemo(ibiztype,cmemo);	
						var link = (cm.href?cm.href:cmemo);
						var s=link.split( "\"" )[1];
						var cl=o%2==0?"":"odd"
							html += "<tr class="+cl+">";
						if(ibiztype ==213|| ibiztype ==200|| ibiztype ==104|| ibiztype ==216|| ibiztype ==214){
							html += "<td>" + ichargeid + "</td>";
						}else{
						
						html += "<td><a href='"+s+"' target='_blank'>" + ichargeid + "</a></td>";
						}
						html += "<td>" + cadddate + "</td>";
						if (itype == "0") {
							html += "<td><s style='color:green;'>￥" + parseFloat(imoney).rmb(false) + "</s></td>";
							html += "<td>&nbsp;</td>";
						} else {
							html += "<td>&nbsp;</td>";
							html += "<td><s style='color:red;'>￥" + parseFloat(imoney).rmb(false) + "</s></td>";
						}
						html += "<td>" + parseFloat(ibalance).rmb() + "</td>";
						html += "<td>" +$_sys.biztype(ibiztype) + "</td>";
						
						if(ibiztype=='104'){
							html += "<td title='提现'>提现</td>";
						}else{
							html += "<td title="+ (cm.title?cm.title:cmemo) +">";
							html +=  (cm.title?cm.title:cmemo).replace((cm.title?cm.title:cmemo),sub((cm.title?cm.title:cmemo),20))+" </td>";
						}
						
						html += " </tr>";	
						
						
//						if(ibiztype=='100' || ibiztype=='101' || ibiztype=='102' || ibiztype=='103'){
//							gcsum += parseFloat(imoney);
//						}
//						else if(ibiztype=='210' || ibiztype=='211' || ibiztype=='212' || ibiztype=='213' || ibiztype=='214' || ibiztype=='215'){
//							fksum += parseFloat(imoney);
//						}
//						else if(ibiztype=='300'||ibiztype=='214'){
//							zksum += parseFloat(imoney);
//						}
//						else if(ibiztype=='201' || ibiztype=='202' || ibiztype=='203' || ibiztype=='204' || ibiztype=='216')
//							jjsum += parseFloat(imoney);
//						
//						else if(ibiztype=='200')
//							czsum += parseFloat(imoney);
//						
//						else if (ibiztype=='104')
//							tksum += parseFloat(imoney);
							
					});
					
					//gcsum=fksum=zksum=jjsum=czsum=tksum=0;
				}
				
			}else{
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					html+="<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
				}
			}
			$("#touzhulist").html(html);
			if(tr>0){
				$("#page_div").html(getpage(pn,ps,tp,tr,"takeShow"));
			}else{
				
				$("#page_div").html("");
			}
			
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
};

//字符串截取中文算两个字符截
var sub=function(str, len) {
	var str_length = 0;
	var str_len = 0;
	str_cut = new String();
	str_len = str.length;
	for ( var i = 0; i < str_len; i++) {
		a = str.charAt(i);
		str_length++;
		if (escape(a).length > 4) {
			str_length++;
		}
		str_cut = str_cut.concat(a);
		if (str_length >= len) {
			str_cut = str_cut.concat("...");
			return str_cut;
		}
	}
	//返回源字符串；
	if (str_length < len) {
		return str;
	}
}; 