package com.caipiao.cpweb.trade;

import java.io.ByteArrayOutputStream;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

public class PythonFilterUtil {
	
	/* 调用方KEY PWD */
	public static final String CUSKEY = "159caicom";
	public static final String CUSPWD = "HCP3KMOH";
	
	public static final String CUSKEY2 = "159caicom";
	public static final String CUSPWD2 = "HCP3KMOH";
	/* 竞彩过滤页面接口路径  */
	//public static final String JC_URL = "http://www.159cai.com/filter/";
	public static final String JC_URL2 = "http://filter.159cai.com/jcfilterhelper.do?method=validateMiddle";
	public static final String JC_BACKUP_URL = "http://www.159cai.com/phpt/filter/jc_recv.phpx";

	
	
	/* 北单过滤页面接口路径  */	
	public static final String BD_CUSKEY = "159caicom";
	public static final String BD_CUSPWD = "HCP3KMOH";
	public static final String BD_URL = "http://filter.159cai.com/servlet/helperFilterServlet";
	public static final String BD_BACKUP_URL = "http://www.159cai.com/phpt/filter/bj_recv.phpx";
	
	
	/* 胜负过滤页面接口路径  */
	public static final String SFC_URL = "http://www.159cai.com/filter2/";	
	
	/* 任九过滤页面接口路径  */
	public static final String R9_URL = "http://www.159cai.com/filter2/";	
	/**
	 * 解压缩
	 * @param compressed
	 * @return
	 */
	public static final byte[] decompress(byte[] compressed) {  
	    if (compressed == null) {  
	        return null;  
	    }  
	    try {  
	        Inflater decompressor = new Inflater();  
	        decompressor.setInput(compressed);  
	        ByteArrayOutputStream bos = new ByteArrayOutputStream();  
	        int len = compressed.length << 2;  
	        while (!decompressor.finished()) {  
	            byte[] buf = new byte[len];  
	            int count = decompressor.inflate(buf);  
	            if (count > 0) {  
	                bos.write(buf, 0, count);  
	            }  
	        }  
	        return bos.toByteArray();  
	    } catch (DataFormatException e) {  
	        return compressed;  
	    }  
	}
	
	
	public static String zsGlChang(String glcon){
		StringBuffer sb = new StringBuffer();
		String [] conditions = glcon.split(";");
		for(int j = 0; j< conditions.length; j++){
			String[] gls = conditions[j].split("\\$");
			String [] glfs = gls[0].split(":");
			String gltj = PythonFilterUtil.changeStr(glfs[0]);
			sb.append(gltj);
			if("cc".equals(glfs[0]) || "lm".equals(glfs[0])){
				sb.append("</br>");
				String[] cl = glfs[1].split("\\$")[0].split("/");
				for (int k = 0; k < cl.length; k++) {
					String[] tj = cl[k].split("\\*");
					sb.append((k+1) + "、选择的条件： " +  tj[0].replace("@", "#") + " 范围：" + tj[1]);
					if(k!=cl.length-1){
						sb.append("</br>");
					}
				}
				if(j!=conditions.length-1){
					sb.append("</br>");
				}
			}else{
				sb.append(" " +  glfs[1].split(",")[0] + "-" + glfs[1].split(",")[1]);
				if("true".equals(glfs[1].split(",")[2])){
					sb.append(" <em class='red'>(容错:" + gls[1].replace(",", "-") + ")</em>");
				}
				if(j!=conditions.length-1){
					sb.append("</br>");
				}
			}
		}
		return sb.toString();
	}
	
	
	public static String changeStr(String strcon){
		if("n3".equals(strcon)){
			return "常规过滤：3的个数";
		}
		if("n1".equals(strcon)){
			return "常规过滤：1的个数";
		}
		if("n0".equals(strcon)){
			return "常规过滤：0的个数";
		}
		if("hz".equals(strcon)){
			return "常规过滤：和值区间";
		}
		if("dd".equals(strcon)){
			return "常规过滤：断点个数";
		}
		if("lh".equals(strcon)){
			return "常规过滤：连号个数";
		}
		if("ls".equals(strcon)){
			return "常规过滤：主场连胜";
		}
		if("lp".equals(strcon)){
			return "常规过滤：主场连平";
		}
		if("lf".equals(strcon)){
			return "常规过滤：主场连负";
		}
		if("maxlxbb".equals(strcon)){
			return "常规过滤：最大胜平连续";
		}
		if("maxlxbp".equals(strcon)){
			return "常规过滤：最大胜负连续";
		}
		if("maxlxbs".equals(strcon)){
			return "常规过滤：最大平负连续";
		}
		if("sx".equals(strcon)){
			return "首次末选：首选个数";
		}
		if("cx".equals(strcon)){
			return "首次末选：次选个数";
		}
		if("mx".equals(strcon)){
			return "赔率过滤：末选个数";
		}
		if("plh".equals(strcon)){
			return "赔率过滤：赔率和";
		}
		if("plj".equals(strcon)){
			return "赔率过滤：赔率积";
		}
		if("pl1".equals(strcon)){
			return "赔率过滤：一赔个数";
		}
		if("pl2".equals(strcon)){
			return "赔率过滤：二赔个数";
		}
		if("pl3".equals(strcon)){
			return "赔率过滤：三赔个数";
		}
		
		if("sph".equals(strcon)){
			return "SP值过滤：SP值和";
		}
		if("spj".equals(strcon)){
			return "SP值过滤：SP值积";
		}
		if("sp1".equals(strcon)){
			return "SP值过滤：第一SP值";
		}
		if("sp2".equals(strcon)){
			return "SP值过滤：第二SP值";
		}
		if("sp3".equals(strcon)){
			return "SP值过滤：第三Sp值";
		}
		if("jjfw".equals(strcon)){
			return "SP值过滤：北单奖金范围";
		}
		if("jc_jjfw".equals(strcon)){
			return "SP值过滤：竞彩奖金范围";
		}
		if("cc".equals(strcon)){
			return "集合过滤：命中过滤";
		}
		if("lm".equals(strcon)){
			return "集合过滤：冷门过滤";
		}
		if("pljzs".equals(strcon)){
			return "选择注数：赔率选取";
		}
		if("jjzs".equals(strcon)){
			return "选择注数：奖金选取";
		}
		if("jc_jjzs".equals(strcon)){
			return "选择注数：竞彩奖金选取";
		}
		if("sjzs".equals(strcon)){
			return "选择注数：随机选取";
		}else{
			return "";
		}
	};
}
