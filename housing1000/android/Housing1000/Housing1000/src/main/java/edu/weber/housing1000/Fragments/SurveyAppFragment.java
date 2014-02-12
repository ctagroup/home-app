package edu.weber.housing1000.Fragments;


import android.support.v4.app.Fragment;

/**
 * Created by Blake on 2/11/14.
 */
public class SurveyAppFragment extends Fragment {
    private String _name;

    public String getName()
    {
        return _name;
    }

    public SurveyAppFragment(String name) {
        _name = name;
    }

}
