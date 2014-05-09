$(function() {
	
	var refreshVerify = function() {
		$("#yzmimg").attr('src', "/rand.phpx?rnd=" + Math.random());
	};

	var fromurl=document.referrer;
	if (fromurl.length > 10 && fromurl.indexOf(".phpx")<0){
		$("#referer").val(fromurl);
	}
	
	var doLogin = function() {
		var u = $("#uid").val();
		var p = $("#pwd").val();
		var c = $("#yzm").val();
		var x = $("#isagree").attr("checked"); 
		var dis = $("#dis");

		var um = "<a href='javascript:;' class='close' onclick='javascript:cl();'>关闭</a> <span>请输入用户名！</span>";
		var pm = "<a href='javascript:;' class='close' onclick='javascript:cl();'>关闭</a> <span>请输入密码！</span>";
		var cm = "<a href='javascript:;' class='close' onclick='javascript:cl();'>关闭</a> <span>请输入4位验证码！</span>";
		var xy = "<a href='javascript:;' class='close' onclick='javascript:cl();'>关闭</a> <span>请同意“支付宝账户通绑定协议”</span>";
		var msg = '';
		if (c.length != 4) {
			msg = cm;
		}

		if (!p.length) {
			msg = pm;
		}

		if (!u.length) {
			msg = um;
		}

		if(!x){
			msg = xy;
		}

		if (msg.length > 0) {
			dis.html(msg);
			dis.show();
			if (msg == um) {
				$("#uid").focus();
			} else if (msg == pm) {
				$("#pwd").focus();
			} else if(msg == cm){
				$("#yzm").focus();
			} else {
				
			}
			$('#loginbtn').disabled = false;
			return false;		
		} else {
			var data = $_user.key.uid + "=" + encodeURIComponent($("#uid").val()) + "&" + $_user.key.pwd + "=" + encodeURIComponent($("#pwd").val()) + "&yzm=" + encodeURIComponent($("#yzm").val());
			Y.ajax({
				type : 'POST',
				data : data,
				url : $_user.url.login,
				end : function(data) {
					var json = eval('(' + data.text + ')');
					if(json.Resp.code == 0){
						acceptLoginMsg();
					} else {
						$('#loginbtn').disabled = false;
						acceptLoginMsg(json.Resp.desc);
					}
				}
			});
		}
		return true;
	};

	refreshVerify();
	$("#yzmimg").show();
	$("#yzmup").add($("#yzmimg")).bind({
		click : function() {
			refreshVerify();
		}
	});
	
	var acceptLoginMsg = function(msg) {
		var dis = $("#dis");
		if (msg) {
			dis.html("<a href='javascript:;' class='close' onClick='javascript:cl();'>关闭</a><p>" + msg + "</p>");
			dis.show();
			return false;
		}
		if($("#referer").val().length>10){
			window.location = $("#referer").val();
		}else{
			window.location = "/";
		}
	};

	$('#loginbtn').bind({
		click : function() {
			doLogin();
		}
	});
});

var cl = function() {
	$("#dis").hide();
};