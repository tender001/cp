/**
 * 
 */

$(function() {
	var lotid = location.search.getParam('lotid');
	var expect = location.search.getParam('expect');
	var projid = location.search.getParam('projid');	
	switch (lotid) {
	case "80":
		break;
	case "81":
		break;
	case "82":
		break;
	case "83":
		break;
	default:
		$_sys.showerr('对不起，错误的玩法');
		break;
	}
	$("#gname").html($_sys.getlotname(lotid).split("-")[0]);
	showinfo(lotid, expect,projid);

});

var showinfo = function(lotid, expect,projid) {	
	var html='';
	$.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/proj/" + projid.toLowerCase() + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		success : function(obj) {
			var rs = obj.rows;
			$("#pid").html(rs.pid);
			var r = rs.row;
				if (lotid == "80" || lotid == "81" || lotid == "82" || lotid == "83") {
					var ml = [];
					r.each(function(rt,o) {
						var id = rt.id;
						var hn = rt.hn;
						var vn = rt.vn;
						var hs = rt.hs;
						var vs = rt.vs;
						var hhs = rt.hhs;
						var hvs = rt.hvs;
						var bet3 = parseFloat(rt.bet3).rmb(false);
						var bet1 = parseFloat(rt.bet1).rmb(false);
						var bet0 = parseFloat(rt.bet0).rmb(false);
						var result = rt.result;
						var g3 = rt.g3;
						var g2 = rt.g2;
						var g1 = rt.g1;
						var g0 = rt.g0;
						var c3 = rt.c3;
						var c2 = rt.c2;
						var c1 = rt.c1;
						var c0 = rt.c0;
						
						ml[ml.length] = [ id, hn, vn, hs, vs, hhs, hvs,bet3,bet1,bet0,result,g3,g2,g1,g0,c3,c2,c1,c0 ];
					});

					for(var i=0;i<ml.length;i++){
						html+='<tr>'+
						'<td>'+ml[i][0]+'</td>'+
						'<td>'+ml[i][1]+'('+ml[i][3]+':'+ml[i][4]+')'+ml[i][2]+'</td>'+
						'<td>'+ml[i][10]+'</td>'+
						'<td>';
						html+=ml[i][10]=='3'?'<s style="color:#990000">'+ml[i][7]+'</s>':'<s>'+ml[i][7]+'</s>';
						html+='&nbsp;&nbsp;';
						html+=ml[i][10]=='1'?'<s style="color:#990000">'+ml[i][8]+'</s>':'<s>'+ml[i][8]+'</s>';
						html+='&nbsp;&nbsp;';
						html+=ml[i][10]=='0'?'<s style="color:#990000">'+ml[i][9]+'</s>':'<s>'+ml[i][9]+'</s>';
						html+='</td>';
						
						html+='<td>'+(ml[i][11]==0?'--':ml[i][10]=='3'?'<s style="color:#990000">'+ml[i][11]+'</s>':'<s>'+ml[i][11]+'</s>')+'</td>'+
						'<td>'+(ml[i][13]==0?'--':ml[i][10]=='1'?'<s style="color:#990000">'+ml[i][13]+'</s>':'<s>'+ml[i][13]+'</s>')+'</td>'+
						'<td>'+(ml[i][14]==0?'--':ml[i][10]=='0'?'<s style="color:#990000">'+ml[i][14]+'</s>':'<s>'+ml[i][14]+'</s>')+'</td>'+
						'<td>'+(ml[i][15]==0?'--':ml[i][10]=='3'?'<s style="color:#990000">'+ml[i][15]+'</s>':'<s>'+ml[i][15]+'</s>')+'</td>'+
						'<td>'+(ml[i][17]==0?'--':ml[i][10]=='1'?'<s style="color:#990000">'+ml[i][17]+'</s>':'<s>'+ml[i][17]+'</s>')+'</td>'+
						'<td>'+(ml[i][18]==0?'--':ml[i][10]=='0'?'<s style="color:#990000">'+ml[i][18]+'</s>':'<s>'+ml[i][18]+'</s>')+'</td>'+
						'</td>';
					}
					$('#zcfb').html(html);
				}

		},
		error : function() {
			html+='<tr><td colspan="10">分布文件尚未生</td></tr>';
			$('#zcfb').html(html);
			return false;
		}
	});
};