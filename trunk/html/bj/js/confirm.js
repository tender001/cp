
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
//		this.param.lotid  = 9;
//		this.param.playid =34;
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
	glcheck : function() {
 		this.getParam();
		var codes =this.param.codes+"";
		var totalmoney =this.param.totalmoney;
		var sgtypename =this.param.sgtype+"";
		if (codes == '') {
			this.alert('请选择好您要投注的比赛。');
		} else if (sgtypename == '') {
			this.alert('请选择好您要投注的过关方式。');
		} else if (totalmoney == 0) {
			this.alert('您好，投注的总金额不能为￥0.00元。');
		}else {
			var codes_arr = codes.split("/");
			if(codes_arr.length > 12){
				this.alert('对不起，在线过滤最多支持12场比赛。');
				return false;
			}
			var gg_arr = sgtypename.split(",");
			if(gg_arr.length > 1){
				this.alert('对不起，只能选择一种过关方式进行过滤！');
				return false;
			}else{
				if(sgtypename=="27"){
    				this.alert('对不起，只支持【N串1】的过关方式进行过滤！（N>=2）');
    				return false;
				}else{
					var x = sgtypename.split("串");
					if(x[1]>1){
	    				this.alert('对不起，只支持【N串1】的过关方式进行过滤！（N>=2）');
	    				return false;
					}					
				}
			}
			return true;
		}
		return false;
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
		if (this.glcheck() == true) {
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