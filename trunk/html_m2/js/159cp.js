var $_user = {}; // ---用户
var $_trade = {}; // ---交易
var $_sys = {}; // 系统相关
$_user.key = {
	fid : "fid",
	uid : "uid",
	pwd : "pwd",
	upwd : "upwd",
	realName : "realName",
	idCardNo : "idCardNo",
	mailAddr : "mailAddr",
	rid : "rid",// 问题编号
	aid : "aid",// 答案
	tid : "tid",// 交易
	gid : "gid",// 彩种
	gender : "gender",// 性别
	provid : "provid",// 省份
	cityid : "cityid",// 城市
	imNo : "imNo",// 即时通信
	mobileNo : "mobileNo",// 电话号码
	stime : "stime",// 开始时间
	etime : "etime",// 结束时间
	newValue : "newValue",// 新的值
	bankCode : "bankCode",// 银行代码
	bankCard : "bankCard",// 银行卡号
	bankName : "bankName",// 银行名称
	pn : "pn",// 页码
	ps : "ps",// 页面大小
	tp : "tp",// 总页数
	tr : "tr",// 总记录数
	tkMoney:"tkMoney", //提款金额
	qtype:"qtype",
	tkType:"tkType"//提款方式
};

// 用户相关url配置
$_user.url = {
	q:"/phpu/q.phpx",//一般查询公用接口
	checklogin : '/phpu/cl.phpx',// 检测用户是否登录
	checkexist : "/phpu/q.phpx?fid=u_check_user", // 查询用户名是否可用
	register : "/phpu/reg.phpx", // 注册
	regnoyzm : "/phpu/regnoyzm.phpx", // 注册
	login : "/phpu/login.phpx",// 登录
	loginout : "/phpu/lout.phpx", // 退出登陆
	base : "/phpu/q.phpx?fid=u_ainfo", // 查询用户登录名、用户余额、冻结款、用户类型
	info : "/phpu/q.phpx?fid=u_info", // 查询用户基本信息
	safe : "/phpu/q.phpx?fid=u_sinfo", // 查询安全资料
	protect : "/phpu/q.phpx?fid=u_pinfo",// 查询密码保护问题是否设置
	card : "/phpu/q.phpx?fid=u_binfo",// 查询银行卡信息
	
	bind : "/phpu/ubind.phpx",// 用户绑定提交
	bindyz : "/phpu/ubindck.phpx",// 用户绑定验证
	
	touzhu : "/phpu/qp.phpx?fid=u_buy",// 购彩记录
	gtouzhu: "/phpu/qp.phpx?fid=u_gbuy",
	chase : "/phpu/qp.phpx?fid=u_zh",// 追号记录
	gchase : "/phpu/qp.phpx?fid=u_gzh",// 追号记录(具体彩种)
	
	myfollow : "/phpu/qp.phpx?fid=u_qauto",// 自动跟单
	
	
	account : "/phpu/qp.phpx?fid=u_charge",// 账户明细
	addmoneylist : "/phpu/qp.phpx?fid=u_fill",// 充值记录
	buylist:"/phpu/qp.phpx?fid=u_charge1",//购买彩票记录
	returnlist:"/phpu/qp.phpx?fid=u_charge2",//奖金派送记录
	drawlist : "/phpu/qp.phpx?fid=u_cash",//提款记录	
	myguoguan : "/phpu/qp.phpx?fid=u_guoguan",//我的过关
	
	xchase : "/phpu/q.phpx?fid=u_zhdetail",// 追号明细记录
	followme : "/phpu/qp.phpx?fid=u_myauto",// 跟我的跟单
	followhist : "/phpu/qp.phpx?fid=u_autos",// 跟单记录
	followhistone : "/phpu/q.phpx?fid=sauto",// 查询单笔跟单记录
	ktkmoney : "/phpu/q.phpx?fid=u_balance",// 查询可提款金额
	
	fanli : "/phpu/qp.phpx?fid=u_fanli",// 用户返利列表
	agent : "/phpu/qp.phpx?fid=u_agent",// 我的推广列表
	agentxl : "/phpu/qp.phpx?fid=u_agentxl",// 我的销量列表
	agentrt : "/phpu/q.phpx?fid=u_agentrt",// 我的返点比例
	
	qautobuy : "/phpu/qabuy.phpx",// 查询跟单信息
	aautobuy : "/phpu/abuy.phpx",// 设置跟单信息	
	
	addmoney : "/phpu/addmoney.phpx", // 充值
	addmoneynew : "/pwap/addmoneynew.phpx", // 触屏充值
	drawmoney:"/phpu/drawmoney.phpx" //提款	
};

// 用户修改配置
$_user.modify = {
	info : "/phpu/mui.phpx?fid=u_modi_info", // 修改用户基本信息
	pwd : "/phpu/mui.phpx?fid=u_modi_pwd", // 修改密码
	protect : "/phpu/mui.phpx?fid=u_set_pinfo",// 修改密保
	card : "/phpu/mui.phpx?fid=u_set_bank", // 修改设置银行卡信息
	name : "/phpu/mui.phpx?fid=u_modi_rinfo", // 用户实名
	autostate : "/phpu/mui.phpx?fid=u_modi_auto" // 自动跟单状态
		
};

//页面导航
$_user.daohang = {
	addmoney : "/account/chongzhi.html", // 充值
	touzhulist : "/account/orderlist.html", // 投注记录
	zhanghulist : "/account/jiaoyi.html" // 账户明细
};

//交易相关key
$_trade.key = {
	gid : "gid", // 彩种
	pid : "pid",//期次编号
	hid : "hid",//合买编号
	bid : "bid",//认购编号
	zid : "zid",//追号编号
	did : "did"//明细编号
	
};
var $_cache ={};//缓存相关
$_trade.url = {
	pcast : "/phpt/t.phpx?fid=pcast",// 发起方案
	fcast : "/phpt/t.phpx?fid=fcast",// 过滤发起
	jcast : "/phpt/t.phpx?fid=jcast",// 竞技彩发起方案
	pjoin:"/phpt/t.phpx?fid=join",//参与方案
	pcancel:"/phpt/t.phpx?fid=pcl",//发起人撤单
	pshbd:"/phpt/t.phpx?fid=bd",//发起人事后保底
	pb2g:"/phpt/t.phpx?fid=b2g",//保底转认购
	jcancel:"/phpt/t.phpx?fid=jcl",//认购撤销	
	zcast: "/phpt/t.phpx?fid=zcast",//发起追号
	zcancel: "/phpt/t.phpx?fid=zcl",//追号撤销
	plist:"/phpt/t.phpx?fid=ps",//方案列表
	hlist:"/phpt/t.phpx?fid=hs",//热门方案列表
	ulist:"/phpt/t.phpx?fid=ulist",//合买名人列表
	pinfo:"/phpt/t.phpx?fid=pinfo",//查询方案信息
	jlist:"/phpt/t.phpx?fid=jlist",//查询方案合买信息
	ai:"/phpt/t.phpx?fid=ai",//中奖明细
	saleperiod : "/phpt/t.phpx?fid=s",// 追号用期次列表
	cacheperiod : "/phpt/t.phpx?fid=c",// 合买用缓存期次列表 
	cachematch : "/phpt/t.phpx?fid=m",// 对阵列表   1 胜平负任九 2 进球彩 3 半全场 4北单 5竟彩足球 6竟彩蓝球	
	qcode:"/phpt/t.phpx?fid=code",//查询开奖号码
	qmoney:"/phpt/t.phpx?fid=qmoney",//查询开奖公告	
	qtoday:"/phpt/t.phpx?fid=qtoday",//查询今天开奖	
	tquery:"/phpt/t.phpx?fid=q",//查询列表
	systime : "/phpt/t.phpx?fid=time",// 获取服务器时间	
	filecast:"/filecast.phpx"//单式文本发起方案	
};
$_cache.qcode = function(gid, pid) {
	var cawardcode = "";
	var data = $_trade.key.gid + "=" + encodeURIComponent(gid) + "&" + $_trade.key.pid + "=" + encodeURIComponent(pid) + "&rnd=" + Math.random();
	$.ajax({
		url : $_trade.url.qcode,
		type : "POST",
		dataType : "json",
		async:false,
		data : data,		
		success : function(d) {
			var R = d.Resp;
			var code = R.code;
			if (code == "0") {
				var r = R.row;
				cawardcode = r.cawardcode;
//				$("#"+gid+"_"+pid+"cawardcode").html(cawardcode);
			}
		}
	});
	return cawardcode;
};
/**
 * 为方案详情提供目录匹配
 */

String.prototype.isDate = function() {
	var r = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null)
		return false;
	var d = new Date(r[1], r[3] - 1, r[4]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
};

String.prototype.toDate = function() 
{ 
	var temp = this.toString(); 
	temp = temp.replace(/-/g, "/"); 
	var date = new Date(Date.parse(temp)); 
	return date; 
};


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
function isArray(o) {  
  return Object.prototype.toString.call(o) === '[object Array]';   
} 

$_sys.inm = [];
$_sys.inm.push([ 200, "用户充值" ]);
$_sys.inm.push([ 201, "自购中奖" ]);
$_sys.inm.push([ 202, "跟单中奖" ]);
$_sys.inm.push([ 203, "中奖提成" ]);
$_sys.inm.push([ 204, "追号中奖" ]);
$_sys.inm.push([ 210, "自购撤单返款" ]);
$_sys.inm.push([ 211, "认购撤单返款" ]);
$_sys.inm.push([ 212, "追号撤销返款" ]);
$_sys.inm.push([ 213, "提现撤销返款" ]);
$_sys.inm.push([ 214, "提款失败转款" ]);
$_sys.inm.push([ 215, "保底返款" ]);
$_sys.inm.push([ 216, "红包派送" ]);
$_sys.inm.push([ 300, "转款" ]);
$_sys.outm = [];
$_sys.outm.push([ 100, "自购" ]);
$_sys.outm.push([ 101, "认购" ]);
$_sys.outm.push([ 102, "追号" ]);
$_sys.outm.push([ 103, "保底认购" ]);
$_sys.outm.push([ 104, "提现" ]);
$_sys.outm.push([ 105, "保底冻结" ]);
$_sys.outm.push([ 99, "转账" ]);
$_sys.biztype = function(f) {
	if (f >= 200) {
		for ( var i = 0; i < $_sys.inm.length; i++) {
			if ($_sys.inm[i][0] == f) {
				return $_sys.inm[i][1];
			}
		}
	} else {
		for ( var i = 0; i < $_sys.outm.length; i++) {
			if ($_sys.outm[i][0] == f) {
				return $_sys.outm[i][1];
			}
		}
	}
	return "未定义";
};
$_sys.lot = [];
$_sys.lot.push([ 1, "双色球","", "10","/ssq/" ]);
$_sys.lot.push([ 3, "福彩3D","", "44","/3d/" ]);
$_sys.lot.push([ 4, "时时彩","", "120",'/ssc/' ]);
$_sys.lot.push([ 7, "七乐彩","", "7","/qlc/" ]);

$_sys.lot.push([ 50, "超级大乐透","", "20","/dlt/" ]);
$_sys.lot.push([ 51, "七星彩","", "25","/qxc/" ]);
$_sys.lot.push([ 52, "排列五","", "27","/p5/" ]);
$_sys.lot.push([ 53, "排列三","", "26","/p3/" ]); 
$_sys.lot.push([ 54, "11选5","","119","/11x5/" ]);
$_sys.lot.push([ 56, "十一运夺金","","115","/11ydj/" ]);

$_sys.lot.push([ 80, "胜负彩","", "1","/zc/" ]);
$_sys.lot.push([ 81, "任选九","", "2","/r9/" ]);
$_sys.lot.push([ 82, "进球彩","", "4" ,"/jq/" ]);
$_sys.lot.push([ 83, "半全场","", "3" ,"/bq/" ]);

$_sys.lot.push([ 84, "胜负过关","", "" ,"/bd/sfgg.html"]);
$_sys.lot.push([ 85, "北单胜平负","", "" ,"/bd/"]);
$_sys.lot.push([ 86, "北单猜比分","", "","/bd/" ]);
$_sys.lot.push([ 87, "北单半全场","", "","/bd/" ]);
$_sys.lot.push([ 88, "北单上下单双","", "" ,"/bd/"]);
$_sys.lot.push([ 89, "北单进球数","", "","/bd/" ]);

$_sys.lot.push([ 70, "竞彩混合","混投", "","/jczq/jchh.html" ]);
$_sys.lot.push([ 90, "竞彩胜平负","胜平负","", "/jczq/spf.html" ]);
$_sys.lot.push([ 72, "竞彩让球胜平负","让球胜平负", "","/jczq/" ]);
$_sys.lot.push([ 91, "竞彩猜比分","猜比分", "" ,"/jczq/"]);
$_sys.lot.push([ 92, "竞彩半全场","半全场", "" ,"/jczq/"]);
$_sys.lot.push([ 93, "竞彩进球数","进球数", "","/jczq/" ]);

$_sys.lot.push([ 71, "篮彩混合","混投", "" ,"/jclq/hh.html"]);
$_sys.lot.push([ 94, "篮彩胜负","胜负", "","/jclq/" ]);
$_sys.lot.push([ 95, "篮彩让分胜负","让分胜负", "","/jclq/rfsf.html" ]);
$_sys.lot.push([ 96, "篮彩胜分差","胜分差", "","/jclq/" ]);
$_sys.lot.push([ 97, "篮彩大小分","大小分", "","/jclq/dxf.html" ]);
$_sys.getlotname = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.lot.length; i++) {
		if ($_sys.lot[i][0] == f) {
			return $_sys.lot[i][n];
		}
	}
};
$_sys.get139Gid = function(f){
	for ( var i = 0; i < $_sys.lot.length; i++) {
		if ($_sys.lot[i][3] == f) {
			var len = new String($_sys.lot[i][0]).length;
			return len < 2 ? '0' + $_sys.lot[i][0] : $_sys.lot[i][0];
		}
	}
	return null;
};
$_sys.grade_def = [];
$_sys.grade_def = [];
$_sys.grade_def.push([ 01, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 03, "直选,组选三,组选六" ]);
$_sys.grade_def.push([ 04, "五星,三星,两星,一星,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖" ]);
$_sys.grade_def.push([ 05, "和值,三同号通选,三同号单选,三不同号,三连号通选,二同号复选,二同号单选,二不同号" ]);
$_sys.grade_def.push([ 07, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖" ]);
$_sys.grade_def.push([ 50, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖"]);
$_sys.grade_def.push([ 51, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 52, "一等奖" ]);
$_sys.grade_def.push([ 53, "直选,组三,组六" ]);
$_sys.grade_def.push([ 54, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 56, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 80, "一等奖,二等奖" ]);
$_sys.grade_def.push([ 81, "一等奖" ]);
$_sys.grade_def.push([ 82, "一等奖" ]);
$_sys.grade_def.push([ 83, "一等奖" ]);
$_sys.getGradeDef=function(lotid){
	for(var i = 0; i < $_sys.grade_def.length; i++){
		if($_sys.grade_def[i][0] == lotid){
			return $_sys.grade_def[i][1];
		}
	}
	return null;
};
$_sys.jjcode = [];
$_sys.jjcode.push([84,'{"K*":"取消","K3":"主胜","K0":"客胜"}']);
$_sys.jjcode.push([85,'{"K*":"取消","K3":"胜","K1":"平","K0":"负"}']);
$_sys.jjcode.push([86,'{"K*":"取消","K1:0":"1:0","K2:0":"2:0","K2:1":"2:1","K3:0":"3:0","K3:1":"3:1","K3:2":"3:2","K4:0":"4:0","K4:1":"4:1","K4:2":"4:2","K9:0":"9:0","K9:9":"9:9","K0:0":"0:0","K1:1":"1:1","K2:2":"2:2","K3:3":"3:3","K0:1":"0:1","K0:2":"0:2","K1:2":"1:2","K0:3":"0:3","K1:3":"1:3","K2:3":"2:3","K0:4":"0:4","K1:4":"1:4","K2:4":"2:4","K0:9":"0:9"}']);
$_sys.jjcode.push([87,'{"K*":"取消","K3-3":"胜胜","K3-1":"胜平","K3-0":"胜负","K1-3":"平胜","K1-1":"平平","K1-0":"平负","K0-3":"负胜","K0-1":"负平","K0-0":"负负"}']);
$_sys.jjcode.push([88,'{"K*":"取消","K0":"下双","K1":"下单","K2":"上双","K3":"上单"}']);
$_sys.jjcode.push([89,'{"K*":"取消","K0":"0","K1":"1","K2":"2","K3":"3","K4":"4","K5":"5","K6":"6","K7":"7+"}']);
$_sys.jjcode.push([90,'{"K*":"取消","K3":"胜","K1":"平","K0":"负"}']);
$_sys.jjcode.push([72,'{"K*":"取消","K3":"让胜","K1":"让平","K0":"让负"}']);
$_sys.jjcode.push([91,'{"K*":"取消","K0:0":"0:0","K0:1":"0:1","K0:2":"0:2","K0:3":"0:3","K1:0":"1:0","K1:1":"1:1","K1:2":"1:2","K1:3":"1:3","K2:0":"2:0","K2:1":"2:1","K2:2":"2:2","K2:3":"2:3","K3:0":"3:0","K3:1":"3:1","K3:2":"3:2","K3:3":"3:3","K4:0":"4:0","K4:1":"4:1","K4:2":"4:2","K0:4":"0:4","K1:4":"1:4","K2:4":"2:4","K5:0":"5:0","K5:1":"5:1","K5:2":"5:2","K0:5":"0:5","K1:5":"1:5","K2:5":"2:5","K9:0":"胜其他","K9:9":"平其他","K0:9":"负其他"}']);
$_sys.jjcode.push([92,'{"K*":"取消","K3-3":"胜胜","K3-1":"胜平","K3-0":"胜负","K1-3":"平胜","K1-1":"平平","K1-0":"平负","K0-3":"负胜","K0-1":"负平","K0-0":"负负"}']);
$_sys.jjcode.push([93,'{"K*":"取消","K0":"0","K1":"1","K2":"2","K3":"3","K4":"4","K5":"5","K6":"6","K7":"7+"}']);
$_sys.jjcode.push([94,'{"K*":"取消","K3":"主胜","K0":"主负"}']);
$_sys.jjcode.push([95,'{"K*":"取消","K3":"让分主胜","K0":"让分主负"}']);
$_sys.jjcode.push([96,'{"K*":"取消","K01":"主胜1-5","K02":"主胜6-10","K03":"主胜11-15","K04":"主胜16-20","K05":"主胜21-25","K06":"主胜26+","K11":"主负1-5","K12":"主负6-10","K13":"主负11-15","K14":"主负16-20","K15":"主负21-25","K16":"主负26+"}']);
$_sys.jjcode.push([97,'{"K*":"取消","K3":"大","K0":"小"}']);
$_sys.getJJCode = function(lotid,key){
	for(var i = 0; i < $_sys.jjcode.length; i++){
		if($_sys.jjcode[i][0] == lotid){
			var json = eval("(" + $_sys.jjcode[i][1] + ")");
			return json[key];
		}
	}
	return null;
};
$_sys.szc = [];
$_sys.szc.push([ 3, '{"K1":"直选","K2":"组三","K3":"组六"}']);
$_sys.szc.push([ 4, '{"K1":"五星","K2":"","K3":"三星","K4":"两星","K5":"一星","K6":"大小单双","K7":"二星组选","K8":"","K9":"","K10":"","K11":"","K12":"五星通选","K13":"五星复选","K14":"","K15":"三星复选","K16":"两星复选"}']);
$_sys.szc.push([53, '{"K1":"直选","K2":"组三","K3":"组六","K4":"组合组选"}']);
$_sys.szc.push([54, '{"K1":"前一","K2":"前一","K3":"任选三","K4":"任选四","K5":"任选五","K6":"任选六","K7":"任选七","K8":"任选八","K9":"前二直选","K10":"前三直选","K11":"前二组选","K12":"前三组选"}']);
$_sys.szc.push([56, '{"K1":"前一","K2":"前一","K3":"任选三","K4":"任选四","K5":"任选五","K6":"任选六","K7":"任选七","K8":"任选八","K9":"前二直选","K10":"前三直选","K11":"前二组选","K12":"前三组选"}']);

$_sys.getSZCP = function(lotid, key){
	for(var i = 0; i < $_sys.szc.length; i++){
		if($_sys.szc[i][0] == lotid){
			var json = eval("(" + $_sys.szc[i][1] + ")");
			return json[key];
		}
	}
	return null;
};
$_sys.castm = [];
$_sys.castm.push([ 1, ""]);
$_sys.castm.push([ 2, ""]);
$_sys.castm.push([ 3, "包号"]);
$_sys.castm.push([ 4, "和值"]);
$_sys.castm.push([ 5, "胆拖"]);
$_sys.getcastm = function(lotid, key){
	for(var i = 0; i < $_sys.castm.length; i++){
		if($_sys.castm[i][0] == lotid){
			return $_sys.castm[i][1];
		}
	}
	return null;
};

$_sys.lottype = [];
$_sys.lottype.push([ "足 彩", "zc", "80,81,82,83" ]);
$_sys.lottype.push([ "北京单场", "bjdc", "85,84,86,87,88,89" ]);
$_sys.lottype.push([ "竞彩足球", "jczq", "90,72,91,92,93,70" ]);
$_sys.lottype.push([ "竞彩篮球", "jclq", "94,95,96,97,71" ]);
$_sys.lottype.push([ "高频彩", "gpc", "4,20,54,56" ]);
$_sys.lottype.push([ "数字彩", "szc", "1,3,7,50,51,52,53" ]);

$_sys.lottype.istype = function (lotid,type){
	for (var i=0;i<$_sys.lottype.length;i++){
		if ($_sys.lottype[i][1]==type){
			var tmp=$_sys.lottype[i][2].split(",");
			for(var i=0;i<tmp.length;i++){
				if (parseFloat(lotid)==parseFloat(tmp[i])){
					return true;
					break;
				}
			}
			break;
		}
	}
	return false;
};
$_sys.getgrade = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	};
	for ( var i = 0; i < $_sys.grade_def.length; i++) {
		if ($_sys.grade_def[i][0] == f) {
			return $_sys.grade_def[i][n].split(",");
		}
	}
};
$_sys_getwininfo = function(lotid, wininfo) {
	var tmp = [];
	if (lotid==85||lotid==86||lotid==87||lotid==88||lotid==89
			||lotid==90
			||lotid==91
			||lotid==92
			||lotid==93||lotid==94||lotid==95||lotid==96||lotid==97||lotid==70||lotid==71||lotid==72
			){		
		wininfo = wininfo.split("|");
		if (wininfo.length>=3){
			tmp.push([ "", "共<font class='cm_red'>"+wininfo[1]+"</font>场, 过关方式：<font class='cm_red'> "+wininfo[2].replaceAll("\\*", "串")+"</font>, 中<font class='cm_red'>"+wininfo[0]+"</font>" ]);
		}		
	}else{
		if(wininfo.length > 0){
			wininfo = wininfo.split(",");
			var grade = $_sys.getgrade(lotid);
			if (wininfo.length > 0 && wininfo.length <= grade.length) {
				for ( var i = 0; i < wininfo.length; i++) {
					if (wininfo[i] > 0) {
						tmp.push([ grade[i], wininfo[i] ]);
					}
				}
			}
		}
	}	
	return tmp;
};
$_sys.getplayname = function(lotid, playid, castdef) {
	var s = "";	

	switch (lotid) {
	case 84:
		s = "胜负过关";
		break;
	case 85:
		s = "让球胜平负";
		break;
	case 86:
		s = "比分";
		break;
	case 87:
		s = "半全场";
		break;
	case 88:
		s = "上下单双";
		break;	
	case 89:
		s = "总进球数";
		break;			
	case 90:
		s = "胜平负";
		break;
	case 72:
		s = "让球胜平负";
		break;
	case 91:
		s = "比分";
		break;
	case 92:
		s = "半全场";
		break;
	case 93:
		s = "总进球数";
		break;
	case 4:
		switch (playid) {
		case 1:
			s = "五星";
			break;
		case 3:
			s = "三星";
			break;
		case 4:
			s = "两星";
			break;
		case 5:
			s = "一星";
			break;
		case 6:
			s = "大小单双";
			break;
		case 7:
			s = "二星组选";
			break;
		case 12:
			s = "五星通选";
			break;
		case 13:
			s = "五星复选";
			break;
		case 15:
			s = "三星复选";
			break;
		case 16:
			s = "两星复选";
			break;
		}
		break;
	case 20:
		switch (playid) {
		case 1:
			s = "一星";
			break;
		case 2:
			s = "二星";
			break;
		case 3:
			s = "三星";
			break;
		case 4:
			s = "四星";
			break;
		case 5:
			s = "五星";
			break;
		case 6:
			s = "二星组合";
			break;
		case 7:
			s = "三星组合";
			break;
		case 8:
			s = "四星组合";
			break;
		case 9:
			s = "五星组合";
			break;
		case 10:
			if(castdef=="1"){
				s = "二星组选单式";
			}else{
				s = "二星组选包号";
			}
			break;
		case 11:
			s = "大小单双";
			break;
		case 12:
			s = "五星通选";
			break;
		case 13:
			s = "任选一";
			break;
		case 14:
			s = "任选二";
			break;
		case 15:
			if(castdef=="1"){
				s = "三星组三单式";
			}else{
				s = "三星组三包号";
			}
			break;
		case 16:
			if(castdef=="1"){
				s = "三星组六单式";
			}else{
				s = "三星组六包号";
			}
			break;
		}
		break;
	case 3:
		switch (castdef) {
		case 1:
		case 2:
		case 3:
		case 5:
			if(playid=="1"){
				s = "直选";
			}else if(playid=="2"){
				s = "组三";
			}else{
				s = "组六";
			}
			break;
		case 4:
			if(playid=="1"){
				s = "直选和值";
			}else{
				s = "组选和值";
			}
			break;
		}
		break;
	case 53://castdef---playid
		switch (castdef) {
		case 1:
		case 2:
		case 3:
		case 5:
			if(playid=="1"){
				s = "直选";
			}else if(playid=="2"){
				s = "组三";
			}else{
				s = "组六";
			}
			break;
		case 4:
			if(playid=="1"){
				s = "直选和值";
			}else if(playid=="2"){
				s = "组三和值";
			}else{
				s = "组六和值";
			}
			break;
		}
		break;
	case 54:
	case 55:
	case 56:
		switch (playid) {
		case 1:
			s = "前一";
			break;
		case 2:
			s = "任选二";
			break;
		case 3:
			s = "任选三";
			break;
		case 4:
			s = "任选四";
			break;
		case 5:
			s = "任选五";
			break;
		case 6:
			s = "任选六";
			break;
		case 7:
			s = "任选七";
			break;
		case 8:
			s = "任选八";
			break;
		case 9:
			s = "前二直选";
			break;
		case 10:
			s = "前三直选";
			break;
		case 11:
			s = "前二组选";
			break;
		case 12:
			s = "前三组选";
			break;
		}
		break;
	case 58:
		switch (playid) {
		case 1:
			s = "任选一";
			break;
		case 2:
			s = "任选二";
			break;
		case 3:
			s = "任选三";
			break;
		case 4:
			s = "任选四";
			break;
		case 5:
			s = "任选五";
			break;
		case 6:
			s = "任选六";
			break;
		case 7:
			s = "同花";
			break;
		case 8:
			s = "同花顺";
			break;
		case 9:
			s = "顺子";
			break;
		case 10:
			s = "豹子";
			break;
		case 11:
			s = "对子";
			break;
		case 12:
			s = "包选";
			break;
		}
		break;
	}
	return s;
};
$_sys.showcode = function (lotid,ccodes,oc){
	var html="";
	var codes = ccodes.split(";");
	for ( var i = 0; i < codes.length; i++) {
		if(lotid==70 ||lotid==90 ||lotid==91 ||lotid==92 ||lotid==93 || lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89){
			tmpCode = codes[i].split("|");
			html += '[' + $_sys.getplayname(lotid, lotid, lotid) + ']|' + tmpCode[1]+'|'+tmpCode[2].replaceAll("\\*","串");
		}else{
			tmpCode = codes[i].split(":");
			pm = tmpCode[1];
			cm = tmpCode[2];
			if (lotid=="04"){
				html += '[' + $_sys.getplayname(lotid, pm, cm) + ']';
				if(Y.getInt(pm)==6){
					//大小单双：大用2 表示,小用1 表示,单用5 表示,双用4 表示
					var tc = tmpCode[0].split(",");
					for(var ii=0; ii<tc.length; ii++){
						html +=tc[ii].replace("2","大").replace("1","小").replace("5","单").replace("4","双")+" ";
					}
				}else{
					html +=tmpCode[0];
				}
			}else if (lotid=="20"){
				html += '[' + $_sys.getplayname(lotid, pm, cm) + ']';
				if(Y.getInt(pm)==11){
					//大小单双：大用2 表示,小用1 表示,单用5 表示,双用4 表示
					var tc = tmpCode[0].split(",");
					for(var ii=0; ii<tc.length; ii++){
						html +=tc[ii].replace("2","大").replace("1","小").replace("5","单").replace("4","双")+" ";
					}
				}else{
					html +=tmpCode[0];
				}
			}else if ( lotid=="55" || lotid=="03" || lotid=="53"){
//				tmpCode[0]=tmpCode[0].replaceAll(",", "&nbsp;|");
//				html += '[' + $_sys.getplayname(lotid, pm, cm) + ']' + tmpCode[0];
				html += '[' + $_sys.getplayname(lotid, pm, cm) + ']' + matchopencode2(lotid, pm, tmpCode[0], oc);
			}else if (lotid=="01" || lotid=="50" || lotid=="07"){
				var a,b;
				html += '<p class="gray ">'+matchopencode(lotid, pm, tmpCode[0], oc)+'</p>';
			}else if(lotid=="51"|| lotid=="52"){
				html += matchopencode2(lotid, pm, tmpCode[0], oc);
			}else if(lotid=="54"|| lotid=="56"){
//				tmpCode[0]=tmpCode[0].replaceAll(",", "&nbsp;|");
				if($_sys.getplayname(lotid, pm, cm).indexOf("任")!=-1){
					html +=  matchopencode(lotid, pm, tmpCode[0], oc);
				}else{
					html +=  matchopencode2(lotid, pm, tmpCode[0], oc);
				}
				
			}else if(lotid=="58"){
					html +=  matchopencode2(lotid, pm, tmpCode[0], oc);
				
			}else{
				html += tmpCode[0];
			}
		}	
		if (i != codes.length - 1) {
			html += '';
		}
	}
	return html;
};
var matchopencode2 = function (lotid, pm, cd, win){
	var rc = "";
	var wf = $_sys.getplayname(lotid, pm, 0);
	if(pm=="12"&&lotid=='58'){
		  if(cd=="07"){
			  wf="同花包选";
		  }else if(cd=="08"){
			  wf="同花顺包选";
		  }else if(cd=="09"){
			  wf="顺子包选";
		  }else if(cd=="10"){
			  wf="豹子包选";
		  }else if(cd=="11"){
			  wf="对子包选";
		  }
		  cd = '[' + wf + ']' ;
	}else if(wf!=""){
		if(lotid=="58"){
			if(wf.indexOf("任")!=-1){
				cd=cd.replace('01', 'A').replace('11', 'J').replace('12', 'Q').replace('13', 'K');
			}else if(pm=="07"){
				cd=cd.replace('01', '黑桃').replace('02', '红桃').replace('03', '梅花').replace('04', '方片');
			}else if(pm=="08"){
				cd=cd.replace('01', '黑桃').replace('02', '红桃').replace('03', '梅花').replace('04', '方片');
			}else if(pm=="09"){
				cd=cd.replace('10', '10JQ').replace('01', 'A23').replace('02', '234').replace('03', '345')
              .replace('04', '456').replace('05', '567').replace('06', '678').replace('07', '789').replace('08', '8910').replace('09', '910J')
              .replace('11', 'JQK').replace('12', 'QKA');
			}else if(pm=="10"){
				cd=cd.replace('01', 'AAA').replace('02', '222').replace('03', '333').replace('04', '444')
              .replace('05', '555').replace('06', '666').replace('07', '777').replace('08', '888').replace('09', '999')
              .replace('10', '101010').replace('11', 'JJJ').replace('12', 'QQQ').replace('13', 'KKK');
			}else if(pm=="11"){
				cd=cd.replace('01', 'AA').replace('02', '22').replace('03', '33').replace('04', '44')
              .replace('05', '55').replace('06', '66').replace('07', '77').replace('08', '88').replace('09', '99')
              .replace('10', '1010').replace('11', 'JJ').replace('12', 'QQ').replace('13', 'KK');
			}
		}
		cd = '[' + wf + ']&nbsp;&nbsp;' + cd;
	}
	if(win == '' || win == undefined){
		rc = cd;
	}else{
	rc+=arrmatch2(cd, win, "red", ",");

	
//	rc=rc.replace("|", "&nbsp;┃&nbsp;");
	}
	if(lotid=="58"){}else{
		rc=rc.replaceAll(",", "&nbsp;|&nbsp;");
	}
	
	return '<p class="gray ">'+rc+'</p>';
	
}

var matchopencode = function (lotid, pm, cd, win){
	var rc = "";
	var wf = $_sys.getplayname(lotid, pm, 0);
	if(win == '' || win == undefined){
		if(cd.indexOf("$")!=-1 && cd.indexOf("|")!=-1){
			var dt = cd.split("|")[0].split("$");
			rc+= "[前胆:" + dt[0] +"]&nbsp;&nbsp;";
			rc+= "[前拖:" + dt[1] +"]&nbsp;&nbsp;";
			var dltl=cd.split("|")[1].split("$");
			if(lotid ==50&& typeof dltl[1] != "undefined"){
			
			rc+= "&nbsp;&nbsp;[后胆:" + dltl[0] +"]&nbsp;&nbsp;";
			rc+= "[后拖:" + dltl[1] +"]";
			}else{
				rc+= "&nbsp;&nbsp;[篮球:" + dltl[0] +"]";
			}
		//	rc+= "|" + cd.split("|")[1];
		}else{
			
			if(cd.indexOf("|")!=-1){
				rc = cd;
			}else if(lotid ==50 ||lotid ==1){
				var dt = cd.split("$");
				rc +="[胆:" + dt[0] +"]&nbsp;&nbsp;"+dt[1];
			}else{
				rc = cd;
			}
			
			
		}
	}else{
		
		var w = win.split("|");
		var c = cd.split("|");
		var cl = c[0];
		var cr = c[1];
		var wl = w[0];
		var wr = w[1];
		
		if(cl.indexOf("$")!=-1){
			if(cd.indexOf("|")!=-1){
				var dan = cl.split("$");
				rc+= "[前胆:" + arrmatch(dan[0], wl, "red", ",") +"]&nbsp;";
				rc+= "&nbsp;&nbsp;[前拖:" + arrmatch(dan[1], wl, "red", ",") +"]&nbsp;&nbsp;";
			}else{
				var dan = cl.split("$");
				rc+= "&nbsp;&nbsp;[胆:" + arrmatch(dan[0], wl, "red", ",") +"]&nbsp;&nbsp;&nbsp;" + arrmatch(dan[1], wl, "red", ",") ;
			}
			
			
		}else{
			rc+= arrmatch(cl, wl, "red", ",");
		}
		
		if(lotid != "07" && lotid !="54"&& lotid !="56"&& lotid !="58"){
			if(cr.indexOf("$")!=-1){
				var dan = cr.split("$");
				rc+= "[后胆:" + arrmatch(dan[0], wr, "blue", ",") +"]&nbsp;";
				rc+= "[后拖:" + arrmatch(dan[1], wr, "blue", ",") +"]";
			}
			else{
				rc+="|";
				rc+=arrmatch(cr, wr, "blue", ",");
			}
		}
		
		
	}
	
	if(wf!=""){
		rc = '[' + wf + ']' + rc;
	}
	rc=rc.replaceAll(",", "&nbsp;");
	rc=rc.replace("|", "&nbsp;┃&nbsp;");
	
	return rc;
};

var arrmatch = function(a, w, c, p){
	var ar = a.split(p);
	var r = "";
	for(var i=0;i<ar.length;i++){
		if(w.indexOf(ar[i])!=-1){
			r+= "<cite class='"+c+"'>" + ar[i] + "</cite>";
		}else{
			r+= ar[i];
		}
		if(i!=(ar.length-1)){
			r+= ",";
		}
	}
	return r;
};
var arrmatch2 = function(a, w, c, p){
	var ar = a.split(p);
	var wr = w.split(p);
	var r = "";
	for(var i=0;i<ar.length;i++){
		if(ar[i]==wr[i]){
			r+= "<cite class='"+c+"'>" + ar[i] + "</cite>";
		}else{
			
			r+= ar[i].replace(wr[i], "<cite class='"+c+"'>" + wr[i] + "</cite>");
		}
		if(i!=(ar.length-1)){
			r+= ",";
		}
	}
	return r;
};

Array.prototype.remove=function(dx)
{
　if(isNaN(dx)||dx>this.length){return false;}
　for(var i=0,n=0;i<this.length;i++)
　{
　　　if(this[i]!=this[dx])
　　　{
　　　　　this[n++]=this[i]
　　　}
　}
　this.length-=1
}