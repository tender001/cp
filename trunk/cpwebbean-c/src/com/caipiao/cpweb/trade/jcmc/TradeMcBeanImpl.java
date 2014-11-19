package com.caipiao.cpweb.trade.jcmc;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.trade.cache.Cache;
import com.caipiao.cpweb.trade.cache.CacheManager;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;


public class TradeMcBeanImpl extends BaseImpl {
	
	public static Logger logger = LoggerFactory.getLogger("web");
	
	private static Map<String, String> MGid = new HashMap<String, String>();
	static {
		MGid.put("98", "GJ");// 让球胜平负
		MGid.put("99", "GYJ");// 比分
	}

	private static Map<String, String> matchxml = new HashMap<String, String>();
	static {
		matchxml.put("98", "GJ");// 让球胜平负
		matchxml.put("99", "GYJ");// 比分
	}
	

	
	
	private String getfsBack (String gid,String expect) {
		if ("12004".equalsIgnoreCase(expect)||"12005".equalsIgnoreCase(expect)){
			switch (Integer.valueOf(gid)) {
			case 98:
				return "/jclq/gj_"+expect+".html";
			case 99:
				return "/jclq/gyj_"+expect+".html";
			default:
				return "";
			}				
		}else{
			switch (Integer.valueOf(gid)) {
			case 98:
				return "/jczq/gj_"+expect+".html";
			case 99:
				return "/jczq/gyj_"+expect+".html";
			default:
				return "";
			}			
		}

	}
	
	private String getmxml (String gid,String expect) {
		switch (Integer.valueOf(gid)) {
		case 98:
			return "/"+expect+"/gj.xml";
		case 99:
			return "/"+expect+"/gyj.xml";
		default:
			return "";
		}
	}
	
	@SuppressWarnings("unchecked")
	public int project_fqck(TradeMcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {	
		int matchnum = StringUtil.splitter(bean.getCodes(), "=")[1].split("/").length;		
		

		Cache cache = null;
		CacheManager cm = CacheManager.getCacheManager();	
		
		
		cache = cm.getCacheMatch(bean.getLotid(), bean.getExpect());

		if (cache == null||cache.isExpired()) {
			JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jcmc", getmxml(bean.getLotid(),bean.getExpect())));
			int count = xml.countXmlNodes("row");
			List<MatchBean> mList = new ArrayList<MatchBean>();
			for (int i = 0; i < count; i++) {
				String mid = xml.getStringValue("row[" + i + "].@cindex");
				String sp = xml.getStringValue("row[" + i + "].@sp");
				String zcl = xml.getStringValue("row[" + i + "].@zcl");
				String gl = xml.getStringValue("row[" + i + "].@gl");
				String mname = xml.getStringValue("row[" + i + "].@name");
				String et = xml.getStringValue("row[" + i + "].@endtime");
				    MatchBean mb = new MatchBean();	
					mb.setItemid(mid);
					mb.setSp(sp);
					mb.setZcl(zcl);
					mb.setGl(gl);
					mb.setMname(mname);
					mb.setEt(et);
					mList.add(mb);
			}
			Cache ca= new Cache(bean.getLotid()+bean.getExpect(), mList, System.currentTimeMillis()+1000*60, false);				
			cm.putCacheMatch(bean.getLotid(), bean.getExpect(), ca);
			System.out.println(bean.getLotid()+"_"+ bean.getExpect()+"本地缓存更新");
			cache = ca;

		}else{
			System.out.println(bean.getLotid()+"_"+ bean.getExpect()+"来源本地缓存");
		}
		
		if (cache!=null){
			
			Date firsttime = null;
			
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			String Codes=bean.getCodes();
			String[] code = StringUtil.splitter(Codes, "=")[1].split("/");		

			//获取方案的截至时间	
			for(int i=0;i<code.length;i++){
				for(int ii=0;ii<mb.size();ii++){
				  if (mb.get(ii).getItemid().equals(code[i])){
					  Date tmp =DateUtil.parserDateTime(mb.get(ii).getEt());
					  if (firsttime==null){
						  firsttime=tmp;
					  }else{	  
						  if (tmp.getTime() < firsttime.getTime()){
							  firsttime = tmp;
						  }
					  }
				  }
				}
			}
			
			
			//System.out.println("截至时间为："+DateUtil.getDateTime(firsttime.getTime()));
			request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
			request.setAttribute("mb", mb);		
						
			request.setAttribute("beishu", bean.getBeishu());
			request.setAttribute("codes", bean.getCodes());
			request.setAttribute("expect", bean.getExpect());
			request.setAttribute("ishm", bean.getIshm());
			request.setAttribute("lotid", bean.getLotid());
			request.setAttribute("playid", bean.getPlayid());
			request.setAttribute("totalmoney", bean.getTotalmoney());
			request.setAttribute("zhushu", bean.getZhushu());			
			request.setAttribute("matchnum", matchnum);		
			request.setAttribute("backurl", getfsBack(bean.getPlayid(),bean.getExpect()));			
			System.out.println("--------------"+getfsBack(bean.getPlayid(),bean.getExpect()));  	
				
		}
		return 0;
	}
	

	public static void main(String[] args) throws Exception {
		
	}
}