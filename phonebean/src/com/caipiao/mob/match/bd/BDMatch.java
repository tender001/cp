package com.caipiao.mob.match.bd;

import java.util.HashMap;
import com.caipiao.mob.match.Match;
import com.caipiao.mob.util.GameUtil;

public class BDMatch extends Match {

	private static HashMap<String, String> items = new HashMap<String, String>();
	static{
		items.put("SPF=3", "1");
		items.put("SPF=1", "2");
		items.put("SPF=0", "3");
		items.put("JQS=0", "4");
		items.put("JQS=1", "5");
		items.put("JQS=2", "6");
		items.put("JQS=3", "7");
		items.put("JQS=4", "8");
		items.put("JQS=5", "9");
		items.put("JQS=6", "10");
		items.put("JQS=7", "11");
		items.put("SXP=3", "12");
		items.put("SXP=2", "13");
		items.put("SXP=1", "14");
		items.put("SXP=0", "15");
		items.put("CBF=1:0", "16");
		items.put("CBF=2:0", "17");
		items.put("CBF=2:1", "18");
		items.put("CBF=3:0", "19");
		items.put("CBF=3:1", "20");
		items.put("CBF=3:2", "21");
		items.put("CBF=4:0", "22");
		items.put("CBF=4:1", "23");
		items.put("CBF=4:2", "24");
		items.put("CBF=9:0", "25");
		items.put("CBF=0:0", "26");
		items.put("CBF=1:1", "27");
		items.put("CBF=2:2", "28");
		items.put("CBF=3:3", "29");
		items.put("CBF=9:9", "30");
		items.put("CBF=0:1", "31");
		items.put("CBF=0:2", "32");
		items.put("CBF=1:2", "33");
		items.put("CBF=0:3", "34");
		items.put("CBF=1:3", "35");
		items.put("CBF=2:3", "36");
		items.put("CBF=0:4", "37");
		items.put("CBF=1:4", "38");
		items.put("CBF=2:4", "39");
		items.put("CBF=0:9", "40");
		items.put("BQC=3-3", "41");
		items.put("BQC=3-1", "42");
		items.put("BQC=3-0", "43");
		items.put("BQC=1-3", "44");
		items.put("BQC=1-1", "45");
		items.put("BQC=1-0", "46");
		items.put("BQC=0-3", "47");
		items.put("BQC=0-1", "48");
		items.put("BQC=0-0", "49");
	}
	
	@Override
	public String getResult() {
		StringBuffer sb = new StringBuffer();
		if(getAudit() == 1){
			if(getCancel() == 1){
				for(int i = 1; i <= 49; i++){
					sb.append(i);
					if(i != 49){
						sb.append(",");
					}
				}
			} else {
				//SPF
				String rs = "";
				if(getHomeScore() + getLose() > getVisitScore()){
					rs = "SPF=3";
				} else if(getHomeScore() + getLose() < getVisitScore()){
					rs = "SPF=0";
				} else {
					rs = "SPF=1";
				}
				sb.append(items.get(rs)).append(",");
				//CBF
				rs = "CBF=" + getHomeScore() + ":" + getVisitScore();
				if (getHomeScore() > getVisitScore()) {
					if (getHomeScore() == getVisitScore() && getHomeScore() > 3) {
						rs = "CBF=9:9";
					}
					if (getHomeScore() == 4 && getVisitScore() > 2) {
						rs = "CBF=9:0";
					}
					if (getHomeScore() > 4) {
						rs = "CBF=9:0";
					}
				} else if (getHomeScore() == getVisitScore()) {
					if (getHomeScore() > 3) {
						rs = "CBF=9:9";
					}
				} else {
					if (getVisitScore() == 4 && getHomeScore() > 2) {
						rs = "CBF=0:9";
					}
					if (getVisitScore() > 4) {
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
				//SXP
				int t = getHomeScore() + getVisitScore();
				if(t >= 3){//上
					if(t % 2 == 0){//双
						rs = "SXP=2";
					} else {//单
						rs = "SXP=3";
					}
				} else {//下
					if(t % 2 == 0){//双
						rs = "SXP=0";
					} else {//单
						rs = "SXP=1";
					}
				}
				sb.append(items.get(rs)).append(",");
				//JQS
				int sum = (getHomeScore() + getVisitScore());
				if (sum > 7) {
					rs = "JQS=7";
				} else {
					rs = "JQS=" + sum;
				}
				sb.append(items.get(rs));
			}
		}
		return "[" + sb.toString() + "]";
	}

	@Override
	public String getVSTeam(String gameid) {
		if(gameid.equals(GameUtil.GameContains.BD_SPF) && getLose() != 0) {
			return getHomeName() + "(" + getLose() + ")" + " vs "  + getVisitName();
		}
		return getHomeName() + " vs "  + getVisitName();
	}

	@Override
	public String getHalfScore() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "延期";
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
				return "延期";
			} else {
				return getHomeScore() + ":" + getVisitScore();
			}
		}
		return "";
	}

	@Override
	public String getStatus() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "延期";
			}
		} else {
			if(getState() < 4){
				return "未开赛";
			} else if(getState() == 4 || getState() == 5){
				return "比赛中";
			}
		}
		return "已完成";
	}

	@Override
	public String getPosition(String key) {
		return items.get(key);
	}
}
