package edu.weber.housing1000.Fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import edu.weber.housing1000.R;

/**
 * Created by Blake on 2/11/14.
 */
public class SignatureFragment extends SurveyAppFragment {

    public SignatureFragment(String name) {
        super(name);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_signature, container, false);

        return rootView;
    }
}
