$(document).ready(function(){
	query = function(){
		var param = new Object();
		param.fid = "query_hotuser";
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
						dest:$("#table_hotuser"),
						titles:['彩种编号','游戏名称','合买名人','操作'],
						fields:['cgameid','cname','cnickid','iplay'],
						formats:{iplay:function(){
							return "<input type='button' value='设置(双击)'/>";
						}},
						rowclick:function(data){
							if($(data).attr('column') == 3){
								setHotUser(data);
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	setHotUser = function(data){
		$("#hotuser-content #cgameid").html($(data).attr("cname"));
		$("#hotuser-content #txtMemo").html($(data).attr("cnickid"));
		$("#hotuser-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:280,padding:0,width:400}});
		$("#hotuser-content #btnSet").unbind("click").click(function(){
			var param = new Object();
			param.fid = "update_hotuser";
			param.gid = $(data).attr("cgameid");
			param.pid = 0;
			param.memo = $("#hotuser-content #txtMemo").val();
			$.modal.close();
			Tool.ajax('../update.aspx',
				param,
				function(xml) {
					var desc = $(xml).find("Resp").attr("desc");
					Tool.warn(desc);
					query();
				}
			);
		});
		$("#hotuser-content #btnCancel").unbind("click").click(function(){
			$.modal.close();
		});
	};
	$("#btnSelect").click(function(){
		query();
	});
});