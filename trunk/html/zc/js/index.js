Class.C('buy_type', 0);
Class.C('lot-ch-name', '胜负彩');
Class.C('isEnd', false);
Class.C('price', 2);
Class.C('play_name', 'pt');
Class.C('min-rengou', .05);
Class.extend('getPlayText', function (){
    return '复式' + ['代购','合买'][Class.C('buy_type')];
});
// 自动生成playid
Class.extend('getPlayId', function (play_name){
    var lotid = this.getInt(this.get('#lotid').val());
    switch(lotid){
        case 10000:
            return 43;
        case 1:
            return Class.C('buy_type') == 0 ? 2 : 1;
        default:
            return 1;
    }
});
Class('Application',{
    ready: true,
    use: 'tabs,dataInput,mask',
    index:function (){
        this.lib.Dlg();
        Class.C('odds_t',''); 
        this._addTabs();
        this.lib.HmOptions();
        this.lib.BuySender();
        this._setBuyFlow();
        this.lib.LoadExpect();
    },
   _setBuyFlow: function (){
       this.get('#buy_dg,#buy_hm').click(function (e, O){
           var data, msg;
           var lot = O.getLotInfo();
            if (Yobj.C('isEnd')) {
                Yobj.alert('您好，'+lot.name+Yobj.C('expect')+'期已截止！');
                return false
            }
           O.postMsg('msg_login', function (){
               if (Class.config('play_name') == 'sc' && y.postMsg('msg_check_sc_err').data) {
                   return false// 上传额外检测
               }else if (data = O.postMsg('msg_get_list_data').data) {//索取要提交的参数
                    if (data.zhushu === 0 ) {
                        O.alert('您好，'+lot.name+'复式选择要满足'+lot.vsLen+'个不同场次选号才能投注！')
                    }else if(data.beishu === 0){
                        O.alert('对不起，请您至少要购买 <strong class="red">1</strong> 倍！')                    
                    }else if(data.totalmoney <= 0){
                        O.alert('发起方案的金额不能为 <strong class="red">0</strong> ！')                       
                    }else{
                        O.C('buy_type') == 0 ? O.postMsg('msg_buy_dg', data) : O.postMsg('msg_buy_hm', data)                
                    }                            
               }                   
           });
           e.end();
           return false;
       }) ;
		this.get("#zxgv").click( function (e,O) {
			if($("#zsSpan").text()=="0"){
				Y.alert('请选择14场比赛进行过滤');
				
			}else{
				  O.postMsg('msg_login', function (){
					 var data = O.postMsg('msg_get_list_data').data
						Y.alert('【在线过滤投注】截止时间以单式截止时间为准！');
					
						$("#yclass_alert_ok").unbind("click").bind("click",function(){
						
							window.open("/zc/gv/index.html?expect="+Y.get("#expect").val()+"&code="+data.codes+"");
						});
				
				});
				
			}
		});
    },
    _addTabs: function (){
        var buyTabs = this.lib.Tabs({
            items: '#b_form b',
            contents: '#dgdiv,#hmdiv',
            focusCss: 'cur'
        });
        //购买方式
        var tipTpl =  '<h5 style="{1}">代购：</h5>'+
            '是指方案发起人自己一人全额认购方案的购彩形式。若中奖，奖金也由发起人一人独享。<br/><br/>'+
            '<h5 style="{2}">合买：</h5>'+
            '由多人共同出资购买同一个方案，如果方案中奖，则按投入比例分享奖金。合买能够实现利益共享、风险共担，是网络购彩的一大优势。'
        this.get('#b_form em.i-qw').tip(false, 5, function (){
            var hm = this.C('buy_type') == 1;
            return tipTpl.format(hm? '' : 'color:red', hm?'color:red':'');
        });
        buyTabs.onchange = function (a, b, c){
             Class.config('buy_type', b );
             this.get('#ishm').val(b==1? 1 : 0);
             !c && this.moveToBuy();
             //this.get('#b_form span.r').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票'][b]);
        };
    }
});