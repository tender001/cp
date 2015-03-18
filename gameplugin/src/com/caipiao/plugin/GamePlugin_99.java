package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.util.StringUtil;

/**
 * 竞彩名次竞猜冠亚军
 * @author Siva
 *
 */
public class GamePlugin_99 extends GamePluginAdapter {
	
	private static final int MIN = 1;
	private static final int MAX = 50;
	
	public GamePlugin_99() {
		this.setGameID("99");
		this.setGameName("冠亚军");
		this.setGradeNum(50);
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode gac = new GameAwardCode();
			int [] cs = PluginUtil.SplitterInt(awardCode, ",");
			long first = PluginUtil.convertBallToLong(cs, MIN, MAX);
			gac.setFirst(first);
			gac.setAwardCode(awardCode);
			return gac;
		} catch (Exception e) {
			throw new CodeFormatException(5, e.getMessage(), awardCode);
		}
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}

	@Override
	public GameCastCode parseGameCastCode(String code) throws CodeFormatException {
		GameCastCode gcc = new GameCastCode();
		
		String[] parts = PluginUtil.splitter(code, "|");
		if ( parts.length != 2 ) {
			throw new CodeFormatException(5, "格式不符合要求  必须是(GYJ|号码)", code);
		}
		if ( !parts[0].equalsIgnoreCase("GYJ")) {
			throw new CodeFormatException(5, "格式不符合要求  必须以GYJ|开头", code);
		}
		
		String[] codes = PluginUtil.splitter(parts[1], "=");
		if ( codes.length != 2 ) {
			throw new CodeFormatException(5, "格式不符合要求", code);
		}

		try {
			int [] cs = PluginUtil.SplitterInt(codes[1], "/");
			long first = PluginUtil.convertBallToLong(cs, MIN, MAX);
			
			if(Long.bitCount(first) != cs.length){
				throw new CodeFormatException(5, "投注号码有重复", code);
			}
			
			for(int i=0;i<cs.length;i++){
				gcc.putCast(codes[0] + StringUtil.LeftPad(String.valueOf(cs[i]), "0", 2));
			}
			
			gcc.setFirst(first);
			gcc.setSourceCode(code);
			gcc.setCastMoney(2 * Long.bitCount(first));	
			gcc.setMatchID(getSourceEx(first, 1, ","));
		} catch (Exception e) {
			throw new CodeFormatException(5, e.getMessage(), code);
		}
		return gcc;
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int [] rs = new int[gradeNum];
		long l = bingoCode.getFirst() & code.getFirst();
		for(int i = 1; i <= gradeNum; i++){
			if(Long.bitCount(l & (1L << i)) == 1){
				rs[i - 1] = 1;
			}
		}
		return rs;
	}

	@Override
	public String toPrintCode(GameCastCode gcc) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		HashMap<String,String> maps = new HashMap<String,String>();
		String str1 = "";

		GameCastCode gcc = this.parseGameCastCode(codes);
		int money = gcc.getCastMoney() * muli;
		String[] ss = PluginUtil.splitter(codes, "|");
		String code = ss[1];
		ss = PluginUtil.splitter(code, "=");
		String[] sss = PluginUtil.splitter(ss[1], "/");
		
		for (int i=0;i<sss.length;i++) {
			str1 += PluginUtil.LeftPad(sss[i], "0", 2); 
		}

		maps.put("$01", str1);
		maps.put("$nums", "0");
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		return maps;
	}
	
	public static void main(String[] args) {
		GamePlugin_99 plugin = new GamePlugin_99();
		try {
			GameCastCode gcc = plugin.parseGameCastCode("GYJ|12001=1/3/5/7/8/16/50");
			System.out.println(gcc.getCastMoney());
			GameAwardCode gac = plugin.buildAwardCode("1");
			int [] rs = plugin.bingoMatcher(gcc, gac, plugin.getGradeNum());
			for(int s : rs){
				System.out.println(s);
			}
			System.out.println();
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
	}
}
