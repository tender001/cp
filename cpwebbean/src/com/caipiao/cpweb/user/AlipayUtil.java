package com.caipiao.cpweb.user;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.alipay.services.AlipayService;
import com.caipiao.game.cacher.util.GameContains;
import com.mina.rbc.dbpool.JdbcConnect;
import com.mina.rbc.dbpool.JdbcRecordSet;
import com.mina.rbc.logger.Logger;
import com.mina.rbc.logger.LoggerFactory;
import com.mina.rbc.util.StringUtil;

public class AlipayUtil {
	
	private static final String PARTNER = "2088801707576775";
	private static final String KEY = "tttw6iof3eokcm12c7308xgp6bro3oho";
	private static Logger logger = LoggerFactory.getLogger("alipay-url");
	private static HashMap<String, String> ibizs = new HashMap<String, String>();
	private static HashMap<String, String> banks = new HashMap<String, String>();
	static{
		ibizs.put("200","用户充值");
		ibizs.put("201","代购中奖");
		ibizs.put("202","跟单中奖");
		ibizs.put("203","中奖提成");
		ibizs.put("204","追号中奖");
		ibizs.put("210","代购撤单返款");
		ibizs.put("211","认购撤单返款");
		ibizs.put("212","追号撤销返款");
		ibizs.put("213","提现撤销返款");
		ibizs.put("214","提款失败转款");
		ibizs.put("215","保底返款");
		ibizs.put("216","红包派送");
		ibizs.put("300","转款");
		ibizs.put("100","代购");
		ibizs.put("101","认购");
		ibizs.put("102","追号");
		ibizs.put("103","保底认购");
		ibizs.put("104","提现");
		ibizs.put("105","保底冻结");
		ibizs.put("99","转账");
		
		banks.put("1", "快钱");
		banks.put("2", "财付通");
		banks.put("3", "支付宝");
		banks.put("4", "百付宝");
		banks.put("5", "手机充值卡");
		banks.put("6", "银联手机支付");
		banks.put("9", "手机充值卡");
		banks.put("10", "快捷支付");
	}
	
	/**
	 * 1L << 1 余额
	 * 1L << 2 中奖纪录
	 * 1L << 3 购彩记录
	 * @param uid
	 * @param alipayid
	 * @param flag
	 * @return
	 */
	public static List<String> getPushUrl(JdbcConnect jcn, String useq, String uid, String alipayid, int flag, int num){
		logger.info("用户");
		List<String> urls = new ArrayList<String>();
		
		HashMap<String, String> user = new HashMap<String, String>();
		user.put("user_id", alipayid);
		user.put("b_user_id", useq);
		user.put("status", "VALID");

		String sql = "";
		long val = 1L << 1;//余额
		if(Long.bitCount(val & flag) == 1){
			sql = "select * from tb_user_acct where cnickid=?";
			JdbcRecordSet jrs = jcn.executeQuery(sql, new Object[]{uid});
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				String balance = jrs.get("ibalance");
				HashMap<String, String> uMaps = new HashMap<String, String>();
				uMaps.putAll(user);
				uMaps.put("category_name", "账户余额");
				uMaps.put("amount", balance);
				try {
					String url = AlipayService.alipay_user_account_asset_push(uMaps, PARTNER, KEY);
					urls.add(url);
				} catch (Exception e) {
					logger.error("用户余额", e);
				}
			}
		}

		val = 1L << 2;//中奖纪录
		if(Long.bitCount(val & flag) == 1){
			sql = "select * from (select * from tb_user_charge where cnickid = ? and ibiztype >= 201 and ibiztype <= 204 order by cadddate desc) where rownum <= ?";
			JdbcRecordSet jrs = jcn.executeQuery(sql, new Object[]{uid, num});
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				for(int i = 0; i < jrs.size(); i ++){
					String time = jrs.get("cadddate", i);
					String money = jrs.get("imoney", i);
					String type = jrs.get("ibiztype", i);
					String order = jrs.get("ichargeid" ,i);
					String memo = jrs.get("cmemo", i);
					
					StringBuffer sb = new StringBuffer();
					sb.append("{").append("\"交易时间\":\"").append(time).append("\",");
					sb.append("\"收入\":\"").append(money).append("元\",");
					sb.append("\"交易类型\":\"").append(getBizType(type)).append("\",");
					sb.append("\"订单号\":\"").append(order).append("\",");
					sb.append("\"备注\":\"").append(getMemo(memo, type)).append("\"");
					sb.append("}");
					
					HashMap<String, String> xMaps = new HashMap<String, String>();
					xMaps.putAll(user);
					xMaps.put("category_name", "中奖记录");
					xMaps.put("out_biz_id", "" + order);
					xMaps.put("asset_content", sb.toString());
					try {
						String url = AlipayService.alipay_user_account_asset_push(xMaps, PARTNER, KEY);
						urls.add(url);
					} catch (Exception e) {
						logger.error("中奖纪录", e);
					}
				}
			}
		}
		
		val = 1L << 3;//购彩记录
		if(Long.bitCount(val & flag) == 1){
			sql = "select * from (select * from tb_user_charge where cnickid = ? and ibiztype >= 100 and ibiztype <= 103 order by cadddate desc) where rownum <= ?";
			JdbcRecordSet jrs = jcn.executeQuery(sql, new Object[]{uid, num});
			if(jrs != null && jrs.size() > 0 && jrs.first()){
				for(int i = 0; i < jrs.size(); i ++){
					String time = jrs.get("cadddate", i);
					String money = jrs.get("imoney", i);
					String type = jrs.get("ibiztype", i);
					String order = jrs.get("ichargeid" ,i);
					String memo = jrs.get("cmemo", i);
					
					StringBuffer sb = new StringBuffer();
					sb.append("{").append("\"交易时间\":\"").append(time).append("\",");
					sb.append("\"支出\":\"").append(money).append("元\",");
					sb.append("\"交易类型\":\"").append(getBizType(type)).append("\",");
					sb.append("\"订单号\":\"").append(order).append("\",");
					sb.append("\"备注\":\"").append(getMemo(memo, type)).append("\"");
					sb.append("}");
					
					HashMap<String, String> xMaps = new HashMap<String, String>();
					xMaps.putAll(user);
					xMaps.put("category_name", "购彩记录");
					xMaps.put("out_biz_id", "" + order);
					xMaps.put("asset_content", sb.toString());
					try {
						String url = AlipayService.alipay_user_account_asset_push(xMaps, PARTNER, KEY);
						urls.add(url);
					} catch (Exception e) {
						logger.error("购彩记录", e);
					}
				}
			}
		}
		return urls;
	}
	
	private static String getBizType(String bittype){
		String ct = ibizs.get(bittype);
		if(ct == null){
			ct = "其他";
		}
		return ct;
	}
	
	private static String getGame(String gameid){
		String ct = GameContains.getGameName(gameid);
		if(ct == null){
			ct = "其他";
		}
		return ct;
	}
	
	private static String getBank(String gameid){
		String ct = banks.get(gameid);
		if(ct == null){
			ct = "其他";
		}
		return ct;
	}
	
	private static String getMemo(String memo, String ibiztype){
		String [] arr=StringUtil.splitter(memo, "|");
		String rmemo = "";
		if (arr.length>1){
			switch (Integer.valueOf(ibiztype)){
				case 200:
					rmemo = getBank(arr[0])+"充值 订单号" +arr[1];
				break;
				case 100:
				case 101:
				case 103:
				case 105:
				case 201:
				case 202:
				case 203:
				case 204:
				case 210:
				case 211:
				case 215:
					rmemo = getGame(arr[0]) + getBizType(ibiztype);
				break;
				case 102:
				case 212:
					String [] NT= StringUtil.splitter(arr[0], "ZH");
					rmemo = getGame(NT[0]) + getBizType(ibiztype);
				break;
				case 300:
					rmemo = "转款";
				break;
				case 213:
				default:
				break;
			}
		}
		if(rmemo.length() > 0){
			return rmemo;
		}
		return memo;
	}
}
