package edu.weber.housing1000.rest;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Base64;

import org.xmlpull.v1.XmlPullParserException;

import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.*;

public class RestHelper {
    public static final String username = "user";
    public static final String password = "test";
    public static final String apiUrl = "https://www.hmisscc.org/Housing1000Service/Housing1000Svc.svc/rest";


    public static int getHmsId() {
        int retval = -1;
        String result = null;
        try {
            String authString = username + ":" + password;
            byte[] authEncBytes = Base64.encode(authString.getBytes(), Base64.DEFAULT);
            String authStringEnc = new String(authEncBytes);

            URL url = new URL(apiUrl + "/genID");
            URLConnection urlConnection = url.openConnection();
            urlConnection.setRequestProperty("Authorization", "Basic " + authStringEnc);
            InputStream is = urlConnection.getInputStream();
            InputStreamReader isr = new InputStreamReader(is);

            int numCharsRead;
            char[] charArray = new char[1024];
            StringBuilder sb = new StringBuilder();
            while ((numCharsRead = isr.read(charArray)) > 0) {
                sb.append(charArray, 0, numCharsRead);
            }
            result = XmlParseHelper.parseGenID(sb.toString());
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (XmlPullParserException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (result != null) {
            retval = Integer.parseInt(result);
        }
        return retval;
    }

    public static int postFile(String file_name, Context context) {
        int retval = -1;
        try {
            String authString = username + ":" + password;
            byte[] authEncBytes = Base64.encode(authString.getBytes(), Base64.DEFAULT);
            String authStringEnc = new String(authEncBytes);

            FileInputStream fis = context.openFileInput(file_name);

            URL url = new URL(apiUrl + "/Upload");
            URLConnection urlConnection = url.openConnection();
            urlConnection.setDoOutput(true);
            urlConnection.setRequestProperty("Authorization", "Basic " + authStringEnc);
            OutputStream os = urlConnection.getOutputStream();
            byte[] buffer = new byte[4096];
            int bytes_read;
            while ((bytes_read = fis.read(buffer)) != -1) {
                os.write(buffer, 0, bytes_read);
            }
            os.flush();
            os.close();
            fis.close();

            InputStream is = urlConnection.getInputStream();
            InputStreamReader isr = new InputStreamReader(is);

            int numCharsRead;
            char[] charArray = new char[1024];
            StringBuilder sb = new StringBuilder();
            while ((numCharsRead = isr.read(charArray)) > 0) {
                sb.append(charArray, 0, numCharsRead);
            }
            retval = ((HttpsURLConnection) urlConnection).getResponseCode();
        } catch (MalformedURLException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        } catch (IOException e) {
            e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
        }
        return retval;
    }

    /***
     *
     */
    class RetreiveHmsIdTask extends AsyncTask<Void, Void, Integer> {

        private Exception exception;

        protected Integer doInBackground(Void... params) {
            int retval = -1;
            try {
                String result = null;

                // TODO: Implement HMS ID retrieval

            } catch (Exception e) {
                this.exception = e;
                return -1;
            }

            return retval;
        }

        protected void onPostExecute(Integer Id) {
            // TODO: check this.exception
            // TODO: do something with the feed
        }
    }

}
