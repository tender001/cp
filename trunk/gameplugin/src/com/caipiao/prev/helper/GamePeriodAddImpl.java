package com.caipiao.prev.helper;



import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;

public abstract class GamePeriodAddImpl {
 
    protected String gameID; // 游戏编号

    protected int prevAddNum; // 预排天数

    protected String beginTime; // 开始时间 (hh:mm:ss)

    protected String awardTime; // 开奖时间 (hh:mm:ss)

    protected int aheadTime;// 提前截止时间(分钟)
    
    protected int prevOpenNum = 10; //预开启期数

    protected Logger logger = LoggerFactory.getLogger("prev");
    
    public String getGameID() {
		return gameID;
	}

	public void setGameID(String gameID) {
		this.gameID = gameID;
	}

	public int getPrevAddNum() {
        return prevAddNum;
    }

    public void setPrevAddNum(int prevAddNum) {
        this.prevAddNum = prevAddNum;
    }

    public int getAheadTime() {
        return aheadTime;
    }

    public void setAheadTime(int aheadTime) {
        this.aheadTime = aheadTime;
    }

    public String getAwardTime() {
        return awardTime;
    }

    public void setAwardTime(String awardTime) {
        this.awardTime = awardTime;
    }

    public String getBeginTime() {
        return beginTime;
    }

    public void setBeginTime(String beginTime) {
        this.beginTime = beginTime;
    }
    
    protected boolean savePrevAddPeriod(String periodID,String begintTime,String endTime,String awardTime,String endTimeEx,JdbcConnect jcn) {
        boolean blnAddFlag = true ;
        String sql = "";
        
        // 判断期次是否存在
        sql = "select * from TB_PERIOD where CGAMEID = '" + gameID + "' and CPERIODID = '" + periodID + "'";
        JdbcRecordSet jrsTT = jcn.executeQuery(sql);
        if ( jrsTT != null && jrsTT.size() >= 1) {//已经有 不添加
			jrsTT.clear();
			jrsTT = null ;
            blnAddFlag = true ;
            return true ;
        }

        sql = "insert into TB_PERIOD (CGAMEID,CPERIODID,CBEGINTIME,CENDTIME,CAWARDTIME,CCANCELTIME) values ('" + gameID + "','" + periodID;
        sql += "', TO_DATE('" + begintTime + "','yyyy-MM-dd HH24:mi:ss'),TO_DATE('" + endTime;
        sql += "','yyyy-MM-dd HH24:mi:ss'),TO_DATE('" + awardTime + "','yyyy-MM-dd HH24:mi:ss')," ;
        sql += "TO_DATE('" + endTimeEx + "','yyyy-MM-dd HH24:mi:ss'))";
        if (jcn.executeUpdate(sql) != 1) {
            blnAddFlag = false;
        	logger.error("添加期次失败 " + sql);
        } else {
            logger.info("添加期次 游戏=" + gameID + " 期号=" + periodID) ;
        }
        return blnAddFlag;
    }
    
    public abstract boolean periodPrevAdd(JdbcConnect jcn);

}