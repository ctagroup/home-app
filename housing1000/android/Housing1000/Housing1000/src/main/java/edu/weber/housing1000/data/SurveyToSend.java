package edu.weber.housing1000.Data;

import android.database.Cursor;
import android.util.Log;
import edu.weber.housing1000.DB.*;
import edu.weber.housing1000.Questions.Question;

import java.io.IOException;
import java.io.ObjectOutputStream;
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
    private ArrayList<Map<String,String>> responses;

    public SurveyToSend(SurveyListing surveyListing, Client client, ArrayList<Question> questions) {
        surveyId = surveyListing.getId();
        surveyBy = 1;
        this.client = client;

        responses = new ArrayList<Map<String,String>>();
    }

}
