/*----------------------------------------------------------------------------*
 * 北京单场开奖公告页面  */
Class({
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
			url : "/cpdata/game/85/c.json?_=" + Math.random(),
			type : "get",
			dataType : "json",
			end  : function (d){
				var obj = eval("(" + d.text + ")");
				var r = obj.period.row;
				var expectlist = [];
				r.each(function(rt,o) {
					var pid = rt.pid;
				    expectlist[expectlist.length] = [ pid];
				});

					var html = "";
					var nowexpect='';
					for ( var i = 0; i < expectlist.length; i++) {
						if (i==0){
							nowexpect=expectlist[i][0];
						}
						html += "<OPTION value=" + expectlist[i][0] + " >" + expectlist[i][0] + "</OPTION>";
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
});
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
					url : "/cpdata/match/beid/"+expect+"/"+expect+".json",
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
			           '<td>{$mid}</td>'+
			           '<td style="background:{$cl}; color: #fff" title="{$mname}">{$sname}</td>'+
			           '<td title="开赛时间：{$bt}">{$short_mt}</td>'+
			           '<td>{$hn}{$close}</td>'+
			           '<td>{$gn}</td>'+
			           '<td>{$bf1}</td>'+
			           '<td>{$bf2}</td>'+
			           '<td><font>{$spf}</font></td><td>{$spfsp}</td>'+
			           '<td><font>{$jqs}</font></td><td>{$jqssp}</td>'+
			           '<td><font>{$sxp}</font></td><td>{$sxpsp}</td>'+
			           '<td><font>{$cbf}</font></td><td>{$cbfsp}</td>'+
			           '<td><font>{$bqc}</font></td><td>{$bqcsp}</td>'+
			           '</tr>'
	    		];	
		
		 var obj = eval("(" + data.text + ")");
		 var rt=obj.match.row;
		 rt.each(function(row,o) {
			 row.short_mt=Y.getDate(row.bt).format('MM-DD hh:mm');
				row.sname=row.mname.substr(0,4);
				if ((parseInt(row.icancel)==0) && (row.ms!="-1" && row.ss!="-1")){
					if(parseInt(row.iaudit)==1){//已出赛果
						row.bf1=row.hms+":"+row.hss;
						row.bf2=row.ms+":"+row.ss;
						row.bf=row.hms+":"+row.hss+"/"+row.ms+":"+row.ss;
						
						row.spf=$_sys.getrz(row.rs,0);
						row.spfsp="("+parseFloat($_sys.getrs(row.rs,0)).rmb(false,3)+")";
						row.cbf=$_sys.getrz(row.rs,1);
						row.cbfsp="("+parseFloat($_sys.getrs(row.rs,1)).rmb(false,3)+")";
						row.bqc=$_sys.getrz(row.rs,2);
						row.bqcsp="("+parseFloat($_sys.getrs(row.rs,2)).rmb(false,3)+")";
						row.sxp=$_sys.getrz(row.rs,3);
						row.sxpsp="("+parseFloat($_sys.getrs(row.rs,3)).rmb(false,3)+")";
						row.jqs=$_sys.getrz(row.rs,4);
						row.jqssp="("+parseFloat($_sys.getrs(row.rs,4)).rmb(false,3)+")";

						if(row.spf=="3"){row.spf="胜";}else if(row.spf=="1"){row.spf="平";}else{row.spf="负";}
						if(row.cbf=="90"){row.cbf="胜其它";}else if(row.cbf=="99"){row.cbf="平其它";}else if(row.cbf=="09"){row.cbf="负其它";}else{row.cbf=row.ms+":"+row.ss;}
						if(row.sxp=="3"){row.sxp="上单";}else if(row.sxp=="2"){row.sxp="上双";}else if(row.sxp=="1"){row.sxp="下单";}else{row.sxp="下双";}
						if(row.jqs*1>=7){row.jqs="7+";}
						row.bqc=row.bqc.replaceAll("3","胜").replaceAll("1","平").replaceAll("0","负");
						
					}else{
						if (Y.getDate(data.date)>Y.getDate(row.bt)){//已经过期的场次
							if(row.ms!="" && row.ss!="" && row.hms!="" && row.hss!=""){
								row.bf=row.hms+":"+row.hss+"/"+row.ms+":"+row.ss;
							}else{
								row.bf="等待开奖";
							}
						}else{
							row.bf="&nbsp;";
						}
						row.bf1="&nbsp;";
						row.bf2="&nbsp;";
						row.spf="&nbsp;";
						row.cbf="&nbsp;";
						row.jqs="&nbsp;";
						row.bqc="&nbsp;";
						row.sxp="&nbsp;";
						row.spfsp="&nbsp;";
						row.cbfsp="&nbsp;";
						row.jqssp="&nbsp;";
						row.bqcsp="&nbsp;";
						row.sxpsp="&nbsp;";
					}
				}else{//取消
					if(parseInt(row.iaudit)==0){
						row.bf="等待开奖";
						row.spf="&nbsp;";
						row.cbf="&nbsp;";
						row.jqs="&nbsp;";
						row.bqc="&nbsp;";
						row.sxp="&nbsp;";
					}else{
						row.bf="<strong class='eng red'>延</strong>";
						row.spf="1.00";
						row.cbf="1.00";
						row.jqs="1.00";
						row.bqc="1.00";
						row.sxp="1.00";
					}
				}
				
				if (parseInt(row.close)>0){
					row.close='<strong style="color:red">(+'+row.close+')</strong>';
				}else if (parseInt(row.close)<0){
					row.close='<strong style="color:green">('+row.close+')</strong>';
				}else{
					row.close="";
				}
				html[html.length] = tableTpl[0].tpl(row);
		 });

		$("#vsTable").html(html.join(''));
		$("#vsTable").show();	
		this.postMsg('load_duizhen_succ');			
	}
});