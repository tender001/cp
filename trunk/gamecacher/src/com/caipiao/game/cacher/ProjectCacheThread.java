package com.caipiao.game.cacher;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;

import com.caipiao.game.cacher.util.CacheManager;
import com.caipiao.game.cacher.util.CacheUtil;
import com.caipiao.game.cacher.util.FileUtil;
import com.caipiao.game.cacher.util.GameCacheor;
import com.caipiao.game.cacher.util.GameContains;
import com.caipiao.game.cacher.util.PeriodProjectCache;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.thread.RbcAbstractThread;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class ProjectCacheThread extends RbcAbstractThread {

	public final static String CACHE_LOGGER_KEY = "cache";
	private Logger logger = null;

	private Queue<PeriodProjectCache> pQueue = new ConcurrentLinkedQueue<PeriodProjectCache>();
	private CacheManager pmanager = CacheManager.getProjectCacheManager();
	private List<String> lstGame;

	private int isSetHotProject = 0;
	private int nodeID;// 缓存器编号

	private long lastTime = 0;
	private long lastLoadHotUser = 0;

	private HashMap<String, String[]> xMaps = new HashMap<String, String[]>();

	private HashMap<String, String> filesmaps = new HashMap<String, String>();

	private void putFilesmap(String key, String value) {
		filesmaps.put(key, value);
	}

	private boolean isChange(String key, String value) {
		if (filesmaps.containsKey(key)) {
			if (filesmaps.get(key).equalsIgnoreCase(value)) {
				return false;
			}
		}
		return true;
	}

	public void thread_init(JXmlWapper elmConfig) {
		logger = LoggerFactory.getLogger(CACHE_LOGGER_KEY);

		if (lstGame != null) {
			lstGame.clear();
			lstGame = null;
		}

		lstGame = new ArrayList<String>();
		isSetHotProject = elmConfig.getIntValue("@SetHotProject", 0);
		nodeID = elmConfig.getIntValue("@node");

		int count = elmConfig.countXmlNodes("cache");
		for (int i = 0; i < count; i++) {
			String id = elmConfig.getStringValue("cache[" + i + "].@id");
			pmanager.putGameCachor(new GameCacheor(id));
			lstGame.add(id);
		}
		
		File file = new File(System.getProperty("conf.dir") + "/hidden.properties");
		Properties prop = new Properties();
		try {
			prop.load(new InputStreamReader(new FileInputStream(file), "utf-8"));
			CacheUtil.HIDDENS = prop;
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("风雨陌路人---------->[" + prop.getProperty("风雨陌路人") + "]");
	}

	@Override
	public void thread_func() {

		long ls = System.currentTimeMillis();

		remove_old_data();
		JdbcConnect jcn = null;
		try {
			jcn = getJdbcPoolManager().getJdbcConnect();

			// 定时加载缓存的彩种热门发起人
			if (lastLoadHotUser < System.currentTimeMillis() - 1000 * 60 * 10) {// 10分钟
				for (int i = 0; i < lstGame.size(); i++) {
					String gid = lstGame.get(i);
					loadHotUser(gid, jcn);
				}

				loadHotUser("00", jcn);
				pmanager.setTodayOpen("");

				pmanager.removeAllCacheAwardCode();
				pmanager.removeAllCacheAwardMoney();
			}

			for (int i = 0; i < lstGame.size(); i++) {
				String gid = lstGame.get(i);
				GameCacheor obj = pmanager.getGameCachor(gid);
				if (obj.isNeedLoadCachedPeriod()) {
					obj.load_can_cached(jcn);
				} else {
					if (obj.haveFailurePeriod()) {
						obj.load_failure_period(jcn);
					}

					List<String> lst = obj.needUpdatePeriod();
					for (int j = 0; j < lst.size(); j++) {
						String pid = lst.get(j);
						PeriodProjectCache pOld = obj.loadNewCachePeriodData(pid, jcn);
						obj.updateHotUser(xMaps.get(gid));
						if (pOld != null) {
							pQueue.add(pOld);
						}
					}
					lst.clear();
				}
			}

			String [] mainHotUser = xMaps.get("00");
			if (mainHotUser == null || mainHotUser.length == 0) {
				mainHotUser = loadHotUser("00", jcn);
			}
			if (mainHotUser == null) {
				mainHotUser = new String[] { "" };
			}
			pmanager.updateHotProjectByCache(mainHotUser, isSetHotProject);

			checkCacheTask(jcn);// 检查缓存任务

			// 定期生成XML列表
			if (isSetHotProject == 1) {
				if (lastTime < System.currentTimeMillis() - 1000 * 60 * 2) {
					for (int i = 0; i < lstGame.size(); i++) {
						boolean bln = this.createCachePeriodListXml(lstGame.get(i), jcn);
						bln &= this.createSalePeriodListXml(lstGame.get(i), jcn);
						if (bln) {
							lastTime = System.currentTimeMillis();
						}
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
		logger.info("缓存线程完成 时长=" + (System.currentTimeMillis() - ls));
	}

	private String[] loadHotUser(String gid, JdbcConnect jcn) {
		Object[] ins = new Object[2];
		ins[0] = gid;
		ins[1] = 0;
		String[] ss = null;
		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_hot_user", null, ins, jcn);
		if (jrs != null && jrs.size() > 0) {
			jrs.first();
			String hotUsers = jrs.get("cnickid");
			ss = StringUtil.splitter(hotUsers, "|");
			xMaps.put(gid, ss);

			GameCacheor obj = pmanager.getGameCachor(gid);
			if (obj != null) {
				obj.updateHotUser(ss);
			} else {

			}
			jrs.clear();
			jrs = null;
		}
		return ss;
	}

	private void remove_old_data() {
		if (pQueue.size() > 0) {
			for (;;) {
				PeriodProjectCache pt = pQueue.poll();
				if (pt != null) {
					pt.destory();
					pt = null;
				}
				if (pQueue.size() == 0) {
					break;
				}
			}
		}
	}

	private void checkCacheTask(JdbcConnect jcn) {
		boolean bln = true;
		int f = 1 << nodeID;
		String sql = "select * from (select * from tb_cache_task where bitand(iflag," + f + ") = 0 order by itaskid) where rownum <= 1000 ";
		JdbcRecordSet jrs = jcn.executeQuery(sql);
		if (jrs != null && jrs.size() > 0) {
			while (jrs.next()) {
				String gid = jrs.get("cgameid");
				String pid = jrs.get("cperiodid");
				int type = jrs.getInt("itype");
				GameCacheor obj = pmanager.getGameCachor(gid);
				switch (type) {
				case 1: {// 期次设置为可销售
					if (obj != null) {
						PeriodProjectCache ppc = obj.getPeriodCache(pid);
						if (ppc != null) {
							ppc.setAllowBuy(1);
						} else {
							obj.loadNewCachePeriodData(pid, jcn);
						}
						logger.info("游戏=" + gid + " 期次=" + pid + "\t [缓存任务] [可销售] " + type + " 成功");

						// 生成c.xml 和 s.xml
						if (isSetHotProject == 1) {
							bln &= createCachePeriodListXml(gid, jcn);
							bln &= createSalePeriodListXml(gid, jcn);
						}
					}
					break;
				}
				case 2: {// 期次设置为不缓存
					if (obj != null) {
						PeriodProjectCache pOld = obj.getPeriodCache(pid);
						obj.removePeriodProjectCache(pid);
						if (pOld != null) {
							pQueue.add(pOld);
						}
						logger.info("游戏=" + gid + " 期次=" + pid + "\t [缓存任务] [不缓存] " + type + " 成功");

						// 生成c.xml 和 s.xml
						if (isSetHotProject == 1) {
							bln &= createCachePeriodListXml(gid, jcn);
							bln &= createSalePeriodListXml(gid, jcn);
						}
					}
					break;
				}
				case 3: {// 重新加载方案列表
					if (obj != null) {
						PeriodProjectCache pOld = obj.loadNewCachePeriodData(pid, jcn);
						if (pOld != null) {
							pQueue.add(pOld);
						}
						logger.info("游戏=" + gid + " 期次=" + pid + "\t [缓存任务] [重加载] " + type + " 成功");
					}
					break;
				}
				case 4: {// 更新对阵
					break;
				}
				case 5: {// 更新缓存期次列表
					logger.info("更新缓存期次列表   游戏=" + gid + " 期次=" + pid);

					// 生成c.xml 和 s.xml
					if (isSetHotProject == 1) {
						bln &= createCachePeriodListXml(gid, jcn);
						bln &= createSalePeriodListXml(gid, jcn);
					}
					break;
				}
				case 6: {
					break;
				}
				default: {
					break;
				}
				}
				if (bln) {
					sql = "update tb_cache_task set cfinishdate = sysdate, iflag = bitor(iflag," + f + ") where itaskid = " + jrs.get("itaskid");
					jcn.executeUpdate(sql);
				}
			}
			jrs.clear();
			jrs = null;
		}
	}

	private boolean createCachePeriodListXml(String gid, JdbcConnect jcn) {
		boolean bln = true;
		Object[] ins = new Object[1];
		ins[0] = gid;
		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_cache_list", null, ins, jcn);
		if (jrs != null && jrs.size() > 0) {
			String xml = jrs.toRawXmlString("row");

			StringBuffer sb = new StringBuffer();
			sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			sb.append("<period desc=\"查询成功\" code=\"0\">");
			sb.append(xml);
			sb.append("</period>");

			try {
				File fdir = new File(System.getProperty("DATA_HOME") + File.separator + "game" +File.separator+ gid);
				if (!fdir.exists()) {
					fdir.mkdirs();
				}
				if (isChange(fdir.getAbsolutePath() + "c.xml", sb.toString())) {
					FileUtil.saveFile(fdir, "c.xml", sb.toString(), "UTF-8");
					putFilesmap(fdir.getAbsolutePath() + "c.xml", sb.toString());
				}
			} catch (Exception e) {
				e.printStackTrace();
				bln = false;
			}
			sb = null;
			jrs.clear();
			jrs = null;
		} else {
			bln = false;
		}
		return bln;
	}

	private boolean createSalePeriodListXml(String gid, JdbcConnect jcn) {
		boolean bln = true;
		Object[] ins = new Object[1];
		ins[0] = gid;
		String sql = "c_sale_list";
		if(GameContains.isKP(gid)){
			sql = "c_kp_sale_list";
		}
		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(sql, null, ins, jcn);
		if (jrs != null && jrs.size() > 0) {
			String xml = "";
			if("50".equals(gid)){
				StringBuffer sb = new StringBuffer();
				String [] fields = jrs.getFileds();
				for(int i = 0; i < jrs.size(); i++){
					String pid= jrs.get("pid", i);
					if(pid.equals("2013074") || pid.equals("2013077") || pid.equals("2013080") || pid.equals("2013083")){
						continue;
					}
					sb.append("<row ");
					for(int j = 0; j < fields.length;j++){
						sb.append(JXmlUtil.createAttrXml(fields[j], jrs.get(fields[j], i)));
					}
					sb.append(" />");
				}
				xml = sb.toString();
			}else{
				xml = jrs.toRawXmlString("row");
			}

			StringBuffer sb = new StringBuffer();
			sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			sb.append("<period desc=\"查询成功\" code=\"0\">");
			sb.append(xml);
			sb.append("</period>");

			try {
				File fdir = new File(System.getProperty("DATA_HOME") + File.separator + "game" + File.separator + gid);
				if (!fdir.exists()) {
					fdir.mkdirs();
				}
				if (isChange(fdir.getAbsolutePath() + "s.xml", sb.toString())) {
					FileUtil.saveFile(fdir, "s.xml", sb.toString(), "UTF-8");
					putFilesmap(fdir.getAbsolutePath() + "s.xml", sb.toString());
				}
			} catch (Exception e) {
				e.printStackTrace();
				bln = false;
			}
			sb = null;
			jrs.clear();
			jrs = null;
		} else {
			bln = false;
		}
		return bln;
	}
}