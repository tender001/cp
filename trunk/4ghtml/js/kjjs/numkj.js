$(document).ready(function(){
		 loadcode();
		 $("#jjc").click(function(){
			 $("#ss2").addClass("cur");
			 $("#ss1").removeClass("cur");
			 $("#ss3").removeClass("cur");
	    	 $("#jjcs").show();
	    	 $("#szcs").hide();
	    	 $("#kpcs").hide();
	    });
		 $("#szc").click(function(){
			 $("#ss1").addClass("cur");
			 $("#ss2").removeClass("cur");
			 $("#ss3").removeClass("cur");
	    	 $("#jjcs").hide();
	    	 $("#szcs").show();
	    	 $("#kpcs").hide();
	    });
		 $("#kpc").click(function(){
			 $("#ss3").addClass("cur");
			 $("#ss2").removeClass("cur");
			 $("#ss1").removeClass("cur");
	    	 $("#jjcs").hide();
	    	 $("#szcs").hide();
	    	 $("#kpcs").show();
	    });
		});

	loadcode = function(){//查询开奖公告	        	
     	$.ajax({
    		url : "/cpdata/game/aopencode.json",
    		type : "get",
    		dataType : "json",
    		success : function(d) {
//    			var obj = eval("(" + d.text + ")"); 
//    			if (obj) {d.rows.row
    				var r = d.rows.row;        				
    				$.each(r,function(o,rt) {
    					var row={};
    					row.code = rt.codes;   				
        				row.etime =  rt.et;   		     				
        				row.pools = rt.pools;  
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(0,11);
        				row.awardtime=rt.at.substr(0,10);           					
        				if (row.gid=='80'){
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = (row.money[0] == ''||row.money[0] ===undefined)?'0':(parseFloat(row.money[0]));
    						row.twonum = (row.nums[1] == '' ||row.nums[1]  ===undefined)?'0':(parseFloat(row.nums[1]));
    						row.twomoney =(row.money[1] == ''||row.money[1] ===undefined)?'0':(parseFloat(row.money[1]));
            			
    						$("#sfcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						if(row.twonum=="" || row.twomoney==""||row.twomoney===undefined||row.twonum===undefined){
    							$("#sfc_twomoney").html("二等奖：0注0元"); 
    						}else{
    							$("#sfc_twomoney").html("二等奖："+row.twonum+"注"+row.twomoney+"元");
    						}
						

    						$("#sfc_pid").html(row.pid+"期");	
    						
    						$("#sfc_pools").html(row.pools);	
    						$("#sfc_kjdate").html(row.auditdate);
    						$("#sfc_code").html("<cite>"+row.code.split(',').join('</cite><cite>')+"</cite>");			
    					}else if (row.gid=='82'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]));
            			
    						$("#jqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						$("#jqc_pid").html(row.pid+"期");		
    						$("#jqc_kjdate").html(row.auditdate);
    						$("#jqc_code").html('<cite>'+row.code.split(',').join('</cite><cite>')+'</cite>');		
    					}else if (row.gid=='83'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]));
    						$("#bqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						$("#bqc_pid").html(row.pid+"期");		
    						$("#bqc_kjdate").html(row.auditdate);
    						$("#bqc_code").html('<cite>'+row.code.split(',').join('</cite><cite>')+'</cite>');
    					}else if (row.gid=='50'){	
    						$("#dlt_pid").html(row.pid+"期");		
    						$("#dlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#dlt_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						$("#ssq_pid").html(row.pid+"期");		
    						
    						$("#ssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#ssq_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}else if (row.gid=='03'){	
    						$("#sd_pid").html(row.pid+"期");		
    						$("#sd_kjdate").html(row.awardtime);
    						$("#sd_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='53'){	
    						$("#pls_pid").html(row.pid+"期");		
    						$("#pls_kjdate").html(row.awardtime);	
    						$("#pls_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='52'){	
    						$("#plw_pid").html(row.pid+"期");		
    						$("#plw_kjdate").html(row.awardtime);
    						$("#plw_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='07'){	
    						$("#qlc_pid").html(row.pid+"期");		
    						$("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#qlc_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    						
    					}else if (row.gid=='51'){	
    						$("#qxc_pid").html(row.pid+"期");		
    						$("#qxc_kjdate").html(row.awardtime);
    						$("#qxc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='54'){	
    						$("#11x5_pid").html(row.pid+"期");		
    						$("#11x5_kjdate").html(row.awardtime);
    						$("#11x5_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='56'){	
    						$("#11ydj_pid").html(row.pid+"期");		
    						$("#11ydj_kjdate").html(row.awardtime);
    						$("#11ydj_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='04'){	
    						$("#ssc_pid").html(row.pid+"期");		
    						$("#ssc_kjdate").html(row.awardtime);
    						$("#ssc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}
    				});	     
    			
    		},
    		error:function(){
    			showTips('网络异常!');
            }
    	}); 
    };
   
