package edu.weber.housing1000.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * Created by Blake on 11/29/13.
 */
public class SurveyListing implements Serializable, Parcelable {

    @Expose
    @SerializedName("SurveyId")
    private long surveyId;

    @Expose
    @SerializedName("Title")
    private String title;

    private String json;

    //TODO expose this as something that can be deserialized from the json
    private boolean hasDisclaimer;

    public boolean hasDisclaimer() {
        //TODO uncomment this once hasDisclaimer actually ties to something from the json
        //return hasDisclaimer;
        return true;
    }

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

    // Parcelable methods

    public SurveyListing(Parcel in)
    {
        surveyId = in.readLong();
        String[] strings = new String[2];
        in.readStringArray(strings);
        title = strings[0];
        json = strings[1];
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(surveyId);
        dest.writeStringArray( new String[] {title, json} );
    }

    public static final Parcelable.Creator<SurveyListing> CREATOR
            = new Parcelable.Creator<SurveyListing>() {
        public SurveyListing createFromParcel(Parcel in) {
            return new SurveyListing(in);
        }

        public SurveyListing[] newArray(int size) {
            return new SurveyListing[size];
        }
    };

    // End Parcelable methods
}
