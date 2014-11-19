package com.caipiao.cpweb.bank;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import com.alipay.sign.RSA;
import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_zfb extends BankBeanImpl {

	private static String partnerID = "2088111984427922";
	private static String key = "rg12m54r8sco2dyte290b4vgax6ffjyn";
	private static String sellerEmail = "zf@159cai.com";
	
	public static String private_key = "MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBANcUPyx/lkokBOM1UfnFF1UckLs2Z2nh7RPMyhiMrats6LqsEhkCi4CiWS4ha6GuZcDtKzK2bfzd61IS1l6Ae4Qt+VZcdSpG+5vu875awBgiBCnbCP6YBm81vcAdSJYlOpizgS4JCuIalUqqaWN3hSP4tThuQcRAeHFwDi/ImJyDAgMBAAECgYBo2MnjG19cTSrEyB1qMRYqu34ihWbsSuKToGV0ij+vLaxWM8OuxXrT/lCTGF+rtaSM5BEG67+6YURyAhTWhLOw2mcEakFfVY0uTGadtsFODwHPkmDzL/kIhi99rB2gg0ota+FNVfd2oAmc//UvgHAeMA2bW+kxt9Y73XQE8yjbgQJBAP4kEemsgUtMo4y9lP8lkmwfK7pAWBiT2zajM6m///kfPG3NLJdJ4E4R026RBcZmL9WVxs2isX4o6TgLXtAmHpMCQQDYpwaT4RpkXIiSw124TlwrJF786c/OOtXm30kUuqWdMnbb6NFXDFMeeAPNN0bLLquR5X+XCIsroltpmLRi+VBRAkAuJGhoL9ztygVr2UQDK1Qxc1tiHqqgE8BaZDlOGcEk/ynemcD92vjx08S6r3QH+Ke4tM/6qA5n5I+rkEzvp+wnAkB2tG1CMSAIxTp/T1PWW/jcGn2BDYqycEIq0UR1ex6q1q+RJistCq+wDgnnMtYzFUskER6rXh8CtV5oqSaM5BVBAkBUqxfm8ro7eNagEnnWZidMrUIwesp1TQsQjtLFZTC9mVnpgLMj0IIaggojEBTQR6SvW7Sm7MqgqzYNUxlP0eoG";
	
	//public static String private_key = "MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAoTK3peVThrK0AnCejIlYrV0LvU3oWBxlJgZHBjL32ey6eTa2mGtKbUKSGsVj2Wcdna2VM7sLUWktUtwF3r7l+wIDAQABAkB254hb0Ls6ApuRqSzqkW1eA+Ji8xLN27Qoxjyhr/rvPeemEIbvTm1Q94X1/B/+BDXtvOr6kdNyt4WeqWdHECSRAiEA5ZpoR1pSML4l6PoSjjaJvxNaORRJemKZUhUUA3fnC68CIQCzuwn5FoWoKP24BYVl+6OdoeWsbZTNkIuKlp1pcOshdQIhANGzRKpmg8qg4F74hxn8FbK+KhkXvkRY6U9ekPjZ+dthAiBmx+FuJqkMf1SIte+RYJQygvD66DeeTrjd6j/emop8OQIgVOa4Idia5oGD3lImc+hLnYk0zeij0JfxxPReWpict8U=";
	 /**
     * 支付宝提供给商户的服务接入网关URL(新)
     */
    private static final String ALIPAY_GATEWAY_NEW = "https://mapi.alipay.com/gateway.do?";

	// 付完款后跳转的页面
	private static String return_url = RETURN_HOST + "/phpu/alipayreceive.phpx";
	// 付完款后服务器通知的页面
	private static String notify_url = RETURN_HOST + "/phpu/alipaynotify.phpx";
	// 页面编码
	public static String charset = "UTF-8";
	
	public static void check(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("支付宝风险控制检查");
		
		String gateway = "https://openapi.alipay.com/gateway.do?";
		
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

		Map<String, String> map = new HashMap<String, String>();
		
		map.put("service", "alipay.security.risk.detect");
		map.put("partner", partnerID);
		map.put("key", key);
		map.put("_input_charset", charset);
		map.put("timestamp", format.format(new Date()));
		map.put("terminal_type", "WEB");
		
		/** 业务数据开始 **/
		map.put("order_no", bean.getApplyid());
		map.put("order_credate_time", bean.getApplydate());
		map.put("order_category", "虚拟^彩票");
		map.put("order_item_name", productName);
		map.put("order_item_city", "上海");
		double s = bean.getAddmoney();
		String orderAmount = new DecimalFormat("#.##").format(s);
		map.put("order_amount", orderAmount);
		
		map.put("scene_code", "PAYMENT");
		
		String regDate = bean.getRegDate();
		if(regDate != null && regDate.length() >= 10){
			regDate = regDate.substring(0,10);
		}else regDate = "";
		
		map.put("buyer_account_no", bean.getUid());
		map.put("buyer_reg_email", bean.getEmail());
		map.put("buyer_bind_mobile", bean.getMobile());
		map.put("buyer_real_name", bean.getRealName());
		map.put("buyer_reg_date", regDate);
		map.put("buyer_identity_type", "IDENTITY_CARD");
		map.put("buyer_identity_no", bean.getIdCard());
		map.put("buyer_bind_bankcard", bean.getCardnum());
		map.put("env_client_ip", getRealIp(request));
		
		System.out.println(getSignData(map));
		
		String sign = RSA.sign(getSignData(map), private_key,"UTF-8");// PartnerConfig.RSA_PRIVATE
		
		//String sign = ZfbUtil.md5(getSignData(map));
		
		map.put("sign", sign);
		map.put("sign_type", "RSA");
		System.out.println(gateway+mapToUrl(map));
		
		String inputLine = "";
		try {
			URL url = new URL(gateway+mapToUrl(map));

			HttpsURLConnection urlConnection = (HttpsURLConnection) url.openConnection();
			
			urlConnection.setDoOutput(true);
			urlConnection.setDoInput(true);
			urlConnection.connect();

			InputStream in = urlConnection.getInputStream();
			byte[] buf = new byte[4096];
			
			ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			int bytesRead;
			while ((bytesRead = in.read(buf)) != -1) {
				byteArrayOutputStream.write(buf, 0, bytesRead);
			}

			String contents = new String(byteArrayOutputStream.toByteArray());
			System.out.println(contents);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("zfb-send");
		// response.setHeader("Cache-Control", "no-cache");
		String paygateway = "https://www.alipay.com/cooperate/gateway.do?"; // 支付接口（不可以修改）
		paygateway = ALIPAY_GATEWAY_NEW; // 支付接口（不可以修改）
		String service = "create_direct_pay_by_user";// 快速付款交易服务（不可以修改）
		String sign_type = "MD5";// 文件加密机制（不可以修改）
		String out_trade_no = bean.getApplyid();// 商户网站订单（也就是外部订单号，是通过客户网站传给支付宝，不可以重复）

		String input_charset = charset;
		// 页面编码（不可以修改）
		// partner和key提取方法：登陆签约支付宝账户--->点击“商家服务”就可以看到
		String partner = partnerID; // 支付宝合作伙伴id (账户内提取)

		String body = bean.getApplydate(); // 商品阿描述，推荐格式：商品名称（订单编号：订单编号）

		// 订单金额 10元必须 10.00
		double s = bean.getAddmoney();
		// Double D1 = new Double(s);
		// int addmoney = D1.intValue();
		// String orderAmount = addmoney + ".00";// 总金额，以分为单位
		String orderAmount = s + "";// 总金额，以分为单位

		String total_fee = orderAmount; // 订单总价

		String payment_type = "1";// 支付宝类型.1代表商品购买（目前填写1即可，不可以修改）
		String seller_email = sellerEmail; // 卖家支付宝帐户,例如：gwl25@126.com
		String subject = productName; // 商品名称
		String show_url = "http://www.159cai.com";
		
		//网银-银行
		String payType="";
		String banktype = bean.getBanktype();
		String bankidstr=bean.getBankid()+"";
		if(bankidstr.equals("10")){//判断是否快捷支付
			payType = "kjzf";
		}else{
			if (banktype.equals("00")) {
				payType = "directPay";
			}else if (banktype.equals("01")) {
				payType = "bankPay";
			} else {
				payType = "bankPay";
			}
		}
		
		///联合登录传值
		String token =  request.getSession().getAttribute("alipay_token")==null?"":(String)request.getSession().getAttribute("alipay_token");
		
		//防钓鱼时间戳
		String anti_phishing_key  = "";
		//获取客户端的IP地址，建议：编写获取客户端IP地址的程序
		String exter_invoke_ip= "";
		
		anti_phishing_key = query_timestamp();	//获取防钓鱼时间戳函数
		exter_invoke_ip = bean.getIpAddr();
		
		System.out.println("anti_phishing_key="+anti_phishing_key);
		System.out.println("exter_invoke_ip="+exter_invoke_ip);
		boolean bln=false;
    	  String applydate = "";
            int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "queryUserInfo");
            if (rc == 0) {
                if (bean.getBusiErrCode() == 0) {
                    applydate= bean.getApplydate();
                    applydate=applydate.substring(0,10);
                    bln=true;
                } else {                
                    logger.error("queryUserInfo 查询充值注册时间接口调用失败");
                }
            }
            String wbSecurityInfo="{\"regDate\":\""+applydate+"\",\"regName\":\""+bean.getUid()+"\",\"depAccount\":\""+bean.getUid()+"\"}";     
		
		String redirect = ZfbUtil.CreateUrl(paygateway, service, sign_type, out_trade_no, input_charset, partner, key, show_url, body, total_fee, payment_type, seller_email, subject, notify_url, return_url,payType,banktype,token,anti_phishing_key,exter_invoke_ip);
		String redirect_new="";
		if (bln){
           redirect_new = ZfbUtil.CreateUrl_wbSecurityInfo(paygateway, service, sign_type, out_trade_no, input_charset, partner, key, show_url, body, total_fee, payment_type, seller_email, subject, notify_url, return_url,payType,banktype,token,anti_phishing_key,exter_invoke_ip,wbSecurityInfo);
       }else{
           redirect_new= ZfbUtil.CreateUrl(paygateway, service, sign_type, out_trade_no, input_charset, partner, key, show_url, body, total_fee, payment_type, seller_email, subject, notify_url, return_url,payType,banktype,token,anti_phishing_key,exter_invoke_ip);
       }
		
        logger.error("支付宝redirect:"+redirect);
        logger.error("支付宝redirect_new:"+redirect_new);
        
        String contents = "<meta http-equiv=\"Cache-Control\" content=\"no-cache\"/> \r\n";
        contents += "<script language=\"javascript\">document.location.href='" + redirect_new + "';</script>";

        bean.setContents(contents);
        bean.setRedirect(redirect_new);


	}
	
	public static String query_timestamp() throws MalformedURLException, DocumentException, IOException {
		
        //构造访问query_timestamp接口的URL串
        String strUrl = ALIPAY_GATEWAY_NEW + "service=query_timestamp&partner=" + partnerID;
        StringBuffer result = new StringBuffer();

        SAXReader reader = new SAXReader();
        Document doc = reader.read(new URL(strUrl).openStream());

        List<Node> nodeList = doc.selectNodes("//alipay/*");

        for (Node node : nodeList) {
            // 截取部分不需要解析的信息
            if (node.getName().equals("is_success") && node.getText().equals("T")) {
                // 判断是否有成功标示
                List<Node> nodeList1 = doc.selectNodes("//response/timestamp/*");
                for (Node node1 : nodeList1) {
                    result.append(node1.getText());
                }
            }
        }        
        return result.toString();		
	}

	public int receive(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("zfb-receive");
		response.setHeader("Cache-Control", "no-cache");

		String partner = partnerID; // 支付宝合作伙伴id (账户内提取)
		String privateKey = key; // 支付宝安全校验码(账户内提取)

		// 如果您服务器不支持https交互，可以使用http的验证查询地址
		/*
		 * 注意下面的注释，如果在测试的时候导致response等于空值的情况，请将下面一个注释，打开上面一个验证连接，另外检查本地端口，
		 * 请挡开80或者443端口
		 */
		// String alipayNotifyURL =
		// "https://www.alipay.com/cooperate/gateway.do?service=notify_verify"
		String alipayNotifyURL = "http://notify.alipay.com/trade/notify_query.do?" + "partner=" + partner + "&notify_id=" +request.getParameter("notify_id");
				
		String sign = request.getParameter("sign");
		// 获取支付宝ATN返回结果，true是正确的订单信息，false 是无效的
		String responseTxt = ZfbUtil.check(alipayNotifyURL);
		logger.debug("responseTxt=" + responseTxt);

		Map<String, String> params = new HashMap<String, String>();
		// 获得POST 过来参数设置到新的params中
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
				logger.debug(valueStr);
				//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "UTF-8");
			}
			// 乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化（现在已经使用）
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "GBK");
			//valueStr =new String(valueStr.getBytes(), "GBK");
			params.put(name, valueStr);
		}

		String mysign = ZfbUtil.sign(params, privateKey);

		// 初始化结果及地址
		int rtnOk = 0;
		String sMsg = "";

		String orderId = request.getParameter("out_trade_no");
		String get_total_fee = request.getParameter("total_fee");
		String get_subject = new String(request.getParameter("subject").getBytes("ISO-8859-1"), "GBK");
		String get_body = new String(request.getParameter("body").getBytes("ISO-8859-1"), "GBK");

		double d_total_fee = Double.parseDouble(get_total_fee);
		String Amount = (d_total_fee) + "";
		d_total_fee = Double.parseDouble(Amount);

		logger.debug("mysign=" + mysign);
		logger.debug("sign=" + request.getParameter("sign"));
		
		if (mysign.equals(request.getParameter("sign")) && responseTxt.equals("true")) {
			// 即时到账中需要判断各个交易的状态----WAIT_BUYER_PAY -->TRADE_FINISHED（可以参考notify）
			// 在这里可以写入数据处理,
			if (request.getParameter("trade_status").equals("TRADE_FINISHED") || request.getParameter("trade_status").equals("TRADE_SUCCESS")) {
				sMsg = "支付成功";
				rtnOk = 1;
			} else {
				sMsg = "支付失败";
			}
			logger.debug(sMsg);
		} else {
			sMsg = "签名失败";
			logger.error(sMsg);
		}
		// request.setCharacterEncoding(BaseBean.ENCODING);
		request.setAttribute("rtnOk", rtnOk);
		request.setAttribute("orderid", orderId);
		request.setAttribute("orderamount", Amount);
		request.setAttribute("msg", sMsg);
		return 0;

	}

	public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("zfb-notify");
		response.setHeader("Cache-Control", "no-cache");

		String partner = partnerID; // 支付宝合作伙伴id (账户内提取)
		String privateKey = key; // 支付宝安全校验码(账户内提取)

		// 如果您服务器不支持https交互，可以使用http的验证查询地址
		/*
		 * 注意下面的注释，如果在测试的时候导致response等于空值的情况，请将下面一个注释，打开上面一个验证连接，另外检查本地端口，
		 * 请挡开80或者443端口
		 */
		// String alipayNotifyURL =
		// "https://www.alipay.com/cooperate/gateway.do?service=notify_verify"
		String alipayNotifyURL = "http://notify.alipay.com/trade/notify_query.do?" + "partner=" + partner + "&notify_id=" + request.getParameter("notify_id");

		String sign = request.getParameter("sign");
		// 获取支付宝ATN返回结果，true是正确的订单信息，false 是无效的
		String responseTxt = ZfbUtil.check(alipayNotifyURL);
		
		Map params = new HashMap();
		// 获得POST 过来参数设置到新的params中
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";	
			}
			// 乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化（现在已经使用）
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "GBK");
			//valueStr = new String(valueStr.getBytes("GBK"), "UTF-8");			
			params.put(name, valueStr);
		}

		String mysign = ZfbUtil.sign(params, privateKey);

		logger.debug("mysign=" + mysign);
		logger.debug("sign=" + request.getParameter("sign"));

		// 初始化结果及地址
		int rtnOk = 0;
		String sMsg = "";

		String orderId = request.getParameter("out_trade_no");
		String get_total_fee = request.getParameter("total_fee");
		String get_subject = new String(request.getParameter("subject").getBytes("ISO-8859-1"), "GBK");
		String get_body = new String(request.getParameter("body").getBytes("ISO-8859-1"), "GBK");

		double d_total_fee = Double.parseDouble(get_total_fee);
		String Amount = (d_total_fee) + "";
		d_total_fee = Double.parseDouble(Amount);

		if (mysign.equals(request.getParameter("sign")) && responseTxt.equals("true")) {
			// 即时到账中需要判断各个交易的状态----WAIT_BUYER_PAY -->TRADE_FINISHED（可以参考notify）
			// 在这里可以写入数据处理,
			if (request.getParameter("trade_status").equals("TRADE_FINISHED") || request.getParameter("trade_status").equals("TRADE_SUCCESS")) {

				// 商户网站逻辑处理，比方更新订单支付状态为成功
				// 特别注意：只有signMsg.toUpperCase().equals(merchantSignMsg.toUpperCase())，且payResult=10，才表示支付成功！同时将订单金额与提交订单前的订单金额进行对比校验。
				bean.setApplyid(orderId);
				bean.setBankid(BankBean.BANK_ZFB);
				bean.setAddmoney(d_total_fee);

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
			} else {
				sMsg = "支付失败";
			}
			logger.debug(sMsg);
		} else {
			sMsg = "签名失败";
			logger.error(sMsg);
		}

		String contents = "";
		if (rtnOk == 1) {
			contents = "success";
		} else {
			contents = "fail";
		}
		logger.debug("contents=" + contents);
		write_html_response(contents, response);
		return 0;

	}

	// public static void send_sound(BankBean bean, ServiceContext context,
	// HttpServletRequest request, HttpServletResponse response) throws
	// Exception {
	// logger.debug("zfb-send_sound");
	// response.setHeader("Cache-Control", "no-cache");
	// String paygateway = "https://www.alipay.com/cooperate/gateway.do?"; //
	// 支付接口（不可以修改）
	// String service = "direct_ivr_trade_create";// 快速付款交易服务（不可以修改）
	// String sign_type = "MD5";// 文件加密机制（不可以修改）
	// String out_trade_no = bean.getBillno();//
	// 商户网站订单（也就是外部订单号，是通过客户网站传给支付宝，不可以重复）
	//
	// String input_charset = charset;
	// // 页面编码（不可以修改）
	// // partner和key提取方法：登陆签约支付宝账户--->点击“商家服务”就可以看到
	// String partner = partnerID; // 支付宝合作伙伴id (账户内提取)
	//
	// String body = bean.getAbbtime(); // 商品阿描述，推荐格式：商品名称（订单编号：订单编号）
	//
	// // 订单金额 10元必须 10.00
	// double s = bean.getAddmoney();
	// // Double D1 = new Double(s);
	// // int addmoney = D1.intValue();
	// // String orderAmount = addmoney + ".00";// 总金额，以分为单位
	// String orderAmount = s + "";// 总金额，以分为单位
	//
	// String total_fee = orderAmount; // 订单总价
	//
	// String payment_type = "1";// 支付宝类型.1代表商品购买（目前填写1即可，不可以修改）
	// String seller_email = sellerEmail; // 卖家支付宝帐户,例如：gwl25@126.com
	// // String subject = "彩票大赢家购彩充值"; // 商品名称
	// String subject = "Lottery"; // 商品名称
	// String show_url = "http://trade.cpdyj.com";
	//
	// String price = total_fee;
	// String is_ivr_pay = "T"; // T/F ，如果为空则同F处理，不支持语音支付，只会创建普通的即时到帐
	// String receive_mobile = bean.getMobile();
	// String quantity = "1";
	//
	// String ItemUrl = ZfbUtil.CreateUrl2(paygateway, service, partner,
	// subject, body, out_trade_no, price, payment_type, seller_email,
	// notify_url, is_ivr_pay, receive_mobile, key, sign_type, show_url,
	// quantity, input_charset);
	//
	// bean.setAddurl(ItemUrl);
	//
	// String contents =
	// "<meta http-equiv=\"Cache-Control\" content=\"no-cache\"/> \r\n";
	// contents += "<script language=\"javascript\">document.location.href='" +
	// ItemUrl + "';</script>";
	//
	// logger.debug(bean.getAddurl());
	// if (!StringUtil.checkParameterIsEmpty(bean.getMerchantacctid())) {
	// // response.sendRedirect(bean.getAddurl());
	// write_html_response(bean.getAddurl(), response);
	// } else {
	// response.sendRedirect(bean.getAddurl());
	// // write_html_response(contents, response);
	// }
	// }
	
	public static String getSignData(Map<String, String> params) {
		StringBuffer content = new StringBuffer();

		// 按照key做排序
		List<String> keys = new ArrayList<String>(params.keySet());
		Collections.sort(keys);

		for (int i = 0; i < keys.size(); i++) {
			String key = (String) keys.get(i);
			if ("sign".equals(key) || "sign_type".equals(key)) {
				continue;
			}
			String value = (String) params.get(key);
			if (value != null) {
				content.append((i == 0 ? "" : "&") + key + "=" + value);
			} else {
				content.append((i == 0 ? "" : "&") + key + "=");
			}

		}

		return content.toString();
	}
	
	public static String mapToUrl(Map<String, String> params) throws UnsupportedEncodingException {
        StringBuilder sb = new StringBuilder();
        boolean isFirst = true;
        for (String key : params.keySet()) {
            String value = params.get(key);
            if (isFirst) {
                sb.append(key + "=" + URLEncoder.encode(value, "utf-8"));
                isFirst = false;
            } else {
                if (value != null) {
                    sb.append("&" + key + "=" + URLEncoder.encode(value, "utf-8"));
                } else {
                    sb.append("&" + key + "=");
                }
            }
        }
        return sb.toString();
    }

	public static void main(String[] args) throws Exception {
		// System.out.println(MD5Util.compute("playNamelogicCodetermNorunCodedateTime").toUpperCase());
		// System.out.println("<result>" + 0 + "</result><redirecturl>" +
		// "/jsp/kq_receive.jsp" + "?orderid=" + "201005180420118" +
		// "&orderamount=" + "200" + "&msg="
		// + URLEncoder.encode("我是中国人", "gbk") + "</redirecturl>");

	}

}
