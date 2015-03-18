package com.caipiao.plugin;

import java.util.HashMap;
import java.util.List;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.jcutil.GamePlugin_jc;
import com.caipiao.plugin.jcutil.JcCastCode;
import com.caipiao.plugin.jcutil.JcItemBean;
import com.caipiao.plugin.jcutil.JcItemCodeUtil;
import com.caipiao.plugin.jcutil.JcPassTypeUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;

public class GamePlugin_70 extends GamePlugin_jc {

	public void checkPassType(String passtype) throws CodeFormatException {
		int end = JcPassTypeUtil.getEndPassType(passtype);
		if(end < 1 || end > 8){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到8串之间) end=" + end, passtype);
		}
	}
	
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("hh") ) {
			return JcItemCodeUtil.HH;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(HH|号码|过关方式)", prefix);
		}
	}
	
	@Override
	public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException {
		return null;
	}

	@Override
	public int getRealGrade(int awardgrade) {
		return 0;
	}


	
	@Override
	public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum) {
		return null;
	}

	@Override
	public String toPrintCode(GameCastCode gcc) {
		return null;
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
			
			if ( tt[1].equalsIgnoreCase("SPF")) {
				maps.put("$" + i + "_prefix", "51");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");// 310
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("CBF")) {
				maps.put("$" + i + "_prefix", "52");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");//310
				cc = PluginUtil.replaceString(cc, ":", "");//310
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("JQS")) {
				maps.put("$" + i + "_prefix", "53");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");//310
				maps.put("$" + i + "_code", cc);
				
			} else if ( tt[1].equalsIgnoreCase("BQC")) {
				maps.put("$" + i + "_prefix", "54");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");//310
				cc = PluginUtil.replaceString(cc, "-", "");//310
				maps.put("$" + i + "_code", cc);
			} else if ( tt[1].equalsIgnoreCase("RSPF")) {
				maps.put("$" + i + "_prefix", "56");
				String cc = PluginUtil.replaceString(ccs[1], "/", "");// 310
				maps.put("$" + i + "_code", cc);
				
			}
		}

		maps.put("$mulit", muli + "");
		maps.put("$money", money + "");

		return maps;
	}

	public static void main(String[] args) throws Exception {
		GamePluginAdapter plugin = new GamePlugin_70();
		GameCastCode gcc = null ;
		try {
//			GameCastCode gcc = plugin.parseGameCastCode("HH|121210301>SPF=3/0+JQS=3/0$121210302>JQS=3/0+CBF=1:1/1:2,121210303>CBF=1:1/1:2+BQC=3-3/0-0,121210304>SPF=3/0+BQC=3-3/0-0,121210305>SPF=3/0+BQC=3-3/0-0|2*1,3*1|1");
//			System.out.println(gcc.getCastMoney());

//			String code = "HH|121210301>RSPF=3/0+JQS=3/0$121210302>JQS=3/0+CBF=1:1/1:2,121210303>CBF=1:1/1:2+BQC=3-3/0-0,121210304>SPF=3/0+BQC=3-3/0-0,121210305>SPF=3/0+BQC=3-3/0-0|4*1";
//			String code = "HH|130604002>RSPF=3/1/0,130604003>JQS=0,130604001>SPF=3/1+RSPF=1/0|2*1,3*1";
//			String code = "HH|121210301>SPF=3/0+JQS=3/0$121210302>JQS=3/0+CBF=1:1/1:2,121210303>CBF=1:1/1:2+BQC=3-3/0-0,121210304>SPF=3/0+BQC=3-3/0-0,121210305>SPF=3/0+BQC=3-3/0-0|2*1|1";
//			String code = "HH|130219001>SPF=3/0+JQS=3,130219002>BQC=1-1+CBF=1:0+SPF=1|2*1|1";
//			String code = "HH|121210301>SPF=3/0,121210302>JQS=3/0+SPF=3,121210303>CBF=1:1/1:2,121210304>SPF=3/0|3*1|1";
			
			String code = "HH|130604002>RSPF=3/1/0,130604003>JQS=0,130604004>SPF=3/1+RSPF=1/0,130604005>SPF=3/1+RSPF=1/0,130604006>SPF=3/1+RSPF=1/0|5*10";
			
			gcc = plugin.parseGameCastCode(code);
			System.out.println(gcc.getCastMoney());
			System.out.println(gcc.getMatchID());
			List<Object> list = gcc.getCast();
			for (Object obj : list) {
				JcCastCode cast = (JcCastCode) obj;
				System.out.println(cast.toBillCode());
				
				List<JcItemBean> lst = cast.getJcItemList();
				for (int j=0;j<lst.size();j++) {
//					System.out.println("pt=" + lst.get(j).getPlayType() + " tid=" + lst.get(j).getItemid());
				}
			}
			
			
			String s = "HH|121210301>RSPF=3/0,121210302>JQS=3/0,121210303>CBF=1:1/1:2,121210304>SPF=3/0|4*1";
			HashMap<String,String> maps = plugin.keyBoardParser(s, 1);
			System.out.println(maps.toString());
			
			
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
