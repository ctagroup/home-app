package edu.weber.housing1000.data;


import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.*;

import edu.weber.housing1000.questions.Question;

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

    @Expose
    @SerializedName("NeedsROIAndImages")
    private boolean hasDisclaimer;

    public String getId() {
        return id;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public String getTitle() {
        return title;
    }

    public boolean hasDisclaimer() {
        return hasDisclaimer;
    }

    public ArrayList<Question> getClientQuestions() { return clientQuestions; }

    public ArrayList<Question> getSurveyQuestions() { return surveyQuestions; }

    public Survey() { }

}
