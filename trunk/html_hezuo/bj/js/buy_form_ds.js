/* ConfirmForm 竞彩足球单式发起*/
Class( 'ConfirmForm', {
	param : {},
	index : function() {
		var Y = this;
		this.onMsg('msg_do_dg', function() {
			Y.postMsg('msg_login', function() { //是否登入
				Y.doDg();
			});
		} );
		this.onMsg('msg_do_hm', function() {
			Y.postMsg('msg_login', function() { //是否登入
				Y.doHm();
			});
		} );
	},

	getParam : function() {
		this.param.lotid  = this.need('#lotid').val();
		this.param.playid = this.need('#playid').val();
		this.param.expect = this.need('#expect').val();

		this.param.matches = this.postMsg('msg_get_selected_matches').data;
		this.param.ggtype = this.postMsg('msg_get_guoguan_type').data;
		//this.param.ggname=this.postMsg('msg_get_ggname').data;
		this.param = this.mix(this.param, this.postMsg('msg_get_ggname').data);
		this.param.beishu = this.need('#beishu').val();
		this.param.initems = (this.need('#s').prop('checked')==false?0:1);
	},

	check : function() {
		if (this.param.initems == 0 && this.param.matches.length == 0) {
			this.postMsg('msg_show_dlg', '请选择好您要投注的比赛。');
		} else if (this.param.initems == 0 && this.param.ggtype == '') {
			this.postMsg('msg_show_dlg', '请选择好您要投注的过关方式。');
		} else if (this.param.beishu <= 0 || this.param.beishu > 50000) {
			this.postMsg('msg_show_dlg', '您好，投注的倍数不正确。');
		} else if (this.need('#upload input').val() == '') {
			this.postMsg('msg_show_dlg', '您好，请选择好要上传的文件。');
		} else if (/\.txt$/i.test(this.need('#upload input').val()) == false) {
			this.postMsg('msg_show_dlg', '文件格式错误，请选择.txt文本文件上传！');
		} else {
			return true;
		}
		return false;
	},

	doDg : function() {
		this.getParam();
		this.param.ishm = 0;
		if (this.check() == true) {
			this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
			var url = '/phpt/bj/step_4.phpx';
			this.submit(url);
		}
	},

	doHm : function() {
		this.getParam();
		this.param.ishm = 1;
		if (this.check() == true) {
			this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
			var url = '/phpt/bj/step_3.phpx';
			this.submit(url);
		}
	},

	submit : function(url) {
		this.sendForm({  //POST提交
			form   : this.need('#upload form'),
			url    : url,
			data   : this.param,
			target : '_self'
		});
	}

});