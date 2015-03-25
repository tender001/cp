package com.caipiao.split;

import com.util.string.StringUtil;

public class Code {
	private String playTypeName;
	private String castMethodName;
	private String redDanCode;
	private String redTuoCode;
	private String blueDanCode;
	private String blueTuoCode;
	private boolean isDrag;
	public String getPlayTypeName() {
		return playTypeName;
	}
	public void setPlayTypeName(String playTypeName) {
		this.playTypeName = playTypeName;
	}
	public String getCastMethodName() {
		return castMethodName;
	}
	public void setCastMethodName(String castMethodName) {
		this.castMethodName = castMethodName;
	}
	public String getRedDanCode() {
		return redDanCode;
	}
	public void setRedDanCode(String redDanCode) {
		this.redDanCode = redDanCode;
	}
	public String getRedTuoCode() {
		return redTuoCode;
	}
	public void setRedTuoCode(String redTuoCode) {
		this.redTuoCode = redTuoCode;
	}
	public String getBlueDanCode() {
		return blueDanCode;
	}
	public void setBlueDanCode(String blueDanCode) {
		this.blueDanCode = blueDanCode;
	}
	public String getBlueTuoCode() {
		return blueTuoCode;
	}
	public void setBlueTuoCode(String blueTuoCode) {
		this.blueTuoCode = blueTuoCode;
	}
	public boolean isDrag() {
		return isDrag;
	}
	public void setDrag(boolean isDrag) {
		this.isDrag = isDrag;
	}
	
	public String toHTMLString(){
		String str = "";
		StringBuffer sb = new StringBuffer();
		if(isDrag){
			sb.append("<font style='color:#13px; font-family:Arial;color:red;'>");
			if(StringUtil.isNotEmpty(redTuoCode)){
				sb.append("[胆码]:" + redDanCode + " [拖码]:" + redTuoCode);
			} else {
				sb.append(redDanCode);
			}
			sb.append("</font>");
			
			if(StringUtil.isNotEmpty(blueDanCode)){
				sb.append(" | <font style='color:#13px; font-family:Arial;color:blue;'>");
				if(StringUtil.isNotEmpty(blueTuoCode)){
					sb.append("[胆码]:" + blueDanCode + " [拖码]:" + blueTuoCode);
				} else {
					sb.append(blueDanCode);
				}
				sb.append("</font>");
			}
		} else {
			sb.append(castMethodName + " ");
			sb.append("<font style='color:#13px; font-family:Arial;color:red;'>");
			if(StringUtil.isEmpty(playTypeName)){
				sb.append(redDanCode);
			} else {
				sb.append(playTypeName + " " + redDanCode);
			}
			sb.append("</font>");
			
			if(StringUtil.isNotEmpty(blueDanCode)){
				sb.append(" | <font style='color:#13px; font-family:Arial;color:blue;'>");
				sb.append(blueDanCode);
				sb.append("</font>");
			}
		}
		str = sb.toString();
		return str;
	}
}
