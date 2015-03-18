package com.caipiao.plugin.jcutil;

public class Item {

	//投注项投注值
	private String code;
	//投注项保存位置
	private int index;
	
	/**
	 * 投注项基本构造方法
	 * @param code
	 * @param index
	 */
	public Item(String code, int index){
		this.code = code;
		this.index = index;
	}
	
	/**
	 * 获取投注项投注值
	 * @return
	 */
	public String getCode() {
		return code;
	}
	
	/**
	 * 设定投注项投注值
	 * @param code
	 */
	public void setCode(String code) {
		this.code = code;
	}
	
	/**
	 * 获取投注项保存位置
	 * @param index
	 */
	public int getIndex() {
		return index;
	}
	
	/**
	 * 设定投注项保存位置
	 * @param index
	 */
	public void setIndex(int index) {
		this.index = index;
	}
}
