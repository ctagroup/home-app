package edu.weber.housing1000.Helpers.REST;

import android.content.Context;
import android.os.AsyncTask;

import com.squareup.okhttp.OkHttpClient;

import java.util.ArrayList;
import java.util.List;

import javax.net.ssl.SSLContext;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Helpers.SurveyService;
import retrofit.RestAdapter;
import retrofit.client.OkClient;

/**
 * Created by Blake on 2/5/14.
 */
public class GetSurveys {

    /**
     * Callback used to detect when the Url task is finished
     *
     * @author Blake
     */
    public interface OnGetSurveyListingsTaskCompleted {
        void onGetSurveyListingsTaskCompleted(List<SurveyListing> result);
    }

    /**
     * Asynchronous task that calls urlAction()
     *
     * @author Blake
     */
    public static class GetSurveyListingsTask extends
            AsyncTask<String, Void, List<SurveyListing>> {
        String URL = "";
        Context context;
        OnGetSurveyListingsTaskCompleted listener;
        String taskCode = "";

        public GetSurveyListingsTask(Context context, OnGetSurveyListingsTaskCompleted listener, String taskCode) {
            this.listener = listener;
            this.taskCode = taskCode;
            this.context = context;
        }

        @Override
        protected List<SurveyListing> doInBackground(
                String... params) {
            String result = "";

            URL = params[0];

            List<SurveyListing> surveyListings = new ArrayList<SurveyListing>();

            try {
                if (!URL.isEmpty())
                {
                    result = "";

                    SSLContext sslContext = RESTHelper.getSSLContext(context);

                    OkHttpClient client = new OkHttpClient();

                    client.setSslSocketFactory(sslContext.getSocketFactory());
                    OkClient okClient = new OkClient(client);

                    RestAdapter restAdapter = new RestAdapter.Builder()
                            .setClient(okClient)
                            .setEndpoint(URL)
                            .build();

                    SurveyService service = restAdapter.create(SurveyService.class);

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

}
