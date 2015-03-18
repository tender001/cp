package com.caipiao.plugin.jcutil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;


public class JcItemBean {

	//玩法类型
	private int playType; 

	//投注项编号
	private String itemid;
	
	//特定项的投注值
	private long code;
	
	private String sourceCode ;
	
	private List<JcItemBean> subItemBeans;
	
	public String getSourceCode() {
		return sourceCode;
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
	
	public int getPlayType() {
		return playType;
	}

	public void setPlayType(int playType) {
		this.playType = playType;
	}

	public JcItemBean[] getSubJcItem() {	
		JcItemBean[] ss = new JcItemBean[subItemBeans.size()];
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
		subItemBeans = new ArrayList<JcItemBean>();
		
		int pt = playType;
		if ( pt == JcItemCodeUtil.HH ) {
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
					pt = JcItemCodeUtil.getPlayType(pl);//重新生成Item的玩法
				} catch (Exception e) {
					throw new CodeFormatException(2, "this code item play is not support play=" + pl,_code);
				}

				JcItemBean bean = new JcItemBean();
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
				if(!JcItemCodeUtil.check(pt, itemcode)){
					throw new CodeFormatException(1, "选号错误",itemcode);
				}
				l |= 1L << JcItemCodeUtil.getPosition(pt, itemcode);
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
		if ( pt == JcItemCodeUtil.HH ) {
			return itemid + ">" + JcItemCodeUtil.getPlayType(playType) + "=" + sourceCode;
		} else {
			return itemid + "=" + sourceCode;
		}
	}
	
	/**
	 * 获取投注项特定玩法下的投注值数量
	 * @param
	 * @return
	 */
	public int getCountItem(){
		return Long.bitCount(code);
	}
	
	public long getCountItemType(){
		long l = 0;
		if(Long.bitCount(JcItemCodeUtil.getLongItem(JcItemCodeUtil.SPF, code)) > 0){
			l |= 1L << 1;
		}
		if(Long.bitCount(JcItemCodeUtil.getLongItem(JcItemCodeUtil.CBF, code)) > 0){
			l |= 1L << 2;
		}
		if(Long.bitCount(JcItemCodeUtil.getLongItem(JcItemCodeUtil.BQC, code)) > 0){
			l |= 1L << 3;
		}
		if(Long.bitCount(JcItemCodeUtil.getLongItem(JcItemCodeUtil.JQS, code)) > 0){
			l |= 1L << 4;
		}
		if(Long.bitCount(JcItemCodeUtil.getLongItem(JcItemCodeUtil.RSPF, code)) > 0){
			l |= 1L << 5;
		}
		return l;
	}
}
