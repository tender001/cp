package com.caipiao.mob.bank;

import com.caipiao.mob.BaseBean;

public class BankBean extends BaseBean {
	private static final long serialVersionUID = 155817084855006361L;
	
	public final static int BANK_ZFB = 3;// 支付宝
	public final static int BANK_19PAY = 9;// 19pay
	public final static int BANK_UMPAY = 11;// umpay支付
	public final static int BANK_LLPAY = 12;//连连支付
	
	protected int bank = -1;		// 银行编码
	protected String subbranch = "";// 支行名称
	protected String bankNumber = "";	//银行卡号
	protected String ordernumber = "";	//充值编号
	private String applydate = "";// 申请时间
	protected int bankID = -1;	//充值渠道编号
	protected double moneyRate = 0; //充值手续费
	protected String name = "";		// 真实姓名
	protected String idno = "";		// 身份证号码
	protected String province = "";	// 省份
	protected String city = "";		// 城市
	protected String phone = "";	// 手机号码
	protected String vphone = "";	// 手机验证码
	protected double addMoney = 0.00D;
	protected String dealid="";
	protected String cardnum=""; //充值卡卡号码的暗码
	protected String cardpass=""; //充值卡密码的暗码
	private String payType = "";
	private String banktype = ""; // 充值通过的银行渠道   6.银行开户地址
	private String redirect = ""; // 跳转的URL
	
	public String getDealid() {
		return dealid;
	}
	public void setDealid(String dealid) {
		this.dealid = dealid;
	}
	public double getAddMoney() {
		return addMoney;
	}
	public void setAddMoney(double addMoney) {
		this.addMoney = addMoney;
	}
	
	public int getBank() {
		return bank;
	}
	public void setBank(int bank) {
		this.bank = bank;
	}
	public String getSubbranch() {
		return subbranch;
	}
	public void setSubbranch(String subbranch) {
		this.subbranch = subbranch;
	}
	public String getBankNumber() {
		return bankNumber;
	}
	public void setBankNumber(String bankNumber) {
		this.bankNumber = bankNumber;
	}
	public String getOrdernumber() {
		return ordernumber;
	}
	public void setOrdernumber(String ordernumber) {
		this.ordernumber = ordernumber;
	}
	public int getBankID() {
		return bankID;
	}
	public void setBankID(int bankID) {
		this.bankID = bankID;
	}
	public double getMoneyRate() {
		return moneyRate;
	}
	public void setMoneyRate(double moneyRate) {
		this.moneyRate = moneyRate;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getIdno() {
		return idno;
	}
	public void setIdno(String idno) {
		this.idno = idno;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getVphone() {
		return vphone;
	}
	public void setVphone(String vphone) {
		this.vphone = vphone;
	}
	public String getProvince() {
		return province;
	}
	public void setProvince(String province) {
		this.province = province;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCardnum() {
		return cardnum;
	}
	public void setCardnum(String cardnum) {
		this.cardnum = cardnum;
	}
	public String getCardpass() {
		return cardpass;
	}
	public void setCardpass(String cardpass) {
		this.cardpass = cardpass;
	}

	public String getApplydate() {
		return applydate;
	}

	public void setApplydate(String applydate) {
		this.applydate = applydate;
	}
	public String getPayType() {
		return payType;
	}
	public void setPayType(String payType) {
		this.payType = payType;
	}
	public String getBanktype() {
		return banktype;
	}
	public void setBanktype(String banktype) {
		this.banktype = banktype;
	}
	public String getRedirect() {
		return redirect;
	}
	public void setRedirect(String redirect) {
		this.redirect = redirect;
	}
	
}
