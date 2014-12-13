$(function(){
	setZebraTable($('#account-wide-info'));
	
	$('#resetpassworddialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				//$(this).dialog('close');
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	$('#resetbuyingaccountdialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				//$(this).dialog('close');
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	$('#resetbankcarddialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				//$(this).dialog('close');
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	$('#resetcontactnumdialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				//$(this).dialog('close');
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	$('#resetpayeedialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				//$(this).dialog('close');
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	$('#modifypassword').click(function(){
		$('#resetpassworddialog').dialog('open');
	});
	$('#modifybuyingaccount').click(function(){
		$('#resetbuyingaccountdialog').dialog('open');
	});
	$('#modifybankcard').click(function(){
		$('#resetbankcarddialog').dialog('open');
	});
	$('#modifcontractnum').click(function(){
		$('#resetcontactnumdialog').dialog('open');
	});
	$('#modifypayee').click(function(){
		$('#resetpayeedialog').dialog('open');
	});
});

function setZebraTable($table) {
	$('tbody > tr:odd',$table).addClass('odd');
	$('tbody > tr:even',$table).addClass('even');
}