package com.caipiao.game.cacher.util;

import java.util.List;
import com.util.comparable.ComparableBean;

public class ComparatorBean extends ComparableBean<ComparatorBean> {
	private int index;
	private Object obj;
	private int state;
	private double money ;
	private String gid;
	private int jindu;
	private List<String> values;
	
	public List<String> getValues() {
		return values;
	}

	public void setValues(List<String> values) {
		this.values = values;
	}

	public int getJindu() {
		return jindu;
	}

	public void setJindu(int jindu) {
		this.jindu = jindu;
	}

	public String getGid() {
		return gid;
	}

	public void setGid(String gid) {
		this.gid = gid;
	}

	public double getMoney() {
		return money;
	}

	public void setMoney(double money) {
		this.money = money;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public int getIndex() {
		return index;
	}
  
	public void setIndex(int index) {
		this.index = index;
	}

	public Object getObj() {
		return obj;
	}

	public void setObj(Object obj) {
		this.obj = obj;
	}
}
