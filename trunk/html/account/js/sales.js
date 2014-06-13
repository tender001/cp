
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
		 xiaoliang($("#begintime").val(),$("#endtime").val());
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
			 xiaoliang($("#begintime").val(),$("#endtime").val());
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

};

var xiaoliang = function(stime,etime){
	var data = $_user.key.stime+"=" + Y.getDate(stime).format("YY-MM-DD") + "&"+$_user.key.etime+"=" + Y.getDate(etime).format("YY-MM-DD");
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
	$("#totalxls").html("￥"+r.s);
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
	data = $_user.key.stime+"=" + Y.getDate(stime).format("YY-MM-DD") + "&"+$_user.key.etime+"=" + Y.getDate(etime).format("YY-MM-DD");
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	$("#showdatalist").html("");
	var html = "";
	Y.ajax({
	url : "/phpu/qp.phpx?fid=u_agentsales",
	type : "POST",
	dataType : "json",
	data : data,
	end : function(d) {
	var obj = eval("(" + d.text + ")");
	var code = obj.Resp.code;
	var desc = obj.Resp.desc;
	var innum=incount=outnum=outcount=0; 
	rows = "";
	var total=0;
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
	$("#pagedivs").hide();
	html+="<tr><td colspan='9'>暂时没有您的信息！</td></tr>";

	}else{
	if(!this.isArray(r)){r=new Array(r);}
	r.each(function(rt,o){
	var rec = rt.rec;
	var cnickid = rt.cnickid;
	var cparentid = rt.cparentid;
	var cstatday = rt.cstatday;
	var isales = rt.isales;
	html += "<tr>";
	html += "<td>" + rec + "</td>";
	html += "<td>" + cnickid + "</td>";
	html += "<td>" + cparentid + "</td>";
	html += "<td>" + cstatday + "</td>";
	html += "<td class='red_thick'>￥" + parseFloat(isales).rmb(false) + "</td>";
	html += "</tr>";
	$("#totalxl").html(total);
	});
	}
	} else {
	if (code=="1"){
	parent.window.Y.postMsg('msg_login', function() {
	window.location.reload();
	});
	}else{
	html+="<tr><td colspan='8'>暂时没有您的信息！</td></tr>";

	$("#pagedivs").hide();
	}
	}
	$("#showdatalist").html(html);
	$("#pagedivs").html(getpage(pn,ps,tp,tr,"takeShow"));
	$("#pagedivs").show();
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
