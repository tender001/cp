package com.caipiao.cpweb.admin.web;

import java.util.HashMap;

import com.mina.rbc.util.CheckUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class JinCaiSpUtil {

	private final static HashMap<String,Integer> MAPS_POS = new HashMap<String,Integer>();
	private final static HashMap<String,String> MAPS_NAME = new HashMap<String,String>();
	
	static {
		MAPS_NAME.put("3", "胜");
		MAPS_NAME.put("1", "平");
		MAPS_NAME.put("0", "负");
		
		MAPS_NAME.put("9:0", "(胜其它)");
		MAPS_NAME.put("9:9", "(平其它)");
		MAPS_NAME.put("0:9", "(负其它)");
		
		MAPS_NAME.put("3-3", "胜胜");
		MAPS_NAME.put("3-1", "胜平");
		MAPS_NAME.put("3-0", "胜负");
		MAPS_NAME.put("1-3", "平胜");
		MAPS_NAME.put("1-1", "平平");
		MAPS_NAME.put("1-0", "平负");
		MAPS_NAME.put("0-3", "负胜");
		MAPS_NAME.put("0-1", "负平");
		MAPS_NAME.put("0-0", "负负");

	}
	static {
		MAPS_POS.put("SPF_3", 0);
		MAPS_POS.put("SPF_1", 1);
		MAPS_POS.put("SPF_0", 2);
		
		MAPS_POS.put("RSPF_3", 0);
		MAPS_POS.put("RSPF_1", 1);
		MAPS_POS.put("RSPF_0", 2);
		
		
		MAPS_POS.put("JQS_0", 0);
		MAPS_POS.put("JQS_1", 1);
		MAPS_POS.put("JQS_2", 2);
		MAPS_POS.put("JQS_3", 3);
		MAPS_POS.put("JQS_4", 4);
		MAPS_POS.put("JQS_5", 5);
		MAPS_POS.put("JQS_6", 6);
		MAPS_POS.put("JQS_7", 7);
		
		
		MAPS_POS.put("BQC_3-3", 0);
		MAPS_POS.put("BQC_3-1", 1);
		MAPS_POS.put("BQC_3-0", 2);
		MAPS_POS.put("BQC_1-3", 3);
		MAPS_POS.put("BQC_1-1", 4);
		MAPS_POS.put("BQC_1-0", 5);
		MAPS_POS.put("BQC_0-3", 6);
		MAPS_POS.put("BQC_0-1", 7);
		MAPS_POS.put("BQC_0-0", 8);
		
		MAPS_POS.put("CBF_1:0", 0);
		MAPS_POS.put("CBF_2:0", 1);
		MAPS_POS.put("CBF_2:1", 2);
		MAPS_POS.put("CBF_3:0", 3);
		MAPS_POS.put("CBF_3:1", 4);
		MAPS_POS.put("CBF_3:2", 5);
		MAPS_POS.put("CBF_4:0", 6);
		MAPS_POS.put("CBF_4:1", 7);
		MAPS_POS.put("CBF_4:2", 8);
		MAPS_POS.put("CBF_5:0", 9);
		MAPS_POS.put("CBF_5:1", 10);
		MAPS_POS.put("CBF_5:2", 11);
		MAPS_POS.put("CBF_9:0", 12);
		MAPS_POS.put("CBF_0:0", 13);
		MAPS_POS.put("CBF_1:1", 14);
		MAPS_POS.put("CBF_2:2", 15);
		MAPS_POS.put("CBF_3:3", 16);
		MAPS_POS.put("CBF_9:9", 17);
		MAPS_POS.put("CBF_0:1", 18);
		MAPS_POS.put("CBF_0:2", 19);
		MAPS_POS.put("CBF_1:2", 20);
		MAPS_POS.put("CBF_0:3", 21);
		MAPS_POS.put("CBF_1:3", 22);
		MAPS_POS.put("CBF_2:3", 23);
		MAPS_POS.put("CBF_0:4", 24);
		MAPS_POS.put("CBF_1:4", 25);
		MAPS_POS.put("CBF_2:4", 26);
		MAPS_POS.put("CBF_0:5", 27);
		MAPS_POS.put("CBF_1:5", 28);
		MAPS_POS.put("CBF_2:5", 29);
		MAPS_POS.put("CBF_0:9", 30);
	}
	
	
	class SpValueBean {
		public String itemID;
		public String[] spf;
		public String[] rspf;
		public String[] cbf;
		public String[] jqs;
		public String[] bqc;
	}
	
	private HashMap<String,SpValueBean> maps = new HashMap<String,SpValueBean>();
	
	
	
	public JinCaiSpUtil() {
	}

	public void loadXml(String url) throws Exception {
		JXmlWapper xml = JXmlWapper.parseUrl(url);
		int count = xml.countXmlNodes("row");
		for (int i=0;i<count;i++) {
			JXmlWapper x = xml.getXmlNode("row[" + i + "]");
			String tid = x.getStringValue("@itemid");
			String bqc = x.getStringValue("@bqc");
			String cbf = x.getStringValue("@cbf");
			String jqs = x.getStringValue("@jqs");
			String spf = x.getStringValue("@spf");
			String rspf = x.getStringValue("@rspf");
			
			SpValueBean sp = new SpValueBean();
			sp.itemID = tid;
			if ( !CheckUtil.isNullString(spf)) {
				sp.spf = StringUtil.splitter(spf, ",");
			}
			if ( !CheckUtil.isNullString(rspf)) {
				sp.rspf = StringUtil.splitter(rspf, ",");
			}
			if ( !CheckUtil.isNullString(cbf)) {
				sp.cbf = StringUtil.splitter(cbf, ",");
			}
			if ( !CheckUtil.isNullString(bqc)) {
				sp.bqc = StringUtil.splitter(bqc, ",");
			}
			if ( !CheckUtil.isNullString(jqs)) {
				sp.jqs = StringUtil.splitter(jqs, ",");
			}
			maps.put(sp.itemID, sp);
		}
	}
	

	public String createSpValue(String code) {
		String sb = "";
		
		String[] ss = StringUtil.splitter(code, "|");
		String tplay = ss[0];
		String splay = tplay;
		String[] items = StringUtil.splitter(ss[1], ",");
		for (int i=0;i<items.length;i++) {
			String[] sss = StringUtil.splitter(items[i], "=");
			String tid = sss[0];
			String opts = sss[1];

			if ( tplay.equalsIgnoreCase("hh")) {
				String[] s1 = StringUtil.splitter(sss[0], ">");
				tid = s1[0];
				splay = s1[1];				
			} 

			String[] ssss = StringUtil.splitter(opts, "/");
			SpValueBean bean = maps.get(tid);
			String tmp = tid + "=" ;
			for (int j=0;j<ssss.length;j++) {
				String name = MAPS_NAME.get(ssss[j]);
				if ( CheckUtil.isNullString(name)) {
					name = "(" + ssss[j] + ")";
				}
				int pos = MAPS_POS.get(splay.toUpperCase() + "_" + ssss[j]);
				String value = "";
				if ( splay.equalsIgnoreCase("SPF")) {
					value = bean.spf[pos];
				}
				if ( splay.equalsIgnoreCase("RSPF")) {
					value = bean.rspf[pos];
				}
				if ( splay.equalsIgnoreCase("BQC")) {
					value = bean.bqc[pos];
				}
				if ( splay.equalsIgnoreCase("CBF")) {
					value = bean.cbf[pos];
				}
				if ( splay.equalsIgnoreCase("JQS")) {
					value = bean.jqs[pos];
				}
				tmp += name + "@" + value + "元+";
			}			
			tmp = tmp.substring(0,tmp.length()-1);
			sb += tmp + ",";
		}
		sb = sb.substring(0,sb.length()-1);
		return sb;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		JinCaiSpUtil sp = new JinCaiSpUtil();
		sp.loadXml("http://www.159cai.com/tdata/jczq/jczq_hh.xml");
		String s = sp.createSpValue("HH|130811004>SPF=0,130811005>SPF=3,130811006>RSPF=3,130811007>SPF=3,130811008>SPF=1|5*1");
		System.out.println(s);

	}

}
