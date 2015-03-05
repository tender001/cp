<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page language="java" %>
<!DOCTYPE html>
<html>
<head><title>
	159彩票网
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1;' name='viewport' />
<meta content='yes' name='apple-mobile-web-app-capable' />
<meta content='black' name='apple-mobile-web-app-status-bar-style' />
<meta content='telephone=no' name='format-detection' />
<script src='/js/jquery.js'></script>
<script src='/js/159cp.js'></script>
<script src='/js/base.js'></script>

<link href="/img/apple-touch-icon.png" rel="apple-touch-icon-precomposed" /> 
<link rel="stylesheet" href="/css/basic.css" type="text/css"/>
<link rel="stylesheet" href="/css/style.css" type="text/css"/>

</head>
<body>
<!--#include virtual="/cc/header.html"-->
<section class="buyHeader">
    <h1>充值</h1>
      <a href="javascript:history.go(-1)" class="backIco2"></a>
    <a href="/account/" class="goHome"></a>
</section>
<div  class="user-padding zf-pay-true">
     <div class="pay-true">
          <p><em class="true-icon true-icon-cur" data-type="zfb"><i></i></em>${msg_msg}</p>
     </div>
        <a class="btn btn-true" href="/account/" id="cpid">返回账户</a>
    </div>
<ul class="ali-pay">
  
    <li>订单号：${orderid}<em>(请记录此编号，以便查询时使用)</em></li>
</ul>
<footer class="phone_intro fixed"><p>客服热线 400-0696-159</p></footer>




<input type="hidden" id="type" value="0" />

</body>
</html>
