function changePrizeGame(){
	window.location = "index.html?gid=" + $("#ddlType").val();
};
function changePrizeExpect(){
	window.location = "index.html?gid=" + $("#ddlType").val() + "&pid=" + $("#ddlIssue").val();
};
function loadprize(){
	var gid = location.search.getParam('gid');
	var pid = location.search.getParam('pid');
	var pn = location.search.getParam('pn');
	gid = gid == '' ? '72' : gid;
	pn = pn == '' ? 1 : parseInt(pn);
	if(!!$("#g" + gid))$("#g" + gid).attr("selected","selected");
	loadPZexpect(gid, pid, pn);
};
function loadPZexpect(gid, pid, pn){
	if($_sys.lottype.istype(gid,'jczq') || $_sys.lottype.istype(gid,'jclq')){
		var type = $_sys.lottype.istype(gid,'jczq') ? "jczq" : "jclq";
		$.ajax({
			url :"/cpdata/match/" + type + "/award/day.json",
			dataType:"json",
			success:function(data){
				var rs = data.rows.row;
				if(rs && !isArray(rs)){rs = new Array(rs);}
				if(rs.length > 0){
					var html = [];
					var _expect = '';
					$.each(rs,function(o,r) {
						var _pid = "20" + r.did;
						var day = _pid.substring(0,4) + "-" + _pid.substring(4,6) + "-" + _pid.substring(6, 8);
						if(pid == _pid){
							_expect = _pid;
							html.push("<option value='"+_pid+"' id='p"+_pid+"' selected>"+day+"</option>");
						} else {
							_expect = _expect == '' ? _pid : _expect;
							html.push("<option value='"+_pid+"' id='p"+_pid+"'>"+day+"</option>");
						}
					});
					$("#ddlIssue").html(html.join(""));
					if(!!$("#p" + _expect)){
						$("#p" + _expect).attr("selected","selected");
						loadTotalInfo(gid, _expect, pn);
					}
				}
			},
			error:function(){
				showTips('网络异常!');
			}
		});
	} else {
		$.ajax({
			url:"/cpdata/game/"+gid+"/c.json?r="+Math.random(),
			type : "get",
			dataType : "json",
			success : function(d) {
				var code = d.period.code;	
				if (code == "0") {
					var rs = d.period.row;
					if(!isArray(rs)){rs = new Array(rs);}
					var html = [];
					var _expect = '';
					$.each(rs,function(o,r) {
						var _pid = r.pid;
						var flag = r.flag;
						if($_sys.lottype.istype(gid,'bjdc')){
							if(pid == _pid){
								_expect = _pid;
								html.push("<option value='" + _pid + "' id='p" + _pid + "' selected>" + _pid + "</option>");
							} else {
								_expect = _expect == '' ? _pid : _expect;
								html.push("<option value='" + _pid + "' id='p" + _pid + "'>" + _pid + "</option>");
							}
						} else {
							if(flag != 1){
								if(pid == _pid){
									_expect = _pid;
									html.push("<option value='" + _pid + "' id='p" + _pid + "' selected>" + _pid + "</option>");
								} else {
									_expect = _expect == '' ? _pid : _expect;
									html.push("<option value='" + _pid + "' id='p" + _pid + "'>" + _pid + "</option>");
								}
							}
						}
					});
					$("#ddlIssue").html(html.join(""));
					if(!!$("#p" + _expect)){
						$("#p" + _expect).attr("selected","selected");
						loadTotalInfo(gid, _expect, pn);
					}
				}
			},
			error:function(){
				showTips('网络错误');
			}
		});
	}
};
function goPage(pn){
	window.location = "index.html?gid=" + $("#ddlType").val() + "&pid=" + $("#ddlIssue").val() + "&pn=" + pn;
}
function loadTotalInfo(gid, pid, pn){
	$.ajax({
		url:"/cpdata/guoguan/" + gid + "/" + pid + "/" + pid + ".json?r="+Math.random(),
		type : "get",
		dataType : "json",
		success : function(d) {
			var tp = 0,rc = 0,ps=25;
			if($_sys.lottype.istype(gid,'bjdc')){
				if(!!d.rows.bjfs){
					tp = d.rows.bjfs.tp;
					rc = d.rows.bjfs.total;
					ps = d.rows.bjfs.ps;
				}
			} else if($_sys.lottype.istype(gid,'jczq') || $_sys.lottype.istype(gid,'jclq')){
				if(!!d.rows.jcfs){
					tp = d.rows.jcfs.tp;
					rc = d.rows.jcfs.total;
					ps = d.rows.jcfs.ps;
				}
			} else {
				if(!!d.rows.as){
					tp = d.rows.as.tp;
					rc = d.rows.as.total;
					ps = d.rows.as.ps;
				}
			}
			loadPage(gid, pid, pn);
			$("#page").html(pages(pn,ps,tp,rc));
			page = goPage;
		},
		error:function(){
			var html = [];
			html.push('<table cellpadding="0" cellspacing="0" border=0 style="width:100%;border-bottom:1px solid #A7BCCD;">');
			html.push('<tr align="center"><td>当前无中奖数据</td></tr>');
			html.push('</table>');
			$("#prizelist").html(html.join(""));
        }
	});
};
function loadPage(gid, pid, pn){
	var _url = "/cpdata/guoguan/" + gid + "/" + pid + "/as_" + pn + ".json?r="+Math.random();
	if($_sys.lottype.istype(gid,'jczq') || $_sys.lottype.istype(gid,'jclq')){
		_url="/cpdata/guoguan/" + gid + "/" + pid + "/jcfs_" + pn + ".json?r="+Math.random();
	} else if($_sys.lottype.istype(gid,'bjdc')){
		_url="/cpdata/guoguan/" + gid + "/" + pid + "/bjfs_" + pn + ".json?r="+Math.random();
	}
	$.ajax({
		url:_url,
		type : "get",
		dataType : "json",
		success : function(d) {
			var rs = d.rows.row;
			var html = [];
			html.push('<table cellpadding="0" cellspacing="0" border=0 style="width:100%;border-bottom:1px solid #A7BCCD;" id="plist">');
			if(!isArray(rs)){rs = new Array(rs);}
			$.each(rs,function(o,r) {
				var hid = r.hid;
				var uid = r.uid;
				var gnames = r.gnames;
				if(hid.indexOf("ZH") != -1 || !uid.endWith("\\*\\*\\*\\*\\*")){
					html.push("<tr onclick=\"location.href='/user/project.html?lotid=" + gid + "&projid=" + hid + "'\" class='list'>");
					html.push("<td>" + $_sys.getlotname(gid) + "<br><font color='blue'>" + uid + "</font></td>");
					html.push("<td>过关方式：" + (gnames == undefined ? '&nbsp;' : gnames.replaceAll("\\*","串")) + "<br><span class='red'>奖金：￥" + r.bonus + "元</span>");
					html.push("<td class='arrow'><img src='/images/arrow.gif'></td>");
				} else {
					html.push("<tr class='list'>");
					html.push("<td>" + $_sys.getlotname(gid) + "<br>" + uid + "</td>");
					html.push("<td>过关方式：" + (gnames == undefined ? '&nbsp;' : gnames.replaceAll("\\*","串")) + "<br><span class='red'>奖金：￥" + r.bonus + "元</span>");
					html.push("<td>&nbsp;</td>");
				}
				html.push("</tr>");
			});
			html.push("</table>");
			$("#prizelist").html(html.join(""));
		},
		error:function(){
			html.push('<table cellpadding="0" cellspacing="0" border=0 style="width:100%;border-bottom:1px solid #A7BCCD;">');
			html.push('<tr align="center"><td>未加载到数据,请稍候再试试</td></tr>');
			html.push('</table>');
			$("#prizelist").html(html.join(""));
		}
	});
}