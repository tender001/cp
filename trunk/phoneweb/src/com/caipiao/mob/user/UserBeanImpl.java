package com.caipiao.mob.user;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mina.rbc.util.StringUtil;
import com.rbc.frame.RbcFrameContext;

public class UserBeanImpl {
	
	private static HashMap<String,Integer> bankMap = new HashMap<String,Integer>();
	
	public UserBeanImpl(){
		bankMap.put("工商银行", 2);
		bankMap.put("招商银行", 1);
		bankMap.put("农业银行", 13);
		bankMap.put("建设银行", 3);
		bankMap.put("邮政储蓄", 25);
		bankMap.put("中信银行", 8);
		bankMap.put("兴业银行", 9);
		bankMap.put("光大银行", 10);
		bankMap.put("华夏银行", 11);
		bankMap.put("深圳发展银行", 1001);
		bankMap.put("广发银行", 1000);
		bankMap.put("中国民生银行", 12);
		bankMap.put("上海浦东发展银行", 4000);
		bankMap.put("农村信用合作社", 15);
		bankMap.put("农村商业银行", 16);
		bankMap.put("农村合作银行", 17);
		bankMap.put("城市商业银行", 18);
		bankMap.put("城市信用合作社", 19);
		bankMap.put("平安银行", 23);
		bankMap.put("上海银行", 4001);
		bankMap.put("北京银行", 2000);
		bankMap.put("恒丰银行", 22);
		bankMap.put("渤海银行", 24);
		bankMap.put("广州银行", 1001);
		bankMap.put("珠海南通银行", 1003);
		bankMap.put("天津银行", 3000);
		bankMap.put("浙商银行", 5000);
		bankMap.put("浙江商业银行", 5001);
		bankMap.put("宁波国际银行", 5002);
		bankMap.put("宁波银行", 5003);
		bankMap.put("温州银行", 5004);
		bankMap.put("南京银行", 6000);
		bankMap.put("常熟农村商业银行", 6001);
		bankMap.put("福建亚洲银行", 7000);
		bankMap.put("福建兴业银行", 7001);
		bankMap.put("徽商银行", 7002);
		bankMap.put("厦门国际银行", 7003);
		bankMap.put("青岛市商业银行", 8000);
		bankMap.put("济南市商业银行", 8001);
		bankMap.put("重庆银行", 9000);
		bankMap.put("成都市商业银行", 10000);
		bankMap.put("哈尔滨银行", 11000);
		bankMap.put("包头市商业银行", 12000);
		bankMap.put("南昌市商业银行", 13000);
		bankMap.put("贵阳商业银行", 14000);
		bankMap.put("兰州市商业银行", 15000);
	}
	
	public int convertBank(UserBean bean, RbcFrameContext context, HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		if(!StringUtil.isEmpty(bean.getProvince()) && !StringUtil.isEmpty(bean.getCity())
				&& !StringUtil.isEmpty(bean.getSubbranch()) && !StringUtil.isEmpty(bean.getBankNumber())){
		
			String bank = request.getParameter("bank");
			
			System.out.println(bank);
			
			if(bank != null){
				int tmp = bankMap.get(bank);
				
				System.out.println(tmp);
				
				bean.setBank(tmp);
			}
		}
		
		return 1;
	}

}
