/**
 *159cai信用卡快捷支付
 */

Class({
	ready: true,

    index:function (config){
    	this.LoginAcc();
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
    		}else if(money > 1000){
    			$("#addmoney").val('1000');
    			$("#remind").html("(最高<em>1000</em>元)");
    		}
    	});
		
		
    }
	,showinfo:function(){
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
   			if ($("#addmoney").val()>2000){
   				Y.alert('充值金额最高不能超过2000元');
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
   			Y.openUrl('tishi.html',502,250);
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
