package org.ctagroup.homeapp.data;

import android.os.Parcel;
import android.os.Parcelable;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * @author David Horton
 */
public class EncampmentSite implements Serializable, Parcelable {

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

    public EncampmentSite(Parcel in) {
        this.id = in.readString();
        this.dispatchId = in.readString();
        this.encampLocation = in.readString();
        this.encampSize = in.readString();
        this.encampType = in.readString();
        this.environmentImpact = in.readString();
        this.publicVisibility = in.readString();
        this.siteCode = in.readString();
        this.councilDistrict = in.readLong();
        this.encampSiteId = in.readLong();
        this.isInactive = in.readByte() != 0;     //this.isInactive == true if byte != 0
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.id);
        dest.writeString(this.dispatchId);
        dest.writeString(this.encampLocation);
        dest.writeString(this.encampSize);
        dest.writeString(this.encampType);
        dest.writeString(this.environmentImpact);
        dest.writeString(this.publicVisibility);
        dest.writeString(this.siteCode);
        dest.writeLong(this.councilDistrict);
        dest.writeLong(this.encampSiteId);
        dest.writeByte((byte) (this.isInactive ? 1 : 0));
    }

    public static final Parcelable.Creator<EncampmentSite> CREATOR
            = new Parcelable.Creator<EncampmentSite>() {
        public EncampmentSite createFromParcel(Parcel in) {
            return new EncampmentSite(in);
        }

        public EncampmentSite[] newArray(int size) {
            return new EncampmentSite[size];
        }
    };
}
