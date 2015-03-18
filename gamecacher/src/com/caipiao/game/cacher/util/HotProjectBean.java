package com.caipiao.game.cacher.util;

import com.mina.rbc.util.xml.JXmlUtil;
import com.util.comparable.ComparableBean;

public class HotProjectBean extends ComparableBean<HotProjectBean> {

	private String gameID;
	private String periodID;
	private String projID;
	private String nickID;
	private String play;
	private int money ;
	private int nums ;
	private int lnum ;
	private int pnum ;
	private int aunum ;
	private int agnum ;
	private int upload ;
	private int open ;
	private int wrate;
	private int state ;
	private int order ;
	private int jindu ;
	private long saleState;

	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public int getWrate() {
		return wrate;
	}
	public void setWrate(int wrate) {
		this.wrate = wrate;
	}
	public int getOpen() {
		return open;
	}
	public void setOpen(int open) {
		this.open = open;
	}
	public int getUpload() {
		return upload;
	}
	public void setUpload(int upload) {
		this.upload = upload;
	}
	public String getGameID() {
		return gameID;
	}
	public void setGameID(String gameID) {
		this.gameID = gameID;
	}
	public String getPeriodID() {
		return periodID;
	}
	public void setPeriodID(String periodID) {
		this.periodID = periodID;
	}
	public String getProjID() {
		return projID;
	}
	public void setProjID(String projID) {
		this.projID = projID;
	}
	public String getNickID() {
		return nickID;
	}
	public void setNickID(String nickID) {
		this.nickID = nickID;
	}
	public String getPlay() {
		return play;
	}
	public void setPlay(String play) {
		this.play = play;
	}
	public int getMoney() {
		return money;
	}
	public void setMoney(int money) {
		this.money = money;
	}
	public int getNums() {
		return nums;
	}
	public void setNums(int nums) {
		this.nums = nums;
	}
	public int getLnum() {
		return lnum;
	}
	public void setLnum(int lnum) {
		this.lnum = lnum;
	}
	public int getPnum() {
		return pnum;
	}
	public void setPnum(int pnum) {
		this.pnum = pnum;
	}
	public int getAunum() {
		return aunum;
	}
	public void setAunum(int aunum) {
		this.aunum = aunum;
	}
	public int getAgnum() {
		return agnum;
	}
	public void setAgnum(int agnum) {
		this.agnum = agnum;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	public int getJindu() {
		return jindu;
	}
	public void setJindu(int jindu) {
		this.jindu = jindu;
	}

	public long getSaleState() {
		return saleState;
	}
	public void setSaleState(long saleState) {
		this.saleState = saleState;
	}
	
//	public int compareTo(HotProjectBean cb) {
//		if ( this.getJindu() > cb.getJindu() ) {
//			return -1;
//		} else if ( this.getJindu() == cb.getJindu() ) {
//			if ( this.getMoney() > cb.getMoney() ) {
//				return -1;
//			} else if ( this.getMoney() == cb.getMoney() ) {
//				return 0;
//			} else {
//				return 1;
//			}
//			
//		} else {
//			return 1;
//		}
//	}
	
	public String toXmlString() {
//		<row gid="01" pid="2011132" hid="01102017231" nickid="qscgu5188" play="1" money="14" nums="14" lnum="3" 
//		pnum="5" aunum="0" agnum="0" iorder="0" jindu="78" />
		
		String pid = periodID;
		if ( periodID.equalsIgnoreCase("JC_PERIOD") ) {
			pid = "";
		}
		
		
		StringBuffer sb = new StringBuffer();
		sb.append("<row ").append(JXmlUtil.createAttrXml("gid", gameID));
		sb.append(JXmlUtil.createAttrXml("pid", pid)).append(JXmlUtil.createAttrXml("hid", projID));
		sb.append(JXmlUtil.createAttrXml("nickid", CacheUtil.isHiddenUser(nickID)));
		sb.append(JXmlUtil.createAttrXml("play", play));

		sb.append(JXmlUtil.createAttrXml("sale", saleState+""));
		
		sb.append(JXmlUtil.createAttrXml("money", money+"")).append(JXmlUtil.createAttrXml("nums", nums+""));
		sb.append(JXmlUtil.createAttrXml("lnum", lnum+"")).append(JXmlUtil.createAttrXml("pnum", pnum+""));
		sb.append(JXmlUtil.createAttrXml("aunum", aunum+"")).append(JXmlUtil.createAttrXml("agnum", agnum+""));
		sb.append(JXmlUtil.createAttrXml("iorder", order+"")).append(JXmlUtil.createAttrXml("jindu", jindu+""));
		sb.append(JXmlUtil.createAttrXml("state", state+"")).append(JXmlUtil.createAttrXml("upload", upload+""));
		sb.append(JXmlUtil.createAttrXml("open", open+"")).append(JXmlUtil.createAttrXml("wrate", wrate+""));
		
		sb.append("/>");
		return sb.toString();
	}
}
