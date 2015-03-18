package com.caipiao.game.cacher.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

import org.json.JSONObject;
import org.json.XML;

import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;

public class FileUtil {
	private final static int JSON = 0;
	private static int SAVE_TYPE = JSON;
	private static Logger logger = LoggerFactory.getLogger("fileutil");
	
	public static boolean saveFile(String dir, String name, String content, String encoding, Logger logger){
		File fdir = new File(dir);
		return saveFile(fdir, name, content, encoding, logger);	
	}
	
	public static boolean saveFile(File fdir, String name, String content, String encoding){
		return saveFile(fdir, name, content, encoding, logger);
	}
	
	public static boolean saveFile(File fdir, String name, String content, String encoding, Logger logger){
		boolean isuccess = false;
		BufferedWriter bw = null;
		try {
			if (!fdir.exists()) {
				fdir.mkdirs();
			}
			
			String fname = name;
			String ss = content;
			if ( SAVE_TYPE == JSON) {// 转换成JSON
				JSONObject xmlJSONObj = XML.toJSONObject(ss);
				ss = xmlJSONObj.toString(4);
				if ( name.indexOf(".") > 0 ) {
					int pos = name.indexOf(".");
					fname = name.substring(0,pos) + ".json";
				}
			}
			
			FileOutputStream fout = new FileOutputStream(new File(fdir, fname));
			bw = new BufferedWriter(new OutputStreamWriter(fout, encoding));
			bw.write(ss);
			bw.flush();
			isuccess = true;
		} catch (Exception e) {
			logger.error("FileUtil::saveFile", e);
		} finally {
			if(bw != null){
				try {
					bw.close();
				} catch (IOException e) {
					logger.error("FileUtil::saveFile", e);
				}
				bw = null;
			}
		}
		return isuccess;
	}	
	public static String getFileContent(File file, String encode){
		if (StringUtil.isEmpty(encode)) {
			encode = "UTF-8";
		}
		try {
			if(file.exists()){
				StringBuffer sb = new StringBuffer();
				BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), encode));
				String tmp = null;
				while((tmp = br.readLine()) != null){
					sb.append(tmp);
				}
				br.close();
				br = null ;
				return sb.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
}
