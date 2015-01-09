var Onebet=true;
var Oneget=true;
$(document).ready(function(){
	chklogin();
//	$('.eday-money').animateNumber( 
//		  {
//		    number: 160.66
//		    
//		  }
//	);
})
function chklogin(){
	$.ajax({
	       url: $_user.url.checklogin,
	       dataType:'json',
	       success:function (d){
	    	  
				var code = d.Resp.code;
				if (code == 0) {
					show();
				}else{
					logoutinfo();
				}
				
	       },
	       error:function(){
	    	   showTips('网络故障!');
	    	   return false;
	       }
	   });
}
function show(){
	$(".eday-login").hide();
	edaylist(true);
	myjoinibonus();
}
function logoutinfo(){
	$(".eday-login").show();
	edaylist(false);
//	$('.eday-money').html("天天领钱");
}
function edaylist(isLogin){
	var html="";
	var url=isLogin?'/phpu/q.phpx?fid=ttfq_list':'/phpt/q.phpx?func=ttfq_list_ncl';
	$.ajax({
	    url:url,
	    type : "POST",
		dataType : "json",
	    success :function (xml){
	   	 var R = xml.Resp;
			var code = R.code;
			var desc = R.desc;
	        if(code== "0"){
	        	var rs = isLogin?xml.Resp.row:xml.Resp.rows.row;
	        	if(!isArray(rs)){rs = new Array(rs);}
				$.each(rs, function(o,r){

					var cgameid = r.cgameid;//玩法
					var cttid = r.cttid;
					var cendtime = r.cendtime;//截止时间
					var ibonus = r.ibonus;//方案奖金
					var cawardtime = r.cawardtime.substring(11,16); //开奖时间
					var cnickid = r.cnickid //
					var iaward = r.iaward; // 计奖状态（0 未计奖 1 正在计奖 2 已计奖)
					var imoney = r.imoney //方案金额
					var iwmoney =r.iwmoney //我的奖金
					var ureturn = r.ureturn // 领奖状态（ 0 未领奖 2 已领奖）
					var day=cendtime.substring(5,10);
					
					var today=new Date();
					if(today.getDate()==(day.substr(3,2)*1)){
						day="今天"
					}else if(today.getDate()-(day.substr(3,2)*1)==1){
						day="昨天"
					}else if(today.getDate()-(day.substr(3,2)*1)==2){
						day="前天"
					}
					ibonus=(ibonus==""&&iaward==0)?'<td class="kj-time" onclick="showinfo('+cttid+')"><p>'+cawardtime+'</p>开奖</td>':'<td onclick="showinfo('+cttid+')">'+ibonus+'元</td>';
					var join="";
					
					if(cnickid){
						if(iaward==2){
							
							if(ureturn==0){
								join='<span class="partake green-bg" onclick="geteday('+cttid+')">领取奖金</span>';
							}else if(ureturn==2){
								join='<span class="red" >+'+ changeTwoDecimal_f(iwmoney)+'</span>';
							}
						}else{
							join='<span">等待分钱</span>';
						}
					}else{
						if(iaward==0){//if(iaward==0){
							join='<span class="partake" onclick="joineday('+cttid+')">立即参与</span>';
						}else{
							join='<span>未参与</span>';
						}
					}
					if(!isLogin)join='<span>--</span>';
					if(o<15){
						html +='<tr ><th onclick="showinfo('+cttid+')"><p>'+day+'</p><p>'+$_sys.getlotname(cgameid)+'</p></th>'
							+'<td onclick="showinfo('+cttid+')">'+imoney+'元</td >'+ibonus+'<td>'+join+'</td></tr>'
					}
				})
				 $("#fqlist").html(html)
	        }
	       
		       
	    }
  })
}
function myjoinibonus(){
	$.ajax({
	     url:'/phpu/q.phpx?fid=ttfq_my_award',
	     type : "POST",
		 dataType : "json",
	     success :function (xml){
	    	 var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
	    	
	    	  
		       if(code== "0"){
		    	  
		    	  $('.eday-money').html(changeTwoDecimal_f(R.row.itmoney));
		       }else{
		    	   $('.eday-money').html("0.00");
		       }
		       
	     }
	   });
}
function joineday(tid){ //参与分钱
	if(Onebet){
		$.ajax({
		     url:'/phpu/p.phpx?fid=ttfq_join&tid='+tid,
		     type : "POST",
			 dataType : "json",
		     success :function (xml){
		    	 var R = xml.Resp;
					var code = R.code;
					var desc = R.desc;
		    	
		    	  
			       if(code== "0"){
			    	   Onebet=false;
			    	   showMS("恭喜您成功参与分钱",show());
			       }else{
			    	   showMS(desc);
			       }
			       
		     }
		   });
	}else{
		show();
	}
	
}
function geteday(tid){
	if(Onebet){
		$.ajax({
		     url:'/phpu/p.phpx?fid=ttfq_award&tid='+tid,
		     type : "POST",
			 dataType : "json",
		     success :function (xml){
		    	 var R = xml.Resp;
					var code = R.code;
					var desc = R.desc;
		    	
		    	  
			       if(code== "0"){
			    	   showMS("恭喜您领取到奖金",show());
			    	   
			       }else{
			    	   showMS(desc);
			    	 
			       }
			       
		     }
		   });
	}else{
		show();
	}
	
}

function showinfo(tid){ //查看详情
	if(tid){
		location.href="/huodong/edaydetail.html?tid="+tid;
	}
	
//	$.ajax({
//	     url:'/phpu/q.phpx?fid=ttfq_detail&tid='+tid,
//	     type : "POST",
//		 dataType : "json",
//	     success :function (xml){
//	    	 var R = xml.Resp;
//				var code = R.code;
//				var desc = R.desc;
//	    	
//	    	  
//		       if(code== "0"){
//		    	
//		    	   showMS("恭喜您成功参与分钱");
//		       }
//		       
//	     }
//	   });
	
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
    setTimeout(function() { showBuyMini(2); }, (5 * 1000));
    if(fn != null && fn != undefined){
    	fn.call(this);
    }
}
function goindex(){
	location.href="/";
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