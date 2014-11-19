package com.caipiao.cpweb.trade.buyconfirm;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import com.caipiao.cpweb.trade.ConfigUtil;
import com.caipiao.cpweb.trade.cache.Cache;
import com.caipiao.cpweb.trade.cache.CacheManager;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class BettingDetails {
	public static Logger logger = LoggerFactory.getLogger("web");
//	private static int BD_Fetdiff = 30;
	/**
	 * 胜负彩
	 * @param bean
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String getBettingDeails_80(BuyConfirmBean bean,int betType) {
		String chtml = "";
		chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_zc_tzxq_li1\">场次</li>";
		chtml += "<li class=\"cm_zc_xlnr_li3\">主队</li>";
		chtml += "<li class=\"cm_zc_xlnr_li3\">客队</li>";
		chtml += "<li class=\"cm_zc_tzxq_li4\">选项</li>";
		chtml += "</ul>";
		Cache cache = null;
		try {
			cache = loadMatchCache(bean.getGid(), bean.getPid());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("BuyConfirmBeanImpl.getCodeDetail ： gid=" + bean.getGid() + " pid=" + bean.getPid() );
		}
		if (cache != null) {
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			System.out.println("==============>" + bean.getCodes());
			String[] cs=bean.getCodes().split(",");
			for (int i=0;i<mb.size();i++){
				String[] ct = cs[i].split(""); 
				String ch = "";
				for (int j = 0; j < ct.length; j++) {
					ch += ct[j] + "&nbsp;";
				}
				chtml += "<ul class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_zc_tzxq_li1\">" + mb.get(i).getItemid() + "</li>";
				chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getHn() + "</li>";
				chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getGn() + "</li>";
				chtml += "<li class=\"cm_zc_tzxq_li4 cm_en\">" + ch + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * 任九
	 * @param bean
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String getBettingDeails_81(BuyConfirmBean bean,int betType) {
		String chtml = "";
		chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_zc_tzxq_li1\">场次</li>";
		chtml += "<li class=\"cm_zc_xlnr_li3\">主队</li>";
		chtml += "<li class=\"cm_zc_xlnr_li3\">客队</li>";
		chtml += "<li class=\"cm_zc_tzxq_li4\">选项</li>";
		chtml += "</ul>";
		Cache cache = null;
		try {
			cache = loadMatchCache(bean.getGid(), bean.getPid());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("BuyConfirmBeanImpl.getCodeDetail ： gid=" + bean.getGid() + " pid=" + bean.getPid() );
		}
		if (cache != null) {
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			//判断胆拖投注 cd[0] 拖码  cd[1] 
			if (bean.getCodes().indexOf("$")>0) {    
				String[] cd=bean.getCodes().split("\\$");
				String[] cs=cd[1].split(",");
				String[] dm=cd[0].split(",");

				boolean dt = false;
				int k = 0;
				for (int i=0;i<mb.size();i++){
					String[] ct = cs[i].split(""); 
					String ch = "";
					if (!"#".equals(cs[i])) {
						k++;
						for (int j = 0; j < ct.length; j++) {
							ch += ct[j] + "&nbsp;";
						}
					}
					String[] dh = dm[i].split(""); 
					
					if (!"#".equals(dm[i])) {
						dt = true;
						for (int j = 0; j < dh.length; j++) {
							ch += dh[j] + "&nbsp;";
						}
						ch += "(<span class=\"cm_red\">胆</span>)";
					}
					
					chtml += "<ul class=\"cm_zc_xlnr_ul clear1\">";
					chtml += "<li class=\"cm_zc_tzxq_li1\">" + mb.get(i).getItemid() + "</li>";
					chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getHn() + "</li>";
					chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getGn() + "</li>";
					chtml += "<li class=\"cm_zc_tzxq_li4 cm_en\">" + ch + "</li>";
					chtml += "</ul>";
				}
				if (k>9) {
					dt = true;
				}
				if (dt) {
					bean.setIsdt(1);
					bean.setCodes(cd[1]);
					bean.setDtcodes(cd[0]);
				}else{
					bean.setCodes(cd[1]);
				}
			}else{
				String[] cs=bean.getCodes().split(",");
				for (int i=0;i<mb.size();i++){
					String[] ct = cs[i].split(""); 
					String ch = "";
					for (int j = 0; j < ct.length; j++) {
						ch += ct[j] + "&nbsp;";
					}
					chtml += "<ul class=\"cm_zc_xlnr_ul clear1\">";
					chtml += "<li class=\"cm_zc_tzxq_li1\">" + mb.get(i).getItemid() + "</li>";
					chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getHn() + "</li>";
					chtml += "<li class=\"cm_zc_xlnr_li3\">" + mb.get(i).getGn() + "</li>";
					chtml += "<li class=\"cm_zc_tzxq_li4 cm_en\">" + ch + "</li>";
					chtml += "</ul>";
				}
			}
		}
		return chtml;
	}	
	
	
	/**
	 * 进球
	 * @param bean
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static String getBettingDeails_82(BuyConfirmBean bean,int betType) {
		String chtml = "";
		chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_zc_tzxq_li1\">场次</li>";
		chtml += "<li class=\"cm_zc_xlnr_li3\">对阵</li>";
		chtml += "<li class=\"cm_zc_tzxq_li5\">选项</li>";
		chtml += "</ul>";
		Cache cache = null;
		try {
			cache = loadMatchCache(bean.getGid(), bean.getPid());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("BuyConfirmBeanImpl.getCodeDetail ： gid=" + bean.getGid() + " pid=" + bean.getPid() );
		}
		if (cache != null) {
			List<MatchBean> mb= (List<MatchBean>) cache.getValue();
			String[] cs=bean.getCodes().split(",");
			for (int i=0;i<mb.size();i++){
				int k = i*2;
				String[] ct = cs[k].split(""); 
				String ch = "";
				for (int j = 0; j < ct.length; j++) {
					ch += ct[j] + "&nbsp;";
				}
				String[] ct1 = cs[k+1].split(""); 
				String ch1 = "";
				for (int j = 0; j < ct1.length; j++) {
					ch1 += ct1[j] + "&nbsp;";
				}
				chtml += "<ul class=\"cm_zc_xlnr_ul2 clear1\">";
				chtml += "<li class=\"cm_zc_tzxq_li1\">" + (i+1) + "</li>";
				chtml += "<li class=\"cm_zc_xlnr_li3\"><p class=\"cm_zc_text_xborder\"><span style='color:#cccccc'>[主]</span> " + mb.get(i).getHn() + "</p><p><span style='color:#cccccc'>[客]</span> " + mb.get(i).getGn() + "</p></li>";
				chtml += "<li class=\"cm_zc_tzxq_li5\"><p class=\"cm_zc_text_xborder\">" + ch + "</p><p>" + ch1 + "</p></li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}	
	
	
	/**
	 * 双色球
	 * @param bean
	 * @return
	 * params[0],params[1],params[2],params[3] codes 参数
	 */
	public static String getBettingDeails_01(int betType,String ... params) {
		if(params.length < 1){
			return null;
		}
		
		String chtml = "";
		chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\" >";
		chtml += "<li class=\"cm_pttz_titleul_li33\">红球</li>";
		chtml += "<li class=\"cm_w334\">篮球</li>";
		chtml += "</ul>";
		
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			System.out.println("-------->" + cs[i]);
			String r_ball = cs[i].split("\\|")[0];
			String b_ball = cs[i].split("\\|")[1];
			
			String[] hq = null;
			String[] lq = b_ball.split(",");
			
			String hqstr = "";
			java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\[D\\:([^\\)]*?)\\]\\s*\\[T\\:([^\\)]*?)\\]");
			java.util.regex.Matcher matcher = pattern.matcher(r_ball);
			if(matcher.find()){ //胆拖
				String[] dm = matcher.group(1).split(",");
				String[] tm = matcher.group(2).split(",");
				
				hqstr += "[胆]";
				for (int j = 0; j < dm.length; j++) {
					hqstr += "<i>" + dm[j] + "</i>";
					hqstr += (j != (dm.length-1))? "," : "";
				}
				hqstr += "[拖]";
				for (int j = 0; j < tm.length; j++) {
					hqstr += "<i>" + tm[j] + "</i>";
					hqstr += (j != (tm.length-1))? "," : "";
				}
			}else{//普通
				hq = r_ball.split(",");
				for (int j = 0; j < hq.length; j++) {
					hqstr += "<i>" + hq[j] + "</i>";
					hqstr += (j != (hq.length-1))? "," : "";
				}
			}
			String lqstr = "";
			for (int j = 0; j < lq.length; j++) {
				lqstr += "<i>" + lq[j] + "</i>";
				lqstr += (j != (lq.length-1))? "," : "";
			}
			chtml += "<ul class=\"cm_zc_xlnr_ul clear1\">";
			chtml += "<li class=\"cm_pttz_titleul_li33\">" + hqstr + "</li>";
			chtml += "<li class=\"cm_w334\">" + lqstr + "</li>";
			chtml += "</ul>";
		}
		return chtml;
	}	
	
	/**
	 * 	大乐透
	 * @param bean
	 * @param betType
	 * @return
	 */
	public static String getBettingDeails_50(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		if(betType == 0){ //
			chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
			chtml += "<li class=\"cm_pttz_titleul_li33\">前区号码</li>";
			chtml += "<li class=\"cm_w334\">后区号码</li>";
			chtml += "</ul>";
			String[] cs = params[0].split("\\$");
			for (int i=0;i<cs.length;i++){
				System.out.println("-------->" + cs[i]);
				String r_ball = null;
				String b_ball = null;
				r_ball = cs[i].split("\\|")[0];
				b_ball = cs[i].split("\\|")[1];
			
				String[] hq = null;
				String[] lq = b_ball.split(",");
				
				String hqstr = "";
				java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\[D\\:([^\\)]*?)\\]\\s*\\[T\\:([^\\)]*?)\\]");
				java.util.regex.Matcher matcher = pattern.matcher(r_ball);
				if(matcher.find()){ //胆拖
					String[] dm = matcher.group(1).split(",");
					String[] tm = matcher.group(2).split(",");
					
					hqstr += "[胆]";
					for (int j = 0; j < dm.length; j++) {
						hqstr += "<i>" + dm[j] + "</i>";
						hqstr += (j != (dm.length-1))? "," : "";
					}
					hqstr += "[拖]";
					for (int j = 0; j < tm.length; j++) {
						hqstr += "<i>" + tm[j] + "</i>";
						hqstr += (j != (tm.length-1))? "," : "";
					}
				}else{//普通
					hq = r_ball.split(",");
					for (int j = 0; j < hq.length; j++) {
						hqstr += "<i>" + hq[j] + "</i>";
						hqstr += (j != (hq.length-1))? "," : "";
					}
				}
				
				String lqstr = "";
				for (int j = 0; j < lq.length; j++) {
					lqstr += "<i>" + lq[j] + "</i>";
					lqstr += (j != (lq.length-1))? "," : "";
				}
				chtml += "<ul class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_pttz_titleul_li33\">" + hqstr + "</li>";
				chtml += "<li class=\"cm_w334\">" + lqstr + "</li>";
				chtml += "</ul>";
			}
		}else if(betType == 1){
			chtml = "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
			chtml += "<li class=\"cm_w832\">生肖乐号码</li>";
			chtml += "</ul>";
			String[] cs = params[0].split("\\$");
			for (int i=0;i<cs.length;i++){
				String [] hq = cs[i].split(",");
				String hqstr = "";
				System.out.println("-------->" + cs[i]);
				for (int j = 0; j < hq.length; j++) {
					hqstr += "<i>" + hq[j] + "</i>";
					hqstr += (j != (hq.length-1))? "," : "";
				}
				chtml += "<ul class=\"cm_zc_xlnr_ul cm_red clear1\">";
				chtml += "<li class=\"cm_w832\">" + hqstr + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * 3d
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_03(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">3D投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		
		return chtml;
	}
	
	/**
	 * p3
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_53(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">排列三投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * p5
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_52(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">排列五投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * 七星彩
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_51(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">七星彩投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * 七乐彩
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_07(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">七乐彩投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		return chtml;
	}
	
	/**
	 * 胜负彩
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_80(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">胜负彩投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		
		return chtml;
	}
	
	/**
	 * 任九
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_81(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">任九投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		
		return chtml;
	}
	
	/**
	 * 进球彩
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_82(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">进球彩投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		
		return chtml;
	}
	
	/**
	 * 半全场
	 * @param betType
	 * @param params
	 * @return
	 */
	public static String getBettingDeails_83(int betType, String ... params) {
		if(params.length < 1){
			return null;
		}
		String chtml = "";
		
		chtml += "<ul class=\"cm_zc_tzxq_ul cm_zc_text_szborder cm_zc_greenbg clear1\">";
		chtml += "<li class=\"cm_w832\">半全场投注号码</li>";
		chtml += "</ul>";
		
		String[] cs = params[0].split("\\$");
		for (int i=0;i<cs.length;i++){
			if(!cs[0].equals("")){
				chtml += "<ul  class=\"cm_zc_xlnr_ul clear1\">";
				chtml += "<li class=\"cm_w832\">" + cs[i] + "</li>";
				chtml += "</ul>";
			}
		}
		
		return chtml;
	}
	
	
	
	/**
	 * 调用详情方法
	 * @param lotid
	 * @param playname
	 * @param codes
	 * @return
	 */
	public static String getBettingDeailsByLotID(String lotid, String playname, String codes) {
		int gid = StringUtil.getNullInt(lotid);
		String chtml = "";
		String pname = StringUtil.getNullString(playname);
		
		if(codes.indexOf("上传") > 0){
			return codes;
		}
		
		int t = 0;
		switch (gid) {
		case 1:
			chtml = BettingDetails.getBettingDeails_01(t, codes);
			break;
		case 50:
			if(pname.trim().equalsIgnoreCase("pt12"))
				t = 1;
			chtml = BettingDetails.getBettingDeails_50(t, codes);
			break;
		case 3:
			chtml =  BettingDetails.getBettingDeails_03(t, codes);
			break;
		case 52:
			chtml =  BettingDetails.getBettingDeails_52(t, codes);
			break;
		case 53:
			chtml =  BettingDetails.getBettingDeails_53(t, codes);
			break;
		case 7:
			chtml =  BettingDetails.getBettingDeails_07(t, codes);
			break;
		case 51:
			chtml =  BettingDetails.getBettingDeails_51(t, codes);
			break;
		case 80:
			chtml =  BettingDetails.getBettingDeails_80(t, codes);
			break;
		case 81:
			chtml =  BettingDetails.getBettingDeails_80(t, codes);
			break;
		case 82:
			chtml =  BettingDetails.getBettingDeails_80(t, codes);
			break;
		case 83:
			chtml =  BettingDetails.getBettingDeails_80(t, codes);
			break;
		default:
			break;
		}
		return chtml;
	}
	
	/**
	 * 获取竞技彩比赛对阵缓存
	 * @param gid  彩种
	 * @param pid  期次
	 * @return
	 * @throws Exception
	 */
	public static Cache loadMatchCache(String gid, String pid) throws Exception {
		CacheManager cm = CacheManager.getCacheManager();
		Cache cache = cm.getCacheMatch(gid, pid);
		if (cache == null || cache.isExpired()) {
			String xmlpath = getMatchFile(gid, pid);
			JXmlWapper xml = JXmlWapper.parse(new File(xmlpath));
			int count = xml.countXmlNodes("row");
			List<MatchBean> mList = new ArrayList<MatchBean>();
			for (int i = 0; i < count; i++) {
				MatchBean mb = new MatchBean();	
				if ("80".equals(gid) || "81".equals(gid) || "82".equals(gid) || "83".equals(gid)) {
					String mid = xml.getStringValue("row[" + i + "].@mid");
					String hn = xml.getStringValue("row[" + i + "].@hn");
					String gn = xml.getStringValue("row[" + i + "].@gn");
					String bt = xml.getStringValue("row[" + i + "].@bt");
					String et = xml.getStringValue("row[" + i + "].@et");
					String b3 = xml.getStringValue("row[" + i + "].@b3");
					String b1 = xml.getStringValue("row[" + i + "].@b1");
					String b0 = xml.getStringValue("row[" + i + "].@b0");
	
					mb.setItemid(mid);
					mb.setHn(hn);
					mb.setGn(gn);
					mb.setBt(bt);
					mb.setEt(et);
					mb.setB3(b3);
					mb.setB1(b1);
					mb.setB0(b0);
				}
				mList.add(mb);
			}
			Cache ca= new Cache(gid + pid, mList, System.currentTimeMillis()+1000*60, false);				
			cm.putCacheMatch(gid, pid, ca);
			System.out.println(gid+"_"+ pid+"本地缓存更新");
			cache = ca;
		} else {
			System.out.println(gid + "_" + pid + "来源本地缓存");
		}
		return cache;
	}
	
	
	/**
	 * 获取竞技彩比赛对阵XML文件地址
	 * @param gid  彩种
	 * @param pid  期次       * 竞彩无期次
	 * @return
	 */
	public static String getMatchFile(String gid, String pid){
		String xmlFile = "";
		switch (Integer.valueOf(gid)) {
		case 80:
			xmlFile = "tdata/zcai/80/" + pid + ".xml";
			break; 
		case 81:
			xmlFile = "tdata/zcai/81/" + pid + ".xml";
			break; 
		case 82:
			xmlFile = "tdata/zcai/82/" + pid + ".xml";
			break; 
		case 83:
			xmlFile = "tdata/zcai/83/" + pid + ".xml";
			break; 
		case 85:
			xmlFile = "tdata/beid/" + pid + "/spf.xml";
			break; 
		case 86:
			xmlFile = "tdata/beid/" + pid + "/cbf.xml";
			break; 
		case 87:
			xmlFile = "tdata/beid/" + pid + "/bqc.xml";
			break; 
		case 88:
			xmlFile = "tdata/beid/" + pid + "/sxp.xml";
			break; 
		case 89:
			xmlFile = "tdata/beid/" + pid + "/jqs.xml";
			break; 
		case 90:
			xmlFile = "tdata/jczq/jczq_spf.xml";
			break; 
		case 91:
			xmlFile = "tdata/jczq/jczq_cbf.xml";
			break; 
		case 92:
			xmlFile = "tdata/jczq/jczq_bqc.xml";
			break; 
		case 93:
			xmlFile = "tdata/jczq/jczq_jqs.xml";
			break; 
		case 94:
			xmlFile = "tdata/jclq/jclq_sf.xml";
			break; 
		case 95:
			xmlFile = "tdata/jclq/jclq_rfsf.xml";
			break; 
		case 96:
			xmlFile = "tdata/jclq/jclq_sfc.xml";
			break; 
		case 97:
			xmlFile = "tdata/jclq/jclq_dxf.xml";
			break; 
		default:
			xmlFile = "";
		}
		return ConfigUtil.MatchDir + xmlFile;
	}
	
	
	public static void main(String[] args) {
//		String s = "[D:09,27][T:02,05,08,19,32]";
//		java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\\[D\\:([^\\)]*?)\\]\\s*\\[T\\:([^\\)]*?)\\]");
//		java.util.regex.Matcher matcher = pattern.matcher(s);
//		if(matcher.find()){
//			System.out.println("12345646879");
//			System.out.println(matcher.groupCount());
//			System.out.println(matcher.group());
//			System.out.println(matcher.group(1));
//			System.out.println(matcher.group(2));
////			System.out.println(matcher.group(1));
////			System.out.println(matcher.group(2));
////			sub = MathUtil.multiply(multiply, Double.parseDouble(matcher.group(1).trim())) * 2;
////			sub = MathUtil.round(sub, 2);
////			res[0] += multiply;
//		}
		
		String s = "01,06,13,16,28,29|03$01,02,08,10,11,18|15$10,18,19,20,25,29|11$06,12,19,23,32,33|15$03,07,09,24,25,27|15";
		String ss[] = s.split("\\$");
		System.out.println(ss.length);
	}
	
	
}
