package com.caipiao.plugin.lqutil;

import java.util.ArrayList;
import java.util.List;

import com.caipiao.plugin.helper.CombineUtil;

public class LqCastCode {
	//投注玩法
	private int playtype;
	//投注项集合
	private List<LqItemBean> list = new ArrayList<LqItemBean>();
	//过关方式
	private String passType;
	//是否纯混合
	private boolean isMix;

	public boolean isMix() {
		return isMix;
	}

	public void setMix(boolean isMix) {
		this.isMix = isMix;
	}
	
	/**
	 * 获取投注串的过关方式
	 * @return
	 */
	public int getPlaytype() {
		return playtype;
	}
	
	/**
	 * 设置投注串的过关方式
	 * @param playtype
	 */
	public void setPlaytype(int playtype) {
		this.playtype = playtype;
	}
	
	/**
	 * 获取投注串的过关方式
	 * @return
	 */
	public String getPassType() {
		return passType;
	}
	
	/**
	 * 设定投注串的过关方式
	 * @param passType
	 */
	public void setPassType(String passType) {
		this.passType = passType;
	}
	
	/**
	 * 添加投注串的投注项
	 * @param ib
	 */
	public void addItemBean(LqItemBean ib){
		list.add(ib);
	}
	
	public List<LqItemBean> getLqItemList() {
		return list;
	}
	
	public static String getPrefix(int playtype){
		return LqItemCodeUtil.getPlayType(playtype);
	}
	
	
	/**
	 * 计算或获取投注串的实际投注注数
	 * @return
	 */
	public int getBettingnum(){
		int total = 0;
		int len = list.size();
		int start = LqPassTypeUtil.getMinRangePassType(passType);
		int end = LqPassTypeUtil.checkPassType(playtype, passType);
		
		for(int i = start; i <= end; i++){
			List<int []> _list = CombineUtil.combine(len, i);
			for(int j = 0; j < _list.size(); j++){
				int [] tmp = _list.get(j);
				int sub = 0;
				for(int m = 0; m < tmp.length; m++){
					if(tmp[m] > 0){
						sub = (sub == 0)? 1 : sub;
						sub *= list.get(m).getCountItem(playtype);
					}
				}
				total += sub;
			}
		}
		
		return total;
	}
	
	
	
	public String toBillCode(){
		return toBillCode(playtype);
	}
	
	/**
	 * 投注串转为出票格式投注串
	 * @return
	 */
	public String toBillCode(final int playtype){
		
		final StringBuffer sb = new StringBuffer();
		sb.append(LqItemCodeUtil.getPlayType(playtype));
		sb.append("|");
		for(int i = 0; i < list.size(); i++){
			sb.append(list.get(i).toBillCode(this.playtype));
			if(i != list.size() - 1){
				sb.append(",");
			}
		}
		sb.append("|");
		sb.append(passType);

		String code = sb.toString();
		if(code.endsWith(";")){
			code = code.substring(0, code.lastIndexOf(";"));
		}
		return code;
	}
}
