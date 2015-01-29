package org.ctagroup.homeapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

import org.ctagroup.homeapp.data.DisclaimerResponse;
import org.ctagroup.homeapp.data.DisclaimerSavedInDB;
import org.ctagroup.homeapp.data.ImageSavedInDB;
import org.ctagroup.homeapp.data.SurveySavedInDB;
import org.ctagroup.homeapp.helpers.FileHelper;
import org.ctagroup.homeapp.helpers.RESTHelper;
import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;
import org.ctagroup.homeapp.sqlite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedByteArray;
import retrofit.mime.TypedInput;
import retrofit.mime.TypedOutput;

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
    public static void submitSavedSurveys(final Context context) {

        final DatabaseConnector databaseConnector = new DatabaseConnector(context);
        ArrayList<SurveySavedInDB> jsonSurveysToSubmit = databaseConnector.getJsonToBeSubmitted();

        if (jsonSurveysToSubmit != null && jsonSurveysToSubmit.size() > 0) {

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(context, gson);

            SurveyService service = restAdapter.create(SurveyService.class);

            for (final SurveySavedInDB survey : jsonSurveysToSubmit) {

                //Submit the survey to the endpoint that corresponds to the type
                TypedInput jsonToSubmit = convertStringToTypedInput(survey.getJson());
                switch (survey.getSurveyType()) {
                    case PIT_SURVEY:
                        service.postPit(jsonToSubmit, new Callback<String>() {
                            @Override
                            public void success(String s, Response response) {
                                Log.d("HOUSING1000", "Successfully submitted saved survey");
                                databaseConnector.deleteSubmittedSurvey(survey.getDatabaseId());
                                SharedPreferencesHelper.incrementNumberOfflineSurveysSubmitted(context);
                            }

                            @Override
                            public void failure(RetrofitError error) {
                                Log.d("HOUSING1000", "Un-successfully submitted saved survey...");
                                error.printStackTrace();
                            }
                        });
                        break;
                    case BASIC_SURVEY:
                        service.postResponse(survey.getSurveyId(), jsonToSubmit, new Callback<String>() {
                            @Override
                            public void success(String s, Response response) {
                                Log.d("HOUSING1000", "Successfully submitted saved survey");

                                String result = "";

                                try {
                                    result = RESTHelper.convertStreamToString(response.getBody().in());
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }

                                Log.d("SURVEY RESPONSE", result);

                                String[] split = result.split("=");
                                String clientSurveyId = split[split.length - 1];
                                clientSurveyId = clientSurveyId.replace("\n", "");

                                submitAnyRelatedImages(survey.getDatabaseId(), context, clientSurveyId);
                                submitROIIfThereIsOne(survey.getDatabaseId(), context, clientSurveyId);
                                databaseConnector.deleteSubmittedSurvey(survey.getDatabaseId());
                                SharedPreferencesHelper.incrementNumberOfflineSurveysSubmitted(context);
                            }

                            @Override
                            public void failure(RetrofitError error) {
                                Log.d("HOUSING1000", "Un-successfully submitted saved survey...");
                                error.printStackTrace();
                            }
                        });
                        break;
                }
            }
        }
    }

    /**
     * Submits the ROI that relates to this survey
     * @param surveyDataId The ID of the survey this relates to
     * @param context The current context
     */
    private static void submitROIIfThereIsOne(int surveyDataId, final Context context, String clientSurveyId) {
        final DatabaseConnector databaseConnector = new DatabaseConnector(context);
        final DisclaimerSavedInDB disclaimer = databaseConnector.getDisclaimerToSubmit(surveyDataId);

        if(disclaimer != null) {
            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(context, null);
            SurveyService service = restAdapter.create(SurveyService.class);

            DisclaimerResponse disclaimerResponse = disclaimer.getDisclaimer();
            disclaimerResponse.clientSurveyId = Long.parseLong(clientSurveyId);
            service.postDisclaimerData(disclaimer.getDisclaimer(), new Callback<String>() {
                @Override
                public void success(String s, Response response) {
                    Log.d("HOUSING1000", "Successfully submitted saved disclaimer");
                    databaseConnector.deleteSubmittedDisclaimer(disclaimer.getDatabaseId());
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d("HOUSING1000", "Un-successfully submitted saved disclaimer...");
                    error.printStackTrace();
                }
            });
        }
    }

    /**
     * For a given survey, upload all of the saved images
     * @param surveyDataId The survey data Id that all of the images are related to
     * @param context The current context
     * @param clientSurveyId This id is returned back when posting the survey answers. The API requires that the image names be appended with this id.
     */
    private static void submitAnyRelatedImages(int surveyDataId, final Context context, String clientSurveyId) {
        DatabaseConnector databaseConnector = new DatabaseConnector(context);
        ArrayList<ImageSavedInDB> imagesToSubmit = databaseConnector.getImagePathsToSubmit(surveyDataId);

        if(imagesToSubmit.size() > 0) {

            //Extract the database IDs and paths for the images to submit
            final ArrayList<String> imagePaths = new ArrayList<>();
            final ArrayList<Integer> imageDataIds = new ArrayList<>();
            for (ImageSavedInDB imageSavedInDB : imagesToSubmit) {
                imageDataIds.add(imageSavedInDB.getImageDataId());
                imagePaths.add(imageSavedInDB.getPath());
            }

            //This will be the same for all images and is the sub-directory where they are on the phone
            final String folderHash = imagesToSubmit.get(0).getFolderHash();

            MultipartTypedOutput multipartTypedOutput = new MultipartTypedOutput();

            for (TypedOutput image : RESTHelper.generateTypedOutputFromImages(imagePaths, clientSurveyId)) {
                multipartTypedOutput.addPart(image.fileName(), image);
            }

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(context, null);

            SurveyService service = restAdapter.create(SurveyService.class);

            service.postImage(multipartTypedOutput, new Callback<String>() {
                @Override
                public void success(String s, Response response) {

                    onPostImagesTaskCompleted(response, folderHash, context);

                    DatabaseConnector databaseConnector = new DatabaseConnector(context);
                    databaseConnector.deleteSubmittedImages(imageDataIds);
                }

                @Override
                public void failure(RetrofitError error) {
                    Log.d("HOUSING1000", "Un-successfully submitted saved images...");
                    error.printStackTrace();

                    String errorBody = (String) error.getBodyAs(String.class);

                    if (errorBody != null) {
                        Log.e("FAILURE", errorBody);
                    }

                    onPostImagesTaskCompleted(error.getResponse(), folderHash, context);
                }
            });
        }
        else {
            Log.d("HOUSING1000", "No images to submit.");
        }
    }

    private static void onPostImagesTaskCompleted(Response response, String folderHash, Context context) {

        if (response != null && response.getStatus() == 200) {
            try {
                if (response.getBody() != null)
                    Log.d("SIGNATURE RESPONSE", RESTHelper.convertStreamToString(response.getBody().in()));
                    Log.d("HOUSING1000", "Successfully submitted saved images");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            if(response != null) {
                Log.d("HOUSING1000", "Un-successfully submitted saved images... The status returned was " + response.getStatus());
            }
        }

        //Delete all of the image files in this folder (which should be all of the images for this survey)
        File surveyDir = new File(FileHelper.getAbsoluteFilePath(folderHash, "", context));
        if (surveyDir.exists()) {
            Log.d("DELETING SURVEY DIR", surveyDir.getAbsolutePath());
            FileHelper.deleteAllFiles(surveyDir);
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

