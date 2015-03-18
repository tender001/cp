package com.caipiao.mob.user;

import com.caipiao.mob.bank.BankBean;

public class UserBean extends BankBean {
	private static final long serialVersionUID = -3379977954547146733L;
	protected String result = "";	//
	protected String comment = "";	// 建议内容
	protected String contact = "";	// 联系方式
	protected String push = "";		// 推送业务(,分割的业务)
	protected String id = "";		// 手机串号
	private int flag;
	private String newValue = "";
	private String backurl = "";
	private String stime = "";// 开始时间
	private String etime = "";// 结束时间
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getContact() {
		return contact;
	}
	public void setContact(String contact) {
		this.contact = contact;
	}
	public String getPush() {
		return push;
	}
	public void setPush(String push) {
		this.push = push;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getFlag() {
		return flag;
	}
	public void setFlag(int flag) {
		this.flag = flag;
	}
	public String getNewValue() {
		return newValue;
	}
	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}
	public String getBackurl() {
		return backurl;
	}
	public void setBackurl(String backurl) {
		this.backurl = backurl;
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
	
}
