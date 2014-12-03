package com.caipiao.cpweb.trade.jclq;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.cache.Cache;
import com.caipiao.cpweb.trade.cache.CacheManager;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.upload.FileCastServlet;
import com.caipiao.cpweb.upload.FileUpload;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.Util;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class TradeJcBeanImpl extends BaseImpl {
	
	public static Logger logger = LoggerFactory.getLogger("web");
	private String tempfile="temp";
		
	private static Map<String, String> playid = new HashMap<String,String>();
	static {
		playid.put("94", "94");//胜负
		playid.put("95", "95");//让分胜负
		playid.put("96", "96");//胜分差
		playid.put("97", "97");//大小分
		playid.put("71", "98");//大小分
	}
	
	private static Map<String, String> lotidViewpathMap = new HashMap<String, String>();
	static {
		lotidViewpathMap.put("94", "/jclq/");// 胜负
		lotidViewpathMap.put("95", "/jclq/rfsf/");// 让分胜负
		lotidViewpathMap.put("96", "/jclq/sfc/");// 胜分差
		lotidViewpathMap.put("97", "/jclq/dxf/");// 大小分
	}
	
	private static Map<String, String> ds_playid = new HashMap<String, String>();
	static {
		ds_playid.put("94", "SF");// 胜负
		ds_playid.put("95", "RFSF");// 让分胜负
		ds_playid.put("96", "SFC");// 胜分差
		ds_playid.put("97", "DXF");// 大小分
	}
	
	public static HashMap<String, String> SFMaps = new HashMap<String, String>();
	static {
		SFMaps.put("3", "3");
		SFMaps.put("0", "0");
	}
	
	public static HashMap<String, String> SFMapname = new HashMap<String, String>();
	static {
		SFMapname.put("3", "主胜");
		SFMapname.put("0", "主负");
	}

	public static HashMap<String, String> RFSFMaps = new HashMap<String, String>();
	static {
		RFSFMaps.put("3", "3");
		RFSFMaps.put("0", "0");
	}	
	
	public static HashMap<String, String> SFCMaps = new HashMap<String, String>();
	static {
		SFCMaps.put("01", "01");
		SFCMaps.put("02", "02");
		SFCMaps.put("03", "03");
		SFCMaps.put("04", "04");
		SFCMaps.put("05", "05");
		SFCMaps.put("06", "06");
		SFCMaps.put("11", "11");
		SFCMaps.put("12", "12");
		SFCMaps.put("13", "13");
		SFCMaps.put("14", "14");
		SFCMaps.put("15", "15");
		SFCMaps.put("16", "16");
	}
	
	public static HashMap<String, String> SFCMapname = new HashMap<String, String>();
	static {
		SFCMapname.put("01", "主胜1-5");
		SFCMapname.put("02", "主胜6-10");
		SFCMapname.put("03", "主胜11-15");
		SFCMapname.put("04", "主胜16-20");
		SFCMapname.put("05", "主胜21-25");
		SFCMapname.put("06", "主胜26+");
		SFCMapname.put("11", "客胜1-5");
		SFCMapname.put("12", "客胜6-10");
		SFCMapname.put("13", "客胜11-15");
		SFCMapname.put("14", "客胜16-20");
		SFCMapname.put("15", "客胜21-25");
		SFCMapname.put("16", "客胜26+");	
	}
	
	public static HashMap<String, String> DXFMaps = new HashMap<String, String>();
	static {
		DXFMaps.put("3", "3");
		DXFMaps.put("0", "0");	
	}
	
	public static HashMap<String, String> DXFMapname = new HashMap<String, String>();
	static {
		DXFMapname.put("3","大分");
		DXFMapname.put("0","小分");	
	}
	
	
	
	public static HashMap<String, String> SFSpMaps = new HashMap<String, String>();
	static {
		SFSpMaps.put("3", "1");
		SFSpMaps.put("0", "0");
	}
	
	public static HashMap<String, String> RFSFSpMaps = new HashMap<String, String>();
	static {
		RFSFSpMaps.put("3", "1");
		RFSFSpMaps.put("0", "0");
	}
	
	public static HashMap<String, String> SFCSpMaps = new HashMap<String, String>();
	static {
		SFCSpMaps.put("01", "6");
		SFCSpMaps.put("02", "7");
		SFCSpMaps.put("03", "8");
		SFCSpMaps.put("04", "9");
		SFCSpMaps.put("05", "10");
		SFCSpMaps.put("06", "11");
		SFCSpMaps.put("11", "0");
		SFCSpMaps.put("12", "1");
		SFCSpMaps.put("13", "2");
		SFCSpMaps.put("14", "3");
		SFCSpMaps.put("15", "4");
		SFCSpMaps.put("16", "5");
	}	
	
	public static HashMap<String, String> DXFSpMaps = new HashMap<String, String>();
	static {
		DXFSpMaps.put("3", "0");
		DXFSpMaps.put("0", "1");	
	}
	
	public static HashMap<String, String> HHSPMaps = new HashMap<String, String>();//混合投注
	static {
		HHSPMaps.put("主胜", "1");
		HHSPMaps.put("主负", "0");
		HHSPMaps.put("20", "3");
		HHSPMaps.put("21", "2");		
		HHSPMaps.put("大分", "4");		
		HHSPMaps.put("小分", "5");	
		HHSPMaps.put("11", "6");	
		HHSPMaps.put("12", "7");	
		HHSPMaps.put("13", "8");	
		HHSPMaps.put("14", "9");	
		HHSPMaps.put("15", "10");	
		HHSPMaps.put("16", "11");	
		HHSPMaps.put("01", "12");	
		HHSPMaps.put("02", "13");	
		HHSPMaps.put("03", "14");	
		HHSPMaps.put("04", "15");	
		HHSPMaps.put("05", "16");	
		HHSPMaps.put("06", "17");	
	}
	
	private static String getItemCode(String key, String playid){
		if("94".equals(playid)){
			return SFMaps.get(key);
		} else if("95".equals(playid)){
			return RFSFMaps.get(key);
		} else if("96".equals(playid)){
			return SFCMaps.get(key);
		} else if("97".equals(playid)){
			return DXFMaps.get(key);
		}
		return null;
	}

	public static void main(String[] args) throws Exception {
		String spf="3.20,3.60,2.4000";
		System.out.println(getsp(spf,"1")); 		
	}
	
	public static Double getsp(String sprow,String spidstr) throws Exception {
		String[] sp = sprow.split(",");
		int spid=Integer.parseInt(spidstr);
		if (sp.length>spid && sp[spid].length()>0){
			return  Math.round( Double.parseDouble(sp[spid]) * 100) / 100.0;				
		}
		return null;		
	}
	

	private void checkItems(String[] itemcodes,String playid) throws Exception {
		HashMap<String, String> its = new HashMap<String, String>();		
		if (playid.equalsIgnoreCase("94")){////胜负
			for (String s : itemcodes) {
				if (!SFMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), SFMaps.get(s));	
				}
			}	
		}else if (playid.equalsIgnoreCase("95")){//让分胜负
				for (String s : itemcodes) {
					if (!RFSFMaps.containsKey(s)) {
						throw new Exception("投注项不符合要求(1)");
					} else {
						its.put(s.trim(), RFSFMaps.get(s));	
					}
				}		
		}else if (playid.equalsIgnoreCase("96")){//胜分差
			for (String s : itemcodes) {
				System.out.println(s);
				if (!SFCMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)"+s);
				} else {
					its.put(s.trim(), SFCMaps.get(s));	
				}
			}	
		}else if (playid.equalsIgnoreCase("97")){//大小分
			for (String s : itemcodes) {
				System.out.println(s);
				if (!DXFMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), DXFMaps.get(s));	
				}
			}
		}else {
			throw new Exception("不支持的玩法ID(2)");
		}
		
		if (its.size() != itemcodes.length) {
			its.clear();
			its = null ;
			throw new Exception("存在重复投注项(3)");
		}
		its.clear();
		its = null ;	
	}
	
	private String getBack (String playid) {
		switch (Integer.valueOf(playid)) {
		case 94:
			return "/jclq/project_fq_jcds.html?lotid="+playid;
		case 95:
			return "/jclq/rfsf/project_fq_jcds.html?lotid="+playid;
		case 96:
			return "/jclq/sfc/project_fq_jcds.html?lotid="+playid;
		case 97:
			return "/jclq/dxf/project_fq_jcds.html?lotid="+playid;
		default:
			return "/jclq/project_fq_jcds.html?lotid=94";
		}
	}
	
	private String getfsBack (String playid) {
		switch (Integer.valueOf(playid)) {
		case 94:
			return "/jclq/index.html";
		case 95:
			return "/jclq/rfsf/";
		case 96:
			return "/jclq/sfc/";
		case 97:
			return "/jclq/dxf/";
		default:
			return "/jclq/index.html";
		}
	}
	

	
	@SuppressWarnings("unchecked")
	public int project_fqck(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		System.out.println("isCutMulit="+bean.getIsCutMulit());
		System.out.println("Ishm="+bean.getIshm());
		
		int matchnum =bean.getCodes().split("/").length;			
		
		Cache cache = null;
		CacheManager cm = CacheManager.getCacheManager();	
		
		System.out.println(playid.get(bean.getPlayid()));
		
		cache = cm.getCacheMatch(playid.get(bean.getPlayid()), bean.getExpect());

		if (cache == null||cache.isExpired()) {
			
			String[] fn = new String[] { "jclq_sf.xml","jclq_rfsf.xml","jclq_sfc.xml","jclq_dxf.xml","jclq_hh.xml" };
			
			int value = Integer.parseInt(playid.get(bean.getPlayid())) - 94;
			JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jclq", fn[value]));
			int count = xml.countXmlNodes("row");
//			System.out.println(count);
			List<MatchBean> mList = new ArrayList<MatchBean>();
			for (int i = 0; i < count; i++) {
				String mid = xml.getStringValue("row[" + i + "].@itemid");
				String hn = xml.getStringValue("row[" + i + "].@hn");
				String gn = xml.getStringValue("row[" + i + "].@gn");
				String bt = xml.getStringValue("row[" + i + "].@mt");
				String et = xml.getStringValue("row[" + i + "].@et");
				String b3 = xml.getStringValue("row[" + i + "].@bet3");
				String b0 = xml.getStringValue("row[" + i + "].@bet0");
				String mname = xml.getStringValue("row[" + i + "].@name");
				String close = xml.getStringValue("row[" + i + "].@close");
				if(value==3){
					close = xml.getStringValue("row[" + i + "].@zclose");
				} else if(value == 4){
					close = xml.getStringValue("row[" + i + "].@close") + "| " + xml.getStringValue("row[" + i + "].@zclose");
				}

				    MatchBean mb = new MatchBean();	
					mb.setItemid(mid);
					mb.setHn(hn);
					mb.setGn(gn);
					mb.setBt(bt);
					mb.setEt(et);
					mb.setB3(b3);
					mb.setB0(b0);
					mb.setMname(mname);
					mb.setClose(close);

					switch (value) {
					case 0:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sf"));
						break;
					case 1:
						mb.setSpv(xml.getStringValue("row[" + i + "].@rfsf"));
						break;
					case 2:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sfc"));
						break;
					case 3:
						mb.setSpv(xml.getStringValue("row[" + i + "].@dxf"));
						break;
					case 4:
						String sf = xml.getStringValue("row[" + i + "].@sf");
						if(sf.trim().equals("")) sf = "-,-";
						mb.setSpv(sf + "," + xml.getStringValue("row[" + i + "].@rfsf") + "," + xml.getStringValue("row[" + i + "].@dxf") + "," + xml.getStringValue("row[" + i + "].@sfc"));
						break;
					default:
						break;
					}
					mList.add(mb);
			}
			Cache ca= new Cache(playid.get(bean.getPlayid())+bean.getExpect(), mList, System.currentTimeMillis()+1000*60, false);				
			cm.putCacheMatch(playid.get(bean.getPlayid()), bean.getExpect(), ca);
			System.out.println(playid.get(bean.getPlayid())+"_"+ bean.getExpect()+"本地缓存更新");
			cache = ca;

		}else{
			System.out.println(playid.get(bean.getPlayid())+"_"+ bean.getExpect()+"来源本地缓存");
		}
		
		if (cache!=null){
			
			Date firsttime = null;
			
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			
				
			//200|1[3,1,0]/201|2[3,1,0] 
			String Codes=bean.getCodes();
			System.out.println(Codes);
			String[] code = StringUtil.splitter(Codes, "/");
			String[] chang = new String[code.length];			
			String Newcode="";
			String Danstr="";

			if("71".equals(bean.getLotid())){
				HashMap<String, String> maps = new HashMap<String, String>();
				for(int i = 0; i < code.length; i++){
					String [] codestr = StringUtil.splitter(code[i], "|");
					chang[i]= codestr[1].trim();
					
					String _playid = codestr[2].substring(0, codestr[2].indexOf(">"));
					String $playid = "";
					if(_playid.equals("SF")){
						$playid = "94";
					} else if(_playid.equals("RFSF")){
						$playid = "95";
					} else if(_playid.equals("SFC")){
						$playid = "96";
					} else if(_playid.equals("DXF")){
						$playid = "97";
					}
					//41058|130316008|SPF>[3,1,0]/41059|130316009|JQS>[0]
					String sc = codestr[2].substring(codestr[2].indexOf("["));
					System.out.println("sc=" + sc);
					if (sc.substring(0, 1).equalsIgnoreCase("[") && sc.substring(sc.length()-1).equalsIgnoreCase("]") ){
						String[] ccs = StringUtil.splitter(sc.substring(1,sc.length()-1), ",");
						checkItems(ccs, $playid);
						StringBuffer _sb = new StringBuffer();
						for(int k = 0; k < ccs.length; k++){
							_sb.append(getItemCode(ccs[k], $playid));
							if(k != ccs.length -1){
								_sb.append("/");
							}
						}
						String tmp = _playid + "=" + _sb.toString();
						
						String val = maps.get(chang[i]);
						if(val == null){
							val = tmp;
						} else {
							val += "+" + tmp;
						}
						maps.put(chang[i], val);
						System.out.println(chang[i] + "=" + val);
					}else{
						throw new Exception("投注串不符合要求(4)");
					}
				}
				System.out.println("size:" + maps.size());
				StringBuffer sb = new StringBuffer();
				sb.append("HH|");
				for(Iterator<String> its = maps.keySet().iterator();its.hasNext();){
					String key = its.next();
					sb.append(key).append(">").append(maps.get(key));
					sb.append(",");
				}
				String stmp = sb.toString();
				if(stmp.endsWith(",")){
					stmp = stmp.substring(0, stmp.length() - 1);
				}
				Newcode = stmp + "|" + bean.getSgtypename().replaceAll("串", "*");
				if("1".equals(request.getParameter("ismix"))){
					Newcode += "|1";
				}
			} else {
				//检查投注串是否合法
				for (int i = 0; i < code.length; i++) {
					
					String[] codestr = StringUtil.splitter(code[i], "|");
					Newcode=Newcode+codestr[1]+"/";
					
					String[] cs = new String[2];
					
					cs[0] = code[i].substring(code[i].indexOf("|")+1,code[i].indexOf("["));
					cs[1] = code[i].substring(code[i].indexOf("["));
					
					System.out.println("a="+cs[0]);
					System.out.println("b="+cs[1]);
					
					chang[i]= cs[0];
					if (cs[1].substring(0, 1).equalsIgnoreCase("[") && cs[1].substring(cs[1].length()-1).equalsIgnoreCase("]") ){
						String[] ccs = StringUtil.splitter(cs[1].substring(1,cs[1].length()-1), ",");
						checkItems(ccs,bean.getPlayid());								
					}else{
						throw new Exception("投注串不符合要求(4)");
					}
				}
				
				Newcode=Newcode.substring(0,Newcode.length()-1);
			}
			System.out.println("Newcode=" + Newcode);
			
			//获取方案的截至时间	
			for(int i=0;i<chang.length;i++){
				for(int ii=0;ii<mb.size();ii++){
				  if (mb.get(ii).getItemid().equals(chang[i])){
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
			
			//胆码转换成需要的格式  200|1[3,1,0]/201|2[3,1,0] -> 1[3,1,0]/2[3,1,0]
			if(bean.getDanma().length()>10){
				String[] Dstr = StringUtil.splitter(bean.getDanma(), "/");
				for(int a=0;a<Dstr.length;a++){
					Danstr+=Dstr[a].substring(Dstr[a].indexOf("|")+1)+"/";
				}
				Danstr=Danstr.substring(0,Danstr.length()-1);
			}
			
			System.out.println("截至时间为："+DateUtil.getDateTime(firsttime.getTime()));
			System.out.println("Danstr："+Danstr);
			System.out.println("bean.getDanma()："+bean.getDanma());
			request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
			request.setAttribute("mb", mb);		
						
			
			request.setAttribute("beishu", bean.getBeishu());
			request.setAttribute("codes", bean.getCodes());
			request.setAttribute("newcodes", Newcode);
			request.setAttribute("danma", bean.getDanma());
			request.setAttribute("newdanma", Danstr);
			request.setAttribute("expect", bean.getExpect());
			request.setAttribute("ismix", request.getParameter("ismix"));
			
			if ("3".equals(bean.getSgtype())){
				request.setAttribute("gggroupstr", "自由过关");
			}else{
				request.setAttribute("gggroupstr", "组合过关");
			}
			request.setAttribute("gggroup", bean.getGggroup());
			request.setAttribute("IsCutMulit", bean.getIsCutMulit());
			request.setAttribute("ishm", bean.getIshm());
			request.setAttribute("lotid", bean.getLotid());
			request.setAttribute("playid", bean.getPlayid());
			request.setAttribute("sgtype", bean.getSgtype());
			request.setAttribute("sgtypename", bean.getSgtypename());
			request.setAttribute("totalmoney", bean.getTotalmoney());
			request.setAttribute("zhushu", bean.getZhushu());			
			
			request.setAttribute("matchnum", matchnum);		
			
			request.setAttribute("backurl", getfsBack(bean.getPlayid()));			
			System.out.println("--------------"+getfsBack(bean.getPlayid()));  	
				
		}
		return 0;
	}
	
	
	
	public int check_login(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}
	
	public int set_user_data(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_user_data(bean, context, request, response);
	}
	
	/**
	 * 错误提示，移除上传文件
	 * 
	 * @param out
	 * @param e
	 * @param fu
	 */
	private void uploadErr(HttpServletRequest request, Exception e, FileUpload fu) {		
		request.setAttribute("errcode", "1");
		System.out.println("errcode=1");
		request.setAttribute("errmsg", e.getMessage());
		e.printStackTrace();
		if (fu != null) {
			File file = fu.getFile(UPFILE);
			if (file != null) {
				file.delete();
			}
		}
	}
	
	private boolean isValid(String tmp){
		if(tmp.indexOf("=") == -1){
			return false;
		}
		return true;
	}
	/**
	 * 成功发起方案后的文件处理
	 * 
	 * @param file
	 * @throws Exception
	 */
	private void fileOperator(File file, TradeJcBean bean) throws Exception {
		if (file != null) {
			try {
				File dFile = new File(FileCastServlet.PATH + File.separator + bean.getLotid()+ File.separator + bean.getExpect());
				if (!dFile.exists()) {
					dFile.mkdirs();
					System.out.println(dFile.getPath() + "文件夹创建成功");
				}

				// 移动用户原始文件到对应文件夹
				File df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() +  File.separator + bean.getRand() + ".txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}

				// 移动出票格式的文件到对应文件夹
				file = new File(FileCastServlet.PATH+ File.separator +tempfile, bean.getRand() + "_n.txt");
				df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect()+ File.separator + bean.getRand() + "_n.txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "出票格式文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private void uploadErr(HttpServletResponse response, TradeJcBean bean, Exception e) {
		File file = new File(FileCastServlet.PATH + File.separator +tempfile + File.separator + bean.getRand() + ".txt");
		if (file != null) {
			file.delete();
		}
		file = new File(FileCastServlet.PATH + File.separator +tempfile + File.separator + bean.getRand() + "_n.txt");
		if (file != null) {
			file.delete();
		}
//		try {
//			write_html_response("{errcode:1,msg:'" + e.getMessage() + "'}", response);
//		} catch (Exception e1) {
//			e1.printStackTrace();
//		}
	}
	
    private int maxPostSize = 50 * 1024 * 1024;
    private final String UPFILE = "upfile";
    
    //单式第一次验证
	@SuppressWarnings("unchecked")
	public int project_dsck(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		FileUpload upload = null;
	try {
		
		long ustime = System.currentTimeMillis();
		System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
		try {
			// 构造对象
			upload = new FileUpload(request, FileCastServlet.PATH+File.separator+tempfile, new String[] { "txt" }, this.maxPostSize);
		} catch (Exception e) {
			throw new Exception("上传发生错误");
		}
		
		long uetime = System.currentTimeMillis();
		System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
		System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
		System.out.println("文件保存位置：" + FileCastServlet.PATH);
		
		// 获取参数
		File file = null;
		String codes = "";// 投注号码（文件投注的文件名）
		String str = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggname")), "");//自定义选项
		String gid = StringUtil.getNullString(String.valueOf(upload.getRequestField("playid")), "94");//种类玩法 SF...
		String ishm = StringUtil.getNullString(String.valueOf(upload.getRequestField("ishm")), "1");//种类玩法 SF...
		String beishu = StringUtil.getNullString(String.valueOf(upload.getRequestField("beishu")), "1");//投注倍数
		String item = StringUtil.getNullString(String.valueOf(upload.getRequestField("matches")), "");//投注场次列表
		String gg = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggtype")), "2*1");//过关类型
		String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
		String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(bean.getUid(), gid, "jclq").toLowerCase();
		
		upload.setFileName(UPFILE, filename);
		file = upload.getFile(UPFILE);
		int total = 0;
		if (file != null) {// 如果有上传文件的话
			codes = file.getName().toLowerCase();
			System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
			
			if (plugin != null) {

				FileInputStream fis = new FileInputStream(file);

				BufferedReader br = new BufferedReader(new InputStreamReader(fis,"gbk"));

				String temp = null;
				
				FilterResult result = new FilterResult();
				CodeBean codebean = new CodeBean();
				codebean.setCodeitems(str);
				codebean.setPlaytype(ds_playid.get(gid));
				codebean.setLottype(Integer.parseInt(gid));
				
				while((temp = br.readLine()) != null){
					if(!StringUtil.isEmpty(temp)){
						System.out.println("temp："+temp);
						if(initems.equals("1")){
							codebean.setItemType(CodeBean.HAVEITEM);
							codebean.setCode(temp);
							codebean.setGuoguan(gg);
						}else{
							codebean.setItemType(CodeBean.NOITEM);
							codebean.setCode(temp);
							codebean.setTeamitems(item);
							codebean.setGuoguan(gg);
						}
						
						String codeStr = temp.replaceAll("\\s+", "");
						String [] codestring = codeStr.split("_");
						int bs=1;//单式解析倍数
						int len=codestring.length;
						if(len==1){
							bs=1;
						}else if(len==2){
							if(StringUtil.getNullInt(codestring[1].trim())>0){
								bs=Integer.parseInt(codestring[1].trim());
							}else{throw new Exception("投注格式中倍数异常,code="+codeStr);}
						}else{
							throw new Exception("投注格式异常,code="+codeStr);
						}

						FilterBase.doFilterLc(codebean, result);

						if(isValid(result.getCurrentCode())){
							try {
								GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
								total += gcc.getCastMoney()*bs;
								System.out.println("total："+total);
							} catch (Exception e) {
								throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
								// e.getMessage()
							}
							
							for(int n=1;n<bs;n++){
								result.addCode(result.getCurrentCode());	
							}
							
							if(total>1000000){
								throw new Exception("上传文件中检测到注数超过限制范围！");
							}
						}
					}
				}
				fis.close();
				if(initems.equals("1")){//包含场次过关
					gg=result.getGglists();
				}
				
				item=result.getTeamItems();
				
				if(total<2 || item.equals("")){
					throw new Exception("上传文件中未能检测到正确的注数！");
				}
				
				if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH+ File.separator +tempfile,filename+"_n.txt", "gbk")){
					logger.error(filename+"_n.txt"+"：存储失败");
					throw new Exception("存储失败");
				};
			}
		}

		
		//set JSP页面值
//		PeriodBean periodbean = new PeriodBean();
//		periodbean.setGid("5");
//		periodbean.setPid("");		
		
		Cache cache = null;
		CacheManager cm = CacheManager.getCacheManager();	
		
		System.out.println(gid);
		
		cache = cm.getCacheMatch(gid, bean.getExpect());

        if (cache == null||cache.isExpired()) {
			
			String[] fn = new String[] { "jclq_sf.xml","jclq_rfsf.xml","jclq_sfc.xml","jclq_dxf.xml" };
			
			int value = Integer.parseInt(gid) - 94;
			JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jclq", fn[value]));
			int count = xml.countXmlNodes("row");
			System.out.println(count);
			List<MatchBean> mList = new ArrayList<MatchBean>();
			for (int i = 0; i < count; i++) {
				String mid = xml.getStringValue("row[" + i + "].@itemid");
				String hn = xml.getStringValue("row[" + i + "].@hn");
				String gn = xml.getStringValue("row[" + i + "].@gn");
				String bt = xml.getStringValue("row[" + i + "].@mt");
				String et = xml.getStringValue("row[" + i + "].@et");
				String b3 = xml.getStringValue("row[" + i + "].@bet3");
				String b0 = xml.getStringValue("row[" + i + "].@bet0");
				String mname = xml.getStringValue("row[" + i + "].@name");
				String close = xml.getStringValue("row[" + i + "].@close");
				if(value==3){
					close = xml.getStringValue("row[" + i + "].@zclose");
				}

				    MatchBean mb = new MatchBean();	
					mb.setItemid(mid);
					mb.setHn(hn);
					mb.setGn(gn);
					mb.setBt(bt);
					mb.setEt(et);
					mb.setB3(b3);
					mb.setB0(b0);
					mb.setMname(mname);
					mb.setClose(close);

					switch (value) {
					case 0:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sf"));
						break;
					case 1:
						mb.setSpv(xml.getStringValue("row[" + i + "].@rfsf"));
						break;
					case 2:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sfc"));
						break;
					case 3:
						mb.setSpv(xml.getStringValue("row[" + i + "].@dxf"));
						break;
					default:
						break;
					}
					mList.add(mb);
			}
			Cache ca= new Cache(playid.get(gid)+bean.getExpect(), mList, System.currentTimeMillis()+1000*60, false);				
			cm.putCacheMatch(playid.get(gid), bean.getExpect(), ca);
			System.out.println(playid.get(gid)+"_"+ bean.getExpect()+"本地缓存更新");
			cache = ca;

		}else{
			System.out.println(playid.get(bean.getPlayid())+"_"+ bean.getExpect()+"来源本地缓存");
		}
		
		if (cache!=null){
			
			Date firsttime = null;
			
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			System.out.println("item="+item);
			//获取方案的截至时间	
			String[] itemstr = StringUtil.splitter(item, ",");
			int chang = itemstr.length;
			for(int i=0;i<chang;i++){
				for(int ii=0;ii<mb.size();ii++){
				  if (mb.get(ii).getItemid().equals(itemstr[i])){
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
			
			System.out.println("截至时间为："+DateUtil.getDateTime(firsttime.getTime())); 
			request.setAttribute("errcode", "0");
			request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
			request.setAttribute("mb", mb);		
						
			
			request.setAttribute("beishu", beishu);
			request.setAttribute("codes", codes);
			request.setAttribute("rand", filename);
			request.setAttribute("restore", "{ 'matches' : '"+item+"', 'ggtype' : '"+gg+"', 'beishu' : '"+beishu+"', 'flag' : '0'}");
			
			request.setAttribute("gggroupstr", "自由过关");
			
			request.setAttribute("IsCutMulit", beishu);
			request.setAttribute("ishm", ishm);
			request.setAttribute("lotid", gid);
			request.setAttribute("playid", gid);
			request.setAttribute("sgtype", gg);
			request.setAttribute("ggname", str);
			request.setAttribute("totalmoney",total*Integer.parseInt(beishu));
			request.setAttribute("zhushu", total/2);			
			
			request.setAttribute("items", item);
			request.setAttribute("initems", initems);
			request.setAttribute("matchnum", chang);
			
			request.setAttribute("backurl", getBack(gid));			
			System.out.println("--------------"+getBack(gid));  	
				
		}
	} catch (Exception e) {
		uploadErr(request, e, upload);
	}
		return 0;
	}
	
	//单式第二次验证-生成方案
	@SuppressWarnings("unchecked")
	public int project_dscreate(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		try {
			File file = new File(FileCastServlet.PATH + File.separator +tempfile + File.separator + bean.getRand() + ".txt");
			File file2 = new File(FileCastServlet.PATH + File.separator +tempfile + File.separator + bean.getRand() + "_n.txt");
			if (!file.exists()) {
				throw new Exception("上传文件不存在 请从正确途径提交方案");
			}
			if (!file2.exists()) {
				throw new Exception("生成格式文件不存在 请从正确途径提交方案");
			}
			String codes = (bean.getRand() + "_n.txt").toLowerCase();
			String items = null;
			
			long cstime = System.currentTimeMillis();
			System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(bean.getLotid());
			
			if (plugin != null) {
				FileInputStream fis = new FileInputStream(file);
				BufferedReader br = new BufferedReader(new InputStreamReader(fis,"gbk"));

				String tmp = null;
				int total = 0;
				String gglists = null;

				FilterResult result = new FilterResult();
				CodeBean codebean = new CodeBean();
				codebean.setCodeitems(bean.getGgname());//自定义
				codebean.setPlaytype(ds_playid.get(bean.getLotid()));
				codebean.setLottype(Integer.parseInt(bean.getLotid()));

				while ((tmp = br.readLine()) != null) {
					if (!CheckUtil.isNullString(tmp)) {
						if (bean.getInitems().equals("1")) {
							codebean.setItemType(CodeBean.HAVEITEM);
							codebean.setCode(tmp);
							codebean.setGuoguan(bean.getGgtype());
						} else {
							codebean.setItemType(CodeBean.NOITEM);
							codebean.setCode(tmp);
							codebean.setTeamitems(bean.getItems());//场次ID
							codebean.setGuoguan(bean.getGgtype());
						}						
						String codeStr = tmp.replaceAll("\\s+", "");
						String [] codestring = codeStr.split("_");
						int bs=1;//单式解析倍数
						int len=codestring.length;
						if(len==1){
							bs=1;
						}else if(len==2){
							if(StringUtil.getNullInt(codestring[1].trim())>0){
								bs=Integer.parseInt(codestring[1].trim());
							}else{throw new Exception("投注格式中倍数异常,code="+codeStr);}
						}else{
							throw new Exception("投注格式异常,code="+codeStr);
						}

						FilterBase.doFilterLc(codebean, result);

						if(isValid(result.getCurrentCode())){
							try {
								GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
								total += gcc.getCastMoney()*bs;
								System.out.println("total："+total);
							} catch (Exception e) {
								throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
								// e.getMessage()
							}
							
							if(total>1000000){
								throw new Exception("上传文件中检测到注数超过限制范围！");
							}
						}
					}
				}
				fis.close();
				items = result.getTeamItems();
				gglists = result.getGglists();
				
				Cache cache = null;
				CacheManager cm = CacheManager.getCacheManager();	
				
				System.out.println(bean.getLotid());
				
				cache = cm.getCacheMatch(bean.getLotid(), bean.getExpect());

				if (cache == null||cache.isExpired()) {
					
					String[] fn = new String[] { "jclq_sf.xml","jclq_rfsf.xml","jclq_sfc.xml","jclq_dxf.xml" };
					
					int value = Integer.parseInt(playid.get(bean.getLotid())) - 94;
					JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jclq", fn[value]));
					int count = xml.countXmlNodes("row");
					System.out.println(count);
					List<MatchBean> mList = new ArrayList<MatchBean>();
					for (int i = 0; i < count; i++) {
						String mid = xml.getStringValue("row[" + i + "].@itemid");
						String hn = xml.getStringValue("row[" + i + "].@hn");
						String gn = xml.getStringValue("row[" + i + "].@gn");
						String bt = xml.getStringValue("row[" + i + "].@mt");
						String et = xml.getStringValue("row[" + i + "].@et");
						String b3 = xml.getStringValue("row[" + i + "].@bet3");
						String b0 = xml.getStringValue("row[" + i + "].@bet0");
						String mname = xml.getStringValue("row[" + i + "].@name");
						String close = xml.getStringValue("row[" + i + "].@close");
						if(value==3){
							close = xml.getStringValue("row[" + i + "].@zclose");
						}


						    MatchBean mb = new MatchBean();	
							mb.setItemid(mid);
							mb.setHn(hn);
							mb.setGn(gn);
							mb.setBt(bt);
							mb.setEt(et);
							mb.setB3(b3);
							mb.setB0(b0);
							mb.setMname(mname);
							mb.setClose(close);

							switch (value) {
							case 0:
								mb.setSpv(xml.getStringValue("row[" + i + "].@sf"));
								break;
							case 1:
								mb.setSpv(xml.getStringValue("row[" + i + "].@rfsf"));
								break;
							case 2:
								mb.setSpv(xml.getStringValue("row[" + i + "].@sfc"));
								break;
							case 3:
								mb.setSpv(xml.getStringValue("row[" + i + "].@dxf"));
								break;
							default:
								break;
							}
							mList.add(mb);
					}
					Cache ca= new Cache(playid.get(bean.getLotid())+bean.getExpect(), mList, System.currentTimeMillis()+1000*60, false);				
					cm.putCacheMatch(playid.get(bean.getLotid()), bean.getExpect(), ca);
					System.out.println(playid.get(bean.getLotid())+"_"+ bean.getExpect()+"本地缓存更新");
					cache = ca;

				}else{
					System.out.println(playid.get(bean.getLotid())+"_"+ bean.getExpect()+"来源本地缓存");
				}
				
				if (cache!=null){
					
					Date firsttime = null;
					
					List<MatchBean> mb= (List<MatchBean>) cache.getValue();
					
					//获取方案的截至时间	
					String[] itemstr = StringUtil.splitter(items, ",");
					int chang = itemstr.length;
					for(int i=0;i<chang;i++){
						for(int ii=0;ii<mb.size();ii++){
						  if (mb.get(ii).getItemid().equals(itemstr[i])){
							  Date tmpdate =DateUtil.parserDateTime(mb.get(ii).getEt());
							  if (firsttime==null){
								  firsttime=tmpdate;
							  }else{	  
								  if (tmpdate.getTime() < firsttime.getTime()){
									  firsttime = tmpdate;
								  }
							  }
						  }
						}
					}
					if (System.currentTimeMillis() > firsttime.getTime() - 1000 * 60 * 10) {
						throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
					}
					String dtime=DateUtil.getDateTime(firsttime.getTime() - 1000 * 60 * 10);
					String expect=dtime.substring(0, 4) + "" + dtime.substring(5, 7) + "" + dtime.substring(8,10);
					bean.setExpect(expect);
					
				}

				System.out.println("result.getAllCode()=" + result.getAllCode());
				System.out.println("result.getTotalMoney()=" + result.getTotalMoney());
				System.out.println("items=" + items);
				System.out.println("gglists=" + gglists);
				System.out.println("total=" + total);

				if (bean.getAmoney() != total * bean.getBeishu()) {
					throw new Exception("方案金额不正确 请从正确途径提交方案");
				}

			} else {
				throw new Exception("该玩法暂未开通");
			}
			long cetime = System.currentTimeMillis();
			System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
			System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");

			TradeBean bean1 = new TradeBean();

			bean1.setUid(bean.getUid());
			bean1.setPwd(bean.getPwd());
			bean1.setGid(bean.getLotid());// 游戏编号
			bean1.setPid(bean.getExpect());// 期次编号
			bean1.setPlay(0);// 玩法
			bean1.setCodes(codes);// 投注号码（文件投注的文件名）
			bean1.setMuli(bean.getBeishu());// 投注倍数
			bean1.setFflag(1);// 文件标志（0 是号码 1 是文件）
			bean1.setType(bean.getIshm().equalsIgnoreCase("1") ? 1 : 0);// 方案类型(0代购
																		// 1合买)
			bean1.setName(bean.getTitle());// 方案标题
			bean1.setDesc(bean.getContent());// 方案描叙
			bean1.setMoney(bean.getAmoney());// 方案金额
			bean1.setTnum(bean.getAllnum());// 方案份数
			bean1.setBnum(bean.getBuynum());// 购买份数
			bean1.setPnum(bean.getBaodinum());// 保底份数
			bean1.setOflag(bean.getIsshow());// 公开标志
			bean1.setWrate(bean.getTcbili());// 提成比率
			bean1.setComeFrom(bean.getComeFrom());// 方案来源
			bean1.setSource(0);// 投注来源
			bean1.setEndTime("");// 截止时间
			bean1.setZid(","+items+",");

			System.out.println("items：" + items);
			fileOperator(file, bean);
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "jproj_cast");
			if (rc != 0 || bean1.getBusiErrCode() != 0) {
				throw new Exception("投注失败：" + bean1.getBusiErrDesc());
			}
			
			//uploadSucc(response, 0, bean1.getHid());
			bean.setBusiErrCode(bean1.getBusiErrCode());
			bean.setBusiErrDesc(bean1.getBusiErrDesc());
			bean.setBusiXml(bean1.getBusiXml());
		} catch (Exception e) {
			uploadErr(response, bean, e);
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc(e.getMessage());
		}

		return 0;
	}
	
	
	//单式后上传验证
	@SuppressWarnings("unchecked")
	public int project_hsc(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		String uid = null;
		String pwd = null;
		FileUpload upload = null;
	try {
		// 检查是否登录
		HttpSession session = request.getSession();
		uid = (String) session.getAttribute(UID_KEY);
		pwd = (String) session.getAttribute(PWD_KEY);

		if (CheckUtil.isNullString(uid)) {
			throw new Exception("尚未登录！");
		}
		long ustime = System.currentTimeMillis();
		System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
		try {
			// 构造对象
			upload = new FileUpload(request, FileCastServlet.PATH+ File.separator +tempfile, new String[] { "txt" }, this.maxPostSize);
		} catch (Exception e) {
			throw new Exception("上传发生错误");
		}
		
		long uetime = System.currentTimeMillis();
		System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
		System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
		System.out.println("文件保存位置：" + FileCastServlet.PATH);
		
		// 获取参数
		File file = null;
		String codes = "";// 投注号码（文件投注的文件名）
		String str = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggname")), "");//自定义选项
		String gid = StringUtil.getNullString(String.valueOf(upload.getRequestField("playid")), "94");//种类玩法 SPF...
		String hid = StringUtil.getNullString(upload.getRequestField("projid"));// 方案编号
		String item = StringUtil.getNullString(String.valueOf(upload.getRequestField("matches")), "");//投注场次列表
		String gg = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggtype")), "2*1");//过关类型
		String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
		String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(uid, gid, "jclq").toLowerCase();
		codes = (filename + "_n.txt").toLowerCase();
		bean.setLotid(gid);
		bean.setRand(filename);
		upload.setFileName(UPFILE, filename);
		file = upload.getFile(UPFILE);
		
		//方案验证
		TradeBean bean2 = new TradeBean();
		bean2.setUid(uid);
		bean2.setGid(gid);
		bean2.setHid(hid);
		
		int rct = RemoteBeanCallUtil.RemoteBeanCall(bean2, context, GroupContain.TRADE_GROUP, "queryProjectInfo");
		if (rct != 0 || bean2.getBusiErrCode() != 0) {
			throw new Exception("获取方案信息失败：" + bean2.getBusiErrDesc());
		}		
		
		JXmlWapper lxml = JXmlWapper.parse(bean2.toXmlString());

		//JXmlWapper myjoin = lxml.getXmlNode("myjoins.myjoin");

		JXmlWapper row = lxml.getXmlNode("row");
	
		String nickid = "";
		String cnickid = "";
		int isupload = 0;
		String ccodes ="";
		int ifile =0;
		
		int muli =0;
		int money =0;
		int play =0;
		String pid ="";		//期次	
		Date firsttime = null;

		
		if (row != null) {
			nickid = uid;
			cnickid = row.getStringValue("@cnickid");
			isupload = row.getIntValue("@upload");
			ccodes = row.getStringValue("@ccodes");	
			ifile = row.getIntValue("@ifile");					
			muli = row.getIntValue("@mulity");
			money = row.getIntValue("@tmoney");
			play = row.getIntValue("@play");				
			pid = row.getStringValue("@periodid");
		}else {
			throw new Exception("您不是方案的发起人,无权上传方案");
		}
		
		System.out.println("play="+play);
		
		
		if (nickid == "" && !nickid.equalsIgnoreCase(cnickid)) {
			throw new Exception("您不是方案的发起人,无权上传方案,请检查是否登录正确的用户名");
		}
		if (isupload == 1 || ccodes!="" || ifile!=1) {
			throw new Exception("方案已经上传");
		}
		if (pid =="") {
			throw new Exception("方案信息获取失败");
		}
		
		
		int total = 0;
		if (file != null) {// 如果有上传文件的话
			//codes = file.getName().toLowerCase();
			System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);

			if (plugin != null) {

				FileInputStream fis = new FileInputStream(file);

				BufferedReader br = new BufferedReader(new InputStreamReader(fis,"gbk"));

				String temp = null;
				
				FilterResult result = new FilterResult();
				CodeBean codebean = new CodeBean();
				codebean.setCodeitems(str);
				codebean.setPlaytype(ds_playid.get(gid));
				codebean.setLottype(Integer.parseInt(gid));
				
				while((temp = br.readLine()) != null){
					if(!StringUtil.isEmpty(temp)){
						System.out.println("temp："+temp);
						if(initems.equals("1")){
							codebean.setItemType(CodeBean.HAVEITEM);
							codebean.setCode(temp);
							codebean.setGuoguan(gg);
						}else{
							codebean.setItemType(CodeBean.NOITEM);
							codebean.setCode(temp);
							codebean.setTeamitems(item);
							codebean.setGuoguan(gg);
						}
						
						String codeStr = temp.replaceAll("\\s+", "");
						String [] codestring = codeStr.split("_");
						int bs=1;//单式解析倍数
						int len=codestring.length;
						if(len==1){
							bs=1;
						}else if(len==2){
							if(StringUtil.getNullInt(codestring[1].trim())>0){
								bs=Integer.parseInt(codestring[1].trim());
							}else{throw new Exception("投注格式中倍数异常,code="+codeStr);}
						}else{
							throw new Exception("投注格式异常,code="+codeStr);
						}

						FilterBase.doFilterLc(codebean, result);

						if(isValid(result.getCurrentCode())){
							try {
								GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
								total += gcc.getCastMoney()*bs;
								System.out.println("total："+total);
							} catch (Exception e) {
								throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
								// e.getMessage()
							}
							
							for(int n=1;n<bs;n++){
								result.addCode(result.getCurrentCode());	
							}
							
							if(total>1000000){
								throw new Exception("上传文件中检测到注数超过限制范围！");
							}
						}
					}
				}
				fis.close();
				if(initems.equals("1")){//包含场次过关
					gg=result.getGglists();
				}
				
				item=result.getTeamItems();
				
				if(total<2 || item.equals("")){
					throw new Exception("上传文件中未能检测到正确的注数！");
				}
				if (money > 0 && money != total * muli) {
					throw new Exception("上传文件总金额(" + total * muli + ")与方案总金额(" + money + ")不一致！");
				}
				
				if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH+ File.separator +tempfile,filename+"_n.txt", "gbk")){
					logger.error(filename+"_n.txt"+"：存储失败");
					throw new Exception("存储失败");
				};

			}
		}
		
		Cache cache = null;
		CacheManager cm = CacheManager.getCacheManager();	
		
		System.out.println(gid);
		
		cache = cm.getCacheMatch(gid, bean.getExpect());

        if (cache == null||cache.isExpired()) {
			
			String[] fn = new String[] { "jclq_sf.xml","jclq_rfsf.xml","jclq_sfc.xml","jclq_dxf.xml" };
			
			int value = Integer.parseInt(gid) - 94;
			JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jclq", fn[value]));
			int count = xml.countXmlNodes("row");
			System.out.println(count);
			List<MatchBean> mList = new ArrayList<MatchBean>();
			for (int i = 0; i < count; i++) {
				String mid = xml.getStringValue("row[" + i + "].@itemid");
				String hn = xml.getStringValue("row[" + i + "].@hn");
				String gn = xml.getStringValue("row[" + i + "].@gn");
				String bt = xml.getStringValue("row[" + i + "].@mt");
				String et = xml.getStringValue("row[" + i + "].@et");
				String b3 = xml.getStringValue("row[" + i + "].@bet3");
				String b0 = xml.getStringValue("row[" + i + "].@bet0");
				String mname = xml.getStringValue("row[" + i + "].@name");
				String close = xml.getStringValue("row[" + i + "].@close");
				if(value==3){
					close = xml.getStringValue("row[" + i + "].@zclose");
				}

				    MatchBean mb = new MatchBean();	
					mb.setItemid(mid);
					mb.setHn(hn);
					mb.setGn(gn);
					mb.setBt(bt);
					mb.setEt(et);
					mb.setB3(b3);
					mb.setB0(b0);
					mb.setMname(mname);
					mb.setClose(close);

					switch (value) {
					case 0:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sf"));
						break;
					case 1:
						mb.setSpv(xml.getStringValue("row[" + i + "].@rfsf"));
						break;
					case 2:
						mb.setSpv(xml.getStringValue("row[" + i + "].@sfc"));
						break;
					case 3:
						mb.setSpv(xml.getStringValue("row[" + i + "].@dxf"));
						break;
					default:
						break;
					}
					mList.add(mb);
			}
			Cache ca= new Cache(playid.get(gid)+bean.getExpect(), mList, System.currentTimeMillis()+1000*60, false);				
			cm.putCacheMatch(playid.get(gid), bean.getExpect(), ca);
			System.out.println(playid.get(gid)+"_"+ bean.getExpect()+"本地缓存更新");
			cache = ca;

		}else{
			System.out.println(playid.get(gid)+"_"+ bean.getExpect()+"来源本地缓存");
		}
		
		if (cache!=null){
			
			//Date firsttime = null;
			
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			
			//获取方案的截至时间	
			String[] itemstr = StringUtil.splitter(item, ",");
			int chang = itemstr.length;
			for(int i=0;i<chang;i++){
				for(int ii=0;ii<mb.size();ii++){
				  if (mb.get(ii).getItemid().equals(itemstr[i])){
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
			
			System.out.println("截至时间为："+DateUtil.getDateTime(firsttime.getTime())); 
			if (System.currentTimeMillis() > firsttime.getTime() - 1000 * 60 * 10) {
				throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime() - 1000 * 60 * 10) + " 下次请提前");
			}
			String dtime=DateUtil.getDateTime(firsttime.getTime() - 1000 * 60 * 10);
			String expect=dtime.substring(0, 4) + "" + dtime.substring(5, 7) + "" + dtime.substring(8,10);
			bean.setExpect(expect);
				
		}
		
		bean2.setUid(uid);
		bean2.setPwd(pwd);
		bean2.setGid(gid);
		bean2.setHid(hid);
		bean2.setCodes(codes);
		bean2.setMoney(money);
		bean2.setEndTime(String.valueOf(DateUtil.getDateTime(firsttime.getTime())));
		
		bean2.setPid(bean.getExpect());
		
		fileOperator(file, bean);
		int rc1 = RemoteBeanCallUtil.RemoteBeanCall(bean2, context, GroupContain.TRADE_GROUP, "proj_upload");
		if (rc1 != 0 || bean2.getBusiErrCode() != 0) {
			throw new Exception("方案后上传失败：" + bean2.getBusiErrDesc());
		}
		
		//uploadSuccess(out, upload, bean.getHid(),1);
//		bean.setBusiErrCode(bean2.getBusiErrCode());
//		bean.setBusiErrDesc(bean2.getBusiErrDesc());
//		bean.setBusiXml(bean2.getBusiXml());
		write_html_response("<script>window.location='"+lotidViewpathMap.get(bean.getLotid())+"viewpath.html?lotid=" + bean.getLotid() + "&projid=" + hid + "'</script>", response);
	} catch (Exception e) {
		uploadErr(response, bean, e);
		write_html_response("<script>alert('" + e.getMessage() + "');if (history.length == 0){window.opener = '';window.close();} else {history.go(-1);}</script>", response);
	}
		return 0;
	}
}