package com.caipiao.mob.bank;

import java.util.UUID;

import org.json.JSONObject;

import com.caipiao.mob.BeanStub;
import com.caipiao.mob.Status;
import com.caipiao.mob.util.BeanLogUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;

public class BankBeanStub extends BeanStub {
	
	private Logger logger = LoggerFactory.getLogger("bank");

	public void addMoney(BankBean bean, ServiceContext context) {
		
		//bean.setErrJson("_9999", "充值出现问题，请重新下载安装客户端充值，给你带来的不变我们深表歉意！");
		//return;
		
		if(check(bean)){
			if(bean.getMoney() < 10){
				bean.setErrJson(Status.ADD_MONEY_IS_NOT_VALID.CODE, Status.ADD_MONEY_IS_NOT_VALID.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getChannel())){
				bean.setErrJson(Status.CHANNEL_IS_EMPTY.CODE, Status.CHANNEL_IS_EMPTY.DESC);
				return;
			}
			if(!("zfb".equalsIgnoreCase(bean.getChannel()))&&!("upmp".equalsIgnoreCase(bean.getChannel())) &&!("19pay".equalsIgnoreCase(bean.getChannel()))&&!("llpay".equalsIgnoreCase(bean.getChannel()))){
				logger.error("bean.getChannel():"+bean.getChannel());
				bean.setErrJson(Status.CHANNEL_IS_NOT_VALID.CODE, Status.CHANNEL_IS_NOT_VALID.DESC);
				return;
			}
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					// 生成订单号
					String rid = UUID.randomUUID().toString();
					int ii = (bean.getUser() + DateUtil.getCurrentFormatDate("yyyyMMddHHmmss") + bean.getMoney() + rid).hashCode();
					String applyid = Integer.toHexString(ii).toUpperCase();
					applyid = DateUtil.getCurrentDateTime().substring(2, 4) + StringUtil.LeftPad(applyid, "F", 8);
					bean.setOrdernumber(applyid);
					bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMddHHmmss"));
					JSONObject obj = new JSONObject();
					//TODO手续费问题  bean.setMoneyRate(0);
					if("zfb".equalsIgnoreCase(bean.getChannel())){
						
					}else if("upmp".equalsIgnoreCase(bean.getChannel())){
						bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
						double handmoney = Math.round(bean.getMoney() * 0.0065 * 100) / 100.0;
						bean.setMoney(bean.getMoney()*1-handmoney);
						bean.setMoneyRate(handmoney);
					}else if("19pay".equalsIgnoreCase(bean.getChannel())){
						bean.setApplydate(DateUtil.getCurrentFormatDate("yyyyMMdd"));
						double huilv = 0; //服务费率
						if (!StringUtil.isEmpty(bean.getCardnum()) && !StringUtil.isEmpty(bean.getDealid())) {
							String pc_id = bean.getDealid();
							if (pc_id.indexOf("CMJFK") != -1) {
								huilv = 0.04;
							} else if (pc_id.indexOf("LTJFK") != -1) {
								huilv = 0.04;
							} else if (pc_id.indexOf("DXJFK") != -1) {
								huilv = 0.04;
							} else {
								bean.setErrJson("-100", "错误的充值卡类型" + pc_id);
								return;
							}
						} else {
							bean.setErrJson("-100", "错误的充值卡类型");
							return;
						}
						double moneyRate = Math.round(bean.getMoney() * huilv * 100) / 100.0;
						bean.setMoney(bean.getMoney()*1-moneyRate);
						bean.setMoneyRate(moneyRate);
					}else if("llpay".equalsIgnoreCase(bean.getChannel())){
						double handmoney = Math.round(bean.getMoney() * 0.0060 * 100) / 100.0;
						if(handmoney < 0.10D) handmoney = 0.10D;//最少0.10
						bean.setMoney(bean.getMoney()*1-handmoney);
						bean.setMoneyRate(handmoney);
						
					}
					String status = "";
					String message = "";
					int ret = JdbcSqlMapping.executeUpdate("mob_addmoney", bean, null, jcn);
					if (ret == 0) {
						status = bean.getStatus();
						message = bean.getMessage();
						//TODO 需要获取第三方订单号，用message接收订单号
						if("zfb".equalsIgnoreCase(bean.getChannel())){
							//message = ....
						} else if("ylpay".equalsIgnoreCase(bean.getChannel())){
							//message = ....
						} else if("upmp".equalsIgnoreCase(bean.getChannel())){
							//message = ....
						}else if("19pay".equalsIgnoreCase(bean.getChannel())){
							//message = ....
						}
					} else {
						status = Status.LOGIN_IS_FAILURE.CODE;
						message = Status.LOGIN_IS_FAILURE.DESC + bean.getMessage();
					}
					obj.put("status", status);
					obj.put("message", message);
					obj.put("ordernumber", applyid);
					obj.put("money", bean.getMoney()+bean.getMoneyRate());
					logger.info("=========================="+obj.toString());
					//{"status":"_0000","message":"cpdyj01@163.com","ordernumber":"1360F687B9","money":10}
					bean.setJson(obj.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("BankBeanStub::addMoney ", e);
				BeanLogUtil.logger("用户充值异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
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
	public void addMoneySuccess(BankBean bean, ServiceContext context) {
		logger.info(bean.getOrdernumber());
		logger.info(bean.getAddMoney() + "");
		logger.info(bean.getBankID() + "");
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			// 业务逻辑处理
			// 参数检查
			int ret = JdbcSqlMapping.executeUpdate("u_addmoneysuc", bean, null, jcn);
			logger.info("ret---------"+ret);
			logger.info("status---------"+bean.getStatus());
			logger.info("ret---------"+bean.getMessage());
			if (ret != 0) {
				bean.setStatus("9001");
				bean.setMessage("操作失败");
			}
		} catch (Exception e) {
			bean.setStatus("9002");
			bean.setMessage("操作异常");
			logger.error("BankBeanStub::addMoneySuccess", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
}
