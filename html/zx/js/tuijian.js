
Class({
	ready: true,
	 use: 'tabs,dataInput,mask,countDown',
    index:function (config){
    	P = this;
    	Y.postMsg('msg_login', function (){
    		P.show()
    	})
    }
	,logoutinfo:function(){
	    location="/";
	}
	,login: function (fn){// 登陆
        this.getLogStart(function (isLogin){
            if (isLogin) {
                this.onlogin();
                acceptLoginMsg();
                fn && fn.call(this);
//                this.show();
            }else{
				
            	if(fn==undefined){fn=Y.C('logininfo');}
                Y.C('loginCallback', fn);
                this.loginDlg.pop();// 弹出登陆框
            }
        });
    }
	,show:function(){
    	
    	
		var expect=[];
        $(".jctj-t tbody tr:even").hover(function(){$(this).addClass("hover").next().addClass("hover")},
                function(){$(this).removeClass("hover").next().removeClass("hover")});
        $(".jctj-t tbody tr:odd").hover(function(){$(this).addClass("hover").prev().addClass("hover")},
                function(){$(this).removeClass("hover").prev().removeClass("hover")});
    
                 var ss;
        $(".jctj-t tbody").find("tr").each(function(o){
			
			expect.push($(this).attr("mark"));
			
        }) 
        expect=$_base_s.uniq(expect).sort().reverse();
        var html='';
		var expectday=new Date().format("YY-MM-DD").replaceAll("-","");
		$("tr[mark]").hide();
		$("tr[mark="+expectday+"]").show();
        if (expect.length>0){
			for ( var i = 0; i < expect.length; i++) {
				
				if(expectday==expect[i]){
					html+='<option value="'+expect[i]+'">'+expect[i]+'</option>';
				}else{
					html+='<option value="'+expect[i]+'">'+expect[i]+'</option>';
				}
				
			}		
		}
        $("#expect").html(html);
        $("#expect").bind({
    		change : function() {
    			var ex=$("#expect").val();
    			$("tr[mark]").hide();
    			$("tr[mark="+ex+"]").show();
    		}
    	});
    },
    getLogStart: function (fn){// 检查是否登陆
        this.ajax(Class.C('url-login-check'), function (data){
            var islogin; 
            if (!data.error) {
				var obj = eval("(" + data.text + ")");
			    islogin = obj.Resp.code;
				if (islogin =="0" ){
                		islogin = true;
                	}else{
                		islogin = false;
                	}
            }
            fn.call(this, !!islogin);
        });
    },
	
});
