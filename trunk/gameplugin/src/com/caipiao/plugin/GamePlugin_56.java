package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 十一运夺金
 * @author djx
 *
 */
public class GamePlugin_56 extends GamePluginAdapter {

	private final static int[] nums = { 1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 2, 3 };
	private final static int[] mins = { 1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 2, 3 };
	private final static int[] maxs = { 6, 3, 4, 7, 10, 8, 9, 11, 11, 11, 8, 9 };

	public static final int R1 = 1;// 任选一
	public static final int R2 = 2;// 任选二
	public static final int R3 = 3;// 任选三
	public static final int R4 = 4;// 任选四
	public static final int R5 = 5;// 任选五
	public static final int R6 = 6;// 任选六
	public static final int R7 = 7;// 任选七
	public static final int R8 = 8;// 任选八
	public static final int Q2 = 9;// 前二直选
	public static final int Q3 = 10;// 前三直选
	public static final int Z2 = 11;// 前二组选
	public static final int Z3 = 12;// 前三组选

	public GamePlugin_56(){
		this.setGameID("56");
		this.setGameName("十一运夺金");
		this.setGradeNum(12);
	}
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			int[] cs = PluginUtil.SplitterInt(awardCode, ",");
			if (cs.length != 5) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求", awardCode);
			}
			long first;
			try {
				first = PluginUtil.convertBallToLong(cs, 1, 11);
			} catch (Exception e) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求", awardCode);
			}
			if ((first & 1L) == 1) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求 有0", awardCode);
			}
			GameAwardCode gac = new GameAwardCode();
			gac.setFirst(first);
			gac.setAwardCode(awardCode);
			gac.setSingleCode(cs);
			return gac;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + " 开奖号码不正确  正确格式为(1,2,3,4,5) 号码必须在1-11 必须有5个位置", awardCode);			
		}		
	}

	@Override
	public int getRealGrade(int awardgrade) {
		//  Auto-generated method stub
		return 0;
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

			int num = 0, min = 0, max = 0;
			num = nums[pm - 1];
			min = mins[pm - 1];
			max = maxs[pm - 1];

			if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {
				if (pm == Q2) {// Q2 前二直选
					String[] cs = PluginUtil.splitter(tmpCode[0], "|");
					int len = cs.length;
					if (len != 2) {
						throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
					}
					int[] tmp_cs_1 = PluginUtil.SplitterInt(cs[0], ",");
					int[] tmp_cs_2 = PluginUtil.SplitterInt(cs[1], ",");
					int len1 = tmp_cs_1.length, len2 = tmp_cs_2.length;

					first = PluginUtil.convertBallToLong(tmp_cs_1, 1, 11);
					second = PluginUtil.convertBallToLong(tmp_cs_2, 1, 11);
					tmp_cs_1 = null;
					tmp_cs_2 = null;

					if (Long.bitCount(first | second) != len1 + len2) {
						throw new CodeFormatException(1, getGameName() + " 号码存在重复", s);
					}
					if (len1 + len2 < 2 || len1 + len2 > 11) {
						throw new CodeFormatException(1, getGameName() + " 号码个数必须在2-11之间", s);
					}
					money = 2 * mu * len1 * len2;
				} else if (pm == Q3) {// Q3 前三直选
					String[] cs = PluginUtil.splitter(tmpCode[0], ",");
					int len = cs.length;
					if (len != 3) {
						throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
					}
					int[] tmp_cs_1 = PluginUtil.SplitterInt(cs[0], ",");
					int[] tmp_cs_2 = PluginUtil.SplitterInt(cs[1], ",");
					int[] tmp_cs_3 = PluginUtil.SplitterInt(cs[2], ",");
					int len1 = tmp_cs_1.length, len2 = tmp_cs_2.length, len3 = tmp_cs_3.length;

					first = PluginUtil.convertBallToLong(tmp_cs_1, 1, 11);
					second = PluginUtil.convertBallToLong(tmp_cs_2, 1, 11);
					third = PluginUtil.convertBallToLong(tmp_cs_3, 1, 11);
					tmp_cs_1 = null;
					tmp_cs_2 = null;
					tmp_cs_3 = null;
					if (Long.bitCount(first | second | third) != len1 + len2 + len3) {
						throw new CodeFormatException(1, getGameName() + " 号码存在重复", s);
					}
					if (len1 + len2 + len3 < 3 || len1 + len2 + len3 > 11) {
						throw new CodeFormatException(1, getGameName() + " 号码个数必须在3-11之间", s);
					}
					money = 2 * mu * len1 * len2 * len3;
				} else {// 其他玩法
					int[] cs = PluginUtil.SplitterInt(tmpCode[0], ",");
					int len = cs.length;
					if (min == max) {
						if (len != min) {
							throw new CodeFormatException(1, getGameName() + " 号码个数只能为" + min + "个", s);
						}
					} else {
						if (len < min || len > max) {
							throw new CodeFormatException(2, getGameName() + " 号码个数必须在" + min + "-" + max + "之间", s);
						}
					}
					first = PluginUtil.convertBallToLong(cs, 1, 11);
					if ((first & 1L) == 1) {
						throw new CodeFormatException(3, "号码不能选0", s);
					}
					cs = null;
					money = 2 * mu * C(num,len);
				}

				if (((first & 1L) == 1) || ((second & 1L) == 1) || ((third & 1L) == 1)) {
					throw new CodeFormatException(1, getGameName() + "号码不能选0", s);
				}

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
				
			} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {
				if (pm == 1 || pm == Q2 || pm == Q3) {
					throw new CodeFormatException(-1, getGameName() + "投注玩法不符合要求", s);
				}

				String[] cs = PluginUtil.splitter(tmpCode[0], "$");
				if (cs.length != 2) {
					throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
				}

				int[] dans = PluginUtil.SplitterInt(cs[0], ",");
				int[] tuos = PluginUtil.SplitterInt(cs[1], ",");
				int dlen = dans.length, tlen = tuos.length;
				if (dlen < 1 || dlen >= num) {
					throw new CodeFormatException(1, getGameName() + " 胆拖投注胆码个数必须在" + min + "-" + max + "之间", s);
				}
				if (dlen + tlen <= num) {
					throw new CodeFormatException(1, getGameName() + " 胆球数和拖球数必须超过" + num + "个", s);
				}
				if (dlen + tlen > 11) {
					throw new CodeFormatException(1, getGameName() + " 胆球数和拖球数不能超过11个", s);
				}
				first = PluginUtil.convertBallToLong(dans, 1, 11);
				second = PluginUtil.convertBallToLong(tuos, 1, 11);
				if (Long.bitCount(first | second) != (dlen + tlen)) {
					throw new CodeFormatException(1, getGameName() + " 胆球和拖球有重复", s);
				}
				money = 2 * mu * C(num - dlen,tlen);
			} else {
				throw new CodeFormatException(-1, getGameName() + "投注方式不支持", s);
			}
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

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		byte cm = code.getCastMethod();
		byte pm = code.getPlayMethod();
		int mu = 1;
		
		int[] bcodes = bingoCode.getSingleCode();
		long bfirst = bingoCode.getFirst();
		if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {
			if (pm == R1) {
				long l = 1L << bcodes[0];
				if (Long.bitCount(code.getFirst() & l) == 1) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == R2) {
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 2) {
					levels[pm-1] += C(2,len) * mu;
				}
			} else if (pm == R3) {
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 3) {
					levels[pm-1] += C(3,len) * mu;
				}
			} else if (pm == R4) {
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 4) {
					levels[pm-1] += C(4,len) * mu;
				}
			} else if (pm == R5) {
				if (Long.bitCount(code.getFirst() & bfirst) == 5) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == R6) {
				if (Long.bitCount(code.getFirst() & bfirst) == 5) {
					levels[pm-1] += 1 * mu * C(6-5, Long.bitCount(code.getFirst()) -5);
				}
			} else if (pm == R7) {
				if (Long.bitCount(code.getFirst() & bfirst) == 5) {
					levels[pm-1] += 1 * mu * C(7-5, Long.bitCount(code.getFirst()) -5);
				}
			} else if (pm == R8) {
				if (Long.bitCount(code.getFirst() & bfirst) == 5) {
					levels[pm-1] += 1 * mu * C(8-5, Long.bitCount(code.getFirst()) -5);
				}
			} else if (pm == Z2) {
				long l = 0;
				for (int i = 0; i < 2; i++) {
					l |= 1L << bcodes[i];
				}
				if (Long.bitCount(code.getFirst() & l) == 2) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == Z3) {
				long l = 0;
				for (int i = 0; i < 3; i++) {
					l |= 1L << bcodes[i];
				}
				if (Long.bitCount(code.getFirst() & l) == 3) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == Q2) {
				long lf = 0, ls = 0;
				lf |= 1L << bcodes[0];
				ls |= 1L << bcodes[1];
				if (Long.bitCount(code.getFirst() & lf) == 1 && Long.bitCount(code.getSecond() & ls) == 1) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == Q3) {
				long lf = 0, ls = 0, lt = 0;
				lf |= 1L << bcodes[0];
				ls |= 1L << bcodes[1];
				lt |= 1L << bcodes[2];
				if (Long.bitCount(code.getFirst() & lf) == 1 && Long.bitCount(code.getSecond() & ls) == 1 && Long.bitCount(code.getThird() & lt) == 1) {
					levels[pm-1] += 1 * mu;
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {
			if (pm == R2) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz >= 2 && (dz == Long.bitCount(code.getFirst()))) {
					levels[pm-1] += C(2 - dz,tz) * mu;
				}
			} else if (pm == R3) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz >= 3 && (dz == Long.bitCount(code.getFirst()))) {
					levels[pm-1] += C(3 - dz,tz) * mu;
				}
			} else if (pm == R4) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz >= 4 && (dz == Long.bitCount(code.getFirst()))) {
					levels[pm-1] += C(4 - dz,tz) * mu;
				}
			} else if (pm == R5) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if ( (dz + tz == 5) && (dz == Long.bitCount(code.getFirst())) ) {
					levels[pm-1] += C(5 - dz,tz) * mu;
				}
			} else if (pm == R6) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz == 5 ) {
					if ( dz == 5 ) {
						levels[pm-1] += C(6 - Long.bitCount(code.getFirst()),Long.bitCount(code.getSecond())) * mu;
					} else {
						levels[pm-1] += C(6 - Long.bitCount(code.getFirst()) - tz,Long.bitCount(code.getSecond()) - tz) * mu;
					}

				}
			} else if (pm == R7) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz == 5 ) {					
					if ( dz == 5 ) {
						levels[pm-1] += C(7 - Long.bitCount(code.getFirst()),Long.bitCount(code.getSecond())) * mu;
					} else {
						levels[pm-1] += C(7 - Long.bitCount(code.getFirst()) - tz,Long.bitCount(code.getSecond()) - tz) * mu;
					}

					
				}
			} else if (pm == R8) {
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz == 5 ) {
					if ( dz == 5 ) {
						levels[pm-1] += C(8 - Long.bitCount(code.getFirst()),Long.bitCount(code.getSecond())) * mu;
					} else {
						levels[pm-1] += C(8 - Long.bitCount(code.getFirst()) - tz,Long.bitCount(code.getSecond()) - tz) * mu;
					}
				}
			} else if (pm == Z2) {
				long l = 0;
				for (int i = 0; i < 2; i++) {
					l |= 1L << bcodes[i];
				}
				int dz = Long.bitCount(code.getFirst() & l);
				int tz = Long.bitCount(code.getSecond() & l);
				if (dz + tz == 2 && dz == Long.bitCount(code.getFirst())) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == Z3) {
				long l = 0;
				for (int i = 0; i < 3; i++) {
					l |= 1L << bcodes[i];
				}
				int dz = Long.bitCount(code.getFirst() & l);
				int tz = Long.bitCount(code.getSecond() & l);
				if (dz + tz == 3 && dz == Long.bitCount(code.getFirst())) {
					levels[pm-1] += 1 * mu;
				}
			}
		}
		return levels;
	}
	
	public String toPrintCode(GameCastCode gcc) {
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {
		return null;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_56 obj = new GamePlugin_56();
		String cc = "";
		cc = "02,03,04,06,09,11$01,08,10:08:05";// 选一前一直选
		GameCastCode[] codes = obj.parseGameCastCodes(cc);
		
		
		for (int i=0;i<codes.length;i++) {
//			System.out.println(codes[i].getCastMoney());
		}
		
		String awardcode = "10,06,08,02,01";
		GameAwardCode gac =  obj.buildAwardCode(awardcode);
		
		int[] levels = obj.bingoMatch(codes, gac, obj.getGradeNum());
		if ( levels != null ) {
			for (int i=0;i<levels.length;i++) {
				System.out.println(levels[i]);
			}
		} else {
			System.out.println("未中");
		}
		
		
		// cc = "02,03,04:2:1";// 任选二
		// cc = "02,03,04,01:3:1";// 任选三
		// cc = "02,03,04,01,06:4:1";// 任选四
		// cc = "02,03,04,01,06,07:5:1";// 任选五
		// cc = "02,03,04,01,06,07,08:6:1";// 任选六
		// cc = "02,03,04,01,06,07,08,09,10,11:7:1";// 任选七
		// cc = "01,02,03,04,05,06,07,08:8:1";// 任选八

//		 cc = "01,02,03|01,02,03:9:1";// 前二直选
		 
		 
		// 前三直选
		// 前二组选
		// 前三组选
//		cc = "01,02$03,04,05,06:12:5";
////		cc ="1,2,6,7,8,9$3,4,5,6:5:5"; //任五胆拖
//		GameCastCode[] codes = obj.parseGameCastCodes(cc);
//
//		System.out.println(codes.length);
//		System.out.println(codes[0].getCastMoney());

	}
}