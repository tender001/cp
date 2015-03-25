package com.caipiao.split;

import java.util.HashMap;

import com.util.split.SplitUtil;
import com.util.string.StringUtil;

public class CodeUtil {
	private static HashMap<String, String> plays = new HashMap<String, String>();
	private static HashMap<String, String> cms = new HashMap<String, String>();
	
	static{
		cms.put("01", "[单式]");
		cms.put("02", "[复式]");
		cms.put("03", "[包号]");
		cms.put("04", "[和值]");
		cms.put("05", "[胆拖]");
		
		//03
		plays.put("03-01", "直选");
		plays.put("03-02", "组三");
		plays.put("03-03", "组六");
		//04
		plays.put("04-01", "五星");
		plays.put("04-03", "三星");
		plays.put("04-04", "两星");
		plays.put("04-05", "一星");
		plays.put("04-06", "大小单双");
		plays.put("04-07", "二星组选");
		plays.put("04-08", "三星组三");
		plays.put("04-09", "三星组六");
		plays.put("04-12", "五星通选");
		plays.put("04-13", "五星复选");
		plays.put("04-15", "三星复选");
		plays.put("04-16", "两星复选");
		//05
		plays.put("05-01","和值");
		plays.put("05-02","三同号通选");
		plays.put("05-03","三同号单选");
		plays.put("05-04","三不同号");
		plays.put("05-05","三连号通选");
		plays.put("05-06","二同号复选");
		plays.put("05-07","二同号单选");
		plays.put("05-08","二不同号");
		//06
		plays.put("06-01","和值");
		plays.put("06-02","三同号通选");
		plays.put("06-03","三同号单选");
		plays.put("06-04","三不同号");
		plays.put("06-05","三连号通选");
		plays.put("06-06","二同号复选");
		plays.put("06-07","二同号单选");
		plays.put("06-08","二不同号");
		
		//20
		plays.put("20-01", "一星");
		plays.put("20-02", "两星");
		plays.put("20-03", "三星");
		plays.put("20-04", "四星");
		plays.put("20-05", "五星");
		plays.put("20-06", "二星组合");
		plays.put("20-07", "三星组合");
		plays.put("20-08", "四星组合");
		plays.put("20-09", "五星组合");
		plays.put("20-10", "二星组选");
		plays.put("20-11", "大小单双");
		plays.put("20-12", "五星通选");
		plays.put("20-13", "任选一");
		plays.put("20-14", "任选二");
		plays.put("20-15", "三星组选3");
		plays.put("20-16", "三星组选6");
		//50
		plays.put("50-02", "追加");
		plays.put("50-03", "生肖乐");
		//53
		plays.put("53-01", "直选");
		plays.put("53-02", "组三");
		plays.put("53-03", "组六");
		//54
		plays.put("54-01", "任选一");
		plays.put("54-02", "任选二");
		plays.put("54-03", "任选三");
		plays.put("54-04", "任选四");
		plays.put("54-05", "任选五");
		plays.put("54-06", "任选六");
		plays.put("54-07", "任选七");
		plays.put("54-08", "任选八");
		plays.put("54-09", "前二直选");
		plays.put("54-10", "前三直选");
		plays.put("54-11", "前二组选");
		plays.put("54-12", "前三组选");
		//55
		plays.put("55-01", "任选一");
		plays.put("55-02", "任选二");
		plays.put("55-03", "任选三");
		plays.put("55-04", "任选四");
		plays.put("55-05", "任选五");
		plays.put("55-06", "任选六");
		plays.put("55-07", "任选七");
		plays.put("55-08", "任选八");
		plays.put("55-09", "前二直选");
		plays.put("55-10", "前三直选");
		plays.put("55-11", "前二组选");
		plays.put("55-12", "前三组选");
		//56
		plays.put("56-01", "任选一");
		plays.put("56-02", "任选二");
		plays.put("56-03", "任选三");
		plays.put("56-04", "任选四");
		plays.put("56-05", "任选五");
		plays.put("56-06", "任选六");
		plays.put("56-07", "任选七");
		plays.put("56-08", "任选八");
		plays.put("56-09", "前二直选");
		plays.put("56-10", "前三直选");
		plays.put("56-11", "前二组选");
		plays.put("56-12", "前三组选");
	}
	
	public static String getCode(String gid, String code){
		String [] codes = SplitUtil.split(code, ";");
		StringBuffer sb = new StringBuffer();
		int len = codes.length;
		for(int i = 0; i < len; i++){
			String tmp = codes[i];
			if(StringUtil.isNotEmpty(tmp)){
				String [] cs = SplitUtil.split(tmp, ":");
				if(cs.length >= 3){
					Code cd = new Code();
					String ckey = StringUtil.getLeftPadding(cs[2].trim(), "0", 2);
					cd.setCastMethodName(cms.get(ckey));
					String pkey = gid + "-" + StringUtil.getLeftPadding(cs[1].trim(), "0", 2);
					cd.setPlayTypeName(plays.get(pkey));
					
					if("5".equals(cs[2].trim())){
						cd.setDrag(true);
						String [] ps = SplitUtil.split(cs[0].trim(), "|");
						if(ps.length > 1){
							String[] aps = SplitUtil.split(ps[0], "$");
							String[] zps = SplitUtil.split(ps[1], "$");
							if(aps.length > 1){
								cd.setRedTuoCode(aps[1]);
							}
							cd.setRedDanCode(aps[0]); 
							if(zps.length > 1){
								cd.setBlueTuoCode(zps[1]);
							}
							cd.setBlueDanCode(zps[0]);
						} else {
							cd.setRedDanCode(ps[0]);
						}
					} else {
						if("50".equals(gid) || "01".equals(gid)){
							String [] ps = SplitUtil.split(cs[0].trim(), "|");
							if(ps.length > 1){
								cd.setBlueDanCode(ps[1]);
							}
							cd.setRedDanCode(ps[0]);
						} else {
							cd.setRedDanCode(cs[0]);
						}
					}
					sb.append(cd.toHTMLString());
				} else {
					sb.append(tmp);
				}
				if(i != len -1){
					sb.append("<br/>");
				}
			}
		}
		return sb.toString();
	}
	
	public static void main(String[] args) {
		String gid = "01";
		String code = "06,14,23,24,26,32|08:1:1;03,06,08,22,27,33|15:1:1;06,09,10,15,17,31|04:1:1;05,14,16,19,29,31|05:1:1;02,08,14,18,28,33|13:1:1";
		System.out.println(CodeUtil.getCode(gid, code));
	}
}
