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
	Math.alll = function (A1) {
        var ret = 1;
        for(var i = 0, j = A1.length; i < j; i++) {
            ret *= A1[i];
        }
        return j ? ret : 0;
    };
    var isFn = _type('Function'), isFunction = function (s) {
        return isFn(s) && s.call;
    };
    function _type(t) {
        return function (s) {
            return _toString.call(s) === '[object ' + t + ']';
        };
    };
	Math.all = function (A2, fn){
		
        var n = 0, codes = [], code = [], isTest = Y.isFunction(fn);;
        function each(A2, n) {
            if(n >= A2.length) {
                if(!isTest || false !== fn(code)) {
                    codes.push(code.slice());
                }
                code.length = n - 1;
            } else {
                var cur = A2[n];
                for(var i = 0, j = cur.length; i < j; i++) {
                    code.push(cur[i]);
                    each(A2, n + 1);
                }
                if(n) {
                    code.length = n - 1;
                }
            }
        }
        if(A2.length) {
            each(A2, n);
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
	/** 
		四舍六入五进双 
	*/ 
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
	_getDcSplit: function(){
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
	},
	 showSplitMap:{
         '2串1':{'2串1':1},
         '3串1':{'3串1':1},
         '4串1':{'4串1':1},
         '5串1':{'5串1':1},
         '6串1':{'6串1':1},
			'7串1':{'7串1':1},
			'8串1':{'8串1':1}, 
         '3串3':{'2串1':3},
         '3串4':{'3串1':1,'2串1':3},
         '4串6':{'2串1':6},
         '4串11':{'4串1':1,'3串1':4,'2串1':6},
         '5串10':{'2串1':10},
         '5串20':{'2串1':10,'3串1':10},
         '5串26':{'5串1':1,'4串1':5,'3串1':10,'2串1':10},
         '6串15':{'2串1':15},
         '6串35':{'2串1':15,'3串1':20},
         '6串50':{'2串1':15,'3串1':20,'4串1':15},
         '6串57':{'6串1':1,'5串1':6,'4串1':15,'3串1':20,'2串1':15},
         '4串4':{'3串1':4},
         '4串5':{'4串1':1,'3串1':4},
         '5串16':{'5串1':1,'4串1':5,'3串1':10},
         '6串20':{'3串1':20},
         '6串42':{'6串1':1,'5串1':6,'4串1':15,'3串1':20},
         '5串5':{'4串1':5},
         '5串6':{'5串1':1,'4串1':5},
         '6串22':{'6串1':1,'5串1':6,'4串1':15},
         '6串6':{'5串1':6},
         '6串7':{'6串1':1,'5串1':6},
			'7串7' : {'6串1':7},
			'7串8' : {'6串1':7, '7串1':1},
			'7串21' : {'5串1':21},
			'7串35' : {'4串1':35},
			'7串120': {'2串1':21, '3串1':35, '4串1':35, '5串1':21, '6串1':7, '7串1':1},
			'8串8' : {'7串1':8},
			'8串9' : {'7串1':8, '8串1':1},
			'8串28' : {'6串1':28},
			'8串56' : {'5串1':56},
			'8串70' : {'4串1':70},
			'8串247': {'2串1':28, '3串1':56, '4串1':70, '5串1':56, '6串1':28, '7串1':8, '8串1':1}
		}
});

/*注数与奖金范围, 依赖ggTypeBox提供数据
*************************************************************************/
Class('BaseAlgo>Algo', {
	index: function(){
		this.onMsg('msg_dc_split', function (dc){
        	var tmp = [],str = '',obj = this._getDcSplit(dc);
        	 for(var k in obj){//命中表头
                 tmp[tmp.length] = k;
             }
        	 tmp.sort(function (a, b){
                 return parseInt(a)> parseInt(b)? 1 : -1
             });
        	 for(var i=0; i<tmp.length; i++){
//        		 str += tmp[i]+'*'+obj[tmp[i]];
        		 str += obj[tmp[i]]+"个"+tmp[i]
        		 if(i!=tmp.length-1){
        			 str+='+';
        		 }
        	 }
        	 if(dc){
        		 Y.get('#ch_desc>em').html(dc+"="+str);
            	 Y.get('#ch_desc').show();
        	 }
        });
		var algo = this, len = 0;
		this.allBf = [];
		this.bfCheckMap = {};
		for (var i = 0; i<6;i++) {
			for (var j = 0;j<6; j++) {
				if (i==3 && j > 3 || i > 3 && j > 2) {continue;}
				this.allBf[len++]= {
					name: i+''+j,
					sum: i+j,
					diff: Math.abs(i-j),
					spf: i>j ? 3 : (i<j ? 0 : 1)
				};
			}
		}
		this.allBf.push({name: '3A',sum: 7, spf: 3}, {name: '1A',sum: 7,spf: 1},{name: '0A',sum: 7,spf: 0});
		for (i = this.allBf.length; i--;) {
			var conf = this.allBf[i], item = {}, jqs = conf.sum, spf = conf.spf;
			item['bf-'+conf.name] = 1;
			item['jqs-'+jqs]=1;
			item['nspf-'+spf]=1;
			if (spf === 3) {
				if (jqs>2) {item['bqc-03']=1;}
				item['bqc-13']=1;
				item['bqc-33']=1;
			}else if(spf===1){
				if (jqs>1) {
				item['bqc-01']=1;
				item['bqc-31']=1;
				}
				item['bqc-11']=1;
			}else if(spf===0){
				item['bqc-00']=1;
				item['bqc-10']=1;
				if (jqs>2) {item['bqc-30']=1;}
			}
			this.bfCheckMap[conf.name] = item;
		} 
	},
	
	//外部驱动注数与奖金的同步变化, 自由遍历串一合计
	update: function (ggTypeBox){
		var zs = 0, maxPrize = 0, minPrize = 0,mp = 0 ,
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
				var opt = [];
				ggTypeBox.codes.each(function (arr){
					var isdan = false;
					var code = arr.map(function (obj){
						if(obj.dan){
							isdan = true;
						}
						if(obj.type == 'bf'){
							for(var i = 0; i<obj.code.length;i++){
								if(obj.code[i] == '0'){
								    obj.code[i] = '0A';
								}else if(obj.code[i] == '1'){
									obj.code[i] = '1A';
								}else if(obj.code[i] == '3'){
									obj.code[i] = '3A';
								}
							}
						}
						if(obj.type == 'rqspf'){
							return 'spf-' + obj.code + (obj.rq>0 ? '@+': '@') + obj.rq + '#' + obj.prize;// 最低sp值
						}else if(obj.type == 'spf'){
							return 'nspf-' + obj.code + '#' + obj.prize;// 最低sp值
						}else{
							return obj.type +'-' + obj.code + '#' + obj.prize;// 最低sp值
						}
					});
					if(isdan){
						code.isdan = true; 
					}
				 	opt.push(code);
				}); 
				var opts = this.codeToBonunStr(opt);//500
				Class.C('opts',opts);
				
				
		        var dl = [], tl = [], Y = this;
		        this.forEach(opts, function (lc) {
		            var gc = Y.getPlayNum(lc);
		            gc.isdan = lc.indexOf('D') > -1;
		            if(gc.isdan) {
		                dl.push(gc);
		            } else {
		                tl.push(gc);
		            }
		        });
		        this.forEach(ggTypes, function (type) {
		            zs += Y.getCodesCount(dl, tl, type, ggTypeBox.only_mix);
		        }, this);
				//最小奖金
				minPrize = this.getMinPrize(ggTypeBox, minGgType);
				maxPrize = this.showMoney(opts, ggTypes);//500
			}
		}
		//输出
		if (!this.overflowErr) {
			this.zs = zs;
			this.maxPrize = maxPrize;
			this.minPrize = minPrize*2;
		}
	},
	getPlayNum:function (code) {
        return this.map(code.split('|'), function (plays) {
            return plays.split(',').length + '-' + plays.split('-')[0];
        });
    },
    getCodesCount:function (d, t, n, del) {
        var Y = this, nm = this.parseNM(n), group = Math.dtl(d, t, nm[0]);
        return Y.reduce(group, function (zs, g) {
        	var al = '';
        	if(del){
        		al = Math.all(g, function(c){
    				var flag = '-' + c[0].split('-')[1];
    				return Y.some(c, function (){return this.indexOf(flag) === -1;});
    			});
        	}else{
        		al =  Math.all(g);
        	}
    		return zs + Y.reduce(al, function (zs, g){return zs + Y.countNM(g, nm[2]);}, 0); 
        }, 0);
    },
    some:function (a, fn, o) {
        for(var i = 0, j = a.length; i < j; i++) {
            if(fn.call(o || a[i], a[i], i, a, j)) {
                return true;
            }
        }
        return false;
    },
    countNM:function (code, n1s) {
    	var Y = this;
        code = this.map(code, function () {
            return Y.intt(this);
        });
        return this.reduce(n1s, function (zs, type) {
            var cl = Math.cl(code, Y.intt(type));
            return zs + Y.reduce(cl, function (zs, g) {
                return zs + Math.alll(g);
            }, 0);
        }, 0);
    },
    map:function (a, f, o) {
        return this.each(a, function (v, k, a, j) {
            this.push(f.call(o || v, v, k, a, j));
        }, []);
    },
	
	//500
	codeToBonunStr: function (opt){//500选的对阵信息
		 var opts = [],Y = this;
		 this.forEach(opt, function (lc){
			 var gc = Y.codeToString(lc);
			 if (this.isdan) {
				 gc+='D';
			 }
			 opts.push(gc);
		 });
		 return opts;
    },
    codeToString: function (codes){
    	var opt = '';
    		for(var i = 0;i<codes.length;i++){
    			if(i != (codes.length-1)){
    				if(codes[i].indexOf(',')  == '-1'){
    					opt += codes[i];
    				}else{
    					var type = codes[i].split('#')[0];
    		    		var prize = codes[i].split('#')[1];
    		    		if(prize.indexOf(',') != '-1'){
    		    			var n = prize.split(',');
    		    			var f = '';
    		    			if(type.indexOf('@') != '-1'){
    		    				var ff = type.split('@');
    		    				var rq = ff[1];
    		    				f = ff[0].split('-');
    		    				var g = f[1].split(',');
        		    			for(var j=0 ; j<n.length ;j++){
        		    				if(j != (n.length-1)){
        		    					opt += f[0] +'-'+ g[j] +'@' +rq+ '#'+ n[j] +',';
        		    				}else{
        		    					opt += f[0] +'-'+ g[j] +'@' +rq+ '#'+ n[j];
        		    				}
        		    			}
    		    				
    		    			}else{
    		    				f = type.split('-');
    		    				var g = f[1].split(',');
        		    			for(var j=0 ; j<n.length ;j++){
        		    				if(j != (n.length-1)){
        		    					opt += f[0] +'-'+ g[j] +'#'+ n[j] +',';
        		    				}else{
        		    					opt += f[0] +'-'+ g[j] +'#'+ n[j];
        		    				}
        		    			}
    		    			}
    		    		}
    				}
    				opt += '|';
    			}else{
    				if(codes[i].indexOf(',')  == '-1'){
    					opt += codes[i];
    				}else{
    					var type = codes[i].split('#')[0];
    		    		var prize = codes[i].split('#')[1];
    		    		if(prize.indexOf(',') != '-1'){
    		    			var n = prize.split(',');
    		    			var f = '';
    		    			if(type.indexOf('@') != '-1'){
    		    				var ff = type.split('@');
    		    				var rq = ff[1];
    		    				f = ff[0].split('-');
    		    				var g = f[1].split(',');
        		    			for(var j=0 ; j<n.length ;j++){
        		    				if(j != (n.length-1)){
        		    					opt += f[0] +'-'+ g[j] +'@' +rq+ '#'+ n[j] +',';
        		    				}else{
        		    					opt += f[0] +'-'+ g[j] +'@' +rq+ '#'+ n[j];
        		    				}
        		    			}
    		    				
    		    			}else{
    		    				f = type.split('-');
    		    				var g = f[1].split(',');
        		    			for(var j=0 ; j<n.length ;j++){
        		    				if(j != (n.length-1)){
        		    					opt += f[0] +'-'+ g[j] +'#'+ n[j] +',';
        		    				}else{
        		    					opt += f[0] +'-'+ g[j] +'#'+ n[j];
        		    				}
        		    			}
    		    			}
    		    		}
    				}
    			}
        	}
    	return opt;
	}, 
    forEach:function(o, f) {
	    if (o) for (var i = 0, j = o.length; i < j; i++) if (!1 === f.call(o[i], o[i], i, o, j)) break;
	    return o;
	},
	
	
	
	showMoney: function (opts, ggType){
		maxMoney = this.getBonusRange(opts, ggType, true);
		return maxMoney;
	}, 
	getBonusRange : function (opts, ggType, noMin){
		if (noMin) {
			return this.getMaxBonus(this.getLimitOpts(opts).max, ggType);
		}
	},
	getLimitOpts:function(opts){
		var Y = this;
		var minOpts=[], maxOpts=[], j = 0;
		this.forEach(opts, function (opt){
			if (opt) {
				var real = Y.getSgBound(opt);
				minOpts[j] = real[0];
				maxOpts[j++] = real[1];
			}
		});
		minOpts.sort(function (a, b){return a.sum > b.sum ? 1 : -1;});
		maxOpts.sort(function (a, b){return a.sum > b.sum ? -1 : 1;});
		return {min: minOpts, max: maxOpts};
	},
	getSgBound:function(str){
		var algo = this;
		var single = str.split('|'), minSum=9e9, maxSum=-1,
		minOpts, maxOpts, minBf, maxBf, dan = str.indexOf('D') > -1;
		if (true) {
			this.forEach(this.allBf, function (bf){
				var optsAl = Math.all(algo.filterInvalidOpts(single, bf)), hits, sum;
				for (var i = 0, j = optsAl.length; i < j; i++) {
					hits = optsAl[i];
					sum = 0;
					for (var k =  hits.length; k--;) {
						hits[k] = parseFloat(hits[k].split('#')[1]);
						sum += hits[k];
					}
					if (sum > maxSum) {maxSum = sum; maxOpts=hits.slice();maxBf = bf.name;}
					if (sum < minSum) {minSum = sum; minOpts=hits.slice();minBf = bf.name;}
				}
			});
		}else{
			var optsAl = str.split(','), sp;
			for (var i = 0, j = optsAl.length; i < j; i++) {
				sp = parseFloat(optsAl[i].split('#')[1]);
				if (sp > maxSum) {maxSum = sp; maxOpts=[sp];}
				if (sp < minSum) {minSum = sp; minOpts=[sp];}
			}
		}
		minOpts.sum = minSum;
		minOpts.bf = minBf;
		maxOpts.sum = maxSum;
		maxOpts.bf = maxBf;
		minOpts.isdan = maxOpts.isdan = dan;
		return [minOpts, maxOpts];
	},
	filterInvalidOpts:function(single, bf){
		var ret  = [], Y = this, len = 0, filter=this.bfCheckMap[bf.name];
		function test(str){
			if (str.indexOf('spf') === 0) {return Y.testRqSpfByBf(str, bf);}
			return str.split('#')[0] in filter;
		}
		for (var i = 0, j = single.length; i < j; i++) {
			var types = single[i].split(',').filter(test);
			if (types.length) {ret[len++] = types;}
		}
		return ret;
	},
	testRqSpfByBf:function(str, bf){
		var rq = parseInt(str.split('#')[0].split('@')[1], 10);
		if (rq > 0) {
			if(bf.name == '0A'){
				if (rq === 1) {
					return str.indexOf('spf-0') === 0 || str.indexOf('spf-1') === 0;
				}
				return str.indexOf('spf-') === 0;
			}
			if (bf.spf < 1) {
				if (rq < bf.diff) {
					return str.indexOf('spf-0') === 0;
				}else if(rq === bf.diff){
					return str.indexOf('spf-1') === 0;
				}
			}
			return str.indexOf('spf-3') === 0;
		}else{
			rq = Math.abs(rq);
			if(bf.name == '3A'){
				if (rq === 1) {
					return str.indexOf('spf-3') === 0 || str.indexOf('spf-1') === 0;
				}
				return str.indexOf('spf-') === 0;
			}
			if (bf.spf>0) {
				if (bf.diff > rq) {
					return str.indexOf('spf-3') === 0;
				}else if(bf.diff === rq){
					return str.indexOf('spf-1') === 0;
				}
			}
			return str.indexOf('spf-0') === 0;
		}		
	},
	getMaxBonus:function (opts, ggType){
		var algo = this;
		if (opts.length < 2 && ggType.indexOf('单关') == -1) {return 0;}
		ggTypes = ggType;
		maxRec = opts;
		return algo.getBonusSum(algo.getHitSingleCodes(opts.length)).bonus;
	},
	getBonusSum:function (list){
		var cl = {}, sum = 0, bs = 1;
		for (var i = 0, j = list.length; i < j; i++) {
			var code = list[i], b = 1, len = code.length;		
			for (var x = code.length; x--;) {b *= code[x];}
			if (b) {
				sum+=Math.round(b*100)/100*2*bs;
				if (!(len in cl)) {cl[len] = 0;}
				cl[len]++;
			}			
		}
		return {bonus: Math.round(sum*100)/100, codeCount: cl};
	},
	getHitSingleCodes:function(n, min){
		var Y = this, list = [], dl = [], tl = [], danSort = min ? minRec.slice() : maxRec.slice(), dir = min ? 1 : -1;
		danSort.sort(function (a, b){
			if (a.isdan === b.isdan) {return (a[0] > b[0] ? 1 : -1)*dir;}
				else{return a.isdan ? -1 : 1;}
		});
		this.forEach(danSort, function (o, i){
			if (i >= n) {
				var t = [0];
				t.isdan = o.isdan;
				t.sum = o.sum;
				o = t;
			}
			if (o.isdan) {dl.push(o);}else{tl.push(o);}
		});
		this.forEach(ggTypes, function (type){list = list.concat(Y.getSigleCodes(dl, tl, type));});
		return list;
	},
	getSigleCodes: function (d, t, n, del){
		var Y = this,nm = this.parseNM(n), group, len = nm[0], diff = len - (d.length + t.length);
		if (nm[1] > 1 && diff > 0) {for (var i =  diff; i--;) {t.push([0]);}}//多串中有子串，用0sp值的补全。
		group = Math.dtl(d, t, len);
		return this.reduce(group, function (codes, g){
			var al = Math.all(g);
			return codes.concat(Y.reduce(al, function (rc, c){return rc.concat(Y.splitNM(c, nm[2]));}, []));
		}, []);
	},
	reduce: function (a, fn, b, o) {
        this.each(a, function (v, k, a, j) {
            if(b === 'undefined') {
                b = v;
            } else {
                b = fn.call(o || v, b, v, k, a, j);
            }
        });
        return b;
    },
    each:function (o, f, z) { return (o && this.arrayLike(o)) ? this.forEach(o, f, z) : this.forIn(o, f, z); },
    splitNM:function(code, n1s){
    	var Y = this;
		return this.reduce(n1s, function (r, type){return r.concat(Math.cl(code, Y.intt(type)));}, []);
	},
	intt:function (n) {
        return parseInt(n, 10);
    },
    parseNM:function (nm){
    	var cache = {},Y = this;
		if (!(nm in cache)) {
			if (nm == '单关') {
				cache[nm] = [1, 1, [1]];
			}else{
				var tmp = Y.trim(nm).split('串');
				cache[nm] = [this.intt(tmp[0]), this.intt(tmp[1]), Y.getN1(nm)];
			}
		}
		return cache[nm];
	},
	trim:function (s) {
		var TRIM_RE = /^\s+|\s+$/g;
        return s.replace(TRIM_RE, '');
    },
    getN1:function (nm){
    	var NM2N1={'1*1':[1],'2*1':[2],'3*1':[3],'4*1':[4],'5*1':[5],'6*1':[6],'7*1':[7],'8*1':[8],'3*3':[2],'3*4':[2,3],'4*6':[2],'4*11':[2,3,4],'5*10':[2],'5*20':[2,3],'5*26':[2,3,4,5],'6*15':[2],'6*35':[2,3],'6*50':[2,3,4],'6*57':[2,3,4,5,6],'4*4':[3],'4*5':[3,4],'5*16':[3,4,5],'6*20':[3],'6*42':[3,4,5,6],'5*5':[4],'5*6':[4,5],'6*22':[4,5,6],'6*6':[5],'6*7':[5,6],'7*7':[6],'7*8':[6,7],'7*21':[5],'7*35':[4],'7*120':[2,3,4,5,6,7],'8*8':[7],'8*9':[7,8],'8*28':[6],'8*56':[5],'8*70':[4],'8*247':[2,3,4,5,6,7,8]};
		if (nm=='单关') {nm='1*1';}else{nm = nm.replace('串','*');}
		return NM2N1[nm];
	},
    arrayLike:function (o) {
        return typeof o === 'object' && isFinite(o.length) && o.nodeType === 'undefined' && o.window !== o;
    },
    has:function(o, k) {
    	var _has = {}.hasOwnProperty;
        return _has.call(o, k);
    },
    forIn:function (o, f, z) {
        var k, i = 0;
        if(o) {
            for(k in o) {
                if(this.has(o, k) && false === f.call(z || o[k], o[k], k, o, i++)) {
                    break;
                }
            }
        }
        return z || o;
    },
	
	getDanCount:function(ggTypeBox, ggType){
		var singlePlayTypeGroup = [], target=ggTypeBox.danselOpts,n = parseInt(ggType),mp=0;
		var group = Math.cl(target, n);
		group.each(function (g){//单一玩法组
			var sg = Math.al(g);
			singlePlayTypeGroup = singlePlayTypeGroup.concat(sg);
		});
		singlePlayTypeGroup.each(function (g){
			var _zs = 0;
			if(ggType == '1串1'){
				_zs = parseInt(g);
			}else{
				_zs = Math.m(g, ggType);
			}
			mp += _zs;
		});
		
		return mp;
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
			var minType = this.splitMap[ggType],type;
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
				var _zs = 0;
				if(ggType == '1串1'){
					_zs = parseInt(g);
				}else{
					_zs = Math.m(g, ggType);
				}
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
				return Math.max.apply(Math, obj.prize) + '-' + obj.type;
			});
			if(Class.C('hh_2x1')){
				if(code.length!=1){
					var aar = [];
					if(code[0].split('-')[0] >code[1].split('-')[0]){
						aar[0] = code[0];
						code= aar;
					}else{
						aar[0] = code[1];
						code= aar;
					}
				}
			}
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
	},
	_getDcSplit: function(dc){
    	var ggtype, curGg = dc;
    	if (this.isString(curGg)) {//如果是多串(固定组合)过关,先进行转换
            ggtype = this.showSplitMap[curGg];
        }
    	return ggtype;
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
		
		this.onMsg('msg_hit_split', function (el, n, isMax){//命中场数, 是否是求最大sp
			var btn = this.get(el);
			if (btn.html().indexOf('明细') > -1) {
				btn.parent('table').find('span').show().html('(明细)').setStyle('color:#005ebb');
				btn.html('(收起)').setStyle('color:red');
				this.showMx(n, isMax);
//				this.get('#hit_split').html('nimei');
			}else{//点击'收起'
				btn.parent('table').find('span').show().html('(明细)').setStyle('color:#005ebb');
				
				this.hideMx();
//				this.get('#hit_split').html('');
			}
		});
		var algo = this, len = 0;
		this.allBf = [];
		this.bfCheckMap = {};
		for (var i = 0; i<6;i++) {
			for (var j = 0;j<6; j++) {
				if (i==3 && j > 3 || i > 3 && j > 2) {continue;}
				this.allBf[len++]= {
					name: i+''+j,
					sum: i+j,
					diff: Math.abs(i-j),
					spf: i>j ? 3 : (i<j ? 0 : 1)
				};
			}
		}
		this.allBf.push({name: '3A',sum: 7, spf: 3}, {name: '1A',sum: 7,spf: 1},{name: '0A',sum: 7,spf: 0});
		for (i = this.allBf.length; i--;) {
			var conf = this.allBf[i], item = {}, jqs = conf.sum, spf = conf.spf;
			item['bf-'+conf.name] = 1;
			item['jqs-'+jqs]=1;
			item['nspf-'+spf]=1;
			if (spf === 3) {
				if (jqs>2) {item['bqc-03']=1;}
				item['bqc-13']=1;
				item['bqc-33']=1;
			}else if(spf===1){
				if (jqs>1) {
				item['bqc-01']=1;
				item['bqc-31']=1;
				}
				item['bqc-11']=1;
			}else if(spf===0){
				item['bqc-00']=1;
				item['bqc-10']=1;
				if (jqs>2) {item['bqc-30']=1;}
			}
			this.bfCheckMap[conf.name] = item;
		} 
	},
	showMx: function (n, isMax){
		this.get('#hit_split').show();
		this.createSplitTable(n, isMax);
	},
	hideMx: function (){this.get('#hit_split').hide();},
	createSplitTable: function (hit_num, isMax){//显示sp明细 点明细的时候触发
		var title = '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="table-layout:fixed">'+
        '<tr><td width="65">过关方式</td><td width="65">中奖注数</td>'+
		'<td>中{$n}场 最{$dx}奖金 中奖明细</td><td width="80" class="last_th">奖金</td></tr>';
		
		var detail = [], html = [];
		detail.n = hit_num;
		detail.dx = isMax ? '大' : '小';
		html.push(title.tpl(detail));
		
			info = this.get_mx_list(hit_num, isMax, '#005ebb');
		html.push(this.code2Html(info.rows));
		html.push(this.stringf(info));
		
		this.get('#hit_split').html(html.join(''));
	},
	code2Html: function (data){
		var html = [], tr = '<tr>{$col}<td class="tl">{$all_dz}</td>'+
        '<td class="last_td"><span class="red">{$n1_m}元</span></td></tr>';
		this.map(data, function (r, i){
			var trr = [];
			trr.col = '<td>'+r.type+'串1</td><td>'+r.zs+'注</td>';
			trr.all_dz = r.split;
			trr.n1_m = r.money;
			html.push(tr.tpl(trr));
		});
		return html;
	},
	stringf: function (data){
		var html = '<tr><td>合  计</td><td>'+data.zs+'注</td><td class="tl">&nbsp;</td><td class="last_td"><span class="red">'+data.money+'元</span></td></tr><tr class="last_tr"></tr></table>';
		return html;
	},
	get_mx_list: function (hit_num, isMax, color){
		var Y = this, cc = cache[hit_num], data = isMax ? cc[2] : cc[0], list = [],
			cl = {}, sum = 0, bs = Y.bs;
		color = color || '#005ebb';
		for (var i = 0, j = data.length; i < j; i++) {
			var code = data[i], b = 1, len = code.length, txt = code.join('×'), m=0;
			for (var x = code.length; x--;) {b *= code[x];}
			if (b) {
				m=Math.round(b*100)/100*2*bs;
				sum+=m;
				if (!(len in cl)) {cl[len] = [];cl[len].sum=0;}
				cl[len].push(txt+'×'+bs+'倍×2=<strong style="color:'+color+'">'+m.toFixed(2)+'</strong>');
				cl[len].sum+=m;
			}			
		}
		for(var k in cl){list.push([k-0, cl[k]]);}
		list.sort(function (a, b){return a[0] > b[0] ? -1 : 1;});
		list = Y.map(list, function (r, i){
			return {
				type: r[0],
				zs: r[1].length,
				split: r[1].join('<br>'),
				money: r[1].sum.toFixed(2)
			};
		});
		return {money: (Math.round(sum*100)/100).toFixed(2), zs: j, rows: list};
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
		var my = this;
		if (this.codeInfo.length === 0) {
			Yobj.alert('请至少选择两场比赛');
		}else if(this.maxggtype === 0){
			Yobj.alert('请至少选择两个不同的玩法');
		}else if(this.ggtype.length === 0){
			Yobj.alert('请选择过关方式');
		}else{
			this.createHitZsTable(this.getHitList(Class.C('opts'), this.ggtype),this.ggtype);
//			Yobj.get('#tz_fenbu').html(this.getPrizeView());//奖金明细
			this.dlg.pop();			
		}
	},
	createHitZsTable: function(data,ggtype){
		Yobj.get('#tz_fenbu').html(this.getSelectView());//对阵信息展示
		
		var ggtypeHtml = ggtype.map(function (s){
			return '<td>' + s + '</td>';
		});
		var title = '<tr><td rowspan="2" class="td1" width="60">命中场数</td><td colspan="'+ggtypeHtml.length+'" class="td2">中奖注数/注</td><td rowspan="2" class="td1" width="60">倍数</td>'+
		'<td class="td2" colspan=2>奖金范围</td></tr><tr class="trone">'+ggtypeHtml.join('')+'<td>最小奖金</td><td class="last_td">最大奖金</td></tr>';
		
		
		var tr = '<tr><td>{$hitCount}</td>{$splitZS}<td>'+this.bs+'</td><td><strong class="eng">{$minPrize}</strong>元<span style="cursor:pointer;color:#005ebb" onclick="Yobj.postMsg(\'msg_hit_split\',this,{$hitCount},false)">(明细)</span>'+
		'</td><td style="color:red"><strong class="eng red">{$maxPrize}</strong>元<span style="cursor:pointer;color:#005ebb" onclick="Yobj.postMsg(\'msg_hit_split\',this,{$hitCount},true)">(明细)</span></td></tr>';
		var html = ['<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>'];
		html.push(title);
		
		var minMoney = 1000000000,maxMoney = 0;
		for (var i =  0, j = data.length; i < j; i++) {
			var row = data[i], detail = [];
			detail.hitCount = row.num;
			detail.splitZS = '';
			for(var m = 0; m<row.hitNum.length; m++){
				detail.splitZS += '<td>'+row.hitNum[m]+'</td>';
			}
			detail.minPrize = row.min;
			detail.maxPrize = row.max;
			if(row.max>maxMoney){
				maxMoney = row.max;
			}
			if(row.min<minMoney){
				minMoney = row.min;
			}
			html.push(tr.tpl(detail));
		}
		html.push('<tr><td style="text-align:center;" colspan=10>注：中奖注数命中区间表示同1场比赛不同玩法同时命中的情况。</td></tr>');
		html.push('</table>');
		Yobj.get('#hot_case').html(html.join(''));//奖金明细
		
		Yobj.get('#prix_range').html('奖金范围：'+minMoney+'-'+maxMoney+'元');
		
	},
	getHitList2: function (min, max, ggType){
		var Y = this, list = [], freeTypes, maxCodes, maxSum, minCodes, minSum;
		minRec = min;
		maxRec = max;
		ggTypes = ggType;
		freeTypes = this.getAllc1(ggTypes);
		cache = [];
		var i = Math.max(maxRec.length, minRec.length),
			min_hit = Y.getMinGgNum(ggTypes);
		function getHitNums(c){
			return maxSum.codeCount[parseInt(c, 10) || 1]||0;
		}
		for (; i >= min_hit; i--) {
			maxCodes = Y.getHitSingleCodes(i);
			maxSum = Y.getBonusSum(maxCodes);
			minCodes = Y.getHitSingleCodes(i, true);
			minSum = Y.getBonusSum(minCodes);
			cache[i] = [minCodes, minSum, maxCodes, maxSum];
			list.push({
				num: i,
				hitNum: Y.map(freeTypes, getHitNums),
				bs: Y.bs,
				min: minSum.bonus,
				max: maxSum.bonus
			});
		}
		list.ggTypes = freeTypes;
		return list;
	},
	getBonusSum:function (list){
		var cl = {}, sum = 0, bs = this.bs;
		for (var i = 0, j = list.length; i < j; i++) {
			var code = list[i], b = 1, len = code.length;		
			for (var x = code.length; x--;) {b *= code[x];}
			if (b) {
				sum+=Math.round(b*100)/100*2*bs;
				if (!(len in cl)) {cl[len] = 0;}
				cl[len]++;
			}			
		}
		return {bonus: Math.round(sum*100)/100, codeCount: cl};
	},
	getHitSingleCodes:function(n, min){
		var Y = this, list = [], dl = [], tl = [], danSort = min ? minRec.slice() : maxRec.slice(), dir = min ? 1 : -1;
		danSort.sort(function (a, b){
			if (a.isdan === b.isdan) {
				var aaa = 0, bbb = 0, i = 0, j = 0;
				for(;i<a.length;i++){
					aaa += a[i];
				}
				for(;j<b.length;j++){
					bbb += b[j];
				}
				
				return (aaa > bbb ? 1 : -1)*dir;
			}
			else{return a.isdan ? -1 : 1;}
		});
		this.forEach(danSort, function (o, i){
			if (i >= n) {
				var t = [0];
				t.isdan = o.isdan;
				t.sum = o.sum;
				o = t;
			}
			if (o.isdan) {dl.push(o);}else{tl.push(o);}
		});
		this.forEach(ggTypes, function (type){list = list.concat(Y.getSigleCodes(dl, tl, type));});
		return list;
	},
	getSigleCodes: function (d, t, n, del){
		var Y = this,nm = this.parseNM(n), group, len = nm[0], diff = len - (d.length + t.length);
		if (nm[1] > 1 && diff > 0) {for (var i =  diff; i--;) {t.push([0]);}}//多串中有子串，用0sp值的补全。
		group = Math.dtl(d, t, len);
		return this.reduce(group, function (codes, g){
			var al = Math.all(g);
			return codes.concat(Y.reduce(al, function (rc, c){return rc.concat(Y.splitNM(c, nm[2]));}, []));
		}, []);
	},
	splitNM:function(code, n1s){
    	var Y = this;
		return this.reduce(n1s, function (r, type){return r.concat(Math.cl(code, Y.intt(type)));}, []);
	},
	reduce: function (a, fn, b, o) {
        this.each(a, function (v, k, a, j) {
            if(b === 'undefined') {
                b = v;
            } else {
                b = fn.call(o || v, b, v, k, a, j);
            }
        });
        return b;
    },
    each:function (o, f, z) { return (o && this.arrayLike(o)) ? this.forEach(o, f, z) : this.forIn(o, f, z); },
    arrayLike:function (o) {
        return typeof o === 'object' && isFinite(o.length) && o.nodeType === 'undefined' && o.window !== o;
    },
    has:function(o, k) {
    	var _has = {}.hasOwnProperty;
        return _has.call(o, k);
    },
    forIn:function (o, f, z) {
        var k, i = 0;
        if(o) {
            for(k in o) {
                if(this.has(o, k) && false === f.call(z || o[k], o[k], k, o, i++)) {
                    break;
                }
            }
        }
        return z || o;
    },
	parseNM:function (nm){
    	var cache = {},Y = this;
		if (!(nm in cache)) {
			if (nm == '单关') {
				cache[nm] = [1, 1, [1]];
			}else{
				var tmp = Y.trim(nm).split('串');
				cache[nm] = [this.intt(tmp[0]), this.intt(tmp[1]), Y.getN1(nm)];
			}
		}
		return cache[nm];
	},
	intt:function (n) {
        return parseInt(n, 10);
    },
	trim:function (s) {
		var TRIM_RE = /^\s+|\s+$/g;
        return s.replace(TRIM_RE, '');
    },
	map:function (a, f, o) {
        return this.each(a, function (v, k, a, j) {
            this.push(f.call(o || v, v, k, a, j));
        }, []);
    },
	getMinGgNum: function (types){
		var Y = this, ntypes = [];
		for (var i =  types.length; i--;) {ntypes = ntypes.concat(Y.getN1(types[i]));}
		ntypes.sort();
		return parseInt(ntypes[0], 10);
	},
	getAllc1: function (types){
		var g={}, g2=[], Y = this;
		types.each(function (type){Y.getN1(type).each(function (t){g[t] = true;});});
		for(var k in g){g2.push(k == 1 ? '单关' : (k +'串'+1));}
		g2.sort(function (a, b){return parseInt(a, 10) > parseInt(b, 10) ? 1 : -1;});
		return g2;
	},
	getN1:function (nm){
    	var NM2N1={'1*1':[1],'2*1':[2],'3*1':[3],'4*1':[4],'5*1':[5],'6*1':[6],'7*1':[7],'8*1':[8],'3*3':[2],'3*4':[2,3],'4*6':[2],'4*11':[2,3,4],'5*10':[2],'5*20':[2,3],'5*26':[2,3,4,5],'6*15':[2],'6*35':[2,3],'6*50':[2,3,4],'6*57':[2,3,4,5,6],'4*4':[3],'4*5':[3,4],'5*16':[3,4,5],'6*20':[3],'6*42':[3,4,5,6],'5*5':[4],'5*6':[4,5],'6*22':[4,5,6],'6*6':[5],'6*7':[5,6],'7*7':[6],'7*8':[6,7],'7*21':[5],'7*35':[4],'7*120':[2,3,4,5,6,7],'8*8':[7],'8*9':[7,8],'8*28':[6],'8*56':[5],'8*70':[4],'8*247':[2,3,4,5,6,7,8]};
		if (nm=='单关') {nm='1*1';}else{nm = nm.replace('串','*');}
		return NM2N1[nm];
	},
	getHitList: function (opts, ggType){
		var real = this.getLimitOpts(opts);
		return this.getHitList2(real.min, real.max, ggType);
	},
	getLimitOpts:function(opts){
		var Y = this;
		var minOpts=[], maxOpts=[], j = 0;
		this.forEach(opts, function (opt){
			if (opt) {
				var real = Y.getSgBound(opt);
				minOpts[j] = real[0];
				maxOpts[j++] = real[1];
			}
		});
		minOpts.sort(function (a, b){return a.sum > b.sum ? 1 : -1;});
		maxOpts.sort(function (a, b){return a.sum > b.sum ? -1 : 1;});
		return {min: minOpts, max: maxOpts};
	},
	forEach:function(o, f) {
	    if (o) for (var i = 0, j = o.length; i < j; i++) if (!1 === f.call(o[i], o[i], i, o, j)) break;
	    return o;
	},
	getSgBound:function(str){
		var algo = this;
		var single = str.split('|'), minSum=9e9, maxSum=-1;
		var minOpts, maxOpts, minBf, maxBf, dan = str.indexOf('D') > -1;
		if (true) {
			this.forEach(this.allBf, function (bf){
				var optsAl = Math.all(algo.filterInvalidOpts(single, bf)), hits, sum;
				for (var i = 0, j = optsAl.length; i < j; i++) {
					hits = optsAl[i];
					sum = 0;
					for (var k =  hits.length; k--;) {
						hits[k] = parseFloat(hits[k].split('#')[1]);
						sum += hits[k];
					}
					if (sum > maxSum) {maxSum = sum; maxOpts=hits.slice();maxBf = bf.name;}
					if (sum < minSum) {minSum = sum; minOpts=hits.slice();minBf = bf.name;}
				}
			});
		}else{
			var optsAl = str.split(','), sp;
			for (var i = 0, j = optsAl.length; i < j; i++) {
				sp = parseFloat(optsAl[i].split('#')[1]);
				if (sp > maxSum) {maxSum = sp; maxOpts=[sp];}
				if (sp < minSum) {minSum = sp; minOpts=[sp];}
			}
		}
		minOpts.sum = minSum;
		minOpts.bf = minBf;
		maxOpts.sum = maxSum;
		maxOpts.bf = maxBf;
		minOpts.isdan = maxOpts.isdan = dan;
		return [minOpts, maxOpts];
	},
	filterInvalidOpts:function(single, bf){
		var ret  = [], Y = this, len = 0, filter=this.bfCheckMap[bf.name];
		function test(str){
			if (str.indexOf('spf') === 0) {return Y.testRqSpfByBf(str, bf);}
			return str.split('#')[0] in filter;
		}
		for (var i = 0, j = single.length; i < j; i++) {
			var types = single[i].split(',').filter(test);
			if (types.length) {ret[len++] = types;}
		}
		return ret;
	},
	testRqSpfByBf:function(str, bf){
		var rq = parseInt(str.split('#')[0].split('@')[1], 10);
		if (rq > 0) {
			if(bf.name == '0A'){
				if (rq === 1) {
					return str.indexOf('spf-0') === 0 || str.indexOf('spf-1') === 0;
				}
				return str.indexOf('spf-') === 0;
			}
			if (bf.spf < 1) {
				if (rq < bf.diff) {
					return str.indexOf('spf-0') === 0;
				}else if(rq === bf.diff){
					return str.indexOf('spf-1') === 0;
				}
			}
			return str.indexOf('spf-3') === 0;
		}else{
			rq = Math.abs(rq);
			if(bf.name == '3A'){
				if (rq === 1) {
					return str.indexOf('spf-3') === 0 || str.indexOf('spf-1') === 0;
				}
				return str.indexOf('spf-') === 0;
			}
			if (bf.spf>0) {
				if (bf.diff > rq) {
					return str.indexOf('spf-3') === 0;
				}else if(bf.diff === rq){
					return str.indexOf('spf-1') === 0;
				}
			}
			return str.indexOf('spf-0') === 0;
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
			}, 100);
		}
		var title = '<tr><th rowspan="2">命中场数</th><th colspan="'+ggtypeHtml.length+'">中奖注数/注</th><th rowspan="2">倍数</th>'+
		'<th colspan="2" class="last_th">奖金</th></tr><tr class="trone">'+ggtypeHtml.join('')+'<th>最小</th><th class="last_td">最大</th></tr>';
		
		
		var tr = '<tr><td>{$hitCount}</td>{$splitZS}<td>'+this.bs+'</td><td><strong class="eng">{$minPrize}</strong>元<span style="cursor:pointer;color:#005ebb" onclick="Yobj.postMsg(\'msg_hit_split\',this,{$num},false)">(明细)</span>'+
		'</td><td style="color:red"><strong class="eng red">{$maxPrize}</strong>元<span style="cursor:pointer;color:#005ebb" onclick="Yobj.postMsg(\'msg_hit_split\',this,{$num},true)">(明细)</span></td></tr>';
		
		
//		mx_tpl:['<h3>拆分明细</h3><table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed">'+
//		'<tr><th width="65">过关方式</th><th width="65">中奖注数</th><th>中{$num}场 最{$ch}奖金 中奖明细</th>'+
//		'<th class="last_th" width="80">奖金</th></tr>',
//		'<tr><td>{$ggtype}</td><td>{$zs}</td>'+
//		'<td class="tl">{$expr}</td>'+
//		'<td class="last_td"><span class="red">{$money}</span></td></tr>',
//		'<tr class="last_tr">'+
//		'</table>'], 
		
		
		
		var html = ['<table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody>'];
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
		html.push('</table><div style="text-align:center;">注：中奖注数命中区间表示同1场比赛不同玩法同时命中的情况。</div>');
		return html.join('');
	},
	getSplitZSView: function (hit, types, data){//假设命中多少场, 返回各个过关方式的注数
		var algo = this.algo,
			detail = {},
			min=0,
			max = 0;
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
		var tmpl = '<tr><td>{$index}</td><td>{$vs}</td><td class="tl">{$codes}</td><td>{$min}</td><td>{$max}</td><td>{$dan}</td></tr>';
		var html = ['<table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed"><tr><td width="65">赛事编号</td><td width="153">对阵</td><td width="210">投注选项(奖金)</td><td>最小奖金</td><td class="last_th">最大奖金</td><td class="last_th">胆码</td></tr>'];
		for (var i = 0, j = this.codeInfo.length; i < j; i++) {
			var info = this.codeInfo[i];
			html.push(tmpl.tpl(info));
		}
		html.push('<tr class="last_tr"><td colspan="6" class="last_td">过关方式：<span class="red">'+this.ggtype+'</span> 倍数：<span class="red">'+this.bs+'</span>倍 方案总金额：<span class="red">'+this.money+'</span>元</td></tr></table>');
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