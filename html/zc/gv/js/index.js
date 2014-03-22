$(function(){
	filter.initPage();
});

var filter = {
	params: {
		step: 1,
		stepflag: true,
		caseid: "",
		buyid:"",
		lotname: "sfc",
		gouguan: "",
		code: "",
		op: "",
		condition: ""
	},
	superMan: false, //是否是超级发起人
	showList:"",
	expect:location.search.getParam("expect"),
	url: {
		
	},
	initPage: function(){
		var host = window.location.pathname;
		
		$("#nowexpect").text(filter.expect);
	
		filter.params.lotname = host.split("/")[1];	

	

		var url = "/abc.c",
		data = "t=begin",
		xml = Common.getAjax(url,"post",data);
		filter.showTime();
		//加载对阵
		filter.loadDuiZhen();
		filter.getPost();
		tools.calSFCZhushu();
		filter.showAll(); 		
		//选择场次时着色算注数
		$("#beforefilter").text($("#sltzhushu").text());
		$(".special_td").die().live("click",function(){
			$(this).toggleClass("special_td02");
			var pat = $(this).parent().parent();
			if(pat.find(".special_td02").length<1){
				$(this).addClass("special_td02");
				return;
			}
			var c = 0;
			if($(this).hasClass("xz1")){
				$(this).removeClass("xz1")
				pat.find(".xz2").addClass("xz1");
				pat.find(".xz2").removeClass("xz2");
				pat.find(".xz3").addClass("xz2");
				pat.find(".xz3").removeClass("xz3");
			}else if($(this).hasClass("xz2")){
				$(this).removeClass("xz2")
				pat.find(".xz3").addClass("xz2");
				pat.find(".xz3").removeClass("xz3");
			}else if($(this).hasClass("xz3")){
				$(this).removeClass("xz3");
			}else{
				if(pat.find(".special_td02").hasClass("xz2")){
					$(this).addClass("xz3")
				}else if(pat.find(".special_td02").hasClass("xz1")){
					$(this).addClass("xz2")
				}else{
					$(this).addClass("xz1")
				}
			}
			
			if(filter.params.lotname == "zc"){
//				filter.params.lotname='sfc';
				tools.calSFCZhushu();			
			}else if(filter.params.lotname == "renjiu"){
//				filter.params.lotname='rj';
				tools.calRJZhushu();
			}
		});
		$("#choose_beilu").change(function(){
			filter.getOddsInfo($("#choose_beilu").val());
		});
		
		//生成过滤
		filter.creatTiaoj();
		
		//过滤条件菜单折叠与展开
		$("#conditions .menu").each(function(){
			$(this).die().click(function(){
				$(".menu").removeClass("fold").addClass("open_up");
				$(this).removeClass("open_up").addClass("fold");
				$(".unfold_box").hide();
				$(this).next().show();
				filter.creatTiaoj();
			});
		});
		
		//删除过滤
		filter.deleteTiaoj();
		
		//点击过滤
		$("#dofilter").click(function(){
			filter.doFilter.postFilter();
		});
		
		//保存方案
		$("#savecase").click(function(){
			filter.doFilter.downloadCase();
			
		});
		
		$(".cut_ico").die().live("click", function () {
			var num = $(this).parent().parent().find("input").val();
			num = parseInt(num)+1;
			if(num>100000){
				num = 100000;
			}
			$(this).parent().parent().find("input").val(num);
			updateMoney();
		});
		
		$(".plus_ico").die().live("click", function () {
			var num = $(this).parent().parent().find("input").val();
			num = parseInt(num)-1;
			num= num<1 ? 1 : num;
			$(this).parent().parent().find("input").val(num);
			updateMoney();
		});
		
		$("#beishu").die().live("keyup", function () {
			tools.changeNum($("#beishu"));
			if($(this).val()>100000){
				$(this).val(100000);
			}
			updateMoney();
		});
		function updateMoney(){
			if(parseInt($("#afterfilter").text())){
				var buymoney = parseInt($("#afterfilter").text())*$("#beishu").val()*2;
				$("#buymoney").text(buymoney);
			}
		}
		$("#matchbox").show();
		$(".loading_box").hide();
		
	},
	showTime : function(){

		$.ajax({
			url : "/cpdata/game/80/s.json?rnd=" + Math.random(),
			type : "get",
			cache:false,
			dataType : "json",
			success : function(d) {
				var R = d.period;
				var code = d.period.code;
				if (code == "0") {
					var r = R.row;
//					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o){
						var pid = rt.pid;
						var et = rt.et;
						var cft = rt.fet;
						var at = rt.at;
//						(new Date(et).replace(/-/g,"/"));
						tools.setEndTime(new Date(Date.parse(et.replace(/-/g,"/"))));
						tools.showblocktime();
					});
				}
			}
		
			
		});
	},
	//接受投注串
	getPost: function(){	
		
		
	},
	//根据彩种不同有参数值
	creatParams: function(){		
		if(filter.params.lotname == "zc"){
			filter.params.gouguan = 14; //过关
			filter.params.code = filter.doFilter.getSFCTZCode(); //投注串
			filter.params.op = filter.doFilter.getTZOp(); //欧赔
			filter.params.condition = filter.doFilter.getGVTj(); //过滤条件	
		}else if(filter.params.lotname == "renjiu"){
			filter.params.gouguan = 9;
			filter.params.code = filter.doFilter.getRJTZCode(); 
			filter.params.op = filter.doFilter.getTZOp(); 
			filter.params.condition = filter.doFilter.getGVTj(); 			
		}else if(filter.params.lotname == "jc"){
		
		}else if(filter.params.lotname == "bd"){
		
		}	
		
	},
	//选择过滤条件
	creatTiaoj: function (){
		$("#conditions .unfold_box:visible a:first").unbind().bind("click", function () {
			$("#conditions .unfold_box:visible a:gt(0)").trigger("click");
		});		
		$(".unfold_box:visible a:gt(0)").each(function(i){
			$(this).unbind().bind("click", function () {
				var type = $(this).attr("type"),
				typename = $(this).text(),
				count = i == 4 ? 14 : 14,
				html = [];
				if(filter.params.stepflag){
					filter.params.stepflag = false;
					if(filter.params.step==1){
						$("#filcontent").text("");
					}
					html.push('<div abbr="'+filter.params.step+'" class="title"><i class="closed1"></i>第 <b class="color_red">'+filter.params.step+'</b> 步  条件数：<span id="tiaojcount_'+filter.params.step+'" class="color_red">0</span> &nbsp;&nbsp;剩余注数：<span class="color_red">未处理</span></div>');
				}
				html.push('<ul ftype="'+type+'" abbr="'+filter.params.step+'" class="clearfix song">');
				html.push('<li><i class="closed2"></i>');
				if(type == "jh" || type == "jj"){ //欧赔和
					html.push('<input class="inp_t" style="width:50px;" type="text"></input>≤'+ typename +'≤<input class="inp_t" style="width:50px;" type="text"></input>');
				}else if(type == "hz"){		
					html.push('<select>'+creatOption(42,0)+'</select>≤ '+typename+' ≤<select>'+creatOption(42,42)+'</select>');
				}else if(type == "dd"||type == "lh"){		
					html.push('<select>'+creatOption(13,0)+'</select>≤ '+typename+' ≤<select>'+creatOption(13,13)+'</select>');
				}else if(type == "oh"){		
					html.push('<input class="inp_t" style="width:80px;" type="text" value="'+(parseInt($("#minoph").text()))+'">≤'+ typename +'≤<input class="inp_t" style="width:80px;" type="text" value="'+(parseInt($("#maxoph").text())+1)+'">');
					
				}else if(type == "oj"){		
					html.push('<input class="inp_t" style="width:80px;" type="text" value="'+(parseInt($("#minopj").text()))+'">≤'+ typename +'≤<input class="inp_t" style="width:80px;" type="text" value="'+(parseInt($("#maxopj").text())+1)+'">');	
				
				}else{				
					html.push('<select>'+creatOption(count,0)+'</select>≤ '+typename+' ≤<select>'+creatOption(count,14)+'</select>');
				}
				//html.push('<select>'+creatOption(count)+'</select>');
				html.push('</li></ul>');
				$("#filcontent").append(html.join(""));
				$("#tiaojcount_"+filter.params.step).text(parseInt($("#tiaojcount_"+filter.params.step).text())+1);
				
				$(".inp_t:text").die().live("keyup", function () {
					tools.changeNum($(this));
				});
				
			});
		});
		
		//动态生成option选项
		function creatOption(end,t){
			var o = [];
			for(var i = 0; i <= end; i++){
				if(t!=0 && i==t){
					o[o.length] = '<option value="'+i+'" selected="selected">'+i+'</option>';
				}else{
					o[o.length] = '<option value="'+i+'">'+i+'</option>';
				}
			}
			return o.join("");
		}
	},
	//删除条件
	deleteTiaoj: function(){
		//删除某一步过滤
		$(".closed1").die().live("click",function(){
			var index = $(this).parent().attr("abbr");
			if($(".closed1").length == 1){ //如果只有这一步了，再删除则可以添加下一步
				filter.params.stepflag = true;
			}
			filter.params.step > 1 ? filter.params.step-- : 1; 
			if($(".closed1").length==1){
				var filh='<div class="text_con">'+
				'<h4>在线过滤使用说明</h4>'+
				'<p>1、添加条件、设置条件区间、执行“开始过滤”后“确认投注”；<br>2、310个数、和值区间、断点连号个数、主场连胜平负分析；<br/>3、首次末选、赔率过滤更实用，SP值过滤奖金范围更精确；</p>'+
				'</div>';
				$("#filcontent").html(filh);
				filter.params.stepflag = true;
			}
			$(this).parent().remove();
			$("ul[abbr="+index+"]").remove();			
			$(".title").each(function(){ //将此步后面步骤的abbr等step值减1
				var abbr = $(this).attr("abbr");
				if(abbr > index){
					$(this).attr("abbr",parseInt(abbr)-1);
					$(this).find("b").text(parseInt(abbr)-1);
					$(this).find("span:first").attr("id","tiaojcount_"+(parseInt(abbr)-1));
				}
			});
			$("ul[abbr]").each(function(){ //将此步后面的ul的abbr也要向前移即减1
				var abbr = $(this).attr("abbr");
				if(abbr > index){
					$(this).attr("abbr",parseInt(abbr)-1);
				}
			});
		});	
	
		//删除某步过滤里某个条件
		$(".closed2").die().live("click",function(){
			var index = $(this).parent().parent().attr("abbr");
			//此步骤里只有一个过滤条件了，再删除时检查是否全部只有这一个步骤，若只有一个步骤了，再删除则步骤将全部删除	
			if($("#tiaojcount_"+index).text() == 1){
				filter.params.step > 1 ? filter.params.step-- : 1;
				
				if($(".closed1").length==1){
					var filh='<div class="text_con">'+
					'<h4>在线过滤使用说明</h4>'+
					'<p>1、添加条件、设置条件区间、执行“开始过滤”后“确认投注”；<br>2、310个数、和值区间、断点连号个数、主场连胜平负分析；<br/>3、首次末选、赔率过滤更实用，SP值过滤奖金范围更精确；</p>'+
					'</div>';
					$("#filcontent").html(filh);
					filter.params.stepflag = true;
				}
				if($(".title").length == 1){ //全部过滤只有一步了
					filter.params.stepflag = true;
				}else{ //此步删除后，还有其它步骤，在此步骤后面的要向前移一步
					$(".title").each(function(){  //将此步后面步骤的abbr等step值减1
						var abbr = $(this).attr("abbr");
						if(abbr > index){
							$(this).attr("abbr",parseInt(abbr)-1);
							$(this).find("b").text(parseInt(abbr)-1);
							$(this).find("span:first").attr("id","tiaojcount_"+(parseInt(abbr)-1));
						}
					});
					$("ul[abbr]").each(function(){ //将此步后面的ul的abbr也要向前移即减1
						var abbr = $(this).attr("abbr");
						if(abbr > index){
							$(this).attr("abbr",parseInt(abbr)-1);
						}
					});							
				}
				$(this).parent().parent().prev().remove(); //删除标题
			}else{
				$("#tiaojcount_"+index).text(parseInt($("#tiaojcount_"+index).text())-1);
			}
			$(this).parent().parent().remove();
		});	
		
		//购买
		$("#buy").click(function(){
			if($("#buymoney").text()==0){
				Y.alert("请选过滤，再提交");
				return false;
			}
			Y.postMsg('msg_login', function (){
					filter.buy();
			})
		});
		
		//购买
		$("#buy_hm").click(function(){
			if($("#buymoney").text()==0){
				Y.alert("请选过滤，再合买");
				return false;
			}
			Y.postMsg('msg_login', function (){
				filter.buy_hm();
			});
		})
	},
	//加载对阵
	loadDuiZhen: function(){
		var html = [];
		$.ajax({
			type : "get",
			cache:false,
			dataType : "json",
//			timeout: 1000, 
			url : "/cpdata/match/zc/80/"+filter.expect+".json"+ "?rnd=" + Math.random(),
			success : function(data) {
		 
			var r = data.rows.row;
			r.each(function(rt,o) {
				var itemid = rt.mid;
				var hostteam = rt.hn;
				var visitteam = rt.gn;
				var matchdate = rt.bt;
				var bet3 = (rt.b3!=""&&!isNaN(rt.b3)?parseFloat(rt.b3).rmb(false,2):"--");
				var bet1 = (rt.b3!=""&&!isNaN(rt.b1)?parseFloat(rt.b1).rmb(false,2):"--");
				var bet0 = (rt.b3!=""&&!isNaN(rt.b0)?parseFloat(rt.b0).rmb(false,2):"--");
				risk = rt.iaudit,
				matchstate =  rt.iaudit;		
				html.push('<tr>');
				html.push('<td>'+(o+1)+'</td>');
				html.push('<td class="vs"><a href="#">'+hostteam+'</a> vs <a href="#">'+visitteam+'</a></td>');
				html.push('<td><div class="special_td"><b class="font14">3</b></div></td>');
				html.push('<td><div class="special_td"><b class="font14">1</b></div></td>');
				html.push('<td><div class="special_td"><b class="font14">0</b></div></td>');
				html.push('<td class="rate_num last_fight_td"><span class="sp3">'+bet3+'</span><span class="sp1">'+bet1+'</span><span class="sp0" >'+bet0+'</span></td>');
				html.push('</tr>');			
			})
				$("#duizhen").html(html.join(""));
				filter.getOddsInfo($("#choose_beilu").val());	
				var code = location.search.getParam("code");
				
				if(code!=""){
					var cdArr=code.split(",");
					$(cdArr).each(function(i){
						if(cdArr[i]!="#"){
							var dl=cdArr[i].split("");
							$(dl).each(function(j){
								var sel = 0;
								if(dl[j]=="3"){
									sel = 0
								}else if(dl[j]=="1"){
									sel = 1
								}else if(dl[j]=="0"){
									sel = 2
								}
								if(j==0){
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("special_td02");
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("xz1");	
								}else if(j==1){
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("special_td02");
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("xz2");	
								}else if(j==2){
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("special_td02");
									$("#duizhen tr:eq("+i+") .special_td:eq("+sel+")").addClass("xz3");	
								}
							});
						}
					});
				}
			}

		
			})

		
	},
	getOddsInfo: function(v){
		var url ="/cpdata/omi/odds/zc/oz/"+filter.expect+"/"+v+".xml";
		$.ajax({
			type : "get",
			cache:false,
			dataType : "xml",
			url : url,
			success : function(data) {
				$(data).find("row").each(function(i){
					var xd = $(this).attr("xid");
					var lname = $(this).attr("ln");
					var color = $(this).attr("cl");
					var md = $(this).attr("oddsmid");
					var sd = $(this).attr("sid");
					var ld = $(this).attr("lid");
					var oh = $(this).attr("oh");
					var od = $(this).attr("od");
					var oa = $(this).attr("oa");
					$("#duizhen tr:eq("+i+") .sp3").text(oh);
					$("#duizhen tr:eq("+i+") .sp1").text(od);
					$("#duizhen tr:eq("+i+") .sp0").text(oa);
				})
				tools.calSFCZhushu();
			}
		});

	},
	//过滤
	doFilter: {
		//获取投注串，胜负彩
		getSFCTZCode: function(){
			var allrow = [];
			$("#duizhen tr").each(function(){
				var onerow = [];
				$(this).find(".special_td02").each(function(){
					onerow.push($(this).text());
				});
				allrow.push(onerow.join(""));
			});
			return allrow.join("|");
		},
		//获取投注串，任九
		getRJTZCode: function(){
			var allrow = [];
			$("#duizhen tr").each(function(){
				var onerow = [],$sel = $(this).find(".special_td02"),len = $sel.length;
				if(len > 0){
					$sel.each(function(){
						onerow.push($(this).text());
					});
				}else{
					onerow.push("2");
				}
				allrow.push(onerow.join(""));
			});
			return allrow.join("|");
		},
		//获取欧赔
		getTZOp: function(){
			var allrow = [];
			$("#duizhen tr").each(function(){
				var onerow = [];
				$(this).find("span[class^='sp']").each(function(){
					onerow.push($(this).text());
				});
				allrow.push(onerow.join(","));
			});
			return allrow.join("|");			
		},
		//获取过滤条件
		getGVTj: function(){
			var allstep = [];
			$(".title").each(function(){
				var onestep = [];
				$(this).nextUntil(".title").each(function(){
					var ftype = $(this).attr("ftype"),
					start = $(this).find("select:first").val(),
					end = $(this).find("select:last").val();
					if(ftype == "oh" || ftype == "oj" || ftype == "jh" || ftype == "jj"){
						start = $(this).find("input:first").val();
						end = $(this).find("input:last").val();
					}
					onestep.push(ftype + ":" + start + "-" + end);			
				});
				allstep.push(onestep.join(","));
			});
			return allstep.join("|");
		},
		//提交过滤条件开始过滤
		postFilter: function(){
			if(filter.params.lotname == "sfc"){
				if($("#sltzhushu").text() == 0){
					Y.alert("每场至少选择一种情况");
					return false;
				}
			}else if(filter.params.lotname == "rj"){
				if($("#sltzhushu").text() == 0){
					Y.alert("请正确选择场次");
					return false;
				}			
			}
			if($("#filcontent .title").length<1){
				Y.alert("请先选择条件执行过滤！");
				return false;
			}
//			Y.confirm("正在过滤，请稍后！");
			Y.alert(' 正在过滤，请稍等...');	
			//生成参数
			filter.creatParams();
			
			var url = "/abc.c",
			lottype = filter.params.lotname,
			gouguan = filter.params.gouguan,
			code = filter.params.code,
			op = filter.params.op,
			condition = filter.params.condition;
			if(lottype=="zc"){
				lottype="sfc";
			}else if(lottype=="renjiu"){
				lottype="rj";
			}
			data = "t=filter&lott_type="+lottype+"&code="+code+"&guoguan="+gouguan+"&op="+op+"&condition="+condition,
			json = Common.getAjax(url,"post",data,"json"),
			code = $(json).attr("code");
			
			if(code == 1){
				var resultf = $(json).attr("fliter_list"),
				beforef = resultf[0];
				afterf = resultf[resultf.length-1];
				var ysb = Common.fix(afterf / beforef * 100),
				list = $(json).attr("list"),
				id = $(json).attr("id");
				len = list.length,
				html = [];
				filter.params.caseid = id;
				showList = list;
				
				for(var i = 0; i < 5; i++){
					if(list[i]){
						html.push('<tr><td>'+(i+1)+'</td><td>'+list[i]+'</td></tr>');
					}else{
						html.push('<tr><td>'+(i+1)+'</td><td> </td></tr>');
					}
				}
				$("#filcontent .title").each(function(i){
					$(this).find("span:eq(1)").text(resultf[i+1])
				})
				$("#filterresult tr:gt(0)").remove();
				$("#filterresult").append(html.join(""));
				$("#beforefilter").text(beforef);
				$("#afterfilter").text(afterf);
				$("#ysb").text(ysb+"%");
				//$(".title:last").find("span:last").text(afterf+" 注");
				$("#buymoney").text(afterf*$("#beishu").val()*2);
				
				filter.params.stepflag = true;
				
				filter.params.step=$(".closed1").length+1;
				$("#savecase").attr("able",true);
//				//$.unblockUI();
				Y.alert("<b>过滤成功！</b><br>过滤前 "+beforef+" 注，过滤后 "+afterf+" 注");
				
			}else if(code == 0){ //过滤失败
//				//$.unblockUI();
				Y.alert($(json).attr("msg"));
				var html = [];
				for(var i = 0; i < 5; i++){
					html.push('<tr><td>'+(i+1)+'</td><td> </td></tr>');
				}
				
				$("#filterresult tr:gt(0)").remove();
				$("#filterresult").append(html.join(""));
				$("#beforefilter").text(beforef);
				$("#afterfilter").text("未处理");
				$("#ysb").text("未处理");
				filter.params.caseid = "";
				
				$("#dialog").height($(".dialog-content").height() + $(".dialog-title").height() +25);
			}
		},
		//下载方案
		downloadCase: function(){
			if($("#afterfilter").text()=="未处理"){
				Y.alert("请先过滤方案！");
				return false;
			}
			var url = "/abc.c",
			data = "t=download&id=" + filter.params.caseid,
			json = Common.getAjax(url,"post",data,"json"),
			code = $(json).attr("code"),
			msg = $(json).attr("msg");
			
			if(code == 1){
				window.open("/abc.c?t="+msg);
				
			}else{
				Y.aert(msg);
			}
		}
	},
	//显示所有
	showAll: function(){
		$("#me_close,#ok_close").die().live("click",function(){
		});
		$("#showall").die().live("click",function(){
			if(filter.params.caseid==""){
				Y.alert("请先过滤");
				$("#dialog").height($(".dialog-content").height() + $(".dialog-title").height() +25);
			}else{
				var o=[];
				filter.showPage(o);
			}
		});
	
	},
	showPage:function(o){
		var pageno = (typeof o.pageno == 'undefined' ? 1 : o.pageno);
		var h=[];
		Y.ajax({
		type : "get",
		cache:false,
		dataType : "json",
		url : "/cpdata/match/zc/81/"+filter.expect+".json"+ "?rnd=" + Math.random(),
		end : function(data) {
			 var obj = eval("(" + data.text + ")");
			 var r= obj.rows.row
			h[h.length]='<tr>';
			h[h.length]='<th width="42">序号</th>';
			r.each(function(rt,o) {
			
				var hostteam = rt.hn;
				h[h.length]='<th width="49">'+hostteam+'</th>';
			})
			h[h.length]='</tr>';
			
			
		}

	
	});
	
		var url = "/abc.c",
		data = "t=show&page="+pageno+"&id=" + filter.params.caseid,
		json = Common.getAjax(url,"post",data,"json"),
		code = $(json).attr("code"),
		list = $(json).attr("list");
		$(list).each(function(i){
			h[h.length]='<tr>';
				h[h.length]='<td class="color_333">'+(((pageno-1)*10)+i+1)+'</td>';
				var lArr = list[i].split("");
				$(lArr).each(function(j){
					h[h.length]='<td><b>'+lArr[j]+'</b></td>';
				});
			h[h.length]='</tr>';
		});
		$("#showlist").show();
		$("#showlist table").html(h.join(""));
		Y.use('mask', function(){
			var gvbuy =  this.lib.MaskLay("#showgv");
			gvbuy.addClose('#"showgv"_close','#ok_close');
			Y.get('#showgv .dialog-title').drag('#showgv');
			gvbuy.pop();

		}); 
		
		
		
		var countPage = parseInt($(json).attr("fliter_list")[$(json).attr("fliter_list").length-1]);// 总共数据量
		var pagesize = 10;// 每页显示数量
		if (countPage > 0 && countPage >pagesize) {
		//$("#showlist .gv_table").append('<tr><td colspan="6"><div id="loadPage" class="page song"></div></td></tr>'); //分页
		var temppage = 0;
		temppage = parseInt(countPage / pagesize);
		if (countPage % pagesize == 0) {
			allInterFace.totalpages = temppage;
		} else {
			allInterFace.totalpages = temppage + 1;
		}
		allInterFace.pageno = pageno;
		callpage(allInterFace.pageno,countPage);//加载分页
		executionPage(o);//执行分页
		}else{
			$("#loadPage").hide();
		}
		$("#glq").text($("#beforefilter").text());
		$("#glh").text($("#afterfilter").text());
		$("#ysb2").text($("#ysb").text());
		
	},
	//购买
	buy: function(){
		if($("#buymoney").text()>2000000){
			Y.alert("投注金额不能大于200万");
			return false;
		}
		Y.alert(page.loadingbuy);
		if(filter.params.caseid!=filter.params.buyid){
			var url="/abc.c",
			databuy = "t=buy&id=" + filter.params.caseid,
			jsonbuy = Common.getAjax(url,"post",databuy,"json"),
			codebuy = $(jsonbuy).attr("code");
		}
		if(codebuy==1 || filter.params.caseid==filter.params.buyid){
			filter.params.buyid=filter.params.caseid;
			var expect = filter.expect;
			var id = filter.params.caseid;          //ID每个过滤特有的
			var bnumber  =$("#afterfilter").text();       //过滤后的注数
			var lott_type = filter.params.lotname;  //sfc, rj
			var gid=80;
			var wrate=2;
			var oflag=1;
			
			var zhushu = $("#afterfilter").html(),
			beishu = $("#beishu").val(),
			money = $("#buymoney").html(),
			
			baodinumber =0,

			buynumber = $("#buymoney").html(),
			 content= "",
			 title= "";
		
		
			if(lott_type=='zc'){
				lott_type='sfc';
				gid=80;
			}else if(lott_type=="renjiu"){
				lott_type='rj';
				gid=81;
			}
			var url = "/filtercast.phpx";
		
			
			var data ='bnum='+buynumber+'&codes=过滤&comeFrom=&desc='+title+'&endTime=&fflag=1&gid='+gid+'&money='+money+'&muli='+beishu+'';
				data+='&name='+ encodeURIComponent(content)+'&oflag='+oflag+'&pid='+expect+'&play=1&pnum='+baodinumber+'&source=10&tnum='+money+'';
				data+='&type=0&wrate='+wrate+'&lottType='+lott_type+'&id='+id+'&number='+bnumber+'';
			
				$.ajax({
					url : url,
					data:data,
					type : "post",
					cache:false,
					success : function(d) {
						var d=Y.dejson(d)
						var code = d.errcode;
						var msg =d.msg
						if (code == "0") {	
							var projid=d.projid;
							   $('#dlg_buysuc_view').bind({
					            	 click:function(){	            		
					            		 window.location= $_sys.getlotdir(gid)+$_sys.url.viewpath+'?lotid='+gid+'&projid='+projid;	            		 
					            	 }
					             });
							Y.use('mask', function(){
								var dlgbuysuc = this.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
						        dlgbuysuc.addClose('#dlg_buysuc_close,#dlg_buysuc_close2,#dlg_buysuc_back');
						        Y.get('#dlg_buysuc div.tan_top').drag('#dlg_buysuc');  
						        dlgbuysuc.pop('<div class="txt_suc" style="font-size:14px">恭喜您购买成功!</div>');
							});
							
						}else{
							Y.alert(msg);
						}
					}
				
					
				});
		}else{
			//$.unblockUI();
		}
	},
	buy_hm: function(){
		if($("#buymoney").text()>2000000){
			Y.alert("投注金额不能大于200万");
			return false;
		}
		var msg = page.sponsorBuy();
//		filter.isSuper(1,3);
		
		if($.browser.msie){
			$("#content").die().live("keyup blur",function(){
				var len = $(this).html();
				if(len.length > 200){
					$(this).html(len.substring(0,200))
				}
			})
		}
		filter.countBuy(1);//计算发起合买
		Y.use('tabs,dataInput,mask', function(){
			 if (this.get('#case_ad textarea').size()) {// content
	             this.lib.DataInput({
	                  input:'#case_ad textarea',
	                  type: 'default',
	                  max: 200,
	                  change: function (val){
	                      var len, tip;
	                      tip = this.input.next('span');
	                      len = val.length;
	                      tip.html('已输入'+len+'个字符，最多200个');
	                  }
	             })               
	         };
	         if (this.get('#case_ad input').size()) {//title
	             this.lib.DataInput({
	                  input:'#case_ad input',
	                  type: 'default',
	                  len: 20,
	                  change: function (val){
	                      this.input.next('span').html('已输入'+val.length+'个字符，最多20个')
	                  }
	             })               
	         };
		})
		
		Y.use('mask', function(){
			var gvbuy =  this.lib.MaskLay('#gvbuy');
			gvbuy.addClose('#gvbuy_close','#gvbuy_ok');
			Y.get('#gvbuy .tan_top').drag('#gvbuy');
			gvbuy.pop();

		}); 
		Y.get("#gvbuy_ok").click(function(){
			filter.pt_hm();
			
		})
			
		
	},
	pt_hm:function(){
		
	
		if(filter.params.caseid!=filter.params.buyid){
			var url="/abc.c",
			databuy = "t=buy&id=" + filter.params.caseid,
			jsonbuy = Common.getAjax(url,"post",databuy,"json"),
			codebuy = $(jsonbuy).attr("code");
		}
		if(codebuy==1 || filter.params.caseid==filter.params.buyid){
			filter.params.buyid=filter.params.caseid;
			var expect = filter.expect;
			var id = filter.params.caseid;          //ID每个过滤特有的
			var bnumber  =$("#afterfilter").text();       //过滤后的注数
			var lott_type = filter.params.lotname;  //sfc, rj
			var gid=80;
			var wrate=2;
			var oflag=1
			var zhushu = $("#afterfilter").html(),
			beishu = $("#beishu").val(),
			money = $("#buymoney").html(),
			anumber = $("#anumber .sel b:eq(1)").text(),
			baodinumber = $("#bdInput").val(),

			buynumber = $("#buynumber").val(),
			 content= $("#caseTitle").val()
			var tmp= Y.get("#caseInfo");
			tmp=tmp.value == tmp.defaultValue ? '' : tmp.value
			$("#gkfs em").each(function(){
				if($(this).hasClass("cur")){
					oflag=$(this).attr("value");
				}
			})
			$("#tc b").each(function(){
				if($(this).hasClass("cur")){
					wrate=$(this).attr("value");
				}
			})
		
			if(lott_type=='zc'){
				lott_type='sfc';
				gid=80;
			}else if(lott_type=="renjiu"){
				lott_type='rj';
				gid=81;
			}
			var url = "/filtercast.phpx";
		
			
			var data ='bnum='+buynumber+'&codes=过滤&comeFrom=&desc='+tmp+'&endTime=&fflag=1&gid='+gid+'&money='+money+'&muli='+beishu+'';
				data+='&name='+ encodeURIComponent(content)+'&oflag='+oflag+'&pid='+expect+'&play=1&pnum='+baodinumber+'&source=10&tnum='+money+'';
				data+='&type=1&wrate='+wrate+'&lottType='+lott_type+'&id='+id+'&number='+bnumber+'';
			
				$.ajax({
					url : url,
					data:data,
					type : "post",
					cache:false,
					success : function(d) {
						var d=Y.dejson(d)
						var code = d.errcode;
						var msg =d.msg
						if (code == "0") {	
							var projid=d.projid;
							   $('#dlg_buysuc_view').bind({
					            	 click:function(){	            		
					            		 window.location= $_sys.getlotdir(gid)+$_sys.url.viewpath+'?lotid='+gid+'&projid='+projid;	            		 
					            	 }
					             });
							Y.use('mask', function(){
								var dlgbuysuc = this.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
						        dlgbuysuc.addClose('#dlg_buysuc_close,#dlg_buysuc_close2,#dlg_buysuc_back');
						        Y.get('#dlg_buysuc div.tan_top').drag('#dlg_buysuc');  
						        dlgbuysuc.pop('<div class="txt_suc" style="font-size:14px">恭喜您购买成功!</div>');
							});
							$("#gvbuy_close").click();

//							 window.location= $_sys.getlotdir(gid)+$_sys.url.viewpath+'?lotid='+gid+'&projid='+projid;
						}else{
							Y.alert(msg);
						}
					}
				
					
				});
				

		}else{

		}
	},
	//检测并更新保底
	checkBaodi: function(){
		if($("#fa_number").val() != ""){
			if($("#baodi").attr("checked")){
				$("#baodi").trigger("click");
			}
			if($("#baodi_number").attr("disabled")){
				$("#baodi").attr("checked",false);
			}else{
				$("#baodi").attr("checked",true);
			}
		}else{
			$("#baodi").attr("checked",false);
			$("#baodi_number").val("").attr("disabled",true);
			$("#baodi_rmb").html("￥0");
		}
	},
	//计算发起合买
	countBuy: function(flag,str){
		var bs =1,zs=14,zje;
	
		bs = $("#beishu").val();//倍数
		zs = $("#buymoney").text()/bs/2;//注数
		
		zje = zs * 2 * bs;//合计金额
		fs = zje/2;	
		$("#buyMoneySpan2 , #fsInput").text(zje);//合计金额
		$("#fsMoney").text("1");
		$("#buynumber").val(Math.ceil(zje*0.05));
		$("#rgMoney").text(Math.ceil(zje*0.05).rmb());
		$("#rgScale").text((Math.ceil(zje*0.05)/zje*100).toFixed(2)+"%");
		//filter.userInfos(flag,zje);
		if(flag == 1){//(0:个人，1:合买)
		
			filter.sponsorToBy();
			$("#buynumber").trigger("blur",[true]);//默认认购份数
		}
	},
	//合买中的算法
	sponsorToBy:function(){


		$("#gkfs em").die("click").live("click",function(){//保密设置切换
			 $("#gkfs em").removeClass("cur");
			 $(this).addClass("cur");
		});
		$("#tc b").die("click").live("click",function(){//提成率切换
			 $("#tc b").removeClass("cur");
			 $(this).addClass("cur");
		});
		$("#moreCheckbox").die("click").live("click",function(){//可选 信息
			 if($(this).attr("checked")){
				$("#case_ad").show();
			 }else{
				 $("#case_ad").hide();
			 }

		})
		 $('#isbaodi').click(function (){
               if(this.checked){
            	   $('#bdInput').val(Math.ceil($("#fsInput").text()*1-($('#buynumber').val()*1))).removeAttr("disabled");
            	  var zfs=$("#bdInput").text()*1;
                  var  fs=$("#bdInput").text()*1;
                  var mf =1;
                    $('#bdMoney').html((fs === 0 || fs === 0 ? 0 : mf* fs).rmb());
                    $('#bdScale').html((fs ===0 ? 0 : (fs/zfs*100).toFixed(2))+'%');
               }else{
            	   $('#bdInput').val(0).attr("disabled","disabled");
            	   $("#bdMoney").text("0.00");
            	   $("#bdScale").text("0.00")
               }
            });
		//确认购买多少份
		$("#buynumber").keyup(function(){
			  var d, fs, low, mf;
			  $(this).val($(this).val()>$("#buymoney").text()*1?$("#buymoney").text()*1:$(this).val())
             fs = $(this).val()*1;
             
             zfs=$("#buymoney").text()*1;
             low=$("#buymoney").text()*0.05;
              mf =1;
              $('#rgMoney').html((fs === 0 || fs === 0 ? 0 : mf* fs).rmb());
              $('#rgScale').html((fs ===0 ? 0 : (fs/zfs*100).toFixed(2))+'%');
              if (fs < low) {
                  $('#rgErr').html('您至少需要认购'+low+'份，共计'+(low * mf).rmb()+'元！').show();
              }else{
            	  $('#rgErr').hide();
              }
             
		})
		$("#bdInput").keyup(function(){
			  var d, fs, low, mf;
			  $(this).val($(this).val()>Math.ceil($("#fsInput").text()*1-($('#buynumber').val()*1))?Math.ceil($("#fsInput").text()*1-($('#buynumber').val()*1)):$(this).val())
             fs = $(this).val()*1;
             
             zfs=$("#buymoney").text()*1;
             low=$("#buymoney").text()*0.05;
              mf =1;
              $('#bdMoney').html((fs === 0 || fs === 0 ? 0 : mf* fs).rmb());
              $('#bdScale').html((fs ===0 ? 0 : (fs/zfs*100).toFixed(2))+'%');
              if (fs < low) {
                  $('#bdErr').html('您至少需要保底'+low+'份，共计'+(low * mf).rmb()+'元！').show();
              }else{
            	  $('#bdErr').hide();
              }
             
		})
//		Common.isNum("buynumber",function(v,f){//blur
//			
//			 var zje =$("#rgMoney").text();
//			 var anyuan =$("#rgScale").text();
//			 var val = (v == 0 || v == "") ? 1 : v;
//			 var comp = parseInt((val/zje)*100);
//			 if(val >= parseInt(zje)){
//				filter.baodiTextVal("0%","0","");
//				filter.commitTextVal("100%(本方案最多只能分为"+zje+"份!)",(zje * anyuan),zje);
//			 }else{
//				if(comp == 0){
//					for(var i=1;i<parseInt(zje);i++){
//					   if(i/parseInt(zje)*100>1){
//							//comp ="方案发起人至少要认购方案的1";
//							//if(f)comp ="1";
//							comp = parseInt((i/zje)*100);
//							filter.commitTextVal(comp+"%",(i * anyuan),i);
//							return;
//					   }
//					   i++;
//					}
//				}else{
//					filter.commitTextVal(comp+"%",(val * anyuan),val);
//				}
//			 }
//			 $("#baodinumber").trigger("blur");
//		},function(val){//keyup
//			 if(val == 0) $("#buyNum").text("0%");
//		});
		//全额保底

		
	},
	fillHtml :function (self,price,flag){
	   $("#anumber").find("li:eq(0) b:eq(1)").text(price/2).end().find("li:eq(1) b:eq(1)").text(price);
	   self.parent().find("span:first").text(price);
	   $("#anumber li").trigger("click",[flag]);
	},
	setVal: function (val,id){
		if(val =="" || val ==0)val = 1;
		if(val > 10000) val = 10000;
		$("#"+id).val(val);
	},
	//确认购买多少份
	commitTextVal: function (msg,yuan,val){
		$("#buyNum").text(msg);
		$("#buyYuan").text(yuan);
		$("#buynumber").val(val);
	},
	//保底
	baodiTextVal: function (msg,yuan,val){
		$("#baodiNum").text(msg);
		$("#baodiYuan").text(yuan);
		$("#baodinumber").val(val);
	},
	isSuper: function(lt,pt){
		var url = "/trade/queryis.go";
		var data = "lottype=" + lt + "&playtype=" + pt;
		var xml = Common.getAjax(url,"post",data);
		var issuper = $(xml).find("info").attr("issuper");
		if(issuper == "1"){
			filter.superMan = true;
		}
	}
}
function loadShow(o){
	filter.showPage(o);
	$("#nopage").val($("#loadPage a.sel").text());
} 

var tools = {
	//计算注数胜负彩
	calSFCZhushu : function(){
		var allDX = 0, allSHX = 0, allSX = 0, zhushu = 1, flag = true;
		var maxopj=1,minopj=1,minoph=0,maxoph=0;
		$("#duizhen tr").each(function(){
			var dx = 0, shx = 0, sx = 0, len = $(this).find(".special_td02").length;
			if(len == 0){
				flag = false;
				return ;
			}else if(len == 1){
				dx++;
				shx > 0 ? shx-- : 0;
				sx > 0 ? sx-- : 0;
			}else if(len == 2){
				shx++;
				dx > 0 ? dx-- : 0;
				sx > 0 ? sx-- : 0;
			}else if(len == 3){
				sx++;
				dx > 0 ? dx-- : 0;
				shx > 0 ? shx-- : 0;
			}
			if(len>0){
				var maxsp,minsp;
				var sp3=$(this).find(".sp3").text();
				var sp1=$(this).find(".sp1").text();
				var sp0=$(this).find(".sp0").text();
				maxsp=0;
				minsp=10;
				$(this).find(".special_td").each(function(i){
					if($(this).hasClass("special_td02")){
						
						if(i==0){
							maxsp=sp3;
							minsp=sp3;
						}else if(i==1){
							if(sp1>maxsp){
								maxsp = sp1;
							}
							if(sp1<minsp){
								minsp = sp1;
							}
						}else if(i==2){
							if(sp0>maxsp){
								maxsp = sp0;
							}
							if(sp0<minsp){
								minsp = sp0;
							}
						}
					}
				});
				maxopj=maxopj*maxsp;
				minopj=minopj*minsp;
				maxoph=Common.fix(maxoph*1+maxsp*1);
				minoph=Common.fix(minoph*1+minsp*1);
			}
			allDX += dx;
			allSHX += shx;
			allSX += sx;
			zhushu *= len;
		});
		$("#maxopj").text(Common.fix(maxopj));
		$("#minopj").text(Common.fix(minopj));
		$("#maxoph").text(maxoph);
		$("#minoph").text(minoph);
		$("#dxnum").text(allDX);
		$("#shxnum").text(allSHX);
		$("#sxnum").text(allSX);
		$("#sltzhushu").text(flag ? zhushu : 0);
		$("#beforefilter").text(flag ? zhushu : 0);
		$("#afterfilter").text("未处理");
		$("#ysb").text("未处理");
		$("#buymoney").text(0);
		$("#filcontent .title").each(function(){
			$(this).find("span:eq(1)").text("未处理")
		});
		var html = [];
		for(var i = 0; i < 5; i++){
			html.push('<tr><td>'+(i+1)+'</td><td> </td></tr>');
		}
		$("#filterresult tr:gt(0)").remove();
		$("#filterresult").append(html.join(""));
		filter.params.caseid = "";
	},
	//计算注数胜负彩
	calRJZhushu: function(){
		var allDX = 0, allSHX = 0, allSX = 0, zhushu = 1, sel = 14;
		$("#duizhen tr").each(function(){
			var dx = 0, shx = 0, sx = 0, 
			len = $(this).find(".special_td02").length;
			if(len == 0){
				sel--;
			}else if(len == 1){
				dx++;
				shx > 0 ? shx-- : 0;
				sx > 0 ? sx-- : 0;
			}else if(len == 2){
				shx++;
				dx > 0 ? dx-- : 0;
				sx > 0 ? sx-- : 0;
			}else if(len == 3){
				sx++;
				dx > 0 ? dx-- : 0;
				shx > 0 ? shx-- : 0;
			}
			allDX += dx;
			allSHX += shx;
			allSX += sx;
			zhushu *= len > 0 ? len : 1;
		});
		$("#dxnum").text(allDX);
		$("#shxnum").text(allSHX);
		$("#sxnum").text(allSX);
		$("#sltzhushu").text(sel < 9 ? 0 : zhushu);	
		$("#beforefilter").text(sel < 9 ? 0 : zhushu);
		$("#afterfilter").text("未处理");
		$("#ysb").text("未处理");
		$("#buymoney").text(0);
		$("#filcontent .title").each(function(){
			$(this).find("span:eq(1)").text("未处理")
		});
		var html = [];
		for(var i = 0; i < 5; i++){
			html.push('<tr><td>'+(i+1)+'</td><td> </td></tr>');
		}
		$("#filterresult tr:gt(0)").remove();
		$("#filterresult").append(html.join(""));
		filter.params.caseid = "";
	},
	changeNum : function(e){
		var val = e.val();
		if(val==""){
			e.val("1");
		}
		var re = /^[1-9]\d*$/;
		if (!re.test(val))
		{
			e.val(val.replace(/\D/g,''));
		}
		if(val=="0"||!re.test(val)){
			e.val("1"); 
		}
	},
	clock: "",
	endTime: new Date(),
	setEndTime: function(t){
	 this.endTime = t;
	},
	showblocktime: function(){
		var sellingmsg = "正在销售";
		var microsecond = 1000;
		var Secondms = 60 * 1000;
		var hoursms = 60 * 60 * 1000;
		var daysms = 24 * 60 * 60 * 1000;
		var time = new Date();
		var hour = time.getHours();
		var minute = time.getMinutes();
		var second = time.getSeconds();
		var convertHour = -1;
		var convertMinute = -1;
		var convertSecond = -1;
		var Diffms = this.endTime.getTime() - time.getTime();
		var DifferHour = Math.floor(Diffms / daysms);
		Diffms -= DifferHour * daysms;
		var DifferMinute = Math.floor(Diffms / hoursms);
		Diffms -= DifferMinute * hoursms;
		var DifferSecond = Math.floor(Diffms / Secondms);
		Diffms -= DifferSecond * Secondms;
		var dSecs = Math.floor(Diffms / microsecond);
		DifferHour = DifferHour < 10 ? '0'+DifferHour:DifferHour;
		DifferMinute = DifferMinute < 10 ? '0'+DifferMinute:DifferMinute;
		DifferSecond = DifferSecond < 10 ? '0'+DifferSecond:DifferSecond;
		dSecs = dSecs < 10 ? '0'+dSecs:dSecs;
		Diffms = this.endTime.getTime() - time.getTime();
		if(Diffms < 0){
			DifferHour = 0;
			DifferMinute = 0;
			DifferSecond = 0;
			dSecs = 0;
			sellingmsg = "销售截止";
		}
		$(".date_time").html(DifferHour+"天 "+ DifferMinute +"时 "+ DifferSecond +"分 "+ dSecs +"秒 ");
		$(".icon_selling").html(sellingmsg);
		clock = setTimeout('tools.showblocktime()',1000);
	}
}