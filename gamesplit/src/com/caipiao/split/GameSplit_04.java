package com.caipiao.split;

import java.util.ArrayList;
import java.util.List;
import com.caipiao.plugin.GamePlugin_04;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameCastCode;
import com.util.combine.CombineSplit;

public class GameSplit_04 extends GameSplit {

	@Override
	public String getSplitCode(String code) throws Exception {
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("04");
		final GameCastCode gcc;
		try {
			gcc = plugin.parseGameCastCode(code);
			if(gcc.getCastMoney() == 2){
				return code;
			}
			
			if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_HESHU){//和值
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
			}else if(gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_SINGLE || gcc.getCastMethod() == GameCastMethodDef.CASTTYPE_MULTI){//单复式
				if(gcc.getPlayMethod() == GamePlugin_04.PM_ONESTAR){//一星
					String tmp = PluginUtil.longToStringNoPad(gcc.getFirst() >> 40);
					String [] cs = PluginUtil.splitter(tmp, ",");
					StringBuffer sb = new StringBuffer();
					for(int i = 0; i < cs.length; i++){
						sb.append(cs[i]).append(":").append(gcc.getPlayMethod()).append(":").append(gcc.getCastMethod()).append(";");
					}
					code = sb.toString();
					if(code.endsWith(";")){
						code = code.substring(0, code.lastIndexOf(";"));
					}
				}else if(gcc.getPlayMethod() == GamePlugin_04.PM_FIVETONG){//五星通选
					int len = 5;
					List<String[]> list = new ArrayList<String[]>();
					for(int i = 0; i < len; i++){
						long l = (gcc.getFirst() & (0x3FFL << (i * 10))) >> (i * 10);
						String tmp = getSourceEx(l, 1, ",");
						String [] cs = PluginUtil.splitter(tmp, ",");
						list.add(cs);
					}
					final StringBuilder sb = new StringBuilder();
					new CombineSplit<String>(list) {
						@Override
						public void sequence(List<String> lst) {
							for(int i = 0; i < lst.size(); i++){
								sb.append(lst.get(i));
								if(i != lst.size() - 1){
									sb.append(",");
								}
							}
							sb.append(":").append(gcc.getPlayMethod()).append(":").append(gcc.getCastMethod()).append(";");
						}
					};
					code = sb.toString();
					if(code.endsWith(";")){
						code = code.substring(0, code.lastIndexOf(";"));
					}
				}
			}
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
		return code;
	}
}
