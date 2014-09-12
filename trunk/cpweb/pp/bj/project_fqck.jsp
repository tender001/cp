<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.TradeBJBeanImpl"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>北京单场合买_网上购买_在线投注_网上合买_北京单场投注-159彩票网</title>
<meta name="Keywords" content="北京单场投注,北京单场代购,北京单场合买,北京单场投注,北京单场代购,北京单场合买" />
<meta name="Description" content="159彩票网北京单场频道为您提供北京单场（北京单场）购买、北京单场（北京单场）投注、北京单场（北京单场）合买、包括单式投注、复式投注等" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<link href="/css/159cai.css"  rel="stylesheet" type="text/css" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/159cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
<script type="text/javascript" src="/public/menu.js"></script>
<script type="text/javascript" src="/bj/js/buy_form.js"></script>
</head>
<%
Map<Integer, MatchBean> maps = (Map<Integer, MatchBean>) request.getAttribute("mb");
String playid = (String) request.getAttribute("playid");
String codes = (String) request.getAttribute("codes");
String danma = (String) request.getAttribute("danma");
%>
<body>
<!-- 头部内容 -->  
<!--#include virtual="/cc/header.html"-->
<!--#include virtual="/cc/nav.html"-->
<!-- 头部内容 -->
<div id="container">
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>159彩票网</font></a> &gt;<a href="/dating/" title="购彩大厅"><font>购彩大厅</font></a> &gt;  <a href="/bj/" title="北京单场"><font>北京单场</font></a></p></div>
<div class="gm_msg">
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
 <colgroup>
  <col width="115" />
  <col width="145" />
  <col width="300" />
  <col width="280" />
  <col />
 </colgroup>
  <thead><tr>
    <td colspan="5"><h3>购彩信息</h3></td>
  </tr></thead>
  <tbody>
  <tr class="first">
    <td>场次</td>
    <td>比赛时间</td>
    <td>对阵</td>
    <td>投注内容</td>
    <td>胆</td>
  </tr>
  <%
String ratelist = "";
String[] cs=codes.split("/");
String[] dm=danma.split("/");
String dmstr="";
for (int i=0;i<dm.length;i++){
	dmstr+=dm[i].split(":")[0]+",";
}
dm=dmstr.split(",");

for (int j=0;j<cs.length;j++){
	
	String[] t1 = new String[2];
	
	t1[0] = cs[j].substring(0,cs[j].indexOf(":"));
	t1[1] = cs[j].substring(cs[j].indexOf(":")+1);
	
	System.out.println("jsp:a="+t1[0]);
	System.out.println("jsp:b="+t1[1]);
	
	
	
	String mid= t1[0];
	String value= t1[1].substring(1,t1[1].length()-1);
	
	String[] xz = value.split(",");
	String spv = maps.get(Integer.parseInt(mid)).getSpv();
	
	StringBuffer sb = new StringBuffer();
 	sb.append("<tr><td>"+maps.get(Integer.parseInt(mid)).getMid()+"</td>");
 	sb.append("<td>"+maps.get(Integer.parseInt(mid)).getBt()+"</td>");
 	sb.append("<td>"+maps.get(Integer.parseInt(mid)).getHn()+"");
 	if (playid.equalsIgnoreCase("34")){
 	sb.append("("+maps.get(Integer.parseInt(mid)).getClose()+")");
 	}
 	sb.append(" VS "+maps.get(Integer.parseInt(mid)).getGn()+"</td>");
 	sb.append("<td>");
 	String tmprate="";
 	for (int i=0;i<xz.length;i++){
 		String n1=xz[i];
 		String n2=""; 		
 		if (playid.equalsIgnoreCase("34")){
 			if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get(xz[i])))+"";	
 			} 			
 		}else if (playid.equalsIgnoreCase("40")){
 			if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.JQSSpMaps.get(TradeBJBeanImpl.JQSMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.JQSSpMaps.get(TradeBJBeanImpl.JQSMaps.get(xz[i])))+"";	
 			} 
 		}
 		else if (playid.equalsIgnoreCase("46")){
 			if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SFSpMaps.get(TradeBJBeanImpl.SFMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SFSpMaps.get(TradeBJBeanImpl.SFMaps.get(xz[i])))+"";	
 			} 
 		}
		else if (playid.equalsIgnoreCase("41")){	
 			if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SXPSpMaps.get(TradeBJBeanImpl.SXPMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.SXPSpMaps.get(TradeBJBeanImpl.SXPMaps.get(xz[i])))+"";	
 			} 
		}else if (playid.equalsIgnoreCase("42")){
	if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.CBFSpMaps.get(TradeBJBeanImpl.CBFMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.CBFSpMaps.get(TradeBJBeanImpl.CBFMaps.get(xz[i])))+"";	
 			} 
		}else if (playid.equalsIgnoreCase("51")){
	if (TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.BQCSpMaps.get(TradeBJBeanImpl.BQCMaps.get(xz[i])))==null){
 				n2="--";	
 			}else{
 				n2=TradeBJBeanImpl.getsp(spv,TradeBJBeanImpl.BQCSpMaps.get(TradeBJBeanImpl.BQCMaps.get(xz[i])))+"";	
 			} 
		}
 		
 		sb.append(n1+"("+n2+") ");
 		
 		tmprate+=n1+"#"+n2+",";

 		
 	}
 	ratelist+=maps.get(Integer.parseInt(mid)).getMid()+":["+tmprate.substring(0,tmprate.length()-1)+"]/";
 	sb.append("</td>");
 	boolean has=false;
 	for (int i=0;i<dm.length;i++){
 		if(dm[i].equalsIgnoreCase(mid)){
 			has=true;
 			break;
 		}
 	}
 	if (has){
 		sb.append("<td><img src=\"/images/cdbg/pd_07.gif\" /></td>");
 	}else{
 		sb.append("<td><img src=\"/images/cdbg/pd_03.gif\" /></td>");
 	}
    sb.append("</tr>");
	out.print(sb);
	
	sb=null;
}
ratelist=ratelist.substring(0,ratelist.length()-1);
%>
  <tr>
    <td colspan="5" class="sum">投注<font>${beishu}</font>倍&nbsp;&nbsp;&nbsp;&nbsp; 过关方式：<font>${sgtypename}</font></td>
  </tr>
  </tbody>
</table></div>
 <div class="tan_mid">
 <div class="b_th_col">
 <table width="760" border="0" class="col_2">
  <tr>
    <th>投注信息</th>
    <td>总金额<font>${totalmoney}</font>元</td>
  </tr>
  <tr>
    <th>我要分成</th>
    <td><p>每份<font>1</font>元，共<font>${totalmoney}</font>份</p></td>
  </tr>
  <tr>
    <th>我要认购</th>
    <td><input type="text" class="text" id="buynum" maxlength="6"/>份，<font id="buynum_money">10</font>元，约<font id="buynum_scale">10%</font><font id="buynum_tip" style="display:none">您需认购<span>x</span>份~<span>x</span>份</font></td>
  </tr>
  <tr>
    <th></th>
    <td><input type="checkbox" class="box" id="isbaodi"/>我要保底 <input type="text" class="text" value="1" id="baodinum" disabled="disabled" maxlength="6"/>份，<font id="baodi_money">0</font>元，约<font id="baodi_scale">10%</font><font id="baodi_tip" style="display:none">！最低保底5%</font></td>
  </tr>
  <tr>
    <th>提成比例</th>
    <td id="tc"><b class="first" value="0">无</b><b value="1">1%</b><b class="cur" value="2">2%</b><b value="3">3%</b><b value="4">4%</b><b value="5">5%</b><b value="6">6%</b><b value="7">7%</b><b value="8">8%</b><b value="9">9%</b><b value="10">10%</b></td>
  </tr>
  <tr>
    <th>保密设置</th>
    <td id="gkfs"><em value="0">完全公开</em><em class="cur" value="1">截止后公开</em><em value="2">仅对跟单者公开</em><em value="3">截止后对跟单者公开</em></td>
  </tr>
  <tr>
    <th>可选选项</th>
    <td><input type="checkbox"  class="box" id="optional_info"/>方案宣传选填信息</td>
  </tr>
</table>
<div class="conduct_msg" id="optional_info_1" style="display:none">
<span class="fa">方案标题</span><input type="text"  class="bt" id="title" maxlength="20" value="{$title}" default="北京单场合买"/><span class="fa_play">已输入<font id="title_word_count">0</font>个字符。</span>
<span class="fa" style="clear:both">方案描述</span><textarea id="content" default="随缘,买彩票讲的是运气、缘分和坚持。">随缘！买彩票讲的是运气、缘分和坚持。</textarea><span class="fa_play">已输入<font id="content_word_count">0</font>个字符。</span>
</div>
<p class="red_pay">方案金额<font>${totalmoney}</font>元<br />
需要支付<font id="zftotal">0</font>元(认购<font id="rgtotal">0</font>元+保底<font id="bdtotal">0</font>元)</p>
<p id="userMoneyInfo">
	您尚未登录，请先<a href="javascript:void(0)" title="" onclick="Yobj.postMsg('msg_login')">登录</a>
</p>
<a href="javascript:void(0)" class="gm_but" id="hm_btn" name="hm_btn">确认无误，去付款</a>
<p><span class="hide_sp"><input type="checkbox" checked="checked"  id="agreement" /></span>我已阅读并同意《<a href="/help/help_yffwxy.html"  target="_blank">用户合买代购协议</a>》</p>
</div>
</div>
<form method="post" action="" id="buyform">	
<input type='hidden' name='lotid' id="lotid" value='${lotid}'>
<input type='hidden' name='playid' id="playid" value='${playid}'>
<input type='hidden' name='expect' id="expect" value='${expect}'>
<input type="hidden" name="gggroup" id="gggroup" value="${gggroup}">
<input type='hidden' name='sgtype' id="sgtype" value='${sgtype}'>
<input type="hidden" name="sgtypename" id="sgtypename" value="${sgtypename}">
<input type='hidden' name='codes' id="codes" value='${codes}'>
<input type='hidden' name='danma' id="danma" value='${danma}'>
<input type='hidden' name='beishu' id="beishu" value='${beishu}'>
<input type='hidden' name='totalmoney' id="totalmoney" value='${totalmoney}'>
<input type='hidden' name='allnum' id="allnum" value='${totalmoney}'>
<input type="hidden" name="IsCutMulit" id="IsCutMulit" value="${IsCutMulit}">
<input type="hidden" name="ishm" id="ishm" value="${ishm}">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
<input type="hidden" name="gk" id="gk" value="1">
<input type="hidden" name="tcbili" id="tcbili" value="2">
<input type="hidden" name="ratelist" id="ratelist" value="<%=ratelist%>">
</form>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>