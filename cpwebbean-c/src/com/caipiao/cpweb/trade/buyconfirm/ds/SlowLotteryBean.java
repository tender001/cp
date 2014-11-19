package com.caipiao.cpweb.trade.buyconfirm.ds;

import com.caipiao.cpweb.BaseBean;

public class SlowLotteryBean extends BaseBean{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2831420015086566991L;
	
	private String balance = "" ;//用户余额
	
	private String gid = "";//游戏编号
	private String pid = "";//期次编号
	private int play;//玩法
	private String codes = "";//投注号码（文件投注的文件名）
	
	private String name = "";//方案名称
	private String desc = "";//方案描叙
	private int type ;//方案类型(0代购 1合买)
	
	private int tnum ;//总份数
	private int bnum ;//认购份数
	private int pnum ;//保底份数
	private int muli ;//投注倍数
	
	private int money ;//方案总金额
	private int wrate ;//中奖提成比率
	private int oflag ;//公开标志
	private int fflag ;//文件标志（0 是号码 1 是文件）
	private int zflag ;//追号标志
	
	private String hid = "";//合买编号
	private String bid = "";//认购编号
	private String zid = "";//追号编号
	private String did = "";//明细编号
	
	private Integer price = 2;//单注金额
	
	private String wtype = ""; //投注类型 pt/dt/sc
	private String wtype2 = "";
	
	private String rand;//
	
	private int ishsc;
	
	//方案列表的参数
	private int pn = 1;//页码
	private int ps = 25;//页面大小
	private int tp = 0;//总页数
	private int rc = 0;//总记录数
	private int state = 0;//查询类型
	private String find = "";//查询字符串
	private String fsort = "";//排序字段
	private String dsort = "";//排序方向
	
	private int emoney ;//每注金额(大乐透 有3元 其他为两元)
	private String endTime = "";//方按截止时间

	private String mulitys = "";//追号倍数列表
	
	public int getIshsc() {
		return ishsc;
	}
	public void setIshsc(int ishsc) {
		this.ishsc = ishsc;
	}
	public Integer getPrice() {
		return price;
	}
	public void setPrice(Integer price) {
		this.price = price;
	}
	public String getRand() {
		return rand;
	}
	public void setRand(String rand) {
		this.rand = rand;
	}
	public String getMulitys() {
		return mulitys;
	}
	public void setMulitys(String mulitys) {
		this.mulitys = mulitys;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}	
	public int getPn() {
		return pn;
	}
	public void setPn(int pn) {
		this.pn = pn;
	}
	public int getPs() {
		return ps;
	}
	public void setPs(int ps) {
		this.ps = ps;
	}
	public String getFind() {
		return find;
	}
	public void setFind(String find) {
		this.find = find;
	}
	public String getFsort() {
		return fsort;
	}
	public void setFsort(String fsort) {
		this.fsort = fsort;
	}
	public String getDsort() {
		return dsort;
	}
	public void setDsort(String dsort) {
		this.dsort = dsort;
	}
	public int getTp() {
		return tp;
	}
	public void setTp(int tp) {
		this.tp = tp;
	}
	public int getRc() {
		return rc;
	}
	public void setRc(int rc) {
		this.rc = rc;
	}


	
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public int getEmoney() {
		return emoney;
	}
	public void setEmoney(int emoney) {
		this.emoney = emoney;
	}
	public int getMuli() {
		return muli;
	}
	public void setMuli(int muli) {
		this.muli = muli;
	}
	public int getZflag() {
		return zflag;
	}
	public void setZflag(int zflag) {
		this.zflag = zflag;
	}
	public String getHid() {
		return hid;
	}
	public void setHid(String hid) {
		this.hid = hid;
	}
	public String getBid() {
		return bid;
	}
	public void setBid(String bid) {
		this.bid = bid;
	}
	public String getZid() {
		return zid;
	}
	public void setZid(String zid) {
		this.zid = zid;
	}
	public String getDid() {
		return did;
	}
	public void setDid(String did) {
		this.did = did;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public int getFflag() {
		return fflag;
	}
	public void setFflag(int fflag) {
		this.fflag = fflag;
	}
	public int getMoney() {
		return money;
	}
	public void setMoney(int money) {
		this.money = money;
	}
	public int getWrate() {
		return wrate;
	}
	public void setWrate(int wrate) {
		this.wrate = wrate;
	}
	public int getOflag() {
		return oflag;
	}
	public void setOflag(int oflag) {
		this.oflag = oflag;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public int getTnum() {
		return tnum;
	}
	public void setTnum(int tnum) {
		this.tnum = tnum;
	}
	public int getBnum() {
		return bnum;
	}
	public void setBnum(int bnum) {
		this.bnum = bnum;
	}
	public int getPnum() {
		return pnum;
	}
	public void setPnum(int pnum) {
		this.pnum = pnum;
	}
	public int getPlay() {
		return play;
	}
	public void setPlay(int play) {
		this.play = play;
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
	public String getWtype() {
		return wtype;
	}
	public void setWtype(String wtype) {
		this.wtype = wtype;
	}
	public String getWtype2() {
		return wtype2;
	}
	public void setWtype2(String wtype2) {
		this.wtype2 = wtype2;
	}
}
