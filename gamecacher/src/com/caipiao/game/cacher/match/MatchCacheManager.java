package com.caipiao.game.cacher.match;

import java.util.HashMap;

import com.caipiao.game.cacher.util.GameContains;
import com.mina.rbc.util.CheckUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class MatchCacheManager {

	private HashMap<String,JXmlWapper> mapsCache = new HashMap<String,JXmlWapper>();
	private static MatchCacheManager mcm = null ;
	
	private MatchCacheManager() {
	}
	
	public synchronized static MatchCacheManager getMatchCacheManager() {
		if ( mcm == null ) {
			mcm = new MatchCacheManager();
		}
		return mcm;
	}
	
	public void putCache(String key,JXmlWapper value) {
		mapsCache.put(key, value);
	}
	
	public JXmlWapper getCache(String key) {
		if(GameContains.isBasket(key)){
			key = "lq";
		} else if(GameContains.isFootball(key)){
			key = "jc";
		} else if(key.equals("98")){
			key = "gj";
		} else if(key.equals("99")){
			key = "gyj";
		}
		return mapsCache.get(key);
	}
	
	public void removeCache(String key) {
		mapsCache.remove(key);
	}
	
	public void clearCache() {
		mapsCache.clear();
	}
	
	public JXmlWapper getMatchXml(String gid, String pid) {
		String key = "";
		if (GameContains.isBeiDan(gid)) {
			key = pid + "_" + gid;
		} else {
			key = gid ;
		}
		
		return getCache(key);
	}
	
	public String getMatchMinEndTime(String gid, String pid, String matches) {
		JXmlWapper obj = getMatchXml(gid, pid);
		System.out.println(obj.toXmlString());
		System.out.println(matches);
		if (obj != null ) {
			String[] ms = StringUtil.splitter(matches, ",");
			HashMap<String, String> maps = new HashMap<String, String>();

			String ret = "";
			int count = obj.countXmlNodes("row");
			for (int i = 0; i < count; i++) {
				String mid = "";
				mid = obj.getStringValue("row[" + i + "].@itemid","");
				if ( CheckUtil.isNullString(mid)) {
					mid = obj.getStringValue("row[" + i + "].@cindex","");
					if ( CheckUtil.isNullString(mid)) {
						mid = obj.getStringValue("row[" + i + "].@mid","");
					}
				}
				
				String et = obj.getStringValue("row[" + i + "].@et","");
				if ( CheckUtil.isNullString(et) ) {
					 et = obj.getStringValue("row[" + i + "].@endtime","");
				}
				
				if ( !CheckUtil.isNullString(mid)) {
					maps.put(mid, mid);
					if (matches.indexOf("," + mid + ",") >= 0) {
						if (ret.length() == 0) {
							ret = et;
						} else {
							if (ret.compareToIgnoreCase(et) >= 0) {
								ret = et;
							}
						}
					}
				}
			}
			for (int j = 0; j < ms.length; j++) {
				if (!CheckUtil.isNullString(ms[j])) {
					if (!maps.containsKey(ms[j]))
						ret = "";
				}
			}
			maps.clear();
			maps = null;
			return ret;
		} else {
			return "";
		}
	}

	public String getMatchMaxEndTime(String gid, String pid) {
		JXmlWapper obj = getMatchXml(gid, pid);
		if (obj != null ) {
			String ret = "";
			int count = obj.countXmlNodes("row");
			for (int i = 0; i < count; i++) {
				String et = obj.getStringValue("row[" + i + "].@et");
				if ( CheckUtil.isNullString(et) ) {
					 et = obj.getStringValue("row[" + i + "].@endtime");
				}
				if (ret.length() == 0) {
					ret = et;
				} else {
					if (ret.compareToIgnoreCase(et) <= 0) {
						ret = et;
					}
				}
			}
			return ret;
		} else {
			return "";
		}
	}
	
	public String getMatchMax(String gid, String pid,String matches) {
		JXmlWapper obj = getMatchXml(gid, pid);
		if (obj != null ) {
			String ret = "";
			String temptime = "";
			int count = obj.countXmlNodes("row");
			for (int i = 0; i < count; i++) {
				String mid = obj.getStringValue("row[" + i + "].@itemid","");
				if(!matches.contains(","+mid+",")) continue;
				String et = obj.getStringValue("row[" + i + "].@et");
				if ( CheckUtil.isNullString(et) ) {
					 et = obj.getStringValue("row[" + i + "].@endtime");
				}
				if (ret.length() == 0) {
					ret = mid;
					temptime = et;
				} else {
					if (temptime.compareToIgnoreCase(et) < 0) {
						ret = mid;
						temptime = et;
					}else if(temptime.compareToIgnoreCase(et) == 0){
						if(ret.compareToIgnoreCase(mid) < 0){
							ret = mid;
						}else{
							ret = mid;
						}
					}
				}
			}
			return ret;
		} else {
			return "";
		}
	}
}
