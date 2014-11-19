package com.caipiao.cpweb.login;

import java.util.HashMap;
import com.alipay.config.AlipayConfig;


public class AlipayLoginConfig {
	private static AlipayLoginConfig config = null;
	HashMap<String, AlipayConfig> qqs = new HashMap<String, AlipayConfig>();
	
	public AlipayConfig getConfig(String host){
		return qqs.get(host);
	}
	private AlipayLoginConfig(){
		qqs.put("www.159cai.com", new AlipayConfig("2088111984427922", "rg12m54r8sco2dyte290b4vgax6ffjyn", "http://www.159cai.com/phpu/alipay.phpx"));
	}
	
	public static AlipayLoginConfig getInstance(){
		if(config == null){
			config = new AlipayLoginConfig();
		}
		return config;
	}
}
