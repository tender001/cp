package com.caipiao.cpweb.trade;

import org.json.JSONObject;

public class RankingBean {
	private long time;
	private JSONObject json;
	public boolean needUpdate(){
		return (System.currentTimeMillis() - time) / 1000 > 5 * 60;
	}
	public long getTime() {
		return time;
	}
	public void setTime(long time) {
		this.time = time;
	}
	public JSONObject getJson() {
		return json;
	}
	public void setJson(JSONObject json) {
		this.json = json;
	}
}
