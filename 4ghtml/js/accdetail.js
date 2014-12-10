acc = function(pn){
	var ps = 10,tp = 0,tr = 0;
	var tid =  $("#dtype").val();
	var now= new Date(); 
	var year=now.getFullYear();      
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var sd = $("#sData").val();
	var date = now.dateadd('d', 0-parseInt(sd));
	var stime = date.format("YY-MM-DD");
	var data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
	if (tid != "-1"){
		data += "&tid="+tid; 
	}
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
		
	var html = "";
	$("#accdata").html("");
	$.ajax({
		url : $_user.url.account,
		type : "POST",
		dataType : "json",
		data : data,
		success : function(d) {
			var code = d.Resp.code;
			if (code == "0") {
				var r = d.Resp.row;
				if(!isArray(r)){r = new Array(r);}
				$.each(r, function(o,_r){
					var cadddate = _r.cadddate;
					var imoney = _r.imoney;
					var ibalance = _r.ibalance;
					var ibiztype = _r.ibiztype;
					var ichargeid = _r.ichargeid;
					var cmemo = _r.cmemo;
					var itype = _r.itype;
					var idate = cadddate.substring(5,16);
					var projid = cmemo.split("|")[1];
					var gid = cmemo.split("|")[0];
					var str = "";
					if(itype == "0"){
						str = "<font color='red'><b>收入</b></font>";
					}else{
						str = "<font color='green'><b>支出</b></font>";
					}
					if(ibiztype =="200"||ibiztype =="300"){
						html +="<tr class=\"list\">";
						html +="<td>"+idate+"<br>";
						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
						html +=$_sys.biztype(ibiztype);
						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
						html +="</td></tr>";
					}else if(ibiztype =="104"||ibiztype =="99"){
						html +="<tr class=\"list\">";
						html +="<td>"+idate+"<br>";
						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
						html +=$_sys.biztype(ibiztype);
						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
						html +="</td></tr>";
					}else if(ibiztype =="201"||ibiztype =="202"||ibiztype =="203"||ibiztype =="211"||ibiztype =="215"){
						html +="<tr onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"  class=\"list\">";
						html +="<td>"+idate+"<br>";
						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
						html +=$_sys.biztype(ibiztype);
						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
					}else if(ibiztype=="102"){
						html +="<tr class=\"list\">";
						html +="<td>"+idate+"<br>";
						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
						html +=$_sys.biztype(ibiztype);
						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
					}else{
						html +="<tr onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"  class=\"list\">";
						html +="<td>"+idate+"<br>";
						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
						html +=$_sys.biztype(ibiztype);
						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
					}
				});
				$("#accdata").html(html);
				$("#tdata").show();
				$("#page").html(pages(d.Resp.count.pn,d.Resp.count.ps,d.Resp.count.tp,d.Resp.count.rc));
				page = acc;
			}else{
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
	acc(1);
	$("#btnsearch").click(function(){
		acc(1);
	});
});