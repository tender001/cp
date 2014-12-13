var _failmsg = "对不起，请求失败！";
var _uid;

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
	
	App.init();
	App.setPage('ui_tree');
	initBankRadio();
	
	setZebraTable($('#account-wide-info'));
	
	getUid();
	
	$('#resetpassworddialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		buttons: {
			"确定": function(){
				updatePassWord();
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
				updateBuyingAccount();
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
				updateBankCard();
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	$('#resetbanknamedialog').dialog({
		autoOpen: false,
		draggable: false,
		resizable: false,
		modal: true,
		width: 250,
		height: 300,
		buttons: {
			"确定": function(){
				updateBank();
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
				updateTel();
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
				updatePayee();
			},
			"取消": function(){
				$(this).dialog('close');
			}
		}
	});
	
	modifyDialogFocusFun();
	
	$('#modifypassword').click(function(){
		setPSDialog();
	});
	$('#modifybuyingaccount').click(function(){
		setBuyingAccountDialog();
	});
	$('#modifybankcard').click(function(){
		setBankCardDialog();
	});
	$('#modifybankname').click(function(){
		setBankdialog();
	});
	$('#modifcontractnum').click(function(){
		setTeldialog();
	});
	$('#modifypayee').click(function(){
		setPayeeDialog();
	});
	
	$('#reloadaccount').click(function(){
		setAccountInfo(_uid);
	});
	//_uid = 'baofeng';
	//setAccountInfo(_uid);
});

function getUid() {
	$.ajax({
		url: 'cl.aspx',
		type: 'POST',
		dataType: 'xml',
		error: function(){
			window.location.href = 'login.html';
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			if (code == '0') {
				_uid = $('uid',$resp).text();
				$('#content-accountid').text('代理商' + _uid);
				$('#porlet-title-accountid').text(_uid + '账户信息')
					.prepend('<i class="halflings-icon white icon-barcode xiayi-tubiao"></i>');
				setAccountInfo(_uid);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function initBankRadio() {
	var bnlen = SYS_CONFIG.bankname.length;
	var radios = '';
	for(var i = 0; i < bnlen; i++){
		var bn = SYS_CONFIG.bankname[i];
		radios += '<input type="radio" name="bkradio" value="' + bn[0] + '"/>'
			+ '&nbsp;&nbsp;' + bn[1] + '</br>';
	}
	$('#choosebank').html(radios);
}

function setAccountInfo(uid) {
	var senddata = new Object();
	senddata.qagent = uid;
	senddata.fid = "query_agent_info";
	$.ajax({
		url: 'query.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#warningdialog > p').text(_failmsg);
			$('#warningdialog').dialog('open');
		},
		success: function(result){
			var code = $(result).find("Resp").attr("code");
			var desc = $(result).find("Resp").attr("desc");
			if(code == 0){
				var $row = $(result).find("row");
				if($row.length = 1){
					var $account = $('#account-wide-info');
					$('tbody > tr:eq(0) > td:eq(1)',$account).text(textVal("http://www.159cai.com/"+$row.attr('cagentseq')));
					$('tbody > tr:eq(1) > td:eq(1)',$account).text(textVal($row.attr('cagentid')));
					$('tbody > tr:eq(2) > td:eq(1)',$account).text(textVal($row.attr('cparentid')));
					$('tbody > tr:eq(3) > td:eq(1)',$account).text(FormatMoneyZh($row.attr('ibalance')));
					$('tbody > tr:eq(4) > td:eq(1)',$account).text(FormatMoneyZh($row.attr('ifill')));
					$('tbody > tr:eq(5) > td:eq(1)',$account).text(FormatMoneyZh($row.attr('icash')));
					$('tbody > tr:eq(6) > td:eq(1)',$account).text(FormatMoneyZh($row.attr('itransfer')));
					$('tbody > tr:eq(7) > td:eq(1)',$account).text(textVal($row.attr('cnickid')));
					$('tbody > tr:eq(8) > td:eq(1)',$account).text(textVal($row.attr('cbankno')));
					$('tbody > tr:eq(9) > td:eq(1)',$account).html(getBankNameTd($row.attr('cbankname')));
					$('tbody > tr:eq(10) > td:eq(1)',$account).text(textVal($row.attr('ctelephone')));
					$('tbody > tr:eq(11) > td:eq(1)',$account).text(textVal($row.attr('crealname')));
					$('tbody > tr:eq(12) > td:eq(1)',$account).text(textVal($row.attr('cloginip')));
					$('tbody > tr:eq(13) > td:eq(1)',$account).text(textVal($row.attr('clastdate')));
					$('tbody > tr:eq(14) > td:eq(1)',$account).text(textVal($row.attr('state')));
				}
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function getBankNameTd(bankid) {
	if (bankid == null || bankid == 'null') bankid = '';
	bankid = $.trim(bankid);
	var resulthtml = '<input type="hidden" value="';
	if (bankid == '') {
		resulthtml += '"/> ';
	} else {
		resulthtml += bankid + '"/>' + SYS_CONFIG.getBankName(bankid);
	}
	return resulthtml;
}

function textVal(s) {
	if (s == null || s == 'null') s = '';
	s = $.trim(s);
	if (s == '') {
		return ' ';
	} else {
		return s;
	}
}

function FormatMoneyZh(num) {
	if (num == null || num == 'null') return '￥0';
	num = $.trim(num);
	if (num == '') return '￥0';
	if (num.indexOf('.') > 0) {
		num = parseFloat(num);
		return '￥' + fmoney(num,2);
	} else {
		num = parseFloat(num);
		return '￥' + fmoney(num,0);
	}
}

function setPSDialog() {
	$('#resetpassworddialog .account-id').text(_uid);
	$('#oldpassword,#newpassword,#newpassword2').val('');
	$('#resetpassworddialog .errdiv').hide();
	$('#resetpassworddialog').dialog('open');
}

function setBuyingAccountDialog() {
	$('#resetbuyingaccountdialog .account-id').text(_uid);
	var oldv = $.trim($('tbody > tr:eq(7) > td:eq(1)',$('#account-wide-info')).text());
	if (oldv == '') {
		$('#oldbuyingaccount').val('').parent().hide();
	} else {
		$('#oldbuyingaccount').val(oldv).parent().show();
	}
	$('#newbuyingaccount').val('');
	$('#resetbuyingaccountdialog .errdiv').hide();
	$('#resetbuyingaccountdialog').dialog('open');
}

function setBankCardDialog() {
	$('#resetbankcarddialog .account-id').text(_uid);
	var oldv = $.trim($('tbody > tr:eq(8) > td:eq(1)',$('#account-wide-info')).text());
	if (oldv == '') {
		$('#oldbankcard').val('').parent().hide();
	} else {
		$('#oldbankcard').val(oldv).parent().show();
	}
	$('#newbankcard,#newbankcard2').val('');
	$('#resetbankcarddialog .errdiv').hide();
	$('#resetbankcarddialog').dialog('open');
}

function setBankdialog() {
	$('#resetbanknamedialog .account-id').text(_uid);
	var oldv = $('tbody > tr:eq(9) > td:eq(1)',$('#account-wide-info')).children('input[type=hidden]').val();
	if (oldv == '') {
		$('input[name=bkradio]').removeAttr('checked');
	} else {
		$('input[name=bkradio][value=' + oldv + ']').attr('checked',true);
	}
	$('#oldbankname').val(oldv);
	$('#resetbanknamedialog .errdiv').hide();
	$('#resetbanknamedialog').dialog('open');
}

function setTeldialog() {
	$('#resetcontactnumdialog .account-id').text(_uid);
	var oldv = $.trim($('tbody > tr:eq(10) > td:eq(1)',$('#account-wide-info')).text());
	if (oldv == '') {
		$('#oldcontractnum').val('').parent().hide();
	} else {
		$('#oldcontractnum').val(oldv).parent().show();
	}
	$('#newcontractnum').val('');
	$('#resetcontactnumdialog .errdiv').hide();
	$('#resetcontactnumdialog').dialog('open');
}

function setPayeeDialog() {
	$('#resetpayeedialog .account-id').text(_uid);
	var oldv = $.trim($('tbody > tr:eq(11) > td:eq(1)',$('#account-wide-info')).text());
	if (oldv == '') {
		$('#oldpayee').val('').parent().hide();
	} else {
		$('#oldpayee').val(oldv).parent().show();
	}
	$('#newpayee').val('');
	$('#resetpayeedialog .errdiv').hide();
	$('#resetpayeedialog').dialog('open');
}

function updatePassWord() {
	var oldps = $.trim($('#oldpassword').val());
	if (oldps == '') {
		$('#resetpassworddialog .errdiv').show()
			.children('.errmsg').text('请输入原始密码！');
		return false;
	}
	var newps = $.trim($('#newpassword').val());
	if (newps == '') {
		$('#resetpassworddialog .errdiv').show()
			.children('.errmsg').text('请输入新密码！');
		return false;
	}
	var newps2 = $.trim($('#newpassword2').val());
	if (newps2 == '') {
		$('#resetpassworddialog .errdiv').show()
			.children('.errmsg').text('请确认新密码！');
		return false;
	}
	if (newps != newps2) {
		$('#resetpassworddialog .errdiv').show()
			.children('.errmsg').text('两次输入的新密码不同！');
		return false;
	}
	var senddata = new Object();
	senddata.fid = 'update_setagentpwd';
	senddata.qagent = _uid;
	senddata.oldValue = oldps;
	senddata.newValue = newps;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetpassworddialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetpassworddialog').dialog('close');
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetpassworddialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function updateBuyingAccount() {
	var newba = $.trim($('#newbuyingaccount').val());
	if (newba == '') {
		$('#resetbuyingaccountdialog .errdiv').show()
			.children('.errmsg').text('请输入新购彩账户！');
		return false;
	}
	var oldba = $('#oldbuyingaccount').val();
	var senddata = new Object();
	senddata.fid = 'update_agent_nickid';
	senddata.qagent = _uid;
	senddata.oldValue = oldba;
	senddata.newValue = newba;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetbuyingaccountdialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetbuyingaccountdialog').dialog('close');
				$('tbody > tr:eq(7) > td:eq(1)',$('#account-wide-info')).text(newba);
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetbuyingaccountdialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function updateBankCard() {
	var newcard = $.trim($('#newbankcard').val());
	if (newcard == '') {
		$('#resetbankcarddialog .errdiv').show()
			.children('.errmsg').text('请输入新银行卡卡号！');
		return false;
	}
	var newcard2 = $.trim($('#newbankcard2').val());
	if (newcard2 == '') {
		$('#resetbankcarddialog .errdiv').show()
			.children('.errmsg').text('请确认新银行卡卡号！');
		return false;
	}
	if (newcard != newcard2) {
		$('#resetbankcarddialog .errdiv').show()
			.children('.errmsg').text('两次输入的新银行卡卡号不同！');
		return false;
	}
	var oldcard = $('#oldbankcard').val();
	var senddata = new Object();
	senddata.fid = 'update_agent_bankno';
	senddata.qagent = _uid;
	senddata.oldValue = oldcard;
	senddata.newValue = newcard;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetbankcarddialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetbankcarddialog').dialog('close');
				$('tbody > tr:eq(8) > td:eq(1)',$('#account-wide-info')).text(newcard);
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetbankcarddialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function updateBank() {
	var $selected = $('input[name=bkradio]:checked');
	if ($selected.length != 1) {
		$('#resetbanknamedialog .errdiv').show()
			.children('.errmsg').text('请选择一个银行！');
		return false;
	}
	var newbank = $selected.val();
	var oldbank = $('#oldbankname').val();
	if (newbank == oldbank) return false;
	var senddata = new Object();
	senddata.fid = 'update_agent_bankname';
	senddata.qagent = _uid;
	senddata.oldValue = oldbank;
	senddata.newValue = newbank;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetbanknamedialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetbanknamedialog').dialog('close');
				$('tbody > tr:eq(9) > td:eq(1)',$('#account-wide-info')).html(getBankNameTd(newbank));
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetbanknamedialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function updateTel() {
	var newtel = $.trim($('#newcontractnum').val());
	if (newtel == '') {
		$('#resetcontactnumdialog .errdiv').show()
			.children('.errmsg').text('请输入新联系电话！');
		return false;
	}
	var oldtel = $('#oldcontractnum').val();
	var senddata = new Object();
	senddata.fid = 'update_agentphone';
	senddata.qagent = _uid;
	senddata.oldValue = oldtel;
	senddata.newValue = newtel;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetcontactnumdialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetcontactnumdialog').dialog('close');
				$('tbody > tr:eq(10) > td:eq(1)',$('#account-wide-info')).text(newtel);
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetcontactnumdialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function updatePayee() {
	var newpe = $.trim($('#newpayee').val());
	if (newpe == '') {
		$('#resetpayeedialog .errdiv').show()
			.children('.errmsg').text('请输入新联系电话！');
		return false;
	}
	var oldpe = $('#oldpayee').val();
	var senddata = new Object();
	senddata.fid = 'update_agent_realname';
	senddata.qagent = _uid;
	senddata.oldValue = oldpe;
	senddata.newValue = newpe;
	$.ajax({
		url: 'update.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#resetpayeedialog .errdiv').show()
				.children('.errmsg').text(_failmsg);
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == 0) {
				$('#resetpayeedialog').dialog('close');
				$('tbody > tr:eq(11) > td:eq(1)',$('#account-wide-info')).text(newpe);
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			} else {
				$('#resetpayeedialog .errdiv').show()
					.children('.errmsg').text(desc);
			}
		}
	});
	return true;
}

function modifyDialogFocusFun() {
	$('#oldpassword,#newpassword,#newpassword2').focus(function(){
		$('#resetpassworddialog .errdiv').hide();
	});
	$('#newbuyingaccount').focus(function(){
		$('#resetbuyingaccountdialog .errdiv').hide();
	});
	$('#newbankcard,#newbankcard2').focus(function(){
		$('#resetbankcarddialog .errdiv').hide();
	});
	$('#newcontractnum').focus(function(){
		$('#resetcontactnumdialog .errdiv').hide();
	});
	$('#newpayee').focus(function(){
		$('#resetpayeedialog .errdiv').hide();
	});
}

