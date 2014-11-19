package com.caipiao.cpweb.login.util;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alipay.config.AlipayConfig;
import com.alipay.services.AlipayService;
import com.alipay.util.AlipayNotify;
import com.caipiao.cpweb.login.AlipayLoginConfig;
import com.caipiao.cpweb.login.AllyLogin;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class AlipayUtil {
	public static void sendLogin(HttpServletRequest request,HttpServletResponse response) throws IOException{
		request.getSession().setAttribute("alipay_referer", "" + request.getHeader("referer"));
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return;
		}
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		//选填参数//
		out.println("<title>支付宝快捷登录接口</title>");
		//防钓鱼时间戳
		String anti_phishing_key  = "";
		//获取客户端的IP地址，建议：编写获取客户端IP地址的程序
		String exter_invoke_ip= "";
		//注意：
		//1.请慎重选择是否开启防钓鱼功能
		//2.exter_invoke_ip、anti_phishing_key一旦被设置过，那么它们就会成为必填参数
		//3.开启防钓鱼功能后，服务器、本机电脑必须支持远程XML解析，请配置好该环境。
		//4.建议使用POST方式请求数据
		//示例：
		//anti_phishing_key = AlipayService.query_timestamp();	//获取防钓鱼时间戳函数
		//exter_invoke_ip = "202.1.1.1";
		
		//////////////////////////////////////////////////////////////////////////////////
		
		//把请求参数打包成数组
		Map<String, String> sParaTemp = new HashMap<String, String>();
        sParaTemp.put("anti_phishing_key", anti_phishing_key);
        sParaTemp.put("exter_invoke_ip", exter_invoke_ip);
        //String callBack =  StringUtil.getNullString(request.getHeader("Referer"));	
        //System.out.println("alipay login referer 1 --------------------" + callBack);
        String callBack = request.getParameter("callBack");
        if(StringUtil.isEmpty(callBack)){
        	callBack =  StringUtil.getNullString(request.getHeader("Referer"));
        }
        //System.out.println("alipay login referer 2 --------------------" + callBack);
	    if(!StringUtil.isEmpty(callBack)){
	    	request.getSession().setAttribute("backurl", callBack);
	    	//System.out.println("referer----------" + callBack);
		}else{
			request.getSession().setAttribute("backurl", "/");
		}
		//构造函数，生成请求URL
	    //System.out.println("config.getPartner()----------" + config.getPartner());
	    //System.out.println("config.getReturn_url()----------" + config.getReturn_url());
	    //System.out.println("config.getKey()----------" + config.getKey());
		String sHtmlText = AlipayService.alipay_auth_authorize(sParaTemp, config.getPartner(), config.getReturn_url(), config.getKey());
		//System.out.println("referer----------123");
		//System.out.println("referer----------123"+sHtmlText);
		out.println(sHtmlText);
		out.close();
	}
	
	public static boolean callBack(HttpServletRequest request) throws UnsupportedEncodingException{
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return false;
		}
		Map<String,String> params = new HashMap<String,String>();
		Map<?,?> requestParams = request.getParameterMap();
		for (Iterator<?> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "UTF-8");
			System.out.println(name + "--" + valueStr);
			params.put(name, valueStr);
		}
		
		
		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//

		//支付宝用户id
//		String user_id = request.getParameter("user_id");
		//授权令牌
//		String token = request.getParameter("token");
		
		/*
			sign	44bb01f0096fa8433d1369a532d69352
			is_success	T
			token	201109235fc60f9b66b44730879217ec2841effc
			email	abc@163.com
			real_name	xx
			sign_type	MD5
			user_id	支付宝账户(2088....)
			notify_id	RqPnCoPT3K9%4Fvwbh3I7e41ZFUAc5orM1zHVbcnBtmwJDE4SuNYoEwCSJ5rbvGTJoDLJC
		 */
		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
		
		//计算得出通知验证结果
		System.out.println("=======");
		System.out.println("config.getKey()======="+config.getKey());
		System.out.println("config.getPartner()======="+config.getPartner());
		boolean verify_result = AlipayNotify.verify(params,config.getKey(),config.getPartner());
		System.out.println("verify_result======="+verify_result);
		if(verify_result){//验证成功
//			String referer = "" + request.getSession().getAttribute("alipay_referer");
			//int ut = StringUtil.getNullInt(params.get("user_grade_type"));
			System.out.println("user_id======="+params.get("user_id"));
			System.out.println("token======="+params.get("token"));
			System.out.println("email======="+params.get("email"));
			System.out.println("real_name======="+params.get("real_name"));
			System.out.println("host======="+request.getServerName());
			request.getSession().setAttribute("islogin", "" + AllyLogin.ALIPAY);
			request.getSession().setAttribute("allyid", params.get("user_id"));
			request.getSession().setAttribute("alipay_token", params.get("token"));
			request.getSession().setAttribute("alipay_email", params.get("email"));
			request.getSession().setAttribute("alipay_real_name", params.get("real_name"));
			//request.getSession().setAttribute("alipay_user_grade_type", ut);
		    request.getSession().setAttribute("host", request.getServerName());
			return true;
		}else{
			return false;
		}
	}
	
	public static boolean alipay_notify(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException{
		System.out.println(request.getRequestURL() + "?" + request.getQueryString());
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return false;
		}
		
		//获取支付宝GET过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map<?,?> requestParams = request.getParameterMap();
		for (Iterator<?> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			valueStr = new String(valueStr.getBytes("ISO-8859-1"), "UTF-8");
			System.out.println(name + "\t" + valueStr);
			params.put(name, valueStr);
		}
		
		boolean verify_result = AlipayNotify.verify(params,config.getKey(),config.getPartner());
		if(verify_result){//验证成功
			return true;
		}
		return false;
	}

	public static void logisticsQuery(HttpServletRequest request,HttpServletResponse response, String token) throws IOException{
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return;
		}
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		//选填参数//
		out.println("<title>支付宝快捷登录接口</title>");
		//防钓鱼时间戳
		//token的有效时间为30分钟，过期后需重新执行快捷登录接口(alipay.auth.authorize)获得新的token
		String return_url = request.getServerName() + "/phpu/alipaylogistics.phpx";
		//把请求参数打包成数组
		Map<String, String> sParaTemp = new HashMap<String, String>();
        sParaTemp.put("token", token);
		//构造函数，生成请求URL
		String sHtmlText = AlipayService.user_logistics_address_query(sParaTemp, config.getPartner(), return_url, config.getKey());
		out.println(sHtmlText);
		out.close();
	}	
	
	public static boolean logisticsBack(HttpServletRequest request,HttpServletResponse response) throws UnsupportedEncodingException{
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return false;
		}
		
		//获取支付宝GET过来反馈信息
		Map<String,String> params = new HashMap<String,String>();
		Map<?,?> requestParams = request.getParameterMap();
		for (Iterator<?> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i]
						: valueStr + values[i] + ",";
			}
			//乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
			//valueStr = new String(valueStr.getBytes("ISO-8859-1"), "UTF-8");
			System.out.println(name + "\t" + valueStr);
			params.put(name, valueStr);
		}
		
		//获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//

		//支付宝用户id
//		String user_id = request.getParameter("user_id");
		//用户选择的收货地址
//		String receive_address = "";
//		if(request.getParameter("receive_address") != null) {
//			receive_address = new String(request.getParameter("receive_address").getBytes("ISO-8859-1"), "utf-8");
//		}
		
		//计算得出通知验证结果
		boolean verify_result = AlipayNotify.verify(params,config.getKey(),config.getPartner());
		if(verify_result){//验证成功
		   String cert_no= "";
		   String cert_type=request.getParameter("cert_type")==null?"":request.getParameter("cert_type").trim();
		   if ("0".equals(cert_type)){//用户证件类型为身份证的时候取证件号码
			   cert_no=request.getParameter("cert_no")==null?"":request.getParameter("cert_no").trim();
		   }
		   String mobile=request.getParameter("mobile")==null?"":request.getParameter("mobile").trim();
		   String email=request.getParameter("email")==null?"":request.getParameter("email").trim();
		   request.getSession().setAttribute("alipay_cert_no", cert_no);
		   request.getSession().setAttribute("al_email", email);
		   request.getSession().setAttribute("alipay_mobile", mobile);
		   return true;
		}else{
			return false;
		}
	}
	
	public static void account_asset_bind(HttpServletRequest request,HttpServletResponse response, String user_id, String b_user_id, String b_user_name, String comefrom) throws IOException{
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return;
		}
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = response.getWriter();
		//选填参数//
		out.println("<!doctype html><html><head><meta charset=\"UTF-8\" /><title>支付宝账户通绑定</title></head><body>");
		
		//把请求参数打包成数组
		Map<String, String> sParaTemp = new HashMap<String, String>();
        sParaTemp.put("user_id", user_id);
        sParaTemp.put("b_user_id", b_user_id);
        sParaTemp.put("b_user_name", b_user_name);
        sParaTemp.put("provider_name", "159彩票");
        sParaTemp.put("bind_from", comefrom);
        String return_url = "http://www.159cai.com/phpu/bind_notify.phpx";
		//构造函数，生成请求URL
		String sHtmlText = AlipayService.alipay_account_asset_bind(sParaTemp, config.getPartner(), return_url, config.getKey());
		out.println(sHtmlText);
		out.println("</body></html>");
		out.close();
	}
	
	public static boolean account_asset_quick_bind(HttpServletRequest request, AllyLogin bean) throws Exception{
		AlipayConfig config = AlipayLoginConfig.getInstance().getConfig(request.getServerName());
		if(config==null){
			return false;
		}
		HttpSession session = request.getSession();

		String user_id = (String) session.getAttribute("allyid");
		String token = (String) session.getAttribute("alipay_token");
		
		Map<String, String> sParaTemp = new HashMap<String, String>();
		sParaTemp.put("timestamp", DateUtil.getCurrentDateTime());
        sParaTemp.put("user_id", user_id);
        sParaTemp.put("b_user_id", bean.getUseq());
        sParaTemp.put("b_user_name", bean.getUid());
		sParaTemp.put("token", token);
		
		String url = AlipayService.alipay_user_account_quick_bind(sParaTemp, config.getPartner(), config.getKey());
		System.out.println("account_asset_quick_bind url=" + url);
		JXmlWapper xml = JXmlWapper.parseUrl(url, null, "utf-8", 30);
		String is_success = xml.getStringValue("is_success");
		if("T".equals(is_success)){
			return true;
		}
		System.out.println("account_asset_quick_bind:" + xml.toXmlString("utf-8"));
		return false;
	}
}
