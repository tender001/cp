//倒计时
Class('CountDownGp', {
	use : 'countDown',
	tpl : '<b class="cm_11ydj_time">{1}</b>:<b class="cm_11ydj_time">{2}</b>:<b class="cm_11ydj_time">{3}</b> 后截止',
	tpl3 : ' <em>{1}</em><em>{2}</em>  <em class="em_2"></em>  <em>{3}</em><em>{4}</em>   <em class="em_2"></em> <em>{5}</em><em>{6}</em> ',
	tpl4 : ' <b>{1}{2}</b><b>:</b><b>{3}{4}</b>',
	tpl2 : '{2}分{3}秒',
	xml_date : '/cpdata/sys/{1}.xml',
	curXml : '/tdata/{1}/activeexpect.xml',
	expect0 : '/tdata/{1}/s.xml',
//	expect0 : '/cpdata/game/{1}/s.json',
	expect1 : '/tdata/{1}/dayexpect1.xml',
	index : function(ini) {
		var Y = this;
		this.xml_date = this.xml_date.format(ini.stop);
		this.curXml = this.curXml.format(ini.lot);
		this.expect0 = this.expect0.format(ini.lot);
		this.expect1 = this.expect1.format(ini.lot);

		this.clock = this.lib.CountDown();
		this.expectPanel = this.get('#curExpectSpan,#extpect2');
		this.lastexpect_notice = this.get('#lastexpect_notice');
		this.endexpect_notice = this.get('#endexpect_notice');
		this.panel = this.get(ini.panel || '#countDownDiv');
		this.tpl = ini.tpl || this.tpl;
		this.panel2 = this.get('#countDown2');
		this.lister = {
			change : function(t, isEnd, msg) {
				var m, s, isstop, h;
				var h1,h2,m1,m2,s1,s2
				isstop = Class.C('stop-buy');
				msg = msg || '已截止';
				if (isEnd) {// 当前期截止
					Y.panel.html(msg);
					Y.panel2.html(msg);
					if (!isstop) {// 不是停售
						setTimeout(function(){
							Y.getNextExpect();// 换期号
						},200);
						
					}
				} else if (t[0] > 2 || t[1] > 99) {// 当天或者小时大于99时
					Y.panel.html('预售中');
					Y.panel2.html('预售中');
				} else {
					h = String.zero(t[1]);
					m = String.zero(t[2]);
					s = String.zero(t[3]);
					h1 = h.substr(0,1);
					h2 = h.substr(1,2);
					m1 = m.substr(0,1);
					m2 = m.substr(1,2);
					s1 = s.substr(0,1);
					s2 = s.substr(1,2);
//					alert(h1);
//					Y.panel.html(Y.tpl.format(h, m, s));
					if (t[1]>0){
						Y.panel.removeClass("k3_time2").addClass("k3_time2");
						Y.panel.html(Y.tpl3.format(h1,h2,m1,m2,s1,s2));
//						Y.panel.html(Y.tpl4.format(m1,m2,s1,s2));
					}else{
						Y.panel.removeClass("k3_time2");
						Y.panel.html(Y.tpl4.format(m1,m2,s1,s2));
					}
					
					Y.panel2.html(Y.tpl2.format(h, m, s));
				}
			}
		};
		setTimeout(function(){
			Y.getNextExpect();
		},200);
		
		setInterval(function() {
			var updateServerTime = true;
			if(ini.lot==Class.C('lot_id')){
				Y.getNextExpect(false);
			}else{
				setTimeout(function(){
					Y.getNextExpect(updateServerTime);	
				},200);
				}		
		}, 1000 * 60);// 每分钟校时
		this.addMsg();
	},
	getNextExpect : function(isUpTime) {		
		 this.ajax({
	            url:this.xml_date+"?rnd=" + Math.random(),
	            end:function (data, i){
	                 var isbuy;
	                 var starttime,endtime,now;
	                 this.qXml('//row', data.xml, function (e){
	                     isbuy = e.items.Value;
	                     starttime = Y.getDate(e.items.starttime);	                     
	                     endtime = Y.getDate(e.items.endtime);
	                     now = Y.getDate(data.date);
	                     if (now>starttime&&now<endtime){	                    	
	                    	 isbuy=0;
	                     }
	                 });
	                 if (isbuy != '1') {
	                	 if((Class.C('lot_id')) == "56"){//11运夺金
	                		 var zz = this.lib.MaskLay('#kp_stop');
	                     	 zz.addClose('#kp_close');
	                     	 Y.get('#kp_stop div.tips_title').drag('#kp_stop');
	                     	 zz.pop();
	                     	 $("#gp_gd11x5").hide();
	                     	 $("#gp_11x5").show();
	                     	 $("#gp_k3").show();
	                     	 $("#gp_ssc").show();
	                	 }
	                	 if((Class.C('lot_id')) == "54"){//11选5
	                		 var zz = this.lib.MaskLay('#kp_stop');
	                     	 zz.addClose('#kp_close');
	                     	 Y.get('#kp_stop div.tips_title').drag('#kp_stop');
	                     	 zz.pop();
	                     	 $("#gp_gd11x5").show();
	                     	 $("#gp_11x5").hide();
	                     	 $("#gp_k3").show();
	                     	 $("#gp_ssc").show();
	                	 }
	                	 if((Class.C('lot_id')) == "05"){//k3
	                		 $("#hz_put").hide();
		                     $("#hz_put_2").show();
	                		 var zz = this.lib.MaskLay('#kp_stop');
	                     	 zz.addClose('#kp_close');
	                     	 Y.get('#kp_stop div.tips_title').drag('#kp_stop');
	                     	 zz.pop();
	                     	 $("#gp_gd11x5").show();
	                     	 $("#gp_11x5").show();
	                     	 $("#gp_k3").hide();
	                     	 $("#gp_ssc").show();
	                	 }
	                	 if((Class.C('lot_id')) == "55"){//gd11x5
	                		 var zz = this.lib.MaskLay('#kp_stop');
	                     	 zz.addClose('#kp_close');
	                     	 Y.get('#kp_stop div.tips_title').drag('#kp_stop');
	                     	 zz.pop();
	                     	 $("#gp_gd11x5").hide();
	                     	 $("#gp_11x5").show();
	                     	 $("#gp_k3").show();
	                     	 $("#gp_ssc").show();
	                	 }
	                	 
	                     this.panel.html('<b class="cm_red">暂停销售</b>');
	                     this.panel2.html('<b class="cm_red">暂停销售</b>');
	                     $("#curExpectSpan").hide();
	                     $("#s1_put").hide();
	                     $("#s1_put_2").show();
	                     Class.C('stop-buy', true);
	                     this.loadList();//开奖号码期次遗漏显示控制
	                 }else if(isUpTime){
	                     this.postMsg('msg_new_servertimer', data.date);//只更新服务器时间
	                 }else{
	                     this.loadList();
	                 }
	            }
	        }); 
	},
	addMsg : function() {
		// 期号变换消息, 由访问列表xml时发起
		this.onMsg('msg_expect_change', function(expect, now, endtime) {
//			alert('msg_expect_change');
			this.expectPanel.html((expect.substr(0,2)=="20"?expect.substr(2):expect));
			this.get("#curState").html("");//11x5
			this.clock.end('<b>已截止</b>');
			this.lister.endTime = endtime;
			this.clock.add(this.lister);
			this.clock.play(now);
			var lnum = "";
			if(Class.C('sump') == 120){//时时彩的时候 剩余期次
				lnum = expect.substr(6,3)*1;
				this.lastexpect_notice.html(Class.C('sump')-(lnum-1));
			}else{
				lnum = expect.substr(8,9)*1;
				this.lastexpect_notice.html(Class.C('sump')-(lnum-1));
				this.endexpect_notice.html((lnum-1));
			}
			this.postMsg("opencodelist_getlistdata");
		});
		this.onMsg('msg_new_servertimer', function(now) {
			this.clock.play(now);
		})
	},
	loadList : function() {
		this.C('findCurrented', false);// 标志
		var aa=this;
		this.ajax({
			url : "/cpdata/game/"+Class.C('lot_id')+"/s.json?rnd=" + Math.random(),
			type : "get",
			cache:false,
			dataType : "json",
			end : function(data) {
				var obj = eval("(" + data.text + ")");
				var code = obj.period.code;
				if (code == "0") {
					var r = obj.period.row;
					var expects = [];
					r.each(function(rt,o) {
						var pid = rt.pid;
						var et = rt.et;
						var cft = rt.fet;
						var at = +aa.getDate(et);
						var g={};
						g.pid=pid;
						g.et=et;
						g.cft=cft;
						g.at=at;
						if (Y.getDate(et) > data.date) {// 只缓存有效期
							if (!aa.C('findCurrented')) {
								if (aa.C('currentExpect') != pid) {
									aa.C('currentExpect', pid);
									aa.postMsg('msg_expect_change', pid, data.date, aa.getDate(et));// 更新倒计时
								}
								g.iscurrent = true;
								aa.C('findCurrented', true);
							}	
							expects[expects.length] = g;
//							alert(expects.length);
						}
					});					
					
					var list1 = expects;
//					alert(expects);
					if (!this.isInited) {
						this.postMsg('msg_load_expect_list', list1);// 通知列表构造HTML
					}
					this.isInited = true;
					this.C('findCurrented', true);
				} 
			}
		});
	},
	
//	loadList : function() {
//		this.C('findCurrented', false);// 标志
//		this.ajax({
//			url : this.expect0+"?rnd=" + Math.random(),
//			end : function(data, i) {
//				var list1 = this._xml2Obj(+data.date, data.xml, 1);
//				if (!this.isInited) {
//					this.postMsg('msg_load_expect_list', list1);// 通知列表构造HTML
//				}
//				this.isInited = true;
//				this.C('findCurrented', true);
//			}
//		}
//		);
//	},
	_xml2Obj : function(now, xml, nt) {// 每次倒计时完毕都会查找当前期
		var g, endTime;
		expects = [];
//		alert("now="+now);
		this.qXml('//row', xml, function(o, i) {
			g = o.items;
			endTime = this.getDate(g.et);
			alert("endTime="+endTime);
			alert("now="+now);
			if (endTime > now) {// 只缓存有效期
				if (!this.C('findCurrented')) {
					if (this.C('currentExpect') != g.pid) {
						this.C('currentExpect', g.pid);
						this.postMsg('msg_expect_change', g.pid, now, endTime, nt);// 更新倒计时
					}
					g.iscurrent = true;
					this.C('findCurrented', true);
				}
				g.at = +endTime;
//				alert(g.at);
				expects[expects.length] = g;
			}
		});
		return expects;
	}
});