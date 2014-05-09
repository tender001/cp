/**
 * 安全中心
 */

Class({
	ready: true,

    index:function (config){
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
    ,logoutinfo:function(){
    	location="/";
    }
	,showinfo:function(){
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
					var safe=0;
					var pwd = r.pwd;
					var isprot =r.isprot;
					var rname =r.rname;
					var idcard =r.idcard;
					var bank = r.bank;
					
					var mobbind = r.mobbind;				
					
					var mailbind =r.mailbind;
					
					if (isprot==1){
						$("#isprot").removeClass().addClass("bd");
					}else{
						$("#isprot").removeClass().addClass("xg");
						$("#isprot_i").removeClass().addClass("password_cur");
						safe+=1;
					}

					if(rname.length>2 && idcard.length>10){
						$("#rname").removeClass().addClass("y_bd");
						$("#rname_i").removeClass().addClass("card_cur");
						safe+=1;
					}
					
					if(bank.length>10){
						$("#bank").removeClass().addClass("xg");
						$("#bank_i").removeClass().addClass("bank_cur");
						safe+=1;
					}else{
						$("#bank").removeClass().addClass("bd");
					}
					
					if (mobbind==0){
						$("#mobbind").removeClass().addClass("bd");
					}else{
						$("#mobbind").removeClass().addClass("xg");
						$("#mobbind_i").removeClass().addClass("phone_cur");
						safe+=1;
					}
					
					if (mailbind==0){
						$("#mailbind").removeClass().addClass("bd");
					}else{
						$("#mailbind").removeClass().addClass("xg");
						$("#mailbind_i").removeClass().addClass("mail_cur");
						safe+=1;
					}
					
					if (safe==0){
						cascade = "差";
						caspaint = "0";
					}else if (safe==1){
						cascade = "低";
						caspaint = "20";
					}else if (safe==2){
						cascade = "中低";
						caspaint = "40";
					}else if (safe==3){
						cascade = "中";
						caspaint = "60";
					}else if (safe==4){
						cascade = "中高";
						caspaint = "80";
					}else if (safe==5){
						cascade = "高";
						caspaint = "100";
					}
				   this.get("#djimg").attr("style","width:"+caspaint+"%"); 
				   this.get('#dj').html(cascade);
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



