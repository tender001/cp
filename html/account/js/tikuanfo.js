Class({
	 ready: true,
	 index:function (config){
		 
		this.getservernow();
		this.submitbind();
			
		 Y.C('logininfo',this.showinfo);
	     Y.C('logoutinfo',this.logoutinfo);
         this.LoginAcc();
	    },
	    logoutinfo:function(){
	    	location="/";
	    },
	    showinfo:function(){
	    	var lotid =location.search.getParam('lotid');
			if(lotid!=""&&typeof(lotid) != 'undefined'){
        		
				P.getlist($("#begintime").val(), $("#endtime").val(), lotid,$("#seltype").val(),1,15,0,0);
        	}else{
        		P.getlist($("#begintime").val(), $("#endtime").val(), "0",$("#seltype").val(),1,15,0,0);
        	}
	    	
		},
	    getservernow:function(){
	    	Y.ajax({
	    		url : "/cpdata/time.json",
	    		end : function(data) {
	    			var servernow = Y.getDate(data.date);
	    			var d_e = new Date(servernow);
	    			var d_s = d_e.dateadd("m", -3);
	    			$("#begintime").val(d_s.format("YY-M-D"));
	    			$("#endtime").val(d_e.format("YY-M-D"));
	    			ESONCalendar.init().bind("begintime").bind("endtime").splitChar = "-";
	    		}
	    	});
	    	
	    },
	    submitbind:function(){
	    	P=this;
	    	this.get('#submit').click(function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	    		
	    		var pn = 1;// 页码
	    			var ps = 15;// 页面大小
	    			var tp = 0;// 总页数
	    			var tr = 0;// 总记录数
	    		
	    			var seltype=Y.get("#seltype").val();
	    			$("#page_div").hide();
	    			P.getlist($("#begintime").val(), $("#endtime").val(),Y.get("#lotid").val(),seltype,pn, ps,tp,tr);
	    		});
	    	
	    },
	    showlist : function( pn, ps, tp, tr){
	    	P=this;
	    	var seltype=Y.get("#seltype").val();
	    	var lotid =location.search.getParam('lotid');
	    	P.getlist($("#begintime").val(), $("#endtime").val(),Y.get("#lotid").val(),seltype,pn, ps, tp, tr);
	    },
	    getlist : function(stime, etime, gid,qtype, pn, ps, tp, tr) {// 页码 页面大小 总页数 总记录数
			var data = "";
			var ttz=$_user.url.touzhu;
		    tp=0;
			data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "="
					+ etime;
			if (gid == 0 || gid == undefined) {
		
			} else {
				ttz="/phpu/qp.phpx?fid=u_gbuy";
				data += "&" + $_user.key.gid + "=" + ("0"+gid).substr(("0"+gid).length-2);//parseInt(gid)<10?"0"+gid:gid;
			}
			if (qtype!="-1"&&gid != undefined){
				data += "&" + $_user.key.qtype + "=" + qtype;
			}
			data += "&" + $_user.key.pn + "=" + pn;
			if(Y.get("#lotid").val()==0){
				data += "&" + $_user.key.ps + "=" + ps;
			}

			data += "&" + $_user.key.ps + "=" + ps;
			data += "&" + $_user.key.tp + "=" + tp;
			data += "&" + $_user.key.tr + "=" + tr;
			data += "&rnd=" + Math.random();
	
		$("#touzhulist").hide();
	//	$("#nocount").show();
	
		var html = "";
		
		this.ajax({
			url : "/phpu/qp.phpx?fid=u_cash",
			type : "POST",
			dataType : "json",
			data : data,
			retry: 3,
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
				var innum =0;
				var incount = 0;
				var outnum = 0;
				var outcount = 0;
				var tkallmy = 0;
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
						Y.get("#page_div").hide();
						
					}else{
						Y.get("#nocount").hide();
						if(!this.isArray(r)){r=new Array(r);}
						var lx=1;
						r.each(function(rt,o) {
							var rec = rt.rec;
							var rate = rt.rate;
							var cashdate = rt.cashdate;
							var memo = rt.memo;
							var state = rt.state;
							var money = rt.money;
							var success = rt.success;
							var cashid = rt.cashid;
							
						
							var cl=o%2==0?"":"odd"
								html += "<tr class="+cl+">";
								/*html +="<td>"+(lx++)+"</td>";*/
								html +="<td>"+cashdate+"</td>";
								html +="<td><span>￥"+parseFloat(money).rmb(false)+"</span></td>";
								html +="<td>"+parseFloat(rate).rmb(false)+"</td>";
								html +="<td>" + cashid + "</td>";

								if(success==1){
									html +="<td  style='color:green'>" +"成功"+ "</td>";
									tkallmy+=parseFloat(money);
								}
								else if(success==0){
									html +="<td>" +"处理中"+ "</td>";
								
								}
								else{
									html +="<td>" +"失败"+ "</td>";
								}
								html +="<td style='line-height:15px;'>" +( memo=""?"&nbsp":memo )+ "</td>";
								html +="</tr>";
							
							outcount++;
							//if (ireturn==2 || cancel==0){outnum += parseFloat(money);}//已撤单的不算认购金额
						});
						$("#tkallmy").html(tkallmy.rmb(false));
						$("#nocount").hide();
						$("#touzhulist").html(html);	
						
						var fn="P.showlist";
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
//						showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn+1>tp?tp:(pn+1))+')
						
						pagehtml+='<li class="PagedList-skipToNext"><a onclick=\"' + fn + '('+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+tr+');\"  href="javascript:void(0)">下一页</a></li><ul>';
						$("#page_div").html(pagehtml);
						
						
						
						
						
						
//						var maxshow=5;
//						
//						var pagehtml='<a class="a1" style="margin-right:5px" onclick=\"' + fn + '(1,'+ps+','+tp+','+tr+');\"  href="javascript:void(0)"">首页</A>';
//						pagehtml += '<a class="a2" style="margin-right:5px" title="上一页 " onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');\" href="javascript:void(0)">上一页</A>';
//						var min=0;
//						var max=0;
//						if ( tp > maxshow){
//						var pageTemp=parseInt(pn*1/maxshow);
//						max = pageTemp*maxshow+maxshow;
//						min = pageTemp*maxshow;
//						
//						if(max> tp){
//						max= tp;
//						}
//						if(pn>min){
//							min=min+1;
//						}
//
//						}else{
//						min = 1;
//						max = tp;
//						}
//						for (var i=min;i<max*1+1;i++){
//						if (i==pn){
//							pagehtml+='<a href="javascript:void(0);" id="'+i+'" class="a4" onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');\">' + i + '</a>';
//						}else{
//							pagehtml+='<a href="javascript:void(0);" id="'+i+'" class="a3" onclick=\"' + fn + '('+i+','+ps+','+tp+','+tr+');\">' + i + '</a>';
//						}
//						}
//						pagehtml+='<span class="ac">第<INPUT onkeydown="if(event.keyCode==13){page(Y.getInt(this.value));return false;}" id=govalue class="ac" onkeyup="this.value=this.value.replace(/[^\\d]/g,\'\');if(this.value>'+tp+')this.value='+tp+';if(this.value<=0)this.value=1"  name=page>页</span><a class="go"
//						href="#" onclick=\"' + fn + '(Y.getInt($(\'#govalue\').val()),'+ps+','+tp+','+tr+');\"></a><a class="a2" style="margin-left:10px" onclick=\"' + fn + '('+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+tr+');\"  href="javascript:void(0)">下一页</a><a class="a1" style="margin-left:5px" onclick=\"' + fn + '('+tp+','+ps+','+tp+','+tr+');\" href="javascript:void(0)">尾页</a><span class="gy">共'+tp+'页，'+tr+'条记录</span>';
						$("#page_div").html(pagehtml);
					   
					    if(pn==min&&min-maxshow>0){
					    	
					    	$("#"+pn+"").click(function(){
					    		P.showlist(pn-maxshow>=0?(pn-maxshow):maxshow,ps,tp,tr);
					    	});
					    	}else if(min-maxshow==0){
					    	$("#"+pn+"").click(function(){
					    		P.showlist(1,ps,tp,tr);
					    	});
					    	} ;
//					    $("#govalue").val(pn);
						
						
//						var pagehtml='<a href="javascript:void(0);" class="a1" style="margin-right:5px" onclick=\"' + fn + '(1,'+ps+','+tp+','+tr+');\">首页</a>'+
//						' <a href="javascript:void(0);" class="a2" style="margin-right:5px" onclick=\"' + fn + '('+(pn-1>0?(pn-1):1)+','+ps+','+tp+','+tr+');\">上一页</a>'+
//						' <a href="javascript:void(0);" class="a2" style="margin-left:10px" onclick=\"' + fn + '('+(pn+1>tp?tp:(pn+1))+','+ps+','+tp+','+tr+');\">下一页</a>'+
//						' <a href="javascript:void(0);" class="a1" style="margin-left:5px" onclick=\"' + fn + '('+tp+','+ps+','+tp+','+tr+');\">尾页</a>'+
//						' <span><input type="text"  name="n_page" id="n_page"/><a href="javascript:void(0);" class="a1" style="margin-left:5px"  onclick=\"' + fn + '(Y.getInt($(\'#n_page\').val()),'+ps+','+tp+','+tr+');\">跳转</a>共'+tp+'页，'+tr+'条记录</span>';
						
						$("#touzhulist").show();
						$("#page_div").show();
						
					}
				} else {
					if (code=="1"){
					}else{
						$("#nocount").show();
						$("#touzhulist").hide();
						$("#page_div").hide();
					}
				}
	            $("#rg").html(parseFloat(outnum).rmb(false,2));
	            $("#zj").html(parseFloat(innum).rmb(false,2));
			}
		});
	}
});