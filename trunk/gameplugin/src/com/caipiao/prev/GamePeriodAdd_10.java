package com.caipiao.prev;

/**
 * 快乐双彩
 */

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import com.caipiao.prev.helper.GamePeriodAddImpl;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;

public class GamePeriodAdd_10 extends GamePeriodAddImpl {

	@Override
	public boolean periodPrevAdd(JdbcConnect jcn) {
        boolean blnAddFlag = true;
        SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            String sql = "select * from TB_GAME_CONFIG where cgameid = '" + gameID + "'";
            JdbcRecordSet jrs = jcn.executeQuery(sql);
            if (jrs != null && jrs.size() > 0) {
                jrs.first();
                Date dStartDate = jrs.getDate("CPREVADDTIME");// 已经预排的日期
                sql = "select IDELAYNUM,CBEGINDATE,CENDDATE from TB_GAME_DELAY where cgameid = '" + gameID + "'";
                JdbcRecordSet jrsDelay = jcn.executeQuery(sql);

                Date dCurDate = new Date();// 当前时间

                if ((dStartDate.getTime() - dCurDate.getTime()) / 1000 > 60 / 60 / 24 * 2) {// 不需要预排
                    jrs.clear();
                    jrs = null;
                    return true;
                }

                if (dStartDate.before(dCurDate)) {
                    dStartDate = dCurDate;
                }

                Calendar nowcal = Calendar.getInstance(Locale.CHINA);
                nowcal.setTime(dStartDate);

                for (int i = 0; i < this.prevAddNum + this.prevOpenNum; i++) {
                    
                    String prefixID = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy");

                    int delayNum = 0;// 从数据库中取延期数量
                    boolean blnInDelay = false;

                    if (jrsDelay != null && jrsDelay.size() > 0) {
                        for (int d = 0; d < jrsDelay.size(); d++) {
                            jrsDelay.move(d);
                            Date bd = jrsDelay.getDate("CBEGINDATE");
                            Date ed = jrsDelay.getDate("CENDDATE");
                            ed.setTime(ed.getTime() + 1000 * 60 * 60 * 24);
                            if (nowcal.getTimeInMillis() >= bd.getTime() && nowcal.getTimeInMillis() <= ed.getTime()) {// 在延期时间断内容
                                blnInDelay = true;
                                break;
                            } else {
                                String stemp = jrsDelay.get("CENDDATE");
                                if (nowcal.getTimeInMillis() > ed.getTime()) {
                                    if (stemp.startsWith(prefixID)) {// 年份相同
                                        delayNum += jrsDelay.getInt("IDELAYNUM");
                                    }
                                }
                            }
                        }
                    }

                    if (!blnInDelay) {
                        int day = nowcal.get(Calendar.DAY_OF_YEAR) - delayNum;// 需要处理
                        String periodID = prefixID + StringUtil.LeftPad(day + "", "0", 3);

                        String pp = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
                        Timestamp tAward = Timestamp.valueOf(pp + " " + awardTime);
                        Timestamp tEnd = Timestamp.valueOf(pp + " " + awardTime);
                        tEnd.setTime(tEnd.getTime() - this.aheadTime * 1000 * 60);

                        Timestamp tBegin = Timestamp.valueOf(pp + " " + beginTime);
                        tBegin.setTime(tBegin.getTime() - 1000 * 60 * 60 * 24);// 开始时间

                        // 需要判断开启时间是否在延期内
                        if (jrsDelay != null && jrsDelay.size() > 0) {
                            boolean bln = true ;
                            while (bln) {
                                bln = false ;
                                for (int d = 0; d < jrsDelay.size(); d++) {
                                    jrsDelay.move(d);
                                    Date bd = jrsDelay.getDate("CBEGINDATE");
                                    Date ed = jrsDelay.getDate("CENDDATE");
                                    ed.setTime(ed.getTime() + 1000 * 60 * 60 * 24);

                                    if (bd.getTime() < tBegin.getTime() && tBegin.getTime() < ed.getTime()) {
                                        tBegin.setTime(tBegin.getTime() - 1000 * 60 * 60 * 24);
                                        bln = true ;
                                        break ;
                                    }
                                }
                            }
                        }

                        tEnd.setTime(tEnd.getTime() + 14 * 1000 * 60);
                        String etx = formater.format(tEnd); 
                        if ( ! savePrevAddPeriod(periodID,formater.format(tBegin),formater.format(tEnd),formater.format(tAward), etx,jcn) ) {
                            blnAddFlag = false;
                            break;
                        }
                    }
                    nowcal.add(Calendar.DATE, 1);// 加一天
                }
                jrs.clear();
                jrs = null;

                // 更新最后预排时间
                if (blnAddFlag) {
                    nowcal.add(Calendar.DATE, 0-this.prevOpenNum);
                    sql = "UPDATE  TB_GAME_CONFIG SET CPREVADDTIME = TO_DATE('" + DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
                    sql += "','yyyy-MM-dd HH24:mi:ss') WHERE CGAMEID = '" + gameID + "'";
                    if (jcn.executeUpdate(sql) != 1) {
                        blnAddFlag = false;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            blnAddFlag = false;
        }
        return blnAddFlag;
	}

}
