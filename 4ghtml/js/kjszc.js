function resultdetail(){
		var gid = location.search.getParam('gid');
	
		if(gid === undefined || gid ==""){
			showTips('参数异常!');
			return;
		}		
		var gname = $_sys.getlotname(gid);
			document.title = gname + document.title;
			$("#type1").html(gname+"开奖");
//			if(gid==80){
//				$("em#em").html("胜负彩开奖");
//			}else if(gid==81){
//				$("em#em").html("任九开奖");
//			}else if(gid==82){
//				$("em#em").html("进球彩开奖");
//			}else if(gid==83){
//				$("em#em").html("半全场开奖");
//			}
			$.ajax({
				url:"/cpdata/game/"+gid+"/c.json?r="+Math.random(),
//				http://www.159cai.com/cpdata/game/54/s.json?rnd=0.20174545116204878
//				http://www.159cai.com/cpdata/guoguan/83/index.json
				type : "get",
				dataType : "json",
				success : function(d) {
				
				
						var rs = d.period.row;
						var html = [];
						if(!isArray(rs)){rs = new Array(rs);}
						$.each(rs,function(o,r) {
							var _pid = r.pid;
							var acode =r.opencode;
							var atime =r.et;
							var newacode = acode.split('|');
					
							var ett = atime.substring("0","16");
							if(acode !=""){
								if(gid == "01"||gid == "07"||gid == "50"){
									var codered = newacode[0].split(',').join(' ');
									var codeblue = newacode[1];
									html+="<a href=\'/info/szcdetail.html?gid="+gid+"&pid="+_pid+"\'><table class=list border=0 cellSpacing=0 cellPadding=0><tr>";
									html+="<td>第<span style=\'color:red\'>"+_pid+"</span>期<span style=\'font-size:12px;\'>("+ett+")</span><br><span style=\'color:Red\'>"+codered+"</span>&nbsp;<span style=\'color:blue\'>"+codeblue+"</span></td>";
									html+="<td class=\'arrow\'><img src=\'/images/arrow.gif\' /></td>";
									html+="</tr></table></a>";
								}else if(gid == "03"||gid == "51"||gid == "52"||gid == "53"){
									html+="<a href=\'/info/szcdetail.html?gid="+gid+"&pid="+_pid+"\'><table class=list border=0 cellSpacing=0 cellPadding=0><tr>";
									html+="<td>第<span style=\'color:red\'>"+_pid+"</span>期<span style=\'font-size:12px;\'>("+ett+")</span><br><span style=\'color:Red\'>"+acode.split(',').join(' ');+"</span></td>";
									html+="<td class=\'arrow\'><img src=\'/images/arrow.gif\' /></td>";
									html+="</tr></table></a>";
								}else{
									html+="<table class=list border=0 cellSpacing=0 cellPadding=0><tr>";
									html+="<td>第<span style=\'color:#3366cc\'>"+_pid+"</span>期<span style=\'font-size:12px;\'>("+ett+")</span><br><span style=\'color:Red\'>"+acode.split(',').join(' ');+"</span></td>";
									html+="</tr></table>";
								}
								
							}
								
						});
						$("#diva").html(html);
						
				
				},
				error:function(){
					showTips('网络异常!');
		        }
			});
			

			
			

}


var tipsDiv_01 = "";
function showTips(tips) {
	tipsDiv_01 = '<div class="tipsClass" id="tipsDiv_">' + tips + '</div>';
	$('body').append(tipsDiv_01);
	
  $('div.tipsClass').css({
      'top': ($(window).height() / 2 + $(window).scrollTop()) + 'px',
      'left': ($(window).width() - 245) / 2 + "px",
      'border': '2px solid #E6D30A',
      'position': 'absolute',
      'padding': '5px',
      'background': '#FFF588',
      'font-size': '12px',
      'margin': '0 auto',
      'line-height': '25px',
      'z-index': '100',
      'text-align': 'center',
      'width': '250px',
      'color': '#6D270A',
      'opacity': '0.95'
  });
  setTimeout(function(){
  	$('div.tipsClass').hide();
  },2000);
	$('div.tipsClass').click(function(){$(this).hide()});
}