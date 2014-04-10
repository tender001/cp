function resultdetail2(){
	var gid = location.search.getParam('gid');
	var pid = location.search.getParam('pid');
	var pid1 = location.search.getParam('pid1');
//	alert(pid1);
//	alert(gid+""+pid);
	
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
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=01'>返回列表</option>";
				
				var code1 = code.split('|');
				var cred = code1[0].split(',').join(' ');
				var bred = code1[1].split(',').join(' ');
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+cred+"</span>&nbsp;<span style='color:blue'>"+bred+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>二等奖</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>三等奖</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
				tbhtml+="<tr><td>四等奖</td><td>"+ninfo1[3]+"</td><td>"+ginfo1[3]+"</td></tr>";
				tbhtml+="<tr><td>五等奖</td><td>"+ninfo1[4]+"</td><td>"+ginfo1[4]+"</td></tr>";
				tbhtml+="<tr><td>六等奖</td><td>"+ninfo1[5]+"</td><td>"+ginfo1[5]+"</td></tr>";
				
			}
			if(gid == "07"){
				$("#type1").html("七乐彩开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=01&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=01'>返回列表</option>";
				
				var code1 = code.split('|');
				var cred = code1[0].split(',').join(' ');
				var bred = code1[1].split(',').join(' ');
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+cred+"</span>&nbsp;<span style='color:blue'>"+bred+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>二等奖</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>三等奖</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
				tbhtml+="<tr><td>四等奖</td><td>"+ninfo1[3]+"</td><td>"+ginfo1[3]+"</td></tr>";
				tbhtml+="<tr><td>五等奖</td><td>"+ninfo1[4]+"</td><td>"+ginfo1[4]+"</td></tr>";
				tbhtml+="<tr><td>六等奖</td><td>"+ninfo1[5]+"</td><td>"+ginfo1[5]+"</td></tr>";
				tbhtml+="<tr><td>七等奖</td><td>"+ninfo1[6]+"</td><td>"+ginfo1[6]+"</td></tr>";
				
			}
			if(gid == "03"){
				$("#type1").html("福彩3D开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=03&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=03&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=03&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=03&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=03'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>直选</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>组三</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>组六</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
			
			}
			if(gid == "80"){
				$("#type1").html("足彩14场开奖");
						selhtml+="<option>"+pid+"</option>";
						selhtml+="<option value='/info/szcdetail.html?gid=80&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
						selhtml+="<option value='/info/szcdetail.html?gid=80&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
						selhtml+="<option value='/info/szcdetail.html?gid=80&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
						selhtml+="<option value='/info/szcdetail.html?gid=80&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
						selhtml+="<option value='/info/zc.html?gid=80'>返回列表</option>";
						
						detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
						detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
						detailshtml+="日期："+atime1+"<br />";
						detailshtml+="销量：￥"+gsale+".00元<br />";
						detailshtml+="奖池：￥"+gpool+".00元<br />";
						
						if(ninfo1[0] == ""){
							tbhtml+="<tr><td>一等奖</td><td>--</td><td>--</td></tr>";
						}else{
							tbhtml+="<tr><td>一等奖</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
						}
						if(ninfo1[1]==""){
							tbhtml+="<tr><td>二等奖</td><td>--</td><td>--</td></tr>";
						}else{
							tbhtml+="<tr><td>二等奖</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
						}
						
						
						var de = "";
						var tb = "";
						
						$.ajax({
							url : "/data/guoguan/81/"+pid+"/"+pid+".xml?_=" + Math.random(),
							dataType:"xml",
							success:function (data){
								var H = $(data).find("rows");
								var gsale2 = H.attr("gsale");
								var ginfo2 = H.attr("ginfo");
								var ninfo2 = H.attr("ninfo");
								
								de+="任九销量：￥"+gsale2+".00元<br />";
								if(ninfo2==""){
									tb+="<tr><td>任九场</td><td>--</td><td>--</td></tr>";
								}else{
									tb+="<tr><td>任九场</td><td>"+ninfo2+"</td><td>"+ginfo2+"</td></tr>";
								}
								
								
								$("#details2").html(de);
								$("#tbody2").html(tb);
							},
							error:function(){
						      	  showTips('网络异常！');
							}
						});
						
			}
			if(gid == "83"){
				$("#type1").html("足彩半全场开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=83&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=83&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=83&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=83&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/zc.html?gid=83'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				if(ginfo == "0"){
					tbhtml+="<tr><td>一等奖</td><td>"+ninfo+"</td><td>无人中奖</td></tr>";
				}else{
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo+"</td><td>"+ginfo+"</td></tr>";
				}
			}
			if(gid == "82"){
				$("#type1").html("足彩进球彩开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=82&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=82&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=82&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=82&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/zc.html?gid=82'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				if(ginfo == "0"){
					tbhtml+="<tr><td>一等奖</td><td>"+ninfo+"</td><td>无人中奖</td></tr>";
				}else{
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo+"</td><td>"+ginfo+"</td></tr>";
				}
			}
			if(gid == "50"){
				$("#type1").html("超级大乐透开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=50&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=50&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=50&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=50&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=50'>返回列表</option>";
				
				var code1 = code.split('|');
				var cred = code1[0].split(',').join(' ');
				var bred = code1[1].split(',').join(' ');
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+cred+"</span>&nbsp;<span style='color:blue'>"+bred+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>二等奖</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>三等奖</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
				tbhtml+="<tr><td>四等奖</td><td>"+ninfo1[3]+"</td><td>"+ginfo1[3]+"</td></tr>";
				tbhtml+="<tr><td>五等奖</td><td>"+ninfo1[4]+"</td><td>"+ginfo1[4]+"</td></tr>";
				tbhtml+="<tr><td>六等奖</td><td>"+ninfo1[5]+"</td><td>"+ginfo1[5]+"</td></tr>";
				tbhtml+="<tr><td>七等奖</td><td>"+ninfo1[6]+"</td><td>"+ginfo1[6]+"</td></tr>";
				tbhtml+="<tr><td>八等奖</td><td>"+ninfo1[7]+"</td><td>"+ginfo1[7]+"</td></tr>";
				tbhtml+="<tr><td>生肖乐</td><td>"+ninfo1[8]+"</td><td>"+ginfo1[8]+"</td></tr>";
				tbhtml+="<tr><td>追加一等奖</td><td>"+ninfo1[9]+"</td><td>"+ginfo1[9]+"</td></tr>";
				tbhtml+="<tr><td>追加二等奖</td><td>"+ninfo1[10]+"</td><td>"+ginfo1[10]+"</td></tr>";
				tbhtml+="<tr><td>追加三等奖</td><td>"+ninfo1[11]+"</td><td>"+ginfo1[11]+"</td></tr>";
				tbhtml+="<tr><td>追加四等奖</td><td>"+ninfo1[12]+"</td><td>"+ginfo1[12]+"</td></tr>";
				tbhtml+="<tr><td>追加五等奖</td><td>"+ninfo1[13]+"</td><td>"+ginfo1[13]+"</td></tr>";
				tbhtml+="<tr><td>追加六等奖</td><td>"+ninfo1[14]+"</td><td>"+ginfo1[14]+"</td></tr>";
				tbhtml+="<tr><td>追加七等奖</td><td>"+ninfo1[15]+"</td><td>"+ginfo1[15]+"</td></tr>";
			}
			if(gid == "51"){
				$("#type1").html("七星彩开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=51&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=51&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=51&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=51&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=51'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>一等奖</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>二等奖</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>三等奖</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
				tbhtml+="<tr><td>四等奖</td><td>"+ninfo1[3]+"</td><td>"+ginfo1[3]+"</td></tr>";
				tbhtml+="<tr><td>五等奖</td><td>"+ninfo1[4]+"</td><td>"+ginfo1[4]+"</td></tr>";
				tbhtml+="<tr><td>六等奖</td><td>"+ninfo1[5]+"</td><td>"+ginfo1[5]+"</td></tr>";
			}
			if(gid == "53"){
				$("#type1").html("排列三开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=53&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=53&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=53&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=53&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=53'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>排列三直选</td><td>"+ninfo1[0]+"</td><td>"+ginfo1[0]+"</td></tr>";
				tbhtml+="<tr><td>排列三组三</td><td>"+ninfo1[1]+"</td><td>"+ginfo1[1]+"</td></tr>";
				tbhtml+="<tr><td>排列三组六</td><td>"+ninfo1[2]+"</td><td>"+ginfo1[2]+"</td></tr>";
			}
			if(gid == "52"){
				$("#type1").html("排列五开奖");
				selhtml+="<option>"+pid+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=52&pid="+(pid-1)+"'>"+(pid-1)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=52&pid="+(pid-2)+"'>"+(pid-2)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=52&pid="+(pid-3)+"'>"+(pid-3)+"</option>";
				selhtml+="<option value='/info/szcdetail.html?gid=52&pid="+(pid-4)+"'>"+(pid-4)+"</option>";
				selhtml+="<option value='/info/szc.html?gid=52'>返回列表</option>";
				
				detailshtml+="期号：<span style='color:Blue'>"+pid+"</span><br />";
				detailshtml+="号码：<span style='color:Red'>"+code.split(',').join(' ')+"</span><br />";
				detailshtml+="日期："+atime1+"<br />";
				detailshtml+="销量：￥"+gsale+".00元<br />";
				detailshtml+="奖池：￥"+gpool+".00元<br />";
				
				tbhtml+="<tr><td>排列五直选</td><td>"+ninfo+"</td><td>"+ginfo+"</td></tr>";
			}
			$("#sel").html(selhtml);
			$("#details").html(detailshtml);
			$("#tbody").html(tbhtml);
		},
		error:function(){
      	  showTips('网络异常！');
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