function showkjdetail(){
	var gid = location.search.getParam('gid');
	var pid = location.search.getParam('pid');
	if(gid == undefined || pid == undefined){
		showTips('参数异常!');
		return;
	}
	var gname = $_sys.getlotname(gid);
	document.title = gname + document.title;
	$("em#em").html(gname+"开奖");
//	if(gid==80){
//		$("em#em").html("胜负彩开奖");
//	}else if(gid==81){
//		$("em#em").html("任九开奖");
//	}else if(gid==82){
//		$("em#em").html("进球彩开奖");
//	}else if(gid==83){
//		$("em#em").html("半全场开奖");
//	}
	$.ajax({
		url:"/cpdata/guoguan/"+gid+"/index.json?r="+Math.random(),
//		http://www.159cai.com/cpdata/guoguan/83/index.json
		type : "get",
		dataType : "json",
		success : function(d) {
		
		
				var rs = d.rows.row;
				var html = [];
				if(!isArray(rs)){rs = new Array(rs);}
				$.each(rs,function(o,r) {
					var _pid = r.pid;
					
				
					if(o == 0){
						if(_pid == pid){
							html.push('<option value="zc.html?gid=' + gid + '&pid='+_pid+'" selected>'+_pid+'</option>');
						} else {
							html.push('<option value="zc.html?gid=' + gid + '&pid='+_pid+'">'+_pid+'</option>');
						}
						if(pid==""){
							pid=_pid;
						}
						
					}else{
						html.push('<option value="zc.html?gid=' + gid + '&pid='+_pid+'">'+_pid+'</option>');
					}
				});
				html.push("<option value='/history/'>返回列表</option>");
				$("#listexpect").html(html.join(""));
				 loadzc(gid,pid);
		
		},
		error:function(){
			showTips('网络异常!');
        }
	});
	

	
	
}
function loadzc(gid,pid){
	$.ajax({
		url:"/cpdata/guoguan/" + gid + "/" + pid + "/" + pid + ".json?r="+Math.random(),
//		http://www.159cai.com/cpdata/guoguan/80/2014052/2014052.json
		type : "get",
		dataType : "json",
		success : function(d) {
			var gsale = d.rows.gsale;
			var time = d.rows.atime.substring(0,10);
			var pid = d.rows.pid;
			var code = d.rows.code;
			var ninfo = ''+d.rows.ninfo;
			var ginfo = ''+d.rows.ginfo;
			var gpool = d.rows.gpool;
			
			var html = [];
			html.push("期号：<span style='color:Blue'>" + pid + "</span><br />");
			if(code == ''){
				html.push("号码：<span style='color:Red'>等待开奖</span><br />");
			} else {
				var parts = code.split("|");
				if(parts.length == 1){
					html.push("号码：<span style='color:Red'>" + code.replaceAll(",", " ") + "</span><br />");
				} else {
					html.push("号码：<span style='color:Red'><span style='color:red'>" + parts[0].replaceAll(",", " ") + "</span><span style='color:blue'> + " + parts[1].replaceAll(",", " ") + "</span></span><br />");
				}
			}
			
			html.push("日期：" + time + "<br />");
			html.push("销量：￥" + ((''+gsale).length == 0 ? '--' : gsale) + "元<br />");
			
			if(gid == 80){
				html.push("任九销量：￥<span id='gs81'>--</span>元<br />");
			}
			
			html.push("奖池：￥" + ((''+gpool).length == 0 ? '--' : gpool) + "元<br />");
			
			if(ninfo.length > 0 && ginfo.length > 0){
				var nums = ninfo.split(",");
				var infos = ginfo.split(",");
				html.push("开奖情况：<br />");
				html.push("<table class='bonus' border=0 cellSpacing=1 cellPadding=1>");
				html.push("<tr><th>奖项</th><th>中奖注数</th><th>单注奖金(元)</th></tr>");
				var grades = $_sys.getGradeDef(gid).split(",");
				if(gid == 50){
					var pos = [0,9,1,10,2,11,3,12,4,13,5,14,6,15,7,8];
					for(var i = 0; i < grades.length && i < nums.length; i++){
						var pi = pos[i];
						if(pi != 8){
							html.push("<tr><td>" + grades[pi] + "</td><td>" + nums[pi] + "</td><td>" + infos[pi] + "</td></tr>");
						}
					}
				} else {
					for(var i = 0; i < grades.length && i < nums.length; i++){
						html.push("<tr><td>" + grades[i] + "</td><td>" + nums[i] + "</td><td>" + infos[i] + "</td></tr>");
					}
				}
				if(gid == 80){
					html.push("<tr id='gg81'><td>任九场</td><td>-</td><td>--</td></tr>");
				}
				
				
				html.push("</table>");
			}			
			$("#info").html(html.join(""));
			if(gid == 80){
				loadRXJ(pid);
			}
		},
		error:function(){
			showTips('网络异常!');
        }
	});
}
function loadRXJ(pid){
	$.ajax({
		url:"/cpdata/guoguan/81/" + pid + "/" + pid + ".json?r="+Math.random(),
		type : "get",
		dataType : "json",
		success : function(d) {
			var gsale = d.rows.gsale;
			var ninfo = ''+d.rows.ninfo;
			var ginfo = ''+d.rows.ginfo;
			
			$("#gs81").html((""+gsale).length == 0 ? "--" : gsale);
			
			if(ninfo.length > 0 && ginfo.length > 0){
				$("#gg81").find("td:eq(1)").html(ninfo);
				$("#gg81").find("td:eq(2)").html(ginfo);
			}
		},
		error:function(){
			showTips('网络异常!');
        }
	});
}
function goexpect(){
	$("#listexpect").change(function(){
		var url = $(this).val();
		window.location = url;
	});
}