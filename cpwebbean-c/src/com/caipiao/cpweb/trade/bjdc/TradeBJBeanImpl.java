package com.caipiao.cpweb.trade.bjdc;

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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.cpweb.trade.PythonFilterUtil;
import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.cache.Cache;
import com.caipiao.cpweb.trade.cache.CacheManager;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.upload.FileCastServlet;
import com.caipiao.cpweb.upload.FileUpload;
import com.caipiao.cpweb.user.UserBean;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.Util;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.Base64;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class TradeBJBeanImpl extends BaseImpl {

	public static Logger logger = LoggerFactory.getLogger("web");

	private static String temp = "temp";
	private static int Fetdiff = 10;

	private static Map<String, String> lotidMap = new HashMap<String, String>();
	static {
		lotidMap.put("85", "SPF");// 让球胜平负
		lotidMap.put("89", "JQS");// 总进球数
		lotidMap.put("88", "SXP");// 上下单双
		lotidMap.put("86", "CBF");// 比分
		lotidMap.put("87", "BQC");// 半全场
		lotidMap.put("84", "SF");// 胜负过关
	}
	
	private static Map<String, String> lotidViewpathMap = new HashMap<String, String>();
	static {
		lotidViewpathMap.put("85", "/bj/");// 让球胜平负
		lotidViewpathMap.put("89", "/bj/");// 总进球数
		lotidViewpathMap.put("88", "/bj/");// 上下单双
		lotidViewpathMap.put("86", "/bj/");// 比分
		lotidViewpathMap.put("87", "/bj/");// 半全场
		lotidViewpathMap.put("84", "/bj/");// 胜负过关
	}

	private static Map<String, String> playidMap = new HashMap<String, String>();
	static {
		playidMap.put("34", "85");// 让球胜平负
		playidMap.put("40", "89");// 总进球数
		playidMap.put("41", "88");// 上下单双
		playidMap.put("42", "86");// 比分
		playidMap.put("51", "87");// 半全场
		playidMap.put("46", "84");// 半全场
	}

	// private static Map<String, String> CodeitemsMap = new HashMap<String,
	// String>();
	// static {
	// CodeitemsMap.put("85", "3=3,1=1,0=0");// 让球胜平负
	// CodeitemsMap.put("89", "JQS");// 总进球数
	// CodeitemsMap.put("88", "SXP");// 上下单双
	// CodeitemsMap.put("86", "CBF");// 比分
	// CodeitemsMap.put("87", "BQC");// 半全场
	// }
	
	public static HashMap<String, String> SFMaps = new HashMap<String, String>();
	static {
		SFMaps.put("胜", "3");
		SFMaps.put("负", "0");
	}

	public static HashMap<String, String> SPFMaps = new HashMap<String, String>();
	static {
		SPFMaps.put("胜", "3");
		SPFMaps.put("平", "1");
		SPFMaps.put("负", "0");
	}

	public static HashMap<String, String> JQSMaps = new HashMap<String, String>();
	static {
		JQSMaps.put("0", "0");
		JQSMaps.put("1", "1");
		JQSMaps.put("2", "2");
		JQSMaps.put("3", "3");
		JQSMaps.put("4", "4");
		JQSMaps.put("5", "5");
		JQSMaps.put("6", "6");
		JQSMaps.put("7+", "7");
	}

	public static HashMap<String, String> SXPMaps = new HashMap<String, String>();
	static {
		SXPMaps.put("上+单", "3");
		SXPMaps.put("上+双", "2");
		SXPMaps.put("下+单", "1");
		SXPMaps.put("下+双", "0");
	}

	public static HashMap<String, String> CBFMaps = new HashMap<String, String>();
	static {
		CBFMaps.put("胜其他", "9:0");
		CBFMaps.put("1:0", "1:0");
		CBFMaps.put("2:0", "2:0");
		CBFMaps.put("2:1", "2:1");
		CBFMaps.put("3:0", "3:0");
		CBFMaps.put("3:1", "3:1");
		CBFMaps.put("3:2", "3:2");
		CBFMaps.put("4:0", "4:0");
		CBFMaps.put("4:1", "4:1");
		CBFMaps.put("4:2", "4:2");
		CBFMaps.put("平其他", "9:9");
		CBFMaps.put("0:0", "0:0");
		CBFMaps.put("1:1", "1:1");
		CBFMaps.put("2:2", "2:2");
		CBFMaps.put("3:3", "3:3");
		CBFMaps.put("负其他", "0:9");
		CBFMaps.put("0:1", "0:1");
		CBFMaps.put("0:2", "0:2");
		CBFMaps.put("1:2", "1:2");
		CBFMaps.put("0:3", "0:3");
		CBFMaps.put("1:3", "1:3");
		CBFMaps.put("2:3", "2:3");
		CBFMaps.put("0:4", "0:4");
		CBFMaps.put("1:4", "1:4");
		CBFMaps.put("2:4", "2:4");
	}

	public static HashMap<String, String> BQCMaps = new HashMap<String, String>();
	static {
		BQCMaps.put("胜-胜", "3-3");
		BQCMaps.put("胜-平", "3-1");
		BQCMaps.put("胜-负", "3-0");
		BQCMaps.put("平-胜", "1-3");
		BQCMaps.put("平-平", "1-1");
		BQCMaps.put("平-负", "1-0");
		BQCMaps.put("负-胜", "0-3");
		BQCMaps.put("负-平", "0-1");
		BQCMaps.put("负-负", "0-0");
	}
	
	public static HashMap<String, String> SFSpMaps = new HashMap<String, String>();
	static {
		SFSpMaps.put("3", "sp3");
		SFSpMaps.put("0", "sp0");
	}

	public static HashMap<String, String> SPFSpMaps = new HashMap<String, String>();
	static {
		SPFSpMaps.put("3", "sp3");
		SPFSpMaps.put("1", "sp1");
		SPFSpMaps.put("0", "sp0");
	}

	public static HashMap<String, String> JQSSpMaps = new HashMap<String, String>();
	static {
		JQSSpMaps.put("0", "jqs0");
		JQSSpMaps.put("1", "jqs1");
		JQSSpMaps.put("2", "jqs2");
		JQSSpMaps.put("3", "jqs3");
		JQSSpMaps.put("4", "jqs4");
		JQSSpMaps.put("5", "jqs5");
		JQSSpMaps.put("6", "jqs6");
		JQSSpMaps.put("7", "jqs7");
	}

	public static HashMap<String, String> SXPSpMaps = new HashMap<String, String>();
	static {
		SXPSpMaps.put("3", "sxp3");
		SXPSpMaps.put("2", "sxp2");
		SXPSpMaps.put("1", "sxp1");
		SXPSpMaps.put("0", "sxp0");
	}

	public static HashMap<String, String> CBFSpMaps = new HashMap<String, String>();
	static {
		CBFSpMaps.put("9:0", "90");
		CBFSpMaps.put("1:0", "10");
		CBFSpMaps.put("2:0", "20");
		CBFSpMaps.put("2:1", "21");
		CBFSpMaps.put("3:0", "30");
		CBFSpMaps.put("3:1", "31");
		CBFSpMaps.put("3:2", "32");
		CBFSpMaps.put("4:0", "40");
		CBFSpMaps.put("4:1", "41");
		CBFSpMaps.put("4:2", "42");
		CBFSpMaps.put("9:9", "99");
		CBFSpMaps.put("0:0", "00");
		CBFSpMaps.put("1:1", "11");
		CBFSpMaps.put("2:2", "22");
		CBFSpMaps.put("3:3", "33");
		CBFSpMaps.put("0:9", "09");
		CBFSpMaps.put("0:1", "01");
		CBFSpMaps.put("0:2", "02");
		CBFSpMaps.put("1:2", "12");
		CBFSpMaps.put("0:3", "03");
		CBFSpMaps.put("1:3", "13");
		CBFSpMaps.put("2:3", "23");
		CBFSpMaps.put("0:4", "04");
		CBFSpMaps.put("1:4", "14");
		CBFSpMaps.put("2:4", "24");
	}

	public static HashMap<String, String> BQCSpMaps = new HashMap<String, String>();
	static {
		BQCSpMaps.put("3-3", "33");
		BQCSpMaps.put("3-1", "31");
		BQCSpMaps.put("3-0", "30");
		BQCSpMaps.put("1-3", "13");
		BQCSpMaps.put("1-1", "11");
		BQCSpMaps.put("1-0", "10");
		BQCSpMaps.put("0-3", "03");
		BQCSpMaps.put("0-1", "01");
		BQCSpMaps.put("0-0", "00");
	}

	public static void main(String[] args) throws Exception {
		// String spf = "rz:;rs:;sp0:3.2600;sp1:3.6300;sp3:2.4000;";
		// System.out.println(getsp(spf, "sp3"));

		String ggname = "a:3:{i:3;s:1:\"3\";i:1;s:1:\"1\";i:0;s:1:\"0\";}";
		// a:8:{i:0;s:1:"0";i:1;s:1:"1";i:2;s:1:"2";i:3;s:1:"3";i:4;s:1:"4";i:5;s:1:"5";i:6;s:1:"6";i:7;s:1:"7";}
		getCodeitemsStr(ggname);
	}

	public static String getCodeitemsStr(String ggname) {
		// "a:3:{i:3;s:1:\"3\";i:1;s:1:\"1\";i:0;s:1:\"0\";}";
		// a:8:{i:0;s:1:"0";i:1;s:1:"1";i:2;s:1:"2";i:3;s:1:"3";i:4;s:1:"4";i:5;s:1:"5";i:6;s:1:"6";i:7;s:1:"7";}
		String CodeitemsStr = "";
		String patternString = "a:\\d+:\\{((i:([^;]+);s:1:\"([^\"]+)\";)+)\\}";
		Pattern pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(ggname);
//		int l = 0;
		if (matcher.find()) {
			// l = l + 1;
			// System.out.println("l="+l);
			// System.out.println(matcher.group(0));
			// System.out.println(matcher.group(1));
			// System.out.println(matcher.group(2));
			patternString = "i:([^;]+);s:1:\"([^\"]+)\";";
			pattern = Pattern.compile(patternString, Pattern.CASE_INSENSITIVE);
			matcher = pattern.matcher(matcher.group(1));
			while (matcher.find()) {
				CodeitemsStr += "," + matcher.group(1) + "=" + matcher.group(2);
			}
			CodeitemsStr = CodeitemsStr.length() > 1 ? CodeitemsStr.substring(1) : "";
			System.out.println(CodeitemsStr);
		}
		return CodeitemsStr;
	}

	public static Double getsp(String sprow, String spname) throws Exception {
		String[] sp = sprow.split(";");
		for (int i = 0; i < sp.length; i++) {
			if (sp[i].length() > spname.length() && sp[i].length() > spname.length() + 1 && sp[i].substring(0, spname.length() + 1).equalsIgnoreCase(spname + ":")) {
				return Math.round(Double.parseDouble(sp[i].substring(spname.length() + 1, sp[i].length())) * 100) / 100.0;
			}
		}
		return null;
	}

	private void checkItems(String[] itemcodes, String playid) throws Exception {
		HashMap<String, String> its = new HashMap<String, String>();
		if (playid.equalsIgnoreCase("34")) {// //让球胜平负
			for (String s : itemcodes) {
				if (!SPFMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), SPFMaps.get(s));
				}
			}
		} else if (playid.equalsIgnoreCase("40")) {// 总进球数
			for (String s : itemcodes) {
				if (!JQSMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), JQSMaps.get(s));
				}
			}
		} else if (playid.equalsIgnoreCase("41")) {// 上下单双
			for (String s : itemcodes) {
				if (!SXPMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), SXPMaps.get(s));
				}
			}
		} else if (playid.equalsIgnoreCase("42")) {// 比分
			for (String s : itemcodes) {
				System.out.println(s);
				if (!CBFMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)" + s);
				} else {
					its.put(s.trim(), CBFMaps.get(s));
				}
			}
		} else if (playid.equalsIgnoreCase("51")) {// 半全场
			for (String s : itemcodes) {
				System.out.println(s);
				if (!BQCMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), BQCMaps.get(s));
				}
			}
		} else if (playid.equalsIgnoreCase("46")) {// 胜负过关
			for (String s : itemcodes) {
				System.out.println(s);
				if (!SFMaps.containsKey(s)) {
					throw new Exception("投注项不符合要求(1)");
				} else {
					its.put(s.trim(), SFMaps.get(s));
				}
			}
		} else {
			throw new Exception("不支持的玩法ID(2)");
		}

		if (its.size() != itemcodes.length) {
			its.clear();
			its = null;
			throw new Exception("存在重复投注项(3)");
		}
		its.clear();
		its = null;
	}

	private String getBack(String lotid, String play) {
		if (play.equalsIgnoreCase("ds")) {
			switch (Integer.valueOf(lotid)) {
			case 85:
				return "/trade/bjdc/project_fq_zcds.go?lotid=85";
			case 89:
				return "/trade/bjdc/project_fq_zcds.go?lotid=89";
			case 88:
				return "/trade/bjdc/project_fq_zcds.go?lotid=88";
			case 86:
				return "/trade/bjdc/project_fq_zcds.go?lotid=86";
			case 87:
				return "/trade/bjdc/project_fq_zcds.go?lotid=87";
			case 84:
				return "/trade/bjdc/project_fq_zcds.go?lotid=84";
			default:
				return "";
			}
		} else {
			switch (Integer.valueOf(lotid)) {
			case 34:
				return "/bjdc/index.html";
			case 40:
				return "/bjdc/jq/";
			case 41:
				return "/bjdc/sx/";
			case 42:
				return "/bjdc/bf/";
			case 51:
				return "/bjdc/bq/";
			case 46:
				return "/bjdc/sfgg/";
			default:
				return "";
			}
		}
	}

	@SuppressWarnings("unchecked")
	public int project_fqck(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		try{
			System.out.println("isCutMulit=" + bean.getIsCutMulit());
			System.out.println("Ishm=" + bean.getIshm());
			System.out.println("codes=" + bean.getCodes());
	
			int matchnum = bean.getCodes().split("/").length;
	
			Cache cache = loadCacheds(playidMap.get(bean.getPlayid()), bean.getExpect(), context);
			if (cache != null) {
				Date firsttime = null;
				Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
	
				// 1:[胜,平,负]/2:[胜,平,负]/3:[胜,平,负]/4:[胜,平,负]/5:[胜,平,负]
				String Codes = bean.getCodes();
				String[] code = StringUtil.splitter(Codes, "/");
				int[] chang = new int[code.length];
	
				// 检查投注串是否合法
				for (int i = 0; i < code.length; i++) {
					String[] cs = new String[2];
					cs[0] = code[i].substring(0, code[i].indexOf(":"));
					cs[1] = code[i].substring(code[i].indexOf(":") + 1);
	
					System.out.println("a=" + cs[0]);
					System.out.println("b=" + cs[1]);
	
					chang[i] = Integer.parseInt(cs[0]);
					if (cs[1].substring(0, 1).equalsIgnoreCase("[") && cs[1].substring(cs[1].length() - 1).equalsIgnoreCase("]")) {
						String[] ccs = StringUtil.splitter(cs[1].substring(1, cs[1].length() - 1), ",");
						checkItems(ccs, bean.getPlayid());
					} else {
						throw new Exception("投注串不符合要求(4)");
					}
				}
	
				// 获取方案的截至时间
				String items="";			
				for (int i = 0; i < chang.length; i++) {
					items+=chang[i]+",";		
				}
				items = items.substring(0,items.lastIndexOf(","));			
				firsttime = loadfirsttime(mMap, items);
	
				System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
				request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
				request.setAttribute("mb", mMap);
	
				request.setAttribute("beishu", bean.getBeishu());
				request.setAttribute("codes", bean.getCodes());
				request.setAttribute("danma", bean.getDanma());
				request.setAttribute("expect", bean.getExpect());
	
				if (bean.getSgtype() == "3") {
					request.setAttribute("gggroupstr", "自由过关");
				} else {
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
	
				request.setAttribute("backurl", getBack(bean.getPlayid(), ""));
	
			}
		}catch (Exception e) {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc(e.getMessage());
		}
		return 0;
	}

	public int check_login(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}

	public int set_user_data(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_user_data(bean, context, request, response);
	}

	@SuppressWarnings("unchecked")
	public int project_fq_zcds(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (lotidMap.get(bean.getLotid()) == null) {
			write_html_response("<script>alert(\"参数错误\");</script>", response);
			return 0;
		}
		Cache cache = loadCacheds(bean.getLotid(), "", context);
		if (cache != null) {
			System.out.println("加载缓存成功");
			Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
			request.setAttribute("mb", mMap);
			request.setAttribute("lotid", bean.getLotid());
			request.setAttribute("expect", mMap.get(1).getExpect());
		} else {
			logger.error("单式缓存调用失败");
		}
		return 0;
	}

	@SuppressWarnings("unchecked")
	public int project_fq_hsc(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (lotidMap.get(bean.getLotid()) == null) {
			write_html_response("<script>alert(\"参数错误\");</script>", response);
			return 0;
		}
		Cache cache = loadCacheds(bean.getLotid(), "", context);
		if (cache != null) {
			Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
			request.setAttribute("mb", mMap);
			request.setAttribute("lotid", bean.getLotid());
			request.setAttribute("expect", this.loadexpect(mMap));
			request.setAttribute("endtime", this.loadexpectendtime(mMap));
		} else {
			logger.error("单式缓存调用失败");
		}
		return 0;
	}

	private int maxPostSize = 50 * 1024 * 1024;
	private final String UPFILE = "upfile";
	private static HashMap<Integer, String> ggGroupMap = new HashMap<Integer, String>();
	static {
		ggGroupMap.put(27, "单关");
		ggGroupMap.put(1, "2*1");
		ggGroupMap.put(3, "3*1");
		ggGroupMap.put(7, "4*1");
		ggGroupMap.put(14, "5*1");
		ggGroupMap.put(20, "6*1");
		ggGroupMap.put(35, "7*1");
		ggGroupMap.put(36, "8*1");
		ggGroupMap.put(37, "9*1");
		ggGroupMap.put(38, "10*1");
		ggGroupMap.put(39, "11*1");
		ggGroupMap.put(40, "12*1");
		ggGroupMap.put(41, "13*1");
		ggGroupMap.put(42, "14*1");
		ggGroupMap.put(43, "15*1");

	}

	@SuppressWarnings("unchecked")
	public int project_fqck_ds(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		FileUpload upload = null;
		try {
			long ustime = System.currentTimeMillis();
			System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
			try {
				// 构造对象
				upload = new FileUpload(request, FileCastServlet.PATH + File.separator + temp, new String[] { "txt" }, this.maxPostSize);
			} catch (Exception e) {
				throw new Exception("上传发生错误");
			}

			long uetime = System.currentTimeMillis();
			System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
			System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
			System.out.println("文件保存位置：" + FileCastServlet.PATH + File.separator + temp);

			// 获取参数
			File file = null;

			String pid = StringUtil.getNullString(upload.getRequestField("expect"));// 期次编号
			bean.setExpect(pid);

			String gid = StringUtil.getNullString(upload.getRequestField("lotid"));// 游戏编号
			bean.setLotid(gid);

//			String ishsc = StringUtil.getNullString(upload.getRequestField("ishsc"));// 是否后上传
			String projid = StringUtil.getNullString(upload.getRequestField("projid"));// 方案ID
			bean.setProjid(projid);

			String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
			int beishu = StringUtil.getNullInt(upload.getRequestField("beishu"));// 玩法
			bean.setBeishu(beishu);
			int ggtype = StringUtil.getNullInt(upload.getRequestField("ggtype"));// 过关类型
			bean.setGgtype(ggtype);

			String ishm = StringUtil.getNullString(upload.getRequestField("ishm"));
			bean.setIshm(ishm);

			String ggnameStr = "";
			String ggname = "";
			if (gid.equalsIgnoreCase("85")) {
				String[] ggnameArr = new String[] { "3", "1", "0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("89")) {
				String[] ggnameArr = new String[] { "0", "1", "2", "3", "4", "5", "6", "7" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("88")) {
				String[] ggnameArr = new String[] { "上+单", "上+双", "下+单", "下+双" };
				String[] ggnameArr1 = new String[] { "3", "2", "1", "0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("86")) {
				String[] ggnameArr = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "0:9", "9:9", "9:0" };
				String[] ggnameArr1 = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "0:9", "9:9", "9:0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("87")) {
				String[] ggnameArr = new String[] { "0-0", "0-1", "0-3", "1-0", "1-1", "1-3", "3-0", "3-1", "3-3" };
				String[] ggnameArr1 = new String[] { "0-0", "0-1", "0-3", "1-0", "1-1", "1-3", "3-0", "3-1", "3-3" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			}

			bean.setGgname(ggname);

			String matchesStr = "";
			if (upload.getRequestField("matches[]") != null) {
				String[] matchesArr = (String[]) upload.getRequestField("matches[]");
				for (int i = 0; i < matchesArr.length; i++) {
					if (i == matchesArr.length - 1) {
						matchesStr += matchesArr[i];
					} else {
						matchesStr += matchesArr[i] + ",";
					}
				}
			}

			System.out.println("gid：" + gid);
			System.out.println("pid：" + pid);
			// System.out.println("playid：" + playid);
			System.out.println("beishu：" + beishu);
			System.out.println("initems：" + initems);
			System.out.println("ggtype：" + ggtype);
			System.out.println("ggname：" + ggnameStr);
			System.out.println("matchesStr：" + matchesStr);

			String filename = gid + "_" + pid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(bean.getUid(), gid, pid).toLowerCase();
			bean.setRand(filename);

			String filename1 = FileUpload.getFileName(bean.getUid(), bean.getLotid(), bean.getExpect()).toLowerCase();
			bean.setRand1(filename1);// 发起成功后的文件名

			System.out.println("bean.getUid()：" + bean.getUid());
			System.out.println("filename：" + filename);

			upload.setFileName(UPFILE, filename);
			file = upload.getFile(UPFILE);
			if (file != null) {// 如果有上传文件的话
				long cstime = System.currentTimeMillis();
				System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

				GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
				if (plugin != null) {
					System.out.println("1");
					FileInputStream fis = new FileInputStream(file);
					System.out.println("2");
					BufferedReader br = new BufferedReader(new InputStreamReader(fis, "gbk"));
					System.out.println("3");
					String tmp = null;
					int total = 0;
					String items = null;
					String gglists = null;

					FilterResult result = new FilterResult();
					CodeBean codebean = new CodeBean();
					codebean.setCodeitems(ggnameStr);
					codebean.setPlaytype(lotidMap.get(gid));
					codebean.setLottype(Integer.parseInt(gid));
					System.out.println("开始检测");
					while ((tmp = br.readLine()) != null) {
						System.out.println(tmp);
						if (!CheckUtil.isNullString(tmp)) {
							if (initems.equals("1")) {
								codebean.setItemType(CodeBean.HAVEITEM);
								codebean.setCode(tmp);
							} else {
								codebean.setItemType(CodeBean.NOITEM);
								codebean.setCode(tmp);
								codebean.setTeamitems(matchesStr);
								codebean.setGuoguan(ggGroupMap.get(ggtype));
							}
							FilterBase.doFilter(codebean, result);
							if (isValid(result.getCurrentCode())) {
								GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
								total += gcc.getCastMoney();
							}
						}
					}
					fis.close();

					bean.setTotal(total);
					items = result.getTeamItems();
					bean.setItems(items);
					gglists = result.getGglists();
					bean.setGglists(gglists);

					if (total < 2) {
						throw new Exception("未能够检测出有效的方案 请检查方案是否符合标准格式");
					}

					// 上传后服务端解析的格式供给用户未发起成功时检测方案内容
					// 方案发起成功后该文件必须删除
					if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + temp, bean.getRand() + "_tmp.txt", "gbk")) {
						logger.error(bean.getRand() + "_tmp.txt" + "：存储失败");
						throw new Exception("存储失败");
					}

					System.out.println("result.getAllCode()=" + result.getAllCode());
					System.out.println("result.getTotalMoney()=" + result.getTotalMoney());
					System.out.println("items=" + items);
					System.out.println("total=" + bean.getTotal());

					Cache cache = loadCacheds(bean.getLotid(), "", context);
					Date firsttime = null;

					if (cache != null) {
						Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();

						// 获取最早一场的比赛ID
						firsttime = loadfirsttime(mMap, bean.getItems());
						firsttime.setTime(firsttime.getTime() - 1000 * 60 * Fetdiff);

						if (System.currentTimeMillis() > firsttime.getTime()) {
							throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
						}
						System.out.println("-------------------------------");
						System.out.println(mMap.get(4));
						
						String[] item = StringUtil.splitter(items, ",");
						

						if (!bean.getExpect().equalsIgnoreCase(mMap.get(Integer.parseInt(item[0])).getExpect())) {
							throw new Exception("该期" + bean.getExpect() + "已经过期" + " 下次请提前");
						}

						System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
						request.setAttribute("errcode", "0");
						request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
						request.setAttribute("matchnum", bean.getItems().split(",").length);
						request.setAttribute("sgtypename", bean.getGglists());
						request.setAttribute("gggroupstr", "自由过关");
						request.setAttribute("zhushu", bean.getTotal() / 2);
						request.setAttribute("beishu", bean.getBeishu());
						request.setAttribute("totalmoney", bean.getTotal() * bean.getBeishu());
						request.setAttribute("amoney", bean.getTotal() * bean.getBeishu());
						request.setAttribute("omoney", bean.getTotal());
						request.setAttribute("rand", bean.getRand());
						request.setAttribute("ishm", bean.getIshm());

						request.setAttribute("mb", mMap);

						request.setAttribute("lotid", bean.getLotid());
						request.setAttribute("expect", bean.getExpect());
						request.setAttribute("str_matches", bean.getItems());
						request.setAttribute("ggtype", bean.getGgtype());
						request.setAttribute("ggname", bean.getGgname());
						request.setAttribute("backurl", getBack(bean.getLotid(), "ds"));
					} else {
						logger.error("单式缓存调用失败");
						throw new Exception("单式缓存调用失败");
					}

				}
				long cetime = System.currentTimeMillis();
				System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
				System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
			}
		} catch (Exception e) {
			uploadErr(request, e, upload);
		}
		return 0;
	}

	private Date loadfirsttime(Map<Integer, MatchBean> maps, String items) throws Exception {
		Date firsttime = null;
		String[] itemarr = StringUtil.splitter(items, ",");
		System.out.println("map.size---------->" + maps.size());
		// 获取方案的截至时间		
		for (int i = 0; i < itemarr.length; i++) {
			Integer a = Integer.parseInt(itemarr[i]);
			MatchBean mb = maps.get(a);
			if(mb == null){
				throw new Exception("未找到投注场次：" + a);
			}

			Date tmp = DateUtil.parserDateTime(mb.getEt());
			if (firsttime == null) {
				firsttime = tmp;
			} else {
				if (tmp.getTime() < firsttime.getTime()) {
					firsttime = tmp;
				}
			}
		}
		System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
		return firsttime;
	}
	
	private String loadexpectendtime(Map<Integer, MatchBean> maps) throws Exception {
		Date expectendtime = null;
		Iterator<Integer> keys = maps.keySet().iterator();
		while (keys.hasNext()) {
			Integer key = keys.next();
			MatchBean mb = maps.get(key);	
			Date tmp = DateUtil.parserDateTime(mb.getEt());
			if (expectendtime == null) {
				expectendtime = tmp;
			} else {
				if (tmp.getTime() > expectendtime.getTime()) {
					expectendtime = tmp;
				}
			}
		}	
		return DateUtil.getDateTime(expectendtime.getTime() - 1000 * 60 * Fetdiff);
	}
	
	private String loadexpect(Map<Integer, MatchBean> maps) throws Exception {
		String expect = null;
//		boolean bln=false;
		Iterator<Integer> keys = maps.keySet().iterator();
		while (keys.hasNext()) {
			Integer key = keys.next();
			MatchBean mb = maps.get(key);
			if (!StringUtil.isEmpty(mb.getExpect())){
//				bln=true;
				expect= mb.getExpect();
				break;
			}
		}	
		return expect;
	}
	
	private Cache loadCacheds(String lotid, String pid, RbcFrameContext context) throws Exception {
		if (!lotidMap.containsKey(lotid)) {
			System.out.println("loadCacheds:err");
			return null;
		}
		CacheManager cm = CacheManager.getCacheManager();
		Cache cache = cm.getCacheMatch(lotid, pid);
		int rc;
		UserBean periodbean = new UserBean();
		
		System.out.println("cache = ");
		System.out.println(cache);
		
		if (cache == null || cache.isExpired()) {
			String tmppid = pid;
			if (pid.equalsIgnoreCase("")) {
				periodbean.setFid("c_cache_list");
				periodbean.setGid(lotid);
				rc = RemoteBeanCallUtil.RemoteBeanCall(periodbean, context, GroupContain.USER_GROUP, "query");
				if (rc == 0) {
					if (periodbean.getBusiErrCode() == 0) {
						JXmlWapper xml = JXmlWapper.parse("<Resp>" + periodbean.getBusiXml() + "</Resp>");
						tmppid = xml.getStringValue("row[0].@pid");
						if (tmppid != null) {
							periodbean.setGid("4");
							periodbean.setPid(tmppid);
							System.out.println("单式期号：" + tmppid);
						} else {
							logger.error("期号信息获取失败1");
						}
					}
				}else{
					logger.error("期号信息获取失败2 rc=" + rc);
				}
			} else {
				periodbean.setGid("4");
				periodbean.setPid(pid);
			}

			String[] fn = new String[] {"sfgg.xml", "spf.xml", "cbf.xml", "bqc.xml", "sxp.xml", "jqs.xml" };

			int value = Integer.parseInt(lotid) - 84;
			JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/beid/" + periodbean.getPid(), fn[value]));
			int count = xml.countXmlNodes("row");
			System.out.println(count);
			Map<Integer, MatchBean> mMap = new HashMap<Integer, MatchBean>();
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < count; i++) {
				System.out.println(i);
				try{
				int mid = xml.getIntValue("row[" + i + "].@mid");
				String hn = xml.getStringValue("row[" + i + "].@hn");
				String gn = xml.getStringValue("row[" + i + "].@gn");
				String bt = xml.getStringValue("row[" + i + "].@bt");
				String et = xml.getStringValue("row[" + i + "].@et");
				// firsttime.setTime(firsttime.getTime() - 1000 * 60 *
				// 5);
				String fet = "";
				Date tmpet = DateUtil.parserDateTime(et);
				tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
				fet = DateUtil.getDateTime(tmpet.getTime());
				String b3 = xml.getStringValue("row[" + i + "].@b3");
				String b1 = xml.getStringValue("row[" + i + "].@b1");
				String b0 = xml.getStringValue("row[" + i + "].@b0");
				double close = xml.getDoubleValue("row[" + i + "].@close", 0.0D);
				String mname = xml.getStringValue("row[" + i + "].@mname");
				// String spf = xml.getStringValue("row[" + i + "].@spf");
				// String bqc = xml.getStringValue("row[" + i + "].@bqc");
				// String cbf = xml.getStringValue("row[" + i + "].@cbf");
				// String jqs = xml.getStringValue("row[" + i + "].@jqs");
				// String sxp = xml.getStringValue("row[" + i + "].@sxp");
				String icancel = xml.getStringValue("row[" + i + "].@icancel");
				// if (icancel.equalsIgnoreCase("0")) {

				MatchBean mb = new MatchBean();
				mb.setMid(mid);
				mb.setHn(hn);
				mb.setGn(gn);
				mb.setBt(bt);
				mb.setEt(et);
				mb.setFet(fet);
				mb.setB3(b3);
				mb.setB1(b1);
				mb.setB0(b0);
				mb.setClose(close);
				mb.setMname(mname);
				mb.setIcancel(icancel);

				switch (value) {
				case 0:
					mb.setSpv(xml.getStringValue("row[" + i + "].@sf"));
					break;
				case 1:
					mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
					break;
				case 2:
					mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
					break;
				case 3:
					mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
					break;
				case 4:
					mb.setSpv(xml.getStringValue("row[" + i + "].@sxp"));
					break;
				case 5:
					mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
					break;
				default:
					break;
				}

				// mb.setSpf(spf);
				// mb.setBqc(bqc);
				// mb.setCbf(cbf);
				// mb.setJqs(jqs);
				// mb.setSxp(sxp);
				mb.setExpect(tmppid);
//				mList.add(mb);
				mMap.put(Integer.valueOf(mb.getMid()), mb);
				// }
				sb.append(mb.getMid()).append(",");
				System.out.println(sb.toString());
				}catch(Exception e){
					e.printStackTrace();
				}
			}
			Cache ca = new Cache(lotid, mMap, System.currentTimeMillis() + 1000 * 10, false);
			cm.putCacheMatch(lotid, pid, ca);
			System.out.println(lotid + "_" + pid + "本地缓存更新 场次列表=" + sb.toString());
			cache = ca;
			// }
			// }
		} else {
			System.out.println(lotid + "_" + pid + "来源本地缓存");
		}
		return cache;
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

	private boolean isValid(String tmp) {
		if (tmp.indexOf("=") == -1) {
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
	private void fileOperator(File file, TradeBJBean bean) throws Exception {
		if (file != null) {
			try {
				File dFile = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect());
				if (!dFile.exists()) {
					dFile.mkdirs();
					System.out.println(dFile.getPath() + "文件夹创建成功");
				}
				if(file.getName().indexOf("xml")>0){
					File gldf = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand1() + "_gl.xml");
					if (FileUpload.fileCopy(file, gldf)) {
						if (!file.delete()) {
							System.out.println(file.getAbsolutePath() + "文件删除失败");
						}
					} else {
						System.out.println(file.getAbsolutePath() + "移动到" + gldf.getAbsolutePath() + "文件夹失败");
					}
					return;
				}

				// 移动出票格式的文件到对应文件夹
				File df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand1() + ".txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}

				// 移动用户原始文件到对应文件夹
				file = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + ".txt");
				df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand1() + "_old.txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings("unchecked")
	public int project_fqsuc_ds(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {
			File file = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + ".txt");
			if (!file.exists()) {
				throw new Exception("上传文件不存在 请从正确途径提交方案");
			}
			file = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + "_tmp.txt");
			if (!file.exists()) {
				throw new Exception("上传文件不存在 请从正确途径提交方案");
			}

			String filename = FileUpload.getFileName(bean.getUid(), bean.getLotid(), bean.getExpect()).toLowerCase();
			bean.setRand1(filename);// 发起成功后的文件名
			String items = "";
			long cstime = System.currentTimeMillis();
			System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(bean.getLotid());

			if (plugin != null) {
				FileInputStream fis = new FileInputStream(file);
				BufferedReader br = new BufferedReader(new InputStreamReader(fis));

				String temp = null;
				int total = 0;
				FilterResult result = new FilterResult();

				while ((temp = br.readLine()) != null) {
					String code = temp;
					GameCastCode gcc = plugin.parseGameCastCode(code);
					total += gcc.getCastMoney();
					if (gcc.getMatchID().length() > 2) {
						String[] matchidarr = gcc.getMatchID().split(",");
						for (int i = 0; i < matchidarr.length; i++) {
							if (matchidarr[i].length() > 0) {
								result.putItem(matchidarr[i]);
							}
						}
					}
				}
				items = result.getTeamItems();

				fis.close();

				Cache cache = loadCacheds(bean.getLotid(), "", context);
				Date firsttime = null;

				System.out.println("items=" + items);

				if (cache != null) {
					Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
					firsttime = loadfirsttime(mMap, items);
					firsttime.setTime(firsttime.getTime() - 1000 * 60 * Fetdiff);

					if (System.currentTimeMillis() > firsttime.getTime()) {
						throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
					}
					
					String item = StringUtil.splitter(items, ",")[0];
					
					if (!bean.getExpect().equalsIgnoreCase(mMap.get(Integer.parseInt(item)).getExpect())) {
						throw new Exception("该期" + bean.getExpect() + "已经过期" + " 下次请提前");
					}
				} else {
					logger.error("单式缓存调用失败");
					throw new Exception("单式缓存调用失败");
				}

				System.out.println("items=" + items);
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
			bean1.setCodes(bean.getRand1() + ".txt");// 投注号码（文件投注的文件名）
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
			bean1.setSource(bean.getSource());// 投注来源
			bean1.setEndTime("");// 截止时间
			bean1.setZid(items);

			fileOperator(file, bean);
			System.out.println("单式上传：文件移动成功");
			//过滤文件移动
			File glfile = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + "_gl.xml");
			if (!glfile.exists()) {
				logger.error("上传过滤文件不存在 请从正确途径提交方案");
			}else{
				fileOperator(glfile, bean);
			}
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "jproj_cast");
			if (rc != 0 || bean1.getBusiErrCode() != 0) {
				throw new Exception("投注失败：" + bean1.getBusiErrDesc());
			}
			bean.setBusiErrCode(bean1.getBusiErrCode());
			bean.setBusiErrDesc(bean1.getBusiErrDesc());
			bean.setBusiXml(bean1.getBusiXml());
		} catch (Exception e) {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc(e.getMessage());
		}

		return 0;
	}

	@SuppressWarnings("unchecked")
	public int project_hsc(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {

			if (CheckUtil.isNullString(bean.getUid())) {
				throw new Exception("尚未登录！");
			}

			System.out.println("project_hsc.....");
			if (lotidMap.get(bean.getLotid()) == null) {
				write_html_response("<script>alert(\"参数错误\");</script>", response);
				return 0;
			}
			System.out.println("bean.getBusiErrCode()=" + bean.getBusiErrCode());

			TradeBean bean1 = new TradeBean();
			bean1.setUid(bean.getUid());
			bean1.setGid(bean.getLotid());
			bean1.setHid(bean.getProjid());

			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "queryProjectInfo");
			if (rc != 0 || bean1.getBusiErrCode() != 0) {
				throw new Exception("获取方案信息失败：" + bean1.getBusiErrDesc());
			}

			System.out.println("1.....");
			System.out.println(bean1.toXmlString());
			JXmlWapper lxml = JXmlWapper.parse(bean1.toXmlString());
			// JXmlWapper myjoin = lxml.getXmlNode("myjoins.myjoin");
			JXmlWapper row = lxml.getXmlNode("row");
			System.out.println("2.....");
			String nickid = "";
			String cnickid = "";
			int isupload = 0;
			String ccodes = "";
			int ifile = 0;

			int muli = 0;
			int money = 0;
//			int play = 0;
			int istate = 0;
			String pid = "";
			Date endtime;
			String isend = "";
			System.out.println("3.....");
			if (row != null) {
				nickid = bean.getUid();
				cnickid = row.getStringValue("@cnickid");
				isupload = row.getIntValue("@upload");
				ccodes = row.getStringValue("@ccodes");
				ifile = row.getIntValue("@ifile");
				muli = row.getIntValue("@mulity");
				money = row.getIntValue("@tmoney");
//				play = row.getIntValue("@play");
				pid = row.getStringValue("@periodid");
				istate = row.getIntValue("@istate");
				endtime = row.getDateValue("@endtime");
			} else {
				throw new Exception("您不是方案的发起人,无权上传方案");
			}
			System.out.println("4.....");

			if (nickid == "" && !nickid.equalsIgnoreCase(cnickid)) {
				throw new Exception("您不是方案的发起人,无权上传方案,请检查是否登录正确的用户名");
			}
			if (isupload != 0 || ccodes != "" || ifile != 1) {
				throw new Exception("方案已经上传");
			}
			if (pid == "") {
				throw new Exception("方案信息获取失败");
			}

			if (istate > 2) {
				throw new Exception("方案已经过期或者撤销");
			}
			System.out.println("pid=" + pid);
			if (System.currentTimeMillis() > endtime.getTime()) {
				isend = "1";
			}

			Cache cache = loadCacheds(bean.getLotid(), pid, context);
			if (cache != null) {
				Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
				request.setAttribute("mb", mMap);
				request.setAttribute("lotid", bean.getLotid());
				request.setAttribute("projid", bean.getProjid());
				request.setAttribute("projid", bean.getProjid());
				request.setAttribute("expect", pid);
				request.setAttribute("endtime", endtime);
				request.setAttribute("money", money);
				request.setAttribute("muli", muli);
				request.setAttribute("zhushu", money / muli / 2);
				request.setAttribute("ishsc", "1");
				request.setAttribute("isend", isend);
			} else {
				logger.error("单式缓存调用失败");
			}
		} catch (Exception e) {
			write_html_response(e.getMessage(), response);
		}
		return 0;
	}

	@SuppressWarnings("unchecked")
	public int project_hsc_suc(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		FileUpload upload = null;
		File file = null;

		try {

			long ustime = System.currentTimeMillis();
			System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
			try {
				// 构造对象
				upload = new FileUpload(request, FileCastServlet.PATH + File.separator + temp, new String[] { "txt" }, this.maxPostSize);
			} catch (Exception e) {
				throw new Exception("上传发生错误");
			}

			long uetime = System.currentTimeMillis();
			System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
			System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
			System.out.println("文件保存位置：" + FileCastServlet.PATH + File.separator + temp);

			// 检查是否登录
			HttpSession session = request.getSession();
			String uid = (String) session.getAttribute(UID_KEY);
			String pwd = (String) session.getAttribute(PWD_KEY);

			if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
				throw new Exception("尚未登录！");
			} else {
				bean.setUid(uid);
				bean.setPwd(pwd);
			}

			String pid = StringUtil.getNullString(upload.getRequestField("expect"));// 期次编号
			bean.setExpect(pid);
			String gid = StringUtil.getNullString(upload.getRequestField("lotid"));// 游戏编号
			bean.setLotid(gid);
			String projid = StringUtil.getNullString(upload.getRequestField("projid"));// 方案ID
			bean.setProjid(projid);

			String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
			// int beishu =
			// StringUtil.getNullInt(upload.getRequestField("beishu"));// 玩法
			// bean.setBeishu(beishu);
			int ggtype = StringUtil.getNullInt(upload.getRequestField("ggtype"));// 过关类型
			bean.setGgtype(ggtype);

			String ggnameStr = "";
			String ggname = "";
			if (gid.equalsIgnoreCase("85")) {
				String[] ggnameArr = new String[] { "3", "1", "0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("89")) {
				String[] ggnameArr = new String[] { "0", "1", "2", "3", "4", "5", "6", "7" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("88")) {
				String[] ggnameArr = new String[] { "上+单", "上+双", "下+单", "下+双" };
				String[] ggnameArr1 = new String[] { "3", "2", "1", "0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("86")) {
				//String[] ggnameArr = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "负其他", "平其他", "胜其他" };
				//String[] ggnameArr1 = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "0:9", "9:9", "9:0" };
				String[] ggnameArr = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "0:9", "9:9", "9:0" };
				String[] ggnameArr1 = new String[] { "0:0", "0:1", "0:2", "0:3", "0:4", "1:0", "1:1", "1:2", "1:3", "1:4", "2:0", "2:1", "2:2", "2:3", "2:4", "3:0", "3:1", "3:2", "3:3", "4:0", "4:1", "4:2", "4:3", "4:4", "0:9", "9:9", "9:0" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			} else if (gid.equalsIgnoreCase("87")) {
				String[] ggnameArr = new String[] { "0-0", "0-1", "0-3", "1-0", "1-1", "1-3", "3-0", "3-1", "3-3" };
				String[] ggnameArr1 = new String[] { "0-0", "0-1", "0-3", "1-0", "1-1", "1-3", "3-0", "3-1", "3-3" };
				for (int i = 0; i < ggnameArr.length; i++) {
					String tmp = ggnameArr1[i] + "=" + (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					if (i == ggnameArr.length - 1) {
						ggnameStr += tmp;
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]");
					} else {
						ggnameStr += tmp + ",";
						ggname += (String) upload.getRequestField("ggname[" + ggnameArr[i] + "]") + ",";
					}
				}
			}

			bean.setGgname(ggname);

			String matchesStr = "";
			if (upload.getRequestField("matches[]") != null) {
				String[] matchesArr = (String[]) upload.getRequestField("matches[]");
				for (int i = 0; i < matchesArr.length; i++) {
					if (i == matchesArr.length - 1) {
						matchesStr += matchesArr[i];
					} else {
						matchesStr += matchesArr[i] + ",";
					}
				}
			}

			String filename = gid + "_" + pid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(bean.getUid(), gid, pid).toLowerCase();
			bean.setRand(filename);

			String filename1 = FileUpload.getFileName(bean.getUid(), bean.getLotid(), bean.getExpect()).toLowerCase();
			bean.setRand1(filename1);// 发起成功后的文件名

			upload.setFileName(UPFILE, filename);
			file = upload.getFile(UPFILE);

			if (file != null) {// 如果有上传文件的话
				long cstime = System.currentTimeMillis();
				System.out.println("文件解析：" + DateUtil.getCurrentDateTime());
				GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
				if (plugin != null) {
					System.out.println("1");
					FileInputStream fis = new FileInputStream(file);
					System.out.println("2");
					BufferedReader br = new BufferedReader(new InputStreamReader(fis, "gbk"));
					System.out.println("3");
					String tmp = null;
					int total = 0;
					String items = null;
					String gglists = null;

					FilterResult result = new FilterResult();
					CodeBean codebean = new CodeBean();
					codebean.setCodeitems(ggnameStr);
					codebean.setPlaytype(lotidMap.get(gid));
					codebean.setLottype(Integer.parseInt(gid));
					System.out.println("开始检测");
					while ((tmp = br.readLine()) != null) {
						System.out.println(tmp);
						if (!CheckUtil.isNullString(tmp)) {
							if (initems.equals("1")) {
								codebean.setItemType(CodeBean.HAVEITEM);
								codebean.setCode(tmp);
							} else {
								codebean.setItemType(CodeBean.NOITEM);
								codebean.setCode(tmp);
								codebean.setTeamitems(matchesStr);
								codebean.setGuoguan(ggGroupMap.get(ggtype));
							}
							FilterBase.doFilter(codebean, result);
							if (isValid(result.getCurrentCode())) {
								GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
								total += gcc.getCastMoney();
							}
						}
					}
					fis.close();

					bean.setTotal(total);
					items = result.getTeamItems();
					bean.setItems(items);
					gglists = result.getGglists();
					bean.setGglists(gglists);

					Cache cache = loadCacheds(bean.getLotid(), "", context);
					Date firsttime = null;

					System.out.println("items=" + items);

					if (total < 2) {
						throw new Exception("未能够检测出有效的方案 请检查方案是否符合标准格式");
					}

					if (cache != null) {
						Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();					
						firsttime = loadfirsttime(mMap, items);
						firsttime.setTime(firsttime.getTime() - 1000 * 60 * Fetdiff);

						if (System.currentTimeMillis() > firsttime.getTime()) {
							throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
						}
						if (!bean.getExpect().equalsIgnoreCase(mMap.get(1).getExpect())) {
							throw new Exception("该期" + bean.getExpect() + "已经过期" + " 下次请提前");
						}
					} else {
						logger.error("单式缓存调用失败");
						throw new Exception("单式缓存调用失败");
					}

					if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + temp, bean.getRand() + "_tmp.txt", "gbk")) {
						logger.error(bean.getRand() + "_tmp.txt" + "：存储失败");
						throw new Exception("存储失败");
					}

					TradeBean bean1 = new TradeBean();
					bean1.setUid(bean.getUid());
					bean1.setPwd(bean.getPwd());
					bean1.setGid(bean.getLotid());
					bean1.setHid(bean.getProjid());

					int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "queryProjectInfo");
					if (rc != 0 || bean1.getBusiErrCode() != 0) {
						throw new Exception("获取方案信息失败：" + bean1.getBusiErrDesc());
					}

					JXmlWapper lxml = JXmlWapper.parse(bean1.toXmlString());
					// JXmlWapper myjoin = lxml.getXmlNode("myjoins.myjoin");
					JXmlWapper row = lxml.getXmlNode("row");

					String nickid = "";
					String cnickid = "";
					int isupload = 0;
					String ccodes = "";
					int ifile = 0;

					int muli = 0;
					int money = 0;
//					int play = 0;
					int istate = 0;

					String pidstr = "";
					Date endtime;
//					String isend = "";

					if (row != null) {
						nickid = bean.getUid();
						cnickid = row.getStringValue("@cnickid");
						isupload = row.getIntValue("@upload");
						ccodes = row.getStringValue("@ccodes");
						ifile = row.getIntValue("@ifile");
						muli = row.getIntValue("@mulity");
						money = row.getIntValue("@tmoney");
//						play = row.getIntValue("@play");
						pidstr = row.getStringValue("@periodid");
						istate = row.getIntValue("@istate");
						endtime = row.getDateValue("@endtime");
					} else {
						throw new Exception("您不是方案的发起人,无权上传方案");
					}

					if (nickid == "" && !nickid.equalsIgnoreCase(cnickid)) {
						throw new Exception("您不是方案的发起人,无权上传方案,请检查是否登录正确的用户名");
					}
					if (isupload != 0 || ccodes != "" || ifile != 1) {
						throw new Exception("方案已经上传");
					}
					if (pidstr == "") {
						throw new Exception("方案信息获取失败");
					}

					if (istate > 2) {
						throw new Exception("方案已经过期或者撤销");
					}

					if (System.currentTimeMillis() > endtime.getTime()) {
						throw new Exception("方案已经过期或者撤销");
					}

					if (bean.getTotal() * muli != money) {
						throw new Exception("解析后为：" + (bean.getTotal() / 2) + "注,实际需要上传" + (money / muli / 2) + "注。");
					}

					bean1.setCodes(bean.getRand1() + ".txt");
					bean1.setEndTime(DateUtil.getDateTime(firsttime.getTime()));
					bean1.setMoney(money);

					fileOperator_hsc_suc(file, bean);
					int rc1 = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "proj_upload");
					if (rc1 != 0 || bean1.getBusiErrCode() != 0) {
						throw new Exception("方案后上传失败：" + bean1.getBusiErrDesc());
					}
					write_html_response("<script>window.location='"+lotidViewpathMap.get(bean.getLotid())+"project.html?lotid=" + bean.getLotid() + "&projid=" + bean.getProjid() + "'</script>", response);
				}
				long cetime = System.currentTimeMillis();
				System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
				System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
			}
		} catch (Exception e) {
			write_html_response("<script>alert('" + e.getMessage() + "');if (history.length == 0){window.opener = '';window.close();} else {history.go(-1);}</script>", response);
			fileOperator_hsc_err(file, bean);
		}
		return 0;
	}

	private void fileOperator_hsc_err(File file, TradeBJBean bean) throws Exception {
		try {
			if (file != null) {

				if (!file.delete()) {
					System.out.println(file.getAbsolutePath() + "文件删除失败");
				}

			}
			File df = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + "_tmp.txt");
			if (df != null) {
				if (!df.delete()) {
					System.out.println(df.getAbsolutePath() + "文件删除失败");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	private void fileOperator_hsc_suc(File file, TradeBJBean bean) throws Exception {
		if (file != null) {
			try {
				File dFile = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect());
				if (!dFile.exists()) {
					dFile.mkdirs();
					System.out.println(dFile.getPath() + "文件夹创建成功");
				}

				// 移动用户原始文件到对应文件夹
				File df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand1() + "_old.txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}

				// 移动出票格式的文件到对应文件夹
				file = new File(FileCastServlet.PATH + File.separator + temp + File.separator + bean.getRand() + "_tmp.txt");
				df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand1() + ".txt");
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}

			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	
	public int sendfilter(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {

		Cache cache = loadCacheds(playidMap.get(bean.getPlayid()), bean.getExpect(), context);
		if (cache != null) {
			Date firsttime = null;
			Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();
//			List<MatchBean> mb = (List<MatchBean>) cache.getValue();

			// 1:[胜,平,负]/2:[胜,平,负]/3:[胜,平,负]/4:[胜,平,负]/5:[胜,平,负] 胆码相同
			String Codes = bean.getCodes();
			String danCodes = bean.getDanma();
			String[] code = StringUtil.splitter(Codes, "/");
			String[] danCode = StringUtil.splitter(danCodes, "/");
			int[] chang = new int[code.length];

			// 检查投注串是否合法
			for (int i = 0; i < code.length; i++) {
				String[] cs = new String[2];
				cs[0] = code[i].substring(0, code[i].indexOf(":"));
				cs[1] = code[i].substring(code[i].indexOf(":") + 1);

				System.out.println("a=" + cs[0]);
				System.out.println("b=" + cs[1]);

				chang[i] = Integer.parseInt(cs[0]);
				if (cs[1].substring(0, 1).equalsIgnoreCase("[") && cs[1].substring(cs[1].length() - 1).equalsIgnoreCase("]")) {
					String[] ccs = StringUtil.splitter(cs[1].substring(1, cs[1].length() - 1), ",");
					checkItems(ccs, bean.getPlayid());
				} else {
					throw new Exception("投注串不符合要求(4)");
				}
			}

			// 获取方案的截至时间
			String items="";
			String danItems="";
			for (int i = 0; i < chang.length; i++) {
				items+=chang[i]+",";		
			}
			if(!danCodes.equals("")){
				for (int i = 0; i < danCode.length; i++) {
					danItems+=danCode[i].substring(0, danCode[i].indexOf(":"))+",";		
				}
				danItems = danItems.substring(0,danItems.lastIndexOf(","));
			}
			
			items = items.substring(0,items.lastIndexOf(","));	
			firsttime = loadfirsttime(mMap, items);

			StringBuffer sb = new StringBuffer();
			String[] cs=bean.getCodes().split("/");

			for (int j=0;j<cs.length;j++){
				String[] t1 = new String[2];
				
				t1[0] = cs[j].substring(0,cs[j].indexOf(":"));
				t1[1] = cs[j].substring(cs[j].indexOf(":")+1);
				
				
				String mid= t1[0];
				String value= t1[1].substring(1,t1[1].length()-1);
				
				String[] xz = value.split(",");
				String spv=mMap.get(Integer.parseInt(mid)).getSpv();
				//场次，主队，让球数，客队，胜赔率，平赔率，负赔率，胜sp值，平sp值，负sp值
				sb.append(mMap.get(Integer.parseInt(mid)).getMid() + ",");
				sb.append(mMap.get(Integer.parseInt(mid)).getHn() + ",");
				sb.append(mMap.get(Integer.parseInt(mid)).getClose()==0?"-,":mMap.get(Integer.parseInt(mid)).getClose() + ",");
				sb.append(mMap.get(Integer.parseInt(mid)).getGn() + ",");
				
				
				//sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("胜"))) + ",");
				//sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("平"))) + ",");
				//sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("负"))) + ",");
				
				String b3 =  mMap.get(Integer.parseInt(mid)).getB3();
				if(StringUtil.isEmpty(b3)){
					b3 = "0";
				}
				String b1 =  mMap.get(Integer.parseInt(mid)).getB1();
				if(StringUtil.isEmpty(b1)){
					b1 = "0";
				}
				String b0 =  mMap.get(Integer.parseInt(mid)).getB0();
				if(StringUtil.isEmpty(b0)){
					b0 = "0";
				}
				sb.append(b3 + ",");
				sb.append(b1 + ",");
				sb.append(b0 + ",");
				
				sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("胜"))) + ",");
				sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("平"))) + ",");
				sb.append(TradeBJBeanImpl.getsp(spv, TradeBJBeanImpl.SPFSpMaps.get(TradeBJBeanImpl.SPFMaps.get("负"))) + ",");
				
	 			
				sb.append(value.replace(",", "").replace("胜", "3").replace("平", "1").replace("负", "0"));
				if(j!=cs.length-1){
					sb.append("--");
				}
			}
			

			String filterdata = sb.toString();
			sb = null;
			String issue = bean.getExpect();
			String time = DateUtil.getCurrentFormatDate("yyyyMMddHHmmss");

			String crc = MD5Util.compute(issue + "_" + time + "_" + PythonFilterUtil.BD_CUSPWD);
			
			String contents ="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>";
			contents=contents+"<html xmlns='http://www.w3.org/1999/xhtml'>";
			contents=contents+"<head>";
			contents=contents+"<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />";
			contents=contents+"<title>北京单场投注－－过滤投注</title>";
			contents=contents+"</head>";
			contents=contents+"<body>";
			contents=contents+"<form action='" + PythonFilterUtil.BD_URL + "' method='post'  >" 
					+ "<input type='hidden' name='dataVal' value='" + filterdata + "' />" 
					+ "<input type='hidden' name='cusKey' value='" + PythonFilterUtil.BD_CUSKEY + "' />"
					+ "<input type='hidden' name='ggType' value='" + bean.getSgtypename().replace("串", "_")+ "' />" 
					+ "<input type='hidden' name='issueId' value='" + issue + "' />" 
					+ "<input type='hidden' name='multi' value='" + bean.getBeishu() + "' />"
					+ "<input type='hidden' name='time' value='" + time + "' />" 
					+ "<input type='hidden' name='totalNum' value='" + bean.getZhushu() + "' />" 
					+ "<input type='hidden' name='firstEndDate' value='" + DateUtil.getDateTime(firsttime.getTime(), "YYYY-MM-dd HH:mm:ss") + "' />"
					+ "<input type='hidden' name='callback' value='" + PythonFilterUtil.BD_BACKUP_URL + "' />"
					+ "<input type='hidden' name='danMatchs' value='" + danItems + "' />"
					+ "<input type='hidden' name='singleCodes' value='' />"
					+ "<input type='hidden' name='betId' value='' />"
					
					+ "<input type='hidden' name='valiCode' value='" + crc + "' />" + "</form>";

			contents=contents+"<script language='javascript' > document.forms[0].submit();";
			contents=contents+"</script>";
			contents=contents+"</body>";
			contents=contents+"</html>";
//			logger.info("-----------------"+contents);
			write_html_response("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" >" + contents, response);
		} 
		
		return 0;
	}
	
	
	public int project_filter(TradeBJBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String jsondata = request.getParameter("revContextJon");
		System.out.println(jsondata);
		JSONObject json = null;
		try {
			json = new JSONObject(jsondata);
		} catch (JSONException e) {
			e.printStackTrace(System.err);
			logger.info("TradeBjBeanImpl.project_filter", e);
		}
		if (json == null) {
			logger.info("TradeBjBeanImpl.project_filter", "过滤不成功");
			return 1;
		}
		
		// 过滤后的号码组合 Base64解码
		String glResult = json.getString("glResult");
		byte[] b = null;
		try {
			b = Base64.decode(glResult);
		} catch (Exception e) {
			logger.info("GuoLvBeanImpl.getGuoLvData", "解码不成功");
			return 1;
		}
		// 号码组合 解压缩
		byte[] fristDcm = PythonFilterUtil.decompress(b);
		// 号码组合 解压缩
		byte[] secondDcm = PythonFilterUtil.decompress(fristDcm);
		glResult = new String(secondDcm);
		System.out.println(glResult);// MD5(glCC_glSel_cusPwd)
		String gtype = json.getString("ggType");//过关类型*
		String issue = json.getString("issueId");//所选期号*
		String glcc = json.getString("glCC");//过滤场次
		String selcc = json.getString("glSel");//场次选择，与过滤场次一一对应
		String glCondtion = json.getString("glCondtion");//过滤条件
		String afterzs = json.getString("glNum");//过滤后注数
		String glCondtionNum = json.getString("glCondtionNum");//过滤条件对应每一步注数；“，”分隔。
		String multi = json.getString("multi");//倍数*
		String beforezs = json.getString("total");//过滤前总注数
		String danMatchs = json.getString("danMatchs");//设胆场次
		String danScope = json.getString("danScope");//模糊设胆范围
		String lott = json.getString("lot");//彩种类型
		String glKey = json.getString("glKey");//订单号
		
		String[] glCondtions = StringUtil.splitter(glCondtion,"|");
		List<String[]> glCondtionList = new ArrayList<String[]>();
		for (int i = 0; i < glCondtions.length; i++) {
			glCondtionList.add(new String[]{PythonFilterUtil.zsGlChang(glCondtions[i]),StringUtil.splitter(glCondtionNum,",")[i]});
		}

		String pid = issue;// 期次编号
		bean.setExpect(pid);

		String gid = "85";// 游戏编号
		bean.setLotid(gid);

		String ishsc = "0";// 是否后上传
		String projid = "";// 方案ID
		bean.setProjid(projid);

		String initems = "1";// 是否包含场次信息
		int beishu = Integer.parseInt(multi);// 玩法
		bean.setBeishu(beishu);
		String gg = gtype.replace("_1", "*1");// 过关类型

		String ishm = "1";
		bean.setIshm(ishm);

		String ggnameStr = "3=3,1=1,0=0";
		String ggname = "a:3:{i:3;s:1:\"3\";i:1;s:1:\"1\";i:0;s:1:\"0\";}";
		bean.setGgname(ggname);



		String filename = gid + "_" + pid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(bean.getUid(), gid, pid).toLowerCase();
		bean.setRand(filename);


		System.out.println("bean.getUid()：" + bean.getUid());
		System.out.println("filename：" + filename);
		
		int total = 0;
		String items = null;
		String gglists = null;
		
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
		if (plugin != null) {
			
			FilterResult result = new FilterResult();
			CodeBean codebean = new CodeBean();
			codebean.setCodeitems(ggnameStr);
			codebean.setPlaytype(lotidMap.get(gid));
			codebean.setLottype(Integer.parseInt(gid));
			codebean.setGuoguan(gg);
			System.out.println("开始检测");
			StringBuffer sb = new StringBuffer();
			//33####,3#3###,3##3##,3###3#,3####3
			String[] codestr = StringUtil.splitter(glResult, ",");
			String tmp = null;
			
			for (int i = 0; i < codestr.length; i++) {
				tmp = codestr[i];
				if (!CheckUtil.isNullString(tmp)) {
					sb.append(tmp);
					sb.append("\r\n");
					if (initems.equals("1")) {
						codebean.setItemType(CodeBean.NOITEM);
						codebean.setTeamitems(glcc);
						codebean.setCode(tmp);
					} 
					
					FilterBase.doFilter(codebean, result);
					if (isValid(result.getCurrentCode())) {
						GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
						total += gcc.getCastMoney();
					}
				}
			}
			
			bean.setTotal(total);
			items = result.getTeamItems();
			bean.setItems(items);
			gglists = result.getGglists();
			bean.setGglists(gglists);

			if (total < 2) {
				throw new Exception("未能够检测出有效的方案 请检查方案是否符合标准格式");
			}

			StringBuffer sbgl = new StringBuffer();
			sbgl.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			sbgl.append("<xml>");
			sbgl.append("<row ");
			sbgl.append(JXmlUtil.createAttrXml("glKey", glKey));
			sbgl.append(JXmlUtil.createAttrXml("GgType", gtype));
			sbgl.append(JXmlUtil.createAttrXml("IssueId", issue));
			sbgl.append(JXmlUtil.createAttrXml("GlCC", glcc));
			sbgl.append(JXmlUtil.createAttrXml("GlSel", selcc));
			sbgl.append(JXmlUtil.createAttrXml("glResult", glResult));
			sbgl.append(JXmlUtil.createAttrXml("GlCondtion", glCondtion));
			sbgl.append(JXmlUtil.createAttrXml("GlCondtionNum", glCondtionNum));
			sbgl.append(JXmlUtil.createAttrXml("GlNum", afterzs));
			sbgl.append(JXmlUtil.createAttrXml("danMatchs", danMatchs));
			sbgl.append(JXmlUtil.createAttrXml("danScope", danScope));
			sbgl.append(JXmlUtil.createAttrXml("Multi", multi));
			sbgl.append(JXmlUtil.createAttrXml("GLQtotal", beforezs));
			sbgl.append("/>");
			sbgl.append("</xml>");
			
			if (!Util.SaveFile(sbgl.toString(), FileCastServlet.PATH + File.separator + temp, bean.getRand() + "_gl.xml", "gbk")) {
				logger.error(bean.getRand() + "_gl.xml" + "：存储失败");
			}
			// 上传后服务端解析的格式供给用户未发起成功时检测方案内容
			// 方案发起成功后该文件必须删除
			if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + temp, bean.getRand() + "_tmp.txt", "gbk")) {
				logger.error(bean.getRand() + "_tmp.txt" + "：存储失败");
				throw new Exception("存储失败");
			}
			
			
			if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + temp, bean.getRand() + ".txt", "gbk")) {
				logger.error(bean.getRand() + ".txt" + "：存储失败");
				throw new Exception("存储失败");
			}

			System.out.println("result.getAllCode()=" + result.getAllCode());
			System.out.println("result.getTotalMoney()=" + result.getTotalMoney());
			System.out.println("items=" + items);
			System.out.println("total=" + bean.getTotal());

			Cache cache = loadCacheds(bean.getLotid(), "", context);
			Date firsttime = null;

			if (cache != null) {
				Map<Integer, MatchBean> mMap = (Map<Integer, MatchBean>) cache.getValue();

				// 获取最早一场的比赛ID
				firsttime = loadfirsttime(mMap, bean.getItems());
				firsttime.setTime(firsttime.getTime() - 1000 * 60 * Fetdiff);

				if (System.currentTimeMillis() > firsttime.getTime()) {
					throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
				}

				if (!bean.getExpect().equalsIgnoreCase(mMap.get(1).getExpect())) {
					throw new Exception("该期" + bean.getExpect() + "已经过期" + " 下次请提前");
				}

				System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
				request.setAttribute("errcode", "0");
				request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
				request.setAttribute("matchnum", bean.getItems().split(",").length);
				request.setAttribute("sgtypename", bean.getGglists());
				request.setAttribute("gggroupstr", "自由过关");
				request.setAttribute("zhushu", bean.getTotal() / 2);
				request.setAttribute("beishu", bean.getBeishu());
				request.setAttribute("totalmoney", bean.getTotal() * bean.getBeishu());
				request.setAttribute("amoney", bean.getTotal() * bean.getBeishu());
				request.setAttribute("omoney", bean.getTotal());
				request.setAttribute("rand", bean.getRand());
				request.setAttribute("ishm", bean.getIshm());
				request.setAttribute("source", "3");

				request.setAttribute("mb", mMap);
				request.setAttribute("glCondtionList", glCondtionList);

				request.setAttribute("beforezs", beforezs);
				request.setAttribute("glcc", glcc);
				request.setAttribute("selcc", selcc);
				request.setAttribute("dmstr", danMatchs);
				request.setAttribute("danScope", danScope); 
				request.setAttribute("lotid", bean.getLotid());
				request.setAttribute("expect", bean.getExpect());
				request.setAttribute("str_matches", bean.getItems());
				request.setAttribute("ggtype", bean.getGgtype());
				request.setAttribute("ggname", bean.getGgname());
				request.setAttribute("backurl", getBack(bean.getLotid(), "ds"));
			} else {
				logger.error("单式缓存调用失败");
				throw new Exception("单式缓存调用失败");
			}
		}
		return 0;
	}

}
