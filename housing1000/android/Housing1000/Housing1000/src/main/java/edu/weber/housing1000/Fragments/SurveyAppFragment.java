package edu.weber.housing1000.Fragments;


import android.os.Bundle;
import android.support.v4.app.Fragment;

/**
 * Created by Blake on 2/11/14.
 */
public class SurveyAppFragment extends Fragment {
    private String _name;
    private String _actionBarTitle;

    public String getName()
    {
        return _name;
    }

    public String getActionBarTitle()
    {
        return _actionBarTitle;
    }

    public SurveyAppFragment(String name, String actionBarTitle) {
        _name = name;
        _actionBarTitle = actionBarTitle;
    }

    public SurveyAppFragment() {}
}
