package edu.weber.housing1000.Helpers;

import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

/**
 * Created by Blake on 11/16/13.
 */
public class FileHelper {
    private static final String appDirectory = "/.housing1000";

    public static void writeFileToExternalStorage(byte[] fileBytes, String subDirectory, String filename)
    {
        // Check to see if we can write to external storage
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
        {
            try {
                // Get the external storage directory
                File sdCard = Environment.getExternalStorageDirectory();
                String dirPath = sdCard.getAbsolutePath() + appDirectory + "/" + subDirectory;

                // Set up the directory that we are saving to
                File dir = new File (dirPath);
                File nomedia = new File (dirPath + "/.nomedia");
                nomedia.mkdirs();
                File file = new File(dir, filename);

                Log.d("HOUSING 1000", "Saving file to " + file.getAbsolutePath());

                // Write the file
                FileOutputStream f = new FileOutputStream(file);
                f.write(fileBytes);
                f.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static byte[] readFileFromExternalStorage(String subDirectory, String filename)
    {
        // Check to see if we can write to external storage
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
        {
            try {

                // Get the external storage directory
                File sdCard = Environment.getExternalStorageDirectory();
                String dirPath = sdCard.getAbsolutePath() + appDirectory + "/" + subDirectory;

                // Set up the directory that we are reading from
                File dir = new File (dirPath);
                File file = new File(dir, filename);

                Log.d("HOUSING 1000", "Reading file from " + file.getAbsolutePath());

                // Write the file
                FileInputStream f = new FileInputStream(file);

                byte[] fileBytes = new byte[(int)file.length()];

                f.read(fileBytes);
                f.close();

                return fileBytes;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return null;
    }

    public static String getAbsoluteFilePath(String subDirectory, String filename)
    {
        // Get the external storage directory
        File sdCard = Environment.getExternalStorageDirectory();
        String dirPath = sdCard.getAbsolutePath() + appDirectory + "/" + subDirectory;

        // Set up the directory that we are reading from
        File dir = new File (dirPath);
        File file = new File(dir, filename);

        return file.getAbsolutePath();
    }

}
