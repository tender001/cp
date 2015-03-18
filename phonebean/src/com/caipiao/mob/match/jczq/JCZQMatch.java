package com.caipiao.mob.match.jczq;

import java.util.HashMap;

import com.caipiao.mob.match.Match;
import com.caipiao.mob.util.GameUtil;

public class JCZQMatch extends Match {

	private static HashMap<String, String> items = new HashMap<String, String>();
	static{
		items.put("SPF=3","0");
		items.put("SPF=1","1");
		items.put("SPF=0","2");
		items.put("JQS=0","3");
		items.put("JQS=1","4");
		items.put("JQS=2","5");
		items.put("JQS=3","6");
		items.put("JQS=4","7");
		items.put("JQS=5","8");
		items.put("JQS=6","9");
		items.put("JQS=7","10");
		items.put("CBF=1:0","11");
		items.put("CBF=2:0","12");
		items.put("CBF=3:0","13");
		items.put("CBF=4:0","14");
		items.put("CBF=5:0","15");
		items.put("CBF=2:1","16");
		items.put("CBF=3:1","17");
		items.put("CBF=4:1","18");
		items.put("CBF=5:1","19");
		items.put("CBF=3:2","20");
		items.put("CBF=4:2","21");
		items.put("CBF=5:2","22");
		items.put("CBF=9:0","23");
		items.put("CBF=0:0","24");
		items.put("CBF=1:1","25");
		items.put("CBF=2:2","26");
		items.put("CBF=3:3","27");
		items.put("CBF=9:9","28");
		items.put("CBF=0:1","29");
		items.put("CBF=0:2","30");
		items.put("CBF=0:3","31");
		items.put("CBF=0:4","32");
		items.put("CBF=0:5","33");
		items.put("CBF=1:2","34");
		items.put("CBF=1:3","35");
		items.put("CBF=1:4","36");
		items.put("CBF=1:5","37");
		items.put("CBF=2:3","38");
		items.put("CBF=2:4","39");
		items.put("CBF=2:5","40");
		items.put("CBF=0:9","41");
		items.put("BQC=3-3","42");
		items.put("BQC=3-1","43");
		items.put("BQC=3-0","44");
		items.put("BQC=1-3","45");
		items.put("BQC=1-1","46");
		items.put("BQC=1-0","47");
		items.put("BQC=0-3","48");
		items.put("BQC=0-1","49");
		items.put("BQC=0-0","50");
		items.put("RSPF=3","51");
		items.put("RSPF=1","52");
		items.put("RSPF=0","53");
	}

	@Override
	public String getResult() {
		StringBuffer sb = new StringBuffer();
		if(getAudit() == 1){
			if(getCancel() == 1){
				for(int i = 1; i <= 53; i++){
					sb.append(i);
					if(i != 53){
						sb.append(",");
					}
				}
			} else {
				//SPF
				String rs = "";
				if(getHomeScore() > getVisitScore()){
					rs = "SPF=3";
				} else if(getHomeScore() < getVisitScore()){
					rs = "SPF=0";
				} else {
					rs = "SPF=1";
				}
				sb.append(items.get(rs)).append(",");
				//JQS
				int sum = getHomeScore() + getVisitScore();
				if (sum > 7) {
					rs = "JQS=7";
				} else {
					rs = "JQS=" + sum;
				}
				sb.append(items.get(rs)).append(",");
				//CBF
				rs = "CBF=" + getHomeScore() + ":" + getVisitScore();
				if (getHomeScore() > getVisitScore()) {
					if (getHomeScore() == getVisitScore() && getHomeScore() > 3) {
						rs = "CBF=9:9";
					}
					if (getHomeScore() == 4 && getVisitScore() == 3) {
						rs = "CBF=9:0";
					}
					if (getHomeScore() == 5 && getVisitScore() > 2) {
						rs = "CBF=9:0";
					}
					if (getHomeScore() > 5) {
						rs = "CBF=9:0";
					}
				} else if (getHomeScore() == getVisitScore()) {
					if (getHomeScore() > 3) {
						rs = "CBF=9:9";
					}
				} else {
					if (getVisitScore() == 4 && getHomeScore() == 3) {
						rs = "CBF=0:9";
					}
					if (getVisitScore() == 5 && getHomeScore() > 2) {
						rs = "CBF=0:9";
					}
					if (getVisitScore() > 5) {
						rs = "CBF=0:9";
					}
				}
				sb.append(items.get(rs)).append(",");
				//BQC
				if (getHalfHomeScore() > getHalfVisitScore()) {//胜
					if (getHomeScore() > getVisitScore()) {
						rs = "BQC=3-3";
					} else if (getHomeScore() == getVisitScore()) {
						rs = "BQC=3-1";
					} else {
						rs = "BQC=3-0";
					}
				} else if (getHalfHomeScore() == getHalfVisitScore()) {//平
					if (getHomeScore() > getVisitScore()) {
						rs = "BQC=1-3";
					} else if (getHomeScore() == getVisitScore()) {
						rs = "BQC=1-1";
					} else {
						rs = "BQC=1-0";
					}
				} else {
					if (getHomeScore() > getVisitScore()) {
						rs = "BQC=0-3";
					} else if (getHomeScore() == getVisitScore()) {
						rs = "BQC=0-1";
					} else {
						rs = "BQC=0-0";
					}
				}
				sb.append(items.get(rs)).append(",");
				//RSPF
				if(getHomeScore() + getLose() > getVisitScore()){
					rs = "RSPF=3";
				} else if(getHomeScore() + getLose() < getVisitScore()){
					rs = "RSPF=0";
				} else {
					rs = "RSPF=1";
				}
				sb.append(items.get(rs));
			}
		}
		return "[" + sb.toString() + "]";
	}

	@Override
	public String getStatus() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "取消";
			}
		} else {
			if(getState() < 4){
				return "未开赛";
			} else if(getState() >= 4 && getState() <= 6){
				return "比赛中";
			}
		}
		return "已完成";
	}

	@Override
	public String getVSTeam(String gameid) {
		if(gameid.equals(GameUtil.GameContains.JCZQ_RQSPF) && getLose() != 0) {
			return getHomeName() + "(" + getLose() + ")" + " vs "  + getVisitName();
		}
		return getHomeName() + " vs "  + getVisitName();
	}

	@Override
	public String getHalfScore() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "取消";
			} else {
				return getHalfHomeScore() + ":" + getHalfVisitScore();
			}
		}
		return "";
	}

	@Override
	public String getScore() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "取消";
			} else {
				return getHomeScore() + ":" + getVisitScore();
			}
		}
		return "";
	}

	@Override
	public String getPosition(String key) {
		return items.get(key);
	}

}
