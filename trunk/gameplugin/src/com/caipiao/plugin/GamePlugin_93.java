package com.caipiao.plugin;

import java.util.HashMap;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.GamePlugin_jc;
import com.caipiao.plugin.jcutil.JcItemCodeUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 进球数
 * @author chenzhurong
 * JQS|120321001=1/2,120321002=2/3,120321003=5|3*1
 */

public class GamePlugin_93 extends GamePlugin_jc {

	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
		if(end < 1 || end > 6){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到6串之间)", passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("jqs") ) {
			return JcItemCodeUtil.JQS;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(JQS|号码|过关方式)", prefix);
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
			
			maps.put("$" + i + "_week", weekNo+"");
			maps.put("$" + i + "_nums", ccs[0].substring(ccs[0].length()-3));
			maps.put("$" + i + "_code", cc);
		}
		
		
		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");
		
		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		String code = "JQS|120321001=1/2,120321002=2/3,120321003=5|3*1";
			
		GamePlugin_93 obj = new GamePlugin_93();
		obj.keyBoardParser(code,1);
	}
}
