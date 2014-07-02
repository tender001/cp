Class({
	ready: true,

    index:function (config){
    	
    	this.carousel();//焦点图滚动
    	this.loadView();//猜冠军赔率
    	

    },
    loadView:function(){
		var that = this;
		 $.ajax({
				url:"/cpdata/match/jcmc/gj.xml",
				type:"GET",
				dataType:"xml",
				data : {},
				success:function(xmlDoc){
				 	var n=$_base_s.getXMLNodes(xmlDoc,["match"]);
					var code=n[0].getAttribute("code");
					var desc=n[0].getAttribute("desc");
					if(code==0){
						var html_cgj = '';
					
				
						
						var items = $_base_s.getXMLNodes(xmlDoc,["row"]);
						
//						for(var i = 0;i<items.length;i++){
//							temp.push(new map(parseInt(items[i].getAttribute('mid')),items[i]));
//						}
//						temp = that.mapSort(temp);
//						if(items.length<1){
//							return 
//						}
						var ii=0;
						for(var i = 0;i<items.length;i++){
							var mid=items[i].getAttribute('mid');
							mid=((mid*1<10)?("0"+mid):mid);
							
		
				            if(mid==1||mid==2||mid==3){
				            	ii++;
				            	html_cgj +='<tr ><td><b class="cur">'+ii+'</b></td><td class="td1"><img src="/images/rteam/'+mid+'.png"  alt='+mid+'></td>';
				            	html_cgj +='<td class="td2"><a href="/worldcup/" target="_blank">'+items[i].getAttribute('teamname')+'</a></td><td class="td3">'+items[i].getAttribute('sp')+'</td></tr>';
				            	
				            }else if(mid==5||mid==6||mid==8){
				            	ii++;
				            	html_cgj +='<tr ><td><b>'+ii+'</b></td><td class="td1"><img src="/images/rteam/'+mid+'.png"  alt='+mid+'></td>';
				            	html_cgj +='<td class="td2"><a href="/worldcup/" target="_blank">'+items[i].getAttribute('teamname')+'</a></td><td class="td3">'+items[i].getAttribute('sp')+'</td></tr>';
				            }
						}
						$("[mark=sjbcgj]").html(html_cgj);
						
					
			    	}else{
			    		alert('数据获取失败！');
			    	}
		 		}
		 });
	},
    carousel:function(){
		var sWidth = $("#flash_outer").width(); 
		var len = $("#flash_num li").length; 
		var index = 0;
		var picTimer;
		
	
//		$("#focus").append(btn);
		$("#focus .btnBg").css("opacity",0.5);

		$("#flash_num li").css("opacity",0.4).mouseover(function() {
			index = $("#flash_num li").index(this);
			showPics(index);
		}).eq(0).trigger("mouseover");

		$("#focus .preNext").css("opacity",0.2).hover(function() {
			$(this).stop(true,false).animate({"opacity":"0.5"},300);
		},function() {
			$(this).stop(true,false).animate({"opacity":"0.2"},300);
		});


		$("#flash_pic").css("width",(sWidth) * (len));
		$("#flash_pic").css("position","absolute");
		$("#flash_outer").hover(function() {
			clearInterval(picTimer);
		},function() {
			picTimer = setInterval(function() {
				showPics(index);
				index++;
				if(index == len) {index = 0;}
			},3000); //自动播放的间隔
		}).trigger("mouseleave");
		function showPics(index) { 
			var nowLeft = -index*sWidth; 
			$("#flash_pic").stop(true,false).animate({"left":nowLeft},300); 
			$("#flash_num li").stop(true,false).animate({"opacity":"0.4"},300).eq(index).stop(true,false).animate({"opacity":"1"},300); 
		}
    }
   


    	
    	
});



$(function(){

	//焦点赛事切换
	$("p[markp=1]").show();
	$("div[markdiv=1]").show();
	$("p.p2 em").eq(0).addClass("cur");
	$("p.p2 em").click(function(em){
		var num=$(this).html();
		if(num>0){
			$("p[markp],div[markdiv]").hide();
			$("p.p2 em").removeClass("cur");
			$(this).addClass("cur");
			$("p[markp="+num+"],div[markdiv="+num+"]").show();
		}
	});
	
//导航经过事件
	$("#vstain").css({
		"height":0,
		"overflow":"hidden"
		});
    	$("div.vsteam").hover(function(){
    		$("#vstain").show();
    		$("#vscd").hide();
			$("#vstain").clearQueue().animate({
				height:154
				})
				$("#vstaims").animate({
					height:0
					});
		},function(){
			$("#vstain").animate({
				height:0
				});
			$("#vstaims").clearQueue().animate({
				height:60
				})
		});
	//淘汰赛小组赛事件
	$("tr.group_list td").hover(function(){
		var td=$(this).find("a");
		$("tr.group_list td a").removeClass("on");
		td.addClass("on");
		$("div.group_list_match ").hide();
		$("#"+td.html()+"").show();
	});
	
	$("div.rTabTit  a").click(function(){
		var a=$(this).attr("id");
		$(this).addClass("on").siblings().removeClass("on");
		$("div.rTabCon").hide();
		$("#"+a+"div").show();
		
		
	})
	
	$("tr.final_list td").hover(function(){
		var td=$(this).find("a");
		$("tr.final_list td a").removeClass("on");
		td.addClass("on");
		$("div.final_list_match ").hide();
		$("div[mark='"+td.attr("mark")+"']").show();
	});
});







//倒计时
setTimeout("count_down()",1000);//设置每一秒调用一次倒计时函数

//var time_span = document.getElementById("LiveClock1");

var time_end = new Date("2014/6/13 4:00:00");  // 设定活动结束结束时间
time_end = time_end.getTime();
 
//定义倒计时函数
function count_down(){ 
   var time_now = new Date();  // 获取当前时间
   time_now = time_now.getTime();
   var time_distance = time_end - time_now;  // 时间差：活动结束时间减去当前时间   
   var int_day, int_hour, int_minute, int_second;   
   if(time_distance >= 0){   
	  int_day = Math.floor(time_distance/86400000)
	  time_distance -= int_day * 86400000; 
   
	  int_hour = Math.floor(time_distance/3600000) 
	  time_distance -= int_hour * 3600000;  
	 
	  int_minute = Math.floor(time_distance/60000)    
	  time_distance -= int_minute * 60000; 
   
   
	  if(int_hour < 10) 
	  int_hour = "0" + int_hour;  
	  if(int_day < 10) 
		  int_day = "0" + int_day;  
	  if(int_minute < 10)    
	  int_minute = "0" + int_minute;  
        
   
	  // 显示倒计时效果       
	 
	  document.getElementById("LiveClock1").innerHTML ='<span><b>'+int_day+'</b></span><span><b>'+int_hour+'</b></span><span><b>'+int_minute+'</b></span>';
	  setTimeout("count_down()",1000);
	}else{
		
	  $(".djs_title").html("活动进行时")
	}
}


//slider滚动块

	
//世界杯赛程slide切换





