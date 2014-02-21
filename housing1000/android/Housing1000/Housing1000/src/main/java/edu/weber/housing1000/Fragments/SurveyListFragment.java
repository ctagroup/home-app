package edu.weber.housing1000.Fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;
import android.widget.TextView;

import edu.weber.housing1000.R;
import edu.weber.housing1000.SurveyListActivity;

/**
 * A placeholder fragment containing a simple view.
 */
public class SurveyListFragment extends Fragment {

    public ListView surveysListView;
    public TextView noSurveysTextView;

    public SurveyListFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_survey_list, container, false);

        surveysListView = (ListView) rootView.findViewById(R.id.surveysListView);
        noSurveysTextView = (TextView) rootView.findViewById(R.id.noSurveysTextView);

        if (getActivity() instanceof ISurveyListFragment)
        {
            ((ISurveyListFragment) getActivity()).setListView(surveysListView);
        }

        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Select a Survey");

        showNoSurveys(false);

        return rootView;
    }

    public interface ISurveyListFragment
    {
        public void setListView(ListView view);
    }

    public void showNoSurveys(boolean show)
    {
        if (show)
            noSurveysTextView.setVisibility(View.VISIBLE);
        else
            noSurveysTextView.setVisibility(View.GONE);
    }
}