$(function() {  
	window.onload=function(){
//		var Y;
//		Y = this;
//		alertInfo=$("#alertInfo").html('');
//		$("#alertInfo").html('未绑定手机，不能领取<br /><em>谢谢您的支持！</em>');
//		Y.alert("本活动已结束，敬请关注本网站其他活动");
	};
$("#chongzhi").click(function(){
     	
     	Y.ajax({
         url:Class.C('url-login-user')+"&rnd=" + Math.random(),
         end:function (data){
             var info, showText, Y;
             Y = this;
             if (data.error) {
                 this.setUserInfo('拉取用户信息失败, 请刷新重试!')
             }else{
           	   var obj = eval("(" + data.text + ")");
     		       var code = obj.Resp.code;
     			   var r = obj.Resp.row;
     				
     			  location.href =(code=="0"?'/account/chongzhi.html':'/user/login.html?backurl=chongzhi')
             }
         }
       });
     })
     $("#register").click(function(){
     	
     	Y.ajax({
         url:Class.C('url-login-user')+"&rnd=" + Math.random(),
         end:function (data){
             var info, showText, Y;
             Y = this;
             if (data.error) {
                 this.setUserInfo('拉取用户信息失败, 请刷新重试!')
             }else{
           	   var obj = eval("(" + data.text + ")");
     		       var code = obj.Resp.code;
     			   var r = obj.Resp.row;
     				
     			  location.href =(code=="0"?'/account/safecenter.html':'/user/reg.html')
             }
         }
       });
     });

$("#getcp,#getcp2").click(function(){
 	
 	Y.ajax({
     url:'/phpu/p.phpx?fid=u_hdssq',
     end:function (data){
         if (data.error) {
             this.setUserInfo('拉取用户信息失败, 请刷新重试!');
         }else{
       	   var obj = eval("(" + data.text + ")");
 		       var code = obj.Resp.code;
			   var desc = obj.Resp.desc;
 		       if(code == 1){
			    location.href ='/user/login.html?backurl=sssq';
			   }else{
				var bw = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement : document.body;
				var d_left = ($(window).width()-$("#alertdiv").css("width").replace("px",""))/2;
				var d_top = 100;
				$("#alertdiv").css("top", d_top + bw.scrollTop + "px");
				$("#alertdiv").css("left", d_left + "px");
				$('.yclass_mask_panel').show();
				if(code == 0){
				$("#alertInfo").html('恭喜您：<br />获取3元彩金<a class="a3" href="/account/orderlist.html" target="_blank" id="showClose">点击查看</a>');
				$("#alertok,#showClose").click(function(){
					$('#alertdiv').hide();
					$('.yclass_mask_panel').hide();
				  });
				}else if(code == 2){
				$("#alertInfo").html('未绑定手机，不能领取<br /><em>谢谢您的支持！</em>');
					$("#alertok").click(function(){
					$('#alertdiv').hide();
					$('.yclass_mask_panel').hide();
					location.href ='/account/safecenter.html?backurl=sssq';
				  
				  });
				}else if(code == 3 || code == 5){
				$("#alertInfo").html('本活动仅限新注册用户<br/><em>谢谢您的支持！</em>');
				  $("#alertok").click(function(){
					$('#alertdiv').hide();
					$('.yclass_mask_panel').hide();
				  });
				}else if(code == 4){
				$("#alertInfo").html('系统已赠送过2元彩金<br /><em>不能重复领取！</em>');
				    $("#alertok").click(function(){
					$('#alertdiv').hide();
					$('.yclass_mask_panel').hide();
//					location.href ='/account/safecenter.html?backurl=sssq';
				  
				  });
				}
				
				$("#alertdiv").show();
				setTimeout(function(){$("#alertdiv").hide();$('.yclass_mask_panel').hide();}, 10*1000);
			  
			   }
 		    	 
 		      

         }
     }
   });
 });

 

})
//倒计时
setTimeout("count_down()",1000);//设置每一秒调用一次倒计时函数

//var time_span = document.getElementById("LiveClock1");

var time_end = new Date("2014/7/13 4:00:00");  // 设定活动结束结束时间
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
	 
	  document.getElementById("LiveClock1").innerHTML ='<b>'+int_day+'</b>';
	  setTimeout("count_down()",1000*60*60);
	}else{
	 
	  $(".djs_title").html("活动进行时")
	}
}