package com.caipiao.plugin.jcutil;

import java.util.ArrayList;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.CombineUtil;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;


public abstract class GamePlugin_jc extends GamePluginAdapter {

	static void P1(List<JcItemBean[]> list, JcItemBean[] arr, List<JcItemBean> lst,List<List<JcItemBean>> lstOut) {
		if ( lst == null ) {
			lst = new ArrayList<JcItemBean>();
		}
		for (int i = 0; i < list.size(); i++) {
			if (i == list.indexOf(arr)) {
				for (JcItemBean st : arr) {
					if (i < list.size() - 1) {
						List<JcItemBean> lst1 = new ArrayList<JcItemBean>();						
						for (int j=0;j<lst.size();j++) {
							lst1.add(lst.get(j));
						}
						lst1.add(st);
						P1(list, list.get(i + 1), lst1,lstOut);
					} else if (i == list.size() - 1) {// 排列数据
						List<JcItemBean> lst1 = new ArrayList<JcItemBean>();						
						for (int j=0;j<lst.size();j++) {
							lst1.add(lst.get(j));
						}
						lst1.add(st);
						lstOut.add(lst1);
					} else {
						lst.add(st);
					}
				}
			}
		}
	}
	
	public abstract void checkPassType(String passtype) throws CodeFormatException;

	public abstract byte getIntPlayType(String prefix) throws CodeFormatException;

	public String toPrintCode(GameCastCode gcc){
		StringBuffer sb = new StringBuffer();
		List<Object> list = gcc.getCast();
		for(int i = 0; i < list.size(); i++){
			JcCastCode cast = (JcCastCode)list.get(i);
			sb.append(cast.toBillCode());
			sb.append(";");
		}
		String code = sb.toString();
		if(code.endsWith(";")){
			code = code.substring(0, code.lastIndexOf(";"));
		}
		return code;
	}
	
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		return null;
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}

	@Override
	public GameCastCode parseGameCastCode(String code) throws CodeFormatException {
		int money = 0;
		GameCastCode gcc = new GameCastCode();
		String matches = ",";
		List<JcItemBean> items = new ArrayList<JcItemBean>();

		String[] parts = PluginUtil.splitter(code, "|");

		byte cm = 1;
		byte pm = getIntPlayType(parts[0]);//获取到玩法值
		boolean mix = false ;
		
		String sep = "=";
		if ( pm == JcItemCodeUtil.HH ) {
			if (!(parts.length == 3 || parts.length == 4)) {
				throw new CodeFormatException(5, "格式不符合要求  必须是(HH|号码|过关方式 或 HH|号码|过关方式|1)", code);
			} else {
				if (parts.length == 4) {
					if ("1".equals(parts[3])) {
						mix = true;
					} 
				}
			}
			sep = ">";
		} else {
			if ( parts.length != 3  ) {
				throw new CodeFormatException(5, "格式不符合要求  必须是(玩法|号码|过关方式)", code);
			}
		}

		String jcode = parts[1];
		String guogu = parts[2];
		if (jcode.indexOf("$") >=0 ) {
			String[] cs = PluginUtil.splitter(jcode, "$");
			if (cs.length != 2) {
				throw new CodeFormatException(3, "胆拖号码格式错误", code);
			}
			String[] dans = PluginUtil.splitter(cs[0], ",");
			String[] tuos = PluginUtil.splitter(cs[1], ",");

			String[] passes = PluginUtil.splitter(guogu, ",");
			gcc.setGuoguans(guogu);

			int danlen = dans.length;
			int tuolen = tuos.length;

			List<JcItemBean> dList = new ArrayList<JcItemBean>();
			for (int i = 0; i < dans.length; i++) {
				String[] ccs = PluginUtil.splitter(dans[i], sep);
				if (ccs.length != 2) {
					throw new CodeFormatException(3, "号码格式错误 必须是(场次=选号)", code);
				}
				JcItemBean ib = new JcItemBean();
				ib.setItemid(ccs[0].trim());
				ib.setCode(ccs[1].trim(), pm);

				// 检查场次的重复
				if (matches.indexOf("," + ccs[0] + ",") >= 0) {
					throw new CodeFormatException(3, "胆码中所选择的场次有重复", code);
				} else {
					matches += ccs[0] + ",";
				}
				dList.add(ib);
			}
			List<JcItemBean> tList = new ArrayList<JcItemBean>();
			for (int i = 0; i < tuos.length; i++) {
				String[] ccs = PluginUtil.splitter(tuos[i], sep);
				if (ccs.length != 2) {
					throw new CodeFormatException(3, "号码错误 (场次=选号)", code);
				}
				JcItemBean ib = new JcItemBean();
				
				ib.setItemid(ccs[0].trim());
				ib.setCode(ccs[1].trim(), pm);

				// 检查场次的重复
				if (matches.indexOf("," + ccs[0] + ",") >= 0) {
					throw new CodeFormatException(3, "拖码中所选择的场次有重复", code);
				} else {
					matches += ccs[0] + ",";
				}
				tList.add(ib);
			}
			items.addAll(dList);
			items.addAll(tList);

			for (int y = 0; y < passes.length; y++) {
				String passType = passes[y];
				
				int endPass = JcPassTypeUtil.getEndPassType(passType);
				int maxPass = JcPassTypeUtil.getMaxPassType(pm);

				checkPassType(passType);//检查过关方式
				
				int max = JcPassTypeUtil.getMaxPassType(passType);
				if (max <= 0) {
					throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
				}
				
				if (danlen < 1 || danlen > max) {
					throw new CodeFormatException(3, "胆码和拖码与选择的过关方式不符", code);
				}
				if (danlen + tuolen < max) {
					throw new CodeFormatException(3, "胆码和拖码与选择的过关方式不符", code);
				}
				
				List<int[]> listCombine = CombineUtil.combine(tuos.length, max - dans.length);
				if (listCombine == null) {
					throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
				}

				for (int i = 0; i < listCombine.size(); i++) {
					int[] tmp = listCombine.get(i);

					List<JcItemBean[]> list = new ArrayList<JcItemBean[]>();
					JcItemBean[] first = null ;
					
					for (int j = 0; j < dList.size(); j++) {
						JcItemBean[] jcTmp = dList.get(j).getSubJcItem();
						if ( first == null ) {
							first = jcTmp;
						}
						list.add(jcTmp);
					}
					
					for (int j = 0; j < tmp.length; j++) {
						if (tmp[j] > 0) {
							JcItemBean[] jcTmp = tList.get(j).getSubJcItem();
							if ( first == null ) {
								first = jcTmp;
							}
							list.add(jcTmp);
						}
					}

					List<List<JcItemBean>> lstOut = new ArrayList<List<JcItemBean>>();
					P1(list, first, null,lstOut);
					for (int j=0;j<lstOut.size();j++) {
						List<JcItemBean> lst = lstOut.get(j);
						if ( !(mix && ! isMix(lst)) ) {
							JcCastCode cc = new JcCastCode();
							cc.setPlaytype(pm);
							cc.setPassType(passType);
							for (int k=0;k<lst.size();k++) {
								cc.addItemBean(lst.get(k));
								if ( pm == JcItemCodeUtil.HH) {
									maxPass = Math.min(maxPass, JcPassTypeUtil.getMaxPassType(lst.get(k).getPlayType()));
								}
							}
							money += cc.getBettingnum();
							gcc.putCast(cc);
						}
					}
				}
				if ( pm == JcItemCodeUtil.HH) {
					if ( endPass > maxPass ) {
						throw new CodeFormatException(5, " 过关方式不正确 必须是(2到" + maxPass + "串之间)", passType);
					}
				}
			}
		} else {
			String[] codes = PluginUtil.splitter(jcode, ",");
			String[] passes = PluginUtil.splitter(guogu, ",");
			gcc.setGuoguans(guogu);

			List<JcItemBean> itlist = new ArrayList<JcItemBean>();
			for (int i = 0; i < codes.length; i++) {
				String[] ccs = PluginUtil.splitter(codes[i], sep);
				if (ccs.length != 2) {
					throw new CodeFormatException(2, "号码格式错误 (场次=选号)", code);
				}
				
				JcItemBean ib = new JcItemBean();
				ib.setItemid(ccs[0].trim());
				ib.setCode(ccs[1].trim(), pm);
				
				// 检查场次的重复
				if (matches.indexOf("," + ccs[0] + ",") >= 0) {
					throw new CodeFormatException(2, "比赛场次重复", code);
				} else {
					matches += ccs[0] + ",";
				}
				itlist.add(ib);
			}
			items.addAll(itlist);

			for (int y = 0; y < passes.length; y++) {
				String passType = passes[y];
				checkPassType(passType);//检查过关方式
				
				int endPass = JcPassTypeUtil.getEndPassType(passType);
				int maxPass = JcPassTypeUtil.getMaxPassType(pm);
				
				
				int max = JcPassTypeUtil.getMaxPassType(passType);
				if (max <= 0) {
					throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
				}
				List<int[]> cList = CombineUtil.combine(codes.length, max);
				if (cList == null || cList.size() == 0) {
					throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
				}				
				for (int i = 0; i < cList.size(); i++) {
					int[] tmp = cList.get(i);

					List<JcItemBean[]> list = new ArrayList<JcItemBean[]>();
					JcItemBean[] first = null ;
					for (int j = 0; j < tmp.length; j++) {
						if (tmp[j] > 0) {
							JcItemBean[] jcTmp = itlist.get(j).getSubJcItem();
							if ( first == null ) {
								first = jcTmp;
							}
							list.add(jcTmp);
						}
					}

					List<List<JcItemBean>> lstOut = new ArrayList<List<JcItemBean>>();
					P1(list, first, null,lstOut);
					for (int j=0;j<lstOut.size();j++) {
						List<JcItemBean> lst = lstOut.get(j);							
						if ( !(mix && ! isMix(lst)) ) {
							JcCastCode cc = new JcCastCode();
							cc.setPlaytype(pm);
							cc.setPassType(passType);
							for (int k=0;k<lst.size();k++) {								
								cc.addItemBean(lst.get(k));
								if ( pm == JcItemCodeUtil.HH) {
									maxPass = Math.min(maxPass, JcPassTypeUtil.getMaxPassType(lst.get(k).getPlayType()));
								}
							}
							money += cc.getBettingnum();
							gcc.putCast(cc);
							
						}
					}
				}
				
				if ( pm == JcItemCodeUtil.HH) {
					if ( endPass > maxPass ) {
						throw new CodeFormatException(5, " 过关方式不正确 必须是(2到" + maxPass + "串之间)", passType);
					}
				}

			}
			itlist.clear();
		}

		if (money == 0) {
			throw new CodeFormatException(1, "注数不能为零", code);
		}
		
		gcc.setSourceCode(code);
		gcc.setCastMethod(cm);
		gcc.setPlayMethod(pm);
		gcc.setCastMoney(2 * money);
		gcc.setCombineNum(gcc.getCast().size());
		gcc.setMatchID(matches);
		gcc.putItems(items);

		return gcc;
	}

	private final boolean isMix(List<JcItemBean> lst) {
		boolean bln = false ;
		int play = -1;
		for (int i=0;i<lst.size();i++) {
			
			if ( play == -1 ) {
				play = lst.get(i).getPlayType(); 
			} else {
				if ( play != lst.get(i).getPlayType()) {
					bln = true ;
					break ;
				}
			}
		}
		return bln ;
	}
	
	
	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		return null;
	}
}