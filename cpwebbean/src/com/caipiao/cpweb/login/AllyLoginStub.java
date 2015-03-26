package com.caipiao.cpweb.login;

import com.caipiao.cpweb.ErrCode;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.user.UserBean;
import com.caipiao.cpweb.user.UserBeanStub;
import com.caipiao.cpweb.util.UserCheckUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;

public class AllyLoginStub {
	
	private Logger logger;

	public AllyLoginStub() {
		logger = LoggerFactory.getLogger("user_ally");
	}
	
	/**
	 * 便捷登录(绑定用户)
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void bind(AllyLogin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			if(CheckUtil.isNullString(bean.getUid())){
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("请输入159彩票网用户名");
				return;
			}
			if(CheckUtil.isNullString(bean.getPwd())){
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("请输入159彩票网密码");
				return;
			}
			if (bean.getType() == AllyLogin.ALIPAY && !UserCheckUtil.CheckUserName(bean.getUid()) ) {
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("用户名格式不正确");
			}
			if ( !CheckUtil.isNullString(bean.getMailAddr()) &&  !UserCheckUtil.isEmail(bean.getMailAddr())) {
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("电子邮件格式不正确");
			}
			if ( !CheckUtil.isNullString(bean.getMobileNo()) &&  !UserCheckUtil.isMobilephone(bean.getMobileNo())) {
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("手机号码格式不正确");
			}
			
			if(bean.getMailAddr()==null){
				bean.setMailAddr("");
			}
			if(bean.getMobileNo()==null){
				bean.setMobileNo("");
			}
			if(bean.getUseq() == null){
				bean.setUseq("");
			}
			String pwd = MD5Util.compute(bean.getPwd() + UserBeanStub.MD5_KEY);
			bean.setPwd(pwd);
			
			if(bean.getType() == AllyLogin.ALIPAY || bean.getType() == AllyLogin.QQ){
				int rs = JdbcSqlMapping.executeUpdate("u_allyregister", bean, null, jcn);
				if(rs == 0){
					if ( bean.getBusiErrCode() == 0) {
//						if(bean.getType() == AllyLogin.ALIPAY){//设置给impl使用。支付宝绑定账户通标识
//							bean.setSource(0);
//						}else{
//							bean.setSource(10);
//						}
						UserBeanStub.addUserOperLog(bean, "用户登录", "[成功]", jcn);
//						if(bean.getType() == AllyLogin.ALIPAY){ //支付宝联合登录，写入用户身份证等相关信息
//							addAlipayInfo(bean,jcn);
//						}
					} else {
						UserBeanStub.addUserOperLog(bean, "用户登录", "[失败] " + bean.getBusiErrDesc(), jcn);
					}
				} else {
					bean.setBusiErrCode(9999);
					bean.setBusiErrDesc("系统繁忙，稍后重试或者联系网站客服！");
//					UserBeanStub.addUserOperLog(bean, "用户登录", "[失败] " + bean.getBusiErrDesc(), jcn);
				}
			}else{
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("未支持的登录方式");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9999);
			bean.setBusiErrDesc(e.getMessage());
			logger.error("AllyLoginStub::allylogin", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 联合登录
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void login(AllyLogin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			//String pwd = MD5Util.compute(bean.getPwd() + UserBeanStub.MD5_KEY);
			//bean.setPwd(pwd);
			String fid = "u_allylogin";
			if(bean.getType()==AllyLogin.ZH){
				fid = "u_login";
			}
			int rs = JdbcSqlMapping.executeUpdate(fid, bean, null, jcn);
			if(rs != 0){
				if(bean.getBusiErrCode() != 0){
					//bean.setBusiErrCode(-1);
					//bean.setBusiErrDesc("登陆失败");
				} else {
					if(bean.getType() == 1){//支付宝快捷登陆
						int num = jcn.getRecordNums("select count(1) from tb_alipay_account_bind where alipayid=? and cnickid=? and istate=1", new Object[]{bean.getMerchantacctid(), bean.getUid()});
						bean.setSource(num);
					}
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9999);
			bean.setBusiErrDesc(e.getMessage());

			logger.error("AllyLoginStub::allylogin", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	public void addAlipayInfo(AllyLogin bean, JdbcConnect jcn){
		UserBean ub = new UserBean();
		ub.setUid(bean.getUid());
		ub.setUpwd(bean.getPwd());
		ub.setIdCardNo(bean.getCertNo());
		ub.setRealName(bean.getRealName());
		ub.setMailAddr(bean.getMailAddr());
		ub.setNewValue(bean.getMemo());
		ub.setUpwd(bean.getPwd());
		String ckey = "u_update_";
		String key = "";
		try {
			if (UserCheckUtil.verifyIDCard(ub.getIdCardNo()) && !StringUtil.isEmpty(ub.getRealName())) {
				key = ckey + "7";	
				int ret = JdbcSqlMapping.executeUpdate(key, ub, null, jcn);
				if (ret == 1) {
					UserBeanStub.addUserOperLog(bean, "支付宝联合登录", "绑定用户真实信息成功：身份证=" + ub.getIdCardNo() + " 真实姓名=" + ub.getRealName(), jcn);
					logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录绑定用户真实信息[成功]: 身份证 =" + ub.getIdCardNo() + " 真实姓名=" + ub.getRealName());
				}else {
					logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录绑定用户真实信息[失败]: 身份证 =" + ub.getIdCardNo() + " 真实姓名=" + ub.getRealName());
				}
			}
			if (!StringUtil.isEmpty(ub.getNewValue()) && !"null".equals(ub.getNewValue())) {
				key = ckey + "13";	
				logger.info(key + " " + ub.getNewValue() + " " + ub.getUid() + " " + ub.getUpwd());
				int ret1 = JdbcSqlMapping.executeUpdate(key, ub, null, jcn);
				if (ret1 == 1) {
					UserBeanStub.addUserOperLog(bean, "支付宝联合登录", "绑定支付宝账号成功：账号=" + ub.getNewValue(), jcn);
					logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录绑定支付宝账号[成功]：账号=" + ub.getNewValue());
				}else {
					logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录绑定支付宝账号[失败]：账号=" + ub.getNewValue());
				}
			}	

			key = ckey + "14";	
			bean.setIshuodong(0);
			if (bean.getAllyType()==1) {
				bean.setIshuodong(1);
//				if (!StringUtil.isEmpty(bean.getReferer()) && bean.getReferer().indexOf("vip.alipay.com") == -1) {
//					bean.setIshuodong(0);
//				}else{
//					bean.setIshuodong(1);
//				}
			}
			bean.setReturnInfo(bean.getReferer());
			
			int ret2 = JdbcSqlMapping.executeUpdate(key, bean, null, jcn);
			if (ret2 == 1) {
				UserBeanStub.addUserOperLog(bean, "支付宝联合登录", "设置支付宝账号等级成功：等级=" + bean.getAllyType(), jcn);
				logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录设置支付宝账号等级[成功]：等级=" + bean.getAllyType());
			}else {
				logger.error("AllyLoginStub::addAlipayInfo 支付宝联合登录设置支付宝账号等级[失败]：等级=" + bean.getAllyType());
			}

		}catch (Exception e) {
			logger.error("AllyLoginStub::addAlipayInfo", e);
		}	
	}
	
	
	public void registerUser(AllyLogin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			logger.info("用户注册  uid=" + bean.getUid() + " aid=" + bean.getComeFrom());
			
			int ret = JdbcSqlMapping.executeUpdate("u_register", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(ErrCode.ERR_CALL_SP);
				bean.setBusiErrDesc(ErrCode.getErrDesc(bean.getBusiErrCode()));
			}else{
				String sql = "";
				ret = 0;
				//绑定手机、邮箱
				if(!StringUtil.isEmpty(bean.getMobileNo())){
					try{
						sql = " update tb_user set imobbind=1,cmobileno=? where cnickid = ?";
						jcn.executeUpdate(sql, new Object[] { bean.getMobileNo(), bean.getUid() });
//						System.out.println("==========="+ret); ret =1
					}catch(Exception e){
						logger.error(String.format("用户%s，绑定手机%s失败", bean.getUid(),bean.getMobileNo()),e);
					}
				}
				
				if(!StringUtil.isEmpty(bean.getMailAddr())){
					try{
						sql = " update tb_user set cemailaddr = ?,imailbind=1 where cnickid = ?";
						jcn.executeUpdate(sql, new Object[] { bean.getMailAddr(), bean.getUid() });
					}catch(Exception e){
						logger.error(String.format("用户%s，绑定邮箱%s失败", bean.getUid(),bean.getMailAddr()),e);
					}
				}
				//实名制
				if(!StringUtil.isEmpty(bean.getRealName())&&!StringUtil.isEmpty(bean.getCertNo())){
					try{
						sql = " update tb_user set crealname = ? ,cidcard = ? where cnickid = ? and crealname is null and cidcard is null";
						jcn.executeUpdate(sql, new Object[] { bean.getRealName(), bean.getCertNo(),bean.getUid() });
					}catch(Exception e){
						logger.error(String.format("用户%s，实名%s失败", bean.getUid(),bean.getRealName()),e);
					}
				}
				//银行信息
				if(!StringUtil.isEmpty(bean.getBankCard())&&!StringUtil.isEmpty(bean.getBankCode())&&!StringUtil.isEmpty(bean.getBankName())
						&&!StringUtil.isEmpty(bean.getCityid())&&!StringUtil.isEmpty(bean.getProvid())){
					try{
						ret = JdbcSqlMapping.executeUpdate("u_set_bank", bean, null, jcn);
						System.out.println("==========="+ret);
						if (ret != 1) {
							logger.error(String.format("用户%s，设置银行信息失败", bean.getUid()));
						}
					}catch(Exception e){
						logger.error(String.format("用户%s，设置银行信息失败", bean.getUid()),e);
					}
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(ErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(ErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("UserBeanStub::registerUser ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
}
