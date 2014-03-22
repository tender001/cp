/**
 * 彩票手机卡充值服务
 */
Class({
	ready: true,
    index:function (config){
    	$("#cardid").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
            this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");//四位一空格
    	});
    	$("#passid").keyup(function(){
    		this.value=this.value.replace(/\D/g,''); //只能数字
            this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");//四位一空格
    	});
    	$("li[name=facevalue]").click(function(){
    		$("li[name=facevalue]").removeClass("cur");
    		$(this).addClass("cur");
    	})
    	this.LoginAcc();
    }	
});

var setType=function(cursel,n){
	for(var i=1;i<=n;i++){
		if(cursel!=i){
			$("#face_type" + i).hide();
		}else{
			$("#face_type" + i).show();
		}
	}
	var ty=$("#mobilecard li");
//	$("#mobilecard li").addClass("cur");
//	$("#cardm").addClass("cur");
//	ty[cursel-1].checked="checked";
	$(ty[cursel-1]).addClass("cur").siblings().removeClass("cur");
}

var subform =function (){
	var tempvalue="";
	$("li[name=facevalue]").each(function(){
		if($(this).hasClass("cur")){
			tempvalue=$(this).attr("value");
		}
	});
	
	var typevalue="";
	$("li[name=cardtype]").each(function(){
		if($(this).index()==0){
			typevalue="CMJFK";
		}else if($(this).index()==0){
			typevalue="LTJFK";
		}else if($(this).index()==0){
			typevalue="DXJFK";
		}
	});
	var cardid = ($("#cardid").val()).replace(/\s+/g,"");
	var passid = ($("#passid").val()).replace(/\s+/g,"");
	if(typevalue==""){
		Y.alert('请选择充值卡类型');
		return false;
	}else if(tempvalue==""){
		Y.alert('请选择充值面值');
		return false;
	}else if($("#cardid").val()==""){
		Y.alert('充值卡卡号不能为空');
		return false;		
	}else if(isNaN(cardid)){
		Y.alert('卡号请输入数字');
		return false;		
	}else if(isNaN(passid)){
		Y.alert('密码请输入数字');
		return false;		
	}else if($("#passid").val()==""){
		Y.alert('充值卡密码不能为空');
		return false;		
	}
	Y.ajax({
		url :$_user.url.addmoney,
		type :"POST",
		dataType :"json",
		data :"bankid=9&addmoney="+tempvalue+"&tkMoney="+tempvalue+"&cardnum="+cardid+"&cardpass="+passid+"&dealid="+typevalue+"&v="+Math.random(),
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {
				Y.alert('收单成功');
			} else {
				//收单失败
				Y.alert(desc);
			}
		}
	});
	
}