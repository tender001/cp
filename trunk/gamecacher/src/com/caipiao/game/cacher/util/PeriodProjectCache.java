package com.caipiao.game.cacher.util;

import java.io.File;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.util.xml.JXmlUtil;

public class PeriodProjectCache {
	private String gameID;
	private String periodID;
	private long allowBuy=-1;

	private String hotUserXml;// 合买名人
	private ConcurrentHashMap<Integer, String> mapHotUser = new ConcurrentHashMap<Integer, String>();

	private JdbcRecordSet records;
	private long lastUpdateTime = 0;

	public PeriodProjectCache() {
		lastUpdateTime = System.currentTimeMillis();
	}

	public long getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(long lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
	}

	public void setRecords(JdbcRecordSet records) {
		if (this.records != null) {
			this.records.clear();
			this.records = null;
		}
		this.records = records;
	}
	
	public JdbcRecordSet getRecords(){
		return this.records;
	}

	public boolean isAllowBuy() {
		return allowBuy >= 0;
	}
	
	public boolean isCurrent(){
		return allowBuy == 0;
	}

	public void setAllowBuy(long allowBuy) {
		this.allowBuy = allowBuy;
	}

	public String getGameID() {
		return gameID;
	}

	public void setGameID(String gameID) {
		this.gameID = gameID;
	}

	public String getPeriodID() {
		return periodID;
	}

	public void setPeriodID(String periodID) {
		this.periodID = periodID;
	}
	
	public String toXmlRecord(int no, ComparatorBean cb) {
		JdbcRecordSet jrs = records;
		String[] flds = jrs.getFileds();
		StringBuffer sb = new StringBuffer();
		sb.append("<row ");
		sb.append(JXmlUtil.createAttrXml("nid", "" + no));
		sb.append(JXmlUtil.createAttrXml("gid", "" + this.gameID));//added by siva 2013.12.10
		List<String> values = cb.getValues();
		for (int j = 0; j < flds.length; j++) {
			if ( flds[j].equalsIgnoreCase("iorder") ) {
				int order = 0;
				if(cb.getState() == 1){
					order = 1;
				}
				sb.append(JXmlUtil.createAttrXml(flds[j], "" + order));
			} else if("cnickid".equals(flds[j])){
				sb.append(JXmlUtil.createAttrXml(flds[j], CacheUtil.isHiddenUser(values.get(j))));
			}else{
				sb.append(JXmlUtil.createAttrXml(flds[j], values.get(j)));
			}
		}
		sb.append("/>\r\n");
		return sb.toString();
	}

	/**
	 * 检查用户是否有方案
	 * 
	 * @param hotUsers
	 * @return
	 */
	public int[] checkHotUserFlag(String[] hotUsers) {
		if (hotUsers == null) {
			return null;
		}
		JdbcRecordSet jrs = records;
		int[] ret = new int[hotUsers.length];

		if (jrs != null) {
			for (int j = 0; j < hotUsers.length; j++) {
				int [] p = new int[]{0, 0};
				for (int i = 0; i < jrs.size(); i++) {
					String uid = jrs.get("cnickid", i);
					int state = jrs.getInt("istate", i);
					int type = jrs.getInt("itype", i);
					if (type == 1) {// 是合买
						if (uid.equalsIgnoreCase(hotUsers[j])) {
							if (state == 1) {// 有方案未满员
								p[1] += 1;
							} else {
								p[0] += 1;
							}
						}
					}
				}
				if(p[1] > 0){
					ret[j] = 2;//认购中
				}else if(p[0] > 0){
					ret[j] = 1;//满员
				}
				p = null;
			}
		}

		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < hotUsers.length; i++) {
			sb.append("<u ").append(JXmlUtil.createAttrXml("id", hotUsers[i]));
			sb.append(" ").append(JXmlUtil.createAttrXml("f", ret[i] + ""));
			sb.append("/>\r\n");
		}

		this.hotUserXml = new String(sb);
		
		String sdir = "/opt/export/cpdata/phot/" + gameID;
		File fdir = new File(sdir);
		if ( ! fdir.exists() ) {
			fdir.mkdirs();
		}
		
		if (CacheUtil.isChange(sdir+"/hotuser.xml", this.hotUserXml)) {
			try {
				FileUtil.saveFile(sdir, "hotuser.xml", this.hotUserXml, "UTF-8", null);
				CacheUtil.putCache(sdir+"/hotuser.xml", this.hotUserXml);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return ret;
	}

	public String getHotUserXml() {
		return this.hotUserXml;
	}

	public synchronized void destory() {
		if (mapHotUser != null) {
			Iterator<Integer> iterator = mapHotUser.keySet().iterator();
			while (iterator.hasNext()) {
				Object key = iterator.next();
				@SuppressWarnings("unused")
				String ss = mapHotUser.remove(key);
				ss = null;
			}
			mapHotUser.clear();
			mapHotUser = null;
		}

		if (records != null) {
			records.clear();
			records = null;
		}
	}

	public void createHotProject(List<HotProjectBean> lst) {
		// select cprojid ,cnickid ,cname name,iviews views,itmoney
		// money,ismoney smoney,inums nums,ipnum pnum,
		// ilnum lnum,ijindu jindu,iaunum aunum,iagnum agnum,iorder,istate
		// ,iupload,iwrate,iplay,itype,
		// iopen from tb_proj_#gameid# where cperiodid = ?
		if (this.records != null && this.records.size() > 0) {
			int size = this.records.size();
			for (int i = 0; i < size; i++) {
				records.move(i);
				int state = records.getInt("istate");
				int type = records.getInt("itype");
				int money = records.getInt("money");
				if (type == 1 && state <= 2 && money >= 10) {
					HotProjectBean hpb = new HotProjectBean();
					hpb.setGameID(this.gameID);
					hpb.setPeriodID(periodID);
					hpb.setNickID(records.get("cnickid"));
					hpb.setProjID(records.get("cprojid"));
					hpb.setAgnum(records.getInt("agnum"));
					hpb.setAunum(records.getInt("aunum"));
					hpb.setJindu(records.getInt("jindu"));
					hpb.setLnum(records.getInt("lnum"));
					hpb.setMoney(records.getInt("money"));
					hpb.setNums(records.getInt("nums"));
					hpb.setOrder(records.getInt("iorder"));
					hpb.setPlay(records.get("iplay"));
					hpb.setPnum(records.getInt("pnum"));
					hpb.setUpload(records.getInt("iupload"));
					hpb.setOpen(records.getInt("iopen"));
					hpb.setWrate(records.getInt("iwrate"));
					hpb.setState(records.getInt("istate"));
					hpb.setSaleState(this.allowBuy);

					// 判断自动置顶
					if (hpb.getOrder() == 0 ) {
						hpb.setOrder(CacheUtil.createHotProjOrders(gameID, hpb.getMoney(),hpb.getNums(),hpb.getLnum(),hpb.getPnum(), hpb.getState()));
					}
					
					int itype = records.getInt("itype");
					
					if(CacheUtil.isHiddenUser(hpb.getNickID()) != null){
						lst.add(hpb);
					} else {
						if(itype == 0 && hpb.getMoney() >= 10000){
							//代购 金额大于10000不显示
						} else {
							lst.add(hpb);
						}
					}
				}
			}
		}
	}
}