package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 七星彩（51）
 * 
 * @author zhurong.chen
 * 
 */

public class GamePlugin_51 extends GamePluginAdapter {

	public GamePlugin_51() {
		this.setGameID("51");
		this.setGameName("七星彩");
		this.setGradeNum(6);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		short mu = 1;

		long cc = code.getFirst();
		long bc = bingoCode.getFirst();

		int[] cnums = new int[7];// 各位的选球数
		for (int i = 0; i < 6; i++) {
			cnums[i] = Long.bitCount(cc & (0x3FFL << (i * 10)));
		}
		cnums[6] = Long.bitCount(code.getSecond() & 0x3FFL);

		int[] bnums = new int[7];// 各位的中球数
		int[] dnums = new int[7];// 各位的未中球数
		for (int i = 0; i < 6; i++) {
			bnums[i] = Long.bitCount(bc & (cc & (0x3FFL << (i * 10))));
			dnums[i] = cnums[i] - bnums[i];
		}
		bnums[6] = Long.bitCount(bingoCode.getSecond() & (code.getSecond() & 0x3FFL));
		dnums[6] = cnums[6] - bnums[6];

		byte f = 0;
		for (int i = 0; i < bnums.length; i++) {
			if (bnums[i] == 1) {
				f |= 0x01 << i;
			}
		}

		//中7个
		if (f == 0x7F) {// 7个
			levels[0] = mu;
		}  
		
		//中6个
		if (same(f,0x3F) ) {// 6个
			levels[1] += mu * dnums[6];
		} 
		if (same(f,(0x3F << 1)) ) {// 6个
			levels[1] += mu * dnums[0];
		} 
		
		//中5个
		if ( same(f,0x1f)) {// 5个 12345**
			levels[2] += mu * (dnums[5] * cnums[6]);
		} 
		if ( same(f,(0x1f << 1)) ) {// 5个 *23456*
			levels[2] += mu * (dnums[6] * dnums[0]);
		} 
		if ( same(f,(0x1f << 2)) ) {// 5个 **34567
			levels[2] += mu * (cnums[0] * dnums[1]);
		}


			
		//中4个
		if (same(f,0x0f)) {// 4个 1234***
			levels[3] += mu * (dnums[4] * cnums[5] * cnums[6]);
		} 
		if (same(f,(0x0f << 1))) {// 4个 *2345**
			levels[3] += mu * (dnums[0] * dnums[5] * cnums[6]);
		} 
		if (same(f,(0x0f << 2))) {// 4个	**3456*
			levels[3] += mu * (cnums[0] * dnums[1] * dnums[6]);
		} 
		if (same(f,(0x0f << 3))) {// 4个 ***4567
			levels[3] += mu * (cnums[0] * cnums[1] * dnums[2]);
		} 

		//中3个
		if (same(f,0x07) && same(f,(0x07 << 4))) {// 3个  123****&&****567 
			levels[4] += mu * (dnums[3] * (cnums[4] * cnums[5] * cnums[6] + cnums[2] * cnums[1] * cnums[0] - 1));
		}else if (same(f,0x07)) {// 3个 123****
			levels[4] += mu * (dnums[3] * cnums[4] * cnums[5] * cnums[6]);
		} else if (same(f,(0x07 << 4))) {// 3个 ****567 
			levels[4] += mu * (dnums[3] * cnums[2] * cnums[1] * cnums[0]);
		} 
		if (same(f,(0x07 << 1))) {// 3个 *234***
			levels[4] += mu * (dnums[0] * dnums[4] * cnums[5] * cnums[6]);
		} 
		if (same(f,(0x07 << 2))) {// 3个 **345**
			levels[4] += mu * (dnums[1] * dnums[5] * cnums[0] * cnums[6]);
		} 
		if (same(f,(0x07 << 3))) {// 3个 ***456*
			levels[4] += mu * (dnums[2] * dnums[6] * cnums[1] * cnums[0]);
		} 
			
		//中2个
		if (same(f,0x03)) {// 2个 12*****			
			levels[5] += mu * (dnums[2] * cnums[3] * cnums[4] * cnums[5] * cnums[6]);
			if(same(f, (0xf << 3))){
				levels[5] += mu * (0 - dnums[2]);
			}
			if(same(f, (0x7 << 3))){
				levels[5] += mu * (0 - dnums[2] * dnums[6]);
			}
			if(same(f, (0x7 << 4))){
				levels[5] += mu * (0 - dnums[2] * dnums[3]);
			}
		} 
		if (same(f,(0x03 << 1))) {// 2个 *23****
			levels[5] += mu * (dnums[3] * cnums[4] * cnums[5] * cnums[6] * dnums[0]);
			if (same(f,(0x07 << 4))) {
				levels[5] += mu * (0 - dnums[0] * dnums[3]);
			}
		} 
		if (same(f,(0x03 << 2))) {// 2个 **34***
			levels[5] += mu * (dnums[4] * cnums[5] * cnums[6] * dnums[1] * cnums[0]);
		} 
		if (same(f,(0x03 << 3))) {// 2个 ***45**
			levels[5] += mu * (dnums[5] * cnums[6] * dnums[2] * cnums[1] * cnums[0]);
			if (same(f,0x03)) {
				levels[5] += mu * (0 - dnums[2] * dnums[5] * cnums[6]);
			}
		} 
		if (same(f,(0x03 << 4))) {// 2个 ****56*
			levels[5] += mu * (dnums[6] * dnums[3] * cnums[2] * cnums[1] * cnums[0]);
			if(same(f, 0x7)){
				levels[5] += mu * (0 - dnums[3] * dnums[6]);
			}
			if (same(f,0x03)) {
				levels[5] += mu * (0 - dnums[2] * dnums[3] * dnums[6]);
			}
			if (same(f,(0x03 << 1))) {
				levels[5] += mu * (0 - dnums[0] * dnums[3] * dnums[6]);
			}
		} 
		if (same(f,(0x03 << 5))) {// 2个 *****67			
			levels[5] += mu * (cnums[0] * cnums[1] * cnums[2] * cnums[3] * dnums[4]);
			if(same(f, 0xf)){
				levels[5] += mu * (0 - dnums[4]);
			}
			if(same(f, 0x7)){
				levels[5] += mu * (0 - dnums[3] * dnums[4]);
			}
			if(same(f, (0x7 << 1))){
				levels[5] += mu * (0 - dnums[0] * dnums[4]);
			}
			if (same(f,0x03)) {
				levels[5] += mu * (0 - dnums[2] * cnums[3] * dnums[4]);
			}
			if (same(f,(0x03 << 1))) {
				levels[5] += mu * (0 - dnums[0] * dnums[3] * dnums[4]);
			}
			if (same(f,(0x03 << 2))) {
				levels[5] += mu * (0 - cnums[0] * dnums[1] * dnums[4]);
			}
		}
		return levels;
	}
	
	private static boolean same(long f,long b) {
		return ( f & b ) == b ;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode obj = new GameAwardCode();

			long first = 0;
			long second = 0;
			long backNo = 0;
			int[] bcode = PluginUtil.SplitterInt(awardCode, ",");
			for (int i=0;i<bcode.length-1;i++) {
				first |= 1L << (bcode[i] + i * 10);
				backNo += bcode[i];
			}
			second |= 1L << bcode[6];
			
			obj.setSingleCode(bcode);

			obj.setFirst(first);
			obj.setSecond(second);
			obj.setThird(0);
			obj.setAwardCode(awardCode);
			obj.setBackupNo(backNo);

			if (bcode.length != 7) {
				throw new Exception("号码必须是7个位置");
			}
			for (int i = 0; i < 7; i++) {
				if (bcode[i] > 9 || bcode[i] < 0) {
					throw new Exception("号码必须在0-9之间");
				}
			}

			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5,6,7) 号码必须在0-9, 必须有7个位置", awardCode);
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
		short mu = 1;
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
				if (codes.length != 7) {
					throw new CodeFormatException(1, "选球错误", s);
				}
				int[] f1 = PluginUtil.stringToInt(codes[0], 0, 9);
				int[] f2 = PluginUtil.stringToInt(codes[1], 0, 9);
				int[] f3 = PluginUtil.stringToInt(codes[2], 0, 9);
				int[] f4 = PluginUtil.stringToInt(codes[3], 0, 9);
				int[] f5 = PluginUtil.stringToInt(codes[4], 0, 9);
				int[] f6 = PluginUtil.stringToInt(codes[5], 0, 9);
				int[] f7 = PluginUtil.stringToInt(codes[6], 0, 9);

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
				for (int i = 0; i < f6.length; i++) {
					first |= (1L << (f6[i] + 50));
				}
				for (int i = 0; i < f7.length; i++) {
					second |= (1L << f7[i]);
				}
				money = 2 * f1.length * f2.length * f3.length * f4.length * f5.length * f6.length * f7.length * mu;
				
				if ( money > 2 * mu ) {
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
		String str6 = "";
		String str7 = "";
//		String strm = "";//倍数
//		String strp = "";//密码
		
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
				
				if ( pm == -1 ){
					pm = gccs[i].getPlayMethod();
				} else {
					if ( pm != gccs[i].getPlayMethod()) {
						throw new Exception("玩法必须相同");
					}
				}
			}
		} else if (cm == 2){//复式
			String pcode = toPrintCode(gccs[0]);
			String[] ss = PluginUtil.splitter(pcode, ",");
			str1 = toKeyString(ss[0]);
			str2 = toKeyString(ss[1]);
			str3 = toKeyString(ss[2]);
			str4 = toKeyString(ss[3]);
			str5 = toKeyString(ss[4]);
			str6 = toKeyString(ss[5]);
			str7 = toKeyString(ss[6]);
		} 

		maps.put("$01", str1);
		maps.put("$02", str2);
		maps.put("$03", str3);
		maps.put("$04", str4);
		maps.put("$05", str5);
		maps.put("$06", str6);
		maps.put("$07", str7);
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");

		return maps;
	}

	
	public static void main(String[] args) throws Exception {
//		for (int i=0;i<6;i++) {
//			System.out.println(same(7,0x03<<i));
//		}
		GamePlugin_51 g51 = new GamePlugin_51();
		GameAwardCode gac = g51.buildAwardCode("1,2,3,4,5,6,7");
		
		GameCastCode[] gcc = g51.parseGameCastCodes("1,2,3,7,5,6,7:1:1");
		
//		GameCastCode gcc = g51.parseGameCastCode("2,3,1,3,4,7,8:1:1;1,5,7,07,1,0,1:1:1;0,1,0,9,1,5,8:1:1;7,9,3,4,2,5,5:1:1;1,1,3,9,3,4,1:1:1");
		
//		for (int j=0;j<gcc.length;j++) {
			int[] rs = g51.bingoMatch(gcc, gac, 6);
			if ( rs != null ) {
				for (int i = 0; i < rs.length; i++) {
//					if ( rs[i] > 0 ) {
//						System.out.println(gcc.getSourceCode());
//					}
					System.out.println("rc[" + i + "]=" + rs[i]);
				}
//				System.out.println();
			} else {
				System.out.println("没有中奖");
			}
//		}
		
		
	}
}