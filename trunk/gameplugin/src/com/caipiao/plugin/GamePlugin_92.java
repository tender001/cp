package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.GamePlugin_jc;
import com.caipiao.plugin.jcutil.JcItemCodeUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 半全场
 * @author chenzhurong
 * BQC|120321008=1-0/0-0,120321015=1-0/0-0,120321024=3-3/1-3,120321029=1-0/0-0|4*1
 */
public class GamePlugin_92 extends GamePlugin_jc {

	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
		if(end < 1 || end > 4){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到4串之间)", passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("bqc") ) {
			return JcItemCodeUtil.BQC;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(BQC|号码|过关方式)", prefix);
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
			cc = PluginUtil.replaceString(cc, "-", "");//310
			
			maps.put("$" + i + "_week", weekNo+"");
			maps.put("$" + i + "_nums", ccs[0].substring(ccs[0].length()-3));
			maps.put("$" + i + "_code", cc);
		}
		
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");

		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		String code = "BQC|120321008=1-0/0-0,120321015=1-0/0-0,120321024=3-3/1-3,120321029=1-0/0-0|4*1";
			
		GamePlugin_92 obj = new GamePlugin_92();
		obj.keyBoardParser(code,1);
	}
}
