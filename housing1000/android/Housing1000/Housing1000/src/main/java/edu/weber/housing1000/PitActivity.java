package edu.weber.housing1000;

import android.app.AlertDialog;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.google.gson.GsonBuilder;

import java.io.IOException;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Fragments.PitFragment;
import edu.weber.housing1000.Fragments.ProgressDialogFragment;
import edu.weber.housing1000.Fragments.SurveyFragment;
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
        submittingSurvey = value;
    }

    public SurveyListing getSurveyListing() {
        return surveyListing;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pit);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.container, new PitFragment("PIT", "Point in Time"), "PIT")
                    .commit();
            getPitData();
        }
        else
        {
            surveyListing = (SurveyListing) savedInstanceState.getSerializable("surveyListing");
        }

    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        if (surveyListing != null)
            outState.putSerializable("surveyListing", surveyListing);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {

        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
//        switch (item.getItemId())
//        {
//            case R.id.menu_fragment_survey:
//                getPitData();
//                return true;
//            default:
//                break;
//        }

        return super.onOptionsItemSelected(item);
    }

    public void getPitData()
    {
        // Start the loading dialog
        showProgressDialog("Please Wait", "Downloading PIT survey...", "");

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
    }

    public void onGetPitSurveyTaskCompleted(boolean success) {
        dismissDialog();

        if (success)
        {
            PitFragment pitFragment = (PitFragment) getSupportFragmentManager().findFragmentByTag("PIT");
            pitFragment.loadUI();
        }
        else
        {
            AlertDialog.Builder builder = new AlertDialog.Builder(this);
            builder.setTitle("Uh oh...");
            builder.setMessage("There was a problem downloading the PIT survey. Please try again.");
            builder.show();

            finish();
        }
    }

    public void onPostSurveyResponsesTaskCompleted(String result) {
        dismissDialog();




    }

    public void showProgressDialog(String title, String message, String tag)
    {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(getSupportFragmentManager(), tag);
    }

    public void dismissDialog(){
        if (progressDialogFragment != null) {
            progressDialogFragment.dismiss();
        }
    }
}
