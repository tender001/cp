package com.caipiao.mob.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;

import com.mina.rbc.logger.Logger;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;

public class FileCodesUtil {

	public final static String CODE_PATH = System.getProperty("DATA_HOME") + File.separator + "pupload";
//	public final static String MATCH_PATH = System.getProperty("DATA_HOME") + File.separator + "match";
	
	public final static String getCodesFromFile(String gid, String pid, String fileName, String play, Logger logger) throws Exception {
		int g = Integer.parseInt(gid);
		if (g >= 85 || g == 70 || g == 71 || g == 72) {
			return getCodesFromFileJQ(gid, pid, CODE_PATH, fileName, play, logger);
		} else {
			return getCodesFromFileSZ(gid, pid, CODE_PATH, fileName, play, logger);
		}
	}

	// 北单和竞彩
	private final static String getCodesFromFileJQ(String gid, String pid, String basePath, String fileName, String play, Logger logger) throws Exception {
		File file = new File(basePath + File.separator + gid + File.separator + pid, fileName);
		
		if(!file.exists()){
			File file_y = new File(basePath + File.separator + gid + File.separator + (Integer.parseInt(pid) - 1), fileName);
			if(file_y.exists() && file_y.isFile()){
				file = file_y;
			} else {
				File file_t = new File(basePath + File.separator + gid + File.separator + (Integer.parseInt(pid) + 1), fileName);
				if(file_t.exists() && file_t.isFile()){
					file = file_t;
				}
			}
		}
		
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
			logger.info("彩种=" + gid + " 期次=" +  pid + " 文件不存在 " + basePath + File.separator + gid + File.separator + pid + File.separator + fileName, logger);
			logger.info("彩种=" + gid + " 期次=" +  pid + " 文件不存在 " + file.getCanonicalPath(), logger);
			return null;
		}
	}

	// 数字彩
	private final static String getCodesFromFileSZ(String gid, String pid, String basePath, String fileName, String play, Logger logger) throws Exception {
		File file = new File(basePath + File.separator + gid + File.separator + pid, fileName);
		if (file.exists() && file.isFile()) {
			StringBuffer sb = new StringBuffer();
			BufferedReader br = new BufferedReader(new FileReader(file));
			String temp = null;
			while ((temp = br.readLine()) != null) {
				temp = temp.trim();
				if (temp.length() > 0) {
					if (gid.equalsIgnoreCase("04")||gid.equalsIgnoreCase("20")||gid.equalsIgnoreCase("54")||gid.equalsIgnoreCase("55")||gid.equalsIgnoreCase("56")){						
						if (temp.indexOf(":") < 0) {
							sb.append(temp + ":" + play + ":1;");
						} else {
							sb.append(temp).append(";");
						}
					}else if (temp.indexOf(",") >= 0) {
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
			logger.info("彩种=" + gid + " 期次=" +  pid + "文件不存在 " + basePath + File.separator + gid + File.separator + pid + File.separator + fileName, logger);
			return null;
		}
	}
	
	public static String getFileName(String username, String lottery, String expect) {
		long time = System.currentTimeMillis();
		String name = username + lottery + time + expect;
		String filename = "";
		try {
			filename = MD5Util.compute(name);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return filename;
	}
	
	public static boolean SaveFile(String contents, String fdir, String fname, String encode) {
        File d = new File(CODE_PATH+ File.separator+fdir);
        if (!d.exists()) {
            d.mkdirs();
        }
        return SaveFile(contents, CODE_PATH+ File.separator+fdir + File.separator + fname, encode);
    }
	
	public static boolean SaveFile(String contents, String filename, String encode) {
        if (StringUtil.isEmpty(encode)) {
            encode = "UTF-8";
        }
        StringBuffer sb = new StringBuffer();
        sb.append(contents);
        FileOutputStream outSTr = null;
        BufferedWriter bw = null;
        File file = new File(filename);
        try {
            outSTr = new FileOutputStream(file);
            bw = new BufferedWriter(new OutputStreamWriter(outSTr, encode));
            bw.write(sb.toString());
            bw.flush();
            sb = null;
            return true;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                bw.close();
                outSTr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return false;
    }
}
