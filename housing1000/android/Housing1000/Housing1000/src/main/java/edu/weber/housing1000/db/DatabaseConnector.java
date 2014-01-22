package edu.weber.housing1000.DB;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;

import edu.weber.housing1000.Data.SurveyListing;

public class DatabaseConnector {
    private static final String DATABASE_NAME = "surveys.db";
    private static final int DATABASE_VERSION = 2;
    private static final String SURVEYS_TABLE = "surveys"; // Holds the surveys
    private static final String RESPONSES_TABLE = "responses"; // Holds the responses
    private static final String RESPONSE_SETS_TABLE = "response_sets"; // Holds individual response sets - this is so we can queue up a number of survey response sets and send them all in at once (good for connection losses etc.)
    private SQLiteDatabase database; // Database object
    private DatabaseOpenHelper databaseOpenHelper; // Database helper

    public DatabaseConnector(Context context) {
        // create a new DatabaseOpenHelper
        databaseOpenHelper = new DatabaseOpenHelper(context, DATABASE_NAME,
                null, DATABASE_VERSION);
    }

    /**
     * Open the database connection
     *
     * @throws android.database.SQLException
     */
    public void open() throws SQLException {
        // create or open a database for reading/writing
        database = databaseOpenHelper.getWritableDatabase();
    }

    /**
     * Close the database connection
     */
    public void close() {
        if (database != null)
            database.close(); // close the database connection
    }

    /**
     * Inserts a new survey into the database
     *
     * @param survey Survey to insert
     * @return Row Id of the new entry
     */
    public long insertSurvey(SurveyListing survey) {

        ContentValues newSurvey = new ContentValues();
        newSurvey.put("_id", survey.getId());
        newSurvey.put("surveyVersion", survey.getVersion());
        newSurvey.put("title", survey.getTitle());
        newSurvey.put("questions", survey.getQuestions());

        open();
        long rowId = database.insert(SURVEYS_TABLE, null, newSurvey);
        close();

        return rowId;
    }

    /**
     * Inserts a new response into the database
     *
     * @param responseSetId Id of the response set
     * @param questionId    Id of the question
     * @param value         Value of the response
     * @return
     */
    public long insertResponse(long responseSetId, long questionId, String value) {

        ContentValues newResponse = new ContentValues();
        newResponse.put("responseSetId", responseSetId);
        newResponse.put("questionId", questionId);
        newResponse.put("value", value);

        open();
        long rowId = database.insert(RESPONSES_TABLE, null, newResponse);
        close();

        return rowId;
    }

    /**
     * Inserts a new response set into the database
     *
     * @param surveyId      Id of the survey
     * @param surveyVersion Version of the survey
     * @return
     */
    public long insertResponseSet(long surveyId, long surveyVersion) {

        ContentValues newResponseSet = new ContentValues();
        newResponseSet.put("surveyId", surveyId);
        newResponseSet.put("surveyVersion", surveyVersion);

        open();
        long rowId = database.insert(RESPONSE_SETS_TABLE, null, newResponseSet);
        close();

        return rowId;
    }

    /**
     * Updates the given survey
     * @param survey Survey to update
     */
    public void updateSurvey(SurveyListing survey) {

        ContentValues editSurvey = new ContentValues();
        editSurvey.put("surveyVersion", survey.getVersion());
        editSurvey.put("title", survey.getTitle());
        editSurvey.put("questions", survey.getQuestions());

        open();
        database.update(SURVEYS_TABLE, editSurvey, "_id=" + survey.getId(), null);
        close();
    }

    public void updateResponse(long responseId, long questionId, String value) {

        ContentValues editResponse = new ContentValues();
        editResponse.put("_id", responseId);
        editResponse.put("questionId", questionId);
        editResponse.put("value", value);

        open();
        database.update(RESPONSES_TABLE, editResponse, "_id=" + responseId, null);
        close();
    }

    public void updateResponseSet(long responseSetId, long surveyId, long surveyVersion) {

        ContentValues editResponseSet = new ContentValues();
        editResponseSet.put("_id", responseSetId);
        editResponseSet.put("surveyId", surveyId);
        editResponseSet.put("surveyVersion", surveyVersion);

        open();
        database.update(RESPONSE_SETS_TABLE, editResponseSet, "_id=" + responseSetId, null);
        close();
    }

    /**
     * Return a Cursor with all survey information in the database
     *
     * @return Cursor of all the surveys
     */
    public Cursor getAllSurveys() {
        return database.query(SURVEYS_TABLE, null, null, null, null, null, "title");
    }

    /**
     * Return a Cursor with all responses using the given response set id
     *
     * @return Cursor of all the surveys
     */
    public Cursor getAllResponses(long responseSetId) {
        return database.query(RESPONSES_TABLE, null, "responseSetId=" + responseSetId, null, null, null, null);
    }

    /**
     * Return a Cursor with all response sets
     *
     * @return Cursor of all the response sets
     */
    public Cursor getAllResponseSets() {
        return database.query(RESPONSE_SETS_TABLE, null, null, null, null, null, null);
    }

    /**
     * Get a Cursor for the given survey
     *
     * @param id - Id of the row
     * @return Cursor of the survey
     */
    public Cursor getOneSurvey(long id) {
        return database.query(SURVEYS_TABLE, null, "_id=" + id, null, null, null,
                null);
    }

    /**
     * Get a Cursor for the given response
     *
     * @param id - Id of the row
     * @return Cursor of the response
     */
    public Cursor getOneResponse(long id) {
        return database.query(RESPONSES_TABLE, null, "_id=" + id, null, null, null,
                null);
    }

    /**
     * Get a Cursor for the given response set
     *
     * @param id - Id of the row
     * @return Cursor of the response set
     */
    public Cursor getOneResponseSet(long id) {
        return database.query(RESPONSE_SETS_TABLE, null, "_id=" + id, null, null, null,
                null);
    }

    /**
     * Delete the survey specified by the given id
     *
     * @param id - Id of the row
     */
    public void deleteSurvey(long id) {
        open();
        database.delete(SURVEYS_TABLE, "_id=" + id, null);
        close();
    }

    /**
     * Delete the response specified by the given id
     *
     * @param id - Id of the row
     */
    public void deleteResponse(long id) {
        open();
        database.delete(RESPONSES_TABLE, "_id=" + id, null);
        close();
    }

    /**
     * Delete the response set specified by the given id
     *
     * @param id - Id of the row
     */
    public void deleteResponseSet(long id) {
        open();
        database.delete(RESPONSE_SETS_TABLE, "_id=" + id, null);
        close();
    }

    /**
     * Clear all surveys from the database
     */
    public void clearSurveys() {
        open();
        database.delete(SURVEYS_TABLE, null, null);
        close();
    }

    /**
     * Clear all responses from the database
     */
    public void clearResponses() {
        open();
        database.delete(RESPONSES_TABLE, null, null);
        close();
    }

    /**
     * Clear all response sets from the database
     */
    public void clearResponseSets() {
        open();
        database.delete(RESPONSE_SETS_TABLE, null, null);
        close();
    }

    /**
     * Helper class used to create/upgrade the database
     *
     * @author Blake
     */
    private class DatabaseOpenHelper extends SQLiteOpenHelper {

        // Public constructor
        public DatabaseOpenHelper(Context context, String name,
                                  CursorFactory factory, int version) {
            super(context, name, factory, version);
        }

        // Creates the tables
        @Override
        public void onCreate(SQLiteDatabase db) {
            String createSurveysQuery = "CREATE TABLE " + SURVEYS_TABLE
                    + " (_id integer primary key,"
                    + "surveyVersion integer, title TEXT, questions TEXT);";

            String createResponsesQuery = "CREATE TABLE " + RESPONSES_TABLE
                    + " (_id integer primary key autoincrement,"
                    + "responseSetId integer, questionId integer, value TEXT);";

            String createResponseSetsQuery = "CREATE TABLE " + RESPONSE_SETS_TABLE
                    + " (_id integer primary key autoincrement,"
                    + "surveyId integer, surveyVersion integer);";

            db.execSQL(createSurveysQuery); // execute the surveys query
            db.execSQL(createResponsesQuery); // execute the responses query
            db.execSQL(createResponseSetsQuery); // execute the responses query
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            // This code might be needed if we do a DB upgrade down the road
            if (oldVersion < 2)
            {
                String updateQuery = "ALTER TABLE " + SURVEYS_TABLE + " ADD Column questions TEXT";
                db.execSQL(updateQuery);
            }
//            else if (oldVersion < 3)
//            {
//                  //Do something else
//            }
        }
    } // end class DatabaseOpenHelper
} // end class DatabaseConnector
