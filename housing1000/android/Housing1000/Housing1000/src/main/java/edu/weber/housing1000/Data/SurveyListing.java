package edu.weber.housing1000.Data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Blake on 11/29/13.
 */
public class SurveyListing implements Serializable {

    @Expose
    @SerializedName("SurveyId")
    private long surveyId;

    @Expose
    @SerializedName("Title")
    private String title;

    private String json;

    public long getSurveyId() {
        return surveyId;
    }

    public String getTitle() {
        return title;
    }

    public String getJson() { return json; }

    public void setJson(String json) { this.json = json; }

    public SurveyListing()
    {

    }

    public SurveyListing(long id, String title, String json)
    {
        this.surveyId = id;
        this.title = title;
        this.json = json;
    }

    @Override
    public String toString() {
        return getTitle();
    }
}
