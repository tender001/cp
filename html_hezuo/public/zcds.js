Class.C('buy_type', 0);
Class.C('isEnd', false);
Class.C('price', 2);
Class.C('play_name', 'pt');
Class.C('min-rengou', .05);
Class.C('isds', true);
Class.C('shownowtime', true);
Class.C('play_name', 'sc');
Class.C('auto-ds-tc',false);//不自动提成

Class.extend('getPlayText', function (play_name){
    return '单式' + ['代购','合买'][Class.C('buy_type')];
});
// 自动生成playid
Class.extend('getPlayId', function (play_name){
    var lotid = this.get('#lotid').val()
    if (lotid == '10000') {
        return 44
    }else if(lotid == '1'){//胜负使用playid识别合买与代购
        return Class.C('buy_type') == 0 ? 4 : 3;
    }else{
        return  3
    }    
});
Class('Application',{
    ready: true,
    use: 'tabs,dataInput',
    index:function (){
    	//this.init();  
        this.lib.Dlg();
        this._addTabs();
        this.lib.HmOptions();
        this.lib.BuySender();
        this._setBuyFlow();
        this.lib.LoadExpect();		
        this.lib.DsUpload();
    },
   _setBuyFlow: function (){
       this.get('#buy_dg,#buy_hm').click(function (e, O){
           var data, msg;
           var lot = O.getLotInfo();
            if (Yobj.C('isEnd')) {
                Yobj.alert('您好，'+lot.name+Yobj.C('expect')+'期已截止！');
                return false;
            }
           O.postMsg('msg_login', function (){
               if (O.postMsg('msg_check_sc_err').data) {
                   return false;// 上传额外检测
               }else if (data = O.postMsg('msg_get_list_data').data) {//索取要提交的参数
                    if (data.zhushu === 0 ) {
                        O.alert('您好，胜负彩复式选择要满足14个不同场次选号才能投注！')
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
             this.get('#hsc').prop('disabled', b==0);
             if (b==0) {
                this.get('#upfile').prop('disabled', false);
             }
             !c && this.moveToBuy()
         };
        buyTabs.focus(1);
        this.get('#hsc').click(function (){
        	if(this.checked){
        		Y.get('#upfile').prop('disabled', this.id == 'hsc');
                Y.get('#dg1').hide();
        	}else{
        		Y.get('#upfile').prop('disabled',false);
        		Y.get('#dg1').show();
        	}
        }).prop('checked', false);
    }
});