//function addmoney(){
//    
//	
//}

$(document).ready(function() {
	chklogin(1);
	$("#btnPay").click(function(){
		return showTips('充值系统维护暂停充值');
		if ($("#addmoney").val()<10){
	    	showTips('存入金额至少为10元');
			$("#addmoney").focus();
			return false;
		}else if($("#addmoney").val()>5000000){
			showTips('存入金额最高不能超过500万元人民币');
			return false;
		}else{
			$("#payform").submit();
			$("#addmoney").focus();
		}
	})
});