package com.caipiao.split;

import java.util.List;
import com.caipiao.plugin.GamePlugin_54;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;
import com.util.combine.CombineBase;

public class GameSplit_54 extends GameSplit {
	
	@Override
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("54");
		GameCastCode gcc = null;
		try {
			gcc = plugin.parseGameCastCode(code);
			if (gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_SINGLE || gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_MULTI) {
				if(gcc.getPlayMethod() == GamePlugin_54.R8){
					if(gcc.getCastMoney() > 2){
						String tmp = getSourceEx(gcc.getFirst(), 0, ",");
						String [] ts = PluginUtil.splitter(tmp, ",");
						final StringBuffer sb = new StringBuffer();
						new CombineBase<String>(ts, 8) {
							@Override
							public void sequence(List<String> lst) {
								StringBuffer _sb = new StringBuffer();
								int len = lst.size();
								for(int i = 0; i < len; i++){
									_sb.append(lst.get(i));
									if(i != len - 1){
										_sb.append(",");
									}
								}
								_sb.append(":8:1");
								sb.append(_sb).append(";");
							}
						};
						code = sb.toString();
					}
				}
			}else if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO){
				if(gcc.getPlayMethod() == GamePlugin_54.R8){
					final String dan = getSourceEx(gcc.getFirst(), 0, ",");
					String tuo = getSourceEx(gcc.getSecond(), 0, ",");
					String [] ts = PluginUtil.splitter(tuo, ",");
					final StringBuffer sb = new StringBuffer();
					new CombineBase<String>(ts, 8 - Long.bitCount(gcc.getFirst())) {
						@Override
						public void sequence(List<String> lst) {
							StringBuffer _sb = new StringBuffer();
							int len = lst.size();
							for(int i = 0; i < len; i++){
								_sb.append(lst.get(i));
								if(i != len - 1){
									_sb.append(",");
								}
							}
							_sb.append(":8:1");
							sb.append(dan).append(",").append(_sb).append(";");
						}
					};
					code = sb.toString();
				}
			}
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
		return code;
	}
}
