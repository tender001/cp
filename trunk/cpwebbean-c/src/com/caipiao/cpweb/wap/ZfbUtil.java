package com.caipiao.cpweb.wap;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.alipay.client.base.ResponseResult;
import com.alipay.client.security.MD5Signature;
import com.alipay.client.util.ParameterUtil;
import com.alipay.client.util.StringUtil;
import com.alipay.client.util.XMapUtil;
import com.alipay.client.vo.ErrorCode;
import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.bank.BankBean;
import com.mina.rbc.logger.Logger;

public class ZfbUtil {
	
	public static final String SEC_ID="MD5";
	
	/**
	 * 准备alipay.wap.auth.authAndExecute服务的参数
	 * 
	 * @param request
	 * @param requestToken
	 * @return
	 */
	public static Map<String, String> prepareAuthParamsMap(HttpServletRequest request, String requestToken, BankBean bean) {
		Map<String, String> requestParams = new HashMap<String, String>();
		String reqData = "<auth_and_execute_req><request_token>" + requestToken
				+ "</request_token></auth_and_execute_req>";
		requestParams.put("req_data", reqData);
		requestParams.putAll(prepareCommonParams(request));
		requestParams.put("service", "alipay.wap.auth.authAndExecute");
		return requestParams;
	}
	
	/**
	 * 准备alipay.wap.trade.create.direct服务的参数
	 * 
	 * @param request
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static Map<String, String> prepareTradeRequestParamsMap(HttpServletRequest request, BankBean bean, String notify, String callback) throws UnsupportedEncodingException {
		Map<String, String> requestParams = new HashMap<String, String>();
		String cashierCode=request.getParameter("cashierCode");
		String out_user=(String)request.getSession().getAttribute(BaseImpl.UID_KEY);
		if(StringUtil.isBlank(out_user)){
            out_user="";
        }
		request.setCharacterEncoding("utf-8");
		// 商品名称
		String subject = TradeConfig.SUBJECT;
		// 商品总价
        String totalFee = "" + bean.getAddmoney();
        // 外部交易号 这里取当前时间，商户可根据自己的情况修改此参数，但保证唯一性
        String outTradeNo = bean.getApplyid()+"";
		// 卖家帐号
		String sellerAccountName =PartnerConfig.SELLER;
		
		String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName() + ":"
                                   + request.getServerPort() + path + "/";
        System.out.println(basePath);
		// 接收支付宝发送的通知的url
		String notifyUrl = notify;
		
		//支付成功跳转链接
		String callbackUrl = callback;
		// 未完成支付，用户点击链接返回商户url
		String merchantUrl = basePath;
		// req_data的内容
		String reqData = "<direct_trade_create_req>" + "<subject>" + subject
				+ "</subject><out_trade_no>" + outTradeNo
				+ "</out_trade_no><total_fee>" + totalFee
				+ "</total_fee><seller_account_name>" + sellerAccountName
				+ "</seller_account_name><notify_url>" + notifyUrl+ "</notify_url>"
				+ "<call_back_url>"+ callbackUrl+ "</call_back_url>"
				+ "<out_user>" + out_user
				+ "</out_user><merchant_url>" + merchantUrl+ "</merchant_url>";
		        
				//如果cashierCode不为空就组装此参数
		        if (StringUtil.isNotBlank(cashierCode)) {
		            reqData = reqData + "<cashier_code>" + cashierCode
		            + "</cashier_code>";
		        }
		        reqData = reqData + "</direct_trade_create_req>";
		requestParams.put("req_data", reqData);
		requestParams.put("req_id", System.currentTimeMillis() + "");
		requestParams.putAll(prepareCommonParams(request));
		return requestParams;
	}
	

	/**
	 * 对参数进行签名
	 * 
	 * @param reqParams
	 * @return
	 */
	public static String sign(Map<String, String> reqParams,String signAlgo,String key) {

		String signData = ParameterUtil.getSignData(reqParams);
		
		String sign = "";
		try {
			sign = MD5Signature.sign(signData, key);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return sign;
	}
	
	/**
	 * 调用alipay.wap.auth.authAndExecute服务的时候需要跳转到支付宝的页面，组装跳转url
	 * 
	 * @param reqParams
	 * @return
	 * @throws Exception
	 */
	public static String getRedirectUrl(Map<String, String> reqParams,String reqUrl) throws Exception {
		String redirectUrl = reqUrl + "?";
		redirectUrl = redirectUrl + ParameterUtil.mapToUrl(reqParams);
		return redirectUrl;
	}
	
	/**
	 * 调用支付宝开放平台的服务
	 * 
	 * @param reqParams
	 *            请求参数
	 * @return
	 * @throws Exception
	 */
	public static ResponseResult send(Map<String, String> reqParams,String reqUrl,String secId) throws Exception {
		String response = "";
		String invokeUrl = reqUrl;
		URL serverUrl = new URL(invokeUrl);
		HttpURLConnection conn = (HttpURLConnection) serverUrl.openConnection();

		conn.setRequestMethod("POST");
		conn.setDoOutput(true);
		conn.connect();
		String params = ParameterUtil.mapToUrl(reqParams);
		conn.getOutputStream().write(params.getBytes());

		InputStream is = conn.getInputStream();

		BufferedReader in = new BufferedReader(new InputStreamReader(is));
		StringBuffer buffer = new StringBuffer();
		String line = "";
		while ((line = in.readLine()) != null) {
			buffer.append(line);
		}
		response = URLDecoder.decode(buffer.toString(), "utf-8");
		conn.disconnect();
		return praseResult(response,secId);
	}
	
	/**
	 * 解析支付宝返回的结果
	 * 
	 * @param response
	 * @return
	 * @throws Exception
	 */
	private static ResponseResult praseResult(String response,String secId) throws Exception {
		// 调用成功
		HashMap<String, String> resMap = new HashMap<String, String>();
		String v = ParameterUtil.getParameter(response, "v");
		String service = ParameterUtil.getParameter(response, "service");
		String partner = ParameterUtil.getParameter(response, "partner");
		String sign = ParameterUtil.getParameter(response, "sign");
		String reqId = ParameterUtil.getParameter(response, "req_id");
		resMap.put("v", v);
		resMap.put("service", service);
		resMap.put("partner", partner);
		resMap.put("sec_id", secId);
		resMap.put("req_id", reqId);
		String businessResult = "";
		ResponseResult result = new ResponseResult();
		if (response.contains("<err>")) {
			result.setSuccess(false);
			businessResult = ParameterUtil.getParameter(response, "res_error");
			// 转换错误信息
			XMapUtil.register(ErrorCode.class);
			ErrorCode errorCode = (ErrorCode) XMapUtil.load(new ByteArrayInputStream(businessResult.getBytes("UTF-8")));
			result.setErrorMessage(errorCode);
		} else {
		    businessResult = ParameterUtil.getParameter(response, "res_data");
            result.setSuccess(true);
            result.setBusinessResult(businessResult);
            resMap.put("res_data", businessResult);
            //获取待签名数据
    		String verifyData = ParameterUtil.getSignData(resMap);
    		//对待签名数据使用支付宝公钥验签名
    		boolean verified = MD5Signature.verify(verifyData,sign,PartnerConfig.KEY);
    		if (!verified) {
    			throw new Exception("验证签名失败");
    		}
		}
		
		return result;
	}

	/**
	 * 准备通用参数
	 * 
	 * @param request
	 * @return
	 */
	private static Map<String, String> prepareCommonParams(HttpServletRequest request) {
		Map<String, String> commonParams = new HashMap<String, String>();
		commonParams.put("service", "alipay.wap.trade.create.direct");
		commonParams.put("sec_id", SEC_ID);
		commonParams.put("partner", PartnerConfig.PARTNER);
		commonParams.put("format", "xml");
		commonParams.put("v", "2.0");
		return commonParams;
	}
	
    /**
     * 获得验签名的数据
     * @param map
     * @return
     * @throws Exception 
     */
    @SuppressWarnings("unchecked")
	public static String getVerifyData(Map<?,?> map) {
        String service = (String) ((Object[]) map.get("service"))[0];
        String v = (String) ((Object[]) map.get("v"))[0];
        String sec_id = (String) ((Object[]) map.get("sec_id"))[0];
        String notify_data = (String) ((Object[]) map.get("notify_data"))[0];
        System.out.println("通知参数为："+"service=" + service + "&v=" + v + "&sec_id=" + sec_id + "&notify_data="+ notify_data);
        return "service=" + service + "&v=" + v + "&sec_id=" + sec_id + "&notify_data="+ notify_data;
    }
}
