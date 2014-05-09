/**
 * 彩票充值服务
 */
Class({
	ready: true,
    index:function (config){
    	P=this;
    	this.LoginAcc();
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
   			if (Y.get("#addmoney").val()<1){
   				Y.alert('存入金额至少为1元');
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
   			Y.openUrl('tishi.html',502,250);
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

