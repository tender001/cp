package com.caipiao.cpweb.bank;


import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_19pay extends BankBeanImpl {
	
	//商家信息 [测试]
	/*
	private static String merchant_id = "275085";
	private static String merchant_key ="123456789";
	private static String http_url = "http://219.143.36.225/card/pgworder/orderdirect.do";
	*/
    //商家信息 [正式] 
	
	private static String merchant_id = "240023";
	private static String merchant_key ="7afcooc1pbbxvprt1miol5h78kb17sjbevzubcjwptjivg3bbk9frg4nnufwoipn1ixrtmbrit6nuy06zhfnduigwdh9y9qus7ur9eb4w34lo3muyqe43tyros48ytrf";
	private static String http_url = "http://change.19ego.cn/pgworder/orderdirect.do";
	
	private static String notify_url = RETURN_HOST + "/phpu/jxpaynotify.phpx";
	
	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.info("19paysend");
		response.setHeader("Cache-Control", "no-cache");
		
		String amount = String.valueOf(bean.getAddmoney()+bean.getHandmoney());// 总金额，以分为单位

		String version_id = "2.00";
		String order_date = bean.getApplydate();
		String order_id = bean.getApplyid();
		String currency = "RMB";
		String pm_id =bean.getDealid();
		String pc_id = "";
		if ("CMJFK".equals(pm_id)) {
			pc_id = "CMJFK00010001";
		}else if ("LTJFK".equals(pm_id)){
			pc_id = "LTJFK00020000";
		}else if ("DXJFK".equals(pm_id)){
			pc_id = "DXJFK00010001";
		}
		
		String cardnum=CipherUtil.encryptData(bean.getCardnum(), merchant_key);//DES加密
		String cardpass=CipherUtil.encryptData(bean.getCardpass(), merchant_key);

		String order_pdesc = "159cai";
		String user_name = "";
		String user_phone = "";
		String user_mobile = "";
		String user_email = "";

		String oriStr = "version_id=" + version_id + "&merchant_id=" + merchant_id + "&order_date=" + order_date + "&order_id=" + order_id + "&amount=" + amount
				+ "&currency=" + currency + "&cardnum1=" + cardnum +"&cardnum2=" + cardpass + "&pm_id=" + pm_id + "&pc_id=" + pc_id + "&merchant_key=" + merchant_key;
		
		String verifystring = BankUtil.md5Hex(oriStr);
		//logger.info("verifystring=\"" + verifystring + "\"");

		String ItemUrl=http_url;
		ItemUrl+="?version_id="+version_id;
		ItemUrl+="&merchant_id="+merchant_id;
		ItemUrl+="&verifystring="+verifystring;
		ItemUrl+="&order_date="+order_date;
		ItemUrl+="&order_id="+order_id;
		ItemUrl+="&amount="+amount;
		ItemUrl+="&cardnum1="+cardnum;
		ItemUrl+="&cardnum2="+cardpass;
		ItemUrl+="&currency="+currency;
		ItemUrl+="&pm_id="+pm_id;
		ItemUrl+="&pc_id="+pc_id;
		ItemUrl+="&returl=";
		ItemUrl+="&notify_url="+notify_url;
		ItemUrl+="&retmode=1";
		ItemUrl+="&select_amount="+amount;
		ItemUrl+="&order_pdesc="+order_pdesc;
		ItemUrl+="&user_name="+user_name;
		ItemUrl+="&user_phone="+user_phone;
		ItemUrl+="&user_mobile="+user_mobile;
		ItemUrl+="&user_email="+user_email;
	
		logger.info("19paysendUrl="+ItemUrl);

		HttpURLConnection jconn = null;
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		URL url = new URL(ItemUrl);
		jconn = (HttpURLConnection) url.openConnection();
		jconn.setDoOutput(true);
		jconn.setDoInput(true);
		jconn.connect();

		InputStream in = jconn.getInputStream();
		byte[] buf = new byte[4096];

		int bytesRead;
		while ((bytesRead = in.read(buf)) != -1) {
			byteArrayOutputStream.write(buf, 0, bytesRead);
		}

		String contents = new String(byteArrayOutputStream.toByteArray());
		
		if(!CheckUtil.isNullString(contents)){
			String[] a = contents.split("\\|");
			String result=a[11];
			String resultstr=a[12];
			logger.info("result=\"" + result + "\"");
			logger.info("resultstr=\"" + resultstr + "\"");
			
			// 获取加密签名串
			// 注意:为了安全,先验证数据订单的合法性!
			String ori = "version_id=" + a[0] + "&merchant_id=" + a[1] + "&order_date=" + a[3] + "&order_id=" + a[4] + "&amount=" + a[5]
					+ "&currency=" + a[6] + "&pay_sq=" + a[7] + "&pay_date=" + a[8] + "&pc_id=" + a[9] + "&result=" + result + "&merchant_key=" + merchant_key;

			logger.info("ori=\"" + ori + "\"");

			String merchantSignMsg = BankUtil.md5Hex(ori);
			logger.info("merchantSignMsg=\"" + merchantSignMsg + "\"");
			//logger.info("a[2]=\"" + a[2] + "\"");
			if (a[2].toUpperCase().equals(merchantSignMsg.toUpperCase())) {
				if(result.equals("F")){
						bean.setBusiErrCode(-100);
						bean.setBusiErrDesc("收单失败，请联系服务商。");
				}else{
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("支付请求成功,请及时查看账户余额。");
				}
			}else{
				bean.setBusiErrCode(-100);
				bean.setBusiErrDesc("签名认证失败，请联系服务商。");
			}
		}
		return;
	}

	public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		logger.debug("19pay-notify");
		response.setHeader("Cache-Control", "no-cache");

		String version_id = request.getParameter("version_id");
		String merchant_id = request.getParameter("merchant_id");
		String verifystring = request.getParameter("verifystring");
		String order_date = request.getParameter("order_date");
		String order_id = request.getParameter("order_id");
		String amount = request.getParameter("amount");
		String currency = request.getParameter("currency");
		String pay_sq = request.getParameter("pay_sq");
		String pay_date = request.getParameter("pay_date");
		String pc_id = request.getParameter("pc_id");
		String result = request.getParameter("result");
		
		//有卡号卡密时参数
		String card_num1 = "";
		try {		
		card_num1 = request.getParameter("card_num1");	
		} catch (Exception e) {
			// TODO: handle exception
		card_num1="";
		}
		String count = request.getParameter("count");
		String card_pwd1 = request.getParameter("card_pwd1");
		String pc_id1 = request.getParameter("pc_id1");		
		String card_status1 = request.getParameter("card_status1");
		String card_code1 = request.getParameter("card_code1");
		String card_date1 = request.getParameter("card_date1");
		String r1 = request.getParameter("r1");

		// 获取加密签名串
		// 注意:为了安全,先验证数据订单的合法性!
		String oriStr ="";

		if (!(card_num1 == null || "".equals(card_num1) || card_num1.trim().length() == 0)){
			oriStr = "version_id=" + version_id + "&merchant_id=" + merchant_id + "&order_id=" + order_id + "&result=" + result + "&order_date=" + order_date + "&amount=" + amount
			+ "&currency=" + currency + "&pay_sq=" + pay_sq + "&pay_date=" + pay_date +"&count=" + count + "&card_num1=" + card_num1 +"&card_pwd1=" + card_pwd1 +"&pc_id1=" + pc_id1 +"&card_status1=" + card_status1 +"&card_code1=" + card_code1 + "&card_date1=" + card_date1 + "&r1=" + r1 + "&merchant_key=" + merchant_key;
		}else{
			oriStr = "version_id=" + version_id + "&merchant_id=" + merchant_id + "&order_id=" + order_id + "&result=" + result + "&order_date=" + order_date + "&amount=" + amount
			+ "&currency=" + currency + "&pay_sq=" + pay_sq + "&pay_date=" + pay_date + "&pc_id=" + pc_id + "&merchant_key=" + merchant_key;
		}
		

		logger.info("19pay-notify--ori=\"" + oriStr + "\"");

		String merchantSignMsg = BankUtil.md5Hex(oriStr);

		
		logger.info("verifystring=" + verifystring);
		logger.info("merchantSignMsg=" + merchantSignMsg);
		

		double d_total_fee = Double.parseDouble(amount);

		// 商家进行数据处理，并跳转会商家显示支付结果的页面
		// /首先进行签名字符串验证
		String contents = "N";
		if (verifystring.toUpperCase().equals(merchantSignMsg.toUpperCase())) {
			// /接着进行支付结果判断
			if ("Y".equals(result)) {
				// 商户网站逻辑处理，比方更新订单支付状态为成功
				// 特别注意：只有verifystring.toUpperCase().equals(merchantSignMsg.toUpperCase())，且payResult=Y，才表示支付成功！同时将订单金额与提交订单前的订单金额进行对比校验。

				bean.setApplyid(order_id);
				bean.setBankid(BankBean.BANK_19PAY);
				bean.setAddmoney(d_total_fee);

				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
				if (rc == 0) {
					if (bean.getBusiErrCode() == 0) {
						contents = "Y";
					} else {
						contents = "N";
						logger.error("BANK_19PAY.notify 账户充值确认接口调用失败 " + oriStr);
						logger.error("errCode : " + bean.getBusiErrCode() + " errDesc :" + bean.getBusiErrDesc());
					}
				}
			}else if("F".equals(result)) {
				contents = "Y";
				logger.error("BANK_19PAY.notify 接口返回充值失败 " + oriStr);
			}
		} else {
			contents = "N";
			logger.error("BANK_19PAY.notify 签名失败 " + oriStr);
		}
		write_html_response(contents, response);
		return 0;
	}

//	public static void main(String[] args) throws Exception {
//		String s = "version_id=2.00&merchant_id=6250&order_date=20130627&order_id=6667&amount=0.01&currency=RMB&returl=http://test9.159cai.net/phpu/jxpay.phpx&pm_id=&pc_id=&merchant_key=123456789";
//		String verifystring = BankUtil.md5Hex(s);
//		System.out.println("verifystring:" + verifystring);
//	}
}