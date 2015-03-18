package com.caipiao.mob.util;

public class Game {
	private String gameID;
	private String gameName;
	private int gameType;
	private int type;
	private String prefix;
	private String dyjGameType;
	private String gameDetailName;

	public String getGameID() {
		return gameID;
	}

	public String getGameName() {
		return gameName;
	}

	public int getGameType() {
		return gameType;
	}

	public int getType() {
		return type;
	}

	public String getPrefix() {
		return prefix;
	}

	public String getDyjGameType() {
		return dyjGameType;
	}

	public String getGameDetailName() {
		return gameDetailName;
	}

	public Game(String gameID, String gameName, int gameType, int type, String prefix, String dyj,String gameDetailName) {
		this.gameID = gameID;
		this.gameName = gameName;
		this.gameType = gameType;
		this.type = type;
		this.prefix = prefix;
		this.dyjGameType = dyj;
		this.gameDetailName = gameDetailName;
	}
}
