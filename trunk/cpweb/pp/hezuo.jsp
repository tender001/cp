<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.File"%>
<%@ page import="java.text.DecimalFormat"%>
<%@ page import="com.mina.rbc.util.xml.JXmlWapper"%>
<%
	String kjhtml_ssq = "";
	String kjhtml_3d = "";
	String kjhtml_qlc = "";
	
	String kjhtml_dlt = "";
	String kjhtml_p3 = "";
	String kjhtml_p5 = "";
	String kjhtml_qxc = "";


	JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/tdata/", "all_code.xml"));
	int count = xml.countXmlNodes("row");
	for (int i = 0; i < count; i++) {
		String gid = xml.getStringValue("row[" + i + "].@gid");
		String pid = xml.getStringValue("row[" + i + "].@pid");
		String gname = xml.getStringValue("row[" + i + "].@gname");
		String code = xml.getStringValue("row[" + i + "].@code");
		String awardtime = xml.getStringValue("row[" + i + "].@awardtime").split(" ")[0];
		String ginfo = xml.getStringValue("row[" + i + "].@ginfo");
		String ninfo = xml.getStringValue("row[" + i + "].@ninfo");
		String etime = xml.getStringValue("row[" + i + "].@etime");
		String sales = xml.getStringValue("row[" + i + "].@sales");//销量
		double pools = Double.parseDouble(xml.getIntValue("row[" + i + "].@pools",0)+"");//奖金
		if (gid.equalsIgnoreCase("01")) {
			String[] codes = code.split("\\|");
			String[] red = codes[0].split(",");
			String[] blue = codes[1].split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_ssq = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">双色球</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < red.length; j++) {
				kjhtml_ssq += "<span class=\"red\">" + red[j] + "</span>";
			}
			for (int j = 0; j < blue.length; j++) {
				kjhtml_ssq += "<span class=\"blue\">" + blue[j] + "</span>";
			}
			kjhtml_ssq += "</td></tr></table>";
			kjhtml_ssq += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_ssq += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_ssq += "奖池： " + new DecimalFormat(",###").format(pools) + "元</td><td class=\"links\"><a href=\"/shuangseqiu/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-福彩开奖-双色球开奖\">详情</a> <a href=\"http://zst.159cai.com/cjwssq/\" target=\"_blank\" title=\"彩票走势图-福彩走势图-双色球走势图\">走势</a> <a href=\"/shuangseqiu/\" target=\"_blank\" title=\"彩票投注-福彩投注-体彩投注-双色球投注-双色球购彩\">投注</a></td></tr>";
			kjhtml_ssq += "</table>";
		} else if (gid.equalsIgnoreCase("03")) {
			String[] codes = code.split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			
			kjhtml_3d = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">福彩3D</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < codes.length; j++) {
				kjhtml_3d += "<span class=\"red\">" + codes[j] + "</span>";
			}
			kjhtml_3d += "</td></tr></table>";
			kjhtml_3d += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_3d += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_3d += "奖池： --</td><td class=\"links\"><a href=\"/3d/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-福彩开奖-福彩3d开奖\">详情</a> <a href=\"http://zst.159cai.com/cjw3d/\" target=\"_blank\" title=\"彩票走势图-福彩走势图-福彩3d走势图\">走势</a> <a href=\"/3d/\" target=\"_blank\" title=\"彩票投注-福彩投注-体彩投注-福彩3d投注-福彩3d购彩\">投注</a></td></tr>";
			kjhtml_3d += "</table>";
		} else if (gid.equalsIgnoreCase("07")) {
			String[] codes = code.split("\\|");
			String[] huang = codes[0].split(",");
			String[] blue = codes[1].split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_qlc = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">七乐彩</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < huang.length; j++) {
				kjhtml_qlc += "<span class=\"red\">" + huang[j] + "</span>";
			}
			for (int j = 0; j < blue.length; j++) {
				kjhtml_qlc += "<span class=\"blue\">" + blue[j] + "</span>";
			}
			kjhtml_qlc += "</td></tr></table>";
			kjhtml_qlc += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_qlc += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_qlc += "奖池： " + new DecimalFormat(",###").format(pools) + "元</td><td class=\"links\"><a href=\"/qilecai/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-福彩开奖-七乐彩开奖\">详情</a> <a href=\"http://zst.159cai.com/cjwqlc/\" target=\"_blank\" title=\"彩票走势图-福彩走势图-七乐彩走势图\">走势</a> <a href=\"/qilecai/\" target=\"_blank\" title=\"彩票投注-福彩投注-体彩投注-七乐彩投注-七乐彩购彩\">投注</a></td></tr>";
			kjhtml_qlc += "</table>";
		} else if (gid.equalsIgnoreCase("50")) {
			String[] codes = code.split("\\|");
			String[] red = codes[0].split(",");
			String[] blue = codes[1].split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_dlt = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">大乐透</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < red.length; j++) {
				kjhtml_dlt += "<span class=\"red\">" + red[j] + "</span>";
			}
			for (int j = 0; j < blue.length; j++) {
				kjhtml_dlt += "<span class=\"blue\">" + blue[j] + "</span>";
			}
			kjhtml_dlt += "</td></tr></table>";
			kjhtml_dlt += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_dlt += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_dlt += "奖池： " + new DecimalFormat(",###").format(pools) + "元</td><td class=\"links\"><a href=\"/daletou/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-体彩开奖-大乐透开奖\">详情</a> <a href=\"http://zst.159cai.com/cjwdlt/\" target=\"_blank\" title=\"彩票走势图-体彩走势图-大乐透走势图\">走势</a> <a href=\"/daletou/\" target=\"_blank\" title=\"彩票投注-体彩投注-大乐透投注-大乐透购彩\">投注</a></td></tr>";
			kjhtml_dlt += "</table>";
		}else if (gid.equalsIgnoreCase("52")) {
			String[] codes = code.split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_p5 = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">排列五</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < codes.length; j++) {
				kjhtml_p5 += "<span class=\"red\">" + codes[j] + "</span>";
			}
			kjhtml_p5 += "</td></tr></table>";
			kjhtml_p5 += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_p5 += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_p5 += "奖池： --</td><td class=\"links\"><a href=\"/paiwu/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-体彩开奖-排列五开奖\">详情</a> <a href=\"http://zst.159cai.com/cjwpl5/\" target=\"_blank\" title=\"彩票走势图-体彩走势图-排列五走势图\">走势</a> <a href=\"/paiwu/\" target=\"_blank\" title=\"彩票投注-体彩投注-排列五投注-排列五购彩\">投注</a></td></tr>";
			kjhtml_p5 += "</table>";
		}else if (gid.equalsIgnoreCase("53")) {
			String[] codes = code.split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_p3 = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">排列三</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < codes.length; j++) {
				kjhtml_p3 += "<span class=\"red\">" + codes[j] + "</span>";
			}
			kjhtml_p3 += "</td></tr></table>";
			kjhtml_p3 += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_p3 += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_p3 += "奖池： --</td><td class=\"links\"><a href=\"/paisan/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-体彩开奖-排列三开奖\">详情</a>  <a href=\"http://zst.159cai.com/cjwpl3/\" target=\"_blank\" title=\"彩票走势图-体彩走势图-排列三走势图\">走势</a>  <a href=\"/paisan/\" target=\"_blank\" title=\"彩票投注-体彩投注-排列五投注-排列三购彩\">投注</a></td></tr>";
			kjhtml_p3 += "</table>";
		}else if (gid.equalsIgnoreCase("51")) {
			String[] codes = code.split(",");
			String[] ginfos = ginfo.split(",");
			String[] ninfos = ninfo.split(",");
			kjhtml_qxc = "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table01\">" + "<tr><td class=\"kinds\">七星彩</td><td class=\"issue\">" + pid + "</td>" + "<td class=\"num\">";
			for (int j = 0; j < codes.length; j++) {
				kjhtml_qxc += "<span class=\"red\">" + codes[j] + "</span>";
			}
			kjhtml_qxc += "</td></tr></table>";
			kjhtml_qxc += "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"table02\"><tr><td class=\"date\">";
			kjhtml_qxc += "开奖时间 " + awardtime + "</td><td>&nbsp;</td></tr><tr><td class=\"pool\">";
			kjhtml_qxc += "奖池： " + new DecimalFormat(",###").format(pools) + "元</td><td class=\"links\"><a href=\"/qixingcai/kaijiang.html\" target=\"_blank\" title=\"彩票开奖-体彩开奖-七星彩开奖\">详情</a>  <a href=\"http://zst.159cai.com/cjwqxc/\" target=\"_blank\" title=\"彩票走势图-体彩走势图-七星彩走势图\">走势</a>  <a href=\"/qixingcai/\" target=\"_blank\" title=\"彩票投注-体彩投注-排列五投注-七星彩购彩\">投注</a></td></tr>";
			kjhtml_qxc += "</table>";
		}
	}
%>   
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>159彩票 - 开奖公告</title>
<meta name="keywords" content="福利彩票，福彩，体育彩票，体彩，足彩，网上买彩票，彩票合买，彩票开奖，彩票走势图，彩票预测"/>
<meta name="description" content="159彩票网为彩民提供专业的彩票网上投注、合买、开奖结果、走势分析、比分直播等服务，覆盖福彩、体彩、足彩、竞彩、快频等彩种。159—彩票网上投注最佳选择！"/>
<script type="text/javascript" src="/public/jq2.js"></script>
<script type="text/javascript" src="/public/common.js"></script>
<style type="text/css">
body {
    background: none repeat scroll 0 0 #FFFFFF;
    color: #666666;
    font: 12px '宋体';
    margin: 0;
    padding: 0;
    text-align: center;
}
div, form, ul, ol, li, span, p, dl, dt, dd, img {
    margin: 0;
    padding: 0;
}
h1, h2, h3, h4, h5, h6 {
    font-size: 12px;
    font-weight: normal;
    margin: 0;
    padding: 0;
}
ul, ol, li {
    list-style: none outside none;
}
table, td, input, textarea {
    font-size: 12px;
}
a {
    color: #333333;
    text-decoration: none;
}
a:hover {
    color: #CC0000;
    text-decoration: underline;
}
h2 {
    text-align: right;
}
h2 span {
    float: left;
    font-weight: bold;
}
.pp:after, .pt:after, .area:after, .clear:after {
    clear: both;
    content: ".";
    display: block;
    height: 0;
    visibility: hidden;
}
a{ color:#2855aa;}
a:hover{ color:#b01e31;}
.left{width: 270px;}
.left h2{color: #2855AA; font-size: 14px; font-weight: bold; height: 16px; line-height: 16px; padding: 15px 0 10px; text-align: left;}
.left h2 span{color: #2855AA; float: right; font-size: 12px; font-weight: normal;}
.left h2 span a{color: #2855AA;}
.l,.r {display: inline; float: left;}
.r {float: right;}
/*最新开奖信息*/
#columnID{ width:268px; height:342px; overflow:hidden; border:1px #e5e5e5 solid;}
#columnID .column{position:relative; padding:0px; overflow:hidden; border-top:1px #e5e5e5 solid; width: 268px;}
#columnID .column .l{width:257px; height:80px; overflow:hidden; border-right:1px #e5e5e5 solid;}
#columnID .column .r{background:url(/images/icon02.png) no-repeat 0px 0px; position:absolute; top:46%; right:2px; width:6px; height:6px; display:block; font-size:0;}
#columnID .nowCol{z-index:5; background:#f3f3f3;}
#columnID .nowCol .l{height:116px;}
#columnID .nowCol .r{background-position:-10px 0px;}
.table{ height:22px; background:#f3f3f3; font-weight:bold; color:#333;}
.table01{ height:33px; color:#333;}
.table01 .kinds{ font-weight:bold; color:#2855aa; width:18%;}
.table01 .issue{ color:#333; width:18%;}
.table01 .num{ text-align:left;}
.table01 .num span{ width:20px; height:20px; line-height:20px; display:block; float:left; color:#fff; text-align:center;}
.table01 .num span.red{ background:url(/images/icon03.png) no-repeat 0px 0px;}
.table01 .num span.blue{ background:url(/images/icon03.png) no-repeat -20px 0px;}
.blue01{ clear:both; text-align:left; padding-top:5px; color:#2855aa;}
.table02{ margin-top:10px; color:#333;}
.table02 td{ height:28px;}
.table02 .date{ text-align:left; padding-left:5px;}
.table02 .pool{ text-align:left; padding-left:5px;}
.table02 .links{ text-align:right;}
.table02 .links a{ padding:0px 2px; color:#2855aa;}
</style>
</head>
<body>
<div class="left">
    <h2>
        <span>
            <a href="http://ccoo.vip.159cai.com/kaijiang/" target="_blank" title="彩票开奖-福彩开奖-体彩开奖-双色球开奖-大乐透开奖">更多开奖&gt;&gt;</a>
            <a href="http://zst.159cai.com/" target="_blank" title="彩票走势图-福彩走势图-体彩走势图-双色球走势图-大乐透走势图">图表走势&gt;&gt;</a>
        </span>
        <a href="http://ccoo.vip.159cai.com/kaijiang/" target="_blank" title="彩票开奖-福彩开奖-体彩开奖-双色球开奖-大乐透开奖">彩票开奖</a>
    </h2>
    <div class="new_data">
        <div id="columnID">
            <div class="tit" id="title">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="table">
                    <tr>
                        <td width="20%" align="left" style="padding-left:10px;">彩种</td>
                        <td width="14%" align="right">期号</td>
                        <td>开奖号码</td>
                    </tr> 
                </table>
            </div>
            <div class="column clear" id="lottery_50">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_ssq%>
</div>
<div class="r"></div>
</div>

<div class="column clear" id="lottery_52">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_3d%>
</div><div class="r"></div></div>

<div class="column clear" id="lottery_51">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_qlc%>
</div><div class="r"></div></div>

<div class="column clear" id="lottery_1">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_dlt%>
</div><div class="r"></div></div>

<div class="column clear" id="lottery_3">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_p3%>
</div><div class="r"></div></div>

<div class="column clear" id="lottery_4">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_p5%>
</div><div class="r"></div></div>

<div class="column clear" id="lottery_2">
<div class="l" style="display: block; height: 33px; overflow: hidden;">
<%=kjhtml_qxc%>
</div><div class="r"></div></div>
       </div>
    </div>
</div>
<script type="text/javascript">
    jQuery(function(){
    });
    $(document).ready(function(){
        var cls = "nowCol";
        var rd = $('#columnID');
        var divs = rd.find('.column');

        var dur = 300,
        h = {min:33, max:116};

        divs.mouseover(function(){
            var els = $(this);
            divs.removeClass(cls).find('> .l').stop().animate({'height':h.min},dur,'linear');
            els.find('> .l').stop().animate({'height':h.max},dur,'linear');
            els.addClass(cls);
        });

        function current(nowCol){
            logger.info($('#'+nowCol));
            $('#'+nowCol + ' > .l').css({'height':h.min}).css({'height':h.max});
            $('#'+nowCol).addClass(cls);
        }
		current('lottery_50');
    });
</script>
</body>
</html>