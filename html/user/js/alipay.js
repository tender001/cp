$(function() {
	var c = [false,false,false,true];
	chk = function(id,f) {
		var cat = /./g;
		var str = $('#' + id).val();
		var sz = str.match(cat);
		for ( var i = 0; i < sz.length; i++) {
			cat = /\d/;
			maths_01 = cat.test(sz[i]);
			cat = /[a-z]/;
			smalls_01 = cat.test(sz[i]);
			cat = /[A-Z]/;
			bigs_01 = cat.test(sz[i]);
			if(f){
				cat = /.*[\u4e00-\u9fa5]+.*$/;
				zh_cn = cat.test(str);
				if (!maths_01 && !smalls_01 && !bigs_01 && !zh_cn) {
					return true;
				}
			}else{
				if (!maths_01 && !smalls_01 && !bigs_01) {
					return true;
				}
			}
		}
		return false;
	};
	
	
	showErr = function(id, msg){
		$("#" + id).html(msg).removeClass().addClass("say_2").show();
	};
	showOK = function(id){
		$("#" + id).html("&nbsp;").removeClass().addClass("say_3").show();
	};
	
	$("#username").blur(function(){
		c[0] = false;
		var uid = $("#username").val();
		var len = $_base_s.getStrLen(uid);
		if(len < 4 || len > 16){
			showErr("username_err", "请输入4-16位用户名！");
			return;
		}
		if(!chk("username", true)){
			$.ajax({
				url : $_user.url.q,
				type : "POST",
				dataType : "json",
				data : $_user.key.fid+"=u_check_user&"+$_user.key.uid + "=" + encodeURIComponent(uid)
						+ "&rnd=" + Math.random(),
				success : function(data) {
					var code = data.Resp.code;
					if (code == "9000") {
						showOK('username_err');
						c[0] = true;
					} else if (code=="0") {
						showErr('username_err', "用户名已存在");
					} else if (code=="1000"){
						showErr('username_err', "最多含6位连续数字");
					}
				}
			});
		}else{
			showErr("username_err", "请输入4-16位用户名,只能为中文,数字，字母！");
		}
	});

	
	$("#password").blur(function(){
			c[1] = false;
			var pwd = $("#password").val();
			if(pwd.length < 6 || pwd.length > 20){
				showErr("password_err", "请输入6-20位密码！");
				return;
			}
			if(!chk("password", false)){
				showOK("password_err");
				c[1] = true;
			}else{
				showErr("password_err", "请输入6-20位密码,只能为数字，字母！");
			}
	});
	
	$("#phone").bind({
		blur : function() {
			var phone = $("#phone").val();
			if(!isPhoneOk(phone)){
				return showErr('phone_err', '请输入正确的手机号码');
			}
			c[2] = true;
			return showOK('phone_err');
		}
	});

	var doBind = function() {
		var uid = $("#username").val();
		if(uid==""){
			alert("用户名不能为空！");
			return false;
		}
		var pwd = $("#password").val();
		if(pwd==""){
			alert("密码不能为空！");
			return false;
		}
		var phone = $("#phone").val();
		if(!isPhoneOk(phone)){
			alert("请输入正确的手机号码！");
			return false;
		}
		
		var data = $_user.key.uid + "=" + encodeURIComponent(uid) + "&" + $_user.key.pwd + "=" + encodeURIComponent(pwd) + "&" + $_user.key.mobileNo + "=" + encodeURIComponent(phone);
		Y.ajax({
			type : 'POST',
			data : data,
			url : "/phpu/allybind.phpx",
			end : function(res) {
				var obj = eval("(" + res.text + ")");
				if(obj.c == 0){
					window.location.href = /^http/.test(obj.e) ? obj.e : obj.p;
//					window.location.href = '/account/chongzhi.html';
				}else if(obj.c == 1 || obj.c == 2 || obj.c == -1){
					alert(obj.e);
					return false;
				}
			}
		});
	};
	$("#subfrm").click(function(){	
			doBind();
	});
});
//验证手机号码
function isPhoneOk(tel){
	var reg = 	/^((13[0-9])|(15[^4,\\d])|(18[0-9])|(14[0-9]))\d{8}$/;
	if(reg.test(tel)){
		return true;
	}
	return false;
};
function onfocuss(e) {

	$("#"+e+"").show();
	
}