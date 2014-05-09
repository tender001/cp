Class.C('buy_type', 0);
Class.C('lot-ch-name', '任选9场');
Class.C('isEnd', false);
Class.C('price', 2);
Class.C('isdt', true);
Class.C('play_name', 'pt');
Class.C('min-rengou', .05);
Class.extend('getPlayText', function (){
    return '胆拖' + ['代购','合买'][Class.C('buy_type')];
});
Class.extend('getPlayId', function (play_name){
    return 123;
});
Class('Application',{
    ready: true,
    use: 'tabs,dataInput,mask',
    index:function (){
        this.lib.Dlg();
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
       }) 
    },
    _addTabs: function (){
        var buyTabs = this.lib.Tabs({
            items: '#b_form b',
            contents: '#dgdiv,#hmdiv',
            focusCss: 'cur'
        });
        //购买方式
        buyTabs.onchange = function (a, b, c){
             Class.config('buy_type', b );
             this.get('#ishm').val(b==1? 1 : 0);
             !c && this.moveToBuy();
             //this.get('#b_form span.r').html(['由购买人自行全额购买彩票','由多人共同出资购买彩票'][b]);
        };
    }
});