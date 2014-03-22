$(function(){
	var act=location.search.getParam('act');
	if ($.trim(act)=="verifyemail"){
		$('#step_1').hide();
		var username=location.search.getParam('username');
		var vcode=location.search.getParam('vcode');
		if ($.trim(username)=="" || $.trim(vcode)==""){
			showCommonMsg('#step_1','错误提示','该地址无效，请确认验证地址！');
			return false;
		}
		var data ="flag=0&uid=" + encodeURIComponent(username)+ "&yzm=" + $.trim(vcode)+ "&rnd=" + Math.random();
		Y.ajax({
			url : "/phpu/usergetpwdyz.phpx",
			type : "POST",
			dataType : "json",
			data:data,
			end : function(d) {
    			var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				if (code == "0") {	
					var r= obj.Resp.row;
					var pass = r.pass;
					showStepSuc('#email_msg',$.trim(username),pass,false);
				} else {
					showCommonMsg('#step_1','链接地址失效。','该地址已过有效期，或者您已经成功修改了密码！');
				}			
			},
			error : function() {
				showCommonMsg('#step_1','请求地址无效。','请重新申请验证地址！');
				return false;
			}
		});
		return false;
	}

	$("#btn_back2").click(function(){
		$("#layer_err1").hide();
	});
	
	$("#mobile_again").click(function(){
		checkMobileForm();
	});
	
	$("#btn_tj").click(function(){
		checkUserForm();
	});

	$("#mobile_btn").click(function(){
		checkMobileVCode();
	});
	
	$("#btn_tj_email").click(function(){
		checkEmailForm();
	});
	
	$("#btn_tj_protect").click(function(){
		checkProtectForm();
	});

	function checkUserForm(){
		if($('#username').attr('value')>''){
			var data ="uid=" + encodeURIComponent($("#username").val())+ "&rnd=" + Math.random();
			Y.ajax({
				url : $_user.url.checkexist,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var nid = typeof (obj.Resp.row) == "undefined"?"-":"ok";
					if (nid!="ok") {
						$('#username_err').html("用户名不存在");
						$('#username_err').show();
					} else {
						showStep2("#step_1");
					}			
				},
				error : function() {
					alert("您所请求的页面有异常！");
					return false;
				}
			});
		}else{
			$('#username_err').html('请输入用户名');
			$('#username_err').show();
		}
	}

	function showStep2(from){
		var data ="uid=" + encodeURIComponent($("#username").val())+ "&rnd=" + Math.random();
		$.ajax({
			url : '/phpu/forgetpwd.phpx',
			type : "POST",
			dataType : "json",
			data : data,
			success : function(d) {
				var code = d.Resp.code;
				if (code == "0") {
					
					var r= d.Resp.row;
					var isprot = r.isprot;
					var mailbind = r.mailbind;
					var mobbind = r.mobbind;
					
					$('.red').each(function(){
						this.innerHTML = $.trim($("#username").val());
					});

					if(mobbind==1){
						$('#getway1 > p').html('<strong>已绑定</strong><br />（可以使用）');
						$("#m1").hide();
						$("#m2").show();
						$("#mobile_openBtn").click(showStep3Mobile);
					}

					if(mailbind==1){
						$('#getway2 > p').html('<strong>已绑定</strong><br />（可以使用）');
						$("#e1").hide();
						$("#e2").show();
						$("#email_openBtn").click(showStep3Email);
					}

					if(isprot==0){
						$('#getway3 > p').html('<strong>已开通</strong><br />（可以使用）');
						$("#p1").hide();
						$("#p2").show();
						$("#protect_openBtn").click(function(){
							showStep3Protect();
						});
					}

					$(from).fadeOut(200,function()
					{
						$("#step_2").fadeIn(500);
					});
				} else {
					//showStep1(data.code);
				}			
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});
	}

	function showStep3Email(){
		$("#step_2").hide();
		$('#layer_email1').show();
	}

	function checkEmailForm(){
		var email = $('#email').attr('value');
		if(email=='' || email == undefined){
			$('#err_info2').html('请填写邮箱地址');
			$('#err_info2').show();
			return false;
		}
		if(email>''){
			var data ="flag=0&uid=" + encodeURIComponent($("#username").val())+ "&newValue=" + $.trim($("#email").val())+ "&rnd=" + Math.random();
			$.ajax({
				url : "/phpu/usergetpwd.phpx",
				type : "POST",
				dataType : "json",
				data:data,
				success : function(d) {
					var code = d.Resp.code;
					var desc = d.Resp.desc;
					if (code == "0") {	
						showCommonMsg('#layer_email1','请查收邮件', '邮件已发送到：'+$.trim($("#email").val()));
					} else {
						$('#err_info2').html(desc);
						$('#err_info2').show();
					}			
				},
				error : function() {
					alert("您所请求的页面有异常！");
					return false;
				}
			});
		}
	}

	function showStep3Protect(){
		$("#step_2").hide();
		$('#layer_protect1').show();
	}

	function checkProtectForm(){
		var question = $('#question').attr('value');
		var answer = $('#answer').attr('value');
		if(question==''){
			$('#err_info5').html('请选择密保问题');
			$('#err_info5').show();
			return false;
		}
		if(answer==''){
			$('#err_info6').html('请填写密保答案');
			$('#err_info6').show();
			return false;
		}
		if(question>'' && answer>''){
			var data ="flag=2&uid=" + encodeURIComponent($("#username").val())+ "&newValue=" + $.trim($("#question").val()) +"|"+ $.trim($("#answer").val())+ "&rnd=" + Math.random();
			$.ajax({
				url : "/phpu/usergetpwd.phpx",
				type : "POST",
				dataType : "json",
				data:data,
				success : function(d) {
					var code = d.Resp.code;
					var desc = d.Resp.desc;
					if (code == "0") {
						var r= d.Resp.row;
						var pass = r.pass;
						showStepSuc('#layer_protect1',$.trim($("#username").val()),pass,true);
					} else {
						$('#err_info6').html(desc);
						$('#err_info6').show();
					}			
				},
				error : function() {
					return false;
				}
			});
		}
	}

	function showStep3Mobile(){
		$("#step_2").hide();
		$('#layer_mobile1').show();
	}

	function checkMobileForm(){
		$("#mobile_again").attr("disabled", false);
		var mobile = $('#mobile').attr('value');
		if(mobile=='' || mobile==undefined){
			$('#err_info1').html('请填写手机号码');
			$('#err_info1').show();
			return false;
		}
		if(mobile>''){
			var data ="flag=1&uid=" + encodeURIComponent($("#username").val())+ "&newValue=" + $.trim($("#mobile").val())+ "&rnd=" + Math.random();
			$.ajax({
				url : "/phpu/usergetpwd.phpx",
				type : "POST",
				dataType : "json",
				data:data,
				success : function(d) {
					var code = d.Resp.code;
					var desc = d.Resp.desc;
					if (code == "0") {
						$("#mobile_again").attr("disabled", true);
						showMobileMsg($.trim($("#mobile").val()));
					} else {
						$('#err_info1').html(desc);
						$('#err_info1').show();
						//showErrInfo(desc,'#layer_mobile1','mobile');
					}			
				},
				error : function() {
					alert("您所请求的页面有异常！");
					return false;
				}
			});
		}
	}

	function showMobileMsg(mobile){
		//$('#layer_mobile1').hide();
		//$('#mobileNum').html(mobile);
		//$("#mobile_msg").fadeIn(100);
		var wait = 30; //设置秒数(单位秒)
		var secs = 0;
		var mi;
		for(var i=1;i<=wait;i++) {
		  window.setTimeout("Timer("+i+")",i*1000); 
		}
	}
	
	function checkMobileVCode(){
		var vcode = $('#vcode').attr('value');
		if(vcode>''){
			var data ="flag=1&uid=" + encodeURIComponent($("#username").val())+ "&yzm=" + $.trim($("#vcode").val())+ "&rnd=" + Math.random();
			$.ajax({
				url : "/phpu/usergetpwdyz.phpx",
				type : "POST",
				dataType : "json",
				data:data,
				success : function(d) {
					var code = d.Resp.code;
					var desc = d.Resp.desc;
					if (code == "0") {	
						var r= d.Resp.row;
						var pass = r.pass;
						showStepSuc('#layer_mobile1',$.trim($("#username").val()),pass,false);
					} else {
						$('#err_info3').html(desc);
						$('#err_info3').show();
					}			
				},
				error : function() {
					alert("您所请求的页面有异常！");
					return false;
				}
			});
		}
	}

	function showStepSuc(from,name,pwd,fadein){
		$('.red').each(function(){
			this.innerHTML = name;
		});
		$('#newpwd').html(pwd);
		$('#step_1').hide();
		$('#step_2').hide();
		$(from).hide();
		if(fadein){
			$("#step_suc").fadeIn(500);
		}else{
			$("#step_suc").show();
		}
	}

	function showMaxTime(){
		showCommonMsg('#step_1','您尝试次数过多','您24小时内已经尝试3次找回密码了，请改天再试');
	}

	function showCommonMsg(from,title,content){
		$('#msg_title').html(title);
		$('#msg_content').html(content);
		$('#step_1').hide();
		$('#step_2').hide();
		$(from).hide();
		$("#common_msg").fadeIn(400);
	}

});

var Timer=function(num) { 
	var wait = 30; //设置秒数(单位秒) 
	var secs = 0;
	 if(num==wait)  { 
	  $("#mobile_again").val("重新发送");
	  $("#mobile_again").attr("disabled", false);
	 }else{ 
	  secs=wait-num; 
	  $("#mobile_again").val("重新发送 "+secs);
	 } 
};