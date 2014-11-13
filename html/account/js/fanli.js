var iopertypes=["","购彩返点","认购返点","追号返点","转出","提款"];
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
		
		showInfo($("#begintime").val(),$("#endtime").val(),"",pn,ps,tp,tr);		
		 yongjin(Y.getDate($("#begintime").val()).format("YY-MM-DD"),Y.getDate($("#endtime").val()).format("YY-MM-DD"));
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
			$("#begintime").val(d_s.format("YY-M-D"));
			$("#endtime").val(d_e.format("YY-M-D"));
			ESONCalendar.init().bind("begintime").bind("endtime").splitChar="-";
			showInfo($("#begintime").val(),$("#endtime").val(),"",pn,ps,tp,tr);		
			yongjin(Y.getDate($("#begintime").val()).format("YY-MM-DD"),Y.getDate($("#endtime").val()).format("YY-MM-DD"));
		}
	});
};





var showInfo = function(stime,etime,tid,pn,ps,tp,tr){
	var data = "";
	tp=0;
	
	data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	data += "&newValue="+encodeURIComponent(tid);
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	
	$("#showdatalist").html("");
	var html = "";
	
	Y.ajax({
		url : $_user.url.agentxl,
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
						var cadddate = rt.cadddate;
						var cagentid = rt.cagentid;
						var cbuyid = rt.cbuyid;
						var cdetailid = rt.cdetailid;
						var cgameid = rt.cgameid;
						var cmemo = rt.cmemo;
						var cnickid = rt.cnickid;	
						var cperiodid = rt.cperiodid;
						var cprojid = rt.cprojid;
						var czhid = rt.czhid;
						var ichargeid = rt.ichargeid;
						var imoney = rt.imoney;
						var iopertype = rt.iopertype;
						var irate = rt.irate;
						var itype = rt.itype;
						var rec = rt.rec;
						
						var cl=o%2==0?"":"odd"
							html += "<tr class="+cl+">";
						html += "<td>" + $_sys.getlotname(cgameid)  + "</td>";
						html += "<td>" + cperiodid + "</td>";
						html += "<td>" + parseFloat(imoney).rmb(false) + "</td>";
						html += "<td>" + cnickid + "</td>";
						html += "<td>" + iopertypes[iopertype] + "</td>";
						html += "<td>" + cadddate + "</td>";						
						if(iopertype=="1" || iopertype=="2"){
							html += "<td><A href=\""+$_sys.getlotdir(cgameid)+$_sys.url.viewpath+"?lotid="+cgameid+"&projid="+cprojid+"\" class=\"a1\" target=_blank>查看</A> </td>";
						}else if(iopertype=="3"){
							html += "<td>追号</td>";
						}else{
							html += "<td>-</td>";
						}			
						html += "</tr>";
					});
				}
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


//分页调用 
function takeShow(pn,ps,tp,tr){
	var td_btime = $("#begintime").val();
	var td_etime = $("#endtime").val();
	showInfo(td_btime,td_etime,$("#cname").val(),pn,ps,tp,tr);
};

//转款

var yongjin = function(stime,etime){
	var data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	Y.ajax({
	url : "/phpu/q.phpx?fid=u_agentxl",
	type : "POST",
	dataType : "json",
	data : data,
	end : function(d) {
	var obj = eval("(" + d.text + ")");
	var code = obj.Resp.code;
	if (code == "0") {
	var r = obj.Resp.row;
	$("#totalyj").html(r.num);
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