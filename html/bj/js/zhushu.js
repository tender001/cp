/*北单注数计算*/
Class( 'ZhushuCalculator', {

	ggm2num : {
		'单关':[1], '2串1':[2], '2串3':[2, 1], '3串1':[3], '3串4':[3, 2], '3串7':[3, 2, 1], '4串1':[4], '4串5':[4, 3], '4串11':[4, 3, 2], '4串15':[4, 3, 2, 1], '5串1':[5], '5串6':[5, 4], '5串16':[5, 4, 3], '5串26':[5, 4, 3, 2], '5串31':[5, 4, 3, 2, 1], '6串1':[6], '6串7':[6, 5], '6串22':[6, 5, 4], '6串42':[6, 5, 4, 3], '6串57':[6, 5, 4, 3, 2], '6串63':[6, 5, 4, 3, 2, 1], '7串1':[7], '8串1':[8], '9串1':[9], '10串1':[10], '11串1':[11], '12串1':[12], '13串1':[13], '14串1':[14], '15串1':[15]
	},
	type2nm : {
		'单关':{'n':1, 'm':1}, '2串1':{'n':2, 'm':1}, '2串3':{'n':2, 'm':3}, '3串1':{'n':3, 'm':1}, '3串4':{'n':3, 'm':4}, '3串7':{'n':3, 'm':7}, '4串1':{'n':4, 'm':1}, '4串5':{'n':4, 'm':5}, '4串11':{'n':4, 'm':11}, '4串15':{'n':4, 'm':15}, '5串1':{'n':5, 'm':1}, '5串6':{'n':5, 'm':6}, '5串16':{'n':5, 'm':16}, '5串26':{'n':5, 'm':26}, '5串31':{'n':5, 'm':31}, '6串1':{'n':6, 'm':1}, '6串7':{'n':6, 'm':7}, '6串22':{'n':6, 'm':22}, '6串42':{'n':6, 'm':42}, '6串57':{'n':6, 'm':57}, '6串63':{'n':6, 'm':63}, '7串1':{'n':7, 'm':1}, '8串1':{'n':8, 'm':1}, '9串1':{'n':9, 'm':1}, '10串1':{'n':10, 'm':1}, '11串1':{'n':11, 'm':1}, '12串1':{'n':12, 'm':1}, '13串1':{'n':13, 'm':1}, '14串1':{'n':14, 'm':1}, '15串1':{'n':15, 'm':1}
	},

	index : function() {
		this.onMsg('msg_get_zhushu', function(codes, ggtype, ggmlist) {
			return this.countZhushu(codes, ggtype, ggmlist);
		} );
	},
	
	countZhushu : function(codes, ggtype, ggmlist){
		var Y = this;
		var base_count = 0;
		if (ggmlist != "") {
			var t=[], d=[];
			this.arrayCallEach(codes, function(o){
				(o.dan?d:t).push(o.arr.length);
			});
			t = this.arrayGetNum(t);
			d = this.arrayGetNum(d);
			var ar = ggtype==3 ? this.arrayEach(ggmlist,function(s){return Y.type2nm[s].n},[]).reverse() : this.ggm2num[ggmlist.toString()];
			base_count = d.length==0?this.esunjsC(t,ar):this.calCount(t,d,ar);
		}
		return base_count;
	},

	//计算注数(去重复有胆)
	calCount : function (t, d, ar) {
		var dn = 0, mp = 1, Y = this;
		for (var i=0,l=d.length; i<l; i++) {
			dn += d[i][1];
			mp *= Math.pow(d[i][0], d[i][1]);
		}
		var n = 0;
		this.arrayCallEach(ar, function(m){
			n += m>dn ? Y.esunjsC(t,m-dn)*mp : Y.esunjsC(d,m);
		});
		return n;
	},

	arrayAdd : function(a){
		var n = 0;
		for (var i=0,l=a.length;i<l;i++) n+=a[i];
		return n;
	},

	esunjsC : function (a, num) {
		var Y = this;
		if (typeof(a[0])=="number") a=this.arrayGetNum(a);
		if (typeof(num)=="number") num=[num];
		var r = 0;
		var n = a.length;
		var ff = function (n,i){ return Math.pow(a[i][0],n) * Math.c(a[i][1],n) };
		(function f(t,i){
			if(i==n){
				if (Y.arrayGetIdx(num, Y.arrayAdd(t))>-1) r += Y.arrayMultiple(Y.arrayEach(t,ff,[]));
				return;
			}
			for(var j=0; j<=a[i][1]; j++) f(t.concat(j), i+1);
		})([], 0);
		return r;
	},

	arrayGetIdx : function(a, v){
		for (var i=0,l=a.length;i<l&&a[i]!=v;i++);
		return i<l ? i : -1;
	},

	arrayMultiple : function(a){
		var n = 1;
		for (var i=0,l=a.length;i<l;i++) n*=a[i];
		return n;
	},

	arrayEach : function(a, cb, r){
		if(r) for(var i=0,t,l=a.length;i<l;i++)(t=cb(a[i],i))!=undefined&&r.push(t);
		else for(var i=a.length-1;i>=0;i--)(a[i]=cb(a[i],i))==undefined&&a.splice(i,1);
		return r||a;
	},

	arrayGetNum : function (a){
		var r = [], o = {};
		for (var i=0,l=a.length; i<l; i++){
			o[a[i]] ? o[a[i]]++ : o[a[i]]=1;
		}
		for (var j in o) r.push([j,o[j]]);
		return r;
	},

	arrayCallEach : function(a, cb){
		for (var i=0,l=a.length;i<l;i++) cb(a[i], i);
	}
} );