package com.caipiao.plugin.jcutil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class JcItemCodeUtil {
	public final static byte SPF = 90;
	public final static byte CBF = 91;
	public final static byte BQC = 92;
	public final static byte JQS = 93;
	public final static byte HH = 70;
	public final static byte RSPF = 72;
	
	//足球竞彩投注值
	private static HashMap<String, Item> JCZQ_MAP = new HashMap<String, Item>();

	//足球竞彩所有投注值
	private static List<String> list = new ArrayList<String>();
	
	/**
	 * 初始化
	 */
	static{
		JCZQ_MAP.put(SPF + "_3", new Item("3", 0));
		JCZQ_MAP.put(SPF + "_1", new Item("1", 1));
		JCZQ_MAP.put(SPF + "_0", new Item("0", 2));	
		
		JCZQ_MAP.put(JQS + "_0", new Item("0", 3));
		JCZQ_MAP.put(JQS + "_1", new Item("1", 4));
		JCZQ_MAP.put(JQS + "_2", new Item("2", 5));
		JCZQ_MAP.put(JQS + "_3", new Item("3", 6));
		JCZQ_MAP.put(JQS + "_4", new Item("4", 7));
		JCZQ_MAP.put(JQS + "_5", new Item("5", 8));
		JCZQ_MAP.put(JQS + "_6", new Item("6", 9));
		JCZQ_MAP.put(JQS + "_7", new Item("7", 10));
		
		JCZQ_MAP.put(CBF + "_1:0", new Item("1:0", 11));
		JCZQ_MAP.put(CBF + "_2:0", new Item("2:0", 12));
		JCZQ_MAP.put(CBF + "_3:0", new Item("3:0", 13));
		JCZQ_MAP.put(CBF + "_4:0", new Item("4:0", 14));
		JCZQ_MAP.put(CBF + "_5:0", new Item("5:0", 15));
		JCZQ_MAP.put(CBF + "_2:1", new Item("2:1", 16));
		JCZQ_MAP.put(CBF + "_3:1", new Item("3:1", 17));
		JCZQ_MAP.put(CBF + "_4:1", new Item("4:1", 18));
		JCZQ_MAP.put(CBF + "_5:1", new Item("5:1", 19));
		JCZQ_MAP.put(CBF + "_3:2", new Item("3:2", 20));
		JCZQ_MAP.put(CBF + "_4:2", new Item("4:2", 21));
		JCZQ_MAP.put(CBF + "_5:2", new Item("5:2", 22));
		JCZQ_MAP.put(CBF + "_9:0", new Item("9:0", 23));
		JCZQ_MAP.put(CBF + "_0:0", new Item("0:0", 24));
		JCZQ_MAP.put(CBF + "_1:1", new Item("1:1", 25));
		JCZQ_MAP.put(CBF + "_2:2", new Item("2:2", 26));
		JCZQ_MAP.put(CBF + "_3:3", new Item("3:3", 27));
		JCZQ_MAP.put(CBF + "_9:9", new Item("9:9", 28));
		JCZQ_MAP.put(CBF + "_0:1", new Item("0:1", 29));
		JCZQ_MAP.put(CBF + "_0:2", new Item("0:2", 30));
		JCZQ_MAP.put(CBF + "_0:3", new Item("0:3", 31));
		JCZQ_MAP.put(CBF + "_0:4", new Item("0:4", 32));
		JCZQ_MAP.put(CBF + "_0:5", new Item("0:5", 33));
		JCZQ_MAP.put(CBF + "_1:2", new Item("1:2", 34));
		JCZQ_MAP.put(CBF + "_1:3", new Item("1:3", 35));
		JCZQ_MAP.put(CBF + "_1:4", new Item("1:4", 36));
		JCZQ_MAP.put(CBF + "_1:5", new Item("1:5", 37));
		JCZQ_MAP.put(CBF + "_2:3", new Item("2:3", 38));
		JCZQ_MAP.put(CBF + "_2:4", new Item("2:4", 39));
		JCZQ_MAP.put(CBF + "_2:5", new Item("2:5", 40));
		JCZQ_MAP.put(CBF + "_0:9", new Item("0:9", 41));
		
		JCZQ_MAP.put(BQC + "_3-3", new Item("3-3", 42));
		JCZQ_MAP.put(BQC + "_3-1", new Item("3-1", 43));
		JCZQ_MAP.put(BQC + "_3-0", new Item("3-0", 44));
		JCZQ_MAP.put(BQC + "_1-3", new Item("1-3", 45));
		JCZQ_MAP.put(BQC + "_1-1", new Item("1-1", 46));
		JCZQ_MAP.put(BQC + "_1-0", new Item("1-0", 47));
		JCZQ_MAP.put(BQC + "_0-3", new Item("0-3", 48));
		JCZQ_MAP.put(BQC + "_0-1", new Item("0-1", 49));
		JCZQ_MAP.put(BQC + "_0-0", new Item("0-0", 50));
		
		JCZQ_MAP.put(RSPF + "_3", new Item("3", 51));
		JCZQ_MAP.put(RSPF + "_1", new Item("1", 52));
		JCZQ_MAP.put(RSPF + "_0", new Item("0", 53));	

		list.add(SPF + "_3");
		list.add(SPF + "_1");
		list.add(SPF + "_0");
		
		list.add(JQS + "_0");
		list.add(JQS + "_1");
		list.add(JQS + "_2");
		list.add(JQS + "_3");
		list.add(JQS + "_4");
		list.add(JQS + "_5");
		list.add(JQS + "_6");
		list.add(JQS + "_7");
		
		list.add(CBF + "_1:0");
		list.add(CBF + "_2:0");
		list.add(CBF + "_3:0");
		list.add(CBF + "_4:0");
		list.add(CBF + "_5:0");
		list.add(CBF + "_2:1");
		list.add(CBF + "_3:1");
		list.add(CBF + "_4:1");
		list.add(CBF + "_5:1");
		list.add(CBF + "_3:2");
		list.add(CBF + "_4:2");
		list.add(CBF + "_5:2");
		list.add(CBF + "_9:0");
		list.add(CBF + "_0:0");
		list.add(CBF + "_1:1");
		list.add(CBF + "_2:2");
		list.add(CBF + "_3:3");
		list.add(CBF + "_9:9");
		list.add(CBF + "_0:1");
		list.add(CBF + "_0:2");
		list.add(CBF + "_0:3");
		list.add(CBF + "_0:4");
		list.add(CBF + "_0:5");
		list.add(CBF + "_1:2");
		list.add(CBF + "_1:3");
		list.add(CBF + "_1:4");
		list.add(CBF + "_1:5");
		list.add(CBF + "_2:3");
		list.add(CBF + "_2:4");
		list.add(CBF + "_2:5");
		list.add(CBF + "_0:9");
		
		list.add(BQC + "_3-3");
		list.add(BQC + "_3-1");
		list.add(BQC + "_3-0");
		list.add(BQC + "_1-3");
		list.add(BQC + "_1-1");
		list.add(BQC + "_1-0");
		list.add(BQC + "_0-3");
		list.add(BQC + "_0-1");
		list.add(BQC + "_0-0");
		
		list.add(RSPF + "_3");
		list.add(RSPF + "_1");
		list.add(RSPF + "_0");
	}

	/**
	 * 检查足球竞彩特定玩法投注值
	 * @param playtype
	 * @param itemcode
	 * @return
	 */
	public static boolean check(int playtype, String itemcode){
		return JCZQ_MAP.containsKey(playtype + "_" + itemcode);
	}
	public static boolean check(String playtype, String itemcode){
		try {
			return JCZQ_MAP.containsKey(getPlayType(playtype) + "_" + itemcode);
		} catch (Exception e) {
			return false;
		}
	}
	
	/**
	 * 获取足球竞彩特定玩法投注值的保存位置
	 * @param playtype
	 * @param itemcode
	 * @return
	 */
	public static int getPosition(int playtype, String itemcode){
		Item im = JCZQ_MAP.get(playtype + "_" + itemcode);
		if(im != null) {
			return im.getIndex();
		}
		return -1;
	}
	
	/**
	 * 获取足球竞彩特定保存位置的玩法投注值
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
		return num;
	}
	
	public static long getLongItem(int playtype, long code){
		long l = 0;
		if(playtype == SPF){
			l = code & 0x7L;
		}else if(playtype == JQS){
			l = code & (0xFF << 3);
		}else if(playtype == CBF){
			l = code & (0x7FFFFFFFL << 11);
		}else if(playtype == BQC){
			l = code & (0x1FFL << 42);
		}else if(playtype == RSPF){
			l = code & (0x7L << 51);
		}else if(playtype == HH){
			l = code & -1;
		}
		return l;
	}
	
	public static int getPlayType(String playtype) {
		int play = -1;
		if("SPF".equals(playtype)){
			play = SPF;
		} else if("CBF".equals(playtype)){
			play = CBF;
		} else if("BQC".equals(playtype)){
			play = BQC;
		} else if("JQS".equals(playtype)){
			play = JQS;
		} else if("HH".equals(playtype)){
			play = HH;
		} else if("RSPF".equals(playtype)){
			play = RSPF;
		} else {
			throw new RuntimeException("不存在的玩法");
		}
		return play;
	}
	
	public static String getPlayType(int playtype) {
		String play = "";
		if(SPF == playtype){
			play = "SPF";
		} else if(CBF == playtype ){
			play = "CBF";
		} else if(BQC == playtype){
			play = "BQC";
		} else if(JQS == playtype){
			play = "JQS";
		} else if(HH == playtype){
			play = "HH";
		} else if(RSPF == playtype){
			play = "RSPF";
		} else {
			throw new RuntimeException("不存在的玩法");
		}
		return play;
	}
}
