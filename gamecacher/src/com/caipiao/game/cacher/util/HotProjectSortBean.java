package com.caipiao.game.cacher.util;

import com.util.comparable.ComparableBean;

public class HotProjectSortBean extends ComparableBean<HotProjectSortBean> {
	private int index;
	private double rprocess;
	private int order;
	private double tprocess;
	private int money;
	private int process;
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public double getRprocess() {
		return rprocess;
	}
	public void setRprocess(double rprocess) {
		this.rprocess = rprocess;
	}
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	public double getTprocess() {
		return tprocess;
	}
	public void setTprocess(double tprocess) {
		this.tprocess = tprocess;
	}
	public int getMoney() {
		return money;
	}
	public void setMoney(int money) {
		this.money = money;
	}
	public int getProcess() {
		return process;
	}
	public void setProcess(int process) {
		this.process = process;
	}
}
