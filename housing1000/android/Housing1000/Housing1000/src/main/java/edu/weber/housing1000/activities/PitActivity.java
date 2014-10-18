package edu.weber.housing1000.activities;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.ActivityInfo;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;

import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyService;
import edu.weber.housing1000.SurveyType;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.fragments.PitFragment;
import edu.weber.housing1000.fragments.ProgressDialogFragment;
import edu.weber.housing1000.helpers.ErrorHelper;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.questions.Question;
import edu.weber.housing1000.questions.QuestionJSONDeserializer;
import edu.weber.housing1000.sqllite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PitActivity extends ActionBarActivity {
    private static double latitude = 0;
    private static double longitude = 0;
    private LocationManager locationmanager;
    private LocationListener locationlistener;
    private ProgressDialogFragment progressDialogFragment;

    private SurveyListing surveyListing;

    public static Double getLatitude() {
        return latitude;
    }

    public static Double getLongitude() {
        return longitude;
    }

    public void setSubmittingSurvey(boolean value) {
        try {
            if (value) {
                Utils.lockScreenOrientation(this);
            } else {
                setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public SurveyListing getSurveyListing() {
        return surveyListing;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            setContentView(R.layout.activity_pit);
            Utils.setActionBarColorToDefault(this);

            if (savedInstanceState == null) {
                getSupportFragmentManager().beginTransaction().add(R.id.container, PitFragment.newInstance(this), "PIT").commit();
                getPitData();
            } else {
                surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
            }

            getSupportActionBar().setTitle(getString(R.string.point_in_time));

            //Start Location Listener
            locationmanager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
            locationlistener = new LocationListener() {
                @Override
                public void onLocationChanged(Location location) {
                    latitude = location.getLatitude();
                    longitude = location.getLongitude();

                    Log.d("GPS Location:", latitude + "," + longitude);
                }

                @Override
                public void onStatusChanged(String provider, int status, Bundle extras) {
                }

                @Override
                public void onProviderEnabled(String provider) {
                }

                @Override
                public void onProviderDisabled(String provider) {
                }
            };

            // Get updates within no less than 5 minutes and 1000 meters
            locationmanager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5 * 60 * 1000, 1000, locationlistener);

        } catch (Exception ex) {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (surveyListing != null)
            outState.putSerializable("surveyListing", surveyListing);
    }

    @Override
    protected void onPause() {
        super.onPause();
        // Dismiss any dialogs to prevent WindowLeaked exceptions
        dismissDialog();
        locationmanager.removeUpdates(locationlistener);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        return super.onOptionsItemSelected(item);
    }

    public void getPitData() {

        if (!Utils.isOnline(this)) {

            DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
            String surveyJson = databaseConnector.queryForSavedSurveyJson(SurveyType.PIT_SURVEY, "0");

            if(surveyJson != null) {
                // Start the loading dialog
                showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_pit), "");

                Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().registerTypeAdapter(Question.class, new QuestionJSONDeserializer()).create();
                Survey survey = gson.fromJson(surveyJson, Survey.class);

                new GetSurveyFromDatabaseTask().execute(surveyJson, survey);
            }
            else {
                Utils.showNoInternetDialog(this, true);
            }

            return;
        }


        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_pit), "");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this, getGsonForDeserializingPitSurvey());

        SurveyService service = restAdapter.create(SurveyService.class);

        service.getPit(new Callback<Survey>() {
            @Override
            public void success(Survey result, Response response) {
                try {
                    String json = RESTHelper.convertStreamToString(response.getBody().in());

                    surveyListing = new SurveyListing(result.getSurveyId(), result.getTitle(), json);

                    onGetPitSurveyTaskCompleted(true, json);
                } catch (IOException e) {
                    e.printStackTrace();
                    onGetPitSurveyTaskCompleted(false, null);
                }
            }

            @Override
            public void failure(RetrofitError error) {
                onGetPitSurveyTaskCompleted(false, null);
            }
        });
    }

    public void onGetPitSurveyTaskCompleted(boolean success, String json) {
        try {
            dismissDialog();

            if (success) {

                if(json != null) {
                    DatabaseConnector databaseConnector = new DatabaseConnector(getBaseContext());
                    databaseConnector.updateSurvey(SurveyType.PIT_SURVEY, json, "0");
                }

                PitFragment pitFragment = (PitFragment) getSupportFragmentManager().findFragmentByTag("PIT");

                if (!isFinishing()) {
                    pitFragment.loadUI();
                }
            } else {
                ErrorHelper.showError(this, getString(R.string.error_problem_downloading_pit));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public void onPostSurveyResponsesTaskCompleted(Response response) {
        dismissDialog();

        if (response != null && response.getStatus() == 201) {
            String result = "";

            try {
                if (response.getBody() != null)
                    result = RESTHelper.convertStreamToString(response.getBody().in());
            } catch (IOException e) {
                e.printStackTrace();
            }

            Log.d("PIT RESPONSE", result);

            showSendSuccessMessage();
        } else {
            setSubmittingSurvey(false);

            ErrorHelper.showError(this, getString(R.string.error_problem_submitting_survey));
        }
    }

    public void onSavePitSurveyResponsesToDatabase() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this)
                .setTitle(getString(R.string.success))
                .setMessage(getString(R.string.message_when_survey_saved_to_database))
                .setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        setSubmittingSurvey(false);
                        finish();
                    }
                })
                .setPositiveButton(getString(R.string.okay), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        setSubmittingSurvey(false);
                        finish();
                    }
                });

        Utils.centerDialogMessageAndShow(builder);
    }

    private void showSendSuccessMessage() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this)
                .setTitle(getString(R.string.success))
                .setMessage(getString(R.string.success_pit_response))
                .setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        setSubmittingSurvey(false);
                        finish();
                    }
                })
                .setPositiveButton(getString(R.string.okay), new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        setSubmittingSurvey(false);
                        finish();
                    }
                });

        Utils.centerDialogMessageAndShow(builder);
    }

    private Gson getGsonForDeserializingPitSurvey() {
        return new GsonBuilder().excludeFieldsWithoutExposeAnnotation().registerTypeAdapter(Question.class, new QuestionJSONDeserializer()).create();
    }

    /**
     * For handling when the survey json is retrieved from the database
     */
    private class GetSurveyFromDatabaseTask extends AsyncTask<Object, Object, Object[]> {

        @Override
        protected Object[] doInBackground(Object... params) {
            return params;
        }

        @Override
        protected void onPostExecute(Object... params) {

            String surveyJson = (String)params[0];
            Survey survey = (Survey)params[1];

            surveyListing = new SurveyListing(survey.getSurveyId(), survey.getTitle(), surveyJson);

            onGetPitSurveyTaskCompleted(true, null);
        }
    }

    public void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
    }

    public void dismissDialog() {
        if (progressDialogFragment != null) {
            progressDialogFragment.dismiss();
        }
    }
}
