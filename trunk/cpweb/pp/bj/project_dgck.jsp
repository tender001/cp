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
<title>北京单场代购_网上购买_在线投注_网上合买_北京单场投注-159彩票网</title>
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
//34:[胜,平,负]/35:[胜,平,负]/36:[胜,平,负]/37:[胜,平,负]'
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
  <tr>
    <td colspan="5" class="last">方案注数<font>${zhushu}</font>注，您需要支付<font>${totalmoney}</font>元</td>
  </tr>
  <tr>
    <td colspan="5" class="last"><a href="#" class="gm_but"  id="dg_btn" name="dg_btn">确认无误，去付款</a>
    <p><input type="checkbox" checked="checked"  id="agreement" />我已阅读并同意《<a href="/help/help_yffwxy.html"  target="_blank">用户合买代购协议</a>》</p>
    </td>
  </tr>
  </tbody>
</table>
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
<input type="hidden" name="IsCutMulit" id="IsCutMulit" value="${IsCutMulit}">
<input type="hidden" name="ishm" id="ishm" value="${ishm}">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
<input type="hidden" name="ratelist" id="ratelist" value="<%=ratelist%>">
</form>
</div>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>