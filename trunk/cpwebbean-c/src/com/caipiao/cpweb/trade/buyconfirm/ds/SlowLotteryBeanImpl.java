package com.caipiao.cpweb.trade.buyconfirm.ds;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.trade.ConfigUtil;
import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.upload.FileCastServlet;
import com.caipiao.cpweb.upload.FileUpload;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class SlowLotteryBeanImpl  extends BaseImpl{
	public static Logger logger = LoggerFactory.getLogger("web");

	
	private int maxPostSize = 50 * 1024 * 1024;
	private final String UPFILE = "upfile";

	/**
	 * 第一次上传临时文件
	 * @throws Exception
	 */
	public int project_fqck_ds(SlowLotteryBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		FileUpload upload = null;
		try {
			long ustime = System.currentTimeMillis();
			System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
			
			try {
				// 构造对象
				upload = new FileUpload(request, FileCastServlet.PATH + File.separator, new String[] { "txt" }, this.maxPostSize);
			} catch (Exception e) {
				throw new Exception("上传发生错误");
			}

			long uetime = System.currentTimeMillis();
			System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
			System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
			System.out.println("文件保存位置：" + FileCastServlet.PATH + File.separator);
			
			
			// 获取参数
			File file = null;
			upload.getRequestField("lotid");
			String gid = StringUtil.getNullString(upload.getRequestField("gid"));// 游戏编号
			String pid = StringUtil.getNullString(upload.getRequestField("pid"));// 期次编号
			int play = StringUtil.getNullInt(upload.getRequestField("playid"));// 玩法
			String codes = StringUtil.getNullString(upload.getRequestField("codes"));// 投注号码（文件投注的文件名）

			int muli = StringUtil.getNullInt(upload.getRequestField("multiple"));// 投注倍数
//			int fflag = StringUtil.getNullInt(upload.getRequestField("fflag"));// 文件标志（0是号码
																				// 1
																				// 是文件）
//			System.out.println("fflag="+fflag);
//			int type = StringUtil.getNullInt(upload.getRequestField("type"));// 方案类型(0代购1合买)
//			String name = StringUtil.getNullString(upload.getRequestField("name"));// 方案标题
//			String desc = StringUtil.getNullString(upload.getRequestField("desc"));// 方案描叙
			int money = StringUtil.getNullInt(upload.getRequestField("totalmoney"));// 方案金额
//			int tnum = StringUtil.getNullInt(upload.getRequestField("tnum"));// 方案份数
//			int bnum = StringUtil.getNullInt(upload.getRequestField("bnum"));// 购买份数
//			int pnum = StringUtil.getNullInt(upload.getRequestField("pnum"));// 保底份数
//			int oflag = StringUtil.getNullInt(upload.getRequestField("oflag"));// 公开标志
//			int wrate = StringUtil.getNullInt(upload.getRequestField("wrate"));// 提成比率
//			String comeFrom = StringUtil.getNullString(upload.getRequestField("comeFrom"));// 方案来源
//			int source = StringUtil.getNullInt(upload.getRequestField("source"));// 投注来源
//			String endTime = StringUtil.getNullString(upload.getRequestField("endTime"));// 截止时间

			int ishsc = StringUtil.getNullInt(upload.getRequestField("ishsc"));// 是否后上传
			String hid = StringUtil.getNullString(upload.getRequestField("hid"));// 方案编号
			String ishm = StringUtil.getNullString(upload.getRequestField("ishm"));
			String wtype = StringUtil.getNullString(upload.getRequestField("wtype"));//投注类型
			int zhushu = StringUtil.getNullInt(upload.getRequestField("zhushu"));//注数
			int price = StringUtil.getNullInt(upload.getRequestField("price"));//单注金额
			String wtype2 = StringUtil.getNullString(upload.getRequestField("wtype2"));//zhx,z3,z6
			
			bean.setGid(gid);// 游戏编号
			bean.setPid(pid);// 期次编号
			bean.setPlay(play);// 玩法
			bean.setCodes(codes);// 投注号码（文件投注的文件名）
			bean.setMuli(muli);// 投注倍数
//			bean.setFflag(fflag);// 文件标志（0 是号码 1 是文件）
//			bean.setType(type);// 方案类型(0代购 1合买)
//			bean.setName(name);// 方案标题
//			bean.setDesc(desc);// 方案描叙
			bean.setMoney(money);// 方案金额
			bean.setWtype(wtype);//投注类型pt/sc/dt
//			bean.setTnum(tnum);// 方案份数
//			bean.setBnum(bnum);// 购买份数
//			bean.setPnum(pnum);// 保底份数
//			bean.setOflag(oflag);// 公开标志
//			bean.setWrate(wrate);// 提成比率
//			bean.setComeFrom(comeFrom);// 方案来源
//			bean.setSource(source);// 投注来源
//			bean.setEndTime(endTime);// 截止时间
			
			
//			String filename = gid + "_" + pid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_" + FileUpload.getFileName(bean.getUid(), gid, pid).toLowerCase();
			String filename = MD5Util.compute(UUID.randomUUID().toString());
			bean.setRand(filename);
			
			upload.setFileName(UPFILE, filename);

			file = upload.getFile(UPFILE);

//			String filename1 = FileUpload.getFileName(bean.getUid(), bean.getGid(), bean.getPid()).toLowerCase();
//			bean.setRand1(filename1);// 发起成功后的文件名

			System.out.println("bean.getGid：" + bean.getGid());
			System.out.println("filename：" + filename);

			upload.setFileName(UPFILE, filename);
			file = upload.getFile(UPFILE);

			if (file != null) {// 如果有上传文件的话
				codes = file.getName().toLowerCase();
				long cstime = System.currentTimeMillis();
				System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

				GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
				
				if(plugin != null){
					FileInputStream fis = new FileInputStream(file);

					BufferedReader br = new BufferedReader(new InputStreamReader(fis));
 
					FileOutputStream output = null;
					StringBuffer sb = new StringBuffer();
					StringBuilder builder = new StringBuilder();
					String temp = null;
					int total = 0;
					StringBuffer sb1 = new StringBuffer();
					while ((temp = br.readLine()) != null) {
						temp = temp.trim();
						if(gid.equals("81")){
							temp = temp.replaceAll("\\*", "#");
							sb1.append(temp+"\n");
						}
						if (temp.length() > 0) {
							if (temp.indexOf(",") >= 0) {
								builder.append(temp).append("$");
								if (temp.indexOf(":") < 0) {
									sb.append(temp + ":" + play + ":1;");
								} else {
									sb.append(temp).append(";");
								}
							} else {
								for (int i = 0; i < temp.length(); i++) {
									sb.append(temp.charAt(i));
									if (i != temp.length() - 1) {
										sb.append(",");
									}
								}
								builder.append(temp.toString()).append("$");
								sb.append(":").append(play).append(":1;");
							}
						}
					}
					fis.close();
					if(sb1.length() >0 && gid.equals("81")){
						output = new FileOutputStream(file);
						output.write(sb1.toString().getBytes());
						output.flush();
						output.close();
					}
					
					String s = new String(sb);
					builder = builder.deleteCharAt(builder.lastIndexOf("$"));
					bean.setCodes(builder.toString());
					if (s.length() > 0) {
						s = s.substring(0, s.length() - 1);
					}
					try {

						GameCastCode[] gcc = plugin.parseGameCastCodes(s);
						for (int i = 0; i < gcc.length; i++) {
							total += gcc[i].getCastMoney();
						}
					} catch (Exception e) {
						throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
																					// e.getMessage()
					}
					if (money > 0 && money != total * muli) {
						throw new Exception("上传文件总金额(" + total * muli + ")与输入总金额(" + money + ")不一致！");
					}
				}
				
				long cetime = System.currentTimeMillis();
				System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
				System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
			}
			
				System.out.println("bean.getCodes()==========>>>"+bean.getCodes());
				request.setAttribute("errcode", "0");
				request.setAttribute("multiple", bean.getMuli());
			    if(bean.getCodes().equals("notxt")){
			    	request.setAttribute("codes", bean.getCodes());
			    }else{
			    	request.setAttribute("codes", bean.getRand());
			    }
//				request.setAttribute("dtcodes", bean.getDtcodes());
				request.setAttribute("pid", bean.getPid());
				request.setAttribute("gid", bean.getGid());
				request.setAttribute("playid", bean.getPlay());
				System.out.println("============>>>bean.getGid():"+bean.getGid());
				request.setAttribute("playename", ConfigUtil.playename.get(bean.getGid()));
//				request.setAttribute("playmoneylimit", playmoneylimit.get(bean.getGid()));
				request.setAttribute("totalmoney", bean.getMoney());
				request.setAttribute("wtype", bean.getWtype());
				request.setAttribute("wtype2", bean.getWtype2());
				request.setAttribute("rand", bean.getRand());
				request.setAttribute("zhushu", zhushu);	
				request.setAttribute("price", price);
				request.setAttribute("ishsc", ishsc);
				request.setAttribute("wtype2", wtype2);
//				request.setAttribute("isdt", bean.getIsdt());	
				request.setAttribute("chtml", "");
				//request.setAttribute("chtml", BettingDetails.getBettingDeailsByLotID(bean.getGid(), bean.getWtype(), bean.getCodes()));
			
		} catch (Exception e) {
			uploadErr(request, e, upload);
		}
		
		return 0;
	}
	
	/**
	 * 过滤后生成方案
	 * @throws Exception
	 */
	public int project_dscreate(SlowLotteryBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		String uid = null;
		String pwd = null;
		try {
			System.out.println("bean.getRand()========>>>"+bean.getRand());
			
			
			// 检查是否登录
			HttpSession session = request.getSession();
			uid = (String) session.getAttribute(UID_KEY);
			pwd = (String) session.getAttribute(PWD_KEY);

			if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
				throw new Exception("尚未登录！");
			}
			
			File file = null;
			String codes = bean.getCodes();
			
			if(!bean.getCodes().equals("notxt")){
				file = new File(FileCastServlet.PATH + File.separator + File.separator + bean.getRand() + ".txt");
				if (!file.exists()) {
					throw new Exception("上传文件不存在 请从正确途径提交方案");
				}
				
				codes = file.getName().toLowerCase();
				if(null != file){
					long cstime = System.currentTimeMillis();
					System.out.println("文件解析：" + DateUtil.getCurrentDateTime());
		
					GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(bean.getGid());
					
					int play = bean.getPlay();
					int money = bean.getMoney();
					int muli = bean.getMuli();
					if (plugin != null) {
		
						FileInputStream fis = new FileInputStream(file);
		
						BufferedReader br = new BufferedReader(new InputStreamReader(fis));
		
						StringBuffer sb = new StringBuffer();
						String temp = null;
						int total = 0;
		
						while ((temp = br.readLine()) != null) {
							temp = temp.trim();
							if (temp.length() > 0) {
								if (temp.indexOf(",") >= 0) {
									if (temp.indexOf(":") < 0) {
										sb.append(temp + ":" + play + ":1;");
									} else {
										sb.append(temp).append(";");
									}
								} else {
									for (int i = 0; i < temp.length(); i++) {
										sb.append(temp.charAt(i));
										if (i != temp.length() - 1) {
											sb.append(",");
										}
									}
									sb.append(":").append(play).append(":1;");
								}
							}
						}
						fis.close();
		
						String s = new String(sb);
						if (s.length() > 0) {
							s = s.substring(0, s.length() - 1);
						}
						try {
		
							GameCastCode[] gcc = plugin.parseGameCastCodes(s);
							for (int i = 0; i < gcc.length; i++) {
								total += gcc[i].getCastMoney();
							}
						} catch (Exception e) {
							throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
																						// e.getMessage()
						}
						if (money > 0 && money != total * muli) {
							throw new Exception("上传文件总金额(" + total * muli + ")与输入总金额(" + money + ")不一致！");
						}
					}
					
					long cetime = System.currentTimeMillis();
					System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
					System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
				}
			}else{
				codes = "";
			}
			
			TradeBean bean1 = new TradeBean();
			bean1.setUid(uid);
			bean1.setPwd(pwd);
			bean1.setGid(bean.getGid());// 游戏编号
			bean1.setPid(bean.getPid());// 期次编号
			bean1.setPlay(bean.getPlay());// 玩法
			bean1.setCodes(codes);// 投注号码（文件投注的文件名）
			bean1.setMuli(bean.getMuli());// 投注倍数
			bean1.setFflag(bean.getFflag());// 文件标志（0 是号码 1 是文件）
			bean1.setType(bean.getType());// 方案类型(0代购 1合买)
			bean1.setName(bean.getName());// 方案标题
			bean1.setDesc(bean.getDesc());// 方案描叙
			bean1.setMoney(bean.getMoney());// 方案金额
			bean1.setTnum(bean.getTnum());// 方案份数
			bean1.setBnum(bean.getBnum());// 购买份数
			bean1.setPnum(bean.getPnum());// 保底份数
			bean1.setOflag(bean.getOflag());// 公开标志
			bean1.setWrate(bean.getWrate());// 提成比率
			bean1.setComeFrom(bean.getComeFrom());// 方案来源
			bean1.setSource(bean.getSource());// 投注来源
			bean1.setEndTime(bean.getEndTime());// 截止时间
			
			fileOperator(file, bean);
			int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "proj_cast");
			if (rc != 0 || bean1.getBusiErrCode() != 0) {
				throw new Exception("投注失败：" + bean1.getBusiErrDesc());
			}				
			bean.setBusiErrCode(bean1.getBusiErrCode());
			bean.setBusiErrDesc(bean1.getBusiErrDesc());
			bean.setBusiXml(bean1.getBusiXml());
		}catch (Exception e) {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc(e.getMessage());
		}
		return 0;
	}
	
	
	/**
	 * 成功发起方案后的文件处理
	 * 
	 * @param file
	 * @throws Exception
	 */
	private void fileOperator(File file, SlowLotteryBean bean) throws Exception {
		if (file != null) {
			try {
				File dFile = new File(FileCastServlet.PATH + File.separator + bean.getGid() + File.separator + bean.getPid());
				if (!dFile.exists()) {
					dFile.mkdirs();
					System.out.println(dFile.getPath() + "文件夹创建成功");
				}
				File df = new File(FileCastServlet.PATH + File.separator + bean.getGid() + File.separator + bean.getPid() + File.separator + file.getName());
				if (FileUpload.fileCopy(file, df)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * 错误提示，移除上传文件
	 * 
	 * @param out
	 * @param e
	 * @param fu
	 */
	private void uploadErr(HttpServletRequest request, Exception e, FileUpload fu) {
		request.setAttribute("errcode", "1");
		System.out.println("errcode=1");
		request.setAttribute("errmsg", e.getMessage());
		e.printStackTrace();
		if (fu != null) {
			File file = fu.getFile(UPFILE);
			if (file != null) {
				file.delete();
			}
		}
	}
	
	public int check_login(SlowLotteryBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.check_login(bean, context, request, response);
	}
	
	public int set_user_data(SlowLotteryBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		return BaseImpl.set_user_data(bean, context, request, response);
	}
	
	/**
	 * 导入文件
	 * @throws Exception
	 */
	public int inputfile(SlowLotteryBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		FileUpload upload = null;
		try {
			long ustime = System.currentTimeMillis();
			System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
			
			try {
				// 构造对象
				upload = new FileUpload(request, FileCastServlet.PATH + File.separator + "temp" + File.separator, new String[] { "txt" }, this.maxPostSize);
			} catch (Exception e) {
				throw new Exception("上传发生错误");
			}

			long uetime = System.currentTimeMillis();
			System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
			System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
			System.out.println("文件保存位置：" + FileCastServlet.PATH + File.separator + "temp" + File.separator);
			
			// 获取参数
			File file = null;
			file = upload.getFile(UPFILE);

			if (file != null) {// 如果有上传文件的话
				long cstime = System.currentTimeMillis();
				System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

				FileInputStream fis = new FileInputStream(file);

				BufferedReader br = new BufferedReader(new InputStreamReader(fis));

				StringBuffer sb = new StringBuffer();
				String temp = null;
				while ((temp = br.readLine()) != null) {
					temp = temp.trim();
					if (temp.length() > 0) {
						sb.append(temp).append(";");
					}
				}
				fis.close();
				file.delete();
				long cetime = System.currentTimeMillis();
				System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
				System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
				bean.setBusiErrCode(0);
				bean.setBusiErrDesc(sb.toString());
			}
			
		} catch (Exception e) {
			uploadErr(request, e, upload);
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc(e.getMessage());
		}
		
		return 0;
	}
	
}


