package com.caipiao.mob;

import java.util.Date;
import java.util.HashMap;

import com.caipiao.mob.match.Match;
import com.caipiao.mob.match.bd.BDMatch;
import com.caipiao.mob.match.gyj.GYJMatch;
import com.caipiao.mob.match.jclq.JCLQMatch;
import com.caipiao.mob.match.jczq.JCZQMatch;
import com.caipiao.mob.util.GameUtil;
import com.caipiao.mob.util.UserCheckUtil;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.util.StringUtil;

public class BeanStub {
	
	private static HashMap<String, String> grades = new HashMap<String, String>();
	static{
		grades.put("01", "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖");
		grades.put("03", "直选,组选三,组选六");
		grades.put("04", "五星,三星,两星,一星,大小单双,二星组选,五星通选一等奖,五星通选二等奖,五星通选三等奖");
		grades.put("05", "和值,三同号通选,三同号单选,三不同号,三连号通选,二同号复选,二同号单选,二不同号");
		grades.put("07", "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖");
		grades.put("50", "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖,七等奖,八等奖,生肖乐,追加一等奖,追加二等奖,追加三等奖,追加四等奖,追加五等奖,追加六等奖,追加七等奖");
		grades.put("51", "一等奖,二等奖,三等奖,四等奖,五等奖,六等奖");
		grades.put("52", "一等奖");
		grades.put("53", "直选,组三,组六");
		grades.put("54", "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选");
		grades.put("56", "前一直选,任选二,任选三,任选四,任选五,任选六,任选七,任选八,前二直选,前三直选,前二组选,前三组选");
		grades.put("80", "一等奖,二等奖");
		grades.put("81", "一等奖");
		grades.put("82", "一等奖");
		grades.put("83", "一等奖");
	}
	
	public String getSpecialTimeRange(String gid, String endTime) {
		if(GameUtil.isBD(gid)){
			String start = "2013-02-08 23:30:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameUtil.isJCZQ(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameUtil.isJCLQ(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}else if(GameUtil.isGYJ(gid)){
			String start = "2013-02-08 22:35:00";
			String end = "2013-02-16 00:00:00";
			if(endTime.compareTo(start) >= 0 && endTime.compareTo(end) <= 0){
				return start;
			}
		}
		return endTime;
	}

	public String getMaxPrizeInfo(String gameid){
		if(gameid.equals(GameUtil.GameContains.FC_SSQ)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.FC_3D)){
			return "1000";
		} else if(gameid.equals(GameUtil.GameContains.KP_CQ_SSC)){
			return "20440";
		} else if(gameid.equals(GameUtil.GameContains.FC_QLC)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.KP_JX_SSC)){
			return "20460";
		} else if(gameid.equals(GameUtil.GameContains.TC_DLT)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.TC_QXC)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.TC_PL5)){
			return "10万";
		} else if(gameid.equals(GameUtil.GameContains.TC_PL3)){
			return "1000";
		} else if(gameid.equals(GameUtil.GameContains.KP_JX_11C5)){
			return "540";
		} else if(gameid.equals(GameUtil.GameContains.KP_GD_11C5)){
			return "540";
		} else if(gameid.equals(GameUtil.GameContains.KP_SD_11C5)){
			return "540";
		} else if(gameid.equals(GameUtil.GameContains.ZC_SFC)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.ZC_RX9)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.ZC_JQS)){
			return "500万";
		} else if(gameid.equals(GameUtil.GameContains.ZC_BQC)){
			return "500万";
		}
		return "";
	}
	
	public String getGamePrizeTag(String gameid){
		String tag = "";
		if(gameid.equals(GameUtil.GameContains.FC_SSQ)){
			tag = "2元可中1000万";
		} else if(gameid.equals(GameUtil.GameContains.FC_3D)){
			tag = "天天开奖，轻松赢千元";
		} else if(gameid.equals(GameUtil.GameContains.KP_CQ_SSC)){
			tag = "天天开奖，每天120期";
		} else if(gameid.equals(GameUtil.GameContains.FC_QLC)){
			tag = "2元可中500万";
		} else if(gameid.equals(GameUtil.GameContains.KP_JX_SSC)){
			tag = "天天开奖，每天84期";
		} else if(gameid.equals(GameUtil.GameContains.TC_DLT)){
			tag = "3元可中1600万";
		} else if(gameid.equals(GameUtil.GameContains.TC_QXC)){
			tag = "2元可中500万";
		} else if(gameid.equals(GameUtil.GameContains.TC_PL5)){
			tag = "天天开奖，2元赢10万";
		} else if(gameid.equals(GameUtil.GameContains.TC_PL3)){
			tag = "天天开奖，轻松赢千元";
		} else if(gameid.equals(GameUtil.GameContains.KP_JX_11C5)){
			tag = "返奖率59%，期期好运气";
		} else if(gameid.equals(GameUtil.GameContains.KP_GD_11C5)){
			tag = "返奖率59%，期期好运气";
		} else if(gameid.equals(GameUtil.GameContains.KP_SD_11C5)){
			tag = "返奖率59%，期期好运气";
		} else if(gameid.equals(GameUtil.GameContains.ZC_SFC)){
			tag = "猜中14场，轻松500万";
		} else if(gameid.equals(GameUtil.GameContains.ZC_RX9)){
			tag = "随便猜9场，大奖等你拿";
		} else if(gameid.equals(GameUtil.GameContains.ZC_JQS)){
			tag = "6场半全场，猜对好运来";
		} else if(gameid.equals(GameUtil.GameContains.ZC_BQC)){
			tag = "4场进球数，一球定乾坤";
		} else if(GameUtil.isJCZQ(gameid) || GameUtil.isJCLQ(gameid)){
			tag = "返奖69%，竞猜乐不停";
		}
		return tag;
	}
	
	public int getPageSize(){
		return 10;
	}
	
	public String getGradeInfo(String gameid){
		return grades.get(gameid);
	}
	
	public boolean check(BaseBean bean) {
		boolean flag = false;
		if(StringUtil.isEmpty(bean.getUser())){
			bean.setErrJson(Status.USER_IS_EMPTY.CODE, Status.USER_IS_EMPTY.DESC);
			return flag;
		}
		
		if(!UserCheckUtil.CheckUserName(bean.getUser())){
			bean.setErrJson(Status.USER_IS_NOT_VALID.CODE, Status.USER_IS_NOT_VALID.DESC);
			return flag;
		}
		
		if(StringUtil.isEmpty(bean.getPassword())){
			bean.setErrJson(Status.PASSWORD_IS_EMPTY.CODE, Status.PASSWORD_IS_EMPTY.DESC);
			return flag;
		}
		
		if(bean.getVersion() < 0){
			bean.setErrJson(Status.VERSION_IS_NOT_VALID.CODE, Status.VERSION_IS_NOT_VALID.DESC);
			return flag;
		}
		return true;
	}
	
	public boolean checkUser(BaseBean bean, JdbcConnect jcn){
		int rc = JdbcSqlMapping.getRecordCount("mob_check_user", bean, null, jcn);
		if(rc == 1){
			 return true;
		}else {
			bean.setErrJson(Status.FAILURE.CODE, "用户名或密码错误");
		}
		return false;
	}
	
	private String formatMatches(String matches){
		String [] ms = StringUtil.splitter(matches, ",");
		StringBuilder sb = new StringBuilder();
		for(int i = 0; i < ms.length; i++){
			if(!StringUtil.isEmpty(ms[i])){
				sb.append("'" + ms[i] + "'").append(",");
			}
		}
		String match = sb.toString();
		if(match.endsWith(",")){
			match = match.substring(0, match.length() - 1);
		}
		return match;
	}
	
	protected HashMap<String, Match> getBDMatch(JdbcRecordSet jrs){
		HashMap<String, Match> maps = new HashMap<String, Match>();
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			for(int i = 0; i < jrs.size(); i++){
				BDMatch bd = new BDMatch();
				bd.setMatchID(jrs.get("imatchid", i));
				bd.setMatchName(jrs.get("cmatchname", i));
				bd.setHomeName(jrs.get("cmname", i));
				bd.setVisitName(jrs.get("csname", i));
				bd.setMatchTime(jrs.get("cmatchtime", i));
				bd.setState(jrs.getInt("istate", i));
				bd.setLose(jrs.getInt("close", i));
				int audit = jrs.getInt("iaudit", i);
				int cancel = jrs.getInt("icancel", i);
				bd.setAudit(audit);
				bd.setCancel(cancel);
				if(audit == 1){
					if(cancel != 1){
						bd.setHalfHomeScore(jrs.getInt("chmscore", i));
						bd.setHalfVisitScore(jrs.getInt("chsscore", i));
						bd.setHomeScore(jrs.getInt("cmscore", i));
						bd.setVisitScore(jrs.getInt("csscore", i));
					}
				}
				maps.put(bd.getMatchID(), bd);
			}
		}
		return maps;
	}
	
	protected HashMap<String, Match> getJCZQMatch(JdbcRecordSet jrs){
		HashMap<String, Match> maps = new HashMap<String, Match>();
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			for(int i = 0; i < jrs.size(); i++){
				JCZQMatch jczq = new JCZQMatch();
				jczq.setMatchID(jrs.get("citemid", i));
				jczq.setMatchName(jrs.get("cmatchname", i));
				jczq.setHomeName(jrs.get("cmname", i));
				jczq.setVisitName(jrs.get("csname", i));
				jczq.setMatchTime(jrs.get("cmatchtime", i));
				jczq.setState(jrs.getInt("istate", i));
				jczq.setLose(jrs.getInt("close", i));
				int audit = jrs.getInt("iaudit", i);
				int cancel = jrs.getInt("icancel", i);
				jczq.setAudit(audit);
				jczq.setCancel(cancel);
				if(audit == 1){
					if(cancel != 1){
						jczq.setHalfHomeScore(jrs.getInt("chmscore", i));
						jczq.setHalfVisitScore(jrs.getInt("chsscore", i));
						jczq.setHomeScore(jrs.getInt("cmscore", i));
						jczq.setVisitScore(jrs.getInt("csscore", i));
					}
				}
				maps.put(jczq.getMatchID(), jczq);
			}
		}
		return maps;
	}
	
	protected HashMap<String, Match> getJCLQMatch(JdbcRecordSet jrs){
		HashMap<String, Match> maps = new HashMap<String, Match>();
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			for(int i = 0; i < jrs.size(); i++){
				JCLQMatch jclq = new JCLQMatch();
				jclq.setMatchID(jrs.get("citemid", i));
				jclq.setMatchName(jrs.get("cmatchname", i));
				jclq.setHomeName(jrs.get("cmname", i));
				jclq.setVisitName(jrs.get("csname", i));
				jclq.setMatchTime(jrs.get("cmatchtime", i));
				jclq.setState(jrs.getInt("istate", i));
				jclq.setLose(Double.parseDouble(jrs.get("close", i)));
				jclq.setZlose(Double.parseDouble(jrs.get("zclose", i)));
				int audit = jrs.getInt("iaudit", i);
				int cancel = jrs.getInt("icancel", i);
				jclq.setAudit(audit);
				jclq.setCancel(cancel);
				if(audit == 1){
					if(cancel != 1){
						jclq.setHomeScore(jrs.getInt("cmscore", i));
						jclq.setVisitScore(jrs.getInt("csscore", i));
					}
				}
				maps.put(jclq.getMatchID(), jclq);
			}
		}
		return maps;
	}
	
	protected HashMap<String, Match> getJCLQMatch(JdbcRecordSet jrs,JdbcRecordSet jrs2,Date spDate){
		HashMap<String, Match> maps = new HashMap<String, Match>();
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			for(int i = 0; i < jrs.size(); i++){
				JCLQMatch jclq = new JCLQMatch();
				jclq.setMatchID(jrs.get("citemid", i));
				jclq.setMatchName(jrs.get("cmatchname", i));
				jclq.setHomeName(jrs.get("cmname", i));
				jclq.setVisitName(jrs.get("csname", i));
				jclq.setMatchTime(jrs.get("cmatchtime", i));
				jclq.setState(jrs.getInt("istate", i));
				jclq.setLose(Double.parseDouble(jrs.get("close", i)));
				jclq.setZlose(Double.parseDouble(jrs.get("zclose", i)));
				int audit = jrs.getInt("iaudit", i);
				int cancel = jrs.getInt("icancel", i);
				jclq.setAudit(audit);
				jclq.setCancel(cancel);
				if(audit == 1){
					if(cancel != 1){
						jclq.setHomeScore(jrs.getInt("cmscore", i));
						jclq.setVisitScore(jrs.getInt("csscore", i));
					}
				}
				maps.put(jclq.getMatchID(), jclq);
			}
		}
		if(jrs2 != null && jrs2.size() > 0 && jrs2.first()){
			for(int i = 0; i < jrs2.size(); i++){
				String matchID = jrs2.get("citemid", i);
				String gameID = jrs2.get("cgameid",i);
				if(!gameID.equals("95") && !gameID.equals("97")) continue;
				Date date = jrs2.getDate("cadddate",i);
				if(spDate.before(date)) continue;
					
				
				JCLQMatch jclq = (JCLQMatch) maps.get(matchID);
				String sp = jrs2.get("cvalue",i);
				
				if(gameID.equals("95")){
					String[] sps = sp.split(",");
					if(sps != null & sps.length >= 1){
						jclq.setLose(Double.parseDouble(sps[0]));
					}
				}else if(gameID.equals("97")){
					String[] sps = sp.split(",");
					if(sps != null & sps.length >= 1){
						jclq.setZlose(Double.parseDouble(sps[0]));
					}
				}
				
				maps.put(jclq.getMatchID(), jclq);
			}
		}
		return maps;
	}
	
	public HashMap<String, Match> getMatchFromDB(String gameid, String periodid, String matchs,Date spDate, JdbcConnect jcn){
		HashMap<String, Match> maps = new HashMap<String, Match>();
		if(!StringUtil.isEmpty(matchs)){
			String match = formatMatches(matchs);
			if(GameUtil.isBD(gameid)){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_bd where cperiodid=? and imatchid in (" + match + ")", new Object[]{periodid});
				maps.putAll(getBDMatch(jrs));
			} else if(GameUtil.isJCZQ(gameid)){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_jczq t where citemid in (" + match + ")", new Object[0]);
				maps.putAll(getJCZQMatch(jrs));
			} else if(GameUtil.isJCLQ(gameid)){
				JdbcRecordSet jrs = jcn.executeQuery("select * from tb_match_jclq t where citemid in (" + match + ")", new Object[0]);
				JdbcRecordSet jrs2 = jcn.executeQuery("select * from tb_sp_jclq t where citemid in (" + match + ") order by cadddate", new Object[0]);
				maps.putAll(getJCLQMatch(jrs,jrs2,spDate));
			} else if(GameUtil.isGYJ(gameid)){
				JdbcRecordSet jrs = jcn.executeQuery("select t.*,t.rowid from tb_match_jcmc t where cgameid=? and cperiodid=? and imatchid in (" + match + ")", new Object[]{gameid, periodid});
				if(jrs != null && jrs.size() > 0 && jrs.first()){
					for(int i = 0; i < jrs.size(); i++){
						GYJMatch gyj = new GYJMatch();
						gyj.setMatchID(jrs.get("imatchid", i));
						gyj.setHomeName(jrs.get("cname", i));
						gyj.setMatchTime(jrs.get("cendtime", i));
						gyj.setState(jrs.getInt("istate", i));
						int audit = jrs.getInt("iaudit", i);
						int cancel = jrs.getInt("icancel", i);
						gyj.setAudit(audit);
						gyj.setCancel(cancel);
						if(audit == 1){
							if(cancel != 1){
								gyj.setHomeScore(jrs.getInt("iresult", i));
							}
						}
						maps.put(gyj.getMatchID(), gyj);
					}
				}
			}
		}
		return maps;
	}
	
	public String reverse(String str, String split){
		String [] ps = StringUtil.splitter(str, split);
		StringBuffer sb = new StringBuffer();
		for(int i = ps.length-1; i >= 0; i--){
			sb.append(ps[i]);
			if(i != 0){
				sb.append(split);
			}
		}
		return sb.toString();
	}
	
	public String getNewCode(String type, String code, int addtional){
		String [] codes = StringUtil.splitter(code, "^");
		String gid = GameUtil.getGameIDByDyjName(type);
		StringBuffer sb = new StringBuffer();
		if(GameUtil.GameContains.TC_DLT.equals(type) || GameUtil.GameContains.TC_DLT.equals(gid)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					String [] ps = StringUtil.splitter(c, "-");
					if(ps.length > 1){
						if(addtional == 1){
							sb.append(ps[1]).append(":2:1").append(";");
						} else {
							sb.append(ps[1]).append(":1:1").append(";");
						}
					}
				}
			}
		} else if(GameUtil.GameContains.FC_SSQ.equals(type) || GameUtil.GameContains.FC_SSQ.equals(gid)
				|| GameUtil.GameContains.TC_PL5.equals(type) || GameUtil.GameContains.TC_PL5.equals(gid)
				|| GameUtil.GameContains.ZC_SFC.equals(type) || GameUtil.GameContains.ZC_SFC.equals(gid)
				|| GameUtil.GameContains.ZC_RX9.equals(type) || GameUtil.GameContains.ZC_RX9.equals(gid)
				|| GameUtil.GameContains.ZC_JQS.equals(type) || GameUtil.GameContains.ZC_JQS.equals(gid)
				|| GameUtil.GameContains.ZC_BQC.equals(type) || GameUtil.GameContains.ZC_BQC.equals(gid)
				){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					String [] ps = StringUtil.splitter(c, "-");
					if(ps.length > 1){
						sb.append(ps[1]).append(":1:1").append(";");
					}
				}
			}
		} else if(GameUtil.GameContains.FC_3D.equals(type) || GameUtil.GameContains.FC_3D.equals(gid)
				|| GameUtil.GameContains.TC_PL3.equals(type) || GameUtil.GameContains.TC_PL3.equals(gid)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					String [] ps = StringUtil.splitter(c, "-");
					if(ps.length > 1){
						if("fs".equals(ps[0].trim())){
							sb.append(ps[1]).append(":1:1").append(";");
						} else if("zs_bh".equals(ps[0].trim())){
							sb.append(ps[1]).append(":2:3").append(";");
						} else if("zl_bh".equals(ps[0].trim())){
							sb.append(ps[1]).append(":3:3").append(";");
						}
					}
				}
			}
		} else if(GameUtil.GameContains.KP_JX_11C5.equals(type) || GameUtil.GameContains.KP_JX_11C5.equals(gid)
				|| GameUtil.GameContains.KP_SD_11C5.equals(type) || GameUtil.GameContains.KP_SD_11C5.equals(gid)
				|| GameUtil.GameContains.KP_GD_11C5.equals(type) || GameUtil.GameContains.KP_GD_11C5.equals(gid)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					String [] ps = StringUtil.splitter(c, "-");
					if(ps.length > 1){
						if("q1_zhix".equals(ps[0].trim())){
							sb.append(ps[1]).append(":1:1").append(";");
						} else if("rx_2".equals(ps[0].trim())){
							sb.append(ps[1]).append(":2:1").append(";");
						} else if("rx_3".equals(ps[0].trim())){
							sb.append(ps[1]).append(":3:1").append(";");
						} else if("rx_4".equals(ps[0].trim())){
							sb.append(ps[1]).append(":4:1").append(";");
						} else if("rx_5".equals(ps[0].trim())){
							sb.append(ps[1]).append(":5:1").append(";");
						} else if("rx_6".equals(ps[0].trim())){
							sb.append(ps[1]).append(":6:1").append(";");
						} else if("rx_7".equals(ps[0].trim())){
							sb.append(ps[1]).append(":7:1").append(";");
						} else if("rx_8".equals(ps[0].trim())){
							sb.append(ps[1]).append(":8:1").append(";");
						} else if("q2_zhix".equals(ps[0].trim())){
							sb.append(ps[1].replaceAll(",", "|")).append(":9:1").append(";");
						} else if("q3_zhix".equals(ps[0].trim())){
							sb.append(ps[1].replaceAll(",", "|")).append(":10:1").append(";");
						} else if("zx_2".equals(ps[0].trim())){
							sb.append(ps[1]).append(":11:1").append(";");
						} else if("zx_3".equals(ps[0].trim())){
							sb.append(ps[1]).append(":12:1").append(";");
						}
					}
				}
			}
		} else if(GameUtil.isJCZQ(type)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					if(c.trim().startsWith("SPF") || c.trim().startsWith("CBF") || c.trim().startsWith("BQC") || c.trim().startsWith("JQS")){
						sb.append(c.trim()).append(";");
					} else if(c.trim().startsWith("RQSPF")){
						sb.append(c.trim().replaceAll("RQSPF","RSPF")).append(";");
					} else if(c.trim().startsWith("HH")){
						String [] ps = StringUtil.splitter(c, "|");
						if(ps.length > 2){
							StringBuffer ssb = new StringBuffer();
							String [] items = StringUtil.splitter(ps[1].trim(), ",");
							for(String item : items){
								String [] ps_items = StringUtil.splitter(item, ">");
								if(ps_items.length > 1){
									String [] cs = StringUtil.splitter(ps_items[1], "=");
									if(cs.length > 1){
										String prefix = ps_items[0].trim();
										if("RQSPF".equals(prefix)){
											prefix = "RSPF";
										}
										ssb.append(cs[0].trim()).append(">").append(prefix).append("=").append(cs[1].trim()).append(",");
									}
								}
							}
							String items_str = ssb.toString();
							if(items_str.endsWith(",")){
								items_str = items_str.substring(0, items_str.length() - 1);
							}
							if(!StringUtil.isEmpty(items_str)){
								sb.append(ps[0].trim()).append("|").append(items_str).append("|").append(ps[2].trim()).append(";");
							}
						}
					} else {//智能投注  倍数|投注号码
						String [] ps = StringUtil.splitter(c, "|");
						if(ps.length == 4){
							int num = 0;
							try {
								num = Integer.parseInt(ps[0]);
								for(int i = 0; i < num; i++){
									sb.append(c.substring(c.indexOf("|") + 1)).append(";");
								}
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
					}
				}
			}
		} else if(GameUtil.isJCLQ(type)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					if(c.trim().startsWith("SF") || c.trim().startsWith("RFSF") || c.trim().startsWith("SFC") || c.trim().startsWith("DXF")){
						sb.append(c.trim()).append(";");
					} else if(c.trim().startsWith("HH")){
						String [] ps = StringUtil.splitter(c, "|");
						if(ps.length > 2){
							StringBuffer ssb = new StringBuffer();
							String [] items = StringUtil.splitter(ps[1].trim(), ",");
							for(String item : items){
								String [] ps_items = StringUtil.splitter(item, ">");
								if(ps_items.length > 1){
									String [] cs = StringUtil.splitter(ps_items[1], "=");
									if(cs.length > 1){
										ssb.append(cs[0].trim()).append(">").append(ps_items[0].trim()).append("=").append(cs[1].trim()).append(",");
									}
								}
							}
							String items_str = ssb.toString();
							if(items_str.endsWith(",")){
								items_str = items_str.substring(0, items_str.length() - 1);
							}
							if(!StringUtil.isEmpty(items_str)){
								sb.append(ps[0].trim()).append("|").append(items_str).append("|").append(ps[2].trim()).append(";");
							}
						}
					}
				}
			}
		} else if (GameUtil.isBD(type)){
			for(String c : codes){
				if(!StringUtil.isEmpty(c)){
					sb.append(c.trim()).append(";");
				}
			}
		}
		
		String tmp = sb.toString();
		if(tmp.endsWith(";")){
			tmp = tmp.substring(0 , tmp.length() - 1);
		}
		return tmp;
	}
}
