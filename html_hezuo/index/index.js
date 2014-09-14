Class(
		'Application',{
    use: 'tabs,dataInput,mask,countDown',
	ready:true,
	index:function(){

        this.lib.Tabs({
            items: '#todaykaijiang b',
            focusCss: 'cur',
            contents: '#k1,#k2,#k3',
            delay: 300
        });  
		$(".sy_gg ul li").mouseover(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".gg_main div").eq($(".sy_gg ul li").index(this)).show().siblings().hide();
        });    		
    	this.red = [];
        this.blue = [];
        var lotid="01";
        Y.get("div.ksgtab b").click(function(){
    		var val=Y.get(this).attr("mark");
    		 lotid=Y.get(this).attr("lotid");
    		var url="/help/help_ssqjs.html";
    		if(val=="ssq" || val=="dlt"){
    			url="/help/help_"+val+"js.html";
    			$(this).addClass("cur").siblings().removeClass("cur");
    			$("div.ksget div").slice(1,2).hide();
        		$("div[mark="+val+"]").show();
        		$("div.ksgtab a").attr("href",url)
        	
    		}
    	
    		
    	});
    
        this.screen();
      
        this._loadcode();
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

	_loadcode:function(){//查询开奖公告	        	
     	Y.ajax({
    		url : "/cpdata/game/aopencode.json",
    		type : "GET",
    		dataType : "json",
    		cache : false,
    		end  : function (d){
    			var obj = eval("(" + d.text + ")"); 
    			if (obj) {
    				var r = obj.rows.row;        				
    				r.each(function(rt,o) {
    					var row={};
    					row.code = rt.codes;   				
        				row.etime =  rt.et;   		     				
        				row.pools = rt.pools;  
        				row.pools = row.pools==''?'0元':(parseFloat(row.pools).rmb(false, 0) + "元");
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(5,11);
        				row.awardtime=rt.at.substr(5,5);           					
    					if (row.gid=='80'){
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#sfcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#sfc_twomoney").html(row.twomoney);
    						Y.get("#sfc_pid").html(row.pid+"期");		
    						Y.get("#sfc_pools").html(row.pools);	
    						Y.get("#sfc_kjdate").html(row.auditdate);
    						Y.get("#sfc_code").html("<b>"+row.code.split(',').join('</b><b>')+"</b>");			
    					}else if (row.gid=='81'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#renjiumoney").html("任九："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#rxjc_pid").html(row.pid+"期");		
    						
    						Y.get("#rxjc_kjdate").html(row.auditdate);
    						Y.get("#rxjc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
    					}else if (row.gid=='82'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#jqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#jqc_pid").html(row.pid+"期");		
    						Y.get("#jqc_kjdate").html(row.auditdate);
    						Y.get("#jqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');		
    					}else if (row.gid=='83'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
            			
    						Y.get("#bqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						Y.get("#bqc_pid").html(row.pid+"期");		
    						Y.get("#bqc_kjdate").html(row.auditdate);
    						Y.get("#bqc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='50'){	
    						Y.get("#dlt_pid,#topdlt_pid").html(row.pid+"期");		
    						Y.get("#dlt_pools,#topdlt_pools,span[pool=50]").html(row.pools);
    						Y.get("#dlt_kjdate,#topdlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#dlt_code,#topdlt").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						Y.get("#ssq_pid,#topssq_pid").html(row.pid+"期");		
    						Y.get("#ssq_pools,#topssq_pools , span[pool=01]").html(row.pools);
    						
    						Y.get("#ssq_kjdate,#topssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#ssq_code,#topssq").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}else if (row.gid=='03'){	
    						Y.get("#sd_pid").html(row.pid+"期");		
    						Y.get("#sd_pools").html(row.pools);
    						Y.get("#sd_kjdate").html(row.awardtime);
    						Y.get("#sd_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='53'){	
    						Y.get("#pls_pid").html(row.pid+"期");		
    						Y.get("#pls_pools").html(row.pools);
    						Y.get("#pls_kjdate").html(row.awardtime);	
    						Y.get("#pls_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='52'){	
    						Y.get("#plw_pid").html(row.pid+"期");		
    						Y.get("#plw_pools").html(row.pools);
    						Y.get("#plw_kjdate").html(row.awardtime);
    						Y.get("#plw_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='07'){	
    						Y.get("#qlc_pid").html(row.pid+"期");		
    						Y.get("#qlc_pools").html(row.pools);
    						Y.get("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						Y.get("#qlc_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');			
    					}else if (row.gid=='51'){	
    						Y.get("#qxc_pid").html(row.pid+"期");		
    						Y.get("#qxc_pools").html(row.pools);
    						Y.get("#qxc_kjdate").html(row.awardtime);
    						Y.get("#qxc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='54'){	
    						Y.get("#dlc_pid").html(row.pid+"期");		
    						Y.get("#dlc_kjdate").html(row.awardtime);
    						Y.get("#dlc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='85'){	
    						Y.get("#bjdc_pid").html(row.row.pid+"期");		
    						Y.get("#bjdc_kjdate").html(row.awardtime);
    					} 
    				});	     
    				var o = obj.rows.rownow;
    				var d = Y.getDate(d.date).format('YY-MM-DD');
    				o.each(function(rt,o) {
    					var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
    					if(nd==d){
    						
    						$("em[expect="+rt.gid+"]").html(rt.nowpid+"期");
    						$("span[pool="+rt.gid+"]").html(rt.pools);
    						$("div[today="+rt.gid+"]").show();
    					}
    					
    				});
    				
    			}   
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
		dl = $('.jrkjm .jrkjc');
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


