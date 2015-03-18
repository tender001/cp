package com.caipiao.plugin.helper;

import java.util.ArrayList;
import java.util.List;

public class CombineUtil {
	/**
	 * 从n个数字中选择m个数字
	 * @param a
	 * @param m
	 * @return
	 * @throws Exception 
	 */
	public static List<int[]> combine(int n,int m){
		if(m>n){
			return null;
		}
		List<int[]> result = new ArrayList<int[]>();
		int[] bs = new int[n];
		for(int i=0;i<n;i++){
			bs[i]=0;
		}
		//初始化
		for(int i=0;i<m;i++){
			bs[i]=1;
		}
		boolean flag = true;
		boolean tempFlag = false;
		int pos = 0;
		int sum = 0;
		//首先找到第一个10组合，然后变成01，同时将左边所有的1移动到数组的最左边
		do{
			sum = 0;
			pos = 0;
			tempFlag = true; 
			result.add(copy(bs));
			if(n==m){
				return result;
			}else if(m ==0){
				return result;
			}
			for(int i=0;i<n-1;i++){
				if(bs[i]==1 && bs[i+1]==0 ){
					bs[i]=0;
					bs[i+1]=1;
					pos = i;
					break;
				}
			}
			//将左边的1全部移动到数组的最左边
			for(int i=0;i<pos;i++){
				if(bs[i]==1){
					sum++;
				}
			}
			for(int i=0;i<pos;i++){
				if(i<sum){
					bs[i]=1;
				}else{
					bs[i]=0;
				}
			}
			//检查是否所有的1都移动到了最右边
			for(int i= n-m;i<n;i++){
				if(bs[i]==0){
					tempFlag = false;
					break;
				}
			}
			if(tempFlag==false){
				flag = true;
			}else{
				flag = false;
			}
		}while(flag);
		result.add(copy(bs));
		return result;
	}

	private static int[] copy(int[] bs){
		int[] result = new int[bs.length];
		for(int i=0;i<bs.length;i++){
			result[i] = bs[i];
		}
		return result ;
	}

}
