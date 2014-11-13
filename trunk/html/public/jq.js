(function() {
	var __Yobj, __TagWrap, __NavMap,
	__rById = /^(?:\s*[^#\s]*)#(\w+)[^\S>]*\s*$/,
	__rIsHtml = /<(\w+)[^>]*>/,
	__rSTag = /^<\w+>$/,
	__rStr2Arr = /\s*,\s*/,
	__rTrim = /^\s+|\s+$/g,
	__rUrlAttr = /^(?:src|href|action)$/i,
	__rId2Attr = /#([^.#\[\]]+)/,
	__rAttrs = /\[([\w-]+)(?:([!~^*$]?=)([^=]*))?\]/g,
	__rAttr = /\[([\w-]+)(?:([!~^*$]?=)([^=]*))?\]/,
	__rClass = /\.((?:[\w\u0128-\uFFFF_-]|\\.)+)/,
	__rTag = /(?:^|\s+)((?:[\w\u0128-\uFFFF\*_-]|\\.)+)/,
	__rType = /:([\w-]+)/,
	__rParseGroup = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]+\]|[^[\]]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g,
	__rIsInput = /^(button|text|radio|checkbox|image|submit|reset|password|file|hidden|checked)$/i,
	__Err = location.href.indexOf('#debug-open') > -1,
	__isClassOpts = /^(use|style|ready|single|Extends)$/;
	__C = {},
	__B = {},
	__Is = {},
	__DpVals = {},
	__Msgs = {},
	__QExpR = {},
	__AllClass = [],
    __AjaxUrls = {},
	__2Str = Object.prototype.toString,
	Slice = Array.prototype.slice,
	__Div = document.createElement('DIV'),
	__IsTTag = /^(tr|table|tbody|tfoot|thead|caption|col|colgroup)$/i;
	function __getVal(val, old, i) {
		return __Is.isFunction(val) ? val.call(this, old, i) : (__Is.isArray(val) ? ((i in val) ? val[i] : old) : val)
	}
	function __Noop(arg) {
		return arg
	}
	__C.newSub = (function(noop) {
		return function(obj) {
			noop.prototype = obj;
			return new noop
		}
	})(function() {});
	__C.getObj = function() {
		return (function(A, o) {
			for (var i = 1, l = A.length; i < l; i += 2) {
				o[A[i - 1]] = A[i]
			}
			return o
		})(arguments, {})
	};
	__TagWrap = __C.getObj('tbody', ["table"], 'thead', ["table"], 'tfoot', ["table"], 'tr', ["table", "tbody"], 'td', ["table", "tbody", "tr"], 'th', ["table", "thead", "tr"], 'caption', ["table"], 'colgroup', ["table"], 'col', ["table", "colgroup"]);
	__NavMap = __C.getObj('getparent', 'parentNode', 'getnext', 'nextSibling', 'getchild', 'childNodes', 'getprev', 'previousSibling');
	__C.error = function(text, where, ret) {
		if (arguments.length === 1 || where) {
			throw new Error('<' + (this.Type || 'YClass') + '> ' + text)
		}
		return ret
	};
	__C.mix = function(o, f, v, ks) {
		var w, i;
		if (o && f) {
			v = v === void(0) || v;
			if (ks) {
				ks = __Is.isString(ks) ? ks.replace(/\s+/g, '').split(',') : ks;
				for (i = ks.length; i--;) {
					w = ks[i];
					if (w in f && (v || !(w in o))) {
						o[w] = f[w]
					}
				}
			} else {
				for (w in f) {
					if (v || !(w in o)) {
						o[w] = f[w]
					}
				}
			}
		}
		return o
	};
	__C.aop = function() {
		var F = Slice.call(arguments).filter(function(el, i) {
			return el instanceof Function
		});
		return function() {
			var re,
			    args = Slice.call(arguments);
			for (var i = 0, j = F.length; i < j; i++) {
				re = F[i].apply(this, args.concat(re));
				if (false === re) {
					break
				}
			}
			return re
		}
	};
	function Point(x, y, z) {
		__C.mix(this, __C.getObj('x', x || 0, 'y', y || 0, 'z', z || 0))
	};
	Point.prototype = {
		offset: function(x, y, z) {
			return new Point(this.x + ~~x, this.y + ~~y, this.z + ~~z)
		},
		distance: function(pt) {
			return Math.sqrt(Math.pow((this.x - pt.x), 2) + Math.pow((this.y - pt.y), 2));
		},
		polar: function(dis, angle) {
			var arc = -angle * Math.PI / 180;
			return new Point(this.x + ~~ (Math.cos(arc) * dis), this.y + ~~ (Math.sin(arc) * dis))
		}
	};
	function Rect(x, y, width, height, z) {
		__C.mix(this, __C.getObj('x', x || 0, 'y', y || 0, 'z', z || 0, 'width', width || 0, 'height', height))
	};
	Rect.prototype = {
		toPoint: function(x, y, z) {
			return new Point(this.x + ~~x, this.y + ~~y, this.z + ~~z)
		},
		offset: function(x, y, w, h, z) {
			return new Rect(this.x + ~~x, this.y + ~~y, this.width + ~~w, this.height + ~~h, this.z + ~~z)
		},
		getXArea: function(r2) {
			return (function(R, d, x) {
				return d(0, d(0, x(R.x + R.width, r2.x + r2.width) - d(R.x, r2.x)) * d(0, x(R.y + R.height, r2.y + r2.height) - d(R.y, r2.y)))
			})(this, Math.max, Math.min)
		}
	};
	__C.mix(Function.prototype, {
		proxy: function(proxy) {
			return (function(fn, a) {
				return function() {
					return fn.apply(proxy, a.concat(Slice.call(arguments)))
				}
			})(this, Slice.call(arguments, 1))
		},
		slow: function(time) { // not define arguments
			var timer,
			    fn = this;
			return function() {
				var A = Slice.call(arguments),
				    obj = this;
				clearTimeout(timer);
				return timer = setTimeout(function() {
					fn.apply(obj, A)
				}, ~~time || 16);
			}
		}
	},	false);
	Array.up = new Function('a, b', 'return parseFloat(a) - parseFloat(b) > 0 ? 1 : -1');
	__C.mix(Array.prototype, {
		each: function(fn, _b) {
			_b = _b || this;
			for (var i = 0, j = this.length; i < j; i++) {
				if (fn.call(_b, this[i], i, this) === false) {
					break
				}
			}
			return _b
		},
		random: function() {
            var n, t, i, a = this.slice(), k=[], R = Math.random;
            while(a.length){
                k.push.apply(k, a.splice(Math.floor(R()*a.length),1));
            }
            for (i = k.length; i--;) {
                n = parseInt(R() * i);
                t = k[i];
                k[i] = k[n];
                k[n] = t;
            }
            return Slice.apply(k, arguments);
		},
		remove: function(_d, _b, _el) {
			_el = _d;
			if (!__Is.isFunction(_d)) {
				_el = _el instanceof Array ? _el: [_el];
				_d = function(item) {
					return _el.indexOf(item) > -1
				}
			}
			for (var i = 0, n = 0, j = this.length; i < j; i++) {
				if (!_d.call(_b, this[i])) {
					this[n++] = this[i]
				}
			}
			this.length = n; // slice
			return this
		},
		indexOf: function(el, start) {
			var len = this.length;
			start = isNaN(start) ? 0 : (start < 0 ? (start + len) : start);
			for (; start < len; start++) {
				if (start in this && this[start] === el) {
					return start
				}
			}
			return - 1
		},
		map: function(fn, _b) {
			return (function(arr, len, res) {
				for (var i = 0; i < len; i++) {
					if (i in arr) {
						res[i] = fn.call(_b, arr[i], i, this.arr)
					}
				}
				return res
			})(this, this.length, new Array(this.length))
		},
		filter: function(fn, _b) {
			return (function(len, res, arr, val) {
				for (var i = 0; i < len; i++) {
					if (i in arr) {
						val = arr[i];
						if (fn.call(_b, val, i, arr)) {
							res[res.length] = val
						}
					}
				}
				return res
			})(this.length, [], this)
		},
		reduce: function(fn) {
			return (function(A, arr, len, k, init) {
				if (A.length > 1) {
					init = A[1];
				} else {
					do {
						if (k in arr) {
							init = arr[k++];
							break;
						}
						if (++k >= len) {
							throw new TypeError()
						}
					} while ( true )
				}
				while (k < len) {
					if (k in arr) {
						init = fn.call(null, init, arr[k], k, arr)
					}
					k++
				}
				return init;
			})(arguments, this, this.length, 0)
		}
	}, false);
	String.zero = new Function('s, n', 'n = ~~n || 2; return s.toString().replace(/\\b\\d\\b/g,"0$&")');
	__C.mix(String.prototype, {
		trim: function() {
			return this.replace(__rTrim, '')
		},
		tpl: function(o, def) {
			var ns, prop;
			def = def === void(0) ? '': def;
			return this.replace(/\{\$([^$\}]+?)\}/g, function(all, ns) {
				ns = ns.trim().split('.');
				prop = o;
				try {
					while (ns.length) {
						prop = prop[ns.shift()]
					}
				} catch(e) {
					prop = def
				}
				return prop === void(0) ? def: prop
			})
		},
		format: function() {
			var A = arguments;
			return this.replace(/\{(\d+)\}/g, function(a, b) {
				return A[b - 1] === void(0) ? '': A[b - 1]
			})
		},
		like: function(s) {
			return ! s && s !== '' ? false: this.trim().toLowerCase() === s.toString().trim().toLowerCase()
		}
	}, false);
	__C.mix(Date.prototype, {
		format: function(tpl) {
			var strs, w, keys, year, val;
			strs = [];
			tpl = tpl || 'YY\u5e74MM\u6708DD\u65e5 \u661f\u671fdd';
			w = 'FullYear,Month,Date,Hours,Minutes,Seconds,Day'.split(',');
			keys = [/YY/g, /Y/g, /MM/g, /M/g, /DD/g, /D/g, /hh/g, /h/g, /mm/g, /m/g, /ss/g, /s/g, /dd/g, /d/g];
			for (var i = 0; i < 7; i++) {
				val = this['get' + w[i]]() + (w[i] === 'Month' ? 1 : 0);
				strs.push(('0' + val).slice( - 2), val)
			}
			year = [strs[1], strs[0]].concat(strs.slice(2, -2));
			year.push('\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d'.substr(strs.slice( - 1), 1), strs.slice( - 1));
			for (var i = 0; i < 14; i++) {
				tpl = tpl.replace(keys[i], year[i])
			}
			return tpl
		},
		diff: function(d, ch) {
			return ((__Is.isString(d) ? new Date(d.replace(/-/g, '/')) : new Date(d)) - this).toTimeDiff(ch)
		}
	});
	__C.mix(Number.prototype, {
		rmb: function(prevfix, n) {
			return (prevfix === false ? '': '\uffe5') + this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,')
		},
		toTimeDiff: function(ch) {
			return (function(unit, date, chDate, diff, words) {
				for (var i = 0,
				l = unit.length; i < l; i++) {
					date[i] = parseInt(diff / unit[i]);
					chDate[i] = date[i] + words[i];
					diff %= unit[i]
				}
				return ch ? chDate: date
			})([86400000, 3600000, 60000, 1000, 1], [], [], this, '\u5929,\u65f6,\u5206,\u79d2,\u6beb\u79d2'.split(','))
		},
		range: function(a, b) {
			b = arguments.length == 1 ? 0 : b;
			return Math.min(Math.max(a, b), Math.max(Math.min(a, b), this))
		}
	});
    (function(x, n, y) {
		n = /msie/.test(x) && !/opera/.test(x) ? 'ie': (/firefox/.test(x) ? 'firefox': (/webkit/.test(x) && !/chrome/.test(x) ? 'safari': (/opera/.test(x) ? 'opera': (/chrome/.test(x)) ? 'chrome': 'unknown')));
		y = n == "safari" ? "version": n;
		__B[n] = parseInt(y && RegExp("(?:" + y + ")[\\/: ]([ \\d.]+)").test(x) ? RegExp.$1: "0");
		__B.browserName = n;
	})(navigator.userAgent.toLowerCase());
	__C.mix(Math, {
		c: function(len, m) {
			return (function(n1, n2, j, i, n) {
				for (; j <= m;) {
					n2 *= j++;
					n1 *= i--
				}
				return n1 / n2
			})(1, 1, 1, len, len)
		},
		cl: function(arr, n, z) { // z is max count
			var r = [];
			fn([], arr, n);
			return r;
			function fn(t, a, n) {
				if (n === 0 || z && r.length == z) {
					return r[r.length] = t
				}
				for (var i = 0, l = a.length - n; i <= l; i++) {
					if (!z || r.length < z) {
						fn(t.concat(a[i]), a.slice(i + 1), n - 1);
					}
				}
			}
		},
		p: function(n, m) {
			for (var i = n - m, c = 1; i < n;) {
				c *= ++i
			}
			return c
		},
		pl: function(arr, n, z) {
			var r = [];
			fn([], arr, n);
			return r;
			function fn(t, a, n) {
				if (n === 0 || z && r.length == z) {
					return r[r.length] = t
				}
				for (var i = 0, l = a.length; i < l; i++) {
					if (!z || r.length < z) {
						fn(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1)
					}
				}
			}
		},
		dt: function(d, t, m) {
			return d >= m ? 0 : Math.c(t, m - d)
		},
		dtl: function(d, t, n, z) {
			var r = [];
			if (d.length <= n) {
				r = Math.cl(t, n - d.length, z);
				for (var i = r.length; i--;) {
					r[i] = d.concat(r[i])
				}
			}
			return r
		}
	});
    ['String', 'Number', 'Boolean', 'Array', 'Object', 'RegExp', 'Date', 'Function'].each(function(prop) {
		__Is['is' + prop] = function(val) {
			return __2Str.call(val).indexOf(prop) > -1 && val !== null && val !== undefined && !val.nodeType && !val.alert
		}
	});
	__C.mix(__C, {
		getNoop: function() {
			return __Noop
		},
		parseVal: __getVal,
		debug: function(off) {
			__Err = off === void 0 || off
		},
		getInt: function(val, def) {
			var d = parseInt(val, 10);
			return isNaN(d) ? (def || 0) : d
		},
		getDate: function(date, def) {
			var date = new Date(this.isString(date) ? date.replace(/-/g, '/') : date);
			return isNaN(date) ? def: date
		},
		sliceB: function(str, len) {
			var r, r2, i, n;
			r = /[^\x00-\xff]/;
			r2 = /[^\x00-\xff]/g;
			if (str.replace(r2, '..').length > len) {
				i = parseInt(len / 2);
				n = str.slice(0, i).replace(r2, '..').length;
				for (l = str.length; i < l; i++) {
					n += r.test(str.charAt(i)) ? 2 : 1;
					if (n > len) {
						break
					}
				}
				str = str.slice(0, i)
			}
			return str
		},
		repeat: function(n, op) { // fn or number
			var _fn = this.isFunction(op) ? op: new Function('a,b', 'return a+(~~b)');
			for (var i = 0, arr = [], j = n >>> 0; i < j; i++) {
				arr[i] = _fn.call(this, i, op)
			}
			return arr
		},
		dejson: function(data) {
			try {
				return (new Function('return (' + data + ')'))()
			} catch(e) {
				__Err && log(this.Type + '.dejson(): \u89e3\u6790\u51fa\u9519, \u6e90\u6587\u672c\u4e3a:', data)
			}
		},
		getMapPath: function(url, isjs) {
			if (url.indexOf('.') == -1 && isjs) {
				url = "@" + (url.indexOf('/') > -1 ? '': 'lib/') + url + '/' + url.slice(url.lastIndexOf('/') + 1) + '.js';
			}
			return url.replace(/@(\/)?/, Class.config('CorePath')).replace(/([^:])\/+/g, '$1/').trim()
		},
		getGuid: (function(guid, _undef) {
			return function(el) {
				var gid = ++guid;
				if (el) {
					el = this.one(el);
					if (el['yclassuid'] === _undef) {
						el['yclassuid'] = (el.nodeName || (el.Type ? el.Type: typeof el)) + gid
					}
					return el['yclassuid'];
				}
				return '_' + gid
			}
		})(+new Date),
		Point: function(x, y, z) {
			return new Point(x, y, z)
		},
		Rect: function(x, y, w, h, z) {
			return new Rect(x, y, w, h, z)
		},
		$: function(selector, contains, one) {
			var nodes, group, pars, query, matcher, _prop, _rightNodes, html, range, id, sib, ql, doc;
			doc = document;
			nodes = [];
			if (typeof selector != 'string') {
				if (selector instanceof Array) {
					nodes = selector
				} else if (contains === 'toArray' || 'length' in Object(selector) && !selector.alert && !selector.nodeType) {
					for (var i = selector.length; i--;) { // nodeList, childNodes, no-window, no-select
						nodes[i] = selector[i]
					}
				} else if (!selector) { // empty, null, undefined
					nodes = []
				} else if (selector instanceof YNode) {
					nodes = selector.nodes
				} else { // element
					nodes = [selector]
				}
			} else if (id = selector.match(__rById)) {
				id = doc.getElementById(id[1]);
				nodes = id ? [id] : []
			} else if (__rIsHtml.test(selector)) { // HTML string
				var tag, tagWrap, suff, html;
				tag = RegExp.$1.toLowerCase();
				html = __rSTag.test(selector) ? selector.replace(/<(\w+)>/, '<$1></$1>') : selector;
				if (suff = __TagWrap[tag]) { // is table elements
					html = "<" + suff.join("><") + ">" + html + "</" + suff.slice().reverse().join("></") + ">";
				}
				__Div.innerHTML = html;
				return suff ? this.$(tag, __Div.firstChild) : this.$(__Div.childNodes, 'toArray')
			} else {
				group = selector.split(__rStr2Arr); // selector, selector2
				pars = contains ? this.$(contains) : [doc];
                (function(Y) { // break all for
					for (var mc = 0, mj = pars.length; mc < mj; mc++) { // each contains
						contains = pars[mc];
						for (var g = 0, gl = group.length; g < gl; g++) { // each selector
							query = group[g].match(__rParseGroup); // single query
							range = contains; // exact range
							ql = query ? query.length: 0;
							if (ql) {
								if (id = query[0].match(__rById)) {
									range = doc.getElementById(id[1]); // only form id/ nodes in id
									query.shift();
									ql--
								}
							}
							if (ql && range) {
								matcher = [];
								_prop = Y._parseRule(query[ql - 1]);
								if (range == doc && (query[0].indexOf('.') > -1 || query[0].indexOf(':') > -1)) {
									range = doc.body
								}
								_rightNodes = (_prop['.'] && range.getElementsByClassName) ? range.getElementsByClassName(_prop['.']) : range.getElementsByTagName(_prop.tag ? _prop.tag: _prop.type ? (__rIsInput.test(_prop.type) ? 'input': '*') : '*'); // get base tag
								for (var i = 0, j = _rightNodes.length; i < j; i++) {
									if (matcher.length > 0 && one) {
										return nodes = matcher
									} else if (Y._isMatchNode(_rightNodes[i], query, range)) {
										matcher[matcher.length] = _rightNodes[i]
									}
								}
							} else { // only get-id or document
								matcher = (range === doc || !range) ? [] : range
							}
							nodes = nodes.concat(matcher)
						}
					}
				})(this);
				if ((group.length > 1 || pars.length > 1) && !one) { // group uniquelize 
					nodes = this._uniqueObj(nodes)
				}
			}
			nodes.length === 0 && arguments.length && __Err && log(this.Type + '.get \u6ca1\u6709\u627e\u5230\u5339\u914d"' + selector + '"\u7684\u5143\u7d20');
			return nodes
		},
		get: function() {
			return new YNode(this.$.apply(this, arguments), this)
		},
		_uniqueObj: function(nodes) {
			var uq, uqArr, guid;
			uq = {};
			uqArr = [];
			for (var i = 0, n = 0, j = nodes.length; i < j; i++) {
				guid = this.getGuid(nodes[i]);
				if (! (guid in uq)) {
					uq[guid] = true;
					uqArr[n++] = nodes[i]
				}
			}
			return uqArr
		},
		_parseRule: (function(cc) { // cache parse obj
			return function(q) {
				var m, m2,
                p = cc[q],
				s = q;
				if (!p) {
					p = {};
					s = s.replace(__rId2Attr, '[id=$1]');
					if (m = s.match(__rAttrs)) {
						p.attr = [];
						for (var i = m.length; i--;) {
							m2 = m[i].match(__rAttr);
							p.attr[i] = {// chrome return undefined
								k: m2[1],
								q: m2[2] || '',
								v: m2[3] || ''
							}; 
						}
						s = s.replace(__rAttrs, ' ')
					}
					if (m = s.match(__rType)) {
						p.type = m[1].toLowerCase();
					}
					if (m = s.match(__rClass)) {
						p.klass = m[1];
					}
					if (m = s.match(__rTag)) {
						p.tag = m[1].toLowerCase();
					}
					cc[q] = p
				}
				return p
			}
		})({}),
		_isMatchNode: function(el, query, contains) {
			var checkSelf, len = query.length;
			checkSelf = query[len - 1];
			if (checkSelf && this._isMatchSelf(el, checkSelf)) {
				return len > 1 ? this._isMatchParent(el, query, contains) : true
			}
		},
		_isMatchParent: function(node, selector, contains) {
			var rule, i, isChild;
			for (i = selector.length - 1; i--;) { // each rule
				rule = selector[i];
				isChild = rule == '>';
				while (node = node.parentNode) { // each parent
					if (node !== contains) {
						if (isChild) {
							if (i--==0) {
								return false
							}
							rule = selector[i]
						}
						if (this._isMatchSelf(node, rule)) {
							break
						}else if (isChild) {
							return false
						}
					} else {
						return isChild && !i// no target
					}
				}
			}
			return true
		},
		_isMatchSelf: function(el, rule) { // is match tag & className & type
			var p = this._parseRule(rule);
			return (!p.tag || el.nodeName.toLowerCase() === p.tag) && (!p.klass || (' ' + el.className + ' ').indexOf(' ' + p.klass + ' ') > -1) && (!p.type || this._isMatchType(el, p.type)) 
			&& (!p.attr || this._isMatchAttrs(el, p.attr)) // attribute or property
		},
		_isMatchType: function(el, type) {
            if (__rIsInput.test(type) && type != 'checked') {
                return el.type && el.type.toLowerCase() === type;
            }
			switch (type) {			
			case 'empty':
				return el.childNodes.length === 0;
			case 'checked':
				return el.checked;
			case 'disabled':
				return el.disabled;
			case 'visited':
				return el.style.display != 'none';
			default:
				var q = __QExpR[type];
				return q ? q(el) : false
			}
		},
		_isMatchAttrs: function(el, attrs) {
			for (var i = attrs.length; i--;) {
				var r = attrs[i];
				if (!this._isMatchAttr(el, r.k, r.q, r.v)) {
					return false
				}
			}
			return true
		},
		_isMatchAttr: function(el, key, vs, val) {
			var attr = el.getAttribute(key, __rUrlAttr.test(key) ? 2 : 0) || '',
			prop = el[key] || '';
			switch (vs) {
			case '':
				return !! attr;
			case '=':
				return attr === val || prop === val;
			case '^=':
				return attr.indexOf(val) === 0 || prop.indexOf(val) === 0;
			case '$=':
				var r = RegExp(val + '$');
				return r.test(attr) || r.test(prop);
			case '*=':
				return attr.indexOf(val) > -1 || prop.indexOf(val) > -1;
			case '~=':
				val = ' ' + val + ' ';
				return (' ' + attr + ' ').indexOf(val) > -1 || (' ' + prop + ' ').indexOf(val) > -1;
			}
		},
		one: function(selector, contains, clearError) {
			var node = this.$(selector, contains, true)[0];
			return this.error('one("' + selector + '"): \u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u5143\u7d20 ', !clearError && !node, node)
		},
		need: function(selector) {
			var get = this.get.apply(this, arguments);
			return this.error('need("' + selector + '"): \u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u5143\u7d20', get.size() == 0, get)
		},
		clearEvents: function() {
			var F, d, s;
			F = this.__Events;
			for (d in F) {
				s = F[d];
				for (var i = 0, j = s.length; i < j; i++) {
					this.__removeEvent.apply(this, s[i])
				}
				delete F[d]
			}
            return this
		},
		addNoop: function(namelist) {
			return namelist.replace(/\s/g, '').split(',').each(function(f) {
				this[f] = (f in this) ? this[f] : __Noop // ont over
			}, this)
		},
		__addEvent: (function(w3c) {
			return w3c ? function(el, type, fn, post) {
				return el.addEventListener(type, fn, !!post)
			}: function(el, type, fn) {
				return el.attachEvent('on' + type, fn)
			}
		})(!!window.addEventListener),
		__removeEvent: (function(w3c) {
			return w3c ? function(el, type, fn) {
				return el.removeEventListener(type, fn, false)
			}: function(el, type, fn) {
				return el.detachEvent('on' + type, fn)
			}
		})(!!window.addEventListener),
		fixEvent: function(e) {
			e = e || window.event;
			if (!e.stopPropagation) {
				e.target = e.srcElement;
				e.stopPropagation = function() {
					e.cancelBubble = true
				};
				e.preventDefault = function() {
					e.returnValue = false
				}
			}
			e.stop = e.stopPropagation;
			e.end = e.preventDefault;
			return e
		},
		on: function(el, type, fn, one) {
            var elEs, elId, post, _fn, ns;
            ns = this;
            return this.$(el).each(function (el){
                ns.error('on(' + fn + '):\u4e8b\u4ef6\u53e5\u67c4\u5fc5\u987b\u662f\u4e00\u4e2a\u51fd\u6570 ', !__Is.isFunction(fn));
                if (type == 'wheel') {
                    return ns.wheel(el, fn)
                } else if (el.nodeName && el.nodeName.like('iframe') && type == 'load') {
                    return ns.loadIframe(el, fn)
                }
                elId = ns.getGuid(el);
                if (!ns.__Events[elId]) {
                    ns.__Events[elId] = []
                }
                elEs = ns.__Events[elId];
                post = false;
                if (type.match('^focusin|focusout$') && !ns.ie) {
                    type = type == 'focusin' ? 'focus': 'blur';
                    post = true
                }
                if (type.match('^mouseenter|mouseleave$') && !ns.ie) {
                    type = type == 'mouseenter' ? 'mouseover': 'mouseout';
                    _fn = function(e) {
                        if (one) {
                            ns.un(el, type, _fn)
                        }
                        if (!el.contains(e.relatedTarget)) {
                            return fn.call(el, ns.fixEvent(e), ns)
                        }
                    }
                } else {
                    _fn = function(e) {
                        if (one) {
                            ns.un(el, type, _fn)
                        }
                        return fn.call(el, ns.fixEvent(e), ns);
                    }
                }
                elEs.push([el, type, _fn, fn]);
                ns.__addEvent(el, type, _fn, post);                
            }, this)
		},
		un: function(el, type, fn) {
			var fs, yes, ilk, isType, isFn;
			yes = new Function('return true');
			ilk = new Function('a, b', 'return a === b');
            isType = type ? ilk: yes;
            isFn = this.isFunction(fn) ? ilk: yes;
            return  this.$(el).each(function (el){
                if (fs = this.__Events[this.getGuid(el)]) {
                    fs.remove(function(note) {
                        if (isType(note[1], type) && isFn(note[3], fn)) {
                            this.__removeEvent.apply(this, note);
                            return true
                        }
                    }, this);
                    if (fs.length == 0) { // empty and delete this Array
                        delete this.__Events[this.getGuid(el)]
                    }
                }                
            }, this)
		},
		clearRange: function() {
			try {
				window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
			} catch(e) {}
		},
		attr: function(el, key, value) {
			var guid, o;
			guid = this.getGuid(el);
			o = this.__DomDatas[guid];
			if (arguments.length > 2) { // set
				if (!this.isObject(o)) {
					o = this.__DomDatas[guid] = {}
				}
				o[key] = value
			} else { // get all or one
				return o ? (key === void(0) ? this.mix({}, o) : o[key]) : void(0)
			}
			return this
		},
		_super: (function(nol, fn) { // call super method
			return function(name) {
				if (this.__CSLEVEL === nol) {
					this.__CSLEVEL = this.__YProto__ // firset
				}
				if (this.__CSLEVEL && __Is.isFunction(this.__CSLEVEL[name])) {
					fn = this.__CSLEVEL[name];
					this.__CSLEVEL = this.__CSLEVEL.__YProto__ || null; // up class or stop
					fn.apply(this, Slice.call(arguments, 1)) // sub function super class Positioning
				}
				delete this.__CSLEVEL
			}
		})(),
		base: function() {
			return this._super.apply(this, ['index'].concat(Slice.call(arguments)))
		},
		nav: function(ref, dir, filter, isall) { // get one
			var d, test, els;
			els = [];
			d = this.isString(dir) ? __NavMap[dir.toLowerCase()] || 'nextSibling': 'nextSibling';
			test = this.isFunction(filter) ? filter: function(el) {
				return __Is.isString(filter) ? __C._isMatchSelf(el, filter) : true
			};
			ref = d == 'childNodes' ? ref.firstChild: ref[d];
			d = d == 'childNodes' ? 'nextSibling': d;
			if (ref) {
				do {
					if (!/SCRIPT|BR/i.test(ref.nodeName) && ref.nodeType == 1 && test(ref)) {
						els[els.length] = ref;
						if (!isall) {
							return ref
						}
					}
				} while ( ref = ref [ d ]);
			}
			return isall ? els: (els.length ? els[0] : [])
		},
		__fixClass: function(s) {
			return s.trim().replace(/\s+/g, ' ')
		},
		hasClass: function(el, x) { // x == live false, and is true
			return ! x || (' ' + el.className + ' ').indexOf(' ' + __getVal.call(el, x, el.className) + ' ') != -1
		},
		addClass: function(el, x) {
			if (!this.hasClass(el, x)) {
				el.className = __C.__fixClass(el.className + ' ' + x)
			}
		},
		removeClass: function(el, x, i) {
			if (__C.hasClass(el, x)) {
				el.className = __C.__fixClass((' ' + el.className + ' ').replace(RegExp(' ' + x + '(?= )', 'g'), ''))
			}
		},
		swapClass: function(el, x, y, where) {
			var cls = el.className,
			c2 = (where === undefined || where) ? [x, y] : [y, x];
			cls = (c2[0] && __C.hasClass(el, c2[0])) ? cls.replace(RegExp(c2[0], 'g'), '') : cls;
			cls += (c2[1] && !__C.hasClass(el, c2[1])) ? ' ' + c2[1] : '';
			el.className = __C.__fixClass(cls);
		},
		toggleClass: function(el, c) {
			this[this.hasClass(el, c) ? 'removeClass': 'addClass'](el, c)
		},
		createNode: function(tagName, par) {
			var node = document.createElement(tagName || 'DIV');
			if (par) {
				this.one(par).appendChild(node)
			}
			return new YNode([node], this.bindUnload(node))
		},
		bindUnload: function(node) {
			return Slice.call(arguments).each(function(node, i) {
                ! /STYLE|SCRIPT|LINK/i.test(__C.one(node).nodeName) ? (this.__UnNodes[__C.getGuid(node)] = node) : null
			}, this)
		},
		removeNode: function(el, onlychild) {
            this.$(el).each(function (el){
                if (onlychild) {
                    while (el.firstChild) {
                        el.removeChild(el.firstChild)
                    }
                } else {
                    el.parentNode && __Div.appendChild(el.parentNode.removeChild(el));
                    __Div.innerHTML = ''
                }                
            }, this)
		},
		addStyle: (function(loaded, css) {
			return function(cssText, doc) {
				var tmp, head, styles, o, doc = doc || document;
				head = doc.getElementsByTagName("head")[0];
				if (/\.css$/i.test(cssText)) {
					if (!loaded[cssText]) {
						this.createNode('link', head).attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', this.getMapPath(cssText));
						loaded[cssText] = true
					}
				} else {
					styles = head.getElementsByTagName("style");
					if (!css) {
						this.ie ? doc.createStyleSheet() : this.createNode('style', head).attr('type', 'text/css')
					}
					css = styles[styles.length - 1];
					if (css.styleSheet) {
						css.styleSheet.cssText += cssText
					} else {
						css.appendChild(doc.createTextNode(cssText))
					}
				}
				return this
			}
		})({}),
		getCursorXY: function(e, orig) {
			var doc, pos, offset;
			doc = this.getSize();
			pos = this.Point(e.clientX + doc.scrollLeft, e.clientY + doc.scrollTop);
			if (orig = this.get(orig).nodes[0]) {
				offset = this.get(orig).getXY();
				pos = pos.offset( - offset.x, -offset.y)
			} else if (this.ie) {
				pos = pos.offset( - ~~document.body.offsetLeft, -~~document.body.offsetTop)
			}
			return pos
		},
		setStyle: (function (a, uk, uf){
            return function (el, style, value){
                this.$(el).each(function (el){
                    var css = [],
                        i = 0;
                    if (value === void 0) {
                        if (!__Is.isString(style)) {
                            for (var k in style) {
                                css[i++] = k.replace(uk, uf) + ':' + style[k] + (k == 'opacity' ? ';filter:' + (style[k] == 1 ? '': (a + style[k] * 100 + ')')) : '');
                            }
                            style = css.join(';')
                        }
                        el.style.cssText += ';' + style;
                    } else {
                        el.style[style] = value;
                        if (style === 'opacity' && __B.ie) {
                            el.style.filter = value < 1 ? a + __C.getInt(value * 100) + ')': '';
                            el.style.zoom = 1
                        }
                    }                    
                })
            }
        })('progid:DXImageTransform.Microsoft.Alpha(opacity=', /[A-Z]/g, Function('i', 'return "-"+i.toLowerCase()')),
		getStyle: function(el, s, isReal) {
			return el.style[s] == '' || isReal ? (el.currentStyle || document.defaultView.getComputedStyle(el, null))[s] : el.style[s]
		},
		getDisplayVal: function(el) {
			var nn, cssVal, vals, tmp;
			nn = el.nodeName;
			cssVal = __DpVals[nn];
			if (!cssVal) {
				tmp = this.createNode(nn, document.body); // if chrom not-insert,  return display is space
				__DpVals[nn] = cssVal = tmp.getStyle('display');
				tmp.empty(true)
			}
			return cssVal == '' || cssVal == 'none' ? 'block': cssVal
		},
		setNodeDisplay: function(el, where, isshow, displayVal) {
			var cssVal = displayVal === undefined ? this.getDisplayVal(el) : displayVal,
			vals = isshow ? [cssVal, 'none'] : ['none', cssVal],
			val = where ? vals[0] : vals[1];
			if (val != this.getStyle(el, 'display')) {
				el.style.display = val
			}
		},
		showNode: function(el, where, displayVal) {
			return this.setNodeDisplay(el, arguments.length === 1 || where, true, displayVal)
		},
		hideNode: function(el, where, displayVal) {
			return this.setNodeDisplay(el, arguments.length === 1 || where, false, displayVal)
		},
		setXY: function(el, pt, isget) {
			var oriXY, o, op;
			oriXY = pt.origin ? this.getXY(el) : this.Point(0, 0);
			op = el.offsetParent;
			if (op !== document.documentElement && op !== document.body) {
				pxy = this.getXY(op);
				oriXY = oriXY.offset( - pxy.x, -pxy.y);
			}
			o = this.getObj('left', oriXY.x + ~~pt.x + 'px', 'top', oriXY.y + ~~pt.y + 'px');
			return isget ? o: this.setStyle(el, o)
		},
		getXY: function(el, orig) {
			var xy, xy2, doc, el;
			xy = el.getBoundingClientRect();
			if (orig = this.get(orig).nodes[0]) {
				xy2 = orig.getBoundingClientRect();
				return this.Point(xy.left - xy2.left, xy.top - xy2.top)
			} else {
				doc = this.getSize();
				return this.Point(xy.left + doc.scrollLeft, xy.top + doc.scrollTop)
			}
		},
		getRect: function(el, free) {
			var dr, pt, s, oldCss;
			if (arguments.length == 0) { // body-client
				dr = this.getSize();
				return this.Rect(dr.scrollLeft, dr.scrollTop, dr.offsetWidth, dr.offsetHeight)
			} else {
				el = this.one(el);
				oldCss = el.style.cssText;
				el.style.cssText += (this.get(el).getStyle('display') == 'none' ? ';display:' + this.getDisplayVal(el) : '') + (free ? ';height:auto;float:left': '');
				pt = free ? {}: this.get(el).getXY();
				rect = this.Rect(pt.x, pt.y, el.offsetWidth, el.offsetHeight, pt.z);
				el.style.cssText = oldCss;
				return rect
			}
		},
		getSize: function(el, win) {
			var fix, doc, dd, db;
			fix = this.ie < 9 ? 2 : 0; // ie6/7/8 bug 2px on body border
			win = win || window;
			dd = win.document.documentElement;
			db = win.document.body;
			doc = win.document.compatMode == "CSS1Compat" ? dd: db;
			if (el == void(0) || el == dd || el == document.body) {
				return {
					scrollLeft: Math.max(dd.scrollLeft, db.scrollLeft) - fix,
					scrollTop: Math.max(dd.scrollTop, db.scrollTop) - fix,
					scrollWidth: doc.scrollWidth,
					scrollHeight: Math.max(doc.clientHeight, doc.scrollHeight),
					offsetWidth: doc.clientWidth,
					offsetHeight: doc.clientHeight
				}
			}
			return this.one(el)
		},
		wheel: function(el, fn) {
			var type = 'onmousewheel' in document ? 'mousewheel': 'DOMMouseScroll';
			return this.get(el).on(type, function Aop(e, Y) {
				var delta, fix;
				delta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
				fix = window.opera && window.opera.version() < 10 ? -1 : 1;
				e.end();
				e.offset = Math.round(delta) * fix;
				fn.call(e.target, e, Y);
			})
		},
		loadIframe: function(win, fn) {
			win = this.one(win);
			win.attachEvent ? win.attachEvent("onload", _load) : (win.onload = _load);
			return this;
			function _load() {
				fn.call(win.contentWindow);
				win.detachEvent ? win.detachEvent("onload", _load) : (win.onload = null)
			}
		},
		fx: function(fn, config) {
			var start, mutex, timer, tween, useTime, Y, end, pos, mutex, over, totalTime;
			Y = this;
			config = Object(config);
			totalTime = this.getInt(config.time, 480);
			start = new Date;
			mutex = config.mx;
			over = config.over;
			tween = config.tween instanceof Function ? config.tween: function(x) {
				return.5 - Math.cos(x * Math.PI) / 2
			};
			end = config.end || this.getNoop();
			if (!config.init || false !== config.init.call(Y)) {
				if (mutex && mutex in this.__FxMutexs) {
					if (over || over === void 0) {
						this.endFx(this.__FxMutexs[mutex])
					} else {
						return
					}
				}
				timer = setInterval(function() {
					if (Y.$_pause || Class.config('$_pause')) {
						start = new Date - useTime; // pause
					} else {
						useTime = new Date - start;
						pos = Math.min(1, useTime / totalTime);
						if (false === fn.call(Y, pos2val, pos) || pos === 1) {
							Y.endFx(timer)
						}
					}
				},
				this.getInt(this.$_hz, 10));
				this.addTimer(timer, end, mutex);
			}
			return timer;
			function pos2val(f, t, x, f2) {
				var n = +f + (t - f) * Math.min(1, (f2 || tween)(pos)); // mulit tween
				return x ? n.toFixed(2) : ~~n
			}
		},
		addTimer: function(timer, end, mutex) {
			this.__FxTimers[timer] = this.getObj('end', end, 'mutex', mutex);
			if (mutex) {
				this.__FxMutexs[mutex] = timer;
			}
			return timer
		},
		endFx: function(timer) { //stop instance fx and run end
			if (this.__FxTimers) {
				if (timer) { // has pass timer
					var o = Object(this.__FxTimers[timer]);
					if (o.end) {
						o.end.call(this);
						delete this.__FxMutexs[o.mutex]; // mutex
					}
					delete this.__FxTimers[timer]; // timer
					clearInterval(timer);
					clearTimeout(timer)
				} else {
					for (var k in this.__FxTimers) { // all fx
						this.endFx(k)
					}
				}
			}
			return this
		},
		getColor: function(x, y, s) {
			return x.replace(/[^#]{2}/g, function(m, i) {
				return ('0' + parseInt(parseInt(m, 16) * (1 - s) + parseInt(y.slice(i, i + 2), 16) * s).toString(16)).slice( - 2)
			})
		},
		cookie: function(key, val, attr) {
			var n, m, more;
			n = arguments.length;
			if (n == 0) {
				return log(decodeURI(document.cookie).replace(/; */g, '\n\r\n\r'))
			} else if (n == 1) {
				m = document.cookie.match('(?:^| )' + key + '(?:(?:=([^;]*))|;|$)');
				return m ? decodeURI(m[1]) : void 0
			}
			more = [encodeURI(key.trim()) + '=' + encodeURI(val.toString().trim())];
			for (var k in attr) {
				more[more.length] = k == 'timeout' ? 'expires=' + new Date( + new Date() + 1000 * attr.timeout).toUTCString() : (k + '=' + attr[k])
			}
			document.cookie = more.join(';')
		},
		param: function(obj, url) {
			var s, o, arr;
			if (!this.isString(obj)) {
				s = [];
				for (var k in obj) {
					o = obj[k];
					if (o instanceof Array) { //array to key[]=value
						for (var i = 0,
						j = o.length; i < j; i++) {
							s[s.length] = k + '[]=' + o[i]
						}
					} else {
						s[s.length] = k + '=' + obj[k]
					}
				}
				obj = s.join('&')
			}
			if (this.isString(url)) { // meger param and url
				arr = url.split('?');
				obj = obj ? (arr[0] + '?' + (obj + (arr[1] && arr[1].indexOf('#') != 0 ? '&': '')) + url.slice(arr[0].length + 1)) : url
			}
			return obj.replace(/&+/g, '&').replace(/\?&+/, '?')
		},
		qForm: function(form, encode) {
			var f = this.one(form);
			return (function(fe, o, el, val) {
				for (var i = 0,
				l = fe.length; i < l; i++) {
					el = fe[i];
					val = false;
					if (el.name) {
						if (/select/i.test(el.type)) {
							val = el.selectedIndex > -1 ? el.value: false
						} else if (/checkbox|radio/i.test(el.type)) {
							val = el.checked !== false ? el.value: false
						} else {
							val = el.value
						}
						if (false !== val) {
							o[el.name] = encode ? encodeURIComponent(val) : val;
						}
					}
				}
				return o
			})(f.elements, {})
		},
		sendForm: function(ini) { // form, end, url, enctype="multipart/form-data", data, type, target
			var win, fn, form, Y, html, tmpInputs, tmpForm, data;
			Y = this;
			if (ini.form) {
				form = Y.need(ini.form);
			} else { // create form
				tmpForm = form = this.get('<form method="' + (ini.type || 'POST') + '" ' + (ini.isupload ? ' enctype="multipart/form-data"': '') + '></form>').insert();
			}
			if (!ini.target) { // post to iframe
				win = document.getElementById('yclass_send_iframe');
				if (!win) { // create iframe
					win = this.get('<div style="position:absolute;left:-9999px">' + '<iframe id="yclass_send_iframe" name="yclass_send_iframe" src="about:blank"></iframe></div>').insert().find('iframe').one();
				}
				ini.target = 'yclass_send_iframe'
			}
			form.prop('target', ini.target).prop('action', function(action) {
				return ini.url || action
			});
			url = form.prop('action');
			if (data = ini.data) { // create hidden
				tmpInputs = this.createNode('div', form);
				for (var k in data) {
					if (__Is.isArray(data[k])) { // for PHP array param
						data[k].each(function(v) {
							__C.__insertInput(tmpInputs.one(), k + '[]', v)
						})
					} else {
						__C.__insertInput(tmpInputs.one(), k, data[k])
					}
				}
			}
			if (ini.end) {
				fn = function() {
					var data, doc;
					try {
						doc = win.contentWindow.document
					} catch(e) {
						doc = {}
					};
					data = Y.getObj('error', !doc.body, 'url', url);
					try {
						data.text = doc.body.innerHTML
					} catch(e) {
						data.text = ''
					}
					try {
						data.xml = Y.ie ? doc.XMLDocument || null: doc
					} catch(e) {
						data.xml = null
					}
					ini.end.call(Y, data);
					Y.ie ? win.detachEvent('onload', fn) : win.onload = null
				};
				Y.ie ? win.attachEvent("onload", fn) : win.onload = fn;
			}
			form.one().submit();
			tmpInputs && tmpInputs.empty(true);
			tmpForm && tmpForm.empty(true);
		},
		__insertInput: function(form, key, val) {
			var hid = document.createElement('INPUT');
			hid.type = 'hidden';
			hid.name = key;
			hid.value = val;
			form.appendChild(hid)
		},
		getXHR: (function(x) {
			return window.ActiveXObject ? function() {
                try{
                    return new ActiveXObject(x)
                }catch(e){
                    return new ActiveXObject(x = 'Microsoftf.XMLHTTP')
                }
			}: function() {
				return new XMLHttpRequest
			}
		})('Msxml2.XMLHTTP'),
		ajaxQuery: function(config) {
			var xhr, query, isPost, param, url, lastModify, Y, backData;
			xhr = this.getXHR();
			query = {
				type: 'GET',
				data: null,
				encode: 'UTF-8',
				end: this.getNoop(),
				__nextQuery: this.getNoop(),
				time: 0,
				cache: !!this.C('$_ajaxCache'),// global set
				retry: 3,
				retime: 200
			};
			this.mix(query, config);
			query.url = config.url || location.href;
			query.async = !!config.end; // config.end to async
			isPost = query.type.toUpperCase() == 'POST';
			param = isPost ? this.param(query.data) : null;
			url = isPost ? query.url: this.param(query.data, query.url);
			xhr.open(query.type, url, query.async);
			if (isPost) {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=' + query.encode)
			}
			lastModify = query.cache ? (__AjaxUrls[query.url] || 0) : 0;
			xhr.setRequestHeader('If-Modified-Since', lastModify);
			if (__AjaxUrls[query.url + 'ETag']) {
				xhr.setRequestHeader('If-None-Match', __AjaxUrls[query.url + 'ETag'])
			}
			if (!query.hideType) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
			}
			Y = this;
			if (query.async) {
				xhr.onreadystatechange = function() {
					var ok, backData;
					if (xhr.readyState == 4) {
						clearTimeout(query.timer);
						ok = xhr.status == 200;
						if (ok && query.cache) {
							__AjaxUrls[query.url] = xhr.getResponseHeader('Last-Modified');
							__AjaxUrls[query.url + 'ETag'] = xhr.getResponseHeader('ETag');
						}
						backData = {
							url: config.url,
							text: xhr.responseText,
							xml: xhr.responseXML,
							status: xhr.status,
							error: xhr.status != 200 ? xhr.status: false,
							date: Date.parse(xhr.getResponseHeader('Date')),
							type: query.type,
							returnValue: query.returnValue
						};
						xhr.status != 200 && xhr.status != 304 && (--query.retry) > 0 ? setTimeout(function() {
							Y.ajaxQuery(query)
						}, query.retime) : query.__nextQuery(ok ? query.end.call(Y, backData, config) : undefined);
						__Err && log(Y.Type + '> \u8c03\u7528Ajax:', '\u5730\u5740: ' + url, '\u53c2\u6570:', param ? param: 'None', '\u72b6\u6001\u7801:', xhr.status, '\u6e90\u6587\u4ef6:', backData.error ? xhr.status: xhr.responseText);
						stop()
					}
				};
				if (query.time > 0) {
					query.timer = setTimeout(function() {
						stop();
						query.__nextQuery(query.end.call(Y, {
							error: 'timeout'
						}))
					}, query.time)
				}
				function stop() {
					xhr.onreadystatechange = __Noop;
					xhr.abort();
					xhr = null
				}
			}
			xhr.send(param);
			if (!query.async) {
				backData = {
					xml: xhr.responseXML,
					text: xhr.responseText,
					date: Date.parse(xhr.getResponseHeader('Date')),
					error: xhr.status != 200 ? xhr.status: false,
					status: xhr.status
				};
				xhr.abort();
				xhr = null
			}
			return query.async ? this: backData
		},
		ajax: (function(count, wait) {
			return function() {
				var A, querys, Y;
				querys = A = Slice.call(arguments);
				Y = this;
				if (this.isString(A[0])) {
					querys = [this.getObj('url', A[0], 'end', A[1], 'data', Object(A[2]), 'type', A[3] || 'GET')]
				}
				if (count >= Y.ajaxQuery.max) {
					return wait[wait.length] = querys
				}
				for (var i = 0, l = querys.length; i < l; i++) {
					querys[i].__nextQuery = function(prev) {
						var next, nextQuee;
						next = querys.shift();
						if (next && prev !== false) {
							next.returnValue = prev;
							Y.ajaxQuery(next)
						} else {
							count--;
							if (nextQuee = wait.shift()) {
								Y.ajax.apply(Y, nextQuee)
							}
						}
					}
				}
				count += querys.end ? 1 : 0; // only async add count
				return this.ajaxQuery(querys.shift())
			}
		})(0, []),
		XMLNode: function(node, tag_text) {
			return (function(text, o, attrs, n, s, subs) {
				if (node && node.nodeType == 1) {
					if (tag_text) { // get childNodes text list: {nodeName: text}
						subs = node.childNodes;
						for (var i = subs.length; i--;) {
							s = subs[i];
							if (s.nodeType == 1) {
								o[s.nodeName] = s.text || s.textContent || ''
							}
						}
						text = node.text || node.textContent || ''
					} else {
						attrs = node.attributes;
						for (var j = 0, n = attrs.length; j < n; j++) {
							o[attrs[j].nodeName] = attrs[j].nodeValue
						}
						text = node.text || node.textContent || ''
					}
				}
				return {
					node: node,
					items: o,
					text: text
				}
			})('', {}, {})
		},
		qXml: function(find, doc, each, sub) {
			return (function(NS, sub, arr, qTag, n, q) {
				if (doc) {
					if ('selectNodes' in sub) {
						arr = sub.selectNodes(find)
					} else {
						if (q = doc.evaluate(find, sub, doc.createNSResolver(doc.documentElement), XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)) {
							for (n = q.iterateNext(); n; n = q.iterateNext()) {
								arr[arr.length] = n
							}
						}
					}
					if (each) {
						for (var i = 0, l = arr.length; i < l; i++) {
							if (false === each.call(NS, NS.XMLNode(arr[i], qTag), i)) {
								break
							}
						}
					}
				}
				NS.qXml.tagMode = false;
				return arr
			})(this, sub || doc, [], this.qXml.tagMode)
		},
		loadScript: (function(cache, n, loading) {
			return function(url, fn, ini) {
				var _cbs, h, script, Y, config;
				url = this.getMapPath(url, true); // fix url
				if (cache[url]) { // loaded
					return fn && fn.call(this)
				}
				_cbs = loading[url]; // mulit load one
				if (_cbs && _cbs instanceof Array) {
					return _cbs[_cbs.length] = fn // wait
				}
				_cbs = loading[url] = [fn]; // first
				h = this.one("head");
				Y = this;
                ini = Object(ini);
				script = document.createElement("SCRIPT");
				this.ie ? this.on(script, 'readystatechange', _onload) : (script.onload = _onload);
				this.mix(script, this.getObj('type', 'text/javascript', 'charset', (ini.charset || 'utf-8'), 'src', url));
				h.firstChild ? h.insertBefore(script, h.firstChild) : h.appendChild(script);
				function _onload(e) {
					if (!this.readyState || 'loaded|complete'.indexOf(this.readyState) > -1) {
						this.ie ? Y.un(script) : (script.onload = null);
						cache[url] = true;
						for (var i = 0, j = _cbs.length; i < j; i++) {
							if (Y.isFunction(_cbs[i])) {
								_cbs[i].call(Y)
							}
						}
						delete loading[url];
						h.removeChild(script)
					}
				}
			}
		})({}, 1, {}),
		use: function(mods, fn, ini) {
			var l, n, Y;
            if (this.isString(mods)) {
                mods = mods.replace(/\s+/g, '').split(',')
            }else if(this.isFunction(mods)){
                return this.ready(mods)
            }
            l = n = mods.length;
            Y = this;
            this.ready(function (){
                for (var i = 0; i < l; i++) {
                    this.loadScript(this.getMapPath(mods[i], true), ok, ini)
                }
            });
            function ok() {
                if (--n == 0 && fn) {
                    fn.call(Y)
                }
            } 
            return this;
		},
		remove: function() {
			this.__Unload()
		},
		showAllMsg: function() {
			log(__Msgs)
		},
		onMsg: function(type, fn) {
			__Msgs[type] = this.isArray(__Msgs[type]) ? __Msgs[type] : [];
			__Msgs[type].push({
				guid: this.getGuid(this),
				fn: fn,
				yobj: this
			})
		},
		postMsg: function(type) {
			return (function(Y, center, er, args, msg, queue, reValue, guid, o) {
				if (queue = center[type]) {
					for (var i = 0, j = queue.length; i < j; i++) {
						o = queue[i];
						er[er.length] = o.yobj.Type;
						reValue = o.fn.apply(o.yobj, args);
						if (undefined !== reValue) {
							msg = {
								'sender': o.yobj + '',
								data: reValue
							};
							break 
						}
					}
				}
				__Err && log(Y.Type + '> \u8bf7\u6c42\u670d\u52a1: ' + type, '\u9644\u52a0\u53c2\u6570:', args.length ? args.join('\n') : 'None', '\u56de\u590d\u8005:', 'sender' in msg ? msg.sender + '': 'None', '\u8fd4\u56de\u6570\u636e:', 'data' in msg ? msg.data: 'None', '\u5df2\u9001\u8fbe:', er.join('\n'));
				return Y.mix(msg, {
					length: er.length
				})
			})(this, __Msgs, [], Slice.call(arguments, 1), {})
		},
		removeMsg: function(type) {
            var guid = this.getGuid(this);
            if (type && (type in __Msgs)) {
                __Msgs[type].remove(Function('o', 'return o.guid == "'+guid+'"'))
            } else {
                for (type in __Msgs) {
                    this.removeMsg(type)
                }
            }
		},
		toString: new Function('return this.Type+""')
	});
	__C.mix(__C, __B);
	__C.mix(__C, __Is);
	function YNode(arr, ns, lastNodes) {
		this.lastNodes = __Is.isArray(lastNodes) ? lastNodes: [];
		this.nodes = __Is.isArray(arr) ? arr: [];
		this.ns = ns
	}
	__C.mix(YNode.prototype, {
		each: function(fn, _b) {
			_b = _b || this;
			for (var i = 0, o = this.nodes, j = o.length; i < j; i++) {
				if (false === fn.call(_b, o[i], i, o)) {
					break
				}
			}
			return _b
		},
		size: function() {
			return this.nodes.length
		},
		one: function(n) {
			n = ~~n;
			return this.nodes[n < 0 ? Math.max(0, this.nodes.length + n) : n]
		},
		eq: function(n) {
			var one = this.one(n);
			return new YNode(one ? [one] : [], this.ns, this.nodes)
		},
		on: function(type, fn, one) {
            this.ns.on(this.nodes, type, fn, one);
			return this
		},
		un: function(type, fn) {
            this.ns.un(this.nodes, type, fn);
			return this
		},
		live: function(selector, type, fn) {
			var query = selector.match(__rParseGroup);
			type = type == 'focus' ? 'focusin': type == 'blur' ? 'focusout': type;
			return this.on(type, function(e, o) {
				var src = e.target;
                do{
                    if (__C._isMatchNode(src, query, this)) {
                        return fn.call(src, e, o)
                    }
                }while((src = src.parentNode) && src !== this)
			})
		},
		fireEvent: function(type, data) {
            return this.nodes.each(function (el){
 				if (document.createEventObject) {
					return el.fireEvent('on' + type, __C.mix(document.createEventObject(), data))
				} else {
					var e = document.createEvent("HTMLEvents");
					e.initEvent(type, true, true);
					return ! el.dispatchEvent(__C.mix(e, data))
				}               
            }, this)
		},
		getBgXY: (function() {
			return __B.ie ? function() {
				return __C.Point.apply(this, [this.getStyle('backgroundPositionX'), this.getStyle('backgroundPositionY')])
			}: function() {
				return __C.apply(this, this.getStyle('backgroundPosition').split(' '));
			}
		})(),
		getStyle: function(type, isReal) {
			return this.size() ? this.ns.getStyle(this.one(), type, isReal) : void 0
		},
		setStyle: function(key, val) {
			return this.each(function(el, i) {
				this.ns.setStyle(el, key, val)
			})
		},
		setTopmost: function(offset) {
			var z = Class.C('-sys-topmoust-z');
			offset = ~~offset || 1;
			if (!z) {
				 Class.C('-sys-topmoust-z', z = 50 * 10000)
			}
			z += offset;
			this.setStyle('zIndex', z);
			if (offset > 0) {
				 Class.C('-sys-topmoust-z', z)
			}
			return this
		},
		getSize: function() {
			return __C.getSize(this.one())
		},
		setCenter: function(isGet, equal) { // default is gold scale
			var el, css, w, h, pt, sl, psl, off, ph, py, pwin;
			if (el = this.nodes[0]) {
				this.setStyle('position:absolute');
				off = el.offsetParent != document.body && el.offsetParent != document.documentElement ? this.get(el.offsetParent).getXY() : __C.Point(0, 0);
				psl = sl = __C.getSize(); // scroll
				py = 0;
				try {
					if (parent != window) { // is iframe
						psl = __C.getSize(void 0, parent);
						if (pwin = this.getParentIframe()) {
							do {
								py += pwin.offsetTop
							} while ( pwin = pwin.offsetParent ) // iframe top
						}
					}
				} catch(e) {}
				w = el.offsetWidth;
				h = el.offsetHeight;
				pt = __C.Point(__C.getInt((sl.offsetWidth - w) / 2 + sl.scrollLeft - off.x), Math.min(sl.scrollHeight - h - 10, Math.max(0, __C.getInt((psl.offsetHeight - h) * (equal ? .5 : .382) + psl.scrollTop - off.y - py))));
			}
			return isGet ? pt: this.setXY(pt)
		},
		getParentIframe: function() {
			var allIfa, ifa, i;
			if (parent != window) {
				allIfa = parent.document.getElementsByTagName('IFRAME');
				for (i = allIfa.length; i--;) {
					if (allIfa[i].contentWindow == window) {
						ifa = allIfa[i];
						break
					}
				}
			}
			return ifa
		},
		fade: function(val) {
			if (arguments.length === 0) {
				var opy = this.getStyle('opacity');
				return __B.ie ? opy === void(0) ? 1 : opy: opy;
			}
			return this.setStyle('opacity', val)
		},
		fadeTo: function(to, end, time) {
			var x, o;
			return this.each(function(el) {
				x = this.fade();
				this.ns.fx(function(f, i) {
					this.setStyle(el, 'opacity', f(x, to, true));
				},
				__C.getObj('end', end, 'time', time, 'mx', this.ns.getGuid(el), 'tween', __Noop))
			})
		},
		setXY: function(pt) {
			return this.each(function(el, i) {
				this.ns.setXY(el, pt)
			})
		},
		getXY: function(orig) {
			return this.size() ? this.ns.getXY(this.one(), orig) : this.ns.Point(0, 0)
		},
		insert: function(b, c, reverse) { // mover("<strong>html</strong>"), ref, pos
			var fragment, Y, l, isInsertSub, next, outer, inner;
			Y = this.ns;
			fragment = document.createDocumentFragment();
			b = b === void 0 ? document.body: Y.one(b);
			b = b.nodeName.like('table') ? b.getElementsByTagName('TBODY')[0] : b;
			l = b.childNodes ? b.childNodes.length: 0;
			this.nodes.each(function(node, i) { // return nodes Array
				fragment.appendChild(node);
				if (c == 'wrap') {
					b.parentNode.insertBefore(node, b);
					node.appendChild(b)
				} else if (c == 'inwrap') {
					Y.get(b.childNodes).insert(node);
					b.appendChild(node)
				}
			});
			if ((c + '').indexOf('wrap') == -1) {
				if (c == 'prev') {
					b.parentNode.insertBefore(fragment, b);
				} else if (c == 'next') {
					b.nextSibling ? b.parentNode.insertBefore(fragment, b.nextSibling) : b.parentNode.appendChild(fragment)
				} else { (c == void 0 || l == 0 || c == -1 || c >= l) ? b.appendChild(fragment) : b.insertBefore(fragment, b.childNodes[~~c])
				}
			}
			return this
		},
		html: function(Html) {
			return arguments.length == 0 ? (this.size() ? this.one().innerHTML: '') : this.nodes.each(function(el, i) {
				if (__B.ie && __IsTTag.test(el.nodeName)) { // is table elements and is ie
					el = el.nodeName.like('table') ? el.getElementsByTagName('TBODY')[0] : el;
					while (el.firstChild) {
						el.removeChild(el.firstChild)
					}
					return this.get(__getVal.call(el, Html, el.innerHTML, i)).insert(el)
				}
				el.innerHTML = __getVal.call(el, Html, el.innerHTML, i)
			}, this)
		},
		data: function(key, val) {
			return arguments.length == 1 ? (this.size() ? this.ns.attr(this.one(), key) : undefined) : this.each(function(el, i) {
				this.ns.attr(el, key, val)
			})
		},
		attr: function(key, val) {
			return arguments.length == 1 ? (this.size() ? this.one().getAttribute(key, __rUrlAttr.test(key) ? 2 : 0) : undefined) : this.each(function(el, i) {
				el.setAttribute(key, __getVal.call(el, val, el.getAttribute(key, __rUrlAttr.test(key) ? 2 : 0), i))
			})
		},
		prop: function(key, val) {
			return arguments.length == 1 ? (this.size() ? this.nodes[0][key] : undefined) : this.each(function(el, i) {
				el[key] = key.indexOf('on') == 0 ? val: __getVal.call(el, val, el[key], i)
			})
		},
		doProp: function(fn, a, b, c, d, e, f, g) {// ie6-7 apply or call error
			var args = Slice.call(arguments, 1);
			return this.each(function(el) {
				el[fn] && (el[fn] + '').indexOf('function') > -1 ? el[fn](a, b, c, d, e, f, g) : false
			})
		},
		val: function(val, def) {
			return arguments.length == 0 ? (this.size() ? this.one().value: '') : this.each(function(el, i) {
				var attr = /input|textarea|script/i.test(el.nodeName) ? 'value': 'innerHTML';
				el[attr] = __getVal.call(el, val, el[attr], i)
			})
		},
		empty: function(andSelf) {
			this.ns.removeNode(this.nodes, !andSelf);
            if (andSelf) {
                this.nodes.length = 0
            }
			return this
		},
		get: function() {
			return new YNode(this.ns.$.apply(this.ns, arguments), this.ns, this.nodes)
		},
		find: function(selector) {
			for (var i = 0, subs = [], j = this.nodes.length; i < j; i++) {
				subs = subs.concat(this.ns.$(selector, this.nodes[i]))
			}
			return new YNode(__C._uniqueObj(subs), this.ns, this.nodes)
		},
		end: function() {
			return new YNode(this.lastNodes, this.ns, this.nodes)
		}
	});
    ("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover " +
        "mouseout mouseenter mouseleave change select submit keydown keypress keyup error losecapture wheel").split(" ").each(function(type) {
		this[type] = function(fn, one) {
			return this.on.call(this, type, fn, one)
		}
	}, YNode.prototype);
	YNode.prototype.hover = function(enter, leave, one) {
		return this.on('mouseenter', enter, one).on('mouseleave', leave, one)
	};
	'next,nexts,prev,prevs,child,childs,parent,parents'.split(',').each(function(type, i) { // noden nav
		this[type] = function(selector) { // for one or all nodes
			var nodes, _new = [],
			prop = type.match('^(\\w+?)(s)?$');
			this.nodes.each(function(el) {
				if (nodes = __C.nav(el, 'get' + prop[1], selector, !!prop[2])) { // isall
					_new = _new.concat(nodes)
				}
			});
			return new YNode(__C._uniqueObj(_new), this.ns, this.nodes)
		}
	}, YNode.prototype);
	'slice,concat,filter,remove,sort,reverse,splice'.split(',').each(function(ext, i) {
		this[ext] = function() {
			return new YNode(this.nodes[ext].apply(this.nodes.slice(), arguments), this.ns, this.nodes)
		}
	}, YNode.prototype);
	'addClass,removeClass,toggleClass,swapClass'.split(',').each(function(ext, i) {
		this[ext] = function(a, b, c) {
			return this.each(function(el, i) {
				this.ns[ext](el, __getVal.call(el, a, el.className, i), __getVal.call(el, b, el.className, i), c)
			})
		}
	}, YNode.prototype);
	'show,hide'.split(',').each(function(ext, i) {
		this[ext] = function() {
			var A = Slice.call(arguments);
			return this.each(function(item, i) {
				this.ns[ext + 'Node'].apply(this.ns, [item].concat(A))
			})
		}
	}, YNode.prototype);
	if (window.Node && Node.prototype && !Node.prototype.contains) {
		Node.prototype.contains = function(el) {
			do {
				if (el == this) {
					return true
				}
			} while ( el && ( el = el.parentNode ));
			return false
		}
	}
	__C.ajaxQuery.max = 2;
	__C.addNoop('index,onunload,indexBefore');
	__C.__DomDatas = {}; // attr box
	(function(D) {
		var queue, doScroll, loaded, fn, w3cReady, ieReady, begin;
		queue = [];
		doScroll = D.documentElement.doScroll;
		begin = function() {
			queue.reverse();
			while (fn = queue.pop()) {
				fn()
			}
			loaded = true;
            __initLog()
		};
		if (D.readyState === 'complete') {
			begin()
		}
		if (D.addEventListener) {
			w3cReady = function() {
				D.removeEventListener('DOMContentLoaded', w3cReady, false);
				begin()
			};
			D.addEventListener('DOMContentLoaded', w3cReady, false);
			window.addEventListener('load', begin, false)
		} else {
			ieReady = function() {
				if (D.readyState === 'complete') {
					begin();
					D.detachEvent('onreadystatechange', ieReady)
				}
			};
			D.attachEvent('onreadystatechange', ieReady);
			window.attachEvent('onload', begin);
			if (window == window.top) {
				function readyScroll() {
					try {
						doScroll('left');
						setTimeout(begin, 72)
					} catch(e) {
						setTimeout(readyScroll, 1)
					}
				}
				readyScroll()
			}
		}
		__C.ready = function(fn) {
			loaded ? fn.call(this) : queue.push(fn.proxy(this))
		};
	})(document);
	if (__B.ie) {//vml
		document.writeln('<' + '?import namespace="v" urn="urn:schemas-microsoft-com:vml" implementation="#default#VML" declareNamespace />');
	}
    try{
        document.execCommand("BackgroundImageCache", false, true)
    }catch(e){}
	var Class = function(classPath, props) {
        var clazz, superClass, superObject, proto, name, link,
            ini = {},
            newProps = {},
            instances = [];
        switch (arguments.length) {
        case 0:
            return new(Class({}));
        case 1:
            props = __Is.isString(classPath) ? {}: classPath; 
            classPath = __Is.isString(classPath) ? classPath: ''
        }
        if (props instanceof Function) {
            props = __C.getObj('index', props)
        }
        for (var k in props) {
            if (__isClassOpts.test(k)) {
                ini[k] = props[k]
            } else {
                newProps[k] = props[k]
            }
        }
        __C.error('Class name need a String', !__Is.isString(classPath));
        link = [false].concat(classPath.replace(/\s+/g, '').split('>')).slice( - 2);
        name = link[1] || 'None';
        __C.error('Class():\u540c\u540d\u7c7b"' + name + '"\u5df2\u5b58\u5728', name in Class.lib);
        superClass = ini.Extends ? ini.Extends: link[0];
        if (typeof superClass == 'string') {
            superClass = Class.lib[superClass];
            __C.error('not found Class "' + link[0] + '" in Lib', !superClass) // from Lib
        }
        __C.error('Class():"' + name + '"\u7684\u7236\u7c7b\u5fc5\u987b\u4e3a\u51fd\u6570\u7c7b\u578b', superClass && !(superClass instanceof Function)); // need is a Function
        clazz = function (z, y, x, w, v, u, t, s, r, q, p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, a) {
            var args = Slice.call(arguments);
            if (args.length < 20) {
                return new clazz(z, y, x, w, v, u, t, s, r, q, p, o, n, m, l, k, j, i, h, g, f, e, d, c, b, a)
            }
            if (ini.single && instances.length > 0) {
                return instances[0]
            }
            instances.push(this);
            this.Class = clazz; //*
            this.Type = name;
            this.__Events = {};
            this.__UnNodes = {};
            this.__FxTimers = {};
            this.__FxMutexs = {};
            if (ini.use && (this.isString(ini.use) || this.isArray(ini.use))) {
                this.use(ini.use, function() {
                    this.index.apply(this, args);
                    this.indexBefore()
                })
            } else {
                this.index.apply(this, args);
                this.indexBefore()
            }
        };
        if (name != 'None') {
            Class.lib[name] = clazz
        }
        __C.mix(newProps, {
            index: function() {
                this.base.apply(this, arguments)
            }
        }, false); // add index for recall this
        superObject = superClass ? superClass.prototype: __C;
        proto = __C.newSub(superObject); // create a proxy level
        proto.__Unload = function() { 
            if (('__Events' in this) && false !== this.onunload()) {
                this.endFx().clearEvents().removeMsg();
                if ('yclassuid' in this) { // del attr
                    delete this.__DomDatas[this['yclassuid']]
                }
                for (var k in this.__UnNodes) { // del dom node
                    this.removeNode(this.__UnNodes[k])
                }
                for (k in this) {
                    delete this[k]
                }
                instances.remove(this)
            }
        };
        newProps.__YProto__ = superObject;
        clazz.prototype = __C.mix(proto, newProps);
        clazz.each = function(fn, _b) {
            instances.slice().each(fn, _b)
        };
        __AllClass.push(clazz);
        if (ini.ready) {
            ini.single = true;
            __C.ready(clazz)
        }
        if (ini.style) { //add styleSheet on Class define (not on instace !!)
            __C.addStyle(ini.style);
        }
        return clazz
    };
	__C.lib = Class.lib = {};
	Class.createFactory = function(name, fn) { // factory mode
		__C.error('FactoryClass():\u540c\u540d\u7c7b"' + name + '"\u5df2\u5b58\u5728', name in Class.lib);
		__C.lib[name] = fn.proxy(__C.mix(__C.newSub(__C), {
			Type: name
		}))
	};
    (function(scripts, __Sysini, __readOnly, coreScript) {
		coreScript = scripts[scripts.length - 1];
		__Sysini.CorePath = coreScript.getAttribute('src', 2).replace(/[^\/]+\.js(\?.*)?$/i, '');
		Class.config = Class.C = __C.C = function(a, b, c) {
			var r, len = arguments.length;
			r = len == 0 ? log(__Sysini) : (len == 1 ? __Sysini[a] : (__Sysini[a] = __C.error('\u4e0d\u80fd\u5bf9\u53ea\u8bfb\u9879"' + a + '"\u8d4b\u503c', a in __readOnly, b)));
			c === true ? __readOnly[a] = c: null; // set readOnly
			return r
		};
		Class.extend = __C.extend = function(key, value, over) {
			__C[key] = __C.error((this.Type || 'Class') + '.extend("' + key + '"): key exists', !over && (key in __C), value)
		};
        Class.fn = 	__C.fn = YNode.prototype;
		Class.addExpr = __C.addExpr = function(key, value) { // add query expr
			__QExpR[key] = __C.error((this.Type || 'Class') + '.addExpr("' + key + '"): rule name exists', key in __QExpR, value);
		};
		Y = Yobj = __Yobj = new Class; // create default obj
	})(document.getElementsByTagName('script'), {}, {});
	window.Class = yclass = YClass = Class
})();
var log = function (s){alert(s)};
function __initLog(){log=(function(){var getTree=function(data){var toStr=Object.prototype.toString,_=arguments,json=[],x=[],type=toStr.call(data).replace(/[\[\] ]|object/ig,'').toLowerCase()||(data?'object':data===null?'null':'undefined'),br='\n',iv=_[2]==void(0)?'':_[2]+'    ';var k=iv+(_[1]!==void(0)?'"'+_[1]+'":':'');if(iv.length>36){return json.concat(k+'[\u9012\u5f52\u6ea2\u51fa]').join('')}if(type=='array'){var N=data.length;json.push(k+'['+(N?br:''));for(var i=0;i<N;i++){x.push(getTree(data[i],void(0),iv))}json.push(x.join(','+br),(N?br+iv:'')+']')}else if(type=='object'&&data instanceof Object){var N=0;for(var u in data){N++}json.push(k+'{'+(N?br:''));for(var u in data){if(u.indexOf('__')!=0&&data.hasOwnProperty(u)){var sub=data[u]&&data[u].Type?''+data[u]:data[u];x.push(getTree(sub,u,iv))}}json.push(x.join(','+br),(N?br+iv:'')+'}')}else{data=data===void(0)||data===null?data:(type=='object'&&!(data instanceof Object))?'[Native object]':(type=='function'?'@Func':data.Type?(data+''):data);json.push(k+(type=='string'?'"'+data+'"':data))}return json.join('')};return(function(html,q,w,o,old,b,timer){return function(){if(!w){w=Yobj.createNode('textarea',document.body);o=w.one();old=o.style.cssText='width:320px;height: 480px;overflow: auto;right: 0;bottom: 0;position: '+(Yobj.ie==6?'absolute':'fixed')+';border:3px solid #7F9DB9;border-right:none;border-bottom:none;background:#000;color:#ccc;font: 12px/1.2 verdana;z-index:99999999';w.keydown(function(e){if(e.keyCode===27||e.keyCode===18){w.hide()}else if(e.shiftKey){if(b=!b){w.setStyle('width:99%;height:'+(Yobj.ie==6?(Yobj.getSize().offsetHeight-9)+'px':'100%'))}else{o.style.cssText=old}}})}var data=[],args=[].slice.call(arguments);for(var i=0,j=args.length;i<j;i++){data.push(getTree(args[i]))}html.push((++q)+' >\n'+data.join('\n')+'\n\n');clearTimeout(timer);timer=setTimeout(function(){o.value+=html.join('');html=[];o.scrollTop=o.scrollHeight;w.show()},100)}})([],0)})()};