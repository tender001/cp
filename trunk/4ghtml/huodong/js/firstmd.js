$(document).ready(function(){
	autoScroll();
	$("#getSSQ").click(function(){
		chklogin(function(d){
			if (d.Resp.code == 0) {
				Getsqq();
			} else {
				showLogin();
			}
		});
	})
})


function Getsqq(result){

	$.ajax({
	     url:'/phpu/p.phpx?fid=hd_scp',
	     type : "POST",
			dataType : "json",
	     success :function (xml){
	    	 var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
	    	
	    	  
		       if(code== "0"){
		    	
		    	   showMS("恭喜您成功领取一注双色球");
		       }else if(code=="3"){
		    	  showMS("实名后系统赠送一注双色球");
		       }else if(code=="4"){
		    	   showMS("绑定手机后系统赠送一注双色球");
		       }else{
		    	   showMS(desc);
		       }
		       
	     }
	   });
}
var  autoScroll=function() {
    this.$("#tipBox").animate({
        marginTop: "-28px"
    },
    500,
    function() {
        var i = $(this);
        i.css("margin-top", 0),
        i.find("p").eq(0).appendTo(i.find("div"))
    })
}

//设置提示窗口
function showMS(ms,fn) {
    $("#divshowprebuy").html("<div class=\"alert\"><div class=\"alert-tips\"><h2>温馨提示</h2><p>" + ms + "</p><div class=\"alert-btn\" onclick='showBuyMini(2)'>确定</div></div></div>");
//    $("#divshowprebuy").css({
//        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
//        'left': "0px",
//    });
    $(".alert-tips").css({
        "margin-top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
       
    });
    var overlayID = "_t_overlay";
    if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
    
    $('.overlay').css({ 'height': ($("body").height()) + 'px', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();
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
        var overlayID = "_t_overlay";
//        if (!byID(overlayID)) $('body').append('<div class="overlay" id="' + overlayID + '"></div>');
        
        $('.overlay').css({ 'height': ($("body").height()) + 'px', 'left': '0px', 'top': '0px', 'width': '100%', 'display': 'block', 'position': 'absolute' }).show();
    }
    else {
        $("#divshowprebuy").hide();
        $("#divDisable").hide();
        $("#divshowprebuy").html("");
        $('.overlay').hide();
    }
}