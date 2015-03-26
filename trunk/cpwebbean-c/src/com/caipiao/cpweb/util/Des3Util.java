package com.caipiao.cpweb.util;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.*;
import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.binary.Hex;

public class Des3Util {

	public static byte[] Base64Encode(byte b[]) throws Exception {
		return Base64.encodeBase64(b);
	}

	public static byte[] Base64Decode(byte b[]) throws Exception {
		return Base64.decodeBase64(b);
	}

	public static String URLEncode(String strToBeEncode) throws Exception {
		return URLEncoder.encode(strToBeEncode, CodingType);
	}

	public static String URLDecode(String strToBeDecode) throws Exception {
		return URLDecoder.decode(strToBeDecode, CodingType);
	}

	private static IvParameterSpec IvGenerator(byte b[]) throws Exception {
		IvParameterSpec IV = new IvParameterSpec(b);
		return IV;
	}

	private static Key KeyGenerator(String KeyStr) throws Exception {
		//byte input[] = Hex.decodeHex(KeyStr.toCharArray());
		DESedeKeySpec KeySpec = new DESedeKeySpec(KeyStr.getBytes());
		SecretKeyFactory KeyFactory = SecretKeyFactory
				.getInstance(KeyAlgorithm);
		return KeyFactory.generateSecret(KeySpec);
	}

	public static byte[] IVGenerator(String strIV) throws Exception {
		return Hex.decodeHex(strIV.toCharArray());
	}

	public static String GenerateDigest(String strTobeDigest) throws Exception {
		byte input[] = strTobeDigest.getBytes(CodingType);
		byte output[] = (byte[]) null;
		MessageDigest DigestGenerator = MessageDigest
				.getInstance(DigestAlgorithm);
		DigestGenerator.update(input);
		output = DigestGenerator.digest();
		return new String(Base64Encode(output), CodingType);
	}

	public static String Encrypt(String strTobeEnCrypted, String strKey,
			byte byteIV[]) throws Exception {
		byte input[] = strTobeEnCrypted.getBytes(CodingType);
		Key k = KeyGenerator(strKey);
		IvParameterSpec IVSpec = byteIV.length != 0 ? IvGenerator(byteIV)
				: IvGenerator(defaultIV);
		Cipher c = Cipher.getInstance(CryptAlgorithm);
		c.init(1, k, IVSpec);
		byte output[] = c.doFinal(input);
		return new String(Base64Encode(output), CodingType);
	}

	public static String Decrypt(String strTobeDeCrypted, String strKey,
			byte byteIV[]) throws Exception {
		byte input[] = Base64Decode(strTobeDeCrypted.getBytes(CodingType));
		Key k = KeyGenerator(strKey);
		IvParameterSpec IVSpec = byteIV.length != 0 ? IvGenerator(byteIV)
				: IvGenerator(defaultIV);
		Cipher c = Cipher.getInstance(CryptAlgorithm);
		c.init(2, k, IVSpec);
		byte output[] = c.doFinal(input);
		return new String(output, CodingType);
	}

	public static byte[] HexStringToByteArray(String s) {
		byte buf[] = new byte[s.length() / 2];
		for (int i = 0; i < buf.length; i++)
			buf[i] = (byte) (chr2hex(s.substring(i * 2, i * 2 + 1)) * 16 + chr2hex(s
					.substring(i * 2 + 1, i * 2 + 1 + 1)));

		return buf;
	}

	private static byte chr2hex(String chr) {
		if ("0".equals(chr))
			return 0;
		if ("1".equals(chr))
			return 1;
		if ("2".equals(chr))
			return 2;
		if ("3".equals(chr))
			return 3;
		if ("4".equals(chr))
			return 4;
		if ("5".equals(chr))
			return 5;
		if ("6".equals(chr))
			return 6;
		if ("7".equals(chr))
			return 7;
		if ("8".equals(chr))
			return 8;
		if ("9".equals(chr))
			return 9;
		if ("A".equals(chr))
			return 10;
		if ("B".equals(chr))
			return 11;
		if ("C".equals(chr))
			return 12;
		if ("D".equals(chr))
			return 13;
		if ("E".equals(chr))
			return 14;
		return ((byte) (!"F".equals(chr) ? 0 : 15));
	}

	private static String CodingType = "UTF-8";
	private static String DigestAlgorithm = "SHA1";
	private static String CryptAlgorithm = "DESede/CBC/PKCS5Padding";
	private static String KeyAlgorithm = "DESede";
	private static byte defaultIV[] = "12345678".getBytes();

	public static void main(String[] args)
	{
		try {
			String key=Encrypt("<?xml version=\"1.0\" encoding=\"utf-8\"?> <body> <messageId>11224780_1172110105178021_0_21</messageId> </body>","123456789123456789123456", new byte[]{});
		
		System.out.println(key);
//		String md5 =MD5Util.getMD5Str(key);
//		System.out.println(md5);
		String str=Decrypt(key, "123456789123456789123456", new byte[]{});
		System.out.println(str);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
