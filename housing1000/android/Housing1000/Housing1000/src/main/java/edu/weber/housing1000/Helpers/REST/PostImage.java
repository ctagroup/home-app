package edu.weber.housing1000.Helpers.REST;

import android.content.Context;
import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;

import java.io.File;

import javax.net.ssl.SSLContext;

import retrofit.RestAdapter;
import retrofit.client.OkClient;
import retrofit.client.Response;
import retrofit.mime.TypedFile;
import retrofit.mime.TypedString;

/**
 * Created by Blake on 2/19/14.
 */
public class PostImage {

    /**
     * Callback used to detect when the Url task is finished
     *
     * @author Blake
     */
    public interface OnPostImageTaskCompleted {
        void onPostImageTaskCompleted(String result);
    }

    /**
     * Asynchronous task that calls urlAction()
     *
     * @author Blake
     */
    public static class PostImageTask extends
            AsyncTask<String, Void, String> {
        String URL = "";
        Context context;
        OnPostImageTaskCompleted listener;
        File signatureFile;

        public PostImageTask(Context context, OnPostImageTaskCompleted listener, File file) {
            this.listener = listener;
            this.signatureFile = file;
            this.context = context;
        }

        @Override
        protected String doInBackground(
                String... params) {
            String result = "";

            URL = params[0];

            try {
                if (!URL.isEmpty()) {
                    result = "";

                    // Set up SSL
                    SSLContext sslContext = RESTHelper.getSSLContext(context);
                    OkHttpClient client = new OkHttpClient();
                    client.setSslSocketFactory(sslContext.getSocketFactory());
                    OkClient okClient = new OkClient(client);

                    RestAdapter restAdapter = new RestAdapter.Builder()
                            .setClient(okClient)
                            .setEndpoint(URL)
                            .build();

                    SurveyService service = restAdapter.create(SurveyService.class);

                    TypedFile typedFile = new TypedFile("application/octet-stream", signatureFile);
                    TypedString typedString = new TypedString("Signature");
                    Response sResponse = service.postImage(typedFile, typedString);

                    result = RESTHelper.convertStreamToString(sResponse.getBody().in());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return result;
        }

        @Override
        protected void onPostExecute(String result) {
            listener.onPostImageTaskCompleted(result);
            super.onPostExecute(result);
        }
    }

}
