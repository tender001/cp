<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>159彩票网在线充值结果</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1;' name='viewport' />
<meta content='yes' name='apple-mobile-web-app-capable' />
<meta content='black' name='apple-mobile-web-app-status-bar-style' />
<meta content='telephone=no' name='format-detection' />
<script src='/js/jquery.js'></script>
<script src='/js/159cp.js'></script>
<script src='/js/base.js'></script>
<script src='/js/login.js'></script>
<link rel='stylesheet' href='/style/main.css' />
<link href="/images/touch-icon.png" rel="apple-touch-icon-precomposed" /> 
<link href="/style/shuzicai.css" rel="stylesheet" type="text/css" />
</head>
<body>
<!--#include virtual="/cc/login.html"-->
<script>
$(document).ready(function() {
    chklogin();
});
</script>
<div style="background:#EEF5FD; border-top:1px solid #B7D5EA">
<div class="step">
	您支付信息如下:
</div>
<div id="divbuyarea">
<div id="divtimes" class="divselected">
订单号：${orderid} <em>(请记录此编号，以便查询时使用)</em>
</div>
<div id="divMoney" class="divselected">
支付状态：${msg_msg}
</div>
<div id="divMoney" class="divselected">
<p>返回:<a href="/hemai/">购彩大厅</a>|<a href="/user/account.html">账户中心</a></p>
</div>
</div>
</div>
<!--#include virtual="/cc/footer.html"-->
</body>
</html>