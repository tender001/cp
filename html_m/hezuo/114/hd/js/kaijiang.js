function loadKaiJiang(){
	$.ajax({
		url: "/cpdata/game/aopencode.json",
		dataType: "json",
		success:function(data){
			var rs = data.rows.row;
//			if(rs && !isArray(rs)){rs = new Array(rs);}
			if(rs.length > 0){
				$.each(rs,function(o,r) {
					var gid = r.gid;
					var pid = r.pid;
					
					var codes = r.codes;
					if(!!$("#" + gid)){
						$("#" + gid).find("[mark=qi]").html(pid );
						$("#" + gid).find("[mark=pools]").html(r.pools );
						if(codes.indexOf("|") != -1){
							var code = codes.split("|");
							$("#" + gid).find("[mark=codes]").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
						} else {
						
						}
					}
				});
			}
		},
		error:function(){
			showTips('网络异常!');
        }
	});
}