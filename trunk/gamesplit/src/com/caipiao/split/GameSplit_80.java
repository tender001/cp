package com.caipiao.split;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.GamePluginManager;
import com.caipiao.plugin.sturct.GameCastCode;
import com.util.combine.CombineSplit;

public class GameSplit_80 extends GameSplit {

	GamePluginAdapter plugin = GamePluginManager.getDefaultPluginManager().getGamePlugin("80");
	
	@Override
	public String getSplitCode(String code) throws Exception {
		GameCastCode gcc = plugin.parseGameCastCode(code);
		StringBuffer sb = new StringBuffer();
		if(gcc.getCastMoney() > MAX){
			sb.append(splitCode(gcc.getFirst(), gcc.getCastMoney(), 14));
		}else{
			sb.append(code);
		}
		return sb.toString();
	}

	//拆分单注大于20000的
	private String splitCode(Long l, int money, int len){
		int sm = money % MAX == 0 ? money / MAX : money / MAX + 1;
		int [] lens = new int[len];
		ArrayList<Integer> list = new ArrayList<Integer>();
		for(int j = 0; j < len; j++){
			lens[j] = Long.bitCount(l & (0xFL << (4 * j)));
			if(lens[j] > 1){
				list.add(lens[j]);
			}
		}
		Collections.sort(list);
		
		int mul = 1;
		ArrayList<Integer> ilst = new ArrayList<Integer>();
		for(Integer it : list){
			mul *= it;
			ilst.add(it);
			if(mul > sm){
				break;
			}
		}
		list.clear();
		list = null;
		
		HashSet<Integer> set = new HashSet<Integer>();
		for(Integer it : ilst){
			for(int i = 0; i < lens.length; i++){
				if(lens[i] == it){
					if(!set.contains(Integer.valueOf(i))){
						set.add(Integer.valueOf(i));
						break;
					}
				}
			}
		}
		ilst.clear();
		ilst = null;
		
		List<Long[]> llst = new ArrayList<Long[]>();
		for(Iterator<Integer> its = set.iterator();its.hasNext();){
			int index = its.next();
			List<Long> sublst = new ArrayList<Long>();
			for(int i = 0; i < 4; i++){
				long sl = l & ((0xFL & (1L << i)) << (4*index));
				if(Long.bitCount(sl) > 0){
					sublst.add(sl);
				}
			}
			
			l &= ~(0xFL << (4*index));
			
			Long [] arr = new Long[sublst.size()];
			sublst.toArray(arr);
			llst.add(arr);
		}
		
		final long common = l;
		final List<Long> rlst = new ArrayList<Long>();
		new CombineSplit<Long>(llst) {
			@Override
			public void sequence(List<Long> list) {
				long c = 0;
				for(Long l : list){
					c |= l;
				}
				rlst.add(common | c);
			}
		};
		
		StringBuilder sb = new StringBuilder();
		for(int i = 0; i < rlst.size(); i++){
			StringBuilder tsb = new StringBuilder();
			for(int j = 0; j < len; j++){
				long tl = ((rlst.get(i) & (0xFL << (4 * j))) >> (4*j));
				if(Long.bitCount(tl) > 0){
					tsb.append(getSourceEx(tl, 1, null));
				}else{
					tsb.append("#");
				}
				if(j != len - 1){
					tsb.append(",");
				}
			}
			
			sb.append(tsb).append(":1:1");
			
			if( i != rlst.size() - 1){
				sb.append(";");
			}
		}
		rlst.clear();
		
		return sb.toString();
	}
}
