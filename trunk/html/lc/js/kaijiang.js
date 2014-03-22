//竞彩篮球开奖公告
Class( {
	ready : true,
	  use : 'mask',
	index:function(){
		this.init();
		this.onMsg('msg_get_expect_suc', function (expect){
		    this.lib.Loadduizhen(expect);
        });	
	},
	
    init: function (){//处理期次
    	if (location.search.getParam('expect') != "") {//期号
			$("#expect").val(location.search.getParam('expect'));
		}
		this.ajax({
			url : "/cpdata/match/jclq/award/day.json",
			type : "get",
			end : function(d) {
			    var obj = eval("(" + d.text + ")");
				var r = obj.rows.row;
				var expectlist = [];
				r.each(function(a,b) {
					var pid = a.did;
					expectlist[expectlist.length] = [pid];
				});
					
					var html='';
					var nowexpect='';
					if (expectlist.length>0){
						for ( var i = 0; i < expectlist.length; i++) {
							if (i==0){
								nowexpect=expectlist[i][0];
							}
							html+='<option value="'+expectlist[i][0]+'">20'+expectlist[i][0].substr(0,2)+'-'+expectlist[i][0].substr(2,2)+'-'+expectlist[i][0].substr(4,2)+'</option>';
						}		
					}
					
					$("#expect_select_span").html('<select id="expect_select">'+html+'</select>');	
					
					if ($("#expect").val()==''){
						$("#expect").val(nowexpect);
						$("#expect_select").get(0).selectedIndex=0;
					}else{
						nowexpect=$("#expect").val();
						$("#expect_select option[value="+$("#expect").val()+"]").attr("selected", true);						
					}

					this.get('#expect_select').change( function() {
						var url = location.href.replace(/#.*/, '');
						if (url.indexOf('expect') != -1) {
							url = url.replace(/expect=.+?(?=&|$)/ig, 'expect=' + this.value.split('|')[0]);
						} else if (url.indexOf('?') != -1 && url.indexOf('=') != -1) {
							url += '&expect=' + this.value.split('|')[0];
						} else {
							url += '?expect=' + this.value.split('|')[0];
						}
						location.replace(url);
					});
					this.postMsg('msg_get_expect_suc',nowexpect);
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
    }
});

// 显示
Class('Loadduizhen',{
	index:function(expect){
		this.LoadDuiZhen(expect);
	},
	
	LoadDuiZhen : function(expect) {
		this.ajax({
					url : "/cpdata/match/jclq/award/"+expect+"/"+expect+".json",
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
		 var html = [];
		 var tableTpl=['<tr>'+
			           '<td>{$cid}</td>'+
			           '<td style="background:{$cl};color:#fff" title="{$mname}">{$sname}</td>'+
			           '<td title="开赛时间：{$mt}">{$short_mt}</td>'+
			           '<td>{$sn}</td>'+
			           '<td>{$mn}</td>'+
			           '<td><font>{$bf}</font></td>'+
			           '<td>{$spf}</td>'+
			           '<td><select onchange=javascript:document.getElementById(\"sf{$mid}\").innerHTML=this.options[this.selectedIndex].value>{$opstr1}</select>&nbsp;<span id="sf{$mid}">{$jqs}</span></td>'+
			           '<td>{$cbf}</td>'+
			           '<td><select onchange=javascript:document.getElementById(\"dxf{$mid}\").innerHTML=this.options[this.selectedIndex].value>{$opstr2}</select>&nbsp;<span id="dxf{$mid}">{$bqc}</span></td>'+
			           '<td>{$url}</td>'+
			           '</tr>'];	
		
		 var obj = eval("(" + data.text + ")");
		 var rx=obj.rows.row;
		 if(!this.isArray(rx)){rx = new Array(rx);}
		 rx.each(function(row,o) {
			 row.index=row.mid;
				row.short_mt=Y.getDate(row.mt).format('MM-DD hh:mm');
				row.sname=row.mname.substr(0,4);
				if(row.cl.length<3){row.cl="blue";}
				if (parseInt(row.ic)==0){
					if(row.rs.length>2){//已出赛果
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
							row.opstr1="";
							var r1,r2,temp1;
							for(ii=0;ii<rtstr.length;ii++){
								r1=rtstr[ii].split("|")[0];
								r2=rtstr[ii].split("|")[1];
								if(ii==0){temp1=r1;}else if(temp1!=r1){row.jqs="<span style='color:red'>"+row.jqs+"</span>";}
								if(r1*1>1){r1="让分主胜";}else{r1="让分主负";}
								if(ii==0){row.jqs=r1;}
								row.opstr1 +='<option value="'+r1+'">'+r2+'</option>';
							}
							rt=rsstr[3];
							rt=rt.split(":")[1];
							var rtstr=rt.split(",");
							row.opstr2="";
							var r3,r4,temp2;
							for(ii=0;ii<rtstr.length;ii++){
								r3=rtstr[ii].split("|")[0];
								r4=rtstr[ii].split("|")[1];
								if(ii==0){temp2=r3;}else if(temp2!=r3){row.bqc="<span style='color:red'>"+row.bqc+"</span>";}
								if(r3*1>1){r3="大分";}else{r3="小分";}
								if(ii==0){row.bqc=r3;}
								row.opstr2 +='<option value="'+r3+'">'+r4+'</option>';
							}

					}else{
						row.bf="开奖中";
						row.spf="";
						row.cbf="";
						row.jqs="";
						row.bqc="";
					}
					row.url='<a href="/lc/sp-detail.html?mid='+row.tid+'" target="_blank" title="点击查看走势" class="a_pl">走势</a>';
				}else{//取消
					row.bf="取消";
					row.spf="-";
					row.cbf="-";
					row.jqs="-";
					row.bqc="-";
					row.url='-';
				}
				html[html.length] = tableTpl[0].tpl(row);
		 });
		$("#vsTable").html(html.join(''));
		this.postMsg('load_duizhen_succ');			
	}
});