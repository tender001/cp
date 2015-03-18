package com.caipiao.plugin.bjutil;

import java.util.ArrayList;
import java.util.List;

import com.caipiao.plugin.helper.CombineUtil;
import com.caipiao.plugin.helper.PluginUtil;

public class BJCastCode { 
	private String gameID ;// 彩种
	private String guoguan; // 过关
	private List<ItemBean> list = new ArrayList<ItemBean>();

	public String getGuoguan() {
		return guoguan;
	}

	public String getGameID() {
		return gameID;
	}

	public void setGameID(String gameID) {
		this.gameID = gameID;
	}

	public void setGuoguan(String guoguan) {
		this.guoguan = guoguan;
	}

	public List<ItemBean> getItemBeans() {
		return list;
	}

	public void putItemBean(String item) {
		String[] codes = item.split(",");		
		for (int i = 0; i < codes.length; i++) {
			
			String[] cs = PluginUtil.splitter(codes[i].trim(),"=");
			String[] items = PluginUtil.splitter(cs[1].trim(),"/");
			ItemBean ib = new ItemBean();
			ib.setMatchID(cs[0].trim());
			long l = 0;
			int cc = items.length;
			if (gameID.equalsIgnoreCase("85")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("0".equals(tmp)) {
						pos = 0;
					} else if ("1".equals(tmp)) {
						pos = 1;
					} else if ("3".equals(tmp)) {
						pos = 2;
					}
//System.out.println(" 85 ------------------ " + pos);					
					l = createBingo(l,pos,"SPF",cs[0],codes[i]);					
				}
			} else if (gameID.equalsIgnoreCase("86")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("9:0".equals(tmp)) {
						pos = 15;
					} else if ("1:0".equals(tmp)) {
						pos = 16;
					} else if ("2:0".equals(tmp)) {
						pos = 17;
					} else if ("2:1".equals(tmp)) {
						pos = 18;
					} else if ("3:0".equals(tmp)) {
						pos = 19;
					} else if ("3:1".equals(tmp)) {
						pos = 20;
					} else if ("3:2".equals(tmp)) {
						pos = 21;
					} else if ("4:0".equals(tmp)) {
						pos = 22;
					} else if ("4:1".equals(tmp)) {
						pos = 23;
					} else if ("4:2".equals(tmp)) {
						pos = 24;
					} else if ("9:9".equals(tmp)) {
						pos = 25;
					} else if ("0:0".equals(tmp)) {
						pos = 26;
					} else if ("1:1".equals(tmp)) {
						pos = 27;
					} else if ("2:2".equals(tmp)) {
						pos = 28;
					} else if ("3:3".equals(tmp)) {
						pos = 29;
					} else if ("0:9".equals(tmp)) {
						pos = 30;
					} else if ("0:1".equals(tmp)) {
						pos = 31;
					} else if ("0:2".equals(tmp)) {
						pos = 32;
					} else if ("1:2".equals(tmp)) {
						pos = 33;
					} else if ("0:3".equals(tmp)) {
						pos = 34;
					} else if ("1:3".equals(tmp)) {
						pos = 35;
					} else if ("2:3".equals(tmp)) {
						pos = 36;
					} else if ("0:4".equals(tmp)) {
						pos = 37;
					} else if ("1:4".equals(tmp)) {
						pos = 38;
					} else if ("2:4".equals(tmp)) {
						pos = 39;
					}
//System.out.println(" 86 ------------------ " + pos);					
					l = createBingo(l,pos,"CBF",cs[0],codes[i]);
				}
			} else if (gameID.equalsIgnoreCase("87")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("3-3".equals(tmp)) {// 胜胜
						pos = 40;
					} else if ("3-1".equals(tmp)) {// 胜平
						pos = 41;
					} else if ("3-0".equals(tmp)) {// 胜负
						pos = 42;
					} else if ("1-3".equals(tmp)) {// 平胜
						pos = 43;
					} else if ("1-1".equals(tmp)) {// 平平
						pos = 44;
					} else if ("1-0".equals(tmp)) {// 平负
						pos = 45;
					} else if ("0-3".equals(tmp)) {// 负胜
						pos = 46;
					} else if ("0-1".equals(tmp)) {// 负平
						pos = 47;
					} else if ("0-0".equals(tmp)) {// 负负
						pos = 48;
					}
//System.out.println(" 87 ------------------ " + pos);					
					l = createBingo(l,pos,"BQC",cs[0],codes[i]);
				}
			} else if (gameID.equalsIgnoreCase("88")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("3".equals(tmp)) {// 上单(3)
						pos = 11;
					} else if ("2".equals(tmp)) {// 上双(2)
						pos = 12;
					} else if ("1".equals(tmp)) {// 下单(1)
						pos = 13;
					} else if ("0".equals(tmp)) {// 下双 (0)
						pos = 14;
					}
//System.out.println(" 88 ------------------ " + pos);					
					l = createBingo(l,pos,"SXP",cs[0],codes[i]);
				}
			} else if (gameID.equalsIgnoreCase("89")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("0".equals(tmp)) {
						pos = 3;
					} else if ("1".equals(tmp)) {
						pos = 4;
					} else if ("2".equals(tmp)) {
						pos = 5;
					} else if ("3".equals(tmp)) {
						pos = 6;
					} else if ("4".equals(tmp)) {
						pos = 7;
					} else if ("5".equals(tmp)) {
						pos = 8;
					} else if ("6".equals(tmp)) {
						pos = 9;
					} else if ("7".equals(tmp)) {
						pos = 10;
					}
//System.out.println(" 89 ------------------ " + pos);					
					l = createBingo(l,pos,"JQS",cs[0],codes[i]);
				}
			} else if (gameID.equalsIgnoreCase("84")) {
				for (int j = 0; j < items.length; j++) {
					String tmp = items[j].trim();
					int pos = -1;
					if ("0".equals(tmp)) {
						pos = 0;
					} else if ("3".equals(tmp)) {
						pos = 2;
					}
//System.out.println(" 85 ------------------ " + pos);					
					l = createBingo(l,pos,"SF",cs[0],codes[i]);					
				}
			} 
			ib.setCode(l);
			ib.setCount(cc);
			list.add(ib);
		}
	}

	private long createBingo(long l,int pos,String play,String mid,String code) {
		if ( pos < 0 ) {
			throw new RuntimeException("北单投注号码不正确  玩法=" + play + " 场次=" + mid+ " 号码=" + code);
		}
		return l | (1L << pos);
	}
	
	/**
	 * 计算或获取投注串的实际投注注数
	 * @return
	 */
	public int getBettingnum(){
		int total = 0;
		int len = list.size();
		int start = BJUtil.getStart(guoguan);
		int end = BJUtil.getEnd(guoguan);
		for(int i = start; i <= end; i++){
			List<int []> _list = CombineUtil.combine(len, i);
			for(int j = 0; j < _list.size(); j++){
				int [] tmp = _list.get(j);
				int sub = 0;
				for(int m = 0; m < tmp.length; m++){
					if(tmp[m] > 0){
						sub = (sub == 0)? 1 : sub;
						sub *= list.get(m).getCountItem();
					}
				}
				total += sub;
			}
		}
		return total;
	}
	
	public String toBillString() {
		int count = list.size();
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < count; i++) {
			sb.append(list.get(i).toBillString());
			if (i != count - 1) {
				sb.append(",");
			}
		}
		return sb.toString();
	}
}
