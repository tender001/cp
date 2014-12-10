function showlistkj(){
	var gid = location.search.getParam('gid');
	if(gid == undefined){
		showTips('参数异常!');
		return;
	}
	var gname = $_sys.getlotname(gid);
	var iskp = $_sys.lottype.istype(gid,'gpc');
	document.title = gname + document.title;
	$("#gname").html(gname);
	$.ajax({
		url: "/cpdata/game/" + gid + "/c.json",
		dataType: "json",
		success:function(data){
			var code = data.period.code;
			if(code == 0){
				var rs = data.period.row;
				if(rs && !isArray(rs)){rs = new Array(rs);}
				if(rs.length > 0){
					var html = [];
					$.each(rs,function(o,r) {
						var et = r.et;
						var pid = r.pid;
						var code = r.opencode;
						var flag = r.flag;
						if(flag != "1"){
							var info = new Array();
							if(!iskp){
								info.push('<a href="detail.html?gid=' + gid + '&pid=' + pid + '">');
							}
							
							info.push('<table class="list" border="0" cellSpacing="0" cellPadding="0">');
							info.push('<tr>');
							info.push('<td>第<span style="color:Red">' + pid + '</span>期<span style="font-size:12px;">(' + et.substring(0, 10) + ')</span><br>');
							var parts = code.split("|");
							info.push('<span style="color:Red">' + parts[0].replaceAll(",", " ") + '</span>');
							if(parts.length > 1){
								info.push('&nbsp;<span style="color:blue">' + parts[1].replaceAll(",", " ") + '</span>');
							}
							info.push('</td>');

							if(!iskp){
								info.push('<td class="arrow"><img src="/images/arrow.gif" /></td>');
							}
							
							info.push('</tr>');
							info.push('</table>');

							if(!iskp){
								info.push('</a>');
							}
							
							html.push(info.join(""));
						}
					});
					$("#showlist").html(html.join(""));
				}
			} else {
				var desc = data.period.code;
				showTips('发生错误:' + desc);
			}
		},
		error:function(){
			showTips('网络异常!');
        }
	});
}