Y.use('mask', function(){    
    var dlg = this.lib.MaskLay('#info_dlg','#info_dlg_content');
    dlg.addClose('#info_dlg_close,#info_dlg_ok');
    dlg.get('#info_dlg div.tan_top').drag('#info_dlg');
    Y.extend('uploadSuccess', function(){
    	dlg.pop('您好，恭喜您方案上传成功!<br/>');
    }); 
    Y.extend('uploadErr', function (msg){    	
    	dlg.pop(msg);
    });
});

var checkform=function(){
	if(Y.one('#upfile').value==''){
		Y.getTip().show('#upfile','<h5>请先选择要上传的文件！</h5>').setIco(7);
		return false;
	}
	if(!Y.one('#upfile').value.match(/\.te?xt$/i)){
		Y.getTip().show('#upfile','<h5>您好，上传文件只支持txt格式，请重新上传！</h5>').setIco(7);
		return false;
	}
	Y.getTip().hide();	
	return true;
};

$(function() {
	var lotid = location.search.getParam('lotid');
	var projid = location.search.getParam('projid');
	if (lotid == "" || projid == "") {
		return false;
	}
	$(document).attr("title", $_sys.getlotname(lotid) + "--" + $(document).attr("title"));
	showinfo(lotid,projid);
	$("#hsc").bind({
		click:function(){   
			var param={};
			if (checkform()){
				 Y.alert('正在提交您的订单, 请稍候...');
				 Y.sendForm({
	 		        form:'#project_form',
	 		        data: param,               
	 		        end: function (data){                	
	 		      	  var j;
	 		      		Y.alert.close();
	 		          if (j = Y.dejson(data.text)) {
	 		              if (j.errcode == 0) {// && j.headerurl  
	 		  				Y.uploadSuccess();
	 		  				top.Y.closeUrl();
	 		  				setTimeout( function(){top.location.reload();},2000);
	 		              }else{
	 		                Y.uploadErr(j.msg);
	 		              }
	 		          }else{                    
	 		            Y.uploadErr('网络故障, 请检查您的投注记录后重新提交!');
	 		          }
	 		      }        
	 		    });
			}   
		}
	});    
});

var showinfo=function(lotid,projid){
	data = $_trade.key.gid + "=" + encodeURIComponent(lotid) + "&" + $_trade.key.hid + "=" + encodeURIComponent(projid) + "&rnd=" + Math.random();
	Y.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : data,
		end  : function (d){
			var obj = eval("(" + d.text + ")");
   		    var code = obj.Resp.code;
   		    var desc = obj.Resp.desc;
			if (code == "0") {
				var r = obj.Resp.row;
				var projid = r.projid;// 方案ID
				var gameid = r.gameid;// 玩法ID
				var mulity = r.mulity;// 倍数
				var play = r.play;// 玩法（单式/复式）
				var tmoney = r.tmoney;
				var istate = r.istate;// 状态
				var upload = r.upload;// 是否上传 
				$("#gid").val(gameid);
				$("#hid").val(projid);		
				$("#beishu").html(mulity);		
				$("#allmoney").html(parseFloat(tmoney).rmb(true));		
				if (Y.getInt(upload)!=0){
//					 top.Y.closeUrl();
//					 Y.uploadErr("文件已经上传");					 
				}
				if (Y.getInt(istate)>2){
//					top.Y.closeUrl();
//					Y.uploadErr("方案已经过期或者撤销");					
				}
				
				if (lotid=="03" || lotid=="53"){
					if (play=="1"){					
						$("#ds_dlg_title h3").html($_sys.getlotname(lotid)+'直选'+$("#ds_dlg_title h3").html());
					}else if (play=="2"){				
						$("#ds_dlg_title h3").html($_sys.getlotname(lotid)+'组三'+$("#ds_dlg_title h3").html());
					}else if (play=="3"){
						$("#ds_dlg_title h3").html($_sys.getlotname(lotid)+'组六'+$("#ds_dlg_title h3").html());
					}
				}else{
					$("#ds_dlg_title h3").html($_sys.getlotname(lotid)+$("#ds_dlg_title h3").html());
				}
				
				$("#bzgs").bind({
					click:function(){
						
						var file="bzgs.html";
						if(lotid==90||lotid==85){
							file="bzgs/SPF.html";
						}else if(lotid==86){
							file="bzgs/CBF.html";
						}else if(lotid==92 ||lotid==87){
							file="bzgs/BQC.html";
						}else if(lotid==93 ||lotid==89){
							file="bzgs/JQS.html";
						}else if(lotid==72){
							file="bzgs/RQSPF.html";
						}else if(lotid==91){
							file="bzgs/BF.html";
						}else if(lotid==88){
							file="bzgs/SXP.html";
						}
						Y.openUrl($_sys.getlotpath(lotid)+file,550,387,1);
//						Yobj.openUrl('/jc/bzgs/SPF.html',550,387)
					}
				});
			} else {
				Y.alert(desc);
			}
		},
		error : function() {
			Y.alert("您所请求的页面有异常！");
		}
	});	
};