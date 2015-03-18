package com.caipiao.plugin.helper;

import java.util.HashMap;

import com.caipiao.plugin.GamePlugin_01;
import com.caipiao.plugin.GamePlugin_03;
import com.caipiao.plugin.GamePlugin_04;
import com.caipiao.plugin.GamePlugin_05;
import com.caipiao.plugin.GamePlugin_07;
import com.caipiao.plugin.GamePlugin_09;
import com.caipiao.plugin.GamePlugin_10;
import com.caipiao.plugin.GamePlugin_15;
import com.caipiao.plugin.GamePlugin_20;
import com.caipiao.plugin.GamePlugin_50;
import com.caipiao.plugin.GamePlugin_51;
import com.caipiao.plugin.GamePlugin_52;
import com.caipiao.plugin.GamePlugin_53;
import com.caipiao.plugin.GamePlugin_54;
import com.caipiao.plugin.GamePlugin_55;
import com.caipiao.plugin.GamePlugin_56;
import com.caipiao.plugin.GamePlugin_58;
import com.caipiao.plugin.GamePlugin_60;
import com.caipiao.plugin.GamePlugin_70;
import com.caipiao.plugin.GamePlugin_71;
import com.caipiao.plugin.GamePlugin_72;
import com.caipiao.plugin.GamePlugin_80;
import com.caipiao.plugin.GamePlugin_81;
import com.caipiao.plugin.GamePlugin_82;
import com.caipiao.plugin.GamePlugin_83;
import com.caipiao.plugin.GamePlugin_84;
import com.caipiao.plugin.GamePlugin_85;
import com.caipiao.plugin.GamePlugin_86;
import com.caipiao.plugin.GamePlugin_87;
import com.caipiao.plugin.GamePlugin_88;
import com.caipiao.plugin.GamePlugin_89;
import com.caipiao.plugin.GamePlugin_90;
import com.caipiao.plugin.GamePlugin_91;
import com.caipiao.plugin.GamePlugin_92;
import com.caipiao.plugin.GamePlugin_93;
import com.caipiao.plugin.GamePlugin_94;
import com.caipiao.plugin.GamePlugin_95;
import com.caipiao.plugin.GamePlugin_96;
import com.caipiao.plugin.GamePlugin_97;
import com.caipiao.plugin.GamePlugin_98;
import com.caipiao.plugin.GamePlugin_99;

public class GamePluginManager {
	private static GamePluginManager pluginmanager = null;
	private HashMap<String, GamePluginAdapter> plugins = null;
	private GamePluginManager(){
		plugins = new HashMap<String, GamePluginAdapter>();
		plugins.put("01", new GamePlugin_01());
		plugins.put("03", new GamePlugin_03());
		plugins.put("04", new GamePlugin_04());
		plugins.put("05", new GamePlugin_05());
		plugins.put("07", new GamePlugin_07());
		plugins.put("09", new GamePlugin_09());
		plugins.put("10", new GamePlugin_10());
		plugins.put("15", new GamePlugin_15());
		plugins.put("20", new GamePlugin_20());
		plugins.put("50", new GamePlugin_50());
		plugins.put("51", new GamePlugin_51());
		plugins.put("52", new GamePlugin_52());
		plugins.put("53", new GamePlugin_53());
		plugins.put("54", new GamePlugin_54());
		plugins.put("55", new GamePlugin_55());
		plugins.put("56", new GamePlugin_56());
		plugins.put("58", new GamePlugin_58());
		plugins.put("60", new GamePlugin_60());
		plugins.put("70", new GamePlugin_70());
		plugins.put("71", new GamePlugin_71());
		plugins.put("72", new GamePlugin_72());
		plugins.put("80", new GamePlugin_80());
		plugins.put("81", new GamePlugin_81());
		plugins.put("82", new GamePlugin_82());
		plugins.put("83", new GamePlugin_83());
		plugins.put("84", new GamePlugin_84());
		plugins.put("85", new GamePlugin_85());
		plugins.put("86", new GamePlugin_86());
		plugins.put("87", new GamePlugin_87());
		plugins.put("88", new GamePlugin_88());
		plugins.put("89", new GamePlugin_89());
		plugins.put("90", new GamePlugin_90());
		plugins.put("91", new GamePlugin_91());
		plugins.put("92", new GamePlugin_92());
		plugins.put("93", new GamePlugin_93());
		plugins.put("94", new GamePlugin_94());
		plugins.put("95", new GamePlugin_95());
		plugins.put("96", new GamePlugin_96());
		plugins.put("97", new GamePlugin_97());
		plugins.put("98", new GamePlugin_98());
		plugins.put("99", new GamePlugin_99());
	}
	public synchronized static GamePluginManager getDefaultPluginManager(){
		if(pluginmanager == null){
			pluginmanager = new GamePluginManager();
		}
		return pluginmanager;
	}
	public GamePluginAdapter getGamePlugin(String gid){
		return plugins.get(gid);
	}
}
