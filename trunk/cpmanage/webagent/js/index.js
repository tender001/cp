var _failmsg = "对不起，请求失败！";
var _uid;
var _minwidth = 600;
var _isNarrow;

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
	
	getUid();
	
	if ($(window).width() >= _minwidth) {
		$('#loosestyle').show();
		$('#narrowstyle1').hide();
		$('#narrowstyle2').hide();
		_isNarrow = false;
	} else {
		$('#loosestyle').hide();
		$('#narrowstyle1').show();
		$('#narrowstyle2').show();
		_isNarrow = true;
	}
	$(window).resize(function() {
		resizeFunction();
	});
	
	//_uid = 'baofeng';
	//setValue(_uid);
});

function resizeFunction() {
	var winwidth = $(window).width();
	if (winwidth >= _minwidth) {
		if (!_isNarrow) return false;
		$('#loosestyle').stop(true,true).show();
		$('#narrowstyle1').stop(true,true).hide();
		$('#narrowstyle2').stop(true,true).hide();
		_isNarrow = false;
	} else {
		if (_isNarrow) return false;
		$('#loosestyle').stop(true,true).hide();
		$('#narrowstyle1').stop(true,true).show();
		$('#narrowstyle2').stop(true,true).show();
		_isNarrow = true;
	}
	return false;
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
				setValue(_uid);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function setValue(uid) {
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
					var ye = FormatMoneyZh($row.attr('ibalance'));
					$('#index-ibalance1').text(ye);
					$('#index-ibalance2').text(ye);
					var ze = FormatMoneyZh($row.attr('ifill'));
					$('#index-ifill1').text(ze);
					$('#index-ifill2').text(ze);
					$('#index-ifill3').text("http://www.159cai.com/"+$row.attr('cagentseq'));
				}
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function FormatMoneyZh(num) {
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