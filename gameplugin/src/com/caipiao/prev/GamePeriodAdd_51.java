package com.caipiao.prev;

/**
 * 七星彩
 * 2008-06-08
 * 陈祝荣
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

public class GamePeriodAdd_51 extends GamePeriodAddImpl {

	@Override
	public boolean periodPrevAdd(JdbcConnect jcn) {
		boolean blnAddFlag = true;
		SimpleDateFormat formater = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			String sql = "select * from TB_GAME_CONFIG where CGAMEID = '" + gameID + "'";

			JdbcRecordSet jrs = jcn.executeQuery(sql);
			if (jrs != null && jrs.size() > 0) {
				jrs.first();
				Date dStartDate = jrs.getDate("CPREVADDTIME");// 已经预排的日期

				sql = "select IDELAYNUM,CBEGINDATE,CENDDATE from TB_GAME_DELAY where CGAMEID = '" + gameID + "'";
				JdbcRecordSet jrsDelay = jcn.executeQuery(sql);

				Date dCurDate = new Date();// 当前时间
				if ((dStartDate.getTime() - dCurDate.getTime()) / 1000 > 60 * 60 * 24 * 30) {// 不需要预排
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
					int dayNo = 0;// 推算开始日期的天数
					int pcount = 0;// 一周内的第几期

					int t = nowcal.get(Calendar.DAY_OF_WEEK);// 一周内的第几天
					if (t == Calendar.SUNDAY) {// 星期日
						dayNo = 2;
						pcount = 1;
					} else if (t == Calendar.TUESDAY) {// 星期二
						dayNo = 2;
						pcount = 2;
					} else if (t == Calendar.FRIDAY) {// 星期五
						dayNo = 3;
						pcount = 3;
					}

					if (dayNo > 0) {
						// 判断开奖时间 是否在延期的时间断内
						int delayNum = 0;

						String scur = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy-MM-dd");
						String prefixID = DateUtil.getDateTime(nowcal.getTimeInMillis(), "yyyy");
						int weekNum = nowcal.get(Calendar.WEEK_OF_YEAR);// 一年中的第几周

						if (weekNum == 1) {
							int month = nowcal.get(Calendar.MONTH);
							if (month == Calendar.DECEMBER) {
								weekNum = 53;
							}
						}

						boolean blnInDelay = false;
						String maxDelayEndDate = "1970-01-01";
						if (jrsDelay != null && jrsDelay.size() > 0) {
							for (int d = 0; d < jrsDelay.size(); d++) {
								jrsDelay.move(d);
								String bd = jrsDelay.get("CBEGINDATE").substring(0, 10);
								String ed = jrsDelay.get("CENDDATE").substring(0, 10);
								if (scur.compareToIgnoreCase(bd) >= 0 && scur.compareToIgnoreCase(ed) <= 0) {// 在延期时间断内容
									blnInDelay = true;
									break;
								} else {
									if (scur.compareToIgnoreCase(ed) > 0) {
										if (ed.startsWith(prefixID)) {// 年份相同
											delayNum += jrsDelay.getInt("IDELAYNUM");
										}
									}

									if (maxDelayEndDate.compareToIgnoreCase(ed) < 0) {
										maxDelayEndDate = ed;
									}
								}
							}
						}

						if (!blnInDelay) {// 不在延期时间内
							int firstWeekNum = getFirstWeekNoByYear(prefixID);
							String at = scur + " " + awardTime;

							Timestamp tEnd = Timestamp.valueOf(at);
							tEnd.setTime(tEnd.getTime() - this.aheadTime * 1000 * 60);
							String et = formater.format(tEnd);

//							tEnd.setTime(tEnd.getTime() + 5 * 1000 * 60);
							tEnd.setTime(tEnd.getTime() + 14 * 1000 * 60);
							String etx = formater.format(tEnd);

							// 需要推算开启时间
							Calendar tmp = (Calendar) nowcal.clone();
							tmp.add(Calendar.DATE, 0 - dayNo);

							String pp = DateUtil.getDateTime(tmp.getTimeInMillis(), "yyyy-MM-dd");
							if (jrsDelay != null && jrsDelay.size() > 0) {
								boolean bln = true;
								while (bln) {
									bln = false;
									pp = DateUtil.getDateTime(tmp.getTimeInMillis(), "yyyy-MM-dd");
									for (int d = 0; d < jrsDelay.size(); d++) {
										jrsDelay.move(d);
										String bd = jrsDelay.get("CBEGINDATE").substring(0, 10);
										String ed = jrsDelay.get("CENDDATE").substring(0, 10);
										if (bd.startsWith(prefixID)) {// 年份相同
											if (pp.compareToIgnoreCase(bd) >= 0 && pp.compareToIgnoreCase(ed) <= 0) {
												bln = true;
												break;
											} else {
												int iii = tmp.get(Calendar.DAY_OF_WEEK);
												if (iii != Calendar.SUNDAY && iii != Calendar.TUESDAY && iii != Calendar.FRIDAY) {
													bln = true;
													break;
												}
											}
										}
									}
									tmp.add(Calendar.DATE, 0 - 1);
								}
							}

							String bt = pp + " " + beginTime;
							// int num = (weekNum - 1) * 3 - firstWeekNum -
							// delayNum + pcount;
							int num = (weekNum - 2) * 3 + firstWeekNum - delayNum + pcount;
							String periodID = prefixID + StringUtil.LeftPad(num + "", "0", 3);

							if (!savePrevAddPeriod(periodID, bt, et, at, etx, jcn)) {
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
		}
		return true;
	}

	public static int getFirstWeekNoByYear(String year) {
		Calendar nowcal = Calendar.getInstance(Locale.CHINA);
		nowcal.setTime(DateUtil.parserDateTime(year + "-01-01 00:00:00"));
		int wd = nowcal.get(Calendar.DAY_OF_WEEK);

		if (wd <= Calendar.MONDAY) {
			return 3;
		} else if (wd > Calendar.MONDAY && wd <= Calendar.WEDNESDAY) {
			return 2;
		} else {
			return 1;
		}
	}

	// public static void main(String[] args) throws Exception {
	// Date d = DateUtil.parserDateTime("2009-07-16 00:00:00");
	//
	// Calendar nowcal = Calendar.getInstance(Locale.CHINA);
	// nowcal.setTime(d);
	//
	// int weekNum = nowcal.get(Calendar.WEEK_OF_YEAR);
	// int dayNo = 0;//推算开始日期的天数
	// int pcount = 0;//一周内的第几期
	//
	// int t = nowcal.get(Calendar.DAY_OF_WEEK);// 一周内的第几天
	// if (t == Calendar.SUNDAY) {// 星期天
	// dayNo = 3;
	// pcount = 1;
	// } else if (t == Calendar.TUESDAY) {// 星期二
	// dayNo = 2;
	// pcount = 2;
	// } else if (t == Calendar.THURSDAY) {// 星期四
	// dayNo = 2;
	// pcount = 3;
	// }
	//
	// int num = (weekNum-2) * 3 + getFirstWeekNoByYear("2009") + pcount;
	// System.out.println("num=" + num + " weekNum=" + weekNum + "  " +
	// getFirstWeekNoByYear("2009") + " pcount=" + pcount);
	// }
}