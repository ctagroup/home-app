package edu.weber.housing1000.authentication;

import retrofit.Callback;
import retrofit.http.Field;
import retrofit.http.FormUrlEncoded;
import retrofit.http.POST;

/**
 * @author David Horton
 */
public interface AuthenticationService {

    @FormUrlEncoded
    @POST("/SurveySite/token")
    void getToken(@Field("grant_type") String grantType, @Field("username") String username, @Field("password") String password, Callback<TokenResponse> cb);
}
