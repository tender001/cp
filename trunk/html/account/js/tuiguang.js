Class({
	ready: true,

    index:function (config){
    	var P=this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
    ,logoutinfo:function(){
    	location="/";
    }
	,showinfo:function(){
		Y.ajax({
			url : "/phpu/q.phpx?fid=u_agenturl",
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				if (code == "0") {
					var r = obj.Resp.row;
					if(r.cagentseq == "") Y.alert("您还不是代理，没有推广链接");
					$("#pcurl").val("http://www.159cai.com/"+r.cagentseq);
					$("#murl").val("http://m.159cai.com/"+r.cagentseq);
					$("#qrcode").qrcode({
						render: "table", //table方式
						width: 100, //宽度
						height:100, //高度
						src: 'http://www.159cai.com/images/logo.jpg',
						text: "http://m.159cai.com/"+r.cagentseq //任意内容
					});
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}
				}
			},
			error : function() {
				return false;
			}
		});


	},
	createqrcode:function(){
		
	}
});
