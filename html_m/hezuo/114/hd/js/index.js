Class(
		'Application',{
    use: 'tabs,dataInput,mask,countDown',
	ready:true,
	index:function(){
        this._loadcode();
       
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
        				row.pools = row.pools==''?'0':(parseFloat(row.pools).rmb(false, 0) + "");
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(5,11);
        				row.awardtime=rt.at.substr(5,5);           					
    					 if (row.gid=='50'){	
    						Y.get("#dlt_pid,#topdlt_pid").html(row.pid+"期");		
    						Y.get("#dlt_pools,#topdlt_pools,span[pool=50]").html(row.pools);
    						Y.get("#dlt_kjdate,#topdlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#dlt_code,#topdlt").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html(row.pid+"期");		
    						Y.get("#ssq_pools,#topssq_pools , span[pool=01]").html(row.pools);
    						
    						Y.get("#ssq_kjdate,#topssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}
    				});	     
    				var o = obj.rows.rownow;
    				o.each(function(rt,o) {
    				
						$("span[pool="+rt.gid+"]").html(rt.pools);
    					
    				});
    				
    			}   
    		}
     	
    	}); 
     	
    }
    
	
	   
});
