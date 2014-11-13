$(function(){
	//加载当前期号
	fun.loadExpect("zc",1,function(exp){
		allInterFace.ssqExp = exp.expect;
		allInterFace.lottertime = exp.buyendtime;
		allInterFace.upfileendtime = exp.upfileendtime;	
	});
	getproject(10);
	$(".fright .aut_s_btn").live("click",function(){
		$(".fright .aut_s_btn").removeClass("sel");
		$(this).addClass("sel");
		getproject($(this).attr("val"));
	})
	
	$("#seach").live("click",function(){
		getproject($("#seachbox").val());
	})
	
	$("#seachbox").keyup(function(){
		fun.changeNum($("#seachbox"));
		if($(this).val()>100){
			$(this).val(100);
		}
	});
})

function getproject(len) {
	var h = "";
	var data = Common.getAjax("/staticdata/lotteryinfo/opencode/11.xml");
	var xml = $(data).find("xml");
	xml.find("row").each(function (i) {

		if(i<len){
			var r = $(this);
			var lotissue = r.attr("lotissue");
			var red = r.attr("BaseCode");
			var blue = r.attr("speccode");
			var sale = r.attr("sale");
			var Bonus1 = r.attr("Bonus1");
			var Bonus2 = r.attr("Bonus2");
			var Count1 = r.attr("Count1");
			var Count2 = r.attr("Count2");
			var opentime = r.attr("opentime");
			h += '<tr>';
				h += '<td class="t_c">'+lotissue+'</td>';
				h += '<td class="t_c">';
				h += '<div class="num_zj color_red">';
				
				h += processBall(red);
				
				h +='</div>';
				h += '</td>';
				h += '<td class="t_c">'+sale+' 元</td>';
				h += '<td class="t_r">'+Count1+' 注</td>';
				h += '<td class="t_r">'+Bonus1+'元</td>';
				h += '<td class="t_r">'+Count2+' 注</td>';
				h += '<td class="t_r">'+Bonus2+'元</td>';
				h += '<td class="t_c">'+opentime+'</td>';
				h += '<td class="t_c last"><a href="history_detail.html?issue='+lotissue+'" target="_blank" title="第'+lotissue+'期双色球开奖结果" class="blue_b">查看</a></td>';
			h += '</tr>';
			
			
		}
	});
	
	$(".history_list tbody").html(h);
}
function processBall(red){
	var red_ = red.split("");
	var html = '';
	for(var i = 0;i<red_.length;i++){
		if(i==0||i==4||i==8||i==12){
			html+="<b>";
		}
		html+=red_[i];
		if(i==3||i==7||i==11||i==13){
			html+="</b>";
		}
	}
	return html;
}; 