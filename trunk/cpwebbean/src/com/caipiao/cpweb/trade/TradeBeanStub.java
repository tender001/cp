package com.caipiao.cpweb.trade;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import org.json.JSONObject;
import org.json.XML;

import com.caipiao.cpweb.trade.jjyh.JinCalOptimizeUtil;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.trade.util.CountCodeUtil;
import com.caipiao.cpweb.trade.util.FileCastCodeUtil;
import com.caipiao.cpweb.trade.util.JinCaiYueHua;
import com.caipiao.game.cacher.match.MatchCacheManager;
import com.caipiao.game.cacher.util.CacheManager;
import com.caipiao.game.cacher.util.FileUtil;
import com.caipiao.game.cacher.util.GameContains;
import com.caipiao.game.cacher.util.GetProject;
import com.caipiao.game.cacher.util.HotProjectBean;
import com.caipiao.plugin.GamePlugin_50;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.GameCastMethodDef;
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

public class TradeBeanStub {

	private Logger logger;
	private final static String BASE_PATH = System.getProperty("DATA_HOME") + File.separator + "pupload";// 正式环境
	static HashMap<String, String> big = new HashMap<String, String>();
	
	private MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
	
	static {
		// 单注大额方案
		big.put("80", "80");
		big.put("81", "81");
		
		//北单
		big.put("85", "85");
		big.put("86", "86");
		big.put("87", "87");
		big.put("88", "88");
		big.put("89", "89");
		big.put("84", "84");
	}

	public TradeBeanStub() {
		logger = LoggerFactory.getLogger("trade");
	}

	
	
	public void tradeMain(TradeBean bean, ServiceContext context) {
		String fid = bean.getFid();
		if ( fid.equalsIgnoreCase("jcast") ) {//竞彩北单发起方案
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("mcast") ) {//竞彩名次发起方案
			mcproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("pcast") ) {//发起方案
			proj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("ps") ) {//方案列表
			queryProjectList(bean,context);
		} else if ( fid.equalsIgnoreCase("join") ) {//参与方案
			proj_join(bean,context);
		} else if ( fid.equalsIgnoreCase("pupload") ) {//上传方案号码
			proj_upload(bean,context);
		} else if ( fid.equalsIgnoreCase("pcl") ) {//发起人撤单
			proj_cancel(bean,context);
		} else if ( fid.equalsIgnoreCase("bd") ) {//发起人事后保底
			proj_shbd(bean,context);
		} else if ( fid.equalsIgnoreCase("b2g") ) {//保底转认购
			proj_b2g(bean,context);
		} else if ( fid.equalsIgnoreCase("pinfo") ) {//查询方案信息
			queryProjectInfo(bean,context);
		} else if ( fid.equalsIgnoreCase("ai") ) {//中奖明细
			awarddetail(bean,context);
		} else if ( fid.equalsIgnoreCase("hs") ) {//热门方案列表
			queryHotProject(bean,context);
		} else if ( fid.equalsIgnoreCase("jlist") ) {//查询方案合买信息
			queryJoinList(bean,context);
		} else if ( fid.equalsIgnoreCase("code") ) {//查询开奖号码
			queryAwardCode(bean,context);
		} else if ( fid.equalsIgnoreCase("jcl") ) {//认购撤销
			join_cancel(bean,context);
		} else if ( fid.equalsIgnoreCase("zcast") ) {//发起追号
			cast_zhuihao(bean,context);
		} else if ( fid.equalsIgnoreCase("zcl") ) {//追号撤销
			cancel_zhuihao(bean,context);
		} else if ( fid.equalsIgnoreCase("q") ) {//查询类
			tquery(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		} else if ( fid.equalsIgnoreCase("") ) {
			jproj_cast(bean,context);
		}
	}
	
	/**
	 * 竞彩名次（冠军）发起方案
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void mcproj_cast(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String gid = bean.getGid();
			
			if(!gid.equals("98") || !gid.equals("99")){
				bean.setBusiErrCode(TradeErrCode.ERR_CHECK);
				bean.setBusiErrDesc("该接口仅供竞彩名次玩法投注使用！");
			}

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
			String matches = "";
			bean.check(TradeBean.CAST_HM);
			
			System.out.println("---------------------------");
			
			if (bean.getBusiErrCode() == 0) {
				String codes = bean.getCodes();
				if (bean.getFflag() == 1) {// 是文件投注
					if (!CheckUtil.isNullString(codes)) {
						codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), bean.getPid(), BASE_PATH, codes, "1", logger);
					} else {
						logger.info("后上传方案 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数=" + bean.getMuli() + " 用户=" + bean.getUid());
					}
				} else {
					if (CheckUtil.isNullString(codes)) {
						bean.setBusiErrCode(1);
						bean.setBusiErrDesc("不是文件投注，必须提供投注号码！");
					}
					if (bean.getCodes().length() >= 1900) {
						bean.setFflag(1);
					}
				}
				
				System.out.println(codes);

				int size = 0;
				JXmlWapper xml = mcm.getMatchXml(gid, bean.getPid());
				System.out.println(xml.toXmlString());
				if (!CheckUtil.isNullString(codes)) {
					String [] tmp = StringUtil.splitter(codes, ";");
					
					HashMap<String, Integer> cnums = new HashMap<String, Integer>();
					for(int i = 0; i < tmp.length; i++){
						String key = tmp[i];
						if(!StringUtil.isEmpty(key)){
							Integer val = cnums.get(key);
							int _val = (val == null ? 0 : val.intValue()) + 1;
							cnums.put(key, _val);
						}
					}
					
					int money = 0;
					for (Iterator<String> keys = cnums.keySet().iterator(); keys.hasNext();) {
						String key = keys.next();
						int mul = cnums.get(key);
						GameCastCode gcc = plugin.parseGameCastCode(key);
						matches += gcc.getMatchID();	//场次汇总
						money += gcc.getCastMoney() * mul;//金额汇总
						size += gcc.getCombineNum();	//文件注数(无倍数)
						
					}
					
					System.out.println(matches);
					
					checkTeam(gid, xml, matches);

					if (bean.getMoney() != money * bean.getMuli()) {
						bean.setBusiErrCode(2);
						bean.setBusiErrDesc("金额不正确,实际金额(" + money + ")");
					}
				}
				
				if (bean.getBusiErrCode() == 0) {}

				if (bean.getBusiErrCode() == 0) {
					if (bean.getCodes().length() >= 1900) {
						FileCastCodeUtil.saveCastCodeToFile(bean, BASE_PATH);// 生成文件
					}
					if (bean.getBusiErrCode() == 0) {
						bean.setZid(matches);
						bean.setEndTime("2014-07-14 03:00:00");
						int ret = JdbcSqlMapping.executeUpdate("t_proj_cast", bean, maps, jcn);
						if (ret == 0) {
							if (bean.getBusiErrCode() == 0) {
								/*
								try {
									saveProjMatchFile(bean, logger);
								} catch (Exception e) {
									logger.error("生成方案对阵", e);
								}
								*/
								String busiXml = "<result " + JXmlUtil.createAttrXml("projid", bean.getHid()) + " ";
								busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
								bean.setBusiXml(busiXml);
							}
						} else {
							bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
							bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
						}
					}
				}
			}
			logger.info("发起方案   结果=" + bean.getBusiErrCode() + " 描叙=" + bean.getBusiErrDesc() + " 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数="
					+ bean.getMuli() + " 用户=" + bean.getUid() + " 投注号码=" + bean.getCodes() + "  场次=" + matches+" 方案描述="+bean.getDesc());
		} catch (RuntimeException e) {
			bean.setBusiErrCode(1003);
			bean.setBusiErrDesc(e.getMessage());
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::jproj_cast", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	private void checkTeam(String gid, JXmlWapper xml, String teams) throws Exception{
		if(GameContains.isGYJ(gid)){
			if(xml != null){
				Xml match = Xml.parse(xml.toXmlString());
				String[] strs = teams.split(",");
				for(int i=0;i<strs.length;i++){
					String itemid = strs[i];
					int index = Integer.parseInt(itemid)-1;
					String isale = match.getStringValue("row["+index+"].@sale");
					String teamname = match.getStringValue("row["+index+"].@teamname");
					//System.out.println("itemid = "+ itemid);
					//System.out.println("isale = " + isale);
					if(!StringUtil.isEmpty(isale)){
						int sale = Integer.parseInt(isale);
						if(sale == 1){
							throw new RuntimeException("球队：" + teamname + " 已停售");
						}
					}
				}
			}
		}
	}
	
	/**
	 * 追号投注
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void cast_zhuihao(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			bean.check(TradeBean.CAST_ZH);
			if (bean.getBusiErrCode() == 0) {
				bean.setMuli(1);
				int money = countCodesMoney(bean, jcn);
				int tmoney = 0;
				String mulitys = bean.getMulitys();
				int[] mm = StringUtil.SplitterInt(mulitys, ",");
				bean.setPnum(mm.length);
				for (int i = 0; i < mm.length; i++) {
					tmoney += (mm[i] * money);
				}
				if (money <= 0 || bean.getMoney() != tmoney) {
					bean.setBusiErrCode(2);
					bean.setBusiErrDesc("追号金额不正确 实际金额（" + tmoney + ")");
				}

				if (bean.getBusiErrCode() == 0) {

					if (bean.getCodes().length() >= 1900) {
						String pids = bean.getPid();
						bean.setPid("zhuihao");
//						this.saveZhuiHaoCastCodeToFile(bean);// 生成文件
						FileCastCodeUtil.saveCastCodeToFile(bean, BASE_PATH);// 生成文件
						bean.setPid(pids);
					}
					
					bean.setMoney(money);
					int ret = JdbcSqlMapping.executeUpdate("t_cast_zh", bean, maps, jcn);
					if (ret != 0) {
						bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
						bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
					} else {
						String xml = "<zhuihao id=\"" + bean.getZid() + "\"/>";
						bean.setBusiXml(xml);
					}
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::cast_zhuihao", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 取消追号
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void cancel_zhuihao(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			bean.check(TradeBean.CANCEL_ZH);
			String dids = bean.getDid();
			String[] dd = StringUtil.splitter(dids, ",");
			if (bean.getBusiErrCode() == 0) {
				for (int i = 0; i < dd.length; i++) {
					bean.setDid(dd[i].trim());
					int ret = JdbcSqlMapping.executeUpdate("t_cancel_zh", bean, maps, jcn);
					if (ret != 0) {
						bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
						bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
					}
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::cancel_zhuihao", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 发起方案
	 * 
	 * @param bean
	 * @param context
	 */
	public void proj_cast(TradeBean bean, ServiceContext context) {
		String gid = bean.getGid();
		if (gid.compareToIgnoreCase("84") >= 0) {
			 jproj_cast(bean, context);
		} else {
			JdbcConnect jcn = null;
			try {

				jcn = context.getJdbcPoolManager().getJdbcConnect();
				HashMap<String, String> maps = new HashMap<String, String>();
				maps.put("gameid", bean.getGid());

				bean.check(TradeBean.CAST_HM);
				if (bean.getBusiErrCode() == 0) {
					if (bean.getFflag() == 1 && CheckUtil.isNullString(bean.getCodes())) {
						// 后上传方案
						logger.info("后上传方案 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数=" + bean.getMuli() + " 用户=" + bean.getUid());
					} else {
						int money = countCodesMoney(bean, jcn);
						if (bean.getMoney() != money && bean.getBusiErrCode() == 0) {
							bean.setBusiErrCode(2);
							bean.setBusiErrDesc("金额不正确,实际金额（" + money + ")");
						}
					}

					if (bean.getBusiErrCode() == 0) {
						if (bean.getCodes().length() >= 1900) {
							FileCastCodeUtil.saveCastCodeToFile(bean, BASE_PATH);// 生成文件
						}
						CountCodeUtil.checkCodeCount(gid, bean, jcn);
						if (bean.getBusiErrCode() == 0) {
							int ret = JdbcSqlMapping.executeUpdate("t_proj_cast", bean, maps, jcn);
							if (ret == 0) {
								if (bean.getBusiErrCode() == 0) {
									String busiXml = "<result " + JXmlUtil.createAttrXml("projid", bean.getHid()) + " ";
									busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
									bean.setBusiXml(busiXml);
								}
							} else {
								bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
								bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
							}
						}
					}
					logger.info("发起方案   结果=" + bean.getBusiErrCode() + " 描叙=" + bean.getBusiErrDesc() + " 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数="
							+ bean.getMuli() + " 用户=" + bean.getUid() + " 投注号码=" + bean.getCodes() + "   文件标志=" + bean.getFflag() + " 方案编号=" + bean.getHid());
				}
			} catch (Exception e) {
				bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
				bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
				logger.error("TradeBeanStub::proj_cast", e);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		}
	}

	/**
	 * 认购
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_join(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			bean.check(TradeBean.CAST_BUY);
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("t_proj_join", bean, maps, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
					bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
				} else {
					String busiXml = "<result " + JXmlUtil.createAttrXml("buyid", bean.getBid()) + " ";
					busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
					bean.setBusiXml(busiXml);
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::proj_join", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 方案撤销
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_cancel(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			bean.check(TradeBean.CANCEL_HM);
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("t_proj_cancel", bean, maps, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
					bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
				}
			}

		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::proj_cancel", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 认购撤销
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void join_cancel(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			bean.check(TradeBean.CANCEL_BUY);
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate("t_join_cancel", bean, maps, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
					bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
				}
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::join_cancel", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 事后保底
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_shbd(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());

			int ret = JdbcSqlMapping.executeUpdate("t_proj_shbd", bean, maps, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
				bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			} else {
				String busiXml = "<result ";
				busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
				bean.setBusiXml(busiXml);
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::proj_shbd", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 保底转认购
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_b2g(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			int ret = JdbcSqlMapping.executeUpdate("t_proj_b2g", bean, maps, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
				bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			} else {
				String busiXml = "<result ";
				busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
				bean.setBusiXml(busiXml);
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::proj_b2g", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	private void checkItem(String gid, JXmlWapper xml, HashMap<String, Long> cvals) throws Exception{
		if(GameContains.isFootball(gid) || GameContains.isBasket(gid)){
			if(xml != null){
				Xml match = Xml.parse(xml.toXmlString());
				for(Iterator<String> keys = cvals.keySet().iterator(); keys.hasNext();){
					String itemid = keys.next();
					long lc = cvals.get(itemid);
					if(GameContains.isFootball(gid)){
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
					} else if(GameContains.isBasket(gid)){
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

	/**
	 * 方案上传
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_upload(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			String gid = bean.getGid();
			String npid = bean.getPid();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			maps.put("gid", bean.getGid());

			bean.check(TradeBean.UPLOAD);
			if (bean.getBusiErrCode() == 0) {
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("t_query_pinfo", bean, maps, jcn);
				if (jrs != null && jrs.size() > 0) {
					jrs.first();
					
					String pid = jrs.get("periodid");
					String play = jrs.get("play");
					int mulity = jrs.getInt("mulity");
					int tmoney = jrs.getInt("tmoney");
					String codes = bean.getCodes();

					if (!gid.equalsIgnoreCase("50")) {
						play = "1";
					}

					if (!CheckUtil.isNullString(codes)) {
						if (CheckUtil.isNullString(npid)) {
							codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), pid, BASE_PATH, codes, play, logger);
						} else {
							codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), npid, BASE_PATH, codes, play, logger);
						}
					}

					if (!CheckUtil.isNullString(codes)) {
						GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);

						String [] tmp = StringUtil.splitter(codes, ";");
						int money = 0;
						boolean hasSXL = false;
						if (GameContains.isBeiDan(gid) || GameContains.isFootball(gid) || GameContains.isBasket(gid) || GameContains.isGYJ(gid)) {
							
							HashMap<String, Integer> cnums = new HashMap<String, Integer>();
							for(int i = 0; i < tmp.length; i++){
								String key = tmp[i];
								if(!StringUtil.isEmpty(key)){
									Integer val = cnums.get(key);
									int _val = (val == null ? 0 : val.intValue()) + 1;
									cnums.put(key, _val);
								}
							}
							
							int size = 0;
							JXmlWapper xml = mcm.getMatchXml(gid, bean.getPid());
							String endTime = "";
							String matches = "";
							String awardMatch = "";
							HashMap<String, Long> cvals = new HashMap<String, Long>();
							for (Iterator<String> keys = cnums.keySet().iterator(); keys.hasNext();) {
								String key = keys.next();
								int mul = cnums.get(key);
								GameCastCode gcc = plugin.parseGameCastCode(key);
								matches += gcc.getMatchID();
								money += gcc.getCastMoney() * mul;
								size += gcc.getCombineNum();
								
								if(gcc.getItems() != null){
									for(Object obj : gcc.getItems()){
										String itemid = obj instanceof JcItemBean ? ((JcItemBean)obj).getItemid() : ((LqItemBean)obj).getItemid();
										long _code = obj instanceof JcItemBean ? ((JcItemBean)obj).getCode() : ((LqItemBean)obj).getCode();
										Long lcode = cvals.get(itemid);
										long lc = (lcode == null ? 0 : lcode.longValue()) | _code;
										cvals.put(itemid, lc);
									}
								}
							}
							cnums.clear(); cnums = null;
							checkItem(gid, xml, cvals);
							cvals.clear(); cvals = null;

							List<String> lst = new ArrayList<String>();
							String[] ss = StringUtil.splitter(matches, ",");
							for (int i = 0; i < ss.length; i++) {
								if (!lst.contains(ss[i])) {
									lst.add(ss[i]);
								}
							}
							matches = ",";
							for (int i = 0; i < lst.size(); i++) {
								matches += lst.get(i) + ",";
							}
							endTime = mcm.getMatchMinEndTime(gid, pid, matches);
							Date d = DateUtil.parserDateTime(endTime);
							awardMatch = mcm.getMatchMax(gid, pid, matches);
							if (GameContains.isFootball(gid)) {
								long l = d.getTime();
								endTime = DateUtil.getDateTime(l);
								try {
									CountCodeUtil.jc(size, 1, endTime);
								} catch (Exception e) {
									bean.setBusiErrCode(-1);
									bean.setBusiErrDesc(e.getMessage());
								}
							} else if (GameContains.isBasket(gid)) {
								long l = d.getTime();
								endTime = DateUtil.getDateTime(l);
							} else {
								long l = d.getTime() - 1000 * 60 * 10;
								endTime = DateUtil.getDateTime(l);
							}

							endTime = getSpecialTimeRange(gid, endTime);
							bean.setEndTime(endTime);
							bean.setZid(matches);
							bean.setAwardMatch(awardMatch);
							logger.info("后上传文件   游戏=" + gid + " 期次=" + pid + " 文件=" + bean.getCodes() + " 截止时间=" + endTime + " 选择场次=" + matches);
						} else {
							for (int i = 0; i < tmp.length; i++) {
								if(!StringUtil.isEmpty(tmp[i])){
									GameCastCode gcc = plugin.parseGameCastCode(tmp[i]);
									money += gcc.getCastMoney();
									if("50".equals(gid) && gcc.getPlayMethod() == GamePlugin_50.PM_SXL){
										hasSXL = true;
									}
								}
							}
						}

						bean.setMoney(tmoney);
						if (CheckUtil.isNullString(npid)) {
							bean.setPid(pid);
						} else {
							bean.setPid(npid);
						}
						if(hasSXL && "2013053".compareTo(bean.getPid()) < 0){
							throw new Exception("自2013年5月11日20:00起(第2013053期销售截止后)，停止销售中国体育彩票超级大乐透[生肖乐]附加玩法");
						}
						bean.setFflag(1);

						CountCodeUtil.checkCodeCount(gid, bean, jcn);

						if (bean.getBusiErrCode() == 0) {
							bean.setMoney(money);

							if (money * mulity == tmoney) {
								int ret = JdbcSqlMapping.executeUpdate("t_proj_upload", bean, maps, jcn);
								if (ret != 0) {
									bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
									bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
								}else{
									if(bean.getBusiErrCode() == 0){
										try {
											saveProjMatchFile(bean, logger);
										} catch (Exception e) {
											logger.error("生成方案对阵", e);
										}
									}
								}
							} else {
								bean.setBusiErrCode(6);
								bean.setBusiErrDesc("上传方案中金额和发起金额不同");
							}
						}
					} else {
						logger.info("后上传文件   游戏=" + gid + " 期次=" + pid + " 文件=" + bean.getCodes() + " 不存在  npid=" + npid);
						bean.setBusiErrCode(7);
						bean.setBusiErrDesc("上传的文件不存在 " + bean.getCodes());
					}
				} else {
					bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
					bean.setBusiErrDesc("合买方案不存在 方案号(" + bean.getHid() + ")");
				}

			}

		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()) + ":" + e.getMessage());
			logger.error("TradeBeanStub::proj_upload", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}

	}
	
	/**
	 * 方案上传
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_hx(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			String gid = bean.getGid();
			String npid = bean.getPid();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			maps.put("gid", bean.getGid());

			bean.check(TradeBean.UPLOAD);
			if (bean.getBusiErrCode() == 0) {
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("t_query_pinfo", bean, maps, jcn);
				if (jrs != null && jrs.size() > 0) {
					jrs.first();
					
					String pid = jrs.get("periodid");
					String play = jrs.get("play");
					int mulity = jrs.getInt("mulity");
					int tmoney = jrs.getInt("tmoney");
					String codes = bean.getCodes();

					if (!gid.equalsIgnoreCase("50")) {
						play = "1";
					}

					if (!CheckUtil.isNullString(codes)) {
						if (CheckUtil.isNullString(npid)) {
							codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), pid, BASE_PATH, codes, play, logger);
						} else {
							codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), npid, BASE_PATH, codes, play, logger);
						}
					}

					if (!CheckUtil.isNullString(codes)) {
						GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);

						String [] tmp = StringUtil.splitter(codes, ";");
						int money = 0;
						boolean hasSXL = false;
						if (GameContains.isBeiDan(gid) || GameContains.isFootball(gid) || GameContains.isBasket(gid) || GameContains.isGYJ(gid)) {
							
							HashMap<String, Integer> cnums = new HashMap<String, Integer>();
							for(int i = 0; i < tmp.length; i++){
								String key = tmp[i];
								if(!StringUtil.isEmpty(key)){
									Integer val = cnums.get(key);
									int _val = (val == null ? 0 : val.intValue()) + 1;
									cnums.put(key, _val);
								}
							}
							
							int size = 0;
							JXmlWapper xml = mcm.getMatchXml(gid, bean.getPid());
							String endTime = "";
							String matches = "";
							String awardMatch = "";
							HashMap<String, Long> cvals = new HashMap<String, Long>();
							for (Iterator<String> keys = cnums.keySet().iterator(); keys.hasNext();) {
								String key = keys.next();
								int mul = cnums.get(key);
								GameCastCode gcc = plugin.parseGameCastCode(key);
								matches += gcc.getMatchID();
								money += gcc.getCastMoney() * mul;
								size += gcc.getCombineNum();
								
								if(gcc.getItems() != null){
									for(Object obj : gcc.getItems()){
										String itemid = obj instanceof JcItemBean ? ((JcItemBean)obj).getItemid() : ((LqItemBean)obj).getItemid();
										long _code = obj instanceof JcItemBean ? ((JcItemBean)obj).getCode() : ((LqItemBean)obj).getCode();
										Long lcode = cvals.get(itemid);
										long lc = (lcode == null ? 0 : lcode.longValue()) | _code;
										cvals.put(itemid, lc);
									}
								}
							}
							cnums.clear(); cnums = null;
							checkItem(gid, xml, cvals);
							cvals.clear(); cvals = null;

							List<String> lst = new ArrayList<String>();
							String[] ss = StringUtil.splitter(matches, ",");
							for (int i = 0; i < ss.length; i++) {
								if (!lst.contains(ss[i])) {
									lst.add(ss[i]);
								}
							}
							matches = ",";
							for (int i = 0; i < lst.size(); i++) {
								matches += lst.get(i) + ",";
							}
							endTime = mcm.getMatchMinEndTime(gid, pid, matches);
							Date d = DateUtil.parserDateTime(endTime);
							awardMatch = mcm.getMatchMax(gid, pid, matches);
							if (GameContains.isFootball(gid)) {
								long l = d.getTime();
								endTime = DateUtil.getDateTime(l);
								try {
									CountCodeUtil.jc(size, 1, endTime);
								} catch (Exception e) {
									bean.setBusiErrCode(-1);
									bean.setBusiErrDesc(e.getMessage());
								}
							} else if (GameContains.isBasket(gid)) {
								long l = d.getTime();
								endTime = DateUtil.getDateTime(l);
							} else {
								long l = d.getTime() - 1000 * 60 * 10;
								endTime = DateUtil.getDateTime(l);
							}

							endTime = getSpecialTimeRange(gid, endTime);
							bean.setEndTime(endTime);
							bean.setZid(matches);
							bean.setAwardMatch(awardMatch);
							logger.info("后上传文件   游戏=" + gid + " 期次=" + pid + " 文件=" + bean.getCodes() + " 截止时间=" + endTime + " 选择场次=" + matches);
						} else {
							for (int i = 0; i < tmp.length; i++) {
								if(!StringUtil.isEmpty(tmp[i])){
									GameCastCode gcc = plugin.parseGameCastCode(tmp[i]);
									money += gcc.getCastMoney();
									if("50".equals(gid) && gcc.getPlayMethod() == GamePlugin_50.PM_SXL){
										hasSXL = true;
									}
								}
							}
						}

						bean.setMoney(tmoney);
						if (CheckUtil.isNullString(npid)) {
							bean.setPid(pid);
						} else {
							bean.setPid(npid);
						}
						if(hasSXL && "2013053".compareTo(bean.getPid()) < 0){
							throw new Exception("自2013年5月11日20:00起(第2013053期销售截止后)，停止销售中国体育彩票超级大乐透[生肖乐]附加玩法");
						}
						bean.setFflag(0);

						CountCodeUtil.checkCodeCount(gid, bean, jcn);
						if (bean.getBusiErrCode() == 0) {
							if (bean.getCodes().length() >= 1900) {
								FileCastCodeUtil.saveCastCodeToFile(bean, BASE_PATH);// 生成文件
							}
						}

						if (bean.getBusiErrCode() == 0) {
							bean.setMoney(money);

							if (money * mulity == tmoney) {
								int ret = JdbcSqlMapping.executeUpdate("t_proj_hx", bean, maps, jcn);
								if (ret != 0) {
									bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
									bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
								}else{
									if(bean.getBusiErrCode() == 0){
										try {
											saveProjMatchFile(bean, logger);
										} catch (Exception e) {
											logger.error("生成方案对阵", e);
										}
									}
								}
							} else {
								bean.setBusiErrCode(6);
								bean.setBusiErrDesc("上传方案中金额和发起金额不同");
							}
						}
					} else {
						logger.info("后选方案   游戏=" + gid + " 期次=" + pid + " 号码=" + bean.getCodes() + " 不存在  npid=" + npid);
						bean.setBusiErrCode(7);
						bean.setBusiErrDesc("没有选择方案不存在 " + bean.getCodes());
					}
				} else {
					bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
					bean.setBusiErrDesc("合买方案不存在 方案号(" + bean.getHid() + ")");
				}

			}

		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()) + ":" + e.getMessage());
			logger.error("TradeBeanStub::proj_upload", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}

	}

	/**
	 * 竞技彩发起方案
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void jproj_cast(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			String gid = bean.getGid();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
			String matches = "";
			String awardMatch = "";
			bean.check(TradeBean.CAST_HM);
			if (bean.getBusiErrCode() == 0) {
				String codes = bean.getCodes();
				if (bean.getFflag() == 1) {// 是文件投注
					if (!CheckUtil.isNullString(codes)) {
						codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), bean.getPid(), BASE_PATH, codes, "1", logger);
					} else {
						logger.info("后上传方案 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数=" + bean.getMuli() + " 用户=" + bean.getUid());
					}
				} else {
					if (CheckUtil.isNullString(codes)) {
						bean.setBusiErrCode(1);
						bean.setBusiErrDesc("不是文件投注，必须提供投注号码！");
					}
					if (bean.getCodes().length() >= 1900) {
						bean.setFflag(1);
					}
				}

				int size = 0;
				JXmlWapper xml = mcm.getMatchXml(gid, bean.getPid());
				if (!CheckUtil.isNullString(codes)) {
					String [] tmp = StringUtil.splitter(codes, ";");
					
					HashMap<String, Integer> cnums = new HashMap<String, Integer>();
					for(int i = 0; i < tmp.length; i++){
						String key = tmp[i];
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
						GameCastCode gcc = plugin.parseGameCastCode(key);
						matches += gcc.getMatchID();	//场次汇总
						money += gcc.getCastMoney() * mul;//金额汇总
						size += gcc.getCombineNum();	//文件注数(无倍数)
						
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
					if (bean.getMoney() != money * bean.getMuli()) {
						bean.setBusiErrCode(2);
						bean.setBusiErrDesc("金额不正确,实际金额(" + money + ")");
					}
				}
				
				if (bean.getBusiErrCode() == 0) {
					// 检查场次是否正确
					String endTime = "";
					if (CheckUtil.isNullString(codes)) {// 后上传
						if (GameContains.isFootball(gid) || GameContains.isBasket(gid)) {
							long l = System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 3;
							endTime = DateUtil.getDateTime(l);
						} else {
							endTime = mcm.getMatchMaxEndTime(gid, bean.getPid());
							Date d = DateUtil.parserDateTime(endTime);
							long l = d.getTime();
							if (l < System.currentTimeMillis()) {
								endTime = "";
							} else {
								endTime = DateUtil.getDateTime(l);
							}
						}
					} else {
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

						endTime = mcm.getMatchMinEndTime(gid, bean.getPid(), matches);
						awardMatch = mcm.getMatchMax(gid, bean.getPid(), matches);
						logger.info("---------------------------------------------" + awardMatch);
						Date d = DateUtil.parserDateTime(endTime);
						if (bean.getFflag() == 1) {// 是文件投注
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
					}

					if (endTime.length() == 0) {
						bean.setBusiErrCode(3);
						if (CheckUtil.isNullString(matches)) {
							bean.setBusiErrDesc("该期所有的场次已经截止销售！");
						} else {
							bean.setBusiErrDesc("所选择的比赛场次中已经截止销售！");
						}
					} else {
						endTime = getSpecialTimeRange(gid, endTime);
						bean.setEndTime(endTime);
						// 处理竞彩的期次编号问题
						if (GameContains.isBeiDan(gid)){
							try {
								CountCodeUtil.bd(size, bean.getFflag(), endTime);
							} catch (Exception e) {
								logger.error("北单", e);
								bean.setBusiErrCode(-1);
								bean.setBusiErrDesc(e.getMessage());
							}
						}else if (GameContains.isFootball(gid)) {//JC
							if ( CheckUtil.isNullString(bean.getPid()) || bean.getFflag() == 0) {
								bean.setPid(StringUtil.replaceString(endTime.substring(0, 10), "-", ""));
							}
							try {
								CountCodeUtil.jc(size, bean.getFflag(), bean.getEndTime());
							} catch (Exception e) {
								bean.setBusiErrCode(-1);
								bean.setBusiErrDesc(e.getMessage());
							}
						} else if (GameContains.isBasket(gid)){//LQ
							if ( CheckUtil.isNullString(bean.getPid()) || bean.getFflag() == 0) {
								bean.setPid(StringUtil.replaceString(endTime.substring(0, 10), "-", ""));
							}
						} else if (GameContains.isGYJ(gid)){//GYJ
							// nothing
						}
					}
				}

				if (bean.getBusiErrCode() == 0) {
					if (bean.getCodes().length() >= 1900) {
						FileCastCodeUtil.saveCastCodeToFile(bean, BASE_PATH);// 生成文件
					}
					if (bean.getBusiErrCode() == 0) {
						bean.setZid(matches);
						bean.setAwardMatch(awardMatch);
						int ret = JdbcSqlMapping.executeUpdate("t_proj_cast", bean, maps, jcn);
						if (ret == 0) {
							if (bean.getBusiErrCode() == 0) {
								try {
									saveProjMatchFile(bean, logger);
								} catch (Exception e) {
									logger.error("生成方案对阵", e);
								}

								String busiXml = "<result " + JXmlUtil.createAttrXml("projid", bean.getHid()) + " ";
								busiXml += JXmlUtil.createAttrXml("balance", bean.getBalance()) + "/>";
								bean.setBusiXml(busiXml);
							}
						} else {
							bean.setBusiErrCode(TradeErrCode.ERR_CALL_SP);
							bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
						}
					}
				}
			}
			logger.info("发起方案   结果=" + bean.getBusiErrCode() + " 描叙=" + bean.getBusiErrDesc() + " 游戏=" + gid + " 期次=" + bean.getPid() + " 金额=" + bean.getMoney() + " 倍数="
					+ bean.getMuli() + " 用户=" + bean.getUid() + " 投注号码=" + bean.getCodes() + "  场次=" + matches+" 方案描述="+bean.getDesc());
		} catch (RuntimeException e) {
			bean.setBusiErrCode(1003);
			bean.setBusiErrDesc(e.getMessage());
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::jproj_cast", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	/**
	 * 检查号码格式
	 * 
	 * @param bean
	 * @return
	 */
	private int countCodesMoney(TradeBean bean, JdbcConnect jcn) throws Exception {
		int money = -1;
		String gid = bean.getGid();
		GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);

		if (plugin != null) {
			boolean isDT = false;
			boolean hasSXL = false;
			try {
				String codes = bean.getCodes();
				if (bean.getFflag() == 1) {
					if (!CheckUtil.isNullString(codes)) {
						codes = FileCastCodeUtil.getCodesFromFile(bean.getGid(), bean.getPid(), BASE_PATH, codes, bean.getPlay() + "", logger);
					}
				}
				
				logger.info(codes);

				GameCastCode[] cc = plugin.parseGameCastCodes(codes);
				if (GameContains.isKP(bean.getGid())){
					if (cc.length > 500) {
						bean.setBusiErrCode(13);
						bean.setBusiErrDesc("快频彩种方案条数不能够超过500条!");
					}
				}
				int total = 0;
				for (int i = 0; i < cc.length; i++) {
					if (!big.containsKey(gid)) {
						if (cc[i].getCastMoney() > 20000) {
							bean.setBusiErrCode(12);
							bean.setBusiErrDesc("单注金额不能超过2万!");
							break;
						}
					}
					if(GameContains.isR9(gid)){
						if(cc[i].getCastMethod() == GameCastMethodDef.CASTTYPE_DANTUO){
							isDT = true;
						}
					} else if("50".equals(gid)){
						if(cc[i].getPlayMethod() == GamePlugin_50.PM_SXL){
							hasSXL = true;
						}
					}
					total += cc[i].getCastMoney();
				}
				money = total * bean.getMuli();
				if(hasSXL){
					String [] ps = StringUtil.splitter(bean.getPid(), ",");
					for(int s = 0; s < ps.length; s++){
						if("2013053".compareTo(ps[s]) < 0){
							throw new Exception("自2013年5月11日20:00起(第2013053期销售截止后),停止销售中国体育彩票超级大乐透[生肖乐]附加玩法");
						}
					}
				}
			} catch (CodeFormatException e) {
				logger.error("号码格式错误 game=" + gid, e);
				bean.setBusiErrCode(e.getErrCode());
				bean.setBusiErrDesc(e.getErrDesc());
			}
			if(isDT){
				CountCodeUtil.checkEndTime(gid, bean, jcn);
			}
		} else {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("该彩种暂不支持(" + gid + ")");
		}
		return money;
	}





	public String getSpecialTimeRange(String gid, String endTime) {
		if(GameContains.isBeiDan(gid)){
			String start = "2013-02-08 23:30:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameContains.isFootball(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameContains.isBasket(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameContains.isGYJ(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}
		return endTime;
	}

	private final void saveProjMatchFile(TradeBean tb, Logger logger) throws Exception {
		if (CheckUtil.isNullString(tb.getZid())) {
			return;
		}
		String[] fields = new String[] {"sf", "spf", "cbf", "bqc", "sxp", "jqs", "spf", "cbf", "bfc", "jqs", "sf", "rfsf", "sfc", "dxf", "sp", "sp" };// 玩法属性节点
		String ppath =  System.getProperty("DATA_HOME") + File.separator + "guoguan"; // 方案文件保存路径

		File fdir = new File(ppath + File.separator + tb.getGid() + File.separator + tb.getPid() + File.separator + "proj");
		if (!fdir.exists()) {
			fdir.mkdirs();
		}

		String[] matches = StringUtil.splitter(tb.getZid(), ",");
		StringBuffer sb = new StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>").append("\r\n");
		sb.append("<items ").append(JXmlUtil.createAttrXml("uid", tb.getType() == 0 ? "******" : tb.getUid()));
		sb.append(JXmlUtil.createAttrXml("pid", tb.getPid()));
		sb.append(JXmlUtil.createAttrXml("projid", tb.getHid()));
		sb.append(JXmlUtil.createAttrXml("spdate", DateUtil.getDateTime(System.currentTimeMillis())));
		sb.append(JXmlUtil.createAttrXml("builddate", DateUtil.getDateTime(System.currentTimeMillis())));
		sb.append(" >\r\n");

		String key = "";
		if (GameContains.isBeiDan(tb.getGid())) {
			key = tb.getPid() + "_" + tb.getGid();
		} else {
			key = tb.getGid();
		}
		JXmlWapper xml = mcm.getCache(key);
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

				if (GameContains.isGYJ(tb.getGid())) {
					sb.append(JXmlUtil.createAttrXml("name", mXml.getStringValue("@name")));
					sb.append(JXmlUtil.createAttrXml("audit", "0"));
					sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@matchtime")));
					sb.append(JXmlUtil.createAttrXml("spvalue", mXml.getStringValue("@"+fields[Integer.parseInt(tb.getGid()) - 84])));
				} else {
					sb.append(JXmlUtil.createAttrXml("hn", mXml.getStringValue("@hn")));
					sb.append(JXmlUtil.createAttrXml("vn", mXml.getStringValue("@gn")));

					sb.append(JXmlUtil.createAttrXml("hs", ""));
					sb.append(JXmlUtil.createAttrXml("vs", ""));

					if (GameContains.isBeiDan(tb.getGid())) {
						sb.append(JXmlUtil.createAttrXml("lose", mXml.getStringValue("@close") + ""));
						sb.append(JXmlUtil.createAttrXml("hhs", ""));
						sb.append(JXmlUtil.createAttrXml("hvs", ""));
						sb.append(JXmlUtil.createAttrXml("bet3", mXml.getStringValue("@b3")));
						sb.append(JXmlUtil.createAttrXml("bet1", mXml.getStringValue("@b1")));
						sb.append(JXmlUtil.createAttrXml("bet0", mXml.getStringValue("@b0")));
						sb.append(JXmlUtil.createAttrXml("bt", mXml.getStringValue("@bt")));
						sb.append(JXmlUtil.createAttrXml("spvalue", mXml.getStringValue("@"+fields[Integer.parseInt(tb.getGid()) - 84])));
					} else if(GameContains.isFootball(tb.getGid())) {
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
					}else if(GameContains.isBasket(tb.getGid())){
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
		FileUtil.saveFile(fdir, tb.getHid().toLowerCase() + ".xml", sb.toString(), "utf-8");
		sb = null;
	}
	
	private static JXmlWapper getMatchInfo(JXmlWapper xml, String matchid){
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
	
	/**
	 * 查询方案详细信息
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void queryProjectInfo(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			if (!CheckUtil.isNullString(bean.getGid()) && !CheckUtil.isNullString(bean.getHid())) {

				HashMap<String, String> maps = new HashMap<String, String>();
				maps.put("gid", bean.getGid());

				boolean blnMy = false;

				StringBuffer sb = new StringBuffer();
				sb.append("<myjoins>\r\n");
				if (!CheckUtil.isNullString(bean.getUid())) {
					JdbcRecordSet jrsMy = JdbcSqlMapping.executeQuery("t_query_my_jinfo", bean, maps, jcn);
					if (jrsMy != null && jrsMy.size() > 0) {
						blnMy = true;
						sb.append(jrsMy.toRawXmlString("myjoin"));
						jrsMy.clear();
						jrsMy = null;
					}
				}
				sb.append("</myjoins>\r\n");

				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("t_query_pinfo", bean, maps, jcn);
				if (jrs != null && jrs.size() > 0) {
					bean.setBusiErrCode(0);

					jrs.first();
					int istate = jrs.getInt("istate");
					int iopen = jrs.getInt("iopen");
					String nid = jrs.get("cnickid");
					int itype = jrs.getInt("itype");
					int ifile = jrs.getInt("ifile");
					Date endtime = jrs.getDate("endtime");
					String gameid = jrs.get("gameid");
					String periodid = jrs.get("periodid");

					boolean bln = false;
					if (nid.equalsIgnoreCase(bean.getUid())) {// 本用户
						bln = true;
					}
					if (itype == 0 && !bln) {// 代购方案非本人查看
						if(!CheckUtil.isNullString(bean.getUid())){
							bean.setBusiErrCode(2002);
							bean.setBusiErrDesc(TradeErrCode.getErrDesc(TradeErrCode.ERR_DAIGOU_VIEW));
						}else{
							bean.setBusiErrCode(TradeErrCode.ERR_DAIGOU_VIEW);
							bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
						}
					} else {
						String tag = "row";
						String[] fields = jrs.getFileds();
						sb.append("<" + tag + " ");
						for (int j = 0; j < fields.length; j++) {
							if (fields[j].equalsIgnoreCase("ccodes")) {
								if (!bln) {
									if (iopen == 0) {// 公开
										bln = true;
									} else if (iopen == 1) {// 截止后公开
									    if(istate > 1 && System.currentTimeMillis() > endtime.getTime()){
										//if (istate > 1) {
											bln = true;
										}
									} else if (iopen == 2) {// 对参与人员公开
										if (blnMy) {
											bln = true;
										}
									} else if (iopen == 3) {// 截止后对参与人员公开
										if (istate > 1 && blnMy && System.currentTimeMillis() > endtime.getTime()) {
											bln = true;
										}
									} else if (iopen == 4){
										bln = false;
									}
								}
								
								String codes = jrs.get(fields[j]);
								if(ifile==1){
									String path = BASE_PATH+ File.separator+gameid+ File.separator+periodid+ File.separator+jrs.get(fields[j]);
									File file = new File(path);
									if(!StringUtil.isEmpty(codes)&&file.exists()){
										FileInputStream fis = new FileInputStream(file);

										BufferedReader br = new BufferedReader(new InputStreamReader(fis));

										StringBuffer cs = new StringBuffer();
										String temp = null;

										while ((temp = br.readLine()) != null) {
											temp = temp.trim();
											if (temp.length() > 0) {
												cs.append(temp).append(";");
											}
										}
										codes = cs.toString();
										fis.close();
									}else{ 
										codes = "";
										logger.error(path+"文件不存在！");
									}
									
								}

								if (bln) {
									sb.append(JXmlUtil.createAttrXml(fields[j], jrs.get(fields[j])));
								} else {
									sb.append(JXmlUtil.createAttrXml(fields[j], ""));
								}
							} else {
								sb.append(JXmlUtil.createAttrXml(fields[j], jrs.get(fields[j])));
							}
						}
						sb.append("/>\n");
						
						bean.setBusiXml(sb.toString());
						bean.setBusiErrDesc("成功");

						bean.setBusiErrCode(0);
						bean.setBusiErrDesc("获取成功");
					}
					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(TradeErrCode.ERR_USER_NOT_EXITS);
					bean.setBusiErrDesc("方案不存在");
				}
			} else {
				bean.setBusiErrCode(TradeErrCode.ERR_USER_NOT_EXITS);
				bean.setBusiErrDesc("输入参数不正确");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::cancel_zhuihao", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void awarddetail(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			if (!CheckUtil.isNullString(bean.getGid()) && !CheckUtil.isNullString(bean.getHid())) {

				HashMap<String, String> maps = new HashMap<String, String>();
				maps.put("gid", bean.getGid());
				
				if(!(GameContains.isFootball(bean.getGid()) || GameContains.isBasket(bean.getGid()) || GameContains.isGYJ(bean.getGid()))){
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("该彩种无出票明细");
					return;
				}

				boolean blnMy = false;
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("t_query_pinfo", bean, maps, jcn);
				if (jrs != null && jrs.size() > 0 && jrs.first()) {
					bean.setBusiErrCode(0);
					int pid = jrs.getInt("periodid");
					int istate = jrs.getInt("istate");
					int iopen = jrs.getInt("iopen");
					String nid = jrs.get("cnickid");
					int itype = jrs.getInt("itype");
					int icast = jrs.getInt("icast");
					String gid = jrs.get("gameid");

					boolean bln = false;
					if (nid.equalsIgnoreCase(bean.getUid())) {// 本用户
						bln = true;
					}
					if (itype == 0 && !bln) {// 代购方案非本人查看
						bean.setBusiErrCode(TradeErrCode.ERR_DAIGOU_VIEW);
						bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
					} else {
						int num = jcn.getRecordNums("select count(1) from tb_proj_buy_" + gid + " where cnickid=? and icancel=0", new Object[]{bean.getUid()});
						if(num > 0){
							blnMy = true;
						}
						if (!bln) {
							if (iopen == 0) {// 公开
								bln = true;
							} else if (iopen == 1) {// 截止后公开
								if (istate > 1) {
									bln = true;
								}
							} else if (iopen == 2) {// 对参与人员公开
								if (blnMy) {
									bln = true;
								}
							} else if (iopen == 3) {// 截止后对参与人员公开
								if (istate > 1 && blnMy) {
									bln = true;
								}
							} else if (iopen == 4){
								bln = false;
							}
						}
						
						if(!bln){
							bean.setBusiErrCode(1);
							bean.setBusiErrDesc("无权查看");
							return;
						}
		
						if(icast != 3){
							bean.setBusiErrCode(1);
							bean.setBusiErrDesc("尚未出票，请稍候");
							return;
						}
						
						File file = new File("/opt/export/cpdata/guoguan/" + bean.getGid() + "/" + pid + "/pass", bean.getHid() + ".json");
						if(file.exists()){
							String strJson = FileUtil.getFileContent(file, null);
							if(StringUtil.isEmpty(strJson)){
								bean.setBusiErrCode(1);
								bean.setBusiErrDesc("出票明细文件为空，请联系客服");
							} else {
								String xmlString = XML.toString(new JSONObject(strJson), null);
								JXmlWapper xml = JXmlWapper.parse(xmlString);
								bean.setBusiXml(xml.toXmlString().replaceAll("<\\?.+?\\?>", ""));
								bean.setBusiErrCode(0);
								bean.setBusiErrDesc("获取成功");
							}
						}else{
							bean.setBusiErrCode(1);
							bean.setBusiErrDesc("出票明细文件尚未生成，请稍候");
						}
					}
					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(TradeErrCode.ERR_USER_NOT_EXITS);
					bean.setBusiErrDesc("方案不存在");
				}
			} else {
				bean.setBusiErrCode(TradeErrCode.ERR_USER_NOT_EXITS);
				bean.setBusiErrDesc("输入参数不正确");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::awarddetail", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void queryProjectList(TradeBean bean, ServiceContext context) {
		try {
			bean.setBusiErrCode(-1);
			bean.setBusiErrDesc("获取失败");

			CacheManager pcm = CacheManager.getProjectCacheManager();
			GetProject gp = new GetProject();
			gp.setFind(bean.getFind());
			gp.setPageNo(bean.getPn());
			gp.setSort(bean.getFsort());
			gp.setSortending(bean.getDsort());
			gp.setState(bean.getState());
			gp.setPageSize(bean.getPs());
			gp.setNickID(bean.getUid());
			gp.setGid(bean.getGid());
			gp.setPid(bean.getPid());

			String xml = pcm.select_page(gp);
			if (xml != null && xml.length() > 0) {
				bean.setBusiXml(xml);
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("调用成功");
			} else {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("查询无数据");
				bean.setBusiXml("<recordcount records=\"0\" pagesize=\"25\" eachnum=\"0\" />");
			}
		} catch (Exception e) {
			logger.error("queryProjectList", e);
		}
	}
	
	/**
	 * 查询方案详细信息
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void queryJoinList(TradeBean bean, ServiceContext context) {
		bean.setBusiErrCode(-1);
		bean.setBusiErrDesc("获取失败");

		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gid", bean.getGid());

			String cnid = null;
			JdbcRecordSet ujrs = JdbcSqlMapping.executeQuery("t_query_pinfo", bean, maps, jcn);
			if (ujrs != null && ujrs.size() > 0 && ujrs.first()) {
				cnid = ujrs.get("cnickid");
			}
			
			
			if (bean.getRc() == 0) {
				int count = JdbcSqlMapping.getRecordCount("t_query_jinfo_count", bean, maps, jcn);
				bean.setRc(count);
				if (count % bean.getPs() == 0) {
					bean.setTp(count / bean.getPs());
				} else {
					bean.setTp(count / bean.getPs() + 1);
				}
			}

			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("t_query_jinfo", bean, maps, bean.getPs(), bean.getPn(), jcn);
			if (jrs != null && jrs.size() > 0) {
				bean.setBusiErrCode(0);

				String xmlt = "<count tp=\"" + bean.getTp() + "\" rc=\"" + bean.getRc() + "\" pn=\"" + bean.getPn() + "\" ps=\"" + bean.getPs() + "\"/>\r\n";
				xmlt += jrs.toRawXmlString("row");
				//bean.setBusiXml(xml);

				String xmlstr = "<MYResp>" + xmlt + "</MYResp>";
				JXmlWapper xml = JXmlWapper.parse(xmlstr);
				int t = 0;  //未登录用户
				if (!StringUtil.isEmpty(bean.getUid())) {//已登录用户
					t = 1; 
				}

				String nid = cnid;//xml.getStringValue("count.@nickid");
				if (nid.equals(bean.getUid())) {//发单人登录
						t = 2;   
				}
				
				//xml.remove("count.@nickid");
				if (t==2) {//发单人登录可以查看所有跟单人全称
					
				}else{
					int count = xml.countXmlNodes("row");
					for(int i = 0; i < count; i++){
						if(t==1){//登录用户可以查看自已和发单人的全称
							if(!xml.getStringValue("row["+i+"].@nickid").equals(nid) && !xml.getStringValue("row["+i+"].@nickid").equals(bean.getUid()) && !xml.getStringValue("row["+i+"].@nickid").equals("159cai保底")){
								xml.setValue("row["+i+"].@nickid", xml.getStringValue("row["+i+"].@nickid").substring(0,1) + "*****");
							}
						}else{//未登录用户可以查看发单人的全称
							if(!xml.getStringValue("row["+i+"].@nickid").equals(nid) && !xml.getStringValue("row["+i+"].@nickid").equals("159cai保底")){
								xml.setValue("row["+i+"].@nickid", xml.getStringValue("row["+i+"].@nickid").substring(0,1) + "*****");
							}
						}
					}
				}
				String cxml = xml.toXmlString(("utf-8"));
				bean.setBusiXml(cxml.replaceAll("<\\?.+?\\?>", "").replace("</MYResp>", "").replace("<MYResp>", ""));
				bean.setBusiErrDesc("成功");

				jrs.clear();
				jrs = null;
			} else {
				bean.setBusiErrCode(TradeErrCode.ERR_USER_NOT_EXITS);
				bean.setBusiErrDesc("方案不存在");
			}

		} catch (Exception e) {
			bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
			bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
			logger.error("TradeBeanStub::cancel_zhuihao", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void queryHotProject(TradeBean bean, ServiceContext context) {
		CacheManager pcm = CacheManager.getProjectCacheManager();
		List<HotProjectBean> lst = pcm.getHotProjectList();
		
		int pn = bean.getPn();
		int ps = bean.getPs();
		ps = (ps == 0) ? 10:ps;
		pn = (pn == 0) ? 1:pn;
		int count = lst.size();
		
		String sfind = bean.getFind();
		if (CheckUtil.isNullString(sfind) ) {
			int tp = (count % ps == 0) ? (count / ps) : (count / ps + 1);
			
			StringBuffer sb = new StringBuffer();
			sb.append("<recordcount ");
			sb.append(JXmlUtil.createAttrXml("records",count+""));
			sb.append(JXmlUtil.createAttrXml("pagesize",ps+""));
			sb.append(JXmlUtil.createAttrXml("eachnum",ps+""));
			sb.append(JXmlUtil.createAttrXml("tp",tp+"")).append("/>\r\n");
			
			for (int i=(pn-1)*ps;i<pn*ps && i < count;i++) {
				sb.append(lst.get(i).toXmlString()).append("\r\n");
			}
	
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("获取成功");
			bean.setBusiXml(sb.toString());
		} else {
			StringBuffer sb = new StringBuffer();
			sb.append("<recordcount ");
			sb.append(JXmlUtil.createAttrXml("records",count+""));
			sb.append(JXmlUtil.createAttrXml("pagesize",ps+""));
			sb.append(JXmlUtil.createAttrXml("eachnum",ps+""));
			sb.append(JXmlUtil.createAttrXml("tp","1")).append("/>\r\n");
			
			for (int i=0;i<count;i++) {
				HotProjectBean hpb = lst.get(i);
				if ( sfind.equalsIgnoreCase(hpb.getNickID()) || sfind.equalsIgnoreCase(hpb.getProjID())) {
					sb.append(lst.get(i).toXmlString()).append("\r\n");
				}
			}
	
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("获取成功");
			bean.setBusiXml(sb.toString());
			
		}
	}
	
	public void tquery(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			String qkey = "query_" + bean.getFunc();
			String ckey = "query_count_" + bean.getFunc();

			HashMap<String, String> maps = new HashMap<String, String>();
			if (!CheckUtil.isNullString(bean.getGid())) {
				maps.put("gid", bean.getGid());
				maps.put("gameid", bean.getGid());
			}

			if (bean.getPn() <= 0) {
				bean.setPn(1);
			}

			JdbcRecordSet jrs = null;
			if (ckey != null && ckey.length() > 0 && jcn.getKeyMapSql(ckey) != null) {
				if (bean.getTr() == 0) {
					// 需要进行分页查询
					int tr = JdbcSqlMapping.getRecordCount(ckey, bean, maps, jcn);
					bean.setTr(tr);
					if (bean.getPs() <= 0) {
						bean.setPs(25);
					}
					if (tr % bean.getPs() == 0) {
						bean.setTp(tr / bean.getPs());
					} else {
						bean.setTp(tr / bean.getPs() + 1);
					}
				}
				jrs = JdbcSqlMapping.executeQuery(qkey, bean, maps, bean.getPs(), bean.getPn(), jcn);
			} else {// 不需要分页
				jrs = JdbcSqlMapping.executeQuery(qkey, bean, maps, jcn);
			}

			if (jrs != null) {
				String xml = "<rows tr=\"" + bean.getTr() + "\" tp=\"" + bean.getTp() + "\" ps=\"";
				xml += bean.getPs() + "\" pn=\"" + bean.getPn() + "\">";
				xml += jrs.toRawXmlString("row");
				xml += "</rows>";
				bean.setBusiXml(xml);
				logger.debug(bean.getBusiXml());

				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("查询成功");

				jrs.clear();
				jrs = null;
			} else {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("查询数据为空");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("查询异常");
			logger.error("TradeBeanStub::tquery", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void queryAwardCode(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		String xml = null;
		CacheManager pcm = CacheManager.getProjectCacheManager();
		xml = pcm.getCacheAwardCode(bean.getGid(), bean.getPid());

		if (xml == null || xml.length() == 0) {
			try {
				jcn = context.getJdbcPoolManager().getJdbcConnect();
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("c_award_code", bean, null, jcn);
				if (jrs != null && jrs.size() > 0) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("查询成功");
					
					xml = jrs.toRawXmlString("row");
					bean.setBusiXml(xml);
					
					jrs.first();
					String code = jrs.get("cawardcode");
					if ( !CheckUtil.isNullString(code)) {
						pcm.putCacheAwardCode(bean.getGid(), bean.getPid(), xml);
					}
					
					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("暂时无数据");
				}
			} catch (Exception e) {
				bean.setBusiErrCode(TradeErrCode.ERR_EXCEPTION);
				bean.setBusiErrDesc(TradeErrCode.getErrDesc(bean.getBusiErrCode()));
				logger.error("TradeBeanStub::queryAwardCode", e);
			} finally {
				if (jcn != null) {
					jcn.unlock();
				}
			}
		} else {
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("查询成功");
			bean.setBusiXml(xml);
		}
	}
	
	public void optimize(TradeBean bean, ServiceContext context) {
		try {
			String pid = bean.getPid();//玩法
logger.error("optimize ----------> pid=" + pid + "  codes=" + bean.getCodes());			
			if ( CheckUtil.isNullString(pid)) {
				String xml = JinCaiYueHua.optimizeJczq(bean.getCodes(), bean.getMuli(),bean.getPnum(),bean.getType());
				if ( CheckUtil.isNullString(xml) ) {
					bean.setBusiErrCode(2);
					bean.setBusiErrDesc("优化失败， 投注金额不足！");
				} else {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("成功");
					bean.setBusiXml(xml);
				}
			} else {
				String codes = bean.getCodes();
				codes = StringUtil.replaceString(codes, " ", "+");
				String xml = JinCalOptimizeUtil.fetchOptimizor(pid).optimize(codes, bean.getMuli(),bean.getPnum(),bean.getType(),bean.getDid());
				if ( CheckUtil.isNullString(xml) ) {
					bean.setBusiErrCode(2);
					bean.setBusiErrDesc("优化失败， 投注金额不足！");
				} else {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("成功");
					bean.setBusiXml(xml);
				}
			}
		} catch (Exception e) {
			logger.error("奖金优化出现异常", e);
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("失败");
		}
	}
	
	
	/**
	 * 方案返利操作
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void proj_fanli(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			HashMap<String, String> maps = new HashMap<String, String>();
			maps.put("gameid", bean.getGid());
			int ret = JdbcSqlMapping.executeUpdate("t_proj_fanli", bean, maps, jcn);
			if (ret != 0) {
				bean.setState(TradeErrCode.ERR_CALL_SP);
				bean.setFunc(TradeErrCode.getErrDesc(bean.getState()));
			}
		} catch (Exception e) {
			bean.setState(TradeErrCode.ERR_EXCEPTION);
			bean.setFunc(TradeErrCode.getErrDesc(bean.getState()));
			logger.error("TradeBeanStub::proj_fanli", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	/**
	 * 方案返利查询
	 * 
	 * @param bean
	 * @param pool
	 * @param tid
	 */
	public void fquery(TradeBean bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();

			String qkey = "query_fanli";

			HashMap<String, String> maps = new HashMap<String, String>();
			if (bean.getPn() <= 0) {
				bean.setPn(1);
			}

			JdbcRecordSet jrs = null;
			// 不需要分页
			jrs = JdbcSqlMapping.executeQuery(qkey, bean, maps, jcn);

			if (jrs != null && jrs.size() > 0) {
				String xml = "<orders>";
				while (jrs.next()){
					int itype = jrs.getInt("itype");//0代购1追号
					int iflag = jrs.getInt("iflag");//0失败1成功
					String gameid = jrs.get("gameid");
					String projid = jrs.get("projid");
					String comefrom = jrs.get("comefrom");
					String pp=jrs.get("itmoney");
					String sd=jrs.get("addtime");
					String[] cf = comefrom.split("\\|");//emar|159cps|101|NDgwMDB8dGVzdA==
					if(itype==1){
						projid=gameid+"_"+projid;
					}
					String os="success";
					String ps="ok";
					if(iflag==0){
						os="fail";
						ps="no";
					}
					xml += "<order>";
					xml += "<wi>"+cf[3]+"</wi>";
					xml += "<order_time>"+sd+"</order_time>";//下单时间
					xml += "<order_no>"+projid+"</order_no>";//订单编号
					xml += "<prod_no>"+projid+"</prod_no>";//商品编号
					xml += "<prod_name>159cai_"+projid+"</prod_name>";//商品名称
					xml += "<prod_type></prod_type>";//佣金分类
					xml += "<amount>l</amount>";//商品数量
					xml += "<price>"+pp+"</price>";//商品金额
					xml += "<order_status>"+os+"</order_status>";//订单状态
					xml += "<payment_status>"+ps+"</payment_status>";//支付状态
					xml += "<payment_type>159cai</payment_type >";//支付方式
					xml += "<fare>0</fare>";//运费
					xml += "<favorable>0</favorable>";//优惠金额
					xml += "<favorable_code>0000</favorable_code>";//优惠券编号或积分卡卡号
					xml += "</order>";
				}
				xml += "</orders>";
				bean.setBusiXml(xml);
				logger.debug(bean.getBusiXml());
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc("查询成功");

				jrs.clear();
				jrs = null;
			} else {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("查询数据为空");
			}
		} catch (Exception e) {
			bean.setBusiErrCode(9002);
			bean.setBusiErrDesc("查询异常");
			logger.error("TradeBeanStub::fquery", e);
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
}
