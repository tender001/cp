
/* ConfirmForm 北单复式发起第1步
------------------------------------------------------------------------------*/
Class( 'ConfirmForm', {

	param : {},

	index : function() {
		this.onMsg('msg_do_dg', this.doDg );
		this.onMsg('msg_do_hm', this.doHm );
		this.onMsg('msg_do_filter', this.doFilter );
		
		//发起资费限制
		this.maxMoney = parseInt(this.get('#max_money').val()) || Number.MAX;
		this.minMoney = parseInt(this.get('#min_money').val());
	},

	getParam : function() {
		var code_info, gg_info, touzhu_result;
		
		this.param.lotid  = this.need('#lotid').val();
		this.param.playid = this.need('#playid').val();
		this.param.expect = this.need('#expect').val();

		code_info = this.postMsg('msg_get_codes_4_submit').data;
		this.param.codes = code_info.codes;
		this.param.danma = code_info.danma;
		
		gg_info = this.postMsg('msg_get_gg_info_more').data;
		this.param = this.mix(this.param, gg_info);

		touzhu_result = this.postMsg('msg_get_touzhu_result_4_submit').data;
		this.param = this.mix(this.param, touzhu_result);

		this.param.isCutMulit = 0;
	},

	check : function() {
		
		if (this.param.codes == '') {
			this.postMsg('msg_show_dlg', '请选择好您要投注的比赛。');
		} else if (this.param.sgtype == '') {
			this.postMsg('msg_show_dlg', '请选择好您要投注的过关方式。');
		} else if (this.param.totalmoney == 0) {
			this.postMsg('msg_show_dlg', '您好，投注的总金额不能为￥0.00元。');
		} 
//		else if (this.param.totalmoney / this.param.beishu > 20000 &this.param.sgtype.split(",").length==1) {
//			this.postMsg('msg_show_dlg', '您好，单倍认购金额不能超过20,000元。');
//		}
		else if (this.param.totalmoney > this.maxMoney) {
			this.postMsg('msg_show_dlg', '对不起，您的方案发起金额不能大于' + this.maxMoney + '元。');
		} else {
			return true;
		}
		return false;
	},

	doDg : function() {
		this.getParam();
		this.param.ishm = 0;
		if (this.check() == true) {
			var url = '/phpt/bj/step_2.phpx';
			this.submit(url);
		}
	},

	doHm : function() {
		this.getParam();
		this.param.ishm = 1;
		if (this.check() == true) {
			var url = '/phpt/bj/step_1.phpx';
			this.submit(url);
		}
	},
	doFilter : function() {
		this.getParam();
		this.param.ishm = 1;
		if (this.check() == true) {
			var url = '/phpt/bj/step_7.phpx';
			this.submit(url);
		}
	},

	submit : function(url) {
		this.sendForm( { //POST提交
			url    : url,
			data   : this.param,
			target : '_blank'
		} );
	}

} );