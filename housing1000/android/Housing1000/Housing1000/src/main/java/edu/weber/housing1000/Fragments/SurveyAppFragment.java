package edu.weber.housing1000.Fragments;


import android.os.Bundle;
import android.support.v4.app.Fragment;

/**
 * Created by Blake on 2/11/14.
 */
public class SurveyAppFragment extends Fragment {
    private String _name = "NONAME";
    private String _actionBarTitle = "NOTITLE";

    public String getName()
    {
        return _name;
    }

    public String getActionBarTitle()
    {
        return _actionBarTitle;
    }

    public SurveyAppFragment() {
        updateName();
    }

    public void updateName()
    {
        Bundle args = getArguments();

        if (args != null) {
            _name = args.getString("name");
            _actionBarTitle = args.getString("title");
        }
    }
}
