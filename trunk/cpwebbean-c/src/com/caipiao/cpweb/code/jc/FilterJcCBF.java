package com.caipiao.cpweb.code.jc;

import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.plugin.helper.CodeFormatException;

public class FilterJcCBF extends FilterBase {

    public static final HashMap<String, String> cbfMaps = new HashMap<String, String>();

    static {
        cbfMaps.put("90", "9:0");
        cbfMaps.put("10", "1:0");
        cbfMaps.put("20", "2:0");
        cbfMaps.put("21", "2:1");
        cbfMaps.put("30", "3:0");
        cbfMaps.put("31", "3:1");
        cbfMaps.put("32", "3:2");
        cbfMaps.put("40", "4:0");
        cbfMaps.put("41", "4:1");
        cbfMaps.put("50", "5:0");
        cbfMaps.put("51", "5:1");
        cbfMaps.put("52", "5:2");
        cbfMaps.put("42", "4:2");
        cbfMaps.put("99", "9:9");
        cbfMaps.put("00", "0:0");
        cbfMaps.put("11", "1:1");
        cbfMaps.put("22", "2:2");
        cbfMaps.put("33", "3:3");
        cbfMaps.put("09", "0:9");
        cbfMaps.put("01", "0:1");
        cbfMaps.put("02", "0:2");
        cbfMaps.put("12", "1:2");
        cbfMaps.put("03", "0:3");
        cbfMaps.put("13", "1:3");
        cbfMaps.put("23", "2:3");
        cbfMaps.put("04", "0:4");
        cbfMaps.put("14", "1:4");
        cbfMaps.put("24", "2:4");
        cbfMaps.put("05", "0:5");
        cbfMaps.put("15", "1:5");
        cbfMaps.put("25", "2:5");
    }

    @Override
    public void filter(CodeBean bean, FilterResult result) throws CodeFormatException {
        if (bean.getItemType() == CodeBean.NOITEM) {
            doSimple(bean, result);
        } else if (bean.getItemType() == CodeBean.HAVEITEM) {
            // 检测投注选项
            String codeString = bean.getCodeitems();
            HashMap<String, String> codeMaps = new HashMap<String, String>();
            if (codeString != null) {
                codeString = codeString.replaceAll("\\s+", "");
                String[] codeitems = codeString.split(",");
                for (int i = 0; i < codeitems.length; i++) {
                    String[] ccs = codeitems[i].split("=");
                    if (ccs.length != 2) {
                        throw new CodeFormatException(-1, "投注选项替换格式不符合要求", bean.getCode());
                    }
                    codeMaps.put(ccs[1].trim(), ccs[0].trim());
                }
            }

            // Pattern pattern =
            // Pattern.compile("\\s*\\[.+\\]((\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)\\s*/\\s*)*(\\s*\\d\\s*:\\s*\\d\\s*)\\s*,\\s*)*(\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)/)*(\\s*\\d\\s*:\\s*\\d\\s*)))\\|\\s*\\d\\s*\\*\\s*\\d\\s*");
            // Pattern pattern =
            // Pattern.compile("\\s*\\[比分\\]((\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)\\s*/\\s*)*(\\s*\\d\\s*:\\s*\\d\\s*)\\s*,\\s*)*(\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)/)*(\\s*\\d\\s*:\\s*\\d\\s*)))\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
            Pattern pattern = Pattern
                    .compile("\\s*(\\[比分\\]|CBF\\||cbf\\|){1}((\\s*\\d+\\s*=(\\s*\\d\\s*:\\s*\\d\\s*/)*(\\s*\\d\\s*:\\s*\\d\\s*),)*(\\s*\\d+\\s*=(\\s*\\d\\s*:\\s*\\d\\s*/)*(\\s*\\d\\s*:\\s*\\d\\s*))+\\s*)\\|(\\s*\\d+\\s*\\*\\s*\\d+\\s*)");
            Matcher matcher = pattern.matcher(bean.getCode());
            if (matcher.find()) {
                doDyjWeb(bean, result, matcher.group(2), matcher.group(9), codeMaps);
                return;
            }

            // pattern =
            // Pattern.compile("\\s*CBF\\s*\\|((\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)\\s*/\\s*)*(\\s*\\d\\s*:\\s*\\d\\s*)\\s*,\\s*)*(\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)/)*(\\s*\\d\\s*:\\s*\\d\\s*)))\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
            // matcher = pattern.matcher(bean.getCode());
            // if(matcher.find()){
            // doDyjWeb(bean, result, matcher.group(1),matcher.group(10), codeMaps);
            // return;
            // }
            //
            // pattern =
            // Pattern.compile("\\s*cbf\\s*\\|((\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)\\s*/\\s*)*(\\s*\\d\\s*:\\s*\\d\\s*)\\s*,\\s*)*(\\s*\\d+\\s*=((\\s*\\d\\s*:\\s*\\d\\s*)/)*(\\s*\\d\\s*:\\s*\\d\\s*)))\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
            // matcher = pattern.matcher(bean.getCode());
            // if(matcher.find()){
            // doDyjWeb(bean, result, matcher.group(1),matcher.group(10), codeMaps);
            // return;
            // }
            result.setCurrentCode("");
        }
    }

    /**
     * 兼容格式 [比分]35=1:2/2:1,37=1:2/2:1/2:3,40=0:2/1:2/2:0/2:1|3*1 CBF|35=1:2/2:1,37=1:2/2:1/2:3,40=0:2/1:2/2:0/2:1|3*1_10
     * [比分]130905001=1:2,130905005=2:1｜2*1
     * 
     * @param bean
     * @param result
     * @param code
     * @param codeMaps
     * @throws CodeFormatException
     */
    private void doDyjWeb(CodeBean bean, FilterResult result, String code, String guoguan,
            HashMap<String, String> codeMaps) throws CodeFormatException {
        HashMap<String, String> teamsMaps = new HashMap<String, String>();
        String tmpcode = code.replaceAll("\\s*", "");
        tmpcode = tmpcode.replaceAll(":", "");
        String[] cs = tmpcode.split(",");
        StringBuffer sb = new StringBuffer();
        sb.append(bean.getPlaytype());
        sb.append("|");
        int len = cs.length;
        // String gg = len + "*1";
        String gg = guoguan;
        /*
        if (bean.getGuoguan().equals("1*1") && !(bean.getGuoguan().equals(gg))) {
            throw new CodeFormatException(-1, "浮动奖金玩法仅支持单关投注", bean.getCode());
        }

        if (gg.equals("1*1") && !(bean.getGuoguan().equals("1*1"))) {
            throw new CodeFormatException(-1, "固定奖金玩法不支持单关投注", bean.getCode());
        }
		*/
        // 检查玩法和过关方式是否匹配
        if (!JcUtil.check(bean.getPlaytype(), gg)) {
            throw new CodeFormatException(-1, "过关方式和玩法不匹配", bean.getCode());
        }

        bean.setGuoguan(gg);

        for (int i = 0; i < len; i++) {
            String[] ccs = cs[i].split("=");
            if (ccs.length != 2) {
                throw new CodeFormatException(-1, "投注格式不符合要求", bean.getCode());
            }

            try {
                Integer.parseInt(ccs[0]);
            } catch (Exception e) {
                throw new CodeFormatException(-1, "投注场次不符合要求", bean.getCode());
            }

            teamsMaps.put(ccs[0], ccs[0]);

            sb.append(ccs[0]);
            sb.append("=");

            String[] csc = ccs[1].split("/");
            int clen = csc.length;
            HashMap<String, String> tmpMaps = new HashMap<String, String>();
            for (int j = 0; j < clen; j++) {
                String value = codeMaps.get(csc[j]);
                if (value == null) {
                    sb.append(getCodeItem(csc[j], bean));
                    tmpMaps.put(csc[j], csc[j]);
                } else {
                    sb.append(getCodeItem(value, bean));
                    tmpMaps.put(value, value);
                }
                if (j != clen - 1) {
                    sb.append("/");
                }
            }
            if (tmpMaps.size() != clen) {
                throw new CodeFormatException(-1, "投注选项处理后存在重复", bean.getCode());
            }
            tmpMaps.clear();
            sb.append(",");
        }
        if (teamsMaps.size() != len) {
            throw new CodeFormatException(-1, "投注场次存在重复", bean.getCode());
        }
        // teamsMaps.clear();
        code = sb.toString();
        if (code.endsWith(",")) {
            code = code.substring(0, code.lastIndexOf(","));
        }

        code += "|" + bean.getGuoguan();

        result.putGglist(gg);
        result.putItems(teamsMaps);
        result.addCode(code);
    }

    /**
     * 兼容格式 11,31,30,**,**,** 11##31######30## 11,31,30 11-31-30 113130 11 31 30
     * 
     * @param bean
     * @param result
     * @throws CodeFormatException
     */
    private void doSimple(CodeBean bean, FilterResult result) throws CodeFormatException {
        // 检查玩法和过关方式是否匹配
        if (!JcUtil.check(bean.getPlaytype(), bean.getGuoguan())) {
            throw new CodeFormatException(-1, "过关方式和玩法不匹配", bean.getCode());
        }

        // 兼容各种投注分割符号
        String code = bean.getCode();
        // code = code.replaceAll(",|-|\\s+|\\*|\\#|:", "");
        // //code = code.replaceAll("\\*", "#");
        code = code.replaceAll(",|-|\\s+|:", "");
        code = code.replaceAll("\\*", "#");
        int len = code.length();
        if (len % 2 != 0) {
            throw new CodeFormatException(-1, "号码不符合要求", bean.getCode());
        }

        // 检测投注场次
        String itemString = bean.getTeamitems();
        String[] teamitems = itemString.split(",");
        int teamlen = teamitems.length;
        if (teamlen < len / 2) {
            throw new CodeFormatException(-1, "所选场次数量不能少于实际投注场次数量", bean.getCode());
        }
        HashMap<String, String> teamsMaps = new HashMap<String, String>();
        for (String s : teamitems) {
            try {
                Integer.parseInt(s);
            } catch (Exception e) {
                throw new CodeFormatException(-1, "所选场次不符合要求", bean.getCode());
            }
            teamsMaps.put(s, s);
        }
        if (teamsMaps.size() != teamlen) {
            throw new CodeFormatException(-1, "所选场次存在重复场次", bean.getCode());
        }

        // 检测投注选项
        String codeString = bean.getCodeitems();
        HashMap<String, String> codeMaps = new HashMap<String, String>();
        if (codeString != null) {
            codeString = codeString.replaceAll("\\s+", "");
            String[] codeitems = codeString.split(",");
            for (int i = 0; i < codeitems.length; i++) {
                String[] ccs = codeitems[i].split("=");
                if (ccs.length != 2) {
                    throw new CodeFormatException(-1, "投注选项替换格式不符合要求", bean.getCode());
                }
                codeMaps.put(ccs[1].trim(), ccs[0].trim());
            }
        }

        // 生成标准格式
        StringBuffer sb = new StringBuffer();
        sb.append(bean.getPlaytype());
        sb.append("|");
        int count = 0;
        for (int i = 0; i < len / 2; i++) {
            String tmp = code.substring(2 * i, 2 * (i + 1));
            if ("##".equals(tmp)) {
                continue;
            }
            sb.append(teamitems[i]);
            sb.append("=");

            String value = codeMaps.get(tmp);
            if (value == null) {
                sb.append(getCodeItem(tmp, bean));
            } else {
                sb.append(getCodeItem(value, bean));
            }
            sb.append(",");
            count++;
        }
        if (count < JcUtil.getType(bean.getGuoguan())) {
            throw new CodeFormatException(-1, "场次不足支持过关方式", bean.getCode());
        }

        code = sb.toString();
        if (code.endsWith(",")) {
            code = code.substring(0, code.lastIndexOf(","));
        }

        code += "|" + bean.getGuoguan();

        result.putItems(teamsMaps);
        result.addCode(code);
    }

    /**
     * 投注项验证 3-3,3-1,3-0, 1-3,1-1,1-0, 0-3,0-1,0-0
     * 
     * @param value
     * @param bean
     * @return
     * @throws CodeFormatException
     */
    private String getCodeItem(String value, CodeBean bean) throws CodeFormatException {
        if (!cbfMaps.containsKey(value)) {
            throw new CodeFormatException(-1, "处理转换后号码不符合投注要求", bean.getCode());
        }
        return cbfMaps.get(value);
    }

    // public static void main(String[] args) {
    // List<String> nlist = new ArrayList<String>();
    // nlist.add("13130110");
    // // nlist.add("11##31######30##");
    // // nlist.add("11,31,30");
    // // nlist.add("11-31-30");
    // // nlist.add("113130");
    // // nlist.add("11 31 30");
    //
    // List<String> ylist = new ArrayList<String>();
    // // ylist.add("[比分]35=1:2/2:1,37=1:2/2:1/2:3,38=1:2/2:1/2:3|2*1,3*1");
    // ylist.add("cbf|110523001=1:2/2:1,110523002=1:2/2:1/2:3,110524001=0:2/1:2/2:0/2:1|3*4_3");
    // // ylist.add("1:[2:2]/2:[0:0]/3:[1:4]");
    // // ylist.add("22→1:0,23→2:3,29→1:3	1	2	3_1");
    // // ylist.add("7→(1:0,2:0,2:1,3:0,3:1),28→(1:0,2:0,2:1,3:0,3:1)	25	50	2_1");
    // // ylist.add("71→(1:0,胜其他,1:1),72→(1:0,0:0,1:1),73→(1:0,胜其他,1:1) 27 54 3_1");
    //
    // FilterResult fr = new FilterResult();
    // try {
    // FilterJcCBF cbf = new FilterJcCBF();
    // CodeBean bean = new CodeBean();
    // bean.setLottype(91);
    // bean.setPlaytype("CBF");
    // bean.setCodeitems("90=90,10=10,20=20,21=21,30=30,31=31,32=32,40=40,41=41,42=42,99=99,00=00,11=11,22=22,33=33,09=09,01=01,02=02,12=12,03=03,13=13,23=23,04=04,14=14,24=24");
    // bean.setTeamitems("1,2,3,4");
    // bean.setGuoguan("3*1");
    // bean.setItemType(CodeBean.NOITEM);
    //
    // for(String c : nlist){
    // bean.setCode(c);
    // cbf.doFilterJc(bean, fr);
    // }
    //
    // // for(String c : ylist){
    // // bean.setItemType(CodeBean.HAVEITEM);
    // // bean.setCode(c);
    // // cbf.doFilterJc(bean, fr);
    // // }
    //
    // System.out.println(fr.getAllCode());
    // } catch (CodeFormatException e) {
    // e.printStackTrace();
    // }
    // }

}
