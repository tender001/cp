/*
主程序
*/
(function (){
    Class.config('price', 2);
    Class.config('play_name', 'pt');
    Class.config('play_name2', 'zhx');
    Class.config('buy_type', 0);
    Class.config('playid', 1);
    Class.config('root', 'http://'+location.host+'/');
    Class.config('fsfq',  $_trade.url.pcast);
    Class.config('fszh', $_trade.url.zcast);
    Class.config('dsfq',  $_trade.url.filecast);
    Class.config('pageParam',{});
    Class.config('userMoney', 0);
    Class.config('lower-limit', .1);//认购下限
    Class.config('lot-ch-name', '七星彩'); 
    Class.config('play-ch-name', '复式投注');
    Class.config('page-config', {});//页面
    Class.config('hasddsh', false);//是否定胆
    Class.config('last-ddsh', '-/-');

    /*
    'pt,lr,hz' - 1
    'zhx,z6,z3' - 2
    */
    Class.extend('getPlayText', function (play_name){
        var map, map2;
        map = {
            'pt': '复式',
            'lr': '单式',
            'sc': '单式',
            'dq': '多期机选'
        };
        return map[Class.C('play_name')] + ['代购','合买','追号'][Class.C('buy_type')];
    });
    // 自动生成playid
    Class.extend('getPlayId', function (play_name){
        var pn = Class.config('play_name');
        return pn=='lr' || pn == 'sc' ? 3 : 1
    });
    Class.extend('exportCode', function (){
        // 传入号码
        var zid =location.search.getParam('zid');
        if(zid!=""&&typeof(zid) != 'undefined'){
    		Y.postMsg('msg_login', function (){
    			location.href='#page_zh';
    			buyTabs.focus(2);
                setTimeout(function() {
                    Y.lib.ZhOptions();
                },99);   
    		var data = $_trade.key.gid + "=" + encodeURIComponent("51") + "&tid=" + encodeURIComponent(zid) + "&rnd=" + Math.random();
    		Y.ajax({
    			url :$_user.url.xchase,
    			type : "POST",
    			dataType : "json",
    			data : data,
    			end: function(d) {
    				var obj = eval("(" + d.text + ")");
    				var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
    				if (code == "0") {
    					var r = obj.Resp.row;
    					var ccodes = r[0].ccodes;// 投注号码
    					ccodes = ccodes.split(':')[0];
    					var mulity = r.imulity;// 倍数
    					var periodid = r.cperiodid;//期次
    					
    					if(mulity>1){
    						$("#beishu").val(mulity);
    					}
    					
						if(ccodes==""){
    		    			Y.alert("您不是该方案的发起人，不能再次购买本方案");
    		    			return false;
    		    		}
						if(ccodes.split(';')[0].split(':')[1]==2){
							$("#zjtz23").attr("checked",'true');
							Y.processAddPrice(true);
						}
						if(ccodes.indexOf("$")==-1){
							var import_code, arrCodes, short_code;
							Yobj.get('#codes').val(ccodes);
						
//						   if (import_code = Yobj.get('#codes').val()) {
////							   import_code= import_code.split();
//							   if (typeof this.dejson(import_code) == 'object') return;
//							   arrCodes = import_code.split('$').map(function (c){
//								   var rb = c.split(','), w = [], zs = 1;
//					                rb.each(function (x, i){
//					                    w[i] = x.split('');
//					                    zs *= x.length
//					                });
//					                w.push(w.length < 5 ? 0 : zs);
//					                return w
//							   })
//							   if (/\b0\b/.test(import_code)) {
//						            return
//						        }
//						        arrCodes= [import_code,1];
//						        if (arrCodes.length) {//完整号码显示到列表
//						        	this.postMsg('msg_put_code', arrCodes);
//					                 this.moveToBuy()
//						        }
//					           // Y.postMsg('msg_change_play', pid == 28 ? 2 : (pid == 29 ? 1 : 0));
////					            if (arrCodes.length) {//完整号码显示到列表
////					            	this.postMsg('msg_put_code_', arrCodes);
////					                 this.moveToBuy()
////					            }
////					            if (short_code && short_code.length) {// 残缺号码显示到球区
////					                this.postMsg('msg_redraw_code_'+Class.C('play_name'), short_code)
////					            }
//					           
//						   }
							 if (import_code = Yobj.get('#codes').val()) {
								   if (typeof this.dejson(import_code) == 'object') return;
						            arrCodes = import_code.split('$').map(function (c){
						                var rb = c.split(','), w = [], zs = 1;
						                rb.each(function (x, i){
						                    w[i] = x.split('');
						                    zs *= x.length
						                });
						                w.push(w.length < 7 ? 0 : zs);
						                return w
						            }).filter(function (c){
						                if (c[c.length - 1] == 0) {//zs
						                    short_code = c//残缺号码
						                }else{
						                    return true
						                }
						            });
						            //arrCodes=[import_code];
						            if (arrCodes.length) {//完整号码显示到列表
						                 this.postMsg('msg_put_code', arrCodes);
						                 this.moveToBuy()
						            }
						            if (short_code && short_code.length) {// 残缺号码显示到球区
						                this.postMsg('msg_redraw_code', short_code)
						            }
							   }
						
    					}
			    	     
    				}else if(code=='2002'){
    					Y.alert("您不是该方案的发起人，不能再次购买本方案");
    					return false;
    				}else{
    					Y.alert(desc);
    					return false;
    				}
    			},
    			error : function() {
    				alert("您所请求的页面有异常！");
    				return false;
    			}
    		});
    	});
    	}
        
    });
    $(".sup b").mouseover(function(){
    	if($(this).attr("class")=="cur"){
    		return false;
    	}else{
    	$(this).addClass("b_r").siblings().removeClass("b_r");
    	}
    });
    $(".sup b").click(function(){
    	if($(this).attr("class")=="b_r cur"){
    		$(this).attr("class","cur");
    	}else{
			$(this).attr("class","b_r");
		}
    });
    $(".sup b").mouseout(function(){
    	$(this).removeClass("b_r");
    });
    /*
    begin
    */
    $("#zh_bs_big").val(1);
    $("#shuzi").focus(function(){
		var shuzi  = $("#shuzi").val();
		if(shuzi != ""){
			shuzi=$("#shuzi").val().replace(/\D/g,'');
			$("#shuzi").val(shuzi);
		}
		
		$("#shuzi").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
    $("#shuzi").blur(function(){
		var shuzi  = $("#shuzi").val();
		if(shuzi=shuzi.replace(/\D/g,'')){
				$("#shuzi").val(shuzi+"注");
		}
	});
    Class({
        use: 'tabs,dataInput,mask',
        ready: true,
        index:function (){
            this.Type = 'App_index';
            this.lib.LoadExpect();
            var playTabs, subPlayTabs,dsTabs, buyTabs, pn, pn2,  playid, runSub, Y, reqiTabs;
            this.createTabs();
            this.createSub();				
            this.lib.PLHotCoolChart({
                xml: '/cpdata/omi/51/yilou/wzyl_100.xml',
                rqXml: '/cpdata/omi/51/yilou/omission.xml',
                type: 'qxc'
            });
            this.bindEvent();
        },
        bindEvent:function(){
        	/*$("#codeCount").click(function(o){

    			$(this).toggleClass("span5c");
    			$("#divCount").show();
    			if($(this).hasClass("span5c")){
    				$("#divCount").clearQueue().animate({
    					height:249
    					});
    				
    			}else{
    				
    				$("#divCount").animate({
    					height:0
    					
    					});
    			}
    			
    		
        	})*/
        },

        createSub: function (){
            var Y, choose_pt, list_pt, choose_dt, choose_dd, list_dd;
            Y = this;
            this.onMsg('msg_get_list_data', function (){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_get_list_data_'+Class.C('play_name')).data;
            });

            this.onMsg('msg_put_code', function (code){//自动匹配不同的号码列表进行消息转发
                this.moveToBuy();
                return this.postMsg('msg_put_code_'+Class.C('play_name'), code).data;
            });

            this.onMsg('msg_rnd_code', function (code){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_rnd_code_'+Class.C('play_name'), code).data;
            });

            this.onMsg('msg_clear_code', function (code){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_clear_code_'+Class.C('play_name'))
            });

            this.onMsg('msg_redraw_code', function (code){//自动匹配不同的选择器进行消息转发
                return this.postMsg('msg_redraw_code_'+Class.C('play_name'), code)
            });

            this.onMsg('msg_list_change', function (data){//自动匹配不同的号码列表
                this.get('#buyMoneySpan,#buyMoneySpan3').html(data.totalmoney.rmb());              
            });
            //直选
            Y.lib.PLChoose({
                msgId: 'pt',
                balls: '#pttz1 div.nx3span',
                showbar: '#single_bar',
                putBtn: '#s1_put',
                rndOpts:'#shuzi',
                clearBtn:'#s1_clear',
                rnd: '#jixuan',
                s1:"#s1_jx1",
				ddRnd: '#dd_jx',
                yl:[{
                    width: 10,
                    xml: '/cpdata/omi/51/yilou/wzyl_all.xml',
                    dom: '#pttz1 div.nxyl i'
                }]
            });
            // 直选列表
            Y.lib.PLCodeList({
                msgId: 'pt',
                panel:'#code_list',
                bsInput:'#zh_bs_big',
                moneySpan: '#pt_money',
                addbs:'#pt_addbs',
                lessbs:'#pt_lessbs',
                zsSpan: '#pt_zs',
                clearBtn: '#pt_list_clear'
            });

            Y.lib.Dlg();
            Y.lib.HmOptions();
            setTimeout(function() {
                Y.lib.BuySender();
                Y.exportCode()
            },500);            

            this.setBuyFlow();
        },

       setBuyFlow: function (){
           this.get('#buy_dg,#buy_hm,#buy_zh').click(function (e, y){
               var data, msg;
                if (Yobj.C('isEnd')) {
                    Yobj.alert('您好，'+Yobj.C('lot-ch-name')+Yobj.C('expect')+'期已截止！');
                    return false                }
               y.postMsg('msg_login', function (){
                   if (Class.config('play_name') == 'sc' && y.postMsg('msg_check_sc_err').data) {
                       return false// 上传额外检测
                   }else if (data = y.postMsg('msg_get_list_data_'+Class.config('play_name')).data) {//索取要提交的参数
                        if (data.zhushu === 0 ) {
                            y.postMsg('msg_show_dlg', '请至少选择一注号码再进行购买！')
                        }else if(data.beishu === 0){
                            y.postMsg('msg_show_dlg', '对不起，请您至少要购买 <strong class="red">1</strong> 倍！')                    
                        }else if(data.totalmoney <= 0){
                            y.postMsg('msg_show_dlg', '发起方案的金额不能为 <strong class="red">0</strong> ！')                       
                        }else{
                            switch(Class.config('buy_type')){// 分派到购买方式
                             case 0: 
                                 Y.postMsg('msg_buy_dg', data)//代购
                                 break;
                             case 1: 
                                 Y.postMsg('msg_buy_hm', data)// 合买
                                 break;
                             case 2: 
                                 Y.postMsg('msg_buy_zh', data)//追号
                            }                    
                        }                            
                   }                   
               });
               e.end();
               return false;
           }) 
        },

        createZhOptions: function (el){//延迟实现
           var Y = this;
           setTimeout(function() {
               Y.lib.ZhOptions()
           },100)  
           Y.createZhOptions = this.getNoop()
        },
        createDs: function (){
            //单式上传
            Y.lib.DsUpload({
                zsInput: '#sc_zs_input',
                bsInput: '#sc_bs_input',
                moneySpan: '#sc_money',
                scChk: '#scChk',
                upfile:'#upfile'
            });
            this.createDs = this.getNoop()
        },

        createTabs: function (){
            
            Y = this;

            //主玩法
            playTabs = this.lib.Tabs({// zx / z6 / z3
                items:'#playTabsDd [bet]',
                contents: '#pttz,#dssc',
                focusCss: 'cur'
            });

            //购买方式
            buyTabs = this.lib.Tabs({
                items:'#all_form label',
                focusCss:'cur',
                contents: '#ptdiv,#hmdiv,#zhdiv'
            });

            pn = 'pt,sc'.split(',');

            //top3玩法
            playTabs.onchange = function (a, b){
                Class.config('play_name', pn[b]);
               Class.config('playid', 1);
               this.postMsg('msg_clear_code');//通知清除选择
               this.get('#all_form').hide(b==2);
               this.get('#dssc').hide();
               buyTabs.focus(0);//子玩法定位到第一个
               if (b==1) {
            	   Y.createDs();//创建单式-共用
                   this.get('#sd_tips div.ncathleft').hide()
                  this.get('#dssc').show();
               }else{
            	   var tipId = ('#'+Class.config('play_name2')+pn[b]+'_tips').replace(/z\dzxhz/,'zxhz').replace('sc', 'pt');
                   this.get('#sd_tips div.ncathleft').hide().get(tipId).show();//选号列表栏
                   var tipId = ('#'+Class.config('play_name2')+pn[b]+'_tip').replace(/z\dzxhz/,'zxhz').replace('sc', 'pt');
                   //Y.createZhOptions(this.btns.nodes[b])
                }
               this.postMsg('msg_clear_code');
               buyTabs.btns.show();
               buyTabs.btns.slice(-1).hide(b==1);
              this.loadEndTime();//同步变换截止时间
            };

            this.onMsg('msg_toogle_nosc', function (isnosc){
                buyTabs.btns.slice(0, 1).hide(isnosc);//稍后上传只能合买
                buyTabs.focus(isnosc ? 1 : 0);
            })
            //购买方式
            buyTabs.onchange = function (a, b, c){
                 Class.config('buy_type', b );
                 this.get('#ishm').val(b==1? 1 : 0);
                 this.get('#ischase').val(b==2? 1 : 0);
                 if (b==2) {
                     !c && this.moveToBuy(function (){
                          Y.createZhOptions(this.btns.nodes[b])
                     });
                     this.postMsg('toggle-zh')// 通知倍数框限制倍数
                 }else{
                     !c && this.moveToBuy()
                 }
//                 this.get('#all_form p').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票','连续多期购买同一个（组）号码'][b]);
            };
		}
    });  
})()