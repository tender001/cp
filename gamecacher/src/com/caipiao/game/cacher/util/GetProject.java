package com.caipiao.game.cacher.util;

import com.mina.rbc.util.StringUtil;

public class GetProject  {

	private int pageNo = 1;
	private int pageSize = 25;
	private int play;
	private String gid;
	private String pid;
	private String sort = "";
	private String sortending = "";
	private String find = "";
	private int state = 0;//0 查全部 1 满员 2 撤单 
	
	private String nickID ;//登录的用户编号
	private long cacheTime;
	private String cacheData;
	
	public String getCacheData() {
		return cacheData;
	}
	public void setCacheData(String cacheData) {
		this.cacheTime = System.currentTimeMillis();
		this.cacheData = cacheData;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public long getCacheTime() {
		return cacheTime;
	}
	public void setCacheTime(long cacheTime) {
		this.cacheTime = cacheTime;
	}
	public String getNickID() {
		return nickID;
	}
	public void setNickID(String nickID) {
		this.nickID = nickID;
	}
	public int getPageNo() {
		return pageNo;
	}
	public void setPageNo(int pageNo) {
		if ( pageNo <= 0 ) {
			this.pageNo = 1;
		} else {
			this.pageNo = pageNo;
		}
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		if ( pageSize <= 0 ) {
			this.pageSize = 25;
		} else {
			this.pageSize = pageSize;
		}
	}
	public int getPlay() {
		return play;
	}
	public void setPlay(int play) {
		this.play = play;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getFind() {
		return find;
	}
	public void setFind(String find) {
		this.find = find;
	}
	public String getSortending() {
		return sortending;
	}
	public void setSortending(String sortending) {
		this.sortending = sortending;
	}

	public String getGid() {
		return gid;
	}
	public void setGid(String gid) {
		this.gid = gid;
	}
	public String toSubKey() {
		if(StringUtil.isEmpty(find)){
			return gid + "_" + pid + "_" + state + "_" + sort + "_" + sortending + "_" + pageNo;
		}
		return null;
	}
	public boolean expired(){
		if(System.currentTimeMillis() > cacheTime + 10 * 1000){
			return true;
		}
		return false;
	}
	
//	public String toPageKey() {
//		return play + "_" + state + "_" + sort + "_" + sortending + "_" + pageNo;
//	}
}
