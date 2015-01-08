$(document).ready(function(){
	
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

function showMS(ms,fn) {
    $("#divshowprebuy").html("<div class=\"ball_h2\">温馨提示</div><div class=\"mini\">内容：" + ms + "</div>");
    $("#divshowprebuy").css({
        "top": ($(window).height() / 4 + $(window).scrollTop()) + "px",
        'left': "0px",
    });
    showBuyMini(1);
//    setTimeout(function() { showBuyMini(2); }, (2 * 1000));
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
    }
}