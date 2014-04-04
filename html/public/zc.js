(function (){
	var tpl_ishm =  '<table width="100%" border="0" cellpadding="0" cellspacing="0"  class="cot">'+
	'<tr><td rowspan="2" class="t_td_c">方案信息</td><td>玩法</td><td>注数</td><td>倍数</td><td>总金额</td><td>份数</td><td>保底</td><td>提成</td><td>保密类型</td></tr>'+
	'<tr><td>{$play}</td><td>{$zhushu}</td><td>{$beishu}</td><td>{$allmoney}元</td><td>{$buymun}份</td><td>{$bdscale}</td><td>{$tc_bili}</td><td>{$hidetype}</td></tr>'+
	'<tr><td  class="t_td_c">投注内容</td><td colspan="8" class="tdff">{$ytcase}'+
	'<table width="620" border="0" cellpadding="0" cellspacing="0" class="coz" style="display:{$codesHidden};">'+
	'<col width="50" /><col width="20" /><col width="20" /><col width="20" /><col width="20" />'+
	'<col width="20" /><col width="20" /><col width="20" /><col width="20" /><col width="20" />'+
	'<col width="20" /><col width="20" /><col width="20" /><col width="20" /><col width="20" /><thead>'+
	'<tr><td class="coza">场次</td>{$index}</tr></thead>'+
	'<tr><td  class="coza">对阵</td>{$vsName}</tr>'+
	'<tr><td  class="coza">选号</td>{$code}</tr><tfoot><tr style="display:{$dthidden}"><td class="coza">胆拖</td>{$dan}</tr></tfoot></table></td></tr>'+
	'<tr><td  class="t_td_c">认购信息</td><td colspan="8" style="line-height:33px;text-align:left;padding-left:30px" class="tdff">您本次购买需消费<font>{$buymoney}</font>元</td>'+
	'</tr></table>';

	var tpl_isdg =  '<table width="100%" border="0" cellpadding="0" cellspacing="0"  class="cot">'+
    '<colgroup><col width="135" /><col width="160" /><col width="160" /><col width="160" /><col />'+
    '<tr><td rowspan="2" class="t_td_c">方案信息</td><td>玩法</td><td>注数</td><td>倍数</td><td>总金额</td></tr>'+
    '<tr><td>{$play}</td><td>{$zhushu}</td><td>{$beishu}</td><td>{$buymoney}元</td></tr>'+
    '<tr><td  class="t_td_c">认购信息</td><td colspan="4" class="tdff">{$ytcase}'+
    '<table width="620" border="0" cellpadding="0" cellspacing="0" class="coz" style="display:{$codesHidden};">'+
    '<col width="50" /><col width="20" /><col width="20" /><col width="20" /><col width="20" />'+
    '<col width="20" /><col width="20" /><col width="20" /><col width="20" /><col width="20" />'+
    '<col width="20" /><col width="20" /><col width="20" /><col width="20" /><col width="20" /><thead>'+
    '<tr><td class="coza">场次</td>{$index}</tr></thead>'+
    '<tr><td  class="coza">对阵</td>{$vsName}</tr>'+
    '<tr><td  class="coza">选号</td>{$code}</tr><tfoot><tr style="display:{$dthidden}"><td class="coza">胆拖</td>{$dan}</tr></tfoot></table></td></tr>'+
    '<tr><td  class="t_td_c">投注信息</td><td colspan="4" style="line-height:33px;text-align:left;padding-left:30px" class="tdff">您本次购买需消费<font>{$buymoney}</font>元</td>'+
    '</tr></table>';

    Class.C('root', 'http://'+location.host+'/');
    Class.C('add-money-url', $_user.daohang.addmoney);
    Class.C('min-rengou', .05);//最低认购
    Class.C('fsfq', $_trade.url.pcast);
    Class.C('bxfq', Class.C('root')+'');
    Class.C('dsfq', $_trade.url.filecast);

    Class.extend('checkMaxMoney', function (money, fn){//检测最大金额是否超出
        var limit, LM, pe;
        limit = this.getLimit();
        if (money > limit.max) {
            //this.getTip().show(showNode, '<h5>超过最大金额</h5>您好，单个方案最大金额为<strong style="color:red">'+Number(limit.max).rmb()+'</strong>元！').setIco(9);
            this.postMsg('msg_show_dlg',' 您好，单个方案最大金额为<strong style="color:red">'+Number(limit.max).rmb()+'</strong>元！')
            if (this.isFunction(fn)) {
                fn.call(this, money, limit.max)
            }
            return false
        }else{
            this.getTip().hide()
        }
        return true
    }); 
    Class.extend('moveToBuy', function (fn){//购买按钮可见
        var h, ph, a, b;
        h = this.getXY(this.one('#b_form'));
        ph  = this.getSize();
        a = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
        c = h.y - ph.offsetHeight + 45 + this.get('#b_form').next('div').one().offsetHeight;
        if (false && a < c) {
            this.fx(function (f, i){
                document.documentElement.scrollTop = document.body.scrollTop = f(a,c)
            }, {end: fn})     
        }else{
            this.isFunction(fn) ? fn.call(this) : null
        }
    });
    Class.extend('getLimit', function (){//读取购买限额
        var l, limit;
        limit = Class.C('limit');
        if (!limit) {
            limit = [{//默认
                min: 2,
                max: 200000
            },{
                min: 15,
                max:300000
            }];
            if (l = this.get('#money_limit').val()) {
                l = l.replace(/\s/g,'').split(',');
                if (l[0]) {//防止为空
                    limit = [{
                        min: Yobj.getInt(l[0]),
                        max: Yobj.getInt(l[1], Number.MAX)
                    },{
                        min: Yobj.getInt(l[2]),
                        max:Yobj.getInt(l[3])
                    }]                
                }
            }
           Class.C('limit', limit);//[{min,max},{}]
        }
        return Class.C('price') == 2 ? limit[0] : limit [1]
    });
    Class.extend('loadEndTime', function (){// 变换截止时间
        this.ajax({
            url:'',
            data:{
                lotid: this.get('#lotid').val(),
                playid: this.getPlayId(),
                expect: this.get('#expect').val()
            },
            end:function (data, i){
                var json;
                if (json = this.dejson(data.text)) {
                    Class.C('limit', [{min:this.getInt(json.minmoney), max:this.getInt(json.maxmoney)}, {min:this.getInt(json.minmoney), max:this.getInt(json.maxmoney)}]);
                    this.postMsg('msg_endtime_change', json.endtime, data.date)
                }
            }
        })
    });
    Class.extend('updateBalance', function (money){//更新
          this.get('#buyMoneySpan,#buyMoneySpan2').html(money.rmb());    
    });
    Class.extend('getLotInfo', function (){
        var map = {
            80:{ name: '胜负彩', vsLen: 14},
            81: {name: '任选九', vsLen: 9},
            82:{name: '进球彩', vsLen: 8},
            83:{name: '半全场', vsLen: 12}           
        };
       return map[this.get('#lotid').val()] || {}
    });
    
    Class.extend('getLotPath',function(){
    	var lot={
				80:'/zc/',
				81:'/r9/',
				82:'/jq/',
				83:'/bq/'
		};
    	return lot[this.get('#lotid').val()]||{}
    });
    
    Class.extend('getwfjs',function(){
    	var wfjs={
				80:'/help/help_sfc.html',
				81:'/help/help_rxjc.html',
				82:'/help/help_jq4.html',
				83:'/help/help_zc6.html'
		};
    	return wfjs[this.get('#lotid').val()]||{}
    });
       
    
//对话框类
    Class('Dlg', {
        index:function (){
      	  	//成功
	        this.dlgbuysuc = this.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
	        this.dlgbuysuc.addClose('#dlg_buysuc_close,#dlg_buysuc_close2,#dlg_buysuc_back');
	        this.get('#dlg_buysuc div.tantop').drag('#dlg_buysuc');         	
            //通用
            this.dlg = this.lib.MaskLay('#info_dlg','#info_dlg_content');
            this.dlg.addClose('#info_dlg_close a,#info_dlg_ok');
            this.get('#info_dlg div.tantop').drag('#info_dlg');
            //确认
            //this.confirm = this.lib.MaskLay('#b2_dlg','#b2_dlg_content','#b2_dlg_title');
            //this.confirm.addClose('#b2_dlg_close a,#b2_dlg_no,#b2_dlg_yes');
            //this.get('#b2_dlg div.tips_title').drag('#b2_dlg');
            //通用确认
            this.confirm2 = this.lib.MaskLay('#confirm_dlg','#confirm_dlg_content','#confirm_dlg_title');
            this.confirm2.addClose('#confirm_dlg_close a,#confirm_dlg_no,#confirm_dlg_yes');
            this.get('#confirm_dlg div.tantop').drag('#confirm_dlg');
            //合买确认
            this.isBuy = this.lib.MaskLay('#ishm_dlg','#ishm_dlg_content', '#ishm_dlg_title');
            this.isBuy.addClose('#ishm_dlg_close,#ishm_dlg_no,#ishm_dlg_yes');
            this.get('#ishm_dlg div.tantop').drag('#ishm_dlg');
            //胆拖拆分明细
            this.splitDlg =  this.lib.MaskLay('#split_dlg','#split_dlg_list');
            this.splitDlg.addClose('#split_dlg_close a','#split_dlg_ok');
            this.get('#split_dlg div.tan_top').drag('#split_dlg');
            //充值
            this.addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
            this.addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
            this.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
            this.bindMsg();
        },
        bindMsg: function (){
	       	 var Y = this;
	         Class.extend('buySucceedDlg', function (lotid,projid){
	             $('#dlg_buysuc_view').bind({
	            	 click:function(){	            		
	            		 window.location= $_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;	            		 
	            	 }
	             });
	             Y.dlgbuysuc.pop('<div class="txt_suc">您好，'+Y.C('userName')+'，恭喜您购买成功!</div>');
	         }); 
            var hm = this.isBuy;
            this.extend('popIsWin', function (html, fn){
                var lot = this.getLotInfo();
                hm.title.html(lot.name + '第' + this.get('#expect').val() + '期方案' + (this.C('buy_type') == 0 ? '代购' : '合买'));
                hm.pop(html, function (e, btn){
                    if (btn.id == 'ishm_dlg_yes') {
                        fn.call(this)
                    }
                })
            });
            this.onMsg('msg_show_dlg', function (msg, fn){
                this.dlg.pop.apply(this.dlg, arguments)
            });
            this.onMsg('msg_isdg', function (msg, fn){
                this.confirm.pop.apply(this.confirm, arguments)
            });
            this.onMsg('msg_show_is', function (msg, fn, title, btn2){
                if (title) {
                    this.confirm2.title.html(title)
                }
                this.get('#confirm_dlg_yes').val(btn2||'确定');
                this.confirm2.pop(msg, fn)
            });
            //充值
            this.onMsg('msg_show_addmoney', function (fn, args){
                this.addMoneyDlg.pop(false, function (e, btn){
                    if (typeof fn === 'function' && btn.id == 'addMoneyYes') {
                        fn(args)
                    }
                })
            });
        }
    });
//合买表单类
    Class('HmOptions', {
        index:function (){
            var limit, yobj;
            limit = Class.C('min-rengou');
            yobj = this;
            yobj.low = 1;
            this.fs = this.fit = this.rg = 1;
            this.bd = 0;
            this.data = {beishu:0, zhushu:0, totalmoney:0};
            $("#gkfs em").each(function(){
    			$(this).click(function(){
    				$("#gkfs em").removeClass("cur");
    				$(this).addClass("cur");
    				$("#gk").val($(this).attr("value"));
    			});
    		});
    		
    		$("#tc b").each(function(){
    			$(this).click(function(){
    				$("#tc b").removeClass("cur");
    				$(this).addClass("cur");
    				$("#tcSelect").val($(this).attr("value"));
    			});
    		});
            //份数
            this.fsInput = this.lib.DataInput({
                input:'#fsInput',
                initVal: 0,
                min:1,
                overflowFix:true
            });
            //this.get('#fsInput').prop('disabled', true);
            this.fsInput.onchange = function (){
                var list, d, fs;
                yobj.fs  = fs = this.getInt(this.get("#fsInput").html());
                this.need('#fsMoney').html((fs ===0 ? 0 : 1));
                d = yobj.getfitFs(yobj.data.totalmoney, fs);                
                yobj.fit = d;
                yobj.low = Math.ceil(fs*limit);
                this.postMsg('msg_fs_change', fs)
            };
            this.fsInput.onMsg('msg_list_change', function (data){
            	yobj.data =data;
                this.get("#fsInput").html(yobj.data.totalmoney);
                this.onchange()
            });
            this.fsInput.onchange();
            //认购
            this.rgInput = this.lib.DataInput({
                input:'#rgInput',
                initVal: 0,
                min:1
            });
            this.rgInput.onchange = function (){
                var d, fs, low, mf;
                yobj.rg = fs = this.getInt(this.val());
                mf = yobj.data.totalmoney / yobj.fs;
                this.need('#rgMoney').html((fs === 0 || yobj.fs === 0 ? 0 : mf* fs).rmb());
                this.need('#rgScale').html((yobj.fs ===0 ? 0 : (fs/yobj.fs*100).toFixed(2))+'%');
                if (fs < yobj.low) {
                    this.need('#rgErr').html('您至少需要认购'+yobj.low+'份，共计'+(yobj.low * mf).rmb()+'元！');
                }
                this.need('#rgErr').show(fs < yobj.low)
            };
            this.rgInput.onMsg('msg_fs_change',function (){
                this.val(yobj.low);
                this.onchange()
            });
            //保底
            this.bdInput = this.lib.DataInput({
                input:'#bdInput',
                initVal: 0,
                min:1
            });
            this.bdInput.onchange = function (){
                var d, fs, sl;
                yobj.bd = fs = this.getInt(this.val());
                this.need('#bdMoney').html((fs ===0 ? 0 : yobj.data.totalmoney / yobj.fs * fs).rmb());
                sl = yobj.fs === 0 ? 0 : ((fs/yobj.fs*100).toFixed(2) + '%');
                this.need('#bdScale').html(sl);
                this.need('#bdErr').show(this.one('#isbaodi').checked && sl < 5);
            };
            this.bdInput.onMsg('msg_fs_change',function (){
                if (this.get('#isbaodi').one().checked) {
                    yobj.need('#bdInput').val(Math.ceil(yobj.fs*.05))
                     this.onchange()
                }           
            });
            this.get('#isbaodi').click(function (){
                yobj.need('#bdInput').val(this.checked ? Math.ceil(yobj.fs-(Y.get('#rgInput').val()*1)) : 0).nodes[0].disabled = !this.checked;
                yobj.bdInput.onchange()
            }).prop('checked', false);
            this.get('#bdInput').val(0);
            this.get('#moreCheckbox').click(function (){
                yobj.get('#case_ad').show(this.checked);
                yobj.moveToBuy();
            });
            this.onMsg('msg_get_hm_param', function (){
                return this.getParam()
            });
        },
        getfitFs: function (a, b){//计算适当份数
            while((a > b) && a/b - (a/b).toFixed(~~2) !== 0){b++};
            return Math.min(a, b)
        },
        getParam: function (){
              var yobj, isshow, param, tmp;
              yobj = this;
            if (!this.one('#agreement').checked) {
                 this.postMsg('msg_show_is', '<p style="text-align:center;line-height:500%">您好，您需要阅读并且同意《用户合买代购协议》！</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         yobj.one('#agreement').checked = true                     
                      }
                  }, false, '同意')
            }else if (this.fs < 1) {
                 this.postMsg('msg_show_dlg', '每份金额必须大于等于1！', function (){
                     yobj.fsInput.input.doProp('select')
                 })
             }else if(this.fs > yobj.data.totalmoney){
                  this.postMsg('msg_show_dlg', '您好，您分成的每份金额不能小于1！', function (){
                     yobj.fsInput.input.doProp('select')
                 })            
             }else if (this.fs != this.fit) {
                  yobj.postMsg('msg_show_is', '<p style="padding:20px 0;font-size:14px;text-indent:2em">您好，每份金额不能除尽， 系统建议您分成<strong style="color:red"> '+this.fit
                      +' </strong>份，点击确定自动分成<strong style="color:red"> '+this.fit+' </strong>份！</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         yobj.get("#fsInput").html(yobj.fit);
                         yobj.fsInput.onchange();                      
                      }else{
                          yobj.fsInput.input.doProp('select')
                      }
                  }, '份数不能整除')
             }else if(this.rg < this.low){
                 this.postMsg('msg_show_dlg', '您好，您至少需要认购'+this.low+'份，共计'+(this.low*this.C('price')).rmb()+'元！', function (){
                     yobj.rgInput.input.doProp('select');
                     yobj.rgInput.val(yobj.low);
                 })
             }else if(this.rg > this.fs){
                 this.postMsg('msg_show_dlg', '您好，您要认购的份数不能大于所分的份数！', function (){
                     yobj.rgInput.input.doProp('select')
                 })         
             }else if(this.one('#isbaodi').checked && this.getInt(this.one('#bdScale').innerHTML)<5){
                 var minFs = Math.ceil(yobj.getInt(yobj.get("#fsInput").html())*.05);
                 this.postMsg('msg_show_dlg', '您好，保底金额至少为总金额的5%，至少<span class="red">' + minFs + '</span>份！', function (){
                      yobj.bdInput.input.doProp('select');
                      yobj.bdInput.val(minFs);
                 })
             }else if (this.one('#isbaodi').checked && ((this.getInt(this.bd)+this.getInt(this.rg)) > this.getInt(this.fs))){
            	 var minFs = Math.ceil(yobj.getInt(yobj.get("#fsInput").html())*.05);
            	 this.postMsg('msg_show_dlg', '保底份数加认购份数不能够超过总份数！', function (){
            		 yobj.bdInput.input.val(minFs).doProp('select');
                 });                     
            }else{
                isshow = this.need('#gk').val();
                
                tmp = this.need('#caseInfo').one();
                return {//合买参数
                    allnum: this.fs,
                    buynum: this.rg,
                    isbaodi: this.one('#isbaodi').checked ? 1 : 0,
                    baodinum: this.bd,
                    isshow: isshow,
                    totalmoney: this.data.totalmoney,
                    money: this.data.totalmoney/this.fs*this.rg,
                    tc_bili: this.get('#tcSelect').val(),
                    title: this.need('#caseTitle').val(),
                    content: tmp.value == tmp.defaultValue ? '' : tmp.value
                }  
            }
         }
    });
//购买请求类
    Class('BuySender', {
        index:function (){
           Class.C('expect', this.get('#expect').val());//expect
           if (this.get('#case_ad textarea').size()) {// content
               this.lib.DataInput({
                    input:'#case_ad textarea',
                    type: 'default',
                    max: 200,
                    change: function (val){
                        var len, tip;
                        tip = this.input.next('span');
                        len = val.length;
                        tip.html('已输入'+len+'个字符，最多200个');
                    }
               })               
           };
           if (this.get('#case_ad input').size()) {//title
               this.lib.DataInput({
                    input:'#case_ad input',
                    type: 'default',
                    len: 20,
                    change: function (val){
                        this.input.next('span').html('已输入'+val.length+'个字符，最多20个')
                    }
               })               
           };
            this.onMsg('msg_buy_dg', function (listParam){
                this.overflowMoney(listParam.totalmoney) && this.doDg(listParam)
            });   
            this.onMsg('msg_buy_hm', function (listParam){//号码列表参数
                var hm = this.postMsg('msg_get_hm_param');// 取得合买参数
                 if (hm.data) {
                      this.overflowMoney(listParam.totalmoney) && this.doHm(listParam, hm.data)                 
                 }else if(this.C('isbx')){//补选
                     this.doHm(listParam, {
                        pid: this.C('pid')
                     })
                 }
            });
        },
        overflowMoney: function (totalmoney){
            if (this.C('isEnd')) {
                this.alert('您好，'+this.C('lot-ch-name')+this.C('expect')+'期已截止！');
                return false
            }
            var limit = this.getLimit();
            var type = this.getPlayText();
            if (totalmoney < limit.min) {
                 this.alert('您好，'+type+'投注最小限制金额为'+Number(limit.min).rmb()+'元！');
                 return false
            }else if(totalmoney > limit.max){
                 this.alert('您好，'+type+'投注最大限制金额为'+Number(limit.max).rmb()+'元！');
                 return false                
            }else{
                return true
            }
        }, 
        doDg: function (list_param){
            if (!this.get('#agreement').nodes[0].checked) {
                 this.postMsg('msg_show_is', '<p style="text-align:center; line-height:500%">您好，您需要阅读并且同意《用户合买代购协议》！</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         this.one('#agreement').checked = true                     
                      }
                  }, '温馨提示', '同意')
            }else{
                 this.getMoney(list_param, function (){
                      var param, Y, isupload;
                      Y = this;
                      
                      isupload = list_param.isupload;
                      param = this.mix(list_param, this.getParam());// 由列表参数+基本参数
                      if (Class.C('play_name') == 'sc') {
                          param.isupload = isupload
                      }
                      var tplParam = this.mix(this.getVSHtml(param), {
                            play: this.getPlayText(),
                            beishu: list_param.beishu,
                            zhushu: list_param.zhushu,
                            buymoney: param.totalmoney.rmb(),
                            codesHidden: Class.C('isyt') || Class.C('isds') ? 'none' : '',
                            dthidden:  Class.C('isdt') ? '' : 'none'
                      });
                      if (Class.C('play_name') == 'sc' ) {
                          tplParam.ytcase = '<p style="text-align:center;">'+param.codes + '<p>'
                      }
                      this.popIsWin(tpl_isdg.tpl(tplParam), function (){
                          if (Class.C('isdt')) {
                              param.codes = param.dtcodes;
                              delete param.dtcodes;
                          }
                          Class.C('play_name') == 'sc' ? Y.doSc(param) : Y.doBuy(param)                                
                      })    
                 })
            }
        },
        getVSHtml: function ( param){
            var isyt = Class.C('isyt');
            var isbx = Class.C('isbx');
            var isdt = Class.C('isdt');
            var issc = Class.C('play_name') == 'sc';
            var isR9 = this.get('#lotid').val() == '81';
            var vsLen =  isR9 ? 14 : this.getLotInfo().vsLen;
            var cs = '';
            if (vsLen == 12 || vsLen == 8) {
                vsLen = vsLen/2;
                cs='colspan="2"';
            }
            return {
                index: this.repeat(vsLen ,function (i){
                    return '<td '+cs+'>'+(i+1)+'</td>'
                }).join(''),
                vsName: (isyt || issc) && !isbx? '' : this.postMsg('msg_get_vslist').data.map(function (t){
                    return '<td><div style="width:16px">' + t.replace(',','VS ').replace(/(半|全)/, '$1') + '</div></td>'
                }).join(''),
                code: param.codes.split(',').map(function (c){
                    return '<td>'+c+'</td>'
                }).join(''),
                 dan: param.dtxx ? param.dtxx.map(function (x, i){
                     return '<td>'+(x == '&nbsp;' ? x : ('<font>'+x+'</font>'))+'</td>'
                 }).join('') : '<td colspan="13">&nbsp;</td>'
              }            
        },
        doHm: function (list_data, hm_param){
             this.mix(list_data, hm_param);
             this.getMoney(list_data, function (){
                  var y, param, codes, ext, isyt, isbx, isdt, issc, isupload, vsLen;
                  y = this;
                  isyt = Class.C('isyt');
                  isbx = Class.C('isbx');
                  isdt = Class.C('isdt');
                  isds = Class.C('isds');
                  issc = Class.C('play_name') == 'sc';
                  isupload = list_data.isupload;
                  param = this.mix(list_data, this.getParam());// 列表+合买+基本参数
                  if (Class.C('play_name') == 'sc') {
                      param.isupload = isupload
                  }
                  var tplData = this.getVSHtml(param);
                  this.mix(tplData, {
                        hidetype: ['完全公开','截止后公开','仅对跟单用户公开','截止后对跟单用户公开'][param.isshow] || '',
                        codesHidden: (isyt || isds) && !isbx ? 'none' : '',
                        dthidden:  Class.C('isdt') ? '' : 'none',
                        ytcase: isyt ? this.postMsg('msg_get_ytcase').data : ''//预投方案                  
                  });
                  if (isbx){
                        this.mix(tplData, {
                            play: ('复式合买'),
                            allmoney: param.totalmoney.rmb(),
                            buymun: this.get('#anumber').val(),
                            beishu: this.get('#beishu').val(),
                            zhushu: this.get('#allmoney').val()/2,
                            buyscale: (param.buynum/param.allnum*100).toFixed(2),
                            bdscale: param.baodinum ? (param.baodinum/param.allnum*100).toFixed(2) + '%' : '未保底',
                            tc_bili: param.tc_bili+'%',//this.C('isds') ? '4%' : '0%',
                            rghidden: 'none',
                            buymoney: this.get('#allmoney').val()
                      })                  
                  }else{                      
                        this.mix(tplData, {
                            expect: param.expect,
                            play: this.getPlayText(),
                            allmoney: param.totalmoney.rmb(),
                            unitmoney: (param.totalmoney/ param.allnum).rmb(),
                            buymun: param.buynum,
                            beishu: param.beishu,
                            zhushu: param.zhushu,
                            buyscale: (param.buynum/param.allnum*100).toFixed(2),
                            needmoney: (param.totalmoney/param.allnum*param.buynum).rmb(),
                            baodi: param.baodinum,
                            bdscale: param.baodinum ? (param.baodinum/param.allnum*100).toFixed(2) + '%' : '未保底',
                            tc_bili: param.tc_bili+'%',//this.C('isds') ? '4%' : '0%',
                            buymoney: param.money.rmb()
                       })
                  }
                  if (issc) {
                	  var x=param.codes=='notxt'?'稍后上传':param.codes;
                      tplData.ytcase = '<p style="text-align:center;">'+x+ '<p>';
                  }
                  //确认合买
                  this.popIsWin(tpl_ishm.tpl(tplData),function (){
                      if (isdt) {
                          param.codes = param.dtcodes;
                          delete param.dtcodes;
                      }
                      Class.config('play_name') == 'sc' ? y.doSc(param) : y.doBuy(param)               
                  });                
             })
        },
        // 单式上传
        doSc: function (param){//合买分支
            param.playid = this.getPlayId();
            this.alert('正在提交您的订单, 请稍候...', false, true);
            delete param.money;
            var swap = true;
            if (swap){
	            var param_new ;
	           	 param_new={
	       				 gid:param.lotid,// 游戏编号
	       				 pid:param.expect,// 期次编号
	       				 play:1,// 玩法编号
	       				 codes:param.codes,
	       				 muli:param.beishu,// 投注倍数
	       				 fflag:1,// 是否文件
	       				 type:param.ishm,//方案类型0代购1合买
	       				 name:param.ishm==0?"代购":param.title,// 方案标题
	       				 desc:param.ishm==0?"代购":param.content,// 方案描叙
	       				 money:param.totalmoney,// 方案金额
	       				 tnum:param.ishm==0?1:param.allnum,// 方案份数
	       				 bnum:param.ishm==0?1:param.buynum,// 购买份数
	       				 pnum:param.isbaodi==1?param.baodinum:0,// 保底份数
	       				 oflag:param.isshow,// 公开标志
	       				 wrate:param.tc_bili,// 提成比率
	       				 comeFrom:'',// 方案来源
	       				 source:'',// 投注来源
	       				 endTime:'' // 截止时间
	                    };	 	
	            param = param_new;
            }
               
            this.sendForm({
                form:'#suc_form',
                data: param,               
                end: function (data){                	
              	  var j;
              	 this.alert.close();
                  if (j = this.dejson(data.text)) {
                      if (j.errcode == 0) {// && j.headerurl  
          				this.buySucceedDlg(param.gid,j.projid);
          				this.postMsg('msg_buy_succeed');            				
                         //window.location.href = '/main/'+j.headerurl.replace(/amp;/g,'')
                      }else{                      	
                          this.postMsg('msg_show_dlg', j.msg);
                      }
                  }else{                    
                    this.postMsg('msg_show_dlg', '网络故障, 请检查您的投注记录后重新提交!');
                  }
              }        
            });
        },
        getMoney: function (list_param, fn){//检查余额
            var money = list_param.money || list_param.totalmoney;//有合买与代购之分
            if (this.C('isbx')) {
                fn.call(this);
            }else{
                this.ajax({
                    url:Class.C('url-login-user') +"&rnd=" + Math.random(),
                    end:function (data){
                        if (data.error) {
                            this.setUserInfo('拉取用户信息失败, 请刷新重试!');
                        }else{
                           var obj = eval("(" + data.text + ")");
         			       var code = obj.Resp.code;
         				   var r = obj.Resp.row;
     					   if (code=="0"){
     						   if (r.usermoeny < money) {
                                    this.postMsg('msg_show_addmoney',function (){
                                        window.open($_user.daohang.addmoney);    
                                    });
                                }else{
                                    fn.call(this);
                                }
     					   }  
                        }
                    }
                });                
            }
        },
        getParam: function (info){
            var base = {
                  lotid: this.need('#lotid').val(),
                  playid: this.getPlayId(),
                  ishm: Class.config('buy_type') == 1 ? 1 : 0            
              }            
            this.mix(base, this.C('isbx') ? {
                pid: this.C('pid')
            } : {
                expect: this.need('#expect').val(),
                isupload: this.C('isyt') ? 0 : 1//1一般投注, 0 预投
            });
            if (Class.C('hasddsh')) {
                base.hasddsh = 1;
                base.ddsh = Class.config('last-ddsh')
            };
            if (this.C('auto-ds-tc') !== false && (Class.config('play_name') == 'lr' || Class.config('play_name') == 'sc')) {
                base.tc_bili = 4//单式的提成自动为4%, 如未指定
            }
            return base
         },
         doBuy: function (param){
              //this.chkLimitCode(param.codes, function (){
                  this.lastBuy(param)//限号检测
              //}) 
         },
         swapcode:function(param){
        	 var tmpcodes= param.codes.split("$");
        	 var codes="";
     	 
			 var tmp="";
			 var pm="1";
			 var cm="1";      
    		 for(var i=0;i<tmpcodes.length;i++){
    			 tmp="";
    			 tmp=tmpcodes[i];
    			 if (tmp.indexOf('[D:')>-1){//rjdt
    				 cm="5";
    				 tmp=tmp.replace(/\[D:([\d,#]+)\]/g, '$1$')
    				 .replace(/\[T:([\d,#]+)\]/g, '$1');    				 
    			 }
    			 
    			 if (i==tmpcodes.length-1){
    				 codes+=tmp+":"+pm+":"+cm;
    			 }else{
    				 codes+=tmp+":"+pm+":"+cm+";";
    			 }         		
    		 }
        	 param.codes=codes;
         },      
         
         lastBuy: function (param){
             var url, type;
             this.alert('正在提交您的订单, 请稍候...');
//             this.postMsg('msg_show_dlg', '正在提交您的订单，请稍后...', null, true);
             type = Class.config('play_name');
             url = type == 'sc' ? Class.config('dsfq') : Class.config('fsfq');
             url = Class.C('isbx') ? Class.C('bxfq') : url; //补选的地址不同
             delete param.money;
             delete param.msg;
             var swap = true;
             if (swap){
               this.swapcode(param);
 	           var param_new ;
 	           if (param.ishm==0){
 	            	 param_new={
 	        				 gid:Class.C('lot_id'),// 游戏编号
 	        				 pid:param.expect,// 期次编号
 	        				 play:1,// 玩法编号
 	        				 codes:param.codes,
 	        				 muli:param.beishu,// 投注倍数
 	        				 fflag:0,// 是否文件
 	        				 type:0,// 方案类型
 	        				 name:param.ishm==0?"代购":param.title,// 方案标题
 	        				 desc:param.ishm==0?"代购":param.content,// 方案描叙
 	        				 money:param.totalmoney,// 方案金额
 	        				 tnum:1,// 方案份数
 	        				 bnum:1,// 购买份数
 	        				 pnum:0,// 保底份数
 	        				 oflag:0,// 公开标志
 	        				 wrate:0,// 提成比率
 	        				 comeFrom:'',// 方案来源
 	        				 source:'',// 投注来源
 	        				 endTime:'' // 截止时间
 	                     };	 
 	             }else{
 	            	 param_new={
 	        				 gid:Class.C('lot_id'),// 游戏编号
 	        				 pid:param.expect,// 期次编号
 	        				 play:1,// 玩法编号
 	        				 codes:param.codes,
 	        				 muli:param.beishu,// 投注倍数
 	        				 fflag:0,// 是否文件
 	        				 type:param.ishm,// 方案类型
 	        				 name:param.title,// 方案标题
 	        				 desc:param.content,// 方案描叙
 	        				 money:param.totalmoney,// 方案金额
 	        				 tnum:param.allnum,// 方案份数
 	        				 bnum:param.buynum,// 购买份数
 	        				 pnum:param.isbaodi==1?param.baodinum:0,// 保底份数
 	        				 oflag:param.isshow,// 公开标志
 	        				 wrate:param.tc_bili,// 提成比率
 	        				 comeFrom:'',// 方案来源
 	        				 source:'',// 投注来源
 	        				 endTime:'' // 截止时间
 	                     };	 
 	             } 	
 	            param = param_new;
             }     
             
             this.ajax({
                 url: url,
                 type: 'POST',
                 data: param,
                 retry: 1,
                 dataType : "json",
                 end:function (data){
                	 var obj = eval("(" + data.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc;
        			this.alert.close();
        			if (code == "0") {
        				var r = obj.Resp.result;			
        				var projid = r.projid;
        				var balance = r.balance;
        				this.buySucceedDlg(param.gid,projid);
        				this.postMsg('msg_buy_succeed');
        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
        			} else {
        				this.postMsg('msg_show_dlg', desc);
        			}
                 }
             });             
         }
    });
    Class('LoadExpect',{
    	index:function(){
    		this.init();  
    		this.bindMsg();		
    	},
    	bindMsg: function(){
    		this.onMsg('msg_get_expect_suc', function (expect){
    			return this._updateUrl(expect)&&this.LoadDuiZhen();
            });     		
    	},
    	_updateUrl : function(expect) {    		
    		//期号导航链接
    		this.get("#expect_tab a").each(function(a,i){
    			a.href=Class.C('isds')?location.pathname+'?lotid='+Class.C('lot_id')+'&expect='+a.id.substr(3):location.pathname+'?expect='+a.id.substr(3);
    		});
    		//选号投注、参与合买、定制跟单、我的方案等链接
    		    		   		
			var hrefurl=[this.getLotPath()+'?expect='+expect,'/hemai/project_list.html?lotid='+Class.C('lot_id')+'&expect='+expect,'/account/'];
			this.get('.b-top-nav .clearfix a').each(function(a,i){
				a.href=hrefurl[i];
				if (i==1){
					a.target='_blank';
				}
			});
			
			$("#wfjs").attr("href",this.getwfjs());
			
			var urlarr;			
			urlarr=[this.getLotPath()+'?expect='+expect,this.getLotPath()+'project_fq_ds.html?lotid='+Class.C('lot_id')+'&expect='+expect,'/r9/project_fq_dt.html?expect='+expect];
			//普通投注、单式投注、胆拖投注等链接
			this.get('.b-top-nav .b-top-subNav a').each(function(a,i){
				a.href=urlarr[i];
			});
			
			//查看标准格式链接
			this.get('#ckbzgs').click(function (){
				var id=Class.C('lot_id');
				if (id=="80"){
					Y.openUrl('/zc/bzgs.html',420,380);
				}else if (id=="81"){
					Y.openUrl('/r9/bzgs.html',420,380);
				}else if (id=="82"){
					Y.openUrl('/jq/bzgs.html',420,380);
				}else {
					Y.openUrl('/bq/bzgs.html',420,380);
				}				
            });
			
			//合买代购协议链接
			this.get('#hmdgxy').click(function (){
				var id=Class.C('lot_id');
				if (id=="80"){
					Y.openUrl('/zc/agreement.html',530,550);
				}else if (id=="81"){
					Y.openUrl('/r9/agreement.html',530,550);
				}else if (id=="82"){
					Y.openUrl('/jq/agreement.html',530,550);
				}else {
					Y.openUrl('/bq/agreement.html',530,550);
				}				
            });
			return true;
		},
	    init: function (){//处理URL参数
	    	Class.C('lot_id',this.get("#lotid").val());
	    	Class.C('lot_gid',this.get("#lotgid").val());
	    	if (location.search.getParam('expect') != "") {//期号
	    		this.get("#expect").val(location.search.getParam('expect'));
			}
	    	if (Class.C('isds')&&location.search.getParam('lotid') != "") {//单式上传时彩种ID
	    		Class.C('lot_id',location.search.getParam('lotid'));
			}
	    	
			this.ajax({
				url : "/cpdata/game/"+Class.C('lot_id')+"/s.json?rnd=" + Math.random(),
				type : "get",
				cache:false,
				dataType : "json",
				end : function(data) {
					var obj = eval("(" + data.text + ")");
					var code = obj.period.code;
					var desc = obj.period.desc;
					if (code == "0") {
						var r = obj.period.row;
						var expectlist = [];
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var pid = rt.pid;
							var et = rt.et;
							var cft = rt.fet;
							var at = rt.at;
							expectlist[expectlist.length] = [ pid, et, cft, at ];
						});
						
						var html;	
						if (expectlist.length>0){
							for ( var i =  0; i < (expectlist.length>3?3:expectlist.length); i++) {
								if (i == 0) {
									if (this.get("#expect").val() == "") {
										this.get("#expect").val(expectlist[i][0]);
									}
									html = '<label for="exp' + expectlist[i][0] + '" value="' + expectlist[i][0] + '"><input type="radio" name="radio1" id="exp' + expectlist[i][0] + '"/>当前期(第' + expectlist[i][0] + '期)</label>';
								} else {
									html += '<label for="exp' + expectlist[i][0] + '" value="' + expectlist[i][0] + '"><input type="radio" name="radio1" id="exp' + expectlist[i][0] + '"/>预售期(第' + expectlist[i][0] + '期)</label>';
								}
							}		
						}	
						var find = false;
						for ( var i =  0; i < (expectlist.length>3?3:expectlist.length); i++) {
							if (expectlist[i][0] == this.get("#expect").val()) {
								find = true;
								$("#fs_endTimeSpan").html(Y.getDate(expectlist[i][1]).format('MM-DD hh:mm'));
								$("#endTimeSpan").html(Y.getDate(expectlist[i][2]).format('MM-DD hh:mm'));
								this.get("#responseJson #serverTime").val(Y.getDate(data.date).format('YY-MM-DD hh:mm:ss'));
								this.get("#responseJson #endTime").val((Class.C('isds')?Y.getDate(expectlist[i][2]):Y.getDate(expectlist[i][1])).format('YY-MM-DD hh:mm:ss'));
								this.postMsg('msg_show_endtime_CountDown');
							}
						}
						if (!find) {
							alert('对不起，该期暂未开售或者已经截止!');
							if (history.length == 0) {
								window.opener = '';
								window.close();
								return ;
							} else {
								history.go(-1);
								return ;
							}
						}
						$("#expect_tab").html(html);
//						for ( var i = 0; i < expectlist.length; i++) {
//							$("#e" + expectlist[expectlist.length - i-1][0]).removeClass();
//						}
						if ($("#expect").val() == "") {
							$("#expect").val(expectlist[expectlist.length - 1][0]);
						}
						if ($("#exp" + $("#expect").val())) {
							$("#exp" + $("#expect").val()).attr("checked", true);
							this.postMsg('msg_get_expect_suc',$("#expect").val());
						}
						
						$("#expect_tab label").each(function(){
			    			$(this).click(function(){
			    				var ex=$(this).attr("value");
			    				$("#expect").val(ex);
			    				var endtime;
								for(var i =  0; i < (expectlist.length>3?3:expectlist.length); i++){
									if (Y.getPlayId()==3
											||Y.getPlayId()==24 //pls 直选单式
											||Y.getPlayId()==39 //pls 组三 组六 单式
											||Y.getPlayId()==47 //3D 组三 组六 单式
											||Y.getPlayId()==63 //plw  单式
											||Y.getPlayId()==99 
											||Y.getPlayId()==101
											||Y.getPlayId()==135	
										){
										endtime=Y.getDate(expectlist[i][2]).format('YY-MM-DD hh:mm:ss');
									}else{
										endtime=Y.getDate(expectlist[i][1]).format('YY-MM-DD hh:mm:ss');
									}
									
									if(expectlist[i][0]==ex){
										Y.postMsg('msg_endtime_change', endtime, data.date);
										$("#fs_endTimeSpan").html(Y.getDate(expectlist[i][1]).format('MM-DD hh:mm'));
										$("#endTimeSpan").html(Y.getDate(expectlist[i][2]).format('MM-DD hh:mm'));
									}
								}
//			    				Y.postMsg('msg_get_expect_suc',ex);
			    				location.href ='?expect='+ex+'';
			    				
			    			});
			    		});
						
					} else {
						this.alert(desc);
					}
				},
				error : function() {
					this.alert("网络故障!");
					return false;
				}
			});
	    },
		LoadDuiZhen : function() {
			var expect = $("#expect").val()
			if (expect == "") {
				this.alert("期号加载失败,请稍后重试!");
				return false;
			}
			if ($("#duizhen").size()==0){
				return false;
			}
			this.ajax({
						type : "get",
						cache:false,
						dataType : "json",
				        url: "/cpdata/match/zc/"+Class.C('lot_id')+"/"+expect+".json"+ "?rnd=" + Math.random(),
						end : function(data) {
							    var obj = eval("(" + data.text + ")");
								var r = obj.rows.row;
								var html;
								html = "";
								var i=0;
								if (Class.C('lot_gid')==3){
									var vs=[];
									r.each(function(rt,o) {										
										var mid = rt.mid;
										var hn = rt.hn.substr(3);
										var gn = rt.gn;
										var bt = rt.bt;
										var b3 = parseFloat(rt.b3).rmb(false,2);
										var b1 = parseFloat(rt.b1).rmb(false,2);
										var b0 = parseFloat(rt.b0).rmb(false,2);
										var cl = rt.cl;
										var mn = rt.mname;
										vs[vs.length]=[mid,hn,gn,bt,b3,b1,b0,cl,mn];
									})
									for (var i=0;i<6;i++){		//半全场
										html += '<tr data-vs="'+vs[i*2][1]+','+vs[i*2][2]+' 半" name='+i+' onselectstart="return false">'
											+'<td rowspan="2">'+(i+1)+'</td>'
											+ '<td class="sup_1" rowspan="2" style="background:'+vs[i*2][7]+';"><a href="" id="mn'+vs[i*2][0]+'" class="bq_xa" target="_blank" >'+vs[i*2][8]+'</a></td>'
											+'<td rowspan="2">'+Y.getDate(vs[i*2][3]).format('MM-DD hh:mm')+'</td>'
											+'<td>[主] <a href="" target="_blank" id="hteam'+(i+1)+'" class="mtc_name"><em id="htid'+((i+1)*2-1)+'" class="ew_e">'+vs[i*2][1]+'</em></a><em></em></td>'
											+'<td>半场</td>'
											+'<td class="btn_a">3</td>'
											+'<td class="btn_a">1</td>'
											+'<td class="btn_a">0</td>'
											+'<td><a href="javascript:void(0);" class="jcq_q">全</a></td>'
											+'<td  id="b3'+((i)*2-1)+'">'+parseFloat(vs[i*2][4]).rmb(false,2)+'</td>'
											+'<td  id="b1'+((i)*2-1)+'">'+parseFloat(vs[i*2][5]).rmb(false,2)+'</td>'
											+'<td  id="b0'+((i)*2-1)+'">'+parseFloat(vs[i*2][6]).rmb(false,2)+'</td>'
											+'<td rowspan="2"><a href="#" class="mtc_name" id="ox'+(i+1)+'" target="_blank">析</a><a href="#" class="mtc_name" id="oy'+(i+1)+'" target="_blank">亚</a><a href="#" class="mtc_name" id="oz'+(i+1)+'" target="_blank">欧</a></td>'
											+'</tr>'
											+'<tr data-vs="'+vs[i*2][1]+','+vs[i*2][2]+'  全" name='+i+'><td>[客] <a href="" target="_blank" id="vteam'+(i+1)+'" class="mtc_name"><em id="gtid'+((i+1)*2-1)+'" class="ew_e">'+vs[i*2][2]+'</em></a><em></em></td>'
											+'<td>全场</td>'
											+'<td class="btn_a">3</td>'
											+'<td class="btn_a">1</td>'
											+'<td class="btn_a">0</td>'
											+'<td><a href="javascript:void(0);" class="jcq_q">全</a></td>'
											+'<td  id="b3'+((i+1)*2-1)+'">'+parseFloat(vs[i*2+1][4]).rmb(false,2)+'</td>'
											+'<td  id="b1'+((i+1)*2-1)+'">'+parseFloat(vs[i*2+1][5]).rmb(false,2)+'</td>'
											+'<td  id="b0'+((i+1)*2-1)+'">'+parseFloat(vs[i*2+1][6]).rmb(false,2)+'</td></tr>';
									}								
								}else{
									r.each(function(rt,o) {
										var mid = rt.mid;
										var hn = rt.hn;
										var gn = rt.gn;
										var bt = rt.bt;
										var b3 = (rt.b3!=""&&!isNaN(rt.b3)?parseFloat(rt.b3).rmb(false,2):"--");
										var b1 = (rt.b3!=""&&!isNaN(rt.b1)?parseFloat(rt.b1).rmb(false,2):"--");
										var b0 = (rt.b3!=""&&!isNaN(rt.b0)?parseFloat(rt.b0).rmb(false,2):"--");
//										var b1 = (rt.b3==""?"--":(rt.b1+"00").slice(0,-2));
//										var b0 = (rt.b3==""?"--":(rt.b0+"00").slice(0,-2));
										var cl = rt.cl;
										var mn = rt.mname;
										var classname=o%2==0?"even odd":"even";
										i++;
										if (Class.C('lot_gid')==1){
											if ($('#playid').val() == '123'){//任九胆拖
												html += '<tr class="'+classname+'" data-vs="'+hn+','+gn+'" onselectstart="return false">'
												+ '<td>'+mid+'</td>'
												+ '<td style="background:'+cl+';"><a href="" id="mn'+mid+'" target="_blank" class="bq_xa" >'+mn+'</a></td>'
												+ '<td>'+Y.getDate(bt).format('MM-DD hh:mm')+'</td>'
												+ '<td><em></em><a href="" target="_blank" id="hteam'+mid+'" class="mtc_name"><em id="htid'+mid+'" class="ew_e">'+hn+'</em></a> VS '
												+ '<a href="" target="_blank" id="vteam'+mid+'" class="mtc_name"><em id="gtid'+mid+'" class="ew_e">'+gn+'</em></a><em></em></td>'
												+ '<td class="btn_a">3</td>'
												+ '<td class="btn_a">1</td>'
												+ '<td class="btn_a">0</td>'
												+ '<td><a class="mtc_name sp_all">全</a></td>'
												+ '<td><input type="checkbox" /></td>'
												+ '<td id="b3'+mid+'">'+b3+'</td><td id="b1'+mid+'">'+b1+'</td><td id="b0'+mid+'">'+b0+'</td>'
												+ '<td><a href="" target="_blank" id="ox'+mid+'" class="mtc_name">析</a> <a href="" target="_blank" id="oy'+mid+'" class="mtc_name">亚</a> '
												+ '<a href="" target="_blank" id="oz'+mid+'" class="mtc_name">欧</a></td>'
												+ '</tr>';
											}else{//胜负彩+任九
												html += '<tr class="'+classname+'" data-vs="'+hn+','+gn+'" onselectstart="return false">'
												+ '<td>'+mid+'</td>'
												+ '<td style="background:'+cl+';"><a href="" id="mn'+mid+'" target="_blank" class="bq_xa" >'+mn+'</a></td>'
												+ '<td>'+Y.getDate(bt).format('MM-DD hh:mm')+'</td>'
												+ '<td><em></em><a href="" target="_blank" id="hteam'+mid+'" class="mtc_name"><em id="htid'+mid+'" class="ew_e">'+hn+'</em></a> VS '
												+ '<a href="" target="_blank" id="vteam'+mid+'" class="mtc_name"><em id="gtid'+mid+'" class="ew_e">'+gn+'</em></a><em></em></td>'
												+ '<td class="btn_a">3</td>'
												+ '<td class="btn_a">1</td>'
												+ '<td class="btn_a">0</td>'
												+'<td><a href="javascript:void(0);" class="jcq_q">全</a></td>'
												+ '<td colspan=3 ><div class="pjpl" id="odds'+mid+'" ><span class="sp_w35 eng" id="oh'+mid+'">'+b3+'</span><span class="sp_w35 eng" id="od'+mid+'">'+b1+'</span><span class="sp_w35 eng" id="oa'+mid+'">'+b0+'</span></div></td>'
												+ '<td><a href="" target="_blank" id="ox'+mid+'" class="mtc_name">析</a> <a href="" target="_blank" id="oy'+mid+'" class="mtc_name">亚</a> '
												+ '<a href="" target="_blank" id="oz'+mid+'" class="mtc_name">欧</a></td>'
												+ '</tr>';
											}
										
										}else if (Class.C('lot_gid')==2){//进球
                                                html += '<tr data-vs="'+hn+'" name='+mid+' onselectstart="return false">'
												+ '<td rowspan="2">'+mid+'</td>'
												+ '<td  class="sup_1" style="background:'+cl+';" rowspan="2"><a href="" class="bq_xa" target="_blank" id="mn'+mid+'" >'+mn+'</a></td>'
												+ '<td rowspan="2">'+Y.getDate(bt).format('MM-DD hh:mm')+'</td>'
												+ '<td>[主] <a href="" target="_blank" id="hteam'+mid+'" class="mtc_name"><em id="htid'+mid+'" class="ew_e">'+hn+'</em></a><em></em></td>'
												+ '<td class="btn_a">0</td>'
												+ '<td class="btn_a">1</td>'
												+ '<td class="btn_a">2</td>'
												+ '<td class="btn_a">3+</td>'
												+'<td><a href="javascript:void(0);" class="jcq_q">全</a></td>'
												+ '<td rowspan="2" id="b3'+mid+'">'+b3+'</td>'
												+ '<td rowspan="2" id="b1'+mid+'">'+b1+'</td>'
												+ '<td rowspan="2" id="b0'+mid+'">'+b0+'</td>'
												+ '<td rowspan="2"><a href="" target="_blank" id="ox'+mid+'" class="mtc_name">析</a> <a href="" target="_blank" id="oy'+mid+'" class="mtc_name">亚</a> '
												+ '<a href="" target="_blank" id="oz'+mid+'" class="mtc_name">欧</a></td>'
												+ '</tr>'
												+ '<tr data-vs="'+gn+'" name='+mid+'><td>[客] <a href="" target="_blank" id="vteam'+mid+'" class="mtc_name"><em id="gtid'+mid+'" class="ew_e">'+gn+'</em></a><em></em></td>'
												+ '<td class="btn_a">0</td>'
												+ '<td class="btn_a">1</td>'
												+ '<td class="btn_a">2</td>'
												+ '<td class="btn_a">3+</td>'
												+'<td><a href="javascript:void(0);" class="jcq_q">全</a></td></tr>';
										}								
									});
								}
								$("#duizhen").html(html);
								if ($('#playid').val() == '123'){
									this.lib.DtChoose();
								}else{
									this.lib.SfcChoose();
								}
								
//								   Y.get('#duizhen tr').hover(function (e, Y){//鼠标滑入滑出效果
//						                this.style.backgroundColor = '#cfe6b3';
//						                var name=$(this).attr("name");
//						                Y.get(this).find(".btn_a").addClass("h_brx");
//						                Y.get(this).find(".btn_b").removeClass("h_brx");
//						                if(name!=""&& typeof(name) != "undefined"){
//						                $("#duizhen tr").each(function(){
//						                	if($(this).attr("name")==name){
//						                		 this.style.backgroundColor = '#cfe6b3'; 
//						                		Y.get(this).find(".btn_a").addClass("h_brx");
//										           
//									                Y.get(this).find(".btn_b").removeClass("h_brx");
//								               
//						                	}
//						                });
//						                }
//						            }, function (e, Y){
//						            	 this.style.backgroundColor = '';
//							                var name=$(this).attr("name");
//							                Y.get(this).find(".btn_a").removeClass("h_brx");
//							                Y.get(this).find(".btn_b").removeClass("h_brx");
//							                if(name!="" && typeof(name) != "undefined"){
//							                $("#duizhen tr").each(function(){
//							                	if($(this).attr("name")==name){
//							                		this.style.backgroundColor = '';
//							                		Y.get(this).find(".btn_a").removeClass("h_brx");
//									                Y.get(this).find(".btn_b").removeClass("h_brx");
//									               
//							                	}
//							                });
//							                }
//						            });
								   $('#duizhen tr ').hover(function (e, Y){//鼠标滑入滑出效果
										$(this).style.backgroundColor = '#fee6ad';
						    		
						              }, function (e, Y){
						            	  $(this).style.backgroundColor = '';
						              });
								this.sethref();//加载链接
						},
						error : function() {
							this.alert("网络故障!");
							return false;
						}
					});
		},
		sethref:function() {
			var expect = $("#expect").val();
			if (expect == "") {
				return false;
			}
			var ourl="";
			if (Class.C('lot_gid')==1){//胜负彩+任九
				ourl="/cpdata/omi/80/"+expect+"/odds.xml";
			}else if(Class.C('lot_gid')==2){//进球
				ourl="/cpdata/omi/82/"+expect+"/odds.xml";
			}else if(Class.C('lot_gid')==3){//半全场
				ourl="/cpdata/omi/83/"+expect+"/odds.xml";
			}else{
				return false;
			}
			
				
			
			this.ajax({
					url:ourl,
	        		end:function(data,i){
	        			 var htid =1;
	                     this.qXml('//row', data.xml, function (u, i){
	                    	 if(Class.C('lot_gid')==3){//半全场
	                    		 htid=(u.items.xid)/2;
	                    		 $("#mn"+htid).attr("href","http://info.159cai.com/index.php?controller=main&lid="+u.items.lid+"&sid="+u.items.sid+"&cid="+u.items.cid+"&t=2");
	 	            				$("#mn"+htid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
		             				$("#hteam"+htid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
		                        	$("#vteam"+htid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
	 	            				 $("#ox"+htid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=1");
	 	            				 $("#oz"+htid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=1");
	 	            				 $("#oy"+htid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=1");
	 	            				var hm=isNaN(u.items.hm)||u.items.hm==""?"":u.items.hm<10?'0'+u.items.hm:u.items.hm;
		            				var am=isNaN(u.items.am)||u.items.hm==""?"":u.items.am<10?'0'+u.items.am:u.items.am;
		            				$("#htid"+u.items.xid).attr("data",u.items.htid).parent().next().html(hm==""?"":'['+hm+']');
		            				$("#gtid"+u.items.xid).attr("data",u.items.gtid).parent().next().html(am==""?"":'['+am+']');
		            				if($("#mn"+u.items.xid).html()==""){
		            					$("#mn"+u.items.xid).html(u.items.ln==""?"--":u.items.ln);
		            					$("#mn"+u.items.xid).parent().css("background-color",u.items.cl);
		            				}
	                    		 if($("#b3"+u.items.xid).html()=="0.00"){$("#b3"+u.items.xid).html(parseFloat(u.items.oh).rmb(false,2));}
	            				 if($("#b1"+u.items.xid).html()=="0.00"){$("#b1"+u.items.xid).html(parseFloat(u.items.od).rmb(false,2));}
	            				 if($("#b0"+u.items.xid).html()=="0.00"){$("#b0"+u.items.xid).html(parseFloat(u.items.oa).rmb(false,2));}
	             			 }else{
	             			
	            				
	            				$("#mn"+u.items.xid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
	             				$("#hteam"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
	                        	$("#vteam"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
 	            				 $("#ox"+u.items.xid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=1");
 	            				 $("#oz"+u.items.xid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=1");
 	            				 $("#oy"+u.items.xid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=1");
	            				//if(Class.C('lot_gid')==1){
	            				//if($("#oh"+u.items.xid).html()=="--"){$("#b3"+u.items.xid).html(u.items.oh==""?"--":parseFloat(u.items.oh).rmb(false,2));}
	            				//if($("#od"+u.items.xid).html()=="--"){$("#b1"+u.items.xid).html(u.items.od==""?"--":parseFloat(u.items.od).rmb(false,2));}
	            				//if($("#oa"+u.items.xid).html()=="--"){$("#b0"+u.items.xid).html(u.items.oa==""?"--":parseFloat(u.items.oa).rmb(false,2));}
								if($("#oh"+u.items.xid).html()=="0.00"){$("#oh"+u.items.xid).html(u.items.oh==""?"--":parseFloat(u.items.oh).rmb(false,2));}
	            				if($("#od"+u.items.xid).html()=="0.00"){$("#od"+u.items.xid).html(u.items.od==""?"--":parseFloat(u.items.od).rmb(false,2));}
	            				if($("#oa"+u.items.xid).html()=="0.00"){$("#oa"+u.items.xid).html(u.items.oa==""?"--":parseFloat(u.items.oa).rmb(false,2));}
	            				if($("#mn"+u.items.xid).html()==""){
	            					$("#mn"+u.items.xid).html(u.items.ln==""?"--":u.items.ln);
	            					$("#mn"+u.items.xid).parent().css("background-color",u.items.cl);
	            				}
	            				var hm=isNaN(u.items.hm)||u.items.hm==""?"":u.items.hm<10?'0'+u.items.hm:u.items.hm;
	            				var am=isNaN(u.items.am)||u.items.hm==""?"":u.items.am<10?'0'+u.items.am:u.items.am;
	            				
	            				if(Class.C('lot_gid')==1){
	            					$("#htid"+u.items.xid).attr("data",u.items.htid).parent().prev().html(hm==""?"":'['+hm+']');
            					}else{
            						$("#htid"+u.items.xid).attr("data",u.items.htid).parent().next().html(hm==""?"":'['+hm+']');
	            				}
	            				$("#gtid"+u.items.xid).attr("data",u.items.gtid).parent().next().html(am==""?"":'['+am+']');	
	            				//}
	             			 }
	                     });    	
	                  
                             var xhhistory = "";
                     			 xhhistory="tr a em";
                        	     historyMatchOdds({
           	                         items: xhhistory,
           	                         tipid: 'odds_tip',
           	                         tip: '#odds_tip',
           	                         fleft: 260
           	                     }); 
        	                     $("#oddstype").odds_select_name();
        	                     // load_odds_sp();
        	                     ozOdds({
           	                         items: '.pjpl',
           	                         tipid: 'odds_tip',
           	                         tip: '#odds_tip',
           	                         path: '/cpdata/omi/odds/zc/oz/'
           	                     });    			 
                     			 

//    	                     this.oneodds = false;
                        
	        		}
					});
		}
    });
    
//选号器
    Class('SfcChoose',{
        focusCss: 'btn_b',
        index:function (){
            this.base();
            this.init();
            this.bindMsg();
        },
        init: function (){
            var list = [], focusCss = this.focusCss, self = this;
            var vslist = [];
            var s160 = RegExp(String.fromCharCode(160),'g');//属性值对&nbsp;转为160
            var isyt = this.C('isyt');
            this.isyt = isyt;
            this.isR9 = this.get('#lotid').val() == '81';
            this.get('#vsTable tr').each(function (tr, i){
                if (tr.getAttribute('data-vs')) {
                    var data = {
                        index: self.getInt(tr.cells[0].innerHTML),
                        vs: tr.getAttribute('data-vs').replace(s160,'<br/>'),
                        balls: Yobj.get('td.btn_a', tr),
                        chk: Yobj.get(':checkbox', tr),
                        allselect: Yobj.get('.jcq_q', tr),
                        data:''
                    }
                    vslist[vslist.length] =data.vs;
                    Yobj.attr(tr, 'row_data', data);
                    data.chk.prop('checked', false);
                    list[list.length] = data
                }
            });
            this.vslist = this._vslist = vslist;
            this.onMsg('msg_get_vslist', function (){
                return this.vslist
            });
            this.get('#vsTable').live('td.btn_a', 'mousedown', function (e, Y){//单选
                var max, old, ini = Y.get(this).parent('tr').data('row_data');
                Y.toggleClass(this, focusCss);
				Y.get(this).find(".btn_b").removeClass("h_brx");
				
                // Y.get(this).attr("class")=="btn_a h_brx"?Y.get(this).addClass(focusCss):Y.get(this).removeClass(focusCss);
                old = ini.data;
                ini.data = ini.balls.nodes.map(function (b, i){
                    return b.className.indexOf(focusCss) > -1 ? Y.getInt(b.innerHTML) : ''
                }).join('');
                max = self._doCount();
                if (!isyt && max) {
                     self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    Y.toggleClass(this, focusCss);//还原
                    ini.data = old//还原
                }
                Y.get(this).parent('tr').find('td.'+focusCss).size() == ini.balls.size()?ini.allselect.html("清"):ini.allselect.html("全");
            });
            this.get('#vsTable').live('.jcq_q', 'click', function (e, Y){//全选
                var max, old, oldCss = [], ini = Y.get(this).parent('tr').data('row_data');
                ini.balls.each(function (ball, i){
                    oldCss[i] = ball.className
                })
                $(this).html($(this).html()=="全"?"清":"全");
                ini.balls[$(this).html()=="清"? 'addClass' : 'removeClass'](focusCss);
                old = ini.data;
                ini.data = ini.balls.nodes.map(function (b, i){
                    return b.className.indexOf(focusCss) > -1 ? Y.getInt(b.innerHTML) : ''
                }).join('');
                max = self._doCount();
                if (!isyt && max) {
                    self.alert(self.isR9 ? '您好，任选九场复式最多只能选择9场比赛！' : '您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    this.checked = !this.checked;
                     ini.balls.each(function (ball, i){
                         ball.className = oldCss[i]
                    })//还原
                    ini.data = old//还原
                }
            });
            this.beishu = 1;
            this.zhushu = 0;
            this.totalmoney = 0;
            this.codes = '';
            this.vsData = list;
            this.nums = [0,0,0,0];
            this.moneySpan = this.need('#moneySpan');
            this.zsSpan = this.get('#zsSpan');
            if (!this.C('isyt') && !this.C('isbx')) {
                this.bsInput = this.lib.DataInput({
                    input:'#bsInput',
                    initVal: 1,
                    min:1,
                    overflowFix:true
                });
                this.bsInput.onchange = function (){
                    var max, old;
                    old = self.beishu;
                    self.beishu = this.getInt(this.input.val());
                    if (max = self._change()) {
                        self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                        this.input.val(old)
                    }
                } 
                this.beishu = this.getInt(this.bsInput.input.val());                
            }else{
                this.buyNum = [
                    this.getInt(this.get('#one').html()),    
                    this.getInt(this.get('#two').html()),    
                    this.getInt(this.get('#three').html())
                ]
            }
        },
        bindMsg: function (){
            this.onMsg('msg_get_list_data', function (){
                var msg, m, cur, nn;
                nn = ['单', '双', '三', '四'];
                if (this.C('isbx')) {//补投的个数检查
                    m = [];
                    this.buyNum.each(function (n, i){
                        cur = this.nums[i];
                        if (n != cur) {
                            m.push(nn[i]+'选的个数(<span style="color:red">'+cur+'</span>)'+(n>cur?'小':'大')+'于预投的个数(<span style="color:#0080ff">'+n+'</span>)')
                        }
                    }, this);
                    if (m.length) {
                        msg = '您好，您选择的<br/>'+m.join('，<br/>')+'，<br/>请重新选择！'
                    }
                }
                return {
                    zhushu: this.zhushu,
                    beishu: this.beishu,
                    totalmoney: this.totalmoney,
                    codes: this.codes,
                    code: this.nums.join(','),
                    msg: msg
                         
                }
            })         
        },
         _doCount: function (){//每次用vsData统计选号
        	 if(this.isR9){
        		 var zs, codes, vs, tuo, tcodes,dtxx;
                 zs = 0;
                 codes = [];
                 tuo = [];
                 tcodes = [];
                 vs=[];
                 dtxx = [];
                 this.vsData.each(function (row,i){
                     var data = row.data.length;
                     if (row.data.length) {
                         codes[codes.length] = row.data;
                         
                         tuo[tuo.length] = data;
                         tcodes[tcodes.length] = row.data;
                         dtxx.push('&nbsp;')
                         
                         vs.push(row.vs)
                     }else{
                         codes[codes.length] = '#';
                         tcodes[tcodes.length] = '#';
                         dtxx.push('&nbsp;')
                     }
                 }, this);
                 zs = this._getCount(tuo);
                 this.zhushu = zs;
                 this.codes = tcodes.join(',');
                 return this._change()
        	 }else{
        		 var zs, codes, nums;
                 zs = 1;
                 codes = [];
                 nums = [];
                 this.vsData.each(function (row,i){
                     if (row.data.length) {
                         codes[codes.length] = row.data ? row.data : '#';
                         nums[nums.length] = row.data.length;
                         zs*=row.data.length;
                     }else if(!this.isR9){
                         zs = 0;
                     }else{
                         codes[codes.length] = '#';//r9
                     }
                 }, this);
                 if (this.C('isbx')) {
                     this._getNum(nums)
                 }
                 if(this.isR9){
                     if (nums.length > 9) {
                         return 1
                     }else if(nums.length < 9){
                         zs = 0
                     }
                 }
                 this.zhushu = zs;
                 this.codes = codes.join(',');
                 return this._change()
        	 }
         },
         _getCount: function (t){//[1,1,2,3]
             var list, sum;
             sum = 0;
             list = Math.cl(t, 9);
             list.each(function (arr){
                 sum+=arr.reduce(function (p, n){
                     return p*=n
                 }, 1)
             });
             return sum             
         },
         _getNum: function (nums){//补投的个数
             nums = nums.sort(Array.up).join('');//11122333
             this.nums = [
                nums.replace(/[^1]/g,'').length,    
                nums.replace(/[^2]/g,'').length,    
                nums.replace(/[^3]/g,'').length
             ];
             this.get('#s1Span').html(this.nums[0]);
             this.get('#s2Span').html(this.nums[1]);
             this.get('#s3Span').html(this.nums[2]);
             if (this.get('#four')) {
                 this.nums.push(nums.replace(/[^4]/g,'').length);
                this.get('#s4Span').html(this.nums[3]);
             }
         },
         _change: function (){
             var zs, bs, pr, m, max;
             zs = this.zhushu;
             bs = this.beishu;
             pr = this.C('price');
             m = zs * bs * pr;
             max = this.getLimit().max;
             if (m > max) {
                 return max
             }
             this.zsSpan.html(zs);
             this.totalmoney = m;
             this.moneySpan.html(this.getInt(m).rmb());
             //this.upMoney(m);
             this.get('#buyMoneySpan,#buyMoneySpan2').html(this.getInt(m).rmb());
             
             this.postMsg('msg_list_change', {
                zhushu: zs,
                beishu: bs,
                totalmoney: m
             })             
         }
    });
//胆拖选号器
    Class('DtChoose',{
        focusCss: 'btn_b',
        index:function (){
            this.base();
            this.init();
            this.bindMsg()
        },
        init: function (){
            var list = [], focusCss = this.focusCss, self = this;
            var vslist = [];
            var s160 = RegExp(String.fromCharCode(160),'g');//属性值对&nbsp;转为160
            var isyt = this.C('isyt');
            this.isR9 = this.get('#lotid').val() == '81';
            this.get('#vsTable tr').each(function (tr, i){
                if (tr.getAttribute('data-vs')) {
                    //var btns = Yobj.get('span.ba', tr);
                    var data = {
                        vs: tr.getAttribute('data-vs').replace(s160,'<br/>'),
                        balls: Yobj.get('td.btn_a', tr),
                        chk: Yobj.get('a.sp_all', tr),
                        dan: Yobj.get(':checkbox', tr),
                        data:'',
                        isdan: false
                    }
                    vslist[vslist.length] =data.vs;
                    Yobj.attr(tr, 'row_data', data);
                    data.dan.prop('checked', false);
                    list[list.length] = data
                }
            });
            this.vslist = this._vslist = vslist;
            this.onMsg('msg_get_vslist', function (){
                return this.vslist
            });
            this.get('#vsTable').live('td.btn_a', 'mousedown', function (e, Y){//单选
                var max, old, ini = Y.get(this).parent('tr').data('row_data');
                Y.toggleClass(this, focusCss);
                old = ini.data;
                ini.data = ini.balls.nodes.map(function (b, i){
                    return b.className.indexOf(focusCss) > -1 ? Y.getInt(b.innerHTML) : ''
                }).join('');
                max = self._doCount();
                if (max) {
                     self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    Y.toggleClass(this, focusCss);//还原
                    ini.data = old//还原
                }
                var isall = Y.get(this).parent('tr').find('td.'+focusCss).size() == ini.balls.size()
                ini.chk[isall ? 'addClass' : 'removeClass'](focusCss);
                ini.chk.html(isall ? '清' : '全');
                if (ini.data.length == 0) {
                    ini.dan.prop('checked', false)
                }    
            });
            this.get('#vsTable').live('a.sp_all', 'mousedown', function (e, Y){//全选
                var max, old, oldCss = [], ini = Y.get(this).parent('tr').data('row_data'), ischecked;
                ini.balls.each(function (ball, i){
                    oldCss[i] = ball.className
                });
                Y.toggleClass(this, focusCss);
                ischecked = Y.hasClass(this, focusCss);
                Y.get(this).html(ischecked ? '清' : '全');
                ini.balls[ischecked ? 'addClass' : 'removeClass'](focusCss);
                old = ini.data;
                ini.data = ini.balls.nodes.map(function (b, i){
                    return b.className.indexOf(focusCss) > -1 ? Y.getInt(b.innerHTML) : ''
                }).join('');
                max = self._doCount();
                if (max) {
                    self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    this.checked = !this.checked;
                     ini.balls.each(function (ball, i){
                         ball.className = oldCss[i]
                    })//还原
                    ini.data = old//还原
                    Y.toggleClass(this, focusCss);
                    ischecked = Y.hasClass(this, focusCss);
                    Y.get(this).html(ischecked ? '清' : '全');
                };
                if (ini.data.length == 0) {
                    ini.dan.prop('checked', false)
                }                
            });
            this.get('#vsTable').live(':checkbox', 'click', function (e, Y){
                var ini = Y.get(this).parent('tr').data('row_data'), old;
                old = ini.data;
                if (ini.data.length == 0 && this.checked) {
                    self.alert('您好，请选择至少选择一个号码后再选胆！');
                    return this.checked = false
                }
               if (Y.dan > 7 && this.checked) {
                    self.alert('您好，最多只能选择8个胆！');
                    return this.checked = false                   
               }
                ini.isdan = this.checked;
                max = self._doCount();
                if (max) {
                    self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    this.checked = !this.checked;
                    ini.data = old//还原
                    ini.isdan =  this.checked
                }
            });
            this.beishu = 1;
            this.zhushu = 0;
            this.totalmoney = 0;
            this.dan = 0;
            this.codes = '';
            this.dtcodes = '';
            this.vsData = list;
            this.dtxx = [];
            this.moneySpan = this.need('#moneySpan');
            this.zsSpan = this.get('#zsSpan');
            this.bsInput = this.lib.DataInput({
                input:'#bsInput',
                initVal: 1,
                min:1,
                overflowFix:true
            });
            this.bsInput.onchange = function (){
                var max, old;
                old = self.beishu;
                self.beishu = this.getInt(this.input.val());
                if (max = self._change()) {
                    self.alert('您好，复式投注最大限制金额为'+max.rmb()+'元！');
                    this.input.val(old)
                }
            } 
            this.beishu = this.getInt(this.bsInput.input.val());
        },
        bindMsg: function (){
            this.onMsg('msg_get_list_data', function (){
                return {
                    zhushu: this.zhushu,
                    beishu: this.beishu,
                    totalmoney: this.totalmoney,
                    codes: this.codes,
                    dtcodes: this.dtcodes,
                    dtxx: this.dtxx
                }
            })         
        },
         _doCount: function (){//每次用vsData统计选号
             var zs, codes, vs, dan, tuo, maxHit, tcodes, dcodes,dtxx;
             zs = 0;
             codes = [];
             dan = [];
             dcodes = [];
             tuo = [];
             tcodes = [];
             vs=[];
             dtxx = [];
             this.vsData.each(function (row,i){
                 var data = row.data.length;
                 if (row.data.length) {
                     codes[codes.length] = row.data;
                     if (row.isdan) {
                         dan[dan.length] = data;
                         dcodes[dcodes.length] = row.data;
                         tcodes[tcodes.length] = '#';
                         dtxx.push('√');
                     }else{
                         tuo[tuo.length] = data;
                         tcodes[tcodes.length] = row.data;
                         dcodes[dcodes.length] = '#';
                         dtxx.push('&nbsp;')
                     }
                     vs.push(row.vs)
                 }else{
                     codes[codes.length] = '#';
                     dcodes[dcodes.length] = '#';
                     tcodes[tcodes.length] = '#';
                     dtxx.push('&nbsp;')
                 }
             }, this);
             zs = this._getDtCount(dan, tuo);
             this.maxHit = Math.c(tuo.length, 9 - dan.length);
             this.zhushu = zs;
             this.dtxx = dtxx;
             this.dan = dan.length;
             this.codes = codes.join(',');
             this.dtcodes = '[D:'+dcodes.join(',')+'][T:'+tcodes.join(',')+']';
             return this._change()
         },
         _getDtCount: function (d, t){//[1,1,2,3]
             var list, sum;
             sum = 0;
             list = d.length ? Math.dtl(d, t, 9) : Math.cl(t, 9);
             list.each(function (arr){
                 sum+=arr.reduce(function (p, n){
                     return p*=n
                 }, 1)
             });
             return sum             
         },
         _change: function (){
             var zs, bs, pr, m, max;
             zs = this.zhushu;
             bs = this.beishu;
             pr = this.C('price');
             m = zs * bs * pr;
             max = this.getLimit().max;
             if (m > max) {
                 return max
             }
             this.zsSpan.html(zs);
             this.totalmoney = m;
             this.get('#maxZs').html(this.maxHit);
             this.moneySpan.html(this.getInt(m).rmb());
             this.get('#buyMoneySpan,#buyMoneySpan2').html(this.getInt(m).rmb());
             this.postMsg('msg_list_change', {
                zhushu: zs,
                beishu: bs,
                totalmoney: m
             })             
         }
    });
    /*
单式上传类
    */
    Class('DsUpload', {
        index:function (config){
            this.addElements(config);
            this.defineMsg();
        },

        addElements: function (config){
            var Y = this, min;
            min = Class.config('price');
            this.dsInput = new this.lib.DataInput({
                input: '#dsInput',
                initVal: 5,
                len: 6,
                min:0
            });
            this.dsbs = new this.lib.DataInput({
                input: '#dsbs',
                initVal: 1,
                len: 2,
                min:1
            });
            this.input = this.dsInput.input.one();
            this.zhushu = 0;
            this.beishu = 1;
            
            this.totalmoney = 0;
            this.dsInput.onchange = function (){
                var zs, dj,bs;
                dj = Class.config('price');
                zs = Y.getInt(this.input.val());
                bs = Y.getInt(this.get('#dsbs').val());
                Y.zhushu = zs;
                Y.beishu = bs;
                Y.totalmoney = zs * bs * dj;
                var limit, data = {
                    zhushu: Y.zhushu,
                    beishu: Y.beishu,
                    totalmoney: Y.totalmoney
                }
                this.get('#dsMoney').html(data.totalmoney);
                Y.postMsg('msg_list_change', data);
                limit = this.getLimit();
                this.updateBalance(Y.totalmoney);
                if (data.totalmoney < limit.min) {
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能少于'+limit.min.rmb()+'元, 请修改!').setIco(3);
                }else if(data.totalmoney > limit.max){
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能大于'+limit.max.rmb()+'元, 请修改!').setIco(3);
                }else{
                    Y.getTip().hide()
                }
            };

            this.dsbs.onchange = function (){
            	var zs, dj,bs;
                dj = Class.config('price');
                zs = Y.getInt(this.get('#dsInput').val());
                bs = Y.getInt(this.input.val());
                Y.zhushu = zs;
                Y.beishu = bs;
                Y.totalmoney = zs * bs * dj;
                var limit, data = {
                    zhushu: Y.zhushu,
                    beishu: Y.beishu,
                    totalmoney: Y.totalmoney
                }
                this.get('#dsMoney').html(data.totalmoney);
                Y.postMsg('msg_list_change', data);
                limit = this.getLimit();
                this.updateBalance(Y.totalmoney);
                if (data.totalmoney < limit.min) {
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能少于'+limit.min.rmb()+'元, 请修改!').setIco(3);
                }else if(data.totalmoney > limit.max){
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能大于'+limit.max.rmb()+'元, 请修改!').setIco(3);
                }else{
                    Y.getTip().hide()
                }
            };
            this.dsInput.onchange();
        },
        
        defineMsg: function (){
            this.onMsg('msg_check_sc_err', function (){// 检查上传表单
                var err, file, input, zs, bs, money, min, max, pe;
                file = this.one('#upfile');
                zs = this.zhushu;
                bs = this.beishu;
                money = this.totalmoney;
                limit = this.getLimit();
                input = this.input;
                if (!zs) {
                    err = '您好，您发起方案的注数不能为0！';
                }else if (money % 2) {
                    err = '您好，选择单倍投注金额要整除2，才能发起投注。';
                }else if(money < limit.min){
                    err = '您好，您发起方案的金额不能小于'+limit.min.rmb()+'元！';          
                }else if(money > limit.max){
                    err = '您好，您发起方案的金额不能大于'+limit.max.rmb()+'元！';
                }else if (!this.get('#hsc').one().checked) {
                    if (file.value == '') {
                         err = '您好，请选择要上传的方案文件！'
                    }else if(!file.value.match(/\.te?xt$/i)){
                         this.clearFileInput(file);
                         this.one('#upfile').focus();
                         err = '您好，上传文件只支持txt格式，请重新上传！'
                    }
                }
                if (err) {
                    this.alert(err, function (){
                        input && input.select()
                    });
                } 
                return !!err
            });
            this.onMsg('msg_get_list_data', function (){
                var nosc = this.get('#hsc').one().checked;
                return {
                    codes: nosc ? 'notxt' : '文本文件上传',
                    isupload: nosc ? 0 : 1,
                    zhushu: this.zhushu,
                    beishu: this.beishu,
                    totalmoney:this.totalmoney
                }
            });
             this.onMsg('msg_clear_code', (function (){
                 this.clearCode();
             }).proxy(this))
        },
        clearCode: function (){
            this.dsInput.val(2);
            this.clearFileInput('#upfile');
            this.get('#dsMoney').html(1);
        },
        clearFileInput: function (f){
            if (this.ie) {
                f.outerHTML = f.outerHTML
            }else{
                f.value = ''    
            }
        }
    });
})()