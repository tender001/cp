Class.C('time_style', true);
Class.C('time_style_ctpl', '<b class="tim first">{1}</b><span>天</span><b class="tim">{2}</b><span>时</span><b class="tim">{3}</b><span>分</span>');
Class.C('time_style_ctp2', '<b class="tim first">{2}</b><span>时</span><b class="tim">{3}</b><span>分</span><b class="tim">{4}</b><span>秒</span>');
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
		dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
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

$_sys.getspfsel=function(sel){	
	return sel.replace(/0/g,"负").replace(/1/g,"平").replace(/3/g,"胜");
};
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
	$(".hm_col_5_top ul li").click(function(){
	    $(this).addClass("cur").siblings().removeClass("cur");
	    if($(".hm_col_5_top ul li").index(this)==0){
	    	$(".hm_col_5_m  .x_s_c").eq(0).show().siblings().hide();
	    }else if($(".hm_col_5_top ul li").index(this)==1){
			$(".hm_col_5_m  .x_s_c").eq(1).show().siblings().hide();
			showjoin(lotid,projid,10,1);
		} else if($(".hm_col_5_top ul li").index(this)==2){
			$(".hm_col_5_m  .x_s_c").eq(2).show().siblings().hide();
			showmyjoin(lotid,projid);
		}
	    	
	    
	}); 
	
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
		$("#kj_time").html("&nbsp;("+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+")");
		$("#pj_time").html("&nbsp;("+Y.getDate(retdate).format('MM-DD hh:mm:ss')+")");
	}else if(awarddate != '' && awarddate != undefined){
		$("#kj_time").html("&nbsp;("+Y.getDate(awarddate).format('MM-DD hh:mm:ss')+")");
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
		$("#f_jd").css("left","184px");
		$("#f_paint").html("已撤单");
		break;
	case 2://出票中2
		$("#f_faqi").css("width","80%");
		$("#f_jd").css("left","282px");
		$("#f_paint").html("出票中");
		break;
	case 3://等待出票3
		$("#f_faqi").css("width","70%");
		$("#f_jd").css("left","262px");
		$("#f_paint").html("等待出票");
		break;
	case 5://出票成功5
		$("#f_faqi").css("width","100%");
		$("#f_jd").css("left","310px");
		$("#f_paint").html("出票成功");
		break;
	case 6://已开奖6
		$("#f_faqi").css("width","100%");
		$("#f_jd").css("left","480px");
		$("#f_jj").css("width","100%");
		$("#f_paint").html("已开奖");
		break;
	case 7://已计奖7
		$("#f_faqi").css("width","100%");
		$("#f_jd").css("left","570px");
		$("#f_jj").css("width","100%");
		$("#f_pj").css("width","60%");
		$("#f_paint").html("已计奖");
		break;
	case 8://派奖中8
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_jd").css("left","620px");
		$("#f_pj").css("width","80%");
		$("#f_paint").html("派奖中");
		break;
	case 12://已派奖12
		$("#f_faqi").css("width","100%");
		$("#f_jj").css("width","100%");
		$("#f_pj").css("width","100%");
		$("#f_jd").css("left","650px");
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
	if(ifile==0){
		$("#pro_gg").html('<p id="pro_gg" class="p_2p">选择场次：&nbsp;&nbsp; <em>'+$_sys.showcode(lotid,ccodes).split(',').length+'</em>场&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;过关方式： <em>'+$_sys.showcode(lotid,ccodes).split('|')[($_sys.showcode(lotid,ccodes).split('|').length)-1]+'</em></p>');
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
				}else{
					
				}
				$('#one_con2').html(myjoinhtml);
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
				var cname = r.cname;
				Class.C("caststate", icast);
				if(itype == '0'){
//					$('#num_width_change').css({width: "683px"});
//					$('#p_share h3').hide();
					$('#buy_yonghu h5').html("认购用户");
//					$('#buy_yonghu p').hide(); 
					$("#show_res").hide(); //确认代购 再次认购
					$("#cm_sumb").html("<a class='my'>代购</a>")
					$("#cm_u_set").hide(); //定制跟单
					$("#xc_name").parent().parent().hide(); //方案宣传
					$('#fqrcd').hide(); //方案撤单
					$("#copystr").hide();//复制方案
					$('#faxc_tr').hide();
					$('#one1').hide(); //认购人数
					
					$(".hm_top_1").next().html("").attr("class","k3_hq");
					$("#one2").hide();
					var dghtml='<h3>购买信息</h3> <div class="k3_h_a"><div><span>方案发起人</span><p><strong id="cm_u_name"></strong></p></div><div><span>投注内容</span><p><em >'+mulity+'</em>倍&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总金额<em id="tmoney"></em>元</p><s id="res_dg"></s></div></div>'
					$(".hm_top_1").next().html(dghtml);
					
				}
				$("#xc_name").html(typeof cdesc == "undefined"?"":cname);
				$("#xc_info").html(typeof cname == "undefined"?"":cdesc);
				var iscancel=false;
				if ((nums-lnum+pnum)/nums<0.8){					
					iscancel=true;
				}
				var ccodehtml="";
				var fs=ifile == 0 ? "复式" : "单式";
				var buy_zj="未开奖";
				
				
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
						var cancel = Y.getInt(rt.cancel);// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						var source = rt.source;// 方案来源
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
				
				$("#tmoney").html(parseFloat(tmoney).rmb(true));
				$("#mulity").html(mulity+'倍');
				$("#smoney").val(smoney);
				$("#lnum").val(lnum);
				$("#lotid").val(lotid);
				$("#projid").val(projid);
				$("#pnum").val(pnum);
				$("#pmoney").val(parseFloat(smoney*lnum));
				$("#tmoney2").html(parseFloat(tmoney).rmb(true));
				var qihao = '';
				if(lotid>=90 || lotid ==70 || lotid ==71){
				    qihao = $_sys.getlotname(gameid) +"  ";
				}else{
				    qihao = $_sys.getlotname(gameid) + "&nbsp;第<b>" + periodid + "</b>期&nbsp;";	
				}
				$("#buy_qh").html(periodid);
				if((gameid=="03" || gameid=="53")&&ifile == 1){
					qihao += play == 1 ? "直选" : play == 2 ? "组三" : play == 3 ? "组六" : "";
				}else if(gameid=="50"){
					qihao +=ccodes.split(';')[0].split(':')[1]==2? "追加" : "";
				}
				qihao += ifile == 0 ? "复式" : "单式";
				qihao += itype == 0 ? "代购" : "合买";
				$("#cm_sfc_title").html(qihao);
				$("#cm_sfc_context").html('方案编号：' + projid+'<br />发起时间：' + adddate + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;截止时间：' + endtime +'<a id="copystr">复制链接地址</a>');
				$("#cm_u_name").html($_sys.showzhanjiname(gameid,cnickid,'award'));
				$("#cm_u_star").html(($_sys.showzhanji(aunum,agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,cnickid,aunum,agnum)+'&nbsp;&nbsp;'));
				
				$("#cm_u_set").click(function(){
					$_sys.autobuy(gameid,cnickid);
				});
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
				$("#fq_time").html("&nbsp;("+Y.getDate(adddate).format('MM-DD hh:mm:ss')+")<br/>&nbsp;("+week+")");
				var cp=0;
				if(icast==3 && istate<3){
					cp=1;
					$("#cp_time").html("<br/>&nbsp;("+Y.getDate(castdate).format('MM-DD hh:mm:ss')+")");
				}

				if(itype != '0'){
				$("#pnum").html((pnum==0?'未保底':((parseFloat(pnum*smoney).rmb(true))+''+((isself&&istate=="1")?'':'')+(iclear=='2'?' ':''))));
				}
				$("#fqrg").html("￥"+onum +"("+parseInt(onum*100/tmoney)+"%)");
				if(pnum == 0){
					$("#baodi_rengou").hide();
				}else if(isself&&istate=="1"){
					$("#f_oper_div").show();
					$("#baodi_rengou").show();
				}
				
				$("#wrate").html(wrate==0?'未提成':wrate+'%');
				$("#jindu").html(jindu+'%');
				$("#jdpaint").css("width", jindu+"%");
				if(onum+pnum==tmoney){
				$("#baoodi").html((pnum!=0 ? ('(保'+(100-parseInt(onum*100/tmoney))+'%)'+(iclear=='2' ? '已清' : '')) : '无保底'));
				}else{
				$("#baoodi").html((pnum!=0 ? ('(保'+(parseInt(pnum*100/tmoney))+'%)'+(iclear=='2' ? '已清' : '')) : '无保底'));
				}
				$("#yumoney").html(parseFloat(lnum*smoney).rmb(true));
				
				loadtime(endtime);
				mark(icast,award,ireturn,istate,adddate,castdate,awarddate,retdate);
				
			
				$("#fqrcd").hide();
				$("#f_oper_div").hide();
				if (upload=="0"){
					if (((pnum==0&& (istate=="0" || istate=="1"|| istate=="2"))||(pnum!=0 && istate=="1" )) && isself){
						$("#scfa").show();
						$("#f_oper_div").show();
						if(lotid==90 ||lotid==91 ||lotid==92 ||lotid==93||lotid==72){
							$("#scfa a").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
							
						}else if(lotid==94 ||lotid==95 ||lotid==96 ||lotid==97){
							$("#scfa a").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
						}else if(lotid==85 ||lotid==86 ||lotid==87 ||lotid==88 ||lotid==89){
							$("#scfa a").attr("href",""+$_sys.getlotdir(lotid)+"project_upload.html?lotid="+lotid+"&projid="+projid+"");
							
						}else{
//							$("#scfa").html('<s>您的方案未上传请及时上传</s><a href="javascript:void (0);" onclick="Y.openUrl(\'/game/hsc.html?lotid='+gameid+'&projid='+projid+'\',582, 274);" ></a>');
							$("#scfa a").click(function(){
								var _dsalert = Y.lib.MaskLay('#ds_dlg', '##ds_dlg_close', '#ds_dlg_content');
								_dsalert.addClose('#ds_dlg_close');
						        Y.get('#ds_dlg div.tan_top').drag('#ds_dlg');
						        _dsalert.pop();
							})
						}
						
					}else{
						ccodehtml ='未上传';
					}
					var prohtml='<colgroup><col width="100" /><col width="220" /><col width="200" /><col width="80" /><col width="80" /><col width="100" /><col width="" /></colgroup><thead><tr>';
					prohtml += '<td>第<strong >'+periodid+'</strong>期</td><td>投注内容</td><td>方式</td><td>倍投</td><td>注数</td><td>开奖结果</td><td>发起时间</td></tr></thead>';
					prohtml += '<tr><td>1</td><td id="buy_codes"><div class="buy_codes"><div id="max_height">未上传</div></div></td><td>'+fs+'</td><td>'+mulity+'</td><td>'+parseInt(nums/smoney/2)+'</td><td>'+buy_zj+'</td><td>' + adddate + '</td></tr>';
				
					$("#buy_info").html(prohtml);
				}else{
					if (ccodes==''){
						$('#see_duizhen').hide();
						$("#operate2").hide();
						$(".x_s_c .x_f_a").next().attr("class","x_f_b").html("<b></b><p>该方案选择<em>\"完全保密\"</em>"+$_sys.iopen[Y.getInt(iopen)]+"</p>");
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
					var prohtml='<colgroup><col width="100" /><col /><col width="100" /><col width="120" /><col width="80" /></colgroup><thead><tr>';
					prohtml += '<td>第<strong >'+periodid+'</strong>期</td><td>投注内容</td><td>方式</td><td>倍投</td><td>中奖情况</td><td>&nbsp;</td></tr></thead><tbody class="buy_codes"><div id="max_height">';
					
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
								prohtml +='<tr class="over_ten" style="display:none;"><td>'+(i+1)+'</td><td>'+ccodehtml.split("<br/>")[i]+'</td><td>'+fs+'</td><td>'+mulity+'</td><td>'+rb+'</td></tr>';
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
//						prohtml += '<tr><td>1</td><td id="buy_codes"><div class="buy_codes"><div id="max_height">'+ccodehtml+'</div></div></td><td>'+fs+'</td><td>'+mulity+'</td><td>'+parseInt(nums/smoney/2)+'</td><td>'+tmoney+'</td><td>'+buy_zj+'</td><td><a style="display:none" class="a_zcz" >再次认购</a></td></tr>';
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
					
					if (bonus > 0) {
						$("#res_dg").addClass("yzj");
						if(istate==3){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">未满员系统撤单,撤单方案&nbsp;<font>已中奖</font></p>');
						}else if(istate==4){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">发起人撤单,撤单方案&nbsp;<font>已中奖</font></p>');
						}else if(istate==5){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">系统撤单，方案&nbsp;<strong>未上传</strong></p>');
						}else{
							$("#kj_tc").html(parseFloat(owins).rmb(true));
							if(itype==1&&istate!=3&&istate!=4){$("#kj_mf").html(parseFloat((tax-owins)/nums).rmb(true));}
							if(lotid>=85 && lotid<90 && r.addmoney>0){wininfostr += "已含加奖金额：<font color=#990000>" + parseFloat(r.addmoney).rmb(true) +"</font>.";}
							showres='<span class="x_g_b"></span><b></b><p class="zj_p">'+((itype == '0')?"代购":"合买")+'成功，<font>已中奖</font><br>本次共中金额 <font>' + parseFloat(bonus).rmb(true) +'</font> 元</p>';
							if(lotid<=7 || lotid>=50 &&lotid<80){
							$("#cm_sumb").html('<a id="submitCaseBtn3" class="rg" style="cursor:default;dispaly:none" href="javascript:void(0);">再次认购</a>') ;
							}else{
							$("#cm_sumb").hide();
							}
							$("#show_res").html(showres);
						}
						wininfostr += "" + parseFloat(bonus).rmb(true) +"(税前),<s>"+ parseFloat(tax).rmb(true) + "</s>元(税后)</br>";
						var zj = $_sys_getwininfo(gameid, wininfo);
						for ( var i = 0; i < zj.length; i++) {
							wininfostr += "&nbsp;" + zj[i][0] +" <s>"+ zj[i][1] + "</s>注;";
						}
						
					
					}else{
						
					$("#yorn").addClass("cur");
					$("#res_dg").addClass("wzj");
					
//					if(lotid<=7 || lotid>=50 &&lotid<80){
//						$("#cm_sumb").html('<a id="submitCaseBtn3" class="rg" style="cursor:default" href="javascript:void(0);">再次认购</a>').hide() ;
//						}else{
//						$("#cm_sumb").hide();
//						}
			
				
					}
					var k_o_c = $_cache.qcode(gameid, periodid);
					if(k_o_c == '' || k_o_c == undefined){
						$("#awards").html("-");
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
								html+='<b>'+red[i]+'</b>';
							};
						}else{
							var codelen=code2.split(",").length;
							html+='<span>';
							for(var i=0;i<codelen;i++){
								html+='<b>'+code2.split(",")[i]+'</b>';
							}
							html+='</span>';
							
						}
						$("#awards").html(html);
						}
					$("#zj_money").html(wininfostr==""||bonus<0?"--":wininfostr);
					$("#zj_tc").html((bonus>0)?parseFloat(owins).rmb(true):"--");
					$("#zj_mf").html((bonus>0)?"<font color=#990000>"+ parseFloat((tax-owins)/nums).rmb(true) + "</font>":"--");
					$("#wininfo_tr").show();
					
					
				}else{
					$("#wininfo_tr").hide();
				}
				
			
				//0 禁止认购 1 认购中,2 已满员 3
				// 过期未满撤销 4主动撤销
				if(itype==0){
					$("#cm_sumb").show();
					$("#copystr").hide();
				}else{
					$("#cm_sumb").hide(); //隐藏再次认购  待实现
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
						$("#permoney").val("剩余"+lnum);		
						$("#money_rate").html("￥"+lnum);
						$("#show_res").show();
						$("#cm_sumb").show();
						
						$("#submitCaseBtn3").click(checkForm);
						
						Y.get('#permoney').click(function(){
							$("#permoney").val(1);	
							Y.one('#money_rate').innerHTML = ("￥"+Y.one('#permoney').value);
						});
						
						Y.get('#permoney').keyup(function(){
							
								
							if(Y.getInt(Y.one('#permoney').value) > (lnum)) Y.need('#permoney').val(lnum);
						    var buymoney = Y.one('#permoney').value;      //方案金额
							if(buymoney !=""){
							Y.one('#money_rate').innerHTML = ("￥"+buymoney);
							}
						});
						
						
					}else if (istate=="2" && bonus ==0){					
						$("#show_res").html(award ==0?'<span class="x_g_b"></span><b class="hm_sus"></b><p class="zj_p hm_ps"><strong>已满员  待开奖</strong></p>':'<span class="x_g_b"></span><b class="hm_sus"></b><p class="zj_p hm_ps">该方案&nbsp;&nbsp;<strong>未中奖</strong></p>');
					}else if (istate=="3" ){ //该方案系统已撤单
						if(bonus ==0){
						$("#show_res").html(award ==0?'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">该方案系统已撤单</p>':'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">未满员系统已撤单,该方案&nbsp;&nbsp;<strong>未中奖</strong></p>');
						}else if(award !="2"){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">该方案未满员，系统已撤单</p>');
						}
					}else if (istate=="4" ){ //发起人已撤销该方案
						if(bonus ==0){
						$("#show_res").html(award ==0?'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">发起人已撤销该方案</p>':'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">发起人已撤销,该方案&nbsp;&nbsp;<strong>未中奖</strong></p>');
						}else if(award !="2"){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">发起人已撤销该方案</p>');
						}
					}else if (istate=="5"){ //系统已撤销该方案
						if(bonus ==0){
						$("#show_res").html(award ==0?'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">系统已撤销该方案</p>':'<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">系统已撤销,该方案&nbsp;&nbsp;<strong>未中奖</strong></p>');
						}else if(award !="2"){
							$("#show_res").html('<span class="x_g_b"></span><b class="hm_sub"></b><p class="zj_p hm_ps">系统已撤销该方案</p>');
						}
					}
//					
				}
				
				//发起人撤单
				
				if (isself&&iscancel&(istate=="1"||istate=="0")){
					$("#fqrcd").show();	
					$("#f_oper_div").show();
				};
				if (((pnum==0&& (istate=="0" || istate=="1"))||(pnum!=0 && istate=="1" )) && isself){
					 $("#f_oper_div").show();
				}
				
				
				$("#copystr").click(function(copy){
					copyurl('http://'+location.host+$_sys.getlotdir(gameid)+'project.html?lotid='+gameid+'&projid='+projid+'');
//					$(copy).attr("data-help","您好，请选中地址用ctrl+c复制!<br/>http://"+location.host+$_sys.getlotdir(gameid)+"viewpath.html?lotid="+gameid+"&projid="+projid+"");
				});
				var t = 'null' == cdesc ? '随缘,买彩票讲的是运气、缘分和坚持。' : cdesc;
				$("#faxc_tr #cdesc").text(t);
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
				$("#one1").html("认购人数（"+rc+"）");
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
					
					var pagehtml='<a class="a1" style="margin-right:5px" onclick="showjoin(\''+lotid+'\','+projid+','+ps+',1)"  href="javascript:void(0)">首页</A>';
					pagehtml += '<a class="a2" style="margin-right:5px" title="上一页 " onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn-1>0?(pn-1):1)+')" href="javascript:void(0)">上一页</A>';
					var min=0;
					var max=0;
					if ( tp > maxshow){
					var pageTemp=parseInt(pn*1/maxshow);
					max = pageTemp*maxshow+maxshow;
					min = pageTemp*maxshow;
					
					if(max> tp){
					max= tp;
					}
					if(pn>min){
						min=min+1;
					}

					}else{
					min = 1;
					max = tp;
					}
					for (var i=min;i<max*1+1;i++){
					if (i==pn){
						pagehtml+='<a href="javascript:void(0);" id="'+i+'" class="a4" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+i+')">' + i + '</a>';
					}else{
						pagehtml+='<a href="javascript:void(0);" id="'+i+'" class="a3" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+i+')">' + i + '</a>';
					}
					}
					pagehtml+='<span class="ac">第<INPUT onkeydown="if(event.keyCode==13){page(Y.getInt(this.value));return false;}" id=govalue class="ac" ';
					pagehtml+='onkeyup="this.value=this.value.replace(/[^\\d]/g,\'\');if(this.value>'+tp+')this.value='+tp+';if(this.value<=0)this.value=1"  name=page>页</span>';
					pagehtml+='<a class="go" href="javascript:void(0)" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+',Y.getInt($("#govalue").val()))"></a>';
					pagehtml+='<a class="a2" style="margin-left:10px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+(pn+1>tp?tp:(pn+1))+')"  href="javascript:void(0)">下一页</a>';
					pagehtml+='<a class="a1" style="margin-left:5px" onclick="showjoin(\''+lotid+'\',\''+projid+'\','+ps+','+tp+')" href="javascript:void(0)">尾页</a><span class="gy">共'+tp+'页，'+rc+'条记录</span>';
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
			}
		}
	});	
};
//北单竞彩显示对阵
showduizhen =function (lotid,expect,projid,type,codes,cp){
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
				var dzhtml="";
				if(jcexy){
				    	dzhtml += '<colgroup><col width="60"><col width="100"><col /><col width="120"><col width="120"><col width="120">';
						dzhtml += '<col width="80"></colgroup>';
						dzhtml += '<thead><tr><td rowspan="2">场次</td>';
					    dzhtml += '<td rowspan="2">比赛时间</td>';
					    dzhtml += '<td rowspan="2">主队 VS 客队</td>';
				    	dzhtml += '<td rowspan="2">二选一投注选项</td>';
					    dzhtml += '<td colspan="2">实际投注选项</td>';
					    dzhtml += '<td rowspan="2">彩果</td>';
					    dzhtml += '</tr><tr><td>玩法</td><td>投注选项</td></tr></thead><tbody>';
				    }else{
				    	dzhtml += '<colgroup><col width="60"><col width="120"><col width="220"><col width="70"><col width="94"><col/>';
						dzhtml += '<col width="80"></colgroup>';
						 dzhtml += '<thead><tr><td>场次</td>';
						    dzhtml += '<td>比赛时间</td>';
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
						if(type !=1){
							var tDATE="20"+id.substr(0,2)+"-"+id.substr(2,2)+"-"+id.substr(4,2);
							
							dzhtml += '<tr class="'+odd+'">';
							dzhtml += '<td rowspan=4>周'+wk[Y.getDate(tDATE).getDay()]+''+id.substr(6,3)+'</td>';
							
							
							dzhtml += '<td rowspan=4>'+bt+'</td>';
							dzhtml += '<td rowspan=4>'+hn+'('+lose+') VS '+gn;
							if(c==0 && hsstr.length>0){
								dzhtml += '</td><td rowspan=4><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)</td>';
							}else{
								dzhtml += '</td><td rowspan=4></td>';
							}
							
							var result1="";
							
						
							var spvalues = spvalue.split("|");
							if(c==0){
								var spvalue = spvalues[0].split(",");
								if(hsstr.length>0){
									var rt=(hs-vs)*1+(lose)*1;
									var hrt=(hhs-hvs)*1;
									
									if(rt*1>0){result1="3";}else if(rt*1==0){result1="1";}else{result1="0";}
								
								}else{
									result1 = "&nbsp;";
									
								}
							result1=result1.replace("3","胜").replace("1","平").replace("0","负");
							dzhtml +='</td><td>胜平负</td><td></td><td>'+result1+'</td></tr>';
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
							dzhtml +='</td><td>半全场</td><td></td><td>'+bqres+'</td></tr>';
							var jqsp = spvalues[3].split(",");
							var jqres='';
							
								if(hsstr.length>0){
									var rt=(hs+vs)*1;
									if(rt>=7){jqres=7;}else{jqres=rt;}
									
								}else{
									jqres = "&nbsp;";
									
								}
							dzhtml +='</td><td>总进球</td><td></td><td>'+jqres+'</td></tr>';
							var bfres="";
							var bfsp = spvalues[1].split(",");
							
								if(hsstr.length>0){
									bfres=hs+":"+vs;
									var ii=100;
									for(var r=0;r<31;r++){
										if(cbfstr[r]==bfres){ii=r;}
									}
									if(ii==100){
										if(hs>vs){bfres="9:0";}else if(hs==vs){bfres="9:9";}else{bfres="0:9";}
									}
								
								}else{
									bfres = "&nbsp;";
									
								}
							dzhtml +='</td><td>比分</td><td></td><td>'+bfres+'</td></tr>';
							}
						//	$("#operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
						$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
							
						}else{
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
								dzhtml += '<td rowspan='+ji+'>'+hn+' VS '+gn;
								if(!jcexy){
									if(c==0 && hsstr.length>0){
										dzhtml += '</td><td rowspan='+ji+'><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)</td>';
									}else{
										dzhtml += '<td rowspan='+ji+'></td>';
									}
								}else{
									if(c==0 && hsstr.length>0){
										dzhtml += '<br><font color="red">'+hhs+':'+hvs+'</font>(半)/<font color="red">'+hs+':'+vs+'</font>(全)</td>';
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
					var gg = codes.split("|")[2].replaceAll("\\*","串");
					ggstr= gg+'&nbsp;<font  class="cm_red">'+isdystr+'</font>';
						}
					});
			
					dzhtml += '</tbody>';
				
					
					$("#buy_info").html(dzhtml);
			}else{
				var dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col width="130"><col/><col /><col width="50"></colgroup>';
				dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>让球</td><td>全场比分</td><td>赛果</td>';
				if(lotid !=90&&lotid !=72){
					dzhtml +='<td>计奖SP</td>';
				}
				dzhtml +='<td>您的选择</td>';
				dzhtml +='<td>胆码</td></tr></thead><tbody>';
				
				if(lotid==85||lotid==72){
					var dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col width="130"><col /><col width="50"></colgroup>';
					dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>让球</td><td>全场比分</td><td>赛果</td>';
					if(lotid ==85){
						dzhtml +='<td>计奖SP</td>';
					}
					dzhtml +='<td>您的选择</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}else if(lotid == 91 || lotid == 92 || lotid == 93|| lotid == 90){
					var dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col /><col width="50"></colgroup>';
					dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>全场比分</td><td>赛果</td>';
					
					dzhtml +='<td>您的选择</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}else{
					var dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col width="130"><col /><col width="50"></colgroup>';
					dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>全场比分</td><td>赛果</td>';
					dzhtml +='<td>计奖SP</td>';
					dzhtml +='<td>您的选择</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}

				var builddate=Y.getDate(obj.items.builddate);
				var spfLose=Y.getDate("2013-06-4 12:00");
				if(builddate<spfLose && lotid == 90){  
					dzhtml='<colgroup><col width="70"><col width="240"><col width="75"><col width="110"><col width="130"><col /><col width="50"></colgroup>';
					dzhtml +='<thead><tr><td>场次</td><td>比赛</td><td>让球</td><td>全场比分</td><td>赛果</td>';
					if(lotid ==85){
						dzhtml +='<td>计奖SP</td>';
					}
					dzhtml +='<td>您的选择</td>';
					dzhtml +='<td>胆码</td></tr></thead><tbody>';
				}  
					var r = obj.items.item;		
					var i=0;
					var odd="";
					var matchdata = [];	
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
							bf=hhs+':'+hvs+'/'+hs+':'+vs;
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
									bet_str=bet_str.replace(result,"<font   class='cm_red'><b>"+result+"</b></font>");
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
								bet_str=bet_str.replaceAll("胜", "胜("+spvalue.split(",")[0]+")").replaceAll("平", "平("+spvalue.split(",")[1]+")").replaceAll("负", "负("+spvalue.split(",")[2]+")");
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
								if(result!=""&&bet_str.indexOf(result)!=-1){
								bet_str=bet_str.replace(result+"("+sp+")","<font   class='cm_red'><b>"+result+"("+sp+")"+"</b></font>");
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
								bet_str=bet_str.replaceAll("七","7("+spvalue.split(",")[6]+")");
							}
						}else{
//							ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
						//	$("#operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
							$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
						}
						
						
					
						tmpData = {id:id};
						spv=spvalue.split(",")[0];
						if(o%2==1){odd="odd";}
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
					html += '过关方式为 ';
				}else{
					html += '已上传';
						if(lotid==70){
							$("#yhdetail").hide();
						}
					var yhfslist = ['平均优化', '博热优化', '博冷 优化'];
					var yhfile = codes.replace("_n.txt","_yd.xml");
					$("#yhdetail").click(function(){
						var bw = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement : document.body;
						var d_left = ($(window).width()-$("#yhinfodiv").css("width").replace("px",""))/2;
						var d_top = 100;
						$("#yhinfodiv").css("top", d_top + bw.scrollTop + "px");
						$("#yhinfodiv").css("left", d_left + "px");
						$('.yclass_mask_panel').show();
						$("#yhinfodiv").show();
//						Y.openUrl('/game/yhdetail.html?yhfile='+yhfile+'&lotid='+lotid+'',500,310);
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
										jjyhstr += '<td ><strong>场次</strong></td>';
										jjyhstr += '<td class="th1">比赛</td>';
										jjyhstr += '<td class="th1">让球数</td>';
										jjyhstr += '<td class="th1">您的选择</td>';
									}else{
										jjyhstr += ' <colgroup><col width="175"><col width="205"><col width=""></colgroup><tbody><tr class="odd">';
										jjyhstr += '<td>场次</td>';
										jjyhstr += '<td class="th1">比赛</td>';
										/*jjyhstr += '<td width="57"><strong>让球数</strong></td>';*/
										jjyhstr += '<td class="th1">您的选择</td>';
									}
									
									jjyhstr += '</tr>';
									var yhmatchsList = yhmatchs.split(",");
									for(var i=0;i<yhmatchsList.length;i++){
										var ms = yhmatchsList[i].replace("]","").split("=");
										var minfo= $_sys.getarryname(matchdata,ms[0]);
											
										
					    	   			
					    	   			var minfoarr = minfo.split("_");
										jjyhstr += '<tr>';
										jjyhstr += '<td>'+minfoarr[0]+'</td>';
										jjyhstr += '<td>'+minfoarr[1] + " VS " + minfoarr[3] +'</td>';
										if(lotid == 72){
											jjyhstr += '<td>'+minfoarr[2]+'</td>';
										}
										if(lotid == 72 || lotid== 90 || lotid== 92){
											jjyhstr += '<td >'+$_sys.getspfsel(ms[1])+'</td>';
										}else{
											jjyhstr += '<td >'+ms[1]+'</td>';
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
											var mt = marr[j].split("=");
											var minfo= $_sys.getarryname(matchdata,mt[0]);
						    	   			var minfoarr = minfo.split("_");
						    	   			if(lotid == 72 || lotid== 90|| lotid== 92){
												mstr += minfoarr[0] + minfoarr[1] + "(" + $_sys.getspfsel(mt[1]) + ")  ";
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
									
									$("#yhdetailDIV").html(jjyhstr);
								});
							}
						});
						
					});
					
					
				}
				html += '<em>'+ggstr+'</em>';
				$("#pro_gg").html(html);
				if(lotid>=90 || lotid==70 || lotid==72 ){
//					html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
					if(Class.C("caststate") == 3){
					$("#operate3").click(function(){
					billcode(lotid,projid);
					}).show();
					//.html("<a href='javascript:void(0);'class='f_a_d' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细<a>").show();
					
					}
				}
//				html += '</p>';
//				$(".zc_hm_fann").append(html);
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
//				   hhhtml += '<td class="sp">计奖SP</td>';
				   hhhtml += '</tr></thead>';
				   hhhtml += '<colgroup><col width="60"><col width="110"><col width="180"><col width="130"><col width="80">';
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
							result="<font   class='cm_red'>延</font>";
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
									hhhtml += ' (<font  class="cm_red">'+bf+'</font>)';
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
					ggstr= gg+'&nbsp;<font  class="cm_red">'+isdystr+'</font>';
					$("#pro_gg").html("过关方式：<em>"+ggstr+"</em>");
					$("#buy_info").html(hhhtml);
			}else{
				var dzhtml = '<thead><tr><td rowspan="2">序号</td>';
				dzhtml += '<td rowspan="2">比赛时间</td>';
				if(lotid==94 || lotid==96){
					dzhtml += '<td rowspan="2">客队 vs 主队</td>';
				}else if(lotid==95){
					dzhtml += '<td rowspan="2">客队 vs 主队</td>';
					dzhtml += '<td rowspan="2"> 让分 </td>';
				}else if(lotid==97){
					dzhtml += '<td rowspan="2">客队 vs 主队</td>';
					dzhtml += '<td rowspan="2"> 预设总分</td>';
				}
				
				
				

				dzhtml += '<td rowspan="2">全场比分</td>';
				dzhtml += '<td rowspan="2">彩果</td>';
				dzhtml += '<td rowspan="2">投注选项</td>';
				
				dzhtml += '<td rowspan="2">胆码</td>';
				
				if(lotid==95 || lotid==97){
					dzhtml += '<col width="50"><col width="180"><col width="190"><col width="80"><col width="90"><col width="95"><col width="200"><col><tbody>';
				}else{
				dzhtml += '<col width="50"><col width="180"><col width="190"><col width="100"><col width="100"><col width="250"><col><tbody>';
				}
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
						dzhtml += '<td>'+bt+'</td>';	
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
					html += '过关方式为 ';
				}else{
					html += '已经上传 ';
				}
				html += '<em>'+ggstr+'</em>';
				$("#pro_gg").html(html);
//				html += Class.C("caststate") == 3 ? "&nbsp;&nbsp;<a href='javascript:void(0);' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细</a>" : "";
				html += '</p>';
				if(Class.C("caststate") == 3){
				//$("#operate3").html("<a href='javascript:void(0);' class='f_a_d' onclick=\'billcode(\""+lotid+"\",\""+projid+"\")\'>出票明细<a>").show();
				$("#operate3").click(function(){
					billcode(lotid,projid);
				}).show();
				}
			//$(".zc_hm_fann").append(html);
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
			
		   
			dzhtml += '<td rowspan="2">比分</td>';
			dzhtml += '<td rowspan="2">彩果</td>';
			dzhtml += '<td rowspan="2">投注选项</td></tr>';
			
			dzhtml += '</thead>';
			dzhtml += '<colgroup><col width="50"><col width="120"><col width="220"><col width="120"><col width="260">';
			dzhtml += '<col/></colgroup><tbody>';
	
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
//					ggstr='<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>';
				//	$("operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
				$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
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
						result="<font   class='cm_red'>*</font>";
					}else{
						if(hs!="" && vs!=""){bf=hs+":"+vs;}
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
							bet_str=bet_str.replace(result,"<font   class='cm_red'><b>"+result+"</b></font>");
//							cls="style='background-color:#ffd6cc'";
						}else{
							cls="";
						}
						
						if(bet_str=="#"){bet_str="";}
					if(lotid==80 || lotid ==81|| lotid ==83){
					bet_str = bet_str.replaceAll("3","胜").replaceAll("2","2 ").replaceAll("1","平").replaceAll("0","负 ");
					result = result.replaceAll("3","胜").replaceAll("2","2 ").replaceAll("1","平").replaceAll("0","负 ");
					}
					if(lotid==82 && bf!="--" && bf!=""){
						result=result.split(",");
						bet_str=bet_str.split("<br/>");
//						|| bet_str.indexOf("[客]"+result[1]!=-1)
						if(bet_str[0].indexOf(result[0])!=-1 ){
							bet_str[0]=bet_str[0].replace(result[0],"<font   class='cm_red'><b>"+result[0]+"</b></font>");
							bet_str[0]=bet_str[0].replace("[主]","<font   class='cm_red'><b>[主]</b></font>");
						}
						if(bet_str[1].indexOf(result[1])!=-1 ){
							bet_str[1]=bet_str[1].replace(result[1],"<font   class='cm_red'><b>"+result[1]+"</b></font>");
							bet_str[1]=bet_str[1].replace("[客]","<font   class='cm_red'><b>[客]</b></font>");
						}
						 bet_str=bet_str[0]+"<br/>"+bet_str[1];
						result="[主]"+result[0]+"<br/>[客]"+result[1];
					}
					}
					
					bf=bf==""?"&nbsp":bf;
					result=result==""?"&nbsp":result;
					bet_str=bet_str==""?"&nbsp":bet_str;
					if(o%2==1){odd="odd";}
					dzhtml += '<tr class="'+odd+'">';
					dzhtml += '<td>'+id+'</td>';
					dzhtml += '<td>'+bt+'</td>';	
					dzhtml += '<td>'+hn+'&nbsp;vs&nbsp;'+gn+'</td>';
					
					
					dzhtml += '<td>'+bf+'</td>';
					dzhtml += '<td>'+result+'</td>';
					dzhtml += '<td '+cls+'>'+(bet_str)+dan+'</td>';
//					dzhtml += '<td>'+sp+'</td>';
					dzhtml += '</tr>';
					i++;
				});
				
				if(type==0){
					dzhtml += '<p>';
					
					dzhtml += ggstr+'</p>';
				}
				$("#pro_gg").html("过关方式：<em>"+ggstr+"</em>");
				$("#buy_info").html(dzhtml);
		},
		error : function() {
			if(type=="1"){
				$("#buy_info").html($_sys.showcode(lotid,codes));
			}else{
//				$("#ccodes").html('方案已传，请点击<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="a1">下载</a>');
			//	$("operate").html('<a href="/cpdata/pupload/'+lotid+'/'+expect+'/'+codes+'" target="_blank" class="f_a_d">方案下载<a>').show();
				$("#operate").attr("href","/cpdata/pupload/"+lotid+"/"+expect+"/"+codes+"").show();
			}
			return false;
		}
	});	
};