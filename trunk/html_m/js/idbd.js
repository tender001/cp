	
//首先检查有没有绑定姓名和身份证
function showinfo(){
		$.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			success : function(xml) {
				var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
				if (code == "0") {	
					var r= R.row;
					var rname = r.rname;
					var idcard = r.idcard;
					if(rname == ""){
						$("#div1").show();
						$("#div2").hide();
						$("#div3").hide();
					}else {
						$("#div1").hide();
						$("#div2").show();
						$("#div3").hide();
						$("#idcard").html(idcard);
						$("#idname").html(rname);
					}
				}else if(code == "1"){
					$("#div1").hide();
					$("#div2").hide();
					$("#div3").show();
				}
				
			},
			error : function() {
				alert("网络异常！");
			}
		});
	}


function setdata(){
//	alert("网络ds！");
		if ($.trim($("#truename").val())==""){
			showTips('请输入您的真实姓名');
			return false;
		}
		if ($.trim($("#idnumber").val())==""){
			showTips('请输入你的身份证号码');
			return false;
		}
		if ($.trim($("#password").val())==""){
			showTips('请输入您的登录密码以确认您的身份');
			return false;
		}
		$.ajax({
			url : $_user.modify.name,
			type : "POST",
			dataType : "json",
			data : $_user.key.realName + "=" + encodeURIComponent($.trim($("#truename").val()))
			+ "&" + $_user.key.idCardNo + "=" + encodeURIComponent($.trim($("#idnumber").val()))
			+ "&" + $_user.key.upwd + "=" + encodeURIComponent($.trim($("#password").val()))
			+ "&rnd=" + Math.random(),
			success : function(xml) {
				var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
				
				if (code == "0") {
					var result="idcard"
					location.href="/user/showresult.html?result="+result;
//					成功
				} else {
					showTips(desc);
				}
			},
			error : function() {
				showTips('您所请求的页面有异常！');
				return false;
			}
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