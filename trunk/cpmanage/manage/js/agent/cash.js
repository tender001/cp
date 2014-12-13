$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("d", -1);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	pageCash = function(pn){
		var param = new Object();
		param.pn = pn;
		param.nid = $("#txtUid").val();
		param.state = $("#cboState").val();
		if ( param.nid.length > 0) {					
			param.sdate = '';
			param.edate = '';
		} else {					
			param.sdate = $("#f_date").val();
			param.edate = $("#t_date").val();
		}
		var ttype = $("#stype").val();
		if(ttype == 0){
			param.fid = "query_agentcashorder";
		}else if(ttype == 1){
			param.fid = "query_agentcashorder_1";
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
						dest:$("#table_agent_cash"),
						titles:['代理商ID','提现金额','申请日期','处理状态','银行卡号','银行名称','开户人姓名','处理日期','处理人','备注','操作'],
						fields:['cagentid','imoney','cadddate','state','cbankno','cbankname','crealname','cprocessdate','cprocessor','cmemo','icashid'],
						showpage:true,
						page:pageCash,
						formats:{icashid:function(fdata){
							if($(fdata).attr("isuccess") == 0){
								return "<input type='button' value='处理(双击)'/>";
							}else{
								return "--";
							}
						}},
						rowclick:function(data){
							if($(data).attr('column') == 10){
								var tds = $("#agent-cash-content td[id]");
								for(var idx=0; idx<tds.length; idx++){
									$(tds[idx]).html($(data).attr($(tds[idx]).attr("id")));
								}
								$("#agent-cash-content #icashid").val($(data).attr("icashid"));
								var isuccess = $(data).attr("isuccess");
								$("#agent-cash-content #isuccess1").unbind("click");
								$("#agent-cash-content #isuccess2").unbind("click");
								if(isuccess == 0){
									$("#agent-cash-content #isuccess1").click(processCash(1));
									$("#agent-cash-content #isuccess2").click(processCash(2));
								}else{
									$("#agent-cash-content #isuccess1").click(function(){$.modal.close();Tool.warn("已处理过了");});
									$("#agent-cash-content #isuccess2").click(function(){$.modal.close();Tool.warn("已处理过了");});
									$("#agent-cash-content #txtMemo").val($(data).attr("cmemo"));
								}
								$("#agent-cash-content #icancel").click(function(){
									$.modal.close();
								});
								$("#agent-cash-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:320,padding:0,width:400}});
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	processCash = function(type){
		var pdata = new Object();
		pdata.memo = $("#agent-cash-content #txtMemo").val();
		pdata.success = type;
		pdata.oid = $("#agent-cash-content #icashid").val();
		pdata.fid = "agent_cash_confirm";
		$.modal.close();
		Tool.ajax('../sp.aspx',
			pdata,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.warn("操作成功");
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#selectBtn").click(function(){
		pageCash(1);
	});
});