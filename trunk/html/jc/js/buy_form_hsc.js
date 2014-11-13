/* HscConfirmForm 竞彩足球后上传*/
Class( 'HscConfirmForm', {
	param : {},
	index : function() {
		var Y = this;
		var lotid = location.search.getParam('lotid');
		var projid = location.search.getParam('projid');
		this.showinfo(lotid,projid);
		this.onMsg('msg_do_dg', function() {
			Y.postMsg('msg_login', function(){ //是否登入
				Y.Buy();
			});
		});
	},
	showinfo:function(lotid,projid){
		var data = $_trade.key.gid + "=" + encodeURIComponent(lotid) + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
		Y.ajax({
			url : $_trade.url.pinfo,
			type : "POST",
			dataType : "json",
			data : data,
			end: function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				if (code == "0") {
					var r = obj.Resp.row;
					var projid = r.projid;// 方案编号
					var gameid = r.gameid;// 游戏编号
					var mulity = r.mulity;// 倍数
					var ifile = r.ifile;// 是否文件投注  1 是
					var tmoney = r.tmoney;// 总金额
					var istate = r.istate;// 状态
					var upload = r.upload;// 是否上传  0 未传
					
					var zhushu=tmoney/(mulity*2);
					
					Y.get("#lotid").val(gameid);
					Y.get("#projid").val(projid);		
					Y.get("#beishustr").html(mulity);
					Y.get("#zhushustr").html(zhushu);
					Y.get("#allmoneystr").html(parseFloat(tmoney).rmb(true));
					Y.get("#faurl").attr('href',$_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+projid);
					if (Y.getInt(ifile)!=1){
						 Y.alert('方案不存在，请确认您 的方案编号。');
						 return;
					}
					if (Y.getInt(upload)!=0){
						Y.alert('文件已经上传');
						 return;
					}
					if (Y.getInt(istate)>2){
						Y.alert('方案已经过期或者撤销');
						return;
					}
				} else {
					Y.alert(desc);
				}
			}
		});	
	},
	getParam : function() {
		this.param.lotid  = this.need('#lotid').val();
		this.param.playid = this.need('#playid').val();
		this.param.projid = this.need('#projid').val();
		this.param.matches = this.postMsg('msg_get_selected_matches').data;
		this.param.ggtype = this.postMsg('msg_get_guoguan_type').data;
		this.param.ggname=this.postMsg('msg_get_ggname').data;
		this.param.initems = (this.need('#s').prop('checked')==false?0:1);
	},

	check : function() {
		if (this.param.projid == "") {
			this.postMsg('msg_show_dlg', '方案编号错误。');
		} else if (this.param.initems == 0 && this.param.matches.length == 0) {
			this.postMsg('msg_show_dlg', '请选择好您要投注的比赛。');
		} else if (this.param.initems == 0 && this.param.matches.length <12) {
			this.postMsg('msg_show_dlg', '请至少选择两场您要投注的比赛。');
		} else if (this.param.initems == 0 && this.param.ggtype == '') {
			this.postMsg('msg_show_dlg', '请选择好您要投注的过关方式。');
		} else if (this.need('#upload input').val() == '') {
			this.postMsg('msg_show_dlg', '您好，请选择好要上传的文件。');
		} else if (/\.txt$/i.test(this.need('#upload input').val()) == false) {
			this.postMsg('msg_show_dlg', '文件格式错误，请选择.txt文本文件上传！');
		} else {
			return true;
		}
		return false;
	},

	Buy : function() {
		this.getParam();
		this.param.ishm = 0;
		if (this.check() == true) {
			this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
			var url = '/phpt/jc/step_6.phpx';
			this.submit(url);
		}
	},
	submit : function(url) {
		this.sendForm({  //提交
			form   : this.need('#upload form'),
			url    : url,
			data   : this.param,
			target : '_self'
		});
	}
});