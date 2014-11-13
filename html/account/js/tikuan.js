/**
 * 提款
 */

Class({
	ready: true,

    index:function (config){
    	P = this;
    	 Y.C('logininfo',this.showinfo);
	     Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
		location="/";
	}
	
	,setdata:function(){
		P = this;
		this.get('#submit').click(function (){
			if ($.trim($("#realname").val()) == "") {
				$("#realname").focus();
				Y.alert("请填写真实姓名");
				return false;
			}
			if ($.trim($("#tkmoney").val()) == "") {
				$("#tkmoney").focus();
				Y.alert("请输入提款金额");
				return false;
			}
			var m=$.trim($("#tkmoney").val());
			if(!IsNum(m)){
				Y.alert("请输入您要提款的金额");
				return false;
			}
			
			if($("#mn").val()>=10 && $.trim($("#tkmoney").val())<10){
				alert("提款金额至少为10元");
				return false;
			}
			
			if($("#mn").val()<10 && $("#tkmoney").val()<1){
				alert("对不起，提款金额低于1元无法转账。");
				return false;
			}
			
			if($("#mn").val()<10 && $("#mn").val()!=$.trim($("#tkmoney").val())){
				alert("可提款的金额少于10元，请一次提清。");
				return false;
			}
			var data = "";
			data = $_user.key.realName + "=" + encodeURIComponent($.trim($("#realname").val())) + 
			"&" + $_user.key.tkMoney + "=" + encodeURIComponent($.trim($("#tkmoney").val())) + 
			"&" + $_user.key.tkType + "=0&rnd="	+ Math.random();

			Y.ajax({
				url : $_user.url.drawmoney,
				type : "POST",
				dataType : "json",
				data : data,
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var code = obj.Resp.code;
					var desc = obj.Resp.desc;
					Y.get("#tmoney").html();
					if (code == "0") {
						Y.get("#div3").hide();
						Y.get("#div4").show();
					} else {
						if (code=="1"&&desc=="用户未登录"){
							Y.postMsg('msg_login', function() {						
								window.location.reload();			
							});
						}else{
							Y.alert(desc);
						}
					}
					$("#realname").val("");
					$("#tkmoney").val("");
				},
				error : function() {
					Y.alert("您所请求的页面有异常！");
					return false;
				}
			});
		});
	}
	
	,checkrealname:function(){
		Y.ajax({
			url : $_user.url.safe,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {	
					var r= obj.Resp.row;
					var rname = r.rname;
					if (rname == "") {
						Y.get("#div3").hide();
						Y.get("#div1").show();
					}			
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}			
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
				return false;
			}
		});	
	}
	
	,showinfo:function(){
		Y.ajax({
			url : $_user.url.card,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {
					var r = obj.Resp.row;
					var code = r.code;
					var name = r.name;
					var prov = r.prov;
					var city = r.city;
					var card = r.card;
					var alipay = r.alipay;

					if (card == "") {
						Y.get("#div2").show();
					} else {
						Y.get("#div3").show();
						P.checkrealname();
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
						if (bname != "") {
							$("#cardname").html(bname+" "+prov+","+city+","+name);
						}else{
							$("#cardname").html(prov+","+city+","+name);
						}
						$("#card").html(card);
						P.setdata();
					}
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
				return false;
			}
		});
		Y.ajax({
			url : $_user.url.ktkmoney,
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc;
				if (code == "0") {
					var r =obj.Resp.row;
					var nickid = r.cnickid;
					var usermoeny = r.ibalance;
					var rmoney = r.rmoney;
					$("#nickid").html(nickid);
					$("#mn").val(usermoeny);
					$("#usermoeny").html(parseFloat(usermoeny).rmb(true,2));
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						Y.alert(desc);
					}
				}
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
				return false;
			}
		});
	}
});

var IsNum=function(s){
    if (s!=null && s!=""){
        return !isNaN(s);
    }
    return false;
};

