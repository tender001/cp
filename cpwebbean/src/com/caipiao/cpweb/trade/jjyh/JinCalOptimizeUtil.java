package com.caipiao.cpweb.trade.jjyh;

import java.util.HashMap;

public class JinCalOptimizeUtil {

	private final static HashMap<String,JinCaiOptimize> maps = new HashMap<String,JinCaiOptimize>();
	static {
		maps.put("zqhh", new JczqhhOptimize());
		maps.put("spf", new JczqSpfOptimize());
		maps.put("cbf", new JczqCbfOptimize());
		maps.put("bqc", new JczqBqcOptimize());
		maps.put("jqs", new JczqJqsOptimize());
		maps.put("rspf", new JczqRspfOptimize());
	}
	
	
	public final static JinCaiOptimize fetchOptimizor(String key) {
		return maps.get(key);
	}
}
