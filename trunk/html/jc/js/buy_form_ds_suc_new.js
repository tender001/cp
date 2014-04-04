/* 竞彩单式确认发起方案*/
Class( 'BuyFormsuc', {
	use   : 'tabs,mask',
	ready : true,
	_param : {},
	index : function() {
		var Y = this;
		var buyTabs;
		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id
		Class.config('submitting', false);  //是否正在提交中

		buyTabs = this.lib.Tabs({
            items:'#all_form b',
            focusCss:'cur',
            contents: '#dg_form,#hm_form'
        });
		
		//购买方式
        buyTabs.onchange = function (a, b){
             this.get('#ishm').val(b==1? 1 : 0);
        };
        buyTabs.focus(1);
        
		this.dgBtn       = this.get('#dg_btn');
		this.hmBtn       = this.get('#hm_btn');
		this.agreement   = this.need('#agreement');
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
		if (this.need('#ishm').val() == 1) {
			this.getHmHtmlElement();
			this.hmInit();
			this.doHmThings();
			this.title_word_count.html(this.title.val().length);
			this.content_word_count.html(this.content.val().length);
		}
		var matchdata = [];	
		var match_len=$("#yhdetail tr[id]").length;
		for(var i=0;i<match_len;i++){
			var id=$("#match"+i+" td[title]" ).attr("title");
			var mid=$("#match"+i+" td[title]" ).html();
			var sp=$("#match"+i+" td[sp]" ).html();
			var hn=$("#match"+i+" td[hn]" ).html();
			matchdata.push([id,mid + "_"+hn+"_"+sp ]);
		}
		
		var yhfslist = ['平均优化', '博热优化', '博冷 优化'];
						var rand=$("#rand").val();
						var lotid=$("#lotid").val();
//						Y.openUrl('/game/yhdetail.html?yhfile='+yhfile+'&lotid='+lotid+'',500,310);
						Y.ajax({
							type : 'GET',
							url : '/cpdata/pupload/temp/'+rand+'_yd.xml',
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
										jjyhstr += ' <colgroup><col width="123"><col width="205"><col width=""></colgroup><tbody><tr class="odd">';
										jjyhstr += '<td>场次</td>';
										jjyhstr += '<td class="th1">比赛</td>';
										jjyhstr += '<td class="th1">您的选择</td>';
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
											var mt="";
											betstr="";
											
											if(lotid==70){
												mt= marr[j].split(">");
											}else{
												mt= marr[j].split("=");
											}
						    	   			var minfo= $_sys.getarryname(matchdata,mt[0]);
						    	   			var minfoarr = minfo.split("_");
										
						    	   			if(lotid == 70){
												var ss=/\((-?\d+)\)/.exec(minfoarr[1])[1];
												var lose=minfoarr[2]>0?"<em>"+ss+"</em>":"<s>"+ss+"</s>"
						    	   				var mlen=mt[1].split("+");
												for(var n=0;n<mlen.length;n++){
													if(mlen[n].split("=")[0]=="RSPF"){
														betstr +=lose+"["+$_sys.getspfsel(mlen[n].split("=")[1])+"]</br>";
													}if(mlen[n].split("=")[0]=="SPF"){
														betstr +="["+$_sys.getspfsel(mlen[n].split("=")[1])+"]</br>";
													}if(mlen[n].split("=")[0]=="CBF"){
														betstr +="["+mlen[n].split("=")[1]+"]</br>";
													}if(mlen[n].split("=")[0]=="JQS"){
														betstr +="["+mlen[n].split("=")[1]+"]</br>";
													}if(mlen[n].split("=")[0]=="BQC"){
														betstr +="["+$_sys.getspfsel(mlen[n].split("=")[1])+"]</br>";
													}
												}
						    	   			}else{
						    	   				betstr=mt[1];
						    	   			}
						    	   			if( lotid== 90|| lotid== 92){
												mstr += minfoarr[1].split("VS")[0] + "["+$_sys.getspfsel(betstr)+"]</br>";
											}else if(lotid == 70){
												mstr +=  minfoarr[1].split("(")[0] +betstr ;
											}else if(lotid == 72){
												mstr += minfoarr[1].split("(")[0] + "["+$_sys.getspfsel(betstr)+"]&nbsp;&nbsp;";
											}else{
												mstr +=  minfoarr[1].split("VS")[0] + "["+betstr+"]</br>";
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
		$("#show_detail").click(function(){
			var bw = (document.documentElement && document.documentElement.scrollTop) ? document.documentElement : document.body;
			var d_left = ($(window).width()-$("#yhinfodiv").css("width").replace("px",""))/2;
			var d_top = 100;
			$("#yhinfodiv").css("top", d_top + bw.scrollTop + "px");
			$("#yhinfodiv").css("left", d_left + "px");
			$('.yclass_mask_panel').show();
			$("#yhinfodiv").show();
		});
		
		$("#gkfs em").each(function(){
			$(this).click(function(){
				$("#gkfs em").removeClass("cur");
				$(this).addClass("cur");
				$("#gk").val($(this).attr("value"));
			});
		});
		
		$("#tc b").each(function(){
			$(this).click(function(){
				$("#tc b").removeClass("cur");
				$(this).addClass("cur");
				$("#tcbili").val($(this).attr("value"));
			});
		});
		
		this.dgBtn.click( function() {
			Y.postMsg('msg_login', function() { //是否登入
				if (!Class.config('submitting')) {
					Class.config('submitting', true);
					Y.doDg();
				}
			} );
		} );

		this.hmBtn.click( function() {
			Y.postMsg('msg_login', function() { //是否登入
				if (!Class.config('submitting')) {
					Class.config('submitting', true);
					Y.doHm();
				}
			} );
		} );

		//创建一个公共弹窗, 使用msg_show_dlg进行调用
		this.infoLay = this.lib.MaskLay('#defLay', '#defConent');
		this.infoLay.addClose('#defCloseBtn', '#defTopClose');
		this.get('#defLay div.tantop').drag(this.get('#defLay'));

		// 提供弹窗服务
		this.onMsg('msg_show_dlg', function (msg, fn, forbid_close) {
			this.infoLay.pop(msg, fn, forbid_close);
		});

		// 余额不足请充值的弹窗
		this.addMoneyDlg = this.lib.MaskLay('#addMoneyLay');
		this.addMoneyDlg.addClose('#addMoneyClose', '#addMoneyYes');
		this.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
		this.onMsg('msg_show_addmoney', function (fn, args) {
			this.addMoneyDlg.pop(false, function (e, btn) {
				if (typeof fn === 'function' && btn.id == 'addMoneyYes') {
					fn(args);
				}
			})
		});

	},

	// 发起代购
	doDg : function() {
		this.getParam();
		if (this.check() == true) {
			this.getMoney( function() {
				this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
				this.submit();
			} );
		} else {
			Class.config('submitting', false);
		}
	},

	// 发起合买
	doHm : function() {
		this.getParam();
		this.getHmParam();
		if (this.check() == true && this.hmCheck() == true) {
			this.getMoney( function() {
				this.postMsg('msg_show_dlg', '正在提交您的请求, 请稍候...', null, true);
				this.submit();
			} );
		} else {
			Class.config('submitting', false);
		}
	},

	// 检测余额，不足的话提示充值
	getMoney : function(fn) {
		var cost_money = this._param.ishm == 0 ? this._param.totalmoney : 
		                 this._param.totalmoney / this._param.allnum * this._param.buynum;

		this.ajax( {
			  url:Class.C('url-login-user'),
            end:function (data){
                var info, showText, Y;
                Y = this;
                if (data.error) {
                    Class.config('submitting', false);
                }else{
              	   var obj = eval("(" + data.text + ")");
	   			       var code = obj.Resp.code;
	   				   var r = obj.Resp.row;
						   if (code=="0"){
							   if (r.usermoeny-cost_money<0) {
	                              this.postMsg('msg_show_addmoney',function (){
	                                  window.open($_user.daohang.addmoney);     
	                              });
	                              Class.config('submitting', false);
	                          }else{
	                              fn.call(this);
	                          }
						   } 
                }
            }			
		} );
	},

	// 获取发起时必须的参数
	getParam : function() {
		this._param.lotid  = this.need('#lotid').val();
		this._param.playid = this.need('#playid').val();
		this._param.playtype = this.need('#playtype').val();
		this._param.expect = this.need('#expect').val();

		this._param.beishu = this.need('#beishu').val();
		this._param.codes = this.need('#codes').val();
		this._param.totalmoney = this.need('#totalmoney').val();
		this._param.isCutMulit = this.need('#IsCutMulit').val(); //注数去重
		
		this._param.ggtype = this.need('#ggtype').val();
		this._param.ggname = this.need('#ggname').val();
		this._param.initems = this.need('#initems').val();
		this._param.items = this.need('#items').val();
		this._param.rand = this.need('#rand').val();
		this._param.source = this.need('#source').val();
		this._param.ishm = this.need('#ishm').val();
	    
	},

	// 获取合买发起时必须的参数
	getHmParam : function() {
		this._param.allnum = parseInt(this.allnum.val()) || 0;
		this._param.buynum = parseInt(this.buynum.val()) || 0;
		this._param.isbaodi = this.isbaodi.prop('checked') ? 1 : 0;
		this._param.baodinum = this._param.isbaodi == 1 ? (parseInt(this.baodinum.val()) || 0) : 0;
		this._param.tcbili = this.tcbili.val(); //提成比例
		this._param.isshow = this.need('#gk').val();
		if (this.optional_info.prop('checked') == true) {
			this._param.title = this.title.val().trim();
			if (this._param.title == '') {
				this._param.title = this.title.attr('default');
				this.title.val(this._param.title);
			}
			this._param.content = this.content.val().trim();
			if (this._param.content == '') {
				this._param.content = this.content.attr('default');
				this.content.val(this._param.content);
			}
		} else {
			this._param.title = this.title.attr('default');
			this._param.content = this.content.attr('default');
		}
	},

	// 基本的检测
	check : function() {
		if (!this.agreement.prop('checked')) {
			this.postMsg('msg_show_dlg', '您需要阅读并且同意《用户合买代购协议》，才能够使用我们的服务。');
		} else {
			return true;
		}
		return false;
	},

	// 合买的发起检测
	hmCheck : function() {
		if (this._param.totalmoney * 100 % this._param.allnum != 0) {
			this.postMsg('msg_show_dlg', '！每份金额不能除尽，建议分成'+this.divideAdvice(this._param.allnum)+'份，请重新填写份数。');
		} else if (this._param.totalmoney / this._param.allnum < 1) {
			this.postMsg('msg_show_dlg', '每份金额至少要为1元，请重新填写份数。');
		} else if (this._param.buynum / this._param.allnum < 0.05) {
			this.postMsg('msg_show_dlg', '至少需要认购5%，请重新填写认购份数。');
		} else if (this._param.buynum > this._param.allnum) {
			this.postMsg('msg_show_dlg', '购买份数大于所分的份数，请重新填写。');
		} else if (this.isbaodi.prop('checked') && (this._param.baodinum / this._param.allnum < 0.05)) {
			this.postMsg('msg_show_dlg', '至少需要保底5%，请重新填写保底份数。');
		} else if (this.isbaodi.prop('checked') && (this._param.baodinum + this._param.buynum > this._param.allnum)) {
			this.postMsg('msg_show_dlg', '购买份数加保底份数不能大于总份数。');
		} else {
			return true;
		}
		return false;
	},

	submit : function() {		  
		  var param= this._param;
		  var swap = true;
          if (swap){
	          var param_new ;
        	  if (param.ishm==0){
             	 param_new={
             			 lotid:param.lotid,// 游戏编号
             			 expect:param.expect,// 期次编号
             			 play:1,// 玩法编号
             			 ggtype:param.ggtype,// 过关
             			 ggname:param.ggname,// 自定义
             			 initems:param.initems,// 文件是否包含场次
             			 items:param.items,// 场次
         				 codes:param.codes,
         				 rand:param.rand,
         				 beishu:param.beishu,// 投注倍数
         				 ishm:0,// 方案类型
         				 title:param.ishm==0?"竞彩代购":param.title,// 方案标题
         				 content:param.ishm==0?"竞彩代购":param.content,// 方案描叙
         				 amoney:param.totalmoney,// 方案金额
         				 allnum:1,// 方案份数
         				 buynum:1,// 购买份数
         				 baodinum:0,// 保底份数
         				 isshow:0,// 公开标志
         				 tcbili:0,// 提成比率
         				 comeFrom:'',// 方案来源
         				 source:param.source,// 投注来源
         				 endTime:'' // 截止时间
                      };	 
              }else{
             	 param_new={
             			 lotid:param.lotid,// 游戏编号
             			 expect:param.expect,// 期次编号
         				 play:1,// 玩法编号
         				 ggtype:param.ggtype,// 过关
         				 ggname:param.ggname,// 自定义
         				 initems:param.initems,// 文件是否包含场次
         				 items:param.items,// 场次
         				 codes:param.codes,//
         				 rand:param.rand,
         				 beishu:param.beishu,// 投注倍数
         				 ishm:param.ishm,// 方案类型
         				 title:param.title,// 方案标题
         				 content:param.content,// 方案描叙
         				 amoney:param.totalmoney,// 方案金额
         				 allnum:param.allnum,// 方案份数
         				 buynum:param.buynum,// 购买份数
         				 baodinum:param.isbaodi==1?param.baodinum:0,// 保底份数
         				 isshow:param.isshow,// 公开标志
         				 tcbili:param.tcbili,// 提成比率
         				 comeFrom:'',// 方案来源
         				 source:param.source,// 投注来源
         				 endTime:'' // 截止时间
                      };	 
              }  
        	  this._param = param_new;      
          }		 
		
		for ( var _i in this._param) {
			this._param[_i] = encodeURIComponent(this._param[_i]);
		}
		
		this.ajax( {
			url  : '/phpt/jc/step_5.phpx',//
			type : 'post',
			data : this._param,
			retry: 1,
			dataType : "json",
			end  : function(data) {
				if (data.error) {
					this.postMsg('msg_show_dlg', '网络故障, 请检查您的投注记录后重新提交!');
					Class.config('submitting', false);
				} else {
					var obj = eval("(" + data.text + ")");
  					var code = obj.Resp.code;
  					var desc = obj.Resp.desc;
        			this.alert.close();
        			if (code == "0") {          				   		
        				this.postMsg('msg_show_dlg', '恭喜你投注成功！', null, true);
        				var r = obj.Resp.result;			
        				var projid = r.projid;
        				var balance = r.balance;
        				location.href = $_sys.getlotdir(this._param.lotid)+$_sys.url.viewpath+'?lotid='+this._param.lotid+'&projid='+projid;   
        			} else {
        				this.postMsg('msg_show_dlg', desc);
        				Class.config('submitting', false);
        			}
				}
			}
		} );
	},

	// 获取合买页面中必需的一些元素
	getHmHtmlElement : function() {
		this.allnum = this.need('#allnum');
		this.buynum = this.need('#buynum');
		this.buynum_money = this.need('#buynum_money');
		this.buynum_scale = this.need('#buynum_scale');
		this.buynum_tip = this.need('#buynum_tip');
		this.isbaodi = this.need('#isbaodi');
		this.baodinum = this.need('#baodinum');
		this.baodi_money = this.need('#baodi_money');
		this.baodi_scale = this.need('#baodi_scale');
		this.baodi_tip = this.need('#baodi_tip');
		this.tcbili = this.need('#tcbili'); //提成比例
				
		this.optional_info = this.need('#optional_info');
		this.optional_info_1 = this.need('#optional_info_1');
		this.title = this.need('#title');
		this.title_word_count = this.need('#title_word_count');
		this.content = this.need('#content');
		this.content_word_count = this.need('#content_word_count');
	},

	hmInit : function() {
		this.totalMoney = parseInt(this.need('#totalmoney').val());  //方案总金额
		this.allnum.val(this.totalMoney);
		this.isbaodi.prop('checked', false);
		this.baodinum.val('').prop('disabled', true);
		this.optional_info.prop('checked', false);
		this.optional_info_1.hide();
		this.title.val(this.title.attr('default'));
		this.content.val(this.content.attr('default'));
		this.processSplitNum();
	},

	// 合买页面的一些处理
	doHmThings : function() {
		var Y = this;

		this.allnum.keyup( function() {  //我要分成多少份的处理
			Y.processSplitNum();
		} ).blur( function() {
			Y.processSplitNum();
		} );

		this.buynum.keyup( function() {  //我要认购多少份的处理
			Y.processBuyNum();
		} ).blur( function() {
			Y.processBuyNum();
		} );

		this.isbaodi.click( function() {  //是否保底的选择
			if (Y.isbaodi.prop('checked')) {
				var all_num = parseInt(Y.allnum.val());
				Y.baodinum.prop('disabled', false).val( Y.allnum.val() ? Math.ceil(all_num - (Y.get('#buynum').val()*1)) : '' );
				Y.baodinum.one().focus();
				Y.processBaodiNum();
				Y.get('#bdtotal').html(Y.baodinum.val());
				Y.get('#zftotal').html(parseInt(Y.buynum.val())+parseInt(Y.baodinum.val()));
			} else {
				Y.baodi_tip.hide();
				Y.baodinum.prop('disabled', true).val('');
				Y.baodi_money.html('￥0.00');
				Y.baodi_scale.html('0%');
				Y.get('#bdtotal').html("0");
				Y.get('#zftotal').html(Y.buynum.val());
			}
		} );

		this.baodinum.keyup( function() {  //我要保底多少份的处理
			Y.processBaodiNum();
		} ).blur( function() {
			Y.processBaodiNum();
		} );

		this.optional_info.click( function() {  //显示或隐藏可选信息
			Y.optional_info_1.show(Y.optional_info.prop('checked'));
		} );

		Y.defaultTitleCleared = false;
		this.title.keyup( function() {  //限制方案标题的长度
			if (Y.title.val().length > 20) {
				Y.title.val(Y.title.val().substr(0, 20));
			}
			Y.title_word_count.html(Y.title.val().length);
		} ).focus( function() {
			if (!Y.defaultTitleCleared) {
				Y.title.val('');
				Y.title_word_count.html(0);
				Y.defaultTitleCleared = true;
			}
		} );

		Y.defaultContentCleared = false;
		this.content.keyup( function() {  //限制方案描述的长度
			if (Y.content.val().length > 200) {
				Y.content.val(Y.content.val().substr(0, 200));
			}
			Y.content_word_count.html(Y.content.val().length);
		} ).focus( function() {
			if (!Y.defaultContentCleared) {
				Y.content.val('');
				Y.content_word_count.html(0);
				Y.defaultContentCleared = true;
			}
		} );

	},
	
	processSplitNum : function() {
		var all_num, Y = this;
		all_num = parseInt(Y.allnum.val());
		if (!all_num) {
			Y.allnum.val('');
		} else {
			Y.buynum.val(Math.ceil(all_num * 0.05));
			if (Y.isbaodi.prop('checked')) {
				Y.baodinum.val(Math.ceil(all_num * 0.05));
			}
		}
		Y.processBuyNum();
		Y.isbaodi.prop('checked') && Y.processBaodiNum();
	},

	processBuyNum : function() {
		var buy_num, all_num, min_num, Y = this;
		all_num = parseInt(Y.allnum.val());
		buy_num = parseInt(Y.buynum.val());
		if (!all_num || !buy_num) {
			Y.buynum.val('');
			Y.buynum_money.html('￥0.00');
			Y.buynum_scale.html('0.00%');
			Y.buynum_tip.hide(!all_num);
			Y.get('#rgtotal').html("0");
			Y.get('#zftotal').html(parseInt(Y.baodinum.val()));
		} else {
			Y.buynum.val(buy_num);
			Y.get('#rgtotal').html(buy_num);
			Y.buynum_money.html( (Y.totalMoney / all_num * buy_num).rmb() );
			Y.buynum_scale.html( (Y.fixNum(buy_num * 100 / all_num)).toFixed(2) + '%' );
			min_num = Math.ceil(all_num * 0.05);  //最少需认购5%
			if (buy_num < min_num || buy_num > all_num) {
				var _span = Y.buynum_tip.one().getElementsByTagName('span');
				_span[0].innerHTML = min_num;
				_span[1].innerHTML = all_num;
				Y.buynum_tip.show();
			} else {
				Y.buynum_tip.hide();
			}
			Y.get('#rgtotal').html(parseInt(buy_num));
			if (Y.isbaodi.prop('checked')) {
				Y.get('#zftotal').html(parseInt(buy_num)+parseInt(Y.baodinum.val()));
			}else{
				Y.get('#zftotal').html(parseInt(buy_num));
			}
		}
	},

	processBaodiNum : function() {
		var baodi_num, all_num, min_num, Y = this;
		all_num   = parseInt(Y.allnum.val());
		baodi_num = parseInt(Y.baodinum.val());
		if (!all_num || !baodi_num) {
			Y.baodinum.val('');
			Y.baodi_money.html('￥0.00');
			Y.baodi_scale.html('0.00%');
			Y.baodi_tip.hide(!all_num);
			return;
		}
		Y.baodinum.val(baodi_num);
		this.need('#bdtotal').html(baodi_num);
		Y.baodi_money.html( (Y.totalMoney / all_num * baodi_num).rmb() );
		Y.baodi_scale.html( (Y.fixNum(baodi_num * 100 / all_num)).toFixed(2) + '%' );
		min_num = Math.ceil(all_num * 0.05);  //最少需保底5%
		Y.baodi_tip.show(baodi_num < min_num);
		this.need('#zftotal').html(parseInt(Y.buynum.val())+baodi_num);
	},

	// 除不尽时建议分成多少份
	divideAdvice : function(num) {
		var total_money = this.totalMoney;
		for (var i = num; i <= total_money; i++) {
			if (total_money * 100 % i == 0) {
				return i;
			}
		}
	},

	fixNum : function(n) {
		return parseFloat((parseInt(n * 100) / 100).toFixed(2));
	}
});