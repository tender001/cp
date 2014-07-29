$(document).ready(function(){
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
	$("#scrollDiv").textSlider({
		line:2,
		speed:1000,
		timer:2000
		})

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
	rengou = function(lotid,projid,id,lnum){
		Y.postMsg('msg_login', function (){
			var buynum = $("#" + id).val();
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				return false;
			}
			
			if(Y.getInt(buynum) > lnum){
				Y.alert('您好，认购份数不能大于剩余份数！');
				return false;
			}
			
			dobuy = function(){
				Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
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
		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
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
			};
			Y.confirm("您好，本次认金额为"+buynum+"元，请确认！",dobuy,''); 
		});
	};
	listProject = function(lotid, pid, state, findstr, fsort, dsort, ps, pn, toId){
		var data={gid:lotid, pid:lotid, state:state, find:findstr, fsort:fsort, dsort:dsort, ps:ps, pn:pn};
		$("#" + toId+ " tr[id]").remove();
		Y.ajax({
			url : $_trade.url.plist,
			type : "POST",
			dataType : "json",
			data : data,
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.xml;
				if(rb){
					rb = !!obj.Resp.xml.row;
				}
				if(code == 0){
					if(rb){
						r = obj.Resp.xml.row;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = lotid;
							var html = '<tr id='+rt.nid+'>';
							html += '<td>';
							if(rt.iorder > 0 && rt.jindu != 100){
								html += '<img src="/images/index_93.gif" />';
							}else{
								html += (o+1);
							}
							html += '</td>';
							html += '<th>' + $_sys.showzhanjiname(gameid,rt.cnickid,'award');
							html += '&nbsp;' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,rt.cnickid,rt.aunum,rt.agnum)+'&nbsp;&nbsp;')) + '</th>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<font>(保' + (rt.pnum*100/rt.nums).toFixed(0) + '%)</font>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td><font>' + rt.lnum + '</font></td>';
							if(rt.lnum == 0 || rt.istate != 1){
								if(rt.istate > 2){
									html += '<td>已撤单</td>';
								}else if(rt.istate == 2){
									html += '<td>已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td><div><input type="text" value="1" id="rengou_' + rt.nid + '" /><a href="#"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+lotid+'\',\''+rt.cprojid+'\',\'rengou_' + rt.nid +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.cprojid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
							$(html).appendTo($("#" + toId));
						});
					}
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	};
	
	listHotProject = function(pn, ps, toId){
		Y.ajax({
			url : $_trade.url.hlist,
			type : "POST",
			dataType : "json",
			data : {
				pn : pn,
				ps : ps
			},
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.row;
				if(code == 0){
					if(rb){
						r = obj.Resp.row;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = rt.gid;
							var html = '<tr id='+(o+1)+'>';
							html += '<td>';
							if(rt.iorder > 0 && rt.jindu != 100){
								html += '<img src="/images/index_93.gif" />';
							}else{
								html += (o+1);
							}
							html += '</td>';
							html += '<th>' + $_sys.showzhanjiname(gameid,rt.nickid,'award');
							html += '&nbsp;'+ (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'&nbsp;':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum)+'&nbsp;&nbsp;')) + '</th>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<font>(保' + (rt.pnum*100/rt.nums).toFixed(0) + '%)</font>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td><font>' + rt.lnum + '</font></td>';
							if(rt.lnum == 0 || rt.state != 1){
								if(rt.state > 2){
									html += '<td>已撤单</td>';
								}else if(rt.state == 2){
									html += '<td>已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td><div><input type="text" value="1" id="hot_rengou_' + (o+1) + '" /><a href="#"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'hot_rengou_' + (o+1) +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
							$(html).appendTo($("#" + toId));
						});
					}
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	};
	//listHotProject(1, 15, "table_hot_project");
	//listProject("90", "1", 0, "", "jindu", "descending", 15, 1, "table_jjc_project");
});
$.fn.textSlider = function(settings){    
    settings = jQuery.extend({
        speed : "normal",
        line : 2,
        timer : 3000
    }, settings);
    return this.each(function() {
        $.fn.textSlider.scllor( $( this ), settings );
    });
};
$.fn.textSlider.scllor = function($this, settings){
    var ul = $("table:eq(0)",$this );
    var timerID;
    var li = ul.children();
    var liHight=$(li[0]).height();
    var upHeight=0-settings.line*liHight;//滚动的高度；
    var scrollUp=function(){
        ul.animate({marginTop:upHeight},settings.speed,function(){
            for(i=0;i<settings.line;i++){
                ul.find("tr:first",$this).appendTo(ul);
            }
            ul.css({marginTop:0});
        });
    };
    var autoPlay=function(){
        timerID = window.setInterval(scrollUp,settings.timer);
    };
    var autoStop = function(){
        window.clearInterval(timerID);
    };
    //事件绑定
    ul.hover(autoStop,autoPlay).mouseout();
};
