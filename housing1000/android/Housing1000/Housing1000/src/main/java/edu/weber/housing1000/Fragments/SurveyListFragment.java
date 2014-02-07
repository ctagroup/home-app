package edu.weber.housing1000.Fragments;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import edu.weber.housing1000.R;

/**
 * A placeholder fragment containing a simple view.
 */
public class SurveyListFragment extends Fragment {

    public ListView surveysListView;

    public SurveyListFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_survey_list, container, false);

        surveysListView = (ListView) rootView.findViewById(R.id.surveysListView);

        if (getActivity() instanceof ISurveyListFragment)
        {
            ((ISurveyListFragment) getActivity()).setListView(surveysListView);
        }


        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Select a Survey");

        return rootView;
    }

    public interface ISurveyListFragment
    {
        public void setListView(ListView view);
    }
}