// JScript 文件
function TopAd()
{
    var strTopAd="";
	var click_url="http://www.159cai.com/huodong/hd_list.html";
	var click_title="盛夏狂欢";
	var smailImgSrc="/images/cdbg/jc_sx_002.gif";
	var bigImgSrc="/images/cdbg/jc_sx_001.jpg";
	
	
	//定义小图片内容
    var topSmallBanner="<div style=\"position:relative\"><a href='"+click_url+"' target=_blank><img src='"+smailImgSrc+"' /></a><span class=\"close\" style=\"position: absolute;  right: 300px; bottom: 51px; width: 24px; height: 22px; line-height: 22px; background:#3dc0f2; font-size:12px; color: rgb(255, 255, 255); cursor: pointer; text-align: center; display: block;\" onclick=\"document.getElementById('xxts').style.display='none';$('body').removeAttr('class');\">X</span></div>";
	
	//判断在那些页面上显示大图变小图效果，非这些地址只显示小图（或FLASH）
    if (location == "http://www.lanrentuku.com" || location == "http://lanrentuku.com" || location == "http://bbs.lanrentuku.com/" || true)
    {
		//定义大图内容
        strTopAd="<div id=adimage style=\"position:relative\">"+
                    "<div id=adBig><a href='"+click_url+"' " + 
                    "target=_blank><img title='"+click_title+"'"+
                    "src='"+bigImgSrc+"' " +
                    "border=0></A><span class=\"close\" style=\"position: absolute;  right: 300px; bottom: 51px; width: 24px; height: 22px; line-height: 22px; background:#3dc0f2;; font-size:12px; color: rgb(255, 255, 255); cursor: pointer; text-align: center; display: block;\" onclick=\"document.getElementById('xxts').style.display='none';$('body').removeAttr('class');\">X</span></div></div>"+
                    "<div id=adSmall style=\"display: none\">";
        //strTopAd+=  topFlash;     
		strTopAd+=  topSmallBanner;  
        strTopAd+=  "</div></div>";
    }
    else
    {
        //strTopAd+=topFlash;
		strTopAd+=  topSmallBanner;  
    }
    strTopAd+="<div style=\"height:0px; clear:both;overflow:hidden\"></div>";
    return strTopAd;
}
document.write(TopAd());
$(function(){
	//过两秒显示 showImage(); 内容
    setTimeout("showImage();",4000);
    //alert(location);
});
function showImage()
{
    $("#adBig").slideUp(400,function(){$("#adSmall").slideDown(400);});
	if($("body").attr("class")=="body1"){
	 $("body").removeClass("body1").addClass("body2");
	 }
	
}

