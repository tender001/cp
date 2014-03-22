Class({
    use: 'tabs',
	ready:true,
	index:function(){

        this.lib.Tabs({
            items: '#todaykaijiang b',
            focusCss: 'cur',
            contents: '#k1,#k2,#k3',
            delay: 300
        });           
//        $_sys.gameconfig();
        this.screen();
        this.cpbuy();
	},
	screen:function(){
		$(".cm_screen1_top li").addClass("cm_zhezhao_hover");
		$(".cm_screen1_top li").mouseover(function(){
			$(".cm_screen1_top li").removeClass("cm_zhezhao_hover");
			$(this).addClass("cm_zhezhao_hover");
		});
		$(".cm_screen1_top li").mouseout(function(){
			$(".cm_screen1_top li").addClass("cm_zhezhao_hover");
		});
	},
	 cpbuy:function(){
	    	$("div.ksgtab b").click(function(){
	    		var val=$(this).attr("mark");
	    		var url="/help/help_ssqjs.html";
	    		if(val=="ssq" || val=="dlt"){
	    			url="/help/help_"+val+"js.html";
	    			$(this).addClass("cur").siblings().removeClass("cur");
	    			$("div.ksget div").slice(1,2).hide();
	        		$("div[mark="+val+"]").show();
	        		$("div.ksgtab a").attr("href",url)
	    		}
	    		
	    	});
	    	
	    },
	   
});

(function(B, H, s, f, tp, z, y, c, ul, li, dl, up, dn, e, bt) {
	if(B.mozilla) {
		f -= 5;
	}
	if(B.webkit || B.opera) {
		f -= 5;
	}
	$(function() {
		dl = $('.cm_public_tabtext .scroll_box');
		up = $('#scroll_up');
		dn = $('#scroll_down');
		dl.css('margin-top', tp = 0);
		c = dl.eq(0);
		up.hover(slowUp, clear);
		dn.hover(slowDn, clear);
		up.mousedown(fastUp);
		dn.mousedown(fastDn);
		up.mouseup(slowUp);
		dn.mouseup(slowDn);
	});


	function clear() {
		clearTimeout(e);
	}

	function set(v, h) {
		clear();
		var ci = getc();
		c = dl.eq(ci);
		var ch = c.height();
		h = H - ch - 14;
		if((tp < 0 || v > 0) && (tp > h || v < 0)) {
			tp -= v;
			if(tp <= 0) {
				if(tp < h) {
					tp = h;
				}
			} else {
				tp = 0;
			}
			c.css('margin-top', tp);
			e = setTimeout(function() {
				set(v);
			}, 10);
		}
	}

	function getc() {
		var c = 0;
		$("#todaykaijiang b").each(function(){
			if($(this).hasClass('cur')) {
				c = $(this).attr("ttl");
			}
		});
		return c;
	}	
		
	function slowDn() {
		set(s);
	}

	function fastDn() {
		set(f);
	}

	function slowUp() {
		set(-s);
	}

	function fastUp() {
		set(-f);
	}
})($.browser, 300, 1, 10, 0);


