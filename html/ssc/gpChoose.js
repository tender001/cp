/**
 * 
 */
(function (){
	Class.extend('chkLimitCode', function (code, fn){
            if(Class.C('limit-code-ischecking')){
            	fn.call(this); 
            }else{
            	fn.call(this);       	 
        }        
    });
    
    Class('Dlg', {
        index:function (){
        	//成功        	
            this.dlg = this.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
            this.dlg.addClose('#dlg_buysuc_close,#dlg_buysuc_close2');
            this.get('#dlg_suc div.tips_title').drag('#dlg_suc');
            //无图标 codeTpl
            this.codeDlg = this.lib.MaskLay('#codeTpl', '#codeTplConent', '#codeTpl h2');
            this.codeDlg.addClose('#codeTplClose,#codeTplYes');
            this.codeDlg.panel.setStyle('width:380px');
            this.get('#codeTpl div.tips_title').drag('#codeTpl');
            //充值
            this.addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
            this.addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
            this.get('#addMoneyLay div.tan_top').drag('#addMoneyLay');
            
            this.get('strong.c-s-hide').each(function (el){
                var tip = '<h5>什么叫遗漏</h5>遗漏是指该号码自上次开出至本期未出现的期数';
                if (el.innerHTML.indexOf('遗')>0) {
                    tip = '<h5>什么叫'+el.innerHTML+'</h5>'+ (el.innerHTML.indexOf('理论')>-1 ? '该和值理论上应该未出现的期数。' :  '指该和值自上期开出至本期未出现的期数。');
                }
                this.get(el).tip(false, 1, tip)
            }, this);
            this.bindMsg()
        },
        bindMsg: function (){
            var Y = this;
            Class.extend('buySucceedDlg', function (lotid,projid,ischase){
	             $('#dlg_buysuc_view').click(function(){
	            		 if (ischase==1){
	            			 window.location= '/account/xchase.html?zid='+projid+'&lotid='+lotid;
	            		 }else{
	            			 window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;	       
	            		 }     		 
	             });
                Y.dlg.pop('<div class="txt_suc">您好，'+Y.C('userName')+'，恭喜您购买成功!</div>')
            });
            //充值
            this.onMsg('msg_show_addmoney', function (fn, args){
                this.addMoneyDlg.pop(false, function (e, btn){
                    if (typeof fn === 'function' && btn.id == 'addMoneyYes') {
                        fn(args)
                    }
                })
            });
            this.onMsg('msg_code_example', function (type){//弹出示例
                var ini = this.getIni(),
                    n = ini[2], code, arr;
                if (type == 'dlc') {
                    code = this.repeat(11, 1);
                    arr = this.repeat(5, function (i){
                        return String.zero(code.random(-n).sort(Array.up).join(','))+'<br/>'
                    });         
                }else{
                    code = this.repeat(10);
                    arr = this.repeat(5, function (i){
                        return this.repeat(n, function (){
                            return code.random(-1)
                        }).join('')+'<br/>'
                    });                    
                }
                this.codeDlg.title.html(ini[0] + ' - 输入格式');
                this.codeDlg.pop(arr.join(''))
           })
        }
    });

    Class('Choose', {
        startNum: 1,
        index:function (config){
            this.items = this.need(config.items);
//            alert(config.focusCss);
            this.focusCss = config.focusCss || 'selected';
            this.killCss = config.killCss;// 有杀号功能
            this.hasKill = !!config.killCss;
            this.data = [];
            this.killData = [];
            this.addNoop('onchange, onbeforeselect');
            this.disabled;
            this.items.mousedown(function (e, Y){
                var isUnselect, o;
                if(Y.disabled){return}//禁用
                o = Y.need(this);
                isUnselect = Y.hasKill ? Y.hasClass(this, Y.killCss) : Y.hasClass(this, Y.focusCss);// 是否取消选择行为
                if (isUnselect || !isUnselect && Y.onbeforeselect(this, Y.hasClass(this, Y.focusCss)) !== false) {//选中下一个前事件
                    if (Y.hasKill) {
                        if (Y.hasClass(this, Y.focusCss)) {
                            o.swapClass(Y.focusCss, Y.killCss)
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
                    Y.disabled ? 0 : Y.get(this).addClass(config.hoverCss)
                },function (){
                    Y.get(this).removeClass(config.hoverCss)
                });            
            }

            if (config.group) {//组选按扭
                this.group = this.need(config.group);
                this.group.each(function (b, i){
                    this.need(b).mousedown(function (e, Y){
                        Y.batSelect(this.innerHTML.replace(/<[^>]+>/g,'').trim(),this)
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
                    this.addClass(ball, this.focusCss)
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
            rndCode = this.repeat(l, (Class.C('lot_id')=='04' || Class.C('lot_id')=='20'? 0:1)).remove(kill).random(-n);
            this.importCode(rndCode);//在剩余的号码中打乱后选出n个
        },
        batSelect: function (type,el){//按特征组选号
            var cmd, fn;
            odd = this.startNum == 0 ? [0, 1] : [1, 0];
            switch(type){
            case '全': 
                cmd = 'return true';
                break;
            case '全选': 
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
            
            if(el){
            	if(type=="全选"){
                	el.innerHTML = "全清";
                }else if(type=="全清"){
                	el.innerHTML = "全选";
                }else if(type=="机选"){
                    pid = this.getPlayId();
                    rn = this.getIni()[2];//必选个数
                    this.random(rn, '');
                }
            }
            this.change();
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
})()