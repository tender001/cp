function user_login() {
	var uid = $("#uid").val();
	var pwd = $("#pwd").val();
	var yzm = $("#yzm").val();

	Tool.ajax('login.aspx?fid=u_login',
			{uid:uid,pwd:pwd,yzm:yzm},
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0 ){
					location.href = 'main.jsp';
				} else {
					Tool.warn(desc);
				}
			}
		);
};
function form_reset() {
	$("#uid").val("");
	$("#pwd").val("");
	$("#yzm").val("");
};
function freshYZM(obj){
	obj.src = "yzm.jo?r=" + Math.random();
};