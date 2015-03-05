$(document).ready(function() {
	chklogin("account");
	sresult();
	
});
function sresult(){
	var result = location.search.getParam('result');
	var code = location.search.getParam('code');
	if(result == "idcard"){
		if(code == "0"){
			$("#div2").show();
			Getsqq();
		}
	}else if(result =="code"){
		$("#div1").show();
	}else if(result =="zhuce"){
		$("#div3").show();
	}else if(result =="phone"){
		if(code == "0"){
			$("#div4").show();
			Getsqq();
		}
		
	}else if(result =="bdbank"){
		$("#div5").show();
	}else if(result =="tikuan"){
		$("#div6").show();
	}else if(result =="reg"){
		$("#div7").show();
		$("#bottonAn").html("实名绑定送一注双色球")
//		setTimeout("location.href='/'",4000);
	}
	/*if(code == "0"){
		
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
	}*/
}
function Getsqq(result){
//	if()
	$.ajax({
	     url:'/phpu/p.phpx?fid=hd_scp',
	     type : "POST",
			dataType : "json",
	     success :function (xml){
	    	 var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
	    	
	    	  
		       if(code== "0"){
		    	 if(result=="idcard"){
		    		 $("#div4 s").html("恭喜您成功领取一注双色球");
			    	  $("#div4 .btn-true-re").html("查看记录");
		    	 }else if(result =="phone"){
		    		 $("#div2 s").html("恭喜您成功领取一注双色球");
			    	  $("#div2 .btn-true-re").html("查看记录");
		    	 }
		    	 $("#bottonAn").html("恭喜您成功领取一注双色球");
		      }else if(code=="3"){
		    	  
		    	  $("#div4 s").html("绑定身份证后系统赠送一注双色球");
		    	  $("#div4 .btn-true-re").html("绑定身份证").attr("href","/account/sminfo.html")
		       }else if(code=="2"){
		    	  $("#div2 s").html("绑定手机号后系统赠送一注双色球");
		    	  $("#div2 .btn-true-re").html("绑定手机号").attr("href","/account/mobile.html")
		       }else{
		    	   
		       }
		       
	     }
	   });
}