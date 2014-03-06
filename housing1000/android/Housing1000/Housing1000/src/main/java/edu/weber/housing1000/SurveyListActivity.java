package edu.weber.housing1000;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import java.io.IOException;
import java.util.List;

import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.SurveyListFragment;
import edu.weber.housing1000.Fragments.SurveyListFragment.*;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SurveyListActivity extends ActionBarActivity implements ISurveyListFragment {

    private ProgressDialog progressDialog;

    private ListView surveysListView;
    private List<SurveyListing> surveyListings;
    public ArrayAdapter<SurveyListing> surveyAdapter;

    SurveyListing chosenSurveyListing;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_list);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.container, new SurveyListFragment())
                    .commit();
        }

        getSurveyList();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_survey_list, menu);

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId())
        {
            case R.id.action_refresh:
                getSurveyList();
                return true;
            default:
                break;
        }

        return super.onOptionsItemSelected(item);
    }

    public void getSurveyList()
    {
        if (surveysListView != null)
            surveysListView.setAdapter(null);

        // Start the loading dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Please Wait");
        progressDialog.setMessage("Downloading survey list...");
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setIndeterminate(true);
        progressDialog.setCancelable(true);
        progressDialog.show();

        RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.listSurveys(new Callback<List<SurveyListing>>() {
            @Override
            public void success(List<SurveyListing> surveyListings, Response response) {
                onGetSurveyListingsTaskCompleted(surveyListings);
            }

            @Override
            public void failure(RetrofitError error) {
                onGetSurveyListingsTaskCompleted(null);
            }
        });
    }

    public void onGetSurveyListingsTaskCompleted(List<SurveyListing> surveyListings) {
        progressDialog.dismiss();

        SurveyListFragment fragment = (SurveyListFragment) getSupportFragmentManager().getFragments().get(0);

        this.surveyListings = surveyListings;

        if (surveyListings != null && surveyListings.size() > 0)
        {
            surveyAdapter = new ArrayAdapter<SurveyListing>(
                    SurveyListActivity.this,
                    android.R.layout.simple_list_item_1,
                    surveyListings );

            surveysListView.setAdapter(surveyAdapter);
            fragment.showNoSurveys(false);
        }
        else
        {
            fragment.showNoSurveys(true);
        }
    }

    @Override
    public void setListView(ListView listView) {
        surveysListView = listView;

        surveysListView.setOnItemClickListener(surveyClickListener);
    }

    /**
     * Handles the survey click events
     */
    private final AdapterView.OnItemClickListener surveyClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position,
                                long id) {
            chosenSurveyListing = surveyListings.get((int) id);

            loadSurvey(chosenSurveyListing.getSurveyId());
        } // end method onItemClick
    };

    private void loadSurvey(long rowId)
    {
        // Start the loading dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Please Wait");
        progressDialog.setMessage("Downloading survey...");
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setIndeterminate(true);
        progressDialog.setCancelable(true);
        progressDialog.show();

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.getSurvey(String.valueOf(rowId), new Callback<String>() {
            @Override
            public void success(String result, Response response) {
                try {
                    String json = RESTHelper.convertStreamToString(response.getBody().in());
                    onGetSingleSurveyTaskCompleted(json);
                } catch (IOException e) {
                    e.printStackTrace();
                    onGetSingleSurveyTaskCompleted("");
                }
            }

            @Override
            public void failure(RetrofitError error) {
                onGetSingleSurveyTaskCompleted("");
            }
        });

    }

    public void onGetSingleSurveyTaskCompleted(String surveyJson) {
        progressDialog.dismiss();

        if (!surveyJson.isEmpty())
        {
            chosenSurveyListing.setJson(surveyJson);

            Intent launchSurvey = new Intent(SurveyListActivity.this,
                    SurveyFlowActivity.class);

            launchSurvey.putExtra(SurveyFlowActivity.EXTRA_SURVEY, chosenSurveyListing);
            startActivity(launchSurvey);
        }
        else
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Uh oh...");
            builder.setMessage("There was a problem downloading the survey. Please try again.");
            builder.show();
        }
    }
}
