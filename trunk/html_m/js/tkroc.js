$_sys.draw_def = [];
$_sys.draw_def.push([0 ,"处理中"]);
$_sys.draw_def.push([1 ,"提款成功"]);
$_sys.draw_def.push([2 ,"提款失败"]);
$_sys.draw_def.push([3 ,"银行处理失败"]);
$_sys.draw_def.push([4 ,"支付宝提款中"]);
$_sys.draw_def.push([5 ,"支付宝提款成功"]);
$_sys.draw_def.push([6 ,"支付宝提款失败"]);

$_sys.getdraw = function(f, n) {
	if (typeof (n) == 'undefined') {
		n = 1;
	};
	for ( var i = 0; i < $_sys.draw_def.length; i++) {
		if ($_sys.draw_def[i][0] == f) {
			return $_sys.draw_def[i][n].split(",");
		}
	}
};
function showinfo(pn, ps, tp, tr){
	tixian(pn, ps, tp, tr);
}


function tixian(pn, ps, tp, tr){
	
	var html = "";
	var now= new Date();
	var year=now.getFullYear();
	var month=now.getMonth()+1;      
	var day=now.getDate();
	var etime = year+"-"+month+"-"+day;
	var stime = "";
	if($("#ddlDate").val() == "day"){
		stime = etime;
	} else if ($("#ddlDate").val() == "week") {
		if(day>7){
		stime = year+"-"+month+"-"+(day-7);
		}else{
			if((year%4==0&&year%100!=0)||year%400==0){//闰年
				if(month==1){
					stime = (year-1)+"-"+12+"-"+(day+24);
				}else if(month==2||month==4||month==6||month==8||month==9||month==11){
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+24);
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+22);
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+23);
				}
			}else{
				if(month==1){
					stime = (year-1)+"-"+12+"-"+(day+24);
				}else if(month==2||month==4||month==6||month==8||month==9||month==11){
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+24);
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+21);
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+(day+23);
				}
			}
		}
	} else if ($("#ddlDate").val() == "month") {
		if(day==29){
			if((year%4==0&&year%100!=0)||year%400==0){//闰年
				if(month==1){
					stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+day;
				}
			}else{
				if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+28;
				}else if(month==1){
					stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+day;
				}
			}
		}else if(day==30){
			if((year%4==0&&year%100!=0)||year%400==0){//闰年
				if(month==1){
					stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+29;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+day;
				}
			}else{
				if(month==1){
				stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+28;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+day;
				}
			}
		}else if(day==31){

			if((year%4==0&&year%100!=0)||year%400==0){//闰年
				if(month==1){
					stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+29;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+30;
				}
			}else{
				if(month ==1){
					stime = (parseInt(year)-1)+"-"+12+"-"+day;
				}else if(month==3){
					stime = year+"-"+(parseInt(month)-1)+"-"+28;
				}else{
					stime = year+"-"+(parseInt(month)-1)+"-"+30;
				}
			}
		}else{
			if(month==1){
				stime = (parseInt(year)-1)+"-"+12+"-"+day;
			}else{
				stime = year+"-"+"0"+(parseInt(month)-1)+"-"+day;
			}
			
		}
	} else if ($("#ddlDate").val() == "months") {
		if(month>3){
			if(day<29){
				stime = year+"-"+(parseInt(month)-3)+"-"+day;
			}else{
				stime = year+"-"+(parseInt(month)-3)+"-"+28;
			}
		}else{
			if(day<29){
				stime = (year-1)+"-"+(parseInt(month)+9)+"-"+day;
			}else{
				stime = (year-1)+"-"+(parseInt(month)+9)+"-"+28;
			}
		}
	}
	var data="";
	var pn = pn===undefined?1:pn;// 页码
	var ps = ps===undefined?10:ps;// 页面大小
	var tp = tp===undefined?0:tp;// 总页数
	var tr = tr===undefined?0:tr;// 总记录数
	data = $_user.key.stime+"=" + stime + "&"+$_user.key.etime+"=" + etime;	
	data += "&"+$_user.key.pn+"="+pn;
	data += "&"+$_user.key.ps+"="+ps;
	data += "&"+$_user.key.tp+"="+tp;
	data += "&"+$_user.key.tr+"="+tr;
	$.ajax({
		url : "/phpu/qp.phpx?fid=u_cash",
		type : "get",
		dataType : "json",
		data : data,
		success : function(xml) {
			var R = xml.Resp;
			var code = R.code;
			var outcount ="";
			var outnum =0;
			rows = "";
			var count=R.count;
			tr=tr===0?(count.rc)*1:tr;
			pn=(count.pn)*1;
			tp=(count.tp)*1;
			ps=(count.ps)*1;
			if (code == "0") {
				var r = R.row;	
				if(!isArray(r)){r=new Array(r);}
				$.each(r,function(o,rt) {
					var rate = rt.rate;
					var cashdate = rt.cashdate;
				    var money = rt.money;
					var success = rt.success;
					var cashid = rt.cashid;
					
					html +="<tr class=\"list\">";
					html +="<td>交易时间："+cashdate+"<br>";
					html +="支出：<font color=red>"+money+"</font>元&nbsp;&nbsp;手续费:<font color=red>"+parseFloat(rate).rmb()+"</font>元&nbsp;订单号："+cashid+"<br>";
					html +="状态：<font color=green>"+ $_sys.getdraw(success)+"</font>";
					html +="</td></tr>";
					outcount++;
					outnum=parseInt(outnum)+parseInt(money);
				});
				$("#div3").hide();
				$("#div1").hide();
				$("#div2").html(html);
				$("#div2").show();
				$("#font1").html(outcount);
				$("#font2").html(outnum);
				
				var pi 
				pi='<a  style="margin-right: 5px" onclick="showinfo(1,'+ps+','+tp+','+tr+')">首页</a>';
				var ts = pn % ps == 0 ? parseInt(pn / ps)-1: parseInt(pn / ps);
				if(parseInt(pn) > 1){
					pi+='<a  style="margin-right: 5px" onclick="showinfo('+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+tr+')">上一页</a>';
				}
				for(var k = 0; k < 10; k++){
					var cp = ts * ps + k + 1;
					if(cp <= tp){
						if(cp == pn){
							pi+='<a onclick="showinfo('+cp+','+ps+','+tp+','+tr+')"><span style="color:red">' + cp + '</span></a>';
						}else{
							pi+='<a  onclick="showinfo('+cp+','+ps+','+tp+','+tr+')">' + cp + '</a>';
						}
						
					}
				}
				if(parseInt(pn) < tp){
					pi+='<a  style="margin-left: 10px" onclick="showinfo('+(pn+1>tp?tp:pn+1)+','+ps+','+tp+','+tr+')">下一页</a>';
				}
				pi+='<a  style="margin-left: 5px" onclick="showinfo('+tp+','+ps+','+tp+','+tr+')">尾页</a>';
				pi+='<span class="gy">共' + tp + '页,' + tr + '条记录</span>';
//				pi.join("");
				$("#page").html(pi);
//				showlist(1,15,1,10)
			}else if(code == "1"){
				$("#div1").hide();
				$("#div2").hide();
				$("#div3").show();
			}
			else{
				$("#div1").show();
				$("#div2").hide();
				$("#div3").hide();
			}
		},
		error : function() {
			showTips('您所请求的页面有异常！');
			$("#div2").hide();
			return false;
		}
	});
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