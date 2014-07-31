/**
 * 彩票充值服务
 */
Class('App', {
    use: ' mask, dataInput',
	ready: true,
    index:function (config){
    	P=this;
    	this.LoginAcc();
    	this.showSafe();
    	this.get(".bank_select").click(function(){
    		$("#addmoney").blur();
//    		$(".bank_tan").toggle();
  		});
//  		this.get(".bank_select").mouseout(function(){
//  			Y.get(".bank_tan").hide();
//  		});
  		this.get(".bank_tan").mouseover(function(){
  			Y.get(".bank_tan").show();
  		});
  		this.get("#closeBankdiv").click(function(){
//  			Y.get(".bank_tan").hide();
  		});
//  		this.get(".bank_tan").mouseout(function(){
//  			Y.get(".bank_tan").hide();
//  		});
  		//this.btnbind();
  		Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	
    }
	,logoutinfo:function(){
	    location="/";
	},
	showSafe : function(){
    	Y.ajax({
            url:Class.C('url-login-safe')+"&rnd=" + Math.random(),
            end:function (data){
            	 if (data.error) {
            		 Y.alert("拉取用户信息失败, 请刷新重试！");
                 }else{
                	 var obj = eval("(" + data.text + ")");
            		 var code = obj.Resp.code;
    					   if (code==0){
    						 var u = obj.Resp.row;
    							 var rname = u.rname;
    							var b=getcookie("smrz_tk"); // cookie
    							 if(rname==""&&b==""){
    								var smrz = Y.lib.MaskLay('#smrz', '#smrzcontent');
    								smrz.addClose('#smrzclose','#wrapLayCloseBtn', '#wrapLayClose');//'#smreturn'
    						        Y.get('#smrz  div.tantop').drag('#smrz');
    						        smrz.pop();
    						        $("#smno,#smname,#smpwd").click(function(){
    						        	$("#smerror").parent().hide()
    						        })
    						        Y.get("#smreturn").click(function(){
    						        	setcookie("smrz_tk","no");
    						        	smrz.close();
    						        })
    						        Y.get('#smsub').click(function (){
    									var reg=/^[\u4e00-\u9fa5]{2,5}$/i; 
    									var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/; 
    									var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    									var truename=$.trim($("#smname").val());
    									var idnumber =$.trim($("#smno").val());
    									var smpwd=$.trim($("#smpwd").val());
    									
    									var cmerror =$("#smerror");
    									if (truename==""){
    										cmerror.html("请输入您的真实姓名").parent().show();
    										return false;
    									}
    									if(!reg.test(truename)){
    										cmerror.html("姓名必须为2到5个汉字").parent().show();
    										return false;
    									}
    									var namelen=truename.length;
    									var len=0;
    									for(var i=0;i<namelen; i++){
    										len +=truename.split(truename[i]).length;
    									}
    									if(len>namelen*3){
    										cmerror.html("请输入您的真实姓名").parent().show();
    										return false;
    									}
    										if (!(isIDCard1.test(idnumber))&&!(isIDCard2.test(idnumber)))
    									   {  
    									       cmerror.html("身份证输入不合法").parent().show();
    									       return  false;  
    									   }  
    									if (idnumber==""){
    										cmerror.html("请输入你的身份证号码").parent().show();
    										return false;
    									}
    									if(smpwd==""){
    										cmerror.html("请再次输入你的身份证号码").parent().show();
    										return false;
    									}
    									if(idnumber!= smpwd){
    										cmerror.html("你两次输入的身份证号码不一致").parent().show();
    										return false;
    									}
    									

    									Y.ajax({
    										url : $_user.modify.name,
    										type : "POST",
    										dataType : "json",
    										data : $_user.key.realName + "=" + encodeURIComponent($.trim($("#smname").val()))
    										+ "&" + $_user.key.idCardNo + "=" + encodeURIComponent($.trim($("#smno").val()))
    										+ "&" + $_user.key.idCardTwo + "=" + encodeURIComponent($.trim($("#smno").val()))
    										+ "&" + $_user.key.upwd + "=" + encodeURIComponent($.trim($("#smpwd").val()))
    										+ "&yzm=" + encodeURIComponent($.trim($("#verifycode").val()))
    										+ "&rnd=" + Math.random(),
    										end  : function (d){
    											var obj = eval("(" + d.text + ")");
    								   		    var code = obj.Resp.code;
    								   		    var desc = obj.Resp.desc;
    											if (code == "0") {	
    											 	Y.ajax({
    											 	     url:'/phpu/p.phpx?fid=u_hdssq',
    											 	     end:function (data){
    											 	         if (data.error) {
    											 	        	Y.alert(desc);
    											 	        	return false;
    											 	         }else{
    											 	       	   var obj2 = eval("(" + data.text + ")");
    											 	       	var  wrapLay = Y.lib.MaskLay('#wrapLay', '#wrapLayConent');
    										            	wrapLay.addClose('#wrapLayCloseBtn', '#wrapLayClose');
    										                 Y.get('#yclass_alert  div.tantop').drag('#wrapLay');
    										               
    										 	 		       if(obj2.Resp.code==0){
    										 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">恭喜您：<br />已获取3元彩金<a style="color:#145fab;text-decoration:underline" href="/account/myaccount.html" target="_blank" >点击查看</a></div>');
    										 	 		    	
    										 	 		    	  wrapLay.pop();
    										 	 		       }else if(obj2.Resp.code==2){
    										 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">已实名<br/>新用户<a  href="/account/mobile.html" target="_blank" style="color:#145fab;text-decoration:underline">绑定手机</a>后系统赠送3元彩金</div>');
    										 	 		    	
    										 	 		    	  wrapLay.pop();
    										 	 		       }else{
    										 	 		    	 cmerror.html(desc).parent().show();
    										 	 		       }

    											 	         }
    											 	     }
    											 	   });
    											} else {
    												cmerror.html(desc).parent().show();
    											}
    											P.showinfo();
    										},
    										error : function() {
    											Y.alert("您所请求的页面有异常！");
    											return false;
    										}
    									});
    						        });
    							 }else{
    							
    							 }
    							 
    							
    					   }
                 }
            }
    	});
    }
	,showinfo:function(){
		P.ajax({
			type : 'POST',
			url : "/phpu/allyinfo.phpx",
			end : function(res) {
				var obj = eval("(" + res.text + ")");
				if(obj.type==1){//支付宝登录
					$("#kq").hide();
					$("#creditCard").hide();
					$("#mobileCard").hide();
					changdiv(21);
				}else{
					$("#kq").show();
					$("#creditCard").show();
					$("#mobileCard").show();
					var b=getcookie("bank_cookie"); // cookie
					if (b!=undefined){
						//默认充值通道
//						$(".bank_tan").hide();
						changdiv(b);
//						$("#"+"bank_div_"+b+"").addClass("cur");
					}
				}
			}
		});
		P.btnbind();
	}
	,btnbind:function(){
   	 	this.get('#submit').click(function (){
   			if (Y.get("#addmoney").val()<10){
   				Y.alert('存入金额至少为10元');
   				$("#addmoney").focus();
   				return false;
   			}
   			if (Y.get("#addmoney").val()>5000000){
   				Y.alert('存入金额最高不能超过500万元人民币');
   				return false;
   			}
   			if (Y.get("#bankid").val()=="" || Y.get("#bankid").val()=="0"){
   				Y.alert("请选择充值银行");
   				return false;
   			}
   			//Y.openUrl('suc.html',440,218);
   			setcookie("bank_cookie",Y.get("#bid").val());
   			Y.openUrl('tishi.html',502,194);
   			Y.get("#bankform").attr("action",$_user.url.addmoney);
   			$("#bankform").submit();
   	 	});
   	 $("#addmoney").focus();
	}
});


var changdiv=function(divnum){
	var bankid=divnum;
	var bconfig=0;
	//if(bankid==20) bconfig = 1;
	//else if (bankid==21) bconfig = 3;
	//else bconfig = 3;
	var bankname=" ";
	var banktype="";
	var turl="/cpdata/sys/pay/bankconfig.xml";
	
	
	if(bankid!=" "&&($("#"+"bank_div_"+divnum+"").attr("class")!="cur")){
		$("#bankdiv li").removeClass("cur");

		$("#"+"bank_div_"+divnum+"").addClass("cur");
		$.ajax({
			url : turl+ "?rnd=" + Math.random(),
			type : "get",
			dataType : "xml",
			success : function(xml) {
				var r = $(xml).find("row");			
				r.each(function() {
					var tmpbankvalue = $(this).attr("bankvalue");
					var tmpbankconfig = $(this).attr("bankconfig");
					var tmpbankname = $(this).attr("bankname");
					var tmpbanktype = $(this).attr("banktype");
					if (parseInt(tmpbankvalue)== parseInt(bankid)){
			        	 bconfig = tmpbankconfig;
						 bankname = tmpbankname;
						 banktype = tmpbanktype;  
						 return;
			        }  
				});
					
					
						Y.get("#bankid").val(bconfig);
						Y.get("#bid").val(bankid);
						Y.get("#banktype").val(banktype);
					
					for(var i=1;i<22;i++){
						if(i!=divnum){
							Y.get("#bank_info_"+i).hide();
							//				
						}else{
							if(bconfig==1){
								Y.get("#bankconn").html("快钱");
							}else if(bconfig==2){
								Y.get("#bankconn").html("财付通");
							}else if(bconfig==3){
								Y.get("#bankconn").html("支付宝");
							}else if(bconfig==11){
								Y.get("#bankconn").html("联动优势");
	                        }
							Y.get("#bankvalue").html(Y.get("#bank_for_"+i).html());	
							Y.get("#bank_info_"+i).show();
						}
					}
//					Y.get("#bankdiv").hide();
			},
			error : function() {
			}
		});
	}else{
		$("#"+"bank_div_"+divnum+"").removeClass("cur");
		
		Y.get("#bankid").val("");
		Y.get("#bid").val("");
		Y.get("#banktype").val("");
	}
};

