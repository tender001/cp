function byID(id) {
    return document.getElementById(id);
}
function byName(name) {
    return document.getElementsByName(name);
}
function GetCNum(bigNum, smallNum) {
    if (bigNum == 0) return 0;
    var num1 = 1, num2 = 1;
    for (var i = bigNum; i > (bigNum - smallNum); i--) num1 *= i;
    for (var i = 1; i <= smallNum; i++) num2 *= i;
    return num1 / num2;
}
//字符串转换成整型
String.prototype.toInt = function() {
    var rlt = 0;
    try {
        rlt = parseInt(this);
        if (isNaN(rlt)) rlt = 0;
    } catch (e) { }
    return rlt;
};
String.prototype.startWith=function(str){     
	var reg=new RegExp("^"+str);     
	return reg.test(this);        
};
String.prototype.endWith=function(str){     
	var reg=new RegExp(str+"$");     
	return reg.test(this);        
};
//数组排序 升序
function sortArrayAsc(a, b) {
    if (isNaN(a[0])) return a[0].localeCompare(b[0]);
    else return a[0] - b[0];
}
function isPhone(tel){
	var reg = 	/^((13[0-9])|(15[^4,\\d])|(18[0-9])|(14[0-9]))\d{8}$/;
	if(reg.test(tel)){
		return true;
	}
	return false;
}
function isEmail(mai){
	var reg = 	/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
	if(reg.test(mai)){
		return true;
	}
	return false;
}
/**本地存储**/
var hasStorage = window.localStorage;
var Storage = {
    Set: function(key, value) {
        if (hasStorage) localStorage.setItem(key, value);
        else writeCookie(key, value);
    },
    Get: function(key) {
        if (hasStorage) return localStorage.getItem(key);
        else return getCookie(key);
    }
};

var tipsTO=0;
var tipsT;
var tipsTs;
var tipsDiv_01 = "";
function showTips(tips,fn) {
	tipsDiv_01 = '<div class="tipsClass" id="tipsDiv_">' + tips + '</div>';
	$('body').append(tipsDiv_01);
    $('div.tipsClass').css({
        'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
        'left': ($(window).width() - 245) / 2 + "px",
        'border': '2px solid #E6D30A',
        'position': 'absolute',
        'padding': '5px',
        'background': '#FFF588',
        'font-size': '12px',
        'margin': '0 auto',
        'line-height': '25px',
        'z-index': '100',
        'text-align': 'center',
        'width': '250px',
        'color': '#6D270A',
        'opacity': '0.95'
    });
	$('div.tipsClass').click(function(){$(this).hide();});
    $('div.tipsClass').addClass("Fillet");
    $('div.tipsClass').show();
	tipsTO = 3;
	clearTimeout(tipsT);
	tipsT = setTimeout("HidTips()", 1000);
	if(fn!=null && fn!=undefined){
		fn.call(this);
	}
}
var confirmDiv_ = "";
function JQConfirm(msg, eventHdl) {
    if (confirmDiv_ == "") {
        confirmDiv_ = '<div class="confirmClass"><div id="confirmDiv_" style="padding:5px 0px 5px 0px">' + msg + '</div><div><input id="xxxyyyzzz" type=button value="确定" class="btn001" /><input type=button value="取消" onclick="hideConform()" class="btn001" /></div></div>';
        $('body').append(confirmDiv_);
    }else {
        byID("confirmDiv_").innerHTML = msg;
    }
    $("#xxxyyyzzz").unbind("click").bind("click",function(){
    	eval(eventHdl);
    	hideConform();
    });
    $('div.confirmClass').css({
        'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
        'left': ($(window).width() - 245) / 2 + "px",
        'border': '2px solid #528ADF',
        'position': 'absolute',
        'padding': '5px',
        'background': '#B0CAF0',
        'margin': '0 auto',
        'line-height': '25px',
        'z-index': '100',
        'text-align': 'center',
        'width': '250px',
        'color': '#6D270A',
        'opacity': '0.95'
    });
    $('div.confirmClass').addClass("Fillet");
    $('div.confirmClass').show();
}
function hideConform(){$('div.confirmClass').hide();}


function HidTips()
{
	if(tipsTO<=0)
	{
		$('div.tipsClass').fadeOut();
		tipsTO=0;
	}
	else
	{
		tipsTO--;
		tipsT = setTimeout("HidTips()", 1000);
	}
}
//cookie操作
function getCookie(name) {
    var cname = name + "=";
    var dc = document.cookie;
    if (dc.length > 0) {
        begin = dc.indexOf(cname);
        if (begin != -1) {
            begin += cname.length;
            end = dc.indexOf(";", begin);
            if (end == -1) end = dc.length;
            return dc.substring(begin, end);
        }
    }
    return null;
}
function writeCookie(name, value) {
    var expire = "";
    var hours = 365;
    expire = new Date((new Date()).getTime() + hours * 3600000);
    expire = ";path=/;expires=" + expire.toGMTString();
    document.cookie = name + "=" + value + expire;
}
var JC_Config = [];
JC_Config.push([85, "SPF", "bd"]);
JC_Config.push([86, "CBF", "bd"]);
JC_Config.push([87, "BQC", "bd"]);
JC_Config.push([88, "SXP", "bd"]);
JC_Config.push([89, "JQS", "bd"]);
JC_Config.push([90, "SPF", "70"]);
JC_Config.push([91, "CBF", "70"]);
JC_Config.push([92, "BQC", "70"]);
JC_Config.push([93, "JQS", "70"]);
JC_Config.push([94, "SF", "71"]);
JC_Config.push([95, "RFSF", "71"]);
JC_Config.push([96, "SFC", "71"]);
JC_Config.push([97, "DXF", "71"]);
JC_Config.push([70, "HH", "70"]);
JC_Config.push([71, "HH", "71"]);
JC_Config.push([72, "RSPF", "70"]);
function getJcPrefix(gid){
	for(var i = 0; i < JC_Config.length; i++){
		if(JC_Config[i][0] == gid){
			return JC_Config[i][1];
		}
	}
	return null;
}
function getJcPlay(gid, pix){
	for(var i = 0; i < JC_Config.length; i++){
		if(JC_Config[i][1] == pix && JC_Config[i][2] == gid){
			return JC_Config[i][0];
		}
	}
	return null;
}
var PIOPEN = ["对所有人公开","截止后公开","对参与人员公开","截止后对参与人公开"];
var ZHTYPE = ["中奖后不停止","中奖后停止","盈利后停止"];
$_sys.showsource = function (source){
	return source=='100' ? "<img src='/images/iphone.png' alt='手机购彩'/>" : "";
};
var isFunction = (function() {
    return "object"  === typeof document.getElementById ?
       isFunction = function(fn){
            try {
                return /^\s*\bfunction\b/.test("" + fn);
            } catch (x) {
                return false;
            }
       }:
       isFunction = function(fn){
           return "[object Function]" === Object.prototype.toString.call(fn);
       };
})();
pages = function(pn,ps,tp,rc){
	var pi = new Array();
	pi.push('<a href="#" style="margin-right: 5px" onclick="page(1)">首页</a>');
	var ts = pn % ps == 0 ? parseInt(pn / ps)-1: parseInt(pn / ps);
	if(parseInt(pn) > 1){
		pi.push("<a href='#' style='margin-right: 5px' onclick='page(" + (pn - 1) + ")'>上一页</a>");
	}
	for(var k = 0; k < 10; k++){
		var cp = ts * ps + k + 1;
		if(cp <= tp){
			if(cp == pn){
				pi.push("<a href='#' onclick='page(" + cp + ")'><span style='color:red'>" + cp + "</span></a>");
			}else{
				pi.push("<a href='#' onclick='page(" + cp + ")'>" + cp + "</a>");
			}
			pi.push("&nbsp;");
		}
	}
	if(parseInt(pn) < tp){
		pi.push("<a href='#' style='margin-left: 10px' onclick='page(" + (parseInt(pn) + 1) + ")'>下一页</a>");
	}
	pi.push("<a href='#' style='margin-left: 5px' onclick='page(" + tp + ")'>尾页</a>");
	pi.push('<span class="gy">共' + tp + '页,' + rc + '条记录</span>');
	return pi.join("");
};
function getszccodes(vardata,id,pm){
	var g139 = $_sys.get139Gid(id);
	var type = ":1:1"; 
	if(g139 == "03"){
	   if(pm==2){
		   type = ":1:4";
	   }else if(pm==3){
		   type = ":2:3";
	   }else if(pm==4){
		   type = ":2:4";
	   }else if(pm==5){
		   type = ":3:3";
	   }else if(pm==6){
		   type = ":3:4";
	   }
	}else if(g139 == "04"){
		if(pm == 1){
			type = ":5:1";
		} else if(pm == 2){
			type = ":4:1";
		} else if(pm == 3){
			type = ":3:1";
		} else if(pm == 4){
			type = ":1:1";
		} else if(pm == 5){
			type = ":7:1";
		} else if(pm == 6){
			type = ":7:4";
		} else if(pm == 7){
			type = ":12:1";
		} else if(pm == 8){
			type = ":6:1";
		}
	}else if(g139 == "50"){
		var isadd = !!$("#addcount").attr("checked") ? true : false;
		if(isadd){
			type = ":2:1";
		}
	}else if(g139 == "52"){
		type = ":1:1";
	}else if(g139 == "53"){
		if(pm==3){
		   type = ":1:4";
		}else if(pm==5){
		   type = ":2:3";
		}else if(pm==8){
		   type = ":3:3";
		}
	}else if(g139 == "54" || g139 == "56"){
		switch(pm){
		    case 1:
		    	 type = ":1:1";
		    	 break;
		    case 2:
		    	 type = ":2:1";
		    	 break;
		    case 3:
		    	 type = ":11:1";
		    	 break;
		    case 4:
		    	 type = ":9:1";
		    	 break;
		    case 5:
		    	 type = ":3:1";
		    	 break;
		    case 6:
		    	 type = ":12:1";
		    	 break;
		    case 7:
		    	 type = ":10:1";
		    	 break;
		    case 8:
		    	 type = ":4:1";
		    	 break;
		    case 9:
		    	 type = ":5:1";
		    	 break;
		    case 10:
		    	 type = ":6:1";
		    	 break;
		    case 11:
		    	 type = ":7:1";
		    	 break;
		    case 12:
		    	 type = ":8:1";
		    	 break;
		}
	}
	var code =[];
	var cdata =vardata.split(';');
	for(var i=0;i<cdata.length;i++){
		if(g139 == '04'){
			var ctmpc = cdata[i].replaceAll("大", "2").replaceAll("小", "1").replaceAll("单", "5").replaceAll("双", "4");
			code.push(ctmpc+type);
		} else {
			code.push(cdata[i]+type);
		}
	}
	return code.join(";");
}
showszccode = function(gid, codes, type){
	var cs = codes.split(";");
	var carr = [];
	for(var i = 0; i < cs.length; i++){
		var cc = cs[i].split(":");
		if ( type == 0){
			if(gid == 50){
				if(cc[1]=='3'){
					carr.push("[生肖乐]:" + cc[0]);
				}else{
					var ps = cc[0].split("|");
					var dan = "", tuo = ps[0];
					var xdan = "", xtuo = ps[1], html = "";
					if(ps[0].indexOf("$") != -1){
						var pps = ps[0].split("$");
						dan = pps[0];
						tuo = pps[1];
					}
					if(dan.length > 0){
						html += "<span style='color:red'>前区</span> 胆码:[" + dan + "] 拖码:[" + tuo + "]<br/>";
					} else {
						html += "<span style='color:red'>前区</span>:[" + tuo + "]<br/>";
					}
					if(ps[1].indexOf("$") != -1){
						var pps = ps[1].split("$");
						xdan = pps[0];
						xtuo = pps[1];
					}
					if(xdan.length > 0){
						html += "<span style='color:red'>后区</span> 胆码:[" + xdan + "] 拖码:[" + xtuo + "]";
					} else {
						html += "<span style='color:red'>后区</span>:[" + xtuo + "]";
					}
					if(cc[1] == '2'){
						html += "<br/><span style='color:red'>(追加)</span>";
					}
					carr.push(html);
				}
			} else if(cc[0].indexOf("$") == -1 && cc[0].indexOf("|") == -1){
					carr.push(cc[0]);
			} else {
				var ps = cc[0].split("|");
				var dan = "", tuo = ps[0];
				if(ps[0].indexOf("$") != -1){
					var pps = ps[0].split("$");
					dan = pps[0];
					tuo = pps[1];
				}
				if(gid == 81){
					if(dan.length > 0){
						carr.push("胆码:[" + dan + "] 拖码:[" + tuo + "]");
					} else {
						carr.push(tuo);
					}
				} else {
					if(dan.length > 0){
						carr.push("<span style='color:red'>红球</span> 胆码:[" + dan + "] 拖码:[" + tuo + "] <span style='color:blue'>篮球</span>:[" + ps[1] + "]");
					} else {
						carr.push("<span style='color:red'>红球</span>:[" + tuo + "] <span style='color:blue'>篮球</span>:[" + ps[1] + "]");
					}
				}
			}
		} else if(type == 1){
			var pm = $_sys.getSZCP(gid,"K" + cc[1]);
			var cm = $_sys.getcastm(cc[2]);
			if(gid == 4 && cc[1] == 6){
				carr.push("[" + pm + cm + "]" + cc[0].replaceAll("2", "大").replaceAll("1", "小").replaceAll("5", "单").replaceAll("4", "双"));
			} else {
				carr.push("[" + pm + cm + "]" + cc[0]);
			}
		}
	}
	return carr.join("<br/>");
};
function getZCcode(vardata,gid){
	var c = vardata + ":1:1";
	var arr = ["#","#","#","#","#","#","#","#","#","#","#","#","#","#"];
	var codes =  vardata.split(',');
	if(gid == "81"){
		if(vardata.indexOf("d")!=-1){
			for(var i = 0;i < codes.length; i++){
				if(codes[i].indexOf("d")!=-1){
					arr[i] = codes[i].replace("d","");
					codes[i] = "#";
				}
			}
			c = arr.join(",")+"$"+codes.join(",") + ":1:5";
		}else{
			var n=0;
			for(var i = 0;i < codes.length; i++){
				if(codes[i]=='#'){n++;}
			}
			if(n < 5){
				c = arr.join(",")+ "$" + vardata + ":1:5";
			} else {
				c = vardata + ":1:1";
			}
		}
	}
	return c;
}