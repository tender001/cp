<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.jclq.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.jclq.TradeJcBeanImpl"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="/css/159cai.css"  rel="stylesheet" type="text/css" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<title>发起代购-竞彩篮球-159彩票网</title>
<meta name="Keywords" content="竞彩篮球投注,竞彩篮球代购,竞彩篮球合买" />
<meta name="Description" content="159彩票竞彩篮球频道为您提供竞彩篮球购买、竞彩篮球投注、竞彩篮球合买、包括单式投注、复式投注等" />
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/159cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
<script type="text/javascript" src="/public/menu.js"></script>
<script type="text/javascript" src="/lc/js/buy_form.js"></script>
</head>
<%
List<MatchBean> mb = (List<MatchBean>) request.getAttribute("mb");
HashMap<String,String[]> mList = (HashMap<String,String[]>) request.getAttribute("mList");
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
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>159彩票网</font></a> &gt;<a href="/dating/" title="购彩大厅"><font>购彩大厅</font></a> &gt; 竞彩篮球</font></a></p></div>
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
    <%if(request.getAttribute("playid").equals("94") || request.getAttribute("playid").equals("96")){%>
	<td>客队 VS 主队</td>
	<%}else if(request.getAttribute("playid").equals("95")){%>
	<td>客队 / 让分 / 主队</td>
	<%}else if(request.getAttribute("playid").equals("97")){%>
	<td>客队 / 预设总分 / 主队</td>
	<%}%>
    <td>投注内容</td>
    <td>胆</td>
  </tr>
<%
String ratelist = "";
String[] cs=codes.split("/");
String[] dm=danma.split("/");
String dmstr="";
int clonum=4;

if(danma.length()>10){
	for (int i=0;i<dm.length;i++){
		dmstr+=dm[i].substring(dm[i].indexOf("|")+1,dm[i].indexOf("["))+",";
	}
}
dm=dmstr.split(",");
System.out.println("dmstr="+dmstr);
for (int j=0;j<cs.length;j++){

	String[] t1 = new String[2];
	
	t1[0] = cs[j].substring(cs[j].indexOf("|")+1,cs[j].indexOf("["));
	t1[1] = cs[j].substring(cs[j].indexOf("["));
	
	String mid= t1[0];
	String value= t1[1].substring(1,t1[1].length()-1);
	
	String[] xz = value.split(",");
	int count=0;
	for(int ii=0;ii<mb.size();ii++){
	//if(mb.get(ii).getMid()==Integer.parseInt(mid)){
	if(mid.equals(mb.get(ii).getItemid())){		
	count=ii;
	break;
		}
	}
	String spv=mb.get(count).getSpv();

	String close="";
	if (playid.equalsIgnoreCase("94")){
		    close=" VS ";
		}else if (playid.equalsIgnoreCase("95")){
			if(mb.get(count).getClose().indexOf("-")>-1){
				close="/<font color='green'><b>"+mb.get(count).getClose()+"</b></font>/";
			}else{
				close="/<font color='red'><b>"+mb.get(count).getClose()+"</b></font>/";
			}
		}else if (playid.equalsIgnoreCase("96")){
			close="<span class=\"vs\">VS</span>";
	    }else if (playid.equalsIgnoreCase("97")){
	    	close="/<font color='blue'><b>"+mb.get(count).getClose()+"</b></font>/";
	    }
	
	StringBuffer sb = new StringBuffer();
 	sb.append("<tr><td title=\""+mb.get(count).getItemid()+"\">"+mb.get(count).getMname()+"</td>");
 	sb.append("<td>"+mb.get(count).getEt()+"</td>");
 	sb.append("<td>"+mb.get(count).getGn()+""+close+""+mb.get(count).getHn()+"</td>");
 	sb.append("<td>");
 	//sb.append("胜(2.12)平(2.85)负(5.67)");
 	String tmprate="";
 	for (int i=0;i<xz.length;i++){	
 		String n1=xz[i];
 		String n2="";
 		String n3="";
		
 		if (playid.equalsIgnoreCase("94")){
 			n3=n1;
 			n1=TradeJcBeanImpl.SFMapname.get(n1);
 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.SFSpMaps.get(TradeJcBeanImpl.SFMaps.get(xz[i])))+"";
 		}else if (playid.equalsIgnoreCase("95")){
 			n3=n1;
 			n1=TradeJcBeanImpl.SFMapname.get(n1);
 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.RFSFSpMaps.get(TradeJcBeanImpl.RFSFMaps.get(xz[i])))+"";
 		}else if (playid.equalsIgnoreCase("96")){
 			n3=n1;
 			n1=TradeJcBeanImpl.SFCMapname.get(n1);
	        n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.SFCSpMaps.get(TradeJcBeanImpl.SFCMaps.get(xz[i])))+"";
		}else if (playid.equalsIgnoreCase("97")){
			n3=n1;
			n1=TradeJcBeanImpl.DXFMapname.get(n1);
			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.DXFSpMaps.get(TradeJcBeanImpl.DXFMaps.get(xz[i])))+"";
		}
 		
 		sb.append(n1+"("+n2+") ");
 		
 		tmprate+=n3+"#"+n2+",";
 	}
 	
 	ratelist+=mb.get(count).getMid()+":["+tmprate.substring(0,tmprate.length()-1)+"]/";
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
    <td colspan="5" class="last"><a href="javascript:void(0);" class="gm_but"  id="dg_btn" name="dg_btn">确认无误，去付款</a>
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
<input type='hidden' name='newcodes' id="newcodes" value='${newcodes}'>
<input type='hidden' name='danma' id="danma" value='${danma}'>
<input type='hidden' name='newdanma' id="newdanma" value='${newdanma}'>
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