function DoLogin() {
    var uname = $("#userId").val();
    var upwd = $("#passwd").val();
    var t =0;
    if($("#logintype")) t = $("#logintype").val();
    if (uname == "") { 
    	$("#userId").focus();
        showTips('请输入合法的用户名!');
        return;
    }else if (upwd == "") {
    	$("#passwd").focus();
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
				history.go(-1);
				
				
			}else{
				showTips(desc);
			}
			$("#userId").val("");
			$("#passwd").val("");
          },
          error:function(){
        	  showTips('网络异常');
          }
    	});
    }
}