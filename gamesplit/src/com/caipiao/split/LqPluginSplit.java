package com.caipiao.split;

import java.util.List;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.lqutil.LqCastCode;
import com.caipiao.plugin.sturct.GameCastCode;

public class LqPluginSplit extends GameSplit{
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = null;
		StringBuffer sb = new StringBuffer();
		if(code.startsWith("HH|")){
			plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("71");
			GameCastCode gcc = plugin.parseGameCastCode(code);
			List<Object> list = gcc.getCast();
			for(Object obj : list){
				LqCastCode cast = (LqCastCode) obj;
				sb.append(cast.toBillCode());
				sb.append(";");
			}
		}else{
			if(code.startsWith("SF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("94");
			} else if(code.startsWith("RFSF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("95");
			}  else if(code.startsWith("SFC|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("96");
			}  else if(code.startsWith("DXF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("97");
			} 
			
			GameCastCode gcc = plugin.parseGameCastCode(code);
			List<Object> list = gcc.getCast();
			for(Object obj : list){
				LqCastCode cast = (LqCastCode) obj;
				sb.append(cast.toBillCode()).append(";");
			}
		}
		String rcode = sb.toString();
		if(rcode.endsWith(";")){
			rcode = rcode.substring(0, rcode.lastIndexOf(";"));
		}
		return rcode;
	}
	
	public static void main(String[] args) throws Exception {
		GameSplit split = new LqPluginSplit();
		String code = "HH|121210301>SF=3/0+RFSF=3/0$121210302>RFSF=3/0+SFC=11/12,121210303>SFC=11/12+DXF=3/0,121210304>SF=3/0+DXF=3/0,121210305>SF=3/0+DXF=3/0|2*1,3*1";
//		String code = "SF|110505001=0,110505002=0,110505003=0,110505004=0,110505005=0,110505006=0,110505007=0|5*1,6*1,7*1";
		String s = split.getSplitCode(code);
		System.out.println(s.replaceAll(";", "\n"));
	}
}
