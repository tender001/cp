//所有页面字符串
var page = {	
	//无数据
	nodata : function(msg){
		var h = '<tr id="nodata">' +
					'<td colspan="10" class="t_c no_list">'+msg+'</td>' +
				'</tr>';
		return h;
	},	
	//正在加载
	loading : '<trid="loading">' +
				'<td colspan="3"><img src="http://sfc.cpdyj.com/images/progress.gif"></td>' +
			  '</tr>',
	
	loadingmsg :'<div class="mar_top20 padding_b10">'+
					'<p class="t_c"><img src="http://sfc.cpdyj.com/images/progress.gif"></p>'+
					'<p class="padding_b10 t_c mar_top20"><b class="font14">正在过滤，请稍后！</b></p>'+
				'</div>'+
			'</div>',
	loadingbuy :'<div class="mar_top20 padding_b10">'+
					'<p class="t_c"><img src="http://sfc.cpdyj.com/images/progress.gif"></p>'+
					'<p class="padding_b10 t_c mar_top20"><b class="font14">正在提交，请稍后！</b></p>'+
				'</div>'+
			'</div>',
	//提示信息(确定、取消)
	alertErroOK : function(msg){
			var h ='<div class="point_box mar_top20">'+
				msg+
			'</div>'+
			

			'<div class="bt_btn"><a class="aut_btn aut_blue" id="inofOK"><span>确定</span></a><a onclick="$.unblockUI();" class="aut_btn"><span>取消</span></a></div>';
	
		
	   // var h ='<div align ="center" style="overflow: hidden;padding: 10px;position: relative;">'+
				  // '<b class="con_word_top">'+msg+'</b>'+
			  // '</div>'+
			  // '<div class="bottom_outbox" align="right" ><span id="inofOK" class="btn_org mar_top10"><span>确定</span></span><span class="btn_gray mar_top10" onclick="$_lot.close();"><span>取消</span></span></div>';
	   return h ;
	},
	//提示信息(确定)
	alertErro : function(msg){
		var h ='<div class="point_box">'+
				msg+
			'</div>'+
			'<div class="bt_btn"><a class="aut_btn aut_blue"><span onclick="$.unblockUI();">确定</span></a></div>';
	   return h ;	
	},
	//提示信息(实名)
	alertRealName : function(msg){
		var h ='<iframe class="frame_mask_select" scrolling="no" frameborder="0" src="javascript:false">'+
			'<html>'+
			'<head>'+
			'</head>'+
			'<body>'+
			'false'+
			'</body>'+
			'</html>'+
			'</iframe>'+
		'<div class="dialog_realname">'+
				 '<div id="dialogError" class="dialog_info_error" style="display:none"><s></s><span>错误提示</span></div>'+
				 '<div class="mar10"><label>真实姓名：</label><input type="text" id ="realName" class="input_realname"/></div>'+
				 '<div class="mar10"><label>身份证号：</label><input type="text" id ="realCode" class="input_realname"/></div>'+
				 '<div class="mar10"><label>登录密码：</label><input type="text" id ="passWord" class="input_realname"/></div>'+
				 '<span id="bindUsers" class="btn_org"><span>绑定</span></span>'+
			 '</div>'
	   return h ;
	},
	showAllpage : function(){
		h=
		'<div class="gv_table" id="showlist">'+
			'<table>'+
				'<thead>'+
					'<tr>'+
						'<th width="42">序号</th>'+
						'<th width="49">英格兰</th>'+
						'<th width="49">米涅罗</th>'+
						'<th width="49">巴拉纳</th>'+
						'<th width="49">奥瓦</th>'+
						'<th width="49">英格兰</th>'+
						'<th width="49">利斯菲</th>'+
						'<th width="49">贝尔格</th>'+
						'<th width="49">若茵维</th>'+
						'<th width="49">伊卡萨</th>'+
						'<th width="49">戈亚尼</th>'+
						'<th width="49">日本</th>'+
						'<th width="49">韩国</th>'+
						'<th width="49">新加坡</th>'+
						'<th width="44">威尔士</th>'+
					'</tr>'+
				'</thead>'+
				'<tbody>'+
					'<tr>'+
						'<td class="color_333">1</td>'+
						'<td>*</td>'+
						'<td><b>1</b></td>'+
						'<td>*</td>'+
						'<td>*</td>'+
						'<td>*</td>'+
						'<td><b>3</b></td>'+
						'<td>*</td>'+
						'<td><b>3</b></td>'+
						'<td>*</td>'+
						'<td><b>1</b></td>'+
						'<td>*</td>'+
						'<td>*</td>'+
						'<td>*</td>'+
						'<td>*</td>'+
					'</tr>'+
				'</tbody>'+
			'</table>'+
		'</div>'+
		'<div class="page song" id="loadPage"></div>'+
		'<div class="padding_t10">'+
			'<p class="pop_gv_bt_txt">过滤前 <span class="color_red" id="glq">'+
			'</span> 注，过滤后 <span class="color_red" id="glh"></span> 注，压缩比 <span class="color_red" id="ysb2"></span></p>'+
			'<a class="aut_btn aut_blue fright" id="ok_close"><span>确定</span></a>'+
		'</div>';
		return h ;
	},
		//购买成功
	buySuccess : function(){
		var h ='<div class="point_box">'+
        	'<p>恭喜，投注成功！</p>'+
			'<p>您可以去：<a href="/myproject.html">投注记录&gt;&gt;</a> <a href="#">方案详情&gt;&gt;</a></p>'+
			'            <div class="bt_btn">'+
            	'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>'+
            '</div>'+
        '</div>';
		return h ;	
	},
	//发起合买
	sponsorBuy : function(){
	     var h =
		     '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab_bonus_buy" id="submitCaseBtn">'+
				'<tr>'+
					'<th height="27" align="center" width="98">投注信息</th>'+
					'<td align="center">总金额 <b class="font14 color_red">40</b> 元</td>'+
				'</tr>'+
				'<tr>'+
					'<th height="27" align="center" width="98">我要分成</th>'+
					'<td align="center">'+
					'<ul class="buytogather_list_ul" id="anumber">'+
						'<li class="sel" >每份 <b class="">2</b> 元，共 <b class="">0</b> 份</li>'+
						'<li>每份 <b class="color_red">1</b> 元，共 <b class="color_red">0</b> 份</li>'+
					'</ul>'+
					'</td>'+
				'</tr>'+
				'<tr>'+
					'<th align="center" height="27">我要认购</th>'+
					'<td align="center"><input type="text" size="8" id = "buynumber" value="1"/>份，<span class="color_red" id="buyYuan">2</span> 元，约<span id="buyNum" class="color_red">0%</span><br/></p></td>'+
				'</tr>'+
				'<tr>'+
					'<th align="center" height="27">我要保底</th>'+
					'<td align="center"><input type="text" size="8" id="baodinumber"/>份，<span class="color_red" id="baodiYuan">0</span> 元，约<span class="color_999" id="baodiNum">0%</span> <input type="checkbox" id="baodi"/><label for="baodi">全额保底</label>'+
						  //'<span class="icon_more2 icon_more2_football"><div class="more_con football_more_con" style="display: none;">主队后的数字为让球值，负数表示主让客，正数表示客让主。<span class="more_con_bow"></span>   </div></span><br/></p>'+
					'</td>'+
				'</tr>'+
				'<tr>'+
					'<th height="27" align="center" width="98">提成比例</th>'+
					'<td align="center" id="royaltyrate">净利润的'+
						'<ul class="buytogather_list_ul"><li class="sel">10%</li></ul>或者 税后奖金的'+
						'<ul class="buytogather_list_ul"><li>0%</li><li>1%</li><li>2%</li><li>3%</li><li>4%</li><li>5%</li><li>6%</li><li>7%</li><li>8%</li><li>9%</li><li>10%</li></ul>'+
						//'<span class="icon_more2 icon_more2_football"><div class="more_con football_more_con" style="display: none;">主队后的数字为让球值，负数表示主让客，正数表示客让主。<span class="more_con_bow"></span>   </div></span>'+
					'</td>'+
				'</tr>'+
				'<tr>'+
					'<th height="27" align="center" width="98">保密设置</th>'+
					'<td align="center"><ul class="buytogather_list_ul" id="showtype"><li class="sel" val="0">上传即公开</li><li val="1">截止后公开</li><li val="2">仅对跟单者公开</li><li val="3">截止后对跟单者公开</li></ul></td>'+
				'</tr>'+
				'<tr>'+
					'<th height="27" align="center" width="98">确认支付</th>'+
					'<td align="center" class="bonus_btns" id="hmnologin">'+ 
						'<a class="aut_btn aut_orange" id="hm_buy"><span>发起合买</span></a><a style="display:none" class="btn_gray"><span>取消</span></a>'+
					'</td>'+
				'</tr>'+
				'<tr>'+
					'<th align="center" height="27">可选信息</th>'+
					'<td align="center"><input type="checkbox" id="case_info"/><label for="case_info">方案宣传选填信息</label>'+
					      '<div id="optionMassge" class="optionMassge" style="display:none">'+
							'<p>'+
							'<textarea id="content" maxLength="200" rows="8" cols="30"  name="text_propaganda">快乐购彩</textarea>'+
							'<span class="color_gray v_t">最多200个字</span>'+
							'</p>'+
						'</div>'+
					'</td>'+
				'</tr>'+
			'</table>';
		return h ;
	}
}

var dialog = {
	//弹出框
	initDialog: function(msg,title,width,heigth){
		if(title == "" || title == null){
			title = "温馨提示";
		}
		if(width == "" || width == null){
			width = 410;
		}
		if(heigth == "" || heigth == null){
			heigth = 164;
		}
		Common.dialog(msg,title,width,heigth);		
		$("#dialog").height($(".dialog-content").height() + $(".dialog-title").height()+20);
	},
	//提示信息(确定)
	alertMsg1 : function (msg) {
		var h = '<div class="point_box">' +
			'<p>' + msg + '</p>' +
			'</div>' +
			'<div class="bt_btn mar_top20">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>'
			return h;
	},
	//提示信息(确定)
	alertMsg : function (msg,title,width,heigth) {
		var h = '<div class="point_box">' +
			'<p>' + msg + '</p>' +
			'</div>' +
			'<div class="bt_btn mar_top20">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>'
		dialog.initDialog(h,title,width,heigth);
	},	
	//提示信息(确定、取消)
	alertSureOK1 : function (msg) {
		var h = '<div class="point_box">' +
			'<p>' + msg + '</p>' +
			'</div>' +
			'<div class="bt_btn mar_top20">' +
			'<a class="aut_btn aut_blue" id="infoOK"><span>确定</span></a>' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>取消</span></a>' +
			'</div>'
			return h;
	},
	//提示信息(确定、取消)
	alertSureOK : function (msg,title,width,heigth) {
		var h = '<div class="point_box">' +
			'<p>' + msg + '</p>' +
			'</div>' +
			'<div class="bt_btn mar_top20">' +
			'<a class="aut_btn aut_blue" id="infoOK"><span>确定</span></a>' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>取消</span></a>' +
			'</div>'
			dialog.initDialog(h,title,width,heigth);
	},	
	//个人购买
	oneselfBuy1 : function () {
		return '<div class="point_box" id="oneselfBuy">' +
		'<p>双色球 2013075 期</p>' +
		'<p>共 24 注，2 倍，总金额 <span class="color_red sum_f16">168</span> 元</p>' +
		'<div class="bt_btn">' +
		'<a class="aut_btn aut_orange" id="commitBuy"><span>确认投注</span></a><a class="aut_btn" onclick="$.unblockUI();"><span>取消</span></a>' +
		'</div>' +
		'</div>';

	},
	//提示信息(确定、取消)
	oneselfBuy : function (title) {
		var h =  '<div class="point_box" id="oneselfBuy">' +
				'<p>双色球 2013075 期</p>' +
				'<p>共 24 注，2 倍，总金额 <span class="color_red sum_f16">168</span> 元</p>' +
				'<div class="bt_btn">' +
				'<a class="aut_btn aut_orange" id="commitBuy"><span>确认投注</span></a><a class="aut_btn" onclick="$.unblockUI();"><span>取消</span></a>' +
				'</div>' +
				'</div>';
		dialog.initDialog(h,title);	
	},
	//提示信息(实名)
	alertRealName1 : function () {
		var h = '<div class="dialog_realname">' +
			'<div id="dialogError" class="dialog_info_error" style="display:none"><s></s><span>错误提示</span></div>' +
			'<div class="mar10"><label>真实姓名：</label><input type="text" id ="realName" class="input_realname"/></div>' +
			'<div class="mar10"><label>身份证号：</label><input type="text" id ="realCode" class="input_realname"/></div>' +
			'<div class="mar10"><label>登录密码：</label><input type="text" id ="passWord" class="input_realname"/></div>' +
			'<span id="bindUsers" class="btn_org"><span>绑定</span></span>' +
			'</div>'
			return h;
	},
	//提示信息(实名)
	alertRealName : function () {
		var h = '<div class="dialog_realname">' +
			'<div id="dialogError" class="dialog_info_error" style="display:none"><s></s><span>错误提示</span></div>' +
			'<div class="mar10"><label>真实姓名：</label><input type="text" id ="realName" class="input_realname"/></div>' +
			'<div class="mar10"><label>身份证号：</label><input type="text" id ="realCode" class="input_realname"/></div>' +
			'<div class="mar10"><label>登录密码：</label><input type="text" id ="passWord" class="input_realname"/></div>' +
			'<span id="bindUsers" class="btn_org"><span>绑定</span></span>' +
			'</div>'
		dialog.initDialog(h,"绑定真实身份",350,235);
	},
	//余额不足
	balanceShort1 : function () {
		var h = '<div class="point_box">' +
			'<p>账户余额不足！</p>' +
			'<p>您现在可以去：<a href="http://user.cpdyj.com/addmoney.html">账户充值>></a></p>' +
			'<div class="bt_btn">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>' +
			'</div>';
		return h;
	},
	//余额不足
	balanceShort : function () {
		var h = '<div class="point_box">' +
			'<p>账户余额不足！</p>' +
			'<p>您现在可以去：<a href="http://user.cpdyj.com/addmoney.html">账户充值>></a></p>' +
			'<div class="bt_btn">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>' +
			'</div>';
		dialog.initDialog(h);
	},
	//购买成功
	buySuccess1 : function () {
		var h = '<div class="point_box">' +
			'<p>恭喜，投注成功！</p>' +
			'<p>您可以去：<a onclick="$.unblockUI();" href="myproject.html" target="_blank">投注记录&gt;&gt;</a> <a onclick="$.unblockUI();" href="#" target="_blank">方案详情&gt;&gt;</a></p>' +
			'<div class="bt_btn">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>' +
			'</div>';
		return h;
	},
	//提示信息(确定)
	buySuccess : function () {
		var h = '<div class="point_box">' +
			'<p>恭喜，投注成功！</p>' +
			'<p>您可以去：<a onclick="$.unblockUI();" href="myproject.html" target="_blank">投注记录&gt;&gt;</a> <a onclick="$.unblockUI();" href="#" target="_blank">方案详情&gt;&gt;</a></p>' +
			'<div class="bt_btn">' +
			'<a class="aut_btn aut_blue" onclick="$.unblockUI();"><span>确定</span></a>' +
			'</div>' +
			'</div>';
		dialog.initDialog(h);
	}
}
