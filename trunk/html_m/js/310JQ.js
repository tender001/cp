var needPayPWD = false;
//检查标签里的值是否在取值范围内
function TimesNum(obj, minN, maxN) {
    var v = $(obj).val();
    if (v == "") v = "0";
    if (parseInt(v) < minN) obj.value = minN;
    else if (parseInt(v) > maxN) obj.value = maxN;
    times = parseInt(obj.value);
    amount = (noteCount * times * 2);
    byID("hidAmount").value = amount;
    byID("preMoney").innerHTML = "金额：(" + chooseArray.length + "场)" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
}
//切换代购、合买
function switchKind(k) {
    var pl = byID("hemaiPanel");
    if (k == 2) pl.style.display = "none";
    else pl.style.display = "";

    var list = byID("preSecret").options;
    for (var i = 0; i < list.length; i++) {
        if (list[i].text == "跟单公开" && k == 2) {
            list[i].text = "永久保密";
            list[i].value = "4";
        }
        if (list[i].text == "永久保密" && k == 4) {
            list[i].text = "跟单公开";
            list[i].value = "2";
        }
    }
}
//是否数字型
function IsNum(obj, perTag) {
    var per = 0;
    if (isNaN(obj.value)) obj.value = "";
    else {
        obj.value = parseInt(obj.value);
        var mm = (byID("hidAmount").value.replace("0", "") != "" ? parseInt(byID("hidAmount").value) : 0);
        if (mm > 0) per = Math.floor((parseInt(obj.value) / mm) * 10000) / 100;
    }
    byID(perTag).innerHTML = "(" + per + "%)";
}
var fonL_ = new Array();
//组合算法
function FastGroupNums(s, i, d, NumberLen, Numbers) {
    for (var n = i; n < Numbers - NumberLen + d + 1; n++) {
        if (d == NumberLen) {
            fonL_.push(s + n);
        }
        else {
            FastGroupNums(s + n + ",", n + 1, d + 1, NumberLen, Numbers);
        }
    }
}
//一个过关方式的金额计算
function SinglePassModeCount(passMode, list) {
    var dan = 0; //胆的个数
    var danTime = 1; //
    var N = parseInt(passMode.replace('P', '').split('_')[0]); //N串M的N
    var M = parseInt(passMode.replace('P', '').split('_')[1]); //N串M的M

    var paiList = new Array();
    for (var i = 0; i < list.length; i++) {
        if (list[i][2] == "1") {
            dan++;
            danTime *= list[i][1].split(',').length;
        }
        else {
            paiList.push(list[i][1].split(',').length);
        }
    }
    var count = 0;
    if (N - dan > 0) {
        fonL_ = new Array();
        FastGroupNums("", 1, 1, (N - dan), paiList.length);
        for (var m = 0; m < fonL_.length; m++) {
            var changciList = fonL_[m].split(',');
            var usDanList = new Array();
            var one = 1;
            for (var k = 0; k < changciList.length; k++) {
                one *= paiList[parseInt(changciList[k], 10) - 1];
            }
            count += one;
        }
    }
    if (count == 0 && dan > 0) count = 1;

    return count * danTime;
}

/*ajax操作*/
//检查需要提交的信息
function CheckBuy_(postData,IsSubmit) {
    $.ajax({
        type: "POST",
        cache: false,
        //url: urlPath,
        data: postData,
        success: function(r) {
            try {
                var lot = eval('(' + r + ')');
                if (lot != null && lot != 'undefined') {
                    if (lot.error) {
                        showTips(lot.error.replace(/\{rn\}/gi, "\r\n"));
                    }
                    else if (lot.tag) {
                        tag = lot.tag;
                        if (IsSubmit) SubmitLot_("ajax=buy&tag=" + tag + "&PayPwd=" + escape($("#payPwd").val()));
                        else {
                            window.location.href = "#";
                            $("#choosePanel").hide();
                            $("#popupPre").show("fast");
                        }
                    }
                    else if (lot.login && lot.login == "0") {
                        //window.location.href = "#";
                        showLogin();
                        showTips("请先登录系统");
                    }
                    if (lot.PayPwd && lot.PayPwd == "1") {
                        needPayPWD = true;
                        $("#divPayPwd").show();
                    }
                }
                else {
                    showTips("生成方案失败！");
                }
            } catch (e) { showTips("操作时发生未知异常：" + e.message); }
            $("#submitBtn").html("确定");
        },
        error: function(r) {
            showTips("异常:" + r);
            $("#submitBtn").html("确定");
        },
        complete: function(XHR, TS) { XHR = null; }
    });
}
//提交方案
function SubmitLot_(postData) {
    if (tag != "") {
        //var postData = "tag=" + tag;
        var oriTag = tag;
        tag = "";
        $.ajax({
            type: "POST",
            cache: false,
            //url: urlPath,
            data: postData,
            success: function(r) {
                try {
                    var lot = eval('(' + r + ')');
                    if (lot != null && lot != 'undefined') {
                        if (lot.error) {
                            tag = oriTag;
                            showTips(lot.error);
                        }
                        else if (lot.success) {
                            window.location.href = "success.aspx?typeid=" + typeID + "&lotteryID=" + lot.success;
                        }
                        else if (lot.login && lot.login == "0") {
                            tag = oriTag;
                            showTips("请先登录系统");
                            showLogin();
                        }
                        else {
                            tag = oriTag;
                            showTips(r);
                        }
                    }
                    else {
                        showTips("提交方案失败！");
                    }
                } catch (e) { showTips("操作时发生未知异常：" + e.message); }
                $("#submitBtn").html("确定");
            },
            error: function(r) {
                showTips("异常:" + r);
                $("#submitBtn").html("确定");
            },
            complete: function(XHR, TS) { XHR = null; }
        });
    }
    else {
        $("#popupPre").hide("fast");
        $("#choosePanel").show();
        window.location.href = "#bottonAn";
        showTips("数据丢失或重复提交，请重新预览提交");
    }
}