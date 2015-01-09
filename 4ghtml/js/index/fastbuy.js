var gid="";
var code="";
$(document).ready(function() {
	chklogin();
	gid = location.search.getParam('gid');
	init();
	
});

var init=function() {
	
	if(gid==1||gid==50){
		loadexp(gid);
	}
	if(gid==1){
		code = localStorage.ssq; 
	} else if(gid==50){
		code = localStorage.dlt;
	}
	if(code=="")return;
	var co=code.split("|")
	if(co[1]){
		$(".dstz").html('<o>'+co[0].split(",").join(" ")+'</o><cite>'+co[1].split(",").join(" ")+'</cite>');
	}else{
		showTips("投注号码不明确");
		return;
	}
	
  
};
function payBtn(){
	
	
	
	if(code=="")return;
	var co=code.split("|")
	if(co[1]){
		$(".dstz").html('<o>'+co[0].split(",").join(" ")+'</o><cite>'+co[1].split(",").join(" ")+'</cite>');
		chklogin(function(d){
				if (d.Resp.code == 0) {
					passBuy(code,gid);
				} else {
					showLogin();
				}
		});
	}else{
		showTips("投注号码不明确");
		return;
	}
	
}
function loadexp(gid){
	
	chksale(gid, function(){
		var url = "/cpdata/game/" + gid + "/s.json?rnd="+Math.random();
		$.ajax({
			url:url,
			type:'GET',
			dataType:'json',
			complete:function(XHR, TS){
				var curdate = Date.parse(XHR.getResponseHeader("Date"));
				var d = eval("("+XHR.responseText+")");
				explist = d.period.row;
				if(explist.length > 0){
					var r = explist[0];
					countexp = explist.length;
					var et = r.et.toDate().getTime();
					if(curdate > et){
						r = explist[1];
						countexp = explist.length - 1;
					}
					var name=gid==50?"大乐透":"双色球";
					$(".tz-pay p").eq(0).html(''+name+'&nbsp;第'+r.pid+'期');
					$("#expect").val(r.pid);
					
				}
			},
			error:function(){
				showTips('网络错误');
			}
		});
	});
};
chksale = function(gid,fn){
	$.ajax({
		url:'/cpdata/game/'+gid+'/sale.json',
		type:'GET',
		dateType:'json',
		success:function(d){
			if(parseInt(d.sale) > 0){
				stopState = 0;
			} else {
				stopState = 1;
			}
			fn.call(this);
		},
		error:function(){
			showTips('网络错误');
			stopState = 1;
			fn.call(this);
		}
	});
};
function issuc(ispay){
	 if(issuc){
	    	$("#paybet").hide();
	    	$("#issuc").show();
	    }else{
	    	$("#paybet").show();
	    	$("#issuc").hide();
	    }
}
function passBuy(code,gid) {
	 var url = $_trade.url.pcast;
	var pid = $("#expect").val();
	if(pid.indexOf("15")==-1){
		showTips("期号投注不明确");
		return;
	}else if(code==""){
		showTips("投注号码不明确");
		return;
	}
	var param='gid='+gid+'&pid='+pid+'&play=1&codes='+code+':1:1&';
   
    param=param+'muli=1&fflag=0&type=0&name=手机代购&desc=手机代购&money=2&tnum=1&bnum=1&pnum=0&oflag=0&wrate=0&comeFrom=&source=100&endTime=';
    $.ajax(
    {
        url: url,
        type: "POST",
        dataType:'json',
        data: param,
        success: function(d) {
            var code = d.Resp.code;
            var desc = d.Resp.desc;
            if(code == 0){
            	if (!!d.Resp.result){
            		xproid = d.Resp.result.projid;
            		$("#cpid").attr("href","/user/project.html?lotid="+gid+"&projid="+xproid)
            		issuc(true);
            	
            	
            	
            	} else {
            		zhid = d.Resp.zhuihao.id;
//            		showMS("购买成功,祝君好运中大奖!",function(){
//            			setTimeout(function() { window.location.href = "/user/xchase.html?lotid="+gid+"&tid="+zhid;}, (2 * 1000));
//            		});
            		$("#cpid").attr("href","/user/project.html?lotid="+gid+"&projid="+xproid)
            		issuc(true);
            	}
            } else {
            	if(desc.indexOf("余额") > 0){
            		showMS("您的余额不足，请去充值!", function(){
   					setTimeout(function() { window.location.href = "/account/pay.html"; }, (2 * 1000));
            		});
            	} else {
            		showMS(desc);
            	}
            }
            return;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            showMS(XMLHttpRequest.responseText);
            return;
        }
    }
    );
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