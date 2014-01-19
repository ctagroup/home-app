package edu.weber.housing1000.data;

import android.database.Cursor;
import android.util.Log;

import edu.weber.housing1000.db.SurveyDbAdapter;

import java.util.*;

public class SurveyResponse {
    private long id = -1;
    private long surveyId = -1;
    private String question = "";
    private String response = "";

    public SurveyResponse() {
        id = 0;
        surveyId = 0;
        question = "";
        response = "";
    }

    public SurveyResponse(long surveyId, String question, String response) {
        this.surveyId = surveyId;
        this.question = question;
        this.response = response;
    }

    public long getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(int surveyId) {
        this.surveyId = surveyId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public static List<SurveyResponse> listResponses(Cursor c){
        List<SurveyResponse> responses = new ArrayList<SurveyResponse>();
        if (c != null) {
            c.moveToFirst();
            for (int i = 0; i < c.getCount(); i++){
                try {
                    Map<String, Integer> locMap = new HashMap<String, Integer>();
                    int idLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.RESPONSES_FIELD_ID);
                    int respLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.RESPONSES_FIELD_RESPONSE);
                    int questionLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.RESPONSES_FIELD_QUESTION);
                    int surveyLoc = c.getColumnIndexOrThrow(SurveyDbAdapter.RESPONSES_FIELD_SURVEY_ID);

                    SurveyResponse r = new SurveyResponse();
                    r.setId(c.getInt(idLoc));
                    r.setSurveyId(c.getInt(surveyLoc));
                    r.setResponse(c.getString(respLoc));
                    r.setQuestion(c.getString(questionLoc));
                    responses.add(r);
                    c.moveToNext();

                } catch (IllegalArgumentException e) {
                    Log.e("ERROR", "failed to deserialize Survey");
                }
            }
        }
        return responses;
    }
}
