package edu.weber.housing1000;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import com.google.gson.GsonBuilder;

import java.io.IOException;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PitFragment;
import edu.weber.housing1000.Fragments.ProgressDialogFragment;
import edu.weber.housing1000.Helpers.ErrorHelper;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.Questions.QuestionJSONDeserializer;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

public class PitActivity extends ActionBarActivity {

    private ProgressDialogFragment progressDialogFragment;

    private SurveyListing surveyListing;

    private boolean submittingSurvey;

    public void setSubmittingSurvey(boolean value)
    {
        try
        {
            submittingSurvey = value;
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this,ex.getMessage());
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
                getSupportFragmentManager().beginTransaction()
                        .add(R.id.container, PitFragment.newInstance(this), "PIT")
                        .commit();

                if (Utils.isOnline(this)) {
                    getPitData();
                } else {
                    Utils.showNoInternetDialog(this, true);
                }
            } else {
                surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
            }

            getSupportActionBar().setTitle(getString(R.string.point_in_time));
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        try
        {
            if (surveyListing != null)
                outState.putSerializable("surveyListing", surveyListing);
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this,ex.getMessage());
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        try
        {
            // Dismiss any dialogs to prevent WindowLeaked exceptions
            dismissDialog();
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this,ex.getMessage());
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        return super.onOptionsItemSelected(item);
    }

    public void getPitData()
    {
        try {
            // Start the loading dialog
            showProgressDialog(getString(R.string.please_wait), getString(R.string.downloading_pit), "");

            RestAdapter restAdapter = RESTHelper.setUpRestAdapter(this, new GsonBuilder().excludeFieldsWithoutExposeAnnotation().registerTypeAdapter(Question.class, new QuestionJSONDeserializer()).create());

            SurveyService service = restAdapter.create(SurveyService.class);

            service.getPit(new Callback<Survey>() {
                @Override
                public void success(Survey result, Response response) {
                    try {
                        String json = RESTHelper.convertStreamToString(response.getBody().in());

                        surveyListing = new SurveyListing(result.getSurveyId(), result.getTitle(), json);

                        onGetPitSurveyTaskCompleted(true);
                    } catch (IOException e) {
                        e.printStackTrace();
                        onGetPitSurveyTaskCompleted(false);
                    }
                }

                @Override
                public void failure(RetrofitError error) {
                    onGetPitSurveyTaskCompleted(false);
                }
            });
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public void onGetPitSurveyTaskCompleted(boolean success) {
        try {
            dismissDialog();

            if (success) {
                PitFragment pitFragment = (PitFragment) getSupportFragmentManager().findFragmentByTag("PIT");

                if (!isFinishing() && !isDestroyed()) {
                    pitFragment.loadUI();
                }
            } else {
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle(getString(R.string.uh_oh));
                builder.setMessage(getString(R.string.error_problem_downloading_pit));
                builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
                    @Override
                    public void onCancel(DialogInterface dialog) {
                        PitActivity.this.finish();
                    }
                });
                Utils.centerDialogMessageAndShow(builder);
            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public void onPostSurveyResponsesTaskCompleted(Response response) {
        try {
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

            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public void showProgressDialog(String title, String message, String tag)
    {
        try
        {
            progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
            progressDialogFragment.show(getSupportFragmentManager(), tag);
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }

    public void dismissDialog(){
        try
        {
            if (progressDialogFragment != null) {
                progressDialogFragment.dismiss();
            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
            ErrorHelper.showError(this, ex.getMessage());
        }
    }
}
