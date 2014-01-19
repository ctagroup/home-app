package edu.weber.housing1000.Helpers;

import android.content.Context;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map.Entry;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManagerFactory;

import edu.weber.housing1000.R;


/**
 * This is a generic helper class to help perform
 * HTTP connection tasks.
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
    public static String urlAction(Context context, String targetUrl, HashMap<String, String> properties)
            throws IOException {
        InputStream is = null;
        String actionType = properties.remove(ACTION_TYPE);

        try {
            URL url = new URL(targetUrl);

            // HTTPS
            if (targetUrl.contains("https://")) {
                SSLContext sslContext = getSSLContext(context);

                HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();

                if (sslContext != null)
                {
                    conn.setSSLSocketFactory(sslContext.getSocketFactory());
                }

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

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        } finally {
            if (is != null) {
                is.close();
            }
        }
    }

    public static SSLContext getSSLContext(Context context) {
        try {


            // Load CAs from an InputStream
            // (could be from a resource or ByteArrayInputStream or ...)
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            // From https://www.washington.edu/itconnect/security/ca/load-der.crt
            Certificate ca;
            InputStream caInput = context.getResources().openRawResource(R.raw.certificate);
            try {
                ca = cf.generateCertificate(caInput);
                System.out.println("ca=" + ((X509Certificate) ca).getSubjectDN());
            } catch (Exception e) {
                e.printStackTrace();
                return null;
            } finally {
                caInput.close();
            }

            // Create a KeyStore containing our trusted CAs
            String keyStoreType = KeyStore.getDefaultType();
            KeyStore keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            // Create a TrustManager that trusts the CAs in our KeyStore
            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keyStore);

            // Create an SSLContext that uses our TrustManager
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, tmf.getTrustManagers(), null);

            return sslContext;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
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
        Context context;
        OnUrlTaskCompleted listener;
        int taskCode = 0;

        public UrlTask(Context context, OnUrlTaskCompleted listener, int taskCode) {
            this.listener = listener;
            this.taskCode = taskCode;
            this.context = context;
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
                    result = urlAction(context, URL, params[0]);
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
