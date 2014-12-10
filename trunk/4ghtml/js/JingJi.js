var lastID = ""; //上一次加载最大的赛程ID
var sclass = ""; //赛事筛选
var rqFilterType = "";//赛事筛选--是否让球  1就是让球，2就是不让球，其余全部
var loadAll = false; //是否已经加载完成
var isLoading = false; //是否正在加载中
var matchArray = new Array(); //赛程列表
var chooseArray = new Array(); //选择列表[赛程ID，选择内容(含定胆情况)]
var passModeArray = new Array(); //已选过关方式
var noteCount = 0;
var amount = 0;
var times = 1;
var tag = "";
//加载赛程
function LoadMatchList() {
    try {
        if (isLoading || loadAll) return;
        isLoading = true;

        if (oriSchedule == "") {
            $("#matchList").html("没有可投注赛程，请继续关注159彩票网！");
            loadAll = true;
            //$("#loading").hide();
        }
        else {
            var listContent = oriSchedule.split(/;/gi);
            var nList = SelNames.split(',');
            var cList = SelCodes.split(',');
            var kList = SelKeys.split(',');
            var sclassL = sclass.split(',');
            $("#matchList").html("");
            for (var c = 0; c < listContent.length; c++) {
                var jj = eval("(" + listContent[c] + ")");
                if (jj.ID) {
                    if (sclass != "") {
                        var isS = false;
                        for (var l = 0; l < sclassL.length; l++) {
                            if (jj.sclass == sclassL[l]) {
                                isS = true;
                                break;
                            }
                        }
                        if (!isS) continue;
                    }
					//赛事筛选--是否让球  1就是让球，2就是不让球，其余全部
					if(rqFilterType != "" && typeID == 5){
						if(rqFilterType == "1" && (jj.rq == "0" || jj.rq == "")) continue;
						if(rqFilterType == "2" && jj.rq != "0" && jj.rq != "") continue;
					}
					var oddsHTML = "";
					if(jj.OT!=""){
						var ot = jj.OT.split(',');
						if(ot.length==3 && (typeID == 6 ||typeID == 7 ||typeID == 103 )){
							oddsHTML = "<div class='mo'>"+ot[0]+"</div><div class='mo mi'>"+ot[1]+"</div><div class='mo'>"+ot[2]+"</div>";
						}else if( typeID == 112|| typeID == 114||typeID == 111|| typeID == 113|| typeID == 110){
							if(typeID == 111|| typeID == 113|| typeID == 110){
								oddsHTML = "<div class='mo'>"+ot[1]+"</div><div class='mo'>"+ot[0]+"</div>";
							}else{
								oddsHTML = "<div class='mo'>"+ot[2]+"</div><div class='mo mi'>"+ot[1]+"</div><div class='mo'>"+ot[0]+"</div>";
							}
							
						
						}
						else
							oddsHTML = "<div class='mo'>"+ot.join("</div><div class='mo'>")+"</div>";
					}
					
                    var matchHTML = "";
					var leftTime = "<font class='timeSpn'>"+jj.MID+"<br>"+jj.Time.replace(" ", "<br>")+"</font>";
                    if (typeID == 5 || typeID == 101 || typeID == 105 || typeID == 111 || typeID == 112 || typeID == 114 ) {
                        matchHTML += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"match\">"
							+ "<tr><td rowspan=\"3\" class='matchL'><div style=\"background-color:" + jj.color + ";\" class=\"Sclass Fillet\">" + jj.sclass + "</div>"
							+ leftTime + "</td>";
							if(typeID == 111 || typeID == 112|| typeID == 114|| typeID == 113){
								matchHTML+= "<td> " + jj.guest + " " + (typeID >= 110 || jj.rq == "0" ? "VS" : "<span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + "</span>") +"" + jj.home + " (<font color=red>主</font>)</td>";
							}else{
								matchHTML+= "<td>" + jj.home + " " + (typeID >= 110 || jj.rq == "0" ? "VS" : "<span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + "</span>") + " " + jj.guest + "</td>";
							}
						
							matchHTML+=  "<td width='20%'><div class=\"mXi\">"+jj.MID+"</div></td></tr>"
							+"<tr><td>"+oddsHTML+"</td><td class='md'>"+(typeID==112?"亚赔":typeID==114?"大小":"欧赔")+"</td></tr>"
							+ "<tr><td>";
                        for (var l = 0; l < kList.length; l++) {
                            matchHTML += "<div class='mBTN' name='" + jj.ID + "' value='" + (l + 1) + "' n='" + cList[l] + "' onclick='ChooseMatch(this)'>" + nList[l] + "<span class='odds'>"+jj[kList[l]] + "</span></div>";
							if(l==0 && typeID >=112) matchHTML += "<div class='mo'><span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" + jj.rq + "</span></div>"
                        }
                        matchHTML += "</td><td>" + (OddsType == 2 ? "<div class='mDan1' id='D" + jj.ID + "' onclick='ChooseDan(this)'>胆</div>" : "") + "</td></tr></table>";
                    }
					else if(typeID == 100 || typeID == 110)
					{
						matchHTML += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"match\">"
							+ "<tr><td rowspan=\"3\" class='matchL'><div style=\"background-color:" + jj.color + ";\" class=\"Sclass Fillet\">" + jj.sclass + "</div>"
							+ leftTime + "</td>";
							if(typeID ==110){
								matchHTML+= "<td> " + jj.guest + " " + (typeID >= 110 || jj.rq == "0" ? "VS" : "<span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + "</span>") +"" + jj.home + " (<font color=red>主</font>)</td>";
							}else{
								matchHTML+="<td>" + jj.home + " "+(typeID == 110 || jj.rq == "0" ? "VS" : "<span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + "</span>")+" " + jj.guest + "</td>";
							}
							
							matchHTML+= "<td width='20%'><div class=\"mXi\">"+jj.MID+"</div></td></tr>"
							+"<tr><td>"+oddsHTML+"</td><td class='md'>欧赔</td></tr>"
							+ "<tr><td><div class='btn' style='width:150px' id='op_" + jj.ID + "' onclick='openC(" + jj.ID + ")'>展开投注选项</div></td>"
							+ "<td>" + (OddsType == 2 ? "<div class='mDan1' id='D" + jj.ID + "' onclick='ChooseDan(this)'>胆</div>" : "") + "</td></tr>";
						matchHTML += "<tr id='ch_" + jj.ID + "' class='chooseL' style='display:none;'><td colspan='3'>";
						if(typeID == 100)//3 + 31 + 8 + 9
						{
							//比分的主胜 平 主负
							var rqSpfHTML = "",spfHTML="",jqsHTML="",bqcHTML="",sHTML = "",pHTML = "",fHTML = "";
							for (var l = 0; l < kList.length; l++) {
								var subHTML = "<div{add} class='mBTN' name='" + jj.ID + "' value='" + (l + 1) + "' n='" + cList[l] + "' onclick='ChooseMatch(this)'>" + nList[l] + "<br><span class='odds'>" + jj[kList[l]] + "</span></div>";
								if (l>=3&&l<3+31) {
									var subL = nList[l].replace(/胜其.+/gi, "1:0").replace(/平其.+/gi, "0:0").replace(/负其.+/gi, "0:1").split(':');
									if (parseInt(subL[0]) > parseInt(subL[1])) sHTML += subHTML.replace("{add}", " style='color:red;' ");
									else if (parseInt(subL[0]) == parseInt(subL[1])) pHTML += subHTML.replace("{add}", " style='color:blue;' ");
									else fHTML += subHTML.replace("{add}", " style='color:green;' ");
								}
								else
								{
									if(l<3) rqSpfHTML += subHTML.replace("{add}", " style='height:28px;line-height:28px;'").replace("<br>", "");
									else if(l>=3+31 && l<3+31+8) jqsHTML += subHTML.replace("{add}", "").replace("<br>", "球<br>");
									else if(l>=3+31+8 && l<3+31+8+9) bqcHTML += subHTML.replace("{add}", "");
									else if(l>=3+31+8+9 && l<3+31+8+9+3) spfHTML += subHTML.replace("{add}", " style='height:28px;line-height:28px;'").replace("<br>", "");
								}
							}
							if (rqSpfHTML != "" && parseFloat(jj["wl3"])>0 && jj["wlStop"] == 0) 
								matchHTML += "<div class='hunheType'><span style='font-size:12px;'>让球<span style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + "</span></span>" + rqSpfHTML + "</div>";
							if (spfHTML != "" && parseFloat(jj["sf3"])>0 && jj["sfStop"] == 0) 
								matchHTML += "<div class='hunheType'><span style='font-size:12px;'>胜平负</span>" + spfHTML + "</div>";
							if (jqsHTML != "" && parseFloat(jj["t0"])>0 && jj["tStop"] == 0) 
								matchHTML += "<div class='hunheType'>" + jqsHTML + "</div>";
							if (bqcHTML != "" && parseFloat(jj["ht33"])>0 && jj["htStop"] == 0) 
								matchHTML += "<div class='hunheType'>" + bqcHTML + "</div>";
							if (sHTML != "" && parseFloat(jj["sw10"])>0 && jj["sStop"] == 0) 
								matchHTML += "<div class='hunheType'>"+sHTML+pHTML+fHTML+"</div>";
						}
						else//2 + 2 + 12 + 2
						{
							var sfHTML = "",rfHTML="",dxHTML="",sfcHTML = "";
							for (var l = 0; l < kList.length; l++) {
								var subHTML = "<div{add} class='mBTN' name='" + jj.ID + "' value='" + (l + 1) + "' n='" + cList[l] + "' onclick='ChooseMatch(this)'>" + nList[l] + "<br><span class='odds'>" + jj[kList[l]] + "</span></div>";
								if (l<2) {
									sfHTML += subHTML.replace("{add}", " style='height:28px;line-height:28px;'").replace("<br>", "");
								}
								else if (l>=2&&l<2+2) {
									rfHTML += subHTML.replace("{add}", " style='height:28px;line-height:28px;'").replace("<br>", "");
									if(l==2)
										rfHTML += "<div class='mo'><span style='color:" + (jj.rf.indexOf("-") == -1 ? "red" : "green") + "'>" + jj.rf + "</span></div>"
								}
								else if (l>=2+2+12) {
									dxHTML += subHTML.replace("{add}", " style='height:28px;line-height:28px;'").replace("<br>", "");
									if(l==2+2+12)
										dxHTML += "<div class='mo'><span style='color:" + (jj.zf.indexOf("-") == -1 ? "red" : "green") + "'>" + jj.zf + "</span></div>"
								}
								else
								{
									sfcHTML += subHTML.replace("{add}", " style='font-size:14px;'");
								}
							}
							if (sfHTML != "" && parseFloat(jj["wl3"])>0 && jj["wlStop"] == 0)
								matchHTML += "<div class='hunheType'>" + sfHTML + "</div>";
							if (rfHTML != "" && jj["rf"] != "" && jj["rfStop"] == 0) 
								matchHTML += "<div class='hunheType'>" + rfHTML + "</div>";
							if (dxHTML != "" && jj["zf"] != "" && jj["zfStop"] == 0) 
								matchHTML += "<div class='hunheType'>" + dxHTML + "</div>";
							if (sfcHTML != "" && parseFloat(jj["w1_5"])>0 && jj["fcStop"] == 0) 
								matchHTML += "<div class='hunheType'>" + sfcHTML + "</div>";
						}
						
						matchHTML += "</td></tr></table>";
					}
                    else {
                        matchHTML += "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"match\">"
							+ "<tr><td rowspan=\"3\" class='matchL'><div style=\"background-color:" + jj.color + ";\" class=\"Sclass Fillet\">" + jj.sclass + "</div>"
							+ leftTime + "</td>";
							if(typeID == 113){
								matchHTML +=  "<td>" + jj.guest + " VS " + jj.home + "(<font color=red>主</font>)</td>";
							}else{
								matchHTML +=  "<td>" + jj.home + " VS " + jj.guest + "</td>";
							}
							
							matchHTML +=  "<td width='20%'><div class=\"mXi\">"+jj.MID+"</div></td></tr>"
							+"<tr><td>"+oddsHTML+"</td><td class='md'>"+(typeID==103|| typeID==6|| typeID==7?"大小":"欧赔")+"</td></tr>"
							+ "<tr><td><div class='btn' style='width:150px' id='op_" + jj.ID + "' onclick='openC(" + jj.ID + ")'>展开投注选项</div></td>"
							+ "<td>" + (OddsType == 2 ? "<div class='mDan1' id='D" + jj.ID + "' onclick='ChooseDan(this)'>胆</div>" : "") + "</td></tr>";

                        matchHTML += "<tr id='ch_" + jj.ID + "' class='chooseL' style='display:none;'><td colspan='3'>";
                        var sHTML = ""; //主胜
                        var pHTML = ""; //平
                        var fHTML = ""; //主负
                        var nHTML = "";
                        for (var l = 0; l < kList.length; l++) {
                            var subHTML = "<div{add}"+(typeID == 113?" style='font-size:14px;'":"")+" class='mBTN' name='" + jj.ID + "' value='" + (l + 1) + "' n='" + cList[l] + "' onclick='ChooseMatch(this)'>" + nList[l] +(typeID == 103 || typeID == 6?"球":"")+ "<br><span class='odds'>" + jj[kList[l]] + "</span></div>";
                            if (typeID == 8 || typeID == 102) {
                                var subL = nList[l].replace(/胜其.+/gi, "1:0").replace(/平其.+/gi, "0:0").replace(/负其.+/gi, "0:1").split(':');
                                if (parseInt(subL[0]) > parseInt(subL[1])) sHTML += subHTML.replace("{add}", " style='color:red;' ");
                                else if (parseInt(subL[0]) == parseInt(subL[1])) pHTML += subHTML.replace("{add}", " style='color:blue;' ");
                                else fHTML += subHTML.replace("{add}", " style='color:green;' ");
                            }
                            else nHTML += subHTML.replace("{add}", "");
                        }
                        if (sHTML != "") matchHTML += "<div>" + sHTML + "</div>";
                        if (pHTML != "") matchHTML += "<div>" + pHTML + "</div>";
                        if (fHTML != "") matchHTML += "<div>" + fHTML + "</div>";
                        if (nHTML != "") matchHTML += "<div>" + nHTML + "</div>";
                        matchHTML += "</td></tr></table>";
                    }
                    $("#matchList").append(matchHTML);
                    lastID = jj.ID;

                    matchArray.push(jj);
                }
            }
            loadAll = true;
			
			$(".matchL").each(function(index){
				$(this).live("click",function(){
					$(this).find("span").each(function(idx){
						var isHid = $(this).is(":hidden");
						$(this).hide();
						if(isHid) $(this).show();
						else $(this).hide();
					});
				});
			});
        }
        isLoading = false;
    } catch (e) { showTips(e.message); }
}
//选号
function ChooseMatch(obj) {
    var n = $(obj).attr("name").toString();
    if (obj.className == "mBTN") {
        obj.className = 'mBtnCheck';
        //<DIV class="mBtnCheck" n="1" value="2" name="182051">平2.95</DIV>
        var isNew = true;
        for (var i = 0; i < chooseArray.length; i++) {
            var curL = chooseArray[i];
            if (curL[0] == n) {
                curL[1] = ("," + curL[1] + ",").replace("," + $(obj).attr("value").toString() + ",", ",").replace(/(^,)|(,$)/gi, "");
                curL[1] += (curL[1] == "" ? "" : ",") + $(obj).attr("value").toString();
                if (byID("op_" + n)) byID("op_" + n).innerHTML = "已选" + curL[1].split(',').length + "项";
                isNew = false;
                break;
            }
        }
        if (isNew) {
            if (typeID >= 100 && chooseArray.length >= 10) {
                showTips("不能超过" + (typeID >= 100 ? "10" : "15") + "场！");
                obj.className = 'mBTN';
                return;
            }
            chooseArray.push([n, $(obj).attr("value").toString(), '0']);
            if (byID("op_" + n)) byID("op_" + n).innerHTML = "已选1项";
        }
    }
    else {
        obj.className = 'mBTN';
        for (var i = 0; i < chooseArray.length; i++) {
            var curL = chooseArray[i];
            if (curL[0] == n) {
                curL[1] = ("," + curL[1] + ",").replace("," + $(obj).attr("value").toString() + ",", ",").replace(/(^,)|(,$)/gi, "");
                if (curL[1] == "") {
                    chooseArray.splice(i, 1);
                    if (byID("op_" + n)) byID("op_" + n).innerHTML = "展开投注选项";
                }
                else if (byID("op_" + n)) byID("op_" + n).innerHTML = "已选" + curL[1].split(',').length + "项";
                break;
            }
        }
    }

    if (OddsType == 2 && (byID("D" + n).className == "mDan1" && obj.className == 'mBtnCheck' || byID("D" + n).className != "mDan1" && obj.className == 'mBTN')) {
        if (obj.className == 'mBtnCheck') byID("D" + n).className = "mDan";
        else {
            var list = byName(n);
            var c = true;
            for (var i = 0; i < list.length; i++) {
                if (byID("D" + n).className == "mDan1" && list[i].className == "mBtnCheck") {
                    byID("D" + n).className = "mDan";
                    break;
                }
                if (byID("D" + n).className != "mDan1" && list[i].className == 'mBtnCheck') {
                    c = false;
                    break;
                }
            }
            if (c && byID("D" + n).className != "mDan1") byID("D" + n).className = "mDan1";
        }
    }
    CountLot();
}
//选胆
function ChooseDan(obj) {
    if (obj.className == "mDan1") return;
    if (obj.className == "mDan") obj.className = 'mDanCheck';
    else if (obj.className == "mDanCheck") obj.className = 'mDan';

    for (var i = 0; i < chooseArray.length; i++) {
        var curL = chooseArray[i];
        if ("D" + curL[0] == obj.id) {
            curL[2] = (obj.className == 'mDanCheck' ? "1" : "0");
            isNew = false;
            break;
        }
    }
    CountLot();
}
//计算投注信息
function CountLot() {
    //showTips(chooseArray.join("<br>"));
	if(typeID == 100 || typeID == 110)
	{
		MaxMatch = 8;
        for (var i = 0; i < chooseArray.length; i++) {
			var cList = chooseArray[i][1].split(",");
			for(var k=0;k<cList.length;k++)
			{
				var y = cList[k].toInt();
				if(typeID == 100)
				{
					if(y>=4 && y<=34)
					{
						MaxMatch = Math.min(4,MaxMatch);
					}
					//竞彩进球数
					else if(y>=35 && y<=42)
					{
						MaxMatch = Math.min(6,MaxMatch);
					}
					//竞彩半全场
					else if(y>=43&& y<=3+31+8+9)
					{
						MaxMatch = Math.min(4,MaxMatch);
					}
				}
				else
				{
					//篮球胜分差
					if(y>=5 && y<=16)
					{
						MaxMatch = Math.min(4,MaxMatch);
					}
				}
			}
			if(MaxMatch == 4) break;
        }
	}
	
    var html = "";
    if (chooseArray.length > 0 && OddsType == 2) {
        var oriC = "";
        var list = byName("cbxPassMode");
        for (var i = 0; i < list.length; i++) {
            if (list[i].checked) oriC += "," + list[i].value;
        }
        var danNum = 0; //胆个数
        for (var i = 0; i < chooseArray.length; i++) {
            if (chooseArray[i][2] == "1") danNum++;
        }
        if (typeID <= 9 && chooseArray.length <= 15 || typeID >= 100 && chooseArray.length <= 10) {
            if ((typeID==102 || typeID==113 || typeID >= 5 && typeID <= 9) && danNum <= 1) {
                html = "<label><INPUT name=\"cbxPassMode\" value=\"P1_1\" type=\"checkbox\" onclick=\"calcLot();\"" + (oriC.indexOf("P1_1") != -1 ? " checked " : "") + ">单关</LABEL>"
            }
            for (var i = Math.max(2, danNum); i <= Math.min(MaxMatch, chooseArray.length); i++) {
                html += "<label><INPUT name=\"cbxPassMode\" value=\"P" + i + "_1\" type=\"checkbox\" onclick=\"calcLot();\"" + (oriC.indexOf("P" + i + "_1") != -1 ? " checked " : "") + ">" + i + "串1</LABEL>";
            }
        }
    }
    else if (OddsType == 1) html = "<label><INPUT name=\"cbxPassMode\" value=\"P1_1\" type=\"radio\" onclick=\"calcLot();\" checked>单关</LABEL>"
    $("#passModeList").html(html == "" ? "请选择" + (typeID <= 9 ? "1-15" : "2-10") + "场投注，已选" + chooseArray.length + "场" : html);

    //$("#footPreView").html(chooseArray.length>0?"共选择"+chooseArray.length+"场":"请选择投注内容");
    calcLot();
}
//计算
function calcLot() {
    noteCount = 0;
    times = parseInt(byID("preTimes").value);
    var passModeList = byName("cbxPassMode");
    passModeArray = new Array();
    for (var i = 0; i < passModeList.length; i++) {
        if (passModeList[i].checked) passModeArray.push(passModeList[i].value);
    }

    for (var i = 0; i < passModeArray.length; i++) {
        noteCount += SinglePassModeCount(passModeArray[i], chooseArray);
    }

    amount = (noteCount * times * 2);
    byID("hidAmount").value = amount;
    byID("preMoney").innerHTML = "金额：(" + chooseArray.length + "场)" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
}
var kind=2;
//预览
function prebuy(preKind) {
    tag = "";
    if (noteCount > 0) {
		kind = preKind;
        times = parseInt(byID("preTimes").value); //倍数
        var typeName = byID("hidTypeName").value;
		var err = "";
        var passmode = passModeArray.join(",");
        if (times < 1 || times > 99999) err += "倍数必须是1和99999之间的整数\r\n";
        if (err != "") {
            showTips(err);
            return;
        }
        var html = "";
        var nList = SelNames.split(',');
        var cList = SelCodes.split(',');
        var kList = SelKeys.split(',');
        for (var i = 0; i < chooseArray.length; i++) {
            for (var k = 0; k < matchArray.length; k++) {
                if (matchArray[k].ID == chooseArray[i][0]) {
                	if(typeID == 111 || typeID == 112|| typeID == 114|| typeID == 113|| typeID == 110){
                		html += "<div class='preM1'>" + matchArray[k].guest + (matchArray[k].rq == "0" ? " VS " : "(<span style='color:" + (matchArray[k].rq.toInt() > 0 ? "red" : "green") + "'>" + matchArray[k].rq + "</span>)") + matchArray[k].home + "</div>";
                	}else{
                		html += "<div class='preM1'>" + matchArray[k].home + (matchArray[k].rq == "0" ? " VS " : "(<span style='color:" + (matchArray[k].rq.toInt() > 0 ? "red" : "green") + "'>" + matchArray[k].rq + "</span>)") + matchArray[k].guest + "</div>";
                	}
                	
                    break;
                }
            }
            html += "<div class='preM2'>";
            var subChoose = chooseArray[i][1].split(',');
            subChoose.sort(sortArrayAsc);
            for (var k = 0; k < subChoose.length; k++) {
				if(typeID == 100)
				{
					var itmeValue = subChoose[k].toInt();
					html += "<a class='preC'>" + (itmeValue<=3?"让球":"") + nList[itmeValue - 1]+(itmeValue>=3+31 && itmeValue<3+31+8?"球":"") + "</a>  ";
				}
				else
					html += "<a class='preC'>" + nList[subChoose[k].toInt() - 1]+(typeID == 6 || typeID == 103?"球":"") + "</a>  ";
            }
            if (chooseArray[i][2] == "1") html += "<a class='preD'>胆</a>"
            html += "</div>";
        }

        html += "<div class='preB'>" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元<br>过关：" + passmode.replace(/P1_1/gi, "单关").replace(/P(\d+)_(\d+)/gi, "$1串$2");
		if(kind == 4)
		{
			html += "<section>认购：<input value=\"\" type=\"number\" maxLength=\"7\" size=7  id=\"preMasterBuy\" onchange='IsNum(this,\"mbPer\")'>元<span id='mbPer'>(0%)</span></section>"
				+ "<section>保底：<input value=\"\" type=\"number\" maxLength=\"7\" size=7  id=\"preBaoDi\" onchange='IsNum(this,\"bdPer\")'>元<span id='bdPer'>(0%)</span></section>"
				+ "<section>提成：<SELECT id='preDeduct'><OPTION selected='' value='0'>0%</OPTION><OPTION value='1'>1%</OPTION><OPTION value='2'>2%</OPTION><OPTION value='3'>3%</OPTION><OPTION value='4'>4%</OPTION><OPTION value='5'>5%</OPTION><OPTION value='6'>6%</OPTION><OPTION value='7'>7%</OPTION><OPTION value='8'>8%</OPTION><OPTION value='9'>9%</OPTION><OPTION value='10'>10%</OPTION></SELECT></section>"
				+ "<div>保密：<select id='preSecret'><option value='0'>完全公开</option><option value='1'>截止公开</option><option value='2'>针对跟单人公开</option><option value='3'>截止对跟单人公开</option></select></div>";
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
		if($("#passModeList").html().indexOf("请选择")==-1) showTips("请选择过关方式！");
        else showTips("请正确选择投注内容！");
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
	
	var name ="手机代购";
	var desc ="手机代购";
	var isopen = 0;
	var rate = 0;
	var selfbuy = 1;
	var baodi = 0;
	var type =0;
	var err = "";
	if (kind == 4) {
        baodi = byID("preBaoDi").value.toInt();
        selfbuy = byID("preMasterBuy").value.toInt();
        rate = parseInt(byID("preDeduct").value);
		isopen =parseInt(byID("preSecret").value);
        if (isNaN(selfbuy)) {
        	 showTips("认购金额不能小于0元");
            return;
        }
        if (selfbuy > amount) {
        	showTips("认购金额不能大于总金额！");
             return;
        }
        if (selfbuy / noteCount < 0.05){
        	showTips("合买认购金额不能小于方案金额的5%");
        	return;
        }
        type= 1;
        desc="手机合买";
        name="手机合买";
        rate = isNaN(rate) ? 0 : rate;
        baodi = isNaN(baodi) ? 0 : baodi;
        if(rate>10 || rate<0){
        	showTips("提成为0-10%！");
            return;
        }
        if (baodi > 0 && baodi < amount * 0.05) {
            noticeInfo("保底金额不能低于方案金额5%！");
            return;
        }
        if (baodi + selfbuy > amount) {
        	showTips("认购份金额与保底金额的总和不能大于方案金额！");
            return;
        }
	}
	if (err != "") {
		showTips(err);
		return;
	}
	var gid = $("#gid").val();
	var param = "gid="+gid+"&source=100" +
			"&codes="+encodeURIComponent(getXcode(chooseArray,gid))+"&fflag=0&bnum="+selfbuy+"&muli="+times+"&comeFrom=" +
			"&name="+name+"&desc="+desc+"&play=1&money="+amount+"&tnum="+amount+"&oflag="+isopen+"&type="+type+"&pnum="+baodi+"&wrate="+rate;
	if(gid >= '85' && gid <= '89'){
		param += "&pid="+salePeriod;
	}
    $.ajax({
	     cache: false,
	     type: "POST",
	     url:  $_trade.url.jcast,
	     dataType:'json',
	     data: param,
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
	     error: function() {
	    	 showTips('网络异常!');
	     }
	 });
}
function getXcode(mdata,gid){
   var mitem = [];
   var ditem = [];
   var codes = SelX.split(",");
   var pass = passModeArray.join(",").replace(/P(\d+)_(\d+)/gi, "$1*$2");
   for(var i =0;i<mdata.length;i++){
	   var arr = [];
	   var m = mdata[i];
	   var isdan = m[2];
	   var c = [];
	   arr = m[1].split(",");
	   var s="=", a="/";
	   if(gid == 70 || gid == 71){
		   var ost = 70;
		   var hr = [[],[],[],[],[]];
		   var pos = [3,34,42,51,2,4,16,18];
		   for(var r in arr){
			   var v = parseInt(arr[r]);
			   var off = parseInt(gid) - ost;
			   if(v<=pos[0 + off*4]){
				   hr[0].push(codes[v-1]);
			   }else if(v>pos[0 + off*4] && v<=pos[1 + off*4]){
				   hr[1].push(codes[v-1]);
			   }else if(v>pos[1 + off*4] && v<=pos[2 + off*4]){
				   if(off==0){
					   hr[3].push(codes[v-1]);
				   }else{
					   hr[2].push(codes[v-1]);
				   }
			   }else if(v>pos[2 + off*4] && v<=pos[3+off*4]){
				   if(off==0){
					   hr[2].push(codes[v-1]);
				   }else{
					   hr[3].push(codes[v-1]);
				   }
			   }else if(v>pos[3 + off*4]){
				   if(off==0){
					   hr[4].push(codes[v-1]);
				   }
			   }
		   }
		   var gs = [[72, 91, 92, 93, 90],[94, 95, 96, 97]];
		   for(var k = 0; k < hr.length; k++){
			   if(hr[k].length > 0){
				   c.push(getJcPrefix("" + gs[parseInt(gid)-ost][k])+s+hr[k].join(a));
			   }
		   }
		   s = ">"; a = "+";
	   } else {
		   for(var n = 0; n < arr.length; n++){
			   c.push(codes[parseInt(arr[n])-1]);
		   }
	   }
	   if(isdan==1){
		   ditem.push(m[0]+s+c.join(a));
	   } else {
		   mitem.push(m[0]+s+c.join(a));
	   }
   }
   var code = mitem.join(",");
   if(ditem.length>0){
	   code =ditem.join(",")+"$"+code;
   }
   
   return getJcPrefix(gid)+"|"+code+"|"+pass;
}

$(".yellow").click(function() {
    if ($(this).hasClass("switchOn")) {
        $(".closeR").click();
        return;
    }
    closeLogin();
    $("#spnPanelTitle").html($(this).text());
    var txt = $(this).text();
    $(".yellow").each(function(index) {
        if ($(this).text() == txt) $(this).removeClass("switchOff").removeClass("switchOn").addClass("switchOn");
        else $(this).removeClass("switchOn").removeClass("switchOn").addClass("switchOff");
    });
    if ($(this).text().indexOf("玩法") != -1) {
        $(".filterContent").hide();
        $(".switchWF").show();
    }
    else {
        $(".filterContent").show();
        $(".switchWF").hide();
    }
    if ($('#Filter_Panel').is(':hidden')) {
        if (!$('filterContent').is(':hidden')) DisplayFilter();
        $('#Filter_Panel').css("top", ($(this).position().top + $(this).height()) + "px");
        $('#Filter_Panel').slideDown('fast');
    }
    //else $('#Filter_Panel').slideUp('fast');

    return false;
});

setTimeout("LoadMatchList();$('body').append('<div></div>'); ", 1);

/**页面数据显示**/
//全清
function ReChoose() {
    ReloadInit();
    LoadMatchList();
}
function DisplayFilter() {
    if (allSclass) {
        if ($(".filterContent").html().indexOf("加载中") != -1) {
            $(".filterContent").html("");
			if(typeID == 5 && allRq.length>=2)
			{
				//allRq
				var totalRQ = parseInt(allRq[0]);
				var rqNum = parseInt(allRq[1]);
				$(".filterContent").append("<a href='#' class='btnC' style='font-size:12px;' name='rqFilter' value='' onclick='return rqFilter(this)'>全部(" + totalRQ + ")" + "</a>");
				$(".filterContent").append("<a href='#' class='btn' style='font-size:12px;' name='rqFilter' value='1' onclick='return rqFilter(this)'>让球(" + rqNum + ")" + "</a>");
				$(".filterContent").append("<a href='#' class='btn' style='font-size:12px;' name='rqFilter' value='2' onclick='return rqFilter(this)'>不让球(" + (totalRQ-rqNum) + ")" + "</a>");
				$(".filterContent").append("<div style='width:100%;height:1px;border-bottom:1px dotted #ccc;'>");
			}
            for (var i = 0; i < allSclass.length; i++) {
                if (allSclass[i] == "") continue;
                var subS = allSclass[i].split('_')
                $(".filterContent").append("<a href='#' class='btnC' style='font-size:12px;' name='sclass' value='" + subS[0] + "' onclick='return filterC(this)'>" + subS[0] + "(" + subS[1] + ")" + "</a>");
            }
            $(".filterContent").append("<div style='background:#FFF8C1;text-align:center;padding-bottom:10px;'><div class='btn001 Fillet' onclick='chooseAllF(false)'>全清</div><div class='btn001 Fillet' onclick='chooseAllF(true)'>全选</div><div class='btn001 Fillet' onclick='FilterSubmit()'>确定</div></div>");
        }
    }
}
function filterC(obj) {
    if (obj.className == "btn") obj.className = "btnC";
    else obj.className = "btn";
    return false;
}
function chooseAllF(ischoose) {
    var list = byName("sclass");
    for (var i = 0; i < list.length; i++) {
        list[i].className = (ischoose ? "btnC" : "btn");
    }
}
function rqFilter(obj) {
	if (obj.className == "btnC") return false;
	var list = byName("rqFilter");
	for (var i = 0; i < list.length; i++) {
        list[i].className = "btn";
    }
    obj.className = "btnC";
	rqFilterType = obj.getAttribute("value");
    return false;
}
function FilterSubmit() {
    var sclassL = new Array();
    var list = byName("sclass");
    for (var i = 0; i < list.length; i++) {
        if (list[i].className == "btnC") sclassL.push(list[i].getAttribute("value").toString());
    }
    sclass = sclassL.join(",");
    ReloadInit();
    $('#Filter_Panel').slideUp('fast');
    if (sclass != "") LoadMatchList();
    else sclass = "没有";
}

function ReloadInit() {
    lastID = "";
    loadAll = false;
    isLoading = false;
    matchList = new Array();
    chooseArray = new Array();
    passModeArray = new Array();
    noteCount = 0;
    amount = 0;
    $("#matchList").html("");
    $("#loading").show();
    CountLot();
}
//展开投注项
function openC(id) {
    var c = byID("ch_" + id);
    var oriDisplay = c.style.display;
    c.style.display = (oriDisplay == "none" ? "" : "none");
    byID("op_" + id).className = (oriDisplay == "none" ? "btnC openC" : "btn");
}
