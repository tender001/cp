package com.caipiao.plugin.lqutil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import com.caipiao.plugin.helper.PluginUtil;

public class LqItemCodeUtil {
	public final static byte SF = 94;
	public final static byte RFSF = 95;
	public final static byte SFC = 96;
	public final static byte DXF = 97;
	public final static byte HH = 71;

	private static HashMap<String, Item> JCLQ_MAP = new HashMap<String, Item>();
	
	//足球竞彩所有投注值
	private static List<String> list = new ArrayList<String>();
	
	static{
		JCLQ_MAP.put(SF + "_3", new Item("3", 0));
		JCLQ_MAP.put(SF + "_0", new Item("0", 1));
		
		JCLQ_MAP.put(RFSF + "_3", new Item("3", 2));
		JCLQ_MAP.put(RFSF + "_0", new Item("0", 3));

		JCLQ_MAP.put(SFC + "_11", new Item("11", 4));
		JCLQ_MAP.put(SFC + "_12", new Item("12", 5));
		JCLQ_MAP.put(SFC + "_13", new Item("13", 6));
		JCLQ_MAP.put(SFC + "_14", new Item("14", 7));
		JCLQ_MAP.put(SFC + "_15", new Item("15", 8));
		JCLQ_MAP.put(SFC + "_16", new Item("16", 9));
		JCLQ_MAP.put(SFC + "_01", new Item("01", 10));
		JCLQ_MAP.put(SFC + "_02", new Item("02", 11));
		JCLQ_MAP.put(SFC + "_03", new Item("03", 12));
		JCLQ_MAP.put(SFC + "_04", new Item("04", 13));
		JCLQ_MAP.put(SFC + "_05", new Item("05", 14));
		JCLQ_MAP.put(SFC + "_06", new Item("06", 15));
		
		JCLQ_MAP.put(DXF + "_3", new Item("3", 16));
		JCLQ_MAP.put(DXF + "_0", new Item("0", 17));

		list.add(SF + "_3");
		list.add(SF + "_0");
		
		list.add(RFSF + "_3");
		list.add(RFSF + "_0");
		
		list.add(SFC + "_11");
		list.add(SFC + "_12");
		list.add(SFC + "_13");
		list.add(SFC + "_14");
		list.add(SFC + "_15");
		list.add(SFC + "_16");
		list.add(SFC + "_01");
		list.add(SFC + "_02");
		list.add(SFC + "_03");
		list.add(SFC + "_04");
		list.add(SFC + "_05");
		list.add(SFC + "_06");
		
		list.add(DXF + "_3");
		list.add(DXF + "_0");
	}
	
//	/**
//	 * 获取竞彩篮球各玩法的投注值集合
//	 * @param playtype
//	 * @return
//	 */
//	private static HashMap<String, Item> getHashMap(int playtype){
//		HashMap<String, Item> maps = null;		
//		if(playtype == SF){
//			maps = SF_MAP;
//		}else if(playtype == RFSF){
//			maps = RFSF_MAP;
//		}else if(playtype == SFC){
//			maps = SFC_MAP;
//		}else if(playtype == DXF){
//			maps = DXF_MAP;
//		}
//		return maps;
//	}

	/**
	 * 获取可所有投注项
	 * @return
	 */
	public static long getAllPosition(){
		long l = 0;
		for(int i = 0; i <= 17; i++){
			l |= 1L << i;
		}
		return l;
	}

	/**
	 * 获取特定玩法的所有投注项串
	 * @param playtype
	 * @return
	 */
	public static String getItemcodes(int playtype){
		String str = "";
//		HashMap<String, Item> maps = getHashMap(playtype);
//		if(maps != null){
			Iterator<String> keys = JCLQ_MAP.keySet().iterator();
			while(keys.hasNext()){
				String key = keys.next();
				str += key;
				str += "/";
			}
//		}
		if(!PluginUtil.isEmpty(str)){
			str = str.substring(0, str.lastIndexOf("/"));
		}
		return str;
	}

	/**
	 * 检查竞彩篮球特定玩法投注值
	 * @param playtype
	 * @param itemcode
	 * @return
	 */
	public static boolean check(int playtype, String itemcode){
		return JCLQ_MAP.containsKey(playtype + "_" + itemcode);
	}
	public static boolean check(String playtype, String itemcode){
		try {
			return JCLQ_MAP.containsKey(getPlayType(playtype) + "_" + itemcode);
		} catch (Exception e) {
			return false;
		}
	}
	
	/**
	 * 获取竞彩特定玩法投注值的保存位置
	 * @param playtype
	 * @param itemcode
	 * @return
	 */
	public static int getPosition(int playtype, String itemcode){
		Item im = JCLQ_MAP.get(playtype + "_" + itemcode);
		if(im != null) {
			return im.getIndex();
		}
		return -1;
	}
	
	/**
	 * 根据位置获取玩法
	 * @param pos
	 * @return
	 */
	public static int getPlayTypeByPos(int pos) {
		if ( pos >=0 && pos <= 1 ) {
			return SF;
		} else if ( pos >= 2 && pos <= 3 ) {
			return RFSF;
		} else if ( pos >= 4 && pos <= 15) {
			return SFC;
		} else if ( pos >= 16 && pos <= 17) {
			return DXF;
		}
		return -1;
	}
	/**
	 * 获取竞彩篮球特定保存位置的玩法投注值
	 * @param pos
	 * @return
	 */
	public static String getItemCode(int pos){
		return list.get(pos);
	}
	
	
	/**
	 * 统计指定场次投注项个数
	 * @param playtype
	 * @param code
	 * @return
	 */
	public static int countItem(int playtype, long code){
		int num = Long.bitCount(getLongItem(playtype, code));
		
		if ( num <= 0 ) {
			System.out.println("code=" + code + "  " + num + " play=" + playtype);
		}
		return num;
	}
	
	public static long getLongItem(int playtype, long code){
		long l = 0;
		if(playtype == SF){
			l = code & 0x3L;
		}else if(playtype == RFSF){
			l = code & (0x3L << 2);
		}else if(playtype == SFC){
			l = code & (0xFFFL << 4);
		}else if(playtype == DXF){
			l = code & (0x3L << 16);
		}else if(playtype == HH){
			l = code & -1;
		}
		return l;
	}
	
	public static int getPlayType(String playtype) throws Exception{
		int play = -1;
		if("SF".equals(playtype)){
			play = SF;
		} else if("RFSF".equals(playtype)){
			play = RFSF;
		} else if("SFC".equals(playtype)){
			play = SFC;
		} else if("DXF".equals(playtype)){
			play = DXF;
		} else if("HH".equals(playtype)){
			play = HH;
		} else {
			throw new Exception("不存在的玩法");
		}
		return play;
	}
	
	public static String getPlayType(int playtype) {
		String play = "";
		if(SF == playtype){
			play = "SF";
		} else if(RFSF == playtype ){
			play = "RFSF";
		} else if(SFC == playtype){
			play = "SFC";
		} else if(DXF == playtype){
			play = "DXF";
		} else if(HH == playtype){
			play = "HH";
		} else {
			throw new RuntimeException("不存在的玩法");
		}
		return play;
	}
}
