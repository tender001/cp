/**
 * menu控制下拉
 */
Class({
	ready: true,
    index:function (config){
    	$("#nav_main,#zq_xl,#bf_xl").css({
    		"height":0,
    		"overflow":"hidden"
    		});
    	$(".nav_re h2,#nav_main").hover(function(){
    		$("#nav_main").find("#nav_main").show();
			$("#nav_main").clearQueue().animate({
				height:640
				})
		},function(){
			$("#nav_main").animate({
				height:0
				})
		});
    	$("li.zqzx,#zq_xl").hover(function(){
    		$("#zq_xl").find("#zq_xl").show();
			$("#zq_xl").clearQueue().animate({
				height:90
				})
		},function(){
			$("#zq_xl").animate({
				height:0
				})
		});
    	$("li.bfzb,#bf_xl").hover(function(){
    		$("#bf_xl").find("#bf_xl").show();
			$("#bf_xl").clearQueue().animate({
				height:125
				})
		},function(){
			$("#bf_xl").animate({
				height:0
				})
		});
		 
   
		

    }

});
