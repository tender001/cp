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
		$("#cardnumber").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
            this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");//四位数字一空格
    	});
	}
	,editbank:function(){
		this.get('#edit_kh_info').click(function (){
			Y.get("#div1").show();
			Y.get("#div2").hide();
		});
	}
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.card,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var card = r.card;
					var name = r.name;
					var prov = r.prov;
					var city = r.city;
					$("#bankType").val(r.code);
					$("#province").val(prov);
					if (prov!=""){
						$("#province").change();
					}
					$("#city").val(city);
					Y.get("#bankname").val(name);
					Y.get("#cardnumber").val(card);
					if (card!=""){
						Y.get("#cardnumber").attr("disabled",true);
						Y.get("#cardnumber").attr("hide","yes");
					}
					if (card==""){
						Y.get("#div1").show();
						Y.get("#div2").hide();	
					}else{		
						if (city!=""){
							Y.get("#name").html(city+"市");
						}
						$("#name").append(name);
						Y.get("#card").html(card);
						Y.get("#div1").hide();
						Y.get("#div2").show();
					}
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
			if (Y.get("#bankType").val().trim()==""){
				Y.alert("请选择开户银行名称");
				return false;
			}
			if (Y.get("#province").val().trim()==""){
				Y.alert("请选择开户银行所在省或直辖市、自治区");
				return false;
			}
			if (Y.get("#city").val().trim()==""){
				Y.alert("请选择开户银行所在县市");
				return false;
			}
			if (Y.get("#bankname").val().trim()==""){
				Y.alert("请填写开户银行支行名称");
				return false;
			}
			if (Y.get("#cardnumber").val().trim()==""){
				Y.alert("请填写银行卡号码");
				return false;
			}
			if(Y.get("#cardnumber").attr("hide")!="yes"){
				if(isNaN(Y.get("#cardnumber").val().trim().replaceAll(" ",""))){
					Y.alert("请填写正确银行卡号码");
					return false;
				}	
			}
//			if (Y.get("#password").val().trim()==""){
//				Y.alert("请填写您的登录密码以确认您的身份");
//				return false;
//			}	
			var data = "";
			var cardnumber = ($("#cardnumber").val()).replace(/\s+/g,"");
			var city = Y.get("#city").val().trim();
			var province = Y.get("#province").val().trim();
			if (Y.get("#cardnumber").attr("disabled")){//修改银行卡信息
				data = $_user.key.bankCode + "=" + encodeURIComponent(Y.get("#bankType").val().trim())
				+ "&" + $_user.key.provid + "=" + encodeURIComponent(province.replace(/\-/g,""))
				+ "&" + $_user.key.cityid + "=" + encodeURIComponent(city.replace(/\-/g,""))
				+ "&" + $_user.key.bankName + "=" + encodeURIComponent(Y.get("#bankname").val().trim())
//				+ "&" + $_user.key.upwd + "=" + encodeURIComponent(Y.get("#password").val().trim())
				+ "&" + $_user.key.tid + "=1"
				+ "&rnd=" + Math.random();
				
			}else{//设置银行卡信息
				data = $_user.key.bankCode + "=" + encodeURIComponent(Y.get("#bankType").val().trim())
		
				+ "&" + $_user.key.bankCard + "=" + encodeURIComponent(cardnumber)
				+ "&" + $_user.key.provid + "=" + encodeURIComponent(province.replace(/\-/g,""))
				+ "&" + $_user.key.cityid + "=" + encodeURIComponent(city.replace(/\-/g,""))
				+ "&" + $_user.key.bankName + "=" + encodeURIComponent(Y.get("#bankname").val().trim())
//				+ "&" + $_user.key.upwd + "=" + encodeURIComponent(Y.get("#password").val().trim())
				+ "&rnd=" + Math.random();
			}					
			Y.ajax({
				url : $_user.modify.card,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {	
						Y.alert(desc);
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
//					Y.get("#password").val("");
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