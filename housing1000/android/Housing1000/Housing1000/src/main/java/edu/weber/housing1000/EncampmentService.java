package edu.weber.housing1000;

import java.util.ArrayList;

import edu.weber.housing1000.data.EncampmentSite;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyResponse;
import retrofit.Callback;
import retrofit.http.Body;
import retrofit.http.GET;
import retrofit.http.POST;
import retrofit.http.Query;

/**
 *
 * @author David Horton
 *
 * This is used to perform our REST API calls
 * More info here: http://square.github.io/retrofit/
 */
public interface EncampmentService {

    @GET("/SurveySite/api/EncampmentSite")
    void searchEncampment(@Query("searchStr") String searchString, Callback<ArrayList<EncampmentSite>> cb);

    @GET("/SurveySite/api/EncampmentSite")
    void getEncampmentQuestions(Callback<String> cb);

    @POST("/SurveySite/api/EncampmentSite")
    void postEncampmentResponse(@Body SurveyResponse surveyResponse, Callback<String> cb);
}
