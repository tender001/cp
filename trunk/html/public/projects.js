Class.C('time_style', true);
Class.C('time_style_ctpl', '<em>{1}</em><i>天</i><em>{2}</em><i>时</i><em>{3}</em><i>分</i>');
Class.C('time_style_ctp2', '<em>{2}</em><i>时</i><em>{3}</em><i>分</i><em>{4}</em><i>秒</i>');
var faqiren="";///记录发起人
var jcexy=false;///记录二选一
Y.use('mask',function(){
	Y.loading = Y.lib.MaskLay();
	Y.loading.noMask = true;
	var dlg_buy_end = Y.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
	dlg_buy_end.addClose('#dlg_buysuc_back','#dlg_buysuc_close','#dlg_buysuc_close2');
	Y.extend('popBuyOk', function(user,lotid,projid){
		$('#dlg_buysuc_view').die().live('click', function(){
			window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;
		});
//		dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
	});
});
$_sys.getarryname=function(arr,id){
	for(var i = 0; i < arr.length; i++){
		if(arr[i][0]==id){
			return arr[i][1];
		}
	}
	return null;
};
$("#yhinfodiv").hide();
$_sys.getspfsel=function(sel){	
	return sel.replace(/0/g,"负").replace(/1/g,"平").replace(/3/g,"胜");
};
Y.use('mask', function(){
	var addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
	addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
	Y.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
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
	Y.get('#T_Detail div.tantop').drag('#T_Detail');
	Y.extend('billCode', function(){
		billcodediv.pop('', function(e, btn){
					
		});
	});
});

baoditorg = function(){
	var lotid = Y.one('#lotid').value;  
	var projid = Y.one('#projid').value;  
	Y.postMsg('msg_login', function (){
		Y.openUrl('/game/bdrg.html?lotid='+lotid+'&projid='+projid,500,200);
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
//            	         setTimeout(function(){
//            	               location.reload();
//            	           }, 3000);
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
	showmyjoin(lotid,projid);
	showjoin(lotid,projid,10,1);
	//显示发起人认购
	

	
$("div.xqtab1 b").click(function(){
	$("div.xqtab1 b").removeClass('cur');
	$(this).addClass('cur');
		if($(this).html()=="方案详情"){
			$("#cp_hmtable").hide();
			$("#cp_infotable").show();
	    }else{
	    	$("#cp_hmtable").show();
			$("#cp_infotable").hide();
			
			
		}
		
	})

	$("#span_betContent").click(function(){
		$(this).toggleClass('select');
		$("#buy_info").toggle();
	})
	$("#oshow").click(function(){
		if($(".over_ten").is(":hidden")){
			$(".over_ten").show();
			$("#oshow").html("收起").removeClass("a_ss2");
		}else{
			$(".over_ten").hide();
			$(this).html("展开").addClass("a_ss2");
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
		
			if(!($("#checkbox").is(":checked"))){
				Y.alert('您好，确认用户投注协议！');
				$("#permoney").val("");
				return false;
			}
			if(permoney == ''){
				Y.alert('您好，认购金额不能为空！');
				$("#permoney").val("");
				return false;
			}
			if(permoney <= 0 || Y.getInt(permoney) != permoney){
				Y.alert('您好，认购金额必须为大于等于1的整数！');
				$("#permoney").val("");
				return false;
			}
			if(Y.getInt(permoney) > Y.one('#pmoney').value){
				Y.alert('您好，认购金额不能大于剩余金额！');
				$("#permoney").val("");
				return false;
			}
			
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				$("#permoney").val("");
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
	    				 setTimeout( function(){top.location.reload();},2000);
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


var mark=function(isc, awa, isre, istat,adddate,castdate,awarddate,retdate,process,processmoney,upload){
	
	var icast = isc;// 出票标志（0 未出票 1 可以出票 2 已拆票 3 已出票）
	var award = awa;// 计奖标志（0 未计奖 1 正在计奖 2 已计奖)
	var ireturn = isre;// 是否派奖（0 未派奖 1 正在派 2 已派奖）
	var istate = istat;
	if(retdate != '' && retdate != undefined){
		$("#kj_time").html(Y.getDate(awarddate).format('MM-DD hh:mm:ss'));
		$("#pj_time").html(Y.getDate(retdate).format('MM-DD hh:mm:ss'));
	}else if(awarddate != '' && awarddate != undefined){
		$("#kj_time").html(Y.getDate(awarddate).format('MM-DD hh:mm:ss'));
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
		
		$("#process").html("已撤单<i></i>").css("left",process+"px");
		
		
		break;
	case 2://出票中2
		
		$("#process").html("出票中<i></i>").css("left",process+"px");
		if(istate=="2"){
			$("#cp_full").addClass("fq").removeClass("liubiao");
		}
		$("#cm_sfc_context").next().hide();
		break;
	case 3://等待出票3
			if(upload==0){
			$("#process").html("等待上传方案<i></i>").css("left",process+"px");
			if(istate=="2"){
				$("#cp_full").addClass("fq").removeClass("liubiao");
			}
		}else{
			if(processmoney>0){
				$("#process").html("还差"+processmoney+"元即达出票要求<i></i>").css("left",process+"px");
			}else{
//				if(istate=="2"){
					$("#cp_full").addClass("fq").removeClass("liubiao");
					$("#process").html("等待出票<i></i>").css("left",process+"px");
//				}
			}
			
		}
		
		break;
	case 5://出票成功5
//		$("p[mark=cp_countDownSpan]").html("<b class='cur'>出票成功</b>");
		if(istate==2){
			$("#process").html("出票成功<i></i>").css("left","260px");
			$("#cp_full").addClass("fq").removeClass("liubiao");
			$("#cp_full").addClass("fq").removeClass("liubiao");
			$("#baodi_rengou").hide();
		}else{
			$("#process").html("出票成功<i></i>").css("left",process+"px");
		}
		break;
	case 6://已开奖6
		$("#cp_full").addClass("fq").removeClass("liubiao");
		$("#cp_full").addClass("fq").removeClass("liubiao");
		$("#kjProcessSpan").html('<span class="fq" style="width: 100%;"></span>');
		$("#cpbuy_info").hide();
		$("#process").html("已开奖<i></i>").css("left","455px");
		break;
	case 7://已计奖7
		$("#cp_full").addClass("fq").removeClass("liubiao");
		$("#cp_kj").addClass("fq").removeClass("liubiao");
		$("#kjProcessSpan").html('<span class="fq" style="width: 100%;"></span>');
		$("#returnProcessSpan").html('<span class="fq" style="width: 40%;"></span>');
		$("#process").html("已计奖<i></i>").css("left","480px");
		break;
	case 8://派奖中8
		$("#cp_full").addClass("fq").removeClass("liubiao");
		$("#cp_kj").addClass("fq").removeClass("liubiao");
		$("#kjProcessSpan").html('<span class="fq" style="width: 100%;"></span>');
		$("#cpbuy_info").hide();
		$("#returnProcessSpan").html('<span class="fq" style="width: 90%;"></span>');
		$("#process").html("派奖中<i></i>").css("left","555px");
		
		break;
	case 12://已派奖12
		$("#cp_full").addClass("fq").removeClass("liubiao");
		$("#cp_kj").addClass("fq").removeClass("liubiao");
		$("#cp_pj").addClass("fq").removeClass("liubiao");
		$("#process").html("已派奖<i></i>").css("left","598px");
		$("#cpbuy_info").hide();
		$("#returnProcessSpan").html('<span class="fq" style="width: 100%;"></span>');
		$("#kjProcessSpan").html('<span class="fq" style="width: 100%;"></span>');
		break;
	default://发起0
		$("#cp_jindu").css("width","20%");
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
	if(ifile==0){
//		$("#pro_gg").html('<p id="pro_gg" class="p_2p">选择场次：&nbsp;&nbsp; <b class="red">'++'</b>场&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;过关方式： <b class="red">'++'</b></p>');
		$("#cp_guoguan").html($_sys.showcode(lotid,ccodes).split('|')[($_sys.showcode(lotid,ccodes).split('|').length)-1]);
		$("#cp_changci").html($_sys.showcode(lotid,ccodes).split(',').length)
	}
//	$("#ccodes").html($_sys.showcode(gameid,ccodes));
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
				var cp_istate =Y.getInt(r.istate);//方案状态
				var myjoinhtml='';
			
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
						var amoney = rt.amoney;// 认购金额
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						
						myjoinhtml += '<span>';
						myjoinhtml += buydate.substr(5,11)+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
						myjoinhtml += parseFloat(bmoney).rmb(true) ;
				
						if(o==0&&iscancel&&cnickid==nickid&&cancel==0&&(cp_istate==1||cp_istate==0)){
							myjoinhtml +='<a onclick="return main_return_confirm();" href="javascript:void(0);">我要撤单</a>'
						}else{
							myjoinhtml += cancel==0?(iscancel?(cnickid==nickid?'&nbsp':'<a href="javascript:void(0);" onclick="user_return_confirm(\''+buyid+'\')" class="a1">撤资</a>'):'&nbsp;'):(cancel==1?'<em>本人撤销</em> ':'<em>系统撤销</em>');
						}
						if(amoney>0){
							myjoinhtml += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font  class="fontred">' + parseFloat(amoney).rmb(true) + '</font>';
						}
//						<span>03-11 14:32 4元（100%）<a href="#">方案撤单</a></span>
						myjoinhtml += ' </span>';
					
						mynickid=nickid;
					});
				}
				
				if (mynickid==""){
					
					$("#myjoin").hide();
				}else{
					$('#myjoin div').html(myjoinhtml).parent().show();
				}
				
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
			var canceldate=""
			if (code == "0") {
				var r = obj.Resp.row;
				var myjoin = obj.Resp.myjoins;
				
				var myjoinhtml='<thead><tr><td>序号</td><td>用户名</td><td style="width: 20%">认购金额</td><td style="width: 16%">购买时间</td><th class="nobl">操作</td></tr></thead>';
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
				var clearedate=r.clearedate;
				var bonus = r.bonus;// 总奖金
				var tax = r.tax;// 税后奖金
				var owins = r.owins;// 发起人提成奖金
				var ireturn = r.ireturn;// 是否派奖（0 未派奖 1 正在派 2 已派奖）
				var retdate = r.retdate;// 派奖时间
				var aunum = r.aunum;// 金星个数(发起方案时的银星数)
				var agnum = r.agnum;// 银星个数(发起方案时的银星数)
				var cname = r.cname;
				var source = r.source;// 方案来源
			
				Class.C("caststate", icast);
				$("#shbd").hide();
				if(itype == '0'){
////					$('#num_width_change').css({width: "683px"});
////					$('#p_share h3').hide();
//					$('#buy_yonghu h5').html("认购用户");
////					$('#buy_yonghu p').hide(); 
					if(icast<3){
						var fullhtml='<div><div class="hm_rpxq"> <p class="hmreson"><strong>出票中</strong><br/>&nbsp;&nbsp;</p></div></div>';
						$("#cp_status").html(fullhtml);
					}
					$("#buyagain").show(); //确认代购 再次认购
					$("#cm_u_set").hide(); //定制跟单
					$("#cp_xc , div.xqtab1 , #myjoin , #cp_tc , #cp_ticheng  ,#cp_trinfo2").remove(); //方案宣传
					
//					$('#fqrcd').remove(); //方案撤单
//					$("#copystr").hide();//复制方案
//					$('#faxc_tr').hide();
////					$("#cp_tc , #cp_bd").html("-");
//					$('#one1').hide(); //认购人数
//					
//					$(".hm_top_1").next().html("").attr("class","k3_hq");
//					$("#one2").hide();
//					var dghtml='<h3>购买信息</h3> <div class="k3_h_a"><div><span>方案发起人</span><p><strong id="cm_u_name"></strong></p></div><div><span>投注内容</span><p><em >'+mulity+'</em>倍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总金额<em id="tmoney"></em>元</p><s id="res_dg"></s></div></div>'
//					$(".hm_top_1").next().html(dghtml);
					
				}
				$("#cp_biaoti").html(typeof cdesc == "undefined"?"":"方案标题："+cname);
				$("#cp_miaoshu").html(typeof cname == "undefined"?"":"方案描述："+cdesc);
				var iscancel=false;
				if ((nums-lnum+pnum)/nums<0.8){					
					iscancel=true;
				}
				var ccodehtml="";
				var fs=ifile == 0 ? "复式" : "单式";
				var buy_zj="未开奖";
				if(source==10){
					upload=1;
//					fs="过滤"
				}
				
				if (award=="2"){
					$("#operate2").hide();
				if (bonus > 0) {
					buy_zj="<strong>已中奖</strong>";
				}else{buy_zj="未中奖";}}
				if(isNaN(myjoin)){
					myjoin=myjoin.myjoin;
					if(!this.isArray(myjoin)){myjoin=new Array(myjoin);}
					myjoin.each(function(rt,o) {
						var buyid = rt.buyid;// 购买编号
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						canceldate=rt.canceldate; //撤单时间
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
//						var source = rt.source;// 方案来源
						myjoinhtml += '<tr>';
						myjoinhtml += ' <td>' + (o+1) + '</td>';
						myjoinhtml += ' <td>' + nickid + '</td>';
						myjoinhtml += ' <td><em>' + parseFloat(bmoney).rmb(true) + '<em></td>';
						myjoinhtml += '<td>' + buydate + '</td>';
						myjoinhtml += '<td>';
						var jd=(onum*100/tmoney)+jindu<80;
						if(jd&&o==0&&cnickid==nickid&&cancel==0&&(istate==1||istate==0)){
							myjoinhtml +='<input type="button" t="btncd" value="我要撤单" onclick="return main_return_confirm();" class="link_cz">'
						}else{
							myjoinhtml += cancel==0?(iscancel?(cnickid==nickid?'--':'<a href="javascript:void(0);" onclick="user_return_confirm(\''+buyid+'\')" class="a1">撤资</a>'):'--'):(cancel==1?'本人撤资 ':'系统撤销');
						}
					
						myjoinhtml += ' </td>';
						myjoinhtml += ' </tr>';
						mynickid=nickid;
						if(source=="9"){
							$("#yhdetail").show();
						}else if(source=="10"){
							jcexy=true;
						}
						
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
				$("#lnum").val(lnum);
				$("#lotid").val(lotid);
				$("#projid").val(projid);
				$("#pnum").val(pnum);
				$("#smoney").val(smoney);
				$("#pmoney").val(parseFloat(smoney*lnum));
				$("#tmoney").val(tmoney);
				
				
				var qihao = '';
				if(lotid>=90 || lotid ==70 || lotid ==71){
				    qihao = $_sys.getlotname(gameid) +"  ";
				}else{
				    qihao = $_sys.getlotname(gameid) + "&nbsp;第<b>" + periodid + "</b>期&nbsp;";	
				}
				$(" [mark=cp_beishu]").html('<em>'+mulity+'</em>');
				$("#cp_beishu").html(mulity);
				$("#buy_qh").html(periodid);
				if((gameid=="03" || gameid=="53")&&ifile == 1){
					qihao += play == 1 ? "直选" : play == 2 ? "组三" : play == 3 ? "组六" : "";
				}else if(gameid=="50"){
					qihao +=ccodes.split(';')[0].split(':')[1]==2? "追加" : "";
				}
				qihao += ifile == 0 ? "复式" : "单式";
				qihao += itype == 0 ? "代购" : "合买";
//				$("#lotlogo").html('<em class="'+$_sys.getlotlogo(gameid)+'"></em>');
				$("#topinfo").html('<h1>'+qihao+'&nbsp;&nbsp;<span>(编号：'+projid+')</span></h1><p>发起时间：' + adddate + ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;截止时间：' + endtime +'</p>');
//				$("#cm_u_info").html('<div class="leftfloat color6"><strong class="f14" >'+$_sys.showzhanjiname(gameid,cnickid,'award')+'</strong>'+($_sys.showzhanji(aunum,agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,cnickid,aunum,agnum)+'&nbsp;&nbsp;')+$_sys.showlishizhanji(gameid,cnickid,'award')+'</div>'+

				var xq=Y.getDate(adddate).getDay();
				var week;
				if(xq==1){
					week="星期一";
				}else if(xq==2){
					week="星期二";
				}else if(xq==3){
					week="星期三";
				}else if(xq==4){
					week="星期四";
				}else if(xq==5){
					week="星期五";
				}else if(xq==6){
					week="星期六";
				}else if(xq==0){
					week="星期日";
				}
				
				$("#fq_time").html(Y.getDate(adddate).format('MM-DD hh:mm:ss'));
				var cp=0;
				if(icast==3 && istate<3  ){
					cp=1;
					$("#cp_time").html(Y.getDate(castdate).format('MM-DD hh:mm:ss'));
					
					if(award <2){
						if(istate==2){
							var fullhtml='<div><div class="hm_rpxq"> <p class="hmreson"><strong>已出票待开奖</strong><br/>('+Y.getDate(castdate).format('MM-DD hh:mm:ss')+')</p></div></div>';
							$("#cp_status").html(fullhtml);
						}
						
					}
				
				}else{
					$("#cp_time").html("&nbsp;");
				}
				
				if(itype != '0'){
				$("#pnum").val((pnum==0?'未保底':((parseFloat(pnum*smoney).rmb(true))+''+((isself&&istate=="1")?'':'')+(iclear=='2'?' ':''))));
				}
				
				if(pnum == 0){
					$("#baodi_rengou").hide();
				}else if(isself&&istate=="1"){
					
					$("#baodi_rengou").show();
				
				}

				Y.get('#bdrgmoney').keyup(function(){
					
				
					var baodimoney = Y.one('#bdrgmoney').value;   //认购总金额
					if(baodimoney>0){
						if(baodimoney>pnum*smoney){
							$("#bdrgmoney").val(pnum*smoney);
						}
						
					}
					Y.one('#bdrgScale').innerHTML = ($("#bdrgmoney").val()/(pnum*smoney)*100).toFixed(2);
					
				}); 
				$("#bdrg_btn").click(function(){

//					var allnumber =  Y.one('#allnumber').value;  //方案总金额
//					var snumber = Y.one('#lnum').value;  //
					var limitnum = Math.ceil(nums*0.05);  //方案总金额	
//					var onemoney = Y.one('#onemoney').value; //每份金额
					var baodimoney = Y.one('#bdrgmoney').value; 
					var yumoney = parseFloat(lnum*smoney);
					var zumoney = parseFloat(nums*smoney);
					var limitmoney = parseFloat(limitnum*smoney);
					
					var sensale = yumoney/zumoney*100;
					var errorinfo = '';
					
					if(baodimoney == ''){
						errorinfo = "保底金额不能为空！";
						Y.getTip().show('#bdrgmoney','<h5>'+errorinfo+'</h5>').setIco(7);
						return false;
					}
					
					if(baodimoney <= 0){
						errorinfo = "保底金额必须为大于1的整数！";
						Y.getTip().show('#bdrgmoney','<h5>'+errorinfo+'</h5>').setIco(7);
						return false;
					}
					
					if(Y.getInt(baodimoney) > yumoney){
						errorinfo = "保底金额不能大于剩余金额！";
						Y.getTip().show('#bdrgmoney','<h5>'+errorinfo+'</h5>').setIco(7);
						return false;
					}

//					Y.getTip().hide();	

				    Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
				    
				    Y.ajax(
				    	    {
				    	    	url : $_trade.url.pb2g,
				    	        type:'POST',
				    	        data:{
				    	        	gid:lotid,
				    	        	hid:projid,
				    	        	bnum:baodimoney
				    	        },
				    	        end:function(d)
				    	        {
				    	        	Y.alert.close();        	
				    	        	var obj = eval("(" + d.text + ")");
				    	   		    var code = obj.Resp.code;
				    	   		    var desc = obj.Resp.desc;
				    				if (code == "0") {
				    					//重新初始化刷新UI
				    					Y.alert("保底转认购成功");
				    					setTimeout( function(){  top.location.reload();}, 2000);		
				    					                        
				    				} else {
				    					 Y.alert('对不起，保底失败,请重新保底！'+desc);
				    				}    
				    	           
				    	        },
				    			error : function() {
				    				Y.alert("网络故障, 请检查您的帐户再重新投注!");
				    				return false;
				    			}       
				    		});

				})
				
				
				
				
//				var iopen = r.iopen;// 是否保密 （0 对所有人公开 1 截止后公开 2 对参与人员公开// 3 截止后对参与人公开）
				
				var cptype = ["对所有人公开","截止后公开","对参与人员公开","截止后对参与人公开"]
				var cpstate = ["禁止认购","认购中","已满员","过期未满撤销","本人撤销","已出票","已派奖"]
//				var istate = r.istate;// 状态(0 禁止认购 1 认购中,2 已满员 3过期未满撤销 4主动撤销 5已出票 6 已派奖)
			
				
			
	
		
				var baodistat="";
				if(onum+pnum==tmoney){
						baodistat=jindu+"%"+"+"+(+"+"+pnum!=0 ? ((100-parseInt(onum*100/tmoney))+'%(保)'+(iclear=='2' ? '&nbsp;&nbsp;已清' : '')) : '&nbsp;');
					}else{
						baodistat=jindu+"%"+(pnum!=0 ? "+"+((parseInt(pnum*100/tmoney))+'%(保)'+(iclear=='2' ? '&nbsp;&nbsp;已清' : '')) : '&nbsp;');
					}
				$("#cp_ticheng").html((wrate==0?'无提成':wrate+'%'))
//				var cp_info =' <tr class="tr1"><td colspan="3">'+$_sys.showzhanjiname(gameid,cnickid,'award')+'</td>'
////				<td>奖金范围：<em>￥00.00-00.00</em> </td>
//					+' <tr><td>方案总金额：<em>'+parseFloat(tmoney).rmb(true)+'</em></td>'
//					+'<td> 方案保底：'+baodistat+' 　</td></tr>'
//					+'	<tr><td>发起人认购：￥'+onum +'('+parseInt(onum*100/tmoney)+'%) </td><td><b onclick="baoditorg()" id="baodi_rengou" style="display: none;">保底转认购</b><b style="display: none;" id="shbd" >方案保底</b><b id="cm_u_set">定制更单</b></td></tr>';
//				$("#cpinfo").html(cp_info);
				$("#username").html($_sys.showzhanjiname(gameid,cnickid,'award'));
				$("span[mark=cp_baodi]").html(baodistat);
				$("span[mark=cp_jindu]").html(pnum!=0 ?'￥'+pnum+"("+ ((parseInt(pnum*100/tmoney))+'%)') : '&nbsp;无保底');
				$("span[mark=cp_rengou]").html('￥'+onum +'('+parseInt(onum*100/tmoney)+'%) ');
				if(isself ){
					$("#cm_u_set").remove();
					if(lotid==01){
						
						$("#buyagain").attr("href","/shuangseqiu/index.html?projid="+projid).show();
					}
					if(lotid==50){
						$("#buyagain").attr("href","/daletou/index.html?projid="+projid).show();
					}
				}
					$("#cm_u_set").click(function(){
						$_sys.autobuy(gameid,cnickid);
					});
				$("#cp_money ,em[mark=cp_money]").html(tmoney);
				var processmoney=(Math.ceil(nums*((90-jindu)/100))-pnum);
//				(nums*0.9)
//				(nums*0.9)
				processmoney=processmoney>0?processmoney:'';
				var process=0;

				process=(191*jindu/100+40);
				
				$("#cp_jindu").css("width",jindu+"%");
				$("#cp_baodi").css("width",(pnum/tmoney*100)+"%");
				loadtime(endtime);
				mark(icast,award,ireturn,istate,adddate,castdate,awarddate,retdate,process,processmoney,upload);
				
			
				$("#fqrcd").hide();
				$("#scfa").hide();
				if (upload=="0" &&source!=10){
					if (((pnum==0&& (istate=="0" || istate=="1"|| istate=="2"))||(pnum!=0 && (istate=="1"|| istate=="2") )) && isself){
						$("#scfa").show();
						$("#cp_infotable").html('<p class="xqtbpa"><a id="scfa" target="_blank">上传方案</a></p>');
						if(lotid==90 ||lotid==91 ||lotid==92 ||lotid==93||lotid==72){
							$("a#scfa").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
							
						}else if(lotid==94 ||lotid==95 ||lotid==96 ||lotid==97){
							$("a#scfa").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
						}else if(lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89){
							$("a#scfa").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
							
						}else{
//							$("#scfa").html('<s>您的方案未上传请及时上传</s><a href="javascript:void (0);" onclick="Y.openUrl(\'/game/hsc.html?lotid='+gameid+'&projid='+projid+'\',582, 274);" ></a>');
//							$("a#scfa").click(function(){
//								var _dsalert = Y.lib.MaskLay('#ds_dlg', '##ds_dlg_close', '#ds_dlg_content');
//								_dsalert.addClose('#ds_dlg_close');
////						        Y.get('#ds_dlg .tan_top').drag('#ds_dlg');
//						        _dsalert.pop();
//							})
							
							$("a#scfa").click(function(){
								Y.openUrl('/game/hsc.html?lotid='+gameid+'&projid='+projid,582, 270);
							})
						}
						
					}else{
						ccodehtml ='未上传';
					}
					var prohtml='<colgroup><col width="100" /><col width="220" /><col width="110" /><col width="80" /><col width="80" /><col width="100" /><col width="" /></colgroup><thead><tr>';
					prohtml += '<td>第<strong >'+periodid+'</strong>期</td><td>投注内容</td><td>方式</td><td>倍投</td><td>注数</td><td>开奖结果</td><td>发起时间</td></tr></thead>';
					prohtml += '<tr><td>1</td><td id="buy_codes"><div class="buy_codes"><div id="max_height">未上传</div></div></td><td>'+fs+'</td><td>'+mulity+'</td><td>'+parseInt(nums/smoney/2)+'</td><td>'+buy_zj+'</td><td>' + adddate + '</td></tr>';
					if(source==10){
						
					}else if(istate==3||istate==4){
//						if((istate) (lotid==80 ||lotid==81 ||lotid==82 ||lotid==83))
						$("#cp_infotable").html('<p class="xqtbpa">发起人未上传</p>')
						$("#buy_info").html(prohtml);
					}else if(!isself){
						$("#cp_infotable").html('<p class="xqtbpa">等待发起人上传方案</p>')
						$("#buy_info").html(prohtml);
					}
				
				
				}else{
					if (ccodes=='' &&source!=10){
						$('#see_duizhen').hide();
						$("#operate2").hide();
					
						
						$("#cp_infotable").html('<p class="xqtbpa">'+$_sys.iopen[Y.getInt(iopen)]+'</p>')
					
			                 
					}else{
						if (ifile=="0"){
							//北单竞彩显示对阵
							if(lotid==70 ||lotid==72 ||lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89 || lotid==90 ||lotid==91 ||lotid==92 ||lotid==93){
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
								ccodehtml =$_sys.showcode(gameid,ccodes,$_cache.qcode(gameid, periodid));
							}
						}else if(ifile=="1"){
							if(lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89 || lotid==90 ||lotid==91 ||lotid==92 ||lotid==93 ||lotid==72){
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
							}else if(lotid == 70 ){
								showduizhen(lotid,periodid,projid,"0",ccodes,cp);
							}else{
								ccodehtml ='方案已传，请点击右下角下载';
								$("#operate").attr("href",'/cpdata/pupload/'+(lotid<10? '0' + parseInt(lotid) : parseInt(lotid))+'/'+periodid+'/'+ccodes+'').show();
							}
						}	
					var prohtml='<colgroup><col width="100" /><col /><col width="100" /><col width="120" /><col width="80" /></colgroup><thead><tr class="tr1">';
					prohtml += '<td>第<strong >'+periodid+'</strong>期</td><td>投注内容</td><td>方式</td><td>倍投</td><td>中奖情况</td></tr></thead><tbody class="buy_codes"><div id="max_height">';
					
					if(lotid<=7 && lotid !=4|| lotid>=50 &&lotid<80 && lotid !=54&& lotid !=56){
					var codelen=ccodehtml.split("<br/>").length;
					if(lotid ==1&&isself ||lotid ==50 && isself){
						$("#buyagain").attr("href",""+$_sys.getlotdir(lotid)+"?projid="+projid+"").show();
					}
					for(var i=0;i<codelen;i++){
						var rednum=ccodehtml.split("<br/>")[i].split("cm_red").length-1;
						var bluenum=ccodehtml.split("<br/>")[i].split("blue").length-1;
						var rb=award=="2"?"中"+rednum+"+"+bluenum:"--";
						if(ifile=="1"){
							rb=award=="2"?bonus >0?'<em>已中奖</em>':'未中奖':'未开奖';
							prohtml +='<tr><td>'+(i+1)+'</td><td>'+ccodehtml.split("<br/>")[i]+'</td><td>'+fs+'</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
						}else {
							if(lotid==50){
								rb=rednum>=3?'<em>'+rb+'</em>':bluenum>=2?'<em>'+rb+'</em>':rednum==2&&bluenum==1?'<em>'+rb+'</em>':rb;
							}else if(lotid==1){
								rb=rednum>3?'<em>'+rb+'</em>':bluenum>=1?'<em>'+rb+'</em>':rb;
							}else{
								rb=rednum>3?'<em>'+rb+'</em>':rb;
							}
						
							if(i>9){
								$("#oshow").show();
								prohtml +='<tr><td>'+(i+1)+'</td><td>'+ccodehtml.split("<br/>")[i]+'</td><td>'+fs+'</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
							}else{
								if(ccodes.split(';')[0].split(':')[1]==2){
									prohtml +='<tr><td>'+(i+1)+'</td><td>'+ccodehtml.split("<br/>")[i]+'</td><td>追加</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
								}else{
									prohtml +='<tr><td>'+(i+1)+'</td><td>'+ccodehtml.split("<br/>")[i]+'</td><td>'+fs+'</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
								}
								
									}
								}
							}
							
						}else if(lotid =="54" ||lotid =="04" || lotid =="56"){
							var rb=award=="2"?bonus >0?'<em>已中奖</em>':'未中奖':'未开奖';
							prohtml +='<tr><td>1</td><td>'+ccodehtml+'</td><td>'+fs+'</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
					}else{
						if(lotid==98){
							prohtml='<colgroup><col width="100" /><col width="120" /><col width="100" /><col width="100" /></colgroup><thead><tr class="tr1">';
							prohtml += '<td>第<strong >'+periodid+'</strong>期</td><td>球队</td><td>倍投</td><td>中奖情况</td></tr></thead><tbody class="buy_codes"><div id="max_height">';
							var teams = ccodes.replace("GJ|"+periodid+"=","").split("/");
							var str = award=="2"?bonus >0?tax:'未中奖':'未开奖';
							for(var i=1;i<=teams.length;i++){
							if(i==1){
							prohtml +='<tr ><td>'+i+'</td><td>'+$_sys.getteamname(teams[i-1])+'</td><td>'+mulity+'</td><td rowspan='+teams.length+'>'+str+'</td></tr>';
							}else{
							prohtml +='<tr '+(i%2==0?"class=odds":"")+'><td>'+i+'</td><td>'+$_sys.getteamname(teams[i-1])+'</td><td>'+mulity+'</td></tr>';
							}
							}
							}
							if(lotid==99){
							prohtml='<colgroup><col width="100" /><col width="120" /><col width="100" /><col width="100" /></colgroup><thead><tr class="tr1">';
							prohtml += '<td>第<strong >'+periodid+'</strong>期<td>球队</td><td>倍投</td><td>中奖情况</td></tr></thead><tbody class="buy_codes"><div id="max_height">';
							var teams = ccodes.replace("GYJ|"+periodid+"=","").split("/");
							var str = award=="2"?bonus >0?tax:'未中奖':'未开奖';
							for(var i=1;i<=teams.length;i++){
							if(i==1){
							prohtml +='<tr><td>'+i+'</td><td>'+$_sys.getteamname2(teams[i-1])+'</td><td>'+mulity+'</td><td rowspan='+teams.length+'>'+str+'</td></tr>';
							}else{
							prohtml +='<tr '+(i%2==0?"class=odds":"")+'><td>'+i+'</td><td>'+$_sys.getteamname2(teams[i-1])+'</td><td>'+mulity+'</td></tr>';
							}
							}
							} 
					}
					if(lotid>=88 || lotid==70 || lotid==72 ){
//						html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
						if(Class.C("caststate") == 3){
						$("#operate3").click(function(){
						billcode(lotid,projid);
						}).show();
						//.html("<a href='javascript:void(0);'class='f_a_d' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细<a>").show();
						
						}
					}
					prohtml +='</div></tbody>';
					if(lotid==50 &&ccodes.split(';')[0].split(':')[1]==2)
					{
						$("#zhushu").html(parseInt(nums/smoney/3)+"注&nbsp;&nbsp;<b>追加</b>");
					}else{
						$("#zhushu").html(parseInt(nums/smoney/2)+"注");
					}
					
					$("#buy_info").html(prohtml);
					
					}
				}
					
				if (award=="2"){
					var wininfostr="";
					var showres="";
					var istatehtml="";
					if (bonus > 0) {
						$("#res_dg").addClass("yzj");
						if(istate==3){
							istatehtml='<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未满员系统撤单</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> <p class="pxq" id="guoguan_tr">'
									+'</p></div></div>';
//							$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
							$("p[mark=cp_countDownSpan]").html("");
						}else if(istate==4){
								istatehtml='<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>发起人已撤单</strong><br/>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> <p class="pxq" id="guoguan_tr">'
							+'</p></div></div>';
//								$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
								$("p[mark=cp_countDownSpan]").html("");
						}else if(istate==5){
//							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">系统撤单，方案&nbsp;<strong>未上传</strong></p>');
							istatehtml='<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>发起人已撤单</strong><br/>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> <p class="pxq" id="guoguan_tr">'
								+'</p></div></div>';
//							$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
							$("p[mark=cp_countDownSpan]").html("");
						}else{
							$("#kj_tc").html(parseFloat(owins).rmb(true));
							if(itype==1&&istate!=3&&istate!=4){$("#kj_mf").html(parseFloat((tax-owins)/nums).rmb(true));}
							if(lotid>=85 && lotid<90 && r.addmoney>0){wininfostr += "已含加奖金额：<font color=#990000>" + parseFloat(r.addmoney).rmb(true) +"</font>.";}
//							showres='<span class="x_g_b"></span><b></b><p class="zj_p">'+((itype == '0')?"代购":"合买")+'成功，<font>已中奖</font><br>本次共中金额 <font>' + parseFloat(bonus).rmb(true) +'</font> 元</p>';
							istatehtml='<div style=""><div class="hm_rpxq"><p class="hmreson"><strong ><font class="fontred" style="font-size:24px">已中奖</font></strong><br/>('+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+')</p> <p class="pxq" id="guoguan_tr">'
								+'</p></div></div>';
//							$("p[mark=cp_countDownSpan]").html('<b class="cur">'+((itype == '0')?"代购":"合买")+'成功</b>');
							$("p[mark=cp_countDownSpan]").html("");
						
						
						}
						var zj = $_sys_getnewwininfo(gameid, wininfo);
						for ( var i = 0; i < zj.length; i++) {
							wininfostr +=  zj[i][0] + zj[i][1] ;
						}
						var ticheng=itype==0?"":'发起人提成：'+ ( (bonus>0)?'<em>'+parseFloat(owins).rmb(true)+ '</em>':"--");
						wininfostr +='方案总奖金：<em>'+parseFloat(tax).rmb(true)+'</em>(税后)<br>'+ticheng;
					
					
						
						$("#cp_status").html(istatehtml);
					
					}else{
						
					$("#yorn").addClass("cur");
					$("#res_dg").addClass("wzj");
					}
					var k_o_c = $_cache.qcode(gameid, periodid);
					if(k_o_c == '' || k_o_c == undefined){
					
					}else{
						
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
								html+=' <b>'+red[i]+'</b>';
							};
						}else{
							var codelen=code2.split(",").length;
						
							for(var i=0;i<codelen;i++){
								html+='<b>'+code2.split(",")[i]+'</b>';
							}
							
							
						}
			
						if(lotid<80){
							$("#cawardcode").html("<i>开奖号码：</i>"+html).show();
						}
						
						}
					var zj = $_sys_getnewwininfo(gameid, wininfo);
					if (lotid==85||lotid==86||lotid==87||lotid==88||lotid==89
							||lotid==90
							||lotid==91
							||lotid==92
							||lotid==93||lotid==94||lotid==95||lotid==96||lotid==97||lotid==70||lotid==71||lotid==72
							){
					
//						for ( var i = 0; i < zj.length; i++) {
//							wininfostr += zj[i][0] + zj[i][1];
//						}
					}else{
//						wininfostr +="<td>";
						if(zj.length>0){
//							for ( var i = 0; i < zj.length; i++) {
//								wininfostr +=zj[i][0] + "&nbsp;<i class=red>"+zj[i][1]+"</i>注";
//							}	
						}else{
//								wininfostr +="未中奖"
						}
//						wininfostr +="</td>";
					}
				
//					wininfostr += "<td class=red>" + parseFloat(bonus).rmb(true) +"</td>"; 
//					wininfostr += "<td class=red>" +   +"</td>" ;
//					wininfostr += "<td>" + ( (bonus>0)?"<i class=red>"+parseFloat(owins).rmb(true)+ "</i>":"--")+"</td>"; 
//					wininfostr += "<td>" +  ((bonus>0)?"<i class=red>"+ parseFloat((tax-owins)/nums).rmb(true) + "</i>":"--")+"</td>"; 
					 
//					 <em>12,075.00</em>
//					 元（税后），发起人提成
//					 <em>966.00</em>
//					 元
//					
					$("#guoguan_tr").html((wininfostr==""||bonus<1?"":wininfostr));
//					$("#wininfo_tr").show();
					
					
				}else{
					$("#wininfo_tr").hide();
				}
				
			
				//0 禁止认购 1 认购中,2 已满员 3
				// 过期未满撤销 4主动撤销
					$("#cm_sumb").hide(); //隐藏再次认购  待实现
					$("#istate").hide();
					
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
					
						$("#cp_lnum , #cp_lnum2").html(lnum);
						
//						$("#money_rate").html((lnum/tmoney).toFixed(2)*100);
						$("#show_res").show();
						$("#cm_sumb").show();
						$("#permoney").val(1);	
						$('#permoney').click(function(){
							$(this).select();
						})
						$("#submitCaseBtn3").click(checkForm);
						
					
						
						Y.get('#permoney').keyup(function(){
							if(Y.getInt(Y.one('#permoney').value) > (lnum)) Y.need('#permoney').val(lnum);
						    var buymoney = Y.one('#permoney').value;      //方案金额
						});
						
					}else if (istate=="2" && bonus ==0 ){					
						if(itype==0){
							$("#cp_status").html(award ==0?'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>待开奖</strong><br>'+(castdate==""?"":"("+Y.getDate(castdate).format('MM-DD hh:mm:ss')+")")+'</p> </div></div>':'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未中奖</strong><br>('+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
						}else{
							if(castdate==""||castdate===undefined){
								$("#cp_status").html(award ==0?'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>已满员</strong><br></p> </div></div>':'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未中奖</strong><br>('+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
							}else{
								$("#cp_status").html(award ==0?'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>已满员</strong><br>('+Y.getDate(castdate).format('MM-DD hh:mm:ss')+')</p> </div></div>':'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未中奖</strong><br>('+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
							}
							
						}
						$("p[mark=cp_countDownSpan]").html("");
						
					}else if (istate=="3" ){ //该方案系统已撤单
//						$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
						$("p[mark=cp_countDownSpan]").html("");
						if(bonus ==0){
							$("#cp_status").html('<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>系统已撤单</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
						}else if(award !="2"){
							
							$("#cp_status").html('<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未满员已撤单</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
						}
					}else if (istate=="4" ){ //发起人已撤销该方案
//						$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
						$("p[mark=cp_countDownSpan]").html("");
						if(bonus ==0){
						$("#cp_status").html(award ==0?'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>发起人已撤单</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> </div></div>':'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>未中奖</strong><br>('+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
						}else if(award !="2"){
							
							
						}
					}else if (istate=="5"){ //系统已撤销该方案
//						$("p[mark=cp_countDownSpan]").html("<b>方案流产</b>");
						$("p[mark=cp_countDownSpan]").html("");
						if(bonus ==0){
						$("#cp_status").html(award ==0?'<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>系统已撤销</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> </div></div>':'awarddate');
						}else if(award !="2"){
							$("#cp_status").html('<div style=""><div class="hm_rpxq"><p class="hmreson"><strong>系统已撤销</strong><br>('+Y.getDate(clearedate).format('MM-DD hh:mm:ss')+')</p> </div></div>');
						}
					}
//					
				
				//发起人撤单
				
				if (isself&&iscancel&(istate=="1"||istate=="0")){
					$("#fqrcd").show();	
					$("#f_oper_div").show();
				};
				if (((pnum==0&& (istate=="0" || istate=="1"))||(pnum!=0 && istate=="1" )) && isself){
					 $("#f_oper_div").show();
				}
				
				$("#txtHref").val('http://'+location.host+$_sys.getlotdir(gameid)+'project.html?lotid='+gameid+'&projid='+projid+'');
				$("#copystr").click(function(copy){
					
					copyurl('http://'+location.host+$_sys.getlotdir(gameid)+'project.html?lotid='+gameid+'&projid='+projid+'');
//					$(copy).attr("data-help","您好，请选中地址用ctrl+c复制!<br/>http://"+location.host+$_sys.getlotdir(gameid)+"viewpath.html?lotid="+gameid+"&projid="+projid+"");
				});
				var t = 'null' == cdesc ? '随缘,买彩票讲的是运气、缘分和坚持。' : cdesc;
				$("#cdesc").text(t);
				$('#one_con2').html(myjoinhtml);
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
				var myjoinhtml1='<colgroup><col width="50"><col width="150"><col width="200"><col width="170"><col></colgroup><tr  class="tr1"><td>序号</td><td>用户名</td><td >认购金额(<font class="fontred" style="font-size:14px" id="bmoneys"></font>)元</td><td >购买时间</td><td>操作</td></tr>';
				var myjoinhtml2='<colgroup><col width="50"><col width="150"><col width="120"><col width="120"><col width="170"><col></colgroup><tr  class="tr1"><td>序号</td><td>用户名</td><td >认购金额(<font class="fontred" style="font-size:14px" id="bmoneys"></font>)元</td><td>税后奖金(元)</td><td >购买时间</td><td>操作</td></tr>';
				var ct =obj.Resp.count;
				var tp=Y.getInt(ct.tp);
				var rc=Y.getInt(ct.rc);
				var pn=Y.getInt(ct.pn);
				var ps=Y.getInt(ct.ps);	
				var pmon=0;//标识方案是否有中奖信息
				var r = obj.Resp.row;		
				var i=0;
				var bmoneys=0;
				$("#cp_hmlist").html('合买用户<font class="fontred" style="font-size:14px">('+rc+')</font>人');
				if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o) {
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						var amoney = rt.amoney;// 派奖金额
						var rmoney = rt.rmoney;// 认购派奖金额
						
						pmon = rmoney>0? 1 : 0;
						bmoneys =bmoneys+ parseFloat(bmoney);
						if(pmon == 1){//未中奖
							if(cancel != 1){
								if(nickid==faqiren){nickid="<em  style='color:#E52E04'>"+nickid+"</em>";}
								myjoinhtml += '<tr>';
								myjoinhtml += '<td>' + ((pn-1)*ps+(o+1))+ '</td>';
								myjoinhtml += '<td>' + nickid + '</td>';
								myjoinhtml += '<td>' + parseFloat(bmoney).rmb(true) + '</td>';
								
								if(rmoney>0){
									myjoinhtml += '<td>' + parseFloat(amoney).rmb(true) + '</td>';
								}
								myjoinhtml += '<td>' + buydate + '</td>';
								myjoinhtml += '<td>';
								myjoinhtml += cancel==0?(' --&nbsp;'):(cancel==1?'本人撤销 ':'系统撤销');
								myjoinhtml += '</td>';
								myjoinhtml += '</tr>';
								i++;
							}
						}else{
							
								if(nickid==faqiren){nickid="<em style='color:#E52E04'>"+nickid+"</em>";}
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
					});
					
					
				if(pmon==0){
					myjoinhtml=myjoinhtml1+myjoinhtml;
				}else{
					myjoinhtml=myjoinhtml2+myjoinhtml;
						
				}
				if (i==0){
					myjoinhtml='<tr><td colspan="5">暂时没有认购信息</td></tr>';
				}else if (tp>1){
					var maxshow=5;
					var pagehtml='<ul><li  style="line-height:27px;color:#444;padding-right:10px">共'+rc+'条</li><li class="disabled PagedList-skipToFirst"  onclick="showjoin(\''+lotid+'\','+projid+','+ps+',1)" ><a>首页</a></li>';
					pagehtml += '<li class="PagedList-skipToNext"><a onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn-1>0?(pn-1):1)+')" href="javascript:void(0)">上一页</a></li>';
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
					pagehtml+='<li class="active"><a href="javascript:void(0);" id="'+i+'" class="a4" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+i+')">' + i + '</a></li>';
					}else{
						pagehtml+='<li><a href="javascript:void(0);" id="'+i+'" class="a3" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+i+')">' + i + '</a></li>';
					}
					}
					
					pagehtml+='<li class="PagedList-skipToNext"><a onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn+1>tp?tp:(pn+1))+')"  href="javascript:void(0)">下一页</a></li><ul>';
				    $('#pagediv').html(pagehtml);	
					

				   
				    if(pn==min&&min-maxshow>0){
				    	
				    	$("#"+pn+"").click(function(){
				    		P.showlist(pn-maxshow>=0?(pn-maxshow):maxshow,ps,tp,tr);
				    		showjoin(lotid,projid,ps,pn-maxshow>=0?(pn-maxshow):maxshow);
				    	})
				    	}else if(min-maxshow==0){
				    	$("#"+pn+"").click(function(){
				    		showjoin(lotid,projid,ps,1);
				    	})
			    	} 
				    $("#govalue").val(pn);
					
					$('#pagediv').show();
				}
				$('#one_con1').html(myjoinhtml);		
				$("#bmoneys").html(bmoneys);
			}
		}
	});	
};
//北单竞彩显示对阵
showduizhen =function (lotid,expect,projid,type,codes,cp){
	var mdata = [];
	var matchdata = [];	
	Y.ajax({
		url : "/cpdata/guoguan/" + lotid + "/" + expect + "/proj/" + projid.toLowerCase() + ".json",
		type : "GET",
		dataType : "json",
		cache : false,
		end : function(d) {
			var obj = eval("(" + d.text + ")");
			var ggstr="";
			var ggstr2="";
			
			if(lotid == 70){//混投
				var spfstr=["3","1","0"];
				var jqsstr=["0","1","2","3","4","5","6","7"];
				var bqcstr=["3-3","3-1","3-0","1-3","1-1","1-0","0-3","0-1","0-0"];
				var cbfstr=["1:0","2:0","2:1","3:0","3:1","3:2","4:0","4:1","4:2","5:0","5:1","5:2","9:0","0:0","1:1","2:2","3:3","9:9","0:1","0:2","1:2","0:3","1:3","2:3","0:4","1:4","2:4","0:5","1:5","2:5","0:9"];
				var dzhtml="";
				if(jcexy){
				    	dzhtml += '<colgroup><col width="100"><col /><col width="120"><col width="120"><col width="120">';
						dzhtml += '<col width="80"></colgroup>';
						dzhtml += '<thead><tr class="tr1"><th >场次</td>';
					
					    dzhtml += '<th >主队 VS 客队</td>';
				    	dzhtml += '<th >二选一投注选项</td>';
					    dzhtml += '<th >实际投注选项</td>';
					    dzhtml += '<th >彩果</td>';
					    dzhtml += '</tr><tr><th>玩法</td><th>投注选项</td></tr></thead><tbody>';
				    }else{
				    	dzhtml += '<colgroup><col width="60"><col width="220"><col width="70"><col width="94"><col/>';
						dzhtml += '<col width="55"></colgroup>';
						 dzhtml += '<thead><tr class="tr1"><td>场次</td>';
						
						    dzhtml += '<td>主队 VS 客队</td>';
						    dzhtml += '<td>比分</td>';
						    dzhtml += '<td>玩法</td>';
						    dzhtml += '<td>投注选项</td>';
						    dzhtml += '<td>彩果</td>';
						   
						    dzhtml += '</tr></thead><tbody>';
				    }
				   
					
					
				   
				  
				   
					
					var odd="";
					var r = obj.items.item;		
					var wk=["日","一","二","三","四","五","六"];
					$("#cp_changci").html(r.length);
					r.each(function(rt,o) {
						odd=o%2==0?"":"tr1";
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
						if(type !=1){
							var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
							
							dzhtml += '<tr class='+odd+'>';
							dzhtml += '<td rowspan=5>周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
							
							
//							dzhtml += '<td rowspan=4>'+bt+'</td>';
							dzhtml += '<td rowspan=5>'+hn+'('+lose+') VS '+gn;
							if(c==0 && hsstr.length>0){
								dzhtml += '</td><td rowspan=5>'+hs+':'+vs+'</td>';
							}else{
								dzhtml += '</td><td rowspan=5></td>';
							}
							dzhtml += '</tr>';
							var result1="";
//							["140418009", "周五009_卡利斯尔联_1_沃尔索尔"]
							matchdata.push([id,'周'+wk[Y.getDate(tDATE).getDay()]+id.substr(6,3)	 + "_" + hn + "_" + lose + "_" + gn]);	
							var spvalues = spvalue.split("|");
							if(c==0){
								var spvalue = spvalues[0].split(",");
								if(hsstr.length>0){
									var rt=(hs-vs)*1;
									var hrt=(hhs-hvs)*1;
									
									if(rt*1>0){result1="3";}else if(rt*1==0){result1="1";}else{result1="0";}
								
								}else{
									result1 = "&nbsp;";
								}
							result1=result1.replace("3","胜").replace("1","平").replace("0","负");
							dzhtml +='<tr class='+odd+'><td>胜平负</td><td></td><td>'+result1+'</td></tr>';
							var bqbf = spvalues[2].split(",");
							var bqres=""
								if(hsstr.length>0){
									var hrt=(hhs-hvs)*1;
									var rt=(hs-vs)*1;
									if(hrt*1>0){bqres="3";}else if(hrt*1==0){bqres="1";}else{bqres="0";}
									if(rt*1>0){bqres=bqres+"-3";}else if(rt*1==0){bqres=bqres+"-1";}else{bqres=bqres+"-0";}
									
								}else{
									bqres = "&nbsp;";
								
								}
							dzhtml +='<tr class='+odd+'><td>半全场</td><td></td><td>'+bqres+'</td></tr>';
							var jqsp = spvalues[3].split(",");
							var jqres='';
							
								if(hsstr.length>0){
									var rt=(hs+vs)*1;
									if(rt>=7){jqres="7+";}else{jqres=rt;}
									
								}else{
									jqres = "&nbsp;";
									
								}
							dzhtml +='<tr class='+odd+'><td>总进球</td><td></td><td>'+jqres+'</td></tr>';
							var bfres="";
							var bfsp = spvalues[1].split(",");
							
								if(hsstr.length>0){
									bfres=hs+":"+vs;
									var ii=100;
									for(var r=0;r<31;r++){
										if(cbfstr[r]==bfres){ii=r;}
									}
									if(ii==100){
										if(hs>vs){bfres="胜其他";}else if(hs==vs){bfres="平其他";}else{bfres="负其他";}
									}
								
								}else{
									bfres = "&nbsp;";
									
								}
							dzhtml +='<tr class='+odd+'><td>比分</td><td></td><td>'+bfres+'</td></tr>';
							}
						//	$("#operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
						$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
							
						}else{
							var ncode = "";
							var codestr="";
							if(codes.split(";").length>1){
								 ncode = codes.split(";");
								 var bet_match=[];
								 ncode.each(function(n,m){
									 var s=m;
									 var bet =n.split(",");
									 bet.each(function(b,i){
										 if(i==0){
											 bet_match.push(b.split("|")[1]);
										 }else{
											 bet_match.push(b.split("|")[0]);
										 }
										
									 })
								 })
//				
							     var m=[],f;
							     for(var i=0;i<bet_match.length;i++){
							     f=true;
							     for(var j=0;j<m.length;j++)
							     if(bet_match[i]===m[j]){f=false;break;};
							     if(f)m.push(bet_match[i])}
							    m.sort(function(a,b){return a-b});
							    

								
							var array=m,bet ="";
							
								var i = 1;
								var ii =1;
								while(true){
									var a=b=cc=d="";
									a = array[i-1];
									b= a.split(">")[0];
								
										array.each(function(arr,t){
										cc = arr;
										if(cc){
											if(cc.indexOf(b)!=-1){
												
										
													d += cc.split(">")[1];
													ii++;
												if(cc.split(">").length)
												arr = "";
												d+="+"
											}
									
										
										}
									})
									d!=""?bet += b+">"+d:"";
									
									i++;
									if(i>array.length){
										break;
									}
								}
					   
								ncode=bet.replace(/(\d+)\+(\d+)/g,'$1,$2');
								if(ncode.charAt(ncode.length-1)=="+"){
									ncode=ncode.substr(0,ncode.length-1)+"";
								}
//							      "ccodes": "HH|140422004>RSPF=3,140422009>RSPF=0+JQS=0/1/2+CBF=1:0/0:0/1:1/0:1|2*1",
						
							}else{
								ncode = codes.split("|")[1];
						
							}
								codestr=ncode.split(",");
								var itemcodes ="";
								F:for(var n=0;n<codestr.length;n++){
									itemcodes=codestr[n];
									if(itemcodes.indexOf(id+"")>=0){
										var itemcode = itemcodes.substring(itemcodes.indexOf(">")+1,itemcodes.length).split("+");
										var ji = itemcode.length;
										var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
										if(o%2==1){odd="tr1";}
										dzhtml += '<tr class="'+odd+'">';
										dzhtml += '<td rowspan='+ji+'>周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
//										dzhtml += '<td rowspan='+ji+'>'+bt+'</td>';
										dzhtml += '<td rowspan='+ji+'>'+hn+' VS '+gn;
										if(!jcexy){
											if(c==0 && hsstr.length>0){
//												dzhtml += '</td><td rowspan='+ji+'><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)</td>';
												dzhtml += '</td><td rowspan='+ji+'>'+hs+':'+vs+'</td>';
											}else{
												dzhtml += '<td rowspan='+ji+'></td>';
											}
										}else{
											if(c==0 && hsstr.length>0){
//												dzhtml += '<br><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)</td>';
												dzhtml += '<br><font color="red">'+hs+':'+vs+'</font>(全)</td>';
											}
										}
									
										
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
													
													if(jcexy){
														dzhtml += '<td>'+codarr.join(" ").replace("胜","主胜").replace("负","客胜")+'</td>'
													}
													dzhtml += '<td>胜平负</td>';
													dzhtml += '<td>'+codarr.join(" ")+'</td>';
													dzhtml += '<td>'+result.replace("3","胜").replace("1","平").replace("0","负")+'</td>';
												
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
												if(jcexy){
													dzhtml += '<td>'+codarr.join(" ").replace("胜","主不败").replace("负","客不败")+'</td>';
												}
												dzhtml += '<td>让球胜平负&nbsp('+lose+')</td>';
												dzhtml += '<td>'+codarr.join(" ")+'</td>';
												dzhtml += '<td>'+result.replace("3","胜").replace("1","平").replace("0","负")+'</td>';
												
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
												
												dzhtml += '</tr>';
											}
											i++;
										});
										break F;
									}
								}
						
						
						
						
						
								var isdystr = "";
					if(codes.split("|").length == 4){
						isdystr = "去除单一玩法串投注";
					}else{
						isdystr = "允许单一玩法串投注";
					}
					var gg = '<font  class="cm_red">'+codes.split(";")[0].split("|")[2].replaceAll("\\*","串")+'</font>';
					ggstr= gg+'&nbsp;'+isdystr;
						}
					});
			
					dzhtml += '</tbody>';
				
					
					$("#buy_info").html(dzhtml);
			}else{
				var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col width="55"><col width="55"><col /><col width="50"></colgroup>';
				dzhtml +='<thead><tr class="tr1"><td>场次</td><td>比赛</td><td>让球</td><td>全场比分</td><td>赛果</td>';
				if(lotid !=90&&lotid !=72){
					dzhtml +='<td>计奖SP</td>';
				}
				dzhtml +='<td>投注选项</td>';
				dzhtml +='<td>胆码</td></tr></thead><tbody>';
				
				if(lotid==85||lotid==72){
					if(lotid==72){
						var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col width="55"><col /><col width="50"></colgroup>';
					}else{
						var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col width="55"><col width="55"><col /><col width="50"></colgroup>';
					}
					dzhtml +='<thead><tr class="tr1"><td>场次</td><td>比赛</td><td>让球</td><td>比分</td><td>赛果</td>';
					if(lotid ==85){
						dzhtml +='<td>计奖SP</td>';
					}
					dzhtml +='<td>投注选项</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}else if(lotid == 91 || lotid == 92 || lotid == 93|| lotid == 90){
					var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col /><col width="50"></colgroup>';
					dzhtml +='<tr class="tr1"><td>场次</td><td>比赛</td><td>比分</td><td>赛果</td>';
					
					dzhtml +='<td>投注选项</td>';
					dzhtml +='<td>胆码</td></tr><tbody>';
				}else{
					if(lotid==89 || lotid==88|| lotid==86|| lotid==87){
						var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col width="55"><col /><col width="50"></colgroup>';
					}else{
						var dzhtml='<colgroup><col width="55"><col width="200"><col width="50"><col width="55"><col width="55"><col width="55"><col /><col width="50"></colgroup>';
					}
					
					dzhtml +='<thead><tr class="tr1"><td>场次</td><td>比赛</td><td>比分</td><td>赛果</td>';
					dzhtml +='<td>计奖SP</td>';
					dzhtml +='<td>投注选项</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}

				var builddate=Y.getDate(obj.items.builddate);
				var spfLose=Y.getDate("2013-06-4 12:00");
				if(builddate<spfLose && lotid == 90){  
					dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col width="130"><col /><col width="50"></colgroup>';
					dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>让球</td><td>比分</td><td>赛果</td>';
					if(lotid ==85){
						dzhtml +='<td>计奖SP</td>';
					}
					dzhtml +='<td>投注选项</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}  
					var r = obj.items.item;		
					var i=0;
					var odd="";
					
					var wk=["日","一","二","三","四","五","六"];
					$("#cp_changci").html(r.length);
					if(!this.isArray(r)){r=new Array(r);}
					var  arrmaxSp=[];
					var arrminSp=[];
					var maxSp="";
					var minSp="";
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
							result="<font   class='cm_red'>延</font>";
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
							
							if(lotid==92 || lotid == 87){
								bf=hhs +":"+hvs+"&nbsp;/&nbsp;"+hs+':'+vs;
							}else{
								bf=hs+':'+vs;
							}
							var ststr=result.split(";");
							if(lotid==90){//竞彩胜平负
								var _rt="";
								if(builddate<spfLose ){
									_rt=(hs-vs)*1+(lose)*1;
								}else{
									_rt=(hs-vs)*1;
								}
								
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
								sp = (spvalue*1).toFixed(4);
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
								sp = (spvalue*1).toFixed(4);
							}else if(lotid==87){//北单半全场
								result=ststr[2].split(":")[0];
								result=result.substr(0,1)+"-"+result.substr(1,1);
								sp = (spvalue*1).toFixed(4);
							}else if(lotid==88){//北单上下单双
								var sx=[];
								  sx[0]="下+双";
								  sx[1]="下+单";
								  sx[2]="上+双";
								  sx[3]="上+单";
								result=ststr[3].split(":")[0];
								result=sx[result*1];
								sp = (spvalue*1).toFixed(4);
							}else if(lotid==89){//北单总进球数
								result=ststr[4].split(":")[0];
								sp = (spvalue*1).toFixed(4);
							}
							
							if(new String(rt.hs).length==0 || new String(rt.vs).length==0){
								sp = "&nbsp";
								result = "&nbsp";
								bf = "&nbsp";
							}
						}

						if(parseInt(lose)!=0 && (lotid==90 || lotid==85 || lotid==72)){
						
								lose=lose;
							
						}
					
						if(type==1){     //复试
							
							if(codes.split(";").length>1){
								bet_str="";//得到投注选项
								arr_bet=codes.split("|");
								bet_str=arr_bet[1];//得到投注选项
								if(bet_str.indexOf("$")!=-1){
									dan=bet_str.split("$")[0];
									bet_str=bet_str.replace("$",",");
									
									dan_bet=dan.split(",");
									var dan_len=dan_bet.length;
									for(var c=0;c<dan_len;c++){
										var darr=dan_bet[c].split("=");
											if(darr[0]*1==id*1){
												dan='<s style="color:red">√</s>';
												dstr='(胆)';
												break;
											}else{
												dan='×';
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
									}else{
										bet_str=barr[1];
									}
								}
//								ggstr2=ggstr=codes.split(";")[0].split("|")[2].replaceAll("\\*","串");
								var ggs=[];
								codes.split(";").each(function(cd){
										ggs.push(cd.split("|")[2].replaceAll("\\*","串"));
								});
								
								ggstr2=ggstr=$_base_s.uniq(ggs);
							}else{
								
							var arr_bet;
							arr_bet=codes.split("|");
							bet_str=arr_bet[1];//得到投注选项
							ggstr='<font  class="cm_red">'+arr_bet[2].replaceAll("\\*","串")+'</font>';
							ggstr2=arr_bet[2].replaceAll("\\*","串");
							if(bet_str.indexOf("$")!=-1){
								dan=bet_str.split("$")[0];
								bet_str=bet_str.replace("$",",");
								
								dan_bet=dan.split(",");
								var dan_len=dan_bet.length;
								for(var c=0;c<dan_len;c++){
									var darr=dan_bet[c].split("=");
										if(darr[0]*1==id*1){
											dan='<s style="color:red">√</s>';
											dstr='(胆)';
											break;
										}else{
											dan='×';
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
								}else{
									bet_str=barr[1];
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
							if(result!=null &&bet_str.indexOf(result)!=-1 &&lotid !=91){
//									bet_str=bet_str.replace(result,"<font   class='cm_red'><b>"+result+"</b></font>");
							}else{
								cls="";
							}
						  }	
							
							
							
							if(lotid==90||lotid==72){
								var cksp=spvalue.split(",");
								bet3=cksp[0];
								bet1=cksp[1];
								bet0=cksp[2];
							
								
								result=result.replaceAll("3", "胜").replaceAll("1", "平").replaceAll("0", "负");
								bet_str=bet_str.replaceAll("3", "胜").replaceAll("1", "平").replaceAll("0", "负");
								maxsp=bet_str.replaceAll("胜", spvalue.split(",")[0]).replaceAll("平", spvalue.split(",")[1]).replaceAll("负", spvalue.split(",")[2]);
								bet_str=bet_str.replaceAll("胜", "胜("+spvalue.split(",")[0]+")").replaceAll("平", "平("+spvalue.split(",")[1]+")").replaceAll("负", "负("+spvalue.split(",")[2]+")");
								
								maxsp=maxsp.split(" ");
								arrmaxSp.push(Math.max.apply(null,maxsp));
							}
							if(lotid==89){
								if(result!=""&&bet_str.indexOf(result)!=-1){
									bet_str=bet_str.replace(result,"<font   class='cm_red'><b>"+result+"</b></font>");
									}
							}
							
							if(lotid==92){
								bet_str=bet_str.replaceAll("3-3","胜-胜("+spvalue.split(",")[0]+")");
								bet_str=bet_str.replaceAll("3-1","胜-平("+spvalue.split(",")[1]+")");
								bet_str=bet_str.replaceAll("3-0","胜-负("+spvalue.split(",")[2]+")");
								bet_str=bet_str.replaceAll("1-3","平-胜("+spvalue.split(",")[3]+")");
								bet_str=bet_str.replaceAll("1-1","平-平("+spvalue.split(",")[4]+")");
								bet_str=bet_str.replaceAll("1-0","平-负("+spvalue.split(",")[5]+")");
								bet_str=bet_str.replaceAll("0-3","负-胜("+spvalue.split(",")[6]+")");
								bet_str=bet_str.replaceAll("0-1","负-平("+spvalue.split(",")[7]+")");
								bet_str=bet_str.replaceAll("0-0","负-负("+spvalue.split(",")[8]+")");
							//	bet_str=bet_str.replaceAll("3", "胜("+spvalue.split(",")[0]+")").replaceAll("1", "平("+spvalue.split(",")[1]+")").replaceAll("0", "负("+spvalue.split(",")[2]+")");
							}else if(lotid==91){
								
								var bfstr=["1:0","2:0","2:1","3:0","3:1","3:2","4:0","4:1","4:2","5:0","5:1","5:2","胜其它","0:0","1:1","2:2","3:3","平其它","0:1","0:2","1:2","0:3","1:3","2:3","0:4","1:4","2:4","0:5","1:5","2:5","负其它"];
								var ii=new Array();
								for(var i=0;i<31;i++){
									if(bet_str.split(" ").length>1){
										for(var s=0;s<bet_str.split(" ").length;s++){
											if(bfstr[i]==bet_str.split(" ")[s]){ii[s]=i;}
										}
									}else{
										if(bfstr[i]==bet_str){ii[0]=i;}
									}
									
									
								}
								if(bet_str.split(" ").length>1){
								for(var n=0;n<bet_str.split(" ").length;n++){
									bet_str=bet_str.replaceAll(bfstr[ii[n]],bfstr[ii[n]]+"("+spvalue.split(",")[ii[n]]+")");
								}}else{
									bet_str=bet_str.replaceAll(bfstr[ii[0]],bfstr[ii[0]]+"("+spvalue.split(",")[ii[0]]+")");
								}
								
							}else if(lotid==93){
								bet_str=bet_str.replaceAll("0","零").replaceAll("1","一").replaceAll("2","二").replaceAll("3","三").replaceAll("4","四").replaceAll("5","五").replaceAll("6","六").replaceAll("7","七")
								bet_str=bet_str.replaceAll("零","0("+spvalue.split(",")[0]+")");
								bet_str=bet_str.replaceAll("一","1("+spvalue.split(",")[1]+")");
								bet_str=bet_str.replaceAll("二","2("+spvalue.split(",")[2]+")");
								bet_str=bet_str.replaceAll("三","3("+spvalue.split(",")[3]+")");
								bet_str=bet_str.replaceAll("四","4("+spvalue.split(",")[4]+")");
								bet_str=bet_str.replaceAll("五","5("+spvalue.split(",")[5]+")");
								bet_str=bet_str.replaceAll("六","6("+spvalue.split(",")[6]+")");
								bet_str=bet_str.replaceAll("七","7("+spvalue.split(",")[7]+")");
							}else{
								
							}
						}else{
//							ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
						//	$("#operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
							$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
						}
						
						
					
						tmpData = {id:id};
						spv=spvalue.split(",")[0];
						if(o%2==1){odd="tr1";}
						dzhtml += '<tr class="'+odd+'">';
						if(lotid==90 || lotid==72 || lotid==91 || lotid==92 || lotid==93){
							var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
							dzhtml += '<td title="'+id+'">周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';	
							tmpData.mid = '周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3);
//							if(Class.C("jjyh")){
								matchdata.push([id,tmpData.mid + "_" + hn + "_" + lose + "_" + gn]);	
//							}
						}else{
							dzhtml += '<td>'+id+'</td>';	
							tmpData.mid = id;
							
						}
					
						bf=bf==""?"&nbsp":bf;
						result=new String(result)==""?"&nbsp":result;
						bet_str=bet_str==""||typeof(bet_str) == "undefined"?"&nbsp":bet_str;
						sp=sp==""?"&nbsp":sp;
					
						tmpData.hn = hn;
						dzhtml += '<td>'+hn+' vs '+gn+'</td>';
						tmpData.gn = gn;
						if(lotid==72 || lotid==85 || (builddate<spfLose && lotid == 90)){
						dzhtml += '<td>'+lose+'</td>';//让球
						}
						dzhtml += '<td>'+bf+'</td>';
						if(bf=="&nbsp"){
							dzhtml += '<td>&nbsp;</td>';
						}else{

							dzhtml += '<td>'+result+'</td>';
						}
						if(lotid ==85 || lotid==86|| lotid==87|| lotid==88 || lotid==89){
							dzhtml += '<td>'+sp+'</td>';
						}
						
						dzhtml += '<td '+cls+'>'+bet_str+'</td>';
						
						dzhtml += '<td>'+(dan==""?"×":dan)+'</td>';
						dzhtml += '</tr>';
						mdata[mdata.length] = tmpData;
						i++;
					
					});
					dzhtml += '</tbody>';
					
					$("#buy_info").html(dzhtml);
				
			}
			var html = "";
				if(type=="1"){
				
				}else{
					html += '已上传';
					
					var yhfslist = ['平均优化', '博热优化', '博冷 优化'];
					var yhfile = codes.replace("_n.txt","_yd.xml");
					$("#yhdetail").click(function(){
						var yhalert = Y.lib.MaskLay('#yhinfodiv', '#yhdetailDIV');
						yhalert.addClose('#yhinfodiv_close');
						Y.get('#yhinfodiv .tantop').drag('#yhinfodiv');
						
						
						Y.ajax({
							type : 'GET',

							url : '/cpdata/pupload/temp/'+yhfile,
							end : function(data) {
							    Y.qXml("//row", data.xml, function(o,i){
									var yhcode = o.items.codes;
									var yhmatchs = o.items.matchs;
									var yhfs = o.items.type;
									var jjyhstr = "";
								
									jjyhstr += '<table border="0" class="bk_yd" cellpadding="0" cellspacing="0">';
									if(lotid == 72){
										jjyhstr += ' <colgroup><col width="90"><col width="240"><col width=""><col width="65"></colgroup><tbody><tr class="odd">';
										jjyhstr += '<td><strong>场次</strong></td>';
										jjyhstr += '<td>比赛</td>';
										jjyhstr += '<td>让球数</td>';
										jjyhstr += '<td>投注选项</td>';
									}else{
										jjyhstr += ' <colgroup><col width="175"><col width="205"><col width=""></colgroup><tbody><tr class="odd">';
										jjyhstr += '<td>场次</td>';
										jjyhstr += '<td>比赛</td>';
										/*jjyhstr += '<th width="57"><strong>让球数</strong></td>';*/
										jjyhstr += '<td>投注选项</td>';
									}
									
									 jjyhstr += '</tr>';
									 var yhmatchsList = yhmatchs.split(",");
									 for(var i=0;i<yhmatchsList.length;i++){
									 var ms="";
									 var betstr="";
									 if(lotid==70){
									 ms= yhmatchsList[i].split("\>");
									 var mlen=ms[1].split("+");
									 for(var n=0;n<mlen.length;n++){
									 if(mlen[n].split("=")[0]=="RSPF"){
									 betstr +="让球胜平负["+$_sys.getspfsel(mlen[n].split("=")[1])+"]<br/>";
									 }if(mlen[n].split("=")[0]=="SPF"){
									 betstr +="胜平负["+$_sys.getspfsel(mlen[n].split("=")[1])+"]<br/>";
									 }if(mlen[n].split("=")[0]=="CBF"){
									 betstr +="猜比分["+mlen[n].split("=")[1]+"]<br/>";
									 }if(mlen[n].split("=")[0]=="JQS"){
									 betstr +="进球数["+mlen[n].split("=")[1]+"]<br/>";
									 }if(mlen[n].split("=")[0]=="BQC"){
									 betstr +="半全场["+$_sys.getspfsel(mlen[n].split("=")[1])+"]<br/>";
									 }
									 }
									 }else{
									 ms= yhmatchsList[i].replace("]","").split("=");
									 betstr=ms[1];
									 }
									 var minfo= $_sys.getarryname(matchdata,ms[0]);
									 var minfoarr = minfo.split("_");
									 jjyhstr += '<tr>';
									 jjyhstr += '<td>'+minfoarr[0]+'</td>';
									 if(lotid == 72){
									 var lose=/\((-?\d+)\)/.exec(minfoarr[1])[1];
									 jjyhstr += '<td>'+minfoarr[1].replace("("+lose+")","") +'</td>';
									 jjyhstr += '<td>'+lose+'</td>';
									 }else{
									 jjyhstr += '<td>'+minfoarr[1] +'</td>';
									 }
									 if(lotid == 72 || lotid== 90 || lotid== 92){
									 jjyhstr += '<td >'+$_sys.getspfsel(ms[1])+'</td>';
									 var bet_str=ms[1].replaceAll("3", "胜").replaceAll("1", "平").replaceAll("0", "负");
									 if(lotid == 72 || lotid ==90){
									 bet_str=bet_str.replaceAll("胜", "胜("+minfoarr[2]+")").replaceAll("平", "平("+minfoarr[3]+")").replaceAll("负", "负("+minfoarr[4]+")");
									 }
									 $("#sp"+i+"").html(bet_str);
									 }else{
									 jjyhstr += '<td >'+betstr+'</td>';
									 $("#sp"+i+"").html(betstr);
									 }
									 jjyhstr += '</tr>';
									 }
									 jjyhstr += '<tr>'; 
									jjyhstr += '<td colspan="4" >优化后投注内容<em >(' + yhfslist[yhfs] + ')</em></td>';
									jjyhstr += '</tr>';	
									jjyhstr += '<tr class="odd">';
									if(lotid == 72){
										jjyhstr += '<td colspan="2" >投注明细</td>';
									}else{
										jjyhstr += '<td>投注明细</td>';
									}
									jjyhstr += '<td>过关方式</td>';
									jjyhstr += '<td>投注倍数</td>';
									jjyhstr += '</tr>';											
									var yhcodeList = yhcode.split(";");
									for(var i=0;i<yhcodeList.length;i++){
										var mcarr = yhcodeList[i].split("|");
										if(mcarr !=""){
										
										var marr = mcarr[1].split(",");
										var mstr = "";
										for(var j=0;j<marr.length;j++){
										
											 if(lotid==70){
												 mt= marr[j].split(">");
												 }else{
												 mt= marr[j].split("=");
												 } 
											var minfo= $_sys.getarryname(matchdata,mt[0]);
						    	   			var minfoarr = minfo.split("_");
						    	   			if(lotid == 72 || lotid== 90|| lotid== 92){
						    	   				
						    	   				mstr += minfoarr[0] + minfoarr[1] + "(" + $_sys.getspfsel(mt[1]) + ")  ";
											}else if(lotid==70){
												var smt=mt[1].split("=");
												mstr +=   minfoarr[1] + "(" + ((smt[0]=="SPF"||smt[0]=="RSPF")?$_sys.getspfsel(mt[1]):mt[1] )+ ")  ";
											}else{
												mstr += minfoarr[0] + minfoarr[1] + "(" + mt[1] + ")  ";
											}
											
										}
										var yhggbs = mcarr[2].split("_");
										jjyhstr += '<tr>';
										if(lotid == 72){
											jjyhstr += '<td colspan="2" >'+ mstr.replace(")",")<br/>") +'</td>';
										}else{
										
										jjyhstr += '<td><p>'+ mstr.replace(/\)/g,")<br/>") +'</p></td>';
										}
										jjyhstr += '<td>'+ yhggbs[0].replace("*","串") +'</td>';
										jjyhstr += '<td>'+ yhggbs[1] +'</td>';
										jjyhstr += '</tr>';	
									}}
									jjyhstr += '</table>';
									yhalert.pop(jjyhstr)
									
								});
							}
						});
						
					});
					
					
				}
				html +=ggstr;
//				var  max_pl=[10,20,30];
//				var gg_name=arr_bet[2].replaceAll("\\*","串");
				var d=[];
				$("#predictPrize").html( this.postMsg('msg_predict_max_prize', arrmaxSp, ggstr2, d).data);
				$("#cp_guoguan").html(html);
				if(lotid>=88 || lotid==70 || lotid==72 ){
//					html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
					if(Class.C("caststate") == 3){
					$("#operate3").click(function(){
					billcode(lotid,projid);
					}).show();
					//.html("<a href='javascript:void(0);'class='f_a_d' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细<a>").show();
					
					}
				}
		},
		error : function() {
			if(type=="1"){
				$("#buy_info").html($_sys.showcode(lotid,codes));
			}else{
//				$("#ccodes").html('方案已传，请点击<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>');
				$("#buy_codes").html('方案已传');
				$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
			}
			return false;
		}
	});	
};
billcode = function(lotid,projid){
	$("#detail_reco").html("");
	var htmlstr = '';
	htmlstr = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="cpmxtab">';
	htmlstr+= '<colgroup><col width="68"><col width="68"><col width=""><col width="68"><col width="68"><col width="68"></colgroup><thead><tr>';
	htmlstr+= '<td >序号</td>';
	htmlstr+= '<td >玩法</td>';
	htmlstr+= '<td >投注内容</td>';
	htmlstr+= '<td >过关方式</td>';
	htmlstr+= '<td >倍数</td>';
	htmlstr+= '<td >奖金</td>';
	htmlstr+= '</tr></thead>';
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
			   var hhhtml = '<thead><tr class="tr1">';
				   hhhtml += '<td>场次</td>';
				  
				   hhhtml += '<td>客队 VS 主队</td>';
				   hhhtml += '<td>比分</td>';
				   hhhtml += '<td>玩法</td>';
				  
				   hhhtml += '<td>投注选项</td>';
				   hhhtml += '<td>彩果</td>';
//				   hhhtml += '<th class="sp">计奖SP</td>';
				   hhhtml += '</tr></thead>';
				   hhhtml += '<colgroup><col width="60"><col width="200"><col width="80"><col width="80"><col/><col width="60">';
				   hhhtml += '</colgroup><tbody>';
					var odd="";
					var r = obj.items.item;
					var wk=["日","一","二","三","四","五","六"];
					$("#cp_changci").html(r.length);
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
							result="<font   class='cm_red'>延</font>";
							sp="1.00";
						}
						var hsstr =  rt.hs+"";
//						HH|130326303>DXF=3,130326302>RFSF=0/3+SFC=01/02/03/04/05/06/11/12/13/14/16,130326301>SF=0+RFSF=3+DXF=0/3|3*4
						var ncode = "";
						var codestr="";
						if(codes.split(";").length>1){
							 ncode = codes.split(";");
							 var bet_match=[];
							 ncode.each(function(n,m){
								 var s=m;
								 var bet =n.split(",");
								 bet.each(function(b,i){
									 if(i==0){
										 bet_match.push(b.split("|")[1]);
									 }else{
										 bet_match.push(b.split("|")[0]);
									 }
									
								 })
							 })
//			
						     var m=[],f;
						     for(var i=0;i<bet_match.length;i++){
						     f=true;
						     for(var j=0;j<m.length;j++)
						     if(bet_match[i]===m[j]){f=false;break;};
						     if(f)m.push(bet_match[i])}
						    m.sort(function(a,b){return a-b});
						    

							
						var array=m,bet ="";
						
							var i = 1;
							var ii =1;
							while(true){
								var a=b=cc=d="";
								a = array[i-1];
								b= a.split(">")[0];
							
									array.each(function(arr,t){
									cc = arr;
									if(cc){
										if(cc.indexOf(b)!=-1){
											
									
												d += cc.split(">")[1];
												ii++;
											if(cc.split(">").length)
											arr = "";
											d+="+"
										}
								
									
									}
								})
								d!=""?bet += b+">"+d:"";
								
								i++;
								if(i>array.length){
									break;
								}
							}
				   
							ncode=bet.replace(/(\d+)\+(\d+)/g,'$1,$2');
							if(ncode.charAt(ncode.length-1)=="+"){
								ncode=ncode.substr(0,ncode.length-1)+"";
							}
							
//						      "ccodes": "HH|140422004>RSPF=3,140422009>RSPF=0+JQS=0/1/2+CBF=1:0/0:0/1:1/0:1|2*1",
					
						}else{
							ncode = codes.split("|")[1];
					
						}
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
//								hhhtml += '<td rowspan='+ji+'>'+bt+'</td>';
								hhhtml += '<td rowspan='+ji+'>'+gn+' VS '+hn+"</td>";
								hhhtml += '<td rowspan='+ji+'>';
								if(c==0 && hsstr.length>0){
									bf=vs+':'+hs;
									hhhtml += ' <font  class="cm_red">'+bf+'</font>';
								}
								hhhtml += '</td>';
								var spvalues = spvalue.split("|");
								var loses = lose.split("|");
								var codarr = [];
								var i=0;
								itemcode.each(function(onecode){
									if(onecode){
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
//										hhhtml += '<td>'+sp+'</td>';
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
//										hhhtml += '<td>'+sp+'</td>';
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
//										hhhtml += '<td>'+sp+'</td>';
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
//										hhhtml += '<td>'+sp+'</td>';
										hhhtml += '</tr>';
									}
									i++;
								}
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
					var gg = codes.split(";")[0].split("|")[2].replaceAll("\\*","串");
					hhhtml += '</tbody>';
					ggstr= '<font  class="cm_red">'+gg+'</font>';
					$("#cp_guoguan").html(ggstr);
					$("#buy_info").html(hhhtml);
			}else{
				var dzhtml = '<thead><tr class="tr1"><td >序号</td>';
//				dzhtml += '<th rowspan="2">比赛时间</td>';
				if(lotid==94 || lotid==96){
					dzhtml += '<td>客队 vs 主队</td>';
				}else if(lotid==95){
					dzhtml += '<td>客队 vs 主队</td>';
					dzhtml += '<td> 让分 </td>';
				}else if(lotid==97){
					dzhtml += '<td>客队 vs 主队</td>';
					dzhtml += '<td> 预设总分</td>';
				}
				
				
				

				dzhtml += '<td>全场比分</td>';
				dzhtml += '<td>彩果</td>';
				dzhtml += '<td>投注选项</td>';
				
				dzhtml += '<td>胆码</td>';
				
				if(lotid==95 || lotid==97){
					dzhtml += '<colgroup><col width="60"><col width="200"><col width="80"><col width="55"><col width="55"><col/><col width="50"></colgroup><tbody>';
				}else{
				dzhtml += '<colgroup><col width="60"><col width="200"><col width="80"><col width="55"><col/><col width="50"></colgroup><tbody>';
				}
					var r = obj.items.item;		
					var i=0;
					var wk=["日","一","二","三","四","五","六"];
					$("#cp_changci").html(r.length);
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
						var dan='×';//<span style="color:red">√</span>
						var bet_str="";//投注项
						var cls="";
						if(c!=0){
							bf="--";
							result="<font   class='cm_red'>延</font>";
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
								else if(rt<-10&&rt>-16){result="客胜11-15";sp=spstr[2];}
								else if(rt<-15&&rt>-21){result="客胜16-20";sp=spstr[3];}
								else if(rt<-20&&rt>-26){result="客胜21-25";sp=spstr[4];}
								else if(rt<-25){result="客胜26+";sp=spstr[5];}
							}else if(lotid==97){//大小分
								var rt=(hs+vs)*1-(lose)*1;
								if(rt*1>0){result="大分";}else{result="小分";}
								var spstr=spvalue.split(",");
								sp=(rt*1>0?(spstr[0]):(spstr[1]));
							}
						}
						 
						if(lotid==95 || lotid==97){
							
							lose=lose;
							
						}else if(lotid==94 || lotid==96){
//							lose=" vs ";
						}
						
						if(type==1){     //复试
							
							if(codes.split(";").length>1){
								bet_str="";//得到投注选项
								ggstr='<font  class="cm_red">'+codes.split(";")[0].split("|")[2].replaceAll("\\*","串")+'</font>';
							}else{
								
							var arr_bet;
							arr_bet=codes.split("|");
							bet_str=arr_bet[1];//得到投注选项
							ggstr='<font  class="cm_red">'+arr_bet[2].replaceAll("\\*","串")+'</font>';
							
							if(bet_str.indexOf("$")!=-1){
								dan=bet_str.split("$")[0];
								bet_str=bet_str.replace("$",",");
								
								dan_bet=dan.split(",");
								var dan_len=dan_bet.length;
								for(var c=0;c<dan_len;c++){
									var darr=dan_bet[c].split("=");
										if(darr[0]*1==id*1){
											dan='<s style="color:red">√</s>';
											dstr='(胆)';
											break;
										}else{
											dan='×';
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
								arr_bet=bet_str.split(",");
								
								var bet_len=arr_bet.length;
								
								for(var b=0;b<bet_len;b++){
									var barr=arr_bet[b].split("=");
									if(barr[0]*1==id*1){
										bet_str=barr[1];
										break;
									}
								}
								if(bet_str==0){
									bet_str=bet_str.replaceAll("0","主负");
									bet_str=bet_str+"("+bet0+")";
								}else if(bet_str==3){
									bet_str=bet_str.replaceAll("3","主胜");
									bet_str=bet_str+"("+bet3+")";
								}else{
									bet_str="主负"+"("+bet0+")"+"主胜"+"("+bet3+")";
								}
							}else if(lotid==97){
								bet3 = spvalue.split(",")[1];// 小分
								bet0 = spvalue.split(",")[0];// 大分
								if(bet_str==0){
									bet_str=bet_str.replaceAll("0","小分");
									bet_str=bet_str+"("+bet3+")";
								}else if(bet_str==3){
									bet_str=bet_str.replaceAll("3","大分");
									bet_str=bet_str+"("+bet0+")";
								}else{
									bet_str="小分"+"("+bet3+")"+"大分"+"("+bet0+")";
								}
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
								
								bet_str=bet_str.replace(result+"("+spvalue.split(",")[0]+")","<font   class='cm_red'><b>"+result+"("+spvalue.split(",")[0]+")"+"</b></font>");
								bet_str=bet_str.replace(result+"("+spvalue.split(",")[1]+")","<font   class='cm_red'><b>"+result+"("+spvalue.split(",")[1]+")"+"</b></font>");
								bet_str=bet_str.replace(result,"<font   class='cm_red'><b>"+result+"</b></font>");
//								cls="style='background-color:#ffd6cc'";
							}else{
								cls="";
							} 
						  }	
						}else{
//							ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
						//	$("operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
							$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
						}
						if(lotid==96){
							bet_str=bet_str.replaceAll("主胜1-5","主胜1-5("+spvalue.split("|")[0].split(",")[6]+")");
							bet_str=bet_str.replaceAll("主胜6-10","主胜6-10("+spvalue.split("|")[0].split(",")[7]+")");
							bet_str=bet_str.replaceAll("主胜11-15","主胜11-15("+spvalue.split("|")[0].split(",")[8]+")");
							bet_str=bet_str.replaceAll("主胜16-20","主胜16-20("+spvalue.split("|")[0].split(",")[9]+")");
							bet_str=bet_str.replaceAll("主胜21-25","主胜21-25("+spvalue.split("|")[0].split(",")[10]+")");
							bet_str=bet_str.replaceAll("主胜26+","主胜26+("+spvalue.split("|")[0].split(",")[11]+")");
							
							
							bet_str=bet_str.replaceAll("客胜1-5","客胜1-5("+spvalue.split("|")[0].split(",")[0]+")");
							bet_str=bet_str.replaceAll("客胜6-10","客胜6-10("+spvalue.split("|")[0].split(",")[1]+")");
							bet_str=bet_str.replaceAll("客胜11-15","客胜11-15("+spvalue.split("|")[0].split(",")[2]+")");
							bet_str=bet_str.replaceAll("客胜16-20","客胜16-20("+spvalue.split("|")[0].split(",")[3]+")");
							bet_str=bet_str.replaceAll("客胜21-25","客胜21-25("+spvalue.split("|")[0].split(",")[4]+")");
							bet_str=bet_str.replaceAll("客胜26+","客胜26+("+spvalue.split("|")[0].split(",")[5]+")");
						}
						
						bf=bf==""?"&nbsp":bf;
						result=result==""?"&nbsp":result;
						bet_str=bet_str==""?"&nbsp":bet_str;
						if(o%2==1){odd="odd";}
						dzhtml += '<tr class="'+odd+'">';
						
						var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
						dzhtml += '<td title="'+id+'">周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
//						dzhtml += '<td>'+bt+'</td>';	
						dzhtml += '<td>'+gn+' vs '+hn+'</td>';
						 if(lotid==95 || lotid==97){
						dzhtml += '<td>'+lose+'</td>';
						}
						
						dzhtml += '<td>'+bf+'</td>';
						dzhtml += '<td>'+result+'</td>';
						dzhtml += '<td '+cls+'>'+(bet_str)+'</td>';
						
						dzhtml += '<td '+cls+'>'+dan+'</td>';
						
						dzhtml += '</tr>';
						i++;
					});
					dzhtml += '</tbody>';
					
				
					$("#buy_info").html(dzhtml);
			}
				var html = "";
				if(type=="1"){
				
				}else{
					html += '已上传 ';
				}
				html += ggstr;
				$("#cp_guoguan").html(ggstr);
//				html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
				html += '</p>';
				if(Class.C("caststate") == 3){
				//$("#operate3").html("<a href='javascript:void(0);' class='f_a_d' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细<a>").show();
				$("#operate3").click(function(){
					billcode(lotid,projid);
				}).show();
				}
		},
		error : function() {
			if(type=="1"){
				$("#buy_info").html($_sys.showcode(lotid,codes));
			}else{
//				$("#ccodes").html('方案已传，请点击<font class="red"><a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a></font>');
			//	$("operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
				$("#operate").attr("herf",'/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'').show();
			}
			return false;
		}
	});	
};

//足彩显示对阵
zcduizhen =function (lotid,expect,projid,type){
	var codes=$("#codestr").val();
	var gid="";
	var dzhtml="";
	switch (lotid+""){
	case "80":
	case "81":
		gid=1;
//		dzhtml='<colgroup><col width=""><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"><col width="18"> </colgroup>'
//			+'<tbody>'
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

				$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
				}
				var bfarray=[];
				var hbfarray=[];
				var bet_strarray=[];
				var resultarray =[];
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
					var hhs = rt.hms+"";// 半场主队进球
					var hvs = rt.hss+"";// 半场客队进球
					var bet3 = rt.b3+"00";// 欧赔3
					var bet1 = rt.b1+"00";// 欧赔1
					var bet0 = rt.b0+"00";// 欧赔0
					var result = rt.rs+"";// 开奖结果
					var bf="";
					var hbf="";
					var dan="";//<span style="color:red">√</span>
					var bet_str="";//投注项
					var cls="";
					if(result=="*" || result=="*,*"){
						bf="--";
						hbf='';
						result="<font   class='cm_red'>*</font>";
					}else{
						if(hs!="" && vs!=""){
							bf=hs+":"+vs;
							hbf=hhs+":"+hvs;
						}
					}
					
					if(type==1){//复
						if(danstr.length>0){
							if(danstr[i]!="#"){
								bet_str=danstr[i];
								dan='<em style="color:red">(胆)</em>';
							}else{
								bet_str=arr_bet[i];
								dan='';
							}
						}else{
							if(lotid==82){
							    bet_str="[主]"+arr_bet[i*2]+"<br/> [客]"+arr_bet[i*2+1];
							}else{
								bet_str=arr_bet[i];
							}
							dan='';
						}

						bet_str=bet_str.replaceAll("3","3 ").replaceAll("2","2 ").replaceAll("1","1 ").replaceAll("0","0 ");
						if(result!=""&&bet_str.indexOf(result)!=-1 && lotid != 82){
							bet_str=bet_str.replace(result,"<font>"+result+"</font>");
//							cls="style='background-color:#ffd6cc'";
						}else{
							cls="";
						}
						
						if(bet_str=="#"){bet_str="";}

				
					}
					
					bf=bf==""?"vs":bf;
					hbf=hbf==""?"vs":hbf;
					result=result==""?"*":result;
					bet_str=bet_str==""?"&nbsp":bet_str;
					if(lotid ==83){
						hbfarray.push(hbf);
						bfarray.push(bf);
					}else{
						bfarray.push(bf)
					}
					
					if(lotid == 82){
						result=result.split(",");
//						if(result[0]==arr_bet[i*2]){
//							arr_bet[i*2]="<font>"+arr_bet[i*2]+"</font>";
//						}
//						if(result[1]==arr_bet[i*2+1]){
//							arr_bet[i*2+1]="<font>"+arr_bet[i*2+1]+"</font>";
//						}
						arr_bet[i*2+1]=arr_bet[i*2+1].replace(result[1],"<font>"+result[1]+"</font>");
						arr_bet[i*2]=arr_bet[i*2].replace(result[0],"<font>"+result[0]+"</font>");
						bet_strarray.push(arr_bet[i*2]);
						bet_strarray.push(arr_bet[i*2+1]);
						
						resultarray.push(result[0]);
						resultarray.push(result[1]);
					}else{
						bet_strarray.push((bet_str)+dan);
						resultarray.push(result);
					}
					

					i++;
				
				});
//				if(lotid==81 || lotid == 80){
					$("td[mark=gn]").each(function(o,rt){
						$(rt).html(r[o].hn.replace(/\s/ig,'').replace(/\[.+\]/ig,''));
					})
					$("td[mark=hn]").each(function(o,rt){
						$(rt).html(r[o].gn.replace(/\s/ig,''));
					})
				
					$("#cp_bet_info td[mark=bet]").each(function(o,rt){
						$(rt).html(bet_strarray[o].replace(/\s/ig,''));
					})
				
					for(var i=0;i<bfarray.length;i++){
						if(bfarray[i]!="vs"){
							$("#cawardcode").show();
						}
					}
					
					if(lotid==83){
						$("#cp_bf td[mark=hvs]").each(function(o,rt){
							$(rt).html(hbfarray[o*2].replace(/\s/ig,''));
						})
						$("#cp_bf td[mark=vs]").each(function(o,rt){
							$(rt).html(bfarray[o*2].replace(/\s/ig,''));
						})
					}else{
						$("#cp_bf td[mark=vs]").each(function(o,rt){
							$(rt).html(bfarray[o].replace(/\s/ig,''));
						})
					}
					
					$("#cawardcode td[mark=kj]").each(function(o,rt){
						$(rt).html("<b>"+resultarray[o].replace(/\s/ig,'')+"</b>");
					})
//				}
				
				if(type==0){
					dzhtml += '<p>';
					
					dzhtml += ggstr+'</p>';
				}
				$("#cp_guoguan").html(ggstr);
//				$("#buy_info").html(dzhtml);
		},
		error : function() {
			if(type=="1"){
				$("#buy_info").html($_sys.showcode(lotid,codes));
			}else{

				$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
			}
			return false;
		}
	});	
};