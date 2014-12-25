rec = function(pn){
	var ps = 100,tp = 0,tr = 0;
	var gid =  $("#gid").val();
	var now= new Date(); 
	var year=now.getFullYear();      
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var sd =30;
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
	$("#betlist").html("");
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
				if(rs===undefined){
					html ='暂时没有您的投注记录'
				}else{
				if(!isArray(rs)){rs = new Array(rs);}
				$.each(rs, function(o,r){
					var gid = r.gid;
					var projid = r.projid;
					var money = r.money;
					var buydate = r.buydate;	
					var bdate = buydate.substring(5,10);
					var award = r.award;
					var cancel =r.cancel;
					var ireturn = r.ireturn;
					var rmoney = r.rmoney;
					
				
					html +="<li class=\"ico-click\" onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"><i></i>";
				
					if (cancel==0){
						if (ireturn==2){
							if (rmoney>0){
								html +=" <span class=\"state red\">已中奖";
							}else{
								html += "<span class=\"state\">未中奖";
							}						
						}else{
							html +="<span class=\"state\"> 未结算";
						}
					}else if (cancel==1){
						html +=" <span class=\"state\">本人撤单";
					}else if (cancel==2){
						html +=" <span class=\"state\">系统撤单";
					}
					if (rmoney > 0) {
						html +=parseFloat(rmoney).rmb();
					} else {
						html +="";
					}
					
					
		
					html +="</span> <p><b>"+$_sys.getlotname(gid)+"</b><span><em class=\"money\">"+bdate+"</em>"+money+"元</span></p> </li>";
				});
			}
				$("#betlist").html(html);
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
keeprec=function(pn){

	var ps = 100,tp = 0,tr = 0;
	var gid =  $("#gid").val();
	var now= new Date(); 
	var year=now.getFullYear();      
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var sd = 30;
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
	$("#betlist").html("");
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
					var data = [];
					if(rs===undefined){
						data ='暂时没有您的追号记录'
					}else{
					if(!isArray(rs)){rs = new Array(rs);}
					
					$.each(rs,function(i,r) {
						var zhid = r.zhid;
						var gameid = r.gameid;
						var pnums = r.pnums;
						var success = r.success;
						var failure = r.failure;
						var adddate = r.adddate;
						var adate = adddate.substring(5,10);
						var zhflag = r.zhflag;
						var finish = r.finish;
						var tmoney = r.tmoney;
			
						var html ="<li class=\"ico-click\" onclick=\"location.href='/account/xchase.html?tid="+zhid+"&lotid=" + gameid+"'\" ><i></i>";
						html +="<span class=\"state\">" + (finish == 1 ? "已完成" : "进行中") + ""
						
						html +="</span> <p><b>"+$_sys.getlotname(gameid,1)+"</b><span><em class=\"money\">"+adate+"</em>"+tmoney+"元</span></p> </li>";
						
//						html +="<font color=green>"+$_sys.getlotname(gameid,1)+"</font>&nbsp;&nbsp;追号编号："+zhid+"<br>" +
//								"发起时间："+adate + "<br>" +
//								"总"+pnums+"期&nbsp;已完成：<font color=blue>"+success+"</font>&nbsp;已撤销："+failure+"<br>" +
//								"状态：" + (finish == 1 ? "已完成" : "进行中") + "&nbsp;&nbsp;类型：" + ZHTYPE[parseInt(zhflag)] + "";
//						html +="</li>";
						data.push(html);
					});
					}
					$("#betlist").html(data.join(""));
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

}
acc = function(pn){
	var ps = 50,tp = 0,tr = 0;
//	var tid =  $("#dtype").val();
	var now= new Date(); 
	var year=now.getFullYear();      
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var sd = 7;
	var date = now.dateadd('d', 0-parseInt(sd));
	var stime = date.format("YY-MM-DD");
	var data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;
//	if (tid != "-1"){
//		data += "&tid="+tid; 
//	}
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
		
	var html = "";
	$("#betlist").html("");
	$.ajax({
		url : $_user.url.account,
		type : "POST",
		dataType : "json",
		data : data,
		success : function(d) {
			var code = d.Resp.code;
			if (code == "0") {
				var r = d.Resp.row;
				if(r===undefined){
					html ='暂时没有您的交易记录'
				}else{
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
						str = "<cite style='color:green'>收入"+parseFloat(imoney).rmb(false)+"元</cite>";
					}else{
						str = "<cite >支出"+parseFloat(imoney).rmb(false)+"元</cite>";
					}
//					<li class="ico-click"><i></i>
//
//		            <p><cite>支出100元</cite><b>竞彩足球</b><span><em class="money">11月26日</em>余额8.00元</span></p>
//		        </li>
					if(ibiztype =="200"||ibiztype =="300"){
						html +="<li class=\"ico-click\"><p>"+str+"<b>余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元</b>" +
								"<span><em class=\"money\">"+$_sys.biztype(ibiztype)+"</em>"+ichargeid+"</span></p></li>";
//						html +="<td>"+idate+"<br>";
//						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;<br>";
//						html +=$_sys.biztype(ibiztype);
//						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
//						html +="</td></tr>";
					}else if(ibiztype =="104"||ibiztype =="99"){
//						html +="<tr class=\"list\">";
//						html +="<td>"+idate+"<br>";
//						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
//						html +=$_sys.biztype(ibiztype);
//						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
//						html +="</td></tr>";
						html +="<li class=\"ico-click\"><p>"+str+"<b>余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元</b>" +
						"<span><em class=\"money\">"+$_sys.biztype(ibiztype)+"</em>"+ichargeid+"</span></p></li>";
					}else if(ibiztype =="201"||ibiztype =="202"||ibiztype =="203"||ibiztype =="211"||ibiztype =="215"){
//						html +="<tr onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"  class=\"list\">";
//						html +="<td>"+idate+"<br>";
//						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
//						html +=$_sys.biztype(ibiztype);
//						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
//						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
						html +="<li class=\"ico-click\" onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"><i></i><p>"+str+"<b>余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元</b>" +
						"<span><em class=\"money\">"+$_sys.biztype(ibiztype)+"</em>"+ichargeid+"</span></p></li>";
					}else if(ibiztype=="102"){
//						html +="<tr class=\"list\">";
//						html +="<td>"+idate+"<br>";
//						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
//						html +=$_sys.biztype(ibiztype);
//						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
//						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
						html +="<li class=\"ico-click\"><i></i><p>"+str+"<b>余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元</b>" +
						"<span><em class=\"money\">"+$_sys.biztype(ibiztype)+"</em>"+ichargeid+"</span></p></li>";
					}else{
//						html +="<tr onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"  class=\"list\">";
//						html +="<td>"+idate+"<br>";
//						html +=str+"<font color=blue>"+parseFloat(imoney).rmb(false)+"</font>元&nbsp;余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元<br>";
//						html +=$_sys.biztype(ibiztype);
//						html +="&nbsp;<font color=green>"+ichargeid+"</font>";
//						html +="</td><td class=\"arrow\"><img src=\'/images/arrow.gif\' /></td></tr>";
						html +="<li class=\"ico-click\" onclick=\"location.href=\'/user/project.html?lotid="+gid+"&projid="+projid+"\'\"><i></i><p>"+str+"<b>余额<font color=red>"+parseFloat(ibalance).rmb(false)+"</font>元</b>" +
						"<span><em class=\"money\">"+$_sys.biztype(ibiztype)+"</em>"+ichargeid+"</span></p></li>";
					}
				});
				}
				$("#betlist").html(html);
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
function showMS(ms,url) {
    $("#divshowprebuy").html("<div class=\"alert\"><div class=\"alert-tips\"><h2>温馨提示</h2><p>" + ms + "</p><div class=\"alert-btn\" onclick='showBuyMini(2,\""+url+"\")'>确定</div></div></div>");
//    $("#divshowprebuy").css({
//        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
//        'left': "0px",
//    });
    $(".alert-tips").css({
        "margin-top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
       
    });
    showBuyMini(1);
//    setTimeout(function() { showBuyMini(2); }, (6 * 1000));
}


//是否显示提示窗口
function showBuyMini(kind,url) {
    if (kind == 1) {
        $("#divshowprebuy").show();
        $("#divDisable").css({
            "height": $("#caseForm").height() + 110 + "px",
            "display": "block"
        });
        var overlayID = "_t_overlay";
        if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
        $('.overlay').css({ 'height': ($("body").height()) + 'px', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();
    }
    else {
        $("#divshowprebuy").hide();
        $("#divDisable,.overlay").hide();
        $("#divshowprebuy").html("");
        location.href=url;
    }
}
$(document).ready(function() {
	chklogin("account");
	rec(1);
	$("#btnsearch").click(function(){
		rec(1);
	});
	$("#rec").click(function(){
		rec(1);
		$(this).addClass("cur");
		$("#keeprec,#detail").removeClass("cur");
	});
	$("#keeprec").click(function(){
		keeprec(1);
		$(this).addClass("cur");
		$("#rec,#detail").removeClass("cur");
	});
	$("#detail").click(function(){
		acc(1);
		$(this).addClass("cur");
		$("#rec,#keeprec").removeClass("cur");
	});
	$("#tikuan").click(function(){
		 $.ajax({
			 url : $_user.url.safe,
	        dataType:'json',
	        success:function (d){
	        	var code = d.Resp.code;
	        	if(code == 0){
		        	var r = d.Resp.row;
					var name = r.rname;
					var card = r.bank;
					if(name==""){
						showMS("请先绑定身份证信息","/account/sminfo.html")
					}else if(card==""){
						showMS("请先添加一张银行","/account/bankinfo.html");
					}else{
						location.href="/account/draw.html";
					}
				  
	        	} else {
	        		showTips(d.Resp.desc);
	        	}
	        },
	        error:function(){
	     	   showTips('网络故障!');
	     	   return false;
	        }
		 });
	})
	
});