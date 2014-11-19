package com.caipiao.cpweb.upload;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.HeZuoUtil;
import com.caipiao.cpweb.util.SiteBean;
import com.caipiao.cpweb.util.Util;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.Globals;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class FileCastServlet extends HttpServlet {

	private static Logger logger = LoggerFactory.getLogger("fileupload");
	private static final long serialVersionUID = -6465051765821264099L;

	private static final String UID_KEY = "uid";
	private static final String PWD_KEY = "pwd";
	private static final String ENCODING = "UTF-8";
	
	public static String PATH = "";
	private final String UPFILE = "upfile";

	RbcFrameContext context = null;

	/**
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
	 * methods.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 */
	private int maxPostSize = 50 * 1024 * 1024;

	public FileCastServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}

	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {

		context = (RbcFrameContext) this.getServletConfig().getServletContext().getAttribute(Globals.RBC_SERVICE_CONTEXT);
		PrintWriter out = null;
		String uid = null;
		String pwd = null;
		FileUpload upload = null;
		try {
			System.out.println("request.getCharacterEncoding()1="+request.getCharacterEncoding());
			request.setCharacterEncoding(ENCODING);
			response.setContentType("text/html;charset=" + ENCODING);
			response.setCharacterEncoding(ENCODING);
			out = response.getWriter();
			System.out.println("request.getCharacterEncoding()2="+request.getCharacterEncoding());
			// 检查是否登录
			HttpSession session = request.getSession();
			uid = (String) session.getAttribute(UID_KEY);
			pwd = (String) session.getAttribute(PWD_KEY);

			if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
				throw new Exception("尚未登录！");
			}

			long ustime = System.currentTimeMillis();
			System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
			try {
				// 构造对象
				upload = new FileUpload(request, PATH, new String[] { "txt" }, this.maxPostSize);
			} catch (Exception e) {
				e.printStackTrace();
				throw new Exception("上传发生错误");
			}
			long uetime = System.currentTimeMillis();
			System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
			System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
			System.out.println("文件保存位置：" + PATH);

			// 获取参数
			File file = null;
			TradeBean bean = new TradeBean();

			String gid = StringUtil.getNullString(upload.getRequestField("gid"));// 游戏编号
			String pid = StringUtil.getNullString(upload.getRequestField("pid"));// 期次编号
			int play = StringUtil.getNullInt(upload.getRequestField("play"));// 玩法
			String codes = "";// 投注号码（文件投注的文件名）

			int muli = StringUtil.getNullInt(upload.getRequestField("muli"));// 投注倍数
			int fflag = StringUtil.getNullInt(upload.getRequestField("fflag"));// 文件标志（0是号码
																				// 1
																				// 是文件）
			System.out.println("fflag="+fflag);
			int type = StringUtil.getNullInt(upload.getRequestField("type"));// 方案类型(0代购1合买)
			String name = StringUtil.getNullString(upload.getRequestField("name"));// 方案标题
			String desc = StringUtil.getNullString(upload.getRequestField("desc"));// 方案描叙
			int money = StringUtil.getNullInt(upload.getRequestField("money"));// 方案金额
			int tnum = StringUtil.getNullInt(upload.getRequestField("tnum"));// 方案份数
			int bnum = StringUtil.getNullInt(upload.getRequestField("bnum"));// 购买份数
			int pnum = StringUtil.getNullInt(upload.getRequestField("pnum"));// 保底份数
			int oflag = StringUtil.getNullInt(upload.getRequestField("oflag"));// 公开标志
			int wrate = StringUtil.getNullInt(upload.getRequestField("wrate"));// 提成比率
			String comeFrom = StringUtil.getNullString(upload.getRequestField("comeFrom"));// 方案来源
			int source = StringUtil.getNullInt(upload.getRequestField("source"));// 投注来源
			String endTime = StringUtil.getNullString(upload.getRequestField("endTime"));// 截止时间

			int ishsc = StringUtil.getNullInt(upload.getRequestField("ishsc"));// 是否后上传
			String hid = StringUtil.getNullString(upload.getRequestField("hid"));// 方案编号

			String filename = FileUpload.getFileName(uid, gid, pid).toLowerCase();

			upload.setFileName(UPFILE, filename);

			file = upload.getFile(UPFILE);

			if (ishsc != 1) {
				if (file != null) {// 如果有上传文件的话
					codes = file.getName().toLowerCase();
					long cstime = System.currentTimeMillis();
					System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

					GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
					
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

				bean.setUid(uid);
				bean.setPwd(pwd);
				bean.setGid(gid);// 游戏编号
				bean.setPid(pid);// 期次编号
				bean.setPlay(play);// 玩法
				bean.setCodes(codes);// 投注号码（文件投注的文件名）
				bean.setMuli(muli);// 投注倍数
				bean.setFflag(fflag);// 文件标志（0 是号码 1 是文件）
				bean.setType(type);// 方案类型(0代购 1合买)
				bean.setName(name);// 方案标题
				bean.setDesc(desc);// 方案描叙
				bean.setMoney(money);// 方案金额
				bean.setTnum(tnum);// 方案份数
				bean.setBnum(bnum);// 购买份数
				bean.setPnum(pnum);// 保底份数
				bean.setOflag(oflag);// 公开标志
				bean.setWrate(wrate);// 提成比率
				bean.setComeFrom(comeFrom);// 方案来源
				bean.setSource(source);// 投注来源
				bean.setEndTime(endTime);// 截止时间

				fileOperator(file, bean);
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_cast");
				if (rc != 0 || bean.getBusiErrCode() != 0) {
					throw new Exception("投注失败：" + bean.getBusiErrDesc());
				}				
				uploadSuccess(out, upload, bean.getHid(),0);
			} else {// 后上传
				
				if (file == null){
					throw new Exception("方案方案内容不能够为空");
				}
				
				bean.setUid(uid);
				bean.setGid(gid);
				bean.setHid(hid);
				
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "queryProjectInfo");
				if (rc != 0 || bean.getBusiErrCode() != 0) {
					throw new Exception("获取方案信息失败：" + bean.getBusiErrDesc());
				}		
				
				JXmlWapper lxml = JXmlWapper.parse(bean.toXmlString());

				JXmlWapper row = lxml.getXmlNode("row");
			
				String nickid = "";
				String cnickid = "";
				int isupload = 0;
				String ccodes ="";
				int ifile =0;
				
				muli =0;
				money =0;
				play =0;
				pid ="";				

				
				if (row != null) {
					nickid = uid;
					cnickid = row.getStringValue("@cnickid");
					isupload = row.getIntValue("@upload");
					ccodes = row.getStringValue("@ccodes");	
					ifile = row.getIntValue("@ifile");					
					muli = row.getIntValue("@mulity");
					money = row.getIntValue("@tmoney");
					play = row.getIntValue("@play");				
					pid = row.getStringValue("@periodid");
				}else {
					throw new Exception("您不是方案的发起人,无权上传方案");
				}
				
				System.out.println("play="+play);
				
				
				if (nickid == "" && !nickid.equalsIgnoreCase(cnickid)) {
					throw new Exception("您不是方案的发起人,无权上传方案,请检查是否登录正确的用户名");
				}
				if (isupload == 1 || ccodes!="" || ifile!=1) {
					throw new Exception("方案已经上传");
				}
				if (pid =="") {
					throw new Exception("方案信息获取失败");
				}				
						
				if (file != null) {// 如果有上传文件的话
					codes = file.getName().toLowerCase();
					long cstime = System.currentTimeMillis();
					System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

					GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
					if (plugin != null) {
						FileInputStream fis = new FileInputStream(file);						
						BufferedReader br = new BufferedReader(new InputStreamReader(fis,"gbk"));
						StringBuffer sb = new StringBuffer();
						String temp = null;
						int total = 0;
						if (gid.equalsIgnoreCase("85")){
//							FilterResult result = new FilterResult();
//							CodeBean codebean = new CodeBean();
//							codebean.setCodeitems(ggnameStr);
//							codebean.setPlaytype(lotidMap.get(gid));
//							codebean.setLottype(Integer.parseInt(gid));
//							System.out.println("开始检测");
//							while ((temp = br.readLine()) != null) {
//								System.out.println(tmp);
//								if (!CheckUtil.isNullString(tmp)) {
//									if (initems.equals("1")) {
//										codebean.setItemType(CodeBean.HAVEITEM);
//										codebean.setCode(tmp);
//									} else {
//										codebean.setItemType(CodeBean.NOITEM);
//										codebean.setCode(tmp);
//										codebean.setTeamitems(matchesStr);
//										codebean.setGuoguan(ggGroupMap.get(ggtype));
//									}
//									FilterBase.doFilter(codebean, result);
//									if (isValid(result.getCurrentCode())) {
//										GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
//										total += gcc.getCastMoney();
//									}
//								}
//							}
						}else if (gid.equalsIgnoreCase("70")){
							
							FilterResult result = new FilterResult();
							CodeBean codebean = new CodeBean();
							codebean.setCodeitems("3=3,1=1,0=0");
							codebean.setItemType(CodeBean.HAVEITEM);;
							codebean.setPlaytype("HH");
							codebean.setLottype(Integer.parseInt(gid));
							System.out.println("开始检测");
							while ((temp = br.readLine()) != null) {
								System.out.println("temp----------"+temp);
								if (!CheckUtil.isNullString(temp)) {
									codebean.setCode(temp);
									codebean.setGuoguan("2*1");
									FilterBase.doFilterJc(codebean, result);
									try {
	                                    GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
	                                    total += gcc.getCastMoney();
	                                    System.out.println("total----------"+total);
	                                } catch (Exception e) {
	                                    throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
	                                    // e.getMessage()
	                                }

	                                for (int n = 1; n < muli; n++) {
	                                    result.addCode(result.getCurrentCode());
	                                }

								}
							}
							 fis.close();
							 if (money > 0 && money != total * muli) {
									throw new Exception("上传文件总金额(" + total * muli + ")与方案总金额(" + money + ")不一致！");
								}
							 if (!Util.SaveFile(result.getAllCodeToFile(), PATH,filename + ".txt", "gbk")) {
			                        logger.error(filename + "_n.txt" + "：存储失败");
			                        throw new Exception("存储失败");
			                    }
							 bean.setUid(uid);
							bean.setPwd(pwd);
							bean.setGid(gid);
							bean.setHid(hid);
							bean.setCodes(codes);
							bean.setMoney(money);
							
							bean.setPid(pid);

							fileOperator(file, bean);
							int rc1 = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_upload");
							if (rc1 != 0 || bean.getBusiErrCode() != 0) {
								throw new Exception("方案后上传失败：" + bean.getBusiErrDesc());
							}
							
							uploadSuccess(out, upload, bean.getHid(),1);	
							return;
						}else{
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
							throw new Exception("上传文件总金额(" + total * muli + ")与方案总金额(" + money + ")不一致！");
						}
					}
					long cetime = System.currentTimeMillis();
					System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
					System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
				}
						
				bean.setUid(uid);
				bean.setPwd(pwd);
				bean.setGid(gid);
				bean.setHid(hid);
				bean.setCodes(codes);
				bean.setMoney(money);
				
				bean.setPid(pid);

				fileOperator(file, bean);
				int rc1 = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_upload");
				if (rc1 != 0 || bean.getBusiErrCode() != 0) {
					throw new Exception("方案后上传失败：" + bean.getBusiErrDesc());
				}
				
				uploadSuccess(out, upload, bean.getHid(),1);	
			}
		} catch (Exception e) {
			uploadErr(out, e, upload);
		}
	}

	/**
	 * 错误提示，移除上传文件
	 * 
	 * @param out
	 * @param e
	 * @param fu
	 */
	private void uploadErr(PrintWriter out, Exception e, FileUpload fu) {
		out.print("{errcode:1,msg:'" + e.getMessage() + "'}");
		if (fu != null) {
			File file = fu.getFile(UPFILE);
			if (file != null) {
				file.delete();
			}
		}
	}

	/**
	 * 上传成功的处理
	 * 
	 * @param out
	 * @param file
	 * @param projectid
	 */
	private void uploadSuccess(PrintWriter out, FileUpload fu, String projectid,int flag) {
		try {
			if (flag==1){
				out.print("{errcode:0,msg:'文件上传成功',projid:'" + projectid + "'}");
			}else{
				out.print("{errcode:0,msg:'恭喜你投注成功',projid:'" + projectid + "'}");
			}
			
			out.close();
		} catch (Exception e) {
			uploadErr(out, e, fu);
		}

	}

	/**
	 * 成功发起方案后的文件处理
	 * 
	 * @param file
	 * @throws Exception
	 */
	private void fileOperator(File file, TradeBean bean) throws Exception {
		if (file != null) {
			try {
				File dFile = new File(PATH + File.separator + bean.getGid() + File.separator + bean.getPid());
				if (!dFile.exists()) {
					dFile.mkdirs();
					System.out.println(dFile.getPath() + "文件夹创建成功");
				}
				File df = new File(PATH + File.separator + bean.getGid() + File.separator + bean.getPid() + File.separator + file.getName());
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
	 * Handles the HTTP <code>GET</code> method.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
	 * 
	 * @param request
	 *            servlet request
	 * @param response
	 *            servlet response
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Returns a short description of the servlet.
	 */
	public String getServletInfo() {
		return "flex upload servlet by chenzhurong";
	}

	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		try {
			PATH = config.getInitParameter("path");
			if (PATH == null) {
				throw new FileNotFoundException("未找到上传目录配置");
			}
			File file = new File(PATH);
			if (!file.exists()) {
				file.mkdirs();
			}
			System.out.println("upload path : " + PATH);
		} catch (Exception e1) {
			e1.printStackTrace();
		}

		String site = System.getProperty("conf.dir") + File.separator + "site.xml";

		File sfile = new File(site);
		if (!sfile.exists()) {
			try {
				throw new FileNotFoundException("未找到合作网站配置文件");
			} catch (FileNotFoundException e) {
				e.printStackTrace();
				return;
			}
		}
		JXmlWapper sXml = JXmlWapper.parse(sfile);

		List<JXmlWapper> slist = sXml.getXmlNodeList("sites.site");
		try {
			for (JXmlWapper sxml : slist) {
				SiteBean sb = new SiteBean();
				sb.setHost(sxml.getStringValue("@host"));
				sb.setRegfrom(sxml.getStringValue("@regfrom"));
				sb.setName(sxml.getStringValue("@name"));
				HeZuoUtil.putSite(sb.getHost(), sb);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println("成功加载合作网站配置文件 : " + site);
	}
}