package org.ctagroup.homeapp.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.Date;

/**
 * @author David Horton
 */
public class DisclaimerResponse {

    @Expose
    @SerializedName("ClientSurveyId")
    public long clientSurveyId;

    @Expose
    @SerializedName("EnteredById")
    public long enteredById;

    @Expose
    @SerializedName("Name")
    public String name;

    @Expose
    @SerializedName("Date")
    public Date date;

    public DisclaimerResponse(long clientSurveyId, long enteredById, String name, Date date) {
        this.clientSurveyId = clientSurveyId;
        this.enteredById = enteredById;
        this.name = name;
        this.date = date;
    }
}
