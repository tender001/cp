package com.caipiao.plugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.util.StringUtil;

/**
 * 江西时时彩（20）
 * 
 * @author zhurong.chen
 * 
 */
public class GamePlugin_20 extends GamePluginAdapter {

	private static final int L_FIVE_STAR = 1 - 1;// 五星
	private static final int L_FOUR_STAR_1 = 2 - 1;// 四星一等
	private static final int L_FOUR_STAR_2 = 3 - 1;// 四星二等
	private static final int L_THREE_STAR = 4 - 1;// 三星
	private static final int L_TWO_STAR = 5 - 1;// 二星
	private static final int L_ONE_STAR = 6 - 1;// 一星
	private static final int L_DX_DS = 7 - 1;// 大小单双
	private static final int L_TWO_STAR_C = 8 - 1;// 二星组选
	private static final int L_T_FIVE_1 = 9 - 1;// 五星通选一等奖
	private static final int L_T_FIVE_2 = 10 - 1;// 五星通选一等奖
	private static final int L_T_FIVE_3 = 11 - 1;// 五星通选一等奖
	private static final int L_SELECT_ONE = 12 - 1;// 任选一
	private static final int L_SELECT_TWO = 13 - 1;// 任选二
	private static final int L_C_THREE_3 = 14 - 1;// 三星组三
	private static final int L_C_THREE_6 = 15 - 1;// 三星组六

	// 时时彩
	public static final int PM_ONE_STAR = 1;// 一星
	public static final int PM_TWO_STAR = 2;// 两星
	public static final int PM_THREE_STAR = 3; // 三星
	public static final int PM_FOUR_STAR = 4;// 四星
	public static final int PM_FIVE_STAR = 5;// 五星

	public static final int PM_M_TWO_STAR = 6;// 二星复选
	public static final int PM_M_THREE_STAR = 7; // 三星复选
	public static final int PM_M_FOUR_STAR = 8;// 四星复选
	public static final int PM_M_FIVE_STAR = 9;// 五星复选

	public static final int PM_C_TWO_STAR = 10;// 二星组选
	public static final int PM_DX_DS = 11; // 大小单双

	public static final int PM_T_FIVE_STAR = 12;// 五星通选

	public static final int PM_SELECT_ONE = 13;// 任选一
	public static final int PM_SELECT_TWO = 14;// 任选二

	public static final int PM_C_THREE_3 = 15;// 三星组选3
	public static final int PM_C_THREE_6 = 16;// 三星组选6

	// 和值数所对应的金额
	private static int[] heshuStar2c = new int[] { 2, 2, 4, 4, 6, 6, 8, 8, 10, 10, 10, 8, 8, 6, 6, 4, 4, 2, 2 };// 2星组选和值

	private static int[] heshuStar2 = new int[] { 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2 };
	private static int[] heshuStar3 = new int[] { 2, 6, 12, 20, 30, 42, 56, 72, 90, 110, 126, 138, 146, 150, 150, 146, 138, 126, 110, 90, 72, 56, 42,30, 20, 12, 6, 2 };
	private static int[] heshuCom3 = new int[] { 0, 2, 4, 2, 6, 6, 6, 8, 10, 8, 10, 10, 8, 10, 10, 8, 10, 10, 8, 10, 8, 6, 6, 6, 2, 4, 2, 0 };
	private static int[] heshuCom6 = new int[] { 0, 0, 0, 2, 2, 4, 6, 8, 10, 14, 16, 18, 20, 20, 20, 20, 18, 16, 14, 10, 8, 6, 4, 2, 2, 0, 0, 0 };

	// 包号号码个数所对应的金额
	private static int[] baohaoCom2 = new int[] { 0, 0, 12, 20, 30, 42, 0, 0, 0, 0 };// 二星组选包号
	private static int[] baohaoCom3 = new int[] { 0, 4, 12, 24, 40, 60, 84, 112, 144, 180 }; // 三星组三包号
	private static int[] baohaoCom6 = new int[] { 0, 0, 0, 8, 20, 40, 70, 112, 168, 240 };// 三星组六包号

	private static int[] heshuMaxNum = new int[] { 45, 36, 27, 18 };

	public GamePlugin_20() {
		this.setGameID("20");
		this.setGameName("时时彩[JX]");
		this.setGradeNum(15);
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		int[] singalCode = bingoCode.getSingleCode();

		byte cm = code.getCastMethod();
		byte pm = code.getPlayMethod();
		short mu = 1;

		long cc = code.getFirst();
		long bc = bingoCode.getFirst();

		if (cm == GameCastMethodDef.CASTTYPE_BAOHAO) {// 包号
			long num = 0;
			if (pm == PM_C_TWO_STAR) {// 2星组选
				num += (Long.bitCount(cc & (1L << singalCode[3])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[4])) == 1 ? 1 : 0);
				if (num == 2) {
					if (singalCode[3] == singalCode[4]) {// 对子号
						levels[L_TWO_STAR] += mu;
					} else {// 非对子号
						levels[L_TWO_STAR_C] += mu;
					}
				}
			} else if (pm == PM_C_THREE_3) {// 三星组三
				num += (Long.bitCount(cc & (1L << singalCode[2])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[3])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[4])) == 1 ? 1 : 0);

				long tmp1 = 1L << singalCode[2];
				tmp1 |= (1L << singalCode[3]);
				tmp1 |= (1L << singalCode[4]);

				if (num == 3 && Long.bitCount(tmp1) == 2) {// 组三
					levels[L_C_THREE_3] += mu;
				}
			} else if (pm == PM_C_THREE_6) {// 三星组六
				num += (Long.bitCount(cc & (1L << singalCode[2])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[3])) == 1 ? 1 : 0);
				num += (Long.bitCount(cc & (1L << singalCode[4])) == 1 ? 1 : 0);

				long tmp1 = 1L << singalCode[2];
				tmp1 |= (1L << singalCode[3]);
				tmp1 |= (1L << singalCode[4]);

				if (num == 3 && Long.bitCount(tmp1) == 3) {// 组六
					levels[L_C_THREE_6] += mu;
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
			long he5 = bingoCode.getBackupNo();
			long he4 = he5 - singalCode[0];
			long he3 = he4 - singalCode[1];
			long he2 = he3 - singalCode[2];

			if (pm == PM_C_TWO_STAR) {// 2星组选
				if (Long.bitCount(cc & (1L << he2)) == 1) {
					if (singalCode[3] == singalCode[4]) {// 对子号
						levels[L_TWO_STAR] += mu;
					} else {// 非对子号
						levels[L_TWO_STAR_C] += mu;
					}
				}
			} else if ( pm == PM_TWO_STAR ) {//2星和值
				if (Long.bitCount(cc & (1L << he2)) == 1) {
					levels[L_TWO_STAR] += mu;
				}
			} else if ( pm == PM_THREE_STAR ) {//3星和值
				if (Long.bitCount(cc & (1L << he3)) == 1) {
					levels[L_THREE_STAR] += mu;
				}
			} else if ( pm == PM_C_THREE_3 ) {//3星组三和值
				if (Long.bitCount(cc & (1L << he3)) == 1) {
					levels[L_C_THREE_3] += mu;//TODO
				}
			} else if ( pm == PM_C_THREE_6 ) {//3星组六和值
				if (Long.bitCount(cc & (1L << he3)) == 1) {
					levels[L_C_THREE_6] += mu;//TODo
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE) {// 单式
			// 需要按位来算
			int[] bnum = new int[5];
			long tmp = cc & bc;
			long bdf = 0;
			for (int i = 0; i < bnum.length; i++) {
				bnum[i] = Long.bitCount(tmp & (0x3FFL << i * 10));
				if (bnum[i] == 1) {
					bdf |= (1L << i);
				}
			}

			switch (pm) {
			case PM_FIVE_STAR: {// 五星
				if (bdf == 0x1F) {
					levels[L_FIVE_STAR] += mu;
				}
				break;
			}
			case PM_FOUR_STAR: {// 四星
				if (bdf == 0x1E) {
					levels[L_FOUR_STAR_1] += mu;
				}
				if (bdf == 0x1C || bdf == 0x0E) {// 四星二等
					levels[L_FOUR_STAR_2] += mu;
				}
				break;
			}
			case PM_THREE_STAR: {// 三星
				if (bdf == 0x1C) {
					levels[L_THREE_STAR] += mu;
				}
				break;
			}
			case PM_TWO_STAR: {// 两星
				if (bdf == 0x18) {
					levels[L_TWO_STAR] += mu;
				}
				break;
			}
			case PM_ONE_STAR: {// 一星
				if (bdf == 0x10) {
					levels[L_ONE_STAR] += mu;
				}
				break;
			}
			case PM_DX_DS: {// 大小单双
				if (Long.bitCount(code.getSecond() & bingoCode.getSecond()) == 2) {
					levels[L_DX_DS] += mu;
				}

				break;
			}
			case PM_C_TWO_STAR: {// 二星组选
				if (singalCode[3] == singalCode[4]) {
					if (Long.bitCount(cc & (1L << (singalCode[3] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[4] + 40))) == 1) {
						levels[L_TWO_STAR] += mu;
					}
				} else {
					if (Long.bitCount(cc & (1L << (singalCode[3] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[4] + 40))) == 1) {
						levels[L_TWO_STAR_C] += mu;
					}
					if (Long.bitCount(cc & (1L << (singalCode[4] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[3] + 40))) == 1) {
						levels[L_TWO_STAR_C] += mu;
					}
				}
				break;
			}
			case PM_T_FIVE_STAR: {// 五星通选
				int num = Long.bitCount(cc & bc);
				int[] cnum = new int[5];// 选球数
				for (int i = 0; i < cnum.length; i++) {
					cnum[i] = Long.bitCount(cc & (0x3FFL << i * 10));
				}

				if (num == 5) {
					levels[L_T_FIVE_1] += mu;
					levels[L_T_FIVE_2] += mu * (cnum[3] * cnum[4] + cnum[0] * cnum[1]);
					levels[L_T_FIVE_3] += mu * (cnum[2] * cnum[3] * cnum[4] + cnum[0] * cnum[1] * cnum[2]);
				} else {
					if (bnum[0] == 1 && bnum[1] == 1 && bnum[2] == 1) {// 前3
						levels[L_T_FIVE_2] += mu * cnum[3] * cnum[4];
					}
					if (bnum[2] == 1 && bnum[3] == 1 && bnum[4] == 1) {// 后3
						levels[L_T_FIVE_2] += mu * cnum[0] * cnum[1];
					}

					if (bnum[0] == 1 && bnum[1] == 1) {// 前2
						levels[L_T_FIVE_3] += mu * cnum[2] * cnum[3] * cnum[4];
					}
					if (bnum[3] == 1 && bnum[4] == 1) {// 后2
						levels[L_T_FIVE_3] += mu * cnum[0] * cnum[1] * cnum[2];
					}
				}
				break;
			}
			case PM_M_FIVE_STAR: {// 复选五星
				if ((bdf & 0x1F) == 0x1F) {// 后面中5个
					levels[L_FIVE_STAR] += mu;
				}

				if ((bdf & 0x1E) == 0x1E) {// 后面中4个
					levels[L_FOUR_STAR_1] += mu;
				}

				if ((bdf & 0x1C) == 0x1C) {// 后面中3个
					if ((bdf & 0x1E) != 0x1E) {// 后面中4个
						levels[L_FOUR_STAR_2] += mu;
					}
					levels[L_THREE_STAR] += mu;
				}

				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[L_TWO_STAR] += mu;
				}

				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[L_ONE_STAR] += mu;
				}

				if (bdf == 0x0E || bdf == 0x0F) {// 前面中4个或者中间中三个 四星二等
					levels[L_FOUR_STAR_2] += mu;
				}

				break;
			}
			case PM_M_FOUR_STAR: {// 复选四星
				if ((bdf & 0x1E) == 0x1E) {// 后面中4个
					levels[L_FOUR_STAR_1] += mu;
				}

				if ((bdf & 0x1C) == 0x1C) {// 后面中3个
					if ((bdf & 0x1E) != 0x1E) {// 后面中4个
						levels[L_FOUR_STAR_2] += mu;
					}
					levels[L_THREE_STAR] += mu;
				}

				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[L_TWO_STAR] += mu;
				}

				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[L_ONE_STAR] += mu;
				}

				if (bdf == 0x0E) {// 中间中3个 四星二等
					levels[L_FOUR_STAR_2] += mu;
				}

				break;
			}
			case PM_M_THREE_STAR: {// 复选三星
				if ((bdf & 0x1C) == 0x1C) {// 后面中3个
					levels[L_THREE_STAR] += mu;
				}

				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[L_TWO_STAR] += mu;
				}

				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[L_ONE_STAR] += mu;
				}
				break;
			}
			case PM_M_TWO_STAR: {// 复选两星
				if ((bdf & 0x18) == 0x18) {// 后面中2个
					levels[L_TWO_STAR] += mu;
				}

				if ((bdf & 0x10) == 0x10) {// 后面中1个
					levels[L_ONE_STAR] += mu;
				}
				break;
			}
			case PM_SELECT_ONE: {// 任选一
				if (Long.bitCount(cc & bc) == 1) {
					levels[L_SELECT_ONE] += mu;
				}
				break;
			}
			case PM_SELECT_TWO: {// 任选二
				if (Long.bitCount(cc & bc) == 2) {
					levels[L_SELECT_TWO] += mu;
				}
				break;
			}
			case PM_C_THREE_3: {// 三星组三
				long tmp1 = 1L << singalCode[2];
				tmp1 |= (1L << singalCode[3]);
				tmp1 |= (1L << singalCode[4]);

				if (Long.bitCount(tmp1) == 2) {// 组三号码
					int n = 0;
					n += Long.bitCount(cc & (1L << (singalCode[2] + 20)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 20)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 20)));

					n += Long.bitCount(cc & (1L << (singalCode[2] + 30)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 30)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 30)));

					n += Long.bitCount(cc & (1L << (singalCode[2] + 40)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 40)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 40)));

					if (n == 5) {
						levels[L_C_THREE_3] += mu;
					}
				}
				break;
			}
			case PM_C_THREE_6: {// 三星组六
				long tmp1 = 1L << singalCode[2];
				tmp1 |= (1L << singalCode[3]);
				tmp1 |= (1L << singalCode[4]);

				if (Long.bitCount(tmp1) == 3) {// 组六号码
					int n = 0;
					n += Long.bitCount(cc & (1L << (singalCode[2] + 20)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 20)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 20)));

					n += Long.bitCount(cc & (1L << (singalCode[2] + 30)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 30)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 30)));

					n += Long.bitCount(cc & (1L << (singalCode[2] + 40)));
					n += Long.bitCount(cc & (1L << (singalCode[3] + 40)));
					n += Long.bitCount(cc & (1L << (singalCode[4] + 40)));

					if (n == 3) {
						levels[L_C_THREE_6] += mu;
					}
				}
				break;
			}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_MULTI) {// 复式
			// 需要按位来算
			int[] bnum = new int[5];
			long tmp = cc & bc;
			long bdf = 0;
			for (int i = 0; i < bnum.length; i++) {
				bnum[i] = Long.bitCount(tmp & (0x3FFL << i * 10));
				if (bnum[i] == 1) {
					bdf |= (1L << i);
				}
			}

			switch (pm) {
			case PM_FIVE_STAR: {// 五星
				if (bdf == 0x1F) {
					levels[L_FIVE_STAR] += mu;
				}
				break;
			}
			case PM_FOUR_STAR: {// 四星
				if (bdf == 0x1E) {
					levels[L_FOUR_STAR_1] += mu;
				}

				if (bdf == 0x1C || bdf == 0x1E) {// 前面中三个
					levels[L_FOUR_STAR_2] += Long.bitCount(cc & (0x3FFL << 1 * 10)) * mu - levels[L_FOUR_STAR_1];
				}
				if (bdf == 0x0E || bdf == 0x1E) {// 四星二等 后面中三个
					levels[L_FOUR_STAR_2] += Long.bitCount(cc & (0x3FFL << 4 * 10)) * mu - levels[L_FOUR_STAR_1];
				}

				break;
			}
			case PM_THREE_STAR: {// 三星
				if (bdf == 0x1C) {
					levels[L_THREE_STAR] += mu;
				}
				break;
			}
			case PM_TWO_STAR: {// 两星
				if (bdf == 0x18) {
					levels[L_TWO_STAR] += mu;
				}
				break;
			}
			case PM_ONE_STAR: {// 一星
				if (bdf == 0x10) {
					levels[L_ONE_STAR] += mu;
				}
				break;
			}
			case PM_C_TWO_STAR: {// 二星组选
				if (singalCode[3] == singalCode[4]) {
					if (Long.bitCount(cc & (1L << (singalCode[3] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[4] + 40))) == 1) {
						levels[L_TWO_STAR] += mu;
					}
				} else {
					if (Long.bitCount(cc & (1L << (singalCode[3] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[4] + 40))) == 1) {
						levels[L_TWO_STAR_C] += mu;
					}
					if (Long.bitCount(cc & (1L << (singalCode[4] + 30))) == 1 && Long.bitCount(cc & (1L << (singalCode[3] + 40))) == 1) {
						levels[L_TWO_STAR_C] += mu;
					}
				}
				break;
			}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 包胆
			if (singalCode[3] == singalCode[4]) {
				if (Long.bitCount(cc & (1L << singalCode[3])) == 1 && Long.bitCount(cc & (1L << singalCode[4])) == 1) {
					levels[L_TWO_STAR] += mu;
				}
			} else {
				if (Long.bitCount(cc & (1L << singalCode[3])) == 1 || Long.bitCount(cc & (1L << singalCode[4])) == 1) {
					levels[L_TWO_STAR_C] += mu;
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

			// 大小单双  1是小 2 是大 4 双 5单
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
		return awardgrade;
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

				if (pm == PM_C_TWO_STAR) {// 2星组选
					money = baohaoCom2[f.length - 1] * mu;
				} else if (pm == PM_C_THREE_3) {// 3星组三包号
					money = baohaoCom3[f.length - 1] * mu;
				} else if (pm == PM_C_THREE_6) {// 3星组六包号
					money = baohaoCom6[f.length - 1] * mu;
				} else {
					throw new CodeFormatException(1, "投注格式错误 该玩法没有包号的投注方式", s);
				}
				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 包号选球错误", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
				int[] f = PluginUtil.SplitterInt(tmpCode[0], ",");
				int maxb = 0;
				if (pm == PM_C_TWO_STAR) {// 2星组选和值
					maxb = heshuMaxNum[3];
					for (int i = 0; i < f.length; i++) {
						money += heshuStar2c[f[i]] * mu;
					}
				} else if ( pm == PM_TWO_STAR ) {//2星和值
					maxb = heshuMaxNum[3];
					for (int i = 0; i < f.length; i++) {
						money += heshuStar2[f[i]] * mu;
					}
				} else if ( pm == PM_THREE_STAR ) {//3星和值
					maxb = heshuMaxNum[2];
					for (int i = 0; i < f.length; i++) {
						money += heshuStar3[f[i]] * mu;
					}
				} else if ( pm == PM_C_THREE_3 ) {//3星组三和值
					maxb = heshuMaxNum[2];
					for (int i = 0; i < f.length; i++) {
						money += heshuCom3[f[i]] * mu;
					}
				} else if ( pm == PM_C_THREE_6 ) {//3星组六和值
					maxb = heshuMaxNum[2];
					for (int i = 0; i < f.length; i++) {
						money += heshuCom6[f[i]] * mu;
					}
				} else {
					throw new CodeFormatException(1, "投注格式错误 该玩法没有和值的投注方式", s);
				}
				first = PluginUtil.convertBallToLong(f, minNum, maxb);

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 和值选球错误", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE) {// 单式
				String[] codes = PluginUtil.splitter(tmpCode[0], ",");
				switch (pm) {
				case PM_FIVE_STAR: {// 五星
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "五星单式选球错误", s);
						}

						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_FOUR_STAR: {// 四星
					if (codes.length != 4) {
						throw new CodeFormatException(1, "四星单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "四星单式选球错误", s);
						}

						for (int j = 0; j < f.length; j++) {
							first |= (1L << ((i + 1) * 10 + f[j]));
						}
						money = money * f.length;
					}
					break;
				}
				case PM_THREE_STAR: {// 三星
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "三星单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 2) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_TWO_STAR: {// 两星
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "二星单式选球错误", s);
						}

						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_ONE_STAR: {// 一星
					if (codes.length != 1) {
						throw new CodeFormatException(1, "一星单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "一星单式选球错误", s);
						}

						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 4) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_DX_DS: {// 大小单双 (0-15)
					if (codes.length != 2) {
						throw new CodeFormatException(1, "大小单双选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							second |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_C_TWO_STAR: {// 二星组选
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星组选单式选球错误", s);
					}
					if (codes[0].equalsIgnoreCase(codes[1])) {
						throw new CodeFormatException(2, "二星组选单式选球错误 两个号码不能相同", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(3, "二星组选单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}

				case PM_T_FIVE_STAR: {// 五星通选
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星通选单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "五星通选单式选球错误", s);
						}

						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					break;
				}
				case PM_M_FIVE_STAR: {// 复选五星
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星复选单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "五星复选单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 5;
					break;
				}
				case PM_M_FOUR_STAR: {// 复选四星
					if (codes.length != 4) {
						throw new CodeFormatException(1, "四星复选单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "四星复选单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 1) * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 4;
					break;
				}
				case PM_M_THREE_STAR: {// 复选三星
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星复选单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "三星复选单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 2) * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 3;
					break;
				}
				case PM_M_TWO_STAR: {// 复选两星
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星复选单式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						if (f.length != 1) {
							throw new CodeFormatException(2, "二星复选单式选球错误", s);
						}
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}
					money = money * 2;
					break;
				}

				case PM_SELECT_ONE: {// 任选一
					if (codes.length != 5) {
						throw new CodeFormatException(1, "任选一单式选球错误", s);
					}
					money = 2 * mu;
					int tc = 0;
					for (int i = 0; i < codes.length; i++) {
						if (!codes[i].equalsIgnoreCase("-")) {
							int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
							if (f.length != 1) {
								throw new CodeFormatException(2, "任选一单式选球错误", s);
							}
							for (int j = 0; j < f.length; j++) {
								first |= 1L << (i * 10 + f[j]);
							}
							money = money * f.length;
							tc += 1;
						}
					}
					if (tc != 1) {
						throw new CodeFormatException(3, "任选一单式选球错误", s);
					}
					break;
				}

				case PM_SELECT_TWO: {// 任选二
					if (codes.length != 5) {
						throw new CodeFormatException(1, "任选二单式选球错误", s);
					}
					money = 2 * mu;
					int tc = 0;
					for (int i = 0; i < codes.length; i++) {
						if (!codes[i].equalsIgnoreCase("-")) {
							int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
							if (f.length != 1) {
								throw new CodeFormatException(2, "任选二单式选球错误", s);
							}
							for (int j = 0; j < f.length; j++) {
								first |= 1L << (i * 10 + f[j]);
							}
							money = money * f.length;
							tc += 1;
						}
					}
					if (tc != 2) {
						throw new CodeFormatException(3, "任选二单式选球错误", s);
					}
					break;
				}
				case PM_C_THREE_3: {// 三星组三
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星组三单式选球错误", s);
					}
					money = 2 * mu;

					int f1 = PluginUtil.stringToIntEx(codes[0]);
					int f2 = PluginUtil.stringToIntEx(codes[1]);
					int f3 = PluginUtil.stringToIntEx(codes[2]);

					first |= (1L << f1);
					first |= (1L << f2);
					first |= (1L << f3);
					if (Long.bitCount(first) == 2) {
						first = 0;
						first |= 1L << (2 * 10 + f1);
						first |= 1L << (3 * 10 + f2);
						first |= 1L << (4 * 10 + f3);
					} else {
						throw new CodeFormatException(1, "三星组三单式选球错误 必须有两个号码相同", s);
					}

					break;
				}
				case PM_C_THREE_6: {// 三星组六
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星组六单式选球错误", s);
					}
					money = 2 * mu;

					int f1 = PluginUtil.stringToIntEx(codes[0]);
					int f2 = PluginUtil.stringToIntEx(codes[1]);
					int f3 = PluginUtil.stringToIntEx(codes[2]);

					first |= (1L << f1);
					first |= (1L << f2);
					first |= (1L << f3);
					if (Long.bitCount(first) == 3) {
						first = 0;
						first |= (1L << (2 * 10 + f1));
						first |= (1L << (3 * 10 + f2));
						first |= (1L << (4 * 10 + f3));
					} else {
						throw new CodeFormatException(1, "三星组六单式选球错误 三个号码不能相同", s);
					}
					break;
				}

				default: {
					throw new CodeFormatException(1, "投注格式错误 玩法不存在", s);
				}
				}

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 金额不能为0", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_MULTI) {// 复式
				String[] codes = PluginUtil.splitter(tmpCode[0], ",");
				switch (pm) {
				case PM_FIVE_STAR: {// 五星
					if (codes.length != 5) {
						throw new CodeFormatException(1, "五星复式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << (i * 10 + f[j]);
						}
						money = money * f.length;
					}

					if (money == 2 * mu) {
						throw new CodeFormatException(2, "五星复式选球错误", s);
					}
					break;
				}
				case PM_FOUR_STAR: {// 四星
					if (codes.length != 4) {
						throw new CodeFormatException(1, "四星复式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= (1L << ((i + 1) * 10 + f[j]));
						}
						money = money * f.length;
					}

					if (money == 2 * mu) {
						throw new CodeFormatException(2, "四星复式选球错误", s);
					}

					break;
				}
				case PM_THREE_STAR: {// 三星
					if (codes.length != 3) {
						throw new CodeFormatException(1, "三星复式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 2) * 10 + f[j]);
						}
						money = money * f.length;
					}

					if (money == 2 * mu) {
						throw new CodeFormatException(2, "三星复式选球错误", s);
					}

					break;
				}
				case PM_TWO_STAR: {// 两星
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星复式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 3) * 10 + f[j]);
						}
						money = money * f.length;
					}

					if (money == 2 * mu) {
						throw new CodeFormatException(2, "二星复式选球错误", s);
					}

					break;
				}
				case PM_ONE_STAR: {// 一星
					if (codes.length != 1) {
						throw new CodeFormatException(1, "一星复式选球错误", s);
					}
					money = 2 * mu;
					for (int i = 0; i < codes.length; i++) {
						int[] f = PluginUtil.stringToInt(codes[i], minNum, maxNum);
						for (int j = 0; j < f.length; j++) {
							first |= 1L << ((i + 4) * 10 + f[j]);
						}
						money = money * f.length;
					}

					if (money == 2 * mu) {
						throw new CodeFormatException(2, "一星复式选球错误", s);
					}

					break;
				}
				case PM_C_TWO_STAR: {// 二星组选
					if (codes.length != 2) {
						throw new CodeFormatException(1, "二星组选分位选球错误", s);
					}
					money = 2 * mu;

					int m = codes[0].length();
					int n = codes[1].length();

					int[] c0 = PluginUtil.stringToInt(codes[0], minNum, maxNum);
					int[] c1 = PluginUtil.stringToInt(codes[1], minNum, maxNum);

					long f1 = PluginUtil.convertBallToLong(c0, minNum, maxNum);
					long f2 = PluginUtil.convertBallToLong(c1, minNum, maxNum);
					int k = Long.bitCount(f1 & f2);

					money = 2 * mu * (m * n - k * (k - 1) / 2);
					if (money == 2 * mu) {
						throw new Exception("二星组选分位选球错误 " + s);
					}

					for (int j = 0; j < c0.length; j++) {
						first |= 1L << (3 * 10 + c0[j]);
					}
					for (int j = 0; j < c1.length; j++) {
						first |= 1L << (4 * 10 + c1[j]);
					}
					break;
				}
				default: {
					throw new CodeFormatException(1, "投注格式错误 玩法不存在", s);
				}
				}

				if (money == 0) {
					throw new CodeFormatException(1, "投注格式错误 金额不能为0", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
				if (pm == PM_C_TWO_STAR) {// 二星组选 包胆
					String[] codes = PluginUtil.splitter(tmpCode[0], ",");
					if (codes.length != 1) {
						throw new CodeFormatException(1, "二星组选包胆选球错误", s);
					}
					int c0 = PluginUtil.stringToIntEx(codes[0]);
					money = 2 * mu * 10;
					first |= (1L << c0);

					if (money == 0) {
						throw new CodeFormatException(1, "投注格式错误 金额不能为0", s);
					}
				} else {
					throw new CodeFormatException(1, "投注格式错误 玩法不存在", s);
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

				int tmp = gccs[i].getPlayMethod();

				if ( tmp == PM_SELECT_ONE ) {
					str1 += PluginUtil.replaceString(toKeyString(pcode), "-", "KRIGHT");
					str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
				} else if ( tmp == PM_SELECT_TWO ) {
					
//					System.out.println("pcode=" + pcode);
					while (pcode.endsWith("-")) {
						pcode = pcode.substring(0,pcode.length()-1);
					}
//					System.out.println("pcode=" + pcode);
					
					str1 += PluginUtil.replaceString(toKeyString(pcode), "-", "KRIGHT");//TODO  任选2 完成自动跳到倍数
					str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
					
				} else {
					str1 += toKeyString(pcode);
					if ( tmp == PM_ONE_STAR || tmp == PM_TWO_STAR || tmp == PM_THREE_STAR || tmp == PM_FOUR_STAR) {
						str1 += "|KENT|";
						str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
					}
					if ( tmp == PM_FIVE_STAR ) {
						str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
					}
					if ( tmp == PM_C_TWO_STAR || tmp == PM_C_THREE_3 || tmp == PM_C_THREE_6) {
						str1 += "|A|KENT|";
						str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
					}
					
					if ( tmp == PM_DX_DS ) {
						str1 = PluginUtil.replaceString(str1, "5", "3");//大小单双
					}
					
					if ( tmp == PM_DX_DS || tmp == PM_T_FIVE_STAR) {
						str1 += toKeyString(PluginUtil.LeftPad(muli + "", "0", 2));
					}
				}				
				money += gccs[i].getCastMoney() * muli;
				if ( pm == -1 ){
					pm = gccs[i].getPlayMethod();
				} else {
					if ( pm != gccs[i].getPlayMethod()) {						
						throw new Exception("玩法必须相同");
					}
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_MULTI){//复式
			String pcode = toPrintCode(gccs[0]);
			String[] ss = PluginUtil.splitter(pcode, ",");
			if ( pm == PM_ONE_STAR ) {//一星
				str1 = toKeyString(ss[0]);
			} else if ( pm == PM_TWO_STAR ) {//二星
				str1 = toKeyString(ss[0]);
				str2 = toKeyString(ss[1]);
			} else if ( pm == PM_THREE_STAR ) {//三星
				str1 = toKeyString(ss[0]);
				str2 = toKeyString(ss[1]);
				str3 = toKeyString(ss[2]);
			} else if ( pm == PM_FOUR_STAR ) {//四星
				str1 = toKeyString(ss[0]);
				str2 = toKeyString(ss[1]);
				str3 = toKeyString(ss[2]);
				str4 = toKeyString(ss[3]);
			} else if ( pm == PM_FIVE_STAR ) {//五星
				str1 = toKeyString(ss[0]);
				str2 = toKeyString(ss[1]);
				str3 = toKeyString(ss[2]);
				str4 = toKeyString(ss[3]);
				str5 = toKeyString(ss[4]);
			} else if ( pm == PM_C_TWO_STAR ) {//二星组选
				str1 = toKeyString(ss[0]);
				str2 = toKeyString(ss[1]);
			}
		} else if ( cm == GameCastMethodDef.CASTTYPE_BAOHAO) {
			String pcode = toPrintCode(gccs[0]);
			pcode = PluginUtil.replaceString(pcode, ",", "");
			str1 += toKeyString(pcode);
		} else if ( cm == GameCastMethodDef.CASTTYPE_HESHU) {
			String pcode = toPrintCode(gccs[0]);
			pcode = PluginUtil.replaceString(pcode, ",", "");
			str1 += toKeyString(pcode);
		} else if ( cm == GameCastMethodDef.CASTTYPE_DANTUO) {
			String pcode = toPrintCode(gccs[0]);
			pcode = PluginUtil.replaceString(pcode, ",", "");
			str1 += toKeyString(pcode);
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
		GamePlugin_20 p = new GamePlugin_20();

		GameAwardCode bingoCode = p.buildAwardCode("4,3,7,8,9");
//
//		GameCastCode[] codes = objPlugin.parseGameCastCodes("1,0,1,7,7:12:1:1;3,0,1,7,7:12:1:1;5,0,1,7,7:12:1:1;8,0,1,7,7:12:1:1;1,2,1,7,7:12:1:1");
//		// GameCastCode[] codes =
//		// objPlugin.parseGameCastCodes("12,34,24,0134:4:2:1");
//		// GameCastCode[] codes =
//		// objPlugin.parseGameCastCodes("1,2,9,4,5:12:1:1;1,2,9,9,9:12:1:1;9,9,9,4,5:12:1:1;9,2,3,4,9:12:1:1;9,9,3,4,5:12:1:1");
//
//		int[] cc = objPlugin.bingoMatch(codes, bingoCode, 15);
//		for (int i = 0; i < cc.length; i++) {
//			System.out.println(cc[i]);
//		}

//		String code =  "1,2,-,-,-:14:1:1";
//		code = "19,126,23,74,59:5:2:1";
//		GameCastCode gcc = p.parseGameCastCode(code);
//		System.out.println(p.toPrintCode(gcc));
//		System.out.println(p.keyBoardParser(code, 1));
		
		
//		String code = "-,5,-,-,2:14:1:1;-,-,1,4,-:14:1:1";
//		GameCastCode gcc = p.parseGameCastCode(code);
//		System.out.println(p.toPrintCode(gcc));
//		System.out.println(p.keyBoardParser(code, 1));
		
		
		File file = new File("d:\\temp\\0427001.txt");
		BufferedReader br = new BufferedReader(new FileReader(file));
		String s = "";
		while ( (s = br.readLine()) != null ) {
			String[] ss = StringUtil.splitter(s, "_");
			GameCastCode[] gccs = p.parseGameCastCodes(ss[1]);
			int[] cc = p.bingoMatch(gccs, bingoCode, 15);
			if ( cc != null ) {
			for (int i = 0; i < cc.length; i++) {
				System.out.println(ss[0] + "_" + cc[i]);
			}
			}
		}
		br.close();
		br = null ;
		
	}
}
