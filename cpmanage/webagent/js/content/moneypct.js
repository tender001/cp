$(function(){
	$('#setallpct').button({icons:{primary:"ui-icon-pencil"}}).click(function(){
			//reSet();
	});
	setZebraTable($('#money-pct-info'));
});

function setZebraTable($table) {
	$('tbody > tr:odd',$table).addClass('odd');
	$('tbody > tr:even',$table).addClass('even');
}