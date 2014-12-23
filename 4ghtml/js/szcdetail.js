var lotid = location.search.getParam('gid');
function resultdetail2(gid,pid){
	var pid = "";
	var gid = "";
	
	if(pid&&pid){
		
	}else{
		gid = lotid;
		pid = location.search.getParam('pid');
	}
	var pid1 = location.search.getParam('pid1');
//	alert(pid1);
//	alert(gid+""+pid);
	$("#history").removeClass("cur");
	
	$("#new").addClass("cur");
	
	$.ajax({
		url : "/cpdata/guoguan/" + gid + "/"+ pid +"/"+ pid + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		success : function(d) {
//			var obj = eval("(" + d.text + ")");
			var rs = d.rows;
			var gid = rs.gid;
			var pid = rs.pid;
			var code = rs.code;// 开奖号码
			var gsale = rs.gsale;// 全国销售
			var ginfo = rs.ginfo+"";// 开奖公告
			var ninfo = rs.ninfo+"";// 中奖注数
			var gpool = rs.gpool+"";// 奖池
			var etime = rs.etime;// 兑奖截止时间
			var atime = rs.atime;// //开奖时间		
			var atime1 = atime.substring('0','10');
			var ginfo1 = ginfo.split(',');
			var ninfo1 = ninfo.split(',');

			var selhtml = "";
			var tbhtml = "";
			var detailshtml = "";
			if(gid == "01"){
				$("#type1").html("双色球开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>'+' <cite class="blueBall">'+code[1].split(',').join('</cite><b class="blueBall">')+'</cite>'
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>一等奖</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>二等奖</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>三等奖</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
				tbhtml+="<li><em>四等奖</em><cite>"+ninfo1[3]+"</cite><span>"+ginfo1[3]+"</span></li>";
				tbhtml+="<li><em>五等奖</em><cite>"+ninfo1[4]+"</cite><span>"+ginfo1[4]+"</span></li>";
				tbhtml+="<li><em>六等奖</em><cite>"+ninfo1[5]+"</cite><span>"+ginfo1[5]+"</span></li>";
			
				
				
			}
			if(gid == "07"){
				$("#type1").html("七乐彩开奖");
			
				
				var code1 = code.split('|');
				var cred = code1[0].split(',').join(' ');
				var bred = code1[1].split(',').join(' ');
				
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>'+' <cite class="blueBall">'+code[1].split(',').join('</cite><b class="blueBall">')+'</b>'
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>一等奖</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>二等奖</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>三等奖</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
				tbhtml+="<li><em>四等奖</em><cite>"+ninfo1[3]+"</cite><span>"+ginfo1[3]+"</span></li>";
				tbhtml+="<li><em>五等奖</em><cite>"+ninfo1[4]+"</cite><span>"+ginfo1[4]+"</span></li>";
				tbhtml+="<li><em>六等奖</em><cite>"+ninfo1[5]+"</cite><span>"+ginfo1[5]+"</span></li>";
				tbhtml+="<li><em>七等奖</em><cite>"+ninfo1[6]+"</cite><span>"+ginfo1[6]+"</span></li>";
				
			}
			if(gid == "03"){
				$("#type1").html("福彩3D开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>';
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>直选</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>组三</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>组六</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
				
				
				
				
				
			
			}
			if(gid == "80"){
				$("#type1").html("足彩14场开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>';
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				if(ninfo1[0] == ""){
					tbhtml+="<li><em>一等奖</em><cite>-</cite><span>-</span></li>";
				}else{
					tbhtml+="<li><em>一等奖</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				}
				if(ninfo1[1] == ""){
					tbhtml+="<li><em>二等奖</em><cite>-</cite><span>-</span></li>";
				}else{
					tbhtml+="<li><em>二等奖</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				}
				
				
						
					
						
						$.ajax({
							url : "/cpdata/guoguan/" + 81 + "/"+ pid +"/"+ pid + ".json",
							type : "GET",
							dataType : "json",
							cache : false,
							success : function(d) {
//								var obj = eval("(" + d.text + ")");
								var rs = d.rows;
								var gid = rs.gid;
								var pid = rs.pid;
								var code = rs.code;// 开奖号码
								var gsale = rs.gsale;// 全国销售
								var ginfo = rs.ginfo+"";// 开奖公告
								var ninfo = rs.ninfo+"";// 中奖注数
								var gpool = rs.gpool+"";// 奖池
								var etime = rs.etime;// 兑奖截止时间
								var atime = rs.atime;// //开奖时间		
								var atime1 = atime.substring('0','10');
								var ginfo1 = ginfo.split(',');
								var ninfo1 = ninfo.split(',');
								
								
								detailshtml+="<p>任九销量"+gsale+"元</p> "
								if(ninfo==""){
									tbhtml+="<li><em>任九</em><cite>-</cite><span>-</span></li>";
								}else{
									tbhtml+="<li><em>任九</em><cite>"+ninfo+"</cite><span>"+ginfo+"</span></li>";
								}
								
								
								
							},
							error:function(){
						      	  showTips('网络异常！');
							}
						});
						
			}
			if(gid == "83"){}
			if(gid == "82"){}
			if(gid == "50"){
				$("#type1").html("超级大乐透开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>'+' <cite class="blueBall">'+code[1].split(',').join('</cite><cite class="blueBall">')+'</cite>'
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>一等奖</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>二等奖</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>三等奖</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
				tbhtml+="<li><em>四等奖</em><cite>"+ninfo1[3]+"</cite><span>"+ginfo1[3]+"</span></li>";
				tbhtml+="<li><em>五等奖</em><cite>"+ninfo1[4]+"</cite><span>"+ginfo1[4]+"</span></li>";
				tbhtml+="<li><em>六等奖</em><cite>"+ninfo1[5]+"</cite><span>"+ginfo1[5]+"</span></li>";
				tbhtml+="<li><em>追加一等奖</em><cite>"+ninfo1[7]+"</cite><span>"+ginfo1[7]+"</span></li>";
				tbhtml+="<li><em>追加二等奖</em><cite>"+ninfo1[8]+"</cite><span>"+ginfo1[8]+"</span></li>";
				tbhtml+="<li><em>追加三等奖</em><cite>"+ninfo1[9]+"</cite><span>"+ginfo1[9]+"</span></li>";
				tbhtml+="<li><em>追加四等奖</em><cite>"+ninfo1[10]+"</cite><span>"+ginfo1[10]+"</span></li>";
				tbhtml+="<li><em>追加五等奖</em><cite>"+ninfo1[11]+"</cite><span>"+ginfo1[11]+"</span></li>";
			
				
				
				
				
				
				
			
			}
			if(gid == "51"){
				$("#type1").html("七星彩开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>';
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>一等奖</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>二等奖</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>三等奖</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
				tbhtml+="<li><em>四等奖</em><cite>"+ninfo1[3]+"</cite><span>"+ginfo1[3]+"</span></li>";
				tbhtml+="<li><em>五等奖</em><cite>"+ninfo1[4]+"</cite><span>"+ginfo1[4]+"</span></li>";
				tbhtml+="<li><em>六等奖</em><cite>"+ninfo1[5]+"</cite><span>"+ginfo1[5]+"</span></li>";
				
				
			}
			if(gid == "53"){
				$("#type1").html("排列三开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>';
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>直选</em><cite>"+ninfo1[0]+"</cite><span>"+ginfo1[0]+"</span></li>";
				tbhtml+="<li><em>组三</em><cite>"+ninfo1[1]+"</cite><span>"+ginfo1[1]+"</span></li>";
				tbhtml+="<li><em>组六</em><cite>"+ninfo1[2]+"</cite><span>"+ginfo1[2]+"</span></li>";
			}
			if(gid == "52"){
				$("#type1").html("排列五开奖");
				code = code.split('|');
				code ='<cite>'+code[0].split(',').join('</cite><cite>')+'</cite>';
				selhtml+="<span class=\"zx-kj-tit\" >第"+pid+"期</span><cite class=\"gray pdLeft04\">"+atime1+"</cite></p>";
				selhtml+="<div class=\"kjBall pdLeft04\">"+code+"</div>";
		            
				
				detailshtml+="<p>本期销量"+gsale+"元</p> <p>奖池滚存：<cite class=\"yellow\">"+gpool+"元</cite></p>"
	           
			
				tbhtml+=" <li class=\"gray\"><em>奖项</em><cite>注数</cite><span>每注金额</span></li>";
				tbhtml+="<li><em>直选</em><cite>"+ninfo1+"</cite><span>"+ginfo+"</span></li>";
				
				
			}
			$("#sel").html(selhtml);
			$("#details").html(detailshtml);
			$("#tbody").html(tbhtml);
			$("#newinfo").show();
			$("#adiv").hide();
			
		},
		error:function(){
      	  showTips('网络异常！');
		}
		
	});
	$("#payment").attr("href", "" + $_sys.getlotname(lotid,4) + "");
	$(".jc-more a").eq(0).attr("href", "" + $_sys.getlotname(lotid,4) + "");
	
	$(".jc-more a").eq(1).attr("href", "/hemai/index.html?lotid="+lotid);
	var helpurl=$_sys.getlotname(lotid,4).replaceAll("\/","");
	$(".jc-more a").eq(3).attr("href", "/help/"+helpurl+"help.html");
	$(".jc-more").click(function() {
	    $(this).children().toggle();
	    
	});
}

function historydetail2(){
	$("#new").removeClass("cur");
	$("#history").addClass("cur");
	var gid=lotid;

	if(gid === undefined || gid ==""){
		
		return;
	}		
	var gname = $_sys.getlotname(gid);
		


		$.ajax({
			url:"/cpdata/game/"+gid+"/c.json?r="+Math.random(),
//			http://yws.159cai.com/tdata/01/last_10.xml?rnd=0.42683512486793673&_=1419075187067
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
				
						var ett = atime.substring("0","10");
						if(acode !=""){
							if(gid == "01"||gid == "07"||gid == "50"){
								
								var code='<b>'+newacode[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+newacode[1].split(',').join('</b><b class="blue">')+'</b>';
								html+='<a href="javascript:resultdetail2('+gid+','+_pid+')">';
								html+="<div class=\"clearfix lskjTit\">第"+_pid+"期&nbsp;"+ett+"</div>";
								html+="<div class=\"kjNum\">"+code+"</div> <i class=\"rightArrow\"></i></a>";
								
								
//									
					            
					       
							}else {
								var code='<b>'+newacode[0].split(',').join('</b><b>')+'</b>';
								html+='<a href="javascript:resultdetail2('+gid+','+_pid+')">';
								html+="<div class=\"clearfix lskjTit\">第"+_pid+"期&nbsp;"+ett+"</div>";
								html+="<div class=\"kjNum\">"+code+"</div> <i class=\"rightArrow\"></i></a>";
							}
							
						}
							
					});
					$("#diva").html(html).show();
					$("#newinfo").hide();
			
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