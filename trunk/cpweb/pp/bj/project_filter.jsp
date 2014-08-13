<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.MatchBean"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Iterator"%>
<%@ page import="com.caipiao.cpweb.trade.bjdc.TradeBJBeanImpl"%>
<%

//List<MatchBean> mb = (List<MatchBean>) request.getAttribute("mb");
	Map<Integer, MatchBean> maps = (Map<Integer, MatchBean>) request.getAttribute("mb");
	String str_matches = (String) request.getAttribute("str_matches");
	String lotid = (String) request.getAttribute("lotid");
	String[] items = str_matches.split(",");
	String ishm = (String) request.getAttribute("ishm");
	String rand = (String) request.getAttribute("rand");
	String glcc = (String) request.getAttribute("glcc");
	String[] glccs = glcc.split(",");
	String selcc = (String) request.getAttribute("selcc");
	String[] selccs = selcc.split(",");
	String dmstr = (String) request.getAttribute("dmstr");
	String danScope = (String) request.getAttribute("danScope");
	String beforezs = (String) request.getAttribute("beforezs");
	List<String[]> glCondtionList = (List) request.getAttribute("glCondtionList");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>北京单场过滤助手_网上购买_在线投注_网上合买_北京单场投注-159彩票网</title>
<meta name="Keywords" content="北京单场投注,北京单场代购,北京单场合买,北京单场投注,北京单场代购,北京单场合买" />
<meta name="Description" content="159彩票网北京单场频道为您提供北京单场（北京单场）购买、北京单场（北京单场）投注、北京单场（北京单场）合买、包括单式投注、复式投注等" />
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
<link href="/css/159cai.css"  rel="stylesheet" type="text/css" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/159cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
<script type="text/javascript" src="/bj/js/buy_form_filter_suc.js"></script>
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
    <td colspan="6"><h3>购彩信息</h3></td>
  </tr></thead>
  <tbody>
  <tr class="first">
    <td>场次</td>
    <td>比赛时间</td>
    <td>对阵</td>
    <td>投注内容</td>
    <td>胆</td>
    <td>&nbsp;</td>
  </tr>
<%
		try{
			String[] dm=dmstr.split(",");
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
			 	String select ="";
				for(int k=0;k<glccs.length;k++){
					if(mid.equals(glccs[k])){
						select = selccs[k];
						break;
					}
				}
				sb.append("<td>"+select+"</td>");
			 	boolean has=false;
			 	for (int i=0;i<dm.length;i++){
			 		if(dm[i].equalsIgnoreCase(mid)){
			 			has=true;
			 			break;
			 		}
			 	}
			 	if (has){
			 		sb.append("<td><s style='color:red'>√</s></td>");
			 	}else{
			 		sb.append("<td><s>×</s></td>");
			 	}
			 	if(j==0){
			 		sb.append("<td rowspan="+(items.length+1)+" style=\"border-left:1px solid #ddd\"><a href=\"/cpdata/pupload/temp/"+rand+"_tmp.txt\" title=\"单式拆分方案下载\" target=\"_blank\" class=\"xga\">方案下载</a></td>");
			 	}
			 	
			    sb.append("</tr>");
				out.print(sb);	
				sb=null;
			}
		}catch(Exception e){
			e.printStackTrace();
	    }
		%>
  
<!--   </tbody> -->
</table>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  			<tr class="first">
			    <td>步骤</td>
			    <td>过滤设置条件</td>
			    <td>注数</td>
			  </tr>
		<%
			try{
				StringBuffer sbu = new StringBuffer();
				if(!danScope.equals("")){
					sbu.append("<tr><td>模糊设胆范围</td><td>"+danScope+"</td><td></td></tr>");
				}
				sbu.append("<tr><td>原单</td><td></td><td>"+beforezs+"</td></tr>");
				for (int m=0;m<glCondtionList.size();m++){		
					String[] cons = glCondtionList.get(m);	
					sbu.append("<tr><td>第"+(m+1)+"步</td>");
					sbu.append("<td>"+cons[0]+"</td>");
					sbu.append("<td>"+cons[1]+"</td>");
					sbu.append("</tr>");
				}
				out.print(sbu);	
				sbu=null;
			}catch(Exception ex){
				ex.printStackTrace();
		    }
		%>
		<tr>
    <td colspan="3" class="sum">投注<font>${beishu}</font>倍&nbsp;&nbsp;&nbsp;&nbsp; 过关方式：<font>${sgtypename}</font></td>
  </tr>
		</table>
</div>
<div class="tan_mid" >
<div class="b_th_top" style="width: 948px" id="b_form">
				<span>购买方式</span><b ><label for="dg"><input type="radio" name="radio_r" id="dg_s" value="0" checked="checked" style="display:none">代购</label></b><b class="cur"><label for="hm"><input type="radio" name="radio_r" id="hm_s" value="1" style="display:none">发起合买</label></b>
			</div>
<div style="width: 100%; display:none;" id="dgdiv">
				<div class="b_th_co2" style="width: 971px">
					<table width="760" border="0" class="col_2" style="margin-left: 130px">
						<tbody><tr>
							<th>投注信息</th>
							<td>认购总金额<font >${totalmoney}</font>元
							</td>
						</tr>
					</tbody></table>
				</div>
				<a class="d_c_b" href="javascript:void(0);" id="dg_btn">立即投注</a>
				
			</div>
<div style="width: 100%; display: block;" id="hmdiv">
				<div class="b_th_co2 buyfimsg" style="width:972px;border-bottom:none;padding-bottom:0">
					<table width="100%" border="0" cellspacing="0" cellpadding="0">
						<colgroup>
							<col width="110">
								<col width="">
						</colgroup>
						<tbody>
							<tr>
								<td class="td1">方案金额</td>
								<td>总金额<font >${totalmoney}</font>元&nbsp;&nbsp;&nbsp;每份<font >1</font>元，共<font>${totalmoney}</font>份
								</td>
							</tr>
							<tr>
								<td class="td1">我要认购</td>
								<td><p class="p2" id="userMoneyInfo">
										您尚未登录，请先<a onclick="Yobj.postMsg('msg_login')">登录</a>-!
									</p> <input type="text" class="text" id="buynum"  maxlength="6">份，<font id="buynum_money">￥0.00</font>元，约<font  id="buynum_scale">0.00%</font><font id="buynum_tip"  style="display: none">您需认购<span>x</span>份~<span>x</span>份
									</font></td>
							</tr>
							<tr>
								<td class="td1">方案保底</td>
								<td><input type="checkbox" class="box" id="isbaodi">我要保底 <input type="text" class="text" value="1"  id="baodinum" disabled="disabled"  maxlength="6">份，<font id="baodi_money">0</font>元，约<font id="baodi_scale">10%</font><font id="baodi_tip"  style="display: none">！最低保底5%</font></td>
							</tr>
							<tr>
								<td class="td1">提成比例</td>
								<td id="tc"><b class="first" value="0">无</b><b value="1">1%</b><b class="cur" value="2">2%</b><b value="3">3%</b><b value="4">4%</b><b value="5">5%</b><b value="6">6%</b><b value="7">7%</b><b value="8">8%</b><b value="9">9%</b><b value="10">10%</b></td>
							</tr>
							<tr>
								<td class="td1">保密设置</td>
								<td id="gkfs"><em value="0">完全公开</em><em class="cur" value="1">截止后公开</em><em value="2">仅对跟单者公开</em><em value="3">截止后对跟单者公开</em></td>
							</tr>
							<tr>
								<td class="td1">方案宣传</td>
								<td><input type="checkbox" class="box" id="optional_info">方案宣传选填信息</td>
							</tr>
						</tbody>
						<tbody id="optional_info_1" style="display: none;">

							<tr>
								<td class="td1">方案标题</td>
								<td><input type="text" id="title" maxlength="20" value="{$title}" default="北京单场合买" class="bt" ><span class="fa_play">已输入<font id="title_word_count">0</font>个字符。
								</span></td>
							</tr>
							<tr>
								<td class="td1">方案描述</td>
								<td><textarea id="content" default="随缘,买彩票讲的是运气、缘分和坚持。">随缘！买彩票讲的是运气、缘分和坚持。</textarea><span class="fa_play">已输入<font id="content_word_count">0</font>个字符。
								</span></td>
							</tr>


						</tbody>
					</table>
				</div>
				<a class="d_c_b" href="javascript:void(0);" id="hm_btn">发起合买</a>
			
			</div>
<p class="xytk">
					<input type="checkbox" id="agreement" checked="checked">我已阅读并同意《<a target="_blank" href="/help/helpxy.html">用户合买代购协议</a>》 
				</p>
				</div>
<!--  <div class="tan_mid" id="hm_tb"> -->
<!--  <div class="b_th_col"> -->
<!--  <table width="760" border="0" class="col_2"> -->
<!--   <tr> -->
<!--     <th>投注信息</th> -->
<%--     <td>总金额<font>${totalmoney}</font>元</td> --%>
<!--   </tr> -->
<!--   <tr> -->
<!--     <th>我要分成</th> -->
<%--     <td><p>每份<font>1</font>元，共<font>${totalmoney}</font>份</p></td> --%>
<!--   </tr> -->
<!--   <tr> -->
<!--     <th>我要认购</th> -->
<!--     <td><input type="text" class="text" id="buynum" maxlength="6"/>份，<font id="buynum_money">10</font>元，约<font id="buynum_scale">10%</font><font id="buynum_tip" style="display:none">您需认购<span>x</span>份~<span>x</span>份</font></td> -->
<!--   </tr> -->
<!--   <tr> -->
<!--     <th></th> -->
<!--     <td><input type="checkbox" class="box" id="isbaodi"/>我要保底 <input type="text" class="text" value="1" id="baodinum" disabled="disabled" maxlength="6"/>份，<font id="baodi_money">0</font>元，约<font id="baodi_scale">10%</font><font id="baodi_tip" style="display:none">！最低保底5%</font></td> -->
<!--   </tr> -->
<!--   <tr> -->
<!--     <th>提成比例</th> -->
<!--     <td id="tc"><b class="first" value="0">无</b><b value="1">1%</b><b class="cur" value="2">2%</b><b value="3">3%</b><b value="4">4%</b><b value="5">5%</b><b value="6">6%</b><b value="7">7%</b><b value="8">8%</b><b value="9">9%</b><b value="10">10%</b></td> -->
<!--   </tr> -->
<!--   <tr> -->
<!--     <th>保密设置</th> -->
<!--     <td id="gkfs"><em value="0">完全公开</em><em class="cur" value="1">截止后公开</em><em value="2">仅对跟单者公开</em><em value="3">截止后对跟单者公开</em></td> -->
<!--   </tr> -->
<!--   <tr> -->
<!--     <th>可选选项</th> -->
<!--     <td><input type="checkbox"  class="box" id="optional_info"/>方案宣传选填信息</td> -->
<!--   </tr> -->
<!-- </table> -->
<!-- <div class="conduct_msg" id="optional_info_1" style="display:none"> -->
<!-- <span class="fa">方案标题</span><input type="text"  class="bt" id="title" maxlength="20" value="{$title}" default="北京单场合买"/><span class="fa_play">已输入<font id="title_word_count">0</font>个字符，最多20个。</span> -->
<!-- <span class="fa" style="clear:both">方案描述</span><textarea id="content" default="随缘,买彩票讲的是运气、缘分和坚持。">随缘！买彩票讲的是运气、缘分和坚持。</textarea><span class="fa_play">已输入<font id="content_word_count">0</font>个字符，最多200个</span> -->
<!-- </div> -->
<%-- <p class="red_pay">方案金额<font>${totalmoney}</font>元<br /> --%>
<!-- 需要支付<font id="zftotal">0</font>元(认购<font id="rgtotal">0</font>元+保底<font id="bdtotal">0</font>元)</p> -->
<!-- <p id="userMoneyInfo"> -->
<!-- 	您尚未登录，请先<a href="javascript:void(0)" title="" onclick="Yobj.postMsg('msg_login')">登录</a> -->
<!-- </p> -->
<!-- <a href="javascript:void(0)" class="gm_but" id="hm_btn" name="hm_btn">确认无误，去付款</a> -->

<!-- </div> -->
<!-- </div> -->

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
<input type='hidden' name='allnum' id="allnum" value='${totalmoney}'>
<input type="hidden" name="gk" id="gk" value="1">
<input type="hidden" name="tcbili" id="tcbili" value="2">
<input type="hidden" name="playtype" id="playtype" value="${playid}">
<input type="hidden" name="source" id="source" value="${source}">
</form>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>