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
        this.initSsq();
		this.initDlt();
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
		
        this.showchange('01');
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
        				row.auditdate = rt.auditdate.substr(5,11);
        				row.awardtime=rt.at.substr(5,5);           					
    					if (row.gid=='80'){
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#sfcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#sfc_twomoney").html(row.twomoney);
    						Y.get("#sfc_pid").html(row.pid+"期");		
    						Y.get("#sfc_pools").html(row.pools);	
    						Y.get("#sfc_kjdate").html(row.auditdate);
    						Y.get("#sfc_code").html("<b>"+row.code.split(',').join('</b><b>')+"</b>");			
    					}else if (row.gid=='81'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#renjiumoney").html("任九："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#rxjc_pid").html(row.pid+"期");		
    						
    						Y.get("#rxjc_kjdate").html(row.auditdate);
    						Y.get("#rxjc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
    					}else if (row.gid=='82'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#jqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#jqc_pid").html(row.pid+"期");		
    						Y.get("#jqc_kjdate").html(row.auditdate);
    						Y.get("#jqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
    					}else if (row.gid=='83'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#bqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#bqc_pid").html(row.pid+"期");		
    						Y.get("#bqc_kjdate").html(row.auditdate);
    						Y.get("#bqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='50'){	
    						Y.get("#dlt_pid,#topdlt_pid").html(row.pid+"期");		
    						Y.get("#dlt_pools,#topdlt_pools").html(row.pools);
//    						Y.get("span[pool=50]").html(row.pools);
    						Y.get("[pool=50]").html(row.pools);
    						Y.get("#dlt_kjdate,#topdlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#dlt_code,#topdlt").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html(row.pid+"期");		
    						Y.get("#ssq_pools,#topssq_pools").html(row.pools);
    						Y.get("[pool=01]").html(row.pools);
    						Y.get("#ssq_kjdate,#topssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}else if (row.gid=='03'){	
    						Y.get("#sd_pid").html(row.pid+"期");		
    						Y.get("#sd_pools").html(row.pools);
    						Y.get("#sd_kjdate").html(row.awardtime);
    						Y.get("#sd_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='53'){	
    						Y.get("#pls_pid").html(row.pid+"期");		
    						Y.get("#pls_pools").html(row.pools);
    						Y.get("#pls_kjdate").html(row.awardtime);	
    						Y.get("#pls_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='52'){	
    						Y.get("#plw_pid").html(row.pid+"期");		
    						Y.get("#plw_pools").html(row.pools);
    						Y.get("#plw_kjdate").html(row.awardtime);
    						Y.get("#plw_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='07'){	
    						Y.get("#qlc_pid").html(row.pid+"期");		
    						Y.get("#qlc_pools").html(row.pools);
    						Y.get("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#qlc_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');			
    					}else if (row.gid=='51'){	
    						Y.get("#qxc_pid").html(row.pid+"期");		
    						Y.get("#qxc_pools").html(row.pools);
    						Y.get("#qxc_kjdate").html(row.awardtime);
    						Y.get("#qxc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='54'){	
    						Y.get("#dlc_pid").html(row.pid+"期");		
    						Y.get("#dlc_kjdate").html(row.awardtime);
    						Y.get("#dlc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='85'){	
    						Y.get("#bjdc_pid").html(row.row.pid+"期");		
    						Y.get("#bjdc_kjdate").html(row.awardtime);
    					} 
    				});	     
    				var o = obj.rows.rownow;
    				var d = Y.getDate(d.date).format('YY-MM-DD');
    				o.each(function(rt,o) {
    					var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
    					if(nd==d){
    						
    						$("em[expect="+rt.gid+"]").html(rt.nowpid+"期");
    						$("span[pool="+rt.gid+"]").html(rt.pools);
    						$("div[today="+rt.gid+"]").show();
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
    initSsq: function(){
		Y = this;
		var inputs = $("#ssq_jx_random b" + " input");
		var r1 = $('#ssq_jx_random b input').slice(0,6);
		var b1 = $('#ssq_jx_random b input').slice(6,7);
		
		for(var i = 0; i < 6; i ++ ){
			inputs[i].index = i;
			inputs[i].onkeyup = function(){
				var obj = this;
				this.value = this.value.replace(/\D/,"");
				if(this.value > 33){this.value = '';};
			};
			
			inputs[i].onblur = function(){
				for(var j=0; j<this.index; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				for(var j=(this.index+1); j<6; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
				if(this.value == 0){this.value = "";}
			};
		};
		
		//蓝球
		inputs[6].onkeyup = function(){
			var obj = this;
			this.value = this.value.replace(/\D/,"");
			if(this.value > 16){this.value = '';};
		};
		inputs[6].onblur = function(){
			if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
			if(this.value == 0){this.value = "";}
		};
		
		//机选
		$("#cm_ssq_jx_btn").click(function(){
			new ScorllNum(33,r1,ranDom);
			new ScorllNum(16,b1,ranDom);
		});
		
		$("#ssq_buy_dg").click(function(){
			Y.cast("#ssq_jx_random","/shuangseqiu/");
		});
		
		function ranDom(){
			var num = [32,1,8,5,7,33,10,4,9,6,11,12,2,3,15,13,14,16,17,18,20,19,21,23,22,26,24,30,31,27,25,29,28];
			var num1 = [2,1,16,3,6,7,5,4,14,9,15,10,11,12,8,13];
			num.aSort(2);
			num.aSort(2);
			num1.aSort(2);
			num1.aSort(2);
			var v = num.splice(0,6);
			v.aSort(0);
			for(var i = 0; i < 6; i ++ ){
				v[i] < 10 ? v[i] = "0" + v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			};
			var v1 = num1[0] < 10 ? "0" + num1[0] : num1[0];
			inputs[6].value = v1;
		};
	},
	initDlt: function(){
		Y = this;
		var inputs = $("#dlt_jx_random b" + " input");
		var r1 = $('#dlt_jx_random b input').slice(0,5);
		var b1 = $('#dlt_jx_random b input').slice(5,7);
		
		for(var i = 0; i < 5; i ++ ){
			inputs[i].index = i;
			inputs[i].onkeyup = function(){
				var obj = this;
				this.value = this.value.replace(/\D/,"");
				if(this.value > 35){this.value = '';};
			};
			
			inputs[i].onblur = function(){
				for(var j=0; j<this.index; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				for(var j=(this.index+1); j<5; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
				if(this.value == 0){this.value = "";}
			};
		};
		
		//蓝球
		for(var i = 5; i < 7; i ++ ){
			inputs[i].index = i;
			inputs[i].onkeyup = function(){
				var obj = this;
				this.value = this.value.replace(/\D/,"");
				if(this.value > 12){this.value = '';};
			};
			
			inputs[i].onblur = function(){
				for(var j=5; j<this.index; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				for(var j=(this.index+1); j<7; j++){
					if(parseInt(this.value) == parseInt(inputs[j].value)){this.value = '';};
				}
				if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
				if(this.value == 0){this.value = "";}
			};
		};
		
		//机选
		$("#cm_dlt_jx_btn").click(function(){
			new ScorllNum(35,r1,ranDom);
			new ScorllNum(12,b1,ranDom);
		});
		
		$("#dlt_buy_dg").click(function(){
			Y.cast("#dlt_jx_random","/daletou/");
		});
		
		function ranDom(){
			var num = [32,1,8,5,7,33,10,4,9,6,11,12,2,3,15,13,35,14,16,17,18,20,19,21,23,22,34,26,24,30,31,27,25,29,28];
			var num1 = [2,1,3,6,7,5,4,9,10,11,12,8];
			num.aSort(2);
			num.aSort(2);
			num1.aSort(2);
			num1.aSort(2);
			var v = num.splice(0,5);
			v.aSort(0);
			var aa = num1.splice(0,2);
			aa.aSort(0);
			for(var i = 0; i < 5; i ++ ){
				v[i] < 10 ? v[i] = "0" + v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			};
			for(var j = 0; j < 2; j ++ ){
				aa[j] < 10 ? aa[j] = "0" + aa[j] : aa[j] = aa[j];
				inputs[j+5].value = aa[j];
			};
		};
	},
	init11X5: function(){
	    var r3 = $("#11x5_jx_random b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random b input");
		
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
		var r3 = $("#11x5_jx_random2 b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random2 b input");
		
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
	    var r3 = $("#11x5_jx_random3 b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random3 b input");
		
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
	    var r3 = $("#11x5_jx_random4 b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11x5_jx_random4 b input");
		
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
	    var r3 = $("#11ydj_jx_random b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random b input");
		
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
		var r3 = $("#11ydj_jx_random2 b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random2 b input");
		
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
	    var r3 = $("#11ydj_jx_random3 b input");
		
		var reg = /^(0[1-9]|[1-2][0-9]|3[0-5])$/;
		var reg1 = /^0[1-9]|1[0-2]$/;
		
		var inputs = $("#11ydj_jx_random3 b input");
		
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
	    var r3 = $("#11ydj_jx_random4 b input");
		
		var reg = /^(0[1-9]|[1-2][1-9]|3[1-5])$/;
		var reg1 = /^0[1-9]|1[1-2]$/;
		
		var inputs = $("#11ydj_jx_random4 b input");
		
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
		
		if(url=="/shuangseqiu/"){
			if(data.length != 7){
				alert("双色球选号个数错误");
				return;
			}
			for(var i=0; i<data.length; i++){
				if(i<6){
					if(data[i]<1 || data[i]>33){
						alert("双色球红球第"+(i+1)+"个选号错误，请重新选号");
						return;
					}
					
				}else{
					if(data[i]<1 || data[i]>16){
						alert("双色球蓝球选号错误，请重新选号");
						return;
					}
				}
			}
			var s = ","+data.slice(0,data.length-1)+",";
			for(var z=0; z<data.length-1; z++){
				if(s.replace(data[z]+",", "").indexOf(","+data[z]+",")>-1){
					alert("双色球红球选号重复，请重新选号");
					return;
					
				}
			}
			codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4]+","+data[5]+"|"+data[6];
		}else if(url=="/daletou/"){
			if(data.length != 7){
				alert("大乐透选号个数错误");
				return;
			}
			for(var i=0; i<data.length; i++){
				if(i<5){
					if(data[i]<1 || data[i]>35){
						alert("大乐透前区第"+(i+1)+"个选号错误，请重新选号");
						return;
					}
				}else{
					if(data[i]<1 || data[i]>12){
						alert("大乐透后区选号错误，请重新选号");
						return;
					}
				}
			}
			var s = ","+data.slice(0,data.length-1)+",";
			for(var z=0; z<data.length-2; z++){
				if(s.replace(data[z]+",", "").indexOf(","+data[z]+",")>-1){
					alert("大乐透前区选号重复，请重新选号");
					return;
				}
			}
			if(data[5]==data[6]){
				alert("大乐透后区选号重复，请重新选号");
				return;
			}
			codes+=data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4]+"|"+data[5]+","+data[6];
		}else if(url == '/11x5/'){
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
			$('#11ydjspan>a').each(function(){
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
    addTabs:function(){
    	var playTabs,x5Tabs,ydjTabs;
    	Y =this;
        //玩法标签切换
    	this.lib.Tabs({
            items: '#todaykaijiang b',
            focusCss: 'cur',
            contents: '#k1,#k2,#k3',
            delay: 300
        });           
        playTabs = this.lib.Tabs({
            items: '#szctab a',
            contents: '#ssq_1,#dlt_1,#11x5_1,#11ydj_1',
            focusCss: 'cur',
        	delay: 300
        });
        playTabs.onchange= function (a, b){
            if(b == 0){
            	Y.showchange('01');
//            	Y.loadopencode('01');
//            	$("#cm_ssq_jx_btn").click();
            }else if(b == 1){
            	Y.showchange('50');
//            	Y.loadopencode('50');
//            	$("#cm_dlt_jx_btn").click();
            }else if(b == 2){
            	Y.showchange('54');
//            	Y.loadopencode('03');
//        		$("#cm_3d_jx_btn").click();
            }else if(b == 3){
            	Y.showchange('56');
//            	Y.loadopencode('53');
//            	$("#cm_p3_jx_btn").click();
            }
        };
        x5Tabs = this.lib.Tabs({
        	items: '#11x5span a',
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
            items:'#11ydjspan a',
            contents: '#y1,#y2,#y3,#y4',
            focusCss: 'cur',
        	delay: 300
        });
//        ydjTabs.onchange = function (a, b){
//        	var lotid ="";
//        	if(b == "0"){
//        		lotid = '54';
//        		Y.getcurrentissue(lotid);
//        	}
//        	if(b == "1"){
//        		lotid = '20';
//        		Y.getcurrentissue(lotid);
//        	}
//        	if(b == "2"){
//        		lotid = '06';
//        		Y.getcurrentissue(lotid);
//        	}
//        };
    }
	
	   
});

(function(B, H, s, f, tp, z, y, c, ul, li, dl, up, dn, e, bt) {
	if(B.mozilla) {
		f -= 5;
	}
	if(B.webkit || B.opera) {
		f -= 5;
	}
	$(function() {
		dl = $('.jrkjm .jrkjc');
		up = $('#scroll_up');
		dn = $('#scroll_down');
		dl.css('margin-top', tp = 0);
		c = dl.eq(0);
		up.hover(slowUp, clear);
		dn.hover(slowDn, clear);
		up.mousedown(fastUp);
		dn.mousedown(fastDn);
		up.mouseup(slowUp);
		dn.mouseup(slowDn);
	});


	function clear() {
		clearTimeout(e);
	}

	function set(v, h) {
		clear();
		var ci = getc();
		c = dl.eq(ci);
		var ch = c.height();
		h = H - ch - 14;
		if((tp < 0 || v > 0) && (tp > h || v < 0)) {
			tp -= v;
			if(tp <= 0) {
				if(tp < h) {
					tp = h;
				}
			} else {
				tp = 0;
			}
			c.css('margin-top', tp);
			e = setTimeout(function() {
				set(v);
			}, 10);
		}
	}

	function getc() {
		var c = 0;
		$("#todaykaijiang b").each(function(){
			if($(this).hasClass('cur')) {
				c = $(this).attr("ttl");
			}
		});
		return c;
	}	
		
	function slowDn() {
		set(s);
	}

	function fastDn() {
		set(f);
	}

	function slowUp() {
		set(-s);
	}

	function fastUp() {
		set(-f);
	}
})($.browser, 300, 1, 10, 0);


