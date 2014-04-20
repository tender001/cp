loadProj=function(){
	var lotid = location.search.getParam('lotid');
	var proid = location.search.getParam('projid');
	if (lotid == "" || proid == "") {
		if (history.length == 0) {
			window.location = "/";
		} else {
			history.go(-1);
		}
		return;
	}
	$("#lotid").val(lotid);
	$("#proid").val(proid);
	$.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : {
			gid : lotid,
			hid : proid
		},
		success : function(d) {
			var code = d.Resp.code;
			var desc = d.Resp.desc;
			if (code == "0") {
				var row = d.Resp.row;
				$("#baodi").val(row.pnum);
				$("#lnums").val(row.lnum);
				var canc=false;
				if ((row.nums-row.lnum+row.pnum)/row.nums<0.8){					
					canc=true;
				}
				showproj({data:d,canc:canc});
				showwins({data:d,canc:canc});
				showcode({data:d,canc:canc});
				showjoin({data:d,canc:canc});
			} else {
				showTips(desc);
			}
		},
		error : function() {
			showTips("网络异常!");
			return false;
		}
	});
};
showproj = function(option){
	var title = [];
	title.push($_sys.getlotname($("#lotid").val()) + "  ");
	title.push(option.data.Resp.row.ifile == 0 ? "复式" : "单式");
	title.push(option.data.Resp.row.itype == 0 ? "自购" : "合买");
	$("#gname").html(title.join(""));
	$("#mainname").html(option.data.Resp.row.cnickid);
	var nums = option.data.Resp.row.nums;
	var lnum = option.data.Resp.row.lnum;
	var pnum = option.data.Resp.row.pnum;
	var mulity = option.data.Resp.row.mulity;
	$("#tmoney").html((nums/2)+"注 "+mulity+"倍 <span style=\"color:Red;\">"+nums+"</span>元");
	$("#pmoney").html(nums);
	$.each($(".bmoney"),function(o,lt){
		$(lt).html(parseFloat(nums-lnum).rmb(true));
	});
	$.each($(".proc"),function(o,lt){
		$(lt).html(option.data.Resp.row.jindu+"%");
	});
	var iclear = option.data.Resp.row.iclear;
	$("#baoodi").html((pnum!=0 ? ('(<span style="color:Red" >'+parseFloat(parseInt(pnum*100/nums).toFixed(2))+'%) '+(iclear=='2' ? '已清' : '未清'))+"</span>" : '无保底'));
	var rate = option.data.Resp.row.wrate;
	$("#rate").html(rate==0?'未提成':rate+'%');
	var adddate = option.data.Resp.row.adddate;
	$("#ptime").html(adddate.toDate().format('MM-DD hh:mm'));
	var icast = option.data.Resp.row.icast;
	var istate = option.data.Resp.row.istate;
	var st = istate == 0 ? "暂停认购" : ( istate >=3 ? "已撤单" : ( istate == 1 ? "认购中" : "已满员"));
	st += istate == 2 ? " " + (icast == 3 ? "已出票" : "未出票") : "";
	if(istate == 0){
		setTimeout(function(){window.location.reload(); }, 3000);
	}
	$("#state").html(st);
	$("#pdesc").html(option.data.Resp.row.cdesc.length > 0 ? option.data.Resp.row.cdesc : "快乐购彩");
	var itype = option.data.Resp.row.itype;
	if(itype == 1){
		if(istate > 0 && istate < 2){
			$("#tobuy").show();
		}
	}
	$.each($(".lnum"),function(o,lt){
		$(lt).html($("#lnums").val());
	});
	if(Storage.Get("LoginUN_cookie")==option.data.Resp.row.cnickid && istate == 1){
		if(pnum>0){
			$("#tobd").html("<div class=\"title\">保底转认购</div> 已保底<span style='color:Red'>"+parseFloat(pnum).rmb(2)+"</span>元 &nbsp;<a href=\"javascript:void(0);\" onclick=\"JQConfirm('确定转认购？','btg()')\">保底转认购</a>");
		}
		$("#tobd").show();
	}
	if(option.canc){
		if(istate > 0 && istate < 2){
			$("#bymain").show();
		}
	}
};
showwins = function(option){
	var ireturn = option.data.Resp.row.ireturn;
	var bonus = option.data.Resp.row.bonus;
	var tax = option.data.Resp.row.tax;
	var wininfo = option.data.Resp.row.wininfo;
	if(ireturn==2){
		var wdetail = "";
		var ws = [];
		if(wininfo.length > 0){
			if(wininfo.indexOf("|") != -1){
				ws = wininfo.split("|");
				if(bonus > 0){
					wdetail="选择场数:" +ws[1]+ "<br/>过关方式:" +ws[2]+ "<br/>中奖注数:<span style='color:Red'>"+ws[0]+"</span><br/>税前奖金：<span style='color:Red'>"+parseFloat(bonus).rmb(true,2)+"</span>元<br/>税后奖金：<span style='color:Red'>"+parseFloat(tax).rmb(true,2)+"</span>元";
				}else{
					wdetail="选择场数:" +ws[1]+ "<br/>过关方式:" +ws[2]+ "<br/>未中奖";
				}
			} else {
				ws = wininfo.split(",");
				var gid = $("#lotid").val();
				var grd = $_sys.getGradeDef(gid);
				var wss = [];
				if(grd != null){
					var gs = grd.split(",");
					if(gid=='50'){
						for(var k = 0; k < 8; k++){
							if(ws[k] > 0){
								wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注" + ((k+9 < gs.length && ws[k+9] > 0) ? "<span style='color:Red'>(追加)</span>" : ""));
							}
						}
						if(ws[8] > 0){
							wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注");
						}
					} else {
						for(var k = 0; k < gs.length; k++){
							if(ws[k] > 0){
								wss.push(gs[k] + " <span style='color:Red'>" + ws[k] + "</span> 注");
							}
						}
					}
				}
				if(bonus > 0){
					wss.push("税前奖金：<span style='color:Red'>"+parseFloat(bonus).rmb(true,2)+"</span>元<br/>税后奖金：<span style='color:Red'>"+parseFloat(tax).rmb(true,2)+"</span>元");
				}
				wdetail=wss.join("<br/>");
			}
		} else {
			wdetail = "未中奖";
		}
		$("#windetail").html(wdetail);
		$("#wins").show();
	}
};
showcode=function(option){
	var gid = $("#lotid").val();
	var codes = option.data.Resp.row.ccodes;
	var iopen = option.data.Resp.row.iopen;
	var upload = option.data.Resp.row.upload;
	var ifile = option.data.Resp.row.ifile;
	var html = [];
	if(ifile == 1){
		if(upload == 1){
			html.push("<em style=\"color:red;\">单式方案</em><em style=\"font-size:13px;\">(请在电脑上登录查看)</em>");
		}else{
			html.push("未上传");
		}
		$("#content").html(html.join("<br/>"));
	} else {
		if(codes !="" && !codes.endWith('.txt')){
			if(gid == 70 || gid == 71 || gid == 72 || (parseInt(gid)>=90 && parseInt(gid) <= 97) || gid == 85 || gid == 86 || gid == 87 || gid == 88 || gid == 89){
				showjjcode(option);
			} else if(gid == 1 || gid == 7 || gid == 50 || gid == 51 || gid == 52 || gid == 80|| gid == 81|| gid == 82|| gid == 83){
				$("#content").html(showszccode(gid, codes, 0));
			} else if(gid == 3 || gid == 4 || gid == 53 || gid == 05 || gid == 54|| gid == 56){
				$("#content").html(showszccode(gid, codes, 1));
			}
		}else{
			html.push(PIOPEN[iopen]);
			$("#content").html(html.join("<br/>"));
		}
	}
};
showjjcode = function(option){
	var gid = $("#lotid").val();
	var proid = $("#proid").val();
	var pid = option.data.Resp.row.periodid;
	$.ajax({
		url:"/cpdata/guoguan/"+gid+"/"+pid+"/proj/"+proid.toLowerCase()+".json?r="+Math.random(),
		type:'GET',
		dataType:"json",
		success:function(d) {
			option.match = d;
			showjccode(option);
		},
		error:function(){
			showTips('网络异常');
		}
	});
};
jjcodeobj = function(code){
	var obj = [];
	var split = code.startWith("HH")? ">" : "=";
	obj.item = [];
	var cs = code.split("|");
	var dr = [], tr = [];
	if(cs[1].indexOf("$") != -1){
		var r = cs[1].split("$");
		dr = r[0].split(",");
		tr = r[1].split(",");
	} else {
		tr = cs[1].split(",");
	}
	$.each(dr,function(i,ri){
		var rs = ri.split(split);
		obj.item.push([rs[0],rs[1],1]);
	});
	$.each(tr,function(i,ri){
		var rs = ri.split(split);
		obj.item.push([rs[0],rs[1],0]);
	});
	
	if(cs.length > 3){
		obj.filter = 1;
	}
	obj.pass = cs[2];
	return obj;
};
getjcrs=function(gid,hs,vs,hss,vss,lose){
	var rs = "";
	if(gid == 90){
		if(parseFloat(hs) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) < parseFloat(vs)){
			rs = "0";
		} else {
			rs = "1";
		}
	} else if(gid == 85 || gid == 72){
		if(parseFloat(hs) + parseFloat(lose) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) + parseFloat(lose) < parseFloat(vs)){
			rs = "0";
		} else {
			rs = "1";
		}
	} else if(gid == 86) {
		rs = hs + ":" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "9:9";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) > 2) {
				rs = "9:0";
			}
			if (parseFloat(hs) > 4) {
				rs = "9:0";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "9:9";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) > 2) {
				rs = "0:9";
			}
			if (parseFloat(vs) > 4) {
				rs = "0:9";
			}
		}
	} else if(gid == 91) {
		rs = hs + ":" + vs;
		if (parseFloat(hs) > parseFloat(vs)) {
			if (parseFloat(hs) == parseFloat(vs) && parseFloat(hs) > 3) {
				rs = "9:9";
			}
			if (parseFloat(hs) == 4 && parseFloat(vs) == 3) {
				rs = "9:0";
			}
			if (parseFloat(hs) == 5 && parseFloat(vs) > 2) {
				rs = "9:0";
			}
			if (parseFloat(hs) > 5) {
				rs = "9:0";
			}
		} else if (parseFloat(hs) == parseFloat(vs)) {
			if (parseFloat(hs) > 3) {
				rs = "9:9";
			}
		} else {
			if (parseFloat(vs) == 4 && parseFloat(hs) == 3) {
				rs = "0:9";
			}
			if (parseFloat(vs) == 5 && parseFloat(hs) > 2) {
				rs = "0:9";
			}
			if (parseFloat(vs) > 5) {
				rs = "0:9";
			}
		}
	} else if(gid == 87 || gid == 92){
		if (parseFloat(hss) > parseFloat(vss)) {//胜
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "3-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "3-1";
			} else {
				rs = "3-0";
			}
		} else if (parseFloat(hss) == parseFloat(vss)) {//平
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "1-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "1-1";
			} else {
				rs = "1-0";
			}
		} else {
			if (parseFloat(hs) > parseFloat(vs)) {
				rs = "0-3";
			} else if (parseFloat(hs) == parseFloat(vs)) {
				rs = "0-1";
			} else {
				rs = "0-0";
			}
		}
	} else if(gid == 88){
		var t = parseFloat(hs) + parseFloat(vs);
		if(t >= 3){//上
			if(t % 2 == 0){//双
				rs = "2";
			} else {//单
				rs = "3";
			}
		} else {//下
			if(t % 2 == 0){//双
				rs = "0";
			} else {//单
				rs = "1";
			}
		}
	} else if(gid == 89 || gid == 93){
		rs = "" + (parseFloat(hs) + parseFloat(vs));
		if (parseFloat(rs) > 7) {
			rs = "7";
		}
	} else if(gid == 94){
		if(parseFloat(hs) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) < parseFloat(vs)){
			rs = "0";
		}
	} else if(gid == 95){
		if(parseFloat(hs) + parseFloat(lose) > parseFloat(vs)){
			rs = "3";
		} else if(parseFloat(hs) + parseFloat(lose) < parseFloat(vs)){
			rs = "0";
		}
	} else if(gid == 96){
		var val = parseInt(hs) - parseInt(vs);
		if (val > 0) {
			if(val > 0 & val <=5){
				rs = "01";
			} else if (val > 5 & val <=10){
				rs = "02";
			} else if (val > 10 & val <=15){
				rs = "03";
			} else if (val > 15 & val <=20){
				rs = "04";
			} else if (val > 20 & val <=25){
				rs = "05";
			} else {
				rs = "06";
			}
		} else {
			val = Math.abs(val);
			if(val > 0 & val <=5){
				rs = "11";
			} else if (val > 5 & val <=10){
				rs = "12";
			} else if (val > 10 & val <=15){
				rs = "13";
			} else if (val > 15 & val <=20){
				rs = "14";
			} else if (val > 20 & val <=25){
				rs = "15";
			} else {
				rs = "16";
			}
		}
	} else if(gid == 97){
		if(parseFloat(hs) + parseFloat(vs) > parseFloat(lose)){
			rs = "3";
		} else {
			rs = "0";
		}
	}
	return rs;
};
showjccode=function(option){
	var gid = $("#lotid").val();
	var codes = option.data.Resp.row.ccodes;
	var jcobj = jjcodeobj(codes);
	var row = [];
	var d = option.match;
	if(d.items){row = d.items.item;};
	if(!isArray(row)){row = new Array(row);};
	var match = [];
	$.each(row,function(i,r){
		var bt = r.bt;
		var lls = new String(r.lose).split("|");
		var lose = lls.length > 1 ? (gid == 95 ? lls[1] : lls[2]) : r.lose;
		var cancel = r.cancel;
		var html = "<div class='ni" + i%2 + "'>";
		if(lose == 0 || gid == 91 || gid == 92 || gid == 93 | gid==70  || gid == 90){
			if( gid == 94 || gid==96 || gid == 71){
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.vn+" VS "+r.hn+"</label><br>";
			}else{
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.hn+" VS "+r.vn+"</label><br>";
			}
			
		} else {
			if( gid == 95){
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.vn+" ";
				html += (parseFloat(lose) > 0) ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>";
				html += r.hn+" </label><br>";
			}else{
				html += "<label>["+(r.name==undefined?r.id:r.name)+"] "+r.hn+" ";
				html += (parseFloat(lose) > 0) ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>";
				html += r.vn+" </label><br>";
			}
			
		}
		html += "<div>比赛时间: "+bt.toDate().format('MM-DD hh:mm')+"</div>";
		var rst = false;
		var mrs = "";
		if(gid == 70 || gid == 71){
			if(cancel == 0){
				if(new String(r.hs).length > 0 && new String(r.vs).length > 0 && new String(r.hss).length > 0 && new String(r.vss).length > 0 ){
					rst = true;
				}
			} else {
				rst = true;
				mrs = "*";
			}
			
			html += "<div class='hunheItem'>";
			for(var k = 0; k < jcobj.item.length;k++){
				if(jcobj.item[k][0] == r.id){
					var cc = jcobj.item[k][1].split("+");
					for(var f = 0; f < cc.length; f++){
						var ps = cc[f].split("=");
						var gg = getJcPlay(gid, ps[0]);
						lose = lls.length > 1 ? (gg == 95 ? lls[0] : lls[2]) : r.lose;
//						if(gg==97){
//							lose = lls.length > 1?lls[3]: r.lose;
//						}
						if(rst){
							mrs = mrs == "*" ? mrs : getjcrs(gg, r.hs, r.vs, r.hhs, r.hvs, (gg==97?lls[3]:lose));
							
						}
						html += "玩法:<span style='color:green'>" + $_sys.getlotname(gg,2) + "</span>";
						if(gg == 72 || gg == 95 || gg == 97){
							if(lose != 0){
								html += (parseFloat(lose)>0 ? "<span style='color:Red'>(<b>+"+lose+"</b>)</span>" : "<span style='color:green'>(<b>"+lose+"</b>)</span>");
							}
						}
						html += "<br/>";
						html += "投注:";
						var cs = ps[1].split("/");
						for(var n = 0; n < cs.length; n++){
							if(cs[n] == mrs || mrs=="*"){
								html += "<span class='spitems'>" + $_sys.getJJCode(gg,"K" + cs[n]) + "</span>";
							} else {
								html += "<span class='spitems2'>" + $_sys.getJJCode(gg,"K" + cs[n]) + "</span>";
							}
						}
						if(jcobj.item[k][2]==1){
							html += "<span style='color:red'>(胆)</span>";
						}
						html += "<br/>";
						if(rst){
							html += "比分：" + "(" + r.hs + ":" + r.vs + ")"+ (gg == 92 ? "半场比分：("+r.hhs+":"+r.hvs+")" : "") +  " 赛果：<span style='color:Red'>" + $_sys.getJJCode(gg,"K" + mrs) + "</span><br/>";
						}
					}
				}
			}
			html += "</div>";
		} else {
			var hss = r.hss == undefined ? r.hhs : r.hss;
			var vss = r.vss == undefined ? r.hvs : r.vss;
			if(cancel == 0){
				if(new String(r.hs).length > 0 && new String(r.vs).length > 0 && new String(hss).length > 0 && new String(vss).length > 0 ){
					rst = true;
					mrs = getjcrs(gid, r.hs, r.vs, hss, vss, lose);
				}
			} else {
				rst = true;
				mrs = "*";
			}
			html += "<div class='hunheItem'>";
			html += "投注：";
			for(var k = 0; k < jcobj.item.length;k++){
				if(jcobj.item[k][0] == r.id){
					var cc = jcobj.item[k][1].split("/");
					for(var n = 0; n < cc.length; n++){
						if(cc[n] == mrs || mrs=="*"){
							html += "<span class='spitems'>" + $_sys.getJJCode(gid,"K" + cc[n]) + "</span>";
						} else {
							html += "<span class='spitems2'>" + $_sys.getJJCode(gid,"K" + cc[n]) + "</span>";
						}
					}
					if(jcobj.item[k][2]==1){
						html += "<span style='color:red'>(胆)</span>";
					}
					html += "<br/>";
					break;
				}
			}
			if(rst){
				html += "比分：" + "(" + r.hs + ":" + r.vs + ")"+ ((gid == 87 || gid == 92) ? "半场比分：("+hss+":"+vss+")" : "") +  " 赛果：<span style='color:Red'>" + $_sys.getJJCode(gid,"K" + mrs) + "</span>";
			}
			html += "</div>";
		}
		html += "</div>";
		match.push(html);
	});
	match.push("<div>过关方式:<span style='color:red'>" + jcobj.pass + "</span></div>");
	if(jcobj.filter == 1){
		match.push("<div><span style='color:Red'>去除单一玩法串</span></div>");
	}
	$("#content").html(match.join(""));
};
tobuy = function(){
	var bnum = parseInt($("#hmRenGou").val());
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    var lnum = parseInt($("#lnums").val());
    if(isNaN(bnum)){
    	showTips("请输入整数!");
    	return;
    }
    if(lnum < bnum){
    	showTips("认购份数不能大于剩余份数!");
   		return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url : $_trade.url.pjoin,
    			type:'POST',
    			data:{
    				gid:lotid,
    				hid:proid,
    				bnum:bnum,
    				source:'100'
    			},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("认购成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
    				showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
tobaodi = function(){
	var bdnum = parseInt($("#hmBaoDi").val());
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    var lnum = parseInt($("#lnums").val());
    if(isNaN(bdnum)){
		showTips("请输入整数!");
		return;
	}
    if(lnum < bdnum){
    	showTips("保底份数不能大于剩余份数!");
    	return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pshbd,
    			type:'POST',
    			data:{
    				gid:lotid,
    				hid:proid,
    				bnum:bdnum
    			},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("保底成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
btg = function(){
	var bdnum = $("#baodi").val();;    
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    if(bdnum < 1){
    	showTips("未保底无法保底转认购!");
    	return;
    }
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pb2g,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
					bnum:bdnum
				},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("保底转认购成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
maincal = function(){
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.pcancel,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
				},
				dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("方案撤销成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
caljoin=function(buyid){
    var lotid = $("#lotid").val();
    var proid = $("#proid").val();
    chklogin(function(d){
    	var c = d.Resp.code;
    	if(c == 0){
    		$.ajax({
    			url:$_trade.url.jcancel,
    			type:'POST',
				data:{
					gid:lotid,
					hid:proid,
					bid:buyid
				},
    			dataType:'json',
    			success:function(j){
    				var code = j.Resp.code;
    				if(code == 0){
    					showTips("参与跟单撤销成功!");
    					window.location.reload();
    				}else{
    					showTips(j.Resp.desc);
    				}
    			},
    			error:function(){
	        	  showTips('网络异常');
	        	}
    		});
    	} else {
    		showLogin();
    	}
    });
};
showjoin = function(option){
	var buyhtml = "您的认购记录如下：<br/>", joins=[];
	var jlist = option.data.Resp.myjoins;
	var istate = option.data.Resp.row.istate;
	if(jlist)joins = jlist.myjoin;
	if(!isArray(joins)){joins = new Array(joins);}
	if(joins == undefined || joins.length < 1){
		buyhtml+='<div style="padding-top: 10px;">暂时没有您的认购信息</div>';
	} else {
		$.each(joins,function(i,r) {
			var buyid = r.buyid;
			var buydate = r.buydate;
			var bmoney = r.bmoney;
			var cancel = r.cancel;
			var isource = r.source;// 
			buyhtml += '<div class="ni0">'+$_sys.showsource(isource)+"" + buydate+ '认购' + parseFloat(bmoney).rmb(true) + '元';
			buyhtml += cancel==0?((option.canc && istate == 1)?'<a href="javascript:void(0);" onclick="JQConfirm(\'确定撤销参与跟单？\',\'caljoin('+buyid+')\')" class="a1">撤单</a>':'&nbsp'):(cancel==1 ? '&nbsp;本人撤销 ':'&nbsp;系统撤销');
			buyhtml +='<br></div>';
		});
	}
	$("#buyrec").html(buyhtml);
	$("#prodetail").show();
};
$(document).ready(function() {
	chklogin();
	loadProj();
});