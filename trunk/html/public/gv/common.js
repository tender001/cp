;var CommonUrl = {
	href : "www.cpdyj.com",//首页
	// buyhistory : "http://trade.cpdyj.com/trade/user/buyhistory.html",//用户购买历史地址   2013.7.5 qiu切换新的购买历史地址
	// starhistory: "http://trade.cpdyj.com/trade/user/starhistory.html",//用户奖牌
	buyhistory : "http://user.cpdyj.com/history/buyhistory.html",//用户购买历史地址
	starhistory: "http://user.cpdyj.com/history/starhistory.html",//用户奖牌
	pursueRecord: "http://trade.cpdyj.com/user/manage/rundetail.html" //查看追号记录
}
var Common = {
	/*
	 * ajax请求
	 * url
	 * state(post,get)
	 * datas(param参数)
	 * types(jsonp,xml,html...)
	 * callbackName(jsonp返回的方法名)
	 * callbackName(回调方法)
	 */
	getAjax : function (url,state,datas,types,callbackName,Fun,async){
	    var obj,callbackFunName = '';
		var state = state == 'post' ? 'post' : 'get';
	    var data = (datas && typeof(datas) !="undefined") ? datas : '';
		var type =(types && typeof(types) !="undefined") ? types : 'xml';
		if(types == 'jsonp') callbackFunName =  callbackName;
		async = async ? async : false;
		$.ajax({
			url : url,
			type : state,
			data : data,
			dataType : type,
			jsonpCallback : callbackFunName,
			async: async,//同步
			cache: false,//(默认: true) 设置为 false 将不缓存此页面。
			timeout : 10000,
			error : function (xml) {
				 //if(msg == 'undefined')msg=xml;
				 //alert(xml);
			},
			success : function (xml) {
				if(types == 'jsonp'){
					if(Fun instanceof Function) return Fun(xml);  
				}else{
					obj = xml;
				}
			}
		});
		return obj;
	},
	/**
	 * 动态加载js
	 */
	loadJS : function(id,fileUrl){ 
		var scriptTag = document.getElementById( id ); 
		var oHead = document.getElementsByTagName("HEAD").item(0); 
		var oScript= document.createElement("script"); 
		if (scriptTag) oHead.removeChild(scriptTag); 
		oScript.id = id; 
		oScript.type = "text/javascript"; 
		oScript.src=fileUrl ; 
		oHead.appendChild( oScript); 
	},
	/*
	 * http:www.cpdyj.com?a=0&b=1
	 * s==a return ['a','0']
	 * return [['a','0'],['b','1']]
	 */
	href : function (s){
	    var arr =[];
	    var url = location.href;
		var str = url.split("?")[1];
		if(typeof str !=="undefined"){
		    for(var i = 0, l = str.split("&").length; i < l; i++){
				var a =[];
				a.push(str.split("&")[i].split("=")[0]);		
				a.push(str.split("&")[i].split("=")[1]);
				arr.push(a);			
			}
		}
		if(typeof s !=="undefined" && arr.length>0){
		    for(var j = 0, l = arr.length; j < l; j++){
		        if(s == arr[j][0]){
				    return arr[j][1];
				}
		    }
			return "";
		}	
		return arr;
	},
	/*
	 * 弹出框
	 * msg ：内容
	 * title ： 标题
	 * width:宽度
	 * height:高度
	 * scroll：跟着滚动条一起滚动
	 */
	dialog : function(msg,title,width,height,scroll){
	    var t = (title == null || title == "") ? '提示': title;
		var w = (width == null || width == "") ? 385 : width;
		var h = (height == null || height == "") ? 155 : height;
		var opts = {
			message : '',
			theme : true,
			//draggable : true,
			title : t,
			themedCSS : {
				backgroundColor : 'white',
				top : 0 + 'px',
				left :0 +'px',
				width : w,
				height : h
			}
		};
		opts.message = msg; 
//		$.blockUI(opts);
		$('.dialog-close').die("click").live("click",function(){
			$.unblockUI($(this));	
		});
		if($(".dialog").length > 0){
		    $(".dialog").each(function(i){
			    var thiss_ = $(this).attr("id");
			    var x = ($(window).width() - $(this).width()) / 2;
				var _y = ($(window).height() - $("#"+thiss_).height()) / 2;
				var y = $(document).scrollTop() + _y;
				$(this).css({"left":x,"top":y});
				if(!scroll)Common.scroll(_y,$(this));
			})
			$(".dialog-overlay").height($("body").height());
		}
	},
	scroll : function(y,obj){
		$(window).scroll(function(){
			obj.css({"top":$(document).scrollTop() + y});
		})
	},
	random : function(){//产生随机数
		return Math.random();
	},
	/*
	 * 文本框只能输入数字
	 * id ：id
	 * callbackblur ： blur
	 * callbackkeyup:  keyup
	 */
	isNum : function(id,callbackblur,callbackkeyup){
	    $("#"+id).unbind().bind({
			keyup:function(){
				$(this).val($(this).val().replace(/[^\d]/g,''));
				if(callbackkeyup instanceof Function) callbackkeyup($(this).val());
			},
			blur:function(e,f){
				if(callbackblur instanceof Function) callbackblur($(this).val(),f);
			}
		}); 
	},
    //日期转化函数
	str2date : function (s) {
		s = typeof s == "number" ? s + "" : s;
		if (typeof(s) == "string") {
			$.trim(s);
			s = s.replace(/[\/\s\:]/gi, "-");
			if (s.match(/\-/) != null) {
				md = s.split("-");
				md[1] = md[1] * 1 - 1;
				if (md.length > 3) {
					s = new Date(md[0], md[1], md[2], md[3], md[4], md[5])
				} else {
					s = new Date(md[0], md[1], md[2]);
				}
			} else {
				md = s.split("");
				var mdy = ("" + md[0] + md[1] + md[2] + md[3]) * 1;
				var mdm = ("" + md[4] + md[5]) * 1 - 1;
				var mdd = ("" + md[6] + md[7]) * 1;
				if (md.length > 10) {
					var mdhh = ("" + md[8] + md[9]) * 1;
					var mdmm = ("" + md[10] + md[11]) * 1;
					var mdss = ("" + md[12] + md[13]) * 1;
					s = new Date(mdy, mdm, mdd, mdhh, mdmm, mdss);
				} else {
					s = new Date(mdy, mdm, mdd);
				}
			}
		}
		return s;
	},
	formatDate : function(v,flag) {
		if (typeof v == 'string')
			v = parseDate(v);
		if (v instanceof Date) {
			var y = v.getFullYear();
			var m = v.getMonth() + 1;
			var d = v.getDate();
			var h = v.getHours();
			var i = v.getMinutes();
			var s = v.getSeconds();
			var ms = v.getMilliseconds();
			if(flag){
			    return y + '-' + m + '-' + d;
			}
			
			if (ms > 0)
				return m + '-' + d + ' ' + h + ':' + i;
			if (h > 0 || i > 0 || s > 0)
				return m + '-' + d + ' ' + h + ':' + i;
			return m + '-' + d;
		}
		return '';
	},
	strtotime : function(times){  
        var ary = times.replace(/:/g,'-').replace(/ /g,'-').split('-');  
        ary[3] = ary[3]=='undefined'?'00':ary[3];  
        ary[4] = ary[4]=='undefined'?'00':ary[4];  
        ary[5] = ary[5]=='undefined'?'00':ary[5];  
        var datum = new Date(Date.UTC(ary[0],ary[1]-1,ary[2],ary[3],ary[4],ary[5]));  
        return datum.getTime()/1000;              
    } ,
	getDateStr : function (n) {
		var dd = new Date();
		dd.setDate(dd.getDate()+n);//获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var d = dd.getDate();
		var m = dd.getMonth()+1;//获取当前月份的日期
		m = m < 10 ? "0"+m : ""+m;
		d = d < 10 ? "0"+d : ""+d;
		return y+""+m+""+d;
	},
	//-----------------------------
	//名称：$_bf_s.countCharacters(s,l,ext)
	//功能：符串截取函数(中文2个位置,英文1个位置)
	//参数：s,要截取的串，l长度,ext,超过长度时后缀
	//返回值:strings
	//------------------------------
	substr : function(s,l,ext){
		var cc = 0;
		var ns = "";
		ext = ext||"...";
		for (var i=0; i<s.length; i++) {
			var c = s.charCodeAt(i);
			cc = (c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f) ? cc+1 : cc+2;
			if(cc < l ){
				ns = s.substring(0,i+1);
			}else{
				return ns+ext;
			}
		}
		return ns;
	},
	//转化为两位小数
	fix : function(value,v) {
	    if(typeof v !=='undefined'){
		    return parseFloat(value).toFixed(v);
		}
		return parseFloat(value).toFixed(2);
	},
	min : function (obj){
	    return Math.min.apply(Math, obj);
	},
    max : function (obj){
	    return Math.max.apply(Math, obj);
	},
	//复制地址
	copyAdd :function(){
		var url = location.href;
		if(window.clipboardData) {
			window.clipboardData.clearData();
			var f=window.clipboardData.setData("Text", url);
			var str = f ? "复制成功" : "您已经禁止本次复制操作，请刷新后再次复制！";
			Common.dialog(page.alertErro(str));
		} else{
			prompt("由于您使用的浏览器不支持自动复制\n请手动复制下面框中的地址，然后关闭对话框即可\n复制方法：在选中的地址上按ctrl+C或点鼠标右键选择手复制",url);
		}  
	},
	//查看用户购买历史
	buyHistory : function(username,lottype,playtype){
		showModalDialog(CommonUrl.buyhistory+"?username="+encodeURIComponent(username)+"&lottype="+lottype+"&playtype="+playtype+"",window,"dialogWidth:800px;dialogHeight:700px;scroll:no;");
	},
	//查看用户奖牌
	starHistory : function(username,lottype,playtype){
		showModalDialog(CommonUrl.starhistory+"?username="+encodeURIComponent(username)+"&lottype="+lottype+"&playtype="+playtype+"",window,"dialogWidth:800px;dialogHeight:700px;scroll:no;");
	},
	//查看追号记录
	pursueRecord : function(lottype,id){
		showModalDialog(CommonUrl.pursueRecord+"?id="+id+"&lotid="+lottype,window,"dialogWidth:490px;dialogHeight:400px;help:no;scroll:auto;status:no");
	},
	getLotLink : function(lotid,proid,wtype){
		var str = "";
		switch(lotid){
			case 1:  str = (wtype==1 || wtype==3) ? 'http://sfc.cpdyj.com/pro_info.html' : 
						   (wtype==5 || wtype==6 || wtype==12) ? 'http://rj.cpdyj.com/pro_info.html' : '';break;
			case 2:  str = 'http://jq.cpdyj.com/pro_info.html';break;		
			case 3:  str = 'http://ssq.cpdyj.com/project_info.html';break;	
			case 4:  str = 'http://qxc.cpdyj.com/pro_info.html';break;	
			case 5:  str = (wtype==7 || wtype==8) ? 'http://p5.cpdyj.com/pro_info.html' : 'http://p3.cpdyj.com/pro_info.html';break;	
			case 6:  str = 'http://3d.cpdyj.com/pro_info.html';break;
			case 7:  str = 'http://22x5.cpdyj.com/pro_info.html';break;
			case 8:  str = 'http://qlc.cpdyj.com/pro_info.html';break;
			case 9:  str = 'http://ssq.cpdyj.com/project_info.html';break;
			case 11: str = 'http://bq.cpdyj.com/pro_info.html';break;
			case 16: str = 'http://cqssc.cpdyj.com/buy_details.html';break;
			case 17: str = 'http://dlt.cpdyj.com/pro_info.html';break;
			case 23: str = 'http://11x5.cpdyj.com/info.html';break;
			case 25: str = 'http://bd.cpdyj.com/bd_project_info.html';break;
			case 27: str = 'http://jc.cpdyj.com/jc_project_info.html';break;
			case 31: str = 'http://ssc.cpdyj.com/buy_details.html';break;
			case 32: str = 'http://sc.cpdyj.com/project_detail.html';break;
			case 35: str = 'http://jclq.cpdyj.com/jc_project_info.html';break;
			case 36: str = 'http://eurocup.cpdyj.com/project_details.html';break;
			case 38: str = 'http://dj.cpdyj.com/buy_details.html';break;
			default : break;
		}
		str +='?lottype='+lotid+'&projectid='+proid+'&playtype='+wtype;
		window.open(str);
	},
	allPaly : function(t){
		var arr = [
			[],//0
			["胜负彩","任九"],//1
			["进球彩"],//2
			["双色球"],//3
			["七星彩"],//4
			["排列三","排列五"],//5
			["福彩3D"],//6
			["22选5"],//7
			["七乐彩"],//8
			["时时乐"],//9
			[],//10
			["半全场"],//11
			[],//12
			[],//13
			[],//14
			[],//15
			["老时时彩"],//16
			["超级大乐透"],//17
			["36选7"],//18
			[],//19
			[],//20
			[],//21
			[],//22
			["11选5"],//23
			["快乐123"],//24
			["北京单场"],//25
			[],//26
			["竞彩足球"],//27
			["南粤风采"],//28
			["即乐彩"],//29
			[],//30
			["新时时彩"],//31
			["幸运赛车"],//32
			[],//33
			[],//34
			["竞彩篮球"],//35
			["冠军竞猜"],//36
			[],//37
			["11运夺金"],//38
			["新11x5"],//39
			["快3"]//40
		]
		return t > 40 ? arr[0] : arr[t];
	},
	//添加今天、昨天、更早
	loadToDayYesterday : function(colspan){
		if(typeof colspan === 'undefined')colspan = 11;//ie6
		var dayHtmlArray = [
			'<tr id="today"><td class="tit_record_list" colspan="'+colspan+'"><s id="btn_today"></s><span class="v_m"><b>今天</b><span class="color_gray">(<span class="mar_b10">'+$("tr.today").length+'</span>条)</span></td></tr>',
			'<tr id="yesterday"><td class="tit_record_list" colspan="'+colspan+'"><s id="btn_yesterday"></s><span class="v_m"><b>昨天</b><span class="color_gray">(<span class="mar_b10">'+$("tr.yesterday").length+'</span>条)</span></td></tr>',
			'<tr id="earlier"><td class="tit_record_list" colspan="'+colspan+'"><s id="btn_earlier"></s><span class="v_m"><b>更早</b><span class="color_gray">(<span class="mar_b10">'+$("tr.earlier").length+'</span>条)</span></td></tr>'
		]
		//添加今天、昨天、更早
		$($("tr.today")[0]).before(dayHtmlArray[0]);
		$($("tr.yesterday")[0]).before(dayHtmlArray[1]);
		$($("tr.earlier")[0]).before(dayHtmlArray[2]); 
		//添加今天、昨天、更早事件
		$("#btn_today,#btn_yesterday,#btn_earlier").die().live("click",function(){
			$(this).toggleClass("add");
			$("tr."+$(this).parents("tr").attr("id")).toggle();
		}); 
	},
	//取金星和银星
	getStar:function(m,n,flag,num){
		//m,n为金星数\银星数 flag:取银星;num:金星银星最多为6个
		var obj = !flag ? ['jhg','jg','jz','jx'] : ['yhg','yg','yz','yx'],
		A =parseInt(m*1/125),aa=m*1%125,//皇冠
		B =parseInt(aa/25),bb=aa%25,//金冠
		C=parseInt(bb/5),//金钻
		D=bb%5,//星
		arr = [A,B,C,D],
		a = num,
		str ="";
		for(var j =0;j<4;j++){
		    var len = arr[j];
			if(len > 0){
				for(var k =0;k< len;k++){
					 if(a < 6){
						 str += "<img src='http://static.cpdyj.com/img/"+obj[j]+".gif' width='15' height='15' hspace='1'/>";
						 a ++;
					 } 
				}  
			} 
		}
		if(n > 0){
		   str +=Common.getStar(n,0,true,a);
		}
		return str;
	},
	 //处理整数方法eq:outputInt(50000.1234) result:50,000.1234
	outputInt : function(n){
		var s = n.toString()
		var t = /(\d)(?=(\d{3})+($|\.))/g;
		if(s.indexOf(".")!=-1){
			var ss = s.split(".");
			var a = ss[0].replace(t, '$1,');
			return a +"."+ ss[1];
		}else{
			return s.replace(t, '$1,');
		}
	},
	//显示购彩Div
	goLot : function(){
		$("#box_sell").toggle();
	},
	//加载中
	loading : function(){
		return '<div id="loading" align="center"><img title="加载中，请稍候……" src="http://static.cpdyj.com/img/trade/newssq/progress.gif"></div>';	
	},
	loading2 : function(colspan){
		colspan = typeof colspan === 'undefined' ? 8 : colspan;
		return "<tr><td colspan='"+colspan+"' align='center'><img src='http://static.cpdyj.com/img/trade/newssq/progress.gif' title='加载中，请稍候……' /></td></tr>";
	},
	//分页
	paging : function(){
		return '<div id="loadPage" class="page song"></div>';
	},
	page : { 
		//加载分页html
		callpage : function(o) {
			var pageno = o.pageno;
			var lastpage = o.totalpage;// 最后一页
			var maxpage = o.totalpage;// 当前最大的页码数
			var firstpage = 1;// 第一页
			var minpage = 1;// 当前最小的页码
			var pageTemp = parseInt(pageno / 9);
			var p = pageno % 9;
			if (pageno > 9) {
				if (p == 0) {
					minpage = (pageTemp - 1) * 9 + 1;
					maxpage = pageno;
				} else {
					minpage = pageTemp * 9 + 1;
					maxpage =  (pageTemp + 1) * 9 < lastpage ? (pageTemp + 1) * 9 : lastpage;
				}
			} else {
				maxpage = lastpage > 9 ? 9 : lastpage;
			}
			var h = [];
			h.push("<a href='javascript:void(0)' class='pagebtn firstPage'><span>首页</span></a>");
			h.push("<a href='javascript:void(0)' class='pagebtn upPage'><span>上一页</span></a>");
			for (var i = minpage; i <= maxpage; i++) {
				h.push((i == pageno) ? '<a class="pagenum sel" href="#">'+i+'</a>' :  '<a class="pagenum" href="#">'+i+'</a>');
			}
			h.push("<a href='javascript:void(0)' class='pagebtn downPage'><span>下一页</span></a>");
			h.push("<a href='javascript:void(0)' class='pagebtn lastPage'><span>尾页</span></a>");
			h.push("<span class='v_m'>到第</span><input type='text' id='nopage' class='page_inputnum' value =1 maxLength =3/><span class='v_m'>页</span>");
			h.push("<a href='#' id='okButton' class='pagebtn'><span>确定</span></a>");
			h.push("<span class='color_gray v_m'>共 "+o.totalpage+" 页，"+ o.countPage+" 条记录</span>");
			$("#loadPage").html(h.join(""));
			(o.countPage == 0 ? $("#loadPage").hide() : $("#loadPage").show());
		},
		executionPage : function (obj,fn){//执行分页操作
		   $("#loadPage .firstPage").die('click').live('click',function(){//首页
			    if($("#loadPage a.sel").text() ==1){
					alert("已经是第一页");
					return false;
			    }
			    obj.pageno =1;//第几页
				fn(obj);
			    return false;
		   })
		   $("#loadPage .lastPage").die('click').live('click',function(){//尾页
				if($("#loadPage a.sel").text() ==obj.totalpage){
					alert("已经是最后一页");
					return false;
				}
				obj.pageno =obj.totalpage;//第几页
				fn(obj);
				return false;
		   })
		   $("#loadPage .upPage").die('click').live('click',function(){ //上一页
				if($("#loadPage a.sel").text() ==1){
					alert("已经是第一页");
					return false;
				}
				obj.pageno--;//第几页
				fn(obj);
				return false;
		   })
		   $("#loadPage .downPage").die('click').live('click',function(){//下一页
				if($("#loadPage a.sel").text() ==obj.totalpage){
					alert("已经是最后一页");
					return false;
				}
				obj.pageno++;
				fn(obj);
				return false;
		   })
		   $("#loadPage a.pagenum,#loadPage a#okButton").die('click').live('click',function(){ //单击
				obj.pageno = $(this).attr("id") == "okButton" ? $("#nopage").val(): $(this).text();
				fn(obj);
				return false;
		   })
		   Common.isNum("nopage",function(val){//输入页数
				 if(val =="" || val ==0)val =1;
				 if(val>obj.totalpage)val = obj.totalpage;
				 $("#nopage").val(val);
			}); 
		}
	},
	//提示信息(确定)
	alertErro : function(msg){
	   var h ='<div align ="center" style="overflow: hidden;padding: 10px;position: relative;">'+
				  '<b class="con_word_top">'+msg+'</b>'+
			  '</div>'+
			  '<div class="bottom_outbox" align="right" ><span onclick="$.unblockUI()" class="btn_org mar_top10"><span>确定</span></span></div>';
	   return h ;	
	},
	//提示信息(确定、取消)
	alertErroOK : function(msg){
	   var h ='<div align ="center" style="overflow: hidden;padding: 10px;position: relative;">'+
				  '<b class="con_word_top">'+msg+'</b>'+
			  '</div>'+
			  '<div class="bottom_outbox" align="right" ><span id="inofOK" class="btn_org mar_top10"><span>确定</span></span><span class="btn_gray mar_top10" onclick="$.unblockUI();"><span>取消</span></span></div>';
	   return h ;
	},
	//提示信息(实名)
	alertRealName : function(msg){
	   var h ='<div class="dialog_realname">'+
				 '<div id="dialogError" class="dialog_info_error" style="display:none"><s></s><span>错误提示</span></div>'+
				 '<div class="mar10"><label>真实姓名：</label><input type="text" id ="realName" class="input_realname"/></div>'+
				 '<div class="mar10"><label>身份证号：</label><input type="text" id ="realCode" class="input_realname"/></div>'+
				 '<div class="mar10"><label>登录密码：</label><input type="text" id ="passWord" class="input_realname"/></div>'+
				 '<span id="bindUsers" class="btn_org"><span>绑定</span></span>'+
			 '</div>'
	   return h ;
	},
	postCheckInfo : function(){//验证实名
	    var realNmae = $("#realName").val();//真实姓名
		var realCode = $("#realCode").val();//身份证号
		var passWord = $("#passWord").val();//密码
		var errorAlert = $("#dialogError");
		if(realNmae.length > 0){
			if(/\s+/g.test(realNmae)){
				errorAlert.show().find("span").text("真实姓名中不能带有空格");
				return false;
			}
			if(!realNmae.match("^[\u4e00-\u9fa5]{0,}$")){
			//if("^[\u4e00-\u9fa5]{0,}$".match(realNmae) ==0){
				errorAlert.show().find("span").text("请输入您的真实姓名");
				return false;
			}
		}else{
			errorAlert.show().find("span").text("真实姓名不能为空");
			return false;
		}
		if(realCode.length>0){
			if(!Common.checkCard(realCode)){
				errorAlert.show().find("span").text("请输入您的真实身份证号码");
				return false;
			}
			if(realCode.length!=15){
				if(!Common.checkAge(realCode)){
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
			$.unblockUI();	
			Common.dialog(Common.alertErro(cont));
		}else{
			Common.dialog(Common.alertErro(cont));
		}
	},
	checkCard : function (realCode){//验证身份证
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
		if((new Date().getFullYear() - subYear) >= 100){
			return false;
		}
		return true;
	},
	checkAge : function (IDCard){//检验身份证的年龄
		var year = new Date().getFullYear();
		if (IDCard.length==15){
			return true;
		}else{
			if (parseFloat(year)-parseFloat(IDCard.substr(6,4))<18){
				return false;
			}
		}
		return true;
	} 
};