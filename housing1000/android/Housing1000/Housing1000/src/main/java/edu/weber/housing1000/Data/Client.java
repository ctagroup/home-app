package edu.weber.housing1000.Data;

import android.location.Location;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;

import edu.weber.housing1000.Questions.Question;

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

    public Client (ArrayList<Question> questions, Location location)
    {
        if (questions != null)
        {
            for (Question q : questions)
            {
                switch (q.getParentRequiredAnswer())
                {
                    case "Birthday":
                        birthday = q.getAnswer();
                        break;
                    case "Last4SSN":
                        last4Ssn = q.getAnswer();
                        break;
                    case "ServicePointId":
                        if (!q.getAnswer().isEmpty())
                            servicePointId = Integer.parseInt(q.getAnswer());
                        break;
                    default:
                        break;
                }
            }
        }

        geoLocation = location != null ? location.getLatitude() + "," + location.getLongitude() : "0,0";
    }

}
