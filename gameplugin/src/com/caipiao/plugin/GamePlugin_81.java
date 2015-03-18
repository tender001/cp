package com.caipiao.plugin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.caipiao.plugin.bjutil.CombineUtil;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.util.StringUtil;

/**
 * 任九
 * 
 * @author chenzhurong
 * 
 */
public class GamePlugin_81 extends GamePluginAdapter {

	public GamePlugin_81() {
		this.setGameID("81");
		this.setGradeNum(10);
		setGameName("任选九");
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		try {
			GameAwardCode gac = new GameAwardCode();
			String tmpcode = awardCode.trim().replace("*", "013");
			String[] cs = tmpcode.split(",");
			int len = cs.length;
			if (len != 14) {
				throw new CodeFormatException(1, getGameName() + " 开奖号码格式不符合要求", awardCode);
			}
			long first = 0;
			for (int i = 0; i < len; i++) {
				String tmp = cs[i].trim();
				int tlen = tmp.length();
				for (int j = 0; j < tlen; j++) {
					int intValue = -1;
					try {
						intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
						if (intValue < 0 || intValue > 3 || intValue == 2) {
							throw new CodeFormatException(1, getGameName() + " 开奖号码格式不符合要求", awardCode);
						}
					} catch (Exception e) {
						throw new CodeFormatException(1, getGameName() + " 开奖号码格式不符合要求", awardCode);
					}
					first |= 1L << (4 * i + intValue);
				}
			}
			gac.setFirst(first);
			gac.setAwardCode(awardCode);
			return gac;
		} catch (Exception e) {
			throw new CodeFormatException(1, "开奖号码不正确  正确格式为(1,0,3,1,0,1,3,0,1,0,3,1,*,1) 号码必须是[310*] 必须是14个位置", awardCode);
		}

	}

	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}

	@Override
	public GameCastCode parseGameCastCode(String code) throws CodeFormatException {
		code = code.replaceAll("\\*", "#");
		long first = 0;
		long second = 0;
		long third = 0;

		byte pm = 0, cm = 0;
		int mu = 1;
		int money = 2 * mu;

		String[] tmpCode = StringUtil.splitter(code.trim(), ":");
		if (tmpCode.length != 3) {
			throw new CodeFormatException(-1, getGameName() + "投注格式不符合要求", code);
		}
		pm = PluginUtil.toByte(tmpCode[1]);
		cm = PluginUtil.toByte(tmpCode[2]);

		if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
			String[] cs = StringUtil.splitter(tmpCode[0], ",");
			int len = cs.length;
			if (len != 14) {
				throw new CodeFormatException(1, getGameName() + " 号码不符合要求 必须是14个位置", code);
			}
			int total = 0;
			int fnum = 0;
			List<Integer> plst = new ArrayList<Integer>();
			for (int i = 0; i < len; i++) {
				String tmp = cs[i].trim();
				if (!tmp.equalsIgnoreCase("#")) {
					int tlen = tmp.length();
					plst.add(tlen);
					money *= tlen;
					total += tlen;
					for (int j = 0; j < tlen; j++) {
						int intValue = -1;
						intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
						if (intValue < 0 || intValue > 3 || intValue == 2) {
							throw new CodeFormatException(1, getGameName() + "号码只能为[310]", code);
						}
						first |= 1L << (4 * i + intValue);
					}
				} else {
					fnum++;
				}
			}

			if (fnum > 5) {
				throw new CodeFormatException(1, getGameName() + "号码格式错误，必须选择不少于9场比赛", code);
			}

			if (Long.bitCount(first) != total) {
				throw new CodeFormatException(1, getGameName() + "号码有重复", code);
			}

			if (total < 9 || total > 38) {
				throw new CodeFormatException(1, getGameName() + " 号码个数必须在9-38之间", code);
			}
			
			if ( money > 2 * mu ) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			} else {
				cm = GameCastMethodDef.CASTTYPE_SINGLE;
			}

			
//			List<int[]> lst = new ArrayList<int[]>();
			int tm = 0;
			List<int[]> lst = CombineUtil.combine(plst.size(), 9);
			for (int i=0;i<lst.size();i++) {
				int[] tmp = lst.get(i);
				int tt = 1;
				for (int j=0;j<tmp.length;j++) {
					if ( tmp[j] > 0 ) {
						tt *= plst.get(j).intValue();
					}
				}
				tm += tt;
			}
			money = 2 * tm * mu;
			/*
			final int [] ts = new int[1];
			new CombineBase<Integer>(plst, 9) {
				@Override
				public void sequence(List<Integer> lst) {
					int s = 1;
					for(Integer i : lst){
						 s *= i;
					}
					ts[0] += s;
				}
			};
			money = 2 * ts[0] * mu;
			*/
			
		} else if (cm == GameCastMethodDef.CASTTYPE_DANTUO) {
			String[] cs = StringUtil.splitter(tmpCode[0], "$");
			String[] dans = StringUtil.splitter(cs[0].trim(), ",");
			String[] tuos = StringUtil.splitter(cs[1].trim(), ",");
			if (dans.length != 14) {
				throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
			}
			if (tuos.length != 14) {
				throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
			}

			int dtotal = 0, ttotal = 0, total = 0;
			for (int i = 0; i < 14; i++) {
				if (dans[i].trim().indexOf("#") == -1) {
					String tmp = dans[i].trim();
					dtotal += tmp.length();
					for (int j = 0; j < tmp.length(); j++) {
						int intValue = -1;
						try {
							intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
							if (intValue < 0 || intValue > 3 || intValue == 2) {
								throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
							}
						} catch (Exception e) {
							throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
						}
						first |= 1L << (4 * i + intValue);
					}
				}
				if (tuos[i].trim().indexOf("#") == -1) {
					String tmp = tuos[i].trim();
					ttotal += tmp.length();
					for (int j = 0; j < tmp.length(); j++) {
						int intValue = -1;
						try {
							intValue = Integer.parseInt(String.valueOf(tmp.charAt(j)));
							if (intValue < 0 || intValue > 3 || intValue == 2) {
								throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
							}
						} catch (Exception e) {
							throw new CodeFormatException(1, getGameName() + " 号码格式不符合要求", code);
						}
						second |= 1L << (4 * i + intValue);
					}
				}
			}

			if (dtotal != Long.bitCount(first) || ttotal != Long.bitCount(second)) {
				throw new CodeFormatException(1, getGameName() + " 号码有重复", code);
			}

			int sub = 1;
			int dcount = 0;
			List<Integer> list = new ArrayList<Integer>();
			for (int i = 0; i < 14; i++) {
				int d = Long.bitCount(first & (0x0fL << (4 * i)));
				int t = Long.bitCount(second & (0x0fL << (4 * i)));
				if (d > 0 && t > 0) {
					throw new CodeFormatException(1, getGameName() + " 已存在胆码的位置不能再放置拖码", code);
				}
				if (d + t > 0) {
					total++;
				}
				if (d > 0) {
					sub *= d;
					dcount++;
				}
				if (t > 0) {
					list.add(t);
				}
			}

			if (dcount < 0 || dcount > 8) {
				throw new CodeFormatException(1, getGameName() + " 胆码个数必须为0-8个", code);
			}

			if (total < 9) {
				throw new CodeFormatException(1, getGameName() + " 所选胆码与拖码数量不能小于9个", code);
			}

			int len = Long.bitCount(first | second);
			if (len < 9 || len > 38) {
				throw new CodeFormatException(1, getGameName() + " 号码个数必须在9-38个之间", code);
			}

			int tclen = list.size();
			int need = 9 - dcount;
			List<int[]> cList = CombineUtil.combine(tclen, need);
			int[] tmp = null;
			int alltotal = 0;
			for (int i = 0; i < cList.size(); i++) {
				int tsub = 1;
				tmp = cList.get(i);
				for (int j = 0; j < tmp.length; j++) {
					if (tmp[j] > 0) {
						tsub *= list.get(j);
					}
				}
				if (sub != 0) {
					alltotal += sub * tsub;
				} else {
					alltotal += tsub;
				}
			}
			cList.clear();
			cList = null;
			money = 2 * alltotal;
		} else {
			throw new CodeFormatException(-1, getGameName() + "投注方式不支持", code);
		}

		GameCastCode cc = new GameCastCode();
		cc.setFirst(first);
		cc.setSecond(second);
		cc.setThird(third);
		cc.setCastMethod(cm);
		cc.setPlayMethod(pm);
		cc.setCastMoney(money);
		cc.setSourceCode(code);
		return cc;
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		int[] levels = null;
		byte cm = code.getCastMethod();

		if (cm == GameCastMethodDef.CASTTYPE_SINGLE || cm == GameCastMethodDef.CASTTYPE_MULTI) {// 复式
			levels = countLevels(code.getFirst(), gradeNum, bingoCode.getFirst());
		} else if (code.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
			levels = new int[gradeNum];
			int dnum = 0, tnum = 0;
			long first = code.getFirst();
			long second = code.getSecond();

			List<Integer> lstPos = new ArrayList<Integer>();
			for (int i = 0; i < 14; i++) {
				if (Long.bitCount(first & (0x0FL << (4 * i))) >= 1) {
					dnum++;
				}
				if (Long.bitCount(second & (0x0FL << (4 * i))) >= 1) {
					tnum++;
					lstPos.add(i);
				}
			}

			List<int[]> cList = CombineUtil.combine(tnum, 9 - dnum);
			for (int i = 0; i < cList.size(); i++) {
				long tf = first;
				int[] tmp = cList.get(i);
				for (int j = 0; j < tmp.length; j++) {
					if (tmp[j] > 0) {
						tf |= (second & (0x0FL << 4 * lstPos.get(j)));
						int[] llv = countLevels(tf, gradeNum, bingoCode.getFirst());
						if (llv != null) {
							for (int k = 0; k < llv.length; k++) {
								levels[k] += llv[k];
							}
						}
					}
				}
			}
		}
		return levels;
	}

	private int[] countLevels(long first, int gn, final long bf) {
		final int[] levels = new int[gn];
		int[] cnum = new int[14];// 号码数量
		int tnum = 1;// 总注数
		for (int i = 0; i < 14; i++) {
			cnum[i] = Long.bitCount(first & (0x0FL << (4 * i)));
			if (cnum[i] > 0) {
				tnum *= cnum[i];
			}
		}

		long[] alls = new long[tnum];
		int pos = 1;
		for (int i = 0; i < cnum.length; i++) {
			if (cnum[i] > 0) {
				int n = 0;
				int[] cc = new int[cnum[i]];
				long ll = (first & (0x0FL << (i * 4))) >> (i * 4);
				for (int j = 0; j < 4; j++) {
					if (((ll & (1L << j)) >> j) == 1) {
						cc[n++] = j;
					}
				}
				int tmp = pos;
				for (int k = 1; k < cnum[i]; k++) {
					for (int j = 0; j < tmp; j++) {
						alls[pos] = alls[j];
						alls[pos] |= (1L << cc[k]) << (i * 4);
						pos++;
					}
				}
				for (int j = 0; j < tmp; j++) {
					alls[j] |= (1L << cc[0]) << (i * 4);
				}
			}
		}
		final Set<Long> set = new HashSet<Long>();
		for (int i = 0; i < alls.length; i++) {
			long tl = alls[i];
			List<Long> lst = new ArrayList<Long>();
			for (int k = 0; k < 14; k++) {
				long t = tl & (0x0FL << (4 * k));
				if(t > 0){
					lst.add(t);
				}
			}
			
			List<int[]> nlst = CombineUtil.combine(lst.size(), 9);
			if (nlst!=null){
				for (int k=0; k<nlst.size();k++) {
					int[] tmp = nlst.get(k);
					long l = 0;
					for (int m=0;m<tmp.length;m++) {
						if ( tmp[m] > 0 ) {
							l |= lst.get(m).longValue();
						}
					}
					set.add(l);
				}
			}
			
			
			/*
			new CombineBase<Long>(lst, 9) {
				@Override
				public void sequence(List<Long> llst) {
					long l = 0;
					for(Long x : llst){
						l |= x.longValue();
					}
					set.add(l);
				}
			};
			*/
		}
		for(Iterator<Long> its=set.iterator(); its.hasNext();){
			Long l = its.next();
			int lv = Long.bitCount(l & bf);
			levels[9 - lv] += 1;
		}
		set.clear();
		return levels;
	}

	public String toPrintCode(GameCastCode gcc) {
		String s = gcc.getSourceCode();
		String[] tmpCode = PluginUtil.splitter(s, ":");
		return tmpCode[0];
	}
	
	@Override
	public HashMap<String, String> keyBoardParser(String code,int muli) throws Exception {
		String codes = code.replaceAll("\\*", "#");
		HashMap<String,String> maps = new HashMap<String,String>();
		String[] str = new String[14];
		for (int i=0;i<str.length;i++) {
			str[i] = "";
		}
		
		int cm = -1;
		int pm = -1;
		int money = -1;

		GameCastCode[] gccs = parseGameCastCodes(codes);
		if ( gccs.length > 1) {
			cm = 1;
		} else {
			cm = gccs[0].getCastMethod();
			pm = gccs[0].getPlayMethod();
			money = gccs[0].getCastMoney() * muli;
			
			if ( cm == GameCastMethodDef.CASTTYPE_SINGLE && gccs[0].getCastMoney() > 2) {
				cm = GameCastMethodDef.CASTTYPE_MULTI;
			}

			if ( cm == GameCastMethodDef.CASTTYPE_MULTI && gccs[0].getCastMoney() == 2) {
				cm = GameCastMethodDef.CASTTYPE_SINGLE;
			}

		}

		pm = 1;//固定为1
		
		if ( cm == 1) {//单式
			str[0] = "";
			money = 0;
			for (int i=0;i<gccs.length;i++) {
				String pcode = toPrintCode(gccs[i]);				
				StringBuffer sb = new StringBuffer();
				String[] sss = StringUtil.splitter(pcode, ",");
				int c = 0;
				for (int j=0;j<sss.length;j++) {
					sb.append(sss[j]);
					if ( ! sss[j].equalsIgnoreCase("#") ) {
						c++;
						if ( c == 9 ) {
							break ;
						}
					} 
				}
				str[0] += toKeyString(sb.toString());
				money += gccs[i].getCastMoney() * muli;
			}
			str[0] = StringUtil.replaceString(str[0], "#", "KRIGHT|");
		} else if (cm == 2){//复式
			String pcode = toPrintCode(gccs[0]);
			String[] ss = StringUtil.splitter(pcode, ",");
			for (int i=0;i<ss.length;i++) {
				
				if ( ss[i].equalsIgnoreCase("#")) {
					str[i] = "";
				} else {
					str[i] = toKeyString(ss[i]);
				}
			}
		} else {
			throw new Exception("投注方式不支持");
		}

		for (int i=0;i<str.length;i++) {
			if ( str[i] != null && str[i].length() > 0 ) {
				if ( i<9) {
					maps.put("$0" + (i+1), str[i]);
				} else {
					maps.put("$" + (i+1), str[i]);
				}
			}
		}

		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		maps.put("$cm", cm+"");
		maps.put("$pm", pm+"");

		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		GamePlugin_81 plugin = new GamePlugin_81();
		GameAwardCode gac = plugin.buildAwardCode("1,3,1,1,3,1,3,0,3,3,1,1,1,3");
		int gnum = 10;

		long l = System.currentTimeMillis();
//		 String code = "1,3,1,1,3,1,3,0,3,#,#,#,#,#:1:1";
//		String code = "1,3,1,1,3,1,3,0,3,31,10,#,#,#:1:2";
//		String code = "1,3,0,1,3,0,1,3,*,1,*,*,*,*:1:1;#,3,0,1,3,0,1,3,0,1,#,#,#,#:1:1;1,3,#,1,3,0,1,3,0,1,#,#,#,#:1:1;1,3,0,#,3,0,1,3,0,1,#,#,#,#:1:1;1,#,0,1,3,0,1,3,0,1,#,#,#,#:1:1";
//		String code = "310,1,0,3,#,#,#,#,#,#,#,#,#,#$#,#,#,#,#,#,3,1,0,1,3,3,1,3:1:5";
		
//		String code = "3,3,1,3,0,#,1,#,0,3,#,#,#,3:1:1;#,#,1,1,0,3,3,#,0,#,1,3,#,0:1:1;3,1,3,3,3,1,#,#,#,#,3,1,#,0:1:1;3,3,1,1,3,#,1,3,#,#,3,3,#,#:1:1;3,1,#,#,0,3,#,0,#,3,3,1,#,1:1:1";
		String code = "13,3,03,013,#,13,03,#,0,03,#,#,#,03:1:1";
		GameCastCode[] gcc = plugin.parseGameCastCodes(code);
		int money = 0;
		for (int i=0;i<gcc.length;i++) {
			money += gcc[i].getCastMoney();
		}
		System.out.println("money=" + money);
		
		int[] ll = plugin.bingoMatch(gcc, gac, gnum);
		if (ll != null) {
			for (int i = 0; i < ll.length; i++) {
				System.out.println(ll[i]);
			}
		}
		System.out.println("所用时间=" + (System.currentTimeMillis() - l));

		// GameCastCode gcc =
		// plugin.parseGameCastCode("310,1,0,3,#,#,#,#,#,#,#,#,#,#$#,#,#,#,#,#,3,1,0,1,3,3,1,3:1:5");
		// System.out.println(gcc.getCastMoney());

		// List<int[]> lst = CombineUtil.combine(5, 2);
		// for (int i=0;i<lst.size();i++) {
		// int[] tmp = lst.get(i);
		// for (int j=0;j<tmp.length;j++) {
		// System.out.print(tmp[j] + " ");
		// }
		// System.out.println("");
		// }
		
//		GameCastCode gcc1 = plugin.parseGameCastCode(code);
//		System.out.println(plugin.toPrintCode(gcc1));
		System.out.println(plugin.keyBoardParser(code, 1));

	}
}