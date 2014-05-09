$(function(){
	
	var topid =location.search.getParam('topid');
	

	$("#"+"top"+topid+"").addClass('cur').siblings().removeClass("cur");

	$(".ts_bz .help_pro_m").eq(topid-1).show().siblings().hide();
	var titleid=location.search.getParam('titleid');
	if(titleid!=""){
		

		$("#"+"top"+topid+"_"+titleid+"").show();
	
	}
});
$(function(){
	
	var showid =location.search.getParam('showid');
	
	if(showid=="")showid=1;
	$("#"+"show"+showid+"").addClass('cur').siblings().removeClass("cur");

	$(".help_lc_mz .help_lc_m").eq(showid-1).show().siblings().hide();
	
});
$(function(){
	
	var leftid =location.search.getParam('leftid');
	
	if(leftid=="")leftid=1;
	$("#"+"left"+leftid+"").addClass('cur').siblings().removeClass("cur");

	
	
});
$(function(){
	
	var tmpUPage =(document.URL).split( "/" );  
	var thisUPage = tmpUPage[ tmpUPage.length-1 ];  
	if(thisUPage.split("?").length>1){
		thisUPage=thisUPage.split("?")[0]
	}
	$(".help_left li a").each(function(){
		var Url=($(this).attr("href")).split( "/" );
		var urls=Url[ Url.length-1 ]; 
		
		if(thisUPage==urls){
			$(this).addClass('cur').siblings().removeClass("cur");
		}
	});

});
$(function(){
	
var helpid =location.search.getParam('helpid');
	
	if(helpid=="")helpid=1;
	$("#help1").removeClass('cur');
	$("#help2").removeClass('cur');
	$("#help3").removeClass('cur');
	$("#help_1_1").hide();
	$("#help_2_1").hide();
	$("#help_3_1").hide();
	$("#"+"help"+helpid+"").addClass('cur');
	$("#"+"help_"+helpid+"_1").show();
	$(".help_left h2").click(function (){
		$(this).next().toggle();
	})
});


	
