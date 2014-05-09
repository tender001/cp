Class('CountDown', {
	fps: 1000,
    index:function (ch){
       this.ch = !!ch;
       this.list = {};
    },
    add: function (config){// {endTime:date,change:fn,other:mix}
        var item = this.mix({
			guid: this.getGuid(), 
			change: this.getNoop()
		}, config);
        item.endTime = this.getDate(item.endTime);
        this.list[item.guid] = item;
        return this        
    },
	play: function(now) {//可以动态添加新的倒计时或者重新校时启动
        var Y = this;
        this.now  = +this.getDate(now);
        this.error('.play(startTime):\u9700\u8981\u4e00\u4e2a\u5f00\u59cb\u65f6\u95f4\u53c2\u6570', isNaN(this.now));
		clearInterval(this.timer);
        this.timer = setInterval(function (){
            Y.eachClock()
        }, this.fps);
        Y.eachClock()
	},
    eachClock: function (endMsg){
        var item, diff, timeout, clone, now, end, self;
        self = this;
        end = arguments.length > 0;
        this.now += this.fps;
        now = this.now;
        clone = this.mix({}, this.list);
        for(var k in clone){
            item = clone[k];
            diff = item.endTime - now;
            timeout = Math.abs(diff).toTimeDiff(this.ch);
            if (diff<0 || end) {
                delete this.list[item.guid];
                item.change.call(self, timeout, true, endMsg)// arrTime, isEnd, endMsg
            }else{
                item.change.call(self, timeout, false, false, now)
            }
        }        
    },
    end: function (endMsg){
		clearInterval(this.timer);
        this.eachClock(endMsg)
    }
});