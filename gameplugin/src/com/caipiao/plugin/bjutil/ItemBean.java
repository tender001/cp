package com.caipiao.plugin.bjutil;

/**
 * 每场投注信息
 * @author djx
 *
 */
public class ItemBean {
	private String matchID;//场次
	private int times;
	private long code;//投注号码 0-2 胜平负  3-10 进球数 11-14 上下单双 15-39 猜比分 40-48半全场
	private int count ;
	
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public int getTimes() {
		return times;
	}
	public void setTimes(int times) {
		this.times = times;
	}
	public long getCode() {
		return code;
	}
	public void setCode(long code) {
		this.code = code;
	}
	
	public String toBillString(){
		StringBuffer sb = new StringBuffer();
		sb.append(matchID).append("=");
		for(int i = 0; i < 49; i++){
			if(((code & (1L << i))>> i) == 1){				
				sb.append(getBillCode(i));
				sb.append("/");
			}
		}
		String tmp = sb.toString();
		if(tmp.endsWith("/")){
			tmp = tmp.substring(0, tmp.lastIndexOf("/"));
		}
		return tmp;
	}

	public String getMatchID() {
		return matchID;
	}
	public void setMatchID(String matchID) {
		this.matchID = matchID;
	}

	private String getBillCode(int code){
		String rcode = "";
		switch (code) {
		case 0:	rcode = "0";	break;
		case 1:	rcode = "1";	break;
		case 2:	rcode = "3";	break;
		case 3:	rcode = "0";	break;
		case 4:	rcode = "1";	break;
		case 5:	rcode = "2";	break;
		case 6:	rcode = "3";	break;
		case 7:	rcode = "4";	break;
		case 8:	rcode = "5";	break;
		case 9:	rcode = "6";	break;
		case 10:	rcode = "7";	break;
		case 11:	rcode = "上单";	break;
		case 12:	rcode = "上双";	break;
		case 13:	rcode = "下单";	break;
		case 14:	rcode = "下双";	break;
		case 15:	rcode = "胜其它";	break;
		case 16:	rcode = "1:0";	break;
		case 17:	rcode = "2:0";	break;
		case 18:	rcode = "2:1";	break;
		case 19:	rcode = "3:0";	break;
		case 20:	rcode = "3:1";	break;
		case 21:	rcode = "3:2";	break;
		case 22:	rcode = "4:0";	break;
		case 23:	rcode = "4:1";	break;
		case 24:	rcode = "4:2";	break;
		case 25:	rcode = "平其它";	break;
		case 26:	rcode = "0:0";	break;
		case 27:	rcode = "1:1";	break;
		case 28:	rcode = "2:2";	break;
		case 29:	rcode = "3:3";	break;
		case 30:	rcode = "负其它";	break;
		case 31:	rcode = "0:1";	break;
		case 32:	rcode = "0:2";	break;
		case 33:	rcode = "1:2";	break;
		case 34:	rcode = "0:3";	break;
		case 35:	rcode = "1:3";	break;
		case 36:	rcode = "2:3";	break;
		case 37:	rcode = "0:4";	break;
		case 38:	rcode = "1:4";	break;
		case 39:	rcode = "2:4";	break;
		case 40:	rcode = "3-3";	break;
		case 41:	rcode = "3-1";	break;
		case 42:	rcode = "3-0";	break;
		case 43:	rcode = "1-3";	break;
		case 44:	rcode = "1-1";	break;
		case 45:	rcode = "1-0";	break;
		case 46:	rcode = "0-3";	break;
		case 47:	rcode = "0-1";	break;
		case 48:	rcode = "0-0";	break;
		}
		return rcode;
	}
	
	public int getCountItem(){
		return count;
	}
}
