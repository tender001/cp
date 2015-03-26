package com.caipiao.cpweb.login;

import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Vector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;



import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.login.util.AlipayUtil;
import com.caipiao.cpweb.login.util.QQUtil;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.user.UserBean;
import com.caipiao.cpweb.util.Des3Util;
import com.caipiao.cpweb.util.GroupContain;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;
import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;

public class AllyLoginImpl {

	public final static String MD5_KEY = "http://www.jincaiunion.com/";
	/**
	 * 联合登录接口
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int allylogin(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bean.getType() == AllyLogin.ALIPAY){
			AlipayUtil.sendLogin(request, response);
		}else if(bean.getType() == AllyLogin.QQ){
			QQUtil.sendLogin(request, response);
		}
		return 0;
	}
	
	/**
	 * 支付宝联合登录回调地址
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int alipay(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean issuc = AlipayUtil.callBack(request);
		if(issuc){
			HttpSession session = request.getSession();
			bean.setMerchantacctid((String) session.getAttribute("allyid"));
			bean.setType(AllyLogin.ALIPAY);
//			if ((String) session.getAttribute("alipay_email") !=null){
//				bean.setMemo((String) session.getAttribute("alipay_email"));
//			}
			bean.setMemo("");
			System.out.println("bean.getMerchantacctid()======="+bean.getMerchantacctid());
			System.out.println("bean.getType()======="+bean.getType());
			System.out.println("bean.getMemo()======="+bean.getMemo());
			return 1;
		}else{
			bean.setBusiErrCode(-100);
			bean.setBusiErrDesc("系统繁忙,稍后再试");
		}
		return 0;
	}
	
	/**
	 * QQ联合登录回调接口
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int qq(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean issuc = QQUtil.callBack(request);
		if(issuc){
			bean.setMerchantacctid((String) request.getSession().getAttribute("allyid"));
			bean.setType(AllyLogin.QQ);
			bean.setMemo("qq");
			//通用设置cookie
//			Cookie cookie = new Cookie("cookie_source","qqlogin|"+bean.getMerchantacctid());
//			cookie.setSecure(false);
//			cookie.setPath("/");
//			cookie.setMaxAge(24*3600);
//			response.addCookie(cookie);
			
			return 1;
		}else{
			bean.setBusiErrCode(-100);
			bean.setBusiErrDesc("系统繁忙,稍后再试");
		}
		return 0;
	}
	
	
	/**
	 * 智恒登录接口
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int zhiheng(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String userId ="";
		if(request.getParameter("Messages")!=null&&request.getParameter("Messages")!=""){
			String  messages = new String(Base64.decode(request.getParameter("Messages")), "UTF-8");
			messages =Des3Util.Decrypt(messages, "123456789123456789123456", new byte[]{});
//			System.out.println("----------"+messages);
			JXmlWapper xml = JXmlWapper.parse(messages);
			userId = xml.getStringValue("userId");
			String pwd = MD5Util.compute("123456" + MD5_KEY);
			bean.setPwd(pwd);
			bean.setUid("QSQ_"+userId);
		}
		bean.setType(AllyLogin.ZH);
		return 1;
	}
	
	
	public int sendbind(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bean.getBusiErrCode() == 0){//登陆成功
			if(bean.getType() == AllyLogin.ALIPAY){
				if(bean.getSource() == 0){//未绑定
					boolean flag = AlipayUtil.account_asset_quick_bind(request, bean);//快捷登陆绑定
					if(flag){
						UserBean ub = new UserBean();
						ub.setUid(bean.getUid());
						ub.setUser_id(bean.getMerchantacctid());
						int rc = RemoteBeanCallUtil.RemoteBeanCall(ub, context, GroupContain.USER_GROUP, "alipayNotify");
						if(rc == 0){
							if(ub.getBusiErrCode() == 0){
								//即时推送信息
								Object obj = ub.getBusiObject();
								if(obj != null){
									List<String> list = (List<String>) obj;
									for(String url : list){
										JXmlWapper xml = JXmlWapper.parseUrl(url);
										if(xml != null){
											System.out.println(xml.toXmlString("utf-8"));
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return 1;
	}
	
	public int result(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("bean.getBusiErrCode()======="+bean.getBusiErrCode());
		System.out.println("bean.getBusiErrCode()======="+bean.getBusiErrDesc());
		System.out.println("bean.getType()======="+bean.getType());
		if(bean.getBusiErrCode() == AllyLogin.LOGIN_SUCCESS){
			HttpSession session = request.getSession();
			session.setAttribute(BaseImpl.USEQ_KEY, bean.getUseq());
			session.setAttribute(BaseImpl.UID_KEY, bean.getUid());
			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
			if( bean.getType() == AllyLogin.ALIPAY && request.getParameter("target_url") != null){//etao
				response.sendRedirect(request.getParameter("target_url"));
			}else{
				String callBack = "/";
				if(bean.getType() == AllyLogin.ALIPAY || bean.getType() == AllyLogin.QQ){
					if(request.getSession().getAttribute("backurl") != null){
						callBack =  StringUtil.getNullString(""+request.getSession().getAttribute("backurl"));
					}
				}
				response.sendRedirect(callBack);
			}
		}else if(bean.getBusiErrCode() == AllyLogin.LOGIN_INVALID){
			response.sendRedirect("/");
		}else if(bean.getBusiErrCode() == AllyLogin.LOGIN_NOT_EXIST || bean.getBusiErrCode() ==1010){ //存储为1010
			if(bean.getType() == AllyLogin.ALIPAY){
				//String token = StringUtil.getNullString(request.getSession().getAttribute("alipay_token"));
				//AlipayUtil.logisticsQuery(request, response, token);
				//不回调物流地址信息接口 直接网站页面注册显示
				response.sendRedirect("/user/alipaylogin.html");
			}else if(bean.getType() == AllyLogin.QQ){
				//response.sendRedirect("/user/qq_reg.html");
				//直接注册用户入库
				HttpSession session = request.getSession();
				bean.setIpAddr(BaseImpl.getRealIp(request));
				bean.setComeFrom(BaseImpl.getComeFrom(request));
				bean.setHost(request.getServerName());
				bean.setType(2);
				if(bean.getIsNew() != 0){
					bean.setIsNew(1);
				}
				bean.setMerchantacctid((String) session.getAttribute("allyid"));
				bean.setMemo("" + session.getAttribute("memo"));
				if(bean.getComeFrom().equals("normal")){
					bean.setComeFrom("" + session.getAttribute("memo"));
				}
				//用户名以及密码设定
				String nickname=(String) session.getAttribute("nickname");
				if(!QQUtil.CheckUserName(nickname)){
					bean.setUid("QQ_user");
				}else{
					bean.setUid("QQ_"+nickname);
				}
				bean.setPwd(bean.getMerchantacctid().substring(0, 6));
				//System.out.println("bean.getPwd()======="+bean.getPwd());
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "bind");
                if (rc != 0 || bean.getBusiErrCode() != 0) {
                    //throw new Exception("失败：" + bean.getBusiErrDesc());
                }else{
        			session.setAttribute(BaseImpl.UID_KEY, bean.getBusiErrDesc());
        			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
                }
                response.sendRedirect("/");
			}else if(bean.getType() == AllyLogin.ZH){
				//response.sendRedirect("/user/qq_reg.html");
//				System.out.println("-----bean.getUid()-------"+bean.getUid());
				if(!StringUtil.isEmpty(bean.getUid())){
					//直接注册用户入库
					HttpSession session = request.getSession();
					String userId = "";
					String mailAddr ="";
					String mobileNo ="";
					String certNo ="";
					String realName ="";
					String bankCode ="";
					String bankCard ="";
					String bankName ="";
					String provid ="";
					String cityid ="";
					
					
					bean = new AllyLogin();//此处要设置新对象否则RemoteBeanCall调用后，sql映射对象有误。
					if(request.getParameter("Messages")!=null&&request.getParameter("Messages")!=""){
						String  messages = new String(Base64.decode(request.getParameter("Messages")), "UTF-8");
						messages =Des3Util.Decrypt(messages, "123456789123456789123456", new byte[]{});
						JXmlWapper xml = JXmlWapper.parse(messages);
						
						userId = xml.getStringValue("userId");
						bean.setUid("QSQ_"+userId);
						
						bean.setComeFrom("59875");//代理商
						
						mailAddr = xml.getStringValue("mailAddr");
						bean.setMailAddr(mailAddr);
						
						mobileNo = xml.getStringValue("mobileNo");
						bean.setMobileNo(mobileNo);
						
						certNo = xml.getStringValue("certNo");
						bean.setCertNo(certNo);
						
						realName = xml.getStringValue("realName");
						bean.setRealName(realName);
						
						bankCode = xml.getStringValue("bankCode");
						bean.setBankCode(bankCode);
						
						bankCard = xml.getStringValue("bankCard");
						bean.setBankCard(bankCard);
						
						bankName = xml.getStringValue("bankName");
						bean.setBankName(bankName);
						
						provid = xml.getStringValue("provid");
						bean.setProvid(provid);;
						
						cityid = xml.getStringValue("cityid");
						bean.setCityid(cityid);
						
						String pwd = MD5Util.compute("123456" + MD5_KEY);
						bean.setPwd(pwd);
						
					}
//					System.out.println("bean.getPwd()======="+bean.getPwd());
					int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.USER_GROUP, "registerUser");
	                if (rc != 0 || bean.getBusiErrCode() != 0) {
	                    throw new Exception("失败：" + bean.getBusiErrDesc());
	                }else{
	        			session.setAttribute(BaseImpl.UID_KEY, bean.getUid());
	        			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
	                }
				}
                response.sendRedirect("/");
			}else{
				response.sendRedirect("/");
			}
		}
		return 0;
	}	
	
	public int allyinfo(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Object type =  request.getSession().getAttribute("islogin");
		if(type == null){
			BaseImpl.write_html_response("{'type':" + 0 + "}",response);
		}else{
			if(type.equals("" + AllyLogin.ALIPAY)){
				BaseImpl.write_html_response("{'type':" + type + ",'info':'" + request.getSession().getAttribute("alipay_email") + "'}",response);
			}else if(type.equals("" + AllyLogin.QQ)){
				if(CheckUtil.isNullString((String) request.getSession().getAttribute("qqsource"))){
					BaseImpl.write_html_response("{'type':" + type + ",'memo':'qqcaibei','showmsg':'" + request.getSession().getAttribute("showmsg") + "','headshow':'" + request.getSession().getAttribute("headshow") + "','info':'" + request.getSession().getAttribute("nickname") + "'}",response);
				}else{
					BaseImpl.write_html_response("{'type':" + type + ",'memo':'qq','info':'" + request.getSession().getAttribute("nickname") + "'}",response);
				}
			}else if(type.equals("" + AllyLogin.BF)){
				BaseImpl.write_html_response("{'type':" + type + ",'info':'" + request.getSession().getAttribute("nickname") + "'}",response);
			}else{
				BaseImpl.write_html_response("{'type':" + type + "}",response);
			}
		}
		return 0;
	}
	
	public int bindResult(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Object type =  request.getSession().getAttribute("islogin");
		int t = 0;
		if(type != null){
			t = Integer.parseInt((String)type); 
		}
		String path = "/";
		if(bean.getBusiErrCode() == 0){
			HttpSession session = request.getSession();

			session.setAttribute(BaseImpl.USEQ_KEY, bean.getUseq());
			session.setAttribute(BaseImpl.UID_KEY, bean.getUid());
			session.setAttribute(BaseImpl.PWD_KEY, bean.getPwd());
			path = StringUtil.getNullString(""+request.getSession().getAttribute("backurl"));
		}
		
		if(!StringUtil.isEmpty(path)){
			BaseImpl.write_html_response("{'t':" + t + ",'c':" + bean.getBusiErrCode() + ",'e':'" + bean.getBusiErrDesc() + "','p':'"+path+"'}", response);
		}else{
			BaseImpl.write_html_response("{'t':" + t + ",'c':" + bean.getBusiErrCode() + ",'e':'" + bean.getBusiErrDesc() + "'}", response);
		}
		return 0;
	}
	
	public static int checkYzm(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		HttpSession session = request.getSession();
		//String yzm = (String) session.getAttribute("rand");
		bean.setIpAddr(BaseImpl.getRealIp(request));
		bean.setComeFrom(BaseImpl.getComeFrom(request));
		bean.setHost(request.getServerName());
		//String nyzm = bean.getYzm();
//		if (! CheckUtil.isNullString(yzm) && ! CheckUtil.isNullString(nyzm)) {
//			if ( yzm.equalsIgnoreCase(nyzm)) {
				if(session.getAttribute("islogin") != null){
					bean.setType(Integer.parseInt((String)session.getAttribute("islogin")));
					bean.setMerchantacctid((String) session.getAttribute("allyid"));
					if(bean.getIsNew() != 0){
						bean.setIsNew(1);
					}
					if(bean.getType() == AllyLogin.ALIPAY){
						bean.setMemo((String) session.getAttribute("allyid"));
//						bean.setMemo((String) session.getAttribute("alipay_email"));
						bean.setAllyType(StringUtil.getNullInt(session.getAttribute("alipay_user_grade_type")));
//						bean.setCertNo("" + session.getAttribute("alipay_cert_no"));
//						bean.setRealName("" + session.getAttribute("alipay_real_name"));
//						bean.setMobileNo("" + session.getAttribute("alipay_mobile"));
						bean.setReferer("" + session.getAttribute("alipay_referer"));
//						if(session.getAttribute("alipay_comefrom")!= null){
//							bean.setComeFrom("alipay_vip");
//							bean.setReferer("https://vip.alipay.com");
//						}
//						if (bean.getReferer().indexOf("vip.alipay.com") != -1) {
//							bean.setComeFrom("alipay_vip");
//						}
					}else{
						//System.out.println("session======="+session.getAttribute("memo"));
						bean.setMemo("" + session.getAttribute("memo"));
						//System.out.println("bean1======="+bean.getMemo());
						//System.out.println("bean2======="+bean.getComeFrom());
						if(bean.getComeFrom().equals("normal")){
							bean.setComeFrom("" + session.getAttribute("memo"));
						}
						//System.out.println("bean3======="+bean.getComeFrom());
					}
					return 1;
				}else{
					BaseImpl.write_html_response("{'t':0,'c':-1,'e':'操作流程有误'}", response);
					return 0;
				}
//			} else {
//				BaseImpl.write_html_response("{'t':0,'c':-1,'e':'验证码错误'}", response);
//				return 0;
//			}
//		} else {
//			BaseImpl.write_html_response("{'t':0,'c':-1,'e':'验证码错误'}", response);
//			return 0;
//		}
	}
	
	/**
	 * 支付宝物流查询回调地址
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int logistics(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		boolean issuc = AlipayUtil.logisticsBack(request, response);
		if(issuc){
			if(CheckUtil.isNullString(request.getSession().getAttribute("alipay_cert_no")+"") && CheckUtil.isNullString(request.getSession().getAttribute("al_email")+"") && CheckUtil.isNullString(request.getSession().getAttribute("alipay_mobile")+"")){
				response.sendRedirect("/");
			}else{
				response.sendRedirect("/user/alipaylogin.html");
			}
			return 1;
		}else{
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("系统繁忙,稍后再试");
		}
		return 0;
	}
	
	
	/**
	 * qq彩贝联合登录接口
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int qqcaibei(AllyLogin bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		final String QQ_FANLI_CONNECT_KEY1 = "caibei123test1"; //TODO:这里先填写测试的key,后续上线前需要QQ彩贝给到正式的key替换这里
		final String QQ_FANLI_CONNECT_KEY2 = "caibei123test2"; //TODO:这里先填写测试的key,后续上线前需要QQ彩贝给到正式的key替换这里
		
		final String MALL_HOME_PAGE_URL = "http://www.159cai.com"; //商家站点首页

		//------------第一步：验证MD5------------
		//将form参数按照字典序进行排序
		Enumeration params = request.getParameterNames();
		Vector vc = new Vector();
		while( params.hasMoreElements() ) {
		    vc.add( (String)params.nextElement() );
		}
		String[] paramArr = (String[])vc.toArray(new String[1]);
		int paramLen = paramArr.length;
		int tempLen  = paramLen - 1;
		int i,j;
		String tempStr = "";
		for(i=0 ; i<tempLen ; i++) {
		    for(j=i+1 ; j<paramLen ; j++) {
		        if( paramArr[i].compareTo( paramArr[j] ) > 0 ) {
		            tempStr = paramArr[i];
		            paramArr[i] = paramArr[j];
		            paramArr[j] = tempStr;
		        }
		    }
		}

		//进行md5加密比较
		String rawMd5Str = "";
		for(i=0 ; i<paramLen ; i++) {
		    if( paramArr[i].compareTo("Vkey") != 0 ) { //签名串不要Vkey这个参数
		        rawMd5Str += request.getParameter(paramArr[i]);
		    }
		}

		String md5_1    = ( QQUtil.MD5( rawMd5Str + QQ_FANLI_CONNECT_KEY1 ) ).toLowerCase();
		String md5_2    = ( QQUtil.MD5( md5_1 + QQ_FANLI_CONNECT_KEY2 ) ).toLowerCase();

		String vkey = request.getParameter("Vkey");
		if( vkey != null && md5_2.compareTo(vkey) != 0 ) {
		    //如果vkey检测不通过，那么跳转到商家首页
		    response.sendRedirect(MALL_HOME_PAGE_URL);
		    //out.println(MALL_HOME_PAGE_URL + "<br>");
		    return 0;
		}
		
		String url = request.getParameter("Url"); //目标地址

		//System.out.println("url======="+url);
		
		if(!StringUtil.isEmpty(url)){
	    	request.getSession().setAttribute("backurl", url);
		}else{
			request.getSession().setAttribute("backurl", "/");
		}
		
		//-------------第二步,进行联合登录态的设置，
		//这里由于跟各个商家的实现不同都会不一样，
		//商家可以填充这里的逻辑,示例代码只给出伪码表示-------------

		String acct = request.getParameter("Acct");
		
		String openId = request.getParameter("OpenId");
		
		request.getSession().setAttribute("islogin", "" + AllyLogin.QQ);
	    request.getSession().setAttribute("allyid", openId);
	    request.getSession().setAttribute("memo", "qqcaibei");
	    request.getSession().setAttribute("host", request.getServerName());
	    request.getSession().setAttribute("qqsource", null);
	     
	    bean.setMerchantacctid(openId);
		bean.setType(AllyLogin.QQ);
		bean.setMemo("qqcaibei");
		/*
		if( DB没有用户 acct ){
		    //创建帐户，创建帐户的时候需要保存acct、openid到DB，openid在推送订单给 彩贝/网盟 的时候需要带上
		    String openId = request.getParameter("OpenId");

		    if(创建用户帐户失败) {
		        response.sendRedirect( url );
		        return;
		    }
		}

		if (clubInfo == XX)
		{
		    //针对会员给出大优惠
		}
		*/


		//------------第三步：设置提示语等信息给用户展示------------
		//String view_info = htmlEncode( viewinfo.replaceAll("&nbsp;", " ") ).replaceAll(" ", "&nbsp;");
		String viewinfo = request.getParameter("ViewInfo");
		String[] arr1 = viewinfo.split("&");
		String[] arr2 = {};
		HashMap viewinfoMap = new HashMap();
		int arrLen = arr1.length;
		for(i=0 ; i<arrLen ; i++) {
		    arr2 = arr1[i].split("=");
		    if( arr2.length > 1 ) {
		        //这里的编码请自行指定
		        viewinfoMap.put( arr2[0] , URLDecoder.decode(arr2[1],"UTF-8") );
		    }
		}


		String showmsg = (String)viewinfoMap.get("ShowMsg");
		request.getSession().setAttribute("showmsg", showmsg);
		//System.out.println("showmsg======="+showmsg);
		//存入Cookie的时候使用encode，取出的时候再使用decode，这样解决中文乱码问题
		//Cookie ck = new Cookie( "showmsg" , URLEncoder.encode(showmsg) );
		//response.addCookie(ck);
		/*取Cookie示例
		Cookie[] cc = request.getCookies();
		out.print(URLDecoder.decode(cc[0].getValue()) + "<br>");
		*/
		//用户的QQ昵称，根据需要保存cookie
		String nickname = (String)viewinfoMap.get("NickName");
		//System.out.println("nickname======="+nickname);
		request.getSession().setAttribute("nickname", nickname);
		//response.addCookie(nickname);

		//彩贝提示条，需要显示在站点顶部
		String headshow = (String)viewinfoMap.get("HeadShow");
		request.getSession().setAttribute("headshow", headshow);
		//System.out.println("headshow======="+headshow);
		//response.addCookie(headshow);

		//用户可使用的彩贝积分，根据需要保存cookie
		int point = Integer.parseInt( (String)viewinfoMap.get("CBPoints") );
		//System.out.println("point======="+point);
		//response.addCookie(point);

		//购买后的返利比率，根据需要保存cookie
		String bonus = (String)viewinfoMap.get("CBBonus");
		//System.out.println("bonus======="+bonus);
		//response.addCookie(bonus);


		//统计字段，下单后需要回传
		String attach = request.getParameter("Attach");
		//System.out.println("attach======="+attach);
		//ck = new Cookie( "attach" , attach );
		//response.addCookie(ck);


		//跳转到目标地址
		//response.sendRedirect(url);
		return 1;
	}
}
