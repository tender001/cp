/**
 * 个人信息
 */

Class({
	ready: true,
    index:function (config){
    	P = this;
    	Y.C('logininfo',this.show);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
	    location="/";
	}
	,show:function(){
		P.showinfo();
    	P.setinfo();
    	$("#cimno").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
    	$("#ctelephone").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能输数字
    	});
	}
	,setinfo:function(){
		 p = this;
		
		 this.get('#submit').click(function (){
			 var city = $.trim($("#city").val());
			var province = $.trim($("#province").val());
				
			var cimno = ($("#cimno").val()).replace(/\s+/g,"");
			var ctelephone = ($("#ctelephone").val()).replace(/\s+/g,"");
			Y.ajax({
				url: $_user.modify.info,
				type : "POST",
				dataType : "json",
				
				data : $_user.key.gender + "=" + encodeURIComponent($.trim($("input[name='sex']:checked").val()))
				+ "&" + $_user.key.provid + "=" + encodeURIComponent(province.replace(/\-/g,""))
				+ "&" + $_user.key.cityid + "=" + encodeURIComponent(city.replace(/\-/g,""))				
				+ "&" + $_user.key.imNo + "=" + encodeURIComponent(cimno)					
				+ "&" + $_user.key.mobileNo + "=" + encodeURIComponent(ctelephone)
				+ "&rnd=" + Math.random(),	
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
			   		
				    		if (code == "0") {
								Y.alert(desc);	
							} else {
								if (code=="1"){
									Y.postMsg('msg_login', function() {						
										window.location.reload();			
									});
								}else{
									Y.alert(desc);
								}
							
				    	}
					
					p.showinfo();
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}					
			});
		});
	}

    ,showinfo:function(){
    	var P = this;
    	Y.ajax({
    		url : $_user.url.info,
    		type : "POST",
    		dataType : "json",
    		end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
    			if (code == "0") {
    				var r = obj.Resp.row;
    				var cnickid = r.nid;
    				var igender = r.sex;
    				var caddrpro = r.pro;
    				var caddrcity = r.city;
    				var cimno = r.qq;
    				var ctelephone = r.tel;
    				$("#cnickid").html(cnickid);
    				$("#sex" + igender).attr("checked", true);
    				
    				$("#province").val(caddrpro);
    				if (caddrpro!=""){
    					$("#province").change();
    				}
    				
    				$("#city").val(caddrcity);
    				$("#cimno").val(cimno);
    				$("#ctelephone").val(ctelephone);
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
    }
});
