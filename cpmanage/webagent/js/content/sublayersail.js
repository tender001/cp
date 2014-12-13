$(function(){
	$('#searchbtn').button({icons:{primary:"ui-icon-search"}}).click(function(){
			//reSet();
	});
	
	$("#fromtime").datepicker({
	 	showOn: "button",
		buttonImage: "image/jquery-ui/calendar.gif",
		buttonImageOnly: true,
		onClose: function(selectedDate) {
			$("#totime").datepicker( "option", "minDate", selectedDate);
		}
	});
	
	$( "#totime" ).datepicker({
		showOn: "button",
		buttonImage: "image/jquery-ui/calendar.gif",
		buttonImageOnly: true,
		onClose: function(selectedDate) {
			$("#fromtime").datepicker( "option", "maxDate", selectedDate);
		}
	});
	
	$('#lotterytypes').select2();
	
	$('#sublayersaillist').dataTable({
		"bLengthChange": false,
		"bFilter": false
	});
});