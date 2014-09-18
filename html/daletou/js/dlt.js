/*
大乐透号码列表
*/
Class('CodeList>Dlt_CodeList', {
    rightSplit: ' ',
	lineTpl: '<span class="span1">标准选号</span><span class="span2"> <b>{1}</b> : <em>{3}</em> </span>'+
    	'<span class="span3"> <s>{4}注</s>  <a href="javascript:void(0);" class="a1" title="修改"></a><a href="javascript:void(0);" class="a2" title="删除"></a></span>'
    
});
/*
大乐透普通选号
*/
Class('Choose_pt>Dlt_Choose_pt',{
    showTxt:'您选择了<span>{$dan}</span>个红球，<span>{$blue}</span>个篮球，共<span>{$zhushu}</span>注，共<span>{$totalmoney}</span>元',
    leftNum: 5,
    rightNum: 2,
    leftMax: 35,
    rightMax: 12,
    leftChooseMax: 18,
    leftname: '红球',
    noCodeMsg: '您好，请您至少选择5个红球和2个篮球！',
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
    statusTpl: '您选择了，前区：胆<b>{$d}</b>码，拖 <b>{$t}</b>码，后区：胆码 <b>{$bd}</b>个，拖码 <b>{$b}</b>个，共<b>{$zhushu}</b>注，共 <b>{$m}</b>元',
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
                  msg = '至少在前区选取一个胆码！';
              }else if(data.t < 2){
                  msg = '前区拖码至少要有2个！';
              }else if(data.b < 2){
                  msg = '请至少在后区选择两个拖码！';
              }else if(data.d + data.t < 6){
                  msg = "前区拖码与胆码不足6个, 请继续选择！";
              }else if(data.zhushu == 0){
                  msg = '您目前选择的号码不足一注, 请继续选择！';
              }
              if (msg) {
                  Y.postMsg('msg_show_dlg', msg);
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


    liTpl:'<span class="span1">胆拖投注</span><span class="span2"> <b>({1}){2}</b> : <em>({3}){4}</em> </span>'+
    	'<span class="span3"> <s>{5}注</s>  <a href="javascript:void(0);" class="a1" title="修改"></a><a href="javascript:void(0);" class="a2" title="删除"></a></span>',
    createLine: function (code){//创建一行
    	if((code[0]+code[1]+code[2]+code[3]).length>33){
    		return this.createNode('div', this.panel).addClass("r_a_p").addClass("r_a_pp").html(this.liTpl.format( String.zero(code[0]),  String.zero(code[1]),  String.zero(code[2]),  String.zero(code[3]),parseInt(code[4])));
		}else{
			return this.createNode('div', this.panel).addClass("r_a_p").html(this.liTpl.format( String.zero(code[0]),  String.zero(code[1]),  String.zero(code[2]),  String.zero(code[3]),parseInt(code[4])));
		}
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
    
    Class.extend('exportCode', function (){
        // 传入号码
    	var showid =location.search.getParam('codes');
    	
    	if(showid!=""&&typeof(showid) != 'undefined'){
    		Yobj.get('#codes').val(showid);
    		location.href='#page_buy';
    	}
        var import_code, arrCodes, short_code;
        if (import_code = Yobj.get('#codes').val()) {
			if (typeof this.dejson(import_code) == 'object') return;
            if (/\b0\b/.test(import_code)) {
                return
            }
            arrCodes = import_code.split(';').map(function (c){
                var rb = c.split('|'),
                    r = rb[0] ? rb[0].split(',') : [],
                    b = rb[1] ? rb[1].split(":")[0].split(",") : [],
        		zs = Math.c(r.length, 5) * Math.c(b.length, 2);
                return [r, b, zs]
            }).filter(function (c){
                if (c[c.length - 1] == 0) {//zs
                    short_code = c//残缺号码
                }else{
                    return true
                }
            });
            if (arrCodes.length) {//完整号码显示到列表
                 this.postMsg('msg_put_code', arrCodes);
                 this.moveToBuy()
            }
            if (short_code && short_code.length) {// 残缺号码显示到球区
                this.postMsg('msg_redraw_code', short_code)
            }
        }
    });
//    Class.extend('exportCode', function (){});

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
            $("#pt_sel").focus(function(){
           		var pt_sel  = $("#pt_sel").val();
           		if(pt_sel != ""){
           			pt_sel=$("#pt_sel").val().replace(/\D/g,'');
           			$("#pt_sel").val(pt_sel);
           		}
           		
           		$("#pt_sel").keyup(function(){
               		this.value=this.value.replace(/\D/g,''); //只能输数字
               	});
           	});
               $("#pt_sel").blur(function(){
           		var pt_sel  = $("#pt_sel").val();
           		if(pt_sel=pt_sel.replace(/\D/g,'')){
           				$("#pt_sel").val(pt_sel+"注");
           		}
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
            this.onMsg('msg_Ddrnd_code', function (code){//自动匹配不同的号码列表进行消息转发
                return this.postMsg('msg_Ddrnd_code_'+Class.config('play_name'), code).data;
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
                 s1: '#pt_one',
                 ddRnds:'#dd_jx',
                yl:[{
                    xml: '/cpdata/omi/50/yilou/hmyl_fore_all.xml',
                    dom: '#pt_red i'
                },{
                    xml:  '/cpdata/omi/50/yilou/hmyl_back_all.xml',
                    dom: '#pt_blue i'
                }],
                red:{
                    items:'#pt_red b',
                    focusCss:'red',
                    hoverCss:'hover',
                    clearBtn: '#pt_red_clear',
                    rndSelect: '#pt_red_sel',
                    rndBtn:'#pt_red_jx'
                },
                blue:{
                	 items:'#pt_blue b',
                     focusCss:'blue',
                     hoverCss:'hover',
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
                  addbs:'#pt_addbs',
                  lessbs:'#pt_lessbs',
                  zsSpan: '#pt_zs',
                  clearBtn: '#pt_list_clear'
            });
         
            Y.exportCode(); // 导入号码
            Y.lib.Dlg();
            //追加注数联动
           
            var addPrice = this.get(':checkbox[rel=addPrice]');
            addPrice.prop('checked', false);
            addPrice.click(function (e, Y){
				Y.processAddPrice(this.checked);
            });
            var dltcodes=this.get("#codes").val();
            if(dltcodes.split(";")[0].split(":")[1]==2){
            	addPrice.prop('checked', true);
            	Y.processAddPrice(true);
            }
            this.onMsg('msg_price_reset', function (){
                addPrice.prop('checked', false);
                Class.config('price', 2 );// 22x2时复位追加
            });
            Y.lib.HmOptions();
            setTimeout(function() {
                Y.lib.BuySender();
//                Y.exportCode();
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
            	 zsInput: '#sc_zs_input,#sczsinput',
                 bsInput: '#sc_bs_input,#scbs_input',
                 moneySpan: '#sc_money,#scmoney',
                 addbs:'#ds_addbs',
                 lessbs:'#ds_lessbs',
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
               addbs:'#dt_addbs',
               lessbs:'#dt_lessbs',
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
                  rhoverCss:'hover',
                  bhoverCss:'hover',
                yl:[{
                    xml: '/cpdata/omi/50/yilou/hmyl_fore_all.xml',
                    dom:'#dt_dan i'
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
            pn = 'pt,dt,sc'.split(',');
            pn12 = ['pt12','lr12'];
            playid = {
                pt:1,
                dt:135,
                sc:3
            };

            runSub = {
                'pt': 'empty',
                'dt': 'createDt',
                'sc': 'createDs'
            }

      
            //子玩法导航
        
            PlayTabs_def = this.lib.Tabs({
                items:'#playTabsDd [bet]',
                contents:'#pttz,#dttz,#dssc',
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
                Class.config('playid', playid[pn[b]]);
                this.postMsg('msg_clear_code');
                buyTabs.btns.show();
                buyTabs.btns.slice(-1).hide(b==2);
                buyTabs.focus(0);
				b == 3 && this.postMsg('msg_auto_kill_num', false);  //始初时不自动杀号
                Y[runSub[pn[b]]] && Y[runSub[pn[b]]]()//创建不同的选号类
                this.loadEndTime();//同步变换截止时间
            };

            
            PlayTabs_def.focus(0);

            // 传入号码
        	var showid =location.search.getParam('codes');
        	var projid =location.search.getParam('projid');
        	
        	if(projid!=""&&typeof(projid) != 'undefined'){
        		Y.postMsg('msg_login', function (){
    			
        		var data = $_trade.key.gid + "=" + encodeURIComponent("50") + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
        		Y.ajax({
        			url : $_trade.url.pinfo,
        			type : "POST",
        			dataType : "json",
        			data : data,
        			end: function(d) {
        				var obj = eval("(" + d.text + ")");
        				var code = obj.Resp.code;
        				var desc = obj.Resp.desc;
        				if (code == "0") {
        					var r = obj.Resp.row;
        					var ccodes = r.ccodes;// 投注号码
        					var mulity = r.mulity;// 倍数
        					var periodid = r.periodid;//期次
        					if(mulity>1){
        						$("#beishu").val(mulity);
        					}
        					var import_code, arrCodes, short_code;
        					
        		    		location.href='#page_buy';
							if(ccodes==""){
        		    			Y.alert("您不是该方案的发起人，不能再次购买本方案");
        		    			return false;
        		    		}
							if(ccodes.split(';')[0].split(':')[1]==2){
								$("#zjtz23").attr("checked",'true');
								Y.processAddPrice(true);
							}
        					if(ccodes.indexOf("$")==-1){
        						if(ccodes.indexOf("|")==-1){
        							Y.ajax({
        				    			url : "/cpdata/pupload/50/"+periodid+"/"+ccodes+"",
        				    			type : "GET",
        				    			end: function(d) {
        				    				var obj =  d.text;
        				    				re = /[\r\n]+/g;
        				    				re2= /^\;|\;$/g;
        				    				obj=obj.replace(re,";").replace(re2,"");
        				    				if(obj.split(";").length>100){
        				    					Y.alert("单式方案注数超过100");
        				    				}else{
        				    					Yobj.get('#codes').val(obj);
        				    					 if (import_code = Yobj.get('#codes').val()) {
        				   			    				if (typeof this.dejson(import_code) == 'object') return;
        				   			    	            if (/\b0\b/.test(import_code)) {
        				   			    	                return
        				   			    	            }
        				   			    	            arrCodes = import_code.split(';').map(function (c){
        				   			    	                var rb = c.split('|'),
        				   			    	                    r = rb[0] ? rb[0].split(',') : [],
        				   			    	                    b = rb[1] ? rb[1].split(":")[0].split(",") : [],
				   			    	                    		zs = Math.c(r.length, 5) * Math.c(b.length, 2);
        				   			    	                return [r, b, zs]
        				   			    	            }).filter(function (c){
        				   			    	                if (c[c.length - 1] == 0) {//zs
        				   			    	                    short_code = c//残缺号码
        				   			    	                }else{
        				   			    	                    return true
        				   			    	                }
        				   			    	            });
        				   			    	            if (arrCodes.length) {//完整号码显示到列表
        				   			    	                 this.postMsg('msg_put_code', arrCodes);
        				   			    	                 this.moveToBuy();
        				   			    	            }
        				   			    	            if (short_code && short_code.length) {// 残缺号码显示到球区
        				   			    	                this.postMsg('msg_redraw_code', short_code);
        				   			    	            }
        										   }
        				    				}
        				    			}
        							});
        						}else{
        							Yobj.get('#codes').val(ccodes);
        						
    							   if (import_code = Yobj.get('#codes').val()) {
    	   			    	            if (/\b0\b/.test(import_code)) {
    	   			    	                return
    	   			    	            }
    	   			    	            arrCodes = import_code.split(';').map(function (c){
    	   			    	                var rb = c.split('|'),
    	   			    	                    r = rb[0] ? rb[0].split(',') : [],
    	   			    	                    b = rb[1] ? rb[1].split(":")[0].split(",") : [],
    		    	                    		zs = Math.c(r.length, 5) * Math.c(b.length, 2);
    	   			    	                return [r, b, zs]
    	   			    	            }).filter(function (c){
    	   			    	                if (c[c.length - 1] == 0) {//zs
    	   			    	                    short_code = c//残缺号码
    	   			    	                }else{
    	   			    	                    return true
    	   			    	                }
    	   			    	            });
    	   			    	            if (arrCodes.length) {//完整号码显示到列表
    	   			    	                 this.postMsg('msg_put_code', arrCodes);
    	   			    	                 this.moveToBuy();
    	   			    	            }
    	   			    	            if (short_code && short_code.length) {// 残缺号码显示到球区
    	   			    	                this.postMsg('msg_redraw_code', short_code);
    	   			    	            }
    							   }
        						}
        					}else{ 
        						Yobj.get('#codes').val(ccodes);
        						 PlayTabs_def.focus(1);
        						if (import_code = Yobj.get('#codes').val()) {
        							if(ccodes.split(';')[0].split(':')[1]==2){
        								$("#dtzjtz").attr("checked",'true');
        							}
        							if (/\b0\b/.test(import_code)) {
       			    	                return
       			    	            }
       			    	            arrCodes = import_code.split(';').map(function (c){
       			    	                var rb = c.split('|'),
       			    	                    d= rb[0] ? rb[0].split('$')[0].split(',') : [],
    	    	                    		t = rb[0] ? rb[0].split('$')[1].split(',') : [],
       			    	                    bd = [],
    	    	                        	b=[];
       			    	                if(typeof rb[1].split('$')[1] != "undefined"){
       			    	                	b =  rb[1] ? rb[1].split('$')[1].split(":")[0].split(",") : [];
       			    	                	bd =rb[1].split('$')[0].split(",") 
   			    	                    }else{
   			    	                    	b=[];
   			    	                    	b=rb[1].split('$')[0].split(":")[0].split(",");
   			    	                    }
    	    	                    		var zs = Math.dt(d.length, t.length, 5)*(bd.length > 0 ? Math.dt(bd.length, b.length, 2) : Math.c(b.length, 2))*(d.length > 0 && (d.length + t.length) > 5 && b.length > 1 ? 1 : 0);//必须有胆码才计算注数
       			    	                return [[d,t,bd,b,zs]];
       			    	            }).filter(function (c){
       			    	                if (c[c.length - 1] == 0) {//zs
       			    	                    short_code = c;//残缺号码
       			    	                }else{
       			    	                    return true;
       			    	                }
       			    	            });
       			    	            if (arrCodes.length) {//完整号码显示到列表
       			    	            	
       			    	            	for(var i=0;i<arrCodes.length;i++){
       			    	            		this.postMsg('msg_put_code',arrCodes[i]);
       			    	            	}
       			    	            }
       			    	         
       			    	            if (short_code && short_code.length) {// 残缺号码显示到球区
       			    	                this.postMsg('msg_redraw_code', short_code);
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
        	
        	
        	if(showid!=""&&typeof(showid) != 'undefined'){}
        	
        
            this.onMsg('msg_toogle_nosc', function (isnosc){
                buyTabs.btns.slice(0, 1).hide(isnosc);//稍后上传只能合买
                buyTabs.focus(isnosc ? 1 : 0);
            })
            //购买方式
            buyTabs.onchange = function (a, b, c){
                 Class.config('buy_type', b );
                 $("a[mark]").hide();
                 $("a[mark="+b+"]").show();
                 this.get('#ishm').val(b==1? 1 : 0);
                 if(b == 0){
                	 $("div.b_th_top11").css("margin-bottom","15px");
                	 $("#all_form").css("border-bottom","1px solid #ccc");
                 }else{
                	 $("div.b_th_top11").css("margin-bottom","0");
                	 $("#all_form").css("border-bottom","0");
                 this.get('#ischase').val(b==2? 1 : 0);
                 if (b==2) {
                     !c && this.moveToBuy(function (){
                          Y.createZhOptions(this.btns.nodes[b])
                     });
                     this.postMsg('toggle-zh')// 通知倍数框限制倍数
                 }else{
                     !c && this.moveToBuy()
                 }
                 }
                 this.get('#all_form p').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票','连续多期购买同一个（组）号码'][b]);
            };
		}
    }); 
})()