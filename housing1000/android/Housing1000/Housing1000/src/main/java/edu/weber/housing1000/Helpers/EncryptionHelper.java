package edu.weber.housing1000.Helpers;

import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by Coty on 11/13/13.
 */
public class EncryptionHelper {
    public static byte[] keyGen() throws Exception{
        byte[] keyStart = "housingApp".getBytes();
        KeyGenerator kgen = KeyGenerator.getInstance("AES");
        //SecureRandom sr = SecureRandom.getInstance("");
        SecureRandom sr = new SecureRandom();
        sr.setSeed(keyStart);
        kgen.init(128, sr);
        SecretKey skey = kgen.generateKey();
        byte[] key = skey.getEncoded();
        return key;
    }

    public static byte[] encrypt(byte[] key, byte[] file) throws Exception{
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
        byte[] encrypted = cipher.doFinal(file);
        return encrypted;
    }

    public static byte[] decrypt(byte[] key, byte[] encrypted) throws Exception{
        //byte[] bytesToDecrypt = Base64.decodeBase64(encrypted);
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec);
        byte[] decrypted = cipher.doFinal(encrypted);
        return decrypted;
    }
}
