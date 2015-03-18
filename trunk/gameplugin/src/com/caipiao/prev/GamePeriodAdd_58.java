package com.caipiao.prev;

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

public class GamePeriodAdd_58 extends GamePeriodAddImpl {

	private int iInterval = 10;

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
				Date dCurDate = new Date();// 当前时间

				if ((dStartDate.getTime() - dCurDate.getTime()) / 1000 > 60 * 60 * 24 * 2) {// 不需要预排
					System.out.println(dStartDate);
					System.out.println(dCurDate);
					jrs.clear();
					jrs = null;
					return true;
				}

				sql = "select IDELAYNUM,CBEGINDATE,CENDDATE from TB_GAME_DELAY where cgameid = '" + gameID + "'";
				JdbcRecordSet jrsDelay = jcn.executeQuery(sql);

				if (dStartDate.before(dCurDate)) {
					dStartDate = dCurDate;
				}

				// 计算总期数
				int total = 0;
				Timestamp fbts = Timestamp.valueOf(DateUtil.getCurrentDate() + " " + beginTime);
				Timestamp lats = Timestamp.valueOf(DateUtil.getCurrentDate() + " " + awardTime);

				Calendar nowcal = Calendar.getInstance(Locale.CHINA);
				nowcal.setTime(dStartDate);

				for (int i = 0; i < prevAddNum + this.prevOpenNum; i++) {
					String prefixID = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyMMdd");

//					int delayNum = 0;// 从数据库中取延期数量
					String scur = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
					boolean blnInDelay = false;
					if (jrsDelay != null && jrsDelay.size() > 0) {
						for (int d = 0; d < jrsDelay.size(); d++) {
							jrsDelay.move(d);
							String bd = jrsDelay.get("CBEGINDATE");
							String ed = jrsDelay.get("CENDDATE");
							if (scur.compareToIgnoreCase(bd) >= 0 && scur.compareToIgnoreCase(ed) <= 0) {// 在延期时间断内容
								blnInDelay = true;
								break;
							} else {
//								if (scur.compareToIgnoreCase(ed) > 0) {
//									if (ed.startsWith(prefixID)) {// 年份相同
//										delayNum += jrsDelay.getInt("IDELAYNUM");
//									}
//								}
							}
						}
					}

					if (!blnInDelay) {
						total = (int) (lats.getTime() - fbts.getTime()) / 1000 / 60 / iInterval;
						for (int k = 1; k <= total; k++) {
							String periodID = prefixID + StringUtil.LeftPad(k + "", "0", 2);

							String pp = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
							Timestamp tBegin = Timestamp.valueOf(pp + " " + beginTime);
							tBegin.setTime(tBegin.getTime() + ((k - 1) * 1000 * 60 * iInterval));// 开始时间

							Timestamp tEnd = new Timestamp(tBegin.getTime() + 1000 * 60 * (iInterval - aheadTime));
							Timestamp tAward = new Timestamp(tBegin.getTime() + 1000 * 60 * iInterval);

							String et = formater.format(tEnd);
							
							tEnd.setTime(tEnd.getTime() + 1 * 1000 * 60);
							String etx = formater.format(tEnd);
							if (!savePrevAddPeriod(periodID, formater.format(tBegin), et, formater.format(tAward), etx, jcn)) {
								blnAddFlag = false;
								break;
							}
						}
					}
					nowcal.add(Calendar.DATE, 1);// 加一天
				}
				jrs.clear();
				jrs = null;

				// 更新最后预排时间
				if (blnAddFlag) {
					nowcal.add(Calendar.DATE, 0 - this.prevOpenNum);
					sql = "UPDATE  TB_GAME_CONFIG SET CPREVADDTIME = TO_DATE('" + DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
					sql += "','yyyy-MM-dd HH24:mi:ss') WHERE CGAMEID = '" + gameID + "'";
					if (jcn.executeUpdate(sql) != 1) {
						blnAddFlag = false;
					}
				}
				if ( jrsDelay != null ) {
					jrsDelay.clear();
					jrsDelay = null ;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			blnAddFlag = false;
		}
		return blnAddFlag;
	}

}
