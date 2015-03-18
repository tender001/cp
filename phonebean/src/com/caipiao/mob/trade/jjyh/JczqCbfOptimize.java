package com.caipiao.mob.trade.jjyh;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.plugin.bjutil.CombineUtil;
import com.mina.rbc.util.MathUtil;
import com.mina.rbc.util.StringUtil;

public class JczqCbfOptimize extends AbstractJczqOptimize {

	/**
	 * 
	 */
	@Override
	public String optimize(String codes, int tmuli, int gg, int ytype,String idxs,String gid,String pid) {
		String tmp = codes;
		int pos = codes.indexOf("|");
		if ( pos >= 0 ) {
			tmp= codes.substring(pos+1);
		}
		HashMap<String,MatchBean> maps = loadMatchBeanCach();
		
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
				if ( muls[i] < 1 ) muls[i] = 1;
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
		
		tm = 0;
		double[] tbonus = new double[muls.length];
		for (int i=0;i<muls.length;i++) {
			if ( muls[i]<= 0 ) {
				muls[i] = 1;
			}
			tbonus[i] = formatDouble(dd[i]*muls[i]);
			lstResult.add(lstOut.get(i) + "|" + formatDouble(dd[i]) + " |" +  muls[i] + "|" + tbonus[i]);
			tm += muls[i];
		}

//		Collections.sort(lstResult, new SortByMulity());
		Collections.sort(lstResult, new SortByBonus());
//		Collections.sort(lstResult, new SortByTotalBonus());

		JSONObject optimizeObj = new JSONObject();
		JSONArray matchArray = new JSONArray();
		JSONArray resultArray = new JSONArray();
		JSONArray rowArray = new JSONArray();
		try {
			optimizeObj.put("tmony", tm*2 +"");
			optimizeObj.put("min", "");
			optimizeObj.put("max", "");
			optimizeObj.put("expect", pid);
			optimizeObj.put("gid", gid);
		
			for (int i=0;i<lst.size();i++) {
				JSONObject match = new JSONObject();
				MatchBean bean = lst.get(i);
				match.put("bet0", bean.bet0);
				match.put("bet1", bean.bet1);
				match.put("bet3", bean.bet3);
				match.put("cl", bean.cl);
				match.put("close", bean.close);
				match.put("et", bean.et);
				match.put("gn", bean.gn);
				match.put("hn", bean.hn);
				match.put("itemid", bean.itemid);
				match.put("mid", bean.mid);
				match.put("mname", bean.mname);
				match.put("mt", bean.mt);
				match.put("name", bean.name);
				match.put("sopt", bean.selected);
				match.put("cbf", bean.cbf);
				match.put("sdesc", createSelectedDesc(bean.selected));
				matchArray.put(match);
			}
			optimizeObj.put("match", matchArray);

			for (int i=0;i<lstResult.size();i++) {
				JSONObject result = new JSONObject();
				String[] sr = StringUtil.splitter(lstResult.get(i), "|");
				String[] ssr = StringUtil.splitter(sr[0], ",");
				StringBuffer sbCode = new StringBuffer();
				StringBuffer sbDesc = new StringBuffer();
				for (int j=0;j<ssr.length;j++) {
					String[] s1 = StringUtil.splitter(ssr[j], "~");
					sbCode.append(s1[0]).append(",");
//					sbDesc.append(s1[1]).append(",");
					sbDesc.append(s1[1]).append("<br>");
				}
				
				String scode = sbCode.toString();
				if ( scode.length() > 1 ) {
					scode = scode.substring(0, scode.length()-1);
					scode = scode + "|" + mm + "*1";
				}
				String sdesc = sbDesc.toString();
				
				
				result.put("seqno", (i+1)+"");
				result.put("code", scode);
//				result.put("desc", sdesc.substring(0, sdesc.length()-1));
				result.put("desc", sdesc.substring(0, sdesc.length()-4));
				
				result.put("bonus", sr[1]);
				result.put("muli", sr[2]);
				result.put("tbonus", sr[3]);
				result.put("guoguan", mm+"串1");
				resultArray.put(result);
			}
			optimizeObj.put("result", resultArray);
			
			Arrays.sort(tbonus);
			for (int i=lst.size();i>=mm;i--) {
				int c = MathUtil.C(mm, i);		
				JSONObject row = new JSONObject();
				
				double dmin = 0;
				double dmax = 0;
				
				for (int j=0;j<c;j++) {
					dmin += tbonus[j];
				}
				for (int j=tbonus.length-c;j<tbonus.length;j++) {
					dmax += tbonus[j];
				}
				row.put("mnum", i+"");
				row.put("znum", c+"");
				
				row.put("mmin", formatDouble(dmin)+"");
				row.put("mmax", formatDouble(dmax)+"");
				rowArray.put(row);
			}
			optimizeObj.put("row", rowArray);
		
			maps.clear();
			maps = null ;
			lst.clear();
			lst = null ;
			lstResult.clear();
			lstResult = null ;
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return optimizeObj.toString();
	}

	
	private String createSelectedDesc(String sopt) {
		StringBuffer sb = new StringBuffer();
		sb.append("猜比分 (").append(sopt);
		sb.append(")");
		return sb.toString();
	}	
	//CBF|130412002=3:0/0:1,130412003=0:0
	protected String[] createItemToArray(MatchBean bean) {
		List<String> lst = new ArrayList<String>();
		String[] ss = StringUtil.splitter(bean.selected, "/");
		for (int i=0;i<ss.length;i++) {
			String spv = getSpValue(bean.cbf,"CBF",ss[i]);
//			lst.add(bean.itemid + "=" + ss[i] + "~" + bean.name + "=(" + ss[i] + ")[" +  spv + "]");
			lst.add(bean.itemid + "=" + ss[i] + "~" + bean.hn + "=(" + ss[i] + ")[" +  spv + "]");
		}

		String[] sp = new String[lst.size()];
		for (int i=0;i<sp.length;i++) {
			sp[i] = lst.get(i);
		}
		lst.clear();
		lst = null ;
		return sp;
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		JczqCbfOptimize optimize = new JczqCbfOptimize();
		String s = optimize.optimize("CBF|130412002=3:0/0:1,130412003=0:0", 10000, 2, 1,"","","");
		System.out.println(s);

	}

}
