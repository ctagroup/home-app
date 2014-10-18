package edu.weber.housing1000.sqllite;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.util.Log;

import java.util.ArrayList;

import edu.weber.housing1000.SurveyType;
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
     */
    public void updateSurvey(SurveyType surveyType, String json, String surveyId) {

        ContentValues updateSurvey = new ContentValues();
        updateSurvey.put("Type", surveyType.toString());
        updateSurvey.put("Json", json);
        updateSurvey.put("SurveyId", surveyId);

        open();
        Cursor results = database.query("RetrievedSurveys", null, "Type = '" + surveyType.toString() + "' and SurveyId = '" + surveyId + "'", null, null, null, null);

        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one retrieved survey in the database of type " + surveyType.toString() + " with an ID of " + surveyId);
            database.update("RetrievedSurveys", updateSurvey, "Type = '" + surveyType.toString() + "'", null);
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
     */
    public void saveSurveyToSubmitLater(String json, SurveyType surveyType, String surveyId) {
        ContentValues addSurvey = new ContentValues();
        addSurvey.put("Type", surveyType.toString());
        addSurvey.put("Json", json);
        addSurvey.put("SurveyId", surveyId);

        Log.d("HOUSING1000", "Saving a survey of type " + surveyType.toString() + " with ID of " + surveyId
                + " to be submitted when the internet comes back.");
        open();
        database.insert("SubmittedJson", null, addSurvey);
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
            String createRetrievedQuery = "CREATE TABLE RetrievedSurveys(Id INTEGER primary key autoincrement, Type TEXT, " +
                    "DateUpdated DATETIME DEFAULT CURRENT_TIMESTAMP, Json TEXT, SurveyId TEXT)";
            db.execSQL(createRetrievedQuery);

            String createSubmittedQuery = "CREATE TABLE SubmittedJson(Id INTEGER primary key autoincrement, Json TEXT, Type TEXT, " +
                    "SurveyId TEXT)";
            db.execSQL(createSubmittedQuery);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            db.execSQL("DROP TABLE IF EXISTS RetrievedSurveys");
            db.execSQL("DROP TABLE IF EXISTS SubmittedJson");
            onCreate(db);
        }
    }
}
