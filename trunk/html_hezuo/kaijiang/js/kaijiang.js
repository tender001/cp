/**
 * 全国开奖
 */
Class({
	ready: true,
    index:function (config){

    	
		this._loadcode();
		this.get("#kj_select").click(function(){
			var s=document.getElementById("select_cz").selectedIndex;
			if(s==0){alert("请选择您要查询的彩种");
			}else if(s==1){
				window.open('/jc/kaijiang.html');
			}else if(s==2){
				window.open('/lc/kaijiang.html');
			}else if(s==3){
				window.open('/bj/kaijiang.html');
			}else if(s==4){
				window.open('/zc/zc_kj.html?lotid=80');
			}else if(s==5){
				window.open('/zc/zc_kj.html?lotid=81');
			}else if(s==7){
				window.open('/zc/zc_kj.html?lotid=82');
			}else if(s==6){
				window.open('/zc/zc_kj.html?lotid=83');
			}else if(s==8){
				window.open('/shuangseqiu/kaijiang.html');
			}else if(s==9){
				window.open('/daletou/kaijiang.html');
			}else if(s==10){
				window.open('/3d/kaijiang.html');
			}else if(s==11){
				window.open('/paisan/kaijiang.html');
			}else if(s==12){
				window.open('/paiwu/kaijiang.html');
			}else if(s==13){
				window.open('/qilecai/kaijiang.html');
			}else if(s==14){
				window.open('/qixingcai/kaijiang.html');
			}else if(s==15){
				alert("请选择其他彩种")
			}
			
		})
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
    						Y.get("#jqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
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
    						Y.get("#dlt_code,#topdlt").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html(row.pid);	
    						Y.get("#ssq_pools,#topssq_pools").html(row.pools);
    						Y.get("#ssq_kjdate,#topssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}else if (row.gid=='03'){	
    						Y.get("#sd_pid").html(row.pid);	
    						Y.get("#sd_pools").html(row.pools);
    						Y.get("#sd_kjdate").html(row.awardtime);
    						Y.get("#sd_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='53'){	
    						Y.get("#pls_pid").html(row.pid);	
    						Y.get("#pls_pools").html(row.pools);
    						Y.get("#pls_kjdate").html(row.awardtime);	
    						Y.get("#pls_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='52'){	
    						Y.get("#plw_pid").html(row.pid);
    						Y.get("#plw_pools").html(row.pools);
    						Y.get("#plw_kjdate").html(row.awardtime);
    						Y.get("#plw_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='07'){	
    						Y.get("#qlc_pid").html(row.pid);	
    						Y.get("#qlc_pools").html(row.pools);
    						Y.get("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#qlc_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');			
    					}else if (row.gid=='51'){	
    						Y.get("#qxc_pid").html(row.pid);
    						Y.get("#qxc_pools").html(row.pools);
    						Y.get("#qxc_kjdate").html(row.awardtime);
    						Y.get("#qxc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='54'){	
    						Y.get("#dlc_pid").html(row.pid);
    						Y.get("#dlc_kjdate").html(row.awardtime);
    						Y.get("#dlc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='85'){	
    						Y.get("#bjdc_pid").html(row.pid);	
    						Y.get("#bjdc_kjdate").html(row.awardtime);
    					} 
    				});	        				
    			}   
    		}
    	}); 
    }
});
