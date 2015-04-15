CP.WIN = (function(){
	var hasTouch = 'ontouchstart' in window;
	var end_ev = hasTouch ? 'touchend' : 'click';
	var $dom = {
			rebuy : $('#rebuy'),//继续购买
			record : $('#cxgcjl')//查询购彩记录
	}
	var projid = CP.Util.getPara('projid',window.location.href,2);//方案编号
	var gid = projid.substr(2,2);//彩种编号
	
	var o = {
		init:function(){
			TopAnch.init({
				title:'购买成功',
				prevShow:true,
				prevFun:function(){//左侧按钮绑定事件
					window.location.href = '#type=index';
				},
				nextShow:false
			});
			$("#chowanfa").hide();
			o.bindEvent();
		},
		bindEvent : function(){
			$dom.rebuy.bind(end_ev, function () {
				location.replace('#type=url&p=list/'+ CP.Util.lot(gid, '1') +'.html');
			});
// 			 /user/project.html?lotid=97&projid=CP97102959982
			$dom.record.bind(end_ev, function () {
				if(projid.indexOf('ZH')>=0){
// 					location.replace('#type=url&p=user/chase.html?hid='+projid);
				}else{
					location.replace('/user/project.html?lotid='+gid+'&projid='+projid);
					
				}
			});
		}		
	}	
	return {init:o.init}
})();

$(function(){
CP.WIN.init();
})