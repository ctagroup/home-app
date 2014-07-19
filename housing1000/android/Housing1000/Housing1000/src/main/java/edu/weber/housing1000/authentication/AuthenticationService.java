package edu.weber.housing1000.authentication;

import retrofit.Callback;
import retrofit.http.Field;
import retrofit.http.FormUrlEncoded;
import retrofit.http.POST;

/**
 * Created by David Horton on 7/18/14.
 */
public interface AuthenticationService {

    @FormUrlEncoded
    @POST("/Outreach/token")
    void getToken(@Field("grant_type") String grantType, @Field("username") String username, @Field("password") String password, Callback<TokenResponse> cb);
}
