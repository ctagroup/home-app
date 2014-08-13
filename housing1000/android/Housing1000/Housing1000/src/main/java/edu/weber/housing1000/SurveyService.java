package edu.weber.housing1000;

import java.util.ArrayList;

import edu.weber.housing1000.data.PitResponse;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.data.SurveyResponse;
import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Path;
import retrofit.mime.MultipartTypedOutput;

/**
 * This is used to perform our REST API calls
 * More info here: http://square.github.io/retrofit/
 */
public interface SurveyService {

    @GET("/Survey/api/survey")
    void listSurveys(Callback<ArrayList<SurveyListing>> cb);

    @GET("/Survey/api/survey/{id}")
    void getSurvey(@Path("id") String id, Callback<String> cb);

    @POST("/Survey/api/survey/{id}")
    void postResponse(@Path("id") String id, @Body SurveyResponse surveyResponse, Callback<String> cb);

    @POST("/Survey/api/upload")
    void postImage(@Body MultipartTypedOutput images, Callback<String> cb);

    @GET("/Survey/api/pit")
    void getPit(Callback<Survey> cb);

    @POST("/Survey/api/pit")
    void postPit(@Body PitResponse pitResponse, Callback<String> cb);

}
