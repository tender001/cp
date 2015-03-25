package com.caipiao.split;

public abstract class GameSplit {
	public static final int MAX = 20000;
	public abstract String getSplitCode(String code) throws Exception ; 
	public static GameSplit getGameSplit(String gameID){
		if(GameUtil.isBJ(gameID)){
			return new BjPluginSplit();
		}else if(GameUtil.isJC(gameID)){
			return new JcPluginSplit();
		}else if(GameUtil.isLq(gameID)){
			return new LqPluginSplit();
		}else if(GameUtil.isP3(gameID)){
			return new GameSplit_53();
		}else if(GameUtil.is3D(gameID)){
			return new GameSplit_03();
		}else if(GameUtil.isJxssc(gameID)){
			return new GameSplit_20();
		}else if(GameUtil.isCqssc(gameID)){
			return new GameSplit_04();
		}else if(GameUtil.isSSQ(gameID)){
			return new GameSplit_01();
		}else if(GameUtil.isDLT(gameID)){
			return new GameSplit_50();
		}else if(GameUtil.isZCSFC(gameID)){
			return new GameSplit_80();
		}else if(GameUtil.isRX9(gameID)){
			return new GameSplit_81();
		}else if(GameUtil.isJx11x5(gameID)){
			return new GameSplit_54();
		}else if(GameUtil.isSd11ydj(gameID)){
			return new GameSplit_56();
		}
		return null;
	}
	
    protected String getSourceEx(Long l, int type, String split){
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
}
