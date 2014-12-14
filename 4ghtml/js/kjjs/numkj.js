$(document).ready(function(){
		 loadcode();
//		 getlistdata();
//		 this = Y;
		});
       
	loadcode = function(){//查询开奖公告	        	
     	$.ajax({
    		url : "/cpdata/game/aopencode.json",
    		type : "get",
    		dataType : "json",
    		success : function(d) {
//    			var obj = eval("(" + d.text + ")"); 
//    			if (obj) {d.rows.row
    				var r = d.rows.row;        				
    				$.each(r,function(o,rt) {
    					var row={};
    					row.code = rt.codes;   				
        				row.etime =  rt.et;   		     				
        				row.pools = rt.pools;  
//        				row.pools = row.pools==''?'0':(parseFloat(row.pools) + "");
        				row.sales = rt.sales;       				
        				row.nums = rt.nums;       				
        				row.money = rt.moneys;	
        				row.pid = rt.pid;        				
        				row.gid = rt.gid;
        				row.auditdate = rt.auditdate.substr(0,11);
        				row.awardtime=rt.at.substr(0,10);           					
//    					$("span[mark="+gid+"]").attr("expect",row.pid);
        				if (row.gid=='80'){
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = (row.money[0] == ''||row.money[0] ===undefined)?'0':(parseFloat(row.money[0]));
    						row.twonum = (row.nums[1] == '' ||row.nums[1]  ===undefined)?'0':(parseFloat(row.nums[1]));
    						row.twomoney =(row.money[1] == ''||row.money[1] ===undefined)?'0':(parseFloat(row.money[1]));
            			
    						$("#sfcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						if(row.twonum=="" || row.twomoney==""||row.twomoney===undefined||row.twonum===undefined){
    							$("#sfc_twomoney").html("二等奖：0注0元"); 
    						}else{
    							$("#sfc_twomoney").html("二等奖："+row.twonum+"注"+row.twomoney+"元");
    						}
						

    						$("#sfc_pid").html(row.pid+"期");	
    						
    						$("#sfc_pools").html(row.pools);	
    						$("#sfc_kjdate").html(row.auditdate);
    						$("#sfc_code").html("<cite>"+row.code.split(',').join('</cite><cite>')+"</cite>");			
    					}else if (row.gid=='82'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]));
            			
    						$("#jqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						$("#jqc_pid").html(row.pid+"期");		
    						$("#jqc_kjdate").html(row.auditdate);
    						$("#jqc_code").html('<cite>'+row.code.split(',').join('</cite><cite>')+'</cite>');		
    					}else if (row.gid=='83'){	
    						row.nums = new String(row.nums).split(",");
    						row.money =new String( row.money).split(",");
    						row.onenum = row.nums[0] == ''?'0':(parseFloat(row.nums[0]));
    						row.onemoney = row.money[0] == ''?'0':(parseFloat(row.money[0]));
    						$("#bqcmoney").html("一等奖："+row.onenum+"注"+row.onemoney+"元");
    						$("#bqc_pid").html(row.pid+"期");		
    						$("#bqc_kjdate").html(row.auditdate);
    						$("#bqc_code").html('<cite>'+row.code.split(',').join('</cite><cite>')+'</cite>');
    					}else if (row.gid=='50'){	
    						$("#dlt_pid").html(row.pid+"期");		
    						$("#dlt_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#dlt_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    					}else if (row.gid=='01'){	
    						$("#ssq_pid").html(row.pid+"期");		
    						
    						$("#ssq_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#ssq_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');	
    					}else if (row.gid=='03'){	
    						$("#sd_pid").html(row.pid+"期");		
    						$("#sd_kjdate").html(row.awardtime);
    						$("#sd_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='53'){	
    						$("#pls_pid").html(row.pid+"期");		
    						$("#pls_kjdate").html(row.awardtime);	
    						$("#pls_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='52'){	
    						$("#plw_pid").html(row.pid+"期");		
    						$("#plw_kjdate").html(row.awardtime);
    						$("#plw_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='07'){	
    						$("#qlc_pid").html(row.pid+"期");		
    						$("#qlc_kjdate").html(row.awardtime);
    						var code=row.code.split('|');		
    						$("#qlc_code").html('<b>'+code[0].split(',').join('</b><b>')+'</b>'+' <b class="blue">'+code[1].split(',').join('</b><b class="blue">')+'</b>');
    						
    					}else if (row.gid=='51'){	
    						$("#qxc_pid").html(row.pid+"期");		
    						$("#qxc_kjdate").html(row.awardtime);
    						$("#qxc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='54'){	
    						$("#11x5_pid").html(row.pid+"期");		
    						$("#11x5_kjdate").html(row.awardtime);
    						$("#11x5_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='56'){	
    						$("#11ydj_pid").html(row.pid+"期");		
    						$("#11ydj_kjdate").html(row.awardtime);
    						$("#11ydj_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}else if (row.gid=='04'){	
    						$("#ssc_pid").html(row.pid+"期");		
    						$("#ssc_kjdate").html(row.awardtime);
    						$("#ssc_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
    					}
    				});	     
//    				var o = d.rows.rownow;
//    				var d = Date(d.date).format('YY-MM-DD');
//    				o.each(function(rt,o) {
//    					var nd = $Date(rt.nowendtime).format('YY-MM-DD');
//    					$("i[expect="+rt.gid+"]").html(rt.nowpid+"期");
//    					$("#"+rt.gid+"").attr("expect",rt.nowpid);
//						$("span[nowendtime="+rt.gid+"]").html(rt.nowendtime);
//						$("span[pool="+rt.gid+"]").html(rt.pools);
//    					if(nd==d){
//    						$("li[today="+rt.gid+"]").show();
//    					}
    					
//    				});
    				
    			
    		},
    		error:function(){
    			showTips('网络异常!');
            }
    	}); 
    };
//    getlistdata= function () {
//        $.ajax({
//            url: this.omissionurl,
//            retry: 1,
//            end: function (data, i) {
//                
//               
//                    this.updateDayOpenCode(data.date);
//                
//            }
//
//        });
//    },
//    updateDayOpenCode = function (d) {
//        var riqi2 = Y.getDate(d).format('YYMMDD');
//        $.ajax({
//            url: "/cpdata/game/58/day/" + riqi2 + ".json",
//            type: "get",
//            cache: false,
//            dataType: "json",
//            success: function (data) {
//                var obj = eval("(" + data.text + ")");
//                var r = obj.rows.row;
//                r.each(function (rt, o) {
//                    var pid = rt.pid.substr(6, 2);
//                    var codes = rt.codes;
//                    var at = rt.at;
//                    codes = codes.split(",");
//                    var ncode = '', ntype = '';
////					ntype = Y.kjtype(kjcode,pid);
//
//                    if (codes != '' && codes.length == 3) {
//                        var a = codes[0], b = codes[1], c = codes[2];
//                        var a1 = a.substr(0, 1);//第一个开奖号码的花色
//                        var a2 = a.substr(1);//第一个开奖号码的点数
//                        var b1 = b.substr(0, 1);
//                        var b2 = b.substr(1);
//                        var c1 = c.substr(0, 1);
//                        var c2 = c.substr(1);
//                        var sz = [];
//                        sz[0] = Y.getInt(a2);
//                        sz[1] = Y.getInt(b2);
//                        sz[2] = Y.getInt(c2);
//                        if (a1 == b1 && b1 == c1 && a1 == c1) {
////							sz = $_sys.sort(sz,desc);
//                            if (sz.indexOf(13) >= 0 && sz.indexOf(1) >= 0) {
//                                if (sz.indexOf(12) >= 0 || sz.indexOf(2) >= 0) {
//                                    $("#type" + pid).addClass('y11');
//                                    ntype = '同花顺';
//                                } else {
//                                    $("#type" + pid).addClass('y1');
//                                    ntype = '同花';
//                                }
//                            } else {
//                                if (sz[0] + 1 != sz[1]) {
//                                    $("#type" + pid).addClass('y1');
//                                    ntype = '同花';
//                                } else {
//                                    if (sz[1] + 1 != sz[2]) {
//                                        $("#type" + pid).addClass('y1');
//                                        ntype = '同花';
//                                    } else {
//                                        $("#type" + pid).addClass('y11');
//                                        ntype = '同花顺';
//                                    }
//                                }
//                            }
//                        } else {
//                            if (a2 != b2 || b2 != c2 || c2 != a2) {
//                                if (a2 == b2 || b2 == c2 || c2 == a2) {
//                                    $("#type" + pid).addClass('y2');
//                                    ntype = '对子';
//
//                                } else {
////									sz = $_sys.sort(sz,desc);
//                                    if (sz.indexOf(13) >= 0 && sz.indexOf(1) >= 0) {
//                                        if (sz.indexOf(12) >= 0) {
//                                            $("#type" + pid).addClass('y3');
//                                            ntype = '顺子';
//                                        } else {
//                                            $("#type" + pid).addClass('k3br2');
//                                            ntype = '';
//                                        }
//                                    } else {
//                                        if (sz[0] + 1 != sz[1]) {
//                                            $("#type" + pid).addClass('k3br2');
//                                            ntype = '';
//                                        } else {
//                                            if (sz[1] + 1 != sz[2]) {
//                                                $("#type" + pid).addClass('k3br2');
//                                                ntype = '';
//                                            } else {
//                                                $("#type" + pid).addClass('y3');
//                                                ntype = '顺子';
//                                            }
//                                        }
//                                    }
//                                }
//                            } else {
//                                $("#type" + pid).addClass('cm_red');
//                                ntype = '豹子';
//                            }
//                        }
//                    }
////					var ntype="";
//                    $("#klpk_pid").html(pid+"期");		
//					$("#klpk_kjdate").html(row.awardtime);
////					$("#klpk_code").html('<b>'+row.code.split(',').join('</b><b>')+'</b>');
//                    $("#klpk_code" + pid).html('<span class="PK_' + codes[0] + '"></span><span class="PK_' + codes[1] + '"></span><span class="PK_' + codes[2] + '"></span>');
//                    $("#type" + pid).html(ntype);
//                });
//            }
//        });
//    };