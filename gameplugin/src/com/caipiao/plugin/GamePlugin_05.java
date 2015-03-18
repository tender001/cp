package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 福彩3D（03）
 * 
 * @author zhurong.chen
 * 
 */
public class GamePlugin_05 extends GamePluginAdapter {

	// 3D玩法
	public static final byte TDPLAYTYPE_SINGLE3 = 1; // 单选3
	public static final byte TDPLAYTYPE_COMBINATION3 = 2; // 组选3
	public static final byte TDPLAYTYPE_COMBINATION6 = 3; // 组选6

	private static int[] heshuSingle = new int[] { 2, 6, 12, 20, 30, 42, 56, 72, 90, 110, 126, 138, 146, 150, 150, 146, 138, 126, 110, 90, 72, 56, 42, 30, 20, 12, 6, 2 };
	private static int[] heshuCom3 = new int[] { 0, 2, 4, 2, 6, 6, 6, 8, 10, 8, 10, 10, 8, 10, 10, 8, 10, 10, 8, 10, 8, 6, 6, 6, 2, 4, 2, 0 };
	private static int[] heshuCom6 = new int[] { 0, 0, 0, 2, 2, 4, 6, 8, 10, 14, 16, 18, 20, 20, 20, 20, 18, 16, 14, 10, 8, 6, 4, 2, 2, 0, 0, 0 };

	private static int[] baohaoSingle = new int[] { 0, 16, 54, 128, 250, 432, 686, 0, 0, 0 };
	private static int[] baohaoCom3 = new int[] { 0, 4, 12, 24, 40, 60, 84, 112, 144, 180 };
	private static int[] baohaoCom6 = new int[] { 0, 0, 2, 8, 20, 40, 70, 112, 168, 240 };

	public GamePlugin_05() {
		this.setGameID("05");
		this.setGameName("福彩3D");
		this.setGradeNum(3);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];

		byte cm = code.getCastMethod();
		byte pm = code.getPlayMethod();

		int g = getRealGrade(pm);

		if (cm == GameCastMethodDef.CASTTYPE_BAOHAO) {// 包号
			if (pm == TDPLAYTYPE_SINGLE3) {// 直选3
				int n = Long.bitCount(code.getFirst() & bingoCode.getFirst());
				n += Long.bitCount(code.getFirst() & bingoCode.getSecond());
				n += Long.bitCount(code.getFirst() & bingoCode.getThird());
				if (n == 3) {
					levels[g] = 1;
				}

			} else if (pm == TDPLAYTYPE_COMBINATION3) {// 组3
				int sames = same(bingoCode.getFirst(), bingoCode.getSecond(), bingoCode.getThird());
				if (sames == 2) {
					int n = Long.bitCount(code.getFirst() & bingoCode.getFirst());
					n += Long.bitCount(code.getFirst() & bingoCode.getSecond());
					n += Long.bitCount(code.getFirst() & bingoCode.getThird());
					if (n == 3) {
						levels[g] = 1;
					}
				}
			} else if (pm == TDPLAYTYPE_COMBINATION6) {// 组6
				int sames = same(bingoCode.getFirst(), bingoCode.getSecond(), bingoCode.getThird());
				if (sames == 0) {
					int n = Long.bitCount(code.getFirst() & bingoCode.getFirst());
					n += Long.bitCount(code.getFirst() & bingoCode.getSecond());
					n += Long.bitCount(code.getFirst() & bingoCode.getThird());
					if (n == 3) {
						levels[g] = 1;
					}
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值

			int he = (int) bingoCode.getBackupNo();
			long lh = 1L << he;

			if (pm == TDPLAYTYPE_SINGLE3) {// 直选3
				if (Long.bitCount(code.getFirst() & lh) == 1) {
					levels[g] = 1;
				}

			} else if (pm == TDPLAYTYPE_COMBINATION3) {// 组3
				int sames = same(bingoCode.getFirst(), bingoCode.getSecond(), bingoCode.getThird());
				if (sames == 2) {
					if (Long.bitCount(code.getFirst() & lh) == 1) {
						levels[g] = 1;
					}
				}

			} else if (pm == TDPLAYTYPE_COMBINATION6) {// 组6
				int sames = same(bingoCode.getFirst(), bingoCode.getSecond(), bingoCode.getThird());
				if (sames == 0) {
					if (Long.bitCount(code.getFirst() & lh) == 1) {
						levels[g] = 1;
					}
				}
			}
		} else {// 单复式
			switch (pm) {
			case TDPLAYTYPE_SINGLE3: {// 直选3
				int n1 = Long.bitCount(code.getFirst() & bingoCode.getFirst());
				int n2 = Long.bitCount(code.getSecond() & bingoCode.getSecond());
				int n3 = Long.bitCount(code.getThird() & bingoCode.getThird());

				if (n1 == 1 && n2 == 1 && n3 == 1) {
					levels[g] = 1;
				}

				break;
			}
			case TDPLAYTYPE_COMBINATION3: {// 组3
				long f1 = bingoCode.getFirst();
				long a = 0, c = 0; // a是相同 c是不相同

				if (f1 == bingoCode.getSecond()) {// 第一个和第二个相同
					if (f1 == bingoCode.getThird()) {
						f1 = 0;
					} else {
						f1 = bingoCode.getThird();
						a = bingoCode.getFirst();
						c = bingoCode.getThird();
					}
				} else {
					if (f1 == bingoCode.getThird()) {// 第一个和第三个相同
						f1 = bingoCode.getSecond();

						a = bingoCode.getFirst();
						c = bingoCode.getSecond();

					} else {
						if (bingoCode.getSecond() == bingoCode.getThird()) {// 第二个和第三个相同
							f1 = bingoCode.getFirst();
							a = bingoCode.getSecond();
							c = bingoCode.getFirst();
						} else {
							f1 = 0;
						}
					}
				}
				if (f1 != 0) {
					int n = Long.bitCount(code.getFirst() & a);
					n += Long.bitCount(code.getThird() & c);
					if (n >= 2) {
						if (Long.bitCount(code.getThird() & c) == 1) {
							levels[g] = 1;
						}
					}
				}

				break;
			}
			case TDPLAYTYPE_COMBINATION6: {// 组6
				int sames = same(bingoCode.getFirst(), bingoCode.getSecond(), bingoCode.getThird());
				if (sames == 0) {
					int num = Long.bitCount(code.getFirst() & bingoCode.getFirst());
					num += Long.bitCount(code.getFirst() & bingoCode.getSecond());
					num += Long.bitCount(code.getFirst() & bingoCode.getThird());
					if (num == 3) {
						levels[g] = 1;
					}
				}

				break;
			}
			}
		}
		return levels;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode obj = new GameAwardCode();

			int[] bcode = PluginUtil.SplitterInt(awardCode, ",");
			long first = 1L << bcode[0];
			long second = 1L << bcode[1];
			long third = 1L << bcode[2];

			obj.setSingleCode(bcode);

			obj.setFirst(first);
			obj.setSecond(second);
			obj.setThird(third);
			obj.setAwardCode(awardCode);

			obj.setBackupNo(bcode[0] + bcode[1] + bcode[2]);

			if ( bcode.length != 3 ) {
				throw new Exception("号码必须是3个位置");
			}
			for ( int i=0;i<3;i++) {
				if ( bcode[i] > 9 || bcode[i] < 0 ) {
					throw new Exception("号码必须在0-9之间");
				}
			}
			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3) 号码必须在0-9, 必须有3个位置" , awardCode);
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

		int minNum = 0;
		int maxNum = 9;

		byte pm = 0, cm = 0;
		int money = 0;

		try {
			String[] tmpCode = PluginUtil.splitter(s, ":");
			if (tmpCode.length < 3) {
				throw new CodeFormatException(1, "投注格式错误", s);
			}

			pm = PluginUtil.toByte(tmpCode[1]);
			cm = PluginUtil.toByte(tmpCode[2]);

			if (cm == GameCastMethodDef.CASTTYPE_BAOHAO) {// 包号
				int[] f = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(f, minNum, maxNum);

				if (pm == TDPLAYTYPE_SINGLE3) {// 直选
					money = baohaoSingle[f.length - 1];
				} else if (pm == TDPLAYTYPE_COMBINATION3) {// 组三
					money = baohaoCom3[f.length - 1];
				} else if (pm == TDPLAYTYPE_COMBINATION6) {// 组六
					money = baohaoCom6[f.length - 1];
				} else {// 不支持的玩法
					throw new CodeFormatException(1, "投注格式错误 包号玩法不存在", s);
				}

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 包号选球错误", s);
				}

			} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
				int[] f = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(f, minNum, 27);

				if (pm == TDPLAYTYPE_SINGLE3) {// 直选
					for (int i = 0; i < f.length; i++) {
						money += (heshuSingle[f[i]]);
					}
				} else if (pm == TDPLAYTYPE_COMBINATION3) {// 组三
					for (int i = 0; i < f.length; i++) {
						money += (heshuCom3[f[i]]);
					}
				} else if (pm == TDPLAYTYPE_COMBINATION6) {// 组六
					for (int i = 0; i < f.length; i++) {
						money += (heshuCom6[f[i]]);
					}
				} else {// 不支持的玩法
					throw new CodeFormatException(1, "投注格式错误 和值玩法不存在", s);
				}

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 和值选球错误", s);
				}

			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				switch (pm) {
				case TDPLAYTYPE_SINGLE3: {// 直选
					String[] codes = PluginUtil.splitter(tmpCode[0], ",");
					if (codes.length != 3) {
						throw new CodeFormatException(1, "直选3选球错误", s);
					}

					int[] f1 = PluginUtil.stringToInt(codes[0], minNum, maxNum);
					int[] f2 = PluginUtil.stringToInt(codes[1], minNum, maxNum);
					int[] f3 = PluginUtil.stringToInt(codes[2], minNum, maxNum);

					first = PluginUtil.convertBallToLong(f1, minNum, maxNum);
					second = PluginUtil.convertBallToLong(f2, minNum, maxNum);
					third = PluginUtil.convertBallToLong(f3, minNum, maxNum);

					money = 2 * f1.length * f2.length * f3.length;

					break;
				}
				case TDPLAYTYPE_COMBINATION3: {// 组三
					String[] codes = PluginUtil.splitter(tmpCode[0], ",");
					if (codes.length != 3) {
						throw new CodeFormatException(1, "组选3选球错误 1", s);
					}
					int[] f1 = PluginUtil.stringToInt(codes[0], minNum, maxNum);
					int[] f2 = PluginUtil.stringToInt(codes[1], minNum, maxNum);
					int[] f3 = PluginUtil.stringToInt(codes[2], minNum, maxNum);

					long ff1 = PluginUtil.convertBallToLong(f1, minNum, maxNum);
					long ff2 = PluginUtil.convertBallToLong(f2, minNum, maxNum);
					long ff3 = PluginUtil.convertBallToLong(f3, minNum, maxNum);

					if (ff1 == ff2 && ff2 == ff3 && ff1 == ff3) {
						throw new CodeFormatException(2, "组选3选球错误 2", s);
					}
					if (ff1 != ff2 && ff2 != ff3 && ff1 != ff3) {
						throw new CodeFormatException(3, "组选3选球错误 3", s);
					}

					if (ff1 == ff2) {
						first = ff1;
						second = first;
						third = ff3;
					} else if (ff1 == ff3) {
						first = ff1;
						second = first;
						third = ff2;
					} else if (ff2 == ff3) {
						first = ff2;
						second = first;
						third = ff1;
					} else {
						throw new CodeFormatException(4, "组选3选球错误 4", s);
					}

					int num = Long.bitCount(first & third);
					money = 2 * (f1.length * f2.length - num);

					if (money != 2) {
						throw new CodeFormatException(1, "组选3选球错误 不支持分位复式", s);
					}

					break;
				}
				case TDPLAYTYPE_COMBINATION6: {// 组六
					if (tmpCode[0].length() < 3) {
						throw new CodeFormatException(1, "组选6选球错误", s);
					}
					int[] f1 = PluginUtil.SplitterInt(tmpCode[0], ",");
					first = PluginUtil.convertBallToLong(f1, minNum, maxNum);
					money = 2 * PluginUtil.C(3, f1.length);
					if (money != 2) {
						throw new CodeFormatException(1, "组选6选球错误 不支持分位复式", s);
					}
					break;
				}
				default: {
					throw new CodeFormatException(1, "投注格式错误 玩法不存在", s);
				}
				}
				
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

	private int same(long a, long b, long c) {
		if (a == b && a == c) {
			return 3;
		}
		if (a == b || b == c || a == c) {
			return 2;
		}
		return 0;
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
		}

		if ( cm == GameCastMethodDef.CASTTYPE_SINGLE) {//单式
			money = 0;
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);
				pcode = PluginUtil.replaceString(pcode, ",", "");

				str1 += toKeyString(pcode);
				if (gccs[i].getPlayMethod() != TDPLAYTYPE_SINGLE3) {
					str1 += "|A|";
				}
				str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));

				money += gccs[i].getCastMoney() * muli;
				if ( pm == -1 ){
					pm = gccs[i].getPlayMethod();
				} else {
//					if ( pm != gccs[i].getPlayMethod()) {						
//						throw new Exception("玩法必须相同");
//					}
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_MULTI){//复式
			String pcode = toPrintCode(gccs[0]);
			String[] ss = PluginUtil.splitter(pcode, ",");
			str1 = toKeyString(ss[0]);
			str2 = toKeyString(ss[1]);
			str3 = toKeyString(ss[2]);
		} else if ( cm == GameCastMethodDef.CASTTYPE_BAOHAO) {
			String pcode = toPrintCode(gccs[0]);
			pcode = PluginUtil.replaceString(pcode, ",", "");
			str1 += toKeyString(pcode);
		} else if ( cm == GameCastMethodDef.CASTTYPE_HESHU) {
			String pcode = toPrintCode(gccs[0]);
			pcode = PluginUtil.replaceString(pcode, ",", "");
			str1 += toKeyString(pcode);
		}

		maps.put("$01", str1);
		maps.put("$02", str2);
		maps.put("$03", str3);

		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");

		return maps;

	}
	
	
	public static void main(String[] args) throws Exception {
		GamePlugin_05 p = new GamePlugin_05();

		String code = "2,5,8:1:3:1";
		GameCastCode gcc = p.parseGameCastCode(code);
		System.out.println(p.toPrintCode(gcc));
		System.out.println(p.keyBoardParser(code, 1));
	}
}
