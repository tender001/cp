/*当前时间*/
Class('Clock', {
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
					var h_time='<span>当前时间</span><span class="jc_tms">'+Y.addZero(d.getFullYear())+'-'+Y.addZero((d.getMonth() + 1))+'-'+Y.addZero(d.getDate())+'</span><span class="jc_tmv jc_tms">' + Y.addZero(d.getHours()) + ':' + Y.addZero(d.getMinutes()) + ':' + Y.addZero(d.getSeconds())+'</span>';
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
    });
//SP值存储器
Yobj.C('currentSp', {
	data: {},
	get: function (bid, type){
		var vs = this.__getBid(bid);
		return parseFloat(vs[type]) || 1;
	},
	set: function (bid, type, val){
		var vs = this.__getBid(bid);
		vs[type] = val;
	},
	__getBid: function (bid){
		if (bid in this.data) {
			return this.data[bid];
		}
		this.data[bid] = {};
		return this.data[bid];
	}
});//取得当前的sp值

/*竞彩选号器
*************************************************************************/
Class('Selector', {
	oninit: Yobj.getNoop(),// 初始化完成
	init: function (box){
		var box = Yobj.get(box);
		Yobj.get('#main').setStyle('overflow', 'visible');//修正层级问题
		this.findVsTags(box);
		this.setClickFx(box);
		this.otherSet(box);
		this.setHoverBg(box);
		this.oninit();
		//Yobj.get('tr td .dc_tdul label li').addClass('h_bra');
		Yobj.get('.tb_sfc_s tr .h_bb_1px').addClass('h_bra');
	},
	filterLg: function (lgs_str){
		this.allTr.each(function (tr){
			var mt = lgs_str.indexOf(tr.getAttribute('lg')) > -1;
			if (mt) {
				Yobj.get(tr).removeClass('hide_row');
			}else{
				Yobj.get(tr).addClass('hide_row');
			}
		});
		this.updateHideCount();
	},
	filterOneLg: function (lg, checked){
		this.allTr.each(function (tr){
			if (tr.getAttribute('lg') == lg) {
				if (checked) {
					Yobj.get(tr).removeClass('hide_row');
				}else{
					Yobj.get(tr).addClass('hide_row');
				}
			}
		});
		this.updateHideCount();
	},
	setHoverBg: function (box){//悬浮变色效果
		var _self = this;
		Yobj.get(this.vsTr).hover(function (){
			var id = this.bindid;
			_self.getTrs(id).addClass('th_on');
		}, function (){
			var id = this.bindid;
			_self.getTrs(id).removeClass('th_on');
		});
		box.live('span.x_s', 'click', function (){//选择区中的点击删除
			_self.onProxyRemove(this.getAttribute('data-bid'), this.getAttribute('data-type') + this.getAttribute('value'));
		});
	},
	onProxyRemove: Yobj.NOP,//让号码选择器来模拟点击删除预览选项
	updateHideCount: function (){
		this.hideNum = this.allTr.reduce(function (sum, tr){
			return sum += (tr.className.indexOf('hide_row') > -1 ? 1 : 0);
		}, 0);
		this.setHideNum();
	},
	hideNum: 0,
	//显示隐藏场数
	setHideNum: function (){
		Yobj.get('#hide_count').html(this.hideNum);
	},
	onshowAll: function(){},
	//显隐一些对阵
	otherSet: function (box){
		var _self = this;
		Yobj.get('#showAll_btn').click(function (){
			Yobj.get(_self.allTrs).removeClass('hide_row');
			_self.hideNum = 0;
			_self.setHideNum();
			_self.onshowAll();
		});
		Yobj.get('#ck3').click(function (){
			var stoper = Yobj.get(_self.stopTr);
			if (this.checked) {
				stoper.show();
			}else{
				stoper.hide();
			}
		});
		//显隐周赛
		box.find('div.dc_hs a').click(function (){
			var html = '',
				next = Yobj.get(this).parent('div.dc_hs').next('table');
			if (this.innerHTML.indexOf('隐藏') == -1) {
				html = '隐藏';
				next.show();
			}else{
				html = '显示';
				next.hide();
			}
			this.innerHTML = html;
		});
	},
	//选项点击时回调处理
	clickCallBack: function (chk){
		if (chk.getAttribute('data-type')) {
			this.setTdBg(chk);
			if (chk.id.indexOf('_sfc_') > -1) {//如果是胜分差，要显示统计选中数目
				this.updateSelectNum(chk.getAttribute('data-id'));
			}
			this.optionChange(chk);
		}
	},
	//点击对阵选项, 用户选择回调
	setClickFx: function (box){
		var _self = this;
		box.live('input', 'click', function (e){
			_self.clickCallBack(this);
		});
		//设置点击在li上也可以选
		box.live('li', 'click', function (e){
			if (e.srcElement === this || e.target === this) {
				var input = Yobj.get('input[data-type]', this);
				if (input.size()) {
					input.nodes[0].click();
				}				
			}
		});
		//弹出层的td
		box.find('div.tb_sfc_s').live('td', 'click', function (e){
			if (e.srcElement === this || e.target === this) {
				var input = Yobj.get('input[data-type]', this);
				if (input.size()) {
					input.nodes[0].click();
				}				
			}
		});
	},
	onchange: Yobj.getNoop(),
	//重新统计选项
	optionChange: function (chk){
		var bid  = chk.getAttribute('data-id'),
			chks = this.getTrs(bid).find('input[data-type]:checked');
		if (chk.checked) {
			this.lastChk = chk;// 记录最后点击的复选框， 以恢复溢出;
		}		
		this.onchange(bid, chks.nodes);
	},
	//注数超出时回复
	resetLast: function (){
		var chk = this.lastChk;
		if (chk) {
			chk.checked = false;
			this.lastChk = null;
			this.clickCallBack(chk);//手动取消这个选项
		}
	},
	//统计隐藏项选中数
	updateSelectNum: function (bid){
		var tr = this.getTr1(bid),
			div = tr.find('div.tb_sfc_s'),
			html = '',
			tag = div.prev('span').nodes[0];
		if (tag) {
			tag.selectedNum = div.find('input:checked').size();
			if (tag.selectedNum) {
				var link = div.find('input:checked').eq(0);
				var id = link.attr('data-type')+link.attr('value');
				var so = Yobj.get('#choose_list span[data-sg='+id+']');
				if (so.size()) {
					var html = '<span class="x_s sl" onmouseover="this.className=\'x_s sl nx_s\'" onmouseout="this.className=\'x_s sl\'" data-type="'+link.attr('data-type')+'" value="'+link.attr('value')+'" data-bid="'+bid+'">'+so.html()+'</span>';
				}				
			}
			tr.find('div.sel_view').html(html);
			var more = tr.find('span.s_more_show'),
				more2 = tr.find('span.s_more_hide'),
				txt = '<a class="xs">显示</a>';
			var selNum = more.nodes[0].selectedNum || 0;
			var txt2 =  selNum ? ('<strong class="red">' + selNum + '</strong>项') : '<a class="yc">隐藏</a>';
			if (selNum) {
				txt = txt2;
			}
			more.html(txt);
			more2.html(txt2);
		}

	},
	//匹配所有对阵标签
	findVsTags: function (box){
		var vs = [],
			vsTr = [], //包括截止的
			stopTr = [],
			vs_hash = {},
			all = [],
			allTr = [],
			idArr = [],
			doc = {},
			_self = this,
			curPopLay,
			spAdm = Yobj.C('currentSp'); //sp值管理器
 
		var MTR = document.createElement('TR');
		var MTD = document.createElement('TD').appendChild(MTR);
		MTD.setAttribute('colspan','5');
		MTD.style.height = '80px';
		this.marginTR = Yobj.get(MTR);
		box.childs('table').each(function (table){
			if (table.innerHTML.indexOf('赛事编号') == -1) {//跳过表头
				var trs = table.rows,//tr里面包含一个显示剩分差的选项table
					chk, other, id, data, A;
				for (var i = 0, j = trs.length; i < j; i++) {
					A = trs[i];
					chk = getHeadInput(A);//头标签
					chk.onclick = onclick_head;
					other = Yobj.get(A).find('input').size() > 1;
					all.push(A);
					allTr.push(A);
					if (other) {//截止后不再存在
						var sfcDiv = Yobj.get('span.s_more_show,p', A);
						sfcDiv.click(onclick_other);//切换隐藏项
						Yobj.get('div.tb_sfc_s', A).mousedown(function (e){
							e.stop();
						});
						id = A.getAttribute('mid');
						idArr.push(id);
						A.id = 'vs'+id + '_a';
						A.bindid = id;//基本id, 用于组装成两个a,b id;
						var rf_inputs = Yobj.get('input[data-rf]', A);
						data = {
							mid_pname: A.getAttribute('mid') + '|' + A.getAttribute('pname'),
							game_time: A.cells[0].getElementsByTagName('span')[0].innerHTML,
							end_time: Yobj.getDate(A.getAttribute('pendtime')).getTime(),
							title: A.getAttribute('guestteam') + 'vs' + A.getAttribute('hometeam'),
							id: id,
							rf: [rf_inputs.eq(0).attr('data-rf'), rf_inputs.eq(1).attr('data-rf')],
							trs: [A]
						};
						vs.push(data);
						vs_hash[id] = data; //分别保存为数组和哈希以供检索
						Yobj.get(A).find('input[data-type]').each(function (input){
							//初始化sp值管理器
							spAdm.set(id, input.getAttribute('data-type')+input.getAttribute('value'), input.getAttribute('data-sp'));
						}).attr('data-id', id).prop('checked', false);//用bindid关联tr
						vsTr.push(A);
					}else{
						stopTr.push(A);
					}					
				}
			}
		});
		//查找头复选框, 位于在奇行中
		function getHeadInput(tr){
			var td = tr.cells[0];
			return td.getElementsByTagName('input')[0];
		}
		//点击隐藏对阵
		function onclick_head(){
			this.checked = true;
			var tr = Yobj.get(this).parent('tr').eq(0);
			tr.addClass('hide_row');
			_self.hideNum++;
			_self.setHideNum();
		}
		//显示和隐藏其它项 p||spans
		function onclick_other(){
			var $this = Yobj.get(this);		
			if (curPopLay && curPopLay !== this) {//如果已弹出就先隐藏
				var tmpl = curPopLay;
				curPopLay = null;
				onclick_other.call(tmpl);
			}
			var tr = $this.parent('tr').eq(0),
				span = tr.find('span.s_more_show');
			Yobj.get('span.s_more_show').show();
			if (!this.isopen) {				
				span.hide();
				tr.find('p.tb_sfc_on').show();
				tr.find('div.sel_view').hide();
				Yobj.get('div.dc_tb_sfc,div.tb_sfc_s').setStyle('zIndex', 1);
				tr.find('div.dc_tb_sfc,div.tb_sfc_s').setStyle('zIndex', 3);
				tr.find('div.tb_sfc_s').show();
				curPopLay = this;
				this.isopen = true;
				_self.marginTR.show().insert(tr, 'next');
			}else{
				this.isopen = false;
				curPopLay = null;
				tr.find('div.sel_view').show();
				tr.find('div.tb_sfc_s').hide(); 
				span.show();
				tr.find('p.tb_sfc_on').hide();
				_self.marginTR.hide();
			}
		}
		Yobj.get(document).mousedown(function (){
			if (curPopLay) {
				onclick_other.call(curPopLay);
				curPopLay = null;
			}
		});
		this.vsTr = vsTr;
		this.vsList = vs;
		this.vs_hash = vs_hash;
		this.stopTr = stopTr;
		this.allTr = all;//只有主行
		this.allTrs = allTr;//包括所有子行
	},
	getTrs: function (bid){
		return Yobj.get('#vs' + bid + '_a');
	},
	getTr1: function (bid){
		return Yobj.get('#vs'+bid+ '_a');
	},
	setTdBg: function (chk){
		var td = Yobj.get(chk).parent('li');
		if (!td.size()) {
			td = Yobj.get(chk).parent('td');
		}
		
		if (chk.checked) {
//			td.addClass('label_cd');
			td.addClass('h_brb');
		}else{
//			td.removeClass('label_cd');
			td.removeClass('h_brb');
		}
	},
	//用号码来选择一个对阵
	setCode: function (bid, code){//['fs2','dxf1']
		var _self = this,
			trs = this.getTrs(bid), 
			opts = trs.find('input[data-type]');
		if (trs.size() === 0) {
			return;//返回修改可能没有这个对阵了
		}
		if (!code || code.length == 0) {//没有号码， 清空
			opts.each(function (chk){
				chk.checked = false;
				_self.setTdBg(chk);
			});
		}else{
			opts.each(function (chk){
				var isSel = code.indexOf(chk.getAttribute('data-type')+chk.value) > -1;
				chk.checked = isSel;
				_self.setTdBg(chk);
			});
		}
		//更新胜分差的选项数标记
		this.updateSelectNum(bid);
	}
});


/*竞彩号码框
*************************************************************************/
Class('CodeList', {
	index: function (){
		this.tmpl_1 = Yobj.get('#choose_tpl').nodes[0];
		this.tmpl_2 = Yobj.get('#choose_tpl2').nodes[0];
		this.box = Yobj.get('#choose_list');
	},
	codes: [],
	onchange: Yobj.getNoop(),//选择的时候, 用于绑定 选择器方法
	ondatachange: Yobj.getNoop(), //用于输出号码， 绑定过关方式方法
	playids: {
		sf: 'SF>',
		rfsf: 'RFSF>', 
		sfc: 'SFC>',
		dxf: 'DXF>' 
	},
	__getGroup: function (type, bid, mp){
		return {
			id: bid,
			mps: mp + '|' + this.playids[type],
			type: type,
			code: [],
			prize: []//奖金列表
		};
	},
	updateData: function (){//重新生成号码数据
		var data = [],
			info = [],
			optsArr2 = [],
			playNum = {
				sfc: 0,
				sf: 0,
				rfsf: 0,
				dxf: 0
			},
			spAdm = Yobj.C('currentSp'),
			endtime = 0,
			_self = this;
		//查找所有可见号码区的号码;
		this.box.find('tr.code_area:visited').each(function (tr){
			var bid = tr.getAttribute('data-id');
			var mp = tr.getAttribute('data-mp');
			var m_endtime = tr.getAttribute('data-endtime');
			var span = Yobj.get(tr).find('span.x_s:visited');
			var codes = [];
			var sfc = _self.__getGroup('sfc', bid, mp);
			var sf = _self.__getGroup('sf', bid, mp);
			var rfsf = _self.__getGroup('rfsf', bid, mp);
			var dxf = _self.__getGroup('dxf', bid, mp);
			var hasSfc, hasSf, hasRfsf, hasDxf;
			var prizeArr = [];
			var codeArr = [];
			if (endtime) {
				endtime = Math.min(endtime, m_endtime);
			}else{
				endtime = m_endtime;
			}
			//遍历统计选项
			span.nodes.each(function (span){
				var type = span.getAttribute('data-sg');
				var g;
				if (type.indexOf('sfc') === 0) {
					g = sfc;
					if (!hasSfc) {
						hasSfc = true;
						playNum.sfc++;
					}					
				}else if(type.indexOf('sf') === 0){
					g = sf;
					if (!hasSf) {
						hasSf = true;
						playNum.sf++;
					}					
				}else if(type.indexOf('rfsf') === 0){
					g = rfsf;
					if (!hasRfsf) {
						hasRfsf = true;
						playNum.rfsf++;
					}
				}else{
					g = dxf;
					if (!hasDxf) {
						hasDxf = true;
						playNum.dxf++;
					}
				}
				g.code.push(type.replace(/\D/g, ''));//去掉号码的玩法识别(-sfc)部分, data-sg="sf2"
				var sp = spAdm.get(bid, type);
				g.prize.push(sp);//查询sp值
				codeArr.push(span.innerHTML+'('+sp+')');
			});
			var opt = [];
			//整理合并统计项
			data.push([sf, rfsf, dxf, sfc].filter(function (obj){
				var len = obj.code.length;
				if (len) {
					opt.push(len + '-' + obj.type);//[2-sfc];
					obj.mps += '['+obj.code.sort().join(',')+']';//排序后拼接, 做为号码输出
					prizeArr = prizeArr.concat(obj.prize);
					return true;
				}
			}));
			optsArr2.push(opt);
			info.push({
				index: tr.getAttribute('data-index'),//赛程名
				vs: tr.getAttribute('data-vs'),//对阵名
				codes: codeArr.join(','),
				min: Math.min.apply(Math, prizeArr), 
				max: Math.max.apply(Math, prizeArr)//最大和最小奖金
			});//做为查看明细的基本数据
		});
		this.codeInfo = info;//全盘号码视图
		this.codes = data;//全选择数据
		this.selOpts = optsArr2;//用于快速计算注数
		this.playNum = playNum;//用于判断可用的过关方式
		this.endtime = endtime;

		this.ondatachange();//传递给过关方式处理
	},
	getCodeString: function (){
		var c = [];
		this.codes.each(function (m){
			c.push(m.map(function (obj){
				return obj.mps;
			}).join('/'));
		});
		return c.join('/');
	},
	getTr1: function (bid){
		return Yobj.get('#code'+bid+ '_a');
	},
	getTr2: function (bid){
		return Yobj.get('#code'+bid+'_b');
	},
	//添加事件
	addEvents: function (){
		var _self = this;
		//点击头复选框, x掉一个对阵
		this.box.find('input').click(function (){
			this.checked = true;
			var tr = Yobj.get(this).parent('tr').hide();
			tr.next().hide();
			_self.onchange(tr.attr('data-id'));// 本对阵选项全部清空
			_self.updateData();
		});
		_self.get("#checkbox_clear").click(function(){
          	Y.get("#choose_list").find("tr").each(function(e){
          		var tr=this.hide();
          		var bid=this.attr('data-id');
          		tr.next().hide();
    			_self.onchange(bid);// 本对阵选项全部清空
    			_self.updateData();
          	});
          	
      	}); 
		//点击选项
		this.box.find('span.x_s').hover(function (){
			Yobj.get(this).addClass('nx_s');
		}, function (){
			Yobj.get(this).removeClass('nx_s');
		}).click(function (){
			_self.removeTag.call(this);
		});
		this.removeTag = function (){
			Yobj.get(this).hide();
			var bid = this.getAttribute('data-id'),
				tr = _self.getTr2(bid),
				sel = tr.find('span:visited');
			if (sel.size() === 0) {//全部隐藏了
				tr.hide();
				tr.prev().hide();
			}
			_self.onchange(bid, sel.nodes.map(function (span){
				return span.getAttribute('data-sg');
			}));
			_self.updateData();			
		}
	},
	findTag: function (bid, sg){
		return this.getTr2(bid).find('span[data-sg='+sg+']').nodes[0];
	},
	//添加基本对阵表格
	addBaseTr: function (vsList){
		var doc = document.createDocumentFragment(),
			vs, tr;
		for (var i = 0, j = vsList.length; i < j; i++) {
			this.__addTr(vsList[i], doc);
		}
		this.box.nodes[0].appendChild(doc);
		this.addEvents();
	},
	//添加了一行, addBaseTr的辅助方法
	__addTr: function (vsInfo, doc){
		var tr = this.tmpl_1.cloneNode(true);
		var tr2 = this.tmpl_2.cloneNode(true);
		var tds = Yobj.get('td', tr);
		tds.nodes[0].getElementsByTagName('span')[0].innerHTML = vsInfo.game_time;
		tds.nodes[1].innerHTML = vsInfo.title.replace('vs', '<span class="sp_vs">VS</span>');
		doc.appendChild(tr);
		doc.appendChild(tr2);
		tr.id = 'code' + vsInfo.id + '_a';
		tr2.id = 'code' + vsInfo.id + '_b';	
		tr2.className += ' code_area';
		var trs = Yobj.get([tr, tr2]).attr('data-id', vsInfo.id)
			.attr('data-mp', vsInfo.mid_pname)
			.attr('data-index', vsInfo.game_time)
			.attr('data-vs', vsInfo.title)
			.attr('data-mp', vsInfo.mid_pname)
			.attr('data-endtime', vsInfo.end_time);
		trs.find('span.x_s').attr('data-id', vsInfo.id).hide();
		//让分加上让分数以区分普通胜负玩法
		trs.find('span[data-sg=rfsf2]').html(function (){
			return this.innerHTML + ' '+ vsInfo.rf[0]
		});
		trs.find('span[data-sg=rfsf1]').html(function (){
			return this.innerHTML + ' '+ vsInfo.rf[1]
		});
	},
	//同步选择器, 选择器触发
	syncSelector: function (bid, arr_selected_chks){
		var match = arr_selected_chks.map(function (chk){
			return chk.getAttribute('data-type') + chk.value;
		});
		this.syncData(bid, match);
	},
	syncData: function (bid, str_sel_arr){
		var tr1 = this.getTr1(bid),
			tr2 = tr1.next();
		if (tr1.size() && str_sel_arr.length) {
			tr2.find('span.x_s').each(function (span){
				span = Yobj.get(span);
				if (str_sel_arr.indexOf(span.attr('data-sg')) > -1) {
					span.show();
				}else{
					span.hide();
				}
			});
			tr1.show();
			tr2.show();
		}else{
			tr1.hide();
			tr2.hide();
		};
		this.updateData();
	}
});


/*过关方式选择器
*************************************************************************/
Class('GgType', {
	index: function (){
		this.setTabs();
		this.setEvents();
		this.idmap = Yobj.dejson(Yobj.get('#jsonggtype').val());
		this.only_mix = Yobj.get('#qcdy').prop('checked');
	},
	setEvents: function (){
		var _self = this;
		Yobj.get('#qcdy').click(function (){
			_self.only_mix = this.checked;
			_self.updateTypeView(true);
		});
		Yobj.get('#ggListFree input,#ggList input').click(function (){
			if(_self.typeChange(true)){//计算溢出了
				this.checked = false; //恢复
			};
		});
		Yobj.get('#qcdy').prop('disabled', true).prop('checked', false);
		this.lt2_info = this.get('<div style="text-align: center;position:relative;top:15px;color: red;" id="vslt2">请至少选择2场比赛进行投注。</div>').insert('#ggListFree', 'prev');
	},
	max: 0, //当前最多能玩的串数
	maxNum: {//混串最多可玩数
		'sf': 8,
		'rfsf': 8,
		'sfc': 4,
		'dxf': 8
	},	
	only_mix: true,
	codes: [],
	selOpts: [],
	ggTypes: [],
	ggTypeIds: [],
	playNum: {},
	mode: 'free', // 'multi', 多串和自由
	onchange: Yobj.getNoop(),// 点击选择和切换的时候
	setTabs: function (){
		var tabs = Yobj.get('#ggTabsNav li'),
			_self = this,
			typeBox = Yobj.get('#ggListFree,#ggList'),
			css = 'an_cur';
		tabs.each(function (li, i){
			li.tab_index = i;
		}).click(function (){
			focusTab( this.tab_index);
		});
		function focusTab(idx){
			tabs.removeClass(css).eq(idx).addClass(css);
			change(idx);			
		};
		function change(idx){
			typeBox.hide().eq(idx).show();
			_self.mode = idx == 0 ? 'free' : 'multi';
			_self.lt2_info.html('请至少选择'+(idx===1?3:2)+'场比赛进行投注。');
			_self.lt2_info.show(_self.max < (_self.mode == 'free' ? 2 : 3));
			_self.updateTypeView();
		}
		this.focusTab = focusTab;
	},
	//手动选上过关方式
	setGgType: function (int_gggroup, str_type){
		var box = int_gggroup == '3' ? '#ggListFree' : '#ggList';
		Yobj.get(box).find('input').each(function (chk){
			if (str_type.indexOf(chk.value) > -1) {
				chk.checked = true;
			}
		});
		this.typeChange(true);
	},
	//计算可玩的最大过关方式
	getMaxGgType: function (isFromQcdy){
		var ptn = 0,//有玩法项数
			sum = 0,
			len = this.codes.length,
			playNum = this.playNum,
			max = playNum.sfc ? 4 : 8;//最多选到
		for(var k in playNum){
			if (playNum[k]) {
				ptn++;
			}
			sum += playNum[k];
		}
		if (!isFromQcdy) {//如果用户不是主动选择去除单一， 自动去掉混投限制
			var can_hc = ptn > 1 && len > (this.mode == 'free' ? 1 : 2);
			Yobj.get('#qcdy').prop('checked', false).prop('disabled', !can_hc);
			this.only_mix = false;
		}
		if (this.only_mix) {//只允许混投 
			if (ptn < 2) {//玩法太少
				return 0;
			}
			return Math.min(Math.min(len, max), sum);
		}else{//允许单一玩法
			return Math.min(max, len);
		}
	},
	//设置可用的过关方式显示
	updateTypeView: function (isFromQcdy){
		var max = this.max = this.getMaxGgType(isFromQcdy);
		var isFree = this.mode == 'free';
		var min = isFree ? 2 : 3;
		var id = isFree ? '#ggListFree' : '#ggList';
		Yobj.get('#ggListFree').next('div').show(isFree);
		var labs = Yobj.get(id + ' label').hide();
		this.lt2_info.show(max < min);
		labs.each(function (lab){
			 var labelFor = (lab.getAttribute('for') || lab.getAttribute('HTMLfor'))+'',
				 num = parseInt(labelFor.slice(1));
			if (num > 1 && num <= max ) {
				Yobj.get(lab).show();
			}else{
				lab.getElementsByTagName('input')[0].checked = false;
			}
		});	
		this.typeChange(false);//这个不是选择过关方式触发的
	},
	//过关方式变化时
	typeChange: function (is_gg_fire){//是否手动点的
		var box = this.mode == 'free' ? '#ggListFree' : '#ggList',
			ids = [],
			ggtype = [],
			_self = this;
		this.ggTypes = Yobj.get(box + ' input:checked').nodes.map(function (input){
			ids.push(_self.idmap[input.value]);
			ggtype.push(input.value);
			return input.value;
		});
		this.ggTypeIds = ids;
		this.ggtype = ggtype;//过关方式字符型
		if (is_gg_fire) {
			Yobj.get('#qcdy').prop('checked', false);
			this.only_mix = false;			
		}
		return this.onchange(is_gg_fire);//计算溢出时会返回true;
	},
	//同步号码框
	syncCodeList: function (codeList){//[{id:'123', codes:[{type:'sf', code: ['3']}]}]
		this.codes = codeList.codes;
		this.playNum = codeList.playNum;
		this.selOpts = codeList.selOpts;
		this.updateTypeView();	
		if(this.codes.length>0){
        	this.get("#checkbox_clear").addClass("jcq_kcur");
        }else{
        	this.get("#checkbox_clear").removeClass("jcq_kcur");
        }
		Yobj.get('#cs').html(this.codes.length);
		//var single = 	Math.cl(codes, codes);
	}
});

/*发起购买类 
*************************************************************************/
Class('Buy', {
	single: true,
	bs: 1,
	index: function (target){
		var _self = this;	
		this.form = Yobj.get(target);
		Yobj.createIntInput('#bs', function (e){//修改倍数
			
			_self.bs = parseInt(this.value);
		   _self.bschange();
         }, 100000);

		Yobj.get('#gobuy,#gohm').click(function (){
			_self.ishm = this.id == 'gohm' ? 1 : 0;
			if (_self.ishm){
            	Y.get("#project_form").attr("action", "/phpt/lc/step_7.phpx");
            }else{
            	Y.get("#project_form").attr("action", "/phpt/lc/step_8.phpx");
            }
			if (true === _self.check()) {
				_self.send();
			}
		});
	},
	bschange: function (){},//倍数变化时
	setVals: function (obj){//批量设置表单
		for(var k in obj){
			Yobj.get(k).val(obj[k]);
		}
	},
	check: function (){},
	send: function (){//表单提交
		this.form.doProp('submit');
	}
});

//联赛过滤器
Class('LgFilter', {
	index: function (){
		var $this = this,
			btn = Yobj.get('#listDisplay'),
			menu = Yobj.get('#listMenu'),
			all = Yobj.get('#listMenu,#listDisplay'),
			tid;
		this.setOptionsEvent(menu);
		all.hover(function (){
			clearTimeout(tid);
			$this.open();
			btn.addClass('ls_h_btn');
		}, function (){
			tid = setTimeout(function() {
				$this.close();
				btn.removeClass('ls_h_btn');				
			}, 100);
		});
		this.menu = menu;
	},
	reset: function (){
		this.menu.find('input:checkbox').prop('checked', true);
	},
	onchange: function(){},
	setOptionsEvent: function (menu){
		var all_chks = menu.find('input:checkbox'),
			$this = this;
		all_chks.click(function (){
			$this.onchange(this.getAttribute('m'), this.checked);
		});
		Yobj.get('#selectAllBtn').click(function (){
			var str = '';
			all_chks.each(function (chk){
				chk.checked = true;
				str += chk.getAttribute('m');
			});
			$this.onchange(str);
		});
		Yobj.get('#selectOppBtn').click(function (){
			var str = '';
			all_chks.each(function (chk){
				chk.checked = !chk.checked;
				if (chk.checked) {
					str += chk.getAttribute('m');
				}
			});
			$this.onchange(str);
		});
	},
	open: function (){
		Yobj.get('#listMenu').show();
	},
	close: function (){
		Yobj.get('#listMenu').hide();
	}
});

/*启动入口*/
Class('Main', {
	ready: true,
	index: function (){
		this.createClass();
		this.otherEvents();
		this.lib.Clock('#sysTime');//时间
		this.setTableHeadFixed();
		this.sethref();
	},
	sethref:function() {
    	this.ajax({
				url:"/cpdata/omi/jclq/odds/odds.xml",
        		end:function(data,i){
                     this.qXml('//row', data.xml, function (u, i){
                    	
                    	 Y.get("#mn"+u.items.xid).attr("href","http://info.159cai.com/leagueb/index/"+u.items.lid);
         				Y.get("#gn"+u.items.xid).attr("href","http://info.159cai.com/teamb/index/"+u.items.htid);
                     	 Y.get("#hn"+u.items.xid).attr("href","http://info.159cai.com/teamb/index/"+u.items.gtid);
                     	 Y.get("#ox"+u.items.xid).attr("href","http://odds.159cai.com/bmatch/analysis/"+u.items.mid);
                     	 Y.get("#oz"+u.items.xid).attr("href","http://odds.159cai.com/bmatch/odds/"+u.items.mid);
            			 if(u.items.oa!=""){Y.get("#oh"+u.items.xid).html(parseFloat(u.items.oa).rmb(false,2));}
            			 if(u.items.oh!=""){Y.get("#oa"+u.items.xid).html(parseFloat(u.items.oh).rmb(false,2));}
                     });                     
        		}
				});
	},
	otherEvents: function (){
		//显示截止时间或者开赛时间
		var endTime = Yobj.get('#vsTable span.endtime'),
			matchTime = Yobj.get('#vsTable span.matchtime');
		Yobj.get('#select_time').change(function (){
			if (this.value == 0) {
				endTime.show();
				matchTime.hide();
			}else{
				matchTime.show();
				endTime.hide();
			}
		});
		Yobj.use('mask', function (){
			Yobj.get('span.dcr_table_help').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
		});
	},
	createClass: function (){
		var selector = new Yobj.lib.Selector(),
			codeList = new Yobj.lib.CodeList(),
			ggTypeBox = new Yobj.lib.GgType(),
			buy = new Yobj.lib.Buy('#project_form'),
			algo = new Yobj.lib.Algo(),
			splitView = new Yobj.lib.SplitView(),
			lgFilter = new Yobj.lib.LgFilter();

		selector.onchange = function (bid, arr){
			codeList.syncSelector(bid, arr);//选择器变化时， 同步到号码框
		};

		selector.oninit = function (){
			codeList.addBaseTr(this.vsList);//创建对应的选项到号码框
		};

		selector.onProxyRemove = function (bid, sg){
			codeList.removeTag.call(codeList.findTag(bid, sg));
		};

		codeList.onchange = function (bid, arr_data_sg){
			selector.setCode(bid, arr_data_sg);//号码列表变动时， 选择器同步
		};

		codeList.ondatachange = function (){// 号码列表数据变化时
			splitView.codeInfo = this.codeInfo;
			splitView.codes = this.codes;
			splitView.selOpts = this.selOpts;
			ggTypeBox.syncCodeList(this);//同步可用的过关方式
			buy.bschange();
			//方案截止时间显示
			var showtime = '';
			if (this.endtime) {//没有选择时为0
				var endTime = new Date(parseInt(this.endtime));
			    if (endTime) {
					showtime = endTime.format('MM-DD hh:mm');
			    }
			}
			Yobj.get('#end_time').html(showtime);			
		};

		ggTypeBox.onchange = function (is_gg_fire){//过关方式变化时
			algo.update(ggTypeBox);//计算注数
			if (algo.overflowErr) {
				if (!is_gg_fire) {//如果不是选过关方式触发的, 选
					selector.resetLast();//
				}
				return true; //是否计算溢出
			}
			buy.bschange();			
		};

		algo.onoverflow = function (zs){
			Yobj.alert('您的投注超过了最大注数限制!');
		};

		buy.bschange = function (){//倍数变化时
			var zs = algo.zs,
				money = parseInt(zs * this.bs *2).rmb(),
				minMoney = (algo.minPrize*this.bs).rmb(),
				maxMoney = (algo.maxPrize*this.bs).rmb();//(algo.minPrize*this.bs).rmb() + ' ~ ' +
			splitView.mode = ggTypeBox.mode;
			splitView.only_mix = ggTypeBox.only_mix;
			splitView.ggtype = ggTypeBox.ggtype;
			splitView.maxggtype = ggTypeBox.max;
			splitView.bs = this.bs;
			splitView.zs = zs;
			splitView.money = money
			splitView.maxMoney = maxMoney;
			Yobj.get('#zs').html(zs);
			Yobj.get('#buy_money').html(money);
			Yobj.get('#maxmoney').html(maxMoney);
			Yobj.get('#prix_range').html('奖金范围：'+minMoney+'-'+maxMoney+'元');
		};

		selector.init('#vsTable');
		selector.onshowAll = function (){
			lgFilter.reset();
		};

		lgFilter.onchange = function (lgs_str, checked){
			if (arguments.length > 1) {//单个变化时
				selector.filterOneLg(lgs_str, checked);
			}else{
				selector.filterLg(lgs_str);//过滤场次
			}			
		};

		//提交时检查
		buy.check = function (){
			var ggType = ggTypeBox.ggTypes;
			//	codes = codeList.data;
			//if (codes.length < 2) {
			//	return Yobj.alert('请至少选择两场比赛');
			//}
			if (ggTypeBox.max) {
				if (ggType.length === 0) {
					return Yobj.alert('请选择过关方式');
				}				
			}else{
				return Yobj.alert('请至少选择两场不是同一玩法的比赛');
			}

			this.setVals({
				'#codes': codeList.getCodeString(),
				'#ggtypeid': ggTypeBox.ggTypeIds.join(','),
				'#ggtypename': ggTypeBox.ggTypes.join(','),
				'#zhushu': algo.zs,
				'#gggroup': ggTypeBox.mode === 'multi' ? 2 : 3,
				'#beishu': this.bs,
				'#totalmoney': algo.zs*this.bs*2,
				'#ishm': this.ishm,
				'#ismix': ggTypeBox.only_mix ? 1 : 0 
			});

			return true;
		};		
	},
	setTableHeadFixed: function (){
		//设置表头浮动
		Yobj.get('<div id="title_folat" style="z-index:9;"></div>').insert().setFixed({
			area: '#vsTable',
			offset:0,
			init: function(){
				var This = this,
					title = this.area.find('table').one(0),
					floatTitle = title.cloneNode(true);
				this.get(floatTitle).insert(this);
				this.floatTitle = floatTitle;
				this.title = title;
				this.hide();
				Y.get(window).resize(function(){
					This.setStyle('left:'+(This.area.getXY().x)+'px;width:'+(This.area.prop('offsetWidth'))+'px')
				});
			},
			onin: function (){
				this.show();
				this.setStyle('zIndex', 999);
				this.title.swapNode(this.floatTitle);
				var offset = this.ns.ie == 6 ? 2 : 0;
				this.setStyle('left:'+(this.area.getXY().x+offset)+'px;width:'+this.area.prop('offsetWidth')+'px')
			},
			onout: function (){
				this.hide();
				this.title.swapNode(this.floatTitle);
			}
		});		
	}
});