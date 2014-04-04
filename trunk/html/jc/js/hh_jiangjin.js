//工具
	//定位组合的注数
	Math.a = function (A2){
		var ret = 1;
		for (var i = 0, j = A2.length; i < j; i++) {
			ret *= A2[i].length;
		}
		return j ? ret :0;
	};

	//二维数组的定位组合
	Math.al = function (A2, fn){
		var n = 0,
			codes = [],
			code = [],
			isTest = typeof fn == 'function',
			stop;	
		each(A2, n);
		function each(A2, n){
			if (stop || n >= A2.length) {
				if (isTest && false === fn(code)) {
					stop = true;
				}else{
					codes.push(code.slice());
					code.length = n - 1;				
				}
			}else{
				var cur = A2[n];
				for (var i = 0, j = cur.length; i < j; i++) {
					code.push(cur[i]);
					each(A2, n+1);
				}
				if (n) {
					code.length = n - 1;
				}
			}
		}
		return codes;
	};

	Math.cl = function(arr, n, z) { // z is max count
		var r = [];
		fn([], arr, n);
		return r;
		function fn(t, a, n) {
			if (n === 0 || z && r.length == z) {
				return r[r.length] = t;
			}
			for (var i = 0, l = a.length - n; i <= l; i++) {
				if (!z || r.length < z) {
					var b = t.slice();
					b.push(a[i]);
					fn(b, a.slice(i + 1), n - 1);
				}
			}
		}
	};
	sort= function(a, ad){
		var f = ad!="desc" ? function(a,b){return a-b} : function(a,b){return b-a};
		return a.sort(f);
	};
	Math.newRound = function(n) {
		if (/\d+\.\d\d5/.test(n.toString())) {
			var match_ret = n.toString().match(/\d+\.\d(\d)/);
			if (match_ret[1] % 2 == 1) {
				return parseFloat(n).toFixed(2);
			} else {
				return match_ret[0];
			}
		} else {
			return parseFloat(n).toFixed(2);
		}
	};
	var algo="";
	void(function() {

		/** 
		* 连乘
		*/
		function getTran() {
			var a = [].slice.call(arguments),
			t = 1,
			n = 10000;
			if (!a.length) return 0;
			while (a.length) t *= (parseFloat(a.pop()) * n) / n;
			return t
		}
		/** 
		* 从arr中取n个组合
		*/
		function getClTran(arr, n, noLC) {
			var r = [],
			sum = 0;
			(function f(t, a, n) {
				if (n == 0) return r.push(t);
				for (var i = 0, l = a.length - n; i <= l; i++) {
					f(t.concat(a[i]), a.slice(i + 1), n - 1);
				}
			})([], arr, n);
			if (noLC) return r; //返回一个组合数组[[],[],[]]
			for (var i = r.length; i--;) sum += get1(r[i]); //计算每个组合的连乘的和
			return sum;
		}
		//对数组进行连乘
		function get1(arr) {
			return getTran.apply(null, arr) || 0
		} //一个基本串+(n-1)个串一[跳到CL进行拆分然后求单组的和]
		function get2(arr) {
			return get1(arr) + getClTran(arr, arr.length - 1)
		}
		function get3(arr) {
			return get2(arr) + getClTran(arr, arr.length - 2)
		}
		function get4(arr) {
			return get3(arr) + getClTran(arr, arr.length - 3)
		}
		function get5(arr) {
			return get4(arr) + getClTran(arr, arr.length - 4)
		} //n-4 -> n
		function get7_2(arr) {
			return get5(arr) + getClTran(arr, arr.length - 5)
		}
		function get8_2(arr) {
			return get7_2(arr) + getClTran(arr, arr.length - 6)
		}
		function get6(arr) {
			return getClTran(arr, arr.length - 1)
		}
		function get7(arr) {
			return getClTran(arr, arr.length - 2)
		}
		function get8(arr) {
			return getClTran(arr, arr.length - 3)
		}
		function get9(arr) {
			return getClTran(arr, arr.length - 4)
		}
		/** 
		* arr: [3,2,2,1]
		* ggType: 选赛果个数长度必须是n, 'n串m'
		*/
		function getZs(arr, ggType) {
			switch (ggType) {
			case '单关':
			case '2串1':
			case '3串1':
			case '4串1':
			case '5串1':
			case '6串1':
			case '7串1':
			case '8串1':
			case '9串1':
			case '10串1':
			case '11串1':
			case '12串1':
			case '13串1':
			case '14串1':
			case '15串1':
				return get1(arr); //n, 串1直接连乘
			case '3串4':
			case '4串5':
			case '5串6':
			case '6串7':
			case '7串8':
			case '8串9':
				return get2(arr); // n, n-1
			case '4串11':
			case '5串16':
			case '6串22':
				return get3(arr); //n, n-1, n-2
			case '5串26':
			case '6串42':
				return get4(arr); //n, n-1, n-2, n-3
			case '6串57':
				return get5(arr); //n, n-1, n-2, n-3, n-4
			case '7串120':
				return get7_2(arr); //n, n-1, n-2, n-3, n-4, n-5
			case '8串247':
				return get8_2(arr); //n, n-1, n-2, n-3, n-4, n-5, n-6
			case '3串3':
			case '4串4':
			case '5串5':
			case '6串6':
			case '7串7':
			case '8串8':
				return get6(arr); // n-1
			case '4串6':
			case '7串21':
			case '8串28':
				return get7(arr); //n-2
			case '5串10':
			case '6串20':
			case '7串35':
			case '8串56':
				return get8(arr); //n-3
			case '5串20':
				return get8(arr) + get7(arr); //n-2, n-3
			case '6串15':
			case '8串70':
				return get9(arr); //n-4
			case '6串35':
				return get8(arr) + get9(arr); //n-3, n-4
			case '6串50':
				return get8(arr) + get7(arr) + get9(arr); //n-2, n-3, n-4
			default:
				return 0;
			}
		}
		/** 
		* 根据对阵个数数组和过关方式数组，求出注数
		* 过关与自由(多串), 不包括胆拖。
		* selectArr: [2,1,3,2] 所选每场项目个数
		* ggType: '2串1' 过关方式
		*/
		Math.m = function(selectArr, ggType) {
			var zs = 0,
				n = parseInt(ggType) || 1,
				cl = Math.cl(selectArr, n);
			for (var i = cl.length; i--;) {
				zs += getZs(cl[i], ggType);
			}
			return zs;
		};
	}());

	//转换为整数输入框
	Class.extend('createIntInput', function (input, fn, max){
		this.get(input).keyup(check).blur(check).focus(function (){
			setTimeout((function() {
				this.select()
			}).proxy(this),10);
		});
		function check(e, Y){
			var val = Math.max(1, Math.min(parseInt(this.value||0, 10)||0, max || Number.MAX_VALUE));
			if (this.value == ''){
				if(e.type != 'keyup') {
					this.value = val
				}                
			}else if(val != this.value){
				this.value = val
			}
			if (this.value != this.preValue) {
				 fn.call(this, e, Y);
				 this.preValue = this.value
			}
		}
	});

Class('BaseAlgo', {
	single: true,
	onoverflow: Yobj.getNoop(), //超出最大限制注数
	overflowErr: false,
	zs: 0,
	maxPrize: 0,
	maxZs: 100000,
	__isSingleType: function (arr){//检查是不是单一玩法
		return /^[\d\.]+\-(\w+)(?:,[\d\.]+\-\1)+$/.test(arr.join(','));
	},	
	update: function (){
	},
	getCount: function (){
	},
	getMaxPrize: function (){
	},
	splitMap: {
		'单关':['单关'],
		'2串1':['2串1'],
		'3串1':['3串1'],
		'4串1':['4串1'],
		'5串1':['5串1'],
		'6串1':['6串1'],
		'7串1':['7串1'],
		'8串1':['8串1'], 
		'3串3':['2串1'],
		'3串4':['2串1','3串1'],
		'4串6':['2串1'],
		'4串11':['2串1','3串1','4串1'],
		'5串10':['2串1'],
		'5串20':['2串1','3串1'],
		'5串26':['2串1','3串1','4串1','5串1'],
		'6串15':['2串1'],
		'6串35':['2串1','3串1'],
		'6串50':['2串1','3串1','4串1'],
		'6串57':['2串1','3串1','4串1','5串1','6串1'],
		'4串4':['3串1'],
		'4串5':['3串1','4串1'],
		'5串16':['3串1','4串1','5串1'],
		'6串20':['3串1'],
		'6串42':['3串1','4串1','5串1','6串1'],
		'5串5':['4串1'],
		'5串6':['4串1','5串1'],
		'6串22':['4串1','5串1','6串1'],
		'6串6':['5串1'],
		'6串7':['5串1','6串1'],
		'7串7' : ['6串1'],
		'7串8' : ['6串1', '7串1'],
		'7串21' : ['5串1'],
		'7串35' : ['4串1'],
		'7串120': ['2串1', '3串1', '4串1', '5串1', '6串1', '7串1'],
		'8串8' : ['7串1'],
		'8串9' : ['7串1', '8串1'],
		'8串28' : ['6串1'],
		'8串56' : ['5串1'],
		'8串70' : ['4串1'],
		'8串247': ['2串1', '3串1', '4串1', '5串1', '6串1', '7串1', '8串1']
	}
});

/*注数与奖金范围, 依赖ggTypeBox提供数据
*************************************************************************/
Class('BaseAlgo>Algo', {
	//外部驱动注数与奖金的同步变化, 自由遍历串一合计
	update: function (ggTypeBox){
		var zs = 0, maxPrize = 0, minPrize = 0,
			ggTypes = ggTypeBox.ggTypes,
			ggType;
		ggTypeBox  = Yobj.mix({}, ggTypeBox);//防止即时求最大奖金时没有这两个属性
	    ggTypeBox.minCodes = ggTypeBox.minCodes || ggTypeBox.codes;
	    ggTypeBox.maxCodes = ggTypeBox.maxCodes || ggTypeBox.codes;
		if (ggTypes.length) {
			if (ggTypeBox.mode == 'multi') {
				ggType = ggTypes[0];
				zs = this.getCount(ggTypeBox, ggType);
				maxPrize = this.getMaxPrize(ggTypeBox, ggType);
				//最小奖金
				minPrize = this.getMinPrize(ggTypeBox, ggType);
			}else{//如果是自由， 每个串1当成多串计算
				var minGgType, type;
				for (var i = 0, j = ggTypes.length; i < j; i++) {
					type = ggTypes[i];
					if (minGgType) {
						minGgType = parseInt(minGgType) < parseInt(type) ? minGgType : type;
					}else{
						minGgType = type;
					}
					zs += this.getCount(ggTypeBox, type);
					maxPrize += this.getMaxPrize(ggTypeBox, type);
				}
				//最小奖金
				minPrize = this.getMinPrize(ggTypeBox, minGgType);
			}
		}
		//输出
		if (!this.overflowErr) {
			this.zs = zs;
			this.maxPrize = maxPrize*2;
			this.minPrize = minPrize*2;
		}
	},
	//使用Math.cl->Math.al->Math.m计算注数或者奖金
	getCount: function (ggTypeBox, ggType, prizeList, isMinPrize){
		var mix = false,
			zs = 0,
			maxPrize = 0,
			_self = this,
			only_mix = ggTypeBox.only_mix,
			n = parseInt(ggType),
			kill = this.__isSingleType,
			target = prizeList || ggTypeBox.selOpts;//看是算奖金还是注数
		if (!prizeList) {
			this.overflowErr = false;
		}
		var group = Math.cl(target, n);//分成过关组
		var singlePlayTypeGroup = [];
		group.each(function (g){//单一玩法组
			var sg = Math.al(g);
			if (only_mix) {//只玩混串， 要过滤, 每个串结构是  num-type, 在计算数值的时候会 parseFloat();
				sg = sg.filter(function (g){
					return !kill(g);//只收集不干掉的
				});
			}
			singlePlayTypeGroup = singlePlayTypeGroup.concat(sg);
		});		
		var prizes = [];
		//如果是多串， 找到组合中最小的子玩法进行再计算
		if (ggTypeBox.mode == 'multi' && isMinPrize) {
			var minType = this.splitMap[ggType];
			if (minType) {
				minType.sort(function (a, b){
					return parseInt(a) > parseInt(b) ? 1 : -1
				});
				type  =minType[0];
				function up(a, b){
					return parseFloat(a) > parseFloat(b) ? 1 : -1;
				}
				var len = parseInt(type);
				singlePlayTypeGroup.each(function (g){
					//按玩法n串剪切出n个来算, g是一个奖金组 ["1.4-spf","23-jqs","8-bqc"]
					var _zs = Math.m(g.sort(up).slice(0, len), type);//([1,2,2], '3串4')
					prizes.push(_zs);//用来计算最小奖金
				});
			}
		}else{//自由算最小与最大奖金, 或者多串的最大奖金与注数
			singlePlayTypeGroup.each(function (g){
				var _zs = Math.m(g, ggType);//([1,2,2], '3串4')
				prizes.push(_zs);//用来计算自由的最小奖金
				zs += _zs;
				var overflow = zs >  _self.maxZs;
				if (overflow && !prizeList) {//如果注数大于， 而且不是算奖金的时候
					_self.overflowErr = true;
					_self.onoverflow(zs);//超出最大注数
					return false;
				}
			});
		}
		if (isMinPrize) {
			zs = prizes.sort(function (a, b){
				return a > b ? 1 : -1;
			}).slice(0, ggTypeBox.minZs || 1).reduce(function (sum, n){//计算非弹出最大最小时 minZs没有传
				return sum + n;
			}, 0);
		}
		return  zs;
	},
	//计算理论最高奖金
	getMaxPrize: function (ggTypeBox, ggType){
		var prizes = [];
		ggTypeBox.maxCodes.each(function (arr){
			var code = arr.map(function (obj){
				return Math.max.apply(Math, obj.prize) + '-' + obj.type;// 最高sp值
			});
			prizes.push(code);
		});
		//把它转换成注数的计算模式
		var pri = this.getCount(ggTypeBox, ggType, prizes);
		return parseFloat(Math.newRound(pri));
	},
	//计算理论最小奖金
	getMinPrize: function (ggTypeBox, ggTypes){
		var prizes = [];
		ggTypeBox.minCodes.each(function (arr){
			var code = arr.map(function (obj){
				return Math.min.apply(Math, obj.prize) + '-' + obj.type;// 最低sp值
			});
			prizes.push(code);
		});
		//把它转换成注数的计算模式
		var pri = this.getCount(ggTypeBox, ggTypes, prizes, true);//true 意味计算最小的奖金
		return parseFloat(Math.newRound(pri));
	},
	//使用号码字符串计算注数和奖金范围
	fromCodes: function (codestr, ggTypes, isDelete){
		var objs = {},
			codes = [],
			parse = /^(\d+)\|\d+\|(\d+)\[([^\]]+)\]$/;
		(codestr+'').split('/').each(function (str){//10240|5301|274[2#1.54]
			var info = str.match(parse);
			if (info) {
				var mid = info[1], obj;
				if (!(mid in objs)) {
					objs[mid] = [];
				}
				obj = objs[mid];
				obj.push({
					id: mid,
					type: info[2],
					prize: info[3].replace(/[^,#]+#/g, '').split(',')
				});
			}
		});
		for(var k in objs){
			codes.push(objs[k]);
		}
		var data = {
			mode: isDelete ? '' : 'multi',
			ggTypes: ggTypes,
			only_mix: true,
			selOpts: [],
			codes: codes
		};
		this.update(data);
	}
});

/*拆分明细的奖金计算
Math.cl --> Math.al --> Math.m
*************************************************************************/
Class('Algo>SplitAlgo', {
});

//拆分明细
Class('SplitView', {
	use: 'mask',
	codeInfo: [],
	ggtype: [],
	index: function (){
		//return;
		var $this = this;
		this.createDlg();
		Yobj.get('#seemore').show().click(function (){
			$this.showView();
		});
		this.algo = new Yobj.lib.SplitAlgo();
	},
	createDlg: function (){
		this.dlg = this.lib.MaskLay('#blk1');
        this.dlg.addClose('#close1');
		Yobj.get('#blk1 div.tantop').drag(this.get('#blk1'));
        this.dlg.panel.find('div.tan_mid').setStyle('height:470px; overflow-y:auto; overflow-x:hidden; _width:632px');
	},
	splitSort: function (a, b){
		return a.prizeSum > b.prizeSum ? 1 : -1;
	},
	showView: function (){
		var err, my = this;
		if (this.codeInfo.length === 0) {
			Yobj.alert('请至少选择两场比赛');
		}else if(this.maxggtype === 0){
			Yobj.alert('请至少选择两个不同的玩法');
		}else if(this.ggtype.length === 0){
			Yobj.alert('请选择过关方式');
		}else{
			this.codes.each(function (obj, i){
				var minPrize = [];//用最小的优先做排序标准!!!
				obj.each(function (o){
					minPrize = minPrize.concat(o.prize);
				});
				obj.index = i;
				obj.prizeSum = Math.min.apply(Math, minPrize);
			});
			this.codes.sort(this.splitSort);
			var selOpts = [];
			this.codes.each(function (obj, i){
				selOpts[i] = my.selOpts[obj.index];
			});
			this.selOpts = selOpts;
			Yobj.get('#tz_fenbu').html(this.getSelectView());
			Yobj.get('#hot_case').html(this.getPrizeView());
			this.dlg.pop();			
		}
	},
	getPrizeView: function (){
		var splitMap = this.algo.splitMap;
		var ggtype = this.ggtype.reduce(function (all, cur){
			return all.concat(splitMap[cur]);//拆分n串m表头
		}, []);
		var ggtypeHtml = ggtype.map(function (s){
			return '<td>' + s + '</td>';
		});
		var minHit = parseInt(this.ggtype[0]);//假设命中场次的下限
		if (this.ggtype[0].indexOf('串1') == -1) {
			minHit = this.algo.splitMap[this.ggtype[0]].reduce(function (min, r){
				return parseInt(r) < min ? parseInt(r) : min;
			}, 100)
		}
		var title = '<tr><td rowspan="2" class="td1" width="60">命中场数</td><td colspan="'+ggtypeHtml.length+'" class="td2">中奖注数/注</td><td rowspan="2" class="td1" width="60">倍数</td><td class="td2" colspan=2>奖金范围</td></tr><tr class="trone">'+ggtypeHtml.join('')+'<td>最小奖金</td><td class="last_td">最大奖金</td></tr>';
		var tr = '<tr><td>{$hitCount}</td>{$splitZS}<td>'+this.bs+'</td><td>{$minPrize}</td><td style="color:red">{$maxPrize}</td></tr>';
		var html = [''];
		html.push(title);
		
		var snyMaxMin = Yobj.get('#prix_range').html().match(/[0-9\.,]+/g);
	var mi = Math.min, ma = Math.max;
	this.codes.each(function (vs, i){
		var maxPl = 0, minPl = 9999;
		//多个玩法
		vs.each(function (o){
			//多个选项
			minPl = mi(minPl, mi.apply(Math, o.prize));
			maxPl = ma(maxPl, ma.apply(Math, o.prize));
		});
		vs.minPl = minPl;
		vs.maxPl = maxPl;
	});
		this.upsotrCodes = this.codes.slice().sort(function (a, b){//升序排列, 用于计算最低奖金
			return a.minPl > b.minPl ? 1 : -1;
		});
		this.downsortCodes = this.codes.slice().sort(function (a, b){//降序排列, 用于计算最高奖金*/
			return a.maxPl < b.maxPl ? 1 : -1;
		});
		for (var i =  this.codes.length; i >= minHit; i--) {//假设命中n场
			var detail =  this.getSplitZSView(i, ggtype);
			detail.hitCount = i;
			if (i === this.codes.length) {//保证上下限一致
				detail.maxPrize = (snyMaxMin[1]+'').replace(/,/g,'');
			}else if(i === minHit){
				detail.minPrize = snyMaxMin[0];
			}
			html.push(tr.tpl(detail));			
		}
		html.push('<tr><td style="text-align:center;" colspan=10>注：中奖注数命中区间表示同1场比赛不同玩法同时命中的情况。</td></tr>');
		return html.join('');
	},
	getSplitZSView: function (hit, types, data){//假设命中多少场, 返回各个过关方式的注数
		var algo = new Yobj.lib.SplitAlgo(),
			detail = {},
			min=0,
			max = 0,
			data = {
				mode: this.mode,
				ggTypes: this.ggTypes,
				only_mix: this.only_mix,
				selOpts: this.selOpts.slice(0, hit),
				codes: this.codes.slice(0, hit),
				minCodes: this.upsotrCodes.slice(0, hit),
			    maxCodes: this.downsortCodes.slice(0, hit)
			};
		detail.splitZS = types.map(function (ggtype){//n串m
			var minZs = Math.c(hit, parseInt(ggtype));
			algo.update({
				minZs: minZs,
				ggTypes: [ggtype],
				mode: data.mode,
				only_mix: this.mode == 'multi' ? false : data.only_mix,//多串计算命中部分时不去除单一
				selOpts: data.selOpts,
				codes: data.codes,
				minCodes: data.minCodes,
				maxCodes:data.maxCodes
			});
			if (algo.zs) {
				min+=algo.minPrize;//每个过关方式取一个
				max+=algo.maxPrize;				
			}
			return '<td>' + (algo.zs ? (minZs == algo.zs ? minZs : (minZs +'-'+algo.zs)) : 0) + '</td>';
		}).join('');
		detail.minPrize = (min*this.bs).toFixed(2);
		detail.maxPrize = (max*this.bs).toFixed(2);
		return detail;
	},
	getSelectView: function (){
		var tmpl = '<tr><td>{$index}</td><td>{$vs}</td><td class="tl">{$codes}</td><td>{$min}</td><td>{$max}</td></tr>';
		var html = ['<tr><td width="65">赛事编号</td><td width="153">对阵</td><td width="210">投注选项(奖金)</td><td>最小奖金</td><td class="last_th">最大奖金</td></tr>'];
		for (var i = 0, j = this.codeInfo.length; i < j; i++) {
			var info = this.codeInfo[i];
			html.push(tmpl.tpl(info));
		}
		html.push('<tr class="last_tr"><td colspan="5" class="last_td">过关方式：<span class="red">'+this.ggtype+'</span> 倍数：<span class="red">'+this.bs+'</span>倍 方案总金额：<span class="red">'+this.money+'</span>元</td></tr>');
		return html.join('');
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