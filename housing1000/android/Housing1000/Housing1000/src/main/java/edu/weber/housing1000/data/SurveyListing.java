package edu.weber.housing1000.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;

/**
 * @author Blake
 */
public class SurveyListing implements Serializable, Parcelable {

    @Expose
    @SerializedName("SurveyId")
    private long surveyId;

    @Expose
    @SerializedName("Title")
    private String title;

    private boolean hasDisclaimer;
    private String json;

    public boolean hasDisclaimer() {
        return hasDisclaimer;
    }

    public void setHasDisclaimer(boolean hasDisclaimer) {
        this.hasDisclaimer = hasDisclaimer;
    }

    public long getSurveyId() {
        return surveyId;
    }

    public String getTitle() {
        return title;
    }

    public String getJson() {
        return json;
    }

    public void setJson(String json) {
        this.json = json;
    }

    public SurveyListing() {
    }

    public SurveyListing(String json, Survey survey)
    {
        this.surveyId = survey.getSurveyId();
        this.title = survey.getTitle();
        this.json = json;
        this.hasDisclaimer = survey.hasDisclaimer();
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
        hasDisclaimer = in.readByte() != 0;     //hasDisclaimer == true if byte != 0
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeLong(surveyId);
        dest.writeStringArray( new String[] {title, json} );
        dest.writeByte((byte) (hasDisclaimer ? 1 : 0));
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
