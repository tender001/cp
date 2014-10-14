<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>159彩票网在线充值结果</title>
<meta name="keywords" content="福利彩票，福彩，体育彩票，体彩，足彩，网上买彩票，彩票合买，彩票开奖，彩票走势图，彩票预测"/>
<meta name="description" content="159彩票网为彩民提供专业的彩票网上投注、合买、开奖结果、走势分析、比分直播等服务，覆盖福彩、体彩、足彩、竞彩、快频等彩种。159—彩票网上投注最佳选择！"/>
<link href="/css/159cai.css"  rel="stylesheet" type="text/css" />
<link href="/css/new159cai.css"  rel="stylesheet" type="text/css" />
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/jq.js"></script>
<script type="text/javascript" src="/public/159cp.js"></script>
<script type="text/javascript" src="/public/chklogin.js"></script>
</head>
<body>
<!-- 头部内容 -->  
<!--#include virtual="/cc/header.html"-->
<!--#include virtual="/cc/nav.html"-->
<!-- 头部内容 --> 
<div id="container">
<div class="zf_judge">
 <h1>${msg}！</h1>
 <div class="zf_j_bg"><table width="100%" border="0">
  <tbody><tr>
 
    <td>订单号：<strong>${orderid} </strong><em>(请记录此编号，以便查询时使用)</em></td>
  </tr>
  <tr>
   
    <td>支付金额：<font>${orderamount}</font>元</td>
  </tr>
  <tr>

    <td>支付状态：<strong>${msg}</strong></td>
  </tr>
</tbody></table>
</div>
<p> <a href="/dating/">继续购买</a><a href="/account/myaccount.html">账户中心</a>      </p>
</div>
 
 <div class="reg_tj">
 <h1>热门彩种</h1>
  <div class="reg_tj_col">
   <img src="/images/jc/cmlog_06.gif" /><p><strong>双色球</strong><br />2元最高可中1000万<br />每周二、四、日开奖</p>
   <a href="/shuangseqiu/" class="but">立即投注</a><a href="/hemai/index.html?lotid=01" class="but1">参与合买</a>
  </div>
  <div class="reg_tj_col">
   <img src="/images/jc/cmlog_03.gif" /><p><strong>11选5</strong><br />2元最高可中1000万<br />每天开奖</p>
   <a href="/" class="but">立即投注</a><a href="/hemai/" class="but1">参与合买</a>
  </div>
  <div class="reg_tj_col">
   <img src="/images/jc/cmlog_09.gif" /><p><strong>竞彩足球</strong><br />返奖69%<br />每天开奖</p>
   <a href="/jc/" class="but">立即投注</a><a href="/hemai/index.html?lotid=90" class="but1">参与合买</a>
  </div>
 </div>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>