Class(
		'Application',{
    use: 'tabs,dataInput,mask,countDown',
	ready:true,
	index:function(config){
		this.bindOther();
		this.Qbuy();
		this.carousel();//焦点图滚动
        this.screen();
        this._loadcode();
        this.selectProject();
        this.listHotProject(1, 8, "table_hot_project");
	},
	selectProject : function(){
		var P=this;
		$(".hm .tit span").click(function(){
        	var a=$(this).index();
			$(this).addClass("hover").siblings("span").removeClass("hover");
			$(".hm .body").eq(a).addClass("hover").siblings(".body").removeClass("hover");
			if($(this).attr("id") == "00") {
				P.listHotProject(1, 8, "table_hot_project");
			}else{
				P.loadGameProj(1, 8, $(this).attr("id"),$(this).attr("expect"));
			}
		});
	},
	bindOther:function(){
		$("#scrollDiv").textSlider({
			line:2,
			speed:1000,
			timer:2000
		});
		Y.use('mask',function(){
			Y.loading = Y.lib.MaskLay();
			Y.loading.noMask = true;
			var dlg_buy_end = Y.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
			dlg_buy_end.addClose('#dlg_buysuc_back','#dlg_buysuc_close','#dlg_buysuc_close2');
			Y.extend('popBuyOk', function(user,lotid,projid){
				$('#dlg_buysuc_view').die().live('click', function(){
					window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;
				});
				dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
			});
		});
		Y.use('mask', function(){
			var addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
			addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
			Y.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
			Y.extend('addMoney', function(){
				addMoneyDlg.pop('', function(e, btn){
					if(btn.id === 'addMoneyYes'){
						window.open($_user.daohang.addmoney);
					}			
				});
			});
		}); 
	},
    carousel:function(){
		var sWidth = $("#flash_outer").width(); 
		var len = $("#flash_num span").length; 
		var index = 0;
		var picTimer;
		$("#focus .btnBg").css("opacity",0.8);
		$("#flash_num span").css("opacity",0.4).mouseover(function() {
			index = $("#flash_num span").index(this);
			showPics(index);
		}).eq(0).trigger("mouseover");
		$("#focus .preNext").css("opacity",0.2).hover(function() {
			$(this).stop(true,false).animate({"opacity":"0.8"},300);
		},function() {
			$(this).stop(true,false).animate({"opacity":"0.2"},300);
		});
		$("#flash_outer").hover(function() {
			$("#flash_outer i").css("display","block");
		},function() {
			$("#flash_outer i").css("display","none");
		});
		$("#flash_outer .prev").click(function() {
			index -= 1;
			if(index == -1) {index = len - 1;}
			showPics(index);
		});
		$("#flash_outer .next").click(function() {
			index += 1;
			if(index == len) {index = 0;}
			showPics(index);
		});
		$("#flash_outer i").hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		})
		$("#flash_pic").css("width",(sWidth) * (len));
		$("#flash_pic").css("position","absolute");
		$("#flash_outer").hover(function() {
			clearInterval(picTimer);
		},function() {
			picTimer = setInterval(function() {
				showPics(index);
				index++;
				if(index == len) {index = 0;}
			},3000); //自动播放的间隔
		}).trigger("mouseleave");
		function showPics(index) { 
			var nowLeft = -index*sWidth; 
			$("#flash_pic").stop(true,false).animate({"left":nowLeft},300); 
			$("#flash_num span").stop(true,false).animate({"opacity":"0.6"},300).removeClass("ddd").eq(index).stop(true,false).animate({"opacity":"1"},300).addClass("ddd"); 
		}
    },
    loadGameProj : function(pn, ps, toId,expect){
//    	var data={gid:Class.C('lotid'), pid:Class.C("expect"), state:Class.C("state"), find:Class.C("findstr"), fsort:Class.C("fsort"), dsort:Class.C("dsort"), ps:Class.C("ps"), pn:Class.C("pn")};
    	var state=(toId=="01"||toId=="50"||toId=="81")?"0":"1";
    	var data="gid="+toId+"&pid="+expect+"&state="+state+"&find=&fsort=jindu&dsort=descending&ps=8&pn=1";
    	Y.ajax({
			url : $_trade.url.plist,
			type : "POST",
			dataType : "json",
			data :data,
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.xml;
				var html="";
				if(rb){
					rb = !!obj.Resp.xml.row;
				}
				if(code == 0){
					if(rb){
						r = obj.Resp.xml.row;
						//var _pagei = obj.Resp.xml.recordcount;
						
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid =rt.cprojid.substr(2,2);
							var odd=o%2==0?"":"odd";
							html += '<tr id='+(o+1)+' class = '+odd+'  >';
//							html += '<td>';
//							if(rt.iorder > 0 && rt.jindu != 100){
//								html += '<img src="/images/index_93.gif" />';
//							}else{
//								html += (o+1);
//							}
//							html += '</td>';
							html += '<td style="padding-left:15px">' + $_sys.showzhanjiname(gameid,rt.cnickid,'award')+ '</td>';
							html += '<td class="tdmark">' + ($_sys.showzhanji(rt.aunum ,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.cnickid,rt.aunum,rt.agnum)) + '</td>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<em>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</em>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td style="text-align:right"><em>' + rt.lnum + '元</em>&nbsp;&nbsp;</td>';
							if(rt.lnum == 0 || rt.istate != 1){
								if(rt.istate > 2){
									html += '<td style="text-align:center">已撤单</td>';
								}else if(rt.istate == 2){
									html += '<td style="text-align:center">已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td style="text-align:center"><div><input type="text" value="1" id="rengou_' + rt.nid + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.cprojid+'\',\'rengou_' + rt.nid +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.cprojid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
						});
					}
//					$(html).appendTo($("#" + toId));
					$("#table_hot_project").html(html)
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	},
	listHotProject:function(pn, ps, toId){
		Y.ajax({
			url : $_trade.url.hlist,
			type : "POST",
			dataType : "json",
			data : {
				pn : pn,
				ps : ps
			},
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.row;
				var html="";
				if(code == 0){
					if(rb){
						r = obj.Resp.row;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = rt.gid;
							var odd=o%2==0?"":"odd";
							 html += '<tr id='+(o+1)+' class='+odd+'>';
//							html += '<td>';
//							if(rt.iorder > 0 && rt.jindu != 100){
//								html += '<img src="/images/index_93.gif" />';
//							}else{
//								html += (o+1);
//							}
//							html += '</td>';
							html += '<td style="padding-left:15px">' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</td>';
							html += '<td>' + ($_sys.showzhanji(rt.aunum ,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum)) + '</td>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<em>(保' + (rt.pnum*100/rt.nums).toFixed(0) + '%)</em>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td style="text-align:right"><em>' + rt.lnum + '元</em>&nbsp;&nbsp;</td>';
							if(rt.lnum == 0 || rt.state != 1){
								if(rt.state > 2){
									html += '<td style="text-align:center">已撤单</td>';
								}else if(rt.state == 2){
									html += '<td style="text-align:center">已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td style="text-align:center"><div class="shouye"><input type="text" value="1" id="hot_rengou_' + (o+1) + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'hot_rengou_' + (o+1) +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
//							$(html).appendTo($("#" + toId));
							$("#table_hot_project").html(html)
						});
					}
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	},
	Qbuy:function(){
		 this.lib.Tabs({
	            items: '#todaykaijiang span',
	            focusCss: 'hover',
	            contents: '#k1,#k2,#k3',
	            delay: 300
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
	    			$("div.ksget div").slice(1).hide();
	        		$("div[mark="+val+"]").show();
	        		$("div.ksgtab a").attr("href",url)
	        	
	    		}
	    	
	    		
	    	});
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
        				row.pools = row.pools==''?'0':(parseFloat(row.pools).rmb(false, 0) + "");
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(5,11);
        				row.awardtime=rt.at.substr(5,5);           					
//    					$("span[mark="+gid+"]").attr("expect",row.pid);
        				if (row.gid=='80'){
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = (row.money[0] == ''||row.money[0] ===undefined)?'0':(parseFloat(row.money[0]).rmb(false,0));
    						row.twonum = (row.nums[1] == '' ||row.nums[1]  ===undefined)?'0':(parseFloat(row.nums[1]).rmb(false,0));
    						row.twomoney =(row.money[1] == ''||row.money[1] ===undefined)?'0':(parseFloat(row.money[1]).rmb(false,0));
            			
    						Y.get("#sfcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						if(row.twonum=="" || row.twomoney==""||row.twomoney===undefined||row.twonum===undefined){
    							Y.get("#sfc_twomoney").html("二等奖：0注0元"); 
    						}else{
    							Y.get("#sfc_twomoney").html("二等奖："+row.twonum+"注"+row.twomoney+"元");
    						}
						

    						Y.get("#sfc_pid").html(row.pid+"期");	
    						
    						Y.get("#sfc_pools").html(row.pools);	
    						Y.get("#sfc_kjdate").html(row.auditdate);
    						Y.get("#sfc_code").html("<b>"+row.code.split(',').join('</b><b>')+"</b>");			
    					}else if (row.gid=='81'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]).rmb(false,0));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]).rmb(false,0));
    						Y.get("#sfcrj_pools").html(row.pools);
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
    					$("i[expect="+rt.gid+"]").html(rt.nowpid+"期");
    					$("#"+rt.gid+"").attr("expect",rt.nowpid);
						$("span[nowendtime="+rt.gid+"]").html(rt.nowendtime);
						$("span[pool="+rt.gid+"]").html(rt.pools);
    					if(nd==d){
    						$("li[today="+rt.gid+"]").show();
    					}
    					
    				});
    				
    			}   
    		}
    	}); 
    }
});
(function(B, H, s, f, tp, z, y, c, ul, li, dl, up, dn, e, bt) {
	if(B.mozilla) {
		f -= 5;
	}
	if(B.webkit || B.opera) {
		f -= 5;
	}
	$(function() {
		dl = $('#kjdiv div[mark=kj]');
//		dl = $('.jrkjm .jrkjc');
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
		$("#todaykaijiang span").each(function(){
			if($(this).hasClass('hover')) {
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

$.fn.textSlider = function(settings){    
    settings = jQuery.extend({
        speed : "normal",
        line : 2,
        timer : 3000
    }, settings);
    return this.each(function() {
        $.fn.textSlider.scllor( $( this ), settings );
    });
};
$.fn.textSlider.scllor = function($this, settings){
    var ul = $("table:eq(0)",$this );
    var timerID;
    var li = ul.find("tr");
    var liHight=$(li[0]).height();
    var upHeight=0-settings.line*liHight;//滚动的高度；
    var scrollUp=function(){
        ul.animate({marginTop:upHeight},settings.speed,function(){
            for(i=0;i<settings.line;i++){
                ul.find("tr:first",$this).appendTo(ul);
            }
            ul.css({marginTop:0});
        });
    };
    var autoPlay=function(){
        timerID = window.setInterval(scrollUp,settings.timer);
    };
	rengou = function(lotid,projid,id,lnum){
		Y.postMsg('msg_login', function (){
			var buynum = $("#" + id).val();
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				return false;
			}
			
			if(Y.getInt(buynum) > lnum){
				Y.alert('您好，认购份数不能大于剩余份数！');
				return false;
			}
			
			dobuy = function(){
				Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
		    	Y.postMsg('msg_login', function (){	
			        Y.ajax(
			        {
						 url: $_trade.url.pjoin,
						 type:'POST',
						 data:{
							gid:lotid,
							hid:projid,
							bnum:buynum
						 },
			            end:function(d)
			            {
			            	var obj = eval("(" + d.text + ")");
		  					var code = obj.Resp.code;
		  					var desc = obj.Resp.desc; 
		        			Y.alert.close();
		        			if (code == "0") {        				
		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
//		        				page(Class.C("pn"));
		        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
		        			} else {
		        				if (code=="6"){
		        					Y.addMoney();
		        				}else{
		        					Y.alert('对不起，认购失败,请重新认购！'+desc);
		        				}
		        				
		        			}
			            },
		        		error : function() {
		        			Y.alert("网络故障, 请检查您的帐户再重新投注!");
		        			return false;
		        		}
			        });   
		    	});
			};
			Y.confirm("您好，本次认购金额为"+buynum+"元，请确认！",dobuy,''); 
		});
	};
    var autoStop = function(){
        window.clearInterval(timerID);
    };
    //事件绑定
    ul.hover(autoStop,autoPlay).mouseout();
};