package com.caipiao.plugin;

import java.io.File;
import java.io.FileInputStream;

import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.util.MathUtil;
import com.mina.rbc.util.StringUtil;

public class TestMain {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		GamePlugin_81 p = new GamePlugin_81();
		
//		File file = new File("c:\\temp\\81_2013030.txt");
//		FileInputStream fin = new FileInputStream(file);
//		byte[] bb = new byte[(int)file.length()];
//		fin.read(bb);
//		fin.close();
//		fin = null ;
//		
//		String s = new String(bb);
//		String[] ss = StringUtil.splitter(s, "\r\n");
//		for (int i=0;i<ss.length;i++) {
//			String[] sss = StringUtil.splitter(ss[i].trim(), "\t");
//			GameCastCode[] gccs = p.parseGameCastCodes(sss[1]);
//			int money = 0;
//			for (int j=0;j<gccs.length;j++) {
//				money += gccs[j].getCastMoney();
//			}
////			System.out.println(sss[0].trim() + "\t" + money + "\t" + sss[2].trim() + "\t" + (MathUtil.toDouble(sss[2].trim()) - money));
//			String sql = "update tb_cast_list_81 set imoney = imoney - " + (MathUtil.toDouble(sss[2].trim()) - money) + " where icastid = " + sss[0].trim() + ";";
//			System.out.println(sql);
//		}
		
		File file = new File("c:\\temp\\abc.txt");
		FileInputStream fin = new FileInputStream(file);
		byte[] bb = new byte[(int)file.length()];
		fin.read(bb);
		fin.close();
		fin = null ;
		
		String s = new String(bb);
		String[] ss = StringUtil.splitter(s, "\r\n");
		for (int i=0;i<ss.length;i++) {
			String[] sss = StringUtil.splitter(ss[i].trim(), "\t");
			GameCastCode[] gccs = p.parseGameCastCodes(sss[3]);
			int money = 0;
			for (int j=0;j<gccs.length;j++) {
				money += gccs[j].getCastMoney();
			}
//			System.out.println(sss[0].trim() + "\t" + money + "\t" + sss[2].trim() + "\t" + (MathUtil.toDouble(sss[2].trim()) - money));
//			String sql = "update tb_cast_list_81 set imoney = imoney - " + (MathUtil.toDouble(sss[4].trim()) - money) + " where icastid = " + sss[0].trim() + ";";
			
			
			
			
			String sql = "update tb_cast_81 set itmoney = itmoney - " + (MathUtil.toDouble(sss[4].trim()) - money) + " where cbatchid = '" + sss[1].trim() + "';";
			System.out.println(sql);
		}
		
	}

}
