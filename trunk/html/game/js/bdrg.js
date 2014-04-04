$(function() {
	var lotid = location.search.getParam('lotid');
	var projid = location.search.getParam('projid');
	if (lotid == "" || projid == "") {
		if (history.length == 0) {
			window.opener = "";
			window.close();
		} else {
			history.go(-1);
		}
		return false;
	}

	showinfo(lotid,projid);
});

check = function(){
	var allnumber =  Y.one('#allnumber').value;  //方案总金额
	var snumber = Y.one('#lnum').value;  //
	var limitnum = Y.one('#limitnum').value;  //方案总金额	
	var onemoney = Y.one('#onemoney').value; //每份金额
	var baodimoney = Y.one('#baodimoney').value; 
	var yumoney = parseFloat(snumber*onemoney);
	var zumoney = parseFloat(allnumber*onemoney);
	var limitmoney = parseFloat(limitnum*onemoney);
	
	var sensale = yumoney/zumoney*100;
	var errorinfo = '';
	
	if(baodimoney == ''){
		errorinfo = "保底金额不能为空！";
		Y.getTip().show('#baodimoney','<h5>'+errorinfo+'</h5>').setIco(7);
		return false;
	}
	
	if(baodimoney <= 0){
		errorinfo = "保底金额必须为大于1的整数！";
		Y.getTip().show('#baodimoney','<h5>'+errorinfo+'</h5>').setIco(7);
		return false;
	}
	
	if(Y.getInt(baodimoney) > yumoney){
		errorinfo = "保底金额不能大于剩余金额！";
		Y.getTip().show('#baodimoney','<h5>'+errorinfo+'</h5>').setIco(7);
		return false;
	}
	if(sensale < 5){
//		if(!(Y.getInt(yumoney) == Y.getInt(baodimoney))){
//		    errorinfo = "当剩余金额小于该方案的5%（"+yumoney+"元），您的保底金额必须等于剩余金额！";
//		    Y.getTip().show('#baodimoney','<h5>'+errorinfo+'</h5>').setIco(7);
//		    return false;
//		}
	}else{
//		if(Y.getInt(baodimoney/zumoney*100) < 5){
//			errorinfo = "保底金额至少为总金额的5%，至少1元";
//			Y.getTip().show('#baodimoney','<h5>'+errorinfo+'</h5>').setIco(7);
//			return false;
//		}
	}
	Y.getTip().hide();	
};


var baodi = function(){
	var projid = Y.one('#projid').value;    
	var lotid = Y.one('#lotid').value;    
	var baodimoney = Y.one('#baodimoney').value; 
	var onemoney = Y.one('#onemoney').value; //每份金额
	var baodinum = parseInt(baodimoney/onemoney);
	
    if(check() === false){
	    return;
	}
  
    Y.alert('您好， 正在提交您的请求，请稍等...');
	Y.ajax({
		url : $_trade.url.pb2g,
		type : "POST",
		dataType : "json",
		data:{
        	gid:lotid,
        	gid:lotid,
        	hid:projid,
        	bnum:baodinum
        },
		end : function(d) {
			Y.alert.close();        	
			var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc; 		
			if (code == "0") {
				  
				top.Y.alert("保底转认购成功");
				setTimeout( function(){top.location.reload();},2000);
			}else{
            	Y.alert(desc);
            }
		}
	});
};	

showinfo=function(lotid,projid){
	data = $_trade.key.gid + "=" + encodeURIComponent(lotid) + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
	
	Y.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {

				var r = obj.Resp.row;
				var smoney = r.smoney;// 每份金额
				var nums = Y.getInt(r.nums);// 总份数
				var pnum = Y.getInt(r.pnum);// 发起人保底份数
				var lnum = Y.getInt(r.lnum);// 剩余份数
				
				var html="";					
		
				$("#lotid").val(lotid);
				$("#projid").val(projid);				
				$("#onemoney").val(smoney);
				$("#allnumber").val(nums);
				$("#lnum").val(lnum);	
				$("#pnum").val(pnum);	
				$("#limitnum").val(Math.ceil(nums*0.05));	
				$("#baodinum").val($("#limitnum").val());	
				$("#baodimoney").val($("#pnum").val()*smoney);	
				$("#baodiScale").html(($("#baodimoney").val()/(pnum*smoney)*100).toFixed(2)+'%');
				

				Y.get('#baodimoney').keyup(function(){
					var onemoney = Y.one('#onemoney').value;     //每份金额
					var allnumber =  Y.one('#allnumber').value;  //方案总份数
					var allmoney = parseFloat(allnumber*onemoney); //方案总金额
					var baodimoney = Y.one('#baodimoney').value;   //认购总金额
					if(baodimoney>0){
						if(baodimoney>pnum*smoney){
							$("#baodimoney").val(pnum*smoney);
						}
						
					}
					Y.one('#baodiScale').innerHTML = ($("#baodimoney").val()/(pnum*smoney)*100).toFixed(2)+"%";
//					checkfun();
				}); 

				
			} else {
				alert(desc);
				if (history.length == 0) {
					window.opener = '';
					window.close();
				} else {
					history.go(-1);
				}
			}
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});	
	
};