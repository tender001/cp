package com.caipiao.cpweb.trade.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.caipiao.game.cacher.match.MatchCacheManager;
import com.caipiao.plugin.bjutil.CombineUtil;
import com.mina.rbc.util.MathUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class JinCaiYueHua {
	
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
		public String selected;
		
		public double minSp;
		public double maxSp;
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
	
//	static void P(List<String[]> list, String[] arr, String str,List<String> lstOut) {
//		for (int i = 0; i < list.size(); i++) {
//			if (i == list.indexOf(arr)) {
//				for (String st : arr) {
//					String ss = str + st + ",";
//					if (i < list.size() - 1) {
//						P(list, list.get(i + 1), ss,lstOut);
//					} else if (i == list.size() - 1) {// 排列数据
//						if ( st.length() > 1) {
//							st = st.substring(0,st.length()-1);
//						}
////						System.out.println("ss=" + ss);
//						lstOut.add(ss);
//					} 
//
//				}
//			}
//		}
//	}
//
//	
//	static void P1(List<Object[]> list, Object[] arr, List<Object> lst,List<List<Object>> lstOut) {
//		if ( lst == null ) {						
//			lst = new ArrayList<Object>();
//		} 
//
//		for (int i = 0; i < list.size(); i++) {
//			if (i == list.indexOf(arr)) {
//				for (Object st : arr) {
//					if (i < list.size() - 1) {
//						List<Object> lst1 = new ArrayList<Object>();
//						for (int j=0;j<lst.size();j++) {
//							lst1.add(lst.get(j));
//						}
//						lst1.add(st);
//						P1(list, list.get(i + 1), lst1,lstOut);
//					} else if (i == list.size() - 1) {// 排列数据
//						List<Object> lst1 = new ArrayList<Object>();
//						for (int j=0;j<lst.size();j++) {
//							lst1.add(lst.get(j));
//						}
//						lst1.add(st);
//						lstOut.add(lst1);
//					}  else {
//						lst.add(st);
//					}
//				}
//			}
//		}
//	}
	
	
	
	public static double formatDouble(double d) {
		return  Math.round(d * 100)/100.0;
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

	
	private static String[] createItemToArray(MatchBean bean) {
		String[] ss2 = StringUtil.splitter(bean.spf, ",");
		
		double dmin = 1000000;
		double dmax = 0;
		double dtmp = 0;
		
		List<String> lst = new ArrayList<String>();
		if ( bean.selected.indexOf("3") >= 0 ) {
			lst.add(bean.itemid + "=3~" + bean.name + "=胜[" +  ss2[0] + "]");
			dtmp = MathUtil.toDouble(ss2[0]);
			if ( dmax < dtmp) {
				dmax = dtmp;
			}
			if ( dmin > dtmp ) {
				dmin = dtmp;
			}
		}
		if ( bean.selected.indexOf("1") >= 0 ) {
			lst.add(bean.itemid + "=1~" + bean.name + "=平[" +  ss2[1] + "]");
			dtmp = MathUtil.toDouble(ss2[1]);
			if ( dmax < dtmp) {
				dmax = dtmp;
			}
			if ( dmin > dtmp ) {
				dmin = dtmp;
			}

		}
		if ( bean.selected.indexOf("0") >= 0 ) {
			lst.add(bean.itemid + "=0~" + bean.name + "=负[" +  ss2[2] + "]");
			dtmp = MathUtil.toDouble(ss2[2]);
			if ( dmax < dtmp) {
				dmax = dtmp;
			}
			if ( dmin > dtmp ) {
				dmin = dtmp;
			}
		}
		
		bean.maxSp = dmax;
		bean.minSp = dmin;
		
		String[] sp = new String[lst.size()];
		for (int i=0;i<sp.length;i++) {
			sp[i] = lst.get(i);
		}
		lst.clear();
		lst = null ;
		return sp;
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
	
//	private static String[] createItemToArray(String tid,String sopt,String spValue,String name) {
//		String[] ss2 = StringUtil.splitter(spValue, ",");
//		
//		List<String> lst = new ArrayList<String>();
//		if ( sopt.indexOf("3") >= 0 ) {
//			lst.add(tid + "=3~" + name + "=胜[" +  ss2[0] + "]");
//		}
//		if ( sopt.indexOf("1") >= 0 ) {
//			lst.add(tid + "=1~" + name + "=平[" +  ss2[1] + "]");
//		}
//		if ( sopt.indexOf("0") >= 0 ) {
//			lst.add(tid + "=0~" + name + "=负[" +  ss2[2] + "]");
//		}
//		
//		String[] sp = new String[lst.size()];
//		for (int i=0;i<sp.length;i++) {
//			sp[i] = lst.get(i);
//		}
//		lst.clear();
//		lst = null ;
//		return sp;
//	}

	private static HashMap<String,MatchBean> loadMatchBean() {
		HashMap<String, MatchBean> maps = new HashMap<String, MatchBean>();
		MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
//		JXmlWapper xml = mcm.getCache("90");
		JXmlWapper xml = mcm.getCache("jc");
		
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
			maps.put(bean.itemid, bean);
		}
		return maps;
	}
	
	/**
	 * 奖金优化
	 * codes:  SPF|130115001=3/1/0,130115002=3/1,1301115003=0
	 * @param codes
	 */
	public static String optimizeJczq(String codes,int tmuli,int gg,int ytype) {
		String tmp = codes;
		int pos = codes.indexOf("|");
		if ( pos >= 0 ) {
			tmp= codes.substring(pos);
		}

		HashMap<String,MatchBean> maps = loadMatchBean();
		
		List<MatchBean> lst = new ArrayList<MatchBean>();
		String[] ss = StringUtil.splitter(tmp, ",");
		for (int i=0;i<ss.length;i++) {
			String[] sss = StringUtil.splitter(ss[i], "=");
			MatchBean bean = maps.get(sss[0]);
			bean.selected = sss[1];
			lst.add(bean);
		}
		
		List<String> lstOut = new ArrayList<String>();

		List<String[]> list = new ArrayList<String[]>();
		for (int i=0;i<lst.size();i++) {
			MatchBean bean = lst.get(i);
			String[] arr = createItemToArray(bean);
			list.add(arr);
		}

		int mm = gg;
		if  ( mm < 2 || mm > lst.size() ) {
			mm = lst.size();
		}

		int  type = ytype ;
		if ( type == 1 || type == 2) {//保守优化
			if ( mm != lst.size() ) {
				type = 0;//变成平均优化
			}
		}

		List<int[]> cList = CombineUtil.combine(lst.size(), mm);//进行组合
		for (int i=0;i<cList.size();i++) {
			List<String[]> listSingle = new ArrayList<String[]>();
			int[] iis = cList.get(i);
			for (int j=0;j<iis.length;j++) {
				if ( iis[j] > 0) {
					listSingle.add(list.get(j));
				}
			}
			P(listSingle, listSingle.get(0), "",lstOut);
		}
			
		if ( lstOut.size() > tmuli ) {
			return "";
		}
		
		double[] dd = new double[lstOut.size()];
		for (int i=0;i<lstOut.size();i++) {
			List<String> lstSp = findDataByRegexArray(lstOut.get(i),"\\[(.*?)\\]");
			double dm = 2.0;
			for (int j=0;j<lstSp.size();j++) {
				dm = dm * Double.parseDouble(lstSp.get(j));
			}
			dd[i] = dm;
		}
		
		List<String> lstResult =new ArrayList<String>();
		int[] muls = new int[dd.length];
		int tm = 0;
		if ( type == 0 ) {//平均优化
			double d = dd[0];
			double t = 0;
			for (int i=0;i<dd.length;i++) {
				t += d/dd[i];
			}
			for (int i=0;i<muls.length;i++) {
				muls[i] = (int) Math.round(d/dd[i] * tmuli/t);
				if ( muls[i] < 1 ) {
					muls[i] = 1;
				}
				tm += muls[i];
			}
			if ( tm != tmuli ) {
				if ( tm < tmuli ) {//校正
					while ( tm < tmuli) {
						int p = 0;
						double dtmp = Integer.MAX_VALUE + 0.0;
						for (int i=0;i<muls.length;i++) {
							if ( dtmp > muls[i] * dd[i]) {
								dtmp = muls[i] * dd[i];
								p = i;
							}
						}
						muls[p] = muls[p] + 1;	
						tm++;
					}
				} else if ( tm > tmuli ) {//校正
					while ( tm > tmuli ) {
						int p = 0;
						double dtmp = 0.0;
						for (int i=0;i<muls.length;i++) {
							if ( dtmp < muls[i] * dd[i]) {
								dtmp = muls[i] * dd[i];
								p = i;
							}
						}
						if ( muls[p] > 1 ) {
							muls[p] = muls[p] - 1;
							tm = tm - 1;
						} else {
							p = 0;
							dtmp = 0;
							for (int i=0;i<muls.length;i++) {
								if ( dtmp < muls[i]) {
									dtmp = muls[i];
									p = i;
								} else if ( dtmp == muls[i]) {
									if ( muls[p] * dd[p] < muls[i] * dd[i] ) {
										dtmp = muls[i];
										p = i;
									}
								}
							}
							if ( muls[p] > 1 ) {
								muls[p] = muls[p] - 1;
								tm = tm - 1;
							}							
						}
					}
				}
			}
		} else if (type == 1 ){//保守优化
			//找到最小奖金
			int p = 0;
			double dtmp = Integer.MAX_VALUE + 0.0;
			for (int i=0;i<dd.length;i++) {
				if ( dtmp > dd[i]) {
					dtmp = dd[i];
					p = i;
				}
			}
			for (int i=0;i<dd.length;i++) {
				if ( p != i ) {
					muls[i] = (int) Math.floor(tmuli*2/dd[i]) +1;
				}
			}
			for (int i=0;i<muls.length;i++) {
				tm += muls[i];
			}
			muls[p] = tmuli - tm;
		} else if (type == 2 ) {//博热优化
			//找到最大奖金
			int p = 0;
			double dtmp = 0.0;
			for (int i=0;i<dd.length;i++) {
				if ( dtmp < dd[i]) {
					dtmp = dd[i];
					p = i;
				}
			}
			for (int i=0;i<dd.length;i++) {
				if ( p != i ) {
					muls[i] = (int) Math.floor(tmuli*2/dd[i]) +1;
				}
			}
			for (int i=0;i<muls.length;i++) {
				tm += muls[i];
			}
			muls[p] = tmuli - tm;
		}

		double[] tbonus = new double[muls.length];
		for (int i=0;i<muls.length;i++) {
			tbonus[i] = formatDouble(dd[i]*muls[i]);
			lstResult.add(lstOut.get(i) + "|" + formatDouble(dd[i]) + " |" +  muls[i] + "|" + tbonus[i]);
		}

//		Collections.sort(lstResult, new SortByMulity());
		Collections.sort(lstResult, new SortByBonus());
//		Collections.sort(lstResult, new SortByTotalBonus());

		JXmlWapper xmlOut =new JXmlWapper("optimize");
		
		xmlOut.addStringValue("@tmony", tmuli*2 +"");
		xmlOut.addStringValue("@min", "");
		xmlOut.addStringValue("@max", "");
		
		for (int i=0;i<lst.size();i++) {
			JXmlWapper match = xmlOut.addXmlNode("match");
			MatchBean bean = lst.get(i);
			match.addStringValue("@bet0", bean.bet0);
			match.addStringValue("@bet1", bean.bet1);
			match.addStringValue("@bet3", bean.bet3);
			match.addStringValue("@cl", bean.cl);
			match.addStringValue("@close", bean.close);
			match.addStringValue("@et", bean.et);
			match.addStringValue("@gn", bean.gn);
			match.addStringValue("@hn", bean.hn);
			match.addStringValue("@itemid", bean.itemid);
			match.addStringValue("@mid", bean.mid);
			match.addStringValue("@mname", bean.mname);
			match.addStringValue("@mt", bean.mt);
			match.addStringValue("@name", bean.name);
			match.addStringValue("@sopt", bean.selected);
			match.addStringValue("@spf", bean.spf);
		}

		for (int i=0;i<lstResult.size();i++) {
			JXmlWapper xmlResult = xmlOut.addXmlNode("result");
			String[] sr = StringUtil.splitter(lstResult.get(i), "|");
			String[] ssr = StringUtil.splitter(sr[0], ",");
			StringBuffer sbCode = new StringBuffer();
			StringBuffer sbDesc = new StringBuffer();
			for (int j=0;j<ssr.length;j++) {
				String[] s1 = StringUtil.splitter(ssr[j], "~");
				sbCode.append(s1[0]).append(",");
				sbDesc.append(s1[1]).append(",");
			}
			
			String scode = sbCode.toString();
			if ( scode.length() > 1 ) {
				scode = scode.substring(0, scode.length()-1);
				scode = scode + "|" + mm + "*1";
			}
			String sdesc = sbDesc.toString();
			
			
			xmlResult.addStringValue("@seqno", (i+1)+"");
			xmlResult.addStringValue("@code", scode);
			xmlResult.addStringValue("@desc", sdesc.substring(0, sdesc.length()-1));
			
			xmlResult.addStringValue("@bonus", sr[1]);
			xmlResult.addStringValue("@muli", sr[2]);
			xmlResult.addStringValue("@tbonus", sr[3]);
		}
		
		Arrays.sort(tbonus);
		for (int i=lst.size();i>=mm;i--) {
			int c = MathUtil.C(mm, i);		
			JXmlWapper xmlRow = xmlOut.addXmlNode("row");
			
			double dmin = 0;
			double dmax = 0;
			
			for (int j=0;j<c;j++) {
				dmin += tbonus[j];
			}
			
			for (int j=tbonus.length-c;j<tbonus.length;j++) {
				dmax += tbonus[j];
			}
			
			
			xmlRow.addStringValue("@mnum", i+"");
			xmlRow.addStringValue("@znum", c+"");
			
			xmlRow.addStringValue("@mmin", formatDouble(dmin)+"");
			xmlRow.addStringValue("@mmax", formatDouble(dmax)+"");
		}
		
		maps.clear();
		maps = null ;
		lst.clear();
		lst = null ;
		lstResult.clear();
		lstResult = null ;
		
		return xmlOut.toXmlString("utf-8");
	}

	public static void main(String[] args) throws Exception {	
		
//		int tmuli = 1000;
	/*
		String[] arr1 = {"1_3","1_1"};
		String[] arr2 = {"2_3","2_1"};
//		String[] arr3 = {"3_0"};
//		String[] arr4 = {"4_1"};
		
		List<String[]> list = new ArrayList<String[]>();
		list.add(arr1);
		list.add(arr2);
//		list.add(arr3);
//		list.add(arr4);
		
		List<String> lstOut = new ArrayList<String>();
		P(list, arr1, "",lstOut);

		System.out.println(lstOut.size());
		for (int i=0;i<lstOut.size();i++) {
			System.out.println(lstOut.get(i));
		}
	*/
		
//		Object[] arr1 = {"1_3","1_1","0_0"};
//		Object[] arr2 = {"2_3","2_1"};
//		Object[] arr3 = {"3_0","3_1"};
//		Object[] arr4 = {"4_1","4_2"};
//		
//		List<Object[]> list = new ArrayList<Object[]>();
//		list.add(arr1);
//		list.add(arr2);
//		list.add(arr3);
//		list.add(arr4);
//		
//		List<List<Object>> lstOut = new ArrayList<List<Object>>();
//		P1(list, arr1, null,lstOut);
//		
//		System.out.println(lstOut.size());
//		for (int i=0;i<lstOut.size();i++) {
//			List<Object> lst1 = lstOut.get(i);
//			System.out.println(lst1.toString());
//		}
		
//		
		
		
		
//		double[] dd = new double[lstOut.size()];
//		for (int i=0;i<lstOut.size();i++) {
//			List<String> lstSp = findDataByRegexArray(lstOut.get(i),"\\[(.*?)\\]");
//			double dm = 1.0;
//			for (int j=0;j<lstSp.size();j++) {
//				dm = dm * Double.parseDouble(lstSp.get(j));
//			}
//			dd[i] = dm;
//		}
//		
//		double d = dd[0];
//		double t = 0;
//		for (int i=0;i<dd.length;i++) {
//			t += d/dd[i];
//		}
//		
//		int[] muls = new int[dd.length];
//		for (int i=0;i<muls.length;i++) {
//			muls[i] = (int) Math.round(d/dd[i] * tmuli/t);
//			System.out.println(lstOut.get(i) + "|" + formatDouble(dd[i]) + "|" +  muls[i]);
//		}
		
		
//		List<int[]> cList = CombineUtil.combine(7, 2);
//		for (int i = 0; i < cList.size(); i++) {
//			int[] tmp = cList.get(i);
//			for (int j=0;j<tmp.length;j++) {
//				System.out.print(tmp[j] + ",");
//			}
//			System.out.println("");
//		}
//		
//		System.out.println(MathUtil.C(2, 5));
//		System.out.println(lstOut.hashCode());
	}

	
}
