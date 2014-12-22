
$(document).ready(function() {
	chklogin();
	inits();
	Home.init();
});
var inits=function() {
//	TouchSlide({ 
//		slideCell:"#focus",
//		titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
//		mainCell:".bd ul", 
//		effect:"leftLoop", 
//		autoPlay:true,//自动播放
//		autoPage:true //自动分页
//	});
	setInterval(function() {
        autoScroll()
    },4e3);
	$(".go-top-ico").click(function() {
        window.scrollTo(0, 0)
    });
	
	
};
Home = function() {
    var j_ = "";
    var n_ = new Date;
    var tag = "ssq";
    var a = {
        jxNum: function(obj, tag) {
            if (tag == "ssq") {
                var ssq = Random(33),
                i;
                ssq = ssq.slice(0, 6).sort(function(a, b) {
                    return a - b
                });
                for (i = 0; i < 6; i++) {
                    obj[i].innerHTML = zeroStr(ssq[i], 2)
                }
                var ssq_b = Random(16);
                obj[6].innerHTML = zeroStr(ssq_b[6], 2)
            } else {
                var dlt = Random(35),
                i;
                dlt = dlt.slice(0, 5).sort(function(a, b) {
                    return a - b
                });
                for (i = 0; i < 5; i++) {
                    obj[i].innerHTML = zeroStr(dlt[i], 2)
                }
                var dlt_b = Random(12);
                dlt_b = dlt_b.slice(0, 2).sort(function(a, b) {
                    return a - b
                });
                obj[5].innerHTML = zeroStr(dlt_b[0], 2);
                obj[6].innerHTML = zeroStr(dlt_b[1], 2)
            }
        },
        setJx: function() {
            clearInterval(j_);
            var g = 0,
            q = 100;
            $("#ball em").addClass("rotate_jx");
            a.jxNum($("#ball em"), tag);
            j_ = setInterval(function() {
                $("#ball em:eq(" + g + ")").removeClass("rotate_jx");
                g++;
                if (g > 6) {
                    return false
                }
            },
            q)
        }
    };
    var b = {
        init: function() {
//            b.bindEvent();
            var t = n_.getHours();
            var wk = n_.getDay();
//            t = t >= 18 && "Hi,晚上好!" || t >= 14 && "Hi,下午好!" || t >= 11 && "Hi,中午好!" || t >= 5 && "Hi,早上好!" || "Hi,晚上好!";
//            $("#say_hi").html(t);
            if (wk == "2" || wk == "4" || wk == "0" || wk == "5") {
                $("#handy strong").html("双色球");
                wk != "5" && $("#tag_01").find("em").eq(0).addClass("jrkjico")
            } else {
                tag = "dlt";
                $("#handy strong").html("大乐透");
                $("#ball em").eq(5).addClass("blue");
                $("#tag_50").find("em").eq(0).addClass("jrkjico")
            }
            a.setJx();
            $("#ball").on("click",
            function() {
                a.setJx()
            });
            $(".inms em").on("click",
                    function() {
                        a.setJx()
                    });
            $("#fastbuy").on("click",
            function() {
                var n = $("#ball em").length,
                i;
                var lot_ = {
                    ssq: "01",
                    dlt: "50"
                } [tag];
                if (tag == "ssq") {
                    var ssq = "";
                    $("#ball").find("em").each(function(a) {
                        if (a < 5) {
                            ssq += $(this).html() + ","
                        }
                        if (a == 5) {
                            ssq += $(this).html() + "|"
                        }
                        if (a == 6) {
                            ssq += $(this).html()
                        }
                    });
                    localStorage.setItem("ssq", ssq)
                } else {
                    var dlt = "";
                    $("#ball").find("em").each(function(a) {
                        if (a < 4) {
                            dlt += $(this).html() + ","
                        }
                        if (a == 4) {
                            dlt += $(this).html() + "|"
                        }
                        if (a > 4) {
                            dlt += $(this).html() + ","
                        }
                    });
                    dlt = dlt.substr(0, dlt.length - 1);
                    localStorage.setItem("dlt", dlt)
                }
                window.location.href = "/cc/fastbuy.html?notes=1&multiple=1&issue=1&countMoney=2&pattern=0&gid=" + lot_
            });
         
        }
       
    };
    return {
        init: b.init
    }
} ();
function zeroStr(num, n) {
    var len = num.toString().length;
    while (len < n) {
        num = "0" + num;
        len++
    }
    return num
}
function Random(count) {
    var original = new Array;
    for (var i = 0; i < count; i++) {
        original[i] = i + 1
    }
    original.sort(function() {
        return.5 - Math.random()
    });
    var arrayList = new Array;
    for (var i = 0; i < count; i++) {
        arrayList[i] = original[i]
    }
    return arrayList
}
//function fastbuy(){}
function isLogin(t) {
	   $.ajax({
	       url: $_user.url.checklogin,
	       dataType:'json',
	       success:function (d){
	    	   	if(t != undefined && isFunction(t)){
					t.call(this,d);
				} else {
					var code = d.Resp.code;
					if (code == 0) {
						
						
					}else{
						
					}
				}
	       },
	       error:function(){
	    	   showTips('网络故障!');
	    	   return false;
	       }
	   });
	}
var  autoScroll=function() {
    this.$(".zj_tipBox").animate({
        marginTop: "-28px"
    },
    500,
    function() {
        var i = $(this);
        i.css("margin-top", 0),
        i.find("tr").eq(0).appendTo(i.find("tbody"))
    })
}
