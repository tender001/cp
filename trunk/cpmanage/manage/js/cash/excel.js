$(document).ready(function(){
	page_excel = function(pn){
		var data = new Object();
		data.nid = $("#txtUid").val();	
		data.oid = $("#txtOid").val();
		data.state = $("#cboState").val();
		data.success = $("#cboSuccess").val();
		data.pn = pn;
		if ( data.oid.length > 0||data.oid.length>0) {					
			data.sdate = '';
			data.edate = '';
		} else {					
			data.sdate = $("#f_date").val();
			data.edate = $("#t_date").val();
		}
		var chk = !!$("#chk").attr("checked");
		var ttype = $("#stype").val();
		if (chk) {
			if(ttype == 0){
				data.fid = "query_cashorder_t";	
			}else if(ttype == 1){
				data.fid = "query_cashorder_t_1";	
			}
		} else {
			if(ttype==0){
				data.fid = "query_cashorder";
			}else if(ttype==1){
				data.fid = "query_cashorder_1";
			}
		}
		window.open("../page.aspx?fid="+data.fid+"&edate="+data.edate+"&sdate="+data.sdate+"&oid="+data.oid+"&state="+data.state+"&success="+data.success+"&pn="+data.pn+"&nid="+data.nid);
	};
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	$("#excelBtn").click(function(){
		var no=$("#table_cashorder tfoot td a b").html();
		
		page_excel(no);
		
	});
});