package com.caipiao.cpweb.util;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

import com.caipiao.cpweb.BaseBean;
import com.mina.rbc.logger.Logger;

public class BeanLogUtil {
	public static void logger(BaseBean b, Logger logger){
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(b.getClass());
			PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
			for(PropertyDescriptor pd : propertyDescriptors){
				Method method = pd.getReadMethod();
				logger.info("[属性]" + method.getName() + " = " + method.invoke(b));
			}
		} catch (Exception e) {
			logger.error("BeanLogUtil:logger", e);
		}
	}
}
