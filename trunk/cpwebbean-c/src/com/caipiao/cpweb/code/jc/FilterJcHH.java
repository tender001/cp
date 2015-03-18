package com.caipiao.cpweb.code.jc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.caipiao.cpweb.code.CodeBean;
import com.caipiao.cpweb.code.FilterBase;
import com.caipiao.cpweb.code.FilterResult;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.PluginUtil;

public class FilterJcHH extends FilterBase{

	public static final HashMap<String, String> hhMaps = new HashMap<String, String>();
	
	static{
		hhMaps.put("3", "3");
		hhMaps.put("1", "1");
		hhMaps.put("0", "0");
	}
	
	@Override
	public void filter(CodeBean bean, FilterResult result) throws CodeFormatException {
		if(bean.getItemType() == CodeBean.NOITEM){	//文件不含场次(需指定场次)
			doSimple(bean,result);
		}else if(bean.getItemType() == CodeBean.HAVEITEM){	//文件含场次
			System.out.println("-----------------"+bean.getGuoguan());
			//检测投注选项
			String codeString = bean.getCodeitems();
			HashMap<String, String> codeMaps = new HashMap<String, String>();
			if(codeString != null){
				codeString = codeString.replaceAll("\\s+", "");
				String [] codeitems = codeString.split(",");
				for(int i = 0; i < codeitems.length; i++){
					String [] ccs = codeitems[i].split("=");
					if(ccs.length != 2){
						throw new CodeFormatException(-1, "投注选项替换格式不符合要求", bean.getCode());
					}
					codeMaps.put(ccs[1].trim(), ccs[0].trim());
				}
			}
			
			//Pattern pattern = Pattern.compile("\\s*\\[.+\\](.+)\\|\\s*\\d+\\s*\\*\\s*\\d+\\s*");
			Pattern pattern = Pattern.compile("\\s*\\[混投\\](.+)\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
			Matcher matcher = pattern.matcher(bean.getCode());
			
			if(matcher.find()){
				doDyjWeb(bean, result, matcher.group(1),matcher.group(2), codeMaps);
				return;
			}
			
			pattern = Pattern.compile("\\s*HH\\s*\\|(.+)\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
			matcher = pattern.matcher(bean.getCode());
			if(matcher.find()){
				doDyjWeb(bean, result, matcher.group(1),matcher.group(2), codeMaps);
				return;
			}
			
			pattern = Pattern.compile("\\s*hh\\s*\\|(.+)\\|((\\s*\\d+\\s*\\*\\s*\\d+\\s*,\\s*)*(\\s*\\d+\\s*\\*\\s*\\d+\\s*))");
			matcher = pattern.matcher(bean.getCode());
			if(matcher.find()){
				doDyjWeb(bean, result, matcher.group(1),matcher.group(2), codeMaps);
				return;
			}
			result.setCurrentCode("");
		}
	}

	
	/**
	 * 兼容格式
	 * 140623006>RSPF=1+SPF=3,140623007>SPF=0
	 * 140623006>[-1]1+3,140623007>0
	 * @param bean
	 * @param result
	 * @param code
	 * @param codeMaps
	 * @throws CodeFormatException
	 */
	private void doDyjWeb(CodeBean bean, FilterResult result, String code,String guoguan, HashMap<String, String> codeMaps) throws CodeFormatException{
		HashMap<String, String> teamsMaps = new HashMap<String, String>();
		System.out.println("=========================code:"+code);
		//140623006>RSPF=1+SPF=3,140623007>SPF=0
		String [] cs = code.replaceAll("\\s*", "").split(",");
		StringBuffer sb = new StringBuffer();
		sb.append(bean.getPlaytype());
		sb.append("|");
		int len = cs.length;
		//String gg = len + "*1";
		String gg = guoguan.replaceAll("\\s*", "");
		
		/*
		if(bean.getGuoguan().equals("1*1") && !(bean.getGuoguan().equals(gg))){
			throw new CodeFormatException(-1, "浮动奖金玩法仅支持单关投注", bean.getCode());
		}
		
		if(gg.equals("1*1") && !(bean.getGuoguan().equals("1*1"))){
			throw new CodeFormatException(-1, "混投不支持单关投注", bean.getCode());
		}
		*/
		//检查玩法和过关方式是否匹配
		if(!JcUtil.check(bean.getPlaytype(), gg)){
			throw new CodeFormatException(-1, "过关方式和玩法不匹配", bean.getCode());
		}
		
		bean.setGuoguan(gg);
		
		for(int i = 0; i < len; i++){
			//140623006>RSPF=1+SPF=3
			String [] ccs = cs[i].split(">");
			if(ccs.length != 2){
				throw new CodeFormatException(-1, "投注格式不符合要求", bean.getCode());
			}
			
			try {
				Integer.parseInt(ccs[0]);
			} catch (Exception e) {
				throw new CodeFormatException(-1, "投注场次不符合要求", bean.getCode());
			}
			
			teamsMaps.put(ccs[0], ccs[0]);
			
			sb.append(ccs[0]);
			sb.append(">");
			//RSPF=1+SPF=3
			String [] csc = PluginUtil.splitter(ccs[1], "+");
			int cclen = csc.length;
			for(int j = 0; j < cclen; j++){
				String[] cc = null;
				String spfString = "";
				if(csc[j].indexOf("RSPF")>-1||csc[j].indexOf("SPF")>-1){
					cc = PluginUtil.splitter(csc[j], "=");
					sb.append(cc[0]);
					sb.append("=");
					spfString = cc[1];
				}else{
					if(csc[j].indexOf("]")>-1){
						cc = PluginUtil.splitter(csc[j], "]");
						sb.append("RSPF");
						sb.append("=");
						spfString = cc[1];
					}else{
						sb.append("SPF");
						sb.append("=");
						spfString = csc[j];
					}
					
				}
				
				String [] ccc = PluginUtil.splitter(spfString,"/");
				int clen = ccc.length;
				HashMap<String, String> tmpeMaps = new HashMap<String, String>();
				for(int k = 0; k < clen; k++){
					String value = codeMaps.get(ccc[k]);
					if(value == null){
						sb.append(getCodeItem(ccc[k], bean));
						tmpeMaps.put(ccc[k], ccc[k]);
					} else {
						sb.append(getCodeItem(value, bean));
						tmpeMaps.put(value, value);
					}
					if(k != clen - 1){
						sb.append("/");
					}
				}
				if(tmpeMaps.size() != clen){
					throw new CodeFormatException(-1, "投注选项处理后存在重复", bean.getCode());
				}
				tmpeMaps.clear();
				
				if(j != cclen - 1){
					sb.append("+");
				}
			}
			sb.append(",");
		}
		if(teamsMaps.size() != len){
			throw new CodeFormatException(-1, "投注场次存在重复", bean.getCode());
		}
		//teamsMaps.clear();
		code = sb.toString();
		if(code.endsWith(",")){
			code = code.substring(0, code.lastIndexOf(","));
		}
		
		code += "|" + bean.getGuoguan();
		
		result.putGglist(gg);
		result.putItems(teamsMaps);
		result.addCode(code);
	}
	
	/**
	 * 兼容格式
	 * 3,[-1]3,1,0,3,1
	 * 3-3-[-1]1-0-3-1
	 * 331[-1]303
	 * 3 3 [-1]1 0 3 1
	 * 3,3,[-1]1,*,0,3,*,*,1,*,* 
	 * 331#0[-1]3##1 
	 * @param bean
	 * @param result
	 * @throws CodeFormatException
	 */
	private void doSimple(CodeBean bean, FilterResult result) throws CodeFormatException{
		//检查玩法和过关方式是否匹配
		
		if(!JcUtil.check(bean.getPlaytype(), bean.getGuoguan())){
			throw new CodeFormatException(-1, "过关方式和玩法不匹配", bean.getCode());
		}

		//兼容各种投注分割符号
		String code = bean.getCode();
//		code = code.replaceAll(",|-|\\s+|\\*|\\#", "");
//		//code = code.replaceAll("\\*", "#");
		code = code.replaceAll(",|-|\\s+", "");
		code = code.replaceAll("\\*", "#");
		code = code.replaceAll("\\[(.*?)\\]", "-");
		int len = code.replaceAll("-", "").length();
		System.out.println("====code:"+code);
		
		//检测投注场次
		String itemString = bean.getTeamitems(); 
		String [] teamitems = itemString.split(",");
		int teamlen = teamitems.length;
		if(teamlen < len){
			throw new CodeFormatException(-1, "所选场次数量不能少于实际投注场次数量", bean.getCode());
		}
		HashMap<String, String> teamsMaps = new HashMap<String, String>();
		for(String s: teamitems){
			try {
				Integer.parseInt(s);
			} catch (Exception e) {
				throw new CodeFormatException(-1, "所选场次不符合要求", bean.getCode());
			}
			teamsMaps.put(s, s);
		}
		if(teamsMaps.size() != teamlen){
			throw new CodeFormatException(-1, "所选场次存在重复场次", bean.getCode());
		}
		
		//检测投注选项
		String codeString = bean.getCodeitems();
		HashMap<String, String> codeMaps = new HashMap<String, String>();
		if(codeString != null){
			codeString = codeString.replaceAll("\\s+", "");
			String [] codeitems = codeString.split(",");
			for(int i = 0; i < codeitems.length; i++){
				String [] ccs = codeitems[i].split("=");
				if(ccs.length != 2){
					throw new CodeFormatException(-1, "投注选项替换格式不符合要求", bean.getCode());
				}
				codeMaps.put(ccs[1].trim(), ccs[0].trim());
			}
		}
		
		//生成标准格式
		StringBuffer sb = new StringBuffer();
		sb.append(bean.getPlaytype());
		sb.append("|");
		int count = 0;
		int itemN = 0;
		boolean flag = false;
		for(int i = 0; i < code.length(); i++){
			String tmp = String.valueOf(code.charAt(i));
			String spfString = "SPF";
			if("#".equals(tmp)){
				itemN++;
				continue;
			}
			if("-".equals(tmp)){
				flag =true;
				continue;
			}else{
				if(flag){
					spfString = "RSPF";
					flag =false;
				}
			}
			sb.append(teamitems[itemN]);
			sb.append(">");
			sb.append(spfString);
			sb.append("=");
			
			String value = codeMaps.get(tmp);
			if(value == null){
				sb.append(getCodeItem(tmp, bean));
			}else{
				sb.append(getCodeItem(value, bean));
			}
			sb.append(",");
			count++;
			itemN++;
		}
		if(count < JcUtil.getType(bean.getGuoguan())){
			throw new CodeFormatException(-1, "场次不足支持过关方式", bean.getCode());
		}
		
		code = sb.toString();
		if(code.endsWith(",")){
			code = code.substring(0, code.lastIndexOf(","));
		}
		
		code += "|" + bean.getGuoguan();

		result.putItems(teamsMaps);
		result.addCode(code);
	}
	
	/**
	 * 投注项验证
	 * 3,1,0
	 * @param value
	 * @param bean
	 * @return
	 * @throws CodeFormatException
	 */
	private String getCodeItem(String value, CodeBean bean) throws CodeFormatException{
		if(!hhMaps.containsKey(value)){
			throw new CodeFormatException(-1, "处理转换后号码不符合投注要求", bean.getCode());
		}
		return hhMaps.get(value);
	}
	
	public static void main(String[] args) {
		
		List<String> ylist = new ArrayList<String>();
//		ylist.add("[让球胜平负]110524005=0/3,110524006=3/1|1*1");
//		ylist.add("HH|140623006>RSPF=1+SPF=3,140623007>SPF=0|2*1");
		ylist.add("HH|140623006>[-1]1+3,140623007>0|2*1");
		
		FilterResult fr = new FilterResult();
		try {
			FilterJcHH hh = new FilterJcHH();
			CodeBean bean = new CodeBean();
			bean.setLottype(70);
			bean.setPlaytype("HH"); 
			bean.setCodeitems("3=3,1=1,0=0");
			bean.setGuoguan("2*1");
			for(String c : ylist){
				bean.setItemType(CodeBean.HAVEITEM);
				bean.setCode(c);
				hh.doFilterJc(bean, fr);
			}
			
			System.out.println(fr.getAllCode());
			
		} catch (CodeFormatException e) {
			e.printStackTrace();
		}
	}
//	public static void main(String[] args) {
//		
//		
//		List<String> nlist = new ArrayList<String>();
//		nlist.add("3[-1]10031");
//		nlist.add("3-[-1]3-1-0-3-1");
//		nlist.add("33[-1]1303");
//		nlist.add("3 [-1]3 1 0 3 1");
//		nlist.add("3,3,[-1]1,*,0,3");
//		nlist.add("#0[-1]3##1");
//		
//		
//		FilterResult fr = new FilterResult();
//		try {
//			FilterJcHH hh = new FilterJcHH();
//			CodeBean bean = new CodeBean();
//			bean.setLottype(70);
//			bean.setPlaytype("HH"); 
//			bean.setCodeitems("3=3,1=1,0=0");
//			bean.setTeamitems("1001,1002,1003,1004,1005,1006");
//			bean.setGuoguan("2*1");
//			bean.setItemType(CodeBean.NOITEM);
//			
//			for(String c : nlist){
//				System.out.println(c+"-------------");
//				bean.setCode(c);
//				hh.doFilterJc(bean, fr);
//			}
//			
//			System.out.println(fr.getAllCode());
//			
//			
//		} catch (CodeFormatException e) {
//			e.printStackTrace();
//		}
//	}
}