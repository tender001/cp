var _failmsg = "对不起，请求失败！";
var _uid;
var _sdate = '2014-02-01';
var _edate = '2014-06-30';
var _nc = '';
var _dl ='';
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
	
	$('#reloaduser').click(function(){
		getUserList(1);
	});
	
	$('#searchbtn').click(function(){
		searchUser();
	});
	
	getUid();
	
	//_uid = 'baofeng';
	//getUserList(_uid,false,'2012-01-12','2012-01-13','',1);
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
				$('#porlet-title-accountid').text(_uid + '用户查询')
					.prepend('<i class="halflings-icon white icon-group xiayi-tubiao"></i>');
				getUserList(1);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function getUserList(pn) {
	var senddata = new Object();
	senddata.qagent = _dl;
	senddata.agent = _uid;
	senddata.fid = "query_agent_user";
	if (_ischeck) {
		senddata.money = "1";
	} else {
		senddata.money = "";
	}
	senddata.mobileno = "";
	senddata.sdate = _sdate;
	senddata.edate = _edate;
	senddata.nid = _nc;
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
				drawUserTbody($rows,$('#userlist'),drawPage($count,$('#userlist')));
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function drawUserTbody($rows,$table,ep) {
	var tbody = '';
	if (ep) {
		$rows.each(function(){
			var cnickid = $(this).attr('cnickid');
			var crealname = $(this).attr('crealname');
			var ibalance = $(this).attr('ibalance');
			var cfill = $(this).attr('cfill');
			var cadddate = $(this).attr('cadddate');
			var cactivedate = $(this).attr('cactivedate');
			var cparentid= $(this).attr('cparentid');
			var cagentid= $(this).attr('cagentid');
			var daili = $(this).attr('daili');
			var cidcard = $(this).attr('cidcard');
			var fandian = $(this).attr('fandian');
			var ty="用户";
			var shezhi="<a href=\"javascript:void(0);\" onclick=\"setDaili('" + cnickid + "',1)\"><font color=\"green\">开通</font></a>";
			if(_uid!=cagentid){
				if(daili=="1" && cidcard != ""){ty="代理";shezhi="<a href=\"javascript:void(0);\" onclick=\"setDaili('" + cnickid + "',0)\"><font color=\"green\">取消</font></a>";}
				if(daili=="0" && cidcard != ""&&fandian!="0") {ty="VIP";}
			}else if(_uid==cnickid){
				ty="自己";
				shezhi="--";
			}
			if(cidcard==""){shezhi="未实名";ty="普通用户";}
			
			tbody += '<tr><td color="bule"><a href="/cpmanage/webagent/sales_volume.html?uid='+cagentid+'" target="_blank"><font color="green">' + cnickid + '</font></a></td>'
				+ '<td>' + textVal(crealname) + '</td>'
				+ '<td>' + cparentid + '</td>'
				+ '<td>' + FormatMoneyZh(ibalance) + '</td>'
				+ '<td>' + textVal(cfill) + '</td>'
				+ '<td>' + cadddate + '</td>'
				+ '<td>' + cactivedate + '</td>'
				+ '<td>' + ty + '</td>'
				+ '<td>' + shezhi + '</td>'
				+'</tr>';
		});	
	} else {
		tbody = '<tr><td colspan="9">对不起，当前无数据.</td></tr>';
	}
	$('tbody',$table).html(tbody);
	setZebraTable($table);	
}

function setDaili(nid,flag){
	var senddata = new Object();
	senddata.agent = _uid;
	senddata.nid = nid;
	senddata.fid = "agent_set_cancel";
	senddata.source = flag;
	$.ajax({
		url: 'sp.aspx',
		type: 'POST',
		data: senddata,
		dataType: 'xml',
		error: function(){
			$('#warningdialog > p').text("操作失败！");
			$('#warningdialog').dialog('open');
			
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if (code == '0') {
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
				getUserList(1);
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
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

function initDateRange() {
	_sdate = Date.today().toString('yyyy-MM-dd');
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

function searchUser() {
	_sdate = $.trim($('#sdate').val());
	_edate = $.trim($('#edate').val());
	_nc = $.trim($('#ncname').val());
	_dl = $.trim($('#dlsbh').val());
	if ($('#iscz')[0].checked) {
		_ischeck = true;
	} else {
		_ischeck = false;
	}
	getUserList(1);
}

var PagingAction = {
	'PrevBtn': function(){
		var pn = parseInt($('.prev-num',$('#userlist')).children('a').text());
		getUserList(pn);
	},
	'NextBtn': function(){
		var pn = parseInt($('.next-num',$('#userlist')).children('a').text());
		getUserList(pn);
	},
	'PrevNum': function(){
		var pn = parseInt($('.prev-num',$('#userlist')).children('a').text());
		getUserList(pn);
	},
	'NextNum': function() {
		var pn = parseInt($('.next-num',$('#userlist')).children('a').text());
		getUserList(pn);
	}
};
