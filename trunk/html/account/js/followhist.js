/**
 * 跟单流水
 */
Class({
	ready: true,
	
	'pn':1,// 页码
	'ps':10,// 页面大小
	'tp': 0,// 总页数
	'tr':0,// 总记录数
	 index:function (config){
		var html="";
		html+="<li><a href=\"#\" class=\"selected cm_gcjl_xla\">全部彩种</a></li>";
		for (var i=0; i<$_sys.lottype.length;i++){
			html+="<li><b>"+$_sys.lottype[i][0]+"</b></li>";
			var tmp=$_sys.lottype[i][2].split(",");
			for (var j=0; j<tmp.length;j++){
				html+=" <li><a href=\"#\">"+$_sys.getlotname(tmp[j]).replace("北京单场-","").replace("竞彩足球-","").replace("竞彩篮球-","")+"</a></li>";
			}
			html+="</li>";
		}
		$("#lotid").append(html);
		this.getservernow();
    	$("#cm_gcjl_select").cloneselect();
		this.submitbind();
		Y.C('logininfo',this.showinfo);
	     Y.C('logoutinfo',this.logoutinfo);
        this.loadLogin();
	  },
    logoutinfo:function(){
	    location="/";
	 },
    showinfo:function(){
    	P.getlist( "0",P.pn, P.ps,P.tp, P.tr,$("#begintime").val(), $("#endtime").val());
	},
	 getservernow:function(){
	    	P=this;
	    	Y.ajax({
	    		url : "/cpdata/time.json",
	    		end : function(data) {
	    			var servernow = Y.getDate(data.date);
	    			var d_e = new Date(servernow);
	    			var d_s = d_e.dateadd("m", -3);
	    			$("#begintime").val(d_s.format("YY-M-D"));
	    			$("#endtime").val(d_e.format("YY-M-D"));
	    			
	    			
	    		}
	    	});
	    	
	    },
	 submitbind:function(){
	    	P=this;
	    	this.get('#submit').click(function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
	    			var ps = $("input[name='pages']:checked").val();// 页面大小
	    			P.getlist($_sys.getlotid($("#lotname").val()),P.pn, ps, P.tp, P.tr,$("#begintime").val(), $("#endtime").val());
	    		});
	    	
	    },
	  showlist : function( pn, ps, tp, tr){
	   	P=this;
	    P.getlist($_sys.getlotid($("#lotname").val()),pn, ps, tp, tr,$("#begintime").val(), $("#endtime").val());
	  },


	  getlist: function(gid, pn, ps, tp, tr,stime,etime) {// 页码 页面大小 总页数 总记录数
		var data = "";
		tp=0;
	
		if (gid == 0 || gid == undefined) {
		
		} else {
			data += "&" + $_user.key.gid + "=" + ("0"+gid).substr(("0"+gid).length-2);
		}
		data += "&" + $_user.key.pn + "=" + pn;
		data += "&" + $_user.key.ps + "=" + ps;
		data += "&" + $_user.key.tp + "=" + tp;
		data += "&" + $_user.key.tr + "=" + tr;
		data += "&" + $_user.key.etime + "=" + etime;
		data += "&" + $_user.key.stime + "=" + stime;
	
	    
	    $("#div1").hide();
		$("#div2").show();
		$("#div2").html(loging);
	  	
	    var html = "";
		var phtml = "";
		Y.ajax({
			url : $_user.url.followhist,
			type : "POST",
			dataType : "json",
			data : data,
			end  : function (d){
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
						html += "<div class=\"cm_account_wu cm_yzxborder\" >您最近暂没有跟单记录</div>";
					}else if(!this.isArray(r)){
							var rec = r.rec;
							var gameid = r.cgameid;
							var owner = r.cowner;
							var projid = r.cprojid;
							var state = r.istate;
							var imoney = r.imoney;
							var success = r.isuccess;
							var reason = r.creason;
							var adddate = r.cadddate;
					 
							html += "<ul class=\"cm_account_ul9 cm_zborder arial clear1\">";
							html += " <li class=\"cm_account_ul9_li1\">"+rec+"</li>";
							html += " <li class=\"cm_account_ul9_li10\">"+$_sys.getlotname(gameid)+"</li>";
							html += " <li class=\"cm_account_ul9_li5\">"+owner+"</li>";
							var surl = $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid=' + gameid + '&projid=' + projid;
							html += '  <li class=\"cm_account_ul12_li2\"><a href=\"' + surl + '\" target=_blank class="a1">' +projid+'</a></li>';
							html += " <li class=\"cm_account_ul12_li4\"><span class=\"cm_red\">"
									+ parseFloat(imoney).rmb(false)
									+ "</span>元</li>";
							
							if ( state == 0 ) {
								html += " <li class=\"cm_account_ul12_li10\">未处理</li>";
							} else {
								html += " <li class=\"cm_account_ul12_li10\">已处理</li>";
							}
							if ( success == 0 ) {
								if ( state == 1 ) {
									html += " <li class=\"cm_account_ul12_li5\">不成功</li>";
								}
							} else {
								html += " <li class=\"cm_account_ul12_li5\">成功</li>";
							}
							html += " <li class=\"cm_account_li6\">"+reason+"</li>";
							html += " <li class=\"cm_account_ul9_li8\">"+adddate+"</li>";
							html += " </ul>";
					}else{
						r.each(function(rt,o) {
							var rec = rt.rec;
							var gameid = rt.cgameid;
							var owner = rt.cowner;
							var projid = rt.cprojid;
							var state = rt.istate;
							var imoney = rt.imoney;
							var success = rt.isuccess;
							var reason = rt.creason;
							var adddate = rt.cadddate;
					 
							html += "<ul class=\"cm_account_ul9 cm_zborder arial clear1\">";
							html += " <li class=\"cm_account_ul9_li1\">"+rec+"</li>";
							html += " <li class=\"cm_account_ul9_li10\">"+$_sys.getlotname(gameid)+"</li>";
							html += " <li class=\"cm_account_ul9_li5\">"+owner+"</li>";
							var surl = $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid=' + gameid + '&projid=' + projid;
							html += '  <li class=\"cm_account_ul12_li2\"><a href=\"' + surl + '\" target=_blank class="a1">' +projid+'</a></li>';
							html += " <li class=\"cm_account_ul12_li4\"><span class=\"cm_red\">"
									+ parseFloat(imoney).rmb(false)
									+ "</span>元</li>";
							
							if ( state == 0 ) {
								html += " <li class=\"cm_account_ul12_li10\">未处理</li>";
							} else {
								html += " <li class=\"cm_account_ul12_li10\">已处理</li>";
							}
							if ( success == 0 ) {
								if ( state == 1 ) {
									html += " <li class=\"cm_account_ul12_li5\">不成功</li>";
								}
							} else {
								html += " <li class=\"cm_account_ul12_li5\">成功</li>";
							}
							html += " <li class=\"cm_account_li6\">"+reason+"</li>";
							html += " <li class=\"cm_account_ul9_li8\">"+adddate+"</li>";
							html += " </ul>";
						});
					}
					phtml+="<div class=\"cm_account_numjl clear\">";
					phtml+=getpage(pn,ps,tp,tr,"P.showlist");
				    phtml+="</div>";
					$("#div2").html(html);	
					$("#page_v").html(phtml);
					$("#div2").show();
					$("#page_v").show();
					$("#div1").hide();
				} else {
					if (code=="1"){
						Y.postMsg('msg_login', function() {						
							window.location.reload();			
						});
					}else{
						$("#div1").show();
						$("#div2").hide();
						$("#page_v").hide();
					}
				}
			},
			error : function() {
				alert("您所请求的页面有异常！");
				return false;
			}
		});
	  }
});
