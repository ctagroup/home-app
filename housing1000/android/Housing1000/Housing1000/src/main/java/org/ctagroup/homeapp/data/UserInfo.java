package org.ctagroup.homeapp.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

/**
 * Represents the response of calling GET for user info. Here is an example JSON response:

     {
         "$id": "1",
         "Id": 1,
         "UserName": "francisspor",
         "Name": "Francis Spor",
         "HasRegistered": true,
         "LoginProvider": null,
         "Organization": "LIttle People"
     }

 * @author David Horton
 */
public class UserInfo {

    @Expose
    @SerializedName("Id")
    private long id;

    @Expose
    @SerializedName("UserName")
    private String userName;

    @Expose
    @SerializedName("Name")
    private String name;

    @Expose
    @SerializedName("HasRegistered")
    private boolean hasRegistered;

    @Expose
    @SerializedName("LoginProvider")
    private String loginProvider;

    @Expose
    @SerializedName("Organization")
    private String organization;

    @Override
    public String toString() {
        return "Id: " + id + "; UserName: " + userName + "; Name: " + name + "; HasRegistered: " + hasRegistered + "; LoginProvider: " + loginProvider + "; Organization: " + organization;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getOrganization() {
        return organization;
    }
}
