$(document).ready(function(){

	showtree = function(rows, id, cla){
		var arr = [];
		if(rows.length > 0){
			arr.push("<ul" + (id!=undefined ? " id=\"" + id + "\"" : "")  + (cla!=undefined ? " class=\"" + cla + "\"" : "") + ">");
			for(var i = 0; i < rows.length; i++){
				arr.push("<li><span><a href='agent/index.html?cagentid=" + $(rows[i]).attr("id") + "' target='main'>" + $(rows[i]).attr("id") + $(rows[i]).attr("name") + "</a></span>");
				
				var c = $(rows[i]).children();
				if(c.length>0){
					arr.push(showtree(c));
				}
				
				arr.push("</li>");
			}
			arr.push("</ul>");
		}
		return arr.join("");
	};
	
	Tool.ajax('tree.aspx',
		{},
		function(xml) {
			var code = $(xml).find("Resp").attr("code");
			var desc = $(xml).find("Resp").attr("desc");
			if(code == 0){
				var rows = $(xml).find("agent");
				if(rows){
					$("#agent").html("代理商 <a href='agent/index.html?cagentid="+rows.attr("id")+"' target='main'>" + rows.attr("id") + rows.attr("name") + "</a> 下级列表");
					$("#main").html(showtree(rows.children(),"red","treeview-red"));

					$("#red").treeview({
						animated: "fast",
						collapsed: true,
						unique: true,
						persist: "cookie",
						toggle: function() {
							window.console && console.log("%o was toggled", this);
						}
					});
				}
			}else{
				$("#agent").html(desc);
				//Tool.warn(desc);
			}
		}
	);
});