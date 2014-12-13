$(document).ready(function(){
	freshPeriod = function(){
		Tool.ajax('../query.aspx',
			{fid:'q_current_period',gid:$("#tbb").val()},
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var rows = $(xml).find("row");
					if(!!rows && rows.length > 0){
						$("#pid").val($(rows[0]).attr("pid"));
					}
				}else{
					Tool.warn(desc);
				}
			});
	};
	initGame = function(eselect, idx){
		var jcs = SYS_CONFIG.getGameByType('kp').concat(SYS_CONFIG.getGameByType('mp'));
		var gcount = jcs.length;
		for(var b = idx; b < gcount; b++){
			var _arr = jcs[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == idx){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	initType = function(eselect, idx){
		var gcount = SYS_CONFIG.zmoniter.length;
		for(var b = idx; b < gcount; b++){
			var _arr = SYS_CONFIG.zmoniter[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == idx){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	$("#tbb").change(function(){
		freshPeriod();
	});
	initGame($("#tbb"),0);
	initType($("#tba"),0);
	freshPeriod();
	
	projectCancel = function(data){
		$.confirm({
			'title'		: '追号方案管理--撤销追号',
			'message'	: '你正在操作的是撤销方案,彩种='+SYS_CONFIG.getGame($("#tbb").val())+' 追号编号='+$(data).attr("czhid") + "_" + $(data).attr("idetailid")+' 确定要执行吗?',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
						$.confirm.close();
						var param = new Object();
						param.gid = $("#tbb").val();
						param.fid = 'admin_zh_cancel';
						param.hid = $(data).attr("czhid");
						param.pid = $(data).attr("cperiodid");
						param.did = $(data).attr("idetailid");
						Tool.ajax('../sp.aspx',
							param,
							function(xml) {
								var code = $(xml).find("Resp").attr("code");
								var desc = $(xml).find("Resp").attr("desc");
								if(code == 0){
									Tool.warn('撤销追号成功');
								}else{
									Tool.warn(desc);
								}
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
	};
	pageMoniter = function(pn){
		var param = new Object();
		param.fid = $("#tba").val();
		param.nid = $("#nid").val();
		param.tp = 0;
		param.pn = pn;
		param.gid = $("#tbb").val();
		param.hid = $("#hid").val();
		if (param.hid.length > 0) {
			param.fid = "zh_01";
		}
		param.pid = $("#pid").val();
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
						dest:$("#jc_moniter_table"),
						titles:['序号','期次编号','追号编号','发起人','投注倍数','方案金额','方案状态','是否结算','中奖金额','是否派奖','撤单'],
						fields:['rec','cperiodid','czhid','cnickid','imulity','icmoney','sname','jname','iamoney','pname','idetailid'],
						showpage:true,
						page:pageMoniter,
						formats:{czhid:function(fdata){
							return $(fdata).attr("czhid") + "_" + $(fdata).attr("idetailid");
						},idetailid:function(fdata){
							if($(fdata).attr("istate") > 1){
								return '--';
							}else{
								return '<input type="button" value="撤单(双击)" />';
							}
						}},
						rowclick:function(data){
							if($(data).attr("column") == 10){
								projectCancel(data);
							}else if($(data).attr("column") == 2){
								SYS_CONFIG.showProject(data);
							} else if($(data).attr("column") == 3){
								SYS_CONFIG.showUser(data);
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#selectBtn").click(function(){
		pageMoniter(1);
	});
	getSelectData = function(){
		var sel = $("input:checked");
		if(sel == undefined || sel.length == 0){
			Tool.warn("请先选择操作对象");
			return;
		}
		var id = $(sel).val();
		var xml = $.parseXml($("#" + id).val());
		var data = $(xml).find("row");
		return data;
	};
	$("#btnProCancel").click(function(){
		var data = getSelectData();
		if(data != undefined){projectCancel(data);}
	});
});