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
	
	$('#reloadcommission').click(function(){
		setCommissionInfo(_uid);
	});
	
	getUid();
	
	//_uid = 'baofeng';
	//setCommissionInfo(_uid);
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
				$('#porlet-title-accountid').text(_uid + '佣金比例')
					.prepend('<i class="halflings-icon white icon-bar-chart xiayi-tubiao"></i>');
				setCommissionInfo(_uid);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function setCommissionInfo(uid) {
	var senddata = new Object();
	senddata.qagent = uid;
	senddata.fid = "query_agent_rate";
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
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			var desc = $resp.attr("desc");
			if(code == 0){
				var $rows = $('row',$resp);
				if ($rows.length > 0) {
					var tbody = '';
					var i = 0;
					$rows.each(function(){
						var gid = $(this).attr('gid');
						var pct = $(this).attr('irate');
						tbody += '<tr><td>' + SYS_CONFIG.getGame(gid) + '</td>'
							+ '<td>' + pct + '%</td></tr>';
						i++;
					});
					$('#money-pct-info > tbody').html(tbody);
					setZebraTable($('#money-pct-info'));
				} else {
					var tbody = '<tr><td colspan="2">对不起，当前无数据！</td></tr>';
					$('#money-pct-info > tbody').html(tbody);
				}
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}
