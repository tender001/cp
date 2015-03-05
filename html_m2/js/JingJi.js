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
                    var newmatchHTML = "";
                    jj.guest=jj.guest.substr(0,5);
                    jj.home=jj.home.substr(0,5);
					var leftTime = "<font class='timeSpn'>"+jj.MID+"<br>"+jj.Time.replace(" ", "<br>")+"</font>";
                    if (typeID == 5 || typeID == 101 || typeID == 105 || typeID == 111 || typeID == 112 || typeID == 114 ) {
                    	
                        	if(typeID == 111 || typeID == 112|| typeID == 113){
                        		newmatchHTML+='<ul class="sfcxs"> <li><em>'+jj.MID+'</em>'
                        			+'<p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite></li>'
                        			+'<li><p class="spfzpk spfzpk2">'
                        			+'<span onclick="ChooseMatch(this)" n="0" value="1" name="'+jj.ID+'"><em>'+ jj.guest +'</em><cite>胜</cite></span>'
                        			+'<b>VS</b>'
                        			+'<span onclick="ChooseMatch(this)" n="3" value="2" name="'+jj.ID+'"><em>'+ jj.home +''+ ( jj.rq == "0" ? "" : "<i style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>(" +(jj.rq.indexOf("-") == -1 ? "" : "")+ jj.rq + ")</i>") +'</em><cite>胜</cite></span></p>'
                        			+'<p class="spfpl"><span>赔率'+ jj[kList[0]] +'</span><span>赔率'+ jj[kList[1]] +'</span></p></li></ul>'
                        					
            					
                        	}else if(typeID==114){
                        		newmatchHTML+='<ul class="sfcxs jclqDxf"> <li><em>'+jj.MID+'</em>'
                    			+'<p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite></li>'
                    			+'<li><p class="spfzpkNum">'
                    			+'<span >'+ jj.guest +'</span>'
                    			+'<span class="spfvs">VS</span>'
                    			+'<span >'+ jj.home +'</span></p>'
                    			+'<p class="spfzpk"><span onclick="ChooseMatch(this)" n="1" value="1" name="'+jj.ID+'">总分&gt;'+jj.rq+'</span>'
                    			+'<span onclick="ChooseMatch(this)" n="0" value="2" name="'+jj.ID+'">总分&lt;'+jj.rq+'</span></p>'
                    			+'<p class="spfpl"><span>赔率'+ jj[kList[0]] +'</span><span>赔率'+ jj[kList[1]] +'</span></p></li></ul>'
                        	}else{
                        		newmatchHTML += '<div class="tz">'
                                	+'<section class="tz-list">'
                                	+'<p class="list-l"><em>'+jj.MID+'</em><cite style="color:'+ jj.color +'">'+ jj.sclass +'</cite><i>'+jj.Time.split(" ")[1]+'截止</i></p>'
                                	+'<ul class="list-r">'
	                        		+'<li class="tz-true"><em onclick="ChooseMatch(this)" n="3" value="1" name="'+jj.ID+'">'+ jj.home +''+ (typeID >= 110 || jj.rq == "0" ? "" : "<i style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>(" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + ")</i>") +'<br>胜</em><span>赔率'+jj[kList[0]]+'</span></li>'
	            					+'<li class="tz-true tz-true-middle" ><em onclick="ChooseMatch(this)" n="1" value="2" name="'+jj.ID+'">vs<br>平</em><span>赔率'+jj[kList[1]]+'</span></li>'
	            					+'<li class="tz-true" ><em onclick="ChooseMatch(this)" n="0" value="3" name="'+jj.ID+'">'+ jj.guest +'<br>胜</em><span>赔率'+jj[kList[2]]+'</span></li>'
	            					+'</ul></section></div>'
                        	}
                    		
                    			
							
                    }
					else if(typeID == 100 || typeID == 110)
					{
					
						if(typeID == 100)//3 + 31 + 8 + 9
						{
							//竞彩足球混投
						

						    newmatchHTML +='<ul class="sfcxs hhzpk">'
						    	+'<li class="li_weige"><em>'+jj.MID+'</em> <p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite></li>'
						    	+'<li>'
						    	+'<p class="spfzpkNum">'
						    	+'<span>'+jj.home+''+"<em style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>(" +(jj.rq.indexOf("-") == -1 ? "+" : "")+ jj.rq + ")</em>"+'</span>'
						    	+'<span class="spfvs">VS</span>'
						    	+'<span>'+jj.guest+'</span></p>'
//						    	onclick="ChooseMatch(this)" n="3" value="1" name="141214001"
						    	if(jj["sfStop"] == 0){
									newmatchHTML +='<p class="spfzpk"><em>非让球</em>'
										+' <span onclick="ChooseMatch(this)" n="3" value="52" name="'+ jj.ID +'">主胜 '+jj.sf3+'</span>'
										+' <span onclick="ChooseMatch(this)" n="1" value="53" name="'+ jj.ID +'">平 '+jj.sf1+'</span>'
										+' <span onclick="ChooseMatch(this)" n="0" value="54" name="'+ jj.ID +'">客胜  '+jj.sf0+'</span>'
								}else{
									newmatchHTML +='<p class="spfzpk"><em>非让球</em>'
										+' <span>-</span>'
										+' <span>未开售</span>'
										+' <span>-</span>'
								}
							    if(jj["wlStop"] == 0){
									newmatchHTML +='<p class="spfzpk"><em class="rq">让球　</em>'
										+' <span  onclick="ChooseMatch(this)" n="3" value="1" name="'+ jj.ID +'">主胜 '+jj.wl3+'</span>'
										+' <span  onclick="ChooseMatch(this)" n="1" value="2" name="'+ jj.ID +'">平  '+jj.wl1+'</span>'
										+' <span  onclick="ChooseMatch(this)" n="0" value="3" name="'+ jj.ID +'">客胜  '+jj.wl0+'</span>'
								}else{
									newmatchHTML +='<p class="spfzpk"><em class="rq">让球　</em>'
										+' <span>-</span>'
										+' <span>未开售</span>'
										+' <span>-</span>'
								}
						    	
							
							
						}
						else//2 + 2 + 12 + 2
						{
							
							//竞彩篮球混投
							
							newmatchHTML +='<ul class="sfcxs hhzpk">'
						    	+'<li class="li_weige"><em>'+jj.MID+'</em> <p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite></li>'
						    	+'<li>'
						    	+'<p class="spfzpk lchhzpk"><em class="rq">让分　</em>'
						    	if(jj["rfStop"] == 0){
						    		newmatchHTML +='<span onclick="ChooseMatch(this)" n="0" value="3" name="'+ jj.ID +'"><b>'+jj.guest+'</b><cite>'+jj.rf0+'</cite></span>'
							    		+'<span onclick="ChooseMatch(this)" n="3" value="4" name="'+ jj.ID +'"><b>'+jj.home+''+"<i style='color:" + (jj.rf.indexOf("-") == -1 ? "red" : "blue") + "'>(" +(jj.rf.indexOf("-") == -1 ? "" : "")+ jj.rf + ")</i>"+'</b><cite>'+jj.rf3+'</cite></span>'
						    	}else{
						    		
						    	}
						    	
							newmatchHTML +='</p>'
								+'<p class="spfzpk lchhzpk"><em>大小分</em>'
								if(jj["zfStop"] == 0){
						    		newmatchHTML +='<span onclick="ChooseMatch(this)" n="1" value="17" name="'+ jj.ID +'"><b>&gt;'+jj.zf+'</b><cite>'+jj.zfd+'</cite></span>'
							    		+'<span onclick="ChooseMatch(this)" n="0" value="18" name="'+ jj.ID +'"><b>&lt;'+jj.zf+'</b><cite>'+jj.zfx+'</cite></span>'
						    	}else{
						    		
						    	}
							newmatchHTML +='</p></li></ul>';
						    
						}
						
						
					}else if(typeID==84){
					var sfgg_pk=[[["足球"],["球"],["#993333"]],[["篮球"],["分"],["#E54227"]],[["冰球"],["球"],["#0099C0"]],[["网球"],["盘"],["#456C89"]],[["羽毛球"],["局"],["#6969E0"]],[["排球"],["局"],["#F57070"]],[["橄榄球"],["分"],["#BA6F30"]],[["曲棍球"],["球"],["#C98810"]],[["乒乓球"],["局"],["#C85B5B"]],[["沙滩排球"],["局"],["#FD91B5"]],[["手球"],["球"],["#339933"]],[["水球"],["球"],["#339933"]]];
					if(jj.stype != undefined)
					{
						$.each(sfgg_pk,function()
				    	{
							if(this[0] == jj.stype)
			    			{
			    				jj.pkunit = this[1];
			    				jj.color = this[2];
			    				
			    			}
			    		});
					}	
					jj.sclass=(jj.sclass).replace("14-15","");
					newmatchHTML+='<ul class="sfcxs"> <li><em>'+jj.MID+'&nbsp;'+jj.stype+'</em>'
            			+'<p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite></li>'
            			+'<li><p class="spfzpk spfzpk2">'
            			+'<span onclick="ChooseMatch(this)" n="0" value="1" name="'+jj.ID+'"><em>'+ jj.home +'</em><cite>'+ ( jj.rq == "0" ? "" : "<i style='color:" + (jj.rq.indexOf("-") == -1 ? "red" : "green") + "'>(" +(jj.rq.indexOf("-") == -1 ? "" : "")+ jj.rq + ""+jj.pkunit+")</i>") +'胜</cite></span>'
            			+'<b>VS</b>'
            			+'<span onclick="ChooseMatch(this)" n="3" value="2" name="'+jj.ID+'"><em>'+ jj.guest +'</em><cite>胜</cite></span></p>'
            			+'<p class="spfpl"><span>赔率'+ ot[0] +'</span><span>赔率'+ ot[1] +'</span></p></li></ul>'
					}else if(typeID ==103){
						newmatchHTML+='<ul class="sfcxs jqzpk"> <li class="li_weige"><em>'+jj.MID+'</em>'
            			+'<p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+'截止</cite><i class="xzup xzdown"></i></li>'
            			+'<li><p class="spfzpkNum">'
            			+'<span >'+ jj.home +'</span><span class="spfvs">VS</span><span>'+ jj.guest +'</span></p>'
            			+'<p class="spfzpk">'
            			+'<span onclick="ChooseMatch(this)" n="0" value="1" name="'+jj.ID+'"><b>0</b><cite>'+jj.t0+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="1" value="2" name="'+jj.ID+'"><b>1</b><cite>'+jj.t1+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="2" value="3" name="'+jj.ID+'"><b>2</b><cite>'+jj.t2+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="3" value="4" name="'+jj.ID+'"><b>3</b><cite>'+jj.t3+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="4" value="5" name="'+jj.ID+'"><b>4</b><cite>'+jj.t4+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="5" value="6" name="'+jj.ID+'"><b>5</b><cite>'+jj.t5+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="6" value="7" name="'+jj.ID+'"><b>6</b><cite>'+jj.t6+'</cite></span>'
            			+'<span onclick="ChooseMatch(this)" n="7" value="8" name="'+jj.ID+'"><b>7+</b><cite>'+jj.t7+'</cite></span>'
            			
            			+'</p></li></ul>'
//            			<ul class="sfcxs jqzpk">
//            	        <li class="li_weige">
//            	            <em>001</em>
//            	            <p style="color:#336600">亚冠</p>
//            	            <cite>14:30 截止</cite>
//            	            <i class="xzup xzdown"></i>
//            	        </li>
//            	        <li><p class="spfzpkNum">
//            	            <span>山东鲁能</span>
//            	            <span class="spfvs">VS</span>
//            	            <span>全北现代</span></p>
//            	            <p class="spfzpk">
//            	                <span><b>0</b><cite>10.00</cite></span><span><b>1</b><cite>4.20</cite></span><span v="2"><b>2</b><cite>3.30</cite></span><span v="3"><b>3</b><cite>3.50</cite></span></p><p class="spfzpk"><span v="4"><b>4</b><cite>5.50</cite></span><span v="5"><b>5</b><cite>9.50</cite></span><span v="6"><b>6</b><cite>18.00</cite></span><span v="7"><b>7+</b><cite>28.00</cite></span>
//            			newmatchHTML+='<ul class="sfcxs jqzpk"><li class="li_weige"><em>001</em><p style="color:#336600">亚冠</p><cite>14:30 截止</cite><i class="xzup xzdown"></i></li>'
            			
					}
                    else {
//
                        matchHTML += "<tr id='ch_" + jj.ID + "' class='chooseL' style='display:none;'><td colspan='3'>";
                        var sHTML = ""; //主胜
                        var pHTML = ""; //平
                        var fHTML = ""; //主负
                        var nHTML = "";
                        for (var l = 0; l < kList.length; l++) {
                            var subHTML = "<span name='" + jj.ID + "' value='" + (l + 1) + "' n='" + cList[l] + "' onclick='ChooseMatch(this)'><strong>" + nList[l] +(typeID == 103 || typeID == 6?"球":"")+ "</strong><em>" + jj[kList[l]] + "</em></span>";
                            if (typeID == 8 || typeID == 102) {
                                var subL = nList[l].replace(/胜其.+/gi, "1:0").replace(/平其.+/gi, "0:0").replace(/负其.+/gi, "0:1").split(':');
                                if (parseInt(subL[0]) > parseInt(subL[1])) sHTML += subHTML.replace("{add}", " style='color:red;' ");
                                else if (parseInt(subL[0]) == parseInt(subL[1])) pHTML += subHTML.replace("{add}", " style='color:blue;' ");
                                else fHTML += subHTML.replace("{add}", " style='color:green;' ");
                            }
                            else nHTML += subHTML.replace("{add}", "");
                        }
                        
                        if (pHTML != "") matchHTML += "<div>" + pHTML + "</div>";
                        if (fHTML != "") matchHTML += "<div>" + fHTML + "</div>";
                        if (nHTML != "") matchHTML += "<div>" + nHTML + "</div>";
                        matchHTML += "</td></tr></table>";
                    	newmatchHTML +='<div id="divop_' + jj.ID + '"><ul class="sfcxs">'
                    		+'<li class="li_weige"><em>'+jj.MID+'</em> <p style="color:'+ jj.color +'">'+ jj.sclass +'</p><cite>'+jj.Time.split(" ")[1]+' 截止</cite><i class="xzup xzdown"></i></li>'
                    		+'<li><p class="spfzpkNum"><span>'+jj.home+'</span><span class="spfvs">VS</span><span>'+ jj.guest +'</span></p>'
                    		+'<p class="spfzpk bfpk"><span ids="op_' + jj.ID + '" onclick="openC(this)">立即投注</span></p></li> </ul>'
                    		+'<section class="bf-fixed" style="display: none;" id="ch_' + jj.ID + '"><div class="bfPop bf_" style="margin-top:-221.5px">'
                    		+'<div class="bfTitle clearfix"><p>'+jj.home+'<span class="right"><em>V</em></span></p> <p><span class="left"><em>S</em></span>'+jj.guest+'</p></div>'
                		newmatchHTML+=typeID == 102?'<div style="height:17rem; overflow:auto">':'<div style=" overflow:auto">';
                		if (sHTML != "") newmatchHTML +=  '<p class="red">'+jj.home+'&nbsp;&nbsp;胜</p><div class="competitions bfcom">'+sHTML +'<div class="clear"></div> </div>';
                    	if (pHTML != "") newmatchHTML +=  '<p class="blue">打平</p><div class="competitions bfcom">'+pHTML +'<div class="clear"></div></div>';
                    	if (fHTML != "") newmatchHTML +=  '<p class="green">'+ jj.guest +'&nbsp;&nbsp;胜</p><div class="competitions bfcom">'+fHTML+' <div class="clear"></div> </div>' ;
                    	if (nHTML != "") newmatchHTML += '<p class="green">［例］胜负：上半场主胜 且 全场主负</p><div class="competitions bfcom">' + nHTML + '<div class="clear"></div></div>';
                    	newmatchHTML+='</div><div class="zfTrue clearfix"><a href="javascript:;" onclick="CbfReone(this)" v="'+jj.ID+'" class="zfqx">取 消</a><a href="javascript:;" onclick="closeC(this)">确 定</a></div></div></section></div>';
                    
                         
                    	
                            
                             
                             
                         
                         
                             
                                 
                                 
                                 
                             
                         
                    
                    }
                    $("#matchList").append(newmatchHTML);
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
    if (obj.className == "") {
        obj.className = 'cur';
        //<DIV class="mBtnCheck" n="1" value="2" name="182051">平2.95</DIV>
        var isNew = true;
        for (var i = 0; i < chooseArray.length; i++) {
            var curL = chooseArray[i];
            if (curL[0] == n) {
                curL[1] = ("," + curL[1] + ",").replace("," + $(obj).attr("value").toString() + ",", ",").replace(/(^,)|(,$)/gi, "");
                curL[1] += (curL[1] == "" ? "" : ",") + $(obj).attr("value").toString();
                if ($("span[ids=op_"+n+"]")) $("span[ids=op_"+n+"]").html( "已选" + curL[1].split(',').length + "项");
                isNew = false;
                break;
            }
        }
        if (isNew) {
            if (typeID >= 100 && chooseArray.length >= 10) {
                showTips("不能超过" + (typeID >= 100 ? "10" : "15") + "场！");
                obj.className = '';
                return;
            }
//            var bets=[]
//            $(obj).parent().parent().find("li").each(function(i,em){
//            	bets.push($(em).find('em'))
//            })
//            if(){}
            chooseArray.push([n, $(obj).attr("value").toString(), '0',(typeID == 102||typeID == 104)?$("#divop_"+n): $(obj).parent().parent()]);
//            addbetinfo($(obj).parent());
            if ($("span[ids=op_"+n+"]")) $("span[ids=op_"+n+"]").html("已选1项");
            $('#betnum').html(chooseArray.length)
        }
    }
    else {
        obj.className = '';
        for (var i = 0; i < chooseArray.length; i++) {
            var curL = chooseArray[i];
            if (curL[0] == n) {
                curL[1] = ("," + curL[1] + ",").replace("," + $(obj).attr("value").toString() + ",", ",").replace(/(^,)|(,$)/gi, "");
                if (curL[1] == "") {
                    chooseArray.splice(i, 1);
                    if ($("span[ids=op_"+n+"]")) $("span[ids=op_"+n+"]").html("立即投注");
                }
                else if ($("span[ids=op_"+n+"]")) $("span[ids=op_"+n+"]").html("已选" + curL[1].split(',').length + "项");
                break;
            }
        }
        $('#betnum').html(chooseArray.length)
    }

//    if (OddsType == 2 && (byID("D" + n).className == "mDan1" && obj.className == 'mBtnCheck' || byID("D" + n).className != "mDan1" && obj.className == '')) {
//        if (obj.className == 'mBtnCheck') byID("D" + n).className = "mDan";
//        else {
//            var list = byName(n);
//            var c = true;
//            for (var i = 0; i < list.length; i++) {
//                if (byID("D" + n).className == "mDan1" && list[i].className == "mBtnCheck") {
//                    byID("D" + n).className = "mDan";
//                    break;
//                }
//                if (byID("D" + n).className != "mDan1" && list[i].className == 'mBtnCheck') {
//                    c = false;
//                    break;
//                }
//            }
//            if (c && byID("D" + n).className != "mDan1") byID("D" + n).className = "mDan1";
//        }
//    }
    CountLot();
}
//确认投注
function betconfirm(){

	var minimum=typeID=="5"?1:2;
	minimum=typeID=="84"?3:minimum;
	if(chooseArray.length<minimum){
		showTips('至少选择'+minimum+'场次投注!');
		return;
	}
	$("#confirmhtml").html("");
	if(typeID=="114"){
		$("#confirmhtml").addClass("jclqDxf");
	}
	$("#buyHeader h1").html($_sys.getlotname($("#gid").val())+"_投注")
    for (var i = 0; i < chooseArray.length; i++) {
		var 
		cList='<ul class="spfNum list-r bqc-tz fn-clearfix" bet="'+chooseArray[i][0]+'"><cite class="errorBg" onClick="Reone('+chooseArray[i][0]+')"><em class="error2"></em></cite>'+ $(chooseArray[i][3]).html()+'</ul>'
		$("#confirmhtml").append(cList)
    }
    showbuy(true);
    
	
}
function payconfirm(){
//	var expect=$("#expect").val();
	var hidTypeName=$("#hidTypeName").val();
	 
     
	$(".tz-pay").html('<p>'+hidTypeName+' </p><p>应付金额<em>'+amount+'</em>元</p>')
	ispay(true);
}
function payhm(ishm){
	if(ishm){
		$("#matchList,#buyFooter1,#szcbuy,#issuc,#content_home").hide();
    	$("#payhm").show();
    	
    	$("#txtLotDesc").val($("#hidTypeName").val()+ "复式合买方案");
//    	prebuy(4);
	}else{
		$("#szcbuy").show();
    	$("#payhm").hide();
	}
	
}
function ispay(ispay){
	if(ispay){
    	$("#matchList,#buyFooter1,#szcbuy,#issuc,#content_home,#payhm").hide();
    	$("#paybet").show();
    }else{
    	$("#content_home").show();
    	$("#paybet,#payhm").hide();
    }
}
function issuc(ispay){
	 if(issuc){
	    	$("#matchList,#buyFooter1,#szcbuy,#paybet,#content_home,#payhm").hide();
	    	$("#issuc").show();
	    }else{
	    	$("#content_home").show();
	    	$("#issuc").hide();
	    }
}
function showbuy(istrue){
    if(istrue){
    	$("#matchList,#buyFooter1,#topHeader,#szcbuy,#paybet,#issuc,#payhm").hide();
    	$("#content_home").show();
    }else{
    	$("#matchList,#buyFooter1,#topHeader").show();
    	$("#content_home,#szcbuy,#paybet").hide();
    }
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
        var list = $("span[gg]");
        for (var i = 0; i < list.length; i++) {
            if ($(list[i]).hasClass("cur")) 
            	oriC += "," + $(list[i]).attr("value");
        }
        var danNum = 0; //胆个数
        var isNewgg=true;
        for (var i = 0; i < chooseArray.length; i++) {
            if (chooseArray[i][2] == "1") danNum++;
        }
//        <span v="2" style="border-top:1px solid #d5d5d5;" class="cur">2串1</span>
        if (typeID <= 9 && chooseArray.length <= 15 || typeID >= 100 && chooseArray.length <= 10) {
            if ((typeID==102 || typeID==113 || typeID >= 5 && typeID <= 9) && danNum <= 1) {
                html += "<span gg="+i+" value=\"P1_1\" style='border-top:1px solid #d5d5d5;'onclick=\"calcLot(this);\"" + (isNewgg? "class=cur " : "")+ " >单关</span>"
                isNewgg=false;
            }
            for (var i = Math.max(2, danNum); i <= Math.min(MaxMatch, chooseArray.length); i++) {
            	html += "<span gg="+i+" value=\"P" + i + "_1\" style='border-top:1px solid #d5d5d5;'onclick=\"calcLot(this);\"" + (isNewgg? "class=cur " : "")+ " >" + i + "串1</span>"
            	isNewgg=false;
            }
        }
        if(typeID==84&& chooseArray.length <= 15){
        	 for (var i = Math.max(3, danNum); i <= Math.min(MaxMatch, chooseArray.length); i++) {
             	html += "<span gg="+i+" value=\"P" + i + "_1\" style='border-top:1px solid #d5d5d5;'onclick=\"calcLot(this);\"" + (isNewgg? "class=cur " : "")+ " >" + i + "串1</span>"
             	isNewgg=false;
             }
        }
    }
    else if (OddsType == 1) html = "<span value=\"P1_1\" style='border-top:1px solid #d5d5d5;'onclick=\"calcLot(this);\"" + (isNewgg? "class=cur " : "")+ ">单关</span>"
    if(chooseArray.length>=2){
    	$("#selectPlay").val("2串1");
    }else{
//    	showTips("请选择" + (typeID <= 9 ? "1-15" : "2-10") + "场投注");
    	$("#selectPlay").val();
    }
	 
    $("#passModeList").html(html);
//    $("#passModeList").html(html == "" ? "请选择" + (typeID <= 9 ? "1-15" : "2-10") + "场投注，已选" + chooseArray.length + "场" : html);

    //$("#footPreView").html(chooseArray.length>0?"共选择"+chooseArray.length+"场":"请选择投注内容");
    calcLot();
}
//计算
function calcLot(obj) {
    if(obj){
    	$(obj).toggleClass("cur");
    }
	noteCount = 0;
    times = parseInt(byID("preTimes").value);
    var passModeList = $("span[gg]");
    if(passModeList===undefined){
    	return;
    }
    var passText=[];
    passModeArray = new Array();
    for (var i = 0; i < passModeList.length; i++) {
        if ($(passModeList[i]).hasClass("cur")){
        	passModeArray.push($(passModeList[i]).attr("value"));
        	passText.push($(passModeList[i]).html());
        } 
       
    }
    $("#selectPlay").val(passText);
//    passModeArray=passModeList
    for (var i = 0; i < passModeArray.length; i++) {
        noteCount += SinglePassModeCount(passModeArray[i], chooseArray);
    }

    amount = (noteCount * times * 2);
    byID("hidAmount").value = amount;
//    byID("preMoney").innerHTML = "金额：(" + chooseArray.length + "场)" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元";
    byID("preMoney").innerHTML ='共<cite class="yellow">'+ noteCount +'</cite> 注<cite class="yellow">￥'+ amount +'</cite>元';
    $("#cpmoney").html(amount);
}
function nocommission(obj){
	var onClass="cur";
	if($(obj).hasClass(onClass)){
		$(obj).removeClass(onClass);
		$("#selectCommission").slideUp();
		$("#commission").val(0);
	}else{
		$(obj).addClass(onClass);
		$("#selectCommission").slideDown();
	}
}
function selectCommission(obj){
	$("#selectCommission li").removeClass("cur");
	$(obj).addClass("cur");
	if(new Number($(obj).attr("v"))>0){
		$("#commission").val($(obj).attr("v"));
	}else{
		$("#commission").val(0);
	}
}

function selectSecrecy(obj){
	$("#selectSecrecy span").removeClass("cur");
	$(obj).addClass("cur");
	if(new Number($(obj).attr("v"))>=0){
		$("#secrecy").val($(obj).attr("v"));
	}
}
function getParsetInt(obj) {
    var varvalue = obj.value;
    if (isNaN(varvalue) || varvalue.indexOf(".") != -1 || varvalue == "0")
        obj.value = "";
}



function updatePublicBuyInfo(baodi) {
    var masterBuy = new Number($("#masterBuy").attr("value"));
    var varAllmoney = new Number(amount);
    var hmbetmoney=0;
    if (masterBuy > 0 && masterBuy <= varAllmoney) {
        $("#masterBuy").attr("value", (masterBuy).toFixed(0));
        $("#masterBuy_percent").html(Math.floor((masterBuy / varAllmoney) * 10000) / 100 + "%");
        hmbetmoney=masterBuy;
       
    } else {
        $("#masterBuy").attr("value", "");
        $("#masterBuy_percent").html("0%");
       
    }

    if (!!$("#baodiAll").attr("checked")) {
       
    }
    if(baodi){
    	if(!$("#baodiAll").hasClass("cur")){
	       $("#baodi").attr("value", varAllmoney - masterBuy);
	       $("#baodiAll").addClass("cur")
	       $("#baodimx").slideDown();
    	}else{
    	   $("#baodiAll").removeClass("cur");
    	   $("#baodi").attr("value", 0);
    	   $("#baodimx").slideUp();
       }
    }
    
    var baodi = new Number($("#baodi").attr("value"));
    if (baodi > 0 && baodi + masterBuy <= varAllmoney) {
        $("#baodi").attr("value", (baodi).toFixed(0));
        $("#baodi_percent").html(Math.floor((baodi / varAllmoney) * 10000) / 100 + "%");
        hmbetmoney+=baodi;
    } else {
        $("#baodi").attr("value", "");
        $("#baodi_percent").html("0%");
    }
    $("#hmbetmoney").html((hmbetmoney).toFixed(0))
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

//        html += "<div class='preB'>" + noteCount + "注×" + times + "倍=<span style='color:red'>￥" + amount + "</span>元<br>过关：" + passmode.replace(/P1_1/gi, "单关").replace(/P(\d+)_(\d+)/gi, "$1串$2");
//		if(kind == 4)
//		{
//			html += "<section>认购：<input value=\"\" type=\"number\" maxLength=\"7\" size=7  id=\"preMasterBuy\" onchange='IsNum(this,\"mbPer\")'>元<span id='mbPer'>(0%)</span></section>"
//				+ "<section>保底：<input value=\"\" type=\"number\" maxLength=\"7\" size=7  id=\"preBaoDi\" onchange='IsNum(this,\"bdPer\")'>元<span id='bdPer'>(0%)</span></section>"
//				+ "<section>提成：<SELECT id='preDeduct'><OPTION selected='' value='0'>0%</OPTION><OPTION value='1'>1%</OPTION><OPTION value='2'>2%</OPTION><OPTION value='3'>3%</OPTION><OPTION value='4'>4%</OPTION><OPTION value='5'>5%</OPTION><OPTION value='6'>6%</OPTION><OPTION value='7'>7%</OPTION><OPTION value='8'>8%</OPTION><OPTION value='9'>9%</OPTION><OPTION value='10'>10%</OPTION></SELECT></section>"
//				+ "<div>保密：<select id='preSecret'><option value='0'>完全公开</option><option value='1'>截止公开</option><option value='2'>针对跟单人公开</option><option value='3'>截止对跟单人公开</option></select></div>";
//				+ "<div>方案描述：<input id=\"txtLotDesc\" name=\"txtLotDesc\" maxlength=\"200\" type=\"text\" size=\"16\" value='" + typeName + "复式合买方案'/></div>";
//		}
//		html += "</div>";


        $("#divPreView").html(html);
        $.ajax({
	        url: $_user.url.checklogin,
	        dataType:'json',
	        type : "POST",
	        success:function (d){
	 			var code = d.Resp.code;
	 			if (code == "0") {
	 				SubmitLot($("#payment"));
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
//	if(!$("#agreement").attr("checked")){
//		showTips("必须同意<<用户合买代购协议>>,才可购买彩票");
//		return;
//	}
	if($(obj).html().indexOf("方案提交中")!=-1) return;
	var oriObjTxt = $(obj).html();
	$(obj).html("方案提交中...")
	setTimeout(function(){$(obj).html(oriObjTxt)},3000);
//	showTips("提交中...");
	
	var name ="手机代购";
	var desc ="手机代购";
	var isopen = 0;
	var rate = 0;
	var selfbuy = 1;
	var baodi = 0;
	var type =0;
	var err = "";
	if (kind == 4) {
        baodi = parseInt($("#baodi").attr("value"));
        selfbuy = parseInt($("#masterBuy").attr("value"));
        rate = $("#commission").attr("value");
		isopen =$("#secrecy").attr("value");;
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
        	showTips("保底金额不能低于方案金额5%！");
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
	if(gid >= '84' && gid <= '89'){
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
			
				$("#cpid").attr("href","/user/project.html?lotid="+gid+"&projid="+projid)
         		issuc(true);
	         }else{
	        	 if(desc.indexOf("余额不足")!=-1){
	        		 showTips("您的余额不足，请去充值!",function(){
	        				clearTimeout(tipsTs);
	        				tipsTs = setTimeout(function(){
	        					window.location.href="/account/pay.html";
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
function Choggtype(){
	 if(chooseArray.length<2){
		 return;
	 }
	var overlayID = "_t_overlay";
	    if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
	    $('.overlay').css({ 'height': ($("body").height()) + 'px','background-color':'rgba(0,0,0,.5)', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();

	    $("#chuan_").css("top", ($(window).height() / 4 ) + "px");
//	    $(window).scroll(function() {
//	        var offsetTop = ($(window).scrollTop() + ($(window).height() - 120) / 4) + "px";
//	        $("#chuan_").animate({ top: offsetTop }, { duration: 300, queue: false });
//	    });
//	   
		$('#chuan_').slideDown('fast');
//	    $('#chuan_').show();
}
//关闭过关层
function closeggtype() {
    $('.overlay').hide();
    $('#chuan_').slideUp('fast');
    $('#chuan_').hide();
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

$(".jc-more").click(function() {
    $(this).children().toggle();
    $(".hmPull").hide();
});
//$("#topHeader h1").click(function() {
//    $("#chowanfa").toggleClass("cur");
//    $(".hmPull").toggle()
//    $(".jc-more cite").hide();
//});

$("#topHeader h1").click(function() {
    if ($(this).hasClass("cur")) {
       
        $('.hmPull').slideUp('fast');
        $(this).removeClass('cur');
        return;
    }
    $(".jc-more cite").hide();
//    closeLogin();
//    $("#spnPanelTitle").html($(this).text());
//    var txt = $(this).text();
//    $(".yellow").each(function(index) {
//        if ($(this).text() == txt) $(this).removeClass("switchOff").removeClass("switchOn").addClass("switchOn");
//        else $(this).removeClass("switchOn").removeClass("switchOn").addClass("switchOff");
//    });
//    if ($(this).text().indexOf("玩法") != -1) {
//        $(".filterContent").hide();
//        $(".switchWF").show();
//    }
//    else {
//        $(".filterContent").show();
//        $(".switchWF").hide();
//    }
    if ($('.hmPull').is(':hidden')) {
    	$(this).addClass('cur');
        $('.hmPull').css("top", ($(this).position().top + $(this).height()) + "px");
        $('.hmPull').slideDown('fast');
    }
    //else $('#Filter_Panel').slideUp('fast');

    return false;
});
LoadMatchList();
//setTimeout("LoadMatchList();$('body').append('<div></div>'); ", 1);

/**页面数据显示**/
//全清
function ReChoose() {
    ReloadInit();
    LoadMatchList();
}
function Reconfirm(){
	$("em[n]").removeClass("cur");
	$("span[n]").removeClass("cur");
	$("#betnum").html(0);
	chooseArray=[];
	CountLot();
}
function Reone(id){
	$("ul[bet="+id+"]").remove();

	for(var ele in chooseArray){    //移除投注页选择的场次（）
		if(chooseArray[ele]===undefined){
			return;
		}
		if(chooseArray[ele][0]==id){
			chooseArray.remove(ele);
		}
		
	}
	CountLot();
	$("#betnum").html(chooseArray.length);
}
function CbfReone(obj){
	$(obj).parent().parent().find("span").removeClass("cur");
	var id= $(obj).attr("v");
	for(var ele in chooseArray){    //移除投注页选择的场次（）
		if(chooseArray[ele]===undefined){
			return;
		}
		if(chooseArray[ele][0]==id){
			chooseArray.remove(ele);
		}
		
	}
	$(obj).parent().parent().parent().slideUp();
	$("span[ids=op_"+id+"]").html("立即投注")
	CountLot();
	
	$("#betnum").html(chooseArray.length);
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
    $("#betnum").html(0);
    $("#loading").show();
    CountLot();
}
//展开投注项
function openC(obj) {
	$(obj).parent().parent().parent().next().slideDown();
   
}
function closeC(obj) {
	$(obj).parent().parent().parent().slideUp();
    
}
