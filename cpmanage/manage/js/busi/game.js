$(document).ready(function(){
	
	
	query = function(){
		var param = new Object();
		param.fid = "query_gamelist";
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
						dest:$("#table_game"),
						titles:['彩种名称','彩种编号','销售状态','操作'],
						fields:['name','gid','sale','isale'],
						formats:{isale:function(fdata){
							var id = $(fdata).attr("gid") + "_" + $(fdata).attr("isale");
							return '<input type="radio" name="isale" value="'+id+'" /><input type="hidden" id="'+id+'" value="'+$(fdata).xml().replaceAll("\"","'")+'">';
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	gameSale = function(data, sale){
		if(sale < 0 || sale > 2){
			Tool.warn("参赛错误");
			return;
		}
		var state = ['停售','销售','白名单'];
		$.confirm({
			'title'		: '彩种销售设置',
			'message'	: '你正在操作的是彩种销售设置,您确定要 设置 彩种='+$(data).attr("name")+ ' ' + state[sale] + ' 确定要执行吗?',
			'buttons'	: {
				'Yes'	: {
					'class'	: 'blue',
					'action': function(){
						$.confirm.close();
						var param = new Object();
						param.fid = "set_gameconfig";
						param.gid = $(data).attr("gid");
						param.bid = sale;
						
						Tool.ajax('../update.aspx',
							param,
							function(xml) {
								var code = $(xml).find("Resp").attr("code");
								var desc = $(xml).find("Resp").attr("desc");
								if(code == 0){
									Tool.warn('彩种销售设置成功');
									query();
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
	$("#btnSelect").click(function(){
		query();
	});
	$("#btnOpen").click(function(){
		var data = getSelectData();
		if(data != undefined){
			if($(data).attr("isale") == 2){
				Tool.warn("已经在白名单状态");
			}else{
				gameSale(data,2);
			}
		}
	});
	$("#btnSale").click(function(){
		var data = getSelectData();
		if(data != undefined){
			if($(data).attr("isale") == 1){
				Tool.warn("已经在销售状态");
			}else{
				gameSale(data,1);
			}
		}
	});
	$("#btnStop").click(function(){
		var data = getSelectData();
		if(data != undefined){
			if($(data).attr("isale") == 0){
				Tool.warn("已经在停售状态");
			}else{
				gameSale(data,0);
			}
		}
	});
});