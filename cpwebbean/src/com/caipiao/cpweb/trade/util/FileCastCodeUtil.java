package com.caipiao.cpweb.trade.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;

import com.caipiao.cpweb.trade.TradeBean;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.util.MD5Util;

public class FileCastCodeUtil {

	public static void printInfo(String gid, String pid, String info, Logger logger) {
		logger.info("游戏=" + gid + " 期次=" + pid + "\t " + info);
	}

	public final static String getCodesFromFile(String gid, String pid, String basePath, String fileName, String play, Logger logger) throws Exception {
		int g = Integer.parseInt(gid);
		if (g >= 84 || g == 70 || g == 71 || g == 72) {
			return getCodesFromFileJQ(gid, pid, basePath, fileName, play, logger);
		} else {
			return getCodesFromFileSZ(gid, pid, basePath, fileName, play, logger);
		}
	}

	// 北单和竞彩
	private final static String getCodesFromFileJQ(String gid, String pid, String basePath, String fileName, String play, Logger logger) throws Exception {
		File file = new File(basePath + File.separator + gid + File.separator + pid, fileName);
		if (file.exists() && file.isFile()) {
			StringBuffer sb = new StringBuffer();
			BufferedReader br = new BufferedReader(new FileReader(file));
			String temp = null;
			while ((temp = br.readLine()) != null) {
				temp = temp.trim();
				if (temp.length() > 0) {
					sb.append(temp).append(";");
				}
			}
			br.close();
			br = null ;
			
			String s = new String(sb);
			if (s.length() > 0) {
				s = s.substring(0, s.length() - 1);
			}
			
			return s;
		} else {
			printInfo(gid, pid, "文件不存在 " + basePath + File.separator + gid + File.separator + pid + File.separator + fileName, logger);
			return null;
		}
	}

	// 数字彩
	private final static String getCodesFromFileSZ(String gid, String pid, String basePath, String fileName, String play, Logger logger) throws Exception {
		File file = new File(basePath + File.separator + gid + File.separator + pid, fileName);
		logger.info(basePath + File.separator + gid + File.separator + pid, fileName);
		if (file.exists() && file.isFile()) {
			StringBuffer sb = new StringBuffer();
			BufferedReader br = new BufferedReader(new FileReader(file));
			String temp = null;
			while ((temp = br.readLine()) != null) {
				temp = temp.trim();
				if (temp.length() > 0) {
					if (temp.indexOf(",") >= 0) {
						if (temp.indexOf(":") < 0) {
							sb.append(temp + ":" + play + ":1;");
						} else {
							sb.append(temp).append(";");
						}
					} else {
						for (int i = 0; i < temp.length(); i++) {
							sb.append(temp.charAt(i));
							if (i != temp.length() - 1) {
								sb.append(",");
							}
						}
						sb.append(":").append(play).append(":1;");
					}
				}
			}
			br.close();
			br = null ;
			String s = new String(sb);
			if (s.length() > 0) {
				s = s.substring(0, s.length() - 1);
			}
			return s;
		} else {
			printInfo(gid, pid, "文件不存在 " + basePath + File.separator + gid + File.separator + pid + File.separator + fileName, logger);
			return null;
		}
	}

	public final static void saveCastCodeToFile(TradeBean bean, String basePath) throws Exception {
		String codes = bean.getCodes();
		String gid = bean.getGid();
		String pid = bean.getPid();
		String uid = bean.getUid();

		long time = System.currentTimeMillis();
		String name = uid + gid + time + pid;
		String filename = "";

		filename = MD5Util.compute(name);

		File dir = new File(basePath + File.separator + gid + File.separator + pid);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		File file = new File(dir, filename);
		FileOutputStream fout = new FileOutputStream(file);
		fout.write(codes.getBytes());
		fout.close();
		fout = null;

		bean.setFflag(1);
		bean.setCodes(filename);
	}
}
