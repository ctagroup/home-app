package edu.weber.housing1000.Helpers.REST;

import android.content.Context;
import android.os.AsyncTask;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.squareup.okhttp.OkHttpClient;

import javax.net.ssl.SSLContext;

import edu.weber.housing1000.Data.SurveyResponse;
import retrofit.RestAdapter;
import retrofit.client.OkClient;
import retrofit.client.Response;
import retrofit.converter.GsonConverter;

/**
 * Created by Blake on 2/5/14.
 */
public class PostResponses {

    /**
     * Callback used to detect when the Url task is finished
     *
     * @author Blake
     */
    public interface OnPostSurveyResponsesTaskCompleted {
        void onPostSurveyResponsesTaskCompleted(String result);
    }

    /**
     * Asynchronous task that calls urlAction()
     *
     * @author Blake
     */
    public static class PostSurveyResponsesTask extends
            AsyncTask<String, Void, String> {
        String URL = "";
        Context context;
        OnPostSurveyResponsesTaskCompleted listener;
        SurveyResponse surveyResponse;

        public PostSurveyResponsesTask(Context context, OnPostSurveyResponsesTaskCompleted listener, SurveyResponse surveyResponse) {
            this.listener = listener;
            this.surveyResponse = surveyResponse;
            this.context = context;
        }

        @Override
        protected String doInBackground(
                String... params) {
            String result = "";

            URL = params[0];

            try {
                if (!URL.isEmpty())
                {
                    result = "";

                    // Set up SSL
                    SSLContext sslContext = RESTHelper.getSSLContext(context);
                    OkHttpClient client = new OkHttpClient();
                    client.setSslSocketFactory(sslContext.getSocketFactory());
                    OkClient okClient = new OkClient(client);

                    Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

                    RestAdapter restAdapter = new RestAdapter.Builder()
                            .setClient(okClient)
                            .setConverter(new GsonConverter(gson))
                            .setEndpoint(URL)
                            .build();

                    SurveyService service = restAdapter.create(SurveyService.class);
                    Response sResponse = service.postResponse(String.valueOf(surveyResponse.surveyId), surveyResponse);
                    result = RESTHelper.convertStreamToString(sResponse.getBody().in());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return result;
        }

        @Override
        protected void onPostExecute(String result) {
            listener.onPostSurveyResponsesTaskCompleted(result);
            super.onPostExecute(result);
        }
    }

}
