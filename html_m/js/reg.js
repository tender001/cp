rad = function(){
	$("#rad").attr("src","/rand.phpx?_="+(+new Date));
	return true;
},
reg = function(){
	var uname = $("#uname").val();
	var pwd = $("#pwd").val();
	var pwdc = $("#pwdc").val();
	var phone = $("#phone").val();
	var email = $("#email").val();
	var rand = $("#rand").val();
	var check = $("#pbig").attr("checked");
	var type = $("#type").val();
	if(!check){
   	    showTips('请确认您已成年,非成年不能购彩');
        return;
    }
	if(uname.length<4 || uname.length>16){
    	$("#uname").focus();
    	showTips('请填写您的用户名,4-16个字符');
        return;
    }
	 if(pwd.length<6 || pwd.length>20){
    	 $("#pwd").focus();
    	 showTips('请设置您的登陆密码,6-20个字符');
         return;
     }
	 if(pwd != pwdc){
    	 $("#pwdc").focus();
    	 showTips('两次输入的密码不一致,请确认');
         return;
     }
	 if(!isPhone($.trim(phone)) && type == 0){
    	 showTips('对不起，请输入正确的手机号码');
         return;
     }
	 if(!isEmail($.trim(email)) && type == 1){
    	 showTips('对不起，请输入正确的邮箱地址');
         return;
     }
	 if(rand.length != 4){
    	 $("#rand").focus();
    	 showTips('请输入正确的验证码!');
         return;
     }
	 var data = $_user.key.uid + "=" + encodeURIComponent($.trim(uname)) + "&"
		+ $_user.key.pwd + "=" + encodeURIComponent($.trim(pwd)) + "&"
		+ $_user.key.mobileNo + "=" + encodeURIComponent($.trim(phone)) + "&"
		+ $_user.key.mailAddr + "=" + encodeURIComponent($.trim(email)) + "&"
		+ "yzm=" + rand;
     $.ajax({
 		data: data,
 		type: 'POST',
 		dataType:'json',
 		url: $_user.url.register,
 		success:function (d){
 			var code = d.Resp.code;
 			var desc = d.Resp.desc;
 			if (code == "0"){
 				location.href="/user/result.html?to=reg";
 			}else{
 				showTips(desc);
 			}
			$("#uname").val("");
			$("#pwd").val("");
			$("#pwdc").val("");
			$("#phone").val("");
			$("#email").val("");
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
	$("#tophone").click(function(){
		$("#temail").hide();
		$("#gophone").hide();
		$("#tphone").show();
		$("#goemail").show();
		$("#type").val(0);
	});
	$("#rad").click(function(){
		rad();
	});
	$("#btnreg").click(function(){
		reg();
	});
});