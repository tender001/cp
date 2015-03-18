package com.caipiao.mob.bank;

import java.io.DataOutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;

import com.alipay.util.AlipayNotify;
import com.caipiao.mob.group.Constants;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_zfb extends BankBeanImpl {

public static Logger logger = LoggerFactory.getLogger("pay");
	
	public static final String ENCODING = "UTF-8";
	
	private static String partnerID = "2088111984427922";
	private static String key = "rg12m54r8sco2dyte290b4vgax6ffjyn";
	private static String sellerEmail = "zf@159cai.com";
	
	public static void notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("zfb-notify");
		response.setHeader("Cache-Control", "no-cache");

		//String partner = partnerID; // 支付宝合作伙伴id (账户内提取)
		//String privateKey = key; // 支付宝安全校验码(账户内提取)

		//获取支付宝POST过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
			params.put(name, valueStr);
		}
		
		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
		//商户订单号
		String out_trade_no = "";
		if(request.getParameter("out_trade_no") != null)
			out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");

		//支付宝交易号
		String trade_no = "";
		if(request.getParameter("trade_no") != null)
			trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");

		//交易状态
		String trade_status = "";
		if(request.getParameter("trade_status") != null)
			trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"),"UTF-8");
		
		String str_total_fee = request.getParameter("total_fee");
		double d_total_fee = 0.00D;
		if(str_total_fee != null)
			d_total_fee = Double.parseDouble(str_total_fee);
		//String Amount = (d_total_fee) + "";
		//d_total_fee = Double.parseDouble(Amount);
		
		int rtnOk = 0;
		String msg = "";

		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

		if(AlipayNotify.verify(params)){//验证成功
			//请在这里加上商户的业务逻辑程序代码

			//——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
			
			if(trade_status.equals("TRADE_FINISHED") || trade_status.equals("TRADE_SUCCESS")){
				//判断该笔订单是否在商户网站中已经做过处理
					//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
					//如果有做过处理，不执行商户的业务程序
					
				//注意：
				//该种交易状态只在两种情况下出现
				//1、开通了普通即时到账，买家付款成功后。
				//2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
				bean.setOrdernumber(out_trade_no);
				bean.setBankID(BankBean.BANK_ZFB);
				bean.setAddMoney(d_total_fee);

				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, Constants.USER_GROUP, "addMoneySuccess");
				if (rc == 0) {
					if (bean.getStatus().equals("0")) {
						msg = "支付成功";
						rtnOk = 1;
					} else {
						msg = "支付成功";
						logger.error("applyAccountSuc 账户充值确认接口调用失败");
					}
				}
			} else{
				msg = "支付失败";
			}
			logger.debug(msg);
				
		}else{//验证失败
			msg = "签名失败";
			logger.error(msg);
		}
		
		String contents = "";
		if (rtnOk == 1) {
			contents = "success";
		} else {
			contents = "fail";
		}
		logger.debug("contents=" + contents);
		write_html_response(contents, response);
	}
	
	public static void wapNotify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("zfb-wap-notify");
		response.setHeader("Cache-Control", "no-cache");

		String partner = partnerID; // 支付宝合作伙伴id (账户内提取)
		String privateKey = key; // 支付宝安全校验码(账户内提取)

		//获取支付宝POST过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
			params.put(name, valueStr);
		}
		
		Document doc_notify_data = DocumentHelper.parseText(params.get("notify_data"));
		
		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
		//商户订单号
		String out_trade_no = "";
		String trade_no = "";
		String trade_status = "";
		
		double d_total_fee = 0.00D;
		
		if(doc_notify_data != null){
			out_trade_no = doc_notify_data.selectSingleNode( "//notify/out_trade_no" ).getText();
			
			//支付宝交易号
			trade_no = doc_notify_data.selectSingleNode( "//notify/trade_no" ).getText();

			//交易状态
			trade_status = doc_notify_data.selectSingleNode( "//notify/trade_status" ).getText();
			
			String str_total_fee = doc_notify_data.selectSingleNode( "//notify/total_fee" ).getText();
			
			if(str_total_fee != null)
				d_total_fee = Double.parseDouble(str_total_fee);
			
		}
		
		
		//String Amount = (d_total_fee) + "";
		//d_total_fee = Double.parseDouble(Amount);
		
		int rtnOk = 0;
		String msg = "";

		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

		if(AlipayNotify.verifyNotify(params)){//验证成功
			//请在这里加上商户的业务逻辑程序代码

			//——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
			
			if(trade_status.equals("TRADE_FINISHED") || trade_status.equals("TRADE_SUCCESS")){
				//判断该笔订单是否在商户网站中已经做过处理
					//如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
					//如果有做过处理，不执行商户的业务程序
					
				//注意：
				//该种交易状态只在两种情况下出现
				//1、开通了普通即时到账，买家付款成功后。
				//2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
				bean.setOrdernumber(out_trade_no);
				bean.setBankID(BankBean.BANK_ZFB);
				bean.setAddMoney(d_total_fee);

				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, Constants.USER_GROUP, "addMoneySuccess");
				if (rc == 0) {
					if (bean.getStatus().equals("0")) {
						msg = "支付成功";
						rtnOk = 1;
					} else {
						msg = "支付成功";
						logger.error("applyAccountSuc 账户充值确认接口调用失败");
					}
				}
			} else{
				msg = "支付失败";
			}
			logger.debug(msg);
				
		}else{//验证失败
			msg = "签名失败";
			logger.error(msg);
		}
		
		String contents = "";
		if (rtnOk == 1) {
			contents = "success";
		} else {
			contents = "fail";
		}
		logger.debug("contents=" + contents);
		write_html_response(contents, response);
	}
	
	public static void write_html_response(String contents, HttpServletResponse response) throws Exception {
		response.setContentType("text/html; charset=" + ENCODING);
		response.setCharacterEncoding(ENCODING);
		DataOutputStream out = new DataOutputStream(response.getOutputStream());
		StringBuffer buffer = new StringBuffer();
		buffer.append(contents);
		out.write((new String(buffer)).getBytes(ENCODING));
		out.flush();
		out.close();
	}

}
