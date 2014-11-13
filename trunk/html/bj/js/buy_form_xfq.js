/* XfqBuyForm 竞彩足球先发起方案
*/
Class( 'XfqBuyForm', {
	_param : {},
	index : function() {
		var Y = this;
		this.hmBtn       = this.get('#xfq_btn');
		this.agreement   = this.need('#agreement');	
		
		Class.config('lotid', parseInt(this.need('#lotid').val()));  //玩法id
		Class.config('submitting', false);  //是否正在提交中
	
		this.getHmHtmlElement();
		this.hmInit();
		this.doHmThings();
		this.title_word_count.html(this.title.val().length);
		this.content_word_count.html(this.content.val().length);

		$("#gkfs em").each(function(){
			$(this).click(function(){
				$("#gkfs em").removeClass("cur");
				$(this).addClass("cur");
				$("#gk").val($(this).attr("value"));
			});
		});
		
		$("#tc b").each(function(){
			$(this).click(function(){
				$("#tc b").removeClass("cur");
				$(this).addClass("cur");
				$("#tcbili").val($(this).attr("value"));
			});
		});
		
		this.hmBtn.click( function() {
			Y.postMsg('msg_login', function() { //是否登入
				if (!Class.config('submitting')) {
					Class.config('submitting', true);
					Y.doHm();
				}
			});
		});
	},

	// 发起合买
	doHm : function() {
		this.getParam();
		this.getHmParam();
		if (this.check() == true && this.hmCheck() == true) {
			this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
			this.submit();
		} else {
			Class.config('submitting', false);
		}
	},

	// 获取发起时必须的参数
	getParam : function() {
		this._param.lotid  = this.need('#lotid').val();
		this._param.amoney = this.need('#amoney').val();
		this._param.beishu = this.need('#bshu').val();
		this._param.pid = this.need('#expect').val();
		this._param.allnum = 1;
		this._param.buynum = 1;
	},

	// 获取合买发起时必须的参数
	getHmParam : function() {
		this._param.allnum = parseInt(this.allnum.html()) || 0;
		this._param.buynum = parseInt(this.buynum.val()) || 0;
		this._param.isbaodi = this.isbaodi.prop('checked') ? 1 : 0;
		this._param.baodinum = this._param.isbaodi == 1 ? (parseInt(this.baodinum.val()) || 0) : 0;
		this._param.tcbili = this.tcbili.val(); //提成比例
		this._param.isshow = this.need('#gk').val();
		
		if (this.optional_info.prop('checked') == true) {
			this._param.title = this.title.val().trim();
			if (this._param.title == '') {
				this._param.title = this.title.attr('default');
				this.title.val(this._param.title);
			}
			this._param.content = this.content.val().trim();
			if (this._param.content == '') {
				this._param.content = this.content.attr('default');
				this.content.val(this._param.content);
			}
		} else {
			this._param.title = this.title.attr('default');
			this._param.content = this.content.attr('default');
		}
	},

	// 基本的检测
	check : function() {
		if (!this.agreement.prop('checked')) {
			this.postMsg('msg_show_dlg', '您需要阅读并且同意《用户合买代购协议》，才能够使用我们的服务。');
		} else {
			return true;
		}
		return false;
	},

	// 合买的发起检测
	hmCheck : function() {
		if (this._param.amoney * 100 % this._param.allnum != 0) {
			this.postMsg('msg_show_dlg', '每份金额不能除尽，建议分成'+this.divideAdvice(this._param.allnum)+'份，请重新填写份数。');
		} else if (this._param.amoney / this._param.allnum < 1) {
			this.postMsg('msg_show_dlg', '每份金额至少要为1元，请重新填写份数。');
		} else if (this._param.buynum / this._param.allnum < 0.05) {
			this.postMsg('msg_show_dlg', '至少需要认购5%，请重新填写认购份数。');
		} else if (this._param.buynum > this._param.allnum) {
			this.postMsg('msg_show_dlg', '购买份数大于所分的份数，请重新填写。');
		} else if (this.isbaodi.prop('checked') && (this._param.baodinum / this._param.allnum < 0.05)) {
			this.postMsg('msg_show_dlg', '至少需要保底5%，请重新填写保底份数。');
		} else if (this.isbaodi.prop('checked') && (this._param.baodinum + this._param.buynum > this._param.allnum)) {
			this.postMsg('msg_show_dlg', '购买份数加保底份数不能大于总份数。');
		} else {
			return true;
		}
		return false;
	},

	// 发起方案
	submit : function() {
	   var swap = true;
       if (swap){
		 var param_new ;
		 var param = this._param;
       	 param_new={
   				 gid:param.lotid,// 游戏编号
   				 pid:param.pid,// 期次编号
   				 play:'',// 玩法编号
   				 codes:'',
   				 muli:param.beishu,// 投注倍数
   				 fflag:1,// 是否文件
   				 type:1,//方案类型0代购1合买
   				 name:param.title,// 方案标题
   				 desc:param.content,// 方案描叙
   				 money:param.amoney,// 方案金额
   				 tnum:param.allnum,// 方案份数
   				 bnum:param.buynum,// 购买份数
   				 pnum:param.isbaodi==1?param.baodinum:0,// 保底份数
   				 oflag:param.isshow,// 公开标志
   				 wrate:param.tcbili,// 提成比率
   				 comeFrom:'',// 方案来源
   				 source:'',// 投注来源
   				 endTime:'' // 截止时间
                };	 	
        this._param = param_new;
       }

		for ( var _i in this._param) {
			this._param[_i] = encodeURIComponent(this._param[_i]);
		}
	
		this.ajax({
			url  : $_trade.url.jcast,//
			type : 'post',
			data : this._param,
			retry: 1,
			dataType : "json",
			end  : function(data) {
				if (data.error) {
					this.postMsg('msg_show_dlg', '网络故障, 请检查您的投注记录后重新提交!');
					Class.config('submitting', false);
				} else {
					var obj = eval("(" + data.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc;
        			this.alert.close();
        			if (code == "0") {          				
        				var r = obj.Resp.result;			
        				var projid = r.projid;
        				var balance = r.balance;
        				location.href = $_sys.getlotdir(this._param.gid)+$_sys.url.viewpath+'?lotid='+this._param.gid+'&projid='+projid;
        			} else {
        				this.postMsg('msg_show_dlg', desc);
        				Class.config('submitting', false);
        			}	
				}
			}
		} );
	},

	// 获取合买页面中必需的一些元素
	getHmHtmlElement : function() {		
		this.zhushu = this.need('#zhushu');
		this.beishu = this.need('#bshu');
		this.allmoney = this.need('#allmoney');
		this.amoney = this.need('#amoney');
		
		this.allnum = this.need('#allnum');
		this.allnum_piece = this.need('#allnum_piece');
		this.buynum = this.need('#buynum');
		this.buynum_money = this.need('#buynum_money');
		this.buynum_scale = this.need('#buynum_scale');
		this.buynum_tip = this.need('#buynum_tip');
		this.isbaodi = this.need('#isbaodi');
		this.baodinum = this.need('#baodinum');
		this.baodi_money = this.need('#baodi_money');
		this.baodi_scale = this.need('#baodi_scale');
		this.baodi_tip = this.need('#baodi_tip');
		this.tcbili = this.need('#tcbili'); //提成比例
		
		this.optional_info = this.need('#optional_info');
		this.optional_info_1 = this.need('#optional_info_1');
		this.title = this.need('#title');
		this.title_word_count = this.need('#title_word_count');
		this.content = this.need('#content');
		this.content_word_count = this.need('#content_word_count');
	},

	hmInit : function() {
		this.zhushu.val(50);
		this.beishu.val(1);
		this.allmoney.val('￥'+(this.zhushu.val()*this.beishu.val()*2));
		this.totalMoney = parseInt(this.zhushu.val()*parseInt(this.beishu.val())*2);  //方案总金额
		this.allnum.html(this.totalMoney);
		this.amoney.val(this.totalMoney);
	
		this.isbaodi.prop('checked', false);
		this.baodinum.val('').prop('disabled', true);
		this.optional_info.prop('checked', false);
		this.optional_info_1.hide();
		this.title.val(this.title.attr('default'));
		this.content.val(this.content.attr('default'));
		this.processSplitNum();
	},

	// 合买页面的一些处理
	doHmThings : function() {
		var Y = this;
		
		this.zhushu.keyup(function(){
			Y.processZhuBeiNum();
		} ).blur( function() {
			Y.processZhuBeiNum();
		});
		
		this.beishu.keyup(function(){
			Y.processZhuBeiNum();
		} ).blur( function() {
			Y.processZhuBeiNum();
		});

		this.buynum.keyup( function() {  //我要认购多少份的处理
			Y.processBuyNum();
		} ).blur( function() {
			Y.processBuyNum();
		} );

		this.isbaodi.click( function() {  //是否保底的选择
			if (Y.isbaodi.prop('checked')) {
				var all_num = parseInt(Y.allnum.html());
				Y.baodinum.prop('disabled', false).val( Y.allnum.html() ? Math.ceil(all_num - (Y.get('#buynum').val()*1)) : '' );
				Y.baodinum.one().focus();
				Y.processBaodiNum();
				Y.get('#bdtotal').html(Y.baodinum.val());
				Y.get('#zftotal').html(parseInt(Y.buynum.val())+parseInt(Y.baodinum.val()));
			} else {
				Y.baodi_tip.hide();
				Y.baodinum.prop('disabled', true).val('');
				Y.baodi_money.html('￥0.00');
				Y.baodi_scale.html('0%');
				Y.get('#bdtotal').html("0");
				Y.get('#zftotal').html(Y.buynum.val());
			}
		} );

		this.baodinum.keyup( function() {  //我要保底多少份的处理
			Y.processBaodiNum();
		} ).blur( function() {
			Y.processBaodiNum();
		} );

		this.optional_info.click( function() {  //显示或隐藏可选信息
			Y.optional_info_1.show(Y.optional_info.prop('checked'));
		} );

		Y.defaultTitleCleared = false;
		this.title.keyup( function() {  //限制方案标题的长度
			if (Y.title.val().length > 20) {
				Y.title.val(Y.title.val().substr(0, 20));
			}
			Y.title_word_count.html(Y.title.val().length);
		} ).focus( function() {
			if (!Y.defaultTitleCleared) {
				Y.title.val('');
				Y.title_word_count.html(0);
				Y.defaultTitleCleared = true;
			}
		} );

		Y.defaultContentCleared = false;
		this.content.keyup( function() {  //限制方案描述的长度
			if (Y.content.val().length > 200) {
				Y.content.val(Y.content.val().substr(0, 200));
			}
			Y.content_word_count.html(Y.content.val().length);
		} ).focus( function() {
			if (!Y.defaultContentCleared) {
				Y.content.val('');
				Y.content_word_count.html(0);
				Y.defaultContentCleared = true;
			}
		} );

	},
	
	processZhuBeiNum:function(){
		var zhu_num, bei_num,Y = this;
		if(!isNaN(parseInt(Y.zhushu.val())) && !isNaN(parseInt(Y.beishu.val()))){
			zhu_num = parseInt(Y.zhushu.val())||1;
			bei_num = parseInt(Y.beishu.val())||1;
			Y.zhushu.val(zhu_num);
			Y.beishu.val(bei_num);
			Y.allmoney.val('￥'+(Y.zhushu.val()*Y.beishu.val()*2));
			Y.totalMoney = parseInt(Y.zhushu.val()*parseInt(Y.beishu.val())*2);  //			
			Y.allnum.html(Y.totalMoney);
			Y.amoney.val(Y.allnum.html());
			Y.processSplitNum();
		}
	},
	
	

	processSplitNum : function() {
		var all_num, per_money, Y = this;
		all_num = parseInt(Y.allnum.html());
		if (!all_num) {
			Y.allnum.html('0');
			Y.allnum_piece.html('0');
		} else {
			Y.allnum_piece.html("1");
			Y.buynum.val(Math.ceil(all_num * 0.05));
			if (Y.isbaodi.prop('checked')) {
				Y.baodinum.val(Math.ceil(all_num * 0.05));
			}
		}
		Y.processBuyNum();
		Y.isbaodi.prop('checked') && Y.processBaodiNum();
	},

	processBuyNum : function() {
		var buy_num, all_num, min_num, Y = this;
		all_num = parseInt(Y.allnum.html());
		buy_num = parseInt(Y.buynum.val());
		if (!all_num || !buy_num) {
			Y.buynum.val('');
			Y.buynum_money.html('￥0.00');
			Y.buynum_scale.html('0.00%');
			Y.buynum_tip.hide(!all_num);
			Y.get('#rgtotal').html("0");
			Y.get('#zftotal').html(parseInt(Y.baodinum.val()));
		} else {
			Y.buynum.val(buy_num);
			Y.buynum_money.html( (Y.totalMoney / all_num * buy_num).rmb() );
			Y.buynum_scale.html( (Y.fixNum(buy_num * 100 / all_num)).toFixed(2) + '%' );
			min_num = Math.ceil(all_num * 0.05);  //最少需认购5%
			if (buy_num < min_num || buy_num > all_num) {
				var _span = Y.buynum_tip.one().getElementsByTagName('span');
				_span[0].innerHTML = min_num;
				_span[1].innerHTML = all_num;
				Y.buynum_tip.show();
			} else {
				Y.buynum_tip.hide();
			}
			Y.get('#rgtotal').html(parseInt(buy_num));
			if (Y.isbaodi.prop('checked')) {
				Y.get('#zftotal').html(parseInt(buy_num)+parseInt(Y.baodinum.val()));
			}else{
				Y.get('#zftotal').html(parseInt(buy_num));
			}
		}
	},

	processBaodiNum : function() {
		var baodi_num, all_num, min_num, Y = this;
		all_num   = parseInt(Y.allnum.html());
		baodi_num = parseInt(Y.baodinum.val());
		if (!all_num || !baodi_num) {
			Y.baodinum.val('');
			Y.baodi_money.html('￥0.00');
			Y.baodi_scale.html('0.00%');
			Y.baodi_tip.hide(!all_num);
			return;
		}
		Y.baodinum.val(baodi_num);
		this.need('#bdtotal').html(baodi_num);
		Y.baodi_money.html( (Y.totalMoney / all_num * baodi_num).rmb() );
		Y.baodi_scale.html( (Y.fixNum(baodi_num * 100 / all_num)).toFixed(2) + '%' );
		min_num = Math.ceil(all_num * 0.05);  //最少需保底5%
		Y.baodi_tip.show(baodi_num < min_num);
		this.need('#zftotal').html(parseInt(Y.buynum.val())+baodi_num);
	},

	// 除不尽时建议分成多少份
	divideAdvice : function(num) {
		var total_money = this.totalMoney;
		for (var i = num; i <= total_money; i++) {
			if (total_money * 100 % i == 0) {
				return i;
			}
		}
	},

	fixNum : function(n) {
		return parseFloat((parseInt(n * 100) / 100).toFixed(2));
	}

} );