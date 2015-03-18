package com.caipiao.plugin.bjutil;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Method;

public class BeanUtil {
	


	
	public static void setValue(Object o,String field,Object value){
		try {
			Method method = null;
			if(value != null){
				method = o.getClass().getMethod("set"+field.substring(0,1).toUpperCase()+field.substring(1), value.getClass());
			}else{
				method = o.getClass().getMethod("set"+field.substring(0,1).toUpperCase()+field.substring(1), String.class);
			}
			method.invoke(o, value);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	protected static Object getValue(Object o,String field){
		Method method;
		try {
//			method = o.getClass().getMethod("get"+field.substring(0,1).toUpperCase()+field.substring(1),null);
//			return method.invoke(o, null);
			method = o.getClass().getMethod("get"+field.substring(0,1).toUpperCase()+field.substring(1));
			return method.invoke(o);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	protected static int getReturnType(Class<?> cla,String field){
		try {
			BeanInfo bi = Introspector.getBeanInfo(cla);
			PropertyDescriptor [] pds = bi.getPropertyDescriptors();
			for(int i=0;i<pds.length;i++){
				PropertyDescriptor pd = pds[i];
				if(!"class".equalsIgnoreCase(pd.getName())){
					if(field.equalsIgnoreCase(pd.getName())){
						Method method = pd.getReadMethod();
						Class<?> cl =  method.getReturnType();
						if("java.lang.String".equals(cl.getName())){
							return 1;
						}else{
							return 0;
						}
					}
				}
			}
		} catch (IntrospectionException e) {
			e.printStackTrace();
		}
		return -1;
	}
}
