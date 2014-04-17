
function historyMatchOdds(config) {
    var delayTime = [];
	
	var path = Class.config('odds_t');
	if(Class.C('lot_id')==85){
		
		path +=$("#expect").val();
	}if(Class.C('lot_gid')==1 ){
		
		path ='80/'+$("#expect").val();
	}if(Class.C('lot_gid')==2 ){
		
		path ='82/'+$("#expect").val();
	}if(Class.C('lot_gid')==3 ){
		
		path ='83/'+$("#expect").val();
	}
    $(config.items).each(function(index) {
        $(this).hover(function() {
            var _self = this;
            delayTime[index] = setTimeout(function() {
				$(config.tip).remove();
				var mid = $(_self).attr("data");
				var oz_id= $(_self);
			


				
	var odds_div = "<div class=\"team_tk\" id=\"" + config.tipid +"\">" +
									  "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\">"+
									  "<colgroup><col width=\"65\"><col width=\"75\"><col width=\"\"><col width=\"45\"><col width=\"\"><col width=\"35\"><col width=\"35\"><col width=\"35\"><col width=\"35\"></colgroup>"+
										"<thead><tr> <td>类型</td><td>日期</td><td>主场</td> <td>盘口</td><td>客场</td><td>比分</td><td>半场</td><td>胜负</td> <td>盘路</td> </tr></thead>"+
									   "<tbody id=\"oddslist\"><tr><td colspan=\"9\">正在载入...</td></tr></tbody></table></div>";
			
				$.ajax({
					url:"/cpdata/omi/"+path+"/historymatch/"+mid+".xml",
					dataType : "xml",
					success : function(data) {
						$("body").append(odds_div);
						$(config.tip).css({
							"top" : (oz_id.offset().top + oz_id.height() + 20) + "px",
							"left" : (oz_id.offset().left + oz_id.width() - config.fleft) + "px"
						}).show();
						var r = $(data).find("r");
						var oddslist = ""
						r.each(function(){
							var ln = $(this).attr("ln")==""?'-':$(this).attr("ln");
							var hteam = $(this).attr("hteam")==""?'-':$(this).attr("hteam");
							var ateam = $(this).attr("ateam")==""?'-':$(this).attr("ateam");
							var mtime = $(this).attr("mtime")==""?'-':$(this).attr("mtime");
							var hscore = $(this).attr("hscore")==""?'-':$(this).attr("hscore");
							var ascore = $(this).attr("ascore")==""?'-':$(this).attr("ascore");
							var bc = $(this).attr("bc")==""?'-':$(this).attr("bc");
							var bet = $(this).attr("bet")==""?'-':$(this).attr("bet");
							var binfo = $(this).attr("binfo")==""?'-':$(this).attr("binfo");
							var cl = $(this).attr("cl")==""?'-':$(this).attr("cl");
							var htid = $(this).attr("htid")==""?'-':$(this).attr("htid");
							var atid = $(this).attr("atid")==""?'-':$(this).attr("atid");
							var sfinfo = "";
							var hc = "#000000";
							var ac = "#000000";
							if(hscore==ascore){
								sfinfo = "<span style=\"color:#008001\">平</span>";
								if(mid==htid){
									hc = "#008001";
								}else{
									ac = "#008001";
								}
							}else if(hscore>ascore){
								if(mid==htid){
									sfinfo = "<span style=\"color:#FF0000\">胜</span>";
									hc = "#FF0000";
								}else{
									sfinfo = "<span style=\"color:#0000FE\">负</span>";
									ac = "#0000FE";
								}
							}else{
								if(mid==htid){
									sfinfo = "<span style=\"color:#0000FE\">负</span>";
									hc = "#0000FE";
								}else{
									sfinfo = "<span style=\"color:#FF0000\">胜</span>";
									ac = "#FF0000";
								}
							}
							if(binfo=="输"){
								binfo = "<span style=\"color:#0000FE\">输</span>";
							}else if(binfo=="赢"){
								binfo = "<span style=\"color:#FF0000\">赢</span>";
							}else if(binfo=="走"){
								binfo = "<span style=\"color:#008001\">走</span>";
							}
							var mydate=new Date(mtime*1000);
							if(parseFloat(bet)>0){
								bet = "-" + bet;
							}else if(parseFloat(bet)<0){
								bet = bet.replaceAll("-", "");
							}
							
							oddslist +="<tr>"
							oddslist +="<td style=\"color:#FFFFFF;background:#" + cl +"\">" + ln + "</td>";
							oddslist +="<td>" + mydate.format("MM-DD hh:mm")+ "</td>";
							oddslist +="<td style=\"color:" + hc +"\">" + hteam + "</td>";
							oddslist +="<td>" + bet + "</td>";
							oddslist +="<td style=\"color:" + ac +"\">" + ateam + "</td>";
							oddslist +="<td>" + hscore + ":" + ascore + "</td>";
							oddslist +="<td>" + bc + "</td>";
							oddslist +="<td>" + sfinfo + "</td>";
							oddslist +="<td>" + binfo + "</td>";
							oddslist +="</tr>";
						});
						$("#oddslist").html(oddslist);
					},
					error : function() {
						return false;
					}
				});
            },
            300);
        },
        function() {
            clearTimeout(delayTime[index]);
            $(config.tip).remove(); 
        });
    });
}


$.fn.odds_select_name=function(){
	$self=$(this);
	$self.each(function(){
		var $div1=$self.children("div");
		var $div2=$self.find("div.jcslt");
		$div1.mouseover(function(){
			$div2.show();
//			$div1.toggle();
			$div1.addClass("matchxzc");
//			$(this).addClass("matchxzc");
			
			
		
			return false;
			
		});
		$div1.mouseout(function(){
			$div2.hide();
			$div1.removeClass("matchxzc");
		});
		
//	
//		document.onclick = function(){
//			$div2.hide();
//			$div1.removeClass("matchxzc");
//			
//		};
		$div2.find("a").click(function(){
			$(this).blur();  
			var txt=$(this).text();
			var ctxt=$(this).attr("name");
			$div1.find("em").attr("data", ctxt);
			$div1.find("em").text(txt);
			Class.config('odds_t',ctxt);
//			$div2.find("a").removeClass("cm_cur");   
//			$(this).addClass("cm_cur");
			$div2.hide();
			$div1.removeClass("matchxzc");
			load_odds_sp();
			return false;	
		});
	});
}

load_odds_sp = function(){
	if(Class.C('lot_id')==85){
		var expect = $("#expect").val();
		
		load_odds_sp_data("/odds/bjdc/oz/" + expect + "/");
	}else if(Class.C('lot_id')==90){
		load_odds_sp_data("/odds/jczq/oz/");
	}else if(Class.C('lot_gid')==1 || Class.C('lot_gid')==2 || Class.C('lot_gid')==3){
		var expect = $("#expect").val();
		load_odds_sp_data("/odds/zc/oz/" + expect + "/");
		
		
	}
}


load_odds_sp_data = function(path){
	var ot = Class.config('odds_t');
	var ourl="/cpdata/omi"+path+ot+".xml"+ "?rnd=" + Math.random();
	$.ajax({
		url:ourl,
		dataType : "xml",
		success : function(data) {
			var r = $(data).find("row");
			r.each(function(i){
				var b3 = $(this).attr("oh");
				var b1 = $(this).attr("od");
				var b0 = $(this).attr("oa");
				var mid = $(this).attr("xid");
				var oddsmid = $(this).attr("oddsmid");
				 var flag_arr = $(this).attr("cflag").split(",");
				if(ot>0){
					if(Class.C('lot_gid')==1 ){
						$("#oh" + (i+1)).html((b3*100/100).toFixed(2)).css("color", getcolor(flag_arr[0]));
						 $("#od" + (i+1)).html((b1*100/100).toFixed(2)).css("color", getcolor(flag_arr[1]));
						 $("#oa" + (i+1)).html((b0*100/100).toFixed(2)).css("color", getcolor(flag_arr[2]));
					}else{
						$("#oh" + mid).html((b3*100/100).toFixed(2)).css("color", getcolor(flag_arr[0]));
						 $("#od" + mid).html((b1*100/100).toFixed(2)).css("color", getcolor(flag_arr[1]));
						 $("#oa" + mid).html((b0*100/100).toFixed(2)).css("color", getcolor(flag_arr[2]));
					}
					
				}else{
					 $("#oh" + mid).html((b3*100/100).toFixed(2));
					 $("#od" + mid).html((b1*100/100).toFixed(2));
					 $("#oa" + mid).html((b0*100/100).toFixed(2));
				}

				 $("#odds" + mid).attr("data",oddsmid);
			});
		},
		error : function() {
			return false;
		}
	});
}


getcolor = function(n){
	return n==0 ? "black": n==-1 ? "green":n==1 ? "red":"";
}

function ozOdds(config) {
	var delayTime = [];
	var path=config.path;
if(Class.C('lot_id')==85 ){
		path +="/"+$("#expect").val();
	}else if(Class.C('lot_gid')==1 || Class.C('lot_gid')==2 || Class.C('lot_gid')==3){
		path +=$("#expect").val();
	}
    $(config.items).each(function(index) {
        $(this).parent().hover(function() {
            var _self = this;
            delayTime[index] = setTimeout(function() {
				$(config.tip).remove();
				var mid = $(_self).children().attr("data");
				var ot = Class.config('odds_t');
				if(ot>0){
					var oz_id= $(_self);
					var otext = $("#oddstype div em").html();
					var odds_div = "<div class=\"plv_tk\" id=\"" + config.tipid +"\"><table width=\"100%\" border=\"0\" cellpadding=\"0\"\ cellspacing=\"0\">" +
					"<colgroup><col width=\"\"><col width=\"46\"><col width=\"46\"><col width=\"46\"></colgroup><thead>"+
					"<tr><td colspan=\"4\">"+otext+" 指数变化</td></tr></thead><tbody id=\"oddslist\">" +
					"<tr><td colspan=\"4\">正在载入...</td></tr></tbody></table></div>";
					$.ajax({
						url:path+"/"+ot+"/"+mid+".xml",
						dataType : "xml",
						success : function(data) {
							$("body").append(odds_div);
							$(config.tip).css({
								"top" : (oz_id.offset().top + oz_id.height() + 20) + "px",
								"left" : (oz_id.offset().left - 130) + "px"
							}).show();
							var r = $(data).find("row");
							var oddslist = "";
							oddslist +="<tr><td>变化时间</td><td>胜</td><td>平</td><td>负</td></tr>";
							var ln = r.length;
							if(ln>5){
								ln = 5;
							}
							for ( var i = 0; i < ln; i++) {
								var oh = r.eq(i).attr("oh");
								var od = r.eq(i).attr("od");
								var oa = r.eq(i).attr("oa");
								var tp = r.eq(i).attr("tp");
								var gtime = r.eq(i).attr("gtime");
								var mydate=new Date(gtime*1000);
								var cp = "";
								if(tp==0){
									cp = "初";
								}
								var oh_j = oh - parseFloat(r.eq(i + 1).attr("oh"));
								var od_j = od - parseFloat(r.eq(i + 1).attr("od"));
								var oa_j = oa - parseFloat(r.eq(i + 1).attr("oa"));
								
								if (oh_j > 0) {
									oh = "<em style='color：red'>" + oh + "</em>";
								} else if (oh_j < 0) {
									oh = "<em style='color:green'>" + oh + "</em>";
								}
								if (od_j > 0) {
									od = "<em style='color:red'>" + od + "</em>";
								} else if (od_j < 0) {
									od = "<em style='color:green'>" + od + "</em>";
								}
								if (oa_j > 0) {
									oa = "<em style='color:red'>" + oa + "</em>";
								} else if (oa_j < 0) {
									oa = "<em style='color:green'>" + oa + "</em>";
								}
								
								
								
								
								oddslist +="<tr>";
								oddslist +="<td >" + mydate.format("MM-DD hh:mm") + cp + "</td>";
								oddslist +="<td >" + oh + "</td>";
								oddslist +="<td >" + od + "</td>";
								oddslist +="<td >" + oa + "</td>";
								oddslist +="</tr>";

							}
								if(oddslist==""){
									oddslist = "<div style=\"text-align:center; color:#CCCCCC;\">暂无数据</div>";
								}
								$("#oddslist").html(oddslist);
						},
						error : function() {
							return false;
						}
					});
				}
            },
            300);
        },
        function() {
            clearTimeout(delayTime[index]);
            $(config.tip).remove();
        });
    });
}


