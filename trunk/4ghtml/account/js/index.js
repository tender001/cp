
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
$(document).ready(function() {
	chklogin("account");
	
	 $.ajax({
		 url : $_user.url.safe,
	        dataType:'json',
	        success:function (d){
	        	var code = d.Resp.code;
	        	if(code == 0){
		        	var r = d.Resp.row;
					var name = r.rname;
					var card = r.bank;
					var mobile = r.mobile;
					if(mobile){
						$("#ismobile").html(mobile)
					}
					if(card){
						$("#isbank").html(card)
					}
					if(name){
						$("#issmrz").html(name)
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
	 $("#tikuan").click(function(){
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
						}else if(card==""){
							showMS("请先添加一张银行","/account/bankinfo.html");
						}else{
							location.href="/account/draw.html";
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
	})
	
});