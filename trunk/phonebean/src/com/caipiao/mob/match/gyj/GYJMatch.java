package com.caipiao.mob.match.gyj;

import com.caipiao.mob.match.Match;

public class GYJMatch extends Match {

	@Override
	public String getResult() {
		return "["+getHomeScore() + "]";
	}

	@Override
	public String getStatus() {
		if(getAudit() == 1){
			if(getCancel() == 1){
				return "取消";
			}
		} else {
			if(getHomeScore() == 1){
				return "淘汰";
			} else if(getHomeScore() == 3){
				return "胜出";
			}
		}
		return "未开";
	}

	@Override
	public String getVSTeam(String gameid) {
		return getHomeName();
	}

	@Override
	public String getHalfScore() {
		return null;
	}

	@Override
	public String getScore() {
		return null;
	}

	@Override
	public String getPosition(String key) {
		return null;
	}
}
