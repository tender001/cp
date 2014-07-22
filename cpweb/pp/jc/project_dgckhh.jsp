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
<link href="/css/159cai.css"  rel="stylesheet" type="text/css" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<title>竞彩足球混合代购_网上购买_在线投注_网上合买_159彩票网</title>
<meta name="Keywords" content="竞彩足球混合投注投注,竞彩足球混合投注代购,竞彩足球混合投注合买,竞彩足球混合投注投注,竞彩足球混合投注代购,竞彩足球混合投注合买" />
<meta name="Description" content="159彩票网竞彩足球混合投注频道为您提供竞彩足球混合投注（竞彩足球混合投注）购买、竞彩足球混合投注（竞彩足球混合投注）投注、竞彩足球混合投注（竞彩足球混合投注）合买、复式投注等" />
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/159cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
<script type="text/javascript" src="/public/menu.js"></script>
<script type="text/javascript" src="/jc/js/buy_form_hh.js"></script>
</head>
<%
List<MatchBean> mb = (List<MatchBean>) request.getAttribute("mb");
HashMap<String,String[]> mList = (HashMap<String,String[]>) request.getAttribute("mList");

String playid = (String) request.getAttribute("playid");
String codes = (String) request.getAttribute("newcodes");
String from = (String) request.getAttribute("source");
String danma = (String) request.getAttribute("danma");
System.out.println("codes = " + codes);
System.out.println("from = " + from);
%>
<body>
<!-- 头部内容 -->  
<!--#include virtual="/cc/header.html"-->
<!--#include virtual="/cc/nav.html"-->
<!-- 头部内容 --> 
<div id="container">
<div class=breadcrumb><p>您现在的位置：<a href="/" title="网上买彩票"><font>159彩票网</font></a> &gt;<a href="/dating/" title="购彩大厅"><font>购彩大厅</font></a> &gt; 
<%if(from.equals("0")) {%>
<a href="/jc/jchh.html" title="竞彩足球混合投注"><font>竞彩足球混合投注</font></a>
<%} else {%>
<a href="/jc/2x1.html" title="竞彩足球2选1"><font>竞彩足球2选1</font></a>
<%}%>
</p></div>
<div class="gm_msg">
 <table width="100%" border="0" cellspacing="0" cellpadding="0">
 <colgroup>
  <col width="115" />
  <col width="145" />
  <col width="280" />
  <col width="100" />
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
    <%if(from.equals("0")) {%>
    <td>玩法</td>
    <%}%>
    <td>投注内容</td>    
  </tr>
<%
String ratelist = "";
//codes--41058|130316008|SPF>[3,1]/41059|130316009|JQS>[0,1]/41059|130316009|CBF>[1:0,平其它,负其它]/41060|130316010|SPF>[1]/41060|130316010|CBF>[1:0]/41060|130316010|BQC>[3-3]
//newcodes--HH|130316010>SPF=1+CBF=1:0+BQC=3-3,130316008>SPF=3/1,130316009>JQS=0/1+CBF=1:0/9:9/0:9|2*1,3*1|1
String newcodes=codes.replace("HH|", "");
newcodes=newcodes.substring(0,newcodes.indexOf("|"));
String[] cs=newcodes.split(",");
String[] dm=danma.split("/");
String dmstr="";
if(danma.length()>10){
	for (int m=0;m<dm.length;m++){
		dmstr+=dm[m].split("\\|")[1]+",";
	}
}
dm=dmstr.split(",");
for (int j=0;j<cs.length;j++){

	String[] t1 = new String[2];
	
	t1[0] = cs[j].substring(0,cs[j].indexOf(">"));
	t1[1] = cs[j].substring(cs[j].indexOf(">")+1);//SPF=3/1+JQS=0/1+CBF=1:0/9:9/0:9+BQC=3-3
	
	System.out.println("jsp:a="+t1[0]);
	System.out.println("jsp:b="+t1[1]);//jsp:a=130316020  jsp:b=>SPF=3/1+BQC=3-3/3-1/1-1/1-0

	String mid= t1[0];
	String value= t1[1];//.substring(1,t1[1].length()-1);
	
	String[] xz = value.split("\\+");
	int ni = xz.length;//同一场选择了多少种玩法
	int count=0;
	for(int ii=0;ii<mb.size();ii++){
		if(mid.equals(mb.get(ii).getItemid())){
			count=ii;
			break;
		}
	}
	String spv=mb.get(count).getSpv();
	
	StringBuffer sb = new StringBuffer();
	String tmprate="";
	if(from.equals("10")){
		sb.append("<tr><td title=\""+mb.get(count).getItemid()+"\" rowspan=1>"+mb.get(count).getMname()+"</td>");
	 	sb.append("<td rowspan=1>"+mb.get(count).getBt()+"</td>");
	 	sb.append("<td rowspan=1>"+mb.get(count).getHn()+" VS "+mb.get(count).getGn()+"</td><td>");
	}else{
		sb.append("<tr><td title=\""+mb.get(count).getItemid()+"\" rowspan=\""+ni+"\">"+mb.get(count).getMname()+"</td>");
	 	sb.append("<td rowspan=\""+ni+"\">"+mb.get(count).getBt()+"</td>");
	 	sb.append("<td rowspan=\""+ni+"\">"+mb.get(count).getHn()+" VS "+mb.get(count).getGn()+"</td>");
	}

	 	for (int i=0;i<ni;i++){	
	 		String[] xzstr = xz[i].split("=");
	 		String pty=xzstr[0];
	 		String n1=xzstr[1];
	 		String n2="";
	 		String n3="";
	 		String n4="";
	 		if(from.equals("10")){//2选1
	 			String n5="";
	 			if (pty.equalsIgnoreCase("SPF")){
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
			 			n4=TradeJcBeanImpl.SPFMapname.get(n11);
			 			if((mb.get(count).getClose()+"").equals("1")){//主+1
			 				if(n3.equals("3")){n5="--";}else{n5="客胜";}
			 			}else{
			 				if(n3.equals("3")){n5="主胜";}else{n5="--";}
			 			}
			 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n4))+"";
			 			sb.append(n5+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 		}else if (pty.equalsIgnoreCase("RSPF")){
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
			 			n4=TradeJcBeanImpl.RSPFMapname.get(n11);
			 			if((mb.get(count).getClose()+"").equals("1")){//主+1
			 				if(n3.equals("3")){n5="主不败";}else{n5="--";}
			 			}else{
			 				if(n3.equals("3")){n5="--";}else{n5="客不败";}
			 			}
			 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n4))+"";
			 			sb.append(n5+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 		}
	 			if(i==ni-1){
		 			sb.append("</td>");
					sb.append("</tr>");}
	 		}else{
	 			if (pty.equalsIgnoreCase("SPF")){
		 			if(i>0){sb.append("<tr>");}
					sb.append("<td>胜平负</td>");
					sb.append("<td>");
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
			 			n4=TradeJcBeanImpl.SPFMapname.get(n11);
			 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n4))+"";
			 			sb.append(n4+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 			boolean has=false;
		 		 	for (int v=0;v<dm.length;v++){
		 		 		if(dm[v].equalsIgnoreCase(mid)){
		 		 			has=true;
		 		 			break;
		 		 		}
		 		 	}
		 			if (has){
		 		 		sb.append("<label class=\"red\">(胆)</label>");
		 		 	}
		 			sb.append("</td>");
					sb.append("</tr>");
		 		}else if (pty.equalsIgnoreCase("RSPF")){
		 			if(i>0){sb.append("<tr>");}
					sb.append("<td>让球胜平负 ("+mb.get(count).getClose()+")</td>");
					sb.append("<td>");
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
			 			n4=TradeJcBeanImpl.RSPFMapname.get(n11);
			 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n4))+"";
			 			sb.append(n4+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 			boolean has=false;
		 		 	for (int v=0;v<dm.length;v++){
		 		 		if(dm[v].equalsIgnoreCase(mid)){
		 		 			has=true;
		 		 			break;
		 		 		}
		 		 	}
		 			if (has){
		 		 		sb.append("<label class=\"red\">(胆)</label>");
		 		 	}
		 			sb.append("</td>");
					sb.append("</tr>");
		 		}else if (pty.equalsIgnoreCase("JQS")){
		 			if(i>0){sb.append("<tr>");}
					sb.append("<td>进球数</td>");
					sb.append("<td>");
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
			 			n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n11))+"";
			 			sb.append(n3+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 			boolean has=false;
		 		 	for (int v=0;v<dm.length;v++){
		 		 		if(dm[v].equalsIgnoreCase(mid)){
		 		 			has=true;
		 		 			break;
		 		 		}
		 		 	}
		 			if (has){
		 		 		sb.append("<label class=\"red\">(胆)</label>");
		 		 	}
		 			sb.append("</td>");
					sb.append("</tr>");
		 		}else if (pty.equalsIgnoreCase("CBF")){
		 			if(i>0){sb.append("<tr>");}
					sb.append("<td>猜比分</td>");
					sb.append("<td>");
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11.replace("9:0", "胜其它").replace("9:9", "平其它").replace("0:9", "负其它");
		 				System.out.println("cbf:n11="+n11);
						n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n11))+"";
			 			sb.append(n3+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 			boolean has=false;
		 		 	for (int v=0;v<dm.length;v++){
		 		 		if(dm[v].equalsIgnoreCase(mid)){
		 		 			has=true;
		 		 			break;
		 		 		}
		 		 	}
		 			if (has){
		 		 		sb.append("<label class=\"red\">(胆)</label>");
		 		 	}
		 			sb.append("</td>");
					sb.append("</tr>");
				}else if (pty.equalsIgnoreCase("BQC")){
					if(i>0){sb.append("<tr>");}
					sb.append("<td>半全场</td>");
					sb.append("<td>");
					System.out.println("bqc:n1="+n1);
		 			String[] n1str = n1.split("/");
		 			for (int m=0;m<n1str.length;m++){
		 				String n11=n1str[m];
		 				n3=n11;
						n4=TradeJcBeanImpl.BQCMapname.get(n11);
						n2=TradeJcBeanImpl.getsp(spv,TradeJcBeanImpl.HHSPMaps.get(n11))+"";
						sb.append(n4+"("+n2+") ");
			 			tmprate+=n3+"#"+n2+",";
		 			}
		 			boolean has=false;
		 		 	for (int v=0;v<dm.length;v++){
		 		 		if(dm[v].equalsIgnoreCase(mid)){
		 		 			has=true;
		 		 			break;
		 		 		}
		 		 	}
		 			if (has){
		 		 		sb.append("<label class=\"red\">(胆)</label>");
		 		 	}
		 			sb.append("</td>");
					sb.append("</tr>");
				}
	 		}
	 	}
 	
 	//25:[胜#2.39,平#3.61,负#3.28]/26:[胜#3.65,平#3.55,负#2.25]/27:[胜#1.95,平#3.86,负#4.40]/28:[胜#1.90,平#3.79,负#4.77]
 	//ratelist+=mb.get(count).getMid()+":["+tmprate.substring(0,tmprate.length()-1)+"]/";
	out.print(sb);
	sb=null;
}
ratelist="";
%>
  <tr>
    <td colspan="5" class="sum">投注<font>${beishu}</font>倍&nbsp;&nbsp;&nbsp;&nbsp; 过关方式：<font>${sgtypename}</font>
    <%
    String ismix = (String) request.getAttribute("ismix");
    if(from.equals("0")) {
	if(ismix.equals("1")) {
    %>
    	(<font color="red">去除单一玩法串投注</font>)
	<%} else {%>
    	(<font color="red">允许单一玩法串投注</font>)
    <%}}%>
    </td>
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
<input type='hidden' name='newcodes' id="newcodes" value='${newcodes}'>
<input type='hidden' name='danma' id="danma" value='${danma}'>
<input type='hidden' name='newdanma' id="newdanma" value='${newdanma}'>
<input type='hidden' name='beishu' id="beishu" value='${beishu}'>
<input type='hidden' name='totalmoney' id="totalmoney" value='${totalmoney}'>
<input type="hidden" name="IsCutMulit" id="IsCutMulit" value="${IsCutMulit}">
<input type="hidden" name="ishm" id="ishm" value="${ishm}">
<input type="hidden" name="source" id="source" value="${source}">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
<input type="hidden" name="ratelist" id="ratelist" value="<%=ratelist%>">
<input type='hidden' name='ismix' id="ismix" value='${ismix}'>
</form>
</div>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>