Class({
	ready: true,
    index:function (config){
    	Class.C('lot_id',$("#lotid").val());
    }	
});
var ename = "";
$(function() {
	var lotid=$("#lotid").val();
	var expect = location.search.getParam('expect');
	if(lotid==""){$_sys.showerr('对不起，该期暂未开售或者已经过期!');}
	
	$("#qihao").html(expect);
	$('#kj_qihao').html("<b>"+expect+"</b>");
	var listsize = 21;
	if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
//		showkpinfo(lotid, expect, listsize);
		$_sys.showerr('对不起，该期暂未开售或者已经过期!');
	} else {
		
		showinfo(lotid, listsize,expect);
	}
});
var showinfo=function(lotid, listsize,expect) {
	Y.ajax({
		url : "/cpdata/guoguan/"+lotid+"/index.json",
		type : "GET",
		dataType : "json",
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			    var r = obj.rows.row;
				var expectlist = [];
				r.each(function(rt,o) {
					var pid = rt.pid;
					var st = Y.getInt(rt.st);
					expectlist[expectlist.length] = [ pid];
				});
				var html1 = "";
				html1 += "";
				var html2 = "";
				for ( var i = 0; i < expectlist.length; i++) {
					if(i<listsize){
						
						html1 += "<option>"+ expectlist[i][0]+"</option>";
					}else{
						html2 += "<option>"+ expectlist[i][0]+"</option>";
					}
				}
				$("#elist1").html(html1);
				$("#elist2").html(html2);
				if (expect == "") {
					
					expect = expectlist[0]+"期";
					
				}
				$("#buy_qihao").html( parseInt(expectlist[0])+1);
			
			    $("#elist1").bind("change", function() {  
					var e = $(this).html();
					var checkText=$("#elist1").find("option:selected").text();
					if(checkText=="请选择期号"){return false;}
					checkText = checkText.replace(/[期|第]/g, "");
					elist(checkText);
					
					if ( lotid == '04' || lotid == '20' || lotid == '54' || lotid == '55' || lotid == '56') {
						loadkpmain(lotid, checkText);
					} else {
						$("#qihao").html(checkText);
						$('#kj_qihao').html("<b>"+checkText+"</b>");
						loadmain(lotid, checkText);
					} 
			    }); 
				
				loadmain(lotid, expect);
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
	
};


var elist = function(expect) {
	expect = expect+"期";
    $("#expect_list .el").each(function(){
    	var e = $(this).html();
    	if(e==expect){
    		$(this).removeClass("a1").addClass("a1");
    		$(this).parent().removeClass("cm_cur").addClass("cm_cur");
    	}else{
    		$(this).removeClass("a1");
    		$(this).parent().removeClass("cm_cur");
    	}
	});
};

var getelist = function() {
	var e= "";
    $("#expect_list .el").each(function(){
    	if($(this).parent().hasClass("cm_cur")){
    		e = $(this).html();
    	}
	});
    return e;
};

var loadmain = function(lotid, expect) {
	
	expect = expect.replace("期", "");
	elist(expect);

	$("#qihao").html(expect);
	$('#kj_qihao').html("<b>"+expect+"</b>");
	$('#kj_mess').html("");
	
	
	
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/"+ expect +"/"+ expect + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
			var rs = obj.rows;
			var gid = rs.gid;
			var pid = rs.pid;
			var code = rs.code;// 开奖号码
			var gpool = rs.gpool+"";// 奖池
			var atime = rs.atime;// //开奖时间			

			if ( gpool == "" ) {
				gpool = "0";
			}
			
			if (gid == lotid && pid == expect) {
				
					
				if(lotid == "01"||lotid == "07"||lotid == "50"||lotid == "51"||lotid == "53"||lotid == "52"||lotid == "03"){
					var acode = code.split("|");	
					var htmll ='';
					if (acode.length==2){
						var a_r=acode[0].split(",");
						var a_b=acode[1].split(",");
						
						for (var i=0;i<a_r.length;i++){
						
							htmll+='<b>'+a_r[i]+'</b>';
						}
						
						for (var i=0;i<a_b.length;i++){
							htmll+='<b class="cur">'+a_b[i]+'</b>';
						
						}						
					}else{
						acode= code.split(",");
						if (acode.length>1){
							for (var i=0;i<acode.length;i++){
								if (lotid=="01"||lotid == "07"||lotid == "50"||lotid == "51"||lotid == "53"||lotid == "52"||lotid == "03"){									
									htmll+='<b>'+acode[i]+'</b>';
								}else{
									if(i=acode.lenglength){
										
										htmll+='<b class="blue">'+acode[i]+'</b>';
									}else{
									
										htmll+='<b">'+acode[i]+'</b>';}
								}								
							}
						}						
					}	
					var ets = Y.getDate(atime);
					var d_e = new Date(ets);
					var d_s = d_e.dateadd("d", +60);
					
					var html ='奖池奖金：	<em><font>'+ parseFloat(gpool).rmb(false, 0) +'</font></em>元';
					var gname = $_sys.getgrade(lotid);
					
					
					$('#kj_info').html(htmll);
				    $('#kj_mess').html(html);
				}
				
				else {
					
				}	
			} else {
				alert(desc);
			}
		},
		error : function() {
			
			alert("12");
			var s='<span style="color:red">' + expect + '期尚未开奖,请选择其他期次 !!</span>';
			$('#kj_info').html(s);
			return false;
		}
	});

};

Class.C('time_style', true);
Class.C('time_style_ctpl', '<b >{1}</b>天<b >{2}</b>小时<b>{3}</b>分');
Class.C('time_style_ctp2', '<b>{2}</b>小时<b >{3}</b>分<b>{4}</b>秒');
Class(
		'Application',
		{
			ready : true,
			use : 'tabs,mask,dataInput',
			index : function() {
				this.red = [];
	            this.blue = [];
				
				this.showTime();				
			},
			showTime:function(){
				var lotid = $("#lotid").val();
				this.ajax({				
					url : "/cpdata/game/"+lotid+"/s.json?rnd=" + Math.random(),
					type : "get",
					cache:false,
					dataType : "json",
					end  : function (d){
						var obj = eval("(" + d.text + ")");
						var code = obj.period.code;
						var desc = obj.period.desc;
						if (code == "0") {
							var r = obj.period.row;
							var pid = r[0].pid;
							var et = r[0].et;
				            $("#responseJson #serverTime").val(Y.getDate(d.date).format('YY-MM-DD hh:mm:ss'));
							$("#responseJson #endTime").val(Y.getDate(et).format('YY-MM-DD hh:mm:ss'));
							
							// 倒计时
						    var info, data, clock, ctpl, ctpl2,  timebar, gp;
						    
						    info = this.get('#responseJson');
						    
						    if(Class.C('time_style')){
						        ctpl = Class.C('time_style_ctpl');
						        ctpl2 = Class.C('time_style_ctp2');
						    }else{
						        ctpl = '<em style="width:50px;"><b class="cm_red arial">{1}</b>天</em><em><b class="cm_red arial">{2}</b>小时</em><em><b class="cm_red arial">{3}</b>分</em>';
						        ctpl2 = '<em style="width:50px;"><b class="cm_red arial">{2}</b>小时</em><em><b class="cm_red arial">{3}</b>分</em><em><b class="cm_red arial">{4}</b>秒</em>';
						    }
						    timebar = this.get('#countDownSpan');// 显示板
						    if (info&&$("#responseJson #endTime").val()!='') {
						      this.config = data = {
						      		serverTime:$("#responseJson #serverTime").val(),
						      		endTime:$("#responseJson #endTime").val()
						      };
						       Class.config('page-config', data);
						      if (data) {
						          clock = new this.lib.CountDown();
						          gp = this.get('#countDownData').val().trim();// 格式为
																					// value="时间#id,时间#id"
						          if (gp!='') {// 高频倒计时
						              gp.split(',').each(function (d){
						                  var s = d.split('#'),
						                      o = this.get('#'+s[1]);
						                  if (o.size()) {
						                      clock.add({
						                          endTime: s[0],
						                          change:function (times, isEnd, msg, now){
						                              if (isEnd) {
						                                  o.html('<span class="red"></span>');
						                              }else{
						                                  o.html(times.slice(-4, -1).join(':').replace(/\b\d\b/g,'0$&'));
						                              }  
						                          }
						                      });
						                  }
						              }, this);
						          }
						          var __oncd = {
						              endTime: data.endTime,
						              change:function (times, isEnd, msg, now){
						                  var tpl = times[0] > 0 ? ctpl : ctpl2;
						                  if (isEnd) {
						                      timebar.html(''+(msg || '<span class="red"></span>'));
						                      Class.config('isEnd', true);
						                      Y.get("#cp_countDownSpan").html("");
						                      Y.get('#all_form').next('div').addClass('b-end');
						                  }else if(this.C('shownowtime')){
						                      timebar.html(this.getDate(now).format('MM月DD日 hh:mm:ss'));
						                  }else{
						                      timebar.html( ctpl.format.apply(tpl, times).replace(/\b\d\b/g,'0$&'));
						                  }                                
						              }                
						          };
						          if (this.C('shownowtime')) {
						              timebar.setStyle('background:#000;color:#00FF00;padding:1px');
						          }
						          if (timebar.size()) {// 常规倒计时
						              if (this.getDate(data.endTime)) {
						                  clock.add(__oncd);                            
						              }else{
						                  timebar.html('<span class="red">该彩种尚未开售</span>');
						              }                
						          }
						          this.onMsg('msg_endtime_change', function (endtime, now){
						              clock.end('loading...');// 不同玩法，时间的切换
						              __oncd.endTime = endtime;
						              this.get('#endTimeSpan').html(endtime);
						              clock.add(__oncd);
						              Class.config('isEnd', false);
						              Y.get('#all_form').next('div.con').removeClass('b-end');
						              clock.play(now);
						          });
						          clock.play(data.serverTime);
						      }
						  }

						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障!");
						return false;
					}
				});
			}
    });
