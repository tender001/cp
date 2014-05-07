








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
		
	  if(int_minute < 10)    
	  int_minute = "0" + int_minute;  
        
   
	  // 显示倒计时效果       
	 
	  document.getElementById("LiveClock1").innerHTML ='<span><b>'+int_day+'</b></span><span><b>'+int_hour+'</b></span><span><b>'+int_minute+'</b></span>';
	  setTimeout("count_down()",1000);
	}else{
	  time_day.innerHTML = "00";
	  time_hour.innerHTML = "00"; 
	  time_minute.innerHTML = "00"; 
	  $(".djs_title").html("活动进行时")
	}
}


//slider滚动块

	
//世界杯赛程slide切换





