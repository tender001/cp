var _failmsg = "对不起，请求失败！";
var _uid;
var _sdate = '2014-03-01';
var _edate = '2014-06-30';
var _type = '';
var _ischeck = false;
var _pn = 1;
var _ps = 20;
var _tp = 0;
var _rc = 0;	

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
	
	initDateRange();
	
	App.init();
	App.setPage('ui_tree');
	initTypeSelect();
	
	$('#reloadfunddetail').click(function(){
		getFundDetail(1);
	});
	
	$('#searchbtn').click(function(){
		searchFundDetail();
	});
	$('#exportbtn').click(function(){
		exportDetail();
	});
	getUid();
	
	//_uid = 'baofeng';
	//getFundDetail(_uid,false,'2012-01-12','2012-01-13','',1);
});

function initTypeSelect() {
	var translen = SYS_CONFIG.biz.length;
	var selectopt = '';
	for(var i = 0; i < translen; i++){
		var trans = SYS_CONFIG.biz[i];
		selectopt += '<option value="' + trans[0] + '">'
			+ trans[1] + '</option>';
	}
	$('#transselect').empty().append(selectopt);
	App.initChosenSelect('#transselect');
}

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
				$('#porlet-title-accountid').text(_uid + '资金明细')
					.prepend('<i class="halflings-icon white icon-table xiayi-tubiao"></i>');
				getFundDetail(1);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function getFundDetail(pn) {
	var senddata = new Object();
	senddata.qagent = _uid;
	if (_ischeck) {
		senddata.fid = "query_agentuser_charge_t";
	} else {
		senddata.fid = "query_agentuser_charge";
	}
	senddata.sdate = _sdate;
	senddata.edate = _edate;
	senddata.type = _type;
	senddata.pn = pn;
	senddata.ps = _ps;
		
	$.ajax({
		url: 'qpage.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#warningdialog > p').text(_failmsg);
			$('#warningdialog').dialog('open');
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if(code == 0){
				var $rows = $resp.children("row");
				var $count = $resp.children("count");
				drawMoneyTbody($rows,$('#moneylist'),drawPage($count,$('#moneylist')));
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function exportFundDetail() {
	var fid = "query_agentuser_charge";
	if (_ischeck) {
		fid = "query_agentuser_charge_t";
	}
	var url = "pageExcel.aspx?qagent="+ _uid+"&fid="+fid+"&sdate="+_sdate+"&edate="+_edate+"&type="+_type+"&pn="+_pn+"&ps="+_ps;
	window.location.href=url;	
	
}

function drawMoneyTbody($rows,$table,ep) {
	var tbody = '';
	if (ep) {
		$rows.each(function(){
			var cid = $(this).attr('ichargeid');
			var jm = $(this).attr('imoney');
			var cm = $(this).attr('omoney');
			var cuid = $(this).attr('cnickid');
			var otype = $(this).attr('ibiztype');
			var adate = $(this).attr('cadddate');
			var ioldmoney = $(this).attr('ioldmoney');
			var ibalance = $(this).attr('ibalance');
			var cmemo = $(this).attr('cmemo');
			
			tbody += '<tr><td>' + cid + '</td>'
				+ '<td>' + FormatMoneyZh(jm) + '</td>'
				+ '<td>' + FormatMoneyZh(cm) + '</td>'
				+ '<td>' + cuid + '</td>'
				+ '<td>' + SYS_CONFIG.getBizType(otype) + '</td>'
				+ '<td>' + adate + '</td>'
				+ '<td>' + FormatMoneyZh(ioldmoney) + '</td>'
				+ '<td>' + FormatMoneyZh(ibalance) + '</td>'
				+ '<td>' + cmemo + '</td></tr>';
		});	
	} else {
		tbody = '<tr><td colspan="9">对不起，当前无数据！</td></tr>';
	}
	$('tbody',$table).html(tbody);
	setZebraTable($table);	
}

function drawPage($count,$table) {
	_tp = parseInt($count.attr('tp'));
	_rc = parseInt($count.attr('rc'));
	_pn = parseInt($count.attr('pn'));
	_ps = parseInt($count.attr('ps'));
	var minc = 0;
	var maxc = 0;
	var subc = 0;
	var rebol = true;
	if (_pn < 1 || _pn > _tp) {
		rebol = false;
	} else {
		minc = (_pn - 1) * _ps + 1;
	 	maxc = _pn * _ps;
		if (_pn == _tp) maxc = _rc;
		subc = _rc;
	}
	$('.min-count',$table).text(minc);
	$('.max-count',$table).text(maxc);
	$('.sub-count',$table).text(subc);
	if (rebol) {
		$('.paging-btn',$table).show();
		$('.cur-num',$table).children('a').text(_pn);
		$('.prev-btn',$table).addClass('disabled').unbind('click');
		$('.next-btn',$table).addClass('disabled').unbind('click');
		$('.prev-num',$table).hide().unbind('click');
		$('.next-num',$table).hide().unbind('click');
		if (_pn > 1) {
			$('.prev-num',$table).show().children('a').text(_pn - 1).bind('click',PagingAction.PrevNum);
			$('.prev-btn',$table).removeClass('disabled').bind('click',PagingAction.PrevBtn);
		}
		if (_pn < _tp) {
			$('.next-num',$table).show().children('a').text(_pn + 1).bind('click',PagingAction.NextNum);
			$('.next-btn',$table).removeClass('disabled').bind('click',PagingAction.NextBtn);
		}
		return true;
	} else {
		$('.paging-btn',$table).hide();
		return false;
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

function initDateRange() {
	_sdate = Date.today().addMonths(-1).toString('yyyy-MM-dd');
	_edate = Date.today().toString('yyyy-MM-dd');
	$('#sdate').val(_sdate).datepicker({
  		showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
  		dateFormat : "yy-mm-dd" ,
	  	onClose: function( selectedDate ) {
			$("#edate").datepicker( "option", "minDate", selectedDate );
	  	}
	});
	$('#edate').val(_edate).datepicker({
  		showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
  		dateFormat : "yy-mm-dd" ,
	  	onClose: function( selectedDate ) {
			$("#sdate").datepicker( "option", "maxDate", selectedDate );
	  	}
	});
}

function searchFundDetail() {
	_sdate = $.trim($('#sdate').val());
	_edate = $.trim($('#edate').val());
	_type = $('#transselect').val();
	if ($('#ishz')[0].checked) {
		_ischeck = true;
	} else {
		_ischeck = false;
	}
	getFundDetail(1);
}

function exportDetail() {
	_sdate = $.trim($('#sdate').val());
	_edate = $.trim($('#edate').val());
	_type = $('#transselect').val();
	if ($('#ishz')[0].checked) {
		_ischeck = true;
	} else {
		_ischeck = false;
	}
	exportFundDetail();
}

var PagingAction = {
	'PrevBtn': function(){
		var pn = parseInt($('.prev-num',$('#moneylist')).children('a').text());
		getFundDetail(pn);
	},
	'NextBtn': function(){
		var pn = parseInt($('.next-num',$('#moneylist')).children('a').text());
		getFundDetail(pn);
	},
	'PrevNum': function(){
		var pn = parseInt($('.prev-num',$('#moneylist')).children('a').text());
		getFundDetail(pn);
	},
	'NextNum': function() {
		var pn = parseInt($('.next-num',$('#moneylist')).children('a').text());
		getFundDetail(pn);
	}
};
