$(document).ready(function(){
	var uflag = 0;
	var index = 0;
	var agent_nid = location.search.getParam('cagentid');
	isArray = function(r){
	    return Object.prototype.toString.call(o) === '[object Array]';   
	};
	xsagent = function(obj){
		agent_nid = $(obj).attr("value");
		$("#div_agent").html("代理商:" + agent_nid);
	};
	loadAgent = function(){
		var data = new Object();
		data.agent = agent_nid;
		data.qagent = agent_nid;
		data.fid = "query_agent_ltree";
		Tool.ajax('../ltree.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var r = $(xml).find('agent');
					var tbl = $("<table></table>");
					var tr = $("<tr style='cursor:pointer'><td value='"+r.attr("id")+"' onclick='xsagent(this)'>"+r.attr("name")+"</td></tr>");
					tr.appendTo(tbl);
					var rs = $(xml).find("node");
					$.each(rs, function(o,_r){
						var tr = $("<tr style='cursor:pointer'><td value='"+$(_r).attr("id")+"' onclick='xsagent(this)'>"+$(_r).attr("name")+"</td></tr>");
						tr.appendTo(tbl);
					});
					$("#tree").html(tbl);
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	loadAgent();
	$("#div_agent").html("代理商:" + agent_nid);
	secBoard = function(n){
		var cells = $("#secTable").find("TD");
		for(var i = 0; i < cells.length; i++){
			$(cells[i]).removeClass().addClass("sec1");
		}
		index = n;
		$(cells[n]).addClass("sec2");
		var bodys = $("#mainTable").children("TBODY");
		for(var i = 0; i < bodys.length; i++){
			$(bodys[i]).hide();
		}
		$(bodys[n]).show();
	};
	agent_mdf = function(func, tid, msg){
		var val = "";
		if("update_setagentpwd" != func){
			val = $("#" + tid).html();
			if(val.length == 0 || val.indexOf("*") != -1){
				Tool.warn('未查询或当前无值或值不完整,不支持修改');
				return;
			}
		}
		$("#agent-mdf-content #title").html(msg);
		$("#agent-mdf-content #func").val(func);
		$("#agent-mdf-content #tid").val(tid);
		$("#agent-mdf-content #oldval").html(val);
		$("#agent-mdf-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:200,padding:0,width:400}});
	};
	agent_do_mdf = function(){
		var data = new Object();
		var tid = $("#agent-mdf-content #tid").val();
		data.fid = $("#agent-mdf-content #func").val();
		data.qagent = agent_nid;
		data.oldValue = $("#agent-mdf-content #oldval").html();
		data.newValue = $("#agent-mdf-content #newval").val();
		$.modal.close();
		if(data.fid != 'update_setagentpwd' && (data.fid.length == 0 || data.qagent.length == 0 || data.oldValue.length == 0 || data.newValue.length == 0)){
			Tool.warn('参数不完整,无法更新数据');
			return;
		}
		Tool.ajax('../update.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					$("#table_agent_info td[id='" + tid + "']").html(data.newValue);
					Tool.warn(desc);
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_agent").click(function(){
		var data = new Object();
		data.qagent = agent_nid;
		data.fid = "query_agent_info";
		Tool.ajax('../query.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var rows = $(xml).find("row");
					if(rows.length > 0){
						var rdata = rows[0];
						var tds = $("#table_agent_info td[id]");
						for(var i = 0; i < tds.length; i++){
							var td_id = $(tds[i]).attr("id");
							$(tds[i]).html(SYS_CONFIG.P($(tds[i]).attr("data"))+$(rdata).attr(td_id));
						}
						uflag |= (1 << index);
					}
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
	changstate = function(){
		if((uflag & (1 << index)) > 0){
			$.confirm({
				'title'		: '修改代理商状态',
				'message'	: '你确定要修改代理商状态吗! 确定要执行吗?',
				'buttons'	: {
					'Yes'	: {
						'class'	: 'blue',
						'action': function(){
							$.confirm.close();
							var data = new Object();
							data.fid = "update_agentstate";
							data.qagent = agent_nid;
							Tool.ajax('../update.aspx',
								data,
								function(xml) {
									var desc = $(xml).find("Resp").attr("desc");
									Tool.warn(desc);
								}
							);
						}
					},
					'No'	: {
						'class'	: 'gray',
						'action': function(){}
					}
				}
			});
		} else {
			Tool.warn('请先查询,再操作');
		}
	};
	
	$("#btn_agent_rate").click(function(){
		var data = new Object();
		data.qagent = agent_nid;
		data.fid = "query_agent_rate";
		Tool.ajax('../query.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_agent_rate"),
						titles:['游戏名称','返点比率'],
						fields:['gid','irate'],
						formats:{gid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("gid"));
						},irate:function(fdata){
							return "<input type='text' data='"+$(fdata).attr("gid")+"' value='" + $(fdata).attr("irate") + "' />";
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
	$("#btn_update_agent_rate").click(function(){
		var all = $("#table_agent_rate input");
		if(all.length == 0){
			Tool.warn("请先查询设置好返点比例,再批量设置!");
			return;
		}
		var games = new Array();
		var rates = new Array();
		all.each(function(o,rt){
			games.push($(rt).attr("data"));
			rates.push($(rt).val());
		});
		
		var param = new Object();
		param.qagent = agent_nid;
		param.gid = games.join(",");
		param.money = rates.join(",");
		param.fid = "agent_set_gamerate";
		Tool.ajax('../sp.aspx',
			param,
			function(xml) {
				var desc = $(xml).find("Resp").attr("desc");
				Tool.warn(desc);
			}
		);
	});
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -1);
	$("#table_agent_charge_where #f_date").val(d_s.format("YY-MM-DD"));
	$("#table_agent_charge_where #t_date").val(d_e.format("YY-MM-DD"));
	$("#table_agent_user_where #f_date").val(d_s.format("YY-MM-DD"));
	$("#table_agent_user_where #t_date").val(d_e.format("YY-MM-DD"));
	$("#table_agent_sale_where #f_date").val(d_s.format("YY-MM-DD"));
	$("#table_agent_sale_where #t_date").val(d_e.format("YY-MM-DD"));
	$("#table_xagent_sale_where #f_date").val(d_s.format("YY-MM-DD"));
	$("#table_xagent_sale_where #t_date").val(d_e.format("YY-MM-DD"));
	initChargeType = function(eselect){
		var bizcount = SYS_CONFIG.agentcharge.length;
		for(var b = 0; b < bizcount; b++){
			var _arr = SYS_CONFIG.agentcharge[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == 0){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	initChargeType($("#table_agent_charge_where #cboName"));
	pageAgentCharge = function(pn){
		var param = new Object();
		param.qagent = agent_nid;
		var chk = !!$("#table_agent_charge_where #chk").attr("checked");
		if ( chk ) {
			param.fid = "query_agent_charge_t";
		} else {
			param.fid = "query_agent_charge";
		}
		param.sdate = $("#table_agent_charge_where #f_date").val();
		param.edate = $("#table_agent_charge_where #t_date").val();
		param.pn = pn;
		param.ps = 20;
		param.tp = 0;
		param.rc = 0;
	
		if ( $("#table_agent_charge_where #cboName").val().length > 0) {
			param.type = $("#table_agent_charge_where #cboName").val();					
		}
	
		Tool.ajax('../qpage.aspx',
			param,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_agent_charge"),
						titles:['流水号','进帐','出帐','用户','交易类型','发生时间','游戏','期次','比率'],
						fields:['cid','jmoney','cmoney','cuid','otype','adddate','gid','pid','rate'],
						showpage:true,
						page:pageAgentCharge,
						formats:{gid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("gid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_agent_charge").click(function(){
		pageAgentCharge(1);
	});
	pageAgentUser = function(pn){
		var param = new Object();
		param.qagent = agent_nid;
		param.fid = "query_agent_user";
		param.sdate = $("#table_agent_user_where #f_date").val();
		param.edate = $("#table_agent_user_where #t_date").val();
		param.pn = pn;
		param.ps = 20;
		param.tp = 0;
		param.rc = 0;
		var chk = !!$("#table_agent_user_where #chk").attr("checked");
		if ( chk ) {
			param.money = "1";
		} else {
			param.money = "";
		}
		var txtNid = $("#txtNid").val();
		if(txtNid.length > 0){
			param.nid = txtNid;
		}
		Tool.ajax('../qpage.aspx',
			param,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_agent_user"),
						titles:['用户昵称','真实姓名','余额','充值','注册日期'],
						fields:['cnickid','crealname','ibalance','cfill','cadddate'],
						showpage:true,
						page:pageAgentUser
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_agent_user").click(function(){
		pageAgentUser(1);
	});
	initGame = function(eselect, idx){
		var gcount = SYS_CONFIG.game.length;
		for(var b = idx; b < gcount; b++){
			var _arr = SYS_CONFIG.game[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == idx){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	initGame($("#table_agent_sale_where #cboName"),0);
	pageAgentSale = function(pn){
		var param = new Object();
		param.qagent = agent_nid;
		var chk = !!$("#table_agent_sale_where #chk").attr("checked");
		if ( chk ) {
			param.fid = "query_agent_salestat_t";
		} else {
			param.fid = "query_agent_salestat";
		}
		param.sdate = $("#table_agent_sale_where #f_date").val();
		param.edate = $("#table_agent_sale_where #t_date").val();
	
		if ( $("#table_agent_sale_where #cboName").val().length > 0) {
			param.gid = $("#table_agent_sale_where #cboName").val();					
		}
		
		Tool.ajax('../query.aspx',
			param,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_agent_sale"),
						titles:['日期','彩种名称','销售金额'],
						fields:['statday','gid','sales'],
						formats:{gid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("gid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_agent_sale").click(function(){
		pageAgentSale(1);
	});
	initGame($("#table_xagent_sale_where #cboName"),0);
	pageXAgentSale = function(pn){
		var param = new Object();
		param.qagent = agent_nid;
		var chk = !!$("#table_xagent_sale_where #chk").attr("checked");
		if ( chk ) {
			param.fid = "query_xagent_salestat_t";
		} else {
			param.fid = "query_xagent_salestat";
		}
		param.sdate = $("#table_xagent_sale_where #f_date").val();
		param.edate = $("#table_xagent_sale_where #t_date").val();
	
		if ( $("#table_xagent_sale_where #cboName").val().length > 0) {
			param.gid = $("#table_xagent_sale_where #cboName").val();					
		}
		
		Tool.ajax('../query.aspx',
			param,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_xagent_sale"),
						titles:['日期','代理名称','代理层级','彩种名称','销售金额'],
						fields:['statday','cagentid','apath','gid','sales'],
						formats:{gid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("gid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_xagent_sale").click(function(){
		pageXAgentSale(1);
	});
});