Class({
	 ready: true,
	 index:function (config){
		this.initBtn();
		this.loadZH();
		this.loadZHDetail();
		this.LoginAcc();
	 },
	 initBtn : function(){
		 $("#btn_zh_cancel").click(function(){
			 var zid = location.search.getParam('zid');
			 var lotid = location.search.getParam('lotid');
			 var sel = $("input[id^='zhd_']:checked");
			 if(sel.length < 1){
				 alert("请选勾选要取消的追号明细!");
				 return;
			 }
			 var vals = [];
			 for(var i = 0; i < sel.length; i++){
				 vals.push($(sel[i]).val());
			 }
			 Y.ajax({
				url : $_trade.url.zcancel,
				type : "POST",
				dataType : "json",
				data : {
					gid : lotid,
					zid : zid,
					did : vals.join(",")
				},
				retry: "1",
				end  : function (d){
					var obj = eval("(" + d.text + ")");
		   		    var code = obj.Resp.code;
		   		    var desc = obj.Resp.desc;
		   		 $("#btn_all_cancel").removeAttr("checked");
		   		    alert(desc);
		   		    if(code == 0){
		   		    	window.location.reload();
		   		    }
				}
			 });
		 });
		 $("#btn_all_cancel").click(function(){
			 var sel = $("input[visible]");
			 if(sel.length < 1){
				 alert("所有追号任务已投注或撤单!");
				 $(this).removeAttr("checked");
				 return;
			 }
			 var vals = [];
			 if($(this).attr("checked")){
				 for(var i = 0; i < sel.length; i++){
					 $(sel[i]).attr("checked",'true');
					 vals.push($(sel[i]).val());
				 }
			 }else{
				 for(var i = 0; i < sel.length; i++){
					 $(sel[i]).removeAttr("checked");
					 vals.push($(sel[i]).val());
				 }
			 }
		 });
	 },
	 loadZH : function(){
		var lotid = location.search.getParam('lotid');
		var zid = location.search.getParam('zid');
		this.ajax({
			url : '/phpu/q.phpx?fid=q_u_xzh',
			type : "POST",
			dataType : "json",
			data : {
				gid : lotid,
				tid : zid
			},
			retry: 1,
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
	   		    var r = obj.Resp.row;
	   		    if(code == 0){
	   		    	$("#zh_game").append($_sys.getlotname(lotid));
	   		    	$("#zh_id").append(zid);
	   		    	$("#zh_time").append(r.adddate);
	   		    	$("#zh_money").append(r.tmoney + "元");
	   		    	$("#zh_jd").append("已追" + (parseInt(r.success) + parseInt(r.failure)) + "期/共" + r.pnums + "期");
	   		    	$("#zh_state").append(r.finish == '1' ? "追号已完成" : "追号进行中");
	   		    	$("#zh_memo").append(r.zhflag == '0' ? "中奖后不停止" : (r.zhflag == '1' ? "中奖后停止" : "盈利后停止"));
	   		    }else{
	   		    	log(desc);
	   		    }
			}
		});
	 },
	 
	 loadZHDetail : function(){
		var lotid = location.search.getParam('lotid');
		var zid = location.search.getParam('zid');
		this.ajax({
			url : $_user.url.xchase,
			type : "POST",
			dataType : "json",
			data : {
				gid : lotid,
				tid : zid
			},
			retry: 1,
			end  : function (d){
				var obj = eval("(" + d.text + ")");
	   		    var code = obj.Resp.code;
	   		    var desc = obj.Resp.desc;
	   		    var r = obj.Resp.row;
	   		    if(code == '0'){
	   		    	if(!this.isArray(r)){r=new Array(r);}
	   		    	var bcode = r[0].ccodes.split(";");
	   		    	var xcode = "";
	   		    	bcode.each(function(i,o){
	   		    		if(o%3==0){
	   		    			xcode += i.substring(0,i.indexOf(":")) + "<br/>";
	   		    		}else{
	   		    			xcode += i.substring(0,i.indexOf(":")) + ";";
	   		    		}
	   		    	});
	   		    	$("#zh_code").append(xcode);
	   		    	
	   		    	r.each(function(rt,o){
	   		    		var html = "<tr>";
	   		    		html += "<td><input type='checkbox' id='zhd_"+rt.idetailid+"' value='"+rt.idetailid+"'" + ( rt.istate != 0 ? ' disabled' : 'visible=0' ) + "/></td>";
	   		    		html += "<td>" + rt.cperiodid + "</td>";
	   		    		html += "<td>" + rt.imulity + "倍</td>";
	   		    		html += "<td>" + rt.cawardcode + "</td>";
	   		    		html += "<td>" + rt.icmoney + "元</td>";
	   		    		html += "<td>" + (rt.istate == '0' ? '未投注' : (rt.istate == '1' ? '投注中' :(rt.istate == '2' ? '已投注' : '已退款'))) + "</td>";
	   		    		var win = "--";
	   		    		if(rt.istate == '2'){
   		    				win = "待开奖";
	   		    			if(rt.ibingo == '2'){
	   		    				win = "未算奖";
		   		    			if(rt.iaward == '2'){
		   		    				win = "已算奖";
		   		    				if(rt.iamoney > 0) {
				   		    			win = "<font color='red'>" + rt.iamoney + "</font>元";
				   		    		} else {
				   		    			win = "未中奖";
				   		    		}
		   		    			} 
	   		    			}
		   		    		
	   		    		} else if(rt.istate > 2){
	   		    			win = "已撤单";
	   		    		}
	   		    		html += "<td>" + win + "</td>";
	   		    		html += "<td>" + rt.ccastdate + "</td>";
	   		    		html += "</tr>";
	   		    		$(html).appendTo($("#xchase_table_body"));
	   		    	});
	   		    } else {
	   		    	log(desc);
	   		    }
			}
		});
	 }
});