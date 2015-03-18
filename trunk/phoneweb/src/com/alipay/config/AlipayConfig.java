package com.alipay.config;

/* *
 *类名：AlipayConfig
 *功能：基础配置类
 *详细：设置帐户有关信息及返回路径
 *版本：3.3
 *日期：2012-08-10
 *说明：
 *以下代码只是为了方便商户测试而提供的样例代码，商户可以根据自己网站的需要，按照技术文档编写,并非一定要使用该代码。
 *该代码仅供学习和研究支付宝接口使用，只是提供一个参考。
	
 *提示：如何获取安全校验码和合作身份者ID
 *1.用您的签约支付宝账号登录支付宝网站(www.alipay.com)
 *2.点击“商家服务”(https://b.alipay.com/order/myOrder.htm)
 *3.点击“查询合作者身份(PID)”、“查询安全校验码(Key)”

 *安全校验码查看时，输入支付密码后，页面呈灰色的现象，怎么办？
 *解决方法：
 *1、检查浏览器配置，不让浏览器做弹框屏蔽设置
 *2、更换浏览器或电脑，重新登录查询。
 */

public class AlipayConfig {
	
	//↓↓↓↓↓↓↓↓↓↓请在这里配置您的基本信息↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
	// 合作身份者ID，以2088开头由16位纯数字组成的字符串
	public static String partner = "2088111984427922";
	
	public static String key = "rg12m54r8sco2dyte290b4vgax6ffjyn";
	
	// 商户的私钥
	public static String private_key = "MIICXAIBAAKBgQDa57zEEDE7zcRq5Q01EZ5TzP0MirHzchjDUHgVRhqyPFRa6MC4w3pBlkT9LnZKQGGvKSzPEe/8S9Jf0hdiUj/WCuK+VBYkVsCaOlW/7n7AgHnTXEpEx2A4oAXGqSVxGvo/0g3vJCv2jPdWBrvPjbkU//dvsA32eTnkF7W9rGtOqwIDAQABAoGBANOmfd+/nCqrb76+yf9GkqOJrhzjON0dsw2dDw3ao1Mze4gORNAfyGQDq55zvtFZ4FjgYb+wIy34DWayFgPtbGN4Y1YvxGAFPOTBKYayB5DhPfUO3vl+x7xQwS6fi7xPgF1RiUotfwvGWpNcE8EkAOitQGZ/zGk7WhKV0FB7ZrY5AkEA8wdKFhwSeK2hQN2nHkYtDzYaTdG58a9AdwRANMN/zMwbBIAiUkQIdnIKfnMCi28ePeVft2Ez5x+sV0+3vkPJvwJBAOaW1LX5IiNyXwGxkEz5RrjUzh9KI/WAghc7Svk6KyV2J6v7fVL1H7TpKsfiCEQOqSjWgBtwrP9juCRShkbgvhUCQCRc/NreDG1+HVilUbIX8foKsFjgfqAJBu5H9otujRrJl2lO+tOwVkvSuHs/Hixazf2Y6n93zdpRROozhVy0q+UCQG6FlOazxr0esJLrPLLoOBGXTkSJELs3ISNpdAII8209OL6iB+ufOddIewzbNgMI0+OTDEwasZCnhzdBpsKKLhECQDK+F/2kUJVVTbSeuj640JbymraDvZ9mCJBnxq1jCe8BbCI/8LSBXvH1ZaaUmUMmuU7dFsC5sNrATlPkxAjcW38=";
	
	// 支付宝的公钥，无需修改该值
	public static String ali_public_key  = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnxj/9qwVfgoUh/y2W89L6BkRAFljhNhgPdyPuBV64bfQNN1PjbCzkIM6qRdKBoLPXmKKMiFYnkd6rAoprih3/PrQEB/VsW8OoM8fxn67UDYuyBTqA23MML9q1+ilIZwBC2AQ2UBVOrFXfFl75p6/B5KsiNG9zpgmLCUYuLkxpLQIDAQAB";

	//↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
	

	// 调试用，创建TXT日志文件夹路径
	//public static String log_path = "";

	// 字符编码格式 目前支持 gbk 或 utf-8
	public static String input_charset = "utf-8";
	
	// 签名方式 不需修改
	public static String sign_type = "RSA";

}
