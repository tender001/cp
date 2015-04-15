CP.SFGG = (function () {
	var g = {
		pid : '',//期次
		max : 20,//最大20场
		min : 3,//最小3场
		maxlength : 15,//过关方式最大15串1
		bet : 1,//倍数
		count:0,//注数
		amount:0,//总金额
		hmMoney : 0,//合买应付金额
		countArr:[],//每排选多少个
		spArr:[],//每排sp
		code:'',//投注code
		pass:[],//过关方式
		bonus:0,//理论奖金
		buyType:'',
		type:{
			'足球':'球',
			'篮球':'分',
			'冰球':'球',
			'网球':'盘',
			'羽毛球':'局',
			'排球':'局',
			'橄榄球':'分',
			'曲棍球':'球',
			'乒乓球':'局',
			'沙滩排球':'局',
			'手球':'球',
			'水球':'球'
		}
	};
	$item = $('#item');
	var sfggData = [];
	//计算理论奖金
    var Count = {
    		/**
    		 * @description 取数组里面最大或最小的元素
    		 * @param {Array} arr 要遍历的数组
    		 * @param {Boolean} bool 为true?max:min 
    		 * @return {Int}
    		 * @example Count.division([2,3,4],true);return 4
    		 */
    		division: function (arr, bool) {
    			arr.sort(function(a,b){return a-b;});
    			var i = (bool && arr[arr.length-1])||arr[0];
    			return i;
    		},
    		/**
    		 * @description 通过每一排的最大最小sp 和 过关方式 取得理论奖金的最大最小值
    		 * @param {Array} arr 要遍历的数组对象
    		 * @param {Array} guoguan 过关方式
    		 * @return {obj}
    		 * @example Count.prix([{max:'2',min:'1'},{max:'4',min:'2'}],[1,2]);return {max:XX,min:OO}
    		 */
    		prix: function (arr, guoguan) {
    			var gg_ = guoguan,min_pl=[],max_pl=[];
    			arr.map(function(sp) {
					max_pl.push(+sp.max);
					min_pl.push(+sp.min);
    			});
    			if (!max_pl.length || !gg_) {
    				return {
    	                min: 0,
    	                max: 0
    	                };
    			} else {
    	            var pz = Count.max_prize(max_pl, gg_);
    	            var minpz = 1;
    	            	minpz = Count.min_prize(min_pl, gg_);
    	            return {
    	                min: minpz,
    	                max: pz
    	            };   
    			}
    		},
    		/**
    		 * @description 通过每一排的最大sp 和 过关方式 取得理论奖金的最大值
    		 * @param {Array} arr 要遍历的数组对象 里面是每一排最大的sp
    		 * @param {Array} guoguan 过关方式
    		 * @return {Int}
    		 * @example Count.max_prize(['3.1', '2.2', '5.5', '1.9'],[2,3]);return 1234
    		 */
    		max_prize : function(arr, guoguan){
    			var max_prize = 0;
    			var Q = guoguan;
    	        $.each(Q,function(n,value) {
    				var _n = parseInt(value)||1;
	            	var cl = Count.cl(arr, _n);
	            	$.each(cl,function(a,b){
	            		var x=1;
	            		$.each(b,function(c,d){
	            			x *= d;
	            			
	            		});
	            		max_prize += x;
	            	});
    			});
    			max_prize *= 2;
    			return max_prize = (+max_prize).toFixed(8);
    		},
    		/**
    		 * @description 通过每一排的最小sp 和 过关方式 取得理论奖金的最小值
    		 * @param {Array} arr 要遍历的数组对象 里面是每一排最小的sp
    		 * @param {Array} guoguan 过关方式
    		 * @return {Int}
    		 * @example Count.max_prize(['3.1', '2.2', '5.5', '1.9'],[2,3]);return 2
    		 */
    		min_prize: function(arr, guoguan){
    			var min_prize = 0;
    			var Q = guoguan;
    			$.each(Q, function(n,value) {
    				var _n = parseInt(value)||1;
	            	var cl = Count.cl(arr, _n);
	            	$.each(cl,function(a,b){
	            		var x=1;
	            		$.each(b,function(c,d){
	            			x *= d;
	            			
	            		});
	            		if(x<min_prize || min_prize==0){
	                    	min_prize=x;
	                    }
	            	});
    			});
    			min_prize *= 2;
    			return min_prize = (+min_prize).toFixed(8);
    		},
    		/**
    		 * @description 通过每一排的最大或最小sp 和 单个过关方式 取得理论奖金的最大或最小值
    		 * @param {Array} arr 要遍历的数组对象 里面是每一排最小或最大的sp
    		 * @param {String} n 单个过关方式
    		 * @return {Int}
    		 * @example Count.cl(['3.1', '2.2', '5.5', '1.9'],'2');return 2
    		 */
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
    		}
    	};
	var o = {
			pageGo : {//页面跳转
					goBack: function () {
						TopAnch.init({
							title:'胜负过关',
							prevShow:true,
							prevFun:function(){//左侧按钮绑定事件
								window.location.href = '#type=index';
							},
							nextShow:true,
							nextText:'玩法规则',
							nextHref:'#type=url&p=wf/sfgg.html'
						});
		            }
			},
			//渲染对阵
			render : function () {
				var out_ = [];
				if(!sfggData.length){
					out_.push('<div id="load_tip" style="height:120px; line-height:120px; text-align:center">暂无对阵</div>');
				}else{
					for (var i=0, l=sfggData.length; i<l; i++) {
						out_.push('<section class="jclqVs">\
								<div class="sfcTitle">'+sfggData[i].desc+'<em class="up"></em></div>\
								<div>');
						var t = sfggData[i].info;
						for (var Q1 in t) {
							var Q = t[Q1];
							out_.push('<ul class="sfcxs" data-id='+Q.itemid+'>\
									<li><em>'+Q.itemid+'&nbsp;足球</em><p style="color:#993333">'+Q.mname+'</p><cite>'+Q.et.substr(11,5)+' 截止</cite></li>\
									<li>\
									<p class="spfzpk spfzpk2">\
									<span my-data="3" sp='+Q.sp3+'><em>'+Q.hn+'</em><cite><i><i class='+(Q.close.indexOf('-')>=0?'green2':'red')+'>('+(Q.close.indexOf('-')>=0?'':'+')+Q.close+'&nbsp;'+g.type[Q.ccup]+')</i></i>&nbsp;胜</cite></span>\
									<b>VS</b>\
									<span my-data="0" sp='+Q.sp0+'><em>'+Q.gn+'</em><cite>胜</cite></span>\
									</p>\
									<p class="spfpl"><span>赔率'+Q.sp3+'</span><span>赔率'+Q.sp0+'</span></p>\
									</li></ul>');
							
						}
						out_.push('</div>\
								</section>');
					}
				}
				$item.html(out_.join(''));
				o.lagbind();
			},
			//获取基本对阵信息存在数组sfggData中
			gain : function () {
				 $.ajax({
 	       			url : "/cpdata/game/84/c.json?_=" + Math.random(),
 	       			type : "get",
 	       			dataType : "json",
 	       			success  : function (d){
 	       				
 	       			$.ajax({
 						url:CP.Data.data+"/cpdata/match/beid/"+d.period.row[0].pid+"/sfgg.xml",
 						type:'GET',
 						DataType:'XML',
 						success: function(xml){
 							var R = $(xml);
 							var rs = R.find('match ');
 							if (!!rs.length) {
 								g.pid = d.period.row[0].pid;
 								var rows = rs;
 								rows.each(function (Q2) {
 									var Q1 = {},Q3=[];
 									Q1.desc = $(this).attr('adddesc');
 									var r = $(this).find('row');
 									r.each(function (Q4) {
 										var Q = {};
 										Q.itemid = $(this).attr('mid');
 										Q.hn = $(this).attr('hn');
 										Q.gn = $(this).attr('gn');
 										Q.bt = $(this).attr('bt');
 										Q.et = $(this).attr('et');
 										Q.ms = $(this).attr('ms');
 										Q.ss = $(this).attr('ss');
 										Q.rs = $(this).attr('rs');
 										Q.close = $(this).attr('close');
 										Q.mname = $(this).attr('mname');
 										Q.cl = $(this).attr('cl');
 										Q.iaudit = $(this).attr('iaudit');
 										Q.icancel = $(this).attr('icancel');
 										Q.isale = $(this).attr('isale');
 										Q.rz = $(this).attr('rz');
 										sf="sp3:1.56;sp0:2.77;"
										Q.sf = $(this).attr('sf');
 										Q.sp3=parseFloat($_sys_getsp(Q.sf,"sp3"))>0?parseFloat($_sys_getsp(Q.sf,"sp3")).rmb(false,2):'--';
 										Q.sp0=parseFloat($_sys_getsp(Q.sf,"sp0"))>0?parseFloat($_sys_getsp(Q.sf,"sp0")).rmb(false,2):'--';
 										Q.istatus = $(this).attr('istatus');
 										Q.ccup = $(this).attr('mtype');
 										Q3[Q4] = Q;
 									});
 									Q1.info = Q3;
 									sfggData[Q2] = Q1;
 								});
 								o.render();
 							} else {
 								$item.html('<div id="load_tip" style="height:120px; line-height:120px; text-align:center">暂无对阵</div>');
 							}
 						}
 					});
 	       			}
				 });
				
				
				
			},
			init:function () {
				o.gain();
				o.bind();
			},
			count : function(){
				g.countArr = [];
				g.spArr = [];
				g.code = '';
				var Q4 = [];
				$item.find('.sfcxs').each(function(){
					var Q = $(this).find('.cur').length;
					if ( !!Q ) {
						g.countArr.push(Q);
						var Q5 = [];
						var Q1 = $(this).attr('data-id');
						var Q2 = [].slice.call($(this).find('.cur')).map(function(el){
							Q5.push($(el).attr('sp'));
							return $(el).attr('my-data');
						});
						Q4.push(Q1+'='+Q2.join('/'));
						g.spArr.push(Q5.join(','));
					}
				});
				g.code = Q4.join(',');
				$('#lot_cur_match').html(g.countArr.length);
			},
			//对阵加载完之后绑定的事件
			lagbind : function(){
				$item.Touch({children:'.sfcTitle' , fun:function () {//按日期显示隐藏
					$(this).next().slideToggle('200');
    				$(this).find('.up').toggleClass('down');
				}});
				$item.Touch({children:'span[my-data]' , fun:function () {//点击投注选项
					if(g.countArr.length>=g.max){
						if(!$(this).parent().find('.cur').length){
							alert('最多选'+g.max+'场');return
						}
					}
					$(this).toggleClass('cur');
					o.count();
				}});
			},
			
			/*认购保底多少[[*/
			hmDet : function () {
				var rg = parseInt($('#rg').val() || 0);
				var bd = parseInt($('#bd').val() || 0);
				var z = rg+bd;
				g.hmMoney = z;
				$('#hm_m cite:eq(0)').html(rg);//认购
				$('#hm_m cite:eq(1)').html(bd);//保底
				$('#hm_m cite:eq(2)').html(z);//总金额
			},
			/*]]认购保底多少*/
			
			doHm : function(){
				/*显示合买[[*/
				$(".jczqNav, #item, #jc_footer, #sfgg_mask").hide();
				$('#bethm, #jc_hm_footer').show();
				/*]]显示合买*/
				
				/*设置导航左右按钮 [[*/
				TopAnch.init({
					title:'发起合买',
					prevShow:true,
					prevFun:function(){//左侧按钮绑定事件
						window.location.href = '#type=url&p=list/sfgg.html';
					},
					isBack:true,
					nextShow:false
				});
				
				$('#hmDet cite').eq(0).html(g.count);//注数
				$('#hmDet cite').eq(1).html(g.bet);//倍数
				$('#hmDet cite').eq(2).html(g.amount);//总金额
				
				$("#rg").val(Math.ceil(g.amount*0.05));
				$("#rg_bl").html(Math.floor(($('#rg').val()/g.amount)*10000)/100+"%");
				$("#bd").removeAttr('disabled');
				$("#bd").val('0');
				$("#bd_bl").html('0%');
				o.hmDet();
			},	
			
			/*获取购买的各种参数 [[*/
			getArgument : function(t){
				var buy = {};
				switch(t){
					/* 1:自购 2:合买  */
					case 1:
						buy = {//投注参数
								payUrl:    '/phpt/t.phpx?fid=jcast',//投注接口
								gid:       '84',//彩种id
								pid:       g.pid,//期号
								codes:     g.codes,//投注内容
								muli:      g.bet,//倍数
								countMoney:g.amount,//方案金额
								orderType:'dg'//代购
						};
						break;
					case 2:
						buy = {//投注参数
							payUrl:    '/phpt/t.phpx?fid=jcast',//投注接口
							gid:       '84',//彩种id
							pid:       g.pid,//期号
							codes:     g.codes,//投注内容
							muli:      g.bet,//倍数
							desc:      $('#hmDesc').val() || '触屏版合买！',//方案宣传
							countMoney:g.amount,//方案金额
							bnum:      $('#rg').val(),//认购
							pnum:      $('#bd').val(),//保底
							oflag:     $('#isPublic .cur').attr('v') || 0,//公开状态
							wrate:     $('#ratio .cur').attr('v') || 5,//提成比例
							orderType:'hm'//代购
						};
						break;
				}
				return buy;
			},
			/*获取购买的各种参数 ]]*/
			
			/*拼凑购买弹窗需要的参数[[*/
			dopay : function(t){
				t ? g.buyType=2 : g.buyType=1;//合买、自购
				var _obj = o.getArgument(g.buyType);
				var cMoney = '';
				t ? cMoney = g.hmMoney : cMoney = g.amount;//应付金额
				var data = {//支付弹框参数
						gid:     '84',//彩种id
						cMoney:  cMoney,//需支付金额
						payPara: _obj,//jQuery.param(param)
						bonus:   g.bonus//奖金范围
				};
				alert('提交中，请稍后！','loading');
				CP.User.info(function(options){
					!t && $('#jc_close').click();//代购的时候关闭选择过关方式的层
					remove_alert();
					if (options) {jQuery.extend(data, options);}
					CP.Popup.buybox(data);
				});
			},
			/*购买弹窗]]*/
			
			/*购买验证[[*/
			dobuy : function(t){
				var info = '';
				if(g.bet<1){
					info = '请输入倍数';
				}else if(g.amount<1){//投注列表没有内容
					info = '请至少选择一注彩票';
				}
				if(info!=''){alert(info);return;}
				g.codes = o.code();//点击自购或发起合买的时候 拼一下投注code值 o.getArgument里面要用到
				if(t){window.location.href = "#type=fun&fun=CP.SFGG.doHm";}else{o.dopay();}
			},
			/*购买验证]]*/
			
			code : function () {
				var Q = [];
				for(var Q1 in g.pass){
					Q.push(g.pass[Q1]+'*1');
				}
				return 'SF|'+g.code+'|'+Q.join(',');
			},
			
			//页面初始化的时候绑定的事件
			bind : function(){
				$('#dobuy').bind(start_ev,function(){o.dobuy();});//代购
				$('#dohm').bind(start_ev,function(){o.dobuy('hm');});//发起合买
				$('#hmSubmit').bind(start_ev,function(){o.dopay('hm');});//提交合买
				
				$('#chuan_point').bind('click', '.bfb', function () {//关闭串关帮助
					$('#chuan_point').hide();
				});
				$('#chuan_ts').bind(start_ev, function () {//打开串关帮助
					$('#chuan_point').show();
				});
				
				
				$('#jc_next').Touch({children:'.ssqdeleted', fun:function(){//清空
					$item.find('.cur').removeClass('cur');
					o.count();
					g.bet = 1;
				}});
				$('#jc_next').bind('click',function(){
					if(g.countArr.length<g.min){
						alert('至少选择'+g.min+'比赛');
						return
					}
					o.next();
				});
				$('#jc_close').bind('click', function () {//X按钮
					$('#jc_footer').removeClass('jc_footer');
					$('#sfgg_mask').hide();
				});
				$('#jc_chuan').bind(start_ev, function () {//过关方式按钮
					$('#jc_chuan_list').toggleClass('jczqBlock');
				});
				$('#ggList li').bind(start_ev, function () {//选择过关方式
					if($('#ggList').find('.cur').length == 1 && $(this).is('.cur')){
						return
					}
					$(this).toggleClass('cur');
					var arr = [];
	            	arr = [].slice.call($('#ggList').find('.cur')).map(function(el){
	                	var xo = $(el).html() || '';
						return xo;
					});
	            	g.pass = [].slice.call($('#ggList').find('.cur')).map(function(el){
	                	var xo = $(el).attr('v');
						return xo;
					});
	            	$('#jc_chuan').html(arr.join(','));
	            	o.getCount();
				});
				$('#jc_bs').KeyBoard({
					val : '1',
					max : 50000,
					min : 1,
					num : 1,
					tag : '倍',
					fn  : function(){
						g.bet = parseInt($(this.ts).val()) || 0;
						o.getCount();//计算金额
					}
				});
				
				/*合买事件[[*/
				$('#rg').on('keyup',function(){//认购 
					var bd_ = parseInt($('#bd').val());
					if($(this).val() >= g.amount){
						$(this).val(g.amount);
						$("#rg_bl").html("100%");
					}else{
						if($(this).val() == ''){
							$("#rg_bl").html("0%");
						}else{
							$("#rg_bl").html(Math.floor((parseInt($('#rg').val())/g.amount)*10000)/100+"%");
						}
					}
					if(!$("#chk").hasClass("nocheck") || parseInt($(this).val())+bd_>g.amount){
						if($(this).val() == ''){
							$('#bd').val(g.amount);
							$("#bd_bl").html('100%');
						}else{
							$('#bd').val(g.amount-parseInt($(this).val()));
							$("#bd_bl").html(Math.ceil((parseInt($("#bd").val())/g.amount)*10000)/100+"%");
						}
					}
					o.hmDet();
				}).on('change',function(){//认购 小于5% 提示
					var t = $(this).val();
					if(t == ''){t=0;}
					if(parseInt(t) < g.amount*0.05){
						alert('认购金额不能小于5%');
						$(this).val(Math.ceil(g.amount*0.05));
						$("#rg_bl").html(Math.floor((parseInt($("#rg").val())/g.amount)*10000)/100+"%");
					}
					if(!$("#chk").hasClass("nocheck")){
						$('#bd').val(g.amount-parseInt($(this).val()));
						$("#bd_bl").html(Math.ceil((parseInt($("#bd").val())/g.amount)*10000)/100+"%");
					}
					o.hmDet();
				});
				$('#bd').on('keyup',function(){//保底 
					var rg_ = parseInt($('#rg').val());
					(parseInt($(this).val()) > g.amount-rg_) && $(this).val(g.amount-rg_);
					if($(this).val() == ''){
						$("#bd_bl").html("0%");
					}else{
						$(this).val(parseInt($(this).val()));
						$("#bd_bl").html(Math.ceil((parseInt($("#bd").val())/g.amount)*10000)/100+"%");
					}
					o.hmDet();
				}).on('change',function(){//保底等于空
					if($(this).val() == ''){
						$(this).val('0');
						$("#bd_bl").html("0%");
						o.hmDet();
					}
				});
				$('#chk').bind(start_ev,function(){
					var rg_ = parseInt($('#rg').val());
					$(this).toggleClass('nocheck');
					if(!$("#chk").hasClass("nocheck")){//全额保底
						$("#bd").attr('disabled',true);
						$("#bd").val(g.amount-rg_);
						$("#bd_bl").html(Math.ceil((parseInt($("#bd").val())/g.amount)*10000)/100+"%");
					}else{
						$("#bd").removeAttr('disabled');
					}
					o.hmDet();
				});
				$('#ratio li,#isPublic li').on(start_ev, function(){//提成   是否公开 点击事件
					!$(this).hasClass('cur') && $(this).toggleClass('cur');
					$(this).siblings().removeClass('cur');
				});
				/*]]合买事件*/
			},
			next : function () {
				var Q = g.countArr.length;
				Q = Q>g.maxlength && g.maxlength || Q;
				g.pass = [Q];
				$('#ggList').find('li').each(function () {
        			($(this).index()<(Q-2)) && $(this).show() || $(this).hide();
        			$(this).removeClass('cur');
        		});
				$('#jc_chuan').html(Q+'串1');
    			$('#ggList').find('li').eq(Q-3).addClass('cur');
				$('#jc_chuan_list').removeClass('jczqBlock');
        		$('#jc_bs').val(g.bet);//初始化倍数
        		$('#lot_cur').html(Q);//已选多少场
				$('#sfgg_mask').show();
				$('#jc_footer').addClass('jc_footer');
				
				o.getCount();
				$('#sfgg_mask').one('click', function () {
    				$('#sfgg_mask, #chuan_point').hide();
    				$('#jc_footer').removeClass('jc_footer');
				});
			},
			//计算注数
			getCount : function () {
				g.count = 0;
            	for (var Q in g.pass) {
            		g.count +=CP.math.N1(g.countArr, g.pass[Q]);
            	}
            	$('#lot_cur_zhushu').html(g.count);
            	g.amount = g.count*2*g.bet;
            	$('#lot_cur_money').html(g.amount);
            	var data = $.map(g.spArr, function (a){
            		var sp,division = {};
            		sp = a.split(',');
            		division['max'] = Count.division(sp,'true');
					division['min'] = Count.division(sp);
			        return division;
            	});
            	var prix = Count.prix(data, g.pass);
            	g.amountMin = (prix.min*g.bet*.65).toFixed(2);
				g.amountMax = (prix.max*g.bet*.65).toFixed(2);
				g.bonus = (g.amountMin == g.amountMax)?g.amountMax:(g.amountMin+'~'+g.amountMax);
            	$('#bonus').html(g.bonus);
			}
	};
	var init = function (){
		o.pageGo.goBack();
		o.init();
	};
	return {
		init: init,
		doHm : o.doHm,
		pageGo : o.pageGo
	};
})();
var $_sys_getsp=function(sprow,spname){
	var sp=sprow.split(";");
	for (var i=0;i<sp.length;i++){
		if (sp[i].substr(0,spname.length+1)==spname+':'){
			return sp[i].substr(spname.length+1,sp[i].length);
		}
	}
};
Number.prototype.rmb = function(prevfix, n) {
	return (prevfix === false ? '' : '\uffe5') + this.toFixed(n === void 0 ? 2 : n).toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,');
};
CP.SFGG.init();
function resetPage(){//登录或合买的回调函数
	$('#content_home').show();//登录完之后显示投注层
	$('#box_header').addClass('zcHeader');
	CP.SFGG.pageGo.goBack();
	/*隐藏合买 显示投注界面 [[*/
	$(".jczqNav, #item, #jc_footer, #sfgg_mask").show();
	$('#bethm, #jc_hm_footer').hide();
}