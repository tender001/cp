
$(document).ready(function() {
	indexchklogin();
	init();
});
var init=function() {
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
    })
	
};

function indexchklogin(t) {
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
