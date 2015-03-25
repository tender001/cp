package com.caipiao.split;

import java.util.List;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.jcutil.JcCastCode;
import com.caipiao.plugin.sturct.GameCastCode;

public class JcPluginSplit extends GameSplit{
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = null;
		StringBuffer sb = new StringBuffer();
		if(code.startsWith("HH|")){
			plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("70");
			GameCastCode gcc = plugin.parseGameCastCode(code);
			List<Object> list = gcc.getCast();
			for(Object obj : list){
				JcCastCode cast = (JcCastCode) obj;
				sb.append(cast.toBillCode());
				sb.append(";");
			}
		}else{
			if(code.startsWith("SPF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("90");
			} else if(code.startsWith("CBF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("91");
			}  else if(code.startsWith("BQC|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("92");
			}  else if(code.startsWith("JQS|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("93");
			}  else if(code.startsWith("RSPF|")){
				plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("72");
			}
			
			GameCastCode gcc = plugin.parseGameCastCode(code);
			List<Object> list = gcc.getCast();
			for(Object obj : list){
				JcCastCode cast = (JcCastCode) obj;
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
		GameSplit split = new JcPluginSplit();
		String code = "HH|150319001>RSPF=3,150319002>SPF=3|1*1";
//		String code = "SPF|24=3/1,25=3,39=3,23=3,43=1,57=1,58=1|5*1,6*1,7*1";
		String s = split.getSplitCode(code);
		System.out.println(s.replaceAll(";", "\n"));
	}
}
