package com.caipiao.mob.user;

import java.util.Date;
import java.util.HashMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.mob.BeanStub;
import com.caipiao.mob.Status;
import com.caipiao.mob.match.Match;
import com.caipiao.mob.util.BeanLogUtil;
import com.caipiao.mob.util.FileCodesUtil;
import com.caipiao.mob.util.GameUtil;
import com.caipiao.mob.util.ProjectUtil;
import com.caipiao.mob.util.TransactionUtil;
import com.caipiao.mob.util.UserCheckUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;

public class UserBeanStub extends BeanStub{
	
	private Logger logger = LoggerFactory.getLogger("user");
	public final static String MD5_KEY = "http://www.jincaiunion.com/";

	//用户注册
	public void register(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getEmail())){
				bean.setErrJson(Status.EMAIL_IS_EMPTY.CODE, Status.EMAIL_IS_EMPTY.DESC);
				return;
			}
			
			if(!UserCheckUtil.isEmail(bean.getEmail())){
				bean.setErrJson(Status.EMAIL_IS_NOT_VALID.CODE, Status.EMAIL_IS_NOT_VALID.DESC);
				return;
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
	
				logger.info("用户注册  user=" + bean.getUser() + " channel=" + bean.getChannel());
				

				String pwd = MD5Util.compute(bean.getPassword() + MD5_KEY);
				bean.setPassword(pwd);
				int ret = JdbcSqlMapping.executeUpdate("mob_register", bean, null, jcn);
				if (ret == 0) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.REGISTER_IS_FAILURE.CODE, Status.REGISTER_IS_FAILURE.DESC);
					BeanLogUtil.logger("注册失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::register ", e);
				BeanLogUtil.logger("注册异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	
	public void checkUserName(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			int rc = JdbcSqlMapping.getRecordCount("mob_exist_userName", bean, null, jcn);
			if (rc == 1) {
				bean.setErrJson(Status.FAILURE.CODE, "已存在此用户名");
			}else{
				bean.setErrJson(Status.SUCCESS.CODE, "此用户名可以注册");
			}

		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("UserBeanStub::checkUserName ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	//用户登录
	public void login(UserBean bean, ServiceContext context) {
		if(check(bean)){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JSONObject obj = new JSONObject();
				int ret = JdbcSqlMapping.executeUpdate("mob_login", bean, null, jcn);
				if (ret == 0) {
					if(Status.SUCCESS.CODE.equals(bean.getStatus())){
//						bean.setBalanceJson(bean.getStatus(), bean.getBalance());
						obj.put("status", bean.getStatus());
						obj.put("balance", bean.getBalance());
						int rets = JdbcSqlMapping.executeUpdate("mob_getcaijin", bean, null, jcn);
						if (rets == 0) {
							obj.put("flag", bean.getStatus());
							obj.put("desc", bean.getMessage());
						}else{
							obj.put("flag", Status.FAILURE.CODE);
							obj.put("desc", bean.getMessage());
						}
						bean.setJson(obj.toString());
					} else {
						bean.setErrJson(bean.getStatus(), bean.getMessage());
					}
				} else {
					bean.setErrJson(Status.LOGIN_IS_FAILURE.CODE, Status.LOGIN_IS_FAILURE.DESC + bean.getMessage());
					BeanLogUtil.logger("登录失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::login ", e);
				BeanLogUtil.logger("登录异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	//用户实名
	public void setRealName(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getName())){
				bean.setErrJson(Status.REALNAME_IS_EMPTY.CODE, Status.REALNAME_IS_EMPTY.DESC);
				return;
			}
			
			if(StringUtil.isEmpty(bean.getIdno())){
				bean.setErrJson(Status.IDNO_IS_EMPTY.CODE, Status.IDNO_IS_EMPTY.DESC);
				return;
			}
			
			if(!UserCheckUtil.verifyIDCard(bean.getIdno())){
				bean.setErrJson(Status.IDNO_IS_NOT_VALID.CODE, Status.IDNO_IS_NOT_VALID.DESC);
				return;
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				int ret = JdbcSqlMapping.executeUpdate("mob_set_realname", bean, null, jcn);
				if (ret == 0) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + bean.getMessage());
					BeanLogUtil.logger("用户实名失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::setRealName ", e);
				BeanLogUtil.logger("用户实名异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//查找密码--获取用户绑定信息
	public void getUserBindInfo(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			if (StringUtil.isEmpty(bean.getUser()) ) {
				bean.setErrJson(Status.USER_IS_EMPTY.CODE,Status.USER_IS_EMPTY.DESC);
				return;
			}
			JSONObject obj = new JSONObject();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
			if (jrs != null && jrs.size() > 0 && jrs.first()) {
				
				String cnickid = jrs.get("cnickid");
				obj.put("cnickid", cnickid);
				 
				int mob = jrs.getInt("imobbind");
				obj.put("imobbind", mob);
				if(mob == 1){
					String phone = jrs.get("cmobileno");
					if(!StringUtil.isEmpty(phone)){
						obj.put("phone", phone);
					}
				}else{
					obj.put("phone", "");
				}
				obj.put("status", Status.SUCCESS.CODE);
				obj.put("message", Status.SUCCESS.DESC);
				bean.setJson(obj.toString());
			}else {
				obj.put("cnickid", bean.getUser());
				obj.put("imobbind", "0");
				obj.put("phone", "");
				obj.put("status", Status.FAILURE.CODE);
				obj.put("message", "用户不存在");
				bean.setJson(obj.toString());
			}
			jrs.clear();
			jrs = null ;
			
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			BeanLogUtil.logger("查询异常", bean, logger);
			logger.error("UserBeanStub::userforget ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	//查找密码--获取验证码
	public void getPhoneYZM(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String pwd = UserCheckUtil.randomNum();
			bean.setVphone(pwd);
			int ret = JdbcSqlMapping.executeUpdate("mob_getphoneyzm", bean, null, jcn);
			if (ret != 0) {
				bean.setErrJson(Status.FAILURE.CODE, "操作异常");
			}else{
				bean.setErrJson(bean.getStatus(), bean.getMessage());
			}

		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			BeanLogUtil.logger("操作异常2", bean, logger);
			logger.error("UserBeanStub::getPhoneYZM ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	//查找密码--检查手机验证码
	public void checkPhoneYZM(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			if (StringUtil.isEmpty(bean.getUser()) ) {
				bean.setErrJson(Status.USER_IS_EMPTY.CODE,Status.USER_IS_EMPTY.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getVphone())){
				bean.setErrJson(Status.RANDOM_IS_EMPTY.CODE, Status.RANDOM_IS_EMPTY.DESC);
				return;
			}
			jcn = context.getJdbcPoolManager().getJdbcConnect();
				
			String pwd = bean.getPassword();
			String	pwdmd = MD5Util.compute(pwd + MD5_KEY);
			bean.setNewValue(pwdmd);
			
			int ret = JdbcSqlMapping.executeUpdate("mob_checkphoneyzm", bean, null, jcn);
			if (ret != 0) {
				bean.setErrJson(Status.FAILURE.CODE, "操作异常");
			}else{
				if(bean.getStatus().endsWith(Status.SUCCESS.CODE)){
					bean.setErrJson(bean.getStatus(), pwd);
				}else{
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				}
				
			}
		
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			BeanLogUtil.logger("操作异常2", bean, logger);
			logger.error("UserBeanStub::checkPhoneYZM ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	//修改密码
	public void setNewPassword(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getNewValue())){
				bean.setErrJson(Status.NEWPASSWORD_IS_NOT_EMPTY.CODE, Status.REALNAME_IS_EMPTY.DESC);
				return;
			}
			bean.setStatus(Status.SUCCESS.CODE);
			bean.setMessage("修改密码成功！");
			JdbcConnect jcn = null;
			try {
				String pwd = MD5Util.compute(bean.getNewValue() + MD5_KEY);
				bean.setNewValue(pwd);
				
				pwd = MD5Util.compute(bean.getPassword() + MD5_KEY);
				bean.setPassword(pwd);
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				int ret = JdbcSqlMapping.executeUpdate("mob_set_newpassword", bean, null, jcn);
				if (ret == 1) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, "修改密码失败，老密码不正确");
					BeanLogUtil.logger("用户修改密码失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::setNewPassword ", e);
				BeanLogUtil.logger("用户修改密码异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//获取绑定手机验证码
	public void getPhoneRandNum(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getPhone())){
				bean.setErrJson(Status.PHONE_IS_EMPTY.CODE, Status.PHONE_IS_EMPTY.DESC);
				return;
			}
			if(!UserCheckUtil.isMobilephone(bean.getPhone())){
				bean.setErrJson(Status.PHONE_IS_NOT_VALID.CODE, Status.PHONE_IS_NOT_VALID.DESC);
				return;
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				bean.setVphone(UserCheckUtil.randomNum());
				
				int ret = JdbcSqlMapping.executeUpdate("mob_phonenum", bean, null, jcn);
				if (ret == 0) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + bean.getMessage());
					BeanLogUtil.logger("获取绑定手机验证码失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::getPhoneRandNum ", e);
				BeanLogUtil.logger("获取绑定手机验证码异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	//绑定手机(验证)
	public void setPhone(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getPhone())){
				bean.setErrJson(Status.PHONE_IS_EMPTY.CODE, Status.PHONE_IS_EMPTY.DESC);
				return;
			}
			if(!UserCheckUtil.isMobilephone(bean.getPhone())){
				bean.setErrJson(Status.PHONE_IS_NOT_VALID.CODE, Status.PHONE_IS_NOT_VALID.DESC);
				return;
			}
			
			if(StringUtil.isEmpty(bean.getVphone())){
				bean.setErrJson(Status.RANDOM_IS_EMPTY.CODE, Status.RANDOM_IS_EMPTY.DESC);
				return;
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				
				int ret = JdbcSqlMapping.executeUpdate("mob_setphone", bean, null, jcn);
				if (ret == 0) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + bean.getMessage());
					BeanLogUtil.logger("绑定手机失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::setPhone ", e);
				BeanLogUtil.logger("绑定手机异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	//绑定银行卡
	public void setBankInfo(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getProvince()) && StringUtil.isEmpty(bean.getCity())
					&& StringUtil.isEmpty(bean.getSubbranch()) && StringUtil.isEmpty(bean.getBankNumber())){

				JdbcConnect jcn = null;
				try {
					jcn = context.getJdbcPoolManager().getJdbcConnect();
					if(checkUser(bean, jcn)){
						JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
						if(jrs != null && jrs.size() > 0 && jrs.first()){
							String bankname = jrs.get("cbankname");
							String bankcard = jrs.get("cbankcard");
							JSONObject obj = new JSONObject();
							if(!StringUtil.isEmpty(bankname) && !StringUtil.isEmpty(bankcard)){
								String sn = bankcard.length() > 4 ? bankcard.substring(0, bankcard.length() - 4) + "****" : bankcard.substring(0,1) + "***";
								obj.put("bank", bankname);
								obj.put("card", sn);
							} else {
								obj.put("bank", bankname);
							}
							bean.setJson(obj.toString());
						}
					}
				} catch (Exception e) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
					logger.error("UserBeanStub::setBankInfo 2", e);
					BeanLogUtil.logger("绑定银行卡查询异常", bean, logger);
				} finally {
					if (jcn != null) {
						jcn.unlock();
					}
				}
			} else {
				
				if(StringUtil.isEmpty(bean.getProvince())){
					bean.setErrJson(Status.PROVINCE_IS_EMPTY.CODE, Status.PROVINCE_IS_EMPTY.DESC);
					return;
				}
				if(StringUtil.isEmpty(bean.getCity())){
					bean.setErrJson(Status.CITY_IS_EMPTY.CODE, Status.CITY_IS_EMPTY.DESC);
					return;
				}
				if(bean.getBank() < 0){
					bean.setErrJson(Status.BANK_IS_EMPTY.CODE, Status.BANK_IS_EMPTY.DESC);
					return;
				}
				if(StringUtil.isEmpty(bean.getSubbranch())){
					bean.setErrJson(Status.BANK_SUBBRANCH_IS_EMPTY.CODE, Status.BANK_SUBBRANCH_IS_EMPTY.DESC);
					return;
				}
				if(StringUtil.isEmpty(bean.getBankNumber())){
					bean.setErrJson(Status.BANKNUMBER_IS_EMPTY.CODE, Status.BANKNUMBER_IS_EMPTY.DESC);
					return;
				}
				JdbcConnect jcn = null;
				try {
					jcn = context.getJdbcPoolManager().getJdbcConnect();
					if(checkUser(bean, jcn)){
						int ret = JdbcSqlMapping.executeUpdate("mob_setbank", bean, null, jcn);
						if (ret == 1) {
							bean.setErrJson(Status.SUCCESS.CODE, "绑定银行卡" + Status.SUCCESS.DESC);
						} else {
							bean.setErrJson(Status.FAILURE.CODE, "绑定银行卡失败或已绑定银行卡");
							BeanLogUtil.logger("绑定银行卡失败", bean, logger);
						}
					}
				} catch (Exception e) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
					logger.error("UserBeanStub::setBankInfo ", e);
					BeanLogUtil.logger("绑定银行卡异常", bean, logger);
				} finally {
					if (jcn != null) {
						jcn.unlock();
					}
				}
			}
		}
	}

	public void getUserRealInfo(UserBean bean, ServiceContext context) {
		if(check(bean)){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					if (StringUtil.isEmpty(bean.getUser()) ) {
						bean.setErrJson(Status.USER_IS_EMPTY.CODE,Status.USER_IS_EMPTY.DESC);
						return;
					}
					JSONObject obj = new JSONObject();
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
					if (jrs != null && jrs.size() > 0 && jrs.first()) {
						
						String realname = jrs.get("crealname");
						String idno = jrs.get("cidcard");
						String rtime = jrs.get("CADDDATE");
						String phone = jrs.get("CMOBILENO");
						obj.put("idno", idno);
						obj.put("realname", realname);
						obj.put("rtime", rtime);
						obj.put("phone", phone);
						obj.put("status", Status.SUCCESS.CODE);
						obj.put("message", Status.SUCCESS.DESC);
						bean.setJson(obj.toString());
					}else {
						obj.put("idno", "");
						obj.put("realname", "");
						obj.put("rtime", "");
						obj.put("phone", "");
						obj.put("status", Status.FAILURE.CODE);
						obj.put("message", "用户不存在");
						bean.setJson(obj.toString());
					}
					jrs.clear();
					jrs = null ;
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				BeanLogUtil.logger("查询异常", bean, logger);
				logger.error("UserBeanStub::getUserRealInfo ", e);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void getUserInfo(UserBean bean, ServiceContext context) {
		if(check(bean)){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					JSONObject obj = new JSONObject();
					String realname = jrs.get("crealname");
					String idno = jrs.get("cidcard");
					if(!StringUtil.isEmpty(realname) && !StringUtil.isEmpty(idno)){
						String sn = idno.length() > 4 ? idno.substring(0, idno.length() - 4) + "****" : idno.substring(0,1) + "***";
						obj.put("name", realname);
						obj.put("idno", sn);
					}
					
					int mob = jrs.getInt("imobbind");
					if(mob == 1){
						String phone = jrs.get("cmobileno");
						if(!StringUtil.isEmpty(phone)){
							String mobile = phone.length() > 4 ? phone.substring(0, phone.length() - 4) + "****" : phone.substring(0,1) + "***";
							obj.put("phone", mobile);
						}
					}

					int mail = jrs.getInt("imailbind");
					if(mail == 1){
						String email = jrs.get("cemailaddr");
						if(!StringUtil.isEmpty(email)){
							int index = email.indexOf("@");
							if(index > 0){
								String email_name = email.substring(0, index);
								String sname = email_name.length() > 4 ? email_name.substring(0, email_name.length() - 4) + "****" : email_name.substring(0,1) + "***";
								String sm = sname + email.substring(index);
								obj.put("email", sm);
							}
						}
					}
					
					String bankname = jrs.get("cbankname");
					String bankcard = jrs.get("cbankcard");
					if(!StringUtil.isEmpty(bankname) && !StringUtil.isEmpty(bankcard)){
						String sn = bankcard.length() > 4 ? bankcard.substring(0, bankcard.length() - 4) + "****" : bankcard.substring(0,1) + "***";
						obj.put("bank", bankname);
						obj.put("bankno", sn);
					}
					
					bean.setJson(obj.toString());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "用户不存在");
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::getUserInfo ", e);
				BeanLogUtil.logger("获取用户信息异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//提现
	public void drawMoney(UserBean bean, ServiceContext context) {
		if(check(bean)){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				
				if(bean.getMoney() < 0){
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						String bankname = jrs.get("cbankname");
						String bankcard = jrs.get("cbankcard");
						String realName = jrs.get("crealname");
						JSONObject obj = new JSONObject();
						String sn = "";
						if(bankcard != null && bankcard.length() > 0){
							sn = bankcard.length() > 4 ? bankcard.substring(0, bankcard.length() - 4) + "****" : bankcard.substring(0,1) + "***";
						}
						String rn = "";
						if(realName != null && realName.length() > 0){
							rn = realName.length() > 4 ? realName.substring(0, realName.length() - 4) + "****" : realName.substring(0,1) + "***";
						}
						obj.put("bank", bankname);
						obj.put("bankNumber", sn);
						obj.put("realName", rn);
						bean.setJson(obj.toString());
					}
				} else {
					int ret = JdbcSqlMapping.executeUpdate("mob_drawmoney", bean, null, jcn);
					if (ret == 0) {
						bean.setErrJson(bean.getStatus(), bean.getMessage());
					} else {
						bean.setErrJson(Status.REGISTER_IS_FAILURE.CODE, Status.REGISTER_IS_FAILURE.DESC);
						BeanLogUtil.logger("提款失败", bean, logger);
					}
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::drawMoney ", e);
				BeanLogUtil.logger("提款异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//我的代购
	public void myDaiGou(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(bean.getPage() <= 0){
				bean.setPage(1);
			}
			
			String key = "mob_mydg";
			if("未开奖".equals(bean.getResult())){
				key = "mob_mydg_nopass";
			} else if("已中奖".equals(bean.getResult())){
				key = "mob_mydg_passed";
			} else if("未中奖".equals(bean.getResult())){
				key = "mob_mydg_nowin";
			} else if("作废".equals(bean.getResult())){
				key = "mob_mydg_failure";
			}
			
			if(bean.getVersion() > 5 && !key.equals("mob_mydg_failure")){
				key = key + "_all";
			}
			
			//未开奖 已中奖 未中奖 作废
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				
				if(checkUser(bean, jcn)){
					JSONArray array = new JSONArray();
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(key, bean, null, getPageSize(), bean.getPage(), jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						int len = jrs.size();
						for(int i = 0; i < len; i++){
							int award = jrs.getInt("iaward", i);
							int cast = jrs.getInt("icast", i);
							int state = jrs.getInt("istate", i);
							double tax = Double.parseDouble(jrs.get("itax", i));
							String addtime = jrs.get("cadddate", i);
							
							JSONObject obj = new JSONObject();
							obj.put("result", ProjectUtil.getResult(state,award,tax));
							obj.put("time", DateUtil.parserDateTime(addtime).getTime());
							obj.put("status", ProjectUtil.getStatus(cast));
							obj.put("money", jrs.get("itmoney", i));
							obj.put("termNo", jrs.get("cperiodid", i));
							String gameid = jrs.get("cgameid", i);
							String projid = jrs.get("cprojid", i);
							obj.put("planNo", gameid + "_" + projid);
							obj.put("method", "短信代发");
							obj.put("type", GameUtil.getGameName(gameid));
							String winmoney = jrs.get("itax", i);
							obj.put("winMoney", ProjectUtil.getWinMoney(cast, winmoney));
							array.put(obj);
						}
						jrs.clear();
						jrs = null;
					}
					bean.setJson(array.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::myDaiGou ", e);
				BeanLogUtil.logger("查询代购异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//代购详情
	public void daiGouDetail(UserBean bean, ServiceContext context) {
		
		logger.info("daiGouDetail");
		
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getPlanNo())){
				bean.setErrJson(Status.LOTTPROJ_IS_EMPTY.CODE, Status.LOTTPROJ_IS_EMPTY.DESC);
				return;
			}
			
			String [] parts = StringUtil.splitter(bean.getPlanNo(), "_");
			if(parts.length != 2){
				bean.setErrJson(Status.LOTTPROJ_IS_NOT_VALID.CODE, Status.LOTTPROJ_IS_NOT_VALID.DESC);
				return;
			}
			
			logger.info(bean.getPlanNo());
			
			String gameid = parts[0].trim();
			String projid = parts[1].trim();
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					
					HashMap<String, String> map = new HashMap<String, String>();
					map.put("gid", gameid);
					
					bean.setType(gameid);
					bean.setPlanNo(projid);
					
					logger.info(bean.toString());
					
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_proj", bean, map, jcn);
					logger.info(jrs.size()+"");
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						String nickid = jrs.get("cnickid");
						logger.info(nickid);
						int type = jrs.getInt("itype");
						JSONObject obj = new JSONObject();
						if(bean.getFlag()==1){
							nickid = bean.getUser();//
						}
						if((type == 0 && nickid.equals(bean.getUser())) || type == 1){
							int multiple = jrs.getInt("imulity");
							int money = jrs.getInt("itmoney");
							int award = jrs.getInt("iaward");
							int cast = jrs.getInt("icast");
							int state = jrs.getInt("istate");
							double tax = Double.parseDouble(jrs.get("itax"));
							double ibonus = Double.parseDouble(jrs.get("ibonus"));
							double iowins = Double.parseDouble(jrs.get("iowins"));
							String periodid = jrs.get("cperiodid");
							Date spDate = jrs.getDate("ccastdate");
							if(spDate == null) spDate = jrs.getDate("cadddate");
							
							obj.put("type", GameUtil.getGameName(gameid));
							obj.put("termNo", periodid);
							obj.put("projid", projid);
							obj.put("iopen", jrs.getInt("iopen"));
							obj.put("cname", jrs.get("cname"));
							obj.put("cdesc", jrs.get("cdesc"));
							obj.put("igaunum", jrs.get("igaunum"));
							obj.put("igagnum", jrs.get("igagnum"));
							int nums = jrs.getInt("inums");
							obj.put("amoney",Double.valueOf((tax-iowins)/nums));
							obj.put("ifile", jrs.get("ifile"));
							String opencode = "";
							if(GameUtil.isSZC(gameid)){
								bean.setTerm(periodid);
								JdbcRecordSet cjrs = JdbcSqlMapping.executeQuery("mob_opencode", bean, null, jcn);
								if(cjrs != null && cjrs.size() > 0 && cjrs.first()){
									int codeaudit = cjrs.getInt("icodeaudit");
									if(codeaudit == 1){
										opencode = cjrs.get("cawardcode");
									}
								}
							} else {
								String matchs = jrs.get("cmatchs");
								String [] ps = StringUtil.splitter(matchs, ",");
								StringBuffer sb = new StringBuffer();
								for(String p : ps){
									if(!StringUtil.isEmpty(p)){
										sb.append(p).append(",");
									}
								}
								String matches = sb.toString();
								if(matches.endsWith(",")){
									matches = matches.substring(0, matches.length()-1);
								}
								opencode = matches;
							}
							
							logger.info(opencode);
							
							obj.put("opencode", opencode);
							
							obj.put("multiple", multiple);
							obj.put("ibonus", ibonus);
							obj.put("iowins", iowins);
							obj.put("money", money);
							obj.put("result", ProjectUtil.getResult(state,award,tax));
							String winmoney = jrs.get("itax");
							obj.put("winMoney", ProjectUtil.getWinMoney(cast, winmoney));
							int ifile = jrs.getInt("ifile");
							int onemoney = 2;
							String codes = jrs.get("ccodes");
							if(ifile == 1){
								int iplay = jrs.getInt("iplay");
								int upload = jrs.getInt("iupload");
								if(upload == 1){
									String tmp = FileCodesUtil.getCodesFromFile(gameid, periodid, codes, iplay + "",logger);
									if(tmp == null){
										bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "未找到上传文件");
										return;
									}
									codes = tmp;
								} else {
									codes = "";
								}
							}
							if(GameUtil.isDLT(gameid)){
								if(!StringUtil.isEmpty(codes) && codes.indexOf(":2:") != -1){
									onemoney = 3;
								}
							}
							
							HashMap<String, Match> maps = getMatchFromDB(gameid, periodid, opencode,spDate, jcn);
							
							obj.put("zhushu", money/multiple/onemoney);
							obj.put("addtional", onemoney == 3 ? "1" : "0");
							obj.put("myLottery", ProjectUtil.getCodes(gameid,codes, maps, obj));
							
							if(type == 1){
								obj.put("ready", jrs.getInt("iupload"));
								obj.put("author", nickid);
								obj.put("total", jrs.getInt("inums"));
								obj.put("left", jrs.getInt("ilnum"));
								obj.put("firstnum", jrs.getInt("ionum"));
								int num = jcn.getRecordNums("select sum(ibnum) from tb_proj_buy_" + gameid + " where cprojid=? and cnickid=? and icancel=0", new Object[]{bean.getPlanNo(), bean.getUser()});
								obj.put("mynum", num);
								obj.put("permoney", "1");
								obj.put("ticheng", jrs.getInt("iwrate"));
								obj.put("jindu", jrs.getInt("ijindu"));
								obj.put("baodi", jrs.getInt("ipnum"));
								obj.put("time", jrs.get("cadddate"));
								obj.put("note", jrs.get("cname"));
							}
						}
						//logger.info("----------------------"+obj.toString());
						bean.setJson(obj.toString());
					} else {
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "用户彩种方案不存在");
					}
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::daiGouDetail ", e);
				BeanLogUtil.logger("查询代购详情异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void myHeMai(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(bean.getPage() < 0){
				bean.setPage(1);
			}
			
			String key = "mob_myhm";
			if(bean.getVersion() > 5) key = "mob_myhm_all";
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					JSONArray array = new JSONArray();
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(key, bean, null, getPageSize(), bean.getPage(), jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						int len = jrs.size();
						for(int i = 0; i < len; i++){
							JSONObject obj = new JSONObject();
							obj.put("total", jrs.getInt("itmoney", i));
							obj.put("author", jrs.get("cnickid", i));
							String buydate = jrs.get("cbuydate", i);
							obj.put("time", DateUtil.parserDateTime(buydate).getTime());
							int istate = jrs.getInt("istate", i);
							int icast = jrs.getInt("icast", i);
							String status = "暂停认购";
							if(istate == 1){
								status = "认购中";
							} else if(istate == 2){
								status = "已满员";
							} else if(istate == 3){
								status = "未满撤销";
							} else if(istate == 4){
								status = "发起人撤销";
							} else if(istate == 5){
								status = "系统撤销";
							} else if(istate == 1){
								status = "未知";
							}
							if(icast == 2){
								status += " 出票中";
							} else if(icast == 3){
								status += " 已出票";
							}
							obj.put("status", status);
							String gameid = jrs.get("gameid", i);
							String projid = jrs.get("cprojid", i);
							obj.put("hemaihao", gameid + "_" + projid);
							double tax = Double.parseDouble(jrs.get("itax", i));
							obj.put("prize", tax);
							obj.put("termNo", jrs.get("cperiodid", i));
							obj.put("myprize", jrs.get("iamoney", i));
							obj.put("mymoney", jrs.getInt("ibmoney", i));
							int cancel = jrs.getInt("icancel", i);
							int award = jrs.getInt("iaward", i);

							//已中奖 未中奖 未开奖 作废
							String result = "";
							if(cancel == 1 || cancel == 2){
								result = "作废";
							} else {
								if(award == 0){
									result = "未开奖";
								} else {
									if(tax > 0){
										result = "已中奖";
									} else {
										result = "未中奖";
									}
								}
							}
							
							obj.put("result", result);
							obj.put("type", GameUtil.getGameName(gameid));
							array.put(obj);
						}
					}
					bean.setJson(array.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::myHeMai ", e);
				BeanLogUtil.logger("查询我的合买异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void myAllBuy(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(bean.getPage() < 0){
				bean.setPage(1);
			}
			String key = "mob_buy_all";
			if("win".equals(bean.getResult())){
				key = "mob_buy_win_all";
			} else if("nowin".equals(bean.getResult())){
				key = "mob_buy_nowin_all";
			}
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					JSONArray array = new JSONArray();
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(key, bean, null, getPageSize(), bean.getPage(), jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						int len = jrs.size();
						for(int i = 0; i < len; i++){
							JSONObject obj = new JSONObject();
							
							String gid = jrs.get("CGAMEID", i);
							String pid = jrs.get("CPERIODID", i);
							String nickid = jrs.get("CNICKID", i);
							String projid = jrs.get("CPROJID", i);
							String bnum = jrs.get("IBNUM", i);
							String money = jrs.get("IBMONEY", i);
							String buydate = jrs.get("CBUYDATE", i);					
							int cancel = jrs.getInt("ICANCEL", i);				
							int award = jrs.getInt("IAWARD", i);		
							int ireturn = jrs.getInt("IRETURN", i);				
							double ibous = Double.parseDouble(jrs.get("IBONUS", i));				
							double rmoney = Double.parseDouble(jrs.get("IRMONEY", i));//您的奖金
							String retdate = jrs.get("CRETDATE", i);
							String fqnickid = jrs.get("cfqnickid", i);
							
							obj.put("time", buydate);
							obj.put("money", money);//认购金额
							obj.put("prize", rmoney);//奖金
							obj.put("tprize", ibous);//总奖金
							obj.put("projid", gid+"_"+projid);
							String buyType ="";
							if(jrs.getInt("itype", i)==0){
								buyType = "代购订单";
							}else{
								buyType = "合买订单";
							}
							obj.put("buyType", buyType);
							obj.put("periodid", pid);
							//已中奖 未中奖 未开奖 作废
							String result = "";
							if (cancel==0){
								if (ireturn==2){
									if (rmoney>0){
										result ="已中奖";
									}else{
										result ="未中奖";
									}						
								}else{
									result ="未结算";
								}
							}else if (cancel==1){
								result ="已退款";
							}else if (cancel==2){
								result ="已退款";
							}
							obj.put("result", result);
							obj.put("type", GameUtil.getGameName(gid));
							array.put(obj);
						}
					}
					bean.setJson(array.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::myHeMai ", e);
				BeanLogUtil.logger("查询我的合买异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	
	//追号纪录
	public void myZhuihao(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(bean.getCount() <= 0){
				bean.setCount(10);
			}
			if(bean.getOffset() < 0){
				bean.setOffset(0);
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					JSONObject obj = new JSONObject();
					JSONArray array = new JSONArray();
					int size = 0;
					int count = 0;
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_zhuihao", bean, null, jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						size = jrs.size();
						for(int i = bean.getOffset(); i < size; i++){
							JSONObject json = new JSONObject();
							json.put("row", i + 1);
							json.put("start", jrs.get("cperiodid", i));
							int finish = jrs.getInt("ifinish", i);
							json.put("state", finish == 1 ? "已完成" : "进行中");
							json.put("getmoney", jrs.getInt("ibonus", i));
							json.put("lottype", GameUtil.getGameName(jrs.get("cgameid", i)));
							json.put("finishmoney", jrs.getInt("icasts", i));
							json.put("finishcount", jrs.getInt("isuccess", i) + jrs.getInt("ifailure", i));
							json.put("totalcount", jrs.getInt("ipnums", i));
							json.put("id", jrs.get("czhid", i));
							json.put("cadddate", jrs.get("cadddate", i));
							json.put("totalmoney", jrs.getInt("itmoney", i));
							array.put(json);
							count++;
							if(count >= bean.getCount()){
								break;
							}
						}
					}
					obj.put("total", size);
					obj.put("nextoffset", count + bean.getOffset());
					obj.put("records",array);
					bean.setJson(obj.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::myZhuihao ", e);
				BeanLogUtil.logger("查询追号纪录异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	//追号详情
	public void zhuihaoDetail(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getPlanNo())){
				bean.setErrJson(Status.LOTTPROJ_IS_EMPTY.CODE, Status.LOTTPROJ_IS_EMPTY.DESC);
				return;
			}

			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					JSONObject obj = new JSONObject();
					JSONArray array = new JSONArray();
					JSONArray uarray = new JSONArray();
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_zh_detail", bean, null, jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						String gameid = jrs.get("cgameid");
						String zhid = jrs.get("czhid");
						String periodid = jrs.get("cperiodid");
						obj.put("lottype", GameUtil.getGameName(gameid));
						obj.put("totalcount", jrs.getInt("ipnums"));
						obj.put("finishcount", jrs.getInt("isuccess") + jrs.getInt("ifailure"));
						obj.put("totalmoney", jrs.getInt("itmoney"));
						obj.put("finishmoney", jrs.getInt("icasts"));
						int finish = jrs.getInt("ifinish");
						obj.put("state", finish == 1 ? "已完成" : "进行中");
						obj.put("start", periodid);
						obj.put("getmoney", jrs.getInt("ibonus"));
						obj.put("beishuarray", jrs.get("muls"));
						obj.put("autocancel", jrs.getInt("izhflag"));
						obj.put("cancelmoney", "1000");
						obj.put("time", jrs.get("cadddate"));
						String ccodes = "";
						JdbcRecordSet cjrs = jcn.executeQuery("select ccodes from tb_zh_detail_" + gameid + " where czhid=? and cperiodid=?", new Object[]{zhid, periodid});
						if(cjrs != null && cjrs.size() > 0 && cjrs.first()){
							String code = cjrs.get("ccodes");
							String [] codes = StringUtil.splitter(code, ";");
							StringBuffer sb = new StringBuffer();
							for(String _code : codes){
								if(!StringUtil.isEmpty(_code)){
									sb.append(ProjectUtil.getCode(gameid, _code)).append(";");
								}
							}
							ccodes = sb.toString();
							if(ccodes.endsWith(";")){
								ccodes = ccodes.substring(0, ccodes.length() - 1);
							}
						}
						obj.put("code", ccodes);
						JdbcRecordSet zhjrs = jcn.executeQuery("select * from tb_zh_detail_" + gameid + " where czhid=? and cnickid = ? order by cperiodid", new Object[]{zhid, bean.getUser()});
						if(zhjrs != null && zhjrs.size() > 0 && zhjrs.first()){
							int len = zhjrs.size();
							for(int i = 0; i < len; i++){
								JSONObject zobj = new JSONObject();
								zobj.put("idetailid", zhjrs.get("idetailid", i));
								zobj.put("istate", zhjrs.get("istate", i));
								zobj.put("cperiodid", zhjrs.get("cperiodid", i));
								zobj.put("imulity", zhjrs.get("imulity", i));
								zobj.put("cawardcode", zhjrs.get("cawardcode", i));
								zobj.put("icmoney", zhjrs.get("icmoney", i));
								zobj.put("ccastdate", zhjrs.get("ccastdate", i));
								if(StringUtil.isEmpty(zhjrs.get("istate", i))){
									uarray.put(zobj);
								}else{
									if(zhjrs.getInt("istate", i)!=0){
										array.put(zobj);
									}else{
										uarray.put(zobj);
									}
								}
								
							}
							zhjrs.clear();
							zhjrs = null;
						}
						obj.put("uzhRecords", uarray);
						obj.put("zhRecords", array);
					}
					bean.setJson(obj.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::zhuihaoDetail ", e);
				BeanLogUtil.logger("查询追号详情异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	
	//交易纪录
	public void transactionRecords(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(bean.getCount() <= 0){
				bean.setCount(10);
			}
			if(bean.getOffset() < 0){
				bean.setOffset(0);
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					JSONObject obj = new JSONObject();
					JSONArray array = new JSONArray();
					int size = 0;
					int count = 0;
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_u_charge", bean, null, jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						size = jrs.size();
						for(int i = bean.getOffset(); i < size; i++){
							JSONObject json = new JSONObject();
							json.put("row", i + 1);
							json.put("ichargeid", jrs.get("ichargeid", i));
							json.put("time", jrs.get("cadddate", i));
							String itype = jrs.get("itype", i);
							String im = "";
							String om = "";
							if (itype.equals("0")) {
								im = jrs.get("imoney", i);
							}else{
								om = jrs.get("imoney", i);
							}
							json.put("imoney", im);
							json.put("omoney", om);
							json.put("ibalance", jrs.get("ibalance", i));
							json.put("itype", jrs.get("itype", i));
							String cmemo = jrs.get("cmemo", i);
							String ibiztype = jrs.get("ibiztype", i);
							String[] memo = TransactionUtil.showCmemo(ibiztype, cmemo);
							String zid = memo[2];
							String projid = memo[1];
							String title = memo[0];
							json.put("ibiztype", TransactionUtil.getTransactionName(ibiztype));
							json.put("cmemo", title==""?cmemo:title);
							json.put("projid", projid);
							json.put("zid", zid);
							array.put(json);
							count++;
							if(count >= bean.getCount()){
								break;
							}
						}
					}
					obj.put("total", size);
					obj.put("nextoffset", count + bean.getOffset());
					obj.put("records",array);
					bean.setJson(obj.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::transactionRecords ", e);
				BeanLogUtil.logger("查询交易纪录异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
		
		
	// 用户余额
	public void getUserMoney(UserBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getType())){
				bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
				return;
			}
			if(!GameUtil.checkGame(bean.getType())){
				bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
				return;
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				if(checkUser(bean, jcn)){
					String balance = "0";
					JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_user_acct", bean, null, jcn);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						balance = jrs.get("ibalance");
					}
					JSONObject obj = new JSONObject();
					obj.put("status", "_0000");
					obj.put("balance", balance);
					String periodid = "";
					if(GameUtil.isSZC(bean.getType()) || GameUtil.isZC(bean.getType()) || GameUtil.isBD(bean.getType())){
						JdbcRecordSet pjrs = jcn.executeQuery("select * from (select * from tb_period t where cgameid = ? and istate=1 order by cperiodid ) where rownum = 1", new Object[]{bean.get159Type()});
						if(pjrs != null && pjrs.size() > 0 && pjrs.first()){
							periodid = pjrs.get("cperiodid");
						}
					} else if(GameUtil.isJCZQ(bean.getType())){
						JdbcRecordSet pjrs = jcn.executeQuery("select * from (select * from tb_match_jczq where istate = 0 order by citemid) where rownum = 1", new Object[0]);
						if(pjrs != null && pjrs.size() > 0 && pjrs.first()){
							String itemid = pjrs.get("citemid");
							periodid = itemid.substring(0, 6);
						}
					} else if(GameUtil.isJCLQ(bean.getType())){
						JdbcRecordSet pjrs = jcn.executeQuery("select * from (select * from tb_match_jclq where istate = 0 order by citemid) where rownum = 1", new Object[0]);
						if(pjrs != null && pjrs.size() > 0 && pjrs.first()){
							String itemid = pjrs.get("citemid");
							periodid = itemid.substring(0, 6);
						}
					}
					obj.put("termNo", periodid);
					bean.setJson(obj.toString());
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::zhuihaoDetail ", e);
				BeanLogUtil.logger("查询追号详情异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	//用户领取注册送彩金
	public void zcs(UserBean bean, ServiceContext context) {
		if(check(bean)){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				
				bean.setSource(8);

				int ret = JdbcSqlMapping.executeUpdate("mob_zcs", bean, null, jcn);
				if (ret == 0) {
					if(Status.SUCCESS.CODE.equals(bean.getStatus())){
						bean.setBalanceJson(bean.getStatus(), bean.getBalance());
					} else {
						bean.setErrJson(bean.getStatus(), bean.getMessage());
					}
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + bean.getMessage());
					BeanLogUtil.logger("领取彩金失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("UserBeanStub::czs ", e);
				BeanLogUtil.logger("领取彩金出现异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void hdIndex(UserBean bean, ServiceContext context) {
		
		try {
			JSONObject obj = new JSONObject();
			JSONArray array = new JSONArray();
			
			/*JSONObject json1 = new JSONObject();
			json1.put("row", 1);
		
			json1.put("name", "zcs");
			json1.put("image", "http://phone.19500.com/index/1.png");
			json1.put("type", 1);//0自动参加，1需要手动领取
			json1.put("status", 0);//0有效，1无效
			json1.put("desc", "新用户绑定身份证和手机号码，免费领取3元彩金");
			array.put(json1);*/
			
			JSONObject json1 = new JSONObject();
			Integer version  = bean.getVersion();
			
//			json1.put("row", 1);
//			json1.put("name", "zc");
//			if(version==null||version<6){
//				json1.put("image", "http://phone.19500.com/index/1.png");
//			}else{
//				json1.put("image", "http://phone.19500.com/index/1-2.png");
//			}
//			json1.put("type", 0);
//			json1.put("status", 0);
//			json1.put("desc", "新用户首次充值满40得83");
//			array.put(json1);
			
			JSONObject json2 = new JSONObject();
			
			json2.put("row", 1);
			json2.put("name", "dg");
			if(version==null||version<6){
				json2.put("image", "http://mapi.159cai.com/index/dg.png");
			}else{
				json2.put("image", "http://mapi.159cai.com/index/dg.png");
			}
			
			json2.put("type", 0);
			json2.put("status", 0);
			json2.put("desc", "单关固赔上线");
			array.put(json2);
			
			//if(version==null||version<6){
			/*
				JSONObject json3 = new JSONObject();
				json3.put("row", 2);
				json3.put("name", "dlt");
				json3.put("image", "http://mapi.159cai.com/index/dlt.png");
				json3.put("type", 0);
				json3.put("status", 0);
				json3.put("desc", "大乐透加奖1.5亿");
				array.put(json3);
			*/
				obj.put("total", 1);
			//}else{
			//	obj.put("total", 1);
			//}
			obj.put("records",array);
			bean.setJson(obj.toString());
		
		} catch (JSONException e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("UserBeanStub::hdIndex ", e);
		}
	}
	
	public static void main(String[] args) throws Exception{
		System.out.println("\u80dc\u8d1f\u5f69");
		JSONArray array = new JSONArray();
		for(int i = 0; i < 3; i++){
			JSONObject obj = new JSONObject();
			obj.put("aaa",123 + i);
			obj.put("start", "未\\中奖");
			array.put(obj);
		}
		System.out.println(array.toString());
		
		String sql = " select '#gid#' gameid, t.itmoney,t.cnickid,t.istate,t.icast,tb.ibmoney,tb.cbuydate,t.cprojid,t.ibonus,t.itax,t.cperiodid,tb.iamoney,tb.iaward,tb.icancel,tb.cnickid rnickid from tb_proj_#gid# t, tb_proj_buy_#gid# tb where t.cprojid = tb.cprojid";
		String [] gs = new String[]{"01","03","04","07","20","50","51","52","53","54","55","56","70","71","72","80","81","82","83","85","86","87","88","89","90","91","92","93","94","95","96","97","98","99"};
		for(String g : gs){
			String tmp = sql.replaceAll("#gid#", g);
			System.out.println(tmp + " union all");
		}
		
		//{"type":"竞彩足球","termNo":"131109","opencode":"131109001,131109002",
		//"multiple":"1","money":"18.00","result":"作废","winMoney":"20.80","zhushu":"9.00",
		//"myLottery":[{"content":"SPF|惠灵顿凤凰vs珀斯光荣=0,阿德莱德联vs纽卡斯尔喷气机=1|2*1",
		//	"code":"SPF|惠灵顿凤凰vs珀斯光荣=0,阿德莱德联vs纽卡斯尔喷气机=1|2*1"}],
		//"addtional":"0",
		//"matchorder":[
		//	{"id":"131109001","matchtime":"2013-11-09 12:00:00","state":"\u5df2\u5b8c\u6210","home":"\u60e0\u7075\u987f\u51e4\u51f0","visit":"\u73c0\u65af\u5149\u8363","half":"1:1","score":"1:1","point":"-1","ordersum":"[0,1,2]","opensum":"[1,53,5,25,46]"},
		//	{"id":"131109002","matchtime":"2013-11-09 14:30:00","state":"\u5df2\u5b8c\u6210","home":"\u963f\u5fb7\u83b1\u5fb7\u8054","visit":"\u7ebd\u5361\u65af\u5c14\u55b7\u6c14\u673a","half":"0:1","score":"1:2","point":"-1","ordersum":"[0,1,2]","opensum":"[2,53,6,34,50]"}
		//],
		//"ready":"1","author":"djx2010","total":"9","left":"8",
		//"firstnum":"1","mynum":"1","permoney":"2.00","ticheng":"10",
		//"jindu":"11","baodi":"0","time":"2013-11-09 08:43:00","note":"快乐购彩"}
		System.out.println("\u5feb\u4e50\u8d2d\u5f69");
		
		
		//{"type":"双色球","termNo":"2013141","opencode":"03,04,05,25,30,31|04","multiple":"4","money":"288.00",
		//"result":"已中奖","winMoney":"540.00","zhushu":"36.00",
		//"myLottery":[{"content":"11 20 23 24 27 33+04","code":"11 20 23 24 27 33+04"},],
		//"addtional":"0","matchorder":[],"ready":"1","author":"辰彤之彩",
		//"total":"144","left":"0","firstnum":"45","mynum":"0","permoney":"2.00","ticheng":"10.00",
		//"jindu":"100","baodi":"0","time":"2013-11-30 23:41:00","note":"快乐购彩"}
	}
}