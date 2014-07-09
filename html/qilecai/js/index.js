Class('Choose_base>Choose_singe', {
    showTxt:'[您选择了<font> {$zhushu} </font>注，共<font> {$totalmoney} </font>元 ]',
    maxZs: 10000,
    index:function (config){
        var ball, showbar, Y;
        Y = this;
        this.msgId = config.msgId || '';
        this.ball = this.lib.Choose({
            items: config.balls,
            focusCss: 'cur',
            hoverCss: ''
        });
        showbar = this.need(config.showbar);
        this.rndtpl = '<li><span class="blue">{1}</span></li>';
        this.addNoop('onchange')
        this.updateShow = this.ball.onchange = function (){//选择有变化时
            var zhushu, info;
            zhushu = Y.getCount();
            info = {
                zhushu: zhushu,
                totalmoney: (zhushu*Class.config('price')).rmb()            
            };
            Y.highlightBtn(info.zhushu);
            if (showbar) {// 刷新显示板
                showbar.html(Y.showTxt.tpl(info, '0'))
            }
            Y.onchange(info)
        };
        this.bindEvent(config);
        this.base(config)
    },
    bindEvent: function (config){
        var  all_rnd_sel, Y;
        Y = this;
        //输出按扭
        Y.get(config.putBtn).click(function (){
            var code, count;
            count = Y.getCount();
            if (count > Y.maxZs){
                  Y.postMsg('msg_show_dlg', '您好, 单个方案不能超过'+Y.maxZs+'注！');
            }else if(count > 0) {
                code = Y.getChooseCode();
                Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
            }else{
                Y.postMsg('msg_show_dlg', '请您至少选择一注号码后再添加！');
            }            
        });
        // 随机选取
        this.rndOpts = all_rnd_sel = this.get(config.rndOpts);
        Y.get(config.rnd).click(function (){
            Y.random(all_rnd_sel.val().replace("注","")*1);
            //opts.val()
            return false;            
        });
        Y.get(config.s1).click(function (){
            Y.random(1);
            //opts.val()
            return false;            
        });
		// 定胆机选
		Y.get('#dd_jx').click( function() {
			var selected_num = Y.ball.data.length;
			if (selected_num == 0) {
				Y.postMsg('msg_show_dlg', '您好，请您至少选择一个胆码！');
			} else if (selected_num > 6) {
				Y.postMsg('msg_show_dlg', '您好，最多可选6个号码作为胆码！');
			} else {
				Y.randomDD(all_rnd_sel.val().replace("注","")*1);
			}
			return false;
		} );
       // 清除
        Y.get(config.clearBtn).click(function (){
            Y.clearCode()
        }); 
    },
    getChooseCode: function (){
        var code = [[this.ball.data.slice(), this.getCount()]];
        this.ball.clearCode(true);
        return code
    },
    clearCode: function (){
        this.ball.clearCode(true)      
    },
    getCount: function (){//计算注数
        return Math.c(this.ball.data.length, 7)
    },
    random: function (n){// 随机生成号码, [[red],[blue]]
        var a, b, code;
        n = ~~n;
        code = [];
        b = this.repeat(30, 1);
        for (var i = n; i--;) {
            code[i] = [b.random(-7).sort(Array.up), 1];
        }
		this.get('#jx_dlg h2').html('机选号码列表');
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    this.postMsg('msg_rnd_code')
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.rndtpl)
    },
	randomDD : function(n) { //定胆机选n注
        var a, b, code, danma, Y = this;
        n = ~~n;
        code = [];
		danma = this.ball.data;
        b = this.repeat(30, 1).remove(danma);
        for (var i = n; i--;) {
            code[i] = [b.random(-(7-danma.length)).concat(danma).sort(Array.up), 1];
        }
		this.get('#jx_dlg h2').html('定胆机选号码列表');
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    Y.randomDD(n);
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.rndtpl)
	},
    redrawCode: function (code){//重现号码
        this.clearCode();
        this.ball.importCode(code[0]);
    }
});
$("span.nsbool b").mouseover(function(){
	if($(this).attr("class")=="cur"){
		return false;
	}else{
	$(this).addClass("b_r").siblings().removeClass("b_r");
	}
});
$("span.nsbool b").click(function(){
	if($(this).attr("class")=="b_r cur"){
		$(this).attr("class","cur");
	}else{
		$(this).attr("class","b_r");
	}
});
$("span.nsbool b").mouseout(function(){
	$(this).removeClass("b_r");
});
Class('CodeList>SingeCodeList', {
    noZero: true,
    lineTpl: '<span class="num" style="color:#333">{1}&nbsp;&nbsp;{2}</span> <s></s><i></i>',
    createLine: function (code){//创建一行
        var fs = code[0].length > 7;
        return this.createNode('LI', this.panel).html(this.lineTpl.format(String.zero(code[0].join(','))));
    },
    formatCode: function (d){//用于投注参数
        return String.zero(d[0].join(','))
    }
});
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
    Class.config('lot-ch-name', '七乐彩'); 
    Class.config('play-ch-name', '复式投注');
    Class.config('page-config', {});//页面隐藏配置
    Class.config('hasddsh', false);//是否定胆
    Class.config('last-ddsh', '-/-');

    /*
    'pt,lr,hz' - 1
    'zhx,z6,z3' - 2
    */
    Class.extend('getPlayText', function (play_name){
        var map, map2;
        map = {
            'pt': '普通',
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
    /*$("#numcount").css({
		"height":0,
		"overflow":"hidden"
		});
    $("#span5").click(function(){
		$("#span5").toggleClass("span5c");
		$("#numcount").show();
		if($("#span5").hasClass("span5c")){
			$("#numcount").clearQueue().animate({
				height:250
				});
			
		}else{
			
			$("#numcount").animate({
				height:0
				
				});
		}
		
	});*/
    $("#pt_bs").val(1);
    $("#pt_jx_opts").focus(function(){
		var pt_jx_opts  = $("#pt_jx_opts").val();
		if(pt_jx_opts != ""){
			pt_jx_opts=$("#pt_jx_opts").val().replace(/\D/g,'');
			$("#pt_jx_opts").val(pt_jx_opts);
		}
		
		$("#pt_jx_opts").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
	$("#zh_bs_big").focus(function(){
		var zh_bs_big  = $("#zh_bs_big").val();
		if(zh_bs_big != ""){
			$("#zh_bs_big").val();
		}
		
		$("#zh_bs_big").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
	$("#pt_jx_opts").blur(function(){
		var pt_jx_opts  = $("#pt_jx_opts").val();
		if(pt_jx_opts=pt_jx_opts.replace(/\D/g,'')){
				$("#pt_jx_opts").val(pt_jx_opts+"注");
		}
	});
    /*
    begin
    */
    
    Class({
        use: 'tabs,dataInput,mask',
        ready: true,

        index:function (){
            this.Type = 'App_index';
            this.lib.LoadExpect();		
            this.createTabs();
            this.createSub();            
            this.lib.PLHotCoolChart({
                single: true,
                xml: '/cpdata/omi/07/yilou/hmyl_100.xml',
                rqXml: '/cpdata/omi/07/yilou/omission.xml'
            });
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
            // 直选
            Y.lib.Choose_singe({
                msgId: 'pt',
                balls: '#pttz1 div.nx3span b',
                showbar: '#single_bar',
                putBtn: '#s1_put',
                rndOpts:'#pt_jx_opts',
                clearBtn:'#s1_clear',
                rnd: '#pt_jx',
                s1:"#s1_jx1",
				ddRnd: '#dd_jx',
                yl:[{
                    xml: '/cpdata/omi/07/yilou/hmyl_all.xml',
                    dom: '#pttz1 div.nxyl i'
                }]
            });
            // 直选列表
            Y.lib.SingeCodeList({
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
                //moneySpan: '#sc_money',
                scChk: '#scChk',
                upfile:'#upfile'
            });
            this.createDs = this.getNoop()
        },

        createTabs: function (){
            var playTabs, subPlayTabs,dsTabs, buyTabs, pn, pn2,  playid, runSub, Y, reqiTabs;
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
                contents: '#dg_form, #hmdiv,#zh_form'
            });
            pn = 'pt,sc,dq'.split(',');
            //top3玩法
            playTabs.onchange = function (a, b){
                Class.config('play_name', pn[b]);
                Class.config('playid', 1);
                this.postMsg('msg_clear_code');//通知清除选择
                this.get('#all_form').hide(b==2);
                this.get('#dssc').hide();
                if(b==0){
               	 $("#hmdiv").hide();
               	 $("#zh_form").hide();
                }
                if(b==1){
               	 $("#hmdiv").show();
               	 $("#zh_form").hide();
               	$("#ptdiv").hide();
                }
                if (b==2) {
                $("#ptdiv").hide();
               	 $("#hmdiv").hide();
               	 $("#zh_form").show();
                    Y.createDq();
                }else{
                    Y.createZhOptions(this.btns.nodes[b])
                }
                buyTabs.btns.show();
                buyTabs.btns.slice(-1).hide(b==1);
                buyTabs.focus(b==2?2:0);
                this.loadEndTime();//同步变换截止时间
            };
            playTabs.focus(0);
            //单式
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
                 }else{
                     !c && this.moveToBuy()
                 }
                 this.get('#all_form p').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票','连续多期购买同一个（组）号码'][b]);
            };
        }
    });  
})()