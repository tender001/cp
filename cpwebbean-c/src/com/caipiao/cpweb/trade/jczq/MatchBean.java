package com.caipiao.cpweb.trade.jczq;

import com.mina.rbc.util.xml.JXmlUtil;

public class MatchBean {

	private String expect;
	private int mid;
	private String mname;
	private String hn;
	private String gn;
	private String bt;
	private String et;
	private String fet;
	private String itemid;
	public String getItemid() {
		return itemid;
	}
	public void setItemid(String itemid) {
		this.itemid = itemid;
	}
	public String getFet() {
		return fet;
	}
	public void setFet(String fet) {
		this.fet = fet;
	}
	private int close;	
	private String b3;
	private String b1;
	private String b0;
	private String spv;
	
	public String getExpect() {
		return expect;
	}
	public void setExpect(String expect) {
		this.expect = expect;
	}
	public int getMid() {
		return mid;
	}
	public void setMid(int mid) {
		this.mid = mid;
	}
	public String getMname() {
		return mname;
	}
	public void setMname(String mname) {
		this.mname = mname;
	}
	public String getHn() {
		return hn;
	}
	public void setHn(String hn) {
		this.hn = hn;
	}
	public String getGn() {
		return gn;
	}
	public void setGn(String gn) {
		this.gn = gn;
	}
	public String getBt() {
		return bt;
	}
	public void setBt(String bt) {
		this.bt = bt;
	}
	public String getEt() {
		return et;
	}
	public void setEt(String et) {
		this.et = et;
	}
	public int getClose() {
		return close;
	}
	public void setClose(int close) {
		this.close = close;
	}
	public String getB3() {
		return b3;
	}
	public void setB3(String b3) {
		this.b3 = b3;
	}
	public String getB1() {
		return b1;
	}
	public void setB1(String b1) {
		this.b1 = b1;
	}
	public String getB0() {
		return b0;
	}
	public void setB0(String b0) {
		this.b0 = b0;
	}
	public String getSpv() {
		return spv;
	}
	public void setSpv(String spv) {
		this.spv = spv;
	}
	public String toXmlString(){
		StringBuffer sb = new StringBuffer();
		sb.append("<m ");
		sb.append(JXmlUtil.createAttrXml("itemid", "" + mid));
		sb.append(JXmlUtil.createAttrXml("hn", hn));
		sb.append(JXmlUtil.createAttrXml("gn", gn));
		sb.append(JXmlUtil.createAttrXml("bt", bt));
		sb.append(JXmlUtil.createAttrXml("et", et));
		sb.append(JXmlUtil.createAttrXml("lose", "" + close));
		sb.append(JXmlUtil.createAttrXml("mname", mname));
		sb.append(JXmlUtil.createAttrXml("sp", spv));
		sb.append("/>");
		return sb.toString();
	}
}
