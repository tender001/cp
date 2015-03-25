package com.caipiao.split;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;
import com.util.combine.CombineBase;

public class GameSplit_01 extends GameSplit {
	private static HashMap<String, Integer> maps = new HashMap<String, Integer>();
	static{
		//单复式 篮球号码对应的最大红球个数
		maps.put("16",11);
		maps.put("15",11);
		maps.put("14",11);
		maps.put("13",11);
		maps.put("12",11);
		maps.put("11",11);
		maps.put("10",12);
		maps.put("9",12);
		maps.put("8",12);
		maps.put("7",12);
		maps.put("6",12);
		maps.put("5",13);
		maps.put("4",13);
		maps.put("3",14);
		maps.put("2",14);
		maps.put("1",16);
		//胆拖 篮球_胆对应的最大拖球数量
		maps.put("1_1",16);
		maps.put("1_2",16);
		maps.put("1_3",16);
		maps.put("1_4",16);
		maps.put("1_5",16);
		maps.put("2_1",16);
		maps.put("2_2",16);
		maps.put("2_3",16);
		maps.put("2_4",16);
		maps.put("2_5",16);
		maps.put("3_1",15);
		maps.put("3_2",16);
		maps.put("3_3",16);
		maps.put("3_4",16);
		maps.put("3_5",16);
		maps.put("4_1",14);
		maps.put("4_2",16);
		maps.put("4_3",16);
		maps.put("4_4",16);
		maps.put("4_5",16);
		maps.put("5_1",13);
		maps.put("5_2",16);
		maps.put("5_3",16);
		maps.put("5_4",16);
		maps.put("5_5",16);
		maps.put("6_1",13);
		maps.put("6_2",15);
		maps.put("6_3",16);
		maps.put("6_4",16);
		maps.put("6_5",16);
		maps.put("7_1",13);
		maps.put("7_2",15);
		maps.put("7_3",16);
		maps.put("7_4",16);
		maps.put("7_5",16);
		maps.put("8_1",12);
		maps.put("8_2",14);
		maps.put("8_3",16);
		maps.put("8_4",16);
		maps.put("8_5",16);
		maps.put("9_1",12);
		maps.put("9_2",14);
		maps.put("9_3",16);
		maps.put("9_4",16);
		maps.put("9_5",16);
		maps.put("10_1",12);
		maps.put("10_2",13);
		maps.put("10_3",16);
		maps.put("10_4",16);
		maps.put("10_5",16);
		maps.put("11_1",12);
		maps.put("11_2",13);
		maps.put("11_3",16);
		maps.put("11_4",16);
		maps.put("11_5",16);
		maps.put("12_1",12);
		maps.put("12_2",13);
		maps.put("12_3",16);
		maps.put("12_4",16);
		maps.put("12_5",16);
		maps.put("13_1",11);
		maps.put("13_2",13);
		maps.put("13_3",16);
		maps.put("13_4",16);
		maps.put("13_5",16);
		maps.put("14_1",11);
		maps.put("14_2",12);
		maps.put("14_3",16);
		maps.put("14_4",16);
		maps.put("14_5",16);
		maps.put("15_1",11);
		maps.put("15_2",12);
		maps.put("15_3",16);
		maps.put("15_4",16);
		maps.put("15_5",16);
		maps.put("16_1",11);
		maps.put("16_2",12);
		maps.put("16_3",16);
		maps.put("16_4",16);
		maps.put("16_5",16);
	}
	
	@Override
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("01");
		GameCastCode gcc = null;
		try {
			gcc = plugin.parseGameCastCode(code);
			
			if(gcc.getCastMoney() > 20000){//大复式拆分
				
				if (gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO) {// 胆拖
					int dlen = Long.bitCount(gcc.getFirst());//胆球数量
					
					int blen = Long.bitCount(gcc.getThird());//篮球数量
					
					String key = blen + "_" + dlen;
					int max = maps.get(key);
					
					String dan = PluginUtil.longToString(gcc.getFirst());//胆球
					String blue = PluginUtil.longToString(gcc.getThird());//篮球
					
					String tmp = PluginUtil.longToString(gcc.getSecond());
					String [] tuos = PluginUtil.splitter(tmp, ",");//拖球
					
					final List<String> list = new ArrayList<String>();
					split(tuos, list, null, max, dlen);
					
					StringBuilder sb = new StringBuilder();
					for(int i = 0; i < list.size(); i++){
						String _red = list.get(i);
						String tc = "";
						if(_red.indexOf("$") == -1){
							tc = dan + "$" + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":" + gcc.getCastMethod();
						}else{
							tc = dan + "," + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":" + gcc.getCastMethod();
						}
						sb.append(getSplitCode(tc));
						if(i != list.size() - 1){
							sb.append(";");
						}
					}
					
					code = sb.toString();
				} else if (gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_SINGLE || gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_MULTI) {// 单复式
					
					String blue = PluginUtil.longToString(gcc.getThird());//篮球
					int blen = Long.bitCount(gcc.getThird());
					String key = "" + blen;
					int max = maps.get(key);
					
					String red = PluginUtil.longToString(gcc.getFirst());
					String [] reds = PluginUtil.splitter(red, ",");//红球
					
					List<String> list = new ArrayList<String>();
					split(reds, list, blue, max, 0);
					
					StringBuilder sb = new StringBuilder();
					for(int i = 0; i < list.size(); i++){
						String tc = list.get(i);
						sb.append(getSplitCode(tc));
						if(i != list.size() - 1){
							sb.append(";");
						}
					}
					code = sb.toString();
				}
			}
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
		return code;
	}
	
	private void split(String [] reds, final List<String> lst, final String blue, int max, final int num){
		int rlen = reds.length;
		if(rlen <= max){
			lst.add(merge(reds, null, blue, num));
		}else{
			int len = rlen - max;
			final String [] now = new String[max];
			System.arraycopy(reds, len, now, 0, max);
			final String [] tmp = new String[len];
			System.arraycopy(reds, 0, tmp, 0, tmp.length);
			
			for(int i = 0; i <= 6-num; i++){
				new CombineBase<String>(tmp, i) {
					@Override
					public void sequence(List<String> list) {
						String [] tarr = new String[list.size()];
						list.toArray(tarr);
						lst.add(merge(tarr, now, blue, num));
					}
				};
			}
		}
	}
	
	private String merge(String [] dan, String [] tuo, String blue, int num){
		int dnum = dan.length;
		boolean isdrag = false;
		StringBuilder sb = new StringBuilder();
		if(dnum > 0){
			for(int i = 0; i < dan.length; i++){
				sb.append(dan[i]);
				if(i != dan.length - 1){
					sb.append(",");
				}
			}
		}
		
		if(dnum > 0 && dnum != 6-num && (tuo != null && tuo.length > 0)){
			sb.append("$");
			isdrag = true;
		}
		
		if(dnum != 6-num && tuo != null && tuo.length > 0){
			for(int i = 0; i < tuo.length; i++){
				sb.append(tuo[i]);
				if(i != tuo.length - 1){
					sb.append(",");
				}
			}
		}
		
		if(blue != null){
			sb.append("|").append(blue);
			
			if(isdrag){
				sb.append(":").append("1").append(":").append(GameCastMethodDef.CASTTYPE_DANTUO);
			}else{
				sb.append(":").append("1").append(":").append(GameCastMethodDef.CASTTYPE_MULTI);
			}
		}
		return sb.toString();
	}
}
