package com.caipiao.plugin;

import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.lqutil.GamePlugin_lq;
import com.caipiao.plugin.lqutil.LqCastCode;
import com.caipiao.plugin.lqutil.LqItemCodeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

public class GamePlugin_71 extends GamePlugin_lq {


	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
		if(end < 2 || end > 8){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(2到8串之间) end=" + end, passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("hh") ) {
			return LqItemCodeUtil.HH;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(HH|号码|过关方式)", prefix);
		}
	}
	
	

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		HashMap<String, String> maps = new HashMap<String, String>();

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

		maps.put("$nums", ss.length + "");
		for (int i = 0; i < ss.length; i++) {
			String[] ccs = PluginUtil.splitter(ss[i], "=");			
			String[] tt = PluginUtil.splitter(ccs[0], ">");

			int weekNo = JcPassTypeUtil.getWeekNo(tt[0]);// 场次编号
			maps.put("$" + i + "_week", weekNo + "");
			maps.put("$" + i + "_nums", tt[0].substring(tt[0].length() - 3));
			
			if ( tt[1].equalsIgnoreCase("RFSF")) {//让分胜负
				maps.put("$" + i + "_prefix", "61");
				String  cc = PluginUtil.replaceString(ccs[1], "3", "1");// 30
				cc = PluginUtil.replaceString(cc, "0", "2");// 30
				cc = PluginUtil.replaceString(cc, "/", "");// 30
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("SF")) {//胜负
				maps.put("$" + i + "_prefix", "62");
				String  cc = PluginUtil.replaceString(ccs[1], "3", "1");// 30
				cc = PluginUtil.replaceString(cc, "0", "2");// 30
				cc = PluginUtil.replaceString(cc, "/", "");// 30
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("SFC")) {//胜分差
				maps.put("$" + i + "_prefix", "63");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("DXF")) {//大小分
				maps.put("$" + i + "_prefix", "64");
				String  cc = PluginUtil.replaceString(ccs[1], "3", "1");// 30
				cc = PluginUtil.replaceString(cc, "0", "2");// 30
				cc = PluginUtil.replaceString(cc, "/", "");// 30
				maps.put("$" + i + "_code", cc);
			}
		}

		maps.put("$mulit", muli + "");
		maps.put("$money", money + "");

		return maps;
	}
	
	public static void main(String[] args) throws Exception {
		GamePluginAdapter plugin = new GamePlugin_71();
		try {
			GameCastCode gcc = plugin.parseGameCastCode("HH|121210301>SF=3/0+RFSF=3/0$121210302>RFSF=3/0+SFC=11/12,121210303>SFC=11/12+DXF=3/0,121210304>SF=3/0+DXF=3/0,121210305>SF=3/0+DXF=3/0|2*1,3*1|1");
			System.out.println(gcc.getCastMoney());
			List<Object> list = gcc.getCast();
			for(Object obj : list){
				LqCastCode cast = (LqCastCode) obj;
				System.out.println(cast.toBillCode());
			}
			gcc = plugin.parseGameCastCode("HH|121210301>SF=3/0+RFSF=3/0,121210302>RFSF=3/0+SFC=11/12,121210303>SFC=11/12+DXF=3/0,121210304>SF=3/0+DXF=3/0,121210305>SF=3/0+DXF=3/0|3*1,4*1");
			System.out.println(gcc.getCastMoney());
			
			String s = "HH|130219301>SF=0,130219304>DXF=3|2*1";
			HashMap<String,String> maps = plugin.keyBoardParser(s, 1);
			System.out.println(maps.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
