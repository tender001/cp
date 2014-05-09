//竞彩篮球场次SP走势                                                       *

Class( {
	ready : true,
	use   : 'mask',
	index:function(){
		var mid=location.search.getParam('mid');
		if (mid== "") {//
			window.close();
		}else{
			this.lib.Loadsp(mid);
		}		
	}

} );

/* 显示 信息
--*/
Class('Loadsp',{
	index:function(mid){
		
		var expect="";
		if(mid.length!=9){
			alert("参数错误2!");
			window.close();
		}else{
			expect=mid.substr(0,6);
		}
		this.LoadZhen(expect,mid);
	},
	
	LoadZhen : function(expect,mid) {
		this.ajax({
					url : "/cpdata/match/jclq/award/"+expect+"/"+mid+".json",
					type : "GET",
					dataType : "json",
					cache : false,
					end : function(data) {
						this.getduizhen(data);											
					},
					error : function() {
						return false;
					}
				});
	},
	
	getduizhen:function(data){
	
		var obj = eval("(" + data.text + ")");
		 var row=obj.match.info;
		 if (parseInt(row.ic)==0){
				if(row.rs.length>5){//已出赛果
					row.bf=row.ss+":"+row.ms;
					
					var rsstr=row.rs.split(";");
					
					var rt=(row.ms*1-row.ss*1)*1;
					if(rsstr[0].length>3){if(rt*1>0){row.spf="主胜";}else{row.spf="主负";}}
					
					if(rsstr[2].length>4){
					if(rt>0&&rt<6){row.cbf="主胜1-5";}
					else if(rt>5&&rt<11){row.cbf="主胜6-10";}
					else if(rt>10&&rt<16){row.cbf="主胜11-15";}
					else if(rt>15&&rt<21){row.cbf="主胜16-20";}
					else if(rt>20&&rt<26){row.cbf="主胜21-25";}
					else if(rt>25){row.cbf="主胜26+";}
					else if(rt>-6&&rt<0){row.cbf="客胜1-5";}
					else if(rt>-11&&rt<-5){row.cbf="客胜6-10";}
					else if(rt<-10&&rt>-16){row.cbf="客胜11-15";}
					else if(rt<-15&&rt>-21){row.cbf="客胜16-20";}
					else if(rt<-20&&rt>-26){row.cbf="客胜21-25";}
					else if(rt<-25){row.cbf="客胜26+";}
					}
					rt=rsstr[1];
					rt=rt.split(":")[1];
					var rtstr=rt.split(",");
					row.opstr1="<select onchange=javascript:document.getElementById(\"rfsf2\").innerHTML=this.options[this.selectedIndex].value>";
					var r1,r2;
					for(ii=0;ii<rtstr.length;ii++){
						r1=rtstr[ii].split("|")[0];
						r2=rtstr[ii].split("|")[1];
						if(r1*1>1){r1="让分主胜";}else{r1="让分主负";}
						if(ii==0){row.jqs=r1;}
						row.opstr1 +='<option value="'+r1+'">'+r2+'</option>';
					}
					row.opstr1 +='</select>';

					rt=rsstr[3];
					rt=rt.split(":")[1];
					var rtstr=rt.split(",");
					row.opstr2="<select onchange=javascript:document.getElementById(\"dxf2\").innerHTML=this.options[this.selectedIndex].value>";
					var r3,r4;
					for(ii=0;ii<rtstr.length;ii++){
						r3=rtstr[ii].split("|")[0];
						r4=rtstr[ii].split("|")[1];
						if(r3*1>1){r3="大分";}else{r3="小分";}
						if(ii==0){row.bqc=r3;}
						row.opstr2 +='<option value="'+r3+'">'+r4+'</option>';
					}
					row.opstr2 +='</select>';	
					//}
				}else{
					row.spf="-";
					row.cbf="-";
					row.jqs="-";
					row.bqc="-";
				}
			}else{//取消
				row.spf="取消";
				row.cbf="取消";
				row.jqs="取消";
				row.bqc="取消";
			}
			
			$("#mid").html("开赛时间:"+Y.getDate(row.mt).format('YY-MM-DD hh:mm:ss')+" ("+row.cid+")");
			$("#hn").html(row.mn);
			$("#lose").html(row.lose);
			$("#gn").html(row.sn);
			$("#bf").html(row.bf);
			
			$("#sf").html(row.spf);
			$("#rfsf1").html(row.opstr1);
			$("#rfsf2").html(row.jqs);
			$("#sfc").html(row.cbf);
			$("#dxf1").html(row.opstr2);
			$("#dxf2").html(row.bqc);
		
		var spfhtml='<tr class="tr2"><th width="130px">发布时间</th><th>主负</th><th>主胜</th></tr>';
		var upspf="";
		
		var sf=obj.match.sf;
		if(!this.isArray(sf)){
			var rspf=sf;
			var spfstr=rspf.value.split(",");
			rspf.s0=spfstr[1].trim();
			rspf.s3=spfstr[2].trim();
		if(upspf!=""){
			var oldstr=upspf.split(",");
			rspf.os0=oldstr[1].trim();
			rspf.os3=oldstr[2].trim();
			if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
			if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
		}
		upspf=rspf.value;
		spfhtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
		}else{
			sf.each(function(rspf,o) {
				var spfstr=rspf.value.split(",");
				rspf.s0=spfstr[1].trim();
				rspf.s3=spfstr[2].trim();
			if(upspf!=""){
				var oldstr=upspf.split(",");
				rspf.os0=oldstr[1].trim();
				rspf.os3=oldstr[2].trim();
				if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
				if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
			}
			upspf=rspf.value;
			spfhtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
			});
		}
		$("#sftable").html(spfhtml);
		
		var jqshtml='<tr class="tr2"><th width="130px">发布时间</th><th>让分</th><th>主负</th><th>主胜</th></tr>';
		var upjqs="";
		
		var rfsf=obj.match.rfsf;
		if(!this.isArray(rfsf)){
			var rspf=rfsf;
			var spfstr=rspf.value.split(",");
		    rspf.rf=spfstr[0].trim();
			rspf.s0=spfstr[1].trim();
			rspf.s3=spfstr[2].trim();
		if(upjqs!=""){
			var oldstr=upjqs.split(",");
			rspf.os0=oldstr[1].trim();
			rspf.os3=oldstr[2].trim();
			if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
			if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
		}
		if(parseInt(rspf.rf)>0){
			rspf.rf="<font color='red'><b>"+rspf.rf+"</b></font>";
		}else{
			rspf.rf="<font color='green'><b>"+rspf.rf+"</b></font>";
		}
		upjqs=rspf.value;
		jqshtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.rf+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
		}else{
			rfsf.each(function(rspf,o) {
				var spfstr=rspf.value.split(",");
			    rspf.rf=spfstr[0].trim();
				rspf.s0=spfstr[1].trim();
				rspf.s3=spfstr[2].trim();
			if(upjqs!=""){
				var oldstr=upjqs.split(",");
				rspf.os0=oldstr[1].trim();
				rspf.os3=oldstr[2].trim();
				if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
				if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
			}
			if(parseInt(rspf.rf)>0){
				rspf.rf="<font color='red'><b>"+rspf.rf+"</b></font>";
			}else{
				rspf.rf="<font color='green'><b>"+rspf.rf+"</b></font>";
			}
			upjqs=rspf.value;
			jqshtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.rf+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
			});
		}
		$("#rfsftable").html(jqshtml);
		
		var bqchtml='<tr class="tr2"><th width="130px">发布时间</th><th>预设总分</th><th>大分</th><th>小分</th></tr>';
		var upbqc="";
		
		var dxf=obj.match.dxf;
		if(!this.isArray(dxf)){
			var rspf=dxf;
			var spfstr=rspf.value.split(",");
		    rspf.rf=spfstr[0].trim();
			rspf.s0=spfstr[1].trim();
			rspf.s3=spfstr[2].trim();
		if(upbqc!=""){
			var oldstr=upbqc.split(",");
			rspf.os0=oldstr[1].trim();
			rspf.os3=oldstr[2].trim();
			if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
			if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
		}
		
		rspf.rf="<font color='blue'><b>"+rspf.rf.replaceAll("\\+", "")+"</b></font>";

		upbqc=rspf.value;
		bqchtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.rf+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
		}else{
			dxf.each(function(rspf,o) {
				var spfstr=rspf.value.split(",");
			    rspf.rf=spfstr[0].trim();
				rspf.s0=spfstr[1].trim();
				rspf.s3=spfstr[2].trim();
			if(upbqc!=""){
				var oldstr=upbqc.split(",");
				rspf.os0=oldstr[1].trim();
				rspf.os3=oldstr[2].trim();
				if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
				if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
			}
			
			rspf.rf="<font color='blue'><b>"+rspf.rf.replaceAll("\\+", "")+"</b></font>";

			upbqc=rspf.value;
			bqchtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.rf+'</td><td>'+rspf.s0+'</td><td>'+rspf.s3+'</td></tr>';
			});
		}
		$("#bqctable").html(bqchtml);
		
		var cbfhtml='<tr class="tr2"><th width="130px">发布时间</th><th>客胜</br>1-5</th><th>客胜</br>6-10</th><th>客胜</br>11-15</th><th>客胜</br>16-20</th><th>客胜</br>21-25</th><th>客胜</br>26+</th><th>主胜</br>1-5</th><th>主胜</br>6-10</th><th>主胜</br>11-15</th><th>主胜</br>16-20</th><th>主胜</br>21-25</th><th>主胜</br>26+</th></tr>';
		var upbqc="";
		
		var sfc=obj.match.sfc;
		if(!this.isArray(sfc)){
			cbfhtml +='<tr class="tr5"><td>'+sfc.time+'</td>';
			var cbfstr=sfc.value.split(",");
			for(var ii=1;ii<cbfstr.length;ii++){
				cbfhtml +='<td>'+cbfstr[ii]+'</td>';
			}
			cbfhtml +='</tr>';
		}else{
			sfc.each(function(rcbf,o) {
				cbfhtml +='<tr class="tr5"><td>'+rcbf.time+'</td>';
				var cbfstr=rcbf.value.split(",");
				for(var ii=1;ii<cbfstr.length;ii++){
					cbfhtml +='<td>'+cbfstr[ii]+'</td>';
				}
				cbfhtml +='</tr>';
			});
		}
		$("#cbftable").html(cbfhtml);
		this.postMsg('load_duizhen_succ');			
	}
});