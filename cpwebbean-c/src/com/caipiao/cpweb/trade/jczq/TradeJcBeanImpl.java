package com.caipiao.cpweb.trade.jczq;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.cpweb.BaseImpl;
import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.cpweb.trade.PythonFilterUtil;
import com.caipiao.cpweb.trade.TradeBean;
import com.caipiao.cpweb.trade.cache.Cache;
import com.caipiao.cpweb.trade.cache.CacheManager;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.cpweb.upload.FileCastServlet;
import com.caipiao.cpweb.upload.FileUpload;
import com.caipiao.cpweb.util.GroupContain;
import com.caipiao.cpweb.util.Util;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.MD5Util;
import com.mina.rbc.util.StringUtil;
import com.mina.rbc.util.xml.JXmlUtil;
import com.mina.rbc.util.xml.JXmlWapper;
import com.rbc.frame.RbcFrameContext;
import com.rbc.frame.util.Base64;
import com.rbc.frame.util.RemoteBeanCallUtil;

public class TradeJcBeanImpl extends BaseImpl {

    public static Logger logger = LoggerFactory.getLogger("web");
    private String tempfile = "temp";
    private static int Fetdiff = 10;

    private static Map<String, String> playid = new HashMap<String, String>();
    static {
        playid.put("34", "90");// 胜平负
        playid.put("40", "93");// 总进球数
        playid.put("42", "91");// 比分
        playid.put("51", "92");// 半全场
        playid.put("70", "94");// 混合
        playid.put("72", "95");// 让球胜平负
    }

    private static Map<String, String> lotidViewpathMap = new HashMap<String, String>();
    static {
        lotidViewpathMap.put("90", "/jc/");// 让球胜平负
        lotidViewpathMap.put("91", "/jc/");// 比分
        lotidViewpathMap.put("92", "/jc/");// 半全场
        lotidViewpathMap.put("93", "/jc/");// 总进球数
        lotidViewpathMap.put("72", "/jczq/");// 让球胜平负
        lotidViewpathMap.put("70", "/jczq/");// 混投
    }

    private static Map<String, String> ds_playid = new HashMap<String, String>();
    static {
        ds_playid.put("90", "SPF");// 胜平负
        ds_playid.put("72", "RSPF");// 让球胜平负
        ds_playid.put("91", "CBF");// 比分
        ds_playid.put("92", "BQC");// 半全场
        ds_playid.put("93", "JQS");// 总进球数
        ds_playid.put("70", "HH");// 混投
    }

    public static HashMap<String, String> SPFMaps = new HashMap<String, String>();
    static {
        SPFMaps.put("3", "3");
        SPFMaps.put("1", "1");
        SPFMaps.put("0", "0");
    }

    public static HashMap<String, String> SPFMapname = new HashMap<String, String>();
    static {
        SPFMapname.put("3", "胜");
        SPFMapname.put("1", "平");
        SPFMapname.put("0", "负");
    }

    public static HashMap<String, String> RSPFMapname = new HashMap<String, String>();
    static {
        RSPFMapname.put("3", "让胜");
        RSPFMapname.put("1", "让平");
        RSPFMapname.put("0", "让负");
    }

    public static HashMap<String, String> JQSMaps = new HashMap<String, String>();
    static {
        JQSMaps.put("0", "0");
        JQSMaps.put("1", "1");
        JQSMaps.put("2", "2");
        JQSMaps.put("3", "3");
        JQSMaps.put("4", "4");
        JQSMaps.put("5", "5");
        JQSMaps.put("6", "6");
        JQSMaps.put("7", "7");
    }

    public static HashMap<String, String> CBFMaps = new HashMap<String, String>();
    static {
        CBFMaps.put("胜其它", "9:0");
        CBFMaps.put("1:0", "1:0");
        CBFMaps.put("2:0", "2:0");
        CBFMaps.put("2:1", "2:1");
        CBFMaps.put("3:0", "3:0");
        CBFMaps.put("3:1", "3:1");
        CBFMaps.put("3:2", "3:2");
        CBFMaps.put("4:0", "4:0");
        CBFMaps.put("4:1", "4:1");
        CBFMaps.put("4:2", "4:2");
        CBFMaps.put("5:0", "5:0");
        CBFMaps.put("5:1", "5:1");
        CBFMaps.put("5:2", "5:2");
        CBFMaps.put("平其它", "9:9");
        CBFMaps.put("0:0", "0:0");
        CBFMaps.put("1:1", "1:1");
        CBFMaps.put("2:2", "2:2");
        CBFMaps.put("3:3", "3:3");
        CBFMaps.put("负其它", "0:9");
        CBFMaps.put("0:1", "0:1");
        CBFMaps.put("0:2", "0:2");
        CBFMaps.put("1:2", "1:2");
        CBFMaps.put("0:3", "0:3");
        CBFMaps.put("1:3", "1:3");
        CBFMaps.put("2:3", "2:3");
        CBFMaps.put("0:4", "0:4");
        CBFMaps.put("1:4", "1:4");
        CBFMaps.put("2:4", "2:4");
        CBFMaps.put("0:5", "0:5");
        CBFMaps.put("1:5", "1:5");
        CBFMaps.put("2:5", "2:5");
    }

    public static HashMap<String, String> BQCMaps = new HashMap<String, String>();
    static {
        BQCMaps.put("3-3", "3-3");
        BQCMaps.put("3-1", "3-1");
        BQCMaps.put("3-0", "3-0");
        BQCMaps.put("1-3", "1-3");
        BQCMaps.put("1-1", "1-1");
        BQCMaps.put("1-0", "1-0");
        BQCMaps.put("0-3", "0-3");
        BQCMaps.put("0-1", "0-1");
        BQCMaps.put("0-0", "0-0");
    }

    public static HashMap<String, String> BQCMapname = new HashMap<String, String>();
    static {
        BQCMapname.put("3-3", "胜-胜");
        BQCMapname.put("3-1", "胜-平");
        BQCMapname.put("3-0", "胜-负");
        BQCMapname.put("1-3", "平-胜");
        BQCMapname.put("1-1", "平-平");
        BQCMapname.put("1-0", "平-负");
        BQCMapname.put("0-3", "负-胜");
        BQCMapname.put("0-1", "负-平");
        BQCMapname.put("0-0", "负-负");
    }

    public static HashMap<String, String> SPFSpMaps = new HashMap<String, String>();
    static {
        SPFSpMaps.put("3", "0");
        SPFSpMaps.put("1", "1");
        SPFSpMaps.put("0", "2");
    }

    public static HashMap<String, String> JQSSpMaps = new HashMap<String, String>();
    static {
        JQSSpMaps.put("0", "0");
        JQSSpMaps.put("1", "1");
        JQSSpMaps.put("2", "2");
        JQSSpMaps.put("3", "3");
        JQSSpMaps.put("4", "4");
        JQSSpMaps.put("5", "5");
        JQSSpMaps.put("6", "6");
        JQSSpMaps.put("7", "7");
    }

    public static HashMap<String, String> CBFSpMaps = new HashMap<String, String>();
    static {
        CBFSpMaps.put("9:0", "12");
        CBFSpMaps.put("1:0", "0");
        CBFSpMaps.put("2:0", "1");
        CBFSpMaps.put("2:1", "2");
        CBFSpMaps.put("3:0", "3");
        CBFSpMaps.put("3:1", "4");
        CBFSpMaps.put("3:2", "5");
        CBFSpMaps.put("4:0", "6");
        CBFSpMaps.put("4:1", "7");
        CBFSpMaps.put("4:2", "8");
        CBFSpMaps.put("5:0", "9");
        CBFSpMaps.put("5:1", "10");
        CBFSpMaps.put("5:2", "11");
        CBFSpMaps.put("9:9", "17");
        CBFSpMaps.put("0:0", "13");
        CBFSpMaps.put("1:1", "14");
        CBFSpMaps.put("2:2", "15");
        CBFSpMaps.put("3:3", "16");
        CBFSpMaps.put("0:9", "30");
        CBFSpMaps.put("0:1", "18");
        CBFSpMaps.put("0:2", "19");
        CBFSpMaps.put("1:2", "20");
        CBFSpMaps.put("0:3", "21");
        CBFSpMaps.put("1:3", "22");
        CBFSpMaps.put("2:3", "23");
        CBFSpMaps.put("0:4", "24");
        CBFSpMaps.put("1:4", "25");
        CBFSpMaps.put("2:4", "26");
        CBFSpMaps.put("0:5", "27");
        CBFSpMaps.put("1:5", "28");
        CBFSpMaps.put("2:5", "29");
    }

    public static HashMap<String, String> BQCSpMaps = new HashMap<String, String>();
    static {
        BQCSpMaps.put("3-3", "0");
        BQCSpMaps.put("3-1", "1");
        BQCSpMaps.put("3-0", "2");
        BQCSpMaps.put("1-3", "3");
        BQCSpMaps.put("1-1", "4");
        BQCSpMaps.put("1-0", "5");
        BQCSpMaps.put("0-3", "6");
        BQCSpMaps.put("0-1", "7");
        BQCSpMaps.put("0-0", "8");
    }
    public static HashMap<String, String> HHSPMaps = new HashMap<String, String>();// 混合投注
    static {
        HHSPMaps.put("3-3", "0");
        HHSPMaps.put("3-1", "1");
        HHSPMaps.put("3-0", "2");
        HHSPMaps.put("1-3", "3");
        HHSPMaps.put("1-1", "4");
        HHSPMaps.put("1-0", "5");
        HHSPMaps.put("0-3", "6");
        HHSPMaps.put("0-1", "7");
        HHSPMaps.put("0-0", "8");
        HHSPMaps.put("9:0", "21");
        HHSPMaps.put("1:0", "9");
        HHSPMaps.put("2:0", "10");
        HHSPMaps.put("2:1", "11");
        HHSPMaps.put("3:0", "12");
        HHSPMaps.put("3:1", "13");
        HHSPMaps.put("3:2", "14");
        HHSPMaps.put("4:0", "15");
        HHSPMaps.put("4:1", "16");
        HHSPMaps.put("4:2", "17");
        HHSPMaps.put("5:0", "18");
        HHSPMaps.put("5:1", "19");
        HHSPMaps.put("5:2", "20");
        HHSPMaps.put("9:9", "26");
        HHSPMaps.put("0:0", "22");
        HHSPMaps.put("1:1", "23");
        HHSPMaps.put("2:2", "24");
        HHSPMaps.put("3:3", "25");
        HHSPMaps.put("0:9", "39");
        HHSPMaps.put("0:1", "27");
        HHSPMaps.put("0:2", "28");
        HHSPMaps.put("1:2", "29");
        HHSPMaps.put("0:3", "30");
        HHSPMaps.put("1:3", "31");
        HHSPMaps.put("2:3", "32");
        HHSPMaps.put("0:4", "33");
        HHSPMaps.put("1:4", "34");
        HHSPMaps.put("2:4", "35");
        HHSPMaps.put("0:5", "36");
        HHSPMaps.put("1:5", "37");
        HHSPMaps.put("2:5", "38");
        HHSPMaps.put("0", "40");
        HHSPMaps.put("1", "41");
        HHSPMaps.put("2", "42");
        HHSPMaps.put("3", "43");
        HHSPMaps.put("4", "44");
        HHSPMaps.put("5", "45");
        HHSPMaps.put("6", "46");
        HHSPMaps.put("7", "47");
        HHSPMaps.put("胜", "48");
        HHSPMaps.put("平", "49");
        HHSPMaps.put("负", "50");
        HHSPMaps.put("让胜", "51");
        HHSPMaps.put("让平", "52");
        HHSPMaps.put("让负", "53");
    }

    private static String getItemCode(String key, String playid) {
        if ("34".equals(playid)) {
            return SPFMaps.get(key);
        } else if ("40".equals(playid)) {
            return JQSMaps.get(key);
        } else if ("42".equals(playid)) {
            return CBFMaps.get(key);
        } else if ("51".equals(playid)) {
            return BQCMaps.get(key);
        }
        return null;
    }

    public static void main(String[] args) throws Exception {
        String spf = "3.20,3.60,2.4000";
        System.out.println(getsp(spf, "1"));
        System.out.println(MD5Util.compute("121220" + "_" + "20121220225241" + "_" + PythonFilterUtil.CUSPWD));

        // 过滤后的号码组合 Base64解码
        // String glResult =
        // "eJyVkaENwDAMBPepCv5tWIUWR8oAXSTDF1UKsOs8e3Dgzh79njSaAWDz89u2bG8+/eDDa2zRlGiU\nNCUTSiaUTCCZQDJBaULpOxkdm2R0bVJ/h9IFIVVmdFyZ0XElpEr8V77rOr6r\n";
        String glResult = "eJyV0TEKgDAMBdD7iEN+ojhIV2ehB/AiPbxQUcTYpNkyPD4/Sd63AgYzESHJeM+c6JklUZEBx7Lm\nphalZ0ND6cnQ7yaoWjq1VI3O3lc2d2pxNULZcLNh3vu7JYU0QhekkG71Rkj7TfzslvZ76+9Y2T/6\nBA8evr4=\n";
        byte[] b = null;
        try {
            b = Base64.decode(glResult);
        } catch (Exception e) {
            System.out.println("GuoLvBeanImpl.getGuoLvData--解码不成功");

        }
        // 号码组合 解压缩
        byte[] fristDcm = PythonFilterUtil.decompress(b);
        // 号码组合 解压缩
        // byte[] secondDcm = PythonFilterUtil.decompress(fristDcm);
        glResult = new String(fristDcm);
        System.out.println(glResult);// MD5(glCC_glSel_cusPwd)

        File file = new File("/Users/qinjian/Downloads/90_130905100802_7d3c39022841a484cb24dbaf81436ae7.txt");
        String encode = Util.get_charset(file);
        System.out.println("文件编码：" + encode);

        // Pattern pattern =
        // Pattern.compile("\\s*\\[.+\\]((\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)\\s*/\\s*)*(\\s*\\d\\s*:\\s*\\d\\s*)\\s*,\\s*)*(\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)/)*(\\s*\\d\\s*:\\s*\\d\\s*)))\\|\\s*\\d\\s*\\*\\s*\\d\\s*");
        Pattern pattern = Pattern
                .compile("\\s*(\\[比分\\]|CBF\\||cbf\\|){1}((\\s*\\d+\\s*=(\\s*\\d\\s*:\\s*\\d\\s*/)*(\\s*\\d\\s*:\\s*\\d\\s*),)*(\\s*\\d+\\s*=(\\s*\\d\\s*:\\s*\\d\\s*/)*(\\s*\\d\\s*:\\s*\\d\\s*))+\\s*)\\|(\\s*\\d+\\s*\\*\\s*\\d+\\s*)");
        // Matcher matcher = pattern.matcher("[比分]130905001=1:2/2:1,130905002=2:1|2*1,1*1");
        // Matcher matcher = pattern.matcher("CBF|130905001=1:2/2:1,130905002=2:1|2*1,1*1");
        Matcher matcher = pattern.matcher("cbf|130905001=1:2/2:1,130905002=2:1|2*1,1*1");
        if (matcher.find()) {
            // System.out.println(matcher.group(0));
            // System.out.println(matcher.group(2));
            // System.out.println(matcher.group(9));
        }

        FilterResult result = new FilterResult();
        CodeBean codebean = new CodeBean();
        codebean.setCodeitems("10=10,20=20,21=21,30=30,31=31,32=32,40=40,41=41,42=42,50=50,51=51,52=52,90=90,00=00,11=11,22=22,33=33,99=99,01=01,02=02,03=03,12=12,13=13,23=23,04=04,14=14,24=24,05=05,15=15,25=25,09=09");
        codebean.setPlaytype(ds_playid.get("91"));
        codebean.setLottype(Integer.parseInt("91"));

        codebean.setItemType(CodeBean.HAVEITEM);
        // codebean.setCode("CBF|130905001=1:2,130905002=2:1|2*1");
        codebean.setCode("[比分]130905001=1:2/2:1,130905002=2:1/1:1|2*1,1*1");
        codebean.setCode("[比分]130906005=1:2/2:1,130906006=1:2/2:1/2:3,130906007=0:2/1:2/2:0/2:1|3*1");
        codebean.setGuoguan("2*1");

        FilterBase.doFilterJc(codebean, result);
        System.out.println(result.getAllCode());
        System.out.println(result.getTeamItems());

    }

    public static Double getsp(String sprow, String spidstr) throws Exception {
        String[] sp = sprow.split(",");
        int spid = Integer.parseInt(spidstr);
        if (sp.length > spid && sp[spid].length() > 0) {
            return Math.round(Double.parseDouble(sp[spid]) * 100) / 100.0;
        }
        return null;
    }

    private void checkItems(String[] itemcodes, String playid) throws Exception {
        HashMap<String, String> its = new HashMap<String, String>();
        if (playid.equalsIgnoreCase("34") || playid.equalsIgnoreCase("72")) {// //让球胜平负
            for (String s : itemcodes) {
                if (!SPFMaps.containsKey(s)) {
                    throw new Exception("投注项不符合要求(1)");
                } else {
                    its.put(s.trim(), SPFMaps.get(s));
                }
            }
        } else if (playid.equalsIgnoreCase("40")) {// 总进球数
            for (String s : itemcodes) {
                if (!JQSMaps.containsKey(s)) {
                    throw new Exception("投注项不符合要求(1)");
                } else {
                    its.put(s.trim(), JQSMaps.get(s));
                }
            }
        } else if (playid.equalsIgnoreCase("42")) {// 比分
            for (String s : itemcodes) {
                System.out.println(s);
                if (!CBFMaps.containsKey(s)) {
                    throw new Exception("投注项不符合要求(1)" + s);
                } else {
                    its.put(s.trim(), CBFMaps.get(s));
                }
            }
        } else if (playid.equalsIgnoreCase("51")) {// 半全场
            for (String s : itemcodes) {
                System.out.println(s);
                if (!BQCMaps.containsKey(s)) {
                    throw new Exception("投注项不符合要求(1)");
                } else {
                    its.put(s.trim(), BQCMaps.get(s));
                }
            }
        } else {
            throw new Exception("不支持的玩法ID(2)");
        }

        if (its.size() != itemcodes.length) {
            its.clear();
            its = null;
            throw new Exception("存在重复投注项(3)");
        }
        its.clear();
        its = null;
    }

    private String getBack(String playid) {
        switch (Integer.valueOf(playid)) {
            case 34:
                return "/jc/";
            case 40:
                return "/jc/";
            case 42:
                return "/jc/";
            case 51:
                return "/jc/";
            default:
                return "/jc/jchh.html";
        }
    }

    private String getfsBack(String playid) {
        switch (Integer.valueOf(playid)) {
            case 34:
                return "/jc/";
            case 40:
                return "/jc/";
            case 42:
                return "/jc/";
            case 51:
                return "/jc/";
            default:
                return "/jc/index.html";
        }
    }

    /**
     * 奖金优化投注
     * 
     * @param bean
     * @param context
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public int project_jjyh(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        try {
            String content = bean.getContent();

            content = StringUtil.replaceString(content, "&gt;", ">");

            String ishm = bean.getIshm();
            String gid = bean.getGid();
            String beishu = "1";// 投注倍数
            String item = "";// 投注场次列表
            String gg = "";// 过关类型 3*1
            // String str = "";//过关类型 3串1

            String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"
                    + FileUpload.getFileName(bean.getUid(), gid, "jczq").toLowerCase();
            String initems = "1";// 是否包含场次信息 0 不包含 1 包含
            String codes = filename.toLowerCase() + ".txt";

            int total = 0;
            try {
                List<String> lst = new ArrayList<String>();
                String[] ss = StringUtil.splitter(content, ";");

                StringBuffer sbOld = new StringBuffer();
                for (int i = 0; i < ss.length; i++) {
                    if (!CheckUtil.isNullString(ss[i])) {
                        String[] sss = StringUtil.splitter(ss[i], "_");
                        int mul = Integer.parseInt(sss[1]);
                        for (int j = 0; j < mul; j++) {
                            lst.add(sss[0]);
                        }

                        if (CheckUtil.isNullString(gg)) {
                            int p = sss[0].lastIndexOf("|");
                            gg = sss[0].substring(p + 1);
                            // str = StringUtil.replaceString(gg, "*", "串");
                        }
                        sbOld.append(ss[i]);
                        if (i != ss.length - 1) {
                            sbOld.append("\r\n");
                        }
                    }
                }

                StringBuffer sb = new StringBuffer();
                GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
                if (plugin != null) {
                    List<String> itmList = new ArrayList<String>();
                    for (int i = 0; i < lst.size(); i++) {
                        GameCastCode gcc = plugin.parseGameCastCode(lst.get(i));
                        total += gcc.getCastMoney() * 1;

                        sb.append(lst.get(i));
                        if (i != lst.size() - 1) {
                            sb.append("\r\n");
                        }

                        String mids = gcc.getMatchID();
                        String[] ssm = StringUtil.splitter(mids, ",");
                        for (int j = 0; j < ssm.length; j++) {
                            if (!CheckUtil.isNullString(ssm[j])) {
                                if (!itmList.contains(ssm[j])) {
                                    itmList.add(ssm[j]);
                                }
                            }
                        }
                    }

                    item = "";
                    for (int i = 0; i < itmList.size(); i++) {
                        item += itmList.get(i) + ",";
                    }
                    if (item.length() > 0) {
                        item = item.substring(0, item.length() - 1);
                    }

                    if (!Util.SaveFile(sbOld.toString(), FileCastServlet.PATH + File.separator + tempfile, filename
                            + ".txt", "gbk")) {
                        logger.error(filename + ".txt" + "：原始格式文件存储失败");
                        throw new Exception("存储失败");
                    }

                    if (!Util.SaveFile(sb.toString(), FileCastServlet.PATH + File.separator + tempfile, filename
                            + "_n.txt", "gbk")) {
                        logger.error(filename + "_n.txt" + "：出票格式文件存储失败");
                        throw new Exception("存储失败");
                    }

                    StringBuffer yhxml = new StringBuffer();
                    yhxml.append("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
                    yhxml.append("<xml>");
                    yhxml.append("<row ").append(JXmlUtil.createAttrXml("codes", content));
                    yhxml.append(" ").append(JXmlUtil.createAttrXml("matchs", bean.getOld_codes()));
                    yhxml.append(" ").append(JXmlUtil.createAttrXml("type", bean.getYhtyp())).append(" />");
                    yhxml.append("</xml>");
                    if (!Util.SaveFile(yhxml.toString(), FileCastServlet.PATH + File.separator + tempfile, filename
                            + "_yd.xml", "utf-8")) {
                        logger.error(filename + "_yh.xml" + "：存储失败");
                        throw new Exception("存储失败");
                    }
                    yhxml = null;

                } else {
                    throw new Exception("该玩法不支持奖金优化！");
                }

                if (total > 1000000) {
                    throw new Exception("检测到注数超过限制范围！");
                }
            } catch (Exception e) {
                e.printStackTrace();
                throw new Exception("上传发生错误");
            }

            Cache cache = null;
            CacheManager cm = CacheManager.getCacheManager();
            cache = cm.getCacheMatch(gid, bean.getExpect());

            if (cache == null || cache.isExpired()) {

                String[] fn = new String[] { "jczq_hh.xml", "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml",
                        "jczq_jqs.xml" };

                int value = Integer.parseInt(gid) - 90;
                if (value < 0) {
                    value = 0;
                }

                JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
                int count = xml.countXmlNodes("row");
                System.out.println(count);
                List<MatchBean> mList = new ArrayList<MatchBean>();
                for (int i = 0; i < count; i++) {
                    String mid = xml.getStringValue("row[" + i + "].@itemid");
                    String hn = xml.getStringValue("row[" + i + "].@hn");
                    String gn = xml.getStringValue("row[" + i + "].@gn");
                    String bt = xml.getStringValue("row[" + i + "].@mt");
                    String et = xml.getStringValue("row[" + i + "].@et");

                    String fet = "";
                    Date tmpet = DateUtil.parserDateTime(et);
                    tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                    fet = DateUtil.getDateTime(tmpet.getTime());

                    String b3 = xml.getStringValue("row[" + i + "].@bet3");
                    String b1 = xml.getStringValue("row[" + i + "].@bet1");
                    String b0 = xml.getStringValue("row[" + i + "].@bet0");
                    int close = xml.getIntValue("row[" + i + "].@close", 0);
                    String mname = xml.getStringValue("row[" + i + "].@name");

                    MatchBean mb = new MatchBean();
                    mb.setItemid(mid);
                    mb.setHn(hn);
                    mb.setGn(gn);
                    mb.setBt(bt);
                    mb.setEt(fet);
                    mb.setB3(b3);
                    mb.setB1(b1);
                    mb.setB0(b0);
                    mb.setClose(close);
                    mb.setMname(mname);

                    switch (value) {
                        case 0:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                            break;
                        case 1:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                            break;
                        case 2:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                            break;
                        case 3:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                            break;
                        default:
                            break;
                    }
                    mList.add(mb);
                }
                Cache ca = new Cache(gid + bean.getExpect(), mList, System.currentTimeMillis() + 1000 * 60, false);
                cm.putCacheMatch(gid, bean.getExpect(), ca);
                System.out.println(gid + "_" + bean.getExpect() + "本地缓存更新");
                cache = ca;

            } else {
                System.out.println(gid + "_" + bean.getExpect() + "来源本地缓存");
            }

            if (cache != null) {
                Date firsttime = null;
                List<MatchBean> mb = (List<MatchBean>) cache.getValue();
                System.out.println("item=" + item);
                // 获取方案的截至时间
                String[] itemstr = StringUtil.splitter(item, ",");
                int chang = itemstr.length;
                for (int i = 0; i < chang; i++) {
                    for (int ii = 0; ii < mb.size(); ii++) {
                        if (mb.get(ii).getItemid().equals(itemstr[i])) {
                            Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                            if (firsttime == null) {
                                firsttime = tmp;
                            } else {
                                if (tmp.getTime() < firsttime.getTime()) {
                                    firsttime = tmp;
                                }
                            }
                        }
                    }
                }

                System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
                request.setAttribute("errcode", "0");
                request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
                request.setAttribute("mb", mb);

                request.setAttribute("beishu", beishu);
                request.setAttribute("codes", codes);
                request.setAttribute("rand", filename);
                request.setAttribute("restore", "{ 'matches' : '" + item + "', 'ggtype' : '" + gg + "', 'beishu' : '"
                        + beishu + "', 'flag' : '0'}");

                request.setAttribute("gggroupstr", "自由过关");

                request.setAttribute("IsCutMulit", beishu);
                request.setAttribute("ishm", ishm);
                request.setAttribute("lotid", gid);
                request.setAttribute("playid", gid);
                request.setAttribute("sgtype", gg);
                request.setAttribute("ggname", "3=3,1=1,0=0");
                request.setAttribute("totalmoney", total * Integer.parseInt(beishu));
                request.setAttribute("zhushu", total / 2);
                request.setAttribute("source", "9");// 投注来源
                request.setAttribute("items", item);
                request.setAttribute("initems", initems);
                request.setAttribute("matchnum", chang);

                request.setAttribute("backurl", getBack(gid));
                System.out.println("--------------" + getBack(gid));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    @SuppressWarnings("unchecked")
    public int project_fqck(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        System.out.println("isCutMulit=" + bean.getIsCutMulit());
        System.out.println("Ishm=" + bean.getIshm());
        int matchnum = bean.getCodes().split("/").length;

        Cache cache = null;
        CacheManager cm = CacheManager.getCacheManager();

        System.out.println(playid.get(bean.getPlayid()));

        cache = cm.getCacheMatch(playid.get(bean.getPlayid())+"_jczq", bean.getExpect());

        if (cache == null || cache.isExpired()) {

            String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml", "jczq_hh.xml",
                    "jczq_rspf.xml" };

            int value = Integer.parseInt(playid.get(bean.getPlayid())) - 90;
            JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
            int count = xml.countXmlNodes("row");
            System.out.println(count);
            List<MatchBean> mList = new ArrayList<MatchBean>();
            for (int i = 0; i < count; i++) {
                String mid = xml.getStringValue("row[" + i + "].@itemid");
                String hn = xml.getStringValue("row[" + i + "].@hn");
                String gn = xml.getStringValue("row[" + i + "].@gn");
                String bt = xml.getStringValue("row[" + i + "].@mt");
                String et = xml.getStringValue("row[" + i + "].@et");
                String b3 = xml.getStringValue("row[" + i + "].@bet3");
                String b1 = xml.getStringValue("row[" + i + "].@bet1");
                String b0 = xml.getStringValue("row[" + i + "].@bet0");
                int close = xml.getIntValue("row[" + i + "].@close", 0);
                String mname = xml.getStringValue("row[" + i + "].@name");

                MatchBean mb = new MatchBean();
                mb.setItemid(mid);
                mb.setHn(hn);
                mb.setGn(gn);
                mb.setBt(bt);
                mb.setEt(et);
                mb.setB3(b3);
                mb.setB1(b1);
                mb.setB0(b0);
                mb.setClose(close);
                mb.setMname(mname);

                switch (value) {
                    case 0:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                        break;
                    case 1:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                        break;
                    case 2:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                        break;
                    case 3:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                        break;
                    case 4:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc") + ","
                                + xml.getStringValue("row[" + i + "].@cbf") + ","
                                + xml.getStringValue("row[" + i + "].@jqs") + ","
                                + xml.getStringValue("row[" + i + "].@spf") + ","
                                + xml.getStringValue("row[" + i + "].@rspf"));
                        break;
                    case 5:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@rspf"));
                        break;
                    default:
                        break;
                }
                mList.add(mb);
            }
            Cache ca = new Cache(playid.get(bean.getPlayid())+"_jczq" + bean.getExpect(), mList,
                    System.currentTimeMillis() + 1000 * 60, false);
            cm.putCacheMatch(playid.get(bean.getPlayid())+"_jczq", bean.getExpect(), ca);
            System.out.println(playid.get(bean.getPlayid()) +"_jczq"+ "_" + bean.getExpect() + "本地缓存更新");
            cache = ca;

        } else {
            System.out.println(playid.get(bean.getPlayid()) +"_jczq"+ "_" + bean.getExpect() + "来源本地缓存");
        }

        if (cache != null) {

            Date firsttime = null;

            List<MatchBean> mb = (List<MatchBean>) cache.getValue();

            String Codes = bean.getCodes();
            System.out.println(Codes);
            String[] code = StringUtil.splitter(Codes, "/");
            String[] chang = new String[code.length];
            String Newcode = "";
            String Danstr = "";
            // 40973|130314001|SPF>[3]/40974|130314002|JQS>[0]/
            // 40975|130314003|JQS>[0]/40975|130314003|BF>[1:0]/
            // 40975|130314003|BQC>[3-3]/40976|130314004|SPF>[3]/40976|130314004|JQS>[0]
            if ("70".equals(bean.getLotid())) {
                HashMap<String, String> maps = new HashMap<String, String>();
                for (int i = 0; i < code.length; i++) {
                    String[] codestr = StringUtil.splitter(code[i], "|");
                    chang[i] = codestr[1].trim();

                    String _playid = codestr[2].substring(0, codestr[2].indexOf(">"));
                    String $playid = "";
                    if (_playid.equals("SPF") || _playid.equals("RSPF")) {
                        $playid = "34";
                    } else if (_playid.equals("JQS")) {
                        $playid = "40";
                    } else if (_playid.equals("BQC")) {
                        $playid = "51";
                    } else if (_playid.equals("CBF")) {
                        $playid = "42";
                    }
                    // 41058|130316008|SPF>[3,1,0]/41059|130316009|JQS>[0]
                    String sc = codestr[2].substring(codestr[2].indexOf("["));
                    System.out.println("sc=" + sc);
                    if (sc.substring(0, 1).equalsIgnoreCase("[") && sc.substring(sc.length() - 1).equalsIgnoreCase("]")) {
                        String[] ccs = StringUtil.splitter(sc.substring(1, sc.length() - 1), ",");
                        checkItems(ccs, $playid);
                        StringBuffer _sb = new StringBuffer();
                        for (int k = 0; k < ccs.length; k++) {
                            _sb.append(getItemCode(ccs[k], $playid));
                            if (k != ccs.length - 1) {
                                _sb.append("/");
                            }
                        }
                        String tmp = _playid + "=" + _sb.toString();

                        String val = maps.get(chang[i]);
                        if (val == null) {
                            val = tmp;
                        } else {
                            val += "+" + tmp;
                        }
                        maps.put(chang[i], val);
                        System.out.println(chang[i] + "=" + val);
                    } else {
                        throw new Exception("投注串不符合要求(4)");
                    }
                }
                System.out.println("size:" + maps.size());
                
                TreeMap treemap = new TreeMap(maps);  
                
                StringBuffer sb = new StringBuffer();
                sb.append("HH|");
                for (Iterator<String> its = treemap.keySet().iterator(); its.hasNext();) {
                    String key = its.next();
                    sb.append(key).append(">").append(treemap.get(key));
                    sb.append(",");
                }
                String stmp = sb.toString();
                if (stmp.endsWith(",")) {
                    stmp = stmp.substring(0, stmp.length() - 1);
                }
                Newcode = stmp + "|" + bean.getSgtypename().replaceAll("串", "*");
                if ("1".equals(request.getParameter("ismix"))) {
                    Newcode += "|1";
                }
                // HH|130316001>SPF=3+CBF=4:0/9:9,130316002>CBF=4:0/4:1,130316003>JQS=7/6/5/4,130316004>BQC=0-0/0-3/0-1/1-0/1-1|2*1,3*1
            } else {
                for (int i = 0; i < code.length; i++) {

                    String[] codestr = StringUtil.splitter(code[i], "|");
                    Newcode = Newcode + codestr[1] + "/";

                    String[] cs = new String[2];

                    cs[0] = code[i].substring(code[i].indexOf("|") + 1, code[i].indexOf("["));
                    cs[1] = code[i].substring(code[i].indexOf("["));

                    System.out.println("a=" + cs[0]);
                    System.out.println("b=" + cs[1]);

                    chang[i] = cs[0];
                    if (cs[1].substring(0, 1).equalsIgnoreCase("[")
                            && cs[1].substring(cs[1].length() - 1).equalsIgnoreCase("]")) {
                        String[] ccs = StringUtil.splitter(cs[1].substring(1, cs[1].length() - 1), ",");
                        checkItems(ccs, bean.getPlayid());
                    } else {
                        throw new Exception("投注串不符合要求(4)");
                    }
                }

                Newcode = Newcode.substring(0, Newcode.length() - 1);
            }
            System.out.println("Newcode=" + Newcode);

            StringBuffer msb = new StringBuffer();
            msb.append("<match>");
            // 获取方案的截至时间
            for (int i = 0; i < chang.length; i++) {
                for (int ii = 0; ii < mb.size(); ii++) {
                    if (mb.get(ii).getItemid().equals(chang[i])) {
                        Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                        if (firsttime == null) {
                            firsttime = tmp;
                        } else {
                            if (tmp.getTime() < firsttime.getTime()) {
                                firsttime = tmp;
                            }
                        }
                        msb.append(mb);
                    }
                }
            }
            msb.append("</match>");

            // 胆码转换成需要的格式 200|1[3,1,0]/201|2[3,1,0] -> 1[3,1,0]/2[3,1,0]
            if (bean.getDanma().length() > 10) {
                String[] Dstr = StringUtil.splitter(bean.getDanma(), "/");
                for (int a = 0; a < Dstr.length; a++) {
                    Danstr += Dstr[a].substring(Dstr[a].indexOf("|") + 1) + "/";
                }
                Danstr = Danstr.substring(0, Danstr.length() - 1);
            }

            System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
            System.out.println("Danstr：" + Danstr);
            System.out.println("bean.getDanma()：" + bean.getDanma());
            request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
            request.setAttribute("mb", mb);
            request.setAttribute("ismix", request.getParameter("ismix"));

            request.setAttribute("beishu", bean.getBeishu());
            request.setAttribute("codes", bean.getCodes());
            request.setAttribute("newcodes", Newcode);
            request.setAttribute("danma", bean.getDanma());
            request.setAttribute("newdanma", Danstr);
            request.setAttribute("expect", bean.getExpect());

            if (bean.getSgtype() == "3") {
                request.setAttribute("gggroupstr", "自由过关");
            } else {
                request.setAttribute("gggroupstr", "组合过关");
            }

            request.setAttribute("gggroup", bean.getGggroup());
            request.setAttribute("IsCutMulit", bean.getIsCutMulit());
            request.setAttribute("ishm", bean.getIshm());
            request.setAttribute("lotid", bean.getLotid());
            request.setAttribute("playid", bean.getPlayid());
            request.setAttribute("sgtype", bean.getSgtype());
            request.setAttribute("sgtypename", bean.getSgtypename());
            request.setAttribute("totalmoney", bean.getTotalmoney());
            request.setAttribute("zhushu", bean.getZhushu());
            
            request.setAttribute("source", String.valueOf(bean.getSource()));

            request.setAttribute("matchnum", matchnum);

            request.setAttribute("backurl", getfsBack(bean.getPlayid()));

            StringBuffer sb = new StringBuffer();
            sb.append("<jc ");
            Enumeration<String> enums = request.getAttributeNames();
            while (enums.hasMoreElements()) {
                String key = enums.nextElement();
                String val = String.valueOf(request.getAttribute(key));
                sb.append(JXmlUtil.createAttrXml(key, val));
            }
            sb.append("/>");
            sb.append(msb);

            request.getSession().setAttribute(BaseImpl.SESSION_FORWARD + "_jcck", sb.toString());
            System.out.println("--------------" + getfsBack(bean.getPlayid()));
        }
        return 0;
    }

    public int check_login(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        return BaseImpl.check_login(bean, context, request, response);
    }

    public int set_user_data(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        return BaseImpl.set_user_data(bean, context, request, response);
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

    private boolean isValid(String tmp) {
        if (tmp.indexOf("=") == -1) {
            return false;
        }
        return true;
    }

    /**
     * 成功发起方案后的文件处理
     * 
     * @param file
     * @throws Exception
     */
    private void fileOperator(File file, TradeJcBean bean) throws Exception {
        if (file != null) {
            try {
                File dFile = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator
                        + bean.getExpect());
                if (!dFile.exists()) {
                    dFile.mkdirs();
                    System.out.println(dFile.getPath() + "文件夹创建成功");
                }

                // 移动用户原始文件到对应文件夹
                File df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator
                        + bean.getExpect() + File.separator + bean.getRand() + ".txt");
                if (FileUpload.fileCopy(file, df)) {
                    if (!file.delete()) {
                        System.out.println(file.getAbsolutePath() + "文件删除失败");
                    }
                } else {
                    System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
                }

                // 移动出票格式的文件到对应文件夹
                file = new File(FileCastServlet.PATH + File.separator + tempfile, bean.getRand() + "_n.txt");
                df = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator
                        + bean.getExpect() + File.separator + bean.getRand() + "_n.txt");
                if (FileUpload.fileCopy(file, df)) {
                    if (!file.delete()) {
                        System.out.println(file.getAbsolutePath() + "出票格式文件删除失败");
                    }
                } else {
                    System.out.println(file.getAbsolutePath() + "移动到" + df.getAbsolutePath() + "文件夹失败");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
    
    private void glfileOperator(File file, TradeJcBean bean) throws Exception {
		if (file != null) {
			try {
				File gldf = new File(FileCastServlet.PATH + File.separator + bean.getLotid() + File.separator + bean.getExpect() + File.separator + bean.getRand() + "_gl.xml");
				if (FileUpload.fileCopy(file, gldf)) {
					if (!file.delete()) {
						System.out.println(file.getAbsolutePath() + "文件删除失败");
					}
				} else {
					System.out.println(file.getAbsolutePath() + "移动到" + gldf.getAbsolutePath() + "文件夹失败");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

    private void uploadErr(HttpServletResponse response, TradeJcBean bean, Exception e) {
        File file = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand()
                + ".txt");
        if (file != null) {
            file.delete();
        }
        file = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand() + "_n.txt");
        if (file != null) {
            file.delete();
        }
        // try {
        // write_html_response("{errcode:1,msg:'" + e.getMessage() + "'}",
        // response);
        // } catch (Exception e1) {
        // e1.printStackTrace();
        // }
    }

    private int maxPostSize = 50 * 1024 * 1024;
    private final String UPFILE = "upfile";

    // 单式第一次验证
    @SuppressWarnings("unchecked")
    public int project_dsck(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        FileUpload upload = null;
        try {

            long ustime = System.currentTimeMillis();
            System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
            try {
                // 构造对象
                upload = new FileUpload(request, FileCastServlet.PATH + File.separator + tempfile,
                        new String[] { "txt" }, this.maxPostSize);
            } catch (Exception e) {
                throw new Exception("上传发生错误");
            }

            long uetime = System.currentTimeMillis();
            System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
            System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
            System.out.println("文件保存位置：" + FileCastServlet.PATH);

            // 获取参数
            File file = null;
            String codes = "";// 投注号码（文件投注的文件名）
            String str = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggname")), "");// 自定义选项
            String gid = StringUtil.getNullString(String.valueOf(upload.getRequestField("playid")), "90");// 种类玩法
                                                                                                          // SPF...
            String ishm = StringUtil.getNullString(String.valueOf(upload.getRequestField("ishm")), "1");// 种类玩法
                                                                                                        // SPF...
            String beishu = StringUtil.getNullString(String.valueOf(upload.getRequestField("beishu")), "1");// 投注倍数
            String item = StringUtil.getNullString(String.valueOf(upload.getRequestField("matches")), "");// 投注场次列表
            String gg = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggtype")), "2*1");// 过关类型
            String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
            String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"
                    + FileUpload.getFileName(bean.getUid(), gid, "jczq").toLowerCase();

            upload.setFileName(UPFILE, filename);
            file = upload.getFile(UPFILE);
            int total = 0;
            if (file != null) {// 如果有上传文件的话
                codes = file.getName().toLowerCase();
                System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

                GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
                if (plugin != null) {

                    FileInputStream fis = new FileInputStream(file);
                    String encode = Util.get_charset(file);
                    BufferedReader br = new BufferedReader(new InputStreamReader(fis, encode));

                    String temp = null;

                    FilterResult result = new FilterResult();
                    CodeBean codebean = new CodeBean();
                    codebean.setCodeitems(str);
                    codebean.setPlaytype(ds_playid.get(gid));
                    codebean.setLottype(Integer.parseInt(gid));

                    while ((temp = br.readLine()) != null) {
                        if (!StringUtil.isEmpty(temp)) {
                            System.out.println("temp：" + temp);
                            if (initems.equals("1")) {
                                codebean.setItemType(CodeBean.HAVEITEM);
                                codebean.setCode(temp);
                                codebean.setGuoguan(gg);
                            } else {
                                codebean.setItemType(CodeBean.NOITEM);
                                codebean.setCode(temp);
                                codebean.setTeamitems(item);
                                codebean.setGuoguan(gg);
                            }

                            String codeStr = temp.replaceAll("\\s+", "");
                            String[] codestring = codeStr.split("_");
                            int bs = 1;// 单式解析倍数
                            int len = codestring.length;
                            if (len == 1) {
                                bs = 1;
                            } else if (len == 2) {
                                if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                                    bs = Integer.parseInt(codestring[1].trim());
                                } else {
                                    throw new Exception("投注格式中倍数异常,code=" + codeStr);
                                }
                            } else {
                                throw new Exception("投注格式异常,code=" + codeStr);
                            }

                            FilterBase.doFilterJc(codebean, result);

                            if (isValid(result.getCurrentCode())) {
                                try {
                                    GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
                                    total += gcc.getCastMoney() * bs;
                                    System.out.println("total：" + total);
                                } catch (Exception e) {
                                    throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                                    // e.getMessage()
                                }

                                for (int n = 1; n < bs; n++) {
                                    result.addCode(result.getCurrentCode());
                                }

                                if (total > 1000000) {
                                    throw new Exception("上传文件中检测到注数超过限制范围！");
                                }
                            }
                        }
                    }
                    fis.close();
                    if (initems.equals("1")) {// 包含场次过关
                        gg = result.getGglists();
                    }

                    item = result.getTeamItems();

                    if (total < 2 || item.equals("")) {
                        throw new Exception("上传文件中未能检测到正确的注数！");
                    }

                    if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + tempfile,
                            filename + "_n.txt", "gbk")) {
                        logger.error(filename + "_n.txt" + "：存储失败");
                        throw new Exception("存储失败");
                    }
                    ;
                }
            }

            // set JSP页面值
            // PeriodBean periodbean = new PeriodBean();
            // periodbean.setGid("5");
            // periodbean.setPid("");

            Cache cache = null;
            CacheManager cm = CacheManager.getCacheManager();

            System.out.println(gid);

            cache = cm.getCacheMatch(gid, bean.getExpect());

            if (cache == null || cache.isExpired()) {

                String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml",
                        "jczq_rspf.xml" };

                int value = Integer.parseInt(gid) - 90;
                if (value < 0) {
                    value = 4;
                }
                JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
                int count = xml.countXmlNodes("row");
                System.out.println(count);
                List<MatchBean> mList = new ArrayList<MatchBean>();
                for (int i = 0; i < count; i++) {
                    String mid = xml.getStringValue("row[" + i + "].@itemid");
                    String hn = xml.getStringValue("row[" + i + "].@hn");
                    String gn = xml.getStringValue("row[" + i + "].@gn");
                    String bt = xml.getStringValue("row[" + i + "].@mt");
                    String et = xml.getStringValue("row[" + i + "].@et");

                    String fet = "";
                    Date tmpet = DateUtil.parserDateTime(et);
                    tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                    fet = DateUtil.getDateTime(tmpet.getTime());

                    String b3 = xml.getStringValue("row[" + i + "].@bet3");
                    String b1 = xml.getStringValue("row[" + i + "].@bet1");
                    String b0 = xml.getStringValue("row[" + i + "].@bet0");
                    int close = xml.getIntValue("row[" + i + "].@close", 0);
                    String mname = xml.getStringValue("row[" + i + "].@name");

                    MatchBean mb = new MatchBean();
                    mb.setItemid(mid);
                    mb.setHn(hn);
                    mb.setGn(gn);
                    mb.setBt(bt);
                    mb.setEt(fet);
                    mb.setB3(b3);
                    mb.setB1(b1);
                    mb.setB0(b0);
                    mb.setClose(close);
                    mb.setMname(mname);

                    switch (value) {
                        case 0:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                            break;
                        case 1:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                            break;
                        case 2:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                            break;
                        case 3:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                            break;
                        case 4:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@rspf"));
                            break;
                        default:
                            break;
                    }
                    mList.add(mb);
                }
                Cache ca = new Cache(gid + bean.getExpect(), mList, System.currentTimeMillis() + 1000 * 60, false);
                cm.putCacheMatch(gid, bean.getExpect(), ca);
                System.out.println(gid + "_" + bean.getExpect() + "本地缓存更新");
                cache = ca;

            } else {
                System.out.println(gid + "_" + bean.getExpect() + "来源本地缓存");
            }

            if (cache != null) {

                Date firsttime = null;

                List<MatchBean> mb = (List<MatchBean>) cache.getValue();
                System.out.println("item=" + item);
                // 获取方案的截至时间
                String[] itemstr = StringUtil.splitter(item, ",");
                int chang = itemstr.length;
                for (int i = 0; i < chang; i++) {
                    boolean f=false;
                    for (int ii = 0; ii < mb.size(); ii++) {
                        if (mb.get(ii).getItemid().equals(itemstr[i])) {
                            f=true;
                            Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                            if (firsttime == null) {
                                firsttime = tmp;
                            } else {
                                if (tmp.getTime() < firsttime.getTime()) {
                                    firsttime = tmp;
                                }
                            }
                        }
                    }
                    if (!f){
                        throw new Exception(itemstr[i]+"场次不存在，请核对场次格式");
                    }
                }

                System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
                request.setAttribute("errcode", "0");
                request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
                request.setAttribute("mb", mb);

                request.setAttribute("beishu", beishu);
                request.setAttribute("codes", codes);
                request.setAttribute("rand", filename);
                request.setAttribute("restore", "{ 'matches' : '" + item + "', 'ggtype' : '" + gg + "', 'beishu' : '"
                        + beishu + "', 'flag' : '0'}");

                request.setAttribute("gggroupstr", "自由过关");

                request.setAttribute("IsCutMulit", beishu);
                request.setAttribute("ishm", ishm);
                request.setAttribute("lotid", gid);
                request.setAttribute("playid", gid);
                request.setAttribute("sgtype", gg);
                request.setAttribute("ggname", str);
                request.setAttribute("totalmoney", total * Integer.parseInt(beishu));
                request.setAttribute("zhushu", total / 2);
                request.setAttribute("source", "0");// 投注来源
                request.setAttribute("items", item);
                request.setAttribute("initems", initems);
                request.setAttribute("matchnum", chang);

                request.setAttribute("backurl", getBack(gid));
                System.out.println("--------------" + getBack(gid));

            }
        } catch (Exception e) {
            uploadErr(request, e, upload);
        }
        return 0;
    }

    // 单式第二次验证-生成方案
    @SuppressWarnings("unchecked")
    public int project_dscreate(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	System.out.println("project_dscreate");
    	if (bean.getDanshi()==0) {
    		System.out.println("danshi------------"+bean.getDanshi());
            project_hhjjyhcreate(bean, context, request, response);
            return 0;
        } else {
            try {
                File file = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand()
                        + ".txt");
                File file2 = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator
                        + bean.getRand() + "_n.txt");
                if (!file.exists()) {
                    throw new Exception("上传文件不存在 请从正确途径提交方案");
                }
                if (!file2.exists()) {
                    throw new Exception("生成格式文件不存在 请从正确途径提交方案");
                }
                // String filename = FileUpload.getFileName(bean.getUid(),
                // bean.getLotid(), bean.getExpect()).toLowerCase();
                // bean.setRand1(file2);// 发起成功后的文件名
                String codes = (bean.getRand() + "_n.txt").toLowerCase();
                String items = null;

                long cstime = System.currentTimeMillis();
                System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

                GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(bean.getLotid());
                if (plugin != null) {
                    FileInputStream fis = new FileInputStream(file);
                    String encode = Util.get_charset(file);
                    BufferedReader br = new BufferedReader(new InputStreamReader(fis, encode));

                    String tmp = null;
                    int total = 0;
                    String gglists = null;

                    FilterResult result = new FilterResult();
                    CodeBean codebean = new CodeBean();
                    codebean.setCodeitems(bean.getGgname());// 自定义
                    codebean.setPlaytype(ds_playid.get(bean.getLotid()));
                    codebean.setLottype(Integer.parseInt(bean.getLotid()));

                    while ((tmp = br.readLine()) != null) {
                        if (!CheckUtil.isNullString(tmp)) {
                            if (bean.getInitems().equals("1")) {
                                codebean.setItemType(CodeBean.HAVEITEM);
                                codebean.setCode(tmp);
                                codebean.setGuoguan(bean.getGgtype());
                            } else {
                                codebean.setItemType(CodeBean.NOITEM);
                                codebean.setCode(tmp);
                                codebean.setTeamitems(bean.getItems());// 场次ID
                                codebean.setGuoguan(bean.getGgtype());
                            }
                            String codeStr = tmp.replaceAll("\\s+", "");
                            String[] codestring = codeStr.split("_");
                            int bs = 1;// 单式解析倍数
                            int len = codestring.length;
                            if (len == 1) {
                                bs = 1;
                            } else if (len == 2) {
                                if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                                    bs = Integer.parseInt(codestring[1].trim());
                                } else {
                                    throw new Exception("投注格式中倍数异常,code=" + codeStr);
                                }
                            } else {
                                throw new Exception("投注格式异常,code=" + codeStr);
                            }

                            FilterBase.doFilterJc(codebean, result);

                            if (isValid(result.getCurrentCode())) {
                                try {
                                    GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
                                    total += gcc.getCastMoney() * bs;
                                    //System.out.println("total：" + total);
                                } catch (Exception e) {
                                    throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                                    // e.getMessage()
                                }

                                if (total > 1000000) {
                                    throw new Exception("上传文件中检测到注数超过限制范围！");
                                }
                            }
                        }
                    }
                    fis.close();
                    items = result.getTeamItems();
                    gglists = result.getGglists();

                    // PeriodBean periodbean = new PeriodBean();
                    // periodbean.setGid("5");
                    // periodbean.setPid("");

                    Cache cache = null;
                    CacheManager cm = CacheManager.getCacheManager();

                    System.out.println("lotid = " + bean.getLotid());
                    System.out.println("---------------------------------------");
                    cache = cm.getCacheMatch(bean.getLotid(), bean.getExpect());

                    if (cache == null || cache.isExpired()) {

                    	String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml",
                                "jczq_rspf.xml","jczq_hh.xml" };

                        int value = Integer.parseInt(bean.getLotid()) - 90;
                        if (value < 0) {
                            value = 4;
                            if(bean.getLotid()=="70"){
                            	value = 5;
                            }
                        }
                        JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
                        int count = xml.countXmlNodes("row");
                        System.out.println(count);
                        List<MatchBean> mList = new ArrayList<MatchBean>();
                        for (int i = 0; i < count; i++) {
                            String mid = xml.getStringValue("row[" + i + "].@itemid");
                            String hn = xml.getStringValue("row[" + i + "].@hn");
                            String gn = xml.getStringValue("row[" + i + "].@gn");
                            String bt = xml.getStringValue("row[" + i + "].@mt");
                            String et = xml.getStringValue("row[" + i + "].@et");

                            String fet = "";
                            Date tmpet = DateUtil.parserDateTime(et);
                            tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                            fet = DateUtil.getDateTime(tmpet.getTime());

                            String b3 = xml.getStringValue("row[" + i + "].@bet3");
                            String b1 = xml.getStringValue("row[" + i + "].@bet1");
                            String b0 = xml.getStringValue("row[" + i + "].@bet0");
                            int close = xml.getIntValue("row[" + i + "].@close", 0);
                            String mname = xml.getStringValue("row[" + i + "].@name");

                            MatchBean mb = new MatchBean();
                            mb.setItemid(mid);
                            mb.setHn(hn);
                            mb.setGn(gn);
                            mb.setBt(bt);
                            mb.setEt(fet);
                            mb.setB3(b3);
                            mb.setB1(b1);
                            mb.setB0(b0);
                            mb.setClose(close);
                            mb.setMname(mname);

                            switch (value) {
                                case 0:
                                    mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                                    break;
                                case 1:
                                    mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                                    break;
                                case 2:
                                    mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                                    break;
                                case 3:
                                    mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                                    break;
                                case 4:
                                    mb.setSpv(xml.getStringValue("row[" + i + "].@rspf"));
                                    break;
                                default:
                                    break;
                            }
                            mList.add(mb);
                        }
                        Cache ca = new Cache(bean.getLotid() + bean.getExpect(), mList,
                                System.currentTimeMillis() + 1000 * 60, false);
                        cm.putCacheMatch(bean.getLotid(), bean.getExpect(), ca);
                        System.out.println(bean.getLotid() + "_" + bean.getExpect() + "  本地缓存更新");
                        System.out.println("--------------------------------------------");
                        cache = ca;
                        System.out.println("--------------------------------------------");

                    } else {
                        System.out.println(bean.getLotid() + "_" + bean.getExpect() + "  来源本地缓存");
                    }
                    
                    System.out.println("--------------------------------------------");
                    System.out.println(cache);

                    if (cache != null) {

                        Date firsttime = null;

                        List<MatchBean> mb = (List<MatchBean>) cache.getValue();
                        
                        System.out.println(items);
                        
                        // 获取方案的截至时间
                        String[] itemstr = StringUtil.splitter(items, ",");
                        int chang = itemstr.length;
                        
                        System.out.println(chang);
                        
                        for (int i = 0; i < chang; i++) {
                            for (int ii = 0; ii < mb.size(); ii++) {
                                if (mb.get(ii).getItemid().equals(itemstr[i])) {
                                    Date tmpdate = DateUtil.parserDateTime(mb.get(ii).getEt());
                                    if (firsttime == null) {
                                        firsttime = tmpdate;
                                    } else {
                                        if (tmpdate.getTime() < firsttime.getTime()) {
                                            firsttime = tmpdate;
                                        }
                                    }
                                }
                            }
                        }
                        if (System.currentTimeMillis() > firsttime.getTime()) {
                            throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
                        }
                        String dtime = DateUtil.getDateTime(firsttime.getTime());
                        String expect = dtime.substring(0, 4) + "" + dtime.substring(5, 7) + ""
                                + dtime.substring(8, 10);
                        bean.setExpect(expect);

                    }

                    System.out.println("result.getAllCode()=" + result.getAllCode());
                    System.out.println("result.getTotalMoney()=" + result.getTotalMoney());
                    System.out.println("items=" + items);
                    System.out.println("gglists=" + gglists);
                    System.out.println("total=" + total);

                    if (bean.getAmoney() != total * bean.getBeishu()) {
                        throw new Exception("方案金额不正确 请从正确途径提交方案");
                    }

                } else {
                    throw new Exception("该玩法暂未开通");
                }
                long cetime = System.currentTimeMillis();
                System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
                System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");

                TradeBean bean1 = new TradeBean();

                bean1.setUid(bean.getUid());
                bean1.setPwd(bean.getPwd());
                bean1.setGid(bean.getLotid());// 游戏编号
                bean1.setPid(bean.getExpect());// 期次编号
                bean1.setPlay(0);// 玩法
                bean1.setCodes(codes);// 投注号码（文件投注的文件名）
                bean1.setMuli(bean.getBeishu());// 投注倍数
                bean1.setFflag(1);// 文件标志（0 是号码 1 是文件）
                bean1.setType(bean.getIshm().equalsIgnoreCase("1") ? 1 : 0);// 方案类型(0代购
                                                                            // 1合买)
                bean1.setName(bean.getTitle());// 方案标题
                bean1.setDesc(bean.getContent());// 方案描叙
                bean1.setMoney(bean.getAmoney());// 方案金额
                bean1.setTnum(bean.getAllnum());// 方案份数
                bean1.setBnum(bean.getBuynum());// 购买份数
                bean1.setPnum(bean.getBaodinum());// 保底份数
                bean1.setOflag(bean.getIsshow());// 公开标志
                bean1.setWrate(bean.getTcbili());// 提成比率
                bean1.setComeFrom(bean.getComeFrom());// 方案来源
                bean1.setSource(bean.getSource());// 投注来源
                bean1.setEndTime("");// 截止时间
                bean1.setZid("," + items + ",");

                System.out.println("items：" + items);
                fileOperator(file, bean);
                //过滤文件移动
    			File glfile = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand() + "_gl.xml");
    			if (glfile.exists()) {
    				glfileOperator(glfile, bean);
    			}
                int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "jproj_cast");
                if (rc != 0 || bean1.getBusiErrCode() != 0) {
                    throw new Exception("投注失败：" + bean1.getBusiErrDesc());
                }

                // uploadSucc(response, 0, bean1.getHid());
                bean.setBusiErrCode(bean1.getBusiErrCode());
                bean.setBusiErrDesc(bean1.getBusiErrDesc());
                bean.setBusiXml(bean1.getBusiXml());
            } catch (Exception e) {
            	e.printStackTrace();
                uploadErr(response, bean, e);
                bean.setBusiErrCode(1);
                bean.setBusiErrDesc(e.getMessage());
            }

            return 0;
        }
    }

    // 混合奖金优化投注最后一部提交
    public int project_hhjjyhcreate(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        try {
            File file = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand()
                    + ".txt");
            File file2 = new File(FileCastServlet.PATH + File.separator + tempfile + File.separator + bean.getRand()
                    + "_n.txt");
            if (!file.exists()) {
                throw new Exception("上传文件不存在 请从正确途径提交方案");
            }
            if (!file2.exists()) {
                throw new Exception("生成格式文件不存在 请从正确途径提交方案");
            }
            String codes = (bean.getRand() + "_n.txt").toLowerCase();
            String items = null;

            long cstime = System.currentTimeMillis();
            System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

            GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(bean.getLotid());
            if (plugin != null) {
                FileInputStream fis = new FileInputStream(file);
                String encode = Util.get_charset(file);
                BufferedReader br = new BufferedReader(new InputStreamReader(fis, encode));

                String tmp = null;
                int total = 0;
                // String gglists = null;

                while ((tmp = br.readLine()) != null) {
                    if (!CheckUtil.isNullString(tmp)) {
                        String codeStr = tmp.replaceAll("\\s+", "");
                        String[] codestring = codeStr.split("_");
                        int bs = 1;// 单式解析倍数
                        int len = codestring.length;
                        if (len == 1) {
                            bs = 1;
                        } else if (len == 2) {
                            if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                                bs = Integer.parseInt(codestring[1].trim());
                            } else {
                                throw new Exception("投注格式中倍数异常,code=" + codeStr);
                            }
                        } else {
                            throw new Exception("投注格式异常,code=" + codeStr);
                        }

                        String ncode = codestring[0].trim();
                        if (isValid(ncode)) {
                            try {
                                GameCastCode gcc = plugin.parseGameCastCode(ncode);
                                total += gcc.getCastMoney() * bs;
                                // items=gcc.getMatchID();
                                System.out.println("total：" + total);
                            } catch (Exception e) {
                                throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                                // e.getMessage()
                            }

                            if (total > 1000000) {
                                throw new Exception("上传文件中检测到注数超过限制范围！");
                            }
                        }
                    }
                }
                fis.close();
                items = bean.getItems();
                // items = result.getTeamItems();
                // gglists = result.getGglists();

                Cache cache = null;
                CacheManager cm = CacheManager.getCacheManager();

                System.out.println(bean.getLotid());

                cache = cm.getCacheMatch(bean.getLotid(), bean.getExpect());

                if (cache == null || cache.isExpired()) {

                    // String[] fn = new String[] { "jczq_hh.xml",
                    // "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml" };

                    // int value = Integer.parseInt(bean.getLotid()) - 90;
                    JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", "jczq_hh.xml"));
                    int count = xml.countXmlNodes("row");
                    System.out.println(count);
                    List<MatchBean> mList = new ArrayList<MatchBean>();
                    for (int i = 0; i < count; i++) {
                        String mid = xml.getStringValue("row[" + i + "].@itemid");
                        String hn = xml.getStringValue("row[" + i + "].@hn");
                        String gn = xml.getStringValue("row[" + i + "].@gn");
                        String bt = xml.getStringValue("row[" + i + "].@mt");
                        String et = xml.getStringValue("row[" + i + "].@et");

                        String fet = "";
                        Date tmpet = DateUtil.parserDateTime(et);
                        tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                        fet = DateUtil.getDateTime(tmpet.getTime());

                        String b3 = xml.getStringValue("row[" + i + "].@bet3");
                        String b1 = xml.getStringValue("row[" + i + "].@bet1");
                        String b0 = xml.getStringValue("row[" + i + "].@bet0");
                        int close = xml.getIntValue("row[" + i + "].@close", 0);
                        String mname = xml.getStringValue("row[" + i + "].@name");

                        MatchBean mb = new MatchBean();
                        mb.setItemid(mid);
                        mb.setHn(hn);
                        mb.setGn(gn);
                        mb.setBt(bt);
                        mb.setEt(fet);
                        mb.setB3(b3);
                        mb.setB1(b1);
                        mb.setB0(b0);
                        mb.setClose(close);
                        mb.setMname(mname);
                        mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));

                        mList.add(mb);
                    }
                    Cache ca = new Cache(bean.getLotid() + bean.getExpect(), mList,
                            System.currentTimeMillis() + 1000 * 60, false);
                    cm.putCacheMatch(bean.getLotid(), bean.getExpect(), ca);
                    System.out.println(bean.getLotid() + "_" + bean.getExpect() + "本地缓存更新");
                    cache = ca;

                } else {
                    System.out.println(bean.getLotid() + "_" + bean.getExpect() + "来源本地缓存");
                }

                if (cache != null) {

                    Date firsttime = null;

                    List<MatchBean> mb = (List<MatchBean>) cache.getValue();

                    // 获取方案的截至时间
                    String[] itemstr = StringUtil.splitter(items, ",");
                    int chang = itemstr.length;
                    for (int i = 0; i < chang; i++) {
                        for (int ii = 0; ii < mb.size(); ii++) {
                            if (mb.get(ii).getItemid().equals(itemstr[i])) {
                                Date tmpdate = DateUtil.parserDateTime(mb.get(ii).getEt());
                                if (firsttime == null) {
                                    firsttime = tmpdate;
                                } else {
                                    if (tmpdate.getTime() < firsttime.getTime()) {
                                        firsttime = tmpdate;
                                    }
                                }
                            }
                        }
                    }
                    if (System.currentTimeMillis() > firsttime.getTime()) {
                        throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
                    }
                    String dtime = DateUtil.getDateTime(firsttime.getTime());
                    String expect = dtime.substring(0, 4) + "" + dtime.substring(5, 7) + "" + dtime.substring(8, 10);
                    bean.setExpect(expect);

                }

                System.out.println("items=" + items);
                System.out.println("total=" + total);

                if (bean.getAmoney() != total * bean.getBeishu()) {
                    throw new Exception("方案金额不正确 请从正确途径提交方案");
                }

            } else {
                throw new Exception("该玩法暂未开通");
            }
            long cetime = System.currentTimeMillis();
            System.out.println("文件解析结束：" + DateUtil.getCurrentDateTime());
            System.out.println("文件解析耗时：" + (cetime - cstime) / 1000 + "秒");

            TradeBean bean1 = new TradeBean();

            bean1.setUid(bean.getUid());
            bean1.setPwd(bean.getPwd());
            bean1.setGid(bean.getLotid());// 游戏编号
            bean1.setPid(bean.getExpect());// 期次编号
            bean1.setPlay(0);// 玩法
            bean1.setCodes(codes);// 投注号码（文件投注的文件名）
            bean1.setMuli(bean.getBeishu());// 投注倍数
            bean1.setFflag(1);// 文件标志（0 是号码 1 是文件）
            bean1.setType(bean.getIshm().equalsIgnoreCase("1") ? 1 : 0);// 方案类型(0代购
                                                                        // 1合买)
            bean1.setName(bean.getTitle());// 方案标题
            bean1.setDesc(bean.getContent());// 方案描叙
            bean1.setMoney(bean.getAmoney());// 方案金额
            bean1.setTnum(bean.getAllnum());// 方案份数
            bean1.setBnum(bean.getBuynum());// 购买份数
            bean1.setPnum(bean.getBaodinum());// 保底份数
            bean1.setOflag(bean.getIsshow());// 公开标志
            bean1.setWrate(bean.getTcbili());// 提成比率
            bean1.setComeFrom(bean.getComeFrom());// 方案来源
            bean1.setSource(9);// 投注来源
            bean1.setEndTime("");// 截止时间
            bean1.setZid("," + items + ",");

            System.out.println("items：" + items);
            fileOperator(file, bean);
            int rc = RemoteBeanCallUtil.RemoteBeanCall(bean1, context, GroupContain.TRADE_GROUP, "jproj_cast");
            if (rc != 0 || bean1.getBusiErrCode() != 0) {
                System.out.println("混合优化调用 rc=" + rc + " ecode=" + bean1.getBusiErrCode() + " edesc="
                        + bean1.getBusiErrDesc());
                throw new Exception("投注失败：" + bean1.getBusiErrDesc());
            }
            bean.setBusiErrCode(bean1.getBusiErrCode());
            bean.setBusiErrDesc(bean1.getBusiErrDesc());
            bean.setBusiXml(bean1.getBusiXml());
        } catch (Exception e) {
            uploadErr(response, bean, e);
            bean.setBusiErrCode(1);
            bean.setBusiErrDesc(e.getMessage());
        }

        return 0;
    }

    // 单式后上传验证
    @SuppressWarnings("unchecked")
    public int project_hsc(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String uid = null;
        String pwd = null;
        FileUpload upload = null;
        try {

            long ustime = System.currentTimeMillis();
            System.out.println("开始上传：" + DateUtil.getCurrentDateTime());
            try {
                // 构造对象
                upload = new FileUpload(request, FileCastServlet.PATH + File.separator + tempfile,
                        new String[] { "txt" }, this.maxPostSize);
            } catch (Exception e) {
                throw new Exception("上传发生错误");
            }

            long uetime = System.currentTimeMillis();
            System.out.println("上传完成：" + DateUtil.getCurrentDateTime());
            System.out.println("上传耗时：" + (uetime - ustime) / 1000 + "秒");
            System.out.println("文件保存位置：" + FileCastServlet.PATH);

            // 检查是否登录
            HttpSession session = request.getSession();
            uid = (String) session.getAttribute(UID_KEY);
            pwd = (String) session.getAttribute(PWD_KEY);

            if (CheckUtil.isNullString(uid) || CheckUtil.isNullString(pwd)) {
                throw new Exception("尚未登录！");
            } else {
                bean.setUid(uid);
                bean.setPwd(pwd);
            }

            // 获取参数
            File file = null;
            String codes = "";// 投注号码（文件投注的文件名）
            String str = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggname")), "");// 自定义选项
            String gid = StringUtil.getNullString(String.valueOf(upload.getRequestField("playid")), "90");// 种类玩法
                                                                                                          // SPF...
            String hid = StringUtil.getNullString(upload.getRequestField("projid"));// 方案编号
            String item = StringUtil.getNullString(String.valueOf(upload.getRequestField("matches")), "");// 投注场次列表
            String gg = StringUtil.getNullString(String.valueOf(upload.getRequestField("ggtype")), "2*1");// 过关类型
            String initems = StringUtil.getNullString(upload.getRequestField("initems"));// 是否包含场次信息
            String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"
                    + FileUpload.getFileName(uid, gid, "jczq").toLowerCase();
            codes = (filename + "_n.txt").toLowerCase();
            bean.setLotid(gid);
            bean.setRand(filename);
            upload.setFileName(UPFILE, filename);
            file = upload.getFile(UPFILE);

            // 方案验证
            TradeBean bean2 = new TradeBean();
            bean2.setUid(uid);
            bean2.setGid(gid);
            bean2.setHid(hid);

            int rct = RemoteBeanCallUtil.RemoteBeanCall(bean2, context, GroupContain.TRADE_GROUP, "queryProjectInfo");
            if (rct != 0 || bean2.getBusiErrCode() != 0) {
                throw new Exception("获取方案信息失败：" + bean2.getBusiErrDesc());
            }

            JXmlWapper lxml = JXmlWapper.parse(bean2.toXmlString());

            // JXmlWapper myjoin = lxml.getXmlNode("myjoins.myjoin");

            JXmlWapper row = lxml.getXmlNode("row");

            String nickid = "";
            String cnickid = "";
            int isupload = 0;
            String ccodes = "";
            int ifile = 0;

            int muli = 0;
            int money = 0;
            int play = 0;
            String pid = ""; // 期次
            Date firsttime = null;

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
            } else {
                throw new Exception("您不是方案的发起人,无权上传方案");
            }

            System.out.println("play=" + play);

            if (nickid == "" && !nickid.equalsIgnoreCase(cnickid)) {
                throw new Exception("您不是方案的发起人,无权上传方案,请检查是否登录正确的用户名");
            }
            if (isupload == 1 || ccodes != "" || ifile != 1) {
                throw new Exception("方案已经上传");
            }
            if (pid == "") {
                throw new Exception("方案信息获取失败");
            }

            int total = 0;
            if (file != null) {// 如果有上传文件的话
                // codes = file.getName().toLowerCase();
                System.out.println("文件解析：" + DateUtil.getCurrentDateTime());

                GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
                if (plugin != null) {

                    FileInputStream fis = new FileInputStream(file);
                    String encode = Util.get_charset(file);
                    BufferedReader br = new BufferedReader(new InputStreamReader(fis, encode));

                    String temp = null;

                    FilterResult result = new FilterResult();
                    CodeBean codebean = new CodeBean();
                    codebean.setCodeitems(str);
                    codebean.setPlaytype(ds_playid.get(gid));
                    codebean.setLottype(Integer.parseInt(gid));

                    while ((temp = br.readLine()) != null) {
                        if (!StringUtil.isEmpty(temp)) {
                            System.out.println("temp：" + temp);
                            if (initems.equals("1")) {
                                codebean.setItemType(CodeBean.HAVEITEM);
                                codebean.setCode(temp);
                                codebean.setGuoguan(gg);
                            } else {
                                codebean.setItemType(CodeBean.NOITEM);
                                codebean.setCode(temp);
                                codebean.setTeamitems(item);
                                codebean.setGuoguan(gg);
                            }

                            String codeStr = temp.replaceAll("\\s+", "");
                            String[] codestring = codeStr.split("_");
                            int bs = 1;// 单式解析倍数
                            int len = codestring.length;
                            if (len == 1) {
                                bs = 1;
                            } else if (len == 2) {
                                if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                                    bs = Integer.parseInt(codestring[1].trim());
                                } else {
                                    throw new Exception("投注格式中倍数异常,code=" + codeStr);
                                }
                            } else {
                                throw new Exception("投注格式异常,code=" + codeStr);
                            }

                            FilterBase.doFilterJc(codebean, result);

                            if (isValid(result.getCurrentCode())) {
                                try {
                                    GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
                                    total += gcc.getCastMoney() * bs;
                                    System.out.println("total：" + total);
                                } catch (Exception e) {
                                    throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                                    // e.getMessage()
                                }

                                for (int n = 1; n < bs; n++) {
                                    result.addCode(result.getCurrentCode());
                                }

                                if (total > 1000000) {
                                    throw new Exception("上传文件中检测到注数超过限制范围！");
                                }
                            }
                        }
                    }
                    fis.close();
                    if (initems.equals("1")) {// 包含场次过关
                        gg = result.getGglists();
                    }

                    item = result.getTeamItems();

                    if (total < 2 || item.equals("")) {
                        throw new Exception("上传文件中未能检测到正确的注数！");
                    }
                    if (money > 0 && money != total * muli) {
                        throw new Exception("上传文件总金额(" + total * muli + ")与方案总金额(" + money + ")不一致！");
                    }

                    if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + tempfile,
                            filename + "_n.txt", "gbk")) {
                        logger.error(filename + "_n.txt" + "：存储失败");
                        throw new Exception("存储失败");
                    }
                    ;

                }
            }

            Cache cache = null;
            CacheManager cm = CacheManager.getCacheManager();

            System.out.println(gid);

            cache = cm.getCacheMatch(gid, bean.getExpect());

            if (cache == null || cache.isExpired()) {

                String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml","jczq_rspf.xml"};

                int value = Integer.parseInt(gid) - 90;
                if (value < 0) {
                    value = 4;
                }
                //if(Integer.parseInt(gid) == 72) value = 5;
                //else if (Integer.parseInt(gid) == 70) value = 4;
                
                JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
                int count = xml.countXmlNodes("row");
                System.out.println(count);
                List<MatchBean> mList = new ArrayList<MatchBean>();
                for (int i = 0; i < count; i++) {
                    String mid = xml.getStringValue("row[" + i + "].@itemid");
                    String hn = xml.getStringValue("row[" + i + "].@hn");
                    String gn = xml.getStringValue("row[" + i + "].@gn");
                    String bt = xml.getStringValue("row[" + i + "].@mt");
                    String et = xml.getStringValue("row[" + i + "].@et");

                    String fet = "";
                    Date tmpet = DateUtil.parserDateTime(et);
                    tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                    fet = DateUtil.getDateTime(tmpet.getTime());

                    String b3 = xml.getStringValue("row[" + i + "].@bet3");
                    String b1 = xml.getStringValue("row[" + i + "].@bet1");
                    String b0 = xml.getStringValue("row[" + i + "].@bet0");
                    int close = xml.getIntValue("row[" + i + "].@close", 0);
                    String mname = xml.getStringValue("row[" + i + "].@name");

                    MatchBean mb = new MatchBean();
                    mb.setItemid(mid);
                    mb.setHn(hn);
                    mb.setGn(gn);
                    mb.setBt(bt);
                    mb.setEt(fet);
                    mb.setB3(b3);
                    mb.setB1(b1);
                    mb.setB0(b0);
                    mb.setClose(close);
                    mb.setMname(mname);

                    switch (value) {
                        case 0:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                            break;
                        case 1:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                            break;
                        case 2:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                            break;
                        case 3:
                            mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                            break;
                        default:
                            break;
                    }
                    mList.add(mb);
                }
                Cache ca = new Cache(gid + bean.getExpect(), mList, System.currentTimeMillis() + 1000 * 60, false);
                cm.putCacheMatch(gid, bean.getExpect(), ca);
                System.out.println(gid + "_" + bean.getExpect() + "本地缓存更新");
                cache = ca;

            } else {
                System.out.println(gid + "_" + bean.getExpect() + "来源本地缓存");
            }

            if (cache != null) {

                // Date firsttime = null;

                List<MatchBean> mb = (List<MatchBean>) cache.getValue();

                // 获取方案的截至时间
                String[] itemstr = StringUtil.splitter(item, ",");
                int chang = itemstr.length;
                for (int i = 0; i < chang; i++) {
                    for (int ii = 0; ii < mb.size(); ii++) {
                        if (mb.get(ii).getItemid().equals(itemstr[i])) {
                            Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                            if (firsttime == null) {
                                firsttime = tmp;
                            } else {
                                if (tmp.getTime() < firsttime.getTime()) {
                                    firsttime = tmp;
                                }
                            }
                        }
                    }
                }

                System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
                if (System.currentTimeMillis() > firsttime.getTime()) {
                    throw new Exception("方案截至时间为：" + DateUtil.getDateTime(firsttime.getTime()) + " 下次请提前");
                }
                String dtime = DateUtil.getDateTime(firsttime.getTime());
                String expect = dtime.substring(0, 4) + "" + dtime.substring(5, 7) + "" + dtime.substring(8, 10);
                bean.setExpect(expect);

            }

            bean2.setUid(uid);
            bean2.setPwd(pwd);
            bean2.setGid(gid);
            bean2.setHid(hid);
            bean2.setCodes(codes);
            bean2.setMoney(money);
            bean2.setEndTime(String.valueOf(DateUtil.getDateTime(firsttime.getTime())));

            bean2.setPid(bean.getExpect());

            fileOperator(file, bean);
            int rc1 = RemoteBeanCallUtil.RemoteBeanCall(bean2, context, GroupContain.TRADE_GROUP, "proj_upload");
            if (rc1 != 0 || bean2.getBusiErrCode() != 0) {
                throw new Exception("方案后上传失败：" + bean2.getBusiErrDesc());
            }

            // uploadSuccess(out, upload, bean.getHid(),1);
            // bean.setBusiErrCode(bean2.getBusiErrCode());
            // bean.setBusiErrDesc(bean2.getBusiErrDesc());
            // bean.setBusiXml(bean2.getBusiXml());
            write_html_response("<script>window.location='" + lotidViewpathMap.get(bean.getLotid())
                    + "project.html?lotid=" + bean.getLotid() + "&projid=" + hid + "'</script>", response);
        } catch (Exception e) {
            uploadErr(response, bean, e);
            write_html_response(
                    "<script>alert('"
                            + e.getMessage()
                            + "');if (history.length == 0){window.opener = '';window.close();} else {history.go(-1);}</script>",
                    response);
        }
        return 0;
    }

    public int sendfilter(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Cache cache = null;
        CacheManager cm = CacheManager.getCacheManager();
        
        System.out.println(playid.get(bean.getPlayid()));

        cache = cm.getCacheMatch(playid.get(bean.getPlayid())+"_jczq", bean.getExpect());
        String playType = "zq_xspf";
        if (cache == null || cache.isExpired()) {
            String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml", "jczq_hh.xml",
            "jczq_rspf.xml" };
            System.out.println(bean.getPlayid()+"------------------------------------"+playid.get(bean.getPlayid()));
            int value = Integer.parseInt(playid.get(bean.getPlayid())) - 90;
            JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
            int count = xml.countXmlNodes("row");
            System.out.println(count);
            List<MatchBean> mList = new ArrayList<MatchBean>();
            for (int i = 0; i < count; i++) {
                String mid = xml.getStringValue("row[" + i + "].@itemid");
                String hn = xml.getStringValue("row[" + i + "].@hn");
                String gn = xml.getStringValue("row[" + i + "].@gn");
                String bt = xml.getStringValue("row[" + i + "].@mt");
                String et = xml.getStringValue("row[" + i + "].@et");
                String b3 = xml.getStringValue("row[" + i + "].@bet3");
                String b1 = xml.getStringValue("row[" + i + "].@bet1");
                String b0 = xml.getStringValue("row[" + i + "].@bet0");
                int close = xml.getIntValue("row[" + i + "].@close", 0);
                String mname = xml.getStringValue("row[" + i + "].@name");

                MatchBean mb = new MatchBean();
                mb.setItemid(mid);
                mb.setHn(hn);
                mb.setGn(gn);
                mb.setBt(bt);
                mb.setEt(et);
                mb.setB3(b3);
                mb.setB1(b1);
                mb.setB0(b0);
                mb.setClose(close);
                mb.setMname(mname);

                switch (value) {
                    case 0:
                    	playType="zq_xspf";
                        mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                        break;
                    case 1:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                        break;
                    case 2:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                        break;
                    case 3:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                        break;
                    case 4:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc") + ","
                                + xml.getStringValue("row[" + i + "].@cbf") + ","
                                + xml.getStringValue("row[" + i + "].@jqs") + ","
                                + xml.getStringValue("row[" + i + "].@spf") + ","
                                + xml.getStringValue("row[" + i + "].@rspf"));
                        break;
                    case 5:
                    	playType="zq_spf";
                        mb.setSpv(xml.getStringValue("row[" + i + "].@rspf"));
                        break;
                    default:
                        break;
                }
                mList.add(mb);
            }
            Cache ca = new Cache(playid.get(bean.getPlayid())+"_jczq" + bean.getExpect(), mList,
                    System.currentTimeMillis() + 1000 * 60, false);
            cm.putCacheMatch(playid.get(bean.getPlayid())+"_jczq", bean.getExpect(), ca);
            System.out.println(playid.get(bean.getPlayid())+"_jczq" + "_" + bean.getExpect() + "本地缓存更新");
            cache = ca;

        } else {
            System.out.println(playid.get(bean.getPlayid()) +"_jczq"+ "_" + bean.getExpect() + "来源本地缓存");
        }

        if (cache != null) {
            Date firsttime = null;

            List<MatchBean> mb = (List<MatchBean>) cache.getValue();
            String Codes = bean.getCodes();
            //56505|140725001[3]/56511|140725004[3]
            System.out.println(Codes);
            String[] code = StringUtil.splitter(Codes, "/");
            String[] chang = new String[code.length];
            String danCodes = bean.getDanma();
            String[] danCode = StringUtil.splitter(danCodes, "/");
            String Newcode = "";
            String danItems="";
            if(!danCodes.equals("")){
				for (int i = 0; i < danCode.length; i++) {
					danItems+=danCode[i].substring(danCode[i].indexOf("|") + 1, danCode[i].indexOf("["))+",";		
				}
				danItems = danItems.substring(0,danItems.lastIndexOf(","));
			}
            // 检查投注串是否合法
            for (int i = 0; i < code.length; i++) {

                String[] codestr = StringUtil.splitter(code[i], "|");
                Newcode = Newcode + codestr[1] + "/";

                String[] cs = new String[2];

                cs[0] = code[i].substring(code[i].indexOf("|") + 1, code[i].indexOf("["));
                cs[1] = code[i].substring(code[i].indexOf("["));

                System.out.println("a=" + cs[0]);
                System.out.println("b=" + cs[1]);

                chang[i] = cs[0];
                if (cs[1].substring(0, 1).equalsIgnoreCase("[")
                        && cs[1].substring(cs[1].length() - 1).equalsIgnoreCase("]")) {
                    String[] ccs = StringUtil.splitter(cs[1].substring(1, cs[1].length() - 1), ",");
                    checkItems(ccs, bean.getPlayid());
                } else {
                    throw new Exception("投注串不符合要求(4)");
                }
            }

            Newcode = Newcode.substring(0, Newcode.length() - 1);

            // 获取方案的截至时间
            for (int i = 0; i < chang.length; i++) {
                for (int ii = 0; ii < mb.size(); ii++) {
                    if (mb.get(ii).getItemid().equals(chang[i])) {
                        Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                        if (firsttime == null) {
                            firsttime = tmp;
                        } else {
                            if (tmp.getTime() < firsttime.getTime()) {
                                firsttime = tmp;
                            }
                        }
                    }
                }
            }
            StringBuffer sb = new StringBuffer();
            String[] cs = bean.getCodes().split("/");
            for (int j = 0; j < cs.length; j++) {

                String[] t1 = new String[2];

                t1[0] = cs[j].substring(cs[j].indexOf("|") + 1, cs[j].indexOf("["));
                t1[1] = cs[j].substring(cs[j].indexOf("["));

                String mid = t1[0];
                String value = t1[1].substring(1, t1[1].length() - 1);

                String[] xz = value.split(",");
                int count = 0;
                for (int ii = 0; ii < mb.size(); ii++) {
                    if (mid.equals(mb.get(ii).getItemid())) {
                        count = ii;
                        break;
                    }
                }

                String spv = mb.get(count).getSpv();

                sb.append(mb.get(count).getItemid() + ",");
                sb.append(mb.get(count).getHn() + ",");
                if (Integer.parseInt(playid.get(bean.getPlayid())) - 90 == 0) {
                    sb.append("-,");
                } else {
                    sb.append(mb.get(count).getClose()==0?"-,":mb.get(count).getClose() + ",");
                }
                sb.append(mb.get(count).getGn() + ",");
                String b3 = mb.get(count).getB3();
                if (StringUtil.isEmpty(b3)) {
                    b3 = "0";
                }
                String b1 = mb.get(count).getB1();
                if (StringUtil.isEmpty(b1)) {
                    b1 = "0";
                }
                String b0 = mb.get(count).getB0();
                if (StringUtil.isEmpty(b0)) {
                    b0 = "0";
                }
                sb.append(b3 + ",");
                sb.append(b1 + ",");
                sb.append(b0 + ",");
                sb.append(TradeJcBeanImpl.getsp(spv, TradeJcBeanImpl.SPFSpMaps.get(TradeJcBeanImpl.SPFMaps.get("3")))
                        + ",");
                sb.append(TradeJcBeanImpl.getsp(spv, TradeJcBeanImpl.SPFSpMaps.get(TradeJcBeanImpl.SPFMaps.get("1")))
                        + ",");
                sb.append(TradeJcBeanImpl.getsp(spv, TradeJcBeanImpl.SPFSpMaps.get(TradeJcBeanImpl.SPFMaps.get("0")))
                        + ",");
                sb.append(value.replace(",", "").replace("胜", "3").replace("平", "1").replace("负", "0"));
                if (j != cs.length - 1) {
                    sb.append("--");
                }
            }

            String filterdata = sb.toString();
            sb = null;
            String issue = DateUtil.getCurrentFormatDate("yyMMdd");
            String time = DateUtil.getCurrentFormatDate("yyyyMMddHHmmss");

            String crc = MD5Util.compute(issue + "_" + time + "_" + PythonFilterUtil.CUSPWD2);

            String contents = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>";
            contents = contents + "<html xmlns='http://www.w3.org/1999/xhtml'>";
            contents = contents + "<head>";
            contents = contents + "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />";
            contents = contents + "<title>竞彩投注－－过滤投注</title>";
            contents = contents + "</head>";
            contents = contents + "<body>";
            contents = contents + "<form action='" + PythonFilterUtil.JC_URL2 + "' method='post'  >"
                    + "<input type='hidden' name='dataVal' value='" + filterdata + "' />"
                    + "<input type='hidden' name='cusKey' value='" + PythonFilterUtil.CUSKEY2 + "' />"
                    + "<input type='hidden' name='ggType' value='" + bean.getSgtypename().replace("串", "_")
                    + "' />" + "<input type='hidden' name='issueId' value='" + issue + "' />"
                    + "<input type='hidden' name='multi' value='" + bean.getBeishu() + "' />"
                    + "<input type='hidden' name='time' value='" + time + "' />"
                    + "<input type='hidden' name='totalNum' value='" + bean.getZhushu() + "' />"
                    + "<input type='hidden' name='firstEndDate' value='"
                    + DateUtil.getDateTime(firsttime.getTime(), "YYYY-MM-dd HH:mm:ss") + "' />"
                    + "<input type='hidden' name='callback' value='" + PythonFilterUtil.JC_BACKUP_URL + "' />"
                    + "<input type='hidden' name='danMatchs' value='" + danItems + "' />"
                    + "<input type='hidden' name='singleCodes' value='' />"
					+ "<input type='hidden' name='betId' value='' />"
                    + "<input type='hidden' name='playType' value='"+playType+"' />"

                    + "<input type='hidden' name='valiCode' value='" + crc + "' />" + "</form>";

            contents = contents + "<script language='javascript' > document.forms[0].submit();";
            contents = contents + "</script>";
            contents = contents + "</body>";
            contents = contents + "</html>";
            System.out.println(contents);
            write_html_response("<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" >" + contents,
                    response);

        }
        return 0;
    }

    public int project_filter(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        String jsondata = request.getParameter("jsondata");
        System.out.println(jsondata);
        JSONObject json = null;
        try {
            json = new JSONObject(jsondata);
        } catch (JSONException e) {
            e.printStackTrace(System.err);
            logger.info("TradeJcBeanImpl.project_filter", e);
        }
        if (json == null) {
            logger.info("TradeJcBeanImpl.project_filter", "过滤不成功");
            return 1;
        }

        // 过滤后的号码组合 Base64解码
        String glResult = json.getString("codes");
        byte[] b = null;
        try {
            b = Base64.decode(glResult);
        } catch (Exception e) {
            logger.info("GuoLvBeanImpl.getGuoLvData", "解码不成功");
            return 1;
        }
        // 号码组合 解压缩
        byte[] fristDcm = PythonFilterUtil.decompress(b);
        // 号码组合 解压缩
        // byte[] secondDcm = PythonFilterUtil.decompress(fristDcm);
        glResult = new String(fristDcm);
        System.out.println(glResult);// MD5(glCC_glSel_cusPwd)

        String Multi = json.getString("multi");
        String Afterzs = json.getString("afterzs");
        String Selcc = json.getString("selcc");
        String Beforezs = json.getString("beforezs");
        String Selcode = json.getString("selcode");
        String User = json.getString("user");
        String Lott = json.getString("lott");
        String Gtype = json.getString("gtype");
        String Issue = json.getString("issue");
        /*
         * jsondata.multi 方案倍数 jsondata.codes 过滤后号码 采用base64及zlib对号码进行处理，解密方 法先base64 decode 再 zlib decompress 还原。号码格式以逗
         * 号分隔 jsondata.afterzs 过滤后注数 jsondata.selcc 选择场次编 jsondata.beforezs 原复式注数 jsondata.selcode 原复式方案 jsondata.user
         * 用户名 jsondata.lott 彩票种编号 jsondata.gtype 过关方式 jsondata.issue 期号
         */

        // 验证valiCode
        // String newValiCode = json.getString("issue").trim() +"_"+
        // json.getString("glSel").trim()+"_" + PythonFilterUtil.CUSPWD;
        // //System.out.println("我要加密的："+newValiCode);
        // newValiCode = MD5Util.compute(newValiCode).toUpperCase();
        // //System.out.println("我加密后的："+newValiCode + ":---:返回的："
        // +json.getString("valiCode"));
        //
        // if(!newValiCode.equals(json.getString("valiCode"))){
        // logger.info("加密码信息验证失败。");
        // return 1;
        // }

        String str = "3=3,1=1,0=0";// 自定义选项
        String gid = "90";// 种类玩法 SPF...
        String ishm = "1";// 种类玩法 SPF...
        String beishu = Multi;// 投注倍数
        String item = Selcc;// 投注场次列表
        String gg = Gtype + "*1";// 过关类型
        String initems = "0";// 是否包含场次信息
        String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"
                + FileUpload.getFileName(bean.getUid(), gid, "jczq").toLowerCase();
        String codes = filename.toLowerCase() + ".txt";
        int total = 0;
        GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
        if (plugin != null) {
            FilterResult result = new FilterResult();
            CodeBean codebean = new CodeBean();
            codebean.setCodeitems(str);
            codebean.setPlaytype(ds_playid.get(gid));
            codebean.setLottype(Integer.parseInt(gid));

            StringBuffer sb = new StringBuffer();
            String[] codestr = StringUtil.splitter(glResult, ",");
            String temp = null;
            for (int i = 0; i < codestr.length; i++) {
                temp = codestr[i];
                if (!StringUtil.isEmpty(temp)) {
                    // System.out.println("temp："+temp);
                    sb.append(temp);
                    sb.append("\r\n");
                    if (initems.equals("1")) {
                        codebean.setItemType(CodeBean.HAVEITEM);
                        codebean.setCode(temp);
                        codebean.setGuoguan(gg);
                    } else {
                        codebean.setItemType(CodeBean.NOITEM);
                        codebean.setCode(temp);
                        codebean.setTeamitems(item);
                        codebean.setGuoguan(gg);
                    }

                    String codeStr = temp.replaceAll("\\s+", "");
                    String[] codestring = codeStr.split("_");
                    int bs = 1;// 单式解析倍数
                    int len = codestring.length;
                    if (len == 1) {
                        bs = 1;
                    } else if (len == 2) {
                        if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                            bs = Integer.parseInt(codestring[1].trim());
                        } else {
                            throw new Exception("投注格式中倍数异常,code=" + codeStr);
                        }
                    } else {
                        throw new Exception("投注格式异常,code=" + codeStr);
                    }

                    FilterBase.doFilterJc(codebean, result);

                    if (isValid(result.getCurrentCode())) {
                        try {
                            GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
                            total += gcc.getCastMoney() * bs;
                            // System.out.println("total："+total);
                        } catch (Exception e) {
                            throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                            // e.getMessage()
                        }

                        for (int n = 1; n < bs; n++) {
                            result.addCode(result.getCurrentCode());
                        }

                        if (total > 1000000) {
                            throw new Exception("上传文件中检测到注数超过限制范围！");
                        }
                    }
                }
            }
            if (initems.equals("1")) {// 包含场次过关
                gg = result.getGglists();
            }

            item = result.getTeamItems();

            if (total < 2 || item.equals("")) {
                throw new Exception("上传文件中未能检测到正确的注数！");
            }

            if (!Util.SaveFile(sb.toString(), FileCastServlet.PATH + File.separator + tempfile, filename + ".txt",
                    "gbk")) {
                logger.error(filename + ".txt" + "：存储失败");
                throw new Exception("存储失败");
            }
            if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + tempfile, filename
                    + "_n.txt", "gbk")) {
                logger.error(filename + "_n.txt" + "：存储失败");
                throw new Exception("存储失败");
            }

            sb = null;
        }
        Cache cache = null;
        CacheManager cm = CacheManager.getCacheManager();

        cache = cm.getCacheMatch(gid, bean.getExpect());

        if (cache == null || cache.isExpired()) {

            String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml" };

            int value = Integer.parseInt(gid) - 90;
            JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
            int count = xml.countXmlNodes("row");
            System.out.println(count);
            List<MatchBean> mList = new ArrayList<MatchBean>();
            for (int i = 0; i < count; i++) {
                String mid = xml.getStringValue("row[" + i + "].@itemid");
                String hn = xml.getStringValue("row[" + i + "].@hn");
                String gn = xml.getStringValue("row[" + i + "].@gn");
                String bt = xml.getStringValue("row[" + i + "].@mt");
                String et = xml.getStringValue("row[" + i + "].@et");

                String fet = "";
                Date tmpet = DateUtil.parserDateTime(et);
                tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                fet = DateUtil.getDateTime(tmpet.getTime());

                String b3 = xml.getStringValue("row[" + i + "].@bet3");
                String b1 = xml.getStringValue("row[" + i + "].@bet1");
                String b0 = xml.getStringValue("row[" + i + "].@bet0");
                int close = xml.getIntValue("row[" + i + "].@close", 0);
                String mname = xml.getStringValue("row[" + i + "].@name");

                MatchBean mb = new MatchBean();
                mb.setItemid(mid);
                mb.setHn(hn);
                mb.setGn(gn);
                mb.setBt(bt);
                mb.setEt(fet);
                mb.setB3(b3);
                mb.setB1(b1);
                mb.setB0(b0);
                mb.setClose(close);
                mb.setMname(mname);

                switch (value) {
                    case 0:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                        break;
                    case 1:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                        break;
                    case 2:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                        break;
                    case 3:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                        break;
                    default:
                        break;
                }
                mList.add(mb);
            }

            Cache ca = new Cache(gid + bean.getExpect(), mList, System.currentTimeMillis() + 1000 * 60, false);
            cm.putCacheMatch(gid, bean.getExpect(), ca);

            System.out.println(gid + "_" + bean.getExpect() + "本地缓存更新");
            cache = ca;

        } else {
            System.out.println(gid + "_" + bean.getExpect() + "来源本地缓存");
        }

        if (cache != null) {

            Date firsttime = null;

            List<MatchBean> mb = (List<MatchBean>) cache.getValue();
            System.out.println("item=" + item);
            // 获取方案的截至时间
            String[] itemstr = StringUtil.splitter(item, ",");
            int chang = itemstr.length;
            for (int i = 0; i < chang; i++) {
                for (int ii = 0; ii < mb.size(); ii++) {
                    if (mb.get(ii).getItemid().equals(itemstr[i])) {
                        Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                        if (firsttime == null) {
                            firsttime = tmp;
                        } else {
                            if (tmp.getTime() < firsttime.getTime()) {
                                firsttime = tmp;
                            }
                        }
                    }
                }
            }

            // *************************
            System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
            request.setAttribute("errcode", "0");
            request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
            request.setAttribute("mb", mb);

            request.setAttribute("beishu", beishu);
            request.setAttribute("codes", codes);
            request.setAttribute("rand", filename);
            request.setAttribute("restore", "{ 'matches' : '" + item + "', 'ggtype' : '" + gg + "', 'beishu' : '"
                    + beishu + "', 'flag' : '0'}");

            request.setAttribute("gggroupstr", "自由过关");

            request.setAttribute("IsCutMulit", beishu);
            request.setAttribute("ishm", ishm);
            request.setAttribute("lotid", gid);
            request.setAttribute("playid", gid);
            request.setAttribute("sgtype", gg);
            request.setAttribute("ggname", str);
            request.setAttribute("totalmoney", total * Integer.parseInt(beishu));
            request.setAttribute("zhushu", total / 2);

            request.setAttribute("items", item);
            request.setAttribute("initems", initems);
            request.setAttribute("matchnum", chang);

            request.setAttribute("backurl", getBack(gid));
            System.out.println("--------------" + getBack(gid));

        } else {
            logger.error("对阵信息调用失败");
        }

        return 0;
    }

    public int project_filter2(TradeJcBean bean, RbcFrameContext context, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        String jsondata = request.getParameter("revContextJon");
        System.out.println(jsondata);
        JSONObject json = null;
        try {
            json = new JSONObject(jsondata);
        } catch (JSONException e) {
            e.printStackTrace(System.err);
            logger.info("TradeJcBeanImpl.project_filter", e);
        }
        if (json == null) {
            logger.info("TradeJcBeanImpl.project_filter", "过滤不成功");
            return 1;
        }

        // 过滤后的号码组合 Base64解码
        String glResult = json.getString("glResult");
        byte[] b = null;
        try {
            b = Base64.decode(glResult);
        } catch (Exception e) {
            logger.info("GuoLvBeanImpl.getGuoLvData", "解码不成功");
            return 1;
        }
        // 号码组合 解压缩
        byte[] fristDcm = PythonFilterUtil.decompress(b);
        // 号码组合 解压缩
         byte[] secondDcm = PythonFilterUtil.decompress(fristDcm);
        glResult = new String(secondDcm);
        System.out.println(glResult);// MD5(glCC_glSel_cusPwd)

        String gtype = json.getString("ggType");//过关类型*
		String issue = json.getString("issueId");//所选期号*
		bean.setExpect(issue);
		String glcc = json.getString("glCC");//过滤场次
		String selcc = json.getString("glSel");//场次选择，与过滤场次一一对应
		String glCondtion = json.getString("glCondtion");//过滤条件
		String afterzs = json.getString("glNum");//过滤后注数
		String glCondtionNum = json.getString("glCondtionNum");//过滤条件对应每一步注数；“，”分隔。
		String multi = json.getString("multi");//倍数*
		String beforezs = json.getString("total");//过滤前总注数
		String danMatchs = json.getString("danMatchs");//设胆场次
		String danScope = json.getString("danScope");//模糊设胆范围
		String playType = json.getString("playType");//彩种类型
		String glKey = json.getString("glKey");//订单号
		
		String[] glCondtions = StringUtil.splitter(glCondtion,"|");
		List<String[]> glCondtionList = new ArrayList<String[]>();
		for (int i = 0; i < glCondtions.length; i++) {
			glCondtionList.add(new String[]{PythonFilterUtil.zsGlChang(glCondtions[i]),StringUtil.splitter(glCondtionNum,",")[i]});
		}

        String str = "3=3,1=1,0=0";// 自定义选项
        String gid = "90";// 种类玩法 SPF...
        if(playType.equals("zq_xspf")){
        	gid = "90";
        }else if(playType.equals("zq_spf")){
        	gid = "72";
        }
        String ishm = "1";// 种类玩法 SPF...
        int beishu =  Integer.parseInt(multi);;// 投注倍数
        String item = selcc;// 投注场次列表
        String gg = gtype.replace("_1", "*1");// 过关类型
        String initems = "1";// 是否包含场次信息
        String filename = gid + "_" + DateUtil.getCurrentFormatDate("yyMMddHHmmss") + "_"
                + FileUpload.getFileName(bean.getUid(), gid, "jczq").toLowerCase();
        String codes = filename.toLowerCase() + ".txt";
        int total = 0;
		String items = null;
		String gglists = null;
        GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin(gid);
        if (plugin != null) {
            FilterResult result = new FilterResult();
            CodeBean codebean = new CodeBean();
            codebean.setCodeitems(str);
            codebean.setPlaytype(ds_playid.get(gid));
            codebean.setLottype(Integer.parseInt(gid));

            StringBuffer sb = new StringBuffer();
            String[] codestr = StringUtil.splitter(glResult, ",");
            String temp = null;
            for (int i = 0; i < codestr.length; i++) {
                temp = StringUtil.splitter(codestr[i], ":")[0];
                if (!StringUtil.isEmpty(temp)) {
                    // System.out.println("temp："+temp);
                    sb.append(temp);
                    sb.append("\r\n");
                    if (initems.equals("1")) {
                        codebean.setItemType(CodeBean.NOITEM);
                        codebean.setCode(temp);
                        codebean.setTeamitems(glcc);
                        codebean.setGuoguan(gg);
                    }

                    String codeStr = temp.replaceAll("\\s+", "");
                    String[] codestring = codeStr.split("_");
                    int bs = 1;// 单式解析倍数
                    int len = codestring.length;
                    if (len == 1) {
                        bs = 1;
                    } else if (len == 2) {
                        if (StringUtil.getNullInt(codestring[1].trim()) > 0) {
                            bs = Integer.parseInt(codestring[1].trim());
                        } else {
                            throw new Exception("投注格式中倍数异常,code=" + codeStr);
                        }
                    } else {
                        throw new Exception("投注格式异常,code=" + codeStr);
                    }

                    FilterBase.doFilterJc(codebean, result);

                    if (isValid(result.getCurrentCode())) {
                        try {
                            GameCastCode gcc = plugin.parseGameCastCode(result.getCurrentCode());
                            total += gcc.getCastMoney() * bs;
                            // System.out.println("total："+total);
                        } catch (Exception e) {
                            throw new Exception("请检查上传文件的格式,参考标准格式样本" + e.getMessage());// +
                            // e.getMessage()
                        }

                        for (int n = 1; n < bs; n++) {
                            result.addCode(result.getCurrentCode());
                        }

                        if (total > 1000000) {
                            throw new Exception("上传文件中检测到注数超过限制范围！");
                        }
                    }
                }
            }
            if (initems.equals("1")) {// 包含场次过关
                gg = result.getGglists();
            }

            item = result.getTeamItems();
            gglists = result.getGglists();

            if (total < 2 || item.equals("")) {
                throw new Exception("上传文件中未能检测到正确的注数！");
            }
            StringBuffer sbgl = new StringBuffer();
			sbgl.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
			sbgl.append("<xml>");
			sbgl.append("<row ");
			sbgl.append(JXmlUtil.createAttrXml("glKey", glKey));
			sbgl.append(JXmlUtil.createAttrXml("GgType", gtype));
			sbgl.append(JXmlUtil.createAttrXml("IssueId", issue));
			sbgl.append(JXmlUtil.createAttrXml("GlCC", glcc));
			sbgl.append(JXmlUtil.createAttrXml("GlSel", selcc));
			sbgl.append(JXmlUtil.createAttrXml("glResult", glResult));
			sbgl.append(JXmlUtil.createAttrXml("GlCondtion", glCondtion));
			sbgl.append(JXmlUtil.createAttrXml("GlCondtionNum", glCondtionNum));
			sbgl.append(JXmlUtil.createAttrXml("GlNum", afterzs));
			sbgl.append(JXmlUtil.createAttrXml("danMatchs", danMatchs));
			sbgl.append(JXmlUtil.createAttrXml("danScope", danScope));
			sbgl.append(JXmlUtil.createAttrXml("Multi", multi));
			sbgl.append(JXmlUtil.createAttrXml("GLQtotal", beforezs));
			sbgl.append("/>");
			sbgl.append("</xml>");
			
			if (!Util.SaveFile(sbgl.toString(), FileCastServlet.PATH + File.separator + tempfile, filename + "_gl.xml", "gbk")) {
				logger.error(filename + "_gl.xml" + "：存储失败");
			}

            if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + tempfile, filename + ".txt",
                    "gbk")) {
                logger.error(filename + ".txt" + "：存储失败");
                throw new Exception("存储失败");
            }

            if (!Util.SaveFile(json.toString(), FileCastServlet.PATH + File.separator + tempfile, filename + ".json",
                    "gbk")) {
                logger.error(filename + ".json" + "：存储失败");
                throw new Exception("存储失败");
            }

            if (!Util.SaveFile(result.getAllCodeToFile(), FileCastServlet.PATH + File.separator + tempfile, filename
                    + "_n.txt", "gbk")) {
                logger.error(filename + "_n.txt" + "：存储失败");
                throw new Exception("存储失败");
            }

            sb = null;
        }
        Cache cache = null;
        CacheManager cm = CacheManager.getCacheManager();

        cache = cm.getCacheMatch(gid, bean.getExpect());

        if (cache == null || cache.isExpired()) {

            String[] fn = new String[] { "jczq_spf.xml", "jczq_cbf.xml", "jczq_bqc.xml", "jczq_jqs.xml","","jczq_rspf.xml" };

            int value = Integer.parseInt(gid) - 90;
            if(gid.equals("72")){
            	value = 5;
            }
            JXmlWapper xml = JXmlWapper.parse(new File("/opt/export/cpdata/match/jczq", fn[value]));
            int count = xml.countXmlNodes("row");
            System.out.println(count);
            List<MatchBean> mList = new ArrayList<MatchBean>();
            for (int i = 0; i < count; i++) {
                String mid = xml.getStringValue("row[" + i + "].@itemid");
                String hn = xml.getStringValue("row[" + i + "].@hn");
                String gn = xml.getStringValue("row[" + i + "].@gn");
                String bt = xml.getStringValue("row[" + i + "].@mt");
                String et = xml.getStringValue("row[" + i + "].@et");

                String fet = "";
                Date tmpet = DateUtil.parserDateTime(et);
                tmpet.setTime(tmpet.getTime() - 1000 * 60 * Fetdiff);
                fet = DateUtil.getDateTime(tmpet.getTime());

                String b3 = xml.getStringValue("row[" + i + "].@bet3");
                String b1 = xml.getStringValue("row[" + i + "].@bet1");
                String b0 = xml.getStringValue("row[" + i + "].@bet0");
                int close = xml.getIntValue("row[" + i + "].@close", 0);
                String mname = xml.getStringValue("row[" + i + "].@name");

                MatchBean mb = new MatchBean();
                mb.setItemid(mid);
                mb.setHn(hn);
                mb.setGn(gn);
                mb.setBt(bt);
                mb.setEt(fet);
                mb.setB3(b3);
                mb.setB1(b1);
                mb.setB0(b0);
                mb.setClose(close);
                mb.setMname(mname);

                switch (value) {
                    case 0:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@spf"));
                        break;
                    case 1:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@cbf"));
                        break;
                    case 2:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@bqc"));
                        break;
                    case 3:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@jqs"));
                        break;
                    case 4:
                        break;
                    case 5:
                        mb.setSpv(xml.getStringValue("row[" + i + "].@rspf"));
                        break;
                    default:
                        break;
                }
                mList.add(mb);
            }

            Cache ca = new Cache(gid + bean.getExpect(), mList, System.currentTimeMillis() + 1000 * 60, false);
            cm.putCacheMatch(gid, bean.getExpect(), ca);

            System.out.println(gid + "_" + bean.getExpect() + "本地缓存更新");
            cache = ca;

        } else {
            System.out.println(gid + "_" + bean.getExpect() + "来源本地缓存");
        }

        if (cache != null) {

            Date firsttime = null;

            List<MatchBean> mb = (List<MatchBean>) cache.getValue();
            System.out.println("item=" + item);
            // 获取方案的截至时间
            String[] itemstr = StringUtil.splitter(item, ",");
            int chang = itemstr.length;
            for (int i = 0; i < chang; i++) {
                for (int ii = 0; ii < mb.size(); ii++) {
                    if (mb.get(ii).getItemid().equals(itemstr[i])) {
                        Date tmp = DateUtil.parserDateTime(mb.get(ii).getEt());
                        if (firsttime == null) {
                            firsttime = tmp;
                        } else {
                            if (tmp.getTime() < firsttime.getTime()) {
                                firsttime = tmp;
                            }
                        }
                    }
                }
            }

            // *************************
//            System.out.println("截至时间为：" + DateUtil.getDateTime(firsttime.getTime()));
//            request.setAttribute("errcode", "0");
//            request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
//            request.setAttribute("mb", mb);
//            request.setAttribute("beishu", beishu);
//            request.setAttribute("codes", codes);
//            request.setAttribute("rand", filename);
            request.setAttribute("restore", "{ 'matches' : '" + item + "', 'ggtype' : '" + gg + "', 'beishu' : '"
                    + beishu + "', 'flag' : '0'}");
//            request.setAttribute("gggroupstr", "自由过关");
//            request.setAttribute("IsCutMulit", beishu);
//            request.setAttribute("ishm", ishm);
//            request.setAttribute("lotid", gid);
//            request.setAttribute("playid", gid);
//            request.setAttribute("sgtype", gg);
//            request.setAttribute("ggname", str);
//            request.setAttribute("totalmoney", total * beishu);
//            request.setAttribute("zhushu", total / 2);
//            request.setAttribute("items", item);
            request.setAttribute("initems", initems);
//            request.setAttribute("matchnum", chang);

            
            request.setAttribute("endtime", DateUtil.getDateTime(firsttime.getTime()));
			request.setAttribute("matchnum", item.split(",").length);
			request.setAttribute("sgtypename", gglists);
			request.setAttribute("gggroupstr", "自由过关");
			request.setAttribute("zhushu", total / 2);
			request.setAttribute("beishu", beishu);
			request.setAttribute("totalmoney", total * beishu);
			request.setAttribute("amoney", total*beishu);
			request.setAttribute("omoney", total);
			request.setAttribute("rand", filename);
			request.setAttribute("ishm", ishm);
			request.setAttribute("source", "3");

			request.setAttribute("mb", mb);
			request.setAttribute("glCondtionList", glCondtionList);

			request.setAttribute("beforezs", beforezs);
			request.setAttribute("glcc", glcc);
			request.setAttribute("selcc", selcc);
			request.setAttribute("dmstr", danMatchs);
			request.setAttribute("danScope", danScope); 
			request.setAttribute("lotid", gid);
			request.setAttribute("expect", bean.getExpect());
			request.setAttribute("str_matches", item);
			request.setAttribute("ggtype", gtype);
			request.setAttribute("ggname", str);
			request.setAttribute("backurl", getBack(gid));
			System.out.println("--------------" + getBack(gid));
        } else {
            logger.error("对阵信息调用失败");
        }

        return 0;
    }

}