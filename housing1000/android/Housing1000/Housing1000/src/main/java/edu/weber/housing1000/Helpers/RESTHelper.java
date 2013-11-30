package edu.weber.housing1000.Helpers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.net.ssl.HttpsURLConnection;

import android.os.AsyncTask;
import android.util.Log;

/**
 * This is a generic helper class I created to help perform
 * HTTP connection tasks.  I designed it to be generic so I
 * can pop it into future projects without having to adapt the
 * code.
 *
 * @author Blake
 */
public class RESTHelper {
    public static final String ACTION_TYPE = "ACTION_TYPE";
    public static final String GET = "GET";
    public static final String POST = "POST";
    public static final String URL = "URL";
    public static final String TASK_CODE = "TASK_CODE";
    public static final String RESULT = "RESULT";

    /**
     * Performs a GET request with the specified properties
     *
     * @param targetUrl  - Target server to hit
     * @param properties - Properties to add to the request
     * @return Server response
     * @throws IOException
     */
    public static String urlAction(String targetUrl, HashMap<String, String> properties)
            throws IOException {
        InputStream is = null;
        String actionType = properties.remove(ACTION_TYPE);

        try {
            URL url = new URL(targetUrl);

            // HTTPS
            if (targetUrl.contains("https://")) {
                HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

                conn.setReadTimeout(10000);
                conn.setConnectTimeout(20000);
                conn.setRequestMethod(actionType);
                conn.setDoInput(true);

                // Loop through the provided properties and add them to the connection
                for (Entry<String, String> entry : properties.entrySet()) {
                    conn.setRequestProperty(entry.getKey(), entry.getValue());
                }

                // Make the connection
                conn.connect();
                int response = conn.getResponseCode();
                Log.d("REST HELPER", "Response Code: " + response);
                Log.d("REST HELPER", "Response Message: " + conn.getResponseMessage());
                is = conn.getInputStream();
            }
            // HTTP
            else {
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();

                conn.setReadTimeout(5000);
                conn.setConnectTimeout(10000);
                conn.setRequestMethod(actionType);
                conn.setDoInput(true);

                // Loop through the provided properties and add them to the connection
                for (Entry<String, String> entry : properties.entrySet()) {
                    conn.setRequestProperty(entry.getKey(), entry.getValue());
                }

                // Make the connection
                conn.connect();
                int response = conn.getResponseCode();
                Log.d("REST HELPER", "Response Code: " + response);
                Log.d("REST HELPER", "Response Message: " + conn.getResponseMessage());
                is = conn.getInputStream();
            }

            // Convert the InputStream into a string
            String responseString = convertStreamToString(is);

            return responseString;

        } catch (Exception e)
        {
            Log.e("ERROR", e.getMessage());
            return "ERROR: " + e.getMessage();
        } finally {
            if (is != null) {
                is.close();
            }
        }
    }

    /**
     * Converts an InputStream to a String
     *
     * @param is - InputStream
     * @return - String response
     * @author Blake
     */
    private static String convertStreamToString(InputStream is) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();

        String line = null;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    /**
     * Callback used to detect when the Url task is finished
     *
     * @author Blake
     */
    public interface OnUrlTaskCompleted {
        void onUrlTaskCompleted(HashMap<String, String> result);
    }

    /**
     * Asynchronous task that calls urlAction()
     *
     * @author Blake
     */
    public static class UrlTask extends
            AsyncTask<HashMap<String, String>, Void, HashMap<String, String>> {
        String URL = "";
        OnUrlTaskCompleted listener;
        int taskCode = 0;

        public UrlTask(OnUrlTaskCompleted listener, int taskCode) {
            this.listener = listener;
            this.taskCode = taskCode;
        }

        @Override
        protected HashMap<String, String> doInBackground(
                HashMap<String, String>... params) {
            String result = "";

            if (params[0].containsKey(RESTHelper.URL)) {
                URL = params[0].remove(RESTHelper.URL);
            }

            try {
                if (!URL.isEmpty())
                    result = urlAction(URL, params[0]);
            } catch (IOException e) {
                e.printStackTrace();
            }

            HashMap<String, String> returnValue = new HashMap<String, String>();
            returnValue.put(TASK_CODE, String.valueOf(taskCode));
            returnValue.put(RESULT, result);

            return returnValue;
        }

        @Override
        protected void onPostExecute(HashMap<String, String> result) {
            // Log.d("getURLTask", "Result: \n" + result);
            listener.onUrlTaskCompleted(result);
            super.onPostExecute(result);
        }
    }

}
