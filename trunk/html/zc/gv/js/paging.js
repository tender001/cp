/** *********分页开始**************** */
function executionPage(obj){//执行分页操作
   //首页
   $("#loadPage a[mark=start]").die('click').live('click',function(){
	   if($("#loadPage a.a4").text() ==1){
		    Y.alert("已经是第一页");
			return false;
	   }
	   obj.pageno =1;//第几页
	   loadShow(obj);
	   return false;
   })
   //尾页
   $("#loadPage a[mark=end]").die('click').live('click',function(){
	   if($("#loadPage a.a4").text() ==allInterFace.totalpages){
		    Y.alert("已经是最后一页");
			return false;
		}
		obj.pageno =allInterFace.totalpages;//第几页
		loadShow(obj);
		return false;
   })
   //上一页
   $("#loadPage a[mark=prov]").die('click').live('click',function(){
	   if($("#loadPage a.a4").text() ==1){
		    Y.alert("已经是第一页");
			return false;
		}
		allInterFace.pageno--;
		obj.pageno =allInterFace.pageno;//第几页
		loadShow(obj);
		return false;
   })
   //下一页
   $("#loadPage a[mark=next]").die('click').live('click',function(){
        if($("#loadPage a.a4").text() ==allInterFace.totalpages){
		    Y.alert("已经是最后一页");
			return false;
		}
		allInterFace.pageno++;
		obj.pageno =allInterFace.pageno;//第几页
		loadShow(obj);
		return false;
   })
   //单击
   $("#loadPage a[mark=pn]").die('click').live('click',function(){
        allInterFace.pageno =$(this).text();
		obj.pageno =allInterFace.pageno;//第几页
		loadShow(obj);
		return false;
   })
   //确定
   $("#loadPage a#okButton").die('click').live('click',function(){
        allInterFace.pageno =$("#nopage").val();
		obj.pageno =allInterFace.pageno;//第几页
		loadShow(obj);
		return false;
   })
   Common.isNum("nopage",function(val){//输入页数
	     if(val =="" || val ==0)val =1;
		 if(val>allInterFace.totalpages)val = allInterFace.totalpages;
		 $("#nopage").val(val);
	}); 
}

function callpage(n,size) {
	var lastpage = allInterFace.totalpages;// 最后一页
	var firstpage = 1;// 第一页
	var maxpage = allInterFace.totalpages;// 当前最大的页码数
	var minpage = 1;// 当前最小的页码
	var pageTemp = 0;
	var p = n % 9;
	pageTemp = parseInt(n / 9);
	if (n > 9) {
		if (p == 0) {
			minpage = (pageTemp - 1) * 9 + 1;
			maxpage = n;
		} else {
			minpage = pageTemp * 9 + 1;
			if ((pageTemp + 1) * 9 < lastpage) {
				maxpage = (pageTemp + 1) * 9;
			} else {
				maxpage = lastpage;
			}
		}
	} else {
		if (lastpage > 9) {
			maxpage = 9;
		} else {
			maxpage = lastpage;
		}
	}

	var html = "<ul><li style='line-height:27px;color:#444;padding-right:10px'>共"+ size+"条</li><li class='disabled PagedList-skipToFirst' mark='start'><a href='javascript:void(0)' 首页</a></li>";
	    html += "<li class='active'><a href='javascript:void(0)' mark='prov'>上一页</a></li>"
	for (var i = minpage; i <= maxpage; i++) {
		if (i == n) {
			html += '<li class="active"><a class="a4" href="javascript:void(0);" mark=pn>'+i+'</a></li>';
		} else {
			html += '<li class="active"><a class="a3" href="javascript:void(0);"mark=pn>'+i+'</a></li>';
		}
	}
	html += "<li class='PagedList-skipToNext'><a href='javascript:void(0)' mark='nex'>下一页</a></li><li class='PagedList-skipToNext' mark='end'><a href='javascript:void(0)' >尾页</a></li><ul>";
	html += "<a href='javascript:void(0)' class='pagebtn lastPage'><span>尾页</span></a>";
	html += "<span class='v_m'>到第</span><input type='text' id='nopage' class='page_inputnum' value =1 maxLength =3/><span class='v_m'>页</span>";
	html += "<a href='#' id='okButton' class='pagebtn'><span>确定</span></a>";

	if(size == 0){
	    $("#loadPage").html(html).hide();
	}else{
	    $("#loadPage").html(html).show().addClass('paginachange ');
	}
}