package com.caipiao.cpweb.bank;

import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.caipiao.cpweb.bank.llpay.HttpRequestSimple;
import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_sdo extends BankBeanImpl {

	private static String mer_id = "100894"; // 编号--测试商户号
	private static String notify_url = RETURN_HOST + "/phpu/sdonotify.phpx";

	private static String return_url = RETURN_HOST + "/phpu/sdoreceive.phpx";

	private static final String key = "shengfutongSHENGFUTONGtest";

	private static final String send_url = "https://mas.sdo.com/web-acquire-channel/cashier.htm";
	
	private static Map<String,String> statusMap = new HashMap<String,String>();
	static{
		statusMap.put("00", "等待付款中");
		statusMap.put("01", "付款成功");
		statusMap.put("02", "付款失败");
		statusMap.put("03", "过期");
		statusMap.put("04", "撤销成功");
		statusMap.put("05", "退款中");
		statusMap.put("06", "退款成功");
		statusMap.put("07", "退款失败");
		statusMap.put("08", "部分退款成功");
	}

	private static String getSendTime() {
		String url = "http://api.shengpay.com/mas/v1/timestamp?merchantNo="
				+ mer_id;
		String body = HttpRequestSimple.getInstance().getSendHttp(url);
		JSONObject jo = JSON.parseObject(body);
		// System.out.println(jo.getString("timestamp"));
		String timestamp = jo.getString("timestamp");
		return timestamp;
	}

	private static String getCurrentDateTimeStr() {
		SimpleDateFormat dataFormat = new SimpleDateFormat("yyyyMMddHHmmss");
		Date date = new Date();
		String timeString = dataFormat.format(date);
		return timeString;
	}

	public static void send(BankBean bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.debug("sdopay-send");

		String name = "B2CPayment"; // 版本名称
		String version = "V4.1.1.1.1";
		String charset = "UTF-8"; // 邮政编码
		String msgSender = mer_id;

		String timestamp = getSendTime();

		String orderNO = bean.getApplyid();

		DecimalFormat df = new DecimalFormat("#.00");

		String orderAmount = df
				.format(bean.getAddmoney() + bean.getHandmoney());
		// String orderTime = getCurrentDateTimeStr();

		String payType = "PT001";// 网银支付
		
		payType = "";

		String payChannel = bean.getPayType();
		if (payChannel == null || payChannel.equals(""))
			payChannel = "19";
		
		payChannel = "";

		String instCode = bean.getBanktype();

		String signType = "MD5"; // 签名方式

		String pageUrl = return_url;
		String backUrl = "";
		String notifyUrl = notify_url;

		String productName = "159cai";
		
		productName = "";
		
		String buyerContact = "";

		String user_ip = bean.getIpAddr(); // 获取客户端的IP地址
		
		user_ip = "";

		String banktype = bean.getBanktype();

		// 商户订单号
		String orderId = bean.getApplyid();

		// 订单金额 以分为单位，必须是整型数字 2--代表0.02元
		// double s = getRound((bean.getAddmoney()+bean.getHandmoney())*100,0);
		// Double D1 = new Double(s);
		// int addmoney = D1.intValue();
		// String orderAmount = addmoney + "";// 总金额，以分为单位

		// 订单提交日期
		String orderTime = bean.getApplydate();
		String ext = "";

		StringBuffer origin = new StringBuffer();
		origin.append(name).append(version).append(charset).append(msgSender)
				.append(timestamp).append(orderNO);
		origin.append(orderAmount).append(orderTime).append(payType)
				.append(payChannel).append(instCode);
		origin.append(pageUrl).append(backUrl).append(notifyUrl)
				.append(productName).append(buyerContact);
		origin.append(user_ip).append(ext).append(signType);
		
		origin.append(key);
		
		System.out.println("-------------------------------------------------------------------------");
		System.out.println(origin.toString());

		String signMsg = ZfbUtil.md5(origin.toString()).toUpperCase();

		String redirect = send_url;
		redirect += "?Name=" + name;
		redirect += "&Version=" + version;
		redirect += "&Charset=" + charset;
		redirect += "&MsgSender=" + msgSender;
		redirect += "&SendTime=" + timestamp;
		redirect += "&OrderNo=" + orderNO;
		redirect += "&OrderAmount=" + orderAmount;
		redirect += "&OrderTime=" + orderTime;
		redirect += "&payType=" + payType;
		redirect += "&payChannel=" + payChannel;
		redirect += "&InstCode=" + instCode;
		redirect += "&PageUrl=" + pageUrl;
		redirect += "&BackUrl=";
		redirect += "&NotifyUrl=" + notifyUrl;
		redirect += "&productName=" + productName;
		redirect += "&BuyerContact=";
		redirect += "&BuyderIp=" + user_ip;
		redirect += "&Ext1=" + ext;
		redirect += "&SignType=" + signType;
		redirect += "&SignMsg=" + signMsg;

		bean.setRedirect(redirect);
	}

	public int receive(BankBean bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.debug("sdopay-receive");

		response.setHeader("Cache-Control", "no-cache");

		String name = (String) request.getParameter("Name").trim();
		String version = (String) request.getParameter("Version").trim();
		String charset = (String) request.getParameter("Charset").trim();
		String traceNo = (String) request.getParameter("TraceNo").trim();
		String msgSender = (String) request.getParameter("MsgSender").trim();
		String sendTime = (String) request.getParameter("SendTime").trim();
		String instCode = (String) request.getParameter("InstCode").trim();
		String orderNo = (String) request.getParameter("OrderNo").trim();
		String orderAmount = (String) request.getParameter("OrderAmount").trim();
		String transNo = (String) request.getParameter("TransNo").trim();
		String transAmount = (String) request.getParameter("TransAmount").trim();
		String transStatus = (String) request.getParameter("TransStatus").trim();
		String transType = (String) request.getParameter("TransType").trim();
		String transTime = (String) request.getParameter("TransTime").trim();
		String merchantNo = (String) request.getParameter("MerchantNo").trim();
		
		String errorCode = (String) request.getParameter("ErrorCode").trim();
		String errorMsg = (String) request.getParameter("ErrorMsg").trim();
		String ext1 = (String) request.getParameter("Ext1").trim();
		
		String signType = (String) request.getParameter("SignType").trim();
		String bankSerialNo = (String) request.getParameter("BankSerialNo").trim();
		String signMsg = (String) request.getParameter("SignMsg").trim();
		
		StringBuffer origin = new StringBuffer();
		
		origin.append(name).append(version).append(charset).append(traceNo).append(msgSender)
		.append(sendTime).append(instCode).append(orderNo);
		origin.append(orderAmount).append(transNo).append(transAmount).append(transStatus);
		origin.append(transType).append(transTime).append(merchantNo)
		.append(errorCode).append(errorMsg).append(ext1).append(signType);
		
		String digest = ZfbUtil.md5(origin.append(key).toString()).toUpperCase();
		
		String ok = "";
		String sMsg = "";
		if(digest.equalsIgnoreCase(signMsg)){
			if(transStatus.equals("01")){
				sMsg = "付款成功";
				ok = "OK";
			}else{
				sMsg = "付款失败：" + statusMap.get(transStatus);
				ok = "ERROR";
			}
		}else{
			sMsg = "签名失败";
			ok = "ERROR";
		}
		
		double d_total_fee = Double.parseDouble(orderAmount);
		// String Amount = (d_total_fee / 100) + "";
		// d_total_fee = Double.parseDouble(Amount);
		request.setAttribute("rtnOk", ok);
		request.setAttribute("orderid", orderNo);
		request.setAttribute("orderamount", d_total_fee);
		request.setAttribute("msg", sMsg);
		return 0;
	}
	
	 public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
			logger.debug("sdopay-notify");
			
			response.setHeader("Cache-Control", "no-cache");
			response.setCharacterEncoding("UTF-8");
	        logger.info("进入支付异步通知数据接收处理");
	        String name = (String) request.getParameter("Name").trim();
			String version = (String) request.getParameter("Version").trim();
			String charset = (String) request.getParameter("Charset").trim();
			String traceNo = (String) request.getParameter("TraceNo").trim();
			String msgSender = (String) request.getParameter("MsgSender").trim();
			String sendTime = (String) request.getParameter("SendTime").trim();
			String instCode = (String) request.getParameter("InstCode").trim();
			String orderNo = (String) request.getParameter("OrderNo").trim();
			String orderAmount = (String) request.getParameter("OrderAmount").trim();
			String transNo = (String) request.getParameter("TransNo").trim();
			String transAmount = (String) request.getParameter("TransAmount").trim();
			String transStatus = (String) request.getParameter("TransStatus").trim();
			String transType = (String) request.getParameter("TransType").trim();
			String transTime = (String) request.getParameter("TransTime").trim();
			String merchantNo = (String) request.getParameter("MerchantNo").trim();
			
			String errorCode = (String) request.getParameter("ErrorCode").trim();
			String errorMsg = (String) request.getParameter("ErrorMsg").trim();
			String ext1 = (String) request.getParameter("Ext1").trim();
			
			String signType = (String) request.getParameter("SignType").trim();
			String bankSerialNo = (String) request.getParameter("BankSerialNo").trim();
			String signMsg = (String) request.getParameter("SignMsg").trim();
			
			StringBuffer origin = new StringBuffer();
			
			origin.append(name).append(version).append(charset).append(traceNo).append(msgSender)
			.append(sendTime).append(instCode).append(orderNo);
			origin.append(orderAmount).append(transNo).append(transAmount).append(transStatus);
			origin.append(transType).append(transTime).append(merchantNo)
			.append(errorCode).append(errorMsg).append(ext1).append(signType);
			
			String digest = ZfbUtil.md5(origin.append(key).toString()).toUpperCase();
			
	        logger.info("接收支付异步通知订单号：【" + orderNo + "】");
	        
	        String ret = "";
	        String sMsg = "";
	        if(digest.equalsIgnoreCase(signMsg)){
				if(transStatus.equals("01")){
					sMsg = "付款成功";
					ret = "OK";
					double d_total_fee = Double.parseDouble(orderAmount);

					bean.setApplyid(orderNo);
					bean.setBankid(BankBean.BANK_SFT);
					bean.setAddmoney(d_total_fee);
					bean.setDealid(transNo);
					
					int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
					if (rc == 0) {
						if (bean.getBusiErrCode() == 0) {
							sMsg = "交易成功";
							ret = "OK";
						} else {
							sMsg = "交易成功，但回调失败";
							ret = "ERROR";
							logger.error("applyAccountSuc 账户充值确认接口调用失败");
						}
					}else{
						sMsg = "交易成功，但回调失败，" + rc;
						ret = "ERROR";
						logger.error("applyAccountSuc 账户充值确认接口调用失败");
					}
				}else{
					sMsg = "付款失败：" + statusMap.get(transStatus);
					ret = "ERROR";
				}
			}else{
				sMsg = "签名失败";
				ret = "ERROR";
			}
	        
	        logger.info("订单号：【" + orderNo + "】，" + sMsg);
	        
	        write_html_response(ret, response);
			return 0;
		}

	public static void main(String[] args) {
		System.out.println(Bank_sdo.getSendTime());
	}

}
