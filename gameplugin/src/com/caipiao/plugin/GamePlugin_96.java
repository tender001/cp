package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.lqutil.GamePlugin_lq;
import com.caipiao.plugin.lqutil.LqItemCodeUtil;
import com.caipiao.plugin.lqutil.LqPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

//胜分差
public class GamePlugin_96 extends GamePlugin_lq {

	@Override
	public void checkPassType(String passtype) throws CodeFormatException {
		int end = LqPassTypeUtil.getEndPassType(passtype);
//		if(end < 2 || end > 4){
		if(end < 1 || end > 4){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到4串之间)", passtype);
		}
	}

	@Override
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("sfc") ) {
			return LqItemCodeUtil.SFC;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(SFC|号码|过关方式)", prefix);
		}
	}

	@Override
	public String toPrintCode(GameCastCode gcc) {
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		HashMap<String,String> maps = new HashMap<String,String>();

		GameCastCode gcc = this.parseGameCastCode(codes);
		int money = gcc.getCastMoney() * muli;

		String[] ss = PluginUtil.splitter(codes, "|");
		
		String code = ss[1];
		String mcn = ss[2];

		ss = PluginUtil.splitter(mcn, "*");
		maps.put("$m", ss[0]);
		maps.put("$n", ss[1]);
		maps.put("$gg", JcPassTypeUtil.getGuoGuanCode(mcn));

		ss = PluginUtil.splitter(code, ",");

		maps.put("$nums", ss.length+"");
		for (int i=0;i<ss.length;i++) {
			String[] ccs = PluginUtil.splitter(ss[i], "=");
			int weekNo = JcPassTypeUtil.getWeekNo(ccs[0]);//场次编号
			String cc = PluginUtil.replaceString(ccs[1], "/", "");//01 - 06 11 - 16
			cc = PluginUtil.replaceString(cc, "-", "");////01 - 06 11 - 16
			
			maps.put("$" + i + "_week", weekNo+"");
			maps.put("$" + i + "_nums", ccs[0].substring(ccs[0].length()-3));
			maps.put("$" + i + "_code", cc);
		}
		
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		return maps;
	}

}
