        var hasBindYt = false;//连连是否绑卡
        chklogin("account");
        $(document).ready(function(){
            $("#moneys li em").click(function(){
            	$("#moneys li em").removeClass("cur");
            	if(!$(this).hasClass("cur")){
                    $(this).parent().find("em").removeClass("cur");
                    $(this).addClass("cur");
                    $("#money").val($(this).attr("data-target"));
                }
            });
            setInterval(function(){
                var _money = $("#money").val();
//                $("#moneys li em").removeClass("cur");
//                $("#"+_money).addClass("cur");
                if(/^[1-9]\d{0,}$/.test(_money)){
                    $("#submit").removeClass("action_no")
                }else{
                    $("#submit").addClass("action_no");
                }
            },100);

            $("#chargetypeTab ul").click(function(){
               if(!$(this).find('em.true-icon').hasClass("true-icon-cur")){
                   $("ul em.true-icon").removeClass("true-icon-cur");
                   $(this).find('em.true-icon').addClass("true-icon-cur");
               }
            });

            (function(){
                var lastUsed = ""//Cookies.get("wifi.159cai.com.recharge.lastUsed");
                if(lastUsed == "yt"){
                    if(hasBindYt){
                        $("#"+lastUsed).remove();
                        $("#used").html($("#yt-list").html());
                        $("#yt_cards").remove();
                        $("#used li").first().trigger("click")
                    }
                }else if(lastUsed){
                    $("li.charge_type").removeClass("select");
                    $("#"+lastUsed).addClass("select").remove().appendTo($("#used"));
                    $("#used").find("li .czfs_name").css("margin-left","9px");
                }else{
                    $("#h10").remove();
                }
            })();

            var CallRecharge = {
                zfb:function(money){
//                     window.location.href="/recharge/alipay/ci?amount="+money;
                    $("#payform").attr("action","/pwap/addmoneynew.phpx");
                    $("#banktype").val("00");
                    $("#bankid").val("3");
                    $("#addmoney").val(money);
                    if ($("#addmoney").val()<10){
            	    	showTips('存入金额至少为10元');
            			$("#money").focus();
            			return false;
            		}else if($("#addmoney").val()>5000000){
            			showTips('存入金额最高不能超过500万元人民币');
            			return false;
            		}else{
            			$("#payform").submit();
//            			$("#money").focus();
            		}
                    
                },
                kjcz:function(money){
//                    window.location.href="/recharge/tenpay/ci?amount="+money;
                },
                mcard:function(money){
//                    window.location.href="/recharge/wx/ci?amount="+money;
                },
               /* bankcard:function(money){
                    window.location.href="/recharge/bankcard/index?amount="+money;
                },*/
                yt:{
                    newcard:function(money){
                        window.location.href="/recharge/lianlian/newcard?amount="+money;
                    },
                    usedCard:function(money,cardno,agreeno){
                        $("#amount").val(money);
                        $("#card_no").val(cardno);
                        $("#no_agree").val(agreeno);
                        $("#ytform").submit();
                    }
                },
                baidu:function(money){
//                    window.location.href="/recharge/baifubao/index.html?allmoney="+money;
                },
                mcard:function(money){
                    window.location.href="/account/phonepay.html"
                }
            };

            $("#yt").click(function(){
                if($("#yt_cards").is(':visible')){
                    $("#yt_cards").hide();
                    $("#card_flag").removeClass("czfs_up");
                }else{
                    $("#yt_cards").show();
                    $("#card_flag").addClass("czfs_up");
                }
            });

            $("#submit").click(function(){
            	var $eliment = $("em.true-icon-cur");
            	var typename = $eliment.attr("data-type");
            	if(!$(this).hasClass("action_no")){
                    var _money = $("#money").val();
                    
                    

//                     Cookies.set("wifi.159cai.com.recharge.lastUsed",typename,{path:"/"});

                    if(typename == "kjzf"){
                        
                        
                		$.ajax({
                			url : $_user.url.safe,
                			type : "POST",
                			dataType : "json",
                			success : function(xml) {
                				var R = xml.Resp;
                				var code = R.code;
                				var desc = R.desc;
                				if (code == "0") {	
                					var r= R.row;
                					var rname = r.rname;
                					var idcard = r.idcard;
                					if(rname == ""){
                						showMS("请先绑定身份证信息","/account/sminfo.html");
                					}else{
                						window.location.href="/account/lianlian.html?amount="+_money;
                					}
                				}else {
                					showTips(desc);
                				}
                				
                			},
                			error : function() {
                				showTips("网络异常！");
                			}
                		});
                    }else{
                        CallRecharge[typename](_money);
                    }
                }else if(typename=="mcard"){
                	 window.location.href="/account/phonepay.html";
                }
            });
        })
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