package org.ctagroup.homeapp;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.ctagroup.homeapp.data.Survey;
import org.ctagroup.homeapp.questions.Question;
import org.ctagroup.homeapp.questions.QuestionJSONDeserializer;

/**
 * @author Blake
 */
public class JSONParser {

    /**
     * Creates a survey from the given Json
     * @param json Json to use for creating the survey
     * @return New Survey
     */
    public static Survey getSurveyFromJson(String json) {
        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().registerTypeAdapter(Question.class, new QuestionJSONDeserializer()).create();

        return gson.fromJson(json, Survey.class);
    }

}
