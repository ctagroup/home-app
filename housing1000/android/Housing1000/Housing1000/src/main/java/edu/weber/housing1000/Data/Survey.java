package edu.weber.housing1000.Data;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.*;

import edu.weber.housing1000.Questions.Question;

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
    private ArrayList<Question> clientQuestions;

    @Expose
    @SerializedName("SurveyQuestions")
    private ArrayList<Question> surveyQuestions;

    public String getId() {
        return id;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public String getTitle() {
        return title;
    }

    public ArrayList<Question> getClientQuestions() { return clientQuestions; }

    public ArrayList<Question> getSurveyQuestions() { return surveyQuestions; }

    public Survey() { }

}
