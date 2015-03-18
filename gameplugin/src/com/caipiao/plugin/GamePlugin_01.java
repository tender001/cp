package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;


/**
 * 双色球(01)
 * 
 * @author zhurong.chen
 * 
 */

public class GamePlugin_01 extends GamePluginAdapter {
	private final static int MAX_RED = 33;
	private final static int MIN_RED = 1;
	private final static int MAX_BLUE = 16;
	private final static int MIN_BLUE = 1;

	public GamePlugin_01() {
		this.setGameID("01");
		this.setGameName("双色球");
		this.setGradeNum(6);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int[] levels = new int[gradeNum];
		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数
			int n = Long.bitCount(code.getThird());// 蓝球数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数
			int b = Long.bitCount(code.getThird() & spec);// 中蓝球数

			levels[getRealGrade(0)] += C(6 - s, k) * C(6 - d - (6 - s), t - k) * C(1, b);// 6+1
			levels[getRealGrade(1)] += C(6 - s, k) * C(6 - d - (6 - s), t - k) * (n - C(1, b));// 6+0
			levels[getRealGrade(2)] += C(5 - s, k) * C(6 - d - (5 - s), t - k) * C(1, b);// 5+1

			levels[getRealGrade(3)] += C(5 - s, k) * C(6 - d - (5 - s), t - k) * (n - C(1, b));// 5+0
			levels[getRealGrade(3)] += C(4 - s, k) * C(6 - d - (4 - s), t - k) * C(1, b);// 4+1

			levels[getRealGrade(4)] += C(4 - s, k) * C(6 - d - (4 - s), t - k) * (n - C(1, b));// 4+0
			levels[getRealGrade(4)] += C(3 - s, k) * C(6 - d - (3 - s), t - k) * C(1, b);// 3+1

			levels[getRealGrade(5)] += C(2 - s, k) * C(6 - d - (2 - s), t - k) * C(1, b);// 2+1
			levels[getRealGrade(5)] += C(1 - s, k) * C(6 - d - (1 - s), t - k) * C(1, b);// 1+1
			levels[getRealGrade(5)] += C(0 - s, k) * C(6 - d - (0 - s), t - k) * C(1, b);// 0+1
		} else {
			int m = Long.bitCount(code.getFirst());// 红球数
			int n = Long.bitCount(code.getThird());// 蓝球数

			int r = Long.bitCount(code.getFirst() & base);// 中红球数
			int b = Long.bitCount(code.getThird() & spec);// 中蓝球数

			levels[getRealGrade(0)] += C(6, r) * C(1, b);// 6+1
			levels[getRealGrade(1)] += C(6, r) * (n - C(1, b));// 6+0
			levels[getRealGrade(2)] += C(5, r) * C(1, m - r) * C(1, b);// 5+1

			levels[getRealGrade(3)] += C(5, r) * C(1, m - r) * (n - C(1, b));// 5+0
			levels[getRealGrade(3)] += C(4, r) * C(2, m - r) * C(1, b);// 4+1

			levels[getRealGrade(4)] += C(4, r) * C(2, m - r) * (n - C(1, b));// 4+0
			levels[getRealGrade(4)] += C(3, r) * C(3, m - r) * C(1, b);// 3+1

			levels[getRealGrade(5)] += C(2, r) * C(4, m - r) * C(1, b);// 2+1
			levels[getRealGrade(5)] += C(1, r) * C(5, m - r) * C(1, b);// 1+1
			levels[getRealGrade(5)] += C(0, r) * C(6, m - r) * C(1, b);// 0+1
		}
		return levels;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode obj = new GameAwardCode();

			int[] bcode = new int[7];
			String[] codes = PluginUtil.splitter(awardCode, "|");
			int[] cs = PluginUtil.SplitterInt(codes[0], ",");
			System.arraycopy(cs, 0, bcode, 0, cs.length);
			bcode[6] = Integer.parseInt(codes[1]);

			obj.setSingleCode(bcode);
			long first = 0;
			for (int i = 0; i < cs.length; i++) {
				first |= (1L << cs[i]);
			}
			obj.setFirst(first);
			obj.setSecond(0);
			obj.setThird(1L << Integer.parseInt(codes[1]));
			obj.setAwardCode(awardCode);
			
			//检查开奖号码
			int[] redCodes = PluginUtil.SplitterInt(codes[0], ",");
			first = PluginUtil.convertBallToLong(redCodes, MIN_RED, MAX_RED);
			int dc = Long.bitCount(first);
			if (dc != 6) {
				throw new CodeFormatException(1, "红球号码不正确 红球数必须是6个", awardCode);
			}
			if ( dc != redCodes.length ) {
				throw new CodeFormatException(1, "红球号码有重复", awardCode);
			}
			if ( bcode[6] <= 0 || bcode[6] > 16 ) {
				throw new CodeFormatException(1, "篮球号码不正确，必须在1到16之间", awardCode);
			}
			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5,6|7)\r\n 不能有重复，红球在1-33, 篮球在1-16" , awardCode);
		}
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return awardgrade;
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

			String[] codes = PluginUtil.splitter(tmpCode[0], "|");

			int[] blueCode = PluginUtil.SplitterInt(codes[1], ",");
			third = PluginUtil.convertBallToLong(blueCode, MIN_BLUE, MAX_BLUE);

			int bc = Long.bitCount(third);
			int dc = 0, tc = 0;

			if (bc < 1 || bc > 16) {
				throw new CodeFormatException(1, "篮球号码不正确 篮球个数必须在1到16个", s);
			}

			if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
				String[] mcodes = PluginUtil.splitter(codes[0], "$");
				int[] danCodes = PluginUtil.SplitterInt(mcodes[0], ",");
				int[] tuoCodes = PluginUtil.SplitterInt(mcodes[1], ",");

				first = PluginUtil.convertBallToLong(danCodes, MIN_RED, MAX_RED);
				dc = Long.bitCount(first);
				if (dc < 1 || dc > 5) {
					throw new CodeFormatException(1, "胆球号码不正确 胆球数必须在1到5个", s);
				}

				second = PluginUtil.convertBallToLong(tuoCodes, MIN_RED, MAX_RED);
				tc = Long.bitCount(second);

				if ((dc + tc) < 6) {
					throw new CodeFormatException(1, "胆球数和拖球数必须超过6个", s);
				}

				if (Long.bitCount(first | second) != (dc + tc)) {
					throw new CodeFormatException(1, "胆球和拖球有重复", s);
				}

				money = 2 * PluginUtil.C(6 - dc, tc) * bc;
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				int[] redCodes = PluginUtil.SplitterInt(codes[0], ",");
				first = PluginUtil.convertBallToLong(redCodes, MIN_RED, MAX_RED);
				dc = Long.bitCount(first);
				if (dc < 6 || dc > 20) {
					throw new CodeFormatException(1, "红球球号码不正确 红球数必须是6到20个", s);
				}
				money = 2 * PluginUtil.C(6, dc) * bc;
				
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
				throw new CodeFormatException(1, "投注方式不正确", s);
			}

			if (((first & 1L) == 1) || ((second & 1L) == 1) || ((third & 1L) == 1)) {
				throw new CodeFormatException(1, "双色球号码不能选0", s);
			}

			if (money == 0) {
				throw new CodeFormatException(1, "注数不能为零", s);
			}
		} catch (Exception e) {
			e.printStackTrace();
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
		String s = "";
		byte cm = gcc.getCastMethod();
		if ( cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI ) {
			s = PluginUtil.longToString(gcc.getFirst());
			s += "|";
			s += PluginUtil.longToString(gcc.getThird());
		} else {
			s = PluginUtil.longToString(gcc.getFirst());
			s += "$";
			s += PluginUtil.longToString(gcc.getSecond());
			s += "|";
			s += PluginUtil.longToString(gcc.getThird());
		}
		return s;
	}
	
	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {
		HashMap<String,String> maps = new HashMap<String,String>();
		
		String str1 = "";
		String str2 = "";
		String str3 = "";
		String str4 = "";

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

		if ( cm == 1) {//单式
			money = 0;
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);
				
				pcode = PluginUtil.replaceString(pcode, "|", "") + PluginUtil.LeftPad(muli+"", "0", 2);
				str1 += toKeyString(pcode);
				//str1 += "|KENT|";
				
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
			
			String[] ss = PluginUtil.splitter(pcode, "|");
			str1 = toKeyString(ss[0]);
			str2 = toKeyString(ss[1]);
			
		} else if ( cm == 5 ) {//胆拖
			String pcode = toPrintCode(gccs[0]);
			String[] ss = PluginUtil.splitter(pcode, "|");
			String[] sss = PluginUtil.splitter(ss[0], "$");
			//红球胆码
			str1 = toKeyString(sss[0]);
			if ( sss[0].length() < 14 ) {
				str1 += "|KENT|";
			}
			//红球拖码
			str2 = toKeyString(sss[1]);
			//蓝球
			str3 = toKeyString(ss[1]);
		}
		
		maps.put("$01", str1);
		maps.put("$02", str2);
		maps.put("$03", str3);
		maps.put("$04", str4);
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");
		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		GamePlugin_01 p = new GamePlugin_01();
		String codes = "01,02,04,07,12,14,17,22,24,26,28,32,33|03:1:2";
		GameCastCode gcc = p.parseGameCastCode(codes);
		System.out.println(gcc.getCastMoney());
		
		GameAwardCode bingoCode = p.buildAwardCode("01,02,03,04,05,06|01");
		
		int[] levels = p.bingoMatcher(gcc, bingoCode, 10);
		if ( levels != null ) {
			for (int i=0;i<levels.length;i++) {
				System.out.println("levels[" + i + "]=" + levels[i]);
			}
		} else {
			System.out.println("没有中奖");
		}
		
		System.out.println(p.toPrintCode(gcc));
		
		HashMap<String,String> maps = p.keyBoardParser(codes, 1);
		System.out.println(maps.toString());
	}
}
