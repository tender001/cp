$(document).ready(function(){
	$("#comtouser").click(function(){
		var nid = $("#nid").val();
		var money = $("#money").val();
		var memo = $("#memo").val();
		if(nid.length > 0 && money.length > 0 && memo.length > 0){
			var param = new Object();
			param.fid = "sp_comp_to_user";
			param.nid = nid;
			param.money = money;
			param.memo = memo;
			$.confirm({
				'title'		: '赔款系统',
				'message'	: '你正在操作的是赔款系统,你是想赔偿 用户='+nid+' 金额='+money+' 确定要执行吗?',
				'buttons'	: {
					'Yes'	: {
						'class'	: 'blue',
						'action': function(){
							$.confirm.close();
							Tool.ajax('../sp.aspx',
								param,
								function(xml) {
									var code = $(xml).find("Resp").attr("code");
									var desc = $(xml).find("Resp").attr("desc");
									if(code == 0){
										Tool.warn('赔款成功');
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
		}else{
			Tool.warn('请完整填写信息');
		}
	});
});