<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.jczq.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.jczq.TradeJcBeanImpl"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="/css/139cai.css"  rel="stylesheet" type="text/css" />
<title>单式代购-竞彩足球-139彩票网</title>
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/139cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
<script type="text/javascript" src="/public/menu.js"></script>
<script type="text/javascript" src="/jc/js/buy_form_ds_suc.js"></script>
</head>
<%
	List<MatchBean> mb = (List<MatchBean>) request.getAttribute("mb");
	HashMap<String,String[]> mList = (HashMap<String,String[]>) request.getAttribute("mList");

	String playid = (String) request.getAttribute("playid");
	String codes = (String) request.getAttribute("items");
	String rand = (String) request.getAttribute("rand");
%>
<body>
<!-- 头部内容 -->  
<!--#include virtual="/cc/header.html"-->
<!--#include virtual="/cc/nav.html"-->
<!-- 头部内容 --> 
<div id="container">
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>139彩</font></a> &gt; <a href="/jc/" title="竞彩足球"><font>竞彩足球</font></a></p></div>
<div class="gm_msg">
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
 <colgroup>
  <col width="115" />
  <col width="145" />
  <col width="400" />
  <col />
 </colgroup>
  <thead><tr>
    <td colspan="5"><h3>购彩信息</h3></td>
  </tr></thead>
  <tbody>
  <tr class="first">
    <td>赛事</td>
    <td>比赛时间</td>
    <td>对阵</td>
    <td>投注内容</td>
  </tr>
<%
String[] cs=codes.split(",");
int rownum=cs.length;
for (int j=0;j<rownum;j++){
	String mid= cs[j];
	int count=0;
	for(int ii=0;ii<mb.size();ii++){
		if(mid.equals(mb.get(ii).getItemid())){
			count=ii;
			break;
		}
	}

	StringBuffer sb = new StringBuffer();
 	sb.append("<tr><td title=\""+mb.get(count).getItemid()+"\">"+mb.get(count).getMname()+"</td>");
 	sb.append("<td>"+mb.get(count).getBt()+"</td>");
 	sb.append("<td>"+mb.get(count).getHn());
 	if (playid.equalsIgnoreCase("90")){
 	sb.append("("+mb.get(count).getClose()+")");
 	}
 	sb.append(" VS "+mb.get(count).getGn()+"</td>");
 	if(j==0){
 		sb.append("<td rowspan="+rownum+" style=\"border-left:1px solid #ddd\"><a href=\"/cpdata/pupload/temp/"+rand+"_n.txt\" title=\"单式拆分方案下载\" target=\"_blank\" class=\"xga\">方案下载</a></td>");
 	}
    sb.append("</tr>");
	out.print(sb);
	sb=null;
}

%>
  <tr>
    <td colspan="4" class="sum">投注<font>${beishu}</font>倍&nbsp;&nbsp;&nbsp;&nbsp; 过关方式：<font>${sgtype}</font></td>
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
<form method="post" action="" id="buyform">	
<input type='hidden' name='lotid' id="lotid" value='${lotid}'>
<input type='hidden' name='playid' id="playid" value='${playid}'>
<input type='hidden' name='expect' id="expect" value=''>
<input type='hidden' name='ggtype' id="ggtype" value='${sgtype}'>
<input type='hidden' name='ggname' id="ggname" value='${ggname}'>
<input type='hidden' name='initems' id="initems" value='${initems}'>
<input type='hidden' name='items' id="items" value='${items}'>
<input type='hidden' name='codes' id="codes" value='${codes}'>
<input type="hidden" name="rand" id="rand" value="${rand}">
<input type='hidden' name='beishu' id="beishu" value='${beishu}'>
<input type='hidden' name='data_for_restore' id='data_for_restore' value="${restore}" />
<input type='hidden' name='totalmoney' id="totalmoney" value='${totalmoney}'>
<input type="hidden" name="IsCutMulit" id="IsCutMulit" value="${IsCutMulit}">
<input type="hidden" name="ishm" id="ishm" value="${ishm}">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
</form>
</div>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>