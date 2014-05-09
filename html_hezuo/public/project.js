Class.C('time_style', true);
Class.C('time_style_ctpl', '<b class="tim first">{1}</b><span>天</span><b class="tim">{2}</b><span>时</span><b class="tim">{3}</b><span>分</span>');
Class.C('time_style_ctp2', '<b class="tim first">{2}</b><span>时</span><b class="tim">{3}</b><span>分</span><b class="tim">{4}</b><span>秒</span>');
var faqiren="";///记录发起人
Y.use('mask',function(){
	Y.loading = Y.lib.MaskLay();
	Y.loading.noMask = true;
	var dlg_buy_end = Y.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
	dlg_buy_end.addClose('#dlg_buysuc_back','#dlg_buysuc_close','#dlg_buysuc_close2');
	Y.extend('popBuyOk', function(user,lotid,projid){
		$('#dlg_buysuc_view').die().live('click', function(){
			window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;
		});
		dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
	});
});


Y.use('mask', function(){
	var addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
	addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
	Y.get('#addMoneyLay div.tan_top').drag('#addMoneyLay');
	Y.extend('addMoney', function(){
		addMoneyDlg.pop('', function(e, btn){
			if(btn.id === 'addMoneyYes'){
				window.open($_user.daohang.addmoney);
			}			
		});
	});
}); 

Y.use('mask',function(){
	Y.loading = Y.lib.MaskLay();
	Y.loading.noMask = true;
	var billcodediv = Y.lib.MaskLay('#T_Detail');
	billcodediv.addClose('#close_T_Detail');
	Y.get('#T_Detail div.cpxq_tan_1').drag('#T_Detail');
	Y.extend('billCode', function(){
		billcodediv.pop('', function(e, btn){
					
		});
	});
});

baoditorg = function(){
	Y.postMsg('msg_login', function (){	
		var projid = Y.one('#projid').value;   
		var lotid = Y.one('#lotid').value;    
		var baodinum = Y.one('#pnum').value;    
	    function main_return(){
			Y.alert('您好， 正在提交您的请求，请稍等...');
			Y.ajax({
				url : $_trade.url.pb2g,
				type : "POST",
				dataType : "json",
				data:{
		        	gid:lotid,
		        	hid:projid,
		        	bnum:baodinum
		        },
				end : function(d) {
					var obj = eval("(" + d.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc; 		
	    			if (code == "0") {
	    				Y.alert("保底转认购成功");
    					setTimeout( function(){top.location.reload();},2000);
	    			}else{
	                	Y.alert(desc);
	                }
				}
			});
	           
		}
		Y.postMsg('msg_login', function (){	
	        Y.confirm("您好，您确定要保底转认购吗？",main_return,'');  
		});
	});	
};

user_return_confirm=function(id){
	Y.postMsg('msg_login', function (){	
		var projid = Y.one('#projid').value;   
		var lotid = Y.one('#lotid').value; 
	    function main_return(){
			Y.alert('您好， 正在提交您的请求，请稍等...');	
			Y.ajax({
				url : $_trade.url.jcancel,
				type : "POST",
				dataType : "json",
				data:{
		            	gid:lotid,
		            	hid:projid,
		            	bid:id
		            },
				end : function(d) {
					var obj = eval("(" + d.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc; 		
	    			if (code == "0") {
	    				 Y.alert(desc);
            	         setTimeout(function(){
            	               location.reload();
            	           }, 3000);
	    			}else{
	                	Y.alert(desc);
	                }
				}
			});
		}
		Y.postMsg('msg_login', function (){	
	        Y.confirm("您好，确定对您的认购方案撤单吗？",main_return,'');  
		});    
	});
};

copyurl = function(url){
    if(window.clipboardData){
        window.clipboardData.setData('Text',url);
        Y.getTip().show('#copystr','<h5>复制成功</h5>',1200).setIco(6);
    }else{
        window.getSelection();
        Y.getTip().show('#copystr','<h5>您好，请选中地址用ctrl+c复制!</h5> <div id="current_url">'+url+'</div>').setIco(7);
        var sel=document.createRange();
        sel.selectNode(Y.one('#current_url'));
        window.getSelection().addRange(sel);
    }
};

var setfollnum = function(owner,lotid) {// 页码 页面大小 总页数 总记录数
	var lid = lotid;
	var oer = owner;
	var data = {
		gid:lid,
		owner:oer
	};
	Y.ajax({
		url : $_user.url.qautobuy,
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			if (code == "0") {
				var allc = "";
				var c = obj.Resp.count;
					allm = c.allm;// 状态
					allc = c.allc;// 状态
				$("#ren_num").html(allc);
			}
		}
	});
};


$(function(){
	var lotid = location.search.getParam('lotid');
	var projid = location.search.getParam('projid');

	if (lotid == "" || projid == "") {
		if (history.length == 0) {
			window.opener = "";
			window.close();
		} else {
			history.go(-1);
		}
		return false;
	}
	
	Class.C('lotid', lotid);
	Class.C('projid', projid);	

	if (lotid=="04"||lotid=="20"||lotid=="54"||lotid=="55"){
		$("#hmlist").hide();
		$("#cm_u_set").hide();
	}
	
	showview(lotid,projid);
	
	//显示发起人认购
	$("#one1").die().live('click',function(){
		$("#one1").removeClass(); 
		$("#one2").removeClass();
		if(this.id == 'one1'){
			$("#one1").addClass('cur');	
			showjoin(lotid,projid,10,1);
		}else{
			$("#one2").addClass('cur');	
			showmyjoin(lotid,projid);
		}
	});
	
	$("#one2").die().live('click',function(){
		$("#one1").removeClass(); 
		$("#one2").removeClass();
		if(this.id == 'one1'){
			$("#one1").addClass('cur');	
			showjoin(lotid,projid,10,1);
		}else{
			$("#one2").addClass('cur');	
			showmyjoin(lotid,projid);
		}
	});
});

checkForm = function(){
	function comfirmxieyi(){
		Y.postMsg('msg_login', function (){
			var permoney = $('#permoney').val(); //方案金额
			var onemoney = $('#smoney').val();  //每份金额
			var buynum = parseInt(permoney/onemoney);   //购买份数
			var lotid = $('#lotid').val();    //认购总金额
			var projid = $('#projid').val();    //认购总金额
			
			if(permoney == ''){
				Y.alert('您好，认购金额不能为空！');
				return false;
			}
			if(permoney <= 0 || Y.getInt(permoney) != permoney){
				Y.alert('您好，认购金额必须为大于等于1的整数！');
				return false;
			}
			if(Y.getInt(permoney) > Y.one('#pmoney').value){
				Y.alert('您好，认购金额不能大于剩余金额！');
				return false;
			}
			
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				return false;
			}
			
			if(Y.getInt(buynum) > Y.one('#lnum').value){
				Y.alert('您好，认购份数不能大于剩余份数！');
				return false;
			}
			
		    function regou(){
		    	Y.alert('您好， 正在提交您的请求，请稍等...');
		    	Y.postMsg('msg_login', function (){	
			        Y.ajax(
			        {
						 url: $_trade.url.pjoin,
						 type:'POST',
						 data:{
							gid:lotid,
							hid:projid,
							bnum:buynum
						 },
			            end:function(d)
			            {
			            	var obj = eval("(" + d.text + ")");
		  					var code = obj.Resp.code;
		  					var desc = obj.Resp.desc; 
		        			Y.alert.close();
		        			if (code == "0") {
		        				$('#buynum').val(1);
		        				$('#permoney').val("1.00");		        				
		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
		        				showview(lotid,projid);
		        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
		        			} else {
		        				if (code=="6"){
		        					Y.addMoney();
		        				}else{
		        					Y.alert('对不起，认购失败,请重新认购！'+desc);
		        				}
		        				
		        			}
			            },
		        		error : function() {
		        			Y.alert("网络故障, 请检查您的帐户再重新投注!");
		        			return false;
		        		}
			        });   
		    	});
			}
		    Y.confirm("您好，本次认金额为"+permoney+"元，请确认！",regou,''); 
		});
	}
	comfirmxieyi();
};

main_return_confirm = function (){
	Y.postMsg('msg_login', function (){	
		var projid = Y.one('#projid').value;   
		var lotid = Y.one('#lotid').value;    
	    function main_return(){
			Y.alert('您好， 正在提交您的请求，请稍等...');
			Y.ajax({
				url : $_trade.url.pcancel,
				type : "POST",
				dataType : "json",
				 data:{
		            	gid:lotid,
		            	hid:projid
		            },
				end : function(d) {
					var obj = eval("(" + d.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc; 	
	    			if (code == "0") {
	    				 Y.alert(desc);
            	         setTimeout(function(){
            	               location.reload();
            	           }, 3000);
	    			}else{
	                	Y.alert(desc);
	                }
				}
			});
	           
		}
		Y.postMsg('msg_login', function (){	
	        Y.confirm("您好，您确定要撤单吗？",main_return,'');  
		});
	});   
};

var loadtime = function(et){
	var etime = et;
	Y.ajax({
		url : "/cpdata/time.json",
		end : function(data) {
			var dt1=Y.getDate(data.date).format('YY-MM-DD hh:mm:ss');
			var dt2=Y.getDate(etime).format('YY-MM-DD hh:mm:ss');
			$("#responseJson #serverTime").val(dt1);
			$("#responseJson #endTime").val(dt2);
			Class.C('nowtime', dt1);
			Class.C('endtime', dt2);
			this.postMsg('msg_show_endtime_CountDown');
		}
	});
};


var mark=function(isc, awa, isre, istat,adddate,castdate,awarddate,retdate){
	
	var icast = isc;// 出票标志（0 未出票 1 可以出票 2 已拆票 3 已出票）
	var award = awa;// 计奖标志（0 未计奖 1 正在计奖 2 已计奖)
	var ireturn = isre;// 是否派奖（0 未派奖 1 正在派 2 已派奖）
	var istate = istat;
	if(retdate != '' && retdate != undefined){
		$("#kj_time").html("&nbsp;("+Y.getDate(awarddate).format('MM-DD hh:mm')+")");
		$("#pj_time").html("&nbsp;("+Y.getDate(retdate).format('MM-DD hh:mm')+")");
	}else if(awarddate != '' && awarddate != undefined){
		$("#kj_time").html("&nbsp;("+Y.getDate(awarddate).format('MM-DD hh:mm')+")");
	}
	
	var kj = 0;
	kj = kjflg(award, adddate);
	var isflg = 0;
	isflg = (icast == 3) ? (istate > 2 ? 1 : 5) : (istate > 2 && istate<6) ? 1 : (icast == 2) ?  2 : 3; //出票状态5	
	isflg = (kj == 1) ? ((isflg == 5) ? 6 : isflg ) : isflg; //开奖状态6
	isflg = (award == 2) ? ((isflg == 6) ? 7 : isflg ) : isflg;//计奖状态7
	isflg = (ireturn == 2) ? ((isflg == 7) ? 12 : isflg) : (ireturn == 1) ? ((isflg == 7)? 8 : isflg) : isflg; // 派奖中、已派奖
  //-发起0--等待出票3---撤单1--出票中2-----出票成功5--------------已开奖6------已计奖7-----派奖中8------已派奖12---------------------
	switch (isflg) {
	case 1://撤单
		$("#f_faqi").css("width","30%");
		$("#f_paint").html("已撤单");
		break;
	case 2://出票中2
		$("#f_faqi").css("width","80%");
		$("#f_paint").html("出票中");
		break;
	case 3://等待出票3
		$("#f_faqi").css("width","70%");
		$("#f_paint").html("等待出票");
		break;
	case 5://出票成功5
		$("#f_faqi").css("width","100%");
		$("#f_paint").html("出票成功");
		break;
	case 6://已开奖6
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_paint").html("已开奖");
		break;
	case 7://已计奖7
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_pj").css("width","60%");
		$("#f_paint").html("已计奖");
		break;
	case 8://派奖中8
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_pj").css("width","80%");
		$("#f_paint").html("派奖中");
		break;
	case 12://已派奖12
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_pj").css("width","100%");
		$("#f_paint").html("已派奖");
		break;
	default://发起0
		$("#f_faqi").css("width","20%");
		break;
	}
};

function kjflg(aw, ft){ //彩种、截止时间
	var kj = 0;
	var ad = aw;
	kj = parseInt(ad) >= 2 ? 1:0;
	return kj;
};


var showcode = function(game,code){
	$("#see_duizhen").html("关闭<em class=\"cm_cz_nrckxl cm_cz_nrckxl_cur\"></em>");
	$("#see_duizhen").unbind("click");
	$("#see_duizhen").click(function(){
		$("#see_duizhen").html("查看<em class=\"cm_cz_nrckxl\"></em>");
		$("#see_duizhen").click(function(){
			showcode(game,code);
		});
	});
	
	$("#ccodes").html($_sys.showcode(gameid,ccodes));
};

var showmyjoin = function(lotid,projid){
	var data = '';
	data = $_trade.key.gid + "=" + encodeURIComponent(lotid) + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
	Y.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : data,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;
			if (code == "0") {
				var r = obj.Resp.row;
				var myjoin = obj.Resp.myjoins;
				var cnickid = r.cnickid;// 发起人
				
				var nums = Y.getInt(r.nums);// 总份数
				var onum = Y.getInt(r.onu);// 发起人认购份数
				var pnum = Y.getInt(r.pnum);// 发起人保底份数
				var lnum = Y.getInt(r.lnum);// 剩余份数
				
				var myjoinhtml='<colgroup><col width="60"><col width="170"><col width="250"><col width="300"><col></colgroup><tr><td>序号</td><td>用户名</td><td>购买金额（元）</td><td>参与时间</td><td>操作</td></tr>';
				var mynickid="";
				
				var iscancel=false;
				if ((nums-lnum+pnum)/nums<0.8){					
					iscancel=true;
				}
				if(isNaN(myjoin)){
					myjoin=myjoin.myjoin;
					if(!this.isArray(myjoin)){myjoin=new Array(myjoin);}
					myjoin.each(function(rt,o) {
						var buyid = rt.buyid;// 购买编号
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						
						myjoinhtml += '<tr>';
						myjoinhtml += ' <td>' + (o+1) + '</td>';
						myjoinhtml += ' <td>' + nickid + '</td>';
						myjoinhtml += ' <td><em>' + parseFloat(bmoney).rmb(true) + '<em></td>';
						myjoinhtml += '<td>' + buydate + '</td>';
						myjoinhtml += '<td>';
						myjoinhtml += cancel==0?(iscancel?(cnickid==nickid?'--':'<a href="javascript:void(0);" onclick="user_return_confirm(\''+buyid+'\')" class="a1">撤单</a>'):'--'):(cancel==1?'本人撤销 ':'系统撤销');
						myjoinhtml += ' </td>';
						myjoinhtml += ' </tr>';
						mynickid=nickid;
					});
				}
				
				if (mynickid==""){
					myjoinhtml='<tr><td colspan="5">暂时没有您的认购信息</td></tr>';
				}
				$('#one_con1').html(myjoinhtml);
			}
			
		}
	});
	
};

var showview = function(lotid,projid){
	var data = $_trade.key.gid + "=" + encodeURIComponent(lotid) + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
	Y.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : data,
		end: function(d) {
			var obj = eval("(" + d.text + ")");
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;
			
			if (code == "0") {
				var r = obj.Resp.row;
				var myjoin = obj.Resp.myjoins;
				
				var myjoinhtml='<colgroup><col width="60"><col width="170"><col width="250"><col width="300"><col></colgroup><tr><td>序号</td><td>用户名</td><td>购买金额（元）</td><td>参与时间</td><td>操作</td></tr>';
				var mynickid="";	

				var projid = r.projid;// 方案编号
				var cnickid = r.cnickid;// 发起人
				faqiren=cnickid;
				var gameid = r.gameid;// 游戏编号
				var periodid = r.periodid;// 期次
				var cdesc = r.cdesc;// 合买描叙
				var ccodes = r.ccodes;// 投注号码
				var mulity = r.mulity;// 倍数
				var play = r.play;// 玩法（单式 复式）
				var itype = r.itype;// 方案类型（0 自购 1 合买）
				var ifile = r.ifile;// 是否文件投注（0不是 1 是）
				var tmoney = r.tmoney;// 总金额
				var smoney = r.smoney;// 每份金额
				var nums = Y.getInt(r.nums);// 总份数
				var onum = Y.getInt(r.onum);// 发起人认购份数
				var pnum = Y.getInt(r.pnum);// 发起人保底份数
				var lnum = Y.getInt(r.lnum);// 剩余份数
				var iopen = r.iopen;// 是否保密 （0 对所有人公开 1 截止后公开 2 对参与人员公开
											// 3 截止后对参与人公开）
				var wrate = r.wrate;// 发起人中奖提成比率 （盈利情况）
				var jindu = r.jindu;// 进度
				var endtime = r.endtime;// 截止时间 
				var adddate = r.adddate;// 发起时间
				var mydate = r.mydate;// 满员时间
				var istate = r.istate;// 状态(0 禁止认购 1 认购中,2 已满员 3过期未满撤销 4主动撤销 5已出票 6 已派奖)
				var upload = r.upload;// 是否上传 （0 未传 1 已传）
				var iclear = r.iclear;// 是否清保 （0 未清 1 正在清 2 已清）
				var icast = r.icast;// 出票标志（0 未出票 1 可以出票 2 已拆票 3 已出票）
				var castdate = r.castdate;// 出票时间
				var wininfo = r.wininfo;// 中奖信息（中奖注数用逗号隔开）
				var award = r.award;// 计奖标志（0 未计奖 1 正在计奖 2 已计奖)
				var awarddate = r.awarddate;// 计奖时间
				var bonus = r.bonus;// 总奖金
				var tax = r.tax;// 税后奖金
				var owins = r.owins;// 发起人提成奖金
				var ireturn = r.ireturn;// 是否派奖（0 未派奖 1 正在派 2 已派奖）
				var retdate = r.retdate;// 派奖时间
				var aunum = r.aunum;// 金星个数(发起方案时的银星数)
				var agnum = r.agnum;// 银星个数(发起方案时的银星数)
				Class.C("caststate", icast);
				if(itype == '0'){
					$('#num_width_change').css({width: "683px"});
					$('#p_share h3').hide();
					$('#buy_yonghu h5').html("认购用户");
					$('#buy_yonghu p').hide();
					
					$('#fqrcd').hide();
					$('#faxc_tr').hide();
					$('#one1').hide();
				}
				
				var iscancel=false;
				if ((nums-lnum+pnum)/nums<0.8){					
					iscancel=true;
				}
				
				if(isNaN(myjoin)){
					myjoin=myjoin.myjoin;
					if(!this.isArray(myjoin)){myjoin=new Array(myjoin);}
					myjoin.each(function(rt,o) {
						var buyid = rt.buyid;// 购买编号
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
//						
						myjoinhtml += '<tr>';
						myjoinhtml += ' <td>' + (o+1) + '</td>';
						myjoinhtml += ' <td>' + nickid + '</td>';
						myjoinhtml += ' <td><em>' + parseFloat(bmoney).rmb(true) + '<em></td>';
						myjoinhtml += '<td>' + buydate + '</td>';
						myjoinhtml += '<td>';
						myjoinhtml += cancel==0?(iscancel?(cnickid==nickid?'--':'<a href="javascript:void(0);" onclick="user_return_confirm(\''+buyid+'\')" class="a1">撤单</a>'):'--'):(cancel==1?'本人撤销 ':'系统撤销');
						myjoinhtml += ' </td>';
						myjoinhtml += ' </tr>';
						mynickid=nickid;
					});
					
				}
				
				
				var html="";
				var isself=false;
				if (mynickid==cnickid){
					isself=true;
				}
				
				if (mynickid==""){
					myjoinhtml+='<tr><td colspan="5">暂时没有您的认购信息</td></tr>';
				}
				//设置跟单人数
				setfollnum(cnickid,lotid);
				
				$("#tmoney").html(parseFloat(tmoney).rmb(true));
				$("#mulity").html(mulity+'倍');
				$("#smoney").val(smoney);
				$("#lnum").val(lnum);
				$("#lotid").val(lotid);
				$("#projid").val(projid);
				$("#pnum").val(pnum);
				$("#pmoney").val(parseFloat(smoney*lnum));
				
				var qihao = '';
				if(lotid>=90 || lotid ==70 || lotid ==71){
				    qihao = $_sys.getlotname(gameid) +"  ";
				}else{
				    qihao = $_sys.getlotname(gameid) + "&nbsp;第<b>" + periodid + "</b>期&nbsp;";	
				}
				if((gameid=="03" || gameid=="53")&&ifile == 1){
					qihao += play == 1 ? "直选" : play == 2 ? "组三" : play == 3 ? "组六" : "";
				}else if(gameid=="50"){
					qihao += play == 2 ? "追加" : "";
				}
				qihao += ifile == 0 ? "复式" : "单式";
				qihao += itype == 0 ? "代购" : "合买";
				$("#cm_sfc_title").html(qihao);
				$("#cm_sfc_context").html('方案编号：' + projid+'<br />发起时间：' + adddate + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认购截止时间：' + endtime);
				$("#cm_u_name").html($_sys.showzhanjiname(gameid,cnickid,'award'));
				$("#cm_u_star").html(($_sys.showzhanji(aunum,agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,cnickid,aunum,agnum)+'&nbsp;&nbsp;'));
				
				$("#cm_u_set").click(function(){
					$_sys.autobuy(gameid,cnickid);
				});
				
				$("#fq_time").html("&nbsp;("+Y.getDate(adddate).format('MM-DD hh:mm')+")");
				
				var cp=0;
				if(icast==3 && istate<3){
					cp=1;
					$("#cp_time").html("&nbsp;("+Y.getDate(castdate).format('MM-DD hh:mm')+")");
				}
				$("#pnum").html((pnum==0?'未保底':((parseFloat(pnum*smoney).rmb(true))+''+((isself&&istate=="1")?'':'')+(iclear=='2'?' ':''))));
				$("#fqrg").html("￥"+onum);
				if(pnum == 0){
					$("#baodi_rengou").hide();
				}else if(isself&&istate=="1"){
					$("#f_oper_div").show();
					$("#baodi_rengou").show();
				}
				
				$("#wrate").html(wrate==0?'未提成':wrate+'%');
				$("#jindu").html(jindu+'%');
				$("#jdpaint").css("width", jindu+"%");
				$("#baoodi").html((pnum!=0 ? ('(保'+parseFloat((pnum*100/nums).toFixed(0))+'%)'+(iclear=='2' ? '已清' : '')) : '无保底'));
				$("#yumoney").html(parseFloat(lnum*smoney).rmb(true));
				
				loadtime(endtime);
				mark(icast,award,ireturn,istate,adddate,castdate,awarddate,retdate);
				
				var k_o_c = $_cache.qcode(gameid, periodid);
				if(k_o_c == '' || k_o_c == undefined){
					$("#award_tr").hide();
				}else{
					$("#award_tr").show();
					var code2=k_o_c;
					var html='';
					if(gameid=="01"||gameid=="07"||gameid=="50"){
						var code3=code2.split("|");
						var red= code3[0].split(",");
						var blue =code3[1].split(",");
						for(var i=0;i<red.length;i++){
							html+='<b>'+red[i]+'</b>';
						}
						for(var i=0;i<blue.length;i++){
							html+='<b class="blue">'+blue[i]+'</b>';
						}
					}else if(gameid=="03"||gameid=="51"||gameid=="52"||gameid=="53" || gameid=="04" || gameid=="20" || gameid=="54" || gameid=="55" ||gameid=="56"){
						var red= code2.split(",");
						for(var i=0;i<red.length;i++){
							html+='<b>'+red[i]+'</b>';
						};
					}else{
						html+=code2;
					}
					$("#awards").html(html);
				}
				
				if (upload=="0"){
					if (isself){
						if(lotid==90 ||lotid==91 ||lotid==92 ||lotid==93){
							$("#ccodes").html('<tr><td><p class="fn_hx"><a class="cm_qk_btn222" href="'+$_sys.getlotdir(lotid)+'project_upload.html?lotid='+lotid+'&projid='+projid+'" >上传方案</a></p></td></tr>');
						}else if(lotid==94 ||lotid==95 ||lotid==96 ||lotid==97){
							$("#ccodes").html('<tr><td><p class="fn_hx"><a class="cm_qk_btn222" href="'+$_sys.getlotdir(lotid)+'project_upload.html?lotid='+lotid+'&projid='+projid+'" >上传方案</a></p></td></tr>');
						}else if(lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89){
							$("#ccodes").html('<tr><td><p class="fn_hx"><a class="cm_qk_btn222" href="'+$_sys.getlotdir(lotid)+'project_upload.html?lotid='+lotid+'&projid='+projid+'" >上传方案</a></p></td></tr>');
						}else{
							$("#ccodes").html('<tr><td><p class="fn_hx"><a href="javascript:void (0);"  class="cm_qk_btn222" onclick="Y.openUrl(\'/game/hsc.html?lotid='+gameid+'&projid='+projid+'\',582, 274);" >上传方案</a></p></td></tr>');//onclick="Y.openUrl('/main/project_upload_ds.html?lotid=1&playid=3&pid=13006339',630);"
						}
					}else{
						$("#ccodes").html('<tr><td><p class="fn_hx">未上传</p></td></tr>');
					}
					
				}else{
					if (ccodes==''){
						$('#see_duizhen').hide();
						$("#ccodes").html('<tr><td><p class="fn_hx">'+$_sys.iopen[Y.getInt(iopen)]+'</p></td></tr>');
					}else{
						if (ifile=="0"){
							//北单竞彩显示对阵
							if(lotid==70 ||lotid==72 ||lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89 || lotid==90 ||lotid==91 ||lotid==92 ||lotid==93){
//								$("#see_duizhen").show();
//								$("#see_duizhen").unbind("click");
//								$("#see_duizhen").click(function(){
//									showduizhen(lotid,periodid,projid,"1",ccodes,cp);
//								});
								showduizhen(lotid,periodid,projid,"1",ccodes,cp);
							}else if(lotid==71 ||lotid==94 ||lotid==95 ||lotid==96 ||lotid==97){
								$("#see_duizhen").show();
								$("#see_duizhen").unbind("click");
								$("#see_duizhen").click(function(){
									 showlancai(lotid,periodid,projid,"1",ccodes,cp);
								});
								showlancai(lotid,periodid,projid,"1",ccodes,cp);
							}else if(lotid==80 ||lotid==81 ||lotid==82 ||lotid==83){
								$("#codestr").val(ccodes);
								$("#see_duizhen").show();
								$("#see_duizhen").unbind("click");
								$("#see_duizhen").click(function(){
									zcduizhen(lotid,periodid,projid,1);
								});
								zcduizhen(lotid,periodid,projid,1);
							}else{
								$("#ccodes").html($_sys.showcode(gameid,ccodes,k_o_c));
							}
						}else if(ifile=="1"){
							if(lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89 || lotid==72 || lotid==90 ||lotid==91 ||lotid==92 ||lotid==93){
								$("#see_duizhen").show();
								$("#see_duizhen").unbind("click");
								$("#see_duizhen").click(function(){
									showduizhen(lotid,periodid,projid,"0",ccodes,cp);
								});
								showduizhen(lotid,periodid,projid,"0",ccodes,cp);
							}else if(lotid==94 ||lotid==95 ||lotid==96 ||lotid==97){
								$("#see_duizhen").show();
								$("#see_duizhen").unbind("click");
								$("#see_duizhen").click(function(){
									showlancai(lotid,periodid,projid,"0",ccodes,cp);
								});
								showlancai(lotid,periodid,projid,"0",ccodes,cp);
							}else if(lotid==80 ||lotid==81 ||lotid==82 ||lotid==83){
								$("#codestr").val(ccodes);
								$("#see_duizhen").show();
								$("#see_duizhen").unbind("click");
								$("#see_duizhen").click(function(){
									zcduizhen(lotid,periodid,projid,0);
								});
								zcduizhen(lotid,periodid,projid,0);
							}else{
							    $("#ccodes").html('方案已传，请点击<a href="/cpdata/pupload/'+(gameid<10? '0' + gameid : gameid)+'/'+periodid+'/'+ccodes+'" target="_blank" class="a1">下载</a>');
							}
						}					
					}
				}				
				
				if (award=="2"){
					var wininfostr="";
					if (bonus > 0) {
						if(istate==3 || istate==4){
						    wininfostr = "该撤单方案<font color=#990000>中奖</font>";
						}else{
							wininfostr = "<font color=#990000>已中奖</font>";	
						}
						var zj = $_sys_getwininfo(gameid, wininfo);
						for ( var i = 0; i < zj.length; i++) {
							wininfostr += "<br/>" + zj[i][0] +" "+ zj[i][1] + "注";
						}
						wininfostr += "<br/>方案中奖金额：<font color=#990000>" + parseFloat(bonus).rmb(true) +"</font>(税前),<font color=#990000>"+ parseFloat(tax).rmb(true) + "</font>(税后).";
						if(lotid>=85 && lotid<90 && r.addmoney>0){wininfostr += "已含加奖金额：<font color=#990000>" + parseFloat(r.addmoney).rmb(true) +"</font>.";}
						if(itype==1&&istate!=3&&istate!=4){wininfostr +="发起人提成：<font color=#990000>" + parseFloat(owins).rmb(true) +"</font>,每份派送<font color=#990000>"+ parseFloat((tax-owins)/nums).rmb(true) + "</font>.";}
					} else {
						wininfostr += "未中奖";
					}
					$("#wininfo").html(wininfostr);
					$("#wininfo_tr").show();					
				}else{
					$("#wininfo_tr").hide();
				}
				
				//0 禁止认购 1 认购中,2 已满员 3
				// 过期未满撤销 4主动撤销
				if(itype==0){
					//$("#wyrg_tr").hide();
				}else{
					$("#istate").hide();
					$("#shbd").hide();
					$("#wyrg").hide();
					if (istate=="1"||istate=="0"){
						html='';
						if (pnum==0 && isself){
							$("#shbd").show();
							$("#shbd").die().live('click', function(){
								Y.postMsg('msg_login', function (){
									Y.openUrl('/game/baodi.html?lotid='+gameid+'&projid='+projid,500,200);
								});
							});
						}
						$("#permoney").val(smoney);				
						$("#wyrg").show();
						$("#cm_sumb").show();
						
						$("#submitCaseBtn3").click(checkForm);
						
						Y.one('#money_rate').innerHTML = (Y.one('#permoney').value/tmoney*100).toFixed(2)+"%";
						Y.get('#permoney').keyup(function(){
							if(Y.getInt(Y.one('#permoney').value) > (lnum*smoney)) Y.need('#permoney').val(lnum);
						    var buymoney = Y.one('#permoney').value;      //方案金额
							var onemoney = Y.one('#smoney').value;  //每份金额
							var buynum = buymoney/onemoney;
							$('#buynum').val(buynum);
							var moneyrate = buymoney/tmoney*100;
							Y.one('#money_rate').innerHTML = moneyrate.toFixed(2)+"%";
						});
						
						
					}else if (istate=="2"){					
						$("#istate").html('该方案已满员（时间：'+mydate+'）');
						$("#istate").show();
					}else if (istate=="3"){
						$("#istate").html('该方案系统已撤单');
						$("#istate").show();
					}else if (istate=="4"){
						$("#istate").html('发起人已撤销该方案 ');
						$("#istate").show();
					}else if (istate=="5"){
						$("#istate").html('系统已撤销该方案');
						$("#istate").show();
					}
				}
				
				//发起人撤单
				$("#fqrcd").hide();
				$("#f_oper_div").hide();
				if (isself&&iscancel&(istate=="1"||istate=="0")){
					$("#fqrcd").show();	
					$("#f_oper_div").show();
				};
				if (((pnum==0&& (istate=="0" || istate=="1"))||(pnum!=0 && istate=="1" )) && isself){
					 $("#f_oper_div").show();
				}
				
				$("#faxc_tr #copystr").click(function(){
					copyurl('http://'+location.host+$_sys.getlotdir(gameid)+'viewpath.html?lotid='+gameid+'&projid='+projid+'');
				});
				var t = 'null' == cdesc ? '随缘,买彩票讲的是运气、缘分和坚持。' : cdesc;
				$("#faxc_tr #cdesc").text(t);
				$('#one_con1').html(myjoinhtml);
			} else {
				alert(desc);
			}
		},
		error : function() {
			alert("您所请求的页面有异常！");
			return false;
		}
	});
};

var showjoin =function (lotid,projid,ps,pn){
	data = $_trade.key.gid + "=" + encodeURIComponent(lotid) 
	+ "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) 
	+ "&rnd=" + Math.random();
	
	Y.ajax({
		url : $_trade.url.jlist,
		type : "POST",
		dataType : "json",
		data : {
			gid:lotid,
			hid:projid,
			ps:10,
			tp:0,
			pn:pn
		},
		end : function(d) {
			var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var desc = obj.Resp.desc; 
					
			if (code == "0") {
				var myjoinhtml="";
				var myjoinhtml1='<colgroup><col width="60"><col width="170"><col width="250"><col width="300"><col></colgroup><tr><td>序号</td><td>用户名</td><td>购买金额（元）</td><td>参与时间</td><td>操作</td></tr>';
				var myjoinhtml2='<colgroup><col width="60"><col width="170"><col width="160"><col width="160"><col width="200"><col></colgroup><tr><td>序号</td><td>用户名</td><td>购买金额（元）</td><td>中奖金额（元）</td><td>参与时间</td><td>操作</td></tr>';
				var ct =obj.Resp.count;
				var tp=Y.getInt(ct.tp);
				var rc=Y.getInt(ct.rc);
				var pn=Y.getInt(ct.pn);
				var ps=Y.getInt(ct.ps);	
				var pmon=0;//标识方案是否有中奖信息
				var r = obj.Resp.row;		
				var i=0;
				if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						var amoney = rt.amoney;// 派奖金额
						var rmoney = rt.rmoney;// 认购派奖金额
						
						pmon = rmoney>0? 1 : 0;
							
						if(pmon == 1){//未中奖
							if(cancel != 1){
								if(nickid==faqiren){nickid="<em>"+nickid+"</em>";}
								myjoinhtml += '<tr>';
								myjoinhtml += '<td>' + ((pn-1)*ps+(o+1))+ '</td>';
								myjoinhtml += '<td>' + nickid + '</td>';
								myjoinhtml += '<td>' + parseFloat(bmoney).rmb(true) + '</td>';
								if(rmoney>0){
									myjoinhtml += '<td>' + parseFloat(amoney).rmb(true) + '</td>';
								}
								myjoinhtml += '<td>' + buydate + '</td>';
								myjoinhtml += '<td>';
								myjoinhtml += cancel==0?('-- --&nbsp;'):(cancel==1?'本人撤销 ':'系统撤销');
								myjoinhtml += '</td>';
								myjoinhtml += '</tr>';
								i++;
							}
						}else{
							if(cancel != 1){
								if(nickid==faqiren){nickid="<em>"+nickid+"</em>";}
								myjoinhtml += '<tr>';
								myjoinhtml += '<td>' + ((pn-1)*ps+(o+1))+ '</td>';
								myjoinhtml += '<td>' + nickid + '</td>';
								myjoinhtml += '<td>' + parseFloat(bmoney).rmb(true) + '</td>';
								myjoinhtml += '<td>' + buydate + '</td>';
								myjoinhtml += '<td>';
								myjoinhtml += cancel==0?('--'):(cancel==1?'本人撤销 ':'系统撤销');
								myjoinhtml += '</td>';
								myjoinhtml += '</tr>';
								i++;
							}
						}
					});
				if(pmon==0){
					myjoinhtml=myjoinhtml1+myjoinhtml;
				}else{
					myjoinhtml=myjoinhtml2+myjoinhtml;
				}
				if (i==0){
					myjoinhtml='<tr><td colspan="5">暂时没有认购信息</td></tr>';
				}else{
					var pagehtml='<a href="javascript:void(0);" class="a1" style="margin-right:5px" onclick="showjoin(\''+lotid+'\','+projid+','+ps+',1)">首页</a>'+
						' <a href="javascript:void(0);" class="a2" style="margin-right:5px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn-1>0?(pn-1):1)+')">上一页</a>'+
						' <a href="javascript:void(0);" class="a2" style="margin-left:10px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn+1>tp?tp:(pn+1))+')">下一页</a>'+
						' <a href="javascript:void(0);" class="a1" style="margin-left:5px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+tp+')">尾页</a>'+
						' <span><input type="text"  name="n_page" id="n_page"/><a href="javascript:void(0);" class="a1" style="margin-left:5px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+',Y.getInt($("#n_page").val()))">跳转</a>共'+tp+'页，'+rc+'条记录</span>';
					$('#pagediv').html(pagehtml);
					$('#pagediv').show();
				}
				$('#one_con1').html(myjoinhtml);				
			}
		}
	});	
};
//北单竞彩显示对阵
showduizhen =function (lotid,expect,projid,type,codes,cp){
//	$("#see_duizhen").html("关闭");
//	$("#see_duizhen").unbind("click");
//	$("#see_duizhen").click(function(){
//		$("#ccodes").html('');
//		$("#see_duizhen").html("查看");
//		$("#see_duizhen").click(function(){
//			showduizhen(lotid,expect,projid,type,codes,cp);
//		});
//	});
	var mdata = []
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/proj/" + projid.toLowerCase() + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var ggstr="";
			
			if(lotid == 70){//混投
				var spfstr=["3","1","0"];
				var jqsstr=["0","1","2","3","4","5","6","7"];
				var bqcstr=["3-3","3-1","3-0","1-3","1-1","1-0","0-3","0-1","0-0"];
				var cbfstr=["1:0","2:0","2:1","3:0","3:1","3:2","4:0","4:1","4:2","5:0","5:1","5:2","9:0","0:0","1:1","2:2","3:3","9:9","0:1","0:2","1:2","0:3","1:3","2:3","0:4","1:4","2:4","0:5","1:5","2:5","0:9"];
				var dzhtml = '<thead><tr>';
				    dzhtml += '<td>场次</td>';
				    dzhtml += '<td>比赛时间</td>';
				    dzhtml += '<td>主队 VS 客队</td>';
				    dzhtml += '<td>玩法</td>';
				    dzhtml += '<td>投注选项</td>';
				    dzhtml += '<td>彩果</td>';
				    dzhtml += '<td class="sp">计奖SP</td>';
				    dzhtml += '</tr></thead>';
					dzhtml += '<colgroup><col width="60"><col width="120"><col width="220"><col width="70"><col><col width="80">';
					dzhtml += '<col width="80"></colgroup><tbody>';
					var odd="";
					var r = obj.items.item;		
					var wk=["日","一","二","三","四","五","六"];
					r.each(function(rt,o) {
						odd="";
						var id = rt.id;// 场次编号
						var hn = rt.hn;// 主队
						var bt = rt.bt;// 比赛时间
						if(bt != '' && bt != undefined)
							bt = Y.getDate(bt).format("MM-DD hh:mm");
						else
							bt='--';
						var gn = rt.vn;// 客队
						var lose = rt.lose;// 让球
						var hs = Y.getInt(rt.hs);// 全场主队进球
						var vs = Y.getInt(rt.vs);// 全场客队进球
						var hhs =Y.getInt(rt.hhs);// 半场主队进球
						var hvs =Y.getInt(rt.hvs);// 半场客队进球
						var spvalue = rt.spvalue;// 出票参考SP
						var result = rt.result;// 开奖结果
						var c = Y.getInt(rt.cancel);// 场次是否取消
						if(c==""){c=0;}
						var sp="";
						var bf="";
						if(c!=0){
							bf="--";
							result="<font color='red'>延</font>";
							sp="1.00";
						}
						var hsstr =  rt.hs+"";
//						HH|130316020>SPF=3/1+BQC=3-3/3-1/1-1/1-0,130316019>JQS=0/1/7+CBF=1:0/9:9/0:9,130316018>SPF=3/1|2*1,3*1|1
						var ncode = codes.split("|")[1];
						var codestr=ncode.split(",");
						var itemcodes ="";
						F:for(var n=0;n<codestr.length;n++){
							itemcodes=codestr[n];
							if(itemcodes.indexOf(id+"")>=0){
								var itemcode = itemcodes.substring(itemcodes.indexOf(">")+1,itemcodes.length).split("+");
								var ji = itemcode.length;
								var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
								if(o%2==1){odd="odd";}
								dzhtml += '<tr class="'+odd+'">';
								dzhtml += '<td rowspan='+ji+'>周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
								dzhtml += '<td rowspan='+ji+'>'+bt+'</td>';
								dzhtml += '<td rowspan='+ji+'>'+hn+'('+lose+') VS '+gn;
								if(c==0 && hsstr.length>0){
									dzhtml += '<br/><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)';
								}
								dzhtml += '</td>';
								var spvalues = spvalue.split("|");
								var codarr = [];
								var i=0;
								itemcode.each(function(onecode){
									var playty = onecode.split("=")[0];
									var cod = onecode.split("=")[1].split("/");
									if(playty == "SPF"){
										var spvalue = spvalues[0].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs-vs)*1;
												if(rt*1>0){result="3";}else if(rt*1==0){result="1";}else{result="0";}
												sp = spvalue[$_sys.getSub(spfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\">"+result+"</font>").replace("3","胜").replace("1","平").replace("0","负")+"("+spvalue[$_sys.getSub(spfstr,cds)]+")");
										});
										if(i>0){dzhtml += '<tr class="'+odd+'">';}
										dzhtml += '<td>胜平负</td>';
										dzhtml += '<td>'+codarr.join(" ")+'</td>';
										dzhtml += '<td>'+result.replace("3","胜").replace("1","平").replace("0","负")+'</td>';
										dzhtml += '<td>'+sp+'</td>';
										dzhtml += '</tr>';
									}
									if(playty == "RSPF"){
										var spvalue = spvalues[4].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs-vs)*1+(lose)*1;
												if(rt*1>0){result="3";}else if(rt*1==0){result="1";}else{result="0";}
												sp = spvalue[$_sys.getSub(spfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\">"+result+"</font>").replace("3","胜").replace("1","平").replace("0","负")+"("+spvalue[$_sys.getSub(spfstr,cds)]+")");
										});
										if(i>0){dzhtml += '<tr class="'+odd+'">';}
										dzhtml += '<td>让球胜平负</td>';
										dzhtml += '<td>'+codarr.join(" ")+'</td>';
										dzhtml += '<td>'+result.replace("3","胜").replace("1","平").replace("0","负")+'</td>';
										dzhtml += '<td>'+sp+'</td>';
										dzhtml += '</tr>';
									}
									if(playty == "CBF"){
										var spvalue = spvalues[1].split(",");
										if(c==0){
											if(hsstr.length>0){
												result=hs+":"+vs;
												var ii=100;
												for(var r=0;r<31;r++){
													if(cbfstr[r]==result){ii=r;}
												}
												if(ii==100){
													if(hs>vs){result="9:0";}else if(hs==vs){result="9:9";}else{result="0:9";}
												}
												sp = spvalue[$_sys.getSub(cbfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\">"+result+"</font>").replace("9:0","胜其它").replace("9:9","平其它").replace("0:9","负其它")+"("+spvalue[$_sys.getSub(cbfstr,cds)]+")");
										});
										if(i>0){dzhtml += '<tr class="'+odd+'">';}
										dzhtml += '<td>猜比分</td>';
										dzhtml += '<td>'+codarr.join(" ")+'</td>';
										dzhtml += '<td>'+result.replace("9:0","胜其它").replace("9:9","平其它").replace("0:9","负其它")+'</td>';
										dzhtml += '<td>'+sp+'</td>';
										dzhtml += '</tr>';
									}
									if(playty == "JQS"){
										var spvalue = spvalues[3].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs+vs)*1;
												if(rt>=7){result=7;}else{result=rt;}
												sp = spvalue[$_sys.getSub(jqsstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\">"+result+"</font>")+"("+spvalue[$_sys.getSub(jqsstr,cds)]+")");
										});
										if(i>0){dzhtml += '<tr class="'+odd+'">';}
										dzhtml += '<td>总进球</td>';
										dzhtml += '<td>'+codarr.join(" ")+'</td>';
										dzhtml += '<td>'+result+'</td>';
										dzhtml += '<td>'+sp+'</td>';
										dzhtml += '</tr>';
									}
									if(playty == "BQC"){
										var spvalue = spvalues[2].split(",");
										if(c==0){
											if(hsstr.length>0){
												var hrt=(hhs-hvs)*1;
												var rt=(hs-vs)*1;
												if(hrt*1>0){result="3";}else if(hrt*1==0){result="1";}else{result="0";}
												if(rt*1>0){result=result+"-3";}else if(rt*1==0){result=result+"-1";}else{result=result+"-0";}
												sp = spvalue[$_sys.getSub(bqcstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\">"+result+"</font>").replaceAll("3","胜").replaceAll("1","平").replaceAll("0","负")+"("+spvalue[$_sys.getSub(bqcstr,cds)]+")");
										});
										if(i>0){dzhtml += '<tr class="'+odd+'">';}
										dzhtml += '<td>半全场</td>';
										dzhtml += '<td>'+codarr.join(" ")+'</td>';
										dzhtml += '<td>'+result.replaceAll("3","胜").replaceAll("1","平").replaceAll("0","负")+'</td>';
										dzhtml += '<td>'+sp+'</td>';
										dzhtml += '</tr>';
									}
									i++;
								});
								break F;
							}
						}
						//var itemcodes = ncode.split(",")[o];
					});
					var isdystr = "";
					if(codes.split("|").length == 4){
						isdystr = "去除单一玩法串投注";
					}else{
						isdystr = "允许单一玩法串投注";
					}
					var gg = codes.split("|")[2].replaceAll("\\*","串");
					dzhtml += '</tbody>';
					ggstr= gg+'&nbsp;<font color="red">'+isdystr+'</font>';
					$("#ccodes").html(dzhtml);
			}else{
				var dzhtml = '<thead><tr><td rowspan="2">序号</td>';
				dzhtml += '<td rowspan="2">比赛时间</td>';
				dzhtml += '<td rowspan="2">主队 VS 客队</td>';
				dzhtml += '<td rowspan="2">投注选项</td>';
				if((lotid==90||lotid==72)&&cp==0){
					dzhtml += '<td colspan="3">参考SP</td>';
				}else if((lotid==90||lotid==72)&&cp==1){
					dzhtml += '<td colspan="3">算奖SP</td>';
				}else{
					dzhtml += '<td colspan="3">平均赔率</td>';
				}
				dzhtml += '<td rowspan="2">比分</td>';
				dzhtml += '<td rowspan="2">彩果</td>';
				dzhtml += '<td rowspan="2" class="sp">计奖SP</td></tr>';
				
				dzhtml += '<tr><td class="s">胜</td><td class="p">平</td><td class="f">负</td></tr></thead>';
				dzhtml += '<colgroup><col width="50"><col width="120"><col width="200"><col width="210"><col width="60">';
				dzhtml += '<col width="60"><col width="60"><col width="60"><col width="60"><col></colgroup><tbody>';

					var r = obj.items.item;		
					var i=0;
					var odd="";
					var wk=["日","一","二","三","四","五","六"];
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						odd="";
						var id = rt.id;// 场次编号
						var hn = rt.hn;// 主队
						var bt = rt.bt;// 比赛时间
						if(bt != '' && bt != undefined)
							bt = Y.getDate(bt).format("MM-DD hh:mm:ss");
						else
							bt='';
						var gn = rt.vn;// 客队
						var lose = rt.lose;// 让球
						var hs = Y.getInt(rt.hs);// 全场主队进球
						var vs = Y.getInt(rt.vs);// 全场客队进球
						var hhs =Y.getInt(rt.hhs);// 半场主队进球
						var hvs =Y.getInt(rt.hvs);// 半场客队进球
						var bet3 = rt.bet3;// 欧赔3
						var bet1 = rt.bet1;// 欧赔1
						var bet0 = rt.bet0;// 欧赔0
						var spvalue = rt.spvalue;// 出票参考SP
						var result = rt.result+"";// 开奖结果
						var c = Y.getInt(rt.cancel);// 场次是否取消
						if(c==""){c=0;}
						var sp="";
						var bf="";
						var dan="";//<span style="color:red">√</span>
						var dstr="";
						var bet_str="";//投注项
						var cls="";
						if(c!=0){
							bf="--";
							result="<font color='red'>延</font>";
							sp="1.00";
						}
						var _splist = spvalue.split("|");
						if(_splist.length > 1){
							if(lotid==90){
								if(_splist.length > 1){
									spvalue = _splist[0];
								}
							}else if(lotid==72){
								if(_splist.length > 1){
									spvalue = _splist[4];
								}
							}else if(lotid==91){
								if(_splist.length > 1){
									spvalue = _splist[1];
								}
							}else if(lotid==92){
								if(_splist.length > 1){
									spvalue = _splist[2];
								}
							}else if(lotid==93){
								if(_splist.length > 1){
									spvalue = _splist[3];
								}
							}
						}
						if(c==0 && (new String(rt.hs).length>0)){
							bf=hhs+':'+hvs+'/'+hs+':'+vs;
							var ststr=result.split(";");
							if(lotid==90){//竞彩胜平负
								var _rt=(hs-vs)*1;
								if(_rt*1>0){result="3";}else if(_rt*1==0){result="1";}else{result="0";}
								var spstr=spvalue.split(",");
								sp=(result=='0'?(spstr[2]):result=='1'?(spstr[1]):result=='3'?(spstr[0]):'--');
							}else if(lotid==72){//竞彩让球胜平负
								var _rt=(hs-vs)*1+(lose)*1;
								if(_rt*1>0){result="3";}else if(_rt*1==0){result="1";}else{result="0";}
								var spstr=spvalue.split(",");
								sp=(result=='0'?(spstr[2]):result=='1'?(spstr[1]):result=='3'?(spstr[0]):'--');
							}else if(lotid==91){//竞彩比分
								var _rt=hs+""+vs;
								result=hs+":"+vs;
								var bfstr=["10","20","21","30","31","32","40","41","42","50","51","52","90","00","11","22","33","99","01","02","12","03","13","23","04","14","24","05","15","25","09"];
								var ii=100;
								for(var i=0;i<31;i++){
									if(bfstr[i]==_rt){ii=i;}
								}
								if(ii==12){
									result="胜其它";
								}else if(ii==17){
									result="平其它";
								}else if(ii==30){
									result="负其它";
								}else if(ii==100){
									if(hs>vs){result="胜其它";ii=12;}else if(hs==vs){result="平其它";ii=17;}else{result="负其它";ii=30;}
								}
								var spstr=spvalue.split(",");
								sp=spstr[ii*1];
							}else if(lotid==92){//竞彩半全场
								var hrt=(hhs-hvs)*1;
								var _rt=(hs-vs)*1;
								if(hrt*1>0){result="3";}else if(hrt*1==0){result="1";}else{result="0";}
								if(_rt*1>0){result=result+"-3";}else if(_rt*1==0){result=result+"-1";}else{result=result+"-0";}
								var spstr=spvalue.split(",");
								sp=(result=='3-3'?(spstr[0]):result=='3-1'?(spstr[1]):result=='3-0'?(spstr[2]):result=='1-3'?(spstr[3]):result=='1-1'?(spstr[4]):result=='1-0'?(spstr[5]):result=='0-3'?(spstr[6]):result=='0-1'?(spstr[7]):result=='0-0'?(spstr[8]):'--');
							}else if(lotid==93){//竞彩总进球数
								var _rt=(hs+vs)*1;
								if(_rt>=7){result=7;}else{result=_rt;}
								var spstr=spvalue.split(",");
								sp=spstr[result*1];
							}else if(lotid==85){//北单胜平负
								result=ststr[0].split(":")[0];
								sp = spvalue;
							}else if(lotid==86){//北单比分
								result=ststr[1].split(":")[0];
								if(result=="90"){
									result="胜其它";
								}else if(result=="99"){
									result="平其它";
								}else if(result=="09"){
									result="负其它";
								}else {
									result=result.substr(0,1)+":"+result.substr(1,1);
								}
								sp=spvalue;
							}else if(lotid==87){//北单半全场
								result=ststr[2].split(":")[0];
								result=result.substr(0,1)+"-"+result.substr(1,1);
								sp=spvalue;
							}else if(lotid==88){//北单上下单双
								var sx=[];
								  sx[0]="下+双";
								  sx[1]="下+单";
								  sx[2]="上+双";
								  sx[3]="上+单";
								result=ststr[3].split(":")[0];
								result=sx[result*1];
								sp=spvalue;
							}else if(lotid==89){//北单总进球数
								result=ststr[4].split(":")[0];
								sp=spvalue;
							}
							
							if(new String(rt.hs).length==0 || new String(rt.vs).length==0){
								sp = "";
								result = "";
								bf = "";
							}
						}

						if(parseInt(lose)!=0 && (lotid==72 || lotid==85)){
							if(parseInt(lose)>0){
								lose="<font color='red'><b>"+lose+"</b></font>";
							}else{
								lose="<font color='green'><b>"+lose+"</b></font>";
							}
						}
						if(type==1){     //复试
							
							if(codes.split(";").length>1){
								bet_str="";//得到投注选项
								ggstr=codes.split(";")[0].split("|")[2].replaceAll("\\*","串");
							}else{
								
							var arr_bet;
							arr_bet=codes.split("|");
							bet_str=arr_bet[1];//得到投注选项
							ggstr=arr_bet[2].replaceAll("\\*","串");
							
							if(bet_str.indexOf("$")!=-1){
								dan=bet_str.split("$")[0];
								bet_str=bet_str.replace("$",",");
								
								dan_bet=dan.split(",");
								var dan_len=dan_bet.length;
								for(var c=0;c<dan_len;c++){
									var darr=dan_bet[c].split("=");
										if(darr[0]*1==id*1){
											dan='<span style="color:red">(胆)</span>';
											dstr='(胆)';
											break;
										}else{
											dan='';
											dstr='';
										}
								}
							}
							
							bet_str=bet_str.replaceAll("/"," ");
							arr_bet=bet_str.split(",");
							
							var bet_len=arr_bet.length;
							
							for(var b=0;b<bet_len;b++){
								var barr=arr_bet[b].split("=");
								if(barr[0]*1==id*1){
									bet_str=barr[1];
									break;
								}
							}
							
							
							//玩法不同 彩果以及SP取值不同
							if(lotid==88){
								bet_str=bet_str.replaceAll("0","下+双");
								bet_str=bet_str.replaceAll("1","下+单");
								bet_str=bet_str.replaceAll("2","上+双");
								bet_str=bet_str.replaceAll("3","上+单");
							}
							
							if(lotid==91 || lotid==86){
								bet_str=bet_str.replaceAll("9:9","平其它");
								bet_str=bet_str.replaceAll("0:9","负其它");
								bet_str=bet_str.replaceAll("9:0","胜其它");
							}
							if(result!=""&&bet_str.indexOf(result)!=-1){
								bet_str=bet_str.replace(result,"<font color='red'><b>"+result+"</b></font>");
								cls="style='background-color:#ffd6cc'";
							}else{
								cls="";
							}
						  }	
						}else{
							ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
						}
						
						if(lotid==90||lotid==72){
							var cksp=spvalue.split(",");
							bet3=cksp[0];
							bet1=cksp[1];
							bet0=cksp[2];
						}
						tmpData = {id:id};
						if(o%2==1){odd="odd";}
						dzhtml += '<tr class="'+odd+'">';
						if(lotid==90 || lotid==72 || lotid==91 || lotid==92 || lotid==93){
							var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
							dzhtml += '<td title="'+id+'">周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';	
							tmpData.mid = '周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3);
						}else{
							dzhtml += '<td>'+id+'</td>';	
							tmpData.mid = id;
						}
						dzhtml += '<td>'+bt+'</td>';
						tmpData.hn = hn;
						dzhtml += '<td>'+hn;
						if(lotid==90 || lotid==72 || lotid==85){
							dzhtml += '&nbsp;'+lose+'&nbsp;';
							tmpData.lose = lose;
						}else{
							dzhtml += '&nbsp;VS&nbsp;';
						}	
						dzhtml += gn+'</td>';
						tmpData.gn = gn;
						dzhtml += '<td '+cls+' title="'+(bet_str+dstr)+'">'+(bet_str+dan)+'</td>';
						dzhtml += '<td>'+bet3+'</td>';
						dzhtml += '<td>'+bet1+'</td>';
						dzhtml += '<td>'+bet0+'</td>';
						dzhtml += '<td>'+bf+'</td>';
						dzhtml += '<td>'+result+'</td>';
						dzhtml += '<td>'+sp+'</td>';
						dzhtml += '</tr>';
						mdata[mdata.length] = tmpData;
						i++;
					});
					dzhtml += '</tbody>';
					$("#ccodes").html(dzhtml);
			}
				var html = "<p>";
				if(type=="1"){
					html += '&nbsp;&nbsp;提示：过关方式为 ';
				}else{
					html += '&nbsp;&nbsp;方案已传，请点击 ';
				}
				html += ggstr;
				if(lotid>=90 || lotid==70 || lotid==72){
					html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
				}
				html += '</p>';
				$(".zc_hm_fann").append(html);
		},
		error : function() {
			if(type=="1"){
				$("#ccodes").html($_sys.showcode(lotid,codes));
			}else{
				$("#ccodes").html('方案已传，请点击<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>');
			}
			return false;
		}
	});	
};
billcode = function(lotid,projid){
	$("#detail_reco").html("");
	var htmlstr = '';
	htmlstr = '<table width="100%" border="0" cellspacing="0" cellpadding="0">';
	htmlstr+= '<tr>';
	htmlstr+= '<td width="10%">序号</td>';
	htmlstr+= '<td width="10%">玩法</td>';
	htmlstr+= '<td width="50%">投注内容</td>';
	htmlstr+= '<td width="10%">过关方式</td>';
	htmlstr+= '<td width="10%">倍数</td>';
	htmlstr+= '<td width="10%">奖金</td>';
	htmlstr+= '</tr>';
	var data = "gid=" + lotid + "&hid="+projid;	
	Y.ajax({
		type : 'POST',
		data : data,
		url : $_trade.url.ai,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			if(obj.Resp.code==0){
				var tb = 0;
				var r = obj.Resp.rows.row;
				if(!this.isArray(r)){r=new Array(r);}
				r.each(function(rt,o){
					var parts = rt.code.split("|");
					var items = parts[1].split(",");
					htmlstr += '<tr>';
					htmlstr +=  '<td rowspan="'+items.length+'">'+(o+1)+'</td>';
					htmlstr +=  '<td rowspan="'+items.length+'">'+playtype(parts[0])+'</td>';
					htmlstr +=  '<td>'+items[0]+'</td>';
					htmlstr +=  '<td rowspan="'+items.length+'">'+parts[2]+'</td>';
					htmlstr += '<td rowspan="'+items.length+'">'+rt.mul+'</td>';
					var _bonus = (parseFloat(rt.bonus).toFixed(6));
					htmlstr += '<td rowspan="'+items.length+'">￥'+_bonus.slice(0,-4)+'</td>';
					htmlstr += '</tr>';
					for(var k = 1; k<items.length;k++){
						htmlstr += '<tr>';
						htmlstr +=  '<td>'+items[k]+'</td>';
						htmlstr += '</tr>';
					}
					tb += parseFloat(rt.bonus);
				});
                if(tb > 0){
                	htmlstr +='<tr><td class="cm_account_em1">合计</td><td colspan="4" class="cm_jjmx_li2">&nbsp;</td><td class="cm_account_em3"><em class="cm_red">￥'+(parseFloat(tb).toFixed(2))+'</em>元</td></tr>';
                }
                htmlstr +='</table>';
			}else{
				htmlstr ='<div style="width:580px;text-align:center;margin-top:20px;">'+obj.Resp.desc+'</div>';
			}
			$("#detail_reco").html(htmlstr);
		}
	});
	Y.billCode();
};
playtype = function(type){
	if(type == 'SPF'){return '胜平负';} else if(type == 'JQS'){return '进球数';} else if(type == 'BQC'){return '半全场';} else if(type == 'CBF'){return '猜比分';} else if(type == 'SF'){return '胜负';} else if(type == 'RFSF'){return '让分胜负';} else if(type == 'SFC'){return '胜分差';} else if(type == 'DXF'){return '大小分';}
	return type;
};
//篮彩显示对阵
showlancai =function (lotid,expect,projid,type,codes,cp){
//	$("#see_duizhen").html("关闭");
//	$("#see_duizhen").unbind("click");
//	$("#see_duizhen").click(function(){
//		$("#ccodes").html('');
//		$("#see_duizhen").html("查看");
//		$("#see_duizhen").click(function(){
//			showlancai(lotid,expect,projid,type,codes,cp);
//		});
//	});
	
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/proj/" + projid.toLowerCase() + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var ggstr="";
			if(lotid == 71){
				var sfstr=["0","3"];
				var rfsfstr=["0","3"];
				var dxfstr=["3","0"];
				var sfcstr=["11","12","13","14","15","16","01","02","03","04","05","06"];
			   var hhhtml = '<thead><tr>';
				   hhhtml += '<td>场次</td>';
				   hhhtml += '<td>比赛时间</td>';
				   hhhtml += '<td>客队 VS 主队</td>';
				   hhhtml += '<td>玩法</td>';
				   hhhtml += '<td>投注选项</td>';
				   hhhtml += '<td>彩果</td>';
				   hhhtml += '<td class="sp">计奖SP</td>';
				   hhhtml += '</tr></thead>';
				   hhhtml += '<colgroup><col width="60"><col width="110"><col width="180"><col width="130"><col><col width="80">';
				   hhhtml += '<col width="80"></colgroup><tbody>';
					var odd="";
					var r = obj.items.item;
					var wk=["日","一","二","三","四","五","六"];
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						odd="";
						var id = rt.id;// 场次编号
						var hn = rt.hn;// 主队
						var bt = rt.bt;// 比赛时间
						if(bt != '' && bt != undefined)
							bt = Y.getDate(bt).format("MM-DD hh:mm");
						else
							bt='';
						var gn = rt.vn;// 客队
						var lose = rt.lose;// 让球
						var hs = Y.getInt(rt.hs);// 全场主队进球
						var vs = Y.getInt(rt.vs);// 全场客队进球
						var spvalue = rt.spvalue;// 出票参考SP
						var result = rt.result;// 开奖结果
						var c = Y.getInt(rt.cancel);// 场次是否取消
						if(c==""){c=0;}
						var sp="";
						var bf="";
						if(c!=0){
							bf="--";
							result="<font color='red'>延</font>";
							sp="1.00";
						}
						var hsstr =  rt.hs+"";
//						HH|130326303>DXF=3,130326302>RFSF=0/3+SFC=01/02/03/04/05/06/11/12/13/14/16,130326301>SF=0+RFSF=3+DXF=0/3|3*4
						var ncode = codes.split("|")[1];
						var codestr=ncode.split(",");
						var itemcodes ="";
						F:for(var n=0;n<codestr.length;n++){
							itemcodes=codestr[n];
							if(itemcodes.indexOf(id+"")>=0){
								var itemcode = itemcodes.substring(itemcodes.indexOf(">")+1,itemcodes.length).split("+");
								var ji = itemcode.length;
								var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
								if(o%2==1){odd="odd";}
								hhhtml += '<tr class="'+odd+'">';
								hhhtml += '<td rowspan='+ji+'>周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
								hhhtml += '<td rowspan='+ji+'>'+bt+'</td>';
								hhhtml += '<td rowspan='+ji+'>'+gn+' VS '+hn;
								if(c==0 && hsstr.length>0){
									bf=vs+':'+hs;
									hhhtml += ' (<font color="red">'+bf+'</font>)';
								}
								hhhtml += '</td>';
								var spvalues = spvalue.split("|");
								var loses = lose.split("|");
								var codarr = [];
								var i=0;
								itemcode.each(function(onecode){
									var playty = onecode.split("=")[0];
									var cod = onecode.split("=")[1].split("/");
									if(playty == "SF"){
										var spvalue = spvalues[0].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs-vs)*1;
												if(rt*1>0){result="3";}else{result="0";}
												sp = spvalue[$_sys.getSub(sfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\"><b>"+result+"</b></font>").replace("3","主胜").replace("0","主负")+"("+spvalue[$_sys.getSub(sfstr,cds)]+")");
										});
										if(i>0){hhhtml += '<tr class="'+odd+'">';}
										hhhtml += '<td>胜负</td>';
										hhhtml += '<td class="cm_w225">'+codarr.join(" ")+'</td>';
										hhhtml += '<td>'+(result == "&nbsp;" ? "&nbsp;" : result.replace("3","主胜").replace("0","主负"))+'</td>';
										hhhtml += '<td>'+sp+'</td>';
										hhhtml += '</tr>';
									}
									if(playty == "RFSF"){
										var spvalue = spvalues[1].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs-vs)*1+(loses[1])*1;
												if(rt*1>0){result="3";}else{result="0";}
												sp = spvalue[$_sys.getSub(rfsfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\"><b>"+result+"</b></font>").replace("3","让分主胜").replace("0","让分主负")+"("+spvalue[$_sys.getSub(rfsfstr,cds)]+")");
										});
										var lo = "";
										if(loses[1].substr(0,1).indexOf("-")!=-1){
											lo = "<font color=\"green\">"+loses[1]+"</font>";
										}else{
											lo = "<font color=\"red\">"+loses[1]+"</font>";
										}
										if(i>0){hhhtml += '<tr class="'+odd+'">';}
										hhhtml += '<td>让分胜负&nbsp;'+lo+'</td>';
										hhhtml += '<td class="cm_w225">'+codarr.join(" ")+'</td>';
										hhhtml += '<td>'+(result == "&nbsp;" ? "&nbsp;" : result.replace("3","让分主胜").replace("0","让分主负"))+'</td>';
										hhhtml += '<td>'+sp+'</td>';
										hhhtml += '</tr>';
									}
									if(playty == "DXF"){
										var spvalue = spvalues[3].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs+vs)*1-(loses[3])*1;
												if(rt*1>0){result="3";}else{result="0";}
												sp = spvalue[$_sys.getSub(dxfstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\"><b>"+result+"</b></font>").replace("3","大分").replace("0","小分")+"("+spvalue[$_sys.getSub(dxfstr,cds)]+")");
										});
										if(i>0){hhhtml += '<tr class="'+odd+'">';}
										hhhtml += '<td>大小分&nbsp;<font color=\"red\">'+loses[3]+'</font></td>';
										hhhtml += '<td class="cm_w225">'+codarr.join(" ")+'</td>';
										hhhtml += '<td>'+(result == "&nbsp;" ? "&nbsp;" : result.replace("3","大分").replace("0","小分"))+'</td>';
										hhhtml += '<td>'+sp+'</td>';
										hhhtml += '</tr>';
									}
									if(playty == "SFC"){
										var spvalue = spvalues[2].split(",");
										if(c==0){
											if(hsstr.length>0){
												var rt=(hs-vs)*1;
												if(rt>0&&rt<6){result="01";}
												else if(rt>5&&rt<11){result="02";}
												else if(rt>10&&rt<16){result="03";}
												else if(rt>15&&rt<21){result="04";}
												else if(rt>20&&rt<26){result="05";}
												else if(rt>25){result="06";}
												else if(rt>-6&&rt<0){result="11";}
												else if(rt>-11&&rt<-5){result="12";}
												else if(rt<-10&&rt>-16){result="13";}
												else if(rt<-15&&rt>-21){result="14";}
												else if(rt<-20&&rt>-26){result="15";}
												else if(rt<-25){result="16";}
												sp = spvalue[$_sys.getSub(sfcstr,result)];
											}else{
												result = "&nbsp;";
												sp = "&nbsp;";
											}
										}
										codarr = [];
										cod.each(function(cd){
											var cds = cd;
											codarr.push(cd.replace(result,"<font color=\"red\"><b>"+result+"</b></font>").replace("01","主胜a").replace("02","主胜h").replace("03","主胜k").replace("04","主胜m").replace("05","主胜s").replace("06","主胜g").replace("11","客胜a").replace("12","客胜h").replace("13","客胜k").replace("14","客胜m").replace("15","客胜s").replace("16","客胜g").replace("a","1-5").replace("h","6-10").replace("k","11-15").replace("m","16-20").replace("s","21-25").replace("g","26+")+"("+spvalue[$_sys.getSub(sfcstr,cds)]+")");
										});
										if(i>0){hhhtml += '<tr class="'+odd+'">';}
										hhhtml += '<td>胜分差</td>';
										hhhtml += '<td class="cm_w225">'+codarr.join(" ")+'</td>';
										hhhtml += '<td>'+(result == "&nbsp;" ? "&nbsp;" : result.replace("01","主胜a").replace("02","主胜h").replace("03","主胜k").replace("04","主胜m").replace("05","主胜s").replace("06","主胜g").replace("11","客胜a").replace("12","客胜h").replace("13","客胜k").replace("14","客胜m").replace("15","客胜s").replace("16","客胜g").replace("a","1-5").replace("h","6-10").replace("k","11-15").replace("m","16-20").replace("s","21-25").replace("g","26+"))+'</td>';
										hhhtml += '<td>'+sp+'</td>';
										hhhtml += '</tr>';
									}
									i++;
								});
								break F;
							}
						}
					});
					var isdystr = "";
					if(codes.split("|").length == 4){
						isdystr = "去除单一玩法串投注";
					}else{
						isdystr = "允许单一玩法串投注";
					}
					var gg = codes.split("|")[2].replaceAll("\\*","串");
					hhhtml += '</tbody>';
					ggstr= gg+'&nbsp;<font color="red">'+isdystr+'</font>';
					$("#ccodes").html(hhhtml);
			}else{
				var dzhtml = '<thead><tr><td rowspan="2">序号</td>';
				dzhtml += '<td rowspan="2">比赛时间</td>';
				if(lotid==94 || lotid==96){
					dzhtml += '<td rowspan="2">客队 vs 主队</td>';
				}else if(lotid==95){
					dzhtml += '<td rowspan="2">客队 / 让分 / 主队</td>';
				}else if(lotid==97){
					dzhtml += '<td rowspan="2">客队 / 预设总分 / 主队</td>';
				}
				dzhtml += '<td rowspan="2">投注选项</td>';
				
				if(lotid==94 || lotid==95 || lotid==97){
					if(cp==0){
						dzhtml += '<td colspan="2">参考SP</td>';
					}else{
						dzhtml += '<td colspan="2">算奖SP</td>';
					}
				}else{
					dzhtml += '<td colspan="3">平均赔率</td>';	
				}

				dzhtml += '<td rowspan="2">比分</td>';
				dzhtml += '<td rowspan="2">彩果</td>';
				dzhtml += '<td rowspan="2" class="sp">计奖SP</td></tr>';
				if(lotid==97){
					dzhtml += '<tr><td class="s">大分</td><td class="f">小分</td></tr></thead>';
				}else{
					dzhtml += '<tr><td class="s">主负</td><td class="f">主胜</td></tr></thead>';
				}
				dzhtml += '<colgroup><col width="50"><col width="120"><col width="220"><col width="210"><col width="60">';
				dzhtml += '<col width="60"><col width="60"><col width="60"><col></colgroup><tbody>';
					var r = obj.items.item;		
					var i=0;
					var wk=["日","一","二","三","四","五","六"];
					var odd="";
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						odd="";
						var id = rt.id;// 场次编号
						var bt = rt.bt;// 比赛时间
						if(bt != '' && bt != undefined){
							bt = Y.getDate(bt).format("MM-DD hh:mm:ss");
						}else{
							bt = '';
						}

						var hn = rt.hn;// 主队
						var gn = rt.vn;// 客队
						var lose = rt.lose;// 让分--总分
						var hs = Y.getInt(rt.hs);// 全场主队进球
						var vs = Y.getInt(rt.vs);// 全场客队进球
						var bet3 = rt.bet3;// 欧赔3
						var bet0 = rt.bet0;// 欧赔0
						var spvalue = rt.spvalue;// 出票参考SP
						var result = "";// 开奖结果
						var c = Y.getInt(rt.cancel);// 场次是否取消

						if(c==""){c=0;}
						var sp="";
						var bf="";
						var dan="";//<span style="color:red">√</span>
						var bet_str="";//投注项
						var cls="";
						if(c!=0){
							bf="--";
							result="<font color='red'>延</font>";
							sp="1.00";
						}
						var _splist = spvalue.split("|");
						var _lose = lose.split("|");
						if(_splist.length > 1){
							if(lotid==94){
								spvalue = _splist[0];
							}else if(lotid==95){
								spvalue = _splist[1];
								if(_lose.length > 1){
									lose = _lose[1];
								}
							}else if(lotid==96){
								spvalue = _splist[2];
							}else if(lotid==97){
								spvalue = _splist[3];
								if(_lose.length > 1){
									lose = _lose[3];
								}
							}
						}
						if(c==0 && new String(rt.hs).length>0){
							bf=vs+':'+hs;
							var ststr=result.split(";");
							if(lotid==94){//胜负
								var rt=(hs-vs)*1;
								if(rt*1>0){result="主胜";}else{result="主负";}
								var spstr=spvalue.split(",");
								sp=(rt*1>0?(spstr[1]):(spstr[0]));
							}else if(lotid==95){//让分胜负
								var rt=(hs-vs)*1+(lose)*1;
								if(rt*1>0){result="主胜";}else{result="主负";}
								var spstr=spvalue.split(",");
								sp=(rt*1>0?(spstr[1]):(spstr[0]));
							}else if(lotid==96){//胜分差
								var rt=(hs-vs)*1;
								var spstr=spvalue.split(",");
								if(rt>0&&rt<6){result="主胜1-5";sp=spstr[6];}
								else if(rt>5&&rt<11){result="主胜6-10";sp=spstr[7];}
								else if(rt>10&&rt<16){result="主胜11-15";sp=spstr[8];}
								else if(rt>15&&rt<21){result="主胜16-20";sp=spstr[9];}
								else if(rt>20&&rt<26){result="主胜21-25";sp=spstr[10];}
								else if(rt>25){result="主胜26+";sp=spstr[11];}
								else if(rt>-6&&rt<0){result="客胜1-5";sp=spstr[0];}
								else if(rt>-11&&rt<-5){result="客胜6-10";sp=spstr[1];}
								else if(rt<-10&&rt>-16){result="客胜11-15";sp=spstr[8];}
								else if(rt<-15&&rt>-21){result="客胜16-20";sp=spstr[9];}
								else if(rt<-20&&rt>-26){result="客胜21-25";sp=spstr[10];}
								else if(rt<-25){result="客胜26+";sp=spstr[11];}
							}else if(lotid==97){//大小分
								var rt=(hs+vs)*1-(lose)*1;
								if(rt*1>0){result="大分";}else{result="小分";}
								var spstr=spvalue.split(",");
								sp=(rt*1>0?(spstr[0]):(spstr[1]));
							}
						}
						 
						if(lotid==95){
							if(parseInt(lose)>0){
								lose="/<font color='red'><b>"+lose+"</b></font>/";
							}else{
								lose="/<font color='green'><b>"+lose+"</b></font>/";
							}
						}else if(lotid==94 || lotid==96){
							lose=" vs ";
						}else if(lotid==97){
							lose="/<font color='blue'><b>"+lose+"</b></font>/";
						}
						
						if(type==1){     //复试
							
							if(codes.split(";").length>1){
								bet_str="";//得到投注选项
								ggstr=codes.split(";")[0].split("|")[2].replaceAll("\\*","串");
							}else{
								
							var arr_bet;
							arr_bet=codes.split("|");
							bet_str=arr_bet[1];//得到投注选项
							ggstr=arr_bet[2].replaceAll("\\*","串");
							
							if(bet_str.indexOf("$")!=-1){
								dan=bet_str.split("$")[0];
								bet_str=bet_str.replace("$",",");
								
								dan_bet=dan.split(",");
								var dan_len=dan_bet.length;
								for(var c=0;c<dan_len;c++){
									var darr=dan_bet[c].split("=");
										if(darr[0]*1==id*1){
											dan='<span style="color:red">(胆)</span>';
											break;
										}else{
											dan='';
										}
								}
							}
							
							bet_str=bet_str.replaceAll("/"," ");
							arr_bet=bet_str.split(",");
							
							var bet_len=arr_bet.length;
							
							for(var b=0;b<bet_len;b++){
								var barr=arr_bet[b].split("=");
								if(barr[0]*1==id*1){
									bet_str=barr[1];
									break;
								}
							}
							
							//玩法不同 彩果以及SP取值不同
							if(lotid==94 || lotid==95){
								bet3 = spvalue.split(",")[1];// 3
								bet0 = spvalue.split(",")[0];// 0
								bet_str=bet_str.replaceAll("0","主负");
								bet_str=bet_str.replaceAll("3","主胜");
							}else if(lotid==97){
								bet3 = spvalue.split(",")[1];// 小分
								bet0 = spvalue.split(",")[0];// 大分
								bet_str=bet_str.replaceAll("0","小分");
								bet_str=bet_str.replaceAll("3","大分");
							}else if(lotid==96){
								bet_str=bet_str.replaceAll("01","主胜1-5");
								bet_str=bet_str.replaceAll("02","主胜6-10");
								bet_str=bet_str.replaceAll("03","主胜1/1-1/5");
								bet_str=bet_str.replaceAll("04","主胜1/6-20");
								bet_str=bet_str.replaceAll("05","主胜21-25");
								bet_str=bet_str.replaceAll("06","主胜26+");
								bet_str=bet_str.replaceAll("11","客胜1-5");
								bet_str=bet_str.replaceAll("12","客胜6-10");
								bet_str=bet_str.replaceAll("13","客胜1/1-1/5");
								bet_str=bet_str.replaceAll("14","客胜1/6-20");
								bet_str=bet_str.replaceAll("15","客胜21-25");
								bet_str=bet_str.replaceAll("16","客胜26+");
								bet_str=bet_str.replaceAll("/","");
							}
							
							
							if(result!=""&&bet_str.indexOf(result)!=-1){
								bet_str=bet_str.replace(result,"<font color='red'><b>"+result+"</b></font>");
								cls="style='background-color:#ffd6cc'";
							}else{
								cls="";
							}
						  }	
						}else{
							ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
						}
						if(o%2==1){odd="odd";}
						dzhtml += '<tr class="'+odd+'">';
						
						var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
						dzhtml += '<td title="'+id+'">周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
						dzhtml += '<td>'+bt+'</td>';	
						dzhtml += '<td>'+gn+''+lose+''+hn+'</td>';
						dzhtml += '<td '+cls+'>'+(bet_str+dan)+'</li>';
						dzhtml += '<td>'+bet0+'</td>';
						dzhtml += '<td>'+bet3+'</td>';
						dzhtml += '<td>'+bf+'</td>';
						dzhtml += '<td>'+result+'</td>';
						dzhtml += '<td>'+sp+'</td>';
						dzhtml += '</tr>';
						i++;
					});
					dzhtml += '</tbody><p>';
					if(type=="1"){
						dzhtml += '&nbsp;&nbsp;提示：过关方式为 ';
					}else{
						dzhtml += '&nbsp;&nbsp;方案已传，请点击 ';
					}
					dzhtml += '</tbody>';
					$("#ccodes").html(dzhtml);
			}
				var html = "<p>";
				if(type=="1"){
					html += '&nbsp;&nbsp;提示：过关方式为 ';
				}else{
					html += '&nbsp;&nbsp;方案已传，请点击 ';
				}
				html += ggstr;
				html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
				html += '</p>';
				$(".zc_hm_fann").append(html);
		},
		error : function() {
			if(type=="1"){
				$("#ccodes").html($_sys.showcode(lotid,codes));
			}else{
				$("#ccodes").html('方案已传，请点击<font class="red"><a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a></font>');
			}
			return false;
		}
	});	
};

//足彩显示对阵
zcduizhen =function (lotid,expect,projid,type){
	var codes=$("#codestr").val();
	var gid="";
	switch (lotid+""){
	case "80":
	case "81":
		gid=1;
		break;
	case "82"://进球
		gid=2;
		break;
	case "83":
		gid=3;
		break;
	default:
		break;
	}
	Y.ajax({
		url : "/cpdata/match/zc/"+lotid+"/"+expect+".json",
		type : "GET",
		dataType : "json",
            end : function(d) {
            var obj = eval("(" + d.text + ")");
            var dzhtml = '<thead><tr><td rowspan="2">场次</td>';
			dzhtml += '<td rowspan="2">比赛时间</td>';
			dzhtml += '<td rowspan="2">主队 VS 客队</td>';
			dzhtml += '<td rowspan="2">投注选项</td>';
		    dzhtml += '<td colspan="3">平均赔率</td>';
			dzhtml += '<td rowspan="2">比分</td>';
			dzhtml += '<td rowspan="2">彩果</td></tr>';
			dzhtml += '<tr><td class="s">胜</td><td class="p">平</td><td class="f">负</td></tr></thead>';
			dzhtml += '<colgroup><col width="50"><col width="120"><col width="200"><col width="210"><col width="60">';
			dzhtml += '<col width="60"><col width="60"><col width="60"><col></colgroup><tbody>';
	
				var r = obj.rows.row;		
				var i=0;
				var ggstr="";
				var danstr="";
				var bet_str="";//投注项
				var arr_bet="";
				var odd="";
				if(type==1){     //复试
					bet_str=codes.split(":")[0];//得到投注选项
					if(bet_str.indexOf("$")!=-1){
						danstr=bet_str.split("$")[0].split(",");
						arr_bet=bet_str.split("$")[1].split(",");
					}else{
						arr_bet=bet_str.split(",");
					}
					
				}else{
					ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
				}
				
				r.each(function(rt,o) {
					odd="";
					var id = rt.mid;// 场次编号
					var bt = rt.bt;// 比赛时间
					if(bt != '' && bt != undefined)
						bt = Y.getDate(bt).format("MM-DD hh:mm:ss");
					else
						bt = '';
					var hn = rt.hn;// 主队
					var gn = rt.gn;// 客队
					var hs = rt.ms+"";// 全场主队进球
					var vs = rt.ss+"";// 全场客队进球
					var bet3 = rt.b3+"00";// 欧赔3
					var bet1 = rt.b1+"00";// 欧赔1
					var bet0 = rt.b0+"00";// 欧赔0
					var result = rt.rs+"";// 开奖结果
					var bf="";
					var dan="";//<span style="color:red">√</span>
					var bet_str="";//投注项
					var cls="";
					if(result=="*" || result=="*,*"){
						bf="--";
						result="<font color='red'>*</font>";
					}else{
						if(hs!="" && vs!=""){bf=hs+":"+vs;}
					}
					
					if(type==1){//复
						if(danstr.length>0){
							if(danstr[i]!="#"){
								bet_str=danstr[i];
								dan='<span style="color:red">(胆)</span>';
							}else{
								bet_str=arr_bet[i];
								dan='';
							}
						}else{
							if(lotid==82){
							    bet_str="[主]"+arr_bet[i*2]+" [客]"+arr_bet[i*2+1];
							}else{
								bet_str=arr_bet[i];
							}
							dan='';
						}

						bet_str=bet_str.replaceAll("3","3 ").replaceAll("2","2 ").replaceAll("1","1 ").replaceAll("0","0 ");
						if(result!=""&&bet_str.indexOf(result)!=-1){
							bet_str=bet_str.replace(result,"<font color='red'><b>"+result+"</b></font>");
							cls="style='background-color:#ffd6cc'";
						}else{
							cls="";
						}
						
						if(bet_str=="#"){bet_str="";}
					}
					
					if(lotid==82 && bf!="--" && bf!=""){
						result=result.split(",");
						result="[主]"+result[0]+"<br/>[客]"+result[1];	
					}
					if(o%2==1){odd="odd";}
					dzhtml += '<tr class="'+odd+'">';
					dzhtml += '<td>'+id+'</td>';
					dzhtml += '<td>'+bt+'</td>';	
					dzhtml += '<td>'+hn+'&nbsp;VS&nbsp;'+gn+'</td>';
					dzhtml += '<td '+cls+'>'+(bet_str+dan)+'</td>';
					dzhtml += '<td>'+(bet3.length > 2 ? parseFloat(bet3).toFixed(2) : "" )+'</td>';
					dzhtml += '<td>'+(bet1.length > 2 ? parseFloat(bet1).toFixed(2) : "" )+'</td>';
					dzhtml += '<td>'+(bet0.length > 2 ? parseFloat(bet0).toFixed(2) : "" )+'</td>';
					dzhtml += '<td>'+bf+'</td>';
					dzhtml += '<td>'+result+'</td>';
					dzhtml += '</tr>';
					i++;
				});
				
				if(type==0){
					dzhtml += '<p>';
					dzhtml += '&nbsp;&nbsp;方案已传，请点击 ';
					dzhtml += ggstr+'</p>';
				}
				
				$("#ccodes").html(dzhtml);
		},
		error : function() {
			if(type=="1"){
				$("#ccodes").html($_sys.showcode(lotid,codes));
			}else{
				$("#ccodes").html('方案已传，请点击<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>');
			}
			return false;
		}
	});	
};