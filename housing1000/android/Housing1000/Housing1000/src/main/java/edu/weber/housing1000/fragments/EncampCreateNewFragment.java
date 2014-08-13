package edu.weber.housing1000.fragments;

import android.animation.LayoutTransition;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import edu.weber.housing1000.EncampmentService;
import edu.weber.housing1000.JSONParser;
import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.data.Survey;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.questions.Question;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * @author David Horton
 */
public class EncampCreateNewFragment extends Fragment {

    private ProgressDialogFragment progressDialogFragment;
    private RelativeLayout rootLayout;
    private ArrayList<Question> lstQuestions;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_survey, container, false);

        setHasOptionsMenu(true);

        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Create New Site");

        rootLayout = (RelativeLayout) rootView.findViewById(R.id.root_layout);

        getEncampmentQuestions();

        return rootView;
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
                //submitButton(); //TODO post encampment answers
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
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

    private void getEncampmentQuestions() {

        // Start the loading dialog
        showProgressDialog(getString(R.string.please_wait), "Downloading new encampment site questions...", "");

        RestAdapter restAdapter = RESTHelper.setUpRestAdapterNoDeserialize(this.getActivity(), null);

        EncampmentService service = restAdapter.create(EncampmentService.class);

        service.getEncampmentQuestions(new Callback<String>() {
            @Override
            public void success(String s, Response response) {
                dismissDialog();
                try {
                    String json = RESTHelper.convertStreamToString(response.getBody().in());
                    SurveyListing encampmentSurvey = new SurveyListing();

                    if (!json.isEmpty()) {
                        encampmentSurvey.setJson(json);

                        ScrollView questionUI = generateQuestionUi(encampmentSurvey);

                        if (questionUI != null) {
                            rootLayout.addView(questionUI);
                        }

                    } else {
                        displayErrorMessage();
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                    displayErrorMessage();
                }
            }

            @Override
            public void failure(RetrofitError error) {
                dismissDialog();
                error.printStackTrace();
                displayErrorMessage();
            }
        });
    }

    private void displayErrorMessage() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this.getActivity());
        builder.setTitle(getString(R.string.uh_oh));
        builder.setMessage("There was a problem getting the encampment questions... Please try again.");
        Utils.centerDialogMessageAndShow(builder);
    }

    /**
     * Sets up the UI elements for the survey form
     */
    protected ScrollView generateQuestionUi(SurveyListing listing) {
        try {

            lstQuestions = new ArrayList<>();

            Survey survey = JSONParser.getSurveyFromListing(listing);
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

            List<String> lstPanels = new ArrayList<>();

            //Get panel types
            for (Question q : lstQuestions) {
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
            for (Question question : lstQuestions) {
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

            for (Question question : lstQuestions) {
                if (question.getParentQuestionId() > 0) {
                    for (Question q : lstQuestions) {
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

            return mainScrollView;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    /**
     * @param title Title displayed
     * @param message Message displayed
     * @param tag The tag for the dialog
     */
    private void showProgressDialog(String title, String message, String tag) {
        progressDialogFragment = ProgressDialogFragment.newInstance(title, message);
        progressDialogFragment.show(this.getActivity().getSupportFragmentManager(), tag);
    }

    /**
     * Dismiss the logging in dialog
     */
    private void dismissDialog() {
        if (progressDialogFragment != null) {
            progressDialogFragment.dismiss();
        }
    }


}
