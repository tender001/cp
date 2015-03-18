package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.GamePlugin_jc;
import com.caipiao.plugin.jcutil.JcItemCodeUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 猜比分
 * @author chenzhurong
 * CBF|120321008=2:1/1:1/1:2,120321011=2:1/1:1/1:2,120321014=2:1/1:1/1:2|3*4
 */

public class GamePlugin_91 extends GamePlugin_jc {

	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
//		if(end < 2 || end > 4){
		if(end < 1 || end > 4){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(2到4串之间) end=" + end, passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("cbf") ) {
			return JcItemCodeUtil.CBF;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(CBF|号码|过关方式)", prefix);
		}
	}

	public String toPrintCode(GameCastCode gcc) {
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes,int muli) throws Exception {
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
			String cc = PluginUtil.replaceString(ccs[1], "/", "");//310
			cc = PluginUtil.replaceString(cc, ":", "");//310
			
			maps.put("$" + i + "_week", weekNo+"");
			maps.put("$" + i + "_nums", ccs[0].substring(ccs[0].length()-3));
			maps.put("$" + i + "_code", cc);
		}
		
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");
		
		return maps;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_91 plugin = new GamePlugin_91();
		try {

//			String scode = "CBF|120321008=2:1/1:1/1:2,120321011=2:1/1:1/1:2,120321014=2:1/1:1/1:2|3*4";
			
			String scode = "CBF|120321008=2:1/1:1/1:2|1*1";
			GameCastCode gcc = plugin.parseGameCastCode(scode);
			System.out.println(gcc.getCastMoney());
			
			plugin.keyBoardParser(scode, 1);
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
	}
}
