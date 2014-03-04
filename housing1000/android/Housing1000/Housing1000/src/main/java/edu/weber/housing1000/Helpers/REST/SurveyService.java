package edu.weber.housing1000.Helpers.REST;

import java.util.List;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyResponse;
import retrofit.Callback;
import retrofit.client.Response;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.Headers;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.http.Path;
import retrofit.mime.MultipartTypedOutput;
import retrofit.mime.TypedByteArray;
import retrofit.mime.TypedFile;
import retrofit.mime.TypedOutput;
import retrofit.mime.TypedString;

/**
 * This is used to perform our REST API calls
 * More info here: http://square.github.io/retrofit/
 */
public interface SurveyService {
    @GET("/survey")
    void listSurveys(Callback<List<SurveyListing>> cb);
    @GET("/survey/{id}")
    void getSurvey(@Path("id") String id, Callback<String> cb);

    @POST("/survey/{id}")
    void postResponse(@Path("id") String id, @Body SurveyResponse surveyResponse, Callback<String> cb);

    @Multipart
    @POST("/upload")
    void postImage(@Part("images") MultipartTypedOutput images, Callback<String> cb);

    @GET("/pit")
    void getPit(Callback<Survey> cb);
}
