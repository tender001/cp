package com.caipiao.mob;

public class Status {

	public static class SUCCESS{
		public final static String CODE = "_0000";
		public final static String DESC = "成功";
	}
	
	public static class FAILURE{
		public final static String CODE = "_9999";
		public final static String DESC = "发生错误：";
	}
	
	public static class USER_HAVE_NOT_ENOUGH_MONEY{
		public final static String CODE = "_0002";
		public final static String DESC = "用户可用余额不足";
	}
	
	public static class USER_IS_EMPTY{
		public final static String CODE = "_9991";
		public final static String DESC = "用户名不能为空";
	}
	
	public static class PASSWORD_IS_EMPTY{
		public final static String CODE = "_9992";
		public final static String DESC = "登陆不能为空";
	}

	public static class VERSION_IS_NOT_VALID{
		public final static String CODE = "_0003";
		public final static String DESC = "无效的版本号";
	}

	public static class EMAIL_IS_EMPTY{
		public final static String CODE = "_0004";
		public final static String DESC = "电子邮件不能为空";
	}

	public static class EMAIL_IS_NOT_VALID{
		public final static String CODE = "_0005";
		public final static String DESC = "电子邮件格式不符合要求";
	}

	public static class REGISTER_IS_FAILURE{
		public final static String CODE = "_0006";
		public final static String DESC = "注册失败";
	}
	
	public static class LOGIN_IS_FAILURE{
		public final static String CODE = "_0007";
		public final static String DESC = "登陆失败:";
	}
	public static class REALNAME_IS_EMPTY{
		public final static String CODE = "_0008";
		public final static String DESC = "真实姓名不能为空";
	}

	public static class IDNO_IS_EMPTY{
		public final static String CODE = "_0009";
		public final static String DESC = "身份证号码不能为空";
	}
	
	public static class IDNO_IS_NOT_VALID{
		public final static String CODE = "_0010";
		public final static String DESC = "身份证号码不符合要求";
	}

	public static class USER_IS_NOT_VALID{
		public final static String CODE = "_0011";
		public final static String DESC = "用户名不符合要求";
	}
	public static class PHONE_IS_EMPTY{
		public final static String CODE = "_0012";
		public final static String DESC = "手机号码不能为空";
	}
	public static class PHONE_IS_NOT_VALID{
		public final static String CODE = "_0013";
		public final static String DESC = "手机号码不符合要求";
	}
	public static class RANDOM_IS_EMPTY{
		public final static String CODE = "_0014";
		public final static String DESC = "验证码不能为空";
	}
	public static class PROVINCE_IS_EMPTY{
		public final static String CODE = "_0015";
		public final static String DESC = "省份不能为空";
	}
	public static class CITY_IS_EMPTY{
		public final static String CODE = "_0016";
		public final static String DESC = "城市不能为空";
	}
	public static class BANK_IS_EMPTY{
		public final static String CODE = "_0017";
		public final static String DESC = "银行代码无效";
	}
	public static class BANK_SUBBRANCH_IS_EMPTY{
		public final static String CODE = "_0018";
		public final static String DESC = "银行支行名称不能为空";
	}
	public static class BANKNUMBER_IS_EMPTY{
		public final static String CODE = "_0019";
		public final static String DESC = "银行卡号不能为空";
	}
	public static class LOTTPROJ_IS_EMPTY{
		public final static String CODE = "_0020";
		public final static String DESC = "彩种方案编号不能为空";
	}
	public static class LOTTPROJ_IS_NOT_VALID{
		public final static String CODE = "_0021";
		public final static String DESC = "彩种方案编号不符合要求";
	}
	public static class GAME_IS_EMPTY{
		public final static String CODE = "_0022";
		public final static String DESC = "彩种不能为空";
	}
	public static class GAME_IS_NOT_VALID{
		public final static String CODE = "_0023";
		public final static String DESC = "彩种不符合要求";
	}
	public static class PERIOD_IS_EMPTY{
		public final static String CODE = "_0024";
		public final static String DESC = "彩种期次不能为空";
	}
	public static class ADD_MONEY_IS_NOT_VALID{
		public final static String CODE = "_0025";
		public final static String DESC = "充值金额必须大于等于10元";
	}
	public static class CHANNEL_IS_EMPTY{
		public final static String CODE = "_0026";
		public final static String DESC = "充值渠道不能为空";
	}
	public static class CHANNEL_IS_NOT_VALID{
		public final static String CODE = "_0027";
		public final static String DESC = "充值渠道未获支持";
	}
	public static class SOURCE_IS_NOT_VALID{
		public final static String CODE = "_0028";
		public final static String DESC = "购买来源未获支持";
	}
	public static class CODES_IS_EMPTY{
		public final static String CODE = "_0029";
		public final static String DESC = "投注号码不能为空";
	}
	public static class CODES_IS_NOT_VALID{
		public final static String CODE = "_0029";
		public final static String DESC = "投注号码不符合要求";
	}
	public static class NEWPASSWORD_IS_NOT_EMPTY{
		public final static String CODE = "_0030";
		public final static String DESC = "新密码不能为空";
	}
}
