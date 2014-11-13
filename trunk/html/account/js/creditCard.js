/**
 *159cai信用卡快捷支付
 */

Class('App', {
    use: ' mask, dataInput',
	ready: true,

    index:function (config){
    	this.LoginAcc();
    	this.showSafe();
    	this.showinfo();
        this.showbranch();
    	this.selectbank();
    	this.getSafe();
    	
    	
    	$("#addmoney").keyup(function(){
    		var money = Y.getInt($("#addmoney").val());
    		//var fmoney = money - (money*0.008).toFixed(2);
    		if(money < 10){
    			$("#remind").html("(最低<em>10</em>元)");
    		}else if(money >= 10 && money <= 2000){
    			//$("#remind").html("(实际到账 <em>"+fmoney+"</em> 元)");
    		}else if(money > 10000){
    			$("#addmoney").val('10000');
    			$("#remind").html("(最高<em>10000</em>元)");
    		}
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
											
												smrz.close();
												Y.alert(desc)
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
,
	showinfo:function(){
		this.btnbind();
		
		var b=getcookie("bank_umpay"); // cookie
		if (b!=undefined && b!=""){
			//默认充值通道
			changdiv(b);
//			$("#bankdiv").hide();
		}
	}
	,getSafe : function(){
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
						 Class.C("realname",u.rname);
					 }
                 }
            }
    	});
    }
	,selectbank:function(){
//		$("#bankc").click(function(){
//			$("#bankdiv").toggle();
//		});
//		$("#closeBankdiv").click(function(){
//			$("#bankdiv").hide();
//		})
	}
    ,showbranch:function(){
   
    	$("#showmore").click(function(){
			$("#otherbank").toggle();
			$("#showmore").toggleClass('sm_bkcur')
		});
		$("#otherbank").find("a").click(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			var ctxt=$(this).attr("name");
			
			changdiv(ctxt);
			$("#otherbank").toggle();
		})
		
    }
	,btnbind:function(){
		P = this;
		
   	 	this.get('#submit').click(function (){
			//alert(Class.C("realname"));
			if(Class.C("realname")==""){
				Y.alert('为防止盗卡，请先绑定实名');
				return false;
			}
   	 		if ($("#addmoney").val()<10){
				Y.alert('充值金额最低不能小于10元');
				return false;
			}
   			if ($("#addmoney").val()>10000){
   				Y.alert('充值金额最高不能超过10000元');
   				return false;
   			}
   			if (Y.getInt($("#addmoney").val()) == '0'){
   				Y.alert('请输入充值金额');
   				return false;
   			}
   			if ($("#bankid").val()=="" || $("#bankid").val()=="0"){
   				Y.alert("请选择充值银行");
   				return false;
   			}
   			Y.openUrl('tishi.html',500,194);
   			$("#bankform").attr("action",$_user.url.addmoney);		
   			$("#bankform").submit();
   	 	});
   	 	
   	 	
	},
	search_bank:function(){
		P = this;
		$("#branch_ul").hide();
		var search = $("#search").val();

		var ter ="";
		$("#branch_data li").each(function(i){
   		     var lis =$(this).find("a").text();
   		     var lin =$(this).find("a").attr("name");
   		     var banknamekeywordpos =lis.indexOf(search);
   		     if(banknamekeywordpos!=-1){
  					ter += "<li><a href=\"#\" name=\""+ lin +"\">"+lis+"</a></li>";
			}
		});
		$("#branch_a").html("更多银行");
		$("#branch_ul").html(ter);
		if(ter!=""){
			$("#branch_ul").show();
		}
		P.showbranch();
	}
	
});

var changdiv=function(divnum){
	var bankid=divnum;
	var bconfig=0;
	var bankname = "";
	var banktype="";
	var turl="/cpdata/creditCardBank.xml";
	if(bankid!=" "&&($("#"+"bank_div_"+divnum+"").attr("class")!="cur")){
		$("#bankdiv li").removeClass("cur");
		$("#"+"bank_div_"+divnum+"").addClass("cur");
		var callback = function(xml){
				var r = $(xml).find("row");			
				r.each(function() {
					var tmpbankvalue = $(this).attr("bankvalue");
					//var tmpbankconfig = $(this).attr("bankconfig");
					var tmpbankname = $(this).attr("bankname");
					var tmpbanktype = $(this).attr("banktype");
					 if (parseInt(tmpbankvalue)== parseInt(bankid)){
		          		 bconfig = 11;
						 bankname = tmpbankname;
						 banktype = tmpbanktype;  
						 return;
		          	  }  
				});	
			    $("#bankid").val(bconfig);
			    $("#tkType").val(bankid);
			    $("#banktype").val(banktype);
			    var bankstr = "";
			    if($("#bank_for_"+bankid).length>0){
			    	bankstr = $("#bank_for_"+bankid).html();
			    }else{
			    	bankstr = '<p>'+bankname+'</p>';
			    }
				$("#bankc").html(bankstr);						
//				$("#bankdiv").hide();
			    setcookie("bank_umpay", bankid);
		};
		$.ajax({
			url : turl+ "?rnd=" + Math.random(),
			type : "GET",
			dataType : "xml",
			success : callback
		});
	}else{
		$("#"+"bank_div_"+divnum+"").removeClass("cur");
		
		Y.get("#bankid").val("");
		Y.get("#bid").val("");
		Y.get("#banktype").val("");
	}
};
