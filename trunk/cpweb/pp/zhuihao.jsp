<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.buyconfirm.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.buyconfirm.BuyConfirmBeanImpl"%>
<%
if (request.getAttribute("gid").equals("")){
	response.sendRedirect("/error/404.html");
}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>159彩票网_网上买彩票_${playname}_追号</title>
<meta name="keywords" content="网上购买双色球,网上买彩票,网上购买彩票,网上投注,159彩票"/>
<meta name="description" content="159彩票网提供福利彩票双色球、福彩3D、时时彩、体育彩票大乐透、七星彩、11选5、足球彩票等全国彩票的网上购买、网上投注、合买彩票等服务，还提供彩票走势图、开奖结果查询等服务，是您专业的网上购买彩票投注站！"/>
<link href="/css/bass.css" rel="stylesheet" type="text/css"/>
<link href="/css/fc.css" rel="stylesheet" type="text/css"/>
<link href="/css/zc.css" rel="stylesheet" type="text/css"/>
<link href="/css/account.css" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="/js/jquery-1.5.2.js"></script>
<script type="text/javascript" src="/js/public/yclass.js"></script>
<script type="text/javascript" src="/js/public/base.js"></script>
<script type="text/javascript" src="/js/public/loginer.js"></script>
<script type="text/javascript" src="/js/menu.js"></script>
<script type="text/javascript" src="/js/trade/choose_zh.js"></script>
<script type="text/javascript" src="/js/trade/zhuihao.js"></script>
</head>
<body>
<!-- 头部内容 -->   
	<!--#include virtual="/inc/header.html"-->
<!-- 头部内容 -->   
<!-- 导航内容 -->   
<%if(request.getAttribute("gid").equals("01")){%>
<!--#include virtual="/inc/nav/ssq_nav.html"-->
<%} else if (request.getAttribute("gid").equals("03")) {%>
<!--#include virtual="/inc/nav/3d_nav.html"-->
<%} else if (request.getAttribute("gid").equals("07")) {%>
<!--#include virtual="/inc/nav/qlc_nav.html"-->
<%} else if (request.getAttribute("gid").equals("50")) {%>
<!--#include virtual="/inc/nav/dlt_nav.html"-->
<%} else if (request.getAttribute("gid").equals("51")) {%>
<!--#include virtual="/inc/nav/qxc_nav.html"-->
<%} else if (request.getAttribute("gid").equals("52")) {%>
<!--#include virtual="/inc/nav/p5_nav.html"-->
<%} else if (request.getAttribute("gid").equals("53")) {%>
<!--#include virtual="/inc/nav/p3_nav.html"-->
<%} else if (request.getAttribute("gid").equals("54")) {%>
<!--#include virtual="/inc/nav/11x5_nav.html"-->
<%}%>
<!-- 导航内容 --> 
  
<!-- 正文内容 -->
<div class="cm_center">
<!-- 正文上边内容 -->
<!-- 正文头部内容 -->
 <div class="cm_zc_xh_title">
  <h2>${playname} 追号设置</h2>
 </div>
<!-- 正文头部内容 -->
<!-- 方案基本信息内容 -->
 <div class="cm_fajbxx cm_zc_border cm_bg_gray">
  <div class="cm_zc_hmlb clear">
   <h5>追号总金额</h5>
   <div class="cm_zc_hmtext cm_xh_tzxx"><b class="cm_fontsize cm_red" id="buyMoneySpan2"></b>元</div> 
  </div>
  <!-- 发起合买内容 -->  
 <div>
 <div class="cm_fc_tzjd"  style="z-index:3;">
   <h5>追号起始期</h5>
   <div class="cm_zc_hmtext">
   
    <div class="cm_zh_select" id="cm_iss_opts">
     <input type="hidden" value="2012086"  name="" id="zh_issue"/>
     <a href="javascript:void(0);" id="curr_issue"></a>
     <ul style="display:none;" id="zh_issue_option" class="zh_issue_opt">
      
     </ul>
    </div>
    
   </div> 
   <div class="clear1"></div>
  </div> 
  <div class="cm_fc_tzjd">
   <h5>追号周期</h5>
   <div class="cm_zc_hmtext">
    <div class="cm_zhzs_select" id="cm_iss_count">
     <input type="hidden" value="10"  name="" id="zh_iss_ct" />
     <a href="javascript:void(0);">10</a>
	     <ul style="display:none;" id="zh_iss_count"  class="zh_issue_opt">
		    <li value="5"><a href="javascript:void(0);" >5</a></li>
	    	<li value="10"><a href="javascript:void(0);">10</a></li>
	    	<li value="20"><a href="javascript:void(0);">20</a></li>
	    	<li value="30"><a href="javascript:void(0);">30</a></li>
	    	<li value="1000"><a href="javascript:void(0);">更多</a></li>
	     </ul>
    </div>
   </div> 
   <div class="clear1"></div>
  </div>
  <div class="cm_zc_hmlb clear">
   <h5>追号倍数</h5>
   <div class="cm_zc_hmtext cm_xh_rgfs">
    <ul class="cm_ssqzh_qs clear" id="zh_list">
    </ul>
   </div> 
  </div>
  <div class="cm_zc_hmlb clear">
    <h5>追号停止条件</h5>
   <div class="cm_zc_hmtext">
    <ul class="cm_xh_rgfs_btn clear" id="zh_condi">
	     <li class="cm_xh_rgfs_cur" value="0"><em></em><span class="cm_xh_rgfs_middle cm_yellow">中奖后不停止</span><i></i></li>
	     <li value="1"><em></em><span class="cm_xh_jd_middle cm_yellow">中奖后停止</span><i></i></li>
	     <li value="2"><em></em><span class="cm_xh_rgfs_middle cm_yellow">盈利后停止</span><i></i></li>
    </ul>
   </div> 
  </div> 
  
  <div class="cm_zc_hmlb clear">
   <h5></h5>
   <div class="cm_zc_hmtext cm_xh_rgfs"><span class="cm_xh_fqhm_btn"><a href="javascript:void(0);" class="cm_zc_buy" id="buy_zh">确认追号</a><input name="" type="checkbox" value="" checked id="agreement_zh" /> 我已阅读并同意《<a href="/help/helpcent.html"   class="a1" target="_blank">用户合买自购协议</a>》</span></div> 
  </div>
  
  <div class="cm_zc_hmlb clear">
    <h5>追号投注详情</h5>
     <div class="cm_zc_hmtext cm_xh_rgfs">
   		<div class="cm_zc_faxlnr">
	   	${chtml}
	   </div> 
   </div> 
  </div>
  </div>
<!-- 全额认购内容 -->
<!-- 全额认购内容 -->
 </div>
<!-- 方案基本信息内容 -->
<!-- 正文上边内容 -->
</div>
<!-- 正文内容 --> 
<!-- 页脚内容 -->
			<input name="lastexpect" id="lastexpect" type="hidden" value="2011153"/>
			<input type="hidden" name="lot-ch-name" id="lot-ch-name" value="${playname}" />
			<input type="hidden" name="ishm" id="ishm" value="1" />
			<input type="hidden" name="tzzh" id="tzzh" value="0" />
			<input type="hidden" name="wrate" id="wrate" value="5" />
			<input type='hidden' name='gname' id="gname" value="${playname}" />
			<input type='hidden' name='gid' id="gid" value="${gid}" />
			<input type='hidden' name='pid' id="pid" value="${pid}" />
			<input type='hidden' name='expect' id="expect" value="${pid}" />
			<input type='hidden' name='playid' id="playid" value="${playid}" />
			<input type='hidden' name='codes' id="codes" value="${codes}" />
			<input type='hidden' name='dtcodes' id="dtcodes" value="${dtcodes}" />
			<input type='hidden' name='zhushu' id="zhushu" value="${zhushu}" />
			<input type='hidden' name='multiple' id="multiple" value="${multiple}" />
			<input type='hidden' name='totalmoney' id="totalmoney" value="${totalmoney}" />
			<input name="money_limit" id="money_limit" type="hidden" value="${playmoneylimit}" />
			<input name="isdt" id="isdt" type="hidden" value="${isdt}" />
			<input name="wtype" id="wtype" type="hidden" value="${wtype}" />
			<input name="wtype2" id="wtype2" type="hidden" value="${wtype2}" />
			<input name="price" id="price" type="hidden" value="${price}" /> <!-- mei fen jin e -->
	<!--#include virtual="/inc/footer.html"--> 
<!-- 页脚内容 -->
</body>
</html>