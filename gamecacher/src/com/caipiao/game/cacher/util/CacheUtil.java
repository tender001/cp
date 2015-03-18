package com.caipiao.game.cacher.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.util.CheckUtil;

public class CacheUtil {
	
	public static Properties HIDDENS = null;//{"天下彩民","风雨陌路人"};
	
	public static String isHiddenUser(String cnickid){
		if(HIDDENS != null){
			Object obj = HIDDENS.getProperty(cnickid);
			if(obj != null){
				if("1".equals(obj.toString())){
					return cnickid.length() > 2 ? cnickid.substring(0, 2) + "****" : cnickid;
				}
				return null;
			}
		}
		return cnickid;
	}
	
	public static HashMap<String, String> mapCache = new HashMap<String, String>();

	public static void putCache(String key, String value) {
		mapCache.put(key, value);
	}

	public static boolean isChange(String key, String value) {
		String s = mapCache.get(key);
		if (!CheckUtil.isNullString(s)) {
			return !s.equalsIgnoreCase(value);
		} else {
			return true;
		}
	}
   
	/**
	 * 检查数组是否已经存在
	 * 
	 * @param strs
	 * @param str
	 * @return
	 */
	public static boolean isExist(String[] strs, String str) {
		boolean bln = false;
		if (strs != null && str != null && str.length() > 0) {
			for (int i = 0; i < strs.length; i++) {
				if (str.equalsIgnoreCase(strs[i])) {
					bln = true;
					break;
				}
			}
		}
		return bln;
	}

	/**
	 * 检查参数是否为空
	 * 
	 * @param str
	 * @return 空返回 true
	 */
	public static boolean checkParamterIsEmpty(String str) {
		if (str == null || "".equals(str) || "".equals(str.trim())) {
			return true;
		}
		return false;
	}

	/**
	 * 获取转换整型数据值
	 * 
	 * @param str
	 * @return
	 */
	public static int getIntValue(String str) {
		if (isInt(str)) {
			return Integer.parseInt(str);
		}
		return -1;
	}

	public static int getIntValue(String str, int value) {
		if (isInt(str)) {
			return Integer.parseInt(str);
		}
		return value;
	}

	/**
	 * 检查是否是整型
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isInt(String str) {
		if (str == null || "".equals(str)) {
			return false;
		}
		try {
			for (int i = 0; i < str.length(); i++) {
				Integer.parseInt(String.valueOf(str.charAt(i)));
			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 检查指定下标数据是否符合要求
	 * 
	 * @param jrs
	 * @param index
	 * @param bean
	 * @return
	 */
	private static boolean checkIsValid(JdbcRecordSet jrs, int index, GetProject bean) {
		boolean flag = true;
		int state = jrs.getInt("istate", index);
		int ishm = jrs.getInt("itype",index);
		if (state == 0) {
			flag = false;
		}
		if (flag) {
			if (!checkParamterIsEmpty(bean.getFind())) {// 特定用户
				if (!(jrs.get("cnickid", index).equalsIgnoreCase(bean.getFind()) 
					|| jrs.get("cprojid", index).equalsIgnoreCase(bean.getFind()))) {
					flag = false;
				}
				if(ishm == 0 && !(bean.getNickID().equalsIgnoreCase(bean.getFind()))){
					flag = false;
				}
			}
		}
		
		if ( flag ) {
			if ( bean.getState() == 1 ) {//未满员
				if ( state != 1) {
					flag = false ;
				}
			} else if ( bean.getState() == 2 ) {//已满员
				if ( state != 2) {
					flag = false ;
				}
			} else if ( bean.getState() == 3) {//撤销
				if ( state < 3 ) {
					flag = false ;
				}
			}
		}
		if(isHiddenUser(jrs.get("cnickid", index)) == null){
			flag = false;
		} else {
			if(ishm == 0 && jrs.getInt("money", index) >= 10000){
				flag = false;
			}
		}
		return flag;
	}

	/**
	 * 获取总数据集合中置顶和非置顶数据集合
	 * 
	 * @param jrs
	 * @param bean
	 * @return List<List<ComparatorBean>> 集合说明：(下标)0:置顶集合 1:非置顶集合
	 */
	public static List<ComparatorBean> getList(JdbcRecordSet jrs, GetProject bean, String gid, boolean canBuy) {
		List<ComparatorBean> list = new ArrayList<ComparatorBean>();
		for (int i = 0; i < jrs.size(); i++) {
			if (checkIsValid(jrs, i, bean)) {
				ComparatorBean cb = new ComparatorBean();
				cb.setGid(gid);
				cb.setIndex(i);
				cb.setMoney(Double.parseDouble(jrs.get("money", i)));
				cb.setJindu(jrs.getInt("jindu", i));
				
				if (checkParamterIsEmpty(bean.getSort()) || bean.getSort().equalsIgnoreCase("cprojid") 
						|| bean.getSort().equalsIgnoreCase("cnickid")) {
					cb.setObj(jrs.get(bean.getSort(), i));
				} else {
					cb.setObj(Double.parseDouble(jrs.get(bean.getSort(), i)));
				}

				int state = jrs.getInt("istate",i);
				int itype = jrs.getInt("itype", i);
				
				if (state == 3 || state == 4 || state == 5) {// 已经撤掉
					cb.setState(5);
				} else if (state > 0) {
					int tmoney = jrs.getInt("money", i);
					int nums = jrs.getInt("nums", i);
					int lnum = jrs.getInt("lnum", i);
					int pnum = jrs.getInt("pnum", i);
					
					if(state == 1){
						if (jrs.getInt("iorder", i) > 0 || (jrs.getInt("iorder", i) == 0 && createProjOrders(gid, tmoney, nums, lnum, pnum, state) > 0)) {
							cb.setState(1);
						} else {
							cb.setState(2);
						}
					} else if(state == 2){
						if(itype == 0){
							cb.setState(4);
						} else {
							cb.setState(3);
						}
					}
				}
				
				String[] flds = jrs.getFileds();
				List<String> values = new ArrayList<String>();
				for (int j = 0; j < flds.length; j++) {
					if (itype == 0 && flds[j].equalsIgnoreCase("cnickid")) {
						String nickid = jrs.get(flds[j], i);
						if (!jrs.get(flds[j], i).equalsIgnoreCase(bean.getNickID())) {
							nickid = "******";
						}
						values.add(nickid);
					} else {
						values.add(jrs.get(flds[j], i));
					}
				}
				cb.setValues(values);
				if(isHiddenUser(jrs.get("cnickid", i)) != null){
					list.add(cb);
				}
			}
		}
		return list;
	}
	
	public static int createProjOrders(String gid, int tmoney,int nums,int lnum,int pnum, int state) {
		int order = 0;
		if(state == 1){
			double d = (nums - lnum + pnum) * 100.0 / nums;
			if (gid.equalsIgnoreCase("01") || gid.equalsIgnoreCase("50")) {
				if (tmoney >= 200 && d >= 50.0) {
					order = 1;
				}
			} else if (gid.equalsIgnoreCase("03") || gid.equalsIgnoreCase("07") || gid.equalsIgnoreCase("51") || gid.equalsIgnoreCase("52") || gid.equalsIgnoreCase("53")) {
				if (tmoney >= 100 && d >= 50.0) {
					order = 1;
				}
			} else {
				if (tmoney >= 500 && d >= 50.0) {
					order = 1;
				}
			}
		}
		return order;
	}
	
	public static int createHotProjOrders(String gid, int tmoney,int nums,int lnum,int pnum, int state) {
		int order = 0;
		if(state == 1){
			double d = (nums - lnum + pnum) * 100.0 / nums;
			if (gid.equalsIgnoreCase("01") || gid.equalsIgnoreCase("50")) {
				if (tmoney >= 500 && d >= 50.0) {
					order = 1;
				}
			} else if (gid.equalsIgnoreCase("03") || gid.equalsIgnoreCase("07") || gid.equalsIgnoreCase("51") || gid.equalsIgnoreCase("52") || gid.equalsIgnoreCase("53")) {
				if (tmoney >= 200 && d >= 50.0) {
					order = 1;
				}
			} else {
				if (tmoney >= 1000 && d >= 50.0) {
					order = 1;
				}
			}
		}
		return order;
	}
}
