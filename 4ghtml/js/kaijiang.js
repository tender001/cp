function loadKaiJiang(){
	$.ajax({
		url: "/cpdata/game/aopencode.json",
		dataType: "json",
		success:function(data){
			var rs = data.rows.row;
			if(rs && !isArray(rs)){rs = new Array(rs);}
			if(rs.length > 0){
				$.each(rs,function(o,r) {
					var gid = r.gid;
					var pid = r.pid;
					var codes = r.codes;
					if(!!$("#" + gid)){
						$("#" + gid).find(".qi").html(pid + "期");
						if(codes.indexOf("|") != -1){
							var parts = codes.split("|");
							$.each(parts,function(o,pr){
								$("#" + gid).find(".code").find("span:eq(" + o + ")").html((o > 0 ? "+" : "") +  pr.replaceAll(",", " "));
							});
						} else {
							$("#" + gid).find(".code").html(codes.replaceAll(",", " "));
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