package edu.weber.housing1000.sqllite;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.util.Log;

import edu.weber.housing1000.SurveyType;

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
    public void updateSurvey(SurveyType surveyType, String json) {

        ContentValues updateSurvey = new ContentValues();
        updateSurvey.put("Type", surveyType.toString());
        updateSurvey.put("Json", json);

        open();
        Cursor results = database.query("RetrievedSurveys", null, "Type = '" + surveyType.toString() + "'", null, null, null, null);

        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one retrieved survey in the database of type " + surveyType.toString());
            database.update("RetrievedSurveys", updateSurvey, "Type = '" + surveyType.toString() + "'", null);
        }
        else if(results.getCount() == 0) {
            Log.d("HOUSING1000", "There are no surveys in the database of type " + surveyType.toString());
            database.insert("RetrievedSurveys", null, updateSurvey);
        }
        else {
            close();
            throw new IllegalArgumentException("There is more than one survey in the RetrievedSurveys database of type " + surveyType.toString()
                    + ". There should only be one of each type.");
        }
        close();
    }

    /**
     * Retrieves stored Json for the given survey type
     * @param surveyType The type of survey to try and retrieve
     * @return The json representation of the survey
     */
    public String queryForSavedSurveyJson(SurveyType surveyType) {
        open();
        Cursor results = database.query("RetrievedSurveys", null, "Type = '" + surveyType.toString() + "'", null, null, null, null);

        String jsonToReturn = null;
        if(results.getCount() == 1) {
            Log.d("HOUSING1000", "There is one retrieved survey in the database of type " + surveyType.toString());
            if(results.moveToFirst()) {
                results.moveToFirst();
                jsonToReturn = results.getString(3);
            }
        }
        else if(results.getCount() == 0) {
            Log.d("HOUSING1000", "There are no surveys in the database of type " + surveyType.toString());
        }
        else {
            close();
            throw new IllegalArgumentException("There is more than one survey in the RetrievedSurveys database of type " + surveyType.toString()
                    + ". There should only be one of each type.");
        }
        close();
        return jsonToReturn;
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
                    "DateUpdated DATETIME DEFAULT CURRENT_TIMESTAMP, Json TEXT);";
            String createSubmittedQuery = "CREATE TABLE SubmittedJson(Id INTEGER primary key autoincrement, Json TEXT);";

            db.execSQL(createRetrievedQuery + createSubmittedQuery); //Create the database
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

        }
    }
}
