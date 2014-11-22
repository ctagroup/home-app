package edu.weber.housing1000.fragments;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.app.ActionBar;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import edu.weber.housing1000.R;

/**
 * @author David Horton
 */
public class EncampMainFragment extends Fragment {

    private EditText searchWindow;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_encamp_main, container, false);

        ActionBar ab = ((android.support.v7.app.ActionBarActivity) this.getActivity()).getSupportActionBar();
        ab.setTitle("Encampment Sites");

        searchWindow = (EditText)rootView.findViewById(R.id.editText_encamp_search);

        searchWindow.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int i, KeyEvent keyEvent) {
                if (i == EditorInfo.IME_ACTION_DONE) {
                    getSearchResults();
                }
                return true;
            }
        });

        Button btnSearch = (Button)rootView.findViewById(R.id.btn_encamp_search);
        btnSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getSearchResults();
            }
        });

        Button btnCreateNew = (Button)rootView.findViewById(R.id.btn_encamp_create_new);
        btnCreateNew.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listener.createNewClicked();
            }
        });

        Button btnSiteVisit = (Button)rootView.findViewById(R.id.btn_encamp_site_survey);
        btnSiteVisit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                listener.encampmentVisitClicked();
            }
        });

        return rootView;
    }

    private void getSearchResults() {
        // Reset errors.
        searchWindow.setError(null);

        // Store values at the time of the search attempt.
        String searchQuery = searchWindow.getText().toString();

        boolean cancel = false;
        View focusView = null;

        // Check the validity of the fields
        if (TextUtils.isEmpty(searchQuery)) {
            searchWindow.setError(getString(R.string.error_field_required));
            focusView = searchWindow;
            cancel = true;
        }

        if (cancel) {
            // There was an error; don't attempt search and focus the first form field with an error.
            focusView.requestFocus();
        } else {
            listener.performSearch(searchQuery);
        }
    }

    /**
     * A listener for communicating with the container activity
     */
    public interface EncampMainFragmentListener {
        public void createNewClicked();
        public void encampmentVisitClicked();
        public void performSearch(String searchQuery);
    }

    private EncampMainFragmentListener listener;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        listener = (EncampMainFragmentListener) activity;
    }

    @Override
    public void onDetach() {
        super.onDetach();
        listener = null;
    }
}
