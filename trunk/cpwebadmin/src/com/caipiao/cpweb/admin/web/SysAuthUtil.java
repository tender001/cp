package com.caipiao.cpweb.admin.web;

import java.util.HashMap;
import com.caipiao.cpweb.auth.AuthControl;
import com.caipiao.cpweb.base.AuthResult;

public class SysAuthUtil {
	public static boolean auth(WebAdmin bean, HashMap<Integer, Long> user_auths){
		AuthResult ar = AuthControl.control(bean.getFid(), user_auths);
		return ar.isAuth();
	}
}
