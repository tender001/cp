//我的账户
Class({
    ready: true,
    index: function (){
    	P=this;
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
	}
	,selectinfo:function(){
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
									}
								   this.get("#acc_style").attr("style","width:"+caspaint+"%"); 
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
							 var mailbind = u.mailbind;
							 var mobbind = u.mobbind;
							 var rname = u.rname;
							 var idcode = u.idcard;
							 var bank = u.bank;
							 var que = u.isprot;
							 var mobile = u.mobile

							 if(rname==""){

							 }else{
								this.get('#acc_truename').swapClass('sfz l2', 'sfz_y').attr('title','已绑定身份证号'+idcode);
								this.get('#acc_truename_css').html('已绑定');
							 }
							 
							 if(mobbind=="1"){
								this.get('#acc_mobile').swapClass('sj l3', 'sj_y l3').attr('title','已绑定手机号'+mobile);
								this.get('#acc_mobile_css').html('已绑定');
							 }
							 
							 if(mailbind=="1"){
								this.get('#acc_email').swapClass('yx l4', 'yx_y l4').attr('title','已绑定邮箱号'+u.email);
								this.get('#acc_email_css').html('已绑定');
							 }
							 
							 if(bank!=""){
								this.get('#acc_bank').swapClass('bank l1', 'bank_y l1').attr('title','已绑定银行卡号'+bank);
								this.get('#acc_bank_css').html('已绑定');
							 }
							 
							 if(que=="0"){
								this.get('#acc_que').swapClass('mm l5', 'mm_y l5').attr('title','已绑定密码保护');
								this.get('#acc_que_css').html('已绑定');
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
					this.get("#nocount").show();
				}else{
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						var gid = rt.gid;
						var pid = rt.pid;
						var projid = rt.projid;
						var money = rt.money;
						var buydate = rt.buydate;					
						var cancel = rt.cancel;				
						var ireturn = rt.ireturn;					
						var rmoney = rt.rmoney;
						var fqnickid = rt.fqnickid;
						var nickid = rt.nickid;
						if(gid<10){gid="0"+gid;}
						html += "<tr>";
						html += "<td>"+$_sys.getlotname(gid)+"</td>";
						html += "<td>"+pid+"</td>";
						html += "<td>￥"+ parseFloat(money).rmb(false)+ "</td>";
						
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
							html += "<td><font>￥"+parseFloat(rmoney).rmb(false)+"</font></td>";
						} else {
							html += "<td>-</td>";
						}
						
						html += "<td>" + Y.getDate(buydate).format('MM-DD hh:mm') + "</td>";
						
						html +="<td><a href=\""+$_sys.getlotdir(gid)+$_sys.url.viewpath+"?lotid="+gid+"&projid="+projid+"\" target=_blank>详情</a>";
						if((gid==1&&(fqnickid==nickid))||(gid==50 &&(fqnickid==nickid))){
							html +="&nbsp;<a href=\""+$_sys.getlotdir(gid)+"?projid="+projid+"\" target=_blank>再次购买</a>";
						}
								  
						html +="</td></tr>";
		
						outcount++;
					});
				}
			}else{
				if (code == "1") {
					parent.window.Y.postMsg('msg_login', function() {						
						window.location.reload();			
					});
				}else{
					this.get("#nocount").show();
				}
			}
			this.get("#touzhulist").html(html);
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
			return false;
		}
	});
};