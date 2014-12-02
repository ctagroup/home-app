package edu.weber.housing1000.data;

import java.util.*;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class SurveyResponse {
    @Expose
    @SerializedName("SurveyId")
    public long surveyId;

    @Expose
    @SerializedName("SurveyBy")
    private long surveyBy;

    @Expose
    @SerializedName("Client")
    private Client client;

    @Expose
    @SerializedName("Responses")
    private ArrayList<Response> responses;

    public Client getClient()
    {
        return client;
    }

    public ArrayList<Response> getResponses()
    {
        return responses;
    }

    public SurveyResponse(SurveyListing surveyListing, Client client, ArrayList<Response> responses, long surveyBy) {
        this.surveyId = surveyListing.getSurveyId();
        this.surveyBy = surveyBy;
        this.client = client;
        this.responses = responses;
    }

}
