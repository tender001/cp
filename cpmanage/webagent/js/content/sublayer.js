$(function(){
	$("#tabs").tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
	$("#tabs li").removeClass("ui-corner-top").addClass("ui-corner-left");
	
	$('#back').addClass('ui-tabs-anchor').parent().addClass('ui-state-default');
	
	$('#back').click(function(){
		location.href = "sublayerlist";
	});
	
	$('#tabs-1').empty().html('<iframe src="accountinfo" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	$('#tabs > ul > li:eq(0) > a').click(function(){
		$('#tabs-1').empty().html('<iframe src="accountinfo" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	});
	$('#tabs > ul > li:eq(1) > a').click(function(){
		$('#tabs-2').empty().html('<iframe src="moneypct" scrolling="no" height="1200px" width="100%" frameborder="0" allowTransparency></iframe>');
	});
	$('#tabs > ul > li:eq(2) > a').click(function(){
		$('#tabs-3').empty().html('<iframe src="moneyinfo" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	});
	$('#tabs > ul > li:eq(3) > a').click(function(){
		$('#tabs-4').empty().html('<iframe src="accountsearch" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	});
	$('#tabs > ul > li:eq(4) > a').click(function(){
		$('#tabs-5').empty().html('<iframe src="sailsearch" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	});
	$('#tabs > ul > li:eq(5) > a').click(function(){
		$('#tabs-6').empty().html('<iframe src="sublayersail" scrolling="no" height="530px" width="100%" frameborder="0" allowTransparency></iframe>');
	});

});
