package com.caipiao.plugin;

import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.util.StringUtil;

/**
 * 快乐扑克
 * @author Siva
 *
 */
public class GamePlugin_58 extends GamePluginAdapter {

	private final static int[] nums = { 1, 2, 3, 4, 5, 6, 1, 1, 1, 1, 1, 1 };
	private final static int[] mins = { 1, 2, 3, 4, 5, 6, 1, 1, 1, 1, 1, 7 };
	private final static int[] maxs = { 13, 13, 13, 13, 13, 13, 4, 4, 12, 13, 13, 11};

	public static final int R1 = 1;// 任选一
	public static final int R2 = 2;// 任选二
	public static final int R3 = 3;// 任选三
	public static final int R4 = 4;// 任选四
	public static final int R5 = 5;// 任选五
	public static final int R6 = 6;// 任选六
	
	public static final int TH = 7;
	public static final int HS = 8;
	public static final int SZ = 9;
	public static final int BZ = 10;
	public static final int DZ = 11;
	public static final int BX = 12;

	public GamePlugin_58(){
		this.setGameID("58");
		this.setGameName("快乐扑克");
		this.setGradeNum(16);
	}
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			int[] cs = PluginUtil.SplitterInt(awardCode, ",");
			if (cs.length != 3) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求", awardCode);
			}
			
			int[] arrFlower = {0,0,0};		
			int[] arrBit = {0,0,0};
			
			for (int i=0;i<cs.length;i++){
				int flower = cs[i]/100;
				int bit = cs[i]%100;
				if(bit<1 || bit>13 || flower <1 || flower>4){
					throw new CodeFormatException(1,getGameName() + " 开奖号码不符合要求" , awardCode);
				}
				arrBit[i] = bit;
				arrFlower[i] = flower;
			}
			
			long longBit = 1L<<arrBit[0]|1L<<arrBit[1]|1L<<arrBit[2];
			long longFlower = 1L<<arrFlower[0]|1L<<arrFlower[1]|1L<<arrFlower[2];
			
			long longSZ = 0L;
			if (longBit==(7L<<1)){
				longSZ = 1L<<1;
			}else if(longBit==(7L<<2)){
				longSZ = 1L<<2;
			}else if(longBit==(7L<<3)){
				longSZ = 1L<<3;
			}else if(longBit==(7L<<4)){
				longSZ = 1L<<4;
			}else if(longBit==(7L<<5)){
				longSZ = 1L<<5;
			}else if(longBit==(7L<<6)){
				longSZ = 1L<<6;
			}else if(longBit==(7L<<7)){
				longSZ = 1L<<7;
			}else if(longBit==(7L<<8)){
				longSZ = 1L<<8;
			}else if(longBit==(7L<<9)){
				longSZ = 1L<<9;
			}else if(longBit==(7L<<10)){
				longSZ = 1L<<10;
			}else if(longBit==(7L<<11)){
				longSZ = 1L<<11;
			}else if(longBit==(1L<<1|1L<<12|1L<<13)){
				longSZ = 1L<<12;
			}
			
			long longPair = 0L;
			if (arrBit[0]==arrBit[1]){
				longPair = 1L<<arrBit[0];
			}else if (arrBit[0]==arrBit[2]){
				longPair = 1L<<arrBit[0];
			}else if (arrBit[1]==arrBit[2]){
				longPair = 1L<<arrBit[1];
			}
			
			long first = longBit;
			long third = longFlower;
			long second = longSZ;
			long fourth = longPair;
			/*
			try {
				first = PluginUtil.convertBallToLong(cs, 1, 11);
			} catch (Exception e) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求", awardCode);
			}
			if ((first & 1L) == 1) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求 有0", awardCode);
			}
			*/
			GameAwardCode gac = new GameAwardCode();
			gac.setFirst(first);
			gac.setThird(third);
			gac.setSecond(second);
			gac.setFourth(fourth);
			gac.setAwardCode(awardCode);
			gac.setSingleCode(cs);
			return gac;
		} catch (Exception e) {
			e.printStackTrace();
			throw new CodeFormatException(1, getGameName() + " 开奖号码不正确  正确格式为(101,202,303) ", awardCode);			
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
				if (pm == BX) {// 包选
					String[] cs = PluginUtil.splitter(tmpCode[0], "|");
					int len = cs.length;
					//if (len != 1) {
					//	throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
					//}
					
					for(int i=0;i<len;i++){
						if(PluginUtil.toInt(cs[i]) < 7 || PluginUtil.toInt(cs[i]) > 11){
							throw new CodeFormatException(1, getGameName() + " 包选格式不正确，只能是07-11", s);
						}else first = first | 1L << PluginUtil.toInt(cs[i]);
						//System.out.println(first);
					}
					/*
					if(!cs[0].equals("07") || !cs[0].equals("08") || !cs[0].equals("09") || !cs[0].equals("10") || !cs[0].equals("11")){
						throw new CodeFormatException(1, getGameName() + " 包选格式不正确，只能是07-11", s);
					}
					*/
					//first = 1L << PluginUtil.toInt(cs[0]);
					
					money = 2 * mu * len;
				} else if (pm == TH || pm == HS || pm == SZ || pm == BZ || pm == DZ) {// 同花，同花顺，顺子，豹子，对子
					
					int[] cs = PluginUtil.SplitterInt(tmpCode[0], "|");
					int len = cs.length;

					first = PluginUtil.convertBallToLong(cs, 1, max);
					if (Long.bitCount(first) != len) {
						throw new CodeFormatException(1, getGameName() + " 号码存在重复", s);
					}
					
					money = 2 * mu * len;
				} else {// 其他玩法，任选
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
					first = PluginUtil.convertBallToLong(cs, 1, 13);
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
				if (pm == TH || pm == HS || pm == SZ || pm == BZ || pm == DZ || pm == BX) {
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
				if (dlen + tlen > 13) {
					throw new CodeFormatException(1, getGameName() + " 胆球数和拖球数不能超过13个", s);
				}
				first = PluginUtil.convertBallToLong(dans, 1, 13);
				second = PluginUtil.convertBallToLong(tuos, 1, 13);
				if (Long.bitCount(first | second) != (dlen + tlen)) {
					throw new CodeFormatException(1, getGameName() + " 胆球和拖球有重复", s);
				}
				money = 2 * mu * C(num - dlen,tlen);
			} else {
				throw new CodeFormatException(-1, getGameName() + "投注方式不支持", s);
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

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = new int[gradeNum];
		byte cm = code.getCastMethod();
		byte pm = code.getPlayMethod();
		
		System.out.println(pm);
		
		int mu = 1;
		
		int[] bcodes = bingoCode.getSingleCode();
		long bfirst = bingoCode.getFirst();
		long bsecond = bingoCode.getSecond();
		long bthird = bingoCode.getThird();
		long bfourth = bingoCode.getFourth();
		if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {
			if (pm == R1) {
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 1) {
					levels[pm-1] += len * mu;
				}
			} else if (pm == R2) {
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 2) {
					levels[pm-1] += C(2,len) * mu;
				}
			} else if (pm == R3) {
				if ((code.getFirst() & bfirst) == bfirst) {
					int len = Long.bitCount(bfirst);
					levels[pm-1] += 1 * mu * C(3-len,Long.bitCount(code.getFirst())-len);
				}
			} else if (pm == R4) {
				if ((code.getFirst() & bfirst) == bfirst) {
					int len = Long.bitCount(bfirst);
					levels[pm-1] += 1 * mu * C(4-len, Long.bitCount(code.getFirst())-len);
				}
			} else if (pm == R5) {
				if ((code.getFirst() & bfirst) == bfirst) {
					int len = Long.bitCount(bfirst);
					levels[pm-1] += 1 * mu * C(5-len, Long.bitCount(code.getFirst())-len);
				}
			} else if (pm == R6) {
				if ((code.getFirst() & bfirst) == bfirst) {
					int len = Long.bitCount(bfirst);
					levels[pm-1] += 1 * mu * C(6-len, Long.bitCount(code.getFirst()) -len);
				}
			} else if (pm == TH) {
				if(Long.bitCount(bthird) == 1 && Long.bitCount(code.getFirst() & bthird) == 1 ){
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == HS) {
				if(Long.bitCount(bthird) == 1 && Long.bitCount(bsecond) > 0L && Long.bitCount(code.getFirst() & bthird) == 1 ){
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == SZ) {
				if (Long.bitCount(code.getFirst() & bsecond) == 1) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == BZ) {
				if (Long.bitCount(bfirst) == 1 && Long.bitCount(code.getFirst() & bfirst) == 1) {
					levels[pm-1] += 1 * mu;
				}
			} else if (pm == DZ) {
				if (Long.bitCount(bfirst) == 2 && Long.bitCount(code.getFirst() & bfourth) == 1) {
					levels[pm-1] += 1 * mu;
				}
			}else if (pm == BX) {
				System.out.println(code.getFirst());
					if(code.getFirst()>>7 == 1){
						if(Long.bitCount(bthird) == 1){
							levels[pm-1] += 1 * mu;
						}
					}else if(code.getFirst()>>8 == 1){
						if(Long.bitCount(bthird) == 1 && Long.bitCount(bsecond) > 0L){
							levels[pm] += 1 * mu;
						}
					}else if(code.getFirst()>>9 == 1){
						if(Long.bitCount(bsecond) > 0L){
							levels[pm+1] += 1 * mu;
						}
					}else if(code.getFirst()>>10 == 1){
						if(Long.bitCount(bfirst) == 1){
							levels[pm+2] += 1 * mu;
						}
					}else if(code.getFirst()>>11 == 1){
						if(Long.bitCount(bfirst) == 2 && bfourth > 0L){
							levels[pm+3] += 1 * mu;
						}
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
				if(((code.getFirst() | code.getSecond()) & bfirst) == bfirst){
					//int len = Long.bitCount(bfirst);
					int dan = Long.bitCount(code.getFirst());
					int tuo = Long.bitCount(code.getSecond());
					int dz = Long.bitCount(code.getFirst() & bfirst);
					int tz = Long.bitCount(code.getSecond() & bfirst);
					
					//System.out.println(dan + "    " + tuo);
					//System.out.println(dz + "    " + tz);
					
					if(dan+tz<=3){
						levels[pm-1] += C(3-dan-tz,tuo-tz) * mu;
					}
				}
				
			} else if (pm == R4) {
				if(((code.getFirst() | code.getSecond()) & bfirst) == bfirst){
					//int len = Long.bitCount(bfirst);
					int dan = Long.bitCount(code.getFirst());
					int tuo = Long.bitCount(code.getSecond());
					int dz = Long.bitCount(code.getFirst() & bfirst);
					int tz = Long.bitCount(code.getSecond() & bfirst);
					
					//System.out.println(dan + "    " + tuo);
					//System.out.println(dz + "    " + tz);
					
					if(dan+tz<=4){
						levels[pm-1] += C(4-dan-tz,tuo-tz) * mu;
					}
				}
			} else if (pm == R5) {
				if(((code.getFirst() | code.getSecond()) & bfirst) == bfirst){
					//int len = Long.bitCount(bfirst);
					int dan = Long.bitCount(code.getFirst());
					int tuo = Long.bitCount(code.getSecond());
					int dz = Long.bitCount(code.getFirst() & bfirst);
					int tz = Long.bitCount(code.getSecond() & bfirst);
					
					//System.out.println(dan + "    " + tuo);
					//System.out.println(dz + "    " + tz);
					
					if(dan+tz<=5){
						levels[pm-1] += C(5-dan-tz,tuo-tz) * mu;
					}
				}
			} else if (pm == R6) {
				if(((code.getFirst() | code.getSecond()) & bfirst) == bfirst){
					//int len = Long.bitCount(bfirst);
					int dan = Long.bitCount(code.getFirst());
					int tuo = Long.bitCount(code.getSecond());
					int dz = Long.bitCount(code.getFirst() & bfirst);
					int tz = Long.bitCount(code.getSecond() & bfirst);
					
					//System.out.println(dan + "    " + tuo);
					//System.out.println(dz + "    " + tz);
					
					if(dan+tz<=6){
						levels[pm-1] += C(6-dan-tz,tuo-tz) * mu;
					}
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
		GamePlugin_58 obj = new GamePlugin_58();
		
		//System.out.println(obj.C(1, 0));
		
		String cc = "";
		cc = "11:12:01";// 选一前一直选
		GameCastCode[] codes = obj.parseGameCastCodes(cc);
		
		
		for (int i=0;i<codes.length;i++) {
			System.out.println(codes[i].getCastMoney());
		}
		
		String awardcode = "204,304,212";
		GameAwardCode gac =  obj.buildAwardCode(awardcode);
		System.out.println(gac.getFirst());
		
		int[] levels = obj.bingoMatch(codes, gac, obj.getGradeNum());
		if ( levels != null ) {
			for (int i=0;i<levels.length;i++) {
				System.out.print(levels[i] + " ");
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