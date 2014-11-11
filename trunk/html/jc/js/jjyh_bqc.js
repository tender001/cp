/*----------------------------------------------------------------------------*
 * 竞彩足球奖金优化   
------------------------------------------------------------------------------*/

$_sys.bqc = [];
$_sys.bqc.push([ 0, "3-3" ]);
$_sys.bqc.push([ 1, "3-1" ]);
$_sys.bqc.push([ 2, "3-0" ]);
$_sys.bqc.push([ 3, "1-3" ]);
$_sys.bqc.push([ 4, "1-1" ]);
$_sys.bqc.push([ 5, "1-0" ]);
$_sys.bqc.push([ 6, "0-3" ]);
$_sys.bqc.push([ 7, "0-1" ]);
$_sys.bqc.push([ 8, "0-0" ]);
$_sys.getbqcindex = function(f,n) {
	if (typeof(n)=='undefined'){n=1;};
	for ( var i = 0; i < $_sys.bqc.length; i++) {
		if ($_sys.bqc[i][1] == f) {
			return $_sys.bqc[i][n];
		}
	}
};
Class( {
	ready : true,
	use   : 'mask',
	index:function(){
		P=this;
		var codes=location.search.getParam('code');
    	var totalmoney=location.search.getParam('tmoney');
    	var gg = location.search.getParam('pnum');
    	
    	this.get("#tmoney").val(totalmoney);
		this.LoadDuiZhen(codes,totalmoney/2,0,gg);
		this.get("#yhzs").html(totalmoney/2);
		this.get("#sjmm").html(totalmoney);
		
		var yhtyp = "0";
		
		
		setTimeout(function() {
			P.getHeaderW();
			P.betFooterLocate("betbottom", "jjTjObj", "yhBet");
			},300);
		
		this.get('em[yhtype]').click(function (e, Y){
			if($("#tmoney").val()%2!=0){
				alert("输入计划购买的金额必须是偶数");
				return false;
			}
			yhtyp = Y.get(this).attr("yhtype");		
			Y.get('em[yhtype]').removeClass("cur");
			Y.get(this).addClass("cur");
			Y.LoadDuiZhen(codes,Y.get("#tmoney").val()/2,yhtyp,gg);
		});
		this.get("#tmoney").keydown(function (e, Y){
			Y.get("em[yhtype]").removeClass("cur");
			Y.get("td[yhzs]").html(0);
			Y.get("input[yhjj]").val(0);
			P.setMinMaxMoney();
			return false;
		});
		this.get("a[mark=m_minus]").click(function(){
			var tmoney=Y.get("#tmoney").val()*1;
			if(tmoney>2){
				tmoney%2!=0?Y.get("#tmoney").val(tmoney-1):Y.get("#tmoney").val(tmoney-2);
				Y.get("em[yhtype]").removeClass("cur");
				$("td[yhzs],#sjm").html(0);
				Y.get("input[yhjj]").val(0);
				P.setMinMaxMoney();
				return false;
			}
		});
		this.get("a[mark=b_minus]").click(function(){
			var bs=Y.get("#bs").val()*1;
			if(bs>1){
				P.bschange(bs-1)
			}
		})
		this.get("a[mark=b_add]").click(function(){
			var bs=Y.get("#bs").val()*1;
			P.bschange(bs+1)
			
		})
		this.get("#bs").change(function(){
			var bs=Y.get("#bs").val()*1;
			P.bschange(bs);
			
		})
		
		this.get("a[mark=m_add]").click(function(){
			var tmoney=Y.get("#tmoney").val()*1;
			if(tmoney<2000000){
				tmoney%2!=0?Y.get("#tmoney").val(tmoney+1):Y.get("#tmoney").val(tmoney+2);
				Y.get("em[yhtype]").removeClass("cur");
				$("td[yhzs],#sjmm").html(0);
				Y.get("input[yhjj]").val(0);
				P.setMinMaxMoney();
				return false;
			}
		});
		
		this.get("#btnSubmit").click(function(e, Y){
			var num = parseInt(Y.get("#cnum").html());
			var s = "";
			for ( var i=1;i<=num;i++) {
				var muli = Y.get("#txtm" + i).html();
				var cccc = Y.get("#mc" + i).html();
				if ( muli > 0 ) {
					s += 'BQC|' + cccc + "_" + muli + ";";
				}
			}			

			 Y.get('#content').val(s);
			 Y.get('#ishm').val("0");//代购
			 Y.get('#gid').val('92');
			 Y.get('#yhtyp').val(yhtyp);//优化方式
			 Y.get('#old_codes').val(codes);//优化原单
			 Y.get("#project_form").attr("action", "/phpt/jc/step_10.phpx");
			 Y.get("#project_form").attr("method", 'post');
			 Y.get("#project_form").doProp('submit');
		});
		
		
		this.get("#btnSubmit1").click(function(e, Y){
			var num = parseInt(Y.get("#cnum").html());
			var s = "";
			for ( var i=1;i<=num;i++) {
				var muli = Y.get("#txtm" + i).html();
				var cccc = Y.get("#mc" + i).html();
				if ( muli > 0 ) {
					s += 'BQC|' + cccc + "_" + muli + ";";
				}
			}			

			 Y.get('#content').val(s);
			 Y.get('#ishm').val("1");//合买
			 Y.get('#gid').val('92');
			 Y.get('#yhtyp').val(yhtyp);//优化方式
			 Y.get('#old_codes').val(codes);//优化原单
			 Y.get("#project_form").attr("action", "/phpt/jc/step_9.phpx");
			 Y.get("#project_form").attr("method", 'post');
			 Y.get("#project_form").doProp('submit');
			
		});
	},
	
	
	
    LoadDuiZhen : function(c,m,t,gg) {
		this.ajax({
					url : "/phpt/jjyh.phpx",
					type : "POST",
					dataType : "json",
					data : "pid=bqc&codes="+encodeURIComponent(c)+"&muli="+m + "&type=" + t + "&pnum=" + gg,
					end : function(d) {
						var obj = eval("(" + d.text + ")");
						var code = obj.Resp.code;
						var desc = obj.Resp.desc;
						if (code == "0") {
						    P.getduizhen(d);	
						 
						    
						    Y.get("#sjmm").html(obj.Resp.optimize.tmony);
						}else{
							Y.alert(desc);
						}
					},
					error : function() {
						alert("网络故障!");
						return false;
					}
				});
	},
	
	setMinMaxMoney: function() {
		
		var num = parseInt(Y.get("#cnum").html());
		var sjmm = parseInt(Y.get("#sjmm").html());
		
		var tabonus = [];
		var htmRow = [];

		for ( var i=1;i<=num;i++) {
			tabonus[tabonus.length] = Y.get("#yhjj"+ i).val() - 0;
		}
		
		tabonus.sort(function(a,b){return a>b?1:-1;});

		
		
		var rr = this.xxx ;
		if(rr.znum == 1){

			var mmin = 0;
			var mmax = 0;
			var count = rr.znum;
			for (var i=0;i<count;i++) {
				mmin += tabonus[i];
			}
			for (var i=tabonus.length-count;i<tabonus.length;i++) {
				mmax += tabonus[i];;
			}
			mmin== undefined?rr.mmin=rr.mmin:rr.mmin= mmin.toFixed(2);
			mmax== undefined?rr.mmax=rr.mmax:rr.mmax= mmax.toFixed(2);
			Y.get("#mmin").html(mmin+"~");
			Y.get("#mmax").html(mmax);
			
		}else{
			rr.each(function(rw,o) {
				var mmin = 0;
				var mmax = 0;

				var count = rw.znum;
				for (var i=0;i<count;i++) {
					mmin += tabonus[i];
				}
				for (var i=tabonus.length-count;i<tabonus.length;i++) {
					mmax += tabonus[i];;
				}
				rw.mmin = mmin.toFixed(2);
				rw.mmax = mmax.toFixed(2);
			})
			
			Y.get("#mmin").html(rr[rr.length-1].mmin+"~");
			Y.get("#mmax").html(rr[0].mmax);

		}
	},
	
	betStyleUpdate : function(data) {
//		betStyleObj = "";
		var betTrObj=$("#vsTable tr")
		var dataArr = data.split(",");
		for (var i = 0,
		ilen = betTrObj.length; i < ilen; i++) {
			var dataTeamval = betTrObj.eq(i).attr("teamval");
			for (var d = 0,
			dlen = dataArr.length; d < dlen; d++) {
				var betData = dataArr[d].split("=");
				if (Number(dataTeamval) == Number(dataArr[d].split("=")[0])) {
					var BetObj = betTrObj.eq(i).find("em[data-val=\"" + (dataArr[d].split("=")[1]) + "\"]");
					var LotteryType = $("#LotteryType").val();
					if (LotteryType == "SportteryBasketMix" || LotteryType == "SportterySoccerMix") {
						BetObj.addClass("widthxuanxbg");
					} else {
						
					}
					BetObj.addClass("pad-red");

				}
			}
		}
	},
	
	incMulity : function(m) {
		var num = parseInt(Y.get("#txtm" + m).html());
		num = num + 1;
		Y.get("#txtm" + m).html(num);
		var sbonuns = Y.get("#tbonus" + m).html();
		Y.get("#yhjj" + m).val((sbonuns * num).toFixed(2));
		Y.get("#sjmm").html(parseInt(Y.get("#sjmm").html())+2);
		P.setMinMaxMoney();
		return false;
	},
	decMulity : function(m) {
		var num = parseInt(Y.get("#txtm" + m).html());
		if ( num > 0) {
			num = num - 1;
			Y.get("#txtm" + m).html(num);
			var sbonuns = Y.get("#tbonus" + m).html();
			Y.get("#yhjj" + m).val((sbonuns * num).toFixed(2));
			Y.get("#sjmm").html(parseInt(Y.get("#sjmm").html())-2);
			P.setMinMaxMoney();
		}
		return false;
	},
    
	numChange : function(m) {
		var num = 0;
		if ( !isNaN(Y.get("#yhjj" + m).val()) ) {
			num = Math.ceil(Y.get("#yhjj" + m).val()/Y.get("#tbonus" + m).html());
		}
		Y.get("#txtm" + m).html(num);
		var sbonuns = Y.get("#tbonus" + m).html();
		Y.get("#yhjj" + m).val((sbonuns * num).toFixed(2));
		var s = parseInt(Y.get("#cnum").html());
		var muli=0;
		for ( var i=1;i<=s;i++) {
			muli += parseInt(Y.get("#txtm" + i).html());
			
		}			
		Y.get("#sjmm").html(parseInt(muli*2));
		P.setMinMaxMoney();
		Y.get("#txtm" + m).html(num);
		return false;
	},
	bschange : function (m){
			m=Math.ceil(m);
			$("td[yhzs]").each(function(){
				if(Y.getInt($(this).html()-m)==1||Y.getInt($(this).html()-m)==-1){
					$(this).html(m);
				}else{
					$(this).html($(this).html()*m);
				}
				
				var sbonuns = $(this).parent().find("input[yhjj]").attr("yhjj");
				$(this).parent().find("input[yhjj]").val((sbonuns * m).toFixed(2))
			})
			Y.get("#bs").val(m);
			P.setMinMaxMoney();
			return false;
	},
	
	

	
	getduizhen:function(data){
		 var html = [];
		 var htm = [];
		 var htmRow = [];
		 var tableTp1=['<tr teamval="{$itemid}">'+
			           '<td>{$name}</td>'+
			           '<td>{$hn}{$close}</td>'+
			           '<td>{$gn}</td>'+
			           '<th>{$jqbet}</th>'+
			         
			           '</tr>'
	    		];
		 var tableTp2=[
		   			'<tr teamval={$teamval}>'+
		   					'<td >{$seqno}<div id="mc{$seqno}" style="display:none">{$code}</div></td>'+
		   					
		   					'<td>{$gg}</td>'+
		   					
		   					'<th><div class="ie">{$bets}</div></th>'+
		   					
		   					'<td><font color="red"><label id="tbonus{$seqno}">{$tbonus}</label></font></td>'+					
		   					
		   					'<td id="txtm{$seqno}" yhzs="{$muli}">{$muli}</td>'+
		   					
		   					'<td><p class="dc_qr"><i><a onclick="return P.decMulity({$seqno});"></a>'+
		   					
		   					'<input class="mul" type="text" value="{$tbonus}" id="yhjj{$seqno}" onchange="P.numChange({$seqno})" maxlength="6" yhjj="{$tbonus}">'+
		   					
		   					'<a onclick="return P.incMulity({$seqno});"></a></i></p></td>'+
		   			'</tr>'
		   		               

		   	    		];
		 
		 var tableTp3=[
'<span id="mmin"><font color="{$mincolor}">{$mmin}~</font></span>'+
'<span id="mmax"><font color="{$maxcolor}">{$mmax}</font></span>'
			          
	    		];

		 var obj = eval("(" + data.text + ")");

		 var rt=obj.Resp.optimize.match;
		 var rj=obj.Resp.optimize.result;
		 var rr=obj.Resp.optimize.row;
		 
		 this.xxx = rr ;
		 
		 if(!this.isArray(rt)){rt=new Array(rt);}
		 if(!this.isArray(rj)){rj=new Array(rj);}
		 if(!this.isArray(rr)){rr=new Array(rr);}

		 Y.get("#cnum").html(rj.length);
		 var betdata=[];
		 rt.each(function(row,o) {
			 row.c3 = "h_br";
			 row.c0 = "h_br";
			 row.c1 = "h_br";

			 var ss = row.sopt + "  ";
			 if ( ss.indexOf('3') >= 0) {
				 row.c3 = "g_br";
			 }  
            if ( ss.indexOf('1') >= 0) {
				 row.c1 = "g_br";
			 } 
            if ( ss.indexOf('0') >= 0) {
				 row.c0 = "g_br";
			 }

			 var bqc=row.bqc.split(",");
			

			 if (parseInt(row.close)>0){
				row.close='<strong style="color:red">(+'+row.close+')</strong>';
			 } else if (parseInt(row.close)<0){
				row.close='<strong style="color:green">('+row.close+')</strong>';
			 } else {
				row.close="";
			 }
			
			
			var jqbet=""
			 var jqs=row.sdesc.match(/\((\S+)\)/)[1];
			 if(jqs.split("/").length>1){
				 jqs.split("/").each(function(e,Y){
					 
					 jqbet+='<em data-val="'+e+'">'+e.replaceAll(3,"胜").replaceAll(1,"平").replaceAll(0,"负")+'('+bqc[$_sys.getbqcindex(e,0)]+')</em>'
					 
				 })
			 }else{
				 jqbet+='<em data-val="'+jqs+'">'+jqs.replaceAll(3,"胜").replaceAll(1,"平").replaceAll(0,"负")+'('+bqc[$_sys.getbqcindex(jqs,0)]+')</em>'
			 }
			 row.jqbet=jqbet;
			 betdata.push([row.itemid,row.hn.substr(0,6)]);
			 
			 html[html.length] = tableTp1[0].tpl(row);
		 });
		 Y.get("#vsTable").html(html.join(''));
		
		
		
		
		rr.each(function(rw,o) {
			if ( rw.mmin > Y.get("#sjmm").html() ) {
				rw.mincolor ="red";
			} else {
				rw.mincolor ="black";
			}
			
			if ( rw.mmax > Y.get("#sjmm").html() ) {
				rw.maxcolor ="red";
			} else {
				rw.maxcolor ="black";
			}
			
			
			
		});
		$_sys.betname = function(f,n) {
			 if (typeof(n)=='undefined'){n=1;};
			 for ( var i = 0; i < betdata.length; i++) {
				 if (betdata[i][0] == f) {
				 return betdata[i][n];
				 }
			 }
		 }; 
		
		 var yhgg=[];
			rj.each(function(rw,o) {
				var bet=""
				
				var codearr=rw.code.split("|")[0].split(",");
				rw.teamval=codearr;
				if(codearr.length>1){
					codearr.each(function(x,y){
						rw.bhn=$_sys.betname(x.split("=")[0]);
						rw.bet=(x.split("=")[1]).replaceAll(3,"胜").replaceAll(1,"平").replaceAll(0,"负");
						rw.gg=rw.code.split("|")[1].replace("*","串");
						yhgg.push(rw.gg);
						bet+='<b><i>'+rw.bet+'</i>'+rw.bhn+'</b>';
					})
				}else{
					codearr=codearr[0];
					rw.bhn=$_sys.betname(codearr.split("=")[0]);
					rw.bet=(codearr.split("=")[1]).replaceAll(3,"胜").replaceAll(1,"平").replaceAll(0,"负");
					rw.gg=rw.code.split("|")[1].replace("*","串");
					yhgg.push(rw.gg);
					bet+='<b><i>'+rw.bet+'</i>'+rw.bhn+'</b>';
				}
				
				
				rw.bets=bet;
				
				htm[htm.length] = tableTp2[0].tpl(rw);
			});
			yhgg=$_base_s.uniq(yhgg);
			Y.get("#yhgg").html(yhgg);
			Y.get("#jjTable").html(htm.join(''));
			
			rr.each(function(rw,o) {
				if ( rw.mmin > Y.get("#sjmm").html() ) {
					rw.mincolor ="red";
				} else {
					rw.mincolor ="red";
				}
				
				if ( rw.mmax > Y.get("#sjmm").html() ) {
					rw.maxcolor ="red";
				} else {
					rw.maxcolor ="red";
				}
				
				if(o==0){
					htmRow[htmRow.length] = tableTp3[0].tpl(rw);
				}
				
			});
			Y.get("#mzTable").html(htmRow.join(''));
//			$("#jjTable tr").each(function(e,Y){
//			$(this).click(function(){
////				P.betStyleUpdate($(this).attr("teamval"));
//				alert("12")
//			})
		//	
		//});
			$("#jjTable tr").hover(function(){
				$(this).addClass("hover");
				P.betStyleUpdate($(this).attr("teamval"));
			},function(){
				$(this).removeClass("hover");
				$("#vsTable em[data-val]").removeClass("pad-red");
			})
			
		},
		getHeaderW:function(){
			var betTitleObj = $("#betbottom");
			var betTitleHeight = betTitleObj.offset().top;
			var H=$(".opt-t-right").offset().left
			var nowClientHeigth = document.documentElement.clientHeight;
			if (betTitleHeight > nowClientHeigth) {
				betTitleObj.addClass("yhBet");
				betTitleObj.css('left', H);

				return false;
			}else {
				betTitleObj.removeClass("yhBet");
				betTitleObj.css('left', 'auto');
				return false
			}
		},
		betFooterLocate : function(footerId, showId, className) {
			var betTitleObj = $("#" + footerId);
			var betTitleHeight = betTitleObj.height();
			var betObj = $("#" + showId);
			var betTop = betObj.offset().top;
			var H=$(".opt-t-right").offset().left
			function getlocate() {
				var scrollTop = Number($(document).scrollTop());
				var nowClientHeigth = document.documentElement.clientHeight;
				var betHeight = betObj.height();
				if (scrollTop + nowClientHeigth - 48 < betTop + betHeight) {
					if (betTitleObj.hasClass(className)) return false;
					betTitleObj.addClass(className);
					betTitleObj.css('left', H);
				} else {
					if (!betTitleObj.hasClass(className)) return false;
					betTitleObj.removeClass(className);
					betTitleObj.css('left', 'auto');
				}
			}
			$(window).scroll(getlocate);
		}

	} );
	$(window).scroll(function() {
		if ($('div[dzlistbox]').height() < $(window).height()) return;
		var top = $(window).scrollTop();
//		var betTitleHeight = Y.get("#betbottom").getXY().y;
		

		if ($.browser.isIe6) {
			if (top > 120) {
				var ol = $('#qhyhObj').offset().left;
				$('#qhyhObj').addClass('yhmenuDiv').css('left', ol);
				$('#leftdiv').addClass('xuanxbox');
				resizeLeft();
			} else {
				$('#qhyhObj').removeClass('yhmenuDiv'),
				$('#leftdiv').removeClass('xuanxbox');
				$('#scoll-team').css('height', 'auto');
			}
		} else {
			if (top > 120) {
				$('#qhyhObj').css({
					position: 'fixed',
					top: '0px',
					zIndex: 1000
					
				});
				$('#leftdiv').css({
					position: 'fixed',
					top: '0px',
					zIndex: 1000
					
				});
				resizeLeft();
				var lheight = $('#leftdiv').height(),
				btop = $('.footer').offset().top - top - 11;
				if (btop < lheight) {
					$('#leftdiv').css('top', btop - lheight);
				}
			} else {
				$('#qhyhObj,#leftdiv').css({
					position: '',
					top: ''
				});
				$('#scoll-team').css('height', 'auto');
			}
			
		}
	});
	function resizeLeft() {
		var wh = $(window).height(); ($('#leftdiv').height() > wh) && ($('#scoll-team').height(wh - $('#box').height() - 47));
	}
