package edu.weber.housing1000;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.os.AsyncTask;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.CursorAdapter;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;

import edu.weber.housing1000.Helpers.RESTHelper;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.db.DatabaseConnector;

public class SelectPageActivity extends Activity implements RESTHelper.OnUrlTaskCompleted {
    private static final int TASK_GET_SURVEY_LIST = 1;
    private static final int TASK_GET_SURVEY = 2;

    private ProgressDialog progressDialog;

    private ArrayList<SurveyListing> surveyListings;
    private long chosenSurveyId;

    private CursorAdapter surveyAdapter;
    private ListView surveyList;
    private Dialog surveyDialog;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.select_page);

        // Set up the adapter and ListView for the survey selection
        //String[] from = new String[] { "_id", "title" };
        String[] from = new String[] { "title" };
        int[] to = new int[] { R.id.surveyTextView };
        surveyAdapter = new SimpleCursorAdapter(SelectPageActivity.this,
                R.layout.survey_list_item, null, from, to,
                CursorAdapter.NO_SELECTION);
        surveyList = new ListView(this);
        surveyList.setAdapter(surveyAdapter);
        surveyList.setOnItemClickListener(surveyClickListener);

        //Get the Buttons
        Button clientButton = (Button) findViewById(R.id.censusBtn);
        Button interviewButton = (Button) findViewById(R.id.surveyBtn);
        Button dynamicButton = (Button) findViewById(R.id.dynamic_button);
        Button dynamicWithApiButton = (Button) findViewById(R.id.dynamicWithApiButton);

        dynamicButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, ClientInfoActivity_Dynamic.class);
                startActivity(intent);
            }
        });

        clientButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, CensusActivity.class);
                startActivity(intent);
            }
        });

        interviewButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                Intent intent = new Intent(SelectPageActivity.this, LegalDisclaimerActivity.class);
                startActivity(intent);
            }
        });

        dynamicWithApiButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                getSurveyList();
            }
        });

    }

    @SuppressWarnings("unchecked")
    private void getSurveyList()
    {
        // Start the loading dialog
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Please Wait");
        progressDialog.setMessage("Downloading survey list...");
        progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        progressDialog.setIndeterminate(true);
        progressDialog.setCancelable(true);
        progressDialog.show();

        // Set up the UrlTask
        final RESTHelper.UrlTask urlTask = new RESTHelper.UrlTask(this, this, TASK_GET_SURVEY_LIST);

        HashMap<String, String> properties = new HashMap<String, String>();
        properties.put(RESTHelper.ACTION_TYPE, RESTHelper.GET);
        properties.put(RESTHelper.URL, "https://staging.ctagroup.org/Survey/api/survey/");

        urlTask.execute(properties);

        progressDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                urlTask.cancel(true);
            }
        });
    }

    /**
     * Called when a RESTHelper.UrlTask is completed
     * @param result Result from the task
     */
    @Override
    public void onUrlTaskCompleted(HashMap<String, String> result) {
        String taskResult = result.get(RESTHelper.RESULT);

        switch(Integer.parseInt(result.get(RESTHelper.TASK_CODE)))
        {
            case TASK_GET_SURVEY_LIST:
                if (taskResult.length() > 0 && !taskResult.startsWith("ERROR: "))
                {
                    surveyListings = JSONParser.parseSurveyList(taskResult);
                    if (surveyListings.size() == 0)
                    {
                        AlertDialog.Builder builder = new AlertDialog.Builder(this);
                        builder.setTitle("No Surveys...");
                        builder.setMessage("It appears that there are no surveys yet.");
                        builder.show();
                    }
                    else
                    {
                        Toast.makeText(SelectPageActivity.this, surveyListings.size() + " surveys found.", Toast.LENGTH_SHORT).show();

                        DatabaseConnector dbConnector = new DatabaseConnector(this);
                        dbConnector.clearSurveys();

                        for (SurveyListing survey : surveyListings)
                        {
                            dbConnector.insertSurvey(survey);
                        }

                        new GetAllSurveysTask().execute((Object[]) null);
                    }
                }
                else
                {
                    progressDialog.dismiss();

                    AlertDialog.Builder builder = new AlertDialog.Builder(this);
                    builder.setTitle("Uh oh...");
                    builder.setMessage("There was a problem downloading the surveys.\n\nMessage:\n" + taskResult);
                    builder.show();
                }
                break;
            case TASK_GET_SURVEY:

                for (SurveyListing survey : surveyListings)
                {
                    if (survey.getId() == chosenSurveyId)
                    {
                        DatabaseConnector dbConnector = new DatabaseConnector(this);

                        survey.setQuestions(taskResult);
                        dbConnector.updateSurvey(survey);

                        progressDialog.dismiss();

                        launchSurveyActivity(survey);

                        break;
                    }
                }

                break;
            default:
                break;
        }
    }

    /**
     * Displays a dialog with the list of surveys
     */
    private void displaySurveyList()
    {
        if (surveyDialog == null)
        {
            AlertDialog.Builder surveyBuilder = new AlertDialog.Builder(this);
            surveyBuilder.setTitle("Select Survey");
            surveyBuilder.setView(surveyList);

            surveyDialog = surveyBuilder.create();
        }

        surveyDialog.show();
    }

    /**
     * Performs a database query outside of the GUI thread
     */
    private class GetAllSurveysTask extends AsyncTask<Object, Object, Cursor> {
        final DatabaseConnector databaseConnector = new DatabaseConnector(
                SelectPageActivity.this);

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            databaseConnector.open();
        }

        // perform the database access
        @Override
        protected Cursor doInBackground(Object... params) {
            // get a cursor containing all surveys
            return databaseConnector.getAllSurveys();
        } // end method doInBackground

        // use the Cursor returned from the doInBackground method
        @Override
        protected void onPostExecute(Cursor result) {
            progressDialog.dismiss();
            displaySurveyList();

            surveyAdapter.changeCursor(result); // set the adapter's Cursor

            //databaseConnector.close();
        } // end method onPostExecute
    } // end class GetContactsTask

    /**
     * Handles the survey click events
     */
    private final AdapterView.OnItemClickListener surveyClickListener = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
                                long arg3) {

            chosenSurveyId = arg3;

            surveyDialog.dismiss();

            loadSurvey(chosenSurveyId);

        } // end method onItemClick
    }; // end viewContactListener

    @SuppressWarnings("unchecked")
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

        // Set up the UrlTask
        final RESTHelper.UrlTask urlTask = new RESTHelper.UrlTask(this, this, TASK_GET_SURVEY);

        HashMap<String, String> properties = new HashMap<String, String>();
        properties.put(RESTHelper.ACTION_TYPE, RESTHelper.GET);
        properties.put(RESTHelper.URL, "https://staging.ctagroup.org/Survey/api/survey/" + String.valueOf(rowId));

        urlTask.execute(properties);

        progressDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                urlTask.cancel(true);
            }
        });
    }

    private void launchSurveyActivity(SurveyListing survey)
    {
        Intent launchSurvey = new Intent(SelectPageActivity.this,
                ClientInfoActivity_Dynamic_Api.class);

        // Pass the selected survey row ID as an extra with the Intent
        launchSurvey.putExtra(ClientInfoActivity_Dynamic_Api.EXTRA_SURVEY, survey);
        startActivity(launchSurvey); // start the ViewContact Activity
    }

}

