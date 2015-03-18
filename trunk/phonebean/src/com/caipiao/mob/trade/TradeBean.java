package com.caipiao.mob.trade;

import com.caipiao.mob.BaseBean;

public class TradeBean extends BaseBean {
	private static final long serialVersionUID = 1719400230472560142L;
	private String hemaino;
	private int part;
	private String playtype;
	private int addtional = 0;
	private String from;
	private int multiple;
	private String multiplies;
	private String periodids;
	private int oneMoney;
	private int chaseMoney;
	private int num;
	private int autocancel;
	private int cancelmoney;
	private String codesWith159="";
	private String endTime = "";
	private String name = "";// 方案名称
	private String desc = "";// 方案描叙
	private String comeFrom = "";// 方案来源 空
	private int projectType;// 方案类型(0代购 1合买)
	private int dfPlayType;// 玩法 0单 1复
	private int tnum;// 总份数
	private int bnum;// 认购份数
	private int pnum;// 保底份数
	private int wrate;// 中奖提成比率
	private int oflag;// 公开标志
	private int fflag;// 文件标志（0 是号码 1 是文件）
	public String getMultiplies() {
		return multiplies;
	}
	public void setMultiplies(String multiplies) {
		this.multiplies = multiplies;
	}
	public String getPeriodids() {
		return periodids;
	}
	public void setPeriodids(String periodids) {
		this.periodids = periodids;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getHemaino() {
		return hemaino;
	}
	public void setHemaino(String hemaino) {
		this.hemaino = hemaino;
	}
	public int getPart() {
		return part;
	}
	public void setPart(int part) {
		this.part = part;
	}
	public String getPlaytype() {
		return playtype;
	}
	public void setPlaytype(String playtype) {
		this.playtype = playtype;
	}
	public int getAddtional() {
		return addtional;
	}
	public void setAddtional(int addtional) {
		this.addtional = addtional;
	}
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public int getMultiple() {
		return multiple;
	}
	public void setMultiple(int multiple) {
		this.multiple = multiple;
	}
	public int getOneMoney() {
		return oneMoney;
	}
	public void setOneMoney(int oneMoney) {
		this.oneMoney = oneMoney;
	}
	public int getChaseMoney() {
		return chaseMoney;
	}
	public void setChaseMoney(int chaseMoney) {
		this.chaseMoney = chaseMoney;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public String getCodesWith159() {
		return codesWith159;
	}
	public void setCodesWith159(String codesWith159) {
		this.codesWith159 = codesWith159;
	}
	public int getAutocancel() {
		return autocancel;
	}
	public void setAutocancel(int autocancel) {
		this.autocancel = autocancel;
	}
	public int getCancelmoney() {
		return cancelmoney;
	}
	public void setCancelmoney(int cancelmoney) {
		this.cancelmoney = cancelmoney;
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
	public int getProjectType() {
		return projectType;
	}
	public void setProjectType(int projectType) {
		this.projectType = projectType;
	}
	
	public int getDfPlayType() {
		return dfPlayType;
	}
	public void setDfPlayType(int dfPlayType) {
		this.dfPlayType = dfPlayType;
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
	public int getFflag() {
		return fflag;
	}
	public void setFflag(int fflag) {
		this.fflag = fflag;
	}
	public String getComeFrom() {
		return comeFrom;
	}
	public void setComeFrom(String comeFrom) {
		this.comeFrom = comeFrom;
	}
	
}
