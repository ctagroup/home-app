package edu.weber.housing1000.fragments;

import android.app.AlertDialog;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.ScrollView;

import java.io.IOException;

import edu.weber.housing1000.EncampmentService;
import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyType;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.data.SurveyListing;
import edu.weber.housing1000.helpers.RESTHelper;
import edu.weber.housing1000.sqllite.DatabaseConnector;
import retrofit.Callback;
import retrofit.RestAdapter;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * @author David Horton
 */
public class EncampCreateNewFragment extends BaseSurveyFragment {

    private ProgressDialogFragment progressDialogFragment;
    private RelativeLayout rootLayout;

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

    private void getEncampmentQuestions() {

        if (!Utils.isOnline(this.getActivity())) {

            DatabaseConnector databaseConnector = new DatabaseConnector(this.getActivity().getBaseContext());
            String surveyJson = databaseConnector.queryForSavedSurveyJson(SurveyType.ENCAMPMENT_SURVEY, "0");

            if(surveyJson != null) {

                SurveyListing encampmentSurvey = new SurveyListing();
                encampmentSurvey.setJson(surveyJson);

                ScrollView questionUI = generateQuestionUi(encampmentSurvey);

                if (questionUI != null) {
                    rootLayout.addView(questionUI);
                }

            }
            else {
                Utils.showNoInternetDialog(this.getActivity(), true);
            }

            return;
        }

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
                        updateSurveyDatabase(json);

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

    private void updateSurveyDatabase(String json) {
        DatabaseConnector databaseConnector = new DatabaseConnector(this.getActivity().getBaseContext());
        databaseConnector.updateSurvey(SurveyType.ENCAMPMENT_SURVEY, json, "0");
    }

    @Override
    public void saveAnswersToDatabase() {
        //TODO finish this. I haven't done it yet, because there is no API to submit these, so they would just sit in the DB
    }

    @Override
    public String saveSurveyResponse() {
        //TODO finish this
        return null;
    }

    @Override
    public void saveAnswers() {
        //TODO finish this
    }

    private void displayErrorMessage() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this.getActivity());
        builder.setTitle(getString(R.string.uh_oh));
        builder.setMessage("There was a problem getting the encampment questions... Please try again.");
        Utils.centerDialogMessageAndShow(builder);
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
