function sresult(){
	var result = location.search.getParam('result');
	var code = location.search.getParam('code');
	if(result == "idcard"){
		if(code == "5"){
			$("#div2").show();
		}
	}else if(result =="code"){
		$("#div1").show();
	}else if(result =="zhuce"){
		$("#div3").show();
	}else if(result =="phone"){
		if(code == "0"){
			$("#div4").show();
		}
		
	}else if(result =="bdbank"){
		$("#div5").show();
	}else if(result =="tikuan"){
		$("#div6").show();
	}
	if(code == "0"){
		
		$("#div7").show().html(' 恭喜您：已获取3元彩金<a class="a3" href="/user/account.html" target="_blank" >点击查看</a>');
	}else if(code=="2"){
		$("#div2").show();
		 showTips('已实名,新用户<a class="a3" href="/user/mobilebindingset.html" target="_blank" id="showClose">绑定手机</a>后系统赠送3元彩金');
	}else if(code=="3"){
		$("#div4").show();
	    showTips('手机已绑定,新用户<a class="a3" href="/user/account.html" target="_blank" id="showClose">实名后</a>系统赠送3元彩金');
		
	}else if(code=="4"){
		$("#div4").show();
	    showTips('手机已绑定,新用户<a class="a3" href="/user/idbd.html" target="_blank" id="showClose">实名后</a>系统赠送3元彩金');
	}
}