package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 30选7（07）
 * 
 * @author zhurong.chen
 * 
 */
public class GamePlugin_07 extends GamePluginAdapter {

	public GamePlugin_07() {
		this.setGameID("07");
		this.setGameName("七乐彩");
		this.setGradeNum(7);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int[] levels = new int[gradeNum];
		int multi = 1;
		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数

			int dp = Long.bitCount(code.getFirst() & spec);
			int tp = Long.bitCount(code.getSecond() & spec);

			levels[0] = multi * C(7 - s, k) * C(7 - d - (7 - s), t - k);// 7+0
			levels[1] = dp * multi * C(6 - s, k) * C(7 - d - (6 - s), t - k) + tp * multi * C(6 - s, k) * C(7 - d - (6 - s) - tp, t - k - tp);// 6+1
			levels[2] = (1 - dp) * multi * C(6 - s, k) * C(7 - d - (6 - s), t - k - tp);// 6+0
			levels[3] = dp * multi * C(5 - s, k) * C(7 - d - (5 - s), t - k) + tp * multi * C(5 - s, k) * C(7 - d - (5 - s) - tp, t - k - tp);// 5+1
			levels[4] = (1 - dp) * multi * C(5 - s, k) * C(7 - d - (5 - s), t - k - tp);// 5+0
			levels[5] = dp * multi * C(4 - s, k) * C(7 - d - (4 - s), t - k) + tp * multi * C(4 - s, k) * C(7 - d - (4 - s) - tp, t - k - tp);// 4+1
			levels[6] = (1 - dp) * multi * C(4 - s, k) * C(7 - d - (4 - s), t - k - tp);// 4+0

		} else {
			int n = Long.bitCount(code.getFirst());// 选球数

			int m = Long.bitCount(code.getFirst() & base);// 中球数

			int sp = Long.bitCount(code.getFirst() & spec);

			levels[0] = multi * C(7, m);// 7+0
			levels[1] = multi * sp * C(6, m) * C(1 - sp, n - m - sp);// 6+1
			levels[2] = multi * (sp * C(6, m) * C(1, n - m - sp) + (1 - sp) * C(6, m) * C(1, n - m));// 6+0
			levels[3] = multi * sp * C(5, m) * C(2 - sp, n - m - sp);// 5+1
			levels[4] = multi * (sp * C(5, m) * C(2, n - m - sp) + (1 - sp) * C(5, m) * C(2, n - m));// 5+0
			levels[5] = multi * sp * C(4, m) * C(3 - sp, n - m - sp);// 4+1
			levels[6] = multi * (sp * C(4, m) * C(3, n - m - sp) + (1 - sp) * C(4, m) * C(3, n - m));// 4+0

		}
		return levels;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode obj = new GameAwardCode();

			int[] bcode = new int[8];
			String[] codes = PluginUtil.splitter(awardCode, "|");
			int[] cs = PluginUtil.SplitterInt(codes[0], ",");
			System.arraycopy(cs, 0, bcode, 0, cs.length);
			bcode[7] = Integer.parseInt(codes[1]);

			obj.setSingleCode(bcode);
			long first = 0;
			for (int i = 0; i < cs.length; i++) {
				if (cs[i] <= 30 && cs[i] > 0) {
					first |= (1L << cs[i]);
				} else {
					throw new CodeFormatException(1, "开奖号码不正确 选数必须是1-30", awardCode);
				}
			}
			obj.setFirst(first);
			obj.setSecond(0);
			obj.setThird(1L << Integer.parseInt(codes[1]));
			obj.setAwardCode(awardCode);

			int[] redCodes = PluginUtil.SplitterInt(codes[0], ",");
			first = PluginUtil.convertBallToLong(redCodes, 1, 30);
			int dc = Long.bitCount(first);

			if (dc != 7) {
				throw new CodeFormatException(1, "开奖号码不正确 选数必须是7个", awardCode);
			}
			if (Long.bitCount(obj.getFirst() | obj.getThird()) != 8) {
				throw new CodeFormatException(1, "开奖号码不正确 特别号码和基本号码有重复", awardCode);
			}
			if (bcode[7] <= 0 || bcode[7] > 30) {
				throw new CodeFormatException(1, "开奖号码不正确 选数必须是1-30", awardCode);
			}

			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5,6,7|8)\r\n 不能有重复，号码在1-30，", awardCode);
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

		int minNum = 1;
		int maxNum = 30;

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

			int dc = 0, tc = 0;

			if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
				String[] mcodes = PluginUtil.splitter(tmpCode[0], "$");
				int[] danCodes = PluginUtil.SplitterInt(mcodes[0], ",");
				int[] tuoCodes = PluginUtil.SplitterInt(mcodes[1], ",");

				first = PluginUtil.convertBallToLong(danCodes, minNum, maxNum);
				dc = Long.bitCount(first);
				if (dc < 1 || dc > 6) {
					throw new CodeFormatException(1, "胆球号码不正确 胆球数必须在1到6个", s);
				}

				second = PluginUtil.convertBallToLong(tuoCodes, minNum, maxNum);
				tc = Long.bitCount(second);

				if ((dc + tc) < 7) {
					throw new CodeFormatException(1, "胆球数和拖球数必须超过7个", s);
				}

				if (Long.bitCount(first | second) != (dc + tc)) {
					throw new CodeFormatException(1, "胆球和拖球有重复", s);
				}

				money = 2 * mu * C(7 - dc, tc);
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				int[] redCodes = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(redCodes, minNum, maxNum);
				dc = Long.bitCount(first);
				if (dc < 7 || dc > 20) {
					throw new CodeFormatException(1, "选球号码不正确 选数必须是7到20个", s);
				}
				money = 2 * mu * C(7, dc);
				
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
				throw new CodeFormatException(1, "投注方式不正确", s);
			}

			if (((first & 1L) == 1) || ((second & 1L) == 1)) {
				throw new CodeFormatException(1, "选球号码不能选0", s);
			}

			if (money == 0) {
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
		String s = "";
		byte cm = gcc.getCastMethod();
		if ( cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI ) {
			s = PluginUtil.longToString(gcc.getFirst());
		} else {
			s = PluginUtil.longToString(gcc.getFirst());
			s += "$";
			s += PluginUtil.longToString(gcc.getSecond());
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
			str1 = toKeyString(pcode);

		} else if ( cm == 5 ) {//胆拖
			String pcode = toPrintCode(gccs[0]);
			String[] sss = PluginUtil.splitter(pcode, "$");
			//胆码
			str1 = toKeyString(sss[0]);
			if ( sss[0].length() < 17 ) {
				str1 += "|KENT|";
			}
			//拖码
			str2 = toKeyString(sss[1]);
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
		GamePlugin_07 p = new GamePlugin_07();
//		String codes = "11,02,03$04,05,06,07,08:1:5:2";
//		String codes = "11,02,03,04,05,06,07,08:1:2:2";
		String codes = "02,03,04,05,06,07,08:1:1:1;02,03,04,05,06,07,08:1:1:1";
		GameCastCode gcc = p.parseGameCastCode(codes);

		System.out.println(p.toPrintCode(gcc));
		
		HashMap<String,String> maps = p.keyBoardParser(codes, 1);
		System.out.println(maps.toString());
	}
}
