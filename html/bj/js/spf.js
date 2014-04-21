/* LineSelector 北单行选择器*/
Class( 'LineSelector', {

	index : function(config) {

		this.vsLine       = config.tr;
		this.vsIndex      = config.vsIndex;
		this.vsOptions    = config.vsOptions;
		this.vsCheckAll   = config.vsCheckAll;
		this.spTag        = config.spTag;
		this.vsInfo       = config.vsInfo;
		this.a      	  = config.a;
		this.div1      	  = config.div1;
		this.div2      	  = config.div2;
		this.div3      	  = config.div3;

		this.disabled     = this.vsInfo.disabled === 'yes';
		this.index        = this.vsInfo.index;
		this.data         = [];  //本行的投注结果
		this.codeValIdx   = Class.config('codeValueIndex');

		this.bindEvent();
		if (this.disabled && !Class.config('stopSale')) {
			this.vsIndex.disabled = true;
		}
		this.vsIndex.checked = true;
		!this.disabled && this.initClearAll(); //初始时全不选中

		// 取消某一选项的选择
		this.onMsg('msg_touzhu_cancel', function(line_index, ck_value) {
			if (this.index == line_index) {
				var ck_index, ck;
				ck_index = this.getIndex(Class.config('codeValue'), ck_value);
				ck = this.vsOptions[ck_index].getElementsByTagName('input')[0];
				this.unCheck(ck);
				return false; //停止消息传递
			}
		});

	},

	// 绑定相关事件
	bindEvent : function() {
		var Y = this;

		// 鼠标经过每一行时改变样式
		// 鼠标经过每一行时改变样式
//		this.get(this.vsLine).hover( function() {
//			this.children[0].style.backgroundColor = '#fee6ad';
//			this.children[2].style.backgroundColor = '#fee6ad';
//			this.children[6].style.backgroundColor = '#fee6ad';
//			this.children[7].style.backgroundColor = '#fee6ad';
//			this.children[8].style.backgroundColor = '#fee6ad';
//			Y.get(this).find(".h_br").addClass("h_brx");
//          	 Y.get(this).find(".label_cd").removeClass("h_brx");
//		}, function() {
//			this.children[0].style.backgroundColor = '';
//			this.children[2].style.backgroundColor = '';
//			this.children[6].style.backgroundColor = '';
//			this.children[7].style.backgroundColor = '';
//			this.children[8].style.backgroundColor = '';
//             Y.get(this).find(".h_br").removeClass("h_brx");
//             Y.get(this).find(".label_cd").removeClass("h_brx");
//		} );
		
//        $('#vsTable  tr[value] .h_br').mouseout(function (e, Y){//鼠标滑入滑出效果
//            var tdCSS=$(this).find('.chbox').attr("checked")==true?"h_br label_cd":"h_br h_brx";
//            $(this).attr("class",tdCSS);
//        });
		// 点击隐藏某场比赛
		this.vsIndex.onclick = function() {
			Y.hideLine();
		}

		if (this.disabled) return;

		// 点击选项进行投注
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].parentNode.onmousedown = function() {
				var ck = this.getElementsByTagName('input')[0];
				ck.checked ? Y.unCheck(ck) : Y.check(ck);
			}
		}
		// Y.use('mask', function (){
    			// Y.get('#dshelp').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
    		// });
		// 全选/全不选
		this.vsCheckAll.parentNode.onmousedown = function() {
			var ck = this.getElementsByTagName('input')[0];
			ck.checked = !ck.checked;
			ck.checked ? Y.checkAll() : Y.clearAll();
		}
	},

	check : function(ck) {
		this.data[this.codeValIdx[ck.value]] = ck.value;
		ck.checked = true;
		//ck.parentNode.parentNode.style.backgroundColor = '#FFDAA4';
		Y.removeClass(ck.parentNode.parentNode.parentNode, 'h_brx');
		Y.addClass(ck.parentNode.parentNode.parentNode, 'label_cd');
		this.vsCheckAll.checked = this.getData().length == this.vsOptions.length;
		if(this.getData().length==3){
			this.a.innerHTML="清";
		}
		this.changed();
	},

	unCheck : function(ck) {
		this.data[this.codeValIdx[ck.value]] = undefined;
		ck.checked = false;
		//ck.parentNode.parentNode.style.backgroundColor = '';
		Y.removeClass(ck.parentNode.parentNode.parentNode, 'label_cd');
		this.vsCheckAll.checked && (this.vsCheckAll.checked = false);
		if(this.getData().length!=3){
			this.a.innerHTML="全";
		}
		this.changed();
	},

	checkAll : function() {
		this.data = Class.config('codeValue').slice();
		this.vsCheckAll.checked = true;
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].getElementsByTagName('input')[0].checked = true;
			//this.vsOptions[i].parentNode.style.backgroundColor = '#FFDAA4';
			Y.removeClass(this.vsOptions[i].parentNode.parentNode, "h_brx");
			Y.addClass(this.vsOptions[i].parentNode.parentNode, 'label_cd');
		}
		this.a.innerHTML="清";
		this.changed();
	},

	clearAll : function() {
		this.data = [];
		this.vsCheckAll.checked = false;
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].getElementsByTagName('input')[0].checked = false;
			//this.vsOptions[i].parentNode.style.backgroundColor = '';
			Y.removeClass(this.vsOptions[i].parentNode.parentNode, 'label_cd');
		}
		this.a.innerHTML="全";
		this.changed();
	},
	initClearAll : function() {
		var ck = this.vsLine.getElementsByTagName('input');
		for (var i = 1, l = ck.length; i < l; i++) {
			ck[i].checked = false;
		}
	},

//	hideLine : function() {  //隐藏当前行
//		if (this.vsLine.style.display != 'none') {
////			this.div1.style.display = 'none';
////			this.div2.style.display = 'none';
////			this.div3.style.display = 'none';
//			this.vsLine.style.display = 'none';
//			
//			this.getData().length > 0 && this.clearAll();
//			!this.vsIndex.disabled && this.postMsg('msg_one_match_hided');
//			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
//		}
//	},
	hideLine : function() {  //隐藏当前行
		if (this.vsLine.style.display != 'none') {
			this.vsLine.style.display = 'none';
			this.getData().length > 0 && this.clearAll();
			!this.vsIndex.disabled && this.postMsg('msg_one_match_hided');
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		}
	},

	showLine : function() {  //显示当前行
		if (this.vsLine.style.display == 'none') {
			this.vsLine.style.display = '';
			this.vsIndex.checked = true;
			!this.vsIndex.disabled && this.postMsg('msg_one_match_showed');
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		}
	},

	// 获取本行投注数据
	getData : function() {
		if (this.disabled) return [];
		return this.data.each( function(d) {
			d && this.push(d);
		}, [] );
	},

	// 选中某些特定的选项
	checkCertainVsOptions : function(ck_value) {
		var code_value = Class.config('codeValue').slice();
		ck_value.split(',').each( function(v) {
			var i = this.getIndex(code_value, v);
			this.check(this.vsOptions[i].getElementsByTagName('input')[0]);
		}, this );
	},

	// 更新SP值
	updateSP : function(sp_values) {
		if (this.spTag && !this.disabled) {
			this.spTag.each( function(item, index) {
				var sp_old, sp_new, arrow = '';
				sp_old = parseFloat(item.innerHTML);
				sp_new = parseFloat(sp_values[index]);
				this.get(item).removeClass('red').removeClass('green');
				if (sp_new > sp_old) {
					this.get(item).addClass('red');
					arrow = '↑';
				} else if (sp_new < sp_old) {
					this.get(item).addClass('green');
					arrow = '↓';
				}
				if (Class.config('playName') == 'jq' || Class.config('playName') == 'bq') {
					arrow = '';  //进球和半全不显示箭头
				}
				item.innerHTML = sp_new ? sp_new.toFixed(2) + arrow : '--';
			}, this );
		}
	},

	changed : function() {
		this.postMsg('msg_line_selector_changed');
	}

} );


/*对阵列表选择*/
Class( 'TableSelector', {

	vsInfo : [],
	hiddenMatchesNum : 0,
	codes  : [],

	index : function(config) {
		var Y = this;

		this.vsTable = this.need(config.vsTable);
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu   = this.need(config.ckRangqiu);
			this.ckNoRangqiu = this.need(config.ckNoRangqiu);
		}
		this.wdls =this.need(config.wdls);
		this.ckOutOfDate = this.need(config.ckOutOfDate);
		this.hiddenMatchesNumTag = this.need(config.hiddenMatchesNumTag);
		this.matchShowTag = this.need(config.matchShowTag);
		this.matchFilter  = this.need(config.matchFilter);
		this.leagueShowTag  = this.need(config.leagueShowTag);
		this.leagueSelector = this.need(config.leagueSelector);
		this.selectAllLeague      = this.need(config.selectAllLeague);
		this.removeAllLeague =this.need(config.removeAllLeague);
		this.selectOppositeLeague = this.need(config.selectOppositeLeague);

		this.stopSale = Class.config('stopSale');
		this.allEnd = this.get('#out_of_date_matches').val() == this.get('#all_matches').val(); //全部截止

		this.initVsTrs(config.vsLines);  //建立好各个单行对象

		this.onMsg('msg_line_selector_changed', this.changed);

		this.onMsg('msg_touzhu_line_cancel', function(index) {
			
			if(index.length>1){
				for(var i=0;i<index.length;i++){
					this.vsTrs[index[i] - 1].clearAll();
				}
			}else{
				this.vsTrs[index - 1].clearAll();
			}
		} );

		this.onMsg('msg_get_touzhu_codes', function() {
			return this.codes;
		} );

		this.onMsg('msg_get_codes_4_submit', function() {
			return this.getCodes4Submit();
		} );
		
		// 为显示奖金预测提供相关数据
		this.onMsg('msg_get_data_4_prize_predict', function() {
			return this.getData4PrizePredict();
		} );

		// 返回修改时重现之前选择的比赛
		this.onMsg('msg_restore_codes', function(codes) {
			this.restoreCodes(codes);
		} );
		this.initMatchFilter();  //赛事过滤
	},

	initVsTrs : function(vs_lines) {
		var Y = this, input_length = 0;
		this.vsTrs = this.need(vs_lines).each( function(tr, i) {
			var vs_info = Y.dejson(tr.getAttribute('value'));
			input_length == 0 && (input_length = tr.getElementsByTagName('input').length);
			this[i] = Y.lib.LineSelector( {
				tr           : tr,
				vsIndex      : tr.getElementsByTagName('input')[0],
				vsOptions    : tr.getElementsByTagName('label'),
				vsCheckAll   : tr.getElementsByTagName('input')[input_length - 1],
				spTag        : Y.get('span.sp_value', tr),
				vsInfo       : vs_info,
				a            : tr.getElementsByTagName('a')[1],
				div1          : tr.getElementsByTagName('div')[0],
				div2          : tr.getElementsByTagName('div')[1],
				div3          : tr.getElementsByTagName('div')[2]
			} );
			Y.vsInfo[vs_info.index] = vs_info;  //存储所有比赛的相关数据
		}, [] );
	},

	// 获取所有行的投注数据
	getCodes : function() {
		this.codes = this.vsTrs.each( function (item) {
			if (item.disabled) return;
			var _data = item.getData();
			if (_data.length > 0) {
				this.push( {
					'index' : item.index,
					'arr'   : _data,
					'dan'   : false,
					'vsInfo': item.vsInfo
				} );
			}
		}, [] );
		return this.codes;
	},

	// 获取投注数据
	getCodes4Submit : function() {
		var codes, danma, arr_danma;
		codes = new Array();
		danma = new Array();
		arr_danma = this.postMsg('msg_get_danma').data;
		this.vsTrs.each( function(item) {
			var i, v;
			v = item.getData();
			i = item.index;
			if (v.length > 0) {
				var tmp_code = '';
				tmp_code = i + ':[';
				tmp_code += v.each( function(v2) {
					this.push( v2 );
				}, [] ).join(',');
				tmp_code += ']';
				codes.push(tmp_code);
				arr_danma[i] == true && danma.push(tmp_code);
			}
		} );
		return { 'codes':codes.join('/'), 'danma':danma.join('/') }; 
	},

	// 为显示奖金预测提供相关数据
	getData4PrizePredict : function() {
		var Y = this;
		return this.vsTrs.each( function(item, i) {
			var sp = [], vs_info;
			if (item.spTag) {
				sp = item.spTag.each( function(item2) {
					this.push( parseFloat(item2.innerHTML) || 0 );
				}, [] );
			}
			vs_info = Y.vsInfo[item.index];
			this.push( {
				'serialNumber' : item.index,
				'lg'    : vs_info.leagueName,
				'main'  : vs_info.homeTeam,
				'guest' : vs_info.guestTeam,
				'rq'    : vs_info.rangqiuNum,
				'sp'    : sp
			} );
		}, [] );
	},

	changed : function() {
		this.postMsg('msg_table_selector_changed', this.getCodes());
	},

	initMatchFilter : function() {
		var Y = this;

		// 几个复选框的初始状态
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', true);
			this.get('#rangqiu_tag').html(this.get('#rangqiu_matches').val());
			this.ckNoRangqiu.prop('checked', true);
			this.get('#no_rangqiu_tag').html(this.get('#no_rangqiu_matches').val());
			
		}
		this.wdls.prop('checked', false);
		this.ckOutOfDate.prop('checked', false);
		this.get('#out_of_date_tag').html(this.get('#out_of_date_matches').val() + '场');

		this.initVsDisplay(); //初始化对阵的显示情况

		this.onMsg('msg_update_hidden_matches_num', function() {
			Y.hiddenMatchesNumTag.html(Y.hiddenMatchesNum);
		} );

		// 设定消息，以改变隐藏比赛数量的显示
		this.onMsg('msg_one_match_showed', function() {
			Y.hiddenMatchesNum--;
			Y.postMsg('msg_update_hidden_matches_num');
		} );
		this.onMsg('msg_one_match_hided', function() {
			Y.hiddenMatchesNum++;
			Y.postMsg('msg_update_hidden_matches_num');
		} );

		this.onMsg('msg_show_certain_league', function(league_name) {
			Y.showCertainLeague(league_name);
		} );

		// 成块地显示或隐藏某归属日期下的所有赛事$('#'+id+' tr').eq(1).is(":visible")
//		this.onMsg('msg_show_or_hide_matches', function(id, obj) {
//			if (Y.get(obj).html().indexOf('隐藏') != -1) {
//				Y.get('#'+id+' div').each(function(){
//					Y.get(this).hide();
//				});
//				
//				Y.need('#'+id).hide();
//				Y.get(obj).html('显示<s class="c_down"></s>');
//				var tr=$('#'+id+' tr');
////				tr.find('input:checkbox').eq(0).prop('checked', true);
//				for(var i=0;i<tr.length;i++){
//					if(tr.eq(i).attr("style")!="display: none;"){
//						this.postMsg('msg_one_match_hided');
//					}
//				}
////				this.postMsg('msg_one_match_showed')
//			} else {
//				Y.get('#'+id+' div').each(function(){
//					Y.get(this).show();
//				});
//				Y.get('#'+id+' tr').each(function(){
//					Y.get(this).show();
//					Y.get(this).find('input:checkbox').eq(0).prop('checked', true);
//				});
//				Y.get('#'+id+' tr').show().find('input:checkbox').eq(0).prop('checked', true);
////				Y.get('#'+id+' tr').find('input:checkbox[]')[0].each(function(){
////					Y.get(this).prop('checked', true);
////				});
//				var tr=$('#'+id+' tr');
//				for(var i=0;i<tr.length;i++){
//					this.postMsg('msg_one_match_showed');
//				}
//				Y.need('#'+id).show();
//				Y.get(obj).html('隐藏<s class="c_up"></s>');
//			}
//			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
//		} );
		this.onMsg('msg_show_or_hide_matches', function(id, obj) {
			if (Y.get(obj).html().indexOf('隐藏') != -1) {
				Y.need('#'+id).hide();
				Y.get(obj).html('显示<s class="c_down"></s>');
			} else {
				Y.need('#'+id).show();
				Y.get(obj).html('隐藏<s class="c_up"></s>');
			}
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		} );

		// 显示或隐藏有让球的场次
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.click( function() {
				var be_controlled = Y.stopSale || Y.ckOutOfDate.prop('checked');
				Y.vsTrs.each( function(item) {
					if (Y.vsInfo[item.index].rangqiuNum != 0 && (!item.disabled || be_controlled)) {
						this.checked ? item.showLine() : item.hideLine();
					}
				}, this );
			} );
			// 显示或隐藏非让球的场次
			this.ckNoRangqiu.click( function() {
				var be_controlled = Y.stopSale || Y.ckOutOfDate.prop('checked');
				Y.vsTrs.each( function(item) {
					if (Y.vsInfo[item.index].rangqiuNum == 0 && (!item.disabled || be_controlled)) {
						this.checked ? item.showLine() : item.hideLine();
					}
				}, this );
			} );
		}

		// 显示或隐藏已截止的场次
		this.ckOutOfDate.click( function() {
			var be_controlled = true;
			Y.vsTrs.each( function(item) {
				if (Class.config('playName') == 'rqspf') {
					be_controlled = (Y.vsInfo[item.index].rangqiuNum != 0 && Y.ckRangqiu.prop('checked')) || 
										(Y.vsInfo[item.index].rangqiuNum == 0 && Y.ckNoRangqiu.prop('checked'));
				}
				if (item.disabled && be_controlled) {
					this.checked ? item.showLine() : item.hideLine();
				}
			}, this );
			//this.checked ? Y.showAllTBody() : Y.hideSpareTBody();
			this.checked && Y.showAllTBody();
		} );

		// 点击已隐藏比赛的数量则显示所有的比赛
		this.hiddenMatchesNumTag.click( function() {
			if (this.innerHTML != '0') {
				Y.showAllMatches();
			}
		} );

		// 显示或隐藏联赛选择区域
		var timeout_id;
		this.leagueShowTag.mouseover( function() {
			if (Y.get("#lglist").innerHTML == '') {
				Y.createLeagueList();  //生成联赛选择列表
			}
			clearTimeout(timeout_id);
			Y.leagueSelector.show();
			Y.leagueShowTag.find("div.matchxz").addClass('matchxzc');
		} );
		this.leagueShowTag.mouseout( function() {
			timeout_id = setTimeout( function() {
				Y.leagueSelector.hide();
				Y.leagueShowTag.find("div.matchxz").removeClass('matchxzc');
			}, 100);
		} );
		this.leagueSelector.mouseover( function() {
			clearTimeout(timeout_id);
			Y.leagueSelector.show();
		} );
//		this.leagueSelector.mouseout( function() {
//			timeout_id = setTimeout( function() {
//				Y.leagueSelector.hide();
//				Y.leagueShowTag.removeClass('ls_h_btn');
//			}, 100);
//		} );

		// 选择或隐藏某个指定的联赛
		this.leagueSelector.live('#lglist input', 'click', function(e, ns) {
			Y.vsTrs.each( function(item) {
				if (Y.vsInfo[item.index].leagueName == this.value && 
				        (!item.disabled || Y.stopSale || Y.ckOutOfDate.prop('checked'))) {
					this.checked ? item.showLine() : item.hideLine();
				}
			}, this );
		} );
		//显示五大联赛
		this.wdls.click(function(){
			if($(this).attr("checked")){
				 Y.get("#lglist input").prop('checked', false);
     		   $("input[value='西甲']").attr("checked",true);
	            	$("input[value='德甲']").attr("checked",true);
	            	$("input[value='法甲']").attr("checked",true);
	            	$("input[value='意甲']").attr("checked",true);
	            	$("input[value='英超']").attr("checked",true);
     	   }else if(!$(this).attr("checked")){
     		   Y.get("#lglist input").prop('checked', true);
     	   }
			Y.vsTrs.each( function(item) {
				if ((Y.vsInfo[item.index].leagueName !="西甲"&&Y.vsInfo[item.index].leagueName !="德甲"&&Y.vsInfo[item.index].leagueName !="法甲"&&Y.vsInfo[item.index].leagueName !="意甲"&&Y.vsInfo[item.index].leagueName !="英超") && (!item.disabled )) {
					this.checked ?item.hideLine() : Y.showAllMatches();
				}else{
//					item.showLine()
				}
			}, this );
		
		});
		// 全选所有联赛
		this.selectAllLeague.click( function() {
			Y.showAllMatches();
		} );
		this.removeAllLeague.click(function(){
			Y.removeAllMatches();
		})
		// 反选所有联赛
		this.selectOppositeLeague.click( function() {
			Y.leagueSelector.find('ul input').each( function(item) {
				item.click();
			} );
		} );

		// 显示或隐藏赛事筛选区域
		this.matchShowTag.drop( this.matchFilter, { 
			y : this.ie ? 7 : -1,
			x : this.ie ? 0 : -1,
			focusCss : 'dc_all_s dc_all_on',
			onshow : function() {
				this.matchShowTag.find('s').swapClass('c_down', 'c_up');
			},
			onhide : function() {
				this.matchShowTag.find('s').swapClass('c_up', 'c_down');
			}
		} );
	},

	// 返回修改时重现之前选择的比赛
	restoreCodes : function(codes) {
		codes.each( function(obj) {
			this.vsTrs[obj.index - 1].checkCertainVsOptions(obj.arr);
		}, this );
	},

	// 更新SP值
	updateSP : function() {
		this.ajax( {
		url :	'/static/info/bjdc/sp/just_' + Class.config('expect') + '_' + Class.config('playId') + '.xml',
		end :	function(data) {
					var Y = this;
					if (data.xml) {
						this.qXml('/w/*', data.xml, function(obj, i) {
							var sp_values = new Array();
							for (var j = 1, l = Class.config('codeValue').length * 2; j <= l; j += 2) {
								sp_values.push(obj.items['c' + j]);
							}
							this.vsTrs[i].updateSP(sp_values);
						} );
						setTimeout( function() { Y.updateSP() }, 5*60*1000 );  //每隔一段时间再取一次
					} else {
						setTimeout( function() { Y.updateSP() }, 5000 );  //失败后短时间内再次请求
					}
				}
		} );
	},

	// 显示所有赛事
	showAllMatches : function() {
		this.vsTrs.each( function(item) {
			if (!item.disabled || this.stopSale || this.ckOutOfDate.prop('checked')) {
				item.showLine();
			}
		}, this );
		this.leagueSelector.find('ul input').each( function(item) {
			!item.checked && (item.checked = true);
		},this );
		this.matchShowTag.html('全部比赛' + this.matchShowTag.html().substr(4));
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', true);
			this.ckNoRangqiu.prop('checked', true);
		}
	},
	removeAllMatches:function(){
		this.vsTrs.each( function(item) {
			if (!item.disabled || this.stopSale || this.ckOutOfDate.prop('checked')) {
				item.hideLine();
			}
		}, this );
		this.leagueSelector.find('ul input').each( function(item) {
			item.checked && (item.checked = false);
		},this );
		this.matchShowTag.html('全部比赛' + this.matchShowTag.html().substr(4));
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', false);
			this.ckNoRangqiu.prop('checked', false);
		}
	},

	// 只显示某个特定的联赛(用于资讯区的跳转)
	showCertainLeague : function(league_name) {
		this.vsTrs.each( function(item) {
			if (item.vsInfo.leagueName == league_name && (!item.disabled || this.stopSale || this.allEnd)) {
				item.showLine();
			} else {
				item.hideLine();
			}
		}, this );
		this.createLeagueList();
		this.leagueSelector.find('ul input').each( function(item) {
			item.checked = item.value == league_name;
		},this );
	},

	// 初始化对阵的显示情况
	initVsDisplay : function() {
		var Y = this;
		var arr_tbody = this.vsTable.find('tbody').filter( function(tBody) {
			return tBody.id && /^\d+-\d+-\d+$/.test(tBody.id)
		} );
		if (this.stopSale || this.allEnd) {
			Class.config('disableBtn', true); //此时禁用代购或合买按钮
		}
		if (this.stopSale == true) {
			this.ckOutOfDate.prop('checked', true);
			this.ckOutOfDate.prop('disabled', true);
		} else if (this.allEnd) {
			this.ckOutOfDate.prop('checked', true);
			this.ckOutOfDate.prop('disabled', true);
			this.showAllMatches();
		}else {
			arr_tbody.nodes.each( function(item, index) {
				if (this.get(item).getSize().offsetHeight == 0) {
					document.getElementById('switch_for_' + item.id).getElementsByTagName('a')[0].style.visibility = 'hidden';
				//	this.get('#switch_for_' + item.id).parent('tbody').hide(); //其他归属日期下所有的比赛均截止时，该tbody同样要隐藏
				}
			}, this );
		}
	},

	// 显示所有的tbody
	showAllTBody : function() {
		this.get('tbody', this.vsTable).show();
	},

	// 显示特定的一些比赛
	showCertainMatches : function(arr_matches) {
		this.vsTrs.each( function(item) {
			this.getIndex(arr_matches, item.index) !== -1 ? item.showLine() : item.hideLine();
		}, this );
	},

	// 生成联赛选择列表
	createLeagueList : function() {}
});


/* TouzhuInfo 北单投注信息(一行)
------------------------------------------------------------------------------*/
Class( 'TouzhuInfoLine', {

	index : function(config) {
		this.index     = config.index;
		this.homeTeam  = config.homeTeam;
		this.guestTeam = config.guestTeam;
		this.endTime   = config.endTime;

		// 接收消息，生成某条特定的投注信息
		this.onMsg('msg_get_tr_html', function(oTr) {
			if (oTr.index == this.index) {
				return this.createTrHtml(oTr);
			}
		} );

		// 接收消息，返回单场比赛的截止时间
		this.onMsg('msg_get_endtime', function(line_index) {
			if (line_index == this.index) {
				return this.endTime;
			}
		} );
	},

	// 生成一行投注信息的html
	createTrHtml : function(oTr) {
		var tr_html, td_html, play_name, danma;
		td_html = '';
		play_name = Class.config('playName');
		oTr.arr.each( function(v) {
			td_html += '<span class="' + (play_name == 'jq' ? 'x_sz' : 'x_s yl') + '" value="' + this.index + '|' + v + '">' + v + '</span>';
		}, this );
		danma = this.postMsg('msg_get_danma').data;
		if (play_name == 'rqspf') {
			tr_html = '<tr>' + 
						  '<td>' + 
							  '<input type="checkbox" class="chbox" checked="checked" onclick="Yobj.postMsg(\'msg_touzhu_line_cancel\', ' + this.index + ')" />' + 
							  '<span class="chnum">' + this.index + '</span>' + 
						  '</td>' +
						  '<td class="t1" title="' + this.homeTeam + ' (' + oTr.vsInfo.rangqiuNum + ') ' + this.guestTeam + '">' + this.homeTeam + '</td>' +
						  '<td class="t1">' + td_html + '</td>' +
						  '<td><input type="checkbox" class="dan" value="' + this.index + '"' + (danma[this.index] ? ' checked="checked"' : '') + ' />' +
					  '</tr>';
		} else {
			tr_html = '<tr>' + 
						  '<td>' + 
							  '<input type="checkbox" class="chbox" checked="checked" onclick="Yobj.postMsg(\'msg_touzhu_line_cancel\', ' + this.index + ')" />' + 
							  '<span class="chnum">' + this.index + '</span>' + 
						  '</td>' +
						  '<td>' + this.homeTeam + '<span class="sp_vs">VS</span>' + this.guestTeam + '</td>' +
						  '<td><input type="checkbox" class="dan" value="' + this.index + '"' + (danma[this.index] ? ' checked="checked"' : '') + ' />' +
					  '</tr>' +
					  '<tr>' +
						  '<td colspan="3">' + td_html + '</td>' +
					  '</tr>';
		}
		return tr_html;
	}
	
} );


/* TouzhuInfo 北单投注信息
------------------------------------------------------------------------------*/
Class( 'TouzhuInfo', {

	matchNum : 0,
	danma : {},
	danmaNum : 0,

	index : function(config) {
		var Y = this;

		this.endtime = this.get(config.endtime);	
		this.touzhuTable = this.need(config.touzhuTable);
		this.checkboxclear = this.need(config.checkboxclear);
		
		this.touzhuTrs = this.need(config.vsLines).each( function(tr, i) {
			var vs_info = Y.dejson(tr.getAttribute('value'));
			this[i] = Y.lib.TouzhuInfoLine( vs_info );
		}, []);

		// 接收消息，更新投注信息
		this.onMsg('msg_table_selector_changed', function(data) {
			this.updateTouzhuInfoArea(data);
			this.storeDanma();
			if (this.danmaNum == this.matchNum) { //更新后当胆码数与场次数相等时，清空胆码
				this.disableOrEnableDanma(-1);
				this.storeDanma();
			}
			this.changed();
		} );

		this.onMsg('msg_get_danma', function() {
			return this.danma;
		} );

		// 禁用或恢复胆码复选框
		this.onMsg('msg_disable_or_enable_danma', function(gg_match_num) {
			this.disableOrEnableDanma(gg_match_num);
		} );

		this.spanCss = Class.config('playName') == 'jq' ? 'x_sz' : 'x_s';
		
		// 鼠标经过时显示一横线
		this.touzhuTable.live('span.' + Y.spanCss, 'mouseover', function(e, _y) {
			_y.get(this).addClass(config.mouseoverClass);
		} ).live('span.' + Y.spanCss, 'mouseout', function(e, _y) {
			_y.get(this).removeClass(config.mouseoverClass);
		} );

		// 点击取消选择
		this.touzhuTable.live('span.' + Y.spanCss, 'click', function(e, _y) {
			var a = _y.get(this).attr('value').split('|');
			_y.postMsg('msg_touzhu_cancel', a[0], a[1])
		} );
		// 点击清空
		this.checkboxclear.live('.jcq_kcur','click', function() {
			var boxnum=$("#touzhu_table .chnum").length;
			var myArray=new Array(boxnum);
			
			for(var i=0;i<boxnum;i++){
				myArray[i]=$("#touzhu_table .chnum").eq(i).html();
			}
				Yobj.postMsg('msg_touzhu_line_cancel',myArray);
			
		} );
		// 点击胆码时
		this.touzhuTable.live('input.dan', 'click', function() {
			Y.storeDanma();
			Y.postMsg('msg_disable_or_enable_ggck', Y.danmaNum);
		} );

		// 返回修改时重现之前选择的胆码
		this.onMsg('msg_restore_danma', function(danma) {
			this.touzhuTable.find('input.dan').each( function(item) {
				if (this.getIndex(danma, item.value) !== -1) {
					this.get(item).prop('checked', true);
				}
			}, this );
			this.storeDanma();
			this.postMsg('msg_disable_or_enable_ggck', this.danmaNum);
		} );

	},

	// 更新投注信息区域, 返回所选比赛的数量
	updateTouzhuInfoArea : function(data) {
		var Y, earliest_endtime, match_num;
		Y = this;
		earliest_endtime = '2099-12-30 00:00';
		match_num = 0;
		this.endtime.html('');
		this.touzhuTable.empty();
		data.each( function(item) {
			var endtime = Y.postMsg('msg_get_endtime', item.index).data;
			endtime < earliest_endtime && (earliest_endtime = endtime); //取得最早截止时间

			var tr = Y.postMsg('msg_get_tr_html', item).data; // 发送消息，获取生成行的html
			Y.get(tr).insert(Y.touzhuTable);
			match_num++;
		} );
		earliest_endtime != '2099-12-30 00:00' && Y.endtime.html(this.getDate(earliest_endtime).format('MM-DD hh:mm'));
		this.matchNum = match_num;
	},

	// 获取胆码
	storeDanma : function() {
		this.danma = {};
		this.danmaNum = 0;
		this.touzhuTable.find('input.dan').each( function(item) {
			this.danma[item.value] = item.checked;
			this.danma[item.value] && this.danmaNum++;
		}, this );
	},

	disableOrEnableDanma : function(gg_match_num) {
		this.touzhuTable.find('input.dan').each( function(item) {
			if (gg_match_num == -1) { //清除胆码选择
				item.disabled = false;
				this.get(item).prop('checked', false);
			} else if (gg_match_num == -2) { //禁用所有胆码
				item.disabled = true;
				this.get(item).prop('checked', false);
			} else if (gg_match_num == 0 || this.danmaNum < gg_match_num - 1) { //恢复胆码
				if (!item.checked && !item.disabled) {
					return;
				}
				item.disabled = false;
			} else { //禁用未选中的胆码
				!item.checked && (item.disabled = true);
			}
			this.storeDanma();
		}, this );
	},

	changed : function() {
		this.postMsg('msg_touzhu_info_changed', this.matchNum, this.danmaNum);
	}

} );


/* GuoGuan 北单过关信息
------------------------------------------------------------------------------*/
Class( 'GuoGuan', {
	ggType : '自由过关',
	ggTypeMap  : { '自由过关' : 3, '多串过关' : 2 },
	ggTypeMap2 : { 3 : '自由过关', 2 : '多串过关' },

	ggGroup : [	[], ['单关'], ['2串1', '2串3'], ['3串1', '3串4', '3串7'], ['4串1', '4串5', '4串11', '4串15'], ['5串1', '5串6', '5串16', '5串26', '5串31'], ['6串1', '6串7', '6串22', '6串42', '6串57', '6串63'], ['7串1'], ['8串1'], ['9串1'], ['10串1'], ['11串1'], ['12串1'], ['13串1'], ['14串1'], ['15串1']	],
	ggGroupMap  : {'单关':27,'2串1':1,'2串3':2,'3串1':3,'3串4':5,'3串7':6,'4串1':7,'4串5':9,'4串11':12,'4串15':13,'5串1':14,'5串6':28,'5串16':29,'5串26':18,'5串31':19,'6串1':20,'6串7':30,'6串22':31,'6串42':32,'6串57':25,'6串63':26,'7串1':35,'8串1':36,'9串1':37,'10串1':38,'11串1':39,'12串1':40,'13串1':41,'14串1':42,'15串1':43},

	matchNum : 0,
	danmaNum : 0,
	
	index : function(config) {
		var Y = this;
		
		this.switchTag = this.need(config.switchTag);
		this.ggTable   = this.need(config.ggTable);

		// 切换过关类型
		this.switchTag.each( function(item) {
			Y.get(item).click( function() { 
				Y.ggTagSwitched(this);
			} )
		} ),

		// 当投注信息改变时
		this.onMsg('msg_touzhu_info_changed', function(match_num, danma_num) {
			this.matchNum = match_num;
			this.danmaNum = danma_num;
			this.updateGgInfo();
			this.matchNum == (parseInt(this.getGgInfo()[0]) || 1) && (this.danmaNum = 0);
			this.changed();
			this.disableOrEnableGgCk();
		} );

		// 返回过关方式
		this.onMsg('msg_get_guoguan_info', function() {
			return this.getGgInfo();
		} );

		// 选择过关方式时更新
		this.ggTable.live('input', 'click', function() {
			Y.changed();
		} );

		// 返回过关方式
		this.onMsg('msg_get_gg_info_more', function() {
			return this.getGgInfoMore();
		} );

		// 禁用或恢复过关方式选择框
		this.onMsg('msg_disable_or_enable_ggck', function(danma_num) {
			this.danmaNum = danma_num;
			this.disableOrEnableGgCk();
			this.changed();
		} );

		// 返回修改时重现之前选的过关类型
		this.onMsg('msg_restore_gggroup', function(gggroup) {
			this.switchTag.each( function(item) {
				if (this.get(item).attr('value') == this.ggTypeMap2[gggroup]) {
					this.ggTagSwitched(item);
				}
			}, this );
		} );

		// 返回修改时重现之前选的过关方式
		this.onMsg('msg_restore_sgtype', function(sgtype) {
			this.ggTable.find('input').each( function(item) {
				this.getIndex(sgtype, this.ggGroupMap[item.value]) !== -1 && this.get(item).prop('checked', true);
			}, this );
		} );
	},

	// 切换过关类型标签
	ggTagSwitched : function(obj) {
		this.switchTag.removeClass('an_cur');
		this.get(obj).addClass('an_cur');
		this.ggType = this.get(obj).attr('value');
		this.postMsg('msg_disable_or_enable_danma', -1); //清除胆码
		this.danmaNum = 0;
		this.updateGgInfo();
		this.changed();
	},

	// 更新过关信息
	updateGgInfo : function() {
		if (this.matchNum == 0) {
			this.ggTable.empty();
			return;
		}
		
		// 根据不同玩法对最大串数做限制
		var max_limit = this.matchNum;
		switch (Class.config('playName')) {
			case 'rqspf' :
				this.matchNum > 15 && (max_limit = 15);
				break;
			case 'bf' :
				this.matchNum > 3 && (max_limit = 3);
				break;
			case 'jq' :
			case 'ds' :
			case 'bq' :
				this.matchNum > 6 && (max_limit = 6);
		}

		var gg_html, checked_gg_type, checked_html;
		gg_html = checked_html = '';
		checked_gg_type = this.getGgInfo();

		if (this.ggType == '自由过关') {
			for (var i = 1, j = 1; i <= max_limit; i++) {
				if (j % 3 == 1) {
					if (parseInt(j / 3) % 2 == 1) {
						gg_html += '<tr class="even">';
					} else {
						gg_html += '<tr>';
					}
				}
				checked_gg_type.each( function(item) {
					item == this.ggGroup[i][0] && (checked_html = ' checked="checked" ');
				}, this );
				gg_html += '<td class="tl" style="text-align:left;"><label class="mar_l10">' + 
							   '<input type="checkbox" class="chbox" name="gg_group"' + checked_html + ' value="' + this.ggGroup[i][0] + '" />' + this.ggGroup[i][0] +
						   '</label></td>';
				if (j++ % 3 == 0) {
					gg_html += '</tr>';
				}
				checked_html = '';
			}
		} else if (this.ggType == '多串过关') {
			for (var i = 1, j = 1; i <= max_limit; i++) { //tr的输出有bug
				if (this.ggGroup[i].length < 2) {
					continue;
				}
				if (j % 3 == 1) {
					if (parseInt(j / 3) % 2 == 1) {
						gg_html += '<tr class="even">';
					} else {
						gg_html += '<tr>';
					}
				}
				for (var _i = 1, _l = this.ggGroup[i].length; _i < _l; _i++) {
					checked_gg_type.each( function(item) {
						item == this.ggGroup[i][_i] && (checked_html = ' checked="checked" ');
					}, this );
					gg_html += '<td class="tl"><label class="mar_l10">' + 
								   '<input type="radio" class="chbox" name="gg_group"' + checked_html + ' value="' + this.ggGroup[i][_i] + '" />' + this.ggGroup[i][_i] +
							   '</label></td>';
					if (j++ % 3 == 0) {
						gg_html += '</tr>';
					}
					if (j % 3 == 1) {
						if (parseInt(j / 3) % 2 == 1) {
							gg_html += '<tr class="even">';
						} else {
							gg_html += '<tr>';
						}
					}
					checked_html = '';
				}
			}
		}
		/* @todo 这里需要补齐缺少的单元格td */
		this.ggTable.empty();
		this.get(gg_html).insert(this.ggTable);
	},

	// 获取所选的过关方式
	getGgInfo : function() {
		var gg_info = new Array();
		this.ggTable.find('input').each( function(item) {
			item.checked && gg_info.push(item.value);
		}, this );
		return gg_info;
	},
	
	// 获取更为完整的过关信息
	getGgInfoMore : function() {
		var Y, gg_info;
		Y = this;
		gg_info = {};
		gg_info.gggroup = Y.ggTypeMap[Y.ggType];
		gg_info.sgtypename = Y.getGgInfo().join(',');
		gg_info.sgtype = Y.getGgInfo().each( function(item) {
			this.push(Y.ggGroupMap[item]);
		}, [] ).join(',');
		return gg_info;
	},

	disableOrEnableGgCk : function() {
		this.ggTable.find('input').each( function(item) {
			var gg_match_num = parseInt(item.value) || 1;
			if (gg_match_num <= this.danmaNum) {
				item.disabled = true;
			} else {
				if (!item.disabled) {
					return;
				}
				item.disabled = false;
			}
		}, this );
	},

	updateGgCk : function() {
		var gg_match_num_real, gg_match_num;
		if (this.danmaNum == this.matchNum - 1) {
			gg_match_num = 1;
		} else if (this.getGgInfo().length == 0) {
			gg_match_num = 0;
		} else {
			gg_match_num_real = parseInt(this.getGgInfo()[0]) || 1;
			if (this.ggType == '自由过关' && gg_match_num_real == this.matchNum) {
				gg_match_num  = -2;
				this.danmaNum = 0;
				this.disableOrEnableGgCk();
			} else {
				gg_match_num = gg_match_num_real;
			}
		}
		this.postMsg('msg_disable_or_enable_danma', gg_match_num);
	},

	changed : function() {
		this.updateGgCk();
		this.postMsg('msg_guoguan_info_changed');
	}

} );


/* TouzhuResult 北单投注结果
------------------------------------------------------------------------------*/
Class( 'TouzhuResult', {

	beishu   : 0,
	matchNum : 0,
	zhushu   : 0,
	totalSum : 0,

	index : function(config) {
		var Y = this;
		
		this.beishuInput = this.need(config.beishuInput);
		this.matchNumTag = this.need(config.matchNum);
		this.zhushuTag   = this.need(config.zhushu);
		this.totalSumTag = this.need(config.totalSum);

		this.zhushuCalculator = this.lib.ZhushuCalculator();

		// 改变倍数时
		this.beishuInput.keyup( function() {
			
			Y.updateTouzhuResult();
		} ).blur( function() {
			if (this.value == '') {
				this.value = 1;
				Y.updateTouzhuResult();
			}
		} );
		
		this.onMsg('msg_guoguan_info_changed', function() {
			this.updateTouzhuResult();
		} );

		// 返回投注结果，用于表单提交
		this.onMsg('msg_get_touzhu_result_4_submit', function() {
			return this.getTouzhuResult4Submit();
		} );

		// 返回修改时重现位数
		this.onMsg('msg_restore_beishu', function(beishu) {
			this.beishuInput.val(beishu);
			this.updateTouzhuResult();
		} );
	},

	// 更新投注结果
	updateTouzhuResult : function() {
		if (!parseInt(this.beishuInput.val())) {
			this.beishu = '';
		} else {
			this.beishu = parseInt(this.beishuInput.val());
		}
		this.zhushu = this.countZhushu();
		this.totalSum = this.zhushu * this.beishu * 2;
		this.updateHtml();
	},

	updateHtml : function() {
		this.beishuInput.val(this.beishu);  //更新倍数
		this.matchNumTag.html(this.matchNum);  //更新所选场次数
		this.zhushuTag.html(this.zhushu);  //更新注数
		if(this.matchNum >0){
			Y.get("#checkbox_clear").addClass("jcq_kcur");
		}else{
			Y.get("#checkbox_clear").removeClass("jcq_kcur");
		}
		this.totalSumTag.html(this.totalSum.rmb(true, 0)); //更新投注金额
//		log('选号耗时：' + (new Date - Class.config('d')))
	},

	getTouzhuResult4Submit : function() {
		return {
			zhushu : this.zhushu,
			beishu : this.beishu,
			totalmoney : this.totalSum
		}
	},

	countZhushu : function() {  //计算注数
		var codes, danma, ggtype, ggmlist;
		codes = this.postMsg('msg_get_touzhu_codes').data;
		this.matchNum = codes.length;  //保存场次数
		ggmlist = this.postMsg('msg_get_guoguan_info').data;
		if (this.matchNum == 0 || ggmlist.length == 0) {
			return 0;
		}
		
		ggtype = this.postMsg('msg_get_gg_info_more').data.gggroup;
		danma = this.postMsg('msg_get_danma').data;
		codes.each( function(item) {
			item.dan = danma[item.index];
		} );
		return this.postMsg('msg_get_zhushu', codes, ggtype, ggmlist).data;
	}

});

/*当前时间*/
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
					var h_time='<span></span><span class="jc_tms" style="padding-right:10px">'+Y.addZero(d.getFullYear())+'-'+Y.addZero((d.getMonth() + 1))+'-'+Y.addZero(d.getDate())+'</span><span class="jc_tmv jc_tms">' + Y.addZero(d.getHours()) + ':' + Y.addZero(d.getMinutes()) + ':' + Y.addZero(d.getSeconds())+'</span>';
					Y.clockTag.html(h_time);
				}, 1000 );
				
				var _runtime=setInterval( function() {
					Y.ajax({
						url : "/phpu/cl.phpx",
						end : function(data) {
							var servernow = Y.getDate(data.date);			
							var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
							Class.config('servertimediff',(diff));						
						}
					});	
				}, 10*60*1000);
				setTimeout(function(){clearInterval(_runtime);}, 6*10*60*1000);
			}
		});	
	},
	addZero : function(n) {
		return parseInt(n) < 10 ? '0' + n : n;
	}
} );


Class('LoadExpect',{
	index:function(){
		this.init();  
		this.bindMsg();		
	},
	bindMsg: function(){
		this.onMsg('msg_get_expect_suc', function (expect){
			return this.LoadDuiZhen(expect);
        });
		this.onMsg('msg_get_odds_suc', function (expect){
			//return this.sethref(expect);
        });    		
	},	

    init: function (){//处理URL参数
    	    
    	if (location.search.getParam('expect') != "") {//期号
    		this.get("#expect").val(location.search.getParam('expect'));
		}    	
    	
    	this.ajax({
			url : "/cpdata/game/85/c.json?_=" + Math.random(),
			type : "get",
			dataType : "json",
			end  : function (d){
				var obj = eval("(" + d.text + ")");
				var r = obj.period.row;
				var expectlist = [];
				r.each(function(rt,o) {
					var pid = rt.pid;
					var et = rt.et;
					var fet = rt.fet;
					var flag = rt.flag;
					expectlist[expectlist.length] = [ pid, et, fet, flag ];
				});
					
					var html='';
					var find = false;
					var nowexpect='';
					if (expectlist.length>0){
						for ( var i = 0; i < expectlist.length; i++) {
							if (i==0){
								nowexpect=expectlist[i][0];
								Class.config('nowexpect', nowexpect);  //当前期号	
								html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|2"  style="color:red">'+expectlist[i][0]+'当前期</option>';
							}else{
								if(this.get("#expect").val()==expectlist[i][0]){
									html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|1"  style="color:#888888" selected="selected">'+expectlist[i][0]+'</option>';
								}else{
								html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|1"  style="color:#888888">'+expectlist[i][0]+'</option>';
								}
							}
							if (this.get("#expect").val()==expectlist[i][0]){
								find=true;
							}
						}		
					}
					this.get("#expect_select_div").html('<select  style="color:#F00"  id="expect_select">'+html+'</select>');	
					
					if (this.get("#expect").val()==''){
						this.get("#expect").attr("value",nowexpect);
						this.get("#expect_select").get(0).selectedIndex=0;
						find=true;
					}else{
						this.get("#expect_select option[text="+this.get("#expect").val()+"]").attr("selected", true);
												
					}						
									
					if (!find) {
						alert('对不起，该期暂未开售或者已经截止!');
						if (history.length == 0) {
							window.opener = '';
							window.close();
							return ;
						} else {
							history.go(-1);
							return ;
						}
					}
					this.postMsg('msg_get_expect_suc',this.get("#expect").val());
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
    },
    
	LoadDuiZhen : function(expect) {	
		if (expect == "") {
			this.alert("期号加载失败,请稍后重试!");
			return false;
		}
		if (this.get("#dcvsTable").size()==0){
			return false;
		}		
		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id		
		
		var url="/cpdata/match/beid/"+expect+"/spf.json";
		if(Class.config('nowexpect')!=expect){
			url="/cpdata/match/beid/"+expect+"/"+expect+".json";
		}else{
			switch (Class.config('playId')) {
			case 34 :    //让球胜平负
				url="/cpdata/match/beid/"+expect+"/spf.json";
				break;
			case 40 :    //总进球数
				url="/cpdata/match/beid/"+expect+"/jqs.json";
				break;
			case 41 : 	 //上下单双
				url="/cpdata/match/beid/"+expect+"/sxp.json";
				break;
			case 42 :    //比分
				url="/cpdata/match/beid/"+expect+"/cbf.json";
				break;
			case 51 :    //半全场
				url="/cpdata/match/beid/"+expect+"/bqc.json";
				break;
			default :
		    }
		}
		
		this.ajax({
					type : "get",
					dataType : "json",
					url: url+ "?rnd=" + Math.random(),
					cache:false,
					end : function(data) {
						var obj = eval("(" + data.text + ")");
						var code = obj.match.code;
						var desc = obj.match.desc;
						if (code == "0") {
							switch (Class.config('playId')) {
								case 34 :    //让球胜平负
									this.spf(data);
									break;
								case 40 :    //总进球数
									this.jq(data);
									break;
								case 41 :    //上下单双
									this.ds(data);
									break;
								case 42 :    //比分
									this.bf(data);
									break;
								case 51 :    //半全场
									this.bq(data);
									break;
								default :
							}				
						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障!");
						return false;
					}
				});
	},	
	spf:function(data){
		 var html = [];
		 var tableTpl=['<colgroup><col width="45"><col width="64"><col width="64"><col width="154"><col width="62"><col width="154"><col width="32"><col width="118"><col width=""><col></colgroup>',//0
		'<tr id="switch_for_{$enddate}">'+
		'<td colspan="12" class="dc_hstd" style="height:32px"><div class=dc_hs style="text-align: left; padding-left: 10px;">'+
		'<strong>{$enddate} {$weekday} (10：00--次日10：00)</strong>&nbsp;'+
		'<a href="javascript:void(0)" onclick="Yobj.postMsg(\'msg_show_or_hide_matches\', \'{$enddate}\', this)">隐藏<s class="c_up"></s></a>'+
		'</div></td>'+
		'</tr>'+
		//'<colgroup><col width="7%"><col width="10%"><col width="8%"><col width="20%"><col width="8%"><col width="20%"><col width="4%"><col width="15%"><col width="8%"><col width="2%"></colgroup>'+
		'<tbody id="{$enddate}" onselectstart="return false">',//1
		'<tr class="{$classname}" style="display:none" value="{index:\'{$mid}\',leagueName:\'{$mname}\',homeTeam:\'{$hn}\',guestTeam:\'{$gn}\',endTime:\'{$et}\',rangqiuNum:\'{$close}\',scheduleDate:\'{$enddate}\',disabled:\'yes\',homeTeamRank:2,guestTeamRank:7,bgColor:\'{$bgColor}\'}">'+
		'<td style="text-align:left; padding-left:5px;">'+
		'<input type="checkbox" checked="checked" class="chbox" style="cursor:default" /><span class="chnum">{$mid}</span>'+
		'</td>'+
		'<td style="background:{$bgColor};" class="league">'+
		'<a  href="" target="_blank" id="match{$mid}" style="color:#fff;">{$mname}</a>'+
		'</td>'+
		'<td><span class="eng end_time" title="截止时间：{$et}">{$short_et}</span><span style="display: none" class="eng match_time" title="开赛时间：{$bt}">{$short_bt}</span></td>'+
		'<td class="h_br" style="text-align: right; padding-right: 10px;border-left:1px solid #62A3D0;"><div class="dz_dv"><s class="s_left">&nbsp;</s>'+
		'<label class="label_n span_left">'+
		'<input type="checkbox" class="chbox" value="胜" onclick="return false"  disabled="disabled" style="display: none"/><em id="htid_{$mid}" class="em_left">{$hn}</em>{$closestr} {$sp3str}</label>'+
		'</div></td>'+
		'<td class="h_br" style="text-align:center"><div class="dz_dv">'+
		'<label class="label_n">'+
		'<input type="checkbox" class="chbox" value="平" onclick="return false"  disabled="disabled" style="display: none"/>{$sp1str}</label>'+
		'</div></td>'+
		'<td class="h_br" style="text-align: left; padding-left: 10px;"><div class="dz_dv">'+
		'<label class="label_n span_rihgt">'+
		'<input type="checkbox" class="chbox" value="负" onclick="return false"  disabled="disabled" style="display: none"/>{$sp0str}</label> <em id="gtid_{$mid}" class="em_right">{$gn}</em>'+
		'<s class="s_right">&nbsp;</s></div></td>'+
		'<td style="cursor:pointer">'+
		'<input type="checkbox" class="vs_check_all"  disabled="disabled"/>'+
		'</td>'+
		'<td><div class=pjpl id="odds{$mid}">'+
		'<span class="sp_w35 eng pjoz" id="oh{$mid}">{$b3}</span><span class="sp_w35 eng pjoz" id="od{$mid}">{$b1}</span><span class="sp_w35 eng pjoz" id="oa{$mid}">{$b0}</span>'+
		'</div></td>'+
		'<td>'+
		'{$shuju}'+
		'</td>'+
		'</tr>',//2 已经过期
		'<tr onselectstart="return false" class="{$classname}" style="display:" value="{index:\'{$mid}\',leagueName:\'{$mname}\',homeTeam:\'{$hn}\',guestTeam:\'{$gn}\',endTime:\'{$et}\',rangqiuNum:\'{$close}\',scheduleDate:\'{$enddate}\',disabled:\'no\',homeTeamRank:8,guestTeamRank:11,bgColor:\'{$bgColor}\'}">'+
		'<td style="text-align:left; padding-left:5px;">'+
		'<input type="checkbox" checked="checked" class="chbox" style="cursor:default" /><span class="chnum">{$mid}</span>'+
		'</td>'+
		'<td style="background:{$bgColor};color:#fff;" class="league">'+
		'<a  href="" target="_blank" id="match{$mid}" style="color:#fff;">{$mname}</a>'+
		'</td>'+
		'<td><span class="eng end_time" title="截止时间：{$et}">{$short_et}</span><span style="display: none" class="eng match_time" title="开赛时间：{$bt}">{$short_bt}</span></td>'+
		'<td class="h_br" style="text-align: right; padding-right: 10px; cursor: pointer;border-left:1px solid #62A3D0" title="{$hn}"><div class="dz_dv"><s class="s_left">&nbsp;</s>'+
		'<label class="label_n span_left" >'+
		'<input type="checkbox" class="chbox" value="胜" onclick="return false" style="display: none"/><em id="htid_{$mid}" class="em_left">{$hn}</em>{$closestr} <span class="sp_value eng b_left1">{$sp3}</span>'+
		'</label>'+
		'</div></td>'+
		'<td class="h_br" style="text-align: center; cursor: pointer"><div class="dz_dv">'+
		'<label class="label_n label_x">'+
		'<input type="checkbox" class="chbox" value="平" onclick="return false" style="display: none"/><span class="sp_value eng">{$sp1}</span>'+
		'</label>'+
		'</div></td>'+
		'<td class="h_br" style="text-align: left; padding-left: 10px; cursor: pointer" title="{$gn}"><div class="dz_dv">'+
		'<label class="label_n span_right" >'+
		'<input type="checkbox" class="chbox" value="负" onclick="return false" style="display: none"/><span class="sp_value eng b_rihgt1">{$sp0}</span> <em id="gtid_{$mid}" class="em_right">{$gn}</em>'+
		'</label>'+
		'<s class="s_right">&nbsp;</s></div></td>'+
		'<td style="cursor: pointer;border-right:1px solid #ddd"><a href="javascript:void(0);" class="jcq_q">全</a><input style="display: none" type="checkbox" all="0" value = "all"/></td>'+
		'<td><DIV class=pjpl id="odds{$mid}">'+
		'<span class="sp_w35 eng pjoz" id="oh{$mid}">{$b3}</span><span class="sp_w35 eng pjoz" id="od{$mid}">{$b1}</span><span class="sp_w35 eng pjoz" id="oa{$mid}">{$b0}</span>'+
		'</div></td>'+
		'<td>'+
		'<a href="" target="_blank" id="ox{$mid}">析</a> <a href="" target="_blank" id="oz{$mid}">欧</a>'+
		'</td>'+
		'</tr>',//3 未过期
		'</tbody>'
		];	
		var mathdate=[];
		var wk=["日","一","二","三","四","五","六"];
		
		var stop_sale="no";
		var all_matches=0;
		var out_of_date_matches=0;
	
		var no_rangqiu_matches=0;
		var odds_issuc=false;
		var dateweek =[];
		var rangqiu_matches=[];
		var lgname=[];
		var obj = eval("(" + data.text + ")");
		var code = obj.match.code;
		var desc = obj.match.desc;
		var r = obj.match.row;
		r.each(function(row,i){
			if(row.ms == -1) return;
			row.classname=i%2==0?"vs_lines odd":"vs_lines";
			row.enddate=(((Y.getDate(row.bt).getHours()<10) || (Y.getDate(row.bt).getHours()==10 && Y.getDate(row.bt).getMinutes()==0))?(Y.getDate(Date.parse(Y.getDate(row.bt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.bt).format('YY-MM-DD'));
			if(mathdate[mathdate.length-1]>row.enddate) return;
			if (mathdate.indexOf(row.enddate)<0){
				mathdate[mathdate.length]=row.enddate;
				row.weekday='周'+wk[Y.getDate(row.enddate).getDay()];
				html[html.length] = mathdate.length>1?(tableTpl[4]+tableTpl[1].tpl(row)):tableTpl[1].tpl(row);   
			};
			row.index=row.mid;
			row.b3=row.b3!=''?parseFloat(row.b3).rmb(false,2):'--';
			row.b1=row.b1!=''?parseFloat(row.b1).rmb(false,2):'--';
			row.b0=row.b0!=''?parseFloat(row.b0).rmb(false,2):'--';		
			row.short_bt=Y.getDate(row.bt).format('hh:mm');
			row.short_et=Y.getDate(row.et).format('hh:mm');
			
//			row.bgColor=odds_issuc?(odds_data[i].cl):'#009900';
			row.bgColor=row.cl!=''?row.cl:'#009900';
	
			row.sp3=parseFloat($_sys.getsp(row.spf,"sp3"))>0?parseFloat($_sys.getsp(row.spf,"sp3")).rmb(false,2):'--';
			row.sp1=parseFloat($_sys.getsp(row.spf,"sp1"))>0?parseFloat($_sys.getsp(row.spf,"sp1")).rmb(false,2):'--';
			row.sp0=parseFloat($_sys.getsp(row.spf,"sp0"))>0?parseFloat($_sys.getsp(row.spf,"sp0")).rmb(false,2):'--';


			row.rz=$_sys.getrz(row.rs,0);//this.getsp(row.spf,"rz");
			row.rs=parseFloat($_sys.getrs(row.rs,0)).rmb(false,2);//parseFloat(this.getsp(row.spf,"rs")).rmb(false,2);
			row.bf=(new String(row.ms)!=''&&new String(row.ss)!=''?(row.ms+':'+row.ss):(''));
			all_matches++;		
						
			if (parseInt(row.close)>0){
				row.closestr='<strong class="eng red">(+'+row.close+')</strong>';
			}else if (parseInt(row.close)<0){
				row.closestr='<strong class="eng green">('+row.close+')</strong>';
			}else{
				row.closestr='<strong class="eng green">&nbsp;</strong>';
			}
			if (Y.getDate(data.date)>Y.getDate(row.et) || row.icancel=="1"){//已经过期的场次
				out_of_date_matches++;
				if (row.bf!=''){//已经开出赛果的//row.rz!=''&&
					if(row.bf=="-1:-1"){row.bf="延";}
					row.shuju='<span class="red">'+row.bf+'</span>';
				}else{
					row.shuju='<a href="" target="_blank" id="ox'+row.mid+'">析</a> <a href="" target="_blank" id="oz'+row.mid+'">欧</a>';
				}
				
				if (parseFloat(row.rs)>0){//赛果SP//if (parseFloat(this.getsp(row.spf,"rs"))>0){//赛果SP
					row.sp3str=(row.rz==3?('<span class="sp_value eng red">'+row.rs+'</span>'):'--');
					row.sp1str=(row.rz==1?('<span class="sp_value eng red">'+row.rs+'</span>'):'--');
					row.sp0str=(row.rz==0?('<span class="sp_value eng red">'+row.rs+'</span>'):'--');					
				}else{
					row.sp3str='<span class="sp_value eng red">'+row.sp3+'</span>';
					row.sp1str='<span class="sp_value eng red">'+row.sp1+'</span>';
					row.sp0str='<span class="sp_value eng red">'+row.sp0+'</span>';
				}
				
				html[html.length] = tableTpl[2].tpl(row);
			}else{//未过期的场次
				if (row.close!=0){
					rangqiu_matches++;
				}else{
					no_rangqiu_matches++;
				}
//				rangqiu_matches.push(row.close);
				lgname.push(row.mname);
				dateweek.push('星期'+wk[Y.getDate(row.enddate).getDay()]+"_"+row.enddate);
	
				html[html.length] = tableTpl[3].tpl(row);
			};	

		}); 
		if (out_of_date_matches==all_matches){
			stop_sale="yes";
		}
		this.get("#stop_sale").val(stop_sale);
		this.get("#all_matches").val(all_matches);
		this.get("#out_of_date_matches").val(out_of_date_matches);
		this.get("#rangqiu_matches").val(rangqiu_matches);
		this.get("#no_rangqiu_matches").val(no_rangqiu_matches);

		$("#vsTable").html(tableTpl[0]+html.join('')+tableTpl[4]);
		if (stop_sale=="yes"){			
			$(".vs_lines").show();
		}
		$("#vsTable").show();	
		
		//生成让球列表
//   		var arrrangqiu_matches = [];
//   		var rangqiu_matcheshtml = '';
//   		var arrrangqiu_matchesnum = {};
//   		rangqiu_matches.each( function(item) {
//   			var rangqiunum = item;
//   				if ( $_sys.getSub(arrrangqiu_matches,rangqiunum) == -1 ) {
//   					arrrangqiu_matches.push(rangqiunum);
//   					var rqname='';
//   					if(parseInt(rangqiunum)==0){
//   						rqname='非让球';
//   					}else if(parseInt(rangqiunum)>0){
//   						rqname='客让'+rangqiunum+'球';
//   					}else if(parseInt(rangqiunum)<0){
//   						rqname='主让'+Math.abs(rangqiunum)+'球';
//   					}
////   					<li><label for="rd主让1球"><input type="checkbox"  id="rd主让1球" class="radio"><span>主让1球</span>[<i>56</i>]</label></li>
//   					rangqiu_matcheshtml += '<li><label for='+rqname+'><input class="radio" type="checkbox" value="'+rangqiunum+'" checked="checked"/><span>'+rqname+'</span>[<i id='+rangqiunum + '_num></i>]</label></li>';
//   				}
//   				if (typeof arrrangqiu_matchesnum[rangqiunum] == 'undefined') {
//   					arrrangqiu_matchesnum[rangqiunum] = 1;
//   				} else {
//   					arrrangqiu_matchesnum[rangqiunum]++;
//   				}
//   				
//   		} );
//   		$("#rqlist").html(rangqiu_matcheshtml);
//   		for (var rangqiunum in arrrangqiu_matchesnum) {
//   			$('#'+rangqiunum+'_num').html(arrrangqiu_matchesnum[rangqiunum]);
//   		}
   		
   		
   		//生成联赛列表
   		var arr_league = [];
   		var league_list_html = '';
   		var match_num_of_league = {};
   		lgname.each( function(item) {
   			var league_name = item;
   				if ($_sys.getSub(arr_league,league_name) == -1 ) {
   					arr_league.push(league_name);
   					league_list_html += '<li><label for="' + league_name + '"><input name="lg" type="checkbox" value="' + league_name + '" checked="checked"/><span>' + league_name + '</span>[<i>'+league_name +'_num</i>]</label></li>';
  				}
   				if (typeof match_num_of_league[league_name] == 'undefined') {
   					match_num_of_league[league_name] = 1;
   				} else {
   					match_num_of_league[league_name]++;
   				}
   				
   		} );
   		for (var league_name in match_num_of_league) {
   			league_list_html = league_list_html.replace(league_name + '_num', match_num_of_league[league_name]);
   		}
   		$("#lglist").html(league_list_html);
   		
   		//生成星期列表
   		var newday=Y.getDate(data.date).format('YY-MM-DD');
   		var arr_week = [];
   		var week_list_html = '';
   		var match_num_of_week = {};
   		dateweek.each( function(item) {
   			var week_name = item.split("_")[0];
   				if (arr_week.join('|').indexOf(week_name) == -1 ) {
   					arr_week.push(week_name);
   					var wd='';
   					if((Y.getDate(newday)-Y.getDate(item.split("_")[1]))==0){
   						wd='(今天)';
   					}
   					week_list_html+='<li style="width:145px"><label for=' + week_name + wd+'><input class="radio" type="checkbox" value="'+item.split("_")[1]+'" checked="checked"/><span>' + week_name + wd+'赛程</span>[<i>'+week_name + '_num</i>]</label></li>';
  				}
  				if (typeof match_num_of_week[week_name] == 'undefined') {
  					match_num_of_week[week_name] = 1;
  				} else {
  					match_num_of_week[week_name]++;
  				}
  				
  		} );
  		for (var week_name in match_num_of_week) {
  			week_list_html = week_list_html.replace(week_name + '_num', match_num_of_week[week_name]);
  		}
  		$("#datachoose").html(week_list_html);
		this.postMsg('load_duizhen_succ');			
	}
});

/* 主程序*/
Class( {	
	use   : 'mask',
	ready : true,	
	index : function(){		
		this.lib.LoadExpect();
		this.goTotop();//返回顶部
		this.oneodds=true;
		 Class.C('lot_id', 85);
		 Class.C('odds_t','bjdc/');
		this.onMsg('load_duizhen_succ', function () {
			this.sethref();
			this._index();
//			this.get('#select_time').change(function (){
//	            Y.postMsg('msg_change_time', this.value);
//	        });
			$('div[mark=endtime]').mouseover(function(){
				$("div[mark=showend]").show();
				$(this).find(".matchxz").addClass("matchxzc");
			});
			$('div[mark=endtime]').mouseout(function(){
				$("div[mark=showend]").hide();
				$(this).find(".matchxz").removeClass("matchxzc");
			});
			$("div[mark=showend] a").click(function(){
				var endvalue=$(this).attr("value");
				$("#select_time").html($(this).text());
				$("div[mark=showend]").hide();
				$('div[mark=endtime]').find(".matchxz").removeClass("matchxzc");
				 Y.postMsg('msg_change_time', endvalue);
			})
			
			this.onMsg('msg_change_time', function (index){
	            this._getPvs();
	            this.endTimeList.show(index == '0');
	            this.matchTimeList.show(index == '1');
	        });
		});		
		
	},
	_getPvs: function (){//
        this.endTimeList = this.get('#dcvsTable span.end_time');
        this.matchTimeList = this.get('#dcvsTable span.match_time');  
   },
	sethref:function() {
		var ex=this.get("#expect").val();
		if (ex == "") {
			return false;
		}
		var lottype=parseInt(this.need('#playid').val());
		this.ajax({
				url:"/cpdata/omi/bjdc/"+ex+"/"+ex+"_odds.xml",
        		end:function(data,i){
                     this.qXml('//row', data.xml, function (u, i){
                    	 $("#match"+u.items.xid).html(u.items.ln);	
                    	 $("#match"+u.items.xid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
                    	 $("#hn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
                       	 $("#gn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
             			
        				$("#ox"+u.items.xid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=5");
         				$("#oz"+u.items.xid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=5");
         				$("#oy"+u.items.xid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=5");
                    	 var hm=isNaN(u.items.hm)||u.items.hm==""?"":u.items.hm<10?'0'+u.items.hm:u.items.hm;
           				var am=isNaN(u.items.am)||u.items.hm==""?"":u.items.am<10?'0'+u.items.am:u.items.am;
           				$("#htid_"+u.items.xid).attr("data",u.items.htid).parent().prev().html(hm==""?"&nbsp;":'['+hm+']');
           				$("#gtid_"+u.items.xid).attr("data",u.items.gtid).parent().next().html(am==""?"&nbsp;":'['+am+']');
            				if(lottype==34 || lottype==42){//添加赔率信息
            					if(Y.get("#oh"+u.items.xid).html()=="0.00" || Y.get("#oh"+u.items.xid).html()=="--"){Y.get("#oh"+u.items.xid).html(u.items.oh);}
            					if(Y.get("#od"+u.items.xid).html()=="0.00" || Y.get("#od"+u.items.xid).html()=="--"){Y.get("#od"+u.items.xid).html(u.items.od);}
            					if(Y.get("#oa"+u.items.xid).html()=="0.00" || Y.get("#oa"+u.items.xid).html()=="--"){Y.get("#oa"+u.items.xid).html(u.items.oa);}
            				}
                     });      
                     if(this.oneodds){
                         var xhhistory = "";
                 		 if(Class.config('playId')=="34" || Class.config('playId')=="44" || Class.config('playId')=="72"){
                 			 xhhistory=".vs_lines label  em";
                    	     historyMatchOdds({
       	                         items: xhhistory,
       	                         tipid: 'odds_tip',
       	                         tip: '#odds_tip',
       	                         fleft: 260
       	                     }); 
    	                     $("#oddstype").odds_select_name();
    	                     // load_odds_sp();
    	                     ozOdds({
       	                         items: '.pjpl',
       	                         tipid: 'odds_tip',
       	                         tip: '#odds_tip',
       	                         path: '/cpdata/omi/odds/bjdc/oz/'
       	                     });    			 
                 			 
                 		 }

	                     this.oneodds = false;
                     }
        		}
				});
	},
	goTotop:function (){
        var isIE=!!window.ActiveXObject;
        var isIE6 = isIE&&!window.XMLHttpRequest;
        var btn = $("#goTotop");
        var right = 0;
        var top = $(window).height()-247;
        var ietop = $(window).height()-247+$(window).scrollTop();
        var flag = true;
        $(window).resize(function(){
            btn.css({"position":"fixed",top:top,right:right});
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
        btn.css({"position":"fixed",top:top,right:right});
        var areaTop = Y.get("#right_area").getXY().y;
        
        $(window).scroll(function(){
        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
	            	var V = $('#titleTable_r');
	        		if (V[0]) {
	        			var T = $(document),
	        			H = $("#main").eq(0),
	        			M = H.offset().top + H.outerHeight(),
	        			F = V.innerWidth(),
	        			B = V.offset().top,
	        			L = V.outerHeight(), 
	        			u = T.scrollTop();
	        			Z = Math.min(0, M - (L + u));
	        			
	        			if (B == Z) {
	        				V.css({left: "auto", top: "auto",width: F, position: "static"});
	        			} else {
	        				if(isIE6){
	        					V.css({left: "auto",top: Z+$(window).scrollTop(), width: F,position: "absolute"});
	        				}else{
	        				V.css({left: "auto",top: Z, width: F, position: "fixed"});
	        				}
	        			}
	        			Y.get("#titleTable_r").setStyle('z-index: 1;');
	        		}
	            	
	             }else{//停止浮动对齐
            	 Y.get("#titleTable_r").setStyle('z-index: 1; top:0;  left: auto;position: static;');
            }
        	
            if(flag)
            {
                btn.show();
                flag = false;
            }
            if($(this).scrollTop() == 0)
            {
                btn.hide();
                flag = true;
            }
            btn.css({"position":"fixed",top:top,right:right});
            ietop = $(window).height()-247+$(window).scrollTop();
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
    },
	
	_index : function () {
		var Y = this, d = new Date();
		
		// 切换期号
		this.get('#expect_select').change( function() {
			var url = location.href.replace(/#.*/, '');
			if (url.indexOf('expect') != -1) {
				url = url.replace(/expect=.+?(?=&|$)/ig, 'expect=' + this.value.split('|')[0]);
			} else if (url.indexOf('?') != -1 && url.indexOf('=') != -1) {
				url += '&expect=' + this.value.split('|')[0];
			} else {
				url += '?expect=' + this.value.split('|')[0];
			}
			location.replace(url);
		} );

		if (this.get('tr.vs_lines').nodes.length == 0) {
			return;  //没取到对阵的话则以下js代码不执行
		}

		Class.extend( 'getIndex', function(arr, v) {
			for (var i = 0, l = arr.length; i < l; i++) {
				if (arr[i] == v) return i;	
			}
			return -1;
		} );

		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id
		Class.config('expect', this.need('#expect').val() );  //期号
		switch (Class.config('playId')) {
			case 34 :    //让球胜平负
				Class.config('playName', 'rqspf');
				Class.config('codeValue', ['胜', '平', '负']);
				Class.config('playName_1', 'SPF');
				Class.config('codeValue_1', ['3', '1', '0']);
				break;
			case 40 :    //总进球数
				Class.config('playName', 'jq');
				Class.config('codeValue', ['0', '1', '2', '3', '4', '5', '6', '7+']);
				Class.config('playName_1', 'JQS');
				Class.config('codeValue_1', ['0', '1', '2', '3', '4', '5', '6', '7']);
				break;
			case 41 :    //上下单双
				Class.config('playName', 'ds');
				Class.config('codeValue', ['上+单', '上+双', '下+单', '下+双']);
				Class.config('playName_1', 'SXP');
				Class.config('codeValue_1', ['1-1', '1-0', '0-1', '0-0']);
				break;
			case 42 :    //比分
				Class.config('playName', 'bf');
				Class.config('codeValue', [ '胜其他', '1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', 
				                            '平其他', '0:0', '1:1', '2:2', '3:3', 
				                            '负其他', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4' ]);
				Class.config('playName_1', 'CBF');
				Class.config('codeValue_1', [ '9:0', '1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', 
				                            '9:9', '0:0', '1:1', '2:2', '3:3', 
				                            '0:9', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4' ]);
				break;
			case 51 :    //半全场
				Class.config('playName', 'bq');
				Class.config('codeValue', ['胜-胜', '胜-平', '胜-负', '平-胜', '平-平', '平-负', '负-胜', '负-平', '负-负']);
				Class.config('playName_1', 'BQC');
				Class.config('codeValue_1', ['3-3', '3-1', '3-0', '1-3', '1-1', '1-0', '0-3', '0-1', '0-0']);
				break;
			default :
		}
		var code_value_index = {};
		Class.config('codeValue').each( function(v, i) {
			code_value_index[v] = i;
		} )
		Class.config('codeValueIndex', code_value_index);
		Class.config('stopSale', this.need('#stop_sale').val() == 'yes');

		var tableSelectorClass = this.lib.TableSelector_BF || this.lib.TableSelector;
		tableSelectorClass( {
			vsTable : '#vsTable',
			vsLines : 'tr.vs_lines',
			spLines : 'tr.sp_lines',
			wdls : '#wdls',
			ckRangqiu   : '#ck_rangqiu',
			ckNoRangqiu : '#ck_no_rangqiu',
			ckOutOfDate : '#ck_out_of_date',
			hiddenMatchesNumTag : '#hidden_matches_num',
			matchShowTag : '#match_show',
			matchFilter  : '#match_filter',
			leagueShowTag  : '#league_show',
			leagueSelector : '#leagueSelector',
			selectAllLeague      : '#selectAllBtn',
			removeAllLeague :'#unAllBtn',
			selectOppositeLeague : '#selectOppBtn'
		} );

		this.lib.TouzhuInfo( {
			endtime : '#endtime',
			vsLines : 'tr.vs_lines',
			touzhuTable : '#touzhu_table',
			checkboxclear : '#checkbox_clear',
			mouseoverClass : 'nx_s'
		} );

		this.lib.GuoGuan( {
			switchTag : '#gg_type li',
			ggTable   : '#gg_table tbody'
		} );

		this.lib.TouzhuResult( {
			beishuInput : '#beishu_input',
			matchNum    : '#match_num',
			zhushu      : '#zhushu',
			totalSum    : '#total_sum'
		} );
		
		this.lib.ConfirmForm();
		this.lib.Clock('#running_clock');
		this.lib.PrizePredict();

		if (Class.config('disableBtn')) { //禁用代购和合买按钮
			Y.get('#dg_btn').swapClass('jc_mtz', 'jc_odtz').html('<b>确认代购</b>').attr('id', '');
			Y.get('#hm_btn').swapClass('jc_mhm', 'jc_odhm').html('<b>发起合买</b>').attr('id', '');
		}

		// 发起代购
		Y.get('#dg_btn').click( function() {
			Y.postMsg('msg_do_dg');
		} );

		// 发起合买
		Y.get('#hm_btn').click( function() {
			Y.postMsg('msg_do_hm');
		} );
		
		// 发起合买
		Y.get('#gofilter').click( function() {
			Y.postMsg('msg_do_filter');
		} );
		
		

		//创建一个公共弹窗, 使用msg_show_dlg进行调用
		this.infoLay = this.lib.MaskLay('#defLay', '#defConent');
		this.infoLay.addClose('#defCloseBtn', '#defTopClose');
		this.get('#defLay div.tantop').drag(this.get('#defLay'));
		this.infoLay.noMask = self != top;

		// 提供弹窗服务
		this.onMsg('msg_show_dlg', function (msg, fn, forbid_close) {
			this.infoLay.pop(msg, fn, forbid_close);
			if (Y.C('autoHeight')) {
				this.infoLay.panel.nodes[0].style.top = Y.C('clientY') - 80 + 'px';
			}
		} );

		this.goTop = this.one('a.back_top');
		this.rightArea = this.get('#right_area');
		this.mainArea = this.get('#main');
		if (this.ie && this.ie == 6) {
			this.goTop.style.position = 'absolute';
			this.goTop.style.left = '750px';
		} else {
			setTimeout( function() {
				Y.goTop.style.left = Y.rightArea.getXY().x + 'px';
			}, 500 );
		}
		this.get(window).scroll( function () {
			clearTimeout(Class.C('scrollTimer'));
			if (Y.ie && Y.ie == 6) {
				Class.C('scrollTimer', setTimeout(Y.scrollStillIE6.proxy(Y), 100));
			} else {
				Class.C('scrollTimer', setTimeout(Y.scrollStill.proxy(Y), 100));
			}
		} );

		//设置表头浮动
        Y.get('<div id="title_folats" style="z-index:9;"></div>').insert().setFixed({
            area: '#dcvsTable',
            offset:0,
            init: function(){
                var This = this,
                    title = this.area.parent().find('#tabletop').one(0),
                    floatTitle = title.cloneNode(true);
                this.get(floatTitle).insert(this);
                this.floatTitle = floatTitle;
                this.title = title;
                this.hide();
                Y.get(window).resize(function(){
                    This.setStyle('left:'+(This.area.getXY().x)+'px;width:'+(This.area.prop('offsetWidth'))+'px')
                });
                Yobj.get('div.jcslt').remove();
            },
            onin: function (){
                this.show();
                this.title.swapNode(this.floatTitle);
                var offset = this.ns.ie == 6 ? 2 : 0;
                this.setStyle('left:'+(this.area.getXY().x+offset)+'px;width:'+this.area.prop('offsetWidth')+'px')
            },
            onout: function (){
                this.hide();
                this.title.swapNode(this.floatTitle);
            }
        });
        

	},

	scrollStill : function() {
		var window_size = Y.getSize();
		Y.goTop = Y.get('a.back_top');
		Y.mainArea = Y.get('#main');
		Y.leftArea = Y.get('#main div.dc_l');
		Y.rightArea = Y.get('#main div.dc_r');
		var right_xy = Y.rightArea.getXY();
		var right_size = Y.rightArea.getSize();
		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
			Y.goTop.setStyle('position', 'absolute').setStyle('bottom', 0).setStyle('left', '750px');
		} else {
			Y.goTop.setStyle('position', 'fixed').setStyle('bottom', '10px').setStyle('left', right_xy.x-10 + 'px');
		}
		if (window_size.scrollTop <= right_xy.y || 
				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight ||
				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
			Y.goTop.hide();
		} else {
			Y.goTop.show();
		}
	},

	scrollStillIE6 : function() {
		var window_size = Y.getSize();
		Y.goTop = Y.get('a.back_top');
		Y.mainArea = Y.get('#main');
		Y.leftArea = Y.get('#main div.dc_l');
		Y.rightArea = Y.get('#main div.dc_r');
		var right_xy = Y.rightArea.getXY();
		var right_size = Y.rightArea.getSize();
		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
			Y.goTop.setStyle('top', '').setStyle('bottom', 0);
		} else {
			Y.goTop.setStyle('top', window_size.scrollTop + window_size.offsetHeight - 310 + 'px');
		}
		if (window_size.scrollTop <= right_xy.y || 
				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight || 
				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
			Y.goTop.hide();
		} else {
			Y.goTop.show();
		}
	}

});
//设置某个标签在某个区域内是静止的
Class.fn.setFixed = function (opt){
    var Y = this.ns, Yn = this, ini = this.ns.mix({
        onin: Y.getNoop(),//移入
        onout: Y.getNoop(),//移出区域
        area: document.body,//默认区域为body
        offset: 0//偏移
    }, opt), areaTop, clearCache, isout = true;
    this.area = this.get(ini.area);
    if (Y.ie == 6 && !Y.C('-html-bg-fixed')) {//修正ie6闪烁
        Y.C('-html-bg-fixed', true);
        var ds = document.documentElement.style;
        ds.backgroundImage = 'url(about:blank)';
        ds.backgroundAttachment = 'fixed';   
    }
    if(window.Node){//添加IE独有方法 replaceNode, swapNode
        Node.prototype.replaceNode=function($target){
            return this.parentNode.replaceChild($target,this);
        }
        Node.prototype.swapNode=function($target){
            var $targetParent=$target.parentNode;
            var $targetNextSibling=$target.nextSibling;
            var $thisNode=this.parentNode.replaceChild($target,this);
            $targetNextSibling?$targetParent.insertBefore($thisNode,$targetNextSibling):$targetParent.appendChild($thisNode);
            return this;
        }
    }
    if(opt.init){
    	opt.init.call(this)
    }
    this.get(window).scroll(handle);
    function handle(){
        clearTimeout(clearCache);
        if (!areaTop) {//优化滚动时每次计算区域位置
            clearCache = setTimeout(function() {
                areaTop = false
            },50);
            areaTop = Y.get(ini.area).getXY().y;
        }
        var sTop = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (sTop > areaTop) {//跟踪对齐
            if (isout) {
                isout = false;
                ini.onin.call(Yn, ini.area);
                Yn.each(function (el){//存储top值
                    Y.get(el).data('-fixed-before-top', el.style.top);
                })
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.position = 'absolute';
                    el.style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop+' + ini.offset + ') + "px"')
                })                 
            }else{
                Yn.setStyle('position:fixed;top:'+ini.offset+'px');
            }
        }else{//停止浮动对齐
            if (!isout) {
                isout = true;
                ini.onout.call(Yn, ini.area);                
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.removeExpression('top');
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }else{
                Yn.each(function (el){
                    el.style.position = '';
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }            
        } 
   } 
   return this
};