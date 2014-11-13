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
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html("第"+ row.pid+"期");		
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<em>'+code[0].split(',').join('</em><em>')+'</em>'+' <em class="blue">'+code[1].split(',').join('</em><em class="blue">')+'</em>');	
    					}
    				});	     
    			}   
    		}
     	
    	}); 
    }
    
	
	   
});
