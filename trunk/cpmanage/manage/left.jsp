<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ page import="java.util.*"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>管理页面</title>

<script src="js/prototype.lite.js" type="text/javascript"></script>
<script src="js/moo.fx.js" type="text/javascript"></script>
<script src="js/moo.fx.pack.js" type="text/javascript"></script>
<style>
body {
	font: 12px Arial, Helvetica, sans-serif;
	color: #000;
	background-color: #EEF2FB;
	margin: 0px;
}

#container {
	width: 182px;
}

H1 {
	font-size: 12px;
	margin: 0px;
	width: 182px;
	cursor: pointer;
	height: 30px;
	line-height: 20px;
}

H1 a {
	display: block;
	width: 182px;
	color: #000;
	height: 30px;
	text-decoration: none;
	moz-outline-style: none;
	background-image: url(images/menu_bgS.gif);
	background-repeat: no-repeat;
	line-height: 30px;
	text-align: center;
	margin: 0px;
	padding: 0px;
}

.content {
	width: 182px;
	height: 26px;
}

.MM ul {
	list-style-type: none;
	margin: 0px;
	padding: 0px;
	display: block;
}

.MM li {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	line-height: 26px;
	color: #333333;
	list-style-type: none;
	display: block;
	text-decoration: none;
	height: 26px;
	width: 182px;
	padding-left: 0px;
}

.MM {
	width: 182px;
	margin: 0px;
	padding: 0px;
	left: 0px;
	top: 0px;
	right: 0px;
	bottom: 0px;
	clip: rect(0px, 0px, 0px, 0px);
}

.MM a:link {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	line-height: 26px;
	color: #333333;
	background-image: url(images/menu_bg1.gif);
	background-repeat: no-repeat;
	height: 26px;
	width: 182px;
	display: block;
	text-align: center;
	margin: 0px;
	padding: 0px;
	overflow: hidden;
	text-decoration: none;
}

.MM a:visited {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	line-height: 26px;
	color: #333333;
	background-image: url(images/menu_bg1.gif);
	background-repeat: no-repeat;
	display: block;
	text-align: center;
	margin: 0px;
	padding: 0px;
	height: 26px;
	width: 182px;
	text-decoration: none;
}

.MM a:active {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	line-height: 26px;
	color: #333333;
	background-image: url(images/menu_bg1.gif);
	background-repeat: no-repeat;
	height: 26px;
	width: 182px;
	display: block;
	text-align: center;
	margin: 0px;
	padding: 0px;
	overflow: hidden;
	text-decoration: none;
}

.MM a:hover {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 12px;
	line-height: 26px;
	font-weight: bold;
	color: #006600;
	background-image: url(images/menu_bg2.gif);
	background-repeat: no-repeat;
	text-align: center;
	display: block;
	margin: 0px;
	padding: 0px;
	height: 26px;
	width: 182px;
	text-decoration: none;
}
</style>
</head>

<body>
	<table width="100%" height="280" border="0" cellpadding="0" cellspacing="0" bgcolor="#EEF2FB">
		<tr>
			<td width="182" valign="top">
				<div id="container">
					<%
					HashMap<Integer, Long> user_auths = (HashMap<Integer, Long>)session.getAttribute("WEB_ADMIN_AUTH");
					if(user_auths != null){
						Integer key = 1;
						Long l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">用户管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="user/index.html" target="main">用户信息管理</a></li>
							<li><a href="user/money.html" target="main">用户余额查询</a></li>
						</ul>
					</div>
					<%}
						key = 2;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">财务管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="fill/index.html" target="main">充值订单管理</a></li>
							<li><a href="cash/index.html" target="main">提款订单管理</a></li>
							<li><a href="fill/comtouser.html" target="main">用户赔款管理</a></li>
						</ul>
					</div>
					<%}
						key = 3;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">方案管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="project/jc.html" target="main">竞彩方案管理</a></li>
							<li><a href="project/zc.html" target="main">足彩方案管理</a></li>
							<li><a href="project/bd.html" target="main">北单方案管理</a></li>
							<li><a href="project/mp.html" target="main">慢频方案管理</a></li>
							<li><a href="project/kp.html" target="main">快频方案管理</a></li>
							<li><a href="project/zh.html" target="main">追号方案管理</a></li>
						</ul>
					</div>
					<h1 class="type">
						<a href="javascript:void(0)">方案监控</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="moniter/jc.html" target="main">竞彩方案监控</a></li>
							<li><a href="moniter/zc.html" target="main">足彩方案监控</a></li>
							<li><a href="moniter/bd.html" target="main">北单方案监控</a></li>
							<li><a href="moniter/mp.html" target="main">慢频方案监控</a></li>
							<li><a href="moniter/kp.html" target="main">快频方案监控</a></li>
							<li><a href="moniter/zh.html" target="main">追号方案监控</a></li>
						</ul>
					</div>
					<%}
						key = 5;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">业务管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="busi/bill.html" target="main">出票核对管理</a></li>
							<li><a href="busi/hotuser.html" target="main">合买名人设置</a></li>
							<li><a href="busi/game.html" target="main">彩种销售设置</a></li>
						</ul>
					</div>
					<%}
						key = 6;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">数据查询</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="data/day.html" target="main">按日统计报表</a></li>
							<li><a href="data/sale.html" target="main">彩种销售报表</a></li>
							<li><a href="data/ulog.html" target="main">用户日志查询</a></li>
							<li><a href="data/alog.html" target="main">后台日志查询</a></li>
						</ul>
					</div>
					<%}
						key = 7;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">代理管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="agent/index.html" target="main">代理信息管理</a></li>
							<li><a href="agent/trans.html" target="main">代理转款管理</a></li>
							<li><a href="agent/cash.html" target="main">代理提款管理</a></li>
						</ul>
					</div>
					<%}
						key = 8;
						l = user_auths.get(key);
						if(l != null && l > 0){
					%>
					<h1 class="type">
						<a href="javascript:void(0)">系统管理</a>
					</h1>
					<div class="content">
						<table width="100%" border="0" cellspacing="0" cellpadding="0">
							<tr>
								<td><img src="images/menu_topline.gif" width="182" height="5" /></td>
							</tr>
						</table>
						<ul class="MM">
							<li><a href="auth/index.html" target="main">用户权限管理</a></li>
						</ul>
					</div>
					<%}}%>
				</div>
			</td>
		</tr>
	</table>
</body>
<script type="text/javascript">
	var contents = document.getElementsByClassName('content');
	var toggles = document.getElementsByClassName('type');

	var myAccordion = new fx.Accordion(toggles, contents, {
		opacity : true,
		duration : 400
	});
	myAccordion.showThisHideOpen(contents[0]);
</script>
</html>