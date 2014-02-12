package edu.weber.housing1000.Fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import java.util.ArrayList;

import edu.weber.housing1000.Data.Survey;
import edu.weber.housing1000.Data.SurveyListing;
import edu.weber.housing1000.Questions.Question;
import edu.weber.housing1000.R;

/**
 * Created by Blake on 2/11/14.
 */
public class SurveyFragment extends SurveyAppFragment {

    private Survey survey;
    private RelativeLayout rootLayout;

    ArrayList<Question> lstQuestions;

    public SurveyFragment(String name) {
        super(name);
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.activity_clnt_info_dynamic, container, false);

        return rootView;
    }
}
