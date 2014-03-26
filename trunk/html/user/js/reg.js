
var refreshVerify=function (){
	$("#CheckCode").attr('src',"/rand.phpx?rnd="+Math.random());
};

//������ʾDIV
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
		$('#' + input + '_err').html("<span class='regws'>"+msg+"</span>");
		return false;
	};
	var showOK = function(input) {
		$('#' + input + '_err').html("<span class='regrs'></span>");
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
						return showErr('username', '�û�������Ϊ4���ַ�');
					} else if (len > 16) {
						
						return showErr('username', '�û���������16���ַ�');
					}
					
					var rn = ln.replace(/[\d\w\\u4e00-\u9fa5]/gi, "");
					if (rn != "") {
						return showErr('username', '�û������зǷ��ַ�');
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
								return showErr('username', "�û����Ѵ���");
							} else if (code=="1000"){
								return showErr('username', "��ຬ6λ��������");
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
				return showErr('password', '����������');
			} else if (len < 6) {
				return showErr('password', '��������6λ');
			} else if (len > 20) {
				return showErr('password', '���벻�ܳ���15λ');
			} else if (pwd == $.trim($("#username").val())) {
				return showErr('password', '���벻�����û���һ��');
			}
			var cat = /^[\x20-\x7f]+$/;
			if (!(cat.test(pwd))) {
				return showErr('password', '���������������');
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
				return showErr('password2', '�ٴ�ȷ����������');
			}
			if (pwd != pwd2) {
				return showErr('password2', '�������벻һ��');
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
				return showErr('email', '��������ȷ�����ַ');
			}
			_status['email'] = true;
			return showOK('email');
		}
	});
	
	$("#phone").bind({
		blur : function() {
			var phone = $("#phone").val();
			if(!isPhoneOk(phone)){
				return showErr('phone', '��������ȷ���ֻ�����');
			}
			_status['phone'] = true;
			return showOK('phone');
		}
	});
	
	$("#verifycode").bind({
		blur : function() {
			var verifycode = $.trim($("#verifycode").val());
			var len = verifycode.length;
			if (len < 4) {
				return showErr('verifycode', '��������ȷ��֤��');
			} 
			
			_status['verifycode'] = true;
			return showOK('verifycode');
		}
	});	

	
				$("#subfrm").click(function(){
					
						
						$("#subfrm").attr("disabled", true);
						if (!$("#year18")[0].checked) {
							alert("��ȷ�����Ƿ�����18����");
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
											.val())) + "&" + $_user.key.mailAddr
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
									
									refreshVerify();
									
									alert(desc);
									$("#subfrm").attr("disabled", false);
									
								}
							}
						});
						return false;
					
				});
				
			

//��֤�������Ч��
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
	
	//��֤�ֻ��������Ч��
	var isPhoneOk=function(tel){
		var reg = 	/^((13[0-9])|(15[^4,\\d])|(18[0-9])|(14[0-9]))\d{8}$/;
		if(reg.test(tel)){
			return true;
		}
		return false;
	};

	var regsuc = function(uname) {
		$("#main1").hide();
		$("#main2").show();
		$("#regusername").html(uname);
	};

});
 
function onfocuss(e) {

	$("#"+e+"").css('display','block');
	
}




