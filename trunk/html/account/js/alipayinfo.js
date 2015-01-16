//银行卡绑定
Class({
    ready: true,
    index: function (){
    	P=this;
    	Y.C('logininfo',this.show);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
	    location="/";
	}
	,show:function(){
		P.showinfo();
		P.setdata();
		P.editbank();
		
	}
	,editbank:function(){
	
	}
	,autocard:function(){
		this.get('#alipayAccount').blur(function (){
			  var re = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|18[0-9])[0-9]{8}$/;
              var re1 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
              var alipy=$('#alipayAccount').val();
              if (!re.test(alipy)&& !re1.test(alipy)){
            	  Y.alert( "支付宝账户输入有误。");
                  return;
              }
                
         
		});
	}
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var rname = r.rname;
					var alipay = r.alipay;
					if (rname == "") {
						Y.get("#div2,#div3").hide();
						Y.get("#div1").show();
						
					}else if(alipay==""){
						Y.get("#div1,#div3").hide();
						Y.get("#div2").show();
					}else{
						Y.get("#div2,#div1").hide();
						Y.get("#div3").show();
						Y.get("#card").html(alipay);
					}	
					Y.get("#smname").html(rname)
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}			
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
				return false;
			}
		});	
	}
	,setdata:function(){
		P = this;
		this.get('#submit').click(function (){
			 var re = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|18[0-9])[0-9]{8}$/;
             var re1 = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
             var alipy=$('#alipayAccount').val();
             if (!re.test(alipy)&& !re1.test(alipy)){
           	  Y.alert( "支付宝账户输入有误。");
                 return;
             }
//			if (Y.get("#password").val().trim()==""){
//				Y.alert("请填写您的登录密码以确认您的身份");
//				return false;
//			}	
			var data = "";
			data = $_user.key.bankCard + "=" + encodeURIComponent(Y.get("#alipayAccount").val().trim())
			
			Y.ajax({
				url : $_user.modify.alipay,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {	
						Y.alert(desc);
						Y.get("#card").html($("#alipayAccount").val());
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
					P.showinfo();
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});			
		});
	}
});