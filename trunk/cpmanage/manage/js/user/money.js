$(document).ready(function(){
	query=function(pn){
		var data = {};
		data.fid = "query_umoney_list";
		if (!!$("#chk").attr("checked")) {
			data.fid = "query_umoney_list_l";
		}
		
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
						dest:$("#conTable"),
						titles:['用户昵称','账户余额'],
						fields:['cnickid','ibalance'],
						rowclick:function(data){
							if($(data).attr('column') == 0){
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
		query(1);
	});
});