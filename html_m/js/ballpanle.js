var levelNameOne = new Array("一", "二", "三", "四", "五", "六", "七");
var levelNameTwo = new Array("万", "千", "百", "十", "个");
//大乐透,双色球
function createballpanle_ssq_dlt(minL, maxL, color) {
    var html = new Array();
    html.push("<ul class=\"ball\">");
    for (var i = minL; i <= maxL; i++) {
        if (color == "red")
            html.push("<li><span id=\"redball_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
        else
            html.push("<li><span id=\"blueball_" + i.toString() + "\" class=\"" + BallStyle[2] + "\"  onclick=\"selectBall(this,'blue');\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
    }
    html.push("</ul>");

    return html.join("");
}

//七星彩,排列5
function createballpanle_qxc_pl5(minL, maxL, level) {
    var html = new Array();
    for (var l = 1; l <= level; l++) {
        if (level == 7)
            html.push("<div class=\"stitle\">第" + levelNameOne[l - 1] + "位：</div>");
        else
            html.push("<div class=\"stitle\">" + levelNameTwo[l - 1] + "位：</div>");
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");

        for (var i = minL; i <= maxL; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + i.toString() + "</span></li>");
        }

        html.push("</ul><br />");
    }
    return html.join("");
}

//排列3
var gameName_pl3 = new Array("","直选", "单式上传", "直选和值", "直选跨度", "组选三", "组选和值", "组选三跨度", "组选六", "组选和值", "组选六跨度");
function createballpanle_pl3(level,rKind) {
    var varlength = 1;
    var startmin = 0, endmax = 9;
    if (level == 1)
        varlength = 3;
    else if (level == 3)
    { startmin = 0, endmax = 27; }
    else if (level == 6)
    { startmin = 1, endmax = 26; }
    else if (level == 7)
    { startmin = 1; }
    else if (level == 9)
    { startmin = 1, endmax = 26; }
    else if (level == 10)
    { startmin = 2 }

    var html = new Array();
    for (var l = 1; l <= varlength; l++) {
        if (varlength == 3)
            html.push("<div class=\"stitle\">" + levelNameTwo[l + 1] + "位：</div>");
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");
        for (var i = startmin; i <= endmax; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + i.toString() + "</span></li>");
        }
        html.push("</ul>");
        if (varlength == 3)
            html.push("<br />");
    }
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//福彩3D
var gameName_3D = new Array("","直选", "直选和值", "组三", "组三和值", "组六", "组六和值", "单式上传", "1D", "2D", "通选", "和数");
function createballpanle_3D(level, rKind) {
    var varlength = 1;
    var startmin = 0, endmax = 9;
    if (level == 1 || level == 8 || level == 9 || level == 10)
        varlength = 3;
    else if (level == 2 || level == 11)
        endmax = 27;
    else if (level == 4)
    { startmin = 1, endmax = 26; }
    else if (level == 6)
    { startmin = 3, endmax = 24; }


    var html = new Array();
    for (var l = 1; l <= varlength; l++) {
        if (varlength == 3)
            html.push("<div class=\"stitle\">" + levelNameTwo[l + 1] + "位：</div>");
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");
        for (var i = startmin; i <= endmax; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + i.toString() + "</span></li>");
        }
        html.push("</ul>");
        if (varlength == 3)
            html.push("<br />");
    }
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}


//南粤36选7
var gameName_36s7 = new Array("36选7", "好彩1", "生肖", "季节", "方位", "好彩2", "好彩3", "单式上传");
var gameName_36s7_length = new Array(0, 7, 1, 1, 1, 1, 2, 3);
var gameName_36s7_animal = new Array("鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪");
var gameName_36s7_season = new Array("春", "夏", "秋", "冬");
var gameName_36s7_position = new Array("东", "南", "西", "北");
var gameName_36s7_subName = new Array("", "36选7", "好彩1", "好彩2", "好彩3", "生肖", "季节", "方位");
var gameName_36s7_subID = new Array(0, 1, 2, 6, 7, 3, 4, 5);
function createballpanle_36s7(level, rKind) {
    var startmin = 1, endmax = 36;
    if (level == 3)
        endmax = 12;
    else if (level == 4 || level == 5)
        endmax = 4;

    var html = new Array();
    html.push("<ul id=\"ulnumber_1\" class=\"ball\">");
    for (var i = startmin; i <= endmax; i++) {
        if (level == 3 || level == 4 || level == 5)
            html.push("<li><span id=\"redball_1_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + (level == 3 ? gameName_36s7_animal[i - 1] : level == 4 ? gameName_36s7_season[i - 1] : gameName_36s7_position[i - 1]) + "</span></li>");
        else
            html.push("<li><span id=\"redball_1_" + i.toString() + "\" class=\"" + BallStyle[0] + "\" onclick=\"selectBall(this,'red')\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
    }
    html.push("</ul>");

    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//山东,江西11选5
var gameName_11s5 = new Array("", "前一", "任选二", "前二组选", "前二直选", "任选三", "前三组选", "前三直选", "任选四", "任选五", "任选六", "任选七", "任选八");
var gameName_11s5_length = new Array(0, 1, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 8);
var gameName_11s5_subName = new Array("", "前一", "任选二", "任选三", "任选四", "任选五", "任选六", "任选七", "任选八", "前二组选", "前三组选", "前二直选", "前三直选");
var gameName_11s5_subID = new Array(0, 1, 2, 5, 8, 9, 10, 11, 12, 3, 6, 4, 7);
function createballpanle_11s5(level, rKind) {
    var varlength = 1;
    var startmin = 1, endmax = 11;
    if (level == 4)
        varlength = 2;
    else if (level == 7)
        varlength = 3;
    var html = new Array();
    for (var l = 1; l <= varlength; l++) {
        if (varlength == 2 || varlength == 3)
            html.push("<div class=\"stitle\">第" + levelNameOne[l - 1] + "位：</div>");
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");
        for (var i = startmin; i <= endmax; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[4] + "\" onclick=\"selectBall(this,'red')\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
        }
        html.push("</ul>");
        if (varlength == 2 || varlength == 3)
            html.push("<br />");
    }
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//快乐十分
var gameName_happyten = new Array("", "选一数投", "选一红投", "选二任选", "选二连组", "选二连直", "选三任选", "选三前组", "选三前直", "选四任选", "选五任选");
var gameName_happyten_length = new Array(0, 1, 2, 2, 2, 2, 3, 3, 3, 4, 5);
var gameName_happyten_subName = new Array("", "选一数投", "选一红投", "选二任选", "选三任选", "选四任选", "选五任选", "选二连组", "选三前组", "选二连直", "选三前直");
var gameName_happyten_subID = new Array(0, 1, 2, 3, 6, 9, 10, 4, 7, 5, 8);
function createballpanle_happyten(level, rKind) {
    var varlength = 1;
    var startmin = 1, endmax = 20;
    if (level == 1)
        endmax = 18;
    else if (level == 2)
        startmin = 19;
    else if (level == 5)
        varlength = 2;
    else if (level == 8)
        varlength = 3;

    var html = new Array();
    for (var l = 1; l <= varlength; l++) {
        if (varlength == 2 || varlength == 3)
            html.push("<div class=\"stitle\">第" + levelNameOne[l - 1] + "位：</div>");
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");
        for (var i = startmin; i <= endmax; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[4] + "\" onclick=\"selectBall(this,'red')\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
        }
        html.push("</ul>");
        if (varlength == 2 || varlength == 3)
            html.push("<br />");
    }
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//快乐8
var gameName_happy8 = new Array("", "任选一", "任选二", "任选三", "任选四", "任选五", "任选六", "任选七", "任选八", "任选九", "任选十");
var gameName_happy8_length = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
function createballpanle_happy8(level, rKind) {
    var startmin = 1, endmax = 80;
    var html = new Array();
    html.push("<ul id=\"ulnumber_" + level + "\" class=\"ball\">");
    for (var i = startmin; i <= endmax; i++) {
        html.push("<li><span id=\"redball_1_" + i.toString() + "\" class=\"" + BallStyle[4] + "\" onclick=\"selectBall(this,'red')\" >" + (i > 9 ? i.toString() : ("0" + i.toString())) + "</span></li>");
    }
    html.push("</ul>")
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//时时彩 
var gameName_ssc = new Array("", "一星", "二星", "三星", "五星", "二星组选", "二星和值", "五星通选", "大小单双");
var gameName_ssc_length = new Array(0, 1, 2, 3, 5, 2, 1, 5, 2);
var gameName_ssc_subname = new Array("大", "小", "单", "双");
var ssc_nums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1];
function createballpanle_ssc(level, rKind) {
    var varlength = 1;
    var startmin = 0, endmax = 9;
    if (level == 2)
        varlength = 2;
    else if (level == 8) {
        varlength = 2;
        startmin = 0, endmax = 3;
    }
    else if (level == 3)
        varlength = 3;
    else if (level == 4 || level == 7)
        varlength = 5;
    else if (level == 6)
    	endmax = 18;

    var html = new Array();
    for (var l = varlength; l >= 1; l--) {
    	if(level == 5 || level == 6){
            html.push("<div class=\"stitle\">" + levelNameOne[l - 1] + "位：</div>");
    	} else {
            html.push("<div class=\"stitle\">" + levelNameTwo[5 - l] + "位：</div>");
    	}
        html.push("<ul id=\"ulnumber_" + l + "\" class=\"ball\">");
        for (var i = startmin; i <= endmax; i++) {
            html.push("<li><span id=\"redball_" + l.toString() + "_" + i.toString() + "\" class=\"" + BallStyle[4] + "\" onclick=\"selectBall(this,'red')\" >" + (level == 8 ? gameName_ssc_subname[i] : i.toString()) + "</span></li>");
        }
        html.push("</ul><br />")
    }
    if (rKind == 1)
        return html.join("");
    else
        $("#redArea").html(html.join(""));
}

//生成Input[radio]按钮
function createInputChecked(name,click,indexid,indexname,ischeck) {
    var varinput = "<label id=\"lb_" + indexid + "\" " + (ischeck ? "class=\"btnD\";" : "class=\"btn\";") + " style=\"cursor:pointer;\" onclick=\"updateballpanelstate('" + name + "',this);" + click + "\" ><input type=\"radio\" value=\"" + indexid + "\" " + (ischeck ? "checked=\"checked\"" : "") + " style='display:none;' />" + indexname + "</label>&nbsp;&nbsp;";
    return varinput;
}

//更新玩法状态
function updateballpanelstate(name,obj) {
    var bpList = $("#" + name).children();
    for (var i = 0; i < bpList.length; i++) {
        if ($(bpList[i]).children("input").length > 0 ) {
            $(bpList[i]).children("input")[0].checked = false;
        }
        $(bpList[i]).attr("class", "btn");
    }
    $(obj).children("input")[0].checked = true;
    $(obj).attr("class", "btnD");
    $("#PlayType").attr("value", $(obj).children("input")[0].value); //重置玩法ID
    if (tID == 118 && ($(obj).children("input")[0].value == "8" || $(obj).children("input")[0].value == "9")) {
        $("#span_add").hide();
    }
    else if (tID == 118)
        $("#span_add").show();
        
    clearData(); //清空数据
}

//清空数据
function clearData() {
    if ($("#Kind").attr("value") == "1")
        $("#divMachineCase").html("");
    $("#RedBallValue").attr("value", "");
    $("#BlueBallValue").attr("value", "");
    $("#notes").html(0);
    $("#times2").html(0);
    $("#money").html(0);
    if ($("#viewPriceInfo")) {
        $("#viewPriceInfo").html("1～1元，最低1元，最高方案金额的20%");
        $("#viewPrice").attr("value", "1");
    }
}


//设置提示窗口
function showMS(ms,fn) {
    $("#divshowprebuy").html("<div class=\"ball_h2\">温馨提示</div><div class=\"mini\">内容：" + ms + "</div>");
    $("#divshowprebuy").css({
        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
        'left': "0px",
    });
    showBuyMini(1);
    setTimeout(function() { showBuyMini(2); }, (2 * 1000));
    if(fn != null && fn != undefined){
    	fn.call(this);
    }
}

//是否显示提示窗口
function showBuyMini(kind) {
    if (kind == 1) {
        $("#divshowprebuy").show();
        $("#divDisable").css({
            "height": $("#caseForm").height() + 110 + "px",
            "display": "block"
        });
    }
    else {
        $("#divshowprebuy").hide();
        $("#divDisable").hide();
        $("#divshowprebuy").html("");
    }
}

//设置玩法窗口
function showGP(ms) {
    $("#divshowprebuy").html("<div class=\"ball_h2\">玩法设置</div><div class=\"mini\" id=\"gamePanle\">" + ms + "</div>");
    $("#divshowprebuy").css({
        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
        "left": "0px"
    });
    showBuyMini(1);
}

//销售时间倒数
var reflashCount = 0;
var ClockNowTime,StopTime ,ClockDiff ,LeaveClock,type;
function showCountDownTime_gpc(id, nowtime, stoptime) {
       ClockNowTime = new Date(nowtime);
    ClockDiff = new Date() - ClockNowTime;
    StopTime = new Date(stoptime);
    LeaveClock = $("#" + id);
    setInterval('funClock_pgc()', 1000);
}

function funClock_pgc() {   //高频彩
    var leave = StopTime - new Date() + ClockDiff;
    var day = Math.floor(leave / (1000 * 60 * 60 * 24));
    var hour = Math.floor(leave / (1000 * 3600)) - (day * 24);
    var minute = Math.floor(leave / (1000 * 60)) - (day * 24 * 60) - (hour * 60);
    var second = Math.floor(leave / (1000)) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;
    if (leave > 0) { //还未截止
        var latestTime = StopTime.getTime() - 840000;
        if ((new Date()).getTime() < latestTime)
            LeaveClock.html(hour + ":" + minute + ":" + second);
        else
            LeaveClock.html(minute + ":" + second);
    }
    else { //已截止
        if (stopState && stopState == 1) {
            LeaveClock.html("已停售");
        }
        else {
            LeaveClock.html("已截止");
            if (reflashCount == 5) {
            	showMS("当前期次已截止,稍后重新加载新期次!",function(){
         			setTimeout(function() { window.location.reload();}, (2 * 1000));
         		});
            	reflashCount = 0;
            }
            reflashCount++;
        }
    }
}

function showCountDownTime_szc(id, nowtime, stoptime,tkind) {
   type =tkind ;
    ClockNowTime = new Date(nowtime);
    ClockDiff = new Date() - ClockNowTime;
    StopTime = new Date(stoptime);
    LeaveClock = $("#" + id);
    setInterval('funClock_szc()', 1000);
}
function funClock_szc() {
    var leave = StopTime - new Date() + ClockDiff;
    var day = Math.floor(leave / (1000 * 60 * 60 * 24));
    var hour = Math.floor(leave / (1000 * 3600)) - (day * 24);
    var minute = Math.floor(leave / (1000 * 60)) - (day * 24 * 60) - (hour * 60);
    var second = Math.floor(leave / (1000)) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

    if (leave > 0)  //还未截止
        LeaveClock.html((type == 1 ? (day + "天 ") : "") + hour + ":" + minute + ":" + second);
    else  //已截止
    {
        if (stopState && stopState == 1) {
            LeaveClock.html("已停售");
        } else {
            LeaveClock.html("已截止 ");
        }
    }
}

//即时计算注数
function CurrentCountBallNotes_pl3(numberlist, playtype) {
    var varNotes = 0;
    if (playtype == 3) {//直选和值
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    start = a + b + c;
                    for (var d = 0; d < numberlist.length; d++) {
                        if (start == parseInt(numberlist[d])) num += 1;
                    }
                }
            }
        }
        varNotes = num;
    }
    else if (playtype == 4) { //直选跨度
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    var ay = new Array();
                    ay[0] = a, ay[1] = b, ay[2] = c;
                    ay.sort(sortIntArrayAsc);
                    start = parseInt(ay[2]) - parseInt(ay[0]);
                    for (var d = 0; d < numberlist.length; d++) {
                        if (start == parseInt(numberlist[d])) num += 1;
                    }
                }
            }
        }
        varNotes = num;
    }
    else if (playtype == 5) { //组选三
        var num = 0;
        var start = numberlist.length;
        if (start < 2) return 0;

        var n = 1;
        for (var a = 1; a <= start; a++) {
            n = n * a;
        }
        var m = 1;
        for (var b = 1; b <= start - 2; b++) m = m * b;

        varNotes = n / m;
    }
    else if (playtype == 6) { //组选和值
        var num = 0, num2 = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    if ((a == b || a == c || b == c) && !(a == b && b == c)) {
                        start = a + b + c;
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num += 1;
                        }
                    }
                    if (a != b && a != c && b != c) {
                        start = a + b + c;
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num2 += 1;
                        }
                    }
                }
            }
        }

        varNotes = (num * 2 + num2) / 6;
    }
    else if (playtype == 7) { //组选三跨度
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    if ((a == b || a == c || b == c) && !(a == b && b == c)) {
                        var ay = new Array();
                        ay[0] = a, ay[1] = b, ay[2] = c;
                        ay.sort(sortIntArrayAsc);
                        start = parseInt(ay[2]) - parseInt(ay[0]);
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num += 1;
                        }
                    }
                }
            }
        }
        varNotes = num / 3;
    }
    else if (playtype == 8) { //组选六
        var num = 0;
        var start = numberlist.length;
        if (start < 3) return 0;

        var n = 1;
        for (var a = 1; a <= start; a++) {
            n = n * a;
        }
        var m = 1;
        for (var b = 1; b <= start - 3; b++) m = m * b;
        varNotes = n / (m * 6);
    }
    else if (playtype == 10) { //组选六跨度
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    if (a != b && a != c && b != c) {
                        var ay = new Array();
                        ay[0] = a, ay[1] = b, ay[2] = c;
                        ay.sort(sortIntArrayAsc);
                        start = parseInt(ay[2]) - parseInt(ay[0]);
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num += 1;
                        }
                    }
                }
            }
        }
        varNotes = num / 6;
    }
    return varNotes;
}

function CurrentCountBallNotes_3D(numberlist, playtype) {
    var varNotes = 0;
    if (playtype == 2) {//直选和值
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    start = a + b + c;
                    for (var d = 0; d < numberlist.length; d++) {
                        if (start == parseInt(numberlist[d])) num += 1;
                    }
                }
            }
        }
        varNotes = num;
    }
    else if (playtype == 3) {//组三
        var num = 0;
        var start = numberlist.length;
        if (start < 2) return 0;

        var n = 1;
        for (var a = 1; a <= start; a++) {
            n = n * a;
        }
        var m = 1;
        for (var b = 1; b <= start - 2; b++) m = m * b;

        varNotes = n / m;
    }
    else if (playtype == 4) {//组三和值
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    start = a + b + c;
                    if ((a == b || a == c || b == c) && !(a == b && b == c)) {
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num += 1;
                        }
                    }
                }
            }
        }
        varNotes = num / 3;
    }
    else if (playtype == 5) {//组六
        var num = 0;
        var start = numberlist.length;
        if (start < 3) return 0;

        var n = 1;
        for (var a = 1; a <= start; a++) {
            n = n * a;
        }
        var m = 1;
        for (var b = 1; b <= start - 3; b++) m = m * b;
        varNotes = n / (m * 6);
    }
    else if (playtype == 6) {//组六和值
        var num = 0;
        var start = 0;
        for (var a = 0; a < 10; a++) {
            for (var b = 0; b < 10; b++) {
                for (var c = 0; c < 10; c++) {
                    start = a + b + c;
                    if (a != b && a != c && b != c) {
                        for (var d = 0; d < numberlist.length; d++) {
                            if (start == parseInt(numberlist[d])) num += 1;
                        }
                    }
                }
            }
        }
        varNotes = num / 6;
    }
    else if (playtype == 8) {//1D
        varNotes = 0;
        for (var i = 0; i < numberlist.length; i++) {
            if (numberlist[i] == "-")
                continue;
            varNotes += numberlist[i].length;
        }
    }
    else if (playtype == 9) {//2D
        varNotes = 0;
        if (numberlist.length == 3) {
            if (numberlist[0] != "-" && numberlist[1] != "-")
                varNotes += (numberlist[0].length) * (numberlist[1].length);

            if (numberlist[0] != "-" && numberlist[2] != "-")
                varNotes += (numberlist[0].length) * (numberlist[2].length);

            if (numberlist[1] != "-" && numberlist[2] != "-")
                varNotes += (numberlist[1].length) * (numberlist[2].length);
        }
    }
    else if (playtype == 11) {//和数
        varNotes = numberlist.length;
    }

    return varNotes;
}