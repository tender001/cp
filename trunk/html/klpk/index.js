// 全局配置
Class.C('play_type', 'x1');
Class.C('choose_type', 'pt');
Class.C('lot_name', 'klpk');
Class.C('lot_name_ch', '快乐扑克3');
Class.C('lot_name_en', 'klpk');
Class.C('lot_id', '58');
Class.C('price', 2);
Class.C('playid', 254);
Class.C('fsfq', $_trade.url.pcast);
Class.C('fszh', $_trade.url.zcast);
Class.C('casttype', 0);
Class.C('iszh', false);
Class.C('sump', 79);
Class.C('limit-code-ischecking',true);
Class.C('lot_data',{
	239: ['同花', 90, 1],//同花包选
	230: ['同花顺', 2150, 1],//同花顺包选
	231: ['顺子', 400, 1],//顺子包选
	232: ['豹子', 6400, 1],//豹子包选
	233: ['对子', 88, 1],//对子包选
	
    249: ['同花', 90, 1],//单选
    250: ['同花顺', 2150, 1],//单选
    251: ['顺子', 400, 1],//单选
    252: ['豹子', 6400, 1],//单选
    253: ['对子', 88, 1],//单选
    254: ['任选一',5, 1],
    255: ['任选二',33, 2],
    265: ['任二胆拖',33, 2],
    256: ['任选三',116, 3],
    266: ['任三胆拖',116, 3],
    257: ['任选四',46, 4],
    267: ['任四胆拖',46, 4],
    258: ['任选五', 22, 5],
    268: ['任五胆拖',22, 5],
    259: ['任选六',12, 6],
    269: ['任六胆拖',12, 6]
});
Class.C('lot_data_new',{// 老玩法ID, 新库中玩法ID, 投注方式 (1单复式 2单复式 3包号 4和值 5胆拖)
	249: ['07', 12,"01",5],
	250: ['08', 12,"01",5],
	251: ['09', 12, "01",13],
	252: ['10', 12, "01",14],
	253: ['11', 12, "01",14],
	254: ['01', 13, "01",13],
	255: ['02', 13,"01",13],
	256: ['03', 13,"01",13],
	257: ['04', 13, "01",13],
	258: ['05', 13, "01",13],
	259: ['06', 13, "01",13]
	  
});

Class.C('lot_data_dome',{
    249: '<h5>示例</h5>选号：01 05<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">6</em>元',
    250: '<h5>示例</h5>选号：01 04 05<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">19</em>元',
    251: '<h5>示例</h5>选号：01 02 04 05<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">78</em>元',// r4
    252: '<h5>示例</h5>选号：01 02 03 04 05<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">540</em>元',// r5
    253: '<h5>示例</h5>选号：01 02 03 04 05 06<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">90</em>元',// r6
    254: '<h5>示例</h5>选号：01 02 03 04 05 06 07<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">26</em>元',// r7
    255: '<h5>示例</h5>选号：01 02 03 04 05 06 07 08<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">9</em>元',
  	256: '<h5>示例</h5>选号：01 02<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">130</em>元',// 前二直选
  	257: '<h5>示例</h5>选号：01 02<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">130</em>元',// 前二直选
  	258: '<h5>示例</h5>选号：01 02<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">130</em>元',// 前二直选
	259: '<h5>示例</h5>选号：01 02 03<br/>开奖：01 02 03 04 05<br/>中奖：<em class="cm_red">1,170</em>元'// 前三直选	
});

Class.C('lot_data_wanfa',{
		
		249:' 同花包选，开奖号为任意相同花色即中奖<em class="red">22</em>元，中奖率1/19.3；同花单选，与开奖号花色都相同即中奖<em class="red">90</em>元，中奖率1/77.3。',
		250: '同花顺包选，开奖号是三连号且花色一致即中奖<em class="red">535</em>元；同花顺单选，所选花色与顺子开奖号花色都相同即中奖<em class="red">2150</em>元。',
		251: ' 顺子包选，开奖号码为三连号即中奖<em class="red">33</em>元，中奖概率1/28.7；顺子单选，所选顺子号与开奖号相同即中奖<em class="red">400</em>元，中奖概率1/345。',
		252: ' 豹子包选，开奖号为三同号即中奖<em class="red">500</em>元，中奖概率1/425；豹子单选，所选豹子号与开奖号相同即中奖<em class="red">6400</em>元，中奖概率1/5525。',
		253: '对子包选，开奖号中只出现2个同号即中奖<em class="red">7</em>元，中奖率1/5.9；对子单选，与开奖号中的对子相同即中奖<em class="red">88</em>元，中奖概率1/76.7。',
		254: '至少选1个号码，所选号码与开奖号码中任意一个相同即中奖<em class="red">5</em>元，中奖概率1/4.6。',
	    255: '至少选2个号码，所选号码至少命中开奖号中2个不同号码即中奖<em class="red">33</em>元，中奖概率1/29.4。',
	    256: '至少选3个号码，所选号码包括当期全部开奖号即中奖<em class="red">116</em>元，中奖概率1/100.45。',
	    257: '至少选4个号码，所选号码包括当期全部开奖号即中奖<em class="red">46</em>元，中奖概率1/39.46。',
	    258: '至少选5个号码，所选号码包括当期全部开奖号即中奖<em class="red">22</em>元，中奖概率1/19.38。 ',
	    259: '至少选6个号码，所选号码包括当期全部开奖号即中奖<em class="red">12</em>元，中奖概率1/10.9。'
});
//Class.C('child_wanfa',{
//    249: '1234,111,222,333,444',
//    250: '1234,111,222,333,444',
//    251: '1234,111,222,333,444',
//    252: '1234,111,222,333,444',
//    253: '1234,111,222,333,444',
//    255: 'A,2,3,4,5,6,7,8,9,10,J,Q,K',
//    256: 'A,2,3,4,5,6,7,8,9,10,J,Q,K',
//    257: 'A,2,3,4,5,6,7,8,9,10,J,Q,K',
//    258: 'A,2,3,4,5,6,7,8,9,10,J,Q,K',
//    259: 'A,2,3,4,5,6,7,8,9,10,J,Q,K'	
//});
Class.extend('getPlayId', function (){
    return this.getInt(Class.C('playid'));
});
Class.extend('getIni', function (){
    return this.C('lot_data')[this.getInt(Class.C('playid'))];
});
Class.extend('getDTIni', function (pid){
    return this.C('lot_data')[this.getInt(pid)];
});
Class.extend('getPrix', function (){
    var s = Class.C('lot_data')[Class.C('playid')];
    return s ? s[1] : 0;
});
if (Class.C('stop-buy')) {
    $(".nxszop .sz_a_l .sz_cmt").addClass("cu");
}

Class.extend('getPrixRange', function (count,code){//已选
	var min, max='', rn, hit, sp, ini,playid,mx,mi,getPlayId = this.getPlayId();
	if(code != '' && code != undefined){
	codes = Y.getInt(code[0]);
	if(getPlayId == '249' && codes == '00'){
	if(code.length == '1'){
	sp = 22;
	}else{
	sp = 112;
	}
	}else if(getPlayId == '250' && codes =='00'){
	if(code.length == '1'){
	sp = 535;
	}else{
	sp = 2685;
	}
	}else if(getPlayId == '251' && codes =='00'){
	if(code.length == '1'){
	sp = 33;
	}else{
	sp = 433;
	}
	}else if(getPlayId == '252' && codes =='00'){
	if(code.length == '1'){
	sp = 500;
	}else{
	sp = 6900;
	}
	}else if(getPlayId == '253' && codes =='00'){
	if(code.length == '1'){
	sp = 7;
	}else{
	sp = 95;
	}
	}else{
	sp = this.getPrix();//单注奖金
	}
	}else{
	sp = this.getPrix();//单注奖金
	}
	playid = getPlayId;
	if( playid == '256' || playid == '257' || playid == '258' || playid == '259'){
	mx = 3;
	mi = 3;
	}else if(playid == '255' || playid == '254'){
	mx = 3;
	mi = 1;
	}else{
	mx = 1;
	mi = 1;
	}
	ini = this.getIni();
	rn = ini[2];//必选个数
	min = sp;
	var max = Math.c(Math.min(count, mx), rn)*sp;
	if(playid == '254'){//R1
	}else if(playid == '255'){//R2
	}else if(playid == '256'){//R3
	if(count > mx){//由于开奖号码可能是豹子
	max = Math.c((count-1), (rn-1))*sp;
	}
	}else if(playid == '257' || playid == '258' || playid == '259'){//R4 R5
	if(count > mx){//由于开奖号码可能是豹子
	max = Math.c((count-1), (rn-1))*sp;//这里面的1代指豹子
	min = Math.c((count-3), (rn-3))*sp;//这里面的3代指开奖号码个数
	}
	}
	if (min == max) {
	max = false;
	}
	return {
	min: min,//最小奖金
	max: max//最大奖金
	}; 
});

Class.extend('getdtplayid', function (){//已选
    var id = this.getPlayId();
    var newid = id;
    switch(id){
    case 244:
         break;
    case 255:
    	newid = 280;
    	break;
    case 254:
    	newid = 268;
    	break;
    case 253:
    	newid = 267;
    	break;
    case 252:
    	newid = 266;
    	break;
    case 251:
    	newid = 265;
    	break;
    case 247:
    	newid = 261;
    	break;
    case 249:
    	newid = 278;
    	break;
    case 248:
    	newid = 264;
    	break;
    case 250:
    	newid = 279;
    	break;
    }
    return newid;  
});


Class.extend('getDtPrixRange', function (d, t){//已选
    var min, max, rn, hit, sp, count, core, pid;
    sp = this.getPrix();//单注奖金
    pid = this.getdtplayid();
    rn = this.getIni()[2];//必选个数
    min = sp;
    core = Math.min(rn, 5);//有效个数
    count = d + t;
    if (count > rn){//最多命中注数 
        if (d > core) {// 胆超过5最大是全中, 任6-8出现
            max = Math.dt(d, t, rn)*sp;
        }else{
            if (pid === 261 || pid === 264) {
                max = false// 如果是直选类, 只中一注
            }else{
                //如果任2-4, 从拖中选出余下个数
                max = core < 5 ? Math.c(Math.min(t, 5 - d), core - d)*sp : Math.dt(core - d, t - (core - d) , rn - d)*sp                
            }
        }
    }
    return {
        min: min,//最小奖金
        max: max//最大奖金
    }     
});
Class.extend('checkMaxMoney', function (money, showNode, fn){//检测最大金额是否超出
    var limit, LM, pe;
    limit = this.getLimit();
    if (money > limit.max) {
        if (showNode) {//显示点
            this.getTip().show(showNode, '<h5>超过最大金额</h5>您好，单个方案最大金额为<strong style="color:red">'+Number(limit.max).rmb(false,0)+'</strong>元！').setIco(9);
        }        
        if (this.isFunction(fn)) {
            fn.call(this, money, limit.max)
        }
        return false;
    }else if(typeof LotteryConfig != 'undefined'){
        var  min = LotteryConfig[this.getPlayId()];
        if (money < min) {
            this.alert('您好, 该玩法单期最小发起金额为' + min + '元');
            return false;
        }
    }
    return true;
});

Class.extend('getLimit', function (){//读取购买限额
    var l, limit;
    limit = Class.C('limit');
    if (!limit) {
        limit = [{//默认
            min: 2,
            max: 2000000
        },{
            min: 15,
            max:3000000
        }];
        if (l = this.get('#money_limit').val()) {
            l = l.replace(/\s/g,'').split(',');
            if (l[0]) {//防止为空
                limit = [{
                    min: Yobj.getInt(l[0]),
                    max: Yobj.getInt(l[1])
                },{
                    min: Yobj.getInt(l[2]),
                    max:Yobj.getInt(l[3])
                }]                
            }
        }
       Class.C('limit', limit);
    }
    return Class.C('price') == 2 ? limit[0] : limit [1]
});

Class.extend('setIntInput', function (input, change, def, max){
    max = max || Number.MAX_VALUE;
    this.get(input).keyup(fix).focus(function (){
        this.select();
    }).blur(function (){
        if (this.value == '') {
            this.value = def || 0;
        };
        fix.call(this);
    });
    function fix(){
    	 var val = Math.min(max, parseInt(this.value, 10) || 0);
         if (val != this.value) {
             this.value = val
         }else if(/^0+/.test(this.value)){
             this.value = this.value.replace(/^0+/g,'');
         }
         if (this.getAttribute('data-prev') != val) {
             this.setAttribute('data-prev', val);
             change instanceof Function ? change.call(this) : null;
         }
    }
});

//购买
Class('SendBuy', {
	
    tplzh: '您本次追号<strong class="red m-r">{$expectnum}</strong>期,追号总金额为<strong class="red m-r">{$totalmoney}</strong>元',
    tpl: '您本次投注期次为<strong class=\"red m-r\"> {$currentexpect}</strong>,投注金额为<strong class=\"red m-r\">{$totalmoney}</strong>元',
    index:function (){
        var Y = this;
        this.need('#sendbuy').click(function (){
            if (Class.C('stop-buy')) {
                return Y.alert('您好，' + Y.C('lot_name_ch') + '暂时停售, 请选择其它彩种投注。');
            }
            Y.chkBuy();
           
        });
    },
    chkBuy: function (){
        var elist, list, Y;
        Y = this;
        elist = Y.postMsg('msg_get_expect_param').data;
        list = Y.postMsg('msg_get_list_data').data;
        elist.codes = list.codes;
        if (!Y.get('#agreement').prop('checked')) {
            return Y.confirm('您好, 您已阅读并同意《用户合买代购协议》吗?', function (){
                Y.get('#agreement').prop('checked', true);
                Y.chkBuy();
            })
        }else if (list.zhushu == 0) {
            return Y.alert('您好, 您至少要选择一注才能投注!');
        }else if(elist.beishulistsuc ==''){
            return Y.alert('您好, 您至少要选择一期进行投注!');
        }else{
            Y.chkLimitCode(list.codes, function (){
	                Y.postMsg('msg_login', function (){
	                	var tplstr = Class.C('iszh')?Y.tplzh:Y.tpl;
	                    return Y.confirm(tplstr.tpl({
	                        lot: Y.C('lot_name_ch'),
	                       
	                        currentexpect: $(':checkbox:checked').val(),
	                        expectnum: elist.beishulistsuc.split(',').length,
	                        money: list.totalmoney.rmb(),
	                        stop: $_sys.zhflag[Y.get('#tzzh').val()],
	                        totalmoney: elist.allmoney.rmb()
	                    }), function (){
	                        Y.send(elist);
	                    });
	                });
            });               
        }
        
    },
    send: function (param){
        this.alert('正在提交您的订单, 请稍候...', false, true);        
        this.ajax({
          	url : Class.C('iszh')?Class.C('fszh'):Class.C('fsfq'),
            type: 'POST',
            data: param,
            end:function (data){
            	var obj = eval("(" + data.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc; 
    			this.alert.close();
    			if (code == "0") {
    				if (Class.C('iszh')){
    					var r = obj.Resp.zhuihao;    		
    					var projid = r.id;
    					this.buySucceedDlg(param.gid,projid,1);
    				}else{
    					var r = obj.Resp.result;    		
    					var projid = r.projid;
    					this.buySucceedDlg(param.gid,projid);
    				}   
					  this.postMsg('msg_buy_succeed');
					  this.postMsg('msg_update_userMoney');// 更新用户信息
    			} else {
    				if (code=="1001"||code=="2"){
   					 //充值
                       this.postMsg('msg_show_addmoney',function (){
                           window.open($_user.daohang.addmoney);     
                       });		
	   				}else{
	   					this.alert(desc);
	   				}
    			}
            }
        });
    }
});


//选择器
Class('Ball2', {});

//选择器
Class('Ball', {
//    showTxt: '选单金额:[<em class="cm_yellow">{$totalmoney}</em>元]&nbsp;如中奖[奖金：{$prix}，盈利  {$yl} ]',
	showTxt: '【您选择了<em>{$zhushu}</em>注，共 ￥<em>{$totalmoney}</em>元 】如中奖，奖金 {$prix}，盈利{$yl} ',
    index:function (config){
    	this.danmas = this.need(config.danmas);
        this.putBtn = this.get(config.putBtn).concat(this.get(config.put).nodes);
        this.onMsg('msg_get_choose_code_'+config.msgId, function (isKeepCode){
             return this.getChooseCode(isKeepCode);
         });
    },
    highlightBtn: function (zs){
        if (zs) {
           this.putBtn.addClass('cur');
        }else{     
           this.putBtn.removeClass('cur');
        }
    },
    random: function (n){// 随机生成号码, [[red],[blue]]
        var a, b, code, id, len, ini,sp;
        n = ~~n;
        code = [];
        id = this.getPlayId();
        ini = Class.C('lot_data')[id];
        len = ini[2];
        sp = ini[3] || ',';
        a = this.repeat(11, 1);
        for (var i = n; i--;) {
            code[i] = [a.random(-len), id, 1];
            if (!ini[3]) {
                code[i][0].sort(Array.up)
            }
        }
        code.each(function (arr){
            if (sp==='|') {//直选修饰
                arr[0] = arr[0].concat('-', '-', '-', '-', '-').slice(0, 5)
            }
            arr[0] = String.zero(arr[0].join(sp));
        });
        this.postMsg('msg_put_code', code);//广播号码输出消息, 号码列表监听此消息
    }
});
//单行选择器
Class('Ball>Single', {
    index:function (ini){
//    	alert(ini);    	
        var Y = this;
        this.base(ini);
       //alert('Ball>Single1');
        this.msgType = 'single';
        this.ball = this.lib.Choose(ini);
        //alert('Ball>Single2');
        this.danmas = this.need(ini.danmas);
//        alert('Ball>Single3');
        this.addNoop('onchange');
//        alert('Ball>Single4');
        this.showbar = this.get(ini.showbar);
//        alert('Ball>Single5');
        this.ball.onchange = function (){
            if(this.dan_data.length>0){  
            	Class.C('casttype', 1);
            	Y.dtchange();
            }else{
            	Y.ptchange();
            	Class.C('casttype', 0);
            }
        };
        this.bindDom(ini); 
    },
    bindDom: function (ini){
        var Y = this;
        this.need(ini.clear).click(function (){
            Y.clearCode();
        });
        this.need(ini.rnd1).click(function (){
            Y.random("1");
            /*var clear_list = $("#clear_list").val();
        	if(clear_list != null){
        		$("#clear_list").toggleClass("a1");
        	}*/
        });
//       /* this.need(ini.rnd5).click(function (){
//            Y.random("5");
//        });
        this.need(ini.jixuan).click(function (){
        	var shuzi = $("#shuzi").val();
        	shuzi=$("#shuzi").val().replace(/\D/g,'');
        	Y.random(shuzi);
        });
        this.need(ini.setdan).click(function (){
        	if($(ini.danma).is( ":hidden ")){
        		$(ini.danma).show();
        		$(ini.setdan).addClass("cur");
        	}else{
        		$(ini.danma).hide();
        		$(ini.setdan).removeClass("cur");
        	}
        });
        this.need(ini.put).click(function (){
        	if (Class.C('stop-buy')) {
        	    return;
        	}
        	var code, count, min, msg;
            var casttype = Class.C('casttype');
            if(casttype==0){
                count = Y.getCount();
                min = Class.C('lot_data')[Y.getPlayId()][2];	
                if(count > 0) {
                    if (Y.checkMaxMoney(count*Class.C('price'), this)) {
                        code = Y.getChooseCode();
                        Y.clearCode();
                        Y.postMsg('msg_put_code', code);//广播号码输出消息, 列表框应该监听此消息                    
                    }
                }else{
                    Y.alert('您好，请您至少选择'+min+'个号码！');
                }
            }else{
                var pid = Y.getdtplayid();
                var ini = Y.getDTIni(pid);
                var castdata = Y.getdtCount();
                if (castdata.d < 1) {
                    msg = '您好, 请至少选取一个胆码！';
                }else if(castdata.t < 1){
                    msg = '您好, 请至少选取一个拖码！';                
                }else if(castdata.t + castdata.d < ini[2]+1){
                    msg = '您好, 胆码加拖码至少要有'+(ini[2]+1)+'个！';
                }else if(castdata.zhushu == 0){
                    msg = '您目前选择的号码不足一注, 请继续选择！';
                }
                if (msg) {
                    Y.alert( msg);
                }else{
                	Y.clearCode();
                    Y.postMsg('msg_put_code', castdata.code); 
                }
            }
            Y.get("#allselect").html("全选");
            Y.postMsg('danma_onchange');
        })
    },
    clearCode: function (){
        this.ball.clearCode();
    },
    getCount: function (){
    	var len, id;
        len = this.ball.data.length;
        id = this.getPlayId();
        switch(id){
        case 249:
        case 250:
        case 251:
        case 252:
        case 253:
        case 254:
        	return len;
        case 255:
        case 256:
        case 257:
        case 258:
        case 259:
            return Math.c(len, Class.C('lot_data')[id][2]);
        }
    },
    getdtCount: function (){
        var  d, t, b, ini, zs;
        d = this.ball.dan_data.length;
        t = this.ball.tuo_data.length;
        var pid = this.getdtplayid();
        ini = this.getDTIni(pid);
        zs = Math.dt(d, t, ini[2])*(d>0?1:0);
        return {
            code:[[String.zero('胆: '+this.ball.dan_data.slice()+' 拖: '+this.ball.tuo_data.slice()), pid,zs]],
            d:d,
            t:t,
            zhushu: zs
        }
     },
     ptchange: function (){
         var zhushu, info, prix, tm, y1, y2;
         zhushu = this.getCount();
         prix = zhushu > 0 ? Y.getInt(Y.getPrix()) : 0;
         tm = zhushu*Class.C('price');// buy
         prix =  zhushu > 0 ? this.getPrixRange(this.ball.data.length,this.ball.data) : {max: 0, min: 0}; 
         if (this.ball.data.length == 11 && prix.max) {
             prix.min = Math.max(prix.max, prix.min);
             prix.max = null;
         }
         y1 = '<em>' + (prix.min - tm).rmb(false,0) + '</em>元';
         y2 = prix.max ? '<em>' + (prix.max - tm).rmb(false,0) + '</em>元' : 0;
         info = {
             ball: this.ball.data.length,
             zhushu: zhushu,
             prix: '<em>' + prix.min.rmb(false,0) + '</em>元' + (prix.max ? (' 至 <em>' + prix.max.rmb(false,0)) + '</em>元' : ''),//奖金范围
             yl: y1 + (y2 ? (' 至 ' + y2) : ''),
             totalmoney: tm.rmb(false,0)            
         };
         this.highlightBtn(info.zhushu);
         this.showbar.html(this.showTxt.tpl(info, '0'));
         this.onchange(info);
     },  
     dtchange: function (){
         var zhushu, info, data, prix, tm, y1, y2;
         data = this.getdtCount();
         this.zhushu = zhushu = data.zhushu;
         prix = zhushu > 0 ? this.getInt(Y.getPrix()) : 0;
         tm = zhushu*Class.C('price');
         prix = this.getDtPrixRange(data.d, data.t);
         y1 = data.zhushu == 0 ? '<em>' + 0 + '</em>元' : '<em >' + (prix.min - tm).rmb(false,0) + '</em>元';
         y2 = prix.max ? (prix.max - tm) : 0;
         y2 = y2 > 0 ? '<em>' + y2.rmb(false,0) + '</em>元' : false;
         info = {
             zhushu: zhushu,
             prix: '<em>' + prix.min.rmb(false,0) + '</em>元' + (prix.max ? (' 至  <em >' + prix.max.rmb(false,0)) + '</em>元' : ''),//奖金范围
             yl: y1 + (y2 ? ' 至 '+y2 : ''),
             totalmoney: tm.rmb(false,0)        
         };
         this.highlightBtn(info.zhushu);
         this.showbar.html(this.showTxt.tpl(info, '0'));
         this.onchange(info);
     },     
    getChooseCode: function (){// 传送到列表的数据
        var pid = this.getPlayId();
        var codeStr = pid == 244 ? [this.ball.data.join(',')].concat('-', '-', '-', '-', '-').slice(0,5).join('|') : this.ball.data.join(',');
        return [[String.zero(codeStr), this.getPlayId(), this.getCount()]];
    }
});

//多行选择器 前二三直选
Class('Ball2>Multi',{});

Class.extend('exportCode', function (){
    // 传入号码
	var showid =location.search.getParam('codes');
	var type =location.search.getParam('wtype');
	if(showid!=""&&typeof(showid) != 'undefined'){
		Yobj.get('#codes').val(showid);
		location.href='#page_buy';
		
	}

	if(type==""||typeof(type) == 'undefined' || type =="rx1"){
		type="254";
		Y.postMsg('msg_force_change_playtabs', 5,1);
	}else if(type=="rx5"){
		type ="258";
		Y.postMsg('msg_force_change_playtabs', 9,1);
	}else if(type =="rx3"){
		type ="256";
		Y.postMsg('msg_force_change_playtabs', 7,1);
	}else if(type =="zx3"){
		type ="246";
//		Y.postMsg('msg_force_change_playtabs', 11,1);
	}
    var import_code, arrCodes, short_code;
    if (import_code = Yobj.get('#codes').val()) {
		if (typeof this.dejson(import_code) == 'object') return;
        if (/\b0\b/.test(import_code)) {
            return
        }
        arrCodes= [import_code,type,1];
        if (arrCodes.length) {//完整号码显示到列表
             Y.postMsg('msg_put_code', arrCodes);
        }
    }
});

//主程序
Class('App', {
    use: 'tabs, mask, dataInput, countDown',
    ready: true,
    index:function (){
        this.lib.SendBuy();
        this.lib.Dlg();
        this.lib.BuyProject();
        this.lib.openCodeList(false);
        this.addChoose();
        this.addTabs();
        Y.exportCode();
        Y.get("#zh_bs_big").val(1);
        $("#renxuan b").mouseover(function(){
        	$(this).addClass("b_r").siblings().removeClass("b_r");
        	//$(this).addClass("style='display: none;'");
        }).mouseout(function(){
        	$(this).removeClass("b_r");
        });
		
	
		
		$("#sdinput").show().removeClass("cur");
		var sdinput =  this.lib.MaskLay('#inputalert','#inputtext');
		sdinput.addClose('#input_close');
		Y.get('#inputalert div.tantop').drag('#inputalert');
		Y.get("#sdinput").click(function(){
			if(Y.getPlayId()>256&& Y.getPlayId()<246){
				Y.alert("改玩法暂不支持手工录入");
			}else{
				sdinput.pop();
			}
			
		});
		this.get("#showkaijiang").click(function(){
			$("#kaijianginfo").toggle();
			$("#showkaijiang").toggleClass("cur");
			if($("#showkaijiang").html()=="展开"){
				$("#showkaijiang").html("隐藏");
			}else{
				$("#showkaijiang").html("展开");
			}
			
		});
		$("#num_header_1").css({
    		"height":0,
    		"overflow":"hidden"
    		});
		
		$("#span5").click(function(){
			$("#span5").toggleClass("span5c");
			$("#num_header_1").show();
			if($("#span5").hasClass("span5c")){
				$("#num_header_1").clearQueue().animate({
					height:352
					});
				
			}else{
				
				$("#num_header_1").animate({
					height:0
					
					});
			}
			
		});
	
		$("#input_ok").click(function(){
			var codevalue=$("#inputtext").val().replaceAll(" ",",");
			
			var a, b, code, id, len, ini,sp;
			id = Y.getPlayId();
			ini = Class.C('lot_data')[id];
			sp = ini[3] || ',';
			n=codevalue.split("\n").length;
			
			if(id>253&&id<259){
				if(!(Y.checksdinput(id-253))){
					return;
				}
			}else if(id==244){
				if(!(Y.checksdinput(1))){
					return;
				}
			}else if(id==247||id==245){
				if(!(Y.checksdinput(2))){
					return;
				}
			}else if(id==248||id==246){
				if(!(Y.checksdinput(3))){
					return;
				}
			}
			 
			code =[]
			var m=0;
			for(var i=0;i<n;i++){
				if(codevalue.split("\n")[i]!=""){
				code[m++] =[codevalue.split("\n")[i].split(","),Y.getPlayId(),1];
				}
				
				
				
				if (!ini[3]) {
					var zxcode=codevalue.split("\n")[i];
					
				}
				
			}
			
			
			code.each(function (arr){
				if(arr!=""){
					if (sp==='|') {//直选修饰
					arr[0] = arr[0].concat('-', '-', '-', '-', '-').slice(0, 5);
					}
				   arr[0] = String.zero(arr[0].join(sp));
				
				}
				
			});
		
			sdinput.close();
			Y.postMsg('msg_put_code', code);
		
		});
		$("#shuzi").focus(function(){
			var shuzi  = $("#shuzi").val();
			if(shuzi != ""){
				shuzi=$("#shuzi").val().replace(/\D/g,'')
				$("#shuzi").val(shuzi);
			}
			
			$("#shuzi").keyup(function(){
	    		this.value=this.value.replace(/\D/g,''); //只能输数字
	    	});
		});
		$("#zh_bs_big").focus(function(){
			//this.value(1);
			var zh_bs_big  = $("#zh_bs_big").val();
			if(zh_bs_big != ""){
				$("#zh_bs_big").val();
			}
			
			$("#zh_bs_big").keyup(function(){
	    		this.value=this.value.replace(/\D/g,''); //只能输数字
	    		/* this.onMsg('msg_load_expect_list', function (a){
	    	            this.createHTML(a);// 倒计时下载期号后构建
	    	        });  */
	    	});
		});
		$("#shuzi").blur(function(){
			var shuzi  = $("#shuzi").val();
			if(shuzi=shuzi.replace(/\D/g,'')){
					$("#shuzi").val(shuzi+"注");
			}
		});
    },
	checksdinput:function(num){
		var codevalue=$("#inputtext").val().replaceAll(" ",",");
		var rest;
		var code=[];
		if(codevalue.split("\n").length>400){
		   Y.alert("录入号码太多，超过400注无法投注");  
		   return false;
		
		}
		for(var i=0;i<codevalue.split("\n").length;i++){
				
				var sdvalue=codevalue.split("\n")[i];
				if(sdvalue !=""){
			
					for(var m=0;m<num;m++){
					if(typeof sdvalue.split(",")[num] != "undefined"){
						Y.alert("第"+(i+1)+"行号码格式不正确,请检查!");
						return false;
					
					}
					 if(sdvalue.split(",")[m]<12&&sdvalue.split(",")[m]>0){
						rest=true;
						code[m]=sdvalue.split(",")[m];
					}else{
						Y.alert("第"+(i+1)+"行号码格式不正确,请检查!");
						return false;
					}
					
					
				}
			}
			
				
		}
		if(code.length>1){
				code.sort();  
				for(var i=0;i<code.length;i++){  
				if (code[i]==code[i+1]){  
				   Y.alert("重复号码："+code[i]);  
				   return false;
				}  
			}
			}  
		return rest;
	},
    addChoose: function (){
        this.lib.Single({
            items: '#renxuan b',
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: 'b_r',
            showbar: '#single_bar',
            put: '#s0_put',
            clear:'#s0_clear',
            rnd1: '#s1_jx1',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });

        this.lib.Single({ //同花
            items: '#q1zx dd',  //球
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#Multi_bar1',//奖金 盈利
            put: '#s1_put',//选好了
            clear:'#s1_clear',
            rnd1: '#s1_jx1',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.lib.Single({ //同花顺
            items: '#q2zx dd',  //球
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#Multi_bar2',//奖金 盈利
            put: '#s2_put',//选好了
            clear:'#s2_clear',
            rnd1: '#s1_jx1',
            //rnd5: '#s1_jx5',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.lib.Single({ //顺子
            items: '#q3zx dd',
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#Multi_bar3',
            put: '#s3_put',
            clear:'#s3_clear',
            rnd1: '#s1_jx1',
           // rnd5: '#s1_jx5',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.lib.Single({ //豹子
            items: '#q4zx dd',
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#Multi_bar4',
            put: '#s4_put',
            clear:'#s4_clear',
            rnd1: '#s1_jx1',
           // rnd5: '#s1_jx5',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.lib.Single({ //对子
            items: '#q5zx dd',
            group: '#ballsingle b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#Multi_bar5',
            put: '#s5_put',
            clear:'#s5_clear',
            rnd1: '#s1_jx1',
           // rnd5: '#s1_jx5',
            jixuan: '#jixuan',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.lib.CodeList({
            panel: '#code_list',
            clearBtn1: '#clear_list1',
            clearBtn: '#clear_list',
            zsSpan: '#single_zs',
            moneySpan: '#single_m'
        });
//        alert('CodeList');
        this.lib.ExpectList();
//        alert('ExpectList');
        this.lib.CountDownGp({
            stop:Y.C('lot_id'),
            lot:Y.C('lot_id')
        });
    
//        alert('CountDownGp');
    },
    addTabs: function (){
        var playTabs,zhTabs,kjTabs;
        Y =this;
        //玩法标签切换
        playTabs = this.lib.Tabs({
            items: '#play_tabs a',
            focusCss: 'cur'
            
        });
		//手工录入切换
		sdinputTabs = this.lib.Tabs({
            items: '#sdinput'
           // focusCss: 'cur'
        });
//        alert('addTabs_1');
        playTabs.onchange= function (a, b){
        
        	$("#num_header_1").css('height','0');
        	$("#span5").removeClass("span5c");
        	var ol = Y.getopencodelength(Class.C('playid'));//上一个的
        	var pid = this.get('#play_tabs a').slice(b, b+1).attr("value");
        	var nl = Y.getopencodelength(pid);//当前的
            Class.C('playid', pid);
            
            Y.get("#wanfatishi").html(Class.C('lot_data_wanfa')[pid]);
//            Y.get("#shil s").attr("data-help",Class.C('lot_data_dome')[pid]);
            
            Y.postMsg('playtabs_onchange'); 
            Y.postMsg('danma_onchange');
            Y.postMsg('msg_buy_succeed');
			Y.get("#inputtext").val("");
			$("#sdinput").show();
            if(ol!=nl){
            	Y.postMsg('show_opencodelist', 6);
            }
            $("#opencodelist,#opencodelist_1,#opencodelist_2,#opencodelist_3,#opencodelist_4,#opencodelist_5").hide();
          
       		$("#setdanma_i,#num_header_1,#num_header_2,#haoma,#haoma_1,#haoma_2,#haoma_3,#haoma_4,#haoma_5").hide();
       	
	       	if(nl>5){
	       		$("#opencodelist,#renxuan,#haoma").show();
		       		
	       	}else{
	       		$("#opencodelist_"+nl).show();
	           	$("#haoma_"+nl).show();
	       	}
        };
		this.onMsg('msg_force_change_playtabs', function(x, y) {
			playTabs.focus(x);
		});

        
        //追号标签切换
        zhTabs = this.lib.Tabs({
            items: 'div.ncathtype label',
            focusCss: 'cur',
            contents: '#ss,#zh_tabs1,#zh_tabs2'
            
        });
        zhTabs.onchange= function (a, b){     
            var listdata = Y.postMsg('msg_get_list_data').data;
//            this
            
            if(b!=0){
            	Y.get("#expectListBox,#tzzh").show();
            }else{
            	Y.get("#expectListBox,#tzzh").hide();
        
            }
            if(b==2){
            	$("#tzzh").show();
            	Y.postMsg('gjzh_cs_change');
                if(listdata.zhushu>1){
                	Y.alert("您好，高级追号功能只支持单注投注方案!");
                	zhTabs.focus(0);
                	return false;
                }else if(listdata.zhushu<1){
                	Y.alert("请选择投注内容或机选号码后，再使用高级追号功能!");
                	zhTabs.focus(0);
                	return false;
                }  	
            }if(b==1){
            	$("#tzzh").show();
            	$("input[mark=chkexp]").each(function(x,y){
            		if($(y).attr("checked")){
            			$(y).click();
            			$(y).click();
            		}
            	})	
            }
        }; 
    },
    getopencodelength: function(pid){
    	var pl = 6;
    	if(pid==249){//同花
    		pl = 1;
    	}else if (pid==250){//同花顺
    		pl = 2;
    	}else if (pid==251){//顺子
    		pl = 3;
    	}else if (pid==252){//豹子
    		pl = 4;
    	}else if (pid==253){//对子
    		pl = 5;
    	}
    	return pl;
    }
});

//号码列表
Class('CodeList', {
    splitChar: '|',
    rightSplit: ',',
    noZero: false,
    lineTpl: '<span class="cm_left"><em class="cm_w80">{1}</em><em class="cm_w59">{4}</em><em  class="cm_w199">{2}</em></span><s title="删除当前行" class="cm_right"></s>',
    index:function (config){
        var func;
        this.totalmoney = 2;
        this.zhushu =  0;
        this.beishu = 1;
        this.panel = this.need(config.panel);
        this.bindEvent(config);
        this.msgId = config.msgId || '';
        this.stopRedraw = config.stopRedraw;//是否回显号码
        this.onMsg( 'msg_put_code', function (code){
            this.addCode(code);
        });
        this.onMsg( 'msg_get_list_data', function (){
            return this.getData();
        });
         this.onMsg('msg_buy_succeed', function (){
             this.clearLine();
             this.postMsg("msg_buy_succeed_zhlist");
         });
         this.onMsg('msg_expect_change', function (expect, now, endtime){
             if (this.panel.find('li').size() && !this.C('-is-continue-buy')) {//如有选号，弹出提示
            	 var pid = expect+"";
            	 var ppid = expect-1;
            	 var lpid = pid.substr(8);
            	 if(lpid=='01'){
            		 var ldate = pid.substr(0, 8);
            		 var dt = ldate.substr(0,4) + "-" + ldate.substr(4,2) + "-" + ldate.substr(6,2) + " 00:00:00";
            		 var pdate = Y.getDate(Date.parse(Y.getDate(dt))-1000*60*60*24).format('YYMMDD');
            		 ppid = (pdate + "") + Class.C('sump');
            	 }
            		var  wrapLay = Y.lib.MaskLay('#wrapLay', '#wrapLayConent');
                	wrapLay.addClose('#wrapLayCloseBtn', '#wrapLayClose');
                     Y.get('#yclass_alert  div.tantop').drag('#wrapLay');
                     $("#wrapLayConent").html('<div class=wxts_p>您好，<span style="color:#999">'+ppid+'</span>期已截止<br/>当前期是<span style="color:#FF4E00">'+expect+'</span>期<br/>投注时请确认您选择的期号。</div>');
                     wrapLay.pop();
//                 this.alert('您好，<span style="color:#999">'+ppid+'</span>期已截止，当前期是<span style="color:#FF4E00">'+expect+'</span>期，投注时请确认您选择的期号。');
             }
             this.C('-is-continue-buy', false);
         });
         this.addStyle('.betList li.list-Selected{background-color:#D9F1FF}');
        this.tip = this.lib.NotifyIcon();
    },
    bindEvent: function (config){
        var Y = this;
        this.moneySpan = this.need(config.moneySpan);
        this.zsSpan = this.need(config.zsSpan);
        this.clearBtn = this.need(config.clearBtn);
        this.clearBtn.click(function (e, Y){
            Y.clearLine();
            $("#zh_bs_big").val(1);
        });
        this.clearBtn1 = this.need(config.clearBtn1);
        this.clearBtn1.click(function (e, Y){
            Y.clearLine();
        });
        //选中行
        this.prevSelectedLine = null;
        this.panel.live('li', 'click', function (e, y){
            if (!Y.prevSelectedLine || Y.prevSelectedLine != this) {
                Y.get(Y.prevSelectedLine).removeClass('list-Selected').get(this).addClass('list-Selected');
                Y.prevSelectedLine = this;
            }
            if (!Y.stopRedraw) {
                Y.postMsg('msg_redraw_code', Y.get(this).data('code'));
            }            
        });
        Y.get("#zh_bs_big").keyup(function(){
        	Y.bschangess(Y.get(this).val());
        });
        Y.get("#zh_bs_add").click(function(){
        	var zh_bs_big = $("#zh_bs_big").val();
			zh_bs_big == zh_bs_big++;
			if(zh_bs_big < 2000){
				 $("#zh_bs_big").val(zh_bs_big);
			}else if(zh_bs_big >= 2000){
				 $("#zh_bs_big").val(2000);
			}
			 $("#zh_bs_big").val(zh_bs_big);
        	Y.bschangess($("#zh_bs_big").val());

        	Y.postMsg('msg_get_list_data').data;// 倒计时下载期号后构建
		});
        Y.get("#zh_bs_reduce").click(function(){
        	var zh_bs_big = $("#zh_bs_big").val();
			zh_bs_big == zh_bs_big--;
			if(zh_bs_big > 1){
				 $("#zh_bs_big").val(zh_bs_big);
			}else if(zh_bs_big == 1){
				 $("#zh_bs_big").val(1);
			}
			
        	Y.bschangess($("#zh_bs_big").val());
        	
		});
    },
    addCode: function (code){
    	 var one, li;
         if (code.length) {
         	if((Class.C('playid') == '249' || Class.C('playid') == '250' || Class.C('playid') == '251' || Class.C('playid') == '252' || Class.C('playid') == '253') && code[0][0].split(',').length>1){
         		var code_r = code[0][0].split(',');
         		for(var i = 0;i<code_r.length; i++){
         			var code_e = [];
         			code_e[0] = code_r[i];
         			code_e[1] =  code[0][1];
         			code_e[2] = 1;
         			li = this.createLine(code_e);//先页面显示
         			if(code_r[i] == '07' && Class.C('playid') == '249'){
         				code_e[1] =  239;
         			}else if(code_r[i] == '08' && Class.C('playid') == '250'){
         				code_e[1] =  230;				
         			}else if(code_r[i] == '13' && Class.C('playid') == '251'){
         				code_e[0] = '9';
         				code_e[1] =  231;
 					}else if(code_r[i] == '14' && Class.C('playid') == '252'){
 						code_e[0] = '10';
 						code_e[1] =  232;
 					}else if(code_r[i] == '14' && Class.C('playid') == '253'){
 						code_e[0] = '11';
 						code_e[1] =  233;
 					}
         			li.data('code', code_e.slice());
                     li.setStyle('cursor:pointer');
                     this.need('s', li).click(function (e, Y){
                         Y.removeLine(Y.get(this).parent(function (el){
                             return el.nodeName.toLowerCase() == 'li';
                         }));
                     });
         		}
         	}else{
         		if (!this.isArray(code[0])) {
                     code = [code];
                 }
                 for (var i = 0, j = code.length; i < j; i++) {
                     one = code[i];
                     li = this.createLine(one);
                     if(Class.C('playid') == '249' || Class.C('playid') == '250' || Class.C('playid') == '251' || Class.C('playid') == '252' || Class.C('playid') == '253'){
                     	if(one[0] == '07' && Class.C('playid') == '249'){
                     		one[1] =  239;
             			}else if(one[0] == '08' && Class.C('playid') == '250'){
             				one[1] =  230;				
             			}else if(one[0] == '13' && Class.C('playid') == '251'){
             				one[0] = '9';
             				one[1] =  231;
     					}else if(one[0] == '14' && Class.C('playid') == '252'){
     						one[0] = '10';
     						one[1] =  232;
     					}else if(one[0] == '14' && Class.C('playid') == '253'){
     						one[0] = '11';
     						one[1] =  233;
     					}
                     }else{
                     	one[0] = one[0].replace('A','01').replace('J','11').replace('Q','12').replace('K','13');
                     }
                     li.data('code', one.slice());
                     li.setStyle('cursor:pointer');
                     this.need('s', li).click(function (e, Y){
                         Y.removeLine(Y.get(this).parent(function (el){
                             return el.nodeName.toLowerCase() == 'li';
                         }));
                     });
                 }
         	}
         }
         this.change(this.getCount());
      
    },
    createLine: function (code){//创建一行
    	var codes = code[0];
    	if(Class.C('playid') == '249'){//同花 投注篮里面显示转化
    		codes=codes.replace('00','同花包选').replace('01','黑桃单选').replace('02','红桃单选').replace('03','梅花单选').replace('04','方片单选');
    	}else if(Class.C('playid') == '250'){//同花顺
    		codes=codes.replace('00','包选').replace('01','黑桃').replace('02','红桃').replace('03','梅花').replace('04','方片');
    	}else if(Class.C('playid') == '251'){//顺子
    		codes=codes.replace('10','10JQ').replace('00','顺子包选').replace('01','A23').replace('02','234').replace('03','345')
    		.replace('04','456').replace('05','567').replace('06','678').replace('07','789').replace('08','8910').replace('09','910J')
    		.replace('11','JQK').replace('12','QKA');
    	}else if(Class.C('playid') == '252'){//豹子
    		codes=codes.replace('00','豹子包选').replace('01','AAA').replace('02','222').replace('03','333').replace('04','444')
    		.replace('05','555').replace('06','666').replace('07','777').replace('08','888').replace('09','999')
    		.replace('10','101010').replace('11','JJJ').replace('12','QQQ').replace('13','KKK');
    	}else if(Class.C('playid') == '253'){//对子
    		codes=codes.replace('00','对子包选').replace('01','AA').replace('02','22').replace('03','33').replace('04','44')
    		.replace('05','55').replace('06','66').replace('07','77').replace('08','88').replace('09','99')
    		.replace('10','1010').replace('11','JJ').replace('12','QQ').replace('13','KK');
    	}else{
    		codes = codes.replace('01','A').replace('11','J').replace('12','Q').replace('13','K');
    	}
    	var z = code.slice(-1)[0];
    	var m = z*Class.C('price') + "元";
        var lot = Class.C('lot_data')[code.slice(-2)[0]];// id
        return this.createNode('li', this.panel).html(      
            this.lineTpl.format('['+lot[0] + '] ', codes, z, m)
        );
    },
    removeLine: function (li){//删除一行
        if (li == this.prevSelectedLine) {
            this.prevSelectedLine = null;
        }
        this.removeNode(li);
        this.change(this.getCount());
    },
    clearLine: function (){//清空列表
        this.panel.empty();
        this.change(0);
//        this.bschange(1);
//        this.get('#ai_all_zs').html(0);//过滤用到
        this.prevSelectedLine = null;
        this.postMsg('msg_reset_expectlist'); //复位列表
    },
    change: function (zhushu){//变化
        this.zsSpan.html(zhushu);
        this.zhushu = zhushu;
        this.totalmoney = this.zhushu*this.beishu*Class.config('price');
        this.moneySpan.html(this.totalmoney.rmb(false,0));
        this.postMsg('msg_list_change', {
            zhushu: zhushu,
            beishu: this.beishu,
            totalmoney: this.totalmoney
        });// 广播注数变化消息, 购买选项类应该监听这个消息
    },
    bschangess: function (beishu){//变化
//        this.zsSpan.html(zhushu);
//        this.zhushu = zhushu;
    	
    	
    	Y.get("#zh_bs").val(beishu);
    	this.beishu=beishu;
    	 this.totalmoney = this.zhushu*beishu*Class.config('price');
        this.moneySpan.html(this.totalmoney.rmb(false,0));
        this.beishulistsuc=beishu;
//        this.postMsg('msg_list_change', {
//            zhushu: this.zhushu,
//            beishu: beishu,
//            totalmoney: this.totalmoney
//        });// 广播注数变化消息, 购买选项类应该监听这个消息
        $("input[mark=chkexp]").each(function(x,y){
    		if($(y).attr("checked")){
    			$(y).click();
    			$(y).click();
    		}
    	});
    },
    getCount: function (){//计算总注数
        var Y = this;
        return this.get('li', this.panel).nodes.reduce(function (a, b){
            return a + Y.attr(b, 'code').slice(-1)[0];
        }, 0);
    },
    formatCode: function (d){
      var tmp = d[0].replace(/拖/,'$').replace(/\[.*\]/g,'').replace(/[^0-9$\-,|]/g,'');
    	tmp = tmp.slice(0);//,this.C('lot_data_new')[d[1]][2]
    	if((d[1]=="249"||d[1]=="250"||d[1]=="251"||d[1]=="252"||d[1]=="253")&&tmp=="00"){
    		tmp = this.C('lot_data_new')[d[1]][0] +':'+this.C('lot_data_new')[d[1]][1]+':'+this.C('lot_data_new')[d[1]][2];
    	}else{
    		tmp += ':'+this.C('lot_data_new')[d[1]][0]+':'+this.C('lot_data_new')[d[1]][2];
    	}

    return tmp;
  },
  getData: function (){
      var arr = [];
      this.get('li', this.panel).each(function (a){
          var d = this.get(a).data('code');
          arr.push(this.formatCode(d));
      }, this);
      return {
          codes: this.noZero ? arr.join(';') : String.zero(arr.join(';')),
          zhushu: this.zhushu,
          beishu: this.beishu,
          totalmoney: this.totalmoney
      };
  }
});

//期号列表
Class('ExpectList', {
	'flag':false,
    index:function (){
        var Y = this;
        this.expectChks = [];
        this.onMsg('msg_list_change', function (data){
            this.setAllMoney(data.totalmoney);//选号有变化时同步
            this.setTotalData(data);
        });
        this.onMsg('msg_get_expect_param', function (a){
//        	this.createHTML(a);// 倒计时下载期号后构建
        	return this.getParam();//输出参数
        });
        this.onMsg('msg_load_expect_list', function (a){
            this.createHTML(a);// 倒计时下载期号后构建
        });          
        this.onMsg('msg_expect_change', function (expect, now, endtime){
            this.setCurTopmost(expect, now, endtime);
        });
        this.onMsg('msg_apply_zh', function (obj){
            this.formParam(obj);
        });
        this.onMsg('msg_buy_succeed', function (){
            this._reset();
        });
        this.onMsg('msg_reset_expectlist', function (){
            this._reset();           
        });
        this.onMsg('msg_buy_succeed_zhlist', function (){
            this.get('#expectListBox ul').each(function (tr, i){
            	var obs, ochk;
            	if(i>0){
                    obs = tr.getElementsByTagName('li')[2].getElementsByTagName('input')[0];
                    ochk =  tr.getElementsByTagName('li')[1].getElementsByTagName('input')[0];
                    obs.value = 0;
                    obs.disabled = true;
                    ochk.checked = false;
            	}
            }, this);
        });
        
        //列表事件
        
        this.get('#expectListBox').live(':text', 'keyup', function (e, Y){
        	Y.flag = false;
            var val = Math.min(2000,parseInt(this.value, 10) || 0);
            if (val != this.value) {
                this.value = val;
            }else if(/^0+/.test(this.value)){
                this.value = this.value.replace(/^0+/g,'');
            }
            if (this.getAttribute('data-prev') != val) {
                this.setAttribute('data-prev', val);
                Y.get('#zh_bs').val('').attr('data-prev', '');
                Y.bschange(this);
            }
            
        }).live(':checkbox', 'click', function (){
            var listdata = Y.postMsg('msg_get_list_data').data;
            var bs = this.parentNode.parentNode.nextSibling.getElementsByTagName('INPUT')[0];
            var bss = Y.get('#zh_bs').val() =="" ? 1 : Y.get('#zh_bs').val();
            bs.value = this.checked ? bss : 0;
            bs.disabled = !this.checked;
            Y.flag = true;
            Y.bschange(bs);
            Y.setTotalData(listdata);
        }).live(':text','focus', function (){
        	Y.flag = false;
            this.select();
            
        }).live(':text', 'blur', function (){
        	 Y.flag = false;
            if (this.value==='') {
                this.value = 1;
                Y.bschange(this);
            }
           
        });
        this.setIntInput('#zh_bs', function (){
            Y.setAllBs(Y.getInt(this.value));
        }, 1, 2000);
        this.setIntInput('#zh_bs_big', function (){
            Y.setAllBs(Y.getInt(this.value));
        }, 1, 2000);
        this.setIntInput('#zh_qs', function (){
            Y.selectMulti(Y.getInt(this.value));
        }, 0);

        this._reset(true);
        this.allmoney = 0;
        this.beishulistsuc = $("#zh_bs_big").val();
        this.buymode=1;
        this.expectlistsuc='';
        this.ZjCut = 0;
    },
    bschange: function (input){
         var tagM, listdata;
         listdata = this.postMsg('msg_get_list_data').data;
         var ids =  input.id;
         var id = ids.split("_");
         if(this.flag==false){
        	 if(input.value>0){
            	 $("#exp_"+id[1]+"_"+id[2]).attr("checked","checked");
            	// beishu = $("").val();
             }else{
            	 $("#exp_"+id[1]+"_"+id[2]).attr("checked","");
             } 
         }
         var qishu = $("#zh_qs").val(); 
         if(qishu == 1){
    		 this.totalmoney = this.zhushu*this.beishu*Class.config('price');
    	}else{
    		this.totalmoney = qishu*this.zhushu*this.beishu*Class.config('price');
    	}
         tagM = input.parentNode.nextSibling.getElementsByTagName('em')[0];
         tagM.innerHTML = this.getInt(input.value)*listdata.totalmoney;
         this.setTotalData(listdata);
     },
    setAllBs: function (bs){
        var n=0;
        var listdata = this.postMsg('msg_get_list_data').data;
        this.get('#expectListBox :text').each(function (t){
            if (!t.disabled) {
                t.value = bs  ;
                t.parentNode.nextSibling.getElementsByTagName('em')[0].innerHTML = this.getInt(t.value)*listdata.totalmoney;
                n++;
            }
        }, this);
        this.get('#expect_num').html(n);
        this.get('#sum_m').html((n*bs*2*listdata.zhushu).rmb(false,0));
        this.setTotalData(listdata);
    },
    setAllMoney: function (m){
    	var tm = 0;
        this.get('#expectListBox :text').each(function (t){
            if (!t.disabled) {
                t.parentNode.nextSibling.getElementsByTagName('em')[0].innerHTML = this.getInt(t.value, 0)*m;
                tm = tm + this.getInt(t.value, 0)*m;
                t.parentNode.nextSibling.getElementsByTagName('em')[1].innerHTML = tm;
             }
        }, this);
    },
    selectMulti: function (count){//批量选择
        var bs = this.getInt(this.get('#zh_bs').val());
        var listdata = this.postMsg('msg_get_list_data').data;
        var m = listdata.totalmoney;
        var n = count;
        this.get('#expectListBox :text').each(function (t){
            if (n) {//选中前N期
                if (t.disabled) {
                    t.disabled = false;
                    //bs = $('#zh_bs').val();
                    t.value = bs;
                    if( t.parentNode.previousSibling.getElementsByTagName('input')[0].checked = true){
                    	t.parentNode.nextSibling.getElementsByTagName('em')[0].innerHTML = this.getInt(bs)*m;
                    }
                   
                 }
                 t.parentNode.nextSibling.getElementsByTagName('em')[0].innerHTML = this.getInt(bs)*m;
                 n--;
            }else{// 取消其它期
                if (!t.disabled) {
                    t.disabled = true;
                    t.value = 0;
                    t.parentNode.previousSibling.getElementsByTagName('input')[0].checked = false;
                    t.parentNode.nextSibling.getElementsByTagName('em')[0].innerHTML = 0;
                 }                
            }
        }, this);
        var val = Math.min(this.get('#expectListBox ul').size(), count);
        this.get('#zh_qs').val(val).attr('data-prev', val);
        this.get('#zh_qs_big').val(val).attr('data-prev', val);
        this.setTotalData(listdata);
    },
    formParam: function (obj){//使用参数批量设置 {expect: bs}
        var n, m, listdata;
        n = 0;
        listdata = this.postMsg('msg_get_list_data').data;
        m = listdata.totalmoney;
        this.get('#expectListBox ul').each(function (tr){
            var bs, obs, ochk, em;
            obs = tr.getElementsByTagName('li')[2].getElementsByTagName('input')[0];
            ochk =  tr.getElementsByTagName('li')[1].getElementsByTagName('input')[0];
            em = tr.getElementsByTagName('li')[3].getElementsByTagName('em')[0];
            if (bs = obj[tr.getAttribute('expect')]) {//选中前N期
                 obs.disabled = false;
                 obs.value = bs;
                 ochk.checked = true;
                 em.innerHTML = this.getInt(bs)*m;
                 n++;
            }else{// 取消其它期
                if (!ochk.disabled) {
                    obs.disabled = true;
                    obs.value = 0;
                    ochk.checked = false;
                    em.innerHTML = 0;
                 }                
            }
        }, this);
        this.get('#zh_qs').val(n).attr('data-prev', n);
        this.get('#zh_qs_big').val(n).attr('data-prev', n);
        this.setTotalData(listdata);
    },
    setTotalData: function (listdata){//更新总期数与金额
    	 var exp_sum, bs, bslist, pr = '',c = [];
    	 exp_sum = bs =n= 0;
    	 bslist = [];
    	 exlist = [];
    	 var code = this.postMsg('msg_get_list_data').data.codes+'';
    	 if(code.indexOf(';') == -1){
    	 switch(code){
    	 case "07:12:01":
    	 c[0] = 7;
    	 break;
    	 case "08:13:01":
    	 c[0] = 8;
    	 break;
    	 case "09:14:01":
    	 c[0] = 13;
    	 break;
    	 case "10:15:01":
    	 c[0] = 14;
    	 break;
    	 case "11:16:01":
    	 c[0] = 14;
    	 break;
    	 }
    	 }
    	 var cl = code.split(";");
    	 var isyl = false;
    	 if(cl.length==1 && code.length>0){
    	 if (code.indexOf('$')>-1) {//胆拖
    	 var dt = code.split('$');
    	 pr = this.getDtPrixRange(dt[0].split(',').length, dt[1].split(',').length);
    	 }else{
    	 var len = this.getPlayId()==245? 2:this.getPlayId()==246? 3:this.getPlayId()==244? 1:code.split(',').length;
    	 pr = this.getPrixRange(len,c);
    	 }
    	 isyl = true;
    	 } 
         this.expectChks.each(function (el){
             if (el.checked) {
                 exp_sum++;
                 n = parseInt(el.parentNode.parentNode.nextSibling.getElementsByTagName('INPUT')[0].value, 10)||0;
                 bs += n;
                 el.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('em')[1].innerHTML = bs*2*listdata.zhushu;
                 if(isyl && n){
                	 var min, max, ylmin, ylmax, bonusMoney;
                	 if(pr.max){
                		 min = (pr.min*n)-(2*listdata.zhushu*bs);
                		 max = (pr.max*n)-(2*listdata.zhushu*bs);
                		 ylmin = Math.round((pr.min*n)/(2*listdata.zhushu*bs)*10000)/100+"%";
                		 ylmax = Math.round((pr.max*n)/(2*listdata.zhushu*bs)*10000)/100+"%";
                		 bonusMoney = min + "~" + max;
                		 ylstr = ylmin + "~" + ylmax;
                	 }else{
                		 min = (pr.min*n)-(2*listdata.zhushu*bs);
                		 ylmin = Math.round((pr.min*n)/(2*listdata.zhushu*bs)*10000)/100+"%";
                		 ylstr = ylmin;
                		 bonusMoney = min;
                	 }
                	 el.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = n*2*listdata.zhushu;
                	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = bonusMoney + "元"; 
                	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = ylstr; 
                 }else{
                	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = "--"; 
                	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = "--";  
                 }
                 if (n) {
                     bslist.push(n);
                     exlist.push(el.value);
                 }
             }else{
            	 el.parentNode.parentNode.nextSibling.getElementsByTagName('INPUT')[0].value = 0;	
            	 el.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = 0; 
            	 el.parentNode.parentNode.nextSibling.nextSibling.getElementsByTagName('em')[1].innerHTML = "--"; 
            	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = "--"; 
            	 el.parentNode.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.getElementsByTagName('em')[0].innerHTML = "--";  
             }          
         });
         this.setZhChk(bslist.length > 1);
         
         this.expectlistsuc = exlist.join(',');
         if($("#zh_bs_big").val()>1){
        	 this.beishulistsuc = $("#zh_bs_big").val();
        	 this.allmoney = $("#zh_bs_big").val()*2*listdata.zhushu*exp_sum;
         }else{
        	 this.beishulistsuc = bslist.join(',');
        	 this.allmoney = bs*2*listdata.zhushu*exp_sum;
         }
         this.setZhChk(bslist.length > 1);
         this.allmoney = bs*2*listdata.zhushu;
         this.expectlistsuc = exlist.join(',');
         this.beishulistsuc = bslist.join(',');

         this.get('#zh_qs').val(n).attr('data-prev', n);
         this.get('#expect_num').html(exp_sum);
         this.get('#zh_qs').val(exp_sum).attr('data-prev', exp_sum);
         this.get('#sum_m').html(this.allmoney.rmb(false,0));
     },
    setCurTopmost: function (expect, now, endtime){//当期至顶
         var n, trp;
         var listdata = this.postMsg('msg_get_list_data').data;
         this.get('#expectListBox ul').each(function (tr){
             var et = +tr.getAttribute('endtime');
             if (et <= now) {
                 tr.parentNode.removeChild(tr);
                 return
             }else if(tr.getAttribute('expect') === expect) {
                 var lab = tr.getElementsByTagName('li')[1].getElementsByTagName('label')[0];
                 lab.className ='red';
                 lab.appendChild(document.createTextNode('[当前期]'));
                 lab.getElementsByTagName('input')[0].checked = true;
                 var bsinput = tr.getElementsByTagName('li')[2].getElementsByTagName('input')[0];
                 bsinput.disabled = false;
                 bsinput.value = Y.get('#zh_bs').val();
                 tr.getElementsByTagName('li')[3].getElementsByTagName('em')[0].innerHTML = (this.getInt(bsinput.value)*listdata.totalmoney).rmb(false,0);
             }
             if (trp != tr.parentNode) {
                 trp = tr.parentNode;//今明两个表
                 n = 1;
             }
             tr.getElementsByTagName('li')[0].getElementsByTagName('span')[0].innerHTML = n++;
         }, this);
        this.expectChks = this.get('#expectListBox :checkbox');
        this.setTotalData(listdata);
     },
    getParam: function (){
       	if (this.expectlistsuc.split(",").length>1){
       		Class.C('iszh', true);
            return {
                'allmoney'	: this.allmoney,
                'beishulistsuc': this.beishulistsuc,
                'buymode': 1,
                'expectlistsuc':	this.expectlistsuc,
                'ZjCut':  this.get('#tzzh').val(),//.prop('checked') ? 1 : 0,
        		'gid':Class.C('lot_id'),// 游戏编号
    			'pid':this.expectlistsuc,// 期次编号
    			'play':1,// 玩法编号
    			'mulitys':this.beishulistsuc,// 投注倍数
       			'money':this.allmoney,// 方案金额  			
       			'zflag':this.get('#tzzh').val()////追号标志
            };    		            
    	}else{
    		Class.C('iszh', false);
    		return {
    			'allmoney'	: this.allmoney,
                'beishulistsuc': this.beishulistsuc,
                'buymode': 1,
                'expectlistsuc':	this.C('currentExpect'),
                'ZjCut':  this.get('#tzzh').prop('checked') ? 1 : 0,     
    			'gid':Class.C('lot_id'),// 游戏编号
    			'pid':$(':checkbox:checked').val(),// 期次编号this.C('currentExpect')
    			'play':1,// 玩法编号
    			'muli':this.beishulistsuc,// 投注倍数
    			'fflag':0,// 是否文件
    			'type':0,// 方案类型
    			'name':'',// 方案标题
    			'desc':'',// 方案描叙
    			'money':this.allmoney,// 方案金额
    			'tnum':1,// 方案份数
    			'bnum':1,// 购买份数
    			'pnum':0,// 保底份数
    			'oflag':0,// 公开标志
    			'wrate':0,// 提成比率
    			'comeFrom':'',// 方案来源
    			'source':'',// 投注来源
    			'endTime':'' // 截止时间
    		};
    	}    	
    },
    tableTpl:['<ul class="cm_11ydj_zhtext clear {$bg}" expect="{$expect}" endtime="{$endtime}" >'+
              '<li class="cm_w35 cm_align_center"><span>{$index}</span></li>'+
              '<li class="cm_w148"><label class="{$curCss}" for="exp_{$id}"><input type="checkbox" mark="chkexp" class="i-cr" {$chk} value="{$expect}" id="exp_{$id}"/>{$expect}期{$cur}</label></li>'+
              '<li class="cm_w83"><input type="text"  value="{$bs}" class="cm_dz_input cm_zhxg_input" name="zh" maxlength="4" id ="id_{$id}" disabled={$disabl}/>倍</li>'+
              '<li class="cm_w80"><em class="cm_red">{$m}</em>元&nbsp;<i class="cm_gray">|</i>&nbsp;<em>--</em></li>'+
              '<li class="cm_w81 cm_align_center"><em>--</em> </li>'+
              '<li class="cm_w82 cm_align_center"><em>--</em></li>'+
              '</ul>'],
    setZhChk: function (iszh){
        this.get('#zh,#tzzh').prop('checked', !!iszh);
        this.get('#tzzh').prop('disabled', !iszh);
    },

    createHTML: function (list1){
        var listdata, t1,  table;
        listdata = this.postMsg('msg_get_list_data').data;
        t1 = obj2Html.call(this, list1, listdata.totalmoney, 1);        
        table =  (t1).tpl({hide:'display:'});
        this.get('#expectListBox').html(table);
        this.expectChks = this.get('#expectListBox :checkbox');
        this.setTotalData(listdata);
        function obj2Html(obj, money, nt){
            var g, html, iscur, n;
            n = 1;
            html = [];
            for (var i = 0, j = obj.length; i < j; i++) {
                g=obj[i];
                iscur = g.iscurrent;
                g.expect = g.pid;
                g.endtime = +this.getDate(g.et);
                g.curCss = iscur ? 'red' : '';
                g.cur = iscur ? '[当前期]' : '';
                g.chk = iscur ? 'checked="checked"' : '';
                g.disabl = iscur? true:false;
                g.bs = iscur ? 1 : 0;
                g.m = money*g.bs;
                g.index = n++;
                g.id = nt+'_'+g.index;
                g.bg = n % 2 ? 'cm_bg_gray' : '';
                html[html.length] = this.tableTpl[0].tpl(g);                     
            }
            return html.join('');
        }
    },            
     _reset: function (noup){
         this.get('#zh_bs').val(1);
         this.get('#zh_bq').val(1);
         if (!noup) {
             this.selectMulti(1);
             this.setAllBs(1);         
         }
     }
});


//追号计划
Class('BuyProject', {
    index:function (){
        this.addMsg();
       // this.setIntInput('#zh_tabs1 :text', this.getNoop(), 1);
        this.setIntInput('#zh_tabs2 :text', this.getNoop(), 1);
        this.assignDom();//分配UI
        this.onMsg('gjzh_cs_change', function (expect, now, et){
        	this.reset(null);
        });
    },
    addMsg: function (){
    	this.onMsg('msg_load_expect_list', function (list1){
            var opts = this.one('#jh_opts').options;
            opts.length = 0;
            list1.each(function (item){
                opts.add(new Option(item.pid + (item.iscurrent ? '' : ''), item.pid, 0, 0))
            });
            this.get('#maxJhZh').html(opts.length);
            this.get('#maxJhZh2').html(opts.length);
        });        	    	
        this.onMsg('msg_expect_change', function (expect, now, et){
            var opts, arr, sel;//变换追号下拉列表
            arr=[];
            sel = this.one('#jh_opts');
            /*if(sel == "on"){
            	Y.alert("数据异常");
            	return false;
            }*/
            opts = sel.options;
            for (var i =  opts.length; i--;) {
                arr[i] = opts[i]
            }
            arr.each(function (o,i){
                if (o.value < expect) {
                    sel.removeChild(o);
                }else if(o.value == expect){
                    o.text = expect;
                }                
            });
            this.get('#maxJhZh').html(opts.length);
        })
    },
    assignDom:function (){
        this.mult = this.one('#jh_bs');
        this.expect = this.one('#jh_qs');
        this.expectChks = this.get('#expectListBox :checkbox');
        this.icPanel = this.one('#expectListBox');
        this.showResult = this.one('#jh_show');
        this.pay = this.one('#buy_jh');
        this.sumIncomeBtn = this.one('#ljyl');
        this.sumIncome = this.one('#jh_ljyl');
        this.fullIncomeBtn = this.one('#qcyl');
        this.fullIncome = this.one('#jh_qcyl');
        this.beforeIncomeBtn = this.one('#qqyl');
        this.beforeExpect = this.one('#jh_before');
        this.beforeIncome = this.one('#jh_bm');
        this.backIncome = this.one('#jh_am');
        this.data = [];
        this.init();
    },
	getHTML: function() {
        var ini, cdata;
        cdata = this.postMsg('msg_get_list_data').data;
        ini = this.getIni();
		if (this.expect.value == '') return this.alert('您好，请输入投入期数！');
		if (this.mult.value == '') return this.alert('您好，请输入起始倍数！');
		if (this.fullIncomeBtn.checked) {
			if (this.fullIncome.value == '') return alert('您好，请输入全程收益率！');
		};
		var len, pr, dt, buyMoney = cdata.zhushu * 2;
        var code = this.postMsg('msg_get_list_data').data.codes+'';
    	var len = code.split(',').length;
        pr =  this.getPrixRange(len);  
		var bonusMoney = pr.max ? pr.max : pr.min;
		var bs = this.mult.value;
		var l = +this.expect.value;
		var base1 = false,
		base2 = false,
		base3 = false;
		var pre = l;
		base1 = bonusMoney / (1 + this.fullIncome.value / 100) - buyMoney;
		base2 = 1.1;
		if (this.beforeIncomeBtn.checked) {
			if (this.beforeExpect.value == '') return this.alert("您好，请输入前几期追号期数！");
			if (this.beforeIncome.value == '') return this.alert('您好，请输入前几期的预定收益率！');
			if (this.backIncome.value == '') return this.alert('您好，请输入前几期之后收益率！');
			pre = this.beforeExpect.value;
			base1 = bonusMoney / (1 + this.beforeIncome.value / 100) - buyMoney;
			base2 = bonusMoney / (1 + this.backIncome.value / 100) - buyMoney;
		};
		if (base1 < 1 || base2 < 1) return this.alert('您好，您的当前方案不适合倍投！');
		if (this.sumIncomeBtn.checked) {
			if (this.sumIncome.value == "") return this.alert("您好，请输入累计收益的最小金额！");
			var minMoney = +this.sumIncome.value;
			base3 = bonusMoney - buyMoney;
			if (base3 <= 0) return this.alert('您好，您的当前方案不适合倍投！');
		};
		var a = [], sum = 0, m1, m2, o;
        var sel = this.get('#jh_opts');
        var opts = sel.one().options;
        var startIndex = sel.prop('selectedIndex');
        if (this.sumIncomeBtn.checked){
        	if(this.sumIncomeBtn.value == "on"){
        		Y.alert("生成倍数参数有误");
        		return false;
        	}
        	
        		base1=false;
       			bs =1;
       			m1 = buyMoney * bs;
       			sum += m1;
       			m2 = bonusMoney * bs;
                   var opt = opts[startIndex++];
                   if (opt) {
                   	a[0] = {
                           index: 1,
                           expect: opt.text.replace("[当前期]",""),
                           bg: '#F5F5F5',
                           cur: opt.text.indexOf('[') > -1 ? 'red' : '',
                           mult: bs,
                           curIn: m1,
                           sumIn: sum,
                           curPut: m2,
                           sumPut: m2 - sum,
                           income: Math.round((m2 - sum) / sum * 10000) / 100
                       }                
                   }
            for (var i = 1; i < l; i++) {
    			
    			bs = Math.max(bs, base1 ? Math.ceil((sum / (i < pre ? base1: base2)).toFixed(4)) : 0, base3 ? Math.ceil((sum + minMoney) / base3) : 0);
    			if (bs > 1000000) {
                    return this.alert('您好，您的当前方案倍投已超出盈利范围！');
                }
    			m1 = buyMoney * bs;
    			sum += m1;
    			m2 = bonusMoney * bs;
                var opt = opts[startIndex++];
                if (opt) {
                	a[i] = {
                        index: i+1,
                        expect: opt.text.replace("[当前期]",""),
                        bg: i%2 ? '#F5F5F5' : '',
                        cur: opt.text.indexOf('[') > -1 ? 'red' : '',
                        mult: bs,
                        curIn: m1,
                        sumIn: sum,
                        curPut: m2,
                        sumPut: m2 - sum,
                        income: Math.round((m2 - sum) / sum * 10000) / 100
                    }                
                }
    		};
				
		}else{
			for (var i = 0; i < l; i++) {
				
				bs = Math.max(bs, base1 ? Math.ceil((sum / (i < pre ? base1: base2)).toFixed(4)) : 0, base3 ? Math.ceil((sum + minMoney) / base3) : 0);
				if (bs > 1000000) {
	                return this.alert('您好，您的当前方案倍投已超出盈利范围！');
	            }
				m1 = buyMoney * bs;
				sum += m1;
				m2 = bonusMoney * bs;
	            var opt = opts[startIndex++];
	            if (opt) {
	                a[i] = {
	                    index: i+1,
	                    expect: opt.text.replace("[当前期]",""),
	                    bg: i%2 ? '#F5F5F5' : '',
	                    cur: opt.text.indexOf('[') > -1 ? 'red' : '',
	                    mult: bs,
	                    curIn: m1,
	                    sumIn: sum,
	                    curPut: m2,
	                    sumPut: m2 - sum,
	                    income: Math.round((m2 - sum) / sum * 10000) / 100
	                }                
	            }
			};
		}
    	
	
		return a;
	},
	show: function(data) {
		var cdata = [];
		if (this.isArray(data)){
			 this.get('#expectListBox :checkbox').each(function (el,i){
				 cdata[i] = el;
				 el.checked = false;
			 });
			 for (var i = 0; i < data.length; ++i){
				 var el = cdata[i];
				 if(el.value==data[i].expect){
				     el.checked = true;
				     el.parentNode.parentNode.nextSibling.getElementsByTagName('INPUT')[0].value = data[i].mult;				     
				 }
			 }
	        var listdata = this.postMsg('msg_get_list_data').data;
	        this.postMsg('msg_list_change', listdata);
        } 
	},
	init: function() { 
        var oldSet, Y, ini;
		oldSet = {};
		Y = this;
		this.showResult.onclick = function() {
            var listdata = Y.postMsg('msg_get_list_data').data;
            if(listdata.zhushu>1){
            	Y.postMsg("msg_buy_succeed_zhlist");
            	Y.alert("您好，高级追号功能只支持单注投注方案!");
            	return false;
            }else if(listdata.zhushu<1){
            	Y.postMsg("msg_buy_succeed_zhlist");
            	Y.alert("请选择投注内容或机选号码后，再使用高级追号功能!");
            	return false;
            }  	
			Y.show(Y.getHTML());
		};
		this.sumIncomeBtn.onclick = function() {
			Y.sumIncome.disabled = !this.checked;

			Y.fullIncomeBtn.checked=!this.checked;
			Y.beforeIncomeBtn.checked=!this.checked;
			Y.fullIncome.disabled = !Y.fullIncomeBtn.checked;
			Y.beforeExpect.disabled = Y.beforeIncome.disabled = Y.backIncome.disabled = !Y.beforeIncomeBtn.checked;
			
		};
		this.fullIncomeBtn.onclick = this.beforeIncomeBtn.onclick = function() {
			Y.fullIncome.disabled = !Y.fullIncomeBtn.checked;
			Y.beforeExpect.disabled = Y.beforeIncome.disabled = Y.backIncome.disabled = !Y.beforeIncomeBtn.checked;
			Y.sumIncomeBtn.checked=!this.checked;
		};
	},
    reset: function (info){
    	this.fullIncomeBtn.checked = true;
		this.mult.value = 1;
		this.expect.value =  10;
		this.fullIncome.value = 50;
		this.beforeExpect.value = 5;
		this.beforeIncome.value = 50;
		this.backIncome.value = 50;
		this.sumIncome.value = 100;
    }
});



Class('openCodeList', {
	omissionurl:"/cpdata/omi/" + Class.C('lot_id') + "/miss.xml?rnd=" + Math.random(),
//	winlisturl:"/trade/ranking.go?find=" + Class.C('lot_id') + "&name=today&rnd=" + Math.random(),
//	castlisturl:"/user/querycastlist.go?gid=" + Class.C('lot_id') + "&rnd=" + Math.random(),
    index:function (){
    	this.clock = new this.lib.CountDown();
    	this.listdata=[];
		this.edata;
		this.checkTimer;
		this.onMsg('opencodelist_getlistdata', function() {
			this.getlistdata(this.postlist);
		});
		this.onMsg('update_userinfodata', function() {
			this.getlistdata(this.postlist);
		});
		this.onMsg('show_opencodelist', function(n) {
			this.showlist(n);
		});
		this.onMsg('update_opencodelist', function() {
			this.checkpid();
		});
		this.createDayOpenCodeHtml();
    },
    postlist: function (n){
    	Y.postMsg('show_opencodelist', n);
    },
    getlistdata: function (fn){
        this.ajax({
            url:this.omissionurl,
            retry:1,
            end:function (data, i){
                this.qXml('//p', data.xml, function (o, i){                	
                	var day = Y.getDate(data.date).format('YYMMDD');
                	var pid = o.items.p;
                	var c = o.items.c;
                	var pd = pid.substr(0,8);
                	pid = pid.substr(8,2);
//                	alert("pd="+pd+" day="+day);
                	if(pd==day){
                		$("#dopencode"+pid).html(c);
                	}
                	if (c!=""){
                		this.listdata[this.listdata.length] = o.items;
                	}                	
                });
                if (this.isFunction(fn)) {
                    fn.call(this, 1);
                    this.updateDayOpenCode(data.date);
                }
            }
        	
        });
    },
   
    showlist: function (n){//显示开奖号码列表 球
    	clearInterval(window.refreshKjTime);
    	var pid = this.getPlayId();
    	var dl = this.listdata.length;
    	var lpid = this.listdata[dl-1];// 获取listdata里面的最后一个的（ 遗漏） 
    	var llpid = this.listdata[dl-1];// 获取listdata里面的最后一个的（ 遗漏） 
    	var npid = this.getnextpid(lpid.p);//准备开奖的期次	2013022608
    	var net;
    	if((npid+"").substr(8,2)=="01"){
    		net = (Y.getDate(Date.parse(Y.getDate(lpid.t))+1000*60*60*24).format('YY-MM-DD')) + " 09:10:00";
    	}else{
    		net = (Y.getDate(Date.parse(Y.getDate(lpid.t))+1000*60*10).format('YY-MM-DD hh:mm:ss'));//2013-02-26 10:20:00
    	}
    	
    	
		this.get('#lastopenexpect').html('{1}'.format(llpid.p));  
		this.get('#lastopendata').html('（{1}）'.format(llpid.t));
		var ctpl = ' <em class="px3_i_{1}"></em><em class="px3_i_{2}"></em><em class="px3_i_{3}"></em>';
		var llcc=llpid.c.split(",");
		this.get('#lastopencode').html(ctpl.format(llcc[0],llcc[1],llcc[2]));  
//    	alert("npid="+npid+" \r\n this.C('currentExpect')"+this.C('currentExpect'));
    	var st = 0; //开奖倒计时
    	if(npid!=this.C('currentExpect')){
    		st = 1; //开奖倒计时
    		this.get('#lastopenexpect').html('{1} '.format(lpid.p));    		
    		var ctpl = ' <em class="px3_i_{1}"></em><em class="px3_i_{2}"></em><em class="px3_i_{3}"></em>';
    		var llcc=llpid.c.split(",");
    		this.get('#lastopencode').html(ctpl.format(llcc[0],llcc[1],llcc[2]));  
    	}
    	
		this.get('#kaijiangexpect').html('');    		
		var ctpl = ' <em class="px3_i_{1}"></em><em class="px3_i_{2}"></em><em class="px3_i_{3}"></em>';
		var cc=lpid.c.split(",");
		this.get('#kaijiangopencode').html('');       
//		this.get('#kaijianginfo').html('<span>前一：</span><s id="qian1">{1}</s><span>前二：</span><s id="qian2">{2}</s><span>前三：</span><s id="qian3">{3}</s>'.format(cc[0],cc[0]+'&nbsp;&nbsp;'+cc[1],cc[0]+'&nbsp;&nbsp;'+cc[1]+'&nbsp;&nbsp;'+cc[2]));
    	
    	
    	var ld = this.listdata.slice(dl-(9-0), dl);//列表里面的所以值 都在ld里面
    	for(var i=0; i<ld.length; i++){
    		var ul = "";
    		if(pid == 249){//同花
    			ul = this.get('[mark=opencodebox]', "#opencodelist_1").slice(i);
    		}else if(pid == 250){//同花顺
    			ul = this.get('[mark=opencodebox]', "#opencodelist_2").slice(i);
    		}else if(pid == 251){//顺子
    			ul = this.get('[mark=opencodebox]', "#opencodelist_3").slice(i);
    		}else if(pid == 252){//豹子
    			ul = this.get('[mark=opencodebox]', "#opencodelist_4").slice(i);
    		}else if(pid == 253){//对子
    			ul = this.get('[mark=opencodebox]', "#opencodelist_5").slice(i);
    		}else{
    			ul = this.get('[mark=opencodebox]', "#opencodelist").slice(i);
    		}
    		//ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","");
        	
        	if(i%1==0){
        		ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","");
        	}else{
        		ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","");
        	}
        	
        	//ul.removeClass("cm_11ydj_text_hover").addClass("cm_11ydj_text_text");
        	//var castinfolist = this.get('.cm_11ydj_text_xlhover div', ul);
        	//castinfolist.html("");
        	var opencode = ld[i].c;
        	var opentime = ld[i].t;
        	
        	var omissdata = ld[i].m0;
        	var opencodelen = 3;
        	var omissall=0;
        	if(pid==249){ //同花
        		omissdata = ld[i].m1;
        		omissall = ld[i].m6;
        	}
        	else if (pid==250){ //同花顺
        		omissdata = ld[i].m2;
        		omissall = ld[i].m7;
        	}
        	else if (pid==251){
        		omissdata = ld[i].m3;//前三直选遗漏
        		omissall = ld[i].m8;
        	}
        	else if (pid==252){
        		omissdata = ld[i].m4;
        		omissall = ld[i].m9;
        	}else if (pid==253){
        		omissdata = ld[i].m5;
        		omissall = ld[i].m10;
        	}
        	if(opencode!=""){
        		this.get('td', ul).slice(0,1).html("" + ld[i].p + "");//填写开奖期号的位置
            	this.showomiss(omissdata, opencodelen, opencode, ul,opentime,omissall); //加载遗漏
        		
        	}else{
        		this.countdown(ld[i].t, ld[i].p, ul);
        	}
    	}
    	
//    	alert("st="+st);
		if(st==1){//拉金矿
    		this.countdown(net, npid, ul);    		
    	}
    	
//    	this.showcastlist();
    	
    },
    showomiss: function(data, opencodelen, opencode, ul,opentime,omissall){//填遗漏  (遗漏 ， 开奖号码 长度，开奖号码，指定那一行)
    	var pid = this.getPlayId();
    	ul.attr("ost",1);
    	var omiss_arr = data.split(',');
    	var opencode_arr = opencode.split(',').slice(0, opencodelen);
    	var xuanhao = this.get('td', ul);
    	var opencodeli = "";
    	opencodeli = this.get('td', ul).slice(1,2);//填写开奖号码的位置
    	var codels = '<span class="PK_{1}"></span><span class="PK_{2}"></span><span class="PK_{3}"></span>';
		var llcc=opencode.split(",");
		this.get(opencodeli).html(codels.format(llcc[0],llcc[1],llcc[2]));  
    	if(pid == 249){
    		omissall=omissall==0?"<i class=tongh>同花</i>":omissall
    		this.get('td', ul).slice(2,3).html(omissall);
    		var newxh=this.get('td', ul).slice(3,7);
    		newxh.each(function (li, i){
        		if(omiss_arr[i]==25){
        			switch(i){
					case 0:
						omiss_arr[i]="<i class='white'><small class=heitao></small></i>"
						break;
					case 1:
						omiss_arr[i]="<i class='white'><small class=hongtao></small></i>"
						break;
					case 2:
						omiss_arr[i]="<i class='white'><small class=meihua></small></i>"
						break;
					case 3:
						omiss_arr[i]="<i class='white'><small class=fangkuai></small></i>"
						break;
					
        			}
        		}
    			this.get(li).html(omiss_arr[i]);

    		})
    	}else if(pid == 250){
    		omissall=omissall==0?"<i class=tongh>同花顺</i>":omissall
    	    		this.get('td', ul).slice(2,3).html(omissall);
    	    		var newxh=this.get('td', ul).slice(3,7);
    	    		newxh.each(function (li, i){
    	        		if(omiss_arr[i]==0){
    	        			switch(i){
    	        			case 0:
    							omiss_arr[i]="<small class=heitao></small>"
    							break;
    						case 1:
    							omiss_arr[i]="<small class=hongtao></small>"
    							break;
    						case 2:
    							omiss_arr[i]="<small class=meihua></small>"
    							break;
    						case 3:
    							omiss_arr[i]="<small class=fangkuai></small>"
    							break;
    	        			}
    	        		}
    	    			this.get(li).html(omiss_arr[i]);

    	    		})
	    	}else if(pid == 251){
	    		omissall=omissall==0?"<i class=tongh>顺子</i>":omissall
	    		this.get('td', ul).slice(2,3).html(omissall);
	    		var newxh=this.get('td', ul).slice(3,16);
	    		newxh.each(function (li, i){
	        		if(omiss_arr[i]==0){
						
	        			omiss_arr[i]="<i class=tongh>"+((i+1)+""+(i+2)+""+(i+3)).replace('1','A').replace('11','J').replace('12','Q').replace('13','K').replace('A0','10')+"</i>"
	        		}
	    			this.get(li).html(omiss_arr[i]);

	    		})
	    	}else if(pid == 252){
	    		omissall=omissall==0?"<i class=tongh>豹子</i>":omissall
	    	    		this.get('td', ul).slice(2,3).html(omissall);
	    	    		var newxh=this.get('td', ul).slice(3,17);
	    	    		newxh.each(function (li, i){
	    	        		if(omiss_arr[i]==0){
	    						
	    	        			omiss_arr[i]="<i class=tongh>"+((i+1)+""+(i+1)+""+(i+1)).replace('1','A').replace('11','J').replace('12','Q').replace('13','K').replace('A0','10')+"</i>"
	    	        		}
	    	    			this.get(li).html(omiss_arr[i]);

	    	    		})
	    	}
	    	else if(pid == 253){
	    		omissall=omissall==0?"<i class=tongh>对子</i>":omissall
	    	    		this.get('td', ul).slice(2,3).html(omissall);
	    	    		var newxh=this.get('td', ul).slice(3,17);
	    	    		newxh.each(function (li, i){
	    	        		if(omiss_arr[i]==0){
	    						
	    	        			omiss_arr[i]="<i class=tongh>"+((i+1)+""+(i+1)).replace('1','A').replace('11','J').replace('12','Q').replace('13','K').replace('A0','10')+"</i>"
	    	        		}
	    	    			this.get(li).html(omiss_arr[i]);

	    	    		})
	    	
    	}else{
    		
    		var newxh=this.get('td', ul).slice(2,15);
    		newxh.each(function (li, i){
        		this.get(li).html(omiss_arr[i]);
        		var c = String.zero(i + 1);
        		var ocodearr=(opencode_arr[0]+"").substr(1,2)+","+(opencode_arr[1]+"").substr(1,2)+","+(opencode_arr[2]+"").substr(1,2);
        		if(ocodearr.indexOf(c)!=-1){
        			c=(c*1)+"";
        			this.get(li).html('<i>'+	c.replace('1','A').replace('A1','J').replace('A2','Q').replace('A3','K').replace('A0','10')+'</i>');
        			
        		}else{
        		}
        	});
    	}
    
    },
    countdown: function(ed, pid,  ul){//截至时间、开奖期次
    	pid = pid + "";
    	this.ajax({
			url : "/cpdata/time.json?" + Math.random(),
			retry:1,
			cache: false,//是否缓存
			end : function(data, i) {
				this.edata = data.date;
				var et =(Y.getDate(Date.parse(Y.getDate(ed))+1000*95).format('YY-MM-DD hh:mm:ss'));
		    	this.clock.end('loading...');
				var diff=this.getDate(et) - this.getDate(this.edata);
		    	var ctpl = ' <b >{2}:{3}:{4} </b>';
		    	
		    	var timebar= this.get('#kaijiangexpect').show();
		    	 timebar.html(pid);
				this.get('#kaijiangopencode').html('');
				if (diff > 0){
					clearInterval(window.refreshKjTime);
					var __oncd = {
		                    endTime: et,
		                    change:function (times, now){
								var lt = times[1]*60*60 + times[2]*60 + times[3];
		                        var wlt = lt>314 ? 314:lt;
	
								this.get('#kaijiangopencode').html( '{3}:{4}'.format.apply('<p>{3}:{4}后开奖</p><strong><em style="width:'+wlt+'px"></em></strong>', times).replace(/\b\d\b/g,'0$&'));
		                    	if (lt==0 ||lt==1){
		                        	
									this.get('#kaijiangopencode').html('正在开奖……');
									clearInterval(window.refreshKjTime);
									window.refreshKjTime = setInterval(
											function(){
												Y.postMsg('opencodelist_getlistdata');
									}, 1000 * 10);
		                        }
		                    }                
		                };
					this.clock.add(__oncd);  
					this.clock.play(this.edata);             
				}else{
					this.get('#kaijiangopencode').html('正在开奖……');    
//					timebar.html('<em>'+pid+'</em> 期'+ '<b >正在开奖……</b>');
					clearInterval(window.refreshKjTime);
					window.refreshKjTime = setInterval(
							function(){
								Y.postMsg('update_opencodelist');
					}, 1000 * 10);
				}				
			}
		});    	

    },
    checkpid: function(){
    	this.getlistdata();
    	var ld = this.listdata.slice(this.listdata.length-1);
    	var opencode = ld[0].c;
    	if(opencode!=""){
    		Y.postMsg('show_opencodelist');	
    	}
    },
    getnextpid: function(pid){
    	var ldate = pid.substr(0, 8);//年月日 
    	var lpid = pid.substr(8);//期次
    	var npid = "";
    	if(lpid==Class.C('sump')){//判断是不是最后一期
    		var dt = ldate.substr(0,4) + "-" + ldate.substr(4,2) + "-" + ldate.substr(6,2) + " 00:00:00";
    		var ndate = Y.getDate(Date.parse(Y.getDate(dt))+1000*60*60*24).format('YYMMDD');
    		npid = ndate + "01";
    	}else{
    		npid = pid * 1 + 1;
    	}
    	return npid;
    },
  
    showcastinfo: function(){
    	var pid = this.getPlayId();
    	if(pid == 245){
    		this.get('.cm_11ydj_st,.cm_11ydj_jz,.cm_11ydj_st_gray,.cm_11ydj_qb,.cm_11ydj_jz_gray,.cm_11ydj_qb_gray', "#opencodelist_2").each(function (casttag, i){
        		this.get(casttag).un('click');
    			this.get(casttag).click(function (){
    				var castinfo = Y.get(casttag.parentNode.parentNode.parentNode.nextSibling);
    				var ul = Y.get(casttag.parentNode.parentNode.parentNode.parentNode);
    				if(castinfo.getStyle("display")=="none"){ 
    					ul.addClass("cm_11ydj_text_hover").removeClass("cm_11ydj_text_text");
    					castinfo.show(); 
    				} 
    	            else {
    	            	ul.removeClass("cm_11ydj_text_hover").addClass("cm_11ydj_text_text");
    	            	castinfo.hide();
    	            }
    			}); 
        	});
    	}else if(pid == 246){
    		this.get('.cm_11ydj_st,.cm_11ydj_jz,.cm_11ydj_st_gray,.cm_11ydj_qb,.cm_11ydj_jz_gray,.cm_11ydj_qb_gray', "#opencodelist_3").each(function (casttag, i){
        		this.get(casttag).un('click');
    			this.get(casttag).click(function (){
    				var castinfo = Y.get(casttag.parentNode.parentNode.parentNode.nextSibling);
    				var ul = Y.get(casttag.parentNode.parentNode.parentNode.parentNode);
    				if(castinfo.getStyle("display")=="none"){ 
    					ul.addClass("cm_11ydj_text_hover").removeClass("cm_11ydj_text_text");
    					castinfo.show(); 
    				} 
    	            else {
    	            	ul.removeClass("cm_11ydj_text_hover").addClass("cm_11ydj_text_text");
    	            	castinfo.hide();
    	            }
    			}); 
        	});
    	}else{
    		this.get('.cm_11ydj_st,.cm_11ydj_jz,.cm_11ydj_st_gray,.cm_11ydj_qb,.cm_11ydj_jz_gray,.cm_11ydj_qb_gray', "#opencodelist").each(function (casttag, i){
        		this.get(casttag).un('click');
    			this.get(casttag).click(function (){
    				var castinfo = Y.get(casttag.parentNode.parentNode.parentNode.nextSibling);
    				var ul = Y.get(casttag.parentNode.parentNode.parentNode.parentNode);
    				if(castinfo.getStyle("display")=="none"){ 
    					ul.addClass("cm_11ydj_text_hover").removeClass("cm_11ydj_text_text");
    					castinfo.show(); 
    				} 
    	            else {
    	            	ul.removeClass("cm_11ydj_text_hover").addClass("cm_11ydj_text_text");
    	            	castinfo.hide();
    	            }
    			}); 
        	});
    	}
    	
    	var id = Y.getPlayId()*1;
    	var opencode_n = "";
    	if(id == 245){
    		opencode_n = this.get('.opencodebox[ol=1]', "#opencodelist_2");
    		
    	}else if(id == 246){
    		opencode_n = this.get('.opencodebox[ol=1]', "#opencodelist_3");
    	}else{
    		opencode_n = this.get('.opencodebox[ol=1]', "#opencodelist");
    	}
    	opencode_n.each(function (ul, i){
    		var codes_arr = this.get(ul).attr("codes").split(":");
    		var playid = codes_arr[1];
    		var codestr = codes_arr[0].replace("$",",");
    		var code_arr = "";
    		if(id == 455 || id == 246){
    			code_arr = codestr.split("|");
    		}else{
    			code_arr = codestr.split(",");
    		}
    		var isshow=0;
            switch(id){
            case 244:
            	if(playid=='01'){
            		isshow=1;
        		}
            	break;
            case 245:
            	if(playid=='09'){
            		isshow=1;   		
        		}
            	break;
            case 246:
            	if(playid=='10'){
            		isshow=1;   		
        		}
            	break;
            case 247:
            	if(playid=='11'){
            		isshow=1;   		
        		}
            	break;
            case 248:
            	if(playid=='12'){
            		isshow=1;		
        		}
            	break;
            case 249:
            case 250:
            case 251:
            case 252:
            case 253:
            case 254:
            case 255:
                if(Y.getInt(playid)>1 && Y.getInt(playid)<9){
                	isshow=1;            		
                }
                break;
            }
    		if(isshow==1){
    			var xuanhao = this.get('.cm_left>li em', ul);
    			if(id == 245){
    				var qian1 = xuanhao.slice(0,11);
    				var qian2 = xuanhao.slice(11,22);
    				qian1.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr[0].indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    				qian2.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr[1].indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    			}else if(id == 246){
    				var qian1 = xuanhao.slice(0,11);
    				var qian2 = xuanhao.slice(11,22);
    				var qian3 = xuanhao.slice(22,33);
    				qian1.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr[0].indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    				qian2.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr[1].indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    				qian3.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr[2].indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    			}else{
    				xuanhao.each(function (li, i){
                		var c = String.zero(i + 1);
                		if(code_arr.indexOf(c)!=-1){
                			var css = this.get(li).attr("class");
                			if(css=="cm_11ydj_redball"){
                				this.get(li).addClass("cm_11ydj_redball2");
                			}else{
                				this.get(li).addClass("cm_11ydj_num");
                			}
                		}
                	});
    			}
    		}
    	});
    },
    createDayOpenCodeHtml: function(){
    	var htm = "";
        for(var i=1;i<16;i++){
    		htm+="<tr><th id=span0"+String.zero(i)+">"+String.zero(i)+"</th><td id=dopencode0"+String.zero(i)+">&nbsp;</td>";
    		htm+="<th id=span0"+(15+i)+">"+(15+i)+"</th><td id=dopencode0"+(15+i)+">&nbsp;</td>"+
    			 "<th id=span0"+(30+i)+">"+(30+i)+"</th><td id=dopencode0"+(30+i)+">&nbsp;</td>"+
    		     "<th id=span0"+(45+i)+">"+(45+i)+"</th><td id=dopencode0"+(45+i)+">&nbsp;</td>";
    		htm+="<th id=span"+(60+i)+">"+(60+i)+"</th><td id=dopencode"+(60+i)+">&nbsp;</td>";
	        if(75+i<=79){
	        	htm+="<th id=span0"+(75+i)+">"+(75+i)+"</th><td id=dopencode0"+(75+i)+">&nbsp;</td>";
	        }else{
	        	htm+="<th >&nbsp;</th><td >&nbsp;</td>";
	        }
	       
    	}
     	
        $("#kaijiang").html(htm);
     	$("#dopencode80").html("");
    },
    updateDayOpenCode: function(d){	
    	var riqi2 = Y.getDate(d).format('YYMMDD');
		this.ajax({
			url:"/cpdata/game/"+ Class.C('lot_id') +"/day/"+riqi2+".json",
			type : "get",
			cache:false,
			dataType : "json",
			end : function(data) {
				var obj = eval("(" + data.text + ")");				
				var r = obj.rows.row;
				r.each(function(rt,o) {
					var pid = rt.pid.substr(6,2);
					var codes = rt.codes;
					var at = rt.at;
					codes=codes.split(",");
					var ntype=Y.kjtype(codes,pid);
					$("#dopencode0"+pid).html('<span class="PK_'+codes[0]+'"></span><span class="PK_'+codes[1]+'"></span><span class="PK_'+codes[2]+'"></span>'+ntype);
				});
			}
		});
    },
    
});
