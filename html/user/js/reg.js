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

	var regsuc = function(uname) {
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
	};

});
 
function onfocuss(e) {

	$("#"+e+"").css('display','block');
	
}




