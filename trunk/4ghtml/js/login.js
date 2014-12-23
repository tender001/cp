function loadLogin() {
//    $(".alert-login").html("账户 <input style='width:150px' id='auth_userId' name='auth_userId' type='text' value='' /><br>" +
//    		"密码 <input style='width:150px' id='auth_passwd' name='auth_passwd' type='password' value='' /><br>" +
//    		"<input type='submit' id='divLogin' class='mBtnCheck' onclick='MiniLogin()' value='登录' />&nbsp;" +
//    		"<input type='button' onclick=\"location.href='/user/reg.html'\" style='width:70px;' class='mBTN' value='免费注册' />&nbsp;"
//    		);
//    
    $(".alert-login").html("<h2>亲~请登录</h2><div class=\"m-reg\"><ul class=\"reg\"><li><label>账号</label><input " +
    		"type=\"text\" placeholder=\"手机号/4-16个字符\" id='auth_userId'></li><li><label>密码</label><input " +
    		"type=\"password\" placeholder=\"6-20个字符\"  id='auth_passwd'></li> </ul></div><a class=\"btn btn-true\" " +
			"onclick='MiniLogin()'>登录</a><p class=\"alert-login-more\"><a  class='miss' href=\"/user/reg.html\">免费注册</a></p>")

	  
      
          
              
              
         
      
      
      
      
    $("#headlogintd").html("<input type=button id=\"headLogin\" onclick='loginHdl()' class='mBTN' value='登录' style='width:60px' />" +
    		"<input type=button onclick=\"location.href='/user/reg.html'\" class='mBTN' value='注册' style='width:60px' />");
}
function MiniLogin() {
    var uname = $("#auth_userId").val();
    var upwd = $("#auth_passwd").val();
    var t =0;
    if($("#logintype")) t = $("#logintype").val();
    if (uname == "") { 
    	$("#auth_userId").focus();
        showTips('请输入合法的用户名!');
        return;
    }else if (upwd == "") {
    	$("#auth_passwd").focus();
    	showTips('请输入合法的密码!');
        return;
    }else{
	var data = $_user.key.uid +"=" + encodeURIComponent(uname)+ "&" + $_user.key.pwd + "=" + encodeURIComponent(upwd);
    $.ajax({
        type: "POST",
        cache: false,
        url: $_user.url.login,
        data: data,
        dataType : 'json',
        success:function (d){ 
			var code = d.Resp.code;
			var desc = d.Resp.desc;		
			if (code == "0") {
				if(t == undefined || t==0){
					UserInfo();
				} else if (t == 1){
					UserMoney();
				} else if(t == 2){
					location.href = "/";
				}
				
			}else{
				
				showTips(desc);
			}
			$("#auth_userId").val("");
			$("#auth_passwd").val("");
          },
          error:function(){
        	  showTips('网络异常');
          }
    	});
    }
}
function showLogin() {
     loadLogin();
    
    
    var overlayID = "_t_overlay";
    if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
    $('.overlay').css({ 'height': ($("body").height()) + 'px', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();

    $("#Login_Panel").css("top", ($(window).scrollTop() + ($(window).height() - 120) / 4) + "px");
    $(window).scroll(function() {
        var offsetTop = ($(window).scrollTop() + ($(window).height() - 120) / 4) + "px";
        $("#Login_Panel").animate({ top: offsetTop }, { duration: 300, queue: false });
    });
    if(Storage.Get("LoginUN_cookie")!=null){
		$("#auth_userId").val(Storage.Get("LoginUN_cookie"));
    }
	$('#Login_Panel').slideDown('fast');
}
//关闭登录层
function closeLogin() {
    $('.overlay').hide();
    $('#Login_Panel').slideUp('fast');
}
//检查是否登录
function chklogin(t) {
   $.ajax({
       url: $_user.url.checklogin,
       dataType:'json',
       success:function (d){
    	   	if(t != undefined && isFunction(t)){
				t.call(this,d);
			} else {
				var code = d.Resp.code;
				if (code == 0) {
					if(t == undefined || t == 0||t=="need"){
						UserInfo();
					} else if(t == 1){
						UserMoney();
					}
					if($("[mark=isLogin] p")){
						$("[mark=isLogin] p").html("我的");
						$("[mark=isPay] p").html("充值");
						$("[mark=isPay] h3").attr("class","cz");
						$("[mark=isLogin] a,.user-login,#toplogin").attr("href","/account/");
						$("[mark=isPay] a").attr("href","/account/pay.html");
					}
				}else{
					if($("[mark=isLogin] p")){
						$("[mark=isLogin] p").html("登陆");
						$("[mark=isPay] p").html("注册");
						$("[mark=isPay] h3").attr("class","reg");
						$("[mark=isLogin] a,.user-login,#toplogin").attr("href","/user/login.html?bak=1");
						$("[mark=isPay] a").attr("href","/user/reg.html"); 
					}
					if(t=="need"){
						loginHdl();
					}
					
					if($(".uinfo"))$(".uinfo").html("您尚未登录，请先"+"<a href=\"javascript:void(0)\" onclick=\"loginHdl()\">登录</a>");
					 loadLogin();
				}
			}
       },
       error:function(){
    	   showTips('网络故障!');
    	   return false;
       }
   });
}
function UserMoney() {
	 $.ajax({
        url: $_user.url.base+"&rnd=" + Math.random(),
        dataType:'json',
        success:function (d){
        	var code = d.Resp.code;
        	if(code == 0){
	        	var r = d.Resp.row;
				var uname = r.nickid;
				var umoney = r.usermoeny;
				
				$("#username").html(uname);
				$("#useramount").html(umoney+"元");
				$("#toplogin").html(uname);
				$("#yue").html(umoney);
//				$(".uinfo").html("欢迎您："+"<font color=\"#00f\" id=\"c_username\">"+uname+"</font>"+"余额：￥"+"<font color=\"#f00\" id=\"c_money\">"+umoney+"</font>"+"元");
				if($("#p_uname"))$("#p_uname").html(uname);
			    $("#headlogintd").html("<a href=\"/user/account.html\" id=\"usname\">" + uname + "</a>&nbsp;<a onclick=\"location.href='/user/addmoney.html'\" class='mBTN'>充值</a><a onclick='logout()' class='mBTN'>退出</a>");
			    closeLogin();
        	} else {
        		showTips(d.Resp.desc);
        	}
        },
        error:function(){
     	   showTips('网络故障!');
     	   return false;
        }
    });
}
function UserInfo() {
	 $.ajax({
        url: $_user.url.base+"&rnd=" + Math.random(),
        dataType:'json',
        success:function (d){
        	var code = d.Resp.code;
        	if(code == 0){
        		var r = d.Resp.row;
				var name = r.nickid;
				var umoney = r.usermoeny;
				$("#toplogin").html(name);
				$("#yue").html(umoney);
				if(Storage.Get("LoginUN_cookie")==null){
					Storage.Set("LoginUN_cookie",name,60*24*30);
         		 }else{
         			if(Storage.Get("LoginUN_cookie")!=name){
         				Storage.Set("LoginUN_cookie",name,60*24*30);
         			}
         		 }  
				
				$("#isLogin").html('<a class="nav-list" href="/user/login.html"><h3 class="login"></h3><p>登录</p></a>')
			    $("#headlogintd").html("<a href=\"/user/account.html\" id=\"usname\">" + name + "</a>&nbsp;<a onclick=\"location.href='/user/account.html'\" class='mBTN'>账户</a><a onclick='logout()' class='mBTN'>退出</a>");
			    closeLogin();	 
        	}else{
        		showTips(d.Resp.desc);
        	}
        },
        error:function(){
     	   showTips('网络故障!');
     	   return false;
        }
    });
}

//退出登录
function logout() {
	 $.ajax({
        url: $_user.url.loginout,
        type: "get",
        dataType:'json',
        success:function (d){
			$(".uinfo").html("您尚未登录，请先"+"<a href=\"javascript:void(0)\" onclick=\"loginHdl()\">登录</a>");
//			loadLogin();
			location.href="/";
        },
        error:function(){
     	   showTips('网络故障!');
     	   return false;
        }
    });
}