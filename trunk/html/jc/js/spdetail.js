/*----------------------------------------------------------------------------*
 * 竞彩足球开奖页面                                                       *
/* 主程序
------------------------------------------------------------------------------*/
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


/* 显示 当前开奖信息
------------------------------------------------------------------------------*/
Class('Loadsp',{
	index:function(mid){
		
		var expect="";
		if(mid.length!=9){
			alert("参数错误2!");
			window.close();
		}else{
			expect=mid.substr(0,6);
		}
		
		this.LoadDuiZhen(expect,mid);
	},
	
	LoadDuiZhen : function(expect,mid) {

		this.ajax({
					url : "/cpdata/match/jczq/award/"+expect+"/"+mid+".json",
					type : "GET",
					dataType : "json",
					cache : false,
					end : function(data) {
						this.getduizhen(data);											
					},
					error : function() {
						alert("网络故障!");
						return false;
					}
				});
	},
	
	getduizhen:function(data){
	
		var obj = eval("(" + data.text + ")");
		 var row=obj.match.info;
			 if (parseInt(row.ic)==0){
					if(parseInt(row.ms)>=0){//已出赛果
							var rqt=(row.ms*1-row.ss*1)*1+(row.lose)*1;
							if(rqt*1>0){row.rqspf="胜";}else if(rqt*1==0){row.rqspf="平";}else{row.rqspf="负";}
							
							var rt=(row.ms*1-row.ss*1)*1;
							if(rt*1>0){row.spf="胜";}else if(rt*1==0){row.spf="平";}else{row.spf="负";}
							rt=row.ms+""+row.ss;
							row.cbf=row.ms+":"+row.ss;
							var bfstr=["10","20","21","30","31","32","40","41","42","50","51","52","00","11","22","33","01","02","12","03","13","23","04","14","24","05","15","25"];
							var ii=100;
							for(var i=0;i<31;i++){
								if(bfstr[i]==rt){ii=i;}
							}
							if(ii==100){
								if(row.ms*1>row.ss*1){row.cbf="胜其他";}else if(row.ms*1==row.ss*1){row.cbf="平其他";}else{row.cbf="负其他";}
							}
							
							rt=(row.ms*1+row.ss*1)*1;
							if(rt>=7){row.jqs="7+";}else{row.jqs=rt;}
							
							var hrt=(row.hms*1-row.hss*1)*1;
							rt=(row.ms*1-row.ss*1)*1;
							if(hrt*1>0){row.bqc="胜";}else if(hrt*1==0){row.bqc="平";}else{row.bqc="负";}
							if(rt*1>0){row.bqc=row.bqc+"胜";}else if(rt*1==0){row.bqc=row.bqc+"平";}else{row.bqc=row.bqc+"负";}
					}else{
						row.spf="-";
						row.rqspf="-";
						row.cbf="-";
						row.jqs="-";
						row.bqc="-";
					}
				}else{//取消
					row.spf="延";
					row.rqspf="延";
					row.cbf="延";
					row.jqs="延";
					row.bqc="延";
				}
				if (parseInt(row.lose)>0){
					row.lose='<strong class="eng red">'+row.lose+'</strong>';
				}else if (parseInt(row.lose)<0){
					row.lose='<strong class="eng green">'+row.lose+'</strong>';
				}else{
					row.lose="0";
				}
				$("#mid").html(Y.getDate(row.mt).format('YY-MM-DD')+" ("+row.cid+")");
				$("#hn").html(row.mn);
				$("#lose").html(row.lose);
				$("#gn").html(row.sn);
				
				$("#rsspf").html(row.spf);
				$("#rsrqspf").html(row.rqspf);
				$("#rscbf").html(row.cbf);
				$("#rsjqs").html(row.jqs);
				$("#rsbqc").html(row.bqc);
				$("#rsspf1").html(row.spf);
				$("#rscbf1").html(row.cbf);
				$("#rsjqs1").html(row.jqs);
				$("#rsbqc1").html(row.bqc);

		var spfhtml='<tr class="tr2"><th width="130px">发布时间</th><th>胜</th><th>平</th><th>负</th></tr>';
		if(obj.match.spf != undefined){
			var upspf="";
			
			var spf=obj.match.spf;
			if(!this.isArray(spf)){
				var rspf=spf;
				var spfstr=rspf.value.split(",");
				rspf.s3=spfstr[0].trim();
				rspf.s1=spfstr[1].trim();
				rspf.s0=spfstr[2].trim();
			if(upspf!=""){
				var oldstr=upspf.split(",");
				rspf.os3=oldstr[0].trim();
				rspf.os1=oldstr[1].trim();
				rspf.os0=oldstr[2].trim();
				if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
				if(rspf.s1*1>rspf.os1*1){rspf.s1=rspf.s1+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s1*1<rspf.os1*1){rspf.s1=rspf.s1+"<img src='/images/ArrowDown.gif'>";}
				if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
			}
			upspf=rspf.value;
			spfhtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.s3+'</td><td>'+rspf.s1+'</td><td>'+rspf.s0+'</td></tr>';
			}else{
				spf.each(function(rspf,o) {
					var spfstr=rspf.value.split(",");
					rspf.s3=spfstr[0].trim();
					rspf.s1=spfstr[1].trim();
					rspf.s0=spfstr[2].trim();
				if(upspf!=""){
					var oldstr=upspf.split(",");
					rspf.os3=oldstr[0].trim();
					rspf.os1=oldstr[1].trim();
					rspf.os0=oldstr[2].trim();
					if(rspf.s3*1>rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s3*1<rspf.os3*1){rspf.s3=rspf.s3+"<img src='/images/ArrowDown.gif'>";}
					if(rspf.s1*1>rspf.os1*1){rspf.s1=rspf.s1+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s1*1<rspf.os1*1){rspf.s1=rspf.s1+"<img src='/images/ArrowDown.gif'>";}
					if(rspf.s0*1>rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rspf.s0*1<rspf.os0*1){rspf.s0=rspf.s0+"<img src='/images/ArrowDown.gif'>";}
				}
				upspf=rspf.value;
				spfhtml +='<tr class="tr4"><td>'+rspf.time+'</td><td>'+rspf.s3+'</td><td>'+rspf.s1+'</td><td>'+rspf.s0+'</td></tr>';
				});
			}
			$("#spftable").html(spfhtml);
		} else {
			$("#spftable").html(spfhtml+"<tr class='tr2'><td colspan='4'>未开玩法</td></tr>");
		}
		
		var rqspfhtml='<tr class="tr2"><th width="130px">发布时间</th><th>胜</th><th>平</th><th>负</th></tr>';
		var uprqspf="";
		
		var rqspf=obj.match.rspf;
		if(!this.isArray(rqspf)){
			var rrqspf=rqspf;
			var rqspfstr=rrqspf.value.split(",");
			rrqspf.s3=rqspfstr[0].trim();
			rrqspf.s1=rqspfstr[1].trim();
			rrqspf.s0=rqspfstr[2].trim();
		if(uprqspf!=""){
			var oldstr=uprqspf.split(",");
			rrqspf.os3=oldstr[0].trim();
			rrqspf.os1=oldstr[1].trim();
			rrqspf.os0=oldstr[2].trim();
			if(rrqspf.s3*1>rrqspf.os3*1){rrqspf.s3=rrqspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s3*1<rrqspf.os3*1){rrqspf.s3=rrqspf.s3+"<img src='/images/ArrowDown.gif'>";}
			if(rrqspf.s1*1>rrqspf.os1*1){rrqspf.s1=rrqspf.s1+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s1*1<rrqspf.os1*1){rrqspf.s1=rrqspf.s1+"<img src='/images/ArrowDown.gif'>";}
			if(rrqspf.s0*1>rrqspf.os0*1){rrqspf.s0=rrqspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s0*1<rrqspf.os0*1){rrqspf.s0=rrqspf.s0+"<img src='/images/ArrowDown.gif'>";}
		}
		uprqspf=rrqspf.value;
		rqspfhtml +='<tr class="tr4"><td>'+rrqspf.time+'</td><td>'+rrqspf.s3+'</td><td>'+rrqspf.s1+'</td><td>'+rrqspf.s0+'</td></tr>';
		}else{
			rqspf.each(function(rrqspf,o) {
				var rqspfstr=rrqspf.value.split(",");
				rrqspf.s3=rqspfstr[0].trim();
				rrqspf.s1=rqspfstr[1].trim();
				rrqspf.s0=rqspfstr[2].trim();
			if(uprqspf!=""){
				var oldstr=uprqspf.split(",");
				rrqspf.os3=oldstr[0].trim();
				rrqspf.os1=oldstr[1].trim();
				rrqspf.os0=oldstr[2].trim();
				if(rrqspf.s3*1>rrqspf.os3*1){rrqspf.s3=rrqspf.s3+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s3*1<rrqspf.os3*1){rrqspf.s3=rrqspf.s3+"<img src='/images/ArrowDown.gif'>";}
				if(rrqspf.s1*1>rrqspf.os1*1){rrqspf.s1=rrqspf.s1+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s1*1<rrqspf.os1*1){rrqspf.s1=rrqspf.s1+"<img src='/images/ArrowDown.gif'>";}
				if(rrqspf.s0*1>rrqspf.os0*1){rrqspf.s0=rrqspf.s0+"<img src='/images/ArrowUp.gif'>";}else if(rrqspf.s0*1<rrqspf.os0*1){rrqspf.s0=rrqspf.s0+"<img src='/images/ArrowDown.gif'>";}
			}
			uprqspf=rrqspf.value;
			rqspfhtml +='<tr class="tr4"><td>'+rrqspf.time+'</td><td>'+rrqspf.s3+'</td><td>'+rrqspf.s1+'</td><td>'+rrqspf.s0+'</td></tr>';
			});
		}
		$("#rqspftable").html(rqspfhtml);
		
		
		
		var jqshtml='<tr class="tr2"><th width="130px">发布时间</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7+</th></tr>';
		var upjqs="";
		
		var jqs=obj.match.jqs;
		if(!this.isArray(jqs)){
			var rjqs=jqs;
			var jqsstr=rjqs.value.split(",");
			rjqs.j0=jqsstr[0].trim();
			rjqs.j1=jqsstr[1].trim();
			rjqs.j2=jqsstr[2].trim();
			rjqs.j3=jqsstr[3].trim();
			rjqs.j4=jqsstr[4].trim();
			rjqs.j5=jqsstr[5].trim();
			rjqs.j6=jqsstr[6].trim();
			rjqs.j7=jqsstr[7].trim();
		if(upjqs!=""){
			var oldstr=upjqs.split(",");
			rjqs.oj0=oldstr[0].trim();
			rjqs.oj1=oldstr[1].trim();
			rjqs.oj2=oldstr[2].trim();
			rjqs.oj3=oldstr[3].trim();
			rjqs.oj4=oldstr[4].trim();
			rjqs.oj5=oldstr[5].trim();
			rjqs.oj6=oldstr[6].trim();
			rjqs.oj7=oldstr[7].trim();
			if(rjqs.j0*1>rjqs.oj0*1){rjqs.j0=rjqs.j0+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j0*1<rjqs.oj0*1){rjqs.j0=rjqs.j0+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j1*1>rjqs.oj1*1){rjqs.j1=rjqs.j1+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j1*1<rjqs.oj1*1){rjqs.j1=rjqs.j1+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j2*1>rjqs.oj2*1){rjqs.j2=rjqs.j2+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j2*1<rjqs.oj2*1){rjqs.j2=rjqs.j2+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j3*1>rjqs.oj3*1){rjqs.j3=rjqs.j3+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j3*1<rjqs.oj3*1){rjqs.j3=rjqs.j3+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j4*1>rjqs.oj4*1){rjqs.j4=rjqs.j4+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j4*1<rjqs.oj4*1){rjqs.j4=rjqs.j4+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j5*1>rjqs.oj5*1){rjqs.j5=rjqs.j5+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j5*1<rjqs.oj5*1){rjqs.j5=rjqs.j5+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j6*1>rjqs.oj6*1){rjqs.j6=rjqs.j6+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j6*1<rjqs.oj6*1){rjqs.j6=rjqs.j6+"<img src='/images/ArrowDown.gif'>";}
			if(rjqs.j7*1>rjqs.oj7*1){rjqs.j7=rjqs.j7+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j7*1<rjqs.oj7*1){rjqs.j7=rjqs.j7+"<img src='/images/ArrowDown.gif'>";}
		}
		upjqs=rjqs.value;
		jqshtml +='<tr class="tr4"><td>'+rjqs.time+'</td><td>'+rjqs.j0+'</td><td>'+rjqs.j1+'</td><td>'+rjqs.j2+'</td><td>'+rjqs.j3+'</td><td>'+rjqs.j4+'</td><td>'+rjqs.j5+'</td><td>'+rjqs.j6+'</td><td>'+rjqs.j7+'</td></tr>';
		}else{
			jqs.each(function(rjqs,o) {
				var jqsstr=rjqs.value.split(",");
				rjqs.j0=jqsstr[0].trim();
				rjqs.j1=jqsstr[1].trim();
				rjqs.j2=jqsstr[2].trim();
				rjqs.j3=jqsstr[3].trim();
				rjqs.j4=jqsstr[4].trim();
				rjqs.j5=jqsstr[5].trim();
				rjqs.j6=jqsstr[6].trim();
				rjqs.j7=jqsstr[7].trim();
			if(upjqs!=""){
				var oldstr=upjqs.split(",");
				rjqs.oj0=oldstr[0].trim();
				rjqs.oj1=oldstr[1].trim();
				rjqs.oj2=oldstr[2].trim();
				rjqs.oj3=oldstr[3].trim();
				rjqs.oj4=oldstr[4].trim();
				rjqs.oj5=oldstr[5].trim();
				rjqs.oj6=oldstr[6].trim();
				rjqs.oj7=oldstr[7].trim();
				if(rjqs.j0*1>rjqs.oj0*1){rjqs.j0=rjqs.j0+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j0*1<rjqs.oj0*1){rjqs.j0=rjqs.j0+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j1*1>rjqs.oj1*1){rjqs.j1=rjqs.j1+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j1*1<rjqs.oj1*1){rjqs.j1=rjqs.j1+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j2*1>rjqs.oj2*1){rjqs.j2=rjqs.j2+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j2*1<rjqs.oj2*1){rjqs.j2=rjqs.j2+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j3*1>rjqs.oj3*1){rjqs.j3=rjqs.j3+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j3*1<rjqs.oj3*1){rjqs.j3=rjqs.j3+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j4*1>rjqs.oj4*1){rjqs.j4=rjqs.j4+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j4*1<rjqs.oj4*1){rjqs.j4=rjqs.j4+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j5*1>rjqs.oj5*1){rjqs.j5=rjqs.j5+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j5*1<rjqs.oj5*1){rjqs.j5=rjqs.j5+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j6*1>rjqs.oj6*1){rjqs.j6=rjqs.j6+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j6*1<rjqs.oj6*1){rjqs.j6=rjqs.j6+"<img src='/images/ArrowDown.gif'>";}
				if(rjqs.j7*1>rjqs.oj7*1){rjqs.j7=rjqs.j7+"<img src='/images/ArrowUp.gif'>";}else if(rjqs.j7*1<rjqs.oj7*1){rjqs.j7=rjqs.j7+"<img src='/images/ArrowDown.gif'>";}
			}
			upjqs=rjqs.value;
			jqshtml +='<tr class="tr4"><td>'+rjqs.time+'</td><td>'+rjqs.j0+'</td><td>'+rjqs.j1+'</td><td>'+rjqs.j2+'</td><td>'+rjqs.j3+'</td><td>'+rjqs.j4+'</td><td>'+rjqs.j5+'</td><td>'+rjqs.j6+'</td><td>'+rjqs.j7+'</td></tr>';
			});
		}
		$("#jqstable").html(jqshtml);
		
		var bqchtml='<tr class="tr2"><th width="130px">发布时间</th><th>胜胜</th><th>胜平</th><th>胜负</th><th>平胜</th><th>平平</th><th>平负</th><th>负胜</th><th>负平</th><th>负负</th></tr>';
		if(obj.match.bqc != undefined){
			var upbqc="";
			
			var bqc=obj.match.bqc;
			if(!this.isArray(bqc)){
				var rbqc=bqc;
				var bqcstr=rbqc.value.split(",");
				rbqc.j0=bqcstr[0].trim();
				rbqc.j1=bqcstr[1].trim();
				rbqc.j2=bqcstr[2].trim();
				rbqc.j3=bqcstr[3].trim();
				rbqc.j4=bqcstr[4].trim();
				rbqc.j5=bqcstr[5].trim();
				rbqc.j6=bqcstr[6].trim();
				rbqc.j7=bqcstr[7].trim();
				rbqc.j8=bqcstr[8].trim();
				if(upbqc!=""){
					var oldstr=upbqc.split(",");
					rbqc.oj0=oldstr[0].trim();
					rbqc.oj1=oldstr[1].trim();
					rbqc.oj2=oldstr[2].trim();
					rbqc.oj3=oldstr[3].trim();
					rbqc.oj4=oldstr[4].trim();
					rbqc.oj5=oldstr[5].trim();
					rbqc.oj6=oldstr[6].trim();
					rbqc.oj7=oldstr[7].trim();
					rbqc.oj8=oldstr[8].trim();
					if(rbqc.j0*1>rbqc.oj0*1){rbqc.j0=rbqc.j0+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j0*1<rbqc.oj0*1){rbqc.j0=rbqc.j0+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j1*1>rbqc.oj1*1){rbqc.j1=rbqc.j1+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j1*1<rbqc.oj1*1){rbqc.j1=rbqc.j1+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j2*1>rbqc.oj2*1){rbqc.j2=rbqc.j2+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j2*1<rbqc.oj2*1){rbqc.j2=rbqc.j2+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j3*1>rbqc.oj3*1){rbqc.j3=rbqc.j3+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j3*1<rbqc.oj3*1){rbqc.j3=rbqc.j3+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j4*1>rbqc.oj4*1){rbqc.j4=rbqc.j4+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j4*1<rbqc.oj4*1){rbqc.j4=rbqc.j4+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j5*1>rbqc.oj5*1){rbqc.j5=rbqc.j5+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j5*1<rbqc.oj5*1){rbqc.j5=rbqc.j5+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j6*1>rbqc.oj6*1){rbqc.j6=rbqc.j6+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j6*1<rbqc.oj6*1){rbqc.j6=rbqc.j6+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j7*1>rbqc.oj7*1){rbqc.j7=rbqc.j7+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j7*1<rbqc.oj7*1){rbqc.j7=rbqc.j7+"<img src='/images/ArrowDown.gif'>";}
					if(rbqc.j8*1>rbqc.oj8*1){rbqc.j8=rbqc.j8+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j8*1<rbqc.oj8*1){rbqc.j8=rbqc.j8+"<img src='/images/ArrowDown.gif'>";}
				}
				upbqc=rbqc.value;
				bqchtml +='<tr class="tr4"><td>'+rbqc.time+'</td><td>'+rbqc.j0+'</td><td>'+rbqc.j1+'</td><td>'+rbqc.j2+'</td><td>'+rbqc.j3+'</td><td>'+rbqc.j4+'</td><td>'+rbqc.j5+'</td><td>'+rbqc.j6+'</td><td>'+rbqc.j7+'</td><td>'+rbqc.j8+'</td></tr>';
			}else{
				bqc.each(function(rbqc,o) {
					var bqcstr=rbqc.value.split(",");
					rbqc.j0=bqcstr[0].trim();
					rbqc.j1=bqcstr[1].trim();
					rbqc.j2=bqcstr[2].trim();
					rbqc.j3=bqcstr[3].trim();
					rbqc.j4=bqcstr[4].trim();
					rbqc.j5=bqcstr[5].trim();
					rbqc.j6=bqcstr[6].trim();
					rbqc.j7=bqcstr[7].trim();
					rbqc.j8=bqcstr[8].trim();
					if(upbqc!=""){
						var oldstr=upbqc.split(",");
						rbqc.oj0=oldstr[0].trim();
						rbqc.oj1=oldstr[1].trim();
						rbqc.oj2=oldstr[2].trim();
						rbqc.oj3=oldstr[3].trim();
						rbqc.oj4=oldstr[4].trim();
						rbqc.oj5=oldstr[5].trim();
						rbqc.oj6=oldstr[6].trim();
						rbqc.oj7=oldstr[7].trim();
						rbqc.oj8=oldstr[8].trim();
						if(rbqc.j0*1>rbqc.oj0*1){rbqc.j0=rbqc.j0+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j0*1<rbqc.oj0*1){rbqc.j0=rbqc.j0+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j1*1>rbqc.oj1*1){rbqc.j1=rbqc.j1+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j1*1<rbqc.oj1*1){rbqc.j1=rbqc.j1+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j2*1>rbqc.oj2*1){rbqc.j2=rbqc.j2+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j2*1<rbqc.oj2*1){rbqc.j2=rbqc.j2+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j3*1>rbqc.oj3*1){rbqc.j3=rbqc.j3+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j3*1<rbqc.oj3*1){rbqc.j3=rbqc.j3+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j4*1>rbqc.oj4*1){rbqc.j4=rbqc.j4+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j4*1<rbqc.oj4*1){rbqc.j4=rbqc.j4+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j5*1>rbqc.oj5*1){rbqc.j5=rbqc.j5+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j5*1<rbqc.oj5*1){rbqc.j5=rbqc.j5+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j6*1>rbqc.oj6*1){rbqc.j6=rbqc.j6+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j6*1<rbqc.oj6*1){rbqc.j6=rbqc.j6+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j7*1>rbqc.oj7*1){rbqc.j7=rbqc.j7+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j7*1<rbqc.oj7*1){rbqc.j7=rbqc.j7+"<img src='/images/ArrowDown.gif'>";}
						if(rbqc.j8*1>rbqc.oj8*1){rbqc.j8=rbqc.j8+"<img src='/images/ArrowUp.gif'>";}else if(rbqc.j8*1<rbqc.oj8*1){rbqc.j8=rbqc.j8+"<img src='/images/ArrowDown.gif'>";}
					}
					upbqc=rbqc.value;
					bqchtml +='<tr class="tr4"><td>'+rbqc.time+'</td><td>'+rbqc.j0+'</td><td>'+rbqc.j1+'</td><td>'+rbqc.j2+'</td><td>'+rbqc.j3+'</td><td>'+rbqc.j4+'</td><td>'+rbqc.j5+'</td><td>'+rbqc.j6+'</td><td>'+rbqc.j7+'</td><td>'+rbqc.j8+'</td></tr>';
				});
			}
			
			$("#bqctable").html(bqchtml);
		}else{
			$("#bqctable").html(bqchtml + "<tr class='tr4'><td colspan='10'>未开玩法</td></tr>");
		}
		
		var cbfhtml='<tr class="tr2"><th width="130px">发布时间</th><th>1:0</th><th>2:0</th><th>2:1</th><th>3:0</th><th>3:1</th><th>3:2</th><th>4:0</th><th>4:1</th><th>4:2</th><th>5:0</th><th>5:1</th><th>5:2</th><th>胜其他</th><th>0:0</th><th>1:1</th><th>2:2</th><th>3:3</th><th>平其他</th><th>0:1</th><th>0:2</th><th>1:2</th><th>0:3</th><th>1:3</th><th>2:3</th><th>0:4</th><th>1:4</th><th>2:4</th><th>0:5</th><th>1:5</th><th>2:5</th><th>负其他</th></tr>';
		var upbqc="";
		
		var cbf=obj.match.cbf;
		if(!this.isArray(cbf)){
			cbfhtml +='<tr class="tr5"><td>'+cbf.time+'</td>';
			var cbfstr=cbf.value.split(",");
			for(var ii=0;ii<cbfstr.length;ii++){
				cbfhtml +='<td>'+cbfstr[ii]+'</td>';
			}
			cbfhtml +='</tr>';
		}else{
			cbf.each(function(rcbf,o) {
				cbfhtml +='<tr class="tr5"><td>'+rcbf.time+'</td>';
				var cbfstr=rcbf.value.split(",");
				for(var ii=0;ii<cbfstr.length;ii++){
					cbfhtml +='<td>'+cbfstr[ii]+'</td>';
				}
				cbfhtml +='</tr>';
			});
		}
		$("#cbftable").html(cbfhtml);
		this.postMsg('load_duizhen_succ');			
	}
});