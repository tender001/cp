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
			url : "/phpu/q.phpx?fid=u_agenturl",
			type : "POST",
			dataType : "json",
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				if (code == "0") {
					var r = obj.Resp.row;
					if(r.cagentseq == "") Y.alert("您还不是代理，没有推广链接");
					$(".tgdiv > input").val("http://www.159cai.com/"+r.cagentseq);
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


	}
});
