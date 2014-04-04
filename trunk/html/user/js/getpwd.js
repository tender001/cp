	Y.use('mask', function(){
	var act=location.search.getParam('act');
	var mobilehep =  Y.lib.MaskLay('#mobilehep');
	mobilehep.addClose('#mobileclose');
	Y.get('#mobilehep .tantop').drag('#mobilehep');
	
	var emailhelp =  Y.lib.MaskLay('#emailhelp');
	emailhelp.addClose('#emailclose');
	Y.get('#emailhelp .tantop').drag('#emailhelp');
	
	var mibaohelp =  Y.lib.MaskLay('#mibaohelp');
	mibaohelp.addClose('#mibaoclose');
	Y.get('#mibaohelp .tantop').drag('#mobilehep');
	if ($.trim(act)=="verifyemail"){
		$('#step_1').hide();
		var username=location.search.getParam('username');
		var vcode=location.search.getParam('vcode');
		if ($.trim(username)=="" || $.trim(vcode)==""){
			showCommonMsg('#step_1','错误提示','该地址无效，请确认验证地址！');
			return false;
		}
		var data ="flag=0&uid=" + encodeURIComponent(username)+ "&yzm=" + $.trim(vcode)+ "&rnd=" + Math.random();
		$("div.regline div").addClass("div4");
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
				$('[mark=username]').html($.trim(username));
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
	$("#username,#mobile,#vcode,#email,#answer,#question").click(function(){
		$("[mark=err_info]").html("&nbsp;")
	})
	$("#mobile_again").click(function(){
		checkMobileForm();
	});
	$("#pwbhelp").click(function(){
			var getpwd_help =  Y.lib.MaskLay('#getpwd_help');
			getpwd_help.addClose('#getpwd_close');
			Y.get('#getpwd_help .tantop').drag('#getpwd_help');
			getpwd_help.pop();

	})
	$("#btn_tj").click(function(){
		checkUserForm();
	});

	$("#mobile_btn").click(function(){
		checkMobileVCode();
	});
	$('#load_mail').click(function (){
	 		changehref(this);
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
						$("div.regline div").addClass("div3")
						emailhelp.close();
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
					
					$('[mark=username]').each(function(){
						this.innerHTML = $.trim($("#username").val());
					});

					if(mobbind==1){
						$('#getway1 > p').html('<strong>已绑定</strong><br />（可以使用）');
						$("#m1").hide();
						$("#m2").show();
//						$("#mobile_openBtn").click(showStep3Mobile);
						$("#mobile_openBtn").click(function(){
							
								mobilehep.pop();

						})
						
					}

					if(mailbind==1){
						$('#getway2 > p').html('<strong>已绑定</strong><br />（可以使用）');
						$("#e1").hide();
						$("#e2").show();
//						$("#email_openBtn").click(showStep3Email);
						$("#email_openBtn").click(function(){
						
							emailhelp.pop();

					})
					}

					if(isprot==0){
						$('#getway3 > p').html('<strong>已开通</strong><br />（可以使用）');
						$("#p1").hide();
						$("#p2").show();
					
						$("#protect_openBtn").click(function(){
							
							mibaohelp.pop();
//							showStep3Protect();

					})
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
						$("div.regline div").addClass("div4");
						emailhelp.close();
						showCommonMsg('#layer_email1','请查收邮件', $.trim($("#email").val()));
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
			$('#err_info6').html('请选择密保问题');
			$('#err_info6').show();
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
						mibaohelp.close();
						$("div.regline div").addClass("div4")
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
			$('#err_info3').html('请填写手机号码');
			$('#err_info3').show();
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
						$("div.regline div").addClass("div4");
						$("#mobile_again").attr("disabled", true);
						showMobileMsg($.trim($("#mobile").val()));
					} else {
						$('#err_info3').html(desc);
						$('#err_info3').show();
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
						mobilehep.close();
						showStepSuc('#mobilehep',$.trim($("#username").val()),pass,false);
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
	var changehref = function(obj) {
		obj.href = ""+alertEmail.getEmailHttp($("#email").val());
		return true;
	};

	var alertEmail = {
		getEmailHttp : function(email) {
			var emailType = email.substring(email.indexOf('@') + 1), emailUrl = '', html = '';
			emailType = emailType.toLowerCase();
			switch (emailType) {
			case 'qq.com':
			case 'vip.qq.com':
			case 'foxmail.com':
				emailUrl = 'http://mail.qq.com/';
				break;
			case '163.com':
			case '126.com':
			case 'yeah.net':
			case 'vip.163.com':
			case '188.com':
				emailUrl = 'http://email.163.com/';
				break;
			case 'tom.com':
				emailUrl = 'http://mail.tom.com/';
				break;
			case 'sina.com':
			case 'vip.sina.com':
			case 'sina.com.cn':
				emailUrl = 'http://mail.sina.com.cn/';
				break;
			case 'sohu.com':
			case 'souhu.com':
			case 'vip.sohu.com':
				emailUrl = 'http://mail.sohu.com/';
				break;
			case '139.com':
			case '136.com':
				emailUrl = 'http://mail.10086.cn/';
				break;
			case 'gmail.com':
				emailUrl = 'http://www.gmail.com/';
				break;
			case 'hotmail.com':
			case 'msn.com':
			case 'live.cn':
			case 'live.com':
			case 'msn.cn':
			case 'hotmail.com.cn':
				emailUrl = 'https://login.live.com/';
				break;
			case 'yahoo.com.cn':
			case 'yahoo.cn':
			case 'yahoo.com':
				emailUrl = 'http://mail.cn.yahoo.com/';
				break;
			case '21cn.com':
			case '21cn.net':
				emailUrl = 'http://mail.21cn.com/';
				break;
			case 'sogou.com':
				emailUrl = 'http://mail.sogou.com/';
				break;
			case '189.cn':
				emailUrl = 'http://www.189.cn/';
				break;
			case 'eyou.com':
				emailUrl = 'http://www.eyou.com/';
				break;
			default:
				emailUrl = 'http://www.' + emailType + '/';
			}
			return emailUrl;
		}
	};
var Timer=function(num) { 
	var wait = 30; //设置秒数(单位秒) 
	var secs = 0;
	 if(num==wait)  { 
	  $("#mobile_again").html("重新发送");
	  $("#mobile_again").attr("disabled", false);
	 }else{ 
	  secs=wait-num; 
	  $("#mobile_again").html("重新发送 "+secs);
	 } 
};