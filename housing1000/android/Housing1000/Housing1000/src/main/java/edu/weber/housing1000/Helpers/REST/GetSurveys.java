package edu.weber.housing1000.Helpers.REST;

import android.content.Context;
import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;

import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.SSLContext;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import retrofit.RestAdapter;
import retrofit.client.OkClient;
import retrofit.client.Response;

/**
 * Created by Blake on 2/5/14.
 */
public class GetSurveys {

    public interface OnGetSurveyListingsTaskCompleted {
        void onGetSurveyListingsTaskCompleted(List<SurveyListing> surveyListings);
    }

    public static class GetSurveyListingsTask extends
            AsyncTask<String, Void, List<SurveyListing>> {
        String URL = "";
        Context context;
        OnGetSurveyListingsTaskCompleted listener;

        public GetSurveyListingsTask(Context context, OnGetSurveyListingsTaskCompleted listener) {
            this.listener = listener;
            this.context = context;
        }

        @Override
        protected List<SurveyListing> doInBackground(
                String... params) {
            URL = params[0];

            List<SurveyListing> surveyListings = new ArrayList<SurveyListing>();

            try {
                if (!URL.isEmpty())
                {
                    SurveyService service = setup(context, URL);

                    surveyListings = service.listSurveys();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return surveyListings;
        }

        @Override
        protected void onPostExecute(List<SurveyListing> listings) {
            listener.onGetSurveyListingsTaskCompleted(listings);
            super.onPostExecute(listings);
        }
    }

    public interface OnGetSingleSurveyTaskCompleted {
        void onGetSingleSurveyTaskCompleted(String surveyJson);
    }

    public static class GetSingleSurveyTask extends
            AsyncTask<String, Void, String> {
        String URL = "";
        OnGetSingleSurveyTaskCompleted listener;
        Context context;
        String id = "";

        public GetSingleSurveyTask(Context context, OnGetSingleSurveyTaskCompleted listener, String id) {
            this.listener = listener;
            this.context = context;
            this.id = id;
        }

        @Override
        protected String doInBackground(
                String... params) {
            URL = params[0];

            String result = "";

            try {
                if (!URL.isEmpty())
                {
                    SurveyService service = setup(context, URL);

                    Response response = service.getSurvey(id);

                    result = RESTHelper.convertStreamToString(response.getBody().in());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return result;
        }

        @Override
        protected void onPostExecute(String surveyJson) {
            listener.onGetSingleSurveyTaskCompleted(surveyJson);
            super.onPostExecute(surveyJson);
        }
    }

    public static SurveyService setup(Context context, String url)
    {
        SSLContext sslContext = RESTHelper.getSSLContext(context);

        OkHttpClient client = new OkHttpClient();

        client.setSslSocketFactory(sslContext.getSocketFactory());
        OkClient okClient = new OkClient(client);

        RestAdapter restAdapter = new RestAdapter.Builder()
                .setClient(okClient)
                .setEndpoint(url)
                .build();

        return restAdapter.create(SurveyService.class);
    }

}
