package com.caipiao.mob.match;

public abstract class Match {
	private String matchID = "";
	private String matchTime = "";
	private String matchName = "";
	private int state = -1;
	private String homeName = "";
	private String visitName = "";
	private int halfHomeScore = -1;
	private int halfVisitScore = -1;
	private int homeScore = -1;
	private int visitScore = -1;
	private double lose = -1;
	private double zlose = -1;
	private int audit = -1;
	private int cancel = -1;
	public String getMatchID() {
		return matchID;
	}
	public void setMatchID(String matchID) {
		this.matchID = matchID;
	}
	public String getMatchTime() {
		return matchTime;
	}
	public void setMatchTime(String matchTime) {
		this.matchTime = matchTime;
	}
	public String getMatchName() {
		return matchName;
	}
	public void setMatchName(String matchName) {
		this.matchName = matchName;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getHomeName() {
		return homeName;
	}
	public void setHomeName(String homeName) {
		this.homeName = homeName;
	}
	public String getVisitName() {
		return visitName;
	}
	public void setVisitName(String visitName) {
		this.visitName = visitName;
	}
	public int getHalfHomeScore() {
		return halfHomeScore;
	}
	public void setHalfHomeScore(int halfHomeScore) {
		this.halfHomeScore = halfHomeScore;
	}
	public int getHalfVisitScore() {
		return halfVisitScore;
	}
	public void setHalfVisitScore(int halfVisitScore) {
		this.halfVisitScore = halfVisitScore;
	}
	public int getHomeScore() {
		return homeScore;
	}
	public void setHomeScore(int homeScore) {
		this.homeScore = homeScore;
	}
	public int getVisitScore() {
		return visitScore;
	}
	public void setVisitScore(int visitScore) {
		this.visitScore = visitScore;
	}
	public double getLose() {
		return lose;
	}
	public void setLose(double lose) {
		this.lose = lose;
	}
	public double getZlose() {
		return zlose;
	}
	public void setZlose(double zlose) {
		this.zlose = zlose;
	}
	public int getAudit() {
		return audit;
	}
	public void setAudit(int audit) {
		this.audit = audit;
	}
	public int getCancel() {
		return cancel;
	}
	public void setCancel(int cancel) {
		this.cancel = cancel;
	}
	
    public String getSourceEx(Long l, int type, String split){
    	StringBuffer sb = new StringBuffer();
    	for(int i = 0; i < 64; i++){
    		long t = 1L<<i;
    		if ( (l & t) == t) {
    			if ( type == 0 ) {
    				if ( i < 10 ) {
    					sb.append("0").append(i);
    				} else {
    					sb.append(i);
    				}
    			} else  {
    				sb.append(i);
    			} 
    			if ( split != null && split.length() > 0) {
    				sb.append(split);
    			}
    		}
    	}
    	String s= sb.toString();
    	if ( split != null && split.length() > 0) {
	    	if ( s.length() > split.length()) {
	    		s = s.substring(0,s.length()-split.length());
	    	}
    	}
    	return s;
    }
	
	public abstract String getStatus();
	public abstract String getVSTeam(String gameid);
	public abstract String getHalfScore();
	public abstract String getScore();
	public abstract String getResult();
	public abstract String getPosition(String key);
}
