package com.caipiao.cpweb.code;

public class CodeBean {
	public static final int NOITEM = 0;
	public static final int HAVEITEM = 1;
	private int lottype;
	private String code;
	private String playtype;
	private String guoguan;
	private String teamitems;
	private String codeitems;
	private int itemType;
	public int getLottype() {
		return lottype;
	}
	public void setLottype(int lottype) {
		this.lottype = lottype;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code){
		this.code = code;
	}
	public String getPlaytype() {
		return playtype;
	}
	public void setPlaytype(String playtype) {
		this.playtype = playtype;
	}
	public String getGuoguan() {
		return guoguan;
	}
	public void setGuoguan(String guoguan) {
		this.guoguan = guoguan;
	}
	public String getTeamitems() {
		return teamitems;
	}
	public void setTeamitems(String _teamitems){
		this.teamitems = _teamitems;
	}
	public String getCodeitems() {
		return codeitems;
	}
	public void setCodeitems(String _codeitems){
		this.codeitems = _codeitems;
	}
	public int getItemType() {
		return itemType;
	}
	public void setItemType(int itemType) {
		this.itemType = itemType;
	}
	
}
