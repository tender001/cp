package com.caipiao.cpweb.user;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.caipiao.cpweb.BaseBean;
import com.caipiao.cpweb.ErrCode;
import com.caipiao.cpweb.util.UserCheckUtil;
import com.util.string.StringUtil;

public class UserBean extends BaseBean {

	private static final long serialVersionUID = 9156030088079730021L;

	public final static int CHECK_LOGIN = 0x01;
	public final static int CHECK_REGISTER = CHECK_LOGIN + 1;
	private String realName = "";//真实姓名
	private String idCardNo = "";//身份证号码
	private String stime = "";// 开始时间
	private String etime = "";// 结束时间
	private String qtype="";//查询参数
	private String tid = "";
	private int gender ;//性别
	private String mailAddr = "";
	private String mobileNo = "";
	private String provid = "";//省份编号
	private String cityid = "";//地市编号
	private String imNo = "";//即时通信号码
	private String upwd ="";//用户登录后输入的密码	
	private String rid = "";//问题编号
	private String aid = "";//问题编号
	private String bankCode = "";//银行代码
	private String bankCard = "";//银行卡号
	private String bankName = "";//银行名称
	private String owner = "";//发起人
	private int flag;
	private String backurl;
	private String newValue = "";
	private double money;
	private int min = 0;
	private int max = 0;
	private int limit = 0;
	private String user_id = ""; //支付宝用户id
	
	public String getUser_id() {
		return user_id;
	}
	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}
	public int getMin() {
		return min;
	}
	public void setMin(int min) {
		this.min = min;
	}
	public int getMax() {
		return max;
	}
	public void setMax(int max) {
		this.max = max;
	}
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public String getBackurl() {
		return backurl;
	}

	public void setBackurl(String backurl) {
		this.backurl = backurl;
	}

	public String getNewValue() {
		return newValue;
	}

	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}

	public int getFlag() {
		return flag;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	public String getMailAddr() {
		return mailAddr;
	}

	public void setMailAddr(String mailAddr) {
		this.mailAddr = mailAddr;
	}

	public String getMobileNo() {
		return mobileNo;
	}

	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}

	public String getStime() {
		return stime;
	}

	public void setStime(String stime) {
		this.stime = stime;
	}

	public String getEtime() {
		return etime;
	}

	public void setEtime(String etime) {
		this.etime = etime;
	}

	public String getQtype() {
		return qtype;
	}

	public void setQtype(String qtype) {
		this.qtype = qtype;
	}

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getIdCardNo() {
		return idCardNo;
	}

	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}

	public int getGender() {
		return gender;
	}

	public void setGender(int gender) {
		this.gender = gender;
	}

	public String getProvid() {
		return provid;
	}

	public void setProvid(String provid) {
		this.provid = provid;
	}

	public String getCityid() {
		return cityid;
	}

	public void setCityid(String cityid) {
		this.cityid = cityid;
	}

	public String getImNo() {
		return imNo;
	}

	public void setImNo(String imNo) {
		this.imNo = imNo;
	}

	public String getUpwd() {
		return upwd;
	}

	public void setUpwd(String upwd) {
		this.upwd = upwd;
	}

	public String getRid() {
		return rid;
	}

	public void setRid(String rid) {
		this.rid = rid;
	}

	public String getAid() {
		return aid;
	}

	public void setAid(String aid) {
		this.aid = aid;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getBankCard() {
		return bankCard;
	}

	public void setBankCard(String bankCard) {
		this.bankCard = bankCard;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public int check(String fid) {
		setBusiErrCode(0);
		setBusiErrDesc("成功");

		if (fid.equalsIgnoreCase("u_login")) {

		} else if (fid.equalsIgnoreCase("u_register")) {
			if (!UserCheckUtil.CheckUserName(getUid())) {
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("用户名格式不正确");
			}
			if (!UserCheckUtil.isNullString(mailAddr) && !UserCheckUtil.isEmail(mailAddr)) {
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("电子邮件格式不正确");
			}
			if (!UserCheckUtil.isNullString(mobileNo) && !UserCheckUtil.isMobilephone(mobileNo)) {
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("手机号码格式不正确");
			}
			/*
			if(getNumLen(getUid())>=7){
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("用户名中最多含6位连续数字");
			}
			*/
		}else if (fid.equalsIgnoreCase("u_check_user")){
			if (!UserCheckUtil.CheckUserName(getUid())) {
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("用户名格式不正确");
			}
			/*
			if(getNumLen(getUid())>=7){
				setBusiErrCode(ErrCode.ERR_CHECK);
				setBusiErrDesc("最多含6位连续数字");
			}
			*/
		}
		return 0;
	}
	
	private int getNumLen(String str){
		int len = 0;
		if(StringUtil.isNotEmpty(str)){
			Pattern pattern = Pattern.compile("[0-9]");
			Matcher matcher = pattern.matcher(str);
			while(matcher.find()){
				len++;
			}
		}
		return len;
	}
}
