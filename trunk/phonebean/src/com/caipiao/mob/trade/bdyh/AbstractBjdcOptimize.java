package com.caipiao.mob.trade.bdyh;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.caipiao.game.cacher.match.MatchCacheManager;
import com.caipiao.mob.util.Optimize;
import com.mina.rbc.util.CheckUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public abstract class AbstractBjdcOptimize implements Optimize {

	protected final static HashMap<String,Integer> MAPS = new HashMap<String,Integer>();
	static {
		
		//sp0:0.0;sp1:0.0;sp3:4.272581;
		MAPS.put("SPF_0", 0);
		MAPS.put("SPF_1", 1);
		MAPS.put("SPF_3", 2);
		
		
		MAPS.put("CBF_9:0", 0);
		MAPS.put("CBF_1:0", 1);
		MAPS.put("CBF_2:0", 2);
		MAPS.put("CBF_2:1", 3);
		MAPS.put("CBF_3:0", 4);
		MAPS.put("CBF_3:1", 5);
		MAPS.put("CBF_3:2", 6);
		MAPS.put("CBF_4:0", 7);
		MAPS.put("CBF_4:1", 8);
		MAPS.put("CBF_4:2", 9);
		MAPS.put("CBF_9:9", 10);
		MAPS.put("CBF_0:0", 11);
		
		MAPS.put("CBF_5:0", 10);
		MAPS.put("CBF_5:1", 10);
		MAPS.put("CBF_5:2", 11);
		MAPS.put("CBF_1:1", 12);
		MAPS.put("CBF_2:2", 13);
		MAPS.put("CBF_3:3", 14);
		MAPS.put("CBF_0:9", 15);
		
		MAPS.put("CBF_0:1", 16);
		MAPS.put("CBF_0:2", 17);
		MAPS.put("CBF_1:2", 18);
		MAPS.put("CBF_0:3", 19);
		MAPS.put("CBF_1:3", 20);
		MAPS.put("CBF_2:3", 21);
		MAPS.put("CBF_0:4", 22);
		MAPS.put("CBF_1:4", 23);
		MAPS.put("CBF_2:4", 24);
		

		
//		33:0.0;31:0.0;30:0.0;13:0.0;11:5.949873;10:0.0;03:0.0;01:0.0;00:0.0;
		MAPS.put("BQC_3-3", 0);
		MAPS.put("BQC_3-1", 1);
		MAPS.put("BQC_3-0", 2);
		MAPS.put("BQC_1-3", 3);
		MAPS.put("BQC_1-1", 4);
		MAPS.put("BQC_1-0", 5);
		MAPS.put("BQC_0-3", 6);
		MAPS.put("BQC_0-1", 7);
		MAPS.put("BQC_0-0", 8);

//jqs0:0.0;jqs1:0.0;jqs2:0.0;jqs3:4.057815;jqs4:0.0;jqs5:0.0;jqs6:0.0;jqs7:0.0;
		MAPS.put("JQS_0", 0);
		MAPS.put("JQS_1", 1);
		MAPS.put("JQS_2", 2);
		MAPS.put("JQS_3", 3);
		MAPS.put("JQS_4", 4);
		MAPS.put("JQS_5", 5);
		MAPS.put("JQS_6", 6);
		MAPS.put("JQS_7", 7);

		
		//sxp0:0.0;sxp1:0.0;sxp2:0.0;sxp3:3.02431;
		MAPS.put("SXP_0", 0);
		MAPS.put("SXP_1", 1);
		MAPS.put("SXP_2", 2);
		MAPS.put("SXP_3", 3);
	}
	
	static class MatchBean {
		public String expect;
		public int mid;
		public String mname;
		public String hn;
		public String gn;
		public String bt;
		public String et;
		public String fet;
		public int close;	
		public String b3;
		public String b1;
		public String b0;
		public String spv;
		public String cl;
		public String selected;
	}
	
	public static double formatDouble(double d) {
		NumberFormat format = new DecimalFormat("#.##");
		return Double.parseDouble(format.format(d));
	}
	
	static class SortByMulity implements Comparator<String> {
		public int compare(String s1, String s2) {
			String[] ss1 = StringUtil.splitter(s1, "|");
			String[] ss2 = StringUtil.splitter(s2, "|");
			if (Integer.parseInt(ss1[2]) > Integer.parseInt(ss2[2]))
				return -1;
			return 1;
		}
	}
	static class SortByBonus implements Comparator<String> {
		public int compare(String s1, String s2) {
			String[] ss1 = StringUtil.splitter(s1, "|");
			String[] ss2 = StringUtil.splitter(s2, "|");
			if (Double.parseDouble(ss1[1]) > Double.parseDouble(ss2[1]))
				return 1;
			return -1;
		}
	}
	static class SortByTotalBonus implements Comparator<String> {
		public int compare(String s1, String s2) {
			String[] ss1 = StringUtil.splitter(s1, "|");
			String[] ss2 = StringUtil.splitter(s2, "|");
			if (Double.parseDouble(ss1[3]) > Double.parseDouble(ss2[3]))
				return 1;
			return -1;
		}
	}
	
	static void P(List<String[]> list, String[] arr, String str,List<String> lstOut) {
		for (int i = 0; i < list.size(); i++) {
			if (i == list.indexOf(arr)) {
				for (String st : arr) {
					st = str + st + ",";
					if (i < list.size() - 1) {
						P(list, list.get(i + 1), st,lstOut);
					} else if (i == list.size() - 1) {// 排列数据
						if ( st.length() > 1) {
							st = st.substring(0,st.length()-1);
						}
						lstOut.add(st);
					} else {
						continue;
					}
				}
			}
		}
	}
	
	
	static HashMap<Integer,MatchBean> loadMatchBeanCach(String gid,String pid) {
		HashMap<Integer, MatchBean> maps = new HashMap<Integer, MatchBean>();
		MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
		JXmlWapper xml = mcm.getMatchXml(gid, pid);
		int value = Integer.parseInt(gid) - 85;
		if ( xml != null ) {
			int count = xml.countXmlNodes("row");
			if ( count > 0 ) {
				for (int i=0;i<count;i++) {
					MatchBean bean = new MatchBean();
					bean.mid    = xml.getIntValue("row[" + i + "].@mid");
					bean.hn     = xml.getStringValue("row[" + i + "].@hn");
					bean.gn     = xml.getStringValue("row[" + i + "].@gn");
					bean.et     = xml.getStringValue("row[" + i + "].@et");
					
					bean.b0   = xml.getStringValue("row[" + i + "].@b0");
					bean.b1   = xml.getStringValue("row[" + i + "].@b1");
					bean.b3   = xml.getStringValue("row[" + i + "].@b3");
					bean.close  = xml.getIntValue("row[" + i + "].@close", 0);
					bean.mname  = xml.getStringValue("row[" + i + "].@mname");
					bean.bt     = xml.getStringValue("row[" + i + "].@bt");
					bean.cl= xml.getStringValue("row[" + i + "].@cl");
					bean.expect = pid;
					switch (value) {
					case 0:
						bean.spv    = xml.getStringValue("row[" + i + "].@spf");
						break;
					case 1:
						bean.spv    = xml.getStringValue("row[" + i + "].@cbf");
						break;
					case 2:
						bean.spv    = xml.getStringValue("row[" + i + "].@bqc");
						break;
					case 3:
						bean.spv   = xml.getStringValue("row[" + i + "].@sxp");
						break;
					case 4:
						bean.spv    = xml.getStringValue("row[" + i + "].@jqs");
						break;
					default:
						break;
					}
					
					maps.put(bean.mid, bean);
				}
			}
		}
		if ( maps.isEmpty() ) {
			maps = loadMatchBeanUrl(gid,pid);
		}
		
		return maps;
	}
	
	
	static HashMap<Integer,MatchBean> loadMatchBeanUrl(String gid,String pid) {
		HashMap<Integer, MatchBean> maps = new HashMap<Integer, MatchBean>();
		MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
		JXmlWapper xml = null;
		int value = Integer.parseInt(gid) - 85;
		try {
			//http://test.159cai.com/cpdata/match/beid/140812/spf.xml
			if(value==0){
				xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/spf.xml");
			}else if(value==1){
				xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/cbf.xml");
			}else if(value==2){
				xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/bqc.xml");
			}else if(value==3){
				xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/jqs.xml");
			}else if(value==4){
				xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/sxp.xml");
			}
//			xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/spf.xml");
//			xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/cbf.xml");
//			xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/bqc.xml");
//			xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/jqs.xml");
//			xml = JXmlWapper.parseUrl("http://www.159cai.com/cpdata/match/beid/"+pid+"/sxp.xml");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if ( xml != null ) {
			int count = xml.countXmlNodes("row");
			if ( count > 0 ) {
				for (int i=0;i<count;i++) {
					MatchBean bean = new MatchBean();
					bean.mid    = xml.getIntValue("row[" + i + "].@mid");
					bean.hn     = xml.getStringValue("row[" + i + "].@hn");
					bean.gn     = xml.getStringValue("row[" + i + "].@gn");
					bean.et     = xml.getStringValue("row[" + i + "].@et");
					
					bean.b0   = xml.getStringValue("row[" + i + "].@b0");
					bean.b1   = xml.getStringValue("row[" + i + "].@b1");
					bean.b3   = xml.getStringValue("row[" + i + "].@b3");
					bean.close  = xml.getIntValue("row[" + i + "].@close", 0);
					bean.mname  = xml.getStringValue("row[" + i + "].@mname");
					bean.bt     = xml.getStringValue("row[" + i + "].@bt");
					bean.cl= xml.getStringValue("row[" + i + "].@cl");
					bean.expect = pid;
					switch (value) {
					case 0:
						bean.spv    = xml.getStringValue("row[" + i + "].@spf");
						break;
					case 1:
						bean.spv    = xml.getStringValue("row[" + i + "].@cbf");
						break;
					case 2:
						bean.spv    = xml.getStringValue("row[" + i + "].@bqc");
						break;
					case 3:
						bean.spv   = xml.getStringValue("row[" + i + "].@sxp");
						break;
					case 4:
						bean.spv    = xml.getStringValue("row[" + i + "].@jqs");
						break;
					default:
						break;
					}
					
					maps.put(bean.mid, bean);
				}
			}
		}
		
		return maps;
	}
	
	protected static List<String> findDataByRegexArray(String content,String regex) {
		Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(content);
		List<String> lst = new ArrayList<String>();
		while (matcher.find()) {
			int g = matcher.groupCount();
			for (int i = 1; i <= g; i++) {
				if ( !CheckUtil.isNullString(matcher.group(i))){
					lst.add(matcher.group(i));
				}
			}
		}
		return lst;
	}
	
	protected String getSpValue(String sps,String play, String sopt) {
		String sp = "";
		String key = play.toUpperCase() + "_" + sopt;
		int pos = MAPS.get(key);
		String[] ss = StringUtil.splitter(sps, ";");
		sp = StringUtil.splitter(ss[pos+2],":")[1];
		return sp;
	}
	
	
	public abstract String optimize(String codes, int tmuli, int gg, int ytype,String idxs,String gid,String pid) ;
	
//	public abstract String optimize(String codes, int tmuli, int gg, int ytype) ;

}
