package com.caipiao.cpweb.bank;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.wap.Bank_wap_zfb;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.rbc.frame.RbcFrameContext;

/**
 * @author Administrator
 * 
 */
public class BankBeanImpl extends BaseImpl {

	public static Logger logger = LoggerFactory.getLogger("bank_info");
	
	public static String RETURN_HOST = "http://www.159cai.com";// 通知返回的HOST
	public static String KEY_SAVE_PATH = "";// 密钥存储的根路径
	public static String productName ="159彩票网充值";
	
	public int check_login(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}
	
	public int set_base_data(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_base_data(bean, context, request, response);
	}
	
	public int wapAddMoney(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (bean.getBusiErrCode() == 0) {
			switch (bean.getBankid()) {
			case BankBean.BANK_ZFB: {
				Bank_wap_zfb.send(bean, context, request, response);
				break;
			}
			default: {
				bean.setBusiErrCode(1001);
				bean.setBusiErrDesc("未支持充值渠道:[" + bean.getBankid() + "]");
				break;
			}
			}
			response.setHeader("Cache-Control", "no-cache");
			if (!StringUtil.isEmpty(bean.getRedirect())) {
				response.sendRedirect(bean.getRedirect());
			} else 
				if (!StringUtil.isEmpty(bean.getContents())) {
				write_html_response("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" >" + bean.getContents(), response);
			}
		}
		logger.info("wap===" + bean.getRedirect());
		logger.info("wap===" + bean.getContents());
		return 1;
	}

	/**
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int addmoney(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
//		if (bean.validate(BankBean.BANKBEAN_APPLYACCOUNTDEPOSITS)) {
			if (bean.getBusiErrCode() == 0) {
				switch (bean.getBankid()) {
				case BankBean.BANK_KQ: {
					Bank_kq.send(bean, context, request, response);
					break;
				}
//				case BankBean.BANK_CFT: {
//					Bank_cft.send(bean, context, request, response);
//					break;
//				}	
				case BankBean.BANK_ZFB: {
					Bank_zfb.send(bean, context, request, response);
					break;
				}					
//				case BankBean.BANK_BFB: {
//					Bank_bfb.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_YB: {
////					Bank_yb.send(bean, context, request, response);
////					break;
//					Bank_19pay.sendpay(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_DNA: {
//					Bank_dnapay.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_JT:{
//					Bank_jt.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_ZS:{
//					Bank_zs.send(bean, context, request, response);
//					break;
//				}
				case BankBean.BANK_19PAY:{
					Bank_19pay.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_zfbkj: {
					Bank_zfb.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_UMPAY: {
					Bank_umpay.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_LLPAY: {
					Bank_ll.send(bean, context, request, response);
					break;
				}
				default: {
					bean.setBusiErrCode(1001);
					bean.setBusiErrDesc("未知的检查类型");
					break;
				}
				}
			}
			if (bean.getBusiErrCode() == 0) {
				response.setHeader("Cache-Control", "no-cache");
				if (!StringUtil.isEmpty(bean.getRedirect())) {
					response.sendRedirect(bean.getRedirect());
				} else 
					if (!StringUtil.isEmpty(bean.getContents())) {
					write_html_response("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" >" + bean.getContents(), response);
				}
			}
			logger.info(bean.getRedirect());
			logger.info(bean.getContents());
//		}
		return 1;
	}
	
	public int addmoney2(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
//		if (bean.validate(BankBean.BANKBEAN_APPLYACCOUNTDEPOSITS)) {
			if (bean.getBusiErrCode() == 0) {
				switch (bean.getBankid()) {
				case BankBean.BANK_KQ: {
					Bank_kq.send(bean, context, request, response);
					break;
				}
//				case BankBean.BANK_CFT: {
//					Bank_cft.send(bean, context, request, response);
//					break;
//				}	
				case BankBean.BANK_ZFB: {
					Bank_zfb.check(bean, context, request, response);
					//Bank_zfb.send(bean, context, request, response);
					break;
				}					
//				case BankBean.BANK_BFB: {
//					Bank_bfb.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_YB: {
////					Bank_yb.send(bean, context, request, response);
////					break;
//					Bank_19pay.sendpay(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_DNA: {
//					Bank_dnapay.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_JT:{
//					Bank_jt.send(bean, context, request, response);
//					break;
//				}
//				case BankBean.BANK_ZS:{
//					Bank_zs.send(bean, context, request, response);
//					break;
//				}
				case BankBean.BANK_19PAY:{
					Bank_19pay.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_zfbkj: {
					Bank_zfb.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_UMPAY: {
					Bank_umpay.send(bean, context, request, response);
					break;
				}
				case BankBean.BANK_LLPAY: {
					Bank_ll.send(bean, context, request, response);
					break;
				}
				default: {
					bean.setBusiErrCode(1001);
					bean.setBusiErrDesc("未知的检查类型");
					break;
				}
				}
			}
			if (bean.getBusiErrCode() == 0) {
				response.setHeader("Cache-Control", "no-cache");
				if (!StringUtil.isEmpty(bean.getRedirect())) {
					response.sendRedirect(bean.getRedirect());
				} else 
					if (!StringUtil.isEmpty(bean.getContents())) {
					write_html_response("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" >" + bean.getContents(), response);
				}
			}
			logger.info(bean.getRedirect());
			logger.info(bean.getContents());
//		}
		return 1;
	}
	
	public int queryCard(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception{
		String res = Bank_ll.queryCardBin(bean, context, request, response);
		bean.setBusiErrCode(0);
		if (bean.getBusiErrCode() == 0) {
			response.setHeader("Cache-Control", "no-cache");
			if (!StringUtil.isEmpty(res)) {
				write_html_response(res, response);
			}
		}
		return 1;
	}
}