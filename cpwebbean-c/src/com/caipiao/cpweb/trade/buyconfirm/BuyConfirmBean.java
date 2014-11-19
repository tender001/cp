package com.caipiao.cpweb.trade.buyconfirm;

import com.caipiao.cpweb.BaseBean;


public class BuyConfirmBean extends BaseBean  {

	private static final long serialVersionUID = 3392034784220657406L;

	private String gid="";   //彩种
	private String pid="";  //期次
	private String codes="";   //投注号码
	private String dtcodes=""; //胆托号码
	private String zhushu="";  //注数
	private String totalmoney="";  //方案金额
	private String  playid=""; 
	private int multiple=0;  //倍数
	private int isdt=0;
	private String projid;
	
	private String wtype = "";
	private String wtype2 = "";
	private int price;
	

	
	
	public String getProjid() {
		return projid;
	}
	public void setProjid(String projid) {
		this.projid = projid;
	}
	public int getPrice() {
		return price;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public String getWtype2() {
		return wtype2;
	}
	public void setWtype2(String wtype2) {
		this.wtype2 = wtype2;
	}
	public String getWtype() {
		return wtype;
	}
	public void setWtype(String wtype) {
		this.wtype = wtype;
	}
	public String getPlayid() {
		return playid;
	}
	public void setPlayid(String playid) {
		this.playid = playid;
	}
	public String getGid() {
		return gid;
	}
	public void setGid(String gid) {
		this.gid = gid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getCodes() {
		return codes;
	}
	public void setCodes(String codes) {
		this.codes = codes;
	}
	
	public String getDtcodes() {
		return dtcodes;
	}
	public void setDtcodes(String dtcodes) {
		this.dtcodes = dtcodes;
	}
	public String getZhushu() {
		return zhushu;
	}
	public void setZhushu(String zhushu) {
		this.zhushu = zhushu;
	}
	public String getTotalmoney() {
		return totalmoney;
	}
	public void setTotalmoney(String totalmoney) {
		this.totalmoney = totalmoney;
	}
	public int getMultiple() {
		return multiple;
	}
	public void setMultiple(int multiple) {
		this.multiple = multiple;
	}
	public int getIsdt() {
		return isdt;
	}
	public void setIsdt(int isdt) {
		this.isdt = isdt;
	}

	
}
