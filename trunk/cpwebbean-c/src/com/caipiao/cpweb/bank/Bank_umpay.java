package com.caipiao.cpweb.bank;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.bank.BankBean;
import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_umpay extends BankBeanImpl {

	/**
	 * 联动优势--信用卡快捷支付
	 */
	//demo测试id
	private static String mer_id = "6266"; //编号--联动提供  
	private static String notify_url = RETURN_HOST + "/phpu/unotify.phpx";

	private static String return_url = RETURN_HOST + "/phpu/ureceive.phpx";

	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("umpay-send");
		
		String service = "pay_req_shortcut_front";  //接口名称
		String charset = "UTF-8"; //邮政编码
		String sign_type = "RSA"; //签名方式
		String version = "4.0"; //版本号
		String pay_type = "CREDITCARD";//信用卡支付
		
		if(bean.getPayType().equalsIgnoreCase("B2CBANK")){//网银直连
			service = "pay_req_split_direct";
			pay_type = "B2CBANK";
		}
		
		bean.setPayType(pay_type); //如果为空，会设置默认的支付方式为信用卡支付

		String user_ip = bean.getIpAddr(); //获取客户端的IP地址
		String banktype = bean.getBanktype();
		
		// 商户订单号
		String orderId = bean.getApplyid();

		// 订单金额  以分为单位，必须是整型数字   2--代表0.02元
		double s = getRound((bean.getAddmoney()+bean.getHandmoney())*100,0);
		Double D1 = new Double(s);
		int addmoney = D1.intValue();
		String orderAmount = addmoney + "";// 总金额，以分为单位

		// 订单提交日期
		String orderTime = bean.getApplydate();

		
		java.util.Map<String, String> map =new java.util.HashMap();
		map.put("service",service);
		map.put("charset",charset);
		map.put("mer_id",mer_id);
		map.put("sign_type",sign_type);
		map.put("ret_url",return_url);
		map.put("notify_url",notify_url);
		map.put("res_format","HTML");
		map.put("version",version);
		map.put("goods_id","159cai");
		map.put("goods_inf","159cai");
		map.put("order_id",orderId);
		map.put("mer_date",orderTime);
		map.put("amount",orderAmount);
		map.put("amt_type","RMB");
		map.put("pay_type",pay_type);
		map.put("gate_id",banktype);
		map.put("user_ip",user_ip);
		map.put("expire_time","1440");  //订单过期--分钟
		
		
		if(bean.getPayType().equalsIgnoreCase("CREDITCARD")){
			map.put("identity_type","IDENTITY_CARD");//身份证
			map.put("identity_code", bean.getIdCard());//身份证号码
			map.put("card_holder", bean.getRealName());//持卡人姓名
			map.put("can_modify_flag", "0");//0为不允许修改，""为允许修改
		}
		
		
		//map.put("mer_cust_id", bean.getUseq());
		
		com.umpay.api.common.ReqData reqData = com.umpay.api.paygate.v40.Mer2Plat_v40.ReqDataByGet(map);
		String sign = reqData.getSign();//这个是为了在本DEMO中显示签名结果。
		String plain = reqData.getPlain();//这个是为了在本DEMO中显示签名原串
		String url = reqData.getUrl();
		bean.setRedirect(url);
	}
	
	public static void directSend(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("umpay-directSend");
		
		String service = "pay_req_split_direct";  //接口名称
		String charset = "UTF-8"; //邮政编码
		String sign_type = "RSA"; //签名方式
		String version = "4.0"; //版本号

		String user_ip = bean.getIpAddr(); //获取客户端的IP地址
		String banktype = bean.getBanktype();
		
		// 商户订单号
		String orderId = bean.getApplyid();

		// 订单金额  以分为单位，必须是整型数字   2--代表0.02元
		double s = getRound((bean.getAddmoney()+bean.getHandmoney())*100,0);
		Double D1 = new Double(s);
		int addmoney = D1.intValue();
		String orderAmount = addmoney + "";// 总金额，以分为单位

		// 订单提交日期
		String orderTime = bean.getApplydate();

		
		java.util.Map<String, String> map =new java.util.HashMap();
		map.put("service",service);
		map.put("charset",charset);
		map.put("mer_id",mer_id);
		map.put("sign_type",sign_type);
		map.put("ret_url",return_url);
		map.put("notify_url",notify_url);
		map.put("res_format","HTML");
		map.put("version",version);
		map.put("goods_id","159cai");
		map.put("goods_inf","159cai");
		map.put("order_id",orderId);
		map.put("mer_date",orderTime);
		map.put("amount",orderAmount);
		map.put("amt_type","RMB");
		map.put("pay_type","B2CBANK");  //个人网银直连
		map.put("gate_id",banktype);
		map.put("user_ip",user_ip);
		map.put("expire_time","1440");  //订单过期--分钟
		com.umpay.api.common.ReqData reqData = com.umpay.api.paygate.v40.Mer2Plat_v40.ReqDataByGet(map);
		String sign = reqData.getSign();//这个是为了在本DEMO中显示签名结果。
		String plain = reqData.getPlain();//这个是为了在本DEMO中显示签名原串
		String url = reqData.getUrl();
		bean.setRedirect(url);
	}

	public int receive(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("umpay-receive");

		response.setHeader("Cache-Control", "no-cache");
		//获取请求数据
		Map<String, String> ht = new HashMap();
		Map requestParams = request.getParameterMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			ht.put(name, valueStr);
		} 
		
	    //获取UMPAY平台请求商户的支付结果通知数据,并对请求数据进行验签
	    Map<String, String> reqData = com.umpay.api.paygate.v40.Plat2Mer_v40.getPlatNotifyData(ht);
	    //生成平台响应UMPAY平台数据,将该串放入META标签
	    Map<String, String> resData = new HashMap();
	    resData.put("mer_id", request.getParameter("mer_id"));
	    resData.put("sign_type", request.getParameter("sign_type"));
	    resData.put("version", request.getParameter("version"));
	    resData.put("order_id", request.getParameter("order_id"));
	    resData.put("mer_date", request.getParameter("mer_date"));
	    
		int rtnOk = 0;
		String sMsg = "";
	    if ("TRADE_SUCCESS".equals(request.getParameter("trade_state"))) {
			sMsg = "支付成功";
			rtnOk = 1;
	    } else {
			sMsg = "支付失败";
	    }
		double d_total_fee = Double.parseDouble(reqData.get("amount"));
		String Amount = (d_total_fee / 100) + "";
		d_total_fee = Double.parseDouble(Amount);
		request.setAttribute("rtnOk", rtnOk);
		request.setAttribute("orderid", reqData.get("order_id"));
		request.setAttribute("orderamount", d_total_fee);
		request.setAttribute("msg", sMsg);
		return 0;
	}

	public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("umpay-notify");
		//请求数据
		Map requestParams = request.getParameterMap();
		Map<String, String> ht = new HashMap();
		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr ="";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]:valueStr + values[i] + ",";
			}
			ht.put(name, valueStr);
		} 
	
	    //获取UMPAY平台请求商户的支付结果通知数据,并对请求数据进行验签
	    Map<String, String> reqData = com.umpay.api.paygate.v40.Plat2Mer_v40.getPlatNotifyData(ht);
	    //生成平台响应数据,将该串放入META标签
	    Map<String, String> resData = new HashMap();
	    resData.put("mer_id", request.getParameter("mer_id"));
	    resData.put("sign_type", request.getParameter("sign_type"));
	    resData.put("version", request.getParameter("version"));
	    resData.put("order_id", request.getParameter("order_id"));
	    resData.put("mer_date", request.getParameter("mer_date"));
	    if ("TRADE_SUCCESS".equals(request.getParameter("trade_state"))) {
			double d_total_fee = Double.parseDouble(reqData.get("amount"));
			String Amount = (d_total_fee / 100) + "";
			d_total_fee = Double.parseDouble(Amount);
			bean.setApplyid(reqData.get("order_id"));
			bean.setBankid(BankBean.BANK_UMPAY);
			bean.setAddmoney(d_total_fee);
			bean.setDealid(reqData.get("trade_no"));
	
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
			if (rc == 0) {
				if (bean.getBusiErrCode() == 0) {
					resData.put("ret_code", "0000");
				} else {
					resData.put("ret_code", "1111");
					logger.error("Bank_umpay.notify:applyAccountSuc 账户充值确认接口调用失败");
				}
			}
	    } else {
	        resData.put("ret_code", "1111");
	    }
	    resData.put("ret_msg", "OK");
	    String data = com.umpay.api.paygate.v40.Mer2Plat_v40.merNotifyResData(resData);
		String contents = "";
		contents = "<META NAME=\"MobilePayPlatform\" CONTENT=\""+data+"\" />";
		write_html_response(contents, response);
		return 0;
	}

	public static double getRound(double m, int num){
		BigDecimal dec = new BigDecimal(m);
		BigDecimal one = new BigDecimal("1");
		return dec.divide(one,num,BigDecimal.ROUND_CEILING).doubleValue();
	}
}