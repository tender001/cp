Class({// 用户登录
	 ready: true,
    index:function (config){
    	var LY=this;
    	$("#uid1").focus();
	    this.get('#loginbtn1').click(function (){
	    	LY.doLogin();
        });
	    this.get('#pwd1').keydown(function (e, Y){
    	 if (e.keyCode == 13) 
            { 
                e.keyCode = 9;
                e.returnValue = false;
                Y.doLogin();
            }
        });
	    this.get('#uid1').blur(function(){
            return false;
	    });
	   
    },
   
    doLogin:function() {
    	var DY=this;
    	var u = $("#uid1").val();
    	var p = $("#pwd1").val();
    	var dis = $("#dis");

    	var um = "请输入用户名！";
    	var pm = "请输入密码！";
    	var msg = '';
    	if (!p.length) {
    		msg = pm;
    	}

    	if (!u.length) {
    		msg = um;
    	}

    	if (msg.length > 0) {
    		dis.html(msg);
    		dis.show();
    		if (msg == um) {
    			$("#uid1").focus();
    		} else if (msg == pm) {
    			$("#pwd1").focus();
    		}
    		return false;		
    	} else {
    		var data = $_user.key.uid + "=" + encodeURIComponent($("#uid1").val()) + "&" + $_user.key.pwd + "=" + encodeURIComponent($("#pwd1").val());
    		Y.ajax({
    			type : 'POST',
    			data : data,
    			url : Y.C('url-login-op'),
    			end : function(d) {
					var obj = eval("(" + d.text + ")");
  					var code = obj.Resp.code;
    					if (code =="0") {
    						DY.acceptLoginMsg();
    					} else {
    						DY.acceptLoginMsg(obj.Resp.desc); 
    					}
    			}
    		});
    	}
    	return true;
    },
    acceptLoginMsg:function(err){
    	var dis = $("#dis");
            if (err) {
            	dis.html(err);
        		dis.show();
                $("#uid1").focus();  
            }else{
            	var backurl =location.search.getParam('backurl');
            	
            	if (backurl == ""){}
            	if(backurl=="chongzhi"){
            		location.href ="/account/chongzhi.html";
            	}else if(backurl=="myaccount"){
            		location.href ="/account/myaccount.html";
            	}else if(backurl=="tikuan"){
            		location.href ="/account/tikuan.html";
            	}else if(backurl=="orderlist"){
            		location.href ="/account/orderlist.html";
            	}else if(backurl=="sssq"){
            		location.href ="/huodong/sssq.html";
            	}else{
            	location.href ="/";
            	}
            }
            window.passportloginmsg = false;
    },
    cl:function() {
    	$("#dis").hide();
    }
});