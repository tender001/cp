$(document).ready(function(){
   		Y.ajax({
	       url:Class.C("url-login-user")+"&rnd=" + Math.random(),
	       end:function (data){
	           var Y;
	           Y = this;
	           if (data.error) {
	         	  return false;
	           }else{
					   var obj = eval("(" + data.text + ")");
	        		   var code = obj.Resp.code;
	        		 
						   if (code=="0"){
							     var u = obj.Resp.row;
								   this.get("#acc_userinfo").html(u.nickid);
								   $("#sjandscc").show();
   	 	  						   $("#sjand").hide();
								  
								  
						   }else{
							  	$("#sjandscc").hide();
   								$("#sjand").show();
						   }      
	           }
	       }
	});
	});
loginout = function (fn){ 
	
	Y.ajax({
    url: Class.C('url-login-out'),
    end:function (data){
        var Y;
        Y = this;
        if (data.error) {
      	  return false;
        }else{
				   var obj = eval("(" + data.text + ")");
     		   var code = obj.Resp.code;
					   if (code=="-1"){
						     var u = obj.Resp.row;
							   this.get("#acc_userinfo").html("");
								$("#sjandscc").hide();
								$("#sjand").show();
					   }else{
						  
							 $("#sjandscc").show();
	  						   $("#sjand").hide();
					   }      
        	}
    	}
	}); 
};
