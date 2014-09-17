/**
 * 
 */
(function (){
	Class.C('limit-code-url', '/data/info/limitcode.xml');
    Class.extend('chkLimitCode', function (code, fn){
            if(Class.C('limit-code-ischecking')){
            	//Y.new_chkLimitCode(code,fn);
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
            this.get('#dlg_suc div.cm_znxx_text1').drag('#dlg_suc');
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
            this.bindMsg();
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
                if (type == '11ydj') {
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
//        	alert('Choose_1');
            this.items = this.need(config.items);
            this.danmas = this.get(config.danmas);
            this.danma = this.get(config.danma);
            this.setdan = this.get(config.setdan);
            this.setdan_i = this.get(config.setdan_i);
            this.focusCss = config.focusCss || 'selected';
            this.killCss = config.killCss;// 有杀号功能
            this.hasKill = !!config.killCss;
            this.dan_data = [];
            this.tuo_data = [];
            this.data = [];
            this.killData = [];
            this.addNoop('onchange, onbeforeselect');
//            alert('Choose_2');
    		this.onMsg('playtabs_onchange'+(config.msgid==''||config.msgid==undefined?'':'_'+config.msgid), function() {
    			this.danmadisplay();
    			this.onchange();
    		});
//    		alert('Choose_3');
    		
     		this.onMsg('danma_onchange'+(config.msgid==''||config.msgid==undefined?'':'_'+config.msgid), function() {
//    			this.danmaonchange();
    		}); 	
//     		alert('Choose_4');
            this.disabled;
//            alert('Choose_5');
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
                            o.removeClass(Y.killCss);
                        }else{
                            o.addClass(Y.focusCss);
                        }
                    }else{
                        o.toggleClass(Y.focusCss);
                    }   
//                    Y.postMsg('danma_onchange'+(config.msgid==''||config.msgid==undefined?'':'_'+config.msgid));
                    Y.change(this);  
                }
            });
//            alert('Choose_6');

            this.danmas.click(function (e, Y){
            	  Y.postMsg('danma_onchange'+(config.msgid==''||config.msgid==undefined?'':'_'+config.msgid));
                  Y.change(this);     
            });    
//            alert('Choose_7');
            
            if (config.hoverCss) {
                this.items.hover(function (e, Y){
                    Y.disabled ? 0 : Y.get(this).addClass(config.hoverCss);
                },function (){
                    Y.get(this).removeClass(config.hoverCss);
                });            
            }
//            alert('Choose_8');

            if (config.group) {//组选按扭
                this.group = this.need(config.group);
                this.group.each(function (b, i){
//                	alert(b);
                    this.need(b).mousedown(function (e, Y){
                        Y.batSelect(this.innerHTML.replace(/<[^>]+>/g,'').trim(),this);
                    });
                }, this);
            }
//            alert('Choose_9');
            
            if (!isNaN(config.startNum)) {//有些彩种从0开始
                this.startNum = config.startNum
            }
//            alert('Choose_10');
        },
        change: function (){//变化时收集选与杀数组
            this.data = [];
            this.killData = [];
            this.items.each(function (el){//统计选中数
                if (this.hasClass(el, this.focusCss)) {
//                    this.data.push(this.getInt(el.innerHTML));//选中组
                	this.data.push($(el).attr('bet'));
                }else if(this.hasKill && this.hasClass(el, this.killCss)){
                    this.killData.push(this.getInt($(el).attr('bet')));//杀号组
                }
            }, this);
            this.onchange();
        },
        importCode: function (num){//导入号码
            num = typeof num == 'string' ? num.split(',') : num instanceof Array ? num : [];
            num.each(function (i, j){
                var index, ball;
                index = this.getInt(i- this.startNum).range(0,1/0);
                if (ball = this.items.nodes[index]) {
                    this.addClass(ball, this.focusCss);
                }
            }, this);
            this.change(null);
        },
        random: function (n, kill){// (6), 随机生成号码
            var n, l, rndCode;
            l = this.items.size();
            n = (~~n).range(1, l);
            this.clearCode();//清除胆码
            kill = kill || this.killData;
            rndCode = this.repeat(l, 1).remove(kill).random(-n);
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
//        batSelect: function (type,el){//按特征组选号
//            var cmd, fn;
//            odd = this.startNum == 0 ? [0, 1] : [1, 0];
//            switch(type){
//            case '全选': 
//                cmd = 'return true';
//                break;
//            default:// 清
//                cmd = 'return false';
//            }
//            fn = new Function('n', cmd);
//            this.items.each(function (el, i){
//                if (fn(i+1)) {
//                    this.need(el).addClass(this.focusCss);
//                }else{
//                    this.need(el).removeClass(this.focusCss);
//                }
//            }, this);
//            if(type=="全选"){
//            	el.innerHTML = "全清";
//            }else if(type=="全清"){
//            	el.innerHTML = "全选";
//            }else if(type="机选"){
//                pid = this.getPlayId();
//                rn = this.getIni()[2];//必选个数
//                this.random(rn, '');
//            }
//            this.change();
//            this.danmaonchange();
//        },
//        unselect: function (n){// 清除指定号码, n = string|number|array
//            var n = this.isArray(n) ? n : [n];
//            this.items.each(function (el){
////                var c = this.getInt(el.innerHTML);
//            	var c = isNaN(el.innerHTML)? this.getInt($(el).attr('class')):this.getInt(el.innerHTML);
//                if (n.indexOf(c) > -1) {
//                    this.get(el).removeClass(this.focusCss).removeClass(this.killCss);
//                }
//            }, this);
//            this.change();
//        },
        killCode: function (el){
            this.get(el).removeClass(this.focusCss).addClass(this.killCss);
            this.change();  
        },
        clearCode: function (hasKill){//清空, 是否包含killCss
            this.items.each(function (el){
                this.need(el).removeClass(this.focusCss);
                if (hasKill && this.hasKill) {
                    this.need(el).removeClass(this.killCss);
                }
            }, this);
            this.change(null);
//            this.danmaonchange(null);
        },
        danmaonchange: function(){
        	var p = this;
            var rn = p.getIni()[2] - 1;//必选个数
            var x = 0;
            var xb;
            this.dan_data = [];
            this.tuo_data = [];
        	this.danmas.each(function(el,i){
	            if(el.checked) {
	            	x++;
	            	this.dan_data.push(this.getInt(el.value));
	            }
        	}, this);
        	
            if(x<rn){
//                this.items.each(function (el,i){
//                	xb = p.getdanma(isNaN(el.innerHTML)? this.getInt($(el).attr('class')):this.getInt($(el).attr('bet')));
//                    if (this.hasClass(el, this.focusCss)) {
//                    	xb.disabled=false;
//                    	if(!xb.checked) this.tuo_data.push(this.getInt($(el).attr('bet')));
//                    }else{
//                    	xb.disabled=true;
//                    	xb.checked=false;
//                    }
//                }, this); 	
            }else{
//                this.items.each(function (el,i){
////                	isNaN(a))
//                	xb = p.getdanma(isNaN(el.innerHTML)? this.getInt($(el).attr('class')):this.getInt($(el).attr('bet')));
//                    if (this.hasClass(el, this.focusCss)) {
//                    	if(!xb.checked){ 
//                    		xb.disabled=true;
//                    		this.tuo_data.push(this.getInt($(el).attr('bet')));
//                    	}
//                    }else{
//                    	xb.disabled=true;
//                    	xb.checked=false;
//                    }
//                }, this); 
            }
            this.onchange();
        },
        getdanma: function(n){
        	var d;
        	this.danmas.each(function(el){
        		 if(el.value==n){
        			 d = el;
        		 }
        	}, this);
        	return d;
        },
        danmadisplay: function(){
        	var pid = this.getPlayId();
        	if(Class.C('lot_id')=='05'){
        		if(pid==254 || pid==255){
        			this.setdan.show();
            		this.setdan_i.show();      		
                	this.danma.hide();
//                	this.setdan_i.removeClass("").addClass("");
                	this.danmas.each(function(el){el.checked=false;}, this);
            	}else{
            		this.setdan.hide();
            		this.setdan_i.hide();
            		this.danma.hide();
            		this.danmas.each(function(el){el.checked=false;el.disabled=true;}, this);
            	}
        	}else{
        		if(pid==244){
            		this.setdan.hide();
            		this.setdan_i.hide();
            		this.danma.hide();
            		this.danmas.each(function(el){el.checked=false;el.disabled=true;}, this);
            	}else{
            		this.setdan.show();
            		this.setdan_i.show();      		
                	this.danma.hide();
//                	this.setdan_i.removeClass("cm_11ydj_arrow").addClass("cm_11ydj_arrow_hover");
                	this.danmas.each(function(el){el.checked=false;}, this);
            	}
        	}
        }
    });
    
    Class('Choose2', {
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
                            o.removeClass(Y.killCss);
                        }else{
                            o.addClass(Y.focusCss);
                        }
                    }else{
                        o.toggleClass(Y.focusCss);
                    }            
                    Y.change(this);                
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
                this.group = this.get(config.group);
                
                this.group.each(function (b, i){
                    this.need(b).mousedown(function (e, Y){
                        Y.batSelect(this.innerHTML.replace(/<[^>]+>/g,'').trim(),this);
                    });
                   
                }, this);
            }
            
            if (!isNaN(config.startNum)) {//有些彩种从0开始
                this.startNum = config.startNum;
            }
        },
        change: function (){//变化时收集选与杀数组
            this.data = [];
            this.killData = [];
            this.items.each(function (el){//统计选中数
                if (this.hasClass(el, this.focusCss)) {
                    this.data.push(this.getInt($(el).attr('bet')));//选中组
                }else if(this.hasKill && this.hasClass(el, this.killCss)){
                    this.killData.push(this.getInt($(el).attr('bet')));//杀号组
                }
            }, this);
            this.onchange();
        },
        importCode: function (num){//导入号码
            num = typeof num == 'string' ? num.split(',') : num instanceof Array ? num : [];
            num.each(function (i, j){
                var index, ball;
                index = this.getInt(i- this.startNum).range(0,1/0);
                if (ball = this.items.nodes[index]) {
                    this.addClass(ball, this.focusCss);
                }
            }, this);
            this.change(null);
        },
        random: function (n, kill){// (6), 随机生成号码
            var n, l, rndCode;
            l = this.items.size();
            n = (~~n).range(1, l);
            this.clearCode();//清除胆码
            kill = kill || this.killData;
            rndCode = this.repeat(l, 1).remove(kill).random(-n);
            this.importCode(rndCode);//在剩余的号码中打乱后选出n个
        },
        batSelect: function (type,el){//按特征组选号
            var cmd, fn;
            odd = this.startNum == 0 ? [0, 1] : [1, 0];
            switch(type){
            case '全选': 
                cmd = 'return true';
                break;
            default:// 清
                cmd = 'return false';
            }
            fn = new Function('n', cmd);
            this.items.each(function (el, i){
                if (fn(i+1)) {
                    this.need(el).addClass(this.focusCss);
                }else{
                    this.need(el).removeClass(this.focusCss);
                }
            }, this);
            if(type=="全选"){
            	el.innerHTML = "全清";
            }else if(type=="全清"){
            	el.innerHTML = "全选";
            }else if(type="机选"){
                pid = this.getPlayId();
                rn = this.getIni()[2];//必选个数
                this.random(rn, '');
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
            this.change();        
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
    
   //动态限号
    
    Class('Dynamiclimit', {
        index:function (ini){
        	$.ajax({//先检查游戏有没有限号 木有限号 隐藏限号列表
				url:"/data/info/limitcode.xml",
				dataType : "xml",
				success : function(xml) {
					var R = $(xml).find("xml");
					var r = R.find("node");
					var ishave = "";
					r.each(function(){
						var gid = $(this).attr("gid");
						if(gid == Class.C('lot_id')){
							ishave = "have";
							return false;
						}else{
							ishave = "";
						}
					});
					if( ishave!=""){
						$(ini.items).show();
					}else{
						$(ini.items).hide();
					}
				},
				error : function() {
					return false;
				}
			});
            var delayTime = [];
            $(ini.items).each(function(index) {
                $(this).hover(function() {
                    delayTime[index] = setTimeout(function() {
        				$(ini.tip).show();
        				$.ajax({
        					url:"/data/info/limitcode.xml",
        					dataType : "xml",
        					success : function(xml) {
    							var R = $(xml).find("xml");
    							var r = R.find("node");
        						var limitcodelist = "";
        						limitcodelist +="<ul>";
    							limitcodelist +="<li><em class=\"cm_red\">限制号码</em><i>玩法</i></li>";
    							var json = {"1":"一星直选",//20时时彩
										"2":"二星直选",
										"3":"三星直选",
										"4":"四星直选",
										"5":"五星直选",
										"6":"二星组合",
										"7":"三星组合",
										"8":"四星组合",
										"9":"五星组合",
										"10":"二星组选",
										"11":"大小单双",
										"12":"五星通选",
										"13":"任选一",
										"14":"任选二",
										"15":"三星组三",
										"16":"三星组六"};
    							var json1 = {"01":"前一直选",//11选5类型
										"02":"任选二",
										"03":"任选三",
										"04":"任选四",
										"05":"任选五",
										"06":"任选六",
										"07":"任选七",
										"08":"任选八",
										"09":"前二直选",
										"10":"前三直选",
										"11":"前二组选",
										"12":"前三组选"};
    							var json2 ={"1":"五星直选",   //04时时彩   
    									//	"2":"四星",
    										"3":"三星直选",
    										"4":"两星直选",
    										"5":"一星直选",
    										"6":"大小单双",
    										"7":"二星组选",
    								//		"8":"四星组合",
    									//	"9":"五星组合",
    									//	"10":"二星组选",
    								//		"11":"大小单双",
    										"12":"五星通选"
    									//	"13":"五星复选",
    							};
    							// 快三暂无
    							var ccode = "暂无限制号码";
    							var pplay = "- -";
        						r.each(function(){
        							var gid = $(this).attr("gid");
        							var playid= $(this).attr("playid");
        							var code = $(this).attr("code");
        							
        							if(Class.C('lot_id') == '05'){//快三
        								
        								if(gid == Class.C('lot_id')){
        								if(code.indexOf(";")!=-1){
    										var d = code.split(";");
    										for(var i=0; i<d.length; i++){
    											ccode = d[i];
    											limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    										}
    									}else{
    										ccode = code;
    										limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    									}
        								}else{
            								//limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
            							}
        							}else if(Class.C('lot_id') == '20'){//时时彩型  gid == Class.C('lot_id')=='04'
        								if(gid == Class.C('lot_id')){
        								pplay = json[playid];
        								if(code.indexOf(";")!=-1){
    										var d = code.split(";");
    										for(var i=0; i<d.length; i++){
    											ccode = d[i];
    											limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    										}
    									}else{
    										ccode = code;
    										limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    									}
        								}
        								else{
            							//	limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
            							}
        							}else if(Class.C('lot_id') =='04'){//时时彩型  
        								if(gid == Class.C('lot_id')){
        								pplay = json2[playid];
        								if(code.indexOf(";")!=-1){
    										var d = code.split(";");
    										for(var i=0; i<d.length; i++){
    											ccode = d[i];
    											limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    										}
    									}else{
    										ccode = code;
    										limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    									}
        								}
        								else{
            								//limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
            							}
        							}else{//11x5型
        								if(gid == Class.C('lot_id')){
        								pplay = json1[playid];
        								if(code.indexOf(";")!=-1){
    										var d = code.split(";");
    										for(var i=0; i<d.length; i++){
    											ccode = d[i];
    											limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    										}
    									}else{
    										ccode = code;
    										limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
    									}
        							}
    								else{
        								//limitcodelist +="<li><em class=\"cm_red\">"+ ccode + "</em><i>"+ pplay + "</i></li>";
        							}
       								}
        							
        						});
        						limitcodelist +="<li><em class=\"cm_red\">"+(ccode == "暂无限制号码"?'暂无限制号码':' ')+"</em><i>"+(pplay == "- -"?'- -':' ')+"</i></li>";
        						limitcodelist +="</ul>";
        						$(ini.tip).html(limitcodelist);
        					},
        					error : function() {
        						return false;
        					}
        				});
                    },
                    300);
                },
                function() {
                    clearTimeout(delayTime[index]);
                    $(ini.tip).hide(); 
                });
            });
}
    });
})()
