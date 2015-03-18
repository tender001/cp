package com.caipiao.plugin.sturct;

import java.util.ArrayList;
import java.util.List;


public class GameCastCode {
	private long first ;
	private long second ;
	private long third ;
	private long four ;
	 
	private byte castMethod ;//投注方式
	private byte playMethod ;//游戏玩法
	private int castMoney ;//投注金额
	private int combineNum = 1;
	private String matchID ;
	
	private String sourceCode ;
	private String guoguans;
	
	public int getCombineNum() {
		return combineNum;
	}
	public void setCombineNum(int combineNum) {
		this.combineNum = combineNum;
	}
	public String getGuoguans() {
		return guoguans;
	}
	public void setGuoguans(String guoguans) {
		this.guoguans = guoguans;
	}
	public String getSourceCode() {
		return sourceCode;
	}
	public void setSourceCode(String sourceCode) {
		this.sourceCode = sourceCode;
	}

	private List<Object> cast = new ArrayList<Object>();
	private List<Object> items = new ArrayList<Object>();

	public String getMatchID() {
		return matchID;
	}
	public void setMatchID(String matchID) {
		this.matchID = matchID;
	}
	public void putCast(Object c){
		cast.add(c);
	}
	public List<Object> getCast(){
		return cast;
	}
	public List<Object> getItems() {
		return items;
	}
	
	@SuppressWarnings("unchecked")
	public void putItems(Object items){
		this.items = (List<Object>) items;
	}
	public byte getCastMethod() {
		return castMethod;
	}
	public int getCastMoney() {
		return castMoney;
	}
	public void setCastMoney(int castMoney) {
		this.castMoney = castMoney;
	}
	public void setCastMethod(byte castMethod) {
		this.castMethod = castMethod;
	}
	public byte getPlayMethod() {
		return playMethod;
	}
	public void setPlayMethod(byte playMethod) {
		this.playMethod = playMethod;
	}
	public long getFirst() {
		return first;
	}
	public void setFirst(long first) {
		this.first = first;
	}
	public long getSecond() {
		return second;
	}
	public void setSecond(long second) {
		this.second = second;
	}
	public long getThird() {
		return third;
	}
	public void setThird(long third) {
		this.third = third;
	}
	public long getFour() {
		return four;
	}
	public void setFour(long four) {
		this.four = four;
	}
}