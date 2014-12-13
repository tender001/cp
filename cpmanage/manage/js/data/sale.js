$(document).ready(function(){
	initGame = function(eselect, idx){
		var gcount = SYS_CONFIG.game.length;
		for(var b = idx; b < gcount; b++){
			var _arr = SYS_CONFIG.game[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == idx){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	var pro_select = $("#table_con_sale #cboName");
	initGame(pro_select, 1);
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -1);
	$("#table_con_sale #f_date").val(d_s.format("YY-M-D"));
	$("#table_con_sale #t_date").val(d_e.format("YY-M-D"));
	pageSale = function(pn){
		var chk = !!$("#table_con_sale #chk").attr("checked");
		var param = new Object();
		if ( chk ) {
			param.fid = "query_gamestat_t";	
		} else {
			param.fid = "query_gamestat";
		}
		param.gid = $("#table_con_sale #cboName").val();
		param.sdate = $("#table_con_sale #f_date").val();
		param.edate = $("#table_con_sale #t_date").val();
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
						dest:$("#table_sale"),
						titles:['日期','销售金额','中奖金额','税后金额'],
						fields:['statday','sale','award','tax']
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btnSelect").click(function(){
		pageSale(1);
	});
});