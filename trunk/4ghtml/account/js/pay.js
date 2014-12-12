        var hasBindYt = false;//连连是否绑卡
        chklogin(1);
        $(document).ready(function(){
            $("#moneys li em").click(function(){
                if(!$(this).hasClass("cur")){
                    $(this).parent().find("em").removeClass("cur");
                    $(this).addClass("cur");
                    $("#money").val($(this).attr("data-target"));
                }
            });
            setInterval(function(){
                var _money = $("#money").val();
                $("#moneys li em").removeClass("cur");
                $("#"+_money).addClass("cur");
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
                    $("#payform").attr("action","/pwap/addmoney.phpx");
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
            			$("#money").focus();
            		}
                    
                },
                cft:function(money){
                    window.location.href="/recharge/tenpay/ci?amount="+money;
                },
                mcard:function(money){
                    window.location.href="/recharge/wx/ci?amount="+money;
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
                    window.location.href="/recharge/baifubao/index.html?allmoney="+money;
                },
                mcard:function(money){
                    window.location.href="/recharge/mobile/card"
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
                if(!$(this).hasClass("action_no")){
                    var _money = $("#money").val();
                    var $eliment = $("em.true-icon-cur");
                    var typename = $eliment.attr("data-type");

//                     Cookies.set("wifi.159cai.com.recharge.lastUsed",typename,{path:"/"});

                    if(typename == "kjcz"){
                        var cardno = $eliment.attr("data-cardno");
                        var agreeno = $eliment.attr("data-agreeno");
                        if(cardno && agreeno){
                            CallRecharge[typename].usedCard(_money,cardno,agreeno);
                        }else{
                            CallRecharge[typename].newcard(_money);
                        }
                    }else{
                        CallRecharge[typename](_money);
                    }
                }
            });
        })