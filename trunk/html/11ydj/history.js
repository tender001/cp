Class.C('lot_id',56);
Class({
	ready : true,
	use   : 'mask',
	index:function(){
		this.init();
		
		this.onMsg('msg_get_expect_suc', function (expect){
		    this.lib.Loadduizhen(expect);
        });	
		
		this.lib.CountDownGp({
            stop:Y.C('lot_id'),
            lot:Y.C('lot_id')
        });
		this.goTotop();
	},
	
    init: function (){
    	if (location.search.getParam('expect') != "") {
			$("#expect").val(location.search.getParam('expect'));
		}
		this.ajax({
			url : "/cpdata/game/56/index.json?_=" + Math.random(),
			type : "get",
			dataType : "json",
			end  : function (d){
				var obj = eval("(" + d.text + ")");
				var r = obj.rows.row;//period
				var expectlist = [];
				r.each(function(rt,o) {
					var name = rt.name;
				    expectlist[expectlist.length] = [ name];
				});

					var html = "";
					var nowexpect='';
					for ( var i = 0; i < expectlist.length; i++) {
						if (i==0){
							nowexpect=expectlist[i][0];
						}
						html += "<OPTION value=" + expectlist[i][0] + " >" + expectlist[i][0] + "</OPTION>";
					}

					$("#expect_select_div").html('选择日期：<select id="expect_select">'+html+'</select>');	
					
					if ($("#expect").val()==''){
						$("#expect").attr("value",nowexpect);
						$("#expect_select").get(0).selectedIndex=0;
					}else{
						nowexpect=$("#expect").val();
						$("#expect_select option[value="+$("#expect").val()+"]").attr("selected", true);						
					}

					this.get('#expect_select').change( function() {
						var url = location.href.replace(/#.*/, '');
						if (url.indexOf('expect') != -1) {
							url = url.replace(/expect=.+?(?=&|$)/ig, 'expect=' + this.value.split('|')[0]);
						} else if (url.indexOf('?') != -1 && url.indexOf('=') != -1) {
							url += '&expect=' + this.value.split('|')[0];
						} else {
							url += '?expect=' + this.value.split('|')[0];
						}
						location.replace(url);
					} );
					this.postMsg('msg_get_expect_suc',nowexpect);
			},
			error : function() {
				this.alert("网络异常！");
				return false;
			}
		});
		
    },
    goTotop:function (){
        var isIE=!!window.ActiveXObject;
        var isIE6 = isIE&&!window.XMLHttpRequest;
        var btn = $("#goTotop");
        var right = 0;
        var top = $(window).height()-247;
        var ietop = $(window).height()-247+$(window).scrollTop();
        var flag = true;
        $(window).resize(function(){
            btn.css({"position":"fixed",top:top,right:right});
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        });
        btn.css({"position":"fixed",top:top,right:right});
        var areaTop = Y.get("div.newsr").getXY().y;
        
        $(window).scroll(function(){
        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
	            	var V = $('#right_area');
	        		if (V[0]) {
	        			var T = $(document),
	        			H = $("div.num_history").eq(0),
	        			M = H.offset().top + H.outerHeight(),
	        			F = V.innerWidth(),
	        			B = V.offset().top,
	        			L = V.outerHeight(), 
	        			u = T.scrollTop();
	        			Z = Math.min(0, M - (L + u));
	        			
	        			if(H.outerHeight()<V.eq(0).outerHeight()){
//	        				 Y.get("#right_area").setStyle('z-index: 1; top:'+Z+'px;  left: auto;position: static;');
	        				 Y.get("#right_area").setStyle('z-index: 1; top:0;  left: auto;position: static;');
	        			}else{
	        				if (B == Z) {
   	        				V.css({left: "auto", top: "auto",width: F, position: "static"});
   	        			} else {
   	        				if(isIE6){
   	        					V.css({left: "auto",top: Z+$(window).scrollTop(), width: F,position: "absolute"});
   	        				}else{
   	        				V.css({left: "auto",top: Z, width: F, position: "fixed"});
   	        				};
   	        			}
	        				Y.get("#right_area").setStyle('z-index: 1;');
	        			}
	        		}
	            	
	             }else{//停止浮动对齐
            	 Y.get("#right_area").setStyle('z-index: 1; top:0;  left: auto;position: static;');
            }
        	
            if(flag)
            {
                btn.show();
                flag = false;
            }
            if($(this).scrollTop() == 0)
            {
                btn.hide();
                flag = true;
            }
            btn.css({"position":"fixed",top:top,right:right});
            ietop = $(window).height()-247+$(window).scrollTop();
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
    },
    
});
/*------------------------------------------------------------------------------*/
Class('Loadduizhen',{
	index:function(expect){
		this.LoadDuiZhen(expect);
	},
	LoadDuiZhen : function(expect,lotid) {
		var ex = expect.substr(0,8);
		expect = expect.substr(8,2);
		
		if ($("#opencodelist").size()==0){
			return false;
		}		
		this.ajax({
					url : "/cpdata/game/56/day/"+ex+".json",
					type : "GET",
					dataType : "json",
					cache : false,
					end : function(data) {
						 var htmlul = "";
					        htmlul +="<tr><th>期号</th><th>开奖号码</th><th>开奖时间</th></tr>";
					    	$("#opencodelist").html(htmlul);
						var obj = eval("(" + data.text + ")");				
						var r = obj.rows.row;
						r.each(function(rt,o) {
							var pid = rt.pid;//开奖期号
							var codes = rt.codes;// 开奖号码
							var at = rt.at;// 开奖时间	
							htmlul+="<tr><td>"+pid+"期</td>";//获取期次
							htmlul+="<td>"+codes+"</td>";//获取开奖列表
							htmlul+="<td>"+at+"</td></tr>";//获取开奖时间
							$("#opencodelist").html(htmlul);
						});
					},
					error : function() {
						alert("网络异常!");
						return false;
					}
				});
	},
	
});