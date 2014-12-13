$(document).ready(function(){
	var uflag = 0;
	var index = 0;
	var user_nid = location.search.getParam('nid');
	$("#btn_user").click(function(){
		var data = new Object();
		data.fid = 'query_user_info';
		data.nid = user_nid;
		Tool.ajax('../qpage.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var rows = $(xml).find("row");
					if(rows.length > 0){
						var rdata = rows[0];
						var tds = $("#td_userinfo td[id]");
						for(var i = 0; i < tds.length; i++){
							var td_id = $(tds[i]).attr("id");
							if(td_id=='cbankcode'){
								$(tds[i]).html(SYS_CONFIG.getBankName($(rdata).attr(td_id)));
							}else{
								var val = $(rdata).attr(td_id);
								if(td_id == 'imobbind' || td_id == 'imailbind'){
									var html = $("#td_userinfo td[id='" + td_id + "']").html();
									if(val == '1'){
										html += "<br>[已绑定]";
									} else {
										html += "<br>[未绑定]";
									}
									$("#td_userinfo td[id='" + td_id + "']").html(html);
								} else {
									$(tds[i]).html($(rdata).attr(td_id));
								}
							}
						}
						uflag |= (1 << index);
					}
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
	$("#btn_charge_agent").click(function(){
		var agent = $("#tagent").val();
		if(agent.length == 0){
			Tool.warn("请先填写代理商名称");
			return;
		}
		var data = new Object();
		data.fid = 'spuserchangeagent';
		data.nid = user_nid;
		data.aid = agent;
		Tool.ajax('../sp.aspx',
			data,
			function(xml) {
				var desc = $(xml).find("Resp").attr("desc");
				Tool.warn(desc);
			}
		);
	});
	initBiz = function(eselect){
		var bizcount = SYS_CONFIG.biz.length;
		for(var b = 0; b < bizcount; b++){
			var _arr = SYS_CONFIG.biz[b];
			var opt = $("<option></option>");
			opt.attr("value",_arr[0]).html(_arr[1]);
			if(b == 0){
				opt.attr("selected", true); 
			}
			opt.appendTo(eselect);
		}
	};
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
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#table_user_charge_where #f_date").val(d_s.format("YY-M-D"));
	$("#table_user_charge_where #t_date").val(d_e.format("YY-M-D"));
	$("#table_user_project_where #f_date").val(d_s.format("YY-M-D"));
	$("#table_user_project_where #t_date").val(d_e.format("YY-M-D"));
	$("#table_user_probuy_where #f_date").val(d_s.format("YY-M-D"));
	$("#table_user_probuy_where #t_date").val(d_e.format("YY-M-D"));
	$("#table_user_zh_where #f_date").val(d_s.format("YY-M-D"));
	$("#table_user_zh_where #t_date").val(d_e.format("YY-M-D"));
	$("#table_user_autorec_where #f_date").val(d_s.format("YY-M-D"));
	$("#table_user_autorec_where #t_date").val(d_e.format("YY-M-D"));
	
	var biz_select = $("#table_user_charge_where #cboBiztype");
	initBiz(biz_select);
	var pro_select = $("#table_user_project_where #cboName");
	initGame(pro_select, 1);
	var probuy_select = $("#table_user_probuy_where #cboName");
	initGame(probuy_select, 1);
	var zh_select = $("#table_user_zh_where #cboName");
	initGame(zh_select, 1);
	
	$("#btn_user_account").click(function(){
		var data = new Object();
		data.fid = 'query_user_account';
		data.nid = user_nid;
		Tool.ajax('../qpage.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var rows = $(xml).find("row");
					if(rows.length > 0){
						var rdata = rows[0];
						var tds = $("#td_user_account td[id]");
						for(var i = 0; i < tds.length; i++){
							var td_id = $(tds[i]).attr("id");
							$(tds[i]).html($(rdata).attr(td_id));
						}
					}
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
	page_charge = function(pn){
		var data = new Object();
		data.bid = $("#table_user_charge_where #cboBiztype").val();
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
		data.stime = $("#table_user_charge_where #f_date").val();
		data.etime = $("#table_user_charge_where #t_date").val();
		data.pid = "%"+$("#table_user_charge_where #txtProj").val()+"%";
		var chk = !!$("#table_user_charge_where #chk").attr("checked");
		if ( chk ) {
			data.fid = "query_user_charge_t";	
			Tool.ajax('../qpage.aspx',
				data,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						var _arr = $(xml).find("row");
						if(_arr.length > 0){
							var _xml = $.parseXml($(xml).xml());
							for(var t = 0; t < _arr.length; t++){
								var _type = $(_arr[t]).attr("itype");
								var _m = $(_arr[t]).attr("m");
								$(_xml).find("row").attr("m" + (parseInt(_type) + 1),_m);
							}
							Tool.table({
								xml:_xml,
								listNode:'row',
								tableWidth:'100%',
								dest:$("#table_user_charge"),
								titles:['进帐金额','出帐金额'],
								fields:['m1','m2'],
								showpage:true,
								page:page_charge
							});
						}
					}else{
						Tool.warn(desc);
					}
				}
			);		
		} else {
			data.fid = "query_user_charge";	
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
							dest:$("#table_user_charge"),
							titles:['资金流水','进帐金额','出帐金额','操作时间','交易类型','变化前','变化后','业务数据'],
							fields:['ichargeid','m1','m2','cadddate','ibiztype','ioldmoney','ibalance','cmemo'],
							showpage:true,
							page:page_charge,
							formats:{ibiztype:function(fdata){
								return SYS_CONFIG.getBizType($(fdata).attr("ibiztype"));
							}}
						});
					}else{
						Tool.warn(desc);
					}
				}
			);
		}
	};
	$("#btn_user_charge").click(function(){
		page_charge(1);
	});
	page_pay = function(pn){
		var data = new Object();
		var chk = !!$("#table_user_pay_where #chk").attr("checked");
		data.fid = "query_user_pay";//查询需要设置开奖号码的期次
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
		if ( chk ) {
			data.success = 1;
		} else {
			data.success = 0;
		}
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
						dest:$("#table_user_pay"),
						titles:['充值编号','充值金额','手续费率','申请时间','确认时间','支付网关','处理内容','是否成功'],
						fields:['capplyid','imoney','irate','capplydate','cconfdate','cbankid','cmemo','nsuccess'],
						showpage:true,
						page:page_pay,
						formats:{cbankid:function(fdata){
							return SYS_CONFIG.getBank($(fdata).attr("cbankid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_pay").click(function(){
		page_pay(1);
	});
	page_cash = function(pn){
		var data = new Object();
		data.fid = "query_user_cash";
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_cash"),
						titles:['提现编号','提现金额','手续费率','申请时间','提现状态','确认时间','提现处理','处理内容','是否成功','银行卡号','银行名称','真实姓名'],
						fields:['icashid','imoney','irate','ccashdate','sname','cconfdate','coperator','cmemo','nsuccess','cbankno','cbankname','crealname'],
						showpage:true,
						page:page_cash
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_cash").click(function(){
		page_cash(1);
	});
	page_project = function(pn){
		var data = new Object();
		data.fid = "query_user_proj";
		data.nid = user_nid;
		data.gid = $("#table_user_project_where #cboName").val();
		if ( data.gid == "" ) {
			data.gid = "00";
		}
		data.pid = $("#table_user_project_where #txtProj").val();
		if(data.pid == ''){
			data.sdate = $("#table_user_project_where #f_date").val();
			data.edate = $("#table_user_project_where #t_date").val();
		}
		
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_project"),
						titles:['期次编号','方案编号','合买代购','投注倍数','方案金额','方案进度','是否满员','是否出票','中奖金额','投注时间','返点状态','返点时间'],
						fields:['cperiodid','cprojid','tname','imulity','itmoney','ijindu','sname','cname','ibonus','cadddate','jiesuan','cjsdate'],
						showpage:true,
						page:page_project
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_project").click(function(){
		page_project(1);
	});
	page_probuy = function(pn){
		var data = new Object();
		data.fid = "query_proj_buy";
		data.nid = user_nid;
		data.gid = $("#table_user_probuy_where #cboName").val();
		if ( data.gid == "" ) {
			data.gid = "00";
		}
		data.pid = $("#table_user_probuy_where #txtProj").val();
		if(data.pid == ''){
			data.sdate = $("#table_user_probuy_where #f_date").val();
			data.edate = $("#table_user_probuy_where #t_date").val();
		}
		
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_probuy"),
						titles:['期次编号','方案编号','购买金额','认购时间','是否取消','取消时间','中奖金额','派奖金额','派奖时间','是否返点','返点时间','发起人'],
						fields:['cprojid','cprojid','ibmoney','cbuydate','cname','ccanceldate','iamoney','irmoney','cretdate','jname','cjsdate','fname'],
						showpage:true,
						page:page_probuy
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_probuy").click(function(){
		page_probuy(1);
	});
	page_zh = function(pn){
		var data = new Object();
		data.fid = "query_user_zhuihao";
		data.nid = user_nid;
		data.gid = $("#table_user_zh_where #cboName").val();
		if ( data.gid == "" ) {
			data.gid = "00";
		}
		data.pid = $("#table_user_zh_where #txtProj").val();
		if(data.pid == ''){
			data.sdate = $("#table_user_zh_where #f_date").val();
			data.edate = $("#table_user_zh_where #t_date").val();
		}
		
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_zh"),
						titles:['追号编号','彩种编号','追号期数','追号类型','是否完成','成功期数','失败期数','追号日期','追号金额','停止原因','中奖金额','投注金额'],
						fields:['czhid','cgameid','ipnums','zname','fname','isuccess','ifailure','cadddate','itmoney','rname','ibonus','icasts'],
						showpage:true,
						page:page_zh,
						rowclick:function(data){
							if($(data).attr('column') == 0){
								window.showModalDialog("../zh/detail.html?gid=" + $(data).attr("cgameid") + "&zid=" + $(data).attr("czhid"),data,"dialogWidth=800px;dialogHeight=500px;scroll=no");
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_zh").click(function(){
		page_zh(1);
	});
	page_zhanji = function(pn){
		var data = new Object();
		data.fid = "query_user_zhanji";
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_zhanji"),
						titles:['记录编号','彩种名称','期次编号','方案编号','方案金额','中奖金额','金星数量','银星数量','记录时间'],
						fields:['irecid','cgameid','cperiodid','cprojid','ipmoney','iwmoney','iaunum','iagnum','cadddate'],
						showpage:true,
						page:page_zhanji,
						formats:{cgameid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("cgameid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_zhanji").click(function(){
		page_zhanji(1);
	});
	page_autobuy = function(pn){
		var data = new Object();
		data.fid = "query_user_auto";
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_autobuy"),
						titles:['发起人','彩种名称','跟单状态','跟单类别','跟单金额','跟单比例','是否限制','最小金额','最大金额','添加日期','不足是否购买'],
						fields:['cowner','cgameid','sname','itype','ibmoney','irate','lname','iminmoney','imaxmoney','cadddate','ibuy'],
						showpage:true,
						page:page_autobuy,
						formats:{cgameid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("cgameid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_autobuy").click(function(){
		page_autobuy(1);
	});
	page_autoed = function(pn){
		var data = new Object();
		data.fid = "query_user_autoed";
		data.nid = user_nid;
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_autoed"),
						titles:['发起人','彩种名称','跟单状态','跟单类别','跟单金额','跟单比例','是否限制','最小金额','最大金额','添加日期','不足是否购买'],
						fields:['cowner','cgameid','sname','itype','ibmoney','irate','lname','iminmoney','imaxmoney','cadddate','ibuy'],
						showpage:true,
						page:page_autoed,
						formats:{cgameid:function(fdata){
							return SYS_CONFIG.getGame($(fdata).attr("cgameid"));
						}}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_autoed").click(function(){
		page_autoed(1);
	});
	page_autorec = function(pn){
		var data = new Object();
		data.fid = "query_user_autorec";
		data.nid = user_nid;
		data.hid = $("#table_user_autorec_where #txtProj").val();
		if(data.hid == ''){
			data.sdate = $("#table_user_autorec_where #f_date").val();
			data.edate = $("#table_user_autorec_where #t_date").val();
		}
		
		data.pn = pn;
		data.tp = 0;
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
						dest:$("#table_user_autorec"),
						titles:['序号','彩种名称','发起人','方案编号','跟单类别','跟单金额','跟单比例','状态','是否成功','备注','跟单时间','不足是否购买'],
						fields:['rec','cgameid','cowner','cprojid','itype','imoney','irate','istate','isuccess','cerrdesc','cadddate','ibuy'],
						showpage:true,
						page:page_autorec
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	$("#btn_user_autorec").click(function(){
		page_autorec(1);
	});
	secBoard = function(n){
		var cells = $("#secTable").find("TD");
		for(var i = 0; i < cells.length; i++){
			$(cells[i]).removeClass().addClass("sec1");
		}
		index = n;
		$(cells[n]).addClass("sec2");
		var bodys = $("#mainTable").children("TBODY");
		for(var i = 0; i < bodys.length; i++){
			$(bodys[i]).hide();
		}
		$(bodys[n]).show();
	};
	user_resetpwd = function(func){
		if((uflag & (1 << index)) > 0){
			$.confirm({
				'title'		: '重置用户密码',
				'message'	: '你正在操作的是重置用户密码,改操作不可逆转! 确定要执行吗?',
				'buttons'	: {
					'Yes'	: {
						'class'	: 'blue',
						'action': function(){
							$.confirm.close();
							var data = new Object();
							data.fid = func;
							data.nid = user_nid;
							Tool.ajax('../update.aspx',
								data,
								function(xml) {
									var code = $(xml).find("Resp").attr("code");
									var desc = $(xml).find("Resp").attr("desc");
									if(code == 0){
										Tool.warn('重置密码成功');
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
		} else {
			Tool.warn('请先查询,再操作');
		}
	};
	user_mdf = function(func, tid, msg){
		var val = $("#" + tid).html();
		if(val.length == 0 || val.indexOf("*") != -1){
			Tool.warn('未查询或当前无值或值不完整,不支持修改');
		}else{
			$("#user-mdf-content #title").html(msg);
			$("#user-mdf-content #func").val(func);
			$("#user-mdf-content #tid").val(tid);
			$("#user-mdf-content #oldval").html(val);
			$("#user-mdf-content").modal({containerCss:{backgroundColor:"#ffe",borderColor:"#fff",height:200,padding:0,width:400}});
		}
	};
	user_get = function(func, tid){
		var val = $("#" + tid).html();
		if(val.length == 0){
			Tool.warn('未查询或当前无值,查询无效');
		} else {
			var data = new Object();
			data.fid = func;
			data.nid = user_nid;
			Tool.ajax('../query.aspx',
				data,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						var rows = $(xml).find("row");
						if(rows.length > 0){
							$("#td_userinfo td[id='" + tid + "']").html($(rows[0]).attr(tid));
						}
					}else{
						Tool.warn(desc);
					}
				}
			);
		}
	};
	user_do_mdf = function(){
		var data = new Object();
		var tid = $("#user-mdf-content #tid").val();
		data.fid = $("#user-mdf-content #func").val();
		data.nid = user_nid;
		data.oldValue = $("#user-mdf-content #oldval").html();
		data.newValue = $("#user-mdf-content #newval").val();
		$.modal.close();
		if(data.fid.length == 0 || data.nid.length == 0 || data.oldValue.length == 0 || data.newValue.length == 0){
			Tool.warn('参数不完整,无法更新数据');
		} else {
			Tool.ajax('../update.aspx',
				data,
				function(xml) {
					var code = $(xml).find("Resp").attr("code");
					var desc = $(xml).find("Resp").attr("desc");
					if(code == 0){
						$("#td_userinfo td[id='" + tid + "']").html(data.newValue);
						Tool.warn(desc);
					}else{
						Tool.warn(desc);
					}
				}
			);
		}
	};
});