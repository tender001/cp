package com.caipiao.cpweb.bank;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

import com.caipiao.cpweb.trade.util.CheckUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
/*
 * 
 * 
 */

public class BankBeanStub {

	private Logger logger;

	public BankBeanStub() {
		logger = LoggerFactory.getLogger("user_info");
	}

	/**
	 * 账户充值申请接口
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void applyAccountDeposits(BankBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("u_idinfo", bean, null, jcn);
			if (jrs != null && jrs.size() > 0) {
				jrs.next();
				bean.setRealName(jrs.get("realname"));
				bean.setIdCard(jrs.get("idcard"));
				bean.setMobile(jrs.get("mobile"));
				bean.setEmail(jrs.get("mail"));
				Date regdate = jrs.getDate("regdate");
				SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
				bean.setRegdate(df.format(regdate) );
				jrs.clear();
				jrs = null;
			} 

			// 生成订单号
			String rid = UUID.randomUUID().toString();
			int ii = (bean.getUid() + DateUtil.getCurrentFormatDate("yyyyMMddHHmmss") + bean.getAddmoney() + rid).hashCode();
			String applyid = Integer.toHexString(ii).toUpperCase();
			applyid = DateUtil.getCurrentDateTime().substring(2, 4) + StringUtil.LeftPad(applyid, "F", 8);
			bean.setApplyid(applyid);
			bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMddHHmmss"));
			bean.setComeFrom("");
						
			// 参数检查
			bean.check(bean.getBankid());
			
			switch (bean.getBankid()) {
			case BankBean.BANK_KQ: {
				break;
			}
			case BankBean.BANK_CFT: {
				bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
				break;
			}
			case BankBean.BANK_ZFB: {
				break;
			}
			case BankBean.BANK_zfbkj: {
				break;
			}
			case BankBean.BANK_BFB: {
				break;
			}
			case BankBean.BANK_YB: {
				double handmoney = Math.round(bean.getAddmoney() * 0.04 * 100) / 100.0;
				double newaddmoney = bean.getAddmoney() - handmoney;				
				bean.setAddmoney(newaddmoney);
				bean.setHandmoney(handmoney);
				break;
			}
			case BankBean.BANK_DNA: {
				if(bean.getAddmoney()<=20){
					bean.setBusiErrCode(-100);
					bean.setBusiErrDesc("充值金额不能少于20元");
				}else if(bean.getAddmoney()>5000000){
					bean.setBusiErrCode(-100);
					bean.setBusiErrDesc("充值金额不能大于500万元");
				}else{
					if(bean.getAddmoney()>=100){
						bean.setHandmoney(0);
					}else{
						bean.setAddmoney(bean.getAddmoney()*1-1);
						bean.setHandmoney(1);
					}
				}
			    bean.setComeFrom("支付联系号码："+bean.getCardpass());
				break;
			}
			case BankBean.BANK_JT:{
				bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
				break;
			}
			case BankBean.BANK_ZS:{
				bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
				break;
			}
			case BankBean.BANK_19PAY: {
				bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
				double huilv = 0; //服务费率
				if (!CheckUtil.isNullString(bean.getCardnum()) && !CheckUtil.isNullString(bean.getDealid())) {
					String pc_id = bean.getDealid();
					if (pc_id.indexOf("CMJFK") != -1) {
						huilv = 0.04;
					} else if (pc_id.indexOf("LTJFK") != -1) {
						huilv = 0.04;
					} else if (pc_id.indexOf("DXJFK") != -1) {
						huilv = 0.04;
					} else {
						bean.setBusiErrCode(-100);
						bean.setBusiErrDesc("错误的充值卡类型" + pc_id);
					}
				} else {
					bean.setBusiErrCode(-100);
					bean.setBusiErrDesc("错误的充值卡类型");
				}
				double handmoney = Math.round(bean.getAddmoney() * huilv * 100) / 100.0;
				bean.setAddmoney(bean.getAddmoney()*1-handmoney);
				bean.setHandmoney(handmoney);
				break;
			}
			case BankBean.BANK_UMPAY:{
				bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
				//if(bean.getPayType().equalsIgnoreCase("CREDITCARD")){
					if(bean.getAddmoney()<10){
						bean.setBusiErrCode(-100);
						bean.setBusiErrDesc("充值金额不能少于10元");
					}else if(bean.getAddmoney()>5000){
						bean.setBusiErrCode(-100);
						bean.setBusiErrDesc("充值金额不能大于5000元");
					}else{
						//信用卡充值不扣除手续费
						double handmoney = Math.round(bean.getAddmoney() * 0.0065 * 100) / 100.0;
						bean.setAddmoney(bean.getAddmoney()*1-handmoney);
						bean.setHandmoney(handmoney);
					}
				//}
				break;
			}
			case BankBean.BANK_LLPAY:{
				//double handmoney = Math.round(bean.getAddmoney() * 0.0060 * 100) / 100.0;
				//if(handmoney < 0.10D) handmoney = 0.10D;//最少0.10
				//bean.setAddmoney(bean.getAddmoney()*1-handmoney);
				//bean.setHandmoney(handmoney);
				bean.setHandmoney(0);
				break;
			}
			default: {
				bean.setBusiErrCode(1003);
				bean.setBusiErrDesc("未知的检查类型"+bean.getBankid());
				break;
			}
			}
			
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("u_addmoney", bean, null, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(9001);
					bean.setBusiErrDesc("操作失败");
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("BankBeanStub::applyAccountDeposits", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 充值成功调用接口
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void applyAccountSuc(BankBean bean, ServiceContext context) {
		logger.info(bean.getApplyid());
		logger.info(bean.getAddmoney() + "");
		logger.info(bean.getBankid() + "");
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			// 业务逻辑处理
			// 参数检查
			int ret = JdbcSqlMapping.executeUpdate("u_addmoneysuc", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("操作失败");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("BankBeanStub::applyAccountSuc", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void takeMoney(BankBean bean, ServiceContext context) {	
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			// 业务逻辑处理
			bean.validate(3);
			int ret = JdbcSqlMapping.executeUpdate("u_drawmoney", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("提现失败");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("提现异常");
			logger.error("BankBeanStub::takeMoney", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	
	/**
	 * 易联手机支付接口需要的参数
	 * @author xhs
	 * @param pool
	 * @param tid
	 */
	public void Userdna(BankBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			if ( CheckUtil.isNullString(bean.getUid()) ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("用户名不能为空");
			}
			
			if (bean.getBusiErrCode() == 0) {
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("u_dnapay", bean, null, jcn);
				if (jrs != null && jrs.size() > 0 && jrs.first()) {
					
					String xml = jrs.toRawXmlString("row");
					
					bean.setBusiXml(xml);
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("获取成功");
				}
				jrs.clear();
				jrs = null ;
			}
			
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("UserInfoBeanStub::Userdna", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	public void queryUserInfo(BankBean bean, ServiceContext context) {
        JdbcConnect jcn = null;
        try {
            jcn = context.getJdbcPoolManager().getJdbcConnect();
            // 业务逻辑处理
            // 参数检查
            if (bean.getBusiErrCode() == 0) {
                JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("u_info", bean, null, jcn);
                if (jrs != null && jrs.size() > 0 && jrs.first()) {     
                    bean.setApplydate(jrs.get("cadddate"));
                    bean.setBusiErrCode(0);
                    bean.setBusiErrDesc("获取成功");
                }
            }
        } catch (Exception e) {
            bean.setBusiErrCode(9002);
            bean.setBusiErrDesc("查询用户信息操作异常");
            logger.error("BankBeanStub::queryUserInfo", e);
        } finally {
            if (jcn != null) {
                jcn.unlock();
            }
        }
    }
	
	public static void main(String[] args){
		double handmoney = Math.round(3 * 0.0065 * 100) / 100.0;
		System.out.println(handmoney);
	}
}