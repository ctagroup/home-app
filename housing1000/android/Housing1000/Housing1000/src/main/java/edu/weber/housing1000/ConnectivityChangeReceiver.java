package edu.weber.housing1000;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import edu.weber.housing1000.data.SurveySavedInDB;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.sqllite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.TypedByteArray;
import retrofit.mime.TypedInput;

/**
 * This is used for submitting un-submitted surveys when internet connectivity returns
 * @author David Horton
 */
public class ConnectivityChangeReceiver extends BroadcastReceiver {

    private static boolean firstTimeCalledAfterConnected = true;

    @Override
    public void onReceive(Context context, Intent intent) {
        //debugIntent(intent, "HOUSING1000");

        /* If it's online now but it wasn't, we want to check to see if there are any un-submitted surveys we need to process
         * We also check to see if this is the first time it is called after being connected because some phones call this
         * broadcast multiple times (which would mean multiple submissions).
         */
        if(Utils.isOnline(context)) {
            if(firstTimeCalledAfterConnected) {
                firstTimeCalledAfterConnected = false;

                submitSavedSurveys(context);
            }
        }
        else {
            firstTimeCalledAfterConnected = true;
        }
    }

    /**
     * Submits all surveys in the database that have been saved for submission
     * @param context The current context
     */
    public static void submitSavedSurveys(Context context) {

        final DatabaseConnector databaseConnector = new DatabaseConnector(context);
        ArrayList<SurveySavedInDB> jsonSurveysToSubmit = databaseConnector.getJsonToBeSubmitted();

        if (jsonSurveysToSubmit != null && jsonSurveysToSubmit.size() > 0) {

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(context, gson);

            SurveyService service = restAdapter.create(SurveyService.class);

            for (final SurveySavedInDB survey : jsonSurveysToSubmit) {

                //The callback for when the survey is posted
                Callback<String> callback = new Callback<String>() {
                    @Override
                    public void success(String s, Response response) {
                        Log.d("HOUSING1000", "Successfully submitted saved survey");
                        databaseConnector.deleteSubmittedSurvey(survey.getDatabaseId());
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        Log.d("HOUSING1000", "Un-successfully submitted saved survey...");
                        error.printStackTrace();
                    }
                };

                //Submit the survey to the endpoint that corresponds to the type
                TypedInput jsonToSubmit = convertStringToTypedInput(survey.getJson());
                switch (survey.getSurveyType()) {
                    case PIT_SURVEY:
                        service.postPit(jsonToSubmit, callback);
                        break;
                    case BASIC_SURVEY:
                        service.postResponse(survey.getSurveyId(), jsonToSubmit, callback);
                }
            }
        }
    }

    /**
     * To convert a string to TypedInput
     * @param s The string to convert
     * @return The converted string
     */
    private static TypedInput convertStringToTypedInput(String s) {
        try {
            return new TypedByteArray("application/json", s.getBytes("UTF-8"));
        }
        catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * For debugging the intent passed into onReceive. Its usage may or may not be commented out up above.
     * @param intent The intent to debug
     * @param tag The tag for the logging
     */
    private void debugIntent(Intent intent, String tag) {
        Log.v(tag, "action: " + intent.getAction());
        Log.v(tag, "component: " + intent.getComponent());
        Bundle extras = intent.getExtras();
        if (extras != null) {
            for (String key : extras.keySet()) {
                Log.v(tag, "key [" + key + "]: " +
                        extras.get(key));
            }
        } else {
            Log.v(tag, "no extras");
        }
    }

}

