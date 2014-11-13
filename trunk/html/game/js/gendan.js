$(function() {
	var lotid = location.search.getParam('lotid');
	var owner = location.search.getParam('owner');
	var type = location.search.getParam('type')+"";
	
	if (lotid == "" || owner == "") {
		return ;
	}
	var data = {
		gid:lotid,
		owner:owner
	};
	
	Y.ajax({
		url : $_user.url.qautobuy,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {
				var istate = "";// 状态
				var ilimit = "";// 是否有限制
				var iminmoney = "";// 方案最小金额
				var imaxmoney = "";// 方案最大金额
				var cadddate = "";// 添加时间
				var ibmoney = "";// 认购金额
				var inums = "";// 已购买次数
				var itmoney = "";// 已购买金额
				var itype = "";// 固定or比例
				var irate = "";// 比例
				var ibuy = "";// 方案剩余金额不足是否认购

				var nid = typeof (obj.Resp.row) == "undefined"?"-":"ok";
				if(nid=="ok"){
					var r = obj.Resp.row;
					istate = r.istate;// 状态
					ilimit = r.ilimit;// 是否有限制
					iminmoney = r.iminmoney;// 方案最小金额
					imaxmoney = r.imaxmoney;// 方案最大金额
					cadddate = r.cadddate;// 添加时间
					ibmoney = r.ibmoney;// 认购金额
					inums = r.inums;// 已购买次数
					itmoney = r.itmoney;// 已购买金额
					itype = r.itype;
					irate = r.irate;
					ibuy = r.ibuy;
				}
				
				var allm = "";
				var allc = "";
				var c = obj.Resp.count;
				allm = c.allm;
				allc = c.allc;
				var isfirst=false;
				isfirst=ibmoney==''?true:false;
				
				var title = '';
     			title +=isfirst?'定制':'修改';
				title += ' '+owner +'  '+ $_sys.getlotname(lotid)+'的自动跟单  '  ;
				
				$("div.tantop  span").html(title);
				if (isfirst){
					$("#btnAuto").html('首次定制');
					$("#history").hide();
				}else{
					$("#btnAuto").html('修改定制');
					$("#history").show();
				}
				
				$("#owner").html(owner);
				$("#lotname").html($_sys.getlotname(lotid));
				$("#d_allrs").html(allc);
				$("#d_allnum").html(allm);
				
				$("#anum").html(inums);
				$("#amoney").html(itmoney);

				$("#minm").val(iminmoney);
				$("#maxm").val(imaxmoney);
				
				$("input[name=ra][value=" + ilimit + "]").attr("checked",true);
				if(ilimit=="1"){$("#minm,#maxm").attr("disabled",false);}
				$("input[name=gd][value=" + itype + "]").attr("checked",true);
				$("input[name=rg][value=" + ibuy + "]").attr("checked",true);
				if (itype==0){
					$("#abl").removeClass("cur");
					$("#aje").addClass("cur");
					$("#je1").show();
//					$("#je2").show();
					$("#bl1").hide();
					$("#bl2").hide();
					$("#ty").val("0");
					$("#bmoney").val(ibmoney);
				}else{
					$("#aje").removeClass("cur");
					$("#abl").addClass("cur");
					$("#je1").hide();
//					$("#je2").hide();
					$("#bl1").show();
					$("#bl2").show();
					$("#ty").val("1");
					$("#blnum").val(irate);
				}
				if (ilimit==1){
					$("#settxt").show();
				}else{
					$("#settxt").hide();
				}

				if(type=="new"){
					$("#tclose").click(function(){
						window.close();
					});
				}
			} else {
				alert(desc);
				if (history.length == 0) {
					window.opener = '';
					window.location="/";
				} else {
					history.go(-1);
				}
			}
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
	var data2 = {
			func:'tjp',
			gid:lotid,
			uid:owner
		};
		Y.ajax({
			url : $_trade.url.tquery,
			type : "POST",
			dataType : "json",
			data : data2,
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
				var innum = incount = outnum = outcount = 0;
				rows = "";
				if (code == "0") {
					var r = obj.Resp.rows.row;
					var aunum = r.aunum;
					$("#zhanji").html($_sys.showzhanji(aunum,0));
				} 
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});
		
		$("#btnAuto").live('click', function(){
			var data = {
				gid:lotid,
				owner:owner,
				min:$("#minm").val(),
				max:$("#maxm").val(),
				money:$("#bmoney").val(),
				limit:$("#ra0").attr("checked")?0:1,
				flag:$("#ty").val(),
				gender:$("#blnum").val(),
				source:$("#rg1").attr("checked")?1:0
			};
			
			Y.ajax({
				url : $_user.url.aautobuy,
				type : "POST",
				dataType : "json",
				data : data,
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
					if (code == "0") {
						Y.alert(desc);
						 setTimeout(function(){
							 window.parent.location.reload();
          	           }, 1000);
					} else {
						Y.alert(desc);
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});
		});
});
function yesselect() {
	$("#settxt").hide();	
}

function noselect() {
	$("#settxt").show();
}

function jeselect() {
	$("#abl").removeClass("cur");
	$("#aje").addClass("cur");
	$("#je1").show();
	$("#je2").show();
	$("#bl1").hide();
	$("#bl2").hide();
	$("#ty").val("0");
}

function blselect() {
	$("#aje").removeClass("cur");
	$("#abl").addClass("cur");
	$("#je1").hide();
	$("#je2").hide();
	$("#bl1").show();
	$("#bl2").show();
	$("#ty").val("1");
}