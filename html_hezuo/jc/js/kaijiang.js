/*----------------------------------------------------------------------------*
 * 竞彩足球开奖公告页面   
------------------------------------------------------------------------------*/
Class( {
	ready : true,
	use   : 'mask',
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
			url : "/cpdata/match/jczq/award/day.json",
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
					var find = false;
					var nowexpect='';
					if (expectlist.length>0){
						for ( var i = 0; i < expectlist.length; i++) {
							if (i==0){
								nowexpect=expectlist[i][0];
							}
							html+='<option value="'+expectlist[i][0]+'">20'+expectlist[i][0].substr(0,2)+'-'+expectlist[i][0].substr(2,2)+'-'+expectlist[i][0].substr(4,2)+'</option>';
						}		
					}
					
					$("#expect_select_div").html('<select id="expect_select">'+html+'</select>');	
					
					if ($("#expect").val()==''){
						$("#expect").attr("value",nowexpect);
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
					} );
					
					this.postMsg('msg_get_expect_suc',nowexpect);
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
    }
} );

/* 显示 当前对阵
------------------------------------------------------------------------------*/
Class('Loadduizhen',{
	index:function(expect){
		this.LoadDuiZhen(expect);
	},
	
	LoadDuiZhen : function(expect) {
		if ($("#vsTable").size()==0){
			return false;
		}		
			
		this.ajax({
					url : "/cpdata/match/jczq/award/"+expect+"/"+expect+".json",
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
		 var html = [];
		 var tableTpl=['<tr>'+
			           '<td>{$cid}</td>'+
			           '<td style="background:{$cl}; color: #fff" title="{$mname}">{$sname}</td>'+
			           '<td title="开赛时间：{$mt}">{$short_mt}</td>'+
			           '<td>{$mn}{$lose}</td>'+
			           '<td>{$sn}</td>'+
			           '<td>{$bf1}</td>'+
			           '<td>{$bf2}</td>'+
			           '<td><font>{$spf}</font></td>'+
			           '<td><font>{$rqspf}</font></td>'+
			           '<td><font>{$jqs}</font></td>'+
			           '<td><font>{$cbf}</font></td>'+
			           '<td><font>{$bqc}</font></td>'+
			           '<td>{$url}</td>'+
			           '</tr>'
	    		];	
		
		 var obj = eval("(" + data.text + ")");
		 var rt=obj.rows.row;
		 if(!this.isArray(rt)){rt=new Array(rt);}
		 rt.each(function(row,o) {
			 row.index=row.mid;
				row.short_mt=Y.getDate(row.mt).format('MM-DD hh:mm');
				row.sname=row.mname.substr(0,4);

				if (parseInt(row.ic)==0){
					if((''+row.hms+row.hss + row.ms+row.ss).length>=4){//已出赛果
						row.bf1=row.hms+":"+row.hss;
						row.bf2=row.ms+":"+row.ss;
							var rt=(row.ms*1-row.ss*1)*1;
							if(rt*1>0){row.spf="胜";}else if(rt*1==0){row.spf="平";}else{row.spf="负";}
							var rqt=(row.ms*1-row.ss*1)*1+(row.lose)*1;
							if(rqt*1>0){row.rqspf="胜";}else if(rqt*1==0){row.rqspf="平";}else{row.rqspf="负";}
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
						row.bf1="等待";
						row.bf2="等待";
						row.spf="";
						row.rqspf="";
						row.cbf="";
						row.jqs="";
						row.bqc="";
					}
					row.url='<a href="/jc/sp-detail.html?mid='+row.tid+'" target="_blank" title="点击查看走势" class="a_pl">走势</a>';
				}else{//取消
					row.bf1="取消";
					row.bf2="取消";
					row.spf="-";
					row.rqspf="-";
					row.cbf="-";
					row.jqs="-";
					row.bqc="-";
					row.url='-';
				}
				
				if (parseInt(row.lose)>0){
					row.lose='<strong style="color:red">(+'+row.lose+')</strong>';
				}else if (parseInt(row.lose)<0){
					row.lose='<strong style="color:green">('+row.lose+')</strong>';
				}else{
					row.lose="";
				}
				
				html[html.length] = tableTpl[0].tpl(row);
		 })
		$("#vsTable").html(html.join(''));	
	}
});