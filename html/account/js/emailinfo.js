/**
 * 邮箱绑定
 */
Class({
	
	ready: true,
    index:function (config){
    	P = this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
		
    	this.LoginAcc();
		P.use('mask', function (){
			P.get('em.dcr_table_help').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
		});
		
    }
	,logoutinfo:function(){
		location="/";
	}
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r=obj.Resp.row;
					var mailbind = r.mailbind;				
					var mail =r.email;
					
					$("#yibindemail").html(mail);
					if(mailbind==1){
						$("#div1").hide();
						$("#div5").show();
						Y.ajax({
							url : '/phpu/q.phpx?fid=u_getmailauth',
							type : "POST",
							dataType : "json",
							end : function(d) {
								var obj = eval("(" + d.text + ")");
								var code = obj.Resp.code;
								var desc = obj.Resp.desc;
								if (code == "0") {	
									$("#open_kz").html('修改');
									$("#isimg").html('<img src="/images/njc/bdbg1_07.jpg">');
									
								}
							},
							error : function() {
								Y.alert("您所请求的页面有异常！");
								return false;
							}
						});			
						
					}else{
						$("#div4").hide();
						$("#div1").show();
					}
					P.btnbind();
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}			
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
				return false;
			}
		});
	}
	
	,btnbind:function(){
		P = this;
   	 	/**
   	 	 * 确认发送按钮绑定
   	 	 */
   	 	this.get('#conform_btn').click(function (){
			if ($.trim($("#email").val())==""){
				Y.alert("请输入您的电子邮箱");
				P.sentYZM(1);
				return false;
			}
		var temp=$("#email");
		 var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		 if(!myreg.test(temp.val())){
			 temp.focus();
			 Y.alert("请输入有效的邮箱");
			 return false;
		 }
		
			var data ="flag=0&newValue=" + $.trim($("#email").val())+ "&rnd=" + Math.random();
								
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
						$("#sent_mail").html($.trim($("#email").val()));
						P.sentYZM(3);
				   	 	Y.get('#editbindmail').click(function (){
				   	 		P.sentYZM(1);
				   	 	});
					} else {
						Y.alert(desc);
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});			
   	 	});

		/**
		 * 第一次绑定按钮绑定提交事件
		 */
		
   	 	this.get('#conform').click(function (){
			if ($.trim($("#mail").val())==""){
				Y.alert("请输入您的电子邮箱");
				return false;
			}
			var temp=$("#mail");
			 var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			 if(!myreg.test(temp.val())){
				 temp.focus();
				 Y.alert("请输入有效的邮箱");
				 return false;
			 }
			$("#email").val($.trim($("#mail").val()));
			$("#sendmail").html($.trim($("#email").val()));
			P.sentYZM(2);	
   	 	});
   	 	
   	 	this.get('#editmail').click(function (){
   	 		P.sentYZM(1);
   	 	});
   	 	
   	 	this.get('#load_mail').click(function (){
   	 		changehref(this);
   	 	}); 	
   	 	
 	
   	 	
   	 	this.get('#again').click(function (){
			if ($.trim($("#email").val())==""){
				P.sentYZM(1);
				return false;
			}	
			var data ="flag=0&newValue=" + $.trim($("#email").val())+ "&rnd=" + Math.random();
			
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
						Y.alert("邮件已重发,请注意查收");
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});
   	 	});
   	 	
   	 	this.get('#editbind').click(function (){
   	 		P.sentYZM(4);
   	 	});
   	 
		
		$('#open_kz').bind("click",function(){
			var bw = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement : document.body;
			var d_left = ($(window).width()-$("#emailService").css("width").replace("px",""))/2;
			var d_top = 100;
			$("#emailService").css("top", d_top + bw.scrollTop + "px");
			$("#emailService").css("left", d_left + "px");
			$('.yclass_mask_panel').show();
			
			
			
			 var imnotice =0;
			 var names = ["双色球","大乐透","竞彩","篮彩"];
			 var arr = [0,1,2,3];
			 var info ="";
			Y.ajax({
						url : '/phpu/q.phpx?fid=u_getmailauth',
						type : "POST",
						dataType : "json",
						end : function(d) {
							var obj = eval("(" + d.text + ")");
							var code = obj.Resp.code;
							var desc = obj.Resp.desc;
							if (code == "0") {	
								imnotice=obj.Resp.row.imnotice;
								
							}
				
			
			 for(var i = 0; i < arr.length; i++){
				
				if((imnotice & (1<<parseInt(arr[i]))) == (1<<parseInt(arr[i]))){
					info += "<label for='mail"+arr[i]+"'><input type='checkbox' id='mail"+arr[i]+"' value='" + arr[i] + "' checked/>"+names[i]+"</label>";
				}else{
					info += "<label for='mail"+arr[i]+"'><input type='checkbox' id='mail"+arr[i]+"' value='" + arr[i] + "'/>"+names[i]+"</label>";
				}
				
			 }

			$("#typeinfo").html(info);
			$("#emailService").show();
						},
						error : function() {
							Y.alert("您所请求的页面有异常！");
							return false;
						}
					});			
			
			
		
			 function $$(id){
				return document.getElementById(id);
			 }
			
			 $(".a_cdsuc").click(function(){
				var v = 0;
				for(var i = 0; i < arr.length; i++){
					v |= $$("mail" + arr[i]).checked ? 1 << parseInt($$("mail" + arr[i]).value) : 0;
				}
				
			Y.ajax({
							url : '/phpu/u.phpx?fid=u_updatemailauth&flag='+v+'',
							type : "POST",
							dataType : "json",
							end : function(d) {
								var obj = eval("(" + d.text + ")");
								var code = obj.Resp.code;
								var desc = obj.Resp.desc;
								if (code == "0") {	
									
									
								}
								$('#emailService').hide();
								$('.yclass_mask_panel').hide()
								Y.alert(desc);
								
							},
							error : function() {
								Y.alert("您所请求的页面有异常！");
								return false;
							}
						});			
			 })

		});
   	 	
   	 	this.get('#conform_b').click(function (){
			if ($.trim($("#oldemail").val())==""){
				Y.alert("请输入您的原电子邮箱");
				return false;
			}
			if ($.trim($("#newmail").val())==""){
				Y.alert("请输入您的新电子邮箱");
				return false;
			}
			
			if ($.trim($("#oldemail").val())==$.trim($("#newmail").val())){
				Y.alert("新旧电子邮箱不能相同，请重新输入");
				return false;
			}
			
			$("#email").val($.trim($("#newmail").val()));
			
			var data ="flag=0&mailAddr=" + $.trim($("#oldemail").val())+ "&newValue=" + $.trim($("#newmail").val())+ "&rnd=" + Math.random();
								
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
						$("#sent_mail").html($.trim($("#email").val()));
						P.sentYZM(3);
				   	 	Y.get('#editbindmail').click(function (){
				   	 		P.sentYZM(5);
				   	 	});
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});			
   	 	}); 
   	 	
   	 	
	}
	
	,sentYZM:function(a) {
		P = this;
		for(var i=1;i<6;i++){
			$("#div"+i).hide();
		}
		$("#div"+a).show();
		
		if(a==2){
			var wait = 30; //设置秒数(单位秒) 
			for(var i=1;i<=wait;i++) { 
			 window.setTimeout("P.sTimer("+i+")",i*1000); 
			}
		}
	}
	
	,sTimer:function(num) { 
		var wait = 30; //设置秒数(单位秒) 
		var secs = 0;
		 if(num==wait)  { 
		  $("#again").val("重新发送");
		  $("#again").attr("disabled", false);
		 }else{ 
		  secs=wait-num; 
		  $("#again").val("重新发送 "+secs);
		 } 
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