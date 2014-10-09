Class({
	 ready: true,
	 index:function (config){
		    var html='';
			html += "<option value=''>选择彩种</option><option value=''>全部</option>";
			for (var i=0; i<$_sys.lottype.length;i++){
				if ($_sys.lottype[i][1]=="zc" || $_sys.lottype[i][1]=="bjdc" || $_sys.lottype[i][1]=="jczq" || $_sys.lottype[i][1]=="jclq"){continue;}
				var tmp=$_sys.lottype[i][2].split(",");
				for (var j=0; j<tmp.length;j++){
					html+="<OPTION value="+tmp[j]+" >"+$_sys.getlotname(tmp[j])+"</OPTION>";
				}		
			}
		
			this.get("#gameType").html(html);
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
	    	P.getlist(Y.get("#begintime").val(), Y.get("#endtime").val(), "",Y.get("#seltype").val(),1,10,0,0);
		},
	    getservernow:function(){
	    	P=this;
	    	Y.ajax({
	    		url : "/cpdata/time.json",
	    		end : function(data) {
	    			var servernow = Y.getDate(data.date);
	    			var d_e = new Date(servernow);
	    			var d_s = d_e.dateadd("m", -3);
	    			Y.get("#begintime").val(d_s.format("YY-M-D"));
	    			Y.get("#endtime").val(d_e.format("YY-M-D"));
	    			ESONCalendar.init().bind("begintime").bind("endtime").splitChar = "-";

	    		}
	    	});
	    	
	    },
	    submitbind:function(){
	    	P=this;
	    	this.get('#submit').click(function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	    			var pn = 1;// 页码
	    			var ps = 10;// 页面大小
	    			var tp = 0;// 总页数
	    			var tr = 0;// 总记录数
	    			var seltype=Y.get("#seltype").val();
	    			P.getlist(Y.get("#begintime").val(), Y.get("#endtime").val(), Y.get("#gameType").val(),seltype,pn, ps, tp, tr);
	    		});
	    	
	    },
	    showlist : function( pn, ps, tp, tr){
	    	P=this;
	    	var seltype=Y.get("#seltype").val();
	    	P.getlist(Y.get("#begintime").val(), Y.get("#endtime").val(), Y.get("#gameType").val(),seltype,pn, ps, tp, tr);
	    },
	    getlist : function(stime, etime, gid,qtype, pn, ps, tp, tr) {// 页码 页面大小 总页数 总记录数
		var data = "";
		tp=0;
	
		data = $_user.key.stime + "=" + stime + "&" + $_user.key.etime + "="
				+ etime;
		var url = "/phpu/qp.phpx?fid=u_gzh";
		if (gid == undefined || gid.length == 0) {
			url = $_user.url.chase;
		} else {
			data += "&" + $_user.key.gid + "=" + ("0"+gid).substr(("0"+gid).length-2);
		}
		if (qtype!="-1"&&gid != undefined){
			data += "&" + $_user.key.qtype + "=" + qtype;
		}
		data += "&" + $_user.key.pn + "=" + pn;
		data += "&" + $_user.key.ps + "=" + ps;
		data += "&" + $_user.key.tp + "=" + tp;
		data += "&" + $_user.key.tr + "=" + tr;
		data += "&rnd=" + Math.random();
		
		nodata = function(){
			Y.get("#nocount").show();
			Y.get("#touzhulist").html("");
			Y.get("#page_div").hide();
		};
		
		Y.get("#nocount").hide();
		var html = "";
		var phtml = "";
		this.ajax({
			url : url,
			type : "POST",
			dataType : "json",
			data : data,
			retry: 3,
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
				var innum = incount = outnum = outcount = 0;
				rows = "";
				if (code == "0") {
					var r = obj.Resp.row;
					if(r == undefined){
						nodata();
						return;
					}
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
					}else{
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o) {
							var rec = rt.rec;
							var zhid = rt.zhid;
							var nickid = rt.nickid;
							var gameid = rt.gameid;
							var pnums = rt.pnums;
							var zhflag = rt.zhflag;
							var finish = rt.finish;
							var success = rt.success;
							var failure = rt.failure;
							var adddate = rt.adddate.substr(0,10);
							var tmoney = rt.tmoney;
							var reason = rt.reason;
							var bonus = rt.bonus;
							var casts = rt.casts;
							html += "<tr>";
							html += "<td>"+$_sys.getlotname(gameid)+"</td>";
							html += "<td>"+$_sys.zhflag[zhflag]+"</td>";
							html += "<td><span class=\"red\">"
									+ parseFloat(tmoney).rmb(false)
									+ "</span>元</td>";
							html += "<td>"+pnums+"</td>";
							html += "<td>"+success+"</td>";
							html += "<td>"+failure+"</td>";
							html += "<td>"+ parseFloat(bonus).rmb(false)+"</td>";
							if (finish==1){						
								html += "<td title="+$_sys.zhreason[reason]+">"+$_sys.zhreason[reason]+"</td>";
							}else{
								html += "<td title=\"进行中\">进行中</td>";
							}					
							html += "<td>"+adddate+"</td>";
							html += "<td><a href=\"xchase.html?zid="+zhid+"&lotid=" + gameid +"\" class=\"a1\">详情</a>";
							if(gameid==1||gameid==50){
								html +="&nbsp;<a href=\""+$_sys.getlotdir(gameid)+"?zid="+zhid+"\" target=_blank>再次追号</a>";
							}
							html += "</td></tr>";
		
						});
					}
				
					phtml=getpage(pn,ps,tp,tr,"P.showlist");
					Y.get("#touzhulist").html(html);	
					Y.get("#page_div").html(phtml);
					Y.get("#touzhulist").show();
					Y.get("#page_div").show();
					Y.get("#nocount").hide();
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						nodata();
					}
				}
			}
		});
	  }
});
