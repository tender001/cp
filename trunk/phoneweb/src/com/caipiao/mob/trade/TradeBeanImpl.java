package com.caipiao.mob.trade;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.caipiao.mob.Status;
import com.caipiao.mob.util.GameUtil;
import com.rbc.frame.RbcFrameContext;

public class TradeBeanImpl {

	public int iosJoinQuery(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(Status.SUCCESS.CODE.endsWith(bean.getStatus())){
			request.setAttribute("projid", bean.getPlanNo());
			request.setAttribute("buynum", bean.getPart());
			request.setAttribute("sessionid", bean.getSessionid());
		}
		return 1;
	}
	
	public int iosOrderQuery(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if(Status.SUCCESS.CODE.endsWith(bean.getStatus())){
			request.setAttribute("type", GameUtil.getGameName(bean.getType()));
			request.setAttribute("term", bean.getTerm());
			request.setAttribute("muls", bean.getMultiple());
			request.setAttribute("pids", bean.getNum());
			request.setAttribute("codes", bean.getCodes());
			request.setAttribute("zhushu", Math.round(bean.getMoney() / bean.getMultiple() / bean.getOneMoney()));
			if(bean.getChaseMoney() == 0){
				request.setAttribute("total", bean.getMoney());
			} else {
				request.setAttribute("total", bean.getChaseMoney());
			}
			request.setAttribute("sessionid", bean.getSessionid());
			
			request.setAttribute("name", bean.getName());
			request.setAttribute("desc", bean.getDesc());
			request.setAttribute("ishm", bean.getProjectType());
			request.setAttribute("tnum", bean.getTnum());
			request.setAttribute("bnum", bean.getBnum());
			request.setAttribute("pnum", bean.getPnum());
			String open = "公开";
			if(bean.getOflag()==1){
				open = "截止后公开";
			}else if(bean.getOflag()==2){
				open = "对参与人员公开";
			}else if(bean.getOflag()==3){
				open = "截止后对参与人公开";
			}
			request.setAttribute("open", open);
			
			request.setAttribute("wrate", bean.getWrate());
		}
		return 1;
	}
	
	public int iosResult(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		request.setAttribute("result", bean.getMessage());
		System.out.println(bean.getMessage());
		return 1;
	}
	
	public int checkVersion(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String url = "";
		request.setAttribute("url", url);
		System.out.println("升级地址："+url);
		return 1;
	}


	public int checkVersionNew(TradeBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String url = "http://www.159cai.com/download/159cai_shouji.apk";
		if( bean.getFrom()!= null && !bean.getFrom().trim().equals("")){
			url = "http://www.159cai.com/download/androidapp/"+bean.getFrom().trim()+"/159cai.apk";
		}
		request.setAttribute("url", url);
		System.out.println("升级地址："+url);
		return 1;
	}
}
