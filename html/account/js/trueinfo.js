var refreshVerify=function (){
	$("#CheckCode").attr('src',"/rand.phpx?rnd="+Math.random());
};
/**
 * 真实姓名绑定
 */
Class({
	ready: true,

    index:function (config){
    	P = this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    	this.setdata();
    	
    }
	,logoutinfo:function(){
		location="/"; 
	}
	,setdata:function(){
		P = this;
	    this.get('#submit').click(function (){
			var reg=/^[\u4e00-\u9fa5]{2,5}$/i; 
			var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/; 
			var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
			var truename=$.trim($("#truename").val());
			var idnumber =$.trim($("#idnumber").val());
			
			if (truename==""){
				Y.alert("请输入您的真实姓名");
				return false;
			}
			if(!reg.test(truename)){
				Y.alert("姓名必须为2到5个汉字");
				return false;
			}
			var namelen=truename.length;
			var len=0;
			for(var i=0;i<namelen; i++){
				len +=truename.split(truename[i]).length;
			}
			if(len>namelen*3){
				Y.alert("请输入您的真实姓名");
				return false;
			}
				if (!(isIDCard1.test(idnumber))&&!(isIDCard2.test(idnumber)))
			   {  
			       Y.alert("身份证输入不合法");  
			       return  false;  
			   } 
				if (!isCardID(idnumber))
				   {  
				       Y.alert("请输入您正确的身份证号码");  
				       return  false;  
				   } 
				
			if ($.trim($("#idnumber").val())==""){
				Y.alert("请输入你的身份证号码");
				return false;
			}
			if($.trim($("#idnumbers").val())==""){
				Y.alert("请再次输入你的身份证号码");
				return false;
			}
			if($.trim($("#idnumber").val()) != $.trim($("#idnumbers").val())){
				Y.alert("你两次输入的身份证号码不一致");
				return false;
			}
			
//			if ($.trim($("#password").val())==""){
//				Y.alert("请输入您的登录密码以确认您的身份");
//				return false;
//			}
//			if ($.trim($("#verifycode").val())==""){
//				Y.alert("请输入验证码");
//				return false;
//			}
			
			Y.ajax({
				url : $_user.modify.name,
				type : "POST",
				dataType : "json",
				data : $_user.key.realName + "=" + encodeURIComponent($.trim($("#truename").val()))
				+ "&" + $_user.key.idCardNo + "=" + encodeURIComponent($.trim($("#idnumber").val()))
				+ "&" + $_user.key.idCardTwo + "=" + encodeURIComponent($.trim($("#idnumbers").val()))
				+ "&" + $_user.key.upwd + "=" + encodeURIComponent($.trim($("#password").val()))
				+ "&yzm=" + encodeURIComponent($.trim($("#verifycode").val()))
				+ "&rnd=" + Math.random(),
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
					if (code == "0") {	
//						smrz.close();
						if( Class.C('isjyw')){
							Y.ajax({
						 	     url:'/phpu/p.phpx?fid=hd_scp',
						 	     end:function (data){
						 	         if (data.error) {
						 	        	Y.alert(desc);
						 	        	return false;
						 	         }else{
						 	       	   var obj2 = eval("(" + data.text + ")");
						 	       	var  wrapLay = Y.lib.MaskLay('#wrapLay', '#wrapLayConent');
					            	wrapLay.addClose('#wrapLayCloseBtn', '#wrapLayClose');
					                 Y.get('#yclass_alert  div.tantop').drag('#wrapLay');
					               
					 	 		       if(obj2.Resp.code==0){
					 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">恭喜您：<br />已获取3元彩金<a class="a3" href="/account/orderlist.html" target="_blank" >点击查看</a></div>');
					 	 		    	 $("#username").html($("#truename").val());
					 	 		    	 $("#usercard").html($("#idnumber").val())
					 	 		    	  wrapLay.pop();
					 	 		       }else if(obj2.Resp.code==2){
						 	 		    	 $("#wrapLayConent").html('<div class="buy_sucs">已实名<br/>新用户<a class="a3" href="/account/mobile.html" target="_blank" id="showClose">绑定手机后</a>系统赠送一注双色球</div>');
					 	 		    	 $("#username").html($("#truename").val());
					 	 		    	 $("#usercard").html($("#idnumber").val())
					 	 		    	  wrapLay.pop();
					 	 		       }else{
					 	 		    	 Y.alert(desc);
					 	 		       }

						 	         }
						 	     }
						 	   });
						}
					 	
					} else {
						if (code=="1"){
							Y.alert(desc);
							
						}else{
							Y.alert(desc);
						}
					}
					P.showinfo();
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});
        });
	}
	
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var rname = r.rname;
					var idcard = r.idcard;
					if (rname==""){
						$("#info0").show();
						$("#info2").hide();
						$("#info1").hide();
					}else{
						if($("#usercard").html()==""){
							$("#username").html(rname);
							$("#usercard").html(idcard);
						}
						
						$("#info0").hide();
						$("#info2").show();
					}				
				} else {
					if (code=="1"){
						parent.window.Y.postMsg('msg_login', function() {						
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

var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 
function isCardID(sId){ 
    var iSum=0 ;
    var info="" ;
    if(/^\d{15}$/i.test(sId))return true;
    if(!/^\d{17}(\d|x)$/i.test(sId)) return false; 
    sId=sId.replace(/x$/i,"a"); 
    if(aCity[parseInt(sId.substr(0,2))]==null) return false; 
    sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
    var d=new Date(sBirthday.replace(/-/g,"/")) ;
    if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return false; 
    for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
    if(iSum%11!=1) return false; 
    return true;//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女") 
} 

