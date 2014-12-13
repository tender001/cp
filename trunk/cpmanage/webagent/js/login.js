$(function(){
	$('#warningdialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		buttons: {
			"确定": function(){
				$(this).dialog('close');
			}
		}
	});
	
	hideErrMsg();
});

function freshYZM(obj){
	obj.src = "yzm.jo?r=" + Math.random();
};

function hideErrMsg() {
	focusHide($('#uid'));
	focusHide($('#pwd'));
	focusHide($('#yzm'));
	focusHide($('#yzmimg'));
	focusHide($('#loginbtn'));
}

function focusHide($el) {
	$el.focus(function(){
		$("#uid").parent().parent().parent().prev('.alert').hide();
	});
}
