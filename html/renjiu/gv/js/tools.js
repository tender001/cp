//接口
//var www = "http://"; //http://www.
var user = "http://user."; //用户中心地址
// var domain = "ssq2.cpdyj.com/"; //定义主域名
var domain = "/"; //定义主域名
var path = domain ;
var pathUser = user + domain;
$_img="http://static.cpdyj.com";

var allInterFace = {
	lottype : '', //彩种玩法（11x5）
	type : 1,//11x5
	dtype : 5,//页面标识(spf,jqs)
	typeHtml : "任选5",//任选5
	userInfo : {},//用户信息
	
	ssqExp : '',
	nextTimes : '',//定时器(抓下一期的期号)
	lotterTimes : '',//定时器(抓开奖号期号)
	upfileendtime : '',
	
	time : '',//全局时间
	serverTime : '',//服务器时间
	lottertime : '',//开奖时间
	endTime : '',//截止时间
	
	data : '',//保存数据
	chartDate : '',//保存绘图数据
	variable : {
		R2 : ["任选2",2,2,6],
		R3 : ["任选3",3,3,19],
		R4 : ["任选4",4,4,78],
		R5 : ["任选5",5,5,540],
		R6 : ["任选6",6,5,90],
		R7 : ["任选7",7,5,26],
		R8 : ["任选8",8,5,9],
		R1 : ["前一",1,1,13],
		Z2 : ["前二组选",2,2,65],
		Q2 : ["前二直选",2,2,130],
		Z3 : ["前三组选",3,3,195],
		Q3 : ["前三直选",3,3,1170]
	},
	login : {//登录的一些接口
		islogin_ : this.path + "user/islogin.go", //判断是否登录的接口
		usermoney_ : this.path + "user/queryusermoney.go", //检查用户金额接口
		rank_ : this.path + "user/fetchusersecurerank.go", //用户安全级别接口
		logout_ : this.path + "user/outlogin.go", // 用户登录退出接口
		login_ : this.path + "user/login.go" //登录表单验证
	}, 
	url : {
		/***********************投注*****************************/
		buyin : this.path + "trade/order.go", //投注
		/***********************追号*****************************/
		zh : 'http://intf2.cpdyj.com/data/dlc/zhlist.js',
		/***********************前10项数据列表*****************************/
		top : 'http://intf2.cpdyj.com/data/dlc/top.js',
		/***********************冷热号*****************************/
		lrh : 'http://intf2.cpdyj.com/data/dlc/lrh.js?ordertype=',
		/***********************开奖号*****************************/
		//http://intf2.cpdyj.com/data/dlc/opencode.js?issue=2013031340&callback=adafsdf
		lotterNum : 'http://intf2.cpdyj.com/data/dlc/opencode.js?issue=',
		/***********************查*****************************/
		search : 'http://intf2.cpdyj.com/data/dlc/zst.js',
		
		getexpect : this.path + "trade/getexpect.dyj",
		gettime : this.path + "web/getservertime.go"
		
		
		//http://intf2.cpdyj.com/data/dlc/todayhero.js?callback=adfadf
		//http://intf2.cpdyj.com/data/dlc/yesterdayhero.js?callback=adfadf
		//http://intf2.cpdyj.com/data/dlc/weekhero.js?callback=adfadf
		//http://intf2.cpdyj.com/data/dlc/monthhero.js?callback=adfadf
	}
};
var Tools = {
	//获得差在 拖码中的组合 数组
	transFormArray : function(obj,m){//[[a],[b],[c]]-->[[0,1],[0,2],[1,2]]
		var list = [];
		(function f(t, a, n) {
			if (n == 0) return list.push(t);
			for (var i = 0, l = a.length; i <= l - n; i++) {
				f(t.concat(a[i]), a.slice(i + 1), n - 1);
			}
		})([], obj, m);
		return list;
	}, 
	//计算CXy 的值,从X中任取y个数的组合数
	computeCombineNum : function(x,y){
		var a=1,b=1;
		for(var k=0;k<y;k++){
			a *= x-k;
			b *= k+1;
		}
		return	a/b;
	},
	//二维数组的定位组
	cl : function(a){
		var n = 0,
			array = [],
			code = [];
			allArr(a,n)
		function allArr(arr,n){
			if (n >= arr.length) {
				array.push(code.slice());
				code.length = n - 1;	
			}else{
				for (var i = 0, j = arr[n].length; i < j; i++) {
					code.push(arr[n][i]);
					allArr(arr, n+1);
				}
				if (n) {
					code.length = n - 1;
				}
			}
		}
		return array;
	},
	/*
	 *机选事件
	 *seed(number) 11
	 *len(number) 选几个数
	 *n(number) 选几注
	 *flag 
	 */
	calcRandom:function(seed,len,n,flag){
		n = typeof n ==='undefined' ? 1 : n;//机选注数
		var arr = [];
		for(var i = 0 ; i < n; i++){
			var array = [];
			for(var j = 0; j < len; j++){
				var v =Math.floor(Math.random()*seed+1);
				v = v < 10 ? "0"+v : ""+v;
				if($.inArray(v, array) ==-1){
					array.push(v);
				}else{
					j--;
				}
			}
			if(typeof flag ==='undefined'){//排序
				arr.push(array.sort(function compare(a, b){return a - b;}))
			}else{//不排序
				arr.push(array);
			}
		}
		return arr;
	},
	//计算和值、奇、大、质
	countNumber : function(arr){
		var h = 0,//和
		    j = 0,//奇
		    d = 0,//大
		    z = 0;//质
		var array = [2,3,5,7,11];//11以内的质数： 2 3 5 7 11
		for(var i = 0, l = arr.length; i < l; i++){
			var n = arr[i];
			h += Number(n);//和
			if(n%2==1)j++;//奇
			if(n>5)d++;//大
			for(var k = 0; k < array.length; k++){
				if(n ==array[k]) z++;//质
			}
		}
		return [h,j,d,z];
	},
	/*
	 * 取取小值的数组
	 * arr [[1,-2,3,4,3,6,7,2,5,10,16][23,9,3,4,28,5,7,-9,2,1,3]]
	 * return [1,-2,3,4,3,5,7,2,2,1,3]
	 */
	getminArr : function(arr){
		var array = [];
		if(arr.length ==1)return arr;
		for(var i = 0; i < 11; i++){
			var a = [];
			$.each(arr, function(j, item){   
				a.push(item[i]);		
		　　});
			var v = a.sort(function compare(a, b){return a - b});
			array.push(v[0])
		}
		return array;
	},
	//时间转化(t = 12321)
	showendtime : function(t){
		var o = {};
		var nMS=(t -1)*1000;
		o.d=Math.floor(nMS/(1000*60*60*24)); //天
		o.h=Math.floor(nMS/(1000*60*60)) ; //小时
		o.m=Math.floor(nMS/(1000*60)) % 60; //分钟
		o.s=Math.floor(nMS/1000) % 60; //秒
		o.m=o.m<10?"0"+o.m:o.m;
		o.s=o.s<10?"0"+o.s:o.s;
		var tt = '<b class="font14">'+o.h+'</b> 时 <b class="font14">'+o.m+'</b> 分 <b class="font14">'+o.s+'</b> 秒';
			if(t<=0){
			$("#loadTime").parent().hide();
			return;
		}else if(t>0){
			$("#loadTime").html(tt);
			setTimeout("Tools.showendtime("+(t -1)+")",1000);
		}
	},
	copyAdd :function(){
		var url = location.href;
		if(window.clipboardData) {
			window.clipboardData.clearData();
			var f=window.clipboardData.setData("Text", url);
			if(f){
				Common.dialog(page.alertErro("复制成功"));
			}else{
				Common.dialog(page.alertErro("您已经禁止本次复制操作，请刷新后再次复制！"));
			}
		} else{
			prompt("由于您使用的浏览器不支持自动复制\n请手动复制下面框中的地址，然后关闭对话框即可\n复制方法：在选中的地址上按ctrl+C或点鼠标右键选择手复制",url);
		}
	},
	 //获取服务器时间!
	load_time : function(f){
		var currentTime = Common.getAjax("/web/getservertime.go","获取服务器时间失败，请稍后重试!");
		var time = $(currentTime).find("time").attr("time");
		if(f)return time;
		allInterFace.s_time = Common.str2date(time);
	}, 
	//验证实名
	postCheckInfo : function(){
	    var realNmae = $("#realName").val();//真实姓名
		var realCode = $("#realCode").val();//身份证号
		var passWord = $("#passWord").val();//密码
		var errorAlert = $("#dialogError");
		if(realNmae.length > 0){
			if(/\s+/g.test(realNmae)){
				errorAlert.show().find("span").text("真实姓名中不能带有空格");
				return false;
			}
			if("^[\u4e00-\u9fa5]{0,}$".match(realNmae) ==0){
				errorAlert.show().find("span").text("请输入您的真实姓名");
				return false;
			}
		}else{
			errorAlert.show().find("span").text("真实姓名不能为空");
			return false;
		}
		if(realCode.length>0){
			if(!checkCard(realCode)){
				errorAlert.show().find("span").text("请输入您的真实身份证号码");
				return false;
			}
			if(realCode.length!=15){
				if(!checkAge(realCode)){
					errorAlert.show().find("span").text("您的身份证号显示您未满十八岁，请确认！");
					return false;
				}
			}
		}else{
			errorAlert.show().find("span").text("身份证号码不能为空");
			return false;
		}
		if(passWord.length == 0){
			errorAlert.show().find("span").text("请输入您的登录密码");
			return false;	
		}
		var url  = "/user/modifyuserinfo.go";
		var param ="frm=4&truename="+encodeURIComponent(realNmae)+"&idcode="+encodeURIComponent(realCode)+"&tzpass="+encodeURIComponent(passWord)+"&rnd="+Math.random();
		var obj = Common.getAjax(url,"",param);
		var Resp = $(obj).find("Resp");
		var c = Resp.attr("code");
		var cont = Resp.attr("desc");
		if (c == "0"){//成功
			$_window.close();
			Common.dialog(page.alertErro(cont));
		}else{
			Common.dialog(page.alertErro(cont));
		}
	}
};

var chartTools = {
	chart: {
		renderTo: 'container'//引用容器
	},
	title: {//主标题
		text: ''
	},
	subtitle: {//副标题
		text: ''
	},
	xAxis: {//x轴
		title: {
			text: ''
			//rotation: -50//控制y轴标题位置
		}
	},
	yAxis: [//y轴
		{//y轴
			title: {
				text: ''
				//rotation: -50//控制y轴标题位置
			},
			labels: {
				rotation: -50,//控制y轴标题位置
				formatter: function() {
					return this.value ;
				}
			} 
		}
		/*,
		{//y轴
			title: {
				text: 'Rainfall (°C)'
				//rotation: -50//控制y轴标题位置
			},
			labels: {
				rotation: -50,//控制y轴标题位置
				formatter: function() {
					return this.value +' mm';;
				}
			} ,
			opposite: true 
		}
		*/
	], 
	
	tooltip: {
		enabled: true,//默认false(不显示提示框)
		crosshairs: false,//默认false(不显示提示线)
		formatter: function() {
			return '<b>'+ this.series.name +'</b><br/> x:'+this.x +', y:'+ this.y ;
		}
	},
	credits: {//是否显示右下角标题
		enabled: false //(默认为true)
	},
	series :[
		{//数据
			type: 'line',//直线
			name: '周期走势图'
		}, 
		{
			type: 'line',//柱状
			name: '100天走势图'
		}
	]
}

/*
dyjtool.setCookies(
	[
		["islogin", true], 
		["username", user.attr("username")], 
		["pnusername", user.attr("pnusername")], 
		["isagent", user.attr("isAgent")], 
		["usertype", user.attr("usertype")]
	]
);
*/
//cookie工具
var dyjtool = {
	setCookies : function (a) {
		var l = a.length;
		for (var i = 0; i < l; i++) {
			$.cookie(a[i][0], a[i][1], {
				path : "/",
				domain : "www.cpdyj.com"
			});
		}
	}, 
	setCookisesName :function(name,val){
		$.cookie(name, val, { path : "/", domain : "www.cpdyj.com"});
	},
	getCookisesName : function(name){
	    return $.cookie(name); 
	},
	delCookies : function (a) {
		var l = a.length;
		for (var i = 0; i < l; i++) {
			$.cookie(a[i], null);
		}
	}
} 

//验证身份证
function checkCard(realCode){
    var idcard = realCode+'';
	if(idcard.length == 15){
		idcard = idcard.substr(0,6)+'19'+idcard.substr(6,15)+'x';
	}
	var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	if(aCity[parseInt(idcard.substr(0,2))] == null){
		return false;
	};
	if (!/^(\d{15}|\d{18}|\d{17}(X|x))$/.test(idcard)){
		return false;
	};
	var sBirthday = idcard.substr(6,4)+"-"+Number(idcard.substr(10,2))+"-"+Number(idcard.substr(12,2));
	var d = new Date(sBirthday.replace(/-/g,"/"));
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())){
		return false;
	}
	var subYear = idcard.substr(6,4);
	var mydate = new Date();
	var CurrentyYear = mydate.getFullYear();
	if((CurrentyYear - subYear) >= 100){
		return false;
	}
	return true;
}

//检验身份证的年龄
function checkAge(IDCard){
	var today = new Date();
	var year=today.getFullYear() ;
	if (IDCard.length==15){
		return true;
	}else{
		if (parseFloat(year)-parseFloat(IDCard.substr(6,4))<18){
			return false;
		}
	}
	return true;
};

Date.prototype.format = function(format){
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1 ? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}

Date.prototype.dateadd = function(interval,number) 
{ 
    var d = this; 
    var k={'y':'FullYear', 'q':'Month', 'm':'Month', 'w':'Date', 'd':'Date', 'h':'Hours', 'n':'Minutes', 's':'Seconds', 'ms':'MilliSeconds'}; 
    var n={'q':3, 'w':7}; 
    eval('d.set'+k[interval]+'(d.get'+k[interval]+'()+'+((n[interval]||1)*number)+')'); 
    return d; 
} 