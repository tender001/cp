Class({
    ready: true,
    index: function (){
    	P=this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
	    location="/";
	}
	,showinfo:function(){
		P.selectinfo();
		P.loadRecod();
	}
	,selectinfo:function(){
		$("#pwdselect_0").val("");
		$("#pwdanswer_0").val("");	
		$("#pwdselect_1").val("");
		$("#pwdanswer_1").val("");
		$("#oldAnswer").val("");	
		$("#nqusetion").val("");
		Y.ajax({
			url : $_user.url.protect,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var crequest = r.crequest;
					if (crequest==""){
						$("#div1").show();
						$("#div2").hide();
						$("#div3").hide();
					}else{
						$("#nqusetion").val(crequest);
						$("#div1").hide();
						$("#div3").hide();
						$("#div2").show();
					}				
				} else {
					if (code=="1"){
						parent.window.Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
					
				}			
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
			}
		});
	}
	
	,loadRecod:function(){
		$("#conform_btn_0").bind({
			click:function(){
				if ($.trim($("#pwdselect_0").val())==""){
					Y.alert("请选择密码保护问题");
					$("#pwdselect_0").focus();
					return false;
				}
				if ($.trim($("#pwdanswer_0").val())==""){
					Y.alert("请输入您的答案");
					$("#pwdanswer_0").focus();
					return false;
				}
				Y.ajax({
					url : $_user.modify.protect,
					type : "POST",
					dataType : "json",
					data : $_user.key.rid + "=" + encodeURIComponent($.trim($("#pwdselect_0").val()))
					+ "&" + $_user.key.aid + "=" + encodeURIComponent($.trim($("#pwdanswer_0").val()))
					+ "&rnd=" + Math.random(),
					end : function(d) {
						var obj = eval("(" + d.text + ")");
						var code = obj.Resp.code;
						var desc = obj.Resp.desc;
						if (code == "0") {	
							Y.postMsg('msg_login', function() {						
								 location.href='safecenter.html';
							});
						} else {
							if (code=="1"){
								parent.window.Y.postMsg('msg_login', function() {						
									window.location.reload();			
								});
							}else{
								Y.alert(desc);
							}
						}
					},
					error : function() {
						Y.alert("您所请求的页面有异常！");
					}
				});
			}		
		});		
		
		$("#conform_btn_1").bind({
			click:function(){
				if ($.trim($("#pwdselect_1").val())==""){
					Y.alert("请选择新的密码保护问题");
					$("#pwdselect_1").focus();
					return false;
				};
				if ($.trim($("#pwdanswer_1").val())==""){
					Y.alert("请输入您的新答案");
					$("#pwdanswer_1").focus();
					return false;
				};
				if ($.trim($("#oldAnswer").val())==""){
					Y.alert("请输入您的旧答案");
					$("#oldAnswer").focus();
					return false;
				};
				
				Y.ajax({
					url : $_user.modify.protect,
					type : "POST",
					dataType : "json",
					data : $_user.key.rid + "=" + encodeURIComponent($.trim($("#pwdselect_1").val()))
					+ "&" + $_user.key.aid + "=" + encodeURIComponent($.trim($("#pwdanswer_1").val()))
					+ "&" + $_user.key.newValue + "=" + encodeURIComponent($.trim($("#oldAnswer").val()))
					+ "&" + $_user.key.tid + "=1"
					+ "&rnd=" + Math.random(),
					end : function(d) {
						var obj = eval("(" + d.text + ")");
						var code = obj.Resp.code;
						var desc = obj.Resp.desc;
						if (code == "0") {	
							Y.postMsg('msg_login', function() {						
								 location.href='safecenter.html';
							});
						} else {
							if (code=="1"){
								parent.window.Y.postMsg('msg_login', function() {						
									window.location.reload();			
								});
							}else{
								Y.alert(desc);
							}
						}
					},
					error : function() {
						Y.alert("您所请求的页面有异常！");
					}
				});
			}
		});
	}
});