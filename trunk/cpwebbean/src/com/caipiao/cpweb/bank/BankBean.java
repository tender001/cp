package com.caipiao.cpweb.bank;

import com.caipiao.cpweb.BaseBean;
import com.mina.rbc.util.StringUtil;

public class BankBean extends BaseBean {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3766487750012898865L;


	public static final int BANKBEAN_APPLYACCOUNTDEPOSITS = 1;// 申请订单号
	public static final int BANKBEAN_APPLYACCOUNTSUC = 2;
	public static final int BANKBEAN_TAKEMONEY = 3; // 提款

	public final static int BANK_KQ = 1;// 快钱
	public final static int BANK_CFT = 2;// 财付通
	public final static int BANK_ZFB = 3;// 支付宝
	public final static int BANK_BFB = 4;// 百付宝
	public final static int BANK_YB = 5;// 易宝手机充值卡充值
	public final static int BANK_DNA = 6;// 银联手机支付
	public final static int BANK_JT = 7;// 交通银行
	public final static int BANK_ZS = 8;// 招商银行
	public final static int BANK_19PAY = 9;// 19pay
	public final static int BANK_zfbkj = 10;// 支付宝快捷支付
	public final static int BANK_UMPAY = 11;// umpay支付
	public final static int BANK_LLPAY = 12;
	
	public final static int TK_YH = 0;// 提款到银行
	public final static int TK_ZFB = 1;// 提款到支付宝

	private String rid;
	private int flag;
	
	private int bankid; // 支付网关编号（1-快钱、2-财付通、3-支付宝 、4-百付宝、5-易宝充值卡充值、6-银联手机支付、7-交通银行、8-招商银行、9-19pay）
	private double addmoney = 0; // 充值金额

	private double handmoney = 0; // 手续费用
	private String applyid = ""; // 订单号 
	private String applydate = "";// 申请时间

	private String banktype = ""; // 充值通过的银行渠道   6.银行开户地址
	private String redirect = ""; // 跳转的URL
	private String contents = ""; // 输出的页面内容

	private String realName = "";//真实姓名
	private double tkMoney = 0;
	
	private String dealid="";//支付商号     6.身份证
	private String cardnum="";	//yb卡号    6.银行卡号
	private String cardpass="";	//yb密码     6.手机号码
	private int tkType=0; //提款方式
	
	private String payType = "";
	
	private String idCard = "";
	
	private String mobile = "";
	private String email = "";
	private String regDate = "";
	
	private String regdate = "";//用户注册时间，风控用

	public String getRid() {
		return rid;
	}
	public void setRid(String rid) {
		this.rid = rid;
	}
	public int getFlag() {
		return flag;
	}
	public void setFlag(int flag) {
		this.flag = flag;
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
	
	public String getDealid() {
		return dealid;
	}

	public void setDealid(String dealid) {
		this.dealid = dealid;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public double getTkMoney() {
		return tkMoney;
	}

	public void setTkMoney(double tkMoney) {
		this.tkMoney = tkMoney;
	}

	public int getBankid() {
		return bankid;
	}

	public void setBankid(int bankid) {
		this.bankid = bankid;
	}

	public double getAddmoney() {
		return addmoney;
	}

	public void setAddmoney(double addmoney) {
		this.addmoney = addmoney;
	}

	public double getHandmoney() {
		return handmoney;
	}

	public void setHandmoney(double handmoney) {
		this.handmoney = handmoney;
	}

	public String getApplyid() {
		return applyid;
	}

	public void setApplyid(String applyid) {
		this.applyid = applyid;
	}

	public String getApplydate() {
		return applydate;
	}

	public void setApplydate(String applydate) {
		this.applydate = applydate;
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

	public String getContents() {
		return contents;
	}

	public void setContents(String contents) {
		this.contents = contents;
	}
	
	public int getTkType() {
		return tkType;
	}
	public void setTkType(int tkType) {
		this.tkType = tkType;
	}
	public boolean validate(int flag) {
		switch (flag) {
		case BANKBEAN_APPLYACCOUNTDEPOSITS:
			return applyaccountdeposits();
		case BANKBEAN_APPLYACCOUNTSUC:
			return applyaccountsuc();
		case BANKBEAN_TAKEMONEY:
			return takemoney();
		default:
			return false;
		}
	}

	private boolean applyaccountdeposits() {
		if (getAddmoney() + getHandmoney() < 10) {
			this.setBusiErrCode(1);
			this.setBusiErrDesc("充值金额不能够小于10元");
			return false;
		}
		if (getBankid() != BANK_KQ && getBankid() != BANK_CFT && getBankid() != BANK_ZFB && getBankid() != BANK_BFB) {
			this.setBusiErrCode(2);
			this.setBusiErrDesc("不支持的充值方式:" + getBankid());
			return false;
		}
		return true;
	}

	private boolean applyaccountsuc() {
		// if (StringUtil.checkParameterIsEmpty(getPaycode())) {
		// this.setErrorInfo(-2,"订单号不能为空！");
		// return false;
		// }
		// if (StringUtil.checkParameterIsEmpty(getAbbtime())) {
		// this.setErrorInfo(-1,"参数错误，非法提交！");
		// return false;
		// }
		// if (getBankbackmoney()<1) {
		// this.setErrorInfo(-2,"充值金额出错！");
		// return false;
		// }
		// if (getBusisort()<1) {
		// this.setErrorInfo(-1, "参数错误，非法提交！");
		// return false;
		// }
		// if (getBusiNo()<1) {
		// this.setErrorInfo(-1,"参数错误，非法提交！");
		// return false;
		// }
		return true;
	}

	/**
	 * 账户提现申请
	 */
	private boolean takemoney() {
		// if (getTkMoney()<10) {
		// this.setErrorInfo(-2,"提款金额不能少于10元！");
		// return false;
		// }
		if (getTkType() != TK_YH && getTkType() != TK_ZFB) {
			this.setBusiErrCode(1);
			this.setBusiErrDesc("不支持的提款方式:" + getBankid());
			return false;
		}
		return true;
	}

	public int check(int flag) {
		int ret = 0;
		this.setBusiErrCode(0);

		if (StringUtil.isEmpty(getUid())) {// 检查参数用户名
			ret = 2000;
			this.setBusiErrCode(2);
			this.setBusiErrDesc("用户名不能为空");
		}

		switch (flag) {
		case BANK_KQ: {
			if (StringUtil.isEmpty(banktype)) {
				this.setBanktype("00");
			}
			break;
		}
		case BANK_CFT: {
			if (StringUtil.isEmpty(banktype)) {
				this.setBanktype("0");
			}			
			break;
		}
		case BANK_ZFB: {
			break;
		}		
		case BANK_BFB: {
			break;
		}
		case BANK_YB: {
			break;
		}
		case BANK_DNA: {
			break;
		}
		case BANK_JT:{
			break;
		}
		case BANK_ZS:{
			break;
		}
		case BANK_19PAY:{
			break;
		}
		case BANK_zfbkj:{
			break;
		}
		case BANK_UMPAY:{
			break;
		}
		case BANK_LLPAY:{
			break;
		}
		default: {
			ret = 2000;
			this.setBusiErrCode(1002);
			this.setBusiErrDesc("未知的检查类型");
			break;
		}
		}

		if (addmoney + handmoney < 0) {// 检查参数充值金额
			ret = 2000;
			this.setBusiErrCode(1);
			this.setBusiErrDesc("充值金额不能少于1元");
		}

		if (handmoney < 0 || handmoney >= addmoney) {// 检查手续费用
			ret = 2000;
			this.setBusiErrCode(2);
			this.setBusiErrDesc("手续费用不能够为负数且不可以大于充值金额" + handmoney + "-" + addmoney);
		}

		if (StringUtil.isEmpty(applyid)) {// 检查订单号
			ret = 2000;
			this.setBusiErrCode(3);
			this.setBusiErrDesc("订单号不能为空");
		}

		if (StringUtil.isEmpty(applydate)) {// 检查申请时间
			ret = 2000;
			this.setBusiErrCode(4);
			this.setBusiErrDesc("申请时间不能为空");
		}

		return ret;
	}
	public String getPayType() {
		return payType;
	}
	public void setPayType(String payType) {
		this.payType = payType;
	}
	public String getIdCard() {
		return idCard;
	}
	public void setIdCard(String idCard) {
		this.idCard = idCard;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regdate) {
		this.regDate = regdate;
	}
	public String getRegdate() {
		return regdate;
	}
	public void setRegdate(String regdate) {
		this.regdate = regdate;
	}

}
