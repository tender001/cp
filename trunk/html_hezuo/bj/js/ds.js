//北京单场单式选号页面  
// MatchSelector 赛事选择器
Class( 'MatchSelector', {
	matchInfo : {
		endtime : '',
		matches : []
	},
	index : function(config) {
		this.matches = this.need(config.matches);

		// 初始全不选中
		this.matches.find(':checkbox').each( function(item) {
			this.get(item).prop('checked', false);
		}, this );

		// 选择比赛
		this.matches.live(':checkbox', 'click', function(e, ns) {
			if (ns.get(this).prop('checked') && ns.matchInfo.matches.length == 15) {
				ns.get(this).prop('checked', false);
				ns.postMsg('msg_show_dlg', '您好，最多只能选择15场比赛！');
			} else {
				ns.changed();
			}
		} );

		// 接收消息，返回所选的场次(数组形式)
		this.onMsg('msg_get_selected_matches', function() {
			return this.matchInfo.matches;
		} );

		this.onMsg('msg_restore_matches', function(matches) {
			this.restoreMatches(matches);
		} );

		this.initMatchDisplay();  //显示或隐藏已截止对阵
	},

	// 获取数据(所选比赛场次 + 最早截止时间)
	getData : function() {
		this.matchInfo.endtime = '';
		this.matchInfo.matches =[];
		this.matches.find('input').each( function(item) {
			if (this.get(item).prop('checked')) {
				if (this.matchInfo.endtime == '' || this.get(item).attr('endtime') < this.matchInfo.endtime) {
					this.matchInfo.endtime = this.get(item).attr('endtime');
				}
				this.matchInfo.matches.push(this.get(item).val());			
			}
		}, this );
		return this.matchInfo;
	},

	// 重现之前选择的好的比赛
	restoreMatches : function(matches) {
		this.matches.find('input').each( function(item) {
			if (item.disabled) return;
			var regexp = new RegExp('^'+item.value+',|,'+item.value+',|,'+item.value+'$|^'+item.value+'$', 'g');
			if (regexp.test(matches)) {
				this.get(item).prop('checked', true);
			}
		}, this );
		this.changed();
	},

	initMatchDisplay : function() {
		var Y = this;
		this.endMatchToggle = this.get('#toggle_end_matches');
		var total_matches = this.need('#total_matches').val();
		var end_matches = this.need('#end_matches').val();
		if (end_matches == total_matches) {  //当所有对阵均截止时全部显示出来

		} else if (end_matches != 0) {  //当有截止对阵时显示切换链接
			this.get('#toggle_end_matches').show();
		}
		this.endMatchToggle.click( function() { Y.toggleEndMatch(); } );
	},

	toggleEndMatch : function() {
		if (this.endMatchToggle.attr('value') == 'show') {
			this.endMatchToggle.html('隐藏已截止对阵').attr('value', 'hide');
			this.get('ul.matches li').show();
		} else {
			this.endMatchToggle.html('显示已截止对阵').attr('value', 'show');
			this.get('ul.matches li').each( function(oLi) {
				oLi.getElementsByTagName('input')[0].disabled && (oLi.style.display = 'none');
			} );
		}
	},

	changed : function() {
		this.postMsg('msg_match_selector_changed', this.getData());
	}

} );


/* GuoguanType 处理过关方式 和代码转换的类
------------------------------------------------------------------------------*/
Class( 'GuoguanType', {
	use   : 'mask',
	//ggGroup     : ['单关','2串1','3串1','4串1','5串1','6串1','7串1','8串1'],
	//ggGroupMap  : {'单关':'1*1','2串1':'2*1','3串1':'3*1','4串1':'4*1','5串1':'5*1','6串1':'6*1','7串1':'7*1','8串1':'8*1'},
	//ggGroupMap2 : {'1*1':'单关','2*1':'2串1','3*1':'3串1','4*1':'4串1','5*1':'5串1','6*1':'6串1','7*1':'7串1','8*1':'8串1'},
	//ggType      : '',
	ggGroup     : ['单关','2串1','3串1','4串1','5串1','6串1','7串1','8串1','9串1','10串1','11串1','12串1','13串1','14串1','15串1'],
	ggGroupMap  : {'单关':27,'2串1':1,'3串1':3,'4串1':7,'5串1':14,'6串1':20,'7串1':35,'8串1':36,'9串1':37,'10串1':38,'11串1':39,'12串1':40,'13串1':41,'14串1':42,'15串1':43},
	ggGroupMap2 : {27:'单关',1:'2串1',3:'3串1',7:'4串1',14:'5串1',20:'6串1',35:'7串1',36:'8串1',37:'9串1',38:'10串1',39:'11串1',40:'12串1',41:'13串1',42:'14串1',43:'15串1'},
	ggType      : '',
	
	index : function(config) {
		var Y = this;
		
		this.ggTypeTag  = this.need(config.ggTypeTag);
		this.endtimeTag = this.need(config.endtimeTag);
		this.switchLink = this.need(config.switchLink);
		this.formatSwitch = this.need(config.formatSwitch);
		this.formatDisplay  = this.need(config.formatDisplay);

		this.ggTypeTag.live(':radio', 'click', function(e, ns) {
			ns.ggType = this.value;    //保存所选的过关方式
		} );

		this.onMsg('msg_match_selector_changed', function(data) {
			this.updateGuanGuoType(data);
		} );

		this.onMsg('msg_get_guoguan_type', function() {
			return this.ggType;    //返回过关方式
		} );

		// 返回修改相关
		this.onMsg('msg_restore_ggtype', function(ggtype) {
			this.ggTypeTag.find(':radio').each( function(item) {
				this.get(item).prop('checked', item.value == ggtype);
			}, this );
			this.ggType = ggtype;
		} );
		this.onMsg('msg_restore_ggname', function(ggname) {
			Class.config('formatValue', ggname);
			this.displayFormat();
		} );

		// 返回设置好的转换代码 { ggname[3]:3, ggname[1]:1, ggname[0]:0 }
		this.onMsg('msg_get_ggname', function() {
			var ggname = {};
			Class.config('formatIndex').each( function(item, index) {
				ggname['ggname[' + item + ']'] = Class.config('formatValue')[index];
			} );
			return ggname;
		} );

		/* bof 格式转化修改相关 */
		this.displayFormat();
		this.formatSwitchDialog = this.lib.MaskLay(config.formatSwitch);
		this.get('.tan_top', this.formatSwitch).drag(this.formatSwitch);
		this.switchLink.click( function() { //弹出格式转化窗口
			Y.popFormatSwitchDialog();
		} );
		this.get('.tan_top_r,.a_oth', this.formatSwitch).click( function() { //确认
			Y.checkAndSaveCode(this.id);
		} );
		this.get('#clear_btn').click( function() { //清空
			Y.formatSwitch.find(':text').val('');
		} );
		this.get('#reset_btn').click( function() { //还原
			Y.resetFormat();
		} );
		/* eof 格式转化修改相关 */
	},

	// 更新过关方式与截止时间的显示
	updateGuanGuoType : function(data) {
		var ggtype_html, gg_length;
		ggtype_html = '';
		this.endtimeTag.html(data.endtime);
		this.ggTypeTag.empty();
		gg_length = Math.min(data.matches.length, Class.config('ggMaxLength')); //不同的玩法对过关方式的最大长度有不同的限制
		for ( var i = 0; i < gg_length; i++) {
			var checked_html = '';
			if (i == gg_length - 1) {
				checked_html = ' checked="checked"';
				this.ggType = this.ggGroupMap[this.ggGroup[i]];
			}
			ggtype_html += '<label><input type="radio" name="meaningless" class="chbox" value="' + this.ggGroupMap[this.ggGroup[i]] + '"' + checked_html + ' />' + this.ggGroup[i] + '</label>';
		}
		this.get(ggtype_html).insert(this.ggTypeTag);
	},

	// 检测与存储用户设定的转换代码
	checkAndSaveCode : function(btn_id) {
		var Y, success;
		Y = this;
		success = true;
		if (btn_id == 'confirm_btn') {  //点确认转化后			
			var error_msg, code_len, codes;
			code_len = Y.formatSwitch.find(':text').one().value.trim().length;
			codes = Y.formatSwitch.find(':text').each( function(item, index) {
				item.value = item.value.trim();
				if (item.value == '' && success) {
					error_msg = '您设置的字符中有含有空值，请重新输入！';
					success = false;
				} else if (item.value.length != code_len && success) {
					error_msg = '您设置的各个字符长度不一致，请重新输入！';
					success = false;
				} else if (Y.checkFormat(item.value) == false && success) {
					error_msg = '您设置的转换格式不正确，请重新输入！';
					success = false;
				}
				this.push(item.value);
			}, [] );
			if (success) {
				Y.formatSwitch.find(':text').each( function(item, index) { //检测重复
					var regexp = new RegExp(item.value, 'g');
					if (codes.join('|').match(regexp).length > 1) {
						error_msg = '您设置的字符中有重复，请重新输入！';
						success = false;
					}
				} );
			}
			if (success == true) {
				Class.config('formatValue', codes); //存储用户设置的值
				Y.displayFormat(); //在页面上显示新设置的值
			} else {
				Y.postMsg('msg_show_dlg', error_msg);
			}
		}
		success && Y.formatSwitchDialog.close();
	},

	popFormatSwitchDialog : function() {
		this.resetFormat();
		this.formatSwitchDialog.pop( this.formatSwitch.html() );
	},
	
	resetFormat : function() {
		this.formatSwitch.find(':text').each( function(item, index) {
			item.value = Class.config('formatValue')[index];
		} );
	},

	// 显示用户设置后的格式转化符
	displayFormat : function() {
		var codes, _html = '';
		codes = Class.config('formatValue');
		if (Class.config('playName') == 'rqspf') {
			_html = '格式转化符：胜→' + codes[0] + '  平→' + codes[1] + '  负→' + codes[2];
		} else if (Class.config('playName') == 'jq') {
			_html = '格式转化符：0→' + codes[0] + '  1→' + codes[1] + '  2→' + codes[2] + '  3→' + codes[3] + '  ...';
		} else if (Class.config('playName') == 'ds') {
			_html = '格式转化符：上+单→' + codes[0] + '  上+双→' + codes[1] + '  下+单→' + codes[2] + '  下+双→' + codes[3];
		} else if (Class.config('playName') == 'bf') {
			_html = '格式转化符：1:0→' + codes[0] + '  2:0→' + codes[1] + '  2:1→' + codes[2] + '  3:0→' + codes[3] + '  ...';
		} else if (Class.config('playName') == 'bq') {
			_html = '格式转化符：胜-胜→' + codes[0] + '  胜-负→' + codes[1] + '  胜-平→' + codes[2] + ' ...';
		}
		this.formatDisplay.html(_html);
	},

	// 检验输入的格式转化符
	checkFormat : function(str) {
		switch (Class.config('playName')) {
			case 'rqspf' :
			case 'jq'    :
			case 'ds'    :
				return /^\d$/.test(str);
			case 'bf'    :
			case 'bq'    :
				return /^\w{1,2}$/.test(str);
		}
		return false;
	}

} );


/* TheForm 用于收集提交数据的表单对象
------------------------------------------------------------------------------*/
Class( 'TheForm', {
	    index : function(config) {
		var Y = this;

		this.fileInput   = this.need(config.fileInput);
		this.beishuInput = this.need(config.beishuInput);
		
		this.fileInput.change( function() {
			if (this.value != '' && /\.txt$/i.test(this.value) == false) {
				Y.postMsg('msg_show_dlg', '文件格式错误，请选择.txt文本文件上传！');
				this.value = '';
			}
		} );

		this.onMsg('msg_restore_beishu', function(beishu) {
			this.beishuInput.val(beishu);
		} );

		// 改变倍数时
		this.beishuInput.keyup( function() {
			if (!parseInt(this.value)) {
				this.value = '';
			} else {
				this.value = parseInt(this.value);
			}
		} );
	},

	getParam : function() {
		return {
			lotid   : this.need('#lotid'),
			playid  : Class.config('playId'),
			expect  : this.need('#expect'),
			matches : this.postMsg('msg_get_selected_matches').data,
			ggtype  : this.postMsg('msg_get_guoguan_type').data,
			ggname  : this.postMsg('msg_get_ggname').data 
		}
	}

});

/* 启动
--*/
Class( {
	ready : true,
	use   : 'mask',
	index:function (){
    	this.lib.Loadduizhen();
		this.onMsg('load_duizhen_succ', function () {
			this._index();
		});            
    },

    _index : function() {
		Class.config('playId', parseInt(this.need('#playid').val()));  //玩法id
		switch (Class.config('playId')) {
		case 85 :    //让球胜平负
			Class.config('playName', 'rqspf');
			Class.config('ggMaxLength', 15);
			Class.config('formatIndex', [3, 1, 0]);
			Class.config('formatValue', [3, 1, 0]);
			break;
		case 89 :    //总进球数
			Class.config('playName', 'jq');
			Class.config('ggMaxLength', 6);
			Class.config('formatIndex', [0, 1, 2, 3, 4, 5, 6, 7]);
			Class.config('formatValue', [0, 1, 2, 3, 4, 5, 6, 7]);
			break;
		case 88 :    //上下单双
			Class.config('playName', 'ds');
			Class.config('ggMaxLength', 6);
			Class.config('formatIndex', ['上+单', '上+双', '下+单', '下+双']);
			Class.config('formatValue', [3, 2, 1, 0]);
			break;
		case 86 :    //比分
			Class.config('playName', 'bf');
			Class.config('ggMaxLength', 3);
			Class.config('formatIndex', ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '9:0', '0:0', '1:1', '2:2', '3:3', '9:9', '0:1', '0:2', '0:3', '1:2', '1:3', '2:3', '0:4', '1:4', '2:4', '0:9']);
			Class.config('formatValue', ['10', '20', '21', '30', '31', '32', '40', '41', '42', '90', '00', '11', '22', '33', '99', '01', '02', '03', '12', '13', '23', '04', '14', '24', '09']);
			break;
		case 87 :    //半全场
			Class.config('playName', 'bq');
			Class.config('ggMaxLength', 6);
			Class.config('formatIndex', ['3-3', '3-0', '3-1', '0-3', '0-0', '0-1', '1-3', '1-0', '1-1']);
			Class.config('formatValue', ['33', '30', '31', '03', '00', '01', '13', '10', '11']);
	    }
		
		this.lib.MatchSelector({
			matches : 'div.match_list'
		});

		this.lib.GuoguanType({
			ggTypeTag  : '#gg_group',
			endtimeTag : '#endtime',
			switchLink : '#switch_link',
			formatSwitch  : '#format_switch',
			formatDisplay : '#format_display'
		});

		this.lib.TheForm( {
			fileInput   : '#upload input',
			beishuInput : '#beishu'
		} );

		this.lib.ConfirmForm();
		this.lib.XfqBuyForm();
		this.lib.Clock('#sysTimeDisplay');
		
		// 创建一个公共弹窗, 使用msg_show_dlg进行调用
		this.infoLay = this.lib.MaskLay('#defLay', '#defConent');
		this.infoLay.addClose('#defCloseBtn', '#defTopClose a');
		this.get('#defLay div.tan_top').drag(this.get('#defLay'));

		// 提供弹窗服务
		this.onMsg('msg_show_dlg', function (msg, fn, forbid_close) {
			this.infoLay.pop(msg, fn, forbid_close);
		} );
		
		this.get('#f').click( function() { //选择场次
			Y.get('#xfq').hide();
			Y.get('#sc').show();
			Y.get('#vsTable').show();
		});
		
		this.get('#s').click( function() { //上传包含场次的文本
			Y.get('#xfq').hide();
			Y.get('#sc').show();
			Y.get('#vsTable').hide();
		});
		
		this.get('#t').click( function() { //先发起后上传 
			Y.get('#sc').hide();
			Y.get('#vsTable').hide();
			Y.get('#xfq').show();		
		});

		// 发起代购
		Y.get('#dg_btn').click( function() {
			Y.postMsg('msg_do_dg');
		} );

		// 发起合买
		Y.get('#hm_btn').click( function() {
			Y.postMsg('msg_do_hm');
		} );
	}

} );


/* Clock 当前时间
------------------------------------------------------------------------------*/
Class( 'Clock', {
	index : function(clock_id) {
		this.clockTag = this.get(clock_id);
		Class.config('servertimediff', 0); 
		this.runClock();
		
	},
	runClock : function() {
		var Y = this;		
		Y.ajax({
			url : "/cpdata/time.json",
			end : function(data) {
				var servernow = Y.getDate(data.date);			
				var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
				Class.config('servertimediff',(diff));
				
				setInterval( function() {
					var now = new Date();
					var d = new Date(Date.parse(now) + Class.config('servertimediff'));
					var d_str = Y.addZero((d.getMonth() + 1)) + '月' + Y.addZero(d.getDate()) + '日 ' + Y.addZero(d.getHours()) + ':' + Y.addZero(d.getMinutes()) + ':' + Y.addZero(d.getSeconds());
					Y.clockTag.html(d_str);
				}, 1000 );
				
				setInterval( function() {
					Y.ajax({
						url : "/cpdata/time.json",
						end : function(data) {
							var servernow = Y.getDate(data.date);			
							var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
							Class.config('servertimediff',(diff));						
						}
					});	
				}, 30000);
				
			}
		});	
	},
	addZero : function(n) {
		return parseInt(n) < 10 ? '0' + n : n;
	}
} );

/* 显示 当前对阵
------------------------------------------------------------------------------*/
Class('Loadduizhen',{
	index:function(){
		var lotid = location.search.getParam('lotid');
		if (lotid == "") {
			lotid = "85";
		}
		if(lotid!="85" &&lotid!="86" &&lotid!="87" &&lotid!="88" &&lotid!="89"){
			lotid = "85";
		}
		$("#playid").val(lotid);
		$("#lotid").val(lotid);
		$("#bj"+lotid).addClass('cur');
		this.LoadDuiZhen();
		this.Loadgeshi(lotid);
	},
	
	LoadDuiZhen : function() {
		if ($("#vsTable").size()==0){
			return false;
		}		
		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id
		this.ajax({
	        url: "/cpdata/game/85/s.json",
	        end : function(data) {
				var obj = eval("(" + data.text + ")");
				var code = obj.period.code;
				var pid = obj.period.row.pid;
				if (code == "0") {
					$("#expect").val(pid);
					this.ajax({
				        url: "/cpdata/match/beid/"+pid+"/spf.json",
				        end : function(data) {
							var obj = eval("(" + data.text + ")");
							var code = obj.match.code;
							var desc = obj.match.desc;
							if (code == "0") {
								this.getduizhen(data);											
							} else {
								this.alert(desc);
							}
						},
						error : function() {
							this.alert("网络故障!");
							return false;
						}
					});
				}
			},
			error : function() {
				this.alert("网络故障!请重新刷新。");
				return false;
			}
		});
	},
	
	getduizhen:function(data){
		 var html = [];
		 var tableTpl=['<p class="sh_hd"><a id="d{$enddate}" onclick=\"openday(\'{$enddate}\');\" class="a_hide">隐藏</a><span>{$enddate} {$weekday}(10：00--次日10：00)</span></p>'+
		               '<div class="match_list" id="div{$enddate}">',//0头
		               '<span style="cursor:pointer;DISPLAY:{$dispalay}" title="截止时间：{$et}">{$index} <label for=m{$itemid}><input type="checkbox" name=m{$itemid} id=m{$itemid} {$disabled} value={$itemid} endtime="{$et}"/> {$hn}{$short_mt}{$gn}</label></span>',//1非让球
		               '<span style="cursor:pointer;DISPLAY:{$dispalay}" title="截止时间：{$et}">{$index} <label for=m{$itemid}><input type="checkbox" name=m{$itemid} id=m{$itemid} {$disabled} value={$itemid} endtime="{$et}"/> {$hn}({$closestr}){$short_mt}{$gn}</label></span>',//2让球
		               '</div>'//3
		      		];
		var mathdate=[];
		var wk=["日","一","二","三","四","五","六"];
		
		var all_matches=0;
		var out_of_date_matches=0;
		var numstr=[];
		var num=0;
		
		var obj = eval("(" + data.text + ")");
		var r = obj.match.row;
		if(!this.isArray(r)){r=new Array(r);}
		r.each(function(row,i){
			row.enddate=(((Y.getDate(row.bt).getHours()<10) || (Y.getDate(row.bt).getHours()==10 && Y.getDate(row.bt).getMinutes()==0))?(Y.getDate(Date.parse(Y.getDate(row.bt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.bt).format('YY-MM-DD'));
			if (mathdate.indexOf(row.enddate)<0){
				if(mathdate.length>0){numstr[numstr.length]=num;}
				num=0;
				row.num=numstr.length;
				mathdate[mathdate.length]=row.enddate;
				row.weekday='周'+wk[Y.getDate(row.enddate).getDay()];
				html[html.length] = mathdate.length>1?(tableTpl[3]+tableTpl[0].tpl(row)):tableTpl[0].tpl(row);
			};
			row.et=Y.getDate(Date.parse(Y.getDate(row.et))-1000*60*10).format('YY-MM-DD hh:mm:ss');
			row.index=row.mid;
			row.itemid=row.mid;
			row.short_mt=Y.getDate(row.bt).format('hh:mm');

			all_matches++;
			
			row.hn=row.hn.substr(0,4);
			row.gn=row.gn.substr(0,4);

			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期
				out_of_date_matches++;
				row.dispalay="none";
				row.disabled="disabled";
			}else{//未过期
				num++;
				row.dispalay="";
				row.disabled="";
			};
			
			if (Class.config('playId')==85 && parseInt(row.close)>0){
				row.closestr='<strong style="color:red">+'+row.close+'</strong>';
				html[html.length] = tableTpl[2].tpl(row);
			}else if (Class.config('playId')==85 && parseInt(row.close)<0){
				row.closestr='<strong style="color:green">'+row.close+'</strong>';
				html[html.length] = tableTpl[2].tpl(row);
			}else{
				row.closestr="";
				html[html.length] = tableTpl[1].tpl(row);
			}
			
		});
		numstr[numstr.length]=num;

		$("#total_matches").val(all_matches);
		$("#end_matches").val(out_of_date_matches);
		$("#vsTable").html(html.join('')+ tableTpl[3]);
		for(var ii=0;ii<numstr.length;ii++){
			$("#num"+ii).html(numstr[ii]);
		}
		$("#vsTable").show();	
		this.postMsg('load_duizhen_succ');			
	},
	Loadgeshi:function(lotid){
		var tableTmpl=['<div class="main_tan_yet">'+
		               '<div class="tan_top"><div class="tan_top_l"></div><div class="tan_top_yet"><h3>胜平负格式转化修改</h3></div><div class="tan_top_r"><a></a></div></div>'+
		               '<div class="tan_mid"><div class="gs_xg_b"><table width="100%" border="0">'+
		               '<colgroup><col width="60" /><col width="60" /><col width="60" /><col width="60" /><col /></colgroup>'+
		               '<tr><th>选项</th><td> 胜</td><td>平</td><td>负</td><td  rowspan="2"><a class="a_oth" id=confirm_btn>确认</a><a id="clear_btn">清除</a><a id="reset_btn">还原</a></td></tr>'+
		               '<tr><th>上传字符</th><td><input type="text" value=3 maxLength=1/></td><td><input type="text" value=1 maxLength=1/></td><td><input type="text" value=0 maxLength=1/></td></tr>'+
		               '</table></div></div></div>',
		               '<div class="main_tan_yet"><div class="tan_top"><div class="tan_top_l"></div><div class="tan_top_yet"><h3>总进球数格式转化修改</h3></div>'+
		               '<div class="tan_top_r"><a></a></div></div>'+
		               '<div class="tan_mid"><div class="gs_xg_b"><table width="100%" border="0"><colgroup><col width="50" />'+
		               '<col width="45" /><col width="45" /><col width="45" /><col width="45" /><col width="45" /><col width="45" /><col width="45" /><col /></colgroup>'+
		               '<tr><th>选项</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7+</td></tr>'+
		               '<tr><th>上传字符</th><td><input type="text" value=0 maxLength=1/></td><td><input type="text" value=1 maxLength=1/></td><td><input type="text" value=2 maxLength=1/></td><td><input type="text" value=3 maxLength=1/></td>'+
		               '<td><input type="text" value=4 maxLength=1/></td><td><input type="text" value=5 maxLength=1/></td><td><input type="text" value=6 maxLength=1/></td><td><input type="text" value=7 maxLength=1/></td></tr>'+
		               '<tr><td colspan="10"><a id=confirm_btn class="a_oth" style="margin-left:150px;_margin-left:75px">确认</a><a id="clear_btn">清除</a><a id="reset_btn">还原</a></td></tr>'+
		               '</table></div></div></div>',
		               '<div class="main_tan_yet1"><div class="tan_top"><div class="tan_top_l"></div>'+
		               '<div class="tan_top_yet1"><h3>半全场格式转化修改</h3></div><div class="tan_top_r"><a></a></div></div>'+
		               '<div class="tan_mid"><div class="gs_xg_b"><table width="100%" border="0"><colgroup><col width="50" />'+
		               '<col width="50" /><col width="50" /><col width="50" /><col width="50" /><col width="50" />'+
		               '<col width="50" /><col width="50" /><col width="50" /><col /></colgroup>'+
		               '<tr><th>选项</th><td>胜-胜</td><td>胜-负</td><td>胜-平</td>'+
		               '<td>负-胜</td><td>负-负</td><td>负-平</td><td>平-胜</td><td>平-负</td><td>平-平</td></tr>'+
		               '<tr><th>上传字符</th><td><input type="text" value="33" maxlength="2" /></td>'+
		               '<td><input type="text" value="30" maxlength="2" /></td>'+
		               '<td><input type="text" value="31" maxlength="2" /></td>'+
		               '<td><input type="text" value="03" maxlength="2" /></td>'+
		               '<td><input type="text" value="00" maxlength="2" /></td>'+
		               '<td><input type="text" value="01" maxlength="2" /></td>'+
		               '<td><input type="text" value="13" maxlength="2" /></td>'+
		               '<td><input type="text" value="10" maxlength="2" /></td>'+
		               '<td><input type="text" value="11" maxlength="2" /></td></tr>'+
		               '<tr><td colspan="10"><a id=confirm_btn class="a_oth" style="margin-left:200px;_margin-left:100px">确认</a><a id="clear_btn">清除</a><a id="reset_btn">还原</a></td></tr>'+
		               '</table></div></div></div>',
		               '<div class="main_tan_yet">'+
					   '<div class="tan_top"><div class="tan_top_l"></div>'+
				       '<div class="tan_top_yet"><h3>上下单双格式转化修改</h3></div>'+
					   '<div class="tan_top_r"><a></a></div></div>'+
				       '<div class="tan_mid"><div class="gs_xg_b"><table width="100%" border="0">'+
				       '<colgroup><col width="50" /><col width="45" /><col width="45" /><col width="45" /><col width="45" /><col /></colgroup>'+
				       '<tr><th>选项</th><td>上+单</td><td>上+双</td><td>下+单</td><td>下+双</td><td  rowspan="2"><a id=confirm_btn class="a_oth">确认</a><a id="clear_btn">清除</a><a id="reset_btn">还原</a></td></tr>'+
					   '<tr><th>上传字符</th><td><input type="text" value=3 maxLength=1/></td><td><input type="text" value=2 maxLength=1/></td><td><input type="text" value=1 maxLength=1/></td><td><input type="text" value=0 maxLength=1/></td></tr>'+
					   '</table></div></div></div>'
		               ];	
		 switch (lotid) {
			case "85" :    //让球胜平负
				$("#format_switch").html(tableTmpl[0]);
				$("#tzurl").attr('href','/bj/index.html');
				$("#bzgs").click(function(){
					Yobj.openUrl('/bj/bzgs/SPF.html',450,387)
				});
				break;
			case "89" :    //总进球数
				$("#format_switch").html(tableTmpl[1]);
				$("#tzurl").attr('href','/bj/jqs.html');
				$("#bzgs").click(function(){
					Yobj.openUrl('/bj/bzgs/JQS.html',450,387)
				});
				break;
			case "88" :    //上下单双
				$("#format_switch").html(tableTmpl[3]);
				$("#tzurl").attr('href','/bj/sxds.html');
				$("#bzgs").click(function(){
					Yobj.openUrl('/bj/bzgs/SXP.html',450,387)
				});
				break;
			case "86" :    //比分
				$("#tzurl").attr('href','/bj/cbf.html');
				$("#bzgs").click(function(){
					Yobj.openUrl('/bj/bzgs/CBF.html',470,387)
				});
				break;
			case "87" :    //半全场
			    $("#format_switch").html(tableTmpl[2]);
			    $("#tzurl").attr('href','/bj/bqc.html');
				$("#bzgs").click(function(){
					Yobj.openUrl('/bj/bzgs/BQC.html',450,387)
				});
			    break;
		}	
	}
});


var openday=function(d){
	if(Y.get("#d"+d).attr("class")=="a_hide"){
		Y.get('#div'+d).hide();
		Y.get("#d"+d).attr("class","a_show").html("显示");
	}else{
		Y.get('#div'+d).show();
		Y.get("#d"+d).attr("class","a_hide").html("隐藏");
	}
};