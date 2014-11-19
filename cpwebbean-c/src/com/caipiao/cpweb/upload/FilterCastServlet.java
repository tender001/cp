package com.caipiao.cpweb.upload;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.digest.DigestUtils;

import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.HeZuoUtil;
import com.caipiao.cpweb.util.SiteBean;
import com.caipiao.plugin.helper.CodeFormatException;
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

public class FilterCastServlet extends HttpServlet {

	private static final long serialVersionUID = 4786020691055285015L;

	private static Logger logger = LoggerFactory.getLogger("filter");

	private static final String UID_KEY = "uid";
	private static final String PWD_KEY = "pwd";
	private static final String ENCODING = "UTF-8";
	
	public static String PATH = "";
	private final String UPFILE = "upfile";
	
	private static String URL = "http://221.228.231.8/abc.c?";
	private static String PRI_KEY = "0cc175b9c0f1b6a831c399e269772661";

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

	public FilterCastServlet() {
		super();
	}

	public void destroy() {
		super.destroy();
	}
	
	public String md5(String text) {
    	String charset = "utf-8";
        try {
			return DigestUtils.md5Hex(text.getBytes(charset));
		} catch (UnsupportedEncodingException e) {
			 throw new RuntimeException("MD5签名过程中出现错误,指定的编码集不对,您目前指定的编码集是:" + charset);
		}

    }

	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {

		context = (RbcFrameContext) this.getServletConfig().getServletContext().getAttribute(Globals.RBC_SERVICE_CONTEXT);
		PrintWriter out = null;
		String uid = null;
		String pwd = null;
		
		File newFile = null;
		
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

			System.out.println("文件保存位置：" + PATH);

			// 获取参数
			//File file = null;
			TradeBean bean = new TradeBean();

			String gid = StringUtil.getNullString(request.getParameter("gid"));// 游戏编号
			String pid = StringUtil.getNullString(request.getParameter("pid"));// 期次编号
			int play = StringUtil.getNullInt(request.getParameter("play"));// 玩法
			String codes = "";// 投注号码（文件投注的文件名）

			int muli = StringUtil.getNullInt(request.getParameter("muli"));// 投注倍数
			int fflag = StringUtil.getNullInt(request.getParameter("fflag"));// 文件标志（0是号码
																				// 1
																				// 是文件）
			System.out.println("fflag="+fflag);
			int type = StringUtil.getNullInt(request.getParameter("type"));// 方案类型(0代购1合买)
			String name = StringUtil.getNullString(request.getParameter("name"));// 方案标题
			String desc = StringUtil.getNullString(request.getParameter("desc"));// 方案描叙
			int money = StringUtil.getNullInt(request.getParameter("money"));// 方案金额
			int tnum = StringUtil.getNullInt(request.getParameter("tnum"));// 方案份数
			int bnum = StringUtil.getNullInt(request.getParameter("bnum"));// 购买份数
			int pnum = StringUtil.getNullInt(request.getParameter("pnum"));// 保底份数
			int oflag = StringUtil.getNullInt(request.getParameter("oflag"));// 公开标志
			int wrate = StringUtil.getNullInt(request.getParameter("wrate"));// 提成比率
			String comeFrom = StringUtil.getNullString(request.getParameter("comeFrom"));// 方案来源
			int source = StringUtil.getNullInt(request.getParameter("source"));// 投注来源
			String endTime = StringUtil.getNullString(request.getParameter("endTime"));// 截止时间

			//String hid = StringUtil.getNullString(request.getParameter("hid"));// 方案编号

			String filename = FileUpload.getFileName(uid, gid, pid).toLowerCase();
			
			String filecontent = "";
			StringBuffer filesb = new StringBuffer();

				//if (file != null) {// 如果有上传文件的话
					//codes = file.getName().toLowerCase();
					long cstime = System.currentTimeMillis();
					System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

					GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
					
					if (plugin != null) {
						
						int num = 0;
						String id = request.getParameter("id");
						int number = StringUtil.getNullInt(request.getParameter("number"));
						String lott_type = request.getParameter("lottType"); //"sfc";
						String key = md5(id + number + lott_type + PRI_KEY);
						String urlAndParam = URL + "t=saveproject&id=" + id + "&number=" + number + "&lott_type=" + lott_type + "&key=" + key;
						
						System.out.println(urlAndParam);

						URL url = new URL(urlAndParam);
						HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection(); // 获取连接
						httpURLConnection.setRequestMethod("POST"); // 设置请求方法为POST
						httpURLConnection.setDoOutput(true);
						
						InputStream is = null;
						try {
							is = httpURLConnection.getInputStream();
						} catch (Exception e1) {
							e1.printStackTrace();
							String msg = httpURLConnection.getHeaderField("msg");
							throw new Exception("过滤查询失败  "+msg);
						}
						
						String tmp = null;
						BufferedReader br = null;
						try {
							br = new BufferedReader(new InputStreamReader(is, ENCODING));
							String temp = null;
							int total = 0;
							StringBuffer sb = new StringBuffer();

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
								filesb.append(temp).append("\r\n");
								num++;
							}
							
							filecontent = sb.toString();
							if (filecontent.length() > 0) {
								filecontent = filecontent.substring(0, filecontent.length() - 1);
							}
							try {
								GameCastCode[] gcc = plugin.parseGameCastCodes(filecontent);
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
							
//							System.out.print(total_money);
							//total_zhushu = total_money / 2;	
						} catch (CodeFormatException e) {
							throw new Exception("您过滤投注中未解析到投注内容,错误行号："+(num+1)+"<br> tmp:"+tmp+ "<br>" +e.getMessage());
						}finally{
							br.close();
						}
						long cetime = System.currentTimeMillis();
						System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
						System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
						
						File filePath = new File(PATH + File.separator + gid + File.separator +pid);
						filePath.mkdirs();

						newFile = new File(PATH + File.separator + gid + File.separator +pid + File.separator + filename + ".txt");
						
						codes = newFile.getName().toLowerCase();
						System.out.println(PATH + File.separator + gid + File.separator + pid + File.separator + filename + ".txt");
						FileOutputStream fos = new FileOutputStream(newFile);
						DataOutputStream dos = new DataOutputStream(fos);
						try{
							dos.writeBytes(filesb.toString());
						} catch (Exception e) {
							e.printStackTrace();
							throw new Exception("保存文件发生异常");
						} finally {
							dos.close();
							fos.close();
						}
					}
					
					System.out.println(newFile.getAbsolutePath());
					System.out.println(newFile.length());
					System.out.println(newFile.exists());
					System.out.println(newFile.isFile());
					
					//long cetime = System.currentTimeMillis();
					//System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
					//System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");
				//}

				bean.setUid(uid);
				bean.setPwd(pwd);
				bean.setGid(gid);// 游戏编号
				bean.setPid(pid);// 期次编号
				bean.setPlay(play);// 玩法
				bean.setCodes(codes);// 投注号码（文件投注的文件名）
				bean.setMuli(muli);// 投注倍数
				bean.setFflag(1);// 文件标志（0 是号码 1 是文件），这里默认是文件
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

				//fileOperator(file, bean);
				int rc = RemoteBeanCallUtil.RemoteBeanCall(bean, context, GroupContain.TRADE_GROUP, "proj_cast");
				if (rc != 0 || bean.getBusiErrCode() != 0) {
					throw new Exception("投注失败：" + bean.getBusiErrDesc());
				}				
				uploadSuccess(out,newFile, bean.getHid(),0);
			
		} catch (Exception e) {
			e.printStackTrace();
			uploadErr(out, e, newFile);
		}
	}

	/**
	 * 错误提示，移除上传文件
	 * 
	 * @param out
	 * @param e
	 * @param f
	 */
	private void uploadErr(PrintWriter out, Exception e, File f) {
		out.print("{errcode:1,msg:'" + e.getMessage() + "'}");
		if (f != null) {
			f.delete();
		}
	}

	/**
	 * 上传成功的处理
	 * 
	 * @param out
	 * @param file
	 * @param projectid
	 */
	private void uploadSuccess(PrintWriter out,File f, String projectid,int flag) {
		try {
			if (flag==1){
				out.print("{errcode:0,msg:'文件上传成功',projid:'" + projectid + "'}");
			}else{
				out.print("{errcode:0,msg:'恭喜你投注成功',projid:'" + projectid + "'}");
			}
			
			out.close();
		} catch (Exception e) {
			uploadErr(out, e, f);
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