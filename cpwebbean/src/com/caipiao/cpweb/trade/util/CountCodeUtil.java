package com.caipiao.cpweb.trade.util;

import java.util.Date;
import java.util.HashMap;

import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.game.cacher.util.GameContains;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.util.DateUtil;

public class CountCodeUtil {

	private static HashMap<String, String> maps = new HashMap<String, String>();
	static {
		maps.put("80", "40/24/60");
		maps.put("81", "40/24/60");
		maps.put("82", "40/24/60");
		maps.put("83", "40/24/60");
	}

	public static void checkCodeCount(String gid, TradeBean bean, JdbcConnect jcn) {
		int _gid = Integer.valueOf(gid);
		if (bean.getFflag() == 1) {
			String stime = maps.get(gid);
			if (stime != null) {
				String sql = "select cfendtime + " + stime + " cfendtime from tb_period where cgameid = ? and cperiodid = ?";
				Date cfendtime = null;
				JdbcRecordSet jrs = jcn.executeQuery(sql, new Object[] { gid, bean.getPid() });
				if (jrs != null && jrs.size() > 0 && jrs.first()) {
					cfendtime = jrs.getDate("cfendtime");

					if (_gid >= 80 && _gid <= 83) {
						if (bean.getMoney() >= 100000) {
							double time = (cfendtime.getTime() - System.currentTimeMillis()) / 1000 / 60;
							if (time < 80) {
								bean.setBusiErrCode(-1);
								bean.setBusiErrDesc("10万元以上(含)单式方案截止时间为官方截止前80分钟,下次请提早投注");
							}
						}
					}
				}
			}
		}
	}

	public static void checkEndTime(String gid, TradeBean bean, JdbcConnect jcn){
		if (GameContains.isR9(gid)) {
			String sql = "select cfendtime cfendtime from tb_period where cgameid = ? and cperiodid = ?";
			Date cfendtime = null;
			JdbcRecordSet jrs = jcn.executeQuery(sql, new Object[]{gid, bean.getPid()});
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				cfendtime = jrs.getDate("cfendtime");
				if(System.currentTimeMillis() > cfendtime.getTime()){
					bean.setBusiErrCode(-1);
					bean.setBusiErrDesc("任选九胆拖方案投注按单式投注截止时间截止,下次请赶早");
				}
			}
		}
	}
	
	public static void jc(int num, int ifile, String endTime) throws Exception{
		if (num > 10000) {
			throw new Exception((ifile == 1 ? "单式" : "复式") + "单倍注数不得超过10000注，请重新投注");
		}

		Date date = DateUtil.parserDateTime(endTime);

		int max = 200;
		int hour = 0;
		long h = date.getTime() - System.currentTimeMillis() + 1000 * 60 * 15;
		boolean iflag = false;
		if (ifile == 1) {
			if (h > 1 * 1000 * 60 * 60 && h <= 2 * 1000 * 60 * 60) {// 2小时
				hour = 2;
				max = 3000;
				iflag = true;
			} else if (h > 0 && h <= 1 * 1000 * 60 * 60) {// 1小时
				hour = 1;
				max = 500;
				iflag = true;
			}
		} else {
			if (h > 1 * 1000 * 60 * 60 && h <= 2 * 1000 * 60 * 60) {
				hour = 2;
				max = 3000;
				iflag = true;
			} else if (h >= 0 && h <= 1 * 1000 * 60 * 60) {
				hour = 1;
				max = 500;
				iflag = true;
			}
		}

		if (iflag) {
			if (num > max) {
				throw new Exception((ifile == 1 ? "单式" : "复式") + "单倍注数超过" + max + "注，请于第一场比赛开赛前" + hour + "个小时提交");
			}
		}

		if (h < 15 * 1000 * 60) {
			if (num > 100) {
				throw new Exception((ifile == 1 ? "单式" : "复式") + "单倍注数超过" + 100 + "注，请于第一场比赛开赛前" + 15 + "分钟提交");
			}
		}
	}

	public static void bd(int num, int ifile, String endTime) throws Exception{
		Date date = DateUtil.parserDateTime(endTime);

		int max = 1000;
		int time = 30;
		int minute = 0;
		long h ;
		boolean iflag = false;
		//单复式单倍注数（票张数）超过1000注(含)的方案截止时间限制为赛前30分钟,
		//单倍注数超过5000注(含)的方案截止时间限制为赛前60分钟，
		//超过1万注(含)的方案截止时间限制为90分钟。
		if(ifile == 1){
			h = date.getTime() - System.currentTimeMillis() + 1000 * 60 * 30;
		} else {
			h = date.getTime() - System.currentTimeMillis() + 1000 * 60 * 15;
		}

		if( h > 0 && h <= 1 * 1000 * 60 * time){
			minute = time;
			max = 1000;
			iflag = true;
		} else if(h > 1 * 1000 * 60 * 60 && h <= 1 * 1000 * 60 * 90){
			minute = 60;
			max = 5000;
			iflag = true;
		} else if(h > 1 * 1000 * 60 * 90){
			minute = 90;
			max = 10000;
			iflag = true;
		}
		
		if ( iflag ) {
			if ( num > max ) {
				throw new Exception((ifile == 1 ? "单式": "复式") + "单倍注数超过" + max + "注，请于第一场比赛开赛前" + minute + "分钟提交");
			}
		}
	}
}
