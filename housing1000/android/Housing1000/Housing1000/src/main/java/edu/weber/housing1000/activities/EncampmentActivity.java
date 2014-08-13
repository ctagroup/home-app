package edu.weber.housing1000.activities;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import edu.weber.housing1000.R;
import edu.weber.housing1000.Utils;
import edu.weber.housing1000.data.EncampmentSite;
import edu.weber.housing1000.fragments.EncampCreateNewFragment;
import edu.weber.housing1000.fragments.EncampDetailsFragment;
import edu.weber.housing1000.fragments.EncampMainFragment;
import edu.weber.housing1000.fragments.EncampSearchFragment;

/**
 * @author David Horton
 */
public class EncampmentActivity extends ActionBarActivity
        implements EncampMainFragment.EncampMainFragmentListener,
        EncampSearchFragment.EncampSearchFragmentListener {

    public static final String ENCAMP_SEARCH_BUNDLE_TAG = "ENCAMP_SEARCH";
    public static final String ENCAMP_DETAILS_BUNDLE_TAG = "ENCAMP_DETAILS";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_encampment);
        Utils.setActionBarColorToDefault(this);

        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.encampmentContainer, new EncampMainFragment(), "EncampMainFragment")
                    .commit();
        }
    }

    @Override
    public void createNewClicked() {

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.encampmentContainer, new EncampCreateNewFragment())
                .addToBackStack(null)
                .commit();
    }

    @Override
    public void performSearch(String searchQuery) {

        EncampSearchFragment searchFragment = new EncampSearchFragment();

        Bundle arguments = new Bundle();
        arguments.putString(ENCAMP_SEARCH_BUNDLE_TAG, searchQuery);
        searchFragment.setArguments(arguments);

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.encampmentContainer, searchFragment)
                .addToBackStack(null)
                .commit();
    }

    @Override
    public void onEncampmentSelected(EncampmentSite selectedSite) {

        EncampDetailsFragment detailsFragment = new EncampDetailsFragment();

        Bundle arguments = new Bundle();
        arguments.putSerializable(ENCAMP_DETAILS_BUNDLE_TAG, selectedSite);
        detailsFragment.setArguments(arguments);

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.encampmentContainer, detailsFragment)
                .addToBackStack(null)
                .commit();
    }


}
