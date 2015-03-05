var page=0;
var sort = 0;
var isDesc=1;
var isBDing = false;
var loadAll = false;
var state = 0;
var lotid = "";
var _expect="";
var pid ="";
var key = "";
var flg =false;
var lotid = location.search.getParam('lotid');
if(lotid){
	$("a[hm]").removeClass("cur");
	$("a[hm="+lotid+"]").addClass("cur");
}
function openLnk(projid){
	
	var url = "/user/project.html?lotid="+projid.substr(2,2)+"&projid="+projid;
	location.href = url;
}
var cacheHTML = "";
function LoadList(){
	lotid = location.search.getParam('lotid');
	pid = location.search.getParam('pid');
	var hot=100;
	if(isBDing || loadAll)	{
		return;
	}
	var sorts = "";
	var isDescs="";
	if(sort==0){sorts = "jindu";}
	if(sort==1){sorts = "money";}
	if(sort==2){sorts = "aunum";}
	if(isDesc==1){isDescs="descending";}else{isDescs="";}
	$("#loading").show();
	isBDing = true;
	page++;
	pid = _expect != "" ? _expect : "20130214";
	var postData = "gid="+lotid+"&pid="+pid+"&fsort="+sorts+"&dsort="+isDescs+"&state="+state+"&find="+key+"&pn="+page+"&ps=20";
	var url =$_trade.url.plist
	if (lotid==hot){
		url =$_trade.url.hlist;
//		http://www.159cai.com/cpdata/phot/1.json?r=0.17740810977489152
//		postData="fsort="+sorts+"&dsort="+isDescs+"&state="+state+"&find="+key+"&pn="+page+"&ps=20"
	}
	$.ajax({
		url:url,
		data: postData,
		type: "POST",
		dataType: "json",
		success: function(d) {
			var ori = [];
			var code = d.Resp.code;
			var rs;
			if(lotid==100){
				rs= d.Resp;
			}else{
				rs= d.Resp.xml;
			}
			if(rs) rs = rs.row;
			if(rs && !isArray(rs)){rs = new Array(rs);}
			if (code == "0" && rs != undefined) {
				$.each(rs, function(o,r){
					var iorder = r.iorder;
					var lnum = r.lnum;
					var istate = lotid==hot?r.state:r.istate;
					var cprojid = lotid==hot?r.hid:r.cprojid;
					var nums = r.nums;
					var cnickid = lotid==hot?r.nickid:r.cnickid;
					var pnum = r.pnum;
					var gid = lotid==hot?r.hid.substr(2,2):r.cprojid.substr(2,2);
					var aunum = r.aunum;
					var wrate = lotid==hot?r.wrate:r.iwrate;
	    			var iso = iorder > 0 ? "true" : "false";
	    			if(lotid>=90 && lotid<=97 || lotid==70 || lotid==71){
	    				if(istate !=3){
		    				ori.push('{"LotteryID":"'+cprojid+'","Gid":"'+gid+'","Aunum":"'+aunum+'","Wrate":"'+wrate+'","Saled":"'+(nums-lnum)+'","IsTop":"'+iso+'","UserName":"'+cnickid+'","BaoDi":"'+pnum+'","Amount":"'+nums+'"}');
		    			}
	    			}else{
	    				ori.push('{"LotteryID":"'+cprojid+'","Gid":"'+gid+'","Aunum":"'+aunum+'","Wrate":"'+wrate+'","Saled":"'+(nums-lnum)+'","IsTop":"'+iso+'","UserName":"'+cnickid+'","BaoDi":"'+pnum+'","Amount":"'+nums+'"}');
	    			}
				});
			}else{
				$("#hmList").html("<div style='width:100%;line-height:35px;text-align:center;background-color:#D1EE69;'>无法找到相关合买信息</div>");
				isBDing = false;
				loadAll=true;
				$("#loading").hide();
				return;
			}
			var list = ori;
			loadAll = (list.length<20);
			var html = "";
			if( list != undefined && list.length > 0){
				for(var i=0;i<list.length;i++) {
					if(list[i]=="") continue;
					
					var jsonC = eval('(' + list[i] + ')');
					var baodi = parseInt(Math.floor(parseFloat(jsonC.BaoDi)*10000/parseFloat(jsonC.Amount))/100);
			        var zhanji=(jsonC.Aunum=="0"?"":"<em>Lv"+jsonC.Aunum+"</em>");
//					var wrate=jsonC.Wrate=="0"?
					var saled =(parseFloat(jsonC.Amount)-parseFloat(jsonC.Saled) )> 0?(parseFloat(jsonC.Amount)-parseFloat(jsonC.Saled))+"元":"已满员";
					html += "<div class=\"hm-list\" onclick='openLnk(\"" + jsonC.LotteryID + "\")'>"
					+"<div class=\"" + ((jsonC.IsTop == "true"&&i<6) ? "fl re-top" : "fl") + "\"><h2>"+$_sys.getlotname(jsonC.Gid,1)+"</h2><strong>"+(Math.floor(parseFloat(jsonC.Saled) * 100 / parseFloat(jsonC.Amount)))+"<b>%</b>"
					+"<cite>"+(jsonC.BaoDi=="0"?"未保底":"保"+baodi+"%")+"</cite></strong></div>"
					+"<dl><dt class=\"peo-name peo-s\"><span>"+jsonC.UserName+"</span><span class=\"lv\">"+zhanji+"</span></dt>"
					+"<dd class=\"peo-hm peo-s\"><span>"+jsonC.Amount+"元</span><span>"+saled+"</span></dd>"
					+"</dl><i></i></div>"
					
					
					
//					+ "<td><input class=\"knob\" data-width=\"50\" data-ticks=\"8\" data-bgColor=\"" + (jsonC.IsTop == "true" ? "#FBD5C5" : "#CDE6FD") + "\" data-readOnly=true data-fgColor=\"" + (jsonC.IsTop == "true" ? "#E04C0F" : "#0C83EE") + "\" value=\"" + (Math.floor(parseFloat(jsonC.Saled) * 100 / parseFloat(jsonC.Amount))) + "\" /></td>"
//					+"<td><span class='t'>用户</span>&nbsp;"+jsonC.UserName+"<br /><span class='t'>保底</span>&nbsp;"+(jsonC.BaoDi=="0"?"无":(Math.floor(parseFloat(jsonC.BaoDi)*10000/parseFloat(jsonC.Amount))/100)+"%")+"</td>"
//					+"<td><span class='t'>总额</span>&nbsp;￥"+jsonC.Amount+"<br />" + 
//					(parseFloat(jsonC.Amount)-parseFloat(jsonC.Saled) > 0 ?
//						"<span class='t'>剩余</span>&nbsp;<span class=red>￥"+(parseFloat(jsonC.Amount)-parseFloat(jsonC.Saled))+"</span>"
//					:
//						"<span class='t'>&nbsp;</span>&nbsp;<span class=red>已满员</span>");
//					"</td>"
//					+ "<td class='arrow'><img src='/images/arrow.gif' /></td>"
//					+"</tr>";
				}
			}else{
				html = "<div style='width:100%;line-height:35px;text-align:center;background-color:#D1EE69;'>无法找到相关合买信息</div>";
			}
			if($("#hmList").html()=="")cacheHTML="";
			cacheHTML += html;
			$("#hmList").html(cacheHTML);
			isBDing = false;
//			drawKnob();
		},
		complete: function(XHR, TS) { XHR = null; }
	});
}
function FilterHM(){
key = $("#key").val();
page=0;
isBDing = false;
loadAll = false;
$("#hmList").html("");
//LoadList();
$('#Filter_Panel').slideUp('fast');
}
function init(){
  try{
	lotid = location.search.getParam('lotid');
	if(Storage.Get("Together_sort") != null){
		sort = parseInt(Storage.Get("Together_sort").split('_')[0]);
		isDesc = parseInt(Storage.Get("Together_sort").split('_')[1]);
		$("#liveUL td").each(function(index) {
			$(this).removeClass("on");
			$(this).html($(this).html().replace("↑","").replace("↓",""));
			if (sort == index)
			{
				$(this).addClass("on");
				if(isDesc==1) $(this).html($(this).html().replace("↑","")+"↓");
				else $(this).html($(this).html().replace("↓","")+"↑");
			}
		});
		page=0;
		isBDing = false;
		loadAll = false;
		key="";
		$("#hmList").html("");
		LoadList();
	}
	else{
		LoadList();
	} 
}catch(e){
}
}

$(document).ready(function () {
	$(window).scroll(function () {
		if(isBDing || loadAll){
			return;
		} 
		if (($(window).height() + $(window).scrollTop()) >= $("body").height()-100) {
			$("#loading").show();
			LoadList();
		}
	});
	lotid = location.search.getParam('lotid');
	$("#gname").html($_sys.getlotname(lotid,1));
	
	if(lotid >= 90 && lotid <= 93 || lotid == 70){
		$("#gid").html("<select id=\"lotp\"><option value=\"90\" id=\"90_p\">胜平负</option><option value=\"91\" id=\"91_p\">比分</option><option value=\"92\" id=\"92_p\">半全场</option><option value=\"93\" id=\"93_p\">进球数</option><option value=\"70\" id=\"70_p\">混合过关</option><option value=\"/hemai/\">返回</option></select>");
	}else if(lotid >= 85 && lotid <= 89 ){
		$("#gid").html("<select id=\"lotp\"><option value=\"85\" id=\"85_p\">胜平负</option><option value=\"86\" id=\"86_p\">比分</option><option value=\"87\" id=\"87_p\">半全场</option><option value=\"89\" id=\"89_p\">进球数</option><option value=\"88\" id=\"88_p\">上下单双</option><option value=\"/hemai/\">返回</option></select>");
	}else if(lotid >= 94 && lotid <= 97 || lotid == 71){
		$("#gid").html("<select id=\"lotp\"><option value=\"94\" id=\"94_p\">胜负</option><option value=\"95\" id=\"95_p\">让分胜负</option><option value=\"96\" id=\"96_p\">胜负差</option><option value=\"97\" id=\"97_p\">大小分</option><option value=\"71\" id=\"71_p\">混合过关</option><option value=\"/hemai/\">返回</option></select>");
	}else{
		$("#gid").html("<a href=\"/hemai/\">返回</a>");
	}
	$("#"+lotid+"_p").attr("selected","selected");
	$("#liveUL td").click(function() {
        var type = parseInt($(this).attr("value"));
		if(type != 3)
		{
			if(sort==type) isDesc=(isDesc+1)%2;
			else{
				isDesc = 1;
				sort = type;
			}
			Storage.Set("Together_sort", ""+sort+"_"+isDesc);
			init();
		}
		else
		{
			if($('#Filter_Panel').is(':hidden')) {
				$('#Filter_Panel').css("top",($(this).position().top+$(this).height())+"px");
				$('#Filter_Panel').slideDown('fast');
			}
			else $('#Filter_Panel').slideUp('fast');
			return false;
		}
    });
	$("#select_expect").live("change",function(){
		var tid = parseInt($(this).val());
		var url = "/hemai/plist.html?lotid=" + lotid + "&pid=" + tid;
		window.location = url;
	});
	if(lotid <90 && lotid!=70 && lotid!=71 && lotid!=31&& lotid!=32){
		loadexpect();
	}else{
		init();
	}
	$("#lotp").live("change",function(){
		var lotid = $(this).val();
		if(lotid!="/hemai/"){location.href="/hemai/plist.html?lotid="+lotid;}else{
			location.href="/hemai/";
		}
		
	});
});
function loadexpect(){
	lotid = location.search.getParam('lotid');
	pid = location.search.getParam('pid');
	if(pid != ''){
		_expect = pid;
	}
	var gid=lotid;
	flg =false;
	if(lotid==30){
		gid=85;
	}
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
				html.push('<select id="select_expect">');
				var cpid = "";
				$.each(rs,function(o,r) {
					var pid = r.pid;
					var flag = r.flag;
					if(flag == "1"){
						if(_expect != '' && _expect == pid){
							cpid = pid;
						}
						if(lotid == 85 || lotid == 86 || lotid == 87 || lotid == 88 || lotid == 89){
							html.push('<option value="'+pid+'" id="' + pid + '">'+pid+'</option>');
							return;
						} else {
							if(_expect == pid){
								html.push('<option value="'+pid+'" selected id="' + pid + '">'+pid+'</option>');
							} else {
								html.push('<option value="'+pid+'" id="' + pid + '">'+pid+'</option>');
								if(_expect == ''){
									cpid = pid;
								}
							}
						}
					}
				});
				html.push('</select>');
				$("#expect").html(html.join(""));
				if(cpid != ''){
					_expect = cpid;
					$("#" + cpid).attr("selected","selected");
				}
			}
			init();
		}
	});
}
function drawKnob() {
    $(".knob").knob();
    var val, up = 0,
    down = 0,
    i = 0,
    $idir = $("div.idir"),
    $ival = $("div.ival"),
    incr = function() {
        i++;
        $idir.show().html("+").fadeOut();
        $ival.html(i);
    },
    decr = function() {
        i--;
        $idir.show().html("-").fadeOut();
        $ival.html(i);
    };
    $("input.infinite").knob({
        'min': 0,
        'max': 20,
        'stopper': false,
        'change': function(v) {
            if (val > v) {
                if (up) {
                    decr();
                    up = 0;
                } else {
                    up = 1;
                    down = 0;
                }
            } else {
                if (down) {
                    incr();
                    down = 0;
                } else {
                    down = 1;
                    up = 0;
                }
            }
            val = v;
        }
    });
}