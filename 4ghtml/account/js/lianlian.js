$(document).ready(function(){
	chklogin("account");
	showname();
	var amount = location.search.getParam('amount');
	$("#submit").click(function(){
		var cardno=$("#cardno").val().replace(/\s/g, ""); 
        
		if (amount<10){
	    	showTips('存入金额至少为10元');
	    	history.go(-1)
			return false;
		}else if(amount>5000000){
			showTips('存入金额最高不能超过500万元人民币');
			history.go(-1);
			return false;
		}else{
			$("#money").val(amount);
			$("#card").val(cardno)
			$("#yt").submit();
		}
	})
})
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