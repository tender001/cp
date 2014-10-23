/*----------------------------------------------------------------------------*
 * 竞彩足球奖金优化   
------------------------------------------------------------------------------*/
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
		
		this.get("#sjmm").html(totalmoney);
		
		var yhtyp = 0;		
		this.get('#ytype0').click(function (e, Y){
			yhtyp= 0;
		});

		this.get('#ytype1').click(function (e, Y){
			yhtyp= 1;
		});
		
		this.get('#ytype2').click(function (e, Y){
			yhtyp= 2;
		});
		
		
		this.get('#btnYh').click(function (e, Y){
			if($("#tmoney").val()%2!=0){
				alert("输入计划购买的金额必须是偶数");
				return false;
			}
			
			Y.LoadDuiZhen(codes,Y.get("#tmoney").val()/2,yhtyp,gg);
		});
		
		this.get("#btnSubmit").click(function(e, Y){
			var num = parseInt(Y.get("#cnum").html());
			var s = "";
			for ( var i=1;i<=num;i++) {
				var muli = Y.get("#txtm" + i).val();
				var cccc = Y.get("#mc" + i).html();
				if ( muli > 0 ) {
					s += 'SPF|' + cccc + "_" + muli + ";";
				}
			}			

			 Y.get('#content').val(s);
			 Y.get('#ishm').val("0");//代购
			 Y.get('#gid').val('90');
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
				var muli = Y.get("#txtm" + i).val();
				var cccc = Y.get("#mc" + i).html();
				if ( muli > 0 ) {
					s += 'SPF|' + cccc + "_" + muli + ";";
				}
			}			

			 Y.get('#content').val(s);
			 Y.get('#ishm').val("1");//合买
			 Y.get('#gid').val('90');
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
					data : "pid=spf&codes="+c+"&muli="+m + "&type=" + t + "&pnum=" + gg,
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
			tabonus[tabonus.length] = Y.get("#tbonus"+ i).html() - 0;
		}
		
		tabonus.sort(function(a,b){return a>b?1:-1;});

		 var tableTp3=['<tr>'+
		               '<td>{$mnum}</td>'+
		               '<td>{$znum}</td>'+
		               '<td><font color="{$mincolor}"><label id="mmin">{$mmin}</label></font></td>'+
		               '<td><font color="{$maxcolor}"><label id="mmax">{$mmax}</label></font></td>'+
			           '</tr>'
	    		];
		
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
			Y.get("#mmin").html(rr.mmin);
			Y.get("#mmax").html(rr.mmax);
			
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
			
			
			
			
			if ( rw.mmin >  sjmm) {
				rw.mincolor ="red";
			} else {
				rw.mincolor ="black";
			}
			
			if ( rw.mmax > sjmm) {
				rw.maxcolor ="red";
			} else {
				rw.maxcolor ="black";
			}
			htmRow[htmRow.length] = tableTp3[0].tpl(rw);
		});
		Y.get("#mzTable").html(htmRow.join(''));
		}
	},
	
	incMulity : function(m) {
		var num = parseInt(Y.get("#txtm" + m).val());
		num = num + 1;
		Y.get("#txtm" + m).val(num);
		var sbonuns = Y.get("#bonus" + m).html();
		Y.get("#tbonus" + m).html((sbonuns * num).toFixed(2));
		Y.get("#sjmm").html(parseInt(Y.get("#sjmm").html())+2);
		P.setMinMaxMoney();
		return false;
	},
	decMulity : function(m) {
		var num = parseInt(Y.get("#txtm" + m).val());
		if ( num > 0) {
			num = num - 1;
			Y.get("#txtm" + m).val(num);
			var sbonuns = Y.get("#bonus" + m).html();
			Y.get("#tbonus" + m).html((sbonuns * num).toFixed(2));
			Y.get("#sjmm").html(parseInt(Y.get("#sjmm").html())-2);
			P.setMinMaxMoney();
		}
		return false;
	},
    
	numChange : function(m) {
		var num = 0;
		if ( !isNaN(Y.get("#txtm" + m).val()) ) {
			num = parseInt(Y.get("#txtm" + m).val());
		}
		Y.get("#txtm" + m).val(num);
		var sbonuns = Y.get("#bonus" + m).html();
		Y.get("#tbonus" + m).html((sbonuns * num).toFixed(2));
		var s = parseInt(Y.get("#cnum").html());
		var muli=0;
		for ( var i=1;i<=s;i++) {
			muli += parseInt(Y.get("#txtm" + i).val());
			
		}			
		Y.get("#sjmm").html(parseInt(muli*2));
		P.setMinMaxMoney();
		Y.get("#txtm" + m).val(num);
		return false;
	},
	
	
	getduizhen:function(data){
		 var html = [];
		 var htm = [];
		 var htmRow = [];
		 var tableTp1=['<tr>'+
			           '<td>{$name}</td>'+
			           '<td class="{$c3} jjyh_dz"><span class="yh_s_ftl">{$hn}</span><span class="yh_s_ftr">{$sp3}</span></td>'+
			           '<td class="{$c1}">{$sp1}</td>'+
			           '<td class="{$c0}"><span class="yh_s_ftl">{$sp0}</span><span class="yh_s_ftr">{$gn}</span></td>'+
			           '<td>{$bet3}</td>'+
			           '<td>{$bet1}</td>'+
			           '<td>{$bet0}</td>'+
			           '</tr>'
	    		];
		 var tableTp2=['<tr>'+
		               '<td>{$seqno}</td>'+
		               '<td ><p>{$desc}=<font color="red"><label id="bonus{$seqno}">{$bonus}</label></font></p></td>'+
		               '<td><font color="red"><label id="tbonus{$seqno}">{$tbonus}</label></font></td>'+
		               '<td><a onclick="return P.decMulity({$seqno});"><img src="/images/jc/ds_14.gif"/></a></td>'+
		               '<td><input id="txtm{$seqno}" type="text" class="text1" value="{$muli}" onchange="P.numChange({$seqno})" /></td>'+
		               '<td><a onclick="return P.incMulity({$seqno});"><img src="/images/jc/ds_11.gif" /></td>'+
		               '<td><div id="mc{$seqno}" style="display:none">{$code}</div></td>'+
			           '</tr>'
	    		];
		 
		 var tableTp3=['<tr>'+
		               '<td>{$mnum}</td>'+
		               '<td>{$znum}</td>'+
		               '<td><font color="{$mincolor}"><label id="mmin">{$mmin}</label></font></td>'+
		               '<td><font color="{$maxcolor}"><label id="mmax">{$mmax}</label></font></td>'+
			           '</tr>'
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

			 var spf=row.spf.split(",");
			 row.sp3=spf[0];
			 row.sp1=spf[1];
			 row.sp0=spf[2];

			 if (parseInt(row.close)>0){
				row.close='<strong style="color:red">(+'+row.close+')</strong>';
			 } else if (parseInt(row.close)<0){
				row.close='<strong style="color:green">('+row.close+')</strong>';
			 } else {
				row.close="";
			 }
			 html[html.length] = tableTp1[0].tpl(row);
		 });
		 Y.get("#vsTable").html(html.join(''));
		
		rj.each(function(rw,o) {
			htm[htm.length] = tableTp2[0].tpl(rw);
		});
		Y.get("#jjTable").html(htm.join(''));
		
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
			
			
			htmRow[htmRow.length] = tableTp3[0].tpl(rw);
		});
		Y.get("#mzTable").html(htmRow.join(''));
	}
} );