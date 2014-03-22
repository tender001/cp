var iopertypes=["","购彩返点","认购返点","追号返点","转出","提款"];
$(function(){
	loadSI();	
	
	//查询
	$("#td_submit").click(function(){
		var pn=1;//页码
		var ps=$("input[name='pages']:checked").val();//页面大小
		var tp = 0;//总页数
		var tr = 0;//总记录数
		
		showInfo($("#begintime").val(),$("#endtime").val(),$("#cname").val(),pn,ps,tp,tr);		
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
				var vmoney=parseFloat(r.vmoney).rmb();
				
				if(isagent==1){
					$("#td_fanmoney").html(vmoney);
					$("#td_zhuangkuan").click(function(){
						Y.confirm("代理商账户余额将全部转入购彩账户，确定要转款吗？",function(){gozk();},'',1);
					});
					
					showInfo($("#begintime").val(),$("#endtime").val(),$("#cname").val(),pn,ps,tp,tr);					
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
var gozk = function() {
	Y.ajax({
		url : "/phpu/vtf.phpx",
		type : "POST",
		dataType : "json",
		end : function(d) {
			var obj = eval("(" + d.text + ")");			
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;   
			Y.alert(desc, function() {
				location.reload();
			}, false, true);
		},
		error : function() {
			Y.alert("您所请求的页面有异常！", 0, 0, 1);
			return false;
		}
	});
};