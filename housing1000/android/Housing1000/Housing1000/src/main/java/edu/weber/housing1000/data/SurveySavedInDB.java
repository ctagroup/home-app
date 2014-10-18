package edu.weber.housing1000.data;

import edu.weber.housing1000.SurveyType;

/**
 * @author David Horton
 */
public class SurveySavedInDB {

    private SurveyType surveyType;
    private String json;
    private int databaseId;
    private String surveyId;

    public SurveySavedInDB(SurveyType surveyType, String json, int id, String surveyId) {
        this.surveyType = surveyType;
        this.json = json;
        this.databaseId = id;
        this.surveyId = surveyId;
    }

    public SurveyType getSurveyType() {
        return surveyType;
    }

    public String getJson() {
        return json;
    }

    public int getDatabaseId() {
        return databaseId;
    }

    public String getSurveyId() {
        return surveyId;
    }
}
