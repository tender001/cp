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
String errcode = (String) request.getAttribute("errcode");
String errmsg = (String) request.getAttribute("errmsg");
if (errcode.equalsIgnoreCase("1")){
	out.println("<script>alert('"+errmsg+"');if (true) {window.open(\"\",\"_self\");window.close();}else{history.go(-1);}</script>");
}else{	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>159彩票网_网上买彩票_足彩-胜负彩_任选九</title>
<meta name="keywords" content="网上购买双色球,网上买彩票,网上购买彩票,网上投注,159彩票"/>
<meta name="description" content="159彩票网提供福利彩票双色球、福彩3D、时时彩、体育彩票大乐透、七星彩、11选5、足球彩票等全国彩票的网上购买、网上投注、合买彩票等服务，还提供彩票走势图、开奖结果查询等服务，是您专业的网上购买彩票投注站！"/>
<link href="/css/bass.css" type="text/css" rel="stylesheet" />
<link href="/css/zc.css" type="text/css" rel="stylesheet" />
<link href="/css/zc2.css" type="text/css" rel="stylesheet" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/js/jquery-1.5.2.js"></script>
<script type="text/javascript" src="/js/public/yclass.js"></script>
<script type="text/javascript" src="/js/public/base.js"></script>
<script type="text/javascript" src="/js/public/loginer.js"></script>
<script type="text/javascript" src="/js/menu.js"></script>
<script type="text/javascript" src="/js/trade/choose_buy.js"></script>
<script type="text/javascript" src="/js/trade/buyconfirm.js"></script>
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
<div class="zj_main" style="width:1000px;margin:0 auto">
<div class="zj_buy_sort zj_top">
		<span class="title cm_red"><h2>${playname}</h2></span> <span class="sort">第<em class="cm_red">${pid}</em>期</span> 
</div>
<div class="zj_buy_sort">
		<span class="zj_title ">投注信息</span> <span class="sort zj_sort">方案倍数<font>${multiple}</font>倍，总金额<font>${totalmoney}</font>元。</span> 
</div>
<div class="buy_sort" id="all_form">
		<span class="title">购买形式</span> <span class="sort"><label for="rd3" class="cur_lab" id="qerg"><input type="radio" name="radio_g2" id="rd3" value="1" checked="checked" class="rdo" />代购</label><label for="rd4"><input type="radio"
				name="radio_g2" id="rd4" value="0" class="rdo" />合买</label> </span> <em class="r i-qw" style="margin-top: 8px;"></em><span class="r gray">由购买人自行全额购买彩票</span>
</div>
<div id="dd1" style="display: ;">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="buy_table">
					<tr class="last_tr">
						<td class="td_title">确认购买</td>
						<td class="td_content">
							<div class="buy_info">
								<p id="userMoneyInfo">
									您尚未登录，请先<a href="javascript:void 0" title="" onclick="Yobj.postMsg('msg_login')">登录</a>!
								</p>
								<p>
									本次投注金额为<strong class="red eng" id="buyMoneySpan">${totalmoney}</strong>元。
								</p>
								<p>
									<span class="hide_sp"><input type="checkbox" checked="checked" id="agreement_xy" /> </span>我已阅读并同意《<a href="/help/helpcent.html" target="_blank">用户合买代购协议</a>》
								</p>
							</div>
							<div class="buy_btn">
								<a href="javascript:void 0" class="btn_buy_m" title="立即购买" id="buy_dg">立即购买</a>
							</div>
						</td>
					</tr>
				</table>
			</div>
			<div id="dd2" style="display: none;">
				<table width="100%" border="0" cellspacing="0" cellpadding="0" class="buy_table">
					<tr>
						<td class="td_title">合买设置</td>
						<td class="td_content">
							<p><span class="hide_sp"></span><span class="align_sp">我要提成：</span><select class="selt" name="tc" id="tcSelect">
							 <option value="0">0</option>
							 <option value="1">1</option>
							 <option value="2">2</option>
							 <option value="3">3</option>
							 <option value="4">4</option>
							 <option selected="selected" value="5">5</option>
							 <option value="6">6</option>
							 <option value="7">7</option>
							 <option value="8">8</option>
							 </select>% <s class="i-qw" data-help="<h5>什么是提成？</h5><p>发起人提取税后奖金的一定比例作为提成。</p>
												        <p><font color='red'><strong>提成条件：</strong></font>税后奖金—提成金额>方案金额</p>
												        <p><font color='red'><strong>计算公式：</strong></font>提成金额=盈利部分（税后奖金-方案金额）*提成比例</p>
												        <p>示例</p>
												        <p>方案金额：1000元；税后奖金：2000元；</p>       
												        <p>提成比例：5%；提成金额：(2000-1000)*5%=50元</p>
												        <p>提成条件判断：2000-100>1000元</p>
												        <p>实际提成：50元</p>"></s>
							</p>
							
							<p><span class="hide_sp"></span><span class="align_sp">是否公开：</span>
                                <label class="m_r25" for="gk1"><input type="radio" class="m_r3" id="gk1" name="gk" value="0">完全公开</label>
                                <label class="m_r25" for="gk2"><input type="radio" class="m_r3" checked="checked" id="gk2" name="gk" value="1">截止后公开</label>
                                <label class="m_r25" for="gk3"><input type="radio" class="m_r3" id="gk3" name="gk" value="2">仅对跟单用户公开</label>
                                <label class="m_r25" for="gk4"><input type="radio" class="m_r3" id="gk4" name="gk" value="3">截止后对跟单用户公开</label>
                                </p>
						</td>
					</tr>
					<tr>
						<td class="td_title">认购设置</td>
						<td class="td_content">
							<div class="buy_btn">
								<a href="javascript:void 0" class="btn_buy_hm" title="发起合买" id="buy_hm">发起合买</a>
							</div>
							<p>
								<span id="userMoneyInfo2">您尚未登录，请先<a href="javascript:void 0" title="" onclick="Yobj.postMsg('msg_login')">登录</a> </span>
							</p>
							<p>
								<span class="hide_sp"></span><span class="align_sp">我要认购：</span><input name="rgMoney" class="mul" type="text" id="rgMoney" value="1" />元（<span id="rgScale" class="cm_red">0.00%</span>）<span
									class="tips_sp" id="rgErr" style="display: none">！至少需要认购3份</span>
							</p>
							<p>
								<span class="hide_sp"></span><span class="align_sp">我要保底：</span><input name="bdMoney" class="mul" type="text" value="0" id="bdMoney" />元（<span id="bdScale" class="cm_red">0.00%</span>）<input type="checkbox" name="baodiall" id="baodiall" />全额保底 <s class="i-hp i-qw"
									data-help="<h5>什么是保底？</h5><p>发起人承诺合买截止后，如果方案还没有满员，发起人再投入先前承诺的金额以最大限度让方案成交。最低保底金额为方案总金额的20%。保底时，系统将暂时冻结保底资金，在合买截止时如果方案还未满员的话，系统将会用冻结的保底资金去认购方案。如果在合买截止前方案已经满员，系统会解冻保底资金。</p>"></s> <span class="tips_sp" id="bdErr"
									style="display: none">！最低保底20%</span>
							</p>


							<p class="gray">
								<span class="hide_sp"></span>[注]冻结资金将在网站截止销售时，根据该方案的销售情况，返还到您的预付款中。
							</p>
							<p>
								<span class="hide_sp"><input type="checkbox" checked="checked" id="agreement_xy" /> </span>我已阅读并同意《<a href="/help/helpcent.html" target="_blank">用户合买代购协议</a>》
							</p>
						</td>
					</tr>
					<tr>
						<td class="td_ge_t">可选信息</td>
						<td class="td_ge">
							<p class="ge_selt">
								<span class="hide_sp"><input type="checkbox" id="moreCheckbox" /> </span>方案宣传
							</p>
							<p class="ge_tips">帮助您进行方案宣传。</p>
						</td>
					</tr>
					<tr id="case_ad" style="display: none">
						<td class="td_title">方案宣传</td>
						<td class="td_content">
							<p>
								<span class="hide_sp"></span><span class="align_sp">方案标题：</span><input type="text" id="caseTitle" class="t_input" value="假如中了大奖，我该怎么花？" /><span>已输入8个字符，最多20个</span>
							</p>
							<p>
								<span class="align_sp zj_faxc">方案描述：</span>
								<textarea id="caseInfo" class="p_input">说点什么吧，让您的方案被更多彩民认可．．．</textarea>
								<span class="zj_shr">已输入0个字符，最多200个字符</span>
							</p>
						</td>
					</tr>
					<tr class="last_tr" id="hm_target" style="display: none">
						<td class="td_title">合买对象</td>
						<td class="td_content">
							<p>
								<span class="hide_sp"></span><label class="m_r25" for="dx1"><input type="radio" class="m_r3" checked="checked" id="dx1" name="zgdx" value="1">159所有彩友可以合买 
								</label><label class="m_r25" for="dx2"><input type="radio" class="m_r3" id="dx2" name="zgdx" value="2">只有固定的彩友可以合买 
								</label>
							</p>
							<div style="display: none" id="fixobj">
								<p>
									<span class="hide_sp"></span><span class="align_sp"></span>
									<textarea name="buyuser" class="p_input" rows="10" cols="10"></textarea>
								</p>
								<p>
									<span class="hide_sp"></span><span class="gray">[注]限定彩友的格式是：aaaaa,bbbbb,ccccc,ddddd（,为英文状态下的逗号）</span>
								</p>
							</div>
						</td>
					</tr>
				</table>
			</div>
<div class="cm_zc_hmlb clear" id="tz_detail">
    <div class="cm_zc_faxlnr">

    <%
    String rand = (String) request.getAttribute("rand");
	if(null == rand || rand.equals("")) {
    %>
     ${chtml}
    <%} else {%>
    	<ul class="cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1">
		  <li class="cm_w832"></li>
	    </ul>
	    <ul  class="cm_zc_xlnr_ul clear1">
			<li class="cm_w832"><a target="_blank" href="/cpdata/pupload/${rand}.txt" class="a1">点击下载方案 </a></li>
		</ul>
    <%} %>

    
    </div>
  </div>

</div>
<!-- 正文内容 -->  
<input type="hidden" name="lot-ch-name" id="lot-ch-name" value="${playname}" />
<input type="hidden" name="ishm" id="ishm" value="0" />
<input type="hidden" name="type" id="type" value="0" />
<input type="hidden" name="wrate" id="wrate" value="5" />
<input type='hidden' name='gname' id="gname" value="${playname}" />
<input type='hidden' name='gid' id="gid" value="${gid}" />
<input type='hidden' name='pid' id="pid" value="${pid}" />
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
<input type="hidden" name="rand" id="rand" value="${rand}" /><!-- sg_0725103917196_110714_150_16079 -->

<!-- 头部内容 -->   
	<!--#include virtual="/inc/footer.html"-->
<!-- 头部内容 -->  


</body>
</html>
<% }%>