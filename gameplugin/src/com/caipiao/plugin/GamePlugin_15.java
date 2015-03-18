package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 15选5
 * @author zhurong.chen
 *
 */
public class GamePlugin_15 extends GamePluginAdapter {

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();

		int multi = 1;
		int[] levels = new int[gradeNum];

		int f = (int) bingoCode.getBackupNo();

		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数

			levels[0] = multi * f * C(5 - s, k) * C(5 - d - (5 - s), t - k);
			levels[1] = multi * C(5 - s, k) * C(5 - d - (5 - s), t - k);
			levels[2] = multi * C(4 - s, k) * C(5 - d - (4 - s), t - k);

		} else {
			int n = Long.bitCount(code.getFirst());// 选球数
			int m = Long.bitCount(code.getFirst() & base);// 中球数

			levels[0] = multi * f * C(5, m);
			levels[1] = multi * C(5, m);
			levels[2] = multi * C(4, m) * C(1, n - m);
		}
		return levels;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) {
		GameAwardCode obj = new GameAwardCode();
		int[] bcode = PluginUtil.SplitterInt(awardCode, ",");

		java.util.Arrays.sort(bcode);// 排序

		obj.setSingleCode(bcode);

		long first = 0;
		int f = 0;
		for (int i = 0; i < bcode.length; i++) {
			first |= (1L << bcode[i]);
			if (i > 0) {
				if ( bcode[i] - bcode[i - 1] == 1 ) {
					f += 1;
				} else {
					if ( f < 3) {
						f = 0;
					}
				}
			}
		}
		obj.setFirst(first);
		obj.setSecond(0);
		obj.setThird(0);
		obj.setAwardCode(awardCode);
		if (f >= 3) {
			obj.setBackupNo(1);
		} else {
			obj.setBackupNo(0);
		}
		return obj;
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

		int maxNum = 15;

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

				first = PluginUtil.convertBallToLong(danCodes,1,maxNum);
				dc = Long.bitCount(first);
				if (dc < 1 || dc > 4) {
					throw new CodeFormatException(1, "胆球号码不正确 胆球数必须在1到4个", s);
				}

				second = PluginUtil.convertBallToLong(tuoCodes,1,maxNum);
				tc = Long.bitCount(second);

				if ((dc + tc) < 5) {
					throw new CodeFormatException(1, "胆球数和拖球数必须超过5个", s);
				}
				
				if ( Long.bitCount(first | second) != (dc + tc) ) {
					throw new CodeFormatException(1, "胆球和拖球有重复", s);
				}

				money = 2 * mu * PluginUtil.C(5 - dc,tc);
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				int[] codes = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(codes,1,maxNum);
				dc = Long.bitCount(first);
				if (dc < 5 || dc > 15) {
					throw new CodeFormatException(1, "选球号码不正确 选数必须是5到15个", s);
				}
				
				money = 2 * mu * C(5,dc);
				
//				System.out.println("dc=" + dc + " mu=" + mu + " ");
			} else {
				throw new CodeFormatException(1, "投注方式不正确", s);
			}


			if (((first & 1L) == 1) || ((second & 1L) == 1) ) {
				throw new CodeFormatException(1, "选球号码不能选0", s);
			}

			if (money == 0) {
				throw new CodeFormatException(1, "投注金额不能为零", s);
			}
		} catch (CodeFormatException ce) {
			throw ce;
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
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		return null;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_15 p = new GamePlugin_15();
		p.parseGameCastCode("03,06,8,10,9:1:1");
	}
}
