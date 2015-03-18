package com.caipiao.plugin.lqutil;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;

public class LqPassTypeUtil {
	private static HashMap<String,Integer> mapsEnd = new HashMap<String,Integer>();
	private static HashMap<String,Integer> mapsStart = new HashMap<String,Integer>();

	static {
		mapsEnd.put("1*1", 1);
		
		mapsEnd.put("2*1", 2);
		mapsEnd.put("3*3", 2);
		mapsEnd.put("4*6", 2);
		mapsEnd.put("5*10", 2);
		mapsEnd.put("6*15", 2);
		
		mapsEnd.put("3*1", 3);
		mapsEnd.put("3*4", 3);
		mapsEnd.put("4*4", 3);
		mapsEnd.put("5*20", 3);
		mapsEnd.put("6*20", 3);
		mapsEnd.put("6*35", 3);
		
		mapsEnd.put("4*1", 4);
		mapsEnd.put("4*5", 4);
		mapsEnd.put("4*11", 4);
		mapsEnd.put("5*5", 4);
		mapsEnd.put("6*50", 4);
		
		mapsEnd.put("5*1", 5);
		mapsEnd.put("5*6", 5);
		mapsEnd.put("5*16", 5);
		mapsEnd.put("5*26", 5);
		mapsEnd.put("6*6", 5);
		
		mapsEnd.put("6*1", 6);
		mapsEnd.put("6*7", 6);
		mapsEnd.put("6*22", 6);
		mapsEnd.put("6*42", 6);
		mapsEnd.put("6*57", 6);
		
		mapsEnd.put("7*1", 7);
		mapsEnd.put("7*7", 6);
		mapsEnd.put("7*8", 7);
		mapsEnd.put("7*21", 5);
		mapsEnd.put("7*35", 4);
		mapsEnd.put("7*120", 7);
		
		mapsEnd.put("8*1", 8);
		mapsEnd.put("8*8", 7);
		mapsEnd.put("8*9", 8);
		mapsEnd.put("8*28", 6);
		mapsEnd.put("8*56", 5);
		mapsEnd.put("8*70", 4);
		mapsEnd.put("8*247", 8);

		mapsStart.put("1*1", 1);
		
		mapsStart.put("2*1", 2);
		mapsStart.put("3*3", 2);
		mapsStart.put("3*4", 2);
		mapsStart.put("4*6", 2);
		mapsStart.put("4*11", 2);
		mapsStart.put("5*10", 2);
		mapsStart.put("5*20", 2);
		mapsStart.put("5*26", 2);
		mapsStart.put("6*15", 2);
		mapsStart.put("6*35", 2);
		mapsStart.put("6*50", 2);
		mapsStart.put("6*57", 2);
		
		mapsStart.put("3*1", 3);
		mapsStart.put("4*4", 3);
		mapsStart.put("4*5", 3);
		mapsStart.put("5*16", 3);
		mapsStart.put("6*20", 3);
		mapsStart.put("6*42", 3);
		
		mapsStart.put("4*1", 4);
		mapsStart.put("5*5", 4);
		mapsStart.put("5*6", 4);
		mapsStart.put("6*22", 4);
		
		mapsStart.put("5*1", 5);
		mapsStart.put("6*6", 5);
		mapsStart.put("6*7", 5);

		mapsStart.put("6*1", 6);
		
		
		mapsStart.put("7*1", 7);
		mapsStart.put("7*7", 6);
		mapsStart.put("7*8", 6);
		mapsStart.put("7*21", 5);
		mapsStart.put("7*35", 4);
		mapsStart.put("7*120", 2);
		
		mapsStart.put("8*1", 8);
		mapsStart.put("8*8", 7);
		mapsStart.put("8*9", 7);
		mapsStart.put("8*28", 6);
		mapsStart.put("8*56", 5);
		mapsStart.put("8*70", 4);
		mapsStart.put("8*247", 2);

	}

	/**
	 * 检查并获取竞彩最大边界值
	 * @param playtype
	 * @param passType
	 * @return -1 为无效
	 */
	public static int checkPassType(int playtype, String passType){
		int end = getEndPassType(passType);
		return end ;
//		if(playtype == JcItemCodeUtil.SPF || playtype == JcItemCodeUtil.JQS){
//			if(end >= 1 && end <= 6){
//				return end;
//			}
//		}else if(playtype == JcItemCodeUtil.CBF || playtype == JcItemCodeUtil.BQC){
//			if(end >= 1 && end <= 3){
//				return end;
//			}
//		}
//		return -1;
	}
		
	/**
	 * 竞彩最小边界值
	 * @param passType
	 * @return
	 */
	public static int getMinRangePassType(String passType){
		return getStart(passType);
	}
	
	/**
	 * 竞彩投注过关方式至少需要投注场次数
	 * @param passType
	 * @return
	 */
	public static int getMaxPassType(String passType){
		int pass = getEndPassType(passType);		
		if(pass != -1){
			return Integer.parseInt(passType.substring(0, passType.lastIndexOf("*")));
		}
		return -1;
	}
	
	/**
	 * 竞彩投注最大边界值
	 * @param passType
	 * @return
	 */
	public static int getEndPassType(String passType){
		Integer obj = mapsEnd.get(passType);
		if ( obj != null ) {
			return obj.intValue();
		} else {
			return -1;
		}
	}
	
	/**
	 * 竞彩投注串最新边界值
	 * @param passType
	 * @return
	 */
	private static int getStart(String passType){
		Integer obj = mapsStart.get(passType);
		if ( obj != null ) {
			return obj.intValue();
		} else {
			return -1;
		}
	}
	
//	public static int getMaxHHPassType(long val){
//		int max = 0;
//		if(Long.bitCount(val & (1L << LqItemCodeUtil.SF)) == 1){
//			max = max == 0 ? getMaxPassType(LqItemCodeUtil.SF) : Math.min(max, getMaxPassType(LqItemCodeUtil.SF));
//		}
//		if(Long.bitCount(val & (1L << LqItemCodeUtil.RFSF)) == 1){
//			max = max == 0 ? getMaxPassType(LqItemCodeUtil.RFSF) : Math.min(max, getMaxPassType(LqItemCodeUtil.RFSF));
//		}
//		if(Long.bitCount(val & (1L << LqItemCodeUtil.SFC)) == 1){
//			max = max == 0 ? getMaxPassType(LqItemCodeUtil.SFC) : Math.min(max, getMaxPassType(LqItemCodeUtil.SFC));
//		}
//		if(Long.bitCount(val & (1L << LqItemCodeUtil.DXF)) == 1){
//			max = max == 0 ? getMaxPassType(LqItemCodeUtil.DXF) : Math.min(max, getMaxPassType(LqItemCodeUtil.DXF));
//		}
//		return max;
//	}
	
	public static int getMaxPassType(int gid){
		if(gid == LqItemCodeUtil.SFC){
			return 4;
		}
		return 8;
	}
	
	public static int getWeekNo(String itemID) {
		if ( itemID == null || itemID.length() != 9) {
			return -1;
		}
		try {
			String ss = "20" + itemID.substring(0,6);
			SimpleDateFormat DateTimeFormater = new SimpleDateFormat("yyyyMMdd");
			Calendar cal  = Calendar.getInstance(Locale.CHINA);
			cal.setTime(DateTimeFormater.parse(ss));
			int ii = cal.get(Calendar.DAY_OF_WEEK);
			return ii;
		} catch (Exception e) {
			return -2;
		}
	}
}
