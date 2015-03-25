package com.caipiao.split;

import java.util.List;
import com.caipiao.plugin.bjutil.BJUtil;
import com.caipiao.plugin.bjutil.CombineUtil;
import com.caipiao.plugin.helper.PluginUtil;

public class BjPluginSplit extends GameSplit{
	public String getSplitCode(String code) throws Exception {
		StringBuffer sb = new StringBuffer();
		String [] ps = PluginUtil.splitter(code, "|");
		if(code.indexOf("$") != -1){
			String [] pss = PluginUtil.splitter(ps[1], "$");
			String [] ditems = PluginUtil.splitter(pss[0], ",");
			String [] titems = PluginUtil.splitter(pss[1], ",");
			String [] passs = PluginUtil.splitter(ps[2], ",");
			int dr = -1;
			if ( ps.length == 4 ) {
				dr = Integer.parseInt(ps[3]);
			} else {
				dr = ditems.length;
			}
			
			for(int n = 0; n < passs.length; n++){
				String pass = passs[n];
				int end = BJUtil.getEnd(pass);
				for (int i = dr; i <= ditems.length; i++) {
					List<int[]> dlist = CombineUtil.combine(ditems.length, i);
					if (dlist != null && !dlist.isEmpty()) {
						for (int j = 0; j < dlist.size(); j++) {
							int[] dtmp = dlist.get(j);
							String[] src = new String[end];
							int dindex = 0;
							for (int k = 0; k < dtmp.length; k++) {
								if (dtmp[k] > 0) {
									src[dindex] = ditems[k];
									dindex++;
								}
							}
							if (titems.length + i < end) {
								break;
							}
							List<int[]> tlist = CombineUtil.combine(titems.length, end - i);
							if (tlist != null && !tlist.isEmpty()) {
								for (int x = 0; x < tlist.size(); x++) {
									int[] ttmp = tlist.get(x);
									int tindex = 0;
									for (int y = 0; y < ttmp.length; y++) {
										if (ttmp[y] > 0) {
											src[i + tindex] = titems[y];
											tindex++;
										}
									}
									
									StringBuffer tsb = new StringBuffer();
									tsb.append(ps[0]);
									tsb.append("|");
									for(int k = 0; k < src.length; k++){
										tsb.append(src[k]);
										if(k != src.length - 1){
											tsb.append(",");
										}
									}
									tsb.append("|");
									tsb.append(pass);
									sb.append(tsb).append(";");
									
								}
							}
						}
					}
				}
			}
			
		}else{
			String [] items = PluginUtil.splitter(ps[1], ",");
			String [] passs = PluginUtil.splitter(ps[2], ",");
			
			for(int i = 0; i < passs.length; i++){
				String pass = passs[i];
				int end = BJUtil.getEnd(pass);
				List<int[]> clist = CombineUtil.combine(items.length, end);
				if (clist != null && !clist.isEmpty()) {
					for (int j = 0; j < clist.size(); j++) {
						int[] tmp = clist.get(j);
						String[] src = new String[end];
						int index = 0;
						for (int k = 0; k < tmp.length; k++) {
							if (tmp[k] > 0) {
								src[index] = items[k];
								index++;
							}
						}
						
						StringBuffer tsb = new StringBuffer();
						tsb.append(ps[0]);
						tsb.append("|");
						for(int k = 0; k < src.length; k++){
							tsb.append(src[k]);
							if(k != src.length - 1){
								tsb.append(",");
							}
						}
						tsb.append("|");
						tsb.append(pass);
						sb.append(tsb).append(";");
					}
				}
			}
		}
		
		String rcode = sb.toString();
		if(rcode.length() > 0){
			rcode = rcode.substring(0, rcode.lastIndexOf(";"));
		}
		
		return rcode;
	}
	
	
	public static void main(String[] args) throws Exception {
		GameSplit split = new BjPluginSplit();
		String code = "SPF|24=3/1,25=3,39=3$23=3,43=1,57=1,58=1|5*1,6*1,7*1|2";
//		String code = "SPF|24=3/1,25=3,39=3,23=3,43=1,57=1,58=1|5*1,6*1,7*1";
		String s = split.getSplitCode(code);
		System.out.println(s);
	}
}
