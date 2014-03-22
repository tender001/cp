$(function() {  
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
				$("#alertInfo").html('未实名认证，不能领取<br /><em>谢谢您的支持！</em>');
				    $("#alertok").click(function(){
					$('#alertdiv').hide();
					$('.yclass_mask_panel').hide();
					location.href ='/account/safecenter.html?backurl=sssq';
				  
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