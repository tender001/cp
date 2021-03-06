package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 足彩 胜平负
 * 
 * @author chenzhurong
 * 
 */

public class GamePlugin_80 extends GamePluginAdapter {

	public GamePlugin_80() {
		this.setGameID("80");
		this.setGradeNum(15);		
		setGameName("胜负彩");
	}
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode gac = new GameAwardCode();
			String tmpcode = awardCode.trim().replace("*", "013");
			String[] cs = tmpcode.split(",");
			int len = cs.length;
			if (len != 14) {
				throw new CodeFormatException(1, " 开奖号码格式不符合要求", awardCode);
			}
			long first = 0;
			for (int i = 0; i < len; i++) {
				String tmp = cs[i].trim();
				int tlen = tmp.length();
				for (int j = 0; j < tlen; j++) {
					int intValue = -1;
					try {
						intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
						if (intValue < 0 || intValue > 3 || intValue == 2) {
							throw new CodeFormatException(1, " 开奖号码格式不符合要求", awardCode);
						}
					} catch (Exception e) {
						throw new CodeFormatException(1, " 开奖号码格式不符合要求", awardCode);
					}
					first |= 1L << (4 * i + intValue);
				}
			}
			gac.setFirst(first);
			gac.setAwardCode(awardCode);
			return gac;
		} catch (Exception e) {
			throw new CodeFormatException(1, " 开奖号码不正确  正确格式为(1,0,3,1,0,1,3,0,1,0,3,1,*,1) 号码必须是[310*] 必须是14个位置", awardCode);
		}
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}

	@Override
	public GameCastCode parseGameCastCode(String code) throws CodeFormatException {
		long first = 0;
		long second = 0;
		long third = 0;

		byte pm = 0, cm = 0;
		int mu = 1;
		int money = 2 * mu;

		String[] tmpCode = PluginUtil.splitter(code.trim(), ":");
		if (tmpCode.length != 3) {
			throw new CodeFormatException(-1, getGameName() + "投注格式不符合要求", code);
		}
		pm = PluginUtil.toByte(tmpCode[1]);
		cm = PluginUtil.toByte(tmpCode[2]);

		money = 2 * mu;
		if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
			String[] cs = PluginUtil.splitter(tmpCode[0], ",");
			int len = cs.length;
			if (len != 14) {
				throw new CodeFormatException(1, getGameName() + "号码不符合要求", code);
			}
			int total = 0;
			for (int i = 0; i < len; i++) {
				String tmp = cs[i].trim();
				int tlen = tmp.length();
				money *= tlen;
				total += tlen;
				for (int j = 0; j < tlen; j++) {
					int intValue = -1;
					intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
					if (intValue < 0 || intValue > 3 || intValue == 2) {
						throw new CodeFormatException(1, getGameName() + "号码只能为[310]", code);
					}
					first |= 1L << (4 * i + intValue);
				}
			}
			if (Long.bitCount(first) != total) {
				throw new CodeFormatException(1, getGameName() + "号码有重复", code);
			}
			if (total < 14 || total > 38) {
				 throw new CodeFormatException(1, getGameName() +" 号码个数必须在14-38之间", code);
			}
			
			if ( money > 2 * mu ) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			} else {
				cm = GameCastMethodDef.CASTTYPE_SINGLE;
			}

		} else {
			throw new CodeFormatException(-1, getGameName() + "投注方式不支持", code);
		}

		GameCastCode cc = new GameCastCode();
		cc.setFirst(first);
		cc.setSecond(second);
		cc.setThird(third);
		cc.setCastMethod(cm);
		cc.setPlayMethod(pm);
		cc.setCastMoney(money);
		cc.setSourceCode(code);
		return cc;
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		int total = 0;

		int[] cnum = new int[14];// 号码数量
		int tnum = 1;// 总注数
		for (int i = 0; i < 14; i++) {
			cnum[i] = Long.bitCount(code.getFirst() & (0x0FL << (4 * i)));
			tnum *= cnum[i];
		}

		long[] alls = new long[tnum];
		int pos = 1;
		for (int i = 0; i < cnum.length; i++) {
			int n = 0;
			int[] cc = new int[cnum[i]];
			long ll = (code.getFirst() & (0x0FL << (i * 4))) >> (i * 4);
			for (int j = 0; j < 4; j++) {
				if (((ll & (1L << j)) >> j) == 1) {
					cc[n++] = j;
				}
			}
			int tmp = pos;
			for (int k = 1; k < cnum[i]; k++) {
				for (int j = 0; j < tmp; j++) {
					alls[pos] = alls[j];
					alls[pos] |= (1L << cc[k]) << (i * 4);
					pos++;
				}
			}
			for (int j = 0; j < tmp; j++) {
				alls[j] |= (1L << cc[0]) << (i * 4);
			}
		}
		for (int i = 0; i < alls.length; i++) {
			total = Long.bitCount(alls[i] & bingoCode.getFirst());
			levels[14 - total] += 1;
		}
		return levels;
	}
	
	public String toPrintCode(GameCastCode gcc) {
		String s = gcc.getSourceCode();
		String[] tmpCode = PluginUtil.splitter(s, ":");
		return tmpCode[0];
	}
	
	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {

		HashMap<String,String> maps = new HashMap<String,String>();

		String[] str = new String[14];
		for (int i=0;i<str.length;i++) {
			str[i] = "";
		}

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

		if ( cm == 1) {//单式
			money = 0;
			str[0] = "";
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);
				pcode = PluginUtil.replaceString(pcode, ",", "");
				str[0] += toKeyString(pcode);
				
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
			for (int i=0;i<ss.length;i++) {
				str[i] = toKeyString(ss[i]);
			}
		} 

		pm = 1;//固定为1
		
		for (int i=0;i<str.length;i++) {
			if ( str[i] != null && str[i].length() > 0 ) {
				if ( i<9) {
					maps.put("$0" + (i+1), str[i]);
				} else {
					maps.put("$" + (i+1), str[i]);
				}
			}
		}

		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");

		return maps;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_80 plugin = new GamePlugin_80();
		GameAwardCode gac = plugin.buildAwardCode("3,3,0,1,3,0,0,3,1,1,3,1,*,*");

		long l = System.currentTimeMillis();

//		File file = new File("C:\\javawork\\caipiao\\GamePlugin\\80.txt");
//		BufferedReader br = new BufferedReader(new FileReader(file));
//		String temp = null;
//
//		int[] tt = new int[15];
//		while ((temp = br.readLine()) != null) {
//			if (temp.length() == 14) {
//				String code = "";
//				for (int i = 0; i < 14; i++) {
//					code += temp.charAt(i) + ",";
//				}
//				code = code.substring(0, code.length() - 1);
//				code += ":1:1";
//				GameCastCode[] gcc = plugin.parseGameCastCodes(code);
//				int[] ll = plugin.bingoMatch(gcc, gac, 15);
//				if (ll != null) {
//					for (int i = 0; i < ll.length; i++) {
//						tt[i] += ll[i];
//					}
//				}
//			}
//		}
//		for (int i = 0; i < tt.length; i++) {
//			System.out.println(tt[i]);
//		}
//		br.close();

//		String code = "10,3,31,31,0,31,3,30,10,3,0,10,3,0:undefined:1";
		String code = "31,3,310,10,310,0,10,3,310,310,31,310,3,3:undefined:1";
//		 String code = "3,0,1,1,0,1,3,3,1,1,3,3,1,0:1:1;3,0,1,1,0,1,1,3,3,1,3,3,1,0:1:1;1,1,1,1,0,3,1,3,1,0,3,0,3,0:1:1;1,0,0,0,3,0,3,3,3,3,3,0,0,0:1:1;1,3,0,3,3,1,1,0,1,3,3,3,3,0:1:1;1,0,3,3,3,1,3,0,3,0,3,3,1,0:1:1;3,3,0,3,3,0,3,3,3,3,1,1,0,1:1:1;1,3,1,0,0,3,0,1,0,0,3,1,3,0:1:1;1,3,0,1,3,0,3,3,1,0,1,3,3,0:1:1;1,3,0,1,3,0,1,3,3,0,1,3,3,0:1:1;3,3,0,1,0,0,1,3,1,0,3,1,0,0:1:1;0,3,3,3,3,0,3,3,3,3,1,3,1,3:1:1;3,3,3,0,0,3,0,3,1,3,0,0,1,0:1:1;3,3,3,0,0,3,1,3,0,3,0,0,1,0:1:1;3,3,3,1,0,0,3,3,0,3,1,1,0,0:1:1;3,3,3,1,0,0,0,3,3,3,1,1,0,0:1:1;3,3,0,3,1,1,3,1,1,0,3,1,1,0:1:1;3,3,0,3,1,1,1,1,3,0,3,1,1,0:1:1;3,3,1,3,0,3,3,1,1,3,3,0,3,3:1:1;0,3,3,1,3,0,0,1,0,0,3,3,0,0:1:1;3,3,0,0,3,3,0,1,3,3,3,0,1,3:1:1;3,3,0,0,3,3,3,1,0,3,3,0,1,3:1:1;0,3,1,1,0,3,1,3,1,3,1,0,0,0:1:1;0,0,3,0,0,1,3,3,1,3,3,1,3,0:1:1;0,0,3,0,0,1,1,3,3,3,3,1,3,0:1:1;1,1,1,0,3,3,3,0,3,3,1,3,3,0:1:1;3,1,1,0,0,3,1,0,3,3,3,1,0,0:1:1;3,1,1,0,0,3,3,0,1,3,3,1,0,0:1:1;1,3,1,3,0,1,3,3,3,1,1,1,1,0:1:1;3,3,3,1,1,0,3,3,3,3,0,1,0,0:1:1;3,1,3,0,0,3,0,1,1,3,3,3,0,1:1:1;1,3,3,1,0,3,0,1,0,1,3,0,3,0:1:1;3,1,1,1,3,3,1,0,3,0,3,1,1,0:1:1;3,1,0,3,3,1,0,0,3,3,3,3,0,0:1:1;0,3,3,1,3,3,1,3,1,1,1,1,0,1:1:1;1,3,3,0,1,3,0,3,1,0,1,0,1,0:1:1;1,3,3,0,1,3,1,3,0,0,1,0,1,0:1:1;0,0,3,3,0,3,3,0,0,0,3,3,0,0:1:1;0,0,3,3,0,3,0,0,3,0,3,3,0,0:1:1;3,0,0,3,3,3,0,3,3,0,3,1,3,3:1:1;3,1,3,1,3,3,0,1,1,0,3,3,1,1:1:1;3,3,0,1,3,3,1,0,3,3,3,0,3,1:1:1;3,3,0,1,3,3,3,0,3,1,0,3,1,0:1:1;0,3,0,3,1,3,3,1,0,0,1,3,3,0:1:1;0,3,0,3,1,3,0,1,3,0,1,3,3,0:1:1;3,0,3,3,3,0,3,1,3,3,3,3,0,1:1:1;3,3,3,1,0,1,3,3,1,3,1,3,1,1:1:1;3,3,3,1,0,1,1,3,3,3,1,3,1,1:1:1;0,3,1,0,0,1,1,0,3,3,3,3,0,0:1:1;3,3,1,3,1,3,0,1,1,3,3,1,0,1:1:1";
		 GameCastCode[] gcc = plugin.parseGameCastCodes(code);
		 int[] ll = plugin.bingoMatch(gcc, gac, 15);
		 if (ll != null) {
			 for (int i = 0; i < ll.length; i++) {
				 System.out.println(ll[i]);
			 }
		 }
		System.out.println("所用时间=" + (System.currentTimeMillis() - l));

		GameCastCode gcc1 = plugin.parseGameCastCode(code);
		System.out.println(plugin.toPrintCode(gcc1));
		System.out.println(plugin.keyBoardParser(code, 1));

	}
}
