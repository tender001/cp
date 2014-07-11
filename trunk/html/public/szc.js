(function (){
    var isdgTpl, iszhTpl, jxTpl, ishmTpl;
    jxTpl = '<p><b>{1}</b>|<strong>{2}</strong></p>';
    iszhTpl = '<table width="100%" border="0" cellpadding="0" cellspacing="0"  class="cot">'+
     '<tr><td rowspan="2" class="t_td_c">方案信息</td><td>玩法</td><td>追号期数</td>'+
       '<td>开始期数</td><td>单期注数</td>{$iszj}<td>追号总金额</td><td>追号设置</td>'+
     '</tr>'+
     '<tr><td>{$type}</td><td>共{$expectnum}期</td><td>{$startExpect}</td><td>每期{$zhushu}注</td>{$iszj2}<td>{$allmoney}元</td>'+
       '<td>{$stop}</td></tr>'+
     '<tr>'+
       '<td  class="t_td_c">投注内容</td>'+
       '<td colspan="7" class="tdff"><p>{$codelist}</p></td>'+
     '</tr>'+
     '<tr>'+
       '<td  class="t_td_c">投注信息</td>'+
       '<td colspan="7" style="line-height:33px;text-align:left;padding-left:30px" class="tdff">您本次购买需消费<font>{$totalmoney}</font>元</td>'+
     '</tr>'+
   '</table>';
    isdgTpl = '<table width="100%" border="0" cellpadding="0" cellspacing="0"  class="cot">'+
     '<tr><td rowspan="2" class="t_td_c">方案信息</td>'+
      '<td>玩法</td><td>注数</td><td>倍数</td>{$iszj}<td>总金额</td></tr>'+
     '<tr><td>{$type}</td><td>{$zhushu}</td><td>{$beishu}</td>{$iszj2}<td>{$totalmoney}元</td>'+
     '</tr>'+
     '<tr><td  class="t_td_c">投注内容</td>'+
      '<td colspan="5" class="tdff"><p>{$codelist}</p></td>'+
     '</tr>'+
     '<tr>'+
       '<td  class="t_td_c">认购信息</td>'+
       '<td colspan="5" style="line-height:33px;text-align:left;padding-left:30px" class="tdff">您本次购买需消费<font>{$totalmoney}</font>元</td>'+
     '</tr>'+
   '</table>';
   
    ishmTpl ='<table width="100%" border="0" cellpadding="0" cellspacing="0"  class="cot">'+
     '<tr><td rowspan="2" class="t_td_c">方案信息</td><td>玩法</td>'+
       '<td>注数</td><td>倍数</td>{$iszj}<td>总金额</td>'+
       '<td>每份</td><td>保底</td><td>提成</td><td>保密类型</td></tr>'+
     '<tr><td>{$play}</td><td>{$zhushu}</td><td>{$beishu}</td>'+
       '{$iszj2}<td>{$allmoney}元</td><td>{$unitmoney}元</td>'+
       '<td>{$bdscale}</td><td>{$tc}%</td><td>{$hidetype}</td></tr>'+
     '<tr>'+
       '<td  class="t_td_c">投注内容</td>'+
       '<td colspan="9" class="tdff"><p>{$codelist}</p></td>'+
     '</tr>'+
     '<tr>'+
       '<td  class="t_td_c">认购信息</td>'+
       '<td colspan="9" style="line-height:33px;text-align:left;padding-left:30px"class="tdff">您本次购买需消费<font>{$needmoney}</font>元</td>'+
     '</tr>'+
     '</table>';

    Class.C('url-addmoney', '/useraccount/default.php?url='+Class.C('url-passport')+'/useraccount/addmoney/add.php');
    Class.C('min-rengou', .05);//最低认购
    Class.C('lr-max-line', 1000);//最多行数

    Class.extend('checkMaxMoney', function (money, fn){//检测最大金额是否超出
        var limit, LM, pe;
        limit = this.getLimit();
        if (money > limit.max) {
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
        h = this.getXY(this.one('#all_form'));
        ph  = this.getSize();
        a = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
        c = h.y - ph.offsetHeight + 45 + this.get('#all_form').next('div').one().offsetHeight;
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
					r.each(function(rt,o) {
						var pid = rt.pid;
						var et = rt.et;
						var cft = rt.fet;
						var at = rt.at;
						expectlist[expectlist.length] = [ pid, et, cft, at ];
					});
		
					for ( var i = 0; i<(expectlist.length>3?3:expectlist.length); i++) {
						if (expectlist[i][0] == $("#expect").val()) {
							var endtime;
							if (this.getPlayId()==3
									||this.getPlayId()==24 //pls 直选单式
									||this.getPlayId()==39 //pls 组三 组六 单式
									||this.getPlayId()==47 //3D 组三 组六 单式
									||this.getPlayId()==63 //plw  单式
									||this.getPlayId()==99 
									||this.getPlayId()==101
									||this.getPlayId()==135	
								){
								endtime=Y.getDate(expectlist[i][2]).format('YY-MM-DD hh:mm:ss');
							}else{
								endtime=Y.getDate(expectlist[i][1]).format('YY-MM-DD hh:mm:ss');
							}
							this.postMsg('msg_endtime_change', endtime, data.date);
						}
					}							
				} else {
					this.alert(desc);
				}
			}
		});
    });
    
    Class.extend('getLotPath',function(){
    	return  $_sys.getlotpath(this.get('#lotid').val())||{}
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
            this.confirm2.addClose('#confirm_dlg_close,#confirm_dlg_no,#confirm_dlg_yes');
            this.get('#confirm_dlg div.tantop').drag('#confirm_dlg');
        //机选
            this.jxDlg =  this.lib.MaskLay('#jx_dlg','#jx_dlg_list');
            this.jxDlg.addClose('#jx_dlg_close','#jx_dlg_re','#jx_dlg_ok');
            this.get('#jx_dlg div.tantop').drag('#jx_dlg');
        //合买确认
            this.isBuy = this.lib.MaskLay('#ishm_dlg','#ishm_dlg_content', '#ishm_dlg_title');
            this.isBuy.addClose('#ishm_dlg_close,#ishm_dlg_no,#ishm_dlg_yes');
            this.get('#ishm_dlg div.tantop').drag('#ishm_dlg');
        //胆拖拆分明细
            this.splitDlg =  this.lib.MaskLay('#split_dlg','#split_dlg_list');
            this.splitDlg.addClose('#split_dlg_close','#split_dlg_ok');
//            this.get('#split_dlg div.tantop').drag('#split_dlg');
        //充值
            this.addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
            this.addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
            this.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
            this.bindMsg();
        },
        bindMsg: function (){
	       	 var Y = this;
	         Class.extend('buySucceedDlg', function (lotid,projid,ischase){
	             $('#newbuysucview').bind({
	            	 click:function(){	 
	            		 if (ischase==1){
	            			 window.location= '/account/xchase.html?zid='+projid+'&lotid='+lotid;	     
	            		 }else{
	            			 window.location= $_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;	       
	            		 }     		 
	            	 }
	             });
	             Y.use('mask', function(){
	 	         	var dlgbuysuc = Y.lib.MaskLay('#newbuysuc', '#newbuysuc_content');
	 		        dlgbuysuc.addClose('#newbuysuc_close,#newbuysuc_ok');
	 		        Y.get('#newbuysuc div.tantop').drag('#newbuysuc');  
	 		   
	 		        dlgbuysuc.pop('<div class="txt_suc">您好，'+Y.C('userName')+'，恭喜您购买成功!</div>');
	 	             });
	         });          	
            this.onMsg('msg_show_dlg', function (msg, fn){
                this.dlg.pop.apply(this.dlg, arguments)
            });
            this.onMsg('msg_show_confirem', function (msg, fn){
                this.confirm.pop.apply(this.confirm, arguments)
            });
            this.onMsg('msg_show_is', function (msg, fn, title, btn2){
                if (title) {
                    this.confirm2.title.html(title)
                }
                this.get('#confirm_dlg_yes').val(btn2||'确定');
                this.confirm2.pop(msg, fn)
            });
        // 机选框
            this.onMsg('msg_show_jx', function (codeList, fn, tpl, noZero){
                var html, zhushu;
                zhushu = 0;
                tpl = tpl || jxTpl;
                html = codeList.each(function (arr, i){
                    if (!noZero) {
                        arr = arr.map(function (item){
                            return item instanceof Array ? String.zero(item.join(',')) : item
                        })
                    }
                    this[i] = tpl.format.apply(tpl, arr);
                    zhushu += arr[2]
                }, []);
                if(html.length > 10){
                	Y.get('#jx_dlg_list').setStyle('height','300px').setStyle('overflow','auto');
                }else{
                	var heightx = html.length*30+20;
                	Y.get('#jx_dlg_list').setStyle('height',heightx+'px').setStyle('overflow','hidden');
                }
                this.jxDlg.pop(html.join(''), fn)
            });
        // 机选框
            this.onMsg('msg_show_split', function (codeList, fn, tpl){
                var html, zhushu;
                zhushu = 0;
                tpl = tpl || jxTpl;
                html = codeList.each(function (arr, i){
                    this[i] = tpl.format(arr[0].join(',').replace(/\b\d\b/g,'0$&'), arr[1].join(',').replace(/\b\d\b/g,'0$&'), arr[2] instanceof Array ? arr[2].join(' , ').replace(/\b\d\b/g,'0$&') : '');
                    zhushu += arr[2]
                }, []);
                this.splitDlg.pop(html.join(''), fn)
            });
        //购买确认消息
            this.onMsg('msg_isbuy', function (msg, fn){
                this.isBuy.title.html(this.C('lot-ch-name') + '第' + this.get('#expect').val() + '期方案' + ['代购', '合买', '追号'][this.C('buy_type')]);
                this.isBuy.pop.apply(this.isBuy, arguments)
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
//合买表单类, 输出合买参数
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
                var d, fs, low;
                yobj.rg = fs = this.getInt(this.val());
                this.need('#rgMoney').html((fs === 0 || yobj.fs === 0 ? 0 : yobj.data.totalmoney / yobj.fs * fs).rmb());
                this.need('#rgScale').html(yobj.fs ===0 ? 0 : (fs/yobj.fs*100).toFixed(2)+'%');
                if (fs < yobj.low) {
                    this.need('#rgErr').html('您至少需要认购'+yobj.low+'份');//，共计'+(yobj.low * Class.C('price')).rmb()+'元！');
                }
                this.need('#rgErr').show(fs < yobj.low)
            };
            this.rgInput.onMsg('msg_fs_change',function (){
                this.val(yobj.low);
                this.onchange();
            });
			this.onMsg('msg_force_change_rg', function(rg) {
				this.rgInput.val(rg);
				this.rgInput.onchange();
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
                sl = yobj.fs === 0 ? 0 : (fs/yobj.fs*100).toFixed(2);
                this.need('#bdScale').html(sl+'%');
                this.need('#bdErr').show(this.one('#isbaodi').checked && sl < 5);
            };
            this.bdInput.onMsg('msg_fs_change',function (){
                if (this.get('#isbaodi').one().checked) {
                    yobj.need('#bdInput').val(Math.ceil(yobj.fs*.05))
                     this.onchange();
                }           
            });
            this.get('#isbaodi').click(function (){
                //yobj.need('#bdInput').val(this.checked ? Math.ceil(yobj.fs*.05) : 0).nodes[0].disabled = !this.checked;
            	yobj.need('#bdInput').val(this.checked ? Math.ceil(yobj.fs-(Y.get('#rgInput').val()*1)) : 0).nodes[0].disabled = !this.checked;
                yobj.bdInput.onchange();
            }).prop('checked', false);
            this.get('#bdInput').val(0);
			this.onMsg('msg_force_change_bd', function(isbd, bd) {
				if (+isbd) {
					this.bdInput.val(bd);
					this.get('#isbaodi').prop('checked', true);
					this.bdInput.onchange();
				}
				this.get('#bdInput').prop('disabled', !+isbd);
			});
            this.get('#moreCheckbox').click(function (){
                yobj.get('#case_ad').show(this.checked);
                yobj.moveToBuy();
            });
            yobj.get('#fixobj textarea').val('最多输入500个字符').focus(function (){
                if (this.value.indexOf('多输入500个字')>-1) {
                    this.value = ''
                }
            }).blur(function (){
                if (this.value.trim() =='') {
                    this.value = '最多输入500个字符'
                }
                if (this.value.length > 500) {
                    this.value = this.value.slice(0,500)
                }
            }).keyup(function (){
                if (this.value.length > 500) {
                    this.value = this.value.slice(0,500)
                }                
            });
            this.onMsg('msg_get_hm_param', function (data){
                return this.getParam(data);
            });
        },
        getfitFs: function (a, b){//计算适当份数
            while((a > b) && a/b - (a/b).toFixed(~~2) !== 0){b++};
            return Math.min(a, b);
        },
        getParam: function (data){
              var yobj, isshow, param, tmp;
              yobj = this;
            if (!this.one('#agreement').checked) {
                 this.postMsg('msg_show_is', '<p style="text-align:center">您好, 您是否同意《用户合买代购协议》?</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         yobj.one('#agreement_hm').checked = true ;
                         yobj.postMsg('msg_buy_hm', data);
                      }
                  }, false, '同意');
            }else if (this.fs < 1) {
                 this.postMsg('msg_show_dlg', '每份金额必须大于等于1！', function (){
                     yobj.fsInput.input.doProp('select');
                 });
             }else if(this.fs > yobj.data.totalmoney){
                  this.postMsg('msg_show_dlg', '对不起, 您分成的每份金额不能小于1！', function (){
                     yobj.fsInput.input.doProp('select');
                 });            
             }else if (this.fs != this.fit) {
                  yobj.postMsg('msg_show_is', '&nbsp;&nbsp;&nbsp;&nbsp;您现在分成的份数除不尽方案总金额, 可能会造成误差, 系统建议您分成<strong style="color:red">'+this.fit
                      +'</strong>份, 要分成<strong style="color:red">'+this.fit+'</strong>份吗?', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         yobj.fsInput.html(yobj.fit);
                         yobj.fsInput.onchange();                      
                      }else{
                          yobj.fsInput.input.doProp('select');
                      }
                  }, '份数不能整除');
             }else if(this.rg < this.low){
                 this.postMsg('msg_show_dlg', '您至少要认购'+this.low+'份！', function (){
                     yobj.rgInput.input.val(yobj.low).doProp('select');
                 });
             }else if(this.rg > this.fs){
                 this.postMsg('msg_show_dlg', '您要认购的份数不能大于所分的份数！', function (){
                     yobj.rgInput.input.doProp('select');
                 });       
             }else if(this.one('#isbaodi').checked && this.getInt(this.one('#bdScale').innerHTML)<5){
                 var minrgfs =  Math.ceil(this.fs*.05);
                 this.postMsg('msg_show_dlg', '保底金额至少为总金额的5%,至少' +minrgfs + '份！', function (){
                      yobj.bdInput.input.val(minrgfs).doProp('select');
                 });
             }else if (this.one('#isbaodi').checked && ((this.getInt(this.bd)+this.getInt(this.rg)) > this.getInt(this.fs))){
            	 var minrgfs =  Math.ceil(this.fs*.05);
            	 this.postMsg('msg_show_dlg', '保底份数加认购份数不能够超过总份数！', function (){
            		 yobj.bdInput.input.val(minrgfs).doProp('select');
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
//单行追号
    Class('ZhLine', {
        index:function (wrap, data){
            var Y = this;
            this.chk = this.need(':checkbox', wrap);
            this.expect = this.chk.val();
            this.wrap = this.get(wrap);
            this.data =this.mix({}, data);
            this.bsInput = new this.lib.DataInput({
                input:this.one(':text', wrap),
                min: 1,
                max: 99,
                len: 2,
                overflowFix: true
            });
            this.bsInput.onchange = function (){
                Y.data.beishu = this.getInt(this.val());
                Y.moneySpan.html((Y.data.beishu*Y.data.zhushu*Class.C('price')).rmb());
                Y.postMsg('msg_zhline_change');
            };
            this.moneySpan = this.need('font', wrap);
        // 响应号码列表框数据变化
            this.onMsg('msg_list_change', function (data){
                if (this.wrap.getStyle('display') == 'none' ) {
                    return false // 如果隐藏则中止消息下传
                }
                if (this.hasChange(data)) {//有变动的时候才更新
                    this.data.zhushu = data.zhushu;
                    if (this.chk.one().checked) {
                        this.bsInput.val(data.beishu);
                        this.data.beishu = data.beishu;
                        this.moneySpan.html(data.totalmoney.rmb());
                        Y.postMsg('msg_zhline_change');
                    }                    
                }
            });
        // 响应追加注数变化
            this.onMsg('msg_update_list_dq', function (){
                if (this.wrap.getStyle('display') == 'none' ) {
                    return false // 如果隐藏则中止消息下传
                }
                if (this.chk.one().checked) {
                    this.moneySpan.html((this.data.zhushu*this.data.beishu*Class.config('price')).rmb());
                    Y.postMsg('msg_zhline_change');
                }
            });
            this.chk.click(function (e, y){
                var d;
                y.bsInput.input.nodes[0].disabled = !this.checked;
                if (this.checked) {
                   d = Y.postMsg('msg_get_list_data').data;
                    y.data.beishu = d.beishu;
                    Y.data.zhushu = d.zhushu;
                }else{
                    y.data.beishu = 0;
                }
                y.bsInput.val(y.data.beishu);
                y.moneySpan.html((this.checked ? Y.data.beishu*Y.data.zhushu*Class.config('price') : 0).rmb())
                y.postMsg('msg_zhline_change');
            })
        },
        hasChange: function (d){
           return !(d.beishu === this.data.beishu && d.zhushu === this.data.zhushu && d.totalmoney === this.data.totalmoney)
        },
        show: function (data){
            this.data = this.mix({}, data);
            this.chk.nodes[0].checked = true;
            this.bsInput.input.nodes[0].disabled = false;
            this.bsInput.val(data.beishu);
            this.moneySpan.html((data.beishu*data.zhushu*Class.config('price')).rmb());
            this.wrap.show();
        },
         hide: function (){
             this.wrap.hide()
         },
         getData: function (){
            return {
                expect: this.expect,
                 beishu: this.data.beishu
            }
         }
    });
//追号列表
    Class('ZhOptions', {
        index:function (inited){
            this.numOpts = this.need('#zh_opts');
            this.list = this.need('#zh_list');
            this.agreementChk = this.need('#agreement');
            this.createList();
            this.defineMsg();
            this.bindEvent();
            if (this.isFunction(inited)) {
                inited.call(this);
            }
        },
        defineMsg: function (){
           this.onMsg('msg_get_zh_param', function (data){
               if (!this.agreementChk.nodes[0].checked) {
                 this.postMsg('msg_show_is', '<p style="text-align:center">您是否同意《用户合买代购协议》?</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         this.one('#agreement_zh').checked = true;
                         this.postMsg('msg_buy_zh', data)
                      }
                  }, '温馨提示' , '同意')
                }else{
                    var param = this.getParam();
                    if (this.getInt(param.realnum) == 0) {
                        this.postMsg('msg_show_dlg', '您至少要追号 1期！');
                    }else{
                        return param
                    }                     
                }
           });
           this.onMsg('msg_zhline_change', this.upBuyMoney.proxy(this).slow(100));
        },
        upBuyMoney: function (){//更新假定购买后的余额
            var beishu, p, need;
            p = this.postMsg('msg_get_list_data').data;// 号码框
            beishu = 0;
            if (p.zhushu>0) {//如果有号码,则计算追号注数
               	this.lines.each(function (line, i){//只计算第一期
                    if (line.wrap.getStyle('display') != 'none') {
                        var d=line.getData();
                        beishu+=d.beishu;             
                    }
                });
            }
            need = p.zhushu*beishu*Class.C('price');
            this.get('#buyMoneySpan2').html(need.rmb());
            //this.get('#buySYSpan2').html(Math.max(0, Class.config('userMoney') - need).rmb());     
        },
        bindEvent: function (){
        // 追号下拉框
            this.numOpts.change(function (e,y){
                var data =  y.postMsg('msg_get_list_data').data;
                y.lines.each(function (line, i){
                    if (i < this.value) {
                        line.show(data);
                    }else{
                        line.hide();    
                    }
                }, this);
                y.postMsg('msg_zhline_change');
            });
        },
        createList: function (){
               var tpl, html, start, code_list_data, last, myList, timer,Y, zi, len, tmp, expect;
               //tpl = '<li style="display:{$show}"><em>{$index}</em><label style="color:{$hotcss}"><input type="checkbox" value="{$expect}" checked  /> {$expect}期 </label>'+
               //    '<input type="text" class="i-a" value="{$beishu}" />倍 <span>{$totalmoney}</span>元</li>';
               tpl = '<tr style="display:{$show}">'+
               '<td>{$index}</td>'+
               '<td class="tld"><input type="checkbox" value="{$expect}" checked  /> <s style="color:{$hotcss}">{$expect}期</s></td>'+
               '<td><input type="text" class="text" value="{$beishu}" />倍</td>'+
               '<td><font>{$totalmoney}</font>元</td>'+
               '<td>{$et}</td>'+
               '</tr>';
               html = [];
               code_list_data = this.postMsg('msg_get_list_data').data;

               tmp = this.one('#expect').value;
               len = tmp.length;
               start = this.getInt(tmp);
               last = this.getInt(this.need('#lastexpect').val());
               nextYear = Class.config('page-config').serverTime;
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
   						r.each(function(rt,o){
   							var pid = rt.pid;
   							var et = rt.et;
   							var cft = rt.fet;
   							var at = rt.at;
   							expectlist[expectlist.length] = [ pid, et, cft, at ];
   						});

							for (var i=0;i < expectlist.length;i++){
			                   html.push(tpl.tpl({
			                        index: (i<9 ? '0' : '') + (i+1) + '.',
			                        hotcss: this.addHot(start),
			                        expect: expectlist[i][0],
			                        show: i > 9 ? 'none' : '',
			                        totalmoney: this.getInt(code_list_data.totalmoney).rmb(),
			                        beishu: code_list_data.beishu,
			                        et: expectlist[i][3]
			                   }));				                   
							}
							this.list.html(html.join(''));
				            this.lines = [];
				           //创建追号列表项对象
				            this.get('tr', this.list).each(function (li){
				                 this.lines.push(this.lib.ZhLine(li, code_list_data))
				            }, this);
				            this.upBuyMoney();            
						}
					},
					error : function() {}
				});   
         },
         addHot: function (expect){//期号标红
             var d = Class.config('divExpect');
             if (d) {
                 return expect < d[0] || expect > d[1] ? '' : 'red';
             }else{
                 return '';
             }
         },
         getParam: function (){
            var bl, el, beishu, list_data, real;
            bl = [];
            el = [];
            real = beishu = 0;
            list_data = this.postMsg('msg_get_list_data').data;// 列表数据
            this.lines.slice(0, this.numOpts.val()).each(function (line, i){
                if (line.wrap.getStyle('display') != 'none') {
                    var d=line.getData();
                    bl.push(d.beishu);
                    el.push(d.expect);
                    beishu+=d.beishu;
                    if (d.beishu>0) {
                        real++//有效期数
                    }                    
                }
            });
            return {// 合成追号数据
                beishu_list: bl.join(','),
                expect_list: el.join(','),
                ischase: 1,
                realnum: real
            }
         }
    });
//购买请求
    Class('BuySender', {
        index:function (){
           Class.C('expect', this.need('#expect').val());
           if (this.get('#case_ad textarea').size()) {
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
           if (this.get('#case_ad input').size()) {
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
                var hm = this.postMsg('msg_get_hm_param', listParam);// 取得合买参数
                 if (hm.data) {
                      this.overflowMoney(listParam.totalmoney) && this.doHm(listParam, hm.data)                 
                 }
            });
            this.onMsg('msg_buy_zh', function (listParam){
                var zh = this.postMsg('msg_get_zh_param', listParam);
                 if (zh.data) {
                     this.overflowMoney(listParam.totalmoney) && this.doZh(listParam, zh.data)
                 }
            });            
        },
        overflowMoney: function (totalmoney){
            if (this.C('isEnd')) {
                this.postMsg('msg_show_dlg', '您好，'+this.C('lot-ch-name')+this.C('expect')+'期已截止！');
                return false
            }
            var limit = Class.C('limit')[0];
            var type = this.getPlayText();
            if (totalmoney < limit.min) {
                 this.postMsg('msg_show_dlg', '您好，'+type+'的单个方案最小金额为'+Number(limit.min).rmb()+'元！');
                 return false
            }else if(totalmoney > limit.max){
                 this.postMsg('msg_show_dlg', '您好，'+type+'的单个方案最大金额为'+Number(limit.max).rmb()+'元！');
                 return false                
            }else{
                return true
            }
        }, 
        codeFormat: function (code){
            if (code.indexOf(']|[D:') > -1) {//dlt
                return code.split('$').map(function (str){
                    return str.replace(/^\[D:([\d,]+)\]\[T:([\d,]+)\]/g, '【<span class="red">前区|胆</span>】$1<br>【<span class="green">前区|拖</span>】$2<br>')
                    .replace(/\|\[D:([\d,]+)\]\[T:([\d,]+)\]/g, '【<span class="red">后区|胆</span>】$1<br/>【<span class="green">后区|拖</span>】$2')   
                }).join('<div class="line"></div>')
            }else if(code.indexOf('[D:')>-1){//ssq
                return code.split('$').map(function (str){
                    return str.replace(/\[D:([\d,]+)\]/g, '【<span class="red">胆</span>】$1<br>')
                    .replace(/\[T:([\d,]+)\]/g, '【<span class="green">拖</span>】$1<br>')
                    .replace(/\|([\d,]+)/g, '【<span class="blue">蓝</span>】$1')   
                }).join('<div class="line"></div>')
            }
            return code.replace(/\$/g, '<br/>')//other
        },
        doDg: function (list_param){
            var Y = this;
            if (!this.get('#agreement').nodes[0].checked) {
                 this.postMsg('msg_show_is', '<p style="text-align:center">您是否同意《用户合买代购协议》?</p>', function (e, btn){
                      if (btn.id === 'confirm_dlg_yes') {
                         this.one('#agreement').checked = true;
                         Y.doDg(list_param)//再次调用自己
                      }
                  }, '温馨提示', '同意')
            }else{
                 this.getMoney(list_param, function (){
                      var param;
                      param = this.mix(list_param, this.getParam());// 由列表参数+基本参数
                      if (Class.config('play_name') == 'lr') {
                          param.isdslr = 1;
                      }
                      this.postMsg('msg_isbuy', isdgTpl.tpl({
                            iszj: param.lotid == 50 ? '<td width="100">追加</td>' : '',
                            iszj2: param.lotid == 50 ? '<td>'+(this.C('price') > 2 ? '是' : '否')+'</td>' : '',
                            expect: param.expect,
                            totalmoney: param.totalmoney.rmb(),
                            beishu:param.beishu,
                            zhushu:param.zhushu,
                            codelist: this.codeFormat(param.codes),
                            lot:Class.config('lot-ch-name'),                        
                            type: this.getPlayText()
                      }), function (e, btn){
                          if (btn.id == 'ishm_dlg_yes') {
                              Class.config('play_name') == 'sc' ? Y.doSc(param) : Y.doBuy(param)           
                          }
                      })                  
                 })
            }
        },
        doHm: function (list_data, hm_param){
             this.mix(list_data, hm_param);
             this.getMoney(list_data, function (){
                  var y, param, codes, ext;
                   y = this;
                  param = this.mix(list_data, this.getParam());// 列表+合买+基本参数
                  codes = param.codes.replace(/D/g,'胆').replace(/T/g,'拖').split('$');
                  if (Class.config('play_name') == 'lr') {
                      param.isdslr = 1;
                  }
              //确认合买
                  this.postMsg('msg_isbuy', ishmTpl.tpl({
                        iszj: param.lotid == 50 ? '<td width="100">追加</td>' : '',
                        iszj2: param.lotid == 50 ? '<td>'+(this.C('price') > 2 ? '是' : '否')+'</td>' : '',
                        expect: param.expect,
                        play: this.getPlayText(),
                        zhushu: param.zhushu,
                        beishu: param.beishu,
                        allmoney: param.totalmoney.rmb(),
                        unitmoney: (param.totalmoney/ param.allnum).rmb(),
                        buymun: param.buynum,
                        buyscale: (param.buynum/param.allnum*100).toFixed(2),
                        needmoney: (param.totalmoney/param.allnum*param.buynum).rmb(),
                        baodi: param.baodinum,
                        bdscale: param.baodinum ? (param.baodinum/param.allnum*100).toFixed(2) + '%' : '未保底',
                        tc: param.tc_bili,
                        hidetype: ['完全公开','截止后公开','仅对跟单用户公开','截止后对跟单用户公开'][param.isshow] || '',
                        codelist: this.codeFormat(param.codes)
                  }), function (e, btn){
                      if (btn.id == 'ishm_dlg_yes') {
                               Class.config('play_name') == 'sc' ? y.doSc(param) : y.doBuy(param)                      
                      }
                  })                  
             })
        },
        doZh: function (list_data, zh_data){
             this.mix(zh_data, list_data);
             this.getMoney(list_data, function (){
                  var y, param, firstMoney;
                   y = this;
                  param = this.mix(this.getParam(), zh_data);
                  if (Class.config('play_name') == 'dq') {
                      param.codetype = 1;
                  }
                  var start =0;
                  var allmoney = 0;
                  param.beishu_list.split(',').each(function (bs, i){
                      if (parseInt(bs)>0) {
                          if (!start&&start!=0) {                        	  
                              start = i;
                          }
                          allmoney += parseInt(bs)*param.zhushu*Yobj.C('price')
                      }
                  });
    
                  firstMoney = this.getInt(param.beishu_list.split(',')[0]) * param.zhushu * this.C('price'); // 第一期消费金额(可能为0)
                  this.postMsg('msg_isbuy', iszhTpl.tpl({
                        iszj: param.lotid == 50 ? '<td width="100">追加</td>' : '',
                        iszj2: param.lotid == 50 ? '<td>'+(this.C('price') > 2 ? '是' : '否')+'</td>' : '',
                        expectnum: param.realnum,
                        allmoney: allmoney.rmb(),
//                        totalmoney: firstMoney.rmb(),
                        totalmoney: allmoney.rmb(),
                        stop: $_sys.zhflag[Y.get('#tzzh').val()],//param.isone == 0 ? '否'  : ('单期奖金≥<span style="red">'+zh_data.onemaxmoney+'</span>元'),
                        zhushu:param.zhushu,
                        lot:Class.config('lot-ch-name'),   
                        startExpect: param.expect_list.split(',')[start],
                        codelist: this.codeFormat(param.codes),
                        type: this.getPlayText()
                  }), function (e, btn){
                      if (btn.id == 'ishm_dlg_yes') {
                    	  param.totalmoney=allmoney;
                          y.doBuy(param)
                      }
                  })                  
             })
        },
//单式上传
        doSc: function (param){//合买分支
            param.playid = 3;
            this.mix(param, this.getParam());//添加基本参数
            this.alert('正在提交您的订单, 请稍候...', false, true);
            //return false;
            //this.postMsg('msg_show_dlg', '正在提交您的订单, 请稍后...', false, true);
            var swap = true;
            if (swap){
            	if (param.lotid==50){//大乐透
            	 if (param.playid==99){
            		 param.playid=2;
            	 }else if (param.playid==101){
            		 param.playid=3;
               	 }else{
               		 param.playid=1; 
               	 }            	 
            	}else if (param.lotid==53){//排列三
            		if (param.playid==24){
            			 param.playid=1; 
            		}else if (param.playid==39){
            			param.playid=3; 
            		}else{
            			param.playid=2; 
            		}
            	}else if (param.lotid==3){//3d
            		if (param.playid==3){
            			param.playid=1; 	
            		}else if (param.playid==47){
            			param.playid=3; 
            		}else{
            			param.playid=2; 
            		}
            	}else {
            		param.playid=1; 
            	}            	         	 
            	 
	            var param_new ;
	           	 param_new={
	       				 gid:param.lotid,// 游戏编号
	       				 pid:param.expect,// 期次编号
	       				 play:param.playid,// 玩法编号
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
                     
                      this.postMsg('msg_show_dlg', '网络故障, 请检查您的投注记录后重新提交!')
                    }
                }                	
            });
        },
        getMoney: function (list_param, fn){//检查余额
            var money = list_param.money || list_param.totalmoney;//有合买与自购之分
            this.ajax({
                url:Class.C('url-login-user') + "&rnd=" + Math.random(),
                end:function (data){
                	   var info, showText, Y;
                       Y = this;
                       if (data.error) {
                           this.setUserInfo('拉取用户信息失败, 请刷新重试!')
                       }else{
                    	   var obj = eval("(" + data.text + ")");
        			       var code = obj.Resp.code;
        				   var r = obj.Resp.row;
    					   if (code=="0"){
    						   if (r.usermoeny < money) {
                                   this.postMsg('msg_show_addmoney',function (){
                                       window.open($_user.daohang.addmoney)     
                                   })
                               }else{
                                   fn.call(this)
                               }
    					   }  
                       }
                }
            });
        },
        getParam: function (info){
            var base = {
                expect: this.need('#expect').val(),
                lotid: this.need('#lotid').val(),
                playid: this.getPlayId(),
                ischase: 0, //默认无追号
                isupload: 0,//默认无上传
                ishm: Class.config('buy_type') == 1 ? 1 : 0
            };
            return base
         },
         doBuy: function (param){
                  this.lastBuy(param)
         },
         swapcode:function(param){
        	 var tmpcodes= param.codes.split("$");
        	 var codes="";
			 var tmp="";
			 var pm=param.playid;
			 var cm="1";        	 
        		 for(var i=0;i<tmpcodes.length;i++){
        			 tmp="";
        			 tmp=tmpcodes[i];
        			 if (tmp.indexOf(']|[D:') > -1) {//dlt
        				 cm="5";
        				 tmp=tmp.replace(/^\[D:([\d,]+)\]/g, '$1$')
        				 .replace(/\[T:([\d,]+)\]/g, '$1')
        				 .replace(/\|\[D:\]/g, '\|')
        				 .replace(/\|\[D:([\d,]*)\]/g, '\|$1$')
        				 .replace(/\[T:([\d,]+)\]/g, '$1');
        			 }else if (tmp.indexOf('[D:')>-1){//ssq
        				 cm="5";
        				 tmp=tmp.replace(/\[D:([\d,]+)\]/g, '$1$')
        				 .replace(/\[T:([\d,]+)\]/g, '$1')
        				 .replace(/\|([\d,]+)/g, '\|$1');
        			 }
        			 if (param.lotid==03){//sd
        				 if (param.playid==1){
        					 pm="1";
        					 tmp=tmp.replace(/\|/g,',');
        				 }else if (param.playid==26){//单选和值
        					 pm="1";
        					 cm="4";
        				 }else if (param.playid==46){//组选6包号
        					 pm="3";
        					 cm="3";
        				 }else if (param.playid==48){//组选6和值
        					 pm="3";
        					 cm="4";
        				 }else if (param.playid==45){//组选3包号		
        					 pm="2";
        					 cm="3";
        				 }else if (param.playid==50){//组选3和值	
        					 pm="2";
        					 cm="4";
        				 }
        			 }else if (param.lotid==50){//dlt
        				 if (param.playid==98){
        					 pm="2";
        				 }
        				 if (param.playid==135){
        					 pm="1";
        				 }
        				 if (param.playid==100||param.playid==101){//11x2
        					 pm="3";
        				 }
        			 }else if (param.lotid==53){//排列三
        				 if (param.playid==20){
        					 pm="1";
        					 tmp=tmp.replace(/\|/g,',');
        				 }else if (param.playid==30){//直选和值
        					 pm="1";
        					 cm="4";
        				 }else if (param.playid==29){//组选6包号
        					 pm="3";
        					 cm="3";
        				 }else if (param.playid==28){//组选3包号
        					 pm="2";
        					 cm="3";
        				 }else if (param.playid==31){//组选6和值
        					 pm="4";
        					 cm="4";
        				 }else if (param.playid==32){//组选3和值	
        					 pm="4";
        					 cm="4";
        				 }
        			 }else if (param.lotid==52){//排列五
        				 if (param.playid==23){
        					 tmp=tmp.replace(/\|/g,',');
        				 }        				 
        			 }else if (param.lotid==51){//七星彩
        				 if (param.playid==1){
        					 tmp=tmp.replace(/\|/g,',');
        				 }       			
        			 }
        			 
        			 if (i==tmpcodes.length-1){
        				 codes+=tmp+":"+pm+":"+cm;
        			 }else{
        				 codes+=tmp+":"+pm+":"+cm+";";
        			 }         		
        		 }
//        	 }
        	 param.codes=codes;
         },
         lastBuy: function (param){
             var url, type;
             this.alert('正在提交您的订单, 请稍候...');
             //this.postMsg('msg_show_dlg', '正在提交您的订单，请稍后...', null, true);
             type = Class.config('play_name');
              if (type == 'dq') {
                  delete param.codes
              }
             url = param.ischase==1? Class.config('fszh'):(type == 'lr' ? Class.config('dsfq') : Class.config('fsfq'));
             var swap = true;
             if (swap){
	             this.swapcode(param);
	             var param_new ;
	             if (param.ischase==1){
	            	 var beishu_arr=param.beishu_list.split(",");
	            	 var expect_arr=param.expect_list.split(",");
	            	 if (beishu_arr.length==expect_arr.length){
	            		 var n_b=[];
	            		 var n_e=[];
	            		 for (var i=0;i<beishu_arr.length;i++){
	            			 if (beishu_arr[i]>0){
	            				 n_b[n_b.length]=beishu_arr[i];
	            				 n_e[n_e.length]=expect_arr[i];
	            			 }
	            		 }
	            		 param.expectlistsuc=n_e.join(',');
	            		 param.beishulistsuc=n_b.join(',');
	            		 param_new={
	     	            		gid:Class.C('lot_id'),// 游戏编号
	     	        			pid:param.expectlistsuc,// 期次编号
	     	        			codes:param.codes,
	     	        			mulitys:param.beishulistsuc,// 投注倍数
	     	           			money:param.totalmoney,// 方案金额  			
	     	           			zflag:this.get('#tzzh').val(),////追号标志
	     	           			ischase:param.ischase
	     	            } 
	            	 }	            	
	             }else{
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
        			Y.alert.close();
        			if (code == "0") {        			
        				if (param.ischase==1){
        					var r = obj.Resp.zhuihao;			
            				var projid = r.id;
            				this.buySucceedDlg(param.gid,projid,1);
        				}else{
        					var r = obj.Resp.result;			
            				var projid = r.projid;
            				var balance = r.balance;
            				this.buySucceedDlg(param.gid,projid);
        				}
        				this.postMsg('msg_buy_succeed');
        				this.postMsg('msg_update_userMoney');
        			} else {
        				this.postMsg('msg_show_dlg', desc);
        			}
                 }
             });                
         }
    });
    
    Class('LoadHisOpenCode',{
    	index:function(){
    		this.init();
    		this.bingMsg();
    	},
    	
    	init:function(){
    		var arr = ["01","03","07","50","51","52","53"];
    		var f = false;
    		for(var i = 0; i < arr.length; i++){
    			if(arr[i] == Class.C('lot_id')){
    				f = true;break;
    			}
    		}
    		if(f){
             	$.ajax({
             		url : "/tdata/" + Class.C('lot_id') + "/last_10.xml?rnd=" + Math.random(),      		
            		success : function(xml) {
            			var R = $(xml).find("xml");
            			var c = R.find("row");
            			if(c.length > 0){
            				Y.postMsg('msg_get_hisopencode_suc',c);
            			}
            		}
            	});
    		}
    	},
    	bingMsg:function(){
    		this.onMsg('msg_get_hisopencode_suc',function(info){
    			return this.showhis(info);
    		});
    	},
    	showhis:function(info){
    		var html = '<tr class="tr1 tr3"><td>期次</td><td class="tdi">开奖号码</td></tr>';
    		$(info).each(function(i){
    			if(i<11){
    			if($(this).attr("rm") != '1'){
	    			if($(this).attr('cc').indexOf('\|') >= 0){
	    				//html += '<tr class="tr2 tr4"><td>' + $(this).attr('cp') + "</td><td class='tdi'><i>" + $(this).attr('cc').split(',').join('</i><i>') + '</i></td></tr>';
	    				html += '<tr class="tr2 tr4"><td>' + $(this).attr('cp') + "</td><td class='tdi'><i>" + $(this).attr('cc').split('|')[0].replaceAll(',',' ') + '  </i><strong style="color: #145fab;">' + $(this).attr('cc').split('|')[1].replaceAll(',',' ') + '</strong></td></tr>';
	    				//html += "<li>" + $(this).attr('cp') + "</li><li class='sup'><font>" + $(this).attr('cc').split('|')[0].replaceAll(',',' ') + "</font><strong>" + $(this).attr('cc').split('|')[1].replaceAll(',',' ') + "</strong></li>";			
	    			}else{
	    				html +='<tr class="tr2 tr4"><td>'+$(this).attr('cp') +'</td><td class="tdi"><i>'+ $(this).attr('cc').split(',').join('</i><i>')+'</i></td></tr>';
	    			
	    			}
    			}}
    		});
    		/*html +="<a href='javascript:void(0);' target='_blank' id='more_kj' class='xu_gd'>更多</a>";*/
    		var ss=0;
    		$("#kjhis").html(html);
    		if(Class.C('lot_id')==01){
    			$("#more_kj").attr("href","/shuangseqiu/kaijiang.html")
    			
    			
    		}else if(Class.C('lot_id')==03){
    			$("#more_kj").attr("href","/3d/kaijiang.html");
    			ss = 138;
    		}else if(Class.C('lot_id')==07){
    			$("#more_kj").attr("href","/qilecai/kaijiang.html");
    			ss = 250;
    		}else if(Class.C('lot_id')==50){
    			$("#more_kj").attr("href","/daletou/kaijiang.html")
    		}else if(Class.C('lot_id')==51){
    			$("#more_kj").attr("href","/qixingcai/kaijiang.html");
    			ss = 250;
    		}else if(Class.C('lot_id')==52){
    			$("#more_kj").attr("href","/paiwu/kaijiang.html")
    			ss = 195;
    		}else if(Class.C('lot_id')==53){
    			$("#more_kj").attr("href","/paisan/kaijiang.html")
    			ss = 138;
    		}
    		
    		$("#codeCount").click(function(o){

    			$(this).toggleClass("span5c");
    			$("#divCount").show();
    			$("#divRecent").hide();
    			if($(this).hasClass("span5c")){
    				$("#divCount").clearQueue().animate({
    					height:ss
    					});
    				
    			}else{
    				
    				$("#divCount").animate({
    					height:0
    					
    					});
    				$("#divCount").hide();
    			}
    			
    		
        	})
        	
    		$("#codeRecent").click(function(){

    			$(this).toggleClass("span5c");
    			$("#divRecent").show();
    			$("#divCount").hide();
    			$("#codeCount").removeClass("span5c");
    	
    			if($(this).hasClass("span5c")){
    				$("#divRecent").clearQueue().animate({
    					height:325
    					});
    				
    			}else{
    				
    				$("#divRecent").animate({
    					height:0
    					
    					});
    				$("#divRecent").hide();
    			}
    			
    		
        	});
    	}
    });
    
    Class('LoadExpect',{
    	index:function(){
    		this.init();  
    		this.bindMsg();	
    		Y.lib.LoadHisOpenCode();
    	},
    	bindMsg: function(){   
    		this.onMsg('msg_get_opencode_suc',function(row){
    			return this._showkj(row);
    		})
    	},		
    	dltjiajiang: function(j,c,k){
    		c = Y.getInt(c);
    		var r;
    		if(j==0){
    			if(k==0){
    				r = c==35 ? 1:c+1;
    			}else{
    				r = c==12 ? 1:c+1;
    			}	
    		}else{
    			if(k==0){
    				r = c==1 ? 35:c-1;
    			}else{
    				r = c==1 ? 12:c-1;
    			}
    		}
    		return (r<10) ? '0' + r : r;
    	},
		_showkj : function(row) {    		
			var html="";
			if (row.gid=='50'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);	
				
				var code=row.code.split("|");
				var red= code[0].split(",");
				var blue =code[1].split(",");
				var html='';
				for(var i=0;i<red.length;i++){
					html+='<b>'+red[i]+'</b>';
				}
				for(var i=0;i<blue.length;i++){
					html+='<b class="blue">'+blue[i]+'</b> ';
				}				
				$("#kjopcode").html(html);
				Y.getInt(row.pools) > 0 ? ($("#gc").html((row.pools == '' ? "--" : parseFloat(row.pools).rmb(false, 0)))):'';

			}else if (row.gid=='01'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);
				
				var code=row.code.split("|");
				var red= code[0].split(",");
				var blue =code[1].split(",");
				var html='';
				for(var i=0;i<red.length;i++){
					html+='<b>'+red[i]+'</b>';
				}
				for(var i=0;i<blue.length;i++){
					html+='<b class="blue">'+blue[i]+'</b>';
				}				
				$("#kjopcode").html(html);
				var rmoney = row.money == '' ? "-,-,3000,200,10,5" : row.money;
				var rnums = row.nums == '' ? "-,-,-,-,-,-" : row.nums;
				
				var mlen = rmoney.split(",");
				var nlen = rnums.split(",");
		
				if(mlen.length == nlen.length){
					for(var i = 0 ; i < mlen.length; i++){
                        $("#kjzs"+i).html(isNaN(nlen[i])?'--':nlen[i]);
                        $("#kjjj"+i).html(isNaN(mlen[i])?'--':parseFloat(mlen[i]).rmb(false, 0));
					}
				}
				Y.getInt(row.pools) > 0 ? ($("#gc").html((row.pools == '' ? "--" : parseFloat(row.pools).rmb(false, 0)))):'';						
				
			}else if (row.gid=='03'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);
				
				var code=row.code.split(",");
				var html='';
				for(var i=0;i<code.length;i++){
					html+='<b>'+code[i]+'</b>';
				}
				$("#kjopcode").html(html);
			}else if (row.gid=='53'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);	
				
				var code=row.code.split(",");
				var html='';
				for(var i=0;i<code.length;i++){
					html+='<b>'+code[i]+'</b>';
				}
				$("#kjopcode").html(html);
			}else if (row.gid=='52'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);	
				
				var code=row.code.split(",");
				var html='';
				for(var i=0;i<code.length;i++){
					html+='<b>'+code[i]+'</b>';
				}
				$("#kjopcode").html(html);
			}else if (row.gid=='07'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);	
				
				var code=row.code.split("|");
				var org= code[0].split(",");
				var blue =code[1].split(",");
				var html='';
				for(var i=0;i<org.length;i++){
					html+='<b>'+org[i]+'</b>';
				}
				for(var i=0;i<blue.length;i++){
					html+='<b class="blue">'+blue[i]+'</b>';
				}				
				$("#kjopcode").html(html);		
				Y.getInt(row.pools) > 0 ? ($("#gc").html((row.pools == '' ? "--" : parseFloat(row.pools).rmb(false, 0)))):'';
			}else if (row.gid=='51'){	
				$("#ex").html(row.pid);
				$("#rq").html(row.atime);		
				
				var code=row.code.split(",");
				var html='';
				for(var i=0;i<code.length;i++){
					html+='<b>'+code[i]+'</b>';
				}
				$("#kjopcode").html(html);
				Y.getInt(row.pools) > 0 ? ($("#gc").html((row.pools == '' ? "--" : parseFloat(row.pools).rmb(false, 0)))):'';
			}			
		},
		_loadnewopecode:function(lotid){//查询开奖公告	
        	var row={};
			this.ajax({
				url : "/cpdata/guoguan/"+lotid+"/index.json?rnd=" + Math.random(),
				type : "get",
				cache:false,
				dataType : "json",
				end : function(data) {
        			var obj = eval("(" + data.text + ")");
					var pid = obj.rows.row[0].pid;
					this.ajax({
        	        		url : "/cpdata/game/"+lotid+"/"+pid+".json?rnd=" + Math.random(),
        	        		type : "get",
        					cache:false,
        					dataType : "json",
        					end : function(d) {
        						var ob = eval("(" + d.text + ")");
        						var r = ob.period;
        	        				row.code = r.codes;        				
        	        				row.etime = r.et;        				
        	        				row.pools = r.pools;        				
        	        				row.sales = r.sales;        				
        	        				row.nums = r.nums;        				
        	        				row.money = r.moneys;        				
        	        				row.pid = r.pid;        				
        	        				row.gid = r.gid;
        	        				row.atime = Y.getDate(r.at).format('YY-MM-DD');
        	        				Y.postMsg('msg_get_opencode_suc',row); 
        	        		}
        	        	});  
        		}
        	}); 
        },		
		
	    init: function (){//处理URL参数
	    	Class.C('lot_id',$("#lotid").val());
	    	this._loadnewopecode(Class.C('lot_id'));	    		
	    	if ($("#expect_tab").size()==0){
	    		return false;
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
									if ($("#expect").val() == "") {
										$("#expect").val(expectlist[i][0]);
									}
									
									html = '<option value="'+expectlist[i][0]+'" id="exp' + expectlist[i][0] + '">'+expectlist[i][0].substr(2)+'(在售)</option>';
								} else {
									html += '<option value="'+expectlist[i][0]+'" id="exp' + expectlist[i][0] + '" >'+expectlist[i][0].substr(2)+'(预售)</option>';
								}
							}		
						}
						var find = false;
						for ( var i =  0; i < (expectlist.length>3?3:expectlist.length); i++) {
							if (expectlist[i][0] == $("#expect").val()) {
								find = true;
								$("#fs_endTimeSpan").html(Y.getDate(expectlist[i][1]).format('MM-DD hh:mm'));
								$("#ds_endTimeSpan").html(Y.getDate(expectlist[i][2]).format('MM-DD hh:mm'));
					            $("#responseJson #serverTime").val(Y.getDate(data.date).format('YY-MM-DD hh:mm:ss'));
								$("#responseJson #endTime").val(Y.getDate(expectlist[i][1]).format('YY-MM-DD hh:mm:ss'));
								this.postMsg('msg_show_endtime_CountDown');
							}
						}
						if (!find) {
							this.alert('对不起，该期暂未开售或者已经截止!');
						}
						$("#expect_tab").html(html);
						$("#expect_tab").change(function(){
							$("#pt_list_clear").click();
							var item = $("#expect_tab option:selected").val();
							$("#expect").val(item);
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
								
								if(expectlist[i][0]==item){
									
									Y.postMsg('msg_endtime_change', endtime, data.date);
//									$("#fs_endTimeSpan").html(Y.getDate(expectlist[i][1]).format('MM-DD hh:mm'));
//									$("#ds_endTimeSpan").html(Y.getDate(expectlist[i][2]).format('MM-DD hh:mm'));		
								}
							}
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
	    }
    });
		
    
//球区选择
    Class('Choose', {
        startNum: 1,
        index:function (config){
            this.items = this.need(config.items);
            this.focusCss = config.focusCss || 'selected';
            this.killCss = config.killCss;// 有杀号功能
            this.hasKill = !!config.killCss;
            this.data = [];
            this.killData = [];
            this.addNoop('onchange, onbeforeselect');
            this.items.mousedown(function (e, Y){
                var isUnselect, o;
                o = Y.need(this);
                isUnselect = Y.hasKill ? Y.hasClass(this, Y.killCss) : Y.hasClass(this, Y.focusCss);// 是否取消选择行为
                if (isUnselect || !isUnselect && Y.onbeforeselect(this, Y.hasClass(this, Y.focusCss)) !== false) {//选中下一个前事件
                    if (Y.hasKill) {
                        if (Y.hasClass(this, Y.focusCss)) {
                            o.swapClass(Y.focusCss, Y.killCss);
                        }else if(Y.hasClass(this, Y.killCss)){
                            o.removeClass(Y.killCss)
                        }else{
                            o.addClass(Y.focusCss);
                        }
                    }else{
                        o.toggleClass(Y.focusCss);
                    }            
                    Y.change(this)                
                }
            });

            if (config.hoverCss) {
                this.items.hover(function (e, Y){
                    Y.get(this).addClass(config.hoverCss)
                },function (){
                     Y.get(this).removeClass(config.hoverCss)
                });            
            }

            if (config.group) {//组选按扭
                this.group = this.need(config.group);
                this.group.each(function (b, i){
                    this.need(b).mousedown(function (e, Y){
                        Y.batSelect(this.innerHTML.replace(/<[^>]+>/g,'').trim())
                    })
                }, this)
            }
            
            if (!isNaN(config.startNum)) {//有些彩种从0开始
                this.startNum = config.startNum
            }
        },
        change: function (){//变化时收集选与杀数组
            this.data = [];
            this.killData = [];
            this.items.each(function (el){//统计选中数
                if (this.hasClass(el, this.focusCss)) {
                    this.data.push(this.getInt(el.innerHTML))//选中组
                }else if(this.hasKill && this.hasClass(el, this.killCss)){
                    this.killData.push(this.getInt(el.innerHTML))//杀号组
                }
            }, this);
            this.onchange()
        },
        importCode: function (num){//导入号码
            num = typeof num == 'string' ? num.split(',') : num instanceof Array ? num : [];
            num.each(function (i, j){
                var index, ball;
                index = this.getInt(i- this.startNum).range(0,1/0);
                if (ball = this.items.nodes[index]) {
                    this.get(ball).addClass(this.focusCss)
                }
            }, this);
            this.change(null)
        },
        random: function (n, kill){// (6), 随机生成号码
            var n, l, rndCode;
            l = this.items.size();
            n = (~~n).range(1, l);
            this.clearCode();//清除胆码
            kill = kill || this.killData;
            rndCode = this.repeat(l, 1).remove(kill).random(-n);
            this.importCode(rndCode)//在剩余的号码中打乱后选出n个
        },
        batSelect: function (type){//按特征组选号
            var cmd, fn, odd;
            odd = this.startNum == 0 ? [0, 1] : [1, 0];
            switch(type){
            case '全': 
                cmd = 'return true';
                break;
            case '大': 
                cmd = 'return n > 5';
                break;
            case '小':
                cmd = "return n <= 5";
                break;
            case '奇':
				cmd = "return n % 2 == "+odd[0];
                break;
            case '偶':
				cmd = "return n % 2 == "+odd[1];
                break;
            default:// 清
                cmd = 'return false';
            }
            fn = new Function('n', cmd);
            this.items.each(function (el, i){
                if (fn(i+1)) {
                    this.need(el).addClass(this.focusCss)
                }else{
                    this.need(el).removeClass(this.focusCss)
                }
            }, this);
            this.change()
        },
        unselect: function (n){// 清除指定号码, n = string|number|array
            var n = this.isArray(n) ? n : [n];
            this.items.each(function (el){
                var c = this.getInt(el.innerHTML);
                if (n.indexOf(c) > -1) {
                    this.get(el).removeClass(this.focusCss).removeClass(this.killCss);
                }
            }, this);
            this.change()
        },
        killCode: function (el){
            this.get(el).removeClass(this.focusCss).addClass(this.killCss);
            this.change()        
        },
        clearCode: function (hasKill){//清空, 是否包含killCss
            this.items.each(function (el){
                this.need(el).removeClass(this.focusCss);
                if (hasKill && this.hasKill) {
                    this.need(el).removeClass(this.killCss)
                }
            }, this);
            this.change(null)
        }
    });
//号码列表
    Class('CodeList', {
        splitChar: '|',
        rightSplit: ',',
        noZero: false,
        //lineTpl: '<li><em>{1}{2}</em><strong>{3}</strong></li><li class="sup"><a href="#"></a><a href="#" class="gb"></a></li>',
        lineTpl: '<span class="num ssq">{1}{2}<em class="blue">{3}</em></span><s></s><i></i>',
        index:function (config){
            var func;
            this.zhushu = this.totalmoney = 0;
            this.beishu = 1;
            this.panel = this.need(config.panel);
            this.bindEvent(config);
            this.msgId = config.msgId || '';
            this.stopRedraw = config.stopRedraw;//是否回显号码
            this.onMsg( 'msg_put_code_' + this.msgId, function (code){
                this.addCode(code);
				return this.zhushu;
            });
            this.onMsg( 'msg_get_list_data_' + this.msgId, function (){
                return this.getData()
            });
            this.onMsg('msg_buy_succeed', function (){
                this.clearLine();
            });
             this.onMsg('msg_clear_code_' + this.msgId, function (){
                 this.clearLine();
             });
             this.onMsg('msg_update_list_' + this.msgId, function (){
                 this.change(this.zhushu);// 追加投注时同步命令
             });
             this.addStyle('.betList li.list-Selected{background-color:#D9F1FF}')
            this.tip = this.lib.NotifyIcon()
        },
        bindEvent: function (config){
            var Y = this;
            this.need(config.addbs).click(function (){
            	Y.zsInput.val((parseInt(Y.zsInput.val())+1)>99?99:(parseInt(Y.zsInput.val())+1))
            	 Y.beishu = Y.zsInput.val();
                Y.change(Y.zhushu)
            })
            this.need(config.lessbs).click(function (){
            	Y.zsInput.val((Y.zsInput.val()-1)>1?(Y.zsInput.val()-1):1)
            	 Y.beishu = Y.zsInput.val();
                Y.change(Y.zhushu)
            })
            this.zsInput = new this.lib.DataInput({
                input: config.bsInput,
                min: 1,
                initVal:1
            });
        //倍数变化
            this.zsInput.onchange = function (){
                if (Class.C('buy_type') == 2 && this.val() > 99) {
                    this.val(99)
                }
                Y.beishu = Y.getInt(this.val());
                Y.change(Y.zhushu)
            };
			this.onMsg('msg_force_change_bs', function(bs, zs) {
				this.zsInput.val(bs);
				this.zhushu = zs;
				this.zsInput.onchange();
			});
            this.onMsg('toggle-zh', function (){
              //  this.zsInput.onchange()
            });
            this.moneySpan = this.need(config.moneySpan);
            this.zsSpan = this.need(config.zsSpan);
            this.clearBtn = this.need(config.clearBtn);
            this.clearBtn.click(function (e, Y){
                Y.clearLine();
            });
        //选中行
            this.prevSelectedLine = null;
            this.panel.live('li', 'click', function (e, y){
                if (!Y.prevSelectedLine || Y.prevSelectedLine != this) {
                    Y.get(Y.prevSelectedLine).removeClass('list-Selected').get(this).addClass('list-Selected');
                    Y.prevSelectedLine = this
                }
                if (!Y.stopRedraw) {
                    Y.postMsg('msg_redraw_code', Y.get(this).data('code'))
                }            
            })
        },
        addCode: function (code){
            var one, li;
            if (code.length) {
                if (!this.isArray(code[0])) {
                    code = [code]
                }
                for (var i = 0, j = code.length; i < j; i++) {
                    one = code[i]; // [red, blue, count];
                    li = this.createLine(one);
                    //alert(one+"--"+one.slice());
                    li.data('code', one.slice());
                    li.setStyle('cursor:pointer');
                    this.need('a.a2', li).click(function (e, Y){
                        Y.removeLine(Y.get(this).parent(function (el){
                            return el.nodeName.toLowerCase() == 'li'
                        }));
                        e.stop();
                        e.end();
                        return false
                    })
                }
                this.change(this.getCount())
            }
        },
        createLine: function (code){//创建一行
        	//return this.lineTpl.format(String.zero(code[0].join(',')), this.splitChar, String.zero(code[1].join(this.rightSplit)));
        	return this.createNode('LI', this.panel).html(this.lineTpl.format(String.zero(code[0].join(',')), this.splitChar, String.zero(code[1].join(this.rightSplit))));
        },
        removeLine: function (li){//删除一行
            if (li == this.prevSelectedLine) {
                this.prevSelectedLine = null
            }
            this.removeNode(li);
            this.change(this.getCount())
        },
        clearLine: function (){//清空列表
            this.panel.empty();
            this.change(0);
            this.get('#ai_all_zs').html(0);//过滤用到
            this.prevSelectedLine = null
        },
        change: function (zhushu){//变化
            this.zsSpan.html(zhushu);
            this.zhushu = zhushu;
            this.totalmoney = this.zhushu*this.beishu*Class.config('price');
            this.moneySpan.html(this.totalmoney.rmb());
            this.checkMaxMoney(this.totalmoney);

            this.postMsg('msg_list_change', {
                zhushu: zhushu,
                beishu: this.beishu,
                totalmoney: this.totalmoney
            })// 广播注数变化消息, 购买选项类应该监听这个消息
        },
        getCount: function (){//计算总注数
            var Y = this;
            return this.get('li', this.panel).nodes.reduce(function (a, b){
                return a + Y.attr(b, 'code').slice(-1)[0]
            }, 0)
        },
        formatCode: function (d){        
            return '{1}|{2}'.format(d[0].join(','), d[1].join(','));//
        },
        getData: function (){//03,07,10,18,21,22|08$10,13,15,18,20,25,30|05,08,15
            var arr = [];
            this.get('li', this.panel).each(function (a){
                var d = this.get(a).data('code');
                arr.push(this.formatCode(d))
            }, this);
            return {
                codes: this.noZero ? arr.join('$') : String.zero(arr.join('$')),
                zhushu: this.zhushu,
                beishu: this.beishu,
                totalmoney: this.totalmoney
            }
        }
    });
//选择基础类
    Class('Choose_base', {
        index:function (config){
            this.putBtn = this.get(config.putBtn).concat(this.get(config.aiBtn).nodes);
        //接收随机选号命令
            this.onMsg('msg_rnd_code_'+config.msgId, function (){
                this.random($("#jx_dlg_list li").length);
               
            });
             this.onMsg('msg_clear_code_'+config.msgId, function (){
                 this.clearCode();
             });
             this.onMsg('msg_redraw_code_'+config.msgId, function (code){
                 this.redrawCode(code);
             });
             this.onMsg('msg_get_choose_code_'+config.msgId, function (isKeepCode){
                 return this.getChooseCode(isKeepCode);
             });
             this.onMsg('msg_update_list_' + this.msgId, function (){
                 this.updateShow();// 追加投注时同步命令
             });
             this.addNoop('redrawCode,getChooseCode');//子类重载
         //遗漏
             if (config.yl) {
                 config.yl.each(function (o){
                     this.loadYL(o)
                 }, this)
             }
        },
        highlightBtn: function (zs){
            if (zs) {
               this.putBtn.addClass('cur')
            }else{
               this.putBtn.removeClass('cur')
            }
        },
        random: function (n){// 随机生成号码, [[red],[blue]]
            var a, b, code, id;
            n = ~~n;
            code = [];
            a = this.leftMax ? this.repeat(this.leftMax, 1) : false;
            b = this.rightMax ? this.repeat(this.rightMax, 1) : false;
            for (var i = n; i--;) {
                code[i] = [];
                if (a) {
                    code[i].push(a.random(-this.leftNum).sort(Array.up))
                }
                if (b) {
                    code[i].push(b.random(-this.rightNum).sort(Array.up))
                }
                code[i].push(1)
            }
            id = this.msgId;
            this.postMsg('msg_show_jx', code, function (e, btn){
                  if (btn.id == 'jx_dlg_re') {
                        this.postMsg('msg_rnd_code')
                   }else if(btn.id == 'jx_dlg_ok'){
                        this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息    
                   }
            }, this.rndtpl)                
        },
        loadYL: function (o){// 加载遗漏[xml, 呈现节点, 宽度(排列型用到), 取属性名]
            var yl, Y;
            Y = this;
            if (yl = Class.config(o.url)) {
                setYLVal(yl, o)          
            }else{
                this.ajax({
                    url:o.xml,
                    end:function (data, i){
                        var yl = [], max, dom;
                        this.qXml('//row', data.xml, function (node, x){
                            yl.push(node.items)
                        });
                        if (o.sort) {
                            yl.sort(function (a, b){
                                return parseInt(a[o.sort]) - parseInt(b[o.sort]) > 0 ? 1 : -1
                            })
                        }
                        setYLVal(yl, o);// yl is Array
                        Class.config(o.xml, yl)//缓存到全局
                    }
                });                
            };
            function setYLVal(yl, o){
                var len, max, curMax, vals;
                max = [];
                offset = o.offset || 0;
                name = o.name || 'curyl';
                vals = yl.map(function (item){//按属性名映射出值
                    return Math.round(item[name])
                }).slice(offset);
                len = vals.length;
                width = ~~o.width || len;
                for (var i = 0; i < len; i+=width) {//多位排列进行折算行最大值
                    max.push(Math.max.apply(Math.max,vals.slice(i, i+width)))
                }
                  Y.get(o.dom).each(function (el, i){//填充到页面
                    if (i in vals) {
                        el.innerHTML = vals[i];
                        curMax = max[Y.getInt(i/width)];
                        el.style.color = vals[i] == curMax ? 'red' : '#B1B1B1'                    
                    }
                });            
            }
        }
    });
//双色球选号器
    Class('Choose_base>Choose_pt', {
        showTxt:'[ 您选择了<font>{$dan}</font>个前区号码，<font>{$blue}</font>个后区号码，共<font>{$zhushu}</font>注，共计<font>{$totalmoney}元</font>]',
        noCodeMsg: '您好，请您至少选择6个红球和1个蓝球！',
        leftNum: 6,
        rightNum: 1,
        leftMax: 33,
        rightMax: 16,
        leftChooseMax: 20,
        leftname: '红球',
        index:function (config){
            var red, blue, showbar, Y;
            Y = this;
            this.msgId = config.msgId || '';
            this.red = red = this.lib.Choose(config.red);
            this.blue = blue = this.lib.Choose(config.blue);
            this.leftChooseMax = config.leftChooseMax || this.leftChooseMax;
            this.red.onbeforeselect = function (ball){
               if (this.data.length > Y.leftChooseMax-1) {
                   this.postMsg('msg_show_dlg', '您好, ' + Y.leftname+ '最大可选个数为' +Y.leftChooseMax+'个！');
                   return false
               }
            };
            showbar = this.need(config.showbar);
            this.addNoop('onchange')
            this.updateShow = red.onchange = blue.onchange = function (){// 红蓝选择有变化时
                var zhushu, info;
                zhushu = Y.getCount();
                info = {
                    dan: red.data.length,
                    kill: red.killData.length,
                    blue: blue.data.length,
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
            var red_rnd_sel, blue_rnd_sel, all_rnd_sel, Y;
            Y = this;
        //输出按扭
            Y.get(config.putBtn).click(function (){
                var code, count;
                count = Y.getCount();
                if (Y.leftMax==33 && count*Class.C('price') > 100000) {
                    return Y.alert('您好， 单个方案金额不能超过10万元！')
                }
                if (Y.checkMaxMoney(count*Class.C('price')) ){
                    if(count > 0) {
                        code = Y.getChooseCode();
                        Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息
                    }else if(Y.red.data.length == 0 && Y.blue.data.length == 0){
                        Y.postMsg('msg_show_dlg', '您好，请您至少选择一注投注号码！')
                    }else{
                        Y.postMsg('msg_show_dlg', Y.noCodeMsg)
                    }             
                }           
            });
        // 随机选取
            red_rnd_sel = this.need(config.red.rndSelect);
            blue_rnd_sel = this.need(config.blue.rndSelect);
            this.rndOpts = all_rnd_sel = this.get(config.rndSelect);
            Y.need(config.red.rndBtn).click(function (){
                
               
				var _interval = setInterval(function(){Y.red.random(red_rnd_sel.val());},150);
				setTimeout(function(){clearInterval(_interval);}, 1000);
                return false
            });
            Y.need(config.blue.rndBtn).click(function (){
                
				var _interval = setInterval(function(){Y.blue.random(blue_rnd_sel.val());},90);
				setTimeout(function(){clearInterval(_interval);}, 700);
                return false
            });
            Y.get(config.rndBtn).click(function (){
				Y.random(all_rnd_sel.val());
                return false            
            });
           Y.onMsg('msg_rnd_ssq_'+this.msgId, function (fn){//智能过滤时对未选号码进行自动选号, 1w注内
                Y.red.random(14);  
                Y.blue.random(3);
                fn && fn(Y.red.data, Y.blue.data)     
           })
       // 清除
           Y.need(config.red.clearBtn).click(function (){
                Y.red.clearCode(true)
            });
            Y.need(config.blue.clearBtn).click(function (){
                Y.blue.clearCode(true)
            }); 
            Y.get(config.clearBtn).click(function (){
                Y.clearCode()
            }); 
        },
        getChooseCode: function (isKeepCode){
            var code = [[this.red.data.slice(), this.blue.data.slice(), this.getCount()]];
            if (!isKeepCode) {
                this.red.clearCode(true);
                this.blue.clearCode(true);
            }
            return code    
        },
        clearCode: function (){
            this.blue.clearCode(true);
            this.red.clearCode(true)            
        },
        getCount: function (){//计算注数
            var r, b;
            r = this.red.data.length;
            b = this.blue.data.length;
            return r<this.leftNum || b<this.rightNum ? 0 :  Math.c(r, this.leftNum) * Math.c(b, this.rightNum)
        },
        redrawCode: function (code){//重现号码
            this.clearCode();
            this.red.importCode(code[0]);
            this.blue.importCode(code[1])
        }
    });
//扩展节点方法
    Y.fn.selectLine = function (n){
        var codes, s1, s2, count, startPos, endPos, node, r;
        if (node = this.one()) {
            codes = (node.value + "\n").replace(/\n+$/, "\n");
            s1 = codes.match(eval("/^(.+\\n){" + (n - 1) + "}/ig"));
            if (s1) {
                s2 = codes.match(eval("/^(.+\\n){" + n + "}/ig"));
                count = codes.match(/.+\n/ig).length + 5;
                startPos = s1[0].length;
                endPos = s2[0].length;
                if (node.createTextRange) {
                    r = node.createTextRange();
                    r.collapse();
                    r.moveStart('character', startPos - n + 1);
                    r.moveEnd('character', endPos - startPos - 1);
                    r.select();
                } else {
                    node.selectionStart = startPos;
                    node.selectionEnd = endPos;
                    node.scrollTop = node.scrollHeight / count * (n - 1);
                    node.focus();
                }
            }        
        }
        return this
    };
//单式上传类
    Class('DsUpload', {
        index:function (config){
            this.addElements(config);
            this.defineMsg();
        },

        addElements: function (config){
            var Y = this;
            this.moneySpan = this.need(config.moneySpan);
            this.scChk = this.need(config.scChk);
            this.upfile = this.need(config.upfile);
            this.scChk.click(function (e, Y){//显示稍候上传说明
            	Y.get(config.upfile).prop('disabled', this.checked);
                Y.clearFileInput('#upfile');
                Y.postMsg('msg_toogle_nosc', this.checked)//同步购买方式
            });
            this.zsInput = new this.lib.DataInput({
                input: config.zsInput,
                initVal: 0,
                min:0
            });
            this.bsInput = new this.lib.DataInput({
                input: config.bsInput,
                initVal: 1,
                min:1
            });
            this.input = this.zsInput.input;
            this.priceChange = this.bsInput.onchange = this.zsInput.onchange = function (){
                var limit, data = {
                    zhushu: Y.getInt(Y.zsInput.val()),
                    beishu: Y.getInt(Y.bsInput.val()),
                    totalmoney:Y.getInt(Y.zsInput.val()*Y.bsInput.val()*Class.config('price'))
                }
                Y.moneySpan.html((data.totalmoney).rmb());
                Y.postMsg('msg_list_change', data);
                limit = this.getLimit();
                if (data.totalmoney < limit.min) {
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能少于'+limit.min.rmb()+'元, 请修改!').setIco(3);
               // this.input.input.doProp('select')
                }else if(data.totalmoney > limit.max){
                    Y.getTip().show(this.input,'<h5>投注金额限制</h5>您发起的方案金额不能大于'+limit.max.rmb()+'元, 请修改!').setIco(3);
                //this.input.input.doProp('select')
                }else{
                    Y.getTip().hide()
                }
            }
        },
        
        defineMsg: function (){
            this.onMsg('msg_check_sc_err', function (){// 检查上传表单
                var err, file, input, zs, bs, money, min, max, pe;
                file = this.one('#upfile');
                zs = this.getInt(this.zsInput.val());
                bs = this.getInt(this.bsInput.val());
                money = zs*bs*pe;
                limit = this.getLimit();
                if (!zs) {
                    err = '您好，您发起方案的注数不能为0！';
                    input = this.zsInput;
                }else if (!bs) {
                    err = '您好，您发起方案的倍数不能为0！';
                    input = this.bsInput;
                }else if(money < limit.min){
                    err = '您好，您发起方案的金额不能小于'+limit.min.rmb()+'元！';
                    input = this.bsInput;                
                }else if(money > limit.max){
                    err = '您好，您发起方案的金额不能大于'+limit.max.rmb()+'元！';
                    input = this.bsInput;                
                }else if (!this.scChk.one().checked) {
                    if (file.value == '') {
                         err = '您好，请选择要上传的方案文件！'
                    }else if(!file.value.match(/\.te?xt$/i)){
                         this.clearFileInput(file);
                         this.one('#upfile').focus();
                         err =  '您好，上传文件只支持txt格式，请重新上传！'
                    }
                }
                if (err) {
                    this.postMsg('msg_show_dlg',  err, function (){
                        input && input.input.one().select()
                    });
                } 
                return !!err
            });
            this.onMsg('msg_get_list_data_sc', function (){
                return {
                    codes: this.scChk.one().checked ? '稍后上传' : '文本文件上传',
                    isupload: this.scChk.one().checked ? 0 : 1,
                    zhushu: this.getInt(this.zsInput.val()),
                    beishu: this.getInt(this.bsInput.val()),
                    totalmoney:this.getInt(this.zsInput.val()*this.bsInput.val()*Class.config('price'))
                }
            });
             this.onMsg('msg_update_list_sc', function (){
                 this.priceChange();// 追加投注时同步命令
             });
             this.onMsg('msg_clear_code_sc', (function (){
                 this.clearCode();
             }).proxy(this))
        },

        clearCode: function (){
            this.zsInput.val('');
            this.bsInput.val(1);
            this.clearFileInput('#upfile');
            this.moneySpan.html('￥0.00');
            this.scChk.one().checked = false;
            //this.get('#uphelp').show();
            //this.get('#upfile').parent().show();
        },

        clearFileInput: function (f){
            var f = this.one(f);
            if (this.ie) {
                f.outerHTML = f.outerHTML
            }else{
                f.value = ''    
            }
        }
    });
//排列直选选择器
    Class('Choose_base>PLChoose',{
        showTxt: '【您选择了<em> {$zhushu} </em>注，共<em> {$totalmoney} 元</em>】',
        maxZs: 10000,
        index:function (ini){
            var hoverCss, focusCss, Y, showbar, startNum;
            Y = this;
            hoverCss = ini.hoverCss || '';
            focusCss = ini.focusCss || 'cur';
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
            this.rndtpl = '<li>' + this.repeat(this.balls.length, function (i){
                return '<span class="blue">{'+(i+1)+'}</span>'
            }).join(' | ') + '</li>';
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
            var rnd, opts, all_rnd_sel, Y, cn;
            Y = this;
        //输出按扭

            Y.need(ini.putBtn).click(function (){
                var code, count;
                count = Y.getCount();
                if (count > Y.maxZs){
                      Y.postMsg('msg_show_dlg', '您好, 单个方案不能超过'+Y.maxZs+'注！')
                }else if (count>0) {
                    //Y.chkLimitCode(Y.getChkCode(), function (){
                        code = Y.getChooseCode();
                        Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息                        
                    //})
                }else{
                    cn = Y.balls.length > 5 ? '一二三四五六七'.split('').map(function(x){return '第'+x}) : '万千百十个'.split('');
                    var dw;
                    Y.balls.each(function (b, i){
                        if (b.data.length==0) {
                            dw=cn.slice(-Y.balls.length)[i];
                            return false
                        }
                    })
                    Y.postMsg('msg_show_dlg', '您好, 您还没有选择'+dw+'位上的号码, 请选择！')
                }            
            });
        // 随机选取
            this.rndOpts = opts = this.need(ini.rndOpts);
            Y.need(ini.rnd).click(function (){
                Y.random(opts.val().replace("注","")*1);
                return false
            });
//            机选一注
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
				switch (code.length) {
					case 4: line_tip = ['百位', '十位', '个位']; break;
					case 6: line_tip = ['万位', '千位', '百位', '十位', '个位']; break;
					case 8: line_tip = ['一', '二', '三', '四', '五', '六', '七'];
				}
				for (var i = 0; i < code.length - 1; i++) {
					_len += code[i].length;
					code[i].length > 1 && _line.push(line_tip[i]);
				}
				if (_len == 0) {
					Y.postMsg('msg_show_dlg', '您好，请您至少选择一个胆码！')
				} else if (_line.length > 0) {
					if (code.length == 8) {
						Y.postMsg('msg_show_dlg', '您好，第' + _line.join('、') + '位胆码数量超出，每位最多只能选择一个胆码！');
					} else {
						Y.postMsg('msg_show_dlg', '您好，' + _line.join('、') + '胆码数量超出，每位最多只能选择一个胆码！');
					}
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
            var code=[];
			keep = keep || false;
            this.balls.each(function (b, i){
                code[i] = b.data.slice()
            });
            code.push(this.getCount());
            !keep && this.clearCode();
            return [code]
        },
        getChkCode: function (){
            var code=[];
            this.balls.each(function (b, i){
                code[i] = b.data.join('')
            });
            return code.join('|')
        },
        clearCode: function (){
            this.balls.each(function (o){
                o.clearCode(true)
            })         
        },
        random: function (n){// 随机生成号码, [[red],[blue]]
            var a, b, code, id, lines;
            n = ~~n;
            code = [];
            b = this.repeat(10);
            lines = this.balls.length;
            for (var i = n; i--;) {
                code[i] = [];
                for (var j =  lines; j--;) {
                    var r = Math.random()*j;
                    code[i].push(b.random(r, r + 1));
                }
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
			var a, b, code, id, lines, Y = this;
            n = ~~n;
            code = [];
            b = this.repeat(10);
            lines = this.balls.length;
            for (var i = n; i--;) {
                code[i] = [];
                for (var j = 0; j < lines; j++) {
                    var r;
					if (danma[j].length) {
						code[i].push(danma[j]);  //该位定胆
					} else {
						r = Math.random()*j;
						code[i].push(b.random(r, r + 1));  //该位机选
					}
                }
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
            this.balls.each(function (b, i){
                b.importCode(code[i]);
            })
        }
    });
//排列号码框
    Class('CodeList>PLCodeList', {
        noZero: true,
        lineTpl: '<p>{3}注<a title="修改" class="a1"></a><a title="删除" class="a2" ></a></p><em > {2}</em><span>{1}</span>',
        createLine: function (code){//创建一行
            var tc, type, pn;
            tc = [];
            pn=Class.C('play_name2');
            type = this.getPlay ? this.getPlay() : '标准选号';
            code.slice(0,-1).each(function (d, i){
                tc[i]=d.join('')
            });
            return this.createNode('LI', this.panel).html(this.lineTpl.format(tc.join('|'), type,code[code.length-1]));
        },
        formatCode: function (d){//用于投注参数
            return d.slice(0,-1).map(function (a){
                return a.join('')
            }).join('|')
        }
    });
    //计算百分比
    Class.extend('getPercent', function (a, b){
        return ((this.getInt(a)/this.getInt(b))*100).toFixed(2)+'%'
    })
//号码统计图表
    Class('CountChart', {
        use:'mask',
        index:function (ini){
            this.options = this.mix({}, ini);
            this.expect = this.get('#expect').val();
            this.leftXml = ini.leftXml;
            this.rightXml = ini.rightXml;
            this.grqXml = ini.rqXml;
            this.lot = ini.lot;
            this.loadCoolHot()
        },
        loadRq: function (xml){
            var r, b;
            this.ajax({
                url: this.rqXml,
                end:function (data, i){
                    var n = this.lot == 'dlt' ? ['fore','back'] : ['red','blue'];
                    r = this.getTwo(n[0], data.xml, 3);
                    b = this.getTwo(n[1], data.xml, 1);
                    this.full('#renqi', r, b)
                }
            });
        },
        getTwo: function (nodeName, xml, n){
            var r = [];
            this.qXml('//'+nodeName+'/row', xml, function (a){
                r.push(a.items)
            });
            r.sort(function (a, b){
                return parseFloat(a.count) > parseFloat(b.count) ? -1 : 1
            });
            return r.slice(0, n ||1 )        
        },
        full: function (wrap, r, b){
            this.get('tr', wrap).slice(0, 3).each(function (tr, i){
                if (r[i]) {
                    this.get('b', tr).html(r[i].num);
                    this.get('em', tr).setStyle('width: '+r[i].percent);
                    this.get('i', tr).html(r[i].count);                
                }
            }).end().slice(3, 4).each(function (tr, i){
                if (b[i]) {
                    this.get('b', tr).html(b[i].num);
                    this.get('em', tr).setStyle('width: '+b[i].percent);
                    this.get('i', tr).html(b[i].count);                  
                }                  
            })        
        },
        loadCoolHot: function (xml){
            var red, blue, rc, bc;
            red = {};
            blue = {};
            if(Class.C('lot_id')!="01"){
                this.ajax({
                    url: this.leftXml,
                    end:function (data, i){
                        var tmp = [];
                        this.qXml('//row', data.xml, function (o){
                            tmp.push(o.items)
                        });
                        tmp.sort(function (a, b){
                            return parseFloat(a.count) > parseFloat(b.count) ? -1 : 1                    
                        });
                        rc = tmp.reduce(function (a, b){
                            return a +parseInt(b.count)
                        }, 0)
                        
                        red.hot = tmp.slice(0,6);
                        red.cool = tmp.slice(-6);
                    }
                },{
                    url: this.rightXml,
                    end: function (data){
                        var tmp = [];
                        this.qXml('//row', data.xml, function (o){
                            tmp.push(o.items)
                        });
                        tmp.sort(function (a, b){
                            return parseFloat(a.count) > parseFloat(b.count) ? -1 : 1                    
                        });
                        bc = tmp.reduce(function (a, b){
                            return a+parseInt(b.count)
                        }, 0)
                        blue.hot = tmp.slice(0,2);
                        blue.cool = tmp.slice(-2);
                        this.full2('#hot', red.hot, blue.hot, rc, bc);
                        this.full2('#cold', red.cool, blue.cool, rc, bc);
                    }
                },{
                	url: this.grqXml,
                	end: function(data){
                		var tmp = [];
                		 this.qXml('//omission/row', data.xml, function (o){
                             tmp.push(o.items)
                         });
                		red.grq = tmp.slice(0, 7);
                		red.drq = tmp.slice(7, 14);
                		this.full3('#grq', red.grq);
                		this.full3('#drq', red.drq);
                	}
                });
            }else if(Class.C('lot_id')=="01"){
            	 this.ajax({
                 	url: this.grqXml,
                 	end: function(data){
                 		var tmp = [];
                 		 this.qXml('//omission/row', data.xml, function (o){
                              tmp.push(o.items)
                          });
                 		red.grq = tmp.slice(0, 7);
                 		red.drq = tmp.slice(7, 14);
                 		red.hot = tmp.slice(14, 21);
                 		red.cool = tmp.slice(21, 28);
                 		this.full3('#grq', red.grq);
                 		this.full3('#drq', red.drq);
                 		this.sfull3('#hot', red.hot);
                        this.sfull3('#cold', red.cool);
                 	}
                 });
            }
      
        },
        full2: function (wrap, r, b, rc, bc){
            this.get('tr', wrap).slice(0, 5).each(function (li, i){
                if (r[i]) {
                    this.get('b', li).html(r[i].object);
                    this.get('em', li).setStyle('width: ' + this.ns.getPercent(r[i].count, rc));
                    this.get('i', li).html(r[i].count);                    
                }
            }).end().slice(5, 7).each(function (li, i){
                if (b[i]) {
                    this.get('b', li).html(b[i].object);
                    this.get('em', li).setStyle('width: ' + this.ns.getPercent(b[i].count, bc));
                    this.get('i', li).html(b[i].count);                       
                }                 
            })        
        },
        
        full3: function(wrap,rq){
        	this.get('tr', wrap).slice(0, 7).each(function(li, i){
        		if(rq[i]){
        			this.get('b', li).html(rq[i].s0);
        			this.get('em', li).setStyle(rq[i].s1);
        			this.get('i', li).html(rq[i].s2);
        		}
        	});
        },
        sfull3: function(wrap,rq){
        	this.get('tr', wrap).slice(0, 7).each(function(li, i){
        		if(rq[i]){
        			this.get('b', li).html(rq[i].s0);
        			this.get('em', li).setStyle('width: ' + this.ns.getPercent(rq[i].s2.replace("次",""), 100));
        			this.get('i', li).html(rq[i].s2);
        		}
        	});
        }
    });
//左侧图表
    Class('PLHotCoolChart', {
        index:function (ini){
            this.expect = this.get('#expect').val();
            this.xml = ini.xml;
            this.grqXml = ini.rqXml;
            this.type = ini.type;
            ini.single ? this.loadSingleXml() : this.loadXml();
            if (ini.hzXml) {
                this.loadHz(ini.hzXml)
            }
//            this.lib.Tabs({
//                items: '#coolhot a',
//                contents: '#hot,#cold,#grq,#drq',
//                focusCss: 'cur',
//                delay:100
//            });
        },
        loadSingleXml: function (){// 非排列, eexw, plc
        	red = {};
            this.ajax({
                url:this.xml,
                end:function (data, i){
                    var d, sum;
                    d = [];
                    this.qXml('//row', data.xml, function (o2){
                        d.push(o2.items)
                    });
                    d.sort(function (x, y){//组排序
                        return parseInt(x.count) > parseInt(y.count) ? -1 : 1
                    });
                   sum = d.reduce(function (a, b){
                        return a + parseInt(b.count)
                    },0);                
                    this.get('#hot tr').each(function (li, i){// 热号
                        if (i<d.length) {
                            var row = d[i];
                             this.get('b', li).html(row.object);
                            this.get('em', li).setStyle('width:' + this.ns.getPercent(row.count, sum));
                            this.get('i', li).html(row.count + '次');                        
                        }
                    });
                    d.reverse();
                    this.get('#cold tr').each(function (li, i){//冷号
                        if (i<d.length) {
                            var row = d[i];
                             this.get('b', li).html(row.object);
                            this.get('em', li).setStyle('width:' + this.ns.getPercent(row.count, sum));
                            this.get('i', li).html(row.count + '次');                        
                        }                   
                    })
                }
            },{
            	url: this.grqXml,
            	end: function(data){
            		var tmp = [];
            		 this.qXml('//omission/row', data.xml, function (o){
                         tmp.push(o.items)
                     });
        			 red.grq = tmp.slice(0, 7);
             		 red.drq = tmp.slice(7, 14);
            		
            		this.full3('#grq', red.grq);
            		this.full3('#drq', red.drq);
            	}
            });
        },
        full3: function(wrap,rq){
        	var r;
        	this.get('tr', wrap).slice(0, 7).each(function(li, i){
        		r = [];
    			if(rq[i]){
        			r[0] = rq[i].s0;
        			r[1] = rq[i].s1;
        			r[2] = rq[i].s2;
        		}
        		
        		
        		if(rq[i]){
        			this.get('b', li).html(r[0]);
        			this.get('em', li).setStyle(r[1]);
        			this.get('i', li).html(r[2]);
        		}
        	});
        },
        loadXml: function (){// sd, pls, plw, qxc
        	red = {};
            this.ajax({
                url:this.xml,
                end:function (data, i){
                    var d;
                    d = [];
                    this.qXml('/xml/*', data.xml, function (o){
                        if (o.node.nodeName != 'head') {
                            var s = [];
                            this.qXml('row', data.xml, function (o2){
                                s.push(o2.items)
                            }, o.node);
                            d.push(s)
                        }
                    }); 
                    d.each(function (a){// n 组
                        a.sort(function (x, y){//组排序
                            return parseInt(x.count) > parseInt(y.count) ? -1 : 1
                        })
                    });
                    this.get('#hot tr').each(function (li, i){// 热号
                        if (i<d[i].length) {
                            var row = d[i][0];
                            d[i].sum = d[i].reduce(function (a, b){
                                return a + parseInt(b.count)
                            },0);
                            this.get('b', li).html(row.object);
                            this.get('em', li).setStyle('width:' + this.ns.getPercent(row.count, d[i].sum));
                            this.get('i', li).html(row.count + '次');                        
                        }
                    }); 
                    this.get('#cold tr').each(function (li, i){//冷号
                        if (i<d[i].length) {
                            var row = d[i][d[i].length-1];
                            this.get('b', li).html(row.object);
                            this.get('em', li).setStyle('width:' + this.ns.getPercent(row.count, d[i].sum));
                            this.get('i', li).html(row.count + '次');                        
                        }
                    });
                }
            },{
            	url: this.grqXml,
            	end: function(data){
            		var tmp = [];
            		 this.qXml('//omission/row', data.xml, function (o){
                         tmp.push(o.items)
                     });
            		 if(this.type == '3d'){
            			 red.grq = tmp.slice(0, 3);
                 		 red.drq = tmp.slice(3, 6); 
            		 }else if(this.type == 'qxc'){
            			 red.grq = tmp.slice(0, 7);
                 		 red.drq = tmp.slice(7, 14);
            		 }else if(this.type == 'p5'){
            			 red.grq = tmp.slice(0, 5);
                 		 red.drq = tmp.slice(5, 10); 
            		 }else{
            			 red.grq = tmp.slice(0, 3);
                 		 red.drq = tmp.slice(3, 6); 
            		 }
            		
            		this.full4('#grq', red.grq, this.type);
            		this.full4('#drq', red.drq, this.type);
            	}
            });
        },
        full4: function(wrap,rq, type){
        	var r;
        	this.get('tr', wrap).slice(0, 7).each(function(li, i){
        		r = [];
        		if(type == '3d'){
        			if(rq[i]){
            			r[0] = rq[i].s1;
            			r[1] = rq[i].s2;
            			r[2] = rq[i].s3;
            		}
        		}else if(type == 'qxc'){
        			if(rq[i]){
            			r[0] = rq[i].s1;
            			r[1] = rq[i].s3;
            			r[2] = rq[i].s4;
            		}
        		}else{
        			if(rq[i]){
        				r[0] = rq[i].s1;
            			r[1] = rq[i].s2;
            			r[2] = rq[i].s3;
            		}
        		}
        		
        		
        		if(rq[i]){
        			this.get('b', li).html(r[0]);
        			this.get('em', li).setStyle(r[1]);
        			this.get('i', li).html(r[2]);
        		}
        	});
        },
        loadHz: function (xml){// 和值统计, 只有3D和pls有
            this.ajax({
                url: xml,
                end:function (data, i){
                    var d = [];
                    this.qXml('//row', data.xml, function (o2){
                        d.push(o2.items)
                    });
                    d.sort(function (x, y){
                        return parseInt(x.count) > parseInt(y.count) ? -1 : 1
                    });
                    var doms = this.get('#hz_tj tr').slice(1)// 第一行是标题
                    var sum = d.slice(0, doms.size()).reduce(function (a, b){
                        return a + parseInt(b.curyl)
                    },0);
                    doms.each(function (tr, i){
                        if (i<d.length) {
                            this.get('b', tr).html(d[i].object);
                            this.get('em', tr).setStyle('width:' + this.ns.getPercent(d[i].count, sum));
                            this.get('i', tr).html(d[i].count + '次'); 
                        }
                    });
                }
            });        
        }
    });
})()