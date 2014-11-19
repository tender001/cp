package com.caipiao.cpweb.bank;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.caipiao.cpweb.bank.llpay.HttpRequestSimple;
import com.caipiao.cpweb.bank.llpay.LLPayUtil;
import com.caipiao.cpweb.bank.llpay.PayDataBean;
import com.caipiao.cpweb.bank.llpay.PaymentInfo;
import com.caipiao.cpweb.bank.llpay.RetBean;
import com.caipiao.cpweb.util.GroupContain;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

/**
 * 连连支付
 * 
 * @author Siva
 *
 */

public class Bank_ll extends BankBeanImpl{
	
	private static String PAY_URL = "https://yintong.com.cn/payment/bankgateway.htm"; // 连连支付WEB收银台支付服务地址
	
	private static String QUERY_BANKCARD_URL = "https://yintong.com.cn/traderapi/bankcardquery.htm"; //银行卡卡bin信息查询
	
	private static final String VERSION = "1.0";
	// 商户编号
	private static final String OID_PARTNER = "201406301000001378";
	
	// 签名方式 RSA或MD5
    private static final String SIGN_TYPE = "MD5";
    
    // 业务类型，连连支付根据商户业务为商户开设的业务类型； （101001：虚拟商品销售、109001：实物商品销售、108001：外部账户充值）
    private static final String BUSI_PARTNER   = "101001";
    
    // MD5 KEY
    private static final String MD5_KEY = "www.siva.com";
    
    // 银通公钥
    private static final String YT_PUB_KEY = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCSS/DiwdCf/aZsxxcacDnooGph3d2JOj5GXWi+q3gznZauZjkNP8SKl3J2liP0O6rU/Y/29+IUe+GTMhMOFJuZm1htAtKiu5ekW0GlBMWxf4FPkYlQkPE0FtaoMP3gYfh+OwI+fIRrpW3ySn3mScnc6Z700nU/VYrRkfcSCbSnRwIDAQAB";
    // 商户私钥
    private static final String TRADER_PRI_KEY = "";
	
	private static String notify_url = RETURN_HOST + "/phpu/llnotify.phpx";

	private static String return_url = RETURN_HOST + "/phpu/llreceive.phpx";
	
	public static void send(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		logger.debug("lianlian-send");
		
		// 构造支付请求对象
        PaymentInfo paymentInfo = new PaymentInfo();
        paymentInfo.setVersion(VERSION);
        paymentInfo.setOid_partner(OID_PARTNER);
        paymentInfo.setUser_id(bean.getUid());
        paymentInfo.setSign_type(SIGN_TYPE);
        paymentInfo.setBusi_partner(BUSI_PARTNER);
        paymentInfo.setNo_order(bean.getApplyid());
        paymentInfo.setDt_order(bean.getApplydate());
        paymentInfo.setName_goods("159彩票充值");
        paymentInfo.setInfo_order("159彩票充值");
        paymentInfo.setMoney_order(String.valueOf(bean.getAddmoney() + bean.getHandmoney()));
        paymentInfo.setNotify_url(notify_url);
        paymentInfo.setUrl_return(return_url);
        paymentInfo.setUserreq_ip(bean.getIpAddr());
        paymentInfo.setUrl_order("");
        paymentInfo.setValid_order("1440");// 单位分钟，可以为空，默认1天
        paymentInfo.setRisk_item(createRiskItem(bean.getUid(),bean.getRealName(),bean.getIdCard(),bean.getRegdate()));
        paymentInfo.setTimestamp(getCurrentDateTimeStr());
        //if (!LLPayUtil.isnull(req.getParameter("no_agree")))
        //{
        //    paymentInfo.setNo_agree(req.getParameter("no_agree"));
        //    paymentInfo.setBack_url("http://www.lianlianpay.com/");
        //} else
        //{
            // 从系统中获取用户身份信息
            paymentInfo.setId_type("0");
            paymentInfo.setId_no(bean.getIdCard());
            paymentInfo.setAcct_name(bean.getRealName());
            paymentInfo.setFlag_modify("1");
            paymentInfo.setCard_no(bean.getCardnum());
            paymentInfo.setBack_url("http://www.15988.com/");
        //}
        // 加签名
        String sign = LLPayUtil.addSign(JSON.parseObject(JSON
                .toJSONString(paymentInfo)), TRADER_PRI_KEY,
                MD5_KEY);
        paymentInfo.setSign(sign);
        
        String contents = "<meta http-equiv=\"content-type\" content=\"text/html charsest=UTF-8\"/> \r\n";
		contents += "<form name=\"payForm1\" method=\"post\" action=\""+PAY_URL+"\">\r\n";
		contents += "<input type=\"hidden\" name=\"version\" value=\"" + paymentInfo.getVersion() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"oid_partner\" value=\"" + paymentInfo.getOid_partner() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"user_id\" value=\"" + paymentInfo.getUser_id() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"sign_type\" value=\"" + paymentInfo.getSign_type() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"sign\" value=\"" + paymentInfo.getSign() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"busi_partner\" value=\"" + paymentInfo.getBusi_partner() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"no_order\" value=\"" + paymentInfo.getNo_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"dt_order\" value=\"" + paymentInfo.getDt_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"name_goods\" value=\"" + paymentInfo.getName_goods() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"info_order\" value=\"" + paymentInfo.getInfo_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"money_order\" value=\"" + paymentInfo.getMoney_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"notify_url\" value=\"" + paymentInfo.getNotify_url() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"url_return\" value=\"" + paymentInfo.getUrl_return() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"userreq_ip\" value=\"" + paymentInfo.getUserreq_ip() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"url_order\" value=\"" + paymentInfo.getUrl_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"valid_order\" value=\"" + paymentInfo.getValid_order() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"timestamp\" value=\"" + paymentInfo.getTimestamp() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"risk_item\" value='" + paymentInfo.getRisk_item() + "'/>\r\n";
		contents += "<input type=\"hidden\" name=\"no_agree\" value=\"" + paymentInfo.getNo_agree() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"id_type\" value=\"" + paymentInfo.getId_type() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"id_no\" value=\"" + paymentInfo.getId_no() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"acct_name\" value=\"" + paymentInfo.getAcct_name() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"flag_modify\" value=\"" + paymentInfo.getFlag_modify() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"card_no\" value=\"" + paymentInfo.getCard_no() + "\"/>\r\n";
		contents += "<input type=\"hidden\" name=\"back_url\" value=\"" + paymentInfo.getBack_url() + "\"/>\r\n";

		contents += "<input type=\"submit\" name=\"转发中>>\"	value=\"转发中>>\">\r\n";
		contents += "</form>\r\n";
		contents += "<script language=\"javascript\">document.payForm1.submit();</script>";
        
		bean.setContents(contents);
		//write_html_response(contents, response);
	}
	
	private static String getCurrentDateTimeStr()
    {
        SimpleDateFormat dataFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Date date = new Date();
        String timeString = dataFormat.format(date);
        return timeString;
    }
	
	/**
     * 根据连连支付风控部门要求的参数进行构造风控参数
     * @return
	 * @throws JSONException 
     */
    private static String createRiskItem(String uid,String realname,String idcard,String regdate)
    {
        JSONObject riskItemObj = new JSONObject();
        riskItemObj.put("user_info_mercht_userno", uid);
        riskItemObj.put("user_info_full_name", realname);
        riskItemObj.put("frms_ware_category", "1007");
        //riskItemObj.put("user_info_dt_register", "");
        riskItemObj.put("user_info_id_no", idcard);
        riskItemObj.put("user_info_dt_register", regdate);
        
        return riskItemObj.toString();
    }
    
    /**
     * 银行卡卡bin信息查询
     * @param req
     * @return
     */
    public static String queryCardBin(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response)
    {

        JSONObject reqObj = new JSONObject();
        reqObj.put("oid_partner", OID_PARTNER);
        reqObj.put("card_no", bean.getCardnum());
        reqObj.put("sign_type", SIGN_TYPE);
        String sign = LLPayUtil.addSign(reqObj, TRADER_PRI_KEY,
                MD5_KEY);
        reqObj.put("sign", sign);
        String reqJSON = reqObj.toString();
        System.out.println("银行卡卡bin信息查询请求报文[" + reqJSON + "]");
        String resJSON = HttpRequestSimple.getInstance().postSendHttp(
                QUERY_BANKCARD_URL, reqJSON);
        System.out.println("银行卡卡bin信息查询响应报文[" + resJSON + "]");
        return resJSON;
    }
    
    public int receive(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("llpay-receive");

		response.setHeader("Cache-Control", "no-cache");
		
		String oid_partner = (String) request.getParameter("oid_partner").trim();
		String sign_type = (String) request.getParameter("sign_type").trim();
		String sign = (String) request.getParameter("sign").trim();
		
		String dt_order = (String) request.getParameter("dt_order").trim();
		String no_order = (String) request.getParameter("no_order").trim();
		String oid_paybill = (String) request.getParameter("oid_paybill").trim();
		String money_order = (String) request.getParameter("money_order").trim();
		String result_pay = (String) request.getParameter("result_pay").trim();
		String pay_type = (String) request.getParameter("pay_type").trim();
		
		int rtnOk = 0;
		String sMsg = "";
	    if ("SUCCESS".equals(result_pay)) {
			sMsg = "支付成功";
			rtnOk = 1;
	    } else {
			sMsg = "支付失败";
	    }
		double d_total_fee = Double.parseDouble(money_order);
		//String Amount = (d_total_fee / 100) + "";
		//d_total_fee = Double.parseDouble(Amount);
		request.setAttribute("rtnOk", rtnOk);
		request.setAttribute("orderid", no_order);
		request.setAttribute("orderamount", d_total_fee);
		request.setAttribute("msg", sMsg);
		return 0;
	}
    
    public int notify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		logger.debug("llpay-notify");
		
		response.setHeader("Cache-Control", "no-cache");
		response.setCharacterEncoding("UTF-8");
        logger.info("进入支付异步通知数据接收处理");
        RetBean retBean = new RetBean();
        String reqStr = LLPayUtil.readReqStr(request);
        if (LLPayUtil.isnull(reqStr))
        {
            retBean.setRet_code("9999");
            retBean.setRet_msg("交易失败");
            write_html_response(JSON.toJSONString(retBean), response);
            return 0;
        }
        logger.info("接收支付异步通知数据：【" + reqStr + "】");
        try
        {
            if (!LLPayUtil.checkSign(reqStr, YT_PUB_KEY,
                    MD5_KEY))
            {
                retBean.setRet_code("9999");
                retBean.setRet_msg("交易失败");
                logger.info("支付异步通知验签失败");
                write_html_response(JSON.toJSONString(retBean), response);
                return 0;
            }
        } catch (Exception e)
        {
        	logger.info("异步通知报文解析异常：" + e);
            retBean.setRet_code("9999");
            retBean.setRet_msg("交易失败");
            write_html_response(JSON.toJSONString(retBean), response);
            return 0;
        }
        
        retBean.setRet_code("9999");
        retBean.setRet_msg("交易成功，但回调失败");
        System.out.println("支付异步通知数据接收处理成功，开始处理回调");
        // 解析异步通知对象
        PayDataBean payDataBean = JSON.parseObject(reqStr, PayDataBean.class);
        // TODO:更新订单，处理加款

		double d_total_fee = Double.parseDouble(payDataBean.getMoney_order());

		bean.setApplyid(payDataBean.getNo_order());
		bean.setBankid(BankBean.BANK_LLPAY);
		bean.setAddmoney(d_total_fee);
		bean.setDealid(payDataBean.getOid_paybill());
		
		int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "applyAccountSuc");
		if (rc == 0) {
			if (bean.getBusiErrCode() == 0) {
				retBean.setRet_code("0000");
                retBean.setRet_msg("交易成功");
			} else {
				retBean.setRet_code("9999");
                retBean.setRet_msg("交易成功，但回调失败");
				logger.error("applyAccountSuc 账户充值确认接口调用失败");
			}
		}else{
			retBean.setRet_code("9999");
            retBean.setRet_msg("交易成功，但回调失败");
			logger.error("applyAccountSuc 账户充值确认接口调用失败");
		}
		
		write_html_response(JSON.toJSONString(retBean), response);
		return 0;
	}
	

}
