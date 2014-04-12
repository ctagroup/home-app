package edu.weber.housing1000.Data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.ArrayList;

public class PitResponse {
    @Expose
    @SerializedName("Client")
    private String client;

    @Expose
    @SerializedName("GeoLoc")
    private String geoLocation;

    @Expose
    @SerializedName("UserId")
    private long userId = -1;

    @Expose
    @SerializedName("Responses")
    private ArrayList<Response> responses;

    public ArrayList<Response> getResponses()
    {
        return responses;
    }

    public PitResponse(String geoLocation, ArrayList<Response> responses) {
        userId = 1;
        client = "";
        this.geoLocation = geoLocation;
        this.responses = responses;
    }

}
