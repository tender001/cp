package com.caipiao.plugin.helper;

public class CodeFormatException extends Exception {
	
	private static final long serialVersionUID = 3878940048388011956L;
	 
	private int errCode ;
	private String errDesc;
	private String castCode ;
	
	public CodeFormatException(int errCode,String errDesc,String castCode) {
		super(errDesc + " 投注号码=" + castCode);
		this.errCode = errCode;
		this.errDesc = errDesc;
		this.castCode = castCode;
	}

	public String getCastCode() {
		return castCode;
	}

	public void setCastCode(String castCode) {
		this.castCode = castCode;
	}

	public int getErrCode() {
		return errCode;
	}

	public void setErrCode(int errCode) {
		this.errCode = errCode;
	}

	public String getErrDesc() {
		return errDesc;
	}

	public void setErrDesc(String errDesc) {
		this.errDesc = errDesc;
	}
}