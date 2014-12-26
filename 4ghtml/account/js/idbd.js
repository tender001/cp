	
//首先检查有没有绑定姓名和身份证
function showinfo(){
		$.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			success : function(xml) {
				var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
				if (code == "0") {	
					var r= R.row;
					var rname = r.rname;
					var idcard = r.idcard;
					if(rname == ""){
						$("#div1").show();
						$("#div2").hide();
						$("#div3").hide();
					}else {
						$("#div1").hide();
						$("#div2").show();
						$("#div3").hide();
						$("#idcard").html(idcard);
						$("#idname").html(rname);
						
					}
				}else if(code == "1"){
					$("#div1").hide();
					$("#div2").hide();
					$("#div3").show();
				}
				
			},
			error : function() {
				alert("网络异常！");
			}
		});
	}


function setdata(){
//	alert("网络ds！");
	var reg=/^[\u4e00-\u9fa5]{2,5}$/i; 
	var isCrad2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/i; 
	var isCrad=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/i;
	var truename=$.trim($("#truename").val());
	var idnumber =$.trim($("#idnumber").val());
	var idnumber2 =$.trim($("#idnumber2").val());
	if (truename==""){
		showTips('请输入您的真实姓名');
		return false;
	}
	if(!reg.test(truename)){
		showTips('姓名必须为2到5个汉字');
		return false;
	}
	var namelen=truename.length;
	var len=0;
	for(var i=0;i<namelen; i++){
		len +=truename.split(truename[i]).length;
	}
	if(len>namelen*3){
		showTips('请输入您的真实姓名');
		return false;
	}
	if ($.trim($("#idnumber").val())==""){
		showTips('请输入你的身份证号码');
		return false;
	}
		if (!(isCrad.test(idnumber))&&!(isCrad2.test(idnumber)))
	   {  
			showTips('请输入正确的身份证号码');  
	       return  false;  
	   }  
		if(!isCardID(idnumber)){
			showTips('请输入正确的身份证号码');  
		       return  false;  
		}
		if (idnumber2!=idnumber)
		   {  
				showTips('两次输入身份证号码不一致');  
		       return  false;  
		   }  
		
		$.ajax({
			url : $_user.modify.name,
			type : "POST",
			dataType : "json",
			data : $_user.key.realName + "=" + encodeURIComponent($.trim($("#truename").val()))
			+ "&" + $_user.key.idCardNo + "=" + encodeURIComponent($.trim($("#idnumber").val()))
			+ "&" + $_user.key.upwd + "=" + encodeURIComponent($.trim($("#password").val()))
			+ "&rnd=" + Math.random(),
			success : function(xml) {
				var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
				
				if (code == "0") {
					var result = "idcard"
	  					location.href = "/account/showresult.html?result=" + result +"&code=" + R.code;
//					成功
				} else {
					if (code=="1"){
						$.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
					showTips(desc);
					}
				}
			},
			error : function() {
				showTips('您所请求的页面有异常！');
				return false;
			}
		});
		
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
}
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