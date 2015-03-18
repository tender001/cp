package com.caipiao.plugin.helper;

import java.util.HashMap;

import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;


public abstract class GamePluginAdapter {
 
	public final static int CODE_MAX_NUM = Integer.MAX_VALUE;//一张票最大注数
	
	private String gameID;
	private int gradeNum = 50; // 奖级数量
	private String gameName;
	
	public String getGameID() {
		return gameID;
	}

	public void setGameID(String gameID) {
		this.gameID = gameID;
	}

	public int getGradeNum() {
		return gradeNum;
	}

	public void setGradeNum(int gradeNum) {
		this.gradeNum = gradeNum;
	}

	public String getGameName() {
		return gameName;
	}

	public void setGameName(String gameName) {
		this.gameName = gameName;
	}

	public GameCastCode[] parseGameCastCodes(String s) throws CodeFormatException {
		String[] tmpCodes = PluginUtil.splitter(s, ";");
		if (tmpCodes.length > CODE_MAX_NUM) {
			throw new CodeFormatException(2, "投注号码注数超过最大值 " + CODE_MAX_NUM, s);
		}

		GameCastCode[] ret = new GameCastCode[tmpCodes.length];
		for (int i = 0; i < tmpCodes.length; i++) {
			ret[i] = parseGameCastCode(tmpCodes[i]);
		}
		return ret;
	}

	public int[] bingoMatch(GameCastCode[] codes, GameAwardCode bingoCode, int gradeNum) throws Exception {
		int[] bingoNum = new int[gradeNum];
		int count = 0;
		for (int k = 0; k < codes.length; k++) {
			int[] tmp = bingoMatcher(codes[k], bingoCode, gradeNum);
			if (tmp != null) {
				for (int i = 0; i < tmp.length; i++) {
					bingoNum[i] += tmp[i];
					count += tmp[i];
				}
			}
		}
		if (count > 0) {
			return bingoNum;
		} else {
			return null;
		}
	}
	
    public String getSourceEx(Long l, int type, String split){
    	StringBuffer sb = new StringBuffer();
    	for(int i = 0; i < 64; i++){
    		long t = 1L<<i;
    		if ( (l & t) == t) {
    			if ( type == 0 ) {
    				if ( i < 10 ) {
    					sb.append("0").append(i);
    				} else {
    					sb.append(i);
    				}
    			} else  {
    				sb.append(i);
    			} 
    			if ( split != null && split.length() > 0) {
    				sb.append(split);
    			}
    		}
    	}
    	String s= sb.toString();
    	if ( split != null && split.length() > 0) {
	    	if ( s.length() > split.length()) {
	    		s = s.substring(0,s.length()-split.length());
	    	}
    	}
    	return s;
    }
	
	public String toPrintCodes(GameCastCode[] codes) throws Exception {
		StringBuffer sb = new StringBuffer();
		int cm = -1;
		int pm = -1;
		
		if ( codes.length > 5 ) {
			throw new Exception("最多不能超过5注号码");
		}
		
		for (int i=0;i<codes.length;i++) {
			GameCastCode gcc = codes[i];
			if ( cm == -1 && pm == -1) {
				cm = gcc.getCastMethod();
				pm = gcc.getPlayMethod();
			} else {
				if ( cm == gcc.getCastMethod() && pm == gcc.getPlayMethod()) {
					sb.append(toPrintCode(gcc)).append(";");
				} else {
					throw new Exception("多注必须是相同玩法和投注方式");
				}
			}
		}
		
		if ( cm != GameCastMethodDef.CASTTYPE_SINGLE) {
			if ( codes.length > 1) {
				throw new Exception("非单式票只能是1注号码");
			}
		}
		
		String s = sb.toString();
		if ( s.length() > 0 ) {
			s = s.substring(0,s.length()-1);
		}
		sb = null ;
		return s ;
	}

	
	public static int C(int m,int n) {
		return PluginUtil.C(m, n);
	}
	
	public static String toKeyString(String pcode) {
		if ( pcode != null && pcode.length() > 0) {
			StringBuffer sb = new StringBuffer();
			String pp = PluginUtil.replaceString(pcode, ",", "");
			for (int j=0;j<pp.length();j++) {
				sb.append(pp.substring(j, j+1)).append("|");
			}
			return sb.toString();
		} else {
			return "";
		}
	}
	
	public abstract GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException ;
	
	public abstract int getRealGrade(int awardgrade);

	public abstract GameCastCode parseGameCastCode(String s) throws CodeFormatException;

	public abstract int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum);
	
	public abstract String toPrintCode(GameCastCode gcc) ;
	
	public abstract HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception;
}