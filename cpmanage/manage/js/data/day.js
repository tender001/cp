$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#table_con_day #f_date").val(d_s.format("YY-M-D"));
	$("#table_con_day #t_date").val(d_e.format("YY-M-D"));
	pageDay = function(pn){
		var chk = !!$("#table_con_day #chk").attr("checked");
		var param = new Object();
		if ( chk ) {
			param.fid = "query_statday_t";	
		} else {
			param.fid = "query_statday";
		}
		param.sdate = $("#table_con_day #f_date").val();
		param.edate = $("#table_con_day #t_date").val();
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
						dest:$("#table_day"),
						titles:['日期','注册用户','有效用户','活跃用户','销售金额','中奖金额','税后金额','交易佣金','充值金额','提现金额','账户余额','冻结金额'],
						fields:['statday','rusers','fusers','active','sale','award','tax','rate','fill','cash','balance','freeze']
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btnSelect").click(function(){
		pageDay(1);
	});
});