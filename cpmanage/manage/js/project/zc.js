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
		var jcs = SYS_CONFIG.getGameByType('zc');
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
		var gcount = SYS_CONFIG.moniter.length;
		for(var b = idx; b < gcount; b++){
			var _arr = SYS_CONFIG.moniter[b];
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
			'title'		: '足彩方案管理--撤销方案',
			'message'	: '你正在操作的是撤销方案,彩种='+SYS_CONFIG.getGame($(data).attr("cgameid"))+' 方案编号='+$(data).attr("cprojid")+' 确定要执行吗?',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
						$.confirm.close();
						var param = new Object();
						param.gid = $(data).attr("cgameid");
						param.fid = 'admin_proj_cancel';
						param.hid = $(data).attr("cprojid");
						Tool.ajax('../sp.aspx',
							param,
							function(xml) {
								var code = $(xml).find("Resp").attr("code");
								var desc = $(xml).find("Resp").attr("desc");
								if(code == 0){
									Tool.warn('撤销方案成功');
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
	projectUp = function(data){
		$.confirm({
			'title'		: '足彩方案管理--置顶操作',
			'message'	: '你正在操作的是置顶方案,彩种='+SYS_CONFIG.getGame($(data).attr("cgameid"))+' 方案编号='+$(data).attr("cprojid")+' 确定要执行吗?',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
						$.confirm.close();
						var param = new Object();
						param.gid = $(data).attr("cgameid");
						param.fid = 'update_proj_order';
						param.hid = $(data).attr("cprojid");
						Tool.ajax('../update.aspx',
							param,
							function(xml) {
								var code = $(xml).find("Resp").attr("code");
								var desc = $(xml).find("Resp").attr("desc");
								if(code == 0){
									Tool.warn('置顶方案成功');
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
	projectDown = function(data){
		$.confirm({
			'title'		: '足彩方案管理--撤销置顶操作',
			'message'	: '你正在操作的是撤销置顶方案,彩种='+SYS_CONFIG.getGame($(data).attr("cgameid"))+' 方案编号='+$(data).attr("cprojid")+' 确定要执行吗?',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
						$.confirm.close();
						var param = new Object();
						param.gid = $(data).attr("cgameid");
						param.fid = 'update_proj_norder';
						param.hid = $(data).attr("cprojid");
						Tool.ajax('../update.aspx',
							param,
							function(xml) {
								var code = $(xml).find("Resp").attr("code");
								var desc = $(xml).find("Resp").attr("desc");
								if(code == 0){
									Tool.warn('撤销置顶方案成功');
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
			param.fid = "proj_01";
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
						titles:['序号','期次编号','方案编号','合买代购','发起人','投注倍数','方案金额','方案进度','方案状态','是否上传','是否出票','是否结算','中奖金额','满员时间','截止时间','是否派奖','操作'],
						fields:['rec','cperiodid','cprojid','tname','cnickid','imulity','itmoney','ijindu','sname','upname','cname','jname','ibonus','cmydate','cendtime','pname','itype'],
						showpage:true,
						page:pageMoniter,
						formats:{ijindu:function(fdata){
							return $(fdata).attr("ijindu") + "%+" + (parseFloat($(fdata).attr("ipnum")) * 100 /parseFloat($(fdata).attr("inums"))).toFixed(0) + "%";
						},itype:function(fdata){
							if($(fdata).attr("icast") == 3){
								return '--';
							}else{
								var id = $(fdata).attr("cgameid") + "_" + $(fdata).attr("cprojid");
								return '<input type="radio" name="uselect" value="'+id+'" /><input type="hidden" id="'+id+'" value="'+$(fdata).xml().replaceAll("\"","'")+'">';
							}
						}},
						rowclick:function(data){
							if($(data).attr("column") == 2){
								SYS_CONFIG.showProject(data);
							} else if($(data).attr("column") == 4){
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
	$("#betToUp").click(function(){
		var data = getSelectData();
		if(data != undefined){projectUp(data);}
	});
	$("#btnToDown").click(function(){
		var data = getSelectData();
		if(data != undefined){projectDown(data);}
	});
	$("#btnProCancel").click(function(){
		var data = getSelectData();
		if(data != undefined){projectCancel(data);}
	});
	$("#btnBsPro").click(function(){
		var data = getSelectData();
		if($(data).attr("iupload") == 0 && $(data).attr("istate") >= 0 && $(data).attr("istate") < 2){
			var tds = $("#bs-project-content td[id]");
			for(var i = 0; i < tds.length; i++){
				var td_id = $(tds[i]).attr("id");
				$(tds[i]).html($(data).attr(td_id));
			}
			$("#bs-project-content #txtMoney").val($(data).attr("itmoney"));
			$("#bs-project-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:320,padding:0,width:400}});
			$("#bs-project-content #btnbs").unbind("click").click(function(){
				var obj = new Object();
				obj.gid = $(data).attr("cgameid");
				obj.fid = "sp_bs_proj";
				obj.hid = $(data).attr("cprojid");
				obj.money = $("#bs-project-content #txtMoney").val();
				$.modal.close();
				Tool.ajax('../sp.aspx',
					obj,
					function(xml) {
						var code = $(xml).find("Resp").attr("code");
						var desc = $(xml).find("Resp").attr("desc");
						if(code == 0){
							Tool.warn('方案扩单缩单成功');
						}else{
							Tool.warn(desc);
						}
					}
				);
			});
			$("#bs-project-content #btncancel").unbind("click").click(function(){
				$.modal.close();
			});
		}else{
			Tool.warn("方案不符合扩单缩单要求");
		}
	});
});