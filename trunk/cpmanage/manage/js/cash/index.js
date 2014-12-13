$(document).ready(function(){
	page_cash = function(pn){
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
		processCash = function(type){
			var pdata = new Object();
			pdata.memo = $("#cash-content #txtMemo").val();
			pdata.success = type;
			pdata.oid = $("#cash-content #icashid").val();
			pdata.fid = "cash_confirm";
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
		Tool.ajax('../qpage.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_cashorder"),
						titles:['序号','订单编号','用户昵称','用户姓名','省份','城市','银行名称','支行名称','银行卡号','提款金额','手续费用','提款时间','处理时间','是否处理','订单状态'],
						fields:['rec','icashid','cnickid','crealname','cbankpro','cbankcity','cbankcode','cbankname','cbankcard','imoney','irate','ccashdate','cconfdate','state','success'],
						showpage:true,
						page:page_cash,
						formats:{cbankcode:function(fdata){
							return SYS_CONFIG.getBankName($(fdata).attr("cbankcode"));
						}},
						rowclick:function(data){
							var tds = $("#cash-content td[id]");
							for(var idx=0; idx<tds.length; idx++){
								$(tds[idx]).html($(data).attr($(tds[idx]).attr("id")));
							}
							$("#cash-content #icashid").val($(data).attr("icashid"));
							var isuccess = $(data).attr("isuccess");
							$("#cash-content #isuccess1").unbind("click");
							$("#cash-content #isuccess2").unbind("click");
							$("#cash-content #isuccess3").unbind("click");
							if(isuccess == 0){
								$("#cash-content #isuccess1").click(processCash(1));
								$("#cash-content #isuccess2").click(processCash(2));
								$("#cash-content #isuccess3").click(processCash(3));
							}else{
								$("#cash-content #isuccess1").click(function(){$.modal.close();Tool.warn("已处理过了");});
								$("#cash-content #isuccess2").click(function(){$.modal.close();Tool.warn("已处理过了");});
								$("#cash-content #isuccess3").click(function(){$.modal.close();Tool.warn("已处理过了");});
								$("#cash-content #cmemo").val($(data).attr("cmemo"));
							}
							$("#cash-content #icancel").click(function(){
								$.modal.close();
							});
							$("#cash-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:320,padding:0,width:400}});
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	$("#selectBtn").click(function(){
		page_cash(1);
	});
});