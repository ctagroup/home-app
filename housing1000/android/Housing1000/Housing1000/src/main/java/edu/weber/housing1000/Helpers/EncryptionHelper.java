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
    private static byte[] key;

    public static void keyGen() {
        try
        {
            byte[] keyStart = "housingApp".getBytes();
            KeyGenerator kgen = KeyGenerator.getInstance("AES");
            //SecureRandom sr = SecureRandom.getInstance("");
            SecureRandom sr = new SecureRandom();
            sr.setSeed(keyStart);
            kgen.init(128, sr);
            SecretKey skey = kgen.generateKey();
            key = skey.getEncoded();
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public static byte[] encrypt(byte[] file) throws Exception{
        if (key == null)
            keyGen();

        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
        return cipher.doFinal(file);
    }

    public static byte[] decrypt(byte[] encrypted) throws Exception{
        if (key == null)
            keyGen();

        //byte[] bytesToDecrypt = Base64.decodeBase64(encrypted);
        SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec);
        return cipher.doFinal(encrypted);
    }
}
