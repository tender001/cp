(function (Class){
    var Copy, MaskStyle;
    Copy = Array.prototype.slice;
// 透明遮罩
    Class('Mask', {
        single: true,
		style: '@/lib/mask/mask.css',

        index: function(opacity, color) {
            this.panel = this.createNode('DIV', document.body).addClass("yclass_mask_panel");
            this.panel.attr('tabIndex','-1');
            if (opacity) {
                this.panel.fade(opacity)
            }
            if (color) {
                this.panel.setStyle('backgroundColor', color)
            }
            this.layList = [];
            this.panel.click(function (e,Y){
                Y.onclick()
            });
            this.addNoop('onshow,onhide,onclick').bindUnload(this.panel)
        },
        show: function(lay) {
            this.error('Mask.show('+lay+'):\u5fc5\u987b\u6307\u5b9a\u4e00\u4e2a\u53c2\u7167\u5c42', !lay);
            this.panel.show();
            this.isshow = true;
            this.panel.one().focus();
            if (this.ie==6) {
                this.get(document.body).addClass('ie6_mask_hide_select')
            }
            this.currentLay = lay = this.one(lay);
            if (this.layList.indexOf(lay)==-1) {
                this.layList.push(lay);
            }
            this.panel.setStyle('zIndex', this.get(lay).getStyle('zIndex') - 1);
            this.onshow(lay);
            return this
        },
        hide: function(time) {
            this.isshow = false;
            this.layList.pop();
            if (this.layList.length) {
                this.show(this.layList[this.layList.length-1])//move to last element
            }else{
                if (this.ie==6) {
                    this.get(document.body).removeClass('ie6_mask_hide_select')
                }
                time ? this.panel.fadeTo(0, function() {
                    this.panel.hide().fade(.3)
                }, time) : this.panel.hide();
                this.currentLay = false;
                this.onhide()            
            }
            return this
        }
    });
//拖动
	Class('Drag', {
		index:function (ini){
			this.drager = this.need(ini.drager).slice(-1);
			if (!this.drager.data('hasdrag')) {
				this.panel = ini.panel ? this.need(ini.panel) : this.drager;
				this.drager.setStyle('zoom:1');
				this.disabled = ini.disabled;
				this.addNoop('ondragstart,ondragend,oninit,onend,ondrag');
                this.oldCursor = this.drager.getStyle('cursor');
                this.drager.setStyle('cursor', 'move');
                this.hasProxy = ini.proxy!==false;
				this.drager.mousedown(function (e, ns){
					var pos, exit, d;
					pos=ns.panel.getXY();
					ns.begin = ns.getObj('x', e.clientX, 'y', e.clientY, 'left', pos.x, 'top', pos.y);
					ns.panel.setTopmost(5);
					ns.panel.ondragstart = ns.drager.ondragstart = ns.getNoop();
					exit=ns.dragEnd.proxy(ns);
					d = ns.get(document);
					d.mousemove(ns.draging.proxy(ns)).losecapture(exit).blur(exit).mouseup(exit);
					ns.drager.one().setCapture ? ns.drager.one().setCapture() : 0;
					e.end()        
				})
				this.drager.data('hasdrag', true)
			}
		},
		draging:function (e){
            if (this.hasProxy && !this.proxy) {
                this.createProxy(this.begin)
            }
            var el = this.proxy || this.panel;
			this.disabled != 'x' ? el.setStyle('left:'+ (this.begin.left + e.clientX - this.begin.x)  + 'px') : 0;
			this.disabled != 'y' ? el.setStyle('top:' + (this.begin.top + e.clientY - this.begin.y) + 'px') : 0;
			this.clearRange()
		},
        createProxy: function (d){//创建一个代理框架
            var size = this.panel.getSize();
            this.proxy = this.createNode('DIV', document.body).setStyle({
                position: 'absolute',
                zIndex: this.panel.getStyle('zIndex')+5,
                border: '1px dotted #6A3620',
                width: size.offsetWidth +'px',
                height: size.offsetHeight+'px',
                left: d.left+'px',
                top: d.top+'px'
            })
        },
		dragEnd:function (e){
			var a, b, pos, size;
            if (this.proxy) {
                this.panel.setXY(this.proxy.getXY())
                this.proxy.empty(true);
                this.proxy = false
            }
			pos = this.panel.getXY();
            size = this.getSize();
			this.get(document).un('mousemove').un('losecapture').un('blur').un('mouseup');
			this.drager.one().releaseCapture ? this.drager.one().releaseCapture() : 0;
			a = pos.x<size.scrollLeft;
			b = pos.y<size.scrollTop;
			if (a || b) {
			    this.fx(function (f){
			        this.panel.setStyle((a ? ('left:'+f(pos.x, size.scrollLeft)+'px;') : '') + (b ? ('top:'+f(pos.y, size.scrollTop)+'px;') : ''))
			    },{time:320})
			}
		}    
	});
//快速应用
	Yobj.fn.drag = function (panel){
		this.ns.lib.Drag({
			drager: this,
			panel: panel
		})
	};
//消息层
    Class('MaskLay', {
        index:function (panel,type){
            this.addNoop('onpop,onclose,onchange');
            this.mask = this.lib.Mask(.2);
            this.closeUI = this.get();
            if (panel) {// import panel
                this._setPanel.apply(this, arguments)
            }else{// create panel and content
            	if(type == 1001){
            		this.panel = this.createNode('DIV', document.body);
                    this.content = this.createNode('DIV', this.panel);
                    this.panel.setStyle('position:absolute;z-index:500000;left:-99999px');
                    this.content.setStyle('min-width:120px;_width:120px;text-align:center;font: 12px/1.5 verdana;color:#333;');
                    this.proxyTitle =  this.createNode('DIV', this.panel);
                    this.proxyTitle.setStyle('position:absolute;left:123pt;top:7pt;display:none;z-index:9;width:375px;height:37px;background:#eee;'+
                    'filter:progid:DXImageTransform.Microsoft.Alpha(opacity=1);opacity:0;cursor:move');
            	}else{
            		 this.panel = this.createNode('DIV', document.body);
                     this.content = this.createNode('DIV', this.panel);
                     this.panel.setStyle('position:absolute;z-index:500000;left:-99999px');
                     this.content.setStyle('min-width:120px;_width:120px;text-align:center;font: 12px/1.5 verdana;color:#333;');
                     this.proxyTitle =  this.createNode('DIV', this.panel);
                     this.proxyTitle.setStyle('position:absolute;left:0;top:0;display:none;z-index:9;width:88%;height:30px;background:#eee;'+
                         'filter:progid:DXImageTransform.Microsoft.Alpha(opacity=1);opacity:0;cursor:move');
            	}
            };
        },
        _setPanel: function (panel, content, title){
           this.clearEvents();
           this.panel = this.need(panel);
           if (this.ie < 7) {
               this.get('select', this.panel).addClass('ie6_mask_nohide_select');
           }           
           this.content = this.get(content);
           this.title = this.get(title);
           this.panel.setStyle('position:absolute');
           return this
        },
        html:function (html){
           this.content.html(html).setStyle('padding:5px 10px;width:0;height:0').setCenter();
           this.iframe = null;
           this.onchange(); 
           return this
        },
        addClose: function (){// addClose('#google','#baidu ul',node)
            return Copy.call(arguments).each(function (selector){
                var o = this.get(selector);
                this.closeUI.nodes.push.apply(this.closeUI.nodes, o.nodes);
                o.mousedown(function (e, Y){
                    e.end();
                    e.stop();
                    return false
                });
                
                o.click(_close)
            }, this);
             function _close(e, Y){
                Y.close(e, this);
                e.end();
                e.stop();
                return false                 
             }
        },
        open: function (url, ini){// show iframe
            var w, h, scroll, guid;
            ini = Object(ini);
            w = parseInt(ini.width) || 600;
            h = parseInt(ini.height) || 400;
            scroll = ini.scroll ? 'yes' : 'no';
            guid = 'yclassIframe'+(+new Date);
            this.content.setStyle('padding: 0').html('<iframe id="'+guid+'" src="about:blank" allowTransparency="true" frameborder="no" scrolling="'+
                scroll+'" style="width:'+w+'px;height:'+h+'px"></iframe>');
            this.iframe = document.getElementById(guid);
            this.iframe.src = url;
            this.content.setStyle({
                width: w+'px',
                height: h+'px'
            });
            if (ini.showMove && this.proxyTitle) {
            	if (ini.flag == 'f1001'){this.proxyTitle.show().one();}
            	else
                 this.proxyTitle.show().one().style.width = (this.panel.one().offsetWidth - (this.proxyTitle.offset || 60)) + 'px';
            }
            return this.pop()
        },
        pop: function (html, fn, _ishideClose){
            if (this.isshow) {
                this.close({},{}) 
            }
            this.isshow = true;
            if (html) {
                this.content.html( html);
                this.onchange()
            }
            this.panel.show().setTopmost().setCenter(false, this.absMid);
            if (_ishideClose) {
                this.closeUI.hide()
            }
            if (!this.noMask) {
                this.mask.show(this.panel.nodes[0]);
            }            
            this.oldonclose = this.onclose;
            this.onclose = this.aop(function (){
                this.onclose = this.oldonclose;
                if (_ishideClose) {
                    this.closeUI.show();
                }                
            }, this.onclose, fn)
            this.onpop()
        },        
        close: function (e, sender){
             if (this.iframe) {
                 this.iframe.src = 'about:blank';// ie6 bug
                 this.content.html('');
                 this.iframe = false
             }
            this.panel.setStyle('left:-99999px');
            if (!this.noMask) {
                 this.mask.hide(this.closeTime);                
            }
            this.isshow = false;
            this.onclose(e, sender);
        }
    });
//消息气泡
	Class('NotifyIcon', {
		single: true,
	    index:function (){
            var Y = this;
            this._isshow;
			this.panel = this.get('<div class="notifyicon tip-2"><div class="notifyicon_content"></div><div class="notifyicon_arrow">'+
				'<s></s><em></em></div><div class="notifyicon_space"></div></div>').insert();
            this.content = this.panel.find('.notifyicon_content');
            this.arrow = this.panel.find('.notifyicon_arrow');
            this.space = this.panel.find('.notifyicon_space');
			this.panel.hover(function (e, own){
			    clearTimeout(own.tipTimer);
			},function (e, own){
			    own.hide()
			}).click(function (e){
                e.stop()
            });
            this.mask = this.lib.SelectMask();// 为ie6准备一个mask
            this.get(document).click(function (e){
                if (Y._isshow && (!Y.currentTarget|| !Y.currentTarget.contains(e.target))) {//点击触发者不消失
                    Y.panel.setStyle('left:-9999px');
                    Y.mask.hide(Y.panel)                    
                }
            })
	    },
		setIco: function (n){//对内容中的h5设置图标，请在show后调用
		   var h5;
		   n = n >>>0;
		   if (h5 = this.panel.find('h5')) {
		       h5.setStyle('background-position:0 -' + (n*48) + 'px');
		   }
		   return this
		},
		show: function (target, html, time){
			var d, pt, own;
            own = this;
            this._isshow = true;
			clearTimeout(this.tipTimer);
			d = this.need(target);
            this.currentTarget = d.one();
			this.panel.setStyle('width:auto;overflow:visible');
			if (html) {
			    this.content.html(html)
			}
            if (this.panel.one().offsetWidth > 320) {
                this.panel.setStyle({
                    width: '320px',
                    overflow: 'hidden'
                })   
            }
			pt = this.getTipXY(target, this.panel);
			this.moveArrow(pt.z);
            setTimeout(function() {// 异步显示, 避免冒泡到doc又隐藏
                own.panel.setXY(pt);
                own.mask.show(own.content)// 避免IE6穿透
            },10);		    
            if (this.isNumber(time)) {// 如果有时间指定, 则在时间后消失
                this.tipTimer = setTimeout(function() {
                    own.hide()
                }, time);                
            }
			return this
		},
		hide: function (){
			var own = this;
            this.currentTarget = null;
            this._isshow = false;
			this.tipTimer = setTimeout(function() {
			    own.panel.setStyle('left:-9999px');
                own.mask.hide(own.content)
			},100)		   
		},
		moveArrow: function (d){//变换箭头与上下位置
			var p = d > 2 ? 0 : -1;
			this.panel.one().className = 'notifyicon tip-'+d;
			this.arrow.insert(this.panel,p);
		    this.space.insert(this.panel,p)	
		},
		getTipXY:function (target, tip){
			var body, src, msg, x, y, r, b, fix;
			body = this.getRect();
			src = this.getRect(target);
			msg = this.getRect(tip);
            fix = src.width < 40 ? (20 - src.width/2) : 0;
			r = src.x > body.x + body.width/2;
			b = src.y - msg.height < body.y;
			x = r ? (src.x - (msg.width - src.width) + fix) : (src.x - fix);
			y = b ? src.y + src.height : src.y - msg.height;
			return this.Point(x, y,  r && b ? 4 : (r ? 1 : (b ? 3 : 2)))// z: 1 tl 2 tr 3 br 4 bl
		}
	});

    Class.extend('getTip', function (){
        return this.lib.NotifyIcon()
    });
	/*
	YNode 扩展:
	根据指定属性显示一个消息气泡
	*/
    Yobj.fn.tip = function (attr, ico, html){
        var tip = this.ns.getTip();
        return  this.hover(show,function (){
            tip.hide()
        });
        function show(e, Y){
            var content = attr ? this.getAttribute(attr) : Y.parseVal(html)
			clearTimeout(tip.tipTimer);
            if (content) {
                tip.show(this, content).setIco(ico);        
            }            
        }
    };
	Class.extend('getMenuXY', function(button, menu, fixed, align){
		var body, btn, list, x, y, r, b;
		body = this.getRect();
		btn = this.getRect(button);
		list = this.getRect(menu);
		r = btn.x + list.width > body.x + body.width;// ->
		b = btn.y + btn.height + list.height > body.y + body.height;// v
		x = (align == 'right' || !fixed && r) ? btn.x - (list.width - btn.width) : btn.x;
		y = !fixed && b ? btn.y - list.height : btn.y + btn.height ;
		return this.Point(Math.round(x), Math.round(y), fixed ? 3 :( r && b ? 1 : (r ? 4 : (b ? 2 : 3))))// z: 1 tl 2 tr 3 br 4 bl
	});
//菜单或者下拉层
	Yobj.fn.drop = function (menu, ini){
		//{focusCss: hotCss, isclick:mode, autohide: bool,x: offsetX, y:offsetY, 
        //fixed: isFitWindow, onshow:event, onhide: event, align: 'left right'}
		var timers, ns, menus, _mask, align;
		timers = {};
		ns = this.ns;
		ini = Object(ini);
		_mask = ns.lib.SelectMask();// 为ie6准备一个mask
		this.ns.addNoop.call(ini, 'onshow,onhide,onshowbefore');// add event
		menus = this.get(menu);
		this.each(function (btn, i){
			var _m;
			if (_m = menus.nodes[i]) {
                this.attr(_m, '_is_drop_hide', true);
				if (ini.isclick) {// click
					this.get(btn).mousedown(function (e, ns){
						show(e, ns, btn, _m)
					}).get(document).mousedown(function (e, ns){
						if(_m.style.display !== 'none'){
							_m.contains(e.target) || btn.contains(e.target) ? null:  hide(e, ns, btn, _m, true)// hide							
					  }
					})
				}else{//hover
					this.get(btn).hover(function (e, ns){
                        show(e, ns, btn, _m)
					},function (e, ns){
					    hide(e, ns, btn, _m)
					});
                    if (!btn.contains(_m)) {//if menu is btn child
                        this.get(_m).hover(clear,function (e, ns){
                            hide(e, ns, btn, _m)
                        })                   
                    }
                     this.get(_m).click(function (e, ns){
                        ini.autohide ? hide(e, ns, btn, _m) : 0
                    })     
				}				    
			}    
		}, this.ns);
		function show(e, ns, btn, menu){// pop menu
			var pos, eqx, eqy;
			clear.call(menu, e, ns);
            if (ns.attr(menu, '_is_drop_hide')) {
                ns.attr(menu, '_is_drop_hide', false);//避免在按钮与菜单间移动显隐
                for(var k in timers){
                    clearTimeout(timers[k].id);
                    timers[k].fn()//快速执行延迟的函数, 避免多菜单切换时的拖影
                }
                timers = {};
                ini.focusCss && ns.get(btn).addClass(ini.focusCss);
                ini.onshowbefore.call(ns, menu, btn, _mask);
                ns.get(menu).show();
                pos = ns.getMenuXY(btn, menu, ini.fixed, ini.align);
                eqx = pos.z == 1 || pos.z == 4 ? -1 : 1;
                eqy = pos.z > 2 ? 1 : -1;
                pos = pos.offset(ini.x*eqx, ini.y*eqy);
                ns.get(menu).setXY(pos);
                _mask.show(menu);//ie6 添加mask
                ini.onshow.call(ns, menu, btn, _mask)
            }
		}
		function clear(e, ns){
			var d, id;
			id = ns.getGuid(this);
			if (d = timers[id]) {
			    clearTimeout(d.id);
				delete timers[id]
			}
		} 
		function hide(e, ns, btn, menu, t){// delay hide menu
            ns.endFx();
			t ? fn() : timeout(fn, ns.getGuid(menu));
			function fn(){
			    ini.focusCss && ns.get(btn).removeClass(ini.focusCss);
				_mask.hide(menu);
				ini.onhide.call(ns, menu, btn) === true ? 0 : ns.get(menu).hide();
                ns.attr(menu, '_is_drop_hide', true);
			}
		}
		function timeout(fn, guid){
		    timers[guid] = {
				id: setTimeout(fn, 48),
				fn: fn
			}			
		}
	};
    //滑动效果
    Yobj.fn.slideDrop = function (a, b){
        var ini = {
            onshowbefore: function (x){
                 x.style.height = '0px';
            },
            onshow: function (x, btn, _mask){
                var size = this.get(x).data('menu-size');
                if (!size) {
                    size = this.getRect(x, true);
                    this.get(x).data('menu-size', size);
                }
                this.fx(function (f){
                    x.style.height = f(0, size.height)+'px';
                    _mask.show(x);
                    x.scrollTop = 9999;
                }, {time: 320, mx: this.getGuid(x)});
            },
            fixed: true,
            autohide: true
        }
        for(var k in b){
            if ((k in ini) && typeof b[k] == 'function') {
                ini[k] = Yobj.aop(ini[k], b[k])
            }else{
                ini[k] = b[k]
            }
        }
        return this.drop(a, Yobj.mix(ini))
    };
    //淡入效果
    Yobj.fn.fadeDrop = function (a, b){
        return this.drop(a, Yobj.mix({
            onshowbefore: function (x){
                 this.get(x).fade(0)
            },
            onshow: function (x){
                var size = this.getRect(x, true);
                this.get(x).fadeTo(1, false, 640)
            }
        }, b))
    };
//创建一个iframe用来盖住ie6的select
	Class('SelectMask', {
		single: true,
	    index:function (){
			if(!this.ie || this.ie > 6){
                return this.show = this.hide = this.getNoop();
			}
	        this.iframe = this.get('<iframe style="position:absolute;left:-9999px;" frameborder="0" '+
				'src="about:blank" scrolling="no"></iframe>').insert();
	    },
		show: function (binder, z, w, h){// binder, z, offset-w, offset-h
		    binder = this.get(binder);
            var rect = this.getRect(binder);
            this.bindGuid = this.getGuid(binder);
            z = z || this.getInt(binder.getStyle('zIndex', 1))-1;
            this.iframe.insert(binder.one().parentNode);
			this.iframe.setStyle({
				width: rect.width + (~~w) + 'px',
				height: rect.height + (~~h) + 'px',
				zIndex: z
			}).setXY({
				x: rect.x,
				y: rect.y         
            });
		},
		hide: function (binder){
            if (this.bindGuid === this.getGuid(binder)) {
                this.iframe.setStyle('left:-9999px')//只有显示者才关闭
            }		    
		}
	});

	/*
	自动完成类
	由一个文本框和一个动态创建的DIV的A列表构成
	用户使用onchange来请求和填充列表
	使用onenter来响应回车
	在onchange中自行使用Ajax或者现有的数据转换为匹配的数
    var x=new Y.lib.AutoCompleteInput({
        input:'#xxx'
    });
    var data = 'gogole,baidu,qq,163,foxmail,162,159,easy'.split(',').map(function (x){
        return '{1}@'+x+'.com'
    });
    x.onchange=function (xx){
        if (xx && (xx+'').indexOf('@')==-1) {
            this.html(data.map(function (el, i){
                return el.format(xx)
            }))
        }  
    }
    x.onenter = function (){
       alert(this.input.val());
    }
	*/
	Class('AutoCompleteInput',{
	    index:function (ini){
	        this.input = this.need(ini.input);
			this._lastVal = '';
			this.input.val('');
			this.input.attr('autocomplete', 'off');
			this.input.one().blur();
			this.dropList = this._createDrop();
			this._ishide = true;
			this._ishover = false;
			this.mask = this.lib.SelectMask();// 为ie6准备一个mask
			this.addNoop('onchange,onenter');
			this.input.focus(function (e, ns){
			    ns._listenInput()
			}).blur(function (e, ns){
			    clearInterval(ns.checkTimer);
				if (!ns._ishover) {
				    ns.hide()//列表点击时会先发生blur，造成点击事件没有完成。
				}				
			}).keydown(function (e, ns){
				var key = e.keyCode;
				if (key == 13) {//回车
			        ns.hide();
					return ns.onenter()				    
				}else if (key == 27) {//Esc
				    return ns.hide()
				}else if(!ns._ishide){
					if (key == 38) {//上移
					    return ns._moveChoose(-1)
					}else if(key == 40){//下移
					    return ns._moveChoose(1)
					}
				}
			});
			this.dropList.hover(function (e, ns){
			    ns._ishover = true// 标记悬浮
			},function (e, ns){
			    ns._ishover = false
			}).live('div', 'click', function (e, ns){// 代理内部选项事件
				ns._lastVal = this.getAttribute('rel');
			    ns.input.val(ns._lastVal);
				ns.hide();
				ns.onenter()
				e.end();
				return false
			}).live('div', 'mouseover', function (e, ns){
			    ns._moveChoose(this, true)
			})
	    },
		_createDrop: function (){
		    return this.createNode('DIV', document.body).addClass('yclass_auto_complete_list')
				.setStyle('width:'+(this.input.one().offsetWidth -2)+'px')
		},
		_listenInput: function (){
			var own = this;
			this.checkTimer = setInterval(function() {
			    own._check()
			},72);  
		},
		_check: function (){
			var val = this.input.val().trim();
		    if (val !== this._lastVal) {
		        this._lastVal = val;
				if (val == '') {
				    this.hide()
				}
				this.onchange(val)
		    }
		},
		show: function (){
			this._ishide = false;
		    this.dropList.setXY(this.input.getXY().offset(0, this.input.one().offsetHeight-1));
			this.mask.show(this.dropList)
		},
		hide: function (){
			this.dropList.setStyle('left:-9999px');
			this._ishide = true
			this.mask.hide(this.dropList);
		},
		html: function (data){//数据必须是数组，转换为等量的div
			var val, bold, html;
			html = [];
			this._lastFocus = null;
			if (this.isArray(data)) {
				val = this.input.val();
				bold = new RegExp('(^'+val+')(.*)$');
				html[0] = '<div style="display:none" rel = "' + val + '">' + val + '</div>';//默认隐藏原始项
			    data.each(function (item, i){
			        html[i+1] = '<div rel = "' + item + '">'+item.replace(bold,'$1<strong>$2</strong>')+'</div>'//对补全部分加粗
			    })
			}
			if (html.length == 0) {
			    this.hide()
			}else{
			    this.dropList.html(html.join(''));
				this.show()
			}
			return this
		},
		_moveChoose: function (d, isobj){
			var last, dir, sibling, txt;
		    if (last = this._lastFocus) {
		        this.get(last).removeClass('yclass_auto_complete_list_focus')
			}
			if (isobj) {//光标移动时选中
			    this._lastFocus = d
			}else{//键盘移动选中
				dir = d < 0 ? 'prev' : 'next';
				if (last) {
					sibling = this.get(last)[dir]().one();
					this._lastFocus = isobj ? d : (sibling ? sibling : this.dropList.find('div').one(d < 0 ? -3 : 0))
				}else{
					this._lastFocus = this.dropList.find('div').one(1)//移动到隐藏的那个原始的项上    
				}			    
			}
			if (this._lastFocus) {
			    this.get(this._lastFocus).addClass('yclass_auto_complete_list_focus');
				if (!isobj) {// 如果是键盘移动项则修改input文本
					txt = this._lastFocus.getAttribute('rel');
					this.input.val(txt);
					this._lastVal = txt				    
				}
			}		    
		}
	});
})(yclass);