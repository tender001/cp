package com.caipiao.cpweb.user;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.ErrCode;
import com.caipiao.cpweb.login.util.AlipayUtil;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.UserCheckUtil;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;

public class UserBeanImpl extends BaseImpl {

	public int set_login_status(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (bean.getBusiErrCode() == 0) {
			HttpSession session = request.getSession();
			session.setAttribute(BaseImpl.USEQ_KEY, bean.getUseq());
			session.setAttribute(BaseImpl.UID_KEY, bean.getUid());
			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
			session.setAttribute("rand", "");
			bean.setYzm("");
		}
		return 1;
	}
	
	public int queryresult(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if("u_ainfo".equals(bean.getFid())){
			if(bean.getBusiErrCode() == 0){
				JXmlWapper xml = JXmlWapper.parse(bean.getBusiXml());
				request.getSession().setAttribute(BaseImpl.VLEVEL, xml.getStringValue("@vlevel"));
			}
		}
		return 1;
	}

	public int modify_result(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (bean.getBusiErrCode() == 0 && bean.getFid().equalsIgnoreCase("u_pass")) {
			HttpSession session = request.getSession();
			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
		}
		return 1;
	}

	public int set_base_data(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_base_data(bean, context, request, response);
	}

	public int set_user_data(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_user_data(bean, context, request, response);
	}

	public int check_login(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}

	public int sqlcheck_login(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (bean.getFid().equalsIgnoreCase("u_modi_rinfo")) {
			checkYzm(bean, context, request, response);
		}
		return BaseImpl.sqlcheck_login(bean, context, request, response);
	}
	
	public int chk_login(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.chk_login(bean, context, request, response);
	}

	public int login_out(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.login_out(bean, context, request, response);
	}

	public static int checkYzm(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String yzm = (String) session.getAttribute("rand");
		String nyzm = bean.getYzm();
		if (!CheckUtil.isNullString(yzm) && !CheckUtil.isNullString(nyzm)) {
			if (yzm.equalsIgnoreCase(nyzm)) {
				return 1;
			} else {
				bean.setBusiErrCode(9996);
				bean.setBusiErrDesc("验证码错误");
				return 0;
			}
		} else {
			bean.setBusiErrCode(9996);
			bean.setBusiErrDesc("验证码错误");
			return 0;
		}
	}

	public static int setComeFrom(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String regfrom = bean.getComeFrom();
		String host = request.getHeader("Host");
		String backurl = bean.getBackurl();
		int flag = bean.getFlag();

		if (!CheckUtil.isNullString(regfrom) && host.endsWith(".159cai.com")) {
			String cookieName = "regfrom";
			Cookie cookie = new Cookie(cookieName, regfrom);
			cookie.setDomain("159cai.com");
			cookie.setMaxAge(7 * 24 * 60 * 60);
			cookie.setPath("/");
			response.addCookie(cookie);
		}
		if (!CheckUtil.isNullString(backurl)) {
			response.sendRedirect(backurl);
		} else {
			if (flag == 1) {
				regfrom = BaseImpl.getComeFrom(request);
				BaseImpl.write_html_response("{regfrom:" + regfrom + "}", response);
			} else {
				response.sendRedirect("/");
			}
		}
		return 1;
	}

	/**
	 * 区分域名
	 */
	private String dealSetDomain(HttpServletRequest request) {
		String contextPath = dealContextPath(request);
		return contextPath;
	}

	private String dealContextPath(HttpServletRequest request) {
		String allPath = request.getRequestURL().toString();
		String servletPath = request.getServletPath();
		String contextPath = "http://www.159cai.com";
		if (allPath.indexOf(servletPath) > -1) {
			contextPath = allPath.substring(0, allPath.indexOf(servletPath));
		}

		return contextPath;
	}

	/**
	 * 用户发起绑定
	 */
	public int user_bind(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		bean.setBusiErrCode(0);
		if (bean.getFlag() == 0 || bean.getFlag() == 1) {// 邮箱。手机
			HttpSession session = request.getSession();
			String uid = (String) session.getAttribute(BaseImpl.UID_KEY);
			bean.setUid(uid);
		} else {
			bean.setBusiErrCode(-100);
			bean.setBusiErrDesc("绑定类型不支持");
			return 0;
		}
		bean.setBackurl(dealSetDomain(request));
		return 1;
	}

	/**
	 * 用户绑定验证
	 */
	public int user_bindyz(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		bean.setBusiErrCode(0);
		if (bean.getFlag() == 0) {// 邮箱

		} else if (bean.getFlag() == 1) {
			HttpSession session = request.getSession();
			String uid = (String) session.getAttribute(BaseImpl.UID_KEY);
			bean.setUid(uid);
		} else {
			bean.setBusiErrCode(-100);
			bean.setBusiErrDesc("绑定类型不支持");
			return 0;
		}
		return 1;
	}

	/**
	 * 用户忘记密码提交
	 */
	public int forgetpwd(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		bean.setBusiErrCode(0);

		if (UserCheckUtil.isNullString(bean.getUid())) {
			bean.setBusiErrCode(ErrCode.ERR_CHECK);
			bean.setBusiErrDesc("用户名不能为空");
		}
		if (bean.getFlag() != 0 && bean.getFlag() != 1 && bean.getFlag() != 2) {
			bean.setBusiErrCode(ErrCode.ERR_CHECK);
			bean.setBusiErrDesc("不支持的找回密码方式");
		}
		if (bean.getFlag() == 0 && !UserCheckUtil.isEmail(bean.getNewValue())) {
			bean.setBusiErrCode(ErrCode.ERR_CHECK);
			bean.setBusiErrDesc("电子邮箱格式不正确");
		}
		if (bean.getFlag() == 1 && !UserCheckUtil.isMobilephone(bean.getNewValue())) {
			bean.setBusiErrCode(ErrCode.ERR_CHECK);
			bean.setBusiErrDesc("手机号码格式不正确");
		}
		if (bean.getFlag() == 2 && CheckUtil.isNullString(bean.getNewValue())) {
			bean.setBusiErrCode(ErrCode.ERR_CHECK);
			bean.setBusiErrDesc("密保信息不能为空");
		}

		bean.setBackurl(dealSetDomain(request));
		return 1;
	}
	
	public int check_level(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String V_level = (String) session.getAttribute(BaseImpl.VLEVEL);
		if("3".equals(V_level) || "4".equals(V_level)){
			return 1;
		}
		return 0;
	}
	
	public int time(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("<row ");
		long time = System.currentTimeMillis();
		sb.append(JXmlUtil.createAttrXml("timel", "" + time));
		sb.append(JXmlUtil.createAttrXml("timef", "" + DateUtil.getDateTime(time)));
		sb.append(" />");
		bean.setBusiXml(sb.toString());
		return 0;
	}
	
	public int alipay_go_bind(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		if(session.getAttribute(BaseImpl.UID_KEY) != null && session.getAttribute("allyid") != null){
			bean.setUser_id("" + session.getAttribute("allyid"));
			bean.setUseq("" + session.getAttribute(BaseImpl.USEQ_KEY));
			bean.setUid("" + session.getAttribute(BaseImpl.UID_KEY));
			bean.setComeFrom("alipay");
			return 1;
		}
		request.getRequestDispatcher(request.getContextPath() + "/user/alipay/accountbind.html").forward(request, response);
		return 0;
	}
	
	/**
	 * 提交账户通绑定数据到支付宝
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int alipayBind_result(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String user_id = bean.getUser_id();
		if(StringUtil.isEmpty(user_id)){
			bean.setComeFrom("provider");
			session.setAttribute("xforward", "159");
			user_id = "";
		}
		AlipayUtil.account_asset_bind(request, response, user_id, bean.getUseq(), bean.getUid(), bean.getComeFrom());
		if(session.getAttribute("xforward") == null){
			request.getSession().invalidate();
		}
		return 0;
	}	
	
	/**
	 * 支付宝账户通绑定
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int alipayBind(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		String uid = "";
		if(session.getAttribute("xforward") == null){//支付宝发起 alipay
			uid = "";
		}else{//网站发起 provider
			uid = (String) session.getAttribute(BaseImpl.UID_KEY);
		}

		String user_id = request.getParameter("user_id");
		if (CheckUtil.isNullString(user_id)) {
			String s_user_id = (String) session.getAttribute("allyid");
			if (!CheckUtil.isNullString(s_user_id)) {
				user_id = s_user_id;
			}
		}else{
			session.setAttribute("allyid", user_id);
		}
		
		if(StringUtil.isEmpty(user_id)){
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("参数错误");
			return 0;
		}
		
		if ( CheckUtil.isNullString(uid) ) {
			response.sendRedirect("/phpu/alipayGoBind.phpx");
		} else {
			bean.setUid(uid);
			bean.setComeFrom("alipay");  //绑定来源
			bean.setUser_id(user_id);
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("成功");
			return 1;
		}
		return 0;
	}
	
	public int alipay_notify(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean check = AlipayUtil.alipay_notify(request, response);
		if(check){
			System.out.println("alipay_notify ------- success");
			bean.setUser_id(request.getParameter("user_id"));
			bean.setUid(new String(request.getParameter("b_user_name").getBytes("ISO-8859-1"), "UTF-8"));
			return 1;
		} else {
			System.out.println("alipay_notify ------- failure");
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("验证未通过!");
		}
		return 0;
	}
	
	public int alipayNotify_result(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Object obj = bean.getBusiObject();
		boolean flag = false;
		if(obj != null){
			List<String> list = (List<String>) obj;
			if(list.size() > 0){
				flag = true;
			}
			for(String url : list){
				JXmlWapper xml = JXmlWapper.parseUrl(url);
				if(xml != null){
					if(!"T".equals(xml.getStringValue("is_success"))){
						System.out.println(xml.toXmlString("utf-8"));
						flag = false;
					}
				}
			}
		}
		
		String contents = "success";
		if(bean.getBusiErrCode() != 0 || !flag){
			contents = "fail";
		}
		BaseImpl.write_html_response(contents, response);
		return 0;
	}
}
