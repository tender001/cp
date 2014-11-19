package com.caipiao.cpweb.bank;

import java.math.BigDecimal;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_kq extends BankBeanImpl {

	// 人民币网关账户号
	// /请登录快钱系统获取用户编号，用户编号后加01即为人民币网关账户号。
	private static String merchantAcctId= "1002366829001";
	private static String key  = "";//


	
	private static String notify_url = RETURN_HOST + "/phpu/kqnotify.phpx";

	private static String rtnUrl = RETURN_HOST + "/phpu/kqreceive.phpx";
	
	private static String url = "https://www.99bill.com/gateway/recvMerchantInfoAction.htm";

	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("kq-send");
		// response.setHeader("Cache-Control", "no-cache");

		// 字符集.固定选择值。可为空。
		// /只能选择1、2、3.
		// /1代表UTF-8; 2代表GBK; 3代表gb2312
		// /默认值为1
		String inputCharset = "1";

		// 服务器接受支付结果的后台地址.与[pageUrl]不能同时为空。必须是绝对地址。
		// /快钱通过服务器连接的方式将交易结果发送到[bgUrl]对应的页面地址，在商户处理完成后输出的<result>如果为1，页面会转向到<redirecturl>对应的地址。
		// /如果快钱未接收到<redirecturl>对应的地址，快钱将把支付结果GET到[pageUrl]对应的页面。

		// 网关版本.固定值
		// /快钱会根据版本号来调用对应的接口处理程序。
		// /本代码版本号固定为v2.0
		String version = "v2.0";

		// 语言种类.固定选择值。
		// /只能选择1、2、3
		// /1代表中文；2代表英文
		// /默认值为1
		String language = "1";

		// 签名类型.固定值
		// /1代表MD5签名
		// /当前版本固定为1
		String signType = "4";

		// 支付人姓名
		// /可为中文或英文字符
		String payerName = "";

		// 支付人联系方式类型.固定选择值
		// /只能选择1
		// /1代表Email
		String payerContactType = "1";

		// 支付人联系方式
		// /只能选择Email
		String payerContact = "";

		// 商户订单号
		// /由字母、数字、或[-][_]组成
		String orderId = bean.getApplyid();

		// 订单金额
		// /以分为单位，必须是整型数字
		// /比方2，代表0.02元
		double s = bean.getAddmoney() * 100;
		Double D1 = new Double(s);
		int addmoney = D1.intValue();
		String orderAmount = addmoney + "";// 总金额，以分为单位

		// 订单提交时间
		// /14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
		// /如；20080101010101
		String orderTime = bean.getApplydate();

		// 商品名称
		// /可为中文或英文字符
		// String productName = "购彩充值";

		// 商品数量
		// /可为空，非空时必须为数字
		String productNum = "1";

		// 商品代码
		// /可为字符或者数字
		String productId = "";

		// 商品描述
		String productDesc = "";

		// 扩展字段1
		// /在支付结束后原样返回给商户
		String ext1 = "";

		// 扩展字段2
		// /在支付结束后原样返回给商户
		String ext2 = "";

		// 支付方式.固定选择值
		// /只能选择00、10、11、12、13、14
		// /00：组合支付（网关支付页面显示快钱支持的各种支付方式，推荐使用）10：银行卡支付（网关支付页面只显示银行卡支付）.11：电话银行支付（网关支付页面只显示电话支付）.12：快钱账户支付（网关支付页面只显示快钱账户支付）.13：线下支付（网关支付页面只显示线下支付方式）
		String banktype = bean.getBanktype();

		String payType = "";
		String bankId = "";
		if (banktype.equals("00")) {
			payType = banktype;
		} else {
			payType = "10";
			bankId = banktype;
		}

		// 同一订单禁止重复提交标志
		// /固定选择值： 1、0
		// /1代表同一订单号只允许提交1次；0表示同一订单号在没有支付成功的前提下可重复提交多次。默认为0建议实物购物车结算类商户采用0；虚拟产品类商户采用1
		String redoFlag = "1";

		// 快钱的合作伙伴的账户号
		// /如未和快钱签订代理合作协议，不需要填写本参数
		String pid = "";

		// 生成加密签名串
		// /请务必按照如下顺序和规则组成加密串！
		String signMsgVal = "";
		signMsgVal = BankUtil.appendParam(signMsgVal, "inputCharset", inputCharset);
		signMsgVal = BankUtil.appendParam(signMsgVal, "bgUrl", notify_url);
		signMsgVal = BankUtil.appendParam(signMsgVal, "version", version);
		signMsgVal = BankUtil.appendParam(signMsgVal, "language", language);
		signMsgVal = BankUtil.appendParam(signMsgVal, "signType", signType);
		signMsgVal = BankUtil.appendParam(signMsgVal, "merchantAcctId", merchantAcctId);
		signMsgVal = BankUtil.appendParam(signMsgVal, "payerName", payerName);
		signMsgVal = BankUtil.appendParam(signMsgVal, "payerContactType", payerContactType);
		signMsgVal = BankUtil.appendParam(signMsgVal, "payerContact", payerContact);
		signMsgVal = BankUtil.appendParam(signMsgVal, "orderId", orderId);
		signMsgVal = BankUtil.appendParam(signMsgVal, "orderAmount", orderAmount);
		signMsgVal = BankUtil.appendParam(signMsgVal, "orderTime", orderTime);
		signMsgVal = BankUtil.appendParam(signMsgVal, "productName", "159cai");
		signMsgVal = BankUtil.appendParam(signMsgVal, "productNum", productNum);
		signMsgVal = BankUtil.appendParam(signMsgVal, "productId", productId);
		signMsgVal = BankUtil.appendParam(signMsgVal, "productDesc", productDesc);
		signMsgVal = BankUtil.appendParam(signMsgVal, "ext1", ext1);
		signMsgVal = BankUtil.appendParam(signMsgVal, "ext2", ext2);
		signMsgVal = BankUtil.appendParam(signMsgVal, "payType", payType);
		signMsgVal = BankUtil.appendParam(signMsgVal, "bankId", bankId);
		signMsgVal = BankUtil.appendParam(signMsgVal, "redoFlag", redoFlag);
		signMsgVal = BankUtil.appendParam(signMsgVal, "pid", pid);
		signMsgVal = BankUtil.appendParam(signMsgVal, "key", key);

//		String signMsg = BankUtil.md5Hex(signMsgVal.getBytes("UTF-8")).toUpperCase();
		String signMsg = KqUtil.signMsg(signMsgVal);

		String contents = "<meta http-equiv=\"Cache-Control\" content=\"no-cache\"/> \r\n";
		contents += "<form name=\"payForm1\" method=\"post\" action=\""+url+"\">\r\n";
		contents += "<input type=\"hidden\" name=\"inputCharset\" value=\"" + inputCharset + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"bgUrl\" value=\"" + notify_url + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"version\" value=\"" + version + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"language\" value=\"" + language + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"signType\" value=\"" + signType + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"signMsg\" value=\"" + signMsg + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"merchantAcctId\" value=\"" + merchantAcctId + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"payerName\" value=\"" + payerName + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"payerContactType\" value=\"" + payerContactType + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"payerContact\" value=\"" + payerContact + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"orderId\" value=\"" + orderId + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"orderAmount\" value=\"" + orderAmount + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"orderTime\" value=\"" + orderTime + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"productName\" value=\"" + productName + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"productNum\" value=\"" + productNum + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"productId\" value=\"" + productId + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"productDesc\" value=\"" + productDesc + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"ext1\" value=\"" + ext1 + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"ext2\" value=\"" + ext2 + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"payType\" value=\"" + payType + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"bankId\" value=\"" + bankId + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"redoFlag\" value=\"" + redoFlag + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"pid\" value=\"" + pid + "\"/>\r\n";

		contents += "<input type=\"submit\" name=\"转发中>>\"	value=\"转发中>>\">\r\n";
		contents += "</form>\r\n";
		contents += "<script language=\"javascript\">document.payForm1.submit();</script>";

		String redirect = url;
		redirect += "?inputCharset=" + inputCharset;
		redirect += "&bgUrl=" + notify_url;
		redirect += "&version=" + version;
		redirect += "&language=" + language;
		redirect += "&signType=" + signType;
		redirect += "&signMsg=" + URLEncoder.encode(signMsg, "UTF-8");
		redirect += "&merchantAcctId=" + merchantAcctId;
		redirect += "&payerName=" + payerName;
		redirect += "&payerContactType=" + payerContactType;
		redirect += "&payerContact=" + payerContact;
		redirect += "&orderId=" + orderId;
		redirect += "&orderAmount=" + orderAmount;
		redirect += "&orderTime=" + orderTime;
		redirect += "&productName=" + URLEncoder.encode("159cai", "UTF-8");
		redirect += "&productNum=" + productNum;
		redirect += "&productId=" + productId;
		redirect += "&productDesc=" + productDesc;
		redirect += "&ext1=" + ext1;
		redirect += "&ext2=" + ext2;
		redirect += "&payType=" + payType;
		redirect += "&bankId=" + bankId;
		redirect += "&redoFlag=" + redoFlag;
		redirect += "&pid=" + pid;

		bean.setContents(contents);
//		write_html_response(contents, response);
		bean.setRedirect(redirect);
	}

	public int receive(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("kq-receive");

		response.setHeader("Cache-Control", "no-cache");

		// 获取人民币网关账户号
		String merchantAcctId = (String) request.getParameter("merchantAcctId").trim();

		// 获取网关版本.固定值
		// /快钱会根据版本号来调用对应的接口处理程序。
		// /本代码版本号固定为v2.0
		String version = (String) request.getParameter("version").trim();

		// 获取语言种类.固定选择值。
		// /只能选择1、2、3
		// /1代表中文；2代表英文
		// /默认值为1
		String language = (String) request.getParameter("language").trim();

		// 签名类型.固定值
		// 1代表MD5签名
		// 当前版本固定为1
		String signType = (String) request.getParameter("signType").trim();

		// 获取支付方式
		// 值为：10、11、12、13、14
		//
		//
		// 00：组合支付（网关支付页面显示快钱支持的各种支付方式，推荐使用）10：银行卡支付（网关支付页面只显示银行卡支付）.11：电话银行支付（网关支付页面只显示电话支付）.12：快钱账户支付（网关支付页面只显示快钱账户支付）.13：线下支付（网关支付页面只显示线下支付方式）.14：B2B支付（网关支付页面只显示B2B支付，但需要向快钱申请开通才能使用）
		String payType = (String) request.getParameter("payType").trim();

		// 获取银行代码
		// /参见银行代码列表
		String bankId = (String) request.getParameter("bankId").trim();

		// 获取商户订单号
		String orderId = (String) request.getParameter("orderId").trim();

		// 获取订单提交时间
		// /获取商户提交订单时的时间.14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
		// /如：20080101010101
		String orderTime = (String) request.getParameter("orderTime").trim();

		// 获取原始订单金额
		// 订单提交到快钱时的金额，单位为分。
		// 比方2 ，代表0.02元
		String orderAmount = (String) request.getParameter("orderAmount").trim();

		// 获取快钱交易号
		// 获取该交易在快钱的交易号
		String dealId = (String) request.getParameter("dealId").trim();

		// 获取银行交易号
		// 如果使用银行卡支付时，在银行的交易号。如不是通过银行支付，则为空
		String bankDealId = (String) request.getParameter("bankDealId").trim();

		// 获取在快钱交易时间
		// 14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
		// 如；20080101010101
		String dealTime = (String) request.getParameter("dealTime").trim();

		// 获取实际支付金额
		// 单位为分
		// 比方 2 ，代表0.02元
		String payAmount = (String) request.getParameter("payAmount").trim();

		// 获取交易手续费
		// /单位为分
		// /比方 2 ，代表0.02元
		String fee = (String) request.getParameter("fee").trim();

		// 获取扩展字段1
		String ext1 = (String) request.getParameter("ext1").trim();

		// 获取扩展字段2
		String ext2 = (String) request.getParameter("ext2").trim();

		// 获取处理结果
		// 10代表 成功11代表 失败
		String payResult = (String) request.getParameter("payResult").trim();

		// 获取错误代码
		// /详细见文档错误代码列表
		String errCode = (String) request.getParameter("errCode").trim();

		// 获取加密签名串
		String signMsg = (String) request.getParameter("signMsg").trim();

		// 生成加密串。必须保持如下顺序。
		String merchantSignMsgVal = "";
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "merchantAcctId", merchantAcctId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "version", version);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "language", language);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "signType", signType);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payType", payType);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "bankId", bankId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderId", orderId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderTime", orderTime);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderAmount", orderAmount);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "dealId", dealId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "bankDealId", bankDealId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "dealTime", dealTime);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payAmount", payAmount);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "fee", fee);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "ext1", ext1);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "ext2", ext2);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payResult", payResult);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "errCode", errCode);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "key", key);

//		String merchantSignMsg = BankUtil.md5Hex(merchantSignMsgVal.getBytes("UTF-8")).toUpperCase();

		// 初始化结果及地址
		int rtnOk = 0;
		String sMsg = "";

		double d_total_fee = Double.parseDouble(orderAmount);
		String Amount = (d_total_fee / 100) + "";
		d_total_fee = Double.parseDouble(Amount);

		 System.out.println("merchantSignMsg=" + merchantSignMsgVal);
		 System.out.println("signMsg=" + signMsg);

		// 商家进行数据处理，并跳转会商家显示支付结果的页面
		// 首先进行签名字符串验证
//		if (signMsg.toUpperCase().equals(merchantSignMsg.toUpperCase())) {
		if (KqUtil.check(merchantSignMsgVal, signMsg)) {
			// 接着进行支付结果判断
			switch (Integer.parseInt(payResult)) {
			case 10:
				sMsg = "支付成功";
				rtnOk = 1;
				break;
			default:
				sMsg = "支付失败";
				break;
			}
			logger.debug(sMsg);
		} else {
			sMsg = "签名失败";
			logger.error(sMsg);
		}
		// request.setCharacterEncoding(ENCODING);
		request.setAttribute("rtnOk", rtnOk);
		request.setAttribute("orderid", orderId);
		request.setAttribute("orderamount", Amount);
		request.setAttribute("msg", sMsg);

		return 0;
	}

	public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("kq-notify");

		// 获取人民币网关账户号
		String merchantAcctId = (String) request.getParameter("merchantAcctId").trim();

		// 获取网关版本.固定值
		// /快钱会根据版本号来调用对应的接口处理程序。
		// /本代码版本号固定为v2.0
		String version = (String) request.getParameter("version").trim();

		// 获取语言种类.固定选择值。
		// 只能选择1、2、3
		// 1代表中文；2代表英文
		// 默认值为1
		String language = (String) request.getParameter("language").trim();

		// 签名类型.固定值
		// 1代表MD5签名
		// 当前版本固定为1
		String signType = (String) request.getParameter("signType").trim();

		// 获取支付方式
		// 值为：10、11、12、13、14
		//
		// 00：组合支付（网关支付页面显示快钱支持的各种支付方式，推荐使用）10：银行卡支付（网关支付页面只显示银行卡支付）.11：电话银行支付（网关支付页面只显示电话支付）.12：快钱账户支付（网关支付页面只显示快钱账户支付）.13：线下支付（网关支付页面只显示线下支付方式）.14：B2B支付（网关支付页面只显示B2B支付，但需要向快钱申请开通才能使用）
		String payType = (String) request.getParameter("payType").trim();

		// 获取银行代码
		// 参见银行代码列表
		String bankId = (String) request.getParameter("bankId").trim();

		// 获取商户订单号
		String orderId = (String) request.getParameter("orderId").trim();

		// 获取订单提交时间
		// 获取商户提交订单时的时间.14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
		// 如：20080101010101
		String orderTime = (String) request.getParameter("orderTime").trim();

		// 获取原始订单金额
		// 订单提交到快钱时的金额，单位为分。
		// 比方2 ，代表0.02元
		String orderAmount = (String) request.getParameter("orderAmount").trim();

		// 获取快钱交易号
		// 获取该交易在快钱的交易号
		String dealId = (String) request.getParameter("dealId").trim();

		// 获取银行交易号
		// 如果使用银行卡支付时，在银行的交易号。如不是通过银行支付，则为空
		String bankDealId = (String) request.getParameter("bankDealId").trim();

		// 获取在快钱交易时间
		// 14位数字。年[4位]月[2位]日[2位]时[2位]分[2位]秒[2位]
		// 如；20080101010101
		String dealTime = (String) request.getParameter("dealTime").trim();

		// 获取实际支付金额
		// 单位为分
		// 比方 2 ，代表0.02元
		String payAmount = (String) request.getParameter("payAmount").trim();

		// 获取交易手续费
		// 单位为分
		// 比方 2 ，代表0.02元
		String fee = (String) request.getParameter("fee").trim();

		// 获取扩展字段1
		String ext1 = (String) request.getParameter("ext1").trim();

		// 获取扩展字段2
		String ext2 = (String) request.getParameter("ext2").trim();

		// 获取处理结果
		// 10代表 成功11代表 失败
		String payResult = (String) request.getParameter("payResult").trim();

		// 获取错误代码
		// 详细见文档错误代码列表
		String errCode = (String) request.getParameter("errCode").trim();

		// 获取加密签名串
		String signMsg = (String) request.getParameter("signMsg").trim();

		// 生成加密串。必须保持如下顺序。
		String merchantSignMsgVal = "";
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "merchantAcctId", merchantAcctId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "version", version);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "language", language);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "signType", signType);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payType", payType);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "bankId", bankId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderId", orderId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderTime", orderTime);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "orderAmount", orderAmount);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "dealId", dealId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "bankDealId", bankDealId);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "dealTime", dealTime);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payAmount", payAmount);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "fee", fee);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "ext1", ext1);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "ext2", ext2);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "payResult", payResult);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "errCode", errCode);
		merchantSignMsgVal = BankUtil.appendParam(merchantSignMsgVal, "key", key);

//		String merchantSignMsg = BankUtil.md5Hex(merchantSignMsgVal.getBytes("UTF-8")).toUpperCase();

		// 初始化结果及地址
		int rtnOk = 0;
		String sMsg = "";

		double d_total_fee = Double.parseDouble(orderAmount);
		String Amount = (d_total_fee / 100) + "";
		d_total_fee = Double.parseDouble(Amount);

		 System.out.println("merchantSignMsg=" + merchantSignMsgVal);
		 System.out.println("signMsg=" + signMsg);

		// 商家进行数据处理，并跳转会商家显示支付结果的页面
		// /首先进行签名字符串验证
//		if (signMsg.toUpperCase().equals(merchantSignMsg.toUpperCase())) {
		if(KqUtil.check(merchantSignMsgVal, signMsg)){

			// /接着进行支付结果判断
			switch (Integer.parseInt(payResult)) {

			case 10:
				bean.setApplyid(orderId);
				bean.setBankid(BankBean.BANK_KQ);
				bean.setAddmoney(d_total_fee);
				bean.setDealid(dealId);
		

				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
				if (rc == 0) {
					if (bean.getBusiErrCode() == 0) {
						sMsg = "支付成功";
						rtnOk = 1;
					} else {
						sMsg = "支付成功";
						logger.error("applyAccountSuc 账户充值确认接口调用失败");
					}
				}
				break;
			default:
				sMsg = "支付失败";
				break;
			}
			logger.debug(sMsg);
		} else {
			sMsg = "签名失败";
			logger.error(sMsg);
		}

		// bean.setApplyid(orderId);
		// bean.setBankid(BankBean.BANK_KQ);
		// bean.setAddmoney(d_total_fee);
		//
		// logger.info(bean.getApplyid());
		// logger.info(bean.getAddmoney() + "");
		// logger.info(bean.getBankid() + "");
		// int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context,
		// GroupContain.USER_GROUP, "applyAccountSuc");
		// if (rc == 0) {
		// if (bean.getBusiErrCode() == 0) {
		// sMsg = "支付成功";
		// rtnOk = 1;
		// } else {
		// sMsg = "支付成功";
		// logger.error("applyAccountSuc 账户充值确认接口调用失败");
		// }
		// }

		String contents = "";
		contents = "<result>" + rtnOk + "</result><redirecturl>" + rtnUrl + "</redirecturl>";
		// logger.debug("contents=" + contents + " sMsg=" + sMsg);
		write_html_response(contents, response);

		return 0;
	}

	public static double getRound(double m, int num){
		BigDecimal dec = new BigDecimal(m);
		BigDecimal one = new BigDecimal("1");
		return dec.divide(one,num,BigDecimal.ROUND_CEILING).doubleValue();
	}
	
	public static void main(String[] args) throws Exception {
		
		double s = 39.88 * 100;
		System.out.println(new Double(s).intValue());
		Double D1 = new Double(s);
		int addmoney = D1.intValue();
		String orderAmount = addmoney + "";
		System.out.println("addmoney=" + addmoney);
		//String orderAmount = addmoney + "";// 总金额，以分为单位
		//System.out.println("orderAmount=" + orderAmount);
		
	}

}
