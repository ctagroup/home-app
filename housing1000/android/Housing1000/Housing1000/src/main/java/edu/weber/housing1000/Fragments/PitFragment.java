package edu.weber.housing1000.Fragments;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

import edu.weber.housing1000.Data.Client;
import edu.weber.housing1000.Data.Response;
import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyResponse;
import edu.weber.housing1000.Helpers.REST.RESTHelper;
import edu.weber.housing1000.Helpers.REST.SurveyService;
import edu.weber.housing1000.JSONParser;
import edu.weber.housing1000.PitActivity;
import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyFlowActivity;
import edu.weber.housing1000.UIGenerator;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;

/**
 * Created by Blake on 2/11/14.
 */
public class PitFragment extends SurveyAppFragment {
    public static final String EXTRA_SURVEY = "survey";
    ArrayList<Question> lstQuestions;   // List of all questions
    PitActivity myActivity;      // Parent activity
    private Survey survey;              // Current survey, questions and all
    private RelativeLayout rootLayout;  // Root layout of the fragment
    private SurveyListing surveyListing;
    private SurveyResponse surveyResponse;

    public PitFragment() {
    }

    public PitFragment(String name, String actionBarTitle) {
        super(name, actionBarTitle);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setHasOptionsMenu(true);

        // Restore the state after recreation
        if (savedInstanceState != null) {
            String surveyResponseJson = savedInstanceState.getString("surveyResponse");

            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            surveyResponse = gson.fromJson(surveyResponseJson, SurveyResponse.class);
        }
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

        loadUI();
    }

    public void loadUI() {
        if (surveyListing == null) {
            if (myActivity.getSurveyListing() == null)
                return;
            else
                surveyListing = myActivity.getSurveyListing();
        }

        lstQuestions = new ArrayList<Question>();

        survey = JSONParser.getSurveyFromListing(surveyListing);
        if (survey.getClientQuestions() != null) {
            lstQuestions.addAll(survey.getClientQuestions());

            // This is needed because we are displaying the client and survey questions on the same
            // page and some of the orderIds overlap
            for (Question q : survey.getSurveyQuestions()) {
                q.setOrderId(q.getOrderId() + survey.getClientQuestions().size());
            }
        }
        lstQuestions.addAll(survey.getSurveyQuestions());

        // Sort the questions by orderId
        Collections.sort(lstQuestions, new Comparator<Question>() {
            public int compare(Question q1, Question q2) {
                return q1.getOrderId() - q2.getOrderId();
            }
        });

        ScrollView view = UIGenerator.generateQuestionUi(myActivity, surveyListing, lstQuestions, survey);

        if (view != null) {
            rootLayout.addView(view);
        } else {
            new AlertDialog.Builder(myActivity).setTitle("Uh oh...").setMessage("Could not generate survey.\nPlease try again").create().show();
        }

        populateAnswers();
    }

    @Override
    public void onPause() {
        super.onPause();

        saveSurveyResponse();
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
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.menu_fragment_survey, menu);

        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.action_clear:
                clearButton();
                return true;
            case R.id.action_submit:
                submitButton();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);

        String jsonData = saveSurveyResponse();

        outState.putString("surveyResponse", jsonData);
    }

    /**
     * Handles the submit button click
     */
    public void submitButton() {
        AlertDialog.Builder builder = new AlertDialog.Builder(myActivity);
        builder.setMessage("Submit the survey response?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();

                saveAnswers();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        }).show();
    }

    /**
     * Handles the clear button click
     */
    public void clearButton() {
        AlertDialog.Builder builder = new AlertDialog.Builder(myActivity);
        builder.setMessage("Clear the survey answers?");
        builder.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                clearAnswers();
                dialog.dismiss();
            }
        });
        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        }).show();
    }

    /**
     * Clears all answers in the form
     */
    public void clearAnswers() {
        for (Question question : lstQuestions) {
            question.clearAnswer();
        }
    }

    /**
     * Performs any form validation
     *
     * @return True if valid
     */
    public boolean validateForm() {
        // TODO: Validate the form

        return true;
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
     * This compiles the responses from each question
     *
     * @param questions Questions from which to get the answers
     * @return List of Responses
     */
    private ArrayList<Response> generateResponses(ArrayList<Question> questions) {
        ArrayList<Response> responses = new ArrayList<Response>();

        for (Question question : questions) {
            Response response = new Response(question.getQuestionId(), question.getAnswer());

            responses.add(response);
        }

        return responses;
    }

    /**
     * Serializes the surveyResponse to JSON
     *
     * @return Survey response in JSON form
     */
    private String saveSurveyResponse() {
        Client client = new Client(survey.getClientQuestions(), null);
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        surveyResponse = new SurveyResponse(surveyListing, client, responses);

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        String jsonData = gson.toJson(surveyResponse);

        //Log.d("json", jsonData);

        return jsonData;
    }

    /**
     * Populates the answers in the form, for restoring state
     */
    private void populateAnswers() {
        if (surveyResponse != null) {
            Client client = surveyResponse.getClient();

            if (survey.getClientQuestions() != null) {
                for (Question question : survey.getClientQuestions()) {
                    switch (question.getParentRequiredAnswer()) {
                        case "ServicePointId":
                            if (client.servicePointId != 0)
                                question.setAnswer(String.valueOf(client.servicePointId));
                            break;
                        case "Last4SSN":
                            question.setAnswer(client.last4Ssn);
                            break;
                        case "Birthday":
                            question.setAnswer(client.birthday);
                            break;
                        default:
                            break;
                    }
                }

            }

            for (Response response : surveyResponse.getResponses()) {
                for (Question question : survey.getSurveyQuestions()) {
                    if (question.getQuestionId() == response.getQuestionId()) {
                        question.setAnswer(response.getAnswer());
                        break;
                    }
                }
            }

        }
    }

}
