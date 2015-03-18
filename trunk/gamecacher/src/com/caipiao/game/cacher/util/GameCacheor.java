package com.caipiao.game.cacher.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.caipiao.game.cacher.ProjectCacheThread;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;

public class GameCacheor {
	private final static String JC_PERIOD = "JC_PERIOD";
	private final static String BASKET_PERIOD = "BASKET_PERIOD";
	private ConcurrentHashMap<String, PeriodProjectCache> maps = new ConcurrentHashMap<String, PeriodProjectCache>();
	private List<String> lstFailure = new ArrayList<String>();

	private String gameID;
	private Logger logger = LoggerFactory.getLogger(ProjectCacheThread.CACHE_LOGGER_KEY);

	private String[] hotUsers = null ;
	private long isJc = 0 ;
	
	public GameCacheor(String gid) {
		gameID = gid;
		if (GameContains.isFootball(gameID)) {
			isJc |= 0xFL << 0 ;
		} else if(GameContains.isBasket(gameID)){
			isJc |= 0xFL << 4 ;
		}
	}

	public String getGameID() {
		return gameID;
	}

	public PeriodProjectCache getPeriodCache(String periodID) {
		return maps.get(getRealPeriodID(periodID));
	}

	public void putPeriodProjectCache(String periodID, PeriodProjectCache ppc) {
		this.maps.put(getRealPeriodID(periodID), ppc);
	}

	/**
	 * 加载缓存期次列表
	 * 
	 * @param jcn
	 */
	public void load_can_cached(JdbcConnect jcn) {
		if ( !isJinCai() ){
			try {
				Object[] ins = new Object[1];
				ins[0] = gameID;
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_cache_list", null, ins, jcn);
				if (jrs != null && jrs.size() > 0) {
					while (jrs.next()) {
						loadNewCachePeriodData(jrs.get("pid"), jcn);
					}
					jrs.clear();
					jrs = null;
				}
			} catch (Exception e) {
				logger.error("异常 >>> 执行缓存查询期次  c_cache_list 异常", e);
			}
		} else {
			if ( Long.bitCount(isJc & 0xFL) == 4) {
				loadNewCachePeriodData(JC_PERIOD,jcn);
			}else if ( Long.bitCount(isJc & (0xFL << 4)) == 4) {
				loadNewCachePeriodData(BASKET_PERIOD,jcn);
			}
		}
		
	}

	/**
	 * 加载新的期次数据
	 * 
	 * @param periodID
	 * @param jcn
	 * @return
	 */
	public PeriodProjectCache loadNewCachePeriodData(String periodID, JdbcConnect jcn) {
		PeriodProjectCache pOld = null;
		HashMap<String, String> mapParm = new HashMap<String, String>();
		mapParm.put("gameid", gameID);

		if ( Long.bitCount(isJc & 0xFL) == 4) {// JC
			Object[] ins = new Object[0];
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_jc_projct_list", mapParm, ins, jcn);
			if (jrs != null) {
				PeriodProjectCache ppc = new PeriodProjectCache();
				ppc.setGameID(gameID);
				ppc.setPeriodID(JC_PERIOD);
				ppc.setRecords(jrs);
				ppc.setAllowBuy(0);
	
				pOld = maps.remove(JC_PERIOD);
				putPeriodProjectCache(JC_PERIOD, ppc);
			} else {
				logger.error("数据 >>> 竞彩 数据库中无缓存数据 游戏=" + gameID + " 期次=" + JC_PERIOD);
				putFailure(JC_PERIOD);
			}
			ins = null;
		}else if ( Long.bitCount(isJc & (0xFL << 4)) == 4) {// LQ
			Object[] ins = new Object[0];
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_basket_projct_list", mapParm, ins, jcn);
			if (jrs != null) {
				PeriodProjectCache ppc = new PeriodProjectCache();
				ppc.setGameID(gameID);
				ppc.setPeriodID(BASKET_PERIOD);
				ppc.setRecords(jrs);
				ppc.setAllowBuy(0);
	
				pOld = maps.remove(BASKET_PERIOD);
				putPeriodProjectCache(BASKET_PERIOD, ppc);
			} else {
				logger.error("数据 >>> 竞彩 数据库中无缓存数据 游戏=" + gameID + " 期次=" + BASKET_PERIOD);
				putFailure(BASKET_PERIOD);
			}
			ins = null;
		} else {
			Object[] ins = new Object[1];
			ins[0] = periodID;
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_projct_list", mapParm, ins, jcn);
			if (jrs != null) {
				PeriodProjectCache ppc = new PeriodProjectCache();
				ppc.setGameID(gameID);
				ppc.setPeriodID(periodID);
				ppc.setRecords(jrs);
				grepAllowBuyFromDB(gameID, periodID, jcn, ppc);
	
				pOld = maps.remove(periodID);
				putPeriodProjectCache(periodID, ppc);
			} else {
				logger.error("数据 >>> 数据库中无缓存数据 游戏=" + gameID + " 期次=" + periodID);
				putFailure(periodID);
			}
			ins = null;
		}
		mapParm.clear();
		mapParm = null;

		return pOld;
	}

	/**
	 * 查询期次状态 是否在销售
	 * 
	 * @param gameID
	 * @param periodID
	 * @param jcn
	 * @return
	 */
	private void grepAllowBuyFromDB(String gameID, String periodID, JdbcConnect jcn, PeriodProjectCache ppc) {
		if ( !isJinCai() ) {
			try {
				Object[] ins = new Object[2];
				ins[0] = gameID;
				ins[1] = periodID;
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_period_xstate", null, ins, jcn);
				if (jrs != null && jrs.size() > 0) {
					jrs.first();
					int rc = jrs.getInt("istate");
					if ( rc > 3) {
						ppc.setAllowBuy(-1);
					}else{
						ppc.setAllowBuy(jrs.getLong("xnum"));
					}
					jrs.clear();
					jrs = null;
				}
			} catch (Exception e) {
				logger.error("异常 >>> c_period_state 方法 获取过程中发生异常", e);
			}
		}
	}

	public boolean haveFailurePeriod() {
		return !this.lstFailure.isEmpty();
	}

	public void load_failure_period(JdbcConnect jcn) {
		List<String> lst = new ArrayList<String>();
		while (!lstFailure.isEmpty()) {
			lst.add(lstFailure.remove(0));
		}

		while (!lst.isEmpty()) {
			String pid = lst.remove(0);
			PeriodProjectCache pold = loadNewCachePeriodData(pid, jcn);
			if (pold != null) {
				pold.destory();
			}
		}
	}

	public boolean isNeedLoadCachedPeriod() {
		return maps.isEmpty();
	}

	public void removePeriodProjectCache(String periodID) {
		maps.remove(periodID);
	}

	public List<String> needUpdatePeriod() {
		List<String> lst = new ArrayList<String>();

		Iterator<String> iterator = maps.keySet().iterator();
		while (iterator.hasNext()) {
			String periodID = iterator.next();
			PeriodProjectCache ppc = maps.get(periodID);
			if (ppc != null && ppc.isAllowBuy()) {
				if (ppc.getLastUpdateTime() < (System.currentTimeMillis() - 5 * 1000)) {
					lst.add(periodID);
				}
			}
		}
		return lst;
	}

	public void putFailure(String periodID) {
		if (!lstFailure.contains(periodID)) {
			lstFailure.add(periodID);
		}
	}

	public void updateHotUser(String[] ss1) {
		if ( ss1 != null ) {
			hotUsers = ss1 ;
		}
		
		Iterator<String> iterator = maps.keySet().iterator();
		while (iterator.hasNext()) {
			String pid = iterator.next();
			PeriodProjectCache ppc = maps.get(pid);
			if (ppc != null) {
				if(ppc.isCurrent()){
					ppc.checkHotUserFlag(hotUsers);
				}
			}
		}
	}
	
	private String getRealPeriodID(String pid) {
		if(Long.bitCount(isJc & 0xFL) == 4){//JC
			return JC_PERIOD;
		}else if ( Long.bitCount(isJc & (0xFL << 4)) == 4) {// LQ
			return BASKET_PERIOD;
		} else {
			return pid;
		}
	}
	
	public boolean isJinCai() {
		return Long.bitCount(isJc) > 0;
	}
	
	public void createHotProject(List<HotProjectBean> lst) {
		Iterator<String> iterator = maps.keySet().iterator();
		while ( iterator.hasNext() ) {
			String pid = iterator.next();
			PeriodProjectCache ppc = maps.get(pid);
			if ( isJinCai() || ppc.isAllowBuy()) {
				ppc.createHotProject(lst);
			}
		}
	}
}