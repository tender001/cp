/**
 * 
 */
function modify(){
	    $("#submitok").click(function (){
			var opwd = $("#curPwd").val();
			var npwd = $("#newPwd1").val();
			var connewpwd = $("#newPwd2").val();
			
			if (opwd==""){
				showTips('请输入当前用户密码');
				$("#opwd").focus();
				return false;
			}
			if (npwd==""){
				showTips('新密码不能为空');
				$("#npwd").focus();
				return false;
			}
			if(npwd.length < 6||npwd.length > 20){
				showTips('请设置您的密码，6-20个字符');
				$("#npwd").focus();
				return false;
			}
			if (connewpwd==""){
				showTips('确认新密码不能为空');
				$("#connewpwd").focus();
				return false;				
			}
			if (npwd!=connewpwd){
				showTips('您两次输入的密码不一致，请重新输入');
				$("#connewpwd").focus();
				return false;
			}else{
			$.ajax({
				url: $_user.modify.pwd,
				type : "POST",
				dataType : "json",
				data : $_user.key.newValue + "=" + encodeURIComponent(npwd)
				+ "&" + $_user.key.upwd + "=" + encodeURIComponent(opwd)
				+ "&rnd=" + Math.random(),	
				success : function(xml) {
					var R = xml.Resp;
					var code = R.code;
					var desc = R.desc;
					if (code == "0") {
						var result="code"
						location.href="/user/showresult.html?result="+result;
					} else {
						if (code=="1"){
							showTips(desc);
						}else{
							showTips(desc);
						}
					}
					$("#opwd").val("");
					$("#npwd").val("");
					$("#connewpwd").val("");
				},
				error : function() {
					showTips('您所请求的页面有异常！');
					return false;
				}					
			});
	    }
            return false;
        });



	    var tipsDiv_01 = "";
	    function showTips(tips) {
	    	tipsDiv_01 = '<div class="tipsClass" id="tipsDiv_">' + tips + '</div>';
	    	$('body').append(tipsDiv_01);
	    	
	        $('div.tipsClass').css({
	            'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
	            'left': ($(window).width() - 245) / 2 + "px",
	            'border': '2px solid #E6D30A',
	            'position': 'absolute',
	            'padding': '5px',
	            'background': '#FFF588',
	            'font-size': '12px',
	            'margin': '0 auto',
	            'line-height': '25px',
	            'z-index': '100',
	            'text-align': 'center',
	            'width': '250px',
	            'color': '#6D270A',
	            'opacity': '0.95'
	        });
	        setTimeout(function(){
	        	$('div.tipsClass').hide();
	        },2000);
	    	$('div.tipsClass').click(function(){$(this).hide()});

	    }
}

