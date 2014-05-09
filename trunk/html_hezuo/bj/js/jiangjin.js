
/* PrizePredict 北单奖金预测
------------------------------------------------------------------------------*/
Class( 'PrizePredict', {

	use : 'mask',

	ggm2num : {
		'单关':[1], '2串1':[2], '2串3':[2, 1], '3串1':[3], '3串4':[3, 2], '3串7':[3, 2, 1], '4串1':[4], '4串5':[4, 3], '4串11':[4, 3, 2], '4串15':[4, 3, 2, 1], '5串1':[5], '5串6':[5, 4], '5串16':[5, 4, 3], '5串26':[5, 4, 3, 2], '5串31':[5, 4, 3, 2, 1], '6串1':[6], '6串7':[6, 5], '6串22':[6, 5, 4], '6串42':[6, 5, 4, 3], '6串57':[6, 5, 4, 3, 2], '6串63':[6, 5, 4, 3, 2, 1], '7串1':[7], '8串1':[8], '9串1':[9], '10串1':[10], '11串1':[11], '12串1':[12], '13串1':[13], '14串1':[14], '15串1':[15]
	},
	num2ggm : { 
		'1':'单关', '2':'2串1', '3':'3串1', '4':'4串1', '5':'5串1', '6':'6串1', '7':'7串1', '8':'8串1', '9':'9串1', '10':'10串1', '11':'11串1', '12':'12串1', '13':'13串1', '14':'14串1', '15':'15串1' 
	},
	type2nm : {
		'单关':{'n':1, 'm':1}, '2串1':{'n':2, 'm':1}, '2串3':{'n':2, 'm':3}, '3串1':{'n':3, 'm':1}, '3串4':{'n':3, 'm':4}, '3串7':{'n':3, 'm':7}, '4串1':{'n':4, 'm':1}, '4串5':{'n':4, 'm':5}, '4串11':{'n':4, 'm':11}, '4串15':{'n':4, 'm':15}, '5串1':{'n':5, 'm':1}, '5串6':{'n':5, 'm':6}, '5串16':{'n':5, 'm':16}, '5串26':{'n':5, 'm':26}, '5串31':{'n':5, 'm':31}, '6串1':{'n':6, 'm':1}, '6串7':{'n':6, 'm':7}, '6串22':{'n':6, 'm':22}, '6串42':{'n':6, 'm':42}, '6串57':{'n':6, 'm':57}, '6串63':{'n':6, 'm':63}, '7串1':{'n':7, 'm':1}, '8串1':{'n':8, 'm':1}, '9串1':{'n':9, 'm':1}, '10串1':{'n':10, 'm':1}, '11串1':{'n':11, 'm':1}, '12串1':{'n':12, 'm':1}, '13串1':{'n':13, 'm':1}, '14串1':{'n':14, 'm':1}, '15串1':{'n':15, 'm':1}
	},

	index : function() {

		var Y = this;
		
		this.table1 = this.need('#table1');
		this.table2 = this.need('#table2');
		this.table3 = this.need('#table3');
		this.MMM = 0;
		this.iscut = 1;
		
		this.prizePredictWrapper = this.need('#prize_predict');
		this.prizePredictDialog  = this.lib.MaskLay(this.prizePredictWrapper);
		this.prizePredictDialog.noMask = self != top;
		this.prizePredictDialog.addClose('#close1');
		this.prizePredictWrapper.find('.tan_top').drag(this.prizePredictWrapper);

		this.get('#see_prize_predict').click( function(e) {
			Y.C('clientY', e.clientY);  //记录下以便跨域时调整弹窗的位置
			Y.nb = Y.postMsg('msg_get_touzhu_codes').data;
			if (Y.nb.length == 0) {
				Y.postMsg('msg_show_dlg', '请选择好您要投注的比赛。');
				return;
			}
			Y.data = Y.postMsg('msg_get_data_4_prize_predict').data;
			Y.count = Y.need('#match_num').html();
			var gg_info = Y.postMsg('msg_get_gg_info_more').data;
			Y.ggtype = gg_info.gggroup;
			Y.ggmode = gg_info.sgtypename;
			if (Y.ggmode == '') {
				Y.postMsg('msg_show_dlg', '请选择好您要投注的过关方式。');
				return;
			}
			var danma = Y.postMsg('msg_get_danma').data;
			Y.nb.each( function(item) {
				item.dan = danma[item.index]; //存储胆码
			} );
			Y.zhushu = parseInt(Y.need('#zhushu').html());
			Y.beishu = parseInt(Y.need('#beishu_input').val());
			if (Y.zhushu == 0 || !Y.beishu) return;
			Y.base = 2 * 0.65 * Y.beishu;
			Y.ar = Y.ggtype==3 ? Y.arrayEach(Y.ggmode.split(','),function(s){return Y.type2nm[s].n},[]).reverse() : Y.ggm2num[Y.ggmode];
			Y.showPrizePredict();
		} );

		this.table2.live('a.see_detail', 'click', function() {
			Y.table2.find('a.see_detail').setStyle('color:#005ebb');;
			Y.get(this).setStyle('color:red');;
			Y.showTable3(Y.get(this).attr('value'));
		} );

	},

	showPrizePredict : function() {
		this.showTable1();
		this.showTable2();
		this.showDialog();
	},

	showDialog : function() {
		this.prizePredictDialog.pop(this.prizePredictWrapper.html());
		if (Y.C('autoHeight')) {
			this.prizePredictDialog.panel.nodes[0].style.top = Y.C('clientY') - 200 + 'px';
		}
	},

	showTable1 : function() {
		var sp = [];
		var html = [];
		var getD = function (d){return d ? '<span class="red">√</span>' : '×'};
		var danCount=0, badD=0;
		for (var i=0; i<this.count; i++){
			var oo = this.nb[i];
			var end =this.get('#out_of_date_matches').val()
			var o = this.data[oo.index-1];
			var spHTML = '', a = [];
			oo.arr.each( function(item) {
				var sp_tmp = o.sp[this.getIndex(Class.config('codeValue'), item)];
				a.push(sp_tmp); //取SP值
				if (sp_tmp == 0) sp_tmp = '-';
				spHTML += item + '(' + sp_tmp + '), ';
			}, this );
			spHTML = spHTML.substr(0, spHTML.length - 2); //胜(2.26), 平(3.7)
			spHTML = spHTML.replace(/\-1/g, '0');
			this.arraySortNumber(a);
			a = [a[0], a.slice(-1)[0]];  //取数组两头，即只保留最小和最大SP值
			if(a[1] == -1)a[1]=0;
			if(a[0] == -1)a[0]=a[1];
			if (oo.dan) {
				danCount++;
			}
			var sel=oo.arr, tmp=0;
			for (var i2 = 0, j2 = sel.length; i2 < j2; i2++) {
				tmp+=o.sp[sel[i2]]==-1?0:1
			}
			badD+=oo.dan&&tmp==0?1:0;
			sp[i] = [o.serialNumber, a[0], a[1], oo.dan];
			html[i] = '<tr><td>'+o.serialNumber+'</td><td>'+o.main + ' VS ' + o.guest +'</td>';
			if (Class.config('playName') == 'rqspf') {
				html[i] += '<td>' + o.rq + '</td>';
			}
			html[i] += '<td>'+spHTML+'</td><td>'+(a[1]||'-')+'</td><td>'+(a[0]||'-')+'</td><td class="last_td">'+getD(oo.dan)+'</td></tr>';
		}
		allIsBadDan=danCount>0&&danCount==badD;
		html.push('<tr class="last_tr"><td class="last_td" colspan="7">过关方式：<span class="red">'+this.ggmode+'</span></td></tr>');
		html = html.join("");
		this.table1.empty();
		this.get(html).insert(this.table1);
		this.setSP(sp);
	},

	//显示命中后的奖金
	showTable2 : function() {
		var Y = this;
		this.hitItem = [];
		this.nocutlist = {max:null,min:null};
		//if(this.pageType=='info')while(sg_bonus.ar[0]>MMM)sg_bonus.ar.shift();
		var ti = this.arrayEach(this.ar, function(i){return '<td>'+Y.num2ggm[i]+'</td>'}, []);
		var html = [], n, o, minb, maxb, mina, maxa, minn, maxn, num, tn;
		html[0] = '<tr><td class="td1" rowspan="2">命中场数</td><td colspan="'+ti.length+'" class="td2">中奖注数</td><td rowspan="2" class="td1">倍数</td><td colspan="2" class="td2">奖金范围</td></tr>';
		html[1] = '<tr>'+ti.join("")+'<td>最大奖金</td><td>最小奖金</td></tr>';
		var iscut = this.ggtype==3 || this.iscut;
		var mMax = 0, mMin = 999999999;
		var _i = 0;
		for (var j=0; j<this.count; j++){
			n = this.count-j, minb = "0元", maxb = "0元", minn=0, maxn=0;
			//if(sg_vote.pageType=='info' && n!=MMM)continue;
			maxa = this.getX(Y.sp.max.d, Y.sp.max.t, Y.ar, iscut, n, "max");
			mina = this.getX(Y.sp.min.d, Y.sp.min.t, Y.ar, iscut, n, "min");
			num = {};
			this.ar.each( function(n){num[n]=0} )
			for (var k=0; k<maxa.length; k++){
				tn = this.arrayMultiple(this.arrayEach(maxa[k],function(s){return Y.spn[s]},[]));
				if (tn>0){
					++num[maxa[k].length];
					maxn += tn;
				}
			}
			for (var k=0; k<maxa.length; k++){
				minn += this.arrayMultiple(this.arrayEach(mina[k],function(s){return Y.spn[s]},[]));
			}
			num = this.objectEach(num, function(n){return '<td>'+n+'注</td>'}, []).join("");
			if (maxn>0){
				if(maxn*this.base>mMax)mMax = maxn*this.base;
				this.hitItem.push([j,"max",maxa]);
				maxb = '<span class="eng">' + (maxn*this.base).toFixed(2) + '</span>元[<a href="javascript:void(0)" class="see_detail" ' + (_i == 0 ? 'style="color:red"' : '') + ' value="' + (_i++) + '">明细</a>]';
			}
			if (minn>0){
				if(minn*this.base<mMin)mMin = minn*this.base;
				this.hitItem.push([j,"min",mina]);
				minb = '<span class="eng">' + (minn*this.base).toFixed(2) + '</span>元[<a href="javascript:void(0)" class="see_detail" ' + (_i == 0 ? 'style="color:red"' : '') + ' value="' + (_i++) + '">明细</a>]';
			}
			(maxn>0||minn>0) && html.push( '<tr><td>'+n+'</td>'+num+'<td>'+this.beishu+'</td><td>'+maxb+'</td><td class="last_td">'+minb+'</td></tr>' );
		}
		if (this.hitItem.length==0||allIsBadDan){
			this.get('#jiangjinYS').html('0-0');
			this.table2.empty();
			this.get('<tr class="last_tr"><td class="last_td" colspan="5"><span class="red">当前缺少sp值，暂时无法计算奖金。</span></td></tr>').insert(this.table2);
			return false;
		}else{
			if(this.ggmode == '单关'){
				var mn = this.zhushu * 2;
				mMin = mMin<mn?mn:mMin;
				mMax = mMax<mn?mn:mMax;
			}
			this.get('#jiangjinYS').html( [mMin.toFixed(), mMax.toFixed()].join('-') );
		}
		html = html.join("");
		this.table2.empty();
		this.get(html).insert(this.table2);
		this.get('<tr><td colspan="6"><P><STRONG class=red>注：奖金预测sp值为投注时即时sp值，最终奖金以开奖sp值为准。</STRONG></P></td></tr>').insert(this.table2);
		this.showTable3(0);
	},

	showTable3 : function(idx) {
		var Y = this;
		var x = this.hitItem[idx];
		var html = ['\
			<tr>\
			<td>过关方式</td>\
			<td>中奖注数</td>\
			<td>中'+(this.count-x[0])+'场 最'+(x[1]=="min"?"小":"大")+'奖金 中奖明细</th>\
			<td>奖金</td>\
			</tr>'];
		var ga = {}, num = {}, mn = {};
		this.ar.each( function(n){ga[n]=[];num[n]=0,mn[n]=0} );
		var sn=0, tn;
		for (var k=0; k<x[2].length; k++){
			sn = this.arrayMultiple(this.arrayEach(x[2][k],function(s){return Y.spn[s]},[])) * this.base;
			if (sn>0){
				tn = x[2][k].length;
				++num[tn];
				ga[tn].push(x[2][k].join("×")+"×"+this.beishu+"倍×2元×65% = <strong style='color:#005ebb'>"+sn.toFixed(2)+"</strong>元");
				mn[tn] += sn;
			}
		}
		var ggt;
		this.ar.each( function(n){
			if (mn[n]==0) return;
			ggt = (n>1?n+"串1":"单关");
			html.push('<tr><td>'+ggt+'</td><td>'+num[n]+'注</td><td>'+ga[n].join("<br/>")+'</td><td class="last_td"><span class="red">'+mn[n].toFixed(2)+'元</span></td></tr>');
		} );
		num = this.objectEach(num, function(n){return n}, []);
		mn = this.objectEach(mn, function(n){return n}, []);
		html.push('<tr class="last_tr"><td>合计：</td><td>'+this.arrayAdd(num)+'注</td><td>&nbsp;</td><td class="last_td"><strong style="color:red">'+this.arrayAdd(mn).toFixed(2)+'</strong>元</td></tr>');
		html = html.join("");
		this.table3.empty();
		this.get(html).insert(this.table3);
	},

	//设置SP值
	setSP : function(sp){
		var Y = this;
		this.sp = {min:{d:[],t:[]}, max:{d:[],t:[]}};
		this.spn = {};
		sp.each( function(a, i){
			//if(sg_vote.pageType=='info' && a[1] == 0 && a[2] == 0)return;
			this.MMM++;
			var min = "[" + a[0]+"]" + a[1];
			var max = "[" + a[0]+"]" + a[2];
			this.spn[min] = +a[1];
			this.spn[max] = +a[2];
			this.sp.min[a[3]?"d":"t"].push(min);
			this.sp.max[a[3]?"d":"t"].push(max);
		}, this );
		var f1 = function(a,b){return Y.spn[a]-Y.spn[b]};
		var f2 = function(a,b){return Y.spn[b]-Y.spn[a]};
		this.sp.min.d.sort(f1);
		this.sp.min.t.sort(f1);
		this.sp.max.d.sort(f2);
		this.sp.max.t.sort(f2);
	},

	//获取串
	getX : function(spd, spt, ggmode, iscut, hitnum, m){
		var dn = spd.length;
		var tn = spt.length;
		var n = hitnum - dn;
		return this.getByIsCut(spd.slice(0, n>0?dn:dn+n), spt.slice(0,n>0?n:0), ggmode);
	},

	///获取串(去重复)
	getByIsCut : function(spd, spt, ggmode){
		var dn = spd.length;
		var tn = spt.length;
		var r = [], ta, n;
		for (var i=0,l=ggmode.length; i<l; i++){
			n = ggmode[i];
			ta = this.mathCR.apply(null, n>dn?[spt, n-dn]:[spd, n]);
			n>dn && this.arrayEach(ta, function(t){ return spd.concat(t) });
			r = r.concat(ta);
		}
		return r;
	},

	//fw老框架中的一些方法:

	arraySortNumber : function(a, ad){
		var f = ad!="desc" ? function(a,b){return a-b} : function(a,b){return b-a};
		return a.sort(f);
	},

	arrayEach : function(a, cb, r){
		if(r) for(var i=0,t,l=a.length;i<l;i++)(t=cb(a[i],i))!=undefined&&r.push(t);
		else for(var i=a.length-1;i>=0;i--)(a[i]=cb(a[i],i))==undefined&&a.splice(i,1);
		return r||a;
	},

	//数组相加
	arrayAdd : function(a){
		var n = 0;
		for (var i=0,l=a.length;i<l;i++) n+=a[i];
		return n;
	},

	//数组相乘
	arrayMultiple : function(a){
		var n = 1;
		for (var i=0,l=a.length;i<l;i++) n*=a[i];
		return n;
	},

	//组合结果
	mathCR : function (arr, num){
		var r = [];
		(function f(t,a,n){
			if(n==0) return r.push(t);
			for(var i=0,l=a.length-n; i<=l; i++){
				f(t.concat(a[i]), a.slice(i+1), n-1);
			}
		})([],arr,num);
		return r;
	},

	//历遍修改
	objectEach : function(o, cb, a){
		if (a){ for (var i in o) a.push(cb(o[i],i)); return a };
		for (var i in o) o[i]=cb(o[i],i);
	}

} );