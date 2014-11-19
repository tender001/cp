package com.caipiao.cpweb;

import java.io.DataOutputStream;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.HeZuoUtil;
import com.caipiao.cpweb.util.SiteBean;
import com.rbc.frame.RbcFrameContext;

public class BaseImpl {

	public static final String USEQ_KEY = "useq";
	public static final String UID_KEY = "uid";
	public static final String PWD_KEY = "pwd";
	public static final String ENCODING = "UTF-8";
	public static final String VLEVEL = "level";
	public static final String SESSION_FORWARD = "session_forward_";
	
	public static int login_out(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		request.getSession().removeAttribute(USEQ_KEY);
		request.getSession().removeAttribute(UID_KEY);
		request.getSession().removeAttribute(PWD_KEY);
		request.getSession().invalidate();
		return 1;
	}

	/**
	 * 
	 */
	public static int check_login(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);
		String seq = (String) session.getAttribute(USEQ_KEY);

		if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("用户未登录");
			return 0;
		} else {
			bean.setUid(uid);
			bean.setPwd(pwd);
			bean.setUseq(seq);
			
			//if(seq != null) System.out.println("useq = " + seq);
			
			bean.setIpAddr(getRealIp(request));
			if (CheckUtil.isNullString(bean.getComeFrom())) {
				bean.setComeFrom(getComeFrom(request));
			}
			return 1;
		}
	}

	public static int sqlcheck_login(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);

		String s = System.getProperty("no_login_fids");
		if (CheckUtil.isNullString(s)) {
			s = context.getServletContext().getInitParameter("no_login_fids");
			if (!CheckUtil.isNullString(s)) {
				System.setProperty("no_login_fids", s);
			} else {
				s = "";
			}
		}
		
		boolean bln = true ;
		if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {//未登录
			if ( ! CheckUtil.isNullString(bean.getFid()) ) {
				if ( s.indexOf("," + bean.getFid() + ",") < 0 ) {
					bln = false ;
				}
			} else {
				bln = false ;
			}
		}

		if ( bln ) {
			if ( CheckUtil.isNullString(bean.getUid())) {
				bean.setUid(uid);
			}
			bean.setPwd(pwd);
			bean.setIpAddr(getRealIp(request));
			if (CheckUtil.isNullString(bean.getComeFrom())) {
				bean.setComeFrom(getComeFrom(request));
			}
			return 1;
		} else {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("用户未登录");
			return 0;
		}
	}
	
	public static int chk_login(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);

		if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("用户未登录");
			return 0;
		} else {
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("用户已登录");
			return 1;
		}
	}

	public static int set_base_data(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (CheckUtil.isNullString(bean.getComeFrom())) {
			bean.setComeFrom(getComeFrom(request));
		}
		bean.setIpAddr(getRealIp(request));
		return 1;
	}

	public static int set_user_data(BaseBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		if ( CheckUtil.isNullString(bean.getComeFrom())) {
			bean.setComeFrom(getComeFrom(request));
		}
		String uid = (String) session.getAttribute(UID_KEY);
		if ( ! CheckUtil.isNullString(uid) ) {
			bean.setUid(uid);
		}
		String pwd = (String) session.getAttribute(PWD_KEY);
		if ( ! CheckUtil.isNullString(pwd) ) {
			bean.setPwd(pwd);
		}
		String seq = (String) session.getAttribute(USEQ_KEY);
		if ( ! CheckUtil.isNullString(seq) ) {
			bean.setUseq(seq);
		}		
		bean.setIpAddr(getRealIp(request));
		
		return 1;
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

	public static String getRealIp(HttpServletRequest request) {
		String ip = request.getRemoteAddr();
		if (ip.indexOf("192.168") > -1 || ip.indexOf("127.0.0") > -1) {
			String xf = request.getHeader("X-Forwarded-For");
			if (xf != null) {
				return xf.split(",")[0];
			} else {
				return ip;
			}
		} else {
			return ip;
		}
	}

	public static String getComeFrom(HttpServletRequest request) {
		String regfrom = null;

		// 根据域名写入代理商，没有则按原有流程走
		String host = request.getHeader("Host");
		SiteBean sBean = HeZuoUtil.getSite(host);
		if (sBean == null) {
			Cookie cookies[] = request.getCookies();
			Cookie sCookie = null;
			String svalue = null;
			String sname = null;
			if (cookies != null) {
				for (int i = 0; i < cookies.length; i++) {
					sCookie = cookies[i];
					svalue = sCookie.getValue();
					sname = sCookie.getName();
					if (sname != null && sname.equalsIgnoreCase("regfrom")) {
						regfrom = svalue;
					}
				}
			}
		} else {
			regfrom = sBean.getRegfrom();
		}

//System.out.println("1 regfrom=" + regfrom + " host=" + host );		
		
		if (host.endsWith(".qq.159cai.com")||host.endsWith(".vip.159cai.com")||host.endsWith(".agent.159cai.com")||host.endsWith(".alipay.159cai.com")||host.endsWith(".ok.159cai.com")){

			int pos = host.indexOf(".");
			String agent = host.substring(0, pos);
			
//System.out.println("  -->  agent=" + agent);			
			if (agent.matches("[0-9a-zA-Z]+")){
				regfrom=agent;
			}
		}
//System.out.println("2 regfrom=" + regfrom + " host=" + host );		
		if (regfrom == null || regfrom.length() == 0) {
			regfrom = "normal";
		}
		return regfrom;
	}
}
