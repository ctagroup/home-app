package edu.weber.housing1000;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Blake on 11/12/13.
 */
public class JSONParser {

    public static final String surveys = "[{\"$id\":\"1\",\"SurveyId\":1,\"Title\":\"Santa Clara Survey\",\"Description\":\"This is Santa Clara Survey\",\"CreatedBy\":1,\"CreatedDate\":\"2013-11-05T12:04:23\",\"UpdatedBy\":null,\"UpdatedDate\":null,\"ExpireOn\":null,\"Active\":true},{\"$id\":\"2\",\"SurveyId\":2,\"Title\":\"Santa Cruz Survey\",\"Description\":\"This is Santa Cruz Survey\",\"CreatedBy\":1,\"CreatedDate\":\"2013-11-05T12:04:23\",\"UpdatedBy\":null,\"UpdatedDate\":null,\"ExpireOn\":null,\"Active\":true}]";
    public static final String testSurvey = "{\"$id\":\"1\",\"SurveyId\":1,\"Title\":\"Santa Clara Survey\",\"SurveyQuestions\":[{\"$id\":\"2\",\"QuestionId\":1,\"text\":\"What is your birthday?\",\"QuestionType\":\"SinglelineTextBox\",\"Options\":null,\"OrderId\":1},{\"$id\":\"3\",\"QuestionId\":2,\"text\":\"How do you identify yourself?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"Male|Female|Transgender|Other\",\"OrderId\":2},{\"$id\":\"4\",\"QuestionId\":3,\"text\":\"Which racial/ethinic group do you identify yourself with the most?\",\"QuestionType\":\"SingleSelect\",\"Options\":\"White/Caucasian|Black/African American|Hispanic/Latino|American Indian/Alaskan Native|Vietnamese|Other Asian|Pacific Islander|Other/Multi-ethnic\",\"OrderId\":3}]}";

    public static ArrayList<String> parseSurveyList(String surveys)
    {
        try {
            JSONArray surveysJSON = new JSONArray(surveys);

            for (int i = 0; i < surveysJSON.length(); i++)
            {
                JSONObject single = surveysJSON.getJSONObject(i);
                Log.d("JSON", single.get("Title").toString());
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return null;
    }

    public static ArrayList<String> parseSurvey(String survey)
    {
        try {
            JSONObject surveyJSON = new JSONObject(survey);

            JSONArray questions = surveyJSON.getJSONArray("SurveyQuestions");

            for (int i = 0; i < questions.length(); i++){
                Log.d("JSON", questions.getJSONObject(i).get("text").toString());
            }

            //JSONArray surveysJSON = new JSONArray(survey);

//            for (int i = 0; i < surveysJSON.length(); i++)
//            {
//                JSONObject single = surveysJSON.getJSONObject(i);
//
//                Log.d("JSON", single.get("Title").toString());
//            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return null;
    }

}
