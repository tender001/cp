package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 重庆时时彩（04）
 * 
 * @author zhurong.chen
 * 
 */

public class GamePlugin_04 extends GamePluginAdapter {

	// 时时彩
	public static final int PM_FIVESTAR = 1;// 五星
	public static final int PM_THREESTAR = 3; // 三星
	public static final int PM_TWOSTAR = 4;// 两星
	public static final int PM_ONESTAR = 5;// 一星

	public static final int PM_DXDS = 6; // 大小单双
	public static final int PM_COMBTWOSTAR = 7;// 二星组选

	public static final int PM_FIVETONG = 12;// 五星通选

	public static final int PM_M_FIVESTAR = 13;// 五星复选
	public static final int PM_M_THREESTAR = 15; // 三星复选
	public static final int PM_M_TWOSTAR = 16;// 两星复选

	// 和值数所对应的金额
	private static int[] heshuStar2 = new int[] { 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2 };
	private static int[] heshuStar2c = new int[] { 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 10, 8, 8, 6, 6, 4, 4, 2, 2 };// 2星组选和值

	// 包号号码个数所对应的金额
	private static int[] baohaoStar2c = new int[] { 0, 2, 6, 12, 20, 30, 42, 0, 0, 0 };

	private static int[] heshuMaxNum = new int[] { 45, 36, 27, 18 };

	public GamePlugin_04() {
		this.setGameID("04");
		this.setGameName("时时彩[CQ]");
		this.setGradeNum(9);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];

		int[] singalCode = bingoCode.getSingleCode();

		byte cm = code.getCastMethod();
		byte pm = code.getPlayMethod();

		long cc = code.getFirst();
		long bc = bingoCode.getFirst();

		int mu = 1;

		if (cm == GameCastMethodDef.CASTTYPE_BAOHAO) {// 包号
			long num = 0;
			if (pm == PM_COMBTWOSTAR) {// 二星组选包号
				num += (Long.bitCount(cc & (1L << singalCode[3])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[4])) == 1 ? 1 : 0);
				if (num == 2) {
					if (singalCode[3] != singalCode[4]) {// 非对子号					
						levels[5] += mu;
					}
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
			long he5 = bingoCode.getBackupNo();
			long he4 = he5 - singalCode[0];
			long he3 = he4 - singalCode[1];
			long he2 = he3 - singalCode[2];

			if (pm == PM_TWOSTAR) {// 2星
				if (Long.bitCount(cc & (1L << he2)) == 1) {
					levels[2] += mu;
				}
			} else if (pm == PM_COMBTWOSTAR) {// 2星组选
				if (Long.bitCount(cc & (1L << he2)) == 1) {
					if (singalCode[3] == singalCode[4]) {// 对子号
						levels[2] += mu;
					} else {// 非对子号
						levels[5] += mu;
					}
				}
			}

		} else {// 单复式
			// 需要按位来算
			int[] bnum = new int[5];// 中球数
			int[] cnum = new int[5];// 选球数
			
			long tmp = cc & bc;
			long bdf = 0;
			for (int i = 0; i < bnum.length; i++) {
				bnum[i] = Long.bitCount(tmp & (0x3FFL << i * 10));
				if (bnum[i] == 1) {
					bdf |= (1L << i);
				}
				cnum[i] = Long.bitCount(cc & (0x3FFL << i * 10));
			}
			switch (pm) {
			case PM_FIVESTAR: {// 五星
				if (bdf == 0x1F) {
					levels[0] += mu;
				}
				break;
			}
			case PM_THREESTAR: {// 三星
				if (bdf == 0x1C) {
					levels[1] += mu;
				}
				break;
			}
			case PM_TWOSTAR: {// 两星
				if (bdf == 0x18) {
					levels[2] += mu;
				}
				break;
			}
			case PM_ONESTAR: {// 一星
				if (bdf == 0x10) {
					levels[3] += mu;
				}
				break;
			}
			case PM_DXDS: {// 大小单双
				if (Long.bitCount(code.getSecond() & bingoCode.getSecond()) == 2) {
					levels[4] += mu;
				}
				break;
			}
			case PM_COMBTWOSTAR: {// 二星组选
				
				if (Long.bitCount(cc & (1L << (singalCode[3] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[4] + 40))) == 1) {					
					levels[5] += mu;
				}
				if (Long.bitCount(cc & (1L << (singalCode[4] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[3] + 40))) == 1) {					
					levels[5] += mu;
				}
				break;
			}
			case PM_FIVETONG: {// 五星通选
				int num = Long.bitCount(cc & bc);

				if (num == 5) {
					levels[6] += mu;
					levels[7] += mu * (cnum[3] * cnum[4] + cnum[0] * cnum[1]);
					levels[8] += mu * (cnum[2] * cnum[3] * cnum[4] + cnum[0] * cnum[1] * cnum[2]);
				} else {
					if (bnum[0] == 1 && bnum[1] == 1 && bnum[2] == 1) {// 前3
						levels[7] += mu * cnum[3] * cnum[4];
						levels[8] += mu * cnum[2] * cnum[3] * cnum[4];
					}
					if (bnum[2] == 1 && bnum[3] == 1 && bnum[4] == 1) {// 后3
						levels[7] += mu * cnum[0] * cnum[1];
						levels[8] += mu * cnum[2] * cnum[1] * cnum[0];
					}

					if ((bnum[0] == 1 && bnum[1] == 1) && bnum[2] != 1) {// 前2
						levels[8] += mu * cnum[2] * cnum[3] * cnum[4];
					}
					if (bnum[3] == 1 && bnum[4] == 1 && bnum[2] != 1) {// 后2
						levels[8] += mu * cnum[0] * cnum[1] * cnum[2];
					}
				}
				break;
			}
			case PM_M_FIVESTAR: {// 复选五星
				if ((bdf & 0x1F) == 0x1F) {// 后面中5个
					levels[0] += mu;
				}
				if ((bdf & 0x1C) == 0x1C) {// 后面中3个
					levels[1] += mu * (cnum[0] * cnum[1]) - levels[0];
				}
				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[2] += mu * (cnum[0] * cnum[1] * cnum[2]) - levels[0] - levels[1];
				}
				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[3] += mu * (cnum[0] * cnum[1] * cnum[2] * cnum[3]) - levels[0] - levels[1] - levels[2];
				}
				break;
			}
			case PM_M_THREESTAR: {// 复选三星
				if ((bdf & 0x1C) == 0x1C) {// 后面中3个
					levels[1] += mu;
				}
				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[2] += mu * ( cnum[2] - bnum[2]);
				}
				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[3] += mu * (cnum[3] * cnum[2])  - levels[2] - levels[1];
				}
				break;
			}
			case PM_M_TWOSTAR: {// 复选两星
				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[2] += mu;
				}
				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[3] += mu * ( cnum[3] - bnum[3]);
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

			long first = 0;
			long second = 0;
			long third = 0;

			long backNo = 0;

			int[] bcode = PluginUtil.SplitterInt(awardCode, ",");
			for (int i = 0; i < bcode.length; i++) {
				first |= 1L << (i * 10 + bcode[i]);
				backNo += bcode[i];
			}

			// 大小单双
			if (bcode[3] >= 5) {// 大
				second |= 1L << 2;
			} else {// 小
				second |= 1L << 1;
			}
			if (bcode[3] % 2 != 0) {// 单
				second |= 1L << 5;
			} else {// 双
				second |= 1L << 4;
			}
			if (bcode[4] >= 5) {// 大
				second |= 1L << 12;
			} else {// 小
				second |= 1L << 11;
			}
			if (bcode[4] % 2 != 0) {// 单
				second |= 1L << 15;
			} else {// 双
				second |= 1L << 14;
			}

			obj.setSingleCode(bcode);

			obj.setFirst(first);
			obj.setSecond(second);
			obj.setThird(third);
			obj.setAwardCode(awardCode);

			obj.setBackupNo(backNo);

			
			if ( bcode.length != 5 ) {
				throw new Exception("号码必须是5个位置");
			}
			for ( int i=0;i<5;i++) {
				if ( bcode[i] > 9 || bcode[i] < 0 ) {
					throw new Exception("号码必须在0-9之间");
				}
			}
			
			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5) 号码必须在0-9, 必须有5个位置" , awardCode);
		}
	}

	@Override
	public int getRealGrade(int awardgrade) {
		int playgrade;
		if ((awardgrade == 4) || (awardgrade == 5)) {
			playgrade = 4;
		} else if ((awardgrade == 6) || (awardgrade == 7)) {
			playgrade = 5;
		} else {
			playgrade = awardgrade;
		}
		return playgrade - 1;
	}

	@Override
	public GameCastCode parseGameCastCode(String s) throws CodeFormatException {
		long first = 0;
		long second = 0;
		long third = 0;

		int minNum = 0;
		int maxNum = 9;

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

			if (cm == GameCastMethodDef.CASTTYPE_BAOHAO) {// 包号
				int[] f = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(f, minNum, maxNum);
				// 二星组选包号
				if (pm == PM_COMBTWOSTAR) {// 二星组选
					money = baohaoStar2c[f.length - 1] * mu;
				} else {
					throw new CodeFormatException(1, "投注格式错误 该玩法没有包号的投注方式", s);
				}
				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 包号选球错误", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
				int[] f = PluginUtil.SplitterInt(tmpCode[0], ",");
				int maxb = 0;

				if (pm == PM_TWOSTAR) {// 2星
					maxb = heshuMaxNum[3];
					for (int i = 0; i < f.length; i++) {
						money += heshuStar2[f[i]] * mu;
					}
				}else if (pm == PM_COMBTWOSTAR) {// 2星组选和值
					maxb = heshuMaxNum[3];
					for (int i = 0; i < f.length; i++) {
						money += heshuStar2c[f[i]] * mu;
					}
				} else {
					throw new CodeFormatException(1, "投注格式错误 该玩法没有和值的投注方式", s);
				}

				first = PluginUtil.convertBallToLong(f, minNum, maxb);
				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 和值选球错误", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				String[] codes = PluginUtil.splitter(tmpCode[0], ",");
				switch (pm) {
				case PM_FIVESTAR: {// 五星
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_THREESTAR: {// 三星
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 2) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_TWOSTAR: {// 两星
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_ONESTAR: {// 一星
					if (codes.length != 1) {
						throw new CodeFormatException(1, "一星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 4) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_DXDS: {// 大小单双
					if (codes.length != 2) {
						throw new CodeFormatException(1, "大小单双选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {// 1 2 5 4
							if(f[j] < 1 || f[j] > 5 || f[j] == 3){
								throw new CodeFormatException(1, "大小单双选球错误", s);
							}
							second |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}

					if (money != 2 * mu) {
						throw new CodeFormatException(1, "大小单双选球错误 只能为单式", s);
					}
					break;
				}
				case PM_COMBTWOSTAR: {// 二星组选
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_FIVETONG: {// 五星通选
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星通选选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_M_FIVESTAR: {// 复选五星
					if (codes.length != 5) {
						throw new CodeFormatException(1, "复选五星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 4;
					break;
				}
				case PM_M_THREESTAR: {// 复选三星
					if (codes.length != 3) {
						throw new CodeFormatException(1, "复选三星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 2) * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 3;
					break;
				}
				case PM_M_TWOSTAR: {// 复选两星
					if (codes.length != 2) {
						throw new CodeFormatException(1, "复选二星选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 2;
					break;
				}
				default: {
					throw new CodeFormatException(1, "投注格式错误 玩法不存在", s);
				}
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

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 金额不能为0", s);
				}
			} else {
				throw new CodeFormatException(1, "投注方式不正确", s);
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
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {
		return null;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_04 obj = new GamePlugin_04();
		
		GameAwardCode bingoCode = obj.buildAwardCode("6,8,6,9,7");
		
		String cc = "1246,293,379:15:1";
		GameCastCode[] codes = obj.parseGameCastCodes(cc);

		int[] bb = obj.bingoMatch(codes, bingoCode, 20);
		if ( bb != null ) {
			for (int i=0;i<bb.length;i++) {
				System.out.println("bb[" + i + "]=" + bb[i]);
			}
		}
		System.out.println(codes.length);
		System.out.println(codes[0].getCastMoney());

	}

	
}
