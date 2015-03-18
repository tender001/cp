package com.caipiao.mob.match.jclq;

import java.util.HashMap;
import com.caipiao.mob.match.Match;

public class JCLQMatch extends Match {

	private static HashMap<String, String> items = new HashMap<String, String>();
	static{
		items.put("SF=3", "1");
		items.put("SF=0", "2");
		items.put("RFSF=3", "3");
		items.put("RFSF=0", "4");
		items.put("SFC=11", "5");
		items.put("SFC=12", "6");
		items.put("SFC=13", "7");
		items.put("SFC=14", "8");
		items.put("SFC=15", "9");
		items.put("SFC=16", "10");
		items.put("SFC=01", "11");
		items.put("SFC=02", "12");
		items.put("SFC=03", "13");
		items.put("SFC=04", "14");
		items.put("SFC=05", "15");
		items.put("SFC=06", "16");
		items.put("DXF=3", "17");
		items.put("DXF=0", "18");
	}
	
	@Override
	public String getResult() {
		StringBuffer sb = new StringBuffer();
		if(getAudit() == 1){
			if(getCancel() == 1){
				for(int i = 1; i <= 18; i++){
					sb.append(i);
					if(i != 18){
						sb.append(",");
					}
				}
			} else {
				//SF
				String rs = "";
				if(getHomeScore() > getVisitScore()){
					rs = "SF=3";
				} else if(getHomeScore() < getVisitScore()){
					rs = "SF=0";
				}
				sb.append(items.get(rs)).append(",");
				//RFSF
				if(getHomeScore() + getLose() > getVisitScore()){
					rs = "RFSF=3";
				} else if(getHomeScore() + getLose() < getVisitScore()){
					rs = "RFSF=0";
				}
				sb.append(items.get(rs)).append(",");
				//SFC
				int val = getHomeScore() - getVisitScore();
				if (val > 0) {
					if(val > 0 & val <=5){
						rs = "SFC=01";
					} else if (val > 5 & val <=10){
						rs = "SFC=02";
					} else if (val > 10 & val <=15){
						rs = "SFC=03";
					} else if (val > 15 & val <=20){
						rs = "SFC=04";
					} else if (val > 20 & val <=25){
						rs = "SFC=05";
					} else {
						rs = "SFC=06";
					}
				} else {
					val = Math.abs(val);
					if(val > 0 & val <=5){
						rs = "SFC=11";
					} else if (val > 5 & val <=10){
						rs = "SFC=12";
					} else if (val > 10 & val <=15){
						rs = "SFC=13";
					} else if (val > 15 & val <=20){
						rs = "SFC=14";
					} else if (val > 20 & val <=25){
						rs = "SFC=15";
					} else {
						rs = "SFC=16";
					}
				}
				sb.append(items.get(rs)).append(",");
				//DXF
				if(getHomeScore() + getVisitScore() > getZlose()){
					rs = "DXF=3";
				} else {
					rs = "DXF=0";
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
		return getHomeName() + " vs "  + getVisitName();
	}

	@Override
	public String getHalfScore() {
		return null;
	}

	@Override
	public String getScore() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "取消";
			} else {
				return getVisitScore() + ":" + getHomeScore();
			}
		}
		return "";
	}

	@Override
	public String getPosition(String key) {
		return items.get(key);
	}
	
}
