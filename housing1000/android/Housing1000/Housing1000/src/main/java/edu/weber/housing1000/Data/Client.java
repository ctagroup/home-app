package edu.weber.housing1000.Data;

import android.location.Location;

import java.io.Serializable;
import java.util.Date;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Created by Blake on 1/22/14.
 */
public class Client implements Serializable {

    @Expose
    @SerializedName("Birthday")
    public String birthday;

    @Expose
    @SerializedName("GeoLoc")
    public String geoLocation;

    @Expose
    @SerializedName("Last4SSN")
    public String last4Ssn;

    @Expose
    @SerializedName("ServicePointId")
    public int servicePointId;

    public Client(String birthday, String geoLocation, String last4Ssn, int servicePointId)
    {
        this.birthday = birthday;
        this.geoLocation = geoLocation;
        this.last4Ssn = last4Ssn;
        this.servicePointId = servicePointId;
    }

}
