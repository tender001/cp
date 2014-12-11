var refreshVerify=function (){
	$("#CheckCode").attr('src',"/rand.phpx?rnd="+Math.random()).val("");
//刷新验证码时清空文本框
	$("#verifycode").val("");
//刷新验证码时隐藏提示信息
	$("#reg,#rege").hide();
};

//控制显示DIV
var show=function(a) {
	$("#email").val("");
	$("#phone").val("");
    if(a=="1"){
    	$("#show2").hide();
    	$("#show22").hide();
    	$("#show1").show();
    	$("#show11").show();
    }else{
    	$("#show1").hide();
    	$("#show11").hide();
    	$("#show2").show();
    	$("#show22").show();
    }
};	

$(function() {
	var showErr = function(input, msg) {
		$('#' + input + '_err').html("<span class='regws' id='rege'>"+msg+"</span>");
		return false;
	};
	regsuc();
	var showOK = function(input) {
		$('#' + input + '_err').html("<span class='regrs' id='reg'></span>");
		return true;
	};
	var inputs = [ 'username', 'password', 'password2','verifycode'];

	var _status = {};
	var len = inputs.length;
	for ( var i = 0; i < len; i++) {
		_status[inputs[i]] = false;
	}

	$("#username").bind(
			{
				blur : function() {
					var ln = $.trim($(this).val());

					var len = $_base_s.getStrLen(ln);
					if (len < 4) {
						return showErr('username', '用户名至少为4个字符');
					} else if (len > 16) {
						
						return showErr('username', '用户名不超过16个字符');
					}
					
					var rn = ln.replace(/[\d\w\\u4e00-\u9fa5]/gi, "");
					if (rn != "") {
						return showErr('username', '用户名含有非法字符');
					}
					
					$.ajax({
						url : $_user.url.q,
						type : "POST",
						dataType : "json",
						data : $_user.key.fid+"=u_check_user&"+$_user.key.uid + "=" + encodeURIComponent(ln)
								+ "&rnd=" + Math.random(),
						success : function(data) {
							var code = data.Resp.code;
							var nid = typeof (data.Resp.row) == "undefined"?"-":"ok";
							if (code=="0") {
								return showErr('username', "用户名已存在");
							} else if (code=="1000"){
								return showErr('username', "用户名含有特殊字符");
							}else if (code=="9000"){
								_status['username'] = true;
								return showOK('username');
							}
						}
					});
				}
			});

	$("#password").bind({
		blur : function() {
			var pwd = $.trim($(this).val());
			var len = pwd.length;
			if (len == 0) {
				return showErr('password', '请输入密码');
			} else if (len < 6) {
				return showErr('password', '密码至少6位');
			} else if (len > 20) {
				return showErr('password', '密码不能超过15位');
			} else if (pwd == $.trim($("#username").val())) {
				return showErr('password', '密码不能与用户名一致');
			}
			var cat = /^[\x20-\x7f]+$/;
			if (!(cat.test(pwd))) {
				return showErr('password', '密码请勿包含中文');
			}
			_status['password'] = true;
			showOK('password');
		}
	});

	$("#password2").bind({
		blur : function() {
			var pwd = $.trim($("#password").val());
			var pwd2 = $.trim($(this).val());
			if (pwd2 == '') {
				return showErr('password2', '再次确认您的密码');
			}
			if (pwd2 != pwd) {
				return showErr('password2', '两次密码不一致');
			} else {
				_status['password2'] = true;
				return showOK('password2');
			}
		}
	});

	$("#email").bind({
		blur : function() {
			var email = $("#email").val();
			if(!isEmailOk(email)){
				return showErr('email', '请输入正确邮箱地址');
			}
			_status['email'] = true;
			return showOK('email');
		}
	});
	
	$("#phone").bind({
		blur : function() {
			var phone = $("#phone").val();
			if(!isPhoneOk(phone)){
				return showErr('phone', '请输入正确的手机号码');
			}
			_status['phone'] = true;
			return showOK('phone');
		}
	});
	
	$("#verifycode").bind({
		blur : function() {
			var verifycode = $.trim($("#verifycode").val());
			var len = verifycode.length;
			if (len == 0){
				return showErr('verifycode','请输入验证码');
			}
			if (len < 4) {
				return showErr('verifycode', '请输入正确的验证码');
			} 
			
			_status['verifycode'] = true;
			return showOK('verifycode');
		}
	});	

	
				$("#subfrm").click(function(){
					
						
						$("#subfrm").attr("disabled", true);
						if (!$("#year18")[0].checked) {
							alert("请确认您是否年满18周岁");
							$("#subfrm").attr("disabled", false);
							return false;
						}
						var len = inputs.length;
						for ( var i = 0; i < len-2; i++) {
							if (!_status[inputs[i]]) {
								$("#" + inputs[i]).blur();
								$("#" + inputs[i]).focus();
								$("#subfrm").attr("disabled", false);
								return false;
							}
						}
						
						if (!_status[inputs[len-2]] && !_status[inputs[len-1]]) {
							$("#" + inputs[len-2]).blur();
							$("#" + inputs[len-2]).focus();
							$("#" + inputs[len-1]).blur();
							$("#" + inputs[len-1]).focus();
							$("#subfrm").attr("disabled", false);
							return false;
						}
//验证两次密码是否一致
						if($("#password").val()==''){
							return showErr('password', '请输入密码');
						}
						if($("#password2").val()==''){
							return showErr('password2', '再次确认您的密码');
						}
						if($("#password2").val() != $("#password").val()){
							return showErr('password2', '两次密码不一致');
						}
						
						$.ajax({
							url : $_user.url.register,
							type : "POST",
							dataType : "json",
							data : $_user.key.fid+"=u_register&"+$_user.key.uid
									+ "="
									+ encodeURIComponent($.trim($("#username")
											.val()))
									+ "&"
									+ $_user.key.pwd
									+ "="
									+ encodeURIComponent($.trim($("#password")
											.val()))+ "&"+ $_user.key.mailAddr
									+ "="
									+ encodeURIComponent($.trim($("#email").val()))+ "&" + $_user.key.mobileNo
									+ "="
									+ encodeURIComponent($.trim($("#phone").val()))
									+ "&yzm=" + encodeURIComponent($.trim($("#verifycode").val()))
									+ "&rnd=" + Math.random(),
							success : function(data) {
								var code = data.Resp.code;
								var desc = data.Resp.desc;
								if (code == "0") {
									regsuc($.trim($("#username").val()));
								} else {
									if($("#verifycode").val() !=$("#CheckCode").val()){
										return showErr('verifycode', '请输入正确的验证码');
									}
									refreshVerify();
									
//									alert(desc);
									$("#subfrm").attr("disabled", false);	
								}
							}
						});
						return false;
				});	

//验证邮箱的有效性
	var isEmailOk=function(email){
		if(email.length>0){
			reg=/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
			if(!reg.test(email)){         
				 return false;
			}else{
				return true;
			}
		}
		return false;
	};
	
	//验证手机号码的有效性
	var isPhoneOk=function(tel){
		var reg = 	/^((13[0-9])|(15[^4,\\d])|(18[0-9])|(14[0-9]))\d{8}$/;
		if(reg.test(tel)){
			return true;
		}
		return false;
	};
	$('#conform_btn').click(function (){
	 		
		if ($.trim($("#smphone").val())==""){
			$("#smerror").html("请输入您的手机号码").parent().show();
			return false;
			
		}
		var Phone = ($("#smphone").val()).replace(/\s+/g,"");
		
		
		var data ="flag=1&newValue=" + Phone+ "&rnd=" + Math.random();
							
		Y.ajax({
			url : $_user.url.bind,
			type : "POST",
			dataType : "json",
			data : data,
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {
					sentYZM(2);
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
						$("#smerror").html("请输入你的 手机号").parent().show();
						return false;
					}else{
						alert(desc);
					}
				}
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});			
	 	});

	

});
function regsuc(uname) {
	$("#main1").hide();
	$("#reguest").hide();
	$("#zcreg").hide();
	$("#loghedm1").hide();
	
	$("#main2").show();
	$("#regsucc").show();
	$("#zcscc").show();
	$("#loghedm2").show();

	$("#regusername").html(uname);
	$("#regusername1").html(uname);
	$("#sucreg").html("["+uname+"]恭喜您注册成功！");
	Y.use('mask', function(){
	var smrz = Y.lib.MaskLay('#regalert', 'div.caitain');
	smrz.addClose('#close1','#cancelNext');//'#smreturn'
    Y.get('#regalert  div.tantop').drag('#regalert');
    smrz.pop();
	});
    $("div.jjmx1 input").click(function(){
    	$("#smerror").parent().hide()
    })
//    Y.get("#smreturn").click(function(){
//    	
//    	smrz.close();
//    })
    Y.get('#smsub').click(function (){
		var reg=/^[\u4e00-\u9fa5]{2,5}$/i; 
		var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/; 
		var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
		var truename=$.trim($("#smname").val());
		var idnumber =$.trim($("#smno").val());
		var smpwd=$.trim($("#smphone").val());
		var smpwd=$.trim($("#smyzm").val());
		
		var cmerror =$("#smerror");
		if (truename==""){
			cmerror.html("请输入您的真实姓名").parent().show();
			return false;
		}
		if(!reg.test(truename)){
			cmerror.html("姓名必须为2到5个汉字").parent().show();
			return false;
		}
		var namelen=truename.length;
		var len=0;
		for(var i=0;i<namelen; i++){
			len +=truename.split(truename[i]).length;
		}
		if(len>namelen*3){
			cmerror.html("请输入您的真实姓名").parent().show();
			return false;
		}
			if (!(isIDCard1.test(idnumber))&&!(isIDCard2.test(idnumber)))
		   {  
		       cmerror.html("身份证输入不合法").parent().show();
		       return  false;  
		   }  
		if (idnumber==""){
			cmerror.html("请输入你的身份证号码").parent().show();
			return false;
		}
		if(smpwd==""){
			cmerror.html("请输入你的手机号").parent().show();
			return false;
		}
		if(smyzm==""){
			cmerror.html("请输入手机验证码").parent().show();
			return false;
		}
//		if(idnumber!= smpwd){
//			cmerror.html("你两次输入的身份证号码不一致").parent().show();
//			return false;
//		}
		
		var data ="flag=1&yzm=" + $.trim($("#smyzm").val())+ "&rnd=" + Math.random();
		
		Y.ajax({
			url : $_user.url.bindyz,
			type : "POST",
			dataType : "json",
			data : data,
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {
					
 	 		    	
				} else {
					$("#conform").attr("disabled", false);
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						alert(desc);
					}
				}
			},
			error : function() {
				$("#conform").attr("disabled", false);
				alert("您所请求的页面有异常！");
				return false;
			}
		});
		Y.ajax({
			url : $_user.modify.name,
			type : "POST",
			dataType : "json",
			data : $_user.key.realName + "=" + encodeURIComponent($.trim($("#smname").val()))
			+ "&" + $_user.key.idCardNo + "=" + encodeURIComponent($.trim($("#smno").val()))
			+ "&" + $_user.key.idCardTwo + "=" + encodeURIComponent($.trim($("#smno").val()))
			+ "&" + $_user.key.upwd + "=" + encodeURIComponent($.trim($("#smpwd").val()))
			+ "&yzm=" + encodeURIComponent($.trim($("#verifycode").val()))
			+ "&rnd=" + Math.random(),
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
				if (code == "0") {	
					smrz.close();
					alert(desc);
				 	/*Y.ajax({
				 	     url:'/phpu/p.phpx?fid=u_hdssq',
				 	     end:function (data){
				 	         if (data.error) {
				 	        	Y.alert(desc);
				 	        	return false;
				 	         }else{
				 	       	   var obj2 = eval("(" + data.text + ")");
				 	       	var  wrapLay = Y.lib.MaskLay('#wrapLay', '#wrapLayConent');
			            	wrapLay.addClose('#wrapLayCloseBtn', '#wrapLayClose');
			                 Y.get('#yclass_alert  div.tantop').drag('#wrapLay');
			               
			 	 		       if(obj2.Resp.code==0){
			 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">恭喜您：<br />已获取3元彩金<a style="color:#145fab;text-decoration:underline" href="/account/myaccount.html" target="_blank" >点击查看</a></div>');
			 	 		    	
			 	 		    	  wrapLay.pop();
			 	 		       }else if(obj2.Resp.code==2){
			 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">已实名<br/>新用户<a  href="/account/mobile.html" target="_blank" style="color:#145fab;text-decoration:underline">绑定手机</a>后系统赠送3元彩金</div>');
			 	 		    	
			 	 		    	  wrapLay.pop();
			 	 		       }else{
			 	 		    	 cmerror.html(desc).parent().show();
			 	 		       }

				 	         }
				 	     }
				 	   });*/
				} else {
					cmerror.html(desc).parent().show();
				}
				P.showinfo();
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});
    });
 
	
};
 
function onfocuss(e) {

	$("#"+e+"").css('display','block');
	
}
function sentYZM(a){

	
	for(var i=1;i<6;i++){
		$("#div"+i).hide();
	}
//	$("#div"+a).show();
	
	if(a==2){
		var wait = 60; //设置秒数(单位秒) 
		for(var i=1;i<=wait;i++) { 
		 window.setTimeout("sTimer("+i+")",i*1000); 
		}
	}

}
function sTimer(num){
	 
	var wait = 60; //设置秒数(单位秒) 
	var secs = 0;
	 if(num==wait)  { 
	  $("#conform_btn").html("重新发送");
	  $("#conform_btn").attr("disabled", false);
	 }else{ 
	  secs=wait-num; 
	  $("#conform_btn").html("重新发送 "+secs);
	 } 

}




