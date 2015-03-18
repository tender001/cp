package com.caipiao.plugin.bjutil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.CombineUtil;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;

public class BJUtil {
	
	public final static String SPF = "85";
	public final static String CBF = "86";
	public final static String BQC = "87";
	public final static String SXP = "88";
	public final static String JQS = "89";
	public final static String SFGG = "84";

	private static HashMap<String, String> KEY_MAP = new HashMap<String, String>();

	static {
		KEY_MAP.put("85_3", "3");
		KEY_MAP.put("85_1", "1");
		KEY_MAP.put("85_0", "0");
		
		KEY_MAP.put("86_9:0", "9:0");
		KEY_MAP.put("86_1:0", "1:0");
		KEY_MAP.put("86_2:0", "2:0");
		KEY_MAP.put("86_2:1", "2:1");
		KEY_MAP.put("86_3:0", "3:0");
		KEY_MAP.put("86_3:1", "3:1");
		KEY_MAP.put("86_3:2", "3:2");
		KEY_MAP.put("86_4:0", "4:0");
		KEY_MAP.put("86_4:1", "4:1");
		KEY_MAP.put("86_4:2", "4:2");
		KEY_MAP.put("86_9:9", "9:9");
		KEY_MAP.put("86_0:0", "0:0");
		KEY_MAP.put("86_1:1", "1:1");
		KEY_MAP.put("86_2:2", "2:2");
		KEY_MAP.put("86_3:3", "3:3");
		KEY_MAP.put("86_0:9", "0:9");
		KEY_MAP.put("86_0:1", "0:1");
		KEY_MAP.put("86_0:2", "0:2");
		KEY_MAP.put("86_1:2", "1:2");
		KEY_MAP.put("86_0:3", "0:3");
		KEY_MAP.put("86_1:3", "1:3");
		KEY_MAP.put("86_2:3", "2:3");
		KEY_MAP.put("86_0:4", "0:4");
		KEY_MAP.put("86_1:4", "1:4");
		KEY_MAP.put("86_2:4", "2:4");
		
		KEY_MAP.put("87_3-3", "3-3");
		KEY_MAP.put("87_3-1", "3-1");
		KEY_MAP.put("87_3-0", "3-0");
		KEY_MAP.put("87_1-3", "1-3");
		KEY_MAP.put("87_1-1", "1-1");
		KEY_MAP.put("87_1-0", "1-0");
		KEY_MAP.put("87_0-3", "0-3");
		KEY_MAP.put("87_0-1", "0-1");
		KEY_MAP.put("87_0-0", "0-0");
		
		KEY_MAP.put("88_3", "1-1");
		KEY_MAP.put("88_2", "1-0");
		KEY_MAP.put("88_1", "0-1");
		KEY_MAP.put("88_0", "0-0");
		
		KEY_MAP.put("89_0", "0");
		KEY_MAP.put("89_1", "1");
		KEY_MAP.put("89_2", "2");
		KEY_MAP.put("89_3", "3");
		KEY_MAP.put("89_4", "4");
		KEY_MAP.put("89_5", "5");
		KEY_MAP.put("89_6", "6");
		KEY_MAP.put("89_7", "7");
		
		KEY_MAP.put("84_3", "3");
		KEY_MAP.put("84_0", "0");
		
	}

	
	public static int getStart(String prefix) {
		if (prefix.startsWith("单场") || prefix.startsWith("单关") || prefix.startsWith("1*1") || prefix.startsWith("2*3") || prefix.startsWith("3*7")
				|| prefix.startsWith("4*15") || prefix.startsWith("5*31") || prefix.startsWith("6*63")) {
			return 1;
		} else if (prefix.startsWith("2*1") || prefix.startsWith("3*4") || prefix.startsWith("4*11") || prefix.startsWith("5*26")
				|| prefix.startsWith("6*57")) {
			return 2;
		} else if (prefix.startsWith("3*1") || prefix.startsWith("4*5") || prefix.startsWith("5*16") || prefix.startsWith("6*42")) {
			return 3;
		} else if (prefix.startsWith("4*1") || prefix.startsWith("5*6") || prefix.startsWith("6*22")) {
			return 4;
		} else if (prefix.startsWith("5*1") || prefix.startsWith("6*7")) {
			return 5;
		} else if (prefix.startsWith("6*1")) {
			return 6;
		} else if (prefix.startsWith("7*1")) {
			return 7;
		} else if (prefix.startsWith("8*1")) {
			return 8;
		} else if (prefix.startsWith("9*1")) {
			return 9;
		} else if (prefix.startsWith("10*1")) {
			return 10;
		} else if (prefix.startsWith("11*1")) {
			return 11;
		} else if (prefix.startsWith("12*1")) {
			return 12;
		} else if (prefix.startsWith("13*1")) {
			return 13;
		} else if (prefix.startsWith("14*1")) {
			return 14;
		} else if (prefix.startsWith("15*1")) {
			return 15;
		}
		return -1;
	}

	public static int getEnd(String guoguan) {
		if (guoguan.startsWith("单场") || guoguan.startsWith("单关") || guoguan.startsWith("1*1")) {
			return 1;
		} else if (guoguan.startsWith("2*1")) {
			return 2;
		} else if (guoguan.startsWith("2*3")) {
			return 2;
		} else if (guoguan.startsWith("3*1") || guoguan.startsWith("3*4") || guoguan.startsWith("3*7")) {
			return 3;
		} else if (guoguan.startsWith("4*1") || guoguan.startsWith("4*5") || guoguan.startsWith("4*11") || guoguan.startsWith("4*15")) {
			return 4;
		} else if (guoguan.startsWith("5*1") || guoguan.startsWith("5*6") || guoguan.startsWith("5*16") || guoguan.startsWith("5*26")
				|| guoguan.startsWith("5*31")) {
			return 5;
		} else if (guoguan.startsWith("6*1") || guoguan.startsWith("6*7") || guoguan.startsWith("6*22") || guoguan.startsWith("6*42")
				|| guoguan.startsWith("6*57") || guoguan.startsWith("6*63")) {
			return 6;
		} else if (guoguan.startsWith("7*1")) {
			return 7;
		} else if (guoguan.startsWith("8*1")) {
			return 8;
		} else if (guoguan.startsWith("9*1")) {
			return 9;
		} else if (guoguan.startsWith("10*1")) {
			return 10;
		} else if (guoguan.startsWith("11*1")) {
			return 11;
		} else if (guoguan.startsWith("12*1")) {
			return 12;
		} else if (guoguan.startsWith("13*1")) {
			return 13;
		} else if (guoguan.startsWith("14*1")) {
			return 14;
		} else if (guoguan.startsWith("15*1")) {
			return 15;
		} else {
			return -1;
		}
	}
	
	public static List<BJCastCode> getAllCode(GameCastCode gcc,String gameID) throws CodeFormatException {
		String code = gcc.getSourceCode();

		List<String> cplist = new ArrayList<String>();
//		if (PluginUtil.isEmpty(gcc.getSourceCode())) {
//			return null;
//		}

		String[] parts = PluginUtil.splitter(gcc.getSourceCode(), "|");
		String ccode = parts[1].trim();
		String[] guoguans = PluginUtil.splitter(parts[2].trim(), ",");

		String[] dans = null;
		String[] tuos = null;
		int[] tmp = null;
		if (gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_SINGLE || gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_MULTI) {
			dans = ccode.split(",");
			for (String guoguan : guoguans) {
				int start = BJUtil.getEnd(guoguan);// ???
				System.out.println(dans.length + "-" + start);
				List<int[]> danlist = CombineUtil.combine(dans.length, start);
				if(danlist != null){
					for (int j = 0; j < danlist.size(); j++) {
						tmp = danlist.get(j);
						StringBuffer sb = new StringBuffer();
						for (int k = 0; k < tmp.length; k++) {
							if (tmp[k] > 0) {
								sb.append(dans[k]).append(",");
							}
						}
						String tmp_code = sb.toString();
						tmp_code = tmp_code.substring(0, tmp_code.length() - 1);
						cplist.add(tmp_code + "|" + guoguan);
					}
				}
			}
		} else if (gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {
			String[] codes = PluginUtil.splitter(ccode, "$");
			dans = PluginUtil.splitter(codes[0].trim(), ",");
			tuos = PluginUtil.splitter(codes[1].trim(), ",");

			int rdan = 0 ;
			if ( parts.length ==4 ) {
				rdan = PluginUtil.toInt(parts[3].trim());
			} else {
				rdan = dans.length;
			}
			
			if (rdan <= 0 || rdan > dans.length) {
				throw new CodeFormatException(-1, "北京单场 无效的模糊定胆", code);
			}

			List<String> danlist = null;
			List<String> tuolist = null;
			String tmp_code = "";
			for (String guoguan : guoguans) {
				int start = BJUtil.getEnd(guoguan);
				for (int i = rdan; i <= start; i++) {
					danlist = getCombine(dans, i);
					tuolist = getCombine(tuos, start - i);
					for (int d = 0; d < danlist.size(); d++) {
						for (int t = 0; t < tuolist.size(); t++) {
							tmp_code = danlist.get(d);
							if (!PluginUtil.isEmpty(tuolist.get(t))) {
								tmp_code += ("," + tuolist.get(t));
							}
							cplist.add(tmp_code + "|" + guoguan);
						}
					}
				}
			}
		} else {
			throw new CodeFormatException(-1, "北京单场 投注方式不支持", code);
		}

		List<BJCastCode> lst = new ArrayList<BJCastCode>();
		for (int i = 0; i < cplist.size(); i++) {
			String s = cplist.get(i);
			String[] ics = PluginUtil.splitter(s, "|");
			BJCastCode castcode = new BJCastCode();
			castcode.setGameID(gameID);
			castcode.putItemBean(ics[0]);
			castcode.setGuoguan(ics[1]);
			lst.add(castcode);
		}

		return lst;
	}
	
	private static List<String> getCombine(String[] cs, int num) {
		List<String> rList = new ArrayList<String>();
		if (cs.length >= num) {
			List<int[]> list = CombineUtil.combine(cs.length, num);
			for (int i = 0; i < list.size(); i++) {
				int[] tmp = list.get(i);
				String str = "";
				for (int j = 0; j < tmp.length; j++) {
					if (tmp[j] > 0) {
						str += cs[j] + ",";
					}
				}
				str = str.length() > 1 ? str.substring(0, str.length() - 1) : str;
				rList.add(str);
			}
		}
		return rList;
	}
	
	public static String getGuoguan(String guoguan){
		if("1*1".equals(guoguan)){
			return "单关";
		}
		return guoguan;
	}
	
	
	public static void checkItems(String gameID,String[] itemcodes,String scode) throws CodeFormatException {
		HashMap<String, String> its = new HashMap<String, String>();
		for (String s : itemcodes) {
			String key = s;
			key = gameID + "_" + s;
			if (!KEY_MAP.containsKey(key)) {
				throw new CodeFormatException(1, "投注项不符合要求(1) key=" + key, scode);
			} else {
				its.put(s.trim(), s.trim());
			}
		}
		if (its.size() != itemcodes.length) {
			its.clear();
			its = null ;
			throw new CodeFormatException(2, "存在重复投注项(2)", scode);
		}
		its.clear();
		its = null ;
	}

	public static void checkPassType(String gameID,String[] gg) throws CodeFormatException {

		int max = 15;		//85(15) 86(3)  87(6) 88(6) 89(6) 84(15)
		if ( gameID.equalsIgnoreCase(SPF) || gameID.equalsIgnoreCase(SFGG)) {
			max = 15;
		} else if ( gameID.equalsIgnoreCase(CBF)) {
			max = 3;
		} else {
			max = 6;
		}

		for (String s : gg) {
			if(gameID.equalsIgnoreCase(SFGG) && !s.endsWith("*1")){
				throw new CodeFormatException(16, "过关方式不符合要求(16)，胜负过关只能是xx*1", s);
			}
			int type = BJUtil.getEnd(s);
			if (type == -1) {
				throw new CodeFormatException(3, "过关方式不符合要求(3)", "");
			}
			if (type > max) {
				throw new CodeFormatException(4, "相关玩法不支持过关方式(4)", "");
			}
		}
	}
}
