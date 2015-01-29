package org.ctagroup.homeapp.fragments;

import android.animation.LayoutTransition;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
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

import org.ctagroup.homeapp.JSONParser;
import org.ctagroup.homeapp.data.Client;
import org.ctagroup.homeapp.data.Response;
import org.ctagroup.homeapp.data.Survey;
import org.ctagroup.homeapp.data.SurveyListing;
import org.ctagroup.homeapp.data.SurveyResponse;
import org.ctagroup.homeapp.questions.Question;
import org.ctagroup.homeapp.R;
import org.ctagroup.homeapp.Utils;

/**
 * @author Blake
 */
public abstract class BaseSurveyFragment extends SurveyAppFragment {
    private ArrayList<Question> lstQuestions = new ArrayList<>();   // List of all questions
    protected Survey survey;              // Current survey, questions and all
    protected RelativeLayout rootLayout;  // Root layout of the fragment
    protected SurveyListing surveyListing;
    protected SurveyResponse surveyResponse;

    // Abstract Methods

    /**
     * Saves the answers and starts the submission task
     */
    public abstract void saveAnswers();

    /**
     * In the case of the internet being unavailable, this is to save the answers to the database
     */
    public abstract void saveAnswersToDatabase();

    /**
     * Serializes the surveyResponse to JSON
     *
     * @return Survey response in JSON form
     */
    public abstract String saveSurveyResponse();

    // End Abstract Methods

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
        Utils.hideSoftKeyboard(getActivity());

        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setMessage(getString(R.string.submit_survey_response));
        builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();

                if (Utils.isOnline(getActivity()))
                {
                    saveAnswers();
                }
                else
                {
                    saveAnswersToDatabase();
                }

            }
        });
        builder.setNegativeButton(getString(R.string.no), new DialogInterface.OnClickListener() {
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
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        builder.setMessage(getString(R.string.clear_survey_answers));
        builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                clearAnswers();
                dialog.dismiss();
            }
        });
        builder.setNegativeButton(getString(R.string.no), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        Utils.centerDialogMessageAndShow(builder);
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
        // Form validation is done by limiting the characters
        // that can be input into an answer field.  This is
        // controlled on question creation.

        // If there becomes required fields, then that will need
        // to be handled here.

        return true;
    }

    /**
     * This compiles the responses from each question
     * @param questions Questions from which to get the answers
     * @return List of Responses
     */
    protected ArrayList<Response> generateResponses(ArrayList<Question> questions) {
        ArrayList<Response> responses = new ArrayList<>();

        for (Question question : questions) {
            Response response = new Response(question.getQuestionId(), filterOutBadCharactersFromAnswer(question.getAnswer()));

            responses.add(response);
        }

        return responses;
    }

    /**
     * TODO This is only temporary! Remove this!
     * It looks like the back-end currently does not handle single quotes correctly (probably when trying to insert into the database),
     * so as an emergency quick-fix, we are simply stripping out all apostrophes. Once this is fixed in the backend we should remove this function.
     * @param answer The answer to purge of bad things
     * @return The purified answer
     */
    private String filterOutBadCharactersFromAnswer(String answer) {
        if(answer != null) {
            return answer.replaceAll("'", "");
        }
        else {
            return null;
        }
    }

    /**
     * Populates the answers in the form, for restoring state
     */
    protected void populateAnswers() {
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

    /**
     * Sets up the UI elements for the survey form
     */
    protected ScrollView generateQuestionUi(SurveyListing listing) {
        try {

            this.survey = JSONParser.getSurveyFromJson(listing.getJson());

            final ScrollView mainScrollView = new ScrollView(getActivity());
            RelativeLayout.LayoutParams layoutParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT);
            mainScrollView.setLayoutParams(layoutParams);

            LinearLayout mainLinearLayout = new LinearLayout(getActivity());
            mainLinearLayout.setOrientation(LinearLayout.VERTICAL);

            float upDownMargin = getResources().getDimension(R.dimen.margin_small);
            float leftRightMargin = getResources().getDimension(R.dimen.margin_medium);
            mainLinearLayout.setPadding((int) leftRightMargin, (int) upDownMargin, (int) leftRightMargin, (int) upDownMargin);

            // Fade in/out effect is for Honeycomb and up
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
                LayoutTransition layoutTransition = new LayoutTransition();
                mainLinearLayout.setLayoutTransition(layoutTransition);
            }

            mainScrollView.addView(mainLinearLayout);

            addSurveyQuestionsToLinearLayout(mainLinearLayout, survey);

            return mainScrollView;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public void addSurveyQuestionsToLinearLayout(LinearLayout mainLinearLayout, Survey surveyToAddFrom) {

        ArrayList<Question> questionsToAdd = new ArrayList<>();

        if (surveyToAddFrom.getClientQuestions() != null) {
            questionsToAdd.addAll(surveyToAddFrom.getClientQuestions());

            // This is needed because we are displaying the client and survey questions on the same
            // page and some of the orderIds overlap
            for (Question q : surveyToAddFrom.getSurveyQuestions()) {
                q.setOrderId(q.getOrderId() + surveyToAddFrom.getClientQuestions().size());
            }
        }
        questionsToAdd.addAll(surveyToAddFrom.getSurveyQuestions());

        lstQuestions.addAll(questionsToAdd);

        // Sort the questions by orderId
        Collections.sort(questionsToAdd, new Comparator<Question>() {
            public int compare(Question q1, Question q2) {
                return q1.getOrderId() - q2.getOrderId();
            }
        });

        List<String> lstPanels = new ArrayList<>();

        //Get panel types
        for (Question q : questionsToAdd) {
            if (!q.getGroup().isEmpty() && !lstPanels.contains(q.getGroup()))
                lstPanels.add(q.getGroup());
        }

        LinearLayout[] panelViews = new LinearLayout[lstPanels.size()];
        Button[] buttons = new Button[lstPanels.size()];

        //Create buttons and panels
        for (int k = 0; k < lstPanels.size(); k++) {
            Button btn = new Button(getActivity());
            btn.setId(k);
            btn.setText(lstPanels.get(k));
            buttons[k] = btn;
            mainLinearLayout.addView(btn);

            LinearLayout panelView = new LinearLayout(getActivity());
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
        for (Question question : questionsToAdd) {
            View questionView = question.createView(getActivity());

            if (questionView != null) {
                if (lstPanels.size() > 0) {
                    for (int k = 0; k < panelViews.length; k++) {
                        if (question.getGroup().equals(lstPanels.get(k))) {
                            panelViews[k].addView(questionView);
                        }
                    }
                } else {
                    mainLinearLayout.addView(questionView);
                }
            }
        }

        // Set up question dependencies
        Set<Question> dependencies = new HashSet<>();

        for (Question question : questionsToAdd) {
            if (question.getParentQuestionId() > 0) {
                for (Question q : questionsToAdd) {
                    if (q.getQuestionId() == question.getParentQuestionId()) {
                        q.addDependent(question);
                        dependencies.add(q);
                        break;
                    }
                }
            }
        }

        // Set click listeners on the parent questions so the answers will be compared
        for (Question question : dependencies) {
            question.hookUpDependents();
        }
    }


}
