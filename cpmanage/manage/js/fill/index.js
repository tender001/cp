$(document).ready(function(){
	page_fill = function(pn){
		var data = new Object();
		data.success = $("#cboSuccess").val();
		data.bid = $("#cboBankid").val();
		var uid = $("#txtUid").val();
		var oid = $("#txtOid").val();
		if ( uid.length > 0 || oid.length > 0) {
			data.nid = uid;
			data.oid = oid;
			data.sdate = '';
			data.edate = '';
		} else {
			data.nid = uid;
			data.oid = oid;
			data.sdate = $("#f_date").val();
			data.edate = $("#t_date").val();
		}
		var smoney = !!$("#money").attr("checked");
		if ( smoney ) {
			data.money = 0;
		} else {
			data.money ="";
		}	
		var chk = !!$("#chk").attr("checked");
		var ttype = $("#stype").val();
		if ( chk ) {
			if(ttype==0){
				data.fid = "query_fillorder_t";	
			}else if(ttype==1){
				data.fid = "query_fillorder_t_1";
			}
		} else {
			if(ttype==0){
				data.fid = "query_fillorder";
			}else if(ttype==1){
				data.fid = "query_fillorder_1";
			}
		}
		
		data.pn = pn;
		data.tp = 0;
		var url = "../qpage.aspx";
		if ( chk ) {
			url = "../query.aspx";
		}
		Tool.ajax(url,
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					Tool.table({
						xml:xml,
						listNode:'row',
						tableWidth:'100%',
						dest:$("#table_fillorder"),
						titles:['序号','订单编号','是否成功','用户昵称','充值金额','手续费用','充值时间','支付网关','到帐时间','备注','操作'],
						fields:['rec','capplyid','cflag','cnickid','imoney','irate','capplydate','cbankid','cconfdate','cmemo','ipayid'],
						showpage:true,
						page:page_fill,
						formats:{cbankid:function(fdata){
							return SYS_CONFIG.getFBank($(fdata).attr("cbankid"));
						},ipayid:function(fdata){
							if($(fdata).attr("isuccess") == 0){
								return "<input type='button' value='补单(双击)'/>";
							}else{
								return "--";
							}
						}},
						rowclick:function(data){
							if($(data).attr('column') == 3){
								SYS_CONFIG.showUser(data);
							}
							if($(data).attr('column') == 10 && $(data).attr("isuccess") == 0){
								$.confirm({
									'title'		: '用户充值补单--手工补单',
									'message'	: '你正在操作的是手工补单,订单='+$(data).attr("capplyid")+' 用户='+$(data).attr("cnickid")+' 充值金额='+$(data).attr("imoney")+' 确定要执行吗?',
									'buttons'	: {
										'Yes'	: {
											'class'	: 'blue',
											'action': function(){
												$.confirm.close();
												var param = new Object();
												param.memo = "后台补单";
												param.oid = $(data).attr("capplyid");
												param.fid = "fill_confirm";
												Tool.ajax('../sp.aspx',
													param,
													function(xml) {
														var code = $(xml).find("Resp").attr("code");
														var desc = $(xml).find("Resp").attr("desc");
														if(code == 0){
															Tool.warn('手工补单成功');
														}else{
															Tool.warn(desc);
														}
													}
												);
											}
										},
										'No'	: {
											'class'	: 'gray',
											'action': function(){}
										}
									}
								});
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	initFBank = function(eselect){
		var fbcount = SYS_CONFIG.fBank.length;
		for(var b = 0; b < fbcount; b++){
			var _arr = SYS_CONFIG.fBank[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == 0){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
	acmoney = function(title, fid){
		$("#money-content .titlebt").html(title);
		$("#money-content #txtNid").val("");
		$("#money-content #txtMoney").val("");
		$("#money-content #txtMemo").val("");
		$("#money-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:280,padding:0,width:400}});
		$("#money-content #btnmoney").unbind("click").click(function(){
			var param = new Object();
			param.memo = "[" + title + "]" + $("#money-content #txtMemo").val();
			param.nid = $("#money-content #txtNid").val();
			param.money = $("#money-content #txtMoney").val();
			param.fid = fid;
			$.modal.close();
			Tool.ajax('../sp.aspx',
				param,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						Tool.warn(title + '成功');
					}else{
						Tool.warn(desc);
					}
				}
			);
		});
		$("#money-content #icancel").unbind("icancel").click(function(){
			$.modal.close();
		});
	};
	var fb_select = $("#table_con_fill #cboBankid");
	initFBank(fb_select);
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#t_date").val(d_e.format("YY-M-D"));
	$("#button1").click(function(){
		page_fill(1);
	});
	$("#addmoney").click(function(){
		acmoney("后台手工加款", "add_money");
	});
	$("#decmoney").click(function(){
		acmoney("后台手工扣款", "dec_money");
	});
});