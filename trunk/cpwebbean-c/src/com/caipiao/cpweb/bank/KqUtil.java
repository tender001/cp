package com.caipiao.cpweb.bank;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

public class KqUtil {

//	private static String CERPATH = "/opt/kq/cp159cai.pfx";//159彩私钥
//	private static String CALLBACK_CERPATH = "/opt/kq/99bill.cert.rsa.20140728.cer";//快钱公钥
//	private static String PASSWORD	= "1qaz2wsx";
//	private static String KEY	= "cp159cai";
	
	private static String CERPATH = "/opt/export/bankkey/kq/99bill-rsa.pfx";//159彩私钥
	private static String CALLBACK_CERPATH = "/opt/export/bankkey/kq/99bill.cert.rsa.20340630.cer";//快钱公钥
	private static String PASSWORD	= "123456";
	private static String KEY	= "test-alias";
	
	public static String signMsg( String signMsg) {
		String base64 = "";
		try {
			// 密钥仓库
			KeyStore ks = KeyStore.getInstance("PKCS12");

			// 读取密钥仓库
			FileInputStream ksfis = new FileInputStream(CERPATH);
			BufferedInputStream ksbufin = new BufferedInputStream(ksfis);

			char[] keyPwd = PASSWORD.toCharArray();
			ks.load(ksbufin, keyPwd);
			// 从密钥仓库得到私钥
			PrivateKey priK = (PrivateKey) ks.getKey(KEY, keyPwd);
			Signature signature = Signature.getInstance("SHA1withRSA");
			signature.initSign(priK);
			signature.update(signMsg.getBytes());
			sun.misc.BASE64Encoder encoder = new sun.misc.BASE64Encoder();
			base64 = encoder.encode(signature.sign());
			
		} catch(FileNotFoundException e){
			System.out.println("文件找不到");
		}catch (Exception ex) {
			ex.printStackTrace();
		}
		System.out.println("test = "+base64);
		return base64;
	}
	
	public static boolean check(String val, String msg) {
		boolean flag = false;
		try {
			//获得文件
			InputStream inStream = new FileInputStream(CALLBACK_CERPATH);
			//InputStream inStream = this.getClass().getClassLoader().getResourceAsStream("\\demo\\99bill[1].cert.rsa.20140728.cer");
			
			CertificateFactory cf = CertificateFactory.getInstance("X.509");
			X509Certificate cert = (X509Certificate) cf.generateCertificate(inStream);
			//获得公钥
			PublicKey pk = cert.getPublicKey();
			//签名
			Signature signature = Signature.getInstance("SHA1withRSA");
			signature.initVerify(pk);
			signature.update(val.getBytes());
			
			//解码
			sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
			
			System.out.println(new String(decoder.decodeBuffer(msg)));
			
			flag = signature.verify(decoder.decodeBuffer(msg));
			System.out.println(flag);
		} catch (Exception e) {
			System.out.println("文件找不到");
		} 
		return flag;
	}
}
