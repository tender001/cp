package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 快乐双彩（10）
 * @author zhurong.chen
 *
 */
public class GamePlugin_10 extends GamePluginAdapter {
	
	public GamePlugin_10() {
		this.setGameID("01");
		this.setGameName("快乐双彩");
		this.setGradeNum(11);
	}

	public static final int PM_SINGAL = 1;	//24选7
	public static final int PM_LUCK5 = 2;	//好运五
    public static final int PM_LUCK4 = 3;	//好运四
    public static final int PM_LUCK3 = 4;	//好运三
    public static final int PM_LUCK2 = 5;	//好运二
    public static final int PM_LUCKTE = 6;	//好运特
    private static int[] balls = {0,7,5,4,3,2,1,0};	//玩法对应的选球数
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
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

		int maxNum = 24;

		byte pm = 0, cm = 0;
		int money = 0;

		int bnum = 0;//根据玩法所需要选的基础球数

		try {
			String[] tmpCode = PluginUtil.splitter(s, ":");
			if (tmpCode.length != 3) {
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
    
    				first = PluginUtil.convertBallToLong(danCodes, 1, maxNum);
    				dc = Long.bitCount(first);
    				if (dc < 1 || dc > bnum) {
    					throw new CodeFormatException(1, "胆球号码不正确 胆球数必须在1到" + bnum + "个", s);
    				}
    
    				second = PluginUtil.convertBallToLong(tuoCodes, 1, maxNum);
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
				first = PluginUtil.convertBallToLong(redCodes, 1, maxNum);
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
		cc.setCastMethod(cm);
		cc.setPlayMethod(pm);
		cc.setCastMoney(money);

		return cc;
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		long base = bingoCode.getFirst();
		long spec = bingoCode.getThird();

		int[] levels = new int[gradeNum];
		if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			
			int d = Long.bitCount(code.getFirst());	// 胆球数
			int t = Long.bitCount(code.getSecond());// 拖球数

			int s = Long.bitCount(code.getFirst() & base);	// 中胆球数
			int k = Long.bitCount(code.getSecond() & base);	// 中拖球数

			int dp = Long.bitCount(code.getFirst() & spec);	//胆中特别号(dp不含在s中)
			int tp = Long.bitCount(code.getSecond() & spec);//拖中特别号(tp不含在k中)
			
			switch ( code.getPlayMethod() ) {
			case PM_SINGAL: {
				
				//6-d-(4-s)表示要选择几个非匹配的球 
				//然后t-k表示共有多少个非匹配的球可以选择 
				levels[0] = dp * C(6 - s, k) * C(6 - d - (6-s-dp), t - k) + tp * C(6 - s, k) * C((6 - d) - (6 - s), t - k - tp);//6+1
				levels[1] = (1 - dp) * C(6 - s, k) * C(6 - d - (6 - s), t - k - tp);//6+0
				levels[2] = dp * C(5 - s, k) * C(6 - d - (5-s-dp), t - k) + tp * C(5 - s, k) * C((6 - d) - (5 - s), t - k - tp);//5+1
				levels[3] = (1 - dp) * C(5 - s, k) * C(6 - d - (5 - s), t - k - tp);//5+0
				levels[4] = dp * C(4 - s, k) * C(6 - d - (4-s-dp), t - k) + tp * C(4 - s, k) * C((6 - d) - (4 - s), t - k - tp);//4+1
				levels[5] = (1 - dp) * C(4 - s, k) * C(6 - d - (4 - s), t - k - tp);//4+0
				levels[5] += dp * C(3 - s, k) * C(6 - d - (3-s-dp), t - k) + tp * C(3 - s, k) * C((6 - d) - (3 - s), t - k - tp);//3+1

				break ;
			}
			case PM_LUCK5: {
				levels[10] = C(5 - s, k) * C(5 - d - (5 - s), t - k);
				break ;
			}
			case PM_LUCK4: {
				levels[9] = C(4 - s, k) * C(4 - d - (4 - s), t - k);
				break ;
			}
			case PM_LUCK3: {
				levels[8] = C(3 - s, k) * C(3 - d - (3 - s), t - k);
				break ;
			}
			case PM_LUCK2: {
				levels[7] = C(2 - s, k) * C(2 - d - (2 - s), t - k);
				break ;
			}
			
			}
		} else {//单复式
			int n = Long.bitCount(code.getFirst());// 选球数

			int m = Long.bitCount(code.getFirst() & base);// 中球数

			int sp = Long.bitCount(code.getFirst() & spec);
			
			switch ( code.getPlayMethod() ) {
			case PM_SINGAL: {
				/*
				一等奖：选定的7个号码与6个基本号码相符，同时特别号码相符（顺序不限，下同）
				二等奖：选定的7个号码与6个基本号码相符；
				三等奖：选定的7个号码与5个基本号码相符，同时特别号码相符；
				四等奖：选定的7个号码与5个基本号码相符；
				五等奖：选定的7个号码与4个基本号码相符，同时特别号码相符；
				六等奖：选定的7个号码与4个基本号码相符；或与3个基本号码相符，同时特别号码相符。 
				 */
				levels[0] = sp * C(6, m);// 6+1
				levels[1] = (sp * C(6, m) * C(1, n - m - sp) + (1 - sp) * C(6, m) * C(1, n - m));// 6+0
				levels[2] = sp * C(5, m) * C(2 - sp, n - m - sp);// 5+1
				levels[3] = (sp * C(5, m) * C(2, n - m - sp) + (1 - sp) * C(5, m) * C(2, n - m));// 5+0
				levels[4] = sp * C(4, m) * C(3 - sp, n - m - sp);// 4+1
				levels[5] = (sp * C(4, m) * C(3, n - m - sp) + (1 - sp) * C(4, m) * C(3, n - m));// 4+0
				levels[5] += sp * C(3, m) * C(4 - sp, n - m - sp);// 3+1
				break ;
			}
			/*
				好运特：选定的1个号码与开出的特别号码相符
				好运二：选定的2个号码与开出的2个基本号码相符（顺序不限，下同）
				好运三：选定的3个号码与开出的3个基本号码相符
				好运四：选定的4个号码与开出的4个基本号码相符
				好运五：选定的5个号码与开出的5个基本号码相符
			 */
			case PM_LUCK5: {
				levels[10] = C(5,m);
				break ;
			}
			case PM_LUCK4: {
				levels[9] = C(4,m);
				break ;
			}
			case PM_LUCK3: {
				levels[8] = C(3,m);
				break ;
			}
			case PM_LUCK2: {
				levels[7] = C(2,m);
				break ;
			}
			case PM_LUCKTE: {//好运特
				levels[6] = C(1,sp);
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

	public static void main(String[] args) throws Exception{
		String code = "01$02,03:5:5";
		GamePlugin_10 plugin = new GamePlugin_10();
		GameCastCode gcc = plugin.parseGameCastCode(code);
		System.out.println(gcc.getCastMoney());
		GameAwardCode gac = plugin.buildAwardCode("01,02,03,04,05,06|07");
		int [] level = plugin.bingoMatcher(gcc, gac, plugin.getGradeNum());
		if(level != null){
			for(int lv : level){
				System.out.print(lv + "\t");
			}
			System.out.println();
		}
	}
}
