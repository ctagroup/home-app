package edu.weber.housing1000.Helpers.REST;

import java.util.List;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyResponse;
import retrofit.client.Response;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Path;

public interface SurveyService {
    @GET("/survey")
    List<SurveyListing> listSurveys();
    @GET("/survey/{id}")
    Response getSurvey(@Path("id") String id);

    @POST("/survey/{id}")
    Response postResponse(@Path("id") String id, @Body SurveyResponse surveyResponse);
}
