Class(
		'Application',{
    use: 'tabs,dataInput,mask,countDown',
	ready:true,
	index:function(config){
		
        this.listHotProject(1, 5, "table_hot_project");
	},
	listHotProject:function(pn, ps, toId){
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
				var html="";
				if(code == 0){
					if(rb){
						r = obj.Resp.row;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = rt.gid;
//							<tr>
//			                <td>小女子博竞彩</td>
//			                <td>竞彩混投</td>
//			                <td>￥888.88</td>
//			                <td>3232</td>
//			                <td><p><input type="text" value="1"><a href="#">购买</a></p></td>
//			            </tr>
							 html += '<tr>';

							html += '<td >' + rt.nickid+ '</td>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
						
						
							html += '<td>' + rt.lnum + '</td>';
							
							html += '<td ><p><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></p></td>';//lotid,projid,id,lnum
							
							html += '</tr>';
//							$(html).appendTo($("#" + toId));
							$("#gqhothemai").html(html)
						});
					}
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	},
	})
//	rengou = function(lotid,projid,id,lnum){
//		Y.postMsg('msg_login', function (){
//			var buynum = $("#" + id).val();
//			if(buynum == ''){
//				Y.alert('您好，认购份数不能为空！');
//				return false;
//			}
//			if(buynum <= 0 || Y.getInt(buynum) != buynum){
//				Y.alert('您好，认购份数必须为大于等于1的整数！');
//				return false;
//			}
//			
//			if(Y.getInt(buynum) > lnum){
//				Y.alert('您好，认购份数不能大于剩余份数！');
//				return false;
//			}
//			
//			dobuy = function(){
//				Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
//		    	Y.postMsg('msg_login', function (){	
//			        Y.ajax(
//			        {
//						 url: $_trade.url.pjoin,
//						 type:'POST',
//						 data:{
//							gid:lotid,
//							hid:projid,
//							bnum:buynum
//						 },
//			            end:function(d)
//			            {
//			            	var obj = eval("(" + d.text + ")");
//		  					var code = obj.Resp.code;
//		  					var desc = obj.Resp.desc; 
//		        			Y.alert.close();
//		        			if (code == "0") {        				
//		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
////		        				page(Class.C("pn"));
//		        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
//		        			} else {
//		        				if (code=="6"){
//		        					Y.addMoney();
//		        				}else{
//		        					Y.alert('对不起，认购失败,请重新认购！'+desc);
//		        				}
//		        				
//		        			}
//			            },
//		        		error : function() {
//		        			Y.alert("网络故障, 请检查您的帐户再重新投注!");
//		        			return false;
//		        		}
//			        });   
//		    	});
//			};
//			Y.confirm("您好，本次认购金额为"+buynum+"元，请确认！",dobuy,''); 
//		});
//	};