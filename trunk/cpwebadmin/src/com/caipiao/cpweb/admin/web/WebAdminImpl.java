package com.caipiao.cpweb.admin.web;

import java.io.IOException;
import java.io.OutputStream;
import java.math.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.poi.hssf.usermodel.HSSFBorderFormatting;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.jdom.Element;
import com.caipiao.cpweb.auth.AuthUtil;
import com.mina.rbc.util.CheckUtil;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;

public class WebAdminImpl {
	private final static String UID_KEY = "WEB_ADMIN_USER";
	private final static String PWD_KEY = "WEB_ADMIN_PASS";
	private final static String AUTH_KEY = "WEB_ADMIN_AUTH";

	private final static HashMap<String, String> maps = new HashMap<String, String>();
	static {
		maps.put("change_user_pwd", "no login");
		maps.put("change_agent_pwd", "no login");

	}

	private static String getRealIp(HttpServletRequest request) {
		String ip = request.getRemoteAddr();
		if (ip.indexOf("192.168") > -1 || ip.indexOf("127.0.0") > -1) {
			String xf = request.getHeader("X-Forwarded-For");
			if (xf != null) {
				return xf.split(",")[0];
			} else {
				return ip;
			}
		} else {
			return ip;
		}
	}

	public int checkYzm(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		String randCode = (String) session.getAttribute("rand");
		int ret = 0;
		if (!CheckUtil.isNullString(randCode)) {
			String yzm = bean.getYzm();
			if (randCode.equalsIgnoreCase(yzm)) {
				ret = 1;
				session.removeAttribute(UID_KEY);
				session.removeAttribute(PWD_KEY);
			}
		}
		if (ret == 0) {
			bean.setBusiErrCode(3);
			bean.setBusiErrDesc("验证码不正确");
		}
		return ret;
	}

	public int setAuth(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String memo = bean.getMemo();
		if (!StringUtil.isEmpty(memo)) {
			try {
				StringBuffer sb = new StringBuffer();
				String[] memos = StringUtil.splitter(memo, ";");
				for (String m : memos) {
					String[] ps = StringUtil.splitter(m, ":");
					if (ps.length == 2) {
						String id = ps[0].trim();
						String[] vals = StringUtil.splitter(ps[1].trim(), ",");
						long l = 0;
						for (String val : vals) {
							if (!StringUtil.isEmpty(val)) {
								l |= 1L << Integer.valueOf(val);
							}
						}
						sb.append(id).append(":").append(l).append(";");
					}
				}
				bean.setMemo(sb.toString());
			} catch (Exception e) {
				e.printStackTrace();
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("参赛设置不符合要求");
				return 0;
			}
		}
		return 1;
	}

	public int auth_result(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		if (bean.getBusiErrCode() == 0) {
			try {
				JXmlWapper xml = JXmlWapper.parse(bean.getBusiXml());
				String auth = xml.getStringValue("@cauth");
				bean.setBusiXml(AuthUtil.getMenuAuthDetail(auth));
			} catch (Exception e) {
				e.printStackTrace();
				bean.setBusiXml("");
				bean.setBusiErrCode(-1);
				bean.setBusiErrDesc("解析数据失败");
			}
		}
		return 1;
	}

	public int login_result(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		if (bean.getBusiErrCode() == 0) {
			session.setAttribute(UID_KEY, bean.getUid());
			session.setAttribute(PWD_KEY, bean.getPwd());
			session.removeAttribute(AUTH_KEY);
			try {
				if (!StringUtil.isEmpty(bean.getBusiXml())) {
					JXmlWapper xml = JXmlWapper.parse(bean.getBusiXml());
					String uauth = xml.getStringValue("@cauth");
					System.out.println("----------------->" + uauth);
					if (!StringUtil.isEmpty(uauth)) {
						HashMap<Integer, Long> user_auths = new HashMap<Integer, Long>();
						try {
							String[] auths = StringUtil.splitter(uauth, ";");
							for (String _auth : auths) {
								String[] ps = StringUtil.splitter(_auth, ":");
								if (ps.length == 2) {
									user_auths.put(
											Integer.valueOf(ps[0].trim()),
											Long.valueOf(ps[1].trim()));
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
						session.setAttribute(AUTH_KEY, user_auths);
					}
					bean.setBusiXml("");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return 1;
	}

	public int login_out(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		session.invalidate();
		bean.setBusiErrCode(0);
		bean.setBusiErrDesc("成功");
		return 0;
	}

	public int set_agent_info(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		if (!CheckUtil.isNullString(uid)) {
			bean.setAgent(uid);
			bean.setQagent(uid);
			return 1;
		} else {
			bean.setBusiErrCode(1);
			bean.setBusiErrDesc("用户未登录");
		}
		return 0;
	}

	public int check_login(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);
		if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
			if (!maps.containsKey(bean.getFid())) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("用户未登录");
				return 0;
			} else {
				return 1;
			}
		} else {
			bean.setUid(uid);
			bean.setPwd(pwd);
			bean.setIpAddr(getRealIp(request));
			return 1;
		}
	}

	public int check_login_id(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);
		if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
			if (!maps.containsKey(bean.getFid())) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("用户未登录");
				return 0;
			} else {
				return 1;
			}
		} else {
			bean.setBusiErrCode(0);
			bean.setBusiErrDesc("查询成功");
			bean.setUid(uid);
			// bean.setPwd(pwd);
			// bean.setIpAddr(getRealIp(request));
			bean.setBusiXml("<uid>" + uid + "</uid>");
			return 1;
		}
	}

	public int check_auth(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		HashMap<Integer, Long> uauth = (HashMap<Integer, Long>) session
				.getAttribute(AUTH_KEY);
		System.out.println(uauth.toString());
		if (uauth == null || uauth.isEmpty()) {
			if (!maps.containsKey(bean.getFid())) {
				bean.setBusiErrCode(1);
				bean.setBusiErrDesc("用户读取不到权限，请联系管理员");
				return 0;
			} else {
				return 1;
			}
		} else {
			boolean hasAuth = SysAuthUtil.auth(bean, uauth);
			System.out.println(hasAuth);
			if (!hasAuth) {
				bean.setBusiErrCode(2);
				bean.setBusiErrDesc("没有权限，请联系管理员");
				return 0;
			} else
				return 1;
		}
	}

	public int set_base_data(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession();
		String uid = (String) session.getAttribute(UID_KEY);
		String pwd = (String) session.getAttribute(PWD_KEY);
		if (!CheckUtil.isNullString(uid)) {
			bean.setUid(uid);
		}
		if (!CheckUtil.isNullString(pwd)) {
			bean.setPwd(pwd);
		}
		bean.setIpAddr(getRealIp(request));
		return 1;
	}

	/**
	 * 导出excel
	 * 
	 * @throws IOException
	 */
	public void createExcel(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response) {
		if(bean.getType().equalsIgnoreCase("1")) createExcelAlipay(bean, context, request, response);
		else createExcelBank(bean, context, request, response);
		
	}

	/**
	 * 导出提款到银行的excel
	 * 
	 * @throws IOException
	 */
	public void createExcelAlipay(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response) {
		OutputStream os = null;
		try {
			// 指定文件名称的中文问题需要注意
			String fileName = "提款订单信息管理.xls";
			// 解决头部信息中文乱码
			fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			// 告诉浏览器不要直接显示，而是让用户决定是显示，还是另存为
			response.setHeader("Content-Disposition", "attachment;filename="
					+ fileName);
			os = response.getOutputStream();
			// 创建Excel表格
			HSSFWorkbook workbook = new HSSFWorkbook();// 生成工作表
			// 往表格里添加数据
			String[] colum = { "批次号", "付款日期", "付款人Email", "账户名称","总金额（元）","总笔数" };// 创建第一个表头
			String[] value = new String[colum.length];// 创建第一个表中的列宽
			String[] columns = { "商户流水号", "收款人email", "收款人姓名", "付款金额(元)", "付款理由" };// 创建第二个表头
			String[] values = new String[columns.length];// 创建第二个表中的列宽
			// excel的名称
			HSSFSheet sheet = workbook.createSheet("提款到支付宝订单信息");
			// 设置列宽
			sheet.setColumnWidth(0, 5000);
			sheet.setColumnWidth(1, 7000);
			sheet.setColumnWidth(2, 9000);
			sheet.setColumnWidth(3, 7000);
			sheet.setColumnWidth(4, 7000);
			sheet.setColumnWidth(5, 7000);
			sheet.setColumnWidth(6, 7000);
			sheet.setColumnWidth(7, 3000);
			sheet.setColumnWidth(8, 8000);
			sheet.setColumnWidth(9, 3000);
			// 获得字体
			HSSFFont fontTitle = workbook.createFont();
			// 设置字号
			fontTitle.setFontHeightInPoints((short) 14);
			// 单元格风格
			HSSFCellStyle styleTitle = workbook.createCellStyle();
			// 应用字体
			styleTitle.setFont(fontTitle);
			// 上下左右边框风格
			styleTitle.setBorderBottom(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderLeft(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderRight(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderTop(HSSFBorderFormatting.BORDER_THIN);
			int countRow = 0;

			HSSFRow rows = null;// 表格的一行
			HSSFCell cells = null;// 单元格

			rows = sheet.createRow((short) countRow);
			rows.setHeightInPoints(30); // 行高
			// 循环创建行
			for (int count = 0; count < colum.length; count++) {
				cells = rows.createCell((short) count);// 创建单元格
				cells.setCellValue(colum[count]);// 为单元格设置值
				cells.setCellStyle(styleTitle);// 设置单元格的样式
			}
			countRow++;// 表格行计数
			rows = sheet.createRow((short) countRow);
			rows.setHeightInPoints(30); // 设置行高

			Element element = JXmlUtil.string2Xml(bean.toString());
			List<Element> list = element.getChildren("row");
			double money = 0;
			// 计算总金额
			for (int i = 0; i < list.size(); i++) {
				Element e = list.get(i);
				money += Double.valueOf(e.getAttributeValue("imoney"));
			}
			// 日期格式的转化
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Date date = new Date();
			value[0] = String.valueOf(new SimpleDateFormat("yyyyMMddHHmmss").format(date));
			value[1] = String.valueOf(sdf.format(date));
			value[2] = String.valueOf("zf@159cai.com");
			value[3] = String.valueOf("上海澜赢信息技术有限公司");
			value[4] = String.valueOf(money);
			value[5] = String.valueOf(list.size());
			
			for (int count = 0; count < value.length; count++) {
				cells = rows.createCell((short) count);
				cells.setCellValue(value[count]);
				cells.setCellStyle(styleTitle);
			}

			countRow++;

			HSSFRow row = sheet.createRow((short) countRow);
			row.setHeightInPoints(30);

			for (int countCell = 0; countCell < columns.length; countCell++) {
				HSSFCell cell = row.createCell((short) countCell);// 创建单元格
				cell.setCellValue(columns[countCell]);// 为单元格设置值
				cell.setCellStyle(styleTitle);// 设置单元格的样式
			}
			for (int i = 0; i < list.size(); i++) {
				Element e = list.get(i);
				// 生成数据行
				countRow++;
				row = sheet.createRow((short) (countRow));
				row.setHeightInPoints(30); // 设置行高
				values[0] = String.valueOf(e.getAttribute("icashid").getValue());
				values[1] = String.valueOf(e.getAttribute("cbankcard").getValue());
				values[2] = String.valueOf(e.getAttribute("crealname").getValue());
				
				Double moneys = Double.valueOf(e.getAttribute("imoney").getValue());
				DecimalFormat fun = new DecimalFormat("##0.00");
				values[3] = String.valueOf(fun.format(moneys));
				values[4] = String.valueOf("用户提款");

				// 生成数据行的每个单元格
				for (int countCell = 0; countCell < values.length; countCell++) {
					HSSFCell cell = row.createCell((short) countCell);
					cell.setCellValue(values[countCell]);
					cell.setCellStyle(styleTitle);
				}

			}

			// 将表格通过输出流输出到客户端
			workbook.write(os);

			// 刷新缓冲区
			os.flush();
			// 关闭输出流
			os.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 导出提款到银行的excel
	 * 
	 * @throws IOException
	 */
	public void createExcelBank(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response) {
		OutputStream os = null;
		try {
			// 指定文件名称的中文问题需要注意
			String fileName = "提款订单信息管理.xls";
			// 解决头部信息中文乱码
			fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			// 告诉浏览器不要直接显示，而是让用户决定是显示，还是另存为
			response.setHeader("Content-Disposition", "attachment;filename="
					+ fileName);
			os = response.getOutputStream();
			// 创建Excel表格
			HSSFWorkbook workbook = new HSSFWorkbook();// 生成工作表
			// 往表格里添加数据
			String[] colum = { "日期", "总金额", "总笔数", "支付宝帐号(Email)" };// 创建第一个表头
			String[] value = new String[colum.length];// 创建第一个表中的列宽
			String[] columns = { "序号", "收款银行户名", "收款银行帐号", "收款开户银行",
					"收款银行所在省份", "收款银行所在市", "收款支行名称", "金额", "对公对私标志", "备注" };// 创建第二个表头
			String[] values = new String[columns.length];// 创建第二个表中的列宽
			// excel的名称
			HSSFSheet sheet = workbook.createSheet("提款订单信息");
			// 设置列宽
			sheet.setColumnWidth(0, 5000);
			sheet.setColumnWidth(1, 7000);
			sheet.setColumnWidth(2, 9000);
			sheet.setColumnWidth(3, 7000);
			sheet.setColumnWidth(4, 7000);
			sheet.setColumnWidth(5, 7000);
			sheet.setColumnWidth(6, 7000);
			sheet.setColumnWidth(7, 3000);
			sheet.setColumnWidth(8, 8000);
			sheet.setColumnWidth(9, 3000);
			// 获得字体
			HSSFFont fontTitle = workbook.createFont();
			// 设置字号
			fontTitle.setFontHeightInPoints((short) 14);
			// 单元格风格
			HSSFCellStyle styleTitle = workbook.createCellStyle();
			// 应用字体
			styleTitle.setFont(fontTitle);
			// 上下左右边框风格
			styleTitle.setBorderBottom(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderLeft(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderRight(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderTop(HSSFBorderFormatting.BORDER_THIN);
			int countRow = 0;

			HSSFRow rows = null;// 表格的一行
			HSSFCell cells = null;// 单元格

			rows = sheet.createRow((short) countRow);
			rows.setHeightInPoints(30); // 行高
			// 循环创建行
			for (int count = 0; count < colum.length; count++) {
				cells = rows.createCell((short) count);// 创建单元格
				cells.setCellValue(colum[count]);// 为单元格设置值
				cells.setCellStyle(styleTitle);// 设置单元格的样式
			}
			countRow++;// 表格行计数
			rows = sheet.createRow((short) countRow);
			rows.setHeightInPoints(30); // 设置行高

			Element element = JXmlUtil.string2Xml(bean.toString());
			List<Element> list = element.getChildren("row");
			double money = 0;
			// 计算总金额
			for (int i = 0; i < list.size(); i++) {
				Element e = list.get(i);
				money += Double.valueOf(e.getAttributeValue("imoney"));
			}
			// 日期格式的转化
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			Date date = new Date();
			value[0] = String.valueOf(sdf.format(date));
			value[1] = String.valueOf(money);
			value[2] = String.valueOf(list.size());
			value[3] = String.valueOf("zf@159cai.com");
			for (int count = 0; count < value.length; count++) {
				cells = rows.createCell((short) count);
				cells.setCellValue(value[count]);
				cells.setCellStyle(styleTitle);
			}

			countRow++;

			HSSFRow row = sheet.createRow((short) countRow);
			row.setHeightInPoints(30);

			for (int countCell = 0; countCell < columns.length; countCell++) {
				HSSFCell cell = row.createCell((short) countCell);// 创建单元格
				cell.setCellValue(columns[countCell]);// 为单元格设置值
				cell.setCellStyle(styleTitle);// 设置单元格的样式
			}
			for (int i = 0; i < list.size(); i++) {
				Element e = list.get(i);
				// 生成数据行
				countRow++;
				row = sheet.createRow((short) (countRow));
				row.setHeightInPoints(30); // 设置行高
				values[0] = String.valueOf(e.getAttribute("rec").getValue());
				values[1] = String.valueOf(e.getAttribute("crealname")
						.getValue());
				values[2] = String.valueOf(e.getAttribute("cbankcard")
						.getValue());
				int code = Integer.valueOf(e.getAttribute("cbankcode")
						.getValue());
				if (code == 1) {
					values[3] = String.valueOf("招商银行");
				} else if (code == 2) {
					values[3] = String.valueOf("工商银行");
				} else if (code == 3) {
					values[3] = String.valueOf("建设银行");
				} else if (code == 4) {
					values[3] = String.valueOf("中国银行");
				} else if (code == 5) {
					values[3] = String.valueOf("中国人民银行");
				} else if (code == 6) {
					values[3] = String.valueOf("交通银行");
				} else if (code == 8) {
					values[3] = String.valueOf("中信银行");
				} else if (code == 9) {
					values[3] = String.valueOf("兴业银行");
				} else if (code == 10) {
					values[3] = String.valueOf("光大银行");
				} else if (code == 11) {
					values[3] = String.valueOf("华夏银行");
				} else if (code == 12) {
					values[3] = String.valueOf("中国民生银行");
				} else if (code == 13) {
					values[3] = String.valueOf("中国农业银行");
				} else if (code == 15) {
					values[3] = String.valueOf("农村信用合作社");
				} else if (code == 16) {
					values[3] = String.valueOf("农村商业银行");
				} else if (code == 17) {
					values[3] = String.valueOf("农村合作银行");
				} else if (code == 18) {
					values[3] = String.valueOf("城市商业银行");
				} else if (code == 19) {
					values[3] = String.valueOf("城市信用合作社");
				} else if (code == 20) {
					values[3] = String.valueOf("国家开发银行");
				} else if (code == 21) {
					values[3] = String.valueOf("中国进出口银行");
				} else if (code == 22) {
					values[3] = String.valueOf("恒丰银行");
				} else if (code == 23) {
					values[3] = String.valueOf("平安银行");
				} else if (code == 24) {
					values[3] = String.valueOf("渤海银行");
				} else if (code == 25) {
					values[3] = String.valueOf("中国邮政储蓄银行");
				} else if (code == 1000) {
					values[3] = String.valueOf("广东发展银行");
				} else if (code == 1001) {
					values[3] = String.valueOf("深圳发展银行");
				} else if (code == 1002) {
					values[3] = String.valueOf("广州银行");
				} else if (code == 4000) {
					values[3] = String.valueOf("上海浦东发展银行");
				} else if (code == 7002) {
					values[3] = String.valueOf("徽商银行");
				} else if (code == 5003) {
					values[3] = String.valueOf("宁波银行");
				} else if (code == 2000) {
					values[3] = String.valueOf("北京银行");
				} else if (code == 4001) {
					values[3] = String.valueOf("上海银行");
				} else if (code == 11000) {
					values[3] = String.valueOf("哈尔滨银行");
				} else if (code == 6000) {
					values[3] = String.valueOf("南京银行");
				}
				values[4] = String.valueOf(e.getAttribute("cbankpro")
						.getValue());
				values[5] = String.valueOf(e.getAttribute("cbankcity")
						.getValue());
				if (values[5] != null && values[5].startsWith("临高"))
					continue;
				values[6] = String.valueOf(e.getAttribute("cbankname")
						.getValue());
				Double moneys = Double.valueOf(e.getAttribute("imoney")
						.getValue());
				DecimalFormat fun = new DecimalFormat("##0.00");
				values[7] = String.valueOf(fun.format(moneys));
				values[8] = String.valueOf(2);
				values[9] = String.valueOf("用户提款");
				// 生成数据行的每个单元格
				for (int countCell = 0; countCell < values.length; countCell++) {
					HSSFCell cell = row.createCell((short) countCell);
					cell.setCellValue(values[countCell]);
					cell.setCellStyle(styleTitle);
				}

			}

			// 将表格通过输出流输出到客户端
			workbook.write(os);

			// 刷新缓冲区
			os.flush();
			// 关闭输出流
			os.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 导出资金明细excel
	 * 
	 * @throws IOException
	 */
	public void getDetailsExcel(WebAdmin bean, RbcFrameContext context,
			HttpServletRequest request, HttpServletResponse response) {
		OutputStream os = null;
		try {
			// System.out.println(bean);
			// 指定文件名称的中文问题需要注意
			String fileName = "资金明细.xls";
			// 解决头部信息中文乱码
			fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			// 告诉浏览器不要直接显示，而是让用户决定是显示，还是另存为
			response.setHeader("Content-Disposition", "attachment;filename="
					+ fileName);

			os = response.getOutputStream();
			// 创建Excel表格
			HSSFWorkbook workbook = new HSSFWorkbook();// 生成工作表
			String[] columns = { "流水号", "进账金额", "出账金额", "用户", "交易类型", "发生时间",
					"变化前", "变化后", "业务数据" };
			String[] values = new String[columns.length];

			HSSFSheet sheet = workbook.createSheet("资金明细");
			sheet.setColumnWidth(0, 5000); // 列宽
			sheet.setColumnWidth(1, 3000);
			sheet.setColumnWidth(2, 3000);
			sheet.setColumnWidth(3, 7000);
			sheet.setColumnWidth(4, 9000);
			sheet.setColumnWidth(5, 9000);
			sheet.setColumnWidth(6, 3000);
			sheet.setColumnWidth(7, 3000);
			sheet.setColumnWidth(8, 9000);
			// 获得字体
			HSSFFont fontTitle = workbook.createFont();
			// 设置字号
			fontTitle.setFontHeightInPoints((short) 14);
			// 单元格风格
			HSSFCellStyle styleTitle = workbook.createCellStyle();
			// 应用字体
			styleTitle.setFont(fontTitle);
			// 上下左右边框风格
			styleTitle.setBorderBottom(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderLeft(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderRight(HSSFBorderFormatting.BORDER_THIN);
			styleTitle.setBorderTop(HSSFBorderFormatting.BORDER_THIN);
			int countRow = 0;

			Element element = JXmlUtil.string2Xml(bean.toString());
			List<Element> list = element.getChildren("row");
			for (int i = 0; i < list.size(); i++) {
				Element e = list.get(i);
				HSSFRow row = sheet.createRow((short) (countRow));
				row.setHeightInPoints(30); // 设置行高
				values[0] = String.valueOf(e.getAttribute("ichargeid")
						.getValue());
				Double im = Double.valueOf(e.getAttribute("imoney").getValue());
				Double om = Double.valueOf(e.getAttribute("omoney").getValue());
				values[1] = String.valueOf(im);
				values[2] = String.valueOf(om);
				values[3] = String
						.valueOf(e.getAttribute("cnickid").getValue());
				values[4] = TransactionUtil.getTransactionName(e.getAttribute(
						"ibiztype").getValue());
				values[5] = String.valueOf(e.getAttribute("cadddate")
						.getValue());
				values[6] = String.valueOf(e.getAttribute("ioldmoney")
						.getValue());
				values[7] = String.valueOf(e.getAttribute("ibalance")
						.getValue());
				values[8] = String.valueOf(e.getAttribute("cmemo").getValue());
				// 生成数据行的每个单元格
				for (int countCell = 0; countCell < values.length; countCell++) {
					HSSFCell cell = row.createCell((short) countCell);
					cell.setCellValue(values[countCell]);
					cell.setCellStyle(styleTitle);
				}
				// 生成数据行
				countRow++;
			}
			// 将表格通过输出流输出到客户端
			workbook.write(os);

			// 刷新缓冲区
			os.flush();
			// 关闭输出流
			os.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

}
