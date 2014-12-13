$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("d", -1);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	pageTrans = function(pn){
		var param = new Object();
		param.pn = pn;
		param.nid = $("#txtUid").val();
		param.oid = $("#txtOid").val();
		if ( param.nid.length > 0 || param.oid > 0) {					
			param.sdate = '';
			param.edate = '';
		} else {					
			param.sdate = $("#f_date").val();
			param.edate = $("#t_date").val();
		}
		var chkHZ = !!$("#chkHZ").attr("checked");
		if(chkHZ){
			param.fid = "query_agenttransfer_1";
		}else{
			param.fid = "query_agenttransfer";
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
						dest:$("#table_trans"),
						titles:['代理商编号','代理商名称','金额','转款时间','用户名'],
						fields:['cagentid','cagentname','imoney','cadddate','uname'],
						showpage:true,
						page:pageTrans,
						rowclick:function(rdata){
							if($(rdata).attr('column') == 0){
								SYS_CONFIG.showAgent(data);
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
		pageTrans(1);
	});
});