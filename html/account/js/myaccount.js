//我的账户
Class({
    ready: true,
    index: function (){
    	P= this;
    	Y.C('logininfo',this.showinfo);
    	Y.C('logoutinfo',this.logoutinfo);
    	this.LoginAcc();
    }
	,logoutinfo:function(){
	    location="/";
	}
	,showinfo:function(){
		P.selectinfo();
		P.loadRecod();
	}, 
	/*submitbind:function(){
    	P=this;
    	this.get('#submit').click(function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    		
    		var pn = 1;// 页码
    			var ps = 10;// 页面大小
    			var tp = 0;// 总页数
    			var tr = 0;// 总记录数
    		
    			var seltype=Y.get("#seltype").val();
    			$("#page_div").hide();
    		});
    	
    },*/
	/*showlist : function( pn, ps, tp, tr){
    	P=this;
    	var seltype=Y.get("#seltype").val();
    	var lotid =location.search.getParam('lotid');
    	P.selectinfo(Y.get("#lotid").val(),seltype,pn, ps, tp, tr);
    }*/
	//,
	selectinfo:function(){
	     Y.ajax({
	       url:Class.C('url-login-user')+"&rnd=" + Math.random(),
	       end:function (data){
	           var Y;
	           Y = this;
	           if (data.error) {
	         	  return false;
	           }else{
					   var obj = eval("(" + data.text + ")");
	        		   var code = obj.Resp.code;
						   if (code=="0"){
							     var u = obj.Resp.row;
			                     var safe=u.safe;

								   this.get('#acc_userinfo').html(u.nickid);
								   this.get('#acc_lasttime').html((u.activedate || ''));
								   this.get('#acc_usermoney').html(parseFloat(u.usermoeny));
								   
								   if (safe==0){
										cascade = "差";
										caspaint = "0";
									}else if (safe==1){
										cascade = "低";
										caspaint = "20";
									}else if (safe==2){
										cascade = "中低";
										caspaint = "40";
									}else if (safe==3){
										cascade = "中";
										caspaint = "60";
									}else if (safe==4){
										cascade = "中高";
										caspaint = "80";
									}else if (safe==5){
										cascade = "高";
										caspaint = "100";
//										this.get("#acc_style").attr("style","background:#00AE38;width:"+caspaint+"%"); 
									}
								   this.get("#acc_style").attr("style","width:"+caspaint+"%" ); 
								   this.get('#acc_dengji').html(cascade);
								   if(safe != 5) this.get('#acc_link').show();
								   //调用
								   showSafe();
						   }else{
							   Y.alert("拉取用户信息失败, 请刷新重试！");
						   }      
	           }
	       }
	  });
	}
	
	,loadRecod:function(){
		var pn = 1;// 页码
		var ps = 10;// 页面大小
		var tp = 0;// 总页数
		var tr = 0;// 总记录数
		var lotid = 0;   //全部彩种
		var seltype = -1; //全部投注
		
		Y.ajax({
			url : "/cpdata/time.json",
			end : function(data) {
				var servernow = Y.getDate(data.date);
				var d_e = new Date(servernow);
				var d_s = d_e.dateadd("m", -3);
				var btime = d_s.format("YY-M-D");
				var etime = d_e.format("YY-M-D");
				//投注记录
				showtouzhu(btime, etime, lotid,seltype, pn, ps, tp, tr);
			}
		});
	}
});

//显示认证信息
var showSafe = function(){
	Y.ajax({
        url:Class.C('url-login-safe')+"&rnd=" + Math.random(),
        end:function (data){
        	 if (data.error) {
        		 Y.alert("拉取用户信息失败, 请刷新重试！");
             }else{
            	 var obj = eval("(" + data.text + ")");
        		 var code = obj.Resp.code;
					   if (code==0){
						 var u = obj.Resp.row;
						 var mobbind = u.mobbind;
							 var rname = u.rname;
							 var idcode = u.idcard;
							 var bank = u.bank;
							 var mobile = u.mobile;
							 
							 if(mobbind=="1"){
								 this.get('#acc_mobile').swapClass('a1', 'a1 a1cur').attr('title','已绑定手机号'+mobile);
							 }
							 if(rname==""){
									
								 $('#acc_truename').attr("href","/account/trueinfo.html");
								 $("#nocount").css("padding", "125px 0px"); 
							 }else{
								 this.get('#acc_truename').swapClass('a2', 'a2 a2cur').attr('title','已绑定身份证号'+idcode);
								 $("#shiming").hide();
								 $("#nocount").css("padding", "170px 0px");; 
								// 详细出处参考：http://www.jb51.net/article/31780.htm
								$('#acc_truename').removeAttr("href");
							 }
							if(bank!=""){
								this.get('#acc_bank').swapClass('a3', 'a3 a3cur').attr('title','已绑定银行卡号'+bank);
								$('#acc_bank').removeAttr("href");
							 }else{
								 $('#acc_bank').attr("href","/account/bankinfo.html");
							 }
					   }
             }
        }
	});
};

//显示投注记录
var showtouzhu = function(stime, etime, gid,qtype, pn, ps, tp, tr){  // 页码 页面大小 总页数 总记录数
	var data = "";
	if (tr % ps == 0) {
		tp = tr / ps;
	} else {
		tp = Math.ceil(tr / ps);
	}

	data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "="
			+ etime;
	if (gid == 0 || gid == "undefine") {

	} else {
		data += "&" + $_user.key.gid + "=" + ("0"+gid).substr(("0"+gid).length-2);
	}
	if (qtype!="-1"&&gid != "undefine"){
		data += "&" + $_user.key.qtype + "=" + qtype;
	}
	data += "&" + $_user.key.pn + "=" + pn;
	data += "&" + $_user.key.ps + "=" + ps;
	data += "&" + $_user.key.tp + "=" + tp;
	data += "&" + $_user.key.tr + "=" + tr;
	
	var html = "";
	Y.ajax({
		url : $_user.url.touzhu,
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			var innum = incount = outnum = outcount = 0;
			rows = "";
			if (code == "0") {
				var r = obj.Resp.row;
				var rs = obj.Resp.count;
				tr=Y.getInt(rs.rc);
				tp=Y.getInt(rs.tp);
				ps=Y.getInt(rs.ps);
				pn=Y.getInt(rs.pn);	
				if (tr % ps == 0) {
					tp = tr / ps;
				} else {
					tp = Math.ceil(tr / ps);
				}
				if(tr==0){
					Y.get("#nocount").show();
					//Y.get("#page_div").hide();
				}else{
					Y.get("#nocount").hide();
					var s=Y.get("#lotid").val();
					if(s<10){s="0"+s}
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						var rec = rt.rec;
						var gid = rt.gid;
						var pid = rt.pid;
						var nickid = rt.nickid;
						var projid = rt.projid;
						var bnum = rt.bnum;
						var money = rt.money;
						var buydate = rt.buydate;					
						var cancel = rt.cancel;				
						var award = rt.award;		
						var ireturn = rt.ireturn;					
						var amoney = rt.amoney;					
						var rmoney = rt.rmoney;
						var retdate = rt.retdate;
						var fqnickid = rt.fqnickid;
						if(gid<10){gid="0"+parseInt(gid);}
						var cl=o%2==0?"":"odd"
							html += "<tr class="+cl+">";
						html += "<td>"+$_sys.getlotname(gid)+"</td>";
						html += "<td>"+pid+"</td>";
						html += "<td><span>"+ parseFloat(money).rmb()+ "</span></td>";
						
						if (cancel==0){
							if (ireturn==2){
								if (rmoney>0){
									html +=" <td><span>已中奖</span></td>";
									incount++;
									innum+=parseFloat(rmoney);
								}else{
									html += "<td>未中奖</td>";
								}						
							}else{
								html +=" <td>未结算</td>";
							}
						}else if (cancel==1){
							html +=" <td>本人撤单</td>";
						}else if (cancel==2){
							html +=" <td>系统撤单</td>";
						}
						if (rmoney > 0) {
							html += "<td><span>"+parseFloat(rmoney).rmb()+"</span></td>";
						} else {
							html += "<td>-</td>";
						}
						
						html += "<td>" + Y.getDate(buydate).format('MM-DD hh:mm')  + "</td>";
						
						html +="<td><a href=\""+$_sys.getlotdir(gid)+$_sys.url.viewpath+"?lotid="+gid+"&projid="+projid+"\" target=_blank>详情</a>";
						if((gid==1&&(fqnickid==nickid))||(gid==50 &&(fqnickid==nickid))){
							html +="&nbsp;<a href=\""+$_sys.getlotdir(gid)+"?projid="+projid+"\" target=_blank>再次购买</a>";
						}	  
						html +="</td></tr>";
		
						outcount++;
					});
					$("#nocount").hide();
					$("#touzhulist").html(html);	
					/*var fn="P.showlist";
					var maxshow=5;
					var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+tr+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick=\"' + fn + '(1,'+ps+','+tp+','+tr+');\"  href="javascript:void(0)" >首页</a></li>';
					pagehtml += '<li class="PagedList-skipToNext"><a onclick=\"' + fn + '('+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+tr+');\" href="javascript:void(0)">上一页</a></li>';
					var min=0;
					var max=0;
					
					if (tp > maxshow){
					var pageTemp=parseInt(pn*1/maxshow);

					
					max = pageTemp*maxshow+maxshow;
					min = pageTemp*maxshow;
					
					if(max>tp){
					max=tp;
					}
					if(pn>min){min=min+1;}
					}else{
					min = 1;
					max = tp;
					}
					

					
					for (var i=min;i<max*1+1;i++){
					if (i==pn){
					pagehtml+='<li class="active"><a href="javascript:void(0);" id="'+i+'" class="a4" onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');">' + i + '</a></li>';
					}else{
						pagehtml+='<li><a href="javascript:void(0);" id="'+i+'" class="a3" onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');">' + i + '</a></li>';
					}
					}
//					showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn+1>tp?tp:(pn+1))+')
					
					pagehtml+='<li class="PagedList-skipToNext"><a onclick=\"' + fn + '('+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+tr+');\"  href="javascript:void(0)">下一页</a></li><ul>';
					$("#page_div").html(pagehtml);  
				    if(pn==min&&min-maxshow>0){
				    	
				    	$("#"+pn+"").click(function(){
				    		P.showlist(pn-maxshow>=0?(pn-maxshow):maxshow,ps,tp,tr);
				    	});
				    	}else if(min-maxshow==0){
				    	$("#"+pn+"").click(function(){
				    		P.showlist(1,ps,tp,tr);
				    	});
				    	} ;*/
					$("#touzhulist").show();
					$("#page_div").show();
				}
			}else{
				if (code == "1") {
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					$("#nocount").show();
					$("#touzhulist").hide();
					//$("#page_div").hide();
				}
			}
			/*$("#rg").html(parseFloat(outnum).rmb(false,2));
            $("#zj").html(parseFloat(innum).rmb(false,2));*/
		}
		
	});
	  
};
