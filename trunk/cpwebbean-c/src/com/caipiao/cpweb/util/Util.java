package com.caipiao.cpweb.util;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;

import com.mina.rbc.util.StringUtil;

public class Util {

    public static boolean SaveFile(String contents, String fdir, String fname, String encode) {
        File d = new File(fdir);
        if (!d.exists()) {
            d.mkdirs();
        }
        return SaveFile(contents, fdir + File.separator + fname, encode);
    }

    public static String getFileContent(File file, String encode) {
        if (StringUtil.isEmpty(encode)) {
            encode = "UTF-8";
        }
        try {
            if (file.exists()) {
                StringBuffer sb = new StringBuffer();
                BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), encode));
                String tmp = null;
                while ((tmp = br.readLine()) != null) {
                    sb.append(tmp);
                }
                return sb.toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
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

    /**
     * 判断文件编码
     * 
     * @param file
     * @return
     */
    public static String get_charset(File file) {
        String charset = "GBK";
        byte[] first3Bytes = new byte[3];
        try {
            boolean checked = false;
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
            bis.mark(0);
            int read = bis.read(first3Bytes, 0, 3);
            if (read == -1) {
                return charset;
            }
            if (first3Bytes[0] == (byte) 0xFF && first3Bytes[1] == (byte) 0xFE) {
                charset = "UTF-16LE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xFE && first3Bytes[1] == (byte) 0xFF) {
                charset = "UTF-16BE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xEF && first3Bytes[1] == (byte) 0xBB && first3Bytes[2] == (byte) 0xBF) {
                charset = "UTF-8";
                checked = true;
            }
            bis.reset();
            if (!checked) {
                int loc = 0;
                while ((read = bis.read()) != -1) {
                    loc++;
                    if (read >= 0xF0)
                        break;
                    if (0x80 <= read && read <= 0xBF) // 单独出现BF以下的，也算是GBK
                        break;
                    if (0xC0 <= read && read <= 0xDF) {
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF) // 双字节 (0xC0 - 0xDF)
                                                          // (0x80 -
                                                          // 0xBF),也可能在GB编码内
                            continue;
                        else
                            break;
                    } else if (0xE0 <= read && read <= 0xEF) {// 也有可能出错，但是几率较小
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF) {
                            read = bis.read();
                            if (0x80 <= read && read <= 0xBF) {
                                charset = "UTF-8";
                                break;
                            } else
                                break;
                        } else
                            break;
                    }
                }
                // System.out.println( loc + " " + Integer.toHexString( read ) );
            }

            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return charset;
    }
}
