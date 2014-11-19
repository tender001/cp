package com.caipiao.cpweb.user;

import java.util.HashMap;
import java.util.List;

import com.caipiao.cpweb.BaseBean;
import com.caipiao.cpweb.ErrCode;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;

public class UserBeanStub {

	public final static String MD5_KEY = "http://www.jincaiunion.com/";
	private Logger logger;

	public UserBeanStub() {
		logger = LoggerFactory.getLogger("user");
	}

	/**
	 * 用户登录接口
	 * 
	 * @param bean
	 * @param context
	 */
	public void login(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				String pwd = MD5Util.compute(bean.getPwd() + MD5_KEY);
				bean.setPwd(pwd);
				int ret = JdbcSqlMapping.executeUpdate("u_login", bean, null, jcn);
				if (ret != 0) {
					if(bean.getBusiErrCode() == 0){
						bean.setBusiErrCode(ErrCode.ERR_CALL_SP);
						bean.setBusiErrDesc(ErrCode.getErrDesc(bean.getBusiErrCode()));
					}
				} else {
					if (bean.getBusiErrCode() == 0) {
						addUserOperLog(bean, "用户登录", "[成功]", jcn);
					} else {
						addUserOperLog(bean, "用户登录", "[失败] " + bean.getBusiErrDesc(), jcn);
					}
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(ErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(ErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("UserBeanStub::login", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 用户注册接口
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void registerUser(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			bean.check(bean.getFid());

			if (bean.getBusiErrCode() == 0) {
				String pwd = MD5Util.compute(bean.getPwd() + MD5_KEY);
				bean.setPwd(pwd);

				logger.info("用户注册  uid=" + bean.getUid() + " aid=" + bean.getComeFrom());
				
				int ret = JdbcSqlMapping.executeUpdate("u_register", bean, null, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(ErrCode.ERR_CALL_SP);
					bean.setBusiErrDesc(ErrCode.getErrDesc(bean.getBusiErrCode()));
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

	public void callSp(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			
			if (bean.getFid().equalsIgnoreCase("u_hdssq")) {
				bean.setSource(1);
			}
			
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate(bean.getFid(), bean, map, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("调用后台应用失败!");
					logger.error("调用存储过程失败 fid=" + bean.getFid());
				}
			}
		} catch (Exception e) {
			logger.error("调用存储过程出现异常 fid=" + bean.getFid(), e);
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("调用后台应用失败");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void update(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate(bean.getFid(), bean, map, jcn);
				if (ret >= 1) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("操作成功");
				} else {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("操作失败");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void query(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(bean.getFid(), bean, map, jcn);
				if (jrs != null && jrs.size() > 0) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("查询成功");
					if (jrs.size() > 0) {
						bean.setBusiXml(jrs.toRawXmlString("row"));
					}

					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(9000);
					bean.setBusiErrDesc("查询无数据");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("查询出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void queryPage(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		String qkey = "q_" + bean.getFid();
		String ckey = "c_" + bean.getFid();

		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				if (bean.getPs() <= 0) {
					bean.setPs(25);
				}

				int tp = bean.getTp();
				if (tp == 0) {
					int count = JdbcSqlMapping.getRecordCount(ckey, bean, map, jcn);
					bean.setRc(count);
					if (count % bean.getPs() == 0) {
						bean.setTp(count / bean.getPs());
					} else {
						bean.setTp(count / bean.getPs() + 1);
					}
				}

				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(qkey, bean, map, bean.getPs(), bean.getPn(), jcn);
				if (jrs != null) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("查询成功");

					String xml = "<count tp=\"" + bean.getTp() + "\" rc=\"" + bean.getRc() + "\" pn=\"" + bean.getPn() + "\" ps=\"" + bean.getPs() + "\"/>\r\n";
					if (jrs.size() > 0) {
						xml += jrs.toRawXmlString("row");
					}
					bean.setBusiXml(xml);
					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(9000);
					bean.setBusiErrDesc("查询无数据");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("查询出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void modifyUserInfo(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String errDesc = "";
			String sucDesc = "";
			String fid = bean.getFid();
			String key = fid;
			logger.info("mui------------>" + key);
			if("u_set_bank".equals(fid)){// 修改银行卡信息					
				String upwd = MD5Util.compute(bean.getUpwd() + MD5_KEY);
				bean.setUpwd(upwd);
				if (CheckUtil.isNullString(bean.getTid())) {
					key = "u_set_bank";// 设置银行卡信息
					errDesc = "首次设置银行卡信息失败,密码错误或者已经绑定过银行卡";
					sucDesc = "首次设置银行卡信息成功";
				} else {// 修改银行卡信息
					key = "u_modi_bank";
					errDesc = "修改银行信息失败,密码错误";
					sucDesc = "修改银行信息成功";
				}
			} else if("u_modi_info".equals(fid)){
				errDesc = "修改基本信息失败";
				sucDesc = "修改基本信息成功";
			} else if("u_modi_pwd".equals(fid)){
				String pwd = MD5Util.compute(bean.getNewValue() + MD5_KEY);
				bean.setNewValue(pwd);
				
				pwd = MD5Util.compute(bean.getUpwd() + MD5_KEY);
				bean.setUpwd(pwd);

				errDesc = "修改密码失败，老密码不正确";
				sucDesc = "修改密码成功";
			} else if("u_set_pinfo".equals(fid)){
				if (CheckUtil.isNullString(bean.getTid())) {
					key = "u_set_pinfo";// 设置密保问题
					errDesc = "设置密保问题失败,已经设置过密保问题";
					sucDesc = "设置密保问题成功";
				} else {// 修改密保问题
					key = "u_modi_pinfo";
					errDesc = "修改密保问题失败,旧答案不正确";
					sucDesc = "修改密保问题成功";
				}
			} else if("u_modi_mobile".equals(fid)) {
				errDesc = "修改手机号码失败，老号码不正确";
				sucDesc = "修改手机号码成功";
			} else if("u_modi_mail".equals(fid)) {
				errDesc = "修改电子邮件失败，老邮件地址不正确";
				sucDesc = "修改电子邮件成功";
			} else if("u_modi_rinfo".equals(fid)){
				String upwd = MD5Util.compute(bean.getUpwd() + MD5_KEY);
				bean.setUpwd(upwd);
				errDesc = "用户实名失败,密码错误";
				sucDesc = "用户实名成功";
			} else if("u_modi_auto".equals(fid)) {
				errDesc = "设置自动跟单状态失败";
				sucDesc = "设置自动跟单状态成功";
			}
			int ret = JdbcSqlMapping.executeUpdate(key, bean, null, jcn);
			if (ret == 1) {
				logger.info("ret------------>" + ret);
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc(sucDesc);
				
				if ("u_modi_pwd".equals(fid)) {
					bean.setPwd(bean.getNewValue());
				}
				
				StringBuffer sb = new StringBuffer();
				sb.append("[").append(sucDesc).append("]");
				sb.append("flag=").append(bean.getFlag()).append(";");
				sb.append("性别=").append(bean.getGender()).append(";");
				sb.append("省份=").append(bean.getProvid()).append(";");
				sb.append("城市=").append(bean.getCityid()).append(";");
				sb.append("QQ=").append(bean.getImNo()).append(";");
				sb.append("手机=").append(bean.getMobileNo()).append(";");
				sb.append("问题=").append(bean.getRid()).append(";");
				sb.append("答案=").append(bean.getAid()).append(";");
				sb.append("银行卡号=").append(bean.getBankCard()).append(";");
				sb.append("银行省份=").append(bean.getProvid()).append(";");
				sb.append("银行城市=").append(bean.getCityid()).append(";");
				sb.append("银行名称=").append(bean.getBankName()).append(";");
				sb.append("修改后内容=").append(bean.getNewValue());

				addUserOperLog(bean, "修改用户信息", sb.toString() , jcn);
			} else {
				if(ret == 0 && "u_modi_rinfo".equals(fid)) {
					
				} else {
					bean.setBusiErrCode(9001);
					bean.setBusiErrDesc(errDesc);
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("UserBeanStub::modifyUserInfo", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void usergetpwd(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			String pwd = CheckUtil.randomNum();
			bean.setYzm(pwd);
			if ( bean.getFlag()==0 || bean.getFlag()==2){
			String newpwd = MD5Util.compute(pwd + MD5_KEY);
			
			StringBuffer parameters = new StringBuffer();
			parameters.append("/user/getpwd.html?username=")
	          .append(java.net.URLEncoder.encode(bean.getUid(),"utf-8"))
    		  .append("&vcode=")
	          .append(newpwd)
			  .append("&act=verifyemail");
			
			bean.setBackurl(bean.getBackurl()+ parameters.toString());
			bean.setYzm(newpwd);
			}
			
			int ret = JdbcSqlMapping.executeUpdate("u_getpwd", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("操作异常1");
			}else{
				if ( bean.getFlag()==2 && bean.getBusiErrCode()==0){
					addUserOperLog(bean, "用户忘记密码", "[提交参数信息成功]flag=2value="+bean.getNewValue() , jcn);
					String xml = "<row pass=\"" + pwd + "\"/>"; 
					bean.setBusiXml(xml);
				}
			}

		} catch (Exception e) {
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("操作异常2");
			logger.error("UserBeanStub::usergetpwd ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void usergetpwdyz(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			if (CheckUtil.isNullString(bean.getUid())) {
				bean.setBusiErrCode(ErrCode.ERR_CHECK);
				bean.setBusiErrDesc("用户名不能为空");
			}
			if (bean.getFlag() != 0 && bean.getFlag() != 1) {
				bean.setBusiErrCode(ErrCode.ERR_CHECK);
				bean.setBusiErrDesc("不支持的找回密码方式");
			}
			if (CheckUtil.isNullString(bean.getYzm())) {
				bean.setBusiErrCode(ErrCode.ERR_CHECK);
				bean.setBusiErrDesc("验证信息不能为空");
			}
			jcn = context.getJdbcPoolManager().getJdbcConnect();
				
			String pwd = CheckUtil.randomNum();
			String	pwdmd = MD5Util.compute(pwd + MD5_KEY);
			bean.setNewValue(pwdmd);
			
			int ret = JdbcSqlMapping.executeUpdate("u_getpwdyz", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("操作异常1");
			}else{
				if(bean.getBusiErrCode()==0){
				addUserOperLog(bean, "用户忘记密码", "[提交参数信息成功]flag="+bean.getFlag()+"yzm="+bean.getYzm() , jcn);
				String xml = "<row pass=\"" + pwd + "\"/>"; 
				bean.setBusiXml(xml);
				}
			}
		
		} catch (Exception e) {
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("操作异常2");
			logger.error("UserBeanStub::usergetpwdyz ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void userforget(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			if ( CheckUtil.isNullString(bean.getUid()) ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("用户名不能为空");
			}
			logger.info("uid--------->" + bean.getUid());
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("u_forgetpwd", bean, null, jcn);
			if (jrs != null && jrs.size() > 0 && jrs.first()) {
				
				String xml = jrs.toRawXmlString("row");
				
				bean.setBusiXml(xml);
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("获取成功");
			}
			jrs.clear();
			jrs = null ;
			
		} catch (Exception e) {
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("查询异常");
			logger.error("UserBeanStub::userforget ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void bindUser(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			if ( bean.getFlag()==0 && !CheckUtil.isEmail(bean.getNewValue()) ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("电子邮件格式不正确");
			}
			
			if ( bean.getFlag()==0 && !CheckUtil.isNullString(bean.getMailAddr()) && !CheckUtil.isEmail(bean.getMailAddr()) ) {
				bean.setBusiErrCode(2);
				bean.setBusiErrDesc("原电子邮件格式不正确");
			}
			
			if ( bean.getFlag()==0 && !CheckUtil.isNullString(bean.getMailAddr()) && bean.getMailAddr()==bean.getNewValue() ) {
				bean.setBusiErrCode(3);
				bean.setBusiErrDesc("新旧邮箱不能相同，请重新输入");
			}
			
			if ( bean.getFlag()==1 && !CheckUtil.isMobilephone(bean.getNewValue()) ) {
				bean.setBusiErrCode(4);
				bean.setBusiErrDesc("手机号码格式不正确");
			}
			
			if ( bean.getFlag()==1 && !CheckUtil.isNullString(bean.getMobileNo()) && !CheckUtil.isMobilephone(bean.getMobileNo()) ) {
				bean.setBusiErrCode(5);
				bean.setBusiErrDesc("原手机号码格式不正确");
			}
			
			if ( bean.getFlag()==1 && !CheckUtil.isNullString(bean.getMobileNo()) && bean.getMobileNo()==bean.getNewValue() ) {
				bean.setBusiErrCode(6);
				bean.setBusiErrDesc("新旧手机号码不能相同，请重新输入");
			}
			
			if (bean.getBusiErrCode() == 0) {
				String pwd = CheckUtil.randomNum();
				if ( bean.getFlag()==0){
					pwd = MD5Util.compute(CheckUtil.randomNum() + MD5_KEY);
					
					StringBuffer parameters = new StringBuffer();
					parameters.append("/user/emailbound.html?uid=")
			          .append(java.net.URLEncoder.encode(bean.getUid(),"utf-8"))
		    		  .append("&vcode=")
			          .append(pwd);
					
					bean.setBackurl(bean.getBackurl()+ parameters.toString());
				}

				bean.setYzm(pwd);
				
				int ret = JdbcSqlMapping.executeUpdate("u_bind", bean, null, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(9001);
					bean.setBusiErrDesc("操作失败");
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("UserBeanStub::bindUser ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void bindUseryz(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("u_bind_yz", bean, null, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(9001);
					bean.setBusiErrDesc("操作失败");
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("操作异常");
			logger.error("UserBeanStub::bindUseryz ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void queryAutoBuy(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("q_sauto", bean, null, jcn);
			JdbcRecordSet jrs1 = JdbcSqlMapping.executeQuery("u_count_auto", bean, null, jcn);
			
			String xml = "";
			if ( jrs != null ) {
				xml = jrs.toRawXmlString("row");
				jrs.clear();
				jrs = null ;
			}
			if ( jrs1 != null ) {
				xml += jrs1.toRawXmlString("count");
				jrs1.clear();
				jrs1 = null ;
			}
			
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("成功");
			bean.setBusiXml(xml);			
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("查询异常");
			logger.error("UserBeanStub::queryAutoBuy", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void addAuto(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			bean.setBusiErrCode(0);
			if ( bean.getFlag()!=0 && bean.getFlag()!=1 ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("不支持的跟单类型");
			}
			
			if ( bean.getSource()!=0 && bean.getSource()!=1 ) {
				bean.setSource(1);
			}
			
			if ( bean.getFlag()==0 && bean.getMoney() <= 0 ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("跟单金额必须大于0");
			}
			
			if ( bean.getFlag()==1 && (bean.getGender() <= 0 || bean.getGender() >= 100) ) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("跟单比例设置错误");
			}
			
			if ( CheckUtil.isNullString(bean.getUid()) || CheckUtil.isNullString(bean.getOwner()) ) {
				bean.setBusiErrCode(2);
				bean.setBusiErrDesc("跟单人或发起人不能为空！");
			}
			
			
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("u_addauto", bean, null, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("跟单失败");
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("跟单异常");
			logger.error("UserBeanStub::addAuto", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void userTransfer(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			
			int ret = JdbcSqlMapping.executeUpdate("u_transfer", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("转款失败");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("转款异常");
			logger.error("UserBeanStub::userTransfer ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 代理商用户向下级转款
	 * @param bean
	 * @param context
	 */
	public void userAgentTransfer(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			int ret = JdbcSqlMapping.executeUpdate("ua_transfer", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(9001);
				bean.setBusiErrDesc("转款失败");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("转款异常");
			logger.error("UserBeanStub::userAgentTransfer ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public static void addUserOperLog(BaseBean bean, String type, String memo, JdbcConnect jcn) {
		String sql = "insert into tb_user_log (irecid,cnickid,cmemo,cipaddr,ctype) values (seq_user_log.nextval,'";
		sql += bean.getUid() + "','" + memo + "','" + bean.getIpAddr() + "','" + type + "')";
		jcn.executeUpdate(sql);
	}
	
	/**
	 * 代理给下级用户设置返点
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void setfandian(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String userid=bean.getUser_id();//下级用户名
			String qtype=bean.getQtype();//是否代理
			//int gender=bean.getGender();//类型
			String fid=bean.getFid();
			String nums=bean.getTid();
			String cagentid="";
			String isdaili="";
			String agentid="";
			String cparentid="";
			
			//不能给自己设置返点
			if(userid.equals(bean.getUid())){
				throw new Exception("设置返点失败,代理不能给自己设置返点");
			}
			//参数检验
			String[] lotid = StringUtil.splitter(fid, ",");
			String[] rates = StringUtil.splitter(nums, ",");
			if(lotid.length != rates.length){
				throw new Exception("设置返点失败,["+bean.getUid()+"]彩种与返点值数量不一致");
			}
			
			//代理商用户信息
			JdbcRecordSet jrs = jcn.executeQuery("select cagentid,isdaili from tb_agent where cnickid=?", new Object[]{bean.getUid()});
			if(jrs == null || jrs.size() == 0){
				throw new Exception("设置返点失败,["+bean.getUid()+"]不是代理商");
			}else{
				jrs.first();
				cagentid = jrs.get("cagentid");
				isdaili = jrs.get("isdaili");
				if(!"1".equals(isdaili)){
					throw new Exception("设置返点失败,["+bean.getUid()+"]没有代理权限");
				}
			}
			
			//是代理，不是vip直接下级（公司员工）
			/*
			jrs = jcn.executeQuery("select cagentid from tb_agent where cagentid=? and cparentid = 'vip'", new Object[]{userid});
			if(jrs == null || jrs.size() == 0){
				for(int i=0;i<rates.length;i++){
					if(Double.parseDouble(rates[i]) > 9.50D){
						throw new Exception("设置返点失败,代理商不能设置超过9.5%");
					}
				}
			}
			*/
			//下级用户信息
			jrs = jcn.executeQuery("select cagentid,cidcard from tb_user where cnickid=?", new Object[]{userid});
			if(jrs == null || jrs.size() == 0){
				throw new Exception("设置返点失败,不存在用户["+userid+"]");
			}else{
				jrs.first();
				agentid = jrs.get("cagentid");
				if(StringUtil.isEmpty(jrs.get("cidcard"))){
					bean.setBusiErrCode(2);
					bean.setBusiErrDesc("用户[" + userid + "]还未实名,实名后方可设置。" );
					return;
				}
			}
			boolean bln = true;
			if(!agentid.equals(cagentid)){
				jrs = jcn.executeQuery("select cparentid,isdaili from tb_agent where cagentid=?", new Object[]{agentid});
				if(jrs == null || jrs.size() == 0){
					throw new Exception("设置返点失败,不存在代理["+agentid+"]");
				}else{
					jrs.first();
					cparentid = jrs.get("cparentid");
					isdaili = jrs.get("isdaili");
					if(!cagentid.equals(cparentid)){
						throw new Exception("设置返点失败,用户["+userid+"]不是["+cagentid+"]下用户");
					}
					//是否代理 update
					//logger.error("isdaili=" + isdaili+"==qtype=" + qtype);
					if(isdaili.equals("1") && qtype.equals("0")){
						throw new Exception("设置返点失败,不能取消用户["+userid+"]代理");
					}
					if(!isdaili.equals(qtype)){
						//logger.error("update tb_agent set isdaili="+qtype+" where cagentid="+agentid+"");
						jcn.executeUpdate("update tb_agent set isdaili=? where cagentid=?", new Object[]{qtype,agentid});
					}
				}
			}else{//普通用户设置VIP记录
				int ret = JdbcSqlMapping.executeUpdate("user_set_vip", bean, null, jcn);
				if (ret != 0) {
					bln = false;
					throw new Exception("设置返点失败,设置vip失败");
				} else {
					if (bean.getBusiErrCode()!= 0) {
						bln = false ;
						throw new Exception("设置返点失败,设置vip操作失败 bean.getBusiErrCode()="+bean.getBusiErrCode()+" bean.getBusiErrDesc()="+bean.getBusiErrDesc());
					}
				}
			}
			if (bln) {
				for (int i = 0; i < lotid.length; i++) {
					if (!CheckUtil.isNullString(lotid[i]) && !CheckUtil.isNullString(rates[i])) {
						String _gid = lotid[i].trim();
						String _rate = rates[i].trim();
						
						logger.info("开始设置 uid=" + bean.getUid() + " gid=" + _gid + " rate=" + _rate + " aid=" + bean.getAid());
						
//						if(StringUtil.getNullInt(_gid)>=70 && StringUtil.getNullDouble(_rate)>8.5){
//							continue;
//						}
//                        if(StringUtil.getNullInt(_gid)<70 && StringUtil.getNullDouble(_rate)>6){
//                        	continue;
//						}
						bean.setRid(_gid);
						bean.setAid(_rate);
						int ret = JdbcSqlMapping.executeUpdate("user_set_gamerate", bean, null, jcn);
						if (ret != 0) {
							bln = false;
							//throw new Exception("设置返点失败,设置vip返点彩种["+_gid+"]与返点["+_rate+"]失败");
						} else {
							if (bean.getBusiErrCode()!= 0) {
								bln = false ;
								//throw new Exception("设置返点失败,设置vip返点彩种["+_gid+"]与返点["+_rate+"]操作失败");
							}
						}
					}
				}
			}
			if (bln) {
				//执行普通用户更改代理
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("设置返点成功[" + bean.getUser_id() + "]");
			} else {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("设置返点失败[" + bean.getUser_id() + "]" );
				//logger.info("agentid=" + bean.getAgent() +" qagent="+ bean.getQagent() + " 设置返点失败[" + bean.getQagent() + "] " + errDesc);
			}
			
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("设置返点失败");
			logger.error("UserInfoBeanStub::setfandian ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 查询下级用户返点信息
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void checkfandian(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String userid=bean.getUser_id();//下级用户名
			String cagentid="";
			String isdaili="";
			String agentid="";
			String cparentid="";
			//代理用户
			JdbcRecordSet jrs = jcn.executeQuery("select cagentid,isdaili from tb_agent where cnickid=? and isdaili='1'", new Object[]{bean.getUid()});
			if(jrs == null || jrs.size() == 0){
				throw new Exception("失败,["+bean.getUid()+"]不是代理商");
			}else{
				jrs.first();
				cagentid = jrs.get("cagentid");
			}
			//下级用户信息
			jrs = jcn.executeQuery("select cagentid from tb_user where cnickid=?", new Object[]{userid});
			if(jrs == null || jrs.size() == 0){
				throw new Exception("失败,不存在用户["+userid+"]");
			}else{
				jrs.first();
				agentid = jrs.get("cagentid");
			}
			
			if(!agentid.equals(cagentid)){
				jrs = jcn.executeQuery("select cparentid,isdaili from tb_agent where cagentid=?", new Object[]{agentid});
				if(jrs == null || jrs.size() == 0){
					throw new Exception("失败,不存在代理["+agentid+"]");
				}else{
					jrs.first();
					cparentid = jrs.get("cparentid");
					isdaili = jrs.get("isdaili");
					if(!cagentid.equals(cparentid)){
						throw new Exception("失败,用户["+userid+"]不是["+cagentid+"]下用户");
					}
				}
			}else{//普通用户设置VIP记录
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("还是普通用户");
				return;
			}
			//输出信息
			jrs = jcn.executeQuery("select * from tb_agent_rate where cagentid=?", new Object[]{agentid});
			
			if (jrs != null && jrs.size() > 0) {
				String xml = "<rows isdl=\"" + isdaili + "\">";
				xml += jrs.toRawXmlString("row");
				xml += "</rows>";
				bean.setBusiXml(xml);
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("查询成功");
				jrs.clear();
				jrs = null;
			} else {
				bean.setBusiErrCode(3);
				bean.setBusiErrDesc("没有返点信息");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("查询下级用户返点信息异常");
			logger.error("UserInfoBeanStub::checkfandian ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	public void alipayNotify(UserBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			logger.info("user_id = " + bean.getUser_id() + "\tuid=" + bean.getUid());
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			int rs = JdbcSqlMapping.executeUpdate("u_alipaybind", bean, null, jcn);
			logger.info("useq = " + bean.getUseq());
			if (rs != 0) {
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("存储过程调用失败");
			}

			if (bean.getBusiErrCode() == 0) {
				List<String> list = AlipayUtil.getPushUrl(jcn, bean.getUseq(), bean.getUid(), bean.getUser_id(), 14, 1);
				bean.setBusiObject(list);
			}

		} catch (Exception e) {
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("发生错误:" + e.getMessage());
			logger.error("UserBeanStub::alipayNotify ", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

}
