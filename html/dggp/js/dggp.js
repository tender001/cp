//var choosetrs = ['<li zid="{$zid}_li"><table width="100%" border="0" cellspacing="0" cellpadding="0" zid="{$zid}_tbs"><tr><td width="200"><span>{$hn}{$close}&nbsp;vs&nbsp;{$gn}</span></td><td align="right" class="l_pa-r"><i class="cm_jcqc" zid="{$zid}"></i></td>' + 
//                '</tr><tr zid="{$zid}_{$tzv}"><td><label><a href="javascript:void(0)" value="{$tzv}" sp="{$sp}" zid="{$zid}">{$tzx}</a><em>买<input type="text" zid="{$zid}" value="{$tzm}">元</em></label></td><td align="right" class="l_pa-r" zid="{$zid}">{$bonus}</td></tr></table></li>',
//                '<tr zid="{$zid}_{$tzv}"><td><label><a href="javascript:void(0)" sp="{$sp}" value="{$tzv}" zid="{$zid}">{$tzx}</a><em>买<input type="text" zid="{$zid}" value="{$tzm}">元</em></label></td><td align="right" class="l_pa-r" zid="{$zid}">{$bonus}</td></tr>'];


var choosetrs = ['<div class="bod" zid="{$zid}_li" mid={$mid}><p><i zid="{$zid}"></i>{$hn}{$close}&nbsp;VS&nbsp;{$gn}</p><div class="bod-m" ><ul zid="{$zid}_tbs">'
                 +'<li zid="{$zid}_{$tzvv}"><em zid="{$zid}" style="display: none;">{$bonus}</em><a value="{$tzv}" sp="{$sp}" zid="{$zid}">{$tzx}</a><input type="hidden" zid="{$zid}" value="{$tzm}"/></li></ul>'
          +'</div></div>',
          '<li zid="{$zid}_{$tzvv}"><em zid="{$zid}" style="display: none;">{$bonus}</em><a value="{$tzv}" sp="{$sp}" zid="{$zid}">{$tzx}</a><input type="hidden" zid="{$zid}" value="{$tzm}"/></li>'];
var tzxxnames = {"3":"主胜","1":"平","0":"主负","33":"胜-胜","31":"胜-平","30":"胜-负","13":"平-胜","11":"平-平","10":"平-负","03":"负-胜","01":"负-平","00":"负-负"};
//加载 期次-对阵
    Class('LoadExpect',{
    	index:function(){
    		this.TbindMsg();		
    	},
    	TbindMsg: function(){
    		return this.LoadDuiZhen();    		
    	},	
        
    	LoadDuiZhen : function() {	
    		Class.config('playId', parseInt(this.need('#playid').val()) );  //彩种
    		var url="/cpdata/match/jczq/jczq_spf.json";
    		switch (Class.config('playId')) {
			case 72 :    //让球胜平负
				url="/cpdata/match/jczq/jczq_rspf.json";
				break;
			case 40 :    //总进球数
				url="/cpdata/match/jczq/jczq_jqs.json";
				break;
			case 42 :    //比分
				url="/cpdata/match/jczq/jczq_cbf.json";
				break;
			case 51 :    //半全场
				url="/cpdata/match/jczq/jczq_bqc.json";
				break;
			case 43 :    //让球胜平负单关配
				url="/cpdata/match/jczq/jczq_rspf.json";
				break;
			case 34 :    
				url="/cpdata/match/jczq/jczq_spf.json";
				break;
			default :
		}
		this.ajax({
			        url: url+"?v=" + Math.random(),
			        cache:false,
					end : function(data) {
						var obj = eval("(" + data.text + ")");
						var code = obj.match.code;
						var desc = obj.match.desc;
						if (code == "0") {
							switch (Class.config('playId')) {
							case 72 :    //让球胜平负
								this.rspf(data);
								break;
							case 40 :    //总进球数
								this.jq(data);
								break;
							case 42 :    //比分
								this.bf(data);
								break;
							case 51 :    //半全场
								this.bq(data);
								break;
							case 43 :    //让球胜平负单关配
								this.rqspfdgp(data);
								break;
							case 34 :    //胜平负
								this.spf(data);
								break;
							default :	
							}
						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障,请重新刷新。");
						return false;
					}
				});
    	},
    	spf:function(data){
    		 var html="" ;
    		 var tableTpl=['<div class="sf-left dp-basic"  etimes="{$short_et}" gn="{$gn}" hn="{$hn}" zid="{$itemid}" mid="{$mid}">'
                 +'<h2>{$gn}VS{$hn}</h2>'
                 +'<div class="bod">'
                 +'<p>'
                 +'<span>投注截止时间：{$short_et}</span>'
                 +'{$mname}<i>{$short_mt}</i>开赛'
                 +'</p>'
                 +'<div class="bod-m">'
                 +'<ul>'
                 +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                 +'</ul>'
                 +'<dl>'
                 +'<dd sp="{$sp3}" value="3" v="胜">{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                 +'<dd sp="{$sp1}" value="1" v="平">平局<em>{$sp1}</em></dd>'
                 +'<dd sp="{$sp0}" value="0" v="负">{$lhn}&nbsp;负<em>{$sp0}</em></dd>'
                 +'</dl>'
                 +'</div>'
                 +'</div>'
                 +'</div>','<div class="sf-left dp-basic">'
                 +'<h2>{$gn}VS{$hn}</h2>'
                 +'<div class="bod">'
                 +'<p>'
                 +'<span>距投注截止时间：{$short_et}</span>'
                 +'{$mname}<i>{$short_mt}</i>开赛'
                 +'</p>'
                 +'<div class="bod-m">'
                 +'<ul>'
                 +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                 +'</ul>'
                 +'<dl>'
                 +'<dd class="un-time">{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                 +'<dd class="un-time">平局<em>{$sp1}</em></dd>'
                 +'<dd class="un-time">{$lhn}&nbsp;负<em>{$sp0}</em></dd>'
                 +'</dl>'
                 +'</div>'
                 +'</div>'
                 +'</div>'];
    		
    		var mathdate=[];
    		var wk=["日","一","二","三","四","五","六"];
    		
    		var stop_sale="no";
    		var all_matches=0;
    		var numstr=[];
    		var num=0;
    		var lgstr="";
    		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
//				if(((row.idanguan*1) & 1 << 4) == (1 << 4)){
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
    			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
    			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
    			var spstr=row.spf.split(",");
    			row.sp3=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
    			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
    			row.sp0=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
    			row.zsp=row.sp3*1+row.sp1*1+row.sp0*1;
    			row.fsp3=row.zsp*1-row.sp3*1;
    			row.fsp1=row.zsp*1-row.sp1*1;
    			row.fsp0=row.zsp*1-row.sp0*1;
    			row.fzsp=row.fsp3*1+row.fsp1*1+row.fsp0*1;
    			row.zsp3 =parseInt(row.fsp3*1/row.fzsp*100)+3;
    			row.zsp1 =parseInt(row.fsp1*1/row.fzsp*100)-2;
    			row.zsp0 =100-row.zsp3*1-row.zsp1*1;
    			all_matches++;		
    			
    			row.lmname=row.mname;
    			row.lhn=row.hn.substr(0,4);
    			row.lgn=row.gn.substr(0,4);
    			
    			row.mname=row.mname.substr(0,4);
    			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
    				
    				html += tableTpl[1].tpl(row);
    			}else{//未过期的场次
    				num++;   
       				if(num==5){
       					html += '<div class="sf-left dp-basic"><h2 class="c"><a  target="_blank" href="/jc/dggp/">更多比赛</a></h2></div>';
       				}else if(num<6){
       					html += tableTpl[0].tpl(row);
       				}
    				
    			};
//			}
    		});
			
    		this.get("#vsTable").html(html);
    		this.get("#vsTable").show();
    
    		if(this.get("#vsTable").html().trim()==""){
    			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
    		}
    		this.postMsg('load_duizhen_succ');			
    	},
    	rspf:function(data){
   		 var html="" ;
   		 var tableTpl=['<div class="sf-left dp-basic"  etimes="{$short_et}" gn="{$gn}" hn="{$hn}" zid="{$itemid}" mid="{$mid}">'
                +'<h2>{$gn}VS{$hn}</h2>'
                +'<div class="bod">'
                +'<p>'
                +'<span>投注截止时间：{$short_et}</span>'
                +'{$mname}<i>{$short_mt}</i>开赛'
                +'</p>'
                +'<div class="bod-m">'
                +'<ul>'
                +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                +'</ul>'
                +'<dl>'
                +'<dd sp="{$sp3}" value="3" v="胜">{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                +'<dd sp="{$sp1}" value="1" v="平">平局<em>{$sp1}</em></dd>'
                +'<dd sp="{$sp0}" value="0" v="负">{$lhn}&nbsp;负<em>{$sp0}</em></dd>'
                +'</dl>'
                +'</div>'
                +'</div>'
                +'</div>','<div class="sf-left dp-basic">'
                +'<h2>{$gn}VS{$hn}</h2>'
                +'<div class="bod">'
                +'<p>'
                +'<span>距投注截止时间：{$short_et}</span>'
                +'{$mname}<i>{$short_mt}</i>开赛'
                +'</p>'
                +'<div class="bod-m">'
                +'<ul>'
                +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                +'</ul>'
                +'<dl>'
                +'<dd class="un-time">{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                +'<dd class="un-time">平局<em>{$sp1}</em></dd>'
                +'<dd class="un-time">{$lhn}&nbsp;负<em>{$sp0}</em></dd>'
                +'</dl>'
                +'</div>'
                +'</div>'
                +'</div>'];
   		
   		var mathdate=[];
   		var wk=["日","一","二","三","四","五","六"];
   		
   		var stop_sale="no";
   		var all_matches=0;
   		var numstr=[];
   		var num=0;
   		var lgstr="";
   		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
//				if(((row.idanguan*1) & 1 << 3) == (1 << 3)){
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
   			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
   			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
   			var spstr=row.rspf.split(",");
   			row.sp3=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
   			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
   			row.sp0=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
   			row.zsp=row.sp3*1+row.sp1*1+row.sp0*1;
   			row.fsp3=row.zsp*1-row.sp3*1;
   			row.fsp1=row.zsp*1-row.sp1*1;
   			row.fsp0=row.zsp*1-row.sp0*1;
   			row.fzsp=row.fsp3*1+row.fsp1*1+row.fsp0*1;
   			row.zsp3 =parseInt(row.fsp3*1/row.fzsp*100)+3;
   			row.zsp1 =parseInt(row.fsp1*1/row.fzsp*100)-2;
   			row.zsp0 =100-row.zsp3*1-row.zsp1*1;
   			all_matches++;		
   			
   			row.lmname=row.mname;
   			row.lhn=row.hn.substr(0,4);
   			row.lgn=row.gn.substr(0,4);
   			
   			row.mname=row.mname.substr(0,4);
   			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
   				
   				html += tableTpl[1].tpl(row);
   			}else{//未过期的场次
   				num++;   
   				if(num==5){
   					html += '<div class="sf-left dp-basic"><h2 class="c"><a  target="_blank" href="/jc/dggp/rqspf.html">更多比赛</a></h2></div>';
   				}else if(num<6){
   					html += tableTpl[0].tpl(row);
   				}
   				
   			};
//			}
   		});
			
   		this.get("#vsTable").html(html);
   		this.get("#vsTable").show();
   
   		if(this.get("#vsTable").html().trim()==""){
   			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
   		}
   		this.postMsg('load_duizhen_succ');			
   	},
    	bf:function(data){
   		 var html="" ;
   		 var tableTpl=['<div class="sf-left dp-basic"  etimes="{$short_et}" gn="{$gn}" hn="{$hn}" zid="{$itemid}" mid="{$mid}">'
                +'<h2>{$gn}VS{$hn}</h2>'
                +'<div class="bod">'
                +'<p>'
                +'<span>投注截止时间：{$short_et}</span>'
                +'{$mname}<i>{$short_mt}</i>开赛'
                +'</p>'
                +'<div class="bod-m">'
                +'<div class="sf bf-sf">'
                +'<em sp="{$sp90}" value="9:0">胜其它<i>{$sp90}</i></em>'
                +'<em sp="{$sp10}" value="1:0">1:0<i>{$sp10}</i></em>'
                +'<em sp="{$sp20}" value="2:0">2:0<i>{$sp20}</i></em>'
                +'<em sp="{$sp21}" value="2:1">2:1<i>{$sp21}</i></em>'
                +'<em sp="{$sp30}" value="3:0">3:0<i>{$sp30}</i></em>'
                +'<em sp="{$sp31}" value="3:1">3:1<i>{$sp31}</i></em>'
                +'<em sp="{$sp32}" value="3:2">3:2<i>{$sp32}</i></em>'
                +'<em sp="{$sp40}" value="4:0">4:0<i>{$sp40}</i></em>'
                +'<em sp="{$sp41}" value="4:1">4:1<i>{$sp41}</i></em>'
                +'<em sp="{$sp42}" value="4:2">4:2<i>{$sp42}</i></em>'
                +'<em sp="{$sp50}" value="5:0">5:0<i>{$sp50}</i></em>'
                +'<em sp="{$sp51}" value="5:1">5:1<i>{$sp51}</i></em>'
                +'<em sp="{$sp52}" value="5:2">5:2<i>{$sp52}</i></em>'
                +'</div>'
                +'<div class="sf bf-sf">'
                +'<em sp="{$sp99}" value="9:9">平其它<i>{$sp99}</i></em>'
                +'<em sp="{$sp00}" value="0:0">5:2<i>{$sp00}</i></em>'
                +'<em sp="{$sp11}" value="1:1">5:2<i>{$sp11}</i></em>'
                +'<em sp="{$sp22}" value="2:2">5:2<i>{$sp22}</i></em>'
                +'<em sp="{$sp33}" value="3:3">5:2<i>{$sp33}</i></em>'
                +'</div>'
                +'<div class="sf bf-sf">'
                +'<em sp="{$sp09}" value="0:9">负其它<i>{$sp09}</i></em>'
                +'<em sp="{$sp01}" value="0:1">0:1<i>{$sp01}</i></em>'
                +'<em sp="{$sp02}" value="0:2">0:2<i>{$sp02}</i></em>'
                +'<em sp="{$sp12}" value="1:2">1:2<i>{$sp12}</i></em>'
                +'<em sp="{$sp03}" value="0:3">0:3<i>{$sp03}</i></em>'
                +'<em sp="{$sp13}" value="1:3">1:3<i>{$sp13}</i></em>'
                +'<em sp="{$sp23}" value="2:3">2:3<i>{$sp23}</i></em>'
                +'<em sp="{$sp04}" value="0:4">0:4<i>{$sp04}</i></em>'
                +'<em sp="{$sp14}" value="1:4">1:4<i>{$sp14}</i></em>'
                +'<em sp="{$sp24}" value="2:4">2:4<i>{$sp24}</i></em>'
                +'<em sp="{$sp05}" value="0:5">0:5<i>{$sp05}</i></em>'
                +'<em sp="{$sp15}" value="1:5">1:5<i>{$sp15}</i></em>'
                +'<em sp="{$sp25}" value="2:5">2:5<i>{$sp25}</i></em>'
                +'</div>'
                +'</div>'
                +'</div>'
                +'</div>',''];
   		
   		var mathdate=[];
   		var wk=["日","一","二","三","四","五","六"];
   		
   		var stop_sale="no";
   		var all_matches=0;
   		var numstr=[];
   		var num=0;
   		var lgstr="";
   		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
				if(((row.idanguan*1) & 1 << 2) == (1 << 2)){
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
	   			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
	   			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
	   			var spstr=row.cbf.split(",");
				row.sp90=(spstr[12]!=''?(parseFloat(spstr[12]).rmb(false,2).replace(",","")):'--');
				row.sp10=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2).replace(",","")):'--');
				row.sp20=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2).replace(",","")):'--');
				row.sp21=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2).replace(",","")):'--');
				row.sp30=(spstr[3]!=''?(parseFloat(spstr[3]).rmb(false,2).replace(",","")):'--');
				row.sp31=(spstr[4]!=''?(parseFloat(spstr[4]).rmb(false,2).replace(",","")):'--');
				row.sp32=(spstr[5]!=''?(parseFloat(spstr[5]).rmb(false,2).replace(",","")):'--');
				row.sp40=(spstr[6]!=''?(parseFloat(spstr[6]).rmb(false,2).replace(",","")):'--');
				row.sp41=(spstr[7]!=''?(parseFloat(spstr[7]).rmb(false,2).replace(",","")):'--');
				row.sp42=(spstr[8]!=''?(parseFloat(spstr[8]).rmb(false,2).replace(",","")):'--');
				row.sp50=(spstr[9]!=''?(parseFloat(spstr[9]).rmb(false,2).replace(",","")):'--');
				row.sp51=(spstr[10]!=''?(parseFloat(spstr[10]).rmb(false,2).replace(",","")):'--');
				row.sp52=(spstr[11]!=''?(parseFloat(spstr[11]).rmb(false,2).replace(",","")):'--');
	
				row.sp99=(spstr[17]!=''?(parseFloat(spstr[17]).rmb(false,2).replace(",","")):'--');
				row.sp00=(spstr[13]!=''?(parseFloat(spstr[13]).rmb(false,2).replace(",","")):'--');
				row.sp11=(spstr[14]!=''?(parseFloat(spstr[14]).rmb(false,2).replace(",","")):'--');
				row.sp22=(spstr[15]!=''?(parseFloat(spstr[15]).rmb(false,2).replace(",","")):'--');
				row.sp33=(spstr[16]!=''?(parseFloat(spstr[16]).rmb(false,2).replace(",","")):'--');
	
				row.sp09=(spstr[30]!=''?(parseFloat(spstr[30]).rmb(false,2).replace(",","")):'--');
				row.sp01=(spstr[18]!=''?(parseFloat(spstr[18]).rmb(false,2).replace(",","")):'--');
				row.sp02=(spstr[19]!=''?(parseFloat(spstr[19]).rmb(false,2).replace(",","")):'--');
				row.sp12=(spstr[20]!=''?(parseFloat(spstr[20]).rmb(false,2).replace(",","")):'--');
				row.sp03=(spstr[21]!=''?(parseFloat(spstr[21]).rmb(false,2).replace(",","")):'--');
				row.sp13=(spstr[22]!=''?(parseFloat(spstr[22]).rmb(false,2).replace(",","")):'--');
				row.sp23=(spstr[23]!=''?(parseFloat(spstr[23]).rmb(false,2).replace(",","")):'--');
				row.sp04=(spstr[24]!=''?(parseFloat(spstr[24]).rmb(false,2).replace(",","")):'--');
				row.sp14=(spstr[25]!=''?(parseFloat(spstr[25]).rmb(false,2).replace(",","")):'--');
				row.sp24=(spstr[26]!=''?(parseFloat(spstr[26]).rmb(false,2).replace(",","")):'--');
				row.sp05=(spstr[27]!=''?(parseFloat(spstr[27]).rmb(false,2).replace(",","")):'--');
				row.sp15=(spstr[28]!=''?(parseFloat(spstr[28]).rmb(false,2).replace(",","")):'--');
				row.sp25=(spstr[29]!=''?(parseFloat(spstr[29]).rmb(false,2).replace(",","")):'--');
				row.ccbf=row.sp90+","+row.sp10+","+row.sp20+","+row.sp21+","+row.sp30+","+row.sp31+","+row.sp32+","+row.sp40+","+row.sp41+","+row.sp42+
				","+row.sp50+","+row.sp51+","+row.sp52+","+row.sp99+","+row.sp00+","+row.sp11+","+row.sp22+","+row.sp33+","+row.sp09+","+row.sp01+
				","+row.sp02+","+row.sp12+","+row.sp03+","+row.sp13+","+row.sp23+","+row.sp04+","+row.sp14+","+row.sp24+","+row.sp05+","+row.sp15+","+row.sp25;
	   			all_matches++;		
	   		
	   			row.lmname=row.mname;
	   			row.lhn=row.hn.substr(0,4);
	   			row.lgn=row.gn.substr(0,4);
	   			
	   			row.mname=row.mname.substr(0,4);
	   			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
	   				
	   				html += tableTpl[1].tpl(row);
	   			}else{//未过期的场次
	   				num++;   
	   				if(num==6){
	   					html += '<div class="sf-left dp-basic"><h2 class="c"><a  target="_blank" href="/jc/dggp/cbf.html">更多比赛</a></h2></div>';
	   				}else if(num<6){
	   					html += tableTpl[0].tpl(row);
	   				}
	   				
	   				
	   			};
			}
   		});
			
   		this.get("#vsTable").html(html);
   		this.get("#vsTable").show();
   
   		if(this.get("#vsTable").html().trim()==""){
   			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
   		}
   		this.postMsg('load_duizhen_succ');			
   	},
   	jq:function(data){
  		 var html="" ;
  		 var tableTpl=['<div class="sf-left dp-basic"  etimes="{$short_et}" gn="{$gn}" hn="{$hn}" zid="{$itemid}" mid={$mid}>'
               +'<h2>{$gn}VS{$hn}</h2>'
               +'<div class="bod">'
               +'<p>'
               +'<span>投注截止时间：{$short_et}</span>'
               +'{$mname}<i>{$short_mt}</i>开赛'
               +'</p>'
               +'<div class="bod-m">'
               +'<div class="sf sf-num">'
               +'<em sp="{$sp0}" value="0" v="0球">0球<i>{$sp0}</i></em>'
               +'<em sp="{$sp1}" value="1" v="1球">1球<i>{$sp1}</i></em>'
               +'<em sp="{$sp2}" value="2" v="2球">2球<i>{$sp2}</i></em>'
               +'<em sp="{$sp3}" value="3" v="3球">3球<i>{$sp3}</i></em>'
               +'<em sp="{$sp4}" value="4" v="4球">4球<i>{$sp4}</i></em>'
               +'<em sp="{$sp5}" value="5" v="5球">5球<i>{$sp5}</i></em>'
               +'<em sp="{$sp6}" value="6" v="6球">6球<i>{$sp6}</i></em>'
               +'<em sp="{$sp7}" value="7" v="7+球">7+球<i>{$sp7}</i></em>'
               +'</div>'
               +'</div>'
               +'</div>'
               +'</div>',''];
  		
  		var mathdate=[];
  		var wk=["日","一","二","三","四","五","六"];
  		
  		var stop_sale="no";
  		var all_matches=0;
  		var numstr=[];
  		var num=0;
  		var lgstr="";
  		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
				if(((row.idanguan*1) & 1 << 1) == (1 << 1)){
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
	   			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
	   			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
	   			var spstr=row.jqs.split(",");
	   			row.sp0=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
	   			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
	   			row.sp2=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
	   			row.sp3=(spstr[3]!=''?(parseFloat(spstr[3]).rmb(false,2)):'--');
	   			row.sp4=(spstr[4]!=''?(parseFloat(spstr[4]).rmb(false,2)):'--');
	   			row.sp5=(spstr[5]!=''?(parseFloat(spstr[5]).rmb(false,2)):'--');
	   			row.sp6=(spstr[6]!=''?(parseFloat(spstr[6]).rmb(false,2)):'--');
	   			row.sp7=(spstr[7]!=''?(parseFloat(spstr[7]).rmb(false,2)):'--');
	   			all_matches++;		
	   		
	   			row.lmname=row.mname;
	   			row.lhn=row.hn.substr(0,4);
	   			row.lgn=row.gn.substr(0,4);
	   			
	   			row.mname=row.mname.substr(0,4);
	   			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
	   				
	   				html += tableTpl[1].tpl(row);
	   			}else{//未过期的场次
	   				num++;   
	   				if(num==6){
	   					html += '<div class="sf-left dp-basic"><h2 class="c"><a  target="_blank" href="/jc/dggp/jqs.html">更多比赛</a></h2></div>';
	   				}else if(num<6){
	   					html += tableTpl[0].tpl(row);
	   				}
	   				
	   				
	   			};
			}
  		});
			
  		this.get("#vsTable").html(html);
  		this.get("#vsTable").show();
  
  		if(this.get("#vsTable").html().trim()==""){
  			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
  		}
  		this.postMsg('load_duizhen_succ');			
  	},
   	bq:function(data){
 		 var html="" ;
 		 var tableTpl=['<div class="sf-left dp-basic"  etimes="{$short_et}" gn="{$gn}" hn="{$hn}" zid="{$itemid}" mid={$mid}>'
              +'<h2>{$gn}VS{$hn}</h2>'
              +'<div class="bod">'
              +'<p>'
              +'<span>投注截止时间：{$short_et}</span>'
              +'{$mname}<i>{$short_mt}</i>开赛'
              +'</p>'
              +'<div class="bod-m">'
              +'<div class="sf sf-num">'
              +'<em sp="{$sp0}" value="3-3" v="胜-胜">胜-胜<i>{$sp0}</i></em>'
              +'<em sp="{$sp1}" value="3-1" v="胜-平">胜-平<i>{$sp1}</i></em>'
              +'<em sp="{$sp2}" value="3-0" v="胜-负">胜-负<i>{$sp2}</i></em>'
              +'<em sp="{$sp3}" value="1-3" v="平-胜">平-胜<i>{$sp3}</i></em>'
              +'<em sp="{$sp4}" value="1-1" v="平-平">平-平<i>{$sp4}</i></em>'
              +'<em sp="{$sp5}" value="1-0" v="平-负">平-负<i>{$sp5}</i></em>'
              +'<em sp="{$sp6}" value="0-3" v="负-胜">负-胜<i>{$sp6}</i></em>'
              +'<em sp="{$sp7}" value="0-1" v="负-平">负-平<i>{$sp7}</i></em>'
              +'<em sp="{$sp8}" value="0-0" v="负-负">负-负<i>{$sp8}</i></em>'
              +'</div>'
              +'</div>'
              +'</div>'
              +'</div>',''];
 		
 		var mathdate=[];
 		var wk=["日","一","二","三","四","五","六"];
 		
 		var stop_sale="no";
 		var all_matches=0;
 		var numstr=[];
 		var num=0;
 		var lgstr="";
 		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
				if(((row.idanguan*1) & 1 << 0) == (1 << 0)){
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
	   			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
	   			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
	   			var spstr=row.bqc.split(",");
	   			row.sp0=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
	   			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
	   			row.sp2=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
	   			row.sp3=(spstr[3]!=''?(parseFloat(spstr[3]).rmb(false,2)):'--');
	   			row.sp4=(spstr[4]!=''?(parseFloat(spstr[4]).rmb(false,2)):'--');
	   			row.sp5=(spstr[5]!=''?(parseFloat(spstr[5]).rmb(false,2)):'--');
	   			row.sp6=(spstr[6]!=''?(parseFloat(spstr[6]).rmb(false,2)):'--');
	   			row.sp7=(spstr[7]!=''?(parseFloat(spstr[7]).rmb(false,2)):'--');
	   			row.sp8=(spstr[8]!=''?(parseFloat(spstr[8]).rmb(false,2)):'--');
	   			all_matches++;		
	   		
	   			row.lmname=row.mname;
	   			row.lhn=row.hn.substr(0,4);
	   			row.lgn=row.gn.substr(0,4);
	   			
	   			row.mname=row.mname.substr(0,4);
	   			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
	   				
	   				html += tableTpl[1].tpl(row);
	   			}else{//未过期的场次
	   				num++;   
	   				if(num==6){
	   					html += '<div class="sf-left dp-basic"><h2 class="c"><a  target="_blank" href="/jc/dggp/jqs.html">更多比赛</a></h2></div>';
	   				}else if(num<6){
	   					html += tableTpl[0].tpl(row);
	   				}
	   				
	   				
	   			};
			}
 		});
			
 		this.get("#vsTable").html(html);
 		this.get("#vsTable").show();
 
 		if(this.get("#vsTable").html().trim()==""){
 			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
 		}
 		this.postMsg('load_duizhen_succ');			
 	}
    });
Class('Selector', {
    maxM  : 199998,
    index : function()
    {
        var Y = this;
        $("#vsTable dd[sp],#vsTable em[sp]").hover(function(){
        	if($(this).hasClass("cur")){
        		return;
        	}
        	$(this).addClass("hover");
        },function(){
        	$(this).removeClass("hover");
        })
        $("#vsTable dd[sp],#vsTable em[sp]").die().live("click",function()      //点击投注选项(胜平负、让球胜平负)
        {
            var rcs = "cur";
            $(this).toggleClass(rcs);
            Y.changeCodeList($(this),$(this).parents("div.sf-left"));
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });
        $("#chooselist input[zid]").die().live("change paste",function()     //购买金额输入校验
        {
            var value = $(this).val();
            if(!(/^\+?[0-9]*$/.test(value)))
            {
                var tv = isNaN(parseInt(value))? (2) : (parseInt(value));
                $(this).val(tv > 0? tv : 2);
            }
            else if(value > Y.maxM)
            {
                $(this).val(Y.maxM);
            }
            else if(value <= 1)
            {
                $(this).val(2);
            }
            if($(this).val() % 2 != 0)
            {
                $(this).val($(this).val() - 1);
            }
            Y.changebonus("0",$(this));     //更新预估奖金(单个选项)
            $("#tzmoney").val("");
        });
        $("#tzmoney").die().live("change paste",function()     //购买金额输入校验(全局)
        {
            var value = $(this).val();
            if(value == "" || !(/^\+?[0-9]*$/.test(value)))
            {
                var tv = isNaN(parseInt(value))? (1) : (parseInt(value));
                $(this).val(tv > 0? tv : 1);
            }
//            else if(value > Y.maxM)
//            {
//                $(this).val(Y.maxM);
//            }
//            else if(value <= 1)
//            {
//                $(this).val(2);
//            }
//            if($(this).val() % 2 != 0)
//            {
//                $(this).val($(this).val() - 1);
//            }
            if($(this).val() != "")
            {
                $("#chooselist input[zid]").val($(this).val()*2);
                Y.changebonus("1",null);        //更新预估奖金(单个选项)
                Y.changemomey();                //更新投注总金额及预估总奖金
            }
        });
        $("#chooselist i[zid]").die().live("click",function()       //删除单个已选比赛
        {
            $("div[zid='" + $(this).attr("zid") + "_li']").remove();
            Y.changeselect("0",$(this).attr("zid"));       //清除选中状态
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });
        $("#chooselist a[sp]").die().live("click",function()    //删除单个选项
        {
            var ids = $(this).parents("li").attr("zid").split("_");
            $("li[zid='" + ids[0] + "_" + ids[1] + "']").remove();
            if($("ul[zid='" + ids[0] + "_tbs'] li").length < 1)
            {
                $("div[zid='" + ids[0] + "_li']").remove();
//                if($("#choose-match div.bod").length < 1){
//                	$("#tishi").show();
//                }
            }
            $("div[zid='" + ids[0] + "'] em[value='" + ids[1] + "'],div[zid='" + ids[0] + "'] dd[value='" + ids[1] + "']").removeClass("cur");
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });

       
        //投注区域固定
        //投注区域固定
//	    var ltop = $("#vsTable").prev().offset().top;
//		var rtop = $("div.w-sf-right").offset().top;
//        $(window).scroll(function()
//        {
//			Y.rscroll(ltop,rtop);
//	    }); 
    },
	rscroll : function(ltop,rtop){
//		var dt = $("h2.c").offset().top;
//		var ch = $("#chooselist").height();
//        var wtop = $(window).scrollTop();
//		if(dt>(ch+wtop)){
//			if(wtop < ltop)
//			{
//				$("#vsTable").prev().css({"position":"","top":ltop,"background":"","margin-top":"9px","z-index":""});
//				$("#chooselist").css({"position":"","top":(rtop)});
//				$("#chooselist").find("p.xl_dggp_p").css("margin-top","9px");
//			}
//			else
//			{
//				$("#vsTable").prev().css({"position":"absolute","top":wtop,"background":"#fff","width":"690px","margin-top":"0","z-index":"999"});
//				$("#chooselist").css({"position":"absolute","top":wtop});
//				$("#chooselist").find("p.xl_dggp_p").css("margin-top","0");
//			}
//		}else{
//				$("#vsTable").prev().css({"position":"absolute","top":wtop,"background":"#fff","width":"690px","margin-top":"0","z-index":"999"});
//				$("#chooselist").css({"position":"absolute","top":dt-ch});
//				$("#chooselist").find("p.xl_dggp_p").css("margin-top","0");			
//		}
	},
    changeCodeList:function(node,pnode)      //更新投注选项
    {
        var data = new Object();
//        if(Class.C("lotid") == "91")
//        {
//            pnode = pnode.parents("li");
//        }
        data.tzv = node.attr("v");
        data.tzvv = node.attr("value");
        data.mid = pnode.attr("mid");
        data.zid = pnode.attr("zid");
        data.hn = pnode.attr("hn");
        data.gn = pnode.attr("gn");
        if(Class.C("lotid") == "90")
        {
//            data.close = "(" + pnode.attr("close") + ")";
            data.close = "";
        }
        var rcs ="cur";
        if(!node.hasClass(rcs))
        {
            $("li[zid='" + data.zid + "_" + data.tzv + "']").remove();
            if($("ul[zid='" + data.zid + "_tbs'] li").length < 1)
            {
                $("div[zid='" + data.zid + "_li']").remove();
//                if($("#choose-match div.bod").length < 1){
//                	$("#tishi").show();
//                }
            }
        }
        else
        {
            var tzmoney = $("#tzmoney").val()*2;
            tzmoney = (isNaN(tzmoney) || tzmoney == "")? 2 : tzmoney;
            if(Class.C("isspf"))     //胜平负、让球胜平负
            {
               data.tzx = tzxxnames[data.tzvv];
               data.sp = node.attr("sp");
            }
            else if(Class.config('playId') == "42" || Class.config('playId') == "40" || Class.config('playId') == "51")
            {
                 data.tzx = node.attr("v");
                 data.sp = node.attr("sp");
            }
            data.bonus = isNaN(data.sp)? 0.00 : (data.sp * tzmoney).toFixed(2);
            data.tzm = tzmoney;
            var xxnode = $("div[zid='" + data.zid + "_li']");
            if(xxnode == undefined || xxnode.length == 0)
            {	
            	$("#tishi").hide();
                $("div.choose-match ").append(choosetrs[0].tpl(data));
            }
            else
            {
                $("ul[zid='" + data.zid + "_tbs']").append(choosetrs[1].tpl(data));
            }
           
        }
    },
    changebonus:function(type,node)
    {
        if(type == "0")
        {
        	  var sp = node.parents("li").find("a").attr("sp");
            sp = isNaN(sp)? 0.00 : sp;
            node.parents("li").find("em[zid]").html((sp * node.val()).toFixed(2));
            this.changemomey();
        }
        else if(type == "1")
        {
            var Y = this;
            $.each($("#chooselist input[zid]"),function()
            {
                Y.changebonus("0",$(this));
            });
        }
    },
    changemomey:function()     //计算投注总金额及预估总奖金
    {
        var totalmoney = 0;
        var totalbonus = 0.00;
        $("#chooselist input[zid]").each(function()
        {
            totalmoney += parseInt($(this).val());
        });
        $("#allmoney").html(totalmoney);
        $("#chooselist div[zid*='_li']").each(function()
        {
            var temp = 0.00;
            $(this).find("em[zid]").each(function(i,m)
            {
                temp = Math.max(temp,parseFloat($(m).html()));
            });
            totalbonus += temp;
        });
        $("#totalbonus").html(totalbonus.toFixed(2));
    },
    changeselect:function(type,zid)
    {
        $("#vsTable div[zid='" + zid + "'] em[sp]").removeClass("cur");
    },
    changebuybtn:function()
    {
		var Y = this;
        var temp = $("#chooselist input[zid]");
        if(temp.length > 0)
        {
            $("#buylist").show();
            $("#codemsg").hide();
			
			var ltop = $("#vsTable").offset().top;
			var rtop = $("#chooselist").offset().top;
			Y.rscroll(ltop,rtop);
        }
        else
        {
            $("#buylist").hide();
            $("#codemsg").show();
            $("#tzmoney").val(1);
        }
        if(temp.length >= 2)
        {
            $("#jjyhbtn").show();
        }
        else
        {
            $("#jjyhbtn").hide();
        }
        if($("div.choose-match div[zid]").length ==0){
        	$("#tishi").show();
        }
        
        var linode = $("#chooselist li[zid*='_li']");
        if(linode.length > 0)
        {
            linode.css("border-bottom","1px dashed #CCCCCC");
            linode.slice(-1).css("border-bottom","0");
        }
    },
    counthidenmu:function(itemid)
    {
        var Y = this;
        var num = 0;    //统计隐藏场数
        Y.need('tr[zid^='+itemid+']').each(function(o,n){
            if(o.style.display=="none")
            {
                num++;
            }
        });
        $("#yccs_"+itemid).html(num);
        Y.isshowall(itemid);
    },
    isshowall:function(itemid)
    {
        var Y=this;
        $("a[id^=showall_"+itemid+"]").click(function()     //显示所有已隐藏的赛事
        {
            Y.need('tr[zid^='+itemid+']').show();
            $("#yccs_"+itemid).html(0);
        });
    }
});
//引导启动类
Class({
    ready: true,
	index:function (){
    	this.lib.LoadExpect();
//    	 this.goTotop();//返回顶部
//    	Class.C('odds_t','jczq/odds'); 
//    	this.oneodds=true;
		this.onMsg('load_duizhen_succ', function () {
			this._index();
			
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
        })
        btn.css({"position":"fixed",top:top,right:right});
        var areaTop = Y.get("#right_area").getXY().y;
        
        $(window).scroll(function(){
        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
	            	var V = $('#titleTable_r');
	        		if (V[0]) {
	        			var T = $(document),
	        			H = $("#main div.box_m").eq(0),
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
	        					V.css({left: "auto",top: Z+$(window).scrollTop()-140, width: F,position: "absolute"});
	        				}else{
	        					V.css({left: "auto",top: Z, width: F, position: "fixed"});
	        				}
	        			}
	        			Y.get("#titleTable_r").setStyle('z-index: 1;');
	        		}
	            	
	             }else{//停止浮动对齐
            	 Y.get("#titleTable_r").setStyle('z-index: 1; top:0;  left: auto;position: static;');
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
    _index:function (){
        Class.C("isspf",(Class.config('playId') == "72" ||Class.config('playId') == "34"));
    	this.lib.Selector({});
        
        this.lib.Buy();//购买类
       


    }
  
   
}); 
//发起购买
Class('Buy', {
    index:function (){
        this.get('#gobuy,#gohm').click(function (e, Y){//提交
            var  ishm = this.id == 'gohm' ? 1 : 0;
      
           
           

              
//                9739|141023001[3:2,4:0,0:4]/59740|141023002[4:0]
                var bet=$("#infolist div[mid]");
                var arrcode=[]
                var zs=0
                if(bet.length>0){
                	bet.each(function(x,o){
//                		$(o).attr("mid")+"|"+$(o).attr("zid").split("_")[0];
                		var opts=[]
                		$(o).find("li[zid]").each(function(nx,no){
                			opts.push(($(no).attr("zid").split("_")[1]));
                			zs++;
                		})
                		arrcode.push($(o).attr("mid")+"|"+$(o).attr("zid").split("_")[0]+"["+opts+"]");
                	})
                }
//                59968|141027006[2,3]
                Y.get('#codes').val(arrcode.join('/'));
                var money=Y.get("#allmoney").html()*1;
                Y.get('#zhushu').val(zs);
                Y.get('#beishu').val(money/zs/2);
                Y.get('#ishm').val(ishm);//合买与代购
                Y.get('#totalmoney').val(money);
                
              
               
                
               
                var MAX_ALL_MONEY = 200000;
                if (money > MAX_ALL_MONEY) {
                    return this.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!');
                }
                if (ishm){
                	Y.get("#project_form").attr("action", "/phpt/jc/step_1.phpx");
                }else{
                	Y.get("#project_form").attr("action", "/phpt/jc/step_2.phpx");
                }
                Y.get('#project_form').doProp('submit');
       });          
        this.get('#jjyhbtn').click(function (e, Y){
//        	141027001=0:4,141027002=4:0/4:1
//          9739|141023001[3:2,4:0,0:4]/59740|141023002[4:0]
        	 var bet=$("#infolist div[mid]");
             var arrcode=[]
             var zs=0
             if(bet.length>0){
             	bet.each(function(x,o){
             		var opts=[]
             		$(o).find("li[zid]").each(function(nx,no){
             			opts.push(($(no).attr("zid").split("_")[1]).replace("球","").replace("+7","7"));
             			zs++;
             		})
             		arrcode.push($(o).attr("zid").split("_")[0]+"="+opts.join('/'));
             	})
             }
	         var money=Y.get("#allmoney").html()*1;
	         Y.get('#code').val(arrcode.join(','));
	    	 Y.get('#tmoney').val(money);
	    	 Y.get('#muli').val(money/zs/2);
	    	var MAX_ALL_MONEY = 200000;
            if (money > MAX_ALL_MONEY) {
                return Y.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!');
            }
           
////            code	
////            muli	1
////            pnum	2
////            tmoney	4	
////            Y.openUrl('/jc/jjyh_cbf.html?codes=141027001=0:4,141027002=4:0/4:1&tmoney=4&pnum=2&muli=1',1000,650);
          
            Y.get('#jjyh_form').doProp('submit');
//            
       });

    }
    
});