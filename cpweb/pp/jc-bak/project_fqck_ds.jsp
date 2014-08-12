<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.jczq.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.jczq.TradeJcBeanImpl"%>
<%@ page import="com.caipiao.cpweb.BaseImpl"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="/css/139cai.css"  rel="stylesheet" type="text/css" />
<title>发起单式合买-竞彩足球-139彩票网</title>
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
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>139彩票网</font></a> &gt;<a href="/dating/" title="购彩大厅"><font>购彩大厅</font></a> &gt; <a href="/jc/" title="竞彩足球"><font>竞彩足球</font></a></p></div>
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
<span class="fa">方案标题</span><input type="text"  class="bt" id="title" maxlength="20" value="{$title}" default="竞彩足球合买"/><span class="fa_play">已输入<font id="title_word_count">0</font>个字符，最多20个。</span>
<span class="fa" style="clear:both">方案描述</span><textarea id="content" default="随缘,买彩票讲的是运气、缘分和坚持。">随缘！买彩票讲的是运气、缘分和坚持。</textarea><span class="fa_play">已输入<font id="content_word_count">0</font>个字符，最多200个</span>
</div>
<p class="red_pay">方案金额<font>${totalmoney}</font>元<br />
需要支付<font id="zftotal">0</font>元(认购<font id="rgtotal">0</font>元+保底<font id="bdtotal">0</font>元)</p>
<p id="userMoneyInfo">
	您尚未登录，请先<a href="javascript:void(0)" title="" onclick="Yobj.postMsg('msg_login')">登录</a>
</p>
<a href="javascript:void(0)" class="gm_but" id="hm_btn" name="hm_btn">确认无误，去付款</a>
<p><span class="hide_sp"><input type="checkbox" checked="checked"  id="agreement" /></span>我已阅读并同意《<a href="/help/help_yffwxy.html"  target="_blank"  class="xga">用户合买代购协议</a>》</p>
</div>
</div>
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
<input type='hidden' name='allnum' id="allnum" value='${totalmoney}'>
<input type="hidden" name="gk" id="gk" value="1">
<input type="hidden" name="tcbili" id="tcbili" value="2">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
</form>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>