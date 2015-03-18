package com.caipiao.mob.util;

import java.util.HashMap;

import com.caipiao.mob.trade.bdyh.BjdcBqcOptimize;
import com.caipiao.mob.trade.bdyh.BjdcCbfOptimize;
import com.caipiao.mob.trade.bdyh.BjdcJqsOptimize;
import com.caipiao.mob.trade.bdyh.BjdcSpfOptimize;
import com.caipiao.mob.trade.bdyh.BjdcSxpOptimize;
import com.caipiao.mob.trade.jjyh.JczqBqcOptimize;
import com.caipiao.mob.trade.jjyh.JczqCbfOptimize;
import com.caipiao.mob.trade.jjyh.JczqJqsOptimize;
import com.caipiao.mob.trade.jjyh.JczqRspfOptimize;
import com.caipiao.mob.trade.jjyh.JczqSpfOptimize;
import com.caipiao.mob.trade.jjyh.JczqhhOptimize;

public class OptimizeUtil {

	private final static HashMap<String,Optimize> maps = new HashMap<String,Optimize>();
	static {
		maps.put("70", new JczqhhOptimize());
		maps.put("90", new JczqSpfOptimize());
		maps.put("91", new JczqCbfOptimize());
		maps.put("92", new JczqBqcOptimize());
		maps.put("93", new JczqJqsOptimize());
		maps.put("72", new JczqRspfOptimize());
		
		maps.put("85", new BjdcSpfOptimize());
		maps.put("86", new BjdcCbfOptimize());
		maps.put("87", new BjdcBqcOptimize());
		maps.put("88", new BjdcJqsOptimize());
		maps.put("89", new BjdcSxpOptimize());
	}
	
	
	public final static Optimize fetchOptimizor(String key) {
		return maps.get(key);
	}
}
