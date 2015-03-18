package com.caipiao.game.cacher.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.util.comparable.ComparableUtil;

public class CacheManager {
	public final static String XML_HEAD = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	private Logger logger = LoggerFactory.getLogger("cachemange");
	private ConcurrentHashMap<String, GameCacheor> maps = new ConcurrentHashMap<String, GameCacheor>();
	private ConcurrentHashMap<String, GetProject> pages = new ConcurrentHashMap<String, GetProject>();//方案缓存
	private ConcurrentHashMap<String,String> mapCacheAwardCode = new ConcurrentHashMap<String,String>();//缓存开奖号
	private ConcurrentHashMap<String,String> mapCacheAwardMoney = new ConcurrentHashMap<String,String>();//缓存开奖公告

	private List<HotProjectBean> lstHotProject = new ArrayList<HotProjectBean>();
	
	private String todayOpen = "";
	
	private String hotProjectUsers = "";//热门方案合买名人
	
	private static CacheManager pcm;
	
	private HashMap<String,Integer> mapsUnupload = new HashMap<String,Integer>();
	
	public static synchronized CacheManager getProjectCacheManager() {
		if (pcm == null) {
			pcm = new CacheManager();
		}
		return pcm;
	}
	private CacheManager() {
		maps = new ConcurrentHashMap<String, GameCacheor>();
	}
	public void putGameCachor(GameCacheor obj) {
		maps.put(obj.getGameID(), obj);
	}
	public GameCacheor getGameCachor(String key) {
		return maps.get(key);
	}
	
	public void putCacheAwardCode(String gid,String pid,String xml) {
		mapCacheAwardCode.put(gid + "_" + pid, xml);
	}
	public String getCacheAwardCode(String gid,String pid) {
		return mapCacheAwardCode.get(gid + "_" + pid);
	}
	public void removeCacheAwardCode(String gid,String pid) {
		mapCacheAwardCode.remove(gid + "_" + pid);
	}
	public void removeAllCacheAwardCode() {
		mapCacheAwardCode.clear();
	}
	
	public void putCacheAwardMoney(String gid,String pid,String xml) {
		mapCacheAwardMoney.put(gid + "_" + pid, xml);
	}
	public String getCacheAwardMoney(String gid,String pid) {
		return mapCacheAwardMoney.get(gid + "_" + pid);
	}
	public void removeCacheAwardMoney(String gid,String pid) {
		 mapCacheAwardMoney.remove(gid + "_" + pid);
	}
	public void removeAllCacheAwardMoney() {
		 mapCacheAwardMoney.clear();
	}
	
	public String getTodayOpen() {
		return this.todayOpen;
	}
	public void setTodayOpen(String openedXml) {
		this.todayOpen = openedXml;
	}
	public String getHotProjectUsers() {
		return hotProjectUsers;
	}
	public void setHotProjectUsers(String hotProjectUsers) {
		this.hotProjectUsers = hotProjectUsers;
	}
	
	public List<HotProjectBean> getHotProjectList() {
		return this.lstHotProject;
	}
	
	public void updateHotProjectByCache(String[] hotUsers, int sflag) {
		List<HotProjectBean> lst = new ArrayList<HotProjectBean>();
		Iterator<String> iterator = maps.keySet().iterator();
		while ( iterator.hasNext() ) {
			String gid = iterator.next();
			GameCacheor objCacheor = maps.get(gid);
			objCacheor.createHotProject(lst);
		}
		
		List<HotProjectBean> allList = new ArrayList<HotProjectBean>();// 全部
		List<HotProjectBean> fullList = new ArrayList<HotProjectBean>();// 已满员

		List<HotProjectBean> notopList = new ArrayList<HotProjectBean>();// 热门置顶(超过数量)
		List<HotProjectBean> noList = new ArrayList<HotProjectBean>();// 未置顶(超过数量)
		
		HashMap<String,Integer> tmp = new HashMap<String,Integer>();

		List<HotProjectSortBean> hslist = new ArrayList<HotProjectSortBean>();//所有的
		for (int i=0;i<lst.size();i++) {
			HotProjectSortBean hsb = new HotProjectSortBean();
			HotProjectBean hpb = lst.get(i);
			if(hpb.getState() == 2){
				fullList.add(hpb);
			}else{
				if(hpb.getOrder() > 0){
					hsb.setOrder(hpb.getOrder());
				}else{
					hsb.setOrder(0);
				}
				
				double pc = hpb.getJindu() + Math.floor(hpb.getPnum()*100.0/hpb.getNums());
				hsb.setTprocess(pc >=80 ? 80: pc);
				hsb.setRprocess(pc);
				hsb.setMoney(hpb.getMoney());
				hsb.setProcess(hpb.getJindu());
				hsb.setIndex(i);
				hslist.add(hsb);
			}
		}
		ComparableUtil.sort(hslist, "order desc,tprocess desc,money desc,rprocess desc,process desc");
		
		for(int i = 0; i < hslist.size(); i++){
			int index = hslist.get(i).getIndex();
			HotProjectBean hpb = lst.get(index);
			String key = hpb.getGameID() + "_" + hpb.getNickID();
			if(tmp.get(key) == null){
				tmp.put(key, 1);
			}else{
				tmp.put(key, tmp.get(key) + 1);
			}
			if(tmp.get(key) <= 3){
				allList.add(hpb);
			}else{
				if(hpb.getOrder() > 0){
					hpb.setOrder(0);
					notopList.add(hpb);
				}else{
					noList.add(hpb);
				}
			}
		}

		allList.addAll(notopList);
		allList.addAll(noList);
		allList.addAll(fullList);
		
		saveWebHotProjToFile(allList,hotUsers,sflag);
		
		lstHotProject = allList;

		notopList.clear();
		notopList = null;
		fullList.clear();
		fullList = null;
		lst.clear() ;
		lst = null ;
		tmp.clear();
		tmp = null;
	}
	
	private void saveWebHotProjToFile(List<HotProjectBean> lst,String[] hotUsers,int sflag){
		HashMap<String, String> maps = new HashMap<String, String>();
//		maps.put("50", "");//超级大乐透
//		maps.put("51", "");//七星彩
//		maps.put("52", "");//排列五
//		maps.put("53", "");//排列三
//		maps.put("80", "");//胜负彩
//		maps.put("81", "");//任选9场
//		maps.put("82", "");//4场进球彩
//		maps.put("83", "");//6场半全场
//		maps.put("85", "");//足球单场-让球胜平负
//		maps.put("86", "");//足球单场-比分
//		maps.put("87", "");//足球单场-半全场
//		maps.put("88", "");//足球单场-上下单双
//		maps.put("89", "");//足球单场-总进球数
//		maps.put("90", "");//竞彩足球-让球胜平负
//		maps.put("91", "");//竞彩足球-比分
//		maps.put("92", "");//竞彩足球-半全场
//		maps.put("93", "");//竞彩足球-总进球数
//		maps.put("94", "");//竞彩篮球-胜负
//		maps.put("95", "");//竞彩篮球-让分胜负
//		maps.put("96", "");//竞彩篮球-胜分差
//		maps.put("97", "");//竞彩篮球-大小分
		
		List<HotProjectBean> nlst = new ArrayList<HotProjectBean>();
		for(HotProjectBean hp : lst){
			if(!maps.containsKey(hp.getGameID())){
				nlst.add(hp);
			}
		}
		int ps = 30;
		int count = nlst.size();
		int tp = (count % ps == 0) ? (count / ps) : (count / ps + 1);
		
		String sdir = System.getProperty("DATA_HOME") + File.separator + "phot";
		File fdir = new File(sdir);
		if ( ! fdir.exists() ) {
			fdir.mkdirs();
		}

		int[] ret = new int[hotUsers.length];
		
		for (int pn=1;pn<=tp;pn++) {
			StringBuffer sb = new StringBuffer();
			sb.append(XML_HEAD);
			sb.append("<Resp ").append(JXmlUtil.createAttrXml("errcode", "0"));
			sb.append(JXmlUtil.createAttrXml("errdesc","成功")).append(">\r\n");
			sb.append("<recordcount ");
			sb.append(JXmlUtil.createAttrXml("records",count+""));
			sb.append(JXmlUtil.createAttrXml("pagesize",ps+""));
			sb.append(JXmlUtil.createAttrXml("eachnum",ps+""));
			sb.append(JXmlUtil.createAttrXml("tp",tp+"")).append("/>\r\n");
			
			int msize =  pn * ps > nlst.size() ? nlst.size() : pn * ps;
			for (int i=(pn-1)*ps;i<msize;i++) {
				HotProjectBean hpb = nlst.get(i);
				sb.append(hpb.toXmlString()).append("\r\n");
				
				//合买名人
				String uid = hpb.getNickID();
				int state = hpb.getState();
				for (int j=0;j<hotUsers.length;j++) {
					if (uid.equalsIgnoreCase(hotUsers[j])) {
						if (state == 1) {// 有方案未满员
							ret[j] = 2;
						} else {
							if ( ret[j] == 0 ) {
								ret[j] = 1;
							}
						}
					}
				}
				
				//汇总未上传的方案
				if ( hpb.getUpload() == 0) {
					Integer obj = this.mapsUnupload.get(hpb.getNickID());
					if ( obj != null ) {
						this.mapsUnupload.put(hpb.getNickID(), new Integer(obj.intValue()+1));
					} else {
						this.mapsUnupload.put(hpb.getNickID(), new Integer(1));
					}
				}
			}
			sb.append("</Resp>");
			
			if( sflag == 1 ) {
				FileUtil.saveFile(fdir, pn + ".xml", sb.toString(), "UTF-8");
			}
			sb = null ;
		}

		if ( sflag == 1 ) {
			StringBuffer sb1 = new StringBuffer();
			sb1.append(XML_HEAD);
			sb1.append("<Resp ").append(JXmlUtil.createAttrXml("errcode", "0"));
			sb1.append(JXmlUtil.createAttrXml("errdesc","成功")).append(">\r\n");
			for (int i = 0; i < hotUsers.length; i++) {
				sb1.append("<u ").append(JXmlUtil.createAttrXml("id", hotUsers[i]));
				sb1.append(" ").append(JXmlUtil.createAttrXml("f", ret[i] + ""));
				sb1.append("/>\r\n");
			}
			sb1.append("</Resp>");
			FileUtil.saveFile(fdir, "hotuser.xml", sb1.toString(), "UTF-8");
			sb1 = null ;
		}
	}
	
	public int getUnuploadNum(String uid) {
		Integer obj = this.mapsUnupload.get(uid);
		if ( obj != null ) {
			return obj.intValue();
		} else {
			return 0;
		}
	}
	
	public synchronized String select_page(GetProject bean){
		String key = bean.toSubKey();
		GetProject gp = null;
		if(key != null){
			logger.info(key);
			gp = pages.get(key);
		}
		String data = "";
		if(gp == null || gp.expired()){
			List<ComparatorBean> list = new ArrayList<ComparatorBean>();
			String [] games = StringUtil.splitter(bean.getGid(), ",");
			if(bean.getGid().equalsIgnoreCase("30")){//bjdc
				games = StringUtil.splitter("85,86,87,88,89,84", ",");
			}
			if(bean.getGid().equalsIgnoreCase("31")){//jczq
				games = StringUtil.splitter("90,91,92,93,70,72", ",");
			}
			if(bean.getGid().equalsIgnoreCase("32")){//jclq
				games = StringUtil.splitter("94,95,96,97,71", ",");
			}			
			logger.info("获取缓存的gameID : " + bean.getGid());
			for(int i = 0; i < games.length; i++){
				GameCacheor gc = getGameCachor(games[i]);
				logger.info(games[i]);
				if(gc != null){
					PeriodProjectCache ppc = gc.getPeriodCache(bean.getPid());
					if(ppc != null){
						String sortField = bean.getSort();
						JdbcRecordSet jrs = ppc.getRecords();
						if(jrs != null){
							if (CacheUtil.isExist(jrs.getFileds(), sortField)) {
								List<ComparatorBean> tlst = CacheUtil.getList(jrs, bean, games[i], ppc.isAllowBuy());
								if(tlst != null && tlst.size() > 0){
									list.addAll(tlst);
								}
							}
						}
					}
				}
			}
			
			logger.info("list.size = " + list.size());
			
//			ComparableUtil.sort(list, "state asc,money desc,jindu desc");
//			for(int i = 20; i < list.size(); i++){
//				ComparatorBean cb = list.get(i);
//				if(cb.getState() == 1){
//					cb.setState(2);
//				}else{
//					break;
//				}
//			}
			
			String sortkey = "";
			if("money".equals(bean.getSort())){
				if (bean.getSortending() != null && bean.getSortending().equalsIgnoreCase("descending")) {
					sortkey = "state asc,money desc";
				}else{
					sortkey = "state asc,money asc";
				}
			}else{
				if (bean.getSortending() != null && bean.getSortending().equalsIgnoreCase("descending")) {
					sortkey = "state asc,obj desc,money desc";
				}else{
					sortkey = "state asc,obj asc,money desc";
				}
			}
			ComparableUtil.sort(list, sortkey);
	
			int len = list.size();
			int pn = bean.getPageNo();
			int size = bean.getPageSize();
			int tp = len % size == 0 ? len / size : len / size + 1;
			int num = 0;
			if(len > pn * size){
				num = size;
			} else if(len > (pn - 1) * size && len < pn * size){
				num = len - pn * size;
			} else {
				num = 0;
			}
			
			StringBuffer sb = new StringBuffer();
			sb.append("<xml>\r\n");
			for(int i = (pn-1) * size; i < pn * size && i < len; i++){
				ComparatorBean cb = list.get(i);
				GameCacheor gc = getGameCachor(cb.getGid());
				if(gc != null){
					PeriodProjectCache ppc = gc.getPeriodCache(bean.getPid());
					if(ppc != null){
						sb.append(ppc.toXmlRecord(i, cb));
					}
				}
			}
			
			logger.info(sb.toString());

			list.clear();
			list = null;
			sb.append("<recordcount ");
			sb.append(JXmlUtil.createAttrXml("records", "" + len));
			sb.append(JXmlUtil.createAttrXml("pagesize", "" + size));
			sb.append(JXmlUtil.createAttrXml("eachnum", "" + num));
			sb.append(JXmlUtil.createAttrXml("tp", "" + tp));
			sb.append("/>\r\n");
			sb.append("</xml>\r\n");
			data = sb.toString();
			bean.setCacheData(data);
			if(key != null){
				pages.put(key, bean);
			}
			logger.info("来自一级缓存");
		}else{
			data = gp.getCacheData();
			logger.info("来自二级缓存");
		}
		return data;
	}
}