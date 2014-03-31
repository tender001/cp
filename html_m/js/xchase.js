zcancel = function(did){
	var gid = location.search.getParam('lotid');
	var zhid = location.search.getParam('tid');
	var data = {
			gid:gid,
			zid:zhid,
			did:did
	};
	$.ajax({
		url : $_trade.url.zcancel,
		type : "POST",
		data : data,
		dataType : "json",
		success : function(d) {
			var code = d.Resp.code;
			if (code == 0) {
				showTips("取消追号成功",function(){
					setTimeout(function(){
						window.location.reload();
					}, 1000);
				});
			} else {
				showTips(d.Resp.desc);
			}
		},
		error : function() {
			showTips('网络异常!');
		}
	});
};
xchase = function(){
	var gid = location.search.getParam('lotid');
	var zhid = location.search.getParam('tid');
	$.ajax({
		url:'/phpu/q.phpx?fid=q_u_xzh',
		data: "gid=" +gid+ "&tid="+zhid,
		type:'POST',
		dataType:'json',
		success:function(d){
			var code = d.Resp.code;
			if(code == 0){
				var r = d.Resp.row;
				$("#gname").html($_sys.getlotname(gid,1));
				$("#adate").html(r.adddate);
				$("#zhid").html(r.zhid);
				$("#ztotal").html(r.pnums);
				$("#zfinish").html(r.success);
				$("#zfailure").html(r.failure);
				$("#zhstate").html(r.finish == 1 ? "已完成" : "进行中");
				$("#ztype").html(ZHTYPE[parseInt(r.zhflag)]);
				$("#tmoney").html(r.tmoney);
				$("#tbonus").html(r.bonus);
			} else {
				showTips(d.Resp.desc);
			}
		},
		error : function() {
			showTips('网络异常!');
		}
	});
	
	$.ajax({
		url:$_user.url.xchase,
		data: "gid=" +gid+ "&tid="+zhid,
		type:'POST',
		dataType:'json',
		success:function(d){
			var code = d.Resp.code;
			if(code == 0){
				var rs = d.Resp.row;
				if(!isArray(rs)){rs = new Array(rs);}
				var arr = [];
				$.each(rs,function(i,r){
					if(i == 0){
						if(gid == 1 || gid == 7 || gid == 50 || gid == 51 || gid == 52){
							$("#zcode").html(showszccode(gid, r.ccodes, 0));
						} else if(gid == 3 || gid == 53 || gid == 05 || gid == 54){
							$("#zcode").html(showszccode(gid, r.ccodes, 1));
						}
					}
					var istate = r.istate;
					var html ="<tr class=\"list\">";
					html +="<td>期号："+r.cperiodid+"&nbsp;投注金额：<font color='blue'>￥"+r.icmoney+"元</font><br>" +
							"状态：<font color='green'>";
					if (istate == 0) {
						html +="未投注";
					} else if (istate == 1) {
						html +="投注中";
					} else if (istate == 2) {
						if(r.isreturn == 0){
							html +="已投注";
						} else if(r.isreturn == 1){
							html +="返奖中";
						} else if(r.isreturn == 2){
							if(r.iamoney == 0){
								html +="未中奖";
							} else {
								html +="已中奖&nbsp;奖金:"+parseFloat(r.iamoney).rmb(false);
							}
						}
					} else if (istate == 3 || istate == 5) {
						html +="系统撤销";
					} else if (istate == 4) {
						html +="用户撤销";
					}
					html += "</font> ";
					if(istate == 0 ){
						html +="&nbsp;&nbsp;<a href=\"#\" onclick=\"zcancel("+r.idetailid+")\">撤销</a>";
					}
					if(r.iaward == 2 && r.cawardcode.length>0){
						html +="<br>开奖号码："+r.cawardcode;
					}
					html +="</td></tr>";
					arr.push(html);
				});
				$("#tdata").html(arr.join(""));
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
    chklogin(function(d){
	    var code = d.Resp.code;
	    if(code == 0){
	    	UserInfo();
	    	xchase();
	    } else {
	    	showLogin();
	    }
    });
});