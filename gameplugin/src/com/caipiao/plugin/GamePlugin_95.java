package com.caipiao.plugin;

import java.util.HashMap;
import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.lqutil.GamePlugin_lq;
import com.caipiao.plugin.lqutil.LqItemCodeUtil;
import com.caipiao.plugin.lqutil.LqPassTypeUtil;
import com.caipiao.plugin.sturct.GameCastCode;

//让分胜负
public class GamePlugin_95 extends GamePlugin_lq {

	@Override
	public void checkPassType(String passtype) throws CodeFormatException {
		int end = LqPassTypeUtil.getEndPassType(passtype);
		if(end < 1 || end > 8){
			throw new CodeFormatException(5, " 过关方式不正确 必须是(1到8串之间)", passtype);
		}
	}

	@Override
	public byte getIntPlayType(String prefix) throws CodeFormatException {
		if ( prefix.equalsIgnoreCase("rfsf") ) {
			return LqItemCodeUtil.RFSF;
		} else {
			throw new CodeFormatException(5, " 玩法不正确 必须是(RFSF|号码|过关方式)", prefix);
		}
	}

	@Override
	public String toPrintCode(GameCastCode gcc) {
		return "";
	}

	@Override
	public HashMap<String, String> keyBoardParser(String codes, int muli) throws Exception {
		return null;
	}

}
