/** *********��ҳ��ʼ**************** */
function executionPage(obj){//ִ�з�ҳ����
   //��ҳ
   $("#loadPage .firstPage").die('click').live('click',function(){
       if($("#loadPage a.sel").text() ==1){
		    alert("�Ѿ��ǵ�һҳ");
			return false;
	   }
	   obj.pageno =1;//�ڼ�ҳ
	   loadShow(obj);
	   return false;
   })
   //βҳ
   $("#loadPage .lastPage").die('click').live('click',function(){
        if($("#loadPage a.sel").text() ==allInterFace.totalpages){
		    alert("�Ѿ������һҳ");
			return false;
		}
		obj.pageno =allInterFace.totalpages;//�ڼ�ҳ
		loadShow(obj);
		return false;
   })
   //��һҳ
   $("#loadPage .upPage").die('click').live('click',function(){
        if($("#loadPage a.sel").text() ==1){
		    alert("�Ѿ��ǵ�һҳ");
			return false;
		}
		allInterFace.pageno--;
		obj.pageno =allInterFace.pageno;//�ڼ�ҳ
		loadShow(obj);
		return false;
   })
   //��һҳ
   $("#loadPage .downPage").die('click').live('click',function(){
        if($("#loadPage a.sel").text() ==allInterFace.totalpages){
		    alert("�Ѿ������һҳ");
			return false;
		}
		allInterFace.pageno++;
		obj.pageno =allInterFace.pageno;//�ڼ�ҳ
		loadShow(obj);
		return false;
   })
   //����
   $("#loadPage a.pagenum").die('click').live('click',function(){
        allInterFace.pageno =$(this).text();
		obj.pageno =allInterFace.pageno;//�ڼ�ҳ
		loadShow(obj);
		return false;
   })
   //ȷ��
   $("#loadPage a#okButton").die('click').live('click',function(){
        allInterFace.pageno =$("#nopage").val();
		obj.pageno =allInterFace.pageno;//�ڼ�ҳ
		loadShow(obj);
		return false;
   })
   Common.isNum("nopage",function(val){//����ҳ��
	     if(val =="" || val ==0)val =1;
		 if(val>allInterFace.totalpages)val = allInterFace.totalpages;
		 $("#nopage").val(val);
	}); 
}

function callpage(n,size) {
	var lastpage = allInterFace.totalpages;// ���һҳ
	var firstpage = 1;// ��һҳ
	var maxpage = allInterFace.totalpages;// ��ǰ����ҳ����
	var minpage = 1;// ��ǰ��С��ҳ��
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
	var html = "<a href='javascript:void(0)' class='pagebtn firstPage'><span>��ҳ</span></a>";
	    html += "<a href='javascript:void(0)' class='pagebtn upPage'><span>��һҳ</span></a>"
	for (var i = minpage; i <= maxpage; i++) {
		if (i == n) {
			html += '<a class="pagenum sel" href="#">'+i+'</a>';
		} else {
		    html += '<a class="pagenum" href="#">'+i+'</a>';
		}
	}
	html += "<a href='javascript:void(0)' class='pagebtn downPage'><span>��һҳ</span></a>";
	html += "<a href='javascript:void(0)' class='pagebtn lastPage'><span>βҳ</span></a>";
	html += "<span class='v_m'>����</span><input type='text' id='nopage' class='page_inputnum' value =1 maxLength =3/><span class='v_m'>ҳ</span>";
	html += "<a href='#' id='okButton' class='pagebtn'><span>ȷ��</span></a>";
	html += "<span class='color_gray v_m'>��"+allInterFace.totalpages+"ҳ��"+ size+" ����¼</span>";
	if(size == 0){
	    $("#loadPage").html(html).hide();
	}else{
	    $("#loadPage").html(html).show();
	}
}