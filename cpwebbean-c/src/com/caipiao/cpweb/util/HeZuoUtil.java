package com.caipiao.cpweb.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.List;

import com.mina.rbc.util.xml.JXmlWapper;

public class HeZuoUtil {
	private static HashMap<String, String> maps = new HashMap<String, String>();
	private static HashMap<String, SiteBean> siteMaps = new HashMap<String, SiteBean>();

	
	
	public static void put(String key, String value) {
		maps.put(key, value);
	}

	public static String get(String key) {
		if ( maps.isEmpty() ) {
			load();
		}
		
		return maps.get(key);
	}

	public static void putSite(String key, SiteBean value) {
		siteMaps.put(key, value);
	}

	public static SiteBean getSite(String key) {
		if ( siteMaps.isEmpty() ) {
			load();
		}
		return siteMaps.get(key);
	}
	
	private final static void load() {
		String site = System.getProperty("conf.dir") + File.separator + "site.xml";
		File sfile = new File(site);
		if (!sfile.exists()) {
			try {
				throw new FileNotFoundException("未找到合作网站配置文件");
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				return;
			}
		}
		JXmlWapper sXml = JXmlWapper.parse(sfile);
		List<JXmlWapper> slist = sXml.getXmlNodeList("sites.site");
		try {
			for (JXmlWapper sxml : slist) {
				SiteBean sb = new SiteBean();
				sb.setHost(sxml.getStringValue("@host"));
				sb.setRegfrom(sxml.getStringValue("@regfrom"));
				sb.setName(sxml.getStringValue("@name"));
				HeZuoUtil.putSite(sb.getHost(), sb);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
