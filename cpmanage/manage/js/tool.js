String.prototype.getParam = function(n){
	var r = new RegExp("[\?\&]"+n+"=([^&?]*)(\\s||$)", "gi");
	var r1=new RegExp(n+"=","gi");
	var m=this.match(r);
	if(m==null){
		return "";
	}else{
		return typeof(m[0].split(r1)[1])=='undefined'?'':decodeURIComponent(m[0].split(r1)[1]);
	}
};

String.prototype.replaceAll = function(search, replace){ 
	 var regex = new RegExp(search, "g"); 
	 return this.replace(regex, replace); 
};  

Number.prototype.rmb = function(prevfix, n) {
	return (prevfix === false ? '' : '\uffe5') + this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
};
Date.prototype.format = function(tpl) {
	var strs, w, keys, year, val;
	strs = [];
	tpl = tpl || 'YY\u5e74MM\u6708DD\u65e5 \u661f\u671fdd';
	w = 'FullYear,Month,Date,Hours,Minutes,Seconds,Day'.split(',');
	keys = [ /YY/g, /Y/g, /MM/g, /M/g, /DD/g, /D/g, /hh/g, /h/g, /mm/g, /m/g, /ss/g, /s/g, /dd/g, /d/g ];
	for ( var i = 0; i < 7; i++) {
		val = this['get' + w[i]]() + (w[i] === 'Month' ? 1 : 0);
		strs.push(('0' + val).slice(-2), val);
	}
	year = [ strs[1], strs[0] ].concat(strs.slice(2, -2));
	year.push('\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d'.substr(strs.slice(-1), 1), strs.slice(-1));
	for ( var i = 0; i < 14; i++) {
		tpl = tpl.replace(keys[i], year[i]);
	}
	return tpl;
};

Date.prototype.dateadd = function(strInterval, Number) {
	var dtTmp = this;
	switch (strInterval) {
	case 's':
		return new Date(Date.parse(dtTmp) + (1000 * Number));
	case 'n':
		return new Date(Date.parse(dtTmp) + (60000 * Number));
	case 'h':
		return new Date(Date.parse(dtTmp) + (3600000 * Number));
	case 'd':
		return new Date(Date.parse(dtTmp) + (86400000 * Number));
	case 'w':
		return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
	case 'q':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'm':
		return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	case 'y':
		return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
	}
};

// +---------------------------------------------------
// | 比较日期差 dtEnd 格式为日期型或者 有效日期格式字符串
// +---------------------------------------------------
Date.prototype.datediff = function(strInterval, dtEnd) {
	var dtStart = this;
	if (typeof dtEnd == 'string')// 如果是字符串转换为日期型
	{
		dtEnd = StringToDate(dtEnd);
	}
	switch (strInterval) {
	case 's':
		return parseInt((dtEnd - dtStart) / 1000);
	case 'n':
		return parseInt((dtEnd - dtStart) / 60000);
	case 'h':
		return parseInt((dtEnd - dtStart) / 3600000);
	case 'd':
		return parseInt((dtEnd - dtStart) / 86400000);
	case 'w':
		return parseInt((dtEnd - dtStart) / (86400000 * 7));
	case 'm':
		return (dtEnd.getMonth() + 1) + ((dtEnd.getFullYear() - dtStart.getFullYear()) * 12) - (dtStart.getMonth() + 1);
	case 'y':
		return dtEnd.getFullYear() - dtStart.getFullYear();
	}
};

Tool = {
	ajax2 : function(url, type, data, dataType, error, success){
		$.ajax({
			url : url,
			type : type,
			data : data,
			dataType : dataType,
			error : error,
			success : success
		});
	},
	ajax : function(url,data,success){
		Tool.ajax2(url,'POST',data,'xml',function(xml){alert('请求失败');},success);
	},
	table : function(ops){
		var dest = ops.dest;
		dest.html("");
		var table = Table.createTable(ops);
		table.appendTo(dest);
	},
	warn : function(desc){
		$.modaldialog.warning(desc,{title:'友情提示：'});
	}
};
HashMap = function(){ 
	/**Map大小**/ 
	var size=0; 
	/**对象**/ 
	var entry=new Object(); 
	/**Map的存put方法**/ 
	this.put=function(key,value){ 
		if(!this.containsKey(key)){ 
		size++; 
		entry[key]=value; 
		} 
	};
	/**Map取get方法**/ 
	this.get=function(key){ 
		return this.containsKey(key) ? entry[key] : null; 
	};
	/**Map删除remove方法**/ 
	this.remove=function(key){ 
		if(this.containsKey(key) && ( delete entry[key] )){ 
		size--; 
		} 
	};
	/**是否包含Key**/ 
	this.containsKey= function (key){ 
		return (key in entry); 
	};
	/**是否包含Value**/ 
	this.containsValue=function(value){ 
		for(var prop in entry) 
		{ 
		if(entry[prop]==value){ 
		return true; 
		} 
		} 
		return false; 
	};
	/**所有的Value**/ 
	this.values=function(){ 
		var values=new Array(); 
		for(var prop in entry) 
		{ 
		values.push(entry[prop]); 
		} 
		return values; 
	};
	/**所有的 Key**/ 
	this.keys=function(){ 
		var keys=new Array(); 
		for(var prop in entry) 
		{ 
		keys.push(prop); 
		} 
		return keys; 
	};
	/**Map size**/ 
	this.size=function(){ 
		return size; 
	};
	/**清空Map**/ 
	this.clear=function(){ 
		size=0; 
		entry=new Object(); 
	};
};
cache_map = new HashMap();
//xml 数据
//listNode
//dest 呈现标签
//tableWidth 表格宽
//columnWidth 单列宽
//fields 字段
//titles 说明头
//showpage 是否显示分页
//format_fn	字段格式化
//rowclick 点击行事件
Table = {
	row : 0,
	column : 0,
	cur_row : 0,
	cur_column : 0,
	createTable : function(ops){
		page = ops.page;
		var xml = ops.xml;
		var titles = ops.titles;
		var fields = ops.fields;
		this.column = titles.length;
		var listNode = ops.listNode;
		var table=$("<table border=1></table>");
		table.addClass("ctable");
		if(!!ops.tableWidth){
			table.css("width", ops.tableWidth);
		}
		var rows = $(xml).find(listNode);
		this.row = rows.length;
		var thead = $("<thead></thead>");
		var htr=$("<tr></tr>");
		for(var i = 0; i < this.column; i++){
			var td=$("<th>"+titles[i]+"</th>");
			if(!!ops.columnWidth){
				td=$("<th>"+titles[i]+"</th>");
				td.css("width", ops.columnWidth[i]);
			}
			td.appendTo(htr);
		}
		htr.appendTo(thead);
		thead.appendTo(table);
		
		var tbody = $("<tbody></tbody>");
		if(this.row == 0){
			var tr=$("<tr align='center'></tr>");
			var td = $("<td></td>");
			td.attr("colspan", this.column);
			td.html('当前无数据');
			td.appendTo(tr);
			tr.appendTo(tbody);
		}else{
			for(var i = 0; i < this.row; i++){
				var xdata = rows[i];
				var tr=$("<tr align='center'></tr>");
				$(tr).attr("data",$(xdata).xml()).attr("node",listNode);
				if(!!ops.rowclick){
//					tr.dblclick(function(){
					tr.click(function(){
						var tdata = $($.parseXml($(this).attr("data"))).find($(this).attr("node"));
						$(tdata).attr('row',cur_row);
						$(tdata).attr('column',cur_column);
						ops.rowclick(tdata);
					});
				}
				if(i % 2 == 0){
					tr.addClass("tr0");
				}
				tr.appendTo(tbody);
				for(var j=0; j<this.column; j++){
					var fts = eval("ops.formats");
					var fct = !!fts ? eval("ops.formats." + fields[j]) : undefined;
					var dval = '';
					if(!!fct){
						dval = fct(xdata);
					}else{
						dval = $(xdata).attr(fields[j]);
					}
					var td=$("<td></td>");
					if(!!dval){
						td=$("<td>"+dval+"</td>");
					}
					td.attr('pos',i + '_' + j);
//					td.dblclick(function(){
					td.click(function(){
						var pos = $(this).attr("pos");
						var _ps = pos.split('_');
						cur_row = _ps[0];
						cur_column = _ps[1];
					});
					td.appendTo(tr);
				}			
			}
		}
		tbody.appendTo(table);
		
		if(!!ops.showpage){
			page = ops.page;
			var tfoot = $("<tfoot></tfoot>");
			var tr=$("<tr align='center'></tr>");
			var ct = $(xml).find("count");
			var pi = new Array();
			pi.push("<a href='#' onclick='page(1)'>首页</a>");
			var ts = $(ct[0]).attr("pn") % 10 == 0 ? parseInt($(ct[0]).attr("pn") / 10)-1: parseInt($(ct[0]).attr("pn") / 10);
			if(ts > 0){
				pi.push("<a href='#' onclick='page(" + (ts*10) + ")'>上一页</a>");
			}
			for(var k = 0; k < 10; k++){
				var cp = ts * 10 + k + 1;
				if(cp <= $(ct[0]).attr("tp")){
					if(cp == $(ct[0]).attr("pn")){
						pi.push("<a href='#' onclick='page(" + cp + ")'><b>" + cp + "</b></a>");
					}else{
						pi.push("<a href='#' onclick='page(" + cp + ")'>" + cp + "</a>");
					}
				}
			}
			if((ts + 1) * 10 < $(ct[0]).attr("tp")){
				pi.push("<a href='#' onclick='page(" + ((ts+1)*10 + 1) + ")'>下一页</a>");
			}
			pi.push("<a href='#' onclick='page(" + $(ct[0]).attr("tp") + ")'>尾页</a>");
			pi.push("每页 " + $(ct[0]).attr("ps") + " 条 共 " + $(ct[0]).attr("rc") + " 条 共 " + $(ct[0]).attr("tp") + " 页");
			var td = $("<td>"+pi.join("&nbsp;")+"</td>");
			td.attr("colspan", this.column);
			td.appendTo(tr);
			tr.appendTo(tfoot);
			tfoot.appendTo(table);
		}
		
		return table;
	}
};
GETSYSCOFIG	= function(config,type){
	var btype = '';
	var count = config.length;
	for(var b = 0; b < count; b++){
		var _arr = config[b];
		if(_arr[0] == type){
			btype = _arr[1];
			break;
		}
	}
	return btype;
};
SYS_CONFIG = {};
SYS_CONFIG.biz = [];
SYS_CONFIG.biz.push(['','全部']);
SYS_CONFIG.biz.push(['100','代购']);
SYS_CONFIG.biz.push(['101','认购']);
SYS_CONFIG.biz.push(['102','追号']);
SYS_CONFIG.biz.push(['103','保底认购']);
SYS_CONFIG.biz.push(['104','提现']);
SYS_CONFIG.biz.push(['105','保低冻结']);
SYS_CONFIG.biz.push(['106','赔偿转出']);
SYS_CONFIG.biz.push(['200','用户充值']);
SYS_CONFIG.biz.push(['201','代购中奖']);
SYS_CONFIG.biz.push(['202','认购中奖']);
SYS_CONFIG.biz.push(['203','中奖提成']);
SYS_CONFIG.biz.push(['204','追号中奖']);
SYS_CONFIG.biz.push(['210','代购撤单返款']);
SYS_CONFIG.biz.push(['211','认购撤单返款']);
SYS_CONFIG.biz.push(['212','追号撤销返款']);
SYS_CONFIG.biz.push(['213','提现撤销返款']);
SYS_CONFIG.biz.push(['214','银行处理失败']);
SYS_CONFIG.biz.push(['215','保底返款']);
SYS_CONFIG.biz.push(['216','送红包']);
SYS_CONFIG.biz.push(['217','系统赔偿']);
SYS_CONFIG.biz.push(['300','代理商转款']);
SYS_CONFIG.getBizType = function(biztype){
	return GETSYSCOFIG(SYS_CONFIG.biz, biztype);
};
SYS_CONFIG.fBank = [];
SYS_CONFIG.fBank.push(['','全部']);
SYS_CONFIG.fBank.push(['1','快钱']);
SYS_CONFIG.fBank.push(['2','财付通']);
SYS_CONFIG.fBank.push(['3','支付宝']);
SYS_CONFIG.fBank.push(['4','百付宝']);
SYS_CONFIG.fBank.push(['5','易宝充值卡']);
SYS_CONFIG.fBank.push(['6','银联手机支付']);
SYS_CONFIG.fBank.push(['9','19pay充值卡']);
SYS_CONFIG.fBank.push(['11','信用卡支付']);
SYS_CONFIG.fBank.push(['97','提款失败转款']);	
SYS_CONFIG.fBank.push(['98','代理商转入']);
SYS_CONFIG.fBank.push(['99','手工加款']);	
SYS_CONFIG.getFBank = function(bt){
	return GETSYSCOFIG(SYS_CONFIG.fBank, bt);
};
SYS_CONFIG.bank = [];
SYS_CONFIG.bank.push(['1','快钱']);
SYS_CONFIG.bank.push(['2','财付通']);
SYS_CONFIG.bank.push(['3','支付宝']);
SYS_CONFIG.bank.push(['4','百付宝']);
SYS_CONFIG.bank.push(['5','易宝充值卡']);
SYS_CONFIG.bank.push(['6','银联手机支付']);
SYS_CONFIG.bank.push(['9','19pay充值卡']);
SYS_CONFIG.bank.push(['11','信用卡支付']);
SYS_CONFIG.bank.push(['99','手工加款']);
SYS_CONFIG.getBank = function(banktype){
	return GETSYSCOFIG(SYS_CONFIG.bank, banktype);
};
SYS_CONFIG.game = [];
SYS_CONFIG.game.push(['','全部','']);
SYS_CONFIG.game.push(['01','双 色 球','mp']);
SYS_CONFIG.game.push(['03','福 彩 3D','mp']);
SYS_CONFIG.game.push(['04','时时彩(CQ)','kp']);
SYS_CONFIG.game.push(['07','七 乐 彩','mp']);
SYS_CONFIG.game.push(['20','时时彩(JX)','kp']);
SYS_CONFIG.game.push(['54','11 选  5','kp']);
SYS_CONFIG.game.push(['56','11运夺金','kp']);
SYS_CONFIG.game.push(['80','胜 负 彩','zc']);
SYS_CONFIG.game.push(['81','任 选 九','zc']);
SYS_CONFIG.game.push(['82','进 球 彩','zc']);
SYS_CONFIG.game.push(['83','半 全 场','zc']);
SYS_CONFIG.game.push(['50','大 乐 透','mp']);
SYS_CONFIG.game.push(['51','七 星 彩','mp']);
SYS_CONFIG.game.push(['52','排 列 五','mp']);
SYS_CONFIG.game.push(['53','排 列 三','mp']);
SYS_CONFIG.game.push(['85','胜平负(北单)','bd']);
SYS_CONFIG.game.push(['86','猜比分(北单)','bd']);
SYS_CONFIG.game.push(['87','半全场(北单)','bd']);
SYS_CONFIG.game.push(['88','上下单双(北单)','bd']);
SYS_CONFIG.game.push(['89','进球数(北单)','bd']);
SYS_CONFIG.game.push(['70','混合(竞足)','jc']);
SYS_CONFIG.game.push(['72','让球胜平负(竞足)','jc']);
SYS_CONFIG.game.push(['90','胜平负(竞足)','jc']);
SYS_CONFIG.game.push(['91','猜比分(竞足)','jc']);
SYS_CONFIG.game.push(['92','半全场(竞足)','jc']);
SYS_CONFIG.game.push(['93','进球数(竞足)','jc']);
SYS_CONFIG.game.push(['71','混合(篮彩)','jc']);
SYS_CONFIG.game.push(['94','胜负(篮彩)','jc']);
SYS_CONFIG.game.push(['95','让分胜负(篮彩)','jc']);
SYS_CONFIG.game.push(['96','胜分差(篮彩)','jc']);
SYS_CONFIG.game.push(['97','大小分(篮彩)','jc']);
SYS_CONFIG.game.push(['98','冠军(竞彩)','jc']);
SYS_CONFIG.game.push(['99','冠亚军(竞彩)','jc']);
SYS_CONFIG.getGame = function(game){
	return GETSYSCOFIG(SYS_CONFIG.game, game);
};
SYS_CONFIG.getGameByType = function(type){
	var count = SYS_CONFIG.game.length;
	var arr = new Array();
	for(var i = 0; i < count; i++){
		if(SYS_CONFIG.game[i][2]==type){
			arr.push(SYS_CONFIG.game[i]);
		}
	}
	return arr;
};
SYS_CONFIG.bankname = [];
SYS_CONFIG.bankname.push(["1","招商银行"]);
SYS_CONFIG.bankname.push(["2","工商银行"]);
SYS_CONFIG.bankname.push(["3","建设银行"]);
SYS_CONFIG.bankname.push(["4","中国银行"]);
SYS_CONFIG.bankname.push(["5","中国人民银行"]);
SYS_CONFIG.bankname.push(["6","交通银行"]);
SYS_CONFIG.bankname.push(["8","中信银行"]);
SYS_CONFIG.bankname.push(["9","兴业银行"]);
SYS_CONFIG.bankname.push(["10","光大银行"]);
SYS_CONFIG.bankname.push(["11","华夏银行"]);
SYS_CONFIG.bankname.push(["12","中国民生银行"]);
SYS_CONFIG.bankname.push(["13","中国农业银行"]);
SYS_CONFIG.bankname.push(["15","农村信用合作社"]);
SYS_CONFIG.bankname.push(["16","农村商业银行"]);
SYS_CONFIG.bankname.push(["17","农村合作银行"]);
SYS_CONFIG.bankname.push(["18","城市商业银行"]);
SYS_CONFIG.bankname.push(["19","城市信用合作社"]);
SYS_CONFIG.bankname.push(["20","国家开发银行"]);
SYS_CONFIG.bankname.push(["21","中国进出口银行"]);
SYS_CONFIG.bankname.push(["22","恒丰银行"]);
SYS_CONFIG.bankname.push(["23","平安银行"]);
SYS_CONFIG.bankname.push(["24","渤海银行"]);
SYS_CONFIG.bankname.push(["25","中国邮政储蓄银行"]);
SYS_CONFIG.bankname.push(["1000","广东发展银行"]);
SYS_CONFIG.bankname.push(["1001","深圳发展银行"]);
SYS_CONFIG.bankname.push(["1002","广州市商业银行"]);
SYS_CONFIG.bankname.push(["1003","珠海南通银行"]);
SYS_CONFIG.bankname.push(["2000","北京银行"]);
SYS_CONFIG.bankname.push(["3000","天津银行"]);
SYS_CONFIG.bankname.push(["4000","上海浦东发展银行"]);
SYS_CONFIG.bankname.push(["4001","上海银行"]);
SYS_CONFIG.bankname.push(["5000","浙商银行"]);
SYS_CONFIG.bankname.push(["5001","浙江商业银行"]);
SYS_CONFIG.bankname.push(["5002","宁波国际银行"]);
SYS_CONFIG.bankname.push(["5003","宁波银行"]);
SYS_CONFIG.bankname.push(["5004","温州银行"]);
SYS_CONFIG.bankname.push(["6000","南京银行"]);
SYS_CONFIG.bankname.push(["6001","常熟农村商业银行"]);
SYS_CONFIG.bankname.push(["7000","福建亚洲银行"]);
SYS_CONFIG.bankname.push(["7001","福建兴业银行"]);
SYS_CONFIG.bankname.push(["7002","徽商银行"]);
SYS_CONFIG.bankname.push(["7003","厦门国际银行"]);
SYS_CONFIG.bankname.push(["8000","青岛市商业银行"]);
SYS_CONFIG.bankname.push(["8001","济南市商业银行"]);
SYS_CONFIG.bankname.push(["9000","重庆银行"]);
SYS_CONFIG.bankname.push(["10000","成都市商业银行"]);
SYS_CONFIG.bankname.push(["11000","哈尔滨银行"]);
SYS_CONFIG.bankname.push(["12000","包头市商业银行"]);
SYS_CONFIG.bankname.push(["13000","南昌市商业银行"]);
SYS_CONFIG.bankname.push(["14000","贵阳商业银行"]);
SYS_CONFIG.bankname.push(["15000","兰州市商业银行"]);
SYS_CONFIG.getBankName = function(bid){
	return GETSYSCOFIG(SYS_CONFIG.bankname, bid);
};
SYS_CONFIG.moniter=[];
SYS_CONFIG.moniter.push(["proj_01", "全部"]);
SYS_CONFIG.moniter.push(["proj_02","未满员"]);
SYS_CONFIG.moniter.push(["proj_03","已满员"]);
SYS_CONFIG.moniter.push(["proj_04","未出票"]);
SYS_CONFIG.moniter.push(["proj_05","出票中"]);
SYS_CONFIG.moniter.push(["proj_06","已出票"]);
SYS_CONFIG.moniter.push(["proj_07","已撤单"]);
SYS_CONFIG.getMoniter = function(mid){
	return GETSYSCOFIG(SYS_CONFIG.moniter, mid);
};
SYS_CONFIG.zmoniter=[];
SYS_CONFIG.zmoniter.push(["zh_01", "全部"]);
SYS_CONFIG.zmoniter.push(["zh_02","未出票"]);
SYS_CONFIG.zmoniter.push(["zh_03","出票中"]);
SYS_CONFIG.zmoniter.push(["zh_04","已出票"]);
SYS_CONFIG.zmoniter.push(["zh_05","已撤单"]);
SYS_CONFIG.getZMoniter = function(mid){
	return GETSYSCOFIG(SYS_CONFIG.zmoniter, mid);
};
SYS_CONFIG.agentcharge = [];
SYS_CONFIG.agentcharge.push(["","全部"]);
SYS_CONFIG.agentcharge.push(["0","佣金"]);
SYS_CONFIG.agentcharge.push(["4","转帐"]);
SYS_CONFIG.agentcharge.push(["5","提款"]);
SYS_CONFIG.agentcharge.push(["6","代理商转款"]);
SYS_CONFIG.agentcharge.push(["7","销售扣款"]);
SYS_CONFIG.getAgentChargeType = function(type){
	return GETSYSCOFIG(SYS_CONFIG.agentcharge, type);
};

SYS_CONFIG.P = function(d){
	if(d == undefined){
		return "";
	}
	return d;
};
SYS_CONFIG.showUser = function(data){
//	window.showModalDialog("../user/user.html?nid=" + SYS_CONFIG.P($(data).attr("cnickid")),data,"dialogWidth=980px;dialogHeight=640px;scroll=no");
	window.open("../user/user.html?nid=" + SYS_CONFIG.P($(data).attr("cnickid")),"user");
};
SYS_CONFIG.showProject = function(data){
//	window.showModalDialog("../project/pinfo.html?cprojid=" + SYS_CONFIG.P($(data).attr("cprojid"))+"&czhid=" + SYS_CONFIG.P($(data).attr("czhid"))+"&idetailid=" + SYS_CONFIG.P($(data).attr("idetailid")),data,"dialogWidth=980px;dialogHeight=640px;scroll=no");
	window.open("../project/pinfo.html?cprojid=" + SYS_CONFIG.P($(data).attr("cprojid"))+"&czhid=" + SYS_CONFIG.P($(data).attr("czhid"))+"&idetailid=" + SYS_CONFIG.P($(data).attr("idetailid")),"project");
};
SYS_CONFIG.showAgent = function(data){
//	window.showModalDialog("../agent/agent.html?cagentid=" + SYS_CONFIG.P($(data).attr("cagentid")),data,"dialogWidth=980px;dialogHeight=640px;scroll=no");
	window.open("../agent/agent.html?cagentid=" + SYS_CONFIG.P($(data).attr("cagentid")),"agent");
};