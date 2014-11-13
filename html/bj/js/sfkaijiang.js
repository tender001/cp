/*----------------------------------------------------------------------------*
 * 北京单场开奖公告页面  */
Class.C('sfgg_pk',[[["足球"],["球"],["#993333"]],[["篮球"],["分"],["#E54227"]],[["男篮"],["分"],["#E54227"]],[["冰球"],["球"],["#0099C0"]],[["网球"],["盘"],["#456C89"]],[["羽毛球"],["局"],["#6969E0"]],[["排球"],["局"],["#F57070"]],[["橄榄球"],["分"],["#BA6F30"]],[["曲棍球"],["球"],["#C98810"]],[["乒乓球"],["局"],["#C85B5B"]],[["沙滩排球"],["局"],["#FD91B5"]],[["手球"],["球"],["#339933"]],[["水球"],["球"],["#339933"]]]);
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
			url : "/cpdata/game/84/c.json?_=" + Math.random(),
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
					url:"/cpdata/match/beid/"+expect+"/sfgg.json",
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
	getrz:function(rsrow,num){
		var rs=rsrow.split(";");
		//alert(rs.length);
		if (rs.length-1<num){
			return "";
		}
		var tmp =rs[num].split(":");
		return tmp[0];			
	},
	getrs:function(rsrow,num){
		var rs=rsrow.split(";");
		if (rs.length-1<num){
			return "";
		}
		var tmp =rs[num].split(":");
		return tmp[1].substring(0,tmp[1].indexOf(".")+7);
	},
	getduizhen:function(data){
		 var html = [];
		 var tableTpl=['<tr>'+
			           '<td>{$mid}</td>'+
			           '<td style="background:{$cl}; color: #fff" title="{$mtype}">{$mtype}</td>'+
			           '<td>{$sname}</td>'+
			           '<td title="开赛时间：{$bt}">{$short_mt}</td>'+
			           '<td>{$hn}</td>'+
			           '<td>{$closestr}</td>'+
			           '<td>{$gn}</td>'+
			           '<td>{$bf}</td>'+
			        
			           '<td><font>{$spf}</font></td><td>{$spfsp}</td>'+
			          
			        
			           '</tr>'
	    		];	
		
		 var obj = eval("(" + data.text + ")");
		 var rt=obj.match.row;
		 var regs = /^[0-9]*[-][0-9]*|[0-9]*/;
		 rt.each(function(row,o) {
			 row.short_mt=Y.getDate(row.bt).format('MM-DD hh:mm');
				row.sname=row.mname.substr(0,4);
				row.mname = (row.mname != undefined)? row.mname.replace(regs,"") : "";
				//<row expect="111008" mid="1" hn="FC岐阜" gn="北九州" bt="2011-10-10 12:00:00" et="2011-10-10 11:50:00" 
				// ms="0" ss="1" rs="0:2.624471;01:12.134176;00:4.992100;1:5.041032;1:5.441082" close="0" mname="天皇杯" 
				//spf="rz:0;rs:2.624471;sp0:2.6200;sp1:3.8000;sp3:2.8000;" bqc="rz:0;rs:4.9921;33:6.3000;31:18.2900;30:24.4200;13:6.4700;11:6.0100;10:6.9500;03:52.6500;01:16.2000;00:4.9900" cbf="rz:1;rs:12.134176;10:10.1600;20:15.7600;21:9.9600;30:53.9600;31:34.7800;32:46.6100;40:157.3500;41:119.9300;42:134.2600;90:127.7200;01:12.1300;02:14.9400;12:10.5200;03:41.5400;13:23.0800;23:47.7900;04:136.5900;14:104.0700;24:154.2700;09:0.0000;00:14.1400;11:7.6800;22:15.8700;33:113.3600;99:715.2500" jqs="rz:1;rs:5.441082;jqs0:13.2000;jqs1:5.4400;jqs2:4.1300;jqs3:4.1400;jqs4:7.1200;jqs5:13.5200;jqs6:32.8400;jqs7:80.7500" sxp="rz:1;rs:5.041032;sxp0:2.8400;sxp1:5.0400;sxp2:6.8900;sxp3:3.2700;" 
				//cl="#29197B" iaudit="1" icancel="0" />

				if ((parseInt(row.icancel)==0) && (row.ms!="-1" && row.ss!="-1")){
					if(parseInt(row.iaudit)==1 || row.rs!=""){//已出赛果
						row.bf=row.ms+":"+row.ss;
//						row.bcbf = row.hms+":"+row.hss;
						row.qcbf = row.ms+":"+row.ss;
						
						var rs=(row.rs).split(";");
//						//alert(rs.length);
						if (rs.length-1<0){
							row.spf= "";
						}
						var tmp =rs[0].split(":");
						row.spf= tmp[0];			
//						row.spf=this.getrz(row.rs,0);
//						getrz:function(rsrow,num){
//							var rs=rsrow.split(";");
//							//alert(rs.length);
//							if (rs.length-1<num){
//								return "";
//							}
//							var tmp =rs[num].split(":");
//							return tmp[0];			
//						},
					
							var rs=(row.rs).split(";");
							if (rs.length-1<0){
								row.spfsp= "";
							}
							var tmp =rs[0].split(":");
							if(tmp[1]===undefined){
								row.spfsp="";
							}else{
								row.spfsp=""+parseFloat( tmp[1].substring(0,tmp[1].indexOf(".")+7));
							}
							
						
//						this.getrs(row.rs,0));
//						row.cbf=this.getrz(row.rs,1);
//						row.cbfsp=""+parseFloat(this.getrs(row.rs,1));
//						row.bqc=this.getrz(row.rs,2);
//						row.bqcsp=""+parseFloat(this.getrs(row.rs,2));
//						row.sxp=this.getrz(row.rs,3);
//						row.sxpsp=""+parseFloat(this.getrs(row.rs,3));
//						row.jqs=this.getrz(row.rs,4);
//						row.jqssp=""+parseFloat(this.getrs(row.rs,4));
						
						if(row.spf=="3"){row.spf="胜";}else if(row.spf=="0"){row.spf="负";}else{row.spf="";}
//						if(row.cbf=="90"){row.cbf="胜其它";}else if(row.cbf=="99"){row.cbf="平其它";}else if(row.cbf=="09"){row.cbf="负其它";}else{row.cbf=row.ms+":"+row.ss;}
//						if(row.sxp=="3"){row.sxp="上单";}else if(row.sxp=="2"){row.sxp="上双";}else if(row.sxp=="1"){row.sxp="下单";}else{row.sxp="下双";}
//						if(row.jqs*1>=7){row.jqs="7+";}
//						row.bqc=row.bqc.replaceAll("3","胜").replaceAll("1","平").replaceAll("0","负");
						
					}else{
						if (Y.getDate(data.date)>Y.getDate(row.bt)){//已经过期的场次
							if(row.ms!="" && row.ss!="" ){
								row.bf=row.ms+":"+row.ss;
							}else{
								row.bf="--";
							}
						}else{
							row.bf="";
						}
						row.spf="";
						row.cbf="";
						row.jqs="";
						row.bqc="";
						row.sxp="";
					}
				}else{//取消
					if(parseInt(row.iaudit)==0){
						row.bf="延";
						row.bcbf = "<strong style='color:red'>延</strong>";
						row.qcbf = "<strong style='color:red'>延</strong>";
						row.spf="";
						row.cbf="";
						row.jqs="";
						row.bqc="";
						row.sxp="";
					}else{
						row.bf="<strong style='color:red'>延</strong>";
						row.bcbf = "<strong style='color:red'>延</strong>";
						row.qcbf = "<strong style='color:red'>延</strong>";
						row.spf="";
						row.cbf="";
						row.jqs="";
						row.bqc="";
						row.sxp="";
						row.spfsp="1.00";
						row.cbfsp="1.00";
						row.jqssp="1.00";
						row.bqcsp="1.00";
						row.sxpsp="1.00";
					}
				}
				
				if(row.mtype != undefined)
				{
					$.each(Class.C("sfgg_pk"),function()
			    	{
						if(this[0] == row.mtype)
		    			{
		    				row.pkunit = this[1];
		    				row.cl = this[2];
		    				return false;
		    			}
		    		});
				}			
				row.cl=row.cl!=''?row.cl:'#009900';
				if ((row.close)*1>0){
					row.closestr='<strong style="color: red">+'+row.close+'&nbsp;'+row.pkunit+'</strong>';
				}else if ((row.close)*1<0){
					row.closestr='<strong style="color: green">'+row.close+'&nbsp;'+row.pkunit+'</strong>';
				}else{
					row.closestr='<strong style="color: green">&nbsp;</strong>';
				}
				html[html.length] = tableTpl[0].tpl(row);
		 });

		$("#vsTable").html(html.join(''));
		$("#vsTable").show();	
		this.postMsg('load_duizhen_succ');			
	}
});