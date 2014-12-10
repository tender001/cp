rec = function(pn){
	var ps = 10,tp = 0,tr = 0;
	var gid =  $("#gid").val();
	var now= new Date(); 
	var year=now.getFullYear();      
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var sd = $("#sDate").val();
	var date = now.dateadd('d', 0-parseInt(sd));
	var stime = date.format("YY-MM-DD");
	
	var _url = $_user.url.touzhu;
	var data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "=" + etime;
	if (gid != undefined && gid.length > 0) {
		data += "&" + $_user.key.gid + "=" + gid;
		_url = $_user.url.gtouzhu;
	}
	data += "&" + $_user.key.pn + "=" + pn;
	data += "&" + $_user.key.ps + "=" + ps;
	data += "&" + $_user.key.tp + "=" + tp;
	data += "&" + $_user.key.tr + "=" + tr;
			
	$("#div_nodata").hide();
	$("#tdata").html("");
	var html = "";
	$.ajax({
		url : _url,
		type : "POST",
		data : data,
		dataType : "json",
		success:function (d){
			var code = d.Resp.code;
			if(code == "0"){
				var scount = 0;
				var summoney = 0;
				var rs = d.Resp.row;
				if(!isArray(rs)){rs = new Array(rs);}
				$.each(rs, function(o,r){
					var gid = r.gid;
					var projid = r.projid;
					var money = r.money;
					var buydate = r.buydate;	
					var bdate = buydate.substring(5,16);
					var award = r.award;
					var ireturn = r.ireturn;
					var rmoney = r.rmoney;
					
					html +="<tr onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"  class=\"list\">";
					if(rmoney>0){
						html +="<td>"+$_sys.getlotname(gid)+"&nbsp;"+bdate+"<br>"+"<a href=\"#\">"+projid+"</a>"+"&nbsp;￥"+money+"元&nbsp;"+"奖金:<font color=red>"+parseFloat(rmoney).rmb(false)+"</font>元";
						scount++;
						summoney = (parseFloat(rmoney)+summoney);
					}else{
						html +="<td>"+$_sys.getlotname(gid)+"&nbsp;"+bdate+"<br>"+"<a href=\"#\">"+projid+"</a>"+"&nbsp;￥"+money+"元";
					}
					if(ireturn == "2"&& rmoney>0){
						html +="<br>已返奖&nbsp;<a href=\"#\">查看&nbsp;</a></td>";
					} else if(award == "2"){
						html +="<br>已开奖&nbsp;<a href=\"#\">查看&nbsp;</a></td>";
					} else{
						html +="<br>未结算&nbsp;<a href=\"#\">查看&nbsp;</a></td>";
					}
					html +="<td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
				});
				$("#tdata").html(html);
				$("#div_data").show();
				$("#div_nodata").hide();
				$("#count").html(scount);
				$("#summoney").html(summoney.rmb(false,2));
				$("#page").html(pages(d.Resp.count.pn,d.Resp.count.ps,d.Resp.count.tp,d.Resp.count.rc));
				page = rec;
			} else {
				showTips(d.Resp.desc);
			}
		},
		error : function() {
			showTips('网络异常!');
		}
	});
};
$(document).ready(function() {
	chklogin(1);
	rec(1);
	$("#btnsearch").click(function(){
		rec(1);
	});
});