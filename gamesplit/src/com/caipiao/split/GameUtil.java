package com.caipiao.split;

import java.util.HashMap;

public class GameUtil {
	
	
	private static HashMap<String, String> fast = new HashMap<String, String>();
	private static HashMap<String, String> numeric = new HashMap<String, String>();
	private static HashMap<String, String> bj = new HashMap<String, String>();
	private static HashMap<String, String> jc = new HashMap<String, String>();
	private static HashMap<String, String> lq = new HashMap<String, String>();
	private static HashMap<String, String> zc = new HashMap<String, String>();
	
	static HashMap<String, String> games = new HashMap<String, String>();
	static HashMap<String, String> names = new HashMap<String, String>();

	static{
		fast.put("04", "04");
		fast.put("20", "20");
		fast.put("54", "54");
		fast.put("55", "55");
		fast.put("56", "56");
		fast.put("58", "58");
		games.putAll(fast);

		numeric.put("01", "01");
		numeric.put("03", "03");
		numeric.put("07", "07");
		numeric.put("50", "50");
		numeric.put("51", "51");
		numeric.put("52", "52");
		numeric.put("53", "53");
		games.putAll(numeric);
		

		zc.put("80", "80");
		zc.put("81", "81");
		zc.put("82", "82");
		zc.put("83", "83");
		bj.put("84", "84");
		bj.put("85", "85");
		bj.put("86", "86");
		bj.put("87", "87");
		bj.put("88", "88");
		bj.put("89", "89");
		jc.put("70", "70");
		jc.put("72", "72");
		jc.put("90", "90");
		jc.put("91", "91");
		jc.put("92", "92");
		jc.put("93", "93");
		lq.put("71", "71");
		lq.put("94", "94");
		lq.put("95", "95");
		lq.put("96", "96");
		lq.put("97", "97");
		games.putAll(zc);
		games.putAll(bj);
		games.putAll(jc);
		games.putAll(lq);
		
		games.put("98", "98");
		games.put("99", "99");
		
		names.put("01", "双色球");
		names.put("03", "福彩3D");
		names.put("04", "重庆时时彩");
		names.put("05", "快3(JL)");
		names.put("06", "快3(AH)");
		names.put("07", "七乐彩");
		names.put("08", "快3(NM)");
		names.put("20", "江西时时彩");
		names.put("50", "超级大乐透");
		names.put("51", "七星彩");
		names.put("52", "排列五");
		names.put("53", "排列三");
		names.put("54", "11选5");
		names.put("55", "广东11选5");
		names.put("56", "十一运夺金");
		names.put("58", "快乐扑克");
		names.put("80", "胜负彩");
		names.put("81", "任选九");
		names.put("82", "进球彩");
		names.put("83", "半全场");
		names.put("84", "足球单场-胜负过关");
		names.put("85", "足球单场-让球胜平负");
		names.put("86", "足球单场-比分");
		names.put("87", "足球单场-半全场");
		names.put("88", "足球单场-上下单双");
		names.put("89", "足球单场-总进球数");
		names.put("70", "竞彩足球-混合过关");
		names.put("90", "竞彩足球-胜平负");
		names.put("72", "竞彩足球-让球胜平负");
		names.put("91", "竞彩足球-比分");
		names.put("92", "竞彩足球-半全场");
		names.put("93", "竞彩足球-总进球数");
		names.put("71", "竞彩篮球-混合过关");
		names.put("94", "竞彩篮球-胜负");
		names.put("95", "竞彩篮球-让分胜负");
		names.put("96", "竞彩篮球-胜分差");
		names.put("97", "竞彩篮球-大小分");
		names.put("98", "冠军竞猜");
		names.put("99", "冠亚军竞猜");
	}
	
	public static boolean isP3(String gameID){
		return gameID.equals("53");
	}

	public static boolean is3D(String gameID){
		return gameID.equals("03");
	}
	public static boolean isJxssc(String gameID){
		return gameID.equals("20");
	}
	
	public static boolean isJx11x5(String gameID){
		return gameID.equals("54");
	}	
	
	public static boolean isSd11ydj(String gameID){
		return gameID.equals("56");
	}	

	public static boolean isCqssc(String gameID){
		return gameID.equals("04");
	}
	
	public static boolean isFastFrequency(String gameID){
		return fast.get(gameID) != null;
	}
	
	public static boolean isBJ(String gameID){
		return bj.get(gameID) != null;
	}

	public static boolean isJC(String gameID){
		return jc.get(gameID) != null;
	}

	public static boolean isLq(String gameID){
		return lq.get(gameID) != null;
	}
	
	public static boolean isZc(String gameID){
		return zc.get(gameID) != null;
	}
	
	public static boolean isSSQ(String gameID){
		return gameID.equals("01");
	}
	
	public static boolean isDLT(String gameID){
		return gameID.equals("50");
	}
	public static boolean isZCSFC(String gameID){
		return gameID.equals("80");
	}
	public static boolean isRX9(String gameID){
		return gameID.equals("81");
	}
	
	public static String getGameName(String gid){
		return names.get(gid);
	}
	
	public static boolean canUse(String gid){
		if(gid == null || "".equals(gid) || "".equals(gid.trim())){
			return true;
		}
		
		try {
			Integer.parseInt(gid);
		} catch (Exception e) {
			return false;
		}
		
		return games.containsKey(gid);
	}
	
	public static boolean canNotUse(String gid){
		return !canUse(gid);
	}
}
