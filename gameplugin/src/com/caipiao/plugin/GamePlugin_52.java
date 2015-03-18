package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 排列五（52）
 * 
 * @author zhurong.chen
 * 
 */

public class GamePlugin_52 extends GamePluginAdapter {

	public GamePlugin_52(){
		this.setGameID("52");
		this.setGameName("排列五");
		this.setGradeNum(1);
	}
	
	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		short mu = 1;

		long cc = code.getFirst();
		long bc = bingoCode.getFirst();

		int n = Long.bitCount(cc & bc);
		if (n == 5) {
			levels[0] = mu;
		}

		return levels;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode obj = new GameAwardCode();
	
			long first = 0;
			long backNo = 0;
			int[] bcode = PluginUtil.SplitterInt(awardCode, ",");
			for (int i = 0; i < bcode.length; i++) {
				first |= 1L << (bcode[i] + i * 10);
				backNo += bcode[i];
			}
	
			obj.setSingleCode(bcode);
	
			obj.setFirst(first);
			obj.setSecond(0);
			obj.setThird(0);
			obj.setAwardCode(awardCode);
	
			obj.setBackupNo(backNo);
			
			if (bcode.length != 5) {
				throw new Exception("号码必须是5个位置");
			}
			for (int i = 0; i < 5; i++) {
				if (bcode[i] > 9 || bcode[i] < 0) {
					throw new Exception("号码必须在0-9之间");
				}
			}
			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5) 号码必须在0-9, 必须有5个位置", awardCode);
		}
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return awardgrade - 1;
	}

	@Override
	public GameCastCode parseGameCastCode(String s) throws CodeFormatException {
		long first = 0;
		long second = 0;
		long third = 0;

		byte pm = 0, cm = 0;
		int money = 0;

		try {
			String[] tmpCode = PluginUtil.splitter(s, ":");
			if (tmpCode.length < 3) {
				throw new CodeFormatException(1, "投注格式错误", s);
			}

			pm = PluginUtil.toByte(tmpCode[1]);
			cm = PluginUtil.toByte(tmpCode[2]);

			if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				String[] codes = PluginUtil.splitter(tmpCode[0], ",");
				if (codes.length != 5) {
					throw new CodeFormatException(1, "选球错误", s);
				}

				int[] f1 = PluginUtil.stringToInt(codes[0], 0, 9);
				int[] f2 = PluginUtil.stringToInt(codes[1], 0, 9);
				int[] f3 = PluginUtil.stringToInt(codes[2], 0, 9);
				int[] f4 = PluginUtil.stringToInt(codes[3], 0, 9);
				int[] f5 = PluginUtil.stringToInt(codes[4], 0, 9);

				for (int i = 0; i < f1.length; i++) {
					first |= (1L << f1[i]);
				}
				for (int i = 0; i < f2.length; i++) {
					first |= (1L << (f2[i] + 10));
				}
				for (int i = 0; i < f3.length; i++) {
					first |= (1L << (f3[i] + 20));
				}
				for (int i = 0; i < f4.length; i++) {
					first |= (1L << (f4[i] + 30));
				}
				for (int i = 0; i < f5.length; i++) {
					first |= (1L << (f5[i] + 40));
				}
				money = 2 * f1.length * f2.length * f3.length * f4.length * f5.length;
				
				if ( money > 2 * 1 ) {
					cm = GameCastMethodDef.CASTTYPE_MULTI;
				} else {
					cm = GameCastMethodDef.CASTTYPE_SINGLE;
				}

				
//				if ( cm == GameCastMethodDef.CASTTYPE_SINGLE ) {
//					if ( money != 2 ) {
//						throw new CodeFormatException(1, "投注方式不正确 应该为单式投注", s);
//					}
//				} else {
//					if ( money == 2 ) {
//						throw new CodeFormatException(1, "投注方式不正确 应该为复式投注", s);
//					}
//				}
			} else {
				throw new CodeFormatException(1, "投注金额不能为零", s);
			}
		} catch (CodeFormatException ce) {
			throw ce;
		} catch (Exception e) {
			throw new CodeFormatException(1, "投注格式错误 " + e.getMessage(), s);
		}

		GameCastCode cc = new GameCastCode();
		cc.setFirst(first);
		cc.setSecond(second);
		cc.setThird(third);
		cc.setCastMethod(cm);
		cc.setPlayMethod(pm);
		cc.setCastMoney(money);
		cc.setSourceCode(s);
		return cc;
	}
	
	public String toPrintCode(GameCastCode gcc) {
		String s = gcc.getSourceCode();
		String[] tmpCode = PluginUtil.splitter(s, ":");
		return tmpCode[0];
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {

		HashMap<String,String> maps = new HashMap<String,String>();
		
		String str1 = "";
		String str2 = "";
		String str3 = "";
		String str4 = "";
		String str5 = "";

		int cm = -1;
		int pm = -1;
		int money = -1;

		GameCastCode[] gccs = parseGameCastCodes(codes);
		if ( gccs.length > 1) {
			cm = 1;
		} else {
			cm = gccs[0].getCastMethod();
			pm = gccs[0].getPlayMethod();
			money = gccs[0].getCastMoney() * muli;
			
			
			if ( cm == GameCastMethodDef.CASTTYPE_SINGLE && gccs[0].getCastMoney() > 2) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			}
			if ( cm == GameCastMethodDef.CASTTYPE_MULTI && gccs[0].getCastMoney() == 2) {
				cm = GameCastMethodDef.CASTTYPE_SINGLE;
			}
		}
		pm = 1;//固定为1
		
		if ( cm == 1) {//单式
			money = 0;
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);
				pcode = PluginUtil.replaceString(pcode, ",", "");
				str1 += toKeyString(pcode);
				
				money += gccs[i].getCastMoney() * muli;
				
//				if ( pm == -1 ){
//					pm = gccs[i].getPlayMethod();
//				} else {
//					if ( pm != gccs[i].getPlayMethod()) {
//						throw new Exception("玩法必须相同");
//					}
//				}
			}
		} else if (cm == 2){//复式
			String pcode = toPrintCode(gccs[0]);
			String[] ss = PluginUtil.splitter(pcode, ",");
			str1 = toKeyString(ss[0]);
			str2 = toKeyString(ss[1]);
			str3 = toKeyString(ss[2]);
			str4 = toKeyString(ss[3]);
			str5 = toKeyString(ss[4]);			
		} 

		maps.put("$01", str1);
		maps.put("$02", str2);
		maps.put("$03", str3);
		maps.put("$04", str4);
		maps.put("$05", str5);

		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");

		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		String code = "7,1,9,6,1:23:1;3,2,8,9,1:23:1";
		GamePlugin_52 p = new GamePlugin_52();
		p.parseGameCastCodes(code);
	}
}