
getStrLen = function(str) {// 含中文的字符串长度
	var len = 0;
	var cnstrCount = 0;
	for ( var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 255)
			cnstrCount = cnstrCount + 1;
	}
	len = str.length + cnstrCount;
	return len;
},
reg = function(){
	var uname = $("#uname").val();
	var pwd = $("#pwd").val();
//	var pwdc = $("#pwdc").val();
	/*var phone = $("#phone").val();*/
//	var email = $("#email").val();
//	var rand = $("#rand").val();
	var check = $("#pbig").attr("checked");
//	var type = $("#type").val();
	var ln = uname.trim();
	var rn = ln.replace(/[\d\w\u4e00-\u9fa5]/gi, "");
	if(!check){
   	    showTips('请确认您已成年,非成年不能购彩');
        return;
    }
	if(rn !=""){
		$("#uname").focus();
    	showTips('用户名含有非法字符或空格');
    	return;
	}
	if(getStrLen(uname)<4 || getStrLen(uname)>16){
    	$("#uname").focus();
    	showTips('请填写您的用户名,4-16个字符');
        return;
    }
	 if(pwd.length<6 || pwd.length>20){
    	 $("#pwd").focus();
    	 showTips('请设置您的登陆密码,6-20个字符');
         return;
     }
//	 if(pwd != pwdc){
//    	 $("#pwdc").focus();
//    	 showTips('两次输入的密码不一致,请确认');
//         return;
//     }
	 /*if(!isPhone($.trim(phone)) && type == 0){
    	 showTips('对不起，请输入正确的手机号码');
         return;
     }*/
//	 if(!isEmail($.trim(email)) && type == 1){
//    	 showTips('对不起，请输入正确的邮箱地址');
//         return;
//     }

	 var data = $_user.key.uid + "=" + encodeURIComponent($.trim(uname)) + "&"
		+ $_user.key.pwd + "=" + encodeURIComponent($.trim(pwd)) + "&"
		//+ $_user.key.mobileNo + "=" + encodeURIComponent($.trim(phone)) + "&"
		+ $_user.key.mailAddr + "=" + encodeURIComponent("LotteryDefaultMail@159.com");
     $.ajax({
 		data: data,
 		type: 'POST',
 		dataType:'json',
 		url: $_user.url.regnoyzm,
 		success:function (d){
 			var code = d.Resp.code;
 			var desc = d.Resp.desc;
 			if (code == "0"){
 				location.href="/account/showresult.html?result=reg";
 			}else{
 				showTips(desc);
 			}
			$("#uname").val("");
			$("#pwd").val("");
			$("#pwdc").val("");
 		},
 		error:function(){
 			showTips('网络异常');
 		}
     });
};

$(document).ready(function(){
	$("#tomail").click(function(){
		$("#tphone").hide();
		$("#goemail").hide();
		$("#temail").show();
		$("#gophone").show();
		$("#type").val(1);
	});
	/*$("#tophone").click(function(){
		$("#temail").hide();
		$("#gophone").hide();
		//$("#tphone").show();
		$("#goemail").show();
		$("#type").val(0);
	});*/

	$("#btnreg").click(function(){
		reg();
	});
});