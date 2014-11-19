package com.caipiao.cpweb.login.util;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.login.AllyLogin;
import com.qq.connect.QQConnectException;
import com.qq.connect.api.OpenID;
import com.qq.connect.api.qzone.PageFans;
import com.qq.connect.api.qzone.UserInfo;
import com.qq.connect.javabeans.AccessToken;
import com.qq.connect.javabeans.qzone.PageFansBean;
import com.qq.connect.javabeans.qzone.UserInfoBean;
import com.qq.connect.javabeans.weibo.Company;
import com.qq.connect.oauth.Oauth;

public class QQUtil {
	public static void sendLogin(HttpServletRequest request, HttpServletResponse response) throws IOException{
		response.setContentType("text/html;charset=utf-8");
        try {
            response.sendRedirect(new Oauth().getAuthorizeURL(request));
        } catch (QQConnectException e) {
            e.printStackTrace();
        }
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
	
	public static boolean callBack(HttpServletRequest request){
		try {
            AccessToken accessTokenObj = (new Oauth()).getAccessTokenByRequest(request);

            String accessToken   = null,
                   openID        = null;
//            long tokenExpireIn = 0L;

            if (accessTokenObj.getAccessToken().equals("")) {
//                我们的网站被CSRF攻击了或者用户取消了授权
//                做一些数据统计工作
//                System.out.print("没有获取到响应参数");
            	return false;
            } else {
                accessToken = accessTokenObj.getAccessToken();
//                tokenExpireIn = accessTokenObj.getExpireIn();

//                request.getSession().setAttribute("demo_access_token", accessToken);
//                request.getSession().setAttribute("demo_token_expirein", String.valueOf(tokenExpireIn));

                // 利用获取到的accessToken 去获取当前用的openid -------- start
                OpenID openIDObj =  new OpenID(accessToken);
                openID = openIDObj.getUserOpenID();

//                out.println("欢迎你，代号为 " + openID + " 的用户!");
//                request.getSession().setAttribute("demo_openid", openID);
//                out.println("<a href=" + "/shuoshuoDemo.html" +  " target=\"_blank\">去看看发表说说的demo吧</a>");
                // 利用获取到的accessToken 去获取当前用户的openid --------- end


//                out.println("<p> start -----------------------------------利用获取到的accessToken,openid 去获取用户在Qzone的昵称等信息 ---------------------------- start </p>");
                UserInfo qzoneUserInfo = new UserInfo(accessToken, openID);
                UserInfoBean userInfoBean = qzoneUserInfo.getUserInfo();
//                out.println("<br/>");
                if (userInfoBean.getRet() == 0) {
//                    out.println(userInfoBean.getNickname() + "<br/>");
//                    out.println(userInfoBean.getGender() + "<br/>");
//                    out.println("黄钻等级： " + userInfoBean.getLevel() + "<br/>");
//                    out.println("会员 : " + userInfoBean.isVip() + "<br/>");
//                    out.println("黄钻会员： " + userInfoBean.isYellowYearVip() + "<br/>");
//                    out.println("<image src=" + userInfoBean.getAvatar().getAvatarURL30() + "/><br/>");
//                    out.println("<image src=" + userInfoBean.getAvatar().getAvatarURL50() + "/><br/>");
//                    out.println("<image src=" + userInfoBean.getAvatar().getAvatarURL100() + "/><br/>");
                } else {
//                    out.println("很抱歉，我们没能正确获取到您的信息，原因是： " + userInfoBean.getMsg());
                }

                 request.getSession().setAttribute("islogin", "" + AllyLogin.QQ);
	       	     request.getSession().setAttribute("allyid", openID);
	       	     request.getSession().setAttribute("nickname", userInfoBean.getNickname());
	       	     request.getSession().setAttribute("host", request.getServerName());
	       	     request.getSession().setAttribute("memo", "qq");
	       	     request.getSession().setAttribute("qqsource", "qqlogin|"+openID);
                 return true;
            }
        } catch (QQConnectException e) {
        	e.getMessage();
        	return false;
        }
	}
	
	public static String MD5(String s) 
	{
	    char hexDigits[] = {'0', '1', '2', '3', '4',
	                        '5', '6', '7', '8', '9',
	                        'A', 'B', 'C', 'D', 'E', 
	                        'F' };
	    try {
	        byte[] btInput = s.getBytes();
	        //获得MD5摘要算法的 MessageDigest 对象
	        MessageDigest mdInst = MessageDigest.getInstance("MD5");
	        //使用指定的字节更新摘要
	        mdInst.update(btInput);
	        //获得密文
	        byte[] md = mdInst.digest();
	        //把密文转换成十六进制的字符串形式
	        int j = md.length;
	        char str[] = new char[j * 2];
	        int k = 0;
	        for (int i = 0; i < j; i++) {
	            byte byte0 = md[i];
	            str[k++] = hexDigits[byte0 >>> 4 & 0xf];
	            str[k++] = hexDigits[byte0 & 0xf];
	        }
	        return new String(str);
	    }
	    catch (Exception e) {
	        //e.printStackTrace();
	        return null;
	    }
	}

	public static String htmlEncode(String s) 
	{
	    return s.replaceAll("&","&amp;").replaceAll("\"","&quot;").replaceAll("'","&#039;").replaceAll("<","&lt;").replace(">","&gt;");
	}
}
