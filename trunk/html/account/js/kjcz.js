/**
 * 彩票手机卡充值服务
 */
Class('App', {
    use: ' mask, dataInput',
	ready: true,
    index:function (config){
    	var P=this;
    	var cardno=Y.get("#cardno").val(),bigno=Y.get("#bigno"),bankinfo = Y.get("#bankinfo"),bankname=Y.get("#bankname");
    	$("#addmoney").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
    	});
    	$("#cardno").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
    		bigno.val(this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));//四位一空格
    		bigno.show();
    	});
    	
    	$("#cardno").focus(function(){  
    		
              
          }).blur(function(){  
        	  bigno.hide();
        	  bankinfo.hide();
        	  P.getbankinfo();
          });
    	$("#cardno").click(function(){
        	  bankinfo.show().removeClass("tipbankinfored");
        	  bankname.hide();
          })  
   
    	
    	
    	this.LoginAcc();
    	this.showSafe();
    	this.btnbind();
    },
    getbankinfo : function(){

    	var cardnumber = Y.get("#cardno").val(),bankinfo = Y.get("#bankinfo"),cardok = Y.get("#banknane");
    	if(cardnumber.length>5){
        	Y.ajax({
        		url:'/phpu/querycard.phpx',
        	
                data: {cardnum:cardnumber},
                end:function (data, i){
//                    if (!data.error) {
//                    	var ret = this.dejson(data.text);
//                    	if(ret.code!=100){
//                    		bankinfo.addClass('cz_tips cz_tips_err');
//                    		bankinfo.html(ret.msg);
//                    		cardok.val(0);
//                    	}else{
//                    		var bankname = ret.bankinfo["bank_name"],
//                    			classname = ret.bankinfo["classname"];
//                    		Y.get("#bankinfo").removeClass("cz_tips").removeClass("cz_tips_err").addClass('cz_bank_ico');
//                    		if(classname==""){
//                    			Y.get("#bankinfo").html(bankname);
//                    		}
//                    		else{
//                    			Y.get("#bankinfo").html("<span class=\"bank_ico "+classname+"\"></span>"+bankname);
//                    		}
//                    		cardok.val(1);
//                    		Y.get("#gopay").one().disabled=false;
//                    		Y.get("#gopay").removeClass("btn_gray").addClass("btn_orange");
//                    	}
//                    }
                }
            });	
    	}

  	
    },
    btnbind:function(){
		P = this;		
   	 	this.get('#submit').click(function (){
	   	 	if($(this).attr("isChecked")=='false'){
	   	 		P.isTrueinfo();
	           	return false;
	           }else{
	        	   if($("#cardnum").val()==""){
	        		   Y.alert('请输入您的银行卡号');
		   				return false;
	        	   }
	        	   if ($("#addmoney").val()<10){
	   				Y.alert('充值金额最低不能小于10元');
	   				return false;
	   				}
	      			if ($("#addmoney").val()>10000){
	      				Y.alert('充值金额最高不能超过10000元');
	      				$("#addmoney").focus();
	      				return false;
	      			} 
	      			$("#card").val($("#cardno").val());
	      			$("#money").val($("#addmoney").val())
	           }
	   	 	Y.openUrl('tishi.html',420,180);
			Y.get("#bankform").attr("action",$_user.url.addmoney);
			$("#bankform").submit();
        	
   	 	});  	 	
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
    								 Y.get("#truename").html(rname)
    							 }
    							 
    							
    					   }
                 }
            }
    	});
    }
});

var setType=function(cursel,n){
	for(var i=1;i<=n;i++){
		if(cursel!=i){
			$("#face_type" + i).hide();
		}else{
			$("#face_type" + i).show();
		}
	}
	var ty=$("#cardtypeid li");
//	$("#mobilecard li").addClass("cur");
//	$("#cardm").addClass("cur");
//	ty[cursel-1].checked="checked";
//	$("#face_type" + cursel+" li").eq(0).addClass("cur").siblings().removeClass("cur");
	$(ty[cursel-1]).addClass("cur").siblings().removeClass("cur");
}

var subform =function (){
	var tempvalue="";
//	if(!$("div.cz_mz").is(":hidden")){
//	
//		
//	}
	$("div.cz_mz").each(function(){
		if(!$(this).is(":hidden")){
			$(this).find("li[name=facevalue]").each(function(){
				if($(this).hasClass("cur")){
					tempvalue=$(this).attr("value");
				}
			});
		}
	})
	
	var typevalue="";
	$("li[name=cardtype]").each(function(){
		if($(this).index()==0){
			typevalue="CMJFK";
		}else if($(this).index()==0){
			typevalue="LTJFK";
		}else if($(this).index()==0){
			typevalue="DXJFK";
		}
	});
	var cardid = ($("#cardid").val()).replace(/\s+/g,"");
	var passid = ($("#passid").val()).replace(/\s+/g,"");
	if(typevalue==""){
		Y.alert('请选择充值卡类型');
		return false;
	}else if(tempvalue==""){
		Y.alert('请选择充值面值');
		return false;
	}else if($("#cardid").val()==""){
		Y.alert('充值卡卡号不能为空');
		return false;		
	}else if(isNaN(cardid)){
		Y.alert('卡号请输入数字');
		return false;		
	}else if(isNaN(passid)){
		Y.alert('密码请输入数字');
		return false;		
	}else if($("#passid").val()==""){
		Y.alert('充值卡密码不能为空');
		return false;		
	}
	var ccts = Y.lib.MaskLay('#ccts', '#cctsdiv');
	ccts.addClose('[mark=cctsclose]');//'#smreturn'
    Y.get('#ccts  div.tantop').drag('#ccts');
    Y.get("#cardtype").html(typevalue)
    Y.get("#cardmoney").html(tempvalue);
    Y.get("#czmoney").html(tempvalue*0.96);
    Y.get("#cardno").html(cardid);
    Y.get("#cardpwd").html(passid);
    ccts.pop();
	
	$("#surecc").click(function(){
		ccts.close();
		Y.ajax({
		url :$_user.url.addmoney,
		type :"POST",
		dataType :"json",
		data :"bankid=9&addmoney="+tempvalue+"&tkMoney="+tempvalue+"&cardnum="+cardid+"&cardpass="+passid+"&dealid="+typevalue+"&v="+Math.random(),
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {
				var sdcg = Y.lib.MaskLay('#sdcg', '#sdcgdiv');
				sdcg.addClose('[mark=sdcgclose]');//'#smreturn'
			    Y.get('#sdcg  div.tantop').drag('#sdcg');
				
			    sdcg.pop();
			} else {
				//收单失败
				Y.alert(desc);
			}
		}
	});
	})
//	Y.ajax({
//		url :$_user.url.addmoney,
//		type :"POST",
//		dataType :"json",
//		data :"bankid=9&addmoney="+tempvalue+"&tkMoney="+tempvalue+"&cardnum="+cardid+"&cardpass="+passid+"&dealid="+typevalue+"&v="+Math.random(),
//		end  : function (d){
//			var obj = eval("(" + d.text + ")");
//   		    var code = obj.Resp.code;
//   		    var desc = obj.Resp.desc;
//			if (code == "0") {
//				Y.alert('收单成功');
//			} else {
//				//收单失败
//				Y.alert(desc);
//			}
//		}
//	});
	
}