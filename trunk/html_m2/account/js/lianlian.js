$(document).ready(function(){
	chklogin("account");
	showname();
	var amount = location.search.getParam('amount');
	$("#submit").click(function(){
		var cardno=$("#cardno").val().replace(/\s/g, ""); 
        if(cardno==""){
        	showTips('请输入银行卡号');
			return false;
        }
		if (amount<10){
	    	showTips('存入金额至少为10元');
	    	history.go(-1)
			return false;
		}else if(amount>5000000){
			showTips('存入金额最高不能超过500万元人民币');
			history.go(-1);
			return false;
		}else{
			
			if(luhmCheck(cardno)){
				$("#money").val(amount);
				$("#card").val(cardno)
				$("#yt").submit();
			}else{
				showTips('请输入您正确的银行卡号');
			}
			
		}
	})
})
//Create Time:  12/26/2014
//Operator:     yws
//Description:  银行卡号Luhm校验
 
//Luhm校验规则：16位银行卡号（19位通用）:
 
// 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
// 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
// 3.将加法和加上校验位能被 10 整除。

 
 
//bankno为银行卡号 banknoInfo为显示提示信息的DIV或其他控件
function luhmCheck(bankno){
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）
 
    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
     
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
     
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
     
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
     
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
     
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }      
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
     
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
     
    if(lastNum==luhm){
// Luhm验证通过");
    return true;
    }
    else{
//银行卡号必须符合Luhm校验");
    return false;
    }        
}
function showname(){
	 $.ajax({
		 url : $_user.url.safe,
        dataType:'json',
        success:function (d){
        	var code = d.Resp.code;
        	if(code == 0){
	        	var r = d.Resp.row;
				var name = r.rname;
				var card = r.bank;
				if(name==""){
					showMS("请先绑定身份证信息","/account/sminfo.html")
				}else{
					$("#cardno").attr("placeholder","开户姓名需为“"+name+"”");
				}
			  
        	} else {
        		showTips(d.Resp.desc);
        	}
        },
        error:function(){
     	   showTips('网络故障!');
     	   return false;
        }
	 });
}
function showMS(ms,url) {
    $("#divshowprebuy").html("<div class=\"alert\"><div class=\"alert-tips\"><h2>温馨提示</h2><p>" + ms + "</p><div class=\"alert-btn\" onclick='showBuyMini(2,\""+url+"\")'>确定</div></div></div>");
//    $("#divshowprebuy").css({
//        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
//        'left': "0px",
//    });
    $(".alert-tips").css({
        "margin-top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
       
    });
    showBuyMini(1);
//    setTimeout(function() { showBuyMini(2); }, (6 * 1000));
}


//是否显示提示窗口
function showBuyMini(kind,url) {
    if (kind == 1) {
        $("#divshowprebuy").show();
        $("#divDisable").css({
            "height": $("#caseForm").height() + 110 + "px",
            "display": "block"
        });
        var overlayID = "_t_overlay";
        if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
        $('.overlay').css({ 'height': ($("body").height()) + 'px', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();
    }
    else {
        $("#divshowprebuy").hide();
        $("#divDisable,.overlay").hide();
        $("#divshowprebuy").html("");
        location.href=url;
    }
}