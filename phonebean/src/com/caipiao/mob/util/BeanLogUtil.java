package com.caipiao.mob.util;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

import com.caipiao.mob.BaseBean;
import com.mina.rbc.logger.Logger;

public class BeanLogUtil {
	public static void logger(String title,BaseBean b, Logger logger){
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(b.getClass());
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			logger.info(title);
			logger.info("-------------------开始-------------------");
			for(PropertyDescriptor pd : propertyDescriptors){
				Method method = pd.getReadMethod();
				logger.info("[属性]" + method.getName() + " = " + method.invoke(b));
			}
			logger.info("-------------------结束-------------------");
		} catch (Exception e) {
			logger.error("BeanLogUtil:logger", e);
		}
	}
}
