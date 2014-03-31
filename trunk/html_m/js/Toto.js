var noteCount = 0, amount = 0, times = 1, tag = "";
var choose = ""; //选择列表[赛程ID，选择内容(含定胆情况)]
var len = (typeID == 3 ? 12 : typeID == 4 ? 8 : 14);
//选号
function ChooseMatch(obj) {
    var n = $(obj).attr("name").toString();
    obj.className = (obj.className == "mBTN" ? 'mBtnCheck' : 'mBTN');
    if (typeID == 2) {
        var list = new Array();
        $('.mBtnCheck').each(function(index) {
            var name = $(this).attr("name");
            if (list.indexOf(name) == -1) list.push(name);
        });
        if (list.length <= 9) {
            $('.mDanCheck').each(function(index) {
                $(this).removeClass("mDanCheck").addClass("mDan1");
            });
            $('.mDan').each(function(index) {
                $(this).removeClass("mDan").addClass("mDan1");
            });
        }
        else if (list.length > 9) {
            $('.mDan1').each(function(index) {
                if (("," + list.join(",") + ",").indexOf("," + $(this).attr("id").replace("D", "") + ",") != -1) $(this).removeClass("mDan1").addClass("mDan");
            });
        }
    }
    CountLot();
}
//选胆
function ChooseDan(obj) {
    if (obj.className == "mDan1") return;
    if (obj.className == "mDan") obj.className = 'mDanCheck';
    else if (obj.className == "mDanCheck") obj.className = 'mDan';
    if ($(".mDanCheck").length >= 9) {
        showTips("<span style='color:red'>注意：</span>任九场设胆范围是0~8个！");
        obj.className = 'mDan';
    }
    CountLot();
}

function CountLot() {
    var cArray = new Array(len);
    for (var i = 0; i < len; i++)
        cArray[i] = "";
    var list = new Array();
    $('.mBtnCheck').each(function(index) {
        var name = $(this).attr("name");
        if (!isNaN(name)) {
            cArray[parseInt(name) - 1] += $(this).attr("value");
        }
    });
    $('.mDanCheck').each(function(index) {
        var name = $(this).attr("id");
        if (name.indexOf("D") != -1) {
            cArray[parseInt(name.replace("D", "")) - 1] = "d" + cArray[parseInt(name.replace("D", "")) - 1];
        }
    });
    choose = cArray.join(",");
    for (var i = 0; i < cArray.length; i++) {
        if (cArray[i] != "") {
            list.push([i + 1, cArray[i].replace("d", "").split('').join(","), (cArray[i].indexOf("d") != -1 ? "1" : "0")]);
        }
    }
    if (typeID == 2) {
        if (list.length < 9) noteCount = 0;
        else noteCount = SinglePassModeCount("P9_1", list);
        var chooseList = choose.split(',');
        for (var i = 0; i < chooseList.length; i++) {
            if (chooseList[i] == "") chooseList[i] = "#";
        }
        choose = chooseList.join(",");
    }
    else if (choose.indexOf("#") != -1) noteCount = 0;
    else {
        var chooseList = choose.split(',');
        noteCount = 1;
        for (var i = 0; i < chooseList.length; i++) {
            noteCount *= chooseList[i].length;
        }
    }
    amount = (noteCount * times * 2);
    byID("hidAmount").value = amount;
    byID("preMoney").innerHTML = "金额：(" + list.length + "场)" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
}

function prebuy(preKind) {
    tag = "";
    if (noteCount > 0) {
        kind = preKind;
        times = parseInt(byID("preTimes").value); //倍数
        var err = "";
        if (times < 1 || times > 99999) err += "倍数必须是1和99999之间的整数\r\n";
        if (err != "") {
            showTips(err);
            return;
        }
        var gid = $_sys.get139Gid(typeID);
        var html = "<div class='preM1'>方案内容</div><div class='preM2'>" + showszccode(gid,getZCcode(choose,gid),0) + "</div>";
        var typeName = byID("hidTypeName").value;    
        html += "<div class='preB'>" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
        if (kind == 4) {
            html += "<section>提成：<SELECT id='preDeduct'><OPTION selected='' value='0'>0%</OPTION><OPTION value='1'>1%</OPTION><OPTION value='2'>2%</OPTION><OPTION value='3'>3%</OPTION><OPTION value='4'>4%</OPTION><OPTION value='5'>5%</OPTION><OPTION value='6'>6%</OPTION><OPTION value='7'>7%</OPTION><OPTION value='8'>8%</OPTION><OPTION value='9'>9%</OPTION><OPTION value='10'>10%</OPTION></SELECT></section>"
            	+ "<section>认购：<input value=\"\" type=\"text\" maxLength=\"7\" size=7  id=\"preMasterBuy\" onkeyup='updatePublicBuyInfo();'>元<span id='mbPer'>(0%)</span></section>"
				+ "<section>保底：<input value=\"\" type=\"text\" maxLength=\"7\" size=7  id=\"preBaoDi\" onkeyup='updatePublicBuyInfo();'>元<span id='bdPer'>(0%)</span>&nbsp;<input  style=\"vertical-align:middle\" type=\"checkbox\" name=\"baodiAll\" id=\"baodiAll\" value=\"all\" onclick=\"updatePublicBuyInfo();\" />全额保底</section>"
				+ "<div>保密：<select id='preSecret'><option value='0'>完全公开</option><option value='1'>截止公开</option><option value='2'>针对跟单人公开</option><option value='3'>截止对跟单人公开</option></select></div>"
				+ "<div>方案描述：<input id=\"txtLotDesc\" name=\"txtLotDesc\" maxlength=\"200\" type=\"text\" size=\"16\" value='" + typeName + "复式合买方案'/></div>";
        }
        html += "</div>";

        $("#divPreView").html(html);
        $.ajax({
	        url: $_user.url.checklogin,
	        dataType:'json',
	        type : "POST",
	        success:function (d){
	 			var code = d.Resp.code;
	 			if (code == "0") {
		        	$("#choosePanel").hide();
		            $("#popupPre").show("fast");
	 			}else{
	 				showLogin();
	 			}
	        },
	        error:function(){
	        	showTips('网络异常!');
	        }
        });
    }
    else {
        showTips("请正确选择投注内容！");
    }
}

//全额保底
function updatePublicBuyInfo() {
    var preMasterBuy = new Number($("#preMasterBuy").attr("value"));//认购
    var money = byID("hidAmount").value;

    if (preMasterBuy > 0 && preMasterBuy <= money) {
        $("#preMasterBuy").attr("value", (preMasterBuy).toFixed(0));
        $("#mbPer").html(Math.floor((preMasterBuy / money) * 10000) / 100 + "%");
    } else {
        $("#preMasterBuy").attr("value", "");
        $("#mbPer").html("0%");
    }
    
    if (!!$("#baodiAll").attr("checked")) {
        $("#preBaoDi").attr("value", money - preMasterBuy);
    }
    var baodi = new Number($("#preBaoDi").attr("value"));
    if (baodi > 0 && baodi + preMasterBuy <= money) {
        $("#preBaoDi").attr("value", (baodi).toFixed(0));
        $("#bdPer").html(Math.floor((baodi / money) * 10000) / 100 + "%");
    } else {
        $("#preBaoDi").attr("value", "");
        $("#bdPer").html("0%");
    }
}

//提交方案
function SubmitLot(obj) {
	if(!$("#agreement").attr("checked")){
		showTips("必须同意<<用户合买代购协议>>,才可购买彩票");
		return;
	}
	if($(obj).html().indexOf("方案提交中")!=-1) return;
	var oriObjTxt = $(obj).html();
	$(obj).html("方案提交中...")
	setTimeout(function(){$(obj).html(oriObjTxt)},3000);
	showTips("提交中...");
    var secret = 0; //保密
    var masterbuy = 1; //认购
    var baodi = 0; //保底
    var deduct = 0; //提成
    var name ="手机代购";
    var desc ="手机代购";
    var type =0;
    if (kind == 4) {
    	secret =parseInt(byID("preSecret").value);
        masterbuy = byID("preMasterBuy").value.toInt();
        baodi = byID("preBaoDi").value.toInt();
        deduct = parseInt(byID("preDeduct").value);
        if (isNaN(masterbuy)) {
        	 showTips("认购金额不能小于0元!");
            return;
        }
        if (masterbuy / noteCount < 0.05){
        	showTips("合买认购金额不能小于方案金额的5%!");
        	return;
        } 
        if (masterbuy > amount) {
        	showTips("认购金额不能大于总金额!");
             return;
        }
        deduct = $("#preDeduct").attr("value");
        desc=$("#txtLotDesc").val();
        name="手机合买";
        type= 1;
       

        if (isNaN(baodi)) {
            baodi = 0;
        }
        if (isNaN(deduct)) {
            baodi = 0;
        }
        

        if (baodi > 0 && baodi < amount * 0.05) {
            noticeInfo("保底金额不能低于5%!");
            return;
        }

        if (baodi + masterbuy > amount) {
        	showTips("认购份金额保底金额的总和不能大于方案金额!");
            return;
        }
        if(deduct>10 || deduct < 0){
        	showTips("提成必须在0-10%之间!");
            return;
        }
        
    }

    var gid = $_sys.get139Gid(typeID);
    var data = "gid="+gid+"&source=100&codes="+getZCcode(choose,gid)
    	+"&pid="+issue+"&muli="+times+"&bnum="+masterbuy+"&comeFrom=&desc="+desc
    	+"&fflag=0&name="+name+"&money="+amount+"&oflag="+secret+"&play=1&pnum="+baodi
    	+"&tnum="+amount*1+"&type="+type+"&wrate="+deduct;
    $.ajax({
         type: "POST",
         url:  $_trade.url.pcast,
         dataType:'json',
         data: data,
         success: function(d) {
			var code = d.Resp.code;
			var desc = d.Resp.desc;
 			if (code == "0") {
				var projid = d.Resp.result.projid;
				window.location.href="/user/project.html?lotid="+gid+"&projid="+projid;
             }else{
	        	 if(desc.indexOf("余额不足")!=-1){
	        		 showTips("您的余额不足，请去充值!",function(){
	        				clearTimeout(tipsTs);
	        				tipsTs = setTimeout(function(){
	        					window.location.href="/user/addmoney.html";
	        				}, 1000);
	        		 });
	        	 }else{
	        		 showTips(desc);
	        	 }
             }
 			 return;
         },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
             showMS(XMLHttpRequest.responseText);
             return;
         }
     });
}

function ClearChoose() {
    noteCount = 0, amount = 0, times = 1, tag = "";
    choose = "";
    $('.mBtnCheck').each(function(index) {
        $(this).removeClass("mBtnCheck").addClass("mBTN");
    });
    $('.mDanCheck').each(function(index) {
        $(this).removeClass("mDanCheck").addClass("mDan1");
    });
    $('.mDan').each(function(index) {
        $(this).removeClass("mDan").addClass("mDan1");
    });
    CountLot();
}

setTimeout("$('body').append('<div></div>'); ", 1);