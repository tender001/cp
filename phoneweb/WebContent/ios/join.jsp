<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.0//EN" "http://www.wapforum.org/DTD/xhtml-mobile10.dtd">
<html lang="zh-cn">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gbk">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<title>参与确认</title>
</head>
<style>
body {
    font-family:  Arial;
    font-size: 20px;
    color: #444;
	margin:0 auto;
	background-color:rgb(238, 238, 238);
	padding:0 20px ;
	
}
table {
    *border-collapse: collapse; /* IE7 and lower */
    border-spacing: 0;
    width: 100%; 
	background-color:white;
	font-size:16px;
	font-weight:bold;
}
.bordered {
    border: solid #ccc 1px;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    border-radius: 6px;
    /*--webkit-box-shadow: 0 1px 1px #ccc; 
    moz-box-shadow: 0 1px 1px #ccc;*/ 
    box-shadow: 0 1px 1px #ccc;         
}
.bordered td, .bordered th {
   /* border-left: 1px solid #ccc;*/
    border-top: 1px solid #ccc;
    padding: 10px;
    text-align: left;    
}
.bordered th {
    background-color: #dce9f9;
    background-image: -webkit-gradient(linear, left top, left bottom, from(#ebf3fc), to(#dce9f9));
    background-image: -webkit-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image:    -moz-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image:     -ms-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image:      -o-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image:         linear-gradient(top, #ebf3fc, #dce9f9);
    -webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset; 
    -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;  
    box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;        
    border-top: none;
    text-shadow: 0 1px 0 rgba(255,255,255,.5); 
}
.bordered td:first-child, .bordered th:first-child {
    border-left: none;
}
.bordered td.title{
	width:50px;
}

.bordered th:first-child {
    -moz-border-radius: 6px 0 0 0;
    -webkit-border-radius: 6px 0 0 0;
    border-radius: 6px 0 0 0;
}

.bordered th:last-child {
    -moz-border-radius: 0 6px 0 0;
    -webkit-border-radius: 0 6px 0 0;
    border-radius: 0 6px 0 0;
}

.bordered tr:last-child td:first-child {
    -moz-border-radius: 0 0 0 6px;
    -webkit-border-radius: 0 0 0 6px;
    border-radius: 0 0 0 6px;
}

.bordered tr:last-child td:last-child {
    -moz-border-radius: 0 0 6px 0;
    -webkit-border-radius: 0 0 6px 0;
    border-radius: 0 0 6px 0;
}
h2{
	font-size:14px;
	
}
div.list{
	padding:10px 0;
}
input.yes,input.no {
		font-weight: bold;
		font-size: 20px;
		color: #ffffff;
		padding: 10px 30px;
		margin-right:3px;
		background-color:#4385f5;
		background: -moz-linear-gradient(
			top,
			#589dfd 0%,
			#488bf7 50%,
			#3a7af2);
		background: -webkit-gradient(
			linear, left top, left bottom, 
			from(#589dfd),
			color-stop(0.50, #488bf7),
			to(#3a7af2));
		border-radius: 5px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border: 1px solid #0059ff;
		-moz-box-shadow:
			0px 1px 0px rgba(000,000,000,0.2),
			inset 0px 1px 0px rgba(255,255,255,0.7);
		-webkit-box-shadow:
			0px 1px 0px rgba(000,000,000,0.2),
			inset 0px 1px 0px rgba(255,255,255,0.7);
		text-shadow:
			0px -1px 0px rgba(000,000,000,0.3),
			0px 0px 0px rgba(255,255,255,0);
	}
input.no {
		font-weight: bold;
		font-size: 20px;
		color: #ffffff;
		padding: 10px 30px;
		background-color:#a1a1a1;
		background: -moz-linear-gradient(
			top,
			#a1a1a1 0%,
			#a1a1a1 50%,
			#a1a1a1);
		background: -webkit-gradient(
			linear, left top, left bottom, 
			from(#a1a1a1),
			color-stop(0.50, #a1a1a1),
			to(#a1a1a1));
		border-radius: 5px;
		-moz-border-radius: 5px;
		-webkit-border-radius: 5px;
		border: 1px solid #a1a1a1;
		-moz-box-shadow:
			0px 1px 0px rgba(000,000,000,0.2),
			inset 0px 1px 0px rgba(255,255,255,0.7);
		-webkit-box-shadow:
			0px 1px 0px rgba(000,000,000,0.2),
			inset 0px 1px 0px rgba(255,255,255,0.7);
		text-shadow:
			0px -1px 0px rgba(000,000,000,0.3),
			0px 0px 0px rgba(255,255,255,0);
	}	
.buttondiv{
	padding:10px 0;
	text-align: center;
}

form{
	display: inline-block;
}


</style>
<body>
	<div class="list">
		<table class="bordered">
			<tr>
				<td class="title">方案</td>        
				<td>${projid}</td>
			</tr>        
			<tr>
				<td class="title">份数：</td>         
				<td>${buynum}</td>
			</tr>
		</table>
	</div>
	
	<div class="buttondiv">
	<form action="cp19500://" method="post">
		<input type="submit" name="" value="返回程序" class="no" />
	</form>
	<form action="/iosJoinResult.php" method="post">
		<input type="hidden" name="sessionid" value="${sessionid}" />
		<input type="submit" name="" value="确认参与" class="yes" />
	</form>	
	</div> 
</body>
</html>

