$(document).ready(function(){
	var cprojid = location.search.getParam('cprojid');
	var czhid = location.search.getParam('czhid');
	var idetailid = location.search.getParam('idetailid');
	var fid = "";
	var buy_fid = "";
	if(cprojid.length > 0){
		fid = "q_proj_detail";
		buy_fid = "q_buy_detail";
		$("#h_gid").val(cprojid.substr(2,2));
		$("#h_hid").val(cprojid);
		$("#table_project").show();
		$("#table_zh").hide();
		$("#btn_project").click(function(){
			var param = new Object();
			param.fid = fid;	
			param.hid = cprojid;
			param.gid = cprojid.substr(2,2);
			Tool.ajax('../query.aspx',
				param,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						var rdata = $(xml).find("row");
						if(!!rdata){
							var tds = $("#table_project td[id]");
							for(var i = 0; i < tds.length; i++){
								var td_id = $(tds[i]).attr("id");
								var val = $(rdata).attr(td_id);
								var html = val;
								if("ccodes" == td_id && $(rdata).attr("ifile") == 1){
									///pupload/temp/90_130814173919_57f12fa438d37bab3fef5e2fc4077671_yd.xml
									var _gameid=$(rdata).attr("cgameid");
									var _cperiodid=$(rdata).attr("cperiodid");
									var source=$(rdata).attr("isource");
									if(source == 9){
										html += "&nbsp;&nbsp;<a target='_blank' href='http://www.139cai.com/cpdata/pupload/temp/"+val.replace("_n.txt","_yd.xml")+"'>原始方案</a>";
									} else {
										html += "&nbsp;&nbsp;<a target='_blank' href='http://www.139cai.com/cpdata/pupload/"+_gameid+"/"+_cperiodid+"/"+val.replace(".txt","_old.txt")+"'>原始方案</a>";
									}
									html += "&nbsp;&nbsp;<a target='_blank' href='http://www.139cai.com/cpdata/pupload/"+_gameid+"/"+_cperiodid+"/"+val+"'>出票方案</a>";
								}
								$(tds[i]).html(html);
							}
							$("#table_project #ctitle").val($(rdata).attr("ctitle"));
							$("#table_project #cdesc").val($(rdata).attr("cdesc"));
						}
					}else{
						Tool.warn(desc);
					}
				}
			);
		});
		$("#table_project #btnTDChange").click(function(){
			$.confirm({
				'title'		: '修改方案标题和描述',
				'message'	: '你正在操作的是修改方案标题和描述,彩种='+SYS_CONFIG.getGame($("#h_gid").val())+' 方案编号='+$("#h_hid").val()+' 确定要执行吗?',
				'buttons'	: {
					'Yes'	: {
						'class'	: 'blue',
						'action': function(){
							$.confirm.close();
							var param = new Object();
							param.fid = "edit_project_info";
							param.hid = $("#h_hid").val();
							param.gid = $("#h_gid").val();
							param.memo = $("#table_project #ctitle").val();
							param.newValue = $("#table_project #cdesc").val();
							Tool.ajax('../update.aspx',
								param,
								function(xml) {
									var code = $(xml).find("Resp").attr("code");
									var desc = $(xml).find("Resp").attr("desc");
									if(code == 0){
										Tool.warn('修改成功');
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
		});
	}
	if(czhid.length > 0 && idetailid.length > 0){
		fid = "q_zhdetail";
		buy_fid = "q_zhbuy_detail";
		$("#h_gid").val(czhid.substr(0,2));
		$("#h_hid").val(idetailid);
		$("#table_zh").show();
		$("#table_project").hide();
		$("#btn_project").click(function(){
			var param = new Object();
			param.fid = fid;	
			param.hid = idetailid;
			param.gid = czhid.substr(0,2);
			Tool.ajax('../query.aspx',
				param,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						var rdata = $(xml).find("row");
						if(!!rdata){
							var tds = $("#table_zh td[id]");
							for(var i = 0; i < tds.length; i++){
								var td_id = $(tds[i]).attr("id");
								$(tds[i]).html($(rdata).attr(td_id));
							}
						}
					}else{
						Tool.warn(desc);
					}
				}
			);
		});
	}
	if(fid.length == 0 || buy_fid.length == 0){
		Tool.warn("参数错误");
		return;
	}
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
	$("#btn_buy").click(function(){
		var param = new Object();
		param.fid = buy_fid;			
		param.hid = $("#h_hid").val();
		param.gid = $("#h_gid").val();
		param.nid = $("#txtUid").val();
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
						dest:$("#table_buy_detail"),
						titles:['认购编号','认购用户','认购时间','认购份数','认购金额','是否取消','中奖奖金','是否派奖','返点数量','是否返点'],
						fields:['ibuyid','cnickid','cbuydate','ibnum','ibmoney','icancel','iamoney','ireturn','iumoney','ijiesuan'],
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
});