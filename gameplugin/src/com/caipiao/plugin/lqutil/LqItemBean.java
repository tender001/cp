package com.caipiao.plugin.lqutil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;

public class LqItemBean {
	
	//玩法类型
	private int playType; 

	//投注项编号
	private String itemid;
	//让分&&总分
	private double betNum;
	//特定项的投注值
	private long code;
	
	private String sourceCode ;
	
	private List<LqItemBean> subItemBeans;
	
	public String getSourceCode() {
		return sourceCode;
	}

	public int getPlayType() {
		return playType;
	}

	public void setPlayType(int playType) {
		this.playType = playType;
	}
	
	public double getBetNum() {
		return betNum;
	}

	public void setBetNum(double betNum) {
		this.betNum = betNum;
	}

	/**
	 * 获取投注项
	 * @return
	 */
	public String getItemid() {
		return itemid;
	}
	
	/**
	 * 设定投注项
	 * @return
	 */
	public void setItemid(String itemid) {
		this.itemid = itemid;
	}
	
	/**
	 * 获取投注项的投注值
	 * @return
	 */
	public long getCode() {
		return code;
	}
	
	public LqItemBean[] getSubJcItem() {	
		LqItemBean[] ss = new LqItemBean[subItemBeans.size()];
		for (int i=0;i<ss.length;i++) {
			ss[i] = subItemBeans.get(i);
		}
		return ss;
	}
	
	/**
	 * 设置特定项下特定玩法的投注值
	 * @param _code
	 * @param playtype
	 * @throws CodeFormatException
	 */
	public void setCode(String _code,int playtype) throws CodeFormatException {
		this.playType = playtype;
		setCode(_code);
	}
	public void setCode(String _code) throws CodeFormatException {
		subItemBeans = new ArrayList<LqItemBean>();
		
		int pt = playType;
		if ( pt == LqItemCodeUtil.HH ) {
			HashMap<String,String> maps = new HashMap<String,String>();
			String[] pp = PluginUtil.splitter(_code, "+");
			for (int k=0;k<pp.length;k++) {
				String[] cc = PluginUtil.splitter(pp[k], "=");
				String pl = cc[0];					
				if ( maps.containsKey(cc[0]) ) {
					throw new CodeFormatException(2, "this code item play is duplicate",_code);
				} else {
					maps.put(cc[0], cc[0]);
				}
				
				try {
					pt = LqItemCodeUtil.getPlayType(pl);
				} catch (Exception e) {
					throw new CodeFormatException(2, "this code item play is not support play=" + pl,_code);
				}

				LqItemBean bean = new LqItemBean();
				bean.setItemid(itemid);
				bean.setCode(cc[1], pt);
				subItemBeans.add(bean);
			}
			maps.clear();
			maps = null ;
		} else {
			String [] cs = PluginUtil.splitter(_code, "/");
			long l = 0;
			for(int i = 0; i < cs.length; i++){
				String itemcode = cs[i].trim();
				if(!LqItemCodeUtil.check(pt, itemcode)){
					throw new CodeFormatException(1, "选号错误",itemcode);
				}
				l |= 1L << LqItemCodeUtil.getPosition(pt, itemcode);
			}
			if(Long.bitCount(l) != cs.length){
				throw new CodeFormatException(1, "this code item value is duplicate",_code);
			}
			code |= l;
			subItemBeans.add(this);
		}
		sourceCode = _code;
	}

	/**
	 * 投注项转为出票要求格式
	 * @return
	 */
	public String toBillCode(int pt){
		if ( pt == LqItemCodeUtil.HH ) {
			return itemid + ">" + LqItemCodeUtil.getPlayType(playType) + "=" + sourceCode;
		} else {
			return itemid + "=" + sourceCode;
		}
	}
	

	
	/**
	 * 获取投注项特定玩法下的投注值数量
	 * @param playtype
	 * @return
	 */
	public int getCountItem(int playtype){
		return LqItemCodeUtil.countItem(playtype, code);
	}
	
	public long getCountItemType(){
		long l = 0;
		if(Long.bitCount(LqItemCodeUtil.getLongItem(LqItemCodeUtil.SF, code)) > 0){
			l |= 1L << (LqItemCodeUtil.SF - LqItemCodeUtil.SF);
		}
		if(Long.bitCount(LqItemCodeUtil.getLongItem(LqItemCodeUtil.RFSF, code)) > 0){
			l |= 1L << (LqItemCodeUtil.RFSF - LqItemCodeUtil.SF);
		}
		if(Long.bitCount(LqItemCodeUtil.getLongItem(LqItemCodeUtil.SFC, code)) > 0){
			l |= 1L << (LqItemCodeUtil.SFC - LqItemCodeUtil.SF);
		}
		if(Long.bitCount(LqItemCodeUtil.getLongItem(LqItemCodeUtil.DXF, code)) > 0){
			l |= 1L << (LqItemCodeUtil.DXF - LqItemCodeUtil.SF);
		}
		return l;
	}
}
