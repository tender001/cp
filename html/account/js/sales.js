
$(function(){
	loadSI();	
	$("#td_myrate").click(function(){		
		Y.postMsg('msg_login', function (){
			Y.openUrl('/account/myrate.html',807,580);
		});
	});
	
	//查询
	$("#td_submit").click(function(){
		var pn=1;//页码
		var ps=10;//页面大小
		var tp = 0;//总页数
		var tr = 0;//总记录数
		
		showInfo($("#begintime").val().format("YY-MM-DD"),$("#endtime").val().format("YY-MM-DD"),pn,ps,tp,tr,$("#cname").val());
		
	});
});

var loadSI = function(){
	var pn= 1;//页码
	var ps = 10;//页面大小
	var tp = 0;//总页数
	var tr = 0;//总记录数	
	
	Y.ajax({
		url : "/cpdata/time.json",		
		end :function(data) {
			var servernow = Y.getDate(data.date);
			var d_e = new Date(servernow);
			var d_s = d_e.dateadd("m", -3);
			$("#begintime").val(d_s.format("YY-MM-DD"));
			$("#endtime").val(d_e.format("YY-MM-DD"));
			ESONCalendar.init().bind("begintime").bind("endtime").splitChar="-";
			agVerify(pn,ps,tp,tr);
		}
	});
};


var agVerify = function(pn,ps,tp,tr){
	Y.ajax({
		url : $_user.url.base,
		type : "POST",
		dataType : "json",
		end : function(d) {		
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;		
			if (code == "0") {			
				var r = obj.Resp.row;
				var vlevel=Y.getInt(r.vlevel);
				var isagent=Y.getInt(r.isagent);				
				$("#caid").val(r.cagentid);
				$("#nid").val(r.nickid);	
				if(isagent==1){
					showInfo($("#begintime").val(),$("#endtime").val(),pn,ps,tp,tr,$("#cname").val());		
					
				}else{
					Y.alert("您的用户类型错误！",0,0,1);
					return false;
				}
			}else{
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					Y.alert("您所请求的页面有异常！",0,0,1);
					return false;
				}
			}
		},
		error : function() {
			Y.alert("您所请求的页面有异常！",0,0,1);
			return false;
		}
	});
//	Y.ajax({
//		url : "/phpu/qp.phpx?fid=u_agentxl&stime=2014-03-01&etime=2014-03-31&owner=Elvis2014",
//		type : "POST",
//		dataType : "json",
//		end : function(d) {		
////			var obj = eval("(" + d.text + ")");
////			var code = obj.Resp.code;
////			var desc = obj.Resp.desc;		
////			if (code == "0") {}else{
////				if (code=="1"){
////					parent.window.Y.postMsg('msg_login', function() {						
////						window.location.reload();			
////					});
////				}else{
////					Y.alert("您所请求的页面有异常！",0,0,1);
////					return false;
////				}
////			}
//		},
//		error : function() {
//			Y.alert("您所请求的页面有异常！",0,0,1);
//			return false;
//		}
//	});
};



var showInfo = function(stime,etime,pn,ps,tp,tr,owner){
	var data = "";
	tp=0;

	
	data = "stime=" + stime + "&etime=" + etime;
	data += "&aid="+owner;
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	
	$("#showdatalist").html("");
	var html = "";
	
	Y.ajax({
//		url : $_user.url.agent,
		url : "/phpu/qp.phpx?fid=query_xagent_salestat",
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

				var i=j=d=0;
				
				if(tr==0){
					html+="<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
				}else{
					if(!this.isArray(r)){r=new Array(r);}
					var sumsales=0;
					r.each(function(rt,o){
						var rec = rt.rec;
						var cnickid = rt.xj;
						var sales = rt.sumsales;
						var cactivedate = rt.cactivedate;
						var apath = rt.apath;
					
						sumsales+=sales*1;

						var cl=o%2==0?"":"odd"
							html += "<tr class="+cl+">";
						html += "<td>" + rec + "</td>";
						html += "<td>" + cnickid + "</td>";
						html += "<td>" + sales + "</td>";
					
						html += "<td>" + apath + "</td>";
						html += "</tr>";
					});
				}
				
				$("#atj").html("当前页总销量："+sumsales+" 元");
			} else {
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					html+="<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
				}
			}
			
			$("#showdatalist").html(html);
			$("#pagediv").html(getpage(pn,ps,tp,tr,"takeShow"));
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
	

};

//
function fandian(uid){
	Y.postMsg('msg_login', function (){
		Y.openUrl('/account/shezhi.html?uid='+uid,807,580);
	});
};


//分页调用 
function takeShow(pn,ps,tp,tr){
	var td_btime = $("#begintime").val();
	var td_etime = $("#endtime").val();
	showInfo(td_btime,td_etime,pn,ps,tp,tr,$("#cname").val());
};
