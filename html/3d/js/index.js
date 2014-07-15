/*
和值映射表
--------------------------------------------------------------------------------------------*/
Class.config('hzQuery',{
    "z3" : {1:1,2:2,4:3,3:1,6:3,8:5,5:3,10:5,12:4,7:4,14:5,16:5,9:4,18:4,11:5,13:5,15:4,17:5,19:5,20:4,21:3,22:3,23:3,24:1,25:2,26:1},
    "z6" : {3:1,4:1,5:2,6:3,7:4,8:5,9:7,10:8,11:9,12:10,13:10,14:10,15:10,16:9,17:8,18:7,19:5,20:4,21:3,22:2,23:1,24:1},
    "zx" : {1:1,2:2,3:2,4:4,5:5,6:6,7:8,8:10,9:11,10:13,11:14,12:14,13:15,14:15,15:14,16:14,17:13,18:11,19:10,20:8,21:6,22:5,23:4,24:2,25:2,26:1},
    "zhx" : {0:1,1:3,2:6,3:10,4:15,5:21,6:28,7:36,8:45,9:55,10:63,11:69,12:73,13:75,14:75,15:73,16:69,17:63,18:55,19:45,20:36,21:28,22:21,23:15,24:10,25:6,26:3,27:1}
});
/*
直选
*/
Class('Choose_base>ZhxChoose',{
    showTxt: '【您选择了<em> {$zhushu} </em>注，共<em> {$totalmoney}</em> 元】',
    rndtpl: '<li><span class="blue">{1}</span> | <span class="blue">{2}</span> | <span class="blue">{3}</span></li>',
    index:function (ini){
        var hoverCss, focusCss, Y, showbar;
        Y = this;
        hoverCss = 'b_r';
        focusCss = 'cur';
        this.balls = [];
        this.addNoop('onchange');
        showbar = this.get(ini.showbar);
        startNum = ini.startNum || 0;
        this.get(ini.balls).each(function (ul, i){
            var tmp = new this.lib.Choose({
                items: this.get('span.nsbool b', ul),
                group: this.get('span.nsopr b', ul),
                startNum: startNum,
                focusCss: focusCss,
                hoverCss: hoverCss
            });
            this.balls[i] = tmp;
            tmp.onchange = _change;
        }, this);
        this.bindEvent(ini);
        this.base(ini);
        function _change(){
            var zs, info;
            zs = Y.getCount();
            info = {
                zhushu: zs,
                totalmoney: (zs*Class.config('price')).rmb()            
            };
            Y.highlightBtn(zs);
            if (showbar) {// 刷新显示板
                showbar.html(Y.showTxt.tpl(info, '0'))
            }
            Y.onchange(info)
        }
    },
    getCount: function (){
        var zs = 1;
        this.balls.each(function (item, n){
            zs *= item.data.length
        });
        return zs
    },
    bindEvent: function (ini){
        var rnd, opts, all_rnd_sel, Y;
        Y = this;
        //输出按扭

        Y.need(ini.putBtn).click(function (){
            var code;
            if (Y.getCount()>0) {
                code = Y.getChooseCode();
                Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
            }else if(Y.balls[0].data.length == 0 || Y.balls[1].data.length == 0 || Y.balls[2].data.length == 0){
                var w=Y.balls[0].data.length == 0 ? '百' : Y.balls[1].data.length == 0 ? '十' : '个';
                Y.postMsg('msg_show_dlg', '您还没有选择'+w+'位上的号码，请选择。')
            }else{
                Y.postMsg('msg_show_dlg', '请您至少选择一注号码后再添加！')
            }            
        });
        // 随机选取
        this.rndOpts = opts = this.need(ini.rndOpts);
        Y.need(ini.rnd).click(function (){
        	Y.random((opts.val().replace("注","")).replace("次","")*1);
            return false
        });
        Y.need(ini.s1).click(function (){
            Y.random(1);
            return false
        });
		//定胆机选
		Y.get(ini.ddRnd).click( function() {
			var _len, _line, _zs, code, line_tip;
			_len = 0;
			_line = [];
			code = Y.getChooseCode(true)[0];
			_zs = code[code.length - 1];
			line_tip = ['百位', '十位', '个位'];
			for (var i = 0; i < code.length - 1; i++) {
				_len += code[i].length;
				code[i].length > 1 && _line.push(line_tip[i]);
			}
			if (_len == 0) {
				Y.postMsg('msg_show_dlg', '您好，请您至少选择一个胆码！')
			} else if (_line.length > 0) {
				Y.postMsg('msg_show_dlg', '您好，' + _line.join('、') + '胆码数量超出，每位最多只能选择一个胆码！');
			} else if (_zs > 0) {
				Y.postMsg('msg_show_dlg', '您好，您选择的胆码数可以组成一注，请删减！');
			} else {
				
				Y.randomDD(opts.val().replace("注","")*1, code);
			}
			return false;
		} );
       // 清除
        Y.get(ini.clearBtn).click(function (){
            Y.clearCode()
        }); 
    },
    getChooseCode: function (keep){
        var code = [[this.balls[0].data.slice(), this.balls[1].data.slice(),this.balls[2].data.slice() , this.getCount()]];
		keep = keep || false;
        !keep && this.clearCode();
        return code
    },
    clearCode: function (){
        this.balls.each(function (o){
            o.clearCode(true)
        })         
    },
    random: function (n){// 随机生成号码, [[red],[blue]]
       if(n>100){Yobj.alert("单次机选不能超过100注");return false;}
    	var a, b, code, id, r, r2;
        n = ~~n;
        code = [];
        b = this.repeat(10);
        for (var i = n; i--;) {
            code[i] = [];
            r = b.random(-1)[0];
            r2 = r+1;
            code[i].push(b.random(r, r2));
            code[i].push(b.random(r, r2));
            code[i].push(b.random(r, r2));
            code[i].push(1)
        }
        id = this.msgId;
		this.get('#jx_dlg h2').html('机选号码列表');
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    this.postMsg('msg_rnd_code')
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.rndtpl, true)                
    },
	randomDD : function(n, danma) { //定胆机选n注
        var a, b, code, id, r, r2, Y = this;
        n = ~~n;
        code = [];
        b = this.repeat(10);
        for (var i = n; i--;) {
            code[i] = [];
            r = b.random(-1)[0];
            r2 = r+1;
            code[i].push(danma[0].length ? danma[0] : b.random(r, r2));
            code[i].push(danma[1].length ? danma[1] : b.random(r, r2));
            code[i].push(danma[2].length ? danma[2] : b.random(r, r2));
            code[i].push(1)
        }
        id = this.msgId;
		this.get('#jx_dlg h2').html('定胆机选号码列表');
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    Y.randomDD(n, danma);
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.rndtpl, true)
	},
    redrawCode: function (code){//重现号码
        this.clearCode();
        
        this.balls[0].importCode(code[0]);
        this.balls[1].importCode(code[1]);
        this.balls[2].importCode(code[2]);
    }
});
/*
组6组3直选
*/

Class('Choose_base>Z6Choose',{
	showTxt: '【您选择了<em> {$zhushu} </em>注，共<em> {$totalmoney}</em> 元】',
    rndtpl: '<li><span class="blue">{1}</span></li>',
    index:function (ini){
        var hoverCss, focusCss, Y, showbar;
        Y = this;
        hoverCss = 'b_r';
        focusCss = 'cur';
        this.balls = [];
        this.addNoop('onchange');
        showbar = this.get(ini.showbar);
        this.ball = new this.lib.Choose({
            items: ini.balls,
            group: ini.group,
            startNum: 0,
            focusCss: focusCss,
            hoverCss: hoverCss
        });
       this.ball.onchange = _change;
        this.bindEvent(ini);
        this.base(ini);
        function _change(){
            var zs, info;
            zs = Y.getCount();
            info = {
                zhushu: zs,
                totalmoney: (zs*Class.config('price')).rmb()            
            };
            Y.highlightBtn(zs);
            if (showbar) {// 刷新显示板
                showbar.html(Y.showTxt.tpl(info, '0'))
            }
            Y.onchange(info)
        }
    },
    getCount: function (){
        return Class.config('play_name2') == 'z6' ? Math.c(this.ball.data.length, 3) : Math.c(this.ball.data.length, 2)*2
    },
    getType: function (){
       return Class.config('play_name2') 
    },
    bindEvent: function (ini){
        var rnd, opts, all_rnd_sel, Y;
        Y = this;
        //输出按扭

        Y.need(ini.putBtn).click(function (){
            var code;
          
            if (Y.getCount()>0) {
                code = Y.getChooseCode();
                Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
            }else{
                Y.postMsg('msg_show_dlg', '请您至少选择'+(Y.getType()=='z6' ? 3 : 2)+'个号码后再添加！')
            }            
        });
        // 随机选取
        this.rndOpts = opts = this.need(ini.rndOpts);
        Y.need(ini.rnd).click(function (){
        	Y.random((opts.val().replace("注","")).replace("次","")*1);
            return false
        });
//      机选一注
        Y.need(ini.s1).click(function (){
            Y.random(1);
            return false
        });
       // 清除
        Y.get(ini.clearBtn).click(function (){
            Y.clearCode()
        }); 
    },
    getChooseCode: function (){
        var code = [[(this.ball.data.slice()), this.getCount()]];
        this.clearCode();
        return code
    },
    clearCode: function (){
        this.ball.clearCode(true)
    },
    random: function (n){// 随机生成号码, [[red],[blue]]
    	if(n>100){Yobj.alert("单次机选不能超过100注");return false;}
    	var a, b, code, id, zs, len;
        n = ~~n;
        code = [];
        b = this.repeat(10);
        len = Class.C('play_name2') == 'z6' ? 3 : 2;//组三是两个号码
        zs = len == 3 ? 1 : 2;// 组三是两注
        for (var i = n; i--;) {
            code[i] = [b.random(-len).sort(Array.up), zs]
        }
        id = this.msgId;
        this.postMsg('msg_show_jx', code, function (e, btn){
              if (btn.id == 'jx_dlg_re') {
                    this.postMsg('msg_rnd_code')
               }else if(btn.id == 'jx_dlg_ok'){
                    this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
               }
        }, this.rndtpl, true)                
    },
    redrawCode: function (code){//重现号码
        this.clearCode();
        this.ball.importCode(code[0]);
    }
});
/*
和值
*/
Class('Choose_base>HzChoose', {
	showTxt: '【您选择了<em> {$zhushu} </em>注，共<em> {$totalmoney}</em> 元】',
    rndtpl: '<li><span class="blue">{1}</span></li>',
    index:function (ini){
        var hoverCss, focusCss, Y, showbar;
        Y = this;
        hoverCss = 'b_r';
        focusCss = 'cur';
        this.addNoop('onchange');
        showbar = this.get(ini.showbar);
        this.ball = new this.lib.Choose({
            items: ini.items,
            startNum: ini.startNum,
            focusCss: focusCss,
            hoverCss: hoverCss
        });
        this.ball.onchange = _change;
        this.bindEvent(ini);
        this.base(ini);
        function _change(){
            var zs, info;
            zs = Y.getCount();
            info = {
                zhushu: zs,
                totalmoney: (zs*Class.config('price')).rmb()            
            };
            Y.highlightBtn(zs);
            if (showbar) {// 刷新显示板
                showbar.html(Y.showTxt.tpl(info, '0'))
            }
            Y.onchange(info)
        }
    },
    getCount: function (){
        var map, zs, type;
        type = Class.C('play_name2');
        map = Class.C('hzQuery')[type];
        zs = 0;
        this.ball.data.each(function (item, n){
            zs += map[item]
        });
        return zs
    },
    bindEvent: function (ini){
        var Y = this;
        //输出按扭
        Y.need(ini.putBtn).click(function (){
            var code;
            if (Y.getCount()>0) {
                code = Y.getChooseCode();
                Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
            }else{
                Y.postMsg('msg_show_dlg', '请您至少选择一注号码后再添加！')
            }            
        });
        Y.need(ini.clear).click(function (){
            Y.clearCode()
        })
    },
    getChooseCode: function (){
        var code = [[this.ball.data.slice(), this.getCount()]];
        this.clearCode();
        return code
    },
    clearCode: function (){
        this.ball.clearCode()
    },
    redrawCode: function (code){//重现号码
        this.clearCode();
        this.ball.importCode(code[0]);
    }  
});
/*
号码框
*/
Class('CodeList>SDCodeList', {
    noZero: true,
    lineTpl: '<p>{3}注<a title="修改" class="a1"></a><a title="删除" class="a2" ></a></p><em > {2}</em><span>{1}</span>',
    //lineTpl: '<p>{3}注<a title="删除" class="a2" ></a></p><em > {2}</em><span>{1}</span>',
    createLine: function (code){//创建一行
        var type, fs, wf;
        wf = this.getPlayText();
        switch(this.getType()){
            case 'zhx':
                return this.createNode('LI', this.panel).html(this.lineTpl.format([code[0].join(''), code[1].join(''), code[2].join('')].join('|'), wf,code[3]));
            case 'z6':
                return this.createNode('LI', this.panel).html(this.lineTpl.format(code.slice(0,-1).join(','), wf));
            default:
                return this.createNode('LI', this.panel).html(this.lineTpl.format(code.slice(0,-1).join(','), wf));
        }
    },
    getType: function (){
       return Class.config('play_name2'); 
    },
    formatCode: function (d){//用于投注参数
        return '{1}|{2}|{3}'.format(d[0].join(''), d[1].join(''), d[2].join(''))
    }
});
/*
和值号码框
*/
Class('CodeList>HzCodeList', {
    noZero: true,
    lineTpl: '<p>{3}注<a title="修改" class="a1"></a><a title="删除" class="a2"></a></p><em> {2}</em><span>{1}</span>',
    createLine: function (code){//创建一行
        return this.createNode('LI', this.panel).html(this.lineTpl.format(code[0].join(','), this.getPlayText(),code[1]));
    },
    formatCode: function (d){//用于投注参数
        return '{1}'.format(d[0].join(','))
    }
});
/*
组六组三普通号码框
*/
Class('CodeList>Z6CodeList', {
    noZero: true,
    lineTpl: '<p>{3}注<a title="修改" class="a1"></a><a title="删除" class="a2"></a></p><em> {2}</em><span>{1}</span>',
    createLine: function (code){//创建一行
        return this.createNode('LI', this.panel).html(this.lineTpl.format(code[0].join(','), this.getPlayText(),code[1]));
    },
    getType: function (){
       return Class.config('play_name2') 
    },
    formatCode: function (d){//用于投注参数
        return '{1}'.format(d[0].join(','))
    }
});
/*
启动
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
    Class.config('lot-ch-name', '福彩3D');
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
            'pt': '复式',
            'lr': '单式',
            'sc': '单式',
            'hz': '和值',
            'dq': '多期机选'
        };
        map2 = {
            zhx: '直选',
            z6: '组六',
            z3: '组三'
        }
        var g = map2[Class.C('play_name2')]+map[Class.C('play_name')];
        return g.replace(/组.单式/, '组选单式') //+ ['代购','合买','追号'][Class.C('buy_type')];
    });
    // 自动生成playid
    Class.extend('getPlayId', function (play_name){
        var pn, bt, pid,map;
        pn = Class.config('play_name');
        pn2 = Class.config('play_name2');
        bt = Class.config('buy_type');
        switch(pn2){
            case 'zhx':
                return {'pt':1, 'hz': 26, 'lr':3, 'sc': 3}[pn]
            case 'z6':
                return {'pt':46, 'hz': 48, 'lr':47, 'sc': 47}[pn]
            case 'z3':
                return {'pt':45, 'hz': 50, 'lr':47, 'sc': 1047}[pn]
        }
        return 1
    });
    $("#zhx_pt_jx_opts").focus(function(){
		var zhx_pt_jx_opts  = $("#zhx_pt_jx_opts").val();
		if(zhx_pt_jx_opts != ""){
			zhx_pt_jx_opts=$("#zhx_pt_jx_opts").val().replace(/\D/g,'');
			$("#zhx_pt_jx_opts").val(zhx_pt_jx_opts);
		}
		
		$("#zhx_pt_jx_opts").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
    $("#zhx_pt_jx_opts").blur(function(){
		var zhx_pt_jx_opts  = $("#zhx_pt_jx_opts").val();
		if(zhx_pt_jx_opts=zhx_pt_jx_opts.replace(/\D/g,'')){
				$("#zhx_pt_jx_opts").val(zhx_pt_jx_opts+"注");
		}
	});
    
    $("#z6pt_jx_opts").focus(function(){
		var z6pt_jx_opts  = $("#z6pt_jx_opts").val();
		if(z6pt_jx_opts != ""){
			z6pt_jx_opts=$("#z6pt_jx_opts").val().replace(/\D/g,'');
			$("#z6pt_jx_opts").val(z6pt_jx_opts);
		}
		
		$("#z6pt_jx_opts").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
    $("#z6pt_jx_opts").blur(function(){
		var z6pt_jx_opts  = $("#z6pt_jx_opts").val();
		if(z6pt_jx_opts=z6pt_jx_opts.replace(/\D/g,'')){
				$("#z6pt_jx_opts").val(z6pt_jx_opts+"注");
		}
	});
    
    $("#z3pt_jx_opts").focus(function(){
		var z3pt_jx_opts  = $("#z3pt_jx_opts").val();
		if(z3pt_jx_opts != ""){
			z3pt_jx_opts=$("#z3pt_jx_opts").val().replace(/\D/g,'');
			$("#z3pt_jx_opts").val(z3pt_jx_opts);
		}
		
		$("#z3pt_jx_opts").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	});
    $("#z3pt_jx_opts").blur(function(){
		var z3pt_jx_opts  = $("#z3pt_jx_opts").val();
		if(z3pt_jx_opts=z3pt_jx_opts.replace(/\D/g,'')){
				$("#z3pt_jx_opts").val(z3pt_jx_opts+"次");
		}
	});
    Class.extend('exportCode', function (){
        // 传入号码9|8|8$2|5|7
        var import_code, arrCodes, short_code, pid = this.get('#playid2').val() || 1;
        var type = pid == 45 ? 'Z3' : ( pid == 46 ? 'Z6' : 'Zhx');
        if (import_code = Yobj.get('#codes').val()) {
			if (typeof this.dejson(import_code) == 'object') return;
            arrCodes = import_code.split('$').map(function (c){
                var w = c.split('|'), q, b, g;
                switch(type){
                    case 'Z3':
                        return [w.sort(Array.up), Math.c(w.length, 2) * 2]
                        break;
                    case 'Z6':
                        return [w.sort(Array.up), Math.c(w.length, 3)]
                        break;
                    default:
                        q = w[0] ? w[0].split('') : [];
                        b = w[1] ? w[1].split('') : [];
                        g = w[2] ? w[2].split('') : [];
                        zs = q.length*b.length*g.length;                        
                }
                return [q.sort(Array.up), b.sort(Array.up), g.sort(Array.up), zs]
            }).filter(function (c){
                if (c[c.length - 1] == 0) {//zs
                    short_code = c//残缺号码
                }else{
                    return true
                }
            });
            Y.postMsg('msg_change_play', pid == 45 ? 2 : (pid == 46 ? 1 : 0));
            if (arrCodes.length) {//完整号码显示到列表
                 this.postMsg('msg_put_code_pt_'+type.toLowerCase(), arrCodes);
                 this.moveToBuy()
            }
            if (short_code && short_code.length) {// 残缺号码显示到球区
                this.postMsg('msg_redraw_code_pt_'+type.toLowerCase(), short_code)
            }
        }
    });

    /*
    开始加载
    */
    Class({
        use: 'tabs,dataInput,mask',
        ready: true,

        index:function (){
            this.Type = 'App_index';
            this.lib.LoadExpect();		
            this.createTabs();
            this.createSub();            
            this.lib.PLHotCoolChart({//冷热图表
                xml: '/cpdata/omi/03/yilou/wzyl_100.xml',
                hzXml: '/cpdata/omi/03/yilou/hzyl_hz_100.xml',
                rqXml: '/cpdata/omi/03/yilou/omission.xml',
                type: '3d'
            });
         
        },
        createSub: function (){
            var Y, choose_pt, list_pt, choose_dt, choose_dd, list_dd;
            Y = this;
            this.onMsg('msg_toggle_case', function (sender){
                 var a, b;
                 a = this.get('a', sender);
                 b = this.hasClass(a.nodes[0], 'p_hide');
                 a.html(b ? '显示方案' : '隐藏方案');
                 a.nodes[0].className = b ? 'p_show' : 'p_hide';
                 this.get('#case_list').hide( b);
            });

            this.onMsg('msg_get_list_data', function (){//自动匹配不同的号码列表进行消息转发
                var msg = Class.C('play_name') == 'sc' ? '' : '_'+Class.C('play_name2');//单式是共用的, 不再分发
                return this.postMsg('msg_get_list_data_'+Class.C('play_name')+msg).data;
            });

            this.onMsg('msg_put_code', function (code){//自动匹配不同的号码列表进行消息转发
                this.moveToBuy();
                var msg = Class.C('play_name') == 'sc' ? '' : '_'+Class.C('play_name2');
                return this.postMsg('msg_put_code_'+Class.C('play_name')+msg, code).data;
            });

            this.onMsg('msg_rnd_code', function (code){//自动匹配不同的号码列表进行消息转发
                var msg = Class.C('play_name') == 'sc' ? '' : '_'+Class.C('play_name2');
                return this.postMsg('msg_rnd_code_'+Class.C('play_name')+msg, code).data;
            });

            this.onMsg('msg_clear_code', function (code){//自动匹配不同的号码列表进行消息转发
                var msg = Class.C('play_name') == 'sc' ? '' : '_'+Class.C('play_name2');
                return this.postMsg('msg_clear_code_'+Class.C('play_name')+msg)
            });

            this.onMsg('msg_redraw_code', function (code){//自动匹配不同的选择器进行消息转发
                var msg = Class.C('play_name') == 'sc' ? '' : '_'+Class.C('play_name2');
                return this.postMsg('msg_redraw_code_'+Class.C('play_name')+msg, code)
            });

            this.onMsg('msg_list_change', function (data){//自动匹配不同的号码列表
                this.get('#buyMoneySpan,#buyMoneySpan3').html(data.totalmoney.rmb());           
            });
            // 3d直选
            Y.lib.ZhxChoose({
                msgId: 'pt_zhx',
                balls: '#pttz1 div.nx3span',
                showbar: '#zhx_showbar',
                putBtn: '#zhx_pt_put',
                rndOpts:'#zhx_pt_jx_opts',
                clearBtn:'#zhx_pt_clear',
                rnd: '#zhx_pt_jx',
                s1:'#zx_jx1',
				ddRnd: '#zhx_dd_jx',
                yl:[{
                	xml:'/cpdata/omi/03/yilou/wzyl_all.xml',
                    dom:'#pttz1 div.nxyl i',
                    width: 10
                }]
            });
            // 直选列表
            s=Y.lib.SDCodeList({
                msgId: 'pt_zhx',
                panel:'#zhx_pt_list',
                bsInput:'#zhx_pt_bs',
                moneySpan: '#zhx_pt_money',
                zsSpan: '#zhx_pt_zs',
                addbs:'#zhx_addbs',
                lessbs:'#zhx_lessbs',
                clearBtn: '#zhx_pt_list_clear'
            });
            Y.lib.Dlg();
            Y.lib.HmOptions();
            setTimeout(function() {
                Y.lib.BuySender();
                Y.exportCode();
            },500);  
           
            this.setBuyFlow();
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
        // 直选和值
        createZhHz: function (){
            // 3d和值
            Y.lib.HzChoose({
                msgId: 'hz_zhx',
                items: '#zhxhz span.nsbool b',
                showbar: '#zhxhz_showbar',
                putBtn: '#zhxhz_put',
                clear: '#zhxhz_clear',
                yl:[{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    //sort: 'hezhi',
                    offset: 0,
                    dom: '#zhxhz div[mark=bqy] i'
                },{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    dom: '#zhxhz div[mark=lly] i',
                    offset: 0,
                    name: 'cycle'
                }],
                startNum: 0
            });
            // 和值列表
            Y.lib.HzCodeList({
                msgId: 'hz_zhx',
                panel:'#zhxhz_list',
                bsInput:'#zhxhz_bs',
                moneySpan: '#zhxhz_money',
                zsSpan: '#zhxhz_zs',
                addbs:'#zhxhz_addbs',
                lessbs:'#zhxhz_lessbs',
                clearBtn: '#zhxhz_list_clear'
            });
            this.createZhHz = this.getNoop()
        },

        createZ6: function (){
            // z6直选
            Y.lib.Z6Choose({
                msgId: 'pt_z6',
                balls: '#z6pttz span.nsbool b',
                group:'#z6pttz span.nsopr b',
                showbar: '#z6pt_showbar',
                putBtn: '#z6pt_put',
                rndOpts:'#z6pt_jx_opts',
                clearBtn:'#z6pt_clear',
                s1:"#z6pt_s1",
                rnd: '#z6pt_jx'
            });
            // z6直选列表
            Y.lib.Z6CodeList({
                msgId: 'pt_z6',
                panel:'#z6pt_list',
                bsInput:'#z6pt_bs',
                moneySpan: '#z6pt_money',
                zsSpan: '#z6pt_zs',
                addbs:'#z6pt_addbs',
                lessbs:'#z6pt_lessbs',
                clearBtn: '#z6pt_list_clear'
            });
           this.createZ6 = this.getNoop() 
        },

        createZ6Hz: function (){
            // z6和值
            Y.lib.HzChoose({
                msgId: 'hz_z6',
                items: '#z6hz span.nsbool b',
                showbar: '#z6hz_showbar',
                putBtn: '#z6hz_put',
                clear: '#z6hz_clear',
                yl:[{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    //sort: 'hezhi',
                    offset: 3,
                    dom: '#z6hz div[mark=bqy] i'
                },{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    dom: '#z6hz div[mark=lly] i',
                    offset: 3,
                    name: 'cycle'
                }],
                startNum: 3
            });
            // 和值列表
            Y.lib.HzCodeList({
                msgId: 'hz_z6',
                panel:'#z6hz_list',
                bsInput:'#z6hz_bs',
                moneySpan: '#z6hz_money',
                zsSpan: '#z6hz_zs',
                lessbs:'#z6hz_lessbs',
                addbs:'#z6hz_addbs',
                clearBtn: '#z6hz_list_clear'
            });
            this.createZ6Hz = this.getNoop()
        },

        createZ3: function (){
            // z3直选
            Y.lib.Z6Choose({
                msgId: 'pt_z3',
                balls: '#z3pttz span.nsbool b',
                group:'#z3pttz span.nsopr b',
                showbar: '#z3pt_showbar',
                putBtn: '#z3pt_put',
                rndOpts:'#z3pt_jx_opts',
                clearBtn:'#z3pt_clear',
                s1:'#z3pt_s1',
                rnd: '#z3pt_jx'
//                yl:[{
//                    xml: '/static/info/sd/omit/hzyl_hz_all.xml',
//                    dom: '#z3pttz div[mark=bqy] i'
//                },{
//                    xml: '/static/info/sd/omit/hzyl_hz_all.xml',
//                    dom: '#z3pttz div[mark=lly] i',
//                     name: 'cycle'
//                }]
            });
            // z3直选列表
            Y.lib.Z6CodeList({
                msgId: 'pt_z3',
                panel:'#z3pt_list',
                bsInput:'#z3pt_bs',
                moneySpan: '#z3pt_money',
                lessbs:'#z3pt_lessbs',
                addbs:'#z3pt_addbs',
                zsSpan: '#z3pt_zs',
                clearBtn: '#z3pt_list_clear'
            });
           this.createZ3 = this.getNoop() 
        },

        createZhOptions: function (el){//延迟实现
           var Y = this;
           setTimeout(function() {
               Y.lib.ZhOptions()
           },100)  
           Y.createZhOptions = this.getNoop()
        },

        createZ3Hz: function (){
            // z3和值
            Y.lib.HzChoose({
                msgId: 'hz_z3',
                items: '#z3hz span.nsbool b',
                showbar: '#z3hz_showbar',
                putBtn: '#z3hz_put',
                clear: '#z3hz_clear',
                yl:[{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    //sort: 'hezhi',
                    offset: 1,
                    dom: '#z3hz div[mark=bqy] i'
                },{
                    xml: '/cpdata/omi/03/yilou/hzyl_hz_all.xml',
                    dom: '#z3hz div[mark=lly] i',
                    offset: 1,
                    name: 'cycle'
                }],
                startNum: 1
            });
            // 和值列表
            Y.lib.HzCodeList({
                msgId: 'hz_z3',
                panel:'#z3hz_list',
                bsInput:'#z3hz_bs',
                moneySpan: '#z3hz_money',
                addbs:'#z3hz_addbs',
                lessbs:'#z3hz_lessbs',
                zsSpan: '#z3hz_zs',
                clearBtn: '#z3hz_list_clear'
            });
            this.createZ3Hz = this.getNoop()
        },
        setBuyFlow: function (){
           this.get('#buy_dg,#buy_hm,#buy_zh').click(function (e, y){
               var data, msg;
                if (Yobj.C('isEnd')) {
                    Yobj.alert('您好，'+Yobj.C('lot-ch-name')+Yobj.C('expect')+'期已截止！');
                    return false
                }
               y.postMsg('msg_login', function (){
                   msg = Class.config('play_name') == 'lr' || Class.config('play_name') == 'sc' ? '' : '_'+Class.config('play_name2');
                   if (Class.config('play_name') == 'sc' && y.postMsg('msg_check_sc_err').data) {
                       return false// 上传额外检测
                   }else if (data = y.postMsg('msg_get_list_data_'+Class.config('play_name')+msg).data) {//索取要提交的参数
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

        createTabs: function (){
            var playTabs, subPlayTabs,dsTabs, buyTabs, pn, pn2,  playid, runSub, Y, reqiTabs;
            Y = this;

            //主玩法
            playTabs = this.lib.Tabs({// zx / z6 / z3
                items:'#playTabsDd [bet]',
                focusCss: 'cur',
                hoverCss: ''
            });
            //子玩法
            subPlayTabs = this.lib.Tabs({// 
                items:'#subplay_tabs a',
                focusCss: 'cur',
                hoverCss: ''
            });
            //购买方式

            buyTabs = this.lib.Tabs({
                items:'#all_form label',
                focusCss:'cur',
                contents: '#ptdiv,#hmdiv,#zhdiv'
            });
            pn = 'pt,sc,hz'.split(',');
            pn2 = 'zhx,z6,z3'.split(',');
            playid = {
                pt:1,
                lr:3,
                sc:1,
                dq: 1
            };

            //top3玩法
            playTabs.onchange = function (a, b){
                this.get('#dssc,#zhxhz,#z3hz,#z6hz').hide();
                this.get('#pttz').show(b===0);
                this.get('#z6pttz').show(b===1);
                this.get('#z3pttz').show(b===2);
                Class.config('play_name', 'pt');
                Class.config('play_name2', pn2[b]);
                Class.config('playid', 1);
                this.postMsg('msg_clear_code');//通知清除选择
                subPlayTabs.focus(0)//子玩法定位到第一个
            };
            playTabs.focus(0);

            this.onMsg('msg_change_play', function (x){
                playTabs.focus(x)// 配合导入号码
            });

            //子玩法 pt/ds/hz
            subPlayTabs.onchange = function (a, b){
            	this.get('#dssc').hide();
            	buyTabs.btns.show();
            	buyTabs.btns.slice(-1).hide(b==1);
                buyTabs.focus(0);
                switch(Class.config('play_name2')){
                case 'zhx':
                    this.get('#pttz').show(b==0);
                    this.get('#zhxhz').show(b==2);
                    if (b==2) {
                        Y.createZhHz()//直选和值
                    }
                    this.get('#uphelp ul').show().slice(-1).hide();
                   
                    $("#bzgs").unbind("click");
                    $('#bzgs').bind({
                		click:function(){	
                			Y.openUrl('bzgs_zx.html',420,380);  
                			return false;
                		}
                	});
                   
                    break;
                case 'z6':
                    this.get('#z6pttz').show(b==0);
                    this.get('#z6hz').show(b==2);
                    if (b==0) {
                        Y.createZ6()
                    }else if(b==2){
                        Y.createZ6Hz()
                    }
                   this.get('#uphelp ul').hide().slice(-1).show();
                   $("#bzgs").unbind("click");
                   $('#bzgs').bind({
               		click:function(){	
               			Y.openUrl('bzgs_z6.html',420,380);    
               			return false;
               		}
               		});
                
                    break;
                case 'z3':
                    this.get('#z3pttz').show(b==0);
                    this.get('#z3hz').show(b==2);
                    if (b==0) {
                        Y.createZ3()
                    }else if(b==2){
                        Y.createZ3Hz()
                    }
                    this.get('#uphelp ul').hide().slice(-1).show();
                    $("#bzgs").unbind("click");
                    $('#bzgs').bind({
                   		click:function(){	
                   			Y.openUrl('bzgs_z3.html',420,380);   
                   			return false;
                   		}
                   	});
                }
                if (b==1) {
                    Y.createDs()//创建单式-共用
                     this.get('#sd_tips div.ncathleft').hide()
                    this.get('#dssc').show();
                }else{
                    var tipId = ('#'+Class.config('play_name2')+pn[b]+'_tips').replace(/z\dzxhz/,'zxhz').replace('sc', 'pt');
                    this.get('#sd_tips div.ncathleft').hide().get(tipId).show();//选号列表栏
                    var tipId = ('#'+Class.config('play_name2')+pn[b]+'_tip').replace(/z\dzxhz/,'zxhz').replace('sc', 'pt');
                    this.get('#ds_tip h2').hide().get(tipId).show();//选号列表栏
                }
                Class.config('play_name', pn[b]);
                
                this.get('#hz_tj').show(b==2);
                this.postMsg('msg_clear_code');
            
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
                 this.get('#all_form p').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票','连续多期购买同一个（组）号码'][b]);
            };
		}
    }); 
})()