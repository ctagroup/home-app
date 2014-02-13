package edu.weber.housing1000.Fragments;

import android.animation.LayoutTransition;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.location.Location;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import edu.weber.housing1000.Data.Client;
import edu.weber.housing1000.Data.Response;
import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Data.SurveyResponse;
import edu.weber.housing1000.Helpers.REST.GetSurveys;
import edu.weber.housing1000.Helpers.REST.PostResponses;
import edu.weber.housing1000.JSONParser;
import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyFlowActivity;

/**
 * Created by Blake on 2/11/14.
 */
public class SurveyFragment extends SurveyAppFragment {

    private Survey survey;
    private RelativeLayout rootLayout;

    ArrayList<Question> lstQuestions;
    SurveyFlowActivity myActivity;

    private SurveyListing surveyListing;

    public SurveyFragment(String name) {
        super(name);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        myActivity = ((SurveyFlowActivity)getActivity());

        surveyListing = myActivity.getSurveyListing();

        setActionBarTitle(surveyListing.getTitle());

        setHasOptionsMenu(true);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View mainView = inflater.inflate(R.layout.fragment_survey, container, false);

        rootLayout = (RelativeLayout) mainView.findViewById(R.id.root_layout);

        generateQuestionUi();

        return mainView;
    }

    @Override
    public void onCreateOptionsMenu(Menu menu, MenuInflater inflater) {
        inflater.inflate(R.menu.survey, menu);

        super.onCreateOptionsMenu(menu, inflater);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId())
        {
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

    private void generateQuestionUi() {
        try {
            final ScrollView mainScrollView = new ScrollView(myActivity);
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            layoutParams.addRule(RelativeLayout.ABOVE, R.id.buttonsLinearLayout);
            mainScrollView.setLayoutParams(layoutParams);

            LinearLayout mainLinearLayout = new LinearLayout(myActivity);
            mainLinearLayout.setOrientation(LinearLayout.VERTICAL);
            LayoutTransition layoutTransition = new LayoutTransition();
            mainLinearLayout.setLayoutTransition(layoutTransition);
            mainScrollView.addView(mainLinearLayout);

            lstQuestions = new ArrayList<Question>();

            survey = JSONParser.getSurveyFromListing(surveyListing);
            lstQuestions.addAll(survey.getClientQuestions());

            // This is needed because we are displaying the client and survey questions on the same
            // page and some of the orderIds overlap
            for (Question q : survey.getSurveyQuestions())
            {
                q.setOrderId(q.getOrderId() + survey.getClientQuestions().size());
            }
            lstQuestions.addAll(survey.getSurveyQuestions());

            // Sort the questions by orderId
            Collections.sort(lstQuestions, new Comparator<Question>() {
                public int compare(Question q1, Question q2) {
                    return q1.getOrderId() - q2.getOrderId();
                }
            });

            List<String> lstPanels = new ArrayList<String>();

            //Get panel types
            for (Question q : lstQuestions) {
                if (!q.getGroup().isEmpty() && !lstPanels.contains(q.getGroup()))
                    lstPanels.add(q.getGroup());
            }

            LinearLayout[] panelViews = new LinearLayout[lstPanels.size()];
            Button[] buttons = new Button[lstPanels.size()];

            //Create buttons and panels
            for (int k = 0; k < lstPanels.size(); k++) {
                Button btn = new Button(myActivity);
                btn.setId(k);
                btn.setText(lstPanels.get(k));
                buttons[k] = btn;
                mainLinearLayout.addView(btn);

                LinearLayout panelView = new LinearLayout(myActivity);
                panelView.setId(k);
                panelView.setOrientation(LinearLayout.VERTICAL);
                panelViews[k] = panelView;
                mainLinearLayout.addView(panelView);
                if (k > 0)
                    panelView.setVisibility(View.GONE);
            }

            //Set Click Events for the buttons
            for (int k = 0; k < lstPanels.size(); k++) {
                final int localK = k;
                final LinearLayout[] localPanelViews = panelViews;
                final List<String> localLstPanels = lstPanels;
                buttons[k].setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        if (localPanelViews[localK].getVisibility() == View.VISIBLE) {
                            localPanelViews[localK].setVisibility(View.GONE);
                        } else {
                            localPanelViews[localK].setVisibility(View.VISIBLE);
                        }
                        for (int l = 0; l < localLstPanels.size(); l++) {
                            if (l != localK) {
                                localPanelViews[l].setVisibility(View.GONE);
                            }
                        }
                    }
                });
            }

            // Create question views and add them
            for (Question question : lstQuestions) {
                View questionView = question.createView(myActivity);

                if (questionView != null)
                {
                    if (lstPanels.size() > 0)
                    {
                        for (int k = 0; k < panelViews.length; k++) {
                            if (question.getGroup().equals(lstPanels.get(k))) {
                                panelViews[k].addView(questionView);
                            }
                        }
                    }
                    else
                    {
                        mainLinearLayout.addView(questionView);
                    }
                }
            }

//            // Temporary for testing
//            // TODO REMOVE THIS
//            if (survey.getSurveyId() == 1)
//            {
//                for (Question q : lstQuestions)
//                {
//                    if (q.getQuestionId() == 2)
//                    {
//                        q.setParentQuestionId(3);
//                        q.setParentRequiredAnswer("1234");
//                    }
//                    else if (q.getQuestionId() == 3)
//                    {
//                        q.setParentQuestionId(1);
//                        q.setParentRequiredAnswer("1234");
//                    }
//
//                }
//            }

            // Set up question dependencies
            Set<Question> dependencies = new HashSet<Question>();

            for (Question question : lstQuestions) {
                if (question.getParentQuestionId() > 0)
                {
                    for (Question q : lstQuestions)
                    {
                        if (q.getQuestionId() == question.getParentQuestionId())
                        {
                            q.addDependent(question);
                            dependencies.add(q);
                            break;
                        }
                    }
                }
            }

            // Set click listeners on the parent questions so the answers will be compared
            for (Question question : dependencies)
            {
                question.hookUpDependents();
            }

            rootLayout.addView(mainScrollView);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

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

    public void clearButton() {
        AlertDialog.Builder builder = new AlertDialog.Builder(myActivity);
        builder.setMessage("Clear the form?");
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

    public void clearAnswers() {
        for (Question question : lstQuestions)
        {
            question.clearAnswer();
        }
    }

    public boolean validateForm()
    {
        // TODO: Validate the form

        return true;
    }

    public void saveAnswers() {
        if (validateForm())
        {
            Client client = new Client(survey.getClientQuestions(), getLocation());
            ArrayList<Response> responses = generateResponses(survey.getSurveyQuestions());
            SurveyResponse surveyResponse = new SurveyResponse(surveyListing, client, responses);

            // Output the survey responses to JSON
            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            String jsonData = gson.toJson(surveyResponse);

            Log.d("json", jsonData);

            // Start the survey submission dialog
            ProgressDialog progressDialog = new ProgressDialog(myActivity);
            progressDialog = new ProgressDialog(myActivity);
            progressDialog.setTitle("Please Wait");
            progressDialog.setMessage("Submitting survey responses...");
            progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
            progressDialog.setIndeterminate(true);
            progressDialog.setCancelable(false);

            myActivity.setProgressDialog(progressDialog);
            myActivity.getProgressDialog().show();

            PostResponses.PostSurveyResponsesTask task = new PostResponses.PostSurveyResponsesTask(myActivity, myActivity, surveyResponse);
            task.execute("https://staging.ctagroup.org/Survey/api");
        }
    }

    /**
     * This compiles the responses from each question
     * @param questions Questions from which to get the answers
     * @return List of Responses
     */
    private  ArrayList<Response> generateResponses(ArrayList<Question> questions)
    {
        ArrayList<Response> responses = new ArrayList<Response>();

        for (Question question : questions)
        {
            Response response = new Response(question.getQuestionId(), question.getAnswer());

            responses.add(response);
        }

        return responses;
    }

    // TODO: FINISH THIS
    public Location getLocation()
    {
        LocationManager locationManager = (LocationManager) myActivity.getSystemService(Context.LOCATION_SERVICE);

        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER))
            return locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        else if (locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER))
            return locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
        else if (locationManager.isProviderEnabled(LocationManager.PASSIVE_PROVIDER))
            return locationManager.getLastKnownLocation(LocationManager.PASSIVE_PROVIDER);
        else
            return null;
    }

}
