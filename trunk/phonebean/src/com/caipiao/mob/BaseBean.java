package com.caipiao.mob;

import java.io.Serializable;

import org.json.JSONObject;

import com.caipiao.mob.util.GameUtil;
import com.util.string.StringUtil;

public class BaseBean implements Serializable {

	public final static String CONTENT_TYPE = "application/json; charset=UTF-8";
	private String contentType = CONTENT_TYPE;

	private static final long serialVersionUID = 858027283840484984L;

	private String status = ""; // 响应编码
	private String message = ""; // 响应说明

	private String sessionid = "";
	private int source;
	private String type = ""; // 彩种
	private String lotteryType = ""; // 彩种
	private String term = ""; // 期号
	private String user = ""; // 用户名
	private String password = ""; // 密码
	private int version = 0; // 版本号
	private String email = ""; // 电子邮局
	private String channel = ""; // 代理渠道
	private double balance = 0; // 余额
	private double money = -1; // 金额
	private int page = 1; // 页码
	private int count = 0; // 总记录数
	private int offset = 0; // 偏移
	private String planNo = ""; // 方案号
	private String json = "{}";
	private String zid = "";
	private String codes = "";
	private int pagesize = 10;
	
	public String getSessionid() {
		return sessionid;
	}
	public void setSessionid(String sessionid) {
		this.sessionid = sessionid;
	}
	public String getCodes() {
		return codes;
	}
	public void setCodes(String codes) {
		this.codes = codes;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getZid() {
		return zid;
	}

	public void setZid(String zid) {
		this.zid = zid;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getSource() {
		return source;
	}

	public void setSource(int source) {
		this.source = source;
	}

	public String getType() {
		if(StringUtil.isEmpty(getLotteryType())){
			return this.type;
		}
		return getLotteryType();
	}

	public String get159Type() {
		String type = getType();
		if(GameUtil.isSZC(this.getType()) || GameUtil.isZC(this.getType())){
			type = GameUtil.getGameID(this.getType());
		} else if(GameUtil.isBD(this.getType())){
			if(!StringUtil.isEmpty(codes)){
				if(codes.indexOf("SPF") != -1){
					type = GameUtil.GameContains.BD_SPF;
				} else if(codes.indexOf("CBF") != -1){
					type = GameUtil.GameContains.BD_CBF;
				}  else if(codes.indexOf("BQC") != -1){
					type = GameUtil.GameContains.BD_BQC;
				}  else if(codes.indexOf("SXP") != -1){
					type = GameUtil.GameContains.BD_SXP;
				}  else if(codes.indexOf("JQS") != -1){
					type = GameUtil.GameContains.BD_JQS;
				} 
			}else {
				type = GameUtil.GameContains.BD_SPF;
			}
		} else if(GameUtil.isJCZQ(this.getType())){
			if(!StringUtil.isEmpty(codes)){
				if(codes.indexOf("HH") != -1){
					type = GameUtil.GameContains.JCZQ_HH;
				}  else if(codes.indexOf("CBF") != -1){
					type = GameUtil.GameContains.JCZQ_CBF;
				}  else if(codes.indexOf("BQC") != -1){
					type = GameUtil.GameContains.JCZQ_BQC;
				}  else if(codes.indexOf("JQS") != -1){
					type = GameUtil.GameContains.JCZQ_JQS;
				} else if(codes.indexOf("RQSPF") != -1){//老版使用
					type = GameUtil.GameContains.JCZQ_RQSPF;
				}else if(codes.indexOf("RSPF") != -1){//新版
					type = GameUtil.GameContains.JCZQ_RQSPF;
				}  else if(codes.indexOf("SPF") != -1){
					type = GameUtil.GameContains.JCZQ_SPF;
				}
			}
		} else if(GameUtil.isJCLQ(this.getType())){
			if(!StringUtil.isEmpty(codes)){
				if(codes.indexOf("HH") != -1){
					type = GameUtil.GameContains.JCLQ_HH;
				}  else if(codes.indexOf("RFSF") != -1){
					type = GameUtil.GameContains.JCLQ_RFSF;
				}  else if(codes.indexOf("DXF") != -1){
					type = GameUtil.GameContains.JCLQ_DXF;
				}  else if(codes.indexOf("SFC") != -1){
					type = GameUtil.GameContains.JCLQ_SFC;
				}  else if(codes.indexOf("SF") != -1){
					type = GameUtil.GameContains.JCLQ_SF;
				}
			}
		} else if(GameUtil.isGYJ(this.getType())){
			if(!StringUtil.isEmpty(codes)){
				if(codes.indexOf("GYJ|") != -1){
					type = GameUtil.GameContains.GYJ_GYJ;
				} else {
					type = GameUtil.GameContains.GYJ_GJ;
				}
			}
		}
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getLotteryType() {
		return lotteryType;
	}
	public void setLotteryType(String lotteryType) {
		this.lotteryType = lotteryType;
	}
	public String getTerm() {
		return term;
	}

	public void setTerm(String term) {
		this.term = term;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public int getOffset() {
		return offset;
	}

	public void setOffset(int offset) {
		this.offset = offset;
	}

	public String getPlanNo() {
		return planNo;
	}

	public void setPlanNo(String planNo) {
		this.planNo = planNo;
	}

	public void setErrJson(String status, String message) {
		try {
			this.status = status;
			this.message = message;
			JSONObject obj = new JSONObject();
			obj.put("status", status);
			obj.put("message", message);
			this.json = obj.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void setJson(String json) {
		this.json = json;
	}
	public String getJson() {
		return json;
	}
	
	public void setBalanceJson(String status, double ibalance) {
		try {
			this.status = status;
			JSONObject obj = new JSONObject();
			obj.put("status", status);
			obj.put("balance", ibalance);
			this.json = obj.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String toString() {
		//System.out.println("BaseBean::json=" + this.json);
		return this.json;
	}
	public int getPagesize() {
		return pagesize;
	}
	public void setPagesize(int pagesize) {
		this.pagesize = pagesize;
	}
}
