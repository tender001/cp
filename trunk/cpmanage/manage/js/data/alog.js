$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -1);
	$("#table_con_alog #f_date").val(d_s.format("YY-M-D"));
	$("#table_con_alog #t_date").val(d_e.format("YY-M-D"));
	pageAlog = function(pn){
		var param = new Object();
		param.fid = "admin_logs";
		param.pn = pn;
		param.ps = 25;
		param.tp = 0;
		param.nid = $("#table_con_alog #txtNid").val();
		param.sdate = $("#table_con_alog #f_date").val();
		param.edate = $("#table_con_alog #t_date").val();
		
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
						dest:$("#table_alog"),
						titles:['记录编号','用户昵称','类型','IP地址','操作时间','操作内容'],
						fields:['irecid','cuserid','ctype','cipaddr','cadddate','cmemo'],
						showpage:true,
						page:pageAlog
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btnSelect").click(function(){
		pageAlog(1);
	});
});