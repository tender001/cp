package com.caipiao.cpweb.admin.web;

import java.util.HashMap;

public class TransactionUtil {
	
	private static HashMap<String, String> transactions = new HashMap<String, String>();
	private static HashMap<String, String> pays = new HashMap<String, String>();
	
	static {
		transactions.put("200","用户充值");
		transactions.put("201","自购中奖");
		transactions.put("202","跟单中奖");
		transactions.put("203","中奖提成");
		transactions.put("204","追号中奖");
		transactions.put("210","自购撤单返款");
		transactions.put("211","认购撤单返款");
		transactions.put("212","追号撤销返款");
		transactions.put("213","提现撤销返款");
		transactions.put("214","提款失败转款");
		transactions.put("215","保底返款");
		transactions.put("216","红包派送");
		transactions.put("300","转款");
		
		transactions.put("100","自购");
		transactions.put("101","认购");
		transactions.put("102","追号");
		transactions.put("103","保底认购");
		transactions.put("104","提现");
		transactions.put("105","保底冻结");
		transactions.put("198","转账");
		
		pays.put("1","快钱");
		pays.put("2","财付通");
		pays.put("3","支付宝");
		pays.put("4","百付宝");
		pays.put("5","手机充值卡");
		pays.put("6","银联手机支付");
		pays.put("9","手机充值卡");
		pays.put("11","联动优势");
		pays.put("12","快捷");
	}

	public static String getTransactionName(String key) {
		String name = transactions.get(key);
		if (name != null) {
			return name;
		}
		return "未定义";
	}
	
	
	public static String getPayName(String key) {
		String name = pays.get(key);
		if (name != null) {
			return name;
		}
		return "未定义";
	}

	public static String[] showCmemo(String ibiztype,String cmemo) {
		String[] memo = new String[]{"","",""};
		Integer biztype=Integer.parseInt(ibiztype);
		String[] memoarr = cmemo.split("\\|");
		if (memoarr.length>1){	
			switch (biztype){					
			case 200:
				memo[0]=getPayName(memoarr[0])+"充值  订单号:" +memoarr[1];
				break;				
			case 100:
			case 101:
			case 103:
				memo[0]=Util.getGame(memoarr[0])+getTransactionName(ibiztype);
				memo[1] = memoarr[0]+"_"+memoarr[1];
				break;
			case 105:
				memo[0]=Util.getGame(memoarr[0])+getTransactionName(ibiztype);
				memo[1] = memoarr[0]+"_"+memoarr[1].split("[")[0];
				break;
			case 201:		
			case 202:
			case 203:	
			case 210:
			case 211:	
			case 215:			
				memo[0]=Util.getGame(memoarr[0])+getTransactionName(ibiztype);
				memo[1] = memoarr[0]+"_"+memoarr[1];
				break;				
			case 102:
				memo[0]=Util.getGame(memoarr[0])+getTransactionName(ibiztype);
				memo[2] = memoarr[1];
				break;	
			case 212:
				String[] NT=memoarr[0].split("ZH");
				memo[0]=Util.getGame(NT[0])+getTransactionName(ibiztype);
				memo[2] = memoarr[0];
				break;	
			case 204:	
				memo[0]=Util.getGame(memoarr[0])+getTransactionName(ibiztype);
				memo[2] = memoarr[2];
				break;	
			case 300:
				memo[0]="转款";
				break;
			case 213:	
			default:
				break;
			}
		}
		return memo;
	}
	
	public static void main(String[] args) {
//		String[] projid = showCmemo("100", "85|CP85100351276|10654279");
//		System.out.println(projid[0]);
//		System.out.println(projid[1]);
		System.out.println(getTransactionName("216"));
	}
}
