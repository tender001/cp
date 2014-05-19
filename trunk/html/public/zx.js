    Class({
        ready: true,
	
		index:function (){
			
			 this.goTotop();
		
        },
        
    
    	goTotop:function (){
            var isIE=!!window.ActiveXObject;
            var isIE6 = isIE&&!window.XMLHttpRequest;
            var btn = $("a.back_top");
            var right = 0;
            var top = $(window).height()-247;
            var ietop = $(window).height()-247+$(window).scrollTop();
            var flag = true;
            $(window).resize(function(){
                btn.css({"position":"fixed",top:top,right:right});
                if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
            })
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
    	        				}
    	        			}
    	        			Y.get("#right_area").setStyle('z-index: 1;');
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
        }
     
    }); 