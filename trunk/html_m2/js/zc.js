loadexp = function(pid){
	var gid = $_sys.get139Gid(typeID);
	var url = "/cpdata/game/" + gid + "/s.json?rnd="+Math.random();
	$.ajax({
		url:url,
		type:'GET',
		dataType:'json',
		success:function(d){
			var r = d.period.row;
			if(!isArray(r)){r = new Array(r);}
			var html = [];
			$.each(r,function(o,r){
				if((o == 0 && pid == '') || r.pid==pid){
//					<li v="2014184" class="cur">当前期2014184</li>
					html.push("<li v="+r.pid+" class=\"cur\"><a class='SelectedIssue' href='/zc/"+gpage(gid)+".html?pid="+r.pid+"'>"+r.pid+"</a></li>");
					$("#etime").html(r.et);
					issue = r.pid;
					loadmatch(gid,r.pid);
				} else {
//					html.push("<a class='Issue' href='/zc/"+gpage(gid)+".html?pid="+r.pid+"'>"+r.pid+"</a>");
					html.push("<li v="+r.pid+" ><a  href='/zc/"+gpage(gid)+".html?pid="+r.pid+"'>"+r.pid+"</a></li>");
				}
			});
			$("#elist").html(html.join(""));
		},
		error:function(){
			showTips('网络错误');
		}
	});
};
gpage = function(gid){
	if(gid == 81){
		return "r9";
	} else if(gid == 82){
		return "jqs";
	} else if(gid == 83){
		return "bqc";
	}
	return "index";
};
loadmatch = function(gid,pid){
	var url = "/cpdata/match/zc/"+gid+"/"+pid+".json?rnd="+Math.random();
	$.ajax({
		url:url,
		type:'GET',
		dataType:'json',
		success:function(d){
			rs = d.rows.row;
			var html = [];
			$.each(rs,function(o,r){
		
				if(gid == 80||gid == 81){
					html.push("<div class=\"tz\"><section class=\"tz-list up-jc\"><p class=\"list-l\">" +
							"<em>"+(o+1)+"</em><cite style="+r.cl+">"+r.mname+"</cite><i>01:45截止</i></p>" +
							"<ul class=\"list-r\"><li class=\"tz-true\"><em name="+(o+1)+" value=\"3\" n=\"3\" onclick=\"ChooseMatch(this)\">"+r.hn+"<i class='up-sp'>胜&nbsp;"+r.b3+"</i></em>" +
							"</li><li class=\"tz-true tz-true-middle\">" +
							"<em name="+(o+1)+" value=\"1\" n=\"1\" onclick=\"ChooseMatch(this)\">vs<i class='up-sp'>平&nbsp;"+r.b1+"</i></em>" +
							"</li><li class=\"tz-true\"><em name="+(o+1)+" value=\"0\" n=\"0\" onclick=\"ChooseMatch(this)\">"+r.gn+"<i class='up-sp'>胜&nbsp;"+r.b0+"</i></em>" +
							"</li></ul></section></div>");
					
					
					
//					html.push("<table border='0' cellpadding='0' cellspacing='0' class='match'><tr><td class='matchL' rowspan='3'>" +
//							"<div style='background-color:"+r.cl+";' class='Sclass Fillet'>"+r.mname+"</div>"+r.bt.substring(5,10)+"<BR>"+r.bt.substring(11,16)+"</td>" +
//									"<td>"+r.hn+" VS "+r.gn+"</td><td>&nbsp;</td></tr><tr><td><DIV class='mo'>"+r.b3+"</DIV><DIV class='mo'>"+r.b1+"</DIV><DIV class='mo'>"+r.b0+"</DIV></td><td class='md'>欧赔</td></tr><tr><td><div class='mBTN' name='"+(o+1)+"' value='3' onclick='ChooseMatch(this)'>胜</div><div class='mBTN' name='"+(o+1)+"' value='1' onclick='ChooseMatch(this)'>平</div><div class='mBTN' name='"+(o+1)+"' value='0' onclick='ChooseMatch(this)'>负</div></td><td>&nbsp;</td></tr></table>");
				}  else if(gid == 82){
					html.push("<table border='0' cellpadding='0' cellspacing='0' class='match'><tr><td class='matchL' rowspan='3'><div style='background-color:"+r.cl+";' class='Sclass Fillet'>"+r.mname+"</div>"+r.bt.substring(5,10)+"<BR>"+r.bt.substring(11,16)+"</td><td>"+r.hn.replace("[半]","")+" VS "+r.gn+"</td><td rowspan=3>&nbsp;</td></tr><tr><td>主<div class='mBTN' style='width:40px' name='"+(2*o+1)+"' value='0' onclick='ChooseMatch(this)'>0</div><div class='mBTN' style='width:40px' name='"+(2*o+1)+"' value='1' onclick='ChooseMatch(this)'>1</div><div class='mBTN' style='width:40px' name='"+(2*o+1)+"' value='2' onclick='ChooseMatch(this)'>2</div><div class='mBTN' style='width:40px' name='"+(2*o+1)+"' value='3' onclick='ChooseMatch(this)'>3+</div></td></tr><tr><td>客<div class='mBTN' style='width:40px' name='"+(2*(o+1))+"' value='0' onclick='ChooseMatch(this)'>0</div><div class='mBTN' style='width:40px' name='"+(2*(o+1))+"' value='1' onclick='ChooseMatch(this)'>1</div><div class='mBTN' style='width:40px' name='"+(2*(o+1))+"' value='2' onclick='ChooseMatch(this)'>2</div><div class='mBTN' style='width:40px' name='"+(2*(o+1))+"' value='3' onclick='ChooseMatch(this)'>3+</div></td></tr></table>");
				} else if(gid == 83){
					if(o%2 == 0){
						html.push("<table border='0' cellpadding='0' cellspacing='0' class='match'><tr><td class='matchL' rowspan='3'><div style='background-color:"+r.cl+";' class='Sclass Fillet'>"+r.mname+"</div>"+r.bt.substring(5,10)+"<BR>"+r.bt.substring(11,16)+"</td><td>"+r.hn+" VS "+r.gn+"</td><td rowspan=3>&nbsp;</td></tr><tr><td>半<div class='mBTN' name='"+(o+1)+"' value='3' onclick='ChooseMatch(this)'>胜</div><div class='mBTN' name='"+(o+1)+"' value='1' onclick='ChooseMatch(this)'>平</div><div class='mBTN' name='"+(o+1)+"' value='0' onclick='ChooseMatch(this)'>负</div></td></tr><tr><td>全<div class='mBTN' name='"+(o+2)+"' value='3' onclick='ChooseMatch(this)'>胜</div><div class='mBTN' name='"+(o+2)+"' value='1' onclick='ChooseMatch(this)'>平</div><div class='mBTN' name='"+(o+2)+"' value='0' onclick='ChooseMatch(this)'>负</div></td></tr></table>");
					}
				}
			});
			$("#matchList").html(html.join(""));
		},
		error:function(){
			showTips('网络错误');
		}
	});
};
$(document).ready(function() {
	var pid = location.search.getParam('pid');
    chklogin();
    loadexp(pid);
});