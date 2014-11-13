/**
 * 修改密码
 */

Class({
	ready: true,
    index:function (config){
    	this.LoginAcc();
	    this.get('#submit').click(function (){
			var opwd = Y.get('#opwd').val();
			var npwd = Y.get('#npwd').val();
			var connewpwd = Y.get('#connewpwd').val();
			if (opwd==""){
				Y.alert("密码不能为空");
				$("#opwd").focus();
				return ;
			}
			if (npwd==""){
				Y.alert("新密码不能为空");
				$("#npwd").focus();
				return ;
			}
			if (connewpwd==""){
				Y.alert("确认新密码不能为空");
				$("#connewpwd").focus();
				return ;				
			}
			if (npwd!=connewpwd){
				Y.alert("您两次输入的密码不一致，请重新输入");
				$("#connewpwd").focus();
				return;
			}
			Y.ajax({
				url: $_user.modify.pwd,
				type : "POST",
				dataType : "json",
				data : $_user.key.newValue + "=" + encodeURIComponent(npwd)
				+ "&" + $_user.key.upwd + "=" + encodeURIComponent(opwd)
				+ "&rnd=" + Math.random(),	
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
					if (code == "0") {
						Y.get("#div0").hide();
						Y.get("#div1").show();
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
					$("#opwd").val("");
					$("#npwd").val("");
					$("#connewpwd").val("");
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}					
			});
            return false;
        });
    }
});



