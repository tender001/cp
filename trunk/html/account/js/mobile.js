/**
 * 手机绑定
 */

Class({
	ready: true,
    index:function (config){
        P =this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
		location="/";
	}
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var mobbind = r.mobbind;				
					var mobile =r.mobile;
					if(mobbind==1){
						$("#div1").hide();
						$("#div3").show();
					}else{
						$("#div3").hide();
						$("#div1").show();
						
					}
					
					$("#phoneend").html(mobile);
					
					P.btnbind();
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}			
			},
			error : function() {
				Y.alert("您所请求的页面有异常,请重新刷新！");
				return false;
			}
		});
	}
	
	,btnbind:function(){
		P = this;
		/**
		 * 第一次绑定按钮绑定提交事件
		 */
   	 	this.get('#conform_btn').click(function (){
			if ($.trim($("#Phone").val())==""){
				Y.alert("请输入您的手机号码");
				return false;
			}
			
			$("#phoneNumber").val($.trim($("#Phone").val()));
			
			var data ="flag=1&newValue=" + $.trim($("#Phone").val())+ "&rnd=" + Math.random();
								
			Y.ajax({
				url : $_user.url.bind,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {	
						$("#sendphone").html($.trim($("#phoneNumber").val()));
						P.sentYZM(2);
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
							$("#div3").show();
							$("#div4").hide();
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});			
   	 	});
   	 	
   	 	this.get('#again').click(function (){
			$("#again").attr("disabled", true);
			if ($.trim($("#phoneNumber").val())==""){
				P.sentYZM(1);
				$("#again").attr("disabled", false);
				return false;
			}	
			var data ="flag=1&newValue=" + $.trim($("#phoneNumber").val())+ "&rnd=" + Math.random();
			
			Y.ajax({
				url : $_user.url.bind,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {	
						Y.alert("手机验证码已重发,请注意查收");
					} else {
						$("#again").attr("disabled", false);
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					$("#again").attr("disabled", false);
					return false;
				}
			});
   	 	});
   	 	
   	 	this.get('#editphone').click(function (){
   	 		P.sentYZM(1);
   	 	});
   	 	
   	 	this.get('#conform').click(function (){
			$("#conform").attr("disabled", true);
			if ($.trim($("#YZM").val())==""){
				Y.alert("请输入您收到的验证码");
				$("#conform").attr("disabled", false);
				return false;
			}	
			var data ="flag=1&yzm=" + $.trim($("#YZM").val())+ "&rnd=" + Math.random();
			
			Y.ajax({
				url : $_user.url.bindyz,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {
						$("#phoneend").html($.trim($("#phoneNumber").val()));

					  
	 	 		    
						Y.ajax({
					 	     url:'/phpu/p.phpx?fid=u_hdssq',
					 	     end:function (data){
					 	         if (data.error) {
					 	        	Y.alert(desc);
									P.sentYZM(3);
					 	        	return false;
					 	        	
					 	         }else{
					 	       	   var obj2 = eval("(" + data.text + ")");
				 	 		   
				 	 		       if(obj2.Resp.code==0){
				 	 		    	   Y.alert('恭喜您：<br />已获取2元彩金<a class="a3" href="/account/myaccount.html" target="_blank" >点击查看</a>');
				 	 		    	
				 	 		       }else if(obj2.Resp.code==4){
				 	 		    	 Y.alert('手机已绑定<br/>新用户<a class="a3" href="/account/trueinfo.html" target="_blank" id="showClose">实名后</a>后系统赠送2元彩金');
				 	 		    	
				 	 		       }else{
				 	 		    	 Y.alert(desc);
				 	 		       }
				 	 		     $("#userphone").html($("#phoneNumber").val());
				 	 			 $("#div4").show();
			 	 		    	 $("#div2").hide();
					 	         }
					 	     }
					 	   });
					} else {
						$("#conform").attr("disabled", false);
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					$("#conform").attr("disabled", false);
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});
   	 	});
   	 	
   	 	this.get('#editbind').click(function (){
   	 		P.sentYZM(3);
   	 	});
   	 this.get('#xiugai').click(function (){
   		$("#div4").hide();
		$("#div3").show();
	 	});
   	 
   	 	this.get('#conform_b').click(function (){
			if ($.trim($("#oldPhone").val())==""){
				Y.alert("请输入您的原手机号码");
				return false;
			}
			if ($.trim($("#newPhone").val())==""){
				Y.alert("请输入您的新手机号码");
				return false;
			}
			
			if ($.trim($("#oldPhone").val())==$.trim($("#newPhone").val())){
				Y.alert("新旧手机号码不能相同，请重新输入");
				return false;
			}
			
			$("#phoneNumber").val($.trim($("#newPhone").val()));
			
			var data ="flag=1&mobileNo=" + $.trim($("#oldPhone").val())+ "&newValue=" + $.trim($("#newPhone").val())+ "&rnd=" + Math.random();
								
			Y.ajax({
				url : $_user.url.bind,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					if (code == "0") {	
						$("#sendphone").html($.trim($("#phoneNumber").val()));
						P.sentYZM(2);
					} else {
						if (code=="1"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});			
   	 	});
	}
	
	,sentYZM:function(a) {
		P = this;
		for(var i=1;i<6;i++){
			$("#div"+i).hide();
		}
		$("#div"+a).show();
		
		if(a==2){
			var wait = 30; //设置秒数(单位秒) 
			for(var i=1;i<=wait;i++) { 
			 window.setTimeout("P.sTimer("+i+")",i*1000); 
			}
		}
	}
	
	,sTimer:function(num) { 
		var wait = 30; //设置秒数(单位秒) 
		var secs = 0;
		 if(num==wait)  { 
		  $("#again").val("重新发送");
		  $("#again").attr("disabled", false);
		 }else{ 
		  secs=wait-num; 
		  $("#again").val("重新发送 "+secs);
		 } 
	}
});