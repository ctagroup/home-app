package edu.weber.housing1000.authentication;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.Date;

/**
 * Created by David Horton on 7/18/14.
 */
public class TokenResponse {

    private static String ACCESS_TOKEN;

    private Date dateIssuedAsDate;

    private Date dateExpiresAsDate;

    @Expose
    @SerializedName("access_token")
    private String accessToken;

    @Expose
    @SerializedName("token_type")
    private String tokenType;

    @Expose
    @SerializedName("expires_in")
    private long expiresIn;

    @Expose
    @SerializedName(".issued")
    private String dateIssued;

    @Expose
    @SerializedName(".expires")
    private String dateExpires;


    @Override
    public String toString() {
        return "Access token: " + accessToken.toString().substring(0, 30) + "..., Token type: " + tokenType + ", Expires in: " + expiresIn + ", Date issued: " + dateIssued + ", Date expires: " + dateExpires;
    }

    public static String getACCESS_TOKEN() {
        return ACCESS_TOKEN;
    }

    public static void setACCESS_TOKEN(String ACCESS_TOKEN) {

        TokenResponse.ACCESS_TOKEN = ACCESS_TOKEN;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public long getExpiresIn() {
        return expiresIn;
    }

    public String getDateIssued() {
        return dateIssued;
    }

    public String getDateExpires() {
        return dateExpires;
    }

    public Date getDateIssuedAsDate() {
        return dateIssuedAsDate;
    }

    public void setDateIssuedAsDate(Date dateIssuedAsDate) {
        this.dateIssuedAsDate = dateIssuedAsDate;
    }

    public Date getDateExpiresAsDate() {
        return dateExpiresAsDate;
    }

    public void setDateExpiresAsDate(Date dateExpiresAsDate) {
        this.dateExpiresAsDate = dateExpiresAsDate;
    }
}
