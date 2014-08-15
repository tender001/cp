  Class({
        ready: true,
	
		index:function (){
			this.otherEven();
			 this.goTotop();
		
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
    	        			H = $("div.news_left").eq(0),
    	        			M = H.offset().top + H.outerHeight(),
    	        			F = V.innerWidth(),
    	        			B = V.offset().top,
    	        			L = V.outerHeight(), 
    	        			u = T.scrollTop();
    	        			Z = Math.min(0, M - (L + u));
    	        			
    	        			if (B == Z) {
    	        				V.css({left: "auto", top: "auto",width: F, position: "static"});
    	        			} else {
    	        				if(isIE6){
    	        					V.css({left: "auto",top: Z+$(window).scrollTop(), width: F,position: "absolute"});
    	        				}else{
    	        				V.css({left: "auto",top: Z, width: F, position: "fixed"});
    	        				};
    	        			}
    	        			/*if(Z < 0){
    	        				 Y.get("#right_area").setStyle('z-index: 1; top:"auto";  left: auto;position: static;');
    	        			}*/
    	        			Y.get("#right_area").setStyle('z-index: 1;');
    	        		};
    	            	
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
            });
        },
        otherEven:function(){

        	$("#nav_main,#zq_xl,#bf_xl").css({
        		"height":0,
        		"overflow":"hidden"
        		});
        	$(".nav_re h2,#nav_main").hover(function(){
        		$("#nav_main").find("#nav_main").show();
    			$("#nav_main").clearQueue().animate({
    				height:640
    				});
    		},function(){
    			$("#nav_main").animate({
    				height:0
    				});
    		});
        	$("li.zqzx,#zq_xl").hover(function(){
        		$("#zq_xl").find("#zq_xl").show();
    			$("#zq_xl").clearQueue().animate({
    				height:90
    				});
    		},function(){
    			$("#zq_xl").animate({
    				height:0
    				});
    		});
        	$("li.bfzb,#bf_xl").hover(function(){
        		$("#bf_xl").find("#bf_xl").show();
    			$("#bf_xl").clearQueue().animate({
    				height:125
    				});
    		},function(){
    			$("#bf_xl").animate({
    				height:0
    				});
    		});
    		 
       
    		

        
        },
    	loadPeriod : function(){
			Y.ajax({				
				url : "data/game/aopencode.json?rnd=" + Math.random(),
				type : "get",
				cache:false,
				dataType : "json",
				end : function(data) {
					var obj = eval("(" + data.text + ")");
					var r = obj.rows.rownow;
					var d = Y.getDate(data.date).format('YY-MM-DD');
					r.each(function(rt,o) {
						var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
						if(nd==d){
							
							$('.todaykj a[id='+rt.gid+']').show().addClass("a1");
						}else{
							
							$('.todaykj a[id='+rt.gid+']').hide();
						}
						if(Class.C('lotid') == rt.gid){
							Class.C('nowpid', rt.nowpid);
						};
					});
				},
				error : function() {
					this.alert("       !");
					return false;
				}
			});
	}
     
    });