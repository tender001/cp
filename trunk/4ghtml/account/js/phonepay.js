 $(document).ready(function(){
	 chklogin(1);
	 $("#cardid").keyup(function(){
 		this.value=this.value.replace(/\D/g,''); //只能数字
         this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");//四位一空格
 	});
 	$("#passid").keyup(function(){
 		this.value=this.value.replace(/\D/g,''); //只能数字
         this.value =this.value.replace(/\s/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");//四位一空格
 	});
 	$("em[name=facevalue]").click(function(){
 		$("em[name=facevalue]").removeClass("cur");
 		$(this).addClass("cur");
 		$("#cardts").addClass("cur");
 		var str = ($(this).attr("value")*1*0.96+"").substring(0,($(this).attr("value")*1*0.96+"").indexOf(".") + 3);
 		$("#redMoney").html(str);
 		$("#redcard").html($(this).attr("value"));
 	})
 })
var setType=function(cursel,n){
	for(var i=1;i<=n;i++){
		if(cursel!=i){
			$("#face_type" + i).hide();
		}else{
			$("#face_type" + i).show();
		}
	}
	
	var ty=$("#cardtypeid em");
	$("#cardty").html($(ty[cursel-1]).html());
	ty.removeClass("cur");
	$("#redMoney").html("0.00");
	
	$(ty[cursel-1]).addClass("cur");
}
var interCode = function(isc){
		if(isc){
			$("#craddiv").hide();
			$("#codediv").show();
		}else{
			$("#craddiv").show();
			$("#codediv").hide();
		}
	}
var typecheck =function(){

	var tempvalue="";
	$("div[ty]").each(function(){
		if(!$(this).is(":hidden")){
			$(this).find("em[name=facevalue]").each(function(){
				if($(this).hasClass("cur")){
					tempvalue=$(this).attr("value");
				}
			});
		}
	})
	
	var typevalue="";
	var typevalue="";
	$("em[name=cardtype]").each(function(){
		
		if($(this).hasClass("cur")){
			if($(this).index()==0){
			typevalue="CMJFK";
			}else if($(this).index()==1){
			typevalue="LTJFK";
			}else if($(this).index()==2){
			typevalue="DXJFK";
			}
			
		}
	});
	
	if(typevalue==""){
		showTips('请选择充值卡类型');
		return false;
	}else if(tempvalue==""){
		showTips('请选择充值面值');
		return false;
	}

}
var subform =function (){
	var tempvalue="";
	$("div[ty]").each(function(){
//		if(!$(this).is(":hidden")){
			$(this).find("em[name=facevalue]").each(function(){
				if($(this).hasClass("cur")){
					tempvalue=$(this).attr("value");
				}
			});
//		}
	})
	
	var typevalue="";
	var typevalue="";
	$("em[name=cardtype]").each(function(){
		
		if($(this).hasClass("cur")){
			if($(this).index()==0){
			typevalue="CMJFK";
			}else if($(this).index()==1){
			typevalue="LTJFK";
			}else if($(this).index()==2){
			typevalue="DXJFK";
			}
			
		}
	});
	var cardid = ($("#cardid").val()).replace(/\s+/g,"");
	var passid = ($("#passid").val()).replace(/\s+/g,"");
	if(typevalue==""){
		showTips('请选择充值卡类型');
		return ;
	}else if(tempvalue==""){
		showTips('请选择充值面值');
		return ;
	}else if($("#cardid").val()==""){
		showTips('充值卡卡号不能为空');
		return ;		
	}else if(isNaN(cardid)){
		showTips('卡号请输入数字');
		return ;		
	}else if(isNaN(passid)){
		showTips('密码请输入数字');
		return ;		
	}else if($("#passid").val()==""){
		showTips('充值卡密码不能为空');
		return ;		
	}
	

   
   
	
		
		$.ajax({
		url :$_user.url.addmoney,
		type :"POST",
		dataType :"json",
		data :"bankid=9&addmoney="+tempvalue+"&tkMoney="+tempvalue+"&cardnum="+cardid+"&cardpass="+passid+"&dealid="+typevalue+"&v="+Math.random(),
		success  : function (d){
			var obj = d;
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {
				showMS("收单成功");
				
			} else {
				//收单失败
				showTips(desc);
			}
		}
	});

	
}
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
function showMS(ms,fn) {
    $("#divshowprebuy").html("<div class=\"alert\"><div class=\"alert-tips\"><h2>温馨提示</h2><p>" + ms + "</p><div class=\"alert-btn\" onclick='showBuyMini(2)'>确定</div></div></div>");
//    $("#divshowprebuy").css({
//        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
//        'left': "0px",
//    });
    $(".alert-tips").css({
        "margin-top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
       
    });
    showBuyMini(1);
    setTimeout(function() { showBuyMini(2); }, (6 * 1000));
    if(fn != null && fn != undefined){
    	fn.call(this);
    }
}


//是否显示提示窗口
function showBuyMini(kind) {
    if (kind == 1) {
        $("#divshowprebuy").show();
        $("#divDisable").css({
            "height": $("#caseForm").height() + 110 + "px",
            "display": "block"
        });
    }
    else {
        $("#divshowprebuy").hide();
        $("#divDisable").hide();
        $("#divshowprebuy").html("");
        document.location.reload();
    }
}