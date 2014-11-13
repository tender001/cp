$(document).ready(function(){
	Y.ajax({				
		url : "/cpdata/game/aopencode.json?rnd=" + Math.random(),
		type : "get",
		cache:false,
		dataType : "json",
		end : function(data) {
			var obj = eval("(" + data.text + ")");
			var r = obj.rows.rownow;
			var d = Y.getDate(data.date).format('YY-MM-DD');
			r.each(function(rt,o) {
				var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
				if(nd==d){
					$('#kj'+rt.gid).append("<h4></h4>");
				}
				
			});
		},
		error : function() {
			this.alert("网络故障!");
			return false;
		}
	});
	$(".dt_cn div:first-child").mouseover(function(){
	
	$(this).hide().siblings().show();
	$(this).next().show();
});
	$(".dt_cn div:first-child").mouseout(function(){
		$(this).show();
		$(this).next().hide();
	});
	$(".dt_cn .dt_cd").mouseout(function(){
		
		$(this).hide();
		$(this).prev().show();
	});
	$(" .dt_cn .dt_cd").mouseover(function(){
		
		$(this).show();
		$(this).prev().hide();
	});
});
