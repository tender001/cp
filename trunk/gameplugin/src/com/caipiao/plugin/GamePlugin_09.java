package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

public class GamePlugin_09 extends GamePluginAdapter {
	
	public static final int PM_LUCK5 = 1;	//直选好运五
    public static final int PM_LUCK4 = 2;	//直选好运四
    public static final int PM_LUCK3 = 3;	//直选好运三
    public static final int PM_LUCK2 = 4;	//直选好运二
    public static final int PM_LUCK1 = 5;	//直选好运一
    public static final int PM_MLUCK5 = 6;	//通选好运五
    public static final int PM_MLUCK4 = 7;	//通选好运四
    public static final int PM_MLUCK3 = 8;	//通选好运三
    public static final int PM_LUCKTE = 9;	//直选好运特
	
    private static int[] balls = {0,5,4,3,2,1,5,4,3,1,0};//玩法对应的选球数

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		GameAwardCode obj = new GameAwardCode();

		int[] cs = PluginUtil.SplitterInt(awardCode, ",");

		obj.setSingleCode(cs);
		long first = 0;
		for (int i = 0; i < cs.length; i++) {
			first |= (1L << cs[i]);
		}
		obj.setFirst(first);
		obj.setThird(1L << cs[4]);
		obj.setAwardCode(awardCode);
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

		int maxNum = 21;

		byte pm = 0, cm = 0;
		int money = 0;

		int bnum = 0;//根据玩法所需要选的最大球数

		try {
			String[] tmpCode = PluginUtil.splitter(s, ":");
			if (tmpCode.length != 4) {
				throw new CodeFormatException(1, "投注格式错误", s);
			}

			pm = PluginUtil.toByte(tmpCode[1]);
			cm = PluginUtil.toByte(tmpCode[2]);

			bnum = balls[pm];

			int dc = 0, tc = 0;

			if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
				if ( bnum > 1 ) {
    				String[] mcodes = PluginUtil.splitter(tmpCode[0], "$");
    				int[] danCodes = PluginUtil.SplitterInt(mcodes[0], ",");
    				int[] tuoCodes = PluginUtil.SplitterInt(mcodes[1], ",");
    
    				first = PluginUtil.convertBallToLong(danCodes, bnum, maxNum);
    				dc = Long.bitCount(first);
    				if (dc < 1 || dc > bnum) {
    					throw new CodeFormatException(1, "胆球号码不正确 胆球数必须在1到" + bnum + "个", s);
    				}
    
    				second = PluginUtil.convertBallToLong(tuoCodes, bnum, maxNum);
    				tc = Long.bitCount(second);
    
    				if ((dc + tc) < bnum) {
    					throw new CodeFormatException(1, "胆球数和拖球数必须超过" + bnum + "个", s);
    				}
    				
    				if ( Long.bitCount(first | second) != (dc + tc) ) {
    					throw new CodeFormatException(1, "胆球和拖球有重复", s);
    				}
    
    				money = 2 * PluginUtil.C(bnum - dc,tc);
				} else {
					throw new CodeFormatException(1, "该玩法没有胆拖", s);
				}
			} else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
				int[] redCodes = PluginUtil.SplitterInt(tmpCode[0], ",");
				first = PluginUtil.convertBallToLong(redCodes, bnum, maxNum);
				dc = Long.bitCount(first);
				if (dc < bnum ) {
					throw new CodeFormatException(1, "选球号码不正确 选数必须大于" + bnum, s);
				}
				money = 2 * PluginUtil.C(bnum,dc);
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

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();

		int[] levels = new int[gradeNum];
		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {

			int d = Long.bitCount(code.getFirst());// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数

			int s = Long.bitCount(code.getFirst() & base);// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);// 中拖球数

			
			switch ( code.getPlayMethod() ) {
			case PM_LUCK5: {
				levels[4] = C(5 - s, k) * C(5 - d - (5 - s), t - k);
				break ;
			}
			case PM_LUCK4: {
				levels[3] = C(4 - s, k) * C(4 - d - (4 - s), t - k);
				break ;
			}
			case PM_LUCK3: {
				levels[2] = C(3 - s, k) * C(3 - d - (3 - s), t - k);
				break ;
			}
			case PM_LUCK2: {
				levels[1] = C(2 - s, k) * C(2 - d - (2 - s), t - k);
				break ;
			}
			case PM_MLUCK5: {
				levels[10] = C(5 - s, k) * C(5 - d - (5 - s), t - k);
				levels[11] = C(4 - s, k) * C(5 - d - (4 - s), t - k);
				levels[12] = C(3 - s, k) * C(5 - d - (3 - s), t - k);

				break ;
			}
			case PM_MLUCK4 :{
				levels[7] = C(4 - s, k) * C(4 - d - (4 - s), t - k);
				levels[8] = C(3 - s, k) * C(4 - d - (3 - s), t - k);
				levels[9] = C(2 - s, k) * C(4 - d - (2 - s), t - k);
				break ;
			}
			case PM_MLUCK3: {
				levels[5] = C(3 - s, k) * C(3 - d - (3 - s), t - k);
				levels[6] = C(2 - s, k) * C(4 - d - (2 - s), t - k);
				break ;
			}
			}
		} else {
			int n = Long.bitCount(code.getFirst());// 选球数

			int m = Long.bitCount(code.getFirst() & base);// 中球数

			switch ( code.getPlayMethod() ) {
			case PM_LUCK5: {
				levels[4] = C(5,m);
				break ;
			}
			case PM_LUCK4: {
				levels[3] = C(4,m);
				break ;
			}
			case PM_LUCK3: {
				levels[2] = C(3,m);
				break ;
			}
			case PM_LUCK2: {
				levels[1] = C(2,m);
				break ;
			}
			case PM_LUCK1: {
				levels[0] = C(1,m);
				break ;
			}
			case PM_MLUCK5: {
				levels[10] = C(5,m);
				levels[11] = C(4,m) * C(1,n-m);
				levels[12] = C(3,m) * C(2,n-m);
				break ;
			}
			case PM_MLUCK4 :{
				levels[7] = C(4,m);
				levels[8] = C(3,m) * C(1,n-m);
				levels[9] = C(2,m) * C(2,n-m);
				
				break ;
			}
			case PM_MLUCK3: {
				levels[5] = C(3,m);
				levels[6] = C(2,m) * C(1,n-m);
				
				break ;
			}
			case PM_LUCKTE: {
				int t = Long.bitCount(code.getFirst() & bingoCode.getThird());
				if ( t == 1 ) {
					levels[13] = 1;
				}
				break ;
			}
			}
		}
		return levels;
	}

	@Override
	public String toPrintCode(GameCastCode gcc) {
		return null;
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		return null;
	}

}
