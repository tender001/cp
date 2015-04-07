$_sys.ialertNums=1;//停售提示弹框次数
$_sys.isale_stopHtml ='<div style="width: 550px;" class="caitan" id="kp_stop">'+
'<div class="tantop" style="zoom: 1; cursor: move;">'+ 
'    <span>温馨提示</span><a id="kp_close"></a>'+ 
'</div>'+ 
'<div class="c159-ts">'+ 
'    <div class="c159-ts-tit">很抱歉，该彩种已暂停销售！</div>'+ 
'    <div class="c159-ts-center">'+ 
'        <p>1、已成功出票的方案会正常派奖。</p>'+ 
'        <p>2、之前设置的追号等可通过159彩票客户端查询执行及中奖情况，未出票成功的方案将在当期开奖前退还投注金额至您的账户。</p>'+ 
'        <p>3、资讯类服务将继续提供，手机客户端将提供更多更精彩服务！</p>'+ 
'       <div class="c159-ts-pic"></div>'+ 
'    </div>'+ 
'    <div class="c159-ts-bottom">如若开售我们会及时发出公告，请各位彩民留意哦^_^</div>'+ 
'</div>'+ 
'<div class="caitanbm">'+ 
'   <div class="caitanbm1">'+ 
'    </div>'+ 
'    <div class="caitanbm2">'+ 
'    </div>'+ 
'</div>'+ 
'</div>';
Class('StopAlert',{
	use:'',
	stophtml:$_sys.isale_stopHtml,
	index:function(ini){
			this.stophtml = (ini && ini.stophtml) || this.stophtml;
			if ($('#kp_close').length == 0) {
			$('body').append(this.stophtml);
		}
		if($_sys.ialertNums){
			var zz = this.lib.MaskLay('#kp_stop');
			zz.addClose('#kp_close');
			Y.get('#kp_stop div.tantop').drag('#kp_stop');
			zz.pop();
			$_sys.ialertNums--;
		}
	}
})