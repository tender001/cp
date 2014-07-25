/**
 * 彩票手机卡充值服务
 */
$_sys.bank = [];
$_sys.bank.push([ "01020000", "工商银行","gh" ]);
$_sys.bank.push([ "01030000", "农业银行","nh" ]);
$_sys.bank.push([ "01040000", "中国银行","zgh" ]);
$_sys.bank.push([ "01050000", "建设银行","jh" ]);
$_sys.bank.push([ "03010000", "交通银行","jth" ]);
$_sys.bank.push([ "01000000", "邮政储蓄银行","cx" ]);
$_sys.bank.push([ "03020000", "中信银行","zxh" ]);
$_sys.bank.push([ "03030000", "光大银行","gdh" ]);
$_sys.bank.push([ "03040000", "华夏银行","hx" ]); 
$_sys.bank.push([ "03050000", "民生银行","msh" ]);
$_sys.bank.push([ "03060000", "广发银行","gfh" ]);
$_sys.bank.push([ "03070000", "平安银行","pah" ]);
$_sys.bank.push([ "03080000", "招商银行","zh" ]);
$_sys.bank.push([ "03090000", "兴业银行","xyh"  ]);
$_sys.bank.push([ "03100000", "浦发银行","pfh"  ]);
$_sys.bank.push([ "03170000", "渤海银行","boh" ]);
//$_sys.bank.push([ 16, "渤海银行","boh" ]);
//$_sys.bank.push([ 16, "渤海银行","boh" ]);
//$_sys.bank.push([ 16, "渤海银行","boh" ]);
//$_sys.bank.push([ 16, "渤海银行","boh" ]);
//$_sys.bank.push([ 16, "渤海银行","boh" ]);
$_sys.getbankinfo = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.bank.length; i++) {
	if ($_sys.bank[i][0] == f) {
	return $_sys.bank[i][n];
	}
	}
	};
Class('App', {
    use: ' mask, dataInput',
	ready: true,
    index:function (config){
    	this.LoginAcc();
    	this.showSafe();
    	this.btnbind();
    },
    getbankinfo : function(){

    	var cardnumber = Y.get("#cardno").val(),bankinfo = $("#bankinfo"),cardok = $("#bankimg");
    	if(cardnumber.length>5){
        	Y.ajax({
        		url:'/phpu/querycard.phpx',
        	
                data: {cardnum:cardnumber},
                end:function (data, i){
                    if (!data.error) {
                    	var ret = this.dejson(data.text);
                    	if(ret.ret_code!=0000){
                    		bankinfo.addClass('tipbankinfored');
                    		if(ret.ret_code=="5001"){
                    			ret.ret_msg="网站暂不支持该卡进行快捷充值";
//                    			ret.ret_msg="您输入的银行卡号有误，请重新输入";
                    			cardok.hide().addClass("ss");
                    		}
                    		bankinfo.html(ret.ret_msg).show();
                    		$("#submit").addClass("czbtnhui");
                    	}else{
                    		var bankname = ret.bank_name;
                    		$("#submit").removeClass("czbtnhui");
                    		bankinfo.hide();
                    		var bankclass=$_sys.getbankinfo (ret.bank_code,2)
                    		if(bankclass==""){
                    			bankinfo.html(bankname).show();
                    		}else{
                    			cardok.attr("class",bankclass).show();
                    		}
                    		
                    		
                    		
                    	}
                    }
                }
            });	
    	}

  	
    },
    btnbind:function(){
		P = this;
		var cardno=Y.get("#cardno").val(),bigno=Y.get("#bigno"),bankinfo = $("#bankinfo"),bankname=$("#bankimg");
    	$("#addmoney").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
    	});
    	Y.get("#cardno").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
    		bigno.val(this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 "));//四位一空格
    		$("#card").val(cardno);
    		bigno.show();
    	});
    	
    	$("#cardno").focus(function(){  
    		
              
          }).blur(function(){  
        	  bigno.hide();
        	  bankinfo.hide();
        	  P.getbankinfo();
//        	  if(!bankname.hasClass("ss")){
//         		 bankname.show();
//        	  }else{
//        		  P.getbankinfo();
//        	  }
        	  
        	 
          });
//    	$("#cardno").change(function(){
//    		
//
//    	});
    	$("#cardno").click(function(){
    		bankinfo.show().removeClass("tipbankinfored").html("仅限持卡本人操作 , 您的银行卡号需和实名身份信息对应一致。");
        	  bankname.hide();
          })  
   	 	this.get('#submit').click(function (){
	   	 	if($(this).hasClass("czbtnhui")){
	   	 		
	           	return false;
	           }else{
	        	   if($("#truename").hasClass("nosm")){
	        		   Y.alert('请先实名再充值');
	        		   return false;

	        	   }
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
	   	 Y.openUrl('tishi.html',502,250);
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
//    							var b=getcookie("smrz_tk"); // cookie
    							 if(rname==""){
    								$("#truename").html("请先<a id='smcz' style='color: #145fab;'>实名</a>再充值").addClass("nosm");
    								 var smrz = Y.lib.MaskLay('#smrz', '#smrzcontent');
    								smrz.addClose('#smrzclose','#wrapLayCloseBtn', '#wrapLayClose');//'#smreturn'
    						        Y.get('#smrz  div.tantop').drag('#smrz');
    						        $("#smcz").click(function(){
    						        	  smrz.pop();
    						        })
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
    								 $("#truename").html(rname);
    							 }
    							 
    							
    					   }
                 }
            }
    	});
    }
});



