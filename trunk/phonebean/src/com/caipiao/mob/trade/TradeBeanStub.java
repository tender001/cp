package com.caipiao.mob.trade;

import java.io.File;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import com.caipiao.game.cacher.match.MatchCacheManager;
import com.caipiao.game.cacher.util.FileUtil;
import com.caipiao.game.cacher.util.GameContains;
import com.caipiao.mob.BaseBean;
import com.caipiao.mob.BeanStub;
import com.caipiao.mob.Status;
import com.caipiao.mob.match.Match;
import com.caipiao.mob.util.BeanLogUtil;
import com.caipiao.mob.util.FileCodesUtil;
import com.caipiao.mob.util.GameUtil;
import com.caipiao.mob.util.OptimizeUtil;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.jcutil.JcCastCode;
import com.caipiao.plugin.jcutil.JcItemBean;
import com.caipiao.plugin.lqutil.LqCastCode;
import com.caipiao.plugin.lqutil.LqItemBean;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.util.xml.Xml;

public class TradeBeanStub extends BeanStub {

	private Logger logger = LoggerFactory.getLogger("trade");
	private MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();

	//开奖信息
	public void kaiJiang(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONArray array = new JSONArray();
			List<String> list = GameUtil.getGameKeys();
			for(String gid : list){
				if(GameUtil.isSZC(gid)){
					JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_period where cgameid = ? and length(cawardcode) > 0 order by cperiodid desc) where rownum = 1", new Object[]{gid});
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						JSONObject obj = new JSONObject();
						obj.put("type", GameUtil.getGameName(gid));
						obj.put("name", GameUtil.getDYJGameName(gid));
						obj.put("termNo", jrs.get("cperiodid"));
						String date = jrs.get("cawardtime");
						obj.put("date", date.substring(0, 10));
						obj.put("result", jrs.get("cawardcode"));
						obj.put("prizepool", jrs.get("crealmoney"));
						obj.put("sale", jrs.get("crealsale"));
						obj.put("grades", jrs.get("cgradeinfo"));
						obj.put("nums", jrs.get("cgnuminfo"));
						obj.put("ver", "1");
						array.put(obj);
					}
				}
			}
			bean.setJson(array.toString());
			logger.info(bean.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::kaijiang ", e);
			BeanLogUtil.logger("查询开奖信息异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	//开奖详情
	public void kaiJiangDetail(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getTerm())){
			bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
			return;
		}
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.isSZC(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONObject obj = new JSONObject();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_period_last", bean, null, jcn);
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				obj.put("type", GameUtil.getGameName(bean.getType()));
				obj.put("name", bean.getType());
				obj.put("termNo", jrs.get("cperiodid"));
				obj.put("date", jrs.get("cawardtime"));
				obj.put("result", jrs.get("cawardcode"));
				obj.put("deadLine", jrs.getInt("ds"));
			}
			bean.setJson(obj.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::kaiJiangDetail ", e);
			BeanLogUtil.logger("查询开奖详情异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}	
	
	//开奖历史
	public void kaiJiangHistory(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.isSZC(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		if(bean.getPage() < 0){
			bean.setPage(1);
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONArray array = new JSONArray();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_period_all", bean, null, bean.getPagesize(), bean.getPage(), jcn);
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				for(int i = 0;  i < jrs.size(); i++){
					JSONObject obj = new JSONObject();
					obj.put("type", GameUtil.getGameName(bean.getType()));
					obj.put("term", jrs.get("cperiodid", i));
					String time = jrs.get("cawardtime", i);
					obj.put("time", time.substring(0, 10));
					obj.put("result", jrs.get("cawardcode", i));
					array.put(obj);
				}
			}
			bean.setJson(array.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::kaiJiangHistory ", e);
			BeanLogUtil.logger("查询开奖历史异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}	
	
	//开奖详情(奖级)
	public void kaiJiangGrade(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getTerm())){
			bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
			return;
		}
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.isSZC(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONObject obj = new JSONObject();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("mob_period", bean, null, jcn);
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				String awardtime = jrs.get("cawardtime");
				Date date = DateUtil.parserDateTime(awardtime);
				Calendar cal = Calendar.getInstance();
				cal.setTime(date);
				cal.add(Calendar.DATE, 60);
				obj.put("stopSendPrizeTime", DateUtil.getDateTime(cal.getTimeInMillis(), "yyyy-MM-dd"));
				
				String grades = jrs.get("cgradeinfo");
				String nums = jrs.get("cgnuminfo");
				JSONArray array = new JSONArray();
				
				if(GameUtil.isKP(bean.getType())){
					nums = grades.replaceAll("\\d+", "0");
				}
				
				logger.info(grades);
				logger.info(nums);

				String gradeinfo = getGradeInfo(bean.get159Type());
				if(bean.getType().equals("dlt")){
					if(Integer.valueOf(bean.getTerm())>Integer.valueOf("2014051")){
						gradeinfo ="一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖";
					}
				}
				logger.info(gradeinfo);
				if(!StringUtil.isEmpty(grades) && !StringUtil.isEmpty(nums) && !StringUtil.isEmpty(gradeinfo)){
					String [] gs = StringUtil.splitter(grades, ",");
					String [] ns = StringUtil.splitter(nums, ",");
					String [] gi = StringUtil.splitter(gradeinfo, ",");
					if(gs.length == ns.length && gs.length <= gi.length){
						for(int j = 0; j < gs.length; j++){
							if(!StringUtil.isEmpty(gs[j])){
								JSONObject json = new JSONObject();
								json.put("name", gi[j]);
								json.put("betnum", ns[j]);
								json.put("prize", gs[j]);
								array.put(json);
							}
						}
					}
				}
				obj.put("prizeLevel", array);
			}
			bean.setJson(obj.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::kaiJiangDetail ", e);
			BeanLogUtil.logger("查询开奖详情异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}	
	
	//赛果开奖
	public void matchResult(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getTerm())){
			bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
			return;
		}
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.checkGame(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		String key = "";
		if(GameUtil.isJCZQ(bean.getType())){
			key = "mob_jczq_day_match";
		} else if(GameUtil.isJCLQ(bean.getType())) {
			key = "mob_jclq_day_match";
		} else if(GameUtil.isBD(bean.getType())){
			key = "mob_bd_period_match";
		} else {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "彩种错误");
			return;
		}
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONArray array = new JSONArray();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(key, bean, null, jcn);
			HashMap<String, Match> matchs = new HashMap<String, Match>();
			if(GameUtil.isJCZQ(bean.getType())){
				matchs.putAll(getJCZQMatch(jrs));
			} else if(GameUtil.isJCLQ(bean.getType())) {
				matchs.putAll(getJCLQMatch(jrs));
			} else if(GameUtil.isBD(bean.getType())){
				matchs.putAll(getBDMatch(jrs));
			}
			
			Set<String> keys = matchs.keySet();
			List<String> list = new ArrayList<String>();
			for(String _key : keys){
				list.add(_key);
			}
			Collections.sort(list);
			
			for(String _key : list){
				Match m = matchs.get(_key);
				JSONObject obj = new JSONObject();
				obj.put("bout_index", m.getMatchID());
				obj.put("match_name", m.getMatchName());
				obj.put("match_state", m.getStatus());
				obj.put("match_point", m.getLose());
				obj.put("away_team", m.getVisitName());
				obj.put("home_team", m.getHomeName());
				obj.put("match_time", m.getMatchTime());
				if(!GameUtil.isJCLQ(bean.getType())){
					obj.put("half_score", m.getHalfScore());
				}
				obj.put("whole_score", m.getScore());
				array.put(obj);
			}
			
			bean.setJson(array.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::matchResult ", e);
			BeanLogUtil.logger("查询赛果开奖异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	// 期号信息
	public void periodInfo(TradeBean bean, ServiceContext context) {
		
		logger.info(String.valueOf(bean.getVersion()));
		
		if(!StringUtil.isEmpty(bean.getType())){
			if(!GameUtil.checkGame(bean.getType())){
				bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
				return;
			}
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			List<String> list = GameUtil.getGameKeys();
			JSONArray array = new JSONArray();
			for(String gid : list){
				if(GameUtil.isSZC(gid)){
					if(StringUtil.isEmpty(bean.getType()) || gid.equals(bean.get159Type())){
						JdbcRecordSet jrs = jcn.executeQuery("select * from (select t.*,round((cendtime-sysdate)*24*60*60,0) ms,cendtime-sysdate ds from tb_period t where cgameid = ? and istate=1 and cendtime-sysdate > 0 order by cperiodid ) where rownum = 1", new Object[]{gid});
						if(jrs != null && jrs.size() > 0 && jrs.first()){
							JSONObject obj = new JSONObject();
							obj.put("type", GameUtil.getGameName(gid));
							obj.put("termNo", jrs.get("cperiodid"));
							obj.put("max", getMaxPrizeInfo(gid));
							String awardtime = jrs.get("cawardtime");
							obj.put("openPrizeTime", DateUtil.parserDateTime(awardtime).getTime());
							String endtime = jrs.get("cendtime");
							obj.put("stopSaleTime", endtime);
							obj.put("deadLine", jrs.getInt("ms"));
							obj.put("tag", getGamePrizeTag(gid));
							double ds = Double.parseDouble(jrs.get("ds"));
							String tag = "";
							if(GameUtil.isKP(gid)){
								tag = "天天开奖";
							} else {
								if(ds >=0 && ds < 1){
									tag = "今日开奖";
								}
							}
							obj.put("tag2", tag);
							array.put(obj);
						}
					}
				}
			}
			
			if(StringUtil.isEmpty(bean.getType()) || GameUtil.isJCZQ(bean.getType())){
				JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_match_jczq where istate = 0 order by citemid) where rownum = 1", new Object[0]);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					JSONObject obj = new JSONObject();
					obj.put("type", "竞彩足球");
					String itemid = jrs.get("citemid");
					obj.put("termNo", itemid.substring(0, 6));
					obj.put("max", "");
					obj.put("openPrizeTime", "0");
					String endtime = jrs.get("cendtime");
					obj.put("stopSaleTime", endtime);
					obj.put("deadLine", "0");
					obj.put("tag", "返奖69%，竞猜乐不停");
					obj.put("tag2", "");
					array.put(obj);
				}
			}
			
			logger.info(String.valueOf(bean.getVersion()));
			
			if(bean.getVersion() == 6){
				if(StringUtil.isEmpty(bean.getType()) || GameUtil.isJCLQ(bean.getType())){
					JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_match_jclq where istate = 0 order by citemid) where rownum = 1", new Object[0]);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						JSONObject obj = new JSONObject();
						obj.put("type", "竞彩篮球");
						String itemid = jrs.get("citemid");
						obj.put("termNo", itemid.substring(0, 6));
						obj.put("max", "");
						obj.put("openPrizeTime", "0");
						String endtime = jrs.get("cendtime");
						obj.put("stopSaleTime", endtime);
						obj.put("deadLine", "0");
						obj.put("tag", "二选一，更易中");
						obj.put("tag2", "");
						array.put(obj);
					}
				}
				
				if(StringUtil.isEmpty(bean.getType()) || GameUtil.isBD(bean.getType())){
					JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_match_bd where istate = 0 order by imatchid) where rownum = 1", new Object[0]);
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						JSONObject obj = new JSONObject();
						obj.put("type", "单场竞猜");
						String itemid = jrs.get("imatchid");
						String periodid = jrs.get("cperiodid");
						obj.put("termNo", periodid);
						obj.put("max", "");
						obj.put("openPrizeTime", "0");
						String endtime = jrs.get("cendtime");
						obj.put("stopSaleTime", endtime);
						obj.put("deadLine", "0");
						obj.put("tag", "猜对一场也有奖");
						obj.put("tag2", "");
						array.put(obj);
					}
				}
				
			}
			if(StringUtil.isEmpty(bean.getType()) || GameUtil.isBD(bean.getType())){
				JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_match_bd where istate = 0 order by cperiodid) where rownum = 1", new Object[0]);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					JSONObject obj = new JSONObject();
					obj.put("type", "北京单场");
					String itemid = jrs.get("cperiodid");
					obj.put("termNo", itemid.substring(0, 6));
					obj.put("max", "");
					obj.put("openPrizeTime", "0");
					String endtime = jrs.get("cendtime");
					obj.put("stopSaleTime", endtime);
					obj.put("deadLine", "0");
					obj.put("tag", "");
					obj.put("tag2", "");
					array.put(obj);
				}
			}
			if(StringUtil.isEmpty(bean.getType())){
				bean.setJson(array.toString());
			} else {
				if(array.length() > 0){
					bean.setJson(array.get(0).toString());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "查询无数据");
				}
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::periodInfo ", e);
			BeanLogUtil.logger("查询期号信息异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 获取比赛所属日期  jc 11:30  bj 10:00
	 * 
	 * @param date
	 * 			开赛时间
	 * @param h
	 * 			小时
	 * @param m
	 * 			分钟
	 * @return
	 */
	private String getMatchDate(String date,int h,int m){
		if(StringUtil.isEmpty(date)){
			return "";
		}
		Date sDate = com.util.date.DateUtil.getDate(date, "yyyy-MM-dd HH:mm:ss");
		return(sDate.getHours() < h || sDate.getHours() == h && sDate.getMinutes() == m) ? (com.util.date.DateUtil.getDateTime(sDate.getTime() - 1000 * 60 * 60 * 24, "yyyy-MM-dd"))
				: (com.util.date.DateUtil.getDateTime(sDate.getTime(), "yyyy-MM-dd"));
	}
	
	// 比赛对阵
	public void getMatch(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.checkGame(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONArray array = new JSONArray();
			if(GameUtil.isZC(bean.getType())){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_period where cgameid = ? and istate=1", new Object[]{bean.get159Type()});
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					for(int i = 0; i < jrs.size(); i++){
						JSONObject obj = new JSONObject();
						String periodid = jrs.get("cperiodid", i);
						obj.put("term_no", periodid);
						obj.put("stop_sale_time", jrs.get("cendtime", i));
						JSONArray match = new JSONArray();
						JdbcRecordSet mjrs = jcn.executeQuery("select * from tb_match_zc where cgameid=? and cperiodid=? order by imatchid", new Object[]{bean.get159Type(), periodid});
						if(mjrs != null && mjrs.size() > 0 && mjrs.first()){
							for(int k = 0; k < mjrs.size(); k++){
								JSONObject m = new JSONObject();
								m.put("home_team", mjrs.get("cmname", k));
								m.put("away_team", mjrs.get("csname", k));
								m.put("bout_index", mjrs.getInt("imatchid", k));
								m.put("match_time", mjrs.get("cbegintime", k));
								m.put("match_name", mjrs.get("cmatchname", k));
								m.put("color", mjrs.get("ccolor", k)==""?"#000000":mjrs.get("ccolor", k));
								m.put("odd_home", mjrs.get("cbet3", k));
								m.put("odd_away", mjrs.get("cbet1", k));
								m.put("odd_draw", mjrs.get("cbet0", k));
								match.put(m);
							}
						}
						obj.put("match", match);
						array.put(obj);
					}
				}
				bean.setJson(array.toString());
			} else if(GameUtil.isJCZQ(bean.getType())){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_jczq where cendtime > sysdate order by citemid", new Object[0]);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					for(int i = 0; i < jrs.size(); i++){
						JSONArray match_arr = new JSONArray();
						match_arr.put(jrs.get("citemid", i));	//dyj编号
						match_arr.put(jrs.get("cname", i));		//官方编号
						match_arr.put(jrs.get("cmatchname", i));//赛事
						match_arr.put(jrs.get("cmname", i));	//主队
						match_arr.put(jrs.get("csname", i));	//客队
						match_arr.put(jrs.get("close", i));		//让球
						match_arr.put(jrs.get("cmatchtime", i));//比赛时间
						match_arr.put(jrs.get("cendtime", i));	//停售时间
						int sale = jrs.getInt("isale", i);
						int [] ss = new int[]{4,3,1,2,0};
						StringBuffer ssb = new StringBuffer();
						//胜平负，进球数，比分，半全场，让球胜平负，每一位0代表单关串关都开售，1表示串关停售，2表示单关停售，3表示都停售
						for(int s : ss){
							if(Long.bitCount(sale & (1L << s)) == 1){
								ssb.append("0");
							} else {
								ssb.append("1");
							}
						}
						match_arr.put(ssb.toString());			//销售状态
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put(jrs.get("cbet3", i) + "," + jrs.get("cbet1", i) + "," + jrs.get("cbet0", i));
						//sp共9组，依次为，胜平负、让球胜平负、进球数、比分、半全场、胜平负浮动，让球胜平负浮动，进球数浮动，半全场浮动（比分是没有浮动赔率的）
						JSONArray sp_arr = new JSONArray();
						String sp_spf = jrs.get("cspf", i);
						String sp_rspf = jrs.get("crspf", i);
						String sp_jqs = jrs.get("cjqs", i);
						String sp_cbf = jrs.get("ccbf", i);
						String sp_bqc = jrs.get("cbqc", i);
						String sp_fd_spf = jrs.get("cfspf", i);
						String sp_fd_rspf = jrs.get("cfrspf", i);
						String sp_fd_jqs = jrs.get("cfjqs", i);
						String sp_fd_bqc = jrs.get("cfbqc", i);
						String [] sps = new String[]{sp_spf, sp_rspf, sp_jqs, sp_cbf, sp_bqc, sp_fd_spf, sp_fd_rspf, sp_fd_jqs, sp_fd_bqc};
						for(String sp : sps){
							JSONArray sp_value_arr = new JSONArray();
							if(!StringUtil.isEmpty(sp)){
								String [] sp_values = StringUtil.splitter(sp, ",");
								for(String _sp : sp_values){
									double db = 0;
									try {
										db = Double.parseDouble(_sp);
									} catch (Exception e) {
										db = 0;
									}
									sp_value_arr.put(db);
								}
							}
							sp_arr.put(sp_value_arr);
						}
						match_arr.put(sp_arr.toString());
						match_arr.put(jrs.get("ccolor", i)==""?"#000000":jrs.get("ccolor", i));	//颜色
						match_arr.put(getMatchDate(jrs.get("cmatchtime", i),11,30));
						
						
						int danguan = jrs.getInt("idanguan", i);
						StringBuffer sdg = new StringBuffer();
						//胜平负，进球数，比分，半全场，让球胜平负，每一位0代表单关开售，1表示单关停售
						int [] ssdg = new int[]{4,1,2,0,3};
						for(int s : ssdg){
							if(Long.bitCount(danguan & (1L << s)) == 1){
								sdg.append("0");
							} else {
								sdg.append("1");
							}
						}
						match_arr.put(sdg.toString());			//单关开售状态
						array.put(match_arr);
					}
				}
				bean.setJson(array.toString());
			} else if(GameUtil.isJCLQ(bean.getType())){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_jclq where cendtime > sysdate order by citemid", new Object[0]);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					for(int i = 0; i < jrs.size(); i++){
						JSONArray match_arr = new JSONArray();
						match_arr.put(jrs.get("citemid", i));
						match_arr.put(jrs.get("cname", i));
						match_arr.put(jrs.get("cmatchname", i));
						match_arr.put(jrs.get("cmname", i));
						match_arr.put(jrs.get("csname", i));
						match_arr.put(jrs.get("cmatchtime", i));
						match_arr.put(jrs.get("cendtime", i));
						long isale = jrs.getLong("isale",i);
						//销售状态4位，顺序为：胜负，让分胜负，大小分，胜分差，每一位0代表单关串关都开售，1表示串关停售，2表示单关停售，3表示都停售
						StringBuffer ssb = new StringBuffer();
						if(StringUtil.isEmpty(jrs.get("csf", i)) || ((isale & (1L << 0)) == 0L)){
							ssb.append("1");
						} else {
							ssb.append("0");
						}
						if(StringUtil.isEmpty(jrs.get("crfsf", i)) || ((isale & (1L << 1)) == 0L)){
							ssb.append("1");
						} else {
							ssb.append("0");
						}
						if(StringUtil.isEmpty(jrs.get("cdxf", i)) || ((isale & (1L << 3)) == 0L)){
							ssb.append("1");
						} else {
							ssb.append("0");
						}
						if(StringUtil.isEmpty(jrs.get("csfc", i)) || ((isale & (1L << 2)) == 0L)){
							ssb.append("1");
						} else {
							ssb.append("0");
						}
						match_arr.put(ssb.toString());			//销售状态
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put("-");
						match_arr.put(jrs.get("cbet3", i) + "," + jrs.get("cbet0", i));
						String sp_sf = jrs.get("csf", i);
						String sp_rfsf = jrs.get("close", i) + "," + jrs.get("crfsf", i);
						String sp_sfc = jrs.get("csfc", i);
						String sp_dxf = jrs.get("zclose", i) + "," + jrs.get("cdxf", i);
						String sp_fsf = jrs.get("cfsf", i);
						String sp_frfsf = jrs.get("cflose", i) + "," + jrs.get("cfrfsf", i);
						String sp_fdxf = jrs.get("zfclose", i) + "," + jrs.get("cfdxf", i);
						String new_sp_sf = reverse(sp_sf, ",");
						String new_sp_rfsf = jrs.get("close", i) + "," + reverse(jrs.get("crfsf", i),",");
						String new_sp_fsf = reverse(sp_fsf, ",");
						String new_sp_frfsf = reverse(sp_frfsf, ",");
						String new_sp_sfc = sp_sfc;
						if(!StringUtil.isEmpty(sp_sfc)){
							String [] ps = StringUtil.splitter(sp_sfc, ",");
							if(ps.length == 12){
								int [] pos = new int[]{6,7,8,9,10,11,0,1,2,3,4,5};
								StringBuffer sb = new StringBuffer();
								for(int pi : pos){
									sb.append(ps[pi]).append(",");
								}
								String tmp = sb.toString();
								if(tmp.endsWith(",")){
									tmp = tmp.substring(0,tmp.length() - 1);
								}
								new_sp_sfc = tmp;
							}
						}
						
						JSONArray sp_arr = new JSONArray();
						if(new_sp_sf.trim().equals("")) new_sp_sf = "0,0";
						if(new_sp_rfsf.trim().equals("")) new_sp_rfsf = "0,0,0";
						if(sp_dxf.trim().equals("")) sp_dxf = "0,0,0";
						if(new_sp_sfc.trim().equals("")) new_sp_sfc = "0,0,0,0,0,0,0,0,0,0,0,0";
						//sp共8组，依次为，胜负，让分胜负，大小分，胜分差、胜负单关，让分胜负单关，大小分单关，胜分差单关，让分胜负首位为让分值，大小分首位为预设总分
						String [] sps = new String[]{new_sp_sf, new_sp_rfsf, sp_dxf, new_sp_sfc, new_sp_fsf, new_sp_frfsf, sp_fdxf,new_sp_sfc};
						for(String sp : sps){
							JSONArray sp_value_arr = new JSONArray();
							if(!StringUtil.isEmpty(sp)){
								String [] sp_values = StringUtil.splitter(sp, ",");
								for(String _sp : sp_values){
									double db = 0;
									try {
										db = Double.parseDouble(_sp);
									} catch (Exception e) {
										db = 0;
									}
									sp_value_arr.put(db);
								}
							}
							sp_arr.put(sp_value_arr);
						}
						match_arr.put(sp_arr.toString());
						match_arr.put(jrs.get("ccolor", i)==""?"#000000":jrs.get("ccolor", i));	//颜色
						match_arr.put(getMatchDate(jrs.get("cmatchtime", i),11,30));
						
						int danguan = jrs.getInt("idanguan", i);
						StringBuffer sdg = new StringBuffer();
						//胜平负，进球数，比分，半全场，让球胜平负，每一位0代表单关开售，1表示单关停售
						
						int [] ssdg = new int[]{0,1,3,2};
						for(int s : ssdg){
							if(Long.bitCount(danguan & (1L << s)) == 1){
								sdg.append("0");
							} else {
								sdg.append("1");
							}
						}
						match_arr.put(sdg.toString());			//单关开售状态
						
						array.put(match_arr);
					}
				}
				bean.setJson(array.toString());
			} else if(GameUtil.isBD(bean.getType())){

				String type = "85";
				
				if(bean.getPlaytype().equalsIgnoreCase("SPF")){
					type = GameUtil.GameContains.BD_SPF;
				}else if(bean.getPlaytype().equalsIgnoreCase("CBF")){
					type = GameUtil.GameContains.BD_CBF;
				}else if(bean.getPlaytype().equalsIgnoreCase("BQC")){
					type = GameUtil.GameContains.BD_BQC;
				}else if(bean.getPlaytype().equalsIgnoreCase("SXP")){
					type = GameUtil.GameContains.BD_SXP;
				}else if(bean.getPlaytype().equalsIgnoreCase("JQS")){
					type = GameUtil.GameContains.BD_JQS;
				}
				
				if(StringUtil.isEmpty(bean.getTerm())){
					
					JdbcRecordSet jrs = jcn.executeQuery("select * from tb_period where cgameid = ? and istate=1 order by cperiodid desc", new Object[]{type});
					if(jrs != null && jrs.size() > 0 && jrs.first()){
						bean.setTerm(jrs.get("cperiodid"));
					}
					
					logger.info(bean.get159Type());
					logger.info("bean.getTerm() = "+bean.getTerm());
					
					if(StringUtil.isEmpty(bean.getTerm())){
						bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
						return;
					}
				}
				if(StringUtil.isEmpty(bean.getPlaytype())){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "玩法不能为空");
					return;
				}
				if(bean.getCount() <= 0){
					bean.setCount(170);
				}
				if(bean.getOffset() < 0){
					bean.setOffset(0);
				}
				
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_bd where cperiodid=? and cendtime > sysdate order by imatchid", new Object[]{bean.getTerm()});
				int size = 0,count=0;
				JSONObject obj = new JSONObject();
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					size = jrs.size();
					for(int i = bean.getOffset(); i < size; i++){
						JSONArray arr = new JSONArray();
						arr.put(jrs.get("cperiodid", i));
						arr.put(jrs.getInt("imatchid", i));
						arr.put(jrs.get("cmatchname", i));
						arr.put(jrs.get("cmname", i));
						arr.put(jrs.get("csname", i));
						arr.put(jrs.get("close", i));
						arr.put(jrs.get("cmatchtime", i));
						arr.put(jrs.get("cendtime", i));
						arr.put("-");
						arr.put("-");
						arr.put("-");
						arr.put("-");
						arr.put("-");
						arr.put("-");
						arr.put(jrs.get("cbet3", i) + "," + jrs.get("cbet1", i) + "," + jrs.get("cbet0", i));
						
						String [] keys = null;
						String field = "";
						if("SPF".equalsIgnoreCase(bean.getPlaytype())){
							keys = new String[]{"sp3", "sp1", "sp0"};
							field = "cspf";
						} else if("CBF".equalsIgnoreCase(bean.getPlaytype())){
							keys = new String[]{"10","20","21","30","31","32","40","41","42","90","00","11","22","33","99","01","02","12","03","13","23","04","14","24","09"};
							field = "ccbf";
						}  else if("BQC".equalsIgnoreCase(bean.getPlaytype())){
							keys = new String[]{"33","31","30","13","11","10","03","01","00"};
							field = "cbqc";
						}  else if("JQS".equalsIgnoreCase(bean.getPlaytype())){
							keys = new String[]{"jqs0", "jqs1", "jqs2", "jqs3", "jqs4", "jqs5", "jqs6", "jqs7"};
							field = "cjqs";
						}  else if("SXP".equalsIgnoreCase(bean.getPlaytype())){
							keys = new String[]{"sxp3", "sxp2", "sxp1", "sxp0"};
							field = "csxp";
						}  else {
							break;
						}
						String sp = jrs.get(field, i);
						String [] sp_arr = StringUtil.splitter(sp, ";");
						StringBuffer sb = new StringBuffer();
						/*
						for(int k = 0; k < sp_arr.length; k++){
							String sp_item = sp_arr[k];
							if(!StringUtil.isEmpty(sp_item)){
								String [] items = StringUtil.splitter(sp_item, ":");
								if(items.length >= 2) {
									for(int j=0;j<keys.length;j++){
										if(items[0].trim().equals(keys[j])){
											sb.append(items[1]).append(",");
										}
									}
								}
							}
						}
						*/
						for(int j=0;j<keys.length;j++){
							for(int k=0;k<sp_arr.length;k++){
								String sp_item = sp_arr[k];
								if(!StringUtil.isEmpty(sp_item)){
									String[] items = StringUtil.splitter(sp_item, ":");
									if(items.length>=2){
										if(items[0].trim().equals(keys[j])){
											sb.append(items[1]).append(",");
										}
									}
								}
							}
						}
						/*
						//数据库。sp中包含 rz:;rs:;sp0:2.31;sp1:3.4;sp3:3.63; k不能从0开始取值
						for(int k = 2; k < sp_arr.length; k++){
							String sp_item = sp_arr[k];
							if(!StringUtil.isEmpty(sp_item)){
								String [] items = StringUtil.splitter(sp_item, ":");
								if(items.length >= 2) {
									if(items[0].trim().equals(keys[k-2])){
										sb.append(items[1]).append(",");
									}
								}
							}
						}
						*/
						String tmp = sb.toString();
						if(tmp.endsWith(",")){
							tmp = tmp.substring(0, tmp.length() - 1);
						}
						arr.put(tmp);
						arr.put(jrs.get("ccolor", i)==""?"#000000":jrs.get("ccolor", i));	//颜色
						arr.put(getMatchDate(jrs.get("cmatchtime", i),11,30));
						array.put(arr);
						
						count++;
						if(count >= bean.getCount()){
							break;
						}
					}
				}
				obj.put("total", size);
				obj.put("content", array);
				bean.setJson(obj.toString());
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::getMatch ", e);
			BeanLogUtil.logger("查询比赛对阵异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	// 用户投注
	public void cast(TradeBean bean, ServiceContext context) {
		if(check(bean)){
			
			if("android".equalsIgnoreCase(bean.getChannel())){
				bean.setSource(8888);
			} else if("ios".equalsIgnoreCase(bean.getChannel())){
				bean.setSource(888);
			}
				
			if(StringUtil.isEmpty(bean.getTerm())){
				bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getCodes())){
				bean.setErrJson(Status.CODES_IS_EMPTY.CODE, Status.CODES_IS_EMPTY.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getType())){
				bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
				return;
			}
			if(!GameUtil.checkGame(bean.getType())){
				bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
				return;
			}
			
			if(GameUtil.isBD(bean.getType()) || GameUtil.isJCZQ(bean.getType()) || GameUtil.isJCLQ(bean.getType()) || GameUtil.isGYJ(bean.getType())){
				ball_cast(bean, context,false);
			} else if(GameUtil.isSZC(bean.getType())){
				if(bean.getNum() > 1){
					zhuihao_cast(bean, context,false);
				} else {
					szc_cast(bean, context,false);
				}
			} else if(GameUtil.isZC(bean.getType())){
				szc_cast(bean, context,false);
			}
		}
	}
	
	public void castNew(TradeBean bean, ServiceContext context) {
		if(check(bean)){
			
			if("android".equalsIgnoreCase(bean.getChannel())){
				bean.setSource(8888);
			} else if("ios".equalsIgnoreCase(bean.getChannel())){
				bean.setSource(888);
			}
			
			if(StringUtil.isEmpty(bean.getTerm())){
				bean.setErrJson(Status.PERIOD_IS_EMPTY.CODE, Status.PERIOD_IS_EMPTY.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getCodes())){
				bean.setErrJson(Status.CODES_IS_EMPTY.CODE, Status.CODES_IS_EMPTY.DESC);
				return;
			}
			if(StringUtil.isEmpty(bean.getType())){
				bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
				return;
			}
			if(!GameUtil.checkGame(bean.getType())){
				bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
				return;
			}
			
			if(GameUtil.isBD(bean.getType()) || GameUtil.isJCZQ(bean.getType()) || GameUtil.isJCLQ(bean.getType()) || GameUtil.isGYJ(bean.getType())){
				ball_cast(bean, context,true);
			} else if(GameUtil.isSZC(bean.getType())){
				if(bean.getNum() > 1){
					zhuihao_cast(bean, context,true);
				} else {
					szc_cast(bean, context,true);
				}
			} else if(GameUtil.isZC(bean.getType())){
				szc_cast(bean, context,true);
			}
		}
	}
	
	private boolean checkMoney(int type,String user, double money, JdbcConnect jcn){
		boolean flag = false;
		JdbcRecordSet jrs = jcn.executeQuery("select * from tb_user_acct where cnickid=?", new Object[]{user});
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			double usermoney = Double.parseDouble(jrs.get("ibalance"));
			if(type>0){
				if(usermoney > 0){
					flag = true;
				}
			}else{
				if(usermoney >= money){
					flag = true;
				}
			}
			
		}
		return flag;
	}
	
	private void ios_cast(TradeBean bean, JdbcConnect jcn){
		String proj = "ios_proj_cast";
		if(bean.getProjectType()==1){
			proj = "ios_proj_cast_hm";
		}
		if(bean.getVersion()>20){
			proj = "ios_proj_cast_hm";
		}
		int ret = JdbcSqlMapping.executeUpdate(proj, bean, null, jcn);
		if (ret == 0) {
			bean.setErrJson(bean.getStatus(), bean.getMessage());
		} else {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + " 方案发起失败");
		}
	}
	
	private void checkItem(String gid, JXmlWapper xml, HashMap<String, Long> cvals) throws Exception{
		if(GameUtil.isJCZQ(gid) || GameUtil.isJCLQ(gid)){
			if(xml != null){
				Xml match = Xml.parse(xml.toXmlString());
				for(Iterator<String> keys = cvals.keySet().iterator(); keys.hasNext();){
					String itemid = keys.next();
					long lc = cvals.get(itemid);
					if(GameUtil.isJCZQ(gid)){
						//isale spf cbf bqc jqs rspf
//						String [] sp = new String[4];
						String isale = match.getStringValue("//row[@itemid='" + itemid + "']//@isale");
						String mname = match.getStringValue("//row[@itemid='" + itemid + "']//@name");
						if(!StringUtil.isEmpty(isale)){
							int sale = Integer.parseInt(isale);
							int [] gs = new int[]{90,91,92,93,72};
							for(int i = 1; i < 6; i++){//111110
								if(((lc & (1L << i)) == (1L << i)) && ((1L << i) & (sale<<1)) != ((1L << i) & lc)){
									throw new RuntimeException("场次：" + mname + " 玩法：" + JcCastCode.getPrefix(gs[i-1]) + " 已停售");
								}
							}
						}
					} else if(GameUtil.isJCLQ(gid)){
						//csf,crfsf,csfc,cdxf
						String [] sp = new String[4];
						sp[0] = match.getStringValue("//row[@itemid='" + itemid + "']//@csf");
						sp[1] = match.getStringValue("//row[@itemid='" + itemid + "']//@crfsf");
						sp[2] = match.getStringValue("//row[@itemid='" + itemid + "']//@csfc");
						sp[3] = match.getStringValue("//row[@itemid='" + itemid + "']//@cdxf");
						String mname = match.getStringValue("//row[@itemid='" + itemid + "']//@name");
						int [] gs = new int[]{94,95,96,97};
						for(int i = 5; i < 9;i++){
							if(((lc & (1L << i)) == (1L << i))){
								if(StringUtil.isEmpty(sp[i - 5])){
									throw new RuntimeException("场次：" + mname + " 玩法：" + LqCastCode.getPrefix(gs[i-1]) + " 已停售");
								}
							}
						}
					}
				}
			}
		}
	}

	private JXmlWapper getMatchInfo(JXmlWapper xml, String matchid){
		if(xml != null){
			int count = xml.countXmlNodes("row");
			for(int i = 0;i < count; i++){
				if(matchid.equals(xml.getStringValue("row["+i+"].@itemid")) || matchid.equals(xml.getStringValue("row["+i+"].@mid")) ||  matchid.equals(xml.getStringValue("row["+i+"].@cindex"))){
					return xml.getXmlNode("row["+i+"]");
				}
			}
		}
		return null;
	}

	private void saveProjMatchFile(BaseBean bean, String gid, Logger logger) throws Exception {
		logger.info("saveProjMatchFile:开始生成方案文件");
		logger.info(bean.getZid());
		if (StringUtil.isEmpty(bean.getZid())) {
			return;
		}
		String[] fields = new String[] { "spf", "cbf", "bqc", "sxp", "jqs", "spf", "cbf", "bfc", "jqs", "sf", "rfsf", "sfc", "dxf", "sp", "sp" };// 玩法属性节点
		String ppath =  System.getProperty("DATA_HOME") + File.separator + "guoguan"; // 方案文件保存路径

		File fdir = new File(ppath + File.separator + gid + File.separator + bean.getTerm() + File.separator + "proj");
		if (!fdir.exists()) {
			fdir.mkdirs();
		}
		
		logger.info(fdir.getPath());

		String[] matches = StringUtil.splitter(bean.getZid(), ",");
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>").append("\r\n");
		sb.append("<items ").append(JXmlUtil.createAttrXml("uid", "******"));
		sb.append(JXmlUtil.createAttrXml("pid", bean.getTerm()));
		sb.append(JXmlUtil.createAttrXml("projid", bean.getPlanNo()));
		sb.append(JXmlUtil.createAttrXml("spdate", DateUtil.getDateTime(System.currentTimeMillis())));
		sb.append(JXmlUtil.createAttrXml("builddate", DateUtil.getDateTime(System.currentTimeMillis())));
		sb.append(" >\r\n");

		String key = "";
		if (GameUtil.isBD(bean.getType())) {
			key = gid + "_" + bean.getTerm();
		} else {
			key = gid;
		}
		JXmlWapper xml = mcm.getCache(key);
		
		logger.info("----------------------------------------------------------------------------");
		logger.info(xml.toXmlString());
		if (xml == null) {
			return;
		}

		for (int i = 0; i < matches.length; i++) {
			if (matches[i] != null && matches[i].length() > 0 && matches[i].trim().length() > 0) {
				JXmlWapper mXml = getMatchInfo(xml, matches[i]);
				if (mXml == null) {
					logger.info("xml=" + xml.toXmlString("utf-8"));
					logger.info("无场次[" + matches[i] + "]信息");
					continue;
				}
				sb.append("<item ");
				sb.append(JXmlUtil.createAttrXml("id", matches[i] + ""));// ID

				if (GameUtil.isGYJ(gid)) {
					sb.append(JXmlUtil.createAttrXml("name", mXml.getStringValue("@name")));
					sb.append(JXmlUtil.createAttrXml("audit", "0"));
					sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@matchtime")));
					sb.append(JXmlUtil.createAttrXml("spvalue", mXml.getStringValue("@"+fields[Integer.parseInt(gid) - 85])));
				} else {
					sb.append(JXmlUtil.createAttrXml("hn", mXml.getStringValue("@hn")));
					sb.append(JXmlUtil.createAttrXml("vn", mXml.getStringValue("@gn")));

					sb.append(JXmlUtil.createAttrXml("hs", ""));
					sb.append(JXmlUtil.createAttrXml("vs", ""));

					if (GameUtil.isBD(gid)) {
						sb.append(JXmlUtil.createAttrXml("lose", mXml.getStringValue("@close") + ""));
						sb.append(JXmlUtil.createAttrXml("hhs", ""));
						sb.append(JXmlUtil.createAttrXml("hvs", ""));
						sb.append(JXmlUtil.createAttrXml("bet3", mXml.getStringValue("@b3")));
						sb.append(JXmlUtil.createAttrXml("bet1", mXml.getStringValue("@b1")));
						sb.append(JXmlUtil.createAttrXml("bet0", mXml.getStringValue("@b0")));
						sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@bt")));
						sb.append(JXmlUtil.createAttrXml("spvalue", mXml.getStringValue("@"+fields[Integer.parseInt(gid) - 85])));
					} else if(GameUtil.isJCZQ(gid)) {
						sb.append(JXmlUtil.createAttrXml("lose", mXml.getStringValue("@close") + ""));
						sb.append(JXmlUtil.createAttrXml("hhs", ""));
						sb.append(JXmlUtil.createAttrXml("hvs", ""));
						sb.append(JXmlUtil.createAttrXml("bet3", mXml.getStringValue("@bet3")));
						sb.append(JXmlUtil.createAttrXml("bet1", mXml.getStringValue("@bet1")));
						sb.append(JXmlUtil.createAttrXml("bet0", mXml.getStringValue("@bet0")));
						sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@mt")));
						sb.append(JXmlUtil.createAttrXml("name", mXml.getStringValue("@name")));
						String [] fs = new String[]{"spf","cbf","bqc","jqs","rspf"};
						StringBuffer _sb = new StringBuffer();
						for(int k = 0; k < fs.length; k++){
							_sb.append(mXml.getStringValue("@"+fs[k]));
							if(k != fs.length - 1){
								_sb.append("|");
							}
						}
						sb.append(JXmlUtil.createAttrXml("spvalue", _sb.toString()));
					}else if(GameUtil.isJCLQ(gid)){
						sb.append(JXmlUtil.createAttrXml("lose", "0|" + mXml.getStringValue("@close") + "|0|" + mXml.getStringValue("@zclose")));
						sb.append(JXmlUtil.createAttrXml("bet3", mXml.getStringValue("@bet3")));
						sb.append(JXmlUtil.createAttrXml("bet0", mXml.getStringValue("@bet0")));
						sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@mt")));
						sb.append(JXmlUtil.createAttrXml("name", mXml.getStringValue("@name")));
						String [] fs = new String[]{"sf","rfsf","sfc","dxf"};
						StringBuffer _sb = new StringBuffer();
						for(int k = 0; k < fs.length; k++){
							_sb.append(mXml.getStringValue("@"+fs[k]));
							if(k != fs.length - 1){
								_sb.append("|");
							}
						}
						sb.append(JXmlUtil.createAttrXml("spvalue", _sb.toString()));
					}
				}
				sb.append(JXmlUtil.createAttrXml("result", ""));
				sb.append(JXmlUtil.createAttrXml("cancel", "0"));
				sb.append("/>\r\n");
			}
		}
		sb.append("</items>\r\n");
		FileUtil.saveFile(fdir, bean.getPlanNo().toLowerCase() + ".xml", sb.toString(), "utf-8");
		sb = null;
	}
	
	
	public void ball_cast(TradeBean bean, ServiceContext context,boolean newVersion) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if(checkUser(bean, jcn)){
				String matches = "";
				String codes = "";
				boolean flag = false;
				String fileCodes = "";
				if(newVersion){
//					codes = bean.getCodes();
					//带;表示奖金优化，将codes保存到文件中
					if(bean.getCodes().indexOf(".txt")>0){
						String ss = bean.getCodes().substring(0, 2);
						String iosCodes = FileCodesUtil.getCodesFromFile(ss,bean.getTerm(),bean.getCodes(),"",logger);
						bean.setCodes(iosCodes);
					}
					String [] tmp = StringUtil.splitter(bean.getCodes(), ";");
					if(tmp.length>1){
						flag = true;
					}
					for(int i = 0; i < tmp.length; i++){
						String[] cc = StringUtil.splitter(tmp[i], "_");
						if(cc.length>1){
							for (int j = 0; j < Integer.valueOf(cc[1]); j++) {
								codes += cc[0]+";";
								fileCodes += cc[0]+"\r\n";
							}
						}else{
							codes += cc[0]+";";
							fileCodes += cc[0]+"\r\n";
						}
						
					}
					codes = codes.substring(0, codes.length()-1);
				}else{
					codes = getNewCode(bean.getType(), bean.getCodes(), bean.getAddtional());
				}
				if(StringUtil.isEmpty(codes)){
					bean.setErrJson(Status.CODES_IS_NOT_VALID.CODE, Status.CODES_IS_NOT_VALID.DESC);
					return;
				}
				bean.setCodes(codes);
				bean.setCodesWith159(codes);
				
				String gid = bean.get159Type();
				if(StringUtil.isEmpty(gid)){
					bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
					return;
				}
				
				if(!newVersion){
					System.out.println(gid);
					
					if(gid.equals("70") || gid.equals("71")){//如果是混投，作格式转换
						StringBuffer newCodes = new StringBuffer();
						//StringBuffer newCodes2 = new StringBuffer();
						String [] tmp = StringUtil.splitter(codes, ";");
						for(int i = 0; i < tmp.length; i++){
							String key = tmp[i];
							logger.info(key);
							if(!StringUtil.isEmpty(key)){
								String[] values = StringUtil.splitter(key, "|");
								if(!values[0].equalsIgnoreCase("HH")){
									StringBuffer newKey = new StringBuffer();
									newKey.append("HH|");
									String[] ms = StringUtil.splitter(values[1], ",");
									for(int j=0;j<ms.length;j++){
										String[] tzs = StringUtil.splitter(ms[j], "=");
										if(j>0) newKey.append(",");
										newKey.append(tzs[0]).append(">").append(values[0]).append("=").append(tzs[1]);
									}
									newKey.append("|").append(values[2]);
									key = newKey.toString();
								}
							}
							if(i>0) {
								newCodes.append(";");
								//newCodes2.append("^");
							}
							newCodes.append(key);
							//newCodes2.append(key);
						}
						codes = newCodes.toString();
						
						logger.info("------------ newCodes = " + codes);
						
						//bean.setCodes(newCodes2.toString());
						bean.setCodesWith159(codes);
					}
					
					if(gid.equals("85") || gid.equals("86") || gid.equals("87") || gid.equals("88") || gid.equals("89")){//如果是北单，作格式转换
						codes = codes.replaceAll("\\|0", "");
						logger.info("------------ newCodes = " + codes);
						StringBuffer newCodes = new StringBuffer();
						if(gid.equals("86")){
							String [] tmp = StringUtil.splitter(codes, ";");
							for(int i = 0; i < tmp.length; i++){
								String key = tmp[i];
								logger.info(key);
								if(!StringUtil.isEmpty(key)){
									String[] values = StringUtil.splitter(key, "|");
									if(values[0].equalsIgnoreCase("CBF")){
										StringBuffer newKey = new StringBuffer();
										newKey.append("CBF|");
										String[] ms = StringUtil.splitter(values[1], ",");
										for(int j=0;j<ms.length;j++){
											String[] tzs = StringUtil.splitter(ms[j], "=");
											if(j>0) newKey.append(",");
											//String[] tz = StringUtil.splitter(tzs[1], "");
											
											logger.debug(tzs[1]);
											
											newKey.append(tzs[0]).append("=").append(tzs[1].replaceAll("", ":").substring(1,4));
										}
										newKey.append("|").append(values[2]);
										key = newKey.toString();
									}
								}
								if(i>0) {
									newCodes.append(";");
								}
								newCodes.append(key);
							}
							codes = newCodes.toString();
							
							logger.info("------------ newCodes = " + codes);
						}
						
						if(gid.equals("87")){
							String [] tmp = StringUtil.splitter(codes, ";");
							for(int i = 0; i < tmp.length; i++){
								String key = tmp[i];
								logger.info(key);
								if(!StringUtil.isEmpty(key)){
									String[] values = StringUtil.splitter(key, "|");
									if(values[0].equalsIgnoreCase("BQC")){
										StringBuffer newKey = new StringBuffer();
										newKey.append("BQC|");
										String[] ms = StringUtil.splitter(values[1], ",");
										for(int j=0;j<ms.length;j++){
											String[] tzs = StringUtil.splitter(ms[j], "=");
											if(j>0) newKey.append(",");
											//String[] tz = StringUtil.splitter(tzs[1], "");
											
											logger.debug(tzs[1]);
											
											newKey.append(tzs[0]).append("=").append(tzs[1].replaceAll("", "-").substring(1,4));
										}
										newKey.append("|").append(values[2]);
										key = newKey.toString();
									}
								}
								if(i>0) {
									newCodes.append(";");
								}
								newCodes.append(key);
							}
							codes = newCodes.toString();
							
							logger.info("BQC------------ newCodes = " + codes);
						}
						
						bean.setCodesWith159(codes);
					}
				}
	
				GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
				JXmlWapper xml = mcm.getMatchXml(gid, bean.getTerm());
				if(xml == null){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "投注对阵错误");
					return;
				}
				
				String [] tmp = StringUtil.splitter(codes, ";");
				
				HashMap<String, Integer> cnums = new HashMap<String, Integer>();
				for(int i = 0; i < tmp.length; i++){
					String key = tmp[i];
					logger.info(key);
					if(!StringUtil.isEmpty(key)){
						Integer val = cnums.get(key);
						int _val = (val == null ? 0 : val.intValue()) + 1;
						cnums.put(key, _val);
					}
				}
				
				int money = 0;
				HashMap<String, Long> cvals = new HashMap<String, Long>();
				for (Iterator<String> keys = cnums.keySet().iterator(); keys.hasNext();) {
					String key = keys.next();
					int mul = cnums.get(key);
					logger.info("key=" + key);
					GameCastCode gcc = plugin.parseGameCastCode(key);
					matches += gcc.getMatchID();	//场次汇总
					money += gcc.getCastMoney() * mul;//金额汇总
					
					//投注项汇总
					if(gcc.getItems() != null){
						for(Object obj : gcc.getItems()){
							String itemid = obj instanceof JcItemBean ? ((JcItemBean)obj).getItemid() : ((LqItemBean)obj).getItemid();
							long _code = obj instanceof JcItemBean ? ((JcItemBean)obj).getCountItemType() : ((LqItemBean)obj).getCountItemType();
							Long lcode = cvals.get(itemid);
							long lc = (lcode == null ? 0 : lcode.longValue()) | _code;
							cvals.put(itemid, lc);
						}
					}
				}
				cnums.clear(); cnums = null;
				checkItem(gid, xml, cvals);
				cvals.clear(); cvals = null;
				if (bean.getMoney() != money * bean.getMultiple()) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "金额不正确,实际金额(" + money + ")");
					return;
				}
				
				// 检查场次是否正确
				String endTime = "";
				List<String> lst = new ArrayList<String>();
				String[] ss = StringUtil.splitter(matches, ",");
				for (int i = 0; i < ss.length; i++) {
					if (!lst.contains(ss[i]) && !StringUtil.isEmpty(ss[i])) {
						lst.add(ss[i]);
					}
				}
				matches = ",";
				for (int i = 0; i < lst.size(); i++) {
					matches += lst.get(i) + ",";
				}
				
				logger.info(matches);
	
				endTime = mcm.getMatchMinEndTime(gid, bean.getTerm(), matches);
				Date d = DateUtil.parserDateTime(endTime);
//				if (bean.getFflag() == 1) {// 是文件投注
				logger.info(endTime);
				logger.info(flag + "");
				if(flag){
					if (GameContains.isFootball(gid) || GameContains.isBasket(gid)) {
						long l = d.getTime() - 1000 * 60 * 10;
						endTime = DateUtil.getDateTime(l);
					} else if (GameContains.isBeiDan(gid)){
						long l = d.getTime() - 1000 * 60 * 10;
						endTime = DateUtil.getDateTime(l);
					} else {
						long l = d.getTime() - 1000 * 60 * 10;
						endTime = DateUtil.getDateTime(l);
					}
				}
				if (endTime.length() == 0) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "所选择的比赛场次中已经截止销售");
					return;
				} else {
					endTime = getSpecialTimeRange(gid, endTime);
					bean.setEndTime(endTime);
					// 处理竞彩的期次编号问题
					if (GameUtil.isBD(gid)){
						// nothing
					}else if (GameUtil.isJCZQ(gid)) {//JC
						bean.setTerm(StringUtil.replaceString(endTime.substring(0, 10), "-", ""));
					} else if (GameUtil.isJCLQ(gid)){//LQ
						bean.setTerm(StringUtil.replaceString(endTime.substring(0, 10), "-", ""));
					} else if (GameUtil.isGYJ(gid)){//GYJ
						// nothing
					}
				}
	
				bean.setZid(matches);
				
				if(!checkMoney(bean.getProjectType(),bean.getUser(), money, jcn)){
					bean.setErrJson(Status.USER_HAVE_NOT_ENOUGH_MONEY.CODE, Status.USER_HAVE_NOT_ENOUGH_MONEY.DESC);
					return;
				}
				
				
				if("ios".equalsIgnoreCase(bean.getChannel())){
					if(flag){
						String fileName = FileCodesUtil.getFileName(bean.getUser(), bean.get159Type(), bean.getTerm()).toLowerCase();
						fileName =gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"+fileName+"_ios";
						if (!FileCodesUtil.SaveFile(bean.getCodes(), bean.get159Type() + File.separator + bean.getTerm(), fileName + ".txt", "gbk")) {
							logger.error(fileName + ".txt" + "：存储失败");
							throw new Exception("存储失败");
						}
						bean.setFflag(1);
						bean.setCodesWith159(fileName + ".txt");
					}else{
						bean.setFflag(0);
					}
					ios_cast(bean, jcn);
				} else {
					String proj = "mob_proj_cast";
					if(bean.getProjectType()==1){
						proj = "mob_proj_cast_hm";
					}
					//优化投注使用 包括代购和合买
					if(bean.getVersion()>20){
						proj = "mob_proj_cast_hm";
					}
					if(flag){
						if(proj.equals("mob_proj_cast")){
							bean.setErrJson(Status.FAILURE.CODE, "请更新版本后，在使用奖金优化功能！");
							return;
						}
						fileCodes = fileCodes.substring(0, fileCodes.lastIndexOf("\r\n"));
						String fileName = FileCodesUtil.getFileName(bean.getUser(), bean.get159Type(), bean.getTerm()).toLowerCase();
						if (GameUtil.isJCZQ(gid)) {//JC
							fileName =gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"+fileName;
						}
						if (!FileCodesUtil.SaveFile(fileCodes, bean.get159Type() + File.separator + bean.getTerm(), fileName + ".txt", "gbk")) {
							logger.error(fileName + ".txt" + "：存储失败");
							throw new Exception("存储失败");
						}
						bean.setFflag(1);
						bean.setCodesWith159(fileName + ".txt");
					}else{
						bean.setFflag(0);
					}
//					System.out.println("----flag----"+flag+"-----fflag--"+bean.getFflag());
					int ret = JdbcSqlMapping.executeUpdate(proj, bean, null, jcn);
					logger.info("ret = " + ret);
					logger.info(bean.getStatus());
					if (ret == 0) {
						if (Status.SUCCESS.CODE.equals(bean.getStatus())) {
							try {
								saveProjMatchFile(bean, gid, logger);
							} catch (Exception e) {
								logger.error("生成方案对阵", e);
							}
							JSONObject obj = new JSONObject();
							obj.put("status", bean.getStatus());
							obj.put("balance", bean.getBalance());
							obj.put("lotteryType", bean.getType());
							obj.put("term", bean.getTerm());
							obj.put("codes", bean.getCodes());
							obj.put("money", bean.getMoney());
							obj.put("multiple", bean.getMultiple());
							obj.put("oneMoney", bean.getOneMoney());
							bean.setJson(obj.toString());
						} else {
							bean.setErrJson(bean.getStatus(), bean.getMessage());
						}
					} else {
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + " 方案发起失败");
					}
				}
			}
		} catch (RuntimeException e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::ball_cast", e);
			BeanLogUtil.logger("竞技彩投注异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	private int countMoney(TradeBean bean,boolean newVersion){
		String gid = bean.get159Type();
		int money = 0;
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
		if (plugin != null) {
			try {
				String codes = "";
				if(newVersion){
					codes = bean.getCodes();
				}else{
					codes = getNewCode(bean.getType(), bean.getCodes(), bean.getAddtional());
				}
				logger.info("codes = " + codes);
				
				if(StringUtil.isEmpty(codes)){
					bean.setErrJson(Status.CODES_IS_NOT_VALID.CODE, Status.CODES_IS_NOT_VALID.DESC);
					return -1;
				}
				bean.setCodesWith159(codes);
				GameCastCode[] cc = plugin.parseGameCastCodes(codes);
				if (GameUtil.isKP(bean.getType())){
					if (cc.length > 500) {
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "快频彩种方案条数不能够超过500条!");
						return -1;
					}
				}
				int total = 0;
				for (int i = 0; i < cc.length; i++) {
					total += cc[i].getCastMoney();
				}
				money = total * bean.getMultiple();
			} catch (CodeFormatException e) {
				logger.error("号码格式错误 game=" + gid, e);
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "号码格式错误 game=" + bean.getType());
				return -1;
			}
		} else {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "该彩种暂不支持(" + bean.getType() + ")");
			return -1;
		}
		
		if (bean.getMoney() <= 0) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "金额不正确,投注金额必须大于零");
			return -1;
		}
		
		if (bean.getMoney() != money) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "金额不正确,实际金额(" + money + ")");
			return -1;
		}
		return money;
	}
	
	public void zhuihao_cast(TradeBean bean, ServiceContext context,boolean newVersion) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if(checkUser(bean, jcn)){
				int money = countMoney(bean,newVersion);
				if(money <= 0){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "未检测到有效的投注金额");
					return;
				}
				
				if(money != bean.getMoney()){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "追号单期金额不正确,实际金额(" + money + ")");
					return;
				}
				
				int num = bean.getNum();
				
				String mulitys = "";
				String perodids = "";
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_period where cgameid = ? and cperiodid>=? and istate = 1 order by cperiodid", new Object[]{bean.get159Type(), bean.getTerm()});
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					int size = jrs.size();
					if(num > size){
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "追号期次超过了当前彩种的最大可追期数:" + size);
						return;
					}
					StringBuffer nsb = new StringBuffer();
					StringBuffer msb = new StringBuffer();
					for(int i = 0; i < size && i < num; i++){
						String pid = jrs.get("cperiodid", i);
						if(i == 0){
							if(!pid.equals(bean.getTerm())){
								bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "追号起始期次错误");
								return;
							}
						}
						nsb.append(pid).append(",");
						msb.append(bean.getMultiple()).append(",");
					}
					mulitys = msb.toString();
					perodids = nsb.toString();
					if(mulitys.endsWith(",")){
						mulitys = mulitys.substring(0, mulitys.length() - 1);
					}
					if(perodids.endsWith(",")){
						perodids = perodids.substring(0, perodids.length() - 1);
					}
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "获取期次失败");
					return;
				}
				
				int tmoney = num * money;
				if (bean.getChaseMoney() != tmoney) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "追号金额不正确 实际金额（" + tmoney + ")");
					return;
				}

				if(!checkMoney(bean.getProjectType(),bean.getUser(), money, jcn)){
					bean.setErrJson(Status.USER_HAVE_NOT_ENOUGH_MONEY.CODE, Status.USER_HAVE_NOT_ENOUGH_MONEY.DESC);
					return;
				}
				
				bean.setMultiplies(mulitys);
				bean.setPeriodids(perodids);
				if("ios".equalsIgnoreCase(bean.getChannel())){
					ios_cast(bean, jcn);
				} else {
					int ret = JdbcSqlMapping.executeUpdate("mob_cast_zh", bean, null, jcn);
					if (ret == 0) {
						if(Status.SUCCESS.CODE.equals(bean.getStatus())){
							JSONObject obj = new JSONObject();
							obj.put("status", bean.getStatus());
							obj.put("balance", bean.getBalance());
							obj.put("lotteryType", bean.getType());
							obj.put("term", bean.getTerm());
							obj.put("codes", bean.getCodes());
							obj.put("money", bean.getMoney());
							obj.put("multiple", bean.getMultiple());
							obj.put("oneMoney", bean.getOneMoney());
							bean.setJson(obj.toString());
						} else {
							bean.setErrJson(bean.getStatus(), bean.getMessage());
						}
					} else {
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + " 方案发起失败");
					}
				}
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::zhuihao_cast", e);
			BeanLogUtil.logger("数字彩追号投注异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void cancel_zhuihao(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			bean.setStatus(Status.SUCCESS.CODE);
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if(checkUser(bean, jcn)){
				if (StringUtil.isEmpty(bean.get159Type())) {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "彩种指定不明确");
					return;
				}
				if(StringUtil.isEmpty( bean.getZid())){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "撤销追号指定不明");
					return;
				}
//				System.out.println(bean.getZid()+"-------------"+bean.get159Type()+"----"+bean.getPlanNo());
				String dids = bean.getZid();
				String[] dd = StringUtil.splitter(dids, ",");
				if(Status.SUCCESS.CODE.equals(bean.getStatus())){
					for (int i = 0; i < dd.length; i++) {
						bean.setZid(dd[i].trim());
						int ret = JdbcSqlMapping.executeUpdate("mob_cancel_zh", bean, null, jcn);
						if (ret != 0) {
							bean.setErrJson(bean.getStatus(), bean.getMessage());
						}else{
							bean.setErrJson(bean.getStatus(), bean.getMessage());
						}
					}
				}
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::cancel_zhuihao", e);
			BeanLogUtil.logger("数字彩追号取消异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void szc_cast(TradeBean bean, ServiceContext context,boolean newVersion) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if(checkUser(bean, jcn)){
				int money = countMoney(bean,newVersion);
				if(money <= 0){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "未检测到有效的投注金额");
					return;
				}
				
				if(money != bean.getMoney()){
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "金额不正确,实际金额(" + money + ")");
					return;
				}
				
				if(!checkMoney(bean.getProjectType(),bean.getUser(), money, jcn)){
					bean.setErrJson(Status.USER_HAVE_NOT_ENOUGH_MONEY.CODE, Status.USER_HAVE_NOT_ENOUGH_MONEY.DESC);
					return;
				}
	
				if("ios".equalsIgnoreCase(bean.getChannel())){
					ios_cast(bean, jcn);
				} else {
					String proj = "mob_proj_cast";
					if(bean.getProjectType()==1){
						proj = "mob_proj_cast_hm";
					}
					int ret = JdbcSqlMapping.executeUpdate(proj, bean, null, jcn);
					if (ret == 0) {
						if(Status.SUCCESS.CODE.equals(bean.getStatus())){
							JSONObject obj = new JSONObject();
							obj.put("status", bean.getStatus());
							obj.put("balance", bean.getBalance());
							obj.put("lotteryType", bean.getType());
							obj.put("term", bean.getTerm());
							obj.put("codes", bean.getCodes());
							obj.put("money", bean.getMoney());
							obj.put("multiple", bean.getMultiple());
							obj.put("oneMoney", bean.getOneMoney());
							bean.setJson(obj.toString());
						} else {
							bean.setErrJson(bean.getStatus(), bean.getMessage());
						}
					} else {
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + " 方案发起失败");
					}
				}
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::szc_cast ", e);
			BeanLogUtil.logger("数字彩投注异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	//合买列表
	public void heMaiList(TradeBean bean, ServiceContext context) {
		
		logger.debug(bean.getType());
		
		if(bean.getPage() < 0){
			bean.setPage(1);
		}
		if(StringUtil.isEmpty(bean.getType())){
			bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
			return;
		}
		if(!GameUtil.checkGame(bean.getType())){
			bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
			return;
		}
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JSONArray array = new JSONArray();
			
			String type = "";
			if(GameUtil.isBD(bean.getType())){
				type = "85,86,87,88,89";
			} else if(GameUtil.isJCZQ(bean.getType())){
				type = "70,72,90,91,92,93";
			} else if(GameUtil.isJCLQ(bean.getType())){
				type = "71,94,95,96,97";
			} else {
				type = bean.get159Type();
			}
			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("type", type);
			String id = "mob_hemai";
			if(bean.getOflag()==1){
				id = "mob_mai";
			}
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(id, bean, maps, getPageSize(), bean.getPage(), jcn);
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				for(int i = 0; i < jrs.size(); i++){
					String gameid = jrs.get("cgameid", i);
					JSONObject obj = new JSONObject();
					obj.put("ticheng", jrs.getInt("iwrate", i));
					obj.put("total", jrs.getInt("itmoney", i));
					obj.put("type", GameUtil.getGameName(gameid));
					obj.put("left", jrs.getInt("ilnum", i));
					obj.put("time", jrs.get("cadddate", i));
					obj.put("termNo", jrs.get("cperiodid", i));
					int jindu = jrs.getInt("ijindu", i);
					int tnum = jrs.getInt("inums", i);
					int pnum = jrs.getInt("ipnum", i);
					String progress = jindu + "%";
					if(pnum > 0){
						progress += (int)(pnum * 100.0/tnum) + "%(保)";
					}
					obj.put("progress", progress);
					obj.put("jindu", jindu);
					obj.put("baodijindu", new BigDecimal(pnum * 100.0/tnum).setScale(0, BigDecimal.ROUND_HALF_UP));
					String projid = jrs.get("cprojid", i);
					obj.put("hemaino", gameid + "_" + projid);
					obj.put("note", jrs.get("cdesc", i));
					obj.put("author", jrs.get("cnickid", i));
					obj.put("permoney", jrs.getInt("ismoney", i));
					obj.put("gold", jrs.getInt("iaunum", i));
					obj.put("silver", jrs.getInt("iagnum", i));
					array.put(obj);
				}
			}
			bean.setJson(array.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::matchResult ", e);
			BeanLogUtil.logger("查询赛果开奖异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	//参与合买
	public void join(TradeBean bean, ServiceContext context) {
		if(check(bean)){
			if(StringUtil.isEmpty(bean.getHemaino())){
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "彩种方案号不能为空");
				return;
			}
			if(bean.getPart() <= 0){
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "认购份数不符合要求");
				return;
			}
			String [] ps = StringUtil.splitter(bean.getHemaino(), "_");
			if(ps.length != 2){
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "彩种方案号不能为空");
				return;
			}
			if(StringUtil.isEmpty(ps[0])){
				bean.setErrJson(Status.GAME_IS_EMPTY.CODE, Status.GAME_IS_EMPTY.DESC);
				return;
			}
			bean.setType(ps[0].trim());
			if(!GameUtil.checkGame(bean.getType())){
				bean.setErrJson(Status.GAME_IS_NOT_VALID.CODE, Status.GAME_IS_NOT_VALID.DESC);
				return;
			}
			bean.setPlanNo(ps[1].trim());
			if(StringUtil.isEmpty(bean.getPlanNo())){
				bean.setErrJson(Status.LOTTPROJ_IS_EMPTY.CODE, Status.LOTTPROJ_IS_EMPTY.DESC);
				return;
			}
			
			if("ios".equalsIgnoreCase(bean.getChannel())){
				bean.setChannel("IOS");
			} else {
				if(StringUtil.isEmpty(bean.getChannel())){
					bean.setChannel("");
				}
			}
			
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				int ret = JdbcSqlMapping.executeUpdate("mob_proj_join", bean, null, jcn);
				if (ret == 0) {
					bean.setErrJson(bean.getStatus(), bean.getMessage());
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "参与合买失败");
					BeanLogUtil.logger("参与合买失败", bean, logger);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("TradeBeanStub::join ", e);
				BeanLogUtil.logger("参与合买异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void iosJoinQuery(TradeBean bean, ServiceContext context) {
		if(!StringUtil.isEmpty(bean.getSessionid())){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("ios_qbuy", bean, null, jcn);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					String gameid = jrs.get("ios_gameid");
					String projid = jrs.get("ios_projid");
					int buynum = jrs.getInt("ios_buynum");
					bean.setPlanNo(gameid + "_" + projid);
					bean.setPart(buynum);
					bean.setStatus(Status.SUCCESS.CODE);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("TradeBeanStub::iosJoinQuery ", e);
				BeanLogUtil.logger("IOS参与合买查询异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	public void iosJoinResult(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getSessionid())){
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "参数丢失");
		} else {
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("ios_qbuy", bean, null, jcn);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					int state = jrs.getInt("ios_istate");
					double time = Double.parseDouble(jrs.get("ctime"));
					if(time <= 0 || state != 0){
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "认购已过期");
					} else {
						String user = jrs.get("ios_user");
						String gameid = jrs.get("ios_gameid");
						String projid = jrs.get("ios_projid");
						int buynum = jrs.getInt("ios_buynum");
						
						bean.setUser(user);
						JdbcRecordSet ujrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
						if(ujrs != null && ujrs.size() > 0 && ujrs.first()){
							String password = ujrs.get("cpassword");
							bean.setPassword(password);
							bean.setType(gameid);
							bean.setPlanNo(projid);
							bean.setPart(buynum);
							bean.setChannel("");
							
							int ret = JdbcSqlMapping.executeUpdate("mob_proj_join", bean, null, jcn);
							if (ret == 0) {
								bean.setErrJson(bean.getStatus(), bean.getMessage());
								if(Status.SUCCESS.CODE.equals(bean.getStatus())){
									JdbcSqlMapping.executeUpdate("mob_iso_buy", bean, null, jcn);
								}
							} else {
								bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "参与合买失败");
								BeanLogUtil.logger("参与合买失败", bean, logger);
							}
						} else {
							bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "用户信息丢失");
						}
					}
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "无效参数");
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("TradeBeanStub::iosJoinQuery ", e);
				BeanLogUtil.logger("IOS参与合买查询异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void iosOrderQuery(TradeBean bean, ServiceContext context) {
		if(!StringUtil.isEmpty(bean.getSessionid())){
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("ios_qcast", bean, null, jcn);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					String gameid = jrs.get("ios_gameid");
					String term = jrs.get("ios_term");
					String codes = jrs.get("ios_codes");
					int money = jrs.getInt("ios_money");
					int multiple = jrs.getInt("ios_multiple");
					int oneMoney = jrs.getInt("ios_onemoney");
					int chaseMoney = jrs.getInt("ios_chasemoney");
					int num = jrs.getInt("ios_num");
					int autocancel = jrs.getInt("ios_autocancel");	
					int addtional = jrs.getInt("ios_addtional");
					
					int tnum = jrs.getInt("ios_inums");
					String name = jrs.get("ios_name");
					String desc = jrs.get("ios_desc");
					int dfPlayType = jrs.getInt("ios_iplay");
					int projectType = jrs.getInt("ios_itype");
					int fflag = jrs.getInt("ios_ifile");
					int bnum = jrs.getInt("ios_ionum");
					int pnum = jrs.getInt("ios_ipnum");
					int oflag = jrs.getInt("ios_iopen");
					int wrate = jrs.getInt("ios_iwrate");
					
					if(chaseMoney == 0){
						num = 1;
					}
					
					bean.setType(gameid);
					bean.setTerm(term);
					bean.setCodes(codes);
					bean.setMoney(money);
					bean.setMultiple(multiple);
					bean.setOneMoney(oneMoney);
					bean.setChaseMoney(chaseMoney);
					bean.setNum(num);
					bean.setAutocancel(autocancel);
					bean.setAddtional(addtional);
					
					bean.setTnum(tnum);
					bean.setName(name);
					bean.setDesc(desc);
					bean.setDfPlayType(dfPlayType);
					bean.setProjectType(projectType);
					bean.setFflag(fflag);
					bean.setBnum(bnum);
					bean.setPnum(pnum);
					bean.setOflag(oflag);
					bean.setWrate(wrate);
					
					
					bean.setStatus(Status.SUCCESS.CODE);
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("TradeBeanStub::iosJoinQuery ", e);
				BeanLogUtil.logger("IOS参与方案查询异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	public void iosOrderResult(TradeBean bean, ServiceContext context) {
		if(StringUtil.isEmpty(bean.getSessionid())){
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "参数丢失");
		} else {
			JdbcConnect jcn = null;
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("ios_qcast", bean, null, jcn);
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					int state = jrs.getInt("ios_istate");
					double time = Double.parseDouble(jrs.get("ctime"));
					if(time <= 0 || state != 0){
						bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "购买已过期");
					} else {
						String user = jrs.get("ios_user");
						String gameid = jrs.get("ios_gameid");
						String term = jrs.get("ios_term");
						String codes = jrs.get("ios_codes");
						int money = jrs.getInt("ios_money");
						int multiple = jrs.getInt("ios_multiple");
						int oneMoney = jrs.getInt("ios_onemoney");
						int chaseMoney = jrs.getInt("ios_chasemoney");
						int num = jrs.getInt("ios_num");
						int autocancel = jrs.getInt("ios_autocancel");	
						int addtional = jrs.getInt("ios_addtional");	
						
						int tnum = jrs.getInt("ios_inums");
						String name = jrs.get("ios_name");
						String desc = jrs.get("ios_desc");
						int dfPlayType = jrs.getInt("ios_iplay");
						int projectType = jrs.getInt("ios_itype");
						int fflag = jrs.getInt("ios_ifile");
						int bnum = jrs.getInt("ios_ionum");
						int pnum = jrs.getInt("ios_ipnum");
						int oflag = jrs.getInt("ios_iopen");
						int wrate = jrs.getInt("ios_iwrate");
						
						bean.setUser(user);
						JdbcRecordSet ujrs = JdbcSqlMapping.executeQuery("mob_userinfo", bean, null, jcn);
						if(ujrs != null && ujrs.size() > 0 && ujrs.first()){
							String password = ujrs.get("cpassword");
							bean.setPassword(password);
							bean.setType(gameid);
							bean.setTerm(term);
							bean.setCodes(codes);
							bean.setMoney(money);
							bean.setMultiple(multiple);
							bean.setOneMoney(oneMoney);
							bean.setChaseMoney(chaseMoney);
							bean.setNum(num);
							bean.setAutocancel(autocancel);
							bean.setAddtional(addtional);
							
							bean.setTnum(tnum);
							bean.setName(name);
							bean.setDesc(desc);
							bean.setDfPlayType(dfPlayType);
							bean.setProjectType(projectType);
							bean.setFflag(fflag);
							bean.setBnum(bnum);
							bean.setPnum(pnum);
							bean.setOflag(oflag);
							bean.setWrate(wrate);
							
							bean.setSource(888);
							castNew(bean, context);
							if(Status.SUCCESS.CODE.equals(bean.getStatus())){
								JdbcSqlMapping.executeUpdate("mob_iso_cast", bean, null, jcn);
							}
						} else {
							bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "用户信息丢失");
						}
					}
				} else {
					bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + "无效参数");
				}
			} catch (Exception e) {
				bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
				logger.error("TradeBeanStub::iosOrderResult ", e);
				BeanLogUtil.logger("IOS发起方案异常", bean, logger);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}
	
	
	//奖金优化
	//140901001=3,140901003=1,140901005=0,140902002=0
	public void optimize(TradeBean bean, ServiceContext context) {
		try {
			String playtype = bean.getPlaytype();//玩法
			String codes = bean.getCodes();
			codes = StringUtil.replaceString(codes, " ", "+");
			String xml = OptimizeUtil.fetchOptimizor(playtype).optimize(codes, bean.getTnum(),bean.getNum(),Integer.valueOf(bean.getType()),bean.getZid(),playtype,bean.getTerm());
			if (StringUtil.isEmpty(xml) ) {
				bean.setErrJson(Status.FAILURE.CODE, "优化失败， 投注金额不足！");
			} else {
				bean.setJson(xml);
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::optimize ", e);
			BeanLogUtil.logger("奖金优化出现异常", bean, logger);
		}
	}
	/**
	 * 获取遗漏数据
	 * @param bean
	 * @param context
	 */
	public void getMissData(TradeBean bean, ServiceContext context) {
		try {
			String playtype = GameUtil.getGameID(bean.getPlaytype());//玩法
			String filePath ="miss.xml";
			
			if(playtype.equals("01")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("03")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("07")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("50")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("51")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("52")){
				filePath = "yilou"+ File.separator+bean.getName();
			}else if(playtype.equals("53")){
				filePath = "yilou"+ File.separator+bean.getName();
			}
			String path = System.getProperty("DATA_HOME") + File.separator+"omi"+ File.separator+playtype+ File.separator+filePath;
			JSONObject xmlJSONObj = XML.toJSONObject(JXmlWapper.parse(new File(path)).toXmlString());
			if (StringUtil.isEmpty(xmlJSONObj.toString()) ) {
				bean.setErrJson(Status.FAILURE.CODE, "优化失败， 投注金额不足！");
			} else {
				bean.setJson(xmlJSONObj.toString());
			}
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::getMissData ", e);
			BeanLogUtil.logger("获取遗漏数据出现异常", bean, logger);
		}
	}
	/**
	 * 数字彩安彩种查询开奖信息
	 * @param bean
	 * @param context
	 */
	public void kaiJiangSZC(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String gid  = bean.getPlaytype();
			if(GameUtil.isSZC(gid)){
				JdbcRecordSet jrs = jcn.executeQuery("select * from (select * from tb_period where cgameid = ? and length(cawardcode) > 0 order by cperiodid desc) where rownum = 1", new Object[]{gid});
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					JSONObject obj = new JSONObject();
					obj.put("type", GameUtil.getGameName(gid));
					obj.put("name", GameUtil.getDYJGameName(gid));
					obj.put("termNo", jrs.get("cperiodid"));
					String date = jrs.get("cawardtime");
					obj.put("date", date.substring(0, 10));
					obj.put("result", jrs.get("cawardcode"));
					obj.put("prizepool", jrs.get("crealmoney"));
					obj.put("sale", jrs.get("crealsale"));
					obj.put("grades", jrs.get("cgradeinfo"));
					obj.put("nums", jrs.get("cgnuminfo"));
					obj.put("ver", "1");
					bean.setJson(obj.toString());
				}
			}
			logger.info(bean.toString());
		} catch (Exception e) {
			bean.setErrJson(Status.FAILURE.CODE, Status.FAILURE.DESC + e.getMessage());
			logger.error("TradeBeanStub::kaiJiangSZC ", e);
			BeanLogUtil.logger("查询开奖信息异常", bean, logger);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public static void main(String[] args) throws Exception{
		//{"total":24,"content":[
		//[131108,20,"英锦赛","弗利特伍","卡利斯尔",0,"2013-11-14 03:45:00.0","2013-11-14 03:30:00.0",
		//"708406","199","4806","4227","1420","92",
		//"2.0100,3.3800,3.3400","1.790,4.670,4.380"],
		//[131108,21,"世预附","墨西哥","新西兰",-2,"2013-11-14 04:30:00.0","2013-11-14 04:00:00.0",
		//"708073","364","4941","214","612","149",
		//"1.1700,6.5000,13.0800","2.300,3.900,3.230"]]}
		
		//String grade = "100000,1000,100,10,4,50,20000,200,20";
		//String nums = grade.replaceAll("\\d+", "0");
		
		//System.out.println(nums);
		
		//System.out.println("\u5bf9\u4e0d\u8d77\uff0c\u53d1\u8d77\u65f6\u95f4\u5df2\u622a\u6b62\uff01");
		long isale = 15L;
		System.out.println((isale & (1L << 3)) == 0L);
	}
}
