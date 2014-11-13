$(function() {
	loadSI();
});
var loadSI = function() {
	var pn = 1;// 页码
	var ps = 10;// 页面大小
	var tp = 0;// 总页数
	var tr = 0;// 总记录数
Y.ajax({
						url : "/cpdata/time.json",
				end : function(data) {
					var servernow = Y.getDate(data.date);
					var d_e = new Date(servernow);
					var d_s = d_e.dateadd("m", -3);
					$("#begintime").val(d_s.format("YY-MM-DD"));
					$("#endtime").val(d_e.format("YY-MM-DD"));
					ESONCalendar.init().bind("begintime").bind("endtime").splitChar = "-";
					agVerify(pn, ps, tp, tr);
				}
			});
};
var agVerify = function(pn, ps,tp,tr){
Y.ajax({
		url : $_user.url.base,
		type : "POST",
		dataType : "json",
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;
			if (code == "0") {
				var r = obj.Resp.row;
				var vlevel = Y.getInt(r.vlevel);// 代理级别
				var isagent = Y.getInt(r.isagent);// 代理
				var vmon = parseFloat(r.usermoeny).rmb();// 账户余额
				$("#nid").val(r.nickid);
				$("#cagentid").val(r.cagentid);// 代理商名
				// isagent==1&&(vlevel==3 || vlevel==4 || vlevel==5)
				if (isagent == 1) {
					$("#td_fanmoney").html(vmon);
					$("#td_zhuangkuan").click(
							function() {
								var money = $("#amountMoney").val();
								var newValue = $.trim($("#newValue").val());
								var desc = $.trim($("#yzm").val());
								if (newValue == "") {
									Y.alert("请输入用户名");
									return false;
								}
								if (money < 1) {
									Y.alert('转款金额至少为1元');
									$("#money").focus();
									return false;
								}
								if (desc == "") {
									Y.alert("请输入备注");
									return false;
								}
								var data = "&newValue="
										+ encodeURIComponent(newValue)
										+ "&qtype=" + money + "&yzm="
										+ encodeURIComponent(desc);
								Y.confirm("转款成功后不能撤销，确定要转款？", function() {
									gozk(data);
								}, '', 1);
							});
					showInfo($("#begintime").val(), $("#endtime").val(), pn,
							ps, tp, tr);
					$("#td_submit").bind(
							{
								click : function() {
									var pn = 1;// 页码
									var ps = 10;// 页面大小
									var tp = 0;// 总页数
									var tr = 0;// 总记录数
									showInfo($("#begintime").val(), $(
											"#endtime").val(), pn, ps, tp, tr);
								}
							});
				} else {
					Y.alert("您的用户类型错误！", 0, 0, 1);
					return false;
				}
			} else {
				if (code == "1") {
					parent.window.Y.postMsg('msg_login', function() {
						window.location.reload();
					});
				} else {
					Y.alert("您所请求的页面有异常！", 0, 0, 1);
					return false;
				}
			}
		},
		error : function() {
			Y.alert("您所请求的页面有异常！", 0, 0, 1);
			return false;
		}
	});
};
// 分页调用
function takeShow(pn, ps, tp, tr) {
	var td_btime = $("#begintime").val();
	var td_etime = $("#endtime").val();
	showInfo(td_btime, td_etime, pn, ps, tp, tr);
};
// 账户明细显示
var showInfo = function(stime, etime, pn, ps, tp, tr) {// 页码 页面大小 总页数 总记录数
	var data = "";
	tp = 0;
	data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "="
			+ etime + "&tid=198";
	$("#showdatalist").html("");
	var html = "";
	data += "&" + $_user.key.pn + "=" + pn;
	data += "&" + $_user.key.ps + "=" + ps;
	data += "&" + $_user.key.tp + "=" + tp;
	data += "&" + $_user.key.tr+"="+tr;
Y.ajax({
		url : $_user.url.account,
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;
			var innum = incount = outnum = outcount = 0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.row;
				var rs = obj.Resp.count;
				tr = Y.getInt(rs.rc);
				tp = Y.getInt(rs.tp);
				ps = Y.getInt(rs.ps);
				pn = Y.getInt(rs.pn);
				if (tr % ps == 0) {
					tp = tr / ps;
				} else {
					tp = Math.ceil(tr / ps);
				}
				if (tr == 0) {
					html += "<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
					$("#page_div").hide();
				} else {
					if (!this.isArray(r)) {
						r = new Array(r);
					}
					r.each(function(rt, o) {
						var cadddate = rt.cadddate;
						var itype = rt.itype;
						var imoney = rt.imoney;
						var ibalance = rt.ibalance;
						var ibiztype = rt.ibiztype;
						var ichargeid = rt.ichargeid;
						var cmemo = rt.cmemo;
						var s = cmemo.split("|")[1];
						html += "<tr>";
						html += "<td>" + ichargeid + "</td>";
						html += "<td>" + cadddate + "</td>";
						html += "<td><span style='color:green;'>￥"
								+ parseFloat(imoney).rmb(false)
								+ "</span></td>";
						html += "<td>" + s + "</td>";
						html += "<td>" + cmemo + "</td>";
						html += " </tr>";
					});
				}
				// <tr class=""><td><a
				// target="_blank">6266614</a></td><td>2014-06-12
				// 13:04:30</td><td><s
				// style="color:red;">￥16.00</s></td><td>哈尼</td><td
				// title="竞彩让球保底冻结">竞彩让球保底冻结 </td> </tr>
			} else {
				if (code == "1") {
					parent.window.Y.postMsg('msg_login', function() {
						window.location.reload();
					});
				} else {
					html += "<tr><td colspan='7'>暂时没有您的信息！</td></tr>";
					$("#page_div").hide();
				}
			}
			$("#showdatalist").html(html);
			$("#page_div").html(getpage(pn, ps, tp, tr, "takeShow"));
			$("#page_div").show();
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
};
// 转款
var gozk = function(data) {
	$.ajax({
		url : "/phpu/vtfa.phpx?rnd=" + Math.random(),
		type : "POST",
		dataType : "json",
		data : data,
		success : function(obj) {
			var desc = obj.Resp.desc;
			Y.alert(desc);
			Y.alert(desc, function() {
				location.reload();
			}, false, true);
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
};
