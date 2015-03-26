package com.caipiao.cpweb.login;

import com.caipiao.cpweb.BaseBean;

public class AllyLogin extends BaseBean{

	/**
	 * 
	 */
	private static final long serialVersionUID = -2971763996099824662L;
	public static final int ALIPAY = 1;	//支付宝便捷登录
	public static final int QQ = 2;		//QQ登录 
	public static final int BF = 4;		//暴风登录 
	public static final int ZH = 5;		//智恒登录 
	public static final int NEW = 0;
	public static final int OLD = 1;

	//登录标识
	public static final int LOGIN_SUCCESS = 0;
	public static final int LOGIN_INVALID = 1;
	public static final int LOGIN_NOT_EXIST = 2;
	
	private int type;//联合登录类型
	private int isNew; // 0 新 1老
	private String yzm;
	private String mailAddr;
	private String mobileNo;
	private String host;
	private String memo;
	
	private String certNo; //身份证号码
	private String realName=""; //真实姓名
	private String referer; //来源
	private int ishuodong; //是否参与活动
	private int allyType; //合作网站用户类型
	private String returnInfo; //是否参与活动
	
	private String bankCode = "";//银行代码
	private String bankCard = "";//银行卡号
	private String bankName = "";//银行名称
	private String provid = "";//省份编号
	private String cityid = "";//地市编号
	
	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getIsNew() {
		return isNew;
	}

	public void setIsNew(int isNew) {
		this.isNew = isNew;
	}

	public String getYzm() {
		return yzm;
	}

	public void setYzm(String yzm) {
		this.yzm = yzm;
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

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getReferer() {
		return referer;
	}

	public void setReferer(String referer) {
		this.referer = referer;
	}

	public int getIshuodong() {
		return ishuodong;
	}

	public void setIshuodong(int ishuodong) {
		this.ishuodong = ishuodong;
	}

	public int getAllyType() {
		return allyType;
	}

	public void setAllyType(int allyType) {
		this.allyType = allyType;
	}

	public String getReturnInfo() {
		return returnInfo;
	}

	public void setReturnInfo(String returnInfo) {
		this.returnInfo = returnInfo;
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


	
	
}
