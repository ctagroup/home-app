package edu.weber.housing1000.DB;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import java.util.List;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyResponse;

public class SurveyDbAdapter {

    public static final String DB_NAME = "survey.db";
    public static final int DB_VERSION = 1;
    public static final String SURVEYS_TABLE = "surveys";
    public static final String RESPONSES_TABLE = "responses";

    public static final String SURVEYS_FIELD_ID = "_id";
    public static final String SURVEYS_FIELD_HMS_ID = "hms_id";
    public static final String SURVEYS_FIELD_STATUS = "Status";
    public static final String SURVEYS_FIELD_CREATED = "created";
    public static final String SURVEYS_FIELD_UPDATED = "updated";

    public static final String RESPONSES_FIELD_ID = "_id";
    public static final String RESPONSES_FIELD_SURVEY_ID = "survey_id";
    public static final String RESPONSES_FIELD_QUESTION = "question";
    public static final String RESPONSES_FIELD_RESPONSE = "response";


    private SurveyDbHelper dbHelper = null;
    private SQLiteDatabase db = null;

    public SurveyDbAdapter(Context context) {
        dbHelper = new SurveyDbHelper(context);
    }

    public void open() {
        db = dbHelper.getWritableDatabase();
    }

    public void close() {
        try {
            dbHelper.close();
        } catch (RuntimeException e) {
            Log.e("Housing1000", e.getMessage());
        } finally {
            db = null;
        }
    }

    public long insertSurvey(Survey survey) {
        ContentValues values = new ContentValues();

        values.put(SURVEYS_FIELD_HMS_ID, survey.getHmsId());
        values.put(SURVEYS_FIELD_STATUS, Survey.Status.CREATED.getId());
        values.put(SURVEYS_FIELD_CREATED, System.currentTimeMillis());
        values.put(SURVEYS_FIELD_UPDATED, System.currentTimeMillis());

        return db.insert(SurveyDbAdapter.SURVEYS_TABLE, null, values);
    }

    public void updateSurvey(Survey survey) {
        ContentValues values = new ContentValues();

        values.put(SURVEYS_FIELD_STATUS, Survey.Status.CREATED.getId());
        values.put(SURVEYS_FIELD_UPDATED, System.currentTimeMillis());

        String updateFilter = RESPONSES_FIELD_ID + "=" + survey.getId();

        db.update(SurveyDbAdapter.SURVEYS_TABLE, values, updateFilter, null);
    }

    public Survey getSurvey(long id) {
        Cursor c = db.query(SurveyDbAdapter.SURVEYS_TABLE,
                new String[]{
                        SURVEYS_FIELD_ID,
                        SURVEYS_FIELD_HMS_ID,
                        SURVEYS_FIELD_STATUS,
                        SURVEYS_FIELD_CREATED,
                        SURVEYS_FIELD_UPDATED
                },
                String.format("%s = ?", SURVEYS_FIELD_ID),
                new String[] {Long.toString(id)},
                null, null, null);

        List<Survey> surveys = Survey.getSurveys(c);
        return surveys.size() > 0 ? surveys.get(0) : null;
    }

    public List<Survey> getSurveys() {
        Cursor c = db.query(SurveyDbAdapter.SURVEYS_TABLE,
                new String[]{
                        SURVEYS_FIELD_ID,
                        SURVEYS_FIELD_HMS_ID,
                        SURVEYS_FIELD_STATUS,
                        SURVEYS_FIELD_CREATED,
                        SURVEYS_FIELD_UPDATED
                },
                null, null, null, null, null);
        return Survey.getSurveys(c);
    }

    public Survey getSurveyByHmsId(int hmsId) {
        Cursor c = db.query(SurveyDbAdapter.SURVEYS_TABLE,
                new String[]{
                        SURVEYS_FIELD_ID,
                        SURVEYS_FIELD_HMS_ID,
                        SURVEYS_FIELD_STATUS,
                        SURVEYS_FIELD_CREATED,
                        SURVEYS_FIELD_UPDATED
                },
                String.format("%s = ?", SURVEYS_FIELD_HMS_ID),
                new String[]{Integer.toString(hmsId)},
                null, null, null);
        List<Survey> surveys = Survey.getSurveys(c);
        return surveys.size() > 0 ? surveys.get(0) : null;
    }

    public long insertResponse(SurveyResponse response) {
        ContentValues values = new ContentValues();

        values.put(RESPONSES_FIELD_SURVEY_ID, response.getSurveyId());
        values.put(RESPONSES_FIELD_QUESTION, response.getQuestion());
        values.put(RESPONSES_FIELD_RESPONSE, response.getResponse());

        return db.insert(SurveyDbAdapter.RESPONSES_TABLE, null, values);
    }

    public void updateResponse(SurveyResponse response) {
        ContentValues values = new ContentValues();

        values.put(RESPONSES_FIELD_SURVEY_ID, response.getSurveyId());
        values.put(RESPONSES_FIELD_QUESTION, response.getQuestion());
        values.put(RESPONSES_FIELD_RESPONSE, response.getResponse());

        String updateFilter = String.format("%s = ?", RESPONSES_FIELD_ID);

        db.update(SurveyDbAdapter.RESPONSES_TABLE, values, updateFilter, new String[]{Long.toString(response.getId())});
    }

    public SurveyResponse getResponse(long id) {
        Cursor c = db.query(SurveyDbAdapter.RESPONSES_TABLE,
                new String[]{
                        RESPONSES_FIELD_ID,
                        RESPONSES_FIELD_SURVEY_ID,
                        RESPONSES_FIELD_QUESTION,
                        RESPONSES_FIELD_RESPONSE
                },
                String.format("%s = ?", RESPONSES_FIELD_ID),
                new String[]{Long.toString(id)},
                null, null, null);
        List<SurveyResponse> responses = SurveyResponse.listResponses(c);
        return responses.size() > 0 ? responses.get(0) : null;
    }

    public SurveyResponse getResponseByIdAndQuestion(long id, String question) {
        Cursor c = db.query(SurveyDbAdapter.RESPONSES_TABLE,
                new String[]{
                        RESPONSES_FIELD_ID,
                        RESPONSES_FIELD_SURVEY_ID,
                        RESPONSES_FIELD_QUESTION,
                        RESPONSES_FIELD_RESPONSE
                },
                String.format("%s = ? AND %s = ?", RESPONSES_FIELD_SURVEY_ID, RESPONSES_FIELD_QUESTION),
                new String[]{Long.toString(id), question},
                null, null, null);
        List<SurveyResponse> responses = SurveyResponse.listResponses(c);
        return responses.size() > 0 ? responses.get(0) : null;
    }

    public List<SurveyResponse> getResponses(long id) {
        Cursor c = db.query(SurveyDbAdapter.RESPONSES_TABLE,
                new String[]{
                        RESPONSES_FIELD_ID,
                        RESPONSES_FIELD_SURVEY_ID,
                        RESPONSES_FIELD_QUESTION,
                        RESPONSES_FIELD_RESPONSE
                },
                String.format("%s = ?", RESPONSES_FIELD_SURVEY_ID),
                new String[]{Long.toString(id)}, null, null, null);
        return SurveyResponse.listResponses(c);
    }

}
