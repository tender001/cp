$(document).ready(function(){
	initGame = function(eselect, idx){
		var jcs = SYS_CONFIG.getGameByType('jc');
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
	initGame($("#tbb"),0);
	initType($("#tba"),0);
	var d_e = new Date();
	var d_s = d_e.dateadd("d", -3);
	$("#sdate").val(d_s.format("YY-M-D"));
	$("#edate").val(d_e.format("YY-M-D"));
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
		param.sdate = $("#sdate").val();
		param.edate = $("#edate").val();
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
						titles:['序号','期次编号','方案编号','合买代购','发起人','投注倍数','方案金额','方案进度','方案状态','是否上传','是否出票','是否结算','中奖金额','满员时间','截止时间','是否派奖','撤单'],
						fields:['rec','cperiodid','cprojid','tname','cnickid','imulity','itmoney','ijindu','sname','upname','cname','jname','ibonus','cmydate','cendtime','pname','itype'],
						showpage:true,
						page:pageMoniter,
						formats:{ijindu:function(fdata){
							return $(fdata).attr("ijindu") + "%+" + (parseFloat($(fdata).attr("ipnum")) * 100 /parseFloat($(fdata).attr("inums"))).toFixed(0) + "%";
						},itype:function(fdata){
							if($(fdata).attr("icast") == 3){
								return '--';
							}else{
								return '<input type="button" value="撤单(双击)" />';
							}
						}},
						rowclick:function(data){
							if($(data).attr("column") == 16){
								$.confirm({
									'title'		: '竞彩方案监控--撤销方案',
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
							} else if($(data).attr("column") == 2){
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
});