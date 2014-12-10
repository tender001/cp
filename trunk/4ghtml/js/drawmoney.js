function card(){
	$.ajax({
		url : $_user.url.card,
		type : "POST",
		dataType : "json",
		success : function(xml) {
			var R = xml.Resp;
			var code = R.code;
			if (code == "0") {	
				var r= R.row;
				var code = r.code;
				var name = r.name;
				var prov = r.prov;
				var city = r.city;
				var card = r.card;
				if(name ==""){
					$("#div1").show();
					$("#div2").hide();
				}else{
					
					var bname="";
					switch (code){					
					case "1":
						bname="招商银行";
						break;
					case "2":
						bname="工商银行";
						break;
					case "3":
						bname="建设银行";
						break;
					case "4":
						bname="中国银行";
						break;
					case "5":
						bname="中国人民银行";
						break;
					case "6":
						bname="交通银行";
						break;
					case "8":
						bname="中信银行";
						break;
					case "9":
						bname="兴业银行";
						break;
					case "10":
						bname="光大银行";
						break;
					case "12":
						bname="中国民生银行";
						break;
					case "13":
						bname="中国农业银行";
						break;
					case "15":
						bname="农村信用合作社";
						break;
					case "25":
						bname="中国邮政储蓄银行";
						break;
					case "1000":
						bname="广东发展银行";
						break;
					case "1001":
						bname="深圳发展银行";
						break;
					case "4000":
						bname="上海浦东发展银行";
						break;
					case "4001":
						bname="上海银行";
						break;
					default:
						break;
					}
					$("#bank").html("&nbsp;"+bname);
					$("#tkcard").html(card);
					$.ajax({
						url : $_user.url.ktkmoney,
						type : "POST",
						dataType : "json",
						success : function(xml) {
							var R = xml.Resp;
							var code = R.code;
							var desc = R.desc;
							if (code == "0") {
								var r = R.row;
								var usermoeny = r.ibalance;
								$("#mn").html(usermoeny);
								$("#yue").html(parseFloat(usermoeny).rmb(true,2));
							} else {
								showTips(desc);
							}
						},
						error : function() {
							showTips('您所请求的页面有异常！');
							return false;
						}
					});
					$("#div1").hide();
					$("#div2").show();
				}
			} else if(code =="1"){
				$("#div1").hide();
				$("#div2").hide();
				$("#div3").show();
			}else{
				$("#div1").show();
				$("#div2").hide();
				showTips(desc);
			}
		},
		error : function() {
			showTips('您所请求的页面有异常！');
			return false;
		}
	});
}





function tikuan(){
	
//	showTips($("#mn").html());
		if ($.trim($("#txtRealName").val()) == "") {
			$("#txtRealName").focus();
			showTips('请填写真实姓名');
			return false;
		}
		if ($.trim($("#txtDrawMoney").val()) == "") {
			$("#txtDrawMoney").focus();
			showTips('请输入提款金额');
			return false;
		}
		var m=$.trim($("#txtDrawMoney").val());
		if(isNaN(m)){
			showTips('请输入您要提款的金额');
			return false;
		}
		
		if($("#mn").html()>=10 && $.trim($("#txtDrawMoney").val())<10){
			showTips('提款金额至少为10元');
			return false;
		}
		if($("#mn").html()>=1 && $("#mn").html()<10 && $("#mn").html()!=$.trim($("#txtDrawMoney").val())){
			showTips('可提款的金额少于10元，请一次性提清。');
			return false;
		}
		
		if($("#mn").html()<1){
			showTips('亲，暂不接受1元以下的提款申请哦。');
			return false;
		}
		
		var data = "";
		var tkfs = 0; 
		data = $_user.key.realName + "=" + encodeURIComponent($.trim($("#txtRealName").val())) + 
		"&" + $_user.key.tkMoney + "=" + encodeURIComponent($.trim($("#txtDrawMoney").val())) + 
		"&" + $_user.key.tkType + "=" + tkfs + 
		"&rnd="	+ Math.random();

		$.ajax({
			url : $_user.url.drawmoney,
			type : "POST",
			dataType : "json",
			data : data,
			success : function(xml) {
				var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
				if (code == "0") {
					var result="tikuan"
	    			location.href="/user/showresult.html?result="+result;
				} else {
					if (code=="1"&&desc=="用户未登录"){
						$("#div1").hide();
						$("#div2").hide();
						$("#div3").show();
					}else{
						showTips(desc);
					}
				}
				$("#txtRealName").val("");
				$("#txtDrawMoney").val("");
				//P.showinfo();
			},
			error : function() {
				showTips('您所请求的页面有异常！');
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