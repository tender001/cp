$(document).ready(function(){
	initU = function(){
		var data = new Object();
		data.fid = "query_adminlist";
		Tool.ajax('../query.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var r = $(xml).find("row");
					var uselect = $("#auser");
					$("<option value='' selected>请选择用户</option>").appendTo(uselect);
					r.each(function(o, rt){
						var op = $("<option></option>").html($(rt).attr("cuserid")).attr("value",$(rt).attr("cuserid"));
						op.appendTo(uselect);
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	initAuth = function(uid){
		$("#table_auser").html("");
		var toTable = $("#table_auser");
		var data = new Object();
		data.fid = "query_admin_auths";
		data.nid = uid;
		Tool.ajax('../auth.aspx',
			data,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					var menus = $(xml).find("Resp").children("node");
					var table = $('<table border="1" class="ctable" width="100%"></table>');
					$(table).appendTo(toTable);
					menus.each(function(o,rt){
						var tr = $("<tr height='30'></tr>");
						$(tr).appendTo(table);
						$("<td colspan='4'></td>").html("&nbsp;&nbsp;" + $(rt).attr("name") + "[" + $(rt).attr("id") + "]").appendTo(tr);
						var nodes = $(rt).children("node");
						var rnum = nodes.length % 4 == 0 ? parseInt(nodes.length / 4) : parseInt(nodes.length / 4) + 1;
						for(var ri = 0; ri < rnum; ri++){
							var _tr = $("<tr class='tr0'></tr>");
							$(_tr).appendTo(table);
							for(var t = 0; t < 4; t++){
								var _td = $("<td>&nbsp;&nbsp;</td>");
								$(_td).appendTo(_tr);
								var idx = ri * 4 + t;
								if(idx < nodes.length){
									$(_td).html("&nbsp;&nbsp;<input type='checkbox' value='" + $(rt).attr("id") + ":" + $(nodes[idx]).attr("id") + "' "+ ($(nodes[idx]).attr("selected")=='true'?"checked":"") +"/>&nbsp;" + $(nodes[idx]).attr("name"));
								}
							}
						}
					});
				}else{
					Tool.warn(desc);
				}
			}
		);
	};
	initU();
	$("#auser").change(function(){
		var val = $("#auser").val();
		$("#table_auser").html("");
		if(val.length > 0){
			initAuth(val);
		}
	});
	$("#butSave").click(function(){
		var uid = $("#auser").val();
		if(uid.length == 0){
			Tool.warn("请先选择用户");
			return;
		}
		var check = $("input:checked");
		var arr = new Array();
		check.each(function(o,rt){
			var cval = $(rt).val();
			var cp = cval.split(":");
			if(cp.length == 2){
				var _arr = arr[parseInt(cp[0])];
				if(_arr==undefined){ _arr = []; }
				_arr.push(cp[1]);
				arr[parseInt(cp[0])] = _arr;
			}
		});
		var auth = new Array();
		$.each(arr, function(i, item){
			if(item != undefined){
				auth.push(i + ":" + item.join(","));
			}
		});
		var param = new Object();
		param.fid = "set_admin_auth";
		param.nid = uid;
		param.memo = auth.join(";");
		Tool.ajax('../setAuth.aspx',
			param,
			function(xml) {
				var code = $(xml).find("Resp").attr("code");
				var desc = $(xml).find("Resp").attr("desc");
				if(code == 0){
					initAuth(uid);
				}else{
					Tool.warn(desc);
				}
			}
		);
	});
});