$(function(){
	$('#sublayerlist').dataTable({
		"bLengthChange": false,
		"bFilter": false
	});
	
	$('.sublayer').click(function(){
		location.href = "sublayer";
	});
});