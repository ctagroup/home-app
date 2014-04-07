package edu.weber.housing1000.Fragments;

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

import edu.weber.housing1000.Data.Client;
import edu.weber.housing1000.Data.PitResponse;
import edu.weber.housing1000.Data.Response;
import edu.weber.housing1000.Data.SurveyResponse;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.PitActivity;
import edu.weber.housing1000.R;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;

/**
 * Created by Blake on 2/11/14.
 */
public class PitFragment extends BaseSurveyFragment {
    private PitActivity myActivity;      // Parent activity
    private PitResponse pitResponse;

    public static PitFragment newInstance(Context context)
    {
        PitFragment fragment = new PitFragment();

        Bundle args = new Bundle();
        args.putString("name", context.getString(R.string.fragment_pit_name));
        args.putString("title", context.getString(R.string.fragment_pit_title));
        fragment.setArguments(args);

        fragment.updateName();

        return fragment;
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);

        myActivity = ((PitActivity) getActivity());
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        loadUI();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View mainView = inflater.inflate(R.layout.fragment_survey, container, false);

        rootLayout = (RelativeLayout) mainView.findViewById(R.id.root_layout);

        surveyListing = myActivity.getSurveyListing();

        return mainView;
    }

    /**
     * Saves the answers and starts the submission task
     */
    public void saveAnswers() {
        if (validateForm()) {
            myActivity.showProgressDialog(getString(R.string.please_wait), getActivity().getString(R.string.submitting_pit_responses), "SurveySubmit");
            myActivity.setSubmittingSurvey(true);

            saveSurveyResponse();
            savePitResponse();

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

            RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(getActivity(), gson);

            SurveyService service = restAdapter.create(SurveyService.class);

            service.postPit(pitResponse, new Callback<String>() {
                    @Override
                    public void success(String s, retrofit.client.Response response) {
                        myActivity.onPostSurveyResponsesTaskCompleted(response);
                    }

                    @Override
                    public void failure(RetrofitError error) {
                        myActivity.onPostSurveyResponsesTaskCompleted(error.getResponse());
                    }

                });
        }
    }

    @Override
    public String saveSurveyResponse() {
        Client client = new Client(survey.getClientQuestions(), null);
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        surveyResponse = new SurveyResponse(surveyListing, client, responses);

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        return gson.toJson(surveyResponse);
    }

    public String savePitResponse()
    {
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        pitResponse = new PitResponse("0, 0", responses);

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

        return gson.toJson(pitResponse);
    }

    public void loadUI()
    {
        try {
            if (surveyListing == null) {
                if (myActivity.getSurveyListing() == null)
                    return;
                else
                    surveyListing = myActivity.getSurveyListing();
            }

            ScrollView questionUI = generateQuestionUi(surveyListing);

            if (questionUI != null) {
                rootLayout.addView(questionUI);

                populateAnswers();
            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

}
