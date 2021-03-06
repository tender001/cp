Class('Loginer', {// 登陆器
    single: true,// 单例
    index:function (config){
        var Y = this;
        this.loginDlg = this.lib.MaskLay('#loginLay');// 登陆框
        this.loginDlg.addClose('#flclose','#fclosebtn');// 关闭元素
        this.get('#loginLay div.tan_top').drag('#loginLay');
        this.loginDlg.esc = true;
        this.userMoneys = '#userMoneyInfo,#userMoneyInfo2,#userMoneyInfo3,#userBuyMoneyInfo';// 用户信息显示面板
        this.userBuyMoneys = '#userBuyMoneyInfo,#userBuyMoneyInfo1';// 用户信息显示面板
		this.addNoop('onlogin,onlogout');
        this.bindEvent(config);
        this.onMsg('msg_login', function (fn){// 回应登陆检查
            return this.login(fn);
        });
        this.onMsg('msg_update_userMoney', function (fn){// 刷新用户信息
            Y.showUserInfo();
        });
        this.onMsg('msg_logout', function (fn){// 回应登陆检查
            return this.logout(fn);
        });
        this.get("#CooperationLogin").mouseover(function(){
         	document.getElementById("CooperationLogin").className="ac ab";
         	
        	 var div = document.getElementById("CooperationUser");
        	 div.style.display = "block"; 
         });
        this.get("#CooperationLogin").mouseout(function(){
         	document.getElementById("CooperationLogin").className="ab";
         	
        	 var div = document.getElementById("CooperationUser");
        	 div.style.display = "none"; 
         });
    	 this.get("#CooperationUser").mouseout(function(){
             	document.getElementById("CooperationLogin").className="ab";
            	 var div = document.getElementById("CooperationUser");
            	 div.style.display = "none"; 
             });
    	 this.get("#CooperationUser").mouseover(function(){
          	document.getElementById("CooperationLogin").className="ac ab";
         	 var div = document.getElementById("CooperationUser");
         	 div.style.display = "block"; 
          });
    	 this.get("#friendlyLink").mouseover(function(){
    		 document.getElementById("friendlyLink").className="cur";
    		 document.getElementById("navigation").className="";
    		 var linkdiv = document.getElementById("linkInfo");
    		 linkdiv.style.display = "block"; 
    		 var navdiv = document.getElementById("navInfo");
    		 navdiv.style.display = "none"; 
    	 });

    	 this.get("#navigation").mouseover(function(){
    		 document.getElementById("friendlyLink").className="";
    		 document.getElementById("navigation").className="cur";
    		 var navdiv = document.getElementById("navInfo");
    		 navdiv.style.display = "block"; 
    		 var linkdiv = document.getElementById("linkInfo");
    		 linkdiv.style.display = "none"; 
    	 });
    	   this.get("#tp1").click(function(){
           	Y.postMsg('msg_login', function (){
           		 window.open('/account/myaccount.html','_self');
           	});

            });
            this.get("#tp2").click(function(){
           	 Y.postMsg('msg_login', function (){
           		 window.open('/account/chongzhi.html','_self');
           	});
        
        });
        this.get("#tp3").click(function(){
       		Y.postMsg('msg_login', function (){
          		 window.open('/account/tikuan.html','_self');
          	});
        
        });
   	 this.get("#tp4").click(function(){
   			Y.postMsg('msg_login', function (){
   	       		 window.open('/account/orderlist.html','_self');
   	       	});
   	     
   	     });
    },

    bindEvent: function (config){
        var Y = this;
         // 表单
        this.user = this.need('#uid');
        this.pwd = this.need('#pwd');
        this.errorTip1 = this.get('#error_user');
        this.errorTip2 = this.get('#error_pass');

        // passport callback
        window.acceptLoginMsg = function (err){
            if (err) {
                Y.errorTip2.html(err).show();
                Y.user.one().select();
            }else{
                Y.showUserInfo();
                var fn=Y.C('loginCallback');
                if (Y.isFunction(fn)) {
                    fn();
                    Y.C('loginCallback', false);
                }
                if (Y.get('#reload').val() == 1) {
                    location.href = Y.param({rnd:+new Date}, location.href);
                }
                Y.onlogin();
            }
            window.passportloginmsg = false;
        };

        this.need('#floginbtn').click(function (e, Y){
            this.disabled = true;
            if (!Y.doLogin()){
            	this.disabled = false;
            }
        });


 		this.user.focus(function(){Y.errorTip1.hide();});
 		this.pwd.focus(function(){Y.errorTip2.hide();});
 		this.user.keydown(enter);
 		this.pwd.keydown(enter);
        
        function enter(e, Y){
            if (e.keyCode == 13) {
            	if (Y.user.val() && Y.pwd.val()) {
                    Y.need('#floginbtn').attr('disabled', true);
                    if (!Y.doLogin()){
                    	this.disabled = false;
                    }                  
                }
            }
        }      
        
        // 登入
        this.need(config.loginBtns).click(function (e, Y){
            Y.login();
            e.end();
            return false;
        });
        
        // 登出
        this.need(config.logoutBtns).click(function (e, Y){
            Y.logout();
            e.end();
            return false;
        });
        this.loginDlg.onpop = function (){
           Y.user.one().select();
        };

        this.loginDlg.onclose = function (){
            Y.user.val('');
            Y.pwd.val('');
            Y.errorTip1.hide();
            Y.errorTip2.hide();
        };
    },
    
    login: function (fn){// 登陆
        this.getLogStart(function (isLogin){
            if (isLogin) {
                this.onlogin();
                acceptLoginMsg();
                fn && fn.call(this);
				
            }else{
				if(Y.getCANCookie("LoginuserName_cookie")!=null){
	        			this.user.val(Y.getCANCookie("LoginuserName_cookie"));
	        		}
            	if(fn==undefined){fn=Y.C('logininfo');}
                Y.C('loginCallback', fn);
                this.loginDlg.pop();// 弹出登陆框
            }
        });
    },

    getLogStart: function (fn){// 检查是否登陆
        this.ajax(Class.C('url-login-check'), function (data){
            var islogin; 
            if (!data.error) {
				var obj = eval("(" + data.text + ")");
			    islogin = obj.Resp.code;
				if (islogin =="0" ){
                		islogin = true;
                	}else{
                		islogin = false;
                	}
            }
            fn.call(this, !!islogin);
        });
    },
    doLogin: function (){// 提交表单
       var Y = this;
       this.errorTip1.hide();
       this.errorTip2.hide();
        if(this.user.val() == ""){
            this.errorTip1.html("请输入用户名").show();
            this.user.one().focus();
            return false;
        } else if(this.pwd.val() == ""){
            this.errorTip2.html("请输入密码").show();
            this.pwd.one().focus();
            return false;
        } else {
            this.one('#floginbtn').disabled = false;      
            var data = $_user.key.uid + "=" + encodeURIComponent(this.user.val()) + "&" + $_user.key.pwd + "=" + encodeURIComponent(this.pwd.val());
            this.ajax({
            	type: 'POST',
                data: data,
                url: this.C('url-login-op'),
                end:function (data){
				   var obj = eval("(" + data.text + ")");
			       var code = obj.Resp.code;
				   var desc = obj.Resp.desc;
				   if (code =="0" ){
                		acceptLoginMsg();
                	}else{
                		if(code=="1010"){
                			Y.errorTip1.html(desc).show();
                		}else{
                			Y.errorTip2.html(desc).show();
                		}
                	}                 
                }
            });
            return true;
        }          
    },
    getYzm: function (){
        return Class.C('url-login-yzm')+'?_='+(+new Date);
    },
    showUserInfo: function (){
        this.loginDlg.close();
        this.get('#nologin_info').hide().get('#top_user_info').show();
        this.get("#my_login_info").show();
        this.get("#my_account_info").show();
        this.ajax({
          url:Class.C('url-login-user')+"&rnd=" + Math.random(),
          end:function (data){
              var  showText, Y;
              Y = this;
              if (data.error) {
                  this.setUserInfo('拉取用户信息失败, 请刷新重试!');
              }else{
            	   var obj = eval("(" + data.text + ")");
			       var code = obj.Resp.code;
				   var r = obj.Resp.row;
					   if (code=="0"){
							 Class.C('userMoney', r.usermoeny);
			                 Class.C('userName', r.nickid);	 
			                 this.showSafe();
							  if(Y.getCANCookie("LoginuserName_cookie")==null){
			         			Y.setCANCookie("LoginuserName_cookie",r.nickid,60*24*30);
			         		 }else{
			         			if(Y.getCANCookie("LoginuserName_cookie")!=r.nickid){
			         				Y.setCANCookie("LoginuserName_cookie",r.nickid,60*24*30);
			         			}
			         		 }        
		                     this.get('#top_username').html(r.nickid);// 用户名
		                     this.get('#money').html(parseFloat(r.usermoeny).rmb());// 下拉菜单中
		                     this.get(".c_username").html(r.nickid);//用户中心
		                     this.get("#zhanghu").html(parseFloat(r.usermoeny).rmb());//首页
                             showText = '<span>“'+r.nickid+// 购买表单中
	                         '”</span>，您的账户余额为<strong class="red eng">'+(parseFloat(r.usermoeny)||0).rmb()+'</strong>元【<b class="i-jb"></b><a href="'+$_user.daohang.addmoney+'" target="_blank">账户充值</a>】';
                             if(this.get('#top_username').html()!=""){ 
                            	 
                            	 this.get('#tp1').html("<em id='top_m'>我的账户</em>");
		                    	 this.get("#tp1").mouseover(function(){
		                    	 document.getElementById("top_m").className="cur";
		                    	 var div = document.getElementById("top_show");
		                    	 div.style.display = "block"; 
		                    	
		                    	 

		                     });
	                    	 
		                     this.get("#tp1").mouseout(function(){
		                    	document.getElementById("top_m").className="";
		                    	 var div = document.getElementById("top_show");
			                    	 div.style.display = "none"; 
			                     });
		                     this.get("#top_show").mouseover(function(){
			                    	document.getElementById("top_m").className="cur";
			                    	 var div = document.getElementById("top_show");
			                    	 div.style.display = "block"; 
			                    	 

			                     });
			                     this.get("#top_show").mouseout(function(){
			                    	document.getElementById("top_m").className="";
			                    	 var div = document.getElementById("top_show");
				                    	 div.style.display = "none"; 
				                     });
		                     }
                             if(r.isagent=="1" && (r.vlevel>0)){
                            	 this.get("#tuiguang").show();
                            	 this.get("#parent").show();
                            	 this.get("#fzurl").click(function(){	
 	        							copyurl('http://www.159cai.com/from.phpx?comeFrom='+u.items.cagentid);
 	        						}
 	        					);
                            	 
 	                    	 }
                             
		                     this.setUserInfo(showText);
		                    
					   }else{
						   this.setUserInfo('拉取用户信息失败, 请刷新重试!');
					   }      
                 Y.user.val('');
                 Y.pwd.val('');
              }
          }
        });
        this.ajax({
            url:"/phpu/allyinfo.phpx?rnd=" + Math.random(),
            end:function (data){
                if (data.error) {
                	this.get("#qqcaibei").hide();
                }else{
              	     var obj = eval("(" + data.text + ")");
	              	 var code = obj.type;
	              	 var memo = obj.memo;
		     			if (code == "2" &&memo=="qqcaibei") {	
		     				var showmsg= obj.showmsg;
		     				var headshow= obj.headshow;
		     				this.get("#cb_info").html(headshow);
		     				this.get("#cb_jf").html(showmsg+'，你好！|<a href="http://cb.qq.com/my/my_jifen_source.html" target="_blank">我的彩贝积分</a>');
		     				this.get("#qqcaibei").show();
		     			}
                }
            }
        });
    },
    
    setUserInfo: function (x){
        this.get(this.userMoneys).html(x);
        this.get('span.if_buy_yue').show();
    },
    
    setBuyUserInfo: function (x){
        this.get(this.userBuyMoneys).html(x);
        this.get('span.if_buy_yue').show();
    },

    clearUserInfo: function (){
        this.setUserInfo('您尚未登录，请先<a href="javascript:void 0" onclick="Yobj.postMsg(\'msg_login\')">登录</a>!');
        this.setBuyUserInfo('您尚未登录，请先  <a href="javascript:void 0" title="" onclick="Yobj.postMsg(\'msg_login\')"class=\"a1\" >登录</a>！</span>');
        this.get('#buySYSpan,#buySYSpan2').html((0).rmb());
        this.get('span.if_buy_yue').hide();
        this.get("#qqcaibei").hide();
    },
  //显示认证信息
     showSafe : function(){
    	Y.ajax({
            url:Class.C('url-login-safe')+"&rnd=" + Math.random(),
            end:function (data){
            	 if (data.error) {
            		 Y.alert("拉取用户信息失败, 请刷新重试！");
                 }else{
                	 var obj = eval("(" + data.text + ")");
            		 var code = obj.Resp.code;
    					   if (code==0){
    						 var u = obj.Resp.row;
    							 var rname = u.rname;

    							 if(rname==""){
    								this.get('#user_rz').html("<a href='/account/safecenter.html' target='_blank' alt>未实名</a>");
    							 }else{
    								this.get('#user_rz').html("已实名").addClass("cur");
    							 }
    							 
    							
    					   }
                 }
            }
    	});
    },

    logout: function (fn){// 退出
        var Y = this;
        this.ajax({
            url: Class.C('url-login-out'),
            end: function (){
                Y.getLogStart(function (isLogin){// 检查是否退出
                    if (!isLogin) {
                    	if(fn==undefined){fn=Y.C('logoutinfo');}
                        this.onlogout();
                        
                        this.get('#nologin_info').show().get('#top_user_info').hide();
                        this.get('#top_username').html("");
                        Class.config('userMoney', 0);
                        this.clearUserInfo();
                        this.get('#top_usermoney').html("");
                        this.get("#zhanghu").html("0");//选号首页
                        if (Y.isFunction(fn)) {
                            fn();
                            return;
                        }
                        if (this.onlogout() == false && this.get('#reload').val() == 1) {
                            location.href = Y.param({rnd:+new Date}, location.href);
                        }
                    }else{
                        this.alert('退出失败, 请重试!');
                    }                     
                });
            }
        }); 
    }
});
/*
 * 自动启动
 */
Class({
    use: 'mask, countDown',
    ready: true,

    index:function (){
	
     this.onMsg('show_userinfo', function (){// 回应登陆检查
            return this.loginer.showUserInfo();
        }); 
    	
        if (this.get('#loginLay').size() == 0) {
            return;
        };
        this.loginer = this.lib.Loginer({
            loginBtns: '#top_login_btn',// 顶部登陆
            logoutBtns: '#logoutLink'
        }); 

		this.onMsg('msg_show_endtime_CountDown',function(){
			return this.setCountDown();
		});

        this.loginer.getLogStart(function (isLogin){
            if (isLogin) {
                this.showUserInfo();// 如果已登陆,拉取空间数据.
                this.get('span.if_buy_yue').show();
            }
        });
        this.get('b.i-hp,s.i-qw,#xianhao1,#xianhao2,#xianhao3').tip('data-help', 1, false, 360);// 帮助说明
        this.get('ul.main-menu-container').setStyle('z-index:9999');
        this.get('div.main-menu').slideDrop('ul.main-menu-container',{
            onshow: function (m, b, mk){
                this.get('span.main-menu-up',b).removeClass('drop-hide');
            },
            onhide: function (m, b, mk){
                this.get('span.main-menu-up',b).addClass('drop-hide');
            }
        });
    },
    getusermoney:function(){
   	        this.ajax({  //更新最新用户资金信息
            url:Class.C('url-login-user')+"&rnd=" + Math.random(),
            end:function (data){
                if (data.error) {
                    this.setUserInfo('拉取用户信息失败, 请刷新重试!');
                }else{
                   var obj = eval("(" + data.text + ")");
 			       var code = obj.Resp.code;
 				   var r = obj.Resp.row;
 				   if (code =="0" ){
 					  Class.C('userMoney', parseFloat(r.usermoeny)||0);
	                  this.get('#money').html(parseFloat(r.usermoeny).rmb());
 				   }
  				}
            }
         });
   },
    setCountDown: function (){// 倒计时
        var info, data, clock, ctpl, ctpl2,  timebar, Y, gp;
        Y = this;
        info = this.get('#responseJson');
        
        if(Class.C('time_style')){
            ctpl = Class.C('time_style_ctpl');
            ctpl2 = Class.C('time_style_ctp2');
        }else{
            ctpl = '<em style="width:50px;"><b class="cm_red arial">{1}</b>天</em><em><b class="cm_red arial">{2}</b>小时</em><em><b class="cm_red arial">{3}</b>分</em>';
            ctpl2 = '<em style="width:50px;"><b class="cm_red arial">{2}</b>小时</em><em><b class="cm_red arial">{3}</b>分</em><em><b class="cm_red arial">{4}</b>秒</em>';
        }
        timebar = this.get('#countDownSpan');// 显示板
        if (info&&$("#responseJson #endTime").val()!='') {
          this.config = data = {
          		serverTime:$("#responseJson #serverTime").val(),
          		endTime:$("#responseJson #endTime").val()
          };
           Class.config('page-config', data);
          if (data) {
              clock = new this.lib.CountDown();
              gp = this.get('#countDownData').val().trim();// 格式为
																// value="时间#id,时间#id"
              if (gp!='') {// 高频倒计时
                  gp.split(',').each(function (d){
                      var s = d.split('#'),
                          o = this.get('#'+s[1]);
                      if (o.size()) {
                          clock.add({
                              endTime: s[0],
                              change:function (times, isEnd, msg, now){
                                  if (isEnd) {
                                      o.html('<span class="red"></span>');
                                  }else{
                                      o.html(times.slice(-4, -1).join(':').replace(/\b\d\b/g,'0$&'));
                                  }  
                              }
                          });
                      }
                  }, this);
              }
              var __oncd = {
                  endTime: data.endTime,
                  change:function (times, isEnd, msg, now){
                      var tpl = times[0] > 0 ? ctpl : ctpl2;
                      if (isEnd) {
                          timebar.html(''+(msg || '<span class="red"></span>'));
                          Class.config('isEnd', true);
                          Y.get('#all_form').next('div').addClass('b-end');
                      }else if(this.C('shownowtime')){
                          timebar.html(this.getDate(now).format('MM月DD日 hh:mm:ss'));
                      }else{
                          timebar.html( ctpl.format.apply(tpl, times).replace(/\b\d\b/g,'0$&'));
                      }                                
                  }                
              };
              if (this.C('shownowtime')) {
                  timebar.setStyle('background:#000;color:#00FF00;padding:1px');
              }
              if (timebar.size()) {// 常规倒计时
                  if (this.getDate(data.endTime)) {
                      clock.add(__oncd);                            
                  }else{
                      timebar.html('<span class="red">该彩种尚未开售</span>');
                  }                
              }
              this.onMsg('msg_endtime_change', function (endtime, now){
                  clock.end('loading...');// 不同玩法，时间的切换
                  __oncd.endTime = endtime;
                  this.get('#endTimeSpan').html(endtime);
                  clock.add(__oncd);
                  Class.config('isEnd', false);
                  Y.get('#all_form').next('div.con').removeClass('b-end');
                  clock.play(now);
              });
              clock.play(data.serverTime);
          }
      }
  }        
});
//公共弹出层
Class({
    Type: 'System_dlg',
    use: 'mask',
    ready: true,
    index:function (){
        var _alert, _confirm, _open, _open2, _example;
        if (this.get('#yclass_alert').size() == 0) {
            this.createHtml();
        }
        _alert = this.lib.MaskLay('#yclass_alert', '#yclass_alert_content');
        _alert.addClose('#yclass_alert_close', '#yclass_alert_ok','#yclass_confirm_11');
        this.get('#yclass_alert  div.tan_top').drag('#yclass_alert');
        
        _confirm = this.lib.MaskLay('#yclass_confirm', '#yclass_confirm_content', '#yclass_confirm_title');
        _confirm.addClose('#yclass_confirm_close', '#yclass_confirm_no', '#yclass_confirm_ok');
        this.get('#yclass_confirm div.tan_top').drag('#yclass_confirm');
        
        if (this.get('#example_stand').size() == 0) {
        	this.createHtml();
        }
        _example =  this.lib.MaskLay('#example_stand','#example_list');
        _example.addClose('#example_close','#example_ok');
        this.get('#example_stand div.tips_title').drag('#example_stand');
        
        _open = this.lib.MaskLay();
        _open2 = this.lib.MaskLay('',1001);
        this.extend('alert', function (a, b, c, noMask){// txt, callback, nobtn,
            _alert.noMask = noMask;
            _alert.pop(a, b, c);
            return _alert;
        });
        this.alert.close = function (){
            _alert.close();
        };
        
        this.extend('example', function(a,b,c){//内容、标题
        	this.get('#example_stand h5').html(b);
        	_example.pop(a.join(''), '');
        });
        
        this.extend('confirm', function (html, fn, title, noMask){
            var callback;
            if (title) {
                _confirm.title.html(title);
            }
            if (noMask) {
                _confirm.noMask = true;
            }
            if (this.isFunction(fn)) {
                callback = function (e, btn){
                    if (btn.id == 'yclass_confirm_ok') {
                        fn.call(this);
                    }
                };
            }
            _confirm.pop.call(_confirm, html, callback);
            return _confirm;
        });
        this.confirm.close = function (){
            _confirm.close();
        };
        this.extend('openUrl', function (url, w, h, noMask, scroll, showMove){
            if (noMask) {
                _open.noMask = true;
            }
            _open.open(url,{
                width: w,
                height: h,
                scroll: scroll,
                showMove: showMove !== false
            });
            _open.proxyTitle.drag(_open.panel);
            return _open;
        });
        //------消息特殊处理层-------//
        this.extend('openUrl2', function (url, w, h, noMask, scroll, showMove){
            if (noMask) {
            	_open2.noMask = true;
            }
            _open2.open(url,{
                width: w,
                height: h,
                scroll: scroll,
                showMove: showMove !== false,
                flag:'f1001'
            });
            _open2.proxyTitle.drag(_open2.panel);
            return _open2;
        });
        this.extend('closeUrl2', function (){
            _open2.close();
        });
        //------消息特殊处理层-------//
        this.extend('closeUrl', function (){
            _open.close();
        });
    },
    createHtml: function (){
    	var dlgHTML = '<div class="main_tan_yet" id="yclass_alert" style="display:none;">'
    				+'<div class="tan_top">'
    				+'<div class="tan_top_l">'
    				+'</div>'
    				+'<div class="tan_top_yet">'
    				+'<h3>温馨提示</h3>'
    				+'</div>'
    				+'<div class="tan_top_r" id="yclass_alert_close">'
    				+'<a href="#"></a>'
    				+'</div>'
    				+'</div>'
    				+'<div class="tan_mid">'
    				+'<span class="suc_reg" id="yclass_alert_content"></span>'
    				+'<a href="javascript:void(0);" class="t_a_qc" id="yclass_alert_ok" style="display:block;"><b>确认</b></a>'
    				+'</div>'
    				+'</div>'
    				+'<div class="main_tan_yet" id="yclass_confirm" style="display:none;">'
    				+'<div class="tan_top">'
    				+'<div class="tan_top_l">'
    				+'</div>'
    				+'<div class="tan_top_yet">'
    				+'<h3 id="yclass_confirm_title">温馨提示</h3>'
    				+'</div>'
    				+'<div class="tan_top_r" id="yclass_confirm_close">'
    				+'<a href="#"></a>'
    				+'</div>'
    				+'</div>'
    				+'<div class="tan_mid">'
    				+'<p class="qq_say" id="yclass_confirm_content">&nbsp;</p>'
    				+'<a href="javascript:void(0);" id="yclass_confirm_no" class="t_a_qx">取消</a><a href="javascript:void(0);" id="yclass_confirm_ok" class="t_a_qd">确定</a>'
    				+'</div>'
    				+'</div>'
		    	 	+'<div style="display:none;" id="open_iframe">'+
		    	    +' <div id="open_iframe_content"></div>'+
		    	    +'</div>'
		    	    +'<div class="cm_account_znxx1" id="example_stand" style="width:280px;display:none;">'
		    	    +'<div class="cm_znxx_text1">'
		    	    +'<div class="tips_title clear">'
		    	    +'<h5 class="cm_left">查看标准投注格式</h5>'
		    	    +'<span class="cm_right" id="example_close"></span>'
		    	    +'</div>'
		    	    +'<ul class="cm_dtmx_news1 arial" id="example_list" style="height:220px; overflow-x:hidden; overflow-y:scroll;">'
		    	    +' </ul>'
		    	    +'<div class="cm_znxx_num2"><a href="javascript:void(0);" class="cm_tkjl_cxbtn1 cm_block margin" id="example_ok">知道了</a></div>'
		    	    +'</div>'
		    	    +'</div>';
		    	    
        this.get(dlgHTML).insert();
    }
});

Class.extend('LoginAcc', function (){
	var L=Y.postMsg('msg_login').length;
	if(L<1){
		setTimeout(Y.LoginAcc,100);
	}else{
		var o = Y.lib.Loginer();
		if(Y.C('logoutinfo')==undefined){
			o.onlogout = function(){
				location="/";
			};
		}
		Y.postMsg('msg_login',function(){
		if(Y.C('logininfo')!=undefined){
			   Y.C('logininfo')();
		    }
		});
	};
});

Class.extend('loadHotUserByGame', function (gid){
	var hoturl="/cpdata/phot/" + gid + "/hotuser.json";
	$.ajax({
		url:hoturl,
		type : "get",
		dataType : "json",
		cache:false,
		success : function(d) {
			var html = '';
			if(gid >= 90){
				html += '<li class="cm_cur"><a href="javascript:void(0);" onclick="loadplist(Y.getInt($(\'#lotid\').val()),\'20110803\',Y.getInt($(\'#state\').val()),\'\',$(\'#fsort\').val(),$(\'#dsort\').val(),Y.getInt($(\'#ps\').val()),Y.getInt($(\'#pn\').val()))" class="a1">全部</a></li>';
			}else{
				html += '<li class="cm_cur"><a href="javascript:void(0);" onclick="showinfo($(\'#lotid\').val(),\'\',0,\'\',$(\'#fsort\').val(),$(\'#dsort\').val(),Y.getInt($(\'#ps\').val()),Y.getInt($(\'#pn\').val())  )" class="a1">全部</a></li>';
			}       			
			var code = d.Resp.errcode;
			if (code == "0") {
				var r = obj.Resp.u;       				
				r.each(function(rt,o) {
					var id=rt.id;
					var f =rt.f;
					var title="";//f  0 没有方案 1 有方案已经满员  2 有未满员的方案 
					var classname="";
					if (f == 2){
						title='赶快点我,参与认购 ';
						classname="on";
						
						if(gid >= 90){
    						html += '<li class="'+classname+'"><a class="a1" title="'+id+' '+title+'" onclick="loadplist($(\'#lotid\').val(),\'20110803\',$(\'#state\').val(),\''+id+'\',$(\'#fsort\').val(),$(\'#dsort\').val(),Y.getInt($(\'#ps\').val()),Y.getInt($(\'#pn\').val()))"  href="javascript:void(0)"> '+id+' </a></li>';
	        			}else{
    						html += '<li class="'+classname+'"><a class="a1" title="'+id+' '+title+'" onclick="showinfo($(\'#lotid\').val(),$(\'#expect\').val(),$(\'#state\').val(),\''+id+'\',$(\'#fsort\').val(),$(\'#dsort\').val(),Y.getInt($(\'#ps\').val()),Y.getInt($(\'#pn\').val()))"  href="javascript:void(0)"> '+id+' </a></li>';
        				}
					}												
				});
				$('#HotUserBox').html(html);	
			}       			
		},
		error : function() {
			return false;			
		}
	});	
});




var addmark=function(a) {
	var b = parent.location.href;
	if (window.sidebar) {
	window.sidebar.addPanel(a, b, "");
	} else if (document.all) {
	window.external.AddFavorite(b, a);
	} else if (window.opera && window.print) {
	return true;
	}
};

var setHpage=function(obj) {
	var url=window.location.href;
	try{
	obj.style.behavior='url(#default#homepage)';obj.setHomePage(url);
	}
	catch(e){
	if(window.netscape) {
	try {
	netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
	}
	catch (e) {
	alert("此操作被浏览器拒绝！\n请在浏览器地址栏输入“about:config”并回车\n然后将 [signed.applets.codebase_principal_support]的值设置为'true',双击即可。");
	}
	var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	prefs.setCharPref('browser.startup.homepage',url);
	}
	}
};
Class.extend('getCANCookie', function (sName){
    if(sName!=null){
        var aCookie = document.cookie.split("; ");
        for (var i=0; i < aCookie.length; i++){
	        var aCrumb = aCookie[i].split("=");
	        if (sName == aCrumb[0]) {
	        	return unescape(aCrumb[1]);
        	}
    	}
    }else{
    	return null;
    }
});

Class.extend('setCANCookie', function (sName, sValue,dExpires){
    var tmpdomain;
    tmpdomain=location.host.split(".");
    tmpdomain=tmpdomain[tmpdomain.length-2]+"."+tmpdomain[tmpdomain.length-1];
    if(sName!=null&&sValue!=null){
        if(dExpires==null){
        	document.cookie = sName + "=" + escape(sValue) + "; path=/;domain=" + tmpdomain;
        }else{
	        try{
	        	var exp = new Date();
	        	exp.setTime(exp.getTime() + dExpires*60*1000);
	        	document.cookie = sName + "=" + escape(sValue) + "; path=/;domain=" + tmpdomain + ";expires=" + exp.toGMTString();
	        }catch(e){}
        }
    }
});

Class.extend('deleteCANCookie', function (sName){
    if(sName!=null){
    	document.cookie = sName + "=" + "; path=/; expires=Fri, 31 Dec 1900 23:59:59 GMT;";
    }
});
function copyurl(url){
    if(window.clipboardData){
        window.clipboardData.setData('Text',url);
        Y.getTip().show('#fzurl','<h5>复制成功</h5>',1200).setIco(6);
    }else{
        window.getSelection();
        Y.getTip().show('#fzurl','<h5>您好，请选中地址用ctrl+c复制!</h5> <div id="fzurl_url">'+url+'</div>').setIco(7);
        var sel=document.createRange();
        sel.selectNode(Y.one('#fzurl_url'));
        window.getSelection().addRange(sel);
    }
};