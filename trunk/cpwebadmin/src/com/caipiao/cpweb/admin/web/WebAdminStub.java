package com.caipiao.cpweb.admin.web;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.caipiao.cpweb.auth.AuthUtil;
import com.mina.rbc.ServiceContext;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.dbpool.JdbcSqlMapping;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class WebAdminStub {

	private Logger logger;

	public WebAdminStub() {
		logger = LoggerFactory.getLogger("webadmin");
	}

	public void callSp(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect(bean.getDs());
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate(bean.getFid(), bean, map, jcn);
				if (ret != 0) {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("调用后台应用失败!");
					logger.error("调用存储过程失败 fid=" + bean.getFid());
				} else {
					if(bean.getBusiErrCode() == 0){
						if("u_login".equals(bean.getFid())){
							bean.setNid(bean.getUid());
							JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("query_admin_auths", bean, map, jcn);
							if (jrs != null) {
								bean.setBusiXml(jrs.toRawXmlString("row"));
							}
						} else if("admin_proj_cancel".equals(bean.getFid())){
							cancelBillSendMsg(0, bean.getGid(), bean.getHid(), jcn);
						} else if("admin_zh_cancel".equals(bean.getFid())){
							cancelBillSendMsg(1, bean.getGid(), bean.getHid()+"_"+bean.getDid(), jcn);
						} else if("cash_confirm".equals(bean.getFid())){
							if(bean.getSuccess() != null && bean.getSuccess().equals("4")){
								//pifu99bill(bean,jcn);
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error("调用存储过程出现异常 fid=" + bean.getFid(), e);
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("调用后台应用失败");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void update(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect(bean.getDs());
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				int ret = JdbcSqlMapping.executeUpdate(bean.getFid(), bean, map, jcn);
				if (ret >= 1) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("操作成功");
					
					if("audit_period_sale".equals(bean.getFid())){
						JdbcSqlMapping.executeUpdate("audit_ticket_period", bean, map, jcn);
					} else if("set_gameconfig".equals(bean.getFid())){
						String gid = StringUtil.LeftPad(bean.getGid(), "0", 2);
						String info = "彩种=" + gid + " value=" + bean.getBid();
						jcn.executeUpdate("insert into tbladminlog (irecid,cuserid,cmemo,cipaddr,ctype) values (seq_admin_log.nextval,?,?,?,'配置彩种')", new Object[]{bean.getUid(), info, bean.getIpAddr()});
						
						File file = new File("/opt/export/cpdata/game/" + gid + "/sale.json");
						BufferedWriter bw = new BufferedWriter(new FileWriter(file));
						bw.write("{\"gid\":\"" + gid + "\",\"sale\":\""+bean.getBid()+"\"}");
						bw.flush();
						bw.close();
					}
					
				} else {
					bean.setBusiErrCode(1);
					bean.setBusiErrDesc("操作失败");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	private void cancelBillSendMsg(int type, String gid, String projID, JdbcConnect jcn) {
		logger.info("type=" + type + " gid=" + gid + " projID=" + projID);
		String title = "";
		String content =  "";
		String sql = "";
		String cnickid = "";
		JdbcRecordSet jrs = null;
		
		if (type == 0) {// 是合买代购
			sql = "select cnickid,cperiodid from tb_proj_" + gid + " where cprojid = ? ";
			jrs = jcn.executeQuery(sql, new Object[] { projID });	
			if (jrs != null && jrs.size() > 0 && jrs.first()) {
				cnickid = jrs.get("cnickid");
				String pid=jrs.get("cperiodid");
				title = cnickid+Util.getGame(gid) + "第" + pid + "期 撤单提示";
				content = cnickid+Util.getGame(gid) + "第" + pid + "期 " + projID + "出票失败，已给您撤单返款，敬请谅解！【159彩票网】";					
				jrs.clear();
				jrs = null;
			}
		} else {// 是追号
			// 追号要进行退款处理
			String[] ss = StringUtil.splitter(projID, "_");
			String idetailid = ss[1];
			String zhid = ss[0];
			sql = "select cnickid,cperiodid from tb_zh_detail_" + gid + " where idetailid = ? ";
			jrs = jcn.executeQuery(sql, new Object[] { idetailid });
			if (jrs != null && jrs.size() > 0 && jrs.first()) {
				cnickid = jrs.get("cnickid");
				String pid=jrs.get("cperiodid");					
				title = cnickid+Util.getGame(gid) + "第" + pid + "期 追号撤单提示";										
				content = cnickid+Util.getGame(gid) + "第" + pid + "期 追号编号：" + zhid + " 明细编号：" + idetailid + "出票失败，已给您撤单返款，敬请谅解！【159彩票网】";				
				jrs.clear();
				jrs = null;
			}
		}
		logger.info("cnickid=" + cnickid + " title=" + title + " content=" + content);
		
		if (!StringUtil.isEmpty(cnickid) && !StringUtil.isEmpty(title) && !StringUtil.isEmpty(content)) {
			sql = "select cmobileno,imobbind from tb_user where cnickid = ?";
			jrs = jcn.executeQuery(sql, new Object[] { cnickid });
			if (jrs != null && jrs.size() > 0 && jrs.first()) {
				String cmobileno = jrs.get("cmobileno");
				int bind = jrs.getInt("imobbind");
				if(bind == 1){
					if (!StringUtil.isEmpty(cmobileno) && !StringUtil.isEmpty(content)) {
						sql = "insert into tb_sms(ismsid,crecphone,ccontents) values(seq_sms.nextval,?,?)";
						if (jcn.executeUpdate(sql, new Object[] { cmobileno, content }) != 1) {
							logger.error("新增短信消息 [失败]");
						}
					}
				}
				jrs.clear();
				jrs = null;
			}
		}
	}
	
	public void query(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect(bean.getDs());
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				logger.info(bean.getFid());
				logger.info(bean.getQagent());
				logger.info(bean.getSdate());
				logger.info(bean.getEdate());
				JdbcRecordSet jrs = JdbcSqlMapping.executeQuery(bean.getFid(), bean, map, jcn);
				if (jrs != null) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("查询成功");
					if (jrs.size() > 0) {
						bean.setBusiXml(jrs.toRawXmlString("row"));
					}

					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(9000);
					bean.setBusiErrDesc("查询无数据");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("查询出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	public void queryPage(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		String qkey = bean.getFid();
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect(bean.getDs());
			HashMap<String, String> map = new HashMap<String, String>();
			map.put("gid", bean.getGid());

			bean.check(bean.getFid());
			if (bean.getBusiErrCode() == 0) {
				if (bean.getPs() <= 0) {
					bean.setPs(25);
				}

				int rc = bean.getRc();
				if (rc == 0) {
					int count = JdbcSqlMapping.getQueryRows(qkey, bean, map, jcn);
					bean.setRc(count);
					if (count % bean.getPs() == 0) {
						bean.setTp(count / bean.getPs());
					} else {
						bean.setTp(count / bean.getPs() + 1);
					}
				}
				
				logger.info(bean.getFid());
				logger.info(bean.getQagent());
				logger.info(bean.getXagent());
				logger.info(bean.getSdate());
				logger.info(bean.getEdate());
				logger.info(bean.getPs()+"");
				logger.info(bean.getPn()+"");
				
				JdbcRecordSet jrs = null;
				JdbcRecordSet jrsc = null;
				boolean flag = true;
				if(!StringUtil.isEmpty(bean.getXagent())){
					jrsc = JdbcSqlMapping.executeQuery("query_agent_user_ishave", bean, map, jcn);
					if(jrsc != null&&jrsc.size() > 0){
						flag = true;
						jrsc.clear();
						jrsc = null;
					}else{
						flag = false;
					}
				}
				logger.info("---------是否存在下级-------------flag="+flag);
				
//				if("query_agent_salestat".equals(bean.getFid())){
//					String sql = "select cstatday statday, cgameid gid, isales sales,td.cagentid,t.apath"
//							+ " from tb_agent_day td,(select cagentid,sys_connect_by_path(cagentid,'/') apath from tb_agent start with cagentid=? connect by prior cagentid = cparentid) t"
//							+ " where td.cagentid=t.cagentid and td.cstatday >= ? and td.cstatday <= ?";
//					jrs = jcn.executeQuery(sql, new Object[]{bean.getQagent(),bean.getSdate(),bean.getEdate()},bean.getPs(), bean.getPn());
//				}else if("query_xagent_salestat".equals(bean.getFid())){
//					String sql = "select cstatday statday, cgameid gid, isales sales,td.cagentid,t.apath "
//							+ " from tb_agent_day td,(select cagentid,sys_connect_by_path(cagentid,'/') apath from tb_agent start with cagentid=? connect by prior cagentid = cparentid) t "
//							+ " where td.cagentid=t.cagentid and cstatday >= ? and cstatday <= ?";
//					jrs = jcn.executeQuery(sql, new Object[]{bean.getQagent(),bean.getSdate(),bean.getEdate()},bean.getPs(), bean.getPn());
//				}else{

//					jrs = JdbcSqlMapping.executeQuery(qkey, bean, map, bean.getPs(), bean.getPn(), jcn);
//				}
				if(flag){
					jrs = JdbcSqlMapping.executeQuery(qkey, bean, map, bean.getPs(), bean.getPn(), jcn);
				}
				if (jrs != null) {
					bean.setBusiErrCode(0);
					bean.setBusiErrDesc("查询成功");

					String xml = "<count tp=\"" + bean.getTp() + "\" rc=\"" + bean.getRc() + "\" pn=\"" + bean.getPn() + "\" ps=\"" + bean.getPs() + "\"/>\r\n";
					if (jrs.size() > 0) {
						xml += jrs.toRawXmlString("row");
					}
					bean.setBusiXml(xml);
					jrs.clear();
					jrs = null;
				} else {
					bean.setBusiErrCode(9000);
					bean.setBusiErrDesc("查询无数据");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(9001);
			bean.setBusiErrDesc("查询出现异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}

	

//	public void loadAgentTree(WebAdmin bean, ServiceContext context) {
//		JdbcConnect jcn = null;
//		try {
//			if(!StringUtil.isEmpty(bean.getRname())){
//				bean.setQagent(bean.getRname());
//				bean.setAgent(bean.getRname());
//			}
//			jcn = context.getJdbcPoolManager().getJdbcConnect();
//			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("query_agent_info", bean, null, jcn);
//			jrs.first();
//			
//			int [] arr = new int[]{0};
//			JXmlWapper xml = new JXmlWapper("agent");
//			xml.addStringValue("@id", bean.getAgent());
//			xml.addStringValue("@name", jrs.get("cagentname") + "[" + bean.getAgent() + "]");
//			xml.addStringValue("@state", jrs.get("istate"));
//			xml.addStringValue("@index", "" + arr[0]);
//			jrs.clear();
//			if(!StringUtil.isEmpty(bean.getRname())){
//				JXmlWapper xmlChild = xml.addXmlNode("node");
//				xmlChild.addStringValue("@id", bean.getAgent());
//				xmlChild.addStringValue("@name", jrs.get("cagentname") + "[" + bean.getAgent() + "]");
//				xmlChild.addStringValue("@state", jrs.get("istate"));
//				xmlChild.addStringValue("@index", "");
//				load_agent_tree(bean.getQagent(), xmlChild, arr, jcn);
//			}else{
//				load_agent_tree(bean.getQagent(), xml, arr, jcn);
//			}
//			bean.setBusiErrCode(0);
//			bean.setBusiErrDesc("成功");
//			bean.setBusiXml(xml.toXmlString().replaceAll("<\\?.+?\\?>", ""));
//			
//		} catch (Exception e) {
//			logger.error("WebAdminStub::loadAgentTree 异常  aid=" + bean.getAid() ,e);
//			bean.setBusiErrCode(2);
//			bean.setBusiErrDesc("调用异常");
//		} finally {
//			if (jcn != null) {
//				jcn.unlock();
//			}
//		}
//	}
//	
//	private void load_agent_tree(String agent, JXmlWapper xml, int [] arr, JdbcConnect jcn) throws Exception {
//		WebAdmin bean = new WebAdmin();
//		bean.setQagent(agent);
//		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("agent_query_child", bean, null, jcn);
//		if (jrs != null && jrs.size() > 0) {
//			while (jrs.next()) {
//				String aid = jrs.get("cagentid");
//				String name = jrs.get("cagentname");
//				String state = jrs.get("istate");
//				String agentseq = jrs.get("cagentseq");
//				arr[0] += 1;
//				JXmlWapper xmlChild = xml.addXmlNode("node");
//				xmlChild.addStringValue("@id", aid);
//				xmlChild.addStringValue("@name", name + "[" + aid + "]");
//				xmlChild.addStringValue("@state", state);
//				xmlChild.addStringValue("@index", "" + arr[0]);
//				xmlChild.addStringValue("@agentseq", agentseq);
//
//				load_agent_tree(aid, xmlChild, arr, jcn);
//			}
//			jrs.clear();
//		}
//		bean = null;
//	}
	
	
	public void loadAgentTree(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			if(!StringUtil.isEmpty(bean.getRname())){
				bean.setQagent(bean.getRname());
				bean.setAgent(bean.getRname());
			}
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("query_agent_info", bean, null, jcn);
			jrs.first();
			
			int [] arr = new int[]{0};
			JXmlWapper xml = new JXmlWapper("agent");
			xml.addStringValue("@id", bean.getAgent());
			xml.addStringValue("@name", jrs.get("cagentname") + "[" + bean.getAgent() + "]");
			xml.addStringValue("@state", jrs.get("istate"));
			xml.addStringValue("@index", "" + arr[0]);
			jrs.clear();
			String isParent = load_agent_tree(bean.getQagent(), xml, arr, jcn);
			xml.addStringValue("@isParent", isParent);
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("成功");
			logger.info(xml.toXmlString());
			bean.setBusiXml(xml.toXmlString().replaceAll("<\\?.+?\\?>", ""));
			
		} catch (Exception e) {
			logger.error("WebAdminStub::loadAgentTree 异常  aid=" + bean.getAid() ,e);
			bean.setBusiErrCode(2);
			bean.setBusiErrDesc("调用异常");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	private String load_agent_tree(String agent, JXmlWapper xml, int [] arr, JdbcConnect jcn) throws Exception {
		WebAdmin bean = new WebAdmin();
		bean.setQagent(agent);
		String flag = "0";
		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("agent_query_child", bean, null, jcn);
		if (jrs != null && jrs.size() > 0) {
			while (jrs.next()) {
				String aid = jrs.get("cagentid");
				String name = jrs.get("cagentname");
				String state = jrs.get("istate");
				arr[0] += 1;
				JXmlWapper xmlChild = xml.addXmlNode("node");
				xmlChild.addStringValue("@id", aid);
				xmlChild.addStringValue("@name", name + "[" + aid + "]");
				xmlChild.addStringValue("@state", state);
				xmlChild.addStringValue("@index", "" + arr[0]);

				WebAdmin cbean = new WebAdmin();
				cbean.setQagent(aid);
				int rc = JdbcSqlMapping.getRecordCount("agent_query_child_count", cbean, null, jcn);
				
				if(rc >0){
					xmlChild.addStringValue("@isParent", "1");
				}else{
					xmlChild.addStringValue("@isParent", "0");
				}
				cbean =null;
			}
			jrs.clear();
			flag = "1";
		}
		bean = null;
		return flag;
	}
	
	public void agentApplyCash(WebAdmin bean, ServiceContext context) {
		
		logger.info("agentApplyCash  agentid=" + bean.getAgent() + " money=" + bean.getMoney() + " uid=" + bean.getUid());
		
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			int ret = JdbcSqlMapping.executeUpdate("agent_cash", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("申请提现失败[" + bean.getAgent() + "]");
			}
		} catch (Exception e) {
			e.printStackTrace();
			bean.setBusiErrCode(2);
			bean.setBusiErrDesc("申请提现异常[" + bean.getAgent() + "]");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void agentTransfer(WebAdmin bean, ServiceContext context) {
		logger.info("agentTransfer  agentid=" + bean.getAgent() + " money=" + bean.getMoney() + " uid=" + bean.getUid());
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			int ret = JdbcSqlMapping.executeUpdate("agent_transfer", bean, null, jcn);
			if (ret != 0) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("转款失败[" + bean.getAgent() + "]");
			}else{
				if(bean.getBusiErrCode() != 0){
					logger.info("代理商转款: code = " + bean.getBusiErrCode() + "\t desc=" + bean.getBusiErrDesc());
				}
			}
			logger.info("ret = " + ret + " agentid=" + bean.getAgent() + " money=" + bean.getMoney() + " code=" + bean.getBusiErrCode() + " desc=" + bean.getBusiErrDesc());
		} catch (Exception e) {
			logger.info("agentid=" + bean.getAgent() + " money=" + bean.getMoney() + " code=" + bean.getBusiErrCode() + " desc=" + bean.getBusiErrDesc() + " error=" + e.getMessage());
			e.printStackTrace();
			bean.setBusiErrCode(2);
			bean.setBusiErrDesc("转款异常[" + bean.getAgent() + "]");
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	public void task(WebAdmin bean, ServiceContext context) {
		JdbcConnect jcn = null;
		try {
			jcn = context.getJdbcPoolManager().getJdbcConnect();
			StringBuilder sb = new StringBuilder();
			if("web".equals(bean.getAid())){
				web(sb, bean, jcn);
			}
			
			bean.setBusiXml(sb.toString());
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (jcn != null) {
				jcn.unlock();
			}
		}
	}
	
	private void web(StringBuilder sb, WebAdmin bean, JdbcConnect jcn){
		bean.setNid(bean.getUid());
		JdbcRecordSet jrs = JdbcSqlMapping.executeQuery("query_admin_auths", bean, null, jcn);
		if(jrs != null && jrs.size() > 0 && jrs.first()){
			String auth = jrs.get("cauth");
			HashMap<Integer, Long> auths = AuthUtil.getUserAuths(auth);
//			logger.info("uid=" + bean.getUid() + " auth=" + auth + " size=" + auths.size());
			String sql="";
			int num = 0;
			//派奖核对管理
			bean.setFid("audit_period_sale");
			if(SysAuthUtil.auth(bean, auths)){
				sql = "select count(1) num from tb_ticket_period where istate = 4 and iflag = 1";
				num = jcn.getRecordNums(sql);
				if(num > 0){
					sb.append("<row ");
					sb.append(JXmlUtil.createAttrXml("desc", "网站业务 有 " + num + " 个期次 [派奖核对管理] 待派奖!"));
					sb.append(" />");
				}
			}
		
	//		//短信
	//		bean.setFid("sms");
	//		if(SysAuthUtil.auth(bean, jcn)){
	//			sql = "select count(1) num from tb_sms where iflag=0 and cadddate>sysdate-2/24/60";
	//			num = jcn.getRecordNums(sql);
	//			if(num > 0){
	//				sb.append("<row ");
	//				sb.append(JXmlUtil.createAttrXml("desc", "网站业务 有 " + num + " 条短信 [业务管理-短信监控] 待发送!"));
	//				sb.append(" />");
	//			}
	//		}
	//		
	//		//邮件
	//		bean.setFid("email");
	//		if(SysAuthUtil.auth(bean, jcn)){
	//			sql = "select count(1) num from tb_mail where iflag=0 and cadddate>sysdate-2/24/60";
	//			num = jcn.getRecordNums(sql);
	//			if(num > 0){
	//				sb.append("<row ");
	//				sb.append(JXmlUtil.createAttrXml("desc", "网站业务 有 " + num + " 条邮件 [业务管理-邮件监控] 待发送!"));
	//				sb.append(" />");
	//			}
	//		}
		}
	}
}
