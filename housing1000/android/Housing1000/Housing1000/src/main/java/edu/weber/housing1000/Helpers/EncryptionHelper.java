package edu.weber.housing1000.helpers;

import java.io.File;
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

    private static void keyGen() {
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

    public static byte[] encrypt(byte[] file) {
        if (key == null)
            keyGen();

        try
        {
            SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
            return cipher.doFinal(file);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return null;
    }

    public static byte[] decrypt(byte[] encrypted){
        if (key == null)
            keyGen();

        try
        {
            //byte[] bytesToDecrypt = Base64.decodeBase64(encrypted);
            SecretKeySpec skeySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec);
            return cipher.doFinal(encrypted);
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }

        return null;
    }

    public static byte[] decryptImage(File file)
    {
        // Open the encrypted file, decrypt the image, write it to disk -- for testing
        byte[] encryptedFileBytes = FileHelper.readFile(file);
        return EncryptionHelper.decrypt(encryptedFileBytes);
    }
}
