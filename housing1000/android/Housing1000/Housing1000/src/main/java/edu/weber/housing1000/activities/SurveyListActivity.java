package edu.weber.housing1000.activities;

import android.app.AlertDialog;
import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import com.google.gson.Gson;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;

import edu.weber.housing1000.SurveyType;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.fragments.ProgressDialogFragment;
import edu.weber.housing1000.fragments.SurveyListFragment;
import edu.weber.housing1000.fragments.SurveyListFragment.*;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyService;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.sqlite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class SurveyListActivity extends ActionBarActivity implements ISurveyListFragment {

    private ProgressDialogFragment progressDialogFragment;

    private ListView surveysListView;
    private ArrayList<SurveyListing> surveyListings;

    private SurveyListing chosenSurveyListing;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey_list);
        Utils.setActionBarColorToDefault(this);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.container, new SurveyListFragment(), "SurveyListFragment")
                    .commit();
        } else {
            surveyListings = savedInstanceState.getParcelableArrayList("surveyListings");

            progressDialogFragment = (ProgressDialogFragment) getSupportFragmentManager().findFragmentByTag("Dialog");
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        // Dismiss any dialogs to prevent WindowLeaked exceptions
        dismissDialog();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putParcelableArrayList("surveyListings", surveyListings);
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

    public void getSurveyList() {
        if (surveysListView != null)
            surveysListView.setAdapter(null);

        if (!Utils.isOnline(this)) {

            DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
            String surveyJson = databaseConnector.queryForSavedSurveyJson(SurveyType.SURVEY_LISTING, "0");

            if(surveyJson != null) {
                Gson gson = new Gson();
                ArrayList<SurveyListing> surveys = new ArrayList<>(Arrays.asList(gson.fromJson(surveyJson, SurveyListing[].class)));
                onGetSurveyListingsTaskCompleted(surveys, null);
            }
            else {
                Utils.showNoInternetDialog(this, true);
            }

            return;
        }

        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_surveys_list), "Dialog");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.listSurveys(new Callback<ArrayList<SurveyListing>>() {
            @Override
            public void success(ArrayList<SurveyListing> surveyListings, Response response) {
                try {
                    String json = RESTHelper.convertStreamToString(response.getBody().in());
                    onGetSurveyListingsTaskCompleted(surveyListings, json);
                } catch (IOException e) {
                    e.printStackTrace();
                    onGetSurveyListingsTaskCompleted(null, null);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                onGetSurveyListingsTaskCompleted(null, null);
            }
        });
    }

    public void onGetSurveyListingsTaskCompleted(ArrayList<SurveyListing> surveyListings, String json) {
        dismissDialog();

        SurveyListFragment fragment = (SurveyListFragment) this.getSupportFragmentManager().findFragmentByTag("SurveyListFragment");

        this.surveyListings = surveyListings;

        if (surveyListings != null && surveyListings.size() > 0) {

            if(json != null) {
                DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
                databaseConnector.updateSurvey(SurveyType.SURVEY_LISTING, json, "0"); //The "survey listing" survey doesn't have a survey id, so we just always set it to null
            }

            ArrayAdapter<SurveyListing> surveyAdapter = new ArrayAdapter<>(
                    SurveyListActivity.this,
                    android.R.layout.simple_list_item_1,
                    surveyListings);

            surveysListView.setAdapter(surveyAdapter);
            if (fragment != null)
                fragment.showNoSurveys(false);
        } else {
            if (fragment != null)
                fragment.showNoSurveys(true);
        }
    }

    @Override
    public void setListView(ListView listView) {
        surveysListView = listView;

        surveysListView.setOnItemClickListener(surveyClickListener);

        if (surveyListings != null && !surveyListings.isEmpty())
            onGetSurveyListingsTaskCompleted(surveyListings, null);
        else
            getSurveyList();
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

    private void loadSurvey(final long rowId) {

        if (!Utils.isOnline(this)) {

            DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
            String surveyJson = databaseConnector.queryForSavedSurveyJson(SurveyType.BASIC_SURVEY, Long.toString(rowId));

            if(surveyJson != null) {
                // Start the loading dialog
                showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_survey), "Dialog");

                new GetSurveyFromDatabaseTask().execute(surveyJson, Long.toString(rowId));
            }
            else {
                Utils.showNoInternetDialog(this, false);
            }

            return;
        }


        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_survey), "Dialog");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(this, null);

        SurveyService service = restAdapter.create(SurveyService.class);

        service.getSurvey(String.valueOf(rowId), new Callback<String>() {
            @Override
            public void success(String result, Response response) {
                try {
                    String json = RESTHelper.convertStreamToString(response.getBody().in());
                    onGetSingleSurveyTaskCompleted(json, Long.toString(rowId), false);
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
        onGetSingleSurveyTaskCompleted(surveyJson, null, true);
    }

    public void onGetSingleSurveyTaskCompleted(String surveyJson, String surveyId, boolean skipDatabaseUpdate) {
        // If user hits back, loading will not happen
        if (dismissDialog()) {

            if (!surveyJson.isEmpty()) {

                if(!skipDatabaseUpdate) {
                    DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
                    databaseConnector.updateSurvey(SurveyType.BASIC_SURVEY, surveyJson, surveyId);
                }

                chosenSurveyListing.setJson(surveyJson);

                Intent launchSurvey = new Intent(SurveyListActivity.this,
                        SurveyFlowActivity.class);

                launchSurvey.putExtra(SurveyFlowActivity.EXTRA_SURVEY, (Serializable) chosenSurveyListing);
                startActivity(launchSurvey);
            } else {
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle(getString(R.string.uh_oh));
                builder.setMessage(getString(R.string.error_problem_downloading_survey));
                Utils.centerDialogMessageAndShow(builder);
            }
        }
    }

    /**
     * For handling when the survey json is retrieved from the database
     */
    private class GetSurveyFromDatabaseTask extends AsyncTask<String, Object, String[]> {

        @Override
        protected String[] doInBackground(String... params) {
            return params;
        }

        @Override
        protected void onPostExecute(String... params) {
            onGetSingleSurveyTaskCompleted(params[0], params[1], true);
        }
    }

    public void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
    }

    public boolean dismissDialog(){
        if (progressDialogFragment != null && progressDialogFragment.isAdded()) {
            progressDialogFragment.dismiss();
            progressDialogFragment = null;
            return true;
        }

        return false;
    }
}
