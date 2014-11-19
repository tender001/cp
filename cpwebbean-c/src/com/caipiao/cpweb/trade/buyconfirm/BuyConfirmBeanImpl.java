package com.caipiao.cpweb.trade.buyconfirm;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.caipiao.cpweb.trade.ConfigUtil;
import com.caipiao.plugin.helper.CodeFormatException;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.rbc.frame.RbcFrameContext;

public class BuyConfirmBeanImpl {
	public static Logger logger = LoggerFactory.getLogger("web");

	private static Map<String, String> playname = new HashMap<String,String>();
	static {
		playname.put("80", "胜负彩");
		playname.put("81", "任选九");
		playname.put("82", "进球彩");
		playname.put("83", "半全场");
		
		playname.put("01", "双色球");
		playname.put("03", "福彩3D");
		playname.put("50", "大乐透");
		playname.put("07", "七乐彩");
		playname.put("51", "七星彩");
		playname.put("52", "排列五");
		playname.put("53", "排列三");
		
	}	
	

	
	private static Map<String, String> playmoneylimit = new HashMap<String,String>();
	static {
		playmoneylimit.put("80", "2,2000000,,");
		playmoneylimit.put("81", "");
		playmoneylimit.put("82", "");
		playmoneylimit.put("83", "");
	}
	
	/**
	 * 复式发起确认页面，所有彩种通用
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int project_fqck(BuyConfirmBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		codeTransform(bean);
		request.setAttribute("errcode", "0");
		request.setAttribute("multiple", bean.getMultiple());
		request.setAttribute("codes", bean.getCodes());
		request.setAttribute("dtcodes", bean.getDtcodes());
		request.setAttribute("pid", bean.getPid());
		request.setAttribute("gid", bean.getGid());
		request.setAttribute("playid", bean.getPlayid());
		request.setAttribute("playname", playname.get(bean.getGid()));
		request.setAttribute("playename", ConfigUtil.playename.get(bean.getGid()));
		request.setAttribute("playmoneylimit", playmoneylimit.get(bean.getGid()));
		request.setAttribute("totalmoney", bean.getTotalmoney());
		request.setAttribute("zhushu", bean.getZhushu());	
		request.setAttribute("isdt", bean.getIsdt());
		request.setAttribute("wtype", bean.getWtype());
		request.setAttribute("wtype2", bean.getWtype2());
		request.setAttribute("price", bean.getPrice());
		String chtml = getCodeDetail(bean, bean.getWtype());
		request.setAttribute("chtml", chtml);
		return 0;
	}
	
	
	
	/**
	 * 追号跳转界面
	 * @param bean
	 * @param context
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public int project_fqzh(BuyConfirmBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		request.setAttribute("errcode", "0");
		request.setAttribute("multiple", bean.getMultiple());
		request.setAttribute("codes", bean.getCodes());
		request.setAttribute("pid", bean.getPid());
		request.setAttribute("gid", bean.getGid());
		request.setAttribute("playid", bean.getPlayid());
		request.setAttribute("playname", playname.get(bean.getGid()));
		request.setAttribute("playename", ConfigUtil.playename.get(bean.getGid()));
		request.setAttribute("playmoneylimit", playmoneylimit.get(bean.getGid()));
		request.setAttribute("totalmoney", bean.getTotalmoney());
		request.setAttribute("zhushu", bean.getZhushu());	
		request.setAttribute("isdt", bean.getIsdt());
		request.setAttribute("wtype", bean.getWtype());
		request.setAttribute("wtype2", bean.getWtype2());
		request.setAttribute("price", bean.getPrice());
		String chtml = getCodeDetail(bean, bean.getWtype());
		request.setAttribute("chtml", chtml);
		return 0;
	}
	
	public void codeTransform(BuyConfirmBean bean) throws CodeFormatException{
		if ("81".equals(bean.getGid())) {
			if(bean.getCodes().indexOf("$") != -1){
				String[] cs = StringUtil.splitter(bean.getCodes(), "$");
				String[] dans = StringUtil.splitter(cs[0].trim(), ",");
				String[] tuos = StringUtil.splitter(cs[1].trim(), ",");			
				int len = dans.length;
				if (len != 14) {
					setErrorMessage("号码不符合要求 必须是14个位置");
				}
				if (tuos.length != 14) {
					throw new CodeFormatException(1, "任选九号码格式不符合要求", bean.getCodes());
				}
				int hnum = 0;
				int snum = 0;
				for (int i = 0; i < len; i++) {
					String tmp = dans[i].trim();
					if (!tmp.equalsIgnoreCase("#")) {
						snum++;
					}
				}
				for (int i = 0; i < tuos.length; i++) {
					String tmp = tuos[i].trim();
					if (!tmp.equalsIgnoreCase("#")) {
						hnum++;
					}
				}

				if (snum>0 || hnum>9) {
					bean.setIsdt(1);
					bean.setWtype("dt");
				}else {
					bean.setCodes(cs[1].trim());
				}
			}
		}
		
	}
	
	public String setErrorMessage(String message) {
		String chtml = "<script type=\"text/javascript\">";
			chtml +="alert(\"" + message + "\");";
			chtml +="window.close();";
			chtml +="</script>";
		return chtml;
	}	
	
	
	public String getCodeDetail(BuyConfirmBean bean, String wtype) {
		String chtml = "";
		int igid = StringUtil.getNullInt(bean.getGid());
		int t = 0;
		switch (igid) {
		case 80:
			chtml = BettingDetails.getBettingDeails_80(bean,t);
			break;
		case 81:
			chtml = BettingDetails.getBettingDeails_81(bean,t);
			break;
		case 82:
			chtml = BettingDetails.getBettingDeails_82(bean,t);
			break;
		case 83:
			chtml = BettingDetails.getBettingDeails_80(bean,t);
			break;
		case 1:
			chtml = BettingDetails.getBettingDeails_01(t, bean.getCodes());
			break;
		case 50:
			if(wtype.trim().equalsIgnoreCase("pt12"))
				t = 1;
			else if(wtype.trim().equalsIgnoreCase("ds")){
				
			}
			chtml = BettingDetails.getBettingDeails_50(t, bean.getCodes());
			break;
		case 3:
			chtml =  BettingDetails.getBettingDeails_03(t, bean.getCodes());
			break;
		case 52:
			chtml =  BettingDetails.getBettingDeails_52(t, bean.getCodes());
			break;
		case 53:
			chtml =  BettingDetails.getBettingDeails_53(t, bean.getCodes());
			break;
		case 7:
			chtml =  BettingDetails.getBettingDeails_07(t, bean.getCodes());
			break;
		case 51:
			chtml =  BettingDetails.getBettingDeails_51(t, bean.getCodes());
			break;
			
		default:
			break;
		}
		return chtml;
	}
}
