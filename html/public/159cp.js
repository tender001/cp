getcookie=function(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(
			cookie_start + name.length + 1,
			(cookie_end > cookie_start ? cookie_end : document.cookie.length)));
};

setcookie=function(name,value) {
	var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
};

getpage=function(pn,ps,tp,tr,fn){

var maxshow=5;
	
	var pagehtml='<ul><li style="line-height:25px;color:#666;padding-right:5px">共'+tr+'条</li><li class="disabled PagedList-skipToFirst"><a onclick=\"' + fn + '(1,'+ps+','+tp+','+tr+');\"  href="javascript:void(0)">首页</A></li>';
	if(pn>1){
		pagehtml +='<li class="PagedList-skipToPrevious"><a onclick=\"' + fn + '('+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+tr+');\" href="javascript:void(0)">上一页</a></li>'
	}
	var min=0;
	var max=0;
	if (tp > maxshow){
	var pageTemp=parseInt(pn*1/maxshow);

	
	max = pageTemp*maxshow+maxshow;
	min = pageTemp*maxshow;
	
	if(max>tp){
	max=tp;
	}
	if(pn>min){min=min+1;}
	}else{
	min = 1;
	max = tp;
	}
	

	
	for (var i=min;i<max*1+1;i++){
	if (i==pn){
	pagehtml+='<li class="active"><a href="javascript:void(0);" id="'+i+'" class="a4"onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');\">' + i + '</a></li>';
	}else{
		pagehtml+='<li><a href="javascript:void(0);" id="'+i+'" class="a3"  onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');\">' + i + '</a></li>';
	}
	}
	
	pagehtml+='<li class="PagedList-skipToNext"><a onclick=\"' + fn + '('+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+tr+');\"   href="javascript:void(0)">下一页</a></li>';
	pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick=\"'+ fn+'(' +tp+','+ps+','+tp+','+ tr+');" href="javascript:void(0)"> 末页</a></li><ul>';
   
    return pagehtml;
};
/**
 * 
 */
var $_base_s = {};// ----处理函数
var $_user = {}; // ---用户
var $_trade = {}; // ---交易
var $_sys = {}; // 系统相关
var $_cache ={};//缓存相关

$_base_s.getXMLNodes=function(xdc,n,idx){
	var l=n.length,itm=[];
	if(typeof(idx)=="undefined"){
		for(var i=0;i<l;i++){itm.push(0)}
	}else{itm=idx}
	var o=xdc,l=n.length;
	try{
		for(var i=0;i<l-1;i++){
			o=o.getElementsByTagName(n[i])[itm[i]];
		}
		o=o.getElementsByTagName(n[l-1]);
	}catch(e){
		return false;
		//$_bf_w.getXmlError();
	}
	return o;
};
$_base_s.hasNodes=function(xdc,n,idx){
	var l=n.length,itm=[];
	if(typeof(idx)=="undefined"){
		for(var i=0;i<l;i++){itm.push(0)}
	}else{itm=idx}
	var o=xdc;
	for(var i=0;i<l;i++){
		o=o.getElementsByTagName(n[i])[itm[i]];
		if(!o.hasChildNodes()){return false;}
	}
	return true;
};

$_base_s.getStrLen = function(str) {// 含中文的字符串长度
	var len = 0;
	var cnstrCount = 0;
	for ( var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 255)
			cnstrCount = cnstrCount + 1;
	}
	len = str.length + cnstrCount;
	return len;
};

$_base_s.uniq= function(arr){//数组去重复	
	 var temp = {}, len = arr.length;
     for(var i=0; i < len; i++)  {  
         if(typeof temp[arr[i]] == "undefined") {
             temp[arr[i]] = 1;
         }  
     }  
     arr.length = 0;
     len = 0;
     for(var i in temp) {  
    	 arr[len++] = i;
     }  
     return arr;  
};
$_base_s.undel=function(array) { //数组去空
	for(var i = 0 ;i<array.length;i++)
	 {
	             if(array[i] == "" || typeof(array[i]) == "undefined")
	             {
	                      array.splice(i,1);
	                      i= i-1;
	                  
	             }
	              
	 }
	 return array;  
};
String.prototype.isDate = function() {
	var r = this.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null)
		return false;
	var d = new Date(r[1], r[3] - 1, r[4]);
	return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
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

// 图片及样式
var $_img = "";
var $_css = "";

// 用户相关key
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
	chase : "/phpu/qp.phpx?fid=u_zh",// 追号记录
	
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

$_sys.base={
	kfdh:"400-1399-139",
	zhmx:"说明：<SPAN class=gray>&nbsp;&nbsp;&nbsp;1.您可以查询您的账户最近3个月内的账户明细。<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.如果您添加了预付款，银行账户钱扣了，网站账户还没有加上，请及时与我们联系，我们将第一时间为您处理！<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.如需要查询全部明细，请联系网站客服。</SPAN>"
};

$_sys.url = {
	viewpath : "project.html", //		
	hmlist : "/hemai/project_list.html" //		
};

$_sys.autobuy = function (lotid,uid){
	 Y.postMsg('msg_login',function(){
         Y.openUrl('/game/gendan.html?lotid='+lotid+'&owner='+uid,642,500);
	 });	
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
				html += matchopencode(lotid, pm, tmpCode[0], oc);
			}else if(lotid=="51"|| lotid=="52"){
				html += matchopencode2(lotid, pm, tmpCode[0], oc);
			}else if(lotid=="54"|| lotid=="56"){
//				tmpCode[0]=tmpCode[0].replaceAll(",", "&nbsp;|");
				if($_sys.getplayname(lotid, pm, cm).indexOf("任")!=-1){
					html +=  matchopencode(lotid, pm, tmpCode[0], oc);
				}else{
					html +=  matchopencode2(lotid, pm, tmpCode[0], oc);
				}
				
			}else{
				html += tmpCode[0];
			}
		}	
		if (i != codes.length - 1) {
			html += '<br/>';
		}
	}
	return html;
};
var matchopencode2 = function (lotid, pm, cd, win){
	var rc = "";
	var wf = $_sys.getplayname(lotid, pm, 0);
	if(win == '' || win == undefined){
		rc = cd;
	}else{
	rc+=arrmatch2(cd, win, "cm_red cm_bold", ",");
	if(wf!=""){
		rc = '[' + wf + ']' + rc;
	}
	
//	rc=rc.replace("|", "&nbsp;┃&nbsp;");
	}
	rc=rc.replaceAll(",", "&nbsp;|&nbsp;");
	return rc;
	
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
				rc+= "[前胆:" + arrmatch(dan[0], wl, "cm_red cm_bold", ",") +"]&nbsp;";
				rc+= "&nbsp;&nbsp;[前拖:" + arrmatch(dan[1], wl, "cm_red cm_bold", ",") +"]&nbsp;&nbsp;";
			}else{
				var dan = cl.split("$");
				rc+= "&nbsp;&nbsp;[胆:" + arrmatch(dan[0], wl, "cm_red cm_bold", ",") +"]&nbsp;&nbsp;&nbsp;" + arrmatch(dan[1], wl, "cm_red cm_bold", ",") ;
			}
			
			
		}else{
			rc+= arrmatch(cl, wl, "cm_red cm_bold", ",");
		}
		
		if(lotid != "07" && lotid !="54"&& lotid !="56"){
			if(cr.indexOf("$")!=-1){
				var dan = cr.split("$");
				rc+= "[后胆:" + arrmatch(dan[0], wr, "blue cm_bold", ",") +"]&nbsp;";
				rc+= "[后拖:" + arrmatch(dan[1], wr, "blue cm_bold", ",") +"]";
			}
			else{
				rc+="|";
				rc+=arrmatch(cr, wr, "blue cm_bold", ",");
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
			r+= "<font class='"+c+"'>" + ar[i] + "</font>";
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
			r+= "<font class='"+c+"'>" + ar[i] + "</font>";
		}else{
			
			r+= ar[i].replace(wr[i], "<font class='"+c+"'>" + wr[i] + "</font>");
		}
		if(i!=(ar.length-1)){
			r+= ",";
		}
	}
	return r;
};

$_sys.showzhanjii = function (lotid,uid,au,ag,func){
	if (typeof(func)=='undefined'){
		func='';
	}
	return uid=='******'?$_sys.showzhanji(au,ag):('<a href="javascript:void(0);" onclick="Y.openUrl(\'/game/zhanji.html?lotid='+lotid+'&uid='+uid+'&func='+func+'\',807,600)">'+$_sys.showzhanji(au,ag)+'</a>');
};

$_sys.showzhanjiname = function (lotid,uid,func){
	if (typeof(func)=='undefined'){
		func='';
	}
	if(uid == '******'){return '<a href="javascript:void(0);"><b>' + uid + '</b></a>';}
	return '<a href="javascript:void(0);" onclick="Y.openUrl(\'/game/zhanji.html?lotid='+lotid+'&uid='+uid+'&func='+func+'\',807,600)">'+uid+'</a>';
};
$_sys.showlishizhanji = function (lotid,uid,func){
	if (typeof(func)=='undefined'){
		func='';
	}
	if(uid == '******'){return '<a href="javascript:void(0);">历史战绩</a>';}
	return '<a href="javascript:void(0);" class="uname" onclick="Y.openUrl(\'/game/zhanji.html?lotid='+lotid+'&uid='+uid+'&func='+func+'\',807,600)">历史战绩&gt;&gt;</a>';
};

$_sys.showzhanji= function(au,ag){
	var html="";
	 var yb='<b class="b$1 jj"></b>';//星星
	 var zhuan='<b class="b1_$1 jj"></b>';//月亮
	 var zuan='<b class="b2_$1 jj"></b>';//太阳 
	 var hg='<b class="b2_$1 jj"></b>';//太阳+
	 if (Math.floor(au / 1000) > 0){//如果有太阳+
		 html+=hg.replace('$1', Math.floor(au/1000));//太阳+个数
		 var a=au % 1000;//余数
		 if (a >0){
			 if (Math.floor(a/100)>0){//余数
				 html+=zuan.replace('$1', Math.floor(a/100));			 
				 var b= a % 100;
				 if (Math.floor(b/10)>0){//余数后
					 html+=zhuan.replace('$1', Math.floor(b/10));			 
					 var b= a % 10;
					 if (b>0){
						 html+=yb.replace('$1',b);
					 }
				 }else{
					 html+=yb.replace('$1', b);
				 }
			 }else{
				 if (Math.floor(a/10)>0){//余数后
					 html+=zhuan.replace('$1', Math.floor(a/10));			 
					 var b= a % 10;
					 if (b>0){
						 html+=yb.replace('$1',b);
					 }
				 }else{
					 html+=yb.replace('$1', a);
				 }
			 }
		 }	 
	 }else if (Math.floor(au / 100) > 0){//如果有太阳
		 html+=zuan.replace('$1', Math.floor(au/100));//
		 var a=au % 100;//
		 if (a >0){
			 if (Math.floor(a/10)>0){//余数后
				 html+=zhuan.replace('$1', Math.floor(a/10));			 
				 var b= a % 10;
				 if (b>0){
					 html+=yb.replace('$1',b);
				 }
			 }else{
				 html+=yb.replace('$1', a);
			 }
		 }	 
	 }else if (Math.floor(au/10) >0){
		 html+=zhuan.replace('$1', Math.floor(au/10));		 
		 var a= au % 10;
		 if (a>0){
			 html+=yb.replace('$1',a);
		 }	
	 }else if (au >0){	
			html+=yb.replace('$1', au);	
	 }
	 return html;
};

$_sys.getsp=function(sprow,spname){
	var sp=sprow.split(";");
	for (var i=0;i<sp.length;i++){
		if (sp[i].substr(0,spname.length+1)==spname+':'){
			return sp[i].substr(spname.length+1,sp[i].length);
		}
	}
};

$_sys.getrz=function(rsrow,num){
	var rs=rsrow.split(";");
	if (rs.length-1<num){
		return "";
	}
	var tmp =rs[num].split(":");
	return tmp[0];			
};
$_sys.getrs=function(rsrow,num){
	var rs=rsrow.split(";");
	if (rs.length-1<num){
		return "";
	}
	var tmp =rs[num].split(":");
	if(tmp.length >= 2 && tmp[1].indexOf(".")!=-1){
		return tmp[1].substring(0,tmp[1].indexOf(".")+3);
	}else{
		return tmp[1];
	}
};

$_sys.lot = [];
$_sys.lot.push([ 1, "双色球","ssq", "" ]);
$_sys.lot.push([ 3, "福彩3D","fc3d", "" ]);
$_sys.lot.push([ 4, "时时彩","ssc", "" ]);
$_sys.lot.push([ 7, "七乐彩","qlc", "" ]);
$_sys.lot.push([ 20, "新时时彩","xssc", "" ]);

$_sys.lot.push([ 50, "超级大乐透","dlt", "" ]);
$_sys.lot.push([ 51, "七星彩","qxc", "" ]);
$_sys.lot.push([ 52, "排列五","p5", "" ]);
$_sys.lot.push([ 53, "排列三","p3", "" ]); 
$_sys.lot.push([ 54, "11选5","11x5" ]);
$_sys.lot.push([ 56, "十一运夺金","11ydj" ]);

$_sys.lot.push([ 80, "胜负彩","zc", "" ]);
$_sys.lot.push([ 81, "任选九","r9", "" ]);
$_sys.lot.push([ 82, "进球彩","jqc", ""  ]);
$_sys.lot.push([ 83, "半全场","bqc", ""  ]);

$_sys.lot.push([ 85, "北单胜平负","dc_spf", "" ]);
$_sys.lot.push([ 86, "北单猜比分","dc_bf", "" ]);
$_sys.lot.push([ 87, "北单半全场","dc_bqc", "" ]);
$_sys.lot.push([ 88, "北单上下单双","dc_sxds", "" ]);
$_sys.lot.push([ 89, "北单进球数","dc_jqs", "" ]);

$_sys.lot.push([ 70, "竞彩混投","jc_hh", "" ]);
$_sys.lot.push([ 72, "竞彩让球","jc_rqspf", "" ]);
$_sys.lot.push([ 90, "竞彩胜平负","jc_spf", "" ]);
$_sys.lot.push([ 91, "竞彩猜比分","jc_bf", "" ]);
$_sys.lot.push([ 92, "竞彩半全场","jc_bqc", "" ]);
$_sys.lot.push([ 93, "竞彩进球数","jc_jqs", "" ]);

$_sys.lot.push([ 71, "篮彩混投","lc_hh", "" ]);
$_sys.lot.push([ 94, "篮彩胜负","lc_sf", "" ]);
$_sys.lot.push([ 95, "篮彩让分胜负","lc_rfsf", "" ]);
$_sys.lot.push([ 96, "篮彩胜分差","lc_sfc", "" ]);
$_sys.lot.push([ 97, "篮彩大小分","lc_dxf", "" ]);

$_sys.lot.push([ 98, "世界杯猜冠军","worldcup", "" ]);
$_sys.lot.push([ 99, "世界杯猜冠亚军","worldcup", "" ]);

$_sys.lottype = [];
$_sys.lottype.push([ "世界杯", "worldcup", "98,99" ]);
$_sys.lottype.push([ "竞彩足球", "jczq", "90,72,91,92,93,70" ]);
$_sys.lottype.push([ "北京单场", "bjdc", "85,86,87,88,89" ]);
$_sys.lottype.push([ "竞彩篮球", "jclq", "94,95,96,97,71" ]);
$_sys.lottype.push([ "足 彩", "zc", "80,81,82,83" ]);



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
$_sys.worldcup = [];
$_sys.worldcup.push([ 1, "巴西"]);
$_sys.worldcup.push([ 2, "德国"]);
$_sys.worldcup.push([ 3, "阿根廷"]);
$_sys.worldcup.push([ 4, "西班牙"]);
$_sys.worldcup.push([ 5, "比利时"]);
$_sys.worldcup.push([ 6, "荷兰"]);
$_sys.worldcup.push([ 7, "意大利"]);
$_sys.worldcup.push([ 8, "法国"]);
$_sys.worldcup.push([ 9, "葡萄牙"]);
$_sys.worldcup.push([ 10, "哥伦比亚"]);
$_sys.worldcup.push([ 11, "乌拉圭"]);
$_sys.worldcup.push([ 12, "英格兰"]);
$_sys.worldcup.push([ 13, "智利"]);
$_sys.worldcup.push([ 14, "俄罗斯"]);
$_sys.worldcup.push([ 15, "科特迪瓦"]);
$_sys.worldcup.push([ 16, "瑞士"]);
$_sys.worldcup.push([ 17, "日本"]);
$_sys.worldcup.push([ 18, "波黑"]);
$_sys.worldcup.push([ 19, "克罗地亚"]);
$_sys.worldcup.push([ 20, "厄瓜多尔"]);
$_sys.worldcup.push([ 21, "墨西哥"]);
$_sys.worldcup.push([ 22, "美国"]);
$_sys.worldcup.push([ 23, "加纳"]);
$_sys.worldcup.push([ 24, "尼日利亚"]);
$_sys.worldcup.push([ 25, "希腊"]);
$_sys.worldcup.push([ 26, "韩国"]);
$_sys.worldcup.push([ 27, "喀麦隆"]);
$_sys.worldcup.push([ 28, "澳大利亚"]);
$_sys.worldcup.push([ 29, "哥斯达黎加"]);
$_sys.worldcup.push([ 30, "洪都拉斯"]);
$_sys.worldcup.push([ 31, "伊朗"]);
$_sys.worldcup.push([ 32, "阿尔及利亚"]);
$_sys.getteamname = function(f,n) {
if (typeof(n)=='undefined'){n=1;};
for ( var i = 0; i < $_sys.worldcup.length; i++) {
if ($_sys.worldcup[i][0] == f) {
return $_sys.worldcup[i][n];
}
}
};
$_sys.getteamnum = function(f,n) {
if (typeof(n)=='undefined'){n=0;};
for ( var i = 0; i < $_sys.worldcup.length; i++) {
if ($_sys.worldcup[i][1] == f) {
return $_sys.worldcup[i][n];
}
}
};
$_sys.worldcupgyj = [];
$_sys.worldcupgyj.push([ 1, "巴西—阿根廷"]);$_sys.worldcupgyj.push([ 2, "德国—阿根廷"]);$_sys.worldcupgyj.push([ 3, "巴西—西班牙"]);
$_sys.worldcupgyj.push([ 4, "巴西—德国"]);$_sys.worldcupgyj.push([ 5, "阿根廷—西班牙"]);$_sys.worldcupgyj.push([ 6, "巴西—荷兰"]);
$_sys.worldcupgyj.push([ 7, "巴西—葡萄牙"]);$_sys.worldcupgyj.push([ 8, "德国—西班牙"]);$_sys.worldcupgyj.push([ 9, "德国—葡萄牙"]);
$_sys.worldcupgyj.push([ 10, "西班牙—荷兰"]);$_sys.worldcupgyj.push([ 11, "巴西—意大利"]);$_sys.worldcupgyj.push([ 12, "巴西—智利"]);
$_sys.worldcupgyj.push([ 13, "德国—荷兰"]);$_sys.worldcupgyj.push([ 14, "西班牙—葡萄牙"]);$_sys.worldcupgyj.push([ 15, "西班牙—智利"]);
$_sys.worldcupgyj.push([ 16, "巴西—乌拉圭"]);$_sys.worldcupgyj.push([ 17, "阿根廷—法国"]);$_sys.worldcupgyj.push([ 18, "巴西—哥伦比亚"]);
$_sys.worldcupgyj.push([ 19, "巴西—法国"]);$_sys.worldcupgyj.push([ 20, "巴西—英格兰"]);$_sys.worldcupgyj.push([ 21, "德国—意大利"]);
$_sys.worldcupgyj.push([ 22, "德国—乌拉圭"]);$_sys.worldcupgyj.push([ 23, "德国—智利"]);$_sys.worldcupgyj.push([ 24, "阿根廷—葡萄牙"]);
$_sys.worldcupgyj.push([ 25, "西班牙—法国"]);$_sys.worldcupgyj.push([ 26, "西班牙—意大利"]);$_sys.worldcupgyj.push([ 27, "德国—哥伦比亚"]);
$_sys.worldcupgyj.push([ 28, "德国—法国"]);$_sys.worldcupgyj.push([ 29, "阿根廷—哥伦比亚"]);$_sys.worldcupgyj.push([ 30, "阿根廷—荷兰"]);
$_sys.worldcupgyj.push([ 31, "西班牙—乌拉圭"]);$_sys.worldcupgyj.push([ 32, "德国—英格兰"]);$_sys.worldcupgyj.push([ 33, "西班牙—哥伦比亚"]);
$_sys.worldcupgyj.push([ 34, "西班牙—英格兰"]);$_sys.worldcupgyj.push([ 35, "法国—荷兰"]);$_sys.worldcupgyj.push([ 36, "法国—葡萄牙"]);
$_sys.worldcupgyj.push([ 37, "阿根廷—意大利"]);$_sys.worldcupgyj.push([ 38, "阿根廷—智利"]);$_sys.worldcupgyj.push([ 39, "荷兰—葡萄牙"]);
$_sys.worldcupgyj.push([ 40, "阿根廷—乌拉圭"]);$_sys.worldcupgyj.push([ 41, "阿根廷—英格兰"]);$_sys.worldcupgyj.push([ 42, "法国—意大利"]);
$_sys.worldcupgyj.push([ 43, "意大利—荷兰"]);$_sys.worldcupgyj.push([ 44, "意大利—葡萄牙"]);$_sys.worldcupgyj.push([ 45, "葡萄牙—英格兰"]);
$_sys.worldcupgyj.push([ 46, "哥伦比亚—智利"]);$_sys.worldcupgyj.push([ 47, "法国—英格兰"]);$_sys.worldcupgyj.push([ 48, "乌拉圭—哥伦比亚"]);
$_sys.worldcupgyj.push([ 49, "乌拉圭—智利"]);$_sys.worldcupgyj.push([ 50, "其它—其它"]);
$_sys.getteamname2 = function(f,n) {
if (typeof(n)=='undefined'){n=1;};
for ( var i = 0; i < $_sys.worldcupgyj.length; i++) {
if ($_sys.worldcupgyj[i][0] == f) {
return $_sys.worldcupgyj[i][n];
}
}
}; 

$_sys.lotpath = [];
$_sys.lotpath.push([ 1, "/shuangseqiu/" ]);
$_sys.lotpath.push([ 3, "/3d/" ]);
$_sys.lotpath.push([ 4, "/ssc/" ]);
$_sys.lotpath.push([ 7, "/qilecai/" ]);
$_sys.lotpath.push([ 20, "/nssc/" ]);

$_sys.lotpath.push([ 50, "/daletou/" ]);
$_sys.lotpath.push([ 51, "/qixingcai/" ]);
$_sys.lotpath.push([ 52, "/paiwu/" ]);
$_sys.lotpath.push([ 53, "/paisan/" ]);

$_sys.lotpath.push([ 80, "/zc/" ]);
$_sys.lotpath.push([ 81, "/renjiu/" ]);
$_sys.lotpath.push([ 82, "/jinqiu/" ]);
$_sys.lotpath.push([ 83, "/banquan/" ]);

$_sys.lotpath.push([ 85, "/bj/" ]);
$_sys.lotpath.push([ 86, "/bj/" ]);
$_sys.lotpath.push([ 87, "/bj/" ]);
$_sys.lotpath.push([ 88, "/bj/" ]);
$_sys.lotpath.push([ 89, "/bj/" ]);

$_sys.lotpath.push([ 70, "/jc/" ]);
$_sys.lotpath.push([ 72, "/jc/" ]);
$_sys.lotpath.push([ 90, "/jc/" ]);
$_sys.lotpath.push([ 91, "/jc/" ]);
$_sys.lotpath.push([ 92, "/jc/" ]);
$_sys.lotpath.push([ 93, "/jc/" ]);

$_sys.lotpath.push([ 71, "/lc/" ]);
$_sys.lotpath.push([ 94, "/lc/" ]);
$_sys.lotpath.push([ 95, "/lc/" ]);
$_sys.lotpath.push([ 96, "/lc/" ]);
$_sys.lotpath.push([ 97, "/lc/" ]);


$_sys.zhflag = [];
$_sys.zhflag.push([ "中奖后不停止" ]);// 0
$_sys.zhflag.push([ "中奖后停止" ]);// 1
$_sys.zhflag.push([ "中奖后盈利停止" ]);// 2

//0 未完成 1 已投注完成 2 中奖停止 3 用户手工停止
$_sys.zhreason =[];
$_sys.zhreason.push(["未完成"]);
$_sys.zhreason.push(["已投注完成"]);
$_sys.zhreason.push(["中奖停止"]);
$_sys.zhreason.push(["用户手工停止"]);

//0 对所有人公开 1 截止后公开 2 对参与人员公开 3 截止后对参与人公开
$_sys.iopen=[];
$_sys.iopen.push(["对所有人公开"]);
$_sys.iopen.push(["截止后公开"]);
$_sys.iopen.push(["对参与人员公开"]);
$_sys.iopen.push(["截止后对参与人公开"]);

$_sys.getlotname = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.lot.length; i++) {
		if ($_sys.lot[i][0] == f) {
			return $_sys.lot[i][n];
		}
	}
};
$_sys.getlotlogo = function(f,n) {
	if (typeof(n)=='undefined'){n=2;};
	for ( var i = 0; i < $_sys.lot.length; i++) {
		if ($_sys.lot[i][0] == f) {
			return $_sys.lot[i][n];
		}
	}
};

$_sys.getlotid = function(f) {
	for ( var i = 0; i < $_sys.lot.length; i++) {
		if ($_sys.lot[i][1] == f) {
			return $_sys.lot[i][0];
		}
	}
};

$_sys.getlotpath = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.lotpath.length; i++) {
		if ($_sys.lotpath[i][0] == Y.getInt(f)) {
			return $_sys.lotpath[i][n];
		}
	}
};

$_sys.grade_def = [];
$_sys.grade_def.push([ 80, "一等奖,二等奖" ]);
$_sys.grade_def.push([ 81, "一等奖" ]);
$_sys.grade_def.push([ 82, "一等奖" ]);
$_sys.grade_def.push([ 83, "一等奖" ]);

$_sys.grade_def.push([ 01, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 03, "直选,组选三,组选六" ]);
$_sys.grade_def.push([ 04, "五星奖,三星奖,二星奖,一星奖,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖" ]);
$_sys.grade_def.push([ 07, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖" ]);
$_sys.grade_def.push([ 20, "五星奖,四星一等奖,四星二等奖,三星奖,二星奖,一星奖,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖,任选一,任选二,三星组三,三星组六" ]);

$_sys.grade_def.push([ 50, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖,,宝钻一等奖,宝钻二等奖,宝钻三等奖,宝钻四等奖"]);
$_sys.grade_def.push([ 51, "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖" ]);
$_sys.grade_def.push([ 52, "一等奖" ]);
$_sys.grade_def.push([ 53, "直选,组三,组六" ]);
$_sys.grade_def.push([ 54, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 56, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);
$_sys.grade_def.push([ 55, "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选" ]);

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
$_sys_getnewwininfo = function(lotid, wininfo) {
	var tmp = [];
	if (lotid==85||lotid==86||lotid==87||lotid==88||lotid==89
			||lotid==90
			||lotid==91
			||lotid==92
			||lotid==93||lotid==94||lotid==95||lotid==96||lotid==97||lotid==98||lotid==99||lotid==70||lotid==71||lotid==72
			){		
		wininfo = wininfo.split("|");
		if (wininfo.length>=3){
			tmp.push([ "", "过关方式： "+wininfo[2].replaceAll("\\*", "串")+", 中<em>"+wininfo[0]+"</em>注<br/>" ]);
		}		
	}else{
		if(wininfo.length > 0){
			wininfo = wininfo.split(",");
			var grade = $_sys.getgrade(lotid);
			if (wininfo.length > 0 && wininfo.length <= grade.length) {
				for ( var i = 0; i < wininfo.length; i++) {
					if (wininfo[i] > 0) {
						tmp.push([ grade[i],"<em>"+ wininfo[i]+"</em>注<br/>" ]);
					}
				}
			}
		}
	}	
	return tmp;
};
/**
 * 为方案详情提供目录匹配
 */
$_sys.lotfordetail = [];
$_sys.lotfordetail.push([ 1, "/shuangseqiu/" ]);
$_sys.lotfordetail.push([ 3, "/3d/" ]);
$_sys.lotfordetail.push([ 4, "/ssc/" ]);
$_sys.lotfordetail.push([ 7, "/qilecai/" ]);
$_sys.lotfordetail.push([ 20, "/nssc/" ]);

$_sys.lotfordetail.push([ 50, "/daletou/" ]);
$_sys.lotfordetail.push([ 51, "/qixingcai/" ]);
$_sys.lotfordetail.push([ 52, "/paiwu/" ]);
$_sys.lotfordetail.push([ 53, "/paisan/" ]);

$_sys.lotfordetail.push([ 54, "/11x5/" ]);
$_sys.lotfordetail.push([ 56, "/11ydj/" ]);

$_sys.lotfordetail.push([ 80, "/zc/" ]);
$_sys.lotfordetail.push([ 81, "/renjiu/" ]);
$_sys.lotfordetail.push([ 82, "/jinqiu/" ]);
$_sys.lotfordetail.push([ 83, "/banquan/" ]);

$_sys.lotfordetail.push([ 85, "/bj/" ]);
$_sys.lotfordetail.push([ 86, "/bj/" ]);
$_sys.lotfordetail.push([ 87, "/bj/" ]);
$_sys.lotfordetail.push([ 88, "/bj/" ]);
$_sys.lotfordetail.push([ 89, "/bj/" ]);

$_sys.lotfordetail.push([ 70, "/jc/" ]);
$_sys.lotfordetail.push([ 72, "/jc/" ]);
$_sys.lotfordetail.push([ 90, "/jc/" ]);
$_sys.lotfordetail.push([ 91, "/jc/" ]);
$_sys.lotfordetail.push([ 92, "/jc/" ]);
$_sys.lotfordetail.push([ 93, "/jc/" ]);

$_sys.lotfordetail.push([ 71, "/lc/" ]);
$_sys.lotfordetail.push([ 94, "/lc/" ]);
$_sys.lotfordetail.push([ 95, "/lc/" ]);
$_sys.lotfordetail.push([ 96, "/lc/" ]);
$_sys.lotfordetail.push([ 97, "/lc/" ]);

$_sys.lotfordetail.push([ 98, "/worldcup/" ]);
$_sys.lotfordetail.push([ 99, "/worldcup/" ]);

$_sys.getlotdir = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.lotfordetail.length; i++) {
		if ($_sys.lotfordetail[i][0] == Y.getInt(f)) {
			return $_sys.lotfordetail[i][n];
		}
	}
};

$_sys.showerr = function(desc){
	alert(desc);
	if (history.length == 0) {
		window.opener = '';
		window.close();
	} else {
		history.go(-1);
	}	
};

// 交易类型定义
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


$_sys.addmoneytype = [];
$_sys.addmoneytype.push([ 1, "快钱" ]);
$_sys.addmoneytype.push([ 2, "财付通" ]);
$_sys.addmoneytype.push([ 3, "支付宝" ]);
$_sys.addmoneytype.push([ 4, "百付宝" ]);
$_sys.addmoneytype.push([ 5, "手机充值卡" ]);
$_sys.addmoneytype.push([ 6, "银联手机支付" ]);
$_sys.addmoneytype.push([ 9, "手机充值卡" ]);
$_sys.addmoneytype.push([ 11, "联动优势" ]);
$_sys.addmoneytype.push([ 12, "连连支付" ]);

$_sys.getaddmoneyname=function(f){
	for ( var i = 0; i < $_sys.addmoneytype.length; i++) {
		if ($_sys.addmoneytype[i][0] == f) {
			return $_sys.addmoneytype[i][1];
		}
	}
};

$_sys.bankid_def = [];
$_sys.bankid_def.push([1,"快钱支付"]);
$_sys.bankid_def.push([3,"支付宝支付"]);
$_sys.bankid_def.push([5,"手机充值卡"]);
$_sys.bankid_def.push([6,"银联手机支付"]);
$_sys.bankid_def.push([9,"手机充值卡"]);
$_sys.bankid_def.push([11,"联动优势支付"]);
$_sys.bankid_def.push([12,"连连支付"]);
$_sys.bankid_def.push([97,"提款失败转款"]);
$_sys.bankid_def.push([98,"代理商转入"]);
$_sys.bankid_def.push([99,"手工加款"]);

$_sys.getbankid = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	};
	for ( var i = 0; i < $_sys.bankid_def.length; i++) {
		if ($_sys.bankid_def[i][0] == f) {
			return $_sys.bankid_def[i][n].split(",");
		}
	}
};


$_sys.showcmemo = function (ibiztype,cmemo){
	var memo={};	
	ibiztype=Y.getInt(ibiztype);
	var memoarr=cmemo.split('|');
	if (memoarr.length>1){	
		switch (ibiztype){					
		case 200:
			memo.title=$_sys.getaddmoneyname(memoarr[0])+'充值  订单号:' +memoarr[1];
			memo.href='<font style="color:blue">'+memo.title+'</font>';
			break;				
		case 100:
		case 101:
		case 103:
			memo.title=$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="'+$_sys.getlotdir(memoarr[0])+$_sys.url.viewpath+'?lotid='+memoarr[0]+'&projid='+memoarr[1]+'" target="_blank" >'+$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype)+'</a>';
			break;
		case 105:
			memo.title=$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="' + $_sys.getlotdir(memoarr[0]) + $_sys.url.viewpath+'?lotid='+memoarr[0]+'&projid='+memoarr[1].split('[')[0]+'" target="_blank" >'+$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype)+'</a>';
			break;
		case 201:		
		case 202:
		case 203:	
		case 210:
		case 211:	
		case 215:			
			memo.title=$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="' + $_sys.getlotdir(memoarr[0]) + $_sys.url.viewpath+'?lotid='+memoarr[0]+'&projid='+memoarr[1]+'" target="_blank" >'+$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype)+'</a>';
			break;				
		case 102:
			memo.title=$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="/account/xchase.html?zid='+memoarr[1]+'&lotid='+memoarr[0]+'"          >'+$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype)+'</a>';
			break;	
		case 212:
			var NT=memoarr[0].split('ZH');
			memo.title=$_sys.getlotname(NT[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="/account/xchase.html?zid='+memoarr[0]+'&lotid='+NT[0]+'"          >'+$_sys.getlotname(NT[0])+$_sys.biztype(ibiztype)+'</a>';
			break;	
		case 204:	
			memo.title=$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype);
			memo.href='<a href="/account/xchase.html?zid='+memoarr[2]+'&lotid='+memoarr[0]+'"          >'+$_sys.getlotname(memoarr[0])+$_sys.biztype(ibiztype)+'</a>';
			break;	
		case 300:
			memo.title="转款";
			memo.href=memoarr[0];
			break;
		case 213:	
		default:
			break;
		}
	}
	return memo;
};


$_sys.castdef = [];
$_sys.castdef.push([ 1, "单式" ]);
$_sys.castdef.push([ 2, "复式" ]);
$_sys.castdef.push([ 3, "包号" ]);
$_sys.castdef.push([ 4, "和值" ]);
$_sys.castdef.push([ 5, "胆拖" ]);

$_sys.getcastdefname = function(f) {
	for ( var i = 0; i < $_sys.castdef.length; i++) {
		if ($_sys.castdef[i][0] == f) {
			return $_sys.castdef[i][1];
		}
	}
};

$_sys.getplayname = function(lotid, playid, castdef) {
	var s = "";	
	lotid=Y.getInt(lotid);
	playid=Y.getInt(playid);
	castdef=Y.getInt(castdef);
	switch (lotid) {
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
	}
	return s;
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
				$("#"+gid+"_"+pid+"cawardcode").html(cawardcode);
			}
		}
	});
	return cawardcode;
};

function ScorllNum(n,inputs,fun){
	this.inputs = inputs;
	this.time = 30;
	this.maxNum = n;
	this.s = 0;
	var nb = this;
	this.fun = fun;
	this.setVal = setInterval(function(){nb.scroll(nb);},10);
}; 

ScorllNum.prototype.scroll = function(o){
	if(o.time > 0){
		o.time --;
		if(o.s<o.maxNum){o.s ++;}else{o.s = 0}
		var n = this.s<10? "0" + o.s:o.s;
		for(var k = 0; k < o.inputs.length;k++){
		o.inputs[k].value = n;
		}
	}else{
		clearInterval(o.setVal);
		o.fun();
	}
}; 

//数组随机排序
Array.prototype.aSort = function(method){
	function Sort(a,b){
		if(method == 0 || method == 1){
		if(a > b){if(method == 0){return 1;}else{ return -1;}}
		if(a < b){if(method == 0){return -1;}else{ return 1;}}
		else{return 0;}
		}
		else if(method == 2){return Math.random() > .5 ? -1 : 1;}   //用Math.random()函数生成0~1之间的随机数与0.5比较，返回-1或1
	}
	this.sort(Sort);
}; 

$_sys.getSub=function(ar,s){
	var l=ar.length;
	for(var i=0;i<l;i++){
		if(ar[i]==s){return i;}
	}
	return -1;	
};
//数组，数字排序
$_sys.sort= function(a, ad){
	var f = ad!="desc" ? function(a,b){return a-b} : function(a,b){return b-a};
	return a.sort(f);
};
//定义全局
Class.C('url-login-check', $_user.url.checklogin);
Class.C('url-login-user', $_user.url.base);
Class.C('url-login-safe', $_user.url.safe);
Class.C('url-login-yzm', '/rand.phpx');
Class.C('url-login-op', $_user.url.login);
Class.C('url-login-out', $_user.url.loginout);

String.prototype.isEmail = function(){
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this);
};
Class({
	ready: true,
    index:function (config){
    	$("#nav_main,#zq_xl,#bf_xl").css({
    		"height":0,
    		"overflow":"hidden"
    		});
    	$(".nav_re h2,#nav_main").hover(function(){
    		$("#nav_main").find("#nav_main").show();
			$("#nav_main").clearQueue().animate({
				height:640
				})
		},function(){
			$("#nav_main").animate({
				height:0
				})
		});
    	$("li.zqzx,#zq_xl").hover(function(){
    		$("#zq_xl").find("#zq_xl").show();
			$("#zq_xl").clearQueue().animate({
				height:90
				})
		},function(){
			$("#zq_xl").animate({
				height:0
				})
		});
    	$("li.bfzb,#bf_xl").hover(function(){
    		$("#bf_xl").find("#bf_xl").show();
			$("#bf_xl").clearQueue().animate({
				height:125
				})
		},function(){
			$("#bf_xl").animate({
				height:0
				})
		});
		 
    	var tmpUPage =(document.URL).split( "/" );
    	var thisUPage = tmpUPage[tmpUPage.length-2 ];
    	$("#naver li a").each(function(){
    	var Url=($(this).attr("href")).split( "/" )[1];
    	if(thisUPage==Url){
    	$(this).parent().addClass('cur').siblings().removeClass("cur");
    	}
    	}); 
		

    }

});
