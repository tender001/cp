package com.caipiao.mob.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

public class GameUtil {
	private static HashMap<String, Game> games = new HashMap<String, Game>();// 彩种列表
	private static List<String> gameKeys = new ArrayList<String>();

	public static final class CastType{
		public static final String CASTTYPE_SINGLE = "1"; // 单式
		public static final String CASTTYPE_MULTI = "2"; // 复式
		public static final String CASTTYPE_BAOHAO = "3"; // 包号
		public static final String CASTTYPE_HESHU = "4"; // 和值
		public static final String CASTTYPE_DANTUO = "5"; // 胆拖
	}
	
	public static final class GameType {
		static final int KP = 0;
		static final int MP = 1;
		static final int ZC = 2;
		static final int BD = 3;
		static final int JCZQ = 4;
		static final int JCLQ = 5;
		static final int GYJ = 6;
	}

	public static final class Type {
		static final int SZC = 0;
		static final int FBZ = 1;
	}
	
	public static final class GameContains{
		public static final String FC_SSQ = "01";
		public static final String FC_3D = "03";
		public static final String KP_CQ_SSC = "04";
		public static final String FC_QLC = "07";
		public static final String KP_JX_SSC = "20";

		public static final String TC_DLT = "50";
		public static final String TC_QXC = "51";
		public static final String TC_PL5 = "52";
		public static final String TC_PL3 = "53";

		public static final String KP_JX_11C5 = "54";
		public static final String KP_GD_11C5 = "55";
		public static final String KP_SD_11C5 = "56";
		public static final String KP_KLPK = "58";

		public static final String ZC_SFC = "80";
		public static final String ZC_RX9 = "81";
		public static final String ZC_JQS = "82";
		public static final String ZC_BQC = "83";
		
		public static final String BD_SF = "84";
		public static final String BD_SPF = "85";
		public static final String BD_CBF = "86";
		public static final String BD_BQC = "87";
		public static final String BD_SXP = "88";
		public static final String BD_JQS = "89";

		public static final String JCZQ_HH = "70";
		public static final String JCZQ_RQSPF = "72";
		public static final String JCZQ_SPF = "90";
		public static final String JCZQ_CBF = "91";
		public static final String JCZQ_BQC = "92";
		public static final String JCZQ_JQS = "93";

		public static final String JCLQ_HH = "71";
		public static final String JCLQ_SF = "94";
		public static final String JCLQ_RFSF = "95";
		public static final String JCLQ_SFC = "96";
		public static final String JCLQ_DXF = "97";

		public static final String GYJ_GJ = "98";
		public static final String GYJ_GYJ = "99";
	}

	static {
		putGame(new Game(GameContains.FC_SSQ, "双色球", GameType.MP, Type.SZC, "", "ssq", "双色球"));
		putGame(new Game(GameContains.FC_3D, "福彩3D", GameType.MP, Type.SZC, "", "3d", "福彩3D"));
		putGame(new Game(GameContains.KP_CQ_SSC, "老时时彩", GameType.KP, Type.SZC, "", "cqssc", "老时时彩"));
		putGame(new Game(GameContains.FC_QLC, "七乐彩", GameType.MP, Type.SZC, "", "qlc", "七乐彩"));
		putGame(new Game(GameContains.KP_JX_SSC, "新时时彩", GameType.KP, Type.SZC, "", "jxssc", "新时时彩"));
		putGame(new Game(GameContains.TC_DLT, "大乐透", GameType.MP, Type.SZC, "", "dlt", "大乐透"));
		putGame(new Game(GameContains.TC_QXC, "七星彩", GameType.MP, Type.SZC, "", "qxc", "七星彩"));
		putGame(new Game(GameContains.TC_PL5, "排列五", GameType.MP, Type.SZC, "", "plw", "排列五"));
		putGame(new Game(GameContains.TC_PL3, "排列三", GameType.MP, Type.SZC, "", "pls", "排列三"));
		putGame(new Game(GameContains.KP_JX_11C5, "11选5", GameType.KP, Type.SZC, "", "l11x5", "11选5"));
		putGame(new Game(GameContains.KP_GD_11C5, "11选5(GD)", GameType.KP, Type.SZC, "", "gd115", "11选5(GD)"));
		putGame(new Game(GameContains.KP_SD_11C5, "11运夺金", GameType.KP, Type.SZC, "", "sd115", "11运夺金"));
		putGame(new Game(GameContains.KP_KLPK, "快乐扑克", GameType.KP, Type.SZC, "", "klpk", "快乐扑克"));
		putGame(new Game(GameContains.ZC_SFC, "胜负彩", GameType.ZC, Type.FBZ, "", "14sfc", "胜负彩"));
		putGame(new Game(GameContains.ZC_RX9, "任选九", GameType.ZC, Type.FBZ, "", "r9", "任选九"));
		putGame(new Game(GameContains.ZC_JQS, "进球彩", GameType.ZC, Type.FBZ, "", "4cjq", "进球彩"));
		putGame(new Game(GameContains.ZC_BQC, "半全场", GameType.ZC, Type.FBZ, "", "6cb", "半全场"));
		putGame(new Game(GameContains.BD_SF, "单场竞猜", GameType.BD, Type.FBZ, "SF", "bd","北单胜负过关"));
		putGame(new Game(GameContains.BD_SPF, "单场竞猜", GameType.BD, Type.FBZ, "SPF", "bd","北单胜平负"));
		putGame(new Game(GameContains.BD_CBF, "单场竞猜", GameType.BD, Type.FBZ, "CBF", "bd","北单猜比分"));
		putGame(new Game(GameContains.BD_BQC, "单场竞猜", GameType.BD, Type.FBZ, "BQC", "bd","北单半全场"));
		putGame(new Game(GameContains.BD_SXP, "单场竞猜", GameType.BD, Type.FBZ, "SXP", "bd","北单上下单双"));
		putGame(new Game(GameContains.BD_JQS, "单场竞猜", GameType.BD, Type.FBZ, "JQS", "bd","北单进球数"));
		putGame(new Game(GameContains.JCZQ_HH, "竞彩足球", GameType.JCZQ, Type.FBZ, "HH", "jczq","竞彩混投"));
		putGame(new Game(GameContains.JCZQ_SPF, "竞彩足球", GameType.JCZQ, Type.FBZ, "SPF", "jczq","竞彩胜平负"));
		putGame(new Game(GameContains.JCZQ_RQSPF, "竞彩足球", GameType.JCZQ, Type.FBZ, "RSPF", "jczq","竞彩让球"));
		putGame(new Game(GameContains.JCZQ_CBF, "竞彩足球", GameType.JCZQ, Type.FBZ, "CBF", "jczq","竞彩猜比分"));
		putGame(new Game(GameContains.JCZQ_JQS, "竞彩足球", GameType.JCZQ, Type.FBZ, "JQS", "jczq","竞彩进球数"));
		putGame(new Game(GameContains.JCZQ_BQC, "竞彩足球", GameType.JCZQ, Type.FBZ, "BQC", "jczq","竞彩半全场"));
		putGame(new Game(GameContains.JCLQ_HH, "竞彩篮球", GameType.JCLQ, Type.FBZ, "HH", "jclq","篮彩混投"));
		putGame(new Game(GameContains.JCLQ_SF, "竞彩篮球", GameType.JCLQ, Type.FBZ, "SF", "jclq","篮彩胜负"));
		putGame(new Game(GameContains.JCLQ_RFSF, "竞彩篮球", GameType.JCLQ, Type.FBZ, "RFSF", "jclq","篮彩让分胜负"));
		putGame(new Game(GameContains.JCLQ_SFC, "竞彩篮球", GameType.JCLQ, Type.FBZ, "SFC", "jclq","篮彩胜分差"));
		putGame(new Game(GameContains.JCLQ_DXF, "竞彩篮球", GameType.JCLQ, Type.FBZ, "DXF", "jclq","篮彩大小分"));
		putGame(new Game(GameContains.GYJ_GJ, "冠军", GameType.GYJ, Type.FBZ, "GJ", "gyj","冠军"));
		putGame(new Game(GameContains.GYJ_GYJ, "冠亚军", GameType.GYJ, Type.FBZ, "GYJ", "gyj","冠亚军"));
	}

	private static void putGame(Game game) {
		games.put(game.getGameID(), game);
		if(!game.getGameID().equals(GameContains.KP_JX_SSC)){
			gameKeys.add(game.getGameID());
		}
		
	}
	
	public static List<String> getGameKeys(){
		return gameKeys;
	}

	public static String getGameName(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getGameName();
		}
		game = getGameByDyjName(key);
		if (game != null) {
			return game.getGameName();
		}
		return "";
	}
	
	public static String getGameDetailName(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getGameDetailName();
		}
		game = getGameByDyjName(key);
		if (game != null) {
			return game.getGameDetailName();
		}
		return "";
	}

	public static String getDYJGameName(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getDyjGameType();
		}
		game = getGameByDyjName(key);
		if (game != null) {
			return game.getDyjGameType();
		}
		return "";
	}

	public static String getGameID(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getGameID();
		}
		game = getGameByDyjName(key);
		if (game != null) {
			return game.getGameID();
		}
		return "";
	}
	
	private static Game getGameByDyjName(String key){
		for(Iterator<Entry<String, Game>> its = games.entrySet().iterator(); its.hasNext();){
			Entry<String, Game> entry = its.next();
			Game game = entry.getValue();
			if(game != null){
				if(game.getDyjGameType().equalsIgnoreCase(key)){
					return game;
				}
			}
		}
		return null;
	}
	
	public static int getGameTypeByDyjName(String key){
		Game game = getGameByDyjName(key);
		if(game != null){
			return game.getGameType();
		}
		return -1;
	}
	
	public static String getGameIDByDyjName(String key){
		Game game = getGameByDyjName(key);
		if(game != null){
			return game.getGameID();
		}
		return null;
	}
	
	public static int getTypeByDyjName(String key){
		Game game = getGameByDyjName(key);
		if(game != null){
			return game.getType();
		}
		return -1;
	}

	public static String getGamePrefix(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getPrefix();
		}
		return "";
	}

	public static int getGameType(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getGameType();
		}
		return -1;
	}

	public static int getType(String key) {
		Game game = games.get(key);
		if (game != null) {
			return game.getType();
		}
		return -1;
	}
	
	public static boolean checkGame(String key){
		return getType(key) > -1 || getGameByDyjName(key) != null;
	}

	public static boolean isSZC(String key) {
		return getType(key) == Type.SZC || getTypeByDyjName(key) == Type.SZC;
	}

	public static boolean isZC(String key) {
		return getGameType(key) == GameType.ZC || getGameTypeByDyjName(key) == GameType.ZC;
	}

	public static boolean isKP(String key) {
		return getGameType(key) == GameType.KP || getGameTypeByDyjName(key) == GameType.KP;
	}

	public static boolean isDLT(String key) {
		Game game = getGameByDyjName(key);
		if(game != null){
			return GameContains.TC_DLT.equals(game.getGameID());
		}
		return GameContains.TC_DLT.equals(key);
	}

	public static boolean isBD(String key) {
		return getGameType(key) == GameType.BD || getGameTypeByDyjName(key) == GameType.BD;
	}

	public static boolean isJCZQ(String key) {
		return getGameType(key) == GameType.JCZQ || getGameTypeByDyjName(key) == GameType.JCZQ;
	}

	public static boolean isJCLQ(String key) {
		return getGameType(key) == GameType.JCLQ|| getGameTypeByDyjName(key) == GameType.JCLQ;
	}

	public static boolean isGYJ(String key) {
		return getGameType(key) == GameType.GYJ;
	}
}
