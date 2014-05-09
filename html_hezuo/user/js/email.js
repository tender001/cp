/**
 * 邮箱绑定
 */
Class({
	ready: true,

    index:function (config){
    	var uid=location.search.getParam('uid');
    	var vcode=location.search.getParam('vcode');
    	if ($.trim(uid)=="" || $.trim(vcode)==""){
    		alert("参数错误,请检查。");
    		location.href="/";
    		return false;
    	}
    	this.show();
    }
	
	,show:function(){
		var data ="flag=0&uid=" + encodeURIComponent($.trim(location.search.getParam('uid')))+ "&yzm=" + encodeURIComponent($.trim(location.search.getParam('vcode')))+ "&rnd=" + Math.random();
		$.ajax({
			url : $_user.url.bindyz,
			type : "POST",
			dataType : "json",
			data : data,
			success : function(d) {
				var code = d.Resp.code;
				var desc = d.Resp.desc;
				if (code == "0") {
					$("#u1").html($.trim(location.search.getParam('uid')));
					$("#email").html(desc);
					$("#div1").show();
					$("#div2").hide();
				} else {
					$("#u2").html($.trim(location.search.getParam('uid')));
					$("#div1").hide();
					$("#div2").show();
				}			
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});
	}
});

