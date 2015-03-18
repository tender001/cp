package com.caipiao.mob.bank;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.rbc.frame.RbcFrameContext;

public class BankBeanImpl {
	
	public static Logger logger = LoggerFactory.getLogger("pay");
	
	public static final String ENCODING = "UTF-8";
	public static String RETURN_HOST = "http://mapi.159cai.com";// 通知返回的HOST
	
	public int addmoneyMsg(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		if("zfb".equalsIgnoreCase(bean.getChannel())){
			
		} else if("19pay".equalsIgnoreCase(bean.getChannel())){
			
			Bank_19pay.send(bean, context, request, response);
			
		} else if("upmp".equalsIgnoreCase(bean.getChannel())){
			
			Bank_umpay.send(bean, context, request, response);
			
		}else if("llpay".equalsIgnoreCase(bean.getChannel())){
			
		}else{
			logger.error("未知的检查类型"+bean.getBankID());
			write_html_response("fail", response);
		}
		
		if (!StringUtil.isEmpty(bean.getRedirect())) {
			URL getUrl = new URL(bean.getRedirect()); 
			HttpURLConnection connection = (HttpURLConnection) getUrl.openConnection();
			try{
				connection.connect(); 
				BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream())); 
				StringBuffer buffer = new StringBuffer();
				String lines;
				while ((lines = reader.readLine()) != null) { 
					buffer.append(lines);
				}
				reader.close(); 
				connection.disconnect();
				System.out.println("----buffer---------"+buffer.toString());
				String traceNum = buffer.substring(buffer.indexOf("&trade_no=")+10).substring(0,16);
				JSONObject object = new JSONObject(bean.getJson());
				object.put("dealid", traceNum);
				bean.setJson(object.toString());
				
			}catch(Exception e){
				e.printStackTrace();
			} finally {
				if (connection != null) {
					connection.disconnect();
				}
			}
			 
		} 
		return 0;
	}
	
	public int alipayNotify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Bank_zfb.notify(bean, context, request, response);
		return 0;
	}
	public int alipayNotify_upmp(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Bank_umpay.notify(bean, context, request, response);
		return 0;
	}
	public int alipayNotify_19pay(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Bank_19pay.notify(bean, context, request, response);
		return 0;
	}
	
	public int alipayWapNotify(BankBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		Bank_zfb.wapNotify(bean, context, request, response);
		return 0;
	}
	
	public static void write_html_response(String contents, HttpServletResponse response) throws Exception {
		response.setContentType("text/html; charset=" + ENCODING);
		response.setCharacterEncoding(ENCODING);
		DataOutputStream out = new DataOutputStream(response.getOutputStream());
		StringBuffer buffer = new StringBuffer();
		buffer.append(contents);
		out.write((new String(buffer)).getBytes(ENCODING));
		out.flush();
		out.close();
	}

}
