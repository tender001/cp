package com.caipiao.cpweb.trade;

import java.io.DataOutputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.json.XML;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.Util;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class TradeBeanImpl extends BaseImpl {
	private static HashMap<String, RankingBean> ranks = new HashMap<String, RankingBean>();
	public int check_login(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}

	public int sqlcheck_login(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.sqlcheck_login(bean, context, request, response);
	}
	
	public int set_user_data(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_user_data(bean, context, request, response);
	}
	
	public int set_yiqifa_data(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		//HttpSession session = request.getSession();
		String pid = request.getParameter("d");
		if (!CheckUtil.isNullString(pid)) {
			bean.setPid(pid);
		}
		String cid = request.getParameter("cid");
		if (!CheckUtil.isNullString(cid)) {
			bean.setPwd(cid);
		}
		return 1;
	}
	
	public int set_jsontoxml(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append(bean.getBusiXml());
		BaseImpl.write_html_response(sb.toString(), response);
		return 0;
	}
	
	public int session(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		//jcck,
		String key = BaseImpl.SESSION_FORWARD + "_" + bean.getFid();
		Object obj = request.getSession().getAttribute(key);
		if(obj != null){
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("成功");
			bean.setBusiXml(String.valueOf(obj));
		} else {
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("无数据");
		}
		return 0;
	}
	
	public int ranking(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String key = bean.getFind() + "_" + bean.getName();
		RankingBean rb = ranks.get(key);
		String uname = (String) request.getAttribute(BaseImpl.UID_KEY);
		JSONObject json = null;
		File file = null;
		String path = "/opt/export/cpdata/paihang";
		if("win_all".equals(bean.getFind())){
			file = new File(path + "/win_all.json");
		}else if("lastest_win".equals(bean.getFind())){
			file = new File(path + "/lastest_win.json");
		}else{
			file = new File(path + "/"+bean.getFind()+"_"+bean.getName()+".json");
		}
		
		try {
			if(rb == null || rb.needUpdate()){
				if(file.exists()){
					String strJson = Util.getFileContent(file, null);
					if(!StringUtil.isEmpty(strJson)){
						json = new JSONObject(strJson);
						if(rb == null){
							rb = new RankingBean();
						}
						rb.setJson(json);
						rb.setTime(System.currentTimeMillis());
						ranks.put(key, rb);
					}
				}
			}else{
				json = rb.getJson();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		if(json==null){
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("错误");
		}else{
			try {
				String str = XML.toString(json, null);
				JXmlWapper xml = JXmlWapper.parse(str);
				int count = xml.countXmlNodes("row");
				for(int i = 0; i < count; i++){
					String cnickid = xml.getStringValue("row["+i+"].cnickid");
					if(!StringUtil.isEmpty(cnickid)){
						if(!cnickid.equals(uname)){
							xml.setValue("row["+i+"].cnickid", cnickid.substring(0,1) + "*****");
						}
					}
				}
				String content = XML.toJSONObject(xml.toXmlString("utf-8")).toString();

				response.setContentType("text/html; charset="+BaseImpl.ENCODING);
				response.setCharacterEncoding(BaseImpl.ENCODING);
				DataOutputStream out = new DataOutputStream(response.getOutputStream());		
				StringBuffer buffer = new StringBuffer();
				buffer.append(content);
				out.write((new String(buffer)).getBytes(BaseImpl.ENCODING));
				out.flush();
				out.close();
			} catch (Exception e) {
				e.printStackTrace();
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("错误");
			}
		}
		return 0;
	}
	public int queryJoinListResult(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(bean.getBusiErrCode() == 0){
			String xmlstr = "<MYResp>" + bean.getBusiXml() + "</MYResp>";
			JXmlWapper xml = JXmlWapper.parse(xmlstr);
			int t = 0;  //未登录用户
			if (!StringUtil.isEmpty(bean.getUid())) {//已登录用户
				t = 1; 
			}

			String nid = xml.getStringValue("count.@nickid");
			if (nid.equals(bean.getUid())) {//发单人登录
					t = 2;   
			}
			
			xml.remove("count.@nickid");
			if (t==2) {//发单人登录可以查看所有跟单人全称
				
			}else{
				int count = xml.countXmlNodes("row");
				for(int i = 0; i < count; i++){
					if(t==1){//登录用户可以查看自已和发单人的全称
						if(!xml.getStringValue("row["+i+"].@nickid").equals(nid) && !xml.getStringValue("row["+i+"].@nickid").equals(bean.getUid()) && !xml.getStringValue("row["+i+"].@nickid").equals("159cai保底")){
							xml.setValue("row["+i+"].@nickid", xml.getStringValue("row["+i+"].@nickid").substring(0,1) + "*****");
						}
					}else{//未登录用户可以查看发单人的全称
						if(!xml.getStringValue("row["+i+"].@nickid").equals(nid) && !xml.getStringValue("row["+i+"].@nickid").equals("159cai保底")){
							xml.setValue("row["+i+"].@nickid", xml.getStringValue("row["+i+"].@nickid").substring(0,1) + "*****");
						}
					}
				}
			}
			String cxml = xml.toXmlString(("utf-8"));
			bean.setBusiXml(cxml.replaceAll("<\\?.+?\\?>", "").replace("</MYResp>", "").replace("<MYResp>", ""));
		}
		return 1;
	}
	
	/**
	 * 根据url参数获取setcookie
	 */
	public int yiqifa(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		//,获取参数信息
		String source = request.getParameter("source");
		String channel = request.getParameter("channel");
		String cid = request.getParameter("cid");
		String wi = request.getParameter("wi");
		String target = request.getParameter("target");
		String path = "/";
		
		setCookie(response,"cookie_source",source+"|"+channel+"|"+cid+"|"+wi,path);
		
		request.getSession().setAttribute("memo", "yiqifa");
		
		response.sendRedirect("http://www.159cai.com/from.phpx?comeFrom=yiqifa&backurl="+target);
		return 0;
	}
	
	public static void setCookie(HttpServletResponse response,String name,String value, String path) {
		Cookie cookie = new Cookie(name,value);
		cookie.setSecure(false);
		cookie.setPath(path);
		cookie.setMaxAge(30*24*3600);
		response.addCookie(cookie);
	}
	
	/**
	 * 购买方案成功后-根据cookie和代理判断是否为返利方案->是？记录到返利表中去并推送订单消息给返利商
	 */
	public int checkfanli(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		//获取参数信息
		//必须为代购或则追号才可以有返利。
		if(bean.getBusiErrCode() == 0 && (bean.getFid().equalsIgnoreCase("jcast")||bean.getFid().equalsIgnoreCase("pcast")||bean.getFid().equalsIgnoreCase("zcast"))){
			//HttpSession session = request.getSession();
			int type=0;//代购
			
			if (!StringUtil.isEmpty(bean.getZid()) && bean.getFid().equalsIgnoreCase("zcast")){
				type=1;//追号
				bean.setHid(bean.getZid());
			}else if (bean.getTnum()!=bean.getBnum()){
				return 0;//合买直接退出不参与返利
			}
			bean.setType(type);//购买类型
			
			Cookie cookieValue = getCookieByName(request,"cookie_source");//获取cookie
			
			if(cookieValue!=null && !StringUtil.isEmpty(cookieValue+"")){
				
				bean.setComeFrom(cookieValue.getValue());//设置保留用户cookie
				
				bean.setFunc("yiqifa");
				
				//调用stub
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_fanli");
				//if (rc != 0 || bean.getState() != 0) {
					//throw new Exception("插入返利任务失败：" + bean.getFunc());
				//}else{
					
				//}
			}
			
			//String cookie_qqsource = (String) session.getAttribute("cookie_qqsource");
			Object cookie_qqsource =  request.getSession().getAttribute("qqsource");
			
			if(!CheckUtil.isNullString((String)cookie_qqsource)){
				
                bean.setComeFrom((String)cookie_qqsource);//设置保留用户来源
				
				bean.setFunc("qq");
				
				//调用stub
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_fanli");
				//if (rc != 0 || bean.getState() != 0) {
					//throw new Exception("插入返利任务失败：" + bean.getFunc());
				//}else{
					
				//}
			}
		}
		return 0;
	}
	/**
	 * 根据名字获取cookie
	 * @param request
	 * @param name cookie名字
	 * @return
	 */
	
	public static Cookie getCookieByName(HttpServletRequest request,String name){
	    Map<String,Cookie> cookieMap = ReadCookieMap(request);
	    if(cookieMap.containsKey(name)){
	        Cookie cookie = (Cookie)cookieMap.get(name);
	        return cookie;
	    }else{
	        return null;
	    }   
	
	}
	/**
	 * 将cookie封装到Map里面
	 * @param request
	 * @return
	 */
	private static Map<String,Cookie> ReadCookieMap(HttpServletRequest request){  
	    Map<String,Cookie> cookieMap = new HashMap<String,Cookie>();
	    Cookie[] cookies = request.getCookies();
	    if(null!=cookies){
	        for(Cookie cookie : cookies){
	            cookieMap.put(cookie.getName(), cookie);
	        }
	    }
	    return cookieMap;
	}
}