package edu.weber.housing1000.Helpers.REST;

import java.util.ArrayList;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyResponse;
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
    @GET("/survey")
    void listSurveys(Callback<ArrayList<SurveyListing>> cb);
    @GET("/survey/{id}")
    void getSurvey(@Path("id") String id, Callback<String> cb);

    @POST("/survey/{id}")
    void postResponse(@Path("id") String id, @Body SurveyResponse surveyResponse, Callback<String> cb);

    @POST("/upload")
    void postImage(@Body MultipartTypedOutput images, Callback<String> cb);

    @GET("/pit")
    void getPit(Callback<Survey> cb);
}
