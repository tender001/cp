package com.caipiao.mob.util;

import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserCheckUtil {


	private static final int[] weight = new int[] { 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 };
	// 校验码
	private static final int[] checkDigit = new int[] { 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 };
	
	public final static boolean isNullString(String s) {
		if (s != null && s.length() > 0 && s.trim().length() > 0) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 生成6位随机码
	 * 
	 * @author xhs
	 * @return
	 */
	public final static String randomNum() {
		char[] codeSequence = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T',
				'U', 'V', 'W', 'X', 'Y', 'Z' };
		Random random = new Random();
		String strRand = "";
		StringBuffer randomCode = new StringBuffer("");
		for (int i = 0; i < 6; i++) {
			strRand = String.valueOf(codeSequence[random.nextInt(35)]);
			randomCode.append(strRand);
		}
		return randomCode.toString();
	}

	/**
	 * 邮箱地址验证
	 * 
	 * @author xhs
	 * @return boolean
	 */
	public final static boolean isEmail(String email) {
		String str = "^([a-z0-9A-Z]+[-_|.]*)+[a-z0-9A-Z]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?.)+[a-zA-Z]{2,}$";
		Pattern p = Pattern.compile(str);
		Matcher m = p.matcher(email);
		return m.matches();
	}

	/**
	 * 手机号码验证
	 * 
	 * @author xhs
	 * @return boolean
	 */
	public final static boolean isMobilephone(String mobiles) {
		Pattern p = Pattern.compile("^((13[0-9])|(15[^4,\\D])|(18[0-9])|(17[0-9])|(14[0-9]))\\d{8}$");
		Matcher m = p.matcher(mobiles);
		return m.matches();
	}

	/**
	 * 用户名格式验证
	 * 
	 * @author xhs
	 * @return boolean
	 */
	public final static boolean CheckUserName(String name) {
		Pattern p = Pattern.compile("^[A-Za-z0-9\u4e00-\u9fa5]+$");
		Matcher m = p.matcher(name);
		return m.matches();
	}
	

	/**
	 * 验证身份证是否符合格式
	 * 
	 * @param idcard
	 * @return
	 */
	public static boolean verifyIDCard(String idcard) {
		if (idcard.length() == 15) {
			idcard = update2eighteen(idcard);
		}
		if (idcard.length() != 18) {
			return false;
		}
		// 获取输入身份证上的最后一位，它是校验码
		String checkDigit = idcard.substring(17, 18);
		// 比较获取的校验码与本方法生成的校验码是否相等
		if (checkDigit.equals(getCheckDigit(idcard))) {
			return true;
		}
		return false;
	}
	
	/**
	 * 计算18位身份证的校验码
	 * 
	 * @param eighteenCardID
	 *            18位身份证
	 * @return
	 */
	private static String getCheckDigit(String eighteenCardID) {
		int remaining = 0;
		if (eighteenCardID.length() == 18) {
			eighteenCardID = eighteenCardID.substring(0, 17);
		}

		if (eighteenCardID.length() == 17) {
			int sum = 0;
			int[] a = new int[17];
			// 先对前17位数字的权求和
			for (int i = 0; i < 17; i++) {
				String k = eighteenCardID.substring(i, i + 1);
				a[i] = Integer.parseInt(k);
			}
			for (int i = 0; i < 17; i++) {
				sum = sum + weight[i] * a[i];
			}
			// 再与11取模
			remaining = sum % 11;
			a = null;
		}
		return remaining == 2 ? "X" : String.valueOf(checkDigit[remaining]);
	}

	/**
	 * 将15位身份证升级成18位身份证号码
	 * 
	 * @param fifteenCardID
	 * @return
	 */
	private static String update2eighteen(String fifteenCardID) {
		// 15位身份证上的生日中的年份没有19，要加上
		String eighteenCardID = fifteenCardID.substring(0, 6) + "19" + fifteenCardID.substring(6, 15);
		eighteenCardID = eighteenCardID + getCheckDigit(eighteenCardID);
		return eighteenCardID;
	}
}
