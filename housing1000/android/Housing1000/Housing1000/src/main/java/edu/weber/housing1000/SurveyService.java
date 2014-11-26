package edu.weber.housing1000;

import java.util.ArrayList;

import edu.weber.housing1000.data.DisclaimerResponse;
import edu.weber.housing1000.data.EncampmentSite;
import edu.weber.housing1000.data.PitResponse;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.data.SurveyResponse;
import edu.weber.housing1000.data.TokenResponse;
import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.Field;
import retrofit.http.FormUrlEncoded;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Path;
import retrofit.http.Query;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedInput;

/**
 * This is used to perform our REST API calls
 * More info here: http://square.github.io/retrofit/
 */
public interface SurveyService {

    /**
     * For getting a list of survets
     * @param cb The callback
     */
    @GET("/SurveySite/api/survey")
    void listSurveys(Callback<ArrayList<SurveyListing>> cb);


    /**
     * For requesting a specific survey
     * @param id The survey Id
     * @param cb The callback
     */
    @GET("/SurveySite/api/survey/{id}")
    void getSurvey(@Path("id") String id, Callback<String> cb);


    /**
     * For submitting a specific survey
     * @param id The survey Id
     * @param surveyResponse The answers to the survey
     * @param cb The callback
     */
    @POST("/SurveySite/api/survey/{id}")
    void postResponse(@Path("id") String id, @Body SurveyResponse surveyResponse, Callback<String> cb);


    /**
     * For uploading survey images
     * @param images The images
     * @param cb The callback
     */
    @POST("/SurveySite/api/upload")
    void postImage(@Body MultipartTypedOutput images, Callback<String> cb);


    /**
     * For getting the PIT survey
     * @param cb The callback
     */
    @GET("/SurveySite/api/pit")
    void getPit(Callback<Survey> cb);


    /**
     * For posting the PIT survey answers
     * @param pitResponse The PIT survey answers
     * @param cb The callback
     */
    @POST("/SurveySite/api/pit")
    void postPit(@Body PitResponse pitResponse, Callback<String> cb);


    /**
     * For submitting a saved PIT survey from the database
     * @param jsonToSubmit The raw json to submit
     * @param cb The callback
     */
    @POST("/SurveySite/api/pit")
    void postPit(@Body TypedInput jsonToSubmit, Callback<String> cb);


    /**
     * For submitting a saved basic survey from the database
     * @param id The survey Id
     * @param jsonToSubmit The raw json to submit
     * @param cb The callback
     */
    @POST("/SurveySite/api/survey/{id}")
    void postResponse(@Path("id") String id, @Body TypedInput jsonToSubmit, Callback<String> cb);


    /**
     * For logging in to the app
     * @param grantType The grant type
     * @param username The username
     * @param password The password
     * @param cb The callback
     */
    @FormUrlEncoded
    @POST("/SurveySite/token")
    void getToken(@Field("grant_type") String grantType, @Field("username") String username, @Field("password") String password, Callback<TokenResponse> cb);


    /**
     * For searching encapment sites
     * @param searchString The entered search string
     * @param cb The callback
     */
    @GET("/SurveySite/api/EncampmentSite")
    void searchEncampment(@Query("searchStr") String searchString, Callback<ArrayList<EncampmentSite>> cb);


    /**
     * For getting the new encampment survey
     * @param cb The callback
     */
    @GET("/SurveySite/api/EncampmentSite")
    void getEncampmentQuestions(Callback<String> cb);


    /**
     * For getting the encampment visit survey
     * @param cb The callback
     */
    @GET("/SurveySite/api/Survey/GetEncampmentSurvey")
    void getEncampmentVisitQuestions(Callback<String> cb);


    /**
     * For submitting metadata about the disclaimer images
     * @param disclaimerResponse The disclaimer response
     * @param cb The callback
     */
    @POST("/SurveySite/Help/Api/POST-api-ROI")
    void postDisclaimerData(@Body DisclaimerResponse disclaimerResponse, Callback<String> cb);


    /**
     * For submitting metadata about the disclaimer images from the database
     * @param jsonToSubmit The raw json to submit
     * @param cb The callback
     */
    @POST("/SurveySite/Help/Api/POST-api-ROI")
    void postDisclaimerData(@Body TypedInput jsonToSubmit, Callback<String> cb);

}
