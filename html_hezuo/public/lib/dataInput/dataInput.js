(function (){

	var _BaseInput, _IntInput, _DefInput;
	// 数据输入工厂类
	Class.createFactory('DataInput', function (ini){
		if (!('type' in ini)) {
		    ini.type = 'int'
		}
		switch(ini.type+''){
		case 'default':
			return new _DefInput(ini)
		case 'int':
			return new _IntInput(ini)
		default:
			this.error('\u672a\u80fd\u627e\u5230\u5339\u914d"'+ ini.type +'"\u7684\u7c7b');
		}
	});

	// Base Class
	_BaseInput = Class({
		index: function (ini){
			this.overflow = 0;
		    this.input = this.need(ini.input).slice(0,1);// target input
			if ('initVal' in ini) {// set init value
				this.input.val(this.getInt(ini.initVal));
			}
			if (ini.len) {// max length
				this.input.attr('maxLength', ini.len)
			}
			this.addNoop('onchange,onblur,onfocus,onenter,_bindEvent,_listenVal,_autoFix');// add event
			this.options = this.mix({}, ini)// save param
			this.input.keydown(function (e, ns){
				if (e.keyCode === 13) {
					ns._autoFix();
					ns.onenter(this)
				}
			});
			if (this.isFunction(ini.change)) {
			    this.onchange = ini.change
			}
			this.options = this.mix({}, ini);
			this._firstValue = this._preval = this.input.val();
			this._listenValProxy = this._listenVal.proxy(this);
			this._bindEvent();
		},
        val: function (){
            return  this.input.val.apply(this.input, arguments);           
        }
	});
	// Int input
	_IntInput = Class({
		Extends: _BaseInput,
		index: function (ini){
			this.overflow = 0;
			this.max = ini.max || Number.MAX_VALUE;
			this.min = ini.min || -Number.MAX_VALUE;
			this.base(ini);
		},
		_bindEvent: function (){
			var _timer;
			this.input.blur(function (e, ns){
				clearInterval(_timer);
                ns._listenValProxy();
				ns._autoFix();
				ns.onblur()
			}).focus(function (e, ns){
				_timer = setInterval(ns._listenValProxy,200);
				//ns.select();
				//ns.onfocus()
				setTimeout((function() {
	                this.select();
	            }).proxy(this),10);
	        });
		},
		_autoFix: function (){
			if (this.input.val().trim() == '') {
				this.input.val(this._firstValue);
                this.onchange(this._firstValue)
			}else if(this.overflow !==0){
				this.input.val(this.rangeValue)
                this.onchange(this.rangeValue)
			}
		},
        _listenVal: function() {
			var fixVal, ischange, val;
			fixVal = val = this.input.val();
			if (val !== '') {
				fixVal = val.toString().replace(/\D/g, '').replace(/^0\d+/, ''); // 得到修复值
				if (val != fixVal) {
					this.input.val(fixVal) // 纠正非法输入
				}
				this.overflow = fixVal > this.max ? 1 : (fixVal < this.min ? -1 : 0);// 保存溢出状态
				this.rangeValue = this.getInt(fixVal).range(this.min, this.max);
			}else{
				this.overflow = 0
			}
			ischange = this._preval != fixVal;
			this._preval = ischange ? fixVal : this._preval;
			if (ischange) {
			    this.onchange(this.input.val())
			}
		}
	});

	// normal input
	_DefInput = Class({
		Extends: _BaseInput,
		index: function (ini){
		    this.base(ini);
			this.max = this.getInt(ini.max) || Number.MAX_VALUE;
		},
		_bindEvent: function (){
			var _timer;
			this.input.blur(function (e, ns){
				clearInterval(_timer);
                ns._listenValProxy();
				if (ns.input.val().trim() == '') {
					ns.input.removeClass(ns.options.focusCss)
					ns.input.val(ns._firstValue)
				}
				ns.onblur()
			}).focus(function (e, ns){
				_timer = setInterval(ns._listenValProxy,200);
				ns.input.addClass(ns.options.focusCss);
				if (ns.input.val() == ns._firstValue) {
					ns.input.val('')
				}
				ns.onfocus()
			})
		},
		_listenVal: function (){
			var val = this.input.val();
			if (val.length != this._preval.length) {
				if (val.length > this.max) {
				    this.input.val(val.slice(0, this.max))
				}
				this._preval = this.input.val();
				this.onchange(this._preval)
			}		    
		}
	});
// end
})();