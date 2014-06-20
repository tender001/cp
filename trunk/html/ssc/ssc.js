// 全局配置
Class.C('sump', 120);
Class.C('play_type', 'x1');
Class.C('choose_type', 'pt');
Class.C('lot_name', 'ssc');
Class.C('lot_name_ch', '时时彩');
Class.C('lot_name_en', 'ssc');
Class.C('lot_id', '04');
Class.C('price', 2);
Class.C('playid', 105);
Class.C('fsfq', $_trade.url.pcast);
Class.C('fszh', $_trade.url.zcast);
Class.C('userMoney', 0);
Class.C('zxhz', [1,1,2,3,4,5,7,8,10,12,13,14,15,15,15,15,14,13,12,10,8,7,5,4,3,2,1,1]);
Class.C('zxhz2', [1,1,2,2,3,3,4,4,5,5,5,4,4,3,3,2,2,1,1]);

Class.C('lot_data',{// name, money, len, isZhx, min-zs
	124: ['五星通选', 20440, 5, true],
    104: ['五星直选',100000, 5, true],
    112: ['五星单式', 100000, 5, true],
    113: ['三星直选', 1000, 3, true],
    149: ['三星组三', 320, 3],// z3:320
    150: ['三星组六', 160, 3],// z6:160
    114: ['二星直选', 100, 2, true],
    117: ['二星组选', 50, 2],
    105: ['三星直选', 1000, 3, true],
    144: ['三星组合', 1000, 3, false, 6],
    145: ['三星组三',320, 2, false, 1],
    146: ['三星组六', 160, 3],
    106: ['二星直选',100, 2, true],
    116: ['二星组选',50, 2],
    118: ['二星组选和值',50, 1],
    107: ['一星复式',10, 1, true],
    108: ['五星组合', 101110, 5, true, 4],// r5
    109: ['三星组合', 1110, 3, true, 3],
    110: ['二星组合', 110, 2, true, 2],
    111: ['大小单双', 4, 2]
});

Class.C('lot_data_new',{// 老玩法ID, 新库中玩法ID, 投注方式 (1单复式 2单复式 3包号 4和值 5胆拖)
    124: [12,1],// 五星通选
    104: [ 1,1], // 五星
    112: [ 1,1], // 五星
    105: [ 3,1, 4],// 三星
    113: [ 3,1, 4],// 三星
    108: [13,1],// 五星复选
    109: [15,1,4],// 三星复选
    110: [16,1,6],// 两星复选
    107: [ 5,1,8],// 一星
    111: [ 6,1],// 大小单双
	106: [ 4,1,6],// 二星
	114: [ 4,1,6],//二星直选单式
	117: [ 7,1],//二星组选单式
    116: [ 7,3],// 二星组选复式
	118: [ 7,4], // 二星组选和值
	146: [ 9,3], // 三星组六
	145: [ 8,3], // 三星组三
	149: [ 8,1],// 三星组三单式
	150: [ 9,1] // 三星组六单式
});
Class.C('lot_data_wanfa',{
    116: '二星组选玩法：至少选择2个号码，猜中开奖号码的最后2位即中奖50元（不含对子）。',
    107: '一星直选玩法：从10个号码中选1个号码。1/10的中奖机会，奖金10元。',
    106: '二星直选玩法：每位至少选1个号码，与开奖号码最后2位按位相符即中奖100元。',
    105: '三星直选玩法：每位至少选择1个号码,与开奖号码后3位按位相符即中奖1000元。',
    104: '五星直选玩法：每位至少选1个号码，与开奖号的全部5个号码按位相符即中奖100,000元。 ',
    124: '五星通选玩法：每位至少选1个号码,与开奖号全部按位相符中20440元；与前三或后三位按位相符中220元；与前二或后二位按位相符中20元,兼中兼得。',// r4
    118: '二星和值玩法：至少选择1个和值，猜中开奖号最后2位数字之和，奖金50元（对子奖金100元）。',// r5
    111: '大小单双玩法：大小单双：每位选择1个属性，同时猜中开奖号十位和个位的大小单双属性即中奖4元。'// r6
});
Class.C('lot_sub',{// 
	124: ['_add124', '#xs_5xtx', '#wxtx_area', '5xtx',4,14],    //五星通选
	104: ['_add104', '#xs_5xzx', '#wxzx_area', '5xzx',9,1],     //五星直选
	105: ['_add105', '#xs_3xzx', '#sxzx_area','3xzx',1,6],      //三星直选
	145: ['_add145', '#xs_3xz3', '#sxzsbh_area','3xz3',8,1],    //三星组三
	146: ['_add146', '#xs_3xz6', '#sxzxl_area','3xz6',8,1],     //三星组六
	106: ['_add106', '#xs_2xzx', '#exzx_area','2xzx',8,1],      //二星直选复式
	116: ['_add116', '#xs_2xzux', '#exzux_area','2xzux',8,1],   //二星组选复式
	118: ['_add118', '#xs_2xhz', '#exzxhz_area','2xhz',8,1],    //二星组选和值
	107: ['_add107', '#xs_1xzx', '#yxzx_area','1xzx',8,1],      //一星复式
	111: ['_add111', '#xs_dxds', '#dxds_area','dxds',8,1]       //大小单双
});

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

Class.extend('getPrixRange', function (count,hzcode){//已选
    var min, max, rn, ishz, sp, ini,c,priz=[],s;
    c = hzcode;
    sp = this.getPrix();//单注奖金
    ini = this.getIni();
    ishz = ('249'==this.getPlayId()? true: false);
    rn = ini[2];//必选个数
    min = sp;
    if (count >= rn){
    	if(ishz){
    		if(hzcode!=undefined)
    		if(hzcode.length>0){
    			if(hzcode.length == 3){
    				s = this.getInt(hzcode[0])+this.getInt(hzcode[1])+this.getInt(hzcode[2]);
    				if(s == 3){
    					priz.push(this.getHzPrize(this.getInt(s)));
    				}else if(s == 18){
    					priz.push(this.getHzPrize(this.getInt(s)));
    				}else{
    					for(var i=0; i<hzcode.length; i++){
    	    				priz.push(this.getHzPrize(this.getInt(hzcode[i])))
    	    			}
    				}
    			}else{
    				for(var i=0; i<hzcode.length; i++){
	    				priz.push(this.getHzPrize(this.getInt(hzcode[i])))
	    			}
    			}
    		}
    		min = Math.c(count,count)*Math.min.apply(Math,priz);
    		max = Math.c(count,count)*Math.max.apply(Math,priz);;
    	}else if('255'==this.getPlayId()){
    		if(hzcode.length>2){
    			max = Math.c(3,2)*sp;
    		}else{
    			max = Math.c(count,count)*sp;
    		}
    	}else if('118'==this.getPlayId()){
    		$("#exzxhz_area p>b.cur").each(function(i){
    			if($(this).html() == '0' || $(this).html() == '18'){
    				min = 100;
    				max = 100;
    			}
    		});
    	}else{
    		max = Math.c(count,count)*sp;
    	}
    }
    if (min == max) {
        max = false
    }
    return {
        min: min,//最小奖金
        max: max//最大奖金
    }     
});

Class.extend('getdtplayid', function (){//已选
    var id = this.getPlayId();
    var newid = id;
    switch(id){
    case 254:
    	newid = 241;
    	break;
    case 255:
    	newid = 242;
    	break;
    }
    return newid;  
});

Class.extend('getDtPrixRange', function (d, t){//已选
    var min, max, rn, sp, count, core;
    sp = this.getPrix();//单注奖金
    pid = this.getdtplayid();
    rn = this.getIni()[2];//必选个数
    min = sp;
    core = Math.min(rn, 3);//有效个数
    count = d + t;
    if (count > rn){//最多命中注数 
         max = core < 3 ? Math.c(Math.min(t, 3 - d), core - d)*sp : Math.dt(core - d, t - (core - d) , rn - d)*sp;               
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
    	max = (this.id=="zh_bs" || this.id=="jh_bs") && (Y.getPlayId()==124||Y.getPlayId()==104)? 10:
    		(this.id=="zh_bs" || this.id=="jh_bs") && Y.getPlayId()==105? 100:max;
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
})

//执行主程序
Class('App', {
    use: 'tabs, mask, dataInput, countDown',
    ready: true,
    index:function (){
        this.lib.SendBuy();
        this.lib.Dlg();
    	Y = this;
        this.lib.openCodeList(false);
        this.lib.ExpectList();
        this.lib.BuyProject();
        setTimeout(function() {
        	Y.lib.CountDownGp({
                stop:Y.C('lot_id'),
                lot:Y.C('lot_id')
            });
        },100);
        
        this.addChoose();
    	this.addTabs();
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
					height:330
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
			
			if(id>248&&id<256){
				if(!(Y.checksdinput(id-247))){
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
	/*}*/
    	$("#yxzx_area b").mouseover(function(){
    	  	$(this).addClass("b_r").siblings().removeClass("b_r");
    	  }).mouseout(function(){
    	  	$(this).removeClass("b_r");
    	  });

    },
  
    
    addChoose: function (){
        this.lib.CodeList({
            panel: '#code_list',
            clearBtn: '#clear_list,clear_list1',
            zsSpan: '#single_zs',
            moneySpan: '#single_m',
            setdan: '#setdanma',
            setdan_i: '#setdanma_i',
            danma:'#danma',
            danmas:'#danma input'
        });
        this.addChoose = this.getNoop();
    },
    
    _add107:function (){// 一星复式
        this.lib.Single({
            maxLength: 10,
            msgid:'s'+Class.C('lot_sub')[107][3],
            group: '#yxzx_area .nsopr b',
            items: '#yxzx_area span.nsbool b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_107',
            put: '#put_107',
            clear:'#clear_107',
            rnd1: '#s1_jx1',
            jixuan: '#jixuan'
           // rndhz: '#hz_jx'
        });
        this._add107 = this.getNoop();
    },
    _add106:function(){//二星直选
    	this.lib.Multi({
        	items: '#exzx_area .nx3span .nsbool',
            itemgr:'#exzx_area',
            dxds:false,
            noGroup:true,
            group: '#exzx_area .nsopr b',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_106',
            clear:'#clear_106',
            put: '#put_106'
       });
       this._add106 = this.getNoop();
    },
    _add105:function (){// 三星直选
        this.lib.Multi({
            items: '#sxzx_area .nx3span .nsbool',
            itemgr:'#sxzx_area',
            group: '#exzx_area .nsopr b',
            dxds:false,
            noGroup:true,
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_105',
            clear:'#clear_105',
            put: '#put_105'
        });
        this._add105 = this.getNoop()
    },
    
    _add104:function (){// 五星直选
        this.lib.Multi({
        	 items: '#wxzx_area .nx3span .nsbool',
        	 itemgr:'#wxzx_area',
//        	 group: '#wxzx_area .nsopr b',
        	 dxds:false,
             noGroup:true,
             focusCss: 'cur',
             hoverCss: '',
             showbar: '#showbar_104',
             clear:'#clear_104',
             put: '#put_104'
        });
        this._add104 = this.getNoop();
    },
    
    _add124:function (){// 五星通选
        this.lib.Multi({
            items: '#wxtx_area .nx3span .nsbool',
            itemgr:'#wxtx_area',
//            group: '#wxtx_area .nsopr b',
       	    dxds:false,
            noGroup:true,
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_124',
            clear:'#clear_124',
            put: '#put_124'
        });
        this._add124 = this.getNoop();
    },
    _add118:function (){// 二星组选和值
        this.lib.Hz({
            hz: Class.C('zxhz2'),
            rangeNum: 18,
            items: '#exzxhz_area span.nsbool b',
            dxds:false,
       	    focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_118',            
            clear:'#clear_118',
            put: '#put_118'
        });
        this._add118 = this.getNoop();
    },
    _add111:function (){// 大小单双
        this.lib.Dxds({
            items: '#dxds_area .nxds .nxdsc',
            dxds:true,
            focusCss: 'cur',
            hoverCss: '',
            noGroup: false,
            maxLength: 1,
            showbar: '#showbar_111',
            clear:'#clear_111',
            put: '#put_111'
        });
        this._add111 = this.getNoop();
    },
    _add146:function (){// 三星组六
        this.lib.Single({
        	maxLength: 8,
        	items: '#sxzxl_area p b',
        	group: '#sxzxl_area p em',
        	focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_146',
            clear:'#clear_146',
            put: '#put_146'
        });
        this._add146 = this.getNoop();
    },
    _add145:function (){// 三星组三
        this.lib.Single({
            items: '#sxzsbh_area p b',
            group: '#sxzsbh_area p em',
            focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_145',         
            clear:'#clear_145',
            put: '#put_145'
        });
        this._add145 = this.getNoop();
    },
    
    _add116:function (){// 二星组选复式
        this.lib.Single({
            maxLength: 6,
            items: '#exzux_area span.nsbool b',
            group: '#exzux_area .nsopr b',
       	    focusCss: 'cur',
            hoverCss: '',
            showbar: '#showbar_116',
            clear:'#clear_116',
            put: '#put_116'
        });
//        this._add116 = this.getNoop();
    },
    addTabs: function (){
        var playTabs,zhTabs;
        Y =this;
        //玩法切换
        playTabs = this.lib.Tabs({
            items: '#play_tabs a',
            contents:
            Class.C('lot_sub')[116][1]+','+Class.C('lot_sub')[145][1]+','+Class.C('lot_sub')[146][1]+','+
            Class.C('lot_sub')[107][1]+','+Class.C('lot_sub')[106][1]+','+Class.C('lot_sub')[105][1]+','+
            Class.C('lot_sub')[104][1]+','+Class.C('lot_sub')[124][1]+','+Class.C('lot_sub')[118][1]+','+
            Class.C('lot_sub')[111][1],
            focusCss: 'cur'
        });
        var z=0;
        playTabs.onchange= function (a, b){
        	$("#num_header_1").css('height','0');
        	$("#span5").removeClass("span5c");
        	Y.get('#xuanhao .nxhm , #dxds_area').hide();
        	var pid = this.get('#play_tabs a').slice(b, b+1).attr("value");
        	Y.get("#wanfatishi").html(Class.C('lot_data_wanfa')[pid]);
        	switch(b){
        		case 0:
        			Y.get(Class.C('lot_sub')[116][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 1:
        			Y.get(Class.C('lot_sub')[145][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 2:
        			Y.get(Class.C('lot_sub')[146][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 3:
        			Y.get(Class.C('lot_sub')[107][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 4:
        			Y.get(Class.C('lot_sub')[106][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 5:
        			Y.get(Class.C('lot_sub')[105][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 6:
        			Y.get(Class.C('lot_sub')[104][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 7:
        			Y.get(Class.C('lot_sub')[124][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        		case 8:
        			Y.get(Class.C('lot_sub')[118][2]).show();
        			$("#zhushujx").hide();
//        			$("#hezhijx").show();
        			break;
        		case 9:
        			Y.get(Class.C('lot_sub')[111][2]).show();
        			$("#zhushujx").show();
//        			$("#hezhijx").hide();
        			break;
        	}
        	var pid = this.get('#play_tabs a').slice(b, b+1).attr("value");
        	Class.C('playid', pid);
        	z==0? '':this.postMsg("show_opencodelist");
        	z++;
        	Y[Class.C('lot_sub')[pid][0]]();
        };
        
        playTabs.focus(3);
		this.onMsg('msg_force_change_playtabs', function(x, y) {
			playTabs.focus(x);
		});
        
        //追号切换
        zhTabs = this.lib.Tabs({
            items: 'div.ncathtype label',
            focusCss: 'cm_cur',
            contents: '#ss,#zh_tabs1,#zh_tabs2'
        });
        zhTabs.onchange= function (a, b){
        	$("#num_header_1").css('height','0');
        	$("#span5").removeClass("span5c");
        	var zid = this.get('#zh_tabs a').slice(b, b+1).attr("value");
            Class.C('zhid', zid);
            var listdata = Y.postMsg('msg_get_list_data').data;
            if(b!=0){
            	Y.get("#expectListBox").show();
            }else{
            	Y.get("#expectListBox").hide();
            	$("#tzzh").hide();
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
    	var pl = 5;
    	if(pid==244){
    		pl = 1;
    	}else if (pid==247){
    		pl = 2;
    	}else if (pid==248){
    		pl = 3;
    	}
    	return pl;
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
        })
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
	                        currentexpect: elist.pid,
	                        expectnum: elist.beishulistsuc.split(',').length,
	                        money: list.totalmoney.rmb(),
	                        stop: $_sys.zhflag[Y.get('#tzzh').val()],
	                        totalmoney: elist.allmoney.rmb()
	                    }), function (){
	                        Y.send(elist);
	                    })                     
	                })
            })                
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
    				if ((code=="1001"||code=="2")&& desc.indexOf("限号")<0){
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

//追号计划
Class('BuyProject', {
    index:function (){
        this.addMsg();
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
                opts.add(new Option(item.pid, item.pid, 0, 0))
            });
            this.get('#maxJhZh').html(opts.length);
            this.get('#maxJhZh2').html(opts.length);
        });        	    	
        this.onMsg('msg_expect_change', function (expect, now, et){
            var opts, arr, sel;//变换追号下拉列表
            arr=[];
            sel = this.one('#jh_opts');
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
        var Y = this;
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
		this.fullIncome.value = this.getPlayId()==111?30:50;
		this.beforeExpect.value = 5;
		this.beforeIncome.value = 50;
		this.backIncome.value = 50;
		this.sumIncome.value = 100;
    }
});

//期号列表
Class('ExpectList', {
    index:function (){
        var Y = this;
        this.expectChks = [];
        this.onMsg('msg_list_change', function (data){
            this.setAllMoney(data.totalmoney);//选号有变化时同步
            this.setTotalData(data);
        });
        this.onMsg('msg_get_expect_param', function (){
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
            var val = Math.min((Y.getPlayId()==124||Y.getPlayId()==104?10:Y.getPlayId()==105? 100:999),parseInt(this.value, 10) || 0);
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
        this.setIntInput('#zh_bs,#jh_bs', function (){
            Y.setAllBs(Y.getInt(this.value));
        }, 1, 999);
        this.setIntInput('#zh_bs_big,#jh_bs', function (){
            Y.setAllBs(Y.getInt(this.value));
        }, 1, 999);
        this.setIntInput('#zh_qs', function (){
            Y.selectMulti(Y.getInt(this.value));
        }, 0);

        this._reset(true);
        this.allmoney = 0;
        this.beishulistsuc = '';
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
            }else{
           	 $("#exp_"+id[1]+"_"+id[2]).attr("checked","");
            } 
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
                t.value = bs;
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
                    t.value = bs;
                    t.parentNode.previousSibling.getElementsByTagName('input')[0].checked = true;
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
        this.setTotalData(listdata);
    },
    setTotalData: function (listdata){//更新总期数与金额
         var exp_sum, bs, bslist, pr;
         exp_sum = bs =n= 0;
         bslist = [];
         exlist = [];
         var code = this.postMsg('msg_get_list_data').data.codes+'';
         var cl = code.split(";");
         var isyl = false;
         if(cl.length==1 && code.length>0){
             if (code.indexOf('$')>-1) {//胆拖
                 var dt = code.split('$'); 
                 pr = this.getDtPrixRange(dt[0].split(',').length, dt[1].split(',').length);
             }else{
             	 var len = code.split(',').length;
                 pr =  this.getPrixRange(len, code.split(':')[0].split(','));            
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
         this.allmoney = bs*2*listdata.zhushu;
         this.expectlistsuc = exlist.join(',');
         this.beishulistsuc = bslist.join(',');
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
                 bsinput.value = this.get('#zh_bs').val();
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
            }    		            
    	}else{
    		Class.C('iszh', false);
    		return {
    			'allmoney'	: this.allmoney,
                'beishulistsuc': this.beishulistsuc,
                'buymode': 1,
                'expectlistsuc':	this.C('currentExpect'),
                'ZjCut':  this.get('#tzzh').prop('checked') ? 1 : 0,     
    			'gid':Class.C('lot_id'),// 游戏编号
    			'pid':$(':checkbox:checked').val(),// 期次编号
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
    		}
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
                g.disabl = iscur ? '':'disabled=false';
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

//选择器
Class('Ball', {
    rangeNum: 10,
    showTxt: '【您选择了<em>{$zhushu}</em>注，共 ￥<em>{$totalmoney}</em>元 】如中奖，奖金 {$prix}，盈利  {$yl}',
    index:function (config){
    	this.putBtn = this.get(config.putBtn).concat(this.get(config.put).nodes);
        this.onMsg('msg_rnd_code_'+this.msgType, function (){
            this.random(this.rndOpts.val());
        });
         this.onMsg('msg_clear_code', function (){
             this.clearCode();
         });
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
        var a, b, code, id, len, ini,iszh;
        var ml = [124,104,112,113,105,106,108,109,110]// 多行
        n = ~~n;
        code = [];
        id = this.getPlayId();
        ini = this.getIni(id);
        len = ini[2];
        iszh = ini[3];
        a = this.repeat(id == '111' ?  4 : this.rangeNum, 0);
        for (var i = n; i--;) {
            if (ml.indexOf(id)>-1) {// 多行的可以同号
                code[i] = [getMLCode(len), id, ini[4] || 1];
            }else{
                code[i] = this.getOneRnd ? this.getOneRnd()  : [a.random().random(-len), id, ini[4] || 1];                
            }
            if (id==118) {
                code[i][2] = Class.C('zxhz2')[code[i][0][0]];
            }
            if (id==145) {
                code[i][0].push(code[i][0].random().random(-1));
                code[i][1] = 149;// 机选组三 替换为 三星单式
            }
            if (id==146) {
                code[i][1] = 150;// 机选组六 替换为 三星单式
            }
            if (!iszh) {
                code[i][0].sort(Array.up);
            }
            if (id==111) {
                code[i][0] = code[i][0].map(function (a){
                    return '大小单双'.charAt(a);
                });
            }
        }
        code.each(function (arr){
            if (iszh) {// 直选修饰
                arr[0] = ['-', '-', '-', '-', '-'].concat(arr[0]).slice(-5);
            }
            arr[0] = arr[0].join(',');
        });
        this.postMsg('msg_put_code', code);// 广播号码输出消息, 号码列表监听此消息;
        function getMLCode(len){
            return Y.repeat(len, function (i){
                return a.random().random(-1);
            });
        }
    }
});

//单行选择器
Class('Ball>Single', {
    index:function (ini){
        var Y = this;
        this.base(ini);
        this.msgType = 'single';
        this.hz = ini.hz;
        this.rangeNum = ini.rangeNum || 10;
        ini.startNum = 0;
        this.ball = this.lib.Choose(ini);
        if (ini.maxLength) {
            this.ball.onbeforeselect = function (ball){
                if (this.data.length> ini.maxLength-1) {
                    Y.alert('您好,'+Y.getIni()[0]+'最多只能选择'+ini.maxLength+'个号码!')
                    return false
                }
            }         
        }
        this.addNoop('onchange');
        this.showbar = this.get(ini.showbar);
        this.ball.onchange = function (){
            var zhushu, info, prix, tm, y1;
            zhushu = Y.getCount();
            tm = zhushu*Class.C('price');
            prix =  zhushu > 0 ? this.getPrixRange(this.data.length) : {max: 0, min: 0}; 
            y1 = (prix.min - tm).rmb(false);
            //y2 = prix.max ? (prix.max - tm) : 0;
            info = {
                ball: this.data.length,
                zhushu: zhushu,
                prix: this.getPlayId() == 148 && zhushu ? '160.00 元 至 1000.00 元' : (prix.max ?  prix.max.rmb(false) : prix.min.rmb(false)),// 奖金范围
                yl: this.getPlayId() == 148 && zhushu ? ((160 - tm) + '.00 元 至 ' + (1000-tm)+'.00 元') : y1,
                totalmoney: tm.rmb(false)            
            };
            Y.highlightBtn(info.zhushu);
            Y.showbar.html(Y.showTxt.tpl(info, '0'));
            Y.onchange(info);
        };
        this.bindDom(ini);
    },
    bindDom: function (ini){
       var Y = this;
       this.need(ini.clear).click(function (){
           Y.clearCode();
       });
       if(ini.rnd1!='' && ini.rnd1!=undefined){
	        this.need(ini.rnd1).click(function (){
	            Y.random("1");
	        });
       }
       if(ini.jixuan!='' && ini.jixuan!=undefined){
	       this.need(ini.jixuan).click(function (){
	          	var shuzi = $("#shuzi").val();
	          	shuzi=$("#shuzi").val().replace(/\D/g,'');
	          	Y.random(shuzi);
	          });
       }
      /* if(ini.rndhz!='' && ini.rndhz!=undefined){
	        this.need(ini.rndhz).click(function (){
	            Y.random("1");
	        });
      }*/
        this.need(ini.put).click(function (){
            var code, count, min;
            count = Y.getCount();
            min = Class.C('lot_data')[Y.getPlayId()][2];
            if(count > 0) {
                if (Y.checkMaxMoney(count*Class.C('price'), this)) {
                    code = Y.getChooseCode();
                    Y.chkLimitCode('['+Y.getPlayId()+']'+code[0][0], function (){
                        Y.clearCode();
                        Y.postMsg('msg_put_code', code);// 输出号码消息--列表框监听此消息
                    })        
                }
            }else{
                Y.alert('您好，请您至少选择'+min+'个号码！')
            }
        })
    },
    clearCode: function (){
        this.ball.clearCode() 
    },
    getCount: function (){
        var p, len, id, ini;
        p = Class.C('price');
        len = this.ball.data.length;
        id = this.getPlayId();

        ini = Class.C('lot_data')[id];
        switch(id){
        case 144:
            return Math.p(len, ini[2]);
        case 145:
            return Math.c(len, ini[2])*2;
        case 116:
        	return Math.c(len, ini[2]);
        default:
            return Math.c(len, ini[2]);
        }
    },
    getChooseCode: function (){// 传送到列表的数据
        var codeStr = this.getIni()[3] ? ['-', '-', '-', '-', '-'].concat(this.ball.data.join('')).slice(-5).join(',') : this.ball.data.join(',');
        return [[codeStr, this.getPlayId()==146 && this.ball.data.length==3? 150:this.getPlayId() , this.getCount()]]
    }
});


//和值选择器
Class('Ball>Single>Hz', {
    getCount: function (){
        var sum = 0;
        this.ball.data.each(function (i){
            sum+= this.hz[i]
        }, this)
        return sum
    }
});
// 多行选择器
Class('Ball>Multi', {
    index:function (ini){
        var Y = this;
        this.base(ini);
        this.msgType = "multi";
        this.addNoop('onchange');
        this.showbar = this.get(ini.showbar);
        this.balls = [];
        //this.maxLength = this.maxLength;
        ini.startNum = 0;
//        this.$(ini.items).each(function (ul, i){
//            this.balls[i] = this.lib.Choose(this.mix({
//                items: ini.dxds ? this.$('b', ul):this.$('b', ul),
//                group: ini.noGroup ? this.get(ini.itemgr + ' div.nx3span').slice(i,i+1).find("span>b") :void 0
//            }, ini, false));
        this.$(ini.items).each(function (div, i){
            this.balls[i] = this.lib.Choose(this.mix({
                items: ini.dxds ? this.$('b', div):this.$('b', div),
        		group: ini.noGroup ? this.get(ini.itemgr + ' span.nsopr').slice(i,i+1).find("b") :void 0
            }, ini, false));
            this.balls[i].onchange = function (){
                var zhushu, info, prix, tm;
                zhushu = Y.getCount();
                prix = zhushu > 0 ? Y.getInt(Y.getPrix()) : 0;
                tm = zhushu*Class.C('price');
                info = {// 选择状态显示
                    ball: this.data.length,
                    zhushu: zhushu,
                    prix: prix.rmb(false),
                    yl: (prix - tm).rmb(false),
                    totalmoney: tm.rmb(false)            
                };
                Y.highlightBtn(info.zhushu);
                Y.showbar.html(Y.showTxt.tpl(info, '0'))
                Y.onchange(info)
            }
            if (ini.maxLength) {
                this.balls[i].maxLength = ini.maxLength;
                this.balls[i].onbeforeselect = this.maxCode;
            }
        }, this)
        this.bindDom(ini)
    },
    maxCode: function (){
        if (this.data.length>this.maxLength-1) {
            this.alert('您好， '+this.getIni()[0]+'每行只能选择'+this.maxLength+'个号码！');
            return false
        }
    },
    bindDom: function (ini){
       var Y = this;
       this.need(ini.clear).click(function (){
           Y.clearCode()
       });
        this.need(ini.put).click(function (){
            var code, count, min, id;
            count = Y.getCount();
            id = Y.getPlayId();
            min = Class.C('lot_data')[id][2];           
            if(count > 0) {
                if (Y.checkMaxMoney(count*Class.C('price'), this)) {
                    code = Y.getChooseCode();
                    var str = code[0][0].replace(/小/g,1).replace(/大/g,2).replace(/单/g,5).replace(/双/g,4).replace(/[^0-9-,|]/g,'');
                    Y.chkLimitCode('['+Y.getPlayId()+']'+str, function (){
                        Y.clearCode();
                        Y.postMsg('msg_put_code', code);// 广播号码输出消息, 列表框应该监听此消息
                    })        
                }
            }else{
                var w = 0;
                var ch = '万千百十个'.split('').slice(-Y.balls.length);
                Y.balls.each(function (ball, i){
                    if (ball.data.length === 0) {
                        w = i 
                        return false
                    }
                })
                Y.alert('您好, '+ch[w]+'位没有选择号码, 请选择!')
            }
        })
    },
    clearCode: function (){
        this.balls.each(function (ball){
            ball.clearCode() 
        })
    },
    getCount: function (){
        var sum = 1;
        this.balls.each(function (ball){
            sum*=ball.data.length
        })
        return sum 
    },
    getChooseCode: function (code){
        if (!code) {
            code = [];
            this.balls.each(function (b){
                code[code.length] = b.data.join('')
            })            
        }
        return [[['-', '-', '-', '-', '-'].concat(code).slice(-5).join(','), this.getPlayId(), this.getCount()]]
    }
});

//多星组合
Class('Ball>Multi>MultiStar', {
    getCount: function (){
        var sum = 1;
        this.balls.each(function (ball){
            sum*=ball.data.length
        })
        return sum*(this.balls.length == 5 ? 5 : this.balls.length)
    }
});
// 大小单双
Class('Ball>Multi>Dxds',{
    rangeNum: 4,
    getChooseCode: function (code){
        if (!code) {
            code = [];
            var css= this.balls[0].focusCss;
            this.balls.each(function (b){
                b.items.each(function (el){
                    if (Yobj.hasClass(el, css)) {
                        code.push(el.innerHTML.trim())
                    }
                })
            })            
        }
        return [[code.join(','), this.getPlayId(), this.getCount()]]
    }
});

//号码列表
Class('CodeList', {
    splitChar: '|',
    rightSplit: ',',
    noZero: true,
    lineTpl: '<span class="cm_left"><em class="cm_w80" style="padding-right:10px;">{1}</em><em class="cm_w59">{2}</em>&nbsp;&nbsp;<em class="cm_w199">{3}</em></span><span class="cm_right"><s title="删除"></s></span>',
    index:function (config){
        var func;
        this.zhushu = this.totalmoney = 0;
        this.beishu = 1;
        this.panel = this.need(config.panel);
        this.bindEvent(config);
        this.msgId = config.msgId || '';
        this.stopRedraw = config.stopRedraw;//是否回显号码
        this.onMsg( 'msg_put_code', function (code){
            this.addCode(code);
        });
        this.onMsg( 'msg_get_list_data', function (){
            return this.getData()
        });
         this.onMsg('msg_buy_succeed', function (){
             this.clearLine();
         });
         this.onMsg('msg_expect_change', function (expect, now, endtime){
             if (this.panel.find('li').size() && !this.C('-is-continue-buy')) {//如有选号，弹出提示
                 this.alert('您好，<span style="color:#999">'+(expect-1)+'</span>期已截止，当前期是<span style="color:#FF4E00">'+expect+'</span>期，投注时请确认您选择的期号。')
             }
             this.C('-is-continue-buy', false)
         });
        this.tip = this.lib.NotifyIcon()
    },
    bindEvent: function (config){
        var Y = this;
        this.moneySpan = this.need(config.moneySpan);
        this.zsSpan = this.need(config.zsSpan);
        this.clearBtn = this.need(config.clearBtn);
        this.bsid =config.beishu;
        this.clearBtn.click(function (e, Y){
            Y.clearLine();
            $("#zh_bs_big").val(1);
        });
        /*this.clearBtn1 = this.need(config.clearBtn1);
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
        });*/
        Y.get("#zh_bs_big").keyup(function(){
        	Y.bschangess(Y.get(this).val());
        });
        Y.get("#zh_bs_add").click(function(){
        	var zh_bs_big = $("#zh_bs_big").val();
			zh_bs_big == zh_bs_big++;
			if(zh_bs_big < 999){
				 $("#zh_bs_big").val(zh_bs_big);
			}else if(zh_bs_big >= 999){
				 $("#zh_bs_big").val(999);
			}
			 $("#zh_bs_big").val(zh_bs_big);
        	Y.bschangess($("#zh_bs_big").val());
//        	Y.onMsg('msg_load_expect_list', function (a){
//                
//            }); 
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
        if (!this.isArray(code[0])) {
            code = [code]
        }
        for (var i = 0, j = code.length; i < j; i++) {
            one = code[i]; // [code, id, count];
            li = this.createLine(one);
            li.data('code', one.slice());
            li.setStyle('cursor:pointer');
            this.need('s', li).click(function (e, Y){
                Y.removeLine(Y.get(this).parent(function (el){
                    return el.nodeName.toLowerCase() == 'li';
                }))
            })
        }
        this.change(this.getCount())
    }
},
createLine: function (code){// 创建一行
    var lot = Class.C('lot_data')[code.slice(-2)[0]];// id
    return this.createNode('LI', this.panel).html(            
        this.lineTpl.format('['+lot[0] + '] ',(Class.C('price')*code[2])+"元", code[0])
    );
},
removeLine: function (li){// 删除一行
    if (li == this.prevSelectedLine) {
        this.prevSelectedLine = null
    }
    this.removeNode(li);
    this.change(this.getCount())
},
clearLine: function (){// 清空列表
    this.panel.empty();
    this.change(0);
    this.get('#ai_all_zs').html(0);// 过滤用到
    this.prevSelectedLine = null;
    this.postMsg('msg_reset_expectlist'); // 复位列表
},
change: function (zhushu){// 变化
    this.zsSpan.html(zhushu);
    this.zhushu = zhushu;
    this.totalmoney = this.getInt(this.zhushu)*this.getInt(this.beishu)*Class.config('price');
    this.moneySpan.html(this.totalmoney.rmb());

    this.postMsg('msg_list_change', {
        zhushu: zhushu,
        beishu: this.beishu,
        totalmoney: this.totalmoney
    })//注数变化消息, 购买选项类应该监听这个消息
},
bschangess: function (beishu){//变化
//  this.zsSpan.html(zhushu);
//  this.zhushu = zhushu;
	
	
	Y.get("#zh_bs").val(beishu);
	this.beishu=beishu;
	 this.totalmoney = this.zhushu*beishu*Class.config('price');
  this.moneySpan.html(this.totalmoney.rmb(false,0));
  this.beishulistsuc=beishu;
//  this.postMsg('msg_list_change', {
//      zhushu: this.zhushu,
//      beishu: beishu,
//      totalmoney: this.totalmoney
//  });// 广播注数变化消息, 购买选项类应该监听这个消息
  $("input[mark=chkexp]").each(function(x,y){
		if($(y).attr("checked")){
			$(y).click();
			$(y).click();
		}
	});
},
getCount: function (){// 计算总注数
    var Y = this;
    return this.get('li', this.panel).nodes.reduce(function (a, b){
        return a + Y.attr(b, 'code').slice(-1)[0]
    }, 0)
},
formatCode: function (d){
	tmp = d[0].replace(/小/g,1).replace(/大/g,2).replace(/单/g,5).replace(/双/g,4).replace(/[^0-9-,|]/g,'')+':'+
	this.C('lot_data_new')[d[1]][0]+':'+this.C('lot_data_new')[d[1]][1];
    if (this.C('lot_data_new')[d[1]][2]>0){
    	tmp = tmp.slice(this.C('lot_data_new')[d[1]][2]);
    }
    return tmp;
},
getData: function (){
    var arr = [];
    this.get('li', this.panel).each(function (a){
        var d = this.get(a).data('code');
        arr.push(this.formatCode(d))
    }, this);
    return {
        codes: this.noZero ? arr.join(';') : String.zero(arr.join(';')),
        zhushu: this.zhushu,
        beishu: this.beishu,
        totalmoney: this.totalmoney
    }
}
});

//开奖号
Class('openCodeList', {
	omissionurl:"/cpdata/omi/" + Class.C('lot_id') + "/miss.xml?v="+Math.random(),
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
                	//this.listdata[this.listdata.length] = o.items;
                	var day = Y.getDate(data.date).format('YYMMDD');
                	var pid = o.items.p;
                	var c = o.items.c;
                	var pd = "20"+pid.substr(0,6);
                	pid = pid.substr(6,3);
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
    showlist: function (n){
    	clearInterval(window.refreshKjTime);
    	var pid = this.getPlayId();
    	var dl = this.listdata.length;
    	var lpid = this.listdata[dl-1];
    	var llpid = this.listdata[dl-1];
    	var npid = this.getnextpid(lpid.p);
    	var net;
    	if((npid+"").substr(6,3)=="001"){
    		net = (Y.getDate(Date.parse(Y.getDate(lpid.t))+1000*60*60*24).format('YY-MM-DD')) + " 00:05:00";
    	}else{
    		//alert(Y.getInt((npid+"").substr(6,3)));
    		if(Y.getInt((npid+"").substr(6,3)) == 24){//1:55 - 10:00  只售一期，10:00开奖
    			net = (Y.getDate(Date.parse(Y.getDate(lpid.t))).format('YY-MM-DD')) + " 10:01:20";
    		}else if(Y.getInt((npid+"").substr(6,3)) < 24 || Y.getInt((npid+"").substr(6,3))>96){
    			net = (Y.getDate(Date.parse(Y.getDate(lpid.t))+1000*60*5).format('YY-MM-DD hh:mm:ss'));
    		}else{
    			net = (Y.getDate(Date.parse(Y.getDate(lpid.t))+1000*60*10).format('YY-MM-DD hh:mm:ss'));
    		}
    	}
    	
    	this.get('#lastopenexpect').html(llpid.p);  
    	this.get('#lastopendata').html('（{1}）'.format(llpid.t));
		var ctpl = '<em class="ssb1">{1}</em><em class="ssb2">{2}</em><em class="ssb3">{3}</em><em class="ssb4">{4}</em><em class="ssb5">{5}</em>';
		var llcc=llpid.c.split(",");
		this.get('#lastopencode').html(ctpl.format(llcc[0],llcc[1],llcc[2],llcc[3],llcc[4]));
    	var st = 0; //开奖倒计时
    	if(npid!=this.C('currentExpect')){
    		st = 1; //开奖倒计时
    		this.get('#lastopenexpect').html(lpid.p);    		
    		var ctpl = '<em class="ssb1">{1}</em><em class="ssb2">{2}</em><em class="ssb3">{3}</em><em class="ssb4">{4}</em><em class="ssb5">{5}</em>';
    		var llcc=lpid.c.split(",");
    		this.get('#lastopencode').html(ctpl.format(llcc[0],llcc[1],llcc[2],llcc[3],llcc[4]));  
    	}
    	
		var cc=lpid.c.split(",");
		
		var zx="组六";
		if(cc[2]==cc[3]||cc[2]==cc[4]||cc[3]==cc[4]){
			zx="组三";
		}
		if(cc[2]==cc[3]&&cc[2]==cc[4]){
			zx="豹子";
		}
		
		var eh=cc[3]*1+cc[4]*1;
		var sh=cc[2]*1+cc[3]*1+cc[4]*1;
		
		var ds1=ds2=ds3=ds4="";
		if(cc[3]%2==0){ds1="双"}else{ds1="单"}
		if(cc[3]<5){ds2="小"}else{ds2="大"}
		if(cc[4]%2==0){ds3="双"}else{ds3="单"}
		if(cc[4]<5){ds4="小"}else{ds4="大"}
    	
    	var ld = this.listdata.slice(dl-8, dl);
    	for(var i=0; i<ld.length; i++){
        	var ul = this.get('.opencodebox',Class.C('lot_sub')[this.getPlayId()][1]).slice(i);
        	if(i%1==0){
        		ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","").toggleClass("odd");
        	}else{
        		ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","");
        	}
        	/*ul.attr("expect",ld[i].p).attr("endtime",ld[i].t).attr("ol",0).attr("codes","");*/
        	var opencode = ld[i].c;
        	var opencodelen = 5;
        	if(opencode!=""){
        		this.showomiss(ld[i], opencodelen, opencode, ul);
        	}else{
        		//this.countdown(ld[i].t, ld[i].p);
        	}
    	}
    	
    	if(st==1){
    		this.countdown(net, npid);
    	}else{
    		this.get('#kaijiangexpect').html('');    		
    		this.get('#kaijiangopencode').html('');       
    	}
    },
    showomiss: function(data, opencodelen, opencode, ul){
    	var opencode_arr = opencode.split(',');
    	switch(this.getPlayId()){
			case 107:
				var hm = this.getInt(opencode_arr[opencode_arr.length-1]);
				var miss_zx1 = data.m4.split(',');
				this.get('td', ul).slice(3,13).each(function(a,b){
					if(hm == b){
						$(a).html(hm);
						$(a).html('<b>'+hm+'</b>');
					}else{
						$(a).html(miss_zx1[b]);
					}
				});
				
				var zh = true;
				for(var z=2; z<hm; z++){
					if(hm%z==0){
						zh=false;
						break;
					}
				}
				this.get('td', ul).slice(16,18).html('');
				this.get('td', ul).slice(15,16).html('');
				this.get('td', ul).slice(13,14).html('');
				this.get('td', ul).slice(14,15).html('');
				this.get('td', ul).slice(17,18).html('');
				this.get('td', ul).slice(18,19).html('');
				hm%2==0?this.get('td', ul).slice(16,17).html('<em class="em4">双</em>'):this.get('td', ul).slice(15,16).html('<em class="em3">单</em>');
				hm>4?this.get('td', ul).slice(13,14).html('<em class="em1">大</em>'):this.get('td', ul).slice(14,15).html('<em class="em2">小</em>');
				zh||hm==2? this.get('td', ul).slice(17,18).html('<em class="em5">质</em>'):this.get('td', ul).slice(18,19).html('<em class="em6">合</em>');
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 106:
				var miss_zx1 = data.m4.split(',');//个位
				var miss_zx2 = data.m3.split(',');//十位
				this.get('td', ul).slice(3,23).each(function(a,b){
					if(b>9){
						if(Y.getInt(opencode_arr.slice(-1)) == b-10){
							$(a).html('<b>'+Y.getInt(opencode_arr.slice(-1))+'</b>');
						}else{
							$(a).html(miss_zx1[b-10]);
						}
					}else{
						if(Y.getInt(opencode_arr.slice(-2,-1)) == b){
							$(a).html('<b>'+Y.getInt(opencode_arr.slice(-2,-1))+'</b>');
						}else{
							$(a).html(miss_zx2[b]);
						}
					}
					
				});				
					
						
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 105:
				var miss_zx1 = data.m4.split(',');//个位
				var miss_zx2 = data.m3.split(',');//十位
				var miss_zx3 = data.m2.split(',');//百位
				this.get('td', ul).slice(3,33).each(function(a,b){
					if(b<10){
						if(Y.getInt(opencode_arr.slice(-3,-2)) == b){
							$(a).html('<b>'+Y.getInt(opencode_arr.slice(-3,-2))+'</b>');
						}else{
							$(a).html(miss_zx3[b]);
						}
					}else if(b<20){
						if(Y.getInt(opencode_arr.slice(-2,-1)) == b-10){
							$(a).html('<b>'+Y.getInt(opencode_arr.slice(-2,-1))+'</b>');
						}else{
							$(a).html(miss_zx2[b-10]);
						}
					}else{
						if(Y.getInt(opencode_arr.slice(-1)) == b-20){
							$(a).html('<b>'+Y.getInt(opencode_arr.slice(-1))+'</b>');
						}else{
							$(a).html(miss_zx1[b-20]);
						}
					}
					
				});
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 104:
			case 124:
				var miss_zx1 = data.m4.split(',');//个位
				var miss_zx2 = data.m3.split(',');//十位
				var miss_zx3 = data.m2.split(',');//百位
				var miss_zx4 = data.m1.split(',');//千位
				var miss_zx5 = data.m0.split(',');//万位
				this.get('td', ul).slice(2,12).each(function(a,b){
					if(Y.getInt(opencode_arr.slice(-5,-4)) == b){
						$(a).html('<b>'+Y.getInt(opencode_arr.slice(-5,-4))+'</b>');
					}else{
						$(a).html(miss_zx5[b]);
					}
				});
				this.get('td', ul).slice(13,23).each(function(a,b){
					if(Y.getInt(opencode_arr.slice(-4,-3)) == b){
						$(a).html('<b>'+Y.getInt(opencode_arr.slice(-4,-3))+'</b>');
					}else{
						$(a).html(miss_zx4[b]);
					}
				});
				this.get('td', ul).slice(24,34).each(function(a,b){
					if(Y.getInt(opencode_arr.slice(-3,-2)) == b){
						$(a).html('<b>'+Y.getInt(opencode_arr.slice(-3,-2))+'</b>');
					}else{
						$(a).html(miss_zx3[b]);
					}
				});
				this.get('td', ul).slice(35,45).each(function(a,b){
					if(Y.getInt(opencode_arr.slice(-2,-1)) == b){
						$(a).html('<b>'+Y.getInt(opencode_arr.slice(-2,-1))+'</b>');
					}else{
						$(a).html(miss_zx2[b]);
					}
				});
				this.get('td', ul).slice(46,56).each(function(a,b){
					if(Y.getInt(opencode_arr.slice(-1)) == b){
						$(a).html('<b>'+Y.getInt(opencode_arr.slice(-1))+'</b>');
					}else{
						$(a).html(miss_zx1[b]);
					}
				});
//				this.get('td', ul).slice(2,55).each(function(a,b){
//					if(b<10){
//						
//					}else if(b<20){
//						
//					}else if(b<30){
//						
//					}else if(b<40){
//						
//					}else{
//						
//					}	
//				});
//				this.get('td', ul).slice(1,2).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 118:
				var hm = this.getInt(opencode_arr.slice(-1))+this.getInt(opencode_arr.slice(-2,-1));
				var miss_zx1 = data.m9.split(',');//和值
				this.get('td', ul).slice(3,23).each(function(a,b){
					if(hm == b){
						$(a).html('<b>'+hm+'</b>');
					}else{
						$(a).html(miss_zx1[b]);
					}
				});
				
				var zh = true;
				for(var z=2; z<hm; z++){
					if(hm%z==0){
						zh=false;
						break;
					}
				}
				this.get('td', ul).slice(25,26).html('');
				this.get('td', ul).slice(24,25).html('');
				this.get('td', ul).slice(22,23).html('');
				this.get('td', ul).slice(23,24).html('');
				this.get('td', ul).slice(26,27).html('');
				this.get('td', ul).slice(27,28).html('');
				hm%2==0?this.get('td', ul).slice(25,26).html('<em class="em4">双</em>'):this.get('td', ul).slice(24,25).html('<em class="em3">单</em>');
				hm>8?this.get('td', ul).slice(22,23).html('<em class="em1">大</em>'):this.get('td', ul).slice(23,24).html('<em class="em2">小</em>');
				zh||hm==2? this.get('td', ul).slice(26,27).html('<em class="em5">质</em>'):this.get('td', ul).slice(27,28).html('<em class="em6">合</em>');
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 111:
				var miss_zx1 = data.m7.split(',');//十位
				var miss_zx2 = data.m8.split(',');//个位
				var last = Y.getInt(opencode_arr.slice(-1));
				var seclast = Y.getInt(opencode_arr.slice(-2,-1));
				this.get('td', ul).slice(3,4).html('<font class="font1">'+seclast+'</font>');
				this.get('td', ul).slice(8,9).html('<font class="font1">'+last+'</font>');
				this.get('em', ul).each(function(a,b){
					switch(b){
						case 0:
							seclast%2==0?$(a).html(miss_zx1[b+2]):this.get('td', ul).slice(4,5).html('<em class="em3">单</em>');
							break;
						case 1:
							seclast%2==0?this.get('td', ul).slice(5,6).addClass("color_4").html('<em class="em4">双</em>'):$(a).html(miss_zx1[b+2]);
							break;
						case 2:
							seclast>4?this.get('td', ul).slice(6,7).addClass("color_1").html('<em class="em1">大</em>'):$(a).html(miss_zx1[b-2]);
							break;
						case 3:
							seclast>4?$(a).html(miss_zx1[b-2]):this.get('td', ul).slice(7,8).addClass("color_2").html('<em class="em2">小</em>');
							break;
						case 4:
							last%2==0?$(a).html(miss_zx2[b-4+2]):this.get('td', ul).slice(9,10).addClass("color_3").html('<em class="em3">单</em>');
							break;
						case 5:
							last%2==0?this.get('td', ul).slice(10,11).html('<em class="em4">双</em>'):$(a).html(miss_zx2[b-4+2]);
							break;
						case 6:
							last>4?this.get('td', ul).slice(11,12).html('<em class="em1">大</em>'):$(a).html(miss_zx2[b-4-2]);
							break;
						case 7:
							last>4?$(a).html(miss_zx2[b-4-2]):this.get('td', ul).slice(12,13).html('<em class="em2">小</em>');
							break;
					}
				});
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
			case 146:
			case 145:
				var miss_zx5 = data.m5.split(',');//组三
		    	var last = Y.getInt(opencode_arr.slice(-1));
				var seclast = Y.getInt(opencode_arr.slice(-2,-1));
				var threelast = Y.getInt(opencode_arr.slice(-3,-2));
				this.get('b', ul).each(function(a,b){
					$(a).removeClass();
					if(b != last && b!=seclast && b!=threelast){
						$(a).html(miss_zx5[b]);
					}
					if((last == seclast) && (threelast == seclast) && (last == threelast)){
						if(b == last){
							$(a).addClass("cur");
							$(a).html(b+"<i>3</i>");
						}
					}else{
						if(last == seclast){
							if(b == last){
								$(a).addClass("cur");
								$(a).html(b+"<i>2</i>");
							}else if(b == threelast){
								$(a).addClass("cur");
								$(a).html(b);
							}
						}else if(last == threelast){
							if(b == last){
								$(a).addClass("cur");
								$(a).html(b+"<i>2</i>");
							}else if(b == seclast){
								$(a).addClass("cur");
								$(a).html(b); 
							}
						}else if(seclast == threelast){
							if(b == last){
								$(a).addClass("cur");
								$(a).html(b);
							}else if(b == seclast){
								$(a).addClass("cur");
								$(a).html(b+"<i>2</i>");
							}
						}else{
							if(b == last){
								$(a).addClass("cur");
								$(a).html(b);
							}else if(b == seclast){
								$(a).addClass("cur");
								$(a).html(b); 
							}else if(b == threelast){
								$(a).addClass("cur");
								$(a).html(b);
							}
						}
					}
				});
				
				this.get('td', ul).slice(14,15).removeClass("color_7").html('');
				this.get('td', ul).slice(15,16).removeClass("color_8").html('');
				this.get('td', ul).slice(16,17).removeClass("color_9").html('');
				((last==seclast && last==threelast)? this.get('td', ul).slice(14,15).addClass("color_7").html('豹子'):
					(last!=seclast && last!=threelast && seclast!=threelast)?this.get('td', ul).slice(16,17).addClass("color_9").html('组六'):this.get('td', ul).slice(15,16).addClass("color_8").html('组三'));
				this.get('td', ul).slice(2,3).html(opencode);
				this.get('td>strong', ul).html(data.p);
				break;
			case 116:
				var miss_zx6 = data.m6.split(',');
				var last = this.getInt(opencode_arr[opencode_arr.length-1]);
				var seclast = this.getInt(opencode_arr[opencode_arr.length-2]);
				this.get('td', ul).slice(3,13).each(function(a,b){
					if(last == seclast){
						$(a).removeClass();
						if(b == last){
							$(a).addClass("cur");
							$(a).html(b+"<i>2</i>");
						}else{
							$(a).html(miss_zx6[b]);
						}
					}else{
						$(a).removeClass();
						if(last == b){
							$(a).html('<b>'+last+'</b>');
						}else if(seclast == b){
							$(a).html('<b>'+seclast+'</b>');
						}else{
							$(a).html(miss_zx6[b]);
						}
					}
				});
				
				//大小单双个数
				var da=0,xiao=0,dan=0,shuang=0;
				function dxds(num){
					if(num>4){
						da ++;
					}else{
						xiao++;
					}
					
					if(num%2==0){
						shuang++;
					}else{
						dan++;
					}
				}
				dxds(last);
				dxds(seclast);
				
				this.get('td', ul).slice(13,14).html('<em class="em1">'+da+'</em>');
				this.get('td', ul).slice(14,15).html('<em class="em2">'+xiao+'</em>');
				this.get('td', ul).slice(15,16).html('<em class="em3">'+dan+'</em>');
				this.get('td', ul).slice(16,17).html('<em class="em4">'+shuang+'</em>');
				this.get('td', ul).slice(2,3).html('<font>'+opencode+'</font>');
				this.get('td', ul).slice(0,1).html(data.p);
				break;
    	}
    },
    countdown: function(ed, pid){
    	this.ajax({
			url : "/cpdata/time.json?v=" + Math.random(),
			retry:1,
			cache: false,//缓存
			end : function(data, i) {
				this.edata = data.date;
				var et =(Y.getDate(Date.parse(Y.getDate(ed))+1000*60).format('YY-MM-DD hh:mm:ss'));
		    	this.clock.end('loading...');
				var diff=this.getDate(et) - this.getDate(this.edata);
		    	var timebar= this.get('#kaijiangexpect');
		    	timebar.html(pid);
				this.get('#kaijiangopencode').html('');
		    	if(diff>0){
		    		clearInterval(window.refreshKjTime);
					var __oncd = {
							endTime: et,
		                    change:function (times, now){
		                    	var lt = times[1]*60*60 + times[2]*60 + times[3];
		                        var wlt = lt>314 ? 314:lt;
		                       
								this.get('#kaijiangopencode').html( '{3}:{4}'.format.apply('{3}:{4}后开奖<span><em style="width:'+wlt+'px"></em></span>', times).replace(/\b\d\b/g,'0$&'));
		                    	
		                    	if (lt==0 ||lt==1){
		                    		this.get('#kaijiangopencode').html('正在开奖……');
									clearInterval(window.refreshKjTime);
									window.refreshKjTime = setInterval(
											function(){
												Y.postMsg('opencodelist_getlistdata');
									}, 1000 * 2);
		                        }
		                    }
		                };
					this.clock.add(__oncd);  
					this.clock.play(this.edata);
		    	}else{
		    		this.get('#kaijiangopencode').html('正在开奖……');
					clearInterval(window.refreshKjTime);
					window.refreshKjTime = setInterval(function(){Y.postMsg('update_opencodelist');}, 1000 * 2);
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
    	var ldate = pid.substr(0, 8);
    	var lpid = pid.substr(6);
    	var npid = "";
    	if(lpid==Class.C('sump')){
    		var dt = "20"+ldate.substr(0,2) + "-" + ldate.substr(2,2) + "-" + ldate.substr(4,2) + " 00:00:00";
    		var ndate = Y.getDate(Date.parse(Y.getDate(dt))+1000*60*60*24).format('YYMMDD');
    		npid = ndate.substr(2,8) + "001";
    	}else{
    		npid = pid * 1 + 1;
    	}
    	return npid;
    },
    createDayOpenCodeHtml: function(){
        var htm = "";
        for(var i=1;i<21;i++){
    		htm+="<tr><th id=span0"+String.zero(i)+">"+String.zero(i)+"</th><td id=dopencode0"+String.zero(i)+">&nbsp;</td>";
    		htm+="<th id=span0"+(20+i)+">"+(20+i)+"</th><td id=dopencode0"+(20+i)+">&nbsp;</td>"+
    			 "<th id=span0"+(40+i)+">"+(40+i)+"</th><td id=dopencode0"+(40+i)+">&nbsp;</td>"+
    		     "<th id=span0"+(60+i)+">"+(60+i)+"</th><td id=dopencode0"+(60+i)+">&nbsp;</td>";
	        if(80+i>=100){
	        	htm+="<th id=span"+(80+i)+">"+(80+i)+"</th><td id=dopencode"+(80+i)+">&nbsp;</td>";
	        }else{
	        	htm+="<th id=span0"+(80+i)+">"+(80+i)+"</th><td id=dopencode0"+(80+i)+">&nbsp;</td>";
	        }
	        htm+="<th id=span"+(100+i)+">"+(100+i)+"</th><td id=dopencode"+(100+i)+">&nbsp;</td></tr>";
    	}
    	$("#kaijiang").html(htm);
    },
    updateDayOpenCode: function(d){
		var rq = Y.getDate(d).format('YYMMDD');
		this.ajax({
			url:"/cpdata/game/"+ Class.C('lot_id') +"/day/"+rq+".json?v="+Math.random(),
			type : "get",
			cache:false,
			dataType : "json",
			end : function(data) {
				var obj = eval("(" + data.text + ")");				
				var r = obj.rows.row;
				r.each(function(rt,o){
					var pid = rt.pid.substr(6,3);
					var codes = rt.codes;
					$("#dopencode"+pid).html(codes);
				});
			}
		});
    }
});