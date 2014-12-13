$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("d", -1);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	pageAgent = function(pn){
		var data = new Object();
		data.nid = $("#txtUid").val();
		if ( data.nid.length > 0) {					
			data.sdate = '';
			data.edate = '';
		} else {					
			data.sdate = $("#f_date").val();
			data.edate = $("#t_date").val();
		}
		data.pn = pn;
		data.fid = "query_agentlist";
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
						dest:$("#table_agent"),
						titles:['代理商ID','代理商名称','真实姓名','购彩账户','状态','上级代理商','添加日前','代理商余额','绑定的银行卡号','绑定的银行名称','操作'],
						fields:['cagentid','cagentname','crealname','cnickid','state','cparentid','ccreatedate','ibalance','cbankno','cbankname','icash'],
						showpage:true,
						page:pageAgent,
						formats:{icash:function(fdata){
							var id = $(fdata).attr("rec")+"_"+$(fdata).attr("cagentid");
							return '<input type="radio" name="uselect" value="'+id+'" /><input type="hidden" id="'+id+'" value="'+$(fdata).xml().replaceAll("\"","'")+'">';
						}},
						rowclick:function(rdata){
							if($(rdata).attr('column') == 0){
								SYS_CONFIG.showAgent(rdata);
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	getSelectData = function(){
		var sel = $("input:checked");
		if(sel == undefined || sel.length == 0){
			Tool.warn("请先选择操作对象");
			return;
		}
		var id = $(sel).val();
		var xml = $.parseXml($("#" + id).val());
		var data = $(xml).find("row");
		return data;
	};
	$("#btnSelect").click(function(){
		pageAgent(1);
	});
	$("#add-agent-content #btnCancel").click(function(){
		$.modal.close();
	});
	$("#decmoney-agent-content #btnDescCancel").click(function(){
		$.modal.close();
	});
	$("#btnAddAgent").click(function(){
		$("#add-agent-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:250,padding:0,width:400}});
		
		$("#add-agent-content #btnNewAgent").unbind("click").click(function(){
			var param = new Object();				
			param.aid = $("#txtAid").val();
			param.nid = $("#txtNid").val();
			param.fid = "admin_add_agent";
			param.memo = $("#txtMemo").val();
			$.modal.close();
			Tool.ajax('../update.aspx',
				param,
				function(xml) {
					var desc = $(xml).find("Resp").attr("desc");
					Tool.warn(desc);
				}
			);
		});
	});
	$("#btnDecmoney").click(function(){
		var data = getSelectData();
		if(data != undefined){
			decmoney(data);
		}
	});
	decmoney = function(rdata){
		var tds = $("#table_decm_agent td[id]");
		for(var i = 0; i < tds.length; i++){
			var td_id = $(tds[i]).attr("id");
			$(tds[i]).html($(rdata).attr(td_id));
		}
		$("#decmoney-agent-content #xmoney").val("");
		$("#decmoney-agent-content #xmemo").val("");
		
		$("#decmoney-agent-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:250,padding:0,width:400}});

		$("#decmoney-agent-content #btnDescMoney").unbind("click").click(function(){
			var param = new Object();	
			param.fid="sp_agent_deduct_money";
			param.aid = $(rdata).attr("cagentid");
			param.money = $("#decmoney-agent-content #xmoney").val();
			param.memo =  $("#decmoney-agent-content #xmemo").val();	
			$.modal.close();
			Tool.ajax('../sp.aspx',
				param,
				function(xml) {
					var desc = $(xml).find("Resp").attr("desc");
					Tool.warn(desc);
				}
			);
		});
	};
});