package com.caipiao.plugin;

import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.bjutil.BJUtil;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.CombineUtil;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 北单 猜比分
 * @author chenzhurong
 *
 */

public class GamePlugin_86 extends GamePluginAdapter {
	
	private String gameID = BJUtil.CBF;

	@Override
	public GameCastCode parseGameCastCode(String code) throws CodeFormatException {	
		String[] parts = PluginUtil.splitter(code, "|");
		if ( ! parts[0].equalsIgnoreCase("CBF")) {
			throw new CodeFormatException(5, "格式不符合要求  必须以CBF|开头", code);
		}
		
		int total = 0;
		int comnum = 0;
		byte method = GameCastMethodDef.CASTTYPE_MULTI;
		byte play = 0x01;
		String matches = ",";
		
		if ( code.indexOf("$") > 0 ) {//胆拖
			method = GameCastMethodDef.CASTTYPE_DANTUO;
			
			if (parts.length != 4 && parts.length != 3) {
				throw new CodeFormatException(9, "格式不符合要求  必须是(CBF|胆码$拖码|过关方式|胆容错数)", code);
			}

			//过关方式
			String[] gg = PluginUtil.splitter(parts[2], ",");
			BJUtil.checkPassType(gameID,gg);

			//投注号码
			String[] cparts = PluginUtil.splitter(parts[1], "$");
			if (cparts.length != 2) {
				throw new CodeFormatException(12, "投注串不符合要求 胆拖必须是(CBF|胆码$拖码|过关方式|胆容错数)", code);
			}

			String[] dans = PluginUtil.splitter(cparts[0], ",");
			String[] tuos = PluginUtil.splitter(cparts[1], ",");

			int[] dnum = new int[dans.length];
			int[] tnum = new int[tuos.length];
			HashMap<String, String> ids = new HashMap<String, String>();
			for (int i = 0; i < dans.length; i++) {
				String[] cs = PluginUtil.splitter(dans[i], "=");
				if (cs.length != 2) {
					throw new CodeFormatException(13, "投注串不符合要求(13)", code);
				}
				ids.put(cs[0].trim(), cs[0].trim());
				String[] ccs = PluginUtil.splitter(cs[1], "/");
				BJUtil.checkItems(gameID,ccs,code);
				dnum[i] = ccs.length;
				
				// 检查场次的重复
				if ( matches.indexOf("," + cs[0] + ",") >= 0 ) {
					throw new CodeFormatException(2, "比赛场次重复",code);
				} else {
					matches += cs[0] + ",";
				}
			}

			for (int i = 0; i < tuos.length; i++) {
				String[] cs = PluginUtil.splitter(tuos[i], "=");
				if (cs.length != 2) {
					throw new CodeFormatException(14, "投注串不符合要求(14)", code);
				}
				ids.put(cs[0].trim(), cs[0].trim());
				String[] ccs = PluginUtil.splitter(cs[1], "/");
				BJUtil.checkItems(gameID,ccs,code);
				tnum[i] = ccs.length;
				
				// 检查场次的重复
				if ( matches.indexOf("," + cs[0] + ",") >= 0 ) {
					throw new CodeFormatException(2, "比赛场次重复",code);
				} else {
					matches += cs[0] + ",";
				}
			}

			
			if (ids.size() != dans.length + tuos.length) {
				throw new CodeFormatException(15, "存在重复投注场次(15)", code);
			}

			//胆容错
			int dr = -1;
			try {
				if ( parts.length == 4 ) {
					dr = Integer.parseInt(parts[3]);
				} else {
					dr = dans.length;
				}
			} catch (Exception e) {
				throw new CodeFormatException(8, "胆容错必须是数字", code);
			}
			if (dr <= 0 || dr > dans.length) {
				throw new CodeFormatException(16, "胆容错设置不符合要求(16)", code);
			}

			for (int m = 0; m < gg.length; m++) {
				String g = gg[m];
				int start = BJUtil.getStart(g);
				int end = BJUtil.getEnd(g);
				for (int i = dr; i <= dans.length; i++) {
					List<int[]> dlist = CombineUtil.combine(dans.length, i);
					if (dlist != null && !dlist.isEmpty()) {
						for (int j = 0; j < dlist.size(); j++) {
							int[] dtmp = dlist.get(j);
							int[] src = new int[end];
							int dindex = 0;
							for (int n = 0; n < dtmp.length; n++) {
								if (dtmp[n] > 0) {
									src[dindex] = dnum[n];
									dindex++;
								}
							}

							if (tuos.length + i < end) {
								break;
							}

							List<int[]> tlist = CombineUtil.combine(tuos.length, end - i);
							if (tlist != null && !tlist.isEmpty()) {
								for (int x = 0; x < tlist.size(); x++) {
									int[] ttmp = tlist.get(x);
									int tindex = 0;
									for (int y = 0; y < ttmp.length; y++) {
										if (ttmp[y] > 0) {
											src[i + tindex] = tnum[y];
											tindex++;
										}
									}
									for (int a = start; a <= end; a++) {
										List<int[]> clist = CombineUtil.combine(end, a);
										for (int b = 0; b < clist.size(); b++) {
											int[] tmp = clist.get(b);
											int sub = 1;
											for (int z = 0; z < tmp.length; z++) {
												if (tmp[z] > 0) {
													sub *= src[z];
												}
											}
											total += sub;
											comnum++;
										}
									}
								}
							}
							tlist = null;
						}
					}
					dlist = null;
				}
			}
		} else {//单复式
			if (parts.length != 3) {
				throw new CodeFormatException(9, "格式不符合要求  必须是CBF|号码|过关方式", code);
			}
			
			String[] gg = PluginUtil.splitter(parts[2], ",");
			BJUtil.checkPassType(gameID,gg);
			
			String[] items = PluginUtil.splitter(parts[1], ",");
			int[] num = new int[items.length];
			HashMap<String, String> ids = new HashMap<String, String>();
			for (int i = 0; i < items.length; i++) {
				String[] cs = PluginUtil.splitter(items[i], "=");
				if (cs.length != 2) {
					throw new CodeFormatException(10, "投注串不符合要求(10)", code);
				}
				ids.put(cs[0].trim(), cs[0].trim());
				String[] ccs = PluginUtil.splitter(cs[1], "/");
				BJUtil.checkItems(gameID,ccs,code);
				num[i] = ccs.length;
				
				// 检查场次的重复
				if ( matches.indexOf("," + cs[0] + ",") >= 0 ) {
					throw new CodeFormatException(2, "比赛场次重复",code);
				} else {
					matches += cs[0] + ",";
				}
			}
			if (ids.size() != items.length) {
				throw new CodeFormatException(11, "存在重复投注场次(11)", code);
			}

			for (int i = 0; i < gg.length; i++) {
				String g = gg[i];
				int start = BJUtil.getStart(g);
				int end = BJUtil.getEnd(g);
				List<int[]> clist = CombineUtil.combine(items.length, end);
				if (clist != null && !clist.isEmpty()) {
					for (int j = 0; j < clist.size(); j++) {
						int[] tmp = clist.get(j);
						int[] src = new int[end];
						int index = 0;
						for (int k = 0; k < tmp.length; k++) {
							if (tmp[k] > 0) {
								src[index] = num[k];
								index++;
							}
						}

						int subtotal = 0;
						for (int m = start; m <= end; m++) {
							int sub_total = 0;
							List<int[]> tlist = CombineUtil.combine(end, m);
							for (int n = 0; n < tlist.size(); n++) {
								int[] tt = tlist.get(n);
								int sub = 1;
								for (int t = 0; t < tt.length; t++) {
									if (tt[t] > 0) {
										sub *= src[t];
									}
								}
								sub_total += sub;
							}
							tlist = null;
							subtotal += sub_total;
						}
						total += subtotal;
						comnum++;
					}
				}
				clist = null;
			}
		}

		GameCastCode gcc = new GameCastCode();
		gcc.setSourceCode(code);
		gcc.setCastMethod(method);
		gcc.setPlayMethod(play);
		gcc.setCastMoney(2 * total);
		gcc.setCombineNum(comnum);
		gcc.setMatchID(matches);
		return gcc;
	}
	
	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}

	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		return null;
	}

	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		return null;
	}
	
	public String toPrintCode(GameCastCode gcc) {
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {
		return null;
	}
	
	public static void main(String[] args) throws Exception {
		long start = System.currentTimeMillis();
		GamePlugin_86 plugin = new GamePlugin_86();
		for (int i = 0; i < 10000; i++) {
			GameCastCode gcc = plugin.parseGameCastCode("CBF|48=4:0,49=2:0/2:2/0:3,50=2:1/3:3|1*1");
			System.out.println(gcc.getCastMoney());
		}
		long end = System.currentTimeMillis();
		System.out.println(end - start);
		
		
//		GamePlugin_86 plugin = new GamePlugin_86();
//		long l = System.currentTimeMillis();
//
//		File file = new File("C:\\javawork\\caipiao\\GamePlugin\\85.txt");
//		BufferedReader br = new BufferedReader(new FileReader(file));
//		String temp = null;
//		int total = 0;
//		while ((temp = br.readLine()) != null) {
//			String code = temp;
//			GameCastCode gcc = plugin.parseGameCastCode(code);
//			total += gcc.getCastMoney();
//		}
//		System.out.println("total=" + total);
//		System.out.println("所用时间=" + (System.currentTimeMillis() - l));

	}
}