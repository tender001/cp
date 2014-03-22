/**
 * menu控制下拉
 */
Class({
	ready: true,
    index:function (config){

    	this.get(".nav h2").mouseover(function(){
    		Y.get("#nav_main").show();
        });
    	this.get(".nav h2").mouseout(function(){
    		Y.get("#nav_main").hide();
        });
    	this.get("#nav_main").mouseover(function(){
    		Y.get("#nav_main").show();
        });
    	this.get("#nav_main").mouseout(function(){
    		Y.get("#nav_main").hide();
        });
		
    	this.get("li.zqzx").mouseover(function(){
    		Y.get("#zq_xl").show();
        });
    	this.get("li.zqzx").mouseout(function(){
    		Y.get("#zq_xl").hide();
        });
    	this.get("#zq_xl").mouseover(function(){
    		Y.get("#zq_xl").show();
        });
    	this.get("#zq_xl").mouseout(function(){
    		Y.get("#zq_xl").hide();
        });
    	
    	this.get("li.bfzb").mouseover(function(){
    		Y.get("#bf_xl").show();
        });
    	this.get("li.bfzb").mouseout(function(){
    		Y.get("#bf_xl").hide();
        });
    	this.get("#bf_xl").mouseover(function(){
    		Y.get("#bf_xl").show();
        });
    	this.get("#bf_xl").mouseout(function(){
    		Y.get("#bf_xl").hide();
        });
    }

});
