package com.caipiao.plugin.sturct;

public class GameAwardCode {
	private String awardCode;
	
	private long first ;
	private long second;
	private long third ;
	private long fourth;
 	
	public long getFourth() {
		return fourth;
	}

	public void setFourth(long fourth) {
		this.fourth = fourth;
	}

	private long BackupNo;
	
	private int[] singleCode;

	public String getAwardCode() {
		return awardCode;
	}

	public void setAwardCode(String awardCode) {
		this.awardCode = awardCode;
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

	public int[] getSingleCode() {
		return singleCode;
	}

	public void setSingleCode(int[] singleCode) {
		this.singleCode = singleCode;
	}

	public long getThird() {
		return third;
	}

	public void setThird(long third) {
		this.third = third;
	}

	public long getBackupNo() {
		return BackupNo;
	}

	public void setBackupNo(long backupNo) {
		BackupNo = backupNo;
	}
}
