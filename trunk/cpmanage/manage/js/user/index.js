$(document).ready(function(){
	var d_e = new Date();
	var d_s = d_e.dateadd("m", -3);
	$("#f_date").val(d_s.format("YY-M-D"));
	$("#e_date").val(d_e.format("YY-M-D"));
	
	query=function(pn){
		var data = {};
		data.rc = 0;
		data.tp = 0;
		data.pn = pn;
		data.fid = "query_user";
		data.ps = 20;
		data.nid = $("#txtNid").val();
		data.aid = $("#txtAid").val();
		data.rname = $("#txtReal").val();
		data.idcard = $("#txtCard").val();
		data.mobileno = $("#txtMobileNo").val();
		data.emailaddr = $("#txtEmailAddr").val();
		data.telephone = $("#txtTelephone").val();
		data.sdate = $("#f_date").val();
		data.edate = $("#t_date").val();
		
		if (data.nid.length > 0
			||data.rname.length>0
			||data.idcard.length>0
			||data.mobileno.length>0
			||data.emailaddr.length>0
			||data.telephone.length>0) {		
			data.stime = '';
			data.etime = '';
		} else {	
			if (!!$("#chkFill").attr("checked")) {
				data.money = "1";
			} else {
				data.money = "";
			}
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
						dest:$("#conTable"),
						titles:['序号','用户昵称','真实姓名','账户余额','身份号码','手机号码','电子邮件','代理商','注册日期','活动日期'],
						fields:['rec','cnickid','crealname','ibalance','cidcard','cmobileno','cemailaddr','cagentid','cadddate','cactivedate'],
						showpage:true,
						page:query,
						rowclick:function(data){
							if($(data).attr('column') == 1){
								SYS_CONFIG.showUser(data);
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	
	$("#selectBtn").click(function(){
		query(1);
	});
});