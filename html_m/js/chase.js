chase = function(pn){
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
	var qtype = $("#type").val();
	var data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "=" + etime;
	var url = $_user.url.chase;
	if (gid != undefined && gid.length > 0) {
		data += "&" + $_user.key.gid + "=" + gid;
		url = $_user.url.gchase;
	}
	if (qtype!="2"&&gid != undefined){
		data += "&" + $_user.key.qtype + "=" + qtype;
	}
	data += "&" + $_user.key.pn + "=" + pn;
	data += "&" + $_user.key.ps + "=" + ps;
	data += "&" + $_user.key.tp + "=" + tp;
	data += "&" + $_user.key.tr + "=" + tr;
	$("#div_nodata").hide();
	$("#div_nodata").hide();
	$("#page").html("");
	$("#tdata").html("");
	$.ajax({
		url : url,
		type : "POST",
		dataType:'json',
		data : data,
		success:function (d){
			var code = d.Resp.code;
			if(code == 0){
				if(d.Resp.count.rc == 0){
					$("#div_nodata").show();
				} else {
					var rs = d.Resp.row;
					if(!isArray(rs)){rs = new Array(rs);}
					var data = [];
					$.each(rs,function(i,r) {
						var zhid = r.zhid;
						var gameid = r.gameid;
						var pnums = r.pnums;
						var success = r.success;
						var failure = r.failure;
						var adddate = r.adddate;
						var adate = adddate.substring(5,16);
						var zhflag = r.zhflag;
						var finish = r.finish;
						
						var html ="<tr onclick=\"location.href='/user/xchase.html?tid="+zhid+"&lotid=" + gameid+"'\" class='list'>";
						html +="<td><font color=green>"+$_sys.getlotname(gameid,1)+"</font>&nbsp;&nbsp;追号编号："+zhid+"<br>" +
								"发起时间："+adate + "<br>" +
								"总"+pnums+"期&nbsp;已完成：<font color=blue>"+success+"</font>&nbsp;已撤销："+failure+"<br>" +
								"状态：" + (finish == 1 ? "已完成" : "进行中") + "&nbsp;&nbsp;类型：" + ZHTYPE[parseInt(zhflag)] + "</td>";
						html +="<td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
						data.push(html);
					});
					$("#tdata").html(data.join(""));
					$("#page").html(pages(d.Resp.count.pn,d.Resp.count.ps,d.Resp.count.tp,d.Resp.count.rc));
					$("#div_data").show();
				}
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
    chase(1);
	$("#btnsearch").click(function(){
		chase(1);
	});
});