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
//选择器虚拟管理器
Yobj.optsAdm = {
	data: {},
	add: function (bid, tr123){
		var _self = this,
			spf = Yobj.get(tr123).find('input[data-type=spf]').nodes;
		    rqspf = Yobj.get(tr123).find('input[data-type=rqspf]').nodes;
		for (var i =  spf.length; i--;) {//保存胜平负的选项信息
			var el = spf[i];
			this.set(bid, el.getAttribute('data-type') + el.value, false, el.getAttribute('data-sp'));
		}
		for (var i =  rqspf.length; i--;) {//保存胜平负的选项信息
			var el2 = rqspf[i];
			this.set(bid, el2.getAttribute('data-type') + el2.value, false, el2.getAttribute('data-sp'));
		}
		Yobj.get(tr123).find('p.tb_s_more').each(function (p){
			var type = p.getAttribute('data-type');
			p.getAttribute('data-sp').split(',').each(function (str){
				var arr = str.split('|');
				_self.set(bid, type + arr[0], false, arr[1]);
			});
		});
	},
	get: function (bid, type){// get('8569', 'fs1')
		var vs = this.__getBid(bid);
		return vs[type] || [false , 1];
	},
	getSp: function (bid, type){
		return this.get(bid, type)[1];
	},
	set: function (bid, type, checked, sp){//type = fs1;
		var vs = this.__getBid(bid),// {'sf1': [false, 1.2]}
			data = vs[type];//[]
		if (arguments.length === 3) {
			sp = data ? data[1] : 1;
		}
		vs[type] = [checked, sp];
	},
	allSet: function (bid, selected){
		var vs = this.__getBid(bid);
		for(var k in vs){
			vs[k][0] = selected;
		}
	},
	__getBid: function (bid){
		if (bid in this.data) {
			return this.data[bid];
		}
		this.data[bid] = {};
		return this.data[bid];
	}
};
//回到顶部链接
Class('ScrollStill', {
	index : function() {
		var Y = this;
		this.goTop = this.one('a.back_top');
		this.rightArea = this.get('div.dc_r');
		this.mainArea = this.get('#main');
		if (this.ie && this.ie == 6) {
			this.goTop.style.position = 'absolute';
			this.goTop.style.left = '750px';
		} else {
			setTimeout( function() {
				Y.goTop.style.left = Y.rightArea.getXY().x-10 + 'px';
			}, 500 );
		}
		this.get(window).scroll( function () {
			clearTimeout(Class.C('scrollTimer'));
			if (Y.ie && Y.ie == 6) {
				Class.C('scrollTimer', setTimeout(Y.scrollStillIE6.proxy(Y), 100));
			} else {
				Class.C('scrollTimer', setTimeout(Y.scrollStillOthers.proxy(Y), 100));
			}
		});
	},
	scrollStillOthers : function() {
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

//选号层类
Class('SelectLayer', {
	index: function (layId, type, selector){
		var _self = this;
		this.type = type;
		this.lay = Yobj.get(layId);
		this.selector = selector;
		this.chks = this.lay.find('input');
		this.chks.click(function (){
			_self.optionClick(this);
		});
		//点击外面隐藏
		this.lay.mousedown(function (e){
			e.stop();
		});
		Yobj.get(document).mousedown(function (){
			_self.hide();
		});
	},
	optionClick: function (chk){
		this.setTdBg(chk);
		this.setNum(this.lay.find('input:checked').size());
		this.optionChange(chk);
	},
	setTdBg: function (chk){
		var td = Yobj.get(chk).parent('td');
		if (chk.checked) {
			//td.setStyle('background', '#ffdaa4');
			td.addClass('h_brb');
		}else{
			//td.setStyle('background', '');
			td.removeClass('h_brb');
		}
	},
	optionChange: function (chk){
		Yobj.optsAdm.set(this.bindId, chk.getAttribute('data-type') + chk.value, chk.checked);
		if (chk.checked) {
			chk.isinlay = true;
			this.selector.lastChk = chk;// 记录最后点击的复选框， 以恢复溢出;
		}
		this.selector.setCode(this.bindId, true/*不再回溯到自己*/);//选择器也要同步
		this.selector.onchange(this.bindId);//事件由号码框响应
	},
	update: function (bid, p){//弹出的时候刷新所有状态
		this.bindId = bid;
		this.p = p;
		var _self = this,
			sum = 0,
			doc = Yobj.optsAdm.__getBid(bid);//{'sf1':[true, 1.2]}
		this.chks.each(function (chk){
			var id = (chk.getAttribute('data-type') + chk.value).replace('+', '');
			var state = doc[id];
			if (state) {
				chk.checked = state[0];//设置选中
				if (chk.checked) {
					sum++;
				}
				Yobj.get(chk.parentNode).find('span.tb_tdul_pl').html(state[1]);//设置sp值
				_self.setTdBg(chk);//是否高亮				
			}else if(window.console){
				console.log('Yobj.optsAdm not found ' + id);
			}
		});
		this.setNum(sum);
	},
	setNum: function (n){
		var html;
		if (this.p) {
			this.p.innerHTML = this.getHtml(n, false);
		}
	},
	getHtml: function (n, _open){
		var ini = _open ? ['s_more_show', '<a class="xs">显示</a>'] : ['s_more_hide', '<a class="yc">隐藏</a>'];
		if (n) {
			html = '<span class="'+ini[0]+'">'+ini[1]+'</span><strong class="red">'+n+'</strong>';
		}else{
			html = '<span class="'+ini[0]+'">'+ini[1]+'</span>';
		}	
		return html;
	},
	show: function (ref){//参考定位
		var xy = Yobj.get(ref).getXY();
		this.lay.show();
		xy.x  = xy.x - (this.lay.nodes[0].offsetWidth - ref.prop('offsetWidth'));
		xy.y = xy.y + 80;		
		this.lay.show().setXY(xy);	
		this.isshow = true;
	},
	hide: function (){
		this.lay.hide();
		this.isshow = false;
		if (this.p) {
			Yobj.get(this.p).find('span').prop('className', 's_more_show').html('<a class="xs">显示</a>');
		}
	}
});

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
		Yobj.get("#vsTable tr td .h_bra").mouseover(function(){
			Yobj.get(this).addClass("h_brc");
		});
		Yobj.get("#vsTable tr td .h_bra").mouseout(function(){
			Yobj.get(this).removeClass("h_brc");
		});
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
	updateHideCount: function (){
		this.hideNum = this.allTr.reduce(function (sum, tr){
			return sum += (tr.className.indexOf('hide_row') > -1 ? 1 : 0);
		}, 0);
		this.setHideNum();
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
			var bid  = this.getAttribute('data-bid');
			Yobj.optsAdm.set(bid, this.getAttribute('data-type') + this.getAttribute('data-value'), false);
			_self.setCode(bid);
			_self.onchange(bid);
		});
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
				stoper.setStyle('display', '').removeClass('hide_row');
			}else{
				stoper.addClass('hide_row');
			}
		});
		var layIdMap = {
			'jqs': new Yobj.lib.SelectLayer('#jqs_more', 'jqs', this),
			'bf': new Yobj.lib.SelectLayer('#bf_more', 'bf', this),
			'bqc': new Yobj.lib.SelectLayer('#bqc_more', 'bqc', this)
		};
		this.getLayByType = function (type){
			return layIdMap[type] || null;
		};
		function hideAlllay(){
			for(var k in layIdMap){
				layIdMap[k].hide();
			}
		}
		this.popMoreLay = function (moreBtn){
			var lay = layIdMap[moreBtn.getAttribute('data-type')];
			if (lay) {
				hideAlllay();
				_self.popMoreLayer(lay, moreBtn);
			}			
		};
		//点击更多的时候
		box.find('p.tb_s_more').click(function (){
			if (this.innerHTML.indexOf('隐藏') > -1) {
				hideAlllay();
			}else{
				_self.popMoreLay(this);	
			}			
		}).mousedown(function (e){
			e.stop();
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
	//弹出更多层
	popMoreLayer: function (lay, p, allLayer){
		var bid = p.getAttribute('data-id');
		var tr = this.getTr1(bid);
		var posTd = tr.find('input[data-type='+p.getAttribute('data-type')+']').parent('td');
		this.currentExlay = lay;
		lay.update(bid, p);
		lay.show(posTd);
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
	},
	onchange: Yobj.getNoop(),
	//重新统计选项
	optionChange: function (chk){
		var bid  = chk.getAttribute('data-id');
		var type = chk.getAttribute('data-type');
		Yobj.optsAdm.set(bid, type + chk.value, chk.checked);
		if (chk.checked) {
			this.lastChk = chk;// 记录最后点击的复选框， 以恢复溢出;
		}		
		this.onchange(bid);//事件由号码框响应
		this.updateMoreBtn(bid, Yobj.optsAdm.__getBid(bid), type == 'spf'||type == 'rqspf' ? false : type);//同步更多按钮
	},
	//注数超出时回复
	resetLast: function (){
		var chk = this.lastChk;
		if (chk) {
			chk.checked = false;
			this.lastChk = null;
			if (chk.isinlay) {
				var lay = this.getLayByType(chk.getAttribute('data-type'));
				if (lay) {
					lay.optionClick(chk);//模拟层点击
				}
			}else{
				this.clickCallBack(chk);//手动取消这个选项
			}			
		}
	},
	//统计隐藏项选中数
	updateSelectNum: function (bid){
		var table = this.getTr1(bid).find('table.tb_sfc_s'),
			tag = table.prev('span').nodes[0];
		if (tag) {
			tag.selectedNum = table.find('input:checked').size();
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
			_self = this;
		box.childs('table').each(function (table){
			if (table.innerHTML.indexOf('赛事编号') == -1) {//跳过表头
				var trs = table.rows,//tr里面包含一个显示剩分差的选项table
					chk, other, id, data, A, B, C, chks, moreP;
				for (var i = 0, j = trs.length; i < j; i++) {//一行是一个比赛
					A = trs[i];
					all.push(A);
					allTr.push(A);
					chk = getHeadInput(A);//头标签
					chk.onclick = onclick_head;
					chks = Yobj.get(A).find('input[data-type]');
					moreP = Yobj.get(A).find('p.tb_s_more');//三个更多按钮
					if (moreP.size()) {//截止后不再存在"更多"
						id = A.getAttribute('mid');
						idArr.push(id);
						A.id = 'vs'+id;
						A.bindid = id;//基本id, 用于组装成两个a,b id;
						data = {
							mid_pname: A.getAttribute('mid') + '|' + A.getAttribute('pname'),
							game_time: A.cells[0].getElementsByTagName('span')[0].innerHTML,
							end_time: Yobj.getDate(A.getAttribute('pendtime')).getTime(),
							title: A.getAttribute('hometeam') + 'vs' + A.getAttribute('guestteam'),
							id: id,
							trs: [A]
						};
						vs.push(data);
						vs_hash[id] = data; //分别保存为数组和哈希以供检索
						chks.attr('data-id', id).prop('checked', false);//用bindid关联tr
						moreP.attr('data-id', id);						
						vsTr.push(A);
						Yobj.optsAdm.add(id, [A]);
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
		this.vsTr = vsTr;
		this.vsList = vs;
		this.vs_hash = vs_hash;
		this.stopTr = stopTr;
		this.allTr = all;//只有主行
		this.allTrs = allTr;//包括所有子行
	},
	getTrs: function (bid){
		return Yobj.get('#vs' + bid);
	},
	getTr1: function (bid){
		return Yobj.get('#vs'+bid);
	},
	setTdBg: function (chk){
		var td = Yobj.get(chk).parent('li');
		if (chk.checked) {
			td.addClass('h_brb');
		}else{
			td.removeClass('h_brb');
		}
	},
	synState: function (opts, data){
		var _self = this;
		opts.each(function (chk){//一个一个的同步
			var set = data[chk.getAttribute('data-type')+chk.value];
			if (set) {
				chk.checked = set[0];
			}
			_self.setTdBg(chk);
		});		
	},
	//用号码来选择一个对阵
	setCode: function (bid, isFormLay){//
		var trs = this.getTrs(bid), 
			opts = trs.find('input[data-type]');//找到对应的inputs组
		var data = Yobj.optsAdm.__getBid(bid);//查询状态表
		this.synState(opts, data);//同步简单显示的checkbox
		//如果弹层存在， 同时刷新弹层的内容。
		if (!isFormLay && this.currentExlay && this.currentExlay.bindId == bid && this.currentExlay.isshow) {
			this.currentExlay.update(bid, this.currentExlay.p);
		};
		//如果弹层隐藏也要更新按钮数字
		this.updateMoreBtn(bid, data);
	},
	//更新更多按钮的状态
	updateMoreBtn: function (bid, data, fromSimleBtnClickType){
		var nums = '',
			optsHTML = {'jqs': [], 'bf': [], 'bqc': [], 'spf': [], 'rqspf': []};
		for(var k in data){
			var hk = k.replace(/\d.*$/, '');
			var val = k.replace(hk, '');
			var checked = data[k][0];
			if (checked) {//选中
				nums += k;//'bqc00spf0';
				if (hk in optsHTML) {//添加显示的选中项
					optsHTML[hk].push('<span class="x_s yl" onmouseover="this.className=\'x_s yl nx_s\'" onmouseout="this.className=\'x_s yl\'" data-type="'+hk+'" data-value="'+val+'" data-bid="'+bid+'">'+this.codeId2text(hk, val)+'</span>');
				}
			}
		}
		//遍历三个有扩展层的td
		Yobj.get('#vs' + bid + ' p.tb_s_more').each(function (p){
			var type = p.getAttribute('data-type');
			var m = nums.split(type).length - 1;//使用选项类型名做分隔符， 用来统计选中多少个
			var td = Yobj.get(p.parentNode);
			var ul = td.find('ul.dc_tdul');//包含复选框的ul
			var optsDiv  =td.find('div.dc_tddiv');//显示选择内容的div, 优化...
			ul.show(m === 0);
			optsDiv.show(m > 0);
			if (type in optsHTML) {
				optsDiv.html(optsHTML[type].join(''));
			}
			if (m) {//选中
				p.innerHTML = '<span class="s_more_show"><a class="xs">显示</a></span><strong class="red">'+m+'</strong>';
				if (fromSimleBtnClickType && fromSimleBtnClickType == type) {//如果来自于简单按钮的选择，弹出层
					this.popMoreLay(p);
				}				
			}else{
				p.innerHTML = '<span class="s_more_show"><a class="xs">显示</a></span>';
			}
		}, this);
		//如果弹层存在， 同时刷新弹层的内容。
		if (this.currentExlay && this.currentExlay.bindId == bid && this.currentExlay.isshow) {
			var curp =  this.currentExlay.p;
			if (curp) {
				Yobj.get(curp).find('span').prop('className', 's_more_hide').html('<a class="yc">隐藏</a>');
			}
		}
	},
	codeId2text: function (type, val){
		if (type == 'bqc') {
			return val.replace(/3/g, '胜').replace(/1/g, '平').replace(/0/g, '负');
		}else if(type == 'bf'){
			return val.replace('3A', '胜其它').replace('1A', '平其它').replace('0A', '负其它').replace(/^(\d)/, '$1-');
		}else{
			return val;
		}
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
		spf: 'SPF>',
		rqspf: 'RSPF>',
		jqs: 'JQS>', 
		bf: 'CBF>',
		bqc: 'BQC>' 
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
	bfSort: {
		"胜其它": 0,
		"1:0": 1,
		"2:0": 2,
		"2:1": 3,
		"3:0": 4,
		"3:1": 5,
		"3:2": 6,
		"4:0": 7,
		"4:1": 8,
		"4:2": 9,
		"5:0": 10,
		"5:1": 11,
		"5:2": 12,
		"平其它": 13,
		"0:0": 14,
		"1:1": 15,
		"2:2": 16,
		"3:3": 17,
		"负其它": 18,
		"0:1": 19,
		"0:2": 20,
		"1:2": 21,
		"0:3": 22,
		"1:3": 23,
		"2:3": 24,
		"0:4": 25,
		"1:4": 26,
		"2:4": 27,
		"0:5": 28,
		"1:5": 29,
		"2:5": 30
	},
	formatCode: function (type, codesArr){
		function down(a, b){
			return a > b ? -1 : 1;
		}
		function up(a, b){
			return a > b ? 1 : -1;
		}
		switch(type){
			case 'spf'://降序
				return codesArr.sort(down);
			case 'rqspf'://降序
				return codesArr.sort(down);
			case 'bf'://转换后升序
				var bsSort = this.bfSort;
				return codesArr.map(function (str){
					if (str == '0') {
						return '负其它';
					}else if(str == '1'){
						return '平其它';
					}else if(str == '3'){
						return '胜其它';
					}else{
						return (str+'').split('').join(':');
					}
				}).sort(function (a, b){
					return bsSort[a] > bsSort[b] ? 1 : -1;
				});
			break;
			case 'bqc'://降序
				return codesArr.sort(down).map(function (str){
						return (str+'').split('').join('-');
				});
			break;
		}
		return codesArr.sort(up);//升序jqs
	},
	updateData: function (){//重新生成号码数据
		var data = [],
			info = [],
			optsArr2 = [],
			playNum = {
				spf: 0,
				rqspf: 0,
				jqs: 0,  
				bf: 0,
				bqc: 0
			};
			endtime = 0,
			_self = this;
		//查找号码列表中所有可见号码区的号码;
		this.box.find('tr.code_area:visited').each(function (tr){
			var bid = tr.getAttribute('data-id');
			var mp = tr.getAttribute('data-mp');
			var m_endtime = tr.getAttribute('data-endtime');
			var span = Yobj.get(tr).find('span.x_s:visited');
			var codes = [];
			var spf = _self.__getGroup('spf', bid, mp);
			var rqspf = _self.__getGroup('rqspf', bid, mp);
			var jqs = _self.__getGroup('jqs', bid, mp);
			var bf = _self.__getGroup('bf', bid, mp);
			var bqc = _self.__getGroup('bqc', bid, mp);
			var hasSfc, hasrqSfc, hasSf, hasRfsf, hasDxf;
			var prizeArr = [];
			var codeArr = [];
			if (endtime) {
				endtime = Math.min(endtime, m_endtime);
			}else{
				endtime = m_endtime;
			}
			span.nodes.each(function (span){
				var type = span.getAttribute('data-sg');
				var g;
				if (type.indexOf('spf') === 0) {
					g = spf;
					if (!hasSfc) {
						hasSfc = true;
						playNum.spf++;
					}					
				}else if (type.indexOf('rqspf') === 0) {
					g = rqspf;
					if (!hasrqSfc) {
						hasSfc = true;
						playNum.rqspf++;
					}					
				}else if(type.indexOf('bf') === 0){
					g = bf;
					if (!hasSf) {
						hasSf = true;
						playNum.bf++;
					}					
				}else if(type.indexOf('jqs') === 0){
					g = jqs;
					if (!hasRfsf) {
						hasRfsf = true;
						playNum.jqs++;
					}
				}else{
					g = bqc;
					if (!hasDxf) {
						hasDxf = true;
						playNum.bqc++;
					}
				}
				g.code.push(type.replace(/\D/g, ''));//去掉号码的玩法识别(-sfc)部分, data-sg="sf2"
				var sp = Yobj.optsAdm.getSp(bid, type);
				g.prize.push(sp);//查询sp值
				codeArr.push(span.innerHTML+'('+sp+')');
			});
			var opt = [];
			data.push([spf,rqspf,jqs,bf,bqc].filter(function (obj){
				var len = obj.code.length;
				if (len) {
					opt.push(len + '-' + obj.type);//[2-sfc];
					obj.mps += '['+_self.formatCode(obj.type, obj.code).join(',')+']';//排序后拼接
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
			var tr = Yobj.get(this).parent('tr').hide(),
				bid = tr.attr('data-id');
			tr.next().hide();
			Yobj.optsAdm.allSet(bid, false);
			_self.onchange(bid);// 本对阵选项全部清空
			_self.updateData();
		});
		_self.get("#checkbox_clear").click(function(){
          	Y.get("#choose_list").find("tr").each(function(e){
          		var tr=this.hide();
          		var bid=this.attr('data-id');
          		tr.next().hide();
          		Yobj.optsAdm.allSet(bid, false);
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
			Yobj.get(this).hide();
			var bid = this.getAttribute('data-id'),
				tr = _self.getTr2(bid),
				sel = tr.find('span:visited');
			if (sel.size() === 0) {//全部隐藏了
				tr.hide();
				tr.prev().hide();
			}
			Yobj.optsAdm.set(bid, this.getAttribute('data-sg'), false);
			_self.onchange(bid);
			_self.updateData();
		}).mousedown(function (e){
			e.stop();
		});
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
		Yobj.get([tr, tr2]).attr('data-id', vsInfo.id)
			.attr('data-mp', vsInfo.mid_pname)
			.attr('data-index', vsInfo.game_time)
			.attr('data-vs', vsInfo.title)
			.attr('data-endtime', vsInfo.end_time)
			.find('span.x_s').attr('data-id', vsInfo.id).hide();
	},
	//同步选择器, 选择器触发
	syncSelector: function (bid){
		var tr1 = this.getTr1(bid),
			sum = 0,
			tr2 = tr1.next();
		var data = Yobj.optsAdm.__getBid(bid);//{'fs1':[true, 12.2]};从状态文档中读取最新状态来同步号码
		tr2.find('span.x_s').each(function (span){
			span = Yobj.get(span);
			var state = data[span.attr('data-sg')];// [true, sp];
			if (state && state[0]) {
				span.setStyle('display', ''); 
				sum++;
			}else{
				span.hide();
			}
		});
		if(sum){
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
		'spf': 8,
		'rqspf': 8,
		'jqs': 6,
		'bf': 4,
		'bqc': 4
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
			max = (playNum.bqc || playNum.bf) ? 4 : (  playNum.jqs ? 6 : 8);//最多选到
		for(var k in playNum){
			if (playNum[k]) {
				ptn++;
			}
			sum += playNum[k];
		}
		if (!isFromQcdy) {//如果用户选择的是单一玩法， 自动去掉混投限制
			var can_hc = ptn > 1 && len > (this.mode == 'free' ? 1 : 2);
			Yobj.get('#qcdy').prop('disabled', !can_hc).prop('checked', false);
			this.only_mix = false;
		}
		if (this.only_mix) {//只允许混投 && this.mode != 'multi'
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
		var id = isFree ? '#ggListFree' : '#ggList';
		var min = isFree ? 2 : 3;
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
	syncCodeList: function (codeList){//[{id:'4578', codes:[{type:'sf', code: ['1']}]}]
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
            	Y.get("#project_form").attr("action", "/phpt/jc/step_11.phpx");
            }else{
            	Y.get("#project_form").attr("action", "/phpt/jc/step_12.phpx");
            }
			if (true === _self.check()) {
				_self.send();
			}
		});
		
		this.get('#jjyh').click(function (){
			_self.ishm = this.id == 'jjyh' ? 1 : 0;
			if (_self.ishm){
            	//Y.get("#jjyh_form").attr("action", "jjyh_hh.html");
            }
			if (true === _self.check()) {
				var ty=Y.get('#ggtypename').val().split('\串');
				if(Y.get('#ggtypename').val().split(',').length>1){
                	return Y.alert('奖金优化暂不支持同时选择多个过关方式！');
                }
	            if(ty[1]>1){
	            	return Y.alert('奖金优化仅支持N串1！');
	            }
	            Y.get('#pnum').val(ty[0]);
				Y.get('#code').val(Y.get('#codes').val());
				Y.get('#tmoney').val(Y.get('#totalmoney').val());
				Y.get('#muli').val(Y.get('#beishu').val());
				var MAX_ALL_MONEY = 100000;
	            if (Y.get('#tmoney').val() > MAX_ALL_MONEY) {
	                return Y.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!');
	            }
	            Y.get('#jjyh_form').doProp('submit')
				//_self.send();
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

/*启动入口
*************************************************************************/
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
				url:"/cpdata/omi/jczq/odds/odds.xml",
        		end:function(data,i){
                     this.qXml('//row', data.xml, function (u, i){
                    	    Y.get("#mn"+u.items.xid).attr("href","http://info.159cai.com/index.php?controller=main&lid="+u.items.lid+"&sid="+u.items.sid+"&cid="+u.items.cid+"&t="+u.items.t);
                    	    Y.get("#hn"+u.items.xid).attr("href","http://info.159cai.com/index.php?controller=teaminfo&lid="+u.items.lid+"&sid="+u.items.sid+"&tid="+u.items.htid);
                       	    Y.get("#gn"+u.items.xid).attr("href","http://info.159cai.com/index.php?controller=teaminfo&lid="+u.items.lid+"&sid="+u.items.sid+"&tid="+u.items.gtid);
                    	    Y.get("#ox"+u.items.xid).attr("href","http://info.159cai.com/index.php?controller=analysis&action=index&mid="+u.items.oddsmid+"&sit=4&lotyid=6");
                    	    Y.get("#oz"+u.items.xid).attr("href","http://odds.159cai.com/index.php?controller=detail&action=index&mid="+u.items.oddsmid+"&sit=1&lotyid=6");
                    	    Y.get("#oh"+u.items.xid).html(u.items.oh);
        					Y.get("#od"+u.items.xid).html(u.items.od);
        					Y.get("#oa"+u.items.xid).html(u.items.oa);
                     });                     
        		}
				});
	},
	otherEvents: function (){
		//显示截止时间或者开赛时间
		var endTime = Yobj.get('#vsTable span.end_time'),
			matchTime = Yobj.get('#vsTable span.match_time');
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
			Yobj.get('#dshelp').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
		});
		Yobj.use('mask', function (){
			Yobj.get('#wfhelp').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
		});
		//解决右边的小图标浮在选择层上的bug
		Yobj.get('#main > div.dc_l').setStyle('zIndex', 5);
	},
	createClass: function (){
		var selector = new Yobj.lib.Selector(),
			codeList = new Yobj.lib.CodeList(),
			ggTypeBox = new Yobj.lib.GgType(),
			buy = new Yobj.lib.Buy('#project_form'),
			algo = new Yobj.lib.Algo(),
			splitView = new Yobj.lib.SplitView(),
			lgFilter = new Yobj.lib.LgFilter();
			this.lib.ScrollStill();

		selector.onchange = function (bid){
			codeList.syncSelector(bid);//选择器变化时， 同步到号码框
		};

		selector.oninit = function (){
			codeList.addBaseTr(this.vsList);//创建对应的选项到号码框
		};

		codeList.onchange = function (bid){
			selector.setCode(bid);//号码列表变动时， 选择器同步
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