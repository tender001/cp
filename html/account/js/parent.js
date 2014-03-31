
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
		var ps=$("input[name='pages']:checked").val();//页面大小
		var tp = 0;//总页数
		var tr = 0;//总记录数
		
		showInfo($("#begintime").val(),$("#endtime").val(),pn,ps,tp,tr,$("#cname").val());
		xiaoliang($("#begintime").val(),$("#endtime").val(),$("#cname").val());
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
					xiaoliang($("#begintime").val(),$("#endtime").val());
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
};

var xiaoliang = function(stime,etime,uid){
	var data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	if(uid != "" &&!(uid===undefined)){
		data +="&"+$_user.key.uid+"="+uid
	}
	Y.ajax({
		url : "/phpu/q.phpx?fid=u_agentsales",
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
			if (code == "0") {
				var r = obj.Resp.row;
				$("#totalxl").html(r.s);
			} else {
				if (code=="1"){
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}
			}
		},
		error : function() {
			return false;
		}
	});
};

var showInfo = function(stime,etime,pn,ps,tp,tr,owner){
	var data = "";
	tp=0;

	
	data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	data += "&owner="+owner;
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	
	$("#showdatalist").html("");
	var html = "";
	
	Y.ajax({
		url : $_user.url.agent,
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
					r.each(function(rt,o){
						var rec = rt.rec;
						var cnickid = rt.cnickid;
						var cadddate = rt.cadddate;
						var cactivedate = rt.cactivedate;
						var cagentid = rt.cagentid;
						var idaigou = Y.getInt(rt.idaigou);
						var ihemai = Y.getInt(rt.ihemai);
						var izhuihao = Y.getInt(rt.izhuihao);
						var ijoin = Y.getInt(rt.ijoin);
						var ibalance = rt.ibalance;
						var daili = rt.daili;
						var cidcard = rt.cidcard;
						var ty="用户";
						var shezhi="<a href=\"javascript:void(0);\" class=\"a1\" onclick=\"fandian('" + cnickid + "')\">设置</a>";
						if($("#caid").val()!=cagentid){
							i++;
							if(daili=="1"){ty="代理";d++;}else{ty="VIP";}
						}else if($("#nid").val()==cnickid){
							ty="自己";
							shezhi="--";
						}else{
							j++;
							if(cidcard==""){shezhi="未实名";}
						}
						var cl=o%2==0?"":"odd"
							html += "<tr class="+cl+">";
						html += "<td>" + rec + "</td>";
						html += "<td>" + cnickid + "</td>";
						html += "<td>" + cadddate + "</td>";
						html += "<td>" + cactivedate + "</td>";
						html += "<td>" + ty + "</td>";
						html += "<td>" + Y.getInt(idaigou+ihemai+izhuihao+ijoin) + "</td>";
						html += "<td>" + ibalance + "</td>";
						html += "<td>" + shezhi + "</td>";
						html += "</tr>";
					});
				}
				
				$("#atj").html("当前页代理："+d+" 人&nbsp;&nbsp;&nbsp;&nbsp;当前页VIP："+i+" 人&nbsp;&nbsp;&nbsp;&nbsp;当前页普通用户："+j+" 人");
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
