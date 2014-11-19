package com.caipiao.cpweb.trade;

import java.util.HashMap;
import java.util.Map;

public class ConfigUtil {
	//public static String MatchDir = "D:/workspace/cpweb/newcpweb/WebContent/";  //静态文件目录
	public static String MatchDir = "/opt/export/";  //静态文件目录  [正式环境]	
	
	public static Map<String, String> playename = new HashMap<String,String>();
	static {
		playename.put("01", "ssq");
		playename.put("03", "3d");
		playename.put("04", "cqssc");
		playename.put("07", "qlc");
		playename.put("20", "jxssc");
		playename.put("50", "dlt");
		playename.put("51", "qxc");
		playename.put("52", "p5");
		playename.put("53", "p3");
		playename.put("54", "jx11x5");
		playename.put("55", "gd11x5");
		playename.put("56", "11ydj");
		playename.put("80", "zc");
		playename.put("81", "r9");
		playename.put("82", "jq");
		playename.put("83", "bq");
		playename.put("85", "bd_spf");
		playename.put("86", "bd_cbf");
		playename.put("87", "bd_bqc");
		playename.put("88", "bd_sxp");
		playename.put("89", "bd_jqs");
		playename.put("90", "jczq_spf");
		playename.put("91", "jczq_cbf");
		playename.put("92", "jczq_bqc");
		playename.put("93", "jczq_jqs");
		playename.put("94", "jclq_sf");
		playename.put("95", "jclq_rfsf");
		playename.put("96", "jclq_sfc");
		playename.put("97", "jclq_dxf");
	}
}
