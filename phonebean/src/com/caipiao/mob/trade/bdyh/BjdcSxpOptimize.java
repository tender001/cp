package com.caipiao.mob.trade.bdyh;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.mob.trade.bdyh.AbstractBjdcOptimize.MatchBean;
import com.caipiao.mob.trade.jjyh.CountBean;
import com.caipiao.plugin.bjutil.CombineUtil;
import com.mina.rbc.util.MathUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class BjdcSxpOptimize extends AbstractBjdcOptimize {

	private final static HashMap<String,String> MNAMES = new HashMap<String,String>();
	static {
		MNAMES.put("3", "上+单");
		MNAMES.put("2", "上+双");
		MNAMES.put("1", "下+单");
		MNAMES.put("0", "下+双");
	}
	
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
//		HashMap<Integer, MatchBean> maps = loadMatchBeanCach(gid,pid);
		HashMap<Integer, MatchBean> maps = loadMatchBeanUrl(gid, pid);
		
		List<MatchBean> lst = new ArrayList<MatchBean>();
		String[] ss = StringUtil.splitter(tmp, ",");
		System.out.println(tmp);
		for (int i=0;i<ss.length;i++) {
			String[] sss = StringUtil.splitter(ss[i], "=");
			MatchBean bean = maps.get(Integer.valueOf(sss[0]));
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
		
		double[] dd = new double[lstOut.size()];//每注奖金
		for (int i=0;i<lstOut.size();i++) {
			List<String> lstSp = findDataByRegexArray(lstOut.get(i),"\\[(.*?)\\]");
			double dm = 1.0;
			for (int j=0;j<lstSp.size();j++) {
				dm = dm * Double.parseDouble(lstSp.get(j));
			}
			dd[i] = dm;
		}
		
		int ttt = 0;
		for (int i=0;i<dd.length;i++) {
			int m = (int) Math.round(tmuli / dd[i]);
			if ( m < 1 ) m = 1;
			ttt += m;
		}
		if ( ttt > tmuli ) {//亏本的方案 只能做平均优化
			if ( type != 0 && type != 3 ) type = 0; 
		}
		
		
		int[] muls = new int[dd.length];
		int tm = 0;//实际倍数
		if ( type == 0 || type == 3 ) {//平均优化
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
		} else if (type == 1 ){//保守优化
			//找到最小奖金
			int p = 0;
			double dtmp = Integer.MAX_VALUE + 0.0;
			for (int i=0;i<dd.length;i++) {
				if ( dtmp > dd[i]*2) {
					dtmp = dd[i]*2;
					p = i;
				}
			}
			for (int i=0;i<dd.length;i++) {
				if ( p != i ) {
					muls[i] = (int) Math.floor(tmuli/dd[i]);
					if ( muls[i] < 1) muls[i] = 1;
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
				if ( dtmp < dd[i]*2) {
					dtmp = dd[i]*2;
					p = i;
				}
			}
			for (int i=0;i<dd.length;i++) {
				if ( p != i ) {
					muls[i] = (int) Math.floor(tmuli/dd[i]);
					if ( muls[i] < 1) muls[i] = 1;
				}
			}
			for (int i=0;i<muls.length;i++) {
				tm += muls[i];
			}
			muls[p] = tmuli - tm;
		} 

		
		

		List<CountBean> lstResult =new ArrayList<CountBean>();
		tm = 0;
		double[] tbonus = new double[muls.length];
		for (int i=0;i<muls.length;i++) {
			if ( muls[i]<= 0 ) muls[i] = 1;
			tbonus[i] = formatDouble(dd[i]*muls[i]);

			CountBean cb = new CountBean();
			cb.setBonus(formatDouble(dd[i]));
			cb.setMulity(muls[i]);
			
//			131012002=3~周六002=胜[2.21],131012003=0~周六003=负[2.90]
			String[] ssr = StringUtil.splitter(lstOut.get(i), ",");
			StringBuffer sbCode = new StringBuffer();
			StringBuffer sbDesc = new StringBuffer();
			for (int j=0;j<ssr.length;j++) {
				String[] s1 = StringUtil.splitter(ssr[j], "~");
				sbCode.append(s1[0]).append(",");
//				sbDesc.append(s1[1]).append(",");
				sbDesc.append(s1[1]).append("<br>");
			}
			String scode = sbCode.toString();
			if ( scode.length() > 1 ) {
				scode = scode.substring(0, scode.length()-1);
				scode = scode + "|" + mm + "*1";
			}
			String sdesc = sbDesc.toString();
			cb.setCodes(scode);
//			cb.setDescs(sdesc.substring(0,sdesc.length()-1));
			cb.setDescs(sdesc.substring(0,sdesc.length()-4));
			lstResult.add(cb);
			tm += muls[i];
		}
		
//		Collections.sort(lstResult, new SortByBonus());
		if ( type == 3 ) {//保本优化
			int ttm = 0;
			int[] idx = StringUtil.SplitterInt(idxs, ",");
			double d = -1;
			double t = 0;
			int baoben = 0;
			for (int i=0;i<lstResult.size();i++) {
				CountBean cb = lstResult.get(i);
				for (int j=0;j<idx.length;j++) {
					if ( i == idx[j] ) {//保本
						int m = (int) Math.round(tm/cb.getBonus());
						if ( m < 1 ) m = 1;
						baoben += m;
						cb.setMulity(m);
						tbonus[i] = formatDouble(cb.getBonus()*cb.getMulity());
						ttm += m;		
						cb = null ;
					} 
				}
				if ( cb != null ) {//奖金最大化
					if ( d < 0 ) {
						d = cb.getBonus();
					}
					t += d/cb.getBonus();
				}	
			}

			int leave = tm - baoben ;//剩下倍数
			for (int i=0;i<lstResult.size();i++) {
				CountBean cb = lstResult.get(i);
				for (int j=0;j<idx.length;j++) {
					if ( i == idx[j] ) {
						cb = null ;
						break ;
					}
				}
				
				if ( cb != null ) {//奖金最大化
					int m  = (int) Math.round(d/cb.getBonus() * leave/t);
					if ( m < 1 ) m = 1;
					cb.setMulity(m);
					tbonus[i] = formatDouble(cb.getBonus()*cb.getMulity());
					ttm += m;						
				}
			}
			tm = ttm;
		}
		
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
				match.put("bet0", bean.b0);
				match.put("bet1", bean.b1);
				match.put("bet3", bean.b3);
				match.put("cl", bean.cl);
				match.put("close", bean.close);
				match.put("et", bean.et);
				match.put("gn", bean.gn);
				match.put("hn", bean.hn);
				match.put("mid", bean.mid);
				match.put("mname", bean.mname);
				match.put("bt", bean.bt);
				match.put("sopt", bean.selected);
				match.put("spv", bean.spv);
				match.put("sdesc", "");
				matchArray.put(match);
			}
			optimizeObj.put("match", matchArray);
		
			for (int i=0;i<lstResult.size();i++) {
				JSONObject result = new JSONObject();
				CountBean cb = lstResult.get(i);
	
				result.put("seqno", (i+1)+"");
				result.put("code", cb.getCodes());
				result.put("desc", cb.getDescs());
				
				result.put("bonus", cb.getBonus()*2+"");
				result.put("muli", cb.getMulity()+"");
				result.put("tbonus", formatDouble(cb.getMulity()*cb.getBonus()*2)+"");
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
					dmin += tbonus[j]*2;
				}
				for (int j=tbonus.length-c;j<tbonus.length;j++) {
					dmax += tbonus[j]*2;
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

	//130319001>BQC=3-3,130319003>SPF=3,130319004>JQS=1,130319005>SPF=3|4*1
	protected String[] createItemToArray(MatchBean bean) {
		List<String> lst = new ArrayList<String>();
		String[] ss = StringUtil.splitter(bean.selected, "/");
		for (int i=0;i<ss.length;i++) {
			String spv = getSpValue(bean.spv,"SXP",ss[i]);
//			lst.add(bean.mid + "=" + ss[i] + "~" + bean.mid + "=" + MNAMES.get(ss[i]) + "[" +  spv + "]");
			lst.add(bean.mid + "=" + ss[i] + "~" +bean.hn + "=" + MNAMES.get(ss[i]) + "[" +  spv + "]");
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
		BjdcSxpOptimize optimize = new BjdcSxpOptimize();
		String s = optimize.optimize("SXP|53=3,54=1,55=3/1/0", 7, 2, 3,"1","88","140812");
		System.out.println(s);
	}

}
