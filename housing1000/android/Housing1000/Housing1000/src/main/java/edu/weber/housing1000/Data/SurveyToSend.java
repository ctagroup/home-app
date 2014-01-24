package edu.weber.housing1000.Data;

import java.util.*;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class SurveyToSend {
    @Expose
    @SerializedName("SurveyId")
    private long surveyId = -1;

    @Expose
    @SerializedName("SurveyBy")
    private long surveyBy = -1;

    @Expose
    @SerializedName("Client")
    private Client client;

    @Expose
    @SerializedName("Responses")
    private ArrayList<Response> responses;

    public SurveyToSend(SurveyListing surveyListing, Client client, ArrayList<Response> responses) {
        surveyId = surveyListing.getSurveyId();
        surveyBy = 1;
        this.client = client;

        this.responses = responses;
    }

}
