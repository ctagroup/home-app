package edu.weber.housing1000.Fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

import edu.weber.housing1000.Data.Client;
import edu.weber.housing1000.Data.Response;
import edu.weber.housing1000.Data.SurveyResponse;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.PitActivity;
import edu.weber.housing1000.R;
import retrofit.RestAdapter;

/**
 * Created by Blake on 2/11/14.
 */
public class PitFragment extends BaseSurveyFragment {
    private PitActivity myActivity;      // Parent activity

    public PitFragment() {
        super("PIT", "Point in Time");
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Restore the state after recreation
        if (savedInstanceState != null) {

        }
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        loadUI();
    }

    @Override
    public void onPause() {
        super.onPause();

    }

    @Override
    public void onResume() {
        super.onResume();

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View mainView = inflater.inflate(R.layout.fragment_survey, container, false);

        rootLayout = (RelativeLayout) mainView.findViewById(R.id.root_layout);

        myActivity = ((PitActivity) getActivity());
        surveyListing = myActivity.getSurveyListing();

        return mainView;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);


    }

    /**
     * Saves the answers and starts the submission task
     */
    public void saveAnswers() {
        if (validateForm()) {
            myActivity.showProgressDialog("Please Wait", "Submitting PIT responses...", "SurveySubmit");
            myActivity.setSubmittingSurvey(true);

            saveSurveyResponse();

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), gson);

//            SurveyService service = restAdapter.create(SurveyService.class);
//
//            service.postResponse(survey.getId(), surveyResponse, new Callback<String>() {
//                @Override
//                public void success(String s, retrofit.client.Response response) {
//                    if (s != null) {
//                        Log.d("SUCCESS", s);
//                        myActivity.onPostSurveyResponsesTaskCompleted(s);
//                    } else {
//                        myActivity.onPostSurveyResponsesTaskCompleted("SUCCESS");
//                    }
//                }
//
//                @Override
//                public void failure(RetrofitError error) {
//                    String errorBody = (String) error.getBodyAs(String.class);
//
//                    if (errorBody != null) {
//                        Log.e("FAILURE", errorBody.toString());
//                        myActivity.onPostSurveyResponsesTaskCompleted(errorBody);
//                    } else {
//                        myActivity.onPostSurveyResponsesTaskCompleted("ERROR");
//                    }
//                }
//            });
        }
    }

    /**
     * Serializes the surveyResponse to JSON
     *
     * @return Survey response in JSON form
     */
    @Override
    public String saveSurveyResponse() {
        Client client = new Client(null, null);
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        surveyResponse = new SurveyResponse(surveyListing, client, responses);

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        return gson.toJson(surveyResponse);
    }

    public void loadUI()
    {
        if (surveyListing == null) {
            if (myActivity.getSurveyListing() == null)
                return;
            else
                surveyListing = myActivity.getSurveyListing();
        }

        ScrollView questionUI = generateQuestionUi(surveyListing);

        if (questionUI != null)
        {
            rootLayout.addView(questionUI);

            populateAnswers();
        }
    }

}
