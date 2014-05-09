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
			   }else{}
 		    	 
 		      

         }
     }
   });
 });
 

})