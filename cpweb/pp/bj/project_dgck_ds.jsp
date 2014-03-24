<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.TradeBJBeanImpl"%>
<%
	//List<MatchBean> mb = (List<MatchBean>) request.getAttribute("mb");
	String errmsg = (String) request.getAttribute("errmsg");
	if(errmsg != null)out.println("<script>alert('"+errmsg+"');if (history.length == 0) {window.opener =\"\";window.close();}else{history.go(-1);}</script>");
	
	Map<Integer, MatchBean> maps = (Map<Integer, MatchBean>) request.getAttribute("mb");
	String str_matches = (String) request.getAttribute("str_matches");
	String lotid = (String) request.getAttribute("lotid");
	String[] items = {};
	if(str_matches != null) items = str_matches.split(",");
	String ishm = (String) request.getAttribute("ishm");
	String rand = (String) request.getAttribute("rand");

	
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>北京单场单式代购_网上购买_在线投注_网上合买_北京单场投注-159彩票网</title>
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
<script type="text/javascript" src="/bj/js/buy_form_ds_suc.js"></script>
</head>
<body>
<!-- 头部内容 -->  
<!--#include virtual="/cc/header.html"-->
<!-- 头部内容 --> 
<!-- 导航内容 -->   
<!--#include virtual="/cc/nav.html"-->
<!-- 导航内容 --> 
<div id="container">
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>159彩票网</font></a> &gt;<a href="/dating/" title="购彩大厅"><font>购彩大厅</font></a> &gt; <a href="/bj/" title="北京单场"><font>北京单场</font></a></p></div>
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
  </tr>
<%
for (int j=0;j<items.length;j++){		
	String mid= items[j];	
	StringBuffer sb = new StringBuffer();
 	sb.append("<tr><td>"+maps.get(Integer.parseInt(mid)).getMid()+"</td>");
 	
 	sb.append("<td>"+maps.get(Integer.parseInt(mid)).getBt()+"</td>");
 	sb.append("<td>"+maps.get(Integer.parseInt(mid)).getHn());
 	if (lotid.equalsIgnoreCase("85")){
 	sb.append("("+maps.get(Integer.parseInt(mid)).getClose()+")");
 	}
 	sb.append(" VS "+maps.get(Integer.parseInt(mid)).getGn()+"</td>");
 	if(j==0){
 		sb.append("<td rowspan="+items.length+" style=\"border-left:1px solid #ddd\"><a href=\"/cpdata/pupload/temp/"+rand+"_tmp.txt\" title=\"单式拆分方案下载\" target=\"_blank\" class=\"xga\">方案下载</a></td>");
 	}
    sb.append("</tr>");
	out.print(sb);	
	sb=null;
}
%>
<tr>
    <td colspan="4" class="sum">投注<font>${beishu}</font>倍&nbsp;&nbsp;&nbsp;&nbsp; 过关方式：<font>${sgtypename}</font></td>
  </tr>
  <tr>
    <td colspan="4" class="last">方案注数<font>${zhushu}</font>注，您需要支付<font>${totalmoney}</font>元</td>
  </tr>
  <tr>
    <td colspan="4" class="last"><a href="javascript:void(0);" class="gm_but"  id="dg_btn" name="dg_btn">确认无误，去付款</a>
    <p><input type="checkbox" checked="checked"  id="agreement" />我已阅读并同意《<a href="/help/help_yffwxy.html"  target="_blank" class="xga">用户合买代购协议</a>》</p>
    </td>
  </tr>
  </tbody>
</table>
</div>
<form method="post" action="" id="buyform">	
<input type='hidden' name='lotid' id="lotid" value='${lotid}'>
<input type='hidden' name='playid' id="playid" value='${playid}'>
<input type='hidden' name='expect' id="expect" value='${expect}'>
<input type='hidden' name='ggtype' id="ggtype" value='${ggtype}'>
<input type='hidden' name='ggname' id="ggname" value='${ggname}'>
<input type='hidden' name='str_matches' id="str_matches" value='${str_matches}'>
<input type='hidden' name='initems' id="initems" value='${initems}'>
<input type='hidden' name='items' id="items" value='${items}'>
<input type='hidden' name='codes' id="codes" value='${codes}'>
<input type="hidden" name="rand" id="rand" value="${rand}">
<input type='hidden' name='beishu' id="beishu" value='${beishu}'>
<input type='hidden' name='data_for_restore' id='data_for_restore' value='{ "matches" : "${str_matches}", "ggtype" : "${ggtype}", "ggname" : "${ggname}", "beishu" : "${beishu}", "flag" : "0"}' />
<input type='hidden' name='totalmoney' id="totalmoney" value='${totalmoney}'>
<input type="hidden" name="IsCutMulit" id="IsCutMulit" value="${IsCutMulit}">
<input type="hidden" name="ishm" id="ishm" value="${ishm}">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
</form>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>