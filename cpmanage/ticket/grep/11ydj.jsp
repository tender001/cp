<%@ page language="java" import="java.util.*" pageEncoding="gbk"%>
<%@page import="com.mina.rbc.util.MD5Util"%>
<%@page import="com.mina.rbc.util.StringUtil"%>
<%@page import="com.mina.rbc.util.xml.JXmlUtil"%>
<%@page import="com.mina.rbc.util.xml.JXmlWapper"%>
<%@page import="com.caipiao.game.util.*"%>


<%

	String pid = request.getParameter("pid");
	String content = "";
	String awardCode = "";
	if(pid != null && pid.length()>2){
		StringBuilder sb = new StringBuilder();
		sb.append("<body>");
		sb.append("<issueQuery>");
		sb.append("<issue gameName=\"150\" number=\""+pid.substring(2)+"\"/>");
		sb.append("</issueQuery>");
		sb.append("</body>");

		String url="http://211.144.131.37:8080/web-http/HttpInterFace.html";
		String agentUID="QD000781";
		String agentKEY="570BE594ACFC323A33356A1BD6D06D04";
		String info=sb.toString();

		String mid = DateUtil.getCurrentFormatDate("MMddHHmm");
			
		StringBuffer sbs = new StringBuffer();
		String msgid = DateUtil.getCurrentFormatDate("yyyyMMddHHmmss");
		mid=("0000000"+mid).substring(mid.length()-1);
		String messID=agentUID+msgid.substring(0, 8)+mid;
		String sign = MD5Util.compute(messID + msgid + agentKEY + info);

		sbs.append("<?xml version=\"1.0\" encoding=\"GBK\"?>");
		sbs.append("<message version=\"1.0\">");
		sbs.append("<header>");
		sbs.append("<messengerID>").append(messID).append("</messengerID>");
		sbs.append("<agentID>").append(agentUID).append("</agentID>");
		sbs.append("<timestamp>").append(msgid).append("</timestamp>");
		sbs.append("<transactionType>102</transactionType>");
		sbs.append("<digest>").append(sign).append("</digest>");
		sbs.append("</header>");
		sbs.append(info);
		sbs.append("</message>");
		String pdata = "transType=102&transMessage=" + sbs.toString();

		content = JXmlUtil.url2String(url, pdata, "GBK", 30);

		content = content.replaceAll("transType=[^&]+&transMessage=", "");
		JXmlWapper xml = JXmlWapper.parse(content);
		String code = xml.getStringValue("body.response.@code");
		if("0".equals(code)){
			String issue = xml.getStringValue("body.response.issue.@number");
			String status = xml.getStringValue("body.response.issue.@status");
			String bonusCode = xml.getStringValue("body.response.issue.@bonusCode");
			if(pid.endsWith(issue) && ("4".equals(status) || "5".equals(status))){
				if(!StringUtil.isEmpty(bonusCode)){
					awardCode = bonusCode;
				}
			}
		}
	}
			
			
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="" />
<meta name="description" content="" />
<title>十一运夺金</title>
</head>
<body>
	<form name="form1" method="post" action="">
		<input type="text" name="pid" value="<%=pid%>"/>
		<input type="submit" value="提交"/>
	</form>
	<div>
		<textarea rows="10" cols="100" readonly>
		<%=content%>
		</textarea>
		<br/>
		<%=awardCode%>
	</div>
</body>
</html>