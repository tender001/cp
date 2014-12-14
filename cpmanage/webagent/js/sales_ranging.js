var _failmsg = "对不起，请求失败！";
var _uid;
var _sdate = '2014-02-01';
var _edate = '2014-06-30';
var _gid = '';
var _nid = '';
var _dl = '';
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

	$('#reloadlowersales').click(function(){
		getLowerSails(1);
	});
	
	$('#searchbtn').click(function(){
		searchLowerSails();
	});
	
	getUid();
	
	//_uid = 'baofeng';
	//getLowerSails(_uid,false,'2012-01-12','2012-01-13','',1);
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
				$('#porlet-title-accountid').text(_uid + '下级销量查询')
					.prepend('<i class="icon-sitemap halflings-icon white xiayi-tubiao"></i>');
				getLowerSails(1);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function getLowerSails(pn) {
	var senddata = new Object();
	senddata.qagent = _uid;
	senddata.fid = "query_xagent_salesRanging";
	senddata.sdate = _sdate;
	senddata.edate = _edate;
	senddata.nid =_nid;
	if(_dl!=''){
		senddata.qagent = _dl;
	}
	senddata.xagent = _dl;
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
				drawLowerSailTbody($rows,$('#sublayersaillist'),drawPage($count,$('#sublayersaillist')));
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function drawLowerSailTbody($rows,$table,ep) {
	var tbody = '';
	if (ep) {
		$rows.each(function(){
			var statday = $(this).attr('statday');
			var cagentid = textVal($(this).attr('cagentid'));
			var apath = textVal($(this).attr('apath'));
			var gid = textVal($(this).attr('gid'));
			var sales = $(this).attr('sales');
			tbody += '<tr><td>' + statday + '</td>'
				+ '<td>' + cagentid + '</td>'
				+ '<td>' + apath + '</td>'
				+ '<td>' + FormatMoneyZh(sales) + '</td></tr>';
		});	
	} else {
		tbody = '<tr><td colspan="4">对不起，当前无数据！</td></tr>';
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
function textVal(s) {
	if (s == null || s == 'null' || s == 'undefined') s = '';
	s = $.trim(s);
	if (s == '') {
		return ' ';
	} else {
		return s;
	}
}

function FormatMoneyZh(num) {
	if (num == null || num == 'null' || num == 'undefined') return '￥0';
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

function searchLowerSails() {
	_sdate = $.trim($('#sdate').val());
	_edate = $.trim($('#edate').val());
	_nid = $('#ncname').val();
	_dl = $('#dlsbh').val();
	getLowerSails(1);
}

var PagingAction = {
	'PrevBtn': function(){
		var pn = parseInt($('.prev-num',$('#sublayersaillist')).children('a').text());
		getLowerSails(pn);
	},
	'NextBtn': function(){
		var pn = parseInt($('.next-num',$('#sublayersaillist')).children('a').text());
		getLowerSails(pn);
	},
	'PrevNum': function(){
		var pn = parseInt($('.prev-num',$('#sublayersaillist')).children('a').text());
		getLowerSails(pn);
	},
	'NextNum': function() {
		var pn = parseInt($('.next-num',$('#sublayersaillist')).children('a').text());
		getLowerSails(pn);
	}
};
