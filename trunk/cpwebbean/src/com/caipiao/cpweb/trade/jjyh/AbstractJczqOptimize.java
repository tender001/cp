package com.caipiao.cpweb.trade.jjyh;

import java.io.File;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.game.cacher.match.MatchCacheManager;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public abstract class AbstractJczqOptimize implements JinCaiOptimize {

	protected final static HashMap<String,Integer> MAPS = new HashMap<String,Integer>();
	static {
		MAPS.put("SPF_3", 0);
		MAPS.put("SPF_1", 1);
		MAPS.put("SPF_0", 2);
		
		MAPS.put("CBF_1:0", 0);
		MAPS.put("CBF_2:0", 1);
		MAPS.put("CBF_2:1", 2);
		MAPS.put("CBF_3:0", 3);
		MAPS.put("CBF_3:1", 4);
		MAPS.put("CBF_3:2", 5);
		MAPS.put("CBF_4:0", 6);
		MAPS.put("CBF_4:1", 7);
		MAPS.put("CBF_4:2", 8);
		MAPS.put("CBF_5:0", 9);
		MAPS.put("CBF_5:1", 10);
		MAPS.put("CBF_5:2", 11);
		MAPS.put("CBF_9:0", 12);

		MAPS.put("CBF_0:0", 13);
		MAPS.put("CBF_1:1", 14);
		MAPS.put("CBF_2:2", 15);
		MAPS.put("CBF_3:3", 16);
		MAPS.put("CBF_9:9", 17);

		MAPS.put("CBF_0:1", 18);
		MAPS.put("CBF_0:2", 19);
		MAPS.put("CBF_1:2", 20);
		MAPS.put("CBF_0:3", 21);
		MAPS.put("CBF_1:3", 22);
		MAPS.put("CBF_2:3", 23);
		MAPS.put("CBF_0:4", 24);
		MAPS.put("CBF_1:4", 25);
		MAPS.put("CBF_2:4", 26);
		MAPS.put("CBF_0:5", 27);
		MAPS.put("CBF_1:5", 28);
		MAPS.put("CBF_2:5", 29);
		MAPS.put("CBF_0:9", 30);
		
//		3-3, 3-1, 3-0, 1-3, 1-1, 1-0, 0-3, 0-1, 0-0
		MAPS.put("BQC_3-3", 0);
		MAPS.put("BQC_3-1", 1);
		MAPS.put("BQC_3-0", 2);
		MAPS.put("BQC_1-3", 3);
		MAPS.put("BQC_1-1", 4);
		MAPS.put("BQC_1-0", 5);
		MAPS.put("BQC_0-3", 6);
		MAPS.put("BQC_0-1", 7);
		MAPS.put("BQC_0-0", 8);


		MAPS.put("JQS_0", 0);
		MAPS.put("JQS_1", 1);
		MAPS.put("JQS_2", 2);
		MAPS.put("JQS_3", 3);
		MAPS.put("JQS_4", 4);
		MAPS.put("JQS_5", 5);
		MAPS.put("JQS_6", 6);
		MAPS.put("JQS_7", 7);
		
		MAPS.put("RSPF_3", 0);
		MAPS.put("RSPF_1", 1);
		MAPS.put("RSPF_0", 2);
	}
	
	static class MatchBean {
		public String itemid;
		public String mid ;
		public String hn ;
		public String gn ;
		public String et;
		public String mt ;
		public String mname;
		public String cl;
		public String close;
		public String name;
		public String bet3;
		public String bet1;
		public String bet0;
		public String spf;
		public String cbf;
		public String bqc;
		public String jqs;
		public String rspf;
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
	
	
	static HashMap<String,MatchBean> loadMatchBeanCach() {
		HashMap<String, MatchBean> maps = new HashMap<String, MatchBean>();
		MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
		JXmlWapper xml = mcm.getCache("jc");
		
		if ( xml != null ) {
			int count = xml.countXmlNodes("row");
			if ( count > 0 ) {
				for (int i=0;i<count;i++) {
					MatchBean bean = new MatchBean();
					bean.bet0   = xml.getStringValue("row[" + i + "].@bet0");
					bean.bet1   = xml.getStringValue("row[" + i + "].@bet1");
					bean.bet3   = xml.getStringValue("row[" + i + "].@bet3");
					bean.cl     = xml.getStringValue("row[" + i + "].@cl");
					bean.close  = xml.getStringValue("row[" + i + "].@close");
					bean.et     = xml.getStringValue("row[" + i + "].@et");
					bean.gn     = xml.getStringValue("row[" + i + "].@gn");
					bean.hn     = xml.getStringValue("row[" + i + "].@hn");
					bean.itemid = xml.getStringValue("row[" + i + "].@itemid");
					bean.mid    = xml.getStringValue("row[" + i + "].@mid");
					bean.mname  = xml.getStringValue("row[" + i + "].@mname");
					bean.mt     = xml.getStringValue("row[" + i + "].@mt");
					bean.name   = xml.getStringValue("row[" + i + "].@name");
					bean.spf    = xml.getStringValue("row[" + i + "].@spf");
					bean.cbf    = xml.getStringValue("row[" + i + "].@cbf");
					bean.bqc    = xml.getStringValue("row[" + i + "].@bqc");
					bean.jqs    = xml.getStringValue("row[" + i + "].@jqs");
					bean.rspf   = xml.getStringValue("row[" + i + "].@rspf");
					maps.put(bean.itemid, bean);
				}
			}
		}
		
		if ( maps.isEmpty() ) {
			maps = loadMatchBeanFile();
		}
		return maps;
	}
	
	static HashMap<String,MatchBean> loadMatchBeanFile() {
		HashMap<String, MatchBean> maps = new HashMap<String, MatchBean>();
		JXmlWapper xml = JXmlWapper.parse(new File("d:\\temp\\jczq_hh.xml"));
		int count = xml.countXmlNodes("row");
		for (int i=0;i<count;i++) {
			MatchBean bean = new MatchBean();
			bean.bet0   = xml.getStringValue("row[" + i + "].@bet0");
			bean.bet1   = xml.getStringValue("row[" + i + "].@bet1");
			bean.bet3   = xml.getStringValue("row[" + i + "].@bet3");
			bean.cl     = xml.getStringValue("row[" + i + "].@cl");
			bean.close  = xml.getStringValue("row[" + i + "].@close");
			bean.et     = xml.getStringValue("row[" + i + "].@et");
			bean.gn     = xml.getStringValue("row[" + i + "].@gn");
			bean.hn     = xml.getStringValue("row[" + i + "].@hn");
			bean.itemid = xml.getStringValue("row[" + i + "].@itemid");
			bean.mid    = xml.getStringValue("row[" + i + "].@mid");
			bean.mname  = xml.getStringValue("row[" + i + "].@mname");
			bean.mt     = xml.getStringValue("row[" + i + "].@mt");
			bean.name   = xml.getStringValue("row[" + i + "].@name");
			bean.spf    = xml.getStringValue("row[" + i + "].@spf");
			bean.cbf    = xml.getStringValue("row[" + i + "].@cbf");
			bean.bqc    = xml.getStringValue("row[" + i + "].@bqc");
			bean.jqs    = xml.getStringValue("row[" + i + "].@jqs");
			bean.rspf   = xml.getStringValue("row[" + i + "].@rspf");
			maps.put(bean.itemid, bean);
		}
		return maps;
	}
	
	static HashMap<String,MatchBean> loadMatchBeanUrl() {
		try {
		HashMap<String, MatchBean> maps = new HashMap<String, MatchBean>();

		JXmlWapper xml = JXmlWapper.parseUrl("http://www.159cai.com/tdata/jczq/jczq_hh.xml");
		int count = xml.countXmlNodes("row");
		for (int i=0;i<count;i++) {
			MatchBean bean = new MatchBean();
			bean.bet0   = xml.getStringValue("row[" + i + "].@bet0");
			bean.bet1   = xml.getStringValue("row[" + i + "].@bet1");
			bean.bet3   = xml.getStringValue("row[" + i + "].@bet3");
			bean.cl     = xml.getStringValue("row[" + i + "].@cl");
			bean.close  = xml.getStringValue("row[" + i + "].@close");
			bean.et     = xml.getStringValue("row[" + i + "].@et");
			bean.gn     = xml.getStringValue("row[" + i + "].@gn");
			bean.hn     = xml.getStringValue("row[" + i + "].@hn");
			bean.itemid = xml.getStringValue("row[" + i + "].@itemid");
			bean.mid    = xml.getStringValue("row[" + i + "].@mid");
			bean.mname  = xml.getStringValue("row[" + i + "].@mname");
			bean.mt     = xml.getStringValue("row[" + i + "].@mt");
			bean.name   = xml.getStringValue("row[" + i + "].@name");
			bean.spf    = xml.getStringValue("row[" + i + "].@spf");
			bean.cbf    = xml.getStringValue("row[" + i + "].@cbf");
			bean.bqc    = xml.getStringValue("row[" + i + "].@bqc");
			bean.jqs    = xml.getStringValue("row[" + i + "].@jqs");
			bean.rspf   = xml.getStringValue("row[" + i + "].@rspf");
			maps.put(bean.itemid, bean);
		}
		return maps;
		} catch (Exception e) {
			return null;
		}
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
		String[] ss = StringUtil.splitter(sps, ",");
		sp = ss[pos];
		return sp;
	}
	
	
	public abstract String optimize(String codes, int tmuli, int gg, int ytype,String idxs) ;
	
//	public abstract String optimize(String codes, int tmuli, int gg, int ytype) ;

}
