package edu.weber.housing1000.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * @author David Horton
 */
public class EncampmentSite implements Serializable {

    /* //An example JSON representation of this class
       {
          "$id":"1",
          "Visits":[

          ],
          "EncampmentSiteId":1,
          "CouncilDistrict":1,
          "EncampLocation":"downtown",
          "EncampDispatchId":"edd3",
          "SiteCode":"BWC",
          "EncampmentType":"river",
          "SizeOfEncampment":"small",
          "EnvironmentalImpact":"none",
          "VisibilityToThePublic":"none",
          "Inactive":false
       }
    */

    @Expose
    @SerializedName("$id")
    private String id;

    @Expose
    @SerializedName("Visits")
    private ArrayList<String> visits;

    @Expose
    @SerializedName("EncampmentSiteId")
    private long encampSiteId;

    @Expose
    @SerializedName("CouncilDistrict")
    private long councilDistrict;

    @Expose
    @SerializedName("EncampLocation")
    private String encampLocation;

    @Expose
    @SerializedName("EncampDispatchId")
    private String dispatchId;

    @Expose
    @SerializedName("SiteCode")
    private String siteCode;

    @Expose
    @SerializedName("EncampmentType")
    private String encampType;

    @Expose
    @SerializedName("SizeOfEncampment")
    private String encampSize;

    @Expose
    @SerializedName("EnvironmentalImpact")
    private String environmentImpact;

    @Expose
    @SerializedName("VisibilityToThePublic")
    private String publicVisibility;

    @Expose
    @SerializedName("Inactive")
    private boolean isInactive;

    public String getId() {
        return id;
    }

    public ArrayList<String> getVisits() {
        return visits;
    }

    public long getEncampSiteId() {
        return encampSiteId;
    }

    public long getCouncilDistrict() {
        return councilDistrict;
    }

    public String getEncampLocation() {
        return encampLocation;
    }

    public String getDispatchId() {
        return dispatchId;
    }

    public String getSiteCode() {
        return siteCode;
    }

    public String getEncampType() {
        return encampType;
    }

    public String getEncampSize() {
        return encampSize;
    }

    public String getEnvironmentImpact() {
        return environmentImpact;
    }

    public String getPublicVisibility() {
        return publicVisibility;
    }

    public boolean isInactive() {
        return isInactive;
    }

    @Override
    public String toString() {
        return this.id + " - " + this.encampLocation + "; Type: " + this.encampType;
    }
}
