package edu.weber.housing1000.fragments;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;

import edu.weber.housing1000.JSONParser;
import edu.weber.housing1000.SurveyType;
import edu.weber.housing1000.activities.PitActivity;
import edu.weber.housing1000.data.Client;
import edu.weber.housing1000.data.PitResponse;
import edu.weber.housing1000.data.Response;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyResponse;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyService;
import edu.weber.housing1000.helpers.SharedPreferencesHelper;
import edu.weber.housing1000.sqlite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;

/**
 * @author Blake
 */
public class PitFragment extends BaseSurveyFragment {
    private PitActivity myActivity;      // Parent activity
    private ArrayList<PitResponse> pitResponse = new ArrayList<>();
    private ArrayList<Survey> surveyQuestions = new ArrayList<>();
    private int householdMemberCount = 1;

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
    public void saveAnswersToDatabase() {
        saveSurveyResponse();
        String pitJsonToSubmit = savePitResponse();

        DatabaseConnector databaseConnector = new DatabaseConnector(this.getActivity().getBaseContext());
        databaseConnector.saveSurveyToSubmitLater(pitJsonToSubmit, SurveyType.PIT_SURVEY, "0");

        myActivity.onSavePitSurveyResponsesToDatabase();
    }

    @Override
    public String saveSurveyResponse() {
        Client client = new Client(survey.getClientQuestions(), null);
        ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
        surveyResponse = new SurveyResponse(surveyListing, client, responses, SharedPreferencesHelper.getUserId(myActivity));

        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        return gson.toJson(surveyResponse);
    }

    public String savePitResponse() {
        for(Survey survey : surveyQuestions) {
            ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
            PitResponse current = new PitResponse(PitActivity.getLatitude() + ", " + PitActivity.getLongitude(), responses, SharedPreferencesHelper.getUserId(myActivity));
            pitResponse.add(current);
        }

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

            final ScrollView questionUI = generateQuestionUi(surveyListing);

            if(surveyQuestions.size() == 0) {
                surveyQuestions.add(survey);
            }

            if (questionUI != null) {
                final LinearLayout mainLinearLayout = (LinearLayout) questionUI.getChildAt(0);

                mainLinearLayout.addView(getNewHouseholdLabelLayout(), 0);

                final Button btnToAddMoreQuestions = new Button(myActivity, null, R.style.ButtonText);
                btnToAddMoreQuestions.setText(getString(R.string.btn_pit_add_household_member));
                btnToAddMoreQuestions.setTextSize(18);
                btnToAddMoreQuestions.setGravity(Gravity.CENTER_HORIZONTAL);
                btnToAddMoreQuestions.setTextColor(Color.parseColor("white"));
                if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                    btnToAddMoreQuestions.setBackground(getResources().getDrawable(R.drawable.btn_positive));
                }
                else {
                    btnToAddMoreQuestions.setBackgroundResource(R.drawable.btn_positive);
                }
                btnToAddMoreQuestions.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Survey newSetOfSameQuestions = JSONParser.getSurveyFromListing(surveyListing);
                        surveyQuestions.add(newSetOfSameQuestions);

                        //Remove the button to add another household member at the bottom of the survey before adding new questions
                        mainLinearLayout.removeViewAt(mainLinearLayout.getChildCount() - 1);

                        //Add a label in between sets of questions to distinguish household members
                        mainLinearLayout.addView(getNewHouseholdLabelLayout());

                        //Add the new set of questions to the survey UI
                        addSurveyQuestionsToLinearLayout(mainLinearLayout, newSetOfSameQuestions);

                        //Once the new questions are added, add the button to add more questions back onto the bottom of the survey
                        mainLinearLayout.addView(btnToAddMoreQuestions);
                    }
                });
                mainLinearLayout.addView(btnToAddMoreQuestions);


                rootLayout.addView(questionUI);

                populateAnswers();
            }
        } catch (Exception ex)
        {
            ex.printStackTrace();
        }
    }

    private LinearLayout getNewHouseholdLabelLayout() {
        LinearLayout householdMemberSeparator = new LinearLayout(myActivity);
        householdMemberSeparator.setBackgroundColor(getResources().getColor(R.color.action_bar));


        TextView text = new TextView(myActivity);
        text.setPadding(8, 5, 8, 5);
        text.setTextSize(15);
        text.setTextColor(Color.parseColor("white"));
        text.setText("Household Member #" + householdMemberCount++);

        householdMemberSeparator.addView(text);

        return householdMemberSeparator;
    }

}
