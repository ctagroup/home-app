package edu.weber.housing1000.Data;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.*;

import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.Questions.QuestionJSON;

public class Survey {

    @Expose
    @SerializedName("$id")
    private String id;

    @Expose
    @SerializedName("SurveyId")
    private long surveyId;

    @Expose
    @SerializedName("Title")
    private String title;

    @Expose
    @SerializedName("Client")
    private ArrayList<QuestionJSON> clientQuestionsJson;

    @Expose
    @SerializedName("SurveyQuestions")
    private ArrayList<QuestionJSON> surveyQuestionsJson;

    private ArrayList<Question> questions;

    public String getId() {
        return id;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<QuestionJSON> getClientQuestionsJson() { return clientQuestionsJson; }

    public ArrayList<QuestionJSON> getSurveyQuestionsJson() { return surveyQuestionsJson; }

    public ArrayList<Question> getQuestions() { return questions; }

    public Survey()
    {
        questions = new ArrayList<Question>();
    }

}
