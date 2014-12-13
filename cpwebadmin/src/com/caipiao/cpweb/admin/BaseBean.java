package com.caipiao.cpweb.admin;

import java.io.Serializable;

import com.mina.rbc.util.xml.JXmlUtil;

public class BaseBean implements Serializable {

	private static final long serialVersionUID = -1988769970401736836L;

	public final static String XML_HEAD = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
//	public final static String CONTENT_TYPE = "application/json; charset=UTF-8";
	public final static String CONTENT_TYPE = "text/xml; charset=utf-8";

	private String contentType = CONTENT_TYPE;
	protected int busiErrCode = -1;
	protected String busiErrDesc = "";
	private String busiXml = "";

	private String fid = "";// 调用功能号
	private String gid = "";// 游戏编号
	private String pid = "";// 期次编号
	private String uid = "";// 用户昵称

	private String ipAddr = "";

	private String yzm = "";

	private String pwd = "";
	private String comeFrom = "";// 来源
	private int source;// 投注来源

	private int tp = 0;// 总页数
	private int ps = 25;// 页面大小
	private int pn = 1;// 页码
	private int rc = 0;// 总记录数
	
	private String ds = "default";//数据源

	public String getDs() {
		return ds;
	}

	public void setDs(String ds) {
		this.ds = ds;
	}

	public String getPwd() {
		return pwd;
	}

	
	public void setPwd(String pwd) {
		this.pwd = pwd;
	}

	public String getYzm() {
		return yzm;
	}

	public void setYzm(String yzm) {
		this.yzm = yzm;
	}

	public int getTp() {
		return tp;
	}

	public void setTp(int tp) {
		this.tp = tp;
	}

	public int getPs() {
		return ps;
	}

	public void setPs(int ps) {
		this.ps = ps;
	}

	public int getPn() {
		return pn;
	}

	public void setPn(int pn) {
		this.pn = pn;
	}

	public int getRc() {
		return rc;
	}

	public void setRc(int rc) {
		this.rc = rc;
	}

	public String getIpAddr() {
		return ipAddr;
	}

	public void setIpAddr(String ipAddr) {
		this.ipAddr = ipAddr;
	}

	public String getFid() {
		return fid;
	}

	public void setFid(String fid) {
		this.fid = fid;
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

	public String getUid() {
		return uid;
	}

	public void setUid(String nid) {
		this.uid = nid;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public int getBusiErrCode() {
		return busiErrCode;
	}

	public void setBusiErrCode(int busiErrCode) {
		this.busiErrCode = busiErrCode;
	}

	public String getBusiErrDesc() {
		return busiErrDesc;
	}

	public void setBusiErrDesc(String busiErrDesc) {
		this.busiErrDesc = busiErrDesc;
	}

	public String getBusiXml() {
		return busiXml;
	}

	public void setBusiXml(String busiXml) {
		this.busiXml = busiXml;
	}

	public String getComeFrom() {
		return comeFrom;
	}

	public void setComeFrom(String comeFrom) {
		this.comeFrom = comeFrom;
	}

	public int getSource() {
		return source;
	}

	public void setSource(int source) {
		this.source = source;
	}

	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append(XML_HEAD);
		sb.append("<Resp ");
		sb.append(JXmlUtil.createAttrXml("code", busiErrCode + ""));
		sb.append(JXmlUtil.createAttrXml("desc", busiErrDesc));
		sb.append(">").append(busiXml).append("</Resp>");
		String s = sb.toString();
		return s;
	}
}
