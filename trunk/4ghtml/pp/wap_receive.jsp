<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" %>
<!DOCTYPE html>
<html>
<head><title>
	在线充值结果-手机159彩
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1;' name='viewport' />
<meta content='yes' name='apple-mobile-web-app-capable' />
<meta content='black' name='apple-mobile-web-app-status-bar-style' />
<meta content='telephone=no' name='format-detection' />
<script src='/js/jquery.js'></script>
<script src='/js/159cp.js'></script>
<script src='/js/base.js'></script>
<link rel='stylesheet' href='/style/main.css' />
<link href="/images/apple-touch-icon.png" rel="apple-touch-icon-precomposed" /> 
<link rel='stylesheet' href='/style/user.css' /></head>
<style>
.divErrorMSG { border: 1px solid #FEA485; line-height: 20px; padding: 3px 3px 3px 10px; background-color: #FEFDE9; margin:3px 0px 3px 2px; color: #F30; width: 90%; }
.is {height: 28px;padding-left: 0px;}
.ni1 {height:40px}
.btnC {
	width:90px;
	height:27px;
	font-size: 16px;
}
  </style>
</head>
<body>
<div class="mainDiv">  
<div id="webtop">
<a href="/"><img src="/images/159logo.gif" /></a>
</div>
<div class="topround" ><font><b>充值结果</b></font></div>
<div style="padding-top:5px" class="curved_box">
<table>
	<tr>
    	<th>订单号：</th>
    	<td>${orderid} <em>(请记录此编号，以便查询时使用)</em></td>
  	</tr>
	<tr>
		<th>支付状态：</th>
		<td>${msg_msg}</td>
	</tr>
	<tr>
		<td colspan="2"><a href="${msg_url}" class="btnC">返回账户</a></td>
	</tr>
</table>
</div>
</div>
<input type="hidden" id="type" value="0" />
<!--#include virtual="/cc/footer.html"-->
</body>
</html>
