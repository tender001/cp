(function (Class){
	var _TabButtons, _TabContent;// 局部类
	/*
	@ Class > _TabButtons
	*/
	_TabButtons = Class({// 单选
		index:function (config){
			/*
				config = {
					items: selector,
					prevButton: selector,
					nextButton: selector,
					repeat: bool,//是否无缝循环
					noNav: true,//是否是连续切换, 相对于没有上下按扭的场合，如自动滚动的文字
					count: int,//必须有count设置
					focusCss: css,
					blurCss: css,
					timeout: time,
					createItems: fn
				}
			*/
			var isDelay, type;
            this.Type = '_TabButtons';
			this.mix(this, config, true, 'items,focusCss,blurCss,delay,createItems,prevButton,nextButton,count,noNav,allowLink');
			isDelay = !isNaN(config.delay);
			type = isNaN(config.delay) ? 'mousedown' : 'mouseenter'
			this.current = 0;
			this.addNoop('onchange');
			if (isDelay) {// is hover
				this.doSelect = this.delay > 16 ? this.doSelect.slow(this.delay) : this.doSelect// 慢选
			}    
			if (this.nextButton || this.prevButton || this.noNav) {//使用上一下/下一个按扭方式
				this.get(this.prevButton)[type](this.selectPrev.proxy(this));
				this.get(this.nextButton)[type](this.selectNext.proxy(this));
			}
            if('items' in this){
				this.items = this.createItems ? this.createItems() : this.get(this.items);// create or find
				this.count = this.items.size();
				this.error('this.items is empty(from"' + config.items + '")', this.count == 0);
				this.items.each(function (item, i){// find current
                    var n = this.get(item);
					n.data('switch.index', i);
					if (this.focusCss && this.hasClass(item, this.focusCss)) {
						this.current = i
					}
				}, this);
				this.items[type](function (e, self){
                    self.select(self.get(this).data('switch.index'))
                });
				if (!isDelay && !this.allowLink) {// 防止链接跳走, allowLink = true 时允许链接跳转[做iframe跳转场合]
					this.items.click(function (e){
						e.end();
						e.stop();
                        this.blur && this.blur();
						return false
					})		    
				}
			}
		},
		select: function (n, isFire){// fix current;
			n = (~~n).range(this.count - 1);// limit
			return this.doSelect(n, isFire)
		},
		selectNext: function (){// for auto play
			var next = this.current + 1;
			return this.select(next > this.count - 1 ? 0 : next)
		},
		selectPrev: function (){// for auto play
			var prev = this.current - 1;
			return this.select(prev < 0 ? this.count - 1 : prev)
		},
		doSelect: function (n, isFire){//set cur-prev/ set items css/ set prevBtn-nextBtn css
			var prev, current, btn;
            prev = this.current;// prev
            if (this.items) {// nav css
                btn = this.get(this.items.nodes[n]);// cur
                current = this.current = btn.data('switch.index');
                this.get(this.items.nodes[prev]).swapClass(this.focusCss, this.blurCss);
                btn.swapClass(this.blurCss, this.focusCss);
                btn.find(':radio').prop('checked', true);                
            }else{
                this.current = current = n;
            }
			this.onchange(prev, current, isFire);//是否非用户触发
			return false
		}
	});
	/*
	@ Class > _TabContent
	在指定的节点集中按索引查找两个节点
	隐藏一个，显示下一个
	直接显隐效果
	*/
	_TabContent = Class({// 单显
		index:function (config){
			/*
				config = {
					contents : selector
				}
			*/
			this.items = this.get(config.contents);
		},
		show: function (a, b){
			var c, d;
			c = this.items.nodes[a];
			d = this.items.nodes[b];
			if (c && d) {
				this.doShow(c, d, a, b)
			}
		},
		doShow: function (a, b, c, d){
//			this.get(a).hide();
//            this.get(b).show()     
			$(a).hide();
            $(b).show()    
		}
	});
	/*
	@ Class > Tabs
	由一个单选器与一个单显器组合而成, 配置对象是它们的并集
	HTML规范:
		1、有一个内容容器，一个导航条容器。
		2、导航条可以省去，当在noNav模式或者有next/prev按钮的时候。
	*/
	Class('Tabs', {
		index:function (config){
			/*
				hover: seleteor//添加了一个悬浮对象
				autoPrev: 自动时允许反向
			*/
			var Y = this;
			this.tabButtons = _TabButtons(config);
            if (config.contents) {
                this.tabContent = _TabContent(config);
                this.tabButtons.count = this.tabButtons.count || this.tabContent.items.size();
			    this.panels = this.tabContent.items;// map panels
            }
			this.btns = this.tabButtons.items;
			this.addNoop('onchange');
			if (typeof config.show == 'function') {
				this.tabContent.doShow = config.show//自定义显示
			}
			this.tabButtons.onchange = function (a, b, ishand){// int, int, bool
                if (Y.tabContent) {
                    Y.tabContent.show(a, b);
                }
                Y.selectedIndex = b;// 当前索引
				Y.onchange(a, b, ishand);
			};
			if (config.hover) {// 悬浮停止自动播放
				this.need(config.hover).hover(function (){
					Y.ishover = true
				},function (){
					Y.ishover =false
				})
			}
            if (config.change) {
                this.onchange = config.change
            }
			if (!isNaN(config.auto)) {//自动
				this.auto(config.auto, config.autoPrev)//autoPrev is dir
			}
		},
		focus: function (n){//非用户触发
			this.tabButtons.select(n, true)
		},
		auto: function (time, prev){
			var Y, dir;
			dir = prev ? 'selectPrev' : 'selectNext';
			Y = this;
			this.autoTimer = setInterval(function() {
				if (!Y.ishover) {
					Y.endFx().tabButtons[dir]()
				}            
			},time);
		},
		onunload: function (){
			clearInterval(this.autoTimer);
		}
	})
	/*
	@ Class > Tabs > ScrollTabs
	仅仅重载了组合器中的单显效果
	容器滚动效果
	原理:
		1、所有的内容项目放置在一个已知的容器中,通过滚动容器的滚动条来显示当前项目。
		2、所以必须要指定容器clipView(overflow:hidden), 方向dir, 有时候必要指定视口大小viewSize。
		3、这个滚动不是无缝的，最后会回滚动到开端。
		4、如果要水平滚动，最好的方法是添加一个shell层，宽度近可能大，然后子项浮动在这个shell中，并指定dir = 'y'。
	Y.use('tabs',function (){
		new this.lib.ScrollTabs({
			items:'li',
			focusCss:'red',
			contents:'div div',//项目
			clipView:'.v',//滚动器
			viewSize:[100,100],//手动指定视口大小
			delay:10,//tab的触发频率
			auto:500,//自动频率
			dir:'x',//方向
			hover:'.v'//添加停止动画的悬浮元素
		})    
	})
	*/
	Class('Tabs>ScrollTabs',{
		index:function (config){
			var size, V;
			this.base(config);
			V = this.tabContent;
			this.error('ScrollTabs > param.view is undefined', !config.view);
			V.clipView = this.one(config.view);
			V.dir = config.dir ? (config.dir.indexOf('x')==-1 ? 'scrollTop' : 'scrollLeft') : 'scrollTop';
			V.viewSize = config.viewSize;
			if (!config.viewSize) {
				size = this.getRect(V.clipView);
				V.viewSize = [size.width, size.height]
			}
			V.unit = V.viewSize [V.dir == 'scrollTop' ? 1 : 0];
			V.doShow = this.doShow;// 修改效果
		},
		doShow: function(a, b, from, to) {
			var a, b, c;
			c = this.dir;
			a = this.clipView[c];
			b = to* this.unit;
			this.fx(function (f, i){
				this.clipView[c] = f(a,b)
			},{mx: this.getGuid(this)})
		}
	});
	/*
	@ Class > Tabs > MarginTabs
	偏移效果
	原理：
		1、使用marginTop/marginLeft进行视口切换。
		2、同时更换dom位置，来形成连续不回滚动效果。
		3、要显示的子项总是先移动到最前面。
		4、必须显式指定一个切剪容器[clipView]，一是定义大小，二是水平滚动时做不换行效果。
	*/
	Class('Tabs>MarginTabs',{
		index:function (config){
			/*
				config:{
					useItemSize: true//使用项目本身的大小进行偏移, 在一些向上循环显示的场合，可能子项大小不定
				}
			*/
			var size, ss;
			this.base(config);
			ss = this.tabContent;
			ss.dir = config.dir ? (config.dir.indexOf('x')==-1 ? 'marginTop' : 'marginLeft') : 'marginTop';
			ss.offDir = config.dir ? (config.dir.indexOf('x')==-1 ? 'offsetHeight' : 'offsetWidth') : 'offsetHeight';
			ss.viewSize = config.viewSize;
			ss.clipView = config.view ? ss.one(config.view) : ss.items.one().parentNode;// 如果有隔离层，必须指定clipView
			if (!config.viewSize) {
				size = this.getRect(ss.clipView);
				ss.viewSize = [size.width, size.height]
			}
			ss.unit = ss.viewSize [ss.dir == 'marginTop' ? 1 : 0];
			ss.useItemSize = !(config.useItemSize === false);//是否使用项目的尺寸, 默认
			ss.doShow = this.doShow;// 修改效果
		},
		doShow: function(a, b, from, to) {
			var par, c, offset;
			par = a.parentNode;
			c = this.dir;
			if (from !== to) {
				this.endFx();
				 if (from - to == 1 || from - to < -1) {// 上一个
					par.insertBefore(b, a);//[b, a]
					offset = this.useItemSize ? b[this.offDir] : this.unit;
					b.style[c] = -offset + 'px';
					this.fx(function (f){
						b.style[c] = f(-offset, 0) + 'px'
					},{
						end: function (){
						    b.style[c] = 0
						}
					})
				}else{// 下一个
					par.insertBefore(b,a);//[b, a]
					par.insertBefore(a,b);//[a, b], 两次insertBefore 模拟insertAfter
					offset = this.useItemSize ? a[this.offDir] : this.unit;
					this.fx(function (f){
						a.style[c] = f(0, -offset) + 'px'
					},{
						end: function (){
							a.style[c] = 0;
							par.appendChild(a)
						}
					})
				}
			}
		}
	});
	/*
	@ Class > Tabs > FadeTabs
	淡入淡出效果
	原理：
		1、容器会添加相对定位属性。
		2、对所有的项目进行绝对定位，除了当前的定位在0,0，其它的都移出屏幕。
		3、切换时使用透明度。
	nav:'.tabmenu ul>li',@
	focusCss:'cli',@
	blurCss:'',
	content:'#tabcontent>ul',@
	time:100
	*/
	Class('Tabs>FadeTabs',{
		index:function (config){
			this._super('index',config);// init end;
			this.panels.nodes[0].parentNode.style.position = 'relative';
			this.panels.each(function (el, i){//内容叠放
				this.get(el).setStyle('position:absolute;left:'+(i==0 ? 0 : '-9999px')+';top:0;zoom:1')
			}, this);
			this.tabContent.z = 1;
			this.tabContent.doShow = this.doShow;// 修改效果
		},
		doShow: function(a, b) {
			if (a !== b) {
				this.get(b).setStyle({// 准备b显示
					opacity: 0,
					left: 0,
					zIndex: ++this.z
				});
				this.endFx();
                this.get(a).setStyle('filter:;');
                this.get(b).fadeTo(1, function (){// 上一个取消透明，当前淡入
					this.get(a).setStyle('filter:;')
				})            
			}
		}
	});
	/*
	@Class > Tabs > slideTabs
	创建一个滑动的选项卡(手风琴)
	原理：
		1、使用改变项目height/width来显隐项目。
		2、全部项目尺寸为0时，应该合成大小为0，才能保证视口最终最呈现一个项目, li 在ie中有空隙bug，最好用div做项目容器。
	this.lib.SizeTabs({
		items:'dt',
		focusCss:'openDD',
		contents:'dd'            
	}).focus(1);
	*/
	Class('Tabs>SizeTabs',{
		index:function (config){
			var current, V;
			this._super('index',config);// init end;
			V = this.tabContent;
			current = this.tabButtons.current;
			V.doShow = this.doShow;// 修改效果
			V.tween = config.tween || function (x){
				return Math.pow(x, .4)
			};
			V.time = this.getInt(config.time, 320);
			V.items.each(function (item, i){//隐藏所有的内容
				item.style.overflow = 'hidden';
				this.setStyle(item, {
					overflow: 'hidden',
					height: current == i ? 'auto' : '0'
				})
			}, this)
		},
		doShow: function(a, b) {
			var a_current_height, b_free_height, b_current_height;
			if (a !== b) {
				a_current_height = this.getInt(a.style.height,0) || a.offsetHeight;
				this.showNode(b);
				b_free_height = this.attr(b, 'free-height') || this.getRect(b, true).height;
				this.attr(b, 'free-height', b_free_height);
				b_current_height = this.getInt(b.style.height,0);
				this.fx(function (f, i){
					a.style.height = f(a_current_height, 0)+'px';//hide a
				},{tween: this.tween, time: this.time, mx: this.getGuid(a)});
				this.fx(function (f, i){
					b.style.height = f(b_current_height, b_free_height)+'px';// show b
				},{tween: this.tween, time: this.time, mx: this.getGuid(b)});
			}
		}
	});
})(yclass);