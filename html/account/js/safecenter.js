/**
 * 安全中心
 */

Class({
	ready : true,

	index : function(config) {
		Y.C('logininfo', this.showinfo);
		Y.C('logoutinfo', this.logoutinfo);
		this.LoginAcc();
	},
	logoutinfo : function() {
		location = "/";
	},
	showinfo : function() {
		Y
				.ajax({
					url : $_user.url.safe,
					type : "POST",
					dataType : "json",
					end : function(d) {
						var obj = eval("(" + d.text + ")");
						var code = obj.Resp.code;
						var desc = obj.Resp.desc;
						if (code == "0") {
							var r = obj.Resp.row;
							var safe = 0;
							var pwd = r.pwd;
							var isprot = r.isprot;
							var rname = r.rname;
							var idcard = r.idcard;
							var bank = r.bank;
							var name=r.name;
							
							var mobbind = r.mobbind;
							var mobile = r.mobile;
							var email =r.email;
							var mailbind = r.mailbind;

							if (isprot == 1) {
								
								$("#isport_i").removeClass("mibacur");
								$("#isport s").html('<a href="/account/mibao.html">绑定</a>').addClass("cur");
							} else {
								$("#isport s").html('已绑定，<a id="isport" class="s" href="/account/mibao.html">修改</a>').removeClass("cur");
								
								$("#isport_i").addClass("mibacur");
								safe += 1;
							}

							if (rname.length > 2 && idcard.length > 10) {
								$("#realname s")
										.html(
												'已绑定，不可修改')
										.removeClass("cur");
								$("#realname_i").addClass("cardcur");
								$("#na").html('真实姓名：<em id="rname">'+rname+'</em>'+'&nbsp;&nbsp;&nbsp;&nbsp;身份证号：<em id="idcard">'+idcard+'</em>');

								safe += 1;
							} else {
							
								$("#realname_i").removeClass("cardcur");
								$("#realname s").html(
										'<a href="/account/trueinfo.html">绑定</a>')
										.addClass("cur");
								$("#na").html("实名信息（真实姓名、身份证号）是领奖、提款的重要信息，绑定后不可更改");

							}
							
							if (mobbind == 0) {
						
								
								$("#mobbind_i").removeClass("telcur");
								$("#mobbind s").html('<a href="/account/mobile.html">绑定</a>').addClass("cur");
								$("#tel").html('绑定手机，可以免费定制中奖通知、账户异动通知等服务');

							} else {
							
								
								$("#mobbind s").html('已绑定，<a id="div4" name="sendphone" class="s" href="/account/mobile.html">修改</a>').removeClass("cur");
								
								$("#mobbind_i").removeClass("telc").addClass("telcur");
								$("#tel").html('手机号码：<em id="mobile">'+mobile+'</em>');
								safe += 1;
							}
							
							if (bank.length > 10) {
								
								$("#bank s").html('已绑定，不可修改').removeClass("cur");
								$("#bank_i").addClass("bankcur");
								$("#bk").html('银行卡号：<em id="bank">'+bank+'</em>'+'&nbsp;&nbsp;&nbsp;&nbsp;支行名称：<em id="name">'+name+'</em>');
								safe += 1;
							} else {
							
								$("#bank_i").removeClass("bankcur");
								$("#bank s").html(
										'<a href="/account/bankinfo.html">绑定</a>')
										.addClass("cur");
								$("#bk").html('绑定银行卡是您提款时的唯一用卡，是资金提取的安全保证');

							}
							
							if (mailbind == 0) {
								
								$("#mailbind_i").removeClass("mailcur");
								$("#mailbind s").html(
										'<a href="/account/emailinfo.html">绑定</a>')
										.addClass("cur");
								$("#emal").html('认证后可找回密码；可定制安全服务，保障账户安全');

								// $("#mailbind").removeClass().addClass("bd");
							} else {
								$("#mailbind_i").addClass("mailcur");
								// $("#mailbind_i").removeClass().addClass("mail_cur");
								$("#mailbind s")
								.html(
										'已绑定，<a id="div5" name="sent_mail" class="s" href="/account/emailinfo.html">修改</a>')
								.removeClass("cur");
						
						$("#emal").html('邮箱：<em id="mailbind">'+email+'</em>');
						
								safe += 1;
							}

							if (safe == 0) {
								cascade = "差";
								caspaint = "0";
							} else if (safe == 1) {
								cascade = "低";
								caspaint = "20";
							} else if (safe == 2) {
								cascade = "中低";
								caspaint = "40";
							} else if (safe == 3) {
								cascade = "中";
								caspaint = "60";
							} else if (safe == 4) {
								cascade = "中高";
								caspaint = "80";
							} else if (safe == 5) {
								cascade = "高";
								caspaint = "100";
//								this.get("#djimg").attr(
//										"style","background:#00AE38;width:" + caspaint + "%");
							}
							this.get("#djimg").attr(
									"style","width:" + caspaint + "%");
							this.get('#dj').html(cascade);
						} else {
							if (code == "1") {
								Y.postMsg('msg_login', function() {
									window.location.reload();
								});
							} else {
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
});
