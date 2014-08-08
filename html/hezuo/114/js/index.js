Class(
		'Application',{
    use: 'tabs,dataInput,mask,countDown',
	ready:true,
	index:function(){

        
		this.onMsg('msg_show_endtime_CountDown2',function(et,now,gid){
			return this.setCountDown(et,now,gid);
		});
        this.addTabs();
        this._loadcode();
//        this.initSsq();
//		this.initDlt();
		this.init11X5();
		this.init11X52();
		this.init11X53();
		this.init11X54();
		this.init11Ydj();
		this.init11Ydj2();
		this.init11Ydj3();
		this.init11Ydj4();
		$("#cm_ssq_jx_btn").click();
		$("#cm_dlt_jx_btn").click();
		$("#cm_11x5_jx_btn2").click();
		$("#cm_11x5_jx_btn3").click();
		$("#cm_11x5_jx_btn4").click();
		$("#cm_11x5_jx_btn").click();
		$("#cm_11ydj_jx_btn").click();
		$("#cm_11ydj_jx_btn2").click();
		$("#cm_11ydj_jx_btn3").click();
		$("#cm_11ydj_jx_btn4").click();
		
        this.showchange('54');
        this.listHotProject(1, 8, "table_hot_project");
		Y.use('mask',function(){
			Y.loading = Y.lib.MaskLay();
			Y.loading.noMask = true;
			var dlg_buy_end = Y.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
			dlg_buy_end.addClose('#dlg_buysuc_back','#dlg_buysuc_close','#dlg_buysuc_close2');
			Y.extend('popBuyOk', function(user,lotid,projid){
				$('#dlg_buysuc_view').die().live('click', function(){
					window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;
				});
				dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
			});
		});
		Y.use('mask', function(){
			var addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
			addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
			Y.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
			Y.extend('addMoney', function(){
				addMoneyDlg.pop('', function(e, btn){
					if(btn.id === 'addMoneyYes'){
						window.open($_user.daohang.addmoney);
					}			
				});
			});
		}); 
	},


	_loadcode:function(){//查询开奖公告	        	
     	Y.ajax({
    		url : "/cpdata/game/aopencode.json",
    		type : "GET",
    		dataType : "json",
    		cache : false,
    		end  : function (d){
    			var obj = eval("(" + d.text + ")"); 
    			if (obj) {
    				var r = obj.rows.row;        				
    				r.each(function(rt,o) {
    					var row={};
    					row.code = rt.codes;   				
        				row.etime =  rt.et;   		     				
        				row.pools = rt.pools;  
        				row.pools = row.pools==''?'0元':(parseFloat(row.pools).rmb(false, 0) + "元");
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(5,5);
        				row.awardtime=rt.at.substr(5,5);           					
    					if (row.gid=='80'){
    						Y.get("#sfc_pid").html(row.pid);		
    						Y.get("#sfc_pools").html(row.pools);	
    						Y.get("#sfc_kjdate").html(row.auditdate);
    						Y.get("#sfc_code").html("<b>"+row.code.split(',').join('</b><b>')+"</b>");			
    					}else if (row.gid=='81'){	
    						Y.get("#rxjc_pid").html(row.pid);		
    						Y.get("#rxjc_pools").html(row.pools);
    						Y.get("#rxjc_kjdate").html(row.auditdate);
    						Y.get("#rxjc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
    					}else if (row.gid=='82'){	
    						Y.get("#jqc_pid").html(row.pid);		
    						Y.get("#jqc_pools").html(row.pools);
    						Y.get("#jqc_kjdate").html(row.auditdate);
    						Y.get("#jqc_code").html('<b>'+row.code.split(',').join('</em><b>')+'</b>');		
    					}else if (row.gid=='83'){	
    						Y.get("#bqc_pid").html(row.pid);		
    						Y.get("#bqc_pools").html(row.pools);
    						Y.get("#bqc_kjdate").html(row.auditdate);
    						Y.get("#bqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='50'){	
    						Y.get("#dlt_pid,#topdlt_pid").html(row.pid);	
    						Y.get("#dlt_pools,#topdlt_pools").html(row.pools);
    						Y.get("#dlt_kjdate,#topdlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#dlt_code,#topdlt").html('<em>'+code[0].split(',').join('</em><em>')+'</em>'+' <em class="blue">'+code[1].split(',').join('</em><em class="blue">')+'</em>');
    					}else if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html(row.pid);	
    						Y.get("#ssq_pools,#topssq_pools").html(row.pools);
    						Y.get("#ssq_kjdate,#topssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<em>'+code[0].split(',').join('</em><em>')+'</em>'+' <em class="blue">'+code[1].split(',').join('</em><em class="blue">')+'</em>');	
    					}else if (row.gid=='03'){	
    						Y.get("#sd_pid").html(row.pid);	
    						Y.get("#sd_pools").html(row.pools);
    						Y.get("#sd_kjdate").html(row.awardtime);
    						Y.get("#sd_code").html('<em>'+row.code.split(',').join('</em><em>')+'</em>');
    					}else if (row.gid=='53'){	
    						Y.get("#pls_pid").html(row.pid);	
    						Y.get("#pls_pools").html(row.pools);
    						Y.get("#pls_kjdate").html(row.awardtime);	
    						Y.get("#pls_code").html('<em>'+row.code.split(',').join('</em><em>')+'</em>');
    					}else if (row.gid=='52'){	
    						Y.get("#plw_pid").html(row.pid);
    						Y.get("#plw_pools").html(row.pools);
    						Y.get("#plw_kjdate").html(row.awardtime);
    						Y.get("#plw_code").html('<em>'+row.code.split(',').join('</em><em>')+'</em>');
    					}else if (row.gid=='07'){	
    						Y.get("#qlc_pid").html(row.pid);	
    						Y.get("#qlc_pools").html(row.pools);
    						Y.get("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#qlc_code").html('<em>'+code[0].split(',').join('</em><em>')+'</em>'+' <em class="blue">'+code[1].split(',').join('</em><em class="blue">')+'</em>');			
    					}else if (row.gid=='51'){	
    						Y.get("#qxc_pid").html(row.pid);
    						Y.get("#qxc_pools").html(row.pools);
    						Y.get("#qxc_kjdate").html(row.awardtime);
    						Y.get("#qxc_code").html('<em>'+row.code.split(',').join('</em><em>')+'</em>');
    					}else if (row.gid=='54'){	
    						Y.get("#dlc_pid").html(row.pid);
    						Y.get("#dlc_kjdate").html(row.awardtime);
    						Y.get("#dlc_code").html('<em>'+row.code.split(',').join('</em><em>')+'</em>');
    					}else if (row.gid=='85'){	
    						Y.get("#bjdc_pid").html(row.pid);	
    						Y.get("#bjdc_kjdate").html(row.awardtime);
    					} 
    				});	        				
    			}   
    		}
    	}); 
    },
	setCountDown: function (et,now,gid){// 倒计时
        var info, data, clock, ctpl, ctpl2,  timebar, Y, gp;
        Y = this;
        info = this.get('#responseJson');
        
        if(Class.C('time_style')){
            ctpl = Class.C('time_style_ctpl');
            ctpl2 = Class.C('time_style_ctp2');
            ctpl3 = Class.C('time_style_ctp3');
        }else{
            ctpl = '<font>{1}</font>天<font>{2}</font>小时<font>{3}</font>分';
           
            ctpl2 = '<font>{2}</font>小时<font>{3}</font>分<font>{4}</font>秒';
            ctpl3 = '{3}:{4}';
        }

          
        if(gid==01){
        	timebar = Y.get('#countDownSpan_ssq');
        }
        if(gid==50){
        	timebar = Y.get('#countDownSpan_dlt');
        }
        if(gid==54){
        	timebar = Y.get('#countDownSpan_11x5');
        }
        if(gid==56){
        	timebar = Y.get('#countDownSpan_11ydj');
        }
        if (info) {
          this.config = data = {
          		serverTime:$("#serverTime").val(),
          		endTime:$("#endTime").val()
          };
           Class.config('page-config', data);
          if (et) {
              clock = new this.lib.CountDown();
              var diff=Y.getDate(et) - Y.getDate(now);
              
              if(diff>0){
            	  clearInterval(window.refreshKjTime);
            	  var __oncd = {
                          endTime: et,
                          change:function (times, isEnd, msg, now){
                        	  var tpl = "";
                        	  if(gid==54 || gid==56){
                        		  tpl = ctpl3;
                        	  }else{
                        		  tpl = times[0] > 0 ? ctpl : ctpl2;
                        	  }
                              
                              if (isEnd) {
                            		  timebar.html('<i class="red">'+(msg || '已截止')+'</i>');
                                      Class.config('isEnd', false);
                                      Y.getcurrentissue(54);
                              }else{
                                  timebar.html( ctpl.format.apply(tpl, times).replace(/\b\d\b/g,'0$&'))
                              }                                
                          }                
                      };
            	  
            	  if (Y.C('shownowtime')) {
                      timebar.setStyle('background:#000;color:#00FF00;padding:1px');
                  }
                  if (timebar.size()) {// 常规倒计时
                      if (Y.getDate(et)) {
                          clock.add(__oncd);                            
                      }else{
                          timebar.html('<em class="red">该彩种尚未开售</em>')
                      }                
                  }
                  clock.play(now);
              }else{
            	  clearInterval(window.refreshKjTime);
					window.refreshKjTime = setInterval(
							function(){
								Y.getcurrentissue(54);
					}, 1000 * 10);
              }
              
          }
      }
  },


	init11X5: function(){
	    var r3 = $("#11x5_jx_random em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random em input");
		
		for(var i = 0; i < 8; i ++ ){
			inputs[i].index = i;
			if(i < 8){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<8; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11x5_jx_btn").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11x5").click(function(){
			Y.cast("#11x5_jx_random","/11x5/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,5,11,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,8);
			v.aSort(0);
			for(var i = 0; i < 8; i ++ ){
				v[i] < 13 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11X52: function(){
		var r3 = $("#11x5_jx_random2 em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random2 em input");
		
		for(var i = 0; i < 5; i ++ ){
			inputs[i].index = i;
			if(i < 5){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<5; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11x5_jx_btn2").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11x52").click(function(){
			Y.cast("#11x5_jx_random2","/11x5/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,11,5,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,5);
			v.aSort(0);
			for(var i = 0; i < 5; i ++ ){
				v[i] < 11 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11X53: function(){
	    var r3 = $("#11x5_jx_random3 em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random3 em input");
		
		for(var i = 0; i < 3; i ++ ){
			inputs[i].index = i;
			if(i < 3){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<3; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11x5_jx_btn3").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11x53").click(function(){
			Y.cast("#11x5_jx_random3","/11x5/");
		});	
		
		function ranDom(){
			var num = [10,1,8,9,11,7,2,5,3,4,6];
			num.aSort(2);
			
			var v = num.splice(0,3);
			v.aSort(0);
			for(var i = 0; i < 3; i ++ ){
				v[i] < 10 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11X54: function(){
	    var r3 = $("#11x5_jx_random4 em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random4 em input");
		
		for(var i = 0; i < 3; i ++ ){
			inputs[i].index = i;
			if(i < 3){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<3; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11x5_jx_btn4").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11x54").click(function(){
			Y.cast("#11x5_jx_random4","/11x5/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,5,11,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,3);
			v.aSort(0);
			for(var i = 0; i < 3; i ++ ){
				v[i] < 13 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11Ydj: function(){
	    var r3 = $("#11ydj_jx_random em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random em input");
		
		for(var i = 0; i < 8; i ++ ){
			inputs[i].index = i;
			if(i < 8){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<8; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11ydj_jx_btn").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11ydj").click(function(){
			Y.cast("#11ydj_jx_random","/11ydj/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,5,11,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,8);
			v.aSort(0);
			for(var i = 0; i < 8; i ++ ){
				v[i] < 13 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11Ydj2: function(){
		var r3 = $("#11ydj_jx_random2 em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random2 em input");
		
		for(var i = 0; i < 5; i ++ ){
			inputs[i].index = i;
			if(i < 5){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<5; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11ydj_jx_btn2").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11ydj2").click(function(){
			Y.cast("#11ydj_jx_random2","/11ydj/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,11,5,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,5);
			v.aSort(0);
			for(var i = 0; i < 5; i ++ ){
				v[i] < 11 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11Ydj3: function(){
	    var r3 = $("#11ydj_jx_random3 em input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random3 em input");
		
		for(var i = 0; i < 3; i ++ ){
			inputs[i].index = i;
			if(i < 3){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<3; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11ydj_jx_btn3").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11ydj3").click(function(){
			Y.cast("#11ydj_jx_random3","/11ydj/");
		});	
		
		function ranDom(){
			var num = [10,1,8,9,11,7,2,5,3,4,6];
			num.aSort(2);
			
			var v = num.splice(0,3);
			v.aSort(0);
			for(var i = 0; i < 3; i ++ ){
				v[i] < 10 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	init11Ydj4: function(){
	    var r3 = $("#11ydj_jx_random4 em input");
		
		var reg = /^(0[1-9]|[1-2][1-9]|3[1-5])$/;
		var reg1 = /^0[1-9]|1[1-2]$/;
		
		var inputs = $("#11ydj_jx_random4 em input");
		
		for(var i = 0; i < 3; i ++ ){
			inputs[i].index = i;
			if(i < 3){
				inputs[i].onkeyup = function(){
					var obj = this;
					this.value = this.value.replace(/\D/,"");
					if(this.value > 11){this.value = ''};
					
					for(var j=0; j<this.index; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
					for(var j=(this.index+1); j<3; j++){
						if(this.value == inputs[j].value){this.value = '';};
					}
				};
				inputs[i].onblur = function(){
					if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
					if(this.value == 0){this.value = ""}
				};
			}
		};
		//机选
		$("#cm_11ydj_jx_btn4").click(function(){
			new ScorllNum(11,r3,ranDom);
		});

		$("#buy_dg_11ydj4").click(function(){
			Y.cast("#11ydj_jx_random4","/11ydj/");
		});	
		
		function ranDom(){
			var num = [1,8,9,7,2,10,5,11,3,4,6];
			num.aSort(2);
			num.aSort(2);
			var v = num.splice(0,3);
			v.aSort(0);
			for(var i = 0; i < 3; i ++ ){
				v[i] < 13 ? v[i] = v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			}
		};
	},
	cast:function(codeid, url, qs){
		var data=[];
		var codes = "";
		var wtype = 0;
		$(codeid+" input").each(function(){
			if(!$(this).parent('span').is(':hidden'))
		    data.push($(this).val()*1);
		 });
//		codes = data.join(",");
		
		 if(url == '/11x5/'){
			$('#11x5span>a').each(function(){
				if(Y.hasClass(this,'cur')){
					wtype = this.getAttribute('mark');
				}
			});
			
		
			
			if(wtype=='rx5'){
				if(data.length != 5){
					alert("11选5任选五选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4];
			}else
			if(wtype=='rx3'){
				if(data.length != 3){
					alert("11选5任选三选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2];
			}else if(wtype=='zx3'){
				if(data.length != 3){
					alert("11选5前三直选选号个数错误");
					return;
				}
				codes+=data[0]+"|"+data[1]+"|"+data[2]+"|-|-";
			}else if(wtype =='rx8'){
				if(data.length !=8){
					alert("11选5任选八选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4]+","+data[5]+","+data[6]+","+data[7];
			}
			
			
			for(var i=0; i<data.length; i++){
				if(data[i]<1 || data[i]>11){
					Y.alert("11选5第"+(i+1)+"个选号错误，请重新选号");
					return;
				}
			}
			if(wtype!='zx3'){
				var s = ","+data.slice(0,data.length)+",";
				for(var z=0; z<data.length; z++){
					if(s.replace(data[z]+",", "").indexOf(","+data[z]+",")>-1){
						Y.alert("11选5"+(wtype=='rx5'? "任选五":"任选三")+"选号重复，请重新选号");
						return;
						
					}
				}
			}
			
		}else if(url == '/11ydj/'){
			$('#11ydjspan>i').each(function(){
				if(Y.hasClass(this,'cur')){
					wtype = this.getAttribute('mark');
				}
			});
			
		
			
			if(wtype=='rx5'){
				if(data.length != 5){
					alert("11运夺金任选五选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4];
			}else
			if(wtype=='rx3'){
				if(data.length != 3){
					alert("11运夺金任选三选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2];
			}else if(wtype=='zx3'){
				if(data.length != 3){
					alert("11运夺金前三直选选号个数错误");
					return;
				}
				codes+=data[0]+"|"+data[1]+"|"+data[2]+"|-|-";
			}else if(wtype =='rx8'){
				if(data.length !=8){
					alert("11运夺金任选八选号个数错误");
					return;
				}
				codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4]+","+data[5]+","+data[6]+","+data[7];
			}
			
			
			for(var i=0; i<data.length; i++){
				if(data[i]<1 || data[i]>11){
					Y.alert("11运夺金第"+(i+1)+"个选号错误，请重新选号");
					return;
				}
			}
			if(wtype!='zx3'){
				var s = ","+data.slice(0,data.length)+",";
				for(var z=0; z<data.length; z++){
					if(s.replace(data[z]+",", "").indexOf(","+data[z]+",")>-1){
						Y.alert("11运夺金"+(wtype=='rx5'? "任选五":"任选三")+"选号重复，请重新选号");
						return;
						
					}
				}
			}
			
		}
		if(url.indexOf('11x5')>0 ||url.indexOf('11ydj')>0){
			window.open("http://www.159cai.com/from.phpx?comeFrom=10290&backurl="+url + "?codes=" + codes+"&wtype="+wtype);
		}else{
			window.open("http://www.159cai.com/from.phpx?comeFrom=10290&backurl="+url + "?codes=" + codes);
		}
		
		
	},
    showchange:function (lotid){
    	var row={};
//    	http://www.159cai.com/cpdata/game/01/s.json?rnd=0.21858345700666293
    	Y.ajax({
    		url : "/cpdata/game/"+lotid+"/s.json",
    		type : "GET",
    		dataType : "json",
    		cache : false,
    		end  : function (d){
    			var obj = eval("(" + d.text + ")"); 
    			if (obj) {
    				var r = obj.period.row;        				
    				r.each(function(rt,o) {
    				
						var expectlist = [],now;
						now = d.date;
    					var pid = rt.pid;   //期次
    					var et = rt.et; //截止时间
    					var fet = rt.fet; //截止时间
    					var at = rt.at; //开奖时间
    				
						expectlist[expectlist.length] = [ pid, et, fet, at ];
						if (Y.getDate(et) > Y.getDate(d.date)) {// 只缓存有效期
							if (!Y.C('findCurrented'+"_"+lotid)) {
								if (Y.C('currentExpect'+"_"+lotid) != pid) {
									Y.C('currentExpect'+"_"+lotid, pid);
									Y.C('currentEndtime'+"_"+lotid, et);
//									this.postMsg('msg_expect_change', g.pid, now, endTime, nt);// 更新倒计时
									
									$("font[expect2="+lotid+"]").html(pid);
				    				$("strong[expect="+lotid+"]").html(pid+"期");
									Y.postMsg('msg_show_endtime_CountDown2', et, now,lotid);
								}
								Y.C('findCurrented'+"_"+lotid, true);
							}
						}
    				
    				})
    				

    			}
    	
    		}
    	}); 
    },
    listHotProject:function(pn, ps, toId){
		Y.ajax({
			url : $_trade.url.hlist,
			type : "POST",
			dataType : "json",
			data : {
				pn : pn,
				ps : ps
			},
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.row;
				if(code == 0){
					if(rb){
						r = obj.Resp.row;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = rt.gid;
							var odd=o%2==0?"":"odd";
							var html = '<tr id='+(o+1)+' class='+odd+'>';
							html += '<td>';
							if(rt.iorder > 0 && rt.jindu != 100){
								html += '<img src="/images/index_93.gif" />';
							}else{
								html += (o+1);
							}
							html += '</td>';
							html += '<td>' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</td>';
							html += '<td>' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum)+'&nbsp;&nbsp;')) + '</td>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<i>(保' + (rt.pnum*100/rt.nums).toFixed(0) + '%)</i>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td><i>' + rt.lnum + '</i></td>';
							if(rt.lnum == 0 || rt.state != 1){
								if(rt.state > 2){
									html += '<td>已撤单</td>';
								}else if(rt.state == 2){
									html += '<td>已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td><div class="shouye"><input type="text" value="1" id="hot_rengou_' + (o+1) + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'hot_rengou_' + (o+1) +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
							$(html).appendTo($("#" + toId));
						});
					}
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	},
    addTabs:function(){
    	var playTabs,x5Tabs,ydjTabs;
    	Y =this;
        //玩法标签切换
    	var kaijiangtab=this.lib.Tabs({
            items: '#todaykaijiang span',
            focusCss: 'hover',
            contents: '#k1,#k2',
            delay: 300
        });           
        playTabs = this.lib.Tabs({
            items: '#szctab span',
            contents: '#11x5_1,#11ydj_1,#ssc_1',
            focusCss: ' x511',
        	delay: 300
        });
        playTabs.onchange= function (a, b){
           Y.get(".bod div").addClass("x511");
        	if(b == 0){
            	Y.showchange('54');
//            	Y.loadopencode('01');
//            	$("#cm_ssq_jx_btn").click();
            }else if(b == 1){
            	Y.showchange('56');
//            	Y.loadopencode('50');
//            	$("#cm_dlt_jx_btn").click();
            }else if(b == 2){
//            	Y.showchange('54');
//            	Y.loadopencode('03');
//        		$("#cm_3d_jx_btn").click();
            }else if(b == 3){
            	Y.showchange('56');
//            	Y.loadopencode('53');
//            	$("#cm_p3_jx_btn").click();
            }
        };
        x5Tabs = this.lib.Tabs({
        	items: '#11x5span i',
            contents: '#x1,#x2,#x3,#x4',
            focusCss: 'cur',
        	delay: 300
        });
        x5Tabs.onchange = function (a, b){
        	if(b == "0"){
//        		Y.init11X52();
//        		$("#buy_dg_11x52").click();
        	}
        	if(b == "1"){
//        		Y.init11X53();
//        		$("#buy_dg_11x53").click();
        	}
        	if(b == "2"){
//        		Y.init11X5();
//        		$("#buy_dg_11x5").click();
        	}
        	if(b == "3"){
//        		Y.init11X54();
//        		$("#buy_dg_11x54").click();
        	}
        };
        ydjTabs = this.lib.Tabs({
            items:'#11ydjspan i',
            contents: '#y1,#y2,#y3,#y4',
            focusCss: 'cur',
        	delay: 300
        });

    }
	
	   
});


	rengou = function(lotid,projid,id,lnum){
		Y.postMsg('msg_login', function (){
			var buynum = $("#" + id).val();
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				return false;
			}
			
			if(Y.getInt(buynum) > lnum){
				Y.alert('您好，认购份数不能大于剩余份数！');
				return false;
			}
			
			dobuy = function(){
				Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
		    	Y.postMsg('msg_login', function (){	
			        Y.ajax(
			        {
						 url: $_trade.url.pjoin,
						 type:'POST',
						 data:{
							gid:lotid,
							hid:projid,
							bnum:buynum
						 },
			            end:function(d)
			            {
			            	var obj = eval("(" + d.text + ")");
		  					var code = obj.Resp.code;
		  					var desc = obj.Resp.desc; 
		        			Y.alert.close();
		        			if (code == "0") {        				
		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
//		        				page(Class.C("pn"));
		        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
		        			} else {
		        				if (code=="6"){
		        					Y.addMoney();
		        				}else{
		        					Y.alert('对不起，认购失败,请重新认购！'+desc);
		        				}
		        				
		        			}
			            },
		        		error : function() {
		        			Y.alert("网络故障, 请检查您的帐户再重新投注!");
		        			return false;
		        		}
			        });   
		    	});
			};
			Y.confirm("您好，本次认购金额为"+buynum+"元，请确认！",dobuy,''); 
		});
	};
  



