package com.caipiao.cpweb.admin.web;

import java.util.HashMap;

public class Util {
	private static HashMap<String, String> games = new HashMap<String, String>();//彩种列表
	static{
		games.put("01","双色球");
		games.put("03","福彩3D");
		games.put("04","老时时彩");
		games.put("05","吉林快3");
		games.put("06","安徽快3");
		games.put("07","七乐彩");
		games.put("08","内蒙快3");
		games.put("20","新时时彩");
		games.put("50","大乐透");
		games.put("51","七星彩");
		games.put("52","排列五");
		games.put("53","排列三");
		games.put("54","11选5");
		games.put("55","11选5(GD)");
		games.put("56","十一运夺金");
		games.put("80","胜负彩");
		games.put("81","任选九");
		games.put("82","进球彩");
		games.put("83","半全场");
		games.put("85","北单胜平负");
		games.put("86","北单猜比分");
		games.put("87","北单半全场");
		games.put("88","北单上下单双");
		games.put("89","北单进球数");
		games.put("70","竞彩足球混合过关");
		games.put("72","竞彩足球胜平负");
		games.put("90","竞彩足球让球胜平负");
		games.put("91","竞彩足球猜比分");
		games.put("92","竞彩足球进球数");
		games.put("93","竞彩足球半全场");
		games.put("71","竞彩篮球(混合过关)");
		games.put("94","竞彩篮球(胜负)");
		games.put("95","竞彩篮球(让分胜负)");
		games.put("96","竞彩篮球(胜分差)");
		games.put("97","竞彩篮球(大小分)");
		games.put("98","冠军");
		games.put("99","冠亚军");
	}
	public static String getGame(String key){
		return games.get(key);
	}
	
}
