package edu.weber.housing1000.sqlite;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import edu.weber.housing1000.SurveyType;
import edu.weber.housing1000.data.DisclaimerResponse;
import edu.weber.housing1000.data.DisclaimerSavedInDB;
import edu.weber.housing1000.data.ImageSavedInDB;
import edu.weber.housing1000.data.SurveySavedInDB;

/**
 *
 * Setup the database that holds submitted surveys when there is no internet connection
 * and the retrieved surveys where there is an internet connection.
 *
 * @author David Horton
 */
public class DatabaseConnector {

    private DatabaseOpenHelper databaseOpenHelper;
    private static final String DATABASE_NAME = "Surveys";
    private SQLiteDatabase database;


    public DatabaseConnector(Context context) {
        databaseOpenHelper = new DatabaseOpenHelper(context, DATABASE_NAME, null, 1);
    }

    /**
     * Open the database connection
     */
    public void open() {
        database = databaseOpenHelper.getWritableDatabase();
    }

    /**
     * Close the database connection
     */
    public void close() {
        if(database != null) {
            database.close();
        }
    }

    /**
     * For the given survey, either add it if it isn't in the database or overwrite what is there
     * @param surveyType The type of survey to update
     * @param json The json representation of the survey
     * @param surveyId The id of the survey. For some surveys (like PIT) where this is not applicable it should be set to 0.
     */
    public void updateSurvey(SurveyType surveyType, String json, String surveyId) {

        ContentValues updateSurvey = new ContentValues();
        updateSurvey.put("Type", surveyType.toString());
        updateSurvey.put("Json", json);
        updateSurvey.put("SurveyId", surveyId);
        updateSurvey.put("DateUpdated", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));

        open();
        Cursor results = database.query("RetrievedSurveys", null, "Type = '" + surveyType.toString() + "' and SurveyId = '" + surveyId + "'", null, null, null, null);

        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one retrieved survey in the database of type " + surveyType.toString() + " with an ID of " + surveyId);
            database.update("RetrievedSurveys", updateSurvey, "Type = '" + surveyType.toString() + "' and SurveyId = '" + surveyId + "'", null);
        }
        else if(results.getCount() == 0) {
            Log.d("HOUSING1000", "There are no surveys in the database of type " + surveyType.toString() + " with an ID of " + surveyId);
            database.insert("RetrievedSurveys", null, updateSurvey);
        }
        else {
            close();
            throw new IllegalArgumentException("There is more than one survey in the RetrievedSurveys database of type " + surveyType.toString()
                    + " with an ID of " + surveyId + ". There should only be one or none, but there were " + results.getCount());
        }
        close();
    }

    /**
     * Retrieves stored Json for the given survey type
     * @param surveyType The type of survey to try and retrieve
     * @param surveyId The id of the survey. For some surveys (like PIT) where this is not applicable it should be set to 0.
     * @return The json representation of the survey
     */
    public String queryForSavedSurveyJson(SurveyType surveyType, String surveyId) {
        open();
        Cursor results = database.query("RetrievedSurveys", null, "Type = '" + surveyType.toString() + "' and SurveyId = '" + surveyId + "'", null, null, null, null);

        String jsonToReturn = null;
        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one retrieved survey in the database of type " + surveyType.toString()  + " with an ID of " + surveyId);
            if(results.moveToFirst()) {
                results.moveToFirst();
                jsonToReturn = results.getString(3);
            }
        }
        else if(results.getCount() == 0) {
            Log.d("HOUSING1000", "There are no surveys in the database of type " + surveyType.toString() + " with an ID of " + surveyId);
        }
        else {
            close();
            throw new IllegalArgumentException("There is more than one survey in the RetrievedSurveys database of type " + surveyType.toString()
                    + " with an ID of " + surveyId + ". There should only be one or none, but there were " + results.getCount());
        }
        close();
        return jsonToReturn;
    }

    /**
     * This gets called when a survey gets submitted and there is no internet connection
     * @param json The json to store
     * @param surveyType The type of the json being stored
     * @param surveyId The id of the survey. For some surveys (like PIT) where this is not applicable it should be set to 0.
     * @return The database id of the newly added survey
     */
    public long saveSurveyToSubmitLater(String json, SurveyType surveyType, String surveyId) {
        ContentValues addSurvey = new ContentValues();
        addSurvey.put("Type", surveyType.toString());
        addSurvey.put("Json", json);
        addSurvey.put("SurveyId", surveyId);

        Log.d("HOUSING1000", "Saving a survey of type " + surveyType.toString() + " with ID of " + surveyId
                + " to be submitted when the internet comes back.");
        open();
        long surveyDataId = database.insert("SubmittedJson", null, addSurvey);
        close();

        return surveyDataId;
    }

    /**
     * Save the paths of all of the image paths relating to a specific survey
     * @param isSignature Whether these images are signatures or not
     * @param folderHash The sub-directory where the image is saved on the phone (saved to make it easier to delete later)
     * @param surveyDataId The related survey database Id
     * @param paths The paths to submit
     */
    public void saveSubmittedImagePaths(boolean isSignature, String folderHash, long surveyDataId, String... paths) {
        if(paths.length > 0) {
            open();
            ContentValues addImage = new ContentValues();
            addImage.put("SurveyJsonId", surveyDataId);
            addImage.put("IsSignature", isSignature ? "Y" : "N");
            addImage.put("FolderHash", folderHash);

            for (String path : paths) {
                addImage.put("Path", path);
                database.insert("SubmittedImages", null, addImage);
            }
            close();
        }
    }

    /**
     * Save disclaimer, or ROI, information that relates to a specified survey
     * @param disclaimerResponse The disclaimer
     * @param surveyDataId The related survey database Id
     */
    public void saveSubmittedDisclaimer(DisclaimerResponse disclaimerResponse, long surveyDataId) {
        ContentValues addDisclaimer = new ContentValues();
        addDisclaimer.put("ClientSurveyId", disclaimerResponse.clientSurveyId);
        addDisclaimer.put("EnteredById", disclaimerResponse.enteredById);
        addDisclaimer.put("Name", disclaimerResponse.name);
        addDisclaimer.put("Date", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(disclaimerResponse.date));
        addDisclaimer.put("SurveyJsonId", surveyDataId);

        open();
        database.insert("SubmittedDisclaimers", null, addDisclaimer);
        close();
    }

    /**
     * Retrieve disclaimer, or ROI, information that relates to a specified survey
     * @param surveyDataId The related survey database Id
     * @return The disclaimer
     */
    public DisclaimerSavedInDB getDisclaimerToSubmit(int surveyDataId) {
        open();
        Cursor results = database.query("SubmittedDisclaimers", null, "SurveyJsonId = " + surveyDataId, null, null, null, null);

        DisclaimerSavedInDB disclaimer = null;
        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one disclaimer saved for survey " + surveyDataId);
            if(results.moveToFirst()) {
                results.moveToFirst();

                Date date;
                try {
                    date = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(results.getString(4));
                }
                catch(ParseException e) {
                    throw new RuntimeException("Unable to format date signed of disclaimer from DB.", e);
                }

                DisclaimerResponse disclaimerResponse = new DisclaimerResponse(results.getInt(1), results.getInt(2), results.getString(3), date);
                disclaimer = new DisclaimerSavedInDB(disclaimerResponse, results.getInt(0));
            }
        }
        else if(results.getCount() == 0) {
            Log.d("HOUSING1000", "There are no disclaimers saved for survey " + surveyDataId);
        }
        else {
            close();
            throw new IllegalArgumentException("There is more than one disclaimer saved for survey " + surveyDataId + ". There should only " +
                    "be one or none, but there were " + results.getCount());
        }
        close();

        return disclaimer;
    }

    /**
     * Deletes a disclaimer from the DB
     * @param id The ID of the disclaimer to delete
     */
    public void deleteSubmittedDisclaimer(int id) {
        open();
        database.delete("SubmittedDisclaimers", "Id = " + id, null);
        close();
        Log.d("HOUSING1000", "Deleted disclaimer with database Id #" + id);
    }

    /**
     * Get the paths of all images relating to a specific survey
     * @param surveyDataId The related survey database Id
     * @return The images tied to the survey
     */
    public ArrayList<ImageSavedInDB> getImagePathsToSubmit(int surveyDataId) {
        open();
        Cursor results = database.query("SubmittedImages", null, "SurveyJsonId = " + surveyDataId, null, null, null, null);
        Log.d("HOUSING1000", "Number of images relating to survey with id " + surveyDataId + ": " + results.getCount());

        ArrayList<ImageSavedInDB> images = new ArrayList<>();
        while(results.moveToNext()) {
            String isSignature = results.getString(3);
            images.add(new ImageSavedInDB(results.getString(1), isSignature.equals("Y"), results.getInt(0), results.getString(4)));
        }
        close();

        return images;
    }

    /**
     * For the given image id, delete it from the SubmittedImages table
     * @param imageDataIds A collection of the database IDs of the images to delete
     */
    public void deleteSubmittedImages(ArrayList<Integer> imageDataIds) {
        open();
        for(Integer id : imageDataIds) {
            database.delete("SubmittedImages", "Id = " + id, null);
            Log.d("HOUSING1000", "Deleted image with database Id #" + id);
        }
        close();
    }


    /**
     * For getting all of the surveys that need to be submitted
     * @return A collection of SurveySavedInDB to be submitted
     */
    public ArrayList<SurveySavedInDB> getJsonToBeSubmitted() {
        open();
        Cursor results = database.query("SubmittedJson", null, null, null, null, null, null);
        Log.d("HOUSING1000", "Number of surveys to be submitted: " + results.getCount());

        ArrayList<SurveySavedInDB> surveys = new ArrayList<>();
        while (results.moveToNext()) {
            surveys.add(new SurveySavedInDB(SurveyType.getTypeFromString(results.getString(2)), results.getString(1), results.getInt(0), results.getString(3)));
        }
        close();

        return surveys;
    }

    /**
     * For the given survey id, delete it from the SubmittedJson table
     * @param id The database ID of the survey to delete
     */
    public void deleteSubmittedSurvey(int id) {
        open();
        database.delete("SubmittedJson", "Id = " + id, null);
        close();
        Log.d("HOUSING1000", "Deleted survey with database Id #" + id);
    }

    /**
     * For creating the database
     */
    private class DatabaseOpenHelper extends SQLiteOpenHelper {

        public DatabaseOpenHelper(Context context, String name, CursorFactory factory, int version) {
            super(context, name, factory, version);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            //Create the RetrievedSurveys table
            String createRetrievedSQL = "CREATE TABLE RetrievedSurveys(Id INTEGER primary key autoincrement, Type TEXT, " +
                    "DateUpdated DATETIME DEFAULT CURRENT_TIMESTAMP, Json TEXT, SurveyId TEXT)";
            db.execSQL(createRetrievedSQL);

            //Create the SubmittedJson table
            String createSubmittedSQL = "CREATE TABLE SubmittedJson(Id INTEGER primary key autoincrement, Json TEXT, Type TEXT, " +
                    "SurveyId TEXT)";
            db.execSQL(createSubmittedSQL);

            //Create the SubmittedImages table
            String createImagesSQL = "CREATE TABLE SubmittedImages(Id INTEGER primary key autoincrement, Path TEXT, SurveyJsonId INTEGER, " +
                    "IsSignature TEXT, FolderHash TEXT, DateUpdated DATETIME DEFAULT CURRENT_TIMESTAMP)";
            db.execSQL(createImagesSQL);

            //Create the SubmittedDisclaimers table
            String createDisclaimersSQL = "CREATE TABLE SubmittedDisclaimers(Id INTEGER primary key autoincrement, ClientSurveyId INTEGER, EnteredById INTEGER, " +
                    "Name TEXT, Date DATETIME, SurveyJsonId INTEGER)";
            db.execSQL(createDisclaimersSQL);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            db.execSQL("DROP TABLE IF EXISTS RetrievedSurveys");
            db.execSQL("DROP TABLE IF EXISTS SubmittedJson");
            db.execSQL("DROP TABLE IF EXISTS SubmittedImages");
            onCreate(db);
        }
    }
}
