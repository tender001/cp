package com.caipiao.plugin;

import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.GamePlugin_jc;
import com.caipiao.plugin.jcutil.JcCastCode;
import com.caipiao.plugin.jcutil.JcItemCodeUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

/**
 * 竟彩游戏插件 胜平负
 * 
 * @author chenzhurong
 * 
 */
public class GamePlugin_72 extends GamePlugin_jc {

	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
		if(end < 1 || end > 8){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到8串之间)", passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("rspf") ) {
			return JcItemCodeUtil.RSPF;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(RSPF|号码|过关方式)", prefix);
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
			String cc = PluginUtil.replaceString(ccs[1], "/", "|");//310
			
			maps.put("$" + i + "_week", weekNo+"");
			maps.put("$" + i + "_nums", ccs[0].substring(ccs[0].length()-3));
			maps.put("$" + i + "_code", cc);
		}

		maps.put("$mulit", muli+"");
		maps.put("$money", money+"");
		
		return maps;
	}

	public static void main(String[] args) throws Exception {
		GamePlugin_72 plugin = new GamePlugin_72();
		try {			
			//胜平负
//			GameCastCode gcc = plugin.parseGameCastCode("20110830001=3/1/0,20110830002=3/1/0,20110830003=3/1/0|3*4:90:1");
//			System.out.println(gcc.getCastMoney());

			//猜比分
//			GameCastCode gcc = plugin.parseGameCastCode("110505001=3-0/1-2,110505002=0-0,110505003=1-0,110505004=2-0,110505005=3-0,110505006=0-9,110505007=0-5|6*1,5*1:91:1");
//			System.out.println(gcc.getCastMoney());

			//半全场
//			GameCastCode gcc = plugin.parseGameCastCode("110826003=1-3/0-3,110826014=1-3,110826018=3-0|3*4:92:1");
//			System.out.println(gcc.getCastMoney());

			//进球数
//			GameCastCode gcc = plugin.parseGameCastCode("110824010=1,110824011=1,110824012=1,110824013=1,110824014=1,110824015=1,110824016=1,110824017=1|8*247:90:1");
//			System.out.println(gcc.getCastMoney());

//			String scode = "SPF|110824010=3/1/0,110824011=1,110824012=1,110824013=1,110824014=1,110824015=1,110824016=1,110824017=1|8*247";
			String scode = "RSPF|130607008=1,130607024=1,130608005=1,130608006=1,130608011=1,130608021=1|5*1,6*1";
			GameCastCode gcc = plugin.parseGameCastCode(scode);
			System.out.println(gcc.getCastMoney());
			System.out.println(gcc.getCast().size());
			List<Object> list = gcc.getCast();
			for (Object obj : list) {
				JcCastCode cast = (JcCastCode) obj;
				System.out.println(cast.toBillCode());
			}
			
			plugin.keyBoardParser(scode, 1);
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
	}
}