package com.caipiao.mob.bank;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.caipiao.mob.Status;
import com.caipiao.mob.group.Constants;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;


public class Bank_umpay extends BankBeanImpl {

	/**
	 * 联动优势--信用卡/无网银快捷支付
	 */
	private static String mer_id = "6266"; //编号--联动提供  
	private static String notify_url = RETURN_HOST + "/unotify.php";

	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("umpay-send");
		
		String service = "pay_req_shortcut";  //接口名称
		String charset = "UTF-8"; //邮政编码
		String sign_type = "RSA"; //签名方式
		String version = "4.0"; //版本号
		String pay_type = "CREDITCARD";//信用卡支付
		
		logger.debug(charset);
		if(bean.getPayType().equalsIgnoreCase("DEBITCARD")){//借记卡
			pay_type = "DEBITCARD";
		}
		
		bean.setPayType(pay_type); //如果为空，会设置默认的支付方式为信用卡支付

		String banktype = bean.getBanktype();
		
		// 商户订单号
		String orderId = bean.getOrdernumber();

		// 订单金额  以分为单位，必须是整型数字   2--代表0.02元
		double s = getRound((bean.getMoney()+bean.getMoneyRate())*100,0);
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
		//map.put("ret_url","");
		map.put("notify_url",notify_url);
		map.put("res_format","HTML");
		map.put("version",version);
		map.put("goods_id","159cai");
		map.put("goods_inf","159cai");
		map.put("order_id",orderId);
		map.put("mer_date",orderTime);
		map.put("amount",orderAmount);
		map.put("amt_type","RMB");
		//map.put("pay_type",pay_type);
		//map.put("gate_id",banktype);
		map.put("expire_time","1440");  //订单过期--分钟
		//map.put("can_modify_flag", "0");//0为不允许修改，""为允许修改
//		if(bean.getPayType().equalsIgnoreCase("CREDITCARD")||bean.getPayType().equalsIgnoreCase("DEBITCARD")){
//			
//			if(bean.getIdno() != null && !bean.getIdno().trim().equals("") && bean.getName() != null && !bean.getName().trim().equals("")){
//			
//				map.put("identity_type","IDENTITY_CARD");//身份证
//				map.put("identity_code", bean.getIdno());//身份证号码
//				map.put("card_holder", bean.getName());//持卡人姓名
//				//map.put("card_holder", new String(bean.getRealName().getBytes("utf-8"),"gbk"));//持卡人姓名
//				//map.put("card_holder",bean.getRealName());//持卡人姓名
//			}
//		}
//		
//		logger.info("-------------" + map.get("card_holder"));
//		logger.info("-------------" + bean.getIdno());
		
		
		//map.put("mer_cust_id", bean.getUseq());
		//System.out.println("---------------"+map.toString());
		com.umpay.api.common.ReqData reqData = com.umpay.api.paygate.v40.Mer2Plat_v40.makeReqDataByGet(map);
		String sign = reqData.getSign();//这个是为了在本DEMO中显示签名结果。
		logger.info(sign);
		String plain = reqData.getPlain();//这个是为了在本DEMO中显示签名原串
		String url = reqData.getUrl();
		//logger.info("----------url-------------"+url);
		bean.setRedirect(url);
	}

	public static void notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
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
	    String status = "";
		String message = "";
	    if ("TRADE_SUCCESS".equals(request.getParameter("trade_state"))) {
			double d_total_fee = Double.parseDouble(reqData.get("amount"));
			String Amount = (d_total_fee / 100) + "";
			d_total_fee = Double.parseDouble(Amount);
			bean.setOrdernumber(reqData.get("order_id"));
			bean.setBankID(BankBean.BANK_UMPAY);
			bean.setAddMoney(d_total_fee);
			bean.setDealid(reqData.get("trade_no"));
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, Constants.USER_GROUP, "addMoneySuccess");
			if (rc == 0) {
				if (bean.getStatus().equals("0")) {
					resData.put("ret_code", "0000");
					status = bean.getStatus();
					message = bean.getMessage();
				} else {
					resData.put("ret_code", "1111");
					logger.error("Bank_umpay.notify:addMoneySuccess 账户充值确认接口调用失败");
				}
			}
	    } else {
	        resData.put("ret_code", "1111");
	        status = Status.FAILURE.CODE;
			message = Status.FAILURE.DESC;
	    }
	    resData.put("ret_msg", "OK");
	    String data = com.umpay.api.paygate.v40.Mer2Plat_v40.merNotifyResData(resData);
	    JSONObject object = new JSONObject();
	    object.put("status", status);
	    object.put("message", message);
	    object.put("ordernumber", bean.getOrdernumber());
	    object.put("money", bean.getAddMoney());
	    object.put("dealid", reqData.get("trade_no"));
	    bean.setJson(object.toString());
//		String contents = "";
//		contents = "<META NAME=\"MobilePayPlatform\" CONTENT=\""+data+"\" />";
//		write_html_response(contents, response);
	}

	public static double getRound(double m, int num){
		BigDecimal dec = new BigDecimal(m);
		BigDecimal one = new BigDecimal("1");
		return dec.divide(one,num,BigDecimal.ROUND_CEILING).doubleValue();
	}
	
//	public static void main(String[] args) {
//		BankBean bean = new BankBean();
//		bean.setChannel("upmp");
//		bean.setMoney(10);
//		bean.setPayType("CREDITCARD");
//		bean.setPassword("f4aba555e44ab7b11390b5f354821165");
//		bean.setUser("test");
//		bean.setVersion(6);
//		try {
//			Bank_umpay.send(bean, null, null, null);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}
}