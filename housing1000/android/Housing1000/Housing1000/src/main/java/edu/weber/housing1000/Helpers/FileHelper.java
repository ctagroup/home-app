package edu.weber.housing1000.Helpers;

import android.os.Environment;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

/**
 * Created by Blake on 11/16/13.
 */
public class FileHelper {
    private static final String appDirectory = "/.housing1000";

    /**
     * Writes a file to external storage
     * @param fileBytes Bytes to be written
     * @param subDirectory Subdirectory that will contain the file
     * @param filename Name of the file to be written
     */
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

    /**
     * Reads a file from external storage, given a subdirectory and filename
     * @param subDirectory Subdirectory that contains the file
     * @param filename Name of the file
     * @return Bytes of the file
     */
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

    /**
     * Reads a file into a byte array
     * @param file File to read in
     * @return Bytes of the file
     */
    public static byte[] readFile(File file)
    {
        // Check to see if we can write to external storage
        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState()))
        {
            try {
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

    /**
     * Gets the absolute path of a file in the app directory
     * @param subDirectory Subdirectory that contains the file
     * @param filename Name of the file
     * @return Absolute path of the file
     */
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

    /**
     * Deletes all files in a specified directory (or a single file)
     *
     * @param fileOrDirectory
     *            File or directory to be deleted
     */
    public static void deleteAllFiles(File fileOrDirectory) {
        // Check to see if we can write to external storage
        if (Environment.MEDIA_MOUNTED.equals(Environment
                .getExternalStorageState())) {
            if (fileOrDirectory.isDirectory())
            {
                for (File f : fileOrDirectory.listFiles()) {
                    if (!f.isDirectory())
                        f.delete();
                    else {
                        deleteAllFiles(f);
                    }
                    f.delete();
                }
            }
            else
            {
                fileOrDirectory.delete();
            }
        }
    }

}
