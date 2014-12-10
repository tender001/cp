var tID = 10;
var GameName = new Array("双色球", "超级大乐透", "七星彩", "排列3", "排列5", "福彩3D", "十一运夺金", "快乐十分", "快乐8", "江西11选5", "时时彩", "七乐彩");
var GameID = new Array(10, 20, 25, 26, 27, 44, 115, 116, 118, 119, 120, 7);
var Sindex = new Array(0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0);
var BallStyle = new Array("redball", "redball_s", "blueball", "blueball_s", "gpball", "gpball_s");
function getIndex(id){
	for(var i = 0; i < GameID.length;i++){
		if(GameID[i] == id){
			return Sindex[i];
		}
	}
	return 0;
}
function createGameSelect() {
    tID = parseInt($("#TypeID").attr("value"));
    var html = "<div style=\"padding:5px 5px 10px 10px;\"><span style=\"float:right;\">投注方式：<select name=\"selectKind\" id=\"selectKind\" onchange=\"recreatePanale(this.value);\" ><option selected=\"selected\" value=\"2\">手选</option><option value=\"1\">机选</option></select></span>" + GameName[getGameIndex(tID)] + "</div>";

    $("#divGameKind").html(html);
    if (tID > 114)
        $("#pbbtn").hide();

    if (tID == 20 || tID == 118)
        $("#span_add").show(); 
        
    createBallPanle(2);
    loadexp();
}
var stopState =1;
var countexp =0;
var explist = [];
chksale = function(gid,fn){
	$.ajax({
		url:'/cpdata/game/'+gid+'/sale.json',
		type:'GET',
		dateType:'json',
		success:function(d){
			if(parseInt(d.sale) > 0){
				stopState = 0;
			} else {
				stopState = 1;
			}
			fn.call(this);
		},
		error:function(){
			showTips('网络错误');
			stopState = 1;
			fn.call(this);
		}
	});
};
loadexp = function(){
	var gid = $_sys.get139Gid($("#TypeID").attr("value"));
	chksale(gid, function(){
		var url = "/cpdata/game/" + gid + "/s.json?rnd="+Math.random();
		$.ajax({
			url:url,
			type:'GET',
			dataType:'json',
			complete:function(XHR, TS){
				var curdate = Date.parse(XHR.getResponseHeader("Date"));
				var d = eval("("+XHR.responseText+")");
				explist = d.period.row;
				if(explist.length > 0){
					var r = explist[0];
					countexp = explist.length;
					var et = r.et.toDate().getTime();
					if(curdate > et){
						r = explist[1];
						countexp = explist.length - 1;
					}
					$("#span_issuenum").html(r.pid.substring(getIndex($("#TypeID").val())));
					$("#expect").val(r.pid);
					showCountDownTime_gpc("span_stoptime",curdate,r.et.toDate().getTime());
				}
			},
			error:function(){
				showTips('网络错误');
			}
		});
	});
};
function getGameIndex(kind) {
    for (var i = 0; i < GameID.length; i++) {
        if (GameID[i] == kind)
            return i;
    }
}
function recreatePanale(kind) {
    $("#divballarea").html("");
    $("#Kind").attr("value", kind);
    $("#PlayType").attr("value", "1");
    $("#RedBallValue").attr("value", "");
    $("#BlueBallValue").attr("value", "");
    if (tID == 20 || tID == 118)
        $("#span_add").show(); 
    createBallPanle(kind);
}

//createPanle
function createBallPanle(kind) {
    var kID = parseInt(kind);
    var start = tID == 20 ? 5 : tID == 10 ? 6 : 7;
    var end = 16;
    var maxLength = tID == 10 ? 33 : tID == 20 ? 35 : tID == 56 ? 36 : tID == 115 || tID == 119 ? 11 : tID == 116 ? 20 : tID == 118 ? 80 : tID == 7 ? 30 : 9;
    var minLength = tID == 25 || tID == 26 || tID == 27 || tID == 44 || tID == 120 ? 0 : 1;
    var html = new Array();
    //玩法类型
    if (tID > 25 && tID != 27) {
        if (!((tID == 26 || tID == 44) && kID == 1)) {
            html.push("<div id=\"divGamePanel\" class=\"number\" style=\"padding-left:10px;line-height:26px;font-size:14px;\">");
        }
        var varname = "";
        if (tID == 26 && kID == 2)
            varname = gameName_pl3[1];
        else if (tID == 44 && kID == 2)
            varname = gameName_3D[1];
        else if (tID == 56)
            varname = gameName_36s7_subName[1];
        else if (tID == 115 || tID == 119)
            varname = gameName_11s5_subName[1];
        else if (tID == 116)
            varname = gameName_happyten_subName[1];
        else if (tID == 118)
            varname = gameName_happy8[1];
        else if (tID == 120)
            varname = gameName_ssc[1];

        if (!((tID == 26 || tID == 44) && kID == 1)){
            html.push("玩法选择：<label style=\"cursor:pointer;color:Red;\" onclick=\"createGamePanle(" + tID + ");\">" + varname + " <img src=\"/images/yy.gif\" alt=\"下拉\" /></label></div>");
        }
    }
    if (kID == 2) {//手选
        html.push("<div id=\"divred\" class=\"number2\">");
        if (tID == 10 || tID == 20 || tID == 7) {
            html.push("<div style=\"padding-left:10px;background:#E3F0F9; line-height:26px; font-size: 14px;\" >");
            html.push("<span style=\"float:right;padding-right:10px;\">");
            html.push("<select id=\"redselect\">");
            for (var i = start; i <= end; i++)
                html.push("<option value=\"" + i.toString() + "\" " + (i == start ? "selected=\"selected\"" : "") + " >" + i.toString() + "个</option>");
            html.push("</select> ");

            html.push("<a class=\"button\" onclick=\"machineSelect(" + tID + ",'red');\" href=\"javascript:void(0)\">机选" + (tID == 10 ? "红球" : "前区") + "</a></span>请至少选择" + (tID == 20 ? "5" : tID == 10 ? "6" : "7") + "个号码<span id=\"redNotice\" style=\"color:Red;\"></span></div>");
        }

        html.push("<div id=\"redArea\">");
        if (tID == 10 || tID == 20 || tID == 7)
            html.push(createballpanle_ssq_dlt(minLength, maxLength, "red"));
        else if (tID == 25 || tID == 27)
            html.push(createballpanle_qxc_pl5(minLength, maxLength, tID == 25 ? 7 : 5));
        else if (tID == 26)
            html.push(createballpanle_pl3(1, 1));
        else if (tID == 44)
            html.push(createballpanle_3D(1, 1));
        else if (tID == 56)
            html.push(createballpanle_36s7(1, 1));
        else if (tID == 115 || tID == 119)
            html.push(createballpanle_11s5(1, 1));
        else if (tID == 116)
            html.push(createballpanle_happyten(1, 1));
        else if (tID == 118)
            html.push(createballpanle_happy8(1, 1));
        else if (tID == 120)
            html.push(createballpanle_ssc(1, 1));
        
        html.push("</div>");
        
        html.push("</div> ");
        
        if (tID == 10 || tID == 20) {
            html.push("<div id=\"divblue\" class=\"number2\">");
            html.push("<div style=\"padding-left:10px;background:#E3F0F9;line-height:26px;font-size:14px;\">");
            html.push("<span style=\"float:right; padding-right:10px;\">");
            start = tID == 10 ? 1 : 2;
            end = tID == 10 ? 16 : 8;
            maxLength = tID == 10 ? 16 : 12;
            html.push("<select id=\"blueselect\">");
            for (var i = start; i <= end; i++)
                html.push("<option value=\"" + i.toString() + "\" " + (i == start ? "selected=\"selected\"" : "") + " >" + i.toString() + "个</option>");
            html.push("</select> ");
            html.push("<a class=\"button2\" onclick=\"machineSelect(" + tID + ",'blue');\" href=\"javascript:void(0)\">机选" + (tID == 10 ? "蓝球" : "后区") + "</a></span>请至少选择" + (tID == 10 ? "1" : "2") + "个号码<span id=\"blueNotice\" style=\"color:Red;\"></span></div>");
            html.push("<div id=\"blueArea\">");
            html.push(createballpanle_ssq_dlt(minLength, maxLength,"blue"));
            html.push("</div>");
            html.push("</div>");
        }
    }
    else if (kID == 1) { //机选
    html.push("<div id=\"divMachine\" class=\"number\" style=\"padding-left:10px; padding-top:5px;\" >机选：<input type=\"text\" id=\"caseNotes\" class=\"textWH\" maxlength=\"2\" size=\"2\" value=\"5\" onkeyup=\"getParsetInt(this);\" /> <input type=\"button\" id=\"btnMachine\" onclick=\"machineRandom();\" value=\"开始机选\" /></div>");
        html.push("<div id=\"divMachineCase\" class=\"number3\" style=\"padding-left:10px; padding-top:5px; font-weight:normal;\"></div>");
        
    }
    else if (kID == 3) { //胆拖
    }
    else if (kID == 4) { //过滤
    }
    

   $("#divballarea").html(html.join(""));

}

//生成玩法面板
function createGamePanle(tID) {
    var html = new Array();
    var index = parseInt($("#PlayType").attr("value"));
    //玩法类型
    if (tID > 25 && tID != 27) {
        if (tID == 26) {
        	var varr = [0,1,3,5,8];
            for (var i = 1; i < varr.length; i++) {
                if (i % 2 != 0 && i != 1) html.push("<br />");
            	var c = varr[i];
                html.push(createInputChecked("gamePanle", "createballpanle_pl3(" + c + ",2);", c, gameName_pl3[c], c == index ? true : false));
            }
        }
        else if (tID == 44) {
        	var varr = [0,1,2,3,4,5,6];
            for (var i = 1; i < varr.length; i++) {
                if (i % 2 != 0 && i != 1) html.push("<br />");
                var c = varr[i];
                html.push(createInputChecked("gamePanle", "createballpanle_3D(" + c + ",2);", c, gameName_3D[c], c == index ? true : false));
            }
        }
        else if (tID == 56) {//
            for (var c = 1; c <= 7; c++) {
                if (c == 3 || c == 5 || c == 7) html.push("<br />");
                html.push(createInputChecked("gamePanle", "createballpanle_36s7(" + gameName_36s7_subID[c] + ",2);", gameName_36s7_subID[c], gameName_36s7_subName[c], gameName_36s7_subID[c] == index ? true : false));
            }

        } else if (tID == 115 || tID == 119) {//
            for (var c = 1; c <= 12; c++) {
                if (c % 2 == 1 && c != 1) html.push("<br />");
                html.push(createInputChecked("gamePanle", "createballpanle_11s5(" + gameName_11s5_subID[c] + ",2);", gameName_11s5_subID[c], gameName_11s5_subName[c], gameName_11s5_subID[c] == index ? true : false));
            }
        } else if (tID == 116) {//
            for (var c = 1; c <= 10; c++) {
                if (c % 2 == 1 && c != 1) html.push("<br />");
                html.push(createInputChecked("gamePanle", "createballpanle_happyten(" + gameName_happyten_subID[c] + ",2);", gameName_happyten_subID[c], gameName_happyten_subName[c], gameName_happyten_subID[c] == index ? true : false));
            }
        } else if (tID == 118) {
            for (var c = 1; c <= 9; c++) {
                if (c % 2 == 1 && c != 1) html.push("<br />");
                html.push(createInputChecked("gamePanle", "createballpanle_happy8(" + c + ",2);", c, gameName_happy8[c], c == index ? true : false));
            }
        } else if (tID == 120) {
        
            for (var c = 1; c <= 8; c++) {
                if (c % 2 == 1 && c != 1) html.push("<br />");
                html.push(createInputChecked("gamePanle", "createballpanle_ssc(" + c + ",2);", c, gameName_ssc[c], c == index ? true : false));
            }
        }
    }
    showGP(html.join(""));
    $("#gamePanle label").click(function(){
        $("#divDisable").hide();
    	$("#divshowprebuy").hide();
        $("#divshowprebuy").html("");
        reCreateGame();
    });
}

function reCreateGame() {
    var varname = "";
    var index = parseInt($("#PlayType").attr("value"));
    $("#oldt").attr("value", index);
    if (tID == 26)
        varname = gameName_pl3[index];
    else if (tID == 44)
        varname = gameName_3D[index];
    else if (tID == 56)
        varname = gameName_36s7[index - 1];
    else if (tID == 115 || tID == 119)
        varname = gameName_11s5[index];
    else if (tID == 116)
        varname = gameName_happyten[index];
    else if (tID == 118)
        varname = gameName_happy8[index];
    else if (tID == 120)
        varname = gameName_ssc[index];
    
    var html = "玩法选择：<label style=\"cursor:pointer;color:Red;\" onclick=\"createGamePanle(" + tID + ");\" >" + varname + " <img src=\"/images/yy.gif\" alt=\"下拉\" /></label>";
    $("#divGamePanel").html(html);
}

function reCancelGame() {
    var index = parseInt($("#oldt").attr("value"));
    $("#PlayType").attr("value", index);
    $("#lb_" + index).click();
    reCreateGame();
}

//selectBall
function selectBall(ball, color) {
    var classnmae = color == "red" ? (tID > 114 ? BallStyle[4] : BallStyle[0]) : BallStyle[2];
    var classnmae_s = color == "red" ? (tID > 114 ? BallStyle[5] : BallStyle[1]) : BallStyle[3];

    if (ball.className == classnmae)
        ball.className = classnmae_s;
    else if (ball.className == classnmae_s)
        ball.className = classnmae;

    var valueList = "";
    if (color == "red")
        $("#RedBallValue").attr("value", "");
    else if (color == "blue")
        $("#BlueBallValue").attr("value", "");
    if ($("#redArea").children("ul").length > 1) {//直选按位
        var count = 0;
        var ballList = $("#redArea").children("ul");
        var playtype = parseInt($("#PlayType").attr("value"));
        for (var i = 0; i < ballList.length; i++) {
            var ball_sub = $($(ballList[i])[0]).children().children("span");
            var value = "";
            for (var j = 0; j < ball_sub.length; j++) {
                if ($(ball_sub[j]).attr("class").toString() == classnmae_s) {
                    if (tID == 115 || tID == 116 || tID == 119)
                        value += $(ball_sub[j]).text() + ",";
                    else
                        value += $(ball_sub[j]).text();
                }
            }

            if (tID == 44 && (playtype == 8 || playtype == 9)) {//福彩3D--1D,2D
                if (value != "") {
                    valueList += value + ",";
                    count += 1;
                }
                else
                    valueList += "-,";
            }
            else if (tID == 115 || tID == 116 || tID == 119) {
                if (value != "") {
                    value = value.substring(0, value.length - 1);
                    valueList += value + "|";
                    count += 1;
                }
            }
            else {
                if (value != "") {
                    valueList += value + ",";
                    count += 1;
                }
            }
        }
        if (tID == 44 && (playtype == 8 || playtype == 9)) {//福彩3D--1D,2D
            if ((count < 1 && playtype == 8) || (count < 2 && playtype == 9))
                valueList = "";
        } else {
            if (count != $("#redArea").children("ul").length)
                valueList = "";
        }
    }
    else {
        var playtype = 0;
        if (tID == 116 || tID == 120)
            playtype = parseInt($("#PlayType").attr("value"));//选一红投
        playtype = tID == 120 && playtype == 6 ? 6 : 0;
        var ballList = $($(ball).parent().parent()[0]).children().children("span");
        if (playtype == 2) {
            if (ball.className == classnmae) {
                for (var i = 0; i < ballList.length; i++)
                    $(ballList[i]).attr("class", classnmae);
            }
            else if (ball.className == classnmae_s) {
                for (var i = 0; i < ballList.length; i++) {
                    $(ballList[i]).attr("class", classnmae_s);
                    valueList += $(ballList[i]).text() + ",";
                }
            }
        } else {
            for (var i = 0; i < ballList.length; i++) {
                if ($(ballList[i]).attr("class").toString() == classnmae_s) {
                    if (tID == 120 && playtype != 6 )
                        valueList += $(ballList[i]).text();
                    else
                        valueList += $(ballList[i]).text() + ",";
                    
                }
            }

            if (!valueList.endWith(",") && valueList != "" && tID == 120)
                valueList += ",";
        }
    }

    if (valueList != "") {
        valueList = valueList.substring(0, valueList.length - 1);
        if (color == "red") {
            $("#RedBallValue").attr("value", valueList);
            //if (tID == 10 || tID == 20)
               // $("#redNotice").html("(已选择" + valueList.split(/\,/gi).length + "号码)");
        } else {
            $("#BlueBallValue").attr("value", valueList);
            //$("#blueNotice").html("(已选择" + valueList.split(/\,/gi).length + "号码)");
        }
    }
    countMoney();
}

//random
function machineSelect(type, color) {
    if (color == "red") {
        var selectlength = parseInt($("#redselect").val());
        var maxlength = type == 10 ? 33 : type == 20 ? 35 : 30;
        var redNum = Random(maxlength);
        for (var i = 1; i <= maxlength; i++)
            $("#redball_" + i.toString()).attr("class", "redball");

        $("#RedBallValue").attr("value", "");
        var redvalue = "";
        for (var i = 0; i < selectlength; i++) {
            $("#redball_" + redNum[i]).attr("class", "redball_s");
            redvalue += ((redNum[i] < 10 ? "0" + redNum[i].toString() : redNum[i]) + ",");
        }

        if (redvalue != "") {
            redvalue = reSort(redvalue.substring(0, redvalue.length - 1));
            $("#RedBallValue").attr("value", redvalue);
            //$("#redNotice").html("(已选择" + redvalue.split(/\,/gi).length + "号码)");
        }
    }
    else {
        var selectlength = parseInt($("#blueselect").val());
        var maxlength = type == 10 ? 16 : 12;
        var blueNum = Random(maxlength);
        for (var i = 1; i <= maxlength; i++)
            $("#blueball_" + i.toString()).attr("class", "blueball");

        $("#BlueBallValue").attr("value", "");
        var bluevalue = "";
        for (var i = 0; i < selectlength; i++) {
            $("#blueball_" + blueNum[i]).attr("class", "blueball_s");
            bluevalue += ((blueNum[i] < 10 ? "0" + blueNum[i].toString() : blueNum[i]) + ",");
        }
        if (bluevalue != "") {
            bluevalue = reSort(bluevalue.substring(0, bluevalue.length - 1));
            $("#BlueBallValue").attr("value", bluevalue);
            //$("#blueNotice").html("(已选择" + bluevalue.split(/\,/gi).length + "号码)");
        }
    }
    countMoney();
}

//countNotes
function countNotes() {
    var varNotes = 0;
    if ($("#caseNotes").length > 0) {
        varNotes = parseInt($("#caseNotes").attr("value"));
    }
    else {
        if (tID == 10 || tID == 20) {//双色球,大乐透
            if ($("#RebBallValue").attr("value") != "" && $("#BlueBallValue").attr("value") != "") {
                var rebcount = $("#RedBallValue").attr("value").toString().split(/\,/gi).length;
                var bluecount = $("#BlueBallValue").attr("value").toString().split(/\,/gi).length;
                varNotes = count(rebcount, tID == 10 ? 6 : 5) * count(bluecount, tID == 10 ? 1 : 2);
            }
        }
        else {
            if ($("#RebBallValue").attr("value") != "" && $("#RedBallValue").attr("value").toString().length != 0) {
                var playtype = parseInt($("#PlayType").attr("value"));
                var numberlist = tID == 115 || tID == 116 || tID == 119 ? $("#RedBallValue").attr("value").toString().split(/\|/gi) : $("#RedBallValue").attr("value").toString().split(/\,/gi);
                var isPass = true;
                if (tID == 44 && (playtype == 8 || playtype == 9))//直选按位玩法,除福彩3D--1D,2D玩法外
                    isPass = false;
                if ($("#redArea").children("ul").length > 1 && isPass) {
                    if (((tID == 115 || tID == 119) && (playtype == 4 || playtype == 7) || ((tID == 116) && (playtype == 5 || playtype == 8)))) {
                        if (playtype == 4 || playtype == 5) {//前二直选 //选二连直
                            for (var i = 0; i < numberlist[0].split(/\,/gi).length; i++) {
                                for (var j = 0; j < numberlist[1].split(/\,/gi).length; j++) {
                                    if (numberlist[0].split(/\,/gi)[i].toString() != numberlist[1].split(/\,/gi)[j].toString())
                                        varNotes += 1;
                                }
                            }

                        }
                        else if (playtype == 7 || playtype == 8) {//前三直选 //选三前直
                            for (var i = 0; i < numberlist[0].split(/\,/gi).length; i++) {
                                for (var j = 0; j < numberlist[1].split(/\,/gi).length; j++) {
                                    for (var k = 0; k < numberlist[2].split(/\,/gi).length; k++) {
                                        if (numberlist[0].split(/\,/gi)[i].toString() != numberlist[1].split(/\,/gi)[j].toString() && numberlist[0].split(/\,/gi)[i].toString() != numberlist[2].split(/\,/gi)[k].toString() && numberlist[1].split(/\,/gi)[j].toString() != numberlist[2].split(/\,/gi)[k].toString())
                                            varNotes += 1;
                                    }
                                }
                            }
                        }
                    }
                    else {
                        varNotes = 1;
                        for (var i = 0; i < numberlist.length; i++) {
                            varNotes *= numberlist[i].length;
                        }
                    }
                }
                else {
                    if (tID == 26) {//排列3
                        varNotes = CurrentCountBallNotes_pl3(numberlist, playtype);
                    }
                    else if (tID == 44) { //福彩3D
                        varNotes = CurrentCountBallNotes_3D(numberlist, playtype);
                    }
                    else if (tID == 56) {//南粤36选7
                        var rebcount = $("#RedBallValue").attr("value").toString().split(/\,/gi).length;
                        varNotes = count(rebcount, gameName_36s7_length[playtype]);
                    }
                    else if (tID == 115 || tID == 116 || tID == 118 || tID == 119) {//广东,江西11选5,快乐十分,快乐8
                        var rebcount = $("#RedBallValue").attr("value").toString().split(/\,/gi).length;
                        varNotes = count(rebcount, tID == 116 ? gameName_happyten_length[playtype] : tID == 118 ? playtype : gameName_11s5_length[playtype]);
                    }
                    else if (tID == 120){//时时彩
                    	if(playtype == 5){
                            varNotes = count(numberlist[0].length,2);
                    	} else if(playtype == 6){
                    		var tmpCode = $("#RedBallValue").attr("value").toString().split(/\,/gi);
                    		for(var ni = 0; ni<tmpCode.length;ni++){
                    			if(tmpCode[ni] != '') varNotes += ssc_nums[parseInt(tmpCode[ni])];
                    		}
                    	} else {
                            varNotes = numberlist[0].length;
                    	}
                    } else if (tID == 7){//七乐彩
                        var rebcount = $("#RedBallValue").attr("value").toString().split(/\,/gi).length;
                        varNotes = count(rebcount, 7);
                    }
                }
            }
        }
    }
    return varNotes;
}

//times
function countTimes(obj) {
    var maxTimes = tID > 114 ? 999 : 99;
    var vartimes = obj.value;
    if (isNaN(vartimes) || vartimes.indexOf(".") != -1 || vartimes == "0" || parseInt(vartimes) > maxTimes) {
        obj.value = 1;
    }
    countMoney();
}

//money
function countMoney() {
    var varcount = countNotes();
    if (varcount > 0) {
        var isAdd = !!$("#addcount").attr("checked");
        var vartimes = 0;
        if ($("#times").attr("value") != "")
            vartimes = parseInt($("#times").attr("value"));
        var varmoney = varcount * vartimes * (isAdd && tID == 118 ? 4 : isAdd ? 3 : 2);
        $("#notes").html(varcount);
        $("#times2").html(vartimes);
        $("#money").html(varmoney);
    }
    else {
        $("#notes").html(0);
        $("#times2").html(0);
        $("#money").html(0);
    }
}


//count
function count(numlength, more) {
    var m = 1, n = 1;
    while (more >= 1) {
        m *= numlength;
        n *= more;
        numlength--;
        more--;
    }
    return m / n;
}

function getDivShow(value) {
    if (value == "6") {
        $("#divBuyDetail").show();
    }
    else {
        $("#divBuyDetail").hide();
    }
}

function updateViewPrice(obj) {
    var varvalue = obj.value;
    if (isNaN(varvalue) || varvalue.indexOf(".") != -1 || varvalue == "0" || parseInt(varvalue) > 6)
        obj.value = 1;
}


function getParsetInt(obj) {
    var varvalue = obj.value;
    if (isNaN(varvalue) || varvalue.indexOf(".") != -1 || varvalue == "0")
        obj.value = "";
}

function isPassWordBuy(obj) {
    if (obj.value.replace(/\w/g, "").length != 0) {
        obj.value = "";
        alert("密码只为为数字、字母以及下划线组合");
        return;
    }
}

function updatePublicBuyInfo() {
    var masterBuy = new Number($("#masterBuy").attr("value"));
    var varAllmoney = new Number($("#money").text());

    if (masterBuy > 0 && masterBuy <= varAllmoney) {
        $("#masterBuy").attr("value", (masterBuy).toFixed(0));
        $("#masterBuy_percent").html(Math.floor((masterBuy / varAllmoney) * 10000) / 100 + "%");
    } else {
        $("#masterBuy").attr("value", "");
        $("#masterBuy_percent").html("0%");
    }

    if (!!$("#baodiAll").attr("checked")) {
        $("#baodi").attr("value", varAllmoney - masterBuy);
    }
    var baodi = new Number($("#baodi").attr("value"));
    if (baodi > 0 && baodi + masterBuy <= varAllmoney) {
        $("#baodi").attr("value", (baodi).toFixed(0));
        $("#baodi_percent").html(Math.floor((baodi / varAllmoney) * 10000) / 100 + "%");
    } else {
        $("#baodi").attr("value", "");
        $("#baodi_percent").html("0%");
    }
}

function updateInputCheckedCommon(obj) {
    var rform = $($(obj).parent()[0]).children();
    for (var i = 0; i < rform.length; i++) {
        if ($(rform[i]).children("input").length > 0) {
            $(rform[i]).children("input")[0].checked = false;
        }
        $(rform[i]).css("color", "");
    }
    $(obj).children("input")[0].checked = true;
    $(obj).css("color", "red");
}

function upateObjectInfo(obj) {
    updateInputCheckedCommon(obj);
    if ($(obj).children("input")[0].value == "1")
        $("#lbpasswored").hide();
    else
        $("#lbpasswored").show();
}

function upateFollowInfo(obj) {
    updateInputCheckedCommon(obj);
    if ($(obj).children("input")[0].value == "1") {
        $("#lbtxtProfit").hide();
        $("#txtProfit").attr("value", "");
    }
    else {
        $("#lbtxtProfit").show();
        $("#txtProfit").attr("value", "");
    }
}

//机选号码
function machineRandom() {
    $("#btnMachine").attr("value", "重新机选");
    $("#divMachineCase").html("");
    $("#RedBallValue").attr("value", "");
    var count = parseInt($("#caseNotes").attr("value"));
    for (var c = 0; c < count; c++) {
        var numberlist = "";
        if (tID == 10 || tID == 20) {
            var rednumber = Random(tID == 10 ? 33 : 35);
            var bluenumber = Random(tID == 10 ? 16 : 12);
            var redlength = tID == 10 ? 6 : 5;
            var bluelength = tID == 10 ? 1 : 2;
            var red = new Array();
            var blue = new Array();
            for (var i = 0; i < redlength; i++)
                red[i] = rednumber[i];
            for (var i = 0; i < bluelength; i++)
                blue[i] = bluenumber[i];

            red.sort(sortIntArrayAsc);
            blue.sort(sortIntArrayAsc);

            for (var i = 0; i < red.length; i++) {
                if (i == 0) numberlist = (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                else numberlist += "," + (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
            }

            for (var i = 0; i < blue.length; i++) {
                if (i == 0) numberlist += "|" + (blue[i].toString().length == 1 ? "0" + blue[i].toString() : blue[i].toString());
                else numberlist += "," + (blue[i].toString().length == 1 ? "0" + blue[i].toString() : blue[i].toString());
            }

        } else if(tID == 7){
            var rednumber = Random(30);
            var redlength = 7;
            var red = new Array();
            for (var i = 0; i < redlength; i++)
                red[i] = rednumber[i];

            red.sort(sortIntArrayAsc);

            for (var i = 0; i < red.length; i++) {
                if (i == 0) numberlist = (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                else numberlist += "," + (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
            }
        }
        else if (tID == 25 || tID == 26 || tID == 27 || tID == 44 || tID == 120) {
            var varlength = tID == 25 ? 7 : tID == 27 ? 5 : 3;
            var playtype = 0, maxlength = 9;
            if (tID == 120) {
                playtype = parseInt($("#PlayType").attr("value"));
                varlength = gameName_ssc_length[playtype];
                maxlength = 4;
                if(playtype == 6){
                	maxlength = 18;
                }
            }

            for (var i = 0; i < varlength; i++) {
                if (i == varlength - 1)
                    numberlist += (playtype == 8 ? gameName_ssc_subname[Random(maxlength)[0] - 1] : Random(maxlength)[0]);
                else
                    numberlist += (playtype == 8 ? gameName_ssc_subname[Random(maxlength)[0] - 1] : Random(maxlength)[0]) + ",";
            }

        }
        else if (tID == 56) {
            var playtype = parseInt($("#PlayType").attr("value"));
            var varlength = gameName_36s7_length[playtype];
            var rednumber = Random(playtype == 3 ? 12 : playtype == 4 || playtype == 5 ? 4 : 36);
            var red = new Array();
            for (var i = 0; i < varlength; i++)
                red[i] = rednumber[i];
            red.sort(sortIntArrayAsc);
            for (var i = 0; i < red.length; i++) {
                if (i == 0) {
                    numberlist = (playtype == 3 ? gameName_36s7_animal[parseInt(red[i].toString(), 10) - 1] : playtype == 4 ? gameName_36s7_season[parseInt(red[i].toString(), 10) - 1] : playtype == 5 ? gameName_36s7_position[parseInt(red[i].toString(), 10) - 1] : (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString()));
                }
                else {
                    numberlist += "," + (playtype == 3 ? gameName_36s7_animal[parseInt(red[i].toString(), 10) - 1] : playtype == 4 ? gameName_36s7_season[parseInt(red[i].toString(), 10) - 1] : playtype == 5 ? gameName_36s7_position[parseInt(red[i].toString(), 10) - 1] : (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString()));
                }
            }
        }
        else if (tID == 115 || tID == 116 || tID == 118 || tID == 119) {
            var playtype = parseInt($("#PlayType").attr("value"));
            var varlength = tID == 116 ? gameName_happyten_length[playtype] : tID == 118 ? gameName_happy8_length[playtype] : gameName_11s5_length[playtype];
            var rednumber = Random(tID == 116 && playtype == 1 ? 18 : tID == 116 ? 20 : tID == 118 ? 80 : 11);
            if (tID == 116 && playtype == 2)
                rednumber = new Array(19, 20);
            var red = new Array();
            for (var i = 0; i < varlength; i++)
                red[i] = rednumber[i];
            if ((tID == 116 && (playtype == 5 || playtype == 8)) || ((tID == 115 || tID == 119) && (playtype == 4 || playtype == 7))) {
                for (var i = 0; i < red.length; i++) {
                    if (i == 0) numberlist = (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                    else numberlist += "|" + (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                }
            }
            else {
                
                red.sort(sortIntArrayAsc);
                for (var i = 0; i < red.length; i++) {
                    if (i == 0) numberlist = (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                    else numberlist += "," + (red[i].toString().length == 1 ? "0" + red[i].toString() : red[i].toString());
                }
            }
        }

        if ($("#divMachineCase").html() == "") {
            $("#divMachineCase").html(numberlist);
            $("#RedBallValue").attr("value", numberlist);
        }
        else {
            $("#divMachineCase").html($("#divMachineCase").html() + "<br />" + numberlist);
            $("#RedBallValue").attr("value", $("#RedBallValue").attr("value") + ";" + numberlist);
        }
    }

    countMoney();
}

//生成随机数
function Random(count) {
    var original = new Array; //原始数组 
    //给原始数组original赋值 
    for (var i = 0; i < count; i++) {
        original[i] = i + 1;
    }
    original.sort(function() { return 0.5 - Math.random(); });
    var arrayList = new Array();
    for (var i = 0; i < count; i++) {
        arrayList[i] = original[i];
    }
    return arrayList;
}

//数组排序 升序
function sortIntArrayAsc(a, b) {
    if (isNaN(a) || isNaN(b)) return a.localeCompare(b);
    else return parseInt(a) - parseInt(b);
}

//数组排序 降序
function sortIntArrayDesc(a, b) {
    if (isNaN(a) || isNaN(b)) return b.localeCompare(a);
    else return parseInt(b) - parseInt(a);
}

//重新排序
function reSort(s_numberList) {
    var newNum = "";
    var arr = new Array();
    for (var j = 0; j < s_numberList.split(',').length; j++)
        arr[j] = parseInt(s_numberList.split(',')[j], 10);

    arr.sort(sortIntArrayAsc);
    for (var k = 0; k < arr.length; k++) {
        if (parseInt(arr[k]) < 10)
            newNum += "0" + arr[k] + ",";
        else
            newNum += arr[k] + ",";
    }

    newNum = newNum.substring(0, newNum.length - 1);
    var item = newNum.split(',');
    //判断前区是否重复
    for (var j = 0; j < item.length - 1; j++) {
        for (var c = j + 1; c < item.length; c++) {
            if (item.length == c)
                break;
            if (item[j] == item[c]) {
                alert("单注单个号码不能重复两次");
                return "";
            }
        }
    }

    return newNum;
}

//购买预览
function preBuy(bk) {
    var redValue = $("#RedBallValue").attr("value");
    if (redValue == "" || redValue.length == 0) {
        showMS("请先选择号码,再投注!");
        return;
    }
    var vardata = redValue;
    if ((tID == 10 || tID == 20) && $("#Kind").attr("value") == "2") {
        var blueValue = $("#BlueBallValue").attr("value");
        if (blueValue == "" || blueValue.length == 0) {
            showMS("请先选择号码,再投注!");
            return;
        }
        vardata += "|" + blueValue;
    }
    var isadd = !!$("#addcount").attr("checked");
    
    var playtype = parseInt($("#PlayType").attr("value"));
    var notes = parseInt($("#notes").text());
    var money = parseInt($("#money").text());
    if (notes == 0 || money == 0) {
        showMS("投注方案不完整,请核实投注内容!");
        return;
    }
    var buykind = parseInt(bk);
    var times = parseInt($("#times").attr("value"));

    chklogin(function(d){
		if (d.Resp.code == 0) {
        	$("#divshowprebuy").html("");
        	var html = "<div class=\"ball_h2\">购买预览信息</div>";
        	html += "<div class=\"mini\">彩种：" + GameName[getGameIndex(tID)] + " [" + (buykind == 0 ? "代购" : buykind == 1 ? "合买" : "追号") + "]</div>";
        	html += "<div class=\"mini\">玩法：" + (tID < 26 || tID == 27 ? "普通投注" : tID == 26 ? gameName_pl3[playtype] : tID == 44 ? gameName_3D[playtype] : tID == 56 ? gameName_36s7[playtype - 1] : tID == 115 || tID == 119 ? gameName_11s5[playtype] : tID == 116 ? gameName_happyten[playtype] : tID == 118 ? gameName_happy8[playtype] : gameName_ssc[playtype]) + (isadd && tID == 118 ? "[快乐飞盘]" : isadd ? "[追加]" : "") + "</div>";
        	if (vardata.split(';').length > 1) {
            	html += "<div class=\"mini\">方案：";
            	for (var i = 0; i < vardata.split(';').length; i++) {
                	if (i == 5) {
                    	html += "…………";
                    	break;
                	}
                	html += vardata.split(';')[i];
                	if (i < vardata.split(';').length - 1){
                    	html += "<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                	}
            	}
            	html += "</div>";
        	} else {
            	html += "<div class=\"mini\">方案：" + vardata + "</div>";
        	}
        	html += "<div class=\"mini\">金额：" + notes + "注×" + times + "倍=￥" + (notes * times * (isadd && tID == 118 ? 4 : isadd ? 3 : 2)) + "元</div>";
        	html += createTwoPanle(buykind);
        	
        	html += "<div id=\"noticeInfo\" class=\"mini\" style=\"display:none;color:Red;\" ></div>";

        	html += "<div class=\"mini\"><input type=\"button\" value=\"确认购买\" onclick=\"passBuy('" + vardata + "'," + times + "," + buykind + ");\" class =\"btnC\" /> <input type=\"button\" value=\"取消\" onclick=\"showBuyMini(2);\" class =\"btnC\" /></div>";

        	$("#divshowprebuy").html(html);
        	$("#divshowprebuy").css({
            	'top': ($(window).height() / 4 + $(window).scrollTop()) + 'px'
        	});
        	showBuyMini(1);
		} else {
			showLogin();
		}
	});
}

//确认购买
 function passBuy(vardata, times, bk) {
 	 var url = $_trade.url.pcast;
     var buykind = bk, data = [];
     var money = parseInt($("#money").text());
     var secret = $("#selectPassword").attr("value");
     var masterBuy = parseInt($("#masterBuy").attr("value"));
     var baodi = parseInt($("#baodi").attr("value"));
     var deduct = $("#Deduct").attr("value");
     var lds = $("#txtLotDesc").attr("value");
         
     var isfollow = !!$("#isfollowPass").attr("checked");
     var gid = $_sys.get139Gid($("#TypeID").attr("value"));
     data.gid = gid;
     data.source = 100;
     data.codes = getszccodes(vardata,tID,parseInt($("#PlayType").val()));
     var pids = [];
     var muls = [];
     if (isfollow){//追号
     	url = $_trade.url.zcast;
        var followcount = parseInt($("#issueNumCount").attr("value"));

        buykind = 2;
        if (followcount > countexp) {
        	noticeInfo("追号期数超出最大限" + countexp + "期!");
        	return;
        }else if (followcount < 2) {
        	noticeInfo("追号期数至少为两期或以上!");
        	return;
        }
        var pid = $("#expect").val();
        var idx = 0;
        for(var i = 0; i < countexp; i++){
        	if(explist[i].pid==pid){
        		idx = i;
        		break;
        	}
        }
        
        var mt = 0;
        for(var i = idx; i < idx + followcount && i < countexp; i++){
        	pids.push(explist[i].pid);
        	muls.push(times);
        	mt += times;
        }
        if(pids.length != followcount){
        	noticeInfo("追号期数发生错误!");
        	return;
        }
        data.zflag = $("input[id^='stop']:checked").val();
        data.pid = pids.join(",");
        data.mulitys = muls.join(",");
        data.money = money*mt;
     } else {
        data.money = money;
     	data.pid = $("#expect").val();
     	data.muli = times;
     	data.fflag = 0;
        data.comeFrom = "";
        data.play = 1;
     }

     if (buykind == 1) { //合买

         if (isNaN(masterBuy)) {
             noticeInfo("认购金额不能小于0元!");
             return;
         }
         

         if (masterBuy < money * 0.05) {
             noticeInfo("认购金额不能低于5%!");
             return;
         }
         if (masterBuy > money) {
             noticeInfo("认购金额不能大于总金额!");
             return;
         }
         

         if(deduct>10 || deduct<0){
        	 noticeInfo("提成必须为0-10%!");
        	 return;
         }

         if (isNaN(baodi)) {
             baodi = 0;
         }
         if (isNaN(deduct)) {
             baodi = 0;
         }

         if (baodi > 0 && baodi < money * 0.05) {
             noticeInfo("保底金额不能低于5%!");
             return;
         }

         if (baodi + masterBuy > money) {
             noticeInfo("认购份金额保底金额的总和不能大于方案金额!");
             return;
         }
         data.bnum = masterBuy;
         data.desc = lds;
         data.name="手机合买";
         data.oflag = secret;
         data.pnum = baodi;
         data.tnum = money;
         data.type = 1;
         data.wrate = deduct;
     }else if(buykind == 0){
     	data.bnum = money;
        data.name="手机代购";
        data.desc="手机代购";
        data.pnum = 0;
     	data.tnum = money;
		data.type = 0;
        data.wrate = 0;
     }
     
     var param = "";
     for(var n in data){
    	 param += n + "=" + data[n] + "&";
     }
     
     $.ajax(
     {
         url: url,
         type: "POST",
         dataType:'json',
         data: param,
         success: function(d) {
             var code = d.Resp.code;
             var desc = d.Resp.desc;
             if(code == 0){
             	if (!!d.Resp.result){
             		xproid = d.Resp.result.projid;
             		showMS("购买成功,祝君好运中大奖!",function(){
             			setTimeout(function() { window.location.href = "/user/project.html?lotid="+gid+"&projid="+xproid;}, (2 * 1000));
             		});
             	} else {
             		zhid = d.Resp.zhuihao.id;
             		showMS("购买成功,祝君好运中大奖!",function(){
             			setTimeout(function() { window.location.href = "/user/xchase.html?lotid="+gid+"&tid="+zhid;}, (2 * 1000));
             		});
             	}
             } else {
             	if(desc.indexOf("余额") > 0){
             		showMS("您的余额不足，请去充值!", function(){
    					setTimeout(function() { window.location.href = "/user/addmoney.html"; }, (2 * 1000));
             		});
             	} else {
             		showMS(desc);
             	}
             }
             return;
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
             showMS(XMLHttpRequest.responseText);
             return;
         }
     }
     );
 }

 function noticeInfo(txt) {
     $("#noticeInfo").show();
     $("#noticeInfo").html("提示：" + txt);
 }

 function createTwoPanle(bk) {
	 var html = "";
     if (bk == 1){
    	 html += "<div id=\"divBuyInfo\" class=\"mini\" >保密设置：<select id=\"selectPassword\" onchange=\"getDivShow(this.value);\" >";
    	 html += "<option value=\"0\" selected=\"selected\">对所有人公开</option><option value=\"1\">截止后公开</option><option value=\"2\">对参与人员公开</option><option value=\"3\">截止后对参与人公开</option></select>";
         html += "<div id=\"divMyBuy\" class=\"mini\">我要认购：<input type=\"text\" name=\"masterBuy\" id=\"masterBuy\" class=\"textWH\" size=\"3\" onkeydown=\"getParsetInt(this);\" onkeyup=\"updatePublicBuyInfo();\" /> 元 (<span id=\"masterBuy_percent\">0%</span>)</div> " +
         		"<div id=\"divMyRemain\" class=\"mini\">我要保底：<input type=\"text\" name=\"baodi\" class=\"textWH\" id=\"baodi\" size=\"3\"  onkeydown=\"getParsetInt(this);\" onkeyup=\"updatePublicBuyInfo();\" /> 元 (<span id=\"baodi_percent\">0%</span>) </div>" +
         		"<div class=\"mini\">全额保底：<input type=\"checkbox\" name=\"baodiAll\" id=\"baodiAll\" value=\"all\" onclick=\"updatePublicBuyInfo();\" /> &nbsp; <span style=\"color:#999\">网站保底10%</span></div>" +
         		"<div id=\"divPercent\" class=\"mini\">提成比例：<select name=\"Deduct\" id=\"Deduct\"><option selected=\"selected\" value=\"0\">0%</option><option value=\"1\">1%</option><option value=\"2\">2%</option><option value=\"3\">3%</option><option value=\"4\">4%</option><option value=\"5\">5%</option><option value=\"6\">6%</option><option value=\"7\">7%</option><option value=\"8\">8%</option><option value=\"9\">9%</option><option value=\"10\">10%</option></select></div>" +
         		"<div class=\"mini\">方案描述:<input id=\"txtLotDesc\" maxlength=\"200\" type=\"text\" size=\"16\" value='" + GameName[getGameIndex(tID)] + "复式合买方案'/></div>";
     
     }else {
         html += "<div class=\"mini\" >是否追号：<label style=\"cursor:pointer;\" class=\"textWH\" onclick=\"updatefollowPass();\"><input type=\"checkbox\" name=\"isfollowPass\" id=\"isfollowPass\" />我要追号</label></div>";
         html += "<div id=\"followInfodetail\" style=\"display:none;\"><div class=\"mini\" >追号期数：<input type=\"text\" class=\"textWH\" name=\"issueNumCount\" id=\"issueNumCount\" size=\"2\" maxlength=\"2\" value=\"1\" onkeyup=\"getParsetInt(this);\" />期<span id=\"spanfollowinfo\" style=\"color:#999\">(最多" + (countexp) + "期)</span></div><div id=\"divIssueNumCount\" class=\"mini\" >追号设置：<label style=\"cursor:pointer;\" onclick=\"upateFollowInfo(this);\" ><input id=\"stop0\" name=\"stop0\" type=\"radio\" value=\"0\" />中奖不停</label><label style=\"cursor:pointer;color:red\" onclick=\"upateFollowInfo(this);\" ><input id=\"stop1\" name=\"stop1\" type=\"radio\" value=\"1\" checked/>中奖即停</label> <label style=\"cursor:pointer;\" onclick=\"upateFollowInfo(this);\"><input id=\"stop2\" name=\"stop2\" type=\"radio\" value=\"2\" />盈利停止</label></div></div>";
     }
     return html;
 }
//判断是否追号
 function updatefollowPass() {
     if (!!$("#isfollowPass").attr("checked")){
         $("#followInfodetail").show();
     }else{
         $("#followInfodetail").hide();
     }
 }