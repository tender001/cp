function addmoney(){
    if ($("#addmoney").val()<10){
    	showTips('存入金额至少为10元');
		$("#addmoney").focus();
		return false;
	}
	if ($("#addmoney").val()>5000000){
		showTips('存入金额最高不能超过500万元人民币');
		return false;
	}
	$("#payform").submit();
	$("#addmoney").focus();
}
$(document).ready(function() {
	chklogin(1);
});