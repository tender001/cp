package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 超级大乐透（50）
 * 
 * @author zhurong.chen
 * 
 */
public class GamePlugin_50 extends GamePluginAdapter {

	public final static int PM_NORMAL = 1; // 普通投注
	public final static int PM_ZHUIJIA = 2; // 追加投注
	public final static int PM_SXL = 3; // 生肖乐

	private final static int MAX_RED = 35;
	private final static int MIN_RED = 1;
	private final static int MAX_BLUE = 12;
	private final static int MIN_BLUE = 1;

	public GamePlugin_50() {
		this.setGameID("50");
		this.setGameName("大乐透");
		this.setGradeNum(12);
	}

	/* 2014年5月5日之前 */
	/*
	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int pm = code.getPlayMethod();
		int[] levels = new int[gradeNum];
		int multi = 1;

		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数
			int dh = Long.bitCount(code.getThird());// 后区胆数
			int th = Long.bitCount(code.getFour());// 后区拖数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数
			int sh = Long.bitCount(code.getThird() & spec);// 中后区胆数
			int kh = Long.bitCount(code.getFour() & spec);// 中后区拖数

			if (pm != PM_SXL) {
				levels[0] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 5+2 
				levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 5+1
				levels[2] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 5+0

				levels[3] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 4+2
				levels[4] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 4+1

				levels[5] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 4+0
				levels[5] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 3+2

				levels[6] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 3+1
				levels[6] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 2+2

				levels[7] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 3+0
				levels[7] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 2+1
				levels[7] += C(1 - s, k) * C(5 - d - (1 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 1+2
				levels[7] += C(0 - s, k) * C(5 - d - (0 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 0+2
			} else {
				// 胆托无生肖乐玩法
				levels[8] += C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 2
			}
		} else {
			int m = Long.bitCount(code.getFirst());// 前区数
			int n = Long.bitCount(code.getThird());// 后区数

			int r = Long.bitCount(code.getFirst() & base);// 中前区数
			int b = Long.bitCount(code.getThird() & spec);// 中后区数

			if (pm != PM_SXL) {
				levels[0] += C(5, r) * C(2, b) * multi;// 5+2
				levels[1] += C(5, r) * (C(1, n - b) * C(1, b)) * multi;// 5+1
				levels[2] += C(5, r) * C(2, n - b) * multi;// 5+0

				levels[3] += C(4, r) * C(1, m - r) * C(2, b) * multi;// 4+2
				levels[4] += C(4, r) * C(1, m - r) * (C(1, n - b) * C(1, b)) * multi;// 4+1

				levels[5] += C(4, r) * C(1, m - r) * C(2, n - b) * multi;// 4+0
				levels[5] += C(3, r) * C(2, m - r) * C(2, b) * multi;// 3+2

				levels[6] += C(3, r) * C(2, m - r) * (C(1, n - b) * C(1, b)) * multi;// 3+1
				levels[6] += C(2, r) * C(3, m - r) * C(2, b) * multi;// 2+2

				levels[7] += C(3, r) * C(2, m - r) * C(2, n - b) * multi;// 3+0
				levels[7] += C(2, r) * C(3, m - r) * (C(1, n - b) * C(1, b)) * multi;// 2+1
				levels[7] += C(1, r) * C(4, m - r) * C(2, b) * multi;// 1+2
				levels[7] += C(0, r) * C(5, m - r) * C(2, b) * multi;// 0+2
			} else {// 生肖乐
				levels[8] += C(2, b) * multi;// 2
			}
		}
		
		if (pm == PM_ZHUIJIA) {
			int bnum = 9;
			for (int i=0;i<7;i++) {
				levels[i + bnum] = levels[i];
			}
		}
		return levels;
	}
	*/
	/**
	 * 2014年5月5日修改大乐透玩法
	 */
	
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int pm = code.getPlayMethod();
		int[] levels = new int[gradeNum];
		int multi = 1;

		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数
			int dh = Long.bitCount(code.getThird());// 后区胆数
			int th = Long.bitCount(code.getFour());// 后区拖数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数
			int sh = Long.bitCount(code.getThird() & spec);// 中后区胆数
			int kh = Long.bitCount(code.getFour() & spec);// 中后区拖数

			if (pm != PM_SXL) {
				levels[0] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 5+2 
				levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 5+1
				
				levels[2] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 5+0
				levels[2] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 4+2
				
				levels[3] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 4+1
				levels[3] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 3+2
				
				levels[4] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 4+0
				levels[4] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 3+1
				levels[4] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 2+2

				levels[5] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * 
						C(0 - sh, kh) * C(2 - dh - (0 - sh), th - kh) * multi;// 3+0
				levels[5] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * 
						C(1 - sh, kh) * C(2 - dh - (1 - sh), th - kh) * multi;// 2+1
				levels[5] += C(1 - s, k) * C(5 - d - (1 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 1+2
				levels[5] += C(0 - s, k) * C(5 - d - (0 - s), t - k) * 
						C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 0+2
			} else {
				// 胆托无生肖乐玩法
				levels[6] += C(2 - sh, kh) * C(2 - dh - (2 - sh), th - kh) * multi;// 2
			}
		} else {
			int m = Long.bitCount(code.getFirst());// 前区数
			int n = Long.bitCount(code.getThird());// 后区数

			int r = Long.bitCount(code.getFirst() & base);// 中前区数
			int b = Long.bitCount(code.getThird() & spec);// 中后区数

			if (pm != PM_SXL) {
				levels[0] += C(5, r) * C(2, b) * multi;// 5+2
				levels[1] += C(5, r) * (C(1, n - b) * C(1, b)) * multi;// 5+1
				
				levels[2] += C(5, r) * C(2, n - b) * multi;// 5+0
				levels[2] += C(4, r) * C(1, m - r) * C(2, b) * multi;// 4+2
				
				levels[3] += C(4, r) * C(1, m - r) * (C(1, n - b) * C(1, b)) * multi;// 4+1
				levels[3] += C(3, r) * C(2, m - r) * C(2, b) * multi;// 3+2
				
				levels[4] += C(4, r) * C(1, m - r) * C(2, n - b) * multi;// 4+0
				levels[4] += C(3, r) * C(2, m - r) * (C(1, n - b) * C(1, b)) * multi;// 3+1
				levels[4] += C(2, r) * C(3, m - r) * C(2, b) * multi;// 2+2

				levels[5] += C(3, r) * C(2, m - r) * C(2, n - b) * multi;// 3+0
				levels[5] += C(2, r) * C(3, m - r) * (C(1, n - b) * C(1, b)) * multi;// 2+1
				levels[5] += C(1, r) * C(4, m - r) * C(2, b) * multi;// 1+2
				levels[5] += C(0, r) * C(5, m - r) * C(2, b) * multi;// 0+2
			} else {// 生肖乐
				levels[6] += C(2, b) * multi;// 2
			}
		}
		
		if (pm == PM_ZHUIJIA) {
			int bnum = 7;
			for (int i=0;i<5;i++) {
				levels[i + bnum] = levels[i];
			}
		}
		return levels;
	}
	
	public GameAwardCode buildAwardByPos(GameAwardCode gac, int p){
		GameAwardCode _gac = new GameAwardCode();
		if(p == 1){//宝石号码
			long rl = 0x7FFFFFFFEL;
			long bl = 0xFFEL;
			if(Long.bitCount(gac.getFirst()) > 0){
				if(Long.bitCount(gac.getFirst() & (1L << 35)) == 1){
					_gac.setFirst(((rl & gac.getFirst()) << 1) | (1L << 1));
				}else{
					_gac.setFirst(((rl & gac.getFirst()) << 1));
				}
			}
			
			if(Long.bitCount(gac.getThird()) > 0){
				if(Long.bitCount(gac.getThird() & (1L << 12)) == 1){
					_gac.setThird(((bl & gac.getThird()) << 1) | (1L << 1));
				}else{
					_gac.setThird(((bl & gac.getThird()) << 1));
				}
			}
		}else if(p == -1){//钻石号码
			long rl = 0xFFFFFFFFCL;
			long bl = 0x1FFCL;
			if(Long.bitCount(gac.getFirst()) > 0){
				if(Long.bitCount(gac.getFirst() & (1L << 1)) == 1){
					_gac.setFirst(((rl & gac.getFirst()) >> 1) | (1L << 35));
				}else{
					_gac.setFirst(((rl & gac.getFirst()) >> 1));
				}
			}
			if(Long.bitCount(gac.getThird()) > 0){
				if(Long.bitCount(gac.getThird() & (1L << 1)) == 1){
					_gac.setThird(((bl & gac.getThird()) >> 1) | (1L << 12));
				}else{
					_gac.setThird(((bl & gac.getThird()) >> 1));
				}
			}
		}
		return _gac;
	}


	public int[] jewelMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int pm = code.getPlayMethod();
		int[] levels = new int[gradeNum];
		int multi = 1;

		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数
			int n = Long.bitCount(code.getThird());// 后区(胆)
			int x = Long.bitCount(code.getFour());//后区(拖)

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数
			int b = Long.bitCount(code.getThird() & spec);// 中后区(胆)
			int y = Long.bitCount(code.getFour() & spec);//中后区(拖)

			if (pm != PM_SXL) {
				if(t > 0){
					if(x > 0){
						levels[0] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 5+2 
						levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 5+1
						levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(0 - b, y) * C(2 - n - (0 - b), x - y) * multi;// 5+0

						levels[2] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 4+2
						levels[2] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 4+1

						levels[3] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * C(0 - b, y) * C(2 - n - (0 - b), x - y) * multi;// 4+0
						levels[3] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 3+2

						levels[3] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 3+1
						levels[3] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 2+2
					}else{
						levels[0] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(2, b) * multi;// 5+2
						levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(1, n - b) * C(1, b) * multi;// 5+1
						levels[1] += C(5 - s, k) * C(5 - d - (5 - s), t - k) * C(2, n - b) * multi;// 5+0

						levels[2] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * C(2, b) * multi;// 4+2
						levels[2] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * (C(1, n - b) * C(1, b)) * multi;// 4+1

						levels[3] += C(4 - s, k) * C(5 - d - (4 - s), t - k) * C(2, n - b) * multi;// 4+0
						levels[3] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * C(2, b) * multi;// 3+2

						levels[3] += C(3 - s, k) * C(5 - d - (3 - s), t - k) * C(1, n - b) * C(1, b) * multi;// 3+1
						levels[3] += C(2 - s, k) * C(5 - d - (2 - s), t - k) * C(2, b) * multi;// 2+2
					}
				}else{
					if(x > 0){
						levels[0] += C(5, s) * C(5 - 5, d - s) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 5+2 
						levels[1] += C(5, s) * C(5 - 5, d - s) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 5+1
						levels[1] += C(5, s) * C(5 - 5, d - s) * C(0 - b, y) * C(2 - n - (0 - b), x - y) * multi;// 5+0

						levels[2] += C(4, s) * C(5 - 4, d - s) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 4+2
						levels[2] += C(4, s) * C(5 - 4, d - s) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 4+1

						levels[3] += C(4, s) * C(5 - 4, d - s) * C(0 - b, y) * C(2 - n - (0 - b), x - y) * multi;// 4+0
						levels[3] += C(3, s) * C(5 - 3, d - s) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 3+2

						levels[3] += C(3, s) * C(5 - 3, d - s) * C(1 - b, y) * C(2 - n - (1 - b), x - y) * multi;// 3+1
						levels[3] += C(2, s) * C(5 - 2, d - s) * C(2 - b, y) * C(2 - n - (2 - b), x - y) * multi;// 2+2
					}else{
						//nothing
					}
				}
			}

		} else {
			int m = Long.bitCount(code.getFirst());// 前区数
			int n = Long.bitCount(code.getThird());// 后区数

			int r = Long.bitCount(code.getFirst() & base);// 中前区数
			int b = Long.bitCount(code.getThird() & spec);// 中后区数

			if (pm != PM_SXL) {
				levels[0] += C(5, r) * C(2, b) * multi;// 5+2
				levels[1] += C(5, r) * (C(1, n - b) * C(1, b)) * multi;// 5+1
				levels[1] += C(5, r) * C(2, n - b) * multi;// 5+0

				levels[2] += C(4, r) * C(1, m - r) * C(2, b) * multi;// 4+2
				levels[2] += C(4, r) * C(1, m - r) * (C(1, n - b) * C(1, b)) * multi;// 4+1

				levels[3] += C(4, r) * C(1, m - r) * C(2, n - b) * multi;// 4+0
				levels[3] += C(3, r) * C(2, m - r) * C(2, b) * multi;// 3+2

				levels[3] += C(3, r) * C(2, m - r) * (C(1, n - b) * C(1, b)) * multi;// 3+1
				levels[3] += C(2, r) * C(3, m - r) * C(2, b) * multi;// 2+2
			}
		}
		
		if (pm == PM_ZHUIJIA) {
			
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

			int[] bs = PluginUtil.SplitterInt(codes[1], ",");
			System.arraycopy(bs, 0, bcode, cs.length, bs.length);

			obj.setSingleCode(bcode);
			long first = 0;
			for (int i = 0; i < cs.length; i++) {
				if ( cs[i] <=35 && cs[i] > 0 ) {
					first |= (1L << cs[i]);
				} else {
					throw new CodeFormatException(1, getGameName() + "基本号码在1-35", awardCode);
				}
			}
			obj.setFirst(first);
			obj.setSecond(0);

			long third = 0;
			for (int i = 0; i < bs.length; i++) {
				if ( bs[i] <= 12 && bs[i] > 0) {
					third |= (1L << bs[i]);
				} else {
					throw new CodeFormatException(1, getGameName() + "生肖号码在1-12", awardCode);
				}
			}
			obj.setThird(third);
			obj.setFourth(0);
			obj.setAwardCode(awardCode);
			return obj;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + "开奖号码格式错误, 正确格式为(1,2,3,4,5|6,7)\r\n 不能有重复，基本号码在1-35, 生肖号在1-12", awardCode);
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
		long four = 0;

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

			String[] codes = PluginUtil.splitter(tmpCode[0], "|");
			if ( pm == PM_NORMAL || pm == PM_ZHUIJIA ) {
				if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
					int qdc = 0, qtc = 0, hdc = 0, htc = 0;
					
					String[] mcodes = PluginUtil.splitter(codes[0], "$");
					if ( mcodes.length != 2 ) {
						throw new CodeFormatException(1, "前区胆球号码$前区拖球", s);
					}
					
					if ( mcodes[0].length() > 0) {
						int[] danCodes = PluginUtil.SplitterInt(mcodes[0], ",");
						first = PluginUtil.convertBallToLong(danCodes, MIN_RED, MAX_RED);
						qdc = Long.bitCount(first);
					}
					if (qdc > 4) {
						throw new CodeFormatException(1, "前区胆球号码不正确 胆球数必须在0到4个", s);
					}
					
					if ( mcodes[1].length() > 0) {
						int[] tuoCodes = PluginUtil.SplitterInt(mcodes[1], ",");
						second = PluginUtil.convertBallToLong(tuoCodes, MIN_RED, MAX_RED);
						qtc = Long.bitCount(second);
					}
					
					if ((qdc + qtc) < 5) {
						throw new CodeFormatException(1, "前区胆球数和拖球数必须超过5个", s);
					}

					if (Long.bitCount(first | second) != (qdc + qtc)) {
						throw new CodeFormatException(1, "前区胆球和拖球有重复", s);
					}

					//后区
					String[] hcodes = PluginUtil.splitter(codes[1], "$");
					if ( hcodes.length == 2 ) {
						if ( hcodes[0].length() > 0) {
							int[] danCodes = PluginUtil.SplitterInt(hcodes[0], ",");
							third = PluginUtil.convertBallToLong(danCodes, MIN_BLUE, MAX_BLUE);
							hdc = Long.bitCount(third);
						}
						if (hdc > 1) {
							throw new CodeFormatException(1, "后区胆球号码不正确 胆球数必须在1个", s);
						}

						if ( hcodes[1].length() > 0) {
							int[] tuoCodes = PluginUtil.SplitterInt(hcodes[1], ",");
							four = PluginUtil.convertBallToLong(tuoCodes, MIN_BLUE, MAX_BLUE);
							htc = Long.bitCount(four);
						}
						if ((hdc + htc) < 2) {
							throw new CodeFormatException(1, "后区胆球数和拖球数必须超过2个", s);
						}

					} else if (hcodes.length == 1){
						if ( hcodes[0].length() > 0) {
							int[] tuoCodes = PluginUtil.SplitterInt(hcodes[0], ",");
							four = PluginUtil.convertBallToLong(tuoCodes, MIN_BLUE, MAX_BLUE);
							htc = Long.bitCount(four);
						}
						if ((hdc + htc) < 2) {
							throw new CodeFormatException(1, "后区胆球数和拖球数必须超过2个", s);
						}
					} else {
						throw new CodeFormatException(1, "后区胆球号码$前区拖球", s);
					}
					

					if (Long.bitCount(third | four) != (hdc + htc)) {
						throw new CodeFormatException(1, "后区胆球和拖球有重复", s);
					}

					if (pm == PM_ZHUIJIA) {
						money = 3 * mu * C(5 - qdc, qtc) * C(2 - hdc, htc);
					} else {
						money = 2 * mu * C(5 - qdc, qtc) * C(2 - hdc, htc);
					}
				} else {//单复式
					int[] redCodes = PluginUtil.SplitterInt(codes[0], ",");
					first = PluginUtil.convertBallToLong(redCodes, MIN_RED, MAX_RED);
					int dc = Long.bitCount(first);
					
					int[] blueCode = PluginUtil.SplitterInt(codes[1], ",");
					third = PluginUtil.convertBallToLong(blueCode, MIN_BLUE, MAX_BLUE);
					int bc = Long.bitCount(third);
					
					if (dc < 5 || dc > 25) {
						throw new CodeFormatException(1, "前区号码不正确 号码个数必须是5到25个", s);
					}
					if (pm == PM_ZHUIJIA) {
						money = 3 * mu * C(5, dc) * C(2, bc);
						if ( money > 3 * mu ) {
							cm = GameCastMethodDef.CASTTYPE_MULTI;
						} else {
							cm = GameCastMethodDef.CASTTYPE_SINGLE;
						}
					} else {
						money = 2 * mu * C(5, dc) * C(2, bc);
						if ( money > 2 * mu ) {
							cm = GameCastMethodDef.CASTTYPE_MULTI;
						} else {
							cm = GameCastMethodDef.CASTTYPE_SINGLE;
						}
					}
				}
				
				
			} else if ( pm == PM_SXL ) {
				if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
					String[] mcodes = PluginUtil.splitter(codes[0], "$");
					int[] danCodes = PluginUtil.SplitterInt(mcodes[0], ",");
					int[] tuoCodes = PluginUtil.SplitterInt(mcodes[1], ",");

					third = PluginUtil.convertBallToLong(danCodes, MIN_RED, MAX_RED);
					int dc = Long.bitCount(third);
					if (dc != 1) {
						throw new CodeFormatException(1, "生肖乐胆球号码不正确 胆球数必须在1个", s);
					}

					four = PluginUtil.convertBallToLong(tuoCodes, MIN_RED, MAX_RED);
					int tc = Long.bitCount(four);

					if ((dc + tc) < 2) {
						throw new CodeFormatException(1, "生肖乐胆球数和拖球数必须超过2个", s);
					}

					if (Long.bitCount(third | four) != (dc + tc)) {
						throw new CodeFormatException(1, "胆球和拖球有重复", s);
					}
					
					money = 2 * mu * C(2 - dc, tc);
				} else {
					int[] blueCode = PluginUtil.SplitterInt(codes[0], ",");
					third = PluginUtil.convertBallToLong(blueCode, MIN_BLUE, MAX_BLUE);
					int bc = Long.bitCount(third);
					
					money = 2 * mu * C(2, bc);
					
					if ( money > 2 * mu ) {
						cm = GameCastMethodDef.CASTTYPE_MULTI;
					} else {
						cm = GameCastMethodDef.CASTTYPE_SINGLE;
					}

				}
			}

			if (((first & 1L) == 1) || ((second & 1L) == 1) || ((third & 1L) == 1) || ((four & 1L) == 1)) {
				throw new CodeFormatException(1, "大乐透号码不能选0", s);
			}

			if (money == 0) {
				throw new CodeFormatException(1, "投注金额不能为零", s);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new CodeFormatException(1, "投注格式错误 " + e.getMessage(), s);
		}

		GameCastCode cc = new GameCastCode();
		cc.setFirst(first);
		cc.setSecond(second);
		cc.setThird(third);
		cc.setFour(four);
		cc.setCastMethod(cm);
		cc.setPlayMethod(pm);
		cc.setCastMoney(money);
		cc.setSourceCode(s);
		return cc;
	}

	public String toPrintCode(GameCastCode gcc) {
		String s = "";
		byte cm = gcc.getCastMethod();
		byte pm = gcc.getPlayMethod();
		if ( cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI ) {
			if ( pm == PM_SXL) {
				s = PluginUtil.longToString(gcc.getThird());
			} else {
				s = PluginUtil.longToString(gcc.getFirst());
				s += "|";
				s += PluginUtil.longToString(gcc.getThird());
			}
		} else {
			if ( pm == PM_SXL) {
				s = PluginUtil.longToString(gcc.getThird());
				s += "$";
				s += PluginUtil.longToString(gcc.getFour());
			} else {
				s = PluginUtil.longToString(gcc.getFirst());
				s += "$";
				s += PluginUtil.longToString(gcc.getSecond());
				s += "|";
				s += PluginUtil.longToString(gcc.getThird());
				s += "$";
				s += PluginUtil.longToString(gcc.getFour());
				
			}
		}
		
		return s;
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {

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
			
			if ( cm == GameCastMethodDef.CASTTYPE_SINGLE && gccs[0].getCastMoney() > 2 && pm == PM_NORMAL) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			}
			
			if ( cm == GameCastMethodDef.CASTTYPE_SINGLE && gccs[0].getCastMoney() > 3 && pm == PM_ZHUIJIA) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			}
		}

		if ( cm == 1) {//单式
			money = 0;
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);
				pcode = PluginUtil.replaceString(pcode, "|", "");
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
			if ( pm == GamePlugin_50.PM_SXL ) {//生肖
				str2= toKeyString(pcode);
			} else {
				String[] ss = PluginUtil.splitter(pcode, "|");
				str2 = toKeyString(ss[0]);
				str4 = toKeyString(ss[1]);
			}
		} else if ( cm == 5 ) {//胆拖
			String pcode = toPrintCode(gccs[0]);
			if ( pm == GamePlugin_50.PM_SXL ) {
				String[] sss = PluginUtil.splitter(pcode, "$");
				str3 = toKeyString(sss[0]);//后区胆
				str4 = toKeyString(sss[1]);//后区拖
			} else {
				String[] ss = PluginUtil.splitter(pcode, "|");
				
				//前区
				String[] sss = PluginUtil.splitter(ss[0], "$");
				if ( sss.length == 1) {//前区无胆
					str2 = toKeyString(sss[0]);
				} else {//前区胆
					str1 = toKeyString(sss[0]);
					str2 = toKeyString(sss[1]);
				}

				//后区
				sss = PluginUtil.splitter(ss[1], "$");
				if ( sss.length == 1 ) {//后区无胆
					str4 = toKeyString(sss[0]);
				} else {//后区胆
					str3 = toKeyString(sss[0]);
					str4 = toKeyString(sss[1]);
				}
			}
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
		GamePlugin_50 p = new GamePlugin_50();
//		String codes = "$01,02,03,04,05,06,07|01$02,03:1:5:1";
		String codes = "01,12,23,25,34|03,09:1:1;13,14,16,29,31|02,08:1:1;24,30,31,32,33|04,06:1:1;02,09,22,23,25|06,08:1:1;05,07,19,22,35|02,11:1:1";
		GameCastCode gcc = p.parseGameCastCode(codes);
		
		GameAwardCode bingoCode = p.buildAwardCode("01,02,16,23,25|03,09");
		
		System.out.println(bingoCode.getThird());
		
		int[] levels = p.bingoMatcher(gcc, bingoCode, 20);
		if ( levels != null ) {
			for (int i=0;i<levels.length;i++) {
				System.out.println("levels[" + i + "]=" + levels[i]);
			}
		} else {
			System.out.println("没有中奖");
		}
		
		System.out.println(p.toPrintCode(gcc));
	}
}
