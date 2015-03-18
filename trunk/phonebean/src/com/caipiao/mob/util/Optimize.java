package com.caipiao.mob.util;

public interface Optimize {

	/**
	 * 
	 * @param codes
	 * 140901001=3,140901003=1,140901005=0,140902002=0
	 * @param tmuli
	 * 注数 1
	 * @param gg
	 * 过关 （例如：三串一 为  3 ）
	 * @param ytype
	 * 优化类型 0 平均 1搏热 2搏冷3保本  和idxs关联
	 * @param idxs
	 * 保本优化场数
	 * @param gid
	 * 玩法
	 * @param pid
	 * 期次
	 * @return
	 */
	public String optimize(String codes, int tmuli, int gg, int ytype,String idxs,String gid,String pid);
	
}
