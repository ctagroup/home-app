package org.ctagroup.homeapp.fragments;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

import org.ctagroup.homeapp.SurveyType;
import org.ctagroup.homeapp.activities.SurveyFlowActivity;
import org.ctagroup.homeapp.data.Client;
import org.ctagroup.homeapp.data.Response;
import org.ctagroup.homeapp.data.SurveyResponse;
import org.ctagroup.homeapp.helpers.Logger;
import org.ctagroup.homeapp.helpers.RESTHelper;
import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.SurveyService;
import org.ctagroup.homeapp.helpers.SharedPreferencesHelper;
import org.ctagroup.homeapp.sqlite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;

/**
 * @author Blake
 */
public class SurveyFragment extends BaseSurveyFragment {
    private SurveyFlowActivity myActivity;      // Parent activity
    private boolean surveySubmitted;

    public static SurveyFragment newInstance(Context context, String actionBarTitle)
    {
        SurveyFragment fragment = new SurveyFragment();

        Bundle args = new Bundle();
        args.putString("name", context.getString(R.string.fragment_survey_name));
        args.putString("title", actionBarTitle);
        fragment.setArguments(args);

        fragment.updateName();

        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Restore the state after recreation
        if (savedInstanceState != null) {
            surveySubmitted = savedInstanceState.getBoolean("surveySubmitted");
        }
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        myActivity = (SurveyFlowActivity) getActivity();
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        ScrollView questionUI = generateQuestionUi(surveyListing);

        if (questionUI != null) {
            rootLayout.addView(questionUI);

            populateAnswers();
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View mainView = inflater.inflate(R.layout.fragment_survey, container, false);

        rootLayout = (RelativeLayout) mainView.findViewById(R.id.root_layout);

        surveyListing = myActivity.getSurveyListing();

        return mainView;
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        outState.putBoolean("surveySubmitted", surveySubmitted);
    }

    /**
     * Saves the answers and starts the submission task
     */
    public void saveAnswers() {
        if (validateForm() && !surveySubmitted) {
            myActivity.showProgressDialog(getActivity().getString(R.string.please_wait), getActivity().getString(R.string.submitting_survey_response), "SurveySubmit");
            myActivity.setSubmittingResponse(true);

            saveSurveyResponse();

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), gson);

            SurveyService service = restAdapter.create(SurveyService.class);

            service.postResponse(survey.getId(), surveyResponse, new Callback<String>() {
                @Override
                public void success(String s, retrofit.client.Response response) {
                    myActivity.onPostSurveyResponsesTaskCompleted(response);
                    surveySubmitted = true;
                }

                @Override
                public void failure(RetrofitError error) {
                    myActivity.onPostSurveyResponsesTaskCompleted(error.getResponse());
                }

            });
        } else {
            myActivity.onPostSurveyResponsesTaskCompleted(null);
        }
    }

    @Override
    public void saveAnswersToDatabase() {
        String surveyJsonToSubmit = saveSurveyResponse();

        Logger.d("HOUSING1000", "The survey ID of the saved survey: " + survey.getSurveyId());

        DatabaseConnector databaseConnector = new DatabaseConnector(this.getActivity().getBaseContext());
        long surveyDataId = databaseConnector.saveSurveyToSubmitLater(surveyJsonToSubmit, SurveyType.BASIC_SURVEY, Long.toString(survey.getSurveyId()));

        myActivity.onSaveSurveyResponsesToDatabase(surveyDataId);
    }

    /**
     * Serializes the surveyResponse to JSON
     *
     * @return Survey response in JSON form
     */
    public String saveSurveyResponse() {
        Client client = new Client(survey.getClientQuestions(), SurveyFlowActivity.getLocation());
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        surveyResponse = new SurveyResponse(surveyListing, client, responses, SharedPreferencesHelper.getUserId(myActivity));

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        return gson.toJson(surveyResponse);
    }

}
