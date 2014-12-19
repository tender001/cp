var _failmsg = "对不起，请求失败！";
var _uid;
var _chuid;
var _dl;
var _sdate1 = '2014-03-01';
var _edate1 = '2014-06-30';
var _type1 = '';
var _ischeck1 = false;
var _pn1 = 1;
var _ps1 = 20;
var _tp1 = 0;
var _rc1 = 0;
var _sdate2 = '2014-03-01';
var _edate2 = '2014-06-30';
var _nc = '';
var _ischeck2 = false;
var _pn2 = 1;
var _ps2 = 20;
var _tp2 = 0;
var _rc2 = 0;
var _sdate3 = '2014-02-01';
var _edate3 = '2014-06-30';
var _gid3 = '';
var _ischeck3 = false;
var _pn3 = 1;
var _ps3 = 20;
var _tp3 = 0;
var _rc3 = 0;
var _sdate4 = '2014-02-01';
var _edate4 = '2014-06-30';
var _gid4 = '';
var _nid4 = '';
var _dl4 = '';
var _ischeck4 = false;
var _pn4 = 1;
var _ps4 = 20;
var _tp4 = 0;
var _rc4 = 0;
var data ="";

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
	
	$("#chidshaccordion").accordion({
  		collapsible: true,
  		heightStyle: "content",
  		animate: false
    });
    setZebraTable($('#account-wide-info'));
    $('#backlist').click(function(){
    	$("#shtreediv").show();
		$("#childshdiv").hide();
    });
    $('#reset-commission').click(function(){
		resetCommisson();
	});
	$('#funddetailsearchbtn').click(function(){
		searchFundDetail();
	});
	$('#usersearchbtn').click(function(){
		searchUser();
	});
	$('#sailsearchbtn').click(function(){
		searchSail();
	});
	$('#lowersearchbtn').click(function(){
		searchLowerSails();
	});
	$('#exportbtn').click(function(){
		exportDetail();
	});
	$('#searchbtn').click(function(){
		searchAgentUser();
	});
	App.init();
	initTransTypeSelect();
	initGidTypeSelect();
	
	getLowerLists();
	
	$('#reloadlowerlists').click(function(){
		$("#shtreediv").show();
		$("#childshdiv").hide();
		getLowerLists();
	});
	
	$("#shtree a").live('click',function(){
		viewInfo($(this).attr('title'));
	});
	
});

function getLowerLists() {
	$("#shtree").empty();
	$.ajax({
		url: 'tree.aspx',
		type: 'POST',
		data:data,
		dataType: 'xml',
		error: function(){
			window.location.href = 'login.html';
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			if (code == '0') {
				var $agent = $resp.children('agent');
				_uid = $agent.attr('id');
				$('#content-accountid').text('代理商：' + _uid);
				$('#porlet-title-accountid').text(_uid + '下级代理列表')
					.prepend('<i class="halflings-icon white icon-sitemap xiayi-tubiao"></i>');
				drawLowerTree($agent);
			} else {
				window.location.href = 'login.html';
			}
		}
	});
}

function drawLowerTree($allsh) {
	var $branchs = $allsh.children('node');
	var branchslen = $branchs.length;
	var treedata = [];
	if (branchslen > 0) {
		treedata = getTreeBanch($branchs);
	}
	var setting = {
			view:{showIcon:false,showLine:false},
			data:{ keep:{parent:true}},
			callback: { onExpand : onExpand,onCollapse:onCollapse }
	};
	$.fn.zTree.init($("#shtree"), setting, treedata);
	$("#shtreediv .msg").hide();
}

function onExpand (event, treeId, treeNode){
var param = "rname=" + treeNode.name;
$.ajax({
		url: 'tree.aspx',
		type: 'POST',
		data:param,
		dataType: 'xml',
		error: function(){
			alert("加载下级代理出错");
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var code = $resp.attr("code");
			if (code == '0') {
				var $agent = $resp.children('agent');
				drawChildrenTree($agent,treeNode);
			} else {
				alert("加载下级代理出错。");
			}
		}
	});

}

function onCollapse (event, treeId, treeNode){

	var treeObj = $.fn.zTree.getZTreeObj("shtree");
	treeObj.removeChildNodes(treeNode);
}

function drawChildrenTree($allsh,treeNode) {
	var $branchs = $allsh.children('node');
	var branchslen = $branchs.length;
	var treedata = [];
	if (branchslen > 0) {
		treedata = getTreeBanch($branchs);
	}
	var treeObj = $.fn.zTree.getZTreeObj("shtree");
	
	treeObj.addNodes(treeNode,treedata);
}

function initPublicVal() {
	initDateRange();
	_type1 = '';
	_nc = '';
	_gid3 = '';
	_gid4 = '';
	_nid = '';
	_dl = '';
	_pn1 = 1;
	_pn2 = 1;
	_pn3 = 1;
	_pn4 = 1;
}

function getTreeBanch($xml) {
	var resultval = [];
	$xml.each(function(){
		var el = {};
		el.name = $(this).attr('id');
		var flag = $(this).attr('isParent');
		
		if(flag=="1"){
			el.isParent = true;
		}else{
			el.isParent = false;
		}
		
		var $branchs = $(this).children('node');
		var branchslen = $branchs.length;
		if (branchslen > 0) {
			el.children = getTreeBanch($branchs);
		}
		resultval.push(el);
	});
	return resultval;
}

function viewInfo(banchid) {
	_chuid = banchid;
	initPublicVal();
	$("#chidshaccordion").accordion({active:0});;
	$('#childshid').text('代理商' + _chuid);
	setAccountValue();
}

function setAccountValue() {
	var senddata = new Object();
	senddata.qagent = _chuid;
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
					$('tbody > tr:eq(0) > td:eq(1)',$account).text("http://www.159cai.com/"+textVal($row.attr('cagentseq')));
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
				
				$("#shtreediv").hide();
				$("#childshdiv").show();
				setCommissionInfo();
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function setCommissionInfo() {
	var senddata = new Object();
	senddata.qagent = _chuid;
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
							+ '<td><input type="text" class="pct" id="fd_' + gid
							+ '" inputgid="' + gid
							+ '" value="' + pct + '"/></td></tr>';
						i++;
					});
					$('#money-pct-info > tbody').html(tbody);
					$("input[type='text'][class='pct']").each(function(){
						var id=$(this).attr("inputgid");
						var num1="";
						$("#fd_"+id).focus(function(){		
					     num1=$("#fd_"+id).val();	
						}).blur(function(){		
					     var num2=$("#fd_"+id).val();
					     var maxValue = 100;
					     var type = SYS_CONFIG.getGameType(id);
					     if(type=="zc"||type=="jc"){
					    	 maxValue = 10;
					     }else if(type=="bd"){
					    	 maxValue = 7;
					     }else if(type=="mp"||type=="kp"){
					    	 maxValue = 9;
					     }
						if(eval(num2)>eval(maxValue)){
							$('#warningdialog > p').text("修改后的数据不能大于"+maxValue);
							$('#warningdialog').dialog('open');
							$("#fd_"+id).val("");//先清空文本框
							$("#fd_"+id).val(num1);//再重新赋值					
							return false;
						}});			
					});
					setZebraTable($('#money-pct-info'));
				} else {
					var tbody = '<tr><td colspan="2">对不起，当前无数据！</td></tr>';
					$('#money-pct-info > tbody').html(tbody);
				}
				getFundDetail(1);
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

function resetCommisson() {
	var $rates = $('#money-pct-info').find('.pct');
	if ($rates.length <= 0) return false;
	var games = new Array();
	var rates = new Array();
	$rates.each(function(){
		games.push($(this).attr("inputgid"));
		rates.push($(this).val());
	});
	var param = new Object();
	param.qagent = _chuid;
	param.gid = games.join(",");
	param.money = rates.join(",");
	param.fid = "agent_set_gamerate";
	$.ajax({
		url: 'sp.aspx',
		type: 'POST',
		data: param,
		dataType: 'xml',
		error: function(){
			$('#warningdialog > p').text(_failmsg);
			$('#warningdialog').dialog('open');
		},
		success: function(result){
			var $resp = $(result).find("Resp");
			var desc = $resp.attr("desc");
			$('#warningdialog > p').text(desc);
			$('#warningdialog').dialog('open');
		}
	});
}

function initDateRange() {
	_sdate1 = Date.today().addMonths(-1).toString('yyyy-MM-dd');
	_edate1 = Date.today().toString('yyyy-MM-dd');
	$('#funddetailsdate').val(_sdate1).datepicker({
  		showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
  		dateFormat : "yy-mm-dd" ,
	  	onClose: function( selectedDate ) {
			$("#funddetailedate").datepicker( "option", "minDate", selectedDate );
	  	}
	});
	$('#funddetailedate').val(_edate1).datepicker({
  		showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
  		dateFormat : "yy-mm-dd" ,
	  	onClose: function( selectedDate ) {
			$("#funddetailsdate").datepicker( "option", "maxDate", selectedDate );
	  	}
	});
    _sdate2 = _sdate1;
    _edate2 = _edate1;
    $("#usersdate").val(_sdate2).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function( selectedDate ) {
    		$( "#useredate" ).datepicker( "option", "minDate", selectedDate );
      	}
    });
    $("#useredate").val(_edate2).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function( selectedDate ) {
    		$( "#usersdate" ).datepicker( "option", "maxDate", selectedDate );
      	}
    });
    _sdate3 = _sdate1;
    _edate3 = _edate1;
    $("#sailsdate").val(_sdate3).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function( selectedDate ) {
        	$("#sailedate").datepicker( "option", "minDate", selectedDate );
      	}
    });
    $("#sailedate").val(_edate3).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function( selectedDate ) {
        	$("#sailsdate").datepicker( "option", "maxDate", selectedDate );
      	}
    });
    _sdate4 = _sdate1;
    _edate4 = _edate1;
    $("#lowersdate").val(_sdate4).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function(selectedDate) {
        	$("#loweredate").datepicker( "option", "minDate", selectedDate );
      	}
    });
    $("#loweredate").val(_edate4).datepicker({
    	showOn: "button",
  		buttonText: '<i class="icon-calendar"></i>',
      	dateFormat : "yy-mm-dd" ,
      	onClose: function(selectedDate) {
        	$("#lowersdate").datepicker( "option", "maxDate", selectedDate );
      	}	
    });
}

function initTransTypeSelect() {
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
function initGidTypeSelect() {
	var gidlen = SYS_CONFIG.game.length;
	var selectopt = '';
	for(var i = 0; i < gidlen; i++){
		var gidopt = SYS_CONFIG.game[i];
		selectopt += '<option value="' + gidopt[0] + '">'
			+ gidopt[1] + '</option>';
	}
	$('#sailgidselect').empty().append(selectopt);
	App.initChosenSelect('#sailgidselect');
	$('#lowergidselect').empty().append(selectopt);
	App.initChosenSelect('#lowergidselect');
}

function getFundDetail(pn) {
	var senddata = new Object();
	senddata.qagent = _chuid;
	if (_ischeck1) {
		senddata.fid = "query_agentuser_charge_t";
	} else {
		senddata.fid = "query_agentuser_charge";
	}
	senddata.sdate = _sdate1;
	senddata.edate = _edate1;
	senddata.type = _type1;
	senddata.pn = pn;
	senddata.ps = _ps1;
		
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
				drawMoneyTbody($rows,$('#moneylist'),
					drawPage1($count,$('#moneylist')));
				getUserList(1);
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function getUserList(pn) {
	var senddata = new Object();
	senddata.qagent = _dl;
	senddata.agent = _chuid;
	senddata.fid = "query_agent_user";
	if (_ischeck2) {
		senddata.money = "1";
	} else {
		senddata.money = "";
	}
	senddata.mobileno = "";
	senddata.sdate = _sdate2;
	senddata.edate = _edate2;
	senddata.nid = _nc;
	senddata.pn = pn;
	senddata.ps = _ps2;
	
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
				drawUserTbody($rows,$('#userlist'),drawPage2($count,$('#userlist')));
				getSailList(1);
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function getSailList(pn) {
	var senddata = new Object();
	senddata.qagent = _chuid;
	if (_ischeck3) {
		senddata.fid = "query_agent_salestat_t";
	} else {
		senddata.fid = "query_agent_salestat";
	}
	senddata.sdate = _sdate3;
	senddata.edate = _edate3;
	senddata.gid = _gid3;
	senddata.pn = pn;
	senddata.ps = _ps3;
		
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
				drawSailTbody($rows,$('#saillist'),drawPage3($count,$('#saillist')));
				getLowerSails(1);
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
}

function getLowerSails(pn) {
	var senddata = new Object();
	senddata.qagent = _chuid;
	if (_ischeck4) {
		senddata.fid = "query_xagent_salestat_t";
	} else {
		senddata.fid = "query_xagent_salestat";
	}
	senddata.sdate = _sdate4;
	senddata.edate = _edate4;
	senddata.gid = _gid4;
	senddata.nid =_nid4;
	if(_dl4!=''){
		senddata.qagent = _dl4;
	}
	senddata.xagent = _dl4;
	senddata.pn = pn;
	senddata.ps = _ps4;
		
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
				drawLowerSailTbody($rows,$('#sublayersaillist'),drawPage4($count,$('#sublayersaillist')));
			}else{
				$('#warningdialog > p').text(desc);
				$('#warningdialog').dialog('open');
			}
		}
	});
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
			if(daili=="1" && cidcard != ""){ty="代理";shezhi="<a href=\"javascript:void(0);\" onclick=\"setDaili('" + cnickid + "',0)\"><font color=\"green\">取消</font></a>";}
			if(daili=="0" && cidcard != ""&&fandian!="0") {ty="VIP";}
			if(cidcard==""){shezhi="未实名";ty="普通用户";}
			
			tbody += '<tr><td color="bule">' + cnickid + '</td>'
				+ '<td>' + textVal(crealname) + '</td>'
				+ '<td>' + cparentid + '</td>'
				+ '<td>' + FormatMoneyZh(ibalance) + '</td>'
				+ '<td>' + textVal(cfill) + '</td>'
				+ '<td>' + cadddate + '</td>'
				+ '<td>' + cactivedate + '</td>'
				+ '<td>' + ty + '</td>'
//				+ '<td>' + shezhi + '</td>'
				+'</tr>';
		});	
	} else {
		tbody = '<tr><td colspan="8">对不起，当前无数据！</td></tr>';
	}
	$('tbody',$table).html(tbody);
	setZebraTable($table);	
}

function drawSailTbody($rows,$table,ep) {
	var tbody = '';
	if (ep) {
		$rows.each(function(){
			var statday = $(this).attr('statday');
			var gid = textVal($(this).attr('gid'));
			var sales = $(this).attr('sales');
			tbody += '<tr><td>' + statday + '</td>'
				+ '<td>' + SYS_CONFIG.getGame(gid) + '</td>'
				+ '<td>' + FormatMoneyZh(sales) + '</td></tr>';
		});	
	} else {
		tbody = '<tr><td colspan="3">对不起，当前无数据！</td></tr>';
	}
	$('tbody',$table).html(tbody);
	setZebraTable($table);	
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
				+ '<td>' + SYS_CONFIG.getGame(gid) + '</td>'
				+ '<td>' + FormatMoneyZh(sales) + '</td></tr>';
		});	
	} else {
		tbody = '<tr><td colspan="5">对不起，当前无数据！</td></tr>';
	}
	$('tbody',$table).html(tbody);
	setZebraTable($table);	
}

function drawPage1($count,$table) {
	_tp1 = parseInt($count.attr('tp'));
	_rc1 = parseInt($count.attr('rc'));
	_pn1 = parseInt($count.attr('pn'));
	_ps1 = parseInt($count.attr('ps'));
	var minc = 0;
	var maxc = 0;
	var subc = 0;
	var rebol = true;
	if (_pn1 < 1 || _pn1 > _tp1) {
		rebol = false;
	} else {
		minc = (_pn1 - 1) * _ps1 + 1;
	 	maxc = _pn1 * _ps1;
		if (_pn1 == _tp1) maxc = _rc1;
		subc = _rc1;
	}
	$('.min-count',$table).text(minc);
	$('.max-count',$table).text(maxc);
	$('.sub-count',$table).text(subc);
	if (rebol) {
		$('.paging-btn',$table).show();
		$('.cur-num',$table).children('a').text(_pn1);
		$('.prev-btn',$table).addClass('disabled').unbind('click');
		$('.next-btn',$table).addClass('disabled').unbind('click');
		$('.prev-num',$table).hide().unbind('click');
		$('.next-num',$table).hide().unbind('click');
		if (_pn1 > 1) {
			$('.prev-num',$table).show().children('a').text(_pn1 - 1).bind('click',PagingAction1.PrevNum);
			$('.prev-btn',$table).removeClass('disabled').bind('click',PagingAction1.PrevBtn);
		}
		if (_pn1 < _tp1) {
			$('.next-num',$table).show().children('a').text(_pn1 + 1).bind('click',PagingAction1.NextNum);
			$('.next-btn',$table).removeClass('disabled').bind('click',PagingAction1.NextBtn);
		}
		return true;
	} else {
		$('.paging-btn',$table).hide();
		return false;
	}
}

function drawPage2($count,$table) {
	_tp2 = parseInt($count.attr('tp'));
	_rc2 = parseInt($count.attr('rc'));
	_pn2 = parseInt($count.attr('pn'));
	_ps2 = parseInt($count.attr('ps'));
	var minc = 0;
	var maxc = 0;
	var subc = 0;
	var rebol = true;
	if (_pn2 < 1 || _pn2 > _tp2) {
		rebol = false;
	} else {
		minc = (_pn2 - 1) * _ps2 + 1;
	 	maxc = _pn2 * _ps2;
		if (_pn2 == _tp2) maxc = _rc2;
		subc = _rc2;
	}
	$('.min-count',$table).text(minc);
	$('.max-count',$table).text(maxc);
	$('.sub-count',$table).text(subc);
	if (rebol) {
		$('.paging-btn',$table).show();
		$('.cur-num',$table).children('a').text(_pn2);
		$('.prev-btn',$table).addClass('disabled').unbind('click');
		$('.next-btn',$table).addClass('disabled').unbind('click');
		$('.prev-num',$table).hide().unbind('click');
		$('.next-num',$table).hide().unbind('click');
		if (_pn2 > 1) {
			$('.prev-num',$table).show().children('a').text(_pn2 - 1).bind('click',PagingAction2.PrevNum);
			$('.prev-btn',$table).removeClass('disabled').bind('click',PagingAction2.PrevBtn);
		}
		if (_pn2 < _tp2) {
			$('.next-num',$table).show().children('a').text(_pn2 + 1).bind('click',PagingAction2.NextNum);
			$('.next-btn',$table).removeClass('disabled').bind('click',PagingAction2.NextBtn);
		}
		return true;
	} else {
		$('.paging-btn',$table).hide();
		return false;
	}
}

function drawPage4($count,$table) {
	_tp4 = parseInt($count.attr('tp'));
	_rc4 = parseInt($count.attr('rc'));
	_pn4 = parseInt($count.attr('pn'));
	_ps4 = parseInt($count.attr('ps'));
	var minc = 0;
	var maxc = 0;
	var subc = 0;
	var rebol = true;
	if (_pn4 < 1 || _pn4 > _tp4) {
		rebol = false;
	} else {
		minc = (_pn4 - 1) * _ps4 + 1;
	 	maxc = _pn4 * _ps4;
		if (_pn4 == _tp4) maxc = _rc4;
		subc = _rc4;
	}
	$('.min-count',$table).text(minc);
	$('.max-count',$table).text(maxc);
	$('.sub-count',$table).text(subc);
	if (rebol) {
		$('.paging-btn',$table).show();
		$('.cur-num',$table).children('a').text(_pn4);
		$('.prev-btn',$table).addClass('disabled').unbind('click');
		$('.next-btn',$table).addClass('disabled').unbind('click');
		$('.prev-num',$table).hide().unbind('click');
		$('.next-num',$table).hide().unbind('click');
		if (_pn4 > 1) {
			$('.prev-num',$table).show().children('a').text(_pn4 - 1).bind('click',PagingAction4.PrevNum);
			$('.prev-btn',$table).removeClass('disabled').bind('click',PagingAction4.PrevBtn);
		}
		if (_pn4 < _tp4) {
			$('.next-num',$table).show().children('a').text(_pn4 + 1).bind('click',PagingAction4.NextNum);
			$('.next-btn',$table).removeClass('disabled').bind('click',PagingAction4.NextBtn);
		}
		return true;
	} else {
		$('.paging-btn',$table).hide();
		return false;
	}
}

function drawPage3($count,$table) {
	_tp3 = parseInt($count.attr('tp'));
	_rc3 = parseInt($count.attr('rc'));
	_pn3 = parseInt($count.attr('pn'));
	_ps3 = parseInt($count.attr('ps'));
	var minc = 0;
	var maxc = 0;
	var subc = 0;
	var rebol = true;
	if (_pn3 < 1 || _pn3 > _tp3) {
		rebol = false;
	} else {
		minc = (_pn3 - 1) * _ps3 + 1;
	 	maxc = _pn3 * _ps3;
		if (_pn3 == _tp3) maxc = _rc3;
		subc = _rc3;
	}
	$('.min-count',$table).text(minc);
	$('.max-count',$table).text(maxc);
	$('.sub-count',$table).text(subc);
	if (rebol) {
		$('.paging-btn',$table).show();
		$('.cur-num',$table).children('a').text(_pn3);
		$('.prev-btn',$table).addClass('disabled').unbind('click');
		$('.next-btn',$table).addClass('disabled').unbind('click');
		$('.prev-num',$table).hide().unbind('click');
		$('.next-num',$table).hide().unbind('click');
		if (_pn3 > 1) {
			$('.prev-num',$table).show().children('a').text(_pn3 - 1).bind('click',PagingAction3.PrevNum);
			$('.prev-btn',$table).removeClass('disabled').bind('click',PagingAction3.PrevBtn);
		}
		if (_pn3 < _tp3) {
			$('.next-num',$table).show().children('a').text(_pn3 + 1).bind('click',PagingAction3.NextNum);
			$('.next-btn',$table).removeClass('disabled').bind('click',PagingAction3.NextBtn);
		}
		return true;
	} else {
		$('.paging-btn',$table).hide();
		return false;
	}
}

var PagingAction1 = {
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

var PagingAction2 = {
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

var PagingAction3 = {
	'PrevBtn': function(){
		var pn = parseInt($('.prev-num',$('#saillist')).children('a').text());
		getSailList(pn);
	},
	'NextBtn': function(){
		var pn = parseInt($('.next-num',$('#saillist')).children('a').text());
		getSailList(pn);
	},
	'PrevNum': function(){
		var pn = parseInt($('.prev-num',$('#saillist')).children('a').text());
		getSailList(pn);
	},
	'NextNum': function() {
		var pn = parseInt($('.next-num',$('#saillist')).children('a').text());
		getSailList(pn);
	}
};

var PagingAction4 = {
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

function searchFundDetail() {
	_sdate1 = $.trim($('#funddetailsdate').val());
	_edate1 = $.trim($('#funddetailedate').val());
	_type1 = $('#transselect').val();
	if ($('#funddetailishz')[0].checked) {
		_ischeck1 = true;
	} else {
		_ischeck1 = false;
	}
	getFundDetail(1);
}

function exportDetail() {
	_sdate1 = $.trim($('#funddetailsdate').val());
	_edate1 = $.trim($('#funddetailedate').val());
	_type1 = $('#transselect').val();
	if ($('#funddetailishz')[0].checked) {
		_ischeck = true;
	} else {
		_ischeck = false;
	}
	exportFundDetail();
}

function exportFundDetail() {
	var fid = "query_agentuser_charge";
	if (_ischeck) {
		fid = "query_agentuser_charge_t";
	}
	var url = "pageExcel.aspx?qagent="+ _chuid+"&fid="+fid+"&sdate="+_sdate1+"&edate="+_edate1+"&type="+_type1+"&pn="+_pn1+"&ps="+_ps1;
	window.location.href=url;	
	
}

function searchUser() {
	_sdate2 = $.trim($('#usersdate').val());
	_edate2 = $.trim($('#useredate').val());
	_nc = $.trim($('#ncname').val());
	_dl = $.trim($('#dlsbh').val());
	if ($('#useriscz')[0].checked) {
		_ischeck2 = true;
	} else {
		_ischeck2 = false;
	}
	getUserList(1);
}

function searchAgentUser(){
	data = "rname=" +$.trim($('#rname').val());
	getLowerLists();
}

function searchSail() {
	_sdate3 = $.trim($('#sailsdate').val());
	_edate3 = $.trim($('#sailedate').val());
	_gid3 = $('#sailgidselect').val();
	if ($('#sailishz')[0].checked) {
		_ischeck3 = true;
	} else {
		_ischeck3 = false;
	}
	getSailList(1);
}

function searchLowerSails() {
	_sdate4 = $.trim($('#lowersdate').val());
	_edate4 = $.trim($('#loweredate').val());
	_gid4 = $('#lowergidselect').val();
	_nid4 = $('#lncname').val();
	_dl4 = $('#ldlsbh').val();
	if ($('#lowerishz')[0].checked) {
		_ischeck4 = true;
	} else {
		_ischeck4 = false;
	}
	getLowerSails(1);
}