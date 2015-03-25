package com.caipiao.split;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.caipiao.plugin.GamePlugin_50;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;
import com.util.combine.CombineBase;

public class GameSplit_50 extends GameSplit {
	
	private static HashMap<String, Integer> maps = new HashMap<String, Integer>();
	static{
		maps.put("0_12_0",9);
		maps.put("0_12_1",9);
		maps.put("0_12_2",10);
		maps.put("0_12_3",17);
		maps.put("0_12_4",31);
		maps.put("0_11_0",9);
		maps.put("0_11_1",9);
		maps.put("0_11_2",11);
		maps.put("0_11_3",19);
		maps.put("0_11_4",31);
		maps.put("0_10_0",9);
		maps.put("0_10_1",10);
		maps.put("0_10_2",12);
		maps.put("0_10_3",21);
		maps.put("0_10_4",31);
		maps.put("0_9_0",10);
		maps.put("0_9_1",10);
		maps.put("0_9_2",12);
		maps.put("0_9_3",24);
		maps.put("0_9_4",31);
		maps.put("0_8_0",10);
		maps.put("0_8_1",11);
		maps.put("0_8_2",13);
		maps.put("0_8_3",27);
		maps.put("0_8_4",31);
		maps.put("0_7_0",11);
		maps.put("0_7_1",11);
		maps.put("0_7_2",15);
		maps.put("0_7_3",31);
		maps.put("0_7_4",31);
		maps.put("0_6_0",11);
		maps.put("0_6_1",12);
		maps.put("0_6_2",16);
		maps.put("0_6_3",32);
		maps.put("0_6_4",31);
		maps.put("0_5_0",12);
		maps.put("0_5_1",13);
		maps.put("0_5_2",19);
		maps.put("0_5_3",32);
		maps.put("0_5_4",31);
		maps.put("0_4_0",13);
		maps.put("0_4_1",15);
		maps.put("0_4_2",22);
		maps.put("0_4_3",32);
		maps.put("0_4_4",31);
		maps.put("0_3_0",15);
		maps.put("0_3_1",18);
		maps.put("0_3_2",28);
		maps.put("0_3_3",32);
		maps.put("0_3_4",31);
		maps.put("0_2_0",18);
		maps.put("0_2_1",23);
		maps.put("0_2_2",33);
		maps.put("0_2_3",32);
		maps.put("0_2_4",31);
		maps.put("1_11_0",12);
		maps.put("1_11_1",13);
		maps.put("1_11_2",18);
		maps.put("1_11_3",32);
		maps.put("1_11_4",31);
		maps.put("1_10_0",12);
		maps.put("1_10_1",13);
		maps.put("1_10_2",19);
		maps.put("1_10_3",32);
		maps.put("1_10_4",31);
		maps.put("1_9_0",12);
		maps.put("1_9_1",14);
		maps.put("1_9_2",19);
		maps.put("1_9_3",32);
		maps.put("1_9_4",31);
		maps.put("1_8_0",12);
		maps.put("1_8_1",14);
		maps.put("1_8_2",20);
		maps.put("1_8_3",32);
		maps.put("1_8_4",31);
		maps.put("1_7_0",13);
		maps.put("1_7_1",15);
		maps.put("1_7_2",21);
		maps.put("1_7_3",32);
		maps.put("1_7_4",31);
		maps.put("1_6_0",13);
		maps.put("1_6_1",15);
		maps.put("1_6_2",22);
		maps.put("1_6_3",32);
		maps.put("1_6_4",31);
		maps.put("1_5_0",13);
		maps.put("1_5_1",16);
		maps.put("1_5_2",23);
		maps.put("1_5_3",32);
		maps.put("1_5_4",31);
		maps.put("1_4_0",14);
		maps.put("1_4_1",17);
		maps.put("1_4_2",25);
		maps.put("1_4_3",32);
		maps.put("1_4_4",31);
		maps.put("1_3_0",15);
		maps.put("1_3_1",18);
		maps.put("1_3_2",28);
		maps.put("1_3_3",32);
		maps.put("1_3_4",31);
		maps.put("1_2_0",16);
		maps.put("1_2_1",20);
		maps.put("1_2_2",32);
		maps.put("1_2_3",32);
		maps.put("1_2_4",31);
		maps.put("1_1_0",18);
		maps.put("1_1_1",23);
		maps.put("1_1_2",33);
		maps.put("1_1_3",32);
		maps.put("1_1_4",31);
	}

	@Override
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("50");
		GameCastCode gcc = null;
		try {
			gcc = plugin.parseGameCastCode(code);
			if(gcc.getCastMoney() > 20000){
				if(gcc.getPlayMethod() != GamePlugin_50.PM_SXL){
					int rd = Long.bitCount(gcc.getFirst());
					int rt = Long.bitCount(gcc.getSecond());
					int bd = Long.bitCount(gcc.getThird());
					int bt = Long.bitCount(gcc.getFour());
					
					if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO){
						String blue = "";
						StringBuilder sb = new StringBuilder();
						if(bt > 0){//后区胆拖
							blue = PluginUtil.longToString(gcc.getThird()) + "$" + PluginUtil.longToString(gcc.getFour());
							String dan = PluginUtil.longToString(gcc.getFirst());
							if(rt > 0){//前区胆拖
								
								String key = bd + "_" + bt + "_" + rd;
								int max = maps.get(key);
								
								String tuo = PluginUtil.longToString(gcc.getSecond());
								String [] tuos = PluginUtil.splitter(tuo, ",");//拖球
								
								List<String> list = new ArrayList<String>();
								split(tuos, list, null, max, rd);
								
								for(int i = 0; i < list.size(); i++){
									String _red = list.get(i);
									String tc = "";
									if(_red.indexOf("$") == -1){
										tc = dan + "$" + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":5";
									}else{
										tc = dan + "," + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":5";
									}
									sb.append(getSplitCode(tc));
									if(i != list.size() - 1){
										sb.append(";");
									}
								}
							}else{
								
								String key = bd + "_" + bt + "_0";
								int max = maps.get(key);
								
								String [] dans = PluginUtil.splitter(dan, ",");
								List<String> list = new ArrayList<String>();
								split(dans, list, blue, max, 0);
								
								for(int i = 0; i < list.size(); i++){
									String tc = list.get(i);
									sb.append(getSplitCode(tc));
									if(i != list.size() - 1){
										sb.append(";");
									}
								}
							}
						}else{
							String dan = PluginUtil.longToString(gcc.getFirst());
							blue = PluginUtil.longToString(gcc.getThird());
							if(rt > 0){
								String tuo = PluginUtil.longToString(gcc.getSecond());
								String [] tuos = PluginUtil.splitter(tuo, ",");//拖球
								
								String key = "0_" + bd + "_" + rd;
								int max = maps.get(key);
								
								List<String> list = new ArrayList<String>();
								split(tuos, list, null, max, rd);
								
								for(int i = 0; i < list.size(); i++){
									String _red = list.get(i);
									String tc = "";
									if(_red.indexOf("$") == -1){
										tc = dan + "$" + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":5";
									}else{
										tc = dan + "," + _red + "|" + blue + ":" + gcc.getPlayMethod() + ":5";
									}
									sb.append(getSplitCode(tc));
									if(i != list.size() - 1){
										sb.append(";");
									}
								}
							}else{
								//nothing
							}
						}
						code = sb.toString();
					}else if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_SINGLE || gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_MULTI){
						StringBuilder sb = new StringBuilder();
						String blue = PluginUtil.longToString(gcc.getThird());
						String dan = PluginUtil.longToString(gcc.getFirst());
						String [] dans = PluginUtil.splitter(dan, ",");//拖球
						
						String key = "0_" + bd + "_0";
						int max = maps.get(key);
						
						List<String> list = new ArrayList<String>();
						split(dans, list, blue, max, 0);
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
			
			for(int i = 0; i <= 5-num; i++){
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
		StringBuilder sb = new StringBuilder();
		if(dnum > 0){
			for(int i = 0; i < dan.length; i++){
				sb.append(dan[i]);
				if(i != dan.length - 1){
					sb.append(",");
				}
			}
		}
		
		if(dnum > 0 && dnum != 5-num && (tuo != null && tuo.length > 0)){
			sb.append("$");
		}
		
		if(dnum != 5-num && tuo != null && tuo.length > 0){
			for(int i = 0; i < tuo.length; i++){
				sb.append(tuo[i]);
				if(i != tuo.length - 1){
					sb.append(",");
				}
			}
		}
		
		if(blue != null){
			sb.append("|").append(blue);
			sb.append(":").append("1").append(":");

			String c = sb.toString();
			if(c.indexOf("$") == -1){
				sb.append(GameCastMethodDef.CASTTYPE_MULTI);
			}else{
				sb.append(GameCastMethodDef.CASTTYPE_DANTUO);
			}
		}
		return sb.toString();
	}
}
