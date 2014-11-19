package com.caipiao.cpweb.upload;

import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;

import com.mina.rbc.util.MD5Util;

/**
 * 上传类
 * 
 * @author djx
 * 
 */
public class FileUpload {

	private Map<String, ArrayList<String>> map = new HashMap<String, ArrayList<String>>();// 上传表单中的字段值集合
	private String filePath = "";// 文件上传保存路径
	private Map<String, String> extMap = new HashMap<String, String>();// 默认只支持上传txt文件
	private long size = 10 * 1024;// 默认为10K
	private Map<Object, Object> upFileMap = new HashMap<Object, Object>();// 上传文件的文件名集合

	public static boolean fileCopy(File sf, File df) {
		try {
			// 打开源文件
			FileInputStream input = new FileInputStream(sf);
			// 创建并打开目标文件
			FileOutputStream output = new FileOutputStream(df);
			byte[] b = new byte[1024 * 5];
			int len;
			// 从源文件中读取字节
			while ((len = input.read(b)) != -1) {
				// 向目标文件中写入字节
				output.write(b, 0, len);
			}
			// 释放写入流，并关闭读取、写入流
			output.flush();
			output.close();
			input.close();
			return true;
		} catch (Exception e) {
			System.out.println("复制此文件操作出错");
			e.getStackTrace();
		}
		return false;
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

	/**
	 * 构造函数
	 * 
	 * @param request
	 *            HttpServletRequest对象
	 * @param path
	 *            上传文件保存文件夹路径,工程根目录的相应路径
	 * @param ext
	 *            允许上传的文件上传类型
	 * @param size
	 *            上传文件单个文件的大小上限
	 */
	public FileUpload(HttpServletRequest request, String path, String[] ext, long size) {
		try {
			ServletInputStream sis = request.getInputStream();
			setUploadPath(path);// 设置上传文件保存路径
			setUploadExt(ext);// 设置支持的文件上传类型
			setUploadSize(size);// 设置最大上传文件大小
			byte[] b = new byte[4096];
			int len = 0;
			int total = 1;
			String str = "";
			String key = "";// 协议分割标识
			String filepath = "";
			String tempext = "";
			String fieldName = "";
			File newFile = null;
			boolean isFile = false;
			boolean hasFile = false;
			String temp = "";

		    String charset = request.getCharacterEncoding(); 
		    
			while ((len = sis.readLine(b, 0, b.length)) != -1) {
				str = new String(b, 0, len,charset);
				switch (total) {
				case 1:// 读取标识符
					key = str.substring(0, str.length() - 2);
					total++;
					break;
				case 2:// 读取文件类型,开启写文件操作
				    if (str.indexOf("filename=\"") != -1) {
						filepath = getFilePath(str);
						if (!"".equals(filepath)) {
							tempext = getFileExt(filepath);
							fieldName = getFieldName(str);
							if (extMap.containsKey(tempext.toLowerCase())) {
								newFile = new File(this.filePath + File.separator + getNewFileName() + "." + tempext);
								upFileMap.put(fieldName, newFile.getName());
								
								hasFile = true;
							} else {
								hasFile = false;
							}
						} else {
							hasFile = false;
						}
						isFile = true;
					} else {
						fieldName = getFieldName(str);
						isFile = false;
					}
					total++;
					break;
				case 3:// 跳过文件类型输出信息流
					total++;
					break;
				case 4:
					if (!isFile) {
						temp = str;
					}
					total++;
					break;
				default:
					if (isFile && hasFile) {
						FileOutputStream fos = new FileOutputStream(newFile);
						DataOutputStream dos = new DataOutputStream(fos);
						try {
							if (len >= 3) {
								if (b[0] == -17 && b[1] == -69 && b[2] == -65) {
									dos.write(b, 3, len - 3);
								} else {
									dos.write(b, 0, len);
								}
							} else {
								dos.write(b, 0, len);
							}
							b = new byte[4096];
							int ntotal = 0;
							while ((len = sis.readLine(b, 0, b.length)) != -1) {
								str = new String(b, 0, len,charset);
								if (str.endsWith("\r\n")) {
									if (str.indexOf(key) != -1) {// 检查是否有分割标识符出现
										total = 2;
										break;
									} else {
										if (ntotal > 0) {
											dos.write("\r\n".getBytes());
										}
									}
									dos.write(b, 0, len - 2);
								} else {
									if (str.indexOf(key) != -1) {// 检查是否有分割标识符出现
										total = 2;
										break;
									}
									dos.write(b, 0, len);
								}
								ntotal++;
							}
						} catch (Exception e) {
							System.out.println("上传文件发生异常");
						} finally {
							dos.close();
							fos.close();
							if (newFile.length() > this.size) {// 文件上传大小限制
								upFileMap.remove(fieldName);
								newFile.delete();
							}
						}
					} else {
						if (str.indexOf(key) == -1) {
							temp += str;
							while ((len = sis.readLine(b, 0, b.length)) != -1) {
								str = new String(b, 0, len);
								if (str.indexOf(key) != -1) {// 检查是否有分割标识符出现
									total = 2;
									break;
								} else {
									temp += str;
								}
							}
						} else {
							total = 2;
						}
						if (setRequestField(fieldName, temp)) {
							temp = "";
							fieldName = "";
						}
					}
					break;
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
			Iterator<Object> its = upFileMap.keySet().iterator();
			while (its.hasNext()) {
				removeUploadFile(its.next());
			}
		}
	}

	private String getFieldName(String field) {
		String str = "";
		String match_pattern = "\\s+name=\"([\\w\\W]+?)\"";
		Pattern p = Pattern.compile(match_pattern);
		Matcher m = p.matcher(field);
		while (m.find()) {
			str = m.group(1);
		}
		return str;
	}

	private String getFilePath(String field) {
		String str = "";
		String match_pattern = "filename=\"([^\"]+?)\"";
		Pattern p = Pattern.compile(match_pattern);
		Matcher m = p.matcher(field);
		while (m.find()) {
			str = m.group(1);
		}
		return str;
	}

	private void setUploadExt(String[] ext) {
		if (ext != null) {
			for (int i = 0; i < ext.length; i++) {
				extMap.put(ext[i].toLowerCase(), ext[i].toLowerCase());
			}
		} else {
			extMap.put("txt", "txt");
		}
	}

	private void setUploadPath(String path) {
		File f = new File(path);
		f.mkdirs();
		this.filePath = path;
	}

	public String getUploadPath() {
		return this.filePath;
	}

	private void setUploadSize(long size) {
		this.size = size;
	}

	private String getFileExt(String filepath) {
		return filepath.substring(filepath.lastIndexOf(".") + 1).toLowerCase();
	}

	public String getFileExt(Object key) {
		String tmp = (String) upFileMap.get(key);
		if (tmp != null) {
			return getFileExt(tmp);
		}
		return null;
	}

	private String getNewFileName() {
		Calendar calendar = Calendar.getInstance();
		return "" + calendar.get(Calendar.YEAR) + (calendar.get(Calendar.MONTH)+1<10?"0"+(calendar.get(Calendar.MONTH)+1):calendar.get(Calendar.MONTH)+1) + calendar.get(Calendar.DATE) + calendar.get(Calendar.HOUR) + calendar.get(Calendar.MINUTE) + calendar.get(Calendar.SECOND) + (new Random().nextInt(8999) + 1000);
	}

	public Object getRequestField(String key) {
		if (map.containsKey(key)) {
			ArrayList<?> list = (ArrayList<?>) map.get(key);
			if (list.size() == 1) {
				return list.get(0);
			} else if (list.size() > 1) {
				String[] strs = new String[list.size()];
				for (int i = 0; i < list.size(); i++) {
					strs[i] = list.get(i).toString();
				}
				return strs;
			}
		}
		return null;
	}

	private boolean setRequestField(String key, String value) {
		if ("".equals(key)) {
			return true;
		}
		System.out.println("key=" + key + "\tvalue=" + value);
		value = value.lastIndexOf("\r\n") == -1 ? value : value.substring(0, value.lastIndexOf("\r\n"));
		if (map.containsKey(key)) {
			ArrayList<String> list = (ArrayList<String>) map.get(key);
			list.add(value);
			map.put(key, list);
		} else {
			ArrayList<String> list = new ArrayList<String>();
			list.add(value);
			map.put(key, list);
		}
		return true;
	}

	public String getUploadFilePath(String key) {
		if (upFileMap.containsKey(key)) {
			return ((String) upFileMap.get(key)).replaceAll("\\\\", "/");
		}
		return "";
	}

	public void removeUploadFile(Object key) {
		String tmp = (String) upFileMap.get(key);
		if (tmp != null) {
			File file = new File(this.filePath + File.separator + tmp);
			if (file.exists()) {
				file.delete();
			}
		}
	}

	// public void setFileName(Object key,String path,String fname){
	// String tmp = (String) upFileMap.get(key);
	// if(tmp != null){
	// File file = new File(this.filePath+tmp);
	// if(file.exists()){
	// file.renameTo(new File(this.filePath+ path +
	// File.separator+fname+"."+getFileExt(tmp)));
	// upFileMap.put(key,path + File.separator + fname+"."+getFileExt(tmp));
	// }
	// }
	// }

	public void setFileName(Object key, String fname) {
		String tmp = (String) upFileMap.get(key);
		if (tmp != null) {
			File file = new File(this.filePath + File.separator + tmp);
			if (file.exists()) {
				file.renameTo(new File(this.filePath + File.separator + fname + "." + getFileExt(tmp)));
				upFileMap.put(key, fname + "." + getFileExt(tmp));
			}
		}
	}

	public File getFile(Object key) {
		String tmp = (String) upFileMap.get(key);
		if (tmp != null) {
			File file = new File(this.filePath + File.separator + tmp);
			if (file.exists()) {
				return file;
			}
		}
		return null;
	}
}
