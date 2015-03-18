package com.caipiao.plugin.helper;

public class PluginUtil {

	public static boolean isEmpty(String str) {
		if (str == null || "".equals(str) || str.trim().length() == 0) {
			return true;
		}
		return false;
	}
	
	public static byte toByte(String s) {
		try {
			return Byte.parseByte(s);
		} catch (Exception e) {
			return 0;
		}
	}
	public static short toShort(String s) {
		try {
			return Short.parseShort(s);
		} catch (Exception e) {
			return 0;
		}
	}
	public static int toInt(String s) {
		return toInt(s, 10);
	}
	public static int toInt(String s, int radix) {
		try {
			return Integer.parseInt(s, radix);
		} catch (Exception e) {
			return 0;
		}
	}
	
	public static String[] splitter(String code, String delim) {
    	int size = CountStrNum(code, delim);
    	return splitter(code,delim,size);
    }

    public static String[] splitter(String code, String delim, int length) {
        int pos = -1;
        int begin = 0;
        String[] s = new String[length];
        int count = 0;
        while ((pos = code.indexOf(delim, pos + 1)) != -1) {
            s[count] = code.substring(begin, pos);
            begin = pos + 1;
            count++;
        }
        s[count] = code.substring(begin, code.length());
        count++;
        return s;
    }
    public static int CountStrNum(String source, String delim) {
        int pos = -1;
        int begin = 0;
        int count = 1;
        while ((pos = source.indexOf(delim, begin)) >= 0) {
            count++;
            begin = pos + 1;
        }
        return count;
    }
    public static int[] SplitterInt(String code, String delim) {
    	int size = CountStrNum(code, delim);
    	return SplitterInt(code,delim,size);
    }
    public static int[] SplitterInt(String code, String delim, int length) {
        int pos = -1;
        int begin = 0;
        int[] s = new int[length];
        int count = 0;
        while ((pos = code.indexOf(delim, pos + 1)) != -1) {
            s[count] = Integer.parseInt(code.substring(begin, pos));
            begin = pos + 1;
            count++;
        }
        s[count] = Integer.parseInt(code.substring(begin, code.length()));
        count++;
        return s;
    }    
	
	
	
	public static String longToStringNoPad(long l) {
		return longToStringNoPad(l,0);
	}
	public static String longToStringNoPad(long l,int base) {
		String s = "";
		for (int i=0;i<64;i++) {
			if ( ((l & (1L << i)) >> i) == 1 ) {
				int m = i + base;
				s += m + ",";
			}
		}
		if ( s.length() > 0 ) {
			s = s.substring(0,s.length()-1);
		}
		return s;
	}

	public static String longToString(long l) {
		return longToString(l,0);
	}
	public static String longToString(long l,int base) {
		String s = "";
		for (int i=0;i<64;i++) {
			if ( ((l & (1L << i)) >> i) == 1 ) {
				int m = i + base;
				if ( m < 10 ) {
					s += "0" + m + ",";
				} else {
					s += m + ",";
				}
			}
		}
		if ( s.length() > 0 ) {
			s = s.substring(0,s.length()-1);
		}
		return s;
	}
	
	public static String longToStringEx(long l) {
		String s = "";
		for (int i=0;i<64;i++) {
			if ( ((l & (1L << i)) >> i) == 1 ) {
				s += i;
			}
		}
		return s;
	}

	/**
	 * 从n中选m个
	 * @param m
	 * @param n
	 * @return
	 */
    public static int C(int m,int n) {
    	if (n < 0 || m < 0 || n < m) {
			return 0;
		}
    	
//    	if (m==0 && n >= 0 ) {
//    		return 1;
//    	}
    	
		// 加入m=n!=0时返回组合之为1
		if ( m ==0 || m == n) {
			return 1;
		}
		
		int i = 0;
		long result = 1;
		if (n < 2 * m) {
			m = n - m;
		}
		for (i = n; i >= n - m + 1; i--) {
			result *= i;
		}
		for (i = m; i >= 2; i--) {
			result /= i;
		}
		return (int) result;
    }
	
    public static long convertBallToLong(int[] bi,int minNum,int maxNum) throws Exception {
		long l = 0;
		for ( int i=0;i<bi.length;i++) {
			if ( bi[i] < minNum ) {
				throw new Exception("选球号码溢出 不能小于" + minNum);
			}
			if ( bi[i] > maxNum ) {
				throw new Exception("选球号码溢出 不能超过" + maxNum);
			}
			l |= 1L << bi[i];
		}
		if ( Long.bitCount(l) != bi.length) {
			throw new Exception("号码不正确 有重复");
		}
		return l;
	}
    
//    public static long convertBallToLong(int[] bi,int maxNum) throws Exception {
//		long l = 0;
//		for ( int i=0;i<bi.length;i++) {
//			if ( bi[i] > maxNum ) {
//				throw new Exception("选球号码溢出 不能超过" + maxNum);
//			}
//			l |= 1L << bi[i];
//		}
//		if ( Long.bitCount(l) != bi.length) {
//			throw new Exception("号码不正确 有重复");
//		}
//		return l;
//	}
    public static int[] stringToInt(String s, int min, int max) throws Exception {
		if (s == null || s.length() == 0) {
			throw new Exception("选球号码不能为空");
		}
		int codenum = s.length();
		int[] codeInt = new int[codenum];
		try {
			for (int i = 0; i < codenum; i++) {
				codeInt[i] = Integer.parseInt(s.charAt(i) + "");
			}
		} catch (Exception e) {
			throw new Exception("选球号码必须是数字");
		}
			
		if ( Long.bitCount(convertBallToLong(codeInt, min, max)) != s.length()) {
			throw new Exception("选球号码有重复");
		}
		return codeInt;
	}
//    public static int[] stringToInt(String s) throws Exception {
//		if (s == null || s.length() == 0) {
//			throw new Exception("选球号码不能为空");
//		}
//		int codenum = s.length();
//		int[] codeInt = new int[codenum];
//		try {
//			for (int i = 0; i < codenum; i++) {
//				codeInt[i] = Integer.parseInt(s.charAt(i) + "");
//			}
//		} catch (Exception e) {
//			throw new Exception("选球号码必须是数字");
//		}
//			
//		if ( Long.bitCount(convertBallToLong(codeInt,9)) != s.length()) {
//			throw new Exception("选球号码有重复");
//		}
//		return codeInt;
//	}
	
    public static int stringToIntEx(String s) throws Exception {
		if (s == null || s.length() == 0) {
			throw new Exception("选球号码不能为空");
		}
		int n = -1;
		try {
			n = Integer.parseInt(s);
		} catch (Exception e) {
			e.printStackTrace();
			throw new Exception("选球号码必须是数字");
		}

		if ( n >= 0 && n <= 9) {
			return n;
		} else {
			throw new Exception("选球号码超不合法");
		}
	}
    
    
    /**
	 * 用字符串替换字符串
	 */
	public static String replaceString(String strSource, String strFind,
			String strReplace) {
		int pos;
		String strTemp = strSource;
		StringBuffer sb = new StringBuffer();

		if (strTemp != null && strFind != null && strReplace != null) {
			while ((pos = strTemp.indexOf(strFind)) != -1) {
				sb.append(strTemp.substring(0, pos));
				sb.append(strReplace);
				strTemp = strTemp.substring(pos + strFind.length());
			}
			sb.append(strTemp);
			return new String(sb);
		} else {
			return strSource;
		}
	} // replaceString
	
	
	public static String LeftPad(String s, String pad, int len) {
		int l = len - s.getBytes().length;
		String ss = s;
		for (int i = 0; i < l; i++) {
			ss = pad + ss;
		}
		return ss;
	}

	public static String RightPad(String s, String pad, int len) {
		int l = len - s.getBytes().length;
		String ss = s;
		for (int i = 0; i < l; i++) {
			ss = ss + pad;
		}
		return ss;
	}
	
	public static void main(String[] args){
		int[] bi = {7,8,9,10,11};
		try {
			long l = PluginUtil.convertBallToLong(bi,1,11);
			System.out.println(l);
			System.out.println(Long.bitCount(l));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
