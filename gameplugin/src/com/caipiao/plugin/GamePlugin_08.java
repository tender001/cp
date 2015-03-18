package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 快3
 * @author lc
 *
 */
public class GamePlugin_08 extends GamePluginAdapter {

	private final static int[] nums = { 1, 0, 3, 3, 0, 1, 0, 2};
	private final static int[] mins = { 4, 0, 1, 1, 0, 1, 1, 1};
	private final static int[] maxs = { 17, 0, 6, 6, 0, 6, 6, 6};

	public static final int HZ = 1;// 和值
	public static final int STHTX = 2;// 三同号通选
	public static final int STHDX = 3;// 三同号单选
	public static final int SBTH = 4;// 三不同号
	public static final int SLHTX = 5;// 三连号通选
	public static final int ETHFX = 6;// 二同号复选
	public static final int ETHDX = 7;// 二同号单选
	public static final int EBTH = 8;// 二不同号

	public GamePlugin_08(){
		this.setGameID("06");
		this.setGameName("快3");//内蒙快三
		this.setGradeNum(21);
	}
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			int[] cs = PluginUtil.SplitterInt(awardCode, ",");
			if (cs.length != 3) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码不符合要求", awardCode);
			}
			int[] arrBit = {0,0,0};
			for (int i=0;i<cs.length;i++){
				int bit = cs[i];
				if(bit<1 || bit>6 ){
					throw new CodeFormatException(1,getGameName() + " 开奖号码不符合要求" , awardCode);
				}
				arrBit[i] = bit;
			}
			
			long longBit = 1L<<arrBit[0]|1L<<arrBit[1]|1L<<arrBit[2];
			
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
			}
			long longPair = 0L;
			long longPairD = 0L;
			if (cs[0]==cs[1]){
				longPair = 1L<<cs[0];
				longPairD = 1L<<cs[2];
			}else if (cs[0]==cs[2]){
				longPair = 1L<<cs[0];
				longPairD = 1L<<cs[1];
			}else if (cs[1]==cs[2]){
				longPair = 1L<<cs[1];
				longPairD = 1L<<cs[0];
			}
			
			GameAwardCode gac = new GameAwardCode();
			gac.setFirst(longBit);
			gac.setSecond(longSZ);
			gac.setThird(longPairD);//对子之外的值
			gac.setFourth(longPair);
			gac.setAwardCode(awardCode);
			gac.setSingleCode(cs);
			gac.setBackupNo(cs[0] + cs[1] + cs[2]);//计算和值
			return gac;
		} catch (Exception e) {
			throw new CodeFormatException(1, getGameName() + " 开奖号码不正确  正确格式为(1,2,3) 号码必须在1-6 必须有3个位置", awardCode);			
		}		
	}

	@Override
	public int getRealGrade(int awardgrade) {
		
		return awardgrade +12;
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
			
			if (cm == GameCastMethodDef.CASTTYPE_HESHU) {
				int[] cs = PluginUtil.SplitterInt(tmpCode[0], ",");
				int len = cs.length;
				first = PluginUtil.convertBallToLong(cs, min, max);
				if (Long.bitCount(first) != len) {
					throw new CodeFormatException(1, getGameName() + " 号码存在重复", s);
				}
				cs = null;
				money = 2 * mu * len;
				
			}else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {
				if (pm == STHTX||pm==SLHTX) {// 三同号通选 三连号通选
					String[] cs = PluginUtil.splitter(tmpCode[0], ",");
					int len = cs.length;
					for(int i=0;i<len;i++){
						if(PluginUtil.toInt(cs[i]) !=0){
							throw new CodeFormatException(1, getGameName() + " 格式不正确，投注号只能是0", s);
						}else first = first | 1L;
						//System.out.println(first);
					}
					cs = null;
					money = 2 * mu;
				} else if (pm == ETHDX) {// 二同号单选
					
					String[] cs = PluginUtil.splitter(tmpCode[0], "|");
					if (cs.length != 2) {
						throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
					}
					
					int[] ths = PluginUtil.SplitterInt(cs[0], ",");
					int[] bths = PluginUtil.SplitterInt(cs[1], ",");
					int tlen = ths.length, btlen = bths.length;
					if (tlen <  min) {
						throw new CodeFormatException(1, getGameName() + " 同号个数必须不小于" + min + "个", s);
					}
					if (btlen < min) {
						throw new CodeFormatException(1, getGameName() + " 不同号个数必须不小于" + min + "个", s);
					}
					if (tlen + btlen > max) {
						throw new CodeFormatException(1, getGameName() + " 同号和不同号个数不能超过" + max + "个", s);
					}
					first = PluginUtil.convertBallToLong(ths, min, max);
					second = PluginUtil.convertBallToLong(bths, min, max);
					if (Long.bitCount(first | second) != (tlen + btlen)) {
						throw new CodeFormatException(1, getGameName() + " 同号和不同号有重复", s);
					}
					cs = null;
					money = 2 * mu * tlen*btlen;
				} else if (pm == STHDX) {// 三同号单选
					int[] cs = PluginUtil.SplitterInt(tmpCode[0], ",");
					if (cs.length != num) {
						throw new CodeFormatException(1, getGameName() + " 格式不符合要求", s);
					}
					for (int i=0;i<cs.length;i++){
						int bit = cs[i];
						if(bit<min || bit>max ){
							throw new CodeFormatException(1,getGameName() + " 号码必须在" + min + "-" + max + "之间" , s);
						}
					}
					first = 1L<<cs[0]|1L<<cs[1]|1L<<cs[2];
					if (Long.bitCount(first) != 1) {
						throw new CodeFormatException(3, "格式不符合要求 必须为3同号", s);
					}
					cs = null;
					money = 2 * mu;
				}else if (pm == SBTH||pm==ETHFX||pm==EBTH) {// 三不同号 二同号复选 二不同号
					int[] cs = PluginUtil.SplitterInt(tmpCode[0], ",");
					int len = cs.length;
					if (len < num || len > max) {
						throw new CodeFormatException(2, getGameName() + " 号码个数必须在" + num + "-" + max + "之间", s);
					}
					first = PluginUtil.convertBallToLong(cs, min, max);
					if ((first & 1L) == 1) {
						throw new CodeFormatException(3, "号码不能选0", s);
					}
					cs = null;
					money = 2 * mu * C(num,len);
				}

				if ( money > 2 * mu ) {
					cm = GameCastMethodDef.CASTTYPE_MULTI;
				} else {
					cm = GameCastMethodDef.CASTTYPE_SINGLE;
				}

			} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {
				
				if (pm == HZ || pm == STHTX || pm == STHDX|| pm == SLHTX|| pm == ETHFX|| pm == ETHDX) {
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
					throw new CodeFormatException(1, getGameName() + " 胆拖投注胆码个数必须在" + 1 + "-" + num + "之间", s);
				}
				if (dlen + tlen <= num) {
					throw new CodeFormatException(1, getGameName() + " 胆球数和拖球数必须超过" + num + "个", s);
				}
				if (dlen + tlen > 6) {
					throw new CodeFormatException(1, getGameName() + " 胆球数和拖球数不能超过6个", s);
				}
				first = PluginUtil.convertBallToLong(dans, 1, 6);
				second = PluginUtil.convertBallToLong(tuos, 1, 6);
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
		
		long bfirst = bingoCode.getFirst();
		long bsecond = bingoCode.getSecond();
		long bthird = bingoCode.getThird();
		long bfourth = bingoCode.getFourth();
		int g = getRealGrade(pm);
		
		if (cm == GameCastMethodDef.CASTTYPE_HESHU) {// 和值
			int he = (int) bingoCode.getBackupNo();
			long lh = 1L << he;

			if (Long.bitCount(code.getFirst() & lh) == 1) {
				levels[he-4] = 1;
			}
		}else if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {
			
			if (pm == STHTX) {//三同号通选
				if (Long.bitCount(bfirst) == 1 && Long.bitCount(code.getFirst()&1L) == 1) {
					levels[g] = 1;
				}
			}else if (pm == STHDX) {//三同号单选 三不同号
				if ((code.getFirst()&bfirst) == bfirst) {
					levels[g] = 1;
				}
			}else if (pm==SBTH) {//三不同号
				if ((code.getFirst()&bfirst) == bfirst) {
					levels[g+2] = 1;
				}
			}else if(pm==SLHTX){//三连号通选
				if(bsecond>0&& Long.bitCount(code.getFirst()&1L) == 1){
					levels[g+3] = 1;
				}
			}else if (pm == ETHFX) {//二同号复选
				if(Long.bitCount(bfirst) < 3&& Long.bitCount(code.getFirst() & bfourth) == 1){
					levels[g-2] = 1;
				}
			}else if (pm == ETHDX) {//二同号单选
				if(Long.bitCount(bfirst) == 2&& Long.bitCount(code.getFirst() & bfourth) == 1&& Long.bitCount(code.getSecond() & bthird) == 1){
					levels[g-2] = 1;
				}
			}else if (pm == EBTH) {//二不同号
				int len = Long.bitCount(code.getFirst() & bfirst);
				if (len >= 2) {
					levels[g-1] = C(2,len) * 1;
				}
			}
		} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {
			
			if (pm==SBTH) {//三不同号
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz >= 3 && (dz == Long.bitCount(code.getFirst()))) {
					levels[g+2] += C(3 - dz,tz) * 1;
				}
			}else if (pm == EBTH) {//二不同号
				int dz = Long.bitCount(code.getFirst() & bfirst);
				int tz = Long.bitCount(code.getSecond() & bfirst);
				if (dz + tz >= 2 && (dz == Long.bitCount(code.getFirst()))) {
					levels[g-1] = C(2 - dz,tz) * 1;
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
		GamePlugin_08 obj = new GamePlugin_08();
		
		//System.out.println(obj.C(1, 0));
		
		String cc = "";
		cc = "5,6:8:1";// 
		GameCastCode[] codes = obj.parseGameCastCodes(cc);
		
		
		for (int i=0;i<codes.length;i++) {
			System.out.println(codes[i].getFirst());
		}
		
		String awardcode = "6,5,3";
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
		
		
//		 cc = "4:1:4";// 和值
//		 cc = "4,5,6:1:4";
//		 cc = "0,0,0:2:1";// 三同号通选
//		 cc = "1,1,1:3:1";// 三同号单选
//		 cc = "4,5,6:4:1";// 三不同号 1,2,5,6:4:1
//		 cc = "1,2,3,5,6:4:1";
//		 cc = "0,0,0:5:1";// 三连号通选
//		 cc = "2:6:1";// 二同号复选 2,5,6:6:1
//		 cc = "2,5,6:6:1";
//		 cc = "1|3:7:1";// 二同号单选 1,5|3,6:7:1
//		 cc = "1,5|3,6:7:1";
//		 cc = "5,6:8:1";// 二不同号 3,5,6:8:1
//		 cc = "1,2,3:8:1";// 
//		 
//		 
//		cc = "1$3,4,5:4:5";//三不同号
//		cc ="1$3,4,5,6:8:5"; //二不同号
//		GameCastCode[] codes = obj.parseGameCastCodes(cc);
//
//		System.out.println(codes.length);
//		System.out.println(codes[0].getCastMoney());

	}
}