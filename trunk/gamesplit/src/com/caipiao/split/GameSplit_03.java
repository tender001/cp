package com.caipiao.split;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;

public class GameSplit_03 extends GameSplit {

	@Override
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("03");
		GameCastCode gcc;
		try {
			gcc = plugin.parseGameCastCode(code);
			if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_HESHU){
				String tmp = PluginUtil.longToStringNoPad(gcc.getFirst());
				String [] cs = PluginUtil.splitter(tmp, ",");
				StringBuffer sb = new StringBuffer();
				for(int i = 0; i < cs.length; i++){
					sb.append(cs[i]).append(":").append(gcc.getPlayMethod()).append(":").append(gcc.getCastMethod()).append(";");
				}
				code = sb.toString();
				if(code.endsWith(";")){
					code = code.substring(0, code.lastIndexOf(";"));
				}
			}
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
		return code;
	}

}
