$(document).ready(function(){
	query = function(){
		var param = new Object();
		param.fid = "query_auditsale";
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
						dest:$("#table_bill"),
						titles:['彩种编号','彩种名称','期次编号','销售金额','出票金额','中奖金额','出票中奖','税后金额','出票税后','操作'],
						fields:['cgameid','cgamename','cperiodid','iosale','itsale','ioaward','itaward','iotax','ittax','istate'],
						formats:{istate:function(){
							return "<input type='button' value='派奖(双击)'/>";
						}},
						rowclick:function(data){
							if($(data).attr('column') == 9){
								$.confirm({
									'title'		: '出票核对管理--派奖',
									'message'	: '你正在操作的是期次审核派奖,彩种='+$(data).attr("cgamename")+' 期次='+$(data).attr("cperiodid")+' 确定要派奖吗?',
									'buttons'	: {
										'Yes'	: {
											'class'	: 'blue',
											'action': function(){
												$.confirm.close();
												var param = new Object();
												param.gid = $(data).attr("cgameid");
												param.pid = $(data).attr("cperiodid");
												param.fid = "audit_period_sale";
												Tool.ajax('../update.aspx',
													param,
													function(xml) {
														var code = $(xml).find("Resp").attr("code");
														var desc = $(xml).find("Resp").attr("desc");
														if(code == 0){
															Tool.warn('派奖审核成功');
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
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btnSelect").click(function(){
		query();
	});
});