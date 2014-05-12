/*
大乐透号码列表
*/
Class('CodeList>Dlt_CodeList', {
    rightSplit: ' ',
    lineTpl: '<span class="num">{1}<em class="blue"> {2} {3}</em></span><s></s><i></i>'
});
/*
大乐透普通选号
*/
Class('Choose_pt>Dlt_Choose_pt',{
    showTxt:'[您选择了<font>{$dan}</font>个前区号码，<font>{$blue}</font>个后区号码，共<font>{$zhushu}</font>注，共<font>{$totalmoney}</font>元 ]',
    leftNum: 5,
    rightNum: 2,
    leftMax: 35,
    rightMax: 12,
    leftChooseMax: 18,
    leftname: '前区号码',
    noCodeMsg: '您好，请您至少选择5个前区号码和2个后区号码！',
    index2:function (ini){
        this.base(ini)
    }  
});
/*
大乐透12x2选号
*/
Class('Choose_base>Dlt_12x2',{
    showTxt: '[您选择了<font>{$num}</font>号码，共<font id="dlt12_zs">{$zhushu}</font>注，共<font>{$totalmoney}</font>元 ]',
    index:function (ini){
        var Y = this;
        this.addNoop('onchange');
        this.balls = this.lib.Choose({
            items: ini.balls,
            focusCss: function (cls){
                var css = (cls+'').match(/sx_\d+/);
                 return css ? (css[0]+'c') : '' 
            },
            hoverCss: function (cls){
                var css = (cls+'').match(/sx_\d+/);
                 return css ? (css[0]+'r') : ''                 
            }
        });
        showbar = this.need(ini.showbar);
        this.balls.onchange = function (){
            var zs, info;
            zs = Y.getCount();
            info = {
                num: this.data.length,
                zhushu: zs,
                totalmoney: (zs*2).rmb()// 12x2 不追加投注
            };
            Y.highlightBtn(zs);
            if (showbar) {// 刷新显示板
                showbar.html(Y.showTxt.tpl(info, '0'))
            }
            Y.onchange(info)
        };
        this.bindEvent(ini);
        this.base(ini);
    },
    getCount: function (){
       return Math.c(this.balls.data.length, 2);
    },
    bindEvent: function (config){
        var jx_opts, blue_rnd_sel, all_rnd_sel, Y;
        Y = this;
        //输出按扭
        Y.get(config.putBtn).click(function (){
            var code;
            if (Y.getCount()>0) {
                code = Y.getChooseCode();
                Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
            }else{
                Y.postMsg('msg_show_dlg', '生肖乐至少要选择两个号码！')
            }            
        });
        // 随机选取
        this.rndOpts = jx_opts = this.need(config.jx_opts);
        Y.get(config.jxbtn).click(function (){
            Y.random(jx_opts.val());
            return false            
        });
       // 清除
       Y.need(config.clearbtn).click(function (){
            Y.balls.clearCode(true)
        })
    },
    getChooseCode: function (){
        var code = [[this.balls.data.slice(), this.getCount()]];
        this.balls.clearCode(true);
        return code
    },
    clearCode: function (){
        this.balls.clearCode(true)      
    },
    redrawCode: function (code){//重现号码
        this.clearCode();
        this.balls.importCode(code[0]);
    },
    random: function (n){// 随机生成号码, [[red],[blue]]
        var a, code, id, tpl;
        n = ~~n;
        code = [];
        a = this.repeat(12, 1);
        for (var i = n; i--;) {
            code[i] = [a.random(-2).sort(Array.up), 1]
        }
        id = this.msgId;
        tpl = '<li><span class="blue">{1}</span></li>',
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    this.postMsg('msg_rnd_code')
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, tpl)                
    }
});
/*
大乐透12x2号码列表
*/
Class('CodeList>Dlt12_CodeList', {
    lineTpl: '<span class="num"><em class="blue">{1}</em></span><s></s><i></i>',
    createLine: function (code){//创建一行
        return this.createNode('LI', this.panel).html(
            this.lineTpl.format(String.zero(code[0].join(',')))
        );
    },
    formatCode: function (d){
        return '{1}'.format(d[0].join(','))
    }
});
/*
大乐透胆拖选号类
*/
Class('Choose_base>Dlt_Choose_dt', {
    statusTpl: '[前区：胆<font>{$d}</font>码，拖 <font>{$t}</font>码，后区：胆码 <font>{$bd}</font>个，拖码 <font>{$b}</font>个，共<font>{$zhushu}</font>注，共 <font>{$m}</font>元]',
    index:function (ini){
        this.bindDom(ini);
        this.tip = this.lib.NotifyIcon();
        this.base(ini);
    },
    bindDom: function (ini){
       var Y = this;
        //选号
        this.dan = this.lib.Choose({
            items: ini.dan,
            focusCss: ini.dtSelected,
            hoverCss: ini.rhoverCss
        });
        this.tuo = this.lib.Choose({
            items: ini.tuo,
            focusCss: ini.dtSelected,
            hoverCss: ini.rhoverCss
        });
        this.bdan = this.lib.Choose({
            items: ini.bdan,
            focusCss: ini.bSelected,
            hoverCss: ini.bhoverCss
        });
        this.blue = this.lib.Choose({
            items: ini.blue,
            focusCss: ini.bSelected,
            hoverCss: ini.bhoverCss
        });
        this.dan.onbeforeselect = function (ball){
           if (this.data.length > 3) {
               //Y.tip.show(ball,'<h5>您本次选择没有生效</h5><span style="color:red">前区最多只能选择4个胆码！</span>', 2000);
               this.postMsg('msg_show_dlg', '前区最多只能选择4个胆码！');
               return false
           }
           Y.tuo.unselect(Y.getInt(ball.innerHTML))//互斥
        };
        this.tuo.onbeforeselect = function (ball){
           Y.dan.unselect(Y.getInt(ball.innerHTML))
        };
        this.bdan.onbeforeselect = function (ball){
           if (this.data.length > 0) {
               // Y.tip.show(ball,'<h5>您本次选择没有生效</h5><span style="color:red">后区最多只能选择1个胆码！</span>', 2000);
              this.postMsg('msg_show_dlg', '后区最多只能选择1个胆码！');
               return false
           }
           Y.blue.unselect(Y.getInt(ball.innerHTML))//互斥
        };
        this.blue.onbeforeselect = function (ball){
           Y.bdan.unselect(Y.getInt(ball.innerHTML))
        };
        this.dan.onchange =
        this.tuo.onchange =
        this.bdan.onchange =
        this.blue.onchange =function (){
            Y.change()
        }
        //清除
        this.get(ini.clearDan).click(function (e, Y){
            Y.dan.clearCode()
        });
        this.get(ini.clearAll).click(function (e, Y){
            Y.clearCode();
        });
         //机选
         this.get(ini.tuoRnd).click(function (){
             Y.tuo.random(Y.need(ini.tuoRndOpts).val(), Y.dan.data);
         });
         this.get(ini.blueRnd).click(function (){
             Y.blue.random(Y.need(ini.blueRndOpts).val(), Y.bdan.data);
          });
          this.rndOpts = Y.get(ini.dtListOpts);
          this.get(ini.putBtn).click(function (e, Y){
              var msg, data = Y.getCount();
              if (data.d < 1) {
                  msg = '至少在前区选取一个胆码！'
              }else if(data.t < 2){
                  msg = '前区拖码至少要有2个！'
              }else if(data.b < 2){
                  msg = '请至少在后区选择两个拖码！'
              }else if(data.d + data.t < 6){
                  msg = "前区拖码与胆码不足6个, 请继续选择！"
              }else if(data.zhushu == 0){
                  msg = '您目前选择的号码不足一注, 请继续选择！'
              }
              if (msg) {
                  Y.postMsg('msg_show_dlg', msg)
              }else{
                  Y.postMsg('msg_put_code', data.code);
                  Y.clearCode();
              }
          });
         this.statusbar = this.need(ini.dtStatus)
    },
    getCount: function (){
       var  d, t, b, bd, zs;
       d = this.dan.data.length;
       t = this.tuo.data.length;
       b = this.blue.data.length;
       bd = this.bdan.data.length;
       zs = Math.dt(d, t, 5)*(bd > 0 ? Math.dt(bd, b, 2) : Math.c(b, 2))*(d > 0 && (d + t) > 5 && b > 1 ? 1 : 0);//必须有胆码才计算注数
       return {
           code:[[this.dan.data.slice(),this.tuo.data.slice(), this.bdan.data.slice(),this.blue.data.slice(), zs]],
           d:d,
           t:t,
           b: b,
           bd: bd,
           zhushu: zs
       }
    },
    clearCode: function (){
        this.dan.clearCode();
        this.tuo.clearCode();
        this.blue.clearCode();   
        this.bdan.clearCode();   
    },
    change: function (){
        var data = this.getCount();
        this.zhushu = data.zhushu;
        data.m = (data.zhushu*Class.config('price')).rmb();
        this.highlightBtn(this.zhushu);
        this.statusbar.html(this.statusTpl.tpl(data))
    },
    random: function (n){// 随机生成号码, [[胆], [拖],[blue]]
        var d, a, b, tn, code, id, zs;
        n = ~~n;
        code = [];
        d = this.dan.data;
        a = this.repeat(33, 1).remove(d);
        b = this.repeat(16, 1);
        tn = 7 - d.length;
        zs = Math.dt(d.length, tn, 6);
        for (var i = n; i--;) {
            code[i] = [d.slice(), a.random(-tn).sort(up), b.random(-1), zs]
        }
        id = this.msgId;
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    this.postMsg('msg_rnd_code')
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.codeTpl);
        //广播号码输出消息, 号码列表监听此消息        
        function up(a, b){
            return a>b ? 1 : -1
        }
    },
    redrawCode: function (code){//重现号码
        this.clearCode();
        this.dan.importCode(code[0]);
        this.tuo.importCode(code[1]);
        this.bdan.importCode(code[2]);
        this.blue.importCode(code[3]);
    },
    codeTpl:'<li style="height:auto;"><div>[<em class="red">胆</em>] <span class="num red">{1}</span></div>'+
        '<div>[<em class="green">拖</em>] <span class="num red">{2}</span></div>'+
        '<div>[<em class="blue">蓝</em>] <span class="num">{3}</span></div></li>'
});
/*
大乐透胆拖号码列表
*/
Class('CodeList>Dlt_CodeList_dt', {
   index: function (ini){
       this.base(ini);
       this.get(ini.showSplit).click(function (e, Y){
           var code, dt, b, codes, n;
           if (Y.zhushu == 0) {
               Y.postMsg('msg_show_dlg', '您好, 当前没有可查看明细的投注号码，请先选择号码！');
           }else if(Y.panel.find('li').size() > 1 && !Y.prevSelectedLine){
               Y.postMsg('msg_show_dlg', '您好, 请选择号码后才能查看拆分列表！');
           }else{
               if (!Y.prevSelectedLine) {
                   Y.prevSelectedLine = Y.panel.find('li').one();
                   Y.get(Y.prevSelectedLine).addClass('list-Selected');
               }
               code = Y.get(Y.prevSelectedLine).data('code');
               if (code) {
                   dt = Math.dtl(code[0], code[1], 5);
                   b = code[2].length ? Math.dtl(code[2], code[3], 2) : Math.cl(code[3], 2);
                   codes = [];
                   n = 0;
                   b.sort(Array.up);
                   dt.each(function (item, i){
                       item.sort(Array.up);
                       b.each(function (bm, j){
                           codes[n++] = [item, [bm]]
                       })
                   })
                   Y.postMsg('msg_show_split', codes);
               }else{
                   
               }               
           }
       })
   },

    liTpl:'<div><span class="">[前|胆] {1}</span> '+
        '<span class=""> [前|拖] {2}</span></div>'+
        '<div><span class="">[后|胆] {3}</span> '+
        '<span class=""> [后|拖] {4}</span><s></s><i></i></div>',

    createLine: function (code){//创建一行
        return this.createNode('LI', this.panel).setStyle('height:60px').html(this.liTpl.format( String.zero(code[0]),  String.zero(code[1]),  String.zero(code[2]),  String.zero(code[3])));
    },
    formatCode: function (d){
        return '[D:{1}][T:{2}]|[D:{3}][T:{4}]'.format(String.zero(d[0].join(',')), String.zero(d[1].join(',')), String.zero(d[2].join(',')), String.zero(d[3].join(',')))
    }
});

(function (){
    Class.config('price', 2);
    Class.config('is12x2', false);
    Class.config('play_name', 'pt');
    Class.config('buy_type', 0);
    Class.config('playid', 1);
    Class.config('root', 'http://'+location.host+'/');
    Class.config('fsfq',  $_trade.url.pcast);
    Class.config('fszh', $_trade.url.zcast);
    Class.config('dsfq',  $_trade.url.filecast);
    Class.config('pageParam',{});
    Class.config('userMoney', 0);
    Class.config('lower-limit', .1);//认购下限
    Class.config('lot-ch-name', '大乐透');
    Class.config('play-ch-name', '复式投注');
    Class.config('page-config', {});//页面隐藏配置
    Class.config('divExpect', [11056, 11080]);//追号期号标红
    Class.config('hasddsh', false);//是否定胆
    Class.config('last-ddsh', '-/-');

    Class.extend('getPlayText', function (play_name){
        var type, map;
        map = {
            'pt': '复式',
            'pt12': '复式',
            'sc': '单式',
            'dt': '胆拖'
        };
        return (Class.config('is12x2') ? '12选2' : '') + map[Class.config('play_name')] + ['代购','合买','追号'][Class.config('buy_type')];
    });
    // 自动生成playid
    Class.extend('getPlayId', function (play_name){
        var playname, price, pid, isds, isadd, isdt;
        playname = Class.config('play_name');
        price = Class.config('price');
        isds = playname.indexOf('lr')>-1 || playname.indexOf('sc')>-1;
        isdt = playname == 'dt';
        isadd = price == 3;
        if (Class.config('is12x2')) {
            return isds ? 101 : 100 ;
        }else{
            return isds ? (isadd ? 99 : 3) : ( isadd ? ( isdt ? 2 : 98) : (isdt ? 135 : 1 ))//加注id=98/99
        }        
    });



    /*
    主程序开始
    */
    Class({
        use: 'tabs,dataInput,mask',
        ready: true,
        index:function (){
            this.Type = 'App_index';
            this.lib.LoadExpect();	
            this.createTabs();
            this.createSub();
            this.lib.CountChart({
                lot: 'dlt',
                leftXml: '/cpdata/omi/50/yilou/hmyl_fore_100.xml',
                rightXml: '/cpdata/omi/50/yilou/hmyl_back_100.xml',
                rqXml: '/cpdata/omi/50/yilou/omission.xml'
            });
        },        
        
        createSub: function (){
            var Y, choose_pt, list_pt, choose_dt, choose_dd, list_dd;
            Y = this;
            this.onMsg('msg_get_list_data', function (){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_get_list_data_'+Class.config('play_name')).data;
            });

            this.onMsg('msg_put_code', function (code){//自动匹配不同的号码列表进行消息转发
                this.moveToBuy();
                return this.postMsg('msg_put_code_'+Class.config('play_name'), code).data;
            });

            this.onMsg('msg_rnd_code', function (code){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_rnd_code_'+Class.config('play_name'), code).data;
            });

            this.onMsg('msg_clear_code', function (code){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_clear_code_'+Class.config('play_name'))
            });

            this.onMsg('msg_redraw_code', function (code){//自动匹配不同的选择器进行消息转发
                return this.postMsg('msg_redraw_code_'+Class.config('play_name'), code)
            });

            this.onMsg('msg_update_list', function (){//自动匹配不同的选择器进行消息转发
                return this.postMsg('msg_update_list_'+Class.config('play_name'))
            });
            this.onMsg('msg_list_change', function (data){//自动匹配不同的号码列表
                this.get('#buyMoneySpan,#buyMoneySpan3').html(data.totalmoney.rmb());              
            });
            // 复式选号
            choose_pt=Y.lib.Dlt_Choose_pt({
                msgId: 'pt',
                showbar: '#pt_choose_info',
                putBtn:'#pt_put',
                clearBtn: '#pt_clear',
                rndSelect: '#pt_sel',
                rndBtn: '#pt_jx',
                yl:[{
                    xml: '/cpdata/omi/50/yilou/hmyl_fore_all.xml',
                    dom: '#pt_red li i'
                },{
                    xml:  '/cpdata/omi/50/yilou/hmyl_back_all.xml',
                    dom: '#pt_blue li i'
                }],
                red:{
                    items:'#pt_red b',
                    focusCss:'red',
                    hoverCss:'b_r',
                    clearBtn: '#pt_red_clear',
                    rndSelect: '#pt_red_sel',
                    rndBtn:'#pt_red_jx'
                },
                blue:{
                    items:'#pt_blue b',
                    focusCss:'blue',
                    hoverCss:'b_l',
                    clearBtn: '#pt_blue_clear',
                    rndSelect: '#pt_blue_sel',
                    rndBtn:'#pt_blue_jx'
                }
            });
            // 复式列表
            list_pt = Y.lib.Dlt_CodeList({
                msgId: 'pt',
                panel:'#pt_list',
                bsInput:'#pt_bs',
                moneySpan: '#pt_money',
                zsSpan: '#pt_zs',
                clearBtn: '#pt_list_clear'
            });

            Y.lib.Dlg();
            //追加注数联动
            var addPrice = this.get(':checkbox[rel=addPrice]');
            addPrice.prop('checked', false);
            addPrice.click(function (e, Y){
				Y.processAddPrice(this.checked);
            });
            this.onMsg('msg_price_reset', function (){
                addPrice.prop('checked', false);
                Class.config('price', 2 );// 22x2时复位追加
            });
            Y.lib.HmOptions();
            setTimeout(function() {
                Y.lib.BuySender();
                Y.exportCode();
            },500);            
            this.setBuyFlow();
        },        
		processAddPrice : function(isAdd) {  //追加注数联动
			var addPrice = this.get(':checkbox[rel=addPrice]');
			addPrice.each(function (el){
				el.checked = isAdd;
			});
			Class.config('price', isAdd ? 3 : 2 );
			this.get('#playid').val(this.getPlayId());
			this.postMsg('msg_update_list');
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
        //胆拖选号
        createDt: function (){
           list_pt = Y.lib.Dlt_CodeList_dt({
                msgId: 'dt',
                panel:'#dt_list',
                bsInput:'#dt_bs',
                moneySpan: '#dt_money',
                zsSpan: '#dt_zs',
                clearBtn: '#dt_list_clear',
                showSplit:'#dt_look_more'
            });
            choose_dt = Y.lib.Dlt_Choose_dt({
                msgId: 'dt',
                dan: '#dt_dan b',
                dtSelected: 'red',
                tuo: '#dt_tuo b',
                bdan: '#dt_blue b',
                blue: '#dt_blue_tuo b',
                bSelected: 'blue',
                clearDan: '#dt_clear_dan',
                clearAll: '#dt_clear_all',
                tuoRndOpts: '#dt_tuo_opts',
                tuoRnd: '#dt_tuo_jx',
                blueRndOpts: '#dt_blue_opts',
                blueRnd: '#dt_blue_jx',
                dtStatus: '#dt_status',
                putBtn: '#dt_put',
                dtListOpts: '#dt_list_opts',
                dtListRnd: '#dt_list_jx',
                rhoverCss:'b_r',
                bhoverCss:'b_l',
                yl:[{
                    xml: '/cpdata/omi/50/yilou/hmyl_fore_all.xml',
                    dom: '#dt_dan i'
                },{
                    xml:  '/cpdata/omi/50/yilou/hmyl_fore_all.xml',
                    dom: '#dt_tuo i'                    
                },{
                    xml:  '/cpdata/omi/50/yilou/hmyl_back_all.xml',
                    dom: '#dt_blue i'
                },{
                    xml: '/cpdata/omi/50/yilou/hmyl_back_all.xml',
                    dom: '#dt_blue_tuo i'
                }]
            });
            this.createDt = this.getNoop()
        },
        //12x2选号器
        create12x2: function (){
           Y.lib.Dlt_12x2({
                msgId:'pt12',
                balls: '#dlt12 b',
                showbar: '#dlt12_showbar',
                putBtn: '#dlt12_put',
                jx_opts: '#dlt12_opts',
                jxbtn: '#dlt12_jx',
                clearbtn: '#dlt12_clear',
                yl:[{
                	xml: '/cpdata/omi/50/yilou/hmyl_back_all.xml',
                    dom: '#dltsx i'
                }]
           });
           Y.lib.Dlt12_CodeList({
                msgId:'pt12',
                panel:'#dlt12_list',
                bsInput:'#dlt12_bs',
                moneySpan: '#dlt12_money',
                zsSpan: '#dlt12_zs',
                clearBtn: '#dlt12_list_clear'
           });
           this.create12x2 = this.getNoop()
        },
        createZhOptions: function (el){//延迟实现
           var Y = this;
           setTimeout(function() {
               Y.lib.ZhOptions()
           },99);           
           Y.createZhOptions = this.getNoop()
        },
        setBuyFlow: function (){
           this.get('#buy_dg,#buy_hm,#buy_zh').click(function (e, y){
               var data;
                if (Yobj.C('isEnd')) {
                    Yobj.alert('您好，'+Yobj.C('lot-ch-name')+Yobj.C('expect')+'期已截止！');
                    return false                }
               y.postMsg('msg_login', function (){
                   if (Class.config('play_name') == 'sc' && y.postMsg('msg_check_sc_err').data) {
                       return false// 上传额外检测
                   }else if(Class.config('play_name') == 'dq' && y.postMsg('msg_dq_check_err').data){
                       return false//多期额外检测
                   }else if (data = y.postMsg('msg_get_list_data_'+Class.config('play_name')).data) {//索取要提交的参数
                        if (data.zhushu === 0 ) {
                            y.postMsg('msg_show_dlg', '您好，请您至少选择一注号码再进行购买！')
                        }else if(data.beishu === 0){
                            y.postMsg('msg_show_dlg', '您好，请您至少要购买 <strong class="red">1</strong> 倍！')                    
                        }else if(data.totalmoney <= 0){
                            y.postMsg('msg_show_dlg', '您好，发起方案的金额不能为 <strong class="red">0</strong> ！')                    
                        }else if(y.checkMaxMoney(data.totalmoney)){
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

        createTabs: function (){
            var playTabs2, playTabs, dsTabs, buyTabs, pn, pn12, playid, runSub, Y, reqiTabs;
            Y = this;
            pn = 'pt,sc,dt'.split(',');
            pn12 = ['pt12','lr12'];
            playid = {
                pt:1,
                sc:3,
                dt:135
            };

            runSub = {
                'pt': 'empty',
                'sc': 'createDs',
                'dt': 'createDt'
            }
            // 人气
            reqiTabs = this.lib.Tabs({
                items:'#reqiTabs a',
                contents: '#hot,#cold,#grq,#drq',// #renqi,
                focusCss: 'cur',
                delay: 100
            });
            //标准选号/12选2
      
            //子玩法导航
        
            PlayTabs_def = this.lib.Tabs({
                items:'#playTabsDd li',
                contents:'#pttz,#dssc,#dttz',
                focusCss: 'cur'
            });
            //12x2子玩法切换
          
          
            //购买方式
            buyTabs = this.lib.Tabs({
                items:'#all_form b',
                focusCss:'cur',
                contents: '#dg_form, #hm_form,#zh_form'
            });

            //玩法
            PlayTabs_def.onchange = function (a, b){
                Class.config('play_name', pn[b]);
                this.get('#dssc').hide();
                if (b==1) {
                	this.get('#dssc').show();
                	Class.config('play_name', 'sc' );
                    this.postMsg('msg_clear_code');
                }
                this.get('#playid').val(this.getPlayId());
                this.postMsg('msg_clear_code');
                this.get('#all_form').hide(b==4);
                buyTabs.btns.show();
                buyTabs.btns.slice(-1).hide(b==1);
                buyTabs.btns.slice(0,2).hide(b==4);
                buyTabs.focus(b==4 ? 2 : 0);
                Y[runSub[pn[b]]] && Y[runSub[pn[b]]]()//创建不同的选号类
                this.loadEndTime();//同步变换截止时间
            };
            PlayTabs_def.focus(0);
            this.onMsg('msg_toogle_nosc', function (isnosc){
                buyTabs.btns.slice(0, 1).hide(isnosc);//稍后上传只能合买
                buyTabs.focus(isnosc ? 1 : 0);
            });
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
                 this.get('#all_form p').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票','连续多期购买同一个（组）号码'][b]);
            };
		}
    }); 
})()