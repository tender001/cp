package com.caipiao.cpweb.wap;

import java.io.ByteArrayInputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alipay.client.base.ResponseResult;
import com.alipay.client.security.MD5Signature;
import com.alipay.client.util.ParameterUtil;
import com.alipay.client.util.StringUtil;
import com.alipay.client.util.XMapUtil;
import com.alipay.client.vo.DirectTradeCreateRes;
import com.caipiao.cpweb.bank.BankBean;
import com.caipiao.cpweb.bank.BankBeanImpl;
import com.caipiao.cpweb.util.GroupContain;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class Bank_wap_zfb extends BankBeanImpl{

	// 付完款后跳转的页面
	private static String return_url = "http://m.159cai.com/pwap/alipayreceive.phpx";
	// 付完款后服务器通知的页面
	private static String notify_url = "http://m.159cai.com/pwap/alipaynotify.phpx";
	// 页面编码
	public static String charset = "UTF-8";

	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("wap-zfb-send");
		response.setContentType( "text/html;charset=UTF-8");
		Map<String, String> reqParams = ZfbUtil.prepareTradeRequestParamsMap(request, bean, notify_url, return_url);
		//签名类型 
		String signAlgo = ZfbUtil.SEC_ID;
		String reqUrl = TradeConfig.REQ_URL;
		
		//获取商户MD5 key
		String key = PartnerConfig.KEY;
		String sign = ZfbUtil.sign(reqParams,signAlgo,key);
		reqParams.put("sign", sign);
		
		ResponseResult resResult = new ResponseResult();
		String businessResult = "";
		try {
			resResult = ZfbUtil.send(reqParams,reqUrl,signAlgo);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		if (resResult.isSuccess()) {
			businessResult = resResult.getBusinessResult();
		} else {
			PrintWriter out = response.getWriter();
			out.print("出错信息："+resResult.getErrorMessage().getDetail());
			out.flush();
			System.out.println("出错信息："+resResult.getErrorMessage().getDetail());
			return;
		}
		DirectTradeCreateRes directTradeCreateRes = null;
		XMapUtil.register(DirectTradeCreateRes.class);
		try {
			directTradeCreateRes = (DirectTradeCreateRes) XMapUtil.load(new ByteArrayInputStream(businessResult.getBytes("UTF-8")));
		} catch (UnsupportedEncodingException e) {
		} catch (Exception e) {
		}
		// 开放平台返回的内容中取出request_token
		String requestToken = directTradeCreateRes.getRequestToken();
		Map<String, String> authParams = ZfbUtil.prepareAuthParamsMap(request, requestToken, bean);
		//对调用授权请求数据签名
		String authSign = ZfbUtil.sign(authParams,signAlgo,key);
		authParams.put("sign", authSign);
		String redirectURL = "";
		try {
			redirectURL = ZfbUtil.getRedirectUrl(authParams,reqUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (StringUtil.isNotBlank(redirectURL)) {
			response.sendRedirect(redirectURL);
			return;
		}
	}
	
	public static void sendNew(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("wap-zfb-send");
		response.setContentType( "text/html;charset=UTF-8");
		
		String host = request.getServerName();
		String rurl = "";
		if(host == null || host.trim().equals("")){
			rurl = return_url;
		}else{
			rurl = "http://" + host + "/pwap/alipayreceivenew.phpx";
		}
		logger.debug(rurl);
		
		Map<String, String> reqParams = ZfbUtil.prepareTradeRequestParamsMap(request, bean, notify_url, rurl);
		//签名类型 
		String signAlgo = ZfbUtil.SEC_ID;
		String reqUrl = TradeConfig.REQ_URL;
		
		//获取商户MD5 key
		String key = PartnerConfig.KEY;
		String sign = ZfbUtil.sign(reqParams,signAlgo,key);
		reqParams.put("sign", sign);
		
		ResponseResult resResult = new ResponseResult();
		String businessResult = "";
		try {
			resResult = ZfbUtil.send(reqParams,reqUrl,signAlgo);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		if (resResult.isSuccess()) {
			businessResult = resResult.getBusinessResult();
		} else {
			PrintWriter out = response.getWriter();
			out.print("出错信息："+resResult.getErrorMessage().getDetail());
			out.flush();
			System.out.println("出错信息："+resResult.getErrorMessage().getDetail());
			return;
		}
		DirectTradeCreateRes directTradeCreateRes = null;
		XMapUtil.register(DirectTradeCreateRes.class);
		try {
			directTradeCreateRes = (DirectTradeCreateRes) XMapUtil.load(new ByteArrayInputStream(businessResult.getBytes("UTF-8")));
		} catch (UnsupportedEncodingException e) {
		} catch (Exception e) {
		}
		// 开放平台返回的内容中取出request_token
		String requestToken = directTradeCreateRes.getRequestToken();
		Map<String, String> authParams = ZfbUtil.prepareAuthParamsMap(request, requestToken, bean);
		//对调用授权请求数据签名
		String authSign = ZfbUtil.sign(authParams,signAlgo,key);
		authParams.put("sign", authSign);
		String redirectURL = "";
		try {
			redirectURL = ZfbUtil.getRedirectUrl(authParams,reqUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (StringUtil.isNotBlank(redirectURL)) {
			response.sendRedirect(redirectURL);
			return;
		}
	}

	public int receive(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("wap-zfb-receive");
        //获得通知签名
        String sign = request.getParameter("sign");
        String result = request.getParameter("result");
        String requestToken = request.getParameter("request_token");
        String outTradeNo = request.getParameter("out_trade_no");
        String tradeNo = request.getParameter("trade_no");
        Map<String,String> resMap  = new HashMap<String,String>();
        resMap.put("result", result);
        resMap.put("request_token", requestToken);
        resMap.put("out_trade_no", outTradeNo);
        resMap.put("trade_no", tradeNo);
        String verifyData = ParameterUtil.getSignData(resMap);
        boolean verified = false;

        //使用MD5验签名
        try {
            verified = MD5Signature.verify(verifyData, sign, PartnerConfig.KEY);
            logger.info("verified="+verified + "\tresult="+result);
//	        PrintWriter out = response.getWriter();
//	        response.setContentType("text/html");
	        if (!verified || !result.equals("success")) {
	        	bean.setBusiErrCode(-1);
	        	bean.setBusiErrDesc("验证签名失败");
	        	request.setAttribute("msg_msg", "<b>验证签名失败</b><br/>");
	        } else {
	        	bean.setBusiErrCode(0);
	        	bean.setBusiErrDesc("充值成功");
	        	request.setAttribute("msg_msg", "<b>充值成功!</b><br/>");
	        }
			request.setAttribute("orderid", outTradeNo);
			request.setAttribute("msg_url", "/user/account.html");
//	        out.flush();
//			out.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
		return 0;
	}

	public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("wap-zfb-notify");
    	System.out.println("接收到通知!");
        //获得通知参数
        Map<?,?> map = request.getParameterMap();
        //获得通知签名
        String sign = (String) ((Object[]) map.get("sign"))[0];
        System.out.println("sign:"+sign);
        //获得待验签名的数据
        String verifyData = ZfbUtil.getVerifyData(map);
        System.out.println("verifyData:"+verifyData);
        boolean verified = false;
        //验签名
        try {
            verified = MD5Signature.verify(verifyData, sign, PartnerConfig.KEY);
        } catch (Exception e) {
            e.printStackTrace();
        }
        PrintWriter out = response.getWriter();
        //验证签名通过
        if (verified) {
        	String notify_data = (String) ((Object[]) map.get("notify_data"))[0];
        	JXmlWapper xml = JXmlWapper.parse(notify_data);
        	
        	bean.setApplyid(xml.getStringValue("out_trade_no"));
        	bean.setAddmoney(xml.getDoubleValue("price"));
        	bean.setBankid(BankBean.BANK_ZFB);
        	
        	//根据交易状态处理业务逻辑
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
			if (rc == 0) {
				if(bean.getBusiErrCode() == 0){
		        	//当交易状态成功，处理业务逻辑成功。回写success
					logger.error("接收支付宝系统通知成功");
		        	out.print("success");
		        	return 0;
				}else{
					logger.error(bean.getBusiErrDesc());
					out.print("fail");
			        return 0;
				}
			}else{
		        logger.error("接口调用失败！");
		        out.print("fail");
		        return 0;
			}
        }else{
	        logger.error("接收支付宝系统通知验证签名失败，请检查！");
	        out.print("fail");
        }
		return 0;
	}
}
